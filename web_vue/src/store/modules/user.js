// 存储用户信息vuex
const user = {
  state: {
    name: '',
    password: '',
    tid: 0,
    lid: 0,
    sid: 0,
    seq: 0,
    shareKey: ''
  },

  mutations: {
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_PASSWORD: (state, password) => {
      state.password = password
    },
    SET_TID: (state, tid) => {
      state.tid = tid
    },
    SET_LID: (state, lid) => {
      state.lid = lid
    },
    SET_SHARE_KEY: (state, shareKey) => {
      state.shareKey = shareKey
    },
    SET_SEQ: (state, seq) => {
      state.seq = seq
    },
    SET_SID: (state, sid) => {
      state.sid = sid
    }
  },

  actions: {
    setName: ({commit}, name) => commit('SET_NAME', name),
    setPassword: ({commit}, password) => commit('SET_PASSWORD', password),
    setTid: ({commit}, tid) => commit('SET_TID', tid),
    setLid: ({commit}, lid) => commit('SET_LID', lid),
    setShareKey: ({commit}, shareKey) => commit('SET_SHARE_KEY', shareKey),
    setSeq: ({commit}, seq) => commit('SET_SEQ', seq),
    setSid: ({commit}, sid) => commit('SET_SEQ', sid)
  }
}

export default user
