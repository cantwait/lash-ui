// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* eslint-disable */
import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.css';
import 'font-awesome/css/font-awesome.css';
import axios from 'axios';
import store from './store/index';
import AlertCmp from './components/Shared/Alert.vue';

import App from './App';
import router from './router';

Vue.use(Vuetify);
Vue.component('app-alert', AlertCmp);
Vue.config.productionTip = false;

axios.defaults.baseURL = 'http://localhost:3000/api/v1';
axios.defaults.headers.get.Accepts = 'application/json';

axios.interceptors.request.use((config) => {
  console.log('Request Interceptor', config);
  return config;
});
axios.interceptors.response.use((res) => {
  console.log('Response Interceptor', res);
  return res;
});

// axios.defaults.headers.common.Authorization = ;
// axios.defaults.headers.post['Content-Type'] = 'application/json';
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
});
