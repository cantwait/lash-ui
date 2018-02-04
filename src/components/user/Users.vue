<template>
  <v-layout row>
    <v-flex >
      <v-card>
        <v-list two-line subheader>
          <v-subheader inset>Usuarios</v-subheader>
          <v-list-tile avatar v-for="item in users" v-bind:key="item.id" >
            <v-list-tile-avatar>
              <v-icon v-bind:class="[iconClass]">{{ icon }}</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.name }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ item.email }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn icon ripple>
                <v-icon color="blue lighten-1" @click.stop="onEditUser">edit</v-icon>
              </v-btn>
            </v-list-tile-action>
            <v-list-tile-action>
              <v-btn icon ripple @click.stop="onDeleteWithModal(item)">
                <v-icon color="red lighten-1">delete</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-card>
      <v-container>
        <v-layout justify-center align-center>
          <v-btn @click.stop="onLoadMore" flat :loading="loading">Cargar más</v-btn>
        </v-layout>
      </v-container>
    </v-flex>
    <v-btn
      fab
      bottom
      right
      color="pink"
      dark
      fixed
      @click.stop="onNewUser"
    >
      <v-icon>add</v-icon>
    </v-btn>
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
    <app-user-add-update-dialog :user="user"/>
  </v-layout>
</template>
<script>
  export default {
    data() {
      return {
        userToDelete: null,
        dialogDelete: false,
        cuDialog: false,
        user: null,
        iconClass: 'grey lighten-1 white--text',
        icon: 'person',
        items: [
          { icon: 'person', iconClass: 'grey lighten-1 white--text', id: 1, title: 'Rafael Cadenas', subtitle: 'Jan 9, 2014' },
          { icon: 'person', iconClass: 'grey lighten-1 white--text', id: 2, title: 'Estefany Alvarado', subtitle: 'Jan 17, 2014' },
          { icon: 'person', iconClass: 'grey lighten-1 white--text', id: 3, title: 'Eduardo Peña', subtitle: 'Jan 28, 2014' },
        ],
      };
    },
    computed: {
      loading() {
        return this.$store.getters.loading;
      },
      users() {
        debugger;
        return this.$store.getters.users;
      },
    },
    created() {
      this.$store.dispatch('getUsers');
    },
    methods: {
      onDeletePerson() {
        console.log('persona eliminada');
        if (this.userToDelete) {
          this.$store.dispatch('deleteUser', this.userToDelete);
          this.dialogDelete = !this.dialogDelete;
        }
      },
      onEditPerson() {

      },
      onLoadMore() {
        this.$store.dispatch('loadMore');
      },
      onDeleteWithModal(selectedUser) {
        console.log('deleting user with id: %s', selectedUser.id);
        this.dialogDelete = !this.dialogDelete;
        this.userToDelete = selectedUser.id;
      },
      onNewUser() {
        console.log('creando usuario');
        this.$store.commit('setNewUserDialog', true);
      },
    },
  };
</script>