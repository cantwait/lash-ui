import axios from 'axios';
import uniqBy from 'lodash/uniqBy';
import union from 'lodash/union';
import remove from 'lodash/remove';
import findIndex from 'lodash/findIndex';
import utils from '../../utils';

export default {
  state: {
    balances: [],
  },
  mutations: {
    setBalances(state, payload) {
      const s = state;
      if (payload.length > 0) {
        s.balances = uniqBy(union(s.balances, payload), 'id');
      } else {
        s.balances = [];
      }
    },
    addBalance(state, payload) {
      const s = state;
      if (payload) {
        s.balances.push(payload);
      }
    },
    removeBalance(state, payload) {
      const s = state;
      if (payload) {
        s.balances = remove(s.balances, balance => balance.id !== payload);
      }
    },
    updateBalance(state, payload) {
      const s = state;
      if (payload) {
        const index = findIndex(s.balances, { id: payload.id });
        s.balances.splice(index, 1, payload);
      }
    },
  },
  actions: {
    getBalances({ commit }, query) {
      if (query.page === 1) {
        commit('setBalances', []);
      }
      commit('setLoading', true);
      axios.get('/balances', {
        params: {
          page: query.page,
          perPage: query.perPage,
        },
      })
        .then((res) => {
          if (res.status === 200 && res.data.length > 0) {
            commit('setBalances', res.data);
          }
        })
        .catch((err) => {
          utils.log(`Error getting balance info: ${JSON.stringify(err)}`);
        })
        .finally(() => {
          commit('setLoading', false);
        });
    },
    saveBalance({ commit }, balance) {
      commit('setLoading', true);
      axios.post('/balances', balance)
      .then((res) => {
        commit('addBalance', res.data);
      })
      .catch(err => utils.log(`Error saving balance: ${JSON.stringify(err)}`))
      .finally(() => {
        commit('setLoading', false);
      });
    },
    removeBalance({ commit }, id) {
      commit('setLoading', true);
      axios.delete(`/balances/${id}`)
      .then((res) => {
        if (res.status === 204) {
          commit('removeBalance', id);
        }
      })
      .catch(err => utils.log(`Error removing Balance: ${JSON.stringify(err)}`))
      .finally(() => commit('setLoading', false));
    },
    updateBalance({ commit }, payload) {
      commit('setLoading', true);
      axios.patch(`/balances/${payload.id}`, {
        desc: payload.desc,
        amount: payload.amount,
        mode: payload.mode,
      })
      .then((res) => {
        if (res.status === 200) {
          commit('updateBalance', res.data);
        }
      })
      .catch(err => utils.log(`Error updating category: ${JSON.stringify(err)}`))
      .finally(() => commit('setLoading', false));
    },
  },
  getters: {
    balances(state) {
      return state.balances;
    },
  },
};
