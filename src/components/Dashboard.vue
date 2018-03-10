<template>
    <v-layout row>
    <v-flex >
      <v-card height="100%">
        <v-tabs class="lash-tabs" icons-and-text centered dark color="primary">
            <v-tabs-slider color="black"></v-tabs-slider>
            <v-tab href="#tab-1" class="lash-tabs">
                Sesiones
                <v-icon>desktop_mac</v-icon>
            </v-tab>
            <v-tab href="#tab-2" class="lash-tabs">
                Lista de Espera
                <v-icon>history</v-icon>
            </v-tab>
            <v-tab-item
            :id="'tab-1'">
                <v-card flat>
                    <v-card-text>Sesiones del sistema</v-card-text>
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
import Queues from './dashboard/Queues';

export default {
  data() {
    return {
      text: 'Hello',
    };
  },
  components: {
    'lash-queues': Queues,
  },
};
</script>
<style scoped>
.lash-tabs {
    height: 100%;
}
</style>

