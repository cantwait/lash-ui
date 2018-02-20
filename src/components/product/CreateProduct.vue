<template>
  <v-dialog v-model="createDialogOpened" persistent max-width="500px">
      <form @submit.prevent="onSaveProduct">
        <v-card>
          <v-card-title>
            <span class="headline">Producto</span>
          </v-card-title>
          <v-card-text>
            <v-flex x12>
              <v-text-field label="Nombre" v-model.trim="name" required></v-text-field>
            </v-flex>
            <v-flex x12>
              <v-text-field label="Descripción" v-model.trim="description"></v-text-field>
            </v-flex>
            <v-flex x12>
              <v-text-field label="Precio" v-model.number="price" type="number" step="0.01" required></v-text-field>
            </v-flex>
            <v-flex x12>
              <v-select
                v-model="category"
                label="Seleccione una Categoria"
                required
                :items="categories"
                item-text="name"
                item-value="id"
                no-data-text="No hay categorias disponibles"

              >
              </v-select>
            </v-flex>
            <v-flex x12>
              <v-text-field multi-line label="Especificaciones" placeholder="Defina las epecificaciones del producto acá" v-model="specs"></v-text-field>
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
      price: '',
      description: '',
      specs: '',
      category: null,
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
      return this.name !== '' && this.price > 0 && this.description !== '' && this.category !== null;
    },
    categories() {
      return this.$store.getters.categories;
    },
  },
  created() {
    this.$store.dispatch('getCategories', { page: 1, perPage: 100 });
  },
  methods: {
    onSaveProduct() {
      if (!this.formIsValid) {
        return;
      }
      const newProduct = {
        name: this.name,
        price: this.price,
        category: this.category,
        specs: this.specs,
        description: this.description,
      };
      this.$store.dispatch('saveProduct', newProduct);
      this.$emit('on-create-product', true);
      this.resetForm();
    },
    onDismissDialog() {
      this.$emit('on-create-product', false);
      this.resetForm();
    },
    resetForm() {
      this.name = '';
      this.price = '';
    },
  },
};
</script>
<style scoped>

</style>


