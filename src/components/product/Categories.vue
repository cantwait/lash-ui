<template>
<v-layout row>
    <v-flex >
      <v-card>
        <v-list two-line subheader>
          <v-subheader inset>Categorias</v-subheader>
          <template v-for="(item,index) in items">
            <v-list-tile avatar  v-bind:key="item.id" >
              <v-list-tile-avatar>
                <v-icon v-bind:class="[iconClass]">{{ icon }}</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>{{ item.name }}</v-list-tile-title>
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
        color="pink"
        @click.stop="onNewCategory"
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
      <lash-create-category :createDialogOpened="isDialogCreateOpened" @on-create-category="takeCreateAction"/>
    </template>
    <template v-if="category && isEditDialog">
      <app-category-edit-form-dialog @on-edit-category="takeEditAction" :editDialogOpened="isEditDialog" :category="category"/>
    </template>
  </v-layout>
</template>
<script>
export default {
  data() {
    return {
      isDeleteDialog: false,
      isEditDialog: false,
      isDialogCreateOpened: false,
      category: null,
      iconClass: 'grey lighten-1 white--text',
      icon: 'local_offer',
      items: [
        {
          name: 'Nombre Categoria',
        },
      ],
    };
  },
  computed: {
    loading() {
      return this.$store.getters.loading;
    },
    categories() {
      // return this.$store.getters.users;
    },
  },
  methods: {
    onNewCategory() {
      console.log('onNewCategory');
      this.isDialogCreateOpened = true;
    },
    onOpenDeleteDialog() {
      console.log('onOpenDeleteDialog');
      this.isDeleteDialog = !this.isDeleteDialog;
    },
    onOpenEditDialog(item) {
      console.log('onOpenEditDialog: %s', item);
      this.isEditDialog = !this.isEditDialog;
    },
    onLoadMore() {
      console.log('Loading more');
    },
    takeDeleteAction(result) {
      console.log('result: %s', result);
      if (result) {
        // TODO: delete category
      }
      this.isDeleteDialog = !this.isDeleteDialog;
    },
    takeCreateAction(result) {
      this.isDialogCreateOpened = !this.isDialogCreateOpened;
      console.log('result: %s', result);
      if (result) {
        // TODO save category
      }
    },
    takeEditAction(result) {
      this.isEditDialog = !this.isEditDialog;
      console.log('onTakeEditAction: %s', result);
      if (result) {
        // TODO update category
      }
    },
  },
};
</script>
<style scoped>

</style>

