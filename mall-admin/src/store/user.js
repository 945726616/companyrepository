// import { ApiFindWechatMenu } from '@/api'

const state = {
  user: sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null,
  editProd: sessionStorage.getItem('editProd') ? JSON.parse(sessionStorage.getItem('editProd')) : null,
  editVipProd: sessionStorage.getItem('editVipProd') ? JSON.parse(sessionStorage.getItem('editVipProd')) : null,
  draftProd: sessionStorage.getItem('draftProd') ? JSON.parse(sessionStorage.getItem('draftProd')) : null,
  draftVipProd: sessionStorage.getItem('draftVipProd') ? JSON.parse(sessionStorage.getItem('draftVipProd')) : null
}

const getters = {
  user: state => state.user,
  editProd: state => state.editProd,
  editVipProd: state => state.editVipProd,
  draftProd: state => state.draftProd,
  draftVipProd: state => state.draftVipProd
}

const actions = {
  // async checkWxConfig({ commit }, id) {
  //   const res = await ApiFindWechatMenu(id)
  //   if (res.errorCode > 0) {
  //     commit('HADSETWXCONFIG')
  //   }
  // }
  setUser: ({commit}, user) => commit('SET_USER', user),
  setEditProd: ({commit}, product) => commit('SET_EDITPROD', product),
  setEditVipProd: ({commit}, product) => commit('SET_EDITVIPPROD', product),
  setDraftProd: ({commit}, product) => commit('SET_DRAFTPROD', product),
  setDraftVipProd: ({commit}, product) => commit('SET_DRAFTPVIPROD', product)
}

const mutations = {
  'SET_USER' (state, data) {
    if (data) {
      state.user = data
      sessionStorage.setItem('user', JSON.stringify(data))
    } else {
      state.user = null
      sessionStorage.removeItem('user')
    }
  },
  'SET_EDITPROD' (state, data) {
    if (data) {
      state.editProd = data
      sessionStorage.setItem('editProd', JSON.stringify(data))
    } else {
      state.editProd = null
      sessionStorage.removeItem('editProd')
    }
  },
  'SET_EDITVIPPROD' (state, data) {
    if (data) {
      state.editVipProd = data
      sessionStorage.setItem('editVipProd', JSON.stringify(data))
    } else {
      state.editVipProd = null
      sessionStorage.removeItem('editVipProd')
    }
  },
  'SET_DRAFTPROD' (state, data) {
    if (data) {
      state.draftProd = data
      sessionStorage.setItem('draftProd', JSON.stringify(data))
    } else {
      state.draftProd = null
      sessionStorage.removeItem('draftProd')
    }
  },
  'SET_DRAFTPVIPROD' (state, data) {
    if (data) {
      state.draftVipProd = data
      sessionStorage.setItem('draftVipProd', JSON.stringify(data))
    } else {
      state.draftVipProd = null
      sessionStorage.removeItem('draftVipProd')
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
