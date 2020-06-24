// 跳转页面使用的vuex进行数据存储
const jumpPageData = {
  state: {
    pageDom: '',
    pageObj: {},
    projectName: sessionStorage.getItem('projectName') ? sessionStorage.getItem('projectName') : '',
    jmLogoFlag: 0,
    localModel: window.location.protocol === "file:" ? 1 : 0,
    loginWaitFlag: 0
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
    }
  }
}

export default jumpPageData