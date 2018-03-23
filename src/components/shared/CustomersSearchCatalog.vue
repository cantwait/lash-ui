<template>
  <v-layout row justify-center>
    <v-dialog persistent v-model="isOpenDialog" scrollable max-width="400px">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon @click.native="onCloseDialog" dark>
            <v-icon>close</v-icon>
          </v-btn>
          <v-text-field @input="debounceInput" color="white" prepend-icon="search" clearable placeholder="Ingrese su busqueda..." hide-details single-line></v-text-field>
          <v-btn icon>
            <v-icon>more_vert</v-icon>
          </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text style="height: 300px;">
          <v-radio-group v-model="value" column>
            <template v-for="(item) in items">
              <v-radio :key="item.id" :label="item.name" :value="item"></v-radio>
            </template>
          </v-radio-group>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="black darken-1" flat @click.native="onPickCustomer">Guardar</v-btn>
        </v-card-actions>
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
      value: null,
      dialog: false,
    };
  },
  computed: {
    items() {
      return this.$store.getters.catalog;
    },
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
    onPickCustomer() {
      utils.log('onPickElement');
      if (this.value !== null) {
        this.$emit('on-value-picked', this.value);
      }
    },
  },
};

</script>