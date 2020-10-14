<template>
    <div id='set'>
        <div id='device_setting_page'>
            <div id='set_back' v-if="!project_flag">
                <div id='back' @click="back_btn">
                    <div id='main_title_box_return_img'></div> {{mcs_back}}
                </div>
            </div>
            <div id='create_setting_page_left'>
                <div v-for='(item,index) in menu_data' :key='index' :class='right_show_sign[item.type]?"list_idle_div list_idle_div_active":"list_idle_div"' :type='item.type' @click='left_list_btn'>
                    <div class='list_left_img' :style='"background-image:url(" + item.imgSrc + ")"' v-show="!project_flag"></div>
                    <span class='list_left_text'> {{item.name}} </span>
                    <div class='list_img'></div>
                    <div id='system_new_version' class='system_new_version' v-if='item.type == "system" && system_new_sign'>new</div>
                </div>
                <div class='list_idle_div' type='delete_device' @click='left_list_btn'>{{mcs_delete_device}}</div>
            </div>
            <div id='create_setting_page_right'>
                <keep-alive>
                    <about-info v-if="right_show_sign.about" @system_new_event='system_new_sign_event'></about-info>
                    <nickname v-if="right_show_sign.nickname"></nickname>
                    <admin-password v-if="right_show_sign.admin_password"></admin-password>
                    <guest-password v-if="right_show_sign.guest_password"></guest-password>
                    <network v-if="right_show_sign.network"></network>
                    <osd v-if="right_show_sign.osd"></osd>
                    <sdcord v-if="right_show_sign.sdcord" :info='info_data'></sdcord>
                    <storage-device v-if="right_show_sign.storage_device"></storage-device>
                    <record v-if="right_show_sign.record"></record>
                    <accessory v-if="right_show_sign.accessory"></accessory>
                    <alarm v-if="right_show_sign.alarm_device_tips"></alarm> <!-- 报警插件 -->
                    <date-time v-if="right_show_sign.date_time"></date-time>
                    <system v-if="right_show_sign.system"></system>
                    <others v-if="right_show_sign.others"></others>
                    <motion-detect v-if="right_show_sign.motion_detect"></motion-detect>
                    <lighting v-if="right_show_sign.lighting"></lighting>
                    <delete-device v-if="right_show_sign.delete_device"></delete-device>
                </keep-alive>
            </div>
        </div>
    </div>
</template>

<script>
    import fdSliderController from '../../util/fdSliderController'
    import languageSelect from '../../lib/exportModule/languageSelect.js'
    import mcodec from '../../util/mcodec.js'

    import aboutInfo from './public/aboutInfo.vue'
    import nickname from './public/nickname.vue'
    import adminPassword from './public/adminPassword.vue'
    import guestPassword from './public/guestPassword.vue'
    import network from './public/network.vue'
    import osd from './public/osd.vue'
    import sdcord from './public/sdcord.vue'
    import storageDevice from './public/storageDevice.vue'
    import record from './public/record.vue'
    import accessory from './public/accessory.vue'
    import alarm from './public/alarm.vue'
    import dateTime from './public/dateTime.vue'
    import system from './public/system.vue'
    import others from './public/others.vue'
    import motionDetect from './public/motionDetect.vue'
    import lighting from './public/lighting.vue'
    import deleteDevice from './public/deleteDevice.vue'
    export default {
        data() {
            return {
                //多国语言
                mcs_back: mcs_back,
                mcs_delete_device: mcs_delete_device,

                project_flag: 0, //判断是否为vimtag
                set_params: {}, // 接受的设置的信息
                menu_data: [], //设置左侧功能列表
                right_show_sign: {
                    about: true,
                    nickname: false,
                    admin_password: false,
                    guest_password: false,
                    network: false,
                    osd: false,
                    sdcord: false,
                    storage_device: false,
                    scenes: false,
                    accessory: false,
                    record: false,
                    alarm_device_tips: false,
                    date_time: false,
                    system: false,
                    others: false,
                    motion_detect: false,
                    lighting: false,
                    alarm_device: false,
                    alarm_action: false,
                    scheduled_alerting: false,
                    scheduled_recording: false,
                    delete_device: false
                }, // 设置右侧详情显示
                flag: '', // 设备类型
                new_ealf: 0, // 设备联动框架标识
                info_data: {}, //传递到组件的数据
                system_new_sign: false, //判断是否有新系统
            }
        },
        mounted() {
            let _this = this;
            _this.project_flag = _this.$store.state.jumpPageData.projectFlag;
            _this.$store.dispatch('setPageParams', _this.$route.params)
            _this.set_params = _this.$store.state.set.pageParams
            _this.flag = _this.set_params.type

        },
        methods: {
            back_btn() { //点击返回
                if (this.set_params.back_page === 'play') {
                    this.$router.push({ name: 'play', params: this.set_params })
                } else if (this.set_params.back_page === 'boxlist') {
                    this.$router.push({ name: 'boxlist', params: this.set_params });
                }
            },
            left_list_btn(e) { //左侧列表点击
                let list_type = e.currentTarget.getAttribute('type');
                let list_name;
                if (e.currentTarget.children[1]) {
                    list_name = e.currentTarget.children[1].innerHTML.trim(); //后加云盒子硬盘显示文字与sd卡区分
                }
                for (let i in this.right_show_sign) {
                    this.right_show_sign[i] = false;
                }
                this.right_show_sign[list_type] = true;
                this.info_data = {
                    type: list_type,
                    list_name: list_name
                }
            },
            system_new_sign_event(data) { //更改系统更新状态
                this.system_new_sign = data;
            }
        },
        watch: {
            flag(val) {
                switch (val) {
                    case 1:
                        this.menu_data = [
                            { name: mcs_about, type: "about" },
                            { name: mcs_nickname, type: "nickname" },
                            { name: mcs_admin_password, type: "admin_password" },
                            { name: mcs_guest_password, type: "guest_password" },
                            { name: mcs_network, type: "network" },
                            { name: mcs_osd, type: "osd" },
                            { name: mcs_sdcord, type: "sdcord" },
                            { name: mcs_storage_device, type: "storage_device" },
                            // {name:mcs_scenes,type:"scenes"}, //g 情景
                            { name: mcs_w_s, type: "accessory" },
                            { name: mcs_record, type: "record" },
                            { name: mcs_motion_notification, type: "alarm_device_tips" },
                            { name: mcs_date_time, type: "date_time" },
                            { name: mcs_system, type: "system" },
                            { name: mcs_others, type: "others" },
                            { name: mcs_motion, type: "motion_detect" }, //新加移动侦测
                            { name: mcs_light_mode, type: "lighting" },
                            // { name: mcs_delete_device, type: "delete_device" }
                        ]
                        break;

                    case 2: //云盒子
                        this.menu_data = [
                            { name: mcs_about, type: "about" },
                            { name: mcs_nickname, type: "nickname" },
                            { name: mcs_admin_password, type: "admin_password" },
                            { name: mcs_guest_password, type: "guest_password" },
                            { name: mcs_network, type: "network" },
                            { name: mcs_hard_disk, type: "sdcord" },
                            { name: mcs_date_time, type: "date_time" },
                            { name: mcs_system, type: "system" },
                            // {name:"onvif",type:"onvif"},  //onvif
                            // { name: mcs_delete_device, type: "delete_device" }
                        ]
                        break;

                    case 3:
                        this.menu_data = [
                            { name: mcs_about, type: "about" },
                            { name: mcs_nickname, type: "nickname" },
                            { name: mcs_admin_password, type: "admin_password" },
                            { name: mcs_guest_password, type: "guest_password" },
                            { name: mcs_network, type: "network" },
                            { name: mcs_osd, type: "osd" },
                            { name: mcs_sdcord, type: "sdcord" },
                            { name: mcs_storage_device, type: "storage_device" },
                            { name: mcs_alarm_device, type: "alarm_device" },
                            { name: mcs_alarm_action, type: "alarm_action" },
                            { name: mcs_scheduled_alerting, type: "scheduled_alerting" },
                            { name: mcs_scheduled_recording, type: "scheduled_recording" },
                            { name: mcs_date_time, type: "date_time" },
                            { name: mcs_system, type: "system" },
                            { name: mcs_others, type: "others" },
                            // { name: mcs_delete_device, type: "delete_device" }
                        ]
                        break;

                    case 4:
                        this.menu_data = [
                            { name: mcs_about, type: "about" },
                            // { name: mcs_delete_device, type: "delete_device" }
                        ]
                        break;

                    case 5:
                        this.menu_data = [
                            { name: mcs_about, type: "about" },
                            { name: mcs_nickname, type: "nickname" },
                            { name: mcs_admin_password, type: "admin_password" },
                            { name: mcs_guest_password, type: "guest_password" },
                            { name: mcs_network, type: "network" },
                            { name: mcs_sdcord, type: "sdcord" },
                            { name: mcs_storage_device, type: "storage_device" },
                            // {name:mcs_scenes,type:"scenes"}, //g 情景
                            { name: mcs_w_s, type: "accessory" },
                            { name: mcs_record, type: "record" },
                            { name: mcs_motion_notification, type: "alarm_device_tips" },
                            { name: mcs_date_time, type: "date_time" },
                            { name: mcs_system, type: "system" },
                            { name: mcs_others, type: "others" },
                            { name: mcs_motion, type: "motion_detect" }, //新加移动侦测
                            { name: mcs_light_mode, type: "lighting" },
                            // { name: mcs_delete_device, type: "delete_device" }
                        ]
                        break;
                }
                this.$api.set.dev_info({ sn: this.$store.state.jumpPageData.selectDeviceIpc }).then(res => {
                    if (res && res.result === "") {
                        for (let i = 0; i < this.menu_data.length; i++) {
                            if (this.menu_data[i].type === 'osd' && res.fisheye == 1) { //鱼眼设备隐藏osd
                                this.menu_data.splice(i, 1)
                            }
                            if (this.menu_data[i].type === 'accessory') {
                                if ((res.face_detect !== "1" && res.sound_detect !== "1") && res.rffreq !== "868") { //人型检测||msg.human_detect==1
                                    this.menu_data.splice(i, 1)
                                }
                            }
                            if (!res.white_light && this.menu_data[i].type === 'lighting') {
                                this.menu_data.splice(i, 1)
                            }
                        }
                        if (res.new_ealf === "1") {
                            this.new_ealf = 1
                        }
                        this.$store.dispatch('setDeviceEalf', this.new_ealf)
                    }
                })
                for (let i = 0; i < this.menu_data.length; i++) {
                    this.menu_data[i].imgSrc = require("@/assets/device/set_" + this.menu_data[i].type + ".png")
                }
            }
        },
        components: {
            aboutInfo,
            nickname,
            adminPassword,
            guestPassword,
            network,
            osd,
            sdcord,
            storageDevice,
            record,
            accessory,
            alarm,
            dateTime,
            system,
            others,
            motionDetect,
            lighting,
            deleteDevice,
        }
    }
</script>

<style lang='scss'>
    @import '../../css/jquery.ibutton.scss';
    @import '../../css/jquery.tzSelect.scss';
    @import './index.scss';

    .fd-slider-bar {
        background-image: none;
        cursor: pointer;
        height: 0.5px;
        background-color: rgb(0, 166, 186) !important;
        border-bottom: 1px solid rgb(0, 166, 186) !important;
    }

    .fd-slider-cover {
        background: #c0c0c0 !important;
        border-bottom: 1px solid #c0c0c0 !important;
        cursor: pointer;
        height: 0.5px;
    }

    .fd-slider-handle {
        background: none;
        border-radius: 10px;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        background: rgb(255, 255, 255) !important;
        height: 15px !important;
        width: 15px !important;
        border: 1px solid rgb(204, 204, 204) !important;
    }

    .fd-slider-hover .fd-slider-handle {
        background: none;
        background-color: #fff;
        border-radius: 10px;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
    }

    .ibutton-handle-middle {
        float: right;
        margin-top: -3px;
        margin-left: 1px;
        width: 17px;
        height: 17px;
        background: none;
        background-color: #fff;
        border-radius: 10px;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        border: 1px solid #ccc;
    }

    .ibutton-container {
        margin-top: 18px !important;
        width: 60px !important;
        overflow: visible !important;
    }

    .ibutton-handle {
        height: 20px !important;
        width: 20px;
        background: none;
        padding: 0px;
    }

    .ibutton-container label {
        cursor: inherit;
        font-size: 12px !important;
        font-weight: normal;
        color: #0ea9bb;
    }

    div.ibutton-label-on {
        color: #7c7c7c;
        /*修改了这里*/
        text-shadow: 0 -1px 2px rgba(153, 153, 153, 0.4);
        left: 0;
        z-index: 1;
    }

    .tzSelect {
        width: 210px;
        height: 34px;
    }

    .tzSelect .selectBox {
        position: relative;
        width: 200px;
        height: 34px;
        line-height: 34px;
        text-align: center;
        padding-right: 3px;
        margin-top: 5px;
        background-color: #ffffff;
        background-image: none;
        background-repeat: no-repeat;
        background-position: 98% 40%;
        border: 1px solid #22aaaa;
        cursor: pointer;
        -moz-border-radius: 4px;
        -webkit-border-radius: 4px;
        border-radius: 4px;
        z-index: 20;
    }

    .tzSelect .dropDown {
        position: absolute;
        top: 30px;
        padding-top: 13px;
        padding-bottom: 13px;
        left: 0;
        width: 100%;
        border: 1px solid #22aaaa;
        background-image: none;
        background-color: #ffffff;
        -moz-background-size: 100% 100%;
        -webkit-background-size: 100% 100%;
        -o-background-size: 100% 100%;
        background-size: 100% 100%;
        list-style: none;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        -moz-border-radius: 6px;
        -webkit-border-radius: 6px;
        border-radius: 6px;
        -moz-box-shadow: 0 0 4px #111;
        -webkit-box-shadow: 0 0 4px #111;
        box-shadow: 0 0 4px #111;
        z-index: 21;
        max-height: 230px;
        overflow: auto;
    }

    .tzSelect .dropDown::-webkit-scrollbar {
        width: 5px;
    }

    .tzSelect .dropDown::-webkit-scrollbar-thumb:vertical {
        background-color: #999;
        border-radius: 6px;
    }

    .tzSelect #select_network_edit {
        background-color: gary;
        border: 0pt;
        color: #000000;
        font-size: 14px;
        font-weight: 500;
        text-align: center;
        position: absolute;
        line-height: 22px;
        height: 22px;
        width: 88%;
        top: 6px;
        left: 1px;
        border-radius: 8px;
        background-color: #ffffff;
        z-index: 3;
        margin-top: 0;
    }

    #select_network_li .tzSelect {
        width: 200px;
    }

    #select_network_edit .dropDown {
        height: 200px;
    }

    div.ibutton-label-on,
    div.ibutton-label-off {
        /*修改了这里  background-color ;height原来是9 px*/
        background-color: #dedede;
        border-radius: 20px;
        height: 9px;
        white-space: nowrap;
        font-size: 17px;
        line-height: 17px;
        font-weight: bold;
        text-transform: uppercase;
        cursor: inherit;
        display: block;
        position: absolute;
        top: 0;
        padding-top: 3px;
        overflow: hidden;
        /*background: url("../assets/device/vimtag_img.png") no-repeat -145px -116px;*/
        width: 60px;
        /*height: 22px;*/
    }
</style>