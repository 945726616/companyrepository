(function(window) {

    var g_refreshTimeoutID,g_devsNum,g_play_button,g_device_list_ul,g_record_button,g_talk_button,g_dev_default_pass,
        g_devs=[],g_selectedDevice,g_playing_mme,g_record_flag,g_activation_div,g_ip_start_input,
        g_ip_end_input,g_test_ul,g_test_result_div,g_test_array_names=[],g_test_array_index,g_test_select_array=[],g_test_checkbox,
        g_main_page_div,g_auto_refresh_input,g_dev_upgrade_div,g_version_info_span,g_restore_div,g_valid_version,
        g_upgrade_button,g_dev_site_div,g_view_page,g_sd_info_flag,g_set_mode_flag,g_wifi_list_flag,g_alarm_action_flag,
        g_auto_test_flag,g_default_pass_input,g_test_button,g_wifi_ssid_input,g_wifi_pass_input,g_play_flag,g_wifi_connect_flag,
        g_wifi_connect_button,g_switch_versions_button,g_test_arrays,g_test_version;
    var g_mcloud_agent = window.mcloud_agent;
    var g_mcloud_account = window.mcloud_account;
    var g_mlocal_storage = window.mlocal_storage;
    var $ = function(v) {return document.getElementById(v);};
    var g_inner_window_info = {dom_id:("inner_window1"), video_chls:null, audio_chls:null, mme:null, ipc_state:"", node_sn:""};
    var g_test_select=new Array();

 

function sign_in_(){
    g_mcloud_agent.sign_in({srv : g_selectedDevice.ip,user : g_selectedDevice.name,password : g_default_pass_input.value}, null,
        function(msg, ref) {
            if(msg.result==""){
               // $("result").textContent="sign ok";
                test_admin_();
            }else{
               // $("result").textContent="sign failed";
            }

        });
}

    function test(type) {

		switch(type)
		{
		    case "init":
		        init();
		        break;
		    case "switch_versions":
                init_test_list(switch_versions_button.textContent=="切换到所有"?1:0);
		        break;
		    case "refresh_device":
		        set_button_disable(true);
		        if(g_refresh_device_button.textContent!="搜索")
		        {
		            if(g_refreshTimeoutID)clearTimeout(g_refreshTimeoutID);
		            g_refresh_device_button.textContent="搜索";
		            return;
		        }
		        refresh_devs();
		        break;

            case "info":
                test_info_();
                break;
            case "nick":
                test_nick_();
                break;
            case "osd":
              //  sign_in_();
                test_osd_();
                break;
            case "admin":
                test_admin_();
                break;
            case "box":
                test_box_();
                break;
            case "guest":
                test_guest_();
                break;
            case "sd":
                test_sd_();
                break;
            case "net":
                test_net_();
                break;
            case "date":
                test_date_();
                break;
            case "plan":
                test_plan_();
                break;
            case "alert":
                test_alert_();
                break;
            case "connect":
                test_connect_()
                break;
            case "audio":
                test_audio_();
                break;

            case "mode":
                test_mode_();
                break;
            case "misc":
                test_misc_();
                break;
            case "pic":
                test_pic_();
                break;
            case "system":
                test_system_();
                break;
            case "direct":
                test_direct_();
                break;
            case "dev_start":
                test_dev_start_();
                break;
            case "date_syn":
                test_date_syn_();
                break;
            case "sys_timezone":
                test_sys_timezone_();
                break;
            case "wifi_get":
                test_wifi_get_();
                break;
            case "wifi_connect":
                test_wifi_connect_();
                break;
            case "wifi_ip":
                test_wifi_ip_();
                break;
            case "wifi_set":
                test_wifi_set_();
                break;
            case "osd_set":
                test_osd_set_();
                break;
            case "isp_set":
                test_isp_set_();
                break;
            case "dev_flip":
                test_dev_flip_();
                break;

            case "sd_format":
                test_sd_format_();
                break;
            case "sd_show":
                test_sd_show_();
                break;
            case "sd_load":
                test_sd_load_();
                break;
            case "sd_unload":
                test_sd_unload_();
                break;



		     case "sd_info":
		          get_sd_info (g_sd_info_flag);
		          break;

		     case "set_mode":
		          set_mode ({flag:g_set_mode_flag});
		          break;

		     case "night":
		          set_mode ({type:type});
		          break;
		     case "auto_test":
		          if(g_test_button.textContent=="开始测试")
		          {
		              g_test_button.textContent="停止测试";
		              auto_test ();
		          }
		          else
		          {
		              g_test_button.textContent="开始测试";
		              stop_test ();
		          }
		          break;
		}
	}


	function init()
	{
	    g_main_page_div = $("main_page");
        g_device_list_ul =$("device_list_ul");
        g_play_button=$("play_button");
        //g_record_button =$("record_button");
        g_talk_button=$("talk_button");
        g_activation_div=$("activation_div");
        g_ip_start_input=$("ip_start");
        g_ip_end_input=$("ip_end");
        g_test_ul=$("test_ul");
        g_test_result_div = $("test_result_div");
        g_auto_refresh_input=$("auto_refresh_input");
        g_refresh_device_button=$("refresh_device");
        g_version_info_span=$("version_info_span");
        g_dev_upgrade_div=$("dev_upgrade_div");
        g_restore_div=$("restore_div");
        g_upgrade_button=$("upgrade_button");
        g_dev_site_div=$("dev_site_div");
        g_view_page=$("view_page");
        g_default_pass_input=$("default_pass_input");
        g_test_button=$("test_button");
        g_wifi_ssid_input=$("wifi_ssid_input");
        g_wifi_pass_input=$("wifi_pass_input");
        g_wifi_connect_button=$("wifi_connect_button");
        g_switch_versions_button=$("switch_versions_button");
        g_set_mode_flag=1;
        g_wifi_list_flag=1;
        g_wifi_connect_flag=1;
        g_play_flag=0;
        var select_checkbox=$("select_checkbox");
        window.onresize=function(){
            var client_w=document.body.clientWidth;
            var client_h=document.body.clientHeight;
            g_main_page_div.style.width=client_w;
            g_main_page_div.style.height=client_h;
            //g_view_page.style.width=client_w*0.7;
            //g_view_page.style.height=client_h*0.76;
        }

        g_test_button.onkeydown=function()
        {
            if(event.keyCode==13) return false;
        }
        var localVal=g_mlocal_storage.get("ip_range");
        if(localVal){
            var ipVal= eval('(' + localVal + ')').ip;
            g_ip_start_input.value=ipVal.substr(0,ipVal.indexOf("-"));
            g_ip_end_input.value=ipVal.substr(ipVal.indexOf("-")+1,ipVal.length);
            if(eval('(' + localVal + ')').checked)
            {
                g_auto_refresh_input.checked="checked";
                refresh_devs();
            }
        }
        g_auto_refresh_input.onchange=function()
        {
            (g_auto_refresh_input.checked)?set_storage_data({str:"ip_range", data:{ip:g_ip_start_input.value+"-"+g_ip_end_input.value,checked:1}}):set_storage_data({str:"ip_range", data:{ip:g_ip_start_input.value+"-"+g_ip_end_input.value,checked:0}});
        }
        var local_dev_pass=g_mlocal_storage.get("dev_pass");
        if(local_dev_pass&& eval('(' + local_dev_pass + ')').pass)
        {
            g_dev_default_pass=eval('(' + local_dev_pass + ')').pass;
            g_default_pass_input.value=g_dev_default_pass;
        }
        else{
            set_storage_data({str:"dev_pass", data:{pass:"admin"}});
        }
        var local_wifi_info=g_mlocal_storage.get("wifi_info");
        if(local_wifi_info&& eval('(' + local_wifi_info + ')').pass)
        {
            var local_wifi_info_ssid=eval('(' + local_wifi_info + ')').ssid;
            var local_wifi_info_pass=eval('(' + local_wifi_info + ')').pass;
//            g_wifi_ssid_input.value=local_wifi_info_ssid;
//            g_wifi_pass_input.value=local_wifi_info_pass;
        }
        else{
            set_storage_data({str:"wifi_info", data:{ssid:"",pass:"12345678"}});
        }
//        g_wifi_ssid_input.onchange=g_wifi_pass_input.onchange=wifi_connnect_change;
        function wifi_connnect_change()
        {
            set_storage_data({str:"wifi_info", data:{ssid:g_wifi_ssid_input.value,pass:g_wifi_pass_input.value}});
        }

        var local_test_version=g_mlocal_storage.get("test_version");
        g_test_version=local_test_version?eval('(' + local_test_version + ')').version:0;
        init_test_list(g_test_version);
        update_test_datebase();
        set_button_disable(true);
	}
	function update_test_datebase()
	{


	    g_test_checkbox=g_test_ul.getElementsByTagName("input");
	    var local_test_select=g_mlocal_storage.get("test_select"+g_test_version);
        var temp_checked=eval('(' + local_test_select + ')');
        if(local_test_select&& temp_checked)
        {
            if(temp_checked.length==18) select_checkbox.checked=true;
            for(var i=0;i<g_test_checkbox.length;i++)
            {
                for(var j=0;j<temp_checked.length;j++)
                {
                    if(g_test_checkbox[i].id==temp_checked[j])
                    {
                        g_test_checkbox[i].checked=true;
                    }
                }
            }
        }
        select_checkbox.onchange=function()
        {
            var save_test_array=[];
            for(var i=0;i<g_test_checkbox.length;i++)
            {
                 if(g_test_checkbox[i].id!="select_checkbox")
                 {
                     if(select_checkbox.checked)
                     {
                         g_test_checkbox[i].checked=true;
                         save_test_array[i]=g_test_checkbox[i].id;
                     }
                     else
                     {
                         g_test_checkbox[i].checked=false;
                         save_test_array.length=0;
                     }

                 }
            }
            set_storage_data({str:"test_select"+g_test_version, data:save_test_array});
        }
        for(var i=0;i<g_test_checkbox.length;i++)
        {
            if(g_test_checkbox[i].id!="select_checkbox")
                g_test_checkbox[i].onchange=function(e)
                {
                    var local_test_select=g_mlocal_storage.get("test_select"+g_test_version);
                    var temp_checked_array=local_test_select?eval('(' + local_test_select + ')'):[];
                    var temp_checkbox=e.currentTarget;
                    var chekbox_id=temp_checkbox.id;
                    if(local_test_select&& temp_checked_array)
                    {
                        if(temp_checkbox.checked)
                        {
                                var flag=0;
                                for(var j=0;j<temp_checked_array.length;j++)
                                {
                                    if(chekbox_id==temp_checked_array[j])
                                    {
                                        flag=1;
                                    }
                                }
                                if(!flag) temp_checked_array.push(chekbox_id);
                        }
                        else
                        {
                            if(select_checkbox.checked) select_checkbox.checked=false;
                            for(test_tmp in temp_checked_array)
                            {
                                if(chekbox_id==temp_checked_array[test_tmp]){
                                    temp_checked_array.splice(test_tmp,1);
                                }
                            }
                        }
                    }
                    else if(temp_checkbox.checked) temp_checked_array.push(chekbox_id);
                    set_storage_data({str:"test_select"+g_test_version, data:temp_checked_array});
                };

        }

	}
	function init_test_list(type)
	{
        g_test_arrays=window.web_test_list.get_test_list(type);
        g_test_ul.innerHTML=window.web_test_list.get_test_list_innerHTML(type);
        set_storage_data({str:"test_version", data:{version:type}});
      //  switch_versions_button.textContent=type?"切换到常用":"切换到所有";
        g_test_version=type;
       // update_test_datebase();
	}
	function create_search_dev_frame(requestIP,intStartTime)
	{
	    var refresh_dev_frame=dom_create_child(g_main_page_div, "iframe", "refresh_dev_frame");
	    refresh_dev_frame.style.display="none";
	    var doc = refresh_dev_frame.contentDocument || refresh_dev_frame.contentWindow.document;
        var temp_script = doc.createElement("script");
        temp_script.type = "text/javascript";
        temp_script.src = "http://"+requestIP+"/ccm/CcmGetDeviceRequest.js?hfrom_handle="+intStartTime;
        var head = doc.getElementsByTagName("head")[0];
        head.insertBefore(temp_script, head.firstChild);
        refresh_dev_frame.contentWindow.message=function(msg){
            // clearTimeout(frameTimeout);
            if(!dev_get(msg.data.SerialNumber))
            {
                g_devs[g_devsNum]={name:msg.data.SerialNumber,version:msg.data.Version?msg.data.Version:"v1",ip:requestIP,pwd:g_dev_default_pass,spv:msg.data.spv};
                create_dev_list(msg.data.SerialNumber,requestIP,msg.data.Version?msg.data.Version:"v1");
                g_devsNum++;
            }
        };
        var frameTimeout=setTimeout(function(){
                        refresh_dev_frame.innerHTML = "";
                        refresh_dev_frame.parentNode.removeChild(refresh_dev_frame);
                        refresh_dev_frame = null;
                    },2000);
	}
	function set_button_disable(bool)
	{
        var button_arrays=document.getElementsByTagName("button");
        for(var i=0;i<button_arrays.length;i++)
        {
            if(button_arrays[i].id!="refresh_device" && button_arrays[i].id!="switch_versions_button")
            {
                button_arrays[i].disabled=bool;
                if(bool)
                {
                    button_arrays[i].style.cursor="auto";
                }
                else
                {
                    button_arrays[i].style.cursor="pointer";
                    var orign_color;
                    button_arrays[i].onmouseover=function(){orign_color=event.srcElement.style.backgroundColor;event.srcElement.style.backgroundColor="#73BF00";};
                    button_arrays[i].onmouseout=function(){event.srcElement.style.backgroundColor=orign_color};
                }
            }
        }
	}

	function set_fix()
	{
	    if(g_selectedDevice.spv!="v1")
        {
            g_mcloud_agent.set_fix(
            {
                type:function(type){
                    var fix_types={
                        "ccm_play":"GetStreamUriRequest",
                        "ccm_talk":"CcmGetAudioOutputStreamUriRequest",
                        "ccm_disk_get":"CcmGetDisksRequest",
                        "ccm_net_get":"CcmGetNetworkInfoRequest",
                        "ccm_net_set":"CcmSetNetworkInfoRequest",
                        "ccm_alert_action_set":"CcmAlertActionSetRequest",
                        "ccm_ptz_ctl":"RelativeMoveRequest",
                        "ccm_active":"CcmClientActiveRequest",
                        "ccm_restore":"RestoreSystemRequest",
                        "ccm_reboot":"SystemRebootRequest",
                        "ccm_info_get":"CcmGetDeviceRequest",
                        "ccm_upgrade_get":"CcmGetUpgradeStatusRequest",
                        "ccm_upgrade":"CcmUpgradeRequest",
                        "ccm_record_task_get":"CcmGetRecordingTaskConfigurationRequest",
                        "ccm_record_task_set":"CcmSetRecordingTaskConfigurationRequest",
                        "ccm_img_set":"SetImagingSettingsRequest",
                        "ccm_misc_set":"CcmSetSystemInfoRequest",
                        "ccm_img_get":"GetImagingSettingsRequest",
                        "ccm_misc_get":"CcmGetSystemInfoRequest",
                        "ccm_osd_get":"CcmGetOsdsRequest",
                        
                        "ccm_disk_ctl":"CcmDiskCtrlRequest",
                        "ccm_osd_set":"CcmSetOsdRequest",
                        "ccm_nick_set":"CcmSetDeviceNickRequest",
                        "ccm_dev_info_get":"GetDeviceInformationRequest",
                        "ccm_alert_dev_get":"CcmAlertDeviceGetRequest",
                        "ccm_alert_dev_set":"CcmAlertDeviceSetRequest",
                        "ccm_date_get":"GetSystemDateAndTimeRequest",
                        "ccm_date_set":"SetSystemDateAndTimeRequest",
                        "ccm_ntp_get":"GetNTPRequest",
                        "ccm_ntp_set":"SetNTPRequest",
						"ccm_alert_action_get":"CcmAlertActionGetRequest",
                        "ccm_pwd_set":"SetUserRequest",
                        "ccm_mic_set":"SetAudioSourceConfigurationRequest",
                        "ccm_mic_get":"GetAudioSourceConfigurationsRequest",
                        "ccm_speaker_set":"SetAudioOutputConfigurationRequest",
                        "ccm_snapshot":"GetSnapshotUriRequest"
                    };
                    return fix_types[type] || type;
                },
                req:function(type, req){
                    var temp_req=req;
                    req.length=0;
                    req=get_fix_req(type,temp_req);
                    return req;
                },
                ack:function(type, ack){
                    var temp_ack=ack.data;
                    ack=null;
                    ack=get_fix_ack(type,temp_ack);
                    return ack;
                }
            });
            function get_fix_req(type,temp_req)
            {
                var fix_reqs;
                switch(type)
                {
                    case "ccm_play":
                       fix_reqs={Session:{Nid:temp_req.sess.nid,SerialNumber:temp_req.sess.sn},StreamSetup:{Stream:temp_req.setup.stream,Transport:{Protocol:temp_req.setup.trans.proto}},ProfileToken:temp_req.token};
                       break;
                    case "ccm_talk":
                       fix_reqs={Session:{Nid:temp_req.sess.nid,SerialNumber:temp_req.sess.sn},
                                    StreamSetup:{Stream:temp_req.setup.stream,Transport:{Protocol:temp_req.setup.trans.proto}},ProfileToken:temp_req.token};
                       break;
                    case "ccm_disk_get":
                       fix_reqs={Session:{Nid:temp_req.sess.nid,SerialNumber:temp_req.sess.sn}};
                       break;
                    case "ccm_net_get":
                       fix_reqs={Session:{Nid:temp_req.sess.nid,SerialNumber:temp_req.sess.sn},tokens:temp_req.tokens,items:temp_req.items,force_scan:temp_req.force_scan};
                       break;
                    case "ccm_net_set":
                       fix_reqs={Session:{Nid:temp_req.sess.nid,SerialNumber:temp_req.sess.sn},net_info:temp_req.info};
                       break;
                    case "ccm_alert_action_set":
                       fix_reqs={Session:{Nid:temp_req.sess.nid,SerialNumber:temp_req.sess.sn},Enable:temp_req.enable,Actions:{Token:temp_req.actions.token,Enable:temp_req.actions.enable,Name:temp_req.actions.name,Sources:[{Devices:[temp_req.actions.srcs.devs]}],IoOutputEnable:temp_req.actions.io_out_enable,SnapshotEnable:temp_req.actions.snapshot_enable,RecordEnable:temp_req.actions.record_enbale,SnapshotInterval:temp_req.actions.snapshot_interval,PreRecordTime:temp_req.actions.pre_record_time}};
                       break;
                    case "ccm_ptz_ctl":
                       fix_reqs={Session:{Nid:temp_req.sess.nid,SerialNumber:temp_req.sess.sn},
                                                Translation:{PanTilt:{x:temp_req.trans.pan_tilt.x, y:temp_req.trans.pan_tilt.y}}};
                       break;
                    case "ccm_active":
                       fix_reqs={Session:{Nid:temp_req.sess.nid,SerialNumber:temp_req.sess.sn},ActivationCode:temp_req.ActivationCode};
                       break;
                    case "ccm_restore":
                       fix_reqs={Session:{Nid:temp_req.sess.nid,SerialNumber:temp_req.sess.sn},Backup:temp_req.backup};
                       break;
                    case "ccm_reboot":
                       fix_reqs={Session:{Nid:temp_req.sess.nid,SerialNumber:temp_req.sess.sn}};
                       break;
                    case "ccm_record_task_get":
                       fix_reqs={Session:{Nid:temp_req.sess.nid,SerialNumber:temp_req.sess.sn}};
                       break;
                    case "ccm_record_task_set":
                       fix_reqs={Session:{Nid:temp_req.sess.nid,SerialNumber:temp_req.sess.sn},TaskConfiguration:{immediate:temp_req.task.keep,ProfileToken:"p0",TimeRecord:{Enable:temp_req.task.sch.enable,AllTime:temp_req.task.sch.full_time,Times:[{Wday:temp_req.task.sch.times[0].wday,Start:temp_req.task.sch.times[0].start,End:temp_req.task.sch.times[0].end}]}}};
                       break;
                    case "ccm_img_set":
                       fix_reqs={Session:{Nid:temp_req.sess.nid,SerialNumber:temp_req.sess.sn},VideoSourceToken:temp_req.token,ImagingSettings:{Brightness:temp_req.conf.brightness,Contrast:temp_req.conf.contrast,ColorSaturation:temp_req.conf.color_saturation,Sharpness:temp_req.conf.sharpness,mode:temp_req.conf.mode}};
                       break;
                    case "ccm_misc_set":
                       fix_reqs={Session:{Nid:temp_req.sess.nid,SerialNumber:temp_req.sess.sn},info:temp_req.info};
                       break;
                    case "ccm_img_get":
                       fix_reqs={Session:{Nid:temp_req.sess.nid,SerialNumber:temp_req.sess.sn},VideoSourceToken:temp_req.token};
                       break;
                    case "ccm_misc_get":
                       fix_reqs={Session:{Nid:temp_req.sess.nid,SerialNumber:temp_req.sess.sn}};
                       break;
                   case "ccm_info_get":
                       fix_reqs={};
                       break;
                   case "ccm_upgrade_get":
                       fix_reqs={Session:{Nid:temp_req.sess.nid,SerialNumber:temp_req.sess.sn},CheckVersion:temp_req.check};
                       break;
                   case "ccm_upgrade":
                       fix_reqs={Session:{Nid:temp_req.sess.nid,SerialNumber:temp_req.sess.sn},FirmwareSrc:temp_req.img_src};
                       break;
                   case "ccm_osd_get":
                       fix_reqs={Session:{Nid:temp_req.sess.nid,SerialNumber:temp_req.sess.sn}};
                       break;
                   case "ccm_dev_info_get":
                       fix_reqs={Session:{Nid:temp_req.sess.nid,SerialNumber:temp_req.sess.sn}};
                       break;
                   case "ccm_nick_set":
                       fix_reqs={Session:{Nid:temp_req.sess.nid,SerialNumber:temp_req.sess.sn},Nick:temp_req.nick};
                       break;
                   case "ccm_disk_ctl":
                       fix_reqs={Session:{Nid:temp_req.sess.nid,SerialNumber:temp_req.sess.sn},token:temp_req.token,CtrlType:temp_req.type,sd_conf:temp_req.conf};
                       break;
                   case "ccm_osd_set":
                       fix_reqs={Session:{Nid:temp_req.sess.nid,SerialNumber:temp_req.sess.sn},osd:{text:temp_req.osd.text,text_enable:temp_req.osd.text_enable,datetime:{date_format:temp_req.osd.date.format,enable_12h:temp_req.osd.date.enable_12h,time_enable:temp_req.osd.date.time_enable,date_enable:temp_req.osd.date.date_enable},week:temp_req.osd.week}};
                       break;
                   case "ccm_alert_dev_get":
                       fix_reqs={Session:{Nid:temp_req.sess.nid,SerialNumber:temp_req.sess.sn}};
                       break;
                   case "ccm_alert_dev_set":
                       fix_reqs={Session:{Nid:temp_req.sess.nid,SerialNumber:temp_req.sess.sn},Config:{IoInputMode:temp_req.conf.io_in_mode,IoOutputMode:temp_req.conf.io_out_mode,MotionLevel:temp_req.conf.motion_level,MotionLevelNight:temp_req.conf.motion_level_night,MotionDebounceTime:8000,PirDebounceTime:8000}};
                       break;
                   case "ccm_date_set":
                       fix_reqs={Session:{Nid:temp_req.sess.nid,SerialNumber:temp_req.sess.sn},DateTimeType:temp_req.type,DaylightSavings:0,TimeZone:temp_req.timezone,UTCDateTime:{Time:{Hour:temp_req.utc_date.time.hour,Minute:temp_req.utc_date.time.min,Second:temp_req.utc_date.time.sec},Date:{Year:temp_req.utc_date.date.year,Month:temp_req.utc_date.date.mon,Day:temp_req.utc_date.date.day}}};
                       break;
					case "ccm_ntp_get":
                       fix_reqs={Session:{Nid:temp_req.sess.nid,SerialNumber:temp_req.sess.sn}};
                       break;
					case "ccm_ntp_set":
                       fix_reqs={Session:{Nid:temp_req.sess.nid,SerialNumber:temp_req.sess.sn},Auto_sync:temp_req.auto_sync,FromDHCP:0,NTPManual:{IPv4Address:temp_req.manual.ip}};
                       break;
					case "ccm_alert_action_get":
                       fix_reqs={Session:{Nid:temp_req.sess.nid,SerialNumber:temp_req.sess.sn},Token:temp_req.token};
                       break;
                    case "ccm_pwd_set":
                        fix_reqs={Session:{Nid:temp_req.sess.nid,SerialNumber:temp_req.sess.sn},User:{Username:temp_req.user.username,OldPassword:temp_req.user.old_pwd,Password:temp_req.user.pwd,UserLevel:temp_req.user.level,guest:temp_req.user.guest}};
                        break;
                    case "ccm_mic_get":
                        fix_reqs={Session:{Nid:temp_req.sess.nid,SerialNumber:temp_req.sess.sn}};
                        break;
                    case "ccm_mic_set":
                        fix_reqs={Session:{Nid:temp_req.sess.nid,SerialNumber:temp_req.sess.sn},AudioSourceConfiguration:{Entity:{Name:temp_req.conf.entity.name,UseCount:temp_req.conf.entity.use_counts,token:temp_req.conf.entity.token},SourceLevel:temp_req.conf.level,SourceToken:temp_req.conf.token,silent:temp_req.conf.silent},ForcePersistence:temp_req.force_persistence};
                        break;
                    case "ccm_speaker_set":
                        fix_reqs={Session:{Nid:temp_req.sess.nid,SerialNumber:temp_req.sess.sn},AudioOutputConfiguration:{OutputLevel:temp_req.conf.level,OutputToken:temp_req.conf.token},ForcePersistence:temp_req.force_persistence,};
                        break;
                    case "ccm_snapshot":
                        fix_reqs={Session:{Nid:temp_req.sess.nid,SerialNumber:temp_req.sess.sn},ProfileToken:temp_req.token};
                        break;
                    case "ccm_date_get":
                        fix_reqs={Session:{Nid:temp_req.sess.nid,SerialNumber:temp_req.sess.sn}};
                        break;
                       
                }
                return fix_reqs;
            }
            function get_fix_ack(type,temp_ack)
            {
                var fix_acks;
                switch(type)
                {
                    case "ccm_play":
                       fix_acks={data:{result:temp_ack.Result.Reason,uri:{url:temp_ack.MediaUri.Uri}}};
                       break;
                    case "ccm_talk":
                       fix_acks={data:{result:temp_ack.Result.Reason,uri:{url:temp_ack.MediaUri.Uri}}};
                       break;
                    case "ccm_disk_get":
                       fix_acks={data:{result:temp_ack.Result.Reason,disks:[{conf:{enable:temp_ack.Disks[0].sd_conf.enable},stat:temp_ack.Disks[0].status,size:temp_ack.Disks[0].TotalSize,used_size:temp_ack.Disks[0].UsedSize,available_size:temp_ack.Disks[0].AvailableSize}]}};
                       break;
                    case "ccm_net_get":
                       fix_acks={data:{result:temp_ack.Result.Reason,info:temp_ack.net_info}};
                       break;
                    case "ccm_net_set":
                       fix_acks={data:{result:temp_ack.Result.Reason}};
                       break;
                    case "ccm_alert_action_set":
                       fix_acks={data:{result:temp_ack.Result.Reason}};
                       break;
                    case "ccm_ptz_ctl":
                       fix_acks={data:{result:temp_ack.Result.Reason}};
                       break;
                    case "ccm_active":
                       fix_acks={data:{result:temp_ack.Result.Reason}};
                       break;
                    case "ccm_restore":
                       fix_acks={data:{result:temp_ack.Result.Reason}};
                       break;
                    case "ccm_reboot":
                       fix_acks={data:{result:temp_ack.Result.Reason}};
                       break;
                    case "ccm_record_task_get":
                       fix_acks={data:{result:temp_ack.Result.Reason,sd_ready:temp_ack.sd_ready,task:temp_ack.TaskConfiguration}};
                       break;
                    case "ccm_record_task_set":
                       fix_acks={data:{result:temp_ack.Result.Reason}};
                       break;
                    case "ccm_img_set":
                       fix_acks={data:{result:temp_ack.Result.Reason}};
                       break;
                    case "ccm_misc_set":
                       fix_acks={data:{result:temp_ack.Result.Reason}};
                       break;
                    case "ccm_img_get":
                       fix_acks={data:{result:temp_ack.Result.Reason,conf:{brightness:temp_ack.ImagingSettings.Brightness,contrast:temp_ack.ImagingSettings.Contrast,color_saturation:temp_ack.ImagingSettings.ColorSaturation,sharpness:temp_ack.ImagingSettings.Sharpness,mode:temp_ack.ImagingSettings.mode}}};
                       break;
                    case "ccm_misc_get":
                       fix_acks={data:{result:temp_ack.Result.Reason,info:temp_ack.info}};
                       break;
                   case "ccm_info_get":
                       fix_acks={data:{sn:temp_ack.SerialNumber,result:temp_ack.Result.Reason,ver:temp_ack.Version}};
                       break;
                   case "ccm_upgrade_get":
                       fix_acks={data:{sn:temp_ack.SerialNumber,result:temp_ack.Result.Reason,stat:temp_ack.Status,progress:temp_ack.Progress,_cur_ver:temp_ack.CurrentVersion,_valid_ver:temp_ack.ValidVersion,remark:temp_ack.Remark,changes:temp_ack.changes}};
                       break;
                   case "ccm_upgrade":
                       fix_acks={data:{result:temp_ack.Result.Reason}};
                       break;
                 	 case "ccm_osd_get":
                       fix_acks={data:{result:temp_ack.Result.Reason,osd:{text:temp_ack.osd.text,text_enable:temp_ack.osd.text_enable,date:{format:temp_ack.osd.datetime.date_format,enable_12h:temp_ack.osd.datetime.enable_12h,date_enable:temp_ack.osd.datetime.date_enable,time_enable:temp_ack.osd.datetime.time_enable},week:temp_ack.osd.week}}};
                       break;
					case "ccm_disk_ctl":
                       fix_acks={data:{result:temp_ack.Result.Reason}};
                       break;
					case "ccm_osd_set":
                       fix_acks={data:{result:temp_ack.Result.Reason}};
                       break;
					case "ccm_nick_set":
                       fix_acks={data:{result:temp_ack.Result.Reason}};
                       break;
					case "ccm_dev_info_get":
                       fix_acks={data:{result:temp_ack.Result.Reason,mfc:temp_ack.Manufacturer,model:temp_ack.Model,bimg_ver:temp_ack.BaseFirmwareVersion,img_ver:temp_ack.FirmwareVersion,sn:temp_ack.SerialNumber,dev_id:temp_ack.HardwareId,nick:temp_ack.Nick,type:temp_ack.Type}};
                       break;
					case "ccm_alert_dev_get":
                       fix_acks={data:{result:temp_ack.Result.Reason,conf:temp_ack.Config}};
                       break;
					 case "ccm_alert_dev_set":
                       fix_acks={data:{result:temp_ack.Result.Reason}};
                       break;
					case "ccm_date_get":
                       fix_acks={data:{result:temp_ack.Result.Reason,utc_date:temp_ack.UTCDateTime}};
                       break;				
					case "ccm_date_set":
                       fix_acks={data:{result:temp_ack.Result.Reason}};
                       break;
					case "ccm_ntp_get":
                       fix_acks={data:{result:temp_ack.Result.Reason,info:{auto_sync_enable:temp_ack.NTPInformation.AutoSync,auto_sync_interval:temp_ack.NTPInformation.AutoSyncInterval,dhcp_enable:temp_ack.NTPInformation.FromDHCP,dhcp:{dns:temp_ack.NTPInformation.NTPFromDHCP.DNSname,ip:temp_ack.NTPInformation.NTPFromDHCP.IPv4Address},manual:temp_ack.NTPInformation.NTPManual,sys:temp_ack.NTPInformation.NTPSystem,timezone:temp_ack.NTPInformation.TimeZone}}};
                       break;   
					case "ccm_ntp_set":
                       fix_acks={data:{result:temp_ack.Result.Reason}};
                       break;  
					 case "ccm_alert_action_get":
                       fix_acks={data:{result:temp_ack.Result.Reason,enable:temp_ack.Enable,sch:temp_ack.Task,actions:temp_ack.Actions}};
                       break;
                    case "ccm_pwd_set":
                        fix_acks={data:{result:(temp_ack.Result.Reason||temp_ack.Result.Code)}};
                        break;
                    case "ccm_mic_set":
                        fix_acks={data:{result:temp_ack.Result.Reason}};
                        break;
                    case "ccm_mic_get":
                        fix_acks={data:{result:temp_ack.Result.Reason,conf:[{entity:{name:temp_ack.Configurations[0].Entity.Name,use_counts:temp_ack.Configurations[0].Entity.UseCount,token:temp_ack.Configurations[0].Entity.token},token:temp_ack.Configurations[0].SourceToken,level:temp_ack.Configurations[0].SourceLevel,silent:temp_ack.Configurations[0].silent}]}};
                        break;
                    case "ccm_speaker_set":
                        fix_acks={data:{result:temp_ack.Result.Reason}};
                        break;
                    case "ccm_snapshot":
                        fix_acks={data:{result:temp_ack.Result.Reason}};
                        break;

					   
                }
                return fix_acks;
            }
      }else{g_mcloud_agent.set_fix(null);}
	}

	function dev_get(name){
        for(var dev, i = 0; i < g_devs.length; ++i)
        {
            if((dev = g_devs[i]) && (dev.name == name)){ return dev; }
        }
        return null;
    }
    function dev_index_get(name)
    {
        for(var dev, i = 0; i < g_devs.length; ++i)
        {
            if((g_devs[i].name==g_selectedDevice.name)){ return i; }
        }
    }
    function dev_info_set (obj) {
        for(var dev, i = 0; i < g_devs.length; ++i)
        {
            if((g_devs[i].name==g_selectedDevice.name))
            {
                g_devs[i].name=obj.name;
                if(obj.version)g_devs[i].version=obj.version;
            }
        }
    }
	function dom_create_child(child_parent, child_type, child_id, child_class)
    {
        var child = document.createElement(child_type);
        if(child_id){child.setAttribute("id", child_id);}
        if(child_class){child.setAttribute("className", child_class);}         //for IE
        if(child_class){child.setAttribute("class", child_class);}
        if(child_parent){child_parent.appendChild(child);}
        return child;
    }
    function set_storage_data(obj)
    {
        var data_str = window.mcodec.obj_2_str (obj.data);
        g_mlocal_storage.set(obj.str, data_str);
    }
    function click_init()
    {
       // if(g_talk_button.textContent=="对讲..") test("talk");
        //g_record_button.textContent="录像";
        set_mode ({flag:0});
        
        //g_version_info_span.textContent="";
        $("dev_site_ethernet").textContent="";
        $("dev_site_wifi").textContent="";
        
      
        g_dev_site_div.style.display = "none";
        stop_test();
       
        clear_test_content();
    }
    function refresh_devs()
    {
        g_devsNum=0;
        g_devs.length = 0;
        g_device_list_ul.innerHTML="";
        click_init();
        if(g_refreshTimeoutID)clearTimeout(g_refreshTimeoutID);
        var ipStartString,ipStart,ipEndString,ipEnd,ipBase,ipStartTemp,ipSum;
        ipStartString=g_ip_start_input.value;
        ipStart=ipStartString.substr(ipStartString.lastIndexOf(".")+1);
        ipEndString=g_ip_end_input.value;
        ipEnd=ipEndString.substr(ipEndString.lastIndexOf(".")+1);
        ipBase=ipStartString.substr(0,ipStartString.lastIndexOf(".")+1);
        ipStartTemp=ipStart;
        ipSum=ipEnd-ipStartTemp;
        var intStartTime=new Date();
        (g_auto_refresh_input.checked)?set_storage_data({str:"ip_range", data:{ip:ipStartString+"-"+ipEndString,checked:1}}):set_storage_data({str:"ip_range", data:{ip:ipStartString+"-"+ipEndString,checked:0}});
        var ping_times=0;
        var ping_out_time=1;
        ping();
        function ping()
        {
            requestIP=ipBase+ipStart;
            if(parseInt(ipStart)>parseInt(ipEnd))
            {
                g_refresh_device_button.textContent="搜索";
                g_refresh_device_button.disabled=false;
                setTimeout(function(){
                   while(document.getElementsByTagName('iframe')>0)
                   {
                      var iframes=document.getElementsByTagName('iframe');
                      for (var i = 0; i < iframes.length; i++)
                        {
                            if(iframes[i].id=="refresh_dev_frame")
                            {
                                iframes[i].innerHTML = "";
                                  iframes[i].parentNode.removeChild(iframes[i]);
                                  iframes[i] = null;
                            }
                        }
                     }
                },10000);
                return;
            }
            intStartTime++;
            var progress=parseInt((ipStart-ipStartTemp)*100/ipSum)+"%";
            g_refresh_device_button.textContent=progress;
            //g_refresh_device_button.disabled=true;
            create_search_dev_frame(requestIP,intStartTime);
            ipStart++;
            ping_out_time=ping_times<5?1:2000;
            ping_times++;
            if(ping_times>5) ping_times=0;
            g_refreshTimeoutID = setTimeout(function(){ping();}, ping_out_time);
        }
    }

    function create_dev_list(dev_sn,dev_ip,dev_ver)
    {
        var li= document.createElement("li");
        li.innerHTML=dev_sn;
        li.title="IP："+dev_ip+"\nVersion："+dev_ver;
        li.style.cursor="pointer";
        li.id="device_list_li_"+g_devsNum;
        li.onclick=function(){
            var intEnd=li.innerHTML.indexOf("<");
            var sn=(intEnd>0)?li.innerHTML.substr(0, intEnd):li.innerHTML;
            for(var i=0;i<g_devsNum;i++)
            {
                document.getElementsByTagName("li")[i].style.color="#fff";
            }
            click_init();
            set_storage_data({str:"dev_pass", data:{pass:g_default_pass_input.value}});
            g_selectedDevice=dev_get(sn);
            if(g_selectedDevice)
            {
                li.style.color="#A8FF24";
                g_mcloud_agent.set_srv(g_selectedDevice.ip);
                g_mcloud_account.set_srv(g_selectedDevice.ip);
                set_fix();
                if(!$("connect_dev_tip"))connect_dev_tip({parent:li,type:1});
                g_mcloud_agent.sign_in({srv : g_selectedDevice.ip,user : g_selectedDevice.name,password : g_default_pass_input.value}, null,
                    function(msg, ref) {
                        connect_dev_tip({parent:li,type:0});
                        if(!$("system_tooltip"))system_tooltip({parent:li,type:msg.result});
                    });
            }
        };
        g_device_list_ul.appendChild(li);
    }
    function connect_dev_tip(obj)
    {
        var  p = obj.parent,connect_dev_tip,dom_tip_content,dom_tip_arrow,index;
        index=p.id.substr(15,16);
        if(obj.type)
        {
            connect_dev_tip = dom_create_child(g_device_list_ul, "div", "connect_dev_tip");
            dom_tip_content = dom_create_child(connect_dev_tip, "div", "system_tooltip_content");
            dom_tip_arrow = dom_create_child(connect_dev_tip, "span", "system_tooltip_arrow");
            connect_dev_tip.style.cssText = "display: block;position: absolute;z-index: 50;";
            dom_tip_content.style.cssText = "position: absolute;width: 120px;border-radius: 4px;font-size: 14px;font-weight: 700;text-align: center;z-index: 50;border-left: 1px solid #9CEC60;border-top: 1px solid #9CEC60;color: #fff;background: #CAC81C;border: 0;";
            dom_tip_arrow.style.cssText = "position: absolute;top:4px;border-style: solid;border-width: 4px;display: block;height: 1px;overflow: hidden;width: 1px;z-index: 30;border-color:transparent #CAC81C transparent transparent;";
            dom_tip_content.innerHTML = "正在连接设备...";
            connect_dev_tip.style.top = p.offsetHeight + "px";
            connect_dev_tip.style.left = p.offsetWidth+12+"px";
            dom_tip_arrow.style.top = index*30+"px";
            dom_tip_content.style.top = (index*30)-9+"px";
            dom_tip_arrow.style.left = "0px";
            dom_tip_content.style.left = dom_tip_arrow.offsetWidth + "px";
        }
        else
        {
            connect_dev_tip=$("connect_dev_tip");
            if(!connect_dev_tip)return;
            connect_dev_tip.innerHTML = "";
            connect_dev_tip.parentNode.removeChild(connect_dev_tip);
            connect_dev_tip = null;
            return ;
        }
    }
	function system_tooltip(obj)
    {
        var  p = obj.parent,dom_tooltip_div,dom_tooltip_content,dom_tooltip_arrow,index;
        dom_tooltip_div = dom_create_child(g_device_list_ul, "div", "system_tooltip");
        index=p.id.substr(15,16);
        function destroy_system_tooltip()
        {
            dom_tooltip_div=$("system_tooltip");
            if(!dom_tooltip_div)return;
            dom_tooltip_div.innerHTML = "";
            dom_tooltip_div.parentNode.removeChild(dom_tooltip_div);
            dom_tooltip_div = null;
            return ;
        }
        if(obj.type)
        {
            set_button_disable(true);
            dom_tooltip_div.style.cssText = "cursor: auto;font-size:16px;position: absolute;height:120px;width:160px;line-height:250%;color:#fff;z-index: 50;border-left: 5px solid #9E9B9B;border-right: 5px solid #9E9B9B;background-color: rgb(71, 68, 68);border-radius: 10px;";
            dom_tooltip_div.title="";
            dom_tooltip_div.style.top = (parseInt(index)+2)*30-10 + "px";
            dom_tooltip_title = dom_create_child(dom_tooltip_div, "div", "system_tooltip_title");
            dom_tooltip_input = dom_create_child(dom_tooltip_div, "input", "system_tooltip_input");
            dom_tooltip_button = dom_create_child(dom_tooltip_div, "button", "system_tooltip_button");
            dom_tooltip_title.textContent="请重新输入密码：";
            dom_tooltip_input.style.cssText ="font-size:16px;border-radius:0px;height:30px;width:100%";
            dom_tooltip_input.placeholder="密码";
            dom_tooltip_input.type="text";
            dom_tooltip_input.focus();
            dom_tooltip_button.textContent="确定";
            dom_tooltip_button.style.cssText="position: absolute;right:10px;bottom:10px;width:60px;height:25px;background-color:#00BB00;font-weight: bold;color: #EAEAEA;cursor: pointer;border: 0px;border-radius: 5px;";
            // dom_tooltip_button.onclick=relogin;
            dom_tooltip_input.onkeyup=function(){
                if(event.keyCode==13)
                {
                    g_mcloud_agent.sign_in({srv : g_selectedDevice.ip,user : g_selectedDevice.name,password : dom_tooltip_input.value}, null,
                    function(msg, ref) {
                        if(msg.result){
                            dom_tooltip_span = dom_create_child(dom_tooltip_div, "span", "system_tooltip_span");
                            dom_tooltip_span.textContent="密码错误";
                            dom_tooltip_span.style.cssText="position: absolute;left:12px;bottom:8px;color:red;font-size:12px";
                            setTimeout(function(){
                                if($("system_tooltip_span"))
                                {
                                    $("system_tooltip_span").innerHTML = "";
                                    $("system_tooltip_span").parentNode.removeChild($("system_tooltip_span"));
                                }
                            },1000);
                        }
                        else{
                            destroy_system_tooltip();
                            system_tooltip({parent:p,type:msg.result});
                        }
                    });
                }
            }
            dom_tooltip_button.onclick=function(){
                g_mcloud_agent.sign_in({srv : g_selectedDevice.ip,user : g_selectedDevice.name,password : dom_tooltip_input.value}, null,
                    function(msg, ref) {
                        if(msg.result){
                            dom_tooltip_span = dom_create_child(dom_tooltip_div, "span", "system_tooltip_span");
                            dom_tooltip_span.textContent="密码错误";
                            dom_tooltip_span.style.cssText="position: absolute;left:12px;bottom:8px;color:red;font-size:12px";
                            setTimeout(function(){
                                if($("system_tooltip_span"))
                                {
                                    $("system_tooltip_span").innerHTML = "";
                                    $("system_tooltip_span").parentNode.removeChild($("system_tooltip_span"));
                                }
                            },1000);
                        }
                        else{
                            destroy_system_tooltip();
                            system_tooltip({parent:p,type:msg.result});
                        }
                    });
            }
        }
        else
        {
            set_button_disable(false);
            test("play");
            g_mcloud_agent.net_get({sn:g_selectedDevice.name},null,function(msg,ref){
                if(msg.result==""){
                    var now_ethernet_ifs = msg.networks[0];
                    var now_wifi_ifs = msg.networks[1];
                    if(now_ethernet_ifs.ipv4&&now_ethernet_ifs.ipv4.conf&&now_ethernet_ifs.ipv4.info)
                    {
                        $("dev_site_ethernet").href="http://"+now_ethernet_ifs.ipv4.info.ip.addr;
                        $("dev_site_ethernet").textContent="以太："+now_ethernet_ifs.ipv4.info.ip.addr;
                    }
                    if(now_wifi_ifs.ipv4&&now_wifi_ifs.ipv4.conf&&now_wifi_ifs.ipv4.info)
                    {
                        if(now_wifi_ifs.ipv4.info.status == "ok"||now_wifi_ifs.ipv4.info.stat == "ok")
                        {
                            $("dev_site_wifi").href="http://"+now_wifi_ifs.ipv4.info.ip.addr;
                            $("dev_site_wifi").textContent="WiFi："+now_wifi_ifs.ipv4.info.ip.addr;
                        }
                    }
                }
            });
            if(g_selectedDevice.name.substr(0, 3) != "166")
            {
                g_mcloud_account.set_srv(g_selectedDevice.ip);
                g_mcloud_agent.set_srv(g_selectedDevice.ip);
                var upgrade_get_timeout_id=setTimeout(function(){
                   // g_version_info_span.textContent="无法连接到服务器";
                   // g_upgrade_button.disabled=true;
                  //  g_upgrade_button.style.cursor="auto";
                },5000);
                g_mcloud_agent.upgrade_get({sn:g_selectedDevice.name,check:1},null,function(msg,ref){
                    if(msg.result)
                    {
                      //  g_version_info_span.textContent="无法连接到服务器";
                     //   g_upgrade_button.disabled=true;
                      //  g_upgrade_button.style.cursor="auto";
                    }
                    else
                    {
                        g_valid_version=msg.ver_valid;
                        if(g_selectedDevice.version==g_valid_version)
                        {
                           // g_version_info_span.textContent="已是最新版本";
                            //g_upgrade_button.disabled=true;
                           // g_upgrade_button.style.cursor="auto";
                        }
                        else
                        {
                           // g_version_info_span.textContent="有新的版本 "+g_valid_version;
                            g_upgrade_button.disabled=false;
                            g_upgrade_button.style.cursor="pointer";
                            var orign_color;
                            g_upgrade_button.onmouseover=function(){orign_color=event.srcElement.style.backgroundColor;event.srcElement.style.backgroundColor="#73BF00";};
                            g_upgrade_button.onmouseout=function(){event.srcElement.style.backgroundColor=orign_color};
                        }
                    }
                    clearTimeout(upgrade_get_timeout_id);
                });
            }
           // g_dev_upgrade_div.style.display = "block";
           // g_restore_div.style.display = "block";
            //g_dev_site_div.style.display = "block";
            if(g_selectedDevice.name.substr(0, 3) == "166")
                    g_activation_div.style.display = "block";
            dom_tooltip_content = dom_create_child(dom_tooltip_div, "div", "system_tooltip_content");
            dom_tooltip_arrow = dom_create_child(dom_tooltip_div, "span", "system_tooltip_arrow");
            dom_tooltip_div.style.cssText = "display: block;position: absolute;z-index: 50;";
            dom_tooltip_content.style.cssText = "position: absolute;width: 70px;border-radius: 4px;font-size: 14px;font-weight: 700;text-align: center;z-index: 100;border-left: 1px solid #9CEC60;border-top: 1px solid #9CEC60;color: #fff;background: #55b137;border: 0;";
            dom_tooltip_arrow.style.cssText = "position: absolute;top:4px;border-style: solid;border-width: 4px;display: block;height: 1px;overflow: hidden;width: 1px;z-index: 30;border-color:transparent #6dc33f transparent transparent;";
            dom_tooltip_content.innerHTML = "连接成功";
            dom_tooltip_div.style.top = p.offsetHeight + "px";
            dom_tooltip_div.style.left = p.offsetWidth+12+"px";
            dom_tooltip_arrow.style.top = index*30+"px";
            dom_tooltip_content.style.top = (index*30)-9+"px";
            dom_tooltip_arrow.style.left = "0px";
            dom_tooltip_content.style.left = dom_tooltip_arrow.offsetWidth + "px";
        }

        var divx1 = dom_tooltip_div.offsetLeft;
        var divy1 = dom_tooltip_div.offsetTop;
        var divx2 = dom_tooltip_div.offsetLeft + dom_tooltip_div.offsetWidth;
        var divy2 = dom_tooltip_div.offsetTop + dom_tooltip_div.offsetHeight;
        document.onclick=function() {
             var page_top_height=$("page_top").offsetHeight;
             var x=event.clientX;
             var y=event.clientY>page_top_height?(event.clientY-page_top_height):event.clientY;
             if( x < divx1 || x > divx2 || y < divy1 || y > divy2){
                 destroy_system_tooltip();
             }
        };
    }
    function set_preview()
    {
        var url;
        url=(g_selectedDevice.version.substr(0,2)<"v2")?("http://" +g_mcloud_account.get_srv()+ "/ccm/CcmGetImageRequest.jpg?hfrom_handle=887330&dSession=1&dSession_Nid="+g_mcloud_agent.create_nid()+"&dSession_SerialNumber="+g_selectedDevice.name+"&dtoken=p0_xxxxxxxxxx"):
            (url="http://" +mcloud_account.get_srv()+ "/ccm/ccm_pic_get.jpg?hfrom_handle=887330&dsess=1&dsess_nid="+g_mcloud_agent.create_nid()+"&dsess_sn="+g_selectedDevice.name+"&dtoken=p0_xxxxxxxxxx");
       $("view_page").style.background="url("+url+")";
       $("view_page").style.backgroundSize="100% 100%";
    }
	function create_mme(obj)
    {
        var panel, server_device,mme_params,
            ua = navigator.userAgent.toLowerCase(),
            url_params = (location.search || location.hash || "");
            panel = obj.dom;
            panel.style.width = obj.dom.offsetWidth + "px";
            panel.style.height = obj.dom.offsetHeight + "px";
            server_device=location.host;
        if(server_device=="96.46.4.26")
        {
            mme.prototype.types.install.codebase=navigator.platform == "MacIntel"?"http://us.mipcm.com/mme/npmme.pkg?0.140523.pkg":"http://us.mipcm.com/mme/mme.exe?0.140523.exe";
        }
        else
        {
            mme.prototype.types.install.codebase=navigator.platform == "MacIntel"?"http://dl.mipcm.com:7080/mme/npmme.pkg?0.140523.pkg":"http://dl.mipcm.com:7080/mme/mme.exe?0.140523.exe";
        }
        mme.prototype.types.flash.install_url="mme/mme.swf?0.130715.swf";
        mme_params = {parent:panel, params:"{key:'data:application/octet-stream;base64,NGO/Mnqt7aXYO3hdsIe87bCTuqTRRSPMwJGuT26CuSedGTi2h7wroHY0IZObBPKYA/exp+e/efFj35sLiDKQpRfRFz8Th8zlYtrYki24JiN7vpGb2bUN9nY7quZ56SicUoqLd+KcCrvWheZ5NaE+slPpCg+F+hUdhNl4JXbVxzxY0uNV6ci7eEG44g4nf+TVB84SbVPllsSLhoQ4u6bGgiijR4s2A7HIDhEXTxEZIRjqSIH4QVUQUpkiIsQVwCm7gEXMGjvIhSv1CemWWX/C8HTPDxSWZgyVSXVVaPx/bEcSdcz/t6FKbx/crZ4xOry5PcdTd9zGMPxWo/2j2WrlWspUpkM4DJvNu3lhaO2Y3Y8G0Ly2e/em84b23Uu56U3nQdF+4Yv9jSvSoK6GyG0xuA3zbw/A2tKCN2yrdTdWX+s+K89rLvcqIAMJ9AAimXCPlKqImtkfJA2Bgp6yjF+AS7CF5MVnYgsLhArJtum+/EOST6Khl18Wz940iBLVyLJOS/25onfm/C3rSXNZmjq95YLT9yp99Qdg/2K7ZS5F1YVZ7C2Puyb99fIyBWGCtRtt0SPs0HRBXorx/zk2fjaR1BwVrStkS5Xkx46JFtCCVez5lmFALtUHS/Qj6Gw8rYICY2peJbztbBpCzJZtPVvIAFylfgMlNBRT8/Zt9G/JJ5g'}",
            on_event:function(e){on_plug_event(e)},
            ref_obj:obj,
            debug:(0 <= url_params.indexOf("debug=1"))};
        if(ua.match(/windows|win32/))
        {
            if(0 <= url_params.indexOf("windowless=0"))
            {
                mme_params.windowless = false;
            }
            else if(0 <= url_params.indexOf("windowless=1"))
            {
                mme_params.windowless = true;
            }
        }
        obj.inner_window_info.mme = new mme(mme_params);
        g_playing_mme=obj.inner_window_info.mme;
    }
    function on_plug_event(obj)
    {
        if(obj.type == "install_ui")
        {
            var j_panel = $(obj.panel);
            j_panel.fadeOut();
            obj.panel.style.cssText = "cursor:default;position:relative;left:0px;top:0px;width:100%;height:100%;color:#fff;visibility:hidden;background-image:url('../imgs/media_install_bg.png')";
            j_panel.hide();
            j_panel.fadeIn();
        }
        else if(obj.type == "ready")
        {
            var proto = obj.ref_obj.protocol;
            if(obj.plug.type.name == "flash")
            {
                plug_type = "flash";
                proto = "rtmp";
            }
            else if(proto == "auto"){
                    proto = "rtdp";
            }
            if(obj.ref_obj.page == "home")
            {
                g_mcloud_agent.play({sn:g_selectedDevice.name,protocol:proto,token:"p0"},obj.ref_obj,
                function(msg,ref)
                {
                    msg.result?system_pop_confirm_box({alert:true,index:1,str:"play error: "+msg.result}):chl_video_create({type:"play",url:msg.url, params:"", inner_window_info:ref.inner_window_info});
                    test_next();
                });
            }

        }
    }


	

	function get_sd_info()
	{
		g_mcloud_agent.sd_get({sn:g_selectedDevice.name},null,function(msg,ref){
            if(msg.result==""){
                msg.capacity>0?add_test_li("sd_info",1):add_test_li("sd_info",2);
            }else{system_pop_confirm_box({alert:true,index:1,str:"get_sd_info error: "+msg.result});}
            test_next();
        });

	}
	function set_mode(obj)
	{
	    var set_mode_div=$("set_mode_div");
	    if(obj.flag)
	    {
	        var content_div=$("set_mode_content_div"),
             triangle_span=$("set_mode_triangle_span"),
             left_num=$("set_mode_button").offsetLeft+$("set_mode_button").offsetWidth/2-11;
             content_div.style.left=left_num-23+"px";
             content_div.style.bottom=-5+"px";
             triangle_span.style.left=left_num+"px";
             set_mode_div.style.display="block";
             g_set_mode_flag=0;
	    }
	    else
	    {
	       // set_mode_div.style.display="none";
            g_set_mode_flag=1;
	    }
	    if(obj.type&&obj.type!="set_mode")
	    {
            g_mcloud_agent.cam_get({sn:g_selectedDevice.name},null,function(msg,ref){
                if(msg.result!=""){
                    system_pop_confirm_box({alert:true,index:1,str:"get_mode error: "+msg.result});
                    test_next();
                }
                else{
                    g_mcloud_agent.cam_set({sn:g_selectedDevice.name,brightness:msg.brightness,contrast:msg.contrast,color_saturation:msg.color_saturation,sharpness:msg.sharpness,day_night:obj.type,flip:msg.flip,flicker_freq:msg.flicker_freq},null,function(msg,ref){
                        if(msg.result!=""){system_pop_confirm_box({alert:true,index:1,str:"set_mode error: "+msg.result});}
                        test_next();
                    });
                }

            });
            set_mode_div.style.display="none";
            g_set_mode_flag=1;
	    }
	}


    function set_wifi_connect()
    {
        test_next();
        if(g_wifi_connect_button.textContent=="连接中..")
        {
            g_wifi_connect_button.textContent="WiFi连接";
            g_wifi_connect_flag=-1;
        }
        if(g_wifi_connect_flag==-1) return;
        g_wifi_connect_flag=1;
        if(g_wifi_ssid_input.value&&g_wifi_pass_input.value)
        {
            var now_net_info=[],wifi_connect_times=0;
            g_wifi_connect_button.textContent="连接中..";
            $("wifi_connect_span").textContent=" ：进行中..";
            $("wifi_connect_span").style.color="#ffffff";
            set_storage_data({str:"wifi_info", data:{ssid:g_wifi_ssid_input.value,pass:g_wifi_pass_input.value}});
            now_net_info["ifs"] = {token:"ra0", enabled:1};
             now_net_info["dns"]= {conf:{enalbed: 0,mode: "dhcp",static_dns:{0: "0.0.0.0"}}};
            now_net_info.ifs["phy"] = {conf:{mode:"wificlient",mtu: 0}};
             now_net_info.ifs["ipv4"] = {conf:{debug_ip: "",enabled: 1,mode: "dhcp",static_ip: ""}};
            now_net_info.ifs["wifi_client"] ={conf:{enabled:1,ssid:g_wifi_ssid_input.value,key:g_wifi_pass_input.value,usr:g_wifi_ssid_input.value}};
            g_mcloud_agent.net_set({sn:g_selectedDevice.name,networks:now_net_info.ifs,dns:now_net_info.dns},null,function(msg,ref){
                //test_next();
                if(msg.result==""){
                    get_network_info_request();
                }
                else
                {
                    add_test_li("wifi_connect",2);
                    g_wifi_connect_button.textContent="WiFi连接";
                    system_pop_confirm_box({alert:true,index:1,str:"set_wifi_connect error: "+msg.result});
                }
            });
            function get_network_info_request()
            {
                var get_network_timeout_id;
                g_mcloud_agent.net_get({sn:g_selectedDevice.name},null,function(msg,ref){
                    if(msg.result==""){
                        var now_ifs = msg.networks[1];
                        wifi_connect_times++;
                        if((now_ifs.ipv4.info.status == "ok"||now_ifs.ipv4.info.stat == "ok")&& wifi_connect_times>3)
                        {
                            add_test_li("wifi_connect",1);
                            $("dev_site_wifi").href="http://"+now_ifs.ipv4.info.ip.addr;
                            $("dev_site_wifi").textContent="WiFi："+now_ifs.ipv4.info.ip.addr;
                            g_wifi_connect_button.textContent="WiFi连接";
                            if(g_test_array_names[g_test_array_names.length-1]=="wifi_connect")
                            {
                                g_auto_test_flag=0;
                                g_test_button.textContent="开始测试";
                            }
                        }
                        else if(wifi_connect_times<9)
                        {
                            if(g_wifi_connect_flag)
                            {
                                get_network_timeout_id=setTimeout(function(){
                                    get_network_info_request();
                                },4000);
                            }
                            else
                            {
                                $("wifi_connect_span").textContent=" ：取消";
                                $("wifi_connect_span").style.color="#ffffff";
                                g_wifi_connect_button.textContent="WiFi连接";
                                clearTimeout(get_network_timeout_id);
                            }
                        }
                        else
                        {
                            clearTimeout(get_network_timeout_id);
                            add_test_li("wifi_connect",2);
                            g_wifi_connect_button.textContent="WiFi连接";
                            if(g_test_array_names[g_test_array_names.length-1]=="wifi_connect")
                            {
                                g_auto_test_flag=0;
                                g_test_button.textContent="开始测试";
                            }
                            return;
                        }
                    }
                    else
                    {
                        system_pop_confirm_box({alert:true,index:1,str:"get_wifi_list error: "+msg.result});
                        g_wifi_connect_button.textContent="WiFi连接";
                    }
                });
            }
        }
        else
        {
            system_pop_confirm_box({alert:true,index:1,str:"wifi ssid或密码为空"});
            // stop_test();
            $("wifi_connect_span").textContent=" ：取消";
            $("wifi_connect_span").style.color="#ffffff";
            g_wifi_connect_button.textContent="WiFi连接";
        }
    }
	function test_info_(){
        add_test_li("test_info",0);

        g_mcloud_agent.dev_info_get({sn:g_selectedDevice.name},null,function(msg,ref){
            if(msg.result==""){
                add_test_li("test_info",1);
                test_next("info");
            }else{
                add_test_li("test_info",msg.result);
                test_next("info");
            }
        });
		}
    function test_nick_(){
        add_test_li("test_nick",0);
        g_mcloud_agent.nick_set({sn:g_selectedDevice.name,name:"test_name"},null,function(msg,ref){
            if(msg.result==""){
                g_mcloud_agent.nick_set({sn:g_selectedDevice.name,name:g_selectedDevice.name},null,function(msg,ref){
                    if(msg.result==""){
                        add_test_li("test_nick",1);
                        test_next("nick");
                    }else{
                        add_test_li("test_nick",msg.result);
                        test_next("nick");
                    }
                });
            }else{
                add_test_li("test_nick",msg.result);
                test_next("nick");
            }
        });
    }
    function test_osd_(){
        add_test_li("test_osd",0);
        g_mcloud_agent.osd_set({sn:g_selectedDevice.name,text:"anlory1",text_enable:1,date_enable:1,week_enable:1,date_format:"YYYY-MM-DD",time_12h:0,time_enable:1},null,function(msg,ref){
            if(msg.result==""){
                add_test_li("test_osd",1);

            }else{
                add_test_li("test_osd",msg.result);

            }
        });
        g_mcloud_agent.osd_set({sn:g_selectedDevice.name,text:"anlory1",text_enable:1,date_enable:1,week_enable:1,date_format:"YYZY-MM-DD",time_12h:0,time_enable:1},null,function(msg,ref){
            if(msg.result==""){
                add_test_li("test_osd",1);
                test_next("osd");
            }else{
                add_test_li("test_osd",msg.result);
                test_next("osd");
            }
        });
    }

    function test_sd_(){
        add_test_li("test_sd",0);
        g_mcloud_agent.sd_set({sn:g_selectedDevice.name,no_conf:0,enable:1,ctrl_type:1},null,function(msg,ref){
            if(msg.result==""){
                add_test_li("test_sd",1);
                test_next("sd");
            }else{
                add_test_li("test_sd",msg.result);
                test_next("sd");
            }
        });
    }

    function test_alert_(){
        add_test_li("test_alert",0);
        g_mcloud_agent.alarm_trigger_set({sn:g_selectedDevice.name,io_input:'Open',io_output:'Open',sensitivity:'112',night_sensitivity:'-12'},null,function(msg,ref){
            if(msg.result==""){
                add_test_li("test_alert",1);
                test_next("alert");
            }else{
                add_test_li("test_alert",msg.result);
                test_next("alert");
            }
        });
    }

    function test_connect_(){
        add_test_li("test_connect",0);
        var actions = {token:'motion_alert',enable:0,name:"motion_alert",srcs:[{devs:"motion"}],io_out_enable:0,snapshot_enable:1,record_enbale:1,snapshot_interval:0,pre_record_time:"3",io_alert_time:"3"};
        g_mcloud_agent.alarm_action_set({sn:g_selectedDevice.name,enable:0,actions:actions},null,function(msg,ref){
            if(msg.result==""){
                add_test_li("test_connect",1);
                test_next("connect");
            }else{
                add_test_li("test_connect",msg.result);
                test_next("connect");
            }
        });
    }

    function test_date_(){
        add_test_li("test_date",0);
        g_mcloud_agent.time_set({sn:g_selectedDevice.name,type:'manually',auto_sync:0,ntp_addr:"210.72.145.44",timezone:"UTC+09:00",hour:'5',min:'5',sec:'5',year:'2005',mon:'5',day:'5'},null,function(msg,ref){
            if(msg.result==""){
                add_test_li("test_date",1);

            }else{
                add_test_li("test_date",msg.result);

            }
        });
        g_mcloud_agent.time_set({sn:g_selectedDevice.name,type:'manually',auto_sync:0,ntp_addr:"210.72.145.44",timezone:"UTC+09:00",hour:'5',min:'75',sec:'5',year:'2005',mon:'5',day:'5'},null,function(msg,ref){
            if(msg.result==""){
                add_test_li("test_date",1);
                test_next("date");
            }else{
                add_test_li("test_date",msg.result);
                test_next("date");
            }
        });
    }



    function test_audio_(){
        add_test_li("test_audio",0);
        g_mcloud_agent.audio_set({sn:g_selectedDevice.name,speaker_level:33,mic_level:33},null,function(msg,ref){
            if(msg.result==""){
                add_test_li("test_audio",1);
                test_next("audio");
            }else{
                add_test_li("test_audio",msg.result);
                test_next("audio");
            }
        });

    }



    function test_net_(){
        add_test_li("test_net",0);
        g_mcloud_agent.net_set({sn:g_selectedDevice.name,networks:{enabled:1,ipv4:{conf:{debug_ip:'',enabled:1,mode:'static',static_ip:{addr:'192.168.1.111',gw:'192.168.1.1',mask:'255.255.255.0'}}},wifi_client:{conf:{enabled:1,key:'11223344',ssid:'anlory',user:'anlory'}},token: 'ra0'},dns:{conf:{enalbed:0,mode:'static',static_dns:['8.8.8.8','4.2.2.1']}}},null,function(msg,ref){
            if(msg.result==""){
                add_test_li("test_net",1);
                test_next("net");
            }else{
                add_test_li("test_net",msg.result);
                test_next("net");
            }
        });
    }

    function test_mode_(){
        add_test_li("test_mode",0);
        g_mcloud_agent.cam_set({sn:g_selectedDevice.name,brightness:'121',contrast:'-61',color_saturation:'71',sharpness:'8',day_night:'auto',resetreset:0,flip:0,flicker_freq:0},null,function(msg,ref){
            if(msg.result==""){
                add_test_li("test_mode",1);
                test_next("mode");
            }else{
                add_test_li("test_mode",msg.result);
                test_next("mode");
            }
        });
    }

    function test_system_(){
        add_test_li("test_system",0);
        add_test_li("test_system",1);
        test_next("system");
    }

    function test_pic_(){
        add_test_li("test_pic",0);
        g_mcloud_agent.cam_set({sn:g_selectedDevice.name,token:"p0"},null,function(msg,ref){
            if(msg.result==""){
                add_test_li("test_pic",1);
                test_next("pic");
            }else{
                add_test_li("test_pic",msg.result);
                test_next("pic");
            }
        });
    }

    function test_next(text){
        var i = 0;

        if(g_auto_test_flag==1){
        for(i =0;i<g_test_select.length;i++)
        {
            if(g_test_select[i]==text && i< (g_test_select.length-1))
            {
                test(g_test_select[i+1]);
                break;
            }
        }
        }
    }

    function test_plan_(){
        add_test_li("test_plan",0);//wday 取值后7位二进制
        g_mcloud_agent.record_set({sn:g_selectedDevice.name,enable:1,full_time:0,times:[{wday:127,start:1200,end:5400}]},null,function(msg,ref){
            if(msg.result==""){
                add_test_li("test_plan",1);
                test_next("plan");
            }else{
                add_test_li("test_plan",msg.result);
                test_next("plan");
            }
        });
    }

    function test_direct_(){
        add_test_li("test_direct",0);
        add_test_li("test_direct",1);
        test_next("direct");
    }
    function test_dev_start_(){
        add_test_li("test_dev_start",0);
        add_test_li("test_dev_start",1);
        test_next("dev_start");
    }
    function test_date_syn_(){
        add_test_li("test_date_syn",0);
        g_mcloud_agent.time_set({sn:g_selectedDevice.name,type:'manually',auto_sync:0,ntp_addr:"210.72.145.33",timezone:"UTC+08:00",hour:'5',min:'5',sec:'5',year:'2005',mon:'5',day:'5'},null,function(msg,ref){
            if(msg.result==""){
                g_mcloud_agent.time_set({sn:g_selectedDevice.name,type:'NTP',auto_sync:1,ntp_addr:"210.72.145.44",timezone:"UTC+08:00",hour:'6',min:'6',sec:'5',year:'2006',mon:'6',day:'6'},null,function(msg,ref){
                    if(msg.result==""){
                        add_test_li("test_date_syn",1);
                        test_next("date_syn");
                    }else{
                        add_test_li("test_date_syn",msg.result);
                        test_next("date_syn");
                    }
                });

            }else{
                add_test_li("test_date_syn",msg.result);
                test_next("date_syn");
            }

        });

    }
    function test_sys_timezone_(){
        add_test_li("test_sys_timezone",0);
        var hour;
        g_mcloud_agent.time_set({sn:g_selectedDevice.name,type:'NTP',auto_sync:1,ntp_addr:"210.72.145.44",timezone:"UTC+08:00",hour:'6',min:'6',sec:'5',year:'2006',mon:'6',day:'6'},null,function(msg,ref){
            if(msg.result==""){
                g_mcloud_agent.time_get({sn:g_selectedDevice.name},null,function(msg,ref){
                    if(msg.result==""){
                        hour=msg.hour;
                        g_mcloud_agent.time_set({sn:g_selectedDevice.name,type:'NTP',auto_sync:1,ntp_addr:"210.72.145.44",timezone:"UTC+09:00",hour:'6',min:'6',sec:'5',year:'2006',mon:'6',day:'6'},null,function(msg,ref){
                            if(msg.result==""){
                                g_mcloud_agent.time_get({sn:g_selectedDevice.name},null,function(msg,ref){
                                    if(msg.result==""){
                                        if(msg.hour==(hour+1))
                                            add_test_li("test_sys_timezone",1);
                                        else
                                            add_test_li("test_sys_timezone","set timezone failed");
                                        test_next("sys_timezone");

                                    }else{
                                        add_test_li("test_sys_timezone",msg.result);
                                        test_next("sys_timezone");
                                    }
                                });
                            }else{
                                add_test_li("test_sys_timezone",msg.result);
                                test_next("sys_timezone");
                            }
                        });
                    }else{
                        add_test_li("test_sys_timezone",msg.result);
                        test_next("sys_timezone");
                    }

                });
            }else{
                add_test_li("test_sys_timezone",msg.result);
                test_next("sys_timezone");
            }

        });




    }
    function test_wifi_get_(){
        add_test_li("test_wifi_get",0);
        g_mcloud_agent.net_get({sn:g_selectedDevice.name},null,function(msg,ref){
            if(msg.result==""){

                if(msg.networks[1].wifi_client.ap_list[0].ssid ==""){
                    add_test_li("test_wifi_get","wifi_list get error!");
                    test_next("wifi_get");
                }else{
                    add_test_li("test_wifi_get",1);
                    test_next("wifi_get");
                }
            }else{
                add_test_li("test_wifi_get",msg.result);
                test_next("wifi_get");
            }
        });

    }
    function test_wifi_connect_(){

        if(g_wifi_ssid_input.value&&g_wifi_pass_input.value) {
            var now_net_info = [], wifi_connect_times = 0;
            add_test_li("test_wifi_connect", 0);
            set_storage_data({str: "wifi_info", data: {ssid: g_wifi_ssid_input.value, pass: g_wifi_pass_input.value}});
            now_net_info["ifs"] = {token: "ra0", enabled: 1};
            now_net_info["dns"] = {conf: {enalbed: 0, mode: "dhcp", static_dns: {0: "0.0.0.0"}}};
            now_net_info.ifs["phy"] = {conf: {mode: "wificlient", mtu: 0}};
            now_net_info.ifs["ipv4"] = {conf: {debug_ip: "", enabled: 1, mode: "dhcp", static_ip: ""}};
            now_net_info.ifs["wifi_client"] = {conf: {enabled: 1, ssid: g_wifi_ssid_input.value, key: g_wifi_pass_input.value, usr: g_wifi_ssid_input.value}};
            g_mcloud_agent.net_set({sn: g_selectedDevice.name, networks: now_net_info.ifs, dns: now_net_info.dns}, null, function (msg, ref) {
                //test_next();
                if (msg.result == "") {
                    setTimeout(function(){
                        g_mcloud_agent.net_get({sn:g_selectedDevice.name},null,function(msg,ref){
                            if(msg.result==""){

                                if(msg.networks[1].ipv4.info.ip.gw =="0.0.0.0"){
                                    add_test_li("test_wifi_connect","连接失败");
                                    test_next("wifi_connect");

                                }else{
                                    add_test_li("test_wifi_connect",1);
                                    test_next("wifi_connect");

                                }
                            }else{
                                add_test_li("test_wifi_connect",msg.result);
                                test_next("wifi_connect");

                            }
                        });
                    },20000);
                }
                else {
                    add_test_li("test_wifi_connect", msg.result);
                    test_next("wifi_connect");
                }
            });
        }else{
            add_test_li("test_wifi_connect", "please input wifi ssid and password!");
            test_next("wifi_connect");
        }

    }
    function test_wifi_ip_(){
        add_test_li("test_wifi_ip",0);
        add_test_li("test_wifi_ip",1);
        test_next("wifi_ip");
    }
    function test_wifi_set_(){
        add_test_li("test_wifi_set",0);
        add_test_li("test_wifi_set",1);
        test_next("wifi_set");
    }
    function test_isp_set_(){
        add_test_li("test_isp_set",0);
        g_mcloud_agent.cam_set({sn:g_selectedDevice.name,brightness:'121',contrast:'61',color_saturation:'71',sharpness:'8',day_night:'auto',resetreset:0,flip:0,flicker_freq:0},null,function(msg,ref){
            if(msg.result==""){
                g_mcloud_agent.cam_set({sn:g_selectedDevice.name,brightness:'121',contrast:'71',color_saturation:'71',sharpness:'8',day_night:'auto',resetreset:0,flip:0,flicker_freq:0},null,function(msg,ref){
                    if(msg.result==""){
                        g_mcloud_agent.cam_set({sn:g_selectedDevice.name,brightness:'121',contrast:'61',color_saturation:'21',sharpness:'8',day_night:'auto',resetreset:0,flip:0,flicker_freq:0},null,function(msg,ref){
                            if(msg.result==""){
                                g_mcloud_agent.cam_set({sn:g_selectedDevice.name,brightness:'121',contrast:'61',color_saturation:'71',sharpness:'9',day_night:'auto',resetreset:0,flip:0,flicker_freq:0},null,function(msg,ref){
                                    if(msg.result==""){
                                        g_mcloud_agent.cam_set({sn:g_selectedDevice.name,brightness:'25',contrast:'61',color_saturation:'71',sharpness:'8',day_night:'auto',resetreset:0,flip:0,flicker_freq:0},null,function(msg,ref){
                                            if(msg.result==""){
                                                g_mcloud_agent.cam_set({sn:g_selectedDevice.name,brightness:'121',contrast:'61',color_saturation:'62',sharpness:'8',day_night:'auto',resetreset:0,flip:0,flicker_freq:0},null,function(msg,ref){
                                                    if(msg.result==""){
                                                        add_test_li("test_isp_set",1);
                                                        test_next("isp_set");
                                                    }else{
                                                        add_test_li("test_isp_set",msg.result);
                                                        test_next("isp_set");
                                                    }
                                                });
                                            }else{
                                                add_test_li("test_isp_set",msg.result);
                                                test_next("isp_set");
                                            }
                                        });
                                    }else{
                                        add_test_li("test_isp_set",msg.result);
                                        test_next("isp_set");
                                    }
                                });
                            }else{
                                add_test_li("test_isp_set",msg.result);
                                test_next("isp_set");
                            }
                        });
                    }else{
                        add_test_li("test_isp_set",msg.result);
                        test_next("isp_set");
                    }
                });
            }else{
                add_test_li("test_isp_set",msg.result);
                test_next("isp_set");
            }

        });
    }
    function test_osd_set_(){
        add_test_li("test_osd_set",0);
        g_mcloud_agent.osd_set({sn:g_selectedDevice.name,text:"anlory1",text_enable:1,date_enable:0,week_enable:0,date_format:"YYYY-MM-DD",time_12h:0,time_enable:0},null,function(msg,ref){
            if(msg.result==""){
                g_mcloud_agent.osd_set({sn:g_selectedDevice.name,text:"anlory1",text_enable:0,date_enable:1,week_enable:0,date_format:"YYYY-MM-DD",time_12h:0,time_enable:0},null,function(msg,ref){
                    if(msg.result==""){
                        g_mcloud_agent.osd_set({sn:g_selectedDevice.name,text:"anlory1",text_enable:0,date_enable:0,week_enable:1,date_format:"YYYY-MM-DD",time_12h:0,time_enable:0},null,function(msg,ref){
                            if(msg.result==""){
                                g_mcloud_agent.osd_set({sn:g_selectedDevice.name,text:"anlory1",text_enable:0,date_enable:0,week_enable:0,date_format:"YYYY-MM-DD",time_12h:0,time_enable:1},null,function(msg,ref){
                                    if(msg.result==""){
                                        g_mcloud_agent.osd_set({sn:g_selectedDevice.name,text:"anlory1",text_enable:1,date_enable:1,week_enable:0,date_format:"YYYY-MM-DD",time_12h:0,time_enable:1},null,function(msg,ref){
                                            if(msg.result==""){
                                                g_mcloud_agent.osd_set({sn:g_selectedDevice.name,text:"anlory1",text_enable:1,date_enable:1,week_enable:1,date_format:"YYYY-MM-DD",time_12h:0,time_enable:1},null,function(msg,ref){
                                                    if(msg.result==""){
                                                        g_mcloud_agent.osd_set({sn:g_selectedDevice.name,text:"anlory1",text_enable:0,date_enable:0,week_enable:0,date_format:"YYYY-MM-DD",time_12h:0,time_enable:0},null,function(msg,ref){
                                                            if(msg.result==""){
                                                                add_test_li("test_osd_set",1);
                                                                test_next("osd_set");
                                                            }else{
                                                                add_test_li("test_osd_set",msg.result);
                                                                test_next("osd_set");
                                                            }
                                                        });
                                                    }else{
                                                        add_test_li("test_osd_set",msg.result);
                                                        test_next("osd_set");
                                                    }
                                                });
                                            }else{
                                                add_test_li("test_osd_set",msg.result);
                                                test_next("osd_set");
                                            }
                                        });
                                    }else{
                                        add_test_li("test_osd_set",msg.result);
                                        test_next("osd_set");
                                    }
                                });
                            }else{
                                add_test_li("test_osd_set",msg.result);
                                test_next("osd_set");
                            }
                        });
                    }else{
                        add_test_li("test_osd_set",msg.result);
                        test_next("osd_set");
                    }
                });
            }else{
                add_test_li("test_osd_set",msg.result);
                test_next("osd_set");
            }
        });

    }
    function test_dev_flip_(){
        add_test_li("test_dev_flip",0);
        g_mcloud_agent.cam_set({sn:g_selectedDevice.name,brightness:'121',contrast:'-61',color_saturation:'71',sharpness:'8',day_night:'auto',resetreset:0,flip:1,flicker_freq:0},null,function(msg,ref){
            if(msg.result==""){
                g_mcloud_agent.cam_set({sn:g_selectedDevice.name,brightness:'121',contrast:'-61',color_saturation:'71',sharpness:'8',day_night:'auto',resetreset:0,flip:0,flicker_freq:0},null,function(msg,ref){
                    if(msg.result==""){
                        add_test_li("test_dev_flip",1);
                        test_next("dev_flip");
                    }else{
                        add_test_li("test_dev_flip",msg.result);
                        test_next("dev_flip");
                    }
                });
            }else{
                add_test_li("test_dev_flip",msg.result);
                test_next("dev_flip");
            }

        });

    }
    function test_sd_format_(){
        add_test_li("test_sd_format",0);
        g_mcloud_agent.sd_set({sn:g_selectedDevice.name,no_conf:0,enable:1,ctrl_type:"mount"},null,function(msg,ref){
            if(msg.result==""){
                g_mcloud_agent.sd_set({sn:g_selectedDevice.name,no_conf:0,enable:1,ctrl_type:"format"},null,function(msg,ref){
                    if(msg.result==""){
                        setTimeout(function(){
                            g_mcloud_agent.sd_get({sn:g_selectedDevice.name},null,function(msg,ref){
                                if(msg.result==""){
                                    if(msg.usage==0){
                                        add_test_li("test_sd_format",1);
                                        test_next("sd_format");
                                    }else{
                                        add_test_li("test_sd_format","format sd failed");
                                        test_next("sd_format");
                                    }
                                }else{
                                    add_test_li("test_sd_format",msg.result);
                                    test_next("sd_format");
                                }
                            });
                        },10000);
                    }else{
                        add_test_li("test_sd_format",msg.result);
                        test_next("sd_format");
                    }
                });
            }else{
                add_test_li("test_sd_format",msg.result);
                test_next("sd_format");
            }
        });
    }
    function test_sd_show_(){
        add_test_li("test_sd_show",0);
        g_mcloud_agent.sd_set({sn:g_selectedDevice.name,no_conf:0,enable:1,ctrl_type:"mount"},null,function(msg,ref){
            if(msg.result==""){
                setTimeout(function(){var a=3;},5000);
                g_mcloud_agent.sd_get({sn:g_selectedDevice.name},null,function(msg,ref){
                    if(msg.result==""){
                        if((msg.capacity=="")){
                            add_test_li("test_sd_show", " sd_show failed");
                            test_next("sd_show");
                        }else{
                            add_test_li("test_sd_show",1);
                            test_next("sd_show");
                        }
                    }else{
                        add_test_li("test_sd_show",msg.result);
                        test_next("sd_show");
                    }
                });
            }else{
                add_test_li("test_sd_show",msg.result);
                test_next("sd_show");
            }
        });
    }

    function test_sd_load_(){
        add_test_li("test_sd_load",0);
        g_mcloud_agent.sd_set({sn:g_selectedDevice.name,no_conf:0,enable:1,ctrl_type:"umount"},null,function(msg,ref){
            if(msg.result==""){
                g_mcloud_agent.sd_set({sn:g_selectedDevice.name,no_conf:0,enable:1,ctrl_type:"mount"},null,function(msg,ref){
                    if(msg.result==""){
                        setTimeout(function(){
                            g_mcloud_agent.sd_get({sn:g_selectedDevice.name},null,function(msg,ref){
                                if(msg.result==""){
                                    if((msg.capacity=="")){
                                        add_test_li("test_sd_load", " sd_load failed");
                                        test_next("sd_load");
                                    }else{
                                        add_test_li("test_sd_load",1);
                                        test_next("sd_load");
                                    }
                                }else{
                                    add_test_li("test_sd_load",msg.result);
                                    test_next("sd_load");
                                }
                            });
                        },10000);

                    }else{
                        add_test_li("test_sd_load",msg.result);
                        test_next("sd_load");
                    }
                });
            }else{
                add_test_li("test_sd_load",msg.result);
                test_next("sd_load");
            }
        });
    }
    function test_sd_unload_(){
        add_test_li("test_sd_unload",0);
        g_mcloud_agent.sd_set({sn:g_selectedDevice.name,no_conf:0,enable:1,ctrl_type:"mount"},null,function(msg,ref){
            if(msg.result==""){
                g_mcloud_agent.sd_set({sn:g_selectedDevice.name,no_conf:0,enable:1,ctrl_type:"umount"},null,function(msg,ref){
                    if(msg.result==""){
                        add_test_li("test_sd_unload",1);
                        test_next("sd_unload");
                    }else{
                        add_test_li("test_sd_unload",msg.result);
                        test_next("sd_unload");
                    }
                });
            }else{
                add_test_li("test_sd_unload",msg.result);
                test_next("sd_unload");
            }
        });



    }
    function test_admin_(){
        add_test_li("test_admin",0);
        var pass=g_default_pass_input.value;
        g_mcloud_agent.sign_in({srv : g_selectedDevice.ip,user : g_selectedDevice.name,password : g_default_pass_input.value}, null,
            function(msg, ref) {
                if(msg.result==""){
                    g_mcloud_agent.dev_passwd_set({sn:g_selectedDevice.name,is_guest:0,old_pass:g_default_pass_input.value,new_pass:"123456"},null,function(msg,ref){
                        if(msg.result==""){
                            add_test_li("test_admin",1);
                        }else{
                            add_test_li("test_admin",msg.result);

                        }
                    });
                }else{
                    add_test_li("test_admin",msg.result);

                }

            });



    }

    function test_guest_(){
        add_test_li("test_guest",0);
        var pass=g_default_pass_input.value;
        g_mcloud_agent.dev_passwd_set({sn:g_selectedDevice.name,is_guest:1,old_pass:g_default_pass_input.value,new_pass:"111111"},null,function(msg,ref){
            if(msg.result==""){
                g_mcloud_agent.sign_in({srv : g_selectedDevice.ip,user : g_selectedDevice.name,password :"111111"}, null,
                    function(msg, ref) {
                        if(msg.result==""){
                            g_mcloud_agent.dev_passwd_set({sn:g_selectedDevice.name,is_guest:0,old_pass:g_default_pass_input.value,new_pass:"123456"},null,function(msg,ref){
                                if(msg.result=="permission.denied"){
                                    g_mcloud_agent.nick_set({sn:g_selectedDevice.name,name:g_selectedDevice.name},null,function(msg,ref){
                                        if(msg.result=="permission.denied"){
                                            g_mcloud_agent.osd_set({sn:g_selectedDevice.name,text:"anlory1",text_enable:1,date_enable:1,week_enable:1,date_format:"YYYY-MM-DD",time_12h:0,time_enable:1},null,function(msg,ref){
                                                if(msg.result=="permission.denied"){
                                                    g_mcloud_agent.alarm_trigger_set({sn:g_selectedDevice.name,io_input:'Open',io_output:'Open',sensitivity:'112',night_sensitivity:'-12'},null,function(msg,ref){
                                                        if(msg.result=="permission.denied"){
                                                            var actions = {token:'motion_alert',enable:0,name:"motion_alert",srcs:[{devs:"motion"}],io_out_enable:0,snapshot_enable:1,record_enbale:1,snapshot_interval:0,pre_record_time:"3",io_alert_time:"3"};
                                                            g_mcloud_agent.alarm_action_set({sn:g_selectedDevice.name,enable:0,actions:actions},null,function(msg,ref){
                                                                if(msg.result=="permission.denied"){
                                                                    g_mcloud_agent.time_set({sn:g_selectedDevice.name,type:'manually',auto_sync:0,ntp_addr:"210.72.145.44",timezone:"UTC+09:00",hour:'5',min:'5',sec:'5',year:'2005',mon:'5',day:'5'},null,function(msg,ref){
                                                                        if(msg.result=="permission.denied"){
                                                                            g_mcloud_agent.audio_set({sn:g_selectedDevice.name,speaker_level:33,mic_level:33},null,function(msg,ref){
                                                                                if(msg.result=="permission.denied"){
                                                                                    g_mcloud_agent.record_set({sn:g_selectedDevice.name,enable:1,full_time:0,times:[{wday:127,start:1200,end:5400}]},null,function(msg,ref){
                                                                                        if(msg.result=="permission.denied"){
                                                                                            g_mcloud_agent.cam_set({sn:g_selectedDevice.name,brightness:'121',contrast:'-61',color_saturation:'71',sharpness:'8',day_night:'auto',resetreset:0,flip:0,flicker_freq:0},null,function(msg,ref){
                                                                                                if(msg.result=="permission.denied"){
                                                                                                    g_mcloud_agent.cam_set({sn:g_selectedDevice.name,token:"p0"},null,function(msg,ref){
                                                                                                        if(msg.result=="permission.denied"){
                                                                                                            add_test_li("test_guest",1);
                                                                                                            test_next("guest");
                                                                                                        }else{
                                                                                                            add_test_li("test_guest",msg.result);
                                                                                                            test_next("guest");
                                                                                                        }
                                                                                                    });
                                                                                                }else{
                                                                                                    add_test_li("test_guest",msg.result);
                                                                                                    test_next("guest");
                                                                                                }
                                                                                            });
                                                                                        }else{
                                                                                            add_test_li("test_guest",msg.result);
                                                                                            test_next("guest");
                                                                                        }
                                                                                    });
                                                                                }else{
                                                                                    add_test_li("test_guest",msg.result);
                                                                                    test_next("guest");
                                                                                }
                                                                            });

                                                                        }else{
                                                                            add_test_li("test_guest",msg.result);
                                                                            test_next("guest");

                                                                        }
                                                                    });
                                                                }else{
                                                                    add_test_li("test_guest",msg.result);
                                                                    test_next("guest");
                                                                }
                                                            });
                                                        }else{
                                                            add_test_li("test_guest",msg.result);
                                                            test_next("guest");
                                                        }
                                                    });

                                                }else{
                                                    add_test_li("test_guest",msg.result);
                                                    test_next("guest");

                                                }
                                            });
                                        }else{
                                            add_test_li("test_guest",msg.result);
                                            test_next("guest");
                                        }
                                    });
                                }else{
                                    add_test_li("test_guest",msg.result);
                                    test_next("guest");
                                }
                            });
                        }else{
                            add_test_li("test_guest",msg.result);
                            test_next("guest");
                        }
                    });
            }else{
                add_test_li("test_guest",msg.result);
                test_next("guest");
            }
        });
    }

    function test_box_(){
        add_test_li("test_box",0);
        var erase_time;
        var  l_currentDate = new Date();
        l_current_year=l_currentDate.getFullYear();
            l_current_month= l_currentDate.getMonth() + 1;
            l_current_day = l_currentDate.getDate();
        st_time = ((new Date(l_current_year+"/"+l_current_month+"/"+l_current_day+" 00:00:00")).getTime());
        en_time = st_time + 60*60*24*1000 ;
       // add_test_li("test_box",st_time+"\r\n"+en_time);

        g_mcloud_agent.box_get({box_sn:g_selectedDevice.name,dev_sn:"1jfiegbpxgzhq",flag:4,start_time:st_time,end_time:en_time},null,function(msg,ref) {
            if(msg.result==""){
                erase_time = msg.segs[0].stm;
             //   add_test_li("test_box",msg.segs);
                g_mcloud_agent.box_set({sn:g_selectedDevice.name,dev_sn:"1jfiegbpxgzhq",cmd:"erase",start_time:msg.segs[0].stm,end_time:msg.segs[0].etm},null,function(msg,ref){
                    if(msg.result==""){
                        g_mcloud_agent.box_get({box_sn:g_selectedDevice.name,dev_sn:"1jfiegbpxgzhq",flag:4,start_time:st_time,end_time:en_time},null,function(msg,ref) {
                            if(msg.result==""){
                                if(erase_time == msg.segs[0].stm){
                                    add_test_li("test_box","删除失败");
                                }else
                                {
                                    add_test_li("test_box",1);
                                }
                                test_next("box");
                            }else{

                                add_test_li("test_box",msg.result);
                                test_next("box");
                            }
                        });
                    }else{
                        add_test_li("test_box",msg.result);
                        test_next("box");
                    }
                });

            }else{

                add_test_li("test_box",msg.result);
                test_next("box");
            }
        });

    }



	function auto_test () {
	    g_auto_test_flag=1;
        var i=0;
        g_test_select.splice(0,g_test_select.length);//clear array g_test_select
	   if(select_checkbox.checked || test_direct.checked)
           g_test_select[i++]='direct';
	   if(select_checkbox.checked|| test_dev_start.checked)
           g_test_select[i++]='dev_start';
       if(select_checkbox.checked|| test_date_syn.checked)
           g_test_select[i++]='date_syn';
	   if(select_checkbox.checked|| test_sys_timezone.checked)
           g_test_select[i++]='sys_timezone';
	   if(select_checkbox.checked|| test_wifi_get.checked)
           g_test_select[i++]='wifi_get';
      if(select_checkbox.checked|| test_wifi_connect.checked)
           g_test_select[i++]='wifi_connect';
        /*    if(select_checkbox.checked|| test_wifi_ip.checked)
           g_test_select[i++]='wifi_ip';
       if(select_checkbox.checked|| test_wifi_set.checked)
           g_test_select[i++]='wifi_set';
           */
	   if(select_checkbox.checked|| test_osd_set.checked)
           g_test_select[i++]='osd_set';
	   	if(select_checkbox.checked|| test_isp_set.checked)
            g_test_select[i++]='isp_set';
         if(select_checkbox.checked|| test_dev_flip.checked)
            g_test_select[i++]='dev_flip';
        if(select_checkbox.checked|| test_pic.checked)
            g_test_select[i++]='pic';
        if(select_checkbox.checked|| test_plan.checked)
            g_test_select[i++]='plan';
        if(select_checkbox.checked|| test_sd_format.checked)
            g_test_select[i++]='sd_format';
        if(select_checkbox.checked|| test_sd_show.checked)
            g_test_select[i++]='sd_show';
        if(select_checkbox.checked|| test_sd_load.checked)
            g_test_select[i++]='sd_load';
        if(select_checkbox.checked|| test_sd_unload.checked)
            g_test_select[i++]='sd_unload';
        if(select_checkbox.checked|| test_audio.checked)
            g_test_select[i++]='audio';
        if(select_checkbox.checked|| test_nick.checked)
            g_test_select[i++]='nick';
        if(select_checkbox.checked|| test_guest.checked)
            g_test_select[i++]='guest';
        if(select_checkbox.checked|| test_admin.checked)
            g_test_select[i++]='admin';
        if(select_checkbox.checked|| test_box.checked)
            g_test_select[i++]='box';

            clear_span();
            test(g_test_select[0]);
      	}
		
    function clear_span(){
        var i=0;
        var dom="";
        for(i=0;i<g_test_select.length;i++){
            dom="test_"+g_test_select[i];
            add_test_li(dom,"");
        }
    }


	

	function close_view(){
        var wifi_list_div=$("wifi_list_div");
        if(wifi_list_div){
            wifi_list_div.style.display="none";
            g_wifi_list_flag=1;
        }
        if(g_alarm_action_flag)set_alarm_action(0);
    }
	function add_test_li(dom,num)
	{
	    if(num==0)
	    {
	        $(dom+"_span").textContent=" ：进行中..";
	        $(dom+"_span").style.color="#ffffff";
	    }
	    else if(num==1)
	    {
            if($(dom+"_span").textContent==" ：进行中..")
                $(dom+"_span").textContent="";
	        $(dom+"_span").textContent+="  √";
	        $(dom+"_span").style.color="#A8FF24";
	    }

	    else
	    {
            if($(dom+"_span").textContent==" ：进行中..")
                $(dom+"_span").textContent="";
	        $(dom+"_span").textContent+="  ×";
            $(dom+"_span").textContent+=num;
	        $(dom+"_span").style.color="#ff0000";
	    }
	}
	function show_result()
	{
	    if(g_test_array_names[g_test_array_names.length-1]=="wifi_connect") return;
	    g_auto_test_flag=0;
	    g_test_button.textContent="开始测试";
	}
	function clear_test_content () {
	   var test_span=g_test_ul.getElementsByTagName("span");
	   for(temp_span in test_span)
	   {
	       test_span[temp_span].textContent="";
	   }
	}
	function stop_test () {
	    if($("system_pop_confirm_box2"))
	    {
	        var pop_confirm_box = $("system_pop_confirm_box2"),
                pop_confirm_content = $("system_pop_confirm_content2"),
                pop_confirm_div = $("system_pop_confirm_div2");
            pop_confirm_box.innerHTML = "";
            pop_confirm_box.parentNode.removeChild(pop_confirm_box);
            pop_confirm_box = null;
	    }
	    var array_name=g_test_array_names[g_test_array_index];
	    if(array_name)
	    {
	        $(array_name+"_span").textContent=" ：取消";
	        $(array_name+"_span").style.color="#ffffff";
	    }
	    g_wifi_connect_flag=0;
        show_result();
        close_view();
	}
    function system_pop_confirm_box(obj)
    {
        var pop_confirm_box = $("system_pop_confirm_box"+obj.index),
            pop_confirm_content, pop_confirm_div,
            client_w, client_h;
        if(!pop_confirm_box)
        {
            client_h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            client_w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            pop_confirm_box = dom_create_child(g_main_page_div, "div", "system_pop_confirm_box"+obj.index);
            pop_confirm_content = dom_create_child(pop_confirm_box, "div", "system_pop_confirm_cotent"+obj.index);
            pop_confirm_div = dom_create_child(pop_confirm_box, "div", "system_pop_confirm_div"+obj.index);
            pop_confirm_div.style.cssText = "position:absolute;width:" + client_w + "px;height:" + client_h + "px;background-color:#fff;opacity:0.1;"
                + "filter:alpha(opacity=10);z-index:50";
            pop_confirm_content.style.cssText = "position:absolute;top:" + ((client_h +100)/ 2) + "px;left:" + (client_w/5) + "px;z-index:51;"
                + " background:url('imgs/mipc_img.png') no-repeat scroll -458px -167px transparent;width:286px;height:168px;"
                + "-webkit-box-shadow:0 2px 30px #050505; -moz-box-shadow:0 2px 30px #050505; box-shadow:0 2px 30px #050505;"
                +"font-family: 微软雅黑, Verdana, Arial, Helvetica, sans-serif;";
            if(obj.alert)
            {
                pop_confirm_content.innerHTML =
                     "<div style='padding-left:15px;padding-top:20px;font-weight:900;font-size:18px;color:#EEE;text-align: center;'>" + obj.str + "</div>"
                    +"<div style='position:absolute;bottom:15px'>"
                    +   "<button id='standard_buttons_confirm' style='margin-left:100px'>确定(Enter)</button>"
                    +"</div>";

                $("standard_buttons_confirm").onclick=function(){
                    while($("system_pop_confirm_box"+obj.index))
                    {
                        var pop_confirm_box = $("system_pop_confirm_box"+obj.index),
                            pop_confirm_content = $("system_pop_confirm_content"+obj.index),
                            pop_confirm_div = $("system_pop_confirm_div"+obj.index);
                        pop_confirm_box.innerHTML = "";
                        pop_confirm_box.parentNode.removeChild(pop_confirm_box);
                        pop_confirm_box = null;
                    }
                };
                pop_confirm_box.tabIndex=-1;
                pop_confirm_box.focus();
                pop_confirm_box.onkeydown=function(event){
                   var standard_buttons_confirm=$("standard_buttons_confirm");
                   if(standard_buttons_confirm)
                   {
                       var e=event||window.event;
                       if(e.keyCode==13)
                           standard_buttons_confirm.click();
                   }
                };
            }
            else
            {
                pop_confirm_content.innerHTML =
                     "<div style='padding-left:15px;padding-top:20px;font-weight:900;font-size:16px;color:#EEE'>" + obj.quest + "</div>"
                    +"<div style='position:absolute;bottom:15px'>"
                    +   "<button id='standard_buttons_green'>是(Enter)</button>"
                    +   "<button id='standard_buttons_red'>否(Esc)</button>"
                    +"</div>";

                $("standard_buttons_green").onclick=function(){
                    var pop_confirm_box = $("system_pop_confirm_box"+obj.index),
                        pop_confirm_content = $("system_pop_confirm_content"+obj.index),
                        pop_confirm_div = $("system_pop_confirm_div"+obj.index);
                    pop_confirm_box.innerHTML = "";
                    pop_confirm_box.parentNode.removeChild(pop_confirm_box);
                    pop_confirm_box = null;
                    if($("system_pop_confirm_box1")) $("system_pop_confirm_box1").focus();
                    obj.callback_func(1);
               };
               $("standard_buttons_red").onclick = function() {
                    var pop_confirm_box = $("system_pop_confirm_box"+obj.index),
                        pop_confirm_content = $("system_pop_confirm_content"+obj.index),
                        pop_confirm_div = $("system_pop_confirm_div"+obj.index);
                    pop_confirm_box.innerHTML = "";
                    pop_confirm_box.parentNode.removeChild(pop_confirm_box);
                    pop_confirm_box = null;
                    if($("system_pop_confirm_box1")) $("system_pop_confirm_box1").focus();
                    obj.callback_func(0);
               };
               pop_confirm_box.tabIndex=-1;
               pop_confirm_box.focus();
               pop_confirm_box.onkeydown=(function(event)
               {
                   var e=event||window.event;
                   var standard_buttons_green=$("standard_buttons_green");
                   var standard_buttons_red=$("standard_buttons_red");

                   if(standard_buttons_green&&standard_buttons_red)
                   {
                      if(e.keyCode==13)
                           standard_buttons_green.click();
                      else if(e.keyCode==27)
                           standard_buttons_red.click();
                   }
               });

            }

        }
    }

   

	window.auto_test = {
		test:test
	};
})(window);