<template>
    <v-layout row>
    <v-flex >
      <v-card height="100%">
        <v-tabs class="lash-tabs" icons-and-text centered dark color="primary">
            <v-tabs-slider color="black"></v-tabs-slider>
            <v-tab href="#tab-1" class="lash-tabs">
                <v-chip
                  >
                    <strong>{{ sessions }}</strong>
                </v-chip>
                <v-icon>desktop_mac</v-icon>
            </v-tab>
            <v-tab href="#tab-2" class="lash-tabs">
                <v-chip
                  >
                    <strong>{{ queues }}</strong>
                </v-chip>
                <v-icon>history</v-icon>
            </v-tab>
            <v-tab-item
            :id="'tab-1'">
                <v-card flat>
                    <lash-sessions></lash-sessions>
                </v-card>
            </v-tab-item>
            <v-tab-item :id="'tab-2'">
                    <lash-queues></lash-queues>
            </v-tab-item>
        </v-tabs>
      </v-card>
    </v-flex>
    </v-layout>
</template>
<script>
import Sessions from './dashboard/Sessions';
import Queues from './dashboard/Queues';

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
  },
  components: {
    'lash-queues': Queues,
    'lash-sessions': Sessions,
  },
};
</script>
<style scoped>
.lash-tabs {
    height: 100%;
}
</style>

