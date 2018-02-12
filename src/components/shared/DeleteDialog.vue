<template>
    <v-dialog v-model="deleteDialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Esta seguro de esta acción?</v-card-title>
        <v-card-text>Tenga en cuenta que esta acción no se puede reversar.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" flat @click.native="onDeleteYes">Si</v-btn>
          <v-btn color="blue darken-1" flat @click.native="onDeleteNo">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>
<script>
export default {
  props: ['deleteDialog'],
  data() {
    return {

    };
  },
  computed: {
    isDialogChange() {
      return this.$store.getters.isDeleteDialog;
    },
  },
  methods: {
    onDeleteYes() {
      this.$emit('on-action-performed', true);
    },
    onDeleteNo() {
      this.$emit('on-action-performed', false);
    },
  },
};
</script>
<style scoped>

</style>


