<template>
  <v-layout row justify-center>
    <v-dialog persistent v-model="isOpenDialog" scrollable max-width="400px">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon @click.native="onCloseDialog" dark>
            <v-icon>close</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-text-field v-model="searchInput" @input="debounceInput" color="white" prepend-icon="search" clearable placeholder="Ingrese su busqueda..." hide-details single-line></v-text-field>
          <v-btn icon @click="onCreateNewCustomer">
            <v-icon>add</v-icon>
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card height="400px">
          <v-list two-line>
          <template v-for="(item, index) in items">
            <v-list-tile
              avatar
              ripple
              :key="item.title"
            >
              <v-list-tile-content>
                <v-list-tile-title>{{ item.name }}</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-list-tile-action-text>{{ item.phone }}</v-list-tile-action-text>
              </v-list-tile-action>
              <v-list-tile-action>
                <v-btn icon ripple @click="onPickCustomer(item)">
                  <v-icon color="grey lighten-1">add_circle</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider v-if="index + 1 < items.length" :key="index"></v-divider>
          </template>
        </v-list>
        </v-card>
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
  props: ['isOpenDialog'],
  data() {
    return {
      isDialogCreateOpened: false,
      searchInput: '',
    };
  },
  computed: {
    items() {
      return this.$store.getters.catalog;
    },
  },
  created() {
    this.$store.commit('setCatalog', []);
  },
  methods: {
    // eslint-disable-next-line
    debounceInput: debounce(function (e) {
      if (e && e.length > 0) {
        this.$store.dispatch('findCustomersLike', e);
      }
    }, 1000),
    onCloseDialog() {
      utils.log('onCloseDialog');
      this.$emit('on-value-picked', null);
    },
    onPickCustomer(item) {
      utils.log('onPickElement: %s', item);
      this.$emit('on-value-picked', item);
    },
    onCustomerAdded(customer) {
      utils.log('customer added: %s', customer);
    },
    onCreateNewCustomer() {
      utils.log('creating new customer...');
      this.isDialogCreateOpened = !this.isDialogCreateOpened;
    },
    onCustomerCreated(result) {
      if (result) {
        utils.log('valor de busqueda: %s', this.searchInput);
        setTimeout(() => this.$store.dispatch('findCustomersLike', this.searchInput), 1000);
      }
      this.isDialogCreateOpened = !this.isDialogCreateOpened;
    },
  },
  components: {
    'lash-create-customer': CreateCustomer,
  },
};

</script>