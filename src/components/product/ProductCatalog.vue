<template>
  <v-layout >
    <v-dialog  v-model="isOpenDialog" fullscreen transition="dialog-bottom-transition" :overlay="false">
      <v-card height="100%">
        <v-toolbar light color="primary">
          <v-btn v-if="!toggle" icon @click.native="onCloseDialog" >
            <v-icon>close</v-icon>
          </v-btn>
          <v-btn v-else icon @click.native="toggle = !toggle" >
            <v-icon>arrow_back</v-icon>
          </v-btn>
          <v-toolbar-title>Categoria de Products</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn  flat :disabled="selected.length === 0" @click="onAddProductsSelected">
              <v-icon>check_circle</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card height="100%" v-if="!toggle" >
          <v-container fluid grid-list-sm align-baseline>
            <v-layout row wrap>
              <v-flex
                xs4
                v-for="cat in categories"
                :key="cat.id"
              >
                <v-card tile>
                  <v-card-media @click="onCatTapped(cat)"
                    :src="cat.icon"
                    height="160px"
                    class="lash__card__media__background"
                  >
                  </v-card-media>
                  <v-card-title >
                    {{ cat.name }}
                </v-card-title>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
        <v-card v-else >
          <template v-for="(p, index) in productByCategory">
            <v-list avatar ripple two-line :key="p.id">
              <v-list-tile >
                <v-list-tile-action>
                  <v-checkbox
                    :value="p"
                    :id="p.id"
                    v-model="selected"
                  ></v-checkbox>
                </v-list-tile-action>
                <v-list-tile-content >
                  <v-list-tile-title>{{ p.name }}</v-list-tile-title>
                  <v-list-tile-sub-title class="text--primary lash__sub_title">{{ p.description }}</v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action >
                    <v-list-tile-action-text>Precio: ${{ p.price }}</v-list-tile-action-text>
                </v-list-tile-action>
                 <v-list-tile-action>
                  <v-btn icon ripple @click.stop="onOpenPictureDialog(p)">
                    <v-icon color="black lighten-1">photo</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
              <v-divider v-if="index + 1 < productByCategory.length" ></v-divider>
            </v-list>
          </template>
          <template v-if="productByCategory.length === 0">
            No hay resultados...
          </template>
        </v-card>
      </v-card>
    </v-dialog>
    <template v-if="product && isPictureDialog">
      <lash-pictures-admin @on-picture-dialog="onPictureDialogAction" :pictureDialogOpen="isPictureDialog" :product="product"></lash-pictures-admin>
    </template>
  </v-layout>
</template>
<script>
import { debounce } from 'lodash';
import ProductImageAdmin from '../shared/ProductImageAdmin';
import utils from '../../utils';

export default {
  props: ['isOpenDialog'],
  data() {
    return {
      iconClass: 'grey lighten-1 white--text',
      icon: 'person',
      toggle: false,
      category: null,
      selected: [],
      isPictureDialog: false,
      product: null,
    };
  },
  computed: {
    categories() {
      return this.$store.getters.categories;
    },
    productByCategory() {
      return this.$store.getters.productsByCategory;
    },
  },
  created() {
    this.fetchCategories();
  },
  methods: {
    onCloseDialog() {
      this.$emit('on-value-picked', null);
    },
    // eslint-disable-next-line
    debounceInput: debounce(function (e) {
      if (e && e.length > 0) {
        this.$store.dispatch('findCustomersLike', e);
      }
    }, 1000),
    onAddToQueue(item) {
      this.$store.dispatch('saveQueue', item);
    },
    onCreateSession(item) {
      utils.log('creating session...: %s', JSON.stringify(item));
    },
    fetchCategories() {
      this.$store.dispatch('getCategories', { page: 1, perPage: 50 });
    },
    onCatTapped(cat) {
      this.toggle = !this.toggle;
      utils.log('cat tapped!: %s', JSON.stringify(cat));
      this.$store.dispatch('getProductsPerCategory', cat.id);
    },
    onAddProductsSelected() {
      if (this.selected.length > 0) {
        this.$emit('on-value-picked', this.selected);
      }
    },
    onOpenPictureDialog(item) {
      this.product = item;
      this.isPictureDialog = !this.isPictureDialog;
    },
    onPictureDialogAction(result) {
      utils.log('result: %s', result);
      this.isPictureDialog = !this.isPictureDialog;
    },
  },
  components: {
    'lash-pictures-admin': ProductImageAdmin,
  },
};

</script>
<style scoped>
.card__title {
  padding: 10px;
}
.lash__card__media__background :first-child {
  background-size: 100px !important;
}
.lash__sub_title {
  font-size: 12px;
}
</style>
