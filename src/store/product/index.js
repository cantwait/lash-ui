import axios from 'axios';
import uniqBy from 'lodash/uniqBy';
import union from 'lodash/union';
import remove from 'lodash/remove';
import findIndex from 'lodash/findIndex';
import utils from '../../utils';

export default {
  state: {
    categories: [],
    products: [],
    pics: [],
    productsxcategory: [],
  },
  mutations: {
    setCategories(state, payload) {
      const s = state;
      if (payload.length > 0) {
        s.categories = uniqBy(union(s.categories, payload), 'id');
      } else {
        s.categories = [];
      }
    },
    setProductsPerCategory(state, payload) {
      if (payload) {
        const s = state;
        s.productsxcategory = [];
        s.productsxcategory = payload;
      }
    },
    setProducts(state, payload) {
      const s = state;
      if (payload.length > 0) {
        s.products = uniqBy(union(s.products, payload), 'id');
      } else {
        s.products = [];
      }
    },
    addPic(state, payload) {
      if (payload) {
        const s = state;
        s.pics.push(payload);
      }
    },
    setPics(state, payload) {
      const s = state;
      if (payload && payload.length > 0) {
        s.pics = payload;
      } else {
        s.pics = [];
      }
    },
    updatePics(state, payload) {
      if (payload && payload.length > 0) {
        const s = state;
        s.pics = uniqBy(union(s.pics, payload), 'id');
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
        s.categories = remove(s.categories, category => category.id !== payload);
      }
    },
    removePic(state, payload) {
      if (payload) {
        const s = state;
        s.pics = remove(s.pics, pic => pic.id !== payload);
      }
    },
    removeProduct(state, payload) {
      if (payload) {
        const s = state;
        s.products = remove(s.products, p => p.id !== payload);
      }
    },
    updateCategories(state, payload) {
      const s = state;
      if (payload) {
        const index = findIndex(s.categories, { id: payload.id });
        s.categories.splice(index, 1, payload);
      }
    },
    updateProducts(state, payload) {
      if (payload) {
        const s = state;
        const index = findIndex(s.products, { id: payload.id });
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
        if (res.data.length > 0) {
          commit('setProducts', res.data);
        }
      })
      .catch(err => utils.log(`Error getting products: ${JSON.stringify(err)}`))
      .finally(() => commit('setLoading', false));
    },
    getProductsPerCategory({ commit }, payload) {
      commit('setLoading', true);
      axios.get(`/categories/${payload}/products`)
        .then((res) => {
          if (res.status === 200 && res.data) {
            commit('setProductsPerCategory', res.data);
          }
        })
        .catch()
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
          if (res.data.length > 0) {
            commit('setCategories', res.data);
          }
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
        generateFee: payload.generateFee,
        offer: payload.offer,
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
        icon: payload.icon,
      })
      .then((res) => {
        if (res.status === 200) {
          commit('updateCategories', res.data);
        }
      })
      .catch(err => utils.log(`Error updating category: ${JSON.stringify(err)}`))
      .finally(() => commit('setLoading', false));
    },
    savePicture({ commit }, payload) {
      commit('setLoading', true);
      axios.post(`/products/${payload.product}/gallery`, {
        url: payload.url,
      })
      .then((res) => {
        if (res.status === 201) {
          commit('addPic', res.data);
        }
      })
      .catch(err => utils.log('Error uploading img: %s', err))
      .finally(() => commit('setLoading', false));
    },
    savePictures({ commit }, payload) {
      commit('setLoading', true);
      axios.post(`/products/${payload.product}/galleries`, {
        urls: payload.urls,
      })
      .then((res) => {
        if (res.status === 201) {
          if (payload.isUpdate) {
            commit('updatePics', res.data);
          } else {
            commit('setPics', res.data);
          }
        }
      })
      .catch(err => utils.log('Error uploadingh pictures: %s', JSON.stringify(err)))
      .finally(() => commit('setLoading', false));
    },
    getPictures({ commit }, payload) {
      commit('setLoading', true);
      axios.get(`/products/${payload}/gallery`)
        .then(res => commit('setPics', res.data))
        .catch(err => utils.log('Error fetching images: %s', JSON.stringify(err)))
        .finally(() => commit('setLoading', false));
    },
    removePic({ commit }, payload) {
      commit('setLoading', true);
      axios.delete(`/products/${payload.product}/gallery/${payload.item}`)
        .then((res) => {
          if (res.status === 204) {
            commit('removePic', payload.item);
          }
        })
        .then(err => utils.log('Error deleting image: %s', JSON.stringify(err)))
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
    pics(state) {
      return state.pics;
    },
    productsByCategory(state) {
      return state.productsxcategory;
    },
  },
};
