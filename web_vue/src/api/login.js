import axios from '@/axios' // 导入http中创建的axios实例
import mdh from '@/util/DHKeyExchange.js'
import CryptoJS from '@/util/cryptojs_tripledes.js'
import store from '../store'
import mcodec from '@/util/mcodec.js'
import md5 from '@/util/mmd5.js'
let secret_key // 公共私钥变量用于mdh接口与后续回调的接口公用同一私钥值
const login = {
  /*
  ** 公钥验证接口(Diffie Hellman加密)
  ** bnum_prime 公钥 固定值791658605174853458830696113306796803
  ** root_num 公钥 固定值5
  ** key_a2b 转换后加密的值
  */
  mdh () {
    secret_key = mdh.gen_private()
    return axios.get('/ccm/cacs_dh_req', {
      params: {
        bnum_prime: mdh.prime,
        root_num: mdh.g,
        key_a2b: mdh.gen_public(secret_key),
        tid: store.state.user.tid
      }
    })
  },
  /*
  ** 登录验证接口
  ** user 用户名
  ** password md5转换后的密码
  */
  async sign_in (params) {
    console.log(params, 'login_params')
    let returnItem // then函数中return并不能正确的返回到调用处 所以添加该变量作为局部中转使用
    await login.mdh().then(res => {
      let data = res ? res.data : null
      if ((!data) || data.result) { // 请求失败的情况
        returnItem = false
      }
      // 请求成功 存储用户关键id信息
      store.dispatch('setTid', data.tid)
      store.dispatch('setLid', data.lid)
      // 注: 此处secret_key值为mdh()函数中所使用的secret_key,使用方法创建会重新随机私钥导致无法匹配
      store.dispatch('setShareKey', mdh.gen_shared_secret(secret_key, data.key_b2a))
      let uctx = get_uctx({ app: { id: params.appid } })
      returnItem = axios.get('/ccm/cacs_login_req', { // 调用登录接口
        params: {
          lid: store.state.user.lid,
          nid: create_nid_ex(2), // 计算nid
          user: params.user,
          pass: pwd_encrypt(params.password),
          session_req: 1,
          p: [{ name: "spv", value: "v1" }, { name: "uctx", value: uctx }]
        }
      })
    })
    return returnItem
    // return axios.get('/ccm/cacs_login_req', {
    //   params: params
    // })
  },
  /*
  ** 获取绑定邮箱接口
  ** username 用户名
  ** appid 项目地址名vimtag.com/mipcm.com
  */
  async binding_email_get (params) {
    let returnItem // then函数中return并不能正确的返回到调用处 所以添加该变量作为局部中转使用
    await login.mdh().then(res => {
      console.log(res, 'mdh_res')
      let data = res ? res.data : null
      if ((!data) || data.result) { // 请求失败的情况
        returnItem = false
      }
      // 请求成功 存储用户关键id信息
      store.dispatch('setTid', data.tid)
      store.dispatch('setLid', data.lid)
      // 注: 此处secret_key值为mdh()函数中所使用的secret_key,使用方法创建会重新随机私钥导致无法匹配
      store.dispatch('setShareKey', mdh.gen_shared_secret(secret_key, data.key_b2a))
      let uctx = get_uctx({ app: { id: params.appid } })
      returnItem = axios.get('/ccm/cacs_query_req', { // 调用获取绑定邮箱接口
        params: {
          lid: store.state.user.lid,
          nid: create_nid_ex(2), // 计算nid
          user: params.username,
          p: [{ n: "uctx", v: uctx }]
        }
      })
    })
    return returnItem
  },
  /*
  ** 重置密码发送邮件
  ** username: 用户名
  ** email: 邮箱地址
  ** appid: 项目地址名vimtag.com/mipcm.com
  ** name: 项目名vimtag/mipcm
  ** lang: 语言
  */
  async recovery_binding_email (params) {
    let returnItem // then函数中return并不能正确的返回到调用处 所以添加该变量作为局部中转使用
    await login.mdh().then(res => {
      let data = res ? res.data : null
      if ((!data) || data.result) { // 请求失败的情况
        returnItem = false
      }
      // 请求成功 存储用户关键id信息
      store.dispatch('setTid', data.tid)
      store.dispatch('setLid', data.lid)
      // 注: 此处secret_key值为mdh()函数中所使用的secret_key,使用方法创建会重新随机私钥导致无法匹配
      store.dispatch('setShareKey', mdh.gen_shared_secret(secret_key, data.key_b2a))
      let uctx = get_uctx({ app: { id: params.appid } })
      returnItem = axios.get('/ccm/cacs_recovery_req', { // 调用获取绑定邮箱接口
        params: {
          lid: store.state.user.lid,
          nid: create_nid_ex(2), // 计算nid
          email: params.email,
          user: params.username,
          lang: params.lang,
          param: [{ name: "spv", value: "v1" }, { name: "uctx", value: uctx }]
        }
      })
    })
    return returnItem
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
  ** 登录时调用创建mmq整合方法,内置判断以及多个接口的调用回调方法
  */
  dev_msg_listener_add () {
    if (!store.state.user.mmqFlag) {
      login.mmq_create().then(res => { // 创建mmq轮询回调
        console.log(res, 'mmq_create_res')
        if (!res.data.result) { // 如果返回的result为''
          store.dispatch('setMmqFlag', 1) // 存储mmqFlag
          store.dispatch('setQid', res.data.qid)
          login.mmq_subscribe() // 调用mmq订阅函数
        } else {
          return -1
        }
      })
    }
  },
  /*
  ** 创建mmq轮询
  ** timeout: 轮询等待时间默认30000
  */
  mmq_create () {
    return axios.get('/ccm/mmq_create', {
      params: { timeout: 30000 }
    })
  },
  /*
  ** mmq轮询订阅
  ** sess: 默认,创建nid
  */
  mmq_subscribe () {
    axios.get('/ccm/ccm_subscribe', {
      params: { sess: { nid: create_nid() } }
    }).then(res => {
      let mmqReason // 记录获取的回调reason
      if (res.data && res.data.ret) {
        mmqReason = res.data.ret.reason
      } else {
        mmqReason = null
      }
      if (mmqReason === '') {
        login.mmq_pick()
      } else {
        return -1
      }
    })
  },
  /*
  ** mmq轮询循环方法
  ** 该方法定义计时器进行循环, 根据不同情况选择循环的方法
  */
  mmq_pick () {
    if (store.state.user.setMmqPickTimeFlag) { // 判断现在定时器标识是否存在
      clearInterval(store.state.user.setMmqPickTimeFlag)
      store.dispatch('setMmqPickTimeFlag', null)
    }
    axios.get('/ccm/mmq_pick', {
      params: {
        qid: store.state.user.qid,
        timeout: 300000
      }
    }).then(res => {
      console.log(res, 'mmq_pick_res')
      let returnItem
      if (res && res.type === 'ccm_message') { // 轮询返回消息内容, 需要根据消息调用对应的消息处理方法
        returnItem = {
          result: '',
          items: res.data.items
        }
        login.mmq_pick()
      } else if (res && res.type === 'mmq_pick_ack') { // 检测mmq是否超时失效,需要重新创建mmq_create,返回调用mmq_create函数
        store.dispatch('setMmqFlag', 0)
        store.dispatch('setMmqPickTimeFlag2', setTimeout(function () { // 存储重新调用mmq_create定时器
          login.dev_msg_listener_add()
        }, 3000))
      }
      store.dispatch('setMmqPickTimeFlag1', setTimeout(function () { // 存储重新调用mmq_pick定时器
        login.mmq_pick()
      }, 330000))
      if (returnItem) { // 如果有需要处理的消息则调用处理消息方法
        login.mmq_ack_func(returnItem)
      }
    })
  },
  /*
  ** mmq轮询结果处理函数
  ** sess: 默认,创建nid
  */
  mmq_ack_func (params) {
    console.log(params, '消息处理方法')
    let mmq_data = params.items
    for (var m = 0; m < mmq_data.length; m++) {
			if (mmq_data[m].code == "motion_alert") {
				if (mmq_data[m].type == "alert") {
					msg_tips({ msg: mmq_data[m].sn + "&nbsp:&nbsp" + mcs_motion_alert, type: "warning", timeout: 3000 })
				}
			} else if (mmq_data[m].code == "sound_detect") {
				if (mmq_data[m].type == "alert") {
					msg_tips({ msg: mmq_data[m].sn + "&nbsp:&nbsp" + mcs_sound_detect_alert, type: "warning", timeout: 3000 })
				}
			} else if (mmq_data[m].code == "face_alert") {
				if (mmq_data[m].type == "alert") {
					msg_tips({ msg: mmq_data[m].sn + "&nbsp:&nbsp" + mcs_face_detect_alert, type: "warning", timeout: 3000 })
				}
			} else if (mmq_data[m].code == "human_alert") { //人型检测
				if (mmq_data[m].type == "alert") {
					msg_tips({ msg: mmq_data[m].sn + "&nbsp:&nbsp" + mrs_human_detect_alert, type: "warning", timeout: 3000 })
				}//mrs_human_detect_alert
			} else if (mmq_data[m].code == "sos") { // 紧急按钮报警
				if (mmq_data[m].type == "alert") {
					msg_tips({ msg: mmq_data[m].sn + "&nbsp:&nbsp" + mcs_sos + mcs_alarm, type: "warning", timeout: 3000 })
				}
			} else if (mmq_data[m].code == "door") { // 门磁
				var door_status = "";
				for (var i = 0; i < mmq_data[m].p.length; i++) {
					if (mmq_data[m].p[i].n == "status") {
						door_status = mmq_data[m].p[i].v;
					}
				}
				if (mmq_data[m].type == "alert" && door_status == 'open') {
					msg_tips({ msg: mmq_data[m].sn + "&nbsp:&nbsp  " + mrs_door_sensor_open, type: "warning", timeout: 3000 })
				} else if (mmq_data[m].type == "alert" && door_status == 'close') {
					msg_tips({ msg: mmq_data[m].sn + "&nbsp:&nbsp  " + mrs_door_sensor_closed, type: "warning", timeout: 3000 })
				}
			}
		}
  },
  /*
  ** 获取最佳服务器地址/同时用于判断用户是否为特殊用户例如:江门xhjymclz xh@123123
  ** srv: 项目名称
  ** client: {mode: ''默认值, id: 用户名}
  */
  get_req (params) {
    return axios.get('/cmipcgw/cmipcgw_get_req', {
      params: params
    })
  }
}

export default login

// 部分自封装的工具函数
function create_nid_ex (type/* 0:by sid, 2: by lid */) {/* \todo: if support type==>tid , plz change following line. */ // sid信令服务器
  // console.log(store.state.user.lid, store.state.user.sid, store.state.user.shareKey, type, 'create_nid_ex')
  // 1 "0xe7b0" "156805891402441349081803789855738918" 2
  // return mcodec.nid(++store.state.user.seq, "0xe7b0", "156805891402441349081803789855738918", type, null, null, md5, "hex")
  return mcodec.nid(++store.state.user.seq, type ? store.state.user.lid : store.state.user.sid, store.state.user.shareKey, type, null, null, md5, "hex")
}

function create_nid () {
  return create_nid_ex(0);
}


// CryptoJS 加密工具函数
function get_uctx (data) {
  console.log(store)
  let l_share_key = store.state.user.shareKey
  var json_buf = JSON.stringify(data);
  var key = CryptoJS.MD5(l_share_key);
  //to do 8 byte alignment
  var json_bufs = bytes_align(json_buf);
  var bytes_len = 8 * (parseInt(json_buf.length / 8) + 1), str_len = bytes_len / 4;
  var json_obj = { sigBytes: bytes_len, words: json_bufs, length: str_len };
  var json_uctx = CryptoJS.DES.encrypt(json_obj, key, { iv: CryptoJS.enc.Hex.parse('0000000000000000'), padding: CryptoJS.pad.NoPadding }).ciphertext.toString();
  var b = str_2_16bytes(json_uctx);
  var uctx = "data:application/octet-stream;base64," + mcodec.binary_2_b64(b);
  return uctx;
}

function bytes_align (str) {
  var val = [];
  for (var i = 0; i < str.length; i++) {
    val.push(str.charCodeAt(i).toString(16));
  }
  var get8bytes_num = parseInt(str.length / 8) + 1;
  var addbytes = 8 * get8bytes_num - str.length;
  var result = [];
  // var trans_8bytes = "";
  var trans_val = "";
  for (var k = 0; k < addbytes; k++) {
    if (k === 0)
      trans_val = "0" + addbytes;
    else
      trans_val += "ff";
    if (trans_val.length === 8) {
      result.push("0x" + trans_val);
      trans_val = "";
    }
  }
  for (var j = 0; j < val.length; j++) {
    trans_val += val[j];
    if (trans_val.length === 8) {
      result.push("0x" + trans_val);
      trans_val = "";
    }
  }
  return result;
}

function str_2_16bytes (b) {
  if (!b) return;
  var len = b.length / 2, c = [];
  for (var i = 0; i < len; i++) {
    var a0 = b.charAt(2 * i);
    var a1 = b.charAt(2 * i + 1);
    var a2 = "0x" + a0 + a1;
    c.push(a2 & 0xff);
  }
  return c;
}
function pwd_encrypt (pwd_md5_hex) {
  // var xxx = CryptoJS.enc.Hex.parse(pwd_md5_hex);
  return CryptoJS.DES.encrypt(CryptoJS.enc.Hex.parse(pwd_md5_hex), CryptoJS.enc.Hex.parse(md5.hex(store.state.user.shareKey)), { iv: CryptoJS.enc.Hex.parse('0000000000000000'), padding: CryptoJS.pad.NoPadding }).ciphertext.toString();
}