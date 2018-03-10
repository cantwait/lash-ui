<template>
<v-layout row wrap>
    <v-flex xs12 sm12 md6>
      <v-card>
        <v-toolbar color="white" light>
          <v-toolbar-title color="primary">Clientes en espera...</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn :if="canAdd" @click="onNewQueue" color="primary" icon>
            <v-icon>add</v-icon>
          </v-btn>
        </v-toolbar>
        <v-list dense>
          <template v-for="(item,index) in items">
            <v-list-tile avatar  v-bind:key="item.id" >
              <v-list-tile-avatar>
                <v-icon v-bind:class="[iconClass]">{{ icon }}</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>{{ item.customer.name }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ item.customer.phone }}</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action :if="canDelete">
                <v-btn icon ripple @click.stop="onOpenDeleteDialog(item)">
                  <v-icon color="red lighten-1">delete</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider v-if="index + 1 < items.length" v-bind:key="index"></v-divider>
          </template>
        </v-list>
      </v-card>
    </v-flex>
    <!-- delete diaglo -->
    <template v-if="isDeleteDialog">
      <lash-delete-dialog :deleteDialog="isDeleteDialog" @on-action-performed="takeDeleteAction"></lash-delete-dialog>
    </template>
    <!-- new/edit queue  -->
    <template v-if="isDialogCreateOpened">
      <lash-add-customer :createDialogOpened="isDialogCreateOpened" @on-customer-added="takeCreateAction"/>
    </template>
  </v-layout>
</template>
<script>
// import CreateQueue from './CreateQueue';
import AddCustomer from './AddCustomer';
import utils from '../../utils';

const QUEUE_CHANNEL = 'queues';
const ON_NEW_QUEUE = 'onNewQueue';
const ON_REMOVE_QUEUE = 'onRemoveQueue';

export default {
  data() {
    return {
      isDeleteDialog: false,
      isEditDialog: false,
      isDialogCreateOpened: false,
      queue: null,
      iconClass: 'grey lighten-1 white--text',
      icon: 'local_offer',
    };
  },
  computed: {
    loading() {
      return this.$store.getters.loading;
    },
    items() {
      return this.$store.getters.queues;
    },
    canDelete() {
      return this.$store.getters.isAdmin || this.$store.getters.isCashier;
    },
    canAdd() {
      return this.$store.getters.isAdmin || this.$store.getters.isCashier;
    },
  },
  created() {
    this.fetchData();
  },
  mounted() {
    const channel = this.$pusher.subscribe(QUEUE_CHANNEL);
    channel.bind(ON_NEW_QUEUE, (queue) => {
      this.$store.commit('addQueue', queue);
    });

    channel.bind(ON_REMOVE_QUEUE, (id) => {
      this.$store.commit('removeQueue', id);
    });
  },
  destroyed() {
    this.$pusher.unsubscribe(QUEUE_CHANNEL);
  },
  watch: {
    // call again the method if the route changes
    $route: 'fetchData',
  },
  methods: {
    onNewQueue() {
      utils.log('onNewQueue');
      this.isDialogCreateOpened = true;
    },
    onOpenDeleteDialog(item) {
      this.queue = item;
      utils.log('onOpenDeleteDialog');
      this.isDeleteDialog = !this.isDeleteDialog;
    },
    onOpenEditDialog(item) {
      utils.log(`onOpenEditDialog: ${JSON.stringify(item)}`);
      this.queue = item;
      this.isEditDialog = !this.isEditDialog;
    },
    onLoadMore() {
      utils.log('Loading more');
    },
    takeDeleteAction(result) {
      utils.log(`result: ${result}`);
      if (result) {
        this.$store.dispatch('removeQueue', this.queue.id);
        this.queue = null;
      }
      this.isDeleteDialog = !this.isDeleteDialog;
    },
    takeCreateAction(result) {
      this.isDialogCreateOpened = !this.isDialogCreateOpened;
      utils.log(`result: ${result}`);
      if (result) {
        // TODO save category
      }
    },
    fetchData() {
      this.$store.dispatch('getQueues');
    },
  },
  components: {
    'lash-add-customer': AddCustomer,
  },
};
</script>
<style scoped>

</style>

