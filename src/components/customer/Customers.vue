<template>
<v-layout row>
    <v-flex >
      <v-card>
        <v-list two-line subheader>
          <v-subheader inset>Clientes</v-subheader>
          <template v-for="(item,index) in items">
            <v-list-tile avatar  v-bind:key="item.id" >
              <v-list-tile-avatar>
                <v-icon v-bind:class="[iconClass]">{{ icon }}</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>{{ item.name }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ item.phone }}</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-btn icon ripple @click.stop="onOpenEditDialog(item)">
                  <v-icon color="blue lighten-1">edit</v-icon>
                </v-btn>
              </v-list-tile-action>
              <v-list-tile-action>
                <v-btn icon ripple @click.stop="onOpenDeleteDialog(item)">
                  <v-icon color="red lighten-1">delete</v-icon>
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
      <v-card-text style="height: 100px; position: relative">
      <v-btn
        absolute
        dark
        fab
        top
        right
        color="primary"
        @click.stop="onNewCustomer"
        >
        <v-icon>add</v-icon>
      </v-btn>
      </v-card-text>
    </v-flex>
    <!-- delete diaglo -->
    <template v-if="isDeleteDialog">
      <lash-delete-dialog :deleteDialog="isDeleteDialog" @on-action-performed="takeDeleteAction"></lash-delete-dialog>
    </template>
    <!-- new/edit user  -->
    <template v-if="isDialogCreateOpened">
      <lash-create-customer :createDialogOpened="isDialogCreateOpened" @on-create-customer="takeCreateAction"/>
    </template>
    <template v-if="customer && isEditDialog">
      <lash-edit-customer @on-edit-customer="takeEditAction" :editDialogOpened="isEditDialog" :customer="customer"/>
    </template>
  </v-layout>
</template>
<script>
import CreateCustomer from './CreateCustomer';
import EditCustomer from './EditCustomer';
import utils from '../../utils';

export default {
  data() {
    return {
      isDeleteDialog: false,
      isEditDialog: false,
      isDialogCreateOpened: false,
      customer: null,
      iconClass: 'grey lighten-1 white--text',
      icon: 'local_offer',
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
      return this.$store.getters.customers;
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
    onNewCustomer() {
      utils.log('onNewCustomer');
      this.isDialogCreateOpened = true;
    },
    onOpenDeleteDialog(item) {
      this.customer = item;
      utils.log('onOpenDeleteDialog');
      this.isDeleteDialog = !this.isDeleteDialog;
    },
    onOpenEditDialog(item) {
      utils.log(`onOpenEditDialog: ${JSON.stringify(item)}`);
      this.customer = item;
      this.isEditDialog = !this.isEditDialog;
    },
    onLoadMore() {
      utils.log('Loading more');
    },
    takeDeleteAction(result) {
      utils.log(`result: ${result}`);
      if (result) {
        this.$store.dispatch('removeCustomer', this.customer.id);
        this.customer = null;
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
    takeEditAction(result) {
      this.isEditDialog = !this.isEditDialog;
      utils.log(`onTakeEditAction: ${result}`);
      this.customer = null;
      if (result) {
        // TODO update category
      }
    },
    fetchData() {
      if (this.query.page !== 1) {
        this.query.page = 1;
      }
      this.$store.dispatch('getCustomers', this.query);
    },
  },
  components: {
    'lash-create-customer': CreateCustomer,
    'lash-edit-customer': EditCustomer,
  },
};
</script>
<style scoped>

</style>

