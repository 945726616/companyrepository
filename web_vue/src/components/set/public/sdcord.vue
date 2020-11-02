<template>
    <div id='sd_info' class='list_right_box'>
        <div class='list_right_item'>
            <span class='attribute_key_text'> {{mcs_enabled}} </span>
            <div id='label_sd' @click='label_sd_btn' :class='switch_flag?"":"switch_close_color"'>
                <!--  <span id='label_text_left_sd' class='label_text_left'>ON</span> -->
                <div id='label_img_sd' class='label_img'></div>
                <!--  <span id='label_text_right_sd' class='label_text_right'>OFF</span> -->
            </div>
        </div>
        <div id='open_switch'>
            <div class='list_right_item'>
                <span class='attribute_key_text'> {{mcs_status}} </span>
                <div class='options_float_right'><input type='text' id='input_status' class='input_read_only' disabled v-model='input_status' /></div>
            </div>
            <div class='list_right_item_ex' id='input_capacity_content' v-if='input_capacity_content_sign'>
                <span class='attribute_key_text'> {{mcs_capacity}} </span>
                <div class='options_float_right'><input type='text' id='input_capacity' class='input_read_only' disabled v-model='input_capacity' /></div>
            </div>
            <!-- <div class='list_right_item_ex' id='input_usage_content'>
                 <span class='attribute_key_text'>mcs_usage</span>
                 <div class='options_float_right'><input type='text' id='input_usage' class='input_read_only' disabled /></div>
             </div> -->
            <div class='list_right_item' id='input_available_content' v-if="input_available_content_sign">
                <span class='attribute_key_text'> {{mcs_valid}} </span>
                <div class='options_float_right'><input type='text' id='input_available' class='input_read_only' disabled v-model='input_available' /></div>
            </div>

            <!-- sd卡描述 -->
            <div id='sd_describe' v-if="sd_describe_sign">
                <div> {{mcs_sd_first}} </div>
                <div> {{mcs_sd_nospace}} </div>
            </div>
            <!-- 如何导出sd卡 -->
            <div id='sd_export_link' @click='sd_export_link_content_sign = true' v-if='sd_export_link_sign'> {{mcs_how_to_export_sd}} </div>
            <div id='sd_export_link_content' v-if='sd_export_link_content_sign'> {{mrs_login_please}} www.{{project_name}}.com, {{mrs_sd_export_tips}} </div>
            <!-- 硬盘描述 -->
            <div id='disk_describe' v-if="disk_describe_sign"> {{mcs_hard_disk_title_1}} </div>

            <!-- <div id='sd_mode'>
                <div class='sd_display'>
                    <div class='menu_list_box_title2 menu_list_mode sd_mode_text'>mcs_mode</div>
                    <div class='menu_list_box'>
                        <div class='menu_list menu_list_children_mode' style=''>
                            <div class='list_name sd_mode_text'>mcs_normal_mode</div>
                            <div class='list_info'>
                                <div type='0' class='list_info_select list_info_select_img'></div>
                            </div>
                        </div>
                        <div class='menu_list menu_list_children_mode' style=''>
                            <div class='list_name sd_mode_text'>mcs_long_video_mode</div>
                            <div class='list_info'>
                                <div type='50' class='list_info_select list_info_select_img'></div>
                            </div>
                        </div>
                        <div class='menu_list menu_list_children_mode' style=''>
                            <div class='list_name sd_mode_text'>mcs_super_long_video_mode</div>
                            <div class='list_info'>
                                <div type='100' class='list_info_select list_info_select_img'></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> -->

            <div class='list_right_item_ex' id='format_content' v-if='format_content_sign'>
                <span class='attribute_key_text'>- {{mcs_format}} </span>
                <button id='format_btn' class='list_right_button_ex options_float_right_button' @click='format_btn'>{{mcs_format}}</button>
            </div>
        </div>
        <button id='sd_apply' class='list_right_button' @click='sd_apply_btn'>{{mcs_action_apply}}</button>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                //多国语言
                mcs_enabled: mcs_enabled,
                mcs_status: mcs_status,
                mcs_capacity: mcs_capacity,
                mcs_valid: mcs_valid,
                mcs_sd_first: mcs_sd_first,
                mcs_sd_nospace: mcs_sd_nospace,
                mcs_how_to_export_sd: mcs_how_to_export_sd,
                mrs_login_please: mrs_login_please,
                mcs_hard_disk_title_1: mcs_hard_disk_title_1,
                mrs_sd_export_tips: mrs_sd_export_tips,
                mcs_format: mcs_format,
                mcs_action_apply: mcs_action_apply,

                project_name: '', //项目名
                switch_flag: true, //启动状态
                sd_export_link_content_sign: false, //是否显示如何导出SD卡数据内容
                input_capacity: '', //容量
                input_available: '', //启用
                input_status: '', //状态
                format_content_sign: false, //是否显示格式化
                input_capacity_content_sign: false, //是否显示容量
                input_available_content_sign: false, //是否显示启用
                sd_describe_sign: false, //是否显示sd卡描述
                sd_export_link_sign: false, //是否显示如何导出sd卡数据
                disk_describe_sign: false, // 是否显示硬件描述

                l_dom_label_text_right_sd: '',
                l_dom_label_img_sd: '',
                l_dom_open_switch: '',
            }
        },
        props: {
            info: {
                type: Object,
                default: function() {}
            }
        },
        mounted() {
            this.l_dom_label_text_right_sd = this.publicFunc.mx("#label_text_right_sd");
            this.l_dom_label_img_sd = this.publicFunc.mx("#label_img_sd");
            this.l_dom_open_switch = this.publicFunc.mx("#open_switch");
            this.project_name = this.$store.state.jumpPageData.projectName;
            this.$api.set.sd_get({ sn: this.$store.state.jumpPageData.selectDeviceIpc }).then(res => {
                if (res) {
                    this.input_capacity = res.capacity + "MB";
                    this.input_available = res.availableSize + "MB";
                    switch (res.status) {
                        case "empty": {
                            this.input_status = res.no_sdcard;
                            break;
                        }
                        case "ro":
                        case "readonly": {
                            this.input_status = mcs_fault;
                            this.format_content_sign = true;
                            break;
                        }
                        case "mount": {
                            this.input_status = mcs_connnected;
                            this.input_capacity_content_sign = true;
                            this.input_available_content_sign = true;
                            this.format_content_sign = true;
                            if (this.info.list_name == "SD卡") {
                                this.sd_describe_sign = true;
                                this.sd_export_link_sign = true;
                            } else if (this.info.list_name == "硬盘") {
                                this.disk_describe_sign = true;
                            }

                            break;
                        }
                        case "repairing": {
                            this.input_status = mcs_repairing;
                            break;
                        }
                        case "formating": {
                            this.input_status = mcs_formating;
                            break;
                        }
                        case "umount": {
                            this.input_status = mcs_unmounted;
                            break;
                        }
                        case "mounting": {
                            this.input_status = mcs_loading;
                            break;
                        }
                    }
                }
            })
        },
        methods: {
            label_sd_btn() { //启动状态
                this.switch_flag = !this.switch_flag;
                if (this.switch_flag) {
                    $(this.l_dom_label_text_right_sd).fadeOut("fast");
                    $(this.l_dom_label_img_sd).animate({ marginRight: "0px" });
                    $(this.l_dom_open_switch).fadeIn("slow");
                    // $(l_dom_labels).css({ "background": "#00a6ba" }); //修改了这里 
                    // $(l_dom_label_text_left_sd).fadeIn("fast");
                } else {
                    $(this.l_dom_label_text_right_sd).fadeIn("fast");
                    $(this.l_dom_label_img_sd).animate({ marginRight: "40px" });
                    $(this.l_dom_open_switch).fadeOut("slow");
                    // $(l_dom_labels).css({ "background": "#dedede" }); //修改了这里
                    // $(l_dom_label_text_left_sd).fadeOut("fast");
                }
            },
            format_btn() { //格式化
                let flag = this.switch_flag ? 1 : 0;
                this.publicFunc.delete_tips({
                    content: mcs_format_prompt,
                    func: () => {
                        this.$api.set.sd_set({ sn: this.$store.state.jumpPageData.selectDeviceIpc, ctrl_type: "format", flag: flag }).then(res => {
                            this.publicFunc.msg_tips({ msg: res.msg, type: res.type, timeout: 3000 })
                        })
                    }
                })
            },
            sd_apply_btn() { //应用
                let flag = this.switch_flag ? 1 : 0;
                this.$api.set.sd_set({ sn: this.$store.state.jumpPageData.selectDeviceIpc, ctrl_type: "", flag: flag }).then(res => {
                    this.publicFunc.msg_tips({ msg: res.msg, type: res.type, timeout: 3000 })
                })
            }
        }
    }
</script>

<style lang='scss' scoped>
    @import "../../../css/public.scss";

    .list_right_box {
        width: 520px;
        margin: 0 auto;
    }

    #label_sd {
        width: 60px;
        height: 12px;
        background-color: $projectColor;
        -moz-border-radius: 10px;
        -webkit-border-radius: 10px;
        border-radius: 10px;
        position: relative;
        float: right;
        margin-top: 7px;
        z-index: 1;
        cursor: pointer;
    }

    .label_img {
        float: right;
        margin-top: -4px;
        margin-left: 1px;
        width: 17px;
        height: 17px;
        background-color: #fff;
        border-radius: 10px;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        border: 1px solid #ccc;
    }

    .switch_close_color {
        background-color: #dedede !important
    }

    #sd_describe {
        font-size: 14px;
        color: #666;
        margin-top: 15px;
    }

    #sd_describe div {
        height: 35px;
        line-height: 35px;
    }

    #sd_export_link {
        font-size: 14px;
        color: $projectColor;
        margin-top: 15px;
        height: 40px;
        line-height: 40px;
        cursor: default;
    }

    #sd_export_link_content {
        font-size: 14px;
        color: $projectColor;
        margin-top: 15px;
        height: 40px;
        line-height: 35px;
    }

    #disk_describe {
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        color: #666;
        margin-top: 15px;
    }
</style>