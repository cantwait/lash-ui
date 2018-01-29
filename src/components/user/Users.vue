<template>
  <v-layout row>
    <v-flex >
      <v-card>
        <v-list two-line subheader>
          <v-subheader inset>Usuarios</v-subheader>
          <v-list-tile avatar v-for="item in items" v-bind:key="item.title" >
            <v-list-tile-avatar>
              <v-icon v-bind:class="[item.iconClass]">{{ item.icon }}</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>
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
      @click.stop="dialog = !dialog"
    >
      <v-icon>add</v-icon>
    </v-btn>
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Esta seguro de esta acción?</v-card-title>
        <v-card-text>Tenga en cuenta que esta acción no se puede reversar.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" flat @click.native="onDeletePerson">Si</v-btn>
          <v-btn color="blue darken-1" flat @click.native="dialog = !dialog">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
  export default {
    data() {
      return {
        userToDelete: null,
        dialogDelete: false,
        dialogNew: false,
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
        console.log('cargando objetos...');
        this.$store.dispatch('loadMore');
      },
      onDeleteWithModal(selectedUser) {
        console.log('deleting user with id: %s', selectedUser.id);
        this.dialogDelete = !this.dialogDelete;
        this.userToDelete = selectedUser.id;
      },
    },
  };
</script>