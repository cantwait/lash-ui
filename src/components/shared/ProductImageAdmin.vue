<template>
  <v-dialog v-model="pictureDialogOpen" fullscreen transition="dialog-bottom-transition" :overlay="false">
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon @click.native="onCloseDialog()" >
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>Imagenes: {{product.name}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-menu bottom left>
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
        multiple
        >
      <v-container fluid v-bind="{ [`grid-list-${size}`]: true }">
          <v-layout row wrap>
            <v-flex
              xs12
              sm6
              lg3
              v-for="n in 9"
              :key="n"
            >
              <v-card flat tile>
                <v-card-media
                  :src="`https://unsplash.it/150/300?image=${Math.floor(Math.random() * 100) + 1}`"
                  height="150px"
                >
                  <v-menu bottom right>
                    <v-btn icon slot="activator" dark>
                      <v-icon color="red lighten-1">remove_circle_outline</v-icon>
                    </v-btn>
                    <v-list>
                      <v-list-tile @click="onDeletePicture(n)">
                        <v-list-tile-title>Eliminar</v-list-tile-title>
                      </v-list-tile>
                    </v-list>
                  </v-menu>
                </v-card-media>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      <v-divider></v-divider>

    </v-card>
  </v-dialog>
</template>
<script>
import out from '../../utils';

export default {
  props: ['pictureDialogOpen', 'product'],
  data() {
    return {
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
    },
  },
  created() {
    out.log('component created');
  },
};
</script>
<style scoped>

</style>
