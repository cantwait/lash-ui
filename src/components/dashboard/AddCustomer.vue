<template>
  <v-layout row justify-center>
    <v-dialog  v-model="createDialogOpened" fullscreen transition="dialog-bottom-transition" :overlay="false">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon @click.native="onDismissDialog" dark>
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title></v-toolbar-title>
          <v-spacer></v-spacer>
          <v-text-field v-model="searchInput" @input="debounceInput" color="white" prepend-icon="search" clearable placeholder="Ingrese su busqueda..." hide-details single-line></v-text-field>
          <v-menu bottom left>
            <v-btn icon slot="activator" >
              <v-icon>more_vert</v-icon>
            </v-btn>
            <v-list>
              <v-list-tile @click="onCreateNewCustomer">
                <v-list-tile-title>Crear Cliente</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-toolbar>
        <v-list>
          <template v-if="items.length === 0 && searchInitialized">
            Sin Resultado...
          </template>
          <template v-else v-for="(item,index) in items">
            <v-list-tile avatar  v-bind:key="item.id" >
              <v-list-tile-avatar>
                <v-icon v-bind:class="[iconClass]">{{ icon }}</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>{{ item.name }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ item.phone }}</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-btn icon ripple @click="onAddToQueue(item)">
                  <v-icon color="black lighten-1">content_paste</v-icon>
                </v-btn>
              </v-list-tile-action>
              <v-list-tile-action>
                <v-btn icon ripple @click="onCreateSession(item)">
                  <v-icon color="black lighten-1">add_to_queue</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider v-if="index + 1 < items.length" v-bind:key="index"></v-divider>
          </template>
        </v-list>
        <v-divider></v-divider>
        <v-list three-line subheader>
        </v-list>
      </v-card>
    </v-dialog>
    <template v-if="isDialogCreateOpened">
      <lash-create-customer :createDialogOpened="isDialogCreateOpened" @on-create-customer="onCustomerCreated"/>
    </template>
  </v-layout>
</template>
<script>
import { debounce } from 'lodash';
import CreateCustomer from '../customer/CreateCustomer';
import utils from '../../utils';

export default {
  props: ['createDialogOpened'],
  data() {
    return {
      iconClass: 'grey lighten-1 white--text',
      icon: 'person',
      searchInitialized: false,
      isDialogCreateOpened: false,
      searchInput: null,
    };
  },
  computed: {
    items() {
      return this.$store.getters.catalog;
    },
    currentUser() {
      return this.$store.getters.user;
    },
  },
  methods: {
    onCreateNewCustomer() {
      utils.log('creating new customer...');
      this.isDialogCreateOpened = !this.isDialogCreateOpened;
    },
    onCustomerCreated(result) {
      if (result) {
        this.isDialogCreateOpened = !this.isDialogCreateOpened;
        this.$store.dispatch('findCustomersLike', this.searchInput);
      }
    },
    onDismissDialog() {
      this.$emit('on-customer-added', false);
    },
    // eslint-disable-next-line
    debounceInput: debounce(function (e) {
      if (e && e.length > 0) {
        this.searchInitialized = true;
        this.$store.dispatch('findCustomersLike', e);
      }
    }, 1000),
    onAddToQueue(item) {
      this.$store.dispatch('saveQueue', item);
    },
    onCreateSession(item) {
      utils.log('creating session...: %s', JSON.stringify(item));
      const session = {
        owner: this.currentUser,
        customer: item,
      };
      this.$store.dispatch('saveSession', session);
      this.$store.commit('removeCustomerFromCatalog', { customer: item });
    },
  },
  components: {
    'lash-create-customer': CreateCustomer,
  },
};

</script>
<style scoped>

</style>
