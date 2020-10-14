<template>
    <div id='other_info' class='list_right_box'>
        <div class='list_right_item'>
            <div class='vimtag_options_float_left sd_mode_text'> {{mcs_audio}} :</div>
        </div>
        <div class='list_right_item_ex'>
            <div class='vimtag_options_float_left sd_mode_text'>- {{mcs_speaker}} </div>
            <div class='options_float_right' style='width:200px;'>
                <label for='input_speaker'></label>
                <input name='slider' type='range' id='input_speaker' min='0' max='100' v-model='input_speaker' ref='speaker' /> </div>
        </div>
        <div class='list_right_item'>
            <div class='vimtag_options_float_left sd_mode_text'>- {{mcs_mic}} </div>
            <div class='options_float_right' style='width:200px;'>
                <label for='input_microphone'></label>
                <input name='slider' type='range' id='input_microphone' min='0' max='100' v-model='input_microphone' ref='microphone' /> </div>
        </div>
        <div class='list_right_item'>
            <span class='attribute_key_text'> {{mcs_equipment_flip}} </span>
            <div id='checkbox_ipc_turnover_div' class='options_float_right'><input id='checkbox_ipc_turnover' type='checkbox' /></div>
        </div>
        <div id='power_fr_div'>
            <!-- 电源频率 -->
            <div class='options_float_left'> {{mcs_power_frequency}} </div>
            <div class='options_float_right select_block'><select id='power_fr' v-model='power' @change="power_change">
                    <option>50hz</option>
                    <option>60hz</option>
                </select>
            </div>
        </div>
        <div id='screen_fr_div' v-if="screen_fr_sign">
            <div class='options_float_left'> {{mcs_screen_size}} </div>
            <div class='options_float_right select_block'><select id='screen_fr' v-model='screen' @change='screen_change'>
                    <option>4:3</option>
                    <option>16:9</option>
                </select>
            </div>
        </div>
        <div class='options_float_right' style='clear:both'><button id='button_setup' class='list_right_button' @click='button_setup_btn'> {{mcs_apply}} </button>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                //多国语言
                mcs_audio: mcs_audio,
                mcs_speaker: mcs_speaker,
                mcs_mic: mcs_mic,
                mcs_equipment_flip: mcs_equipment_flip,
                mcs_power_frequency: mcs_power_frequency,
                mcs_screen_size: mcs_screen_size,
                mcs_apply: mcs_apply,

                ipc_turnover_true: 0,
                input_speaker: 0, //扬声器
                input_microphone: 0, //麦克风
                cam_info: '', //其他信息
                ratio: 0,
                power: '', //频率
                screen: '', //
                screen_fr_sign: false, //是否显示画面设置
            }
        },
        mounted() {
            $("#checkbox_ipc_turnover").iButton({
                labelOn: "On",
                labelOff: "Off",
                change: () => {
                    if (this.ipc_turnover_true) {
                        this.ipc_turnover_true = 0;
                    } else {
                        this.cam_set();
                    }
                }
            });

            this.$api.set.audio_get({ sn: this.$store.state.jumpPageData.selectDeviceIpc }).then(res => {
                this.input_speaker = res.speaker_level;
                this.input_microphone = res.mic_level;
            })
            this.$api.play.adjust_get({ sn: this.$store.state.jumpPageData.selectDeviceIpc }).then(res => {
                this.ipc_turnover_true = 1;
                this.cam_info = res;
                this.cam_info.sn = this.$store.state.jumpPageData.selectDeviceIpc;
                res.flicker_freq ? this.power = '60hz' : this.power = '50hz';

                let param = Array();
                param = this.$api.devlist.ldev_get(this.$store.state.jumpPageData.selectDeviceIpc).p;
                for (let i = 0; i < param.length; i++) {
                    if (param[i].n == "s.ratio" && param[i].v.length) {
                        this.ratio = 1;
                        this.screen_fr_sign = true;
                        (res.resolute == "16:9") ? this.screen = '16:9': this.screen = '4:3';
                        break;
                    }
                }

                if (res.flip) {
                    $("#checkbox_ipc_turnover").iButton("toggle", true);
                } else {
                    $("#checkbox_ipc_turnover").iButton("toggle", false);
                }
            })
        },
        methods: {
            cam_set() {
                this.$api.set.cam_set({
                    sn: this.$store.state.jumpPageData.selectDeviceIpc,
                    flip: Number(document.getElementById("checkbox_ipc_turnover").checked),
                    flicker_freq: document.getElementById("power_fr").selectedIndex
                }).then(res => {
                    if (res.result !== "") {
                        if (res.result === "permission.denied") {
                            this.publicFunc.msg_tips({ msg: mcs_permission_denied, type: "error", timeout: 3000 });
                        } else {
                            this.publicFunc.msg_tips({ msg: res.result, type: "error", timeout: 3000 });
                        }
                    } else {
                        this.publicFunc.msg_tips({ msg: mcs_set_successfully, type: "success", timeout: 3000 });
                    }
                })
            },
            button_setup_btn() { //应用
                this.$api.set.audio_set({
                    sn: this.$store.state.jumpPageData.selectDeviceIpc,
                    mic_level: this.input_microphone,
                    speaker_level: this.input_speaker
                }).then(res => {
                    this.publicFunc.msg_tips({ msg: res.msg, type: res.type, timeout: 3000 })
                })
            },
            power_change() {
                this.cam_set()
            },
            screen_change() {
                this.cam_info.flip = Number(document.getElementById("checkbox_ipc_turnover").checked);
                this.cam_info.flicker_freq = document.getElementById("power_fr").selectedIndex;
                this.cam_info.resolute = this.screen;
                this.$api.play.adjust_set({
                    sn: this.$store.state.jumpPageData.selectDeviceIpc,
                    flip: this.cam_info.flip,
                    flicker_freq: this.cam_info.flicker_freq
                }).then(res => {
                    if (res.result === "permission.denied") {
                        this.publicFunc.msg_tips({ msg: mcs_permission_denied, type: "error", timeout: 3000 });
                    } else if (res.result !== "") {
                        this.publicFunc.msg_tips({ msg: res.result, type: "error", timeout: 3000 });
                    } else {
                        this.publicFunc.msg_tips({ msg: mcs_set_successfully, type: "success", timeout: 3000 });
                        this.publicFunc.delete_tips({
                            content: mcs_restart_prompt,
                            func: async () => {
                                await this.$api.set.reboot_device({ sn: this.$store.state.jumpPageData.selectDeviceIpc })
                                setTimeout(() => {
                                    this.$router.push({ name: 'devlist' });
                                }, 1000);
                            }
                        });
                    }
                })
            }
        },
        watch: {
            input_speaker(val) {
                if (val) {
                    this.$refs.speaker.style.backgroundSize = val + '%';
                }
            },
            input_microphone(val) {
                if (val) {
                    this.$refs.microphone.style.backgroundSize = val + '%';
                }
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

    input[type=range] {
        width: 200px;
        height: 1px;
        background: -webkit-linear-gradient($projectColor, $projectColor) no-repeat, #c0c0c0;
        -webkit-appearance: none;
    }

    input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none;
        /*清除系统默认样式*/
        background: none;
        border-radius: 10px;
        -webkit-border-radius: 10px;
        -moz-border-radius: 10px;
        background: rgb(255, 255, 255);
        height: 15px;
        width: 15px;
        border: 1px solid rgb(204, 204, 204);
    }

    #power_fr {
        width: 200px;
        height: 34px;
        color: $projectColor;
        border-radius: 4px;
    }

    #power_fr_div {
        width: 100%;
        height: 50px;
        border-bottom: 1px solid #ccc;
    }

    #screen_fr_div {
        height: 50px;
        border-bottom: 1px solid #ccc;
    }

    #screen_fr {
        width: 200px;
        height: 34px;
        color: $projectColor;
        border-radius: 4px;
    }
</style>