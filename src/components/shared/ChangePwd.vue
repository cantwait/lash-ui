<template>
  <v-dialog v-model="changePwdDialog" persistent max-width="500px">
      <v-layout v-if="error">
        <v-flex xs12 sm6 offset-sm3>
          <app-alert @dismissed="onDismissed" :text="error"></app-alert>
        </v-flex>
      </v-layout>
      <form @submit.prevent="onUpdatePwd">
        <v-card>
          <v-card-title>
            <span class="headline">Cambiar Contraseña</span>
          </v-card-title>
          <v-card-text>
            <v-flex x12>
              <v-text-field :type="e1 ? 'password' : 'text'"  :append-icon="e1 ? 'visibility' : 'visibility_off'" :append-icon-cb="() => (e1 = !e1)" label="Contraseña actual" v-model="current" required></v-text-field>
            </v-flex>
            <v-flex x12>
              <v-text-field hint="Minimo 6 caracteres" :type="e2 ? 'password' : 'text'"  :append-icon="e2 ? 'visibility' : 'visibility_off'" :append-icon-cb="() => (e2 = !e2)" label="Nueva Contraseña" :rules="newPwdRules" v-model="newPwd" required></v-text-field>
            </v-flex>
            <v-flex x12>
              <v-text-field @blur="pwdConfirmation" hint="Minimo 6 caracteres" :type="e3 ? 'password' : 'text'"  :append-icon="e3 ? 'visibility' : 'visibility_off'" :append-icon-cb="() => (e3 = !e3)" label="Repetir Contraseña" v-model="newTwice" required></v-text-field>
            </v-flex>
            <small>*Campo Obligatorio</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn type="submit" :disabled="loading" :loading="loading" color="black darken-1" flat>Guardar</v-btn>
            <v-btn color="black darken-1" flat @click.native="onDismissDialog">Cerrar</v-btn>
          </v-card-actions>
        </v-card>
      </form>
    </v-dialog>
</template>
<script>
// import _ from 'lodash';
// import utils from '../../utils';

export default {
  props: ['user', 'changePwdDialog'],
  data() {
    return {
      current: '',
      newPwd: '',
      newTwice: '',
      newPwdRules: [
        v => v.length >= 6 || 'Min 6 caracteres',
      ],
      newTwiceRules: [
        v => v.length >= 6 || 'Min 6 caracteres',
      ],
      e1: 'password',
      e2: 'password',
      e3: 'password',
    };
  },
  computed: {
    error() {
      return this.$store.getters.error;
    },
    loading() {
      return this.$store.getters.loading;
    },
    pwdValid() {
      return this.$store.getters.pwdValid;
    },
  },
  watch: {
    pwdValid(val) {
      if (val) {
        this.onDismissDialog();
      }
    },
  },
  created() {
    this.$store.commit('setPwdValid', false);
  },
  methods: {
    formIsValid() {
      return this.newPwd !== '' && this.current !== '' && this.newTwice !== '';
    },
    onUpdatePwd() {
      if (!this.formIsValid) {
        return;
      }

      if (this.newPwd !== this.newTwice) {
        this.$store.commit('setError', 'Ha fallado la confirmación de contraseña, por favor verificar');
        return;
      }

      if (this.current === this.newPwd) {
        this.$store.commit('setError', 'La contraseña nueva no puede ser igual a la actual');
        return;
      }
      const editData = {
        current: this.current,
        newPwd: this.newPwd,
      };
      this.$store.dispatch('updatePassword', editData);
    },
    onDismissDialog() {
      this.$emit('on-update-pwd', false);
      this.$store.commit('setError', null);
      this.resetForm();
    },
    onDismissed() {
      this.$store.commit('setError', null);
    },
    resetForm() {
      this.newPwd = '';
      this.current = '';
      this.newTwice = '';
    },
    pwdConfirmation() {
      if (this.newPwd !== this.newTwice) {
        this.$store.commit('setError', 'Confirmacion de contraseña falló, por favor verifique su nueva contraseña');
      }
    },
  },
};
</script>
<style scoped>

</style>


