// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* eslint-disable */
import Vue from 'vue';
import Vuetify from 'vuetify';
import * as moment from 'moment';
import 'vuetify/dist/vuetify.css';
import 'font-awesome/css/font-awesome.css';
import axios from 'axios';
import store from './store/index';
import AlertCmp from './components/Shared/Alert';

import App from './App';
import CreateUser from './components/user/CreateUser';
import EditUser from './components/user/EditUser';
import DeleteDialog from './components/shared/DeleteDialog';
import CreateCategory from './components/product/CreateCategory';
import EditCategory from './components/product/EditCategory';
import router from './router';

Vue.use(Vuetify);
Vue.component('app-alert', AlertCmp);
Vue.component('app-user-add-form-dialog', CreateUser);
Vue.component('app-user-edit-form-dialog', EditUser);
Vue.component('lash-delete-dialog', DeleteDialog);
Vue.component('lash-create-category', CreateCategory);
Vue.component('lash-edit-category', EditCategory);
Vue.config.productionTip = false;

axios.defaults.baseURL = 'http://localhost:3000/api/v1';
axios.defaults.headers.get.Accepts = 'application/json';

axios.interceptors.request.use((config) => {
  console.log('Request Interceptor', config);
  const token = store.getters.token;
  if(token) {
    const now = moment();
    const tokenExpires = moment(token.expiresIn);
    if(now.isAfter(tokenExpires)){
      // need to refresh
      const axiosRefresh = axios.create({
        baseURL: 'http://localhost:3000/api/v1',
      });
      const currUser = store.getters.user;
      const body = {
        email: currUser.email,
        refreshToken: token.refreshToken,
      }
      axiosRefresh.post('/auth/refresh-token', body)
        .then((res) => {
          if(res.data){
            store.commit('setToken',res.data);
            config.headers.authorization = 'Bearer ' + store.getters.token.accessToken;
            return config;
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {

        });
    } else {
      config.headers.authorization = 'Bearer ' + token.accessToken;
      return config;
    }
  }else{
    return config;
  }
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
