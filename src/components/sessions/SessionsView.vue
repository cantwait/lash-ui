<template>
  <v-dialog v-model="viewDialogOpened" persistent max-width="500px"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    scrollable>
    <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click.native="onDismissDialog">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Detalles de Sesión</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
          </v-toolbar-items>
        </v-toolbar>
        <v-list two-line subheader>
          <v-subheader>General</v-subheader>
          <v-list-tile >
            <v-list-tile-content>
              <v-list-tile-title>Creada por</v-list-tile-title>
              <v-list-tile-sub-title>{{session.owner.name}} - {{ session.createdAt | date }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile >
            <v-list-tile-content>
              <v-list-tile-title>Cliente</v-list-tile-title>
              <v-list-tile-sub-title>{{ session.customer.name }} - {{ session.customer.phone }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile >
            <v-list-tile-content>
              <v-list-tile-title>Pagado</v-list-tile-title>
              <v-list-tile-sub-title>$ {{ session.total > 0 ? session.total : session.subtotal | formatNumber }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile >
            <v-list-tile-content>
              <v-list-tile-title>Cobrado en</v-list-tile-title>
              <v-list-tile-sub-title>$ {{ session.transactionType | formatTransaction }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <v-list one-line subheader >
          <v-subheader>Servicios</v-subheader>
          <v-list-tile avatar v-for="(service) in session.services" v-bind:key="service.id">
            <v-list-tile-content>
              <v-list-tile-title>{{ service.name }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ service.responsible.name }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn icon ripple @click="onEditResponsible(service)">
                <v-icon color="black lighten-1">assignment_ind</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-card>
      <!-- customers catalog -->
      <template v-if="isCatalogOpen">
        <lash-resp-catalog :isOpenDialog="isCatalogOpen" @on-value-picked="onSetUser"></lash-resp-catalog>
      </template>
    </v-dialog>
</template>
<script>
import utils from '../../utils';
import UserSearchCatalog from '../shared/UsersSearchCatalog';


export default {
  props: ['viewDialogOpened', 'session'],
  data() {
    return {
      isCatalogOpen: false,
      service: null,
    };
  },
  computed: {
  },
  methods: {
    onDismissDialog() {
      this.$emit('on-view-session', false);
    },
    onEditResponsible(service) {
      this.service = service;
      this.isCatalogOpen = !this.isCatalogOpen;
      utils.log('editing responsible...');
    },
    onSetUser(result) {
      if (result && this.service) {
        this.service.responsible = result;
        const payload = {
          sessionId: this.$props.session.id,
          service: this.service,
        };
        this.$store.dispatch('updatePaginatedSessionItems', payload);
      }
      this.isCatalogOpen = !this.isCatalogOpen;
      this.service = null;
    },
  },
  filters: {
    formatNumber(val) {
      if (!val) return '';
      // eslint-disable-next-line
      return Number(Math.round(val+'e'+2)+'e-'+2);
    },
    formatTransaction(val) {
      if(!val) return '';
      return val === 'card' ? 'Tarjeta' : 'Efectivo';
    },
  },
  components: {
    'lash-resp-catalog': UserSearchCatalog,
  },
};
</script>
<style scoped>

</style>


