import axios from 'axios';
import _ from 'lodash';
import utils from '../../utils';

export default {
  state: {
    customers: [],
  },
  mutations: {
    setCustomers(state, payload) {
      if (payload) {
        const s = state;
        s.customers = payload;
      }
    },
    addCustomer(state, payload) {
      const s = state;
      if (payload) {
        s.customers.push(payload);
      }
    },
    removeCustomer(state, payload) {
      const s = state;
      if (payload) {
        s.customers = _.remove(s.customers, customer => customer.id !== payload);
      }
    },
    updateCustomers(state, payload) {
      const s = state;
      if (payload) {
        const index = _.findIndex(s.customers, { id: payload.id });
        s.customers.splice(index, 1, payload);
      }
    },
  },
  actions: {
    getCustomers({ commit }, query) {
      if (query.page === 1) {
        commit('setCustomers', []);
      }
      commit('setLoading', true);
      axios.get('/customers', {
        params: {
          page: query.page,
          perPage: query.perPage,
        },
      })
        .then((res) => {
          commit('setCustomers', res.data);
        })
        .catch((err) => {
          utils.log(`Error getting customers: ${JSON.stringify(err)}`);
        })
        .finally(() => {
          commit('setLoading', false);
        });
    },
    saveCustomer({ commit }, customer) {
      commit('setLoading', true);
      axios.post('/customers', customer)
      .then((res) => {
        commit('addCustomer', res.data);
      })
      .catch(err => utils.log(`Error saving customer: ${JSON.stringify(err)}`))
      .finally(() => {
        commit('setLoading', false);
      });
    },
    removeCustomer({ commit }, id) {
      commit('setLoading', true);
      axios.delete(`/customers/${id}`)
      .then((res) => {
        if (res.status === 204) {
          commit('removeCustomer', id);
        }
      })
      .catch(err => utils.log(`Error removing customer: ${JSON.stringify(err)}`))
      .finally(() => commit('setLoading', false));
    },
    updateCustomer({ commit }, payload) {
      commit('setLoading', true);
      axios.patch(`/customers/${payload.id}`, {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        birthdate: payload.birthdate,
      })
      .then((res) => {
        if (res.status === 200) {
          commit('updateCustomers', res.data);
        }
      })
      .catch(err => utils.log(`Error updating customer: ${JSON.stringify(err)}`))
      .finally(() => commit('setLoading', false));
    },
  },
  getters: {
    customers(state) {
      return state.customers;
    },
  },
};
