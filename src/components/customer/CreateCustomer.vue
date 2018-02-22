<template>
  <v-dialog v-model="createDialogOpened" persistent max-width="500px">
      <form @submit.prevent="onSaveCustomer">
        <v-card>
          <v-card-title>
            <span class="headline">Cliente</span>
          </v-card-title>
          <v-card-text>
            <v-flex x12>
              <v-text-field label="Nombre" v-model="name" :rules="name" required></v-text-field>
            </v-flex>
            <v-flex x12>
              <v-text-field label="Correo" v-model="email" required></v-text-field>
            </v-flex>
            <v-flex x12>
              <v-text-field prepend-icon="phone" label="Telefono" :rules="phoneVal" v-model="phone" required></v-text-field>
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
      email: '',
      phone: '',
      nameVal: [
        v => v.length <= 25 || 'Max 25 caracteres',
        v => v.length >= 5 || 'Min 5 caracteres',
        v => _.isEmpty(v.length) || 'Nombre no puede ser vacio',
      ],
      phoneVal: [
        v => v.length <= 12 || 'Max 12 caracteres',
        v => v.length >= 7 || 'Min 7 caracteres',
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
      return this.name !== '' && this.email !== '' && this.phone !== '';
    },
  },
  methods: {
    onSaveCustomer() {
      if (!this.formIsValid) {
        return;
      }
      const newCustomer = {
        name: this.name,
        email: this.email,
        phone: this.phone,
      };
      this.$store.dispatch('saveCustomer', newCustomer);
      this.$emit('on-create-customer', true);
      this.resetForm();
    },
    onDismissDialog() {
      this.$emit('on-create-customer', false);
      this.resetForm();
    },
    resetForm() {
      this.name = '';
      this.phone = '';
      this.email = '';
    },
  },
};
</script>
<style scoped>

</style>


