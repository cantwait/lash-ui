<template>
  <v-dialog v-model="createDialogOpened" persistent max-width="500px">
      <form @submit.prevent="onSaveProduct">
        <v-card>
          <v-card-title>
            <span class="headline">Producto</span>
          </v-card-title>
          <v-card-text>
            <v-flex x12>
              <v-text-field label="Nombre"
                :rules="nameVal"
                :counter="60"
                v-model.trim="name"
                required></v-text-field>
            </v-flex>
            <v-flex x12>
              <v-text-field
                label="Descripción"
                v-model.trim="description"
                required
                :rules="descVal"
                :counter="200"></v-text-field>
            </v-flex>
            <v-flex x12>
              <v-text-field ref="price" :rules="priceVal" label="Precio" prefix="$" v-model.number="price" type="number" step="0.01" required></v-text-field>
            </v-flex>
            <v-flex x12>
              <v-select
                v-model="category"
                :rules="categoryVal"
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
              <v-text-field :rules="specsVal" :counter="500" multi-line label="Especificaciones" placeholder="Defina las epecificaciones del producto acá" v-model="specs"></v-text-field>
            </v-flex>
            <v-flex x12>
              <v-checkbox label="Oferta" v-model="offer"></v-checkbox>
            </v-flex>
            <v-flex x12>
              <v-checkbox label="Genera Comisión?" v-model="generateFee"></v-checkbox>
            </v-flex>
            <v-flex x12>
              <v-checkbox label="Activo?" v-model="active"></v-checkbox>
            </v-flex>
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
  props: ['createDialogOpened'],
  data() {
    return {
      name: '',
      price: '',
      description: '',
      specs: '',
      category: null,
      offer: false,
      generateFee: false,
      active: true,
      nameVal: [
        v => v.length <= 60 || 'Max 60 caracteres',
        v => v.length >= 2 || 'Min 2 caracteres',
        v => _.isEmpty(v.length) || 'Nombre no puede ser vacio',
      ],
      descVal: [
        v => v.length <= 200 || 'Max 200 caracteres',
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
        offer: this.offer,
        generateFee: this.generateFee,
        active: this.active,
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


