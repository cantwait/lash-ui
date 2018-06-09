<template>
<v-layout row>
    <v-flex >
      <v-card>
        <v-list threed-line subheader>
          <v-toolbar dark color="primary">
            <v-spacer></v-spacer>
            <!-- <v-text-field v-model="searchInput" @input="debounceInput" color="white" prepend-icon="search" clearable placeholder="Ingrese su busqueda..." hide-details single-line></v-text-field> -->
          </v-toolbar>
          <v-subheader inset>Sesiones de Cliente</v-subheader>
          <template v-for="(item,index) in items">
            <v-list-tile avatar  v-bind:key="item.id" >
              <v-list-tile-avatar>
                <v-icon v-bind:class="[iconClass]">{{ icon }}</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>{{ item.customer.name }}</v-list-tile-title>
                <v-list-tile-sub-title>${{ (item.total || item.subtotal) | formatNumber }} - {{ item.createdAt | date(('%d/%m/%Y %I:%M:%s %p')) }}</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-btn icon ripple @click.stop="onOpenViewSession(item)">
                  <v-icon color="black lighten-1">pageview</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider v-if="index + 1 < items.length" v-bind:key="index"></v-divider>
          </template>
        </v-list>
      </v-card>
      <v-container>
        <v-layout justify-center align-center>
          <v-btn @click.stop="onLoadMore" flat :loading="loading">Cargar más</v-btn>
        </v-layout>
      </v-container>
    </v-flex>
    <template v-if="session && isViewSession">
      <lash-sessions-view @on-view-session="onSessionViewed" :editDialogOpened="isViewSession" :session="session"/>
    </template>
  </v-layout>
</template>
<script>
import SessionsView from './SessionsView';
import utils from '../../utils';

export default {
  data() {
    return {
      isViewSession: false,
      session: null,
      iconClass: 'grey lighten-1 white--text',
      icon: 'money',
      itemDeletable: null,
      query: {
        page: 1,
        perPage: 5,
      },
    };
  },
  computed: {
    loading() {
      return this.$store.getters.loading;
    },
    items() {
      return this.$store.getters.sessionsPaginated;
    },
  },
  created() {
    this.fetchData();
  },
  watch: {
    // call again the method if the route changes
    $route: 'fetchData',
  },
  methods: {
    fetchData() {
      if (this.query.page !== 1) {
        this.query.page = 1;
      }
      this.$store.dispatch('getSessionsPaginated', this.query);
    },
    onOpenViewSession(item) {
      utils.log(`Opening Session from customer: ${item.customer.name} - ${item.subtotal}`);
    },
    onLoadMore() {
      utils.log('Loading more');
      this.query.page += 1;
      this.$store.dispatch('getSessionsPaginated', this.query);
    },
    onSessionViewed(result) {
      this.isViewSession = !this.isViewSession;
      utils.log(`onTakeEditAction: ${result}`);
      if (result) {
        // nothing
      }
    },
  },
  components: {
    'lash-sessions-view': SessionsView,
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

</style>

