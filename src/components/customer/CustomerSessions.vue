<template>
  <v-layout row justify-center>
    <v-dialog v-model="sessionsDialog" fullscreen transition="dialog-bottom-transition" :overlay="false">
      <v-card>
        <v-flex>
        <v-card>
          <v-toolbar light color="primary">
            <v-btn icon @click.native="onCloseSessionDialog">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Sesiones del Cliente</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-expansion-panel popout>
            <v-expansion-panel-content v-for="(item,i) in items" :key="i">
              <div slot="header">{{ item.createdAt | date(('%d/%m/%Y %I:%M:%s %p')) }} - ${{item.subtotal}}</div>
              <v-card>
                <v-card-title primary-title v-for="(service, index) in item.services" :key="index">
                  <div>
                    <h3>{{ service.name }}</h3>
                    <div>{{ service.price }}</div>
                  </div>
                </v-card-title>
                <v-card-text>
                  <div>Rating:
                    <star-rating :star-size="15" :rating="item.rating" :read-only="true"></star-rating>
                  </div>
                  <div>Comentario:
                    {{item.comment}}
                  </div>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-card>
      </v-flex>
     </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
import StarRating from 'vue-star-rating';
import utils from '../../utils';

export default {
  props: ['sessionsDialog', 'customer'],
  computed: {
    items() {
      return this.$store.getters.getSessionsByCustomer;
    },
  },
  data() {
    return {
    };
  },
  methods: {
    onCloseSessionDialog() {
      this.$emit('on-action-performed', true);
    },
  },
  created() {
    utils.log('onCreated hook!');
    this.$store.dispatch('getSessionsByCustomer', this.$props.customer.id);
  },
  components: {
    'star-rating': StarRating,
  },
};

</script>

<style scoped>
.card__title {
  padding: 1px 10px 1px 10px;
}
</style>
