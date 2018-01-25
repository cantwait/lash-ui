import axios from 'axios';
/* eslint-disable */
export default {
  state: {
    user: null,
  },
  mutations: {},
  actions: {
    // signUserUp({ commit }, payload) {
    //   console.log(payload);
    //   commit('setLoading', true);
    //   commit('clearError');
    // },
    signUserIn({ commit }, payload) {
      commit('setLoading', true);
      commit('clearError');
      axios.post('/auth/login', {
        email: payload.email,
        password: payload.password,
      }).then((response) => {
        // eslint-disable-next-line
        console.log(response);
      })
        .catch((error) => {
          // eslint-disable-next-line
          commit('setLoading', false);
          commit('setError', error.response.data.message);
        });
    },
    // autoSignIn({ commit }, payload) {
    //   commit('setUser', {
    //     id: payload.uid,
    //     registeredMeetups: [],
    //     fbKeys: {},
    //   });
    // },
    // fetchUserData({ commit, getters }) {
    //   console.log(getters);
    //   commit('setLoading', true);
    // },
    // logout({ commit }) {
    //   commit('setUser', null);
    // },
  },
  getters: {
    user(state) {
      return state.user;
    },
  },
};
