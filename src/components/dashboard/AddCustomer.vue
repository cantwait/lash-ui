<template>
  <v-layout row justify-center>
    <v-dialog  v-model="createDialogOpened" fullscreen transition="dialog-bottom-transition" :overlay="false">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon @click.native="onDismissDialog" dark>
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Catalogo Clientes</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-text-field @input="debounceInput" color="white" prepend-icon="search" clearable placeholder="Ingrese su busqueda..." hide-details single-line></v-text-field>
          <v-btn icon>
            <v-icon>more_vert</v-icon>
          </v-btn>
        </v-toolbar>
        <v-list>
          <template v-for="(item,index) in items">
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
                  <v-icon color="blue lighten-1">content_paste</v-icon>
                </v-btn>
              </v-list-tile-action>
              <v-list-tile-action>
                <v-btn icon ripple @click="onCreateSession(item)">
                  <v-icon color="green lighten-1">add_to_queue</v-icon>
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
  </v-layout>
</template>
<script>
import { debounce } from 'lodash';
import utils from '../../utils';

export default {
  props: ['createDialogOpened'],
  data() {
    return {
      iconClass: 'grey lighten-1 white--text',
      icon: 'person',
    };
  },
  computed: {
    items() {
      return this.$store.getters.catalog;
    },
  },
  methods: {
    onDismissDialog() {
      this.$emit('on-customer-added', false);
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
  },
};

</script>
<style scoped>

</style>
