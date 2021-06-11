/*
 mcloud_agent
 depends:
 mlib.cloud.account.js
 cryptojs_tripledes.js
 cryptojs_pad-nopadding-min.js
 mlib.crypt.dh.js
 mlib.crypt.md5.js
 mlib.core.rpc.js
 mlib.core.codec.js
 mlib.core.evt.js

 ----history----------
 author: chengzhiyong date: 2014-08-13 action: create
 */
(function(window){
    var l_srv = "", //域名
        l_devs = [],  //设备列表
        mcloud_account = window.mcloud_account,
        mcodec = window.mcodec,
        l_lid = 0, l_sid = 0, l_seq = 0, l_addr = "", l_share_key = "",
        l_fix = null; //{type:funcion(type){},/* return fixed type; */req:{function(type,req){ /* return fixed req data */},ack:{function(type,ack){ /* return fixed ack data */}
    var login_data = {};
    function ldev_get(sn){
        for(var dev, i = 0; i < l_devs.length; ++i)
        {
            if((dev = l_devs[i]) && (dev.sn == sn)){ return dev; }
        }
        return null;
    }
    function ldev_index_get(sn){
        for(var i = 0,length = l_devs.length ; i < length ; i++){
            if(mcloud_agent.devs.list[i].sn == sn){
                return i;
            }
        }
    }
    function ldev_del(sn){
        for(var i = 0; i < l_devs.length; ++i)
        {
            if(l_devs[i].sn == sn){ l_devs.splice(i,1); }
        }
    }
    function ldev_add(dev)
    {
        var temp_dev = ldev_get(dev.sn);
        if(!temp_dev){l_devs[l_devs.length] = dev; }
    }

    function sign_up(obj, ref, on_ack)
    {
        return mcloud_account.sign_up(obj.srv,obj.user,obj.password,null, ref, function(msg, ref) {
            on_ack({result:msg.data.result}, ref);
        });
    }

    function sign_in(obj, ref, on_ack)
    {
        return mcloud_account.sign_in(obj.srv, obj.user, obj.password, null, ref, function(msg, ref) {
            on_ack({result:get_ret(msg)}, ref);
        });
    }
    function sign_out(ref, on_ack)
    {
        return mcloud_account.sign_out(ref, function(msg, ref) {
            on_ack({result:get_ret(msg)}, ref);
        });
    }

    // function get_share_key(share_key)
    // {
    //     window.localStorage.setItem("share_key", share_key);
    // }
    //
    // function get_sid(sid)
    // {
    //     l_sid = sid;
    // }
    //
    // function get_lid(lid)
    // {
    //     window.localStorage.setItem("lid", lid);
    // }

    // function get_native_username(username){
    //     window.localStorage.setItem("username", username);
    // }
    // function get_native_password(password){
    //     window.localStorage.setItem("password", password);
    // }

    function get_srv_param(srv)
    {
        return l_srv = srv;
    }
    function send_msg(type, data, ref, on_ack)
    {
        if(!l_srv){ mcloud_account.set_srv(window.location.host); }
        return mcloud_account.send_msg(l_fix?l_fix.type(type):type, l_fix?l_fix.req(type, data):data, ref,
            l_fix?function(ack,ref){on_ack(l_fix.ack(type,ack),ref)}:on_ack);
    }
    function create_nid()
    {
        return mcloud_account.create_nid();
    }
    function pwd_encrypt(pwd_md5_hex){
        return mcloud_account.pwd_encrypt(pwd_md5_hex);
    }
    function get_ret (msg) {
        var ret = (msg && msg.data)?(msg.data.ret || msg.data.result):null ;
        if (Object.prototype.toString.call(ret) === "[object String]") {return ret;}
        else{return s_ret = ret?(ret.reason || ret.sub|| ret.code):null;}
    }
    /* devs_refresh({filter:"xxx"}, ref, on_ack) ret:{}*/
    function devs_refresh(obj, ref, on_ack)
    {
        send_msg("ccm_devs_get", {sess:{nid:create_nid()}, start:0, counts:128}, ref,
            function(msg, ref){
                var result=get_ret(msg);
                if(result == "")
                {
                    l_devs.length = 0;
                    var devices = msg.data.devs;
                    if(devices){
                        for(i = 0; i < devices.length ; ++i){
                            l_devs[i] = devices[i];
                        }
                    }
                }
                on_ack({result:result},ref);
            });
    }

    function play(obj, ref, on_ack)
    {
        send_msg("ccm_play",{sess:{nid:create_nid(),sn:obj.sn},
                setup:{stream:"RTP_Unicast", trans:{proto:obj.protocol}}, token:obj.token},ref,
            function(msg, ref){on_ack({result:get_ret(msg), url:(msg.data.uri?msg.data.uri.url:"")},ref);});
    }

    function record (obj, ref, on_ack) {
        send_msg("ccm_record_task_get", {sess:{nid:create_nid(),sn:obj.sn}},ref,
            function(msg, ref){
                var result=get_ret(msg);
                if((result == "")&&msg.data.sd_ready==1)
                {
                    /* >0:every set keep_time add record time , -1:stop */
                    msg.data.task.keep=obj.keep_time;
                    send_msg("ccm_record_task_set", {sess:{nid:create_nid(),sn:obj.sn},task:msg.data.task},ref,
                        function(msg2, ref){on_ack({result:get_ret(msg2)},ref);});
                }
                else{
                    on_ack({result:result,sd_ready:msg.data.sd_ready},ref);
                }
            });
    }

    function pic_get (obj, ref, on_ack) {
        var srv=mcloud_account.get_srv();
        send_msg("ccm_snapshot",{sess:{nid:create_nid(),sn:obj.sn},token:((obj.token=="p1")?"p0":obj.token)},ref,
            function(msg,ref) {on_ack({result:get_ret(msg),url:pic_url_get(obj)},ref);});
    }

    function pic_url_get(obj){
        return window.location.protocol+ "//" +mcloud_account.get_srv()+ "/ccm/ccm_pic_get.jpg?hfrom_handle=887330&dsess=1&dsess_nid="+create_nid()+"&dsess_sn="+obj.sn+"&dtoken="+obj.token+"_xxxxxxxxxx";
    }

    function pushtalk (obj, ref, on_ack) {
        send_msg("ccm_talk",{sess:{nid:create_nid(),sn:obj.sn},setup:{stream:"RTP_Unicast", trans:{proto:obj.protocol}}, token:obj.token},ref,
            function(msg,ref) {on_ack({result:get_ret(msg), url:(msg.data.uri?msg.data.uri.url:"")},ref);});
    }

    function ptz_ctrl (obj, ref, on_ack) {
        send_msg("ccm_ptz_ctl", {sess:{nid:create_nid(), sn:obj.sn},
                trans:{pan_tilt:{x:obj.x, y:obj.y}},speed:{pan_tilt:{x:30,y:30}}},ref,
            function(msg, ref){on_ack({result:get_ret(msg)},ref);});
    }

    function playback (obj, ref, on_ack) {
        send_msg("ccm_replay", {sess:{nid:create_nid(), sn:obj.sn},
                setup:{stream:"RTP_Unicast", trans:{proto:obj.protocol}}, token:obj.token},ref,
            function(msg,ref) {on_ack({result:get_ret(msg), url:(msg.data.url?msg.data.url:"")},ref);});
    }

    function msgs_get (obj, ref, on_ack) {
        send_msg("ccm_msg_get", {sess:{nid:create_nid(), sn:obj.sn},
                flag:0, start:obj.start,filter:obj.filter, counts:obj.counts},ref,
            function(msg,ref) {on_ack({result:get_ret(msg),max_id:msg.data.max_id,min_id:msg.data.min_id,total:msg.data.total,bound:msg.data.bound,messages:msg.data.messages},ref);});
    }

    function dev_del (obj, ref, on_ack) {
        send_msg("ccm_dev_del", {sess:{nid:create_nid()},sn:obj.sn},ref,
            function(msg,ref) {on_ack({result:get_ret(msg)},ref);});
    }

    function dev_add (obj, ref, on_ack) {
        var pwd_md5_hex = mmd5.hex(obj.pass || "");
        send_msg("ccm_dev_add", {sess:{nid:create_nid()}, sn:obj.sn,pwd:pwd_encrypt(pwd_md5_hex)},ref,
            function(msg,ref) {
                var result=get_ret(msg);
                if(result == "")
                {
                    var devices = msg.data.info;
                    if(devices)
                    {
                        ldev_add(devices);
                    }
                }
                on_ack({result:result,info:msg.data.info},ref);
            });
    }

    function account_passwd_set (obj, ref, on_ack) {
        mcloud_account.pwd_set(obj.old_pass,obj.new_pass,obj.is_guest,ref,function(msg, ref) {
            on_ack({result:get_ret(msg)}, ref);
        });
    }


    function box_set (obj, ref, on_ack) {
        send_msg("ccm_box_set",{sess:{nid:create_nid(),sn:obj.sn},sn:obj.dev_sn,cmd:obj.cmd,start_time:obj.start_time,end_time:obj.end_time},ref,
            function(msg,ref){
                on_ack({result:get_ret(msg)},ref);
            })
    }

    function cam_get (obj, ref, on_ack) {
        var brightness,contrast,color_saturation,sharpness,day_night,flip,flicker_freq;
        send_msg("ccm_img_get", {sess:{nid:create_nid(),sn:obj.sn},token:"vs0"},ref,
            function(msg,ref) {
                var result=get_ret(msg);
                if((result == "")&&msg.data.conf)
                {
                    brightness = msg.data.conf.brightness;
                    contrast = msg.data.conf.contrast;
                    color_saturation = msg.data.conf.color_saturation;
                    sharpness = msg.data.conf.sharpness;
                    day_night = msg.data.conf.mode; /* auto(default),day,night */
                    send_msg("ccm_misc_get", {sess:{nid:create_nid(),sn:obj.sn}},ref,
                        function(msg2,ref) {
                            var result2=get_ret(msg2);
                            if(result2 == "")
                            {
                                var msg2=msg2.data?msg2.data.info:"";
                                flip  = msg2.flip; /* 0/1 0:none-flip, 1:filp */
                                flicker_freq = msg2.power_freq;    /* 0/1 0:60hz, 1:50hz */
                            }
                            on_ack({result:result2,brightness:brightness,contrast:contrast,color_saturation:color_saturation,sharpness:sharpness,day_night:day_night,flip:flip,flicker_freq:flicker_freq},ref);
                        });
                }
                else{
                    on_ack({result:result}, ref);
                }
            });
    }

    function cam_set (obj, ref, on_ack) {
        send_msg("ccm_img_set", {sess:{nid:create_nid(),sn:obj.sn},token:"vs0",
                conf:{brightness:obj.brightness,contrast:obj.contrast,color_saturation:obj.color_saturation,sharpness:obj.sharpness,mode:obj.day_night},reset:obj.reset},ref,
            function(msg,ref) {
                var result=get_ret(msg);
                if(result == ""){
                    send_msg("ccm_misc_set", {sess:{nid:create_nid(),sn:obj.sn},info:{flip:obj.flip,power_freq:obj.flicker_freq}},ref,
                        function(msg2,ref) {on_ack({result:get_ret(msg2)}, ref);});
                }else{
                    on_ack({result:result}, ref);
                }
            });
    }

    function dev_info_get (obj, ref, on_ack) {
        var sn=mfc=model=ver=name=logo=os=wifi=sensor=type=uptime=def="";
        send_msg("ccm_dev_info_get", {sess:{nid:create_nid(), sn:obj.sn},select:obj.select},ref,
            function(msg,ref) {
                var result=get_ret(msg);
                if(result == ""){
                    var msg=msg.data?msg.data:"";
                    sn=msg.sn;
                    ver=msg.img_ver;
                    name=msg.nick;
                    type=msg.type;//增加返回值的type属性
                    os=msg.os;
                    wifi=msg.wifi;
                    sensor=msg.sensor;
                    if(msg.p){
                        for(var i=0;i<msg.p.length;i++){
                            if(msg.p[i].n=="s.logo"){
                                logo=msg.p[i].v;
                            }
                            if(msg.p[i].n=="s.mfc"){
                                mfc=msg.p[i].v;
                            }
                            if(msg.p[i].n=="model"){
                                model=msg.p[i].v;
                            }
                            if(msg.p[i].n=="uptime"){
                                uptime=msg.p[i].v;
                            }
                            if(msg.p[i].n=="p0"){
                                def=msg.p[i].v;
                            }
                        }
                    }
                }
                on_ack({result:result,sn:sn,mfc:mfc,model:model,ver:ver,name:name,logo:logo,type:type,os:os,wifi:wifi,sensor:sensor,uptime:uptime,def:def},ref);
            });
    }

    function nick_set (obj, ref, on_ack) {
        send_msg("ccm_nick_set", {sess:{nid:create_nid(), sn:obj.sn},nick:obj.name},ref,
            function(msg,ref) {on_ack({result:get_ret(msg)},ref);});
    }

    function dev_passwd_set (obj, ref, on_ack) {
        var old_pass = (obj.old_pass &&window.mmd5.hex(obj.old_pass));
        var new_pass = (obj.new_pass &&window.mmd5.hex(obj.new_pass));
        send_msg("ccm_pwd_set", {sess:{nid:create_nid(), sn:obj.sn},
                user:{username:obj.sn,old_pwd:pwd_encrypt(old_pass),pwd:pwd_encrypt(new_pass),level:"",guest:obj.is_guest?1:0}},ref,
            function(msg,ref) {on_ack({result:get_ret(msg)},ref);});
    }

    function net_get (obj, ref, on_ack) {
        var networks,dns;
        send_msg("ccm_net_get", {sess:{nid:create_nid(), sn:obj.sn},select:obj.select,
                tokens:["eth0", "ra0"], items:["all", "all"], force_scan:1},ref,
            function(msg,ref) {
                var result=get_ret(msg);
                if(result == "")
                {
                    var msg=msg.data?msg.data.info:"";
                    networks=msg.ifs;
                    dns=msg.dns;
                }
                on_ack({result:result,networks:networks,dns:dns},ref);
            });
    }

    function net_set (obj, ref, on_ack) {
        var info={ifs:obj.networks,dns:obj.dns};
        send_msg("ccm_net_set", {sess:{nid:create_nid(), sn:obj.sn},info:info},ref,
            function(msg,ref) {on_ack({result:get_ret(msg)},ref);});
    }
    function osd_get (obj, ref, on_ack) {
        var text,text_enable,week_enable,date_format,date_enable,time_12h,time_enable;
        send_msg("ccm_osd_get", {sess:{nid:create_nid(), sn:obj.sn}},ref,
            function(msg,ref) {
                var result=get_ret(msg);
                if(result == "")
                {
                    var msg=msg.data?msg.data.osd:"";
                    text=msg.text;
                    text_enable=msg.text_enable;
                    week_enable=msg.week;
                    date_format=msg.date.format;
                    date_enable=msg.date.date_enable;
                    time_12h=msg.date.enable_12h;
                    time_enable=msg.date.time_enable;
                }
                on_ack({result:result,text:text,text_enable:text_enable,week_enable:week_enable,date_format:date_format,date_enable:date_enable,time_12h:time_12h,time_enable:time_enable},ref);
            });
    }

    function osd_set (obj, ref, on_ack) {
        send_msg("ccm_osd_set", {sess:{nid:create_nid(), sn:obj.sn},
                osd:{text:obj.text,text_enable:obj.text_enable,week:obj.week_enable,
                    date:{format:obj.date_format,date_enable:obj.date_enable,enable_12h:obj.time_12h,time_enable:obj.time_enable}}},ref,
            function(msg,ref) {on_ack({result:get_ret(msg)},ref);});
    }

    function sd_get (obj, ref, on_ack) {
        var enable,status,capacity,usage,availableSize;
        send_msg("ccm_disk_get", {sess:{nid:create_nid(), sn:obj.sn}},ref,
            function(msg,ref) {
                var result=get_ret(msg);
                if(result == "")
                {
                    var msg=(msg.data&&msg.data.disks)?msg.data.disks[0]:msg.data;
                    enable=msg.conf.enable;
                    status=msg.stat;    /* readonly/mount/repairing/formating/umount/empty */
                    capacity=msg.size;  /* Total disk size */
                    usage=msg.used_size;    /* Used size */
                    availableSize=msg.available_size;
                }
                on_ack({result:result,enable:enable,status:status,capacity:capacity,usage:usage,availableSize:availableSize},ref);
            });
    }

    function sd_set (obj, ref, on_ack) {
        if(obj.no_conf)
        {
            send_msg("ccm_disk_ctl", {sess:{nid:create_nid(), sn:obj.sn},
                    token:"sd",type:(obj.ctrl_type?obj.ctrl_type:"")},ref,
                function(msg,ref) {on_ack({result:get_ret(msg)},ref);});
        }
        else
        {
            send_msg("ccm_disk_ctl", {sess:{nid:create_nid(), sn:obj.sn},
                    token:"sd",type:(obj.ctrl_type?obj.ctrl_type:""),conf:{enable:(obj.enable?1:0)}},ref,
                function(msg,ref) {on_ack({result:get_ret(msg)},ref);});
        }
    }

    function alarm_trigger_get (obj, ref, on_ack) {
        var io_input,io_output,sensitivity,night_sensitivity;
        send_msg("ccm_alert_dev_get", {sess:{nid:create_nid(), sn:obj.sn}},ref,
            function(msg,ref) {
                var result=get_ret(msg);
                if(result == "")
                {
                    var msg=msg.data?msg.data.conf:"";
                    io_input=msg.io_in_mode;   /* Open:always open; Close:always close */
                    io_output=msg.io_out_mode;    /* Open:always open; Close:always close */
                    sensitivity=msg.motion_level;  /* level of sensitivity about motion detect at day 0-100 */
                    night_sensitivity=msg.motion_level_night;    /* level of sensitivity about motion detect at night */
                }
                on_ack({result:result,io_input:io_input,io_output:io_output,sensitivity:sensitivity,night_sensitivity:night_sensitivity},ref);
            });
    }

    function alarm_trigger_set (obj, ref, on_ack) {
        send_msg("ccm_alert_dev_set", {sess:{nid:create_nid(), sn:obj.sn},
                conf:{io_in_mode:obj.io_input,io_out_mode:obj.io_output,motion_level:obj.sensitivity,motion_level_night:obj.night_sensitivity}},ref,
            function(msg,ref) {on_ack({result:get_ret(msg)},ref);});
    }

    function alarm_action_get (obj, ref, on_ack) {
        var enable,actions;
        send_msg("ccm_alert_action_get", {sess:{nid:create_nid(), sn:obj.sn}},ref,
            function(msg,ref) {
                var result=get_ret(msg);
                if(result == "")
                {
                    var msg=msg.data?msg.data:"";
                    enable=msg.enable;
                    actions=msg.actions;
                }
                on_ack({result:result,enable:enable,actions:actions},ref);
            });
    }

    function alarm_action_set (obj, ref, on_ack) {
        send_msg("ccm_alert_action_set", {sess:{nid:create_nid(), sn:obj.sn},
                enable:obj.enable,actions:obj.actions},ref,
            function(msg,ref) {on_ack({result:get_ret(msg)},ref);});
    }

    function record_get (obj, ref, on_ack) {
        var enable,full_time,times,sd_ready;
        send_msg("ccm_record_task_get", {sess:{nid:create_nid(), sn:obj.sn}},ref,
            function(msg,ref) {
                var result=get_ret(msg);
                if(result == "")
                {
                    sd_ready=msg.data.sd_ready;
                    var msg=msg.data?msg.data.task.sch:"";
                    enable=msg.enable;
                    full_time=msg.full_time;
                    times=msg.times;
                }
                on_ack({result:result,enable:enable,full_time:full_time,times:times,sd_ready:sd_ready},ref);
            });
    }

    function record_set (obj, ref, on_ack) {
        send_msg("ccm_record_task_set", {sess:{nid:create_nid(), sn:obj.sn},
                task:{sch:{enable:obj.enable,full_time:obj.full_time,times:obj.times}}},ref,
            function(msg,ref) {on_ack({result:get_ret(msg)},ref);});
    }

    function time_get (obj, ref, on_ack) {
        var timezone,auto_sync,ntp_addr,hour,min,sec,year,mon,day;
        send_msg("ccm_ntp_get", {sess:{nid:create_nid(), sn:obj.sn}},ref,
            function(msg,ref) {
                var result=get_ret(msg);
                if(result == "")
                {
                    var msg=msg.data?msg.data.info:"";
                    timezone=msg.timezone;
                    auto_sync=msg.auto_sync_enable;
                    ntp_addr=msg.manual[0].ip;
                    send_msg("ccm_date_get", {sess:{nid:create_nid(),sn:obj.sn}},ref,
                        function(msg2,ref) {
                            var result2=get_ret(msg2);
                            if(result2 == "")
                            {
                                var msg2=msg2.data?msg2.data.utc_date:"";
                                hour= msg2.time.hour;
                                min = msg2.time.min;
                                sec = msg2.time.sec;
                                year = msg2.date.year;
                                mon  = msg2.date.mon;
                                day  = msg2.date.day;
                            }
                            on_ack({result:result2,timezone:timezone,auto_sync:auto_sync,ntp_addr:ntp_addr,hour:hour,min:min,sec:sec,year:year,mon:mon,day:day},ref);
                        });
                }else{
                    on_ack({result:result},ref);
                }

            });
    }

    function time_set (obj, ref, on_ack) {
        send_msg("ccm_date_set", {sess:{nid:create_nid(), sn:obj.sn},
                type:obj.type,timezone:obj.timezone,utc_date:{time:{hour:obj.hour,min:obj.min,sec:obj.sec},date:{year:obj.year,mon:obj.mon,day:obj.day}}},ref,
            function(msg,ref) {
                var result=get_ret(msg);
                if(result == "")
                {
                    send_msg("ccm_ntp_set", {sess:{nid:create_nid(),sn:obj.sn},
                            auto_sync:obj.auto_sync,manual:{ip:obj.ntp_addr}},ref,
                        function(msg2,ref) {on_ack({result:get_ret(msg2)}, ref);});
                }
                else{
                    on_ack({result:result}, ref);
                }
            });
    }

    function upgrade_get (obj, ref, on_ack) {
        var status,progress,ver_current,ver_valid,ver_extends,chang_history;
        send_msg("ccm_upgrade_get", {sess:{nid:create_nid(), sn:obj.sn},check:obj.check?obj.check:0},ref,
            function(msg,ref) {
                var result=get_ret(msg);
                if(result == "")
                {
                    var msg=msg.data?msg.data:"";
                    status=msg.task?msg.task.stat:msg.stat;
                    progress=msg.progress;
                    os_ver=msg.os_ver;
                    ver_current=msg._cur_ver;
                    ver_valid=msg._valid_ver;
                    ver_extends=msg.remark;
                    chang_history=msg.changes;
                    ext_prj=msg.prj_ext;
                    ext_hw=msg.hw_ext;
                }
                on_ack({result:result,status:status,progress:progress,os_ver:os_ver,ver_current:ver_current,ver_valid:ver_valid,ver_extends:ver_extends,chang_history:chang_history,ext_prj:ext_prj,ext_hw:ext_hw},ref);
            });
    }

    function upgrade_set (obj, ref, on_ack) {
        send_msg("ccm_upgrade", {sess:{nid:create_nid(), sn:obj.sn},img_src:"download"},ref,
            function(msg,ref) {on_ack({result:get_ret(msg)},ref);});
    }

    function restore (obj, ref, on_ack) {
        send_msg("ccm_restore", {sess:{nid:create_nid(), sn:obj.sn},backup:obj.keep_extends_cofig},ref,
            function(msg,ref) {on_ack({result:get_ret(msg)},ref);});
    }

    function reboot (obj, ref, on_ack) {
        send_msg("ccm_reboot", {sess:{nid:create_nid(), sn:obj.sn}},ref,
            function(msg,ref) {on_ack({result:get_ret(msg)},ref);});
    }

    function audio_get (obj, ref, on_ack) {
        var mic_level,speaker_level;
        send_msg("ccm_speaker_get", {sess:{nid:create_nid(), sn:obj.sn},token:"ao0"},ref,
            function(msg,ref) {
                var result=get_ret(msg);
                if(result == "")
                {
                    speaker_level=msg.data.conf.level;
                    send_msg("ccm_mic_get", {sess:{nid:create_nid(),sn:obj.sn}},ref,
                        function(msg2,ref) {on_ack({result:get_ret(msg2),speaker_level:speaker_level,mic_level:msg2.data.conf[0].level}, ref);});
                }
                else{
                    on_ack({result:result}, ref);
                }
            });
    }

    function audio_set (obj, ref, on_ack) {
        send_msg("ccm_speaker_set", {sess:{nid:create_nid(), sn:obj.sn},
                conf:{token:"ao0",level:obj.speaker_level},force_persistence:1},ref,
            function(msg,ref) {
                var result=get_ret(msg);
                if(result == "")
                {
                    send_msg("ccm_mic_get", {sess:{nid:create_nid(),sn:obj.sn}},ref,
                        function(msg2,ref) {
                            var result2=get_ret(msg2);
                            if(result2 == "")
                            {
                                var msg2,entity,silent,token;
                                msg2=msg2.data?msg2.data.conf[0]:"";
                                entity=msg2.entity;
                                silent=msg2.silent;
                                token=msg2.token;
                                send_msg("ccm_mic_set", {sess:{nid:create_nid(),sn:obj.sn},
                                        conf:{entity:entity,token:token,silent:silent,level:obj.mic_level}, force_persistence:1},ref,
                                    function(msg3,ref) {on_ack({result:get_ret(msg3)}, ref);});
                            }else{
                                on_ack({result:result2}, ref);
                            }
                        });
                }
                else{
                    on_ack({result:result}, ref);
                }
            });
    }

    function dev_msg_listener_add (ref, on_ack) {
        mcloud_account.dev_msg_listener_add(ref,function(msg,ref){
            on_ack(msg,ref);
        });
    }

    function dev_msg_listener_del (ref, on_ack) {
        mcloud_account.dev_msg_listener_del(ref,function(msg,ref){on_ack(msg,ref);});
    }

    function dev_activate (obj, ref, on_ack) {
        send_msg("ccm_active", {sess:{nid:create_nid(), sn:obj.sn},ActivationCode:obj.activationCode},ref,
            function(msg,ref) {on_ack({result:get_ret(msg)},ref);});
    }

    function svr_dev_get (ref, on_ack) {
        send_msg("ccm_info_get", {},ref,
            function(msg,ref) {msg.data?on_ack({result:get_ret(msg),type:msg.data.type,sn:msg.data.sn,nick:msg.data.nick,ver:msg.data.ver},ref):on_ack({result:get_ret(msg)});});
    }
    function set_srv(srv)
    {
        l_srv=srv;
    }

    function curise_get(obj,ref,on_ack){
        send_msg("ccm_curise_get",{sess:{nid:create_nid(), sn:obj.sn}},ref,function(msg,ref){
            var result = get_ret(msg);
            if(result == ""){
                /*var points;
                 if(msg.data.curise_info.points){
                 points = msg.data.curise_info.points;
                 }else{
                 points = null;
                 }*/
                on_ack({result:result,points:msg.data.curise_info.points,enable:msg.data.curise_info.enable},ref);
            }else{
                on_ack({result:result},ref);
            }
        });
    }

    function curise_set(obj,ref,on_ack){
        send_msg("ccm_curise_set",{sess:{nid:create_nid(),sn:obj.sn},type:obj.type,index:obj.index},ref,function(msg,ref){
            on_ack({result:get_ret(msg)},ref);
        });
    }

    function motion_mask_set(obj,ref,on_ack)
    {
        send_msg("ccm_motion_mask_set",{sess:{nid:create_nid(),sn:obj.sn},conf:obj.conf},ref,function(msg,ref)
        {
            on_ack({result:get_ret(msg)},ref);
        });
    }

    function motion_mask_get(obj,ref,on_ack)
    {
        send_msg("ccm_motion_mask_get",{sess:{nid:mcloud_account.create_nid(),sn:obj.sn}},ref,function(msg, ref)
        {
            on_ack({result:get_ret(msg),conf:msg.data.conf},ref);
        });
    }

    function msg_filter_get(obj,ref,on_ack)
    {
        send_msg("ccm_msg_filter_get",{sess:{nid:mcloud_account.create_nid(),sn:obj.sn}},ref,function(msg,ref)
        {
            var result = get_ret(msg),
                alert_enable = 0, record_enable = 0;
            if( result == "" )
            {
                if( msg.data.pub_filter.indexOf("alert") < 0 )
                    alert_enable = 1;
                if( msg.data.pub_filter.indexOf("record") < 0 )
                    record_enable = 1;
            }
            on_ack({result:result,alert_enable:alert_enable,record_enable:record_enable},ref);
        });
    }

    function msg_filter_set(obj,ref,on_ack)
    {
        var tmp_str = new Array();
        tmp_str[0] = obj.alert_enable?"":"'alert'";
        tmp_str[1] = (obj.alert_enable+obj.record_enable == 0)?",":"";
        tmp_str[2] = obj.record_enable?"":"'record'";
        send_msg("ccm_msg_filter_set",{sess:{nid:mcloud_account.create_nid(),sn:obj.sn},gen_filter:"{type:[]}",pub_filter:"{type:[" + tmp_str.join("") + "]}"},null,function(msg,ref){
            on_ack({result:get_ret(msg)},ref);
        });
    }

    function box_get(obj, ref, on_ack)
    {
        send_msg("ccm_box_get",{sess:{nid:mcloud_account.create_nid(),sn:obj.box_sn},
                sn:obj.dev_sn,flag:obj.flag,start_time:obj.start_time,end_time:obj.end_time},ref,
            function(msg,ref)
            {
                //  document.getElementById(result1).innerHTML="121232312312312";
                var result = get_ret(msg);
                if(result == "" && msg.data){
                    switch(obj.flag)
                    {
                        case 1:
                            on_ack({result:result,ipcs:msg.data.ipcs},ref);
                            break;
                        case 2:
                            on_ack({result:result,date_infos:msg.data.date_infos},ref);
                            break;
                        case 4:
                            on_ack({result:result,segs:msg.data.segs},ref);
                            break;
                        case 8:
                            on_ack({result:result,segs_sdc:msg.data.segs_sdc},ref);
                            break;
                        default:
                            break;
                    }
                    //on_ack({result:result,date_infos:msg.data.date_infos,ipcs:msg.data.ipcs,segs:msg.data.segs,segs_sdc:msg.data.segs_sdc},ref);
                }else{
                    on_ack({result:result},ref);
                }
            });
    }

    function box_conf_get(obj,ref,on_ack)
    {
        send_msg("ccm_box_conf_get",{sess:{nid:mcloud_account.create_nid(),sn:obj.box_sn}},null,
            function(msg,ref)
            {
                var result = get_ret(msg);
                if(result == "" && msg.data){
                    on_ack({result:get_ret(msg),conf:msg.data},ref);
                }else{
                    on_ack({result:result},ref);
                }
            });
    }
    function box_login(obj,ref,on_ack)
    {
        send_msg("ccm_box_login",{sess:{nid:mcloud_account.create_nid(),sn:obj.box_sn},enable:obj.enable,username:obj.username,password:obj.password},null,
            function(msg,ref)
            {
                on_ack({result:get_ret(msg)},ref);
            });
    }

    function ipcs_get(obj, ref, on_ack)
    {
        send_msg("ccm_ipcs_get",{sess:{nid:mcloud_account.create_nid(),sn:obj.sn}},ref,
            function(msg,ref)
            {
                var result = get_ret(msg);
                if(result == "" && msg.data){
                    on_ack({result:result,ipcs:msg.data.ipcs},ref);
                }else{
                    on_ack({result:result},ref);
                }
            });
    }

    function pic_base64_get(obj, ref, on_ack)
    {
        send_msg("ccm_pic_get",{sess:{nid:mcloud_account.create_nid(),sn:obj.sn},token:obj.token,flag:obj.flag},ref,
            function(msg,ref)
            {
                var result = get_ret(msg);
                if(result == "" && msg.data){
                    on_ack({result:result,frame:msg.data.frame},ref);
                }else{
                    on_ack({result:result},ref);
                }
            });
    }
    function binding_email(obj, ref, on_ack)
    {
        mcloud_account.binding_email(obj.email,obj.user,obj.pass,obj.lang,obj.version,obj.appid,obj.name, ref, function(msg, ref){
            on_ack({result:get_ret(msg)}, ref);
        });
    }

    function recovery_binding_email(obj, ref, on_ack)
    {
        mcloud_account.recovery_binding_email(obj.email,obj.user,obj.lang,obj.appid,obj.name, ref, function(msg, ref){
            on_ack({result:get_ret(msg)}, ref);
        });
    }

    function cpns_get(obj, ref, on_ack)
    {
        mcloud_account.cpns_get(obj.srv, obj.start, obj.counts, obj.user, obj.appid, ref,
            function(msg, ref){
                on_ack({result:get_ret(msg),conf:msg.data}, ref);
            });
    }

    function binding_email_get(obj, ref, on_ack){
        mcloud_account.binding_email_get(obj.user,obj.appid,ref, function(msg,ref){on_ack({result:get_ret(msg),conf:msg.data},ref);});
    }
    function desc_get(obj, ref, on_ack){
        send_msg("ccvs_get_desc_req",{sess:{nid:mcloud_account.create_nid()},ver_type:obj.ver_type,ver_from:obj.ver_from,ver_to:obj.ver_to,lang:obj.lang},ref,
            function(msg,ref){
                var result = get_ret(msg);
                if(result == "" && msg.data){
                    on_ack({result:result,data:msg.data},ref);
                }
            });
    }
    //product function
    function segment_set(obj,ref,on_ack)
    {
        var area = ["zh","tw","en","ja","ko","de","fr","es","ar","pt","it","ru","us"];
        //temp data
        var remark = obj.remark?obj.remark:"",user = obj.user?obj.user:"";
        if(obj.flag == 0 && !obj.id)
        {
            var segment_id = obj.segment_id?obj.segment_id:"";
            var req = {nid:_create_nid(),flag:obj.flag,filter:{status:"y",area:area},segment_id:segment_id,segment:obj.segment};
        }
        else if(obj.flag == 0 && obj.id)
        {
            var req = {nid:_create_nid(),flag:obj.flag,segment_id:obj.id,filter:{status:"y",area:area},segment:obj.segment};
        }
        else if(obj.flag == 1)
        {
            var req = {nid:_create_nid(),flag:obj.flag,segment_id:obj.id};
        }
        send_msg({type:"cdms_set_segment_req",to:"cdms",way:"from"},req,ref,function (msg){
            on_ack(msg.data,ref);
        })
    }
    function segment_get(obj,ref,on_ack){
        var req = obj;
        req.nid = _create_nid();
        send_msg({type:"cdms_get_segment_req",to:"cdms",way:"from"},req,ref,function (msg){
            on_ack(msg.data,ref);
        })
    }
    function serial_set(obj,ref,on_ack)
    {
        // var area = ["zh","tw","en","ja","ko","de","fr","es","ar","pt","it","ru","us"];
        var area = obj.area;

        if(obj.flag == 0 && !obj.id)
        {
            var req = {nid:_create_nid(),name:obj.name,sign:obj.sign,flag:obj.flag,summery:obj.summery,filter:{status:obj.status,area:area}};
        }
        else if(obj.flag == 0 && obj.id)
        {
            var req = {nid:_create_nid(),id:obj.id,name:obj.name,sign:obj.sign,flag:obj.flag,summery:obj.summery,filter:{status:obj.status,area:area}};
        }
        else if(obj.flag == 1)
        {
            var req = {nid:_create_nid(),sign:obj.sign,flag:obj.flag,id:obj.id};
        }
        send_msg({type:"cpis_set_serial_req",to:"cpis"},req,ref,function (msg){
            on_ack(msg.data,ref);
        })
    }
    function serial_get(obj,ref,on_ack)
    {
        var req = {nid:_create_nid(),serial_id:obj.serial_id,language:obj.language,p:[],country:obj.country};
        send_msg({type:"cpis_get_serials_req",to:"cpis"},req,ref,function (msg,ref){
            on_ack(msg.data,ref)
        })
    }
    function list_get(obj,ref,on_ack)
    {
        var req = {nid:_create_nid(),sign:obj.sign,start:obj.start,counts:obj.counts,language:obj.language,country:obj.country,p:[{n:"status",v:obj.status},{n:"area",v:"zh"}]};
        send_msg({type:"cpis_get_list_req",to:"cpis"},req,ref,function (msg,ref){
            on_ack(msg.data,ref)
        })
    }
    function models_get(obj,ref,on_ack)
    {
        var req = {nid:_create_nid(),serials:[{serial_id:obj.serial_id,models:obj.models}],language:obj.language,p:[],country:obj.country};
        send_msg({type:"cpis_get_models_req",to:"cpis"},req,ref,function (msg,ref){
            on_ack(msg.data,ref);
        })
    }
    function models_set(obj,ref,on_ack)
    {
        var area = ["zh","tw","en","ja","ko","de","fr","es","ar","pt","it","ru","us"];
        if(obj.flag == 0 && !obj.model_id)
        {
            var model_id = "";
            var info = {groups:obj.info};
            var main = {};
            var req = {nid:_create_nid(),flag:obj.flag,name:obj.name,serial_id:obj.serial_id,main:main,info:info,filter:{status:obj.status,area:area}};
        }
        else if(obj.flag == 0 && obj.model_id)
        {
            var model_id = obj.model_id;
            var main = obj.main?{groups:obj.main}:{};
            var info = obj.info?{groups:obj.info}:{};
            var req = {nid:_create_nid(),flag:obj.flag,model_id:model_id,name:obj.name,serial_id:obj.serial_id,main:main,info:info,filter:obj.filter};
        }
        else if(obj.flag == 1)
        {
            var req = {nid:_create_nid(),flag:obj.flag,serial_id:obj.serial_id,model_id:obj.model_id};
        }
        send_msg({type:"cpis_set_model_req",to:"cpis",way:"form"},req,ref,function (msg,ref){
            on_ack(msg,ref);
        })
    }
    function pic_set(obj,ref,on_ack)
    {
        var req = {nid:_create_nid(),upload_data:obj.up_data,request:obj.request,segment_id:obj.segment_id,language:obj.language}
        send_msg({type:"cdms_set_pic_req",to:"cdms"},req,ref,function (msg,ref){
            on_ack(msg,ref);
        })
    }
    function login_req(obj,ref,on_ack)
    {

        var user = obj.username;
        var pass = obj.password;
        login_data.secret_key = mdh.gen_private();
        login_data.pub_key = mdh.gen_public(login_data.secret_key);
        var req = {bnum_prime:mdh.prime, root_num:mdh.g, key_a2b:mdh.gen_public(login_data.secret_key), tid:1};
        send_msg({type:"cacs_dh_req",to:"ccms"},req,null,function (data){
            login_data.tid = data.data.tid;
            login_data.lid = data.data.lid;
            login_data.share_key = mdh.gen_shared_secret( login_data.secret_key, data.data.key_b2a );

            window.localStorage.setItem("share_key", login_data.share_key);
            window.localStorage.setItem("lid", login_data.lid);
            var nid=_create_nid();
            var pass_md5 = des_md5_encrypt(pass,login_data.share_key);
            var login_req={lid:login_data.lid, nid:nid, user:user, pass:pass_md5, user_refer:'xxx', session_req:1, session_refer:'xxx', login_refer:'xxx'};
            send_msg({type:"cacs_login_req",to:"ccms"},login_req,null,function (msg,ref){
                console.log("loginback")
                console.log(msg.data);
                l_sid = msg.data.sid;
                l_seq = msg.data.seq;
                console.log("local--sid:"+l_sid+"-seq:"+l_seq);
                on_ack(msg.data);
            })
        })


    }
    function _create_nid_ex(id_type, id, seq, share_key ) {
        var nid = mcodec.nid(seq, id, share_key, id_type, null, null, mmd5, "hex")
        return nid;
    }
    function _create_nid()
    {
        // return _create_nid_ex(2 , window.localStorage.getItem("lid"), 5 , window.localStorage.getItem("share_key"));
        console.log("logindatalid:"+login_data.lid+"--localStorage:"+window.localStorage.getItem("share_key") +"--ligindata:"+login_data.share_key);
        return login_data.lid?_create_nid_ex(2 , login_data.lid , 5 , login_data.share_key):"";

    }
    function _create_nid_for_vbox()
    {
        // return _create_nid_ex(2 , window.localStorage.getItem("lid"), 5 , window.localStorage.getItem("share_key"));
        console.log("login_date.lid:"+login_data.lid+"--l_sid:"+l_sid+"--l_seq:"+l_seq+"--sharekey:"+login_data.share_key);
        return login_data.lid?_create_nid_ex(0 , l_sid , l_seq , login_data.share_key):"";

    }
    function des_md5_encrypt( message, pass ) {
        var md5_message = CryptoJS.MD5( message );
        var key = CryptoJS.MD5( pass );
        var iv  = CryptoJS.enc.Hex.parse('0000000000000000');
        var des = CryptoJS.DES.encrypt( md5_message, key, {iv:iv, padding: CryptoJS.pad.NoPadding}).ciphertext.toString();
        return des;
    }




    //激活
    function vbox_recharge(obj,ref,on_ack){
        var req = {};
        req.nid = _create_nid_for_vbox();
        req.sn = obj.sn;
        req.card_activate = obj.card_activate;
        send_msg({type:"ccms_recharge_req",to:"ccms"},req,ref,function (msg,ref){
            on_ack(msg.data,ref);
        })
    }
    function get_recharge(obj,ref,on_ack){
        var req = {};
        req.nid = _create_nid();
        req.flag = obj.flag;
        req.user = obj.user;
        req.vbox_ = obj.obj_id;
        req.card_activate = obj.card_activate;
        send_msg({type:"cboss_recharge",to:"cboss"},req,ref,function (msg,ref){
            on_ack(msg.data,ref);
        })
    }
    //设置密码
    function vbox_set_password(obj,ref,on_ack){
        var req = obj;
        var admin_token_md5 = des_md5_encrypt(req.admin_token,window.localStorage.getItem("share_key"));
        var new_token_md5 = des_md5_encrypt(req.new_token,window.localStorage.getItem("share_key"));
        req.admin_token = admin_token_md5;
        req.new_token = new_token_md5;
        req.nid = _create_nid();
        send_msg({type:"csmc_set_vbox_pass_req",to:"ccms"},req,ref,function (msg,ref){
            on_ack(msg.data,ref);
        })
    }
    function vbox_bind_req(obj,ref,on_ack){
        var req = obj;
        req.nid = _create_nid();
        send_msg({type:"csmc_bind_dev_req",to:"ccms"},req,ref,function (msg,ref){
            on_ack(msg.data,ref);
        })        
    }
    function vbox_upload_set(obj,ref,on_ack){
        var req = obj;
        send_msg({type:"ccm_cloud_set",to:"ccm"},{sess:{nid:_create_nid_for_vbox(),sn:obj.sn},cloud:{enable:obj.cloud.enable,clid:obj.cloud.clid,passwd:obj.cloud.passwd}},ref,function (msg,ref){
            on_ack(msg.data,ref);
        })
    }

    function vbox_unbind(obj,ref,on_ack){
        var req = obj;
        send_msg({type:"ccm_cloud_set",to:"ccm"},{sess:{nid:_create_nid_for_vbox(),sn:obj.sn},unbind:obj.unbind},ref,function (msg,ref){
            on_ack(msg.data,ref);
        })
    }

    function vbox_cloud_get(obj,ref,on_ack){
        var req = obj;
        console.log("get_cloud_req");
        send_msg({type:"ccm_cloud_get",to:"ccm"},{sess:{nid:_create_nid_for_vbox(),sn:obj.sn}},ref,function (msg,ref){
            on_ack(msg.data,ref);
        })
    }


    function vbox_create_card_activate(obj,ref,on_ack){
        send_msg({type:"cboss_create_char",to:"cboss"},{flag:"0",admin_pass:"123456",type:"1mjzximaaaaaa",valid_time:"1495066370",count:"1"},ref,function (msg,ref){
            on_ack(msg.data,ref);
        })
    }

    function vbox_get_info(obj,ref,on_ack){
        var req = obj;
        req.nid = _create_nid();
        send_msg({type:"csmc_get_vbox_info_req",to:"ccms"},req,ref,function (msg,ref){
            on_ack(msg.data,ref);
        }) 
    }
    function vbox_query(obj,ref,on_ack){
        var req = obj;
        req.nid = _create_nid();
        send_msg({type:"ccms_vbox_query_req",to:"ccms"},req,ref,function (msg,ref){
            on_ack(msg.data,ref);
        }) 
    }
    //LKK add start
    function vbox_get_list(obj,ref,on_ack) {
        var req = obj;
        req.nid = _create_nid();
        send_msg({type:"csmc_get_vbox_list_req",to:"csmc"},req,ref,function(msg,ref) {
            on_ack(msg.data,ref);
        });
    }
    function vbox_clean_data(obj,ref,on_ack) {
        var req = obj;
        req.nid = _create_nid();
        send_msg({type:"csmc_get_vbox_list_req",to:"csmc"},req,ref,function(msg,ref) {
            on_ack(msg.data,ref);
        });
    }
    //LKK add end
    window.mcloud_agent = {
        vbox_get_list:vbox_get_list,
        vbox_query:vbox_query,
        vbox_get_info:vbox_get_info,
        vbox_create_card_activate:vbox_create_card_activate,
        vbox_bind_req:vbox_bind_req,
        vbox_upload_set:vbox_upload_set,
        vbox_unbind:vbox_unbind,
        vbox_cloud_get:vbox_cloud_get,
        vbox_set_password:vbox_set_password,
        login_req:login_req,
        vbox_recharge:vbox_recharge,
        /* pwd_encrypt(pwd_md5_hex) */
        pwd_encrypt:pwd_encrypt,
        /* create_nid() */
        create_nid:create_nid,
        /* sign_up({srv:"",user:"",password:""}, ref, on_ack) ret:{result:""} */
        sign_up: sign_up,
        /* sign_in({srv:"",user:"",password:""}, ref, on_ack) ret:{result:""} */
        sign_in: sign_in,
        /* sign_out(ref, on_ack) ret:{result:""} */
        sign_out: sign_out,
        /* send_msg("type", {xxx}, ref, on_ack) ret:{message}*/
        send_msg: send_msg,
        /* account_passwd_set({old_pass:"xxx",new_pass:"xxx",is_guest:"xxx"},ref,on_ack) ret{result:""}*/
        account_passwd_set:account_passwd_set,

        /* refer mipc */
        devs:{list:l_devs,get:ldev_get,get_index:ldev_index_get, add:ldev_add,del:ldev_del},
        /* devs_refresh({filter:"xxx"}, ref, on_ack) ret:{result:""}*/
        /* filter:  Refresh sn list. null indicate refresh all */
        devs_refresh:devs_refresh,
        /* play({sn:"xxx",protocol:"xxx",token:"xxx"},ref,on_ack) ret{result:"",url:""}*/
        play : play,
        /* record({sn:"xxx",keep_time:"xxx"}, ref, on_ack) ret:{result:""}*/
        record:record,
        /* pic_get({sn:"xxx",token:"xxx"}, ref, on_ack) ret:{result:"",url:""}*/
        pic_get:pic_get,
        /* pic_url_get({sn:"xxx",token:"xxx"}) ret:{""}*/
        pic_url_get:pic_url_get,
        /* pushtalk({sn:"xxx",protocol:"xxx",token:"xxx"},ref,on_ack) ret{result:"",url:""}*/
        pushtalk:pushtalk,
        /* ptz_ctrl({sn:"xxx",x:"xxx",y:"xxx"},ref,on_ack) ret{result:""}*/
        ptz_ctrl:ptz_ctrl,
        /* playback({sn:"xxx",protocol:"xxx",token:"xxx"},ref,on_ack) ret{result:"",url:""}*/
        playback:playback,
        /* msgs_get({sn:"xxx",start:"xxx",counts:"xxx",filter:""},ref,on_ack) ret{result:"",max_id:"",min_id:"",total:"",bound:"",messages:""}*/
        msgs_get:msgs_get,
        /* dev_del({sn:"xxx"},ref,on_ack) ret{result:""}*/
        dev_del:dev_del,
        /* dev_add({sn:"xxx",pass:"xxx"},ref,on_ack) ret{result:""}*/
        dev_add:dev_add,
        /* cam_get({sn:"xxx"},ref,on_ack) ret{result:"",brightness:"",contrast:"",color_saturation:"",sharpness:"",day_night:"",flip:"",flicker_freq:""}*/
        cam_get:cam_get,
        /* cam_get({sn:"xxx",brightness:"",contrast:"",color_saturation:"",sharpness:"",day_night:"",flip:"",flicker_freq:""},ref,on_ack) ret{result:""}*/
        cam_set:cam_set,
        /* dev_info_get({sn:"xxx"},ref,on_ack) ret{result:"",sn:"",mfc:"",model:"",ver:"",name:"",logo:""}*/
        dev_info_get:dev_info_get,
        /* nick_set({sn:"xxx",name:""},ref,on_ack) ret{result:""}*/
        nick_set:nick_set,
        /* dev_passwd_set({sn:"",old_pass:"xxx",new_pass:"xxx",is_guest:"xxx"},ref,on_ack) ret{result:""}*/
        dev_passwd_set:dev_passwd_set,
        /* net_get({sn:"xxx"},ref,on_ack) ret{result:"",networks:"",dns:""}*/
        net_get:net_get,
        /* net_set({sn:"xxx",networks:"",dns:""},ref,on_ack) ret{result:""}*/
        net_set:net_set,
        /* osd_get({sn:"xxx"},ref,on_ack) ret{result:"",text:"",text_enable:"",week_enable:"",date_format:"",date_enable:"",time_12h:"",time_enable:""}*/
        osd_get:osd_get,
        /* osd_set({sn:"xxx",text:"",text_enable:"",week_enable:"",date_format:"",date_enable:"",time_12h:"",time_enable:""},ref,on_ack) ret{result:""}*/
        osd_set:osd_set,
        /* sd_get({sn:"xxx"},ref,on_ack) ret{result:"",enable:"",status:"",capacity:"",usage:"",availableSize:""}*/
        sd_get:sd_get,
        /* sd_set({sn:"xxx",ctrl_type:"",enable:""},ref,on_ack) ret{result:""}*/
        sd_set:sd_set,
        /*alarm_trigger_get({sn:"xxx"},ref,on_ack) ret{result:"",io_input:"",io_output:"",sensitivity:"",night_sensitivity:""}*/
        alarm_trigger_get:alarm_trigger_get,
        /* alarm_trigger_get({sn:"xxx",io_input:"",io_output:"",sensitivity:"",night_sensitivity:""},ref,on_ack) ret{result:""}*/
        alarm_trigger_set:alarm_trigger_set,
        /*alarm_action_get({sn:"xxx"},ref,on_ack) ret{result:"",enable:"",actions:""}*/
        alarm_action_get:alarm_action_get,
        /* alarm_action_set({sn:"xxx",enable:"",actions:""},ref,on_ack) ret{result:""}*/
        alarm_action_set:alarm_action_set,
        /*motion_mask_get({sn:"xxx",ref,on_ack})*/
        motion_mask_get:motion_mask_get,
        /*motion_mask_set({sn:"xxx",conf:""},ref,on_ack ret{result:"",})*/
        motion_mask_set:motion_mask_set,
        /* record_get({sn:"xxx"},ref,on_ack) ret{result:"",enable:"",full_time:"",times:"",sd_ready:""}*/
        record_get:record_get,
        /* record_get({sn:"xxx",enable:"",full_time:"",times:""},ref,on_ack) ret{result:""}*/
        record_set:record_set,
        /* time_get({sn:"xxx"},ref,on_ack) ret{result:"",timezone:"",auto_sync:"",ntp_addr:"",hour:"",min:"",sec:"",year:"",mon:"",day:""}*/
        time_get:time_get,
        /* time_set({sn:"xxx",type:"",timezone:"",auto_sync:"",ntp_addr:"",hour:"",min:"",sec:"",year:"",mon:"",day:""},ref,on_ack) ret{result:""}*/
        time_set:time_set,
        /* upgrade_get({sn:"xxx",check:""},ref,on_ack) ret{result:"",status:"",progress:"",ver_current:"",ver_valid:"",ver_extends:"",chang_history:""}*/
        upgrade_get:upgrade_get,
        /* upgrade_set({sn:"xxx"},ref,on_ack) ret{result:""}*/
        upgrade_set:upgrade_set,
        /* restore({sn:"xxx",keep_extends_cofig:""},ref,on_ack) ret{result:""}*/
        restore:restore,
        /* reboot({sn:"xxx"},ref,on_ack) ret{result:""}*/
        reboot:reboot,
        /* audio_get({sn:"xxx"},ref,on_ack) ret{result:"",mic_level:"",speaker_level:""}*/
        audio_get:audio_get,
        /* audio_set({sn:"xxx",mic_level:"",speaker_level:""},ref,on_ack) ret{result:""}*/
        audio_set:audio_set,
        /* dev_msg_listener_add(ref,on_ack) ret{msg:""}*/
        dev_msg_listener_add:dev_msg_listener_add,
        /* dev_msg_listener_del(ref,on_ack) ret{msg:""}*/
        dev_msg_listener_del:dev_msg_listener_del,
        /* dev_activate({sn:"xxx",activationCode:""},ref,on_ack) ret{msg:""}*/
        dev_activate:dev_activate,
        /* svr_dev_get({},ref,on_ack) ret{result:"",type:"",sn:"",nick:"",ver:""}*/
        svr_dev_get:svr_dev_get,
        /* set_fix */
        //fix={type:funcion(type){},/* return fixed type; */req:{function(type,req){ /* return fixed req data */},ack:{function(type,ack){ /* return fixed ack data */}
        set_fix:function(fix){l_fix = fix;},
        /*curise_get({sn:"xxxx"},ref,on_ack)*/
        curise_get:curise_get,
        /*curise_set({sn:"xxxx",type:"",index:""},ref,on_ack)*/
        curise_set:curise_set,
        /*msg_filter_get({sn:"xxxx"},ref,on_ack)*/
        msg_filter_get:msg_filter_get,
        /*msg_filter_set({sn:"xxxx",alert_enable:"",record_enable:""},ref,on_ack)*/
        msg_filter_set:msg_filter_set,
        /*box_get({sn:"xxxx",flag:"",[start_time:"",end_time:""]},ref,on_ack) ret{result:"",date_infos:""|ipcs:""|segs:""|segs_sdc:""}*/
        box_get:box_get,
        /*box_conf_get({sn:"xxxx"},ref,on_ack)      ret{result:"",conf:""}*/
        box_conf_get:box_conf_get,
        /*box_login({sn:"xxxx",username:"",password:"",no_ack:"",record:""},ref,on_ack)*/
        box_login:box_login,
        /*ipcs_get({sn:"xxxx"},ref,on_ack)      ret{result:"",ipcs:""}*/
        ipcs_get:ipcs_get,
        /*pic_base64_get({sn:"xxxx",token:""},ref,on_ack)      ret{result:"",frame:""}*/
        pic_base64_get:pic_base64_get,
        box_set:box_set,
        /*binding_email({email:"xxxx"},ref,on_ack) ret{result:""}*/
        binding_email:binding_email,
        /*recovery_binding_email({email:"xxxx",user:"xxxx",lang:"xxxx"})*/
        recovery_binding_email:recovery_binding_email,
        /*get the notification information*/
        cpns_get:cpns_get,
        /*get the accounts of binding email info*/
        binding_email_get:binding_email_get,
        desc_get:desc_get
    };

    window.mcloud_product = {
        get_srv_param:get_srv_param  /* get_srv(srv) */
        // get_native_username:get_native_username,
        // get_native_password:get_native_password
        // get_sharekey:get_share_key,
        // get_sid:get_sid,
        // get_lid:get_lid,
    }
})(window);
