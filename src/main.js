// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* eslint-disable */
import Vue from 'vue';
import Vuetify from 'vuetify';
import * as moment from 'moment';
import VuePusher from 'vue-pusher';
import VueTimeago from 'vue-timeago';
import VueFilter from 'vue-filter';
import 'vuetify/dist/vuetify.css';
import 'font-awesome/css/font-awesome.css';
import axios from 'axios';
import store from './store/index';
import AlertCmp from './components/shared/Alert';

import App from './App';
import CreateUser from './components/user/CreateUser';
import EditUser from './components/user/EditUser';
import DeleteDialog from './components/shared/DeleteDialog';
import CreateCategory from './components/product/CreateCategory';
import EditCategory from './components/product/EditCategory';
import router from './router';
import utils from './utils';

Vue.use(VuePusher, {
  api_key: process.env.PUSHER_KEY,
  options: {
    cluster: process.env.PUSHER_CLUSTER,
    encrypted: true,
  }
});

Vue.use(Vuetify, {
  theme: {
    primary: "#F8BBD0",
    secondary: "#F8BBD0",
    accent: "#F8BBD0",
    error: "#f44336",
    warning: "#ffeb3b",
    info: "#2196f3",
    success: "#4caf50"
  },
});

Vue.use(VueTimeago, {
  name: 'lash-timeago', // component name, `timeago` by default
  locale: 'es-ES',
  locales: {
    // you will need json-loader in webpack 1
    'es-ES': require('vue-timeago/locales/es-ES.json')
  }
});

Vue.use(VueFilter);

Vue.component('app-alert', AlertCmp);
Vue.component('app-user-add-form-dialog', CreateUser);
Vue.component('app-user-edit-form-dialog', EditUser);
Vue.component('lash-delete-dialog', DeleteDialog);
Vue.component('lash-create-category', CreateCategory);
Vue.component('lash-edit-category', EditCategory);
Vue.config.productionTip = false;

const baseURL = process.env.NODE_ENV === 'production' ? 'https://api.lalalashbeautybar.com/api/v1' : 'http://192.168.1.123:3000/api/v1';

axios.defaults.baseURL = baseURL;
axios.defaults.headers.get.Accepts = 'application/json';

axios.interceptors.request.use((config) => {
  let originalRequest = config;
  const token = store.getters.token;
  if (token) {
    const now = moment();
    const tokenExpires = moment(token.expiresIn);
    const isTokenExpired = now.isAfter(tokenExpires);
    if (isTokenExpired) {
      const axiosRefresh = axios.create({
        baseURL,
      });
      return issueToken(token)
        .then((response) => {
          store.commit('setToken',response.data);
          originalRequest.headers.authorization = 'Bearer ' + response.data.accessToken;
          return Promise.resolve(originalRequest);
        })
    } else {
      config.headers.authorization = 'Bearer ' + token.accessToken;
    }
  }
  return config;
}, (err) => {
  return Promise.reject(err);
});

function issueToken(token) {
  return new Promise((resolve,reject) => {
    const axiosRefresh = axios.create({
      baseURL,
    });
    const currUser = store.getters.user;
    const body = {
      email: currUser.email,
      refreshToken: token.refreshToken,
    }
    return axiosRefresh.post('/auth/refresh-token', body)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
  });
}

axios.interceptors.response.use((res) => {
  utils.log('Response Interceptor: %s', res);
  return res;
});

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
});
