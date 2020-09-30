<template>
  <div id="play">
    <div id='play_box'>
      <!-- 顶部播放菜单栏 -->
      <div id='page_top_menu'>
        <div id='play_top_menu'>
          <div id='enter_history' class='play_top_menu_li' @click="clickEnterHistory">
            <div id='enter_history_img'></div>
            <div id='enter_history_txt'>{{mcs_playback}}</div> <!-- 查看回放 -->
          </div>
          <div id='enter_set' class='play_top_menu_li' v-if="!$store.state.jumpPageData.experienceFlag" @click="clickEnterSet">
            <div id='enter_set_img'></div>
            <div id='enter_set_txt'>{{mcs_settings}}</div> <!-- 进入设备设置 -->
          </div>
        </div>
      </div>
      <!-- 顶部播放菜单栏 结束 -->
      <!-- 播放内容主体 -->
      <div ref="play_view" id='play_view'>
        <div id='play_buffer_ret'></div>
        <!-- 视频播放区域 -->
        <div id='play_screen' :style="playScreenHeight">
          <div id='play_view_box' @click="clickPlayView">
            <div id='play_pause_pic'></div>
          </div>
        </div>
        <!-- 视频播放区域 结束 -->
        <!-- 播放器控制菜单栏 -->
        <div id='play_menu_box'>
          <!-- 菜单栏左侧控制按钮 -->
          <div id='play_menu_left'>
            <div id='video_play' class='video_play_stop' @click="clickPlay($event)"></div>
            <div class='enter_nav_left'></div>
            <div id='video_off_pic' class='video_off_picture' v-show="recordFlag" @click="clickRecordVideo($event)"></div>
            <div id='camera_off_pic' class='camera_off_picture' @click="clickScreenShot"></div>
            <div id='talkback_off_pic' class='talkback_off_picture' v-show="talkbackFlag" @click="clickTalkback($event)"></div>
            <div id='adjust_off_pic' class='adjust_off_picture' @click="clickAdjust($event)"></div>
          </div>
          <!-- 菜单栏左侧控制按钮 结束 -->
          <!-- 隐藏的控制按钮 -->
          <div id='full_screen' v-show="fullScreenFlag" @click="clickFullScreen"></div>
          <div class='enter_nav' style='display:none;'></div>
          <!-- 隐藏的控制按钮 结束 -->
          <!-- 菜单栏右侧控制按钮 -->
          <div id='play_menu_right'>
            <!-- 清晰度选择弹出菜单 -->
            <div id='choice_play_definition' v-show="definitionListFlag" :style="{top: definitionTop}">
              <div id='high_definition' class='definition_cha' :style="languageWidthStyle" @click="clickVideoDefinition"></div>
              <div class='definition_nav'></div>
              <div id='standard_definition' class='definition_cha' :style="languageWidthStyle" @click="clickStandard">{{mcs_standard_clear}}</div>
              <div class='definition_nav'></div>
              <div id='fluency_definition' class='definition_cha' :style="languageWidthStyle" @click="clickFluency">{{mcs_fluent_clear}}</div>
              <div class='definition_nav'></div>
              <div id='auto_definition' class='definition_cha' :style="languageWidthStyle" @click="clickAuto">{{mcs_auto}}</div>
            </div>
            <!-- 清晰度选择弹出菜单 结束 -->
            <div ref="resolute_choice" id='resolute_choice' @click="definitionListFlag = !definitionListFlag">{{definitionSelect}}</div> <!-- 点击选择按钮对菜单展示标识取反 -->
            <div class='enter_nav'></div>
            <div id='voice_close' class='voice_close_close' v-show="voiceFlag" @click="clickVoice($event)"></div>
            <div id='enter_set_img' style='display:none;'></div>
            <div class='enter_nav' style='display:none;'></div>
            <div id='enter_history_img' style='display:none;'></div>
          </div>
          <!-- 菜单栏右侧控制按钮 结束 -->
          <!-- 设置弹窗 -->
          <div id='adjust_setting' v-show="adjustSettingFlag">
            <div id='delete_adjust_page' class='delete_adjust_page' @click="clickAdjustClose($event)">×</div>
            <div class='adjust_line' style='padding-top:35px;'>
              <div class='adjust_cha'>{{mcs_sharpness}}</div>
              <div class='adjust_cha_right'>
                <div class='adjust_out_box'>
                  <div class='adjust_in_box'></div>
                  <div class='adjust_circle' style='margin-top:-5px;'></div>
                </div>
              </div>
            </div>
            <div class='adjust_line'>
              <div class='adjust_cha'>{{mcs_contrast}}</div>
              <div class='adjust_cha_right'>
                <div class='adjust_out_box'>
                  <div class='adjust_in_box'></div>
                  <div class='adjust_circle' style='margin-top:-5px;'></div>
                </div>
              </div>
            </div>
            <div class='adjust_line'>
              <div class='adjust_cha'>{{mcs_color_saturation}}</div>
              <div class='adjust_cha_right'>
                <div class='adjust_out_box'>
                  <div class='adjust_in_box'></div>
                  <div class='adjust_circle' style='margin-top:-5px;'></div>
                </div>
              </div>
            </div>
            <div class='adjust_line'>
              <div class='adjust_cha'>{{mcs_brightness}}</div>
              <div class='adjust_cha_right'>
                <div class='adjust_out_box'>
                  <div class='adjust_in_box'></div>
                  <div class='adjust_circle' style='margin-top:-5px;'></div>
                </div>
              </div>
            </div>
            <div class='adjust_line'>
              <div class='adjust_cha'>{{mcs_mode}}</div>
              <div class='adjust_mode'>
                <div id='adjust_mode_auto' class='mode_cha'>{{mcs_auto}}</div>
                <div id='adjust_mode_daytime' class='mode_cha'>{{mcs_daytime}}</div>
                <div id='adjust_mode_night' class='mode_cha'>{{mcs_night}}</div>
              </div>
            </div>
            <!-- 白光特殊样式  后续需要添加白光判断标识进行选择性展示-->
            <div class='adjust_line'>
              <div class='adjust_cha'>{{mcs_light_mode}}</div>
              <div class='adjust_mode'>
                <div id='adjust_mode_smart_light' class='mode_cha'>{{mcs_light_smart}}</div>
                <div id='adjust_mode_infrared_light' class='mode_cha'>{{mcs_light_infrared}}</div>
                <div id='adjust_mode_white_light' class='mode_cha'>{{mcs_light_white}}</div>
              </div>
            </div>
            <!-- 白光特殊样式 结束 -->
            <div id='adjust_reset'>{{mcs_reset}}</div>
          </div>
          <!-- 设置弹窗 结束 -->
        </div>
        <!-- 播放器控制菜单栏 结束 -->
        <!-- 播放器控制区域 -->
        <div id='play_view_control' v-show="cameraControlDivFlag">
          <div ref="ptz_control" id='mipc_ptz_control'>
            <div id='ptz_control_left' @mouseover="leftControl = true" @mouseout="leftControl = false">
              <div id='turn_left' class='left_key' v-show="leftControl" @mousedown="turnCamera('move', 'left')" @mouseup="turnCamera('stop', 'left')"></div>
            </div>
            <div id='ptz_control_up' @mouseover="topControl = true" @mouseout="topControl = false">
              <div id='turn_up' class='up_key' v-show="topControl" @mousedown="turnCamera('move', 'up')" @mouseup="turnCamera('stop', 'up')"></div>
            </div>
            <div id='ptz_control_center' @dblclick="$api.play.fullscreen()"></div>
            <div id='ptz_control_right' @mouseover="rightControl = true" @mouseout="rightControl = false">
              <div id='turn_right' class='right_key' v-show="rightControl" @mousedown="turnCamera('move', 'right')" @mouseup="turnCamera('stop', 'right')"></div>
            </div>
            <div id='ptz_control_down' @mouseover="downControl = true" @mouseout="downControl = false">
              <div id='turn_down' class='down_key' v-show="downControl" @mousedown="turnCamera('move', 'down')" @mouseup="turnCamera('stop', 'down')"></div>
            </div>
          </div>
        </div>
        <!-- 播放器控制区域 结束 -->
      </div>
      <!-- 播放内容主体 结束 -->
    </div>
    <!-- 截图弹窗 -->
    <div id='snapshot_preview_div' v-show="snapshotFlag">
      <div id='snapshot_preview_inner'>
        <a id='snapshot_preview_url' :download="snapshotDownloadName" :href="snapshotUrl"><img id='snapshot_preview_content' :src="snapshotUrl"></a>
      </div>
      <div id='snapshot_preview_close' @click="snapshotFlag = false"></div>
    </div>
    <!-- 截图弹窗 结束 -->
  </div>
</template>
<style lang="scss">
@import './index.scss';
</style>
<script>
export default {
  data () {
    return {
      // 多国语言
      mcs_playback: mcs_playback,
      mcs_settings: mcs_settings,
      mcs_standard_clear: mcs_standard_clear,
      mcs_fluent_clear: mcs_fluent_clear,
      mcs_auto: mcs_auto,
      mcs_sharpness: mcs_sharpness,
      mcs_contrast: mcs_contrast,
      mcs_color_saturation: mcs_color_saturation,
      mcs_brightness: mcs_brightness,
      mcs_mode: mcs_mode,
      mcs_daytime: mcs_daytime,
      mcs_night: mcs_night,
      mcs_light_mode: mcs_light_mode,
      mcs_light_smart: mcs_light_smart,
      mcs_light_infrared: mcs_light_infrared,
      mcs_light_white: mcs_light_white,
      mcs_reset: mcs_reset,
      mcs_high_clear: mcs_high_clear,
      // 多国语言结束
      whiteLight: null, // 设备白光信息存储
      playFlag: 0, // 播放状态标识
      definitionListFlag: false, // 清晰度选择列表展示标识
      definitionSelect: null, // 最终选择的清晰度
      support_1080p: '', // 1080p分辨率内容展示
      voiceFlag: window.fujikam ? true : false, // 声音控制图标标识(在客户端中展示,浏览器端隐藏)
      fullScreenFlag: window.fujikam ? true : false, // 全屏控制图标标识(在客户端中展示,浏览器端隐藏)
      recordFlag: false, // 隐藏控制菜单中录像按钮
      snapshotFlag: false, // 截图弹窗展示标识
      snapshotUrl: null, // 截图图片url
      snapshotDownloadName: null, // 截图图片下载的文件名
      talkbackFlag: window.fujikam ? true : false, // 对讲控制图标标识(在客户端中展示,浏览器端隐藏)
      adjustSettingFlag: false, // 设置弹出框标识
      definitionTop: '', // 清晰度选择弹窗top属性
      languageWidthStyle: this.$store.state.user.userLanguage === 'vi' ? { width: 78 + 'px' } : null, // 特殊语言更改样式宽度
      cameraControlDivFlag: false, // 摄像头转向控制区域展示标识
      leftControl: false, // 摄像头左转控制标识
      rightControl: false, // 摄像头右转控制标识
      topControl: false, // 摄像头上转控制标识
      downControl: false, // 摄像头下转控制标识
      playScreenHeight: null, // 播放区域高度样式
      mipcPlayObj: null, // mipc调用obj
    }
  },
  methods: {
    mipcPlay (obj) {
      this.mipcPlayObj = obj
      this.$api.set.dev_info({ // 调用获取设备详细信息接口
        sn: this.$store.state.jumpPageData.selectDeviceIpc
      }).then(res => {
        this.whiteLight = res.white_light // 获取返回的白光信息
        this.play_menu_control() // 播放控制按钮渲染
        this.get_definition() // 获取窗口大小并绘制播放内容
      })
      // 视频播放控制区域设置
      let l_dom_play_view_width = this.$refs.play_view.offsetWidth
      let l_dom_play_view_height = this.$refs.play_view.offsetHeight
      let l_dom_play_view_top = this.$refs.play_view.offsetTop
      let l_dom_play_view_left = this.$refs.play_view.offsetLeft
      this.$refs.ptz_control.style.width = l_dom_play_view_width + "px"
      this.$refs.ptz_control.style.height = l_dom_play_view_height - 40 + "px"
      this.$refs.ptz_control.style.top = l_dom_play_view_top + "px"
      this.$refs.ptz_control.style.left = l_dom_play_view_left + "px"
      // 视频播放控制区域设置 结束
      // 创建暂停画面以及暂停图标
      if (this.$store.state.jumpPageData.localFlag) {
        this.$api.play.play_preview_img({ addr: obj.addr, dom: $("#play_screen"), sn: this.$store.state.jumpPageData.selectDeviceIpc, pic_token: "p1_xxxxxxxxxx" })
      } else {
        this.$api.play.play_preview_img({ dom: $("#play_screen"), sn: this.$store.state.jumpPageData.selectDeviceIpc, pic_token: "p1_xxxxxxxxxx" })
      }
      this.get_definition()
      // 创建暂停画面以及暂停图标 结束
    },
    get_definition () { // 获取窗口大小并绘制播放内容
      this.playScreenHeight = { height: ((document.body.clientWidth - document.getElementById('dev_main_left').offsetWidth - 60) * 0.563) + 'px' }
      this.get_definition
      this.$api.set.dev_info({ //ms.send_msg("dev_info_get"
        sn: this.$store.state.jumpPageData.selectDeviceIpc
      }).then(res => {
        this.dev_info_get_ack(res)
      })
    },
    dev_info_get_ack (msg) { // 获取窗口大小并绘制播放内容回调处理函数
      this.whiteLight = msg.white_light;
      this.play_menu_control()
      if (this.$store.state.jumpPageData.projectName === "vsmahome") {
        this.publicFunc.mx("#high_definition").innerHTML = this.mcs_high_clear
      } else {
        if (msg.s_sensor === 'ok') {
          this.publicFunc.mx("#high_definition").innerHTML = msg.def
          this.publicFunc.mx("#resolute_choice").innerHTML = msg.def
          this.support_1080p = msg.def
        } else {
          this.publicFunc.mx("#high_definition").innerHTML = 'NULL'
          this.publicFunc.mx("#resolute_choice").innerHTML = 'NULL'
          this.support_1080p = 'NULL'
        }
      }
    },
    play_menu_control () { // 播放控制按钮渲染
      let l_dom_adjust_mode_night = this.publicFunc.mx("#adjust_mode_night");
      let l_dom_adjust_mode_daytime = this.publicFunc.mx("#adjust_mode_daytime");
      let l_dom_adjust_mode_auto = this.publicFunc.mx("#adjust_mode_auto");
      let l_dom_adjust_mode_white_light = this.publicFunc.mx("#adjust_mode_white_light");
      let l_dom_adjust_mode_infrared_light = this.publicFunc.mx("#adjust_mode_infrared_light");
      let l_dom_adjust_mode_smart_light = this.publicFunc.mx("#adjust_mode_smart_light");
      let l_dom_adjust_reset = this.publicFunc.mx("#adjust_reset");
      let dom_left = $(".left_button")[0],
        dom_center = $(".center_button")[0],
        dom_right = $(".right_button")[0],
        dom_out_box = $(".adjust_out_box"),
        dom_in_box = $(".adjust_in_box"),
        values_flag = [false, false, false, false],
        l_cam_conf_reset = [6, 60, 70, 50],//锐度，对比度，饱和度，亮度
        dom_circle = $(".adjust_circle"),
        l_cam_conf, outX, left, top, mouseX, i, evt;

      function change_cam_mode (obj) {
        switch (obj) {
          case "auto":
            {
              l_dom_adjust_mode_auto.className = "mode_cha_active";
              l_dom_adjust_mode_daytime.className = "mode_cha";
              l_dom_adjust_mode_night.className = "mode_cha";
              break;
            }
          case "day":
            {
              l_dom_adjust_mode_auto.className = "mode_cha";
              l_dom_adjust_mode_daytime.className = "mode_cha_active";
              l_dom_adjust_mode_night.className = "mode_cha";
              break;
            }
          case "night":
            {
              l_dom_adjust_mode_auto.className = "mode_cha";
              l_dom_adjust_mode_daytime.className = "mode_cha";
              l_dom_adjust_mode_night.className = "mode_cha_active";
              break;
            }
          default:
            l_dom_adjust_mode_auto.className = "mode_cha_active";
            l_dom_adjust_mode_daytime.className = "mode_cha";
            l_dom_adjust_mode_night.className = "mode_cha";
        }
      }
      function change_cam_light_mode (obj) {
        switch (obj) {
          case "red":
            {
              l_dom_adjust_mode_infrared_light.className = "mode_cha_active";
              l_dom_adjust_mode_white_light.className = "mode_cha";
              l_dom_adjust_mode_smart_light.className = "mode_cha";
              break;
            }
          case "smart":
            {
              l_dom_adjust_mode_infrared_light.className = "mode_cha";
              l_dom_adjust_mode_white_light.className = "mode_cha";
              l_dom_adjust_mode_smart_light.className = "mode_cha_active";
              break;
            }
          case "white":
            {
              l_dom_adjust_mode_infrared_light.className = "mode_cha";
              l_dom_adjust_mode_white_light.className = "mode_cha_active";
              l_dom_adjust_mode_smart_light.className = "mode_cha";
              break;
            }
          default:
            l_dom_adjust_mode_infrared_light.className = "mode_cha";
            l_dom_adjust_mode_white_light.className = "mode_cha";
            l_dom_adjust_mode_smart_light.className = "mode_cha_active";
        }
      }
      //Get local storage resolution
      if (sessionStorage.getItem("PlayProfile") == "p0") {
        if (this.$store.state.jumpPageData.projectName == "vsmahome") {
          $("#resolute_choice").text(mcs_new_hd);
        } else {
          $("#resolute_choice").text(support_1080p);
        }
      }
      else if (sessionStorage.getItem("PlayProfile") == "p1") {
        $("#resolute_choice").text(mcs_standard_clear);
      }
      else if (sessionStorage.getItem("PlayProfile") == "p2") {
        $("#resolute_choice").text(mcs_fluent_clear);
      }
      else if (sessionStorage.getItem("PlayProfile") == "p3") {
        $("#resolute_choice").text(mcs_fluent_clear);
      }
      else {
        $("#resolute_choice").text(mcs_auto);
      }
    },
    play_speed (data) { // 播放速度回调
      this.publicFunc.mx("#play_buffer_ret").innerHTML = data;
    },
    // 按钮点击事件
    clickPlay (event) { // 点击播放按钮
      let obj = this.mipcPlayObj
      let class_name = event.target.className
      console.log(class_name, 'event class_name')
      if (class_name === "video_play_stop") {
        this.playFlag = 1 // 更改播放状态
        let profile_token = sessionStorage.getItem("PlayProfile") ? sessionStorage.getItem("PlayProfile") : "p0";
        if (this.$store.state.jumpPageData.localFlag) { // 本地功能暂缓调试
          local_play_data.profile_token = profile_token
          local_play_data.sn = this.$store.state.jumpPageData.selectDeviceIpc
          msdk_ctrl({ type: "local_device_play", data: local_play_data })
        } else {
          this.$api.play.play({ // 调用播放接口进行视频播放
            dom: $("#play_screen"),
            sn: this.$store.state.jumpPageData.selectDeviceIpc,
            profile_token: profile_token
          }).then(res => {
            this.play_speed(res) // 调用播放速度回调函数
          })
        }
        this.cameraControlDivFlag = true // 摄像头方向控制按钮展示
        event.target.className = "video_play_start" // 更改播放按钮的className
      } else if (class_name === "video_play_start") {
        this.playFlag = 0 // 更改播放状态
        this.$api.play.video_stop({
          dom: $("#play_screen")
        }).then(res => {
          if(!res) { // 如果没有返回值则直接返回退出
            return
          }
          // this.create_preview(res) // 绘制暂停封面以及按钮
          if (this.$store.state.jumpPageData.localFlag) {
            this.$api.play.play_preview_img({ addr: obj.addr, dom: $("#play_screen"), sn: this.$store.state.jumpPageData.selectDeviceIpc, pic_token: "p1_xxxxxxxxxx" })
          } else {
            this.$api.play.play_preview_img({ dom: $("#play_screen"), sn: this.$store.state.jumpPageData.selectDeviceIpc, pic_token: "p1_xxxxxxxxxx" })
          }
          this.get_definition()
        })
        event.target.className = "video_play_stop" // 更改播放按钮的className
        this.cameraControlDivFlag = false // 摄像头方向控制按钮展示
      }
    },
    clickVideoDefinition () { // 点击选择视频清晰度
      this.definitionListFlag = false
      sessionStorage.setItem("PlayProfile", "p0")
      if (this.$store.state.jumpPageData.projectName === "vsmahome") {
        this.definitionSelect = this.mcs_new_hd
      } else {
        this.definitionSelect = this.support_1080p
      }
      if (this.playFlag) {
        if (this.$store.state.jumpPageData.localFlag) {
          local_play_data.profile_token = "p0"
          local_play_data.sn = this.$store.state.jumpPageData.selectDeviceIpc
          msdk_ctrl({ type: "local_device_play", data: local_play_data })
        } else {
          this.$api.play.play({
            dom: $("#play_screen"),
            sn: this.$store.state.jumpPageData.selectDeviceIpc,
            profile_token: "p0"
          }).then(res => {
            this.play_speed(res)
          })
        }
      }
    },
    clickStandard () { // 点击标准清晰度
      this.definitionListFlag = false // 隐藏清晰度选择弹窗
      sessionStorage.setItem("PlayProfile", "p1")
      this.definitionSelect = this.mcs_standard_clear
      if (this.playFlag) {
        if (this.$store.state.jumpPageData.localFlag) { // 本地内容暂缓
          local_play_data.profile_token = "p1";
          local_play_data.sn = this.$store.state.jumpPageData.selectDeviceIpc;
          msdk_ctrl({ type: "local_device_play", data: local_play_data });
        } else {
          this.$api.play.play({
            dom: $("#play_screen"),
            sn: this.$store.state.jumpPageData.selectDeviceIpc,
            profile_token: "p1"
          }).then(res => {
            this.play_speed(res)
          })
        }
      }
    },
    clickFluency () { // 点击流畅清晰度
      this.definitionListFlag = false // 隐藏清晰度选择弹窗
      sessionStorage.setItem("PlayProfile", "p2")
      this.definitionSelect = this.mcs_fluent_clear
      if (this.playFlag) {
        if (this.$store.state.jumpPageData.localFlag) { // 本地内容暂缓
          local_play_data.profile_token = "p2";
          local_play_data.sn = this.$store.state.jumpPageData.selectDeviceIpc;
          msdk_ctrl({ type: "local_device_play", data: local_play_data });
        } else {
          this.$api.play.play({
            dom: $("#play_screen"),
            sn: this.$store.state.jumpPageData.selectDeviceIpc,
            profile_token: "p2"
          }).then(res => {
            this.play_speed(res)
          })
        }
      }
    },
    clickAuto () { // 点击自动清晰度
      this.definitionListFlag = false
      this.definitionSelect = this.mcs_auto
    },
    clickEnterSet () { // 跳转到设置页面
      let obj = this.mipcPlayObj
      this.publicFunc.showBufferPage()
      this.$api.set.dev_info({
        sn: this.$store.state.jumpPageData.selectDeviceIpc
      }).then(res => {
        this.publicFunc.closeBufferPage()
        let jumpData
        if (res.result == "") {
          if (res.fisheye) {
            jumpData = { parent: $("#page"), back_page: "play", type: 5, addr: obj.addr, web_name: "mipc" }
            this.$router.push({ name: 'set', params: jumpData })
          } else if (res.oscene) {
            jumpData = { parent: $("#page"), back_page: "play", type: 1, addr: obj.addr, web_name: "mipc" }
            this.$router.push({ name: 'set', params: jumpData })
          } else {
            jumpData = { parent: $("#page"), back_page: "play", type: 3, addr: obj.addr, web_name: "mipc" }
            this.$router.push({ name: 'set', params: jumpData })
          }
        } else {
          jumpData = { parent: $("#page"), back_page: "play", type: 1, addr: obj.addr, web_name: "mipc" }
          this.$router.push({ name: 'set', params: jumpData })
        }
      })
    },
    clickEnterHistory () { // 跳转至历史页面
      let jumpData = { parent: $("#dev_main_page"), dev_sn: this.$store.state.jumpPageData.selectDeviceIpc, back_page: "playpage" }
      this.$router.push({ name: 'history', params: jumpData })
    },
    clickVoice (event) { // 点击声音图标
      let class_name = event.target.className
      if (class_name === "voice_close_close") {
        this.$api.play.voice({ flag: 0 })
        event.target.className = "voice_close_open"
      } else {
        this.$api.play.voice({ flag: 1 })
        event.target.className = "voice_close_close"
      }
    },
    clickFullScreen () { // 点击全屏按钮
      this.$api.play.fullscreen()
    },
    clickRecordVideo (event) { // 点击隐藏菜单中的录像按钮
      if (event.target.className === "video_on_picture") {
        event.target.className = "video_off_picture"
        this.$api.play.play_record({
          recording: 1,
          sn: this.$store.state.jumpPageData.selectDeviceIpc
        })
      }
      else {
        event.target.className = "video_on_picture"
        this.$api.play.play_record({
          recording: 0,
          sn: this.$store.state.jumpPageData.selectDeviceIpc
        })
      }
    },
    clickScreenShot () { // 点击隐藏菜单中的截图按钮
      if (this.$store.state.jumpPageData.selectDeviceIpc) {
        this.$api.play.play_snapshot({ sn: this.$store.state.jumpPageData.selectDeviceIpc }).then(res => { // 调用截图接口
          this.snapshotFlag = true
          this.snapshotUrl = res
          this.snapshotDownloadName = new Date().getTime() + ".jpg"
        })
      }
    },
    clickTalkback (event) { // 调用对讲功能
      let class_name = event.target.className
      if (class_name === "talkback_off_picture") {
        event.target.className = "talkback_on_picture";
        this.$api.play.play_speak({ // 开启对讲
          flag: 1
        })
      } else {
        event.target.className = "talkback_off_picture";
        this.$api.play.play_speak({ // 关闭对讲
          flag: 0
        })
      }
    },
    clickAdjust (event) { // 点击设备调整按钮
      function adjust_get_ack (data) {
        let dom_out_box = $(".adjust_out_box")
        l_cam_conf = data;
        l_cam_conf.sn = this.$store.state.jumpPageData.selectDeviceIpc;
        if (l_cam_conf.day) {
          //night,white;night,auto,1;auto,2,white;auto,2,auto,1
          if ((l_cam_conf.day_night == "night" && l_cam_conf.light_mode == "white") || (l_cam_conf.day_night == "night" && l_cam_conf.light_mode == "auto" && l_cam_conf.red_or_white == 1) || (l_cam_conf.day_night == "auto" && l_cam_conf.day_or_night == 2 && l_cam_conf.light_mode == "white") || (l_cam_conf.day_night == "auto" && l_cam_conf.day_or_night == 2 && l_cam_conf.light_mode == "auto" && l_cam_conf.red_or_white == 1)) {
            dom_in_box[0].style.width = parseInt(l_cam_conf.white_light.sharpness * 2) + "px";
            dom_in_box[1].style.width = parseInt(l_cam_conf.white_light.contrast * 2) + "px";
            dom_in_box[2].style.width = parseInt(l_cam_conf.white_light.color_saturation * 2) + "px";
            dom_in_box[3].style.width = parseInt(l_cam_conf.white_light.brightness * 2) + "px";
          }
          //night,red;night,auto,0;auto,2,red;auto,2,auto,0 
          else if ((l_cam_conf.day_night == "night" && l_cam_conf.light_mode == "red") || (l_cam_conf.day_night == "night" && l_cam_conf.light_mode == "auto" && l_cam_conf.red_or_white == 0) || (l_cam_conf.day_night == "auto" && l_cam_conf.day_or_night == 2 && l_cam_conf.light_mode == "red") || (l_cam_conf.day_night == "auto" && l_cam_conf.day_or_night == 2 && l_cam_conf.light_mode == "auto" && l_cam_conf.red_or_white == 0)) {
            dom_in_box[0].style.width = parseInt(l_cam_conf.night.sharpness * 2) + "px";
            dom_in_box[1].style.width = parseInt(l_cam_conf.night.contrast * 2) + "px";
            dom_in_box[2].style.width = parseInt(l_cam_conf.night.color_saturation * 2) + "px";
            dom_in_box[3].style.width = parseInt(l_cam_conf.night.brightness * 2) + "px";
          }
          //day;auto,1
          else if (l_cam_conf.day_night == "day" || (l_cam_conf.day_night == "auto" && l_cam_conf.day_or_night == 1)) {
            dom_in_box[0].style.width = parseInt(l_cam_conf.day.sharpness * 2) + "px";
            dom_in_box[1].style.width = parseInt(l_cam_conf.day.contrast * 2) + "px";
            dom_in_box[2].style.width = parseInt(l_cam_conf.day.color_saturation * 2) + "px";
            dom_in_box[3].style.width = parseInt(l_cam_conf.day.brightness * 2) + "px";
          }
        } else {
          dom_in_box[0].style.width = parseInt(l_cam_conf.sharpness * 2) + "px";
          dom_in_box[1].style.width = parseInt(l_cam_conf.contrast * 2) + "px";
          dom_in_box[2].style.width = parseInt(l_cam_conf.color_saturation * 2) + "px";
          dom_in_box[3].style.width = parseInt(l_cam_conf.brightness * 2) + "px";
        }

        for (let j = 0; j < 4; j++) {
          dom_circle[j].style.left = dom_out_box[j].offsetLeft + dom_in_box[j].offsetWidth + "px";
          dom_circle[j].style.top = dom_out_box[j].offsetTop + "px";
        }
        change_cam_mode(l_cam_conf.day_night);
        if (this.whiteLight) {
          change_cam_light_mode(l_cam_conf.light_mode);
        }
      }
      function set_event () {
        function getLeft (e) {
          let offset = e.offsetLeft;
          if (e.offsetParent != null) offset += getLeft(e.offsetParent);
          return offset;
        }
        dom_out_box.mousedown(function (e) {
          for (i = 0; i < 4; i++) {
            if (this == dom_out_box[i]) {
              values_flag[i] = true;
              break;
            }
          }
          evt = window.event || e;
          outX = this.offsetLeft;
          mouseX = evt.clientX - getLeft($("#adjust_setting")[0]);
          let value = mouseX - outX;
          if (value > 200) {
            dom_in_box[i].style.width = "200px";
            dom_circle[i].style.left = outX + 200 + "px";
          }
          else if (value <= 0) {
            dom_in_box[i].style.width = "0";
            dom_circle[i].style.left = outX + "px";
          }
          else {
            dom_in_box[i].style.width = value + "px";
            dom_circle[i].style.left = mouseX + "px";
          }
        });
        document.onmousemove = (function (e) {
          evt = window.event || e;
          if (values_flag[0] || values_flag[1] || values_flag[2] || values_flag[3]) {
            mouseX = evt.clientX - getLeft($("#adjust_setting")[0]);
            let value = mouseX - outX;
            if (value > 200) {
              dom_in_box[i].style.width = "200px";
              dom_circle[i].style.left = outX + 200 + "px";
            }
            else if (value <= 0) {
              dom_in_box[i].style.width = "0";
              dom_circle[i].style.left = outX + "px";
            }
            else {
              dom_in_box[i].style.width = value + "px";
              dom_circle[i].style.left = mouseX + "px";
            }
          }
        });
        document.onmouseup = (function (e) {
          if (values_flag[0] || values_flag[1] || values_flag[2] || values_flag[3]) {
            if (l_cam_conf.day) {
              //night,white;night,auto,1;auto,2,white;auto,2,auto,1
              if ((l_cam_conf.day_night == "night" && l_cam_conf.light_mode == "white") || (l_cam_conf.day_night == "night" && l_cam_conf.light_mode == "auto" && l_cam_conf.red_or_white == 1) || (l_cam_conf.day_night == "auto" && l_cam_conf.day_or_night == 2 && l_cam_conf.light_mode == "white") || (l_cam_conf.day_night == "auto" && l_cam_conf.day_or_night == 2 && l_cam_conf.light_mode == "auto" && l_cam_conf.red_or_white == 1)) {
                l_cam_conf.is_white_light = this.whiteLight;
                l_cam_conf.white_light.sharpness = parseInt(dom_in_box[0].offsetWidth / 2);
                l_cam_conf.white_light.contrast = parseInt(dom_in_box[1].offsetWidth / 2);
                l_cam_conf.white_light.color_saturation = parseInt(dom_in_box[2].offsetWidth / 2);
                l_cam_conf.white_light.brightness = parseInt(dom_in_box[3].offsetWidth / 2);
              }
              //night,red;night,auto,0;auto,2,red;auto,2,auto,0 
              else if ((l_cam_conf.day_night == "night" && l_cam_conf.light_mode == "red") || (l_cam_conf.day_night == "night" && l_cam_conf.light_mode == "auto" && l_cam_conf.red_or_white == 0) || (l_cam_conf.day_night == "auto" && l_cam_conf.day_or_night == 2 && l_cam_conf.light_mode == "red") || (l_cam_conf.day_night == "auto" && l_cam_conf.day_or_night == 2 && l_cam_conf.light_mode == "auto" && l_cam_conf.red_or_white == 0)) {
                l_cam_conf.night.sharpness = parseInt(dom_in_box[0].offsetWidth / 2);
                l_cam_conf.night.contrast = parseInt(dom_in_box[1].offsetWidth / 2);
                l_cam_conf.night.color_saturation = parseInt(dom_in_box[2].offsetWidth / 2);
                l_cam_conf.night.brightness = parseInt(dom_in_box[3].offsetWidth / 2);
              }
              //day;auto,1
              else if (l_cam_conf.day_night == "day" || (l_cam_conf.day_night == "auto" && l_cam_conf.day_or_night == 1)) {
                l_cam_conf.day.sharpness = parseInt(dom_in_box[0].offsetWidth / 2);
                l_cam_conf.day.contrast = parseInt(dom_in_box[1].offsetWidth / 2);
                l_cam_conf.day.color_saturation = parseInt(dom_in_box[2].offsetWidth / 2);
                l_cam_conf.day.brightness = parseInt(dom_in_box[3].offsetWidth / 2);
              }
            } else {
              l_cam_conf.sharpness = parseInt(dom_in_box[0].offsetWidth / 2);
              l_cam_conf.contrast = parseInt(dom_in_box[1].offsetWidth / 2);
              l_cam_conf.color_saturation = parseInt(dom_in_box[2].offsetWidth / 2);
              l_cam_conf.brightness = parseInt(dom_in_box[3].offsetWidth / 2);
            }
            this.$api.play.adjust_set({ conf: l_cam_conf });
            values_flag = [false, false, false, false];
          }
        });
        l_dom_adjust_mode_auto.onclick = function () {
          let sharpness = l_cam_conf.sharpness;
          let color_saturation = l_cam_conf.color_saturation;
          let contrast = l_cam_conf.contrast;
          let brightness = l_cam_conf.brightness;
          if (l_cam_conf.day) {
            if (l_cam_conf.day_or_night == 1 || !l_cam_conf.day_or_night) {
              sharpness = l_cam_conf.day.sharpness;
              color_saturation = l_cam_conf.day.color_saturation;
              contrast = l_cam_conf.day.contrast;
              brightness = l_cam_conf.day.brightness;
            } else if (l_cam_conf.day_or_night == 2) {
              if (l_cam_conf.red_or_white == 0) {
                sharpness = l_cam_conf.night.sharpness;
                color_saturation = l_cam_conf.night.color_saturation;
                contrast = l_cam_conf.night.contrast;
                brightness = l_cam_conf.night.brightness;
              } else if (l_cam_conf.red_or_white == 1) {
                sharpness = l_cam_conf.white_light.sharpness;
                color_saturation = l_cam_conf.white_light.color_saturation;
                contrast = l_cam_conf.white_light.contrast;
                brightness = l_cam_conf.niwhite_lightght.brightness;
              }
            }
          }
          dom_in_box[0].style.width = parseInt(sharpness * 2) + "px";
          dom_in_box[1].style.width = parseInt(contrast * 2) + "px";
          dom_in_box[2].style.width = parseInt(color_saturation * 2) + "px";
          dom_in_box[3].style.width = parseInt(brightness * 2) + "px";
          for (let j = 0; j < 4; j++) {
            dom_circle[j].style.left = dom_out_box[j].offsetLeft + dom_in_box[j].offsetWidth + "px";
            dom_circle[j].style.top = dom_out_box[j].offsetTop + "px";
          }
          change_cam_mode("auto");
          l_cam_conf.day_night = "auto";
          l_cam_conf.is_white_light = this.whiteLight;
          l_cam_conf.sn = this.$store.state.jumpPageData.selectDeviceIpc;
          this.$api.play.adjust_set({ conf: l_cam_conf });
        };

        l_dom_adjust_mode_daytime.onclick = function () {
          if (l_cam_conf.day) {
            dom_in_box[0].style.width = parseInt(l_cam_conf.day.sharpness * 2) + "px";
            dom_in_box[1].style.width = parseInt(l_cam_conf.day.contrast * 2) + "px";
            dom_in_box[2].style.width = parseInt(l_cam_conf.day.color_saturation * 2) + "px";
            dom_in_box[3].style.width = parseInt(l_cam_conf.day.brightness * 2) + "px";
          }
          for (let j = 0; j < 4; j++) {
            dom_circle[j].style.left = dom_out_box[j].offsetLeft + dom_in_box[j].offsetWidth + "px";
            dom_circle[j].style.top = dom_out_box[j].offsetTop + "px";
          }
          change_cam_mode("day");
          l_cam_conf.day_night = "day";
          l_cam_conf.is_white_light = this.whiteLight;
          this.$api.play.adjust_set({ conf: l_cam_conf });
        };

        l_dom_adjust_mode_night.onclick = function () {
          if ((l_cam_conf.night && l_cam_conf.light_mode == "red") || (l_cam_conf.night && l_cam_conf.light_mode == "auto" && l_cam_conf.red_or_white == 0)) {
            dom_in_box[0].style.width = parseInt(l_cam_conf.night.sharpness * 2) + "px";
            dom_in_box[1].style.width = parseInt(l_cam_conf.night.contrast * 2) + "px";
            dom_in_box[2].style.width = parseInt(l_cam_conf.night.color_saturation * 2) + "px";
            dom_in_box[3].style.width = parseInt(l_cam_conf.night.brightness * 2) + "px";
          } else if ((l_cam_conf.night && l_cam_conf.light_mode == "white") || (l_cam_conf.night && l_cam_conf.light_mode == "auto" && l_cam_conf.red_or_white == 1)) {
            dom_in_box[0].style.width = parseInt(l_cam_conf.white_light.sharpness * 2) + "px";
            dom_in_box[1].style.width = parseInt(l_cam_conf.white_light.contrast * 2) + "px";
            dom_in_box[2].style.width = parseInt(l_cam_conf.white_light.color_saturation * 2) + "px";
            dom_in_box[3].style.width = parseInt(l_cam_conf.white_light.brightness * 2) + "px";
          }

          for (let j = 0; j < 4; j++) {
            dom_circle[j].style.left = dom_out_box[j].offsetLeft + dom_in_box[j].offsetWidth + "px";
            dom_circle[j].style.top = dom_out_box[j].offsetTop + "px";
          }
          change_cam_mode("night");
          l_cam_conf.day_night = "night";
          l_cam_conf.sn = this.$store.state.jumpPageData.selectDeviceIpc;
          l_cam_conf.is_white_light = this.whiteLight;
          this.$api.play.adjust_set({ conf: l_cam_conf });
        };
        if (l_dom_adjust_mode_white_light) {
          l_dom_adjust_mode_white_light.onclick = function () {
            if (l_cam_conf.day_night == "night") {
              if (l_cam_conf.white_light) {
                dom_in_box[0].style.width = parseInt(l_cam_conf.white_light.sharpness * 2) + "px";
                dom_in_box[2].style.width = parseInt(l_cam_conf.white_light.color_saturation * 2) + "px";
                dom_in_box[1].style.width = parseInt(l_cam_conf.white_light.contrast * 2) + "px";
                dom_in_box[3].style.width = parseInt(l_cam_conf.white_light.brightness * 2) + "px";
              }
              for (let j = 0; j < 4; j++) {
                dom_circle[j].style.left = dom_out_box[j].offsetLeft + dom_in_box[j].offsetWidth + "px";
                dom_circle[j].style.top = dom_out_box[j].offsetTop + "px";
              }
            }
            l_cam_conf.sn = this.$store.state.jumpPageData.selectDeviceIpc;
            l_cam_conf.is_white_light = this.whiteLight;
            change_cam_light_mode("white");
            l_cam_conf.light_mode = "white";
            this.$api.play.adjust_set({ conf: l_cam_conf });
          };
          l_dom_adjust_mode_infrared_light.onclick = function () {
            if (l_cam_conf.day_night == "night") {
              if (l_cam_conf.night) {
                dom_in_box[0].style.width = parseInt(l_cam_conf.night.sharpness * 2) + "px";
                dom_in_box[2].style.width = parseInt(l_cam_conf.night.color_saturation * 2) + "px";
                dom_in_box[1].style.width = parseInt(l_cam_conf.night.contrast * 2) + "px";
                dom_in_box[3].style.width = parseInt(l_cam_conf.night.brightness * 2) + "px";
              }

              for (let j = 0; j < 4; j++) {
                dom_circle[j].style.left = dom_out_box[j].offsetLeft + dom_in_box[j].offsetWidth + "px";
                dom_circle[j].style.top = dom_out_box[j].offsetTop + "px";
              }
            }
            l_cam_conf.sn = this.$store.state.jumpPageData.selectDeviceIpc;
            l_cam_conf.is_white_light = this.whiteLight;
            change_cam_light_mode("red");
            l_cam_conf.light_mode = "red";
            this.$api.play.adjust_set({ conf: l_cam_conf });
          }
          l_dom_adjust_mode_smart_light.onclick = function () {
            if (l_cam_conf.day_night == "night") {
              if (l_cam_conf.night) {
                dom_in_box[0].style.width = parseInt(l_cam_conf.night.sharpness * 2) + "px";
                dom_in_box[2].style.width = parseInt(l_cam_conf.night.color_saturation * 2) + "px";
                dom_in_box[1].style.width = parseInt(l_cam_conf.night.contrast * 2) + "px";
                dom_in_box[3].style.width = parseInt(l_cam_conf.night.brightness * 2) + "px";
              }

              for (let j = 0; j < 4; j++) {
                dom_circle[j].style.left = dom_out_box[j].offsetLeft + dom_in_box[j].offsetWidth + "px";
                dom_circle[j].style.top = dom_out_box[j].offsetTop + "px";
              }
            }
            l_cam_conf.sn = this.$store.state.jumpPageData.selectDeviceIpc;
            l_cam_conf.is_white_light = this.whiteLight;
            change_cam_light_mode("smart");
            l_cam_conf.light_mode = "auto";
            this.$api.play.adjust_set({ conf: l_cam_conf });
          }
        }
        l_dom_adjust_reset.onclick = function () {
          for (let i = 0; i < 4; i++) {
            dom_in_box[i].style.width = l_cam_conf_reset[i] * 2 + "px";
            dom_circle[i].style.left = dom_out_box[i].offsetLeft + dom_in_box[i].offsetWidth + "px";
          }
          change_cam_mode("auto");
          if (this.whiteLight) {
            change_cam_light_mode("auto")
          }
          if (l_cam_conf.day) {
            l_cam_conf.day.sharpness = parseInt(dom_in_box[0].offsetWidth / 2);
            l_cam_conf.day.contrast = parseInt(dom_in_box[1].offsetWidth / 2);
            l_cam_conf.day.color_saturation = parseInt(dom_in_box[2].offsetWidth / 2);
            l_cam_conf.day.brightness = parseInt(dom_in_box[3].offsetWidth / 2);

            l_cam_conf.night.sharpness = parseInt(dom_in_box[0].offsetWidth / 2);
            l_cam_conf.night.contrast = parseInt(dom_in_box[1].offsetWidth / 2);
            l_cam_conf.night.color_saturation = parseInt(dom_in_box[2].offsetWidth / 2);
            l_cam_conf.night.brightness = parseInt(dom_in_box[3].offsetWidth / 2);
            if (l_cam_conf.white_light) {
              l_cam_conf.is_white_light = this.whiteLight;
              l_cam_conf.white_light.sharpness = parseInt(dom_in_box[0].offsetWidth / 2);
              l_cam_conf.white_light.contrast = parseInt(dom_in_box[1].offsetWidth / 2);
              l_cam_conf.white_light.color_saturation = parseInt(dom_in_box[2].offsetWidth / 2);
              l_cam_conf.white_light.brightness = parseInt(dom_in_box[3].offsetWidth / 2);
            }
          } else {
            l_cam_conf.sharpness = l_cam_conf_reset[0];
            l_cam_conf.color_saturation = l_cam_conf_reset[2];
            l_cam_conf.contrast = l_cam_conf_reset[1];
            l_cam_conf.brightness = l_cam_conf_reset[3];
          }
          l_cam_conf.day_night = "auto";
          l_cam_conf.light_mode = "auto";
          this.$api.play.adjust_set({ conf: l_cam_conf });
        };
      }
      if (event.target.className === "adjust_off_picture") {
        event.target.className = "adjust_on_picture";
        this.$api.play.adjust_get({ sn: this.$store.state.jumpPageData.selectDeviceIpc }).then(res => {
          adjust_get_ack(res)
        })
        this.adjustSettingFlag = true
      } else {
        event.target.className = "adjust_off_picture"
        this.adjustSettingFlag = false
      }
      set_event()
    },
    clickAdjustClose (event) { // 点击关闭设置弹窗
      this.adjustSettingFlag = false
      event.target.className = "adjust_off_picture"
    },
    turnCamera (action, direction) { // 摄像头转向方法调用
      this.$api.play.play_ptz_turn({ // 摄像头转向控制
        flag: action,
        direction: direction
      })
    },
    clickPlayView () { // 点击视频播放区域
      let profile_token = sessionStorage.getItem("PlayProfile") ? sessionStorage.getItem("PlayProfile") : "p0"
      this.playFlag = 1
      if (this.$store.state.jumpPageData.localFlag) { // 本地接口暂缓
        local_play_data.profile_token = profile_token
        local_play_data.sn = this.$store.state.jumpPageData.selectDeviceIpc
        msdk_ctrl({ type: "local_device_play", data: local_play_data });
      } else {
        this.$api.play.play({
          dom: $("#play_screen"),
          sn: this.$store.state.jumpPageData.selectDeviceIpc,
          profile_token: profile_token
        }).then(res => {
          this.play_speed(res)
        })
      }
      $("#video_play").attr("class", "video_play_start");
      this.cameraControlDivFlag = true
    },
    // 按钮点击事件 结束
  },
  async mounted () {
    await this.$chooseLanguage.lang(this.$store.state.user.userLanguage)
    console.log(this.$refs.resolute_choice.offsetTop, 'this.$refs.resolute_choice.offsetTop')
    if (this.$refs.resolute_choice.offsetTop) {
      this.definitionTop = (this.$refs.resolute_choice.offsetTop - 113) + 'px'
    }
    let pageData;//页面创建相关对象
    if (this.$route.params) {
      pageData = this.$route.params;
      pageData.parent = $("#" + this.$route.name)
    } else {
      pageData = { parent: $("#" + this.$route.name) }
    }
    if (pageData.parent.length === 0) {
      pageData.parent = $("#" + pageData.parentId)
    }
    // console.log(pageData,"pageData")
    await this.mipcPlay(pageData) // 进入页面后加载
    await this.publicFunc.importCss('Public.scss') // 动态引入css样式 页面加载完成后加载样式(如果加载过早则会无法改变jq填充的dom)
    // window.mipcPlay = this.mipcPlay
  }
}
</script>