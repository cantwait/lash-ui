<template>
  <v-layout row>
    <v-flex>
      <v-card>
        <v-card-media :src="userPic" height="300px">
          <v-layout column class="media">
            <v-card-title>
              <v-spacer></v-spacer>
              <v-btn dark icon class="mr-3">
                <v-icon>edit</v-icon>
              </v-btn>
              <v-menu >
              <v-btn dark icon slot="activator" >
                <v-icon>more_vert</v-icon>
              </v-btn>
              <v-list>
                <v-list-tile @click="onChagePwd">
                  <v-list-tile-title class="lash__list__text">Cambiar Contraseña</v-list-tile-title>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-title class="lash__list__text">Editar Info</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
            </v-card-title>
            <v-spacer></v-spacer>
            <v-card-title class="white--text pl-5 pt-5">
              <div class="display-1 pl-5 pt-5">{{user.name}}</div>
            </v-card-title>
          </v-layout>
        </v-card-media>
        <v-list two-line>
          <v-list-tile >
            <v-list-tile-action>
              <v-icon color="black">phone</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{user.phone}}</v-list-tile-title>
              <v-list-tile-sub-title>Telfono</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider inset></v-divider>
          <v-list-tile >
            <v-list-tile-action>
              <v-icon color="black">mail</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{user.email}}</v-list-tile-title>
              <v-list-tile-sub-title>Personal</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider inset></v-divider>
          <v-list-tile >
            <v-list-tile-action>
              <v-icon color="black">supervisor_account</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{user.role | role}}</v-list-tile-title>
              <v-list-tile-sub-title>Rol</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider inset></v-divider>
          <v-list-tile >
            <v-list-tile-action>
              <v-icon color="black">location_on</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{user.address}}</v-list-tile-title>
              <v-list-tile-sub-title>Direccion</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-flex>
    <lash-change-pwd @on-update-pwd="onPwdUpdated" :user="user" :changePwdDialog="isDialogOpened"></lash-change-pwd>
  </v-layout>
</template>
<script>
import ChangePwd from './ChangePwd';
import utils from '../../utils';

export default {
  data() {
    return {
      isDialogOpened: false,
    };
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    userPic() {
      return !this.$store.getters.user.picture ? '/static/img/profile-holder-1.png' : this.$store.getters.user.picture;
    },
  },
  methods: {
    onChagePwd() {
      utils.log('opening change pwd dialog');
      this.isDialogOpened = !this.isDialogOpened;
    },
    onPwdUpdated() {
      this.isDialogOpened = !this.isDialogOpened;
    },
  },
  filters: {
    role(value) {
      if (value) {
        const val = value.toString();
        if (val === 'cashier') {
          return 'Cajero';
        }
        if (val === 'user') {
          return 'Colaborador';
        }
        if (val === 'admin') {
          return 'Administrador';
        }
      }
      return '';
    },
  },
  components: {
    'lash-change-pwd': ChangePwd,
  },
};
</script>
<style scoped>
.media {
  height: 100%;
  margin: 0;
}
.card__media:first-child {
  background-size: auto;
  background-repeat: no-repeat;
}
.lash__list__text {
  font-size: 12px;
}
</style>