(function(window, document){
    login_data={};
    version_type=['server','web','android_mipc','android_vimtag','mac_mipc','mac_vimtag','windows_mipc','windows_vimtag','ios_mipc','ios_vimtag'];
    client_type=['android_mipc','android_vimtag','ios_mipc','ios_vimtag','windows_mipc','windows_vimtag','mac_mipc','mac_vimtag'];
    version_ipc_type=['gm8136','gm8126','gm8126_2','hi3518x','gm828x'];
    version_type_all=['server','android_mipc','gm8136','gm8126','gm8126_2','hi3518x','gm828x','android_vimtag','mac_mipc','mac_vimtag','windows_mipc','windows_vimtag','ios_mipc','ios_vimtag','web'];
    powers=[];
    user_power={};
    powers_flag=0;
    confcenter_names=[];
    node_list_names=[];
    var node_info_elements=["name","ip","ssh_port","ssh_user","ssh_pass","udp_port","mipcm_img","comp","mq_size",
        "udp_test","mrmt_test","min_ccms","send_mail","id_ccms","max_user_counts","max_login","sync_delay","ccms_sync",
        "dps_backup","id_cms","flag_license","gw_host","pass_debug","pass_su","binnet_port","http_port","https_port",
        "rtmp_port","rtsp_port","rtdp_port","mutp_port"];
    function create_nid( id_type, id, seq, share_key ) {
        var nid = codec.nid( seq, id, share_key, id_type, null, null, md5_ex, "hex" );
        return nid;
    }

    function des_md5_encrypt( message, pass ) {
        var md5_message = CryptoJS.MD5( message );
        var key = CryptoJS.MD5( pass );
        var iv  = CryptoJS.enc.Hex.parse('0000000000000000');
        var des = CryptoJS.DES.encrypt( md5_message, key, {iv:iv, padding: CryptoJS.pad.NoPadding}).ciphertext.toString();
        return des;
    }

    window.send_msg=function(to, type, data, on_ack){
        rpc.call({srv:"/", to:to, type:type, data:data,way:"json",
            on_ack:function(msg, ref)
            {
                if("object" == typeof(msg))
                {
                    on_ack(msg.type, msg.data, ref);
                }
                else if("cancel" != msg)
                {
                    on_ack(msg, msg, ref);
                }
            }
        });
    };

    window.send_msg_from=function(to, type, data, on_ack){
        rpc.call({srv:"/", to:to, type:type, data:data,way:"from",
            on_ack:function(msg, ref)
            {
                if("object" == typeof(msg))
                {
                    on_ack(msg.type, msg.data, ref);
                }
                else if("cancel" != msg)
                {
                    on_ack(msg, msg, ref);
                }
            }
        });
    };

    function login_class(){
        function login_page(){
            g_page.innerHTML='<div id="login_page">'+
                '账号<input type="text" id="user"/><br/>'+
                '密码<input type="password" id="pass"/><br/>'+
                '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button id="login_button">登录</button><br>'+
                '</div>';
        }

        function login_event(){
            document.getElementById("login_button").onclick=function(){
                var user = document.getElementById("user").value,
                    pass = document.getElementById("pass").value;
                if(user == 'admin'){
                    powers_flag = 1;
                }

                login_data.secret_key = dh.gen_private();
                login_data.pub_key = dh.gen_public(login_data.secret_key);
                var req={bnum_prime:dh.prime, root_num:dh.g, key_a2b:login_data.pub_key, tid:1};
                ms.send_msg(0x50000000,'cacs_dh_req',req,function(type, data){
                    login_data.tid = data.tid;
                    login_data.lid = data.lid;
                    login_data.share_key = dh.gen_shared_secret( login_data.secret_key, data.key_b2a );
                    var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
                    var pass_md5 = des_md5_encrypt( pass, login_data.share_key );
                    var login_req={lid:login_data.lid, nid:nid, user:user, pass:pass_md5, user_refer:'xxx', session_req:1, session_refer:'xxx', login_refer:'xxx'};
                    ms.send_msg(0x50000000,'cacs_login_req',login_req,function(type, data){
                        //fork();
                        if( data.result.length == 0 ){
                            fork();

                        }else{
                            alert("密码或者账号错误");
                        }
                    });
                });
            }
        }

        login_page();
        login_event();
    }

    function fork()
    {
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+

            '<button id="get_newtickets">获取指定系列信息</button><br>'+
            '<button id="get_usertickets">获取指定用户信息</button><br>'+

            '<button id="return_home">返回</button><br>'+
            '</div>';

        document.getElementById("get_newtickets").onclick=function() {
            get_newtickets();
        };
        document.getElementById("get_usertickets").onclick=function() {
            //get_usertickets();
        };
        document.getElementById("return_home").onclick=function() {
            login_class();
        };

    }


    var list={};
    var signed_s;
    var signed_c;
    function get_newtickets(){
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+

            'start<input type="uint32" id="start"/><br/>'+
            'counts<input type="uint32" id="counts"/><br/>'+
            'series<input type="lenstr" id="series"/><br/>'+
            '<button id="get_value">获取</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';

        document.getElementById("get_value").onclick=function(){
            var start = document.getElementById("start").value;
            var counts = document.getElementById("counts").value;
            var series= document.getElementById("series").value;
            var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
            var req = {nid:nid,start:start,counts:counts,series:series};
            window.send_msg(0x50400000, 'ctck_get_new_ticket_req', req, function (type, data) {
                list=data;
                if (data.result == "failed") {
                    console.log("get_error");
                    console.log(error);
                }else {
                    console.log("get_success");
                    var i=0;
                    console.log("the total is"+data.total);
                     signed_s=start<<0;
                     signed_c=counts<<0;
                    if((signed_s+1)>data.total)
                    {
                        get_newtickets();
                    }
                    if((signed_s+signed_c)>data.total)
                    {
                        signed_c=data.total-signed_s;
                    }
                    console.log(signed_c);
                    var shuzu=[];
                    for(i=0;i<signed_c;i++){
                        shuzu[i]=i;
                    }
                    g_page = mx("#page");
                    var date;
                    var title;
                    function getLocalTime(nS) {
                        return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
                    }
                    for(i=0;i<signed_c;i++) {
                        date=data.tickets[i].ticket_base.create_date;
                        title=data.tickets[i].ticket_base.title;
                        var newTime= getLocalTime(date);
                        g_page.innerHTML += '<div class="login_page">' +
                            '<div class="login_input" style="border:1px solid #000;width:400px  ; background-color:white" name="'+shuzu[i]+'" type="button"  >'+title+' '+newTime+''+"点我展开"+ '</div>'+
                            '<div class="login_input2" style="border:1px solid #000;width:40px  ; background-color:white" name="'+shuzu[i]+'" type="button">'+"提取"+ '</div>'+
                            '</div>';
                    }
                    g_page.innerHTML += '<div class="login_page">' +
                        '<button id="return">返回</button><br>'+
                        '</div>';

                    document.getElementById("return").onclick = function () {
                        get_newtickets();
                    };
                    document.getElementById("login_page").style.display="none";
                }
                var input_length = document.getElementsByClassName("login_input").length;
                for(var j=0;j<input_length;j++)
                {
                    document.getElementsByClassName("login_input")[j].onclick = function(){
                        get_content(data, this.getAttribute("name"));
                    }
                    document.getElementsByClassName("login_input2")[j].onclick = function(){
                        console.log(this.getAttribute("name"));
                        pick_up(data,this.getAttribute("name"));
                    }
                }
            });
        };
        document.getElementById("return_home").onclick=function() {
            fork();
        }
    }


    function show_list(){
        var i=0;
        var date;
        var title;
        var shuzu=[];
        for(i=0;i<signed_c;i++){
            shuzu[i]=i;
        }
        g_page = mx("#page");
        function getLocalTime(nS) {
            return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
        }
        for(i=0;i<signed_c;i++) {
            date=list.tickets[i].ticket_base.create_date;
            title=list.tickets[i].ticket_base.title;
            var newTime= getLocalTime(date);
            g_page.innerHTML += '<div class="login_page">' +
                '<div class="login_input" style="border:1px solid #000;width:400px ; background-color:white" name="'+shuzu[i]+'" type="button"  >'+title+' '+newTime+' '+"点我展开"+'</div>'+
                '<div class="login_input2" style="border:1px solid #000;width:40px ; background-color:white" name="'+shuzu[i]+'" type="button"  >'+"提取"+'</div>'+
                '</div>';
        }
        g_page.innerHTML += '<div class="login_page">' +
            '<button id="return">返回</button><br>'+
            '</div>';
        document.getElementById("return").onclick = function () {
            get_newtickets();
        };
        var input_length = document.getElementsByClassName("login_input").length;
        for(var j=0;j<input_length;j++)
        {
            document.getElementsByClassName("login_input")[j].onclick = function(){
                get_content(list, this.getAttribute("name"));
            };
            document.getElementsByClassName("login_input2")[j].onclick = function(){
                console.log(this.getAttribute("name"));
                pick_up(list, this.getAttribute("name"));
            };
        }
    }

    function get_content(data,j){
        g_page = mx("#page");
        g_page.innerHTML = '<div id="login_page">' +
                'series:'+
           data.tickets[j].ticket_base.series+
                '  status:'+
            data.tickets[j].ticket_base.status+
                '  replies:'+
            data.tickets[j].ticket_base.replies+
                '  create_user:'+
            data.tickets[j].ticket_base.create_user+
                '  replier:'+
            data.tickets[j].ticket_base.replier+
                '  contentId: '+
            data.tickets[j].ticket_base.content+
            '</div>';

        var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
        var id=data.tickets[j].ticket_base.content[0];
        var req = {nid:nid,id:id};
        window.send_msg(0x50400000, 'ctck_get_ticket_content_req', req, function (type, data) {

                if(data.result==""){
                    g_page.innerHTML+= '<div id="login_page">' +
                        ' content: '+
                            data.content[0].data+
                        '<button id="back">收起</button><br>'+
                        '</div>';
                }
            if(data.content[0].pic!=""){
                var pic_id=data.content[0].pic;
                g_page.innerHTML+= '<div id="login_page">' +
                    '<img src="http://192.168.3.70:10080/1346371584/ctck_get_pic_req.js?&dnid='+nid+'&dpic_id='+pic_id+'">'
                    +'</div>';
            }

            document.getElementById("back").onclick = function () {
                g_page = mx("#page");
                g_page.innerHTML = '<div id="login_page">' +
                    '</div>';
               show_list();
            };
        });
    }
    function pick_up(data,j){
        var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
        var key=data.tickets[j].ticket_key;
        var req={nid:nid,ticket_key:key};
        console.log(req);
        window.send_msg(0x50400000, 'ctck_pick_up_req', req, function (type, data) {
            console.log("the next is result");
            console.log(data.result);
            if(data.result==""){
                console.log("pick up success");
            }
        });
    }

    function error_class(type,error_type,error_data){
        switch (type){
            case "create":{
                console.log("create-----------");
                create();
                break;
            }
            case  "destroy":{
                console.log("destroy-----------");
                destroy();
                break;
            }
            case "show":{
                console.log("show-----------");
                show();
                break;
            }
        }
        function create(){
            var iframe=document.createElement("iframe");
            g_error_page.appendChild(iframe);
            iframe.width="800";
            iframe.height="150";
            doc = iframe.contentDocument || iframe.contentWindow.document;
            try {
                doc.open();
                doc.close();
            }catch(err){}

            var p_tmp=document.createElement("p");
            p_tmp.innerHTML='<button id="clear_button">清除</button>&nbsp;&nbsp;<button id="display_button" value="1">合上</button>';
            g_error_page.appendChild(p_tmp);
            document.getElementById("clear_button").onclick=function(){
                doc.body.innerHTML='';
            };

            document.getElementById("display_button").onclick=function(){
                if(this.value == '1'){
                    iframe.style.display='none';
                    this.value='0';
                }else{
                    iframe.style.display='';
                    this.value='1';
                }
            };
        }

        function destroy(){
            g_error_page.innerHTML='';
            doc=null;
        }

        function show(){
            if(doc == null || doc.length == 0)
                return;
            var data=typeof(error_data) == "object" ? JSON.stringify(error_data) : error_data;
            doc.body.innerHTML+='<p>' + error_type+'&nbsp;:&nbsp;'+data+ '</p>';
        }
    }

    function class_confcenter()
    {
        console.log("class_confcenter-----------");
        g_web = mx("#web_home");
        g_page = mx("#page");
        g_error_page = mx("#error_page");
        var l_me = this;
        l_me.ctrl = login_class;
        l_me.error = error_class;

        l_me.send_msg=function(to, type, data, on_ack){
            rpc.call({srv:"/", to:to, type:type, data:data,way:"json",
                on_ack:function(msg, ref)
                {
                    if("object" == typeof(msg))
                    {
                        on_ack(msg.type, msg.data, ref);
                    }
                    else if("cancel" != msg)
                    {
                        on_ack(msg, msg, ref);
                    }
                }
            });
        };

        l_me.send_msg_from=function(to, type, data, on_ack){
            rpc.call({srv:"/", to:to, type:type, data:data,way:"from",
                on_ack:function(msg, ref)
                {
                    if("object" == typeof(msg))
                    {
                        on_ack(msg.type, msg.data, ref);
                    }
                    else if("cancel" != msg)
                    {
                        on_ack(msg, msg, ref);
                    }
                }
            });
        };

        l_me.create_upload=function (div,on_ack){
            var iframe  = document.createElement("iframe");
            iframe.frameBorder = 0;
            iframe.height=25;
            iframe.value="0";
            div.insertBefore(iframe,null);
            function iframe_build() {
                var doc = iframe.contentDocument || iframe.contentWindow.document;
                try {
                    doc.open();
                    doc.close();
                }catch(err){}
                doc.body["style"]["cssText"] = "padding:0px;margin:0px;border:none;overflow:hidden;";
                doc.body.innerHTML = "<form id='up_file_form' method='post' action='cct/upgrade_request.js?dFirmwareSrc=upload'" +
                    " enctype='multipart/form-data' " +
                    "style='padding:0px;margin:0px;border:none;overflow:hidden;'>" +
                    "<input type='file' id='dFirmwareContent' name='dFirmwareContent' hidefocus='true'" +
                    " title='upload'" +
                    " style='padding:0px;margin:0px;left:-5px;top:0px;verflow:hidden;cursor:f;" +
                    "line-height:24px;'" +
                    "/>" +
                    "</form>";
                iframe.value="1";
                var form = doc.getElementById("up_file_form");
                doc.getElementById("dFirmwareContent").onchange = function () {
                    var path = this.value.replace(/.*:?\\(.*\\){0,}/g, '');
                    form.action += '&dfilename=' + encodeURI(path.toString('utf-8'));
                };
            }
            function upload_result(){
                if(iframe.value == "0")
                    return;

                var doc = iframe.contentDocument || iframe.contentWindow.document;
                var msg = doc.body.innerHTML,start = msg.indexOf("("), end = msg.lastIndexOf(")");
                if (end > (start + 2)){
                    try {
                        msg = eval(msg.substring(start, end+1));
                    } catch (err) {
                        msg = "error";
                    }
                }

                iframe_build();

                if (("error" == msg) || (null == msg) || (null == msg.data)){
                    on_ack(null);
                }else{
                    on_ack(msg.data);
                }
            }

            iframe_build();
            evt.bind(iframe, 'load', upload_result);

            return iframe;
        };
    }

    window.class_confcenter = class_confcenter;
    function software_init()
    {
        window.ms = new class_confcenter();
        window.onunload = function(){
            ms.ctrl({type:"destroy"});
        };
        ms.ctrl();
    }

    window.software_init = software_init;

})(window, document);