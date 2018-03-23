<template>
  <v-dialog v-model="editDialogOpened" persistent max-width="500px">
      <form @submit.prevent="onSaveCustomer">
        <v-card>
          <v-card-title>
            <span class="headline">Categoria</span>
          </v-card-title>
          <v-card-text>
            <v-flex x12>
              <v-text-field  label="Nombre" v-model="editName" required></v-text-field>
            </v-flex>
            <v-flex x12>
              <v-text-field label="Correo" v-model="editEmail" required></v-text-field>
            </v-flex>
            <v-flex x12>
              <v-text-field prepend-icon="phone" label="Telefono" v-model="editPhone" type='tel' required></v-text-field>
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
                  v-model="editBirthdate"
                  prepend-icon="event"
                  readonly
                ></v-text-field>
                <v-date-picker
                  ref="picker"
                  v-model="editBirthdate"
                  @change="save"
                  min="1950-01-01"
                  :max="new Date().toISOString().substr(0, 10)"
                ></v-date-picker>
              </v-menu>
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
import _ from 'lodash';

export default {
  props: ['customer', 'editDialogOpened'],
  data() {
    return {
      editName: this.customer.name,
      editEmail: this.customer.email,
      editPhone: this.customer.phone,
      editBirthdate: this.customer.birthdate,
      bDaymenu: false,
      nameVal: [
        v => v.length <= 25 || 'Max 25 caracteres',
        v => v.length >= 3 || 'Min 3 caracteres',
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
    error() {
      return this.$store.getters.error;
    },
    loading() {
      return this.$store.getters.loading;
    },
    formIsValid() {
      return this.editName !== '' && this.editEmail !== '' && this.editPhone !== '' && this.editBirthdate !== '';
    },
  },
  methods: {
    onSaveCustomer() {
      if (!this.formIsValid) {
        return;
      }
      const editData = {
        id: this.customer.id,
        name: this.editName,
        email: this.editEmail,
        phone: this.editPhone,
        birthdate: this.editBirthdate,
      };
      this.$store.dispatch('updateCustomer', editData);
      this.onDismissDialog();
    },
    onDismissDialog() {
      this.$emit('on-edit-customer', false);
      this.resetForm();
    },
    resetForm() {
      this.editName = '';
      this.editPhone = '';
      this.editEmail = '';
    },
    save(date) {
      this.$refs.menu.save(date);
    },
  },
};
</script>
<style scoped>

</style>


