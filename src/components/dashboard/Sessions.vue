<template>
<v-layout row wrap>
    <v-flex >
      <v-card>
        <v-toolbar color="white" light>
          <v-toolbar-title color="primary">Sesiones Activas</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn v-if="canAdd" @click="onRefresh" color="primary" icon>
            <v-icon>refresh</v-icon>
          </v-btn>
          <v-btn v-if="canAdd" @click="onNewSession" color="primary" icon>
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
                <v-list-tile-title>Session # {{ index + 1 }} {{ item.customer ? item.customer.name : '' }}</v-list-tile-title>
                <v-list-tile-sub-title>
                  <lash-timeago :since="item.createdAt" :time="item.createdAt" :auto-update="60"/>
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-btn icon ripple @click.stop="onOpenServiceDialog(item)">
                  <v-icon color="black lighten-1">mode_edit</v-icon>
                </v-btn>
              </v-list-tile-action>
              <v-list-tile-action v-if="canDelete">
                <v-btn icon ripple @click.stop="onOpenDeleteDialog(item)">
                  <v-icon color="black lighten-1">delete</v-icon>
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
    <template v-if="isEditDialog">
      <lash-service-dialog :editDialogOpened="isEditDialog" :sessionId="session.id" @on-update-service="performEditAction"/>
    </template>
  </v-layout>
</template>
<script>
import utils from '../../utils';
import EditSession from './EditSession';

export default {
  data() {
    return {
      isDeleteDialog: false,
      isEditDialog: false,
      isDialogCreateOpened: false,
      session: null,
      iconClass: 'grey lighten-1 white--text',
      icon: 'watch_later',
      sessionChannel: process.env.PUSHER_SESSION_CHANNEL,
      onSessionEvt: process.env.PUSHER_ON_SESSION,
      onSessionRemoveEvt: process.env.PUSHER_ON_SESSION_REMOVE,
    };
  },
  computed: {
    loading() {
      return this.$store.getters.loading;
    },
    items() {
      return this.$store.getters.sessions;
    },
    canDelete() {
      return this.$store.getters.isAdmin;
    },
    canAdd() {
      return this.$store.getters.isAdmin
        || this.$store.getters.isCashier;
    },
    currentUser() {
      return this.$store.getters.user;
    },
  },
  created() {
    this.fetchData();
  },
  mounted() {
    const channel = this.$pusher.subscribe(this.sessionChannel);
    channel.bind(this.onSessionEvt, (session) => {
      this.$store.commit('addOrUpdateSession', session);
    });

    channel.bind(this.onSessionRemoveEvt, id => this.$store.commit('removeSession', id));
  },
  destroyed() {
    this.$pusher.unsubscribe(this.sessionChannel);
  },
  watch: {
    // call again the method if the route changes
    $route: 'fetchData',
  },
  methods: {
    onNewSession() {
      utils.log('onNewSession');
      const session = {
        owner: this.currentUser,
      };
      this.$store.dispatch('saveSession', session);
      // this.isDialogCreateOpened = true;
    },
    onOpenDeleteDialog(item) {
      this.session = item;
      utils.log('onOpenDeleteDialog');
      this.isDeleteDialog = !this.isDeleteDialog;
    },
    onLoadMore() {
      utils.log('Loading more');
    },
    takeDeleteAction(result) {
      utils.log(`result: ${result}`);
      if (result) {
        this.$store.dispatch('removeSession', this.session.id);
        // this.session = null;
      }
      this.isDeleteDialog = !this.isDeleteDialog;
    },
    performEditAction(result) {
      this.isEditDialog = !this.isEditDialog;
      utils.log(`result: ${result}`);
      if (result) {
        // TODO save
      }
    },
    fetchData() {
      this.$store.dispatch('getSessions');
    },
    onOpenServiceDialog(item) {
      utils.log(`onOpenServiceDialog: ${JSON.stringify(item)}`);
      this.session = item;
      this.isEditDialog = !this.isEditDialog;
    },
    onRefresh() {
      this.fetchData();
    },
  },
  components: {
    'lash-service-dialog': EditSession,
  },
};
</script>
<style scoped>

</style>

