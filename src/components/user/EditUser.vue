<template>
  <v-dialog v-model="isEditDialogOpen" persistent max-width="500px">
      <form @submit.prevent="onSaveUser">
        <v-card>
          <v-card-title>
            <span class="headline">Usuario</span>
          </v-card-title>
          <v-card-text>
            <v-flex x12>
              <v-text-field label="nombre" :rules="nameVal" :counter="20" v-model="editName" required></v-text-field>
            </v-flex>
            <v-flex x12>
              <v-text-field label="Email" v-model="editEmail" required></v-text-field>
            </v-flex>
            <v-flex x12>
              <v-select
                v-model="editRol"
                label="Seleccione el rol"
                required
                :items="roles"
                :rules="roleVal"

              >
              </v-select>
            </v-flex>
            <v-flex x12>
              <v-text-field label="Telefono" :rules="phoneVal" :counter="8" type="tel" v-model="editPhone" required></v-text-field>
            </v-flex>
            <v-flex x12>
              <v-text-field label="Dirección" :rules="addressVal" :counter="100" v-model="editAddress" required></v-text-field>
            </v-flex>
            <v-flex x12 v-if="editRol === 'user'">
              <v-text-field label="% comisión" :rules="feeVal" min="0" max="10" type="number" v-model.number="editFee" required></v-text-field>
            </v-flex>
            <!-- <v-flex xs12>
              <v-btn raised class="primary" @click="onPickFile">Subir Imagen</v-btn>
              <input
                type="file"
                style="display: none"
                ref="fileInput"
                accept="image/*"
                @change="onFilePicked">
            </v-flex>
            <v-flex x12>
              <img :src="imageURL">
            </v-flex> -->
            <small>*Campo Obligatorio</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn type="submit" :disabled="loading" :loading="loading" color="black darken-1" flat>Guardar</v-btn>
            <v-btn color="black darken-1" flat @click.native="onDismissDialog">Cerrar</v-btn>
          </v-card-actions>
        </v-card>
      </form>
    </v-dialog>
</template>
<script>
import _ from 'lodash';

export default {
  props: ['user', 'isEditDialogOpen'],
  data() {
    return {
      editName: this.user.name,
      editEmail: this.user.email,
      editRol: this.user.role,
      editPhone: this.user.phone,
      editAddress: this.user.address,
      editFee: this.user.fee,
      roles: [
        {
          value: 'admin',
          text: 'Administrador',
        },
        {
          value: 'cashier',
          text: 'Cajero',
        },
        {
          value: 'user',
          text: 'Colaborador',
        },
      ],
      nameVal: [
        v => (v && v.length <= 20) || 'Max 20 caracteres',
        v => (v && v.length >= 3) || 'Min 3 caracteres',
        v => _.isEmpty(v.length) || 'Nombre no puede ser vacio',
      ],
      roleVal: [
        v => !_.isNull(v) || 'Debe seleccionar un rol',
      ],
      phoneVal: [
        v => !!v || 'Telefono es requerido',
        v => (v && v.length) <= 8 || 'Max 8 caracteres',
        v => (v && v.length) >= 7 || 'Min 7 caracteres',
      ],
      addressVal: [
        v => !!v || 'La dirección es requerida',
        v => (v && v.length <= 100) || 'Max 100 caracteres',
        v => (v && v.length >= 3) || 'Min 3 caracteres',
      ],
      feeVal: [
        v => v <= 10 || 'Valor maximo 10%',
        v => v > -1 || 'Valor no puede ser negativo',
      ],
    };
  },
  computed: {
    isOpenDialog() {
      return this.$store.getters.editUserDialog;
    },
    error() {
      return this.$store.getters.error;
    },
    loading() {
      return this.$store.getters.loading;
    },
    imageURL() {
      return this.$store.getters.imageURL;
    },
    formIsValid() {
      return this.editName !== '' &&
      this.editEmail !== '' &&
      this.editRol !== '' &&
      this.editAddress !== '' &&
      this.editPhone !== '';
    },
  },
  methods: {
    onSaveUser() {
      if (!this.formIsValid) {
        return;
      }
      const editData = {
        id: this.user.id,
        email: this.editEmail,
        role: this.editRol,
        name: this.editName,
        address: this.editAddress,
        phone: this.editPhone,
        fee: this.editFee,
      };
      this.$store.dispatch('updateUser', editData);

      this.$emit('on-edit-action', true);
    },
    onDismissDialog() {
      this.$emit('on-edit-action', false);
    },
    onPickFile() {
      this.$refs.fileInput.click();
    },
  },
};
</script>
<style scoped>

</style>


