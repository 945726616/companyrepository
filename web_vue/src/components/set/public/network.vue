<template>
    <div id='network_info' class='list_right_box'>
        <div id='nic_select_div' class='list_right_item'>
            <!-- 网卡 -->
            <div class='attribute_key_text'> {{mcs_network_interface}} </div>
            <div class='options_float_right select_block' style='margin-top:0px;'><select id='select_nic'></select></div>
        </div>
        <div class='list_right_item_ex'>
            <!-- 启动 -->
            <div class='attribute_key_text'> {{mcs_enabled}} </div>
            <div id='nic_enabled_switch' class='options_float_right' style='margin-top:0px;'>
                <input id='nic_switch_checkbox' type='checkbox' checked />
            </div>
        </div>
        <div id='nic_enabled_content'>
            <div id='mac_address' class='list_right_item'>
                <div class='attribute_key_text'> {{mcs_mac_address}} </div>
                <div class='options_float_right'><input type='text' id='input_mac_address' class='input_read_only' v-model='input_mac_address' disabled /></div>
            </div>
            <div id='nic_mode_select' class='list_right_item_ex' style='clear:both'>
                <div class='attribute_key_text'> {{mcs_wifi_mode}} </div>
                <div class='options_float_right'>
                    <select id='select_wifi_mode'>
                        <option value='1'> {{mcs_client}} </option>
                        <option value='2'> {{mcs_ap}} </option>
                    </select>
                </div>
            </div>
            <div id='nic_not_conn_content' class='list_right_item'>
                <div class='attribute_key_text'> {{mcs_network_status}} </div>
                <div class='options_float_right'><input type='text' id='input_status' class='input_read_only' disabled v-model='input_status' /></div>
            </div>
            <div id='nic_ap_mode_content' style='display:none'>
                <div class='list_right_item_ex'>
                    <div class='attribute_key_text'> {{mcs_dhcp}} </div>
                </div>
                <div class='list_right_item'>
                    <div class='attribute_key_text'>- {{mcs_start_address}} </div>
                    <div class='options_float_right'><input id='input_ap_start_address' type='text' class='input_read_only' disabled v-model='input_ap_start_address' /></div>
                </div>
                <div class='list_right_item'>
                    <div class='attribute_key_text'>- {{mcs_end_address}} </div>
                    <div class='options_float_right'><input id='input_ap_end_address' type='text' class='input_read_only' disabled v-model='input_ap_end_address' /></div>
                </div>
                <div class='list_right_item'>
                    <div class='attribute_key_text'>- {{mcs_gateway}} </div>
                    <div class='options_float_right'><input id='input_ap_gateway' type='text' class='input_read_only' disabled v-model='input_ap_gateway' /></div>
                </div>
            </div>
            <div id='select_network_li' style='display:none'>
                <div class='list_right_item_ex'>
                    <div class='attribute_key_text'> {{mcs_select_network}} :</div>
                    <div id='ssid_status' class='options_float_right options_status'></div>
                </div>
                <div class='list_right_item_ex'>
                    <div class='attribute_key_text'>- {{mcs_wifi_list}} </div>
                    <div class='options_float_right'>
                        <select id='select_network' style='float:none;'></select>
                        <button id='button_refresh' class='list_right_button' style='margin-top:7px;' @click='refresh_btn'> {{mcs_refresh}} </button>
                    </div>
                </div>
                <div id='user_set_wifi_name_li' style='display:none' class='list_right_item'>
                    <div class='attribute_key_text'>- {{mcs_input_wifi_name}} </div>
                    <div class='options_float_right'>
                        <input type='text' id='user_set_wifi_name' class='normal_input_right' /><span style='font-size:12px;color:#E5393F;line-height:40px;'></span>
                        <!-- <button id='button_connect' class='standard_buttons_white' style='display:none'> {{mcs_connect}} </button> -->
                    </div>
                </div>
                <div id='select_network_password_li' style='display:none' class='list_right_item'>
                    <div class='attribute_key_text'>- {{mcs_password}} </div>
                    <div class='options_float_right'>
                        <input type='password' id='select_network_password' class='normal_input_right' v-model='select_network_password' /><span style='font-size:12px;color:#E5393F;line-height:40px;'></span>
                        <button id='button_connect' class='standard_buttons_white' style='display:none'> {{mcs_connect}} </button>
                    </div>
                </div>
            </div>
            <div id='nic_conn_content' style='display:none;clear:both'>
                <div id='ip_address_content'>
                    <div class='list_right_item_ex'>
                        <div class='options_left_title'>IP :</div>
                        <div id='ip_status' class='options_float_right options_status'></div>
                    </div>
                    <div class='list_right_item_ex'>
                        <div class='attribute_key_text'>- {{mcs_auto_obtain}} </div>
                        <div class='options_float_right'><input type='radio' id='radio_auto_obtain_ip' name='ip' @change='radio_ip_btn' v-model='radio_ip' value='1' /></div>
                    </div>
                    <div id='auto_obtain_ip_content' style='display:none'>
                        <div class='list_right_item'>
                            <div class='attribute_key_text'>&nbsp;&nbsp;-- {{mcs_ip_address}} </div>
                            <div class='options_float_right'><input id='input_auto_ip_address' type='text' class='input_read_only' disabled=true v-model='input_auto_ip_address' /></div>
                        </div>
                        <div class='list_right_item'>
                            <div class='attribute_key_text'>&nbsp;&nbsp;-- {{mcs_gateway}} </div>
                            <div class='options_float_right'><input id='input_auto_gateway' type='text' class='input_read_only' disabled=true v-model='input_auto_gateway' /></div>
                        </div>
                        <div class='list_right_item'>
                            <div class='attribute_key_text'>&nbsp;&nbsp;-- {{mcs_network_mask}} </div>
                            <div class='options_float_right'><input id='input_auto_subnet_mask' type='text' class='input_read_only' disabled=true v-model='input_auto_subnet_mask' /></div>
                        </div>
                    </div>
                    <div class='list_right_item_ex'>
                        <div class='attribute_key_text'>- {{mcs_manually_set}} </div>
                        <div class='options_float_right'><input type='radio' id='radio_use_following_ip' name='ip' @change='radio_ip_btn' v-model='radio_ip' value='0' /></div>
                    </div>
                    <div id='use_following_ip_content' style='display:none'>
                        <div class='list_right_item'>
                            <div class='attribute_key_text'>&nbsp;&nbsp;-- {{mcs_ip_address}} </div>
                            <div class='options_float_right'><input id='input_following_ip_address' type='text' class='normal_input_right' v-model='input_following_ip_address' /></div>
                        </div>
                        <div class='list_right_item'>
                            <div class='attribute_key_text'>&nbsp;&nbsp;-- {{mcs_gateway}} </div>
                            <div class='options_float_right'><input id='input_following_gateway' type='text' class='normal_input_right' v-model='input_following_gateway' /></div>
                        </div>
                        <div class='list_right_item'>
                            <div class='attribute_key_text'>&nbsp;&nbsp;-- {{mcs_network_mask}} </div>
                            <div class='options_float_right'><input id='input_following_subnet_mask' type='text' class='normal_input_right' v-model='input_following_subnet_mask' /></div>
                        </div>
                    </div>
                </div>
                <div id='dns_content'>
                    <div class='list_right_item_ex'>
                        <div class='options_left_title'>DNS :</div>
                        <div id='dns_status' class='options_float_right options_status'></div>
                    </div>
                    <div class='list_right_item_ex'>
                        <div class='attribute_key_text'>- {{mcs_auto_obtain}} </div>
                        <div class='options_float_right'><input type='radio' id='radio_auto_obtain_dns' name='dns' @change='radio_dns_btn' v-model='radio_dns' value='1' /></div>
                    </div>
                    <div id='auto_obtain_dns_content' style='display:none'>
                        <div class='list_right_item'>
                            <div class='attribute_key_text'>&nbsp;&nbsp;-- {{mcs_dns}} </div>
                            <div class='options_float_right'><input id='input_auto_dns' type='text' class='input_read_only' disabled=true v-model='input_auto_dns' /></div>
                        </div>
                        <div class='list_right_item'>
                            <div class='attribute_key_text'>&nbsp;&nbsp;-- {{mcs_secondary_dns}} </div>
                            <div class='options_float_right'><input id='input_auto_alternate_dns' type='text' class='input_read_only' disabled=true v-model='input_auto_alternate_dns' /></div>
                        </div>
                    </div>
                    <div class='list_right_item_ex'>
                        <div class='attribute_key_text'>- {{mcs_manually_set}} </div>
                        <div class='options_float_right'><input type='radio' id='radio_use_following_dns' name='dns' @change='radio_dns_btn' v-model='radio_dns' value='0' /></div>
                    </div>
                    <div id='use_following_dns_content' style='display:none' class='list_right_item'>
                        <div class='list_right_item'>
                            <div class='attribute_key_text'>&nbsp;&nbsp;-- {{mcs_dns}} </div>
                            <div class='options_float_right'><input id='input_following_dns' type='text' class='normal_input_right' v-model='input_following_dns' /></div>
                        </div>
                        <div class='list_right_item'>
                            <div class='attribute_key_text'>&nbsp;&nbsp;-- {{mcs_secondary_dns}} </div>
                            <div class='options_float_right'><input id='input_following_alternate_dns' type='text' class='normal_input_right' v-model='input_following_alternate_dns' /></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <div class='options_float_right' style='clear:both'>
                <button id='button_setup' class='list_right_button' @click='setup_btn'> {{mcs_apply}} </button>
            </div>
        </div>
    </div>
</template>

<script>
    import '@/lib/plugins/jquery.tzSelect.js';
    export default {
        data() {
            return {
                //多国语言
                mcs_network_interface: mcs_network_interface,
                mcs_enabled: mcs_enabled,
                mcs_mac_address: mcs_mac_address,
                mcs_wifi_mode: mcs_wifi_mode,
                mcs_client: mcs_client,
                mcs_ap: mcs_ap,
                mcs_network_status: mcs_network_status,
                mcs_not_connected: mcs_not_connected,
                mcs_dhcp: mcs_dhcp,
                mcs_start_address: mcs_start_address,
                mcs_end_address: mcs_end_address,
                mcs_gateway: mcs_gateway,
                mcs_select_network: mcs_select_network,
                mcs_wifi_list: mcs_wifi_list,
                mcs_refresh: mcs_refresh,
                mcs_input_wifi_name: mcs_input_wifi_name,
                mcs_password: mcs_password,
                mcs_connect: mcs_connect,
                mcs_auto_obtain: mcs_auto_obtain,
                mcs_ip_address: mcs_ip_address,
                mcs_network_mask: mcs_network_mask,
                mcs_manually_set: mcs_manually_set,
                mcs_dns: mcs_dns,
                mcs_secondary_dns: mcs_secondary_dns,
                mcs_apply: mcs_apply,

                l_nic_enabled_status_flag: 1,
                l_nic_conn_status_flag: 0,
                l_nic_wifi_con: 0,
                l_old_version: 0,
                l_ip_is_DHCP: 0,
                l_dns_is_DHCP: 0,
                l_select_net: '',
                l_origin_ethernet_addr: '',
                l_origin_wireless_addr: '',
                l_refresh_timer: '',
                input_status: mcs_not_connected,
                radio_ip: '', //判断IP设置状态
                radio_dns: '', //判断DNS设置状态
                input_mac_address: '', //MAC地址 
                input_auto_ip_address: '', //IP地址
                input_auto_subnet_mask: '', //子网掩码 
                input_auto_gateway: '', //网关 
                input_following_ip_address: '', //手动IP地址
                input_following_subnet_mask: '', //手动子网掩码
                input_following_gateway: '', //手动网关
                select_network_password: '', //密码
                input_auto_dns: '', //DNS
                input_auto_alternate_dns: '', //备用DNS
                input_following_dns: '', //手动DNS 
                input_following_alternate_dns: '', //手动备用DNS
                input_ap_start_address: '', //开始地址
                input_ap_end_address: '', //结束地址
                input_ap_gateway: '', //网关
                network_info: '', // 网络信息
            }
        },
        mounted() {
            let _this = this;
            let l_dom_select_nic = _this.publicFunc.mx("#select_nic");
            let l_dom_select_wifi_mode = _this.publicFunc.mx("#select_wifi_mode");
            let l_dom_button_setup = _this.publicFunc.mx("#button_setup");
            let l_dom_select_network_li = _this.publicFunc.mx("#select_network_li");
            let l_dom_select_network = _this.publicFunc.mx("#select_network");
            let l_dom_select_network_password_li = _this.publicFunc.mx("#select_network_password_li");
            let l_dom_radio_auto_obtain_ip = _this.publicFunc.mx("#radio_auto_obtain_ip");
            let l_dom_radio_use_following_ip = _this.publicFunc.mx("#radio_use_following_ip");
            let l_dom_radio_auto_obtain_dns = _this.publicFunc.mx("#radio_auto_obtain_dns");
            let l_dom_radio_use_following_dns = _this.publicFunc.mx("#radio_use_following_dns");
            let l_swc_bind_func = null
            $("#select_wifi_mode").tzSelect();
            $("#nic_switch_checkbox").iButton({
                labelOn: "On",
                labelOff: "Off",
                change: function() {
                    if (!_this.l_nic_enabled_status_flag) {
                        $("#nic_enabled_content").fadeOut();
                        return;
                    }
                    if (_this.publicFunc.mx("#nic_switch_checkbox").checked) {
                        $("#nic_enabled_content").fadeIn();
                        if (l_dom_select_nic[l_dom_select_nic.selectedIndex].text == mcs_ethernet) {
                            $("#mac_address").fadeIn(450);
                            $("#nic_mode_select").fadeOut();
                            if (_this.l_nic_conn_status_flag) {
                                $("#nic_not_conn_content").fadeIn(450);
                                _this.input_status = mcs_connnected;
                                $("#nic_conn_content").fadeIn(450, function() {
                                    // $("#manager_page").mCustomScrollbar("update"); //未知用法，暂时注释，下同
                                });
                            } else {
                                $("#nic_not_conn_content").fadeIn(450);
                                _this.input_status = mcs_not_connected;
                                $("#nic_conn_content").fadeIn(450, function() {
                                    // $("#manager_page").mCustomScrollbar("update");
                                });
                            }
                        } else if (l_dom_select_nic[l_dom_select_nic.selectedIndex].text == mcs_wifi) {
                            if (!_this.l_nic_conn_status_flag) {
                                _this.l_nic_conn_status_flag = 0;
                                _this.publicFunc.trigger_click(_this.publicFunc.mx("#radio_auto_obtain_ip"));
                                $("#nic_mode_select").fadeOut();
                                $("#nic_ap_mode_content").fadeOut();
                                $("#select_network_li").fadeOut();
                                $("#nic_conn_content").fadeOut(300);
                                _this.input_status = mcs_fault;
                                $("#mac_address").fadeOut();
                                $("#nic_not_conn_content").fadeIn(450);
                                return;
                            }
                            $("#nic_mode_select").fadeIn()
                            l_dom_select_wifi_mode.change_value();
                        }
                    } else {
                        $("#nic_enabled_content").fadeOut();
                        if (l_dom_select_nic[l_dom_select_nic.selectedIndex].text == mcs_wifi) {
                            $("#select_network_li").fadeOut();
                            $("#nic_mode_select").fadeOut();
                        }
                        $("#nic_not_conn_content").fadeOut(300);
                        $("#nic_conn_content").fadeOut(350, function() {
                            $("#manager_page").mCustomScrollbar("update");
                        });
                    }
                }
            });

            l_dom_select_wifi_mode.change_value = function() {
                if (l_dom_select_wifi_mode[l_dom_select_wifi_mode.selectedIndex].text == mcs_client) {
                    $("#nic_ap_mode_content").fadeOut(300);
                    if (_this.l_nic_conn_status_flag) {
                        $("#nic_not_conn_content").fadeIn(450);
                        _this.input_status = _this.l_nic_wifi_con ? mcs_connnected : mcs_not_connected;
                        $("#nic_conn_content").fadeIn(450, function() {
                            $("#manager_page").mCustomScrollbar("update");
                        });
                    } else {
                        $("#nic_conn_content").fadeIn(450);
                        _this.input_status = mcs_not_connected;
                        $("#nic_not_conn_content").fadeIn(450, function() {
                            $("#manager_page").mCustomScrollbar("update");
                        });
                    }
                    if (_this.l_old_version) {
                        network_Business.ctrl({ type: "ccm_get_wifi_list_request" });
                        $(l_dom_button_setup).unbind();
                        $(l_dom_button_setup).bind("click", l_swc_bind_func);
                    } else {
                        $(l_dom_select_network_li).fadeIn();
                        $("#nic_not_conn_content").fadeIn(450);
                        $("#nic_conn_content").fadeIn(450, function() {
                            $("#manager_page").mCustomScrollbar("update");
                        });
                    }
                    _this.refresh_btn();
                } else if (l_dom_select_wifi_mode[l_dom_select_wifi_mode.selectedIndex].text == mcs_ap) {
                    $("#mac_address").fadeIn(450);
                    $(l_dom_select_network_li).fadeOut();
                    $("#nic_conn_content").fadeOut(300);
                    $("#nic_not_conn_content").fadeIn(450);
                    $("#nic_ap_mode_content").fadeIn(450, function() {
                        $("#manager_page").mCustomScrollbar("update");
                    });

                    if (_this.l_old_version) {
                        $(l_dom_button_setup).unbind();
                        $(l_dom_button_setup).bind("click", l_swc_bind_func);
                    }
                }
            }

            //wifi select
            l_dom_select_network.change_value = function() {
                if (this[this.selectedIndex].text === mcs_input_wifi_name) {
                    $(_this.publicFunc.mx("#user_set_wifi_name_li")).fadeIn("normal", function() {
                        $("#manager_page").mCustomScrollbar("update");
                    });
                } else { // 选择其他wifi之后隐藏手动输入框 并清空其中内容
                    _this.publicFunc.mx("#user_set_wifi_name").value = ""
                    $(_this.publicFunc.mx("#user_set_wifi_name_li")).fadeOut();
                }
                //if(_this[_this.selectedIndex].text == mcs_not_select)
                //   $(l_dom_select_network_password_li).fadeOut();
                //else
                $(l_dom_select_network_password_li).fadeIn("normal", function() {
                    $("#manager_page").mCustomScrollbar("update");
                });
                $(l_dom_select_network).tzSelect(null, 1);
            };

            _this.$api.set.get_network({
                sn: _this.$store.state.jumpPageData.selectDeviceIpc
            }).then(res => {
                // console.log(res, 'net_get_res')
                _this.network_info = res;
                let net_info = res[0].networks;
                let deviceType = _this.$api.devlist.ldev_get(_this.$store.state.jumpPageData.selectDeviceIpc).type // 设备类型(摄像头IPC/云盒子BOX)
                if (net_info) {
                    let inner_html = "";
                    for (let i = 0; i < net_info.length; ++i) {
                        if (net_info[i].token == "eth0") {
                            if (res[1] && res[1].select == mcs_ethernet) {
                                inner_html += "<option value ='" + i + "' selected='selected'>" + mcs_ethernet + "</option>";
                            } else {
                                inner_html += "<option value ='" + i + "'>" + mcs_ethernet + "</option>";
                            }
                        } else if (net_info[i].token == "ra0" && deviceType !== "BOX" && res[0].wwan_exist != "existence") { // 云盒子和4G设备网络设置中不含有wifi配置
                            if (res[1] && res[1].select == mcs_wifi) {
                                inner_html += "<option value ='" + i + "' selected='selected'>" + mcs_wifi + "</option>";
                            } else {
                                inner_html += "<option value ='" + i + "'>" + mcs_wifi + "</option>";
                            }
                        }
                    }
                    $(l_dom_select_nic).html(inner_html);
                    l_dom_select_nic.change_value = function() {
                        if (_this.l_select_net == mcs_wifi) {
                            l_dom_select_nic[1].selected = true;
                            _this.l_select_net = "";
                        } else if (_this.l_select_net == mcs_connnected) {
                            l_dom_select_nic[0].selected = true;
                            _this.l_select_net = "";
                        }
                        $(l_dom_select_nic).tzSelect();

                        _this.l_nic_enabled_status_flag = 0;
                        _this.l_nic_conn_status_flag = 0;
                        _this.l_ip_is_DHCP = 0;

                        // Select the Ethernet
                        if (this[this.selectedIndex].text == mcs_ethernet) {
                            $(l_dom_button_setup).unbind();
                            _this.generate_eth_setup_ex(net_info[this.selectedIndex]);
                        }
                        //Select a wireless network
                        else if (this[this.selectedIndex].text == mcs_wifi) {
                            $(l_dom_button_setup).unbind();
                            _this.generate_wireless_setup_ex(net_info[this.selectedIndex]);
                        }
                        if (res[0].dns) {
                            if (res[0].dns.info.stat == "ok" && !_this.$store.state.jumpPageData.projectFlag) { // vimtag特有内容添加
                                if (_this.publicFunc.mx("#dns_status")) {
                                    _this.publicFunc.mx("#dns_status").setAttribute("title", mcs_connnected);
                                }
                            }
                            // else if (res[0].dns.info.stat == "err") {

                            // }
                            if (res[0].dns.conf.mode == "dhcp") {
                                //net_dns=res[0].dns;
                                _this.input_auto_dns = res[0].dns.info.dns[0] || "0.0.0.0";
                                if (res[0].dns.info.dns.length > 1)
                                    _this.input_auto_alternate_dns = res[0].dns.info.dns[1] || "0.0.0.0";
                                _this.l_dns_is_DHCP = 1;
                                _this.publicFunc.trigger_click(l_dom_radio_auto_obtain_dns);
                            } else if (res[0].dns.conf.mode == "static") {
                                _this.input_following_dns = res[0].dns.conf.static_dns[0] || "0.0.0.0";
                                if (res[0].dns.conf.static_dns.length > 1)
                                    _this.input_following_alternate_dns = res[0].dns.conf.static_dns[1] || "0.0.0.0";
                                _this.l_dns_is_DHCP = 0;
                                _this.publicFunc.trigger_click(l_dom_radio_use_following_dns);
                            }
                        }
                    }
                    l_dom_select_nic.change_value();
                } else {
                    return -1;
                }
            })

        },
        methods: {
            refresh_btn() {
                let l_dom_select_network = this.publicFunc.mx("#select_network");
                this.$api.devlist.wifi_get({ // 设备可连接wifi获取
                    sn: this.$store.state.jumpPageData.selectDeviceIpc
                }).then(res => { //wifi列表最终显示 包含信号强度 ccm_net_get
                    this.publicFunc.mx("#button_refresh").style.color = "#ffffff";
                    this.publicFunc.mx("#button_refresh").style.cursor = "pointer";
                    let inner_html = "";
                    if (res.networks && res.networks[1].token == "ra0" && res.networks[1].wifi_client.ap_list) {
                        let msg_wifi_list = res.networks[1].wifi_client.ap_list;
                        inner_html += "<option>" + mcs_not_select + "</option>"; // 未选择
                        inner_html += "<option>" + mcs_input_wifi_name + "</option>"; // 手动输入
                        for (let i = 0; i < msg_wifi_list.length; ++i) {
                            if (msg_wifi_list[i].ssid == "") continue;
                            if (msg_wifi_list[i].signal < 0) {
                                msg_wifi_list[i].signal = msg_wifi_list[i].signal + 100;
                            }
                            let signal_level = Math.floor(msg_wifi_list[i].signal / 20);
                            signal_level = (signal_level >= 5 ? 4 : signal_level);
                            if (msg_wifi_list[i].connect) {
                                inner_html += "<option value='" + msg_wifi_list[i].ssid + "' selected='selected' front_img='/imgs/device_status_green.png' rear_img='/imgs/wifi_signal" + signal_level + ".png'>" + msg_wifi_list[i].ssid + "</option>";
                            } else {
                                inner_html += "<option value='" + msg_wifi_list[i].ssid + "' rear_img='/imgs/wifi_signal" + signal_level + ".png'>" + msg_wifi_list[i].ssid + "</option>";
                            }
                        }
                        $(l_dom_select_network).html(inner_html);
                        l_dom_select_network.change_value();
                    }
                    $(l_dom_select_network).tzSelect(null, 1);
                })
            },

            setup_btn() { //应用
                let _this = this;
                let l_dom_select_nic = _this.publicFunc.mx("#select_nic");
                let ip_address;
                let ip_refresh = "";
                let origin_connected = "";
                if (_this.$store.state.jumpPageData.selectDeviceIpc && _this.$store.state.jumpPageData.networkEnviron == "private") { //Direct Connect
                    if (_this.l_origin_ethernet_addr == window.location.host) {
                        origin_connected = _this.l_origin_ethernet_addr;
                        if (l_dom_select_nic[l_dom_select_nic.selectedIndex].text == mcs_ethernet && _this.radio_ip && !_this.l_ip_is_DHCP) {
                            ip_refresh = origin_connected;
                        }
                    } else if (_this.l_origin_wireless_addr == window.location.host) {
                        origin_connected = _this.l_origin_wireless_addr;
                        if (l_dom_select_nic[l_dom_select_nic.selectedIndex].text == mcs_wifi && l_dom_radio_auto_obtain_ip.checked && !l_ip_is_DHCP) {
                            ip_refresh = origin_connected;
                        }
                    }
                    if (!_this.radio_ip) {
                        ip_address = _this.input_following_ip_address;
                        if (l_dom_select_nic[l_dom_select_nic.selectedIndex].text == mcs_ethernet) {
                            if ((ip_address != _this.l_origin_ethernet_addr) && (origin_connected == _this.l_origin_ethernet_addr))
                                ip_refresh = ip_address;
                        } else if (l_dom_select_nic[l_dom_select_nic.selectedIndex].text == mcs_wifi) {
                            if ((ip_address != _this.l_origin_wireless_addr) && (origin_connected == _this.l_origin_wireless_addr))
                                ip_refresh = ip_address;
                        }
                    }
                } else {
                    if (_this.radio_ip) {
                        if (!_this.l_ip_is_DHCP) {
                            if (l_dom_select_nic[l_dom_select_nic.selectedIndex].text == mcs_wifi) {
                                ip_refresh = _this.l_origin_wireless_addr;
                            } else if (l_dom_select_nic[l_dom_select_nic.selectedIndex].text == mcs_ethernet) {
                                ip_refresh = _this.l_origin_ethernet_addr;
                            }
                        }
                    } else if (!_this.radio_ip) {
                        ip_address = _this.input_following_ip_address;
                        if (l_dom_select_nic[l_dom_select_nic.selectedIndex].text == mcs_wifi) {
                            if (ip_address != _this.l_origin_wireless_addr)
                                ip_refresh = ip_address;
                        } else if (l_dom_select_nic[l_dom_select_nic.selectedIndex].text == mcs_ethernet) {
                            if (ip_address != _this.l_origin_ethernet_addr)
                                ip_refresh = ip_address;
                        }
                    }
                }
                if (ip_refresh) {
                    let type = _this.$api.devlist.ldev_get(_this.$store.state.jumpPageData.selectDeviceIpc).type;
                    if (type == "IPC" && _this.$store.state.jumpPageData.networkEnviron == "private" || type == "BOX") { //Direct Connect
                        _this.publicFunc.delete_tips({
                            content: mcs_modify_network_prompt,
                            func: function() {
                                _this.ccm_set_network_info_request({
                                    type: l_dom_select_nic[l_dom_select_nic.selectedIndex].text,
                                    ori_net_info: _this.network_info[0],
                                    to: ip_refresh + ":" + location.port,
                                    select: l_dom_select_nic[l_dom_select_nic.selectedIndex].text
                                })
                            }
                        })
                    } else { //Through the server
                        _this.publicFunc.delete_tips({
                            content: mcs_modify_network_prompt,
                            func: function() {
                                _this.ccm_set_network_info_request({
                                    type: l_dom_select_nic[l_dom_select_nic.selectedIndex].text,
                                    ori_net_info: _this.network_info[0],
                                    to: _this.network_info[1].ip,
                                    select: l_dom_select_nic[l_dom_select_nic.selectedIndex].text
                                })
                            }
                        })
                    }
                } else {
                    _this.publicFunc.delete_tips({
                        content: mcs_modify_network_prompt,
                        func: function() {
                            _this.ccm_set_network_info_request({
                                type: l_dom_select_nic[l_dom_select_nic.selectedIndex].text,
                                ori_net_info: _this.network_info[0],
                                to: ip_refresh,
                                select: l_dom_select_nic[l_dom_select_nic.selectedIndex].text
                            })
                        }
                    })
                }
            },

            generate_eth_setup_ex(now_ifs) {
                let l_dom_radio_auto_obtain_ip = this.publicFunc.mx("#radio_auto_obtain_ip");
                let l_dom_radio_use_following_ip = this.publicFunc.mx("#radio_use_following_ip");
                $("#select_network_li").fadeOut();
                $("#nic_ap_mode_content").fadeOut();
                if (now_ifs.enabled) {
                    this.l_nic_enabled_status_flag = 1;
                    if (now_ifs.phy) {
                        this.input_mac_address = now_ifs.phy.info.mac;
                        if (now_ifs.phy.info.stat == "ok") {
                            this.l_nic_conn_status_flag = 1;
                            if (now_ifs.ipv4) {
                                if (now_ifs.ipv4.info.stat === "ok" && !this.$store.state.jumpPageData.projectFlag) { // vimtag特有内容添加
                                    if (this.publicFunc.mx("#ip_status")) {
                                        this.publicFunc.mx("#ip_status").setAttribute("title", mcs_connnected);
                                    }
                                }
                                // else if (now_ifs.ipv4.info.stat == "err") {

                                // }
                                if (now_ifs.ipv4.conf.mode == "dhcp") {
                                    this.l_ip_is_DHCP = 1;
                                    this.input_auto_ip_address = now_ifs.ipv4.info.ip.addr || "0.0.0.0";
                                    this.input_auto_subnet_mask = now_ifs.ipv4.info.ip.mask || "0.0.0.0";
                                    this.input_auto_gateway = now_ifs.ipv4.info.ip.gw || "0.0.0.0";
                                    this.publicFunc.trigger_click(l_dom_radio_auto_obtain_ip);
                                } else if (now_ifs.ipv4.conf.mode == "static") {
                                    this.l_ip_is_DHCP = 0;
                                    this.input_following_ip_address = now_ifs.ipv4.conf.static_ip.addr || "0.0.0.0";
                                    this.input_following_subnet_mask = now_ifs.ipv4.conf.static_ip.mask || "0.0.0.0";
                                    this.input_following_gateway = now_ifs.ipv4.conf.static_ip.gw || "0.0.0.0";
                                    this.publicFunc.trigger_click(l_dom_radio_use_following_ip);
                                }
                                this.l_origin_ethernet_addr = this.l_ip_is_DHCP ? now_ifs.ipv4.info.ip.addr : now_ifs.ipv4.conf.static_ip.addr;
                            }
                        } else if (now_ifs.internet) {
                            if (now_ifs.internet.info.stat == "err") {
                                this.l_nic_conn_status_flag = 0;
                                if (now_ifs.ipv4) {
                                    if (now_ifs.ipv4.info.stat == "ok") {
                                        this.publicFunc.mx("#ip_status").setAttribute("title", mcs_connnected);
                                    }
                                    // else if (now_ifs.ipv4.info.stat == "err") {

                                    // }
                                    if (now_ifs.ipv4.conf.mode == "dhcp") {
                                        this.l_ip_is_DHCP = 1;
                                        this.input_auto_ip_address = now_ifs.ipv4.info.ip.addr || "0.0.0.0";
                                        this.input_auto_subnet_mask = now_ifs.ipv4.info.ip.mask || "0.0.0.0";
                                        this.input_auto_gateway = now_ifs.ipv4.info.ip.gw || "0.0.0.0";
                                        this.publicFunc.trigger_click(l_dom_radio_auto_obtain_ip);
                                    } else if (now_ifs.ipv4.conf.mode == "static") {
                                        this.l_ip_is_DHCP = 0;
                                        this.input_following_ip_address = "0.0.0.0";
                                        this.input_following_subnet_mask = "0.0.0.0";
                                        this.input_following_gateway = "0.0.0.0";
                                        this.publicFunc.trigger_click(l_dom_radio_use_following_ip);
                                    }
                                    this.l_origin_ethernet_addr = this.l_ip_is_DHCP ? now_ifs.ipv4.info.ip.addr : now_ifs.ipv4.conf.static_ip.addr;
                                }
                            }
                        }
                    }
                    $("#nic_switch_checkbox").iButton("toggle", true);
                } else {
                    $("#nic_switch_checkbox").iButton("toggle", false);
                }
            },

            generate_wireless_setup_ex(now_ifs) {
                let l_dom_select_wifi_mode = this.publicFunc.mx("#select_wifi_mode");
                let l_dom_radio_auto_obtain_ip = this.publicFunc.mx("#radio_auto_obtain_ip");
                let l_dom_radio_use_following_ip = this.publicFunc.mx("#radio_use_following_ip");
                let l_dom_select_network_password_li = this.publicFunc.mx("#select_network_password_li");
                let l_dom_select_network = this.publicFunc.mx("#select_network");
                if (now_ifs.enabled) {
                    this.l_nic_enabled_status_flag = 1;
                    // l_network_token = now_ifs.token;
                    if (now_ifs.phy && now_ifs.phy.conf && now_ifs.phy.info) {
                        if (now_ifs.phy.info.stat == "ok") {
                            this.l_nic_conn_status_flag = 1;
                            if (now_ifs.phy.conf.mode == "wificlient") {
                                l_dom_select_wifi_mode[0].selected = true;
                                $(l_dom_select_wifi_mode).tzSelect();
                                this.input_mac_address = now_ifs.phy.info.mac;
                                if (now_ifs.ipv4) {
                                    if (now_ifs.ipv4.info.stat == "ok") {
                                        this.publicFunc.mx("#ip_status").setAttribute("title", mcs_connnected);
                                    }
                                    // else if (now_ifs.ipv4.info.stat == "err") {

                                    // }
                                    if (now_ifs.ipv4.conf.mode == "dhcp") {
                                        this.l_ip_is_DHCP = 1;
                                        this.input_auto_ip_address = now_ifs.ipv4.info.ip.addr || "0.0.0.0";
                                        this.input_auto_subnet_mask = now_ifs.ipv4.info.ip.mask || "0.0.0.0";
                                        this.input_auto_gateway = now_ifs.ipv4.info.ip.gw || "0.0.0.0";
                                        this.publicFunc.trigger_click(l_dom_radio_auto_obtain_ip);
                                    } else if (now_ifs.ipv4.conf.mode == "static") {
                                        this.l_ip_is_DHCP = 0;
                                        this.input_following_ip_address = now_ifs.ipv4.conf.static_ip.addr || "0.0.0.0";
                                        this.input_following_subnet_mask = now_ifs.ipv4.conf.static_ip.mask || "0.0.0.0";
                                        this.input_following_gateway = now_ifs.ipv4.conf.static_ip.gw || "0.0.0.0";
                                        this.publicFunc.trigger_click(l_dom_radio_use_following_ip);
                                    }
                                    this.l_origin_wireless_addr = this.l_ip_is_DHCP ? now_ifs.ipv4.info.ip.addr : now_ifs.ipv4.conf.static_ip.addr;
                                }
                                this.input_ap_start_address = "192.168.188.100";
                                this.input_ap_end_address = "192.168.188.253";
                                this.input_ap_gateway = "192.168.188.254";

                                l_dom_select_wifi_mode.change_value();
                            } else if (now_ifs.phy.conf.mode == "adhoc") {
                                l_dom_select_wifi_mode[1].selected = true;
                                $(l_dom_select_wifi_mode).tzSelect();
                                if (now_ifs.dhcp_srv) {
                                    this.input_ap_start_address = now_ifs.dhcp_srv.conf.ip_start;
                                    this.input_ap_end_address = now_ifs.dhcp_srv.conf.ip_end;
                                    this.input_ap_gateway = now_ifs.dhcp_srv.conf.gw;

                                    this.publicFunc.mx("#ip_status").style.cssText = "";
                                    this.input_following_ip_address = "";
                                    this.input_following_subnet_mask = "";
                                    this.input_following_gateway = "";

                                    if (now_ifs.ipv4.conf.mode == "dhcp") {
                                        this.publicFunc.trigger_click(l_dom_radio_auto_obtain_ip);
                                    } else if (now_ifs.ipv4.conf.mode == "static") {
                                        this.input_following_ip_address = now_ifs.ipv4.conf.static_ip.addr || "0.0.0.0";
                                        this.input_following_subnet_mask = now_ifs.ipv4.conf.static_ip.mask || "0.0.0.0";
                                        this.input_following_gateway = now_ifs.ipv4.conf.static_ip.gw || "0.0.0.0";
                                        this.publicFunc.trigger_click(l_dom_radio_use_following_ip);
                                    }
                                }
                                l_dom_select_wifi_mode.change_value();
                            } else if (now_ifs.phy.conf.mode == "monitor") {
                                l_dom_select_wifi_mode[0].selected = true;
                                $(l_dom_select_wifi_mode).tzSelect();
                                //When in WiFi intelligent configuration mode, hide options
                                l_dom_select_wifi_mode.change_value();
                            }
                            if (now_ifs.wifi_client.ap_list) {
                                let signal_level = 0;
                                let inner_html = "";
                                let wifi_list = now_ifs.wifi_client.ap_list;
                                inner_html += "<option>" + mcs_not_select + "</option>";
                                inner_html += "<option>" + mcs_input_wifi_name + "</option>"; // 手动输入

                                if (now_ifs.wifi_client.info.stat == "ok") {
                                    this.l_nic_wifi_con = 1;
                                    this.publicFunc.mx("#ssid_status").setAttribute("title", mcs_connnected);
                                    this.publicFunc.mx("/span", l_dom_select_network_password_li)[0].innerHTML = "";
                                    for (let i = 0; i < wifi_list.length; ++i) {
                                        if (wifi_list[i].ssid == "") continue;
                                        if (wifi_list[i].signal < 0) {
                                            wifi_list[i].signal = wifi_list[i].signal + 100;
                                        }
                                        if (wifi_list[i].quality >= 0 && wifi_list[i].quality <= 100) {
                                            signal_level = Math.floor(wifi_list[i].signal / 20);
                                            signal_level = (signal_level >= 5 ? 4 : signal_level);
                                        }
                                        if (wifi_list[i].connect) {
                                            inner_html += "<option value='" + wifi_list[i].ssid + "' selected='selected' front_img='/imgs/device_status_green.png' rear_img='/imgs/wifi_signal" + signal_level + ".png'>" + wifi_list[i].ssid + "</option>";
                                        } else {
                                            inner_html += "<option value='" + wifi_list[i].ssid + "' rear_img='/imgs/wifi_signal" + signal_level + ".png'>" + wifi_list[i].ssid + "</option>";
                                        }
                                    }
                                    this.select_network_password = now_ifs.wifi_client.conf.key;
                                } else {
                                    $(l_dom_select_network_password_li).fadeIn("normal", function() {
                                        $("#manager_page").mCustomScrollbar("update");
                                    });
                                    if (now_ifs.wifi_client.info.stat == "err" && now_ifs.wifi_client.usr) {
                                        this.l_nic_wifi_con = 0;
                                        this.publicFunc.mx("#ssid_status").setAttribute("title", mcs_connect_fail);
                                        this.publicFunc.mx("/span", l_dom_select_network_password_li)[0].innerHTML = "&nbsp;&nbsp;&nbsp; " + mcs_connect_fail;
                                    } else if (now_ifs.wifi_client.info.stat == "info.connecting") {
                                        this.publicFunc.mx("#ssid_status").setAttribute("title", mcs_connecting);
                                        this.publicFunc.mx("/span", l_dom_select_network_password_li)[0].innerHTML = "&nbsp;&nbsp;&nbsp; " + mcs_connecting;
                                    } else
                                        this.publicFunc.mx("/span", l_dom_select_network_password_li)[0].innerHTML = "";
                                    for (let i = 0; i < wifi_list.length; ++i) {
                                        if (wifi_list[i].ssid == "") continue;
                                        if (wifi_list[i].signal < 0) {
                                            wifi_list[i].signal = wifi_list[i].signal + 100;
                                        }
                                        if (wifi_list[i].quality >= 0 && wifi_list[i].quality <= 100) {
                                            signal_level = Math.floor(wifi_list[i].signal / 20);
                                            signal_level = (signal_level >= 5 ? 4 : signal_level);
                                        }
                                        if (wifi_list[i].ssid == now_ifs.wifi_client.conf.ssid) {
                                            inner_html += "<option value='" + wifi_list[i].ssid + "' selected='selected' front_img='/imgs/device_status_yellow.png' rear_img='/imgs/wifi_signal" + signal_level + ".png'>" + wifi_list[i].ssid + "</option>";
                                        } else {
                                            inner_html += "<option value='" + wifi_list[i].ssid + "' rear_img='/imgs/wifi_signal" + signal_level + ".png'><pre>" + wifi_list[i].ssid + "</pre></option>";
                                        }
                                    }
                                }
                                $(l_dom_select_network).html(inner_html);
                            }
                            $(l_dom_select_network).tzSelect(null, 1);
                        } else if (now_ifs.phy.info.stat == "err") {
                            this.l_nic_conn_status_flag = 0;
                            this.publicFunc.trigger_click(l_dom_radio_auto_obtain_ip);
                            $("#nic_mode_select").fadeOut();
                            $("#nic_ap_mode_content").fadeOut();
                            $("#select_network_li").fadeOut();
                            $("#nic_conn_content").fadeOut(300);
                            this.input_status = mcs_fault;
                            $("#mac_address").fadeOut();
                            return;
                        }
                    }
                    $("#nic_switch_checkbox").iButton("toggle", true);
                } else {
                    $("#nic_switch_checkbox").iButton("toggle", false);
                }
            },

            ccm_set_network_info_request(obj) { //Set network parameters
                let _this = this;
                let l_dom_select_nic = _this.publicFunc.mx("#select_nic");
                let l_dom_radio_auto_obtain_ip = _this.publicFunc.mx("#radio_auto_obtain_ip");
                let l_dom_radio_use_following_ip = _this.publicFunc.mx("#radio_use_following_ip");
                let l_dom_select_wifi_mode = _this.publicFunc.mx("#select_wifi_mode");
                let l_dom_select_network = _this.publicFunc.mx("#select_network");
                let l_dom_button_setup = _this.publicFunc.mx("#button_setup");
                let l_dom_radio_auto_obtain_dns = _this.publicFunc.mx("#radio_auto_obtain_dns");
                let l_dom_radio_use_following_dns = _this.publicFunc.mx("#radio_use_following_dns");
                let node_sn = _this.$store.state.jumpPageData.selectDeviceIpc;
                let node = _this.$api.devlist.ldev_get(node_sn);
                let count = 0
                let net_info = obj.ori_net_info.networks;
                let now_ifs;
                let now_net_info = {};
                if (!node) return;

                for (let i = 0; i < net_info.length; ++i) {
                    if (net_info[i].enabled)
                        ++count;
                }
                now_ifs = net_info[l_dom_select_nic.selectedIndex];
                if (obj.type == mcs_ethernet) {
                    if (_this.publicFunc.mx("#nic_switch_checkbox").checked) {
                        if (_this.l_nic_enabled_status_flag) {
                            now_net_info["ifs"] = { token: now_ifs.token, enabled: 1 };
                            //Automatically obtain ip
                            if (l_dom_radio_auto_obtain_ip.checked) {
                                now_net_info.ifs["ipv4"] = { conf: { enabled: now_ifs.ipv4.conf.enabled, mode: "dhcp", static_ip: "", debug_ip: "" } };
                            } else if (l_dom_radio_use_following_ip.checked) { //Manually set ip
                                now_net_info.ifs["ipv4"] = {
                                    conf: {
                                        enabled: now_ifs.ipv4.conf.enabled,
                                        mode: "static",
                                        static_ip: {
                                            addr: _this.input_following_ip_address,
                                            gw: _this.input_following_gateway,
                                            mask: now_ifs.ipv4.conf.static_ip ? now_ifs.ipv4.conf.static_ip.mask : ""
                                        },
                                        debug_ip: now_ifs.ipv4.conf.debug_ip
                                    }
                                };
                                if (subnet_mask_available_and_trans({ data: _this.input_following_subnet_mask }) >= 0)
                                    now_net_info.ifs.ipv4.conf.static_ip.mask = _this.input_following_subnet_mask;
                                else {
                                    _this.publicFunc.msg_tips({ msg: mcs_subnet_mask_wrong_format, type: "error", timeout: 3000 })
                                    return;
                                }
                            }
                        } else {
                            now_net_info["ifs"] = { token: now_ifs.token, enabled: 1 };
                        }
                    } else { //Close Ethernet connection
                        if (count < 2) {
                            _this.publicFunc.msg_tips({ msg: mcs_not_allowed_close_two_network_cards, type: "error", timeout: 3000 })
                            return;
                        } else
                            now_net_info["ifs"] = { token: now_ifs.token, enabled: 0 };
                    }
                } else if (obj.type == mcs_wifi) {
                    if (_this.publicFunc.mx("#nic_switch_checkbox").checked) {
                        if (_this.l_nic_enabled_status_flag) {
                            now_net_info["ifs"] = { token: now_ifs.token, enabled: 1 };
                            //if(_this.publicFunc.mx("#nic_mode_switch_checkbox").checked)             //client
                            if (l_dom_select_wifi_mode[l_dom_select_wifi_mode.selectedIndex].text == mcs_client) {
                                now_net_info.ifs["phy"] = { conf: { mode: "wificlient", mtu: now_ifs.phy.conf.mtu } };
                                if (_this.radio_ip) {
                                    now_net_info.ifs["ipv4"] = { conf: { enabled: now_ifs.ipv4.conf.enabled, mode: "dhcp", static_ip: "", debug_ip: "" } };
                                } else if (!_this.radio_ip) {
                                    now_net_info.ifs["ipv4"] = {
                                        conf: {
                                            enabled: now_ifs.ipv4.conf.enabled,
                                            mode: "static",
                                            static_ip: {
                                                addr: _this.input_following_ip_address,
                                                gw: _this.input_following_gateway,
                                                mask: now_ifs.ipv4.conf.static_ip ? now_ifs.ipv4.conf.static_ip.mask : ""
                                            },
                                            debug_ip: now_ifs.ipv4.conf.debug_ip
                                        }
                                    };
                                    if (subnet_mask_available_and_trans({ data: _this.input_following_subnet_mask }) >= 0)
                                        now_net_info.ifs.ipv4.conf.static_ip.mask = _this.input_following_subnet_mask;
                                    else {
                                        _this.publicFunc.msg_tips({ msg: mcs_subnet_mask_wrong_format, type: "error", timeout: 3000 })
                                        return;
                                    }
                                }

                                if (_this.publicFunc.mx("#user_set_wifi_name").value !== "" || l_dom_select_network[l_dom_select_network.selectedIndex].text === mcs_input_wifi_name) { //如果是手动输入的话传递值取输入框中的内容 (后续添加判断选中值为手动输入)
                                    now_net_info.ifs["wifi_client"] = {
                                        conf: {
                                            enabled: 1,
                                            ssid: _this.publicFunc.mx("#user_set_wifi_name").value,
                                            usr: _this.publicFunc.mx("#user_set_wifi_name").value,
                                            key: _this.select_network_password
                                        }
                                    };
                                } else {
                                    now_net_info.ifs["wifi_client"] = {
                                        conf: {
                                            enabled: 1,
                                            ssid: l_dom_select_network[l_dom_select_network.selectedIndex].value,
                                            usr: l_dom_select_network[l_dom_select_network.selectedIndex].value,
                                            key: _this.select_network_password
                                        }
                                    };
                                }
                            } else if (l_dom_select_wifi_mode[l_dom_select_wifi_mode.selectedIndex].text == mcs_ap) //adhoc
                            {
                                now_net_info.ifs["phy"] = { conf: { mode: "adhoc", mtu: now_ifs.phy.conf.mtu } };
                                now_net_info.ifs["dhcp_srv"] = {
                                    conf: {
                                        enabled: now_ifs.dhcp_srv.conf.enabled,
                                        gw: _this.input_ap_gateway,
                                        ip_start: _this.input_ap_start_address,
                                        ip_end: _this.input_ap_end_address
                                    }
                                }
                            }
                        } else {
                            now_net_info["ifs"] = { token: now_ifs.token, enabled: 1 };
                        }
                    } else {
                        if (count < 2) {
                            _this.publicFunc.msg_tips({ msg: mcs_not_allowed_close_two_network_cards, type: "error", timeout: 3000 })
                            return;
                        } else
                            now_net_info["ifs"] = { token: now_ifs.token, enabled: 0 };
                    }
                }

                if (_this.l_nic_enabled_status_flag) {
                    if (_this.radio_dns) {
                        now_net_info["dns"] = { conf: { enalbed: obj.ori_net_info.dns.conf.enabled, mode: "dhcp", static_dns: obj.ori_net_info.dns.conf.static_dns } };
                    } else if (!_this.radio_dns) {
                        now_net_info["dns"] = {
                            conf: {
                                enalbed: obj.ori_net_info.dns.conf.enabled,
                                mode: "static",
                                static_dns: [_this.input_following_dns, _this.input_following_alternate_dns]
                            }
                        };
                    }
                }

                _this.$api.set.set_network({
                    sn: _this.$store.state.jumpPageData.selectDeviceIpc,
                    networks: now_net_info.ifs,
                    dns: now_net_info.dns,
                    select: l_dom_select_nic[l_dom_select_nic.selectedIndex].text
                }).then(res => {
                    if (res.type == "success") {
                        _this.publicFunc.msg_tips({ msg: mcs_set_successfully, type: "success", timeout: 3000 })
                        _this.l_refresh_timer = setInterval(function() {
                            _this.$api.set.get_network({
                                sn: _this.$store.state.jumpPageData.selectDeviceIpc,
                                select: res.select
                            }).then(res => {
                                _this.$store.state.jumpPageData.systemStopWait();
                                clearInterval(_this.l_refresh_timer);
                                let net_info = msg.networks;
                                if (net_info) {
                                    let inner_html = "";
                                    for (let i = 0; i < net_info.length; ++i) {
                                        if (net_info[i].token == "eth0")
                                            if (res[1] && res[1].select == mcs_ethernet)
                                                inner_html += "<option value ='" + i + "' selected='selected'>" + mcs_ethernet + "</option>";
                                            else
                                                inner_html += "<option value ='" + i + "'>" + mcs_ethernet + "</option>";
                                        else if (net_info[i].token == "ra0")
                                            if (res[1] && res[1].select == mcs_wifi)
                                                inner_html += "<option value ='" + i + "' selected='selected'>" + mcs_wifi + "</option>";
                                            else
                                                inner_html += "<option value ='" + i + "'>" + mcs_wifi + "</option>";
                                    }
                                    $(l_dom_select_nic).html(inner_html);
                                    //Ethernet and wireless network selection
                                    l_dom_select_nic.change_value = function() {
                                        if (_this.l_select_net == mcs_wifi) {
                                            l_dom_select_nic[1].selected = true;
                                            l_select_net = "";
                                        } else if (l_select_net == mcs_connnected) {
                                            l_dom_select_nic[0].selected = true;
                                            l_select_net = "";
                                        }
                                        $(l_dom_select_nic).tzSelect();
                                        _this.l_nic_enabled_status_flag = 0;
                                        _this.l_nic_conn_status_flag = 0;
                                        _this.l_ip_is_DHCP = 0;
                                        //Select the Ethernet
                                        if (this[this.selectedIndex].text == mcs_ethernet) {
                                            $(l_dom_button_setup).unbind();
                                            _this.generate_eth_setup_ex(net_info[_this.selectedIndex]);
                                        }
                                        //Select a wireless network
                                        else if (_this[_this.selectedIndex].text == mcs_wifi) {
                                            $(l_dom_button_setup).unbind();
                                            _this.generate_wireless_setup_ex(net_info[_this.selectedIndex]);
                                        }
                                        if (res[0].dns) {
                                            if (res[0].dns.info.stat == "ok") {
                                                // if (!g_domain_oems_vimtag) background_img_set(_this.publicFunc.mx("#dns_status"), sub_img_status0);
                                                _this.publicFunc.mx("#dns_status").setAttribute("title", mcs_connnected);
                                            }
                                            // else if (res[0].dns.info.stat == "err") {
                                            //   if (!g_domain_oems_vimtag) background_img_set(_this.publicFunc.mx("#dns_status"), sub_img_status1);
                                            // }
                                            if (res[0].dns.conf.mode == "dhcp") {
                                                //net_dns=res[0].dns;
                                                _this.input_auto_dns = res[0].dns.info.dns[0] || "0.0.0.0";
                                                if (res[0].dns.info.dns.length > 1)
                                                    _this.input_auto_alternate_dns = res[0].dns.info.dns[1] || "0.0.0.0";
                                                _this.l_dns_is_DHCP = 1;
                                                _this.publicFunc.trigger_click(l_dom_radio_auto_obtain_dns);
                                            } else if (res[0].dns.conf.mode == "static") {
                                                _this.input_following_dns = res[0].dns.conf.static_dns[0] || "0.0.0.0";
                                                if (res[0].dns.conf.static_dns.length > 1)
                                                    _this.input_following_alternate_dns = res[0].dns.conf.static_dns[1] || "0.0.0.0";
                                                _this.l_dns_is_DHCP = 0;
                                                _this.publicFunc.trigger_click(l_dom_radio_use_following_dns);
                                            }
                                        }
                                        // else {
                                        // }
                                        //Apply Click event
                                        $(l_dom_button_setup).bind("click", function() {
                                            let ip_address, ip_refresh = "",
                                                origin_connected = "";
                                            if (_this.$store.state.jumpPageData.selectDeviceIpc && _this.$store.state.jumpPageData.networkEnviron == "private") //Direct Connect
                                            {
                                                if (l_origin_ethernet_addr == window.location.host) {
                                                    origin_connected = l_origin_ethernet_addr;
                                                    if (l_dom_select_nic[l_dom_select_nic.selectedIndex].text == mcs_ethernet && l_dom_radio_auto_obtain_ip.checked && !l_ip_is_DHCP) {
                                                        ip_refresh = origin_connected;
                                                    }
                                                } else if (l_origin_wireless_addr == window.location.host) {
                                                    origin_connected = l_origin_wireless_addr;
                                                    if (l_dom_select_nic[l_dom_select_nic.selectedIndex].text == mcs_wifi && l_dom_radio_auto_obtain_ip.checked && !l_ip_is_DHCP) {
                                                        ip_refresh = origin_connected;
                                                    }
                                                }
                                                if (l_dom_radio_use_following_ip.checked) {
                                                    ip_address = l_dom_input_following_ip_address.value;
                                                    if (l_dom_select_nic[l_dom_select_nic.selectedIndex].text == mcs_ethernet) {
                                                        if ((ip_address != l_origin_ethernet_addr) && (origin_connected == l_origin_ethernet_addr))
                                                            ip_refresh = ip_address;
                                                    } else if (l_dom_select_nic[l_dom_select_nic.selectedIndex].text == mcs_wifi) {
                                                        if ((ip_address != l_origin_wireless_addr) && (origin_connected == l_origin_wireless_addr))
                                                            ip_refresh = ip_address;
                                                    }
                                                }
                                            } else {
                                                if (l_dom_radio_auto_obtain_ip.checked) {
                                                    if (!l_ip_is_DHCP) {
                                                        if (l_dom_select_nic[l_dom_select_nic.selectedIndex].text == mcs_wifi) {
                                                            ip_refresh = l_origin_wireless_addr;
                                                        } else if (l_dom_select_nic[l_dom_select_nic.selectedIndex].text == mcs_ethernet) {
                                                            ip_refresh = l_origin_ethernet_addr;
                                                        }
                                                    }
                                                } else if (l_dom_radio_use_following_ip.checked) {
                                                    ip_address = l_dom_input_following_ip_address.value;
                                                    if (l_dom_select_nic[l_dom_select_nic.selectedIndex].text == mcs_wifi) {
                                                        if (ip_address != l_origin_wireless_addr)
                                                            ip_refresh = ip_address;
                                                    } else if (l_dom_select_nic[l_dom_select_nic.selectedIndex].text == mcs_ethernet) {
                                                        if (ip_address != l_origin_ethernet_addr)
                                                            ip_refresh = ip_address;
                                                    }
                                                }
                                            }
                                            if (ip_refresh) {
                                                let type = _this.$api.devlist.ldev_get(_this.$store.state.jumpPageData.selectDeviceIpc).type;
                                                if (type == "IPC" && _this.$store.state.jumpPageData.networkEnviron == "private" || type == "BOX") { //Direct Connect
                                                    _this.publicFunc.delete_tips({
                                                        content: mcs_modify_network_prompt,
                                                        func: function() {
                                                            ccm_set_network_info_request({
                                                                type: l_dom_select_nic[l_dom_select_nic.selectedIndex].text,
                                                                ori_net_info: res[0],
                                                                to: ip_refresh + ":" + location.port,
                                                                select: l_dom_select_nic[l_dom_select_nic.selectedIndex].text
                                                            })
                                                        }
                                                    })
                                                } else { //Through the server
                                                    _this.publicFunc.delete_tips({
                                                        content: mcs_modify_network_prompt,
                                                        func: function() {
                                                            ccm_set_network_info_request({
                                                                type: l_dom_select_nic[l_dom_select_nic.selectedIndex].text,
                                                                ori_net_info: res[0],
                                                                to: res[1].ip,
                                                                select: l_dom_select_nic[l_dom_select_nic.selectedIndex].text
                                                            })
                                                        }
                                                    })
                                                }
                                            } else {
                                                _this.publicFunc.delete_tips({
                                                    content: mcs_modify_network_prompt,
                                                    func: function() {
                                                        ccm_set_network_info_request({
                                                            type: l_dom_select_nic[l_dom_select_nic.selectedIndex].text,
                                                            ori_net_info: res[0],
                                                            to: ip_refresh,
                                                            select: l_dom_select_nic[l_dom_select_nic.selectedIndex].text
                                                        })
                                                    }
                                                })
                                            }
                                        });
                                    };
                                    l_dom_select_nic.change_value();
                                } else {
                                    return -1;
                                }
                            })
                        }, 3500);
                    } else {
                        _this.publicFunc.msg_tips({ msg: res.msg, type: res.type, timeout: 3000 })
                    }
                })

                function subnet_mask_available_and_trans(obj) {
                    let ip_pattern = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
                    if (!ip_pattern.test(obj.data)) return -1;

                    let ip_array = obj.data.split("."),
                        i, length, value, ip_binary = "";
                    // let ip;
                    length = ip_array.length;
                    for (i = 0; i < length; ++i) {
                        value = parseInt(ip_array[i]);
                        if (value < 0 || value > 255) {
                            return -1;
                        }
                        ip_binary += (value + 256).toString(2).substring(1);
                    }
                    if (-1 != ip_binary.indexOf("01"))
                        return -1;
                    return ip_binary.replace(/0/g, '').length;
                }
            },

            radio_ip_btn() { //切换IP自动/手动设置
                let l_dom_auto_obtain_ip_content = this.publicFunc.mx("#auto_obtain_ip_content");
                let l_dom_use_following_ip_content = this.publicFunc.mx("#use_following_ip_content");
                if (this.radio_ip == 1) { //选择自动
                    $(l_dom_use_following_ip_content).fadeOut("normal", () => {
                        if (this.l_ip_is_DHCP) {
                            $(l_dom_auto_obtain_ip_content).slideDown("normal", function() {
                                // $("#manager_page").mCustomScrollbar("update");
                            });
                        } else {
                            $(l_dom_auto_obtain_ip_content).slideUp("normal", function() {
                                // $("#manager_page").mCustomScrollbar("update");
                            });
                        }
                    });
                } else { //选择手动
                    $(l_dom_auto_obtain_ip_content).fadeOut("normal", function() {
                        $(l_dom_use_following_ip_content).slideDown("normal", function() {
                            // $("#manager_page").mCustomScrollbar("update");
                        });
                    });
                }
            },

            radio_dns_btn() { //切换DNS自动/手动设置
                let l_dom_use_following_dns_content = this.publicFunc.mx("#use_following_dns_content");
                let l_dom_auto_obtain_dns_content = this.publicFunc.mx("#auto_obtain_dns_content");
                if (this.radio_dns == 1) { //选择自动
                    $(l_dom_use_following_dns_content).slideUp("normal", () => {
                        if (this.l_dns_is_DHCP)
                            $(l_dom_auto_obtain_dns_content).slideDown("normal", function() {
                                // $("#manager_page").mCustomScrollbar("update");
                            });
                        else
                            $(l_dom_auto_obtain_dns_content).slideUp("normal", function() {
                                // $("#manager_page").mCustomScrollbar("update");
                            });
                    });
                } else { //选择手动
                    $(l_dom_use_following_dns_content).slideDown("normal", function() {
                        $(l_dom_auto_obtain_dns_content).slideUp("normal", function() {
                            // $("#manager_page").mCustomScrollbar("update");
                        });
                    });
                }
            }
        }
    }
</script>

<style lang='scss' scoped>
    .list_right_box {
        width: 520px;
        margin: 0 auto;
    }

    .options_left_title {
        clear: both;
        float: left;
        font-size: 14px;
        line-height: 40px;
    }
</style>