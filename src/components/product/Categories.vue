<template>
<v-layout row>
    <v-flex >
      <v-card>
        <v-list two-line subheader>
          <v-toolbar dark color="primary">
            <v-spacer></v-spacer>
            <!-- <v-text-field v-model="searchInput" @input="debounceInput" color="white" prepend-icon="search" clearable placeholder="Ingrese su busqueda..." hide-details single-line></v-text-field> -->
            <v-btn icon @click.stop="onNewCategory">
              <v-icon>add_circle</v-icon>
            </v-btn>
          </v-toolbar>
          <v-subheader inset>Categorias</v-subheader>
          <template v-for="(item,index) in items">
            <v-list-tile avatar  v-bind:key="item.id" >
              <v-list-tile-content>
                <v-list-tile-title>{{ item.name }}</v-list-tile-title>
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
      <!-- <v-card-text style="height: 100px; position: relative">
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
      </v-card-text> -->
    </v-flex>
    <!-- delete diaglo -->
    <template v-if="isDeleteDialog">
      <lash-delete-dialog :deleteDialog="isDeleteDialog" @on-action-performed="takeDeleteAction"></lash-delete-dialog>
    </template>
    <!-- new/edit user  -->
    <template v-if="isDialogCreateOpened">
      <lash-create-category :createDialogOpened="isDialogCreateOpened" @on-create-category="takeCreateAction"/>
    </template>
    <template v-if="category && isEditDialog">
      <lash-edit-category @on-edit-category="takeEditAction" :editDialogOpened="isEditDialog" :category="category"/>
    </template>
  </v-layout>
</template>
<script>
import utils from '../../utils';

export default {
  data() {
    return {
      isDeleteDialog: false,
      isEditDialog: false,
      isDialogCreateOpened: false,
      category: null,
      iconClass: 'grey lighten-1 white--text',
      icon: 'local_offer',
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
      return this.$store.getters.categories;
    },
  },
  created() {
    if (this.query.page !== 1) {
      this.query.page = 1;
    }
    this.$store.dispatch('getCategories', this.query);
  },
  methods: {
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
      this.category = item;
      this.isEditDialog = !this.isEditDialog;
    },
    onLoadMore() {
      utils.log('Loading more');
      this.query.page += 1;
      this.$store.dispatch('getCategories', this.query);
    },
    takeDeleteAction(result) {
      utils.log(`result: ${result}`);
      if (result) {
        this.$store.dispatch('removeCategory', this.itemDeletable.id);
      }
      this.isDeleteDialog = !this.isDeleteDialog;
      this.itemDeletable = null;
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
      if (result) {
        // TODO update category
      }
    },
  },
};
</script>
<style scoped>

</style>

