import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from '@/components/Dashboard';
import Signin from '@/components/user/Signin';
import Signup from '@/components/user/Signup';
import Users from '@/components/user/Users';
import Categories from '@/components/product/Categories';
import Customers from '@/components/customer/Customers';
import Products from '@/components/product/Products';
import Balances from '@/components/balance/Balances';
import Profile from '@/components/shared/Profile';
import AuthGuard from './auth.guard';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard,
      beforeEnter: AuthGuard,
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
    {
      path: '/customers',
      name: 'Customers',
      component: Customers,
      beforeEnter: AuthGuard,
    },
    {
      path: '/services',
      name: 'Services',
      component: Products,
      beforeEnter: AuthGuard,
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      beforeEnter: AuthGuard,
    },
    {
      path: '/balances',
      name: 'Balance',
      component: Balances,
      beforeEnter: AuthGuard,
    },
  ],
  mode: 'history',
});
