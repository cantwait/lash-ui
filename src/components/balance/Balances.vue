<template>
<v-layout row>
    <v-flex >
      <v-card>
        <v-list threed-line subheader>
          <v-subheader inset>Balance</v-subheader>
          <template v-for="(item,index) in items">
            <v-list-tile avatar  v-bind:key="item.id" >
              <v-list-tile-avatar>
                <v-icon v-bind:class="[iconClass]">{{ item.mode === 'income' ? 'trending_up' : 'trending_down' }}</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>{{ item.mode | mode }}</v-list-tile-title>
                <v-list-tile-sub-title>${{ item.amount | formatNumber }} - {{ item.createdAt | date(('%d/%m/%Y %I:%M:%s %p')) }}</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-btn icon ripple @click.stop="onOpenEditDialog(item)">
                  <v-icon color="black lighten-1">edit</v-icon>
                </v-btn>
              </v-list-tile-action>
              <v-list-tile-action>
                <v-btn icon ripple @click.stop="onOpenDeleteDialog(item)">
                  <v-icon color="black lighten-1">delete</v-icon>
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
        @click.stop="onNewCategory"
        >
        <v-icon>add</v-icon>
      </v-btn>
      </v-card-text>
    </v-flex>
    <!-- delete diaglo -->
    <template v-if="isDeleteDialog">
      <lash-delete-dialog :deleteDialog="isDeleteDialog" @on-action-performed="onBalanceDeleted"></lash-delete-dialog>
    </template>
    <!-- new/edit user  -->
    <template v-if="isDialogCreateOpened">
      <lash-create-balance :createDialogOpened="isDialogCreateOpened" @on-create-balance="onBalanceCreated"/>
    </template>
    <template v-if="balance && isEditDialog">
      <lash-edit-balance @on-edit-balance="onBalanceEdited" :editDialogOpened="isEditDialog" :balance="balance"/>
    </template>
  </v-layout>
</template>
<script>
import CreateBalance from './CreateBalance';
import EditBalance from './EditBalance';
import utils from '../../utils';

export default {
  data() {
    return {
      isDeleteDialog: false,
      isEditDialog: false,
      isDialogCreateOpened: false,
      balance: null,
      iconClass: 'grey lighten-1 white--text',
      icon: 'account_balance_wallet',
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
      return this.$store.getters.balances;
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
      this.$store.dispatch('getBalances', this.query);
    },
    onNewCategory() {
      utils.log('onNewCategory');
      this.isDialogCreateOpened = true;
    },
    onOpenDeleteDialog(item) {
      utils.log('onOpenDeleteDialog');
      this.isDeleteDialog = !this.isDeleteDialog;
      this.itemDeletable = item;
    },
    onOpenEditDialog(item) {
      utils.log(`onOpenEditDialog: ${item}`);
      this.balance = item;
      this.isEditDialog = !this.isEditDialog;
    },
    onLoadMore() {
      utils.log('Loading more');
      this.query.page += 1;
      this.$store.dispatch('getCategories', this.query);
    },
    onBalanceDeleted(result) {
      utils.log(`result: ${result}`);
      if (result) {
        this.$store.dispatch('removeCategory', this.itemDeletable.id);
      }
      this.isDeleteDialog = !this.isDeleteDialog;
      this.itemDeletable = null;
    },
    onBalanceCreated(result) {
      this.isDialogCreateOpened = !this.isDialogCreateOpened;
      utils.log(`result: ${result}`);
      if (result) {
        // TODO save category
      }
    },
    onBalanceEdited(result) {
      this.isEditDialog = !this.isEditDialog;
      utils.log(`onTakeEditAction: ${result}`);
      if (result) {
        // TODO update category
      }
    },
  },
  components: {
    'lash-create-balance': CreateBalance,
    'lash-edit-balance': EditBalance,
  },
  filters: {
    mode(val) {
      if (!val) return '';
      if (val === 'income') {
        return 'Entrada';
      }
      return 'Salida';
    },
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

