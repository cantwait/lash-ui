<template>
<v-app>
    <v-navigation-drawer
      temporary
      fixed
      v-model="drawer"
      app
    >
      <v-list dense>
        <v-list-tile v-for="m in menus" :key="m.title" :to="m.link">
          <v-list-tile-action>
            <v-icon medium>{{ m.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ m.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed app >
      <v-toolbar-side-icon @click.stop="drawer = !drawer" class="hidden-md-and-up"></v-toolbar-side-icon>
      <v-toolbar-title>Lalalash icon here</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat v-for="m in menus" :key="m.title" :to="m.link">
          <v-icon left>{{ m.icon }}</v-icon>
            {{ m.title }}
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout
          justify-center
          align-center
        >
          <router-view></router-view>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer app>
      <span>&copy; 2017</span>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    data() {
      return {
        drawer: false,
        menus: [
          { title: 'home', link: '/', icon: 'fa-home' },
          { title: 'Entrar', link: '/signin', icon: 'fa-sign-in' },
          { title: 'Registrarse', link: '/signup', icon: 'fa-user-plus' },
        ],
      };
    },
  };
</script>
