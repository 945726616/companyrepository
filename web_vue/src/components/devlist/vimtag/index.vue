<template>
  <div id="devlist">
    <!-- 顶部设备列表菜单栏 -->
    <div id='device_list_menu' :style="fujikamFlag ? 'width:85%;height:40px;margin:0 auto;margin-top:20px' :''">
      <div id='device_list_tree_box' v-show="treeFlag" :style="treeBoxStyle">
        <div id='device_list_tree_div'>
          <div id='device_list_tree'>
            <div class='device_list_tree_level_box' id='device_list_tree_level_box'>
            </div>
            <div id='device_list_tree_all'>{{mcs_all}}</div><!-- 全选 -->
            <div id='device_list_tree_leaf'></div>
          </div>
        </div>
        <div id='device_list_tree_box_btn' :style="treeBoxBtnStyle"></div>
      </div>
      <div id='device_refresh_btn' @click="get_dev_list('refresh')"></div>
      <div id='dev_search'>
        <input type='text' id='dev_search_input' :placeholder="placeholder" value=''>
        <div id='dev_search_btn'></div>
      </div>
      <div id='dev_filter_box' v-if="supportFilterFlag && !$store.state.jumpPageData.localFlag">
        <div id='online_btn'>
          <span id='online_btn_span'>{{mcs_all}}</span><!-- 全选 -->
          <div id='online_btn_direction' class='online_btn_down'></div>
        </div>
        <div id='online_btn_box'>
          <div id='online_btn_select_all'>{{mcs_all}}</div><!-- 全选 -->
          <div id='online_btn_select_online'>{{mcs_state_device_online}}</div><!-- 在线 -->
          <div id='online_btn_select_offline'>{{mcs_offline_status}}</div><!-- 离线 -->
        </div>
      </div>
      <div id='device_list_edit' v-if="!$store.state.jumpPageData.experienceFlag && !$store.state.jumpPageData.localFlag" class='device_list_menu' @click="editClick">{{mcs_edit}}</div><!-- 编辑 -->
      <div id='device_add_btn' v-if="!$store.state.jumpPageData.experienceFlag && !$store.state.jumpPageData.localFlag" class='device_list_menu' @mouseenter="addHoverflag = true" @mouseleave="addHoverflag = false" @click="addDevClick">
        {{mcs_add_device}}
        <!-- 添加设备 -->
        <div id='device_add_btn_down' v-show="addHoverflag">{{mcs_click_add_equipment}}</div><!-- 点击添加设备(hover提示框) -->
      </div>
    </div>
    <!-- 顶部设备列表菜单栏 结束 -->
    <!-- 设备列表展示部分 -->
    <div id='vimtag_device_list_box' :class="{'device_tree_class': treeListFlag === 1 && treeClassFlag}">
      <div v-if="!devlistEmptyFlag" style='overflow:hidden'>
        <!-- 摄像机展示 -->
        <div style='overflow:hidden;font-size:15px'>
          <div id='dev_camera' :style="ipc_num === 1 ? 'display:block' : 'display:none'">{{mcs_camera}}</div><!-- 摄像机 -->
          <!-- 实现拖拽功能 -->
          <div :style='{width: autoImgWidth + "%", height: autoImgHeight + "px"}' class='device_list_img' v-for="IPCCamera in dev_list_dom" :key="IPCCamera.sn" :play='IPCCamera.play' :img='IPCCamera.img' :nick='IPCCamera.nick' :state='IPCCamera.stat' :sn="IPCCamera.sn" :dtype='IPCCamera.type' :addr='IPCCamera.addr' :sort="IPCCamera.sort ? IPCCamera.sort : ''" :tree="IPCCamera.tree ? IPCCamera.tree : ''" @ondrop='drop(event,this)' @ondragover='allowDrop(event)' draggable='true' @ondragstart='drag(event, this)'>
            <div class='device_list_alert_box'>
              <img class='device_list_move_ico' :sn="IPCCamera.sn" :src="require('@/assets/device/move.png')" alt=''>
              <img class='device_list_door_ico' :sn="IPCCamera.sn" :src="require('@/assets/device/door.png')" alt=''>
              <img class='device_list_sos_ico' :sn="IPCCamera.sn" :src="require('@/assets/device/sos.png')" alt=''>
            </div>
            <div class='device_list_img_child' :style='{height: (autoImgHeight - 34) + "px"}'>
              <div v-show="IPCCamera.imgFlag === undefined || IPCCamera.imgFlag" class='camera_sign_picture_div' @click="clickCameraSignPic(IPCCamera)">
                <img :src='IPCCamera.def_img' class='img_class' alt=''><!-- 图片 -->
              </div>
              <div class='camera_sign_video'></div>
            </div>
            <div class='device_nick'>
              <div class='device_list_del_ico' @click="delDevice(IPCCamera)"></div>
              <div class='device_list_sort_box'>
                <input class='device_list_sort_num' :value='IPCCamera.sort || ""'>
                <div class='device_list_sort_btn'>{{mcs_edit}}</div>
              </div>
              <span>{{IPCCamera.nick}}</span>
            </div>
          </div>
        </div>
        <!-- 摄像机展示结束 -->
        <!-- 云盒子展示 -->
        <div style='display:block;font-size:15px'>
          <div id='dev_cloudbox' :style="box_num == 1 ? 'display:block' : 'display:none'">{{mcs_cloud_box}}</div><!-- 云盒子 -->
          <div :style='{width: autoImgWidth + "%", height: autoImgHeight + "px"}' class='device_list_img' v-for="BoxItem in dev_list_dom_box" :key="BoxItem.sn" :play='BoxItem.play' :img='BoxItem.img' :nick='BoxItem.nick' :state='BoxItem.stat' :box_live='BoxItem.box_live ? BoxItem.box_live : 0' :sn="BoxItem.sn" :dtype='BoxItem.type' :addr='BoxItem.addr' :sort="BoxItem.sort ? BoxItem.sort : ''" :tree="BoxItem.tree ? BoxItem.tree : ''" @ondrop='drop(event,this)' @ondragover='allowDrop(event)' draggable='true' @ondragstart='drag(event, this)'>
            <div class='device_list_alert_box'>
              <img class='device_list_move_ico' :sn="BoxItem.sn" :src="require('@/assets/device/move.png')" alt=''>
              <img class='device_list_door_ico' :sn="BoxItem.sn" :src="require('@/assets/device/door.png')" alt=''>
              <img class='device_list_sos_ico' :sn="BoxItem.sn" :src="require('@/assets/device/sos.png')" alt=''>
            </div>
            <div class='device_list_img_child' :style='{height: (autoImgHeight - 34) + "px"}'>
              <div class='camera_sign_picture_div' @click="clickCameraSignPic(BoxItem)">
                <img :src='BoxItem.def_img' class='img_class' alt=''>
              </div>
              <div class='camera_sign_video'></div>
            </div>
            <div class='device_nick'>
              <div class='device_list_del_ico' @click="delDevice(BoxItem)"></div>
              <div class='device_list_sort_box'>
                <input class='device_list_sort_num' :value='BoxItem.sort || ""'>
                <div class='device_list_sort_btn'>{{mcs_edit}}</div>
              </div>
              <span v-html="(BoxItem.nick.length < 14) ? BoxItem.nick : (BoxItem.nick.substr(0, 14) + '...')"></span>
            </div>
          </div>
        </div>
        <!-- 云盒子展示结束 -->
      </div>
      <!-- 没有设备时展示 -->
      <div v-else style='overflow:hidden;font-size:15px'>
        <div id='empty_div_img'></div>
        <div class='empty_div_txt'>{{mcs_your_device_list_empty}}</div>
      </div>
      <!-- 没有设备时展示内容结束 -->
    </div>
    <!-- 设备列表展示部分 结束 -->
    <!-- 添加设备弹窗 -->
    <div id='add_device_model' v-if="addDeviceModel">
      <div id='add_devices_box'>
        <!-- 弹窗顶部标题导航栏 -->
        <div id='add_devices_box_menu'>
          <div v-if="addDeviceModelObj.addDeviceBodyFlag !== 'chooseDevice' && addDeviceModelObj.addDeviceBodyFlag !== 'offlineDeviceAlert'" @click="addDeviceModelBack" id='add_devices_box_back'>{{mcs_back}}</div> <!-- 返回上一层 除选择设备类型页外其他页面均展示 -->
          <div id='add_devices_box_close' @click="closeModel"></div>
          <div v-if="addDeviceModelObj.addDeviceBodyFlag === 'connectFail'" id='add_devices_help' @click="clickQuestion"></div> <!-- 仅配置失败时 展示问号 -->
          <div id='add_devices_box_title'>{{addDeviceModelObj.menuTitle}}</div> <!-- 选择设备类型 -->
        </div>
        <!-- 弹窗顶部标题导航栏 结束 -->
        <!-- 弹窗内部内容 -->
        <div id='add_devices_box_body'>
          <!-- 选择设备类型 -->
          <div v-if="addDeviceModelObj.addDeviceBodyFlag === 'chooseDevice'" class='add_devices_type'>
            <div class='add_devices_type_name'>{{mcs_cloud_camera}}</div> <!-- 云摄像机 -->
            <div class='add_devices_type_list' v-for="addItem in add_device_type_arr" :key="addItem.type" :d_type='addItem.type' @click="chooseDeviceType(addItem)">
              <div class='add_devices_type_list_img' :style="{'background-image': 'url('+ addItem.url +')'}"></div> <!-- 摄像机图片 -->
              <div class='add_devices_type_list_name'>{{addItem.type === 's1' ? mcs_cloud_box : (addItem.name + mcs_intelligent_cloud_camera)}}</div> <!-- 智能云摄像机 -->
            </div>
          </div>
          <!-- 选择设备类型 结束 -->
          <!-- 填写设备id -->
          <div v-if="addDeviceModelObj.addDeviceBodyFlag === 'inputDeviceId'" id="input_device_id">
            <div id='add_device_sample_img' :style="{'background-image': 'url('+ addDeviceModelObj.typeUrl +')', 'background-repeat': 'no-repeat', 'background-position': 'center'}"></div>
            <div class='add_device_input_id_box'>
              <div class='add_device_input_id_box_ico'></div>
              <div id='add_device_input_id_box_del' class='add_device_input_id_box_del' @click="add_device_input_id = null"></div> <!-- 删除图标点击情况输入框中内容 -->
              <input id='add_device_input_id_box_input' class='add_device_input_id_box_input' type='text' :placeholder='mcs_input_device_id' v-model="add_device_input_id"> <!-- v-model绑定input输入框内容值 -->
            </div>
            <div id='add_device_submit' @click="inputDeviceIdNext">{{mcs_action_next}}</div>
          </div>
          <!-- 填写设备id 结束 -->
          <!-- 离线设备添加 -->
          <div v-if="addDeviceModelObj.addDeviceBodyFlag === 'addOfflineDevice'" id="add_offline_device">
            <!-- d_type == "cm1" || d_type == "m1" || d_type == "fisheye" -->
            <div v-if="addDeviceModelObj.deviceType === 'cm1' || addDeviceModelObj.deviceType === 'm1' || addDeviceModelObj.deviceType === 'fisheye'" class='dev_offline_tips'>
              <img class='dev_offline_tips_img' :src="addDeviceModelObj.typeUrl" alt=''>
              <div class='dev_offline_tips_text'>{{mcs_device_offline_use_iphone}}</div>
            </div>
            <!-- d_type else -->
            <div v-else>
              <div id='add_device_sample_img' :style="{'background-image': 'url('+ addDeviceModelObj.typeUrl +')', 'background-repeat': 'no-repeat', 'background-position': 'center', 'background-size': '100% 100%'}"></div>
              <div class='add_devices_box_info'>{{addDeviceModelObj.devicesBoxInfo}}
                <div v-if="addDeviceModelObj.offlineOtherflag" id='add_devices_img'></div><!-- 设备类型为除b1,b2,b3,s1(云盒子)以为的设备类型展示 -->
              </div>
              <div id='add_device_submit' @click="addOfflineDevice">{{mcs_action_next}}</div>
            </div>
          </div>
          <!-- 离线设备添加 结束 -->
          <!-- 连接网线等待设备上线 -->
          <div v-if="addDeviceModelObj.addDeviceBodyFlag === 'connectNet'" id="connect_net">
            <div id='add_device_sample_img' :style="{'background-image': 'url('+ addDeviceModelObj.typeUrl +')', 'background-repeat': 'no-repeat', 'background-position': 'center'}"></div>
            <div class='add_devices_box_info'>{{msc_use_ethernet_cable_connect}}</div> <!-- 请用网线连接路由器和设备的网口，连接成功后设备会自动上线 -->
            <div class='add_devices_wait_online'>{{mcs_state_wait_device_online}}</div><!-- 等待设备上线 -->
            <div id='add_devices_timenum'>{{addDeviceModelObj.connectNetTime}}</div>
          </div>
          <!-- 连接网线等待设备上线 结束 -->
          <!-- 配置失败 -->
          <div v-if="addDeviceModelObj.addDeviceBodyFlag === 'connectFail'" id="connect_fail">
            <div id='add_device_fail_img' @click="addOfflineDevice"></div>
            <div id='add_devices_unconnect_info' class='add_devices_box_info'>{{mcs_wifi_config_failure_reconnect}}</div>
          </div>
          <!-- 配置失败 结束 -->
          <!-- 配置失败原因 -->
          <div v-if="addDeviceModelObj.addDeviceBodyFlag === 'connectFailReason'" id="connect_fail_reason">
            <div class='device_offline_reason'>{{mcs_connect_ethernet_page_title}}</div> <!-- 网线连接 -->
            <div class='device_offline_reason_public'>{{mcs_always_cannot_online}}</div> <!-- 设备一直无法上线 -->
            <div class='device_offline_reason_public'>{{mcs_always_cannot_online_reason}}</div>
            <div class='device_offline_reason_public'>{{mcs_other_problem_with_feedback}}</div>
          </div>
          <!-- 配置失败原因 结束 -->
          <!-- 设备在线输入密码 -->
          <div v-if="addDeviceModelObj.addDeviceBodyFlag === 'inputDevicePassword'" id="input_device_password">
            <div id='add_device_info'>{{mcs_device_id + ":" + add_device_input_id.toUpperCase() + " &nbsp;&nbsp;" + mcs_status + ":" + mcs_state_device_online}}</div>
            <div class='add_device_input_id_box'>
              <div class='add_device_input_pass_box_ico'></div>
              <div id='add_device_input_pass_box_del' class='add_device_input_id_box_del' @click="add_device_password = null"></div> <!-- 清空输入的设备密码 -->
              <input id='add_device_input_pass' class='add_device_input_id_box_input' type='password' v-model="add_device_password" :placeholder='mcs_input_password'>
            </div>
            <div id='add_device_submit' @click="inputDevicePasswordNext">{{mcs_action_next}}</div>
            <div id='add_device_forget_pass' @click="forgetDevicePassword">{{mcs_forgot_your_password}}</div>
          </div>
          <!-- 设备在线输入密码 结束 -->
          <!-- 修改密码 -->
          <div v-if="addDeviceModelObj.addDeviceBodyFlag === 'editDevicePassword'" id="edit_device_password">
            <div id='add_device_success'>
              <div id='add_device_success_ico'></div>
              <div id='add_device_success_txt'>{{mcs_device_id + ":" + add_device_input_id.toUpperCase() + " " + mcs_add_successfully + "!"}}</div>
            </div>
            <div id='add_device_edit_pass_tips'>{{mcs_device_password_too_simple}}</div> <!-- 密码8到32位 -->
            <div class='add_device_input_id_box'>
              <div class='add_device_input_pass_box_ico'></div>
              <input id='add_device_edit_pass' class='add_device_input_id_box_input' type='password' v-model="edit_password_1st" :placeholder='mcs_input_password'>
            </div>
            <div class='add_device_input_id_box'>
              <div class='add_device_input_pass_box_ico'></div>
              <input id='add_device_edit_confirm_pass' class='add_device_input_id_box_input' type='password' v-model="edit_password_2nd" :placeholder='mcs_input_confirm_password'>
            </div>
            <div id='add_device_submit' @click="editDevicePasswordNext">{{mcs_change}}</div> <!-- 修改 -->
          </div>
          <!-- 修改密码 结束 -->
          <!-- 设置wifi -->
          <div v-if="addDeviceModelObj.addDeviceBodyFlag === 'setDeviceWifi'" id="set_device_wifi">
            <div id='add_device_success'>
              <div id='add_device_success_ico'></div>
              <div id='add_device_success_txt'>{{mcs_device_id + ":" + add_device_input_id.toUpperCase() + " " + mcs_add_successfully + "!"}}</div>
            </div>
            <div id='add_device_edit_pass_tips'>{{mcs_prompt_config_wifi}}</div>
            <div id='add_device_set_wifi_refresh' @click="getDropdownDom"></div>
            <div id='add_device_set_wifi_box'>
              <div class='add_device_set_wifi_box_ico'></div>
              <div id='add_device_set_wifi_btn' :class="[addDeviceModelObj.wifiListFlag ? 'add_device_set_wifi_down' :'add_device_set_wifi_up']"></div>
              <div id='add_device_set_wifi_input' @click="$set(addDeviceModelObj, 'wifiListFlag', true)" class='add_device_set_wifi_input' v-text="addDeviceModelObj.wifiName ? addDeviceModelObj.wifiName : (mcs_select_wifi_wizard.length < 14) ? mcs_select_wifi_wizard : (mcs_select_wifi_wizard.substr(0, 14) + '...' )"></div>
              <div id='add_device_set_wifi_list_box' v-if="addDeviceModelObj.wifiListFlag">
                <div class='add_device_set_wifi_list' v-for="wifiNameItem in addDeviceModelObj.wifiListArr" :key="wifiNameItem.ssid" @click="chooseWifi(wifiNameItem.ssid)">{{wifiNameItem.ssid}}</div> <!-- 循环渲染wifi设备列表 -->
              </div>
            </div>
            <div class='add_device_input_id_box'>
              <div class='add_device_input_pass_box_ico'></div>
              <input id='add_device_wifi_password' class='add_device_input_id_box_input' type='password' v-model="input_wifi_password" :placeholder='mcs_input_password'>
            </div>
            <div id='add_device_submit' @click="setDeviceWifiNext">{{mcs_action_next}}</div>
            <div id='add_device_skip' @click="skipToNick">{{mcs_action_skip}}</div>
          </div>
          <!-- 设置wifi 结束 -->
          <!-- 设置设备昵称 -->
          <div v-if="addDeviceModelObj.addDeviceBodyFlag === 'setDeviceNick'" id="set_device_nick">
            <div id='add_device_edit_name_tips'>{{mcs_device_id + ":" + add_device_input_id.toUpperCase()}}</div>
            <div class='add_device_input_id_box'>
              <div class='add_device_input_name_box_ico'></div>
              <input id='add_device_nick' class='add_device_input_id_box_input' type='text' v-model="input_device_nick" :placeholder='mcs_input_nick'>
            </div>
            <div id='add_device_submit' @click="setDeviceNickNext">{{mcs_action_next}}</div>
            <div id='add_device_skip' @click="skipToZone">{{mcs_action_skip}}</div>
          </div>
          <!-- 设置设备昵称 结束 -->
          <!-- 设置设备时区 -->
          <div v-if="addDeviceModelObj.addDeviceBodyFlag === 'setDeviceZone'" id="set_device_zone">
            <div id='add_device_set_zone_box'>
              <div class='add_device_set_zone_box_ico'></div>
              <div id='add_device_set_wifi_btn' :class="[addDeviceModelObj.timeZoneListFlag ? 'add_device_set_wifi_down' :'add_device_set_wifi_up']"></div>
              <div id='add_device_set_zone_input' @click="$set(addDeviceModelObj, 'timeZoneListFlag', true)" class='add_device_set_wifi_input'>{{addDeviceModelObj.timeZoneName}}</div>
              <div id='add_device_set_wifi_list_box' v-if="addDeviceModelObj.timeZoneListFlag">
                <div class='add_device_set_wifi_list' v-for="timeItem in addDeviceModelObj.timeZoneArr" :key="timeItem.zone_name" @click="chooseTimeZone(timeItem)" :utc='timeItem.utc' :city='timeItem.city' :name='timeItem.file'>{{timeItem.zone_name}}</div>
              </div>
            </div>
            <div id='add_device_submit' @click="setDeviceZoneFinish">{{mcs_ok}}</div>
            <div id='add_device_skip' @click="closeModel">{{mcs_action_skip}}</div>
          </div>
          <!-- 设置设备时区 结束 -->
          <!-- 忘记密码 -->
          <div v-if="addDeviceModelObj.addDeviceBodyFlag === 'forgetDevicePassword'" id="forget_device_password">
            <div id='add_device_sample_img' :style="{'background-image': 'url('+ addDeviceModelObj.typeUrl +')', 'background-repeat': 'no-repeat', 'background-position': 'center'}"></div>
            <div class='add_devices_box_info'>{{addDeviceModelObj.forgetInfo}}</div>
            <div id='add_device_submit' @click="closeModel">{{mcs_close}}</div>
          </div>
          <!-- 忘记密码 结束 -->
          <!-- 离线设备点击提示 -->
          <div v-if="addDeviceModelObj.addDeviceBodyFlag === 'offlineDeviceAlert'" id="offline_device_alert">
            <div id='video_play_offline'>
              <div id='video_play_id'>{{mcs_device_id + ":  " + add_device_input_id.toUpperCase()}}</div>
              <div id='video_play_offline_word'>{{mcs_video_play_offline}}</div>
            </div>
            <div id='search_help' @click="$set(addDeviceModelObj, 'addDeviceBodyFlag', 'offlineDeviceHelp'), $set(addDeviceModelObj, 'menuTitle', mcs_device_offline)">{{mcs_search_help}}</div>
          </div>
          <!-- 离线设备点击提示 结束 -->
          <!-- 离线设备帮助 -->
          <div v-if="addDeviceModelObj.addDeviceBodyFlag === 'offlineDeviceHelp'" id="offline_device_help">
            <div class='device_offline_reason_box'>
              <div class='device_offline_reason'>{{mcs_device_offline_reson}}</div>
              <div class='device_offline_reason_public'>{{'1、' + mcs_device_offline_first_reson}}</div>
              <div class='device_offline_reason_public'>{{'2、' + mcs_device_offline_check}}
                <span id='reconfig_wifi' @click="$set(addDeviceModelObj, 'addDeviceBodyFlag', 'chooseDevice'), $set(addDeviceModelObj, 'menuTitle', mcs_choose_device_type)">{{mcs_reconfigure}}</span>
              </div>
              <div class='device_offline_reason_public'>{{'3、' + mcs_device_offline_fourth_reson}}</div>
            </div>
          </div>
          <!-- 离线设备帮助 结束 -->
        </div>
        <!-- 弹窗内部内容 结束 -->
      </div>
    </div>
    <!-- 添加设备弹窗 结束 -->
  </div>
</template>
<style lang="scss">
@import 'index.scss';
</style>>
<script>
export default {
  computed: {
    fujikamFlag: function () { // 客户端判别标识
      if (window.fujikam === 'fujikam') {
        return true
      } else {
        return false
      }
    },
    supportFilterFlag: function () { // 支持在线/离线设备筛选标识
      return this.$store.state.jumpPageData.supportFilterFlag
    },
    autoImgWidth: function () { // 动态计算图片宽度
      let device_list_num = sessionStorage.getItem("device_list_num") ? sessionStorage.getItem("device_list_num") : 4
      return 100 / device_list_num
    },
    autoImgHeight: function () { // 动态计算图片高度
      let singalImage = document.body.clientWidth * (this.autoImgWidth / 100)
      return (singalImage / 16 * 9) + 34
    }
  },
  data () {
    return {
      // 多国语言
      mcs_all: mcs_all,
      mcs_state_device_online: mcs_state_device_online,
      mcs_offline_status: mcs_offline_status,
      mcs_edit: mcs_edit,
      mcs_add_device: mcs_add_device,
      mcs_click_add_equipment: mcs_click_add_equipment,
      mcs_camera: mcs_camera,
      mcs_cloud_box: mcs_cloud_box,
      mcs_your_device_list_empty: mcs_your_device_list_empty,
      mcs_choose_device_type: mcs_choose_device_type,
      mcs_cloud_camera: mcs_cloud_camera,
      mcs_intelligent_cloud_camera: mcs_intelligent_cloud_camera,
      mcs_back: mcs_back,
      mcs_action_next: mcs_action_next,
      mcs_input_device_id: mcs_input_device_id,
      mcs_device_offline_use_iphone: mcs_device_offline_use_iphone,
      mcs_device_outdoor_camera_connect_power: mcs_device_outdoor_camera_connect_power,
      mcs_device_box_connect_power: mcs_device_box_connect_power,
      mcs_normal_device_connect_power: mcs_normal_device_connect_power,
      mcs_camera_turn_on_voice: mcs_camera_turn_on_voice,
      msc_use_ethernet_cable_connect: msc_use_ethernet_cable_connect,
      mcs_state_wait_device_online: mcs_state_wait_device_online,
      mcs_wifi_config_failure_reconnect: mcs_wifi_config_failure_reconnect,
      mcs_connect_ethernet_page_title: mcs_connect_ethernet_page_title,
      mcs_always_cannot_online: mcs_always_cannot_online,
      mcs_always_cannot_online_reason: mcs_always_cannot_online_reason,
      mcs_other_problem_with_feedback: mcs_other_problem_with_feedback,
      mcs_device_id: mcs_device_id,
      mcs_status: mcs_status,
      mcs_input_password: mcs_input_password,
      mcs_forgot_your_password: mcs_forgot_your_password,
      mcs_change: mcs_change,
      mcs_input_confirm_password: mcs_input_confirm_password,
      mcs_device_password_too_simple: mcs_device_password_too_simple,
      mcs_add_successfully: mcs_add_successfully,
      mcs_prompt_config_wifi: mcs_prompt_config_wifi,
      mcs_action_skip: mcs_action_skip,
      mcs_input_nick: mcs_input_nick,
      mcs_ok: mcs_ok,
      mcs_close: mcs_close,
      mcs_bseries_forget_password: mcs_bseries_forget_password,
      mcs_press_hole_restore_to_reset_password: mcs_press_hole_restore_to_reset_password,
      mcs_press_button_restore_to_reset_password: mcs_press_button_restore_to_reset_password,
      mcs_ethernet_configuration: mcs_ethernet_configuration,
      mcs_connect_power: mcs_connect_power,
      mcs_select_wifi_wizard: mcs_select_wifi_wizard,
      mcs_search_help: mcs_search_help,
      mcs_video_play_offline: mcs_video_play_offline,
      mcs_device_offline_reson: mcs_device_offline_reson,
      mcs_device_offline_first_reson: mcs_device_offline_first_reson,
      mcs_device_offline_check: mcs_device_offline_check,
      mcs_reconfigure: mcs_reconfigure,
      mcs_device_offline_fourth_reson: mcs_device_offline_fourth_reson,
      mcs_device_offline: mcs_device_offline,
      // 多国语言结束
      // 添加设备弹窗展示数组
      add_device_type_arr: [
        { type: 'p1', url: require('@/assets/device/add_p1.png'), name: 'P1' },
        { type: 'cp1', url: require('@/assets/device/add_cp1.png'), name: 'CP1' },
        { type: 'm1', url: require('@/assets/device/add_m1.png'), name: 'M1' },
        { type: '361', url: require('@/assets/device/add_361.png'), name: '361' },
        { type: 'cm1', url: require('@/assets/device/add_cm1.png'), name: 'CM1' },
        { type: 'b1', url: require('@/assets/device/add_b1.png'), name: 'B1' },
        { type: 's1', url: require('@/assets/device/add_s1.png'), name: '' },
        { type: 'fisheye', url: require('@/assets/device/add_fisheye.png'), name: 'fisheye' },
        { type: 'b2', url: require('@/assets/device/b2.png'), name: 'B2' },
        { type: 'b3', url: require('@/assets/device/b3.png'), name: 'B3' }],
      addDeviceBodyFlag: '',
      placeholder: this.$store.state.user.userLanguage === 'zh' ? '请输入关键词' : '', // 搜索input提示内容
      pageObj: null, // 页面数据
      addHoverflag: false, // 添加设备提示框展示标识
      addDeviceModel: false, // 添加设备弹窗控制标识
      addDeviceModelObj: {}, // 添加设备弹窗展示数组
      add_device_input_id: null, // 添加设备输入设备Id Input框value
      add_device_password: null, // 添加设备输入密码 Input框value
      edit_password_1st: null, // 修改密码第一次输入 Input框value
      edit_password_2nd: null, // 修改密码第二次输入 Input框value
      input_wifi_password: null, // 设置wifi密码输入
      input_device_nick: null, // 设置设备昵称输入
      dev_list_dom: [], // 摄像头设备数组
      dev_list_dom_box: [], // 云盒子设备数组
      connectNetTimeArr: [], // 等待网络链接定时器数组
      ipc_num: 0, // 是否存在摄像头设备标识
      box_num: 0, // 是否存在云盒子设备标识
      devlistEmptyFlag: false, // 设备列表为空标识
      treeFlag: false, // 树状结构标识
      treeClassFlag: false, // 树状结构样式添加标识
      treeListFlag: 1, // 默认树状列表标识
      treeBoxStyle: null, // 树状展示区域绑定style
      treeBoxBtnStyle: null, // 树状展示区域按钮绑定style
      tree_back_data: null, // 树状返回数据
      srcdiv: null,
      devlistData: null,
      searchData: [],
      filterData: [],
      searchDevId: '',
      devImgWidth: null,
      addDeviceList: [],
      addDeviceTime: '',
      tmpData: [],
      search_sort: [],
      search_tree: []
    }
  },
  methods: {
    vimtagDevlist (obj) { // 设备列表入口函数
      let _this = this
      this.pageObj = obj
      // console.log("进入设备列表页" ,obj)
      // if (isAction) {
      //     $.playBar.Stop() // 录像播放停止
      // }
      // get_dev_list("refresh") // 刷新获取设备列表处理删除设备后回到列表页仍能对设备进行操作的问题
      // 展示遮罩层
      this.publicFunc.showBufferPage()
      // $("#buffer_page").show();
      obj.box_ipc = 0;
      // obj.parent[0].innerHTML = "";
      this.get_dev_list() //创建设备列表页面
      $(".device_list_sort_btn").click(function () { // 向cfsf添加sort（设备排序用） tree（显示树状列表用，不和昵称绑定）数据
        let sn = this.parentNode.parentNode.parentNode.getAttribute("sn");
        let tree = this.parentNode.parentNode.parentNode.getAttribute("tree");
        let sort = this.parentNode.parentNode.parentNode.getAttribute("sort");
        create_devices_group({ parent: $("#vimtag_device_list_box"), sn: sn, tree: tree, sort: sort });// 点击编辑，显示设置设备分组页面
      })
      if ($("#dev_search_btn")) {
        $("#dev_search_btn").click(function () {
          let search_id = $("#dev_search_input").val();
          let tmp_data = [];
          if (search_id) {
            for (let i = 0; i < _this.filterData.length; i++) {
              if (_this.filterData[i].nick.indexOf(search_id) > -1 || _this.filterData[i].sn.indexOf(search_id) > -1) {
                tmp_data.push(_this.filterData[i])
              }
              _this.searchData = tmp_data;
              _this.device_list(tmp_data, search_id)
            }
          } else {
            _this.searchData = _this.devlistData;
            _this.device_list(_this.filterData)
          }
        })
        $("#dev_search_input").keyup(function () {
          let search_id = $("#dev_search_input").val();
          let tmp_data = [];
          if (search_id != _this.searchDevId) {
            _this.searchDevId = search_id;
            if (search_id) {
              for (let i = 0; i < _this.filterData.length; i++) {
                if (_this.filterData[i].nick.indexOf(search_id) > -1 || _this.filterData[i].sn.indexOf(search_id) > -1) {
                  tmp_data.push(_this.filterData[i])
                }
              }
              _this.searchData = tmp_data;
              _this.device_list(tmp_data, search_id)
            } else {
              _this.searchData = _this.devlistData;
              _this.device_list(_this.filterData)
            }
          }
        })
        $("#online_btn").click(function () {
          if ($("#online_btn_box").css("display") == "none") {
            $("#online_btn_box").slideDown();
            $("#online_btn_direction").attr('class', 'online_btn_up')
          } else {
            $("#online_btn_box").slideUp();
            $("#online_btn_direction").attr('class', 'online_btn_down')
          }
        })
        $("#online_btn_select_all").click(function () {
          $("#online_btn_box").hide();
          $("#online_btn_direction").attr('class', 'online_btn_down')
          $("#online_btn_span").html(mcs_all)
          $("#online_btn").attr('class', 'online_btn')
          _this.filterData = _this.devlistData;
          _this.device_list(_this.searchData)
        })

        $("#online_btn_select_online").click(function () {
          $("#online_btn_box").hide();
          $("#online_btn_direction").attr('class', 'online_btn_down')
          $("#online_btn_span").html(mcs_state_device_online)
          let tmp_data = [];
          let tmp_filter_data = [];
          $("#online_btn").attr('class', 'online_btn_active')
          for (let i = 0; i < _this.searchData.length; i++) {
            if (_this.searchData[i].stat == "Online") {
              tmp_data.push(_this.searchData[i])
            }
          }
          for (let j = 0; j < _this.devlistData.length; j++) {
            if (_this.devlistData[j].stat == "Online") {
              tmp_filter_data.push(_this.devlistData[j])
            }
          }
          _this.filterData = tmp_filter_data;
          _this.device_list(tmp_data)
        })
        $("#online_btn_select_offline").click(function () {
          $("#online_btn_box").hide();
          $("#online_btn_direction").attr('class', 'online_btn_down')
          $("#online_btn_span").html(mcs_offline_status)
          let tmp_data = [];
          let tmp_filter_data = [];
          $("#online_btn").attr('class', 'online_btn_active')
          for (let i = 0; i < _this.searchData.length; i++) {
            if (_this.searchData[i].stat == "Offline") {
              tmp_data.push(_this.searchData[i])
            }
          }
          for (let j = 0; j < _this.devlistData.length; j++) {
            if (_this.devlistData[j].stat == "Offline") {
              tmp_filter_data.push(_this.devlistData[j])
            }
          }
          _this.filterData = tmp_filter_data;
          _this.device_list(tmp_data)
        })
      }

      function create_devices_group (data) {  //tree后设备树状分组弹出框
        data.parent.innerHTML +=
          "<div id='add_device_group_box'>"
          + "<div style='overflow:hidden'>"
          + "<div id='device_group_sn' class='device_group_box'>sn:" + data.sn + "</div>"
          + "<div id='input_password_box_close'></div>"
          + "</div>"

          + "<div class='device_group_box'>"
          + "<label for = 'group_name'>" + mrs_create_group + "</label>"
          + "<input id = 'group_name' placeholder='" + mrs_group_tip + "' value='" + data.tree + "'></input>"
          + "<div id='grounp_standard'>( " + mrs_tree_format + " : xxx.xxx.xxx... )</div>"
          + "</div>"

          + "<div class='device_group_box'>"
          + "<label for = 'device_sort'>" + mrs_sort + "</label>"
          + "<input id='device_sort' placeholder='" + mrs_sort_tip + "' value='" + data.sort + "'>"
          + "</div>"

          + "<div id='add_device_group_buttton'>" + mcs_ok + "</div>"

          + "</div>";

        function create_devices_group_event () {
          $("#device_sort").keyup(function () { //限制sort输入框只能输入正整数
            reg = /^[0-9]*[1-9][0-9]*$/;
            if (reg.test(this.value)) {
              dev_set_input_num = this.value;
            } else {
              this.value = "";
            }
          })

          $("#add_device_group_buttton").click(function () { //点击确定
            let treelist = $('#group_name').val();
            let num = $('#device_sort').val();
            let sn = data.sn
            // 调用tree接口
            _this.$api.devlist.service_record_set({
              keys: [_this.$store.state.user.name + "_" + sn + "_sort"],
              datas: [num]
            })
            _this.$api.devlist.service_record_set({
              keys: [_this.$store.state.user.name + "_" + sn + "_tree"],
              datas: [treelist]
            }).then(res => {
              if (res.rflags[0] === 0) {
                _this.publicFunc.msg_tips({ msg: mcs_set_successfully, type: "success", timeout: 3000 })
              }
            })
          })
          $("#input_password_box_close").click(function () { //点击关闭
            $("#add_device_group_box").hide()
            get_dev_list()
            // $("#device_list_tree_all").click(); 新加了点击全选清除sessionst
          })
        }
        create_devices_group_event();
      }
      function create_input_passwrod_box (dataGet) {
        let data = dataGet ? dataGet : {};
        data.sn = data.sn ? data.sn : mcs_input_device_id;
        if (!$("#input_password_page").length > 0) {
          $("body").prepend(
            "<div id='input_password_page'>"
            + "<div id='input_password_box'>"
            + "<div id='input_password_box_close'></div>"
            + "<div id='input_password_username'>"
            + "<div id='input_password_username_ico'></div>"
            + "<input type='text' id='input_password_username_input' value='" + data.sn + "'>"
            + "<div id='input_password_username_div'></div>"
            + "</div>"
            + "<div id='input_password_password'>"
            + "<div id='input_password_password_ico'></div>"
            + "<input type='password' id='input_password_password_input' value=''>"
            + "<div id='dev_pwd_eye' class='dev_pwd_eye_hide'></div>"
            + "<div id='input_password_password_div'></div>"
            + "</div>"
            + "<div id='input_password_submit'>" + mcs_ok + "</div>"
            + "</div>"
            + "</div>")
        }
        $("#input_password_box_close").click(function () {
          $("#input_password_page").remove()
        })
        $("#dev_pwd_eye").click(function () { // 密码框输入密码可视状态
          if ($("#dev_pwd_eye").attr('class') === "dev_pwd_eye_hide") {
            $("#dev_pwd_eye").attr('class', 'dev_pwd_eye_show')
            $("#input_password_password_input").attr('type', 'text')
          } else {
            $("#dev_pwd_eye").attr('class', 'dev_pwd_eye_hide')
            $("#input_password_password_input").attr('type', 'password')
          }
        })
        $("#input_password_submit").click(function () {
          let local_play_data = {};
          local_play_data.addr = data.addr;
          local_play_data.sn = data.sn;
          local_play_data.password = $("#input_password_password_input").val();
          local_play_data.dom = data.dom;
          local_play_data.profile_token = "p3";
          local_play_data.func = local_sign_in_ack;
          msdk_ctrl({ type: "local_sign_in", data: local_play_data })
          function local_sign_in_ack (msg) {
            if (msg.result == "accounts.pass.invalid") {
              _this.publicFunc.msg_tips({ msg: mcs_invalid_password, type: "error", timeout: 3000 })
            } else {
              if (data.type == "IPC") {
                obj.addr = data.addr;
                // createPage("play", obj);
                _this.$router.push({ name: 'play', params: obj })
              } else if (data.type == "BOX") {
                obj.addr = data.addr;
                // createPage("boxlist", obj);
                _this.$router.push({ name: 'boxlist', params: obj })
              }
              $("#input_password_page").remove();
            }
          }
        })
      }

      window.onresize = function () { // 监听窗口改变事件
        if (!_this.$store.state.jumpPageData.localFlag && _this.$store.state.jumpPageData.autoPlayFlag) { // 判断是否为客户端且为本地模式的自动播放情况
          this.device_list_load();  // 重载设备列表
        }
      }
    },
    get_dev_list (type) { // 获取设备列表
      if (type === 'refresh' && this.treeFlag === true) { // 树状样式是否添加判断
        this.treeClassFlag = true
      }
      if (this.$store.state.pcOfflineFlag === 1) { // 离线模式
        this.$store.dispatch('setLocalModel', 1)
      }
      if (this.$store.state.localModel) {
        this.$api.devlist.local_devlist_get().then(res => {
          console.log('本地模式res', res)
          this.device_list()
        })
      } else {
        if (this.$store.state.jumpPageData.deviceData.length === 0 || type === 'refresh') {
          console.log('进入设备请求判断')
          //发送设备列表请求
          this.$api.devlist.devs_refresh().then(res => {
            console.log(res, '获取设备列表数据')
            this.devlist_get_ack(res)
          })
        } else {
          this.devlist_get_ack(this.$store.state.jumpPageData.deviceData)
        }

      }
    },
    devlist_get_ack (data) { // 设备列表数据整理并存储
      console.log("进入devlist_get_ack回调", data)
      let flag = 1 //从播放页面返回的标记，不发送cfsf请求
      if (data) {
        this.$store.dispatch('setDeviceData', data)
      } else {
        data = this.$store.state.jumpPageData.deviceData;
        flag = 0
      }
      for (let key in data) {
        this.search_sort[key] = this.$store.state.user.name + "_" + data[key].sn + "_sort"
        this.search_tree[key] = this.$store.state.user.name + "_" + data[key].sn + "_tree"
      }
      console.log(this.$store.state.jumpPageData.supportTreeFlag, 'supportTreeFlag')
      if (this.$store.state.jumpPageData.supportTreeFlag && flag === 1) { //是不是支持树状结构
        console.log('是否为树形结构')
        this.get_service_record_list(0, data)
      } else if (this.$store.state.jumpPageData.supportTreeFlag && flag === 0) { // 从播放页面返回，不发cfsf请求
        let back_flag = sessionStorage.getItem("back_flag")
        if (back_flag === null || !back_flag) {
          this.filterData = data // 解决返回后搜索设备功能无效问题
          this.tree_list(this.tree_back_data)
          this.device_list(this.tree_back_data)
        } else {
          let back_data = []
          let getNickRecord = sessionStorage.getItem("saveNickRecord")
          for (let m = 0; m < data.length; m++) {
            if (data[m].nick.indexOf(getNickRecord) > -1) {
              back_data.push(data[m])
            }
          }
          this.filterData = data; // 解决返回后搜索设备功能无效问题
          this.tree_list(this.tree_back_data)
          this.device_list(back_data)
        }
      } else {
        this.devlistData = this.$store.state.jumpPageData.deviceData;
        this.searchData = data
        this.filterData = data
        this.device_list(data)
      }
    },
    device_list (data, searchId) { // 设备列表渲染
      console.log(data, 'device_list_data')
      this.dev_list_dom = [] // 清空设备列表数组
      this.dev_list_dom_box = [] // 清空云盒子设备列表数组
      this.publicFunc.closeBufferPage()
      let search_id = searchId ? searchId : ""
      if (data && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].type === 'IPC') {
            this.ipc_num = 1
            data[i].play = 0
            data[i].img = 0
            this.dev_list_dom.push(data[i])
          }
          if (data[i].type === 'BOX') {
            this.box_num = 1
            data[i].play = 0
            data[i].img = 0
            this.dev_list_dom_box.push(data[i])
          }
        }
        this.devlistEmptyFlag = false
      } else {
        this.devlistEmptyFlag = true
      }
      if (this.$store.state.jumpPageData.localFlag) {
        this.device_event()
      } else {
        this.device_list_load()
      }
    },
    device_list_load () { // 设备块大小设置
      let _this = this
      let imgWidth = this.autoImgWidth
      imgWidth = parseFloat(imgWidth) / 100
      let client_width = document.getElementById("vimtag_device_list_box") ? document.getElementById("vimtag_device_list_box").offsetWidth : null
      let dev_list_dom_width = client_width * imgWidth
      let dev_list_dom_height = dev_list_dom_width / 16 * 9 + 34
      let client_height = window.innerHeight
      let x_num = parseInt(client_width / dev_list_dom_width)
      let y_num = parseInt(client_height / dev_list_dom_height)
      let num = x_num * y_num
      let stop_scroll = null
      let asnyc_time = this.$store.state.jumpPageData.autoPlayFlag ? 2000 : 100
      stop_scroll = setInterval(() => {
        clearInterval(stop_scroll)
        this.device_event(0, num)
      }, asnyc_time)
      window.onscroll = () => {
        if (stop_scroll) {
          clearInterval(stop_scroll)
        }
        if (document.getElementById("vimtag_device_list_box")) {
          let scrollTop = document.documentElement.scrollTop
          if (this.$store.state.jumpPageData.autoPlayFlag) {
            stop_scroll = setInterval(() => {
              clearInterval(stop_scroll)
              let top = scrollTop - 111
              let show_height = Math.ceil(top / dev_list_dom_height) // 从第几行开始显示
              this.device_event((show_height * x_num), num)
            }, asnyc_time)
          } else {
            clearInterval(stop_scroll)
            let top = scrollTop - 111
            let show_height = Math.ceil(top / dev_list_dom_height) // 从第几行开始显示
            this.device_event((show_height * x_num), num)
          }
        }
      }
    },
    device_event (n, num) { //n为第几个开始，num为显示的个数 每行显示设备数量以及设备列表数据中第几个开始展示
      console.log(n, num, 'n_num')
      let length
      let _this = this
      let camera_sign_picture_length = document.getElementsByClassName("camera_sign_picture_div").length
      if (this.$store.state.jumpPageData.localFlag) {
        n = 0
        length = camera_sign_picture_length
      } else {
        length = n + num > camera_sign_picture_length ? camera_sign_picture_length : n + num;
      }
      //add list click event
      for (let i = 0; i < camera_sign_picture_length; i++) {
        let l_dom_device_list_img = document.getElementsByClassName("camera_sign_picture_div")[i].parentNode.parentNode;
        let device_sn = l_dom_device_list_img.getAttribute("sn")
        // let device_info = mcloud_agent.devs
        if (i >= n && i < length) {
          if (l_dom_device_list_img.getAttribute("state") === "Online") {
            if (_this.$store.state.jumpPageData.localFlag === 1) {
              if (l_dom_device_list_img.getAttribute("dtype") === "IPC") {
                let local_play_data = {};
                local_play_data.addr = l_dom_device_list_img.getAttribute("addr");
                local_play_data.sn = l_dom_device_list_img.getAttribute("sn");
                local_play_data.password = sessionStorage.getItem("pass_" + local_play_data.sn);
                local_play_data.dom = $(".camera_sign_picture_div")[i].parentNode.childNodes[1];
                local_play_data.profile_token = "p3";
                local_play_data.func = function (msg) {
                  if (msg.result) {
                    _this.publicFunc.msg_tips({ msg: mcs_invalid_password, type: "error", timeout: 3000 })
                  }
                }
                msdk_ctrl({ type: "local_device_play", data: local_play_data }); // 本地化接口暂缓
              } else if (l_dom_device_list_img.getAttribute("dtype") === "BOX") {
                let local_play_data = {};
                local_play_data.addr = l_dom_device_list_img.getAttribute("addr");
                local_play_data.sn = l_dom_device_list_img.getAttribute("sn");
                local_play_data.password = sessionStorage.getItem("pass_" + local_play_data.sn);
                local_play_data.dom = $(".camera_sign_picture_div")[i].parentNode.childNodes[1];
                local_play_data.profile_token = "p3";
                local_play_data.func = function (msg) {
                  if (msg.result) {
                    this.publicFunc.msg_tips({ msg: mcs_invalid_password, type: "error", timeout: 3000 })
                  }
                };
                msdk_ctrl({ type: "local_box", data: local_play_data }); // 本地化接口暂缓
              }
            } else {
              if (l_dom_device_list_img.getAttribute("dtype") === "IPC") {
                if (this.$store.state.jumpPageData.autoPlayFlag) {
                  let is_play = l_dom_device_list_img.getAttribute("play");
                  if (is_play === 0) {
                    $($(".camera_sign_picture_div")[i].childNodes[0]).hide();
                    $(".camera_sign_picture_div")[i].childNodes[0].src = "";
                    l_dom_device_list_img.setAttribute("play", 1)
                    this.$api.devlist.play({
                      dom: $(".camera_sign_video")[i],
                      sn: l_dom_device_list_img.getAttribute("sn"),
                      profile_token: "p2"
                    }).then(res => {
                      console.log(res, '播放res')
                    })
                  }
                } else {
                  let is_img = l_dom_device_list_img.getAttribute("img");
                  l_dom_device_list_img.setAttribute("img", 1)
                  if (is_img == 0) {   //6.5.2
                    this.$api.devlist.load_noid_img({
                      refresh: this.pageObj.refresh ? 1 : 0,
                      sn: device_sn,
                      num: i,
                      dom: document.getElementsByClassName('device_list_img')
                    })
                  }
                }
              } else {
                let is_img = l_dom_device_list_img.getAttribute("img");
                l_dom_device_list_img.setAttribute("img", 1)
                if (is_img == '0') {
                  this.$api.devlist.load_noid_img({
                    refresh: this.pageObj.refresh ? 1 : 0,
                    sn: device_sn,
                    num: i,
                    dom: document.getElementsByClassName('device_list_img')
                  })
                }
              }
            }
          }
        } else {
          if (l_dom_device_list_img.getAttribute("dtype") === "IPC") {
            let is_play = l_dom_device_list_img.getAttribute("play");
            if (is_play == 1) {
              l_dom_device_list_img.setAttribute("play", 0)
              $(".camera_sign_video")[i].innerHTML = null;
              $($(".camera_sign_picture_div")[i].childNodes[0]).show();
              this.$api.devlist.load_noid_img({
                refresh: this.pageObj.refresh ? 1 : 0,
                sn: device_sn,
                num: i,
                dom: document.getElementsByClassName('device_list_img')
              })
            }
          }
        }
      }
    },
    getDropdownDom () { // 获取wifi下拉列表dom结构
      this.publicFunc.showBufferPage()
      this.$api.devlist.wifi_get({ // 设备可连接wifi获取
        sn: this.add_device_input_id
      }).then(res => {
        this.publicFunc.closeBufferPage()
        if (res) {
          this.$set(this.addDeviceModelObj, 'wifiListArr', res)
        } else {
          this.publicFunc.msg_tips({ msg: res.result, type: "error", timeout: 3000 })
        }
      })
    },
    skipToNick () { // 跳转至设置昵称页面
      this.$set(this.addDeviceModelObj, 'addDeviceBodyFlag', 'setDeviceNick') // 展示设置设备昵称页面
      this.$set(this.addDeviceModelObj, 'menuTitle', mcs_nick_modify) // 设置设备昵称页面顶部菜单标题
    },
    skipToZone () { // 跳转至设置时区页面
      let _this = this
      this.$set(this.addDeviceModelObj, 'addDeviceBodyFlag', 'setDeviceZone') // 展示设置设备时区页面
      this.$set(this.addDeviceModelObj, 'menuTitle', mcs_settings + mcs_time_zone) // 设置设备时区页面顶部菜单标题
      this.publicFunc.showBufferPage() // 展示遮罩层
      this.$api.devlist.time_zone_get({ // 设备时区获取
        sn: this.add_device_input_id
      }).then(res => {
        let wifi_Dom
        if (res) {
          this.$api.devlist.time_get({ // 设备详细时间获取
            sn: this.add_device_input_id
          }).then(res_time_get => {
            time_get_ack(res_time_get)
            this.publicFunc.closeBufferPage()
          })
          for (let i = 0; i < res.length; i++) {
            let zone_name_tmp = res[i].city.replace(/\(|&|\)|_/g, "")
            let zone_name = eval("mcs_timezone_" + zone_name_tmp)
            res[i].zone_name = zone_name
          }
          this.$set(this.addDeviceModelObj, 'timeZoneArr', res)
        }
      })
      function time_get_ack (msg) {
        let timezone_name = msg.timezone
        let timezone_tmp = msg.timezone.replace(/\(|&|\)|_/g, "")
        timezone_tmp = meval("mcs_timezone_" + timezone_tmp) || timezone_tmp
        timezone_tmp = timezone_tmp.length < 10 ? timezone_tmp : (timezone_tmp.substr(0, 10) + "...")
        _this.$set(_this.addDeviceModelObj, 'timeZoneName', timezone_tmp)
      }
      function meval (s) {
        try {
          return eval("(" + s + ")")
        } catch (e) {
          return null
        }
      }
    },
    // 点击事件处理函数
    editClick () { // 点击菜单编辑按钮
      if ($(".device_list_del_ico").css("display") === "none") {
        $(".device_list_del_ico").show();
      } else {
        $(".device_list_del_ico").hide();
      }
      if (this.$store.state.jumpPageData.supportTreeFlag) {
        if ($(".device_list_sort_box").css("display") === "none") {
          $(".device_list_sort_box").show();
        } else {
          $(".device_list_sort_box").hide();
        }
      }
    },
    addDevClick () { // 添加设备点击事件
      // this.addDeviceTime = new Date().getTime();//日志 点击添加设备时间 暂时注释后续添加日志记录
      this.addHoverflag = false // 关闭添加设备hover下拉提示框
      this.addDeviceModel = true // 展示添加设备弹窗
      this.$set(this.addDeviceModelObj, 'addDeviceBodyFlag', 'chooseDevice') // 展示产品选择页面
      this.$set(this.addDeviceModelObj, 'menuTitle', mcs_choose_device_type) // 设置产品选择页面顶部菜单标题
    },
    chooseDeviceType (item) { // 添加设备时选择设备类型,跳转至填写设备Id页面
      this.$set(this.addDeviceModelObj, 'addDeviceBodyFlag', 'inputDeviceId') // 切换至填写设备Id页面
      this.$set(this.addDeviceModelObj, 'deviceType', item.type) // 存储选择的设备类型 item.type
      this.$set(this.addDeviceModelObj, 'typeUrl', require("@/assets/device/id_" + item.type + ".png")) // 设置动态切换的图片地址
      this.$set(this.addDeviceModelObj, 'menuTitle', mcs_action_add_device) // 设置填写设备Id页面顶部菜单标题
    },
    inputDeviceIdNext () { // 输入设备Id点击确定事件
      console.log(this.add_device_input_id, 'input_value')
      let reg = new RegExp(/1jfie(.){8}$/i) // 正则判断匹配输入的设备号
      let device_existed = 0
      // let add_device_stat 日志用暂时注释
      let deviceType = this.addDeviceModelObj.deviceType
      if (!this.add_device_input_id.match(reg)) { // 设备号正则校验
        // console.log('匹配失败')
        this.publicFunc.msg_tips({ msg: mrs_device_ID_input_error, type: "error", timeout: 3000 })
        return
      }
      for (let i = 0; i < this.$store.state.jumpPageData.deviceData.length; i++) { // 在vuex中存储的设备列表中对比是否存在该设备
        if (this.$store.state.jumpPageData.deviceData[i].sn === this.add_device_input_id) {
          device_existed = 1
        }
      }
      if (device_existed) { // 设备列表中存在该设备
        // add_device_stat = 'lan' // 日志 本地设备
        this.publicFunc.msg_tips({ msg: mcs_device_existed, type: "warning", timeout: 3000 })
      } else { // 其他情况校验该设备是否在线
        this.publicFunc.showBufferPage() // 展示遮罩层
        this.$api.devlist.devlist_check_online({ // 检测设备是否在线(密码为默认固定值)
          sn: this.add_device_input_id,
          pass: "1pl%*.1"
        }).then(res => {
          this.publicFunc.closeBufferPage() // 关闭遮罩层
          if (res === mcs_device_not_exist) { // 设备不存在
            this.publicFunc.msg_tips({ msg: res, type: "error", timeout: 3000 })
          } else if (res === "user.offline") { // 设备不在线时 进入引导页面
            // add_device_stat = 'offline' // 日志 设备状态
            this.$set(this.addDeviceModelObj, 'addDeviceBodyFlag', 'addOfflineDevice') // 切换至添加离线设备页面
            if (deviceType === 'cm1' || deviceType === 'm1' || deviceType === 'fisheye') { // 这三种类型的设备不能在网页和客户端进行添加
              this.$set(this.addDeviceModelObj, 'typeUrl', require("@/assets/device/" + deviceType + ".png")) // 设置动态切换的图片地址
              this.$set(this.addDeviceModelObj, 'menuTitle', mcs_action_add_device) // 设置添加离线设备页面顶部菜单标题
            } else { // 其余种类的设备加载动图地址
              this.$set(this.addDeviceModelObj, 'typeUrl', require("@/assets/device/" + deviceType + ".gif")) // 设置动态切换的图片地址
              if (deviceType === "b1" || deviceType === "b2" || deviceType === "b3") { // 摄像头类型为b1,b2,b3时
                this.$set(this.addDeviceModelObj, 'devicesBoxInfo', mcs_device_outdoor_camera_connect_power) // 添加b1,b2,b3提示文字内容
              } else if (deviceType === "s1") {
                this.$set(this.addDeviceModelObj, 'devicesBoxInfo', mcs_device_box_connect_power) // 添加s1云盒子提示文字内容
              } else { // 其他类型设备
                this.$set(this.addDeviceModelObj, 'offlineOtherflag', true) // 添加单独喇叭图标标识
                this.$set(this.addDeviceModelObj, 'devicesBoxInfo', mcs_normal_device_connect_power + mcs_camera_turn_on_voice) // 添加其他类型设备提示文字内容
              }
              this.$set(this.addDeviceModelObj, 'menuTitle', mcs_connect_power) // 设置添加离线设备页面顶部菜单标题
            }
          } else if (res === "") { // 设备在线 进入输入设备密码页面
            // add_device_stat = 'online' // 日志
            this.$set(this.addDeviceModelObj, 'addDeviceBodyFlag', 'inputDevicePassword') // 切换至输入设备密码页面
            this.$set(this.addDeviceModelObj, 'menuTitle', mcs_action_add_device) // 设置输入设备密码页面顶部菜单标题
          } else { // 其他情况预留 直接输入返回信息方便报错判断
            this.publicFunc.msg_tips({ msg: res, type: "error", timeout: 3000 })
          }
        })
      }
    },
    addOfflineDevice () { // 输入链接电源页面点击下一步 进入连接网络页面
      this.$set(this.addDeviceModelObj, 'addDeviceBodyFlag', 'connectNet') // 切换至链接网络提示页面
      this.$set(this.addDeviceModelObj, 'menuTitle', mcs_ethernet_configuration) // 设置连接以太网页面顶部菜单标题
      this.$set(this.addDeviceModelObj, 'typeUrl', require("@/assets/device/net_" + this.addDeviceModelObj.deviceType + ".png")) // 设置动态切换的图片地址
      this.$set(this.addDeviceModelObj, 'connectNetTime', 60) // 设置链接设备倒计时
      let showTime = this.addDeviceModelObj.connectNetTime
      let timer1 = setInterval(() => { // 倒计时出现负数(360浏览器出现) 修改方法两种 1.将定时器清除判断放入timer1中 2.在判断时提前-4秒防止360浏览器定时不准的问题
        this.$set(this.addDeviceModelObj, 'connectNetTime', --showTime) // 倒计时实时刷新显示
        if (this.addDeviceModelObj.connectNetTime <= 0) { // 倒计时为0 终止定时器并跳转至配置失败页面
          clearInterval(timer1)
          clearInterval(timer2)
          this.$set(this.addDeviceModelObj, 'addDeviceBodyFlag', 'connectFail') // 等于0还没配置上，跳转到配置失败页面
          this.$set(this.addDeviceModelObj, 'menuTitle', mcs_finish) // 设置配置失败页面顶部菜单标题
        }
      }, 1000);
      let timer2 = setInterval(() => { // 每5秒重新调用查询设备是否上线接口
        this.$api.devlist.devlist_check_online({ // 验证设备是否在线
          sn: this.add_device_input_id,
          pass: "1pl%*.1"
        }).then(res => {
          if (res === "") {
            clearInterval(timer1)
            clearInterval(timer2)
            // 配置成功跳转至密码输入页面
            this.$set(this.addDeviceModelObj, 'addDeviceBodyFlag', 'inputDevicePassword') // 切换至输入设备密码页面
            this.$set(this.addDeviceModelObj, 'menuTitle', mcs_action_add_device) // 设置输入设备密码页面顶部菜单标题
          }
        })
      }, 5000)
      this.connectNetTimeArr = [timer1, timer2] // 全局存储定时器标识
    },
    inputDevicePasswordNext () { // 输入设备密码页面点击下一步
      let password = this.add_device_password
      if (!password) { // 未输入密码
        this.publicFunc.msg_tips({ msg: mcs_the_password_is_empty, type: "error", timeout: 3000 })
      } else {
        // 展示遮罩层
        this.publicFunc.showBufferPage()
        this.$api.devlist.dev_add({ // 调用添加设备接口
          sn: this.add_device_input_id,
          password: password
        }).then(res => {
          this.publicFunc.closeBufferPage()
          if (res && res.result === "") {
            if (password.length > 5) {
              if (res.info && res.info.p) {
                // 暂时不清楚判断参数的含义,但如果设备在线并且密码不为admin则不去设置任何关于摄像头的参数直接添加成功
                for (let k = 0, length = res.info.p.length; k < length; k++) {
                  if (res.info.p[k].n === "s.wifs" && (res.info.p[k].v === "srvok")) {
                    this.closeModel() // 关闭弹窗
                    break
                  } else if (res.info.p[k].v === "none") {
                    this.closeModel() // 关闭弹窗
                    break
                  } else if (res.info.p[k].n === "s.wifs") {
                    this.closeModel() // 关闭弹窗
                    break
                  } else if (res.info.p[k].n === "s.eye") {//鱼眼
                    this.closeModel() // 关闭弹窗
                    break
                  }
                }
                this.closeModel() // 关闭弹窗
                this.publicFunc.msg_tips({ msg: mcs_add_successfully, type: "success", timeout: 3000 }) // 添加成功
              } else {
                this.closeModel() // 关闭弹窗
              }
            }
            else { //如果密码是admin时，修改密码
              this.$set(this.addDeviceModelObj, 'addDeviceBodyFlag', 'editDevicePassword') // 切换至修改密码页面
              this.$set(this.addDeviceModelObj, 'menuTitle', mcs_action_add_device) // 设置修改密码页面顶部菜单标题
            }
          } else if (res.result == "accounts.pass.invalid") {
            this.publicFunc.msg_tips({ msg: mcs_invalid_password + ".", type: "error", timeout: 3000 })
          } else if (res.result == "subdev.exceed.device") {
            this.publicFunc.msg_tips({ msg: mcs_devices_in_the_account_overrun + ".", type: "error", timeout: 3000 })
          } else if (res.result == "server.app.invalid") { // app限制
            this.publicFunc.msg_tips({ msg: mcs_device_add_app_invalid, type: "error", timeout: 3000 })
          } else if (res.result == "server.loc.invalid") { // 地区限制
            this.publicFunc.msg_tips({ msg: mcs_device_add_loc_invalid, type: "error", timeout: 3000 })
          } else { // 其他情况直接打印报错信息
            this.publicFunc.msg_tips({ msg: res.result, type: "error", timeout: 3000 })
          }
        })
      }
    },
    editDevicePasswordNext () { // 修改设备密码点击下一步
      let password = this.edit_password_1st
      let re_password = this.edit_password_2nd
      let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,32}$/
      if (!password || !re_password) {
        this.publicFunc.msg_tips({ msg: mcs_the_password_is_empty, type: "error", timeout: 3000 })
      } else if (!reg.exec(password)) { //密码为8到32位的数字和字母
        this.publicFunc.msg_tips({ msg: mcs_password_range_hint, type: "error", timeout: 3000 })
      } else if (password != re_password) { //密码不一致
        this.publicFunc.msg_tips({ msg: mcs_two_password_input_inconsistent, type: "error", timeout: 3000 })
      } else {
        this.$api.devlist.dev_passwd_set({ // 设备密码设置
          sn: this.add_device_input_id,
          old_pass: this.add_device_password, // 登录设备页面中输入的密码(旧密码)
          new_pass: password
        }).then(res => {
          if (res) {
            this.$api.devlist.dev_add({ // 添加设备
              sn: this.add_device_input_id,
              password: password
            }).then(res => { // 跳转至设置wifi页面
              this.$set(this.addDeviceModelObj, 'addDeviceBodyFlag', 'setDeviceWifi') // 切换至设置wifi页面
              this.$set(this.addDeviceModelObj, 'menuTitle', mcs_action_add_device) // 设置修改密码页面顶部菜单标题
              this.getDropdownDom() // 调用获取下拉列表内容函数
              // add_device_set_wifi(res)
            })
          } else {
            this.publicFunc.msg_tips({ msg: mcs_failed_to_set_the, type: "error", timeout: 3000 })
          }
        })
      }
    },
    chooseWifi (wifiId) { // 选择wifi下拉框点击事件
      this.$set(this.addDeviceModelObj, 'wifiListFlag', false) // 关闭下拉列表弹窗
      let select_wifi = wifiId.length < 20 ? wifiId : (wifiId.substr(0, 20) + "...")
      this.$set(this.addDeviceModelObj, 'wifiName', select_wifi) // 关闭下拉列表弹窗
    },
    setDeviceWifiNext () { // 选择wifi点击下一步
      let wifi_password = this.input_wifi_password
      let wifi_ssid = this.addDeviceModelObj.wifiName
      // 展示遮罩层
      this.publicFunc.showBufferPage()
      this.$api.devlist.wifi_set({
        sn: this.add_device_input_id,
        ssid: wifi_ssid,
        key: wifi_password
      }).then(res => {
        console.log(res, 'setWifiRes')
        this.publicFunc.closeBufferPage()
        if (res.type === 'error') {
          this.publicFunc.msg_tips({ msg: res.msg, type: res.type, timeout: 3000 })
        } else if (res.type === 'success') {
          this.publicFunc.msg_tips({ msg: res.msg, type: res.type, timeout: 3000 })
          this.skipToNick() // 跳转至设置昵称页面
        } else {
          this.publicFunc.msg_tips({ msg: res.msg, type: res.type, timeout: 3000 })
          this.skipToNick() // 跳转至设置昵称页面
        }
      })
    },
    chooseTimeZone (item) { // 选择时区下拉框点击事件
      this.$set(this.addDeviceModelObj, 'timeZoneListFlag', false) // 关闭下拉列表弹窗
      let timezone_tmp = item.zone_name.length < 10 ? item.zone_name : (item.zone_name.substr(0, 10) + "...")
      this.$set(this.addDeviceModelObj, 'timeZoneName', timezone_tmp) // 时区选择内容
      this.$set(this.addDeviceModelObj, 'chooseZoneCity', item.city) // 设置时区用到的值
    },
    setDeviceNickNext () { // 填写设备昵称点击下一步
      let nick = this.input_device_nick
      if (!nick) {
        this.publicFunc.msg_tips({ msg: mcs_nick_not_empty, type: "error", timeout: 3000 })
      } else {
        this.$api.devlist.nick_set({ // 设置设备昵称
          sn: this.add_device_input_id,
          nick: nick
        }).then(res => {
          this.skipToZone() // 跳转至时区设置页面
          // add_device_set_zone(res)
        })
      }
    },
    setDeviceZoneFinish () { // 设置设备时区完成
      this.publicFunc.showBufferPage()
      this.$api.devlist.time_set({ // 设置设备时区及时间
        sn: this.add_device_input_id,
        timezone: this.addDeviceModelObj.chooseZoneCity
      }).then(res => {
        if (res === 1) {
          this.publicFunc.msg_tips({ msg: mcs_failed_to_set_the, type: "error", timeout: 3000 })
        } else {
          this.publicFunc.closeBufferPage()
          this.publicFunc.msg_tips({ msg: mcs_set_successfully, type: "success", timeout: 3000 }) //设置完时区提示
          this.closeModel() // 关闭弹窗
          this.get_dev_list('refresh') // 刷新设备列表
        }
      })
    },
    forgetDevicePassword () { // 点击忘记设备密码
      this.$set(this.addDeviceModelObj, 'addDeviceBodyFlag', 'forgetDevicePassword') // 展示设备忘记密码页面
      this.$set(this.addDeviceModelObj, 'menuTitle', mcs_forgot_your_password) // 设置设备忘记密码页面顶部菜单标题
      this.$set(this.addDeviceModelObj, 'typeUrl', require("@/assets/device/reset_" + this.addDeviceModelObj.deviceType + ".png")) // 设置动态切换的图片地址
      let deviceType = this.addDeviceModelObj.deviceType
      if (deviceType === 'b1' || deviceType === 'b2' || deviceType === 'b3') {
        this.$set(this.addDeviceModelObj, 'forgetInfo', mcs_bseries_forget_password) // 设置设备忘记密码页面info提示语
      } else if (deviceType === 'p1' || deviceType === '361') {
        this.$set(this.addDeviceModelObj, 'forgetInfo', mcs_press_hole_restore_to_reset_password) // 设置设备忘记密码页面info提示语
      } else {
        this.$set(this.addDeviceModelObj, 'forgetInfo', mcs_press_button_restore_to_reset_password) // 设置设备忘记密码页面info提示语
      }
    },
    clickQuestion () { // 配置失败点击问号图标
      this.$set(this.addDeviceModelObj, 'addDeviceBodyFlag', 'connectFailReason')
      this.$set(this.addDeviceModelObj, 'menuTitle', mcs_help) // 设置帮助页面顶部菜单标题
    },
    closeModel () { // 关闭弹窗
      this.addDeviceModelObj = {} // 清空弹窗所需对象 解决再次打开后的污染
      this.addDeviceModel = false // 关闭弹窗
      this.add_device_input_id = null // 重置输入的设备Id
      this.add_device_password = null // 重置设备输入密码 Input框value
      this.edit_password_1st = null // 重置修改密码第一次输入 Input框value
      this.edit_password_2nd = null // 重置修改密码第二次输入 Input框value
      this.input_wifi_password = null // 重置wifi密码输入
      this.input_device_nick = null // 重置设备昵称输入
      for (let item of this.connectNetTimeArr) { // 终止等待网络链接的定时器
        clearInterval(item)
      }
    },
    addDeviceModelBack () { // 添加设备弹窗返回 (后续可以添加返回页标题内容)
      let backListObj = {
        'inputDeviceId': 'chooseDevice',
        'addOfflineDevice': 'inputDeviceId',
        'connectNet': 'addOfflineDevice',
        'connectFail': 'connectNet',
        'connectFailReason': 'connectFail',
        'inputDevicePassword': 'inputDeviceId',
        'editDevicePassword': 'inputDevicePassword',
        'setDeviceWifi': 'inputDevicePassword',
        'setDeviceNick': 'setDeviceWifi',
        'setDeviceZone': 'setDeviceNick',
        'forgetDevicePassword': 'inputDevicePassword',
        'offlineDeviceHelp': 'offlineDeviceAlert'
      }
      let modelObj = this.addDeviceModelObj
      let backPageFlag = backListObj[this.addDeviceModelObj.addDeviceBodyFlag]
      this.$set(this.addDeviceModelObj, 'addDeviceBodyFlag', backPageFlag) // 点击返回跳转的页面
      console.log(modelObj)
    },
    delDevClick () { // 点击设备的删除图标(未对接)
      $(".device_list_del_ico").on('click', function () {
        let _this_sn = this.parentNode.parentNode.getAttribute("sn");
        let _this_parent = this.parentNode.parentNode;
        _this.publicFunc.delete_tips({
          content: mcs_delete_device + "?", func: function () {
            _this.$api.devlist.dev_del({
              sn: _this_sn,
              dom: _this_parent
            }).then(res => {
              _this.publicFunc.msg_tips({
                msg: res.msg,
                type: res.type,
                timeout: 3000
              })
              if (res.type === 'success') {
                _this.$api.devlist.devs_refresh().then($(res.dom).hide())
              }
            })
          }
        })
      })
    },
    clickCameraSignPic (item) { // 点击设备标记图片
      console.log(item, 'item')
      if (item.stat === "Online") { // 设备在线
        //State Normal equipment click event
        this.$store.dispatch('setSelectDeviceIpc', item.sn) // 点击时获取sn
        this.$store.dispatch('setSelectNick', item.nick) // 点击时获取nick
        let type = item.type
        let state = item.stat
        let addr = item.addr
        if (state === "Online" && type === "IPC") {
          this.pageObj.addr = addr
          this.$router.push({ name: 'play', params: this.pageObj })
        } else if (state === "Online" && type === "BOX") {
          let box_live = item.box_live // 获取云盒子是否支持实时播放
          this.pageObj.addr = addr
          this.pageObj.box_live = box_live
          this.$router.push({ name: 'boxlist', params: this.pageObj })
        }
      } else if (item.stat === "InvalidAuth") { // 身份无效
        this.$store.dispatch('setSelectDeviceIpc', item.sn) // 点击时存储sn
        let type = item.type
        let addr = item.addr
        let domParentChild

        if (this.$store.state.jumpPageData.localFlag) { // 本地化内容暂缓
          for (i = 0; i < this.dev_list_dom.length; i++) {
            if (item.sn === dev_list_dom[i].sn) {
              domParentChild = document.getElementsByClassName('camera_sign_picture_div')[i].parentNode.childNodes[1]
            }
          }
          if (type === "IPC") {
            create_input_passwrod_box({ sn: this.$store.state.jumpPageData.selectDeviceIpc, addr: addr, dom: domParentChild, type: "IPC" })
          } else if (type === "BOX") {
            create_input_passwrod_box({ sn: this.$store.state.jumpPageData.selectDeviceIpc, addr: addr, dom: domParentChild, type: "BOX" })
          }
        } else { // 展示输入密码弹框
          this.addDeviceModel = true
          this.add_device_input_id = this.$store.state.jumpPageData.selectDeviceIpc
          this.$set(this.addDeviceModelObj, 'addDeviceBodyFlag', 'inputDevicePassword') // 切换至输入设备密码页面
          this.$set(this.addDeviceModelObj, 'menuTitle', mcs_action_add_device) // 设置输入设备密码页面顶部菜单标题
          this.$set(this.addDeviceModelObj, 'deviceType', type) // 设置设备类型
          // create_add_devices_box({ parent: $("#add_device_page"), sn: this.$store.state.jumpPageData.selectDeviceIpc });
        }
      } else if (item.stat === "Offline") { // 此处暂留 还未加入添加设备Dom
        this.$store.dispatch('setSelectDeviceIpc', item.sn) // 点击时存储sn
        let type = item.type
        let state = item.stat
        let addr = item.addr
        let nick = item.nick
        this.addDeviceModel = true
        this.add_device_input_id = this.$store.state.jumpPageData.selectDeviceIpc
        this.$set(this.addDeviceModelObj, 'addDeviceBodyFlag', 'offlineDeviceAlert')
        this.$set(this.addDeviceModelObj, 'deviceType', type) // 设置设备类型
        this.$set(this.addDeviceModelObj, 'menuTitle', nick) // 设置设备昵称
      }
    },
    delDevice (item) { // 点击删除设备图标
      let _this_sn = item.sn
      this.publicFunc.delete_tips({
        content: mcs_delete_device + "?", func: () => {
          this.$api.devlist.dev_del({
            sn: _this_sn,
          }).then(res => {
            this.publicFunc.msg_tips({
              msg: res.msg,
              type: res.type,
              timeout: 3000
            })
            if (res.type === 'success') {
              this.get_dev_list('refresh') // 刷新设备列表
            }
          })
        }
      })
    },
    // 点击事件处理函数结束
    add_device_connect_power_event () {
      $("#add_devices_box_back").click(function () {
        add_device_input_id();
      })
      $("#add_devices_img").click(function () { //缺少删除步骤
        $('body').append('<embed src="./theme/device/startSound.mp3" autostart="true" hidden="true" loop="false">');
      });
      $("#add_devices_box_close").click(function () {
        close_add_page('add_dev');
      })
      $("#add_device_submit").click(add_device_connect_ethernet())
    },
    // 树状列表
    get_service_record_list (n, data) {
      let s_length = this.search_sort.length
      let tmp_search_sort = []
      let tmp_search_tree = []
      let back_flag
      if (s_length > n * 100) {
        let j = 0;
        for (let i = n * 100; i < s_length && i < (n + 1) * 100; i++) {
          tmp_search_sort[j] = this.search_sort[i]
          tmp_search_tree[j] = this.search_tree[i]
          j++
        }
        this.$api.devlist.service_record_get({ // 获取服务记录接口
          keys: tmp_search_sort
        }).then(res => {
          console.log(res, 'service_record_get_   sort')
          if (res && res.ret === "") {
            for (let i = n * 100; i < res.datas.length + n * 100; i++) {
              data[i].sort = parseInt(res.datas[i]);
            }
          }
          this.$api.devlist.service_record_get({
            keys: tmp_search_tree
          }).then(res_tree => {
            if (res_tree && res_tree.ret === "") {
              for (let w = n * 100; w < res_tree.datas.length + n * 100; w++) {
                if (n == 0) {
                  data[w].tree = (res_tree.datas[w] !== "") ? res_tree.datas[w] : data[w].nick
                } else {
                  data[w].tree = (res_tree.datas[w - n * 100] !== "") ? res_tree.datas[w - n * 100] : data[w].nick
                }
              }
            }
            this.get_service_record_list(++n, data)
          })
        })
      } else {
        data = data.sort(compare)
        console.log(data, 'sortAfterData')
        this.tree_back_data = data
        this.tree_list(data)
        this.devlistData = this.$store.state.jumpPageData.deviceData
        this.searchData = data
        this.filterData = data
        back_flag = sessionStorage.getItem("back_flag")
        if (back_flag === null || !back_flag) {
          // console.log(data, 'data1')
          this.device_list(data)
        } else {
          let back_data = []
          let getNickRecord = sessionStorage.getItem("saveNickRecord")
          for (let m = 0; m < data.length; m++) {
            if (data[m].nick.indexOf(getNickRecord) > -1) {
              back_data.push(data[m])
            }
            // console.log(data, 'data2')
            this.device_list(back_data)
          }
        }
      }
      function compare (obj1, obj2) { // compare 工具函数
        let val1 = obj1.sort;
        let val2 = obj2.sort;
        if (val1 < val2 || (!isNaN(val1)) && (isNaN(val2))) {
          return -1;
        } else if (val1 > val2 || (!isNaN(val2)) && (isNaN(val1))) {
          return 1;
        } else {
          return 0;
        }
      }
    },
    tree_list (data) {
      let _this = this
      console.log(data, 'tree_list_data')
      this.treeFlag = true
      let height = document.documentElement.clientHeight
      this.treeBoxStyle = { "height": (height - 82) + "px" }
      this.treeBoxBtnStyle = { "margin-top": ((height - 82) / 2) + "px" }
      window.onscroll = () => {
        if (document.getElementById("device_list_tree")) {
          let scrollTop = document.documentElement.scrollTop
          if (scrollTop > 82) {
            this.treeBoxStyle = { "height": height + "px", "top": "0" }
          } else {
            this.treeBoxStyle = { "height": (height + scrollTop - 82) + "px", "top": (82 - scrollTop) + "px" }
          }
        }
      }
      let l_dom_device_list_tree_leaf = document.getElementById("device_list_tree_leaf")
      let data_1 = [], data_2 = []
      let req_data = []
      let tree_level = 0
      l_dom_device_list_tree_leaf.innerHTML = ""
      document.getElementById("device_list_tree_level_box").innerHTML = ""
      let tree_data_arr = []
      for (let i = 0; i < data.length; i++) {
        // tree_data_arr[i] = data[i].nick;
        tree_data_arr[i] = data[i].tree !== "" ? data[i].tree : data[i].nick
      }
      let data_1_pre = tree_data_arr // 解决sn名字不统一 树状结构变乱问题
      function change_data (arr) {
        let newarr = []
        for (let i = 0; i < arr.length; i++) {
          let text = arr[i]
          let re = /·|\s+/gi
          newarr[i] = text.replace(re, '.')
        }
        return newarr
      }
      data_1 = change_data(data_1_pre)
      console.log(data_1, "data_1")

      for (let k = 0; k < data_1.length; k++) {
        let tmp_tree_level = data_1[k].split('.').length - 2;
        let index = data_1[k].lastIndexOf('.');
        let parent_id = data_1[k].substring(index, 0);
        let show_id = data_1[k].substring(index + 1, data_1[k].length);
        console.log(tmp_tree_level, index, parent_id, show_id, 'show_id')

        if (tmp_tree_level > tree_level) { tree_level = tmp_tree_level; }
        let con = "";
        if (index === -1) {
          con = "<div class='tree_list_menu' child='" + data_1[k] + "'>" + show_id + "</div><div child='" + data_1[k] + "' id='" + data_1[k] + "_box' style='margin-left:20px;'></div>"
        }

        data_2[k] = {
          id: data_1[k],
          parent_id: parent_id,
          con: con
        }
      }
      console.log(data_2, tree_level, 'before_tree_recursion')
      for (let j = 0; j < data_2.length; j++) {
        this.tree_recursion(data_2[j], tree_level);
      }
      let l_dom_tree_list_menu = document.getElementsByClassName("tree_list_menu")
      for (let l = 0; l < l_dom_tree_list_menu.length; l++) {
        let child = l_dom_tree_list_menu[l].getAttribute("child")
        jQuery(l_dom_tree_list_menu[l]).before("<div class='tree_list_display tree_list_display_active' child='" + child + "'></div>")
        l_dom_tree_list_menu[l].onclick = function () {
          jQuery(".tree_list_menu").removeClass("tree_list_menu_active");
          jQuery("#device_list_tree_all").removeClass("tree_list_menu_active");
          jQuery(this).addClass("tree_list_menu_active");
          let nick = this.getAttribute("child");
          let saveNickRecord = sessionStorage.setItem("saveNickRecord", nick);
          let back_flag = sessionStorage.setItem("back_flag", true);
          let tree_scroll_height = sessionStorage.setItem("tree_scroll_height", this.offsetTop);
          req_data = [];
          for (let m = 0; m < data_1.length; m++) {
            if (data_1[m].indexOf(nick) > -1) {
              req_data.push(data[m])
            }
          }
          // console.log(req_data, "req_data")
          _this.device_list(req_data);
        }
      }
      //Open
      let l_dom_tree_list_display = document.getElementsByClassName("tree_list_display");
      for (let n = 0; n < l_dom_tree_list_display.length; n++) {
        l_dom_tree_list_display[n].onclick = function () {
          let is_display = jQuery(this).hasClass("tree_list_display_active")
          let child = this.getAttribute("child")
          if (is_display) {
            jQuery(this).removeClass("tree_list_display_active")
            // mlocal_storage.set("tree_"+child,1)
            jQuery(mx("#" + child + "_box")).slideUp()
          } else {
            jQuery(this).addClass("tree_list_display_active")
            // mlocal_storage.set("tree_"+child)
            jQuery(mx("#" + child + "_box")).slideDown()
          }
        }
        // let tree_step_type = l_dom_tree_list_display[n].getAttribute("child");
        // let tree_step = mlocal_storage.get("tree_"+tree_step_type);
        // if(tree_step){
        //     jQuery(l_dom_tree_list_display[n]).removeClass("tree_list_display_active");
        //     jQuery(mx("#"+tree_step_type+"_box")).hide();
        // }
      }
      let back_flag = sessionStorage.getItem("back_flag");//set scroll position
      if (back_flag && back_flag !== null) {
        let l_dom_device_list_tree = document.getElementById("device_list_tree");
        let scroll_height = sessionStorage.getItem("tree_scroll_height");
        l_dom_device_list_tree.scrollTop = scroll_height - 300;
      }//set scroll position

      //display tree
      mx("#device_list_tree_box_btn").onclick = function () {
        let is_display = jQuery("#device_list_tree").css("display");
        if (is_display == "none") {
          // g_treelist = 1;
          jQuery(this).css({ "background": "url(" + require('@/assets/device/tree_close.png') + ") no-repeat", "background-size": "100%" });
          jQuery("#device_list_tree").show()
          jQuery("#device_list_tree").animate({ "width": "120px", "padding-left": "10px", "padding-right": "10px" })
          jQuery("#vimtag_device_list_box").addClass("device_tree_class");
        } else {
          // g_treelist = 2;
          jQuery(this).css({ "background": "url(" + require('@/assets/device/tree_open.png') + ") no-repeat", "background-size": "100%" });
          jQuery("#device_list_tree").animate({ "width": "0px", "padding-left": "0px", "padding-right": "0px" }, function () { jQuery("#device_list_tree").hide() });
          jQuery("#vimtag_device_list_box").removeClass("device_tree_class");
        }
      }
      //select all ipc
      mx("#device_list_tree_all").onclick = function () { //点击设备列表全选
        jQuery(".tree_list_menu").removeClass("tree_list_menu_active");
        jQuery(this).addClass("tree_list_menu_active");
        sessionStorage.clear();
        _this.device_list(data);
      }
      for (let lv = 0; lv < tree_level; lv++) {
        mx("#device_list_tree_level_box").innerHTML += "<div class='device_list_tree_level'>" + (lv + 1) + "</div>";
      }
      for (let lvl = 0; lvl < tree_level; lvl++) {
        mx(".device_list_tree_level")[lvl].index = lvl;
        mx(".device_list_tree_level")[lvl].onclick = function () {
          jQuery(".tree_list_display_parent_" + this.index).children(".tree_list_display").click();
        }
      }
    },
    tree_recursion (obj, num) {
      // console.log(obj, num, 'tree_recursion')
      let getNickRecord = sessionStorage.getItem("saveNickRecord")
      let l_dom_device_list_tree_leaf = document.getElementById("device_list_tree_leaf")
      if (obj.parent_id === "") {
        l_dom_device_list_tree_leaf.innerHTML += obj.con
      } else if (document.getElementById(obj.parent_id + "_box")) {
        document.getElementById(obj.parent_id + "_box").innerHTML += obj.con
      } else {
        let last_p_num = obj.parent_id.lastIndexOf(".");
        let parent_id = obj.parent_id.substr(0, last_p_num);
        let show_id = obj.parent_id.substring(last_p_num + 1, obj.parent_id.length);
        if (document.getElementById(obj.parent_id + "_box")) {
          document.getElementById(parent_id + "_box").innerHTML += obj.con
        } else {
          let con = "<div id='" + parent_id + "_box' class='tree_list_display_parent_" + num + "'><div class='tree_list_menu' child='" + obj.parent_id + "'>" + show_id + "</div><div child='" + obj.parent_id + "' id='" + obj.parent_id + "_box' style='margin-left:20px;'>" + obj.con + "</div></div>";
          this.tree_recursion({ id: obj.parent_id, parent_id: parent_id, con: con }, --num);
        }
      }
      if (obj.id == getNickRecord) {
        let a = jQuery(".tree_list_menu");
        a.each(function (i) {
          if ($(this).attr("child") === obj.id) {
            jQuery(this).addClass("tree_list_menu_active")
            sessionStorage.setItem("back_flag", true)
          }
        })
      }
    },
    // 树状列表 结束
    //实现拖拽功能
    allowDrop (ev) {
      ev.preventDefault();
    },
    drag (ev, divdom) {
      srcdiv = divdom;
      ev.dataTransfer.setData("text/html", divdom.innerHTML);
    },
    drop (ev, divdom) {
      ev.preventDefault();
      if (srcdiv != divdom) {
        srcdiv.innerHTML = divdom.innerHTML;
        divdom.innerHTML = ev.dataTransfer.getData("text/html");
      }
    },
    // 检测客户端版本
    check_app_version () {
      let _this = this
      let version_type = "";
      let app_version = window.appVersion ? window.appVersion : "";
      if (navigator.userAgent.indexOf("Intel Mac") > -1) {
        version_type = "mac_" + _this.$store.state.jumpPageData.projectName;
      } else if (navigator.userAgent.indexOf("Windows") > -1) {
        version_type = "windows_" + _this.$store.state.jumpPageData.projectName;
      }
      if (!$("#version_updata_tips_page").length > 0) {
        $("body").append(
          "<div id='version_updata_tips_page'>"
          + "<div id='version_updata_tips_box'>"
          + "<div id='version_updata_tips_content'>" + mcs_start_upgrade + "</div>"
          + "<a target='_top' href='http://" + host_oems + "/about/index.htm'><div id='version_updata_tips_ok'>" + mcs_ok + "</div></a>"
          + "<div id='version_updata_tips_cancel'>" + mcs_cancel + "</div>"
          + "</div>"
          + "</div>")
      }
      $("#version_updata_tips_cancel").click(function () {
        $("#version_updata_tips_page").hide()
      })
      _this.$api.login.get_version({ // 发送请求对比客户端版本是否为最新版
        srv: window.location.host,
        ver_type: version_type,
        ver_from: "v3.9.1.1607051739",
        lang: sessionStorage.getItem('userLanguage')
      }).then(res => {
        let msg = res.data
        if (msg && msg.result == "") {
          _this.$store.dispatch('setDownloadManualUrl', '')
          let app_ver = app_version.split(".");
          let new_ver = msg.info.ver_to.split(".");
          if (window.location.protocol === "https:") { // 赋值下载地址
            msg.info.link_url = msg.info.link_url.replace("http://209.133.212.170:2080", "https://us10.vimtag.com:2446");
            msg.info.link_url = msg.info.link_url.replace("http://61.147.109.92:7080", "https://js.vimtag.com:7446");
          }
          _this.$store.dispatch('setDownloadManualUrl', msg.info.link_url)
          // 这部分判断需要优化一下
          if (app_ver[0] < new_ver[0]) {
            $("#version_updata_tips_page").show();
          } else if (app_ver[0] == new_ver[0]) {
            if (app_ver[1] < new_ver[1]) {
              $("#version_updata_tips_page").show();
            } else if (app_ver[1] == new_ver[1]) {
              if (app_ver[2] < new_ver[2]) {
                $("#version_updata_tips_page").show();
              } else if (app_ver[2] == new_ver[2]) {
                if (app_ver[3] < new_ver[3]) {
                  $("#version_updata_tips_page").show();
                }
              }
            }
          }
        }
      })
    }
  },
  async mounted () {
    let pageData;//页面创建相关对象
    if (this.$route.params) {
      pageData = this.$route.params;
      pageData.parent = $("#" + this.$route.name)
    } else {
      pageData = { parent: $("#" + this.$route.name) }
    }
    // console.log(pageData,"pageData")
    await this.vimtagDevlist(pageData) // 进入页面后加载
    // await this.publicFunc.importCss('Public.scss') // 动态引入css样式 页面加载完成后加载样式(如果加载过早则会无法改变jq填充的dom)
    if (window.location.href.indexOf('vimtag') === -1) {
      // mipc系列
      languageSelect.mipc($('#login_box'))
      $('#login_box').append("<div id='is_mipc_div'></div>")
    }
    if (!this.$store.state.jumpPageData.projectFlag) {
      $("#top_experience_div").css("display", "none")
    }
    this.publicFunc.projectReload.call(this);
  },
  created () {
    let userLanguage = sessionStorage.getItem('userLanguage')
    if (userLanguage) {
      this.$chooseLanguage.lang(userLanguage)
    } else {
      this.$chooseLanguage.lang('en')
    }
  }
}
</script>