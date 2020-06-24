// 目前所有接口均根据原项目参数传递封装,但有些接口本身并不需要接收这么多参数,后续可能会根据接口文档对所有接口进行简洁化处理
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
    // let pub_key = mdh.gen_public(secret_key)
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
  sign_in (params) {
    return axios.get('/ccm/cacs_login_req', {
      params: params
    })
  },
  /*
  ** 获取绑定邮箱接口
  ** username 用户名
  ** appid 项目地址名vimtag.com/mipcm.com
  */
  async binding_email_get (params) {
    let returnItem // then函数中return并不能正确的返回到调用处 所以添加该变量作为局部中转使用
    await login.mdh().then(res => {
      console.log(res, 'email_mdh_res')
      let data = res ? res.data.cacs_dh_ack : null
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
          nid: create_nid_ex(2),
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
    if (mmqCreate) {
      createRes = axios.get('/ccm/mmq_create', { timeout: 30000 })
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

// 部分自封装的工具函数
// function pwd_encrypt (pwd_md5_hex) {
//   var xxx = CryptoJS.enc.Hex.parse(pwd_md5_hex);
//   return CryptoJS.DES.encrypt(CryptoJS.enc.Hex.parse(pwd_md5_hex), CryptoJS.enc.Hex.parse(mmd5.hex(l_share_key)), { iv: CryptoJS.enc.Hex.parse('0000000000000000'), padding: CryptoJS.pad.NoPadding }).ciphertext.toString();
// }

function create_nid_ex (type/* 0:by sid, 2: by lid */) {/* \todo: if support type==>tid , plz change following line. */ // sid信令服务器
  console.log(store.state.user.lid, store.state.user.sid, store.state.user.shareKey, type, 'create_nid_ex')
  return mcodec.nid(++store.state.user.seq, type ? store.state.user.lid : store.state.user.sid, store.state.user.shareKey, type, null, null, md5, "hex");
  // return mcodec.nid(1, "0x5393b9", "520960024559469859945065912701739373", 2, null, null, md5, "hex")
}

// function create_nid () {
//   return create_nid_ex(0);
// }


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
    if (k == 0)
      trans_val = "0" + addbytes;
    else
      trans_val += "ff";
    if (trans_val.length == 8) {
      result.push("0x" + trans_val);
      trans_val = "";
    }
  }
  for (var j = 0; j < val.length; j++) {
    trans_val += val[j];
    if (trans_val.length == 8) {
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