import utils from '../../utils';

export default {
  state: {
    loading: false,
    error: null,
    imageURL: null,
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
    setImageUrl(state, payload) {
      const s = state;
      s.imageURL = payload;
    },
  },
  actions: {
    clearError({ commit }) {
      commit('clearError');
    },
    getImageUrl({ commit }, payload) {
      utils.resizeImage(payload.el)
        .then(res => utils.dataURLtoFile(res, payload.name))
        .then((res) => {
          const formData = new FormData();
          formData.append('file', res);
          formData.append('upload_preset', 'z6cfaxkc');
          formData.append('tags', 'gs-lash,gs-lash-uploaded');
          return utils.uploadToCloudify(formData);
        })
        .then((res) => {
          commit('setImageUrl', res.data.secure_url);
        })
        .catch((err) => {
          console.log(err);
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
    imageURL(state) {
      return state.imageURL;
    },
  },
};
