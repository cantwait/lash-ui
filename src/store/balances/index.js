import axios from 'axios';
import _ from 'lodash';
import utils from '../../utils';

export default {
  state: {
    balances: [],
  },
  mutations: {
    setBalances(state, payload) {
      const s = state;
      if (payload.length > 0) {
        s.balances = _.uniqBy(_.union(s.balances, payload), 'id');
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
        s.balances = _.remove(s.balances, balance => balance.id !== payload);
      }
    },
    updateBalance(state, payload) {
      const s = state;
      if (payload) {
        const index = _.findIndex(s.balances, { id: payload.id });
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
          commit('setBalances', res.data);
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
    updateCategory({ commit }, payload) {
      commit('setLoading', true);
      axios.patch(`/balances/${payload.id}`, {
        desc: payload.desc,
        amount: payload.amount,
        mode: payload.mode,
      })
      .then((res) => {
        if (res.status === 200) {
          commit('updateBalances', res.data);
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
