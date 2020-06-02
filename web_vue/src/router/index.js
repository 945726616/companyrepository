import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
// import testJq from '@/components/testJq'
const testJq = () => import(/* webpackChunkName: "group-Vimtag" */'@/components/testJq')

Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'HelloWorld',
    //   component: HelloWorld
    // }
    {
      path: '/',
      name: 'testJq',
      component: testJq
    }
  ]
})