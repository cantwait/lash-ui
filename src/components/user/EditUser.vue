<template>
  <v-dialog v-model="isOpenDialog" persistent max-width="500px">
      <form @submit.prevent="onSaveUser">
        <v-card>
          <v-card-title>
            <span class="headline">Usuario</span>
          </v-card-title>
          <v-card-text>
            <v-flex x12>
              <v-text-field label="nombre" :rules="nameVal" :counter="20" v-model="data.name" required></v-text-field>
            </v-flex>
            <v-flex x12>
              <v-text-field label="Email" v-model="data.email" required></v-text-field>
            </v-flex>
            <v-flex x12>
              <v-select
                v-model="data.role"
                label="Seleccione el rol"
                required
                :items="roles"
                :rules="roleVal"

              >
              </v-select>
            </v-flex>
            <!-- <v-flex xs12>
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
            </v-flex> -->
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
  props: ['user'],
  data() {
    return {
      editName: this.user.name,
      editMail: this.user.mail,
      editRol: this.user.role,
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
      return this.$store.getters.editUserDialog;
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
    data() {
      return {
        id: this.user.id,
        name: this.user.name,
        email: this.user.email,
        role: this.user.role,
      };
    },
  },
  methods: {
    onSaveUser() {
      if (!this.formIsValid) {
        return;
      }
      const editData = {
        id: this.data.id,
        email: this.data.email,
        role: this.data.role,
        // picture: this.imageURL,
        name: this.data.name,
      };
      this.$store.dispatch('updateUser', editData);
      // this.$store.commit('setImageUrl', '');
      // this.$store.commit('setImageResized', '');
    },
    onDismissDialog() {
      this.$store.commit('setEditUserDialog', false);
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
  },
};
</script>
<style scoped>

</style>


