<template>
  <v-dialog v-model="editDialogOpened" persistent max-width="500px">
      <form @submit.prevent="onSaveProduct">
        <v-card>
          <v-card-title>
            <span class="headline">Categoria</span>
          </v-card-title>
          <v-card-text>
            <v-flex x12>
              <v-text-field label="Nombre" :counter="25" :rules="nameVal" v-model.trim="editName" required></v-text-field>
            </v-flex>
            <v-flex x12>
              <v-text-field label="Descripción" :counter="50" :rules="descVal" required v-model.trim="editDescription"></v-text-field>
            </v-flex>
            <v-flex x12>
              <v-text-field label="Precio" :rules="priceVal" v-model.number="editPrice" type="number" step="0.01" required></v-text-field>
            </v-flex>
            <v-flex x12>
              <v-select
                v-model="editCategory"
                label="Seleccione una Categoria"
                required
                :rules="categoryVal"
                :items="categories"
                item-text="name"
                item-value="id"
                no-data-text="No hay categorias disponibles"
              >
              </v-select>
            </v-flex>
            <v-flex x12>
              <v-text-field :rules="specsVal" :counter="500" multi-line label="Especificaciones" placeholder="Defina las epecificaciones del producto acá" v-model="editSpecs"></v-text-field>
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
  props: ['product', 'editDialogOpened'],
  data() {
    return {
      editName: this.product.name,
      editPrice: this.product.price,
      editDescription: this.product.description,
      editSpecs: this.product.specs,
      editCategory: this.product.category,
      nameVal: [
        v => v.length <= 25 || 'Max 25 caracteres',
        v => v.length >= 2 || 'Min 2 caracteres',
        v => _.isEmpty(v.length) || 'Nombre no puede ser vacio',
      ],
      descVal: [
        v => v.length <= 50 || 'Max 50 caracteres',
        v => v.length >= 5 || 'Min 5 caracteres',
        v => _.isEmpty(v.length) || 'Descripción no puede ser vacio',
      ],
      priceVal: [
        v => v > 0 || 'Precio debe ser mayor a 0',
      ],
      categoryVal: [
        v => !_.isNull(v) || 'Debe seleccionar una categoria',
      ],
      specsVal: [
        v => v.length <= 500 || 'Max 500 caracteres',
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
      return this.editName !== '' && this.editPrice > 0 && this.editCategory !== null && this.editDescription !== '';
    },
    categories() {
      return this.$store.getters.categories;
    },
    selectedCategory() {
      return _.find(this.categories, { id: this.product.category });
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
      const editData = {
        id: this.product.id,
        name: this.editName,
        description: this.editDescription,
        price: this.editPrice,
        specs: this.editSpecs,
        category: this.editCategory,
      };
      this.$store.dispatch('updateProduct', editData);
      this.$emit('on-create-product', true);
      this.onDismissDialog();
    },
    onDismissDialog() {
      this.$emit('on-edit-product', false);
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


