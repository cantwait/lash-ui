<template>
  <v-layout row justify-center>
    <v-dialog v-model="sessionsDialog" fullscreen transition="dialog-bottom-transition" :overlay="false">
      <v-card>
        <v-flex >
        <v-card>
          <v-toolbar light color="primary">
            <v-btn icon @click.native="onCloseSessionDialog">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Sesiones del Usuario: {{ user.name }}</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card v-if="items.length > 0">
            <v-card-title>Total Comisiones: ${{ totalFee | formatNumber}}</v-card-title>
          </v-card>
          <v-expansion-panel popout>
            <v-expansion-panel-content v-for="(item,i) in items" :key="i">
              <div slot="header">{{ items[i][0].createdAt | date(('%d/%m/%Y %I:%M:%s %p')) }} - ${{partialFee[i].subTotal | formatNumber}}</div>
              <v-card v-for="(session, index) in items[i]" :key="index">
                <v-card-title class="lash__card__tile" primary-title >
                  <div>
                    <h3>{{ session.services.name }}</h3>
                    <div>{{ session.services.price }}</div>
                  </div>
                </v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <div v-if="session.services.generateFee">Comisión:
                      {{session.services.price * (session.services.responsible.fee / 100) | formatNumber}}
                  </div>
                </v-card-actions>
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
import utils from '../../utils';

export default {
  props: ['sessionsDialog', 'user'],
  computed: {
    items() {
      return this.$store.getters.sessionsByUser;
    },
    totalFee() {
      return this.$store.getters.totalFee;
    },
    partialFee() {
      return this.$store.getters.partialFee;
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
    this.$store.dispatch('getSessionsByUser', this.$props.user.id);
  },
  filters: {
    formatNumber(val) {
      if (!val) return '';
      // eslint-disable-next-line
      return Number(Math.round(val+'e'+3)+'e-'+3);
    },
  },
};

</script>

<style scoped>
.card__title {
  padding: 1px 10px 1px 10px;
}
</style>
