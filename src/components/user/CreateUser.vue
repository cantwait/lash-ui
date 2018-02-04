<template>
  <v-dialog v-model="isOpenDialog" persistent max-width="500px">
      <form @submit.prevent="onSaveUser">
        <v-card>
          <v-card-title>
            <span class="headline">User Profile</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <v-text-field label="nombre" required></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field label="Email" required></v-text-field>
                </v-flex>
                <!-- <v-flex xs12>
                  <v-text-field label="Password" type="password" required></v-text-field>
                </v-flex> -->
                <v-flex xs12 sm6 md4>
                  <v-select
                    label="Rol"
                    required
                    :items="['Admin', 'Cajero', 'Colaborador']"
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-btn raised class="primary" @click="onPickFile">Upload Image</v-btn>
                  <input
                    type="file"
                    style="display: none"
                    ref="fileInput"
                    accept="image/*"
                    @change="onFilePicked">
                </v-flex>
                <v-flex xs12 sm6 md4 offset-sm3>
                  <img :src="imageURL">
                </v-flex>
              </v-layout>
            </v-container>
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
export default {
  data() {
    return {
      name: '',
      email: '',
      role: '',
      picture: null,
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
      this.picture !== '' &&
      this.role !== '';
    },
  },
  methods: {
    onSaveUser() {
      if (!this.formIsValid) {
        return;
      }
      if (!this.picture) {
        return;
      }
      const newUserData = {
        email: this.email,
        role: this.role,
        picture: this.picture,
        name: this.name,
      };
      this.$store.dispatch('saveUser', newUserData);
    },
    onDismissDialog() {
      this.$store.commit('setNewUserDialog', false);
    },
    onPickFile() {
      this.$refs.fileInput.click();
    },
    onFilePicked(event) {
      debugger;
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


