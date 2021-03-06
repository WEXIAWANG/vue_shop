import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from '../components/Login'
const Login = () =>
  import(/* webpackChunkName: "login_home_welcome" */ '../components/Login')
// import Home from '@/components/Home'
const Home = () =>
  import(/* webpackChunkName: "login_home_welcome" */ '@/components/Home')
// import Welcome from '@/components/Welcome'
const Welcome = () =>
  import(/* webpackChunkName: "login_home_welcome" */ '@/components/Welcome')

// import Users from '@/components/User/Users'
// import Rights from '@/components/Power/Rights'
// import Roles from '@/components/Power/Roles'
const Users = () =>
  import(/* webpackChunkName: "users_rights_roles" */ '@/components/User/Users')
const Rights = () =>
  import(
    /* webpackChunkName: "users_rights_roles" */ '@/components/Power/Rights'
  )
const Roles = () =>
  import(
    /* webpackChunkName: "users_rights_roles" */ '@/components/Power/Roles'
  )

// import Cate from '@/components/Goods/Cate'
// import Params from '@/components/Goods/Params'
const Cate = () =>
  import(/* webpackChunkName: "cate_params" */ '@/components/Goods/Cate')
const Params = () =>
  import(/* webpackChunkName: "cate_params" */ '@/components/Goods/Params')

// import List from '@/components/Goods/List'
// import Add from '@/components/Goods/Add'
const List = () =>
  import(/* webpackChunkName: "list_add" */ '@/components/Goods/List')
const Add = () =>
  import(/* webpackChunkName: "list_add" */ '@/components/Goods/Add')

// import Order from '@/components/Order/Order'
// import Report from '@/components/Report/Report'
const Order = () =>
  import(/* webpackChunkName: "order_report" */ '@/components/Order/Order')
const Report = () =>
  import(/* webpackChunkName: "order_report" */ '@/components/Report/Report')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome,
      },
      {
        path: '/users',
        component: Users,
      },
      {
        path: '/rights',
        component: Rights,
      },
      {
        path: '/roles',
        component: Roles,
      },
      {
        path: '/categories',
        component: Cate,
      },
      {
        path: '/params',
        component: Params,
      },
      {
        path: '/goods',
        component: List,
      },
      {
        path: '/goods/add',
        component: Add,
      },
      {
        path: '/orders',
        component: Order,
      },
      {
        path: '/reports',
        component: Report,
      },
    ],
  },
]

const router = new VueRouter({
  routes,
})

router.beforeEach((to, from, next) => {
  // to ??????????????? ??????
  // from ?????????????????????????????????
  // next ??????????????????????????????
  //  next????????????  next??????/login?????? ????????????
  if (to.path === '/login') return next()
  // ??????token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
