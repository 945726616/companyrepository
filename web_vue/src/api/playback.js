'use strict'
// 已经整合到play.js中
// import axios from '@/axios' // 导入http中创建的axios实例
import login from './login'
import store from '../store'
// import md5 from '@/util/mmd5.js'
// import mcodec from '@/util/mcodec.js'
import mme from '@/util/mme.js'
import publicFunc from '@/util/public.js'
const playback = {
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
    let flash_isplay = store.state.jumpPageData.flashIsPlay
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
    function flash_play (i) {
      let profile_token_choice = get_profile_token_choice(data.profile_token);
      let urls;
      if(!playback){
        if (process.env.NODE_ENV === 'production') {
          urls = window.location.protocol + "//" + store.state.jumpPageData.serverDevice + "/ccm/ccm_pic_get.js?hfrom_handle=887330&dsess=1&dsess_nid=" + login.create_nid() + "&dsess_sn=" + data.sn + "&dtoken=" + profile_token_choice.profile_token_choice_value;
        } else {
          urls = "http://45.113.201.4:7080/ccm/ccm_pic_get.js?hfrom_handle=887330&dsess=1&dsess_nid=" + login.create_nid() + "&dsess_sn=" + data.sn + "&dtoken=" + profile_token_choice.profile_token_choice_value;
        }
      }else{
        let pic_token = data.token[i];
        if (process.env.NODE_ENV === 'production') {
          urls = window.location.protocol + "//" + store.state.jumpPageData.serverDevice + "/ccm/ccm_pic_get.js?hfrom_handle=887330&dsess=1&dsess_nid=" + login.create_nid() + "&dsess_sn=" + data.sn + "&dtoken=" + pic_token;
        } else {
          urls = "http://localhost:8080/api/ccm/ccm_pic_get.jpg?hfrom_handle=887330&dsess=1&dsess_nid=" + login.create_nid() + "&dsess_sn=" + data.sn + "&dtoken=" + pic_token + "&dflag=2";
        }
      }
      console.log(urls, 'urls')
      data.dom.html("<img id='flash_img' width='1px' src='" + urls + "'>")
      if (publicFunc.mx("#flash_img")) {
        publicFunc.mx("#flash_img").onload = function () {
          data.dom.css('background', "url(" + this.src + ")")
          data.dom.css('backgroundSize', "100% 100%")
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
          }else{
            if (flash_isplay) clearInterval(flash_isplay);
            let i = 0;
            flash_isplay = setInterval(function () {
               flash_play(i); 
               i++;
               if(i>data.token.length) clearInterval(flash_isplay);
              }, 1000);
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
          obj.panel.id = "plugin_install_page"
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
  play_preview_img (data){
		var url = (data.addr?"http://"+data.addr:window.location.protocol+"//"+window.location.host)+"/api/ccm/ccm_pic_get.js?dsess=1&dsess_nid="+login.create_nid()+"&dsess_sn="+data.sn+"&dtoken="+data.pic_token+"&dflag=2";
    data.dom[0].style.background = 'url('+url+') no-repeat';
    data.dom[0].style.backgroundSize = '100% 100%';
    // data.dom[0].attr('style', 'background: url('+url+') no-repeat')
		// data.dom[0].attr('style', 'backgroundSize: 100% 100%')
	}
}

export default playback

function get_profile_token_choice(data){
  var profile_token_obj=new Object();
    var profile_token_choice = data;
  if(profile_token_choice=="" || profile_token_choice == null){
      if(store.state.jumpPageData.networkEnviron == "private"){
          profile_token_obj.profile_token_choice_value = "p0_xxxxxxxxxx";
          profile_token_obj.few_seconds=3000;
      }else{
          profile_token_obj.profile_token_choice_value = "p1_xxxxxxxxxx";
          profile_token_obj.few_seconds=1000;
      }
  }else if(profile_token_choice == "p0"){
      profile_token_obj.profile_token_choice_value = "p0_xxxxxxxxxx";
      profile_token_obj.few_seconds=3000;
  }else if(profile_token_choice == "p1"){
      profile_token_obj.profile_token_choice_value = "p1_xxxxxxxxxx";
      profile_token_obj.few_seconds = 1000;
  }else if(profile_token_choice == "p2"){
      profile_token_obj.profile_token_choice_value = "p2_xxxxxxxxxx";
      profile_token_obj.few_seconds=500;
  }else if(profile_token_choice == "p3"){
      profile_token_obj.profile_token_choice_value = "p3_xxxxxxxxxx";
      profile_token_obj.few_seconds = 500;
  }
  return profile_token_obj;
}