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
                <v-btn icon ripple @click.stop="onOpenEditDialog(item)">
                  <v-icon color="blue lighten-1">edit</v-icon>
                </v-btn>
              </v-list-tile-action>
              <v-list-tile-action>
                <v-btn icon ripple @click.stop="onOpenDeleteDialog(item)">
                  <v-icon color="red lighten-1">delete</v-icon>
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
        color="pink"
        @click.stop="onNewUser"
        >
        <v-icon>add</v-icon>
      </v-btn>
      </v-card-text>
    </v-flex>
    <!-- delete diaglo -->
    <v-dialog v-model="dialogDelete" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Esta seguro de esta acción?</v-card-title>
        <v-card-text>Tenga en cuenta que esta acción no se puede reversar.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" flat @click.native="onDeletePerson">Si</v-btn>
          <v-btn color="blue darken-1" flat @click.native="dialogDelete = !dialogDelete">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- new/edit user  -->
    <app-user-add-form-dialog/>
    <template v-if="user">
      <app-user-edit-form-dialog :user="user"/>
    </template>
  </v-layout>
</template>
<script>
  export default {
    data() {
      return {
        userToDelete: null,
        dialogDelete: false,
        user: null,
        iconClass: 'grey lighten-1 white--text',
        icon: 'person',
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
      onDeletePerson() {
        if (this.userToDelete) {
          this.$store.dispatch('deleteUser', this.userToDelete);
          this.dialogDelete = !this.dialogDelete;
        }
      },
      onOpenEditDialog(editUser) {
        this.user = editUser;
        this.$store.commit('setEditUserDialog', true);
      },
      onLoadMore() {
        this.query.page += 1;
        this.$store.dispatch('getUsers', this.query);
      },
      onOpenDeleteDialog(selectedUser) {
        this.dialogDelete = !this.dialogDelete;
        this.userToDelete = selectedUser.id;
      },
      onNewUser() {
        this.$store.commit('setNewUserDialog', true);
      },
    },
  };
</script>