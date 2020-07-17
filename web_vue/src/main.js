import Vue from 'vue'
import store from "./store"
import router from "./router"
import App from './App.vue'
import Api from './api'
import $ from 'jquery'
import Public from './util/public.js'

// 引入多国语言切换插件
import chooseLanguage from './lib/exportModule/languageExport'
Vue.prototype.$chooseLanguage = chooseLanguage
if (!sessionStorage.getItem('userLanguage')) {
  let chromeLang = (navigator.language || navigator.userLanguage).substr(0, 2)
  if (chromeLang === 'zh') {
    let originalLang = navigator.language || navigator.userLanguage
    if (originalLang === 'zh-TW') {
      chromeLang = 'tw'
    }
  }
  sessionStorage.setItem('userLanguage', chromeLang)
  chooseLanguage.lang(chromeLang)
} else {
  chooseLanguage.lang(sessionStorage.getItem('userLanguage'))
}
Date.prototype.format = function (format) {
	let o = {
		"M+": this.getMonth() + 1, //month
		"d+": this.getDate(),    //day
		"h+": this.getHours(),   //hour
		"m+": this.getMinutes(), //minute
		"s+": this.getSeconds(), //second
		"q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
		"S": this.getMilliseconds() //millisecond
	}
	if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
		(this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (let k in o) if (new RegExp("(" + k + ")").test(format))
		format = format.replace(RegExp.$1,
			RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
	return format;
}

Vue.prototype.$ = $
Vue.prototype.$api = Api
Vue.config.productionTip = false
Vue.prototype.publicFunc = Public

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
