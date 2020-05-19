import Vue from 'vue'
import App from './App.vue'
import Api from './api'
import $ from 'jquery'

Vue.prototype.$ = $
Vue.prototype.$api = Api
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
