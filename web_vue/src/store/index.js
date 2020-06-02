import Vue from 'vue'
import Vuex from 'vuex'
import getter from './getter'
import user from './modules/user'
import jumpPageData from './modules/jumpPageData'

Vue.use(Vuex)


const store = new Vuex.Store({
  modules: {
    user,
    jumpPageData
  },
  getter
})

export default store
