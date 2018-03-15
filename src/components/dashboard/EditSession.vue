<template>
  <v-layout row justify-center>
    <v-dialog v-model="editDialogOpened" fullscreen transition="dialog-bottom-transition" :overlay="false">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon @click.native="onCloseDialog" dark>
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Servicios</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click.native="saveSession">
              <v-icon>save</v-icon>
            </v-btn>
            <v-btn dark flat @click.native="onAddService">
              <v-icon>add_circle</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-list three-line subheader>
          <v-subheader>Detalles</v-subheader>
          <v-list-tile avatar>
            <v-list-tile-content>
                <template v-if="isCustomerNull">
                  Agregar Cliente...
                </template>
                <template v-else>
                  <v-chip
                  >
                    <strong>{{ session.customer.name }}</strong>&nbsp;
                    <span>( {{ session.customer.phone }} )</span>
                  </v-chip>
                </template>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn :if="isCustomerNull" icon ripple @click="onAddCustomer">
                <v-icon color="black lighten-1">edit</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
        <v-layout>
        <v-flex xs12 sm6 offset-sm3>
          <v-card>
          <v-subheader>Servicios</v-subheader>
            <v-container fluid grid-list-xs>
              <v-layout row wrap>
                <v-flex
                  xs4
                  v-for="(service, n) in session.services"
                  :key="n"
                >
                  <v-card color="blue-grey darken-2" class="white--text">
                    <v-card-title primary-title>
                      <div class="headline">Name of Product</div>
                      <div>Description</div>
                      <div>Price: ${{ service.price }}</div>
                    </v-card-title>
                    <v-card-actions>
                      <v-btn flat dark>
                        <v-icon>photo</v-icon>
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>
      </v-card>
    </v-dialog>
    <!-- customers catalog -->
    <template v-if="isCatalogOpen">
      <lash-customers-catalog :isOpenDialog="isCatalogOpen" @on-value-picked="onSetCustomer"></lash-customers-catalog>
    </template>
    <!-- products catalog -->
    <template v-if="isProductCatalogOpen">
      <lash-product-catalog :isOpenDialog="isProductCatalogOpen" @on-value-picked="setService"></lash-product-catalog>
    </template>
  </v-layout>
</template>
<script>
// import { find } from 'lodash';
import utils from '../../utils';
import CustomersSearchCatalogVue from '../shared/CustomersSearchCatalog';
import ProductCatalog from '../product/ProductCatalog';

export default {
  props: ['editDialogOpened', 'sessionId'],
  data() {
    return {
      dialog: false,
      notifications: false,
      sound: true,
      widgets: false,
      isCatalogOpen: false,
      isProductCatalogOpen: false,
    };
  },
  computed: {
    currentUser() {
      return this.$store.getters.user;
    },
    session() {
      return this.$store.getters.getSessionById(this.$props.sessionId);
    },
    isCustomerNull() {
      const session = this.$store.getters.getSessionById(this.$props.sessionId);
      return typeof session.customer === 'undefined' || session.customer === null;
    },
    customers() {
      return this.$store.getters.catalog;
    },
  },
  methods: {
    saveSession() {
      utils.log('saving session...');
    },
    onCloseDialog() {
      this.$emit('on-update-service', false);
    },
    onAddCustomer() {
      this.isCatalogOpen = !this.isCatalogOpen;
      utils.log('adding customer...');
    },
    querySelections(v) {
      this.loading = true;
      // Simulated ajax query
      this.$store.dispatch('findCustomersLike', v);
    },
    onSetCustomer(customer) {
      utils.log('getting result from dialog...');
      this.isCatalogOpen = !this.isCatalogOpen;
      if (customer) {
        utils.log('customer: %s', customer);
        const payload = {
          sessionId: this.$props.sessionId,
          customer,
        };

        this.$store.commit('addCustomerToSession', payload);
      }
    },
    onAddService() {
      this.isProductCatalogOpen = !this.isProductCatalogOpen;
    },
    setService(product) {
      this.isProductCatalogOpen = !this.isProductCatalogOpen;
      if (product) {
        utils.log('adding product to session... %s', JSON.stringify(product));
        const payload = {
          sessionId: this.$props.sesionId,
          product,
        };

        this.$store.commit('addProductToSession', payload);
      }
    },
  },
  components: {
    'lash-customers-catalog': CustomersSearchCatalogVue,
    'lash-product-catalog': ProductCatalog,
  },
};

</script>