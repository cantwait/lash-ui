<template>
  <v-dialog v-model="createDialogOpened" fullscreen persistent="" :overlay="false">
      <form @submit.prevent="onSaveCategory">
        <v-card>
          <v-card-title>
            <span class="headline">Agregar a Lista de Espera</span>
          </v-card-title>
          <v-card-text>
            <v-flex x12>
              <v-text-field label="nombre" :counter="10" :rules="nameVal" v-model="name" required></v-text-field>
            </v-flex>
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
  props: ['createDialogOpened'],
  data() {
    return {
      name: '',
      valName: [
        v => v.length <= 10 || 'Max 25 caracteres',
        v => v.length >= 3 || 'Min 3 caracteres',
        v => _.isEmpty(v.length) || 'Nombre no puede ser vacio',
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
    formIsValid() {
      return this.name !== '';
    },
  },
  methods: {
    onSaveCategory() {
      if (!this.formIsValid) {
        return;
      }
      const newQueue = {
        name: this.name,
      };
      this.$store.dispatch('saveQueue', newQueue);
      this.$emit('on-create-queue', true);
      this.resetForm();
    },
    onDismissDialog() {
      this.$emit('on-create-queue', false);
      this.resetForm();
    },
    resetForm() {
      this.name = '';
    },
  },
};
</script>
<style scoped>

</style>


