<template>
<v-layout row>
    <v-flex >
      <v-card>
        <v-list two-line subheader>
          <v-toolbar dark color="primary">
            <v-text-field
                placeholder="Busqueda por nombre"
                v-model.trim="pName">
            </v-text-field>
            <v-btn icon @click.stop="onProductSearch">
              <v-icon>search</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <!-- <v-text-field v-model="searchInput" @input="debounceInput" color="white" prepend-icon="search" clearable placeholder="Ingrese su busqueda..." hide-details single-line></v-text-field> -->
            <v-btn icon @click.stop="onNewProduct">
              <v-icon>add_circle</v-icon>
            </v-btn>
          </v-toolbar>
          <v-subheader inset>Productos</v-subheader>
          <template v-for="(item,index) in items">
            <v-list-tile avatar  v-bind:key="item.id" >
              <v-list-tile-content>
                <v-list-tile-title>{{ item.name | truncate }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ item.price }}</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-btn icon ripple @click.stop="onOpenPictureDialog(item)">
                  <v-icon color="black lighten-1">cloud_upload</v-icon>
                </v-btn>
              </v-list-tile-action>
              <v-list-tile-action>
                <v-btn icon ripple @click.stop="onOpenEditDialog(item)">
                  <v-icon color="black lighten-1">edit</v-icon>
                </v-btn>
              </v-list-tile-action>
              <v-list-tile-action>
                <v-btn icon ripple @click.stop="onOpenDeleteDialog(item)">
                  <v-icon color="black lighten-1">delete</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider v-if="index + 1 < items.length" v-bind:key="index"></v-divider>
          </template>
        </v-list>
      </v-card>
      <v-container>
        <v-layout justify-center align-center>
          <v-btn @click.stop="onLoadMore" flat :loading="loading">Cargar más</v-btn>
        </v-layout>
      </v-container>
      <!-- <v-card-text style="height: 100px; position: relative">
      <v-btn
        absolute
        dark
        fab
        top
        right
        color="primary"
        @click.stop="onNewProduct"
        >
        <v-icon>add</v-icon>
      </v-btn>
      </v-card-text> -->
    </v-flex>
    <!-- delete diaglo -->
    <template v-if="isDeleteDialog">
      <lash-delete-dialog :deleteDialog="isDeleteDialog" @on-action-performed="takeDeleteAction"></lash-delete-dialog>
    </template>
    <!-- new/edit user  -->
    <template v-if="isDialogCreateOpened">
      <lash-create-product :createDialogOpened="isDialogCreateOpened" @on-create-product="takeCreateAction"/>
    </template>
    <template v-if="product && isEditDialog">
      <lash-edit-product @on-edit-product="takeEditAction" :editDialogOpened="isEditDialog" :product="product"/>
    </template>
    <template v-if="product && isPictureDialog">
      <lash-pictures-admin @on-picture-dialog="takePictureDialogAction" :pictureDialogOpen="isPictureDialog" :product="product"></lash-pictures-admin>
    </template>
  </v-layout>
</template>
<script>
import CreateProduct from './CreateProduct';
import EditProduct from './EditProduct';
import ProductImageAdmin from '../shared/ProductImageAdmin';
import utils from '../../utils';

export default {
  data() {
    return {
      isDeleteDialog: false,
      isEditDialog: false,
      isDialogCreateOpened: false,
      product: null,
      idToDelete: null,
      iconClass: 'grey lighten-1 white--text',
      icon: 'local_offer',
      isPictureDialog: false,
      pName: '',
      query: {
        page: 1,
        perPage: 5,
      },
    };
  },
  created() {
    this.$store.dispatch('getProducts', this.query);
  },
  computed: {
    loading() {
      return this.$store.getters.loading;
    },
    items() {
      return this.$store.getters.products;
    },
  },
  methods: {
    onProductSearch() {
      this.query.page = 1;
      this.query.name = this.pName;
      this.$store.dispatch('getProducts', this.query);
    },
    onNewProduct() {
      utils.log('onNewProduct');
      this.isDialogCreateOpened = true;
    },
    onOpenDeleteDialog(item) {
      utils.log('onOpenDeleteDialog');
      this.idToDelete = item.id;
      this.isDeleteDialog = !this.isDeleteDialog;
    },
    onOpenEditDialog(item) {
      utils.log(`onOpenEditDialog: ${JSON.stringify(item)}`);
      this.product = item;
      this.isEditDialog = !this.isEditDialog;
    },
    onLoadMore() {
      utils.log('Loading more');
      this.query.page += 1;
      this.query.name = this.pName;
      this.$store.dispatch('getProducts', this.query);
    },
    takeDeleteAction(result) {
      utils.log(`result: ${result}`);
      if (result) {
        this.$store.dispatch('removeProduct', this.idToDelete);
        this.idToDelete = null;
      }
      this.isDeleteDialog = !this.isDeleteDialog;
    },
    takeCreateAction(result) {
      this.isDialogCreateOpened = !this.isDialogCreateOpened;
      utils.log(`result: ${result}`);
      if (result) {
        // TODO save category
      }
    },
    takeEditAction(result) {
      this.isEditDialog = !this.isEditDialog;
      utils.log(`onTakeEditAction: ${result}`);
      if (result) {
        // TODO update category
      }
    },
    onOpenPictureDialog(item) {
      utils.log(`picture dialog ${JSON.stringify(item)}`);
      this.isPictureDialog = true;
      this.product = item;
    },
    takePictureDialogAction(result) {
      utils.log(`${result}`);
      this.isPictureDialog = false;
      this.product = null;
    },
  },
  components: {
    'lash-create-product': CreateProduct,
    'lash-edit-product': EditProduct,
    'lash-pictures-admin': ProductImageAdmin,
  },
  filters: {
    truncate(val) {
      if (!val) return '';
      // eslint-disable-next-line
      return val.length > 30 ? val.substring(0,30) + '...' : val;
    },
  },
};
</script>
<style scoped>

</style>

