<template>
  <div id="playback">
    <div id="playback_box">
      <!-- vimtag专属返回栏 -->
      <div id="page_top_menu" v-show="!$store.state.jumpPageData.projectFlag">
        <div id="back">
          <div id="main_title_box_return_img"></div>
          {{ mcs_back }}
        </div>
      </div>
      <!-- vimtag专属返回栏 结束 -->
      <div id="playback_view">
        <div id="playback_buffer_ret"></div>
        <!-- 回放视频播放 -->
        <div id="playback_screen">
          <div id="play_view_box" @click="clickPlayViewBox">
            <div id="play_pause_pic"></div>
          </div>
        </div>
        <!-- 回放视频播放 结束 -->
        <!-- 播放菜单控制 -->
        <div id="playback_menu_box">
          <div id="play_menu_left">
            "
            <div
              id="video_play"
              class="video_play_start"
              @click="clickPlay"
            ></div>
            <div id="playback_start_time" style="display: none">
              {{ start_time }}
            </div>
          </div>
          <div id="playback_progress_bar" style="display: none">
            <input
              name="slider"
              type="text"
              id="playback_progressbar"
              class="fd_tween fd_classname_extraclass fd_hide_input fd_slider_cb_create_ms.TT-init fd_slider_cb_update_ms.TT-update fd_slider_cb_move_ms.TT-update"
              value="0%"
            />
          </div>
          <div id="play_menu_right" style="display: none">
            <div id="playback_download_img"></div>
            <div
              id="playback_voice_close"
              class="voice_close_open"
              style="display: none"
            ></div>
            <div id="playback_end_time" style="display: none">
              {{ end_time }}
            </div>
          </div>
        </div>
        <!-- 播放菜单控制 结束 -->
        <div id="playback_download_path_box">
          <div id="playback_download_path_main">
            <span>{{ mcs_input_download_path }}</span>
            <input id="playback_download_path_input" value="" type="text" />
          </div>
          <div id="playback_download_path_cancel">{{ mcs_cancel }}</div>
          <div id="playback_download_path_submit">{{ mcs_ok }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import "@/lib/plugins/slider.js"
import fdSliderController from "../../util/fdSliderController"
import languageSelect from "../../lib/exportModule/languageSelect.js"
export default {
  data() {
    return {
      //多国语言
      mcs_back: mcs_back,
      mcs_input_download_path: mcs_input_download_path,
      mcs_cancel: mcs_cancel,
      mcs_ok: mcs_ok,
      mcs_stop: mcs_stop,
      mcs_pause: mcs_pause,
      // 多国语言 结束
      createPlaybackObj: null, // 页面使用的obj
      vedio_flag_arr: [], // 移动侦测标记集合
      start_time: null, // 视频开始时间
      end_time: null, // 视频结束时间
      is_playing: 0, // 播放状态记录
      videoSize: 0, // 视频大小记录
      first: sessionStorage.getItem('play_first') ? sessionStorage.getItem('play_first') : false, // 是否第一次播放
      bo_type: sessionStorage.getItem('bo_type') ? sessionStorage.getItem('bo_type') : false, // 播放类型
      play_back_token: null, // 回放token
      b_start_time: null, // b开始时间
    }
  },
  methods: {
    create_playback_page(obj) {
      let _this = this
      this.createPlaybackObj = obj // 存储调用时的obj内容
      let play_progress;
      if (obj.data) {
        for (let j = 0; j < obj.data.length; j++) {
          this.vedio_flag_arr.push(obj.data[j].f)
        }
      }
      if (_this.publicFunc.mx("#playback_download_path_input"))
        _this.publicFunc.mx("#playback_download_path_input").value = (navigator.platform.indexOf("Win") > -1 ? ('c:/downloads/') : ('/Users/Shared/'));
      let l_dom_playback_view = _this.publicFunc.mx("#playback_view");
      let l_dom_playback_screen = _this.publicFunc.mx("#playback_screen");
      let l_dom_playback_menu_box = _this.publicFunc.mx("#playback_menu_box");
      let l_dom_playback_download_path_box = _this.publicFunc.mx("#playback_download_path_box");
      let l_height = _this.publicFunc.mx("#top").offsetWidth * 0.4 + 11;
      let l_download_path_box_top = _this.publicFunc.mx("#playback_box").offsetTop + 200;
      let l_download_path_box_left = _this.publicFunc.mx("#playback_box").offsetLeft + 430;
      let l_playback_menu_box_height = l_dom_playback_menu_box.offsetHeight - 1;
      l_dom_playback_view.style.height = l_height + "px";
      l_dom_playback_screen.style.height = (l_height - l_playback_menu_box_height) + "px";
      l_dom_playback_download_path_box.style.top = l_download_path_box_top + "px";
      l_dom_playback_download_path_box.style.left = l_download_path_box_left + "px";
      _this.publicFunc.mx("#playback_buffer_ret").style.left = (l_dom_playback_screen.offsetLeft + l_dom_playback_screen.offsetWidth - 50) + "px";
      this.play_menu_control({ parent: l_dom_playback_menu_box })
      this.create_preview({ parent: $("#playback_screen") })

      function download_info(data) {
        // console.log(data, 'download_info_data')
        let data_num = data.substring(0, data.length - 1);
        if (_this.publicFunc.mx("#download_progress")) {
          _this.publicFunc.mx("#download_progress").innerHTML = data;
        }
        if (data_num == 100) {
          _this.$api.playback.video_stop({
            dom: $("#playback_screen"),
            isDownload: 1 // 是否下载中特殊标记
          }).then(res => {
            _this.create_preview(res)
          })
        }
      }
      //get start_time
      obj.start_time = parseInt(obj.start_time)
      this.start_time = obj.start_time
      sessionStorage.setItem('play_back_startTime', JSON.stringify(this.start_time)) // 存储开始时间
      //get end_time
      obj.end_time = parseInt(obj.end_time)
      this.end_time = obj.end_time
      sessionStorage.setItem('play_back_endTime', JSON.stringify(this.end_time)) // 存储结束时间
      this.b_start_time = obj.start_time;
      sessionStorage.setItem('b_start_time', JSON.stringify(this.b_start_time))
      window.onresize = function () { }
    },
    play_menu_control(data) { // 播放控制菜单
      let _this = this
      this.createPlaybackObj.start_time = parseInt(this.createPlaybackObj.start_time)
      this.createPlaybackObj.end_time = parseInt(this.createPlaybackObj.end_time)
      this.videoSize = this.createPlaybackObj.end_time - this.createPlaybackObj.start_time
      let start_time = new Date(this.createPlaybackObj.start_time).format("hh:mm:ss")
      let end_time = new Date(this.createPlaybackObj.end_time).format("hh:mm:ss")
      let data_length = this.createPlaybackObj.data.length
      let l_video_start_time_stamp = this.createPlaybackObj.start_time
      let l_video_end_time_stamp = this.createPlaybackObj.end_time
      let l_video_time = l_video_end_time_stamp - l_video_start_time_stamp

      if (this.$store.state.jumpPageData.localFlag) {
        $("#playback_download_img").hide()
      }
      if (window.fujikam === "fujikam") { // 浏览器不显示进度条和下载功能
        $("#playback_download_img").css("background-size", "100% 100%")
        $("#play_menu_right").show()
      }

      let l_width = this.publicFunc.mx("#play_menu_left").offsetWidth;
      let r_width = this.publicFunc.mx("#play_menu_right").offsetWidth;
      // let r_width = parseInt($("#play_menu_right").css("width"));
      let box_width = this.publicFunc.mx("#playback_menu_box").offsetWidth;
      this.publicFunc.mx("#playback_progress_bar").style.width = (box_width - l_width - r_width - 30) + "px";
      fdSliderController.create()
      function create_flag_item(msg) {
        for (let i = 0; i < msg.length; i++) {
          if (msg[i] != "0") {
            let process_flag = document.createElement("span");
            process_flag.setAttribute("class", "flag_item");
            process_flag.style.width = (1 / msg.length * 100 + "%");
            process_flag_dom.appendChild(process_flag);
          } else {
            let process_flag = document.createElement("span");
            process_flag.setAttribute("class", "no_flag_item");
            process_flag.style.width = (1 / msg.length * 100 + "%");
            process_flag_dom.appendChild(process_flag);
          }
        }
      }
      let process_flag_dom = document.createElement("span")
      process_flag_dom.setAttribute("class", "fd_slider_flag")
      document.getElementById("fd-slider-playback_progressbar").appendChild(process_flag_dom)
      create_flag_item(this.vedio_flag_arr)
      fdSliderController.addEvent(this.publicFunc.mx("#playback_progress_bar"), "mouseup", playback_event_mouseup) // 监听鼠标点击事件

      function playback_event_mouseup() {
        _this.first = true
        sessionStorage.setItem('play_first', true)
        play_progress = _this.publicFunc.mx("#playback_progressbar").value / 100
        let new_token = parseInt(data_length * play_progress)
        _this.play_back_token = obj.data[new_token].token
        let play_progress_time_stamp = l_video_start_time_stamp + (l_video_time * play_progress)
        let play_progress_time = new Date(play_progress_time_stamp).format("hh:mm:ss")
        sessionStorage.setItem("play_progress_time_stamp", play_progress_time_stamp)
        //拖动时显示对应的时间
        $("#playback_start_time").html(play_progress_time)
        // moveProgressBar
        if (_this.is_playing) {
          _this.$api.play.video_stop({
            dom: $("#playback_screen")
          }).then(() => { // 原函数中是存在返回值调用至函数的情况
            _this.$api.playback.play({ // 原playback接口
              agent: obj.agent,
              dom: $("#playback_screen"),
              sn: _this.$store.state.jumpPageData.selectDeviceIpc,
              videoSize: _this.videoSize,
              token: _this.play_back_token,
              playback: 1 // 此处额外添加参数
            }).then(res => {
              console.log(res, 'playBack_playSpeed')
              _this.playback_speed(res[0], res[1], res[2])
            })
          })
        }
      }


      this.publicFunc.mx("#playback_download_img").onclick = function () {
        $("#playback_download_path_box").show()
      }
      this.publicFunc.mx("#playback_download_path_cancel").onclick = function () {
        $("#playback_download_path_box").hide()
      }
      if (!this.$store.state.jumpPageData.projectFlag) {
        this.publicFunc.mx("#back").onclick = function () {
          if (this.createPlaybackObj.box_ipc == 1) { //如果从云盒子实时播放进来回放播放
            let jumpData = { parent: this.createPlaybackObj.parent, dev_sn: this.createPlaybackObj.dev_sn, back_page: this.createPlaybackObj.back_page, agent: this.createPlaybackObj.agent, addr: this.createPlaybackObj.addr, a_start: this.createPlaybackObj.a_start, b_end: this.createPlaybackObj.b_end, box_ipc: 1, ipc_sn: this.createPlaybackObj.ipc_sn, box_sn: this.createPlaybackObj.box_sn, box_live: 1, backplay_flag: 4, ipc_stat: this.createPlaybackObj.ipc_stat };
            this.$router.push({ name: 'history', params: jumpData });
          } else {
            let jumpData = { parent: this.createPlaybackObj.parent, dev_sn: this.createPlaybackObj.dev_sn, back_page: this.createPlaybackObj.back_page, agent: this.createPlaybackObj.agent, addr: this.createPlaybackObj.addr, a_start: this.createPlaybackObj.a_start, b_end: this.createPlaybackObj.b_end, backplay_flag: 4 };
            this.$router.push({ name: 'history', params: jumpData });
          }
        }
      }
      this.publicFunc.mx("#playback_download_path_submit").onclick = function () { // 下载部分函数
        let download_path = this.publicFunc.mx("#playback_download_path_input").value; //下载路径
        $("#playback_download_path_box").hide();
        this.publicFunc.mx("#playback_screen").style.background = "#000";
        this.publicFunc.mx("#playback_screen").innerHTML = "<div id='download_info_box'>"
          + "<div id='download_progress'></div>"
          + "<div id='download_stop'>" + mcs_stop + "</div>"
          + "<div id='download_pause'>" + mcs_pause + "</div>"
          + "</div>";
        this.publicFunc.mx("#download_pause").onclick = function () {
          if (this.publicFunc.mx("#download_pause").innerHTML == mcs_pause) {
            this.$api.playback.pause_ipc().then($("#download_pause").html(mcs_continue))
          } else {
            this.$api.playback.play_download_continue().then($("#download_pause").html(mcs_pause))
          }
        }
        this.publicFunc.mx("#download_stop").onclick = function () {
          this.$api.playback.video_stop({
            dom: $("#playback_screen"),
            isDownload: 1 // 是否下载中特殊标记
          }).then(res => {
            this.create_preview(res)
          })
        }
        if (this.$store.state.jumpPageData.projectName === "vimtag") {
          this.$api.playback.replay_download({ // 原play_back_download接口
            agent: this.createPlaybackObj.agent,
            dom: $("#playback_screen"),
            sn: this.$store.state.jumpPageData.selectDeviceIpc,
            videoSize: videoSize,
            token: this.createPlaybackObj.download_token,
            download_path: download_path,
            playback: 1, // 此处额外添加参数
            isDownload: 1 // 此处额外添加参数
          })
        } else {
          this.$api.playback.replay_download({ // 原play_back_download接口
            agent: this.createPlaybackObj.agent,
            dom: $("#playback_screen"),
            sn: this.$store.state.jumpPageData.selectDeviceIpc,
            videoSize: videoSize,
            token: this.createPlaybackObj.token,
            download_path: download_path,
            playback: 1, // 此处额外添加参数
            isDownload: 1 // 此处额外添加参数
          })
        }
      }
    },
    create_preview(data) { // 创建暂停遮罩层
      sessionStorage.setItem("pause_start_time", this.start_time)
      let pic_token = this.createPlaybackObj.pic_token.replace("_p3_", "_p0_");
      this.$api.play.play_preview_img({
        dom: $("#playback_screen"),
        sn: this.$store.state.jumpPageData.selectDeviceIpc,
        pic_token: pic_token
      })
    },
    playback_speed(data, progress, record_played_duration) { // 视频播放速度
      console.log('enter Play_speed')
      let progress2 = sessionStorage.getItem("aaa")
      sessionStorage.setItem("aaa", progress);
      if (this.bo_type) {
        this.start_time = this.b_start_time;
        sessionStorage.setItem('bo_type', false)
        this.bo_type = false;
      } else {
        this.start_time = this.start_time + record_played_duration;
      }
      let play_start_time_stop = new Date(this.start_time).format("yyyy-MM-dd hh:mm:ss");
      let play_start_time = new Date(this.start_time).format("hh:mm:ss");
      $("#playback_start_time").html(play_start_time);
      let play_end_time_stop = new Date(this.end_time).format("yyyy-MM-dd hh:mm:ss");
      let play_end_time = new Date(this.end_time).format("hh:mm:ss");
      if (play_start_time_stop >= play_end_time_stop) {
        $("#playback_start_time").html(play_end_time);
        this.$api.play.video_stop({
          dom: $("#playback_screen")
        }).then(res => {
          this.create_preview(res)
        })
      }
      if (this.first) {
        progress = Number(progress) - Number(progress2) + Number(_this.publicFunc.mx("#playback_progressbar").value);
        let play_progress_time_stamp = sessionStorage.getItem("play_progress_time_stamp");
        let get_drag_duration = sessionStorage.getItem("duration");
        let drag_start_time = parseInt(play_progress_time_stamp) + parseInt(get_drag_duration);
        let play_start_time = new Date(drag_start_time).format("hh:mm:ss")
        let play_start_time_stop = new Date(drag_start_time).format("yyyy-MM-dd hh:mm:ss")
        $("#playback_start_time").html(play_start_time);
        let play_end_time = new Date(end_time).format("hh:mm:ss");
        let play_end_time_stop = new Date(end_time).format("yyyy-MM-dd hh:mm:ss");
        if (play_start_time_stop >= play_end_time_stop) {
          $("#playback_start_time").html(play_end_time);
          this.$api.play.video_stop({
            dom: $("#playback_screen")
          }).then(res => {
            this.create_preview(res)
          })
        }
      }
      if (!data) data = null
      this.publicFunc.mx("#playback_buffer_ret").innerHTML = data;
      fdSliderController.increment("playback_progressbar", progress - this.publicFunc.mx("#playback_progressbar").value)
    },
    // 点击事件
    clickPlay() { // 点击播放（客户端）
      if (window.fujikam !== "fujikam") { // 客户端播放方法
        return
      }
      if (this.is_playing) { // 当前播放状态 1 为播放中 0 为未播放
        this.is_playing = 0
        $("#video_play").attr("class", "video_play_stop")
        this.$api.play.video_stop({
          dom: $("#playback_screen")
        }).then(res => {
          this.create_preview(res)
        })
      } else {
        this.is_playing = 1
        if (!first) {
          sessionStorage.setItem('bo_type', true)
          this.bo_type = true;
          $("#playback_start_time").html(start_time)
          this.$api.playback.play({ // 原playback接口
            agent: this.createPlaybackObj.agent,
            dom: $("#playback_screen"),
            sn: this.$store.state.jumpPageData.selectDeviceIpc,
            videoSize: this.videoSize,
            token: this.createPlaybackObj.token,
            playback: 1 // 此处额外添加参数
          }).then(res => {
            this.playback_speed(res[0], res[1], res[2])
          })
        } else {
          // console.log('运行至此处')
          this.$api.playback.play({ // 原playback接口
            agent: this.createPlaybackObj.agent,
            dom: $("#playback_screen"),
            sn: this.$store.state.jumpPageData.selectDeviceIpc,
            videoSize: videoSize,
            token: this.play_back_token,
            playback: 1 // 此处额外添加参数
          }).then(res => {
            this.playback_speed(res[0], res[1], res[2])
          })
        }
        $("#video_play").attr("class", "video_play_start");
      }
    },
    clickPlayViewBox() { // 点击播放视图
      let pic_token = [];
      for (let i = 0; i < this.createPlaybackObj.data.length; i++) {
        pic_token.push(this.createPlaybackObj.data[i].pic_token)
      }
      this.is_playing = 1
      if (!this.first) {
        sessionStorage.setItem('bo_type', true)
        this.bo_type = true;
        let bof_start_time = new Date(this.b_start_time).format("hh:mm:ss");
        $("#playback_start_time").html(bof_start_time);
        this.$api.playback.play({ // 原playback接口
          agent: this.createPlaybackObj.agent,
          dom: $("#playback_screen"),
          sn: this.$store.state.jumpPageData.selectDeviceIpc,
          videoSize: this.videoSize,
          token: this.createPlaybackObj.token,
          playback: 1 // 此处额外添加参数
        }).then(res => {
          this.playback_speed(res)
        })
      } else {
        this.$api.playback.play({ // 原playback接口
          agent: this.createPlaybackObj.agent,
          dom: $("#playback_screen"),
          sn: this.$store.state.jumpPageData.selectDeviceIpc,
          videoSize: this.videoSize,
          token: this.play_back_token,
          playback: 1 // 此处额外添加参数
        }).then(res => {
          this.playback_speed(res[0], res[1], res[2])
        })
      }
      $("#video_play").attr("class", "video_play_start")
    }
    // 点击事件 结束
  },
  async mounted() {
    await this.$chooseLanguage.lang(this.$store.state.user.userLanguage)
    let pageData;//页面创建相关对象
    if (this.$route.params) {
      pageData = this.$route.params;
      pageData.parent = $("#" + this.$route.name)
    } else {
      pageData = { parent: $("#" + this.$route.name) }
    }
    // console.log(pageData,"pageData")
    this.publicFunc.projectReload.call(this);
    await this.create_playback_page(pageData) // 进入页面后加载
    await this.publicFunc.importCss('Public.scss') // 动态引入css样式 页面加载完成后加载样式(如果加载过早则会无法改变jq填充的dom)
    if (window.location.href.indexOf('vimtag') === -1) {
      // mipc系列
      languageSelect.mipc($('#login_box'))
      $('#login_box').append("<div id='is_mipc_div'></div>")
    }
  }
}
</script>