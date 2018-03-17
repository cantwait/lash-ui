import axios from 'axios';
import _ from 'lodash';
import utils from '../../utils';


export default {
  state: {
    sessions: [],
  },
  mutations: {
    addOrUpdateSession(state, payload) {
      if (payload) {
        const s = state;
        const index = _.findIndex(s.sessions, { id: payload.id });
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
        const session = _.find(s.sessions, { id: sessionId });
        const index = _.findIndex(s.sessions, { id: sessionId });
        session.push(product);
        s.sessions.splice(index, 1, session);
      }
    },
    addCustomerToSession(state, payload) {
      if (payload) {
        const s = state;
        const sessionId = payload.sessionId;
        const customer = payload.customer;
        const session = _.find(s.sessions, { id: sessionId });
        session.customer = customer;
        const index = _.findIndex(s.sessions, { id: sessionId });
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
        s.sessions = _.remove(s.sessions, session => session.id !== payload);
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
      debugger;
      commit('setLoading', true);
      const currSession = _.find(state.sessions, { id: payload.sessionId });
      if ('customer' in payload) {
        currSession.customer = payload.customer;
      }
      if ('services' in payload) {
        const accum = (sum, s) => sum + s.price;

        const currUser = payload.user;
        const services = _.forEach(payload.services,
          (value) => { const s = value; s.responsible = currUser; });
        let prevTotal = 0;
        if (currSession.services.length > 0) {
          const prevServices = currSession.services;
          prevTotal = _.reduce(prevServices, accum, 0);
        }

        const total = _.reduce(services, accum, prevTotal);

        currSession.services = services.concat(currSession.services);

        currSession.total = total;
      }
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
      return keyword => _.find(state.sessions, { id: keyword });
    },
  },
};
