<template>
  <v-dialog v-model="isOpenDialog" persistent max-width="500px">
      <form @submit.prevent="onSaveUser">
        <v-card>
          <v-card-title>
            <span class="headline">Usuario</span>
          </v-card-title>
          <v-card-text>
            <v-flex x12>
              <v-text-field label="nombre" :rules="nameVal" :counter="20" v-model="name" required></v-text-field>
            </v-flex>
            <v-flex x12>
              <v-text-field label="Email" v-model="email" required></v-text-field>
            </v-flex>
            <!-- <v-flex xs12>
              <v-text-field label="Password" type="password" required></v-text-field>
            </v-flex> -->
            <v-flex x12>
              <v-select
                v-model="role"
                label="Seleccione el rol"
                required
                :items="roles"
                :rules="roleVal"
              >
              </v-select>
            </v-flex>
            <v-flex xs12>
              <v-btn raised class="primary" @click="onPickFile">Subir Imagen</v-btn>
              <input
                type="file"
                style="display: none"
                ref="fileInput"
                accept="image/*"
                @change="onFilePicked">
            </v-flex>
            <v-flex x12>
              <img :src="imageURL">
            </v-flex>
            <small>*Campo Obligatorio</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn type="submit" :disabled="loading" :loading="loading" color="blue darken-1" flat>Guardar</v-btn>
            <v-btn color="blue darken-1" flat @click.native="onDismissDialog">Cerrar</v-btn>
          </v-card-actions>
        </v-card>
      </form>
    </v-dialog>
</template>
<script>
import _ from 'lodash';

export default {
  data() {
    return {
      name: '',
      email: '',
      role: '',
      roles: [
        {
          value: 'admin',
          text: 'Administrador',
        },
        {
          value: 'cashier',
          text: 'Cajero',
        },
        {
          value: 'user',
          text: 'Colaborador',
        },
      ],
      nameVal: [
        v => v.length <= 20 || 'Max 20 caracteres',
        v => v.length >= 3 || 'Min 3 caracteres',
        v => _.isEmpty(v.length) || 'Nombre no puede ser vacio',
      ],
      roleVal: [
        v => !_.isNull(v) || 'Debe seleccionar un rol',
      ],
    };
  },
  computed: {
    isOpenDialog() {
      return this.$store.getters.newUserDialog;
    },
    error() {
      return this.$store.getters.error;
    },
    loading() {
      return this.$store.getters.loading;
    },
    imageURL() {
      return this.$store.getters.imageURL;
    },
    formIsValid() {
      return this.name !== '' &&
      this.email !== '' &&
      this.role !== '';
    },
  },
  methods: {
    onSaveUser() {
      if (!this.formIsValid) {
        return;
      }
      const newUserData = {
        email: this.email,
        role: this.role,
        picture: this.imageURL,
        name: this.name,
      };
      this.$store.dispatch('saveUser', newUserData);
      this.$store.commit('setImageUrl', '');
      this.$store.commit('setImageResized', '');
      this.resetForm();
    },
    onDismissDialog() {
      this.$store.commit('setNewUserDialog', false);
      this.resetForm();
    },
    onPickFile() {
      this.$refs.fileInput.click();
    },
    onFilePicked(event) {
      const files = event.target.files;
      const filename = files[0].name;
      if (filename.lastIndexOf('.') <= 0) {
        // return alert('Please add a valid file!')
      }
      const payload = {
        el: event.target,
        name: filename,
      };
      this.$store.dispatch('getImageUrl', payload);
    },
    resetForm() {
      this.name = '';
      this.email = '';
      this.role = '';
    },
  },
};
</script>
<style scoped>

</style>


