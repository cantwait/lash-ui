<template>
  <v-dialog v-model="createDialogOpened" persistent max-width="500px">
      <form @submit.prevent="onSaveCategory">
        <v-card>
          <v-card-title>
            <span class="headline">Categoria</span>
          </v-card-title>
          <v-card-text>
            <v-flex x12>
              <v-text-field label="nombre" v-model="name" required></v-text-field>
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
export default {
  props: ['createDialogOpened'],
  data() {
    return {
      name: '',
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
      const newCategory = {
        name: this.name,
      };
      this.$store.dispatch('saveCategory', newCategory);
      this.$emit('on-create-category', true);
      this.resetForm();
    },
    onDismissDialog() {
      this.$emit('on-create-category', false);
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


