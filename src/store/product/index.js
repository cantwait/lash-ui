import axios from 'axios';
import _ from 'lodash';

export default {
  state: {
    categories: [],
  },
  mutations: {
    setCategories(state, payload) {
      if (payload) {
        const s = state;
        s.categories = payload;
      }
    },
    addCategory(state, payload) {
      const s = state;
      if (payload) {
        s.categories.push(payload);
      }
    },
    removeCategory(state, payload) {
      const s = state;
      if (payload) {
        s.categories = _.remove(s.categories, category => category.id !== payload);
      }
    },
    updateCategories(state, payload) {
      const s = state;
      if (payload) {
        const index = _.findIndex(s.categories, { id: payload.id });
        s.categories.splice(index, 1, payload);
      }
    },
  },
  actions: {
    getCategories({ commit }, query) {
      if (query.page === 1) {
        commit('setCategories', []);
      }
      commit('setLoading', true);
      axios.get('/categories', {
        params: {
          page: query.page,
          perPage: query.perPage,
        },
      })
        .then((res) => {
          commit('setCategories', res.data);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          commit('setLoading', false);
        });
    },
    saveCategory({ commit }, category) {
      commit('setLoading', true);
      axios.post('/categories', {
        category,
      })
      .then((res) => {
        commit('addCategory', res.data);
      })
      .catch(err => console.log(err))
      .finally(() => {
        commit('setLoading', false);
      });
    },
    removeCategory({ commit }, id) {
      commit('setLoading', true);
      axios.delete(`/categories/${id}`)
      .then((res) => {
        if (res.status === 200) {
          commit('removeCategory', id);
        }
      })
      .catch(err => console.log(err))
      .finally(() => commit('setLoading', false));
    },
    updateCategory({ commit }, payload) {
      commit('setLoading', true);
      axios.patch(`/categories/${payload.id}`, {
        name: payload.name,
      })
      .then((res) => {
        if (res.status === 200) {
          commit('updateCategories', res.data);
        }
      })
      .catch(err => console.log(err))
      .finally(() => commit('setLoading', false));
    },
  },
  getters: {
    categories(state) {
      return state.categories;
    },
  },
};
