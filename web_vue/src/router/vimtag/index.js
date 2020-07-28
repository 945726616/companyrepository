// vimtag项目调用的路由表

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const login = () => import(/* webpackChunkName: "group-Vimtag" */'@/components/login')
const devlist = () => import(/* webpackChunkName: "group-Vimtag" */'@/components/devlist/vimtag')
const my = () => import(/* webpackChunkName: "group-Vimtag" */'@/components/my/vimtag')
const play = () => import(/* webpackChunkName: "group-Vimtag" */'@/components/play/vimtag')
const playback = () => import(/* webpackChunkName: "group-Vimtag" */'@/components/playback')
const history = () => import(/* webpackChunkName: "group-Vimtag" */'@/components/history/vimtag')
const set = () => import(/* webpackChunkName: "group-Vimtag" */'@/components/set')
const boxlist = () => import(/* webpackChunkName: "group-Vimtag" */'@/components/boxlist')

const vimtagRouter = new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/devlist',
      name: 'devlist',
      component: devlist
    },
    {
      path: '/my',
      name: 'my',
      component: my
    },
    {
      path: '/play',
      name: 'play',
      component: play
    },
    {
      path: '/playback',
      name: 'playback',
      component: playback
    },
    {
      path: '/history',
      name: 'history',
      component: history
    },
    {
      path: '/set',
      name: 'set',
      component: set
    },
    {
      path: '/boxlist',
      name: 'boxlist',
      component: boxlist
    }
  ]
})

export default vimtagRouter