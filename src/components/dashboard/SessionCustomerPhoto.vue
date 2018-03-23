<template>
  <v-dialog v-model="pictureDialogOpen" fullscreen transition="dialog-bottom-transition" :overlay="false">
    <v-card>
      <v-toolbar light color="primary">
        <v-btn icon @click.native="onCloseDialog()" >
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>Imagenes: {{product.name}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-menu bottom left v-if="isAdmin">
            <v-btn icon slot="activator" >
              <v-icon>more_vert</v-icon>
            </v-btn>
            <v-list>
              <v-list-tile @click="onAddPictures">
                <v-list-tile-title>Agregar</v-list-tile-title>
              </v-list-tile>
              <v-list-tile @click="onDeletePictures">
                <v-list-tile-title>Eliminar Todas</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
      </v-toolbar>
      <input
        type="file"
        style="display: none"
        ref="fileInput"
        accept="image/*"
        @change="onUploadPictures"
        >
      <v-container fluid grid-list-sm align-baseline>
          <v-layout row wrap>
            <v-flex
              xs4
              v-for="pic in pics"
              :key="pic.id"
            >
              <v-card >
                <v-card-media class="lash__card__media__background"
                  :src="pic.url"
                  height="150px"
                >
                  <v-menu bottom right transition="slide-x-transition">
                    <v-btn icon xs slot="activator" dark class="btn-menu">
                      <v-icon color="white lighten-1">more_vert</v-icon>
                    </v-btn>
                    <v-list>
                      <v-list-tile @click="onViewPicture(pic)">
                        <v-list-tile-sub-title>Ver</v-list-tile-sub-title>
                      </v-list-tile>
                      <v-list-tile v-if="isAdmin" @click="onDeletePicture(pic.id)">
                        <v-list-tile-sub-title>Eliminar</v-list-tile-sub-title>
                      </v-list-tile>
                    </v-list>
                  </v-menu>
                </v-card-media>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      <v-divider></v-divider>
      <template :if="isViewDialogOpen && selectedPic">
        <view-picture-carousel :isOpen="isViewDialogOpen" :pics="pics" :selectedPic="selectedPic" @on-close-view-dialog="onViewDialogClose"/>
      </template>
    </v-card>
  </v-dialog>
</template>
<script>
import ViewPictureCarousel from './ViewPictureCarousel';
import out from '../../utils';

export default {
  props: ['pictureDialogOpen', 'product'],
  computed: {
    pics() {
      const files = this.$store.getters.pics;
      if (files && files.length > 0) {
        this.update = true;
      }
      return files;
    },
    isAdmin() {
      return this.$store.getters.isAdmin;
    },
  },
  data() {
    return {
      selectedPic: null,
      isViewDialogOpen: false,
      dialog: false,
      notifications: false,
      sound: true,
      widgets: false,
      size: 'sm',
      items: [
        {
          text: 'Extra small (2px)',
          value: 'xs',
        },
        {
          text: 'Small (4px)',
          value: 'sm',
        },
        {
          text: 'Medium (8px)',
          value: 'md',
        },
        {
          text: 'Large (16px)',
          value: 'lg',
        },
        {
          text: 'Extra large (24px)',
          value: 'xl',
        },
      ],
    };
  },
  methods: {
    onCloseDialog() {
      this.$emit('on-picture-dialog', false);
      this.$destroy();
    },
    onAddPictures() {
      out.log('adding pictures');
      this.$refs.fileInput.click();
    },
    onDeletePictures() {
      out.log('removing pictures');
    },
    onDeletePicture(item) {
      out.log(`removing single picture ${item}`);
      const payload = {
        product: this.$props.product.id,
        item,
      };
      this.$store.dispatch('removePic', payload);
    },
    onUploadPictures(event) {
      const file = event.target;
      // reduce image
      out.resizeImage(file)
        .then((res) => {
          // send base64 to store so the image can be uploaded to server
          const payload = {
            product: this.$props.product.id,
            url: res,
          };
          this.$store.dispatch('savePicture', payload);
        })
        .catch(err => out.log('error resizing image: %s', err));
    },
    onViewPicture(pic) {
      out.log('viewing picture: %s', pic.id);
      this.isViewDialogOpen = !this.isViewDialogOpen;
      this.selectedPic = pic;
    },
    onViewDialogClose(result) {
      out.log('dialog closed: %s', result);
      this.isViewDialogOpen = !this.isViewDialogOpen;
    },
  },
  created() {
    this.$store.commit('setPics', []);
    this.$store.dispatch('getPictures', this.$props.product.id);
  },
  destroy() {
    out.log('destroying component!');
    this.$store.commit('setPics', null);
  },
  components: {
    ViewPictureCarousel,
  },
};
</script>
<style scoped>
  .btn-menu {
    background-color: rgba(0,0,0,0.5);
  }
  .lash__card__media__background :first-child {
    background-size: 100px !important;
  }
</style>
