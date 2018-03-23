<template>
  <v-layout row justify-center>
    <v-dialog v-model="isOpenDialog" persistent max-width="300">
      <v-card>
        <v-card-title class="headline">Valoración del Servicio</v-card-title>
        <v-list two-line>
          <v-list-tile>
            <v-list-tile-content>
              <star-rating
                :max-rating="5"
                :star-size="50"
                :increment="1"
                v-model="rating"
              ></star-rating>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile>
            <v-list-tile-content>
              <v-text-field
                name="input-7-3"
                v-model="comment"
                multi-line
                placeholder="Sus comentarios aqui..."
              ></v-text-field>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="black darken-1" flat="flat" @click.native="onSaveRating">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import StarRating from 'vue-star-rating';
// import utils from '../../utils';

export default {
  props: ['isOpenDialog'],
  data() {
    return {
      rating: 1,
      comment: '',
    };
  },
  methods: {
    onSaveRating() {
      const result = {
        rating: this.rating,
        comment: this.comment,
      };
      this.$emit('on-rating-action', result);
    },
  },
  components: {
    'star-rating': StarRating,
  },
};

</script>