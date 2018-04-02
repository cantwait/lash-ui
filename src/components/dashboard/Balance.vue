<template>
  <v-layout row>
    <v-flex >
      <v-card>
        <v-list >
          <v-list-tile>
            <v-list-tile-action>
              <v-icon color="black"></v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Fecha</v-list-tile-title>
              <!-- <v-list-tile-sub-title>Mobile</v-list-tile-sub-title> -->
            </v-list-tile-content>
            <v-list-tile-action>
              <v-menu
                ref="menu"
                lazy
                :close-on-content-click="false"
                v-model="menu"
                transition="scale-transition"
                offset-y
                :return-value.sync="date"
              >
                <v-text-field
                  slot="activator"
                  v-model="date"
                  prepend-icon="event"
                  readonly
                ></v-text-field>
                <v-date-picker v-model="date" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn flat color="black" @click="menu = false">Cancelar</v-btn>
                  <v-btn flat color="black" @click="onDatePicked">OK</v-btn>
                </v-date-picker>
              </v-menu>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider inset></v-divider>
          <v-list-tile>
            <v-list-tile-action>
              <v-icon color="black">show_chart</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Total de Sesiones</v-list-tile-title>
              <!-- <v-list-tile-sub-title>Mobile</v-list-tile-sub-title> -->
            </v-list-tile-content>
            <v-list-tile-action>
              {{balance.sessions}}
            </v-list-tile-action>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-action>
              <v-icon color="black">show_chart</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Total de Servicios</v-list-tile-title>
              <!-- <v-list-tile-sub-title>Work</v-list-tile-sub-title> -->
            </v-list-tile-content>
            <v-list-tile-action>
              {{balance.services}}
            </v-list-tile-action>
          </v-list-tile>
          <v-divider inset></v-divider>
          <v-list-tile>
            <v-list-tile-action>
              <v-icon color="black">attach_money</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Ingreso total</v-list-tile-title>
              <!-- <v-list-tile-sub-title>Personal</v-list-tile-sub-title> -->
            </v-list-tile-content>
            <v-list-tile-action>
              {{balance.total | formatNumber}}
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
// import * as moment from 'moment';

export default {
  data() {
    return {
      total: 1000,
      sesiones: 10,
      services: 16,
      date: null,
      menu: false,
      modal: false,
    };
  },
  computed: {
    balance() {
      return this.$store.getters.balance;
    },
  },
  mounted() {
    // this.getBalance();
  },
  methods: {
    getBalance() {
      this.$store.dispatch('getBalance', this.date);
    },
    onDatePicked() {
      this.$refs.menu.save(this.date);
      this.getBalance();
    },
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
.input-group {
  padding: 0 0 0 0 !important;
}
</style>