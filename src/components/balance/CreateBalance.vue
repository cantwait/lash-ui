<template>
  <v-dialog v-model="createDialogOpened" persistent max-width="500px">
      <form @submit.prevent="onSaveBalance">
        <v-card>
          <v-card-title>
            <span class="headline">Balance</span>
          </v-card-title>
          <v-card-text>
            <v-flex x12>
              <v-text-field type="number" step=0.01 label="Monto" :rules="amountRules" v-model.number="amount" required></v-text-field>
            </v-flex>
            <v-flex x12>
              <v-select
                v-model="mode"
                label="Seleccione la modalidad"
                required
                :items="modes"
              >
              </v-select>
            </v-flex>
            <v-flex x12>
              <v-text-field multi-line label="Descripción" :counter="128" :rules="descRules" v-model="desc" required></v-text-field>
            </v-flex>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn type="submit" :disabled="loading" :loading="loading" color="blak darken-1" flat>Guardar</v-btn>
            <v-btn color="black darken-1" flat @click.native="onDismissDialog">Cerrar</v-btn>
          </v-card-actions>
        </v-card>
      </form>
    </v-dialog>
</template>
<script>

export default {
  props: ['createDialogOpened'],
  data() {
    return {
      desc: '',
      amount: 0,
      mode: '',
      modes: [
        {
          value: 'income',
          text: 'Entrada',
        },
        {
          value: 'outcome',
          text: 'Salida',
        },
      ],
      descRules: [
        v => v.length <= 128 || 'Max 128 caracteres',
        v => v.length >= 3 || 'Min 3 caracteres',
      ],
      amountRules: [
        v => v > 0 || 'El monto debe ser mayor a 0',
      ],
    };
  },
  computed: {
    isOpenDialog() {
      return this.$store.getters.newUserDialog;
    },
    error() {
      return this.$store.getters.error;
    },
    loading() {
      return this.$store.getters.loading;
    },
    formIsValid() {
      return this.desc !== '' && this.amount > 0 && this.mode !== '';
    },
  },
  methods: {
    onSaveBalance() {
      if (!this.formIsValid) {
        return;
      }
      const newBalance = {
        desc: this.desc,
        amount: this.amount,
        mode: this.mode,
      };
      this.$store.dispatch('saveBalance', newBalance);
      this.$emit('on-create-balance', true);
      this.resetForm();
    },
    onDismissDialog() {
      this.$emit('on-create-balance', false);
      this.resetForm();
    },
    resetForm() {
      this.desc = '';
      this.mode = '';
      this.amount = 0;
    },
  },
};
</script>
<style scoped>

</style>


