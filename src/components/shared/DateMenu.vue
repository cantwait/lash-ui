<template>
  <v-menu
    ref="menu"
    lazy
    :close-on-content-click="true"
    v-model="menu"
    transition="scale-transition"
    offset-y
    :return-value.sync="date"
  >
    <v-text-field
      slot="activator"
      v-model="date"
      prepend-icon="event"
      readonly
      :placeholder="placeholder"
    ></v-text-field>
    <v-date-picker v-model="date" no-title scrollable @change="onDatePicked">
      <v-spacer></v-spacer>
      <!-- <v-btn flat color="black" @click="menu = false">Cancelar</v-btn>
      <v-btn flat color="black" @click="onDatePicked">OK</v-btn> -->
    </v-date-picker>
  </v-menu>
</template>
<script>
export default {
  props: ['placeholder'],
  data() {
    return {
      date: null,
      menu: false,
    };
  },
  methods: {
    onDatePicked() {
      this.$refs.menu.save(this.date);
      this.$emit('on-date-picked', this.date);
    },
  },
};

</script>
