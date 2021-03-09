<template>
    <div id='about_info' class='list_right_box'>
        <div class='list_right_item'>
            <span class='attribute_key_text'> {{mcs_model}} </span>
            <span class='attribute_value_text'>{{about_info.model}}</span>
        </div>
        <div class='list_right_item' style='display:none;'>
            <span class='attribute_key_text'> {{mcs_manufacturer}} </span>
            <span class='attribute_value_text'></span>
        </div>
        <div class='list_right_item'>
            <span class='attribute_key_text'> {{mcs_firmware_version}} </span>
            <span class='attribute_value_text'>{{about_info.ver}}</span>
        </div>
        <div class='list_right_item'>
            <span class='attribute_key_text'> {{mcs_plugin_version}} </span>
            <span class='attribute_value_text'>{{about_info.plugin_version}}</span>
        </div>
        <div class='list_right_item'>
            <span class='attribute_key_text'> {{mcs_device_id}} </span>
            <span class='attribute_value_text'>{{about_info.sn}}</span>
        </div>
        <div class='list_right_item' style='display:none;' id='dev_sensor'>
            <span class='attribute_key_text'> {{mcs_sensor_status}} </span>
            <span class='attribute_value_text'> {{mcs_fault}} </span>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                //多国语言
                mcs_model: mcs_model,
                mcs_manufacturer: mcs_manufacturer,
                mcs_firmware_version: mcs_firmware_version,
                mcs_plugin_version: mcs_plugin_version,
                mcs_device_id: mcs_device_id,
                mcs_sensor_status: mcs_sensor_status,
                mcs_fault: mcs_fault,

                about_info: { //关于信息
                    model: '',
                    ver: '',
                    plugin_version: '',
                    sn: ''
                }
            }
        },
        mounted() {
            this.$api.set.about({ sn: this.$store.state.jumpPageData.selectDeviceIpc }).then(res => {
                if (res.check_ver) {
                    this.$emit('system_new_event', true)
                }
                this.about_info.model = res.model;
                this.about_info.ver = res.ver;
                this.about_info.plugin_version = res.plugin_version ? res.plugin_version : mcs_not_installed;
                this.about_info.sn = res.sn;
            })
        }
    }
</script>

<style lang='scss'>
    @import "../../../css/public.scss";

    .list_right_box {
        width: 520px;
        margin: 0 auto;
    }

    .attribute_value_text {
        float: right;
        font-size: 14px;
        margin-top: 13px;
        margin-right: 10px;
        color: $projectColor;
    }
</style>