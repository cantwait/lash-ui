import axios from 'axios';
import _ from 'lodash';
import utils from '../../utils';

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
      if (payload.length > 0) {
        s.users = _.uniqBy(_.union(s.users, payload), 'id');
      }
    },
    removeFromUsers(state, payload) {
      const s = state;
      if (payload) {
        s.users = _.remove(s.users, user => user.id !== payload);
      }
    },
    addUser(state, payload) {
      const s = state;
      if (payload) {
        s.users.push(payload);
      }
    },
    updateUsers(state, payload) {
      const s = state;
      if (payload) {
        const index = _.findIndex(s.users, { id: payload.id });
        s.users.splice(index, 1, payload);
      }
    },
  },
  actions: {
    signUserUp({ commit }, payload) {
      utils.log(payload);
      commit('clearError');
      commit('setLoading', true);
      axios.post('/auth/register', {
        email: payload.email,
        password: payload.password,
      })
      .then((res) => {
        utils.log(JSON.stringify(res.data));
        commit('setUser', res.data.user);
        commit('setToken', res.data.token);
      })
      .catch((error) => {
        utils.log(error.response);
        commit('setError', error.response.data.message);
      })
      .finally(() => {
        commit('setLoading', false);
      });
    },
    signUserIn({ commit }, payload) {
      commit('setLoading', true);
      commit('clearError');
      axios.post('/auth/login', {
        email: payload.email,
        password: payload.password,
      }).then((res) => {
        utils.log(`response: ${JSON.stringify(res)}`);
        commit('setUser', res.data.user);
        commit('setToken', res.data.token);
      })
      .catch((error) => {
        commit('setError', error.response.data.message);
      })
      .finally(() => {
        commit('setLoading', false);
      });
    },
    deleteUser({ commit }, id) {
      axios.delete(`/users/${id}`)
        .then((res) => {
          if (res.status === 204) {
            commit('removeFromUsers', id);
          }
        })
        .catch((err) => {
          utils.log(`usuario eliminado error: ${JSON.stringify(err)}`);
        })
        .finally(() => {
          utils.log('eliminar usuario completado!');
        });
    },
    getUsers({ commit }, payload) {
      if (payload.page === 1) {
        commit('setUsers', []);
      }
      commit('setLoading', true);
      axios.get('/users', {
        params: {
          page: payload.page,
          perPage: payload.perPage,
        },
      })
        .then((res) => {
          commit('setUsers', res.data);
        })
        .catch((err) => {
          utils.log(err);
        })
        .finally(() => {
          commit('setLoading', false);
          utils.log('fetch users finished!');
        });
    },
    saveUser({ commit }, payload) {
      commit('setLoading', true);
      axios.post('users', payload)
        .then((res) => {
          commit('addUser', res.data);
          commit('setNewUserDialog', false);
        })
        .catch((err) => {
          utils.log(`Error deleting user: ${JSON.stringify(err)}`);
        })
        .finally(() => {
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
        if (res.data) {
          commit('updateUsers', res.data);
        }
      })
      .catch((err) => {
        utils.log(`Error updating user: ${JSON.stringify(err)}`);
      })
      .finally(() => {
        commit('setEditUserDialog', false);
      });
    },
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
    },
    isAdmin(state) {
      return state.user && state.user.role === 'admin';
    },
    isCashier(state) {
      return state.user && state.user.role === 'cashier';
    },
    isCollaborator(state) {
      return state.user && state.user.role === 'collaborator';
    },
  },
};
