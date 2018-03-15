<template>
  <v-layout row justify-center>
    <v-dialog  v-model="isOpenDialog" fullscreen transition="dialog-bottom-transition" :overlay="false">
      <v-card height="100%">
        <v-toolbar dark color="primary">
          <v-btn v-if="!toggle" icon @click.native="onCloseDialog" dark>
            <v-icon>close</v-icon>
          </v-btn>
          <v-btn v-else icon @click.native="toggle = !toggle" dark>
            <v-icon>arrow_back</v-icon>
          </v-btn>
          <v-toolbar-title>Categoria de Products</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click.native="toggle = !toggle">action</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card height="100%" v-if="!toggle" transition="slide-x-transition">
          <v-container fluid grid-list-sm>
            <v-layout row wrap>
              <v-flex
                xs4
                v-for="cat in categories"
                :key="cat.id"
              >
                <v-card tile>
                  <v-card-media @click="onCatTapped(cat)"
                    :src="cat.icon"
                    height="150"
                  >
                  </v-card-media>
                  <v-card-title primary-title>
                  <div>
                    <div>{{ cat.name }}</div>
                  </div>
                </v-card-title>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
        <v-card v-else transition="slide-x-transition">
          <v-list three-line>
          <template v-for="(p, index) in productByCategory">
            <v-list-tile-content :key="index">
              <v-list-tile-title v-html="p.name"></v-list-tile-title>
              <v-list-tile-sub-title>Descripcion: {{ p.description }}</v-list-tile-sub-title>
              <v-list-tile-sub-title>Precio: ${{ p.price }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </template>
        </v-list>
        </v-card>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
import { debounce } from 'lodash';
import utils from '../../utils';

export default {
  props: ['isOpenDialog'],
  data() {
    return {
      iconClass: 'grey lighten-1 white--text',
      icon: 'person',
      toggle: false,
      category: null,
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
  },
};

</script>
<style scoped>

</style>
