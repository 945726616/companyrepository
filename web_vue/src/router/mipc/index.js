// mipc系列项目调用路由表

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const login = () => import(/* webpackChunkName: "group-Vimtag" */'@/components/login')
const devlist = () => import(/* webpackChunkName: "group-Vimtag" */'@/components/devlist/mipc')
const boxlist = () => import(/* webpackChunkName: "group-Vimtag" */'@/components/boxlist')
const play = () => import(/* webpackChunkName: "group-Vimtag" */'@/components/play/mipc')

const mipcRouter = new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/devlist',
      name: 'devlist',
      component: devlist,
      children:[
        {
          path: '/boxlist',
          name: 'boxlist',
          component: boxlist
        },
        {
          path: '/play',
          name: 'play',
          component: play
        }
      ]
    }
  ]
})

export default mipcRouter