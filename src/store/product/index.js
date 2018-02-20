import axios from 'axios';
import _ from 'lodash';
import utils from '../../utils';

export default {
  state: {
    categories: [],
    products: [],
  },
  mutations: {
    setCategories(state, payload) {
      const s = state;
      if (payload.length > 0) {
        s.categories = _.uniqBy(_.union(s.categories, payload), 'id');
      }
    },
    setProducts(state, payload) {
      const s = state;
      if (payload.length > 0) {
        s.products = _.uniqBy(_.union(s.products, payload), 'id');
      }
    },
    addCategory(state, payload) {
      const s = state;
      if (payload) {
        s.categories.push(payload);
      }
    },
    addProduct(state, payload) {
      if (payload) {
        const s = state;
        s.products.push(payload);
      }
    },
    removeCategory(state, payload) {
      const s = state;
      if (payload) {
        s.categories = _.remove(s.categories, category => category.id !== payload);
      }
    },
    removeProduct(state, payload) {
      if (payload) {
        const s = state;
        s.products = _.remove(s.products, p => p.id !== payload);
      }
    },
    updateCategories(state, payload) {
      const s = state;
      if (payload) {
        const index = _.findIndex(s.categories, { id: payload.id });
        s.categories.splice(index, 1, payload);
      }
    },
    updateProducts(state, payload) {
      if (payload) {
        const s = state;
        const index = _.findIndex(s.products, { id: payload.id });
        s.products.splice(index, 1, payload);
      }
    },
  },
  actions: {
    getProducts({ commit }, query) {
      if (query.page === 1) {
        commit('setProducts', []);
      }
      commit('setLoading', true);
      axios.get('/products', {
        params: {
          page: query.page,
          perPage: query.perPage,
        },
      })
      .then((res) => {
        commit('setProducts', res.data);
      })
      .catch(err => utils.log(`Error getting products: ${JSON.stringify(err)}`))
      .finally(() => commit('setLoading', false));
    },
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
          utils.log(`Error getting categories: ${JSON.stringify(err)}`);
        })
        .finally(() => {
          commit('setLoading', false);
        });
    },
    saveProduct({ commit }, product) {
      commit('setLoading', true);
      axios.post('/products', product)
      .then((res) => {
        commit('addProduct', res.data);
      })
      .catch((err) => {
        commit('setError', err.data);
      })
      .finally(() => commit('setLoading', false));
    },
    saveCategory({ commit }, category) {
      commit('setLoading', true);
      axios.post('/categories', category)
      .then((res) => {
        commit('addCategory', res.data);
      })
      .catch(err => utils.log(`Error saving category: ${JSON.stringify(err)}`))
      .finally(() => {
        commit('setLoading', false);
      });
    },
    removeProduct({ commit }, id) {
      commit('setLoading', true);
      axios.delete(`/products/${id}`)
      .then((res) => {
        if (res.status === 204) {
          commit('removeProduct', id);
        }
      })
      .catch(err => utils.log(`Error removing products: ${JSON.stringify(err)}`))
      .finally(() => commit('setLoading', false));
    },
    removeCategory({ commit }, id) {
      commit('setLoading', true);
      axios.delete(`/categories/${id}`)
      .then((res) => {
        if (res.status === 204) {
          commit('removeCategory', id);
        }
      })
      .catch(err => utils.log(`Error removing category: ${JSON.stringify(err)}`))
      .finally(() => commit('setLoading', false));
    },
    updateProduct({ commit }, payload) {
      commit('setLoading', true);
      axios.patch(`/products/${payload.id}`, {
        name: payload.name,
        price: payload.price,
        description: payload.description,
        specs: payload.specs,
        category: payload.category,
      })
      .then((res) => {
        commit('updateProducts', res.data);
      })
      .catch((err) => {
        commit('setError', err.data);
      })
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
      .catch(err => utils.log(`Error updating category: ${JSON.stringify(err)}`))
      .finally(() => commit('setLoading', false));
    },
  },
  getters: {
    categories(state) {
      return state.categories;
    },
    products(state) {
      return state.products;
    },
  },
};
