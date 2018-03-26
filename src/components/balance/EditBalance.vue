<template>
  <v-dialog v-model="editDialogOpened" persistent max-width="500px">
      <form @submit.prevent="onSaveBalance">
        <v-card>
          <v-card-title>
            <span class="headline">Balance</span>
          </v-card-title>
          <v-card-text>
            <v-flex x12>
              <v-text-field type="number" label="Monto" :rules="amountRules" v-model.number="editAmount" required></v-text-field>
            </v-flex>
            <v-flex x12>
              <v-select
                v-model="editMode"
                label="Seleccione la modalidad"
                required
                :items="modes"
              >
              </v-select>
            </v-flex>
            <v-flex x12>
              <v-text-field multi-line label="Descripción" :counter="128" :rules="descRules" v-model="editDesc" required></v-text-field>
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
  props: ['editDialogOpened', 'balance'],
  data() {
    return {
      editDesc: this.balance.desc,
      editAmount: this.balance.amount,
      editMode: this.balance.mode,
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
      return this.editDesc !== '' && this.editAmount > 0 && this.editMode !== '';
    },
  },
  methods: {
    onSaveBalance() {
      debugger;
      if (!this.formIsValid) {
        return;
      }
      const balance = {
        id: this.balance.id,
        desc: this.editDesc,
        amount: this.editAmount,
        mode: this.editMode,
      };
      this.$store.dispatch('updateBalance', balance);
      this.$emit('on-edit-balance', true);
      this.resetForm();
    },
    onDismissDialog() {
      this.$emit('on-edit-balance', false);
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


