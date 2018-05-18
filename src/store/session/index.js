import axios from 'axios';
import forEach from 'lodash/forEach';
import reduce from 'lodash/reduce';
import remove from 'lodash/remove';
import findIndex from 'lodash/findIndex';
import find from 'lodash/find';
import utils from '../../utils';

// const ITBMS = 0.07;

// const ACUMM = (sum, s) => sum + s.subtotal;

const ACUMM = (sum, s) => {
  let ac = sum;
  if (s.total > 0) {
    ac = sum + s.total;
  } else {
    ac = sum + s.subtotal;
  }
  return ac;
};
const SERVICESACUM = (sum, s) => sum + s.services.length;

export default {
  state: {
    sessions: [],
    balance: {
      total: 0,
      sessions: 0,
      services: 0,
    },
  },
  mutations: {
    setBalance(state, payload) {
      if (payload) {
        const s = state;
        const balance = {
          total: reduce(payload, ACUMM, 0),
          sessions: payload.length,
          services: reduce(payload, SERVICESACUM, 0),
        };
        s.balance = balance;
      }
    },
    addOrUpdateSession(state, payload) {
      if (payload) {
        const s = state;
        const index = findIndex(s.sessions, { id: payload.id });
        if (index !== -1) {
          s.sessions.splice(index, 1, payload);
        } else {
          s.sessions.push(payload);
        }
      }
    },
    addProductToSession(state, payload) {
      if (payload) {
        const s = state;
        const sessionId = payload.sessionId;
        const product = payload.product;
        const session = find(s.sessions, { id: sessionId });
        const index = findIndex(s.sessions, { id: sessionId });
        session.push(product);
        s.sessions.splice(index, 1, session);
      }
    },
    addCustomerToSession(state, payload) {
      if (payload) {
        const s = state;
        const sessionId = payload.sessionId;
        const customer = payload.customer;
        const session = find(s.sessions, { id: sessionId });
        session.customer = customer;
        const index = findIndex(s.sessions, { id: sessionId });
        s.sessions.splice(index, 1, session);
      }
    },
    setSessions(state, payload) {
      const s = state;
      if (payload && payload.length > 0) {
        s.sessions = payload;
      } else {
        s.sessions = [];
      }
    },
    removeSession(state, payload) {
      const s = state;
      if (payload) {
        s.sessions = remove(s.sessions, session => session.id !== payload);
      }
    },
  },
  actions: {
    getSessions({ commit }) {
      commit('setLoading', true);
      axios.get('/sessions')
      .then((res) => {
        commit('setSessions', res.data);
      })
      .catch(err => utils.log(`Error getting sessions: ${JSON.stringify(err)}`))
      .finally(() => commit('setLoading', false));
    },
    getBalance({ commit }, date) {
      commit('setLoading', true);
      const encodedDate = encodeURI(date);
      axios.get(`/sessions/balance/${encodedDate}`)
        .then(res => commit('setBalance', commit('setBalance', res.data)))
        .catch(e => utils.log('error: %s', e))
        .finally(() => commit('setLoading', false));
    },
    saveSession({ commit }, session) {
      commit('setLoading', true);
      axios.post('/sessions', session)
      .then((res) => {
        utils.log('session persisted: %s', res.data);
        // pusher takes care of the rest...
      })
      .catch(err => utils.log(`Error saving Session: ${JSON.stringify(err)}`))
      .finally(() => {
        commit('setLoading', false);
      });
    },
    updateSession({ commit, state }, payload) {
      commit('setLoading', true);
      const currSession = find(state.sessions, { id: payload.sessionId });
      if ('isItbms' in payload) {
        currSession.isTax = payload.isItbms;
      }
      if ('customer' in payload) {
        currSession.customer = payload.customer;
      }
      if ('transactionType' in payload) {
        currSession.transactionType = payload.transactionType;
      }
      if ('discount' in payload) {
        utils.log('discount: %s', payload.discount);
        const prevServices = currSession.services;
        const accum = (sum, s) => sum + s.price;
        const subtotal = reduce(prevServices, accum, 0);
        currSession.subtotal = subtotal;
        currSession.discount = payload.discount;
      }
      if ('services' in payload) {
        // const accum = (sum, s) => sum + s.price;

        const currUser = payload.user;
        const services = forEach(payload.services,
          (value) => { const s = value; s.responsible = currUser; });
        // let prevSubtotal = 0;
        // if (currSession.services.length > 0) {
        //   const prevServices = currSession.services;
        //   prevSubtotal = reduce(prevServices, accum, 0);
        // }

        // const subTotal = reduce(services, accum, prevSubtotal);

        currSession.services = services.concat(currSession.services);
        // const itbms = subTotal * ITBMS;
        // currSession.itbms = itbms;
        // currSession.subtotal = subTotal;
        // currSession.total = subTotal + itbms;
      }

      if ('serviceRemove' in payload) {
        const prevServices = currSession.services;
        const s = payload.serviceRemove;
        const index = findIndex(prevServices, serv => serv.id === s.id);
        prevServices.splice(index, 1);

        currSession.services = prevServices;
        // const newItbms = newSubTotal * ITBMS;
        // currSession.itbms = newItbms;
        // currSession.total = newSubTotal + newItbms;
      }

      if ('rating' in payload && 'comment' in payload && 'state' in payload) {
        currSession.rating = payload.rating;
        currSession.comment = payload.comment;
        currSession.state = payload.state;
      }

      utils.log('curr session: %s', JSON.stringify(currSession));

      axios.patch(`/sessions/${payload.sessionId}`, currSession)
        .then((res) => {
          utils.log('status: %s', res.status);
        })
        .catch(err => utils.log('error: %s', JSON.stringify(err)))
        .finally(() => commit('setLoading', false));
    },
    removeSession({ commit }, id) {
      commit('setLoading', true);
      axios.delete(`/sessions/${id}`)
      .then((res) => {
        if (res.status === 204) {
          // commit('removeQueue', id);
        }
      })
      .catch(err => utils.log(`Error removing products: ${JSON.stringify(err)}`))
      .finally(() => commit('setLoading', false));
    },
  },
  getters: {
    sessions(state) {
      return state.sessions;
    },
    getSessionById(state) {
      return keyword => find(state.sessions, { id: keyword });
    },
    balance(state) {
      return state.balance;
    },
  },
};
