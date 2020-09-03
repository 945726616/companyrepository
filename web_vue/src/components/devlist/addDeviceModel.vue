<template>
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
</template>
<script>
export default {
  props:{
    addDeviceModelObj: {
      type: Object,
      default: function () {}
    },
    addDeviceModel: {
      type: Boolean,
      default: false
    }
  }
}
</script>