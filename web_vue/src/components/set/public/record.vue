<template>
    <div id='record' class='list_right_box'>
        <div style='height:2rem;margin-top:1rem'> {{mcs_continuous_recording}} </div>
        <div class='menu_list2_box' id='record_plan' style='overflow:hidden' @click='record_event_btn'>
            <div class='menu_record'>
                <div class='list_name'>
                    <div class='list_name_title'> {{mcs_continuous_recording}} </div>
                    <!-- 下面开启关闭 -->
                    <div class='list_name_tips' id='is_show'>{{sd_sign?list_name_show:mcs_turn_off}}</div>
                </div>
                <div class='list_info'>
                    <div class='right_arrow'></div>
                </div>
            </div>
        </div>
        <div class='menu_list_box_title3' style='height:2rem;margin-top:1rem'> {{mcs_Event_record}} </div>
        <div class='menu_list2_box' id='record_event'>
            <div v-for='item in scene_data_out.dev' :key='item.id'>
                <div v-if='item.record_event_name && item.record_event_type' class='menu_list record_event_btn' :sn='item.id' :type='item.type' @click='record_event_btn'>
                    <div class='list_name'>
                        <div class='list_name_title'> {{item.record_event_name}} </div>
                        <div class='list_name_tips'> {{sd_sign?item.record_event_type:mcs_turn_off}} </div>
                    </div>
                    <div class='list_info'>
                        <div class='right_arrow'></div>
                    </div>
                </div>
            </div>
        </div>

        <div id='sd_mode' v-if='sd_mode_sign'>
            <div class='sd_display'>
                <div class='menu_list_box_title2 menu_list_mode'> {{mcs_mode}} </div>
                <div class='menu_list_box'>
                    <div class='menu_list menu_list_children_mode' style=''>
                        <div class='sd_mode_text'> {{mcs_normal_mode}} </div>
                        <div class='list_info'>
                            <input type="radio" value='0' v-model='record_mode' :class='record_mode == "0"?project_name+"_list_info_clickselect_img":"list_info_select_img"' />
                        </div>
                    </div>
                    <div id='no' class='record_sd_calculate'>{{normal_hint}}</div>
                    <div class='menu_list menu_list_children_mode' style=''>
                        <div class='sd_mode_text'> {{mcs_long_video_mode}} </div>
                        <div class='list_info'>
                            <input type="radio" value='50' v-model='record_mode' :class='record_mode == "50"?project_name+"_list_info_clickselect_img":"list_info_select_img"' />
                        </div>
                    </div>
                    <div id='lo' class='record_sd_calculate'>{{long_video_hint}}</div>
                    <div class='menu_list menu_list_children_mode' style=''>
                        <div class='sd_mode_text'> {{mcs_super_long_video_mode}} </div>
                        <div class='list_info'>
                            <input type="radio" value='100' v-model='record_mode' :class='record_mode == "100"?project_name+"_list_info_clickselect_img":"list_info_select_img"' />
                        </div>
                    </div>
                    <div id='su' class='record_sd_calculate'>{{super_video_hint}}</div>
                </div>
                <div id='sd_mode_btn' class='list_right_button' @click='sd_mode_btn'> {{mcs_apply}} </div>
            </div>
        </div>
        <time-page v-if='setTimePage' :setTimePageObj='setTimePageObj' @time_page_close='time_page_close'></time-page>
    </div>
</template>

<script>
    import timePage from './setTimePage'
    export default {
        data() {
            return {
                //多国语言
                mcs_continuous_recording: mcs_continuous_recording,
                mcs_Event_record: mcs_Event_record,
                mcs_mode: mcs_mode,
                mcs_normal_mode: mcs_normal_mode,
                mcs_long_video_mode: mcs_long_video_mode,
                mcs_super_long_video_mode: mcs_super_long_video_mode,
                mcs_apply: mcs_apply,
                mcs_turn_off: mcs_turn_off,

                face_detect: '',
                sound_detect: '',
                list_name_show: '',
                scene_data_out: '',
                setTimePage: false, //控制弹窗是否显示
                setTimePageObj: {}, //控制弹窗展示对象
                record_mode: '', //录像模式
                sd_mode_sign: false, //录像模式是否显示
                normal_hint: '', //普通模式
                long_video_hint: '', //长录像模式
                super_video_hint: '', //超长录像模式
                sd_sign: true, //是否含sd卡
                project_name: '', //项目名
            }
        },
        mounted() {
            this.project_name = this.$store.state.jumpPageData.projectName;
            this.publicFunc.showBufferPage()
            this.get_dev_info();
        },
        methods: {
            record_event_btn(e) { //打开弹框
                if (this.sd_sign) {
                    this.setTimePage = true;
                    this.$set(this.setTimePageObj, "show_page", 'time_page') //打开是否允许录像弹框
                    this.$set(this.setTimePageObj, "accessory_type", e.currentTarget.getAttribute('type')) //录像类型
                    this.$set(this.setTimePageObj, "accessory_sn", e.currentTarget.getAttribute('sn')) //设备ID
                    this.$set(this.setTimePageObj, "accessory_mode", 'record') //录像模式
                } else {
                    this.publicFunc.msg_tips({ msg: mcs_no_sd_hint, type: "error", timeout: 3000 });
                }
            },
            time_page_close() { //关闭弹框
                this.setTimePage = false;
                this.publicFunc.showBufferPage()
                this.get_dev_info()
            },
            sd_mode_btn() { //点击应用
                this.$api.set.sd_set({ sn: this.$store.state.jumpPageData.selectDeviceIpc, ctrl_type: "", record_mode: this.record_mode, flag: 1 }).then(res => {
                    this.publicFunc.msg_tips({ msg: res.msg, type: res.type, timeout: 3000 })
                })
            },
            get_dev_info() { //获取信息
                this.$api.set.dev_info({ sn: this.$store.state.jumpPageData.selectDeviceIpc }).then(res => {
                    this.face_detect = res.face_detect;
                    this.sound_detect = res.sound_detect;
                    this.$api.set.scene_get({
                        sn: this.$store.state.jumpPageData.selectDeviceIpc
                    }).then(res => {
                        this.publicFunc.closeBufferPage()
                        if (res && res.result == "") {
                            if (res.data.info.scene[0].flag == 0) {
                                this.list_name_show = mcs_turn_off
                            } else {
                                this.list_name_show = mcs_turn_on
                            }
                            let scene_data = res.data.info.scene;
                            let event_record = 0;
                            // l_select_scene_name = msg.data.info.select;
                            for (let i = 0; i < scene_data.length; i++) {
                                if (scene_data[i].name == "out") {
                                    this.scene_data_out = scene_data[i];
                                } else if (scene_data[i].name == "in") {
                                    this.scene_data_active = scene_data[i];
                                }
                            }
                            for (let j = 0; j < this.scene_data_out.dev.length; j++) {
                                let record_event_name
                                let record_event_type
                                if (this.scene_data_out.dev[j].type == 1) {
                                    record_event_name = mcs_motion_detection;
                                } else if (this.scene_data_out.dev[j].type == 6) {
                                    record_event_name = mcs_magnetic;
                                } else if (this.scene_data_out.dev[j].type == 5) {
                                    record_event_name = mcs_sos;
                                } else if (this.scene_data_out.dev[j].type == 8) {
                                    if (this.face_detect == 0) { continue; }
                                    record_event_name = mcs_face_detection;
                                } else if (this.scene_data_out.dev[j].type == 9) {
                                    if (this.sound_detect == 0) { continue; }
                                    record_event_name = mcs_sound_detection;
                                } else if (this.scene_data_out.dev[j].type == 2) {
                                    record_event_name = mcs_Infrared_detector;
                                } else if (this.scene_data_out.dev[j].type == 4) {
                                    record_event_name = mcs_smoke_detector;
                                } else if (this.scene_data_out.dev[j].type == 7) {
                                    continue;
                                } else if (this.scene_data_out.dev[j].type == 10) { //human_detect
                                    continue
                                }
                                if (!(this.scene_data_out.dev[j].flag & 0x2)) {
                                    record_event_type = mcs_turn_off;
                                } else if (this.scene_data_out.dev[j].flag & 0x2) {
                                    record_event_type = mcs_turn_on;
                                    // event_record = 1;
                                }

                                this.scene_data_out.dev[j].record_event_name = record_event_name
                                this.scene_data_out.dev[j].record_event_type = record_event_type
                            }
                            this.$api.set.sd_get({ sn: this.$store.state.jumpPageData.selectDeviceIpc }).then(res => {
                                if (res && res.result == "" && res.status == "mount") {
                                    this.sd_sign = true;
                                    this.sd_mode_sign = true;
                                    if (res.conf) {
                                        this.record_mode = res.conf.record_mode;
                                    }
                                    String.prototype.format = function() {
                                        if (arguments.length == 0) return this;
                                        let obj = arguments[0];
                                        let s = this;
                                        for (let key in obj) {
                                            s = s.replace(new RegExp("\\{\\{" + key + "\\}\\}", "g"), obj[key]);
                                        }
                                        return s;
                                    }
                                    let sd = res.capacity / 1000;
                                    let temp = 2;
                                    for (let i = 0; i < 15; i++) {
                                        if (sd < temp) {
                                            sd = temp;
                                            break;
                                        }
                                        temp = temp << 1;
                                    }
                                    let data_normal = {
                                        size: sd + "G",
                                        days: Math.round(res.capacity / 1000 / 8)
                                    }
                                    let data_long_video = {
                                        size: sd + "G",
                                        days: Math.round(res.capacity / 1000 / 3)
                                    }
                                    let data_super_video = {
                                        size: sd + "G",
                                        days: Math.round(res.capacity / 1000 / 2)
                                    }
                                    this.normal_hint = mcs_normal_mode_hint.format(data_normal);
                                    this.long_video_hint = mcs_long_video_mode_hint.format(data_long_video);
                                    this.super_video_hint = mcs_super_long_video_mode_hint.format(data_super_video);
                                } else {
                                    this.sd_sign = false; //未检测到sd卡
                                }
                            })
                        }
                    })
                })
            }
        },
        components: {
            timePage
        }
    }
</script>

<style lang='scss' scoped>
    @import "../../../css/public.scss";

    .list_right_box {
        width: 520px;
        margin: 0 auto;
    }

    #record_plan {
        border-top: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
    }

    .menu_list {
        overflow: hidden;
        height: 50px;
        border-bottom: 1px solid rgb(204, 204, 204);
        line-height: 50px;

        &:last-child {
            border-bottom: none;
            border-top: 1px solid rgb(204, 204, 204);
        }
    }

    .list_name {
        width: 100%;
    }

    .list_name_title {
        float: left;
        font-size: 14px;
        color: #666;
    }

    .list_name_tips {
        float: right;
        font-size: 14px;
        color: #666;
    }

    .menu_list_mode {
        border-bottom: 1px solid #ccc;
        padding: 10px 0;
        color: #000;
        margin-top: 20px;
    }

    input[type='radio'] {
        appearance: none;
        -webkit-appearance: none;
        outline: none;
        margin: 0;
        vertical-align: text-bottom;
        margin-right: 0.1rem;
    }

    .record_sd_calculate {
        height: 35px;
        font-size: 14px;
        line-height: 35px;
        color: $projectColor;
    }
</style>