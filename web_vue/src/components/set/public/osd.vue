<template>
    <div id='osd_info' class='list_right_box'>
        <div class='list_right_item_ex'>
            <div class='attribute_key_text'> {{mcs_display_text}} </div>
            <div id='checkbox_display_name_div' class='options_float_right' style='margin-top:0px;'>
                <input type='checkbox' id='checkbox_display_name' value='display_name' />
            </div>
        </div>
        <div id='input_display_name_content' class='list_right_item'>
            <div class='attribute_key_text'> {{mcs_name}} </div>
            <!-- <div class='options_float_right' style='margin-top:0px;'><input type='text' id='input_display_name' onkeyup=\value=value.replace(/[^\a-\z\A-\Z]/g,'')\onpaste=\value=value.replace(/[^\a-\z\A-\Z]/g,'')\ oncontextmenu=\value=value.replace(/[^\a-\z\A-\Z]/g,'')\ maxlength='16' class='normal_input_right'></input></div> -->
            <div class='options_float_right' style='margin-top:0px;'>
                <input type='text' id='input_display_name' maxlength='16' class='normal_input_right' v-model='input_display_name' />
            </div>
        </div>
        <div class='list_right_item_ex'>
            <div class='attribute_key_text'> {{mcs_display_date}} </div>
            <div id='checkbox_display_date_div' class='options_float_right' style='margin-top:0px;'>
                <input type='checkbox' id='checkbox_display_date' value='display_date' />
            </div>
        </div>
        <div id='display_date_content' class='list_right_item'>
            <div class='attribute_key_text'> {{mcs_date_format}} </div>
            <div class='options_float_right' style='margin-top:0px;'>
                <select id='select_date' style='margin-top:0px;'>
                    <option>MM-DD-YYYY</option>
                    <option>YYYY-MM-DD</option>
                    <option>DD-MM-YYYY</option>
                </select>
            </div>
        </div>
        <div class='list_right_item_ex'>
            <div class='attribute_key_text'> {{mcs_display_time}} </div>
            <div id='checkbox_display_time_div' class='options_float_right' style='margin-top:0px;'>
                <input type='checkbox' id='checkbox_display_time' value='display_time' />
            </div>
        </div>
        <div id='time_format_content' class='list_right_item'>
            <div class='attribute_key_text'> {{mcs_time_format}} </div>
            <div class='options_float_right' style='margin-top:0px;'>
                <select id='select_hour' style='width:300px;'>
                    <option value='12h'> {{mcs_12_hour}} </option>
                    <option value='24h'> {{mcs_24_hour}} </option>
                </select>
            </div>
        </div>
        <div class='list_right_item_ex'>
            <div class='attribute_key_text'> {{mcs_display_weeks}} </div>
            <div id='checkbox_display_weeks_div' class='options_float_right' style='margin-top:0px;'>
                <input type='checkbox' id='checkbox_display_weeks' value='display_weeks' />
            </div>
        </div>
        <div class='options_float_right' style='clear:both'>
            <button id='button_setup' class='list_right_button' @click='setup_btn'> {{mcs_apply}} </button>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                //多国语言
                mcs_display_text: mcs_display_text,
                mcs_name: mcs_name,
                mcs_display_date: mcs_display_date,
                mcs_date_format: mcs_date_format,
                mcs_display_time: mcs_display_time,
                mcs_time_format: mcs_time_format,
                mcs_12_hour: mcs_12_hour,
                mcs_24_hour: mcs_24_hour,
                mcs_display_weeks: mcs_display_weeks,
                mcs_apply: mcs_apply,

                input_display_name: '', //名称
                l_dom_select_date: '',
                l_dom_select_hour: '',
                l_dom_checkbox_display_name: '',
                l_dom_checkbox_display_date: '',
                l_dom_checkbox_display_time: '',
                l_dom_checkbox_display_weeks: '',
            }
        },
        mounted() {
            this.l_dom_select_date = this.publicFunc.mx("#select_date");
            this.l_dom_select_hour = this.publicFunc.mx("#select_hour");
            this.l_dom_checkbox_display_name = this.publicFunc.mx("#checkbox_display_name");
            this.l_dom_checkbox_display_date = this.publicFunc.mx("#checkbox_display_date");
            this.l_dom_checkbox_display_time = this.publicFunc.mx("#checkbox_display_time");
            this.l_dom_checkbox_display_weeks = this.publicFunc.mx("#checkbox_display_weeks");

            $(this.l_dom_checkbox_display_name).iButton({
                labelOn: "On",
                labelOff: "Off",
                change: () => {
                    if (this.l_dom_checkbox_display_name.checked) {
                        $("#input_display_name_content").fadeIn();
                    } else {
                        $("#input_display_name_content").fadeOut();
                    }
                }
            });
            $(this.l_dom_checkbox_display_date).iButton({
                labelOn: "On",
                labelOff: "Off",
                change: () => {
                    if (this.l_dom_checkbox_display_date.checked) {
                        $("#display_date_content").fadeIn();
                    } else {
                        $("#display_date_content").fadeOut();
                    }
                }
            });
            $(this.l_dom_checkbox_display_time).iButton({
                labelOn: "On",
                labelOff: "Off",
                change: () => {
                    if (this.l_dom_checkbox_display_time.checked) {
                        $("#time_format_content").fadeIn();
                    } else {
                        $("#time_format_content").fadeOut();
                    }
                }
            });
            $("#checkbox_display_weeks").iButton({
                labelOn: "On",
                labelOff: "Off"
            });

            this.$api.set.osd_get({ sn: this.$store.state.jumpPageData.selectDeviceIpc }).then(res => {
                if (res.text_enable) {
                    $("#checkbox_display_name").iButton("toggle", true);
                } else {
                    $("#checkbox_display_name").iButton("toggle", false);
                }
                this.input_display_name = res.text;
                if (res.date_enable) {
                    $("#checkbox_display_date").iButton("toggle", true);
                    for (let i = 0; i < this.l_dom_select_date.length; ++i) {
                        if (this.l_dom_select_date[i].text == res.date_format) {
                            this.l_dom_select_date[i].selected = true;
                        }
                    }
                } else {
                    $("#checkbox_display_date").iButton("toggle", false);
                }
                if (res.time_enable) {
                    $("#checkbox_display_time").iButton("toggle", true);
                    if (res.time_12h)
                        this.l_dom_select_hour[0].selected = true;
                    else
                        this.l_dom_select_hour[1].selected = true;
                } else {
                    $("#checkbox_display_time").iButton("toggle", false);
                }
                if (res.week_enable) {
                    $("#checkbox_display_weeks").iButton("toggle", true);
                } else {
                    $("#checkbox_display_weeks").iButton("toggle", false);
                }
                $(this.l_dom_select_date).tzSelect();
                $(this.l_dom_select_hour).tzSelect();
            })
        },
        methods: {
            setup_btn() { //应用
                this.$api.set.osd_set({
                    sn: this.$store.state.jumpPageData.selectDeviceIpc,
                    text: this.input_display_name,
                    text_enable: Number(this.l_dom_checkbox_display_name.checked),
                    week_enable: Number(this.l_dom_checkbox_display_weeks.checked),
                    date_format: this.l_dom_select_date[this.l_dom_select_date.selectedIndex].text,
                    date_enable: Number(this.l_dom_checkbox_display_date.checked),
                    time_12h: Number(!this.l_dom_select_hour.selectedIndex),
                    time_enable: Number(this.l_dom_checkbox_display_time.checked)
                }).then(res => {
                    this.publicFunc.msg_tips({ msg: res.msg, type: res.type, timeout: 3000 })
                })
            }
        }
    }
</script>

<style lang='scss' scoped>
    .list_right_box {
        width: 520px;
        margin: 0 auto;
    }
</style>