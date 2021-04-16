<template>
    <div id='dev_name_info' class='list_right_box'>
        <div class='list_right_item_ex'>
            <span class='attribute_key_text'> {{mcs_nickname}} :</span>
            <input type='text' id='dev_name_input' class='list_right_input' v-model='nickname' @focus="focus_input" @blur="blur_input">
        </div>
        <button class='list_right_button' @click="apply_btn">{{mcs_action_apply}}</button>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                //多国语言
                mcs_nickname: mcs_nickname, //设备昵称
                mcs_action_apply: mcs_action_apply, //应用

                nickname: '', //设备昵称
            }
        },
        mounted() {
            this.$api.set.nickname_get({ sn: this.$store.state.jumpPageData.selectDeviceIpc }).then(res => {
                this.nickname = res.nick
            })
        },
        methods: {
            focus_input() { //点击输入框
                if (this.nickname == this.$store.state.jumpPageData.selectDeviceIpc) {
                    this.nickname = "";
                }
            },
            blur_input() { //离开输入框
                if (this.nickname == "") {
                    this.nickname = this.$store.state.jumpPageData.selectDeviceIpc;
                }
            },
            apply_btn() { //点击应用
                if (this.nickname != mcs_input_nick) {
                    let reg = /['|"|<|>|+]/g;
                    if (this.nickname.search(reg) > -1) {
                        this.publicFunc.msg_tips({ msg: mrs_enter_contain_illegal_characters, type: 'error', timeout: 3000 });
                    } else {
                        this.$api.set.nickname_set({ sn: this.$store.state.jumpPageData.selectDeviceIpc, name: this.nickname }).then(res => {
                            this.publicFunc.msg_tips({ msg: res.msg, type: res.type, timeout: 3000 })
                        })
                    }
                }
            }
        }
    }
</script>

<style lang='scss'>
    .list_right_box {
        width: 520px;
        margin: 0 auto;
    }
</style>