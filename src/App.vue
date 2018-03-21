<template>
<v-app>
    <v-navigation-drawer
      temporary
      fixed
      v-model="drawer"
      app
    >
      <v-list dense>
        <template v-for="(item, i) in items">
          <v-list-group v-if="item.children" v-bind:key="i" :value="item.active" no-action>
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ item.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile slot="item">
              <v-list-tile-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ item.text }}
                </v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon>keyboard_arrow_down</v-icon>
              </v-list-tile-action>
            </v-list-tile>
            <v-list-tile :to="child.link"
              v-for="(child,j) in item.children"
              :key="j">
              <v-list-tile-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ child.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
          <v-list-tile v-if="!item.children" :to="item.link" :key="i">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ item.text }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
        <v-list-tile v-if="isUserLoggedIn" @click.stop="onLogout">
            <v-list-tile-action>
              <v-icon>fa-sign-out</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                Salir
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="primary" app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer" class="hidden-md-and-up"></v-toolbar-side-icon>
      <v-toolbar-title>Lalalash icon here</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat v-for="m in items" :key="m.text" :to="m.link">
          <v-icon left>{{ m.icon }}</v-icon>
            {{ m.text }}
        </v-btn>
        <v-btn v-if="isUserLoggedIn" @click="onLogout">
          <v-icon left>fa-sign-out</v-icon>
            Salir
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout
          justify-center
          align-top>
          <router-view ></router-view>
          <template v-if="showLoading">
            <lash-loading/>
          </template>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer app>
      <span>&copy; 2017</span>
    </v-footer>
  </v-app>
</template>

<script>
import Loading from './components/shared/Loading';

export default {
  data() {
    return {
      drawer: false,
    };
  },
  computed: {
    showLoading() {
      return this.$store.getters.loading;
    },
    items() {
      let menus = [
        { text: 'Home', link: '/', icon: 'fa-home' },
        { text: 'Entrar', link: '/signin', icon: 'fa-sign-in' },
      ];
      if (this.isUserLoggedIn) {
        if (this.isAdmin) {
          menus = [
            { text: 'Home', link: '/', icon: 'fa-home' },
            { text: 'Perfil', link: '/profile', icon: 'fa-user-circle' },
            {
              text: 'Admin',
              icon: 'fa-lock',
              active: false,
              children: [
                { text: 'Usuarios', link: '/users', icon: 'fa-users' },
                { text: 'Servicios', link: '/services', icon: 'fa fa-dropbox' },
                { text: 'Categorias', link: '/categories', icon: 'fa fa-tags' },
                { text: 'Clientes', link: '/customers', icon: 'fa-users' },
              ],
            },
          ];
        } else {
          menus = [
            { text: 'Home', link: '/', icon: 'fa-home' },
            { text: 'Perfil', link: '/profile', icon: 'fa-user-circle' },
          ];
        }
      }
      return menus;
    },
    isUserLoggedIn() {
      return this.$store.getters.user && this.$store.getters.token;
    },
    isAdmin() {
      return this.$store.getters.isAdmin;
    },
  },
  methods: {
    onLogout() {
      this.$store.dispatch('logout');
      this.drawer = !this.drawer;
      this.$router.push('/signin');
    },
  },
  components: {
    'lash-loading': Loading,
  },
};
</script>
