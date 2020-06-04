// mipc系列项目调用路由表

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const testJq = () => import(/* webpackChunkName: "group-Vimtag" */'@/components/testJq')

const mipcRouter = new Router({
  routes: [
    {
      path: '/',
      name: 'testJq',
      component: testJq
    }
  ]
})

export default mipcRouter