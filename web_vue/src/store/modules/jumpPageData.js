// 跳转页面使用的vuex进行数据存储
const jumpPageData = {
  state: {
    pageDom: '',
    pageObj: {},
    projectName: sessionStorage.getItem('projectName') ? sessionStorage.getItem('projectName') : '',
    jmLogoFlag: 0,
    localModel: window.location.protocol === "file:" ? 1 : 0,
    loginWaitFlag: 0,
    experienceFlag: 0, // 是否为体验状态
    loginFlag: 0, // 是否登录标识
    downloadManualUrl: '', // vsmahome用户手册下载域名
    playDownloadUrl: '' // 视频播放时会用到该地址
  },
  mutations: {
    SET_PAGE_DOM: (state, pageDom) => {
      state.pageDom = pageDom
    },
    SET_PAGE_OBJ: (state, pageObj) => {
      state.pageObj = pageObj
    },
    SET_PROJECT_NAME: (state, projectName) => {
      state.projectName = projectName
    },
    SET_JM_LOGO_FLAG: (state, jmLogoFlag) => {
      state.jmLogoFlag = jmLogoFlag
    },
    SET_LOCAL_MODEL: (state, localModel) => {
      state.localModel = localModel
    },
    SET_LOGIN_WAIT_FLAG: (state, loginWaitFlag) => {
      state.loginWaitFlag = loginWaitFlag
    },
    SET_EXPERIENCE_FLAG: (state, experienceFlag) => {
      state.experienceFlag = experienceFlag
    },
    SET_LOGIN_FLAG:(state, loginFlag) => {
      state.loginFlag = loginFlag
    },
    SET_DOWNLOAD_MANUAL_URL: (state, downloadManualUrl) => {
      state.downloadManualUrl = downloadManualUrl
    },
    SET_PLAY_DOWNLOAD_URL: (state, playDownloadUrl) => {
      state.playDownloadUrl = playDownloadUrl
    }
  },
  actions: {
    setPageDom: ({commit}, pageDom) => commit('SET_PAGE_DOM', pageDom),
    setPageObj: ({commit}, pageObj) => commit('SET_PAGE_OBJ', pageObj),
    setProjectName: ({commit}, projectName) => commit('SET_PROJECT_NAME', projectName),
    setJmLogoFlag: ({commit}, jmLogoFlag) => commit('SET_JM_LOGO_FLAG', jmLogoFlag),
    setLocalModel: ({commit}, localModel) => commit('SET_LOCAL_MODEL', localModel),
    setLoginWaitFlag: ({commit}, loginWaitFlag) => commit('SET_LOGIN_WAIT_FLAG', loginWaitFlag),
    setExperienceFlag: ({commit}, experienceFlag) => commit('SET_EXPERIENCE_FLAG', experienceFlag),
    setLoginFlag: ({commit}, loginFlag) => commit('SET_LOGIN_FLAG', loginFlag),
    setDownloadManualUrl: ({commit}, downloadManualUrl) => commit('SET_DOWNLOAD_MANUAL_URL', downloadManualUrl),
    setPlayDownloadUrl: ({commit}, playDownloadUrl) => commit('SET_PLAY_DOWNLOAD_URL', playDownloadUrl)
  }
}

export default jumpPageData