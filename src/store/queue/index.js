import axios from 'axios';
import remove from 'lodash/remove';
import utils from '../../utils';


export default {
  state: {
    queues: [],
  },
  mutations: {
    addQueue(state, payload) {
      if (payload) {
        const s = state;
        s.queues = payload;
      }
    },
    setQueues(state, payload) {
      const s = state;
      if (payload && payload.length > 0) {
        s.queues = payload;
      } else {
        s.queues = [];
      }
    },
    removeQueue(state, payload) {
      const s = state;
      if (payload) {
        s.queues = remove(s.queues, queue => queue.id !== payload);
      }
    },
  },
  actions: {
    getQueues({ commit }) {
      commit('setLoading', true);
      axios.get('/queues')
      .then((res) => {
        commit('setQueues', res.data);
      })
      .catch(err => utils.log(`Error getting products: ${JSON.stringify(err)}`))
      .finally(() => commit('setLoading', false));
    },
    saveQueue({ commit }, customer) {
      commit('setLoading', true);
      axios.post('/queues', {
        customer: customer.id,
      })
      .then((res) => {
        utils.log('Customer persisted in queue: %s', res.data);
        commit('removeCustomerFromCatalog', res.data);
      })
      .catch(err => utils.log(`Error saving category: ${JSON.stringify(err)}`))
      .finally(() => {
        commit('setLoading', false);
      });
    },
    removeQueue({ commit }, id) {
      commit('setLoading', true);
      axios.delete(`/queues/${id}`)
      .then((res) => {
        if (res.status === 204) {
          commit('removeQueue', id);
        }
      })
      .catch(err => utils.log(`Error removing products: ${JSON.stringify(err)}`))
      .finally(() => commit('setLoading', false));
    },
  },
  getters: {
    queues(state) {
      return state.queues;
    },
  },
};
