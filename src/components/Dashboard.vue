<template>
    <v-layout row>
    <v-flex >
      <v-card height="100%">
        <v-tabs class="lash-tabs" icons-and-text centered ligth color="primary">
            <v-tabs-slider color="black"></v-tabs-slider>
            <v-tab href="#tab-1" class="lash-tabs">
                Sesiones
                <v-chip
                  >
                    <strong>{{ sessions }}</strong>
                </v-chip>
                <!-- <v-icon>desktop_mac</v-icon> -->

            </v-tab>
            <v-tab href="#tab-2" class="lash-tabs">
                Espera
                <v-chip
                  >
                    <strong>{{ queues }}</strong>
                </v-chip>
                <!-- <v-icon>history</v-icon> -->
            </v-tab>
            <v-tab href="#tab-3" class="lash-tabs">
                Precios
                <v-chip
                  >
                    <strong>{{ categories }}</strong>
                </v-chip>
                <!-- <v-icon>shopping_cart</v-icon> -->
            </v-tab>
            <v-tab v-if="isAdminOrCashier" href="#tab-4" class="lash-tabs">
                Balance
              <v-chip>0
              </v-chip>
            </v-tab>
            <v-tab-item :id="'tab-1'">
                    <lash-sessions></lash-sessions>
            </v-tab-item>
            <v-tab-item :id="'tab-2'">
                    <lash-queues></lash-queues>
            </v-tab-item>
            <v-tab-item :id="'tab-3'">
                    <lash-catalog></lash-catalog>
            </v-tab-item>
             <v-tab-item :id="'tab-4'">
                    <lash-balance/>
            </v-tab-item>
        </v-tabs>
      </v-card>
    </v-flex>
    </v-layout>
</template>
<script>
import Sessions from './dashboard/Sessions';
import Queues from './dashboard/Queues';
import ProductsPerCategory from './shared/ProductsPerCategory';
import Balance from './dashboard/Balance';

export default {
  data() {
    return {
      text: 'Hello',
    };
  },
  computed: {
    sessions() {
      return this.$store.getters.sessions.length;
    },
    queues() {
      return this.$store.getters.queues.length;
    },
    categories() {
      return this.$store.getters.categories.length;
    },
    isAdminOrCashier() {
      return this.$store.getters.isAdmin || this.$store.getters.isCashier;
    },
  },
  components: {
    'lash-queues': Queues,
    'lash-sessions': Sessions,
    'lash-catalog': ProductsPerCategory,
    'lash-balance': Balance,

  },
};
</script>
<style scoped>
.lash-tabs {
    height: 100%;
}
.chip :first-child {
  padding: 0 4px !important;
  height: 15px !important;
}
</style>

