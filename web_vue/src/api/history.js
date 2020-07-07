'use strict'
import axios from '@/axios' // 导入http中创建的axios实例
import login from './login'
import store from '../store'
// import md5 from '@/util/mmd5.js'
// import mcodec from '@/util/mcodec.js'
const history = {
  /*
  ** 历史录像列表获取
  */
  async history_list_get (params) {
    let returnItem
    let cid = params.cid ? params.cid : -1;
    let sid = params.sid ? params.sid : -1;
    let direction = params.direction ? 1 : 0;
    await axios.get('/ccm/ccm_box_get', {
      params: {
        sess: {
          nid: login.create_nid(),
          sn: params.box_sn
        },
        sn: params.dev_sn,
        flag: params.flag,
        start_time: params.start_time,
        end_time: params.end_time,
        search_type: params.search_type,
        cid: cid,
        sid: sid,
        direction: direction
      }
    }).then(res => {
      let result = login.get_ret(res)
      if (result === '' && res.data) {
        switch (params.flag) {
          case 1:
            returnItem = { result: result, ipcs: res.data.ipcs }
            break
          case 2:
            returnItem = { result: result, date_infos: res.data.date_infos }
            break
          case 4:
            returnItem = { result: result, segs: res.data.segs }
            break
          case 8:
            returnItem = { result: result, segs_sdc: res.data.segs_sdc }
            break
          default:
            break
        }
      } else {
        returnItem = { result: result }
      }
    })
    return history.ccm_segs_get_ack(returnItem, params)
  },
  ccm_segs_get_ack (msg, ref) {//msg 第二次ccm_box_get返回的加密数据
    let returnItem
    if (msg && !msg.result && (msg.segs_sdc || msg.segs)) {
      let videosegs = cutVideo({ msg: msg, base_start_time: ref.start_time, base_end_time: ref.end_time, dev_sn: ref.dev_sn, search_type: ref.search_type });//解密成一个个seg 
      let videoData = draw_data_rect({ videosegs: videosegs, time_length: ref.time_length, format: ref.format, category: ref.category });//seg拼接，处理好的视频可以体现出数量 每个视频时间
      returnItem = {
        video: videoData.local_cut_video_data,
        time: videoData.local_video_time_duration,
        date_infos_time: ref.date_infos_time,
        dev_sn: ref.dev_sn,
        start_time: ref.start_time,
        end_time: ref.end_time,
        videosegs: videosegs,
        vedio_day: ref.vedio_day
      }
    } else {
      returnItem = {
        video: [],
        time: [],
        date_infos_time: ref.date_infos_time,
        dev_sn: ref.dev_sn,
        start_time: ref.start_time,
        end_time: ref.end_time
      }
    }
    return returnItem
  },
  /*
  ** 历史录像图片获取
  */
  history_img_get (data) {
    let img = [];
    let photoNodeList = $(".history_list_img").find(".camera_sign_picture").find("img")
    let photoNodeArr = []
    for (let index in photoNodeList) {
      photoNodeArr.push(photoNodeList[index])
    }
    for (let i = 0; i < data.token.length; i++) {  // 原本代码为data.dom.length 但由于参数传递导致其将部分无关内容也变成了 数组长度的一部分 所以现改用token.length保证循环次数正常
      img[i] = new Image();
      if (store.state.jumpPageData.loaclFlag) {
        img[i].src = login.pic_url_get({ sn: data.sn, token: data.token[i], flag: data.flag, is_history: 1 });
      } else {
        img[i].src = login.pic_url_get({ sn: data.sn, token: data.token[i], flag: data.flag, is_history: 1 });
      }
      if (data.picFlag) { // 为快照请求图片
        img[i].dom = data.dom[i];
        photoNodeArr[i + (data.loopTime * 80)].src = img[i].src
      } else { // 其他普通请求图片
        img[i].dom = data.dom[i];
        img[i].onload = function () { // 将请求到的图片渲染至页面
          this.dom.src = this.src;
        }
      }
    }
  },
  /*
  ** 盒子设备信息获取
  */
  async boxlist_device_messages_get (params) {
    let returnItem
    let cid = params.cid ? params.cid : -1;
    let sid = params.sid ? params.sid : -1;
    let direction = params.direction ? 1 : 0;
    await axios.get('/ccm/ccm_box_get', {
      params: {
        sess: {
          nid: login.create_nid(),
          sn: params.box_sn
        },
        sn: params.dev_sn,
        flag: params.flag,
        start_time: params.start_time,
        end_time: params.end_time,
        search_type: params.search_type,
        cid: cid,
        sid: sid,
        direction: direction
      }
    }).then(res => {
      let result = login.get_ret(res)
      if (result === '' && res.data) {
        switch (params.flag) {
          case 1:
            returnItem = { result: result, ipcs: res.data.ipcs }
            break
          case 2:
            returnItem = { result: result, date_infos: res.data.date_infos }
            break
          case 4:
            returnItem = { result: result, segs: res.data.segs }
            break
          case 8:
            returnItem = { result: result, segs_sdc: res.data.segs_sdc }
            break
          default:
            break
        }
      } else {
        returnItem = { result: result }
      }
    })
    return history.boxlist_device_messages_get_ack(returnItem, params)
  },
  boxlist_device_messages_get_ack (msg, ref) {
    let returnItem
    if (msg && !msg.result && msg.date_infos) {
      let l_local_date_infos = [];
      let date_infos_time = [];
      let vedio_day = []; //标记哪些天有视频 去了重
      let l_date_infos = msg.date_infos; //第一次知道哪些天有视频返回的日期
      let start_time, end_time, search_type, cid, sid;
      for (let i = 0; i < l_date_infos.length; i++) {
        let date_mis = new Date(l_date_infos[i].date * 1000).format("yyyy.MM.dd.00.00.00");
        if (i > 0) {
          l_local_date_infos[l_local_date_infos.length] = date_mis;
          date_infos_time[date_infos_time.length] = (getDateForStringDate(l_local_date_infos[l_local_date_infos.length - 1])).getTime();
        } else if (i === 0) {
          l_local_date_infos[i] = date_mis;
          date_infos_time[i] = (getDateForStringDate(l_local_date_infos[i])).getTime();
        }
      }
      let nowtime = new Date().getTime(); //当前的时间 如果记录哪天有视频的返回时间超过该值，过滤掉
      for (let i = 0; i < date_infos_time.length; i++) { //6.4.3 onvif录像
        if (date_infos_time[i] > nowtime) {
          continue;
        } else if (vedio_day.indexOf(date_infos_time[i]) == -1) {
          vedio_day.push(date_infos_time[i])
        }
      }
      vedio_day.sort(function (a, b) { return a - b }); //从小到大排序
      if (ref.start_time === 0) {
        start_time = new Date(l_date_infos[l_date_infos.length - 1].date * 1000).format("yyyy.MM.dd.00.00.00");
        start_time = getDateForStringDate(start_time).getTime();
        if (start_time === -28800000) {
          start_time = 0
        }
        end_time = start_time + 60 * 60 * 24 * 1000; //第二次请求开始时间：最后一天凌晨 结束时间：次日凌晨 
        search_type = ref.search_type;
      } else { //如果点击日期播放返回到该日期的录像
        start_time = ref.start_time;
        end_time = ref.end_time;
        search_type = ref.search_type;
      }
      history.history_list_get({
        box_sn: ref.box_sn,
        dev_sn: ref.dev_sn,
        start_time: start_time,
        end_time: end_time,
        date_infos_time: date_infos_time,
        format: 2,
        category: 0,
        time_length: "30min",
        search_type: search_type,
        cid: cid,
        sid: sid,
        vedio_day: vedio_day
      }).then(res => {
        returnItem = res
      })
    } else {
      returnItem = { video: [], time: [], date_infos_time: [], dev_sn: ref.dev_sn, start_time: ref.start_time, end_time: ref.end_time }
    }
    return returnItem
  },
  /*
  ** 历史记录删除
  */
  async history_delete (params) {
    let returnItem
    params.cmd = params.start_time ? "erase" : "erase_all"
    await axios.get('/ccm/ccm_box_set', {
      params: {
        sess: {
          nid: login.create_nid(),
          sn: params.box_sn
        },
        sn: params.dev_sn,
        cmd: params.cmd,
        start_time: params.start_time,
        end_time: params.end_time
      }
    }).then(res => {
      let result = login.get_ret(res)
      if (result === '' && result) {
        returnItem = { type: 'success' }
      } else {
        returnItem = { type: 'error' }
      }
    })
    return returnItem
  }
}

export default history