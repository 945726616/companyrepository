import Vue from 'vue'
import store from "./store"
import router from "./router"
import App from './App.vue'
import Api from './api'
import $ from 'jquery'

// 引入多国语言切换插件
import chooseLanguage from './lib/exportModule/languageExport'
Vue.prototype.$chooseLanguage = chooseLanguage
// 获取浏览器默认语言并调用默认语言包
let chromeLang = (navigator.language||navigator.userLanguage).substr(0, 2)
if (chromeLang === 'zh') {
  let originalLang = navigator.language||navigator.userLanguage
  if (originalLang === 'zh-TW') {
    chromeLang = 'tw'
  }
}
sessionStorage.setItem('userLanguage', chromeLang)
chooseLanguage.lang(chromeLang)

Vue.prototype.$ = $
Vue.prototype.$api = Api
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
