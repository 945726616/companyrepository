// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import utils from './lib/utils'
import directive from './lib/directive'
import VueCookies from 'vue-cookies'
import ElementUI from 'element-ui'
import './assets/css/base.css'
import './element-variables.scss'
import 'babel-polyfill'

Vue.use(ElementUI, { size: 'small' })

Vue.use(VueCookies)

Vue.config.productionTip = false
Vue.prototype.utils = utils
// Vue.prototype._ = lodash

router.beforeEach((to, from, next) => {
  console.log(to)
  window.document.title = to.meta.title || '进销存后台管理系统'
  if (!sessionStorage.getItem('user') && to.name !== 'login') {
    next({
      name: 'login'
    })
  } else if (sessionStorage.getItem('user') && to.name !== 'login' && to.name !== 'error') {
    let role = JSON.parse(sessionStorage.getItem('user')).parentVendorId === '0' ? 1 : 2
    // 该路由能被范围的角色包含用户的角色就通过，否则就404
    if (to.meta && to.meta.roles.includes(role)) {
      next()
    } else {
      next({
        name: 'error'
      })
    }
  } else {
    next()
  }
})

router.afterEach(() => {
  // iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})
// 自定义全局过滤器
Vue.filter('timeFormat', utils.timeFormat)
Vue.filter('formatNum', utils.formatNum)
Vue.filter('timeTrim', utils.timeTrim)
// 自定义全局指令
Vue.directive('number-input', directive.numberInput)
Vue.directive('stoke-input', directive.stokeInput)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
