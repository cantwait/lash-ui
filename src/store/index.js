import Vue from 'vue';
import Vuex from 'vuex';

// import meetup from './meetup';
import user from './user';
import shared from './shared';
import product from './product';
import customer from './customer';
import queue from './queue';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    // meetup: meetup,
    user,
    shared,
    product,
    customer,
    queue,
  },
});

export default store;
