(function(window) {
    
    function get_test_list(type)
    {
        return type?
        {
            appearance:{quest:"外观是否正常？"},
            equ_conn:{quest:"是否已连接设备？（插入SD卡，连接网线，连接电源）"},
            infrared_lamp:{quest:"红外灯是否正常？（全部常亮，无裂开）"},
            yuntai:{quest:"云台是否正常？"},
            scan:{quest:"云台是否正常？"},
            peripheral:{quest:"是否搜到外设？"},
            wifi_list:{quest:"wifi强度是否正常？"},
            wifi_connect:{quest:""},
            focusing:{quest:"调焦是否成功？"},
            color_correction:{quest:"校色是否成功？"},
            grey_board:{quest:"测试灰板是否成功？"},
            sd_info:{quest:""},
            set_alarm_action:{quest:"IO报警是否正常？"},
            audio_out:{quest:"外置音频是否正常？"},
            audio_in:{quest:"内置音频是否正常？"},
            low_light:{quest:"低照度是否正常？"},
            high_light:{quest:"高照度是否正常？"},
            wifi_ip:{quest:"无线IP是否正常？"},
            wps:{quest:"WPS是否正常？（按下Fn键后，黄绿灯交替闪烁一次）"},
            check_id:{quest:"ID是否正确？（对照屏幕左侧设备列表）"},
            pass:{quest:"是否已写代码、贴PASS？"},
            reset:{quest:"是否已恢复出厂设置？（戳Reset键，红外灯全部常亮）"},
            sd_push:{quest:"是否已拔出SD卡？"},
            peripheral:{quest:""},
            rf:{quest:""}
        }:
        {
            wifi_list:{quest:"wifi搜索功能是否正常？"},
            wifi_connect:{quest:""},
            sd_info:{quest:""},
            set_alarm_action:{quest:"IO报警是否正常？"},
            play:{quest:"视频显示是否正常？"},
            talk:{quest:"对讲是否正常？"},
            night:{quest:"夜间模式功能是否正常？"},
            day:{quest:"白天模式功能是否正常？"},
            auto:{quest:"自动模式功能是否正常？"},
            scan:{quest:"云台是否正常？"},
            wps:{quest:"wps功能是否正常？"},
            peripheral:{quest:""},
            rf:{quest:""}
        };
    }
    
    function get_test_list_innerHTML(type)
    {
        return type?
            (
            "<li id='appearance_li'>1. <input type='checkbox' id='appearance'/>外观<span id='appearance_span'></span></li>"
            +"<li id='equ_conn_li'>2. <input type='checkbox' id='equ_conn'/>连接设备<span id='equ_conn_span'></span></li>"
            +"<li id='infrared_lamp_li'>3. <input type='checkbox' id='infrared_lamp'/>红外灯<span id='infrared_lamp_span'></span></li>"
            +"<li id='scan_li'>4. <input type='checkbox' id='scan'/>云台<span id='scan_span'></span></li>"
            // +"<li id='yuntai_li'>4. <input type='checkbox' id='yuntai'/>云台<span id='yuntai_span'></span></li>"
            +"<li id='wifi_li'>5. <input type='checkbox' id='wifi_list'/>WiFi搜索<span id='wifi_list_span'></span></li>"
            +"<li id='wifi_connect_li'>6. <input type='checkbox' id='wifi_connect'/>WiFi连接<span id='wifi_connect_span'></span></li>"
            +"<li id='focusing_li'>7. <input type='checkbox' id='focusing'/>调焦<span id='focusing_span'></span></li>"
            +"<li id='color_correction_li'>8. <input type='checkbox' id='color_correction'/>校色<span id='color_correction_span'></span></li>"
            +"<li id='grey_board_li'>9. <input type='checkbox' id='grey_board'/>灰板<span id='grey_board_span'></span></li>"
            +"<li id='sd_li'>10.<input type='checkbox' id='sd_info'/>SD卡<span id='sd_info_span'></span></li>"
            +"<li id='io_li'>11.<input type='checkbox' id='set_alarm_action'/>IO报警<span id='set_alarm_action_span'></span></li>"
            +"<li id='audio_out_li'>12.<input type='checkbox' id='audio_out'/>外置音频<span id='audio_out_span'></span></li>"
            +"<li id='audio_in_li'>13.<input type='checkbox' id='audio_in'/>内置音频<span id='audio_in_span'></span></li>"
            +"<li id='low_light_li'>14.<input type='checkbox' id='low_light'/>低照度<span id='low_light_span'></span></li>"
            +"<li id='high_light_li'>15.<input type='checkbox' id='high_light'/>高照度<span id='high_light_span'></span></li>"
            +"<li id='wifi_ip_li'>16.<input type='checkbox' id='wifi_ip'/>无线IP<span id='wifi_ip_span'></span></li>"
            +"<li id='wps_li'>17.<input type='checkbox' id='wps'/>WPS<span id='wps_span'></span></li>"
            //+"<li id='peripheral_li'>18.<input type='checkbox' id='peripheral'/>RF(433)<span id='peripheral_span'></span></li>"
            +"<li id='rf_li'>18.<input type='checkbox' id='rf'/>外设搜索<span id='rf_span'></span></li>"
            // +"<li id='rf_li'>18.<input type='checkbox' id='rf'/>外设搜索<span id='rf_span'></span></li>"
            +"<li id='check_id_li'>19.<input type='checkbox' id='check_id'/>核对ID<span id='check_id_span'></span></li>"
            +"<li id='pass_li'>20.<input type='checkbox' id='pass'/>写代码贴PASS<span id='pass_span'></span></li>"
            +"<li id='reset_li'>21.<input type='checkbox' id='reset'/>恢复出厂<span id='reset_span'></span></li>"
            +"<li id='sd_push_li'>22.<input type='checkbox' id='sd_push'/>取出SD卡<span id='sd_push_span'></span></li>"
            ):
            (
            "<li id='wifi_li'>1. <input type='checkbox' id='wifi_list'/>WiFi搜索<span id='wifi_list_span'></span></li>"
            +"<li id='wifi_connect_li'>2. <input type='checkbox' id='wifi_connect'/>WiFi连接<span id='wifi_connect_span'></span></li>"
            +"<li id='sd_li'>3. <input type='checkbox' id='sd_info'/>SD卡<span id='sd_info_span'></span></li>"
            +"<li id='io_li'>4. <input type='checkbox' id='set_alarm_action'/>IO报警<span id='set_alarm_action_span'></span></li>"
            +"<li id='talk_li'>6. <input type='checkbox' id='talk'/>对讲<span id='talk_span'></span></li>"
            +"<li id='night_li'>7. <input type='checkbox' id='night'/>夜间模式<span id='night_span'></span></li>"
            +"<li id='day_li'>8. <input type='checkbox' id='day'/>白天模式<span id='day_span'></span></li>"
            +"<li id='auto_li'>9. <input type='checkbox' id='auto'/>自动模式<span id='auto_span'></span></li>"
            +"<li id='scan_li'>10.<input type='checkbox' id='scan'/>云台<span id='scan_span'></span></li>"
            +"<li id='wps_li'>11.<input type='checkbox' id='wps'/>WPS<span id='wps_span'></span></li>"
            //+"<li id='peripheral_li'>12.<input type='checkbox' id='peripheral'/>RF(433)<span id='peripheral_span'></span></li>"
            +"<li id='rf_li'>12.<input type='checkbox' id='rf'/>外设搜索<span id='rf_span'></span></li>"
            );
    }
    
    window.web_test_list = {
        get_test_list:get_test_list,
        get_test_list_innerHTML:get_test_list_innerHTML
    };
})(window); 