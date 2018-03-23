<template>
  <v-dialog v-model="createDialogOpened" persistent max-width="500px">
      <form @submit.prevent="onSaveCustomer">
        <v-card>
          <v-card-title>
            <span class="headline">Cliente</span>
          </v-card-title>
          <v-card-text>
            <v-flex x12>
              <v-text-field label="Nombre" v-model="name" :counter="50" :rules="nameVal" required></v-text-field>
            </v-flex>
            <v-flex x12>
              <v-text-field label="Correo" v-model="email" required></v-text-field>
            </v-flex>
            <v-flex x12>
              <v-text-field prepend-icon="phone" label="Telefono" :rules="phoneVal" v-model="phone" required></v-text-field>
            </v-flex>
            <v-flex x12>
              <v-menu
                ref="menu"
                lazy
                :close-on-content-click="false"
                v-model="bDaymenu"
                transition="scale-transition"
                offset-y
                full-width
                :nudge-right="40"
                min-width="290px"
              >
                <v-text-field
                  slot="activator"
                  label="Fecha de Nacimiento"
                  v-model="birthdate"
                  prepend-icon="event"
                  readonly
                ></v-text-field>
                <v-date-picker
                  ref="picker"
                  v-model="birthdate"
                  @change="save"
                  min="1950-01-01"
                  :max="new Date().toISOString().substr(0, 10)"
                ></v-date-picker>
              </v-menu>
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
import { isEmpty } from 'lodash';
import moment from 'moment';

export default {
  props: ['createDialogOpened'],
  data() {
    return {
      name: '',
      email: '',
      phone: '',
      birthdate: '',
      bDaymenu: false,
      nameVal: [
        v => v.length <= 20 || 'Max 20 caracteres',
        v => v.length >= 3 || 'Min 3 caracteres',
        v => isEmpty(v.length) || 'Nombre no puede ser vacio',
      ],
      phoneVal: [
        v => v.length <= 12 || 'Max 12 caracteres',
        v => v.length >= 7 || 'Min 7 caracteres',
        v => isEmpty(v.length) || 'Nombre no puede ser vacio',
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
      return this.name !== '' && this.email !== '' && this.phone !== '' && this.birthdate !== '';
    },
  },
  methods: {
    onSaveCustomer() {
      if (!this.formIsValid) {
        return;
      }
      const bDate = moment(this.birthdate).add(12, 'hours');
      const newCustomer = {
        name: this.name,
        email: this.email,
        phone: this.phone,
        birthdate: bDate,
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
    save(date) {
      this.$refs.menu.save(date);
    },
  },
};
</script>
<style scoped>

</style>


