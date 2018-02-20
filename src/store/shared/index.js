import utils from '../../utils';

export default {
  state: {
    loading: false,
    error: null,
    image: null,
  },
  mutations: {
    setLoading(state, payload) {
      const s = state;
      s.loading = payload;
    },
    setError(state, payload) {
      const s = state;
      s.error = payload;
    },
    clearError(state) {
      const s = state;
      s.error = null;
    },
    setImageResized(state, payload) {
      const s = state;
      s.imageResized = payload;
    },
    setImage(state, payload) {
      const s = state;
      s.image = payload;
    },
  },
  actions: {
    getImageUrl({ commit }, payload) {
      utils.resizeImage(payload.el)
        .then(res => commit('setImage', res))
        .catch((err) => {
          utils.log(err);
        });
    },
  },
  getters: {
    loading(state) {
      return state.loading;
    },
    error(state) {
      return state.error;
    },
    image(state) {
      return state.imageURL;
    },
  },
};
