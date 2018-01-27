<template>
  <v-layout row>
    <v-flex >
      <v-card>
        <v-list two-line subheader>
          <v-subheader inset>Usuarios</v-subheader>
          <v-list-tile avatar v-for="item in items" v-bind:key="item.title" >
            <v-list-tile-avatar>
              <v-icon v-bind:class="[item.iconClass]">{{ item.icon }}</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn icon ripple>
                <v-icon color="blue lighten-1">edit</v-icon>
              </v-btn>
            </v-list-tile-action>
            <v-list-tile-action>
              <v-btn icon ripple>
                <v-icon color="red lighten-1">delete</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
  export default {
    data() {
      return {
        items: [
          { icon: 'person', iconClass: 'grey lighten-1 white--text', title: 'Photos', subtitle: 'Jan 9, 2014' },
          { icon: 'person', iconClass: 'grey lighten-1 white--text', title: 'Recipes', subtitle: 'Jan 17, 2014' },
          { icon: 'person', iconClass: 'grey lighten-1 white--text', title: 'Work', subtitle: 'Jan 28, 2014' },
        ],
      };
    },
  };
</script>