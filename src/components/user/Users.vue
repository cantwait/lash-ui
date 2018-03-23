<template>
  <v-layout row>
    <v-flex >
      <v-card>
        <v-list two-line subheader>
          <v-subheader inset>Usuarios</v-subheader>
          <template v-for="(item,index) in users">
            <v-list-tile avatar  v-bind:key="item.id" >
              <v-list-tile-avatar>
                <v-icon v-bind:class="[iconClass]">{{ icon }}</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>{{ item.name }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ item.email }}</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-btn icon ripple @click.stop="onOpenSessions(item)">
                  <v-icon color="black lighten-1">list</v-icon>
                </v-btn>
              </v-list-tile-action>
              <v-list-tile-action>
                <v-btn icon ripple @click.stop="onOpenEditDialog(item)">
                  <v-icon color="black lighten-1">edit</v-icon>
                </v-btn>
              </v-list-tile-action>
              <v-list-tile-action>
                <v-btn icon ripple @click.stop="onOpenDeleteDialog(item)">
                  <v-icon color="black lighten-1">delete</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider v-if="index + 1 < users.length" v-bind:key="index"></v-divider>
          </template>
        </v-list>
      </v-card>
      <v-container>
        <v-layout justify-center align-center>
          <v-btn @click.stop="onLoadMore" flat :loading="loading">Cargar más</v-btn>
        </v-layout>
      </v-container>
      <v-card-text style="height: 100px; position: relative">
      <v-btn
        absolute
        dark
        fab
        top
        right
        color="primary"
        @click.stop="onNewUser"
        >
        <v-icon>add</v-icon>
      </v-btn>
      </v-card-text>
    </v-flex>
    <!-- delete diaglo -->
    <!-- <v-dialog v-model="dialogDelete" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Esta seguro de esta acción?</v-card-title>
        <v-card-text>Tenga en cuenta que esta acción no se puede reversar.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" flat @click.native="onDeletePerson">Si</v-btn>
          <v-btn color="blue darken-1" flat @click.native="dialogDelete = !dialogDelete">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->
     <!-- delete diaglo -->
    <template v-if="dialogDelete">
      <lash-delete-dialog :deleteDialog="dialogDelete" @on-action-performed="onDeletePerson"></lash-delete-dialog>
    </template>
    <!-- new/edit user  -->
    <app-user-add-form-dialog/>
    <template v-if="dialogEdit && user">
      <app-user-edit-form-dialog :isEditDialogOpen="dialogEdit" @on-edit-action="onUserEdited" :user="user"/>
    </template>
    <!-- sessions history dialog -->
    <template v-if="isSessionDialogOpened">
      <lash-user-sessions :sessionsDialog="isSessionDialogOpened" :user="user" @on-action-performed="onSessionDialogAction"></lash-user-sessions>
    </template>
  </v-layout>
</template>
<script>
import utils from '../../utils';
import UserSessions from './UserSessions';

export default {
  data() {
    return {
      userToDelete: null,
      dialogDelete: false,
      dialogEdit: false,
      user: null,
      iconClass: 'grey lighten-1 white--text',
      icon: 'person',
      isSessionDialogOpened: false,
      query: {
        page: 1,
        perPage: 5,
      },
    };
  },
  computed: {
    loading() {
      return this.$store.getters.loading;
    },
    users() {
      return this.$store.getters.users;
    },
  },
  created() {
    if (this.query.page !== 1) {
      this.query.page = 1;
    }
    this.$store.dispatch('getUsers', this.query);
  },
  methods: {
    onOpenSessions(item) {
      this.user = item;
      this.isSessionDialogOpened = !this.isSessionDialogOpened;
    },
    onSessionDialogAction() {
      this.isSessionDialogOpened = !this.isSessionDialogOpened;
    },
    onDeletePerson(result) {
      utils.log('onDeletePerson: %s', result);
      if (result && this.userToDelete) {
        utils.log('user to delete: %s', this.userToDelete);
        this.$store.dispatch('deleteUser', this.userToDelete.id);
        this.userToDelete = null;
      }
      this.dialogDelete = !this.dialogDelete;
    },
    onOpenEditDialog(editUser) {
      this.user = editUser;
      this.dialogEdit = !this.dialogEdit;
    },
    onUserEdited() {
      this.dialogEdit = !this.dialogEdit;
    },
    onLoadMore() {
      this.query.page += 1;
      this.$store.dispatch('getUsers', this.query);
    },
    onOpenDeleteDialog(selectedUser) {
      utils.log('selecting user to delete: %s', JSON.stringify(selectedUser));
      this.dialogDelete = !this.dialogDelete;
      this.userToDelete = selectedUser;
    },
    onNewUser() {
      this.$store.commit('setNewUserDialog', true);
    },
  },
  components: {
    'lash-user-sessions': UserSessions,
  },
};
</script>