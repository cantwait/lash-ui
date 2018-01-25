export default {
  state: {
    loading: false,
    error: null,
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
  },
  actions: {
    clearError({ commit }) {
      commit('clearError');
    },
  },
  getters: {
    loading(state) {
      return state.loading;
    },
    error(state) {
      return state.error;
    },
  },
};
