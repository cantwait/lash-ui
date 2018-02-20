<template>
  <v-dialog v-model="editDialogOpened" persistent max-width="500px">
      <form @submit.prevent="onSaveCustomer">
        <v-card>
          <v-card-title>
            <span class="headline">Categoria</span>
          </v-card-title>
          <v-card-text>
            <v-flex x12>
              <v-text-field label="Nombre" v-model="editName" required></v-text-field>
            </v-flex>
            <v-flex x12>
              <v-text-field label="Correo" v-model="editEmail" required></v-text-field>
            </v-flex>
            <v-flex x12>
              <v-text-field label="Telefono" v-model="editPhone" type='tel' required></v-text-field>
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
export default {
  props: ['customer', 'editDialogOpened'],
  data() {
    return {
      editName: this.customer.name,
      editEmail: this.customer.email,
      editPhone: this.customer.phone,
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
      return this.editName !== '' && this.editEmail !== '' && this.editPhone !== '';
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
  },
};
</script>
<style scoped>

</style>


