import axios from '@/axios' // 导入http中创建的axios实例
// import qs from 'qs'; // 根据需求是否导入qs模块

const login = {
  /*
  ** 登录验证接口
  ** user 用户名
  ** password md5转换后的密码
  */
  sign_in (params) {
    return axios.get('/ccm/cacs_login_req', {
      params: params
    })
  },
  /*
  ** 绑定邮箱发送邮件
  ** username 用户名
  ** appid 项目地址名vimtag.com/mipcm.com
  */
  binding_email_get (params) {
    return axios.get('/ccm/cacs_query_req', {
      params: params
    })
  },
  /*
  ** 重置密码发送邮件
  ** username: 用户名
  ** email: 邮箱地址
  ** appid: 项目地址名vimtag.com/mipcm.com
  ** name: 项目名vimtag/mipcm
  */
  recovery_binding_email (params) {
    return axios.get('ccm/cacs_recovery_req', {
      params: params
    })
  },
  /*
  ** 获取版本
  ** srv: 当前域名window.location.host
  ** ver_type: 客户端版本version_type
  ** ver_from: 'v3.9.1.1607051739'暂不清楚 目前传递为默认值
  ** lang: 当前语言
  */
  get_version (params) {
    return axios.get('/ccms/ccvs_get_version_req', {
      params: params
    })
  },
  /*
  ** 消息轮询创建
  ** timeout 延迟时间 默认30000
  */
  add_dev_msg_listener () {
    let mmqCreate = sessionStorage.getItem('mmqFlag') ? sessionStorage.getItem('mmqFlag') : 1
    if(mmqCreate) {
      createRes = axios.get('/ccm/mmq_create', {timeout: 30000})
      console.log(createRes, 'createRes')
      // 此处获取qid
      sessionStorage.setItem('qid', createRes.data.qid)
    } else {
      login.listener_req()
    }
  },
  /*
  ** 消息轮询回调(定时器重复调用)
  ** timeout 延迟时间 默认30000
  */
  listener_req () {
    let pick_time = sessionStorage.getItem('mmqTimeFlag') ? sessionStorage.getItem('mmqTimeFlag') : null
    if (pick_time) {
      clearInterval(pick_time)
      pick_time = null
      sessionStorage.setItem('mmqTimeFlag', null)
    }
    mmq_req = axios.get('/ccm/mmq_pick', {
      qid: sessionStorage.getItem('qid'),
      timeout: 300000
    })
    // 回调返回值判断
    // 后续见milb.cloud.account.js中dev_msg_listener_add/ccm_subscribe_req/mmq_pick_req
  },
  get_req (params) {
    return axios.get('/cmipcgw/cmipcgw_get_req', {
      params: params
    })
  }
}

export default login
