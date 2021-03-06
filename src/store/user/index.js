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
    isPwdReset: false,
    usersCatalog: [],
  },
  mutations: {
    setCatalog(state, payload) {
      if (payload) {
        const s = state;
        s.usersCatalog = payload;
      }
    },
    setPwdReset(state, payload) {
      const s = state;
      s.isPwdReset = payload;
    },
    setPwdValid(state, payload) {
      const s = state;
      s.pwdValid = payload;
    },
    setSessionsByUser(state, payload) {
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
            let su = sum;
            if (ses.services.generateFee) {
              if (ses.discount && ses.discount > 0) {
                su += (((ses.services.price) - (ses.services.price * ses.discount))
                 * (ses.services.responsible.fee / 100));
              } else {
                su += (ses.services.price * (ses.services.responsible.fee / 100));
              }
            }
            return su;
          }, 0);

          const partial = {
            id,
            subTotal,
          };
          s.partialFee.push(partial);
          s.totalFee = reduce(s.partialFee, (sum, pf) => sum + pf.subTotal, 0);
        });
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
      } else {
        s.users = [];
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
    getSessionsByUser({ commit }, query) {
      const userId = query.userId;
      const qry = {
        from: '',
        to: '',
      };
      if ('from' in query && 'to' in query) {
        qry.from = query.from;
        qry.to = query.to;
      }
      commit('setLoading', true);
      axios.get(`/users/${userId}/sessions`, { params: qry })
        .then(res => commit('setSessionsByUser', res.data))
        .catch(err => utils.log('error: %s', err))
        .finally(() => commit('setLoading', false));
    },
    findUsersLike({ commit }, name) {
      commit('setLoading', true);
      axios.get('users/search', {
        params: {
          name,
        },
      })
      .then((res) => {
        // need to pass the queues so we can remove those
        // customers already either in queues or sessions
        commit('setCatalog', res.data);
      })
      .catch(e => utils.log('Error getting users by name: %s', e))
      .finally(() => commit('setLoading', false));
    },
    resetPwd({ commit }, id) {
      commit('setLoading', true);
      axios.get(`/users/${id}/reset`)
        .then((res) => {
          utils.log(res.status);
          commit('setPwdReset', true);
          setTimeout(() => commit('setPwdReset', false), 4000);
        })
        .catch(err => utils.log(err))
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
          if (res.data.length > 0) {
            commit('setUsers', res.data);
          }
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
    isPwdReset(state) {
      return state.isPwdReset;
    },
  },
};
