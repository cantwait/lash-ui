import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from '@/components/Dashboard';
import Signin from '@/components/user/Signin';
import Signup from '@/components/user/Signup';
import Users from '@/components/user/Users';
import Categories from '@/components/product/Categories';
import AuthGuard from './auth.guard';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard,
    },
    {
      path: '/signin',
      name: 'Signin',
      component: Signin,
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup,
    },
    {
      path: '/users',
      name: 'Users',
      component: Users,
      beforeEnter: AuthGuard,
    },
    {
      path: '/categories',
      name: 'Categories',
      component: Categories,
      beforeEnter: AuthGuard,
    },
  ],
  mode: 'hash',
});
