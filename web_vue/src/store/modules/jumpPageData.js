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
    playDownloadUrl: '', // 视频播放时会用到该地址
    supportFilterFlag: 0, // 是否支持筛选标识
    supportTreeFlag: 0, // 是否支持树形结构标识
    bufferPageFlag: null, // 遮罩层计时器
    pcOfflineFlag: GetQueryString("pc_is_offline") ? GetQueryString("pc_is_offline") : 0, // 是否为离线模式(没有修改该数据的地方所以不设置mutation以及action)
    localFlag: 0, // 本地模式标识
    deviceData: [], // 全局设备列表内容数据
    autoPlayFlag: 0, // 自动播放标识
    projectFlag: location.href.indexOf('vimtag') > -1 ? 0 : 1, // 项目判断标识(不可修改不添加mutation以及action)
    selectDeviceIpc: '', // 选择中设备sn码
    selectNick: '', // 选中的设备nick
    flashIsPlay: null, // flash自动播放
    playInfo: '', // 播放相关详情
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
    },
    SET_SUPPORT_FILTER_FLAG: (state, supportFilterFlag) => {
      state.supportFilterFlag = supportFilterFlag
    },
    SET_SUPPORT_TREE_FLAG: (state, supportTreeFlag) => {
      state.supportTreeFlag = supportTreeFlag
    },
    SET_BUFFER_PAGE_FLAG: (state, bufferPageFlag) => {
      state.bufferPageFlag = bufferPageFlag
    },
    SET_DEVICE_DATA: (state, deviceData) => {
      state.deviceData = deviceData
    },
    SET_LOCAL_FLAG: (state, localFlag) => {
      state.localFlag = localFlag
    },
    SET_AUTO_PLAY_FLAG: (state, autoPlayFlag) => {
      state.autoPlayFlag = autoPlayFlag
    },
    SET_SELECT_DEVICE_IPC: (state, selectDeviceIpc) => {
      state.selectDeviceIpc = selectDeviceIpc
    },
    SET_SELECT_NICK: (state, selectNick) => {
      state.selectNick = selectNick
    },
    SET_FLASH_IS_PLAY: (state, flashIsPlay) => {
      state.flashIsPlay = flashIsPlay
    },
    SET_PLAY_INFO: (state, playInfo) => {
      state.playInfo = playInfo
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
    setPlayDownloadUrl: ({commit}, playDownloadUrl) => commit('SET_PLAY_DOWNLOAD_URL', playDownloadUrl),
    setSupportFilterFlag: ({commit}, supportFilterFlag) => commit('SET_SUPPORT_FILTER_FLAG', supportFilterFlag),
    setSupportTreeFlag: ({commit}, supportTreeFlag) => commit('SET_SUPPORT_TREE_FLAG', supportTreeFlag),
    setBufferPageFlag: ({commit}, bufferPageFlag) => commit('SET_BUFFER_PAGE_FLAG', bufferPageFlag),
    setDeviceData: ({commit}, deviceData) => commit('SET_DEVICE_DATA', deviceData),
    setLocalFlag: ({commit}, localFlag) => commit('SET_LOCAL_FLAG', localFlag),
    setAutoPlayFlag: ({commit}, autoPlayFlag) => commit('SET_AUTO_PLAY_FLAG', autoPlayFlag),
    setSelectDeviceIpc: ({commit}, selectDeviceIpc) => commit('SET_SELECT_DEVICE_IPC', selectDeviceIpc),
    setSelectNick: ({commit}, selectNick) => commit('SET_SELECT_NICK', selectNick),
    setFlashIsPlay: ({commit}, flashIsPlay) => commit('SET_FLASH_IS_PLAY', flashIsPlay),
    setPlayInfo: ({commit}, playInfo) => commit('SET_PLAY_INFO', playInfo)
  }
}

export default jumpPageData

function GetQueryString(name) { // 截取url参数函数判断其中是否含有搜索的字符串(目前用于离线模式的判断)
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  let r = window.location.search.substr(1).match(reg);
  if (r !== null) return unescape(r[2]);
  return null;
}