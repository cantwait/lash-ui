<template>
  <v-dialog v-model="editDialogOpened" persistent max-width="500px">
      <form @submit.prevent="onSaveCategory">
        <v-card>
          <v-card-title>
            <span class="headline">Categoria</span>
          </v-card-title>
          <v-card-text>
            <v-flex x12>
              <v-text-field label="nombre" v-model="editName" required></v-text-field>
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
  props: ['category', 'editDialogOpened'],
  data() {
    return {
      editName: this.category.name,
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
      return this.name !== '';
    },
  },
  methods: {
    onSaveCategory() {
      if (!this.formIsValid) {
        return;
      }
      const editData = {
        id: this.data.id,
        name: this.data.name,
      };
      this.$store.dispatch('updateCategory', editData);
      this.onDismissDialog();
    },
    onDismissDialog() {
      this.$emit('on-edit-category', false);
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


