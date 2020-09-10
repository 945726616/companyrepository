<template>
  <div id="devlist">
    <div id='dev_main_page'>
      <!-- 设备列表内容 -->
      <div id='dev_main_left'>
        <!-- 设备列表菜单 -->
        <div id='dev_left_top_menu'>
          <div class='dev_main_list' id='device_add_btn' @click="addDevClick">
            <div id='menu_add_dev_btn'></div>
          </div>
          <div class='menu_nav'></div>
          <div class='dev_main_list' id='device_list_edit' @click="clickEditDevice">
            <!-- 点击编辑设备列表 -->
            <div id='menu_edit_dev_btn'></div>
          </div>
          <div class='menu_nav'></div>
          <div class='dev_main_list' id='device_refresh_btn' @click="get_dev_list('refresh')">
            <!-- 点击刷新设备列表 -->
            <div id='menu_refresh_dev_btn'></div>
          </div>
        </div>
        <!-- 设备列表菜单 结束 -->
        <!-- 设备列表详细 -->
        <div id='dev_list'>
          <!-- 设备列表渲染内容 -->
          <div id='dev_list_box'>
            <!-- 设备循环渲染单元 -->
            <!-- {{deviceArr}} -->
            <div class='dev_list' v-for="(deviceItem, index) in deviceArr" @click.stop="chooseDeviceItem(deviceItem, index)" :key="index" :state='deviceItem.stat' :dtype='deviceItem.type' :sn='deviceItem.sn'>
              <div class='device_sidebar_nick'>
                <div class='device_sidebar_point'></div>
                <div class='device_list_nick'>{{deviceItem.nick}}</div>
                <div class='device_list_del_ico' v-show="deviceDelIconFlag" @click.stop="clickItemDel(deviceItem, $event)"></div> <!-- 点击设备的删除图标 -->
              </div>
              <div :class="['device_list_img', deviceItem.imgClass]">
                <div><img class='img_class' :src="deviceItem.def_img"></div>
              </div>
            </div>
            <!-- 设备循环渲染单元 结束 -->
            <!-- 选中框样式 -->
            <div id='active_dev_li'></div>
          </div>
          <!-- 设备列表渲染内容 结束 -->
        </div>
        <!-- 设备列表详细 结束 -->
      </div>
      <!-- 设备列表内容 结束-->
      <!-- 右侧详情内容 -->
      <div id='dev_main_right'>
        <!-- 采用子路由展示右侧详情渲染播放页面/云盒子列表 -->
        <router-view></router-view>
      </div>
      <!-- 右侧详情内容 结束 -->
    </div>
    <!-- 使用添加设备弹窗组件 -->
    <device-Model :addDeviceModelObj='addDeviceModelObj' :addDeviceModel='addDeviceModel' :add_device_type_arr='add_device_type_arr' @closeModel='closeModel'></device-Model>
  </div>
</template>
<style lang="scss">
@import 'index.scss';
</style>
<script>
import languageSelect from '../../../lib/exportModule/languageSelect.js'
import '../../../lib/exportModule/mCustomScrollbar'
import deviceModel from '../addDeviceModel'
export default {
  components: {
    deviceModel
  },
  data () {
    return {
      // 多国语言
      mcs_shaking: mcs_shaking,
      // 多国语言结束
      deviceArr: [], // 设备列表展示用数组
      deviceDelIconFlag: false, // 设备删除图标展示标识
      addDeviceModelObj: {}, // 添加设备弹窗展示对象
      addDeviceModel: false, // 弹窗控制标识
      add_device_type_arr: [ // 选择设备类型相关数组
        { type: '361', url: require('@/assets/mipc/mipc-guide-shake.png'), name: mcs_shaking },
        { type: 'p1', url: require('@/assets/mipc/mipc-guide-firearm.png'), name: mcs_outdoor },
        { type: 'm1', url: require('@/assets/mipc/mipc-guide-card.png'), name: mcs_card },
        { type: 's1', url: require('@/assets/mipc/mipc-guide-box.png'), name: mcs_cloud_box },
        { type: 'fisheye', url: require('@/assets/mipc/fisheye_off.png'), name: mrs_fisheye },
      ],
      imgRefresh: null // 传递过来的图片是否刷新标识
    }
  },
  methods: {
    mipcDevlist (obj) {
      this.imgRefresh = obj.refresh // 拿到图片刷新标识
      if (window.fujikam) { // 客户端判断
        // check_app_version()
      }
      this.publicFunc.mx("#dev_main_right").style.width = document.body.clientWidth - this.publicFunc.mx("#dev_main_left").offsetWidth - 60 + "px"
      this.publicFunc.mx("#dev_main_left").style.height = (document.documentElement.clientHeight - 54) + "px"
      this.publicFunc.mx("#dev_list").style.height = (this.publicFunc.mx("#dev_main_left").offsetHeight - 43) + "px"
      this.get_dev_list() // 获取设备列表
      window.onresize = function () { }
    },
    get_dev_list (type) { // 获取设备列表
      if (this.$store.state.jumpPageData.deviceData.length === 0 || type === 'refresh') { // 如果存储的设备列表数组中没有内容则调用接口获取
        this.$api.devlist.devs_refresh().then(res => {
          this.device_list(res)
        })
      } else { // 直接拿取存储的设备列表
        this.device_list(this.$store.state.jumpPageData.deviceData)
      }
    },
    device_list (msg) { // 设备列表数据整理, 用于渲染
      for (let i = 0; i < msg.length; i++) {
        if (msg[i].type !== "socket") {
          let device_status_img = ""
          let no_get_img = false
          if (msg[i].stat === "Offline") {
            device_status_img = "device_ipc_offline"
            no_get_img = true
          } else if (msg[i].stat === "InvalidAuth") {
            device_status_img = "device_ipc_InvalidAuth"
            no_get_img = true
          } else if (msg[i].stat === "Online") {
            if (!this.$store.state.jumpPageData.selectDeviceIpc) {
              console.log(this.$store.state.jumpPageData.selectDeviceIpc, 'this.$store.state.jumpPageData.selectDeviceIpc')
              this.$store.dispatch('setSelectDeviceIpc', msg[i].sn)
            }
          }
          let itemNick = msg[i].nick.length < 15 ? msg[i].nick : msg[i].nick.substr(0, 13) + "..."
          msg[i].nick = itemNick
          msg[i].imgClass = device_status_img
          if (!no_get_img) {
            msg[i].def_img = this.$api.devlist.pic_url_get({ sn: msg[i].sn, token: "p1" })
          } else {
            msg[i].def_img = null
          }
          // this.deviceArr.push(msg[i])
          this.$set(this.deviceArr, i, msg[i])
        }
      }
      console.log(this.deviceArr, 'deviceArr')
      this.get_device_img() // 调用获取设备图片
    },
    get_device_img () { // 获取设备图片
      // 保持原有的图片获取方式后续将该接口改写 不在需要统一获取imgUrl
      let length = this.publicFunc.mx(".dev_list").length
      for (let i = 0; i < length; i++) {
        this.$api.devlist.load_noid_img({
          refresh: this.imgRefresh ? 1 : 0,
          sn: sn,
          num: i,
          dom: document.getElementsByClassName('dev_list')
        })
      }
      this.chooseFirstOnlineDevice() // 自动选中第一个在线设备
    },
    // 自动选中第一个在线设备
    chooseFirstOnlineDevice () {
      console.log('进入chooseFirstOnlineDevice', this.deviceArr)
      for (let index = 0; index < this.deviceArr.length; index++) {
        let item = this.deviceArr[index]
        if (item.stat === 'Online') {
          this.chooseDeviceItem(item, index)
          return
        }
      }
    },
    // 子组件关闭弹窗
    closeModel () {
      this.addDeviceModel = false
      this.addDeviceModelObj = {}
      this.get_dev_list("refresh")
    },
    // 点击事件
    chooseDeviceItem (item, index) { // 点击设备 (未认证的设备弹窗内容未更改完成)
      console.log('device被点击')
      this.$nextTick(function () { // 使用this.$nextTick进行更新解决dom未加载完成时导致的报错
        let sn = item.sn
        let type = item.type
        let state = item.stat
        if (sn === this.$store.state.jumpPageData.selectDeviceIpc) {
          this.publicFunc.mx("#active_dev_li").style.top = (154 * index) + "px" // 154为固定的active高度
          this.publicFunc.mx(".dev_list")[index].className = "dev_list dev_list_active"
          if (type === 'IPC') {
            // createPage("play", {parent:$("#dev_main_right")})
            if (this.$route.path !== '/play') {
              this.$router.push({ name: 'play', params: { parent: $("#dev_main_right"), parentId: "dev_main_right" } })
            }
          } else if (type === "BOX") {
            let jumpData = { parent: $("#dev_main_right"), parentId: "dev_main_right" }
            // createPage("boxlist", {parent:$("#dev_main_right")})
            if (this.$route.path !== '/boxlist') {
              this.$router.push({ name: 'boxlist', params: jumpData })
            }
          }
        }
        if (state === "Online") {
          $(".img_class").eq(index).show()
        } else {
          $(".img_class").eq(index).hide()
        }
        this.$store.dispatch('setSelectDeviceIpc', sn)
        if (state === "Online") {
          let active_top = 154 * index
          $("#active_dev_li").animate({ "top": active_top + "px" })
          this.publicFunc.mx(".dev_list")[index].className = "dev_list"
          this.publicFunc.mx(".dev_list")[index].className = "dev_list dev_list_active"
          if (type === 'IPC') {
            if (this.$route.path !== '/play') {
              this.$router.push({ name: 'play', params: { parent: $("#dev_main_right"), parentId: "dev_main_right" } })
            } else {
              mipcPlay({ parent: $('#dev_main_right') })
            }
          } else if (type === "BOX") {
            if (this.$route.path !== '/boxlist') {
              this.$router.push({ name: 'boxlist', params: { parent: $("#dev_main_right"), parentId: "dev_main_right" } })
            } else {
              create_boxlist_page(jumpData)
            }
          }
        } else if (state === "InvalidAuth") { // 展示弹窗
          this.addDeviceModel = true
          this.add_device_input_id = this.$store.state.jumpPageData.selectDeviceIpc
          this.$set(this.addDeviceModelObj, 'addDeviceBodyFlag', 'inputDevicePassword') // 切换至输入设备密码页面
          this.$set(this.addDeviceModelObj, 'menuTitle', mcs_action_add_device) // 设置输入设备密码页面顶部菜单标题
          this.$set(this.addDeviceModelObj, 'deviceType', type) // 设置设备类型
          // $("#add_device_page").show()
          // create_add_devices_box({ parent: this.publicFunc.mx("#add_device_page"), sn: this.$store.state.jumpPageData.selectDeviceIpc })
        } else if (state === "Offline") {
          this.$router.push({ name: 'set', params: { parent: $("#dev_main_page"), back_page: "device", type: 4 } })
        }
      })
    },
    clickEditDevice () { // 点击编辑事件
      console.log('enter click edit device')
      if (this.$store.state.jumpPageData.experienceFlag) { // 体验帐号
        // 提示操作无权限
        this.publicFunc.msg_tips({ msg: mcs_permission_denied, type: "error", timeout: 3000 })
        return
      }
      this.deviceDelIconFlag = !this.deviceDelIconFlag // 标识取反
      console.log(this.deviceDelIconFlag, 'this.deviceDelIconFlag')
    },
    clickItemDel (item, e) { // 点击具体设备的删除按钮
      console.log(e, 'deviceDel_E', '删除被点击')
      e.stopPropagation()
      let sn = item.sn
      this.publicFunc.delete_tips({
        content: mcs_delete_device + "?", func: () => {
          this.$api.devlist.dev_del({
            sn: sn
          }).then(res => {
            this.publicFunc.msg_tips({
              msg: res.msg,
              type: res.type,
              timeout: 3000
            })
            if (res.type === 'success') {
              this.deviceDelIconFlag = false
              this.get_dev_list("refresh")
            }
          })
        }
      })
    },
    addDevClick () { // 添加设备点击事件
      this.addDeviceModel = true
      this.$set(this.addDeviceModelObj, 'addDeviceBodyFlag', 'chooseDevice') // 展示产品选择页面
      this.$set(this.addDeviceModelObj, 'menuTitle', mcs_choose_device_type) // 设置产品选择页面顶部菜单标题
    },
    // 点击事件 结束
  },
  async mounted () {
    // this.publicFunc.projectReload.call(this);
    console.log(this.$store.state.user, '(this.$store.state.user')
    await this.$chooseLanguage.lang(this.$store.state.user.userLanguage)
    let pageData; //页面创建相关对象
    if (this.$route.params) {
      pageData = this.$route.params;
      pageData.parent = $("#" + this.$route.name);
    } else {
      pageData = { parent: $("#" + this.$route.name) };
    }
    // console.log(pageData, "pageData");
    await this.mipcDevlist(pageData); // 进入页面后加载
    await this.publicFunc.importCss("Public.scss"); // 动态引入css样式 页面加载完成后加载样式(如果加载过早则会无法改变jq填充的dom)
    if (window.location.href.indexOf("vimtag") === -1) {
      // mipc系列
      languageSelect.mipc($("#login_box"));
      $("#login_box").append("<div id='is_mipc_div'></div>");
    }
    if (!this.$store.state.jumpPageData.projectFlag) {
      $("#top_experience_div").css("display", "none")
    }

  }
}
</script>