<template>
  <v-dialog v-model="editDialogOpened" persistent max-width="500px">
      <form @submit.prevent="onSaveCategory">
        <v-card>
          <v-card-title>
            <span class="headline">Categoria</span>
          </v-card-title>
          <v-card-text>
            <v-flex x12>
              <v-text-field label="nombre" :counter="10" :rules="valName" v-model="editName" required></v-text-field>
            </v-flex>
            <v-flex x12>
              <v-text-field label="Icono" v-model="editIcon" required></v-text-field>
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
  props: ['category', 'editDialogOpened'],
  data() {
    return {
      editName: this.category.name,
      editIcon: this.category.icon,
      valName: [
        v => v.length <= 10 || 'Max 25 caracteres',
        v => v.length >= 3 || 'Min 3 caracteres',
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
      return this.editName !== '' && this.editIcon !== '';
    },
  },
  methods: {
    onSaveCategory() {
      if (!this.formIsValid) {
        return;
      }
      const editData = {
        id: this.category.id,
        name: this.editName,
        icon: this.editIcon,
      };
      this.$store.dispatch('updateCategory', editData);
      this.onDismissDialog();
    },
    onDismissDialog() {
      this.$emit('on-edit-category', false);
      this.resetForm();
    },
    resetForm() {
      this.editName = '';
      this.editIcon = '';
    },
  },
};
</script>
<style scoped>

</style>


