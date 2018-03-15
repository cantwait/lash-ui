<template>
  <v-layout row justify-center>
    <v-dialog  v-model="isOpenDialog" fullscreen transition="dialog-bottom-transition" :overlay="false">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon @click.native="onCloseDialog" dark>
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Categoria de Products</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat @click.native="toggle = !toggle">action</v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-card v-if="toggle">
          first container
        </v-card>
        <v-card v-else>
          second container
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
    };
  },
  computed: {
    otheritems() {
      return this.$store.getters.catalog;
    },
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
  },
};

</script>
<style scoped>

</style>
