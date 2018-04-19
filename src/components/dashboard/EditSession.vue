<template>
  <v-layout row justify-center>
    <v-dialog v-model="editDialogOpened" fullscreen transition="dialog-bottom-transition" :overlay="false">
      <v-card>
        <v-toolbar light color="primary">
          <v-btn icon @click.native="onCloseDialog" >
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Servicios</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn v-if="canFinalize && session.services.length > 0 && session.customer !== null"  flat @click.native="onFinalizeSession">
              <v-icon>move_to_inbox</v-icon>
            </v-btn>
            <v-btn  flat @click.native="onAddService">
              <v-icon>add_circle</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-flex xs12>
          <v-layout row>
            <v-flex xs10>
              <v-card  class="lash-padding" tile flat>
                <v-card-text
                >
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
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs2>
              <v-card class="lash-padding"  tile flat>
                <v-card-text>
                <template v-if="isCustomerNull && caddAddCustomer">
                  <v-btn icon ripple @click="onAddCustomer">
                    <v-icon color="black lighten-1">edit</v-icon>
                  </v-btn>
                </template>
                <template v-else>
                  <v-btn v-if="!isCustomerNull" icon  @click="onAddPhoto">
                    <v-icon color="black lighten-1">camera_enhance</v-icon>
                  </v-btn>
                </template>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12 v-if="caddAddCustomer && session.services.length > 0">
            <v-layout row>
              <v-flex xs10>
                <v-card class="lash-padding" tile flat>
                  <v-card-text>IMPUESTO?</v-card-text>
                </v-card>
              </v-flex>
              <v-flex  xs2>
                <v-card class="lash-padding" tile flat>
                  <v-card-text>
                    <v-switch @change="onItbmChange" class="lash-switch" v-model="session.isTax"></v-switch>
                  </v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
          </v-flex>

          <v-flex xs12 v-if="caddAddCustomer && session.services.length > 0">
            <v-layout row>
              <v-flex xs10>
                <v-card class="lash-padding padding30" tile flat>
                  <v-card-text>TARJETA/EFECTIVO</v-card-text>
                </v-card>
              </v-flex>
              <v-flex  xs2>
                <v-card class="lash-padding" tile flat>
                  <v-card-text>
                    <v-radio-group @change="onTransactionTypeChange" v-model="session.transactionType">
                      <v-radio label="E" value="cash"></v-radio>
                      <v-radio label="T" value="card"></v-radio>
                    </v-radio-group>
                  </v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
          </v-flex>


          <v-flex xs12 v-if="caddAddCustomer && session.services.length > 0">
            <v-layout row>
              <v-flex  xs10>
                <v-card class="lash-padding" tile flat>
                  <v-card-text>SUBTOTAL</v-card-text>
                </v-card>
              </v-flex>
              <v-flex xs2>
                <v-card class="lash-padding" tile flat>
                  <v-card-text>
                    <v-chip>
                      <strong>$&nbsp;{{ session.subtotal | formatNumber}}</strong>
                    </v-chip>
                  </v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
          </v-flex>


          <v-flex  xs12 v-if="caddAddCustomer && session.services.length > 0 && session.isTax">
            <v-layout row>
              <v-flex xs10>
                <v-card class="lash-padding" tile flat>
                  <v-card-text>ITBMS</v-card-text>
                </v-card>
              </v-flex>
              <v-flex xs2>
                <v-card class="lash-padding" tile flat>
                  <v-card-text>
                    <v-chip>
                    <strong>$&nbsp;{{ session.itbms | formatNumber}}</strong>
                    </v-chip>
                  </v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
          </v-flex>

          <v-flex xs12 v-if="caddAddCustomer && session.services.length > 0 && session.isTax">
            <v-layout row>
              <v-flex xs10>
                <v-card class="lash-padding" tile flat>
                  <v-card-text>TOTAL</v-card-text>
                </v-card>
              </v-flex>
              <v-flex xs2>
                <v-card class="lash-padding" tile flat>
                  <v-card-text>
                    <v-chip>
                      <strong>$&nbsp;{{ session.total | formatNumber}}</strong>
                    </v-chip>
                  </v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
          </v-flex>
        <!-- <v-list subheader>
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
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn v-if="isCustomerNull && caddAddCustomer" icon ripple @click="onAddCustomer">
                <v-icon color="black lighten-1">edit</v-icon>
              </v-btn>
            </v-list-tile-action>
            <v-list-tile-action>
              <v-btn v-if="!isCustomerNull" icon ripple @click="onAddPhoto">
                <v-icon color="black lighten-1">camera_enhance</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>
              Tipo de pago
            </v-list-tile-content>
            <list-tile-action>
              <v-radio-group v-model="radios" :mandatory="false">
                <v-radio label="Radio 1" value="radio-1"></v-radio>
                <v-radio label="Radio 2" value="radio-2"></v-radio>
              </v-radio-group>
            </list-tile-action>
          </v-list-tile>
          <v-list-tile avatar v-if="caddAddCustomer && session.services.length > 0">
            <v-list-tile-content>
                Usa Impuesto ?
            </v-list-tile-content>
            <v-list-tile-action>
              <v-switch @change="onItbmChange" v-model="session.isTax"></v-switch>
            </v-list-tile-action>
          </v-list-tile>
          <v-list-tile avatar>
            <v-list-tile-content>
                Subtotal
            </v-list-tile-content>
            <v-list-tile-action>
              <v-chip
                  >
                    <strong>$&nbsp;{{ session.subtotal | formatNumber}}</strong>
                </v-chip>
            </v-list-tile-action>
          </v-list-tile>
          <v-list-tile avatar v-if="session.isTax">
            <v-list-tile-content>
                ITBMS
            </v-list-tile-content>
            <v-list-tile-action>
              <v-chip
                  >
                    <strong>$&nbsp;{{ session.itbms | formatNumber}}</strong>
                </v-chip>
            </v-list-tile-action>
          </v-list-tile>
          <v-list-tile avatar v-if="session.isTax">
            <v-list-tile-content>
                Total
            </v-list-tile-content>
            <v-list-tile-action>
              <v-chip
                  >
                    <strong>$&nbsp;{{ session.total | formatNumber}}</strong>
                </v-chip>
            </v-list-tile-action>
          </v-list-tile>
        </v-list> -->
        <v-layout>
        <v-flex >
          <v-card>
            <v-divider/>
            <v-subheader>Servicios</v-subheader>
            <v-divider />
            <v-list two-line v-for="(service, index) in session.services" :key="index">
              <v-list-tile>
                <v-list-tile-content >
                  <v-list-tile-title>{{ service.name }}</v-list-tile-title>
                  <v-list-tile-sub-title class="text--primary">Descripcion: {{ service.description }}</v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action >
                    <v-list-tile-action-text class="lash__list__tile__action__text">{{ service.responsible.name }}</v-list-tile-action-text>
                </v-list-tile-action>
                <v-list-tile-action >
                    <v-list-tile-action-text>Precio: ${{ service.price }}</v-list-tile-action-text>
                </v-list-tile-action>
                <v-list-tile-action v-if="canFinalize">
                  <v-btn icon ripple @click="onRemoveProduct(service)">
                    <v-icon>delete</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
              <v-divider v-if="index + 1 < session.services.length"></v-divider>
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
    <!-- delete diaglo -->
    <template v-if="isDeleteDialog">
      <lash-delete-dialog :deleteDialog="isDeleteDialog" @on-action-performed="onProductRemoved"></lash-delete-dialog>
    </template>
  </v-layout>
</template>
<script>
// import { find } from 'lodash';
import utils from '../../utils';
import DeleteDialog from '../shared/DeleteDialog';
import CustomersSearchCatalogVue from '../shared/CustomersSearchCatalog';
import RatingSession from './RatingSession';
import ProductCatalog from '../product/ProductCatalog';

const STATE_CLOSED = 'closed';

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
      isPictureDialogOpen: false,
      isDeleteDialog: false,
      productIdRemoved: null,
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
      return this.$store.getters.isAdmin || this.$store.getters.isCashier;
    },
    customers() {
      return this.$store.getters.catalog;
    },
    caddAddCustomer() {
      return this.$store.getters.isCashier || this.$store.getters.isAdmin;
    },
  },
  watch: {
    session: (newVal) => {
      utils.log('cambio...');
      if (!newVal) {
        this.editDialogOpened = !this.editDialogOpened;
      }
    },
  },
  methods: {
    onProductRemoved() {
      this.isDeleteDialog = !this.isDeleteDialog;
      const payload = {
        sessionId: this.$props.sessionId,
        serviceRemove: this.serviceRemove,
        isTax: this.session.isTax,
      };
      this.$store.dispatch('updateSession', payload);
      this.serviceRemove = null;
    },
    onRemoveProduct(service) {
      this.serviceRemove = service;
      this.isDeleteDialog = !this.isDeleteDialog;
    },
    onFinalizeSession() {
      utils.log('opening rating component!...');
      this.isRatingCatalogOpen = !this.isRatingCatalogOpen;
    },
    finalizeSession(result) {
      const payload = {
        sessionId: this.$props.sessionId,
        state: STATE_CLOSED,
        rating: result.rating,
        comment: result.comment,
      };
      this.$store.dispatch('updateSession', payload);
      this.isRatingCatalogOpen = !this.isRatingCatalogOpen;
      this.$emit('on-update-service', false);
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
    onTransactionTypeChange() {
      const payload = {
        sessionId: this.$props.sessionId,
        transactionType: this.session.transactionType,
      };
      this.$store.dispatch('updateSession', payload);
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
      }
    },
    onAddPhoto() {
      utils.log('adding photo...');
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
          isTax: this.session.isTax,
        };
        this.$store.dispatch('updateSession', payload);
      }
    },
    onItbmChange() {
      if (this.session.services.length > 0) {
        utils.log('updating itbms and total');
        const payload = {
          sessionId: this.$props.sessionId,
          isTax: this.session.isTax,
        };
        this.$store.dispatch('updateSession', payload);
      }
    },
  },
  components: {
    'lash-customers-catalog': CustomersSearchCatalogVue,
    'lash-product-catalog': ProductCatalog,
    'lash-session-rating': RatingSession,
    'lash-delete-dialog': DeleteDialog,
  },
  filters: {
    formatNumber(val) {
      if (!val) return '';
      // eslint-disable-next-line
      return Number(Math.round(val+'e'+2)+'e-'+2);
    },
  },
};

</script>

<style scoped>
.list {
  padding: 8px 0 0 0;
}
.lash__list__tile__action__text {
  padding: 0 10px 0 0;
}
.lash-switch :last-child {
  min-height: 0px !important;
}
.lash-padding .card__text {
  padding: 5px 16px 5px 16px !important;
}

.padding30 {
  padding: 30px 0px
}

</style>
