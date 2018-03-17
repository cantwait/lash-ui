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
            <v-btn v-if="canFinalize" dark flat @click.native="onFinalizeSession">
              <v-icon>move_to_inbox</v-icon>
            </v-btn>
            <v-btn dark flat @click.native="onAddService">
              <v-icon>add_circle</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-list three-line subheader>
          <v-subheader>Detalles</v-subheader>
          <v-divider/>
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
                <v-chip
                  >
                    <strong>$&nbsp;{{ session.total }}</strong>
                  </v-chip>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn :if="isCustomerNull" icon ripple @click="onAddCustomer">
                <v-icon color="black lighten-1">edit</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
        <v-layout>
        <v-flex >
          <v-card>
            <v-divider/>
            <v-subheader>Servicios</v-subheader>
            <v-divider />
            <v-list two-line>
            <template v-for="(service, index) in session.services">
              <v-list-tile :key="index">
                <v-list-tile-content >
                  <v-list-tile-title>{{ service.name }}</v-list-tile-title>
                  <v-list-tile-sub-title class="text--primary">Descripcion: {{ service.description }}</v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action >
                    <v-list-tile-action-text>Precio: ${{ service.price }}</v-list-tile-action-text>
                </v-list-tile-action>
              </v-list-tile>
              <v-divider v-if="index + 1 < session.services.length" :key="service.id"></v-divider>
          </template>
        </v-list>

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
      <lash-product-catalog :isOpenDialog="isProductCatalogOpen" @on-value-picked="setServices"></lash-product-catalog>
    </template>
    <template v-if="isRatingCatalogOpen">
      <lash-session-rating :isOpenDialog="isRatingCatalogOpen" @on-rating-action="finalizeSession"/>
    </template>
  </v-layout>
</template>
<script>
// import { find } from 'lodash';
import utils from '../../utils';
import CustomersSearchCatalogVue from '../shared/CustomersSearchCatalog';
import RatingSession from './RatingSession';
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
      isRatingCatalogOpen: false,
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
    canFinalize() {
      return this.$store.getters.isAdmin || this.$store.isCashier;
    },
    customers() {
      return this.$store.getters.catalog;
    },
  },
  watch: {
    session: (newVal) => {
      debugger;
      if (!newVal) {
        this.editDialogOpened = !this.editDialogOpened;
      }
    },
  },
  methods: {
    onFinalizeSession() {
      utils.log('opening rating component!...');
      this.isRatingCatalogOpen = !this.isRatingCatalogOpen;
    },
    finalizeSession(result) {
      if (result.valid) {
        // TODO finish session logic here...
      }
      this.isRatingCatalogOpen = !this.isRatingCatalogOpen;
    },
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
        this.$store.dispatch('updateSession', payload);
        // this.$store.commit('addCustomerToSession', payload);
      }
    },
    onAddService() {
      this.isProductCatalogOpen = !this.isProductCatalogOpen;
    },
    setServices(products) {
      this.isProductCatalogOpen = !this.isProductCatalogOpen;
      if (products) {
        utils.log('adding product to session... %s', JSON.stringify(products));
        const payload = {
          sessionId: this.$props.sessionId,
          services: products,
          user: this.currentUser,
        };
        this.$store.dispatch('updateSession', payload);
        // this.$store.commit('addProductToSession', payload);
      }
    },
  },
  components: {
    'lash-customers-catalog': CustomersSearchCatalogVue,
    'lash-product-catalog': ProductCatalog,
    'lash-session-rating': RatingSession,
  },
};

</script>

<style scoped>
.list {
  padding: 8px 0 0 0;
}
</style>
