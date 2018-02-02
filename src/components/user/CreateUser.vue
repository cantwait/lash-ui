<template>
  <v-dialog v-model="isOpenDialog" persistent max-width="500px">
      <form>
        <v-card>
          <v-card-title>
            <span class="headline">User Profile</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <v-text-field label="Legal first name" required></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field label="Legal middle name" hint="example of helper text only on focus"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field label="Legal last name" hint="example of persistent helper text"
                    persistent-hint
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field label="Email" required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field label="Password" type="password" required></v-text-field>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-select
                    label="Age"
                    required
                    :items="['0-17', '18-29', '30-54', '54+']"
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm6>
                  <v-select
                    label="Interests"
                    multiple
                    autocomplete
                    chips
                    :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                  ></v-select>
                </v-flex>
              </v-layout>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="onSaveUser">Cerrar</v-btn>
            <v-btn color="blue darken-1" flat @click.native="onDismissDialog">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </form>
    </v-dialog>
</template>
<script>
export default {
  data() {
    return {
      // openDialog: false,
    };
  },
  computed: {
    isOpenDialog() {
      return this.$store.getters.newUserDialog;
    },
  },
  methods: {
    onSaveUser() {
      this.$store.commit('setNewUserDialog', false);
    },
    onDismissDialog() {
      this.$store.commit('setNewUserDialog', false);
    },
  },
};
</script>
<style scoped>

</style>


