import axios from 'axios';
import uniqBy from 'lodash/uniqBy';
import union from 'lodash/union';
import remove from 'lodash/remove';
import findIndex from 'lodash/findIndex';
import utils from '../../utils';

export default {
  state: {
    customers: [],
    customersCatalog: [],
    sessionsByCustomer: [],
  },
  mutations: {
    setCatalog(state, payload) {
      if (payload) {
        const s = state;
        s.customersCatalog = payload;
      }
    },
    setSessionsByCustomer(state, payload) {
      if (payload) {
        const s = state;
        s.sessionsByCustomer = payload;
      }
    },
    setCustomers(state, payload) {
      const s = state;
      if (payload && payload.length > 0) {
        s.customers = uniqBy(union(s.customers, payload), 'id');
      } else {
        s.customers = [];
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
        s.customers = remove(s.customers, customer => customer.id !== payload);
      }
    },
    updateCustomers(state, payload) {
      const s = state;
      if (payload) {
        const index = findIndex(s.customers, { id: payload.id });
        s.customers.splice(index, 1, payload);
      }
    },
    removeCustomerFromCatalog(state, payload) {
      if (payload) {
        const s = state;
        s.customersCatalog = remove(s.customersCatalog, { id: payload.customer.id });
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
          if (res.status === 200 && res.data.length > 0) {
            commit('setCustomers', res.data);
          }
        })
        .catch((err) => {
          utils.log(`Error getting customers: ${JSON.stringify(err)}`);
        })
        .finally(() => {
          commit('setLoading', false);
        });
    },
    getSessionsByCustomer({ commit }, customerId) {
      commit('setLoading', true);
      axios.get(`/customers/${customerId}/sessions`)
        .then(res => commit('setSessionsByCustomer', res.data))
        .catch(err => utils.log('error: %s', err))
        .finally(() => commit('setLoading', false));
    },
    findCustomersLike({ commit }, name) {
      commit('setLoading', true);
      axios.get('customers/search', {
        params: {
          name,
        },
      })
      .then((res) => {
        // need to pass the queues so we can remove those
        // customers already either in queues or sessions
        commit('setCatalog', res.data);
      })
      .catch(e => utils.log('Error getting customers by name: %s', e))
      .finally(() => commit('setLoading', false));
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
    catalog(state) {
      return state.customersCatalog;
    },
    getSessionsByCustomer(state) {
      return state.sessionsByCustomer;
    },
  },
};
