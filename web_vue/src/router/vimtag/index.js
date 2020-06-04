// vimtag项目调用的路由表

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const login = () => import(/* webpackChunkName: "group-Vimtag" */'@/components/login')

const vimtagRouter = new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    }
  ]
})

export default vimtagRouter