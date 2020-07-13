'use strict'
import axios from '@/axios' // 导入http中创建的axios实例
import login from './login'
import store from '../store'
import devlist from './devlist'
// import md5 from '@/util/mmd5.js'
// import mcodec from '@/util/mcodec.js'
import mme from '@/util/mme.js'
import publicFunc from '@/util/public.js'
const play = {
  /*
  ** 请求图片
  */
  load_imgs (data) {
    let images = new Array()
    for (let length = data.dom.length, k = 0; k < length; k++) {
      let sn = data.dom[k].getAttribute("sn")
      if (data.dom[k].getAttribute("state") === "offline") continue
      images[k] = new Image();
      if (store.state.jumpPageData.localFlag) {
        images[k].src = "http://" + data.dom[k].getAttribute("addr") + "/ccm/ccm_pic_get.js?dsess=1&dsess_nid=&dsess_sn=" + data.dom[k].getAttribute("sn") + "&dtoken=p1&dflag=2";
      } else {
        if (sessionStorage.getItem(sn) && data.box_ipc !== 1) {
          $(data.dom)[k].childNodes[0].style.background = "url(" + sessionStorage.getItem(sn) + ")";
          $(data.dom)[k].childNodes[0].style.backgroundSize = "100% 100%";
        } else {
          if (data.box_ipc == 1) { //如果云盒子列表
            images[k].src = devlist.pic_url_get({ sn: data.dom[k].getAttribute("sn"), token: data.dom[k].getAttribute("ipc_sn") + "_p3_" + Math.pow(2, 31) + "_" + Math.pow(2, 31), flag: 2, box_ipc: 1 });
          } else {
            images[k].src = devlist.pic_url_get({ sn: data.dom[k].getAttribute("sn"), token: "p1" });
          }
        }
      }
      images[k].onload = function () {
        if (data.box_ipc == 1) { //6.1.2
          for (let j = 0; j < length; j++) {
            if (!$(data.dom)[j]) return;
            let dev_sn = $(data.dom).eq(j).attr("ipc_sn");
            if (this.src.$(dev_sn) > -1) {
              break;
            }
          }
          $(data.dom)[j].childNodes[0].style.background = "url(" + this.src + ")";
          $(data.dom)[j].childNodes[0].style.backgroundSize = "100% 100%";
        } else {
          for (let j = 0; j < length; j++) {
            if (!$(data.dom)[j]) return;
            let dev_sn = $(data.dom).eq(j).attr("sn");
            if (this.src.$(dev_sn) > -1) {
              break;
            }
          }
          $(data.dom)[j].childNodes[0].style.background = "url(" + this.src + ")";
          $(data.dom)[j].childNodes[0].style.backgroundSize = "100% 100%";
        }
      };
    }
  },
  /*
  ** 停止视频播放
  */
  video_stop (params) {
    let flash_isplay = store.state.jumpPageData.flashIsPlay
    let play_info = store.state.jumpPageData.playInfo
    if (flash_isplay) {
      clearInterval(flash_isplay)
    }
    if (play_info.inner_window_info.video_chls) {
      play_info.inner_window_info.mme.chl_destroy(play_info.inner_window_info.video_chls);
    }
    if (play_info.inner_window_info.audio_chls)
      play_info.inner_window_info.mme.chl_destroy(play_info.inner_window_info.audio_chls);
    play_info.inner_window_info.node_sn = "none";
    play_info.inner_window_info.device_list_li_span = null;
    play_info.inner_window_info.profile_token = "";
    play_info.inner_window_info.ptz_token = "";
    play_info.inner_window_info.video_encoding = "";
    play_info.inner_window_info.video_resolution_w = 0;
    play_info.inner_window_info.video_resolution_h = 0;
    play_info.inner_window_info.video_frame_rate = 0;
    play_info.inner_window_info.video_max_bit_rate = 0;
    play_info.inner_window_info.video_min_bit_rate = 0;
    if (params.isDownload) {
      $("#download_dom").html('')
    } else {
      params.dom.html('')
    }
    return { parent: params.dom }
  },
  /*
  ** 播放总接口
  */
  async play (data) {
    let returnItem
    let judge_enable_native_plug = true;
    let judge_enable_flash_plug = false;
    let ref_obj = create_play_ipc(data);
    let playback = data.playback ? 1 : 0;
    if (ref_obj.isDownload) {
      if (!$("#download_dom").length > 0) {
        $("body").append("<div id='download_dom' style='width:1px;height:1px;'></div>")
      }
      data.dom = $("#download_dom");
    }
    let mme_params = {
      parent: data.dom,
      enable_native_plug: judge_enable_native_plug,
      enable_flash_plug: judge_enable_flash_plug,
      params: "{key:'data:application/octet-stream;base64,OenOl2/PvPX7EuqqZdvMsNf5PqEOlOJZ4sROOBtnvW8F6Fc+azokLNtti6Cb/oiuO9qhOxvDfL8cVpGY4UcCe81OIVHkbiNzuHKwiE+K6gmmWwIoHgSRn2RN4qsZO62QkqGePdR6L94n2ruSeixjqAgWFTW8AIlQptovRZSN1Dh/8M87RIRdYyVFqKqsZoZTYibPLyDFONKIqxzrFkJPtqR/wn8jnYMc1qUH/w3IYJZh/OqctPTDp8tYuQSWN3EE6+kVmDIMV9F92SZJORMnvxy+zYzpbO7Gz44fBQNQSGMelsf7yQpfTF/X8t1Qn73fu53xp3MTIGH0kklFH2tMPkO/Raelhw5A4JQbczWg0n4pcNxpRl6mCEIjFprTboJ/B2eI0qUX/zTPM7l1hBmxjxsewORsXp0y2+NnCRH0uVBGUq6fOWrdhJwotIIu5ZAZwdoDZZu6eaycol2TIS5smusoD0ODPtQ2xZoCy7djIC4MVhB5uKe0zDXbLr+Serdlq6en5HyvUN0EEmYle0fORmgNFn0DTqqTab6cx8WfFkysciJSveN4swoR66qMQUi9+TfkHTnZ/REp3kHJtSq8XJyzTe+KCXlJXGx07nAbK4svIPanx39A5o5XlpLK/ohxiMpEJZ6OhmWb9yAnL+8Bedw+epvbNQkhADh2QqB4ItsIq5KTOsNzA0aNn3FEXzyd7WLVBqcF1lUVxu1vpYRPKv01im1ORbVhDoJ9eiqkfchutpAGYOwhYzxFWOIhTMouY+m/oQhc1d8FF4T+zSx6WVmj2f+RDUdOKbQVxJdEeiGKyIDm14K34Kz+RdzF0fY50sbs/SUfMWwuKQsEPFU5KQ'}",
      on_event: function (e) { e.sn = data.sn; on_plug_event(e) },
      ref_obj: ref_obj,
      debug: 0
    };
    if (data.ipc_stat != 0) {
      ref_obj.inner_window_info.mme = new mme(mme_params);
    }
    store.dispatch('setPlayInfo', ref_obj)
    function flash_play () {
      let profile_token_choice = get_profile_token_choice(data.profile_token);
      urls = window.location.protocol + "//" + g_server_device + "/ccm/ccm_pic_get.jpg?hfrom_handle=887330&dsess=1&dsess_nid=" + login.create_nid() + "&dsess_sn=" + data.sn + "&dtoken=" + profile_token_choice.profile_token_choice_value;
      data.dom.innerHTML = "<img id='flash_img' width='1px' src='" + urls + "'>";
      if (publicFunc.mx("#flash_img")) {
        publicFunc.mx("#flash_img").onload = function () {
          data.dom.style.background = "url(" + this.src + ")";
          data.dom.style.backgroundSize = "100% 100%";
        }
      } else {
        clearInterval(flash_isplay)
      }
    }
    function on_plug_event (obj) {
      sessionStorage.setItem("type_tip", obj.type);
      sessionStorage.setItem("code_tip", obj.code);
      switch (obj.type) {
        case "missing": {
          if (!playback) {
            if ((navigator.userAgent.toLowerCase().match(/chrome\/[\d.]+/gi) + "").replace(/[^0-9.]/ig, "") > "44") {
              location.href = "https://www.adobe.com/go/getflashplayer";
            }
            if (flash_isplay) clearInterval(flash_isplay);
            flash_isplay = setInterval(function () { flash_play() }, 1000);
          }
          break;
        }
        case "ready": {
          let proto = obj.ref_obj.protocol;
          if (obj.plug.type.name == "flash") {
            l_plug_type = "flash";
            proto = "rtmp";
          } else {
            if (proto == "auto") proto = "rtdp";
          }
          if (playback) {
            ms.send_msg("playback", { sn: ref_obj.sn, token: ref_obj.token, protocol: proto, ref: obj.ref_obj }, obj.ref_obj, function (msg, ref) { msg.type = "playback"; play_ack(msg, ref); });
          } else {
            if (store.state.jumpPageData.localFlag) {
              data.agent.play({ sn: ref_obj.sn, token: obj.ref_obj.inner_window_info.profile_token, protocol: proto, ref: obj.ref_obj }, obj.ref_obj, function (msg, ref) { msg.type = "play"; play_ack(msg, ref); })
            } else {
              // ms.send_msg("play",{sn:"1jfiegbqaml3q",token:"p0_1jfiegbqcip5q", protocol:proto,ref:obj.ref_obj},obj.ref_obj,function(msg,ref){ msg.type = "play" ; play_ack(msg,ref);}); //6.1.2测试云盒子实时视频播放 
              ms.send_msg("play", { sn: ref_obj.sn, token: obj.ref_obj.inner_window_info.profile_token, protocol: proto, ref: obj.ref_obj }, obj.ref_obj, function (msg, ref) { msg.type = "play"; play_ack(msg, ref); });
            }
          }
          break;
        }
        case "install_ui": {
          obj.panel.innerHTML = ''
          obj.panel.getAttribute('id', "plugin_install_page")
          let play_oem = "";
          if (store.state.jumpPageData.projectName === "vimtag") {
            play_oem = "Vimtag";
          } else if (store.state.jumpPageData.projectName === "mipcm") {
            mcs_download_client = mcs_download_client.replace("Vimtag", "MIPC");
            play_oem = "MIPC";
          } else if (store.state.jumpPageData.projectName === "ebitcam") {
            mcs_download_client = mcs_download_client.replace("Vimtag", "EBIT");
            play_oem = "EBIT";
          } else if (store.state.jumpPageData.projectName === "vsmahome") {
            mcs_download_client = mcs_download_client.replace("Vimtag", "VSMAHOME");
            play_oem = "VSMAHOME";
          }
          // if(store.state.jumpPageData.projectName=="vimtag"){
          obj.panel.innerHTML = "<div id='plugin_install_box' style='" + (data.ipc_stat === 0 ? 'display:none' : '') + "'>"
            + "<div id='plugin_install_tips'>" + mcs_download_client + "</div>"
            + "<div id='plugin_install_download'><div id='plugin_install_download_name'>" + play_oem + " " + mcs_client_new + "</div><a href='" + store.state.jumpPageData.downloadManualUrl+ "' target='_blank'><div id='plugin_install_download_btn'></div></a></div>"
            + "<div style='margin-top: 85px;'><a name='flash' href='javascript:;'><div id='use_ordinary_video'>" + mcs_temporarily_installed_use_ordinary_video + "</div></a></div>"
            + "</div>"
          let plugin_install_page_width = $("#plugin_install_page").outerWidth() / 2;
          let plugin_install_download_width = $("#plugin_install_download").outerWidth() / 2;
          // jQuery("#use_ordinary_video").css({"margin-left":(plugin_install_page_width-use_ordinary_video_width)+"px"});
          $("#plugin_install_download").css({ "margin-left": (plugin_install_page_width - plugin_install_download_width) + "px" })
          break;
        }
      }
    }
    function play_ack (msg, ref) {
      if (msg.result == "") {
        chl_video_create({ type: msg.type, uri: msg.url, inner_window_info: ref.inner_window_info, localPath: ref.localPath, isDownload: ref.isDownload });
      } else {
        if (msg.result == "accounts.user.offline") { //6.1.1
          msg_tips({ msg: mcs_video_play_offline, type: "error", timeout: 3000 })
        } else if (msg.result == "ccm.system.err") { //临时解决一下
          msg_tips({ msg: mcs_video_play_fail, type: "error", timeout: 3000 })
        } else if (msg.result == "4g.device.lock") {
          msg_tips({ msg: mrs_sim_invalid, type: "error", timeout: 3000 })
        }
      }
    }
    function chl_video_create (obj) {

      let uri = obj.uri,
        chl_params = (obj.type == "publish") ? "" : ",thread:\"istream\", jitter:{max:3000}"/* for old version's mme plugin */,
        trans_params = (obj.type == "play") ? ",trans:[{flow_ctrl:\"jitter\",thread:\"istream\"}]" :
          ((obj.type == "playback") ? ",trans:[{flow_ctrl:\"delay\",thread:\"istream\"}]" : "");
      let params_data;
      let l_ipc_speed_time;
      let l_Last_speed = 0;
      let l_speed = 0;
      let l_progress = 0;
      if (obj.isDownload) {
        obj.localPath = obj.localPath.replace(/[/]/g, '\\/') + data.token + ".mp4";
      }
      if (obj.type == "playback" && obj.isDownload) {
        params_data = "{src:[{url:\"" + uri + "\"}], dst:[{url:\"file://" + obj.localPath + "\",thread:\"channel\"}],speaker:{mute:\"1\"},audio:{type:\"none\"},thread:\"channel\",canvas:\"none\"}}"
      } else {
        params_data = "{" + ((obj.type == "publish") ? "dst" : "src") + ":[{url:\"" + uri + "\"}]" + trans_params + chl_params + "}";
      }
      obj.inner_window_info.video_chls = obj.inner_window_info.mme.chl_create({ params: params_data });
      if (obj.inner_window_info.video_chls !== null) {
        obj.inner_window_info.mme.ctrl(obj.inner_window_info.video_chls, "speaker.mute", obj.type == "playback" ? "{value:0}" : g_m_speaker_is_mute ? "{value:1}" : "{value:0}")
        if (l_ipc_speed_time) {
          clearInterval(l_ipc_speed_time);
        }
        if (l_plug_type !== "flash") { // 该判断条件中需要添加!此为客户端逻辑(去掉!用于在浏览器中测试使用)
          l_ipc_speed_time = setInterval(function () {
            let string_speed = obj.inner_window_info.mme.ctrl(obj.inner_window_info.video_chls, "query", "{}");
            if (string_speed.length >= 150) {
              let json_speed = eval("(" + string_speed + ")");
              if (obj.isDownload) {
                if (json_speed.data.played_duration / data.videoSize > 1) {
                  json_speed.data.played_duration = data.videoSize;
                  l_speed = "100%";
                  clearInterval(l_ipc_speed_time);//5.11.3后加
                  msg_tips({ msg: mrs_download_completed, type: "success", timeout: 3000 });
                  // }
                } else {
                  record_played_duration_num = 0;
                  record_played_duration = json_speed.data.played_duration;
                  l_speed = parseInt((json_speed.data.played_duration / data.videoSize) * 100) + "%";
                }
                returnItem = l_speed
              } else if (playback) {
                let duration2 = sessionStorage.getItem("duration");
                let kb = json_speed.data.p2ping ? "kB" : "KB";
                l_speed = json_speed.data.total_bytes > l_Last_speed ? parseInt((json_speed.data.total_bytes - l_Last_speed) / 1000) + kb : l_Last_speed = 0;
                if (duration2 == json_speed.data.played_duration) {
                  duration_tip = true;
                  sessionStorage.setItem("duration_tip", duration_tip)
                }
                l_Last_speed = json_speed.data.total_bytes;
                l_progress = parseInt((json_speed.data.played_duration / data.videoSize) * 100);
                sessionStorage.setItem("duration", json_speed.data.played_duration);
                let record_played_duration = json_speed.data.played_duration - duration2;
                returnItem = [l_speed, l_progress, record_played_duration]
              } else {
                let kb = json_speed.data.p2ping ? "kB" : "KB";
                l_speed = json_speed.data.total_bytes > l_Last_speed ? parseInt((json_speed.data.total_bytes - l_Last_speed) / 1000) + kb : l_Last_speed = 0;
                l_Last_speed = json_speed.data.total_bytes;
                returnItem = l_speed
              }
            }
          }, 1000)
        } else {
          // 浏览器执行 l_plug_type = flash 由于不显示进度条所以直接传递null值
          returnItem = null
        }
      }
      if (obj.type == "playback") {
        setTimeout(function () { play_ipc(obj) }, 1000)
      }
    }
    function play_ipc (obj) {
      obj.inner_window_info.mme.ctrl(obj.inner_window_info.video_chls, "play", "");
      obj.inner_window_info.playback_state = "play";
      return 0;
    }
    function create_play_ipc (obj) {
      obj.protocol = "auto";
      obj.videoSize = obj.videoSize ? obj.videoSize : 0;
      obj.localPath = obj.download_path ? obj.download_path : null;
      obj.isDownload = obj.isDownload ? 1 : 0;
      obj.inner_window_info = { dom_id: ("play_screen"), index: 1, video_chls: null, audio_chls: null, mme: null, ipc_state: "", node_sn: obj.sn, profile_token: obj.profile_token };
      return obj;
    }
    return returnItem
  },
  /*
  ** 暂停下载
  */
  pause_ipc () {
    let play_info = store.state.jumpPageData.playInfo
    if (play_info.inner_window_info.mme) {
      play_info.inner_window_info.mme.ctrl(play_info.inner_window_info.video_chls, "pause", "")
    }
    play_info.inner_window_info.playback_state = "pause"
  },
  /*
  ** 继续下载
  */
  play_download_continue () {
    let play_info = store.state.jumpPageData.playInfo
    play_info.inner_window_info.mme.ctrl(play_info.inner_window_info.video_chls, "play", "");
    play_info.inner_window_info.playback_state = "play";
  },
  /*
  ** 播放封面图
  */
  play_preview_img (params) {
    var url = (params.addr ? "http://" + params.addr : window.location.protocol + "//" + window.location.host) + "/ccm/ccm_pic_get.js?dsess=1&dsess_nid=" + login.create_nid() + "&dsess_sn=" + params.sn + "&dtoken=" + params.pic_token + "&dflag=2";
    params.dom.attr('style', 'background: url(' + url + ') no-repeat')
    params.dom.attr('style', 'backgroundSize: 100% 100%')
  },
  /*
  ** 全屏播放
  */
  fullscreen () {
    let play_info = store.state.jumpPageData.playInfo
    play_info.inner_window_info.mme.ctrl(0, "fullscreen", "");
  },
  /*
  ** 音量控制
  */
  voice (params) {
    let play_info = store.state.jumpPageData.playInfo
    var video_chls = play_info.inner_window_info.video_chls;
    play_info.inner_window_info.mme.ctrl(video_chls, "speaker.mute", params.flag ? "{value:1}" : "{value:0}");
  },
  /*
  ** 摄像头视角控制
  */
  play_ptz_turn (params) {
    let l_mark = { flag: "ready" }
    let l_move_x = 0
    let l_move_y = 0
    let interval
    if (params.direction === "left") {
      l_move_x = 12;
    } else if (params.direction === "right") {
      l_move_x = -12;
    } else if (params.direction === "up") {
      l_move_y = 12;
    } else if (params.direction === "down") {
      l_move_y = -12;
    }
    if (params.flag == "stop") {
      if (interval) {
        clearInterval(interval);
      }
      interval = null
      play.ptz_ctrl({
        sn: store.state.jumpPageData.selectDeviceIpc,
        x: 0,
        y: 0
      }).then(res => {
        if (res.result === '') {
          if (l_mark.flag) {
            l_mark.flag = 'ready'
          }
        }
      })
    }
    else {
      if (interval) {
        // clearInterval(l_interval);
        // l_mark.flag = "ready";
      } else {
        interval = setInterval(function () {
          if (l_mark.flag == "ready") {
            l_mark.flag = "move"
            play.ptz_ctrl({
              sn: store.state.jumpPageData.selectDeviceIpc,
              x: -l_move_x,
              y: l_move_y
            }).then(res => {
              if (res.result === '') {
                if (l_mark.flag) {
                  l_mark.flag = 'ready'
                }
              }
            })
          }
        }, 100);
      }
    }
  },
  /*
  ** 摄像头视角控制接口
  */
  async ptz_ctrl (params) {
    let returnItem
    await axios.get('/ccm/ccm_ptz_ctl', {
      params: {
        sess: {
          nid: login.create_nid(),
          sn: params.sn
        },
        trans: {
          pan_tilt: {
            x: params.x,
            y: params.y
          }
        },
        speed: {
          pan_tilt: {
            x: 30,
            y: 30
          }
        }
      }
    }).then(res => {
      returnItem = { result: login.get_ret(res) }
    })
    return returnItem
  },
  /*
  ** 摄像头录像处理
  */
  play_record (params) {
    if (params.sn) {
      if (params.recording === 1) {
        play.record({
          sn: params.sn,
          keep_time: 60000
        }).then(res => {
          play.record_ack(res, params.recording)
        })
      } else {
        play.record({
          sn: params.sn,
          keep_time: -1
        }).then(res => {
          play.record_ack(res, params.recording)
        })
      }
    }
  },
  /*
  ** 摄像头录像接口
  */
  async record (params) {
    let returnItem
    await axios.get('/ccm/ccm_record_task_get', {
      params: {
        sess: {
          nid: login.create_nid(),
          sn: params.sn
        }
      }
    }).then(res => {
      let result = login.get_ret(res)
      if (result === '' && res.data.sd_ready === 1) {
        res.data.task.keep = params.keep_time
        play.record_task_set({ // 调用函数录像接口返回值
          sess: {
            nid: login.create_nid(),
            sn: params.sn
          },
          task: res.data.task
        }).then(res => {
          returnItem = res
        })
      } else {
        returnItem = {
          result: result,
          sd_ready: res.data.sd_ready
        }
      }
    })
    return returnItem
  },
  /*
  ** 摄像头录像设置任务接口
  */
  async record_task_set (params) {
    let task
    let returnItem
    if (params.task) { // 为两个不同的调用设置task参数值
      task = params.task // record中调用
    } else {
      task = { // 其他调用
        sch: {
          enable: params.enable,
          full_time: params.full_time,
          times: params.times
        }
      }
    }
    await axios.get('/ccm/ccm_record_task_set', {
      params: {
        sess: {
          nid: login.create_nid(),
          sn: params.sn
        },
        task: task
      }
    }).then(res => {
      returnItem = {
        result: login.get_ret(res)
      }
    })
    return returnItem
  },
  /*
  ** 录像回调处理函数
  */
  record_ack (msg, ref) {
    if (msg && msg.sd_ready === 0) {
      publicFunc.msg_tips({ msg: mcs_sdcard_not_ready, type: "error", timeout: 3000 });
    } else if (msg && msg.result === "") {
      if (ref.recording === 1) { console.log('do nothing') }
    } else if (msg.result === "permission.denied") {
      publicFunc.msg_tips({ msg: mcs_permission_denied, type: "error", timeout: 3000 });
    }
  },
  /*
  ** 实时截图
  */
  async play_snapshot (params) {
    let returnItem
    await axios.get('/ccm/ccm_snapshot', {
      params: {
        sess: {
          nid: login.create_nid(),
          sn: params.sn
        },
        token: "p0" // 暂为固定值
      }
    }).then(res => {
      returnItem = { result: login.get_ret(res), url: devlist.pic_url_get({ sn: params.sn, token: 'p0' }) }
    })
    if (returnItem && returnItem.result === '') { // 最终返回值
      returnItem = returnItem.url
    } else {
      returnItem = null
    }
    return returnItem
  },
  /*
  ** 对讲处理
  */
  play_speak (params) {
    let play_info = store.state.jumpPageData.playInfo
    if (params.flag) {
      play.push_talk({
        sn: store.state.jumpPageData.selectDeviceIpc,
        protocol: "rtdp",
        token: "p1"
      }).then(res => {
        chl_audio_create({ type: "publish", uri: res.url, inner_window_info: play_info.inner_window_info })
      })
    } else {
      play_info.inner_window_info.mme.chl_destroy(play_info.inner_window_info.audio_chls);
    }
    function chl_audio_create (obj) {
      var uri = obj.uri, chl_params = "";
      obj.inner_window_info.audio_chls = obj.inner_window_info.mme.chl_create({
        params: ("{src:[{url:'mic://0',type:'audio'}], dst:[{url:'" + uri + "'}]" + (("" != chl_params) ? "," : "") + chl_params + "}")
      })
    }
  },
  /*
  ** 对讲接口
  */
  async push_talk (params) {
    let returnItem
    await axios.get('/ccm/ccm_talk', {
      params: {
        sess: {
          nid: login.create_nid(),
          sn: params.sn
        },
        setup: {
          stream: "RTP_Unicast",
          trans: {
            proto: params.protocol
          }
        },
        token: params.token
      }
    }).then(res => {
      returnItem = {
        result: login.get_ret(res),
        url: res.data.uri ? res.data.uri.url : ""
      }
    })
    return returnItem
  },
  /*
  ** 获取视频地址
  */
  async adjust_get (params) {
    let returnItem
    await axios.get('/ccm/ccm_video_srcs_get', {
      params: {
        sess: {
          nid: login.create_nid(),
          sn: params.sn
        }
      }
    }).then(async res => {
      let result = get_ret(res)
      let vss = res.data.vss
      let day
      let night
      let white_light
      let day_night
      let flip
      let flicker_freq
      let resolute
      let day_or_night
      let red_or_white
      let light_mode
      let brightness
      let contrast
      let color_saturation
      let sharpness
      if (result === "" && vss[0].extension.conf) {
        if (vss[0].extension.conf.day) {
          day = {
            brightness: vss[0].extension.conf.day.brightness,
            contrast: vss[0].extension.conf.day.contrast,
            color_saturation: vss[0].extension.conf.day.color_saturation,
            sharpness: vss[0].extension.conf.day.sharpness
          }
          night = {
            brightness: vss[0].extension.conf.night.brightness,
            contrast: vss[0].extension.conf.night.contrast,
            color_saturation: vss[0].extension.conf.night.color_saturation,
            sharpness: vss[0].extension.conf.night.sharpness
          }
          if (vss[0].extension.conf.white_light) {
            white_light = {
              brightness: vss[0].extension.conf.white_light.brightness,
              contrast: vss[0].extension.conf.white_light.contrast,
              color_saturation: vss[0].extension.conf.white_light.color_saturation,
              sharpness: vss[0].extension.conf.white_light.sharpness
            }
          }
          day_or_night = vss[0].extension.conf.day_or_night;
          red_or_white = vss[0].extension.conf.red_or_white;
        } else {
          brightness = vss[0].extension.conf.brightness;
          contrast = vss[0].extension.conf.contrast;
          color_saturation = vss[0].extension.conf.color_saturation;
          sharpness = vss[0].extension.conf.sharpness;
        }
        if (vss[0].extension.conf.mode) {
          day_night = vss[0].extension.conf.mode;
        } else {
          day_night = "auto";
        }
        light_mode = vss[0].extension.conf.light_mode
        await axios.get('/ccm/ccm_misc_get', { // 该接口仅调用一次所以不单独拆分了
          params: {
            sess: {
              nid: login.create_nid(),
              sn: params.sn
            }
          }
        }).then(res_misc => {
          let result = get_ret(res_misc);
          if (result === "") {
            let msg = res_misc.data ? res_misc.data.info : "";
            flip = msg.flip; /* 0/1 0:none-flip, 1:filp */
            flicker_freq = msg.power_freq;    /* 0/1 0:60hz, 1:50hz */
            resolute = res_misc.data.resolute; /*0/1 0:(4:3) 1:(16:9) */
          }
          returnItem = {
            result: result,
            day: day,
            night: night,
            white_light: white_light,
            day_night: day_night,
            flip: flip,
            flicker_freq: flicker_freq,
            resolute: resolute,
            day_or_night: day_or_night,
            red_or_white: red_or_white,
            light_mode: light_mode,
            brightness: brightness,
            contrast: contrast,
            color_saturation: color_saturation,
            sharpness: sharpness
          }
        })
      }
      else {
        returnItem = { result: result }
      }
    })
    return returnItem
  },
  /*
  ** 设置视频地址
  */
  adjust_set (obj) {
    let returnItem
    if (obj.is_white_light == 1 && obj.white_light) {
      play.img_set({
        sn: obj.sn,
        token: "vs0",
        conf: {
          day: { brightness: obj.day.brightness, contrast: obj.day.contrast, color_saturation: obj.day.color_saturation, sharpness: obj.day.sharpness },
          night: { brightness: obj.night.brightness, contrast: obj.night.contrast, color_saturation: obj.night.color_saturation, sharpness: obj.night.sharpness },
          white_light: { brightness: obj.white_light.brightness, contrast: obj.white_light.contrast, color_saturation: obj.white_light.color_saturation, sharpness: obj.white_light.sharpness },
          mode: obj.day_night, light_mode: obj.light_mode
        }
      }).then(res => {
        let result = get_ret(res);
        if (result === "") {
          play.misc_set({
            sn: obj.sn,
            info: { flip: obj.flip, power_freq: obj.flicker_freq },
            resolute: obj.resolute
          }).then(res_misc => {
            returnItem = res_misc
          })
        } else {
          returnItem = { result: result }
        }
      })
    } else if (obj.day) {
      play.img_set({
        sn: obj.sn,
        token: "vs0",
        conf: {
          day: { brightness: obj.day.brightness, contrast: obj.day.contrast, color_saturation: obj.day.color_saturation, sharpness: obj.day.sharpness },
          night: { brightness: obj.night.brightness, contrast: obj.night.contrast, color_saturation: obj.night.color_saturation, sharpness: obj.night.sharpness },
          mode: obj.day_night, light_mode: obj.light_mode
        }
      }).then(res => {
        let result = get_ret(res);
        if (result == "") {
          play.misc_set({
            sn: obj.sn,
            info: { flip: obj.flip, power_freq: obj.flicker_freq },
            resolute: obj.resolute
          }).then(res_misc => {
            returnItem = res_misc
          })
        } else {
          returnItem = { result: result }
        }
      })
    } else {
      play.img_set({
        sn: obj.sn,
        token: "vs0",
        conf: { brightness: obj.brightness, contrast: obj.contrast, color_saturation: obj.color_saturation, sharpness: obj.sharpness, mode: obj.day_night }
      }).then(res => {
        let result = get_ret(res);
        if (result === "") {
          play.misc_set({
            sn: obj.sn,
            info: { flip: obj.flip, power_freq: obj.flicker_freq },
            resolute: obj.resolute
          }).then(res_misc => {
            returnItem = res_misc
          })
        } else {
          returnItem = { result: result }
        }
      })
      if (obj.light_mode === "white" || obj.light_mode === "red") {
        play.img_set({
          sn: obj.sn,
          token: "vs0",
          conf: { light_mode: obj.light_mode }
        }).then(res => {
          returnItem = { result: login.get_ret(res) }
        })
      }
    }
    return returnItem
  },
  /*
  ** 设置视频地址接口
  */
  async img_set (params) {
    return await axios.get('/ccm/ccm_img_set', {
      params: {
        sess: { nid: create_nid(), sn: params.sn }, token: "vs0",
        conf: params.conf
      }
    })
  },
  /*
  ** 获取设置视频地址接口
  */
  async img_get (params) {
    return await axios.get('/ccm/ccm_img_get', {
      params: {
        sess: {
          nid: login.create_nid(),
          sn: params.sn
        }
      }
    })
  },
  /*
  ** 杂项设置接口
  */
  async misc_set (params) {
    let returnItem
    await axios.get('/ccm/ccm_misc_set', {
      params: {
        sess: {
          nid: login.create_nid(),
          sn: params.sn
        }, info: {
          flip: params.flip,
          power_freq: params.flicker_freq
        },
        resolute: params.resolute
      }
    }).then(res => {
      returnItem = { result: login.get_ret(res) }
    })
    return returnItem
  },
  /*
  ** 设置设备详细时间
  */
  set_date_time (params) {
    let returnItem
    // 调用设置设备日期
    devlist.date_set(params).then(res_date_set => {
      let result_date_set = login.get_ret(res_date_set)
      if (result_date_set === '') {
        // 调用设置设备ntp
        devlist.ntp_set(params).then(res_ntp_set => {
          returnItem = { result: login.get_ret(res_ntp_set) }
        })
      } else {
        returnItem = { result: result_date_set }
      }
    })
    if (returnItem && returnItem.result == "") {
      returnItem = { msg: mcs_set_successfully, type: "success" }
    } else if (returnItem.result == "permission.denied") {
      returnItem = { msg: mcs_permission_denied, type: "error" }
    } else {
      returnItem = { msg: mcs_failed_to_set_the, type: "error" }
    }
    return returnItem
  },
}

export default play