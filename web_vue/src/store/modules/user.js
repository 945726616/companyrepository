// 存储用户信息vuex
const user = {
  state: {
    name: '', // 用户名
    password: '', // 密码
    tid: 0, // dh获取的相关加密验证id
    lid: 0,
    sid: 0,
    seq: 0,
    shareKey: '',
    secretKey: '', // dh校验使用的私钥
    mmqFlag: 0, // mmq是否创建标志
    mmqPickTimeFlag1: null, // mmq轮询回调计时器1标识
    mmqPickTimeFlag2: null, // mmq轮询回调计时器2标识
    qid: '' // 存储qid用于请求中
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
    },
    SET_SECRET_KEY: (state, secretKey) => {
      state.secretKey = secretKey
    },
    SET_MMQ_FLAG: (state, mmqFlag) => {
      state.mmqFlag = mmqFlag
    },
    SET_QID: (state, qid) => {
      state.qid = qid
    },
    SET_MMQ_PICK_TIME_FLAG_1: (state, mmqPickTimeFlag1) => {
      state.mmqPickTimeFlag1 = mmqPickTimeFlag1
    },
    SET_MMQ_PICK_TIME_FLAG_2: (state, mmqPickTimeFlag2) => {
      state.mmqPickTimeFlag2 = mmqPickTimeFlag2
    }
  },

  actions: {
    setName: ({commit}, name) => commit('SET_NAME', name),
    setPassword: ({commit}, password) => commit('SET_PASSWORD', password),
    setTid: ({commit}, tid) => commit('SET_TID', tid),
    setLid: ({commit}, lid) => commit('SET_LID', lid),
    setShareKey: ({commit}, shareKey) => commit('SET_SHARE_KEY', shareKey),
    setSeq: ({commit}, seq) => commit('SET_SEQ', seq),
    setSid: ({commit}, sid) => commit('SET_SID', sid),
    setSecretKey: ({commit}, secretKey) => commit('SET_SECRET_KEY', secretKey),
    setMmqFlag: ({commit}, mmqFlag) => commit('SET_MMQ_FLAG', mmqFlag),
    setQid: ({commit}, qid) => commit('SET_QID', qid),
    setMmqPickTimeFlag1: ({commit}, mmqPickTimeFlag1) => commit('SET_MMQ_PICK_TIME_FLAG_1', mmqPickTimeFlag1),
    setMmqPickTimeFlag2: ({commit}, mmqPickTimeFlag2) => commit('SET_MMQ_PICK_TIME_FLAG_2', mmqPickTimeFlag2)
  }
}

export default user
