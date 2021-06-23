import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Welcome'
import Users from '@/components/User/Users'
import Rights from '@/components/Power/Rights'
import Roles from '@/components/Power/Roles'
import Cate from '@/components/Goods/Cate'
import Params from '@/components/Goods/Params'
import List from '@/components/Goods/List'
import Add from '@/components/Goods/Add'

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
    ],
  },
]

const router = new VueRouter({
  routes,
})

router.beforeEach((to, from, next) => {
  // to 将要访问的 路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  //  next（）放行  next（‘/login’） 强制跳转
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
