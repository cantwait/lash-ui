<template>
  <v-layout row justify-center>
    <v-dialog v-model="isOpen" fullscreen transition="dialog-bottom-transition" :overlay="false">
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon @click.native="onCloseViewDialog" dark>
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-carousel>
          <v-carousel-item class="lash__jumbotron__img" :cycle="`false`" transition="fade" reverse-transition="fade" v-for="(p) in pics" :src="p.url" :key="p.id"></v-carousel-item>
        </v-carousel>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
import Vue from 'vue';
import out from '../../utils';

export default Vue.extend({
  methods: {
    onCloseViewDialog() {
      out.log('closing!');
      this.$emit('on-close-view-dialog', true);
    },
  },
  props: ['isOpen', 'selectedPic', 'pics'],
  data() {
    return {
    };
  },

});

</script>
<style scoped>
.carousel :last-child {
  display: block !important;
}
.lash__jumbotron__img :first-child:first-child {
  height: 100% !important;
}
</style>

