import axios from 'axios';
import forEach from 'lodash/forEach';
import reduce from 'lodash/reduce';
import remove from 'lodash/remove';
import findIndex from 'lodash/findIndex';
import utils from '../../utils';

const ITBMS = 0.07;

export default {
  state: {
    sessions: [],
  },
  mutations: {
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
      if ('customer' in payload) {
        currSession.customer = payload.customer;
      }
      if ('services' in payload) {
        const accum = (sum, s) => sum + s.price;

        const currUser = payload.user;
        const services = forEach(payload.services,
          (value) => { const s = value; s.responsible = currUser; });
        let prevSubtotal = 0;
        if (currSession.services.length > 0) {
          const prevServices = currSession.services;
          prevSubtotal = reduce(prevServices, accum, 0);
        }

        const subTotal = reduce(services, accum, prevSubtotal);

        currSession.services = services.concat(currSession.services);
        const itbms = subTotal * ITBMS;
        currSession.itbms = itbms;
        currSession.subtotal = subTotal;
        currSession.total = subTotal + itbms;
      }

      if ('serviceRemove' in payload) {
        const accum = (sum, s) => sum + s.price;
        const prevServices = currSession.services;
        const prevSubtotal = reduce(prevServices, accum, 0);
        const s = payload.serviceRemove;
        const index = findIndex(prevServices, serv => serv.id === s.id);
        prevServices.splice(index, 1);
        const newSubTotal = prevSubtotal - s.price;

        currSession.services = prevServices;
        currSession.subtotal = newSubTotal;
        const newItbms = newSubTotal * ITBMS;
        currSession.itbms = newItbms;
        currSession.total = newSubTotal + newItbms;
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
  },
};
