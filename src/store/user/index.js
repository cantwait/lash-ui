import axios from 'axios';
import _ from 'lodash';
/* eslint-disable */
export default {
  state: {
    user: null,
    token: null,
    newUserDialog: false,
    editUserDialog: false,
    users: [],
  },
  mutations: {
    setUser(state, payload) {
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
    setEditUserDialog(state, payload) {
      const s = state;
      s.editUserDialog = payload;
    },
    setUsers(state, payload) {
      const s = state;
      if(payload.length > 0) {
        s.users = _.union(s.users, payload);
      }
    },
    removeFromUsers(state, payload) {
      const s = state;
      if(payload) {
        s.users = _.remove(s.users, (user) => {
          return user.id != payload;
        });
      }
    },
    addUser(state, payload) {
      const s = state;
      if(payload) {
        s.users.push(payload);
      }
    },
    updateUsers(state, payload) {
      const s = state;
      if(payload){
        const index = _.findIndex(s.users, {id: payload.id});
        s.users.splice(index, 1, payload);
      }
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
        console.log('response: %s',res);
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
    deleteUser({ commit }, id) {
        axios.delete(`/users/${id}`)
            .then((res)=>{
                commit('removeFromUsers', id);
                console.log('usuario eliminardo exito: %s', res);
            })
            .catch((err)=>{
                console.log('usuario eliminado error: %s', err);
            })
            .finally(()=>{
                console.log('eliminar usuario completado!')
            });
    },
    getUsers({ commit }, payload) {
      commit('setLoading', true);
      axios.get('/users', {
        params: {
          page: payload.page,
          perPage: payload.perPage,
        }
      })
        .then((res)=>{
          console.log(res);
          commit('setUsers', res.data);
        })
        .catch((err)=>{
          console.log(err);
        })
        .finally(()=>{
          commit('setLoading', false);
          console.log('fetch users finished!');
        });
    },
    saveUser({ commit }, payload) {
      commit('setLoading', true);
      axios.post('users', payload)
        .then((res)=> {
          console.log(res);
          commit('addUser',res.data);
          commit('setNewUserDialog', false);
        })
        .catch((err)=> {
          console.log(err);
        })
        .finally(()=> {
          commit('setLoading', false);
        });
    },
    updateUser({ commit }, payload) {
      axios.patch(`/users/${payload.id}`, {
        name: payload.name,
        email: payload.email,
        role: payload.role,
      })
      .then((res) => {
        if(res.data) {
          commit('updateUsers', res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        commit('setEditUserDialog', false);
      })
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
      return state.user;
    },
    token(state) {
      return state.token;
    },
    newUserDialog(state) {
      return state.newUserDialog;
    },
    editUserDialog(state) {
      return state.editUserDialog;
    },
    users(state) {
      return state.users;
    }
  },
};
