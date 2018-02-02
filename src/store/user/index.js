import axios from 'axios';
/* eslint-disable */
export default {
  state: {
    user: null,
    token: null,
    newUserDialog: false,
  },
  mutations: {
    setUser(state, payload) {
        debugger;
        const s = state;
        s.user = payload;
    },
    setToken(state, payload) {
        const s = state;
        s.token = payload;
    },
    setNewUserDialog(state, payload) {
        const s = state;
        s.newUserDialog = payload;
    },
  },
  actions: {
    signUserUp({ commit }, payload) {
      console.log(payload);
      commit('clearError');
      commit('setLoading', true);
      axios.post('/auth/register',{
        email: payload.email,
        password: payload.password
      })
        .then((res)=>{
            console.log(res.data);
            commit('setUser', res.data.user);
            commit('setToken', res.data.token);
        })
        .catch((error)=>{
            console.log(error.response);
            commit('setError', error.response.data.message);
        })
        .finally(()=>{
            commit('setLoading', false);
            console.log('finally block...');
        });
    },
    signUserIn({ commit }, payload) {
      commit('setLoading', true);
      commit('clearError');
      axios.post('/auth/login', {
        email: payload.email,
        password: payload.password,
      }).then((res) => {
        // eslint-disable-next-line
        console.log(res);
        commit('setUser', res.data.user);
        commit('setToken', res.data.token);
      })
        .catch((error) => {
          // eslint-disable-next-line
          commit('setError', error.response.data.message);
        })
        .finally(()=>{
            commit('setLoading', false);
        });
    },
    loadMore({ commit }) {
        commit('setLoading', true);
        setTimeout(()=>{
            commit('setLoading', false);
        }, 3000)
    },
    deleteUser({ commmit }, id) {
        axios.delete(`/users/${id}`)
            .then((res)=>{
                console.log('usuario eliminardo exito: %s', res);
            })
            .catch((err)=>{
                console.log('usuario eliminado error: %s', err);
            })
            .finally(()=>{
                console.log('eliminar usuario completado!')
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
    logout({ commit }) {
      commit('setUser', null);
      commit('setToken', null);
    },
  },
  getters: {
    user(state) {
      debugger;
      return state.user;
    },
    token(state) {
      return state.token;
    },
    user(state) {
      return state.newUserDialog;
    },
  },
};
