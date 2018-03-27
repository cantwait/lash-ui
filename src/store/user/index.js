import axios from 'axios';
import groupBy from 'lodash/groupBy';
import values from 'lodash/values';
import reduce from 'lodash/reduce';
import uniqBy from 'lodash/uniqBy';
import union from 'lodash/union';
import remove from 'lodash/remove';
import findIndex from 'lodash/findIndex';
import utils from '../../utils';

export default {
  state: {
    user: null,
    token: null,
    newUserDialog: false,
    editUserDialog: false,
    users: [],
    sessionsByUser: [],
    totalFee: 0,
    partialFee: [],
    pwdValid: false,
  },
  mutations: {
    setPwdValid(state, payload) {
      const s = state;
      s.pwdValid = payload;
    },
    setSessionsByUser(state, payload) {
      debugger;
      if (payload) {
        const s = state;
        s.partialFee = [];
        s.sessionsByUser = values(groupBy(payload, '_id'));
        s.sessionsByUser.forEach((val) => {
          // val represents the session array of services
          // eslint-disable-next-line
          const id = val[0]._id;
          let subTotal = 0;
          subTotal = reduce(val, (sum, ses) => {
            utils.log('por aca...');
            if (ses.services.generateFee) {
              utils.log('price: %s', ses.services.price);
              return sum + (ses.services.price * (ses.services.responsible.fee / 100));
            }
            return sum;
          }, 0);

          utils.log('subTotal: %s', JSON.stringify(subTotal));
          const partial = {
            id,
            subTotal,
          };
          s.partialFee.push(partial);
          s.totalFee = reduce(s.partialFee, (sum, pf) => sum + pf.subTotal, 0);
        });
        // _.values(_.each(payload, p => _.groupBy(p), '_id'));
      }
    },
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
        s.users = uniqBy(union(s.users, payload), 'id');
      }
    },
    removeFromUsers(state, payload) {
      const s = state;
      if (payload) {
        s.users = remove(s.users, user => user.id !== payload);
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
        const index = findIndex(s.users, { id: payload.id });
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
    getSessionsByUser({ commit }, userId) {
      commit('setLoading', true);
      axios.get(`/users/${userId}/sessions`)
        .then(res => commit('setSessionsByUser', res.data))
        .catch(err => utils.log('error: %s', err))
        .finally(() => commit('setLoading', false));
    },
    updatePassword({ commit }, payload) {
      commit('setLoading', true);
      axios.post('/users/resetpwd', payload)
        .then((res) => {
          if (res.status === 204) {
            commit('setPwdValid', true);
          }
        })
        .catch((e) => {
          commit('setError', e.response.data.message);
          commit('setPwdValid', false);
        })
        .finally(() => commit('setLoading', false));
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
        address: payload.address,
        phone: payload.phone,
        fee: payload.fee,
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
    sessionsByUser(state) {
      return state.sessionsByUser;
    },
    totalFee(state) {
      return state.totalFee;
    },
    partialFee(state) {
      return state.partialFee;
    },
    pwdValid(state) {
      return state.pwdValid;
    },
  },
};
