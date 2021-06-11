(function(window, document){
    login_data={};
    confcenter_name=[];
    own_power_list={};
    auth_list={"无权限":0,"基本权限":1,"修改权限":2};
    instead_auth_list={0:"无权限",1:"基本权限",2:"修改权限"};
    all_log_data={};
    var comp_name_js=["node_nece_option","cmipcgw","ccms","ccds","ccvs","clicm","cms","cdmq","cgmq","cpns","csfs","cdfs","cmfs",
        "cmss","cdss","cgmqa","cdms","cpis","cbms","ctck","cmall","comc","cdevh","cats","cafs","ccsm","cpqrc"];

    var comp_name_ec=["node_nece_option","cmipcgw","ccms","ccds","ccvs","clicm","cms","cdmq","cgmq","cpns","csfs","cdfs","cmfs",
        "cmss","cdss","cgmqa"];

    var node_nec_option=["name","ip","ssh_port","ssh_user","ssh_pass","udp_port","comp","gw_host","pass_debug","pass_su","binnet_port",
        "http_port","https_port","rtmp_port", "rtsp_port","rtdp_port","mutp_port"];

    //var node_Optional=["pass_debug","pass_su","binnet_port","http_port","https_port","rtmp_port","rtsp_port","rtdp_port","mutp_port"];

    language=["zh","en","ja","ko","pt","ru","es","fr","de"];
    version_type=['server','web'];
    client_type=['web_mobile','windows_mipc','windows_vimtag','windows_mme','mac_mipc','mac_vimtag','mac_mme','android_mipc','android_vimtag','ios_mipc','ios_vimtag'];
    version_ipc_type=['gm8136','gm8126','gm8126_2','hi3518x','gm828x','fh8810','gm8135'];
    version_type_all=['server','web',
        'web_mobile','windows_mipc','windows_vimtag','windows_mme','mac_mipc','mac_vimtag','mac_mme','android_mipc','android_vimtag','ios_mipc','ios_vimtag',
        'gm8136','gm8135','gm8126','gm8126_2','hi3518x','gm828x','fh8810'];
    special_versions = ["space_0", "space_1"];
    powers=[];
    user_power={};
    powers_flag=0;
    user_cur = '';
    confcenter_names=[];
    node_list_names=[];
    var node_info_elements=["name","ip","ssh_port","ssh_user","ssh_pass","udp_port","mipcm_img","comp","mq_size",
        "udp_test","mrmt_test","min_ccms","send_mail","id_ccms","max_user_counts","max_login","sync_delay","ccms_sync",
        "dps_backup","id_cms","flag_license","gw_host","pass_debug","pass_su","binnet_port","http_port","https_port",
        "rtmp_port","rtsp_port","rtdp_port","mutp_port"];

    var error_class_init = 'no';





    function isNotNullObj(obj) {
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                return true;
            }
        }
        return false;
    }

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

    function store_size_DP(num){
        var ret_kb=num/1024;
        return ret_kb>1024? (ret_kb/1024).toFixed(2)+'M' : ret_kb.toFixed(2)+'KB';
    }

    function login_class(){
        function login_page(){
            g_page.innerHTML='<div id="login_page">'+
                '账号<input type="text" id="user"/><br/>'+
                '密码<input type="password" id="pass"/><br/>'+
                '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button id="login_button">登陆</button><br>'+
                '</div>';
        }
        var flag =0;
        document.onkeydown = function(e){
            if(!e) e = window.event;//火狐中是 window.event
            if((e.keyCode || e.which) == 13){
                if (flag == 0) {
                    var obtnSearch = document.getElementById("login_button")
                    obtnSearch.focus();
                }
            }
        };
        function login_event(){
            document.getElementById("login_button").onclick=function(){
                login();
            };
        }
        function login() {
            flag = 1;
            var user = document.getElementById("user").value,
                pass = document.getElementById("pass").value;
            if (user == 'admin') {
                powers_flag = 1;
            } else {
                powers_flag = 0;
            }
            user_cur = user;
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
                    if( data.result.length == 0 ){
                        // server_info();
                        var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
                        ms.send_msg('comc','comc_login_check_req',{nid:nid},function(type, data){
                            if(data.result =="") {
                                // if (data.names != undefined || data.names != "") {
                                //     confcenter_name = data.names;
                                // }
                                if (data.auth == undefined || data.auth == "") {
                                    data.auth = [];
                                }
                                
                                for (var i=0; i< data.auth.length;i++) {
                                    own_power_list[data.auth[i].itme]=data.auth[i].level;
                                }
                                 
                                fork();

                            } else{
                                alert("没有权限登录！");
                            }
                        });

                    }else{
                        alert("密码或者账号错误！");
                    }
                });
            });

        }

        login_page();
        login_event();
    }
    function fork() {
        g_page.innerHTML = '<center><h1 id="tatol">配置中心</h1></center>'+
            '<center><a  class="message_box" id="clear_message_box_button"  value="0">清空消息框</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
            '<a  class="message_box" id="accept_message_box_button"  value="1" >合上消息框</a></center><br>' +
            '<div id="message_box_div"></div>'+
            '<div id="Options_div">' +
            '<div class="page" id="option_page" style="display: ""> <section class="demo"> <nav class="nav">'+
            '<ul> <li> <a id="account_management_button"> <span>账号 </span> </a> </li>'+
            '<li> <a id="node_management_button"> <span>节点 </span> </a> </li>'+
            '<li> <a id="version_management_button"> <span>版本 </span> </a> </li>'+
            '<li> <a id="log_management_button"> <span>日志 </span> </a> </li>'+
            '<li> <a id="others_management_button"> <span>统计 </span> </a> </li>'+
            '<li> <a id="monitor_alarm_button"> <span>监测 </span> </a> </li>'+
            '<li> <a id="comc_other_button"> <span>其他</span> </a> </li>'+
            '<li> <a id="comc_exit_button"> <span>退出 </span> </a> </li>'+
            '</ul> </nav> </section> </div>'+
            '<div id="account_management_div"></div>' +
            '<div id="node_management_div"></div>' +
            '<div id="version_management_div"></div>' +
            '<div id="log_management_div"></div>' +
            '<div id="others_management_div"></div>' +
            '<div id="monitor_management_div"></div>' +
            '<div id="server_info_stats_div"></div>' +
            '<div id="comc_other_func_div"></div>' +
            '</div>';
        
        var message_box_div = document.getElementById("message_box_div");
        var option_page_div = document.getElementById("option_page");
        document.getElementById("tatol").onclick=function(){
            fork();
        };

        // if (error_class_init == 'no') {
            ms.error = error_class;
            ms.error("create");
            // error_class_init = 'yes';
        // }

        document.getElementById("accept_message_box_button").onclick = function(){
            if (this.value== undefined) {
                this.value = 0
            }
            if(this.value == 0){
                iframe_err.style.display = '';
                this.value=1;
            }else{
                iframe_err.style.display = 'none';
                this.value = 0;
            }
        };

        document.getElementById("clear_message_box_button").onclick=function(){
            if(document.getElementById("accept_message_box_button").value == 1){
                doc.body.innerHTML = '';
            }
        };

        document.getElementById("account_management_button").onclick=function(){
            var account_management_div=document.getElementById("account_management_div");
            if (this.value== undefined) {
                this.value = 0
            }
            if(this.value == 0){
                //  option_page_div.style = "display:none;";
                account_management(account_management_div);
                this.value=1;
            }else{
                this.value=0;
                account_management_div.innerHTML='';
            }
        };

        document.getElementById("node_management_button").onclick=function(){
            var node_management_div=document.getElementById("node_management_div");
            if (this.value== undefined) {
                this.value = 0
            }
            if(this.value == 0){
                node_management(node_management_div);
                this.value=1;
            }else{
                this.value=0;
                node_management_div.innerHTML='';
            }
        };

        document.getElementById("version_management_button").onclick=function(){
            var version_management_div=document.getElementById("version_management_div");
            if (this.value== undefined) {
                this.value = 0
            }
            if(this.value == 0){
                version_management(version_management_div);
                this.value=1;
            }else{
                this.value=0;
                version_management_div.innerHTML='';
            }
        };

        document.getElementById("log_management_button").onclick=function(){
            var log_management_div=document.getElementById("log_management_div");
            if (this.value== undefined) {
                this.value = 0
            }
            if(this.value == 0){
                log_management(log_management_div);
                this.value=1;
            }else{
                this.value=0;
                log_management_div.innerHTML='';
            }
        };

        document.getElementById("others_management_button").onclick=function(){
            var others_management_div=document.getElementById("others_management_div");
            if (this.value== undefined) {
                this.value = 0
            }
            if(this.value == 0){
                others_management(others_management_div);
                this.value=1;
            }else{
                this.value=0;
                others_management_div.innerHTML='';
            }
        };
        document.getElementById("monitor_alarm_button").onclick=function(){
            var monitor_alarm_div = document.getElementById("monitor_management_div");
            if (this.value== undefined) {
                this.value = 0
            }
            if(this.value == 0){
                monitor_alarm_management(monitor_alarm_div);
                this.value=1;
            }else{
                this.value=0;
                monitor_alarm_div.innerHTML='';
            }
        };
        document.getElementById("comc_other_button").onclick = function () {
            var comc_other_func_div = document.getElementById("comc_other_func_div");
            if (this.value == undefined) {
                this.value = 0;
            }
            if (this.value == 0) {
                comc_other_func_management(comc_other_func_div);
                this.value = 1;
            } else {
                this.value = 0;
                comc_other_func_div.innerHTML = '';
            }
        };

        document.getElementById("comc_exit_button").onclick = function(){//退出
            ms.error("destroy");
            ms.ctrl();
        };

        function comc_other_func_management(div){
            var user_list = [];
            var comc_nodes = [];
            var file_tree = {};
            var user = '';
            var root_path = "";

            document.getElementById("option_page").style = "display:none;";
            div.innerHTML = '';
            div.innerHTML = '<div id="version_management_div">' +
                '<button id="go_back_home" value="0" style="font-size: 14px" style="display: "">返回主页</button>&nbsp;&nbsp;<br>' +
                '<div class="demo_line_05">-----------------------------------------------------------------------------------------------------------------------------------</div>' +
                '<button  id="comc_power_conf_btn" value="0" style="font-size: 14px">能力集配置</button>&nbsp;&nbsp;' +
                '<button id="comc_get_power_conf_btn" value="0" style="font-size: 14px">查看能力集</button>&nbsp;&nbsp;' +
                '<button id="comc_get_file_list_btn" value="0" style="font-size: 14px">查看节点文件</button>&nbsp;&nbsp;' +

                '<div id="comc_ability_conf_div" style="display: none;"></div>' +
                '<div id="comc_ability_conf_show_div" style="display: none;"></div>' +
                '<div id="comc_nodes_show_div" style="display: none;"></div>' +
                '<div id="comc_nodes_files_show_div" style="display: none;"></div>' +
                '<br><p>' +
                '<div id="comc_file_auth_set_div" style="display: none;">' +
                '选择用户&nbsp;' + '<select id="comc_file_cap_set_user"><option type="radio" value="null">NULL</option></select>&nbsp;&nbsp;&nbsp;'+
                '<button id="comc_file_cap_set_btn" value="0" style="font-size: 14px" style="display:"">文件权限设置</button>&nbsp;&nbsp;' +
                '</div>' +
                '<div id="comc_node_file_upload_download_div" style="display: none;">' +
                '<button id="comc_set_node_file_upload_btn" value="0" style="font-size: 14px" style="display:"">上传文件</button>&nbsp;&nbsp;' +
                '<button id="comc_set_node_file_download_btn" value="0" style="font-size: 14px" style="display:"">下载</button>&nbsp;&nbsp;' +
                '<div id="comc_node_file_upload_div" style="display:none;">' + '</div>' +
                '<button id="comc_file_upload_confirm_btn" style="display:none;">确认</button></p>' +
                '</div>' +

                '</p>' +
                '</div><br></br><br></br>';

            var comc_ability_conf_div = document.getElementById("comc_ability_conf_div");
            var comc_ability_conf_show_div = document.getElementById("comc_ability_conf_show_div");
            var comc_nodes_show_div = document.getElementById("comc_nodes_show_div");
            var comc_nodes_files_show_div = document.getElementById("comc_nodes_files_show_div");
            var comc_file_auth_set_div = document.getElementById("comc_file_auth_set_div");
            var comc_node_file_upload_download_div = document.getElementById("comc_node_file_upload_download_div");
            var comc_node_file_upload_div = document.getElementById("comc_node_file_upload_div");


            var comc_power_conf_btn = document.getElementById("comc_power_conf_btn");
            var comc_get_power_conf_btn = document.getElementById("comc_get_power_conf_btn");
            var comc_get_file_list_btn = document.getElementById("comc_get_file_list_btn");
            var comc_file_cap_set_btn = document.getElementById("comc_file_cap_set_btn");
            var comc_set_node_file_upload_btn = document.getElementById("comc_set_node_file_upload_btn");
            var comc_set_node_file_download_btn = document.getElementById("comc_set_node_file_download_btn");
            var comc_file_upload_confirm_btn = document.getElementById("comc_file_upload_confirm_btn");

            // if (powers_flag == 0) {
            //     comc_node_file_upload_download_div.style.display = '';
            // } else {
            //     comc_node_file_upload_download_div.style.display = 'none';
            // }
            comc_power_conf_btn.onclick = function () {
                if (this.value == undefined) {
                    this.value = 0;
                }
                if (this.value == 0) {
                    this.value = 1;
                    file_tree = {};
                    comc_ability_conf_show_div.style.display = 'none';
                    comc_nodes_show_div.style.display = 'none';
                    comc_nodes_files_show_div.style.display = 'none';
                    comc_file_auth_set_div.style.display = 'none';
                    comc_node_file_upload_download_div.style.display = 'none';
                    comc_get_power_conf_btn.value = 0;
                    comc_get_file_list_btn.value = 0;
                    comc_ability_conf_div.style.display = '';
                    set_ability_class(comc_ability_conf_div);
                } else {
                    this.value = 0;
                    comc_ability_conf_div.style.display = 'none';
                }
            };
            function set_ability_class(div){
                div.innerHTML = '<div id="set_cap_id_div"> ' +
                    '<br><p><input type="text" value="设备ID起始" style="width:80px;border:0;text-align:center" readonly="true" /> :&nbsp;<input type="text" id="set_cap_id_start"/></p>' +
                    '<br><p><input type="text" value="设备ID结束" style="width:80px;border:0;text-align:center" readonly="true" /> :&nbsp;<input type="text" id="set_cap_id_end"/></p>' +
                    '</div>' +
                    '<div id="set_cap_file_div" style="display:none;"></div>' +
                    '<br><p><input type="text" value="能力选择" style="width:80px;border:0;text-align:center" readonly="true" /> :&nbsp;' +
                    '<select id="set_cap_select">' +
                    '<option value ="set_cap_box">能力集选择</option>' +
                    '<option value ="null">清除能力集</option>' +
                    '<option value ="u_defined">自定义</option>' +
                    '</select>' +
                    '&nbsp;&nbsp;<input type="checkbox" name="set_cap_box" value="wfc"/><input type="text" name="set_cap_box_title" value="wifi智能配置" style="width:80px;border:0;text-align:center" readonly="true" />' +
                    '&nbsp;&nbsp;<input type="checkbox" name="set_cap_box" value="snc"/><input type="text" name="set_cap_box_title" value="声音智能配置" style="width:80px;border:0;text-align:center" readonly="true" />' +
                    '&nbsp;&nbsp;<input type="checkbox" name="set_cap_box" value="qrc"/><input type="text" name="set_cap_box_title" value="qrc配置" style="width:80px;border:0;text-align:center" readonly="true" /> ' +
                    '&nbsp;&nbsp;<input type="text" id="set_cap_text" value="{wfc:1;snc:1;qrc:1}" style="width:300px;display: none;"/>' +
                    '</p>' +
                    '<br><p><input type="text" value="配置模式" style="width:80px;border:0;text-align:center" readonly="true" /> :&nbsp;'+
                    '<select id="set_cap_mode_select">' +
                    '<option value ="id">设备ID模式</option>' +
                    '<option value ="file">文件模式</option>' +
                    '</select>' +
                    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button id="set_cap_confirm_button">确认</button></p>';

                document.getElementById("set_cap_mode_select").onchange = function(){
                    document.getElementById("set_cap_id_div").style.display = this.value == 'id' ? '':'none';
                    document.getElementById("set_cap_file_div").style.display = this.value == 'file' ? '':'none';
                };
                var set_cap_boxs=document.getElementsByName("set_cap_box");
                var set_cap_box_titles=document.getElementsByName("set_cap_box_title");
                var set_cap_text=document.getElementById("set_cap_text");
                var file_div = document.getElementById("set_cap_file_div");
                var tmp_p = document.createElement("p");
                var set_cap_value='';
                var i=0;

                document.getElementById("set_cap_select").onchange=function(){
                    switch (this.value){
                        case 'set_cap_box':{
                            for(i=0; i<set_cap_boxs.length; i++ ){
                                set_cap_boxs[i].style.display='';
                                set_cap_box_titles[i].style.display='';
                            }
                            set_cap_text.style.display='none';
                            break
                        }
                        case 'u_defined':{
                            for(i=0; i<set_cap_boxs.length; i++ ){
                                set_cap_boxs[i].style.display='none';
                                set_cap_box_titles[i].style.display='none';
                            }
                            set_cap_text.style.display='';
                            break
                        }
                    }
                };
                function do_set_cap_value(){
                    switch (document.getElementById("set_cap_select").value){
                        case 'null':{
                            set_cap_value='null';
                            break;
                        }
                        case 'set_cap_box':{
                            set_cap_value='{';
                            var level=0;
                            for(i=0; i<set_cap_boxs.length; i++ ){
                                if(set_cap_boxs[i].checked){
                                    if(level > 0)
                                        set_cap_value+=',';
                                    set_cap_value+=set_cap_boxs[i].value+':1';
                                    level++;
                                }
                            }
                            set_cap_value+='}';
                            break;
                        }
                        case 'u_defined':{
                            set_cap_value=set_cap_text.value;
                            break;
                        }
                    }
                    return set_cap_value;
                }

                file_div.appendChild(tmp_p);
                var iframe  = create_iframe_upload(tmp_p, function(data){  
                    if(data == null){
                        ms.error('show','能力集配置','失败');
                    } else {
                        ms.error('show', '能力集配置', data['result']);
                    }
                });

                function create_iframe_upload(div, on_ack) {
                    var iframe  = document.createElement("iframe");
                    iframe.frameBorder = 0;
                    iframe.height = 25;
                    iframe.value = "0";
                    div.insertBefore(iframe, null);
                    function iframe_build() {
                        var doc = iframe.contentDocument || iframe.contentWindow.document;
                        try {
                            doc.open();
                            doc.close();
                        }catch(err){}
                        doc.body["style"]["cssText"] = "padding:0px;margin:0px;border:none;overflow:hidden;";
                        doc.body.innerHTML = "<form id='up_file_form' method='post' action='comc/comc_set_cap_req.js?'" +
                            " enctype='multipart/form-data' " +
                            "style='padding:0px;margin:0px;border:none;overflow:hidden;'>" +
                            "<input type='file' id='dupload_data' name='dupload_data' hidefocus='true'" +
                            " title='upload'" +
                            " style='padding:0px;margin:0px;left:-5px;top:0px;verflow:hidden;cursor:f;" +
                            "line-height:24px;'" +
                            "/>" +
                            "</form>";
                        iframe.value = "1";
                        var form = doc.getElementById("up_file_form");
                        doc.getElementById("dupload_data").onchange = function () {
                            var path = this.value.replace(/.*:?\\(.*\\){0,}/g, '');
                            form.action += '&dfile=' + encodeURI(path.toString('utf-8'));
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
                }
                
                function do_set_ipc_version_id(button){
                    var data = [document.getElementById("set_cap_id_start").value,
                        document.getElementById("set_cap_id_end").value];
                    for(var i=0; i<data.length; i++){
                        if(data[i].length == 0)
                            continue;
                        var sign = data[i].indexOf("1jfie");
                        if(sign !=0 || data[i].length != 13){
                            alert(data[i]+' : 输入ID不正确！');
                            return;
                        }
                    }
                    if(data[1].length >0 && data[1].localeCompare(data[0]) < 0){
                        alert(data[1]+'必须大于或等于'+data[0]);
                        return;
                    }
                    var nid = create_nid( 2, login_data.lid, 5,login_data.share_key );
                    ms.send_msg('comc', 'comc_set_cap_req',
                        {nid: nid, flag: 0, cap: do_set_cap_value(), id_start: data[0], id_end: data[1]},
                        function (type, data) { 
                            if(type != 'comc_set_cap_ack'){
                                ms.error('show', '能力集配置失败', '未知错误');
                                return;
                            }
                            if (data["result"] != '' && data["result"].indexOf("ok") < 0) {
                                ms.error('show', '能力集配置失败', data["result"]);
                                return;
                            }
                            ms.error('show', '能力集配置结果', '成功');
                        }
                    );
                }

                function do_set_ipc_version_file(button){
                    var doc = iframe.contentDocument || iframe.contentWindow.document;
                    var cap = do_set_cap_value();
                    var form = doc.getElementById("up_file_form");
                    if(doc.getElementById("dupload_data").value == ''){
                        alert("请选择上传文件！");
                        return;
                    }
                    var nid = create_nid( 2, login_data.lid, 5,login_data.share_key );
                    form.action+= '&dnid=' + nid +
                        '&dflag=1' +
                        '&dcap=' + cap;
                    form.submit();
                }

                document.getElementById("set_cap_confirm_button").onclick = function() {
                    if (document.getElementById("set_cap_mode_select").value == 'id') {
                        do_set_ipc_version_id(this);
                    } else {
                        do_set_ipc_version_file(this);
                    }
                }
            }

            comc_get_power_conf_btn.onclick = function () {
                if (this.value == undefined) {
                    this.value = 0;
                }
                if (this.value == 0) {
                    this.value = 1;
                    comc_ability_conf_div.style.display = 'none';
                    comc_nodes_show_div.style.display = 'none';
                    comc_nodes_files_show_div.style.display = 'none';
                    comc_file_auth_set_div.style.display = 'none';
                    comc_node_file_upload_download_div.style.display = 'none';
                    comc_power_conf_btn.value = 0;
                    comc_get_file_list_btn.value = 0;
                    comc_ability_conf_show_div.style.display = '';
                    get_ability_class(comc_ability_conf_show_div);
                } else {
                    this.value = 0;
                    comc_ability_conf_show_div.style.display = 'none';
                }
            };
            function get_ability_class(div) {
                div.innerHTML = '<br>';
                var nid = create_nid( 2, login_data.lid, 5,login_data.share_key );
                ms.send_msg('comc', 'comc_get_cap_req',
                    {nid: nid,  id: ''},
                    function (type, data) {
                        if(type != 'comc_get_cap_ack'){
                            ms.error('show', '获取能力集失败', '未知错误');
                            return;
                        }
                        if (data["result"] != '') {
                            ms.error('show', '获取能力集失败', data["result"]);
                            return;
                        }
                        ms.error('show', '获取能力集结果', '成功');
                        var cap = data.cap;
                        cap = JSON.parse(cap);
                        cap = cap.substring(cap.indexOf("cap_begin********\r\n") + 19, cap.indexOf("cap_end"));
                        cap = cap.replace(/[\r\n]/g, "<br />");
                        
                        div.innerHTML += cap;
                    }
                );
            }

            comc_get_file_list_btn.onclick = function () {
                file_tree = {};
                //show nodes
                if (this.value == undefined) {
                    this.value = 0;
                }
                if (this.value == 0) {
                    comc_nodes_files_show_div.innerHTML = '';
                    this.value = 1;
                    comc_power_conf_btn.value = 0;
                    comc_get_power_conf_btn.value = 0;
                    comc_ability_conf_div.style.display = 'none';
                    comc_ability_conf_show_div.style.display = 'none';
                   comc_node_file_upload_download_div.style.display = 'none';
                    comc_nodes_show_div.style.display = '';
                    comc_get_node_list_class(comc_nodes_show_div);
                } else {
                    this.value = 0;
                    comc_nodes_files_show_div.innerHTML = '';
                    comc_node_file_upload_download_div.style.display = 'none';
                    comc_set_node_file_upload_btn.style.display = 'none';
                    comc_set_node_file_download_btn.style.display = 'none';
                    comc_nodes_files_show_div.style.display = 'none';
                    comc_nodes_show_div.style.display = 'none';
                    comc_file_auth_set_div.style.display = 'none';
                }
            };

            function comc_get_node_list_class(div) {
                var req = {};
                div.innerHTML = '';
                var nid = create_nid( 2, login_data.lid, 5,login_data.share_key );
                req.nid = nid;
                ms.send_msg('comc', 'comc_nodes_list_req',req , function (type, data) {
                    if (type != 'comc_nodes_list_ack'){
                        return;
                    }
                    if (data.result== "") {
                        //show node list
                        show_node_list(div, data);
                    } else {
                        alert(data.result);
                    }
                });
            }
            function show_node_list(div, data) {
                comc_nodes = data.comc_nodes;
                if (comc_nodes == undefined) {
                    alert('节点列表为空');
                    return;
                }
                div.innerHTML = '';
                var num=0;
                var node_data = [];
                for (var k=0; k < comc_nodes.length; k++) {
                    div.innerHTML += '<br><label id="'+k+ comc_nodes[k].name +k+'" style="color: #4169E1 ;font-size: 16px "></label><br/>';
                    if (document.getElementById(k+comc_nodes[k].name +k) != null) {
                        document.getElementById(k+comc_nodes[k].name +k).innerHTML = comc_nodes[k].name;
                    }
                    for (var i = 0; comc_nodes[k].nodes != undefined && i < comc_nodes[k].nodes.length; i++) {
                        if(comc_nodes[k].nodes[i].name==""||comc_nodes[k].nodes[i].name=="undefined"){
                            comc_nodes[k].nodes[i].name="undefined"+num;
                            num++;
                        }
                        node_data[i]=JSON.parse(comc_nodes[k].nodes[i].data);
                        node_data[i].comp=  node_data[i].comp ? JSON.stringify(node_data[i].comp) : "unknown";
                         
                        div.innerHTML += '<br>' +
                            '<button id="'+comc_nodes[k].nodes[i].name +i+'">' + comc_nodes[k].nodes[i].name + '</button>&nbsp;&nbsp;'+
                            '</br></p>';
                        document.getElementById(comc_nodes[k].nodes[i].name +i).style.background = "#66cccc";
                    }
                }

                var node_main = {};
                for (var k1=0; k1<comc_nodes.length; k1++) {
                    for (var j=0; comc_nodes[k1].nodes != undefined && j<comc_nodes[k1].nodes.length; j++) {
                        node_main[comc_nodes[k1].nodes[j].name+j] = comc_nodes[k1].nodes[j];
                        document.getElementById(comc_nodes[k1].nodes[j].name +j ).onclick = function(){
                                var node_name = node_main[this.id].name;    
                                document.getElementById("comc_nodes_files_show_div").style="display:block;";
                                document.getElementById("comc_nodes_show_div").style="display:none;";
                                get_node_files(comc_nodes_files_show_div, node_name);
                        };
                    }
                }
            }
            function get_node_files(div, name) {
                for (var i = 0; i < comc_nodes.length; i++) {
                    var nodes = comc_nodes[i].nodes;
                    for (var j = 0; j < nodes.length; j++) {
                        if (nodes[j].name == name) {
                            var data = JSON.parse(nodes[j].data);
                            user = data.info.user;
                            break;
                        }
                    }
                    if (user != "")break;
                }
                if (user == "") {
                    alert("Unfound user of the node: " + name);
                    return;
                }
                if (user == "root") {
                    root_path = '/root';
                } else {
                    root_path = '/home/' + user;
                }
                var file_root = [{file: '/', file_type: "directory", file_size: 4096}];
                if (powers_flag == 1) {
                    show_node_files(div, file_root, name, '~', '/');
                } else {
                    show_node_files(div, file_root, name, '~', '/');
                    return;
                    div.innerHTML = '';
                    var nid = create_nid( 2, login_data.lid, 5,login_data.share_key );
                    var req = {nid: nid, flag: 0, node: name, path: '~'};
                    ms.send_msg('comc', 'comc_get_node_file_req', req , function (type, data) {
                        if (type != 'comc_get_node_file_ack'){
                            ms.error("show", "获取节点文件列表", '未知错误');
                            return;
                        }
                        if (data.result == "") {
                            ms.error("show", "获取节点文件列表", '成功');
                            var file_arr = data["file_list"];
                            //show node list
                            // show_node_files(div, file_arr, name, '/');
                            show_node_files(div, file_arr, name, '~', '/');
                        } else {
                            alert(data.result);
                        }
                    });
                }


            }
            function show_node_files(div, file_arr, name, cur_url, cur_file) {//cur_url绝对路径
                var node = name;
                var file_list = file_arr;
                var path = '';
                if (cur_url != '~') {
                    path = root_path + cur_url;
                } else {
                    path = root_path;
                }

                if (file_tree[cur_url] == undefined) {
                    file_tree[cur_url] = {};
                }
                if (file_tree[cur_url].child == undefined) {
                    file_tree[cur_url].child = file_list;
                }
                if (cur_url != "~") {
                    if (file_tree[cur_url].parent == undefined) {
                        if (cur_url == "/") {
                            file_tree[cur_url].parent = '~';
                        } else {
                            file_tree[cur_url].parent = cur_url.substring(0, cur_url.lastIndexOf(cur_file));
                        }
                    }
                }
                div.style.display = '';
                div.innerHTML = '';

                if (powers_flag == 1) {
                    if (file_tree[cur_url].parent != undefined) {
                        var tmp_pp = document.createElement("p");
                        var button_back = document.createElement("button");
                        button_back.id = cur_url + 'back';  
                        button_back.name = file_tree[cur_url].parent;
                        button_back.value = '0';
                        button_back.innerHTML = '<span style="font-size:14px;"><b>' + '返回上一级' + '</b></span><br>';
                        tmp_pp.innerHTML = '<br>当前路径：' + path + '&nbsp;&nbsp;';
                        tmp_pp.appendChild(button_back);
                        div.appendChild(tmp_pp);
                    } else {
                        if (cur_url == "~") {
                            div.innerHTML += '<br>当前路径：' + "~" + '&nbsp;&nbsp;';
                        } else {
                            div.innerHTML += '<br>当前路径：' + path + '&nbsp;&nbsp;';
                        }
                    }

                    div.innerHTML += '<br>' + 'N' + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + 'R' + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;W'+ '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;RW' + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;文件名' +
                        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + '文件类型' + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;文件大小</br>';

                    for (var i = 0; i < file_list.length; i++) {
                        var size = store_size_DP(file_list[i].file_size);
                        if (file_list[i].file_type == "directory") {
                            var file_name = file_list[i].file;
                            var tmp_p = document.createElement("p");
                            var button = document.createElement("button");
                            button.id = cur_url + file_name + '/';
                            button.name = file_name;
                            button.value = '0';
                            button.innerHTML = '<span style="font-size:14px;"><b>' + file_list[i].file + '</b></span>';
                            tmp_p.innerHTML = '<br><input type="checkbox" name="cap_set_null_checkbox" value ="n' + file_list[i].file + '"/>' +
                                '&nbsp;&nbsp;&nbsp;<input type="checkbox" name="cap_set_read_checkbox" value ="r' + file_list[i].file + '"/>' +
                                '&nbsp;&nbsp;&nbsp;<input type="checkbox" name="cap_set_write_checkbox" value ="w' + file_list[i].file + '"/>' +
                                '&nbsp;&nbsp;&nbsp;<input type="checkbox" name="cap_set_rw_checkbox" value ="rw' + file_list[i].file + '"/>&nbsp;&nbsp;&nbsp;&nbsp;';

                            tmp_p.appendChild(button);
                            tmp_p.innerHTML += '&nbsp;&nbsp;&nbsp;' +
                                file_list[i].file_type + '&nbsp;&nbsp;&nbsp;&nbsp;' + size + '&nbsp;&nbsp;&nbsp;';
                            div.appendChild(tmp_p);

                        } else {
                            div.innerHTML += '<br>' + '<input type="checkbox" name="cap_set_null_checkbox" value ="n' + file_list[i].file + '"/>';
                            div.innerHTML += '&nbsp;&nbsp;&nbsp;<input type="checkbox" name="cap_set_read_checkbox" value ="r' + file_list[i].file + '"/>';
                            div.innerHTML += '&nbsp;&nbsp;&nbsp;<input type="checkbox" name="cap_set_write_checkbox" value ="w' + file_list[i].file + '"/>';
                            div.innerHTML += '&nbsp;&nbsp;&nbsp;<input type="checkbox" name="cap_set_rw_checkbox" value ="rw' + file_list[i].file + '"/>';
                            div.innerHTML += '&nbsp;&nbsp;&nbsp;&nbsp;' + '<label id="' + path + file_list[i].file + '">' +file_list[i].file + '</label>' +'&nbsp;&nbsp;&nbsp;' +
                                file_list[i].file_type + '&nbsp;&nbsp;&nbsp;&nbsp;' + size + '&nbsp;&nbsp;&nbsp;';
                            div.innerHTML += '</br>';
                        }
                    }

                    if (file_tree[cur_url].parent != undefined) { 
                        document.getElementById(cur_url + 'back').onclick = function () {
                            var len = this.name.length;
                            var cur_file_tmp = this.id.substring(0, this.id.lastIndexOf("back"));
                            cur_file_tmp = cur_file_tmp.substring(len, cur_file_tmp.lastIndexOf("/")); 
                            show_node_files(div, file_tree[this.name].child, name, this.name, cur_file_tmp);
                        };
                    }
                    for (var i = 0; i < file_list.length; i++) {
                        if (file_list[i].file_type == "directory") {
                            document.getElementById(cur_url + file_list[i].file+'/').onclick = function () { 
                                var file_path = this.id;
                                var file_name = this.name;
                                var cur_url_tmp = this.id; 
                                if (cur_url_tmp == "~//") {
                                    cur_url_tmp = '/';
                                }
                                var nid = create_nid( 2, login_data.lid, 5,login_data.share_key );
                                if (this.id == "~//")  file_path = '/'; 
                                var req = {nid: nid, flag: 0, node: name, path: file_path};
                                if (file_tree[cur_url_tmp] != undefined && file_tree[cur_url_tmp].child != undefined) {
                                    show_node_files(div, file_tree[cur_url_tmp].child, name, cur_url_tmp, file_name);
                                    return;
                                }
                                ms.send_msg('comc', 'comc_get_node_file_req', req , function (type, data) {
                                    if (type != 'comc_get_node_file_ack'){
                                        ms.error("show", "取节点文件", '未知错误');
                                        return;
                                    }
                                    if (data.result== "") {
                                        ms.error("show", "取节点文件", '成功');
                                        var file_arr = data["file_list"];
                                        //show node files
                                        if (file_arr != undefined) { 
                                            if (cur_url == "~") {
                                                show_node_files(div, file_arr, name, "/");
                                            } else {
                                                show_node_files(div, file_arr, name, cur_url_tmp, file_name);
                                            }
                                        } else {
                                            alert('当前文件夹为空');
                                        }
                                    } else {
                                        alert(data.result);
                                    }
                                });
                            };
                        }
                    }

                    if (file_list.length > 0) {
                        comc_file_auth_set_div.style.display = '';
                        var select_user = document.getElementById("comc_file_cap_set_user");
                        if (user_list.length == 0) {
                            var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                            ms.send_msg('comc', 'comc_get_auth_req', {nid: nid, flag: 0}, function (type, data) {
                                if (type != 'comc_get_auth_ack') {
                                    ms.error("show", "获取用户列表", '未知错误');
                                    return;
                                }
                                if (data.auth_all == undefined) {
                                    data.auth_all = [];
                                }
                                for (var i = 0; i < data.auth_all.length; i++) {
                                    user_list.push(data.auth_all[i].user);
                                }
                                for (var i = 0; i < user_list.length; i++) {
                                    if (user_list[i] == "admin")continue;
                                    var option = document.createElement("option");
                                    option.type = "user";
                                    option.value = user_list[i];
                                    option.innerHTML = user_list[i];
                                    select_user.appendChild(option);
                                }

                            });
                        }

                        comc_file_cap_set_btn.onclick = function () {
                            if (select_user.value == null || select_user.value == "null") {
                                alert("请选择用户");
                                return;
                            }
                            var checkbox_file_null = document.getElementsByName("cap_set_null_checkbox");
                            var checkbox_file_read = document.getElementsByName("cap_set_read_checkbox");
                            var checkbox_file_write = document.getElementsByName("cap_set_write_checkbox");
                            var checkbox_file_rw = document.getElementsByName("cap_set_rw_checkbox");

                            var checkbox_file_null_check = [];
                            var checkbox_file_read_check = [];
                            var checkbox_file_write_check = [];
                            var checkbox_file_rw_check = [];

                            for (var r = 0; r < checkbox_file_null.length; r++) {
                                if (checkbox_file_null[r].checked) {
                                    checkbox_file_null_check[checkbox_file_null_check.length] = checkbox_file_null[r].value.substring(1);
                                }
                            }
                            for (var r = 0; r < checkbox_file_read.length; r++) {
                                if (checkbox_file_read[r].checked) {
                                    checkbox_file_read_check[checkbox_file_read_check.length] = checkbox_file_read[r].value.substring(1);
                                }
                            }
                            for (var r = 0; r < checkbox_file_write.length; r++) {
                                if (checkbox_file_write[r].checked) {
                                    checkbox_file_write_check[checkbox_file_write_check.length] = checkbox_file_write[r].value.substring(1);
                                }
                            }
                            for (var r = 0; r < checkbox_file_rw.length; r++) {
                                if (checkbox_file_rw[r].checked) {
                                    checkbox_file_rw_check[checkbox_file_rw_check.length] = checkbox_file_rw[r].value.substring(2);
                                }
                            }

                            if (checkbox_file_read_check.length == 0 && checkbox_file_write_check.length == 0 &&
                                checkbox_file_null_check.length == 0 && checkbox_file_rw_check.length == 0) {
                                alert("请选择权限");
                                return;
                            }

                            var null_file_auth = {"node": node};
                            var null_file = [];
                            for (var i = 0; i < checkbox_file_null_check.length; i++) {
                                null_file.push(path + checkbox_file_null_check[i]);
                            }
                            if (null_file.length != 0) {
                                null_file_auth.file = null_file;
                                null_file_auth.auth = 0;
                                var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                                ms.send_msg('comc', 'comc_set_file_auth_req', {nid: nid, user: select_user.value, file_auth: null_file_auth},
                                    function (type, data) {
                                        if (type != "comc_set_file_auth_ack") {
                                            ms.error("show", "设置文件权限", '未知错误');
                                            return;
                                        }
                                        if ("" == data["result"]) {
                                            ms.error("show", "设置文件权限", '成功');
                                        } else {
                                            ms.error("show", "设置文件权限", data["result"]);
                                        }
                                    });
                            }

                            var read_file_auth = {"node": node};
                            var read_file = [];
                            for (var i = 0; i < checkbox_file_read_check.length; i++) { 
                                read_file.push(path + checkbox_file_read_check[i]); 
                            }
                            if (read_file.length != 0) {
                                read_file_auth.file = read_file;
                                read_file_auth.auth = 4;
                                var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                                ms.send_msg('comc', 'comc_set_file_auth_req', {nid: nid, user: select_user.value, file_auth: read_file_auth},
                                    function (type, data) {
                                        if (type != "comc_set_file_auth_ack") {
                                            ms.error("show", "设置文件权限", '未知错误');
                                            return;
                                        }
                                        if (data["result"] == "") {
                                            ms.error("show", "设置文件权限", '成功');
                                        } else {
                                            ms.error("show", "设置文件权限", data["result"]);
                                        }
                                    });
                            }


                            var write_file_auth = {"node": node};
                            var write_file = [];
                            for (var i = 0; i < checkbox_file_write_check.length; i++) {
                                write_file.push(path + checkbox_file_write_check[i]);
                            }   
                            if (write_file.length != 0) {      
                                write_file_auth.file = write_file;
                                write_file_auth.auth = 2;
                                var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                                ms.send_msg('comc', 'comc_set_file_auth_req', {nid: nid, user: select_user.value, file_auth: write_file_auth},
                                    function (type, data) {
                                        if (type != "comc_set_file_auth_ack") {
                                            ms.error("show", "设置文件权限", '未知错误');
                                            return;
                                        }
                                        if (data["result"] != '') {
                                            ms.error("show", "设置文件权限", data["result"]);
                                            return;
                                        }
                                        ms.error("show", "设置文件权限", '成功');
                                    });
                            }

                            var rw_file_auth = {"node": node};
                            var rw_file = [];
                            for (var i = 0; i < checkbox_file_rw_check.length; i++) {
                                rw_file.push(path + checkbox_file_rw_check[i]);
                            }
                            if (rw_file.length != 0) {
                                rw_file_auth.file = rw_file;
                                rw_file_auth.auth = 6;
                                var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                                ms.send_msg('comc', 'comc_set_file_auth_req', {nid: nid, user: select_user.value, file_auth: rw_file_auth},
                                    function (type, data) {
                                        if (type != "comc_set_file_auth_ack") {
                                            ms.error("show", "设置文件权限", '未知错误');
                                            return;
                                        }
                                        if (data["result"] != '') {
                                            ms.error("show", "设置文件权限", data["result"]);
                                            return;
                                        }
                                        ms.error("show", "设置文件权限", '成功');
                                    });
                            }
                        };
                    }

                } else {

                    if (file_tree[cur_url].parent != undefined) {
                        var tmp_pp = document.createElement("p");
                        var button_back = document.createElement("button");
                        button_back.id = cur_url + 'back';  
                        button_back.name = file_tree[cur_url].parent;
                        button_back.value = '0';
                        button_back.innerHTML = '<span style="font-size:14px;"><b>' + '返回上一级' + '</b></span><br>';
                        tmp_pp.innerHTML = '<br>当前路径：' + path + '&nbsp;&nbsp;';
                        tmp_pp.appendChild(button_back);
                        div.appendChild(tmp_pp);
                    } else {
                        if (cur_url == "~") {
                            div.innerHTML += '<br>当前路径：' + "~" + '&nbsp;&nbsp;';
                        } else {
                            div.innerHTML += '<br>当前路径：' + path + '&nbsp;&nbsp;';
                        }
                    }

                    div.innerHTML += '<br>'  + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;文件名' +
                        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + '文件类型' + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;文件大小</br>';

                    for (var i = 0; i < file_list.length; i++) {
                        var size = store_size_DP(file_list[i].file_size);
                        if (file_list[i].file_type == "directory") {
                            var file_name = file_list[i].file;
                            var tmp_p = document.createElement("p");
                            var button = document.createElement("button");
                            button.id = cur_url + file_name + '/';          // '~//'
                            button.name = file_name;          // '/'
                            button.value = '0';
                            button.innerHTML = '<span style="font-size:14px;"><b>' + file_list[i].file + '</b></span>';
                            tmp_p.innerHTML = '<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
                            tmp_p.appendChild(button);
                            tmp_p.innerHTML += '&nbsp;&nbsp;&nbsp;' +
                                file_list[i].file_type + '&nbsp;&nbsp;&nbsp;&nbsp;' + size + '&nbsp;&nbsp;&nbsp;';
                            div.appendChild(tmp_p);
                        } else {
                            div.innerHTML += '<br>&nbsp;&nbsp;&nbsp;&nbsp;' + '<label id="' + path + file_list[i].file + '">' +file_list[i].file + '</label>' +'&nbsp;&nbsp;&nbsp;' +
                                file_list[i].file_type + '&nbsp;&nbsp;&nbsp;&nbsp;' + size + '&nbsp;&nbsp;&nbsp;' +
                                '<input type="checkbox" name="comc_node_file_download_checkbox" value ="d' + file_list[i].file + '"/>';
                            div.innerHTML += '</br>';
                        }
                    }
                    if (file_tree[cur_url].parent != undefined) { 
                        document.getElementById(cur_url + 'back').onclick = function () {
                            if (this.name == "~") {
                                comc_node_file_upload_download_div.style.display = 'none';
                            }
                            var len = this.name.length;
                            var cur_file_tmp = this.id.substring(0, this.id.lastIndexOf("back"));
                            cur_file_tmp = cur_file_tmp.substring(len, cur_file_tmp.lastIndexOf("/"));  
                            show_node_files(div, file_tree[this.name].child, name, this.name, cur_file_tmp);
                        };
                    }
                    for (var i = 0; i < file_list.length; i++) {
                        if (file_list[i].file_type == "directory") {
                            document.getElementById(cur_url + file_list[i].file + '/').onclick = function () {   
                                 
                                var file_path = this.id;
                                var file_name = this.name;
                                var cur_url_tmp = this.id;       
                                if (cur_url_tmp == "~//") {
                                    cur_url_tmp = '/';
                                }
                                var nid = create_nid( 2, login_data.lid, 5,login_data.share_key );
                                if (this.id == "~//")  file_path = '/'; 
                                var req = {nid: nid, flag: 0, node: name, path: file_path};
                                if (file_tree[cur_url_tmp] != undefined && file_tree[cur_url_tmp].child != undefined) {
                                    show_node_files(div, file_tree[cur_url_tmp].child, name, cur_url_tmp, file_name);
                                    return;
                                }
                                ms.send_msg('comc', 'comc_get_node_file_req', req , function (type, data) {
                                    if (type != 'comc_get_node_file_ack'){
                                        ms.error("show", "取节点文件", '未知错误');
                                        return;
                                    }
                                    if (data.result== "") {
                                        ms.error("show", "取节点文件", '成功');
                                        var file_arr = data["file_list"];
                                        //show node files
                                        if (file_arr != undefined) { 
                                            if (cur_url == "~") {
                                                show_node_files(div, file_arr, name, "/");
                                            } else {
                                                show_node_files(div, file_arr, name, cur_url_tmp, file_name);
                                            }
                                        } else {
                                            alert('当前文件夹为空');
                                        }

                                    } else {
                                        alert(data.result);
                                    }
                                });
                            };
                        }
                    }
                    if (cur_url != "~") {
                        comc_node_file_upload_download_div.style.display = '';
                        // if (comc_node_file_upload_div.children.length == 0) {
                        comc_set_node_file_upload_btn.onclick = function () {    
                            if (this.value == undefined) this.value = 0;
                            if (this.value == 0) {
                                this.value = 1;
                                comc_file_upload_confirm_btn.style.display = '';
                                comc_node_file_upload_div.style.display = '';
                                comc_set_node_file_upload(comc_node_file_upload_div);
                            } else {
                                this.value = 0;
                                comc_file_upload_confirm_btn.style.display = 'none';
                                comc_node_file_upload_div.style.display = 'none';
                            }
                        };
                        comc_set_node_file_download_btn.onclick = function () {
                            this.disabled = true;
                            var button = this;
                            var comc_node_file_download_check = document.getElementsByName("comc_node_file_download_checkbox");
                            if (comc_node_file_download_check.length == 0) {
                                button.disabled = false;
                                alert('请选择文件');
                                return;
                            }
                            var files_download = [];
                            var file_name = '';
                            for (var i = 0; i < comc_node_file_download_check.length; i++) {
                                if (comc_node_file_download_check[i].checked) {
                                    file_name = comc_node_file_download_check[i].value.substring(1);
                                    break;
                                    // files_download[files_download.length] = comc_node_file_download_check[i].value.substring(1);
                                }
                            }  
                            if (file_name == "") {
                                alert("请选择文件");
                                button.disabled = false;
                                return;
                            }
                            var file_path = path.replace(root_path, '') + file_name;  
                            var nid = create_nid(2, login_data.lid, 5,login_data.share_key);
                            var req = {nid: nid, flag: 1, node: name, path: file_path};
                            ms.send_msg('comc', 'comc_get_node_file_req', req , function (type, data) {
                                button.disabled = false;
                                if (type != 'comc_get_node_file_ack'){
                                    ms.error("show", "下载节点文件", '未知错误');
                                    return;
                                }
                                if (data.result == "") {
                                    ms.error("show", "下载节点文件", '成功');
                                    var file_url = data["file_url"];
                                    
                                    var w = window.open(file_url);
                                    w.document.execCommand('SaveAs', file_name);
                                } else {
                                    alert(data.result);
                                }
                            });
                        };
                    }
                    function comc_set_node_file_upload(div) {
                        div.style.display = '';
                        var tmp_p = document.createElement("p");
                        div.appendChild(tmp_p);

                        function create_iframe_upload_node(div, on_ack) {
                            var iframe  = document.createElement("iframe");
                            iframe.frameBorder = 0;
                            iframe.height = 25;
                            iframe.value = "0";
                            div.insertBefore(iframe, null);
                            function iframe_build() {
                                var doc = iframe.contentDocument || iframe.contentWindow.document;
                                try {
                                    doc.open();
                                    doc.close();
                                }catch(err){}
                                doc.body["style"]["cssText"] = "padding:0px;margin:0px;border:none;overflow:hidden;";
                                doc.body.innerHTML = "<form id='up_file_form' method='post' action='comc/comc_set_node_file_req.js?'" +
                                    " enctype='multipart/form-data' " +
                                    "style='padding:0px;margin:0px;border:none;overflow:hidden;'>" +
                                    "<input type='file' id='dupload_data' name='dupload_data' hidefocus='true'" +
                                    " title='upload'" +
                                    " style='padding:0px;margin:0px;left:-5px;top:0px;verflow:hidden;cursor:f;" +
                                    "line-height:24px;'" +
                                    "/>" +
                                    "</form>";
                                iframe.value = "1";
                                var form = doc.getElementById("up_file_form");
                                doc.getElementById("dupload_data").onchange = function () {   
                                    var reg = new RegExp("/","g");
                                    var path_tmp = path.replace(reg, "%2F");
                                    var file_name = this.value.replace(/.*:?\\(.*\\){0,}/g, '');
                                    form.action += '&dpath=' + path_tmp + encodeURI(file_name.toString('utf-8'));
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
                        }


                        var iframe  = create_iframe_upload_node(tmp_p, function(data){
                            if(data == null){
                                ms.error('show','文件上传','失败');
                            } else {
                                if (data['result'] == '') {
                                    ms.error('show', '文件上传', '成功');
                                } else {
                                    ms.error('show', '文件上传', data['result']);
                                }
                            }
                        });
                        function do_set_node_upload_file(button) {
                            var doc = iframe.contentDocument || iframe.contentWindow.document;
                            var form = doc.getElementById("up_file_form");
                            if(doc.getElementById("dupload_data").value == ''){
                                alert("请选择上传文件！");
                                return;
                            }
                            var nid = create_nid( 2, login_data.lid, 5, login_data.share_key );
                            var flag = 1;
                            form.action += '&dnid=' + nid +
                                '&dflag=' + flag +
                                '&dnode__x_countz_=1' +
                                '&dnode=' + name;
                            form.submit();
                        }
                        comc_file_upload_confirm_btn.onclick = function() {
                            do_set_node_upload_file(this);
                        };
                    }
                }
            }
        }

        function monitor_alarm_management(div){
            var nodes=[];
            var nodes_list=[];
            var comc_nodes=[];
            var node_name;

            document.getElementById("option_page").style="display:none;";
            div.innerHTML = '<div id="server_info">' +
                '<center><button id="srv_monitor" value="0" style="font-size: 14px ;display:none;"></button>&nbsp;&nbsp;' +
                '<button id="set_monitor_conf" value="0" style="font-size: 14px ;display:none;" ></button>&nbsp;&nbsp;' +
                '<button  id="monitor_excep_notice" value="0" style="font-size: 14px ;display:none;"></button>&nbsp;&nbsp;' +
                '<button id="go_back_home" value="0" style="font-size: 14px" style="display: "">返回主页</button>&nbsp;&nbsp;<br>' +
                '<div class="demo_line_05">-----------------------------------------------------------------------------------------------------------------------------------</div></center>'+
                '<div id="comc_srv_monitor_div"></div>' +
                '<div id="comc_get_monitor_nodes_div"></div>' +
                '<div id="comc_monitor_excep_notice_div"></div>' +
                '<div id="comc_set_node_div"></div>' +
                '<div id="show_node_list_div" style="display: ""></div>'+
                '<div id="comc_node_monitor_log_div" style="display: ""></div>' +
                '<div id="server_monitor_show_div" style="display: ""></div>' +
                '</div>';
            // document.getElementById("srv_monitor").style.background = "#99ccff";
            // document.getElementById("set_monitor_conf").style.background = "#99ccff";
            document.getElementById("monitor_excep_notice").style.background = "#99ccff";
            document.getElementById("go_back_home").style.background = "#99ccff";

            var comc_srv_monitor_div = document.getElementById("comc_srv_monitor_div");
            var comc_get_monitor_nodes_div = document.getElementById("comc_get_monitor_nodes_div");
            var comc_go_back_home = document.getElementById("go_back_home");
            var show_node_list_div = document.getElementById("show_node_list_div");
            var comc_get_node_monitor_log_div = document.getElementById("comc_node_monitor_log_div");
            var comc_server_monitor_show_div = document.getElementById("server_monitor_show_div");
            comc_get_node_list_class(comc_get_monitor_nodes_div);


            function comc_get_node_list_class(div){
                var req={};
                div.innerHTML= '';
                var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
                req.nid=nid;

                function send_to_get_node_list(){
                    ms.send_msg('comc', 'comc_nodes_list_req',req , function (type, data) {
                        if (type != 'comc_nodes_list_ack'){
                            return;
                        }
                        if (data.result== "") {
                            nodes_list=data; 
                            //show node list
                            show_node_list(show_node_list_div, data);
                        } else {
                            alert(data.result);
                        }
                    });
                }

                comc_go_back_home.onclick=function(){
                    fork();
                };
                send_to_get_node_list();
            }

            function show_node_list(div,data){
                comc_nodes = data.comc_nodes || [];
                div.innerHTML = '';
                var num=0;
                var node_data=[];
                for (var k=0; k< comc_nodes.length; k++) {
                    div.innerHTML += '<label id="'+k+ comc_nodes[k].name +k+'" style="color: #4169E1 ;font-size: 16px "></label><br/>';
                    if (document.getElementById(k + comc_nodes[k].name + k) != null) {
                        document.getElementById(k + comc_nodes[k].name + k).innerHTML = comc_nodes[k].name;
                    }
                    for (var i = 0; comc_nodes[k].nodes != undefined && i < comc_nodes[k].nodes.length; i++) {
                        if (comc_nodes[k].nodes[i].name == "" || comc_nodes[k].nodes[i].name == "undefined") {
                            comc_nodes[k].nodes[i].name = "undefined" + num;
                            num++;
                        }
                        node_data[i] = JSON.parse(comc_nodes[k].nodes[i].data);
                        node_data[i].comp = node_data[i].comp ? JSON.stringify(node_data[i].comp) : "unknown";
                        div.innerHTML += '<br>' +
                            '<button id="'+comc_nodes[k].nodes[i].name +i+'">' + comc_nodes[k].nodes[i].name + '</button>&nbsp;&nbsp;'+
                            '</br></p>';
                        if (document.getElementById(comc_nodes[k].nodes[i].name +i) != null)
                            document.getElementById(comc_nodes[k].nodes[i].name +i).style.background = "#66cccc";
                    }
                }

                var node_main={};
                for (var k1=0; k1 < comc_nodes.length; k1++) {
                    for (var j = 0; comc_nodes[k1].nodes != undefined && j < comc_nodes[k1].nodes.length; j++) {
                        node_main[comc_nodes[k1].nodes[j].name + j] = comc_nodes[k1].nodes[j];
                        document.getElementById(comc_nodes[k1].nodes[j].name + j ).onclick =
                            function(){
                            node_name = node_main[this.id].name; 
                            node_class(node_name);
                            document.getElementById("comc_node_monitor_log_div").style="display:block;";
                            document.getElementById("show_node_list_div").style="display:none;";
                            comc_go_back_home.style="display:none;";
                            document.getElementById("monitor_excep_notice").style="display:none;";
                        };
                    }
                }
            }

            function  node_class(node_name) {
                function node_page(name) { 
                    comc_get_node_monitor_log_div.innerHTML =  '<p id="node_page">' +
                        '<h1 style="text-align:center">' + '<label id="node_name" style="color: #4169E1 ;font-size: 16px">' + name +'</label>' + '</h1></p>' +
                        '<div id="comc_monitor_func" style="text-align:center">'+
                        '<button id="comc_node_monitor_info" style="text-align:center">服务器监测</button>&nbsp;&nbsp;&nbsp;&nbsp;' +
                        '<button id="comc_node_monitor_set" >监测设置</button>&nbsp;&nbsp;&nbsp;&nbsp;' +
                        '<button id="comc_node_alarm_set" >报警监测设置</button>&nbsp;&nbsp;&nbsp;&nbsp;' +
                        '<button id="node_back_to_home" >返回</button><br/><br/>' +
                        '</div>' +
                        '<div id = "hardware_monitor_info" style="display: none; text-align:center;">'+
                        'CPU:'+'&nbsp;&nbsp;&nbsp;&nbsp;监测状态&nbsp;' +
                        '<input type="text" id="cpu_monitor_status_text" style="width:60px" value="" >&nbsp;&nbsp;&nbsp;&nbsp;' +
                        '<button id="cpu_monitor_log_button" >查看监测日志</button>&nbsp;&nbsp;&nbsp;&nbsp;' +
                        '<br/>' +

                        '<br>' +
                        '内存:'+'&nbsp;&nbsp;&nbsp;&nbsp;监测状态&nbsp;' +
                        '<input type="text" id="mem_monitor_status_text" style="width:60px" value="" >&nbsp;&nbsp;&nbsp;&nbsp;' +
                        '<button id="mem_monitor_log_button" >查看监测日志</button>&nbsp;&nbsp;&nbsp;&nbsp;' +
                        '</br>' +
                        '<br>' +
                        '硬盘:'+'&nbsp;&nbsp;&nbsp;&nbsp;监测状态&nbsp;' +
                        '<input type="text" id="hd_monitor_status_text" style="width:60px" value="" >&nbsp;&nbsp;&nbsp;&nbsp;' +
                        '<button id="hd_monitor_log_button" >查看监测日志</button>&nbsp;&nbsp;&nbsp;&nbsp;' +
                        '</br>' +
                        '<br>' +
                        '带宽:'+'&nbsp;&nbsp;&nbsp;&nbsp;监测状态&nbsp;' +
                        '<input type="text" id="net_monitor_status_text" style="width:60px" value="" >&nbsp;&nbsp;&nbsp;&nbsp;' +
                        '<button id="net_monitor_log_button" >查看监测日志</button>&nbsp;&nbsp;&nbsp;&nbsp;<br/>' +
                        '</div>' +

                        '<div id="node_monitor_conf_set" style="display: none; text-align:center;">' +
                        '<p>cpu&nbsp;&nbsp;监测开关(-1:stop,1:start):&nbsp;' + '<input type="text" id="monitor_cpu_switch" style="width:60px;height:16px;"/>' + '&nbsp;&nbsp;监测频率&nbsp;:'+'<input type="text" id="monitor_cpu_freq" style="width:60px;height:16px;"/>' + '</p></br>'+
                        '<p>mem&nbsp;&nbsp;监测开关(-1:stop,1:start):&nbsp;<input type="text" id="monitor_mem_switch" style="width:60px;height:16px;"/>&nbsp;&nbsp;监测频率&nbsp;:<input type="text" id="monitor_mem_freq" style="width:60px;height:16px;"/></p></br>'+
                        '<p>hd&nbsp;&nbsp;监测开关(-1:stop,1:start):&nbsp;<input type="text" id="monitor_hd_switch" style="width:60px;height:16px;"/>&nbsp;&nbsp;监测频率&nbsp;:<input type="text" id="monitor_hd_freq" style="width:60px;height:16px;"/></p></br>'+
                        '<p>net&nbsp;&nbsp;监测开关(-1:stop,1:start):&nbsp;<input type="text" id="monitor_net_switch" style="width:60px;height:16px;"/>&nbsp;&nbsp;</p></br>'+

                        '<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button id="comc_monitor_conf_set_btn" >设置</button></p></br>' +
                        '</div>' +

                        '<div id="node_alarm_conf_set" style="display: none; text-align:left;">' +
                        '<p>1.报警电话&nbsp;:&nbsp;' +
                           '<div id="alarm_phones_exist"></div>' +
                           '<input type="text"  id="alarm_phone_add_txt" style="width:260px;height:16px;">&nbsp;'+
                           '<button id="alarm_phones_add_button" >新增</button>&nbsp;&nbsp;(e: ["电话1","电话2",...])</br>' +
                            '<input type="text" id="alarm_phone_del_txt" style="width:260px;height:16px;">&nbsp;'+
                            '<button id="alarm_phones_del_button" >删除</button>&nbsp;&nbsp;(e: ["电话1","电话2",...])</br>' +
                        '</p></br></br>' +

                        '<p>2.报警邮箱&nbsp;:&nbsp;' +
                        '<div id="alarm_emails_exist"></div>' +
                        '<input type="text" id="alarm_email_add_txt" style="width:260px;height:16px;">&nbsp;'+
                        '<button id="alarm_email_add_button" >新增</button>&nbsp;&nbsp;(e: ["邮箱1","邮箱2",...])</br>' +
                        '<input type="text" id="alarm_email_del_txt" style="width:260px;height:16px;">&nbsp;'+
                        '<button id="alarm_emails_del_button" >删除</button>&nbsp;&nbsp;(e: ["邮箱1","邮箱2",...])</br>' +
                        '</p></br></br>' +


                        '<p>3.发送报警开关&nbsp;:&nbsp;<input type="text" id="alarm_send_switch"><button id="alarm_send_switch_set">&nbsp;设置</button>(-1:关, 1:开)</p></br>'+
                        '<p>4.过滤报警项目&nbsp;:&nbsp;' +
                        '<div id="no_send_item_exist">cpu,mem,...</div>' +
                        '<input type="text" id="no_send_item_add_txt" style="width:260px;height:16px;">&nbsp;'+
                        '<button id="no_send_item_add_button" >新增</button>&nbsp;&nbsp;(输入报警项目名称, e: ["名称1","名称2",...])</br>' +
                        '<input type="text" id="no_send_item_del_txt" style="width:260px;height:16px;">&nbsp;'+
                        '<button id="no_send_item_del_button" >删除</button>&nbsp;&nbsp;(输入报警项目名称, e: ["名称1", "名称2",...])</br>' +
                        '</p></br></br>' +

                        '<p>5.报警监测项目&nbsp;:&nbsp;</p>' +
                            '<div id="alarm_item_exist">name:cpu, status:0,value:90,sfreq:20,dfreq:10</div>' +
                            '名称:&nbsp;<input type="text" id="alarm_item_add_name" style="width:60px;height:16px;">&nbsp;'+
                            '开关(1/-1):&nbsp;<input type="text" id="alarm_item_add_switch" style="width:60px;height:16px;">&nbsp;'+
                            '阈值:&nbsp;<input type="text" id="alarm_item_add_span" style="width:60px;height:16px;">&nbsp;'+
                            '正常监测频率:&nbsp;<input type="text" id="alarm_item_add_sfreq" style="width:60px;height:16px;">&nbsp;'+
                            '异常监测频率:&nbsp;<input type="text" id="alarm_item_add_dfreq" style="width:60px;height:16px;">&nbsp;'+
                            '<button id="alarm_monitor_item_add_button">新增/修改</button></p></br>'+

                            '<input type="text" id="alarm_item_del_txt" style="width:160px;height:16px;">&nbsp;'+
                            '<button id="alarm_item_del" >删除</button>(输入报警监测项目名称,e: ["名称1","名称2",...])&nbsp;&nbsp;&nbsp;&nbsp;</br>' +
                            '</br>' +

                        '</div>' +
                        '</br>' +
                        '</br>' +
                        '</br>' +
                        '</br>' +
                        '</br>' +
                        '</br>' +
                        '</br>';

                    var comc_node_monitor_info_btn = document.getElementById("comc_node_monitor_info");
                    var comc_node_monitor_set_btn = document.getElementById("comc_node_monitor_set");
                    var comc_node_alarm_conf_set_btn = document.getElementById("comc_node_alarm_set");
                    var comc_hardware_monitor_info_div = document.getElementById("hardware_monitor_info");
                    var comc_node_monitor_conf_set_div = document.getElementById("node_monitor_conf_set");
                    var comc_node_alarm_conf_set_div = document.getElementById("node_alarm_conf_set");
                    var comc_alarm_phones_exist_div = document.getElementById("alarm_phones_exist");
                    var comc_alarm_emails_exist_div = document.getElementById("alarm_emails_exist");
                    var comc_no_send_item_exist_div = document.getElementById("no_send_item_exist");
                    var comc_alarm_item_exist_div = document.getElementById("alarm_item_exist");
                    var comc_alarm_send_switch = document.getElementById("alarm_send_switch");

                    comc_node_monitor_info_btn.onclick = function () {
                        if (comc_hardware_monitor_info_div.style.display != 'none') {
                            comc_hardware_monitor_info_div.style.display = 'none';
                            document.getElementById("server_monitor_show_div").style.display = 'none';
                            return;
                        }
                        comc_node_monitor_conf_set_div.style.display = 'none';
                        comc_node_alarm_conf_set_div.style.display = 'none';
                        comc_hardware_monitor_info_div.style.display = 'block';

                        var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                        ms.send_msg('comc', 'comc_get_monitor_req',
                            {
                                nid: nid,
                                filter: 'node_' + node_name
                            },
                            function (type, data) {
                                if(type != "comc_get_monitor_ack"){
                                    ms.error("show","获取监测信息","未知错误");
                                    return;
                                }
                                if (data["result"] != "") {
                                    ms.error("show", "获取监测信息", data["result"]);
                                } else {
                                    ms.error("show","获取监测信息", '成功');
                                    show_monitor_log_status(data["conf"]);
                                }
                            });
                    };

                    comc_node_monitor_set_btn.onclick = function () { 
                        if (comc_node_monitor_conf_set_div.style.display != 'none') {
                            comc_node_monitor_conf_set_div.style.display = 'none';
                            return;
                        }
                        document.getElementById("server_monitor_show_div").style.display = 'none';
                        comc_hardware_monitor_info_div.style.display = 'none';
                        comc_node_alarm_conf_set_div.style.display = 'none';
                        comc_node_monitor_conf_set_div.style.display = 'block';
                        var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                         
                        ms.send_msg('comc', 'comc_get_monitor_req',
                            {
                                nid: nid,
                                filter: 'node_' + node_name
                            },
                            function (type, data) {
                                if(type != "comc_get_monitor_ack"){
                                    ms.error("show","获取监测信息","未知错误");
                                    return;
                                }
                                if (data["result"] != "") {
                                    ms.error("show", "获取监测信息", data["result"]);
                                } else {
                                    ms.error("show","获取监测信息", '成功');
                                    show_monitor_log_conf(data["conf"]);
                                }
                            });
                    }; 
                    document.getElementById("comc_monitor_conf_set_btn").onclick = function(){
                        var monitor_conf_monitor = [];
                        var monitor_cpu_switch = document.getElementById("monitor_cpu_switch").value;
                        var monitor_cpu_freq = document.getElementById("monitor_cpu_freq").value;
                        var monitor_mem_switch = document.getElementById("monitor_mem_switch").value;
                        var monitor_mem_freq = document.getElementById("monitor_mem_freq").value;
                        var monitor_net_switch = document.getElementById("monitor_net_switch").value;
                        var monitor_hd_freq = document.getElementById("monitor_hd_freq").value;
                        if (monitor_cpu_switch == "" && monitor_cpu_freq == "" && monitor_mem_switch == ""
                            && monitor_mem_freq == "" && monitor_net_switch =="" && monitor_hd_freq == "") {
                            alert("参数填写有误，请重新输入");
                            return;
                        }
                        monitor_conf_monitor[monitor_conf_monitor.length] = {type:"cpu", status:monitor_cpu_switch, freq:monitor_cpu_freq};
                        monitor_conf_monitor[monitor_conf_monitor.length] = {type:"mem", status:monitor_mem_switch, freq:monitor_mem_freq};
                        monitor_conf_monitor[monitor_conf_monitor.length] = {type:"net", status:monitor_net_switch};
                        monitor_conf_monitor[monitor_conf_monitor.length] = {type:"hd", status:monitor_net_switch, freq:monitor_hd_freq};
                        var conf = {};
                        conf.monitor_conf = [];
                        conf.monitor_conf[0] = {node_name: node_name, monitor: monitor_conf_monitor};
                        var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                         
                        ms.send_msg('comc', 'comc_set_monitor_req',
                            {
                                nid: nid,
                                flag: 1,
                                conf: conf
                            },
                            function (type, data) {
                                if(type != "comc_set_monitor_ack"){
                                    ms.error("show","设置监测信息","未知错误");
                                }
                                if (data["result"] != "") {
                                    ms.error("show","设置监测信息失败", data["result"]);
                                } else {
                                    ms.error("show","设置监测信息", '成功');
                                }
                            });
                    };

                    comc_node_alarm_conf_set_btn.onclick = function () {
                        if (comc_node_alarm_conf_set_div.style.display != 'none') {
                            comc_node_alarm_conf_set_div.style.display = 'none';
                            return;
                        }
                        document.getElementById("server_monitor_show_div").style.display = 'none';
                        comc_hardware_monitor_info_div.style.display = 'none';
                        comc_node_monitor_conf_set_div.style.display = 'none';
                        comc_node_alarm_conf_set_div.style.display = 'block';
                        show_alarm_monitor_conf();

                        document.getElementById("alarm_phones_add_button").onclick = function () {
                            var phones = document.getElementById("alarm_phone_add_txt").value;
                             
                            if (phones == "" || phones.length == 0)return;
                            phones = JSON.parse(phones);
                            var conf = {};
                            conf.phone = phones;
                            comc_set_monitor_conf(conf, 1, function (err) {
                                if (!err) {//update phones display
                                    show_alarm_monitor_conf();
                                }
                            });
                        };

                        document.getElementById("alarm_phones_del_button").onclick = function () {
                            var phones = document.getElementById("alarm_phone_del_txt").value;
                            if (phones == "" || phones.length == 0)return;
                            phones = JSON.parse(phones);
                            var conf = {};
                            conf.phone = phones;
                            comc_set_monitor_conf(conf, -1, function (err) {
                                if (!err) {//update phones display
                                    show_alarm_monitor_conf();
                                }
                            });
                        };

                        document.getElementById("alarm_email_add_button").onclick = function () {
                            var emails = document.getElementById("alarm_email_add_txt").value;
                            if (emails == "" || emails.length == 0)return;
                            emails = JSON.parse(emails);

                            var conf = {};
                            conf.email = emails;
                            comc_set_monitor_conf(conf, 1, function (err) {
                                if (!err) {//update emails display
                                    show_alarm_monitor_conf();
                                }
                            });
                        };

                        document.getElementById("alarm_emails_del_button").onclick = function () {
                            var emails = document.getElementById("alarm_email_del_txt").value;
                            if (emails == "" || emails.length == 0)return;
                            emails = JSON.parse(emails);
                            var conf = {};
                            conf.email = emails;
                            comc_set_monitor_conf(conf, -1, function (err) {
                                if (!err) {//update emails display
                                    show_alarm_monitor_conf();
                                }
                            });
                        };

                        document.getElementById("alarm_send_switch_set").onclick = function () {
                            var alarm_send_switch = document.getElementById("alarm_send_switch").value;
                            if (alarm_send_switch != 0 && alarm_send_switch != -1 && alarm_send_switch != 1)return;
                            var conf = {};
                            conf.monitor_conf = [];
                            conf.monitor_conf.push({node_name: node_name, alarm_send:{"switch": alarm_send_switch}});
                            comc_set_monitor_conf(conf, 1, function (err) {
                                if (!err) {//update alarm_send_switch display
                                    show_alarm_monitor_conf();
                                }
                            });
                        };

                        document.getElementById("no_send_item_add_button").onclick = function () {
                            var no_send_item_add = document.getElementById("no_send_item_add_txt").value;
                            if (no_send_item_add == "" || no_send_item_add.length == 0)return;
                            no_send_item_add = JSON.parse(no_send_item_add);
                            var conf = {};
                            conf.monitor_conf = [];
                            conf.monitor_conf.push({node_name: node_name, alarm_send:{"no_send_item": no_send_item_add}});
                            comc_set_monitor_conf(conf, 1, function (err) {
                                if (!err) {//update alarm_send_item display
                                    show_alarm_monitor_conf();
                                }
                            });
                        };

                        document.getElementById("no_send_item_del_button").onclick = function () {
                            var no_send_item_del = document.getElementById("no_send_item_del_txt").value;
                            if (no_send_item_del == "" || no_send_item_del.length == 0)return;
                            no_send_item_del = JSON.parse(no_send_item_del);
                            var conf = {};
                            conf.monitor_conf = [];
                            conf.monitor_conf.push({node_name: node_name, alarm_send:{"no_send_item": no_send_item_del}});
                            comc_set_monitor_conf(conf, -1, function (err) {
                                if (!err) {//update alarm_send_item display
                                    show_alarm_monitor_conf();
                                }
                            });
                        };

                        document.getElementById("alarm_monitor_item_add_button").onclick = function () {
                            var alarm_item_add_name = document.getElementById("alarm_item_add_name").value;
                            var alarm_item_add_switch = document.getElementById("alarm_item_add_switch").value;
                            var alarm_item_add_span = document.getElementById("alarm_item_add_span").value;
                            var alarm_item_add_sfreq = document.getElementById("alarm_item_add_sfreq").value;
                            var alarm_item_add_dfreq = document.getElementById("alarm_item_add_dfreq").value;
                            if(alarm_item_add_name == "" || alarm_item_add_switch == "" || alarm_item_add_span == "" ||
                                alarm_item_add_sfreq == "" || alarm_item_add_dfreq == "") {
                                alert("请重新输入报警监测项目信息");
                                return;
                            }
                            var item = {};
                            item.alarm_name = alarm_item_add_name;
                            item.stat = alarm_item_add_switch;
                            item.value = alarm_item_add_span;
                            item.freq_safe = alarm_item_add_sfreq;
                            item.freq_danger = alarm_item_add_dfreq;
                            var conf = {};
                            conf.monitor_conf = [];
                            conf.monitor_conf.push({node_name: node_name, "item": [item]});
                             
                            comc_set_monitor_conf(conf, 1, function (err) {
                                if (!err) {//update alarm_send_item display
                                    show_alarm_monitor_conf();
                                }
                            });
                        };

                        document.getElementById("alarm_item_del").onclick = function () {
                            var alarm_item_add_name = document.getElementById("alarm_item_del_txt").value;
                            if(alarm_item_add_name == "" || alarm_item_add_name.length == 0) {
                                alert("请重新输入报警监测项目名称");
                                return;
                            }
                            alarm_item_add_name = JSON.parse(alarm_item_add_name);
                             
                            var item = {};
                            item.alarm_name = alarm_item_add_name;
                            var conf = {};
                            conf.monitor_conf = [];
                            conf.monitor_conf.push({node_name: node_name, "item": [item]});
                             
                            comc_set_monitor_conf(conf, -1, function (err) {
                                if (!err) {//update alarm_send_item display
                                    show_alarm_monitor_conf();
                                }
                            });
                        };
                    };
                    function show_alarm_monitor_conf() {
                        var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                         
                        ms.send_msg('comc', 'comc_get_monitor_req',
                            {
                                nid: nid,
                                filter: 'node_' + node_name
                            },
                            function (type, data) {
                                if(type != "comc_get_monitor_ack"){
                                    ms.error("show","获取报警监测信息","未知错误");
                                }

                                if (data["result"] != "") {
                                    ms.error("show","获取报警监测信息", data["result"]);
                                } else {
                                    ms.error("show","获取报警监测信息", '成功');
                                    show_monitor_conf(comc_alarm_phones_exist_div,comc_alarm_emails_exist_div,comc_no_send_item_exist_div,
                                        comc_alarm_item_exist_div, comc_alarm_send_switch, data["conf"]);
                                }
                            }
                        );
                    }

                    function comc_set_monitor_conf(conf, flag, handle) {
                        var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                        ms.send_msg('comc', 'comc_set_monitor_req',
                            {
                                nid: nid,
                                flag: flag,
                                conf: conf
                            },
                            function (type, data) { 
                                if(type != "comc_set_monitor_ack"){
                                    ms.error("show","设置监测信息","未知错误");
                                }
                                 
                                if (data["result"] != "") {
                                    ms.error("show","设置监测信息失败", data["result"]);
                                    handle(data["result"]);
                                } else {
                                    ms.error("show","设置监测信息", '成功');
                                    handle('');
                                }
                            });
                    }


                    document.getElementById("cpu_monitor_log_button").onclick = function () {
                        monitor_button_handle('cpu');
                    };

                    document.getElementById("mem_monitor_log_button").onclick = function () {
                        monitor_button_handle('mem');
                    };
                    document.getElementById("hd_monitor_log_button").onclick = function () {
                        monitor_button_handle('hd');
                    };
                    document.getElementById("net_monitor_log_button").onclick = function () {
                        monitor_button_handle('net');
                    };

                    function show_monitor_log_status(conf) {
                        var monitor_conf = '';
                        if (conf.monitor_conf != undefined && conf.monitor_conf.length > 0) {
                            monitor_conf = conf.monitor_conf[0];
                        }
                        var monitor_conf_monitor = monitor_conf.monitor || [];//[]
                        for (var i = 0 ; i < monitor_conf_monitor.length; i++) {
                            if (monitor_conf_monitor[i].type == "cpu") {
                                if (1 == monitor_conf_monitor[i].status) {
                                    document.getElementById("cpu_monitor_status_text").value = 'Start';
                                } else {
                                    document.getElementById("cpu_monitor_status_text").value = 'Stop';
                                }
                            } else if (monitor_conf_monitor[i].type == "mem") {
                                if (1 == monitor_conf_monitor[i].status) {
                                    document.getElementById("mem_monitor_status_text").value = 'Start';
                                } else {
                                    document.getElementById("mem_monitor_status_text").value = 'Stop';
                                }
                            } else if (monitor_conf_monitor[i].type == "net") {
                                if (1 == monitor_conf_monitor[i].status) {
                                    document.getElementById("net_monitor_status_text").value = 'Start';
                                } else {
                                    document.getElementById("net_monitor_status_text").value = 'Stop';
                                }
                            } else if (monitor_conf_monitor[i].type == "hd") {
                                if (1 == monitor_conf_monitor[i].status) {
                                    document.getElementById("hd_monitor_status_text").value = 'Start';
                                } else {
                                    document.getElementById("hd_monitor_status_text").value = 'Stop';
                                }
                            } else {
                                break;
                            }
                        }
                    }

                    function show_monitor_log_conf(conf) {
                        var monitor_conf = '';
                        var monitor_conf_monitor = [];
                        if (conf.monitor_conf != undefined) {
                            monitor_conf = conf.monitor_conf[0];
                            monitor_conf_monitor = monitor_conf.monitor || [];//[]
                        }       

                        for (var i = 0 ; i < monitor_conf_monitor.length; i++) {
                            if (monitor_conf_monitor[i].type == "cpu") {
                                document.getElementById("monitor_cpu_switch").value = monitor_conf_monitor[i].status;
                                document.getElementById("monitor_cpu_freq").value = monitor_conf_monitor[i].freq;
                            } else if (monitor_conf_monitor[i].type == "mem") {
                                document.getElementById("monitor_mem_switch").value = monitor_conf_monitor[i].status;
                                document.getElementById("monitor_mem_freq").value = monitor_conf_monitor[i].freq;
                            } else if (monitor_conf_monitor[i].type == "hd") {
                                document.getElementById("monitor_hd_switch").value = monitor_conf_monitor[i].status;
                                document.getElementById("monitor_hd_freq").value = monitor_conf_monitor[i].freq;
                            } else if (monitor_conf_monitor[i].type == "net") {
                                document.getElementById("monitor_net_switch").value = monitor_conf_monitor[i].status;
                                // document.getElementById("monitor_net_freq").value = monitor_conf_monitor[i].freq;
                            } else {
                                break;
                            }
                        }
                    }

                    function show_monitor_conf(phone_div, email_div, filter_div, alarm_item_div, alarm_switch, conf) {
                        phone_div.innerHTML = '';
                        email_div.innerHTML = '';
                        filter_div.innerHTML = '';
                        alarm_item_div.innerHTML = '';
                        alarm_switch.innerHTML = '';

                        phone_div.innerHTML = "[";
                        if (conf["phone"] != undefined) {
                            for (var i = 0; i < conf["phone"].length; i++) {
                                phone_div.innerHTML += conf["phone"][i] + ",&nbsp;";
                            }
                        }
                        phone_div.innerHTML += "]";
                        phone_div.innerHTML += '</br>';

                        email_div.innerHTML = "[";
                        if (conf["email"] != undefined) {
                            for (var i = 0; i < conf["email"].length; i++) {
                                email_div.innerHTML += conf["email"][i] + ",&nbsp;";
                            }
                        }
                        email_div.innerHTML += "]";
                        email_div.innerHTML += '</br>';

                        filter_div.innerHTML = "[";
                        if (conf["monitor_conf"] != undefined && conf["monitor_conf"][0]["alarm_send"] != undefined && conf["monitor_conf"][0]["alarm_send"]["no_send_item"] != undefined) {
                            for (var i = 0; i < conf["monitor_conf"][0]["alarm_send"]["no_send_item"].length; i++) {
                                filter_div.innerHTML += conf["monitor_conf"][0]["alarm_send"]["no_send_item"][i] + ",&nbsp;";
                            }
                        }
                        filter_div.innerHTML += "]";
                        filter_div.innerHTML += '</br>';

                        alarm_item_div.innerHTML = "[";
                        if (conf["monitor_conf"] != undefined && conf["monitor_conf"][0]["item"] != undefined) {
                            for (var i = 0; i < conf["monitor_conf"][0]["item"].length; i++) {
                                var item_data = conf["monitor_conf"][0]["item"][i];
                                alarm_item_div.innerHTML += ' {';
                                for (var name in item_data) {
                                    alarm_item_div.innerHTML += name +":" + item_data[name] + ",&nbsp;";
                                }
                                alarm_item_div.innerHTML += '},</br>';
                            }
                        }
                        alarm_item_div.innerHTML += "]";
                        alarm_item_div.innerHTML += '</br>';

                        if (conf["monitor_conf"] != undefined && conf["monitor_conf"][0]["alarm_send"] != undefined) {
                            alarm_switch.value = conf["monitor_conf"][0]["alarm_send"]["switch"];
                        }
                    }
                }

                node_page(node_name);
                
                node_event();
            }
            function  node_event() {
                document.getElementById("node_back_to_home").onclick = function () {
                    // var monitor_alarm_div = document.getElementById("monitor_management_div");
                    // comc_get_node_list_class(monitor_alarm_div);
                    //comc_get_monitor_nodes_div.style.visibility="hidden";//隐藏
                    comc_go_back_home.style="display:block;";
                    document.getElementById("show_node_list_div").style="display:block;";
                    document.getElementById("comc_node_monitor_log_div").style="display:none;";
                    document.getElementById("server_monitor_show_div").style="display:none;";
                };
            }
            function monitor_button_handle(select_type) {
                var server_monitor_show_div = document.getElementById("server_monitor_show_div");
                server_monitor_show_div.style = "display:block;";
                server_monitor_show_div.innerHTML = '<p id="server_monitor_show_p">' +
                    '<button name="lookup_monitor_button" value="hours">按小时查看</button>&nbsp;&nbsp;' +
                    '<button name="lookup_monitor_button" value="day">按天查看</button>&nbsp;&nbsp;' +
                    '<button name="lookup_monitor_button" value="week">按周查看</button>&nbsp;&nbsp;' +
                    '<button name="lookup_monitor_button" value="month">按月查看</button>&nbsp;&nbsp;' +
                    '</p>' +
                    '</br>' +
                    '<div id="server_monitor_chart_div" style="padding:10px" ></div>' +
                    '</br>';
                var server_monitor_show_p = document.getElementById("server_monitor_show_p");
                var server_monitor_chart_div = document.getElementById("server_monitor_chart_div");

                var show_data = show_date();
                show_data.create(server_monitor_show_p);
                var select_date = show_data.getday(); 
                if (select_date != null) { 
                    var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                    ms.send_msg('comc', 'comc_get_monitor_log_req',
                        {
                            nid: nid,
                            type: select_type,
                            node: node_name,
                            span: 'hours',
                            start: select_date
                        },
                        function (type, data) {
                            if(type != "comc_get_monitor_log_ack"){
                                ms.error("show","获取"+select_type+"的监测信息","未知错误");
                                return;
                            } 
                            ms.error("show", "获取"+select_type+"的监测信息", data["result"]);
                            show_chart(server_monitor_chart_div, select_type, data["monitor_info"]||[], 'hours');
                        });
                }

                var lookup_monitor_button = document.getElementsByName("lookup_monitor_button");
                for (var i = 0; i < lookup_monitor_button.length; i++) {
                    lookup_monitor_button[i].onclick = function () {
                        var select_date = show_data.getday();
                        if (select_date == null) return;
                        var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                        var span = this.value;

                        ms.send_msg('comc', 'comc_get_monitor_log_req',
                            {
                                nid: nid,
                                type: select_type,
                                node: node_name,
                                span: span,
                                start: select_date
                            },
                             function (type, data) {
                                    if(type != "comc_get_monitor_log_ack"){
                                        ms.error("show","获取"+select_type+"的监测信息","未知错误");
                                    }
                                 ms.error("show","获取"+select_type+"的监测信息",data["result"]);
                                 show_chart(server_monitor_chart_div, select_type, data["monitor_info"], span);
                             });


                    }
                }
            }
            function show_date() {
                var now_date = new Date();

                function select_selected(select, value) {
                    var all_options = select.options;
                    for (var i = 0; i < all_options.length; i++) {
                        if (all_options[i].value == value)
                            all_options[i].selected = true;
                    }
                }

                this.create = function (father) {
                    var now_year = now_date.getFullYear(),
                        now_month = now_date.getMonth() + 1,
                        now_day = now_date.getDate(),
                        now_hours = now_date.getHours();
                    father.innerHTML += '<select id="show_year_select"></select>' +
                        '<select id="show_month_select"></select>' +
                        '<select id="show_day_select"></select>' +
                        '<select id="show_hours_select"></select>&nbsp;&nbsp;';
                    var show_year_select = document.getElementById("show_year_select"),
                        show_month_select = document.getElementById("show_month_select"),
                        show_day_select = document.getElementById("show_day_select"),
                        show_hours_select = document.getElementById("show_hours_select");
                    var i;
                    var option;
                    for (i = 2016; i <= now_year; i++) {
                        option = document.createElement("option");
                        option.type = "radio";
                        option.value = i;
                        option.innerHTML = i;
                        show_year_select.appendChild(option);
                    }
                    select_selected(show_year_select, now_year);

                    for (i = 1; i <= 12; i++) {
                        option = document.createElement("option");
                        option.type = "radio";
                        option.value = i;
                        option.innerHTML = i + '月';
                        show_month_select.appendChild(option);
                    }
                    select_selected(show_month_select, now_month);

                    show_day(now_year, now_month);
                    select_selected(show_day_select, now_day);

                    for (i = 0; i < 24; i++) {
                        option = document.createElement("option");
                        option.type = "radio";
                        option.value = i;
                        option.innerHTML = i + ':00';
                        show_hours_select.appendChild(option);
                    }
                    select_selected(show_hours_select, now_hours);

                    show_year_select.onchange = function () {
                        var year = this.value,
                            month = show_month_select.value;
                        if (year != 'null' && month != 'null')
                            show_day(year, month);
                    };

                    show_month_select.onchange = function () {
                        var year = show_year_select.value,
                            month = this.value;
                        if (year != 'null' && month != 'null')
                            show_day(year, month);
                    };

                    function show_day(year, month) {
                        var max_day;
                        if (month == 2) {
                            if ((0 == year % 4 && ((year % 100 != 0) || (year % 400 == 0)))) {
                                max_day = 29;
                            } else {
                                max_day = 28;
                            }
                        } else {
                            if (month <= 7) {
                                if (month % 2 == 0) {
                                    max_day = 30;
                                } else {
                                    max_day = 31;
                                }
                            } else {
                                if (month % 2 == 0) {
                                    max_day = 31;
                                } else {
                                    max_day = 30;
                                }
                            }
                        }
                        show_day_select.innerHTML = '';
                        for (var i = 1; i <= max_day; i++) {
                            option = document.createElement("option");
                            option.type = "radio";
                            option.value = i;
                            option.innerHTML = i + '日';
                            show_day_select.appendChild(option);
                        }
                    }

                };

                this.getday = function () {
                    var show_year_select = document.getElementById("show_year_select"),
                        show_month_select = document.getElementById("show_month_select"),
                        show_day_select = document.getElementById("show_day_select"),
                        show_hours_select = document.getElementById("show_hours_select");
                    var year = show_year_select.value,
                        month = show_month_select.value,
                        day = show_day_select.value,
                        hours = show_hours_select.value;
                    var new_data = new Date(),
                        select_data = new Date(year + '/' + month + '/' + day);
                    select_data.setHours(hours);
                    if (new_data < select_data) {
                        alert("请选择正确的时间！");
                        return null;
                    } else {
                        return '' + year + (month < 10 ? '0' + month : month) + (day < 10 ? '0' + day : day) + (hours < 10 ? '0' + hours : hours);
                    }
                };

                return this;
            }
            function time_handle(time){
                var time_int=parseInt(time);
                var H=parseInt(time_int/100),
                    M=time_int%100;
                return (H<10? '0'+H : H)+':'+(M<10? '0'+M : M);
            }
            function show_chart(div, title, monitor_info,span) {
                // if (monitor_info == undefined || monitor_info.length == 0) return;
                div.style.height = "480px";
                var chart = echarts.init(div);
                var option = {
                    title: {
                        text: title
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: []
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            dataZoom: {},
                            dataView: {readOnly: false},
                            magicType: {type: ['line', 'bar']},
                            restore: {},
                            saveAsImage: {}
                        }
                    },
                    grid:{y2:'20%'},
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: [],
                            axisLabel:{
                                rotate:-45
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            axisLabel: {
                                formatter:title == 'net'? '{value} b' : '{value} %'
                            }
                        }
                    ],
                    series: []
                };

                var legend_data = [];
                var series = [];
                var xAxis_data = [];

                for(var n=0; monitor_info != undefined && n< monitor_info.length; n++){
                    var array=JSON.parse(monitor_info[n].value);
                    var get_date=monitor_info[n].date;
                    if(n == 0){
                        var array_last=JSON.parse(monitor_info[monitor_info.length-1].value);
                        var data_last=array_last[array_last.length-1];
                        for (var legend in data_last) {
                            if (legend == 'time') continue;
                            if (data_last[legend] == undefined || data_last[legend].length == 0) continue;

                            legend_data[legend_data.length] = legend;
                            series[series.length] = {
                                name: legend,
                                type: 'line',
                                data: [],
                                markPoint: {
                                    data: [
                                        {type: 'max', name: '最大值'},
                                        {type: 'min', name: '最小值'}
                                    ]
                                },
                                markLine: {
                                    data: [
                                        {type: 'average', name: '平均值'}
                                    ]
                                }
                            };
                        }
                    }

                    for (var i = 0; i < array.length; i++) {
                        var k=xAxis_data.length;
                        for (var data_list in array[i]) {
                            if (data_list == 'time') {
                                xAxis_data[k] = (span == 'month'|| span == 'week')? get_date+'-'+time_handle(array[i]["time"]) : time_handle(array[i]["time"]);
                            } else {
                                for (var j = 0; j < series.length; j++) {
                                    if (series[j].name == data_list) {
                                        if(array[i][data_list] < 0){
                                            array[i][data_list]=array[i-1][data_list];
                                        }
                                        series[j].data[k]=array[i][data_list];
                                        break;
                                    }
                                }
                            }
                        }
                        for(j = 0; j < series.length; j++){
                            if(series[j].data[k] == undefined || series[j].data[k] == null){
                                series[j].data[k]='';
                            }
                        }
                    }
                }

                option.legend["data"] = legend_data;
                option.xAxis[0]["data"] = xAxis_data;
                option.series = series;
                chart.setOption(option);
            }
        }

        function server_info(div) {
            div.innerHTML = '<div id="server_info">' +
                '<center><a  class="message_box" id="set_server_info_stats_button"  value="0">设置统计条件</a>&nbsp;&nbsp;' +
                '<a  class="message_box" id="get_server_info_button"  value=0 >服务器信息</a></center><br>' +
                '<div id="server_info_stats_div"></div>' +
                '<div id="server_info_stats_div"></div>' +
                '<div id="server_info_div"></div>' +
                '</div>';
            document.getElementById("set_server_info_stats_button").onclick=function(){
                var set_server_info_stats_div=document.getElementById("server_info_stats_div");
                if (this.value == undefined) {
                    this.value=0;
                }
                if(this.value == 0){
                    set_server_info_stats_class(set_server_info_stats_div);
                    this.value=1;
                }else{
                    this.value=0;
                    set_server_info_stats_div.innerHTML='';
                }
            };
            document.getElementById("get_server_info_button").onclick=function(){
                var server_info_div=document.getElementById("server_info_div");
                if (this.value == undefined) {
                    this.value=0;
                }
                if(this.value == 0){
                    get_server_info(server_info_div);
                    this.value=1;
                }else{
                    this.value=0;
                    server_info_div.innerHTML='';
                }
            };
            function set_server_info_stats_class(div){
                div.innerHTML= '<div id="server_info_stats_show_div"></div>' +
                    '<center><p>name：<input type="text" id="set_server_info_stats_name_text"/>&nbsp;&nbsp;&nbsp;&nbsp;value：<input type="text" id="set_server_info_stats_value_text" style="width:500px"/>&nbsp;例如：name：us value：["美国","中国"]</p></center>' +
                    '&nbsp;&nbsp; <center> <a  class="message_box" id="set_server_info_stats_del_button"  value="0">消除</a>'+
                    '&nbsp;&nbsp; <a  class="message_box" id="set_server_info_stats_confirm_button"  value="0">设置</a></center><br/>';
                var server_info_stats_show_div=document.getElementById("server_info_stats_show_div");
                var set_server_info_stats_confirm_button = document.getElementById("set_server_info_stats_confirm_button");
                var count_conf=[];
                var count_conf_set=[];
                var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
                comc_get_server_basic_info_count_req();
                function comc_get_server_basic_info_count_req() {
                    ms.send_msg('comc', 'comc_get_server_basic_info_count_req', {nid: nid}, function (type, data) {
                        set_server_info_stats_confirm_button.disabled = false;
                        if (type != 'comc_get_server_basic_info_count_ack') {
                            ms.error("show", "获取统计条件", "未知错误");
                            return;
                        }
                        if ("" == data["result"]) {
                            ms.error("show", "获取统计条件", '成功');
                            count_conf = data["count_conf"];
                            if (count_conf == undefined || count_conf.length == 0) {
                                count_conf = [];
                            }
                            show_paths();
                            return;
                        } else {
                            ms.error("show", "获取统计条件", data["result"]);
                        }
                    });
                }
                function show_paths(){
                    server_info_stats_show_div.innerHTML='';
                    for(var i=0; i<count_conf.length; i++){
                        server_info_stats_show_div.innerHTML+='<center><p>' +
                            '<input type="checkbox" name="server_info_stats_checkbox" value="'+count_conf[i]["name"]+'"/> &nbsp;' +
                            'name：'+count_conf[i]["name"]+'&nbsp;&nbsp;&nbsp;value：'+count_conf[i]["value"]+
                            '</p></center>';
                    }
                }
                document.getElementById("set_server_info_stats_del_button").onclick=function(){
                    var checkbox=document.getElementsByName("server_info_stats_checkbox");
                    var counts=[];
                    for(var i=0; i<checkbox.length; i++){
                        if(checkbox[i].checked){
                            counts.push({name:checkbox[i].value});
                        }
                    }
                    var nid = create_nid( 2, login_data.lid, 5,login_data.share_key );
                    ms.send_msg('comc','comc_set_server_basic_info_count_req',{nid:nid,count_conf:counts},function(type, data) {
                        if(type != "comc_set_server_basic_info_count_ack") {
                            ms.error("show", "消除统计条件", "未知错误");
                            return;
                        }
                        if (data.result == "") {
                            ms.error("show", "消除统计条件", '成功');
                            comc_get_server_basic_info_count_req();
                        } else {
                            ms.error("show", "消除统计条件", data["result"]);
                        }
                    });
                };

                set_server_info_stats_confirm_button.onclick = function(){
                    var name=document.getElementById("set_server_info_stats_name_text").value,
                        value=document.getElementById("set_server_info_stats_value_text").value;
                    if (name.length == 0 || name == undefined || value.length == 0 || value == undefined)
                        return;
                    count_conf_set={name:name,value:JSON.parse(value)};
                    var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
                    ms.send_msg('comc','comc_set_server_basic_info_count_req',{nid:nid,count_conf:count_conf_set},function(type, data){
                        if (type != "comc_set_server_basic_info_count_ack") {
                            ms.error("show", "设置统计条件", '未知错误');
                            return;
                        }

                        if (data.result == "") {
                            ms.error("show", "设置统计条件", '成功');
                            comc_get_server_basic_info_count_req();
                        } else {
                            ms.error("show", "设置统计条件", data["result"]);
                        }
                    });
                }
            }
            function get_server_info(div) {
                div.innerHTML= '<div id="wait_div"><center> <p>正在抓取数据，请稍后。。。</p></center> </div>' +'<div id="server_button_div"></div>' +
                    '<div id="count_show_div"></div>' +
                    '<div id="ccms_server_info_show_div"></div>'+
                    '<div id="cmipcgw_server_info_show_div"></div>';
                var count_show_div=document.getElementById("count_show_div");
                var wait_div=document.getElementById("wait_div");
                var ccms_server_info_show_div=document.getElementById("ccms_server_info_show_div");
                var cmipcgw_server_info_show_div=document.getElementById("cmipcgw_server_info_show_div");
                var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
                ms.send_msg('comc', 'comc_get_server_basic_info_req', {nid: nid}, function (type, data) {
                    wait_div.innerHTML='';
                    if (type != 'comc_get_server_basic_info_ack')
                        return;
                    if (data.result== "") {
                        /*   var tmp = document.createElement("div");
                         tmp.innerHTML +='服务器信息<br>';
                         tmp.innerHTML += '<textarea name="textfield3" cols="150" rows="300" id="data_text_ack"></textarea>';
                         document.getElementById("server_info_div").appendChild(tmp);
                         document.getElementById("data_text_ack").value=JSON.stringify(data);*/
                        //  console.log(JSON.stringify(data));
                        show_server_info(data);
                    } else {
                    }
                });
                function show_server_info(data) {
                    var server_button_div = document.getElementById("server_button_div");
                    if (server_button_div == null)return;
                    server_button_div.innerHTML= ' <center><a  class="message_box" id="counts_button"  value="0">统计</a>'+
                        '&nbsp;&nbsp; <a  class="message_box" id="ccms_server_info_button"  value="0">媒体服务器</a>'+
                        '&nbsp;&nbsp; <a  class="message_box" id="cpimcgw_server_info_button"  value="0">信令服务器</a></center><br/>';
                    document.getElementById("counts_button").onclick=function(){
                        var set_server_info_stats_div=document.getElementById("count_show_div");
                        if (this.value == undefined) {
                            this.value=0;
                        }
                        if(this.value == 0){
                            count_show(data.count);
                            this.value=1;
                        }else{
                            this.value=0;
                            set_server_info_stats_div.innerHTML='';
                        }
                    };
                    document.getElementById("ccms_server_info_button").onclick=function(){
                        var set_server_info_stats_div=document.getElementById("ccms_server_info_show_div");
                        if (this.value == undefined) {
                            this.value=0;
                        }
                        if(this.value == 0){
                            ccms_server_info_show(data.ccms_server_info);
                            this.value=1;
                        }else{
                            this.value=0;
                            set_server_info_stats_div.innerHTML='';
                        }
                    };
                    document.getElementById("cpimcgw_server_info_button").onclick=function(){
                        var set_server_info_stats_div=document.getElementById("cmipcgw_server_info_show_div");
                        if (this.value == undefined) {
                            this.value=0;
                        }
                        if(this.value == 0){
                            cmipcgw_server_info_show(data.cmipcgw_server_info);
                            this.value=1;
                        }else{
                            this.value=0;
                            set_server_info_stats_div.innerHTML='';
                        }
                    };
                    /*//  count_show(data.count);
                     ccms_server_info_show(data.ccms_server_info);
                     cmipcgw_server_info_show(data.cmipcgw_server_info);*/
                }
                function count_show(count){ 
                    var value_data;
                    var value_obj = {};

                    count_show_div.innerHTML='';
                    count_show_div.innerHTML+='<p>' +
                        '&nbsp;&nbsp;name' + '&nbsp;&nbsp;&nbsp;' + "user" + '&nbsp;&nbsp;&nbsp;'+ "device"+
                        '</p>';
                    for(var i = 0; count !=undefined && i < count.length; i++){
                        value_data = count[i]["value"];
                        if (count[i]["name"] != "undefined") {
                            value_obj = JSON.parse(value_data);
                        }
                        if (count[i]["name"] == "undefined") {
                            count_show_div.innerHTML+='<p>' +
                                '--------------------------------------------------------------------' +
                                '</p>';
                        } else {
                            count_show_div.innerHTML+='<p>' +
                                '&nbsp;&nbsp;' + count[i]["name"] + '&nbsp;&nbsp;&nbsp;' + value_obj["user"] + '&nbsp;&nbsp;&nbsp;'+ value_obj["device"]+
                                '</p>';
                        }
                    }
                }
                function ccms_server_info_show(ccms_server){
                    ccms_server_info_show_div.innerHTML='';
                    for(var i=0; i<ccms_server.host.length; i++){
                        var data=JSON.parse(ccms_server.host[i]);
                        ccms_server_info_show_div.innerHTML+='<p>' +
                            'id：'+data["id"]+'&nbsp;&nbsp;status：'+data["status"]+'&nbsp;&nbsp;mrss_status：'+data["mrss_status"]+
                            '</p>';
                    }
                }
                function cmipcgw_server_info_show(cmipcgw_server){
                    cmipcgw_server_info_show_div.innerHTML='';

                    for(var i=0; cmipcgw_server.host != undefined && i<cmipcgw_server.host.length; i++){
                        var data=JSON.parse(cmipcgw_server.host[i]);
                        if (data.uptime == undefined || data.uptime== "") {
                            cmipcgw_server_info_show_div.innerHTML += '<p>' +
                                'host：' + data["host"] + '&nbsp;id：' + data["id"] + '&nbsp;http：' + data["http"] + '&nbsp;binnet：' + data["binnet"] + '&nbsp;status：' + data["status"] +
                                '&nbsp;mrss_status：' + data["mrss_status"] + '&nbsp;status_sec：' + data["status_sec"] +
                                '</p>';
                        } else {
                            cmipcgw_server_info_show_div.innerHTML += '<p>' +
                                'host：' + data["host"] + '&nbsp;id：' + data["id"] + '&nbsp;http：' + data["http"] + '&nbsp;binnet：' + data["binnet"] + '&nbsp;status：' + data["status"] +
                                '&nbsp;mrss_status：' + data["mrss_status"] + '&nbsp;status_sec：' + data["status_sec"] +'<br/>uptime：' + data["uptime"] +
                                '&nbsp;sync_cgmq_flag_success：' + data["sync_cgmq_flag_success"] +'&nbsp;apns_login_counts：' + data["apns_login_counts"] +'&nbsp;apns_cb_counts：' + data["apns_cb_counts"] +
                                '&nbsp;user：' + data["user"] + '&nbsp;device_online：' + data["device_online"] + '<br/>loc_user：' + JSON.stringify(data["loc_user"]) + '<br/>loc_device：' +
                                JSON.stringify(data["loc_device"]) +
                                '</p>';
                        }
                    }
                }
            }
        }

        function account_management(div) {
            option_page_div.style = "display:none;";
            div.innerHTML = '<div id="account_management_button_div">'+
                '<center><a  class="message_box" id="account_button"  value="0">用户</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                '<a  class="message_box" id="admin_password_button"  value=0 >管理员密码</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                '</center><br>' +
                '</div>' +
                '<div id="user_div"></div>' +
                '<div id="set_password_button_div"  style="display: "">'+
                //  '<center><button id="set_password">设置管理员密码</button></center>'+
                '</div>' +
                '<div id="set_passworld_div"></div>' ;

            var user_div = document.getElementById("user_div");
            var set_password_button_div = document.getElementById("set_password_button_div");
            var account_button = document.getElementById("account_button");
            var admin_password_button = document.getElementById("admin_password_button");
            var user_list = [];
            var power_data = [];
            if (own_power_list["admin"] == undefined || own_power_list["admin"] != 3) {
                document.getElementById("set_password_button_div").style = "display:none;";
            }

            account_button.onclick=function(){
                if (this.value== undefined) {
                    this.value = 0
                }
                if(this.value == 0){
                    set_password_button_div.innerHTML='';
                    admin_password_button.value=0;
                    user_page();
                    this.value=1;
                }else{
                    this.value=0;
                    user_div.innerHTML='';
                }
            };
            admin_password_button.onclick=function(){
                if (this.value == undefined) {
                    this.value = 0
                }
                if(this.value == 0){
                    user_div.innerHTML='';
                    account_button.value=0; 
                    admin_password_page();
                    this.value=1;
                }else{
                    this.value=0;
                    set_password_button_div.innerHTML='';
                }
            };
            function user_page() {
                user_div.innerHTML+= '<div id="user_list_show_div"></div>' +
                    '<div id="power_list_show_div"></div>'+
                    '<center><p>name：<input type="text" id="set_user_name_text"/>&nbsp;&nbsp;&nbsp;&nbsp;</p>' +
                    '<button id="show_user_power_button">展开用户权限列表</button>&nbsp;&nbsp;'+
                    '<button id="del_user_power_button">收起用户权限列表</button>&nbsp;&nbsp;'+
                    '<button id="del_user_name_button" disabled>删除用户</button>&nbsp;&nbsp; '+
                    '<button id="set_user_name_button" disabled>添加用户</button></center><br/>';
                var set_user_name_button = document.getElementById("set_user_name_button");
                var del_user_name_button = document.getElementById("del_user_name_button");
                var show_user_power_button = document.getElementById("show_user_power_button");
                var del_user_power_button = document.getElementById("del_user_power_button");
                var user_list_show_div = document.getElementById("user_list_show_div");
                var power_list_show_div = document.getElementById("power_list_show_div");

                document.getElementById("del_user_name_button").onclick=function(){
                    var checkbox = document.getElementsByName("user_name_checkbox");
                    var name;
                    for(var i=0; i< checkbox.length; i++){
                        if(checkbox[i].checked){
                            name = checkbox[i].value;
                        }
                    }
                    if (name == "" || name == undefined) {
                        alert("请选择用户名");
                        return;
                    }

                    var auth_all={};
                    auth_all.user=name;
                    auth_all.auth= [{itme:"look_auth", level:13}];
                    var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
                    ms.send_msg('comc','comc_set_auth_req',{nid:nid,auth_all:auth_all},function(type, data) {
                        if (data.result == "") {
                            ms.error("show", "删除用户", '成功');
                            get_user_listreq();
                        } else {
                            ms.error("show", "删除用户", data.result);
                        }
                    });
                };
                document.getElementById("set_user_name_button").onclick=function(){
                    var username = document.getElementById("set_user_name_text").value;
                    if (username == "" || username == undefined) {
                        alert("请输入用户名");
                        return;
                    }
                    var auth_all={user: username, auth:[{itme:"look_auth", level:1}]};
                    auth_all.user=document.getElementById("set_user_name_text").value;
                    auth_all.auth= [{itme:"look_auth",level:1}];
                    var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
                    ms.send_msg('comc','comc_set_auth_req',{nid:nid,auth_all:auth_all},function(type, data) {
                        if (data.result == "") {
                            ms.error("show", "添加用户", '成功');
                            get_user_listreq();
                        } else {
                            ms.error("show", "添加用户", data.result);
                        }
                    });
                };
                document.getElementById("del_user_power_button").onclick=function(){
                    power_list_show_div.innerHTML = '';
                };
                document.getElementById("show_user_power_button").onclick=function() {
                    show_user_power();
                };
                get_user_listreq();
                function get_user_listreq() {
                    var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                    ms.send_msg('comc', 'comc_get_auth_req', {nid: nid, flag: 0}, function (type, data) {
                        set_user_name_button.disabled = false;
                        if (own_power_list["admin"] != undefined && own_power_list["admin"] == 3) {
                            del_user_name_button.disabled = false;
                        }
                        if (type != 'comc_get_auth_ack') {
                            ms.error("show", "获取用户列表", '未知错误');
                            return;
                        }

                        user_list = [];
                        if (data.auth_all == undefined) {
                            data.auth_all = [];
                        }
                        for (var i = 0; i < data.auth_all.length; i++) {
                            user_list.push(data.auth_all[i].user);
                        }
                        show_user();
                    });
                }
                function show_user() {
                    user_list_show_div.innerHTML = '';
                    user_list_show_div.innerHTML +='<center><p>用户选择</p></center>';
                    var buff="";
                    buff += '<center><p>';
                    var n = 0;
                    for (var i = 0; i < user_list.length; i++) {
                        n++;
                        buff += '<input type="radio" name="user_name_checkbox" value="' + user_list[i] + '" style="width:20px;height:20px"/> &nbsp;' +
                            user_list[i] + '&nbsp;&nbsp;';
                        if (n == 7 || i == user_list.length - 1) {
                            buff += '</p></center>';
                            if (i != user_list.length - 1) {
                                buff += '<p>';
                            }
                        }
                    }
                    user_list_show_div.innerHTML +=buff;
                }
                function show_user_power() {
                    power_list_show_div.innerHTML = '';
                    var checkbox = document.getElementsByName("user_name_checkbox");
                    var name;
                    for (var i = 0; i < checkbox.length; i++) {
                        if(checkbox[i].checked){
                            name = checkbox[i].value;
                        }
                    }
                    if (name == "" || name == undefined) {
                        alert("请选择用户名");
                        return;
                    }
                    var nid = create_nid( 2, login_data.lid, 5,login_data.share_key );
                    ms.send_msg('comc', 'comc_get_auth_req', {nid: nid, flag: 2, user:name}, function (type, data) {
                        if (type != "comc_get_auth_ack") {
                            ms.error("show", "获取用户权限列表", '未知错误');
                            return;
                        }
                        if (data.result == "") {
                            ms.error("show", "获取用户权限列表", '成功');
                            power_data = [];
                            power_list_show_div.innerHTML += '<br><center><p>*****************权限列表*******************</p></center></br>';
                            var buff_all = '<center>';
                            if (own_power_list["admin"] != undefined && own_power_list["admin"] == 3) {
                                for (var k in power_list.confcenter) {
                                    var flag =0;
                                    for (var i = 0; i < data.auth_all[0].auth.length; i++) {
                                        if (data.auth_all[0].auth[i].itme == k) {
                                            flag = 1;
                                            break;
                                        }
                                    }
                                    if (flag == 1) {
                                        var buff = "";
                                        buff += k + '<select id="' + k + '" >';
                                        buff += '<option >' + instead_auth_list[data.auth_all[0].auth[i].level] + '</option>';
                                        for (var j = 0; j < 3; j++) {
                                            if (j != data.auth_all[0].auth[i].level) {
                                                buff += '<option >' + instead_auth_list[j] + '</option>';
                                            }
                                        }
                                        buff += '</select>&nbsp;&nbsp;';
                                        buff_all += buff;
                                    } else {
                                        buff_all += k + '<select id="'+k+'"> <option>'+instead_auth_list[0]+'</option><option>'+instead_auth_list[1]+'</option> <option>'+instead_auth_list[2]+'</option> </select>&nbsp;&nbsp;';
                                    }
                                    power_data.push(k);
                                }
                            } else {
                                for (var k in own_power_list) {
                                    var flag =0;
                                    for (var i = 0; i < data.auth_all[0].auth.length; i++) {
                                        if (data.auth_all[0].auth[i].itme == k) {
                                            flag = 1;
                                            break;
                                        }
                                    }
                                    if (flag == 1) {
                                        if (own_power_list[k] == 2 && own_power_list[k]>data.auth_all[0].auth[i].level) {
                                            var buff = "";
                                            buff += k + '<select id="' + k + '" >';
                                            buff += '<option >' + instead_auth_list[data.auth_all[0].auth[i].level]  + '</option>';
                                            for (var j = 0; j < 3; j++) {
                                                if (j != data.auth_all[0].auth[i].level) {
                                                    buff += '<option >' +instead_auth_list[j] + '</option>';
                                                }
                                            }
                                            buff += '</select>&nbsp;&nbsp;';
                                            power_list_show_div.innerHTML += buff;
                                            power_data.push(k);
                                        }
                                    } else {
                                        if (own_power_list[k] == 2) {
                                            buff_all += k + '<select id="'+k+'"> <option>'+instead_auth_list[0]+
                                                '</option><option>'+instead_auth_list[1]+
                                                '</option> <option>'+instead_auth_list[2]+
                                                '</option> </select>&nbsp;&nbsp;';
                                            power_data.push(k);
                                        }
                                    }
                                }
                            }
                            buff_all += '</center>';
                            power_list_show_div.innerHTML +=buff_all;
                            power_list_show_div.innerHTML += '<br><center><button id="powers_set_button" name="set_power_list" value="0">设置权限</button></center></br>';
                            document.getElementById('powers_set_button').onclick = function () {
                                var checkbox = document.getElementsByName("user_name_checkbox");
                                var name;
                                var auth=[];
                                for(var i=0; i<checkbox.length; i++){
                                    if(checkbox[i].checked){
                                        name = checkbox[i].value;
                                    }
                                }

                                for (var j = 0; j < power_data.length; j++) {
                                    var data = {itme: power_data[j], level: auth_list[document.getElementById(power_data[j]).value]};
                                    auth.push(data);
                                }
                                ms.send_msg('comc', 'comc_set_auth_req', {nid: nid, auth_all:{user: name, auth: auth}}, function (type, data) {
                                    if (data.result == "") {
                                        ms.error("show", "设置权限", '成功');
                                        show_user_power();
                                    } else {
                                        ms.error("show", "设置权限", data.result);
                                    }
                                });
                            };
                        } else {
                            ms.error("show", "获取用户权限列表", data.result);
                        }
                    });
                }
            }

            function admin_password_page() {
                set_password_button_div.innerHTML = '';
                set_password_button_div.innerHTML +=
                    '<center><button id="set_password">设置管理员密码</button></center>'+
                    '<div id="set_passworld_div"></div>';
                var set_passworld_div = document.getElementById("set_passworld_div");
                document.getElementById("set_password").onclick = function() {
                    if(this.value == 0){
                        set_password();
                        this.value=1;
                    }else{
                        this.value=0;
                        set_passworld_div.innerHTML='';
                    }
                };
                function set_password() {
                    set_passworld_div.innerHTML = '';
                    set_passworld_div.innerHTML+='<center>pass：<input type="text" id="set_password_text"/>&nbsp;&nbsp;'+
                        '<select id="type_password"> <option>admin</option><option>debug</option></select>&nbsp;&nbsp;'+
                        '<button id="set_password_button">设置</button><br/>';
                    document.getElementById("set_password_button").onclick=function() {
                        var pass_type= document.getElementById("type_password").value;
                        var flag;
                        if (pass_type == "admin") {
                            flag = 0;
                        } else if (pass_type == "debug") {
                            flag = 1;
                        }
                        var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                        ms.send_msg('comc', 'comc_set_pass_req', {nid: nid, flag: flag,pass:document.getElementById("set_password_text").value}, function (type, data) {
                            if (data.result == "") {
                                alert("设置成功");
                            } else {
                                alert("设置失败：" + data.result);
                                // ms.error('show', '设置'+pass_type+'密码', data.result);
                            }
                        });
                    };
                }
                function show_user_power() {
                    power_list_show_div.innerHTML = '';
                    var checkbox=document.getElementsByName("user_name_checkbox");
                    var name;
                    for(var i=0; i<checkbox.length; i++){
                        if(checkbox[i].checked){
                            name=checkbox[i].value;
                        }
                    }
                    var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
                    ms.send_msg('comc', 'comc_get_auth_req', {nid: nid, flag: 2,user:name}, function (type, data) {
                        if (data.result == "") {
                            power_list_show_div.innerHTML +='<center>';
                            if (own_power_list["admin"] != undefined && own_power_list["admin"] == 3) {
                                for (var k in power_list.confcenter) {
                                    var flag =0;
                                    for (var i = 0; i < data.auth_all[0].auth.length; i++) {
                                        if (data.auth_all[0].auth[i].itme == k) {
                                            flag = 1;
                                            break;
                                        }
                                    }
                                    if (flag == 1) {
                                        var buff = "";
                                        buff += k + '<select id="' + k + '" >';
                                        //  document.getElementById(k).value=data.auth_all[0].auth[i].level;
                                        buff += '<option >' + data.auth_all[0].auth[i].level + '</option>';
                                        for (var j = 0; j < 3; j++) {
                                            if (j != data.auth_all[0].auth[i].level) {
                                                buff += '<option >' + j + '</option>';
                                            }
                                        }
                                        buff += '</select>&nbsp;&nbsp;';
                                        power_list_show_div.innerHTML += buff;
                                    } else {
                                        power_list_show_div.innerHTML += k + '<select id="'+k+'"> <option>0</option><option>1</option> <option>2</option> </select>&nbsp;&nbsp;';
                                    }
                                    //   power_list_show_div.innerHTML += '<input type="checkbox" id="power_' + k + '" value="' + k + '" name="' + k + '"/>' + k + '&nbsp;&nbsp;'

                                    power_data.push(k);
                                }
                            } else {
                                for (var k in own_power_list) {
                                    var flag =0;
                                    for (var i = 0; i < data.auth_all[0].auth.length; i++) {
                                        if (data.auth_all[0].auth[i].itme == k) {
                                            flag = 1;
                                            break;
                                        }
                                    }
                                    if (flag == 1) {
                                        if (own_power_list[k] == 2 && own_power_list[k]>data.auth_all[0].auth[i].level) {
                                            var buff = "";
                                            buff += k + '<select id="' + k + '" >';
                                            //  document.getElementById(k).value=data.auth_all[0].auth[i].level;
                                            buff += '<option >' + data.auth_all[0].auth[i].level + '</option>';
                                            for (var j = 0; j < 3; j++) {
                                                if (j != data.auth_all[0].auth[i].level) {
                                                    buff += '<option >' + j + '</option>';
                                                }
                                            }
                                            buff += '</select>&nbsp;&nbsp;';
                                            power_list_show_div.innerHTML += buff;
                                            power_data.push(k);
                                        }
                                    } else {
                                        if (own_power_list[k] == 2) {
                                            power_list_show_div.innerHTML +=k + '<select id="'+k+'"> <option>0</option><option>1</option> <option>2</option> </select>&nbsp;&nbsp;';
                                            power_data.push(k);
                                        }
                                    }
                                }
                            }
                            power_list_show_div.innerHTML += '</center>';
                            power_list_show_div.innerHTML += '<center><button id="powers_set_button" name="set_power_list" value="0">设置权限</button></center>';
                            document.getElementById('powers_set_button').onclick = function () {
                                var checkbox=document.getElementsByName("user_name_checkbox");
                                var name;
                                var auth=[];
                                for(var i=0; i<checkbox.length; i++){
                                    if(checkbox[i].checked){
                                        name=checkbox[i].value;
                                    }
                                }
                                for (var j=0; j<power_data.length; j++) {
                                    var data={itme:power_data[j],level: document.getElementById(power_data[j]).value}
                                    auth.push(data);
                                }
                                ms.send_msg('comc', 'comc_set_auth_req', {nid: nid, auth_all:{user:name,auth:auth}}, function (type, data) {
                                    if (data.result == "") {
                                        show_user_power();
                                    }
                                });
                            };
                        }
                    });
                }
            }

            if (own_power_list["admin"] == undefined || own_power_list["admin"] != 3) {
                document.getElementById("set_password_button_div").style="display:none;";
            }
        }

        //------------------------------------node_management-----------------------------------------------
        function node_management(div) {
            var nodes_list=[];
            var comc_nodes=[];
            var comc_subordinate_list=[];
            document.getElementById("option_page").style="display:none;";
            var node_name="刷新节点";
            div.innerHTML = '<div id="server_info">' +
                '<button id="set_node_list" value="0" style="font-size: 14px">'+node_name+'</button>&nbsp;&nbsp;' +
                '<button  id="comc_set_comp_base_conf" value="0" style="font-size: 14px">设置组件基本配置文件</button>&nbsp;&nbsp;' +
                '<button id="subordinate_list" value="0" style="font-size: 14px">从配置中心表</button>&nbsp;&nbsp;'+
                '<button id="add_subordinate" value="0" style="font-size: 14px">添加从配置中心</button>&nbsp;&nbsp;'+
                '<button id="open_node_list" value="1" style="font-size: 14px">收起/展开</button>&nbsp;&nbsp;'+
                '<button id="go_back_home" value="0" style="font-size: 14px">返回主页</button>&nbsp;&nbsp;' +
                '<button id="go_node_list" value="0" style="font-size: 14px">节点列表</button>&nbsp;&nbsp;<br>' +
                '<div class="demo_line_05">-----------------------------------------------------------------------------------------------------------------------------------</div>'+
                '<div id="comc_get_node_list_div"></div>' +
                '<div id="comc_set_comp_base_conf_div"></div>' +
                '<div id="comc_set_node_div"></div>' +
                '<div id="show_subordinate_list_div"></div>'+
                '<div id="show_node_list_div"></div>'+
                '<div id="comc_set_node_user_div"></div>'+
                '<div id="server_info_div"></div>' +
                '</div>';
            document.getElementById("set_node_list").style.background = "#99ccff";
            document.getElementById("comc_set_comp_base_conf").style.background = "#99ccff";
            document.getElementById("open_node_list").style.background = "#99ccff";
            document.getElementById("go_back_home").style.background = "#99ccff";
            document.getElementById("subordinate_list").style.background = "#99ccff";
            document.getElementById("add_subordinate").style.background = "#99ccff";
            document.getElementById("go_node_list").style.background = "#99ccff";
            var comc_get_node_list_div=document.getElementById("comc_get_node_list_div");
            var show_node_list_div=document.getElementById("show_node_list_div");
            var comc_set_node_div=document.getElementById("comc_set_node_div");
            var comc_set_node_user_div=document.getElementById("comc_set_node_user_div");
            var show_subordinate_list_div=document.getElementById("show_subordinate_list_div");
            comc_get_node_list_class(comc_get_node_list_div);

            document.getElementById("go_node_list").onclick=function(){
                if(comp_name_js[0]!="node_nece_option"){
                    comp_name_js.splice(0,0,"node_nece_option");
                }
                if(comp_name_ec[0]!="node_nece_option"){
                    comp_name_ec.splice(0,0,"node_nece_option");
                }
                node_management(div);
            };
            document.getElementById("set_node_list").onclick=function(){
                if(comp_name_js[0]!="node_nece_option"){
                    comp_name_js.splice(0,0,"node_nece_option");
                }
                if(comp_name_ec[0]!="node_nece_option"){
                    comp_name_ec.splice(0,0,"node_nece_option");
                }
                node_management(div);
            };
            document.getElementById("subordinate_list").onclick=function(){
                if(this.value == 0){
                    this.value=1;
                    var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
                    var req={nid:nid,flag:0};
                    document.getElementById("subordinate_list").style.background = "#ff99cc";
                    ms.send_msg('comc', 'comc_subordinate_list_req',req , function (type, data) {
                        if (type != 'comc_subordinate_list_ack'){
                            ms.error("show", "获取从配置中心表", "未知错误");
                            return;
                        }
                        if (data.result== "") {
                            ms.error("show", "获取从配置中心表", "成功");
                            comc_subordinate_list=data;
                            //show node list
                            show_show_subordinate_list(data);
                        } else {
                            ms.error("show", "获取从配置中心表", data.result);
                            alert(data.result);
                        }
                    });
                }else{
                    this.value=0;
                    document.getElementById("subordinate_list").style.background = "#99ccff";
                    //show_show_subordinate_list(comc_subordinate_list);
                    show_subordinate_list_div.innerHTML='';
                    div.innerHTML='';
                    node_management(div);
                    //  comc_get_node_list_class(comc_get_node_list_div);
                }
            };

            document.getElementById("add_subordinate").onclick=function(){
                if(this.value == 0){
                    this.value=1;
                    //comp_name_js.push("c_optional");
                    show_subordinate_list_div.innerHTML='';
                    document.getElementById("show_node_list_div").style="display:none;";
                    document.getElementById("add_subordinate").style.background = "#ff99cc";
                    add_subordinate();
                }else{
                    this.value=0;
                    show_subordinate_list_div.innerHTML='';
                    div.innerHTML='';
                    node_management(div);
                    document.getElementById("add_subordinate").style.background = "#99ccff";
                }
            };

            document.getElementById("comc_set_comp_base_conf").onclick=function(){
                var comc_set_comp_base_conf_div=document.getElementById("comc_set_comp_base_conf_div");
                if(this.value == 0){
                    this.value=1;
                    set_comp_base_conf_class(comc_set_comp_base_conf_div);
                    document.getElementById("comc_set_comp_base_conf").style.background = "#ff99cc";
                }else{
                    this.value=0;
                    comc_set_comp_base_conf_div.innerHTML='';
                    document.getElementById("comc_set_comp_base_conf").style.background = "#99ccff";
                    show_node_list(show_node_list_div,nodes_list);
                }
            };
            document.getElementById("open_node_list").onclick=function(){
                if(this.value == 0){
                    document.getElementById("show_node_list_div").style="display:;";
                    this.value=1;
                    document.getElementById("open_node_list").style.background = "#99ccff";
                }else{
                    this.value=0;
                    document.getElementById("show_node_list_div").style="display:none;";
                    document.getElementById("open_node_list").style.background = "#ff99cc";
                }
            };
            //--------------------------------------------------------------------------------------------------------------
            function add_subordinate(){
                show_subordinate_list_div.innerHTML+='<p>' +
                    "name:" + '<input type="text" id="subordinate_name" value=""/><br>'+
                    "简介:" + '<input type="text" id="subordinate_info" value=""/><br>'+
                    '<button id="send_to_set" value="0" style="font-size: 8px">确认</button>&nbsp;&nbsp;'+
                    '<button id="cancel_to_set" value="0" style="font-size: 8px">返回</button>&nbsp;&nbsp;'+
                    '</p>';
                document.getElementById("send_to_set").onclick = function(){
                    var name=document.getElementById("subordinate_name").value;
                    var info=document.getElementById("subordinate_info").value;
                    var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
                    var req={nid:nid,flag:1,comc:{name:name,info:info}};
                     
                    ms.send_msg('comc', 'comc_subordinate_list_req',req , function (type, data) {
                        if (type != 'comc_subordinate_list_ack'){
                            ms.error("show", "添加从配置中心表", "未知错误");
                            return;
                        }
                        if (data.result== "") {
                            ms.error("show", "添加从配置中心表", "成功");
                            alert("成功");
                        } else {
                            ms.error("show", "添加从配置中心表", data.result);
                            alert(data.result);
                        }
                    });
                };
                document.getElementById("cancel_to_set").onclick=function(){
                    show_subordinate_list_div.innerHTML='';
                    comc_get_node_list_class(comc_get_node_list_div);
                };
            }
            function show_show_subordinate_list(subordinate_data){
                document.getElementById("show_node_list_div").style="display:none;";
                show_subordinate_list_div.innerHTML='';
                var subordinates=subordinate_data.comc;
                for(var i=0;i<subordinates.length;i++){
                    show_subordinate_list_div.innerHTML += '<label id="'+subordinates[i].name +i+'" style="color: #4169E1 ;font-size: 16px "></label>&nbsp;&nbsp;';
                    document.getElementById(subordinates[i].name +i).innerHTML =subordinates[i].name;
                    show_subordinate_list_div.innerHTML +='<button id='+"set_subordinate"+i+' value="0" style="background: #99ccff ;font-size: 8px ">修改</button>&nbsp;&nbsp;';
                    show_subordinate_list_div.innerHTML +='<button id='+"del_subordinate"+i+' value="0" style="background: #99ccff ;font-size: 8px ">移除</button>&nbsp;&nbsp;<br/>';
                    show_subordinate_list_div.innerHTML += '<label id="'+subordinates[i].name+"info" +i+'" style="color: #e11414 ;font-size: 16px "></label><br/>';
                    document.getElementById(subordinates[i].name+"info" +i).innerHTML ="简介： "+subordinates[i].info;
                }
                 
                var tmp_sub={};
                for(var j=0;j<subordinates.length;j++){
                    tmp_sub["set_subordinate"+j]=subordinates[j];
                    tmp_sub["del_subordinate"+j]=subordinates[j];
                    document.getElementById("set_subordinate"+j ).onclick=function(){
                        show_subordinate_list_div.innerHTML="";
                        show_subordinate_list_div.innerHTML += '<label id="subordinates_name" style="color: #4169E1 ;font-size: 16px "></label>&nbsp;&nbsp;';
                        document.getElementById("subordinates_name").innerHTML =tmp_sub[this.id].name;
                        var name=tmp_sub[this.id].name;
                        var info=tmp_sub[this.id].info;
                        show_subordinate_list_div.innerHTML += "简介:" + '<input type="text" id="subordinate_info" value='+tmp_sub[this.id].info+'><br>'+
                            '<button id="set_subordinate" value="0" style="background: #99ccff ;font-size: 8px ">确认</button>&nbsp;&nbsp;'
                            +'<button id="back_subordinate" value="0" style="background: #99ccff ;font-size: 8px ">返回</button>&nbsp;&nbsp;';
                        document.getElementById("set_subordinate" ).onclick=function(){
                            var info=document.getElementById("subordinate_info").value;
                            var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
                            var req={nid:nid,flag:2,comc:{name:name,info:info}};
                             
                            ms.send_msg('comc', 'comc_subordinate_list_req',req , function (type, data) {
                                if (type != 'comc_subordinate_list_ack'){
                                    ms.error("show", "修改从配置中心简介", "未知错误");
                                    return;
                                }
                                if (data.result== "") {
                                    ms.error("show", "修改从配置中心简介", "成功");
                                    alert("成功");
                                } else {
                                    ms.error("show", "修改从配置中心简介", data.result);
                                    alert(data.result);
                                }
                            });
                        };

                        document.getElementById("back_subordinate" ).onclick=function(){
                            show_subordinate_list_div.innerHTML="";
                            comc_get_node_list_class(comc_get_node_list_div);
                        };
                    };

                    document.getElementById("del_subordinate"+j ).onclick=function(){
                        var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
                        var req={nid:nid,flag:3,comc:tmp_sub[this.id]};
                        ms.send_msg('comc', 'comc_subordinate_list_req',req , function (type, data) {
                            if (type != 'comc_subordinate_list_ack'){
                                ms.error("show", "移除从配置中心表", "未知错误");
                                return;
                            }
                            if (data.result== "") {
                                ms.error("show", "移除从配置中心表", "成功");
                                alert("成功");
                                show_subordinate_list_div.innerHTML="";
                                var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
                                var req={nid:nid,flag:0};
                                document.getElementById("subordinate_list").style.background = "#ff99cc";
                                ms.send_msg('comc', 'comc_subordinate_list_req',req , function (type, data) {
                                    if (type != 'comc_subordinate_list_ack'){
                                        return;
                                    }
                                    if (data.result== "") {
                                        comc_subordinate_list=data;
                                        //show node list
                                        show_show_subordinate_list(data);
                                    } else {
                                        alert(data.result);
                                    }
                                });
                            } else {
                                ms.error("show", "移除从配置中心表", data.result);
                                alert(data.result);
                            }
                        });
                    };
                }
            }
            //-----------------------------------------get_node_list----------------------------------------------------------------
            function comc_get_node_list_class(div){
                var req={};
                div.innerHTML= '';
                var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
                req.nid=nid;
                send_to_get_node_list();
                function send_to_get_node_list(){
                    ms.send_msg('comc', 'comc_nodes_list_req',req , function (type, data) {
                        if (type != 'comc_nodes_list_ack'){
                            ms.error("show", "获取节点列表", "未知错误");
                            return;
                        }
                        if (data.result== "") {
                            ms.error("show", "获取节点列表", "成功");
                            nodes_list=data;
                            //show node list
                            show_node_list(show_node_list_div,data);
                        } else {
                            ms.error("show", "获取节点列表", data.result);
                            alert(data.result);
                        }
                    });
                }

                document.getElementById("go_back_home").onclick=function(){
                    if(comp_name_js[0]!="node_nece_option"){
                        comp_name_js.splice(0,0,"node_nece_option");
                    }
                    if(comp_name_ec[0]!="node_nece_option"){
                        comp_name_ec.splice(0,0,"node_nece_option");
                    }
                    fork();
                };

            }

            function show_node_list(div,data){
                comc_nodes = data.comc_nodes || [];
                div.innerHTML = '';
                var num=0;
                var node_data = [];
                for(var k = 0; k < comc_nodes.length; k++){
                    div.innerHTML += '<label id="'+k+ comc_nodes[k].name +k+'" style="color: #4169E1 ;font-size: 16px "></label><br/>';
                    if (document.getElementById(k+comc_nodes[k].name +k) != null)
                        document.getElementById(k+comc_nodes[k].name +k).innerHTML = comc_nodes[k].name;
                    for (var i = 0; comc_nodes[k].nodes != undefined && i < comc_nodes[k].nodes.length; i++) {
                        if(comc_nodes[k].nodes[i].name==""||comc_nodes[k].nodes[i].name=="undefined"){
                            comc_nodes[k].nodes[i].name="undefined"+num;
                            num++;
                        }
                        node_data[i] = JSON.parse(comc_nodes[k].nodes[i].data);
                        node_data[i].comp =  node_data[i].comp ? JSON.stringify(node_data[i].comp) : "unknown";
                        
                        if (node_data[i].info.instance_name == "user" && comc_nodes[k].name != "comc_main") {
                            var show_name = "在" + comc_nodes[k].nodes[i].name + "创建新实例";
                            div.innerHTML += '<button id="'+ k +"add_user"+i+'">' + show_name + '</button>&nbsp;&nbsp;';
                            document.getElementById(k + "add_user" + i).style.background = "#66cccc";
                        }
                        div.innerHTML += '<p>' +
                            //  '<input type="checkbox" name=data.name[i] value="'+count_conf[i]["name"]+'"/> &nbsp;' +
                            '<button id="'+comc_nodes[k].nodes[i].name +i+'">' + comc_nodes[k].nodes[i].name + '</button>&nbsp;&nbsp;'+
                            '<label id="'+k+"node_ip"+i+'" style="color: #1f25e1 ;font-size: 16px "> ip:</label>' +node_data[i].info.ip+
                            '<label id="'+k+"node_port"+i+'" style="color: #1f25e1 ;font-size: 16px "> port:</label>' +node_data[i].info.port+
                            '<label id="'+k+"http_port"+i+'" style="color: #1f25e1 ;font-size: 16px "> http_port:</label>' +node_data[i].http_port+
                            '<label id="'+k+"node_user"+i+'" style="color: #1f25e1 ;font-size: 16px "> user_name:</label>'+node_data[i].info.user+
                            '<label id="'+k+"node_instance"+i+'" style="color: #1f25e1 ;font-size: 16px "> instance_name:</label>'+node_data[i].info.instance_name+
                            '<label id="'+k+"node_p2p_status"+i+'" style="color: #1f25e1 ;font-size: 16px "> p2p_status:</label>'+node_data[i].info.status+
                            '<label id="'+k+"node_sys"+i+'" style="color: #1f25e1 ;font-size: 16px "> 操作系统:</label>'+node_data[i].info.sysnum+
                            '<label id="'+k+"node_comp"+i+'" style="color: #1f25e1 ;font-size: 16px "> 运行组件:</label>'+node_data[i].comp+
                            '<label id="'+k+"node_node_type"+i+'" style="color: #1f25e1 ;font-size: 16px "> 组件类型:</label>'+node_data[i].node_type+
                            '<label id="'+k+"node_run_status"+i+'" style="color: #1f25e1 ;font-size: 16px "> 运行状态:</label>'+node_data[i].run_status+
                            '<label id="'+k+"node_ver"+i+'" style="color: #1f25e1 ;font-size: 16px "> 版本:</label>'+node_data[i].node_ver +
                            '<label id="'+k+"node_storage"+i+'" style="color: #1f25e1 ;font-size: 16px "> 硬盘:</label>'+"0"+"%"+
                            '<label id="'+k+"node_memory"+i+'" style="color: #1f25e1 ;font-size: 16px "> 内存:</label>'+"0"+"%"+
                            '</p>';
                        document.getElementById(comc_nodes[k].nodes[i].name +i).style.background = "#66cccc";
                    }
                }


                var node_main={};
                var list_data={};
                for (var k1=0; k1<comc_nodes.length; k1++) {
                    if (comc_nodes[k1].nodes != undefined) {
                        for (var j = 0; j < comc_nodes[k1].nodes.length; j++) {
                            node_main[comc_nodes[k1].nodes[j].name+j] = comc_nodes[k1].nodes[j];
                            document.getElementById(comc_nodes[k1].nodes[j].name + j).onclick = function() {
                                show_node_list_div.innerHTML = "";
                                document.getElementById("set_node_list").style.background = "#ff99cc";
                                node_name = node_main[this.id].name;
                                document.getElementById('set_node_list').innerHTML = node_name;
                                comc_set_node(comc_set_node_div, node_main[this.id]);
                            };
                          
                            list_data[k1 + "add_user" + j] = comc_nodes[k1].nodes[j];
                            if (JSON.parse(comc_nodes[k1].nodes[j].data).info.instance_name == "user" && comc_nodes[k1].name != "comc_main"){
                                document.getElementById(k1+"add_user"+j ).onclick = function(){
                                    show_node_list_div.innerHTML="";
                                    document.getElementById("set_node_list").style.background = "#ff99cc";
                                    node_name=list_data[this.id].name;
                                    document.getElementById('set_node_list').innerHTML = node_name;
                                    comc_set_node_user(comc_set_node_user_div, list_data[this.id]);
                                };
                            }
                        }
                    }
                }
            }
            //------------------------------------set node user--------------------------------------------------------
            function comc_set_node_user(div, node_main) {
                var node_data=JSON.parse(node_main.data);
                div.innerHTML+= '<button id="add_node_user" value="1" style="font-size: 8px">添加实例</button>&nbsp;&nbsp;'+
                    '<button id="del_node_user" value="1" style="font-size: 8px">删除用户</button>&nbsp;&nbsp;'+
                    '<button id="change_user_pass" value="1" style="font-size: 8px">修改用户密码</button>&nbsp;&nbsp;<br>'+
                    "host" + '<input type="text" id="node_user_ip" value="'+node_data.info.ip+'"/><br>'+
                    "port" + '<input type="text" id="node_user_port" value=""/><br>'+
                    "instance_name" + '<input type="text" id="node_user_name" value=""/><br>'+
                    // "passwd" + '<input type="text" id="node_user_passwd" value=""/><br>'+
                    "node_name" + '<input type="text" id="node_user_node_name" value=""/>';
                document.getElementById("add_node_user").style.background = "#99ccff";
                document.getElementById("del_node_user").style.background = "#99ccff";
                document.getElementById("del_node_user").style.display = "none";
                document.getElementById("change_user_pass").style.background = "#99ccff";
                document.getElementById("change_user_pass").style.display = "none";
                

                document.getElementById("add_node_user").onclick = function(){
                    var host = document.getElementById("node_user_ip").value;
                    var port = document.getElementById("node_user_port").value;
                    var user = document.getElementById("node_user_name").value;
                    // var user_passwd=document.getElementById("node_user_passwd").value;
                    var node_name = document.getElementById("node_user_node_name").value;
                    var nid = create_nid( 2, login_data.lid, 5,login_data.share_key );
                    var req = {nid: nid, flag: 0, name: node_main.name, host: host, port: port, user: user,
                        new_name: node_name};
                    if(!req.host || !req.port || !req.user || !req.new_name ){
                        alert("参数不完整！");
                        return;
                    }
                    ms.send_msg('comc', 'comc_set_node_user_req', req , function (type, data) {
                        if (type != 'comc_set_node_user_ack'){
                            ms.error("show", "添加实例", "未知错误");
                            return;
                        }
                        if (data.result== "") {
                            ms.error("show", "添加实例", "成功");
                            alert("成功");
                        } else {
                            ms.error("show", "添加实例", data.result);
                            alert(data.result);
                        }
                    });

                };
                document.getElementById("change_user_pass").onclick=function(){
                    var user=document.getElementById("node_user_name").value;
                    var user_passwd=document.getElementById("node_user_passwd").value;
                    var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
                    var req={nid:nid,flag:2,name:node_main.name,user:user,password:user_passwd};
                    
                    if(!req.user || !req.password ){
                        alert("输入用户名和密码！");
                        return;
                    }
                    ms.send_msg('comc', 'comc_set_node_user_req',req , function (type, data) {
                        if (type != 'comc_set_node_user_ack'){
                            ms.error("show", "修改用户密码", "未知错误");
                            return;
                        }
                        if (data.result== "") {
                            ms.error("show", "修改用户密码", "成功");
                            alert("成功");
                        } else {
                            ms.error("show", "修改用户密码", data.result);
                            alert(data.result);
                        }
                    });
                };

                document.getElementById("del_node_user").onclick=function(){
                    alert("该功能暂不提供，请手动删除！");
                    return;
                };
            }
            //-----------------------------------set_comp_base_conf---------------------------------------------------------

            function set_comp_base_conf_class(div){
                show_node_list_div.innerHTML="";
                div.innerHTML= '<button id="update_comp_base_conf" value="0">修改组件已有默认配置文件</button>&nbsp;&nbsp;' +
                    '<button id="init_comp_base_conf" value="0">初始化或重新生成组件默认配置文件</button>&nbsp;&nbsp;<br>' +
                    '<div id="update_comp_base_div"></div>'+
                    '<div id="comp_base_conf_show_div"></div>'+
                    '<div id="init_comp_base_div"></div>';
                var update_comp_base_div=document.getElementById("update_comp_base_div");
                var comp_base_conf_show_div=document.getElementById("comp_base_conf_show_div");
                var init_comp_base_div=document.getElementById("init_comp_base_div");
                var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
                document.getElementById("comc_set_comp_base_conf").style.background = "#ff99cc";
                document.getElementById("update_comp_base_conf").style.background = "#ff99cc";
                document.getElementById("init_comp_base_conf").style.background = "#ff99cc";
                document.getElementById("update_comp_base_conf").onclick=function(){
                    var update_comp_base_div=document.getElementById("update_comp_base_div");
                    if(this.value == 0){
                        update_comp_base_conf(update_comp_base_div);
                        this.value=1;
                    }else{
                        this.value=0;
                        update_comp_base_div.innerHTML='';
                    }
                };
                document.getElementById("init_comp_base_conf").onclick=function(){
                    var init_comp_base_div=document.getElementById("init_comp_base_div");
                    if(this.value == 0){
                        init_comp_base_conf(init_comp_base_div);
                        this.value=1;
                    }else{
                        this.value=0;
                        init_comp_base_div.innerHTML='';
                    }
                };
                function init_comp_base_conf(div){
                    var comp_option_len=0;
                    var req={};
                    var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
                    req.nid=nid;
                    req.option=[];
                    req.df_value=[];
                    div.innerHTML = "选择组件：" + ':&nbsp';
                    var select = document.createElement("select");
                    select.id = "comp_name";
                    select.innerHTML = '<option type="radio" value="null">NULL</option>';
                    for (var i = 0; i < comp_name_js.length; i++) {
                        var option = document.createElement("option");
                        option.type = "radio";
                        option.value = comp_name_js[i];
                        option.innerHTML = comp_name_js[i];
                        select.appendChild(option);
                    }
                    div.appendChild(select);
                    document.getElementById("comp_name").onchange=function() {
                        var comp=document.getElementById("comp_name").value;
                        req.name=comp;
                        get_option_value();
                    };

                    function get_option_value(){
                        div.innerHTML='选项：<input type="text" id="option_name_text"/>&nbsp;&nbsp;&nbsp;&nbsp;'+
                            '默认值：<input type="text" id="option_value_text"/>&nbsp;&nbsp;&nbsp;&nbsp;'+
                            '<button id="add_option_name" >继续添加</button>&nbsp;&nbsp;'+ '<button id="init_comp_df_base_conf" >设置默认配置文件</button>&nbsp;&nbsp;<br>';
                        document.getElementById("add_option_name").style.background = "#ff99cc";
                        document.getElementById("init_comp_df_base_conf").style.background = "#ff99cc";
                        document.getElementById("add_option_name").onclick=function() {
                            var get_option=document.getElementById("option_name_text").value;
                            var get_value=document.getElementById("option_value_text").value;
                            if(option==""||option==null||option==undefined){
                                alert("option can't be null!");
                                get_option_value();
                            }else{
                                req.option[comp_option_len]=get_option;
                                req.df_value[comp_option_len]=get_value;
                                comp_option_len++;
                                get_option_value();
                            }
                        };
                        document.getElementById("init_comp_df_base_conf").onclick=function() {
                            var get_option=document.getElementById("option_name_text").value;
                            var get_value=document.getElementById("option_value_text").value;
                            if(option==""||option==null||option==undefined){
                                alert("option can't be null!");
                                get_option_value();
                            }else{
                                req.option[comp_option_len]=get_option;
                                req.df_value[comp_option_len]=get_value;
                                send_to_set_comp_df_base_conf();
                            }
                        };
                        function send_to_set_comp_df_base_conf(){
                            ms.send_msg('comc', 'comc_set_comp_base_conf_req',req , function (type, data) {
                                if (type != 'comc_set_comp_base_conf_ack') {
                                    ms.error("show", "设置组件基础配置文件", "未知错误");
                                    return;
                                }
                                if (data.result== "") {
                                    ms.error("show", "设置组件基础配置文件", "成功");
                                    alert("成功!");
                                    init_comp_base_div.innerHTML='';
                                } else {
                                    ms.error("show", "设置组件基础配置文件", data.result);
                                    alert(data.result);
                                }
                            });
                        }

                    }

                }
                function update_comp_base_conf(div){
                    var req={};
                    var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
                    req.nid=nid;
                    div.innerHTML = "选择组件：" + ':&nbsp';
                    var select = document.createElement("select");
                    select.id = "comp_name";
                    select.innerHTML = '<option type="radio" value="null">NULL</option>';
                    for (var i = 0; i < comp_name_js.length; i++) {
                        var option = document.createElement("option");
                        option.type = "radio";
                        option.value = comp_name_js[i];
                        option.innerHTML = comp_name_js[i];
                        select.appendChild(option);
                    }
                    div.appendChild(select);
                    document.getElementById("comp_name").onchange=function() {
                        var comp=document.getElementById("comp_name").value;
                        req.name=[comp];
                        ms.send_msg('comc', 'comc_get_comp_base_conf_req',req , function (type, data) {
                            if (type != 'comc_get_comp_base_conf_ack') {
                                ms.error("show", "获取组件基础配置文件", "未知错误");
                                return;
                            }
                            if (data.result== "") {
                                ms.error("show", "获取组件基础配置文件", "成功");
                                update_comp_base_show_conf(data);
                            } else {
                                ms.error("show", "获取组件基础配置文件", data.result);
                            }
                        });
                    };

                    function update_comp_base_show_conf(data) {
                        comp_base_conf_show_div.innerHTML='';
                        update_comp_base_div.innerHTML='';
                        var req={};
                        var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
                        req.nid=nid;
                        req.option=[];
                        req.df_value=[];
                        var len=0;
                        show_option_list();
                        function show_option_list(){
                            for (var i = 0; i < data.name.length; i++) {
                                comp_base_conf_show_div.innerHTML += '<p>' +
                                    data.name[i] +
                                    '</p>';
                                if(data.base_conf[0].option==undefined){
                                    data.base_conf[0].option=[];
                                }
                                for (var j = 0; j < data.base_conf[i].option.length; j++) {
                                    var dd=data.base_conf[i].df_value[j];
                                    comp_base_conf_show_div.innerHTML += '<p>' +
                                        //  '<input type="checkbox" name=data.name[i] value="'+count_conf[i]["name"]+'"/> &nbsp;' +
                                        data.base_conf[i].option[j] + '<input type="text" id="' + data.base_conf[i].option[j] + '" value="'+
                                        dd+'"/>' +
                                        // 'name：'+count_conf[i]["name"]+'&nbsp;&nbsp;&nbsp;value：'+count_conf[i]["value"]+
                                        '</p>';
                                    //  document.getElementById(data.base_conf[i].option[j]).value=data.base_conf[i].df_value[j];
                                }
                            }
                            comp_base_conf_show_div.innerHTML +='<br/><button id="add_comp_df_conf_data" >添加项</button>&nbsp;&nbsp;<button id="finish_comp_df_conf_data" >设置</button>&nbsp;&nbsp;<button id="cancel_comp_df_conf_data" >取消</button>&nbsp;&nbsp;<br/>';
                            document.getElementById("add_comp_df_conf_data").style.background = "#ff99cc";
                            document.getElementById("finish_comp_df_conf_data").style.background = "#ff99cc";
                            document.getElementById("cancel_comp_df_conf_data").style.background = "#ff99cc";
                            document.getElementById("cancel_comp_df_conf_data").onclick=function(){
                                comp_base_conf_show_div.innerHTML='';
                                update_comp_base_div.innerHTML='';
                            };

                            document.getElementById("add_comp_df_conf_data").onclick=function(){
                                get_update_value();
                                comp_base_conf_show_div.innerHTML +='<div id="comp_base_add_option_div"></div>';
                                var comp_base_add_option_div=document.getElementById("comp_base_add_option_div");
                                add_comp_option();
                                function add_comp_option(){
                                    comp_base_add_option_div.innerHTML +='选项：<input type="text" id="add_option_name_text"/>&nbsp;&nbsp;&nbsp;&nbsp;'+
                                        '默认值：<input type="text" id="add_option_value_text"/>&nbsp;&nbsp;&nbsp;&nbsp;'+
                                        '<button id="add_option" >继续添加</button>&nbsp;&nbsp;'+ '<button id="finish_add_option" >完成添加</button>&nbsp;&nbsp;'+'<button id="cancel_add_option" >取消</button>&nbsp;&nbsp;';
                                    document.getElementById("add_option").style.background = "#ff99cc";
                                    document.getElementById("add_option_value_text").style.background = "#ff99cc";
                                    document.getElementById("finish_add_option").style.background = "#ff99cc";
                                    document.getElementById("cancel_add_option").style.background = "#ff99cc";
                                    document.getElementById("add_option").onclick=function(){
                                        var op_name=document.getElementById("add_option_name_text").value;
                                        var op_value=document.getElementById("add_option_value_text").value;
                                        if(op_name==""||op_name==undefined){
                                            alert("op_name can't be null!");
                                            add_comp_option();
                                        }else{
                                            data.base_conf[0].option.push(op_name);
                                            data.base_conf[0].df_value.push(op_value);
                                        }
                                        comp_base_add_option_div.innerHTML='';
                                        add_comp_option();
                                    };
                                    document.getElementById("finish_add_option").onclick=function(){
                                        var op_name=document.getElementById("add_option_name_text").value;
                                        var op_value=document.getElementById("add_option_value_text").value;
                                        if(op_name==""||op_name==undefined){
                                            alert("op_name can't be null!");
                                            add_comp_option();
                                        }else{
                                            data.base_conf[0].option.push(op_name);
                                            data.base_conf[0].df_value.push(op_value);
                                        }
                                        update_comp_base_show_conf(data);
                                    };
                                    document.getElementById("cancel_add_option").onclick=function(){
                                        comp_base_add_option_div.innerHTML='';
                                        update_comp_base_show_conf(data);
                                    };
                                }
                            };
                            document.getElementById("finish_comp_df_conf_data").onclick=function(){
                                get_update_value();
                                req.name=data.name;
                                req.option=data.base_conf[0].option;
                                req.df_value=data.base_conf[0].df_value;
                               
                                ms.send_msg('comc', 'comc_set_comp_base_conf_req',req , function (type, data) {
                                    if (type != 'comc_set_comp_base_conf_ack') {
                                        ms.error("show", "设置组件基础配置文件", "未知错误");
                                        return;
                                    }
                                    if (data.result== "") {
                                        ms.error("show", "设置组件基础配置文件", "成功");
                                        alert("设置成功!");
                                        update_comp_base_div.innerHTML='';
                                        comp_base_conf_show_div.innerHTML='';
                                        fork();
                                    } else {
                                        ms.error("show", "设置组件基础配置文件", data.result);
                                        update_comp_base_div.innerHTML='';
                                        comp_base_conf_show_div.innerHTML='';
                                    }
                                });
                            };

                        }

                        function get_update_value(){
                            for (var i = 0; i < data.base_conf[0].option.length; i++) {
                                data.base_conf[0].df_value[i]=document.getElementById(data.base_conf[0].option[i]).value;
                            }
                        }

                    }

                }
            }

            //--------------------------------comc_set_node---------------------------------------------------------------
            function comc_set_node(div, node_main) {      
                var info_data = JSON.parse(node_main.data);
                var c_name = [];
                var node_type = "";
                var base_conf_data = {};
                div.innerHTML= '<p>' +
                    '<label id="node_ip" style="color: #1f25e1 ;font-size: 16px "> ip:</label>' +info_data.info.ip+
                    '<label id="node_port" style="color: #1f25e1 ;font-size: 16px "> port:</label>' +info_data.info.port+
                    '<label id="node_user" style="color: #1f25e1 ;font-size: 16px "> user:</label>'+info_data.info.user+
                    '<label id="node_instance" style="color: #1f25e1 ;font-size: 16px "> instance:</label>'+info_data.info.instance_name+
                    '<label id="node_p2p_status" style="color: #1f25e1 ;font-size: 16px "> p2p:</label>'+info_data.info.status+
                    '<label id="node_sys" style="color: #1f25e1 ;font-size: 16px "> 操作系统:</label>'+info_data.info.sysnum+
                    '<label id="node_comp" style="color: #1f25e1 ;font-size: 16px "> 运行组件:</label>'+info_data.comp+
                    '<label id="node_node_type" style="color: #1f25e1 ;font-size: 16px "> 组件类型:</label>'+info_data.node_type+
                    '<label id="node_run_status" style="color: #1f25e1 ;font-size: 16px "> 运行状态:</label>'+info_data.run_status+
                    '<label id="node_ver" style="color: #1f25e1 ;font-size: 16px "> 版本:</label>'+info_data.node_ver +
                    '<label id="node_storage" style="color: #1f25e1 ;font-size: 16px "> 硬盘:</label>'+"0"+"%"+
                    '<label id="node_memory" style="color: #1f25e1 ;font-size: 16px "> 内存:</label>'+"0"+"%"+
                    '</p>'+
                    '<button id="update_conf" value="0"  style="background: #ff99cc">修改已有配置文件并更新</button>&nbsp;&nbsp;' +
                    '<button id="init_conf" value="0" style="background: #ff99cc ">初始化或重新生成配置文件</button>&nbsp;&nbsp;<br>' +
                    '<div id="update_conf_div"></div>'+
                    '<div id="base_conf_show_div"></div>'+
                    '<div id="init_conf_div"></div>';
                var update_conf_div=document.getElementById("update_conf_div");
                var base_conf_show_div=document.getElementById("base_conf_show_div");
                var init_conf_div=document.getElementById("init_conf_div");
                var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
                document.getElementById("update_conf").onclick=function(){
                    var update_conf_div=document.getElementById("update_conf_div");
                    if(this.value == 0){
                        update_base_conf(update_conf_div);
                        this.value=1;
                    }else{
                        this.value=0;
                        update_conf_div.innerHTML='';
                    }
                };
                document.getElementById("init_conf").onclick=function(){
                    var init_conf_div=document.getElementById("init_conf_div");
                    if(this.value == 0){
                        this.value=1;
                        get_base_conf(init_conf_div);
                    }else{
                        this.value=0;
                        init_conf_div.innerHTML='';
                    }
                };
                function update_base_conf(div){
                    div.innerHTML='';
                    var req={};
                    var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
                    var req={nid:nid,name:node_main.name};
                    ms.send_msg('comc', 'comc_get_node_req',req , function (type, data) {
                        if (type != 'comc_get_node_ack') {
                            ms.error("show", "获取节点基础配置文件", "未知错误");
                            return;
                        }
                        if (data.result== "") {
                            ms.error("show", "获取节点基础配置文件", "成功");
                            update_show_base_conf(data);
                            base_conf_data=data;
                        } else {
                            ms.error("show", "获取节点基础配置文件", data.result);
                        }
                    });
                }
                function update_show_base_conf(data) {
                    var req={};
                    var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
                    req.nid=nid;
                    var base_conf={};
                    update_conf_div.innerHTML='';
                    if(data.base_conf.length==0){
                        update_conf_div.innerHTML +='<label id="prompt" style="color: #4169E1 ;font-size: 16px " >改节点当前没有配置文件，初始化或刷新！</label><br/>';
                    }else{
                        update_conf_div.innerHTML +='<label id="prompt" style="color: #4169E1 ;font-size: 16px " >请点击下方按钮展开需要修改的配置文件:</label><br/>';
                    }
                    for(var i=0;i<data.base_conf.length;i++){
                        if(data.default==i){
                            update_conf_div.innerHTML+=  '<button id="'+ data.base_conf[i].base_name +i+'" style="background: #ff4251" >' + data.base_conf[i].base_name + '</button>&nbsp;&nbsp;';
                        }else{
                            update_conf_div.innerHTML+=  '<button id="'+ data.base_conf[i].base_name +i+'" style="background: #ff99cc" >' + data.base_conf[i].base_name + '</button>&nbsp;&nbsp;';
                        }
                    }
                    update_conf_div.innerHTML +='<button id="up_conf_data" style="background: #ff99cc">保存</button>&nbsp;&nbsp;' +
                        '<button id="up_conf_update" style="background: #ff99cc">保存并更新到节点</button>&nbsp;&nbsp;' +
                        '<button id="delete_base_conf" style="background: #ff99cc">从服务器删除该文件</button>&nbsp;&nbsp;' +
                        '<button id="cancel_conf_data" style="background: #ff99cc" >取消</button>&nbsp;&nbsp;<br/>';
                    update_conf_div.innerHTML+= '<div id="node_base_conf_show_div"></div>';
                    var node_base_conf_show_div=document.getElementById("node_base_conf_show_div");
                    var base_conf_main={};
                    for(var j=0;j<data.base_conf.length;j++){
                        base_conf_main[data.base_conf[j].base_name +j]=data.base_conf[j];
                        document.getElementById(data.base_conf[j].base_name +j ).onclick=function(){
                            node_base_conf_show_div.innerHTML="";
                            document.getElementById(this.id).style.background = "#D8BFD8";
                            base_conf=base_conf_main[this.id];
                            show_node_base_conf(base_conf_main[this.id])
                        };
                    }
                    function show_node_base_conf(base_conf){
                        for(var j=0;j<base_conf.node.length;j++){
                            if(base_conf.node[j].name=="comp"){
                                var comp = JSON.parse(base_conf.node[j].value);
                                if (comp==undefined||comp==""){
                                    comp=[];
                                }
                                base_conf.node[j].value=comp.toString();
                            }
                        }
                        for (var i = 0; i < base_conf.node.length; i++) {
                            node_base_conf_show_div.innerHTML += '<p>' +
                                base_conf.node[i].name + '<input type="text" id="'+ base_conf.node[i].name + i+'" value="'+
                                base_conf.node[i].value+'"/>' + '</p>';
                        }

                    }

                    function get_update_value(){
                        req.base_conf = {base_name: base_conf.base_name, node:[]};
                        for (var i = 0; i < base_conf.node.length; i++) {
                            req.base_conf.node[i]={};
                            req.base_conf.node[i].name=base_conf.node[i].name;
                            req.base_conf.node[i].value=document.getElementById(base_conf.node[i].name+i).value;
                            if(req.base_conf.node[i].name=="comp"){
                                var obj = req.base_conf.node[i].value.split(",");
                                req.base_conf.node[i].value=JSON.stringify(obj);
                            }
                        }
                        var desc={name:"comc_node_desc",value:node_main.data};
                        req.name = node_main.name;
                        req.base_conf.node.push(desc);
                    }

                    document.getElementById("up_conf_update").onclick=function(){
                        get_update_value();
                        req.flag = 0;  
                        //return;
                        ms.send_msg_from('comc', 'comc_set_node_req', req , function (type, data) {
                            if (type != 'comc_set_node_ack') {
                                ms.error("show", "修改配置文件", "未知错误");
                                return;
                            }
                            if (data.result == "") {
                                ms.error("show", "修改配置文件", "成功");
                                alert("配置成功!");
                                update_conf_div.innerHTML='';
                                node_base_conf_show_div.innerHTML='';
                            } else {
                                ms.error("show", "修改配置文件", data.result);
                            }
                        });
                    };
                    document.getElementById("delete_base_conf").onclick=function(){
                        get_update_value();
                        req.flag=4;
                        ms.send_msg_from('comc', 'comc_set_node_req',req , function (type, data) {
                            if (type != 'comc_set_node_ack') {
                                ms.error("show", "删除配置文件", "未知错误");
                                return;
                            }
                            if (data.result== "") {
                                ms.error("show", "删除配置文件", "成功");
                                alert("删除成功!");
                                update_conf_div.innerHTML='';
                                node_base_conf_show_div.innerHTML='';
                            } else {
                                ms.error("show", "删除配置文件", data.result);
                            }
                        });
                    };
                    document.getElementById("up_conf_data").onclick=function(){
                        get_update_value();
                        req.flag=1;
                        ms.send_msg_from('comc', 'comc_set_node_req',req , function (type, data) {
                            if (type != 'comc_set_node_ack') {
                                ms.error("show", "设置配置文件", "未知错误");
                                return;
                            }
                            if (data.result== "") {
                                ms.error("show", "设置配置文件", "成功");
                                alert("配置成功!");
                                update_conf_div.innerHTML='';
                                node_base_conf_show_div.innerHTML='';
                            } else {
                                ms.error("show", "设置配置文件", data.result);
                            }
                        });
                    };
                    document.getElementById("cancel_conf_data").onclick=function(){
                        update_conf_div.innerHTML = '';
                        update_base_conf(update_conf_div);
                    };

                }
                function get_base_conf(div) {
                    var comp_name=comp_name_js;
                    div.innerHTML +='<br/><button id="c_comp" value="0" style="background: #ff99cc">运行C框架</button>&nbsp;&nbsp;' +
                        '<button id="mipcm_node_comp"  value="0" style="background: #ff99cc">node_js框架</button>&nbsp;&nbsp;' +
                        '<button id="cancel_comp" style="background: #ff99cc">取消</button>&nbsp;&nbsp;<br/>'+
                        '<div id="get_comp_name_div"></div>';
                    var get_comp_name_div=document.getElementById("get_comp_name_div");
                    document.getElementById("c_comp").onclick=function(){
                        comp_name=comp_name_ec;
                        c_name.push(comp_name[0]);
                        comp_name.splice(0,1);
                        if(this.value == 0){
                            this.value=1;
                            node_type="c";
                            save_comp_name(get_comp_name_div);

                        }else{
                            this.value=0;
                            get_comp_name_div.innerHTML="";
                        }
                    };
                    document.getElementById("cancel_comp").onclick=function(){
                        div.innerHTML="";
                    };
                    document.getElementById("mipcm_node_comp").onclick=function(){
                        comp_name=comp_name_js;
                        c_name.push(comp_name[0]);

                        comp_name.splice(0,1);
                        if(this.value == 0){
                            this.value=1;
                            node_type="nodejs";
                            save_comp_name(get_comp_name_div);
                        }else{
                            this.value=0;
                            get_comp_name_div.innerHTML="";
                        }
                    };
                    function save_comp_name(div){
                        var req={};
                        div.innerHTML+='<p>';
                        var k=0;
                        for(var i=0; i<comp_name.length; i++){
                            k++;
                            div.innerHTML+= '<input type="checkbox" name="comp_name_checkbox" value="'+comp_name[i]+'"/> &nbsp;' +comp_name[i];
                            // 'name：'+comp_name[i]+'&nbsp;&nbsp;&nbsp;value：'+comp_name[i]+
                            if (k == 5 || i == comp_name.length-1) {
                                k =0;
                                if (i == comp_name.length-1) {
                                    div.innerHTML+='</p>';
                                    break;
                                }
                                div.innerHTML+='</p><p>';
                            }
                        }
                        div.innerHTML += '<button id="get_df_conf" style="background: #ff99cc">获取默认基本配置文件</button>&nbsp;&nbsp;<br>';
                        document.getElementById("get_df_conf").onclick=function(){
                            var comp_checkbox=document.getElementsByName("comp_name_checkbox");
                            for(var i=0; i<comp_checkbox.length; i++){
                                if(comp_checkbox[i].checked){
                                    c_name.push(comp_checkbox[i].value);
                                }
                            }
                            var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
                            req.nid=nid;
                            req.name=c_name;
                            ms.send_msg('comc', 'comc_get_comp_base_conf_req',req , function (type, data) {
                                if (type != 'comc_get_comp_base_conf_ack') {
                                    ms.error("show", "获取默认基本配置文件", "未知错误");
                                    return;
                                }
                                if (data.result== "") {
                                    ms.error("show", "获取默认基本配置文件", "成功");
                                    show_base_conf(data);
                                } else {
                                    ms.error("show", "获取默认基本配置文件", data.result);
                                }
                            });
                        };

                        document.getElementById("save_comp_name").onclick=function(){
                            var name=document.getElementById("comp_name_text").value;
                            if(name!=""&&name!=undefined){
                                c_name.push(name);
                            }
                            save_comp_name();
                        };
                    }
                }
                function json_to_str(jsonObj){
                    var jStr = "{ ";
                    for(var item in jsonObj){
                        jStr += "'"+item+"':'"+jsonObj[item]+"',";
                    }
                    jStr += " }";
                    jStr = jStr.substring(0,jStr.length-3) + jStr.substring(jStr.length-2,jStr.length);
                    return jStr;
                }
                function show_base_conf(data) {
                    init_conf_div.innerHTML='';
                    var req={};
                    var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
                    req.nid=nid;
                    var node=[];
                    var len=0;
                    base_conf_show_div.innerHTML = '';

                    base_conf_show_div.innerHTML += '<p>' +"base_name" + '<input type="text" id="base_name" value=""/>' +'</p>';
                    for (var i = 0; i < data.name.length; i++) {
                        var grade = "";
                        var prompt = "";
                        if(data.name[i]=="node_nece_option" || data.name[i]=="c_nece_option"){
                            grade ="(必填)";
                        }else if(data.name[i]=="node_opt_optional" || data.name[i]=="c_opt_optional"){
                            grade ="(选填)";
                        }
                        if(!data.base_conf[i].option || data.base_conf[i].option.length==0){
                            prompt="该组件还没设置基本配置文件选项，请配置组件配置文件的基本选项！";
                        }
                        base_conf_show_div.innerHTML += '<p>' +
                            data.name[i] +grade+
                            '</p>';
                        if(prompt != ""){
                            base_conf_show_div.innerHTML += '<p>' + prompt+ '</p>';
                        }
                        for (var j = 0; j < data.base_conf[i].option.length; j++) {
                            if(data.base_conf[i].df_value[j].indexOf("{")>=0){
                                data.base_conf[i].df_value[j]=JSON.parse(data.base_conf[i].df_value[j]) ;
                                var show_value=json_to_str(data.base_conf[i].df_value[j]);
                            }else if(data.base_conf[i].option[j]=="name"){
                                var show_value = node_main.name;
                            }else if(data.base_conf[i].option[j]=="ip" || data.base_conf[i].option[j]=="gw_host" ){
                                var show_value = JSON.parse(node_main.data).info.ip;
                            }else{
                                var show_value = data.base_conf[i].df_value[j];
                            }
                            //  var show_value=data.base_conf[i].df_value[j].indexOf("{")>=0 ? JSON.stringify(data.base_conf[i].df_value[j]) : data.base_conf[i].df_value[j];
                            base_conf_show_div.innerHTML += '<p>' +
                                //  '<input type="checkbox" name=data.name[i] value="'+count_conf[i]["name"]+'"/> &nbsp;' +
                                data.base_conf[i].option[j] + '<input type="text" id="' + data.base_conf[i].option[j] + '" value="'+
                                show_value+'"/>' +
                                // 'name：'+count_conf[i]["name"]+'&nbsp;&nbsp;&nbsp;value：'+count_conf[i]["value"]+
                                '</p>';
                        }
                    }
                    base_conf_show_div.innerHTML +=
                        '<br/><button id="save_conf_data" style="background: #ff99cc">保存</button>&nbsp;&nbsp;'+
                        '<button id="save_conf_update" style="background: #ff99cc">保存并更新到节点</button>&nbsp;&nbsp;'+
                        '<button id="cancel_conf_data" style="background: #ff99cc">取消</button>&nbsp;&nbsp;<br/>';

                    function get_input_value(){
                        req.base_conf={base_name:document.getElementById("base_name").value, node:[]};
                        for (var i = 0; i < data.name.length; i++) {
                            for (var j = 0; j < data.base_conf[i].option.length; j++) {
                                data.base_conf[i].df_value[j] = document.getElementById(data.base_conf[i].option[j]).value;
                                node[len] = {};
                                node[len].name = data.base_conf[i].option[j];
                                node[len].value = data.base_conf[i].df_value[j];
                                if(node[len].name == "name"){
                                    req.name = node[len].value;
                                }
                                len++;
                            }
                        }
                        var type={name:"node_type",value:node_type};
                        var desc={name:"comc_node_desc",value:node_main.data};
                        node.push(desc);
                        node.push(type);
                        req.base_conf.node=node;
                    }
                    document.getElementById("save_conf_update").onclick=function(){
                        get_input_value();
                        req.flag = 2;
                        // var comps=c_name.splice(0,2);
                        var comp_name=[];
                        for(var j=0;j<c_name.length;j++){
                            if(c_name[j]!="node_nece_option" && c_name[j]!="node_opt_optional"){
                                comp_name.push(c_name[j]);
                            }
                        }
                        comp_name=JSON.stringify(comp_name);
                        
                        var comp={name:"comp",value:comp_name};
                        req.base_conf.node.push(comp);
                        ms.send_msg_from('comc', 'comc_set_node_req',req , function (type, data) {
                            if (type != 'comc_set_node_ack') {
                                ms.error("show", "保存配置文件", "未知错误");
                                return;
                            }
                            if (data.result== "") {
                                ms.error("show", "保存配置文件", "成功");
                                alert("配置成功!");
                             
                                init_conf_div.innerHTML='';
                                base_conf_show_div.innerHTML='';
                            } else {
                                ms.error("show", "保存配置文件", data.result);
                                alert(data.result);
                               
                            }
                        });
                    };
                    document.getElementById("save_conf_data").onclick=function(){
                        get_input_value();
                        req.flag=3;
                        var comp_name=[];
                        for(var j=0;j<c_name.length;j++){
                            if(c_name[j]!="node_nece_option" && c_name[j]!="node_opt_optional"){
                                comp_name.push(c_name[j]);
                            }
                        }
                         
                        var comp={name:"comp",value:JSON.stringify(comp_name)};
                        req.base_conf.node.push(comp);

                        ms.send_msg_from('comc', 'comc_set_node_req',req , function (type, data) {
                            if (type != 'comc_set_node_ack')
                                return;
                            if (data.result== "") {
                                alert("配置成功!");
                                init_conf_div.innerHTML='';
                                base_conf_show_div.innerHTML='';
                            } else {
                                alert(data.result);
                            }
                        });
                    };
                    document.getElementById("cancel_conf_data").onclick=function(){
                        base_conf_show_div.innerHTML = '';
                    };

                }

            }

        }

        function version_management(div) {
            var nodes_name = [];
            var comc_nodes_data = [];

            document.getElementById("option_page").style = "display:none;";
            div.innerHTML = '';
            div.innerHTML = '<div id="version_management_div">' +
                '<button id="go_back_home" value="0" style="font-size: 14px" style="display: "">返回主页</button>&nbsp;&nbsp;<br>' +
                '<div class="demo_line_05">-----------------------------------------------------------------------------------------------------------------------------------</div>' +
                '<button  id="comc_batch_up_btn" value="0" style="font-size: 14px">批量上传</button>&nbsp;&nbsp;' +
                '<button id="comc_get_file_list_btn" value="1" style="font-size: 14px">版本更新</button>&nbsp;&nbsp;' +
                // '<button id="comc_version_upload_btn" value="1" style="font-size: 14px" style="display: none;">上传版本</button>&nbsp;&nbsp;' +
                '<div id="version_upload_div" style="display: none;"></div>' +
                '<div id="version_update_div" style="display: none;"></div>' +
                '<div id="comc_version_nodes_show_div" style="display: block;"></div>' +
                '</div>';

            var comc_batch_up_button = document.getElementById("comc_batch_up_btn");
            var comc_version_update_button = document.getElementById("comc_get_file_list_btn");
            var comc_version_upload_div = document.getElementById("version_upload_div");
            var comc_version_update_div = document.getElementById("version_update_div");
            var comc_version_nodes_show_div = document.getElementById("comc_version_nodes_show_div");

            var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
            ms.send_msg('comc', 'comc_nodes_list_req', {nid: nid}, function (type, data) {
                if (type != 'comc_nodes_list_ack') {
                    ms.error("show", "获取节点列表", "未知错误");
                    return;
                }
                if (data.result == "") {
                    ms.error("show", "获取节点列表", "成功");
                    var nodes = [];
                    if (data["comc_nodes"] != undefined && data["comc_nodes"].length > 0) {
                        comc_nodes_data = data["comc_nodes"];
                        for (var k = 0; k < data["comc_nodes"].length; k++) {
                            if (data["comc_nodes"][k]["nodes"] != undefined) {
                                for (var l = 0; l < data["comc_nodes"][k]["nodes"].length; l++) {
                                    nodes.push(data["comc_nodes"][k]["nodes"][l]);
                                }
                            }
                        }
                    }
                    if (nodes.length > 0) {
                        node_list(nodes);
                    }
                } else {
                    alert(data.result);
                    ms.error("show", "获取节点列表", data.result);
                }
            });


            comc_batch_up_button.onclick = function () {
                if (comc_version_upload_div.style.display != 'none') {
                    comc_version_upload_div.style.display = 'none';
                    return;
                }
                comc_version_update_div.style.display = 'none';
                comc_version_upload_div.style.display = 'block';
                bacth_upload_class();
            };

            comc_version_update_button.onclick = function () {
                if (comc_version_update_div.style.display != 'none') {
                    comc_version_update_div.style.display = 'none';
                    return;
                }
                comc_version_upload_div.style.display = 'none';
                comc_version_update_div.style.display = 'block';
                comc_version_upload();
            };



            function bacth_upload_class() {
                var file_page_more = [];

                function bacth_upload_page() {
                    var version_upload_div = mx("#version_upload_div");
                    version_upload_div.innerHTML = '<h1>Versions_confcenter</h1>' +
                        '<div id="mac_select_version_div"></div>' +
                        '<div id="special_version_div">' +
                        'DIY&nbsp;:&nbsp;<select id="special_version_select"><option type="radio" value="null">NULL</option></select>' +
                        '<div id="special_version_file_div"></div>' +
                        '</div><br><p>' +
                        '<button id="bacth_up_button">上传</button>&nbsp;&nbsp;' +
                        '&nbsp;&nbsp;&nbsp;&nbsp; ' +
                        '</p><br><div id="nodes_versions_div"></div>';
                    var version_types = [],
                        nodes_name = [];
                    var special_version_file_div = document.getElementById("special_version_file_div");

                    var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                    ms.send_msg('comc', 'comc_get_conf_versions_req', {nid: nid}, function (type, data) {
                        if (type != "comc_get_conf_versions_ack") {
                            ms.error('show', '获取配置中心版本失败',data["result"]);
                            return;
                        } else {
                            if (data["result"] == '') {
                                ms.error('show', '获取配置中心版本', '成功');
                                var mac_version = data["versions"]||[];
                                var mac_select_version_div = document.getElementById("mac_select_version_div"),
                                    nodes_versions_div = document.getElementById("nodes_versions_div");
                                for (var i = 0; i < mac_version.length; i++) {
                                    var version_type = mac_version[i].type;
                                    version_types[version_types.length] = version_type;
                                    var version_data = mac_version[i].version;//[]
                                    mac_select_version_div.innerHTML += version_type + ':&nbsp';
                                    var select = document.createElement("select");
                                    select.id = 'batch_mac_' + version_type;
                                    select.innerHTML = '<option type="radio" value="null">NULL</option>';
                                    for (var j = 0; j < version_data.length; j++) {
                                        var option = document.createElement("option");
                                        option.type = "radio";
                                        option.value = version_data[j];
                                        option.innerHTML = version_data[j];
                                        select.appendChild(option);
                                    }
                                    mac_select_version_div.appendChild(select);
                                    mac_select_version_div.innerHTML += '<br>';
                                }
                            } else {
                                ms.error('show', '获取配置中心版本失败', data["result"]);
                                return;
                            }
                        }
                        var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                        ms.send_msg('comc', 'comc_nodes_list_req', {nid: nid}, function (type, data) {
                            if (type != 'comc_nodes_list_ack') {
                                return;
                            }
                            if (data.result == "") {
                                // nodes_list = data;
                                for (var l = 0; data["comc_nodes"] && l < data["comc_nodes"].length; l++) {
                                    if (data["comc_nodes"][l]["nodes"] != undefined) {
                                        for (var d = 0; d < data["comc_nodes"][l]["nodes"].length; d++) {
                                            // if (data["comc_nodes"][l]["nodes"][d]["name"] != "comc1") {
                                            nodes_name.push(data["comc_nodes"][l]["nodes"][d]["name"]);
                                            // }
                                        }
                                    }
                                }
                                //show node list
                                for (var j = 0; j < nodes_name.length; j++) {
                                    var button = document.createElement("button");
                                    var tmp_p = document.createElement("p");
                                    button.id = 'bacth_' + nodes_name[j] + '_button';
                                    button.name = nodes_name[j];
                                    button.value = '0';
                                    button.innerHTML = '<span style="font-size:14px;"><b>' + nodes_name[j] + '</b></span>';
                                    tmp_p.innerHTML = '<input type="checkbox" name="nodes_name_checkbox" value = "' + nodes_name[j] + '"/>';

                                    tmp_p.appendChild(button);
                                    nodes_versions_div.appendChild(tmp_p);
                                    nodes_versions_div.innerHTML += '<div id="bacth_' + nodes_name[j] + '_div"></div></br>';
                                }
                                for (var k = 0; k < nodes_name.length; k++) {
                                    document.getElementById('bacth_' + nodes_name[k] + '_button').onclick = function () {
                                        do_node_version(this);
                                    };
                                }
                            } else {
                                alert(data.result);
                            }
                        });
                    });

                    /*var special_version_select = document.getElementById("special_version_select");
                    for (var i = 0; i < special_versions.length; i++) {
                        var option = document.createElement("option");
                        option.type = "radio";
                        option.value = 'space_' + i;
                        option.innerHTML = 'space_' + i;
                        special_version_select.appendChild(option);
                    }*/
                    mx("#bacth_up_button").onclick = function () {
                        this.disabled = true;
                        var nodes_name_check = [];
                        var nodes_name_checkbox = document.getElementsByName("nodes_name_checkbox");
                        for (var i = 0; i < nodes_name_checkbox.length; i++) {
                            if (nodes_name_checkbox[i].checked) {
                                nodes_name_check[nodes_name_check.length] = nodes_name_checkbox[i].value;
                            }
                        }
                        do_bacth_up_button(version_types, nodes_name_check);
                    };

                    // document.getElementById("special_version_up_button").onclick = function () {
                    //     do_special_version_handle(this, 'special_version_up');
                    // };

                    // document.getElementById("special_version_tar_button").onclick = function () {
                    //     do_special_version_handle(this, 'special_version_tar');
                    // };
                }

                function do_node_version(button) {
                    var node_name = button.name;
                    var bacth_node_div = document.getElementById('bacth_' + node_name + '_div');
                    if (button.value != '0') {
                        bacth_node_div.innerHTML = '';
                        button.value = '0';
                        return;
                    } else {
                        button.value = '1';
                    }
                    var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                    ms.send_msg('comc', 'comc_get_node_versions_req', {
                        nid: nid,
                        name: node_name
                    }, function (type, data) {
                        if (type != "comc_get_node_versions_ack") {
                            ms.error('show','获取节点'+node_name+'版本失败 ： ',data["result"]);
                            return;
                        }
                        var node_version = data["versions"];
                        if (!node_version) {
                            return;
                        }
                        for (var v = 0; v < node_version.length; v++) {
                            var version_type = node_version[v].type;
                            bacth_node_div.innerHTML += '<p id="' + node_name + version_type + '_p"><b>' + version_type + '</b></p>';
                            var node_version_child = node_version[v].version;
                            for (var i = 0; i < node_version_child.length; i++) {
                                if (i % 5 == 0)
                                    document.getElementById(node_name + version_type + '_p').innerHTML += '<br>';
                                document.getElementById(node_name + version_type + '_p').innerHTML += node_version_child[i] + '&nbsp';
                            }
                        }
                    });

                }

                function do_bacth_up_button(version_types, nodes_name) {
                    if (nodes_name.length == 0 || version_types.length == 0) {
                        ms.error('show','上传版本失败',"选择信息有误，请检查后再试！");
                        alert("选择信息有误，请检查后再试！");
                        mx("#bacth_up_button").disabled = false;
                        return;
                    }

                    var versions = [];
                    for (var i = 0; i < version_types.length; i++) {
                        var select = document.getElementById("batch_mac_" + version_types[i]);
                        if (select == undefined)
                            continue;
                        var value = select.value;
                        if (value != 'null') {
                            versions[versions.length] = {type: version_types[i], version: [value]};
                        }
                    }
                    if (versions.length == 0) {
                        alert("选择信息有误，请检查后再试！");
                        mx("#bacth_up_button").disabled = false;
                        return;
                    }
                   
                    var n = versions.length;
                    for (var j = 0; j < versions.length; j++) {
                        // if (nodes_name[j] == "comc1") {
                        //     continue;
                        // }
                        var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                        ms.send_msg('comc', 'comc_upload_node_versions_req',
                            {
                                nid: nid,
                                name: nodes_name,
                                versions: versions[j]
                            },
                            function (type, data) {  
                                if (type == "comc_upload_node_versions_ack") {
                                    mx("#bacth_up_button").disabled = false;
                                    if (data["result"] == ''){
                                        ms.error('show','上传版本结果', 'success');
                                    } else {
                                        ms.error('show','上传版本结果', data["result"]);
                                    }
                                }
                            });
                    }
                }

                function do_special_version_handle(button, request) {
                    button.disabled = true;
                    var nodes_name_check = [];
                    var file_name = '';

                    var special_version_file_box = document.getElementsByName("special_version_file_box");
                    var nodes_name_checkbox = document.getElementsByName("nodes_name_checkbox");
                    var select_value = document.getElementById("special_version_select").value;

                    for (var i = 0; i < nodes_name_checkbox.length; i++) {
                        if (nodes_name_checkbox[i].checked) {
                            nodes_name_check[nodes_name_check.length] = nodes_name_checkbox[i].value;
                        }
                    }
                    for (i = 0; i < special_version_file_box.length; i++) {
                        if (special_version_file_box[i].checked) {
                            file_name = special_version_file_box[i].value;
                            break;
                        }
                    }
                    var root_path = file_page_more[select_value]["path"];

                    if (nodes_name_check.length == 0 || file_name.length == 0 || root_path.length == 0) {
                        ms.error('show', '上传版本失败', "选择信息有误，请检查后再试！");
                        button.disabled = false;
                        return;
                    }

                    var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                    for (i = 0; i < nodes_name_check.length; i++) {
                        var node_name = nodes_name_check[i];
                        ms.send_msg('cct', 'cct_get_space_req', {
                            nid: nid,
                            request: request,
                            root_path: root_path,
                            file_name: file_name,
                            node_name: node_name
                        }, function (type, data) {
                            button.disabled = false;
                            if (type != 'cct_get_space_ack')
                                return;
                            var req_info;
                            if (request == 'special_version_up')
                                req_info = '同步' + file_name + '的结果';
                            if (request == 'special_version_tar')
                                req_info = '解压' + file_name + '的结果';

                            ms.error('show', req_info, data["result"]);
                        });

                    }
                }

                bacth_upload_page();
            }

            function comc_version_upload(flag) {
                var space_paths = [];
                var desc = [];
                var version_update_div = mx("#version_update_div");
                version_update_div.innerHTML = '<h1>Versions_confcenter</h1>' +
                    '<button id="mac_version_up_button" value="0">上传版本到配置中心</button>&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '<button id="mac_version_del_button">删除配置中心版本</button>&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '<button id="mac_version_read_button">查看配置中心版本</button>&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '<button id="mac_version_open_lock_button">上传版本解锁</button>&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '<button id="mac_version_lock_up_button">上传版本锁定</button>&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '<br><br><div id="mac_version_up_div"></div><br>' +
                    '<div id="mac_special_version_div"></div>' +
                    '<div id="mac_versions_div"></div>';

                var mac_version_up_div = document.getElementById("mac_version_up_div");
                var mac_special_version_div = document.getElementById("mac_special_version_div");
                var mac_versions_div = document.getElementById("mac_versions_div");
                var mac_version = [];

                var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                ms.send_msg('comc', 'comc_get_conf_versions_req', {nid: nid}, function (type, data) {
                    if (type != "comc_get_conf_versions_ack") {
                        ms.error('show','获取配置中心版本失败',data["result"]);
                        return;
                    }
                    if (data["result"] == '') {
                        ms.error('show', '获取配置中心版本', '成功');
                        mac_version = data["versions"] || [];
                        for (var i = 0; i < mac_version.length; i++) {
                            var version_type = mac_version[i]["type"];
                            var mac_version_child = mac_version[i]["version"];//[]
                            mac_versions_div.innerHTML += '<p id="mac_' + version_type + '_p"><b>' + version_type + '</b></p></br>';
                            for (var j = 0; j < mac_version_child.length; j++) {
                                if (j % 5 == 0)
                                    document.getElementById('mac_' + version_type + '_p').innerHTML += '<br>';
                                document.getElementById('mac_' + version_type + '_p').innerHTML += '<input type="checkbox" id="' + version_type + '_checkbox_' + j + '" value="' + mac_version_child[j] + '"/>' + mac_version_child[j] + '&nbsp';
                            }
                        }
                    } else {
                        ms.error('show', '获取配置中心版本', data["result"]);
                    }

                });

                if (flag == 'yes') {
                    document.getElementById("mac_version_up_button").value = '1';
                    mac_version_up_div.innerHTML = '';
                    do_mac_version_up(mac_version_up_div);
                }

                document.getElementById("mac_version_up_button").onclick = function () {
                    var mac_version_up_div = document.getElementById("mac_version_up_div");
                    mac_version_up_div.innerHTML = '';
                    if (this.value != '0') {
                        this.value = '0';
                        return;
                    } else {
                        this.value = '1'
                    }
                    do_mac_version_up(mac_version_up_div);
                };
                document.getElementById("mac_version_open_lock_button").onclick = function () {
                    do_mac_version_req(mac_version, 'open_lock');
                };
                document.getElementById("mac_version_lock_up_button").onclick = function () {
                    do_mac_version_req(mac_version, 'lock_up');
                };
                document.getElementById("mac_version_del_button").onclick = function () {
                    do_mac_version_req(mac_version, 'del_version');
                };
                document.getElementById("mac_version_read_button").onclick = function () {
                    do_mac_version_status_req(mac_version, 'get_version_file_status', mac_version_up_div);
                };

                //upload version to comc
                function do_mac_version_up(mac_version_up_div) {
                    var id = 0;
                    var version_div = document.createElement("div");
                    var num = 0;
                    var upload_num = 8;

                    function iframe_build() {
                        var iframe = document.getElementsByName('upload_file_iframe')[num];
                        var doc = iframe.contentDocument || iframe.contentWindow.document;
                        try {
                            doc.open();
                            doc.close();
                        } catch (err) {
                        }
                        doc.body["style"]["cssText"] = "padding:0px;margin:0px;border:none;overflow:hidden;";
                        doc.body.innerHTML = "<form id='up_file_form' method='post' action='comc/comc_upload_conf_versions_req.js?'" +
                            " enctype='multipart/form-data' " +
                            "style='padding:0px;margin:0px;border:none;overflow:hidden;'>" +
                            "<input type='file' id='dupload_data' name='dupload_data' hidefocus='true'" +
                            " title='upload'" +
                            " style='padding:0px;margin:0px;left:-5px;top:0px;verflow:hidden;cursor:f;" +
                            "line-height:24px;'" +
                            "/><br>" +
                            "</form>";
                        iframe.value = "1";
                        var form = doc.getElementById("up_file_form");
                        doc.getElementById("dupload_data").onchange = function () {
                            var path = this.value.replace(/.*:?\\(.*\\){0,}/g, '');
                            form.action += 'dfile_name=' + encodeURI(path.toString('utf-8'));
                        };
                    }

                    function upload_result() {
                        var iframes = document.getElementsByName('upload_file_iframe');
                        if (iframes[num].value == "0")
                            return;
                        var doc = iframes[num].contentDocument || iframes[num].contentWindow.document;
                        var msg = doc.body.innerHTML, start = msg.indexOf("("), end = msg.lastIndexOf(")");
                        if (end > (start + 2)) {
                            try {
                                msg = eval(msg.substring(start, end + 1));
                            } catch (err) {
                                msg = "error";
                            }
                        }
                        iframe_build();
                        if (("error" == msg) || (null == msg) || (null == msg.data)) {
                            ms.error('show', '上传文件', '失败！');
                        } else {
                            if (msg.data["result"] == "") {
                                ms.error('show', '上传文件', '成功！');
                            } else {
                                ms.error('show', '上传文件的结果', msg.data["result"]);
                            }
                        }
                        num += 1;
                        do_version_upload();
                    }

                    function version_bulid() {
                        version_div.innerHTML +=
                            "版本语言:<select id='mac_version_up_language_select_" + id + "'>" +
                            "<option type='lang' value='null'>请选择</option>" +
                            "</select><br>" +
                            '版本参数:<textarea name="textfield3" cols="100" rows="3" id="data_text_'+ id +'"></textarea><br>'+'<br>'+
                            '<div id="textarea">' +
                            '</div>' +
                            '<button id="add_Parameters">追加版本语言</button><br>' +
                            "版本类型：<select id='mac_version_up_type_select'>" +
                            "<option type='radio' value='null'>请选择</option>" +
                            "</select><br>" +
                            "版本号：<input type='text' id='mac_version_up_num_text'/>&nbsp;&nbsp;" +
                            "&nbsp<input type='button' id='mac_version_up_Confirm_button' value='确认'/><br>";

                        var select = document.getElementById("mac_version_up_type_select");
                        for (var i = 0; i < version_type_all.length; i++) {
                            var option = document.createElement("option");
                            option.type = "radio";
                            option.value = version_type_all[i];
                            option.innerHTML = version_type_all[i];
                            select.appendChild(option);
                        }
                        for (var j = 0; j < space_paths.length; j++) {
                            var option = document.createElement("option");
                            option.type = "radio";
                            option.value = j;
                            option.innerHTML = 'space_' + j;
                            select.appendChild(option);
                        }
                        var selectl = document.getElementById("mac_version_up_language_select_" + id);
                        for (var i = 0; i < language.length; i++) {
                            var option = document.createElement("option");
                            option.type = "lang";
                            option.value = language[i];
                            option.innerHTML = language[i];
                            selectl.appendChild(option);
                        }
                        document.getElementById("add_Parameters").onclick=function(){
                            var selectl = document.getElementById("mac_version_up_language_select_" + id);
                            var text=document.getElementById("data_text_" + id).value;
                            var descs={lang:selectl.value,text:text};
                            desc.push(descs);
                            id++;
                            var tmp = document.createElement("div");
                            tmp.innerHTML += "版本语言:<select id='mac_version_up_language_select_" + id + "'>" +
                                "<option type='lang' value='null'>请选择</option>" +
                                "</select><br>" +
                                '版本参数:<textarea name="textfield3" cols="100" rows="3" id="data_text_'+ id +'"></textarea><br>'+'<br>'
                            ;

                            document.getElementById("textarea").appendChild(tmp);
                            var selectl = document.getElementById("mac_version_up_language_select_" + id);
                            for (var i = 0; i < language.length; i++){
                                var option = document.createElement("option");
                                option.type = "lang";
                                option.value = language[i];
                                option.innerHTML = language[i];
                                selectl.appendChild(option);
                            }
                        };
                    }

                    function do_version_upload() {   
                        var iframes = document.getElementsByName('upload_file_iframe');
                        if (num >= iframes.length) {
                            //mac_version_up_class(nodes_control_div,'yes');
                            comc_version_upload('yes');
                            return;
                        }
                        var doc = iframes[num].contentDocument || iframes[num].contentWindow.document;
                        var version_num = document.getElementById("mac_version_up_num_text").value;
                        var select = document.getElementById("mac_version_up_type_select");
                        var form = doc.getElementById("up_file_form");

                        if (doc.getElementById("dupload_data").value == '') {
                            num += 1;
                            do_version_upload();
                        }
                        if (select.value == 'null') {
                            alert("请填写正确的信息！");
                            return;
                        }
                        if (version_num == '' && isNaN(select.value)) {
                            alert("请填写正确的信息！");
                            return;
                        }

                        if (doc.getElementById("dupload_data").value.length == 0)
                            return;

                        var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                        // var version = [];
                        // version.push(encodeURI(version_num));
                        if (isNaN(select.value)) {
                            form.action += '&dnid=' + nid +
                                '&dversion=1' +
                                '&dversion_type=' + select.value +
                                '&dversion_version__x_countz_=1' +
                                '&dversion_version=' + encodeURI(version_num);
                        } else {
                            // var special_version_path = space_paths[select.value];
                            // form.action+= '&dnid='+nid +
                            //     '&drequest=upload_special_version' +
                            //     '&dpath='+encodeURIComponent(special_version_path);
                        } 
                        form.submit();
                    }

                    for (var k = 0; k < upload_num; k++) {
                        var iframe = document.createElement("iframe");
                        var tmp_p = document.createElement("p");
                        tmp_p.appendChild(iframe);
                        mac_version_up_div.appendChild(tmp_p);
                        iframe.frameBorder = 0;
                        iframe.height = 25;
                        iframe.value = "0";
                        iframe.name = 'upload_file_iframe';
                    }
                    for (num = 0; num < upload_num; num++) {
                        var iframe_num = document.getElementsByName('upload_file_iframe')[num];
                        iframe_build();
                        evt.bind(iframe_num, 'load', upload_result);
                    }

                    mac_version_up_div.appendChild(version_div);
                    version_bulid();
                    document.getElementById("mac_version_up_Confirm_button").onclick = function () {
                        num = 0;
                        var selectl = document.getElementById("mac_version_up_language_select_" + id);
                        var text = document.getElementById("data_text_"+id).value;
                        var descs = {lang:selectl.value, text:text};
                        desc.push(descs);
                        var select = document.getElementById("mac_version_up_type_select");
                        var version_num= document.getElementById("mac_version_up_num_text").value;
                        var version_manage={type: select.value, version: version_num};
                        var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                        var req={nid: nid, version_manage: version_manage, desc: desc};
                       
                        ms.send_msg('comc', 'comc_conf_version_desc_req', req, function (type, data) {
                                if (type != "comc_conf_version_desc_ack") {
                                    ms.error('show', "版本描述设置", '未知错误');
                                    return;
                                }
                                if (data.result == '') {
                                    ms.error('show', "版本描述设置", '成功！');
                                } else {
                                    ms.error('show', "版本描述设置", data.result);
                                }
                            }
                        );
                        do_version_upload();
                    };
                }

                //lock up, open lock and delete about version
                function do_mac_version_req(mac_version, req, mac_version_up_div) {
                    var flag;

                    var mac_versions_checked = [];
                     
                    for (var j = 0; j < mac_version.length; j++) {
                        var version_type = mac_version[j]["type"];
                        var mac_version_checked = {};
                        mac_version_checked["type"] = version_type;
                        var mac_version_child = mac_version[j]["version"];
                        mac_version_checked["version"] = [];
                        for (var i = 0; i < mac_version_child.length; i++) {
                            if (document.getElementById(version_type + '_checkbox_' + i).checked) {
                                 
                                var mac_version_child_checked = mac_version_checked["version"];
                                mac_version_child_checked[mac_version_child_checked.length] = document.getElementById(version_type + '_checkbox_' + i).value;
                            }
                        }
                        if (mac_version_checked["version"] != undefined && mac_version_checked["version"].length > 0)
                            mac_versions_checked.push(mac_version_checked);
                    }
                     
                    if (mac_versions_checked.length == 0) {
                        alert("请选择版本！");
                        return;
                    }

                    if (req == 'open_lock') {
                        flag = 1;
                    } else if (req == 'lock_up') {
                        flag = 0;
                    } else if (req == 'del_version') {
                        flag = 3;
                    }
                    var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                    ms.send_msg('comc', 'comc_set_conf_version_req',
                        {
                            nid: nid,
                            flag: flag,
                            versions: mac_versions_checked
                        },
                        function (type, data) {
                            if (data.result == 'success') {
                                ms.error('show', req, '成功！');
                                if (mac_version_up_div == undefined) {
                                    comc_version_upload();
                                } else {
                                    if (data.version != undefined && data.version != null) {
                                        mac_version_up_div.innerHTML = JSON.stringify(data.version);
                                    }
                                }
                            } else {
                                ms.error('show',req+' 失败', data.result);
                            }
                        });
                }

                //get version file status
                function do_mac_version_status_req(mac_version, req, mac_version_up_div) {
                    var mac_version_checked = {};
                    checkbox_once:
                        for (var j = 0; j < mac_version.length; j++) {
                            var version_type = mac_version[j]["type"];
                            var mac_version_child = mac_version[j]["version"];
                            for (var i = 0; i < mac_version_child.length; i++) {
                                if (document.getElementById(version_type + '_checkbox_' + i).checked) {
                                    mac_version_checked["type"] = version_type;
                                    mac_version_checked["version"] = [];
                                    mac_version_checked["version"].push(document.getElementById(version_type + '_checkbox_' + i).value);
                                    break checkbox_once;
                                }
                            }
                        }

                    if (Object.getOwnPropertyNames(mac_version_checked).length == 0) {
                        alert("请选择版本！");
                        return;
                    }
                    var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                    ms.send_msg('comc', 'comc_get_conf_version_info_req',
                        {
                            nid: nid,
                            versions: mac_version_checked
                        },
                        function (type, data) {
                            if (data.result == '') {
                                ms.error('show', "获取版本信息", '成功！');
                                if (mac_version_up_div == undefined && req == "get_version_file_status") {
                                    comc_version_upload();
                                } else {
                                    var versions_info = data.versions_info;
                                     
                                    if (versions_info != undefined && versions_info != null) {
                                        for (var i = 0; i < versions_info.length; i++) {
                                            var verison_info = versions_info[i];//{}
                                            if (verison_info != undefined) {
                                                mac_version_up_div.innerHTML = '';
                                                var files = verison_info.file;//[]

                                                for (var j = 0; j < files.length; j++) {
                                                    var file_info = files[j];
                                                    mac_version_up_div.innerHTML += '<p>' + file_info.name + ' : ' + store_size_DP(file_info.size) + '</p>';
                                                }
                                            }
                                        }
                                    }
                                }
                            } else {
                                ms.error('show', "获取版本信息失败", data.result);
                            }
                        });
                }
            }

            function comc_get_node_list_class(div) {
                var req = {};
                div.innerHTML = '';
                var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                req.nid = nid;

                function send_to_get_node_list() {
                    ms.send_msg('comc', 'comc_nodes_list_req', req, function (type, data) {
                        if (type != 'comc_nodes_list_ack') {
                            return;
                        }
                        if (data.result == "") {
                            nodes_list = data;
                            //show node list
                            show_node_list(show_node_list_div, data);
                        } else {
                            alert(data.result);
                        }
                    });
                }

                comc_go_back_home.onclick = function () {
                    fork();
                };
                send_to_get_node_list();
            }

            function show_node_list(div, data) {
                var comc_nodes = data.comc_nodes;
                div.innerHTML = '';
                var num = 0;
                var node_data = [];
                for (var k = 0; k < comc_nodes.length; k++) {
                    div.innerHTML += '<label id="' + k + comc_nodes[k].name + k + '" style="color: #4169E1 ;font-size: 16px "></label><br/>';
                    document.getElementById(k + comc_nodes[k].name + k).innerHTML = comc_nodes[k].name;
                    for (var i = 0; i < comc_nodes[k].nodes.length; i++) {
                        if (comc_nodes[k].nodes[i].name == "" || comc_nodes[k].nodes[i].name == "undefined") {
                            comc_nodes[k].nodes[i].name = "undefined" + num;
                            num++;
                        }
                        node_data[i] = JSON.parse(comc_nodes[k].nodes[i].data);
                        node_data[i].comp = node_data[i].comp ? JSON.stringify(node_data[i].comp) : "unknown";
                        div.innerHTML += '<br>' +
                            '<button id="' + comc_nodes[k].nodes[i].name + i + '">' + comc_nodes[k].nodes[i].name + '</button>&nbsp;&nbsp;' +
                            '</br></p>';
                        document.getElementById(comc_nodes[k].nodes[i].name + i).style.background = "#66cccc";
                    }
                }

                var node_main = {};
                for (var k1 = 0; k1 < comc_nodes.length; k1++) {
                    for (var j = 0; j < comc_nodes[k1].nodes.length; j++) {
                        node_main[comc_nodes[k1].nodes[j].name + j] = comc_nodes[k1].nodes[j];
                        document.getElementById(comc_nodes[k1].nodes[j].name + j).onclick =
                            function () {
                                var node_name = node_main[this.id].name;
                                node_class(node_name);
                                document.getElementById("comc_node_monitor_log_div").style = "display:block;";
                                document.getElementById("show_node_list_div").style = "display:none;";
                                comc_go_back_home.style = "display:none;";
                                document.getElementById("monitor_excep_notice").style = "display:none;";
                            };
                    }
                }
            }

            function node_list(obj) {
                var nodes = obj,
                    node_list = document.getElementById("comc_version_nodes_show_div");
                if (node_list == null)return;
                node_list.innerHTML = '<h1>nodes_list</h1></br>';
                if (nodes.length) {
                    for (var i = 0; i < nodes.length; i++) {
                        nodes_name[i] = nodes[i].name;
                        var tmp = document.createElement("p"),
                            node_button = document.createElement("button"),
                            data = document.createElement("p");
                        node_button.id = 'node_' + nodes_name[i] + '_button';

                        node_button.innerHTML = '<span style="font-size:14px;"><b>' + nodes[i].name + '</b></span>';
                        node_button.value = nodes[i].name;
                        node_list_names[i] = nodes[i].name;
                        node_list.appendChild(tmp);
                        tmp.appendChild(node_button);
                        tmp.appendChild(data);
                        node_list.innerHTML += '</br>';
                    }

                    for (var k = 0; k < nodes_name.length; k++) {
                        document.getElementById('node_' + nodes_name[k] + '_button').onclick = function () {
                            var name = this.value;
                            node_class(div, name, comc_nodes_data);
                        }
                    }
                }
            }
        }

        function node_class(div, name, comc_nodes_data) { 
            node = {node_data: null, cli_version_now: null, version: null, srv_web_ver_now: {"server": null, "web": null}};
            var node_name = name;
            var web_version_data_all = [], web_version_data = [];//web conf
            var web_versions_now = [];//web version:web,product,device
            var web_type = '';

            document.getElementById("option_page").style="display:none;";
            div.innerHTML = '';
            div.innerHTML = '<div id="version_management_div">' +
                '<center><h1 value="0" style="font-size: 18px" style="display: "">'+ node_name + '</button><br></center>' +
                '<div class="demo_line_05">-----------------------------------------------------------------------------------------------------------------------------------</div>'+
                '<button  id="comc_version_upload_btn" value="0" style="font-size: 14px">上传版本</button>&nbsp;&nbsp;' +
                '<button id="comc_get_file_list_btn" value="1" style="font-size: 14px">刷新</button>&nbsp;&nbsp;'+
                '<button id="comc_version_upload_back_btn" value="1" style="font-size: 14px">返回</button>&nbsp;&nbsp;'+
                '<div id="node_version_upload_div" style="display: none;"></div>' +
                '<div id="node_version_manage_div" style="display: none;"></div>' +

                '<div id="version">' +
                    '<div id="version_head_div">' +
                    '<h1>version</h1>' +
                    '<p id="node_server_status"><span style="font-size:20px;"><b>服务器状态: </b>&nbsp;</span>' +
                    '<label id="node_server_status_txt"></label>&nbsp;&nbsp;&nbsp;'+
                    '<button id="comc_start_srv_button">启动服务器</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '<button id="comc_stop_srv_button">停止服务器</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '</p></br>' +
                    '<button id="version_manage_button" value="0">版本管理</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '<button id="switch_version_button">解压/切换版本</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '<button id="del_version_button">删除版本</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '<button id="del_dps_ccms_button">删除CCMS仓库</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '</div>' +
                    '<div id="version_div">' +
                    '<div id="server">' +
                    '<p id="server_p"><span style="font-size:24px;"><b>server</b></span>&nbsp;&nbsp;</p>' +
                    '<p><input id="server_version_now" type="text" style="width:640px;border:0;text-align:center;font-size:18px" readonly="true"/>&nbsp;&nbsp;</p>'+
                    '</div>' +
                    '<div id="web">' +
                    '<p id="web_p"><span style="font-size:24px;"><b>web&nbsp;&nbsp;</b></span><span style="font-size:18px;"><b></b></span></p>' +
                    '</div>'+
                    '</div>' +

                    '<div id="version_web_div">' +
                    '<h2>WEB-CONF</h2>' +
                    '类型&nbsp;<select id="web_type_select"></select>&nbsp;&nbsp;&nbsp;' +
                        '<div id="version_web_head_div">' +
                        '<p>' +
                        '版本&nbsp;<select id="web_name_select"><option type="radio" value="null">NULL</option></select>&nbsp;&nbsp;&nbsp;' +
                        '<button id="web_add_name_button">增加版本</button>&nbsp;&nbsp;&nbsp;' +
                        '<button id="web_del_name_button">删除版本</button>&nbsp;&nbsp;&nbsp;' +
                        '<button id="web_version_back_button">切回旧版本</button>&nbsp;&nbsp;&nbsp;' +
                        '<button id="web_update_index_button">更新Index</button>&nbsp;&nbsp;&nbsp;' +
                        '</p>' +
                        '</div>' +
                        '<div id="version_web_data_div"></div>' +
                        '<div id="version_web_button_div" style="display: none">' +
                        '<p>' +
                        '<button id="web_add_version_child_button">添加项</button>&nbsp;&nbsp;&nbsp;' +
                        '<button id="web_modify_version_child_button">修改</button>&nbsp;&nbsp;&nbsp;' +
                        '<button id="web_version_apply_button">提交</button>&nbsp;&nbsp;&nbsp;' +
                        '</p></br>' +
                        '</div>' +
                    '</div>' +

                '<div id="version_client_div" style="display: none">' +
                '<h2>client</h2>' +
                    '<div id="version_client_button_div" >' +
                    '<button id="switch_client_version_debug_button">切换Debug</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '<button id="switch_client_version_testing_button">切换Testing</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '<button id="switch_client_version_stable_button">切换Stable</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '<button id="switch_client_version_main_button">切换Main</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '<button id="switch_version_stable_ABtest_button">Stable灰度发布</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '</div>' +
                    '<div id="switch_version_stable_ABtest_button_div"></div>' +
                '</div>' +

                '<div id="version_ipc_div" style="display: none">' +
                '<h2>IPC</h2>' +
                    '<div id="version_ipc_button_div" >' +
                    '<button id="switch_version_debug_button">切换Debug</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '<button id="switch_version_testing_button">切换Testing</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '<button id="switch_version_stable_button">切换Stable</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '<button id="switch_version_main_button">切换Main</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '<br><button id="set_ipc_version_select_button" value="0">固件灰度配置</button>' +
                    '</div>' +

                    '<div id="set_ipc_version_select_div" style="display:none;">' +
                    '<div id="set_ipc_version_select_info_div">' +
                    '<p id="set_ipc_version_select_info_p">' +
                    '<input type="text" value="设备ID" style="width:60px;border:0;text-align:center" readonly="true" /> :&nbsp;<input type="text" name="ipc_select_id"/>&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '<input type="text" value="版本ID" style="width:60px;border:0;text-align:center" readonly="true" /> :&nbsp;<input type="text" name="ipc_select_version"/>&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '<input type="text" value="版本Status" style="width:70px;border:0;text-align:center" readonly="true" /> :&nbsp;<input type="text" name="ipc_select_status"/>&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '</p>' +
                    '</div>' +
                    '<div id="set_ipc_version_select_file_div" style="display:none;"></div>' +
                    '<button id="set_ipc_version_select_add_button">添加</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '<button id="set_ipc_version_select_file_button" value="0">选择文件方式</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '<button id="set_ipc_version_select_confirm_button">确认</button>' +
                    '</div>' +
                '</div>' +
                '</div>';

            var node_version_upload_div = document.getElementById("node_version_upload_div");
            var node_version_manage_div = document.getElementById("node_version_manage_div");
            var comc_version_upload_btn = document.getElementById("comc_version_upload_btn");
            var node_server_status_txt = document.getElementById("node_server_status_txt");

            var comc_name = find_comc(name);
            var srv_type = find_node_srv_type(name);
            var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
            ms.send_msg('comc', 'comc_switch_server_req', {
                nid: nid,
                flag: 6,
                js: srv_type,
                name: [name]
            }, function (type, data) {
                if (type == "comc_switch_server_ack") { 
                    if (data.result == '') {  
                        ms.error('show', '获取服务器状态', 'success');
                        node_server_status_txt.innerHTML = data["status"];
                    } else {
                        ms.error('show', '获取服务器状态', data["result"]);
                    }
                } else {
                    ms.error('show', '获取服务器状态', '未知错误');
                }
            });

            document.getElementById("comc_version_upload_back_btn").onclick = function() {
                version_management(div);
            };

            comc_version_upload_btn.onclick = function() {
                if (node_version_upload_div.style.display != 'none') {
                    node_version_upload_div.style.display = 'none';
                    return;
                }
                node_version_upload_div.style.display = 'block';
                node_version_upload(node_version_upload_div);
            };

            // var page_version = document.getElementById('version_div');
            // for (var i = 0; i < 2; i++) {
            //     var tmp = document.createElement("div");
            //     tmp.id = version_type[i];
            //     tmp.innerHTML = '<p id="' + version_type[i] + '_p"><span style="font-size:24px;"><b>' + version_type[i] + '</b></span>&nbsp;&nbsp;</p>' +
            //         '<input id="' + version_type[i] + '_version_now" type="text" style="width:640px;border:0;text-align:center;font-size:18px" readonly="true"/>&nbsp;&nbsp;</p>';
            //     page_version.appendChild(tmp);
            // }

            var client_version_page = document.getElementById('version_client_div');
            for (var k = 0; k < client_type.length; k++) {
                var tmp_client = document.createElement("div");
                tmp_client.id = client_type[k];
                tmp_client.innerHTML = '<p id="' + client_type[k] + '_p"><span style="font-size:18px;"><b>' + client_type[k] + '</b></span>&nbsp;&nbsp;</p>';
                client_version_page.appendChild(tmp_client);
            }

            var ipc_version_page = document.getElementById('version_ipc_div');
            for (var j = 0; j < version_ipc_type.length; j++) {
                var tmp_ipc = document.createElement("div");
                tmp_ipc.id = version_ipc_type[j];
                tmp_ipc.innerHTML = '<p id="' + version_ipc_type[j] + '_p"><span style="font-size:18px;"><b>' + version_ipc_type[j] + '</b></span>&nbsp;&nbsp;</p>';
                ipc_version_page.appendChild(tmp_ipc);
            }
            var comc_name = find_comc(name); 
            var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
            ms.send_msg('comc', 'comc_get_server_verison_req', {
                nid: nid,
                flag: 1,
                comc_name: comc_name,
                name: [name]
            }, function (type, data) {
                if (type == "comc_get_server_verison_ack")
                    show_server_version_status(data);
            });

            ms.send_msg('comc', 'comc_get_web_version_req', {
                nid: nid,
                comc_name: comc_name,
                name: [name]
            }, function (type, data) {
                if (type == "comc_get_web_version_ack") {
                    if (data["result"] == '') {  
                        ms.error("show", "获取web版本", "成功");
                        show_web_version_status(data);
                    } else {
                        ms.error("show", "获取web版本", data.result);
                    }
                } else {
                    ms.error("show", "获取web版本", "未知错误");
                }
            });
            // ms.send_msg('comc', 'comc_get_web_conf_req', {
            //     nid: nid,
            //     flag: 0,
            //     name: name
            // }, function (type, data) {
            //     if (type == "comc_get_web_conf_ack")
            //         show_web_conf(data);
            // });

            ms.send_msg('comc', 'comc_get_client_version_req', {
                nid: nid,
                name: name
            }, function (type, data) { 
                var info = '暂无';
                if (type != "comc_get_client_version_ack") {
                    info = '数据错误';
                    ms.error('show', '获取client版本的status', '连接服务器失败！');
                    return;
                }
                if (data["result"] != '') {
                    info = '数据错误';
                    ms.error('show', '获取client版本的status', data["result"]);
                    return;
                }
                ms.error('show', '获取client版本的status', '成功');
                 
                if (data["client_version_all"] != undefined && data["client_version_all"].length == 0) {
                    node.ccvs_flag = 'no';
                } else {
                    document.getElementById("version_client_div").style.display = '';
                    node.cli_version_now = data["client_version_all"];//[]
                    for (var i=0 ;i< client_type.length;i++) {
                        for (var k=0 ;k< data["client_version_all"].length;k++) {
                            var cli_type = data["client_version_all"][k].type;
                            if (cli_type == client_type[i]) {
                                var vers_div = document.getElementById(client_type[i]);
                                var vers_status = data["client_version_all"][k].version;//{}
                                vers_div.innerHTML += '<p id="' + client_type[i] + '_version_now"' + '></p>';
                                for (var vers_status_type in vers_status) {
                                    document.getElementById(cli_type + "_version_now").innerHTML += '<b>' + vers_status_type +
                                        '：&nbsp;</b>' + (vers_status[vers_status_type] == "" ? info : vers_status[vers_status_type]) + '<br>';
                                }
                                break;
                            }
                        }
                    }
                    document.getElementById("version_ipc_div").style.display = '';
                    for (var j = 0; j <version_ipc_type.length; j++) {
                        for (var h=0 ;h< data["client_version_all"].length;h++) {
                            var type = data["client_version_all"][h].type;
                            if (type == version_ipc_type[j]) {
                                var ipc_div = document.getElementById(type);
                                var ipc_status = data["client_version_all"][h]["version"];
                                ipc_div.innerHTML += '<p id="' + type + '_version_now"' + '></p>';
                                for (var ipc_status_type in ipc_status) {
                                    document.getElementById(type + "_version_now").innerHTML += '<b>' + ipc_status_type + '：&nbsp;</b>' + (ipc_status[ipc_status_type] == "" ? info : ipc_status[ipc_status_type]) + '<br>';
                                }
                                break;
                            }
                        }
                    }
                }
            });

            document.getElementById("version_manage_button").onclick = function () {
                if (this.value == '1') return;
                this.value = '1';
                do_show_version_button();
            };

            document.getElementById("switch_version_button").onclick = function () {
                var version_manage_button = document.getElementById("version_manage_button");
                if (version_manage_button.value == '0') {
                    version_manage_button.value = '1';
                    do_show_version_button();
                    return;
                }
                for (var i = 0; i < version_type.length; i++) {
                    var select = document.getElementById(version_type[i] + '_select');
                    if (select.value == 'null')
                        continue;
                    var flag;  
                    if (version_type[i] == "web") {
                        flag = 4;
                        var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                        var req = {nid: nid, flag: flag, name: [name], version: select.value};
                        ms.send_msg('comc', 'comc_switch_server_req', req, function (type, data) {
                            if (type == "comc_switch_server_ack") {
                                if (data.result == '') {
                                    ms.error('show', '切换节点' + name + '的版本', "成功");
                                    
                                    document.getElementById('web_version_now').value = '当前版本：' +
                                        node.srv_web_ver_now["web"];
                                } else {
                                    ms.error('show', '切换节点' + name + '的版本', data["result"]);
                                }
                            } else {
                                ms.error('show', '切换节点' + name + '的版本', "未知错误");
                            }
                        });
                    } else if (version_type[i] == "server") {
                        flag = 1;
                        var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                        var req = {flag: flag, name: [name], version: select.value};
                        var versions_tmp = {version: select.value, type: "server"};
                        ms.send_msg('comc', 'comc_get_conf_version_info_req',
                            {
                                nid: nid,
                                versions: versions_tmp
                            }, function (type, data) {
                                if (data.result == '') {
                                    ms.error('show', "获取版本信息", '成功！');
                                    var js = -1;
                                    var versions_info = data["versions_info"] || [];
                                    var version_info = versions_info[0] || [];
                                    var version_files = version_info["file"];
                                    var version_num = versions_info["version"];

                                    for (var v = 0; v < version_files.length; v++) {
                                        var file_name = version_files[v].name;
                                        if (file_name.indexOf("node_bin") == 0 || file_name.indexOf("node_js") == 0) {
                                            js = 1;
                                            break;
                                        } else if (file_name.indexOf("magent") == 0 || file_name.indexOf("mnode") == 0) {
                                            js = 0;
                                            break;
                                        }
                                    }
                                    var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                                    req.nid = nid;
                                    req.js = js;
                                    ms.send_msg('comc', 'comc_switch_server_req', req, function (type, data) {
                                        if (type == "comc_switch_server_ack") {
                                            if (data.result == '') {
                                                ms.error('show', '切换节点' + name + '的版本', "成功");
                                                
                                                var comc_name = find_comc(name); 
                                                var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                                                ms.send_msg('comc', 'comc_get_server_verison_req', {
                                                    nid: nid,
                                                    flag: 1,
                                                    comc_name: comc_name,
                                                    name: [name]
                                                }, function (type, data) {
                                                    if (type == "comc_get_server_verison_ack")
                                                        show_server_version_status(data);
                                                });
                                                // node.srv_web_ver_now["server"] = version_num;
                                                // document.getElementById('server_version_now').value = '当前版本：' +
                                                //     node.srv_web_ver_now["server"];
                                            } else {
                                                ms.error('show', '切换节点' + name + '的版本', data["result"]);
                                            }
                                        } else {
                                            ms.error('show', '切换节点' + name + '的版本', "未知错误");
                                        }
                                    });
                                } else {
                                    ms.error('show', "获取版本信息失败", data.result);
                                }
                            });
                    }



                }
            };
            //del node version
            document.getElementById("del_version_button").onclick = function () {
                var version_manage_button = document.getElementById("version_manage_button");
                if (version_manage_button.value == '0') {
                    version_manage_button.value = '1';
                    do_show_version_button();
                    return;
                }
                for (var i = 0; i < version_type_all.length; i++) {
                    var select = document.getElementById(version_type_all[i] + '_select');
                    if (select == undefined || select.value == 'null'){
                        ms.error('show', '删除节点' + name + '的版本', 'no version of '+ version_type_all[i]+ ' selected');
                        continue;
                    } 
                    var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                    ms.send_msg('comc', 'comc_set_node_version_req', {
                        nid: nid,
                        flag: 3,
                        name: name,
                        versions: [{type: version_type_all[i], version: [select.value]}]
                    }, function (type, data) {
                        if (type == "comc_set_node_version_ack") {
                            if (data.result == '') {
                                ms.error('show', '删除节点' + name + '的版本', 'success');
                                // do_show_version();
                            } else {
                                ms.error('show', '删除节点' + name + '的版本', data["result"]);
                            }
                        }
                    });
                }
            };
            //
            document.getElementById("switch_version_stable_ABtest_button").onclick = function (){
                var version_data =  (node && node.version )? node.version : null;
                if (!version_data) {
                    alert("请点击《版本管理》按钮！");
                    return;
                }
                var div = document.getElementById('switch_version_stable_ABtest_button_div');
                div.innerHTML='平台&nbsp;<select id="version_ABtest_type_select"></select>&nbsp;&nbsp;&nbsp;版本号&nbsp;' +
                    '<select id="version_ABtest_num_select"></select>&nbsp;&nbsp;&nbsp;' +
                    '<button id="version_get_ABtest">获取灰度发布情况</button>&nbsp;&nbsp;&nbsp;' +
                    '<button id="version_set_ABtest">更新灰度发布</button>' +
                    '<div id="version_show_ABtest_div"></div>';
                var ABtest_list = null;
                var select_type = document.getElementById("version_ABtest_type_select"),
                    select_num = document.getElementById("version_ABtest_num_select");
                var option,
                    option_null = document.createElement("option");
                option_null.type = "radio";
                option_null.value = '';
                option_null.innerHTML = 'Null';
                select_type.appendChild(option_null);
                select_num.appendChild(option_null);

                var item;
                for(var i=0; i < version_type_all.length; i++){
                    item = version_type_all[i];
                    if (item == "server" || item == "web") continue;
                    option = document.createElement("option");
                    option.type = "radio";
                    option.value = item;
                    option.innerHTML = item;
                    select_type.appendChild(option);
                }
                select_type.onchange= function(){
                    select_num.innerHTML="";
                    select_num.appendChild(option_null);
                    var version_nums = [];
                    for (var j = 0; j < version_data.length; j++) {
                        var type = version_data[j].type;
                        if (this.value == type){
                            version_nums = version_data[j].version;//[]
                            break;
                        }
                    }
                    if(version_nums.length > 0){
                        for(var i=0; i < version_nums.length; i++){
                            item=version_nums[i];
                            option = document.createElement("option");
                            option.type = "radio";
                            option.value = item;
                            option.innerHTML = item;
                            select_num.appendChild(option);
                        }
                    }
                };
                //获取灰度发布
                document.getElementById("version_get_ABtest").onclick = function (){
                    var version_type = select_type.value,
                        version_num = select_num.value;
                    if(!version_type || !version_num) {
                        alert("请选择正确的平台与版本号");
                        return;
                    }
                    
                    var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                    ms.send_msg_from('comc', 'comc_version_get_ABtest_req',
                        {nid: nid, node_name:name, version_type:version_type, version_num:version_num},
                        function (type, data) {
                            if (data.result != ''){
                                ms.error('show', '获取stable灰度发布数据失败', data.result);
                                return;
                            }
                            ms.error('show', '获取stable灰度发布数据', '成功');
                            ABtest_list = data.location;   
                            if (ABtest_list == undefined) {
                                ms.error('show', '获取stable灰度发布数据', '无数据');
                                return;
                            }
                            var vid=document.getElementById("version_show_ABtest_div");
                            vid.innerHTML="";
                            show_ABtest(vid, ABtest_list);
                        });
                };
                //设置灰度发布
                document.getElementById("version_set_ABtest").onclick = function (){
                    if(!ABtest_list || ABtest_list.length <= 0){
                        alert("先查看灰度发布情况，设置数据后，再次更新");
                        return;
                    }
                    var version_type = select_type.value,
                        version_num = select_num.value;
                    if(!version_type || !version_num) {
                        alert("请选择正确的平台与版本号");
                        return;
                    }
                    var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                    var rules = [];
                    var req={nid: nid, node_name:name, version_type:version_type, version_num:version_num, all:0, rate:0, rules:rules};
                    for(var i=0; i<ABtest_list.length; i++){
                        var text = document.getElementById("ABtest_"+ABtest_list[i].name);
                        var value;
                        if(text && (value=text.value) && value != "0"){
                            if(ABtest_list[i].name == "root"){
                                req.all = 1;
                                req.rate = value;
                            }else{
                                var rule={area:ABtest_list[i].name, rate:parseInt(value)};
                                rules.push(rule);
                            }
                        }
                    }
                    ms.send_msg_from('comc', 'comc_version_set_ABtest_req', req, function (type, data) {
                        if (type == 'comc_version_set_ABtest_ack') {
                            if (data.result){
                                ms.error('show', '更新stable灰度发布数据失败：', data.result);
                            } else {
                                ms.error('show', '更新stable灰度发布数据', '成功');
                            }
                        }
                    });
                };
            };
            
            //app client
            document.getElementById("switch_client_version_debug_button").onclick = function () {
                do_switch_client_status('debug');
            };
            document.getElementById("switch_client_version_testing_button").onclick = function () {
                do_switch_client_status('testing');
            };
            document.getElementById("switch_client_version_stable_button").onclick = function () {
                do_switch_client_status('stable');
            };
            document.getElementById("switch_client_version_main_button").onclick = function () {
                do_switch_client_status('main');
            };
            
            //ipc client
            document.getElementById("switch_version_debug_button").onclick = function () {
                do_switch_ipc_status('debug');
            };

            document.getElementById("switch_version_testing_button").onclick = function () {
                do_switch_ipc_status('testing');
            };

            document.getElementById("switch_version_stable_button").onclick = function () {
                do_switch_ipc_status('stable');
            };

            document.getElementById("switch_version_main_button").onclick = function () {
                do_switch_ipc_status('main');
            };
            function find_node_srv_type(node_name) {
                var srv_type = 2;
                
                for (var i = 0; i < comc_nodes_data.length; i++) {
                    var nodes = comc_nodes_data[i].nodes;
                    for (var j = 0; j < nodes.length; j++) {
                        if (nodes[j].name == node_name) {
                            var node_data = nodes[j].data;
                            node_data = JSON.parse(node_data);
                            var srv_data = node_data.node_ver;
                            srv_data = srv_data.split(" ");
                            
                            if (srv_data.length > 0) { 
                                if (srv_data[0].length > 2) {
                                    srv_type = 0;
                                }
                                if (srv_data[1] != undefined && srv_data[1].length > 5) {
                                    srv_type = 1;
                                }
                            }
                            return srv_type;
                        }
                    }
                }
                return srv_type;
            }
            document.getElementById("comc_start_srv_button").onclick = function () {
                var button = this;
                button.disabled = true;
                var srv_type = find_node_srv_type(name);
                var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                ms.send_msg('comc', 'comc_switch_server_req', {
                    nid: nid,
                    flag: 2,
                    js: srv_type,
                    name: [name]
                }, function (type, data) {
                    if (type == "comc_switch_server_ack") {
                        if (data.result == '') {
                            ms.error('show', '启动服务器', 'success');
                            node_server_status_txt.innerHTML = 'Start';
                        } else {
                            ms.error('show', '启动服务器', data["result"]);
                        }
                    } else {
                        ms.error('show', '启动服务器', '未知错误');
                    }
                    button.disabled = false;
                });
            };

            document.getElementById("comc_stop_srv_button").onclick = function () {
                var button = this;
                button.disabled = true;
                var srv_type = find_node_srv_type(name);
                var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                ms.send_msg('comc', 'comc_switch_server_req', {
                    nid: nid,
                    flag: 5,
                    js: srv_type,
                    name: [name]
                }, function (type, data) {
                    if (type == "comc_switch_server_ack") {
                        if (data.result == '') {
                            node_server_status_txt.innerHTML = 'Stop';
                            ms.error('show', '停止服务器', 'success');
                        } else {
                            ms.error('show', '停止服务器', data["result"]);
                        }
                    } else {
                        ms.error('show', '停止服务器', '未知错误');
                    }
                    button.disabled = false;
                });
            };

            document.getElementById("del_dps_ccms_button").onclick = function (){
                var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                var button = this;
                button.disabled = true;
                ms.send_msg('comc', 'comc_del_dps_ccms_req', {nid: nid, node: name}, function (type, data){
                    button.disabled = false;
                    if(type != "comc_del_dps_ccms_ack"){
                        ms.error('show', "删除ccms仓库", "未知错误");
                        return;
                    }
                    if (data["result"] == '') {
                        ms.error('show',"删除ccms仓库", '成功');
                    } else {
                        ms.error('show', "删除ccms仓库", data["result"]);
                    }
                });
            };

            document.getElementById("web_type_select").onchange = function () { 
                document.getElementById("version_web_button_div").style.display = 'none';
                document.getElementById("version_web_data_div").innerHTML = '';
                web_type = this.value;
                for (var i =0 ; i < web_version_data_all.length; i++){
                    if (this.value == web_version_data_all[i].type){
                        web_version_data = web_version_data_all[i].conf || [];
                    }
                }
                
                var web_name_select = document.getElementById("web_name_select");
                if( typeof(web_version_data) == "object"){
                    for (var j = 0;j < web_version_data.length; j++) {
                        var web_name = web_version_data[j].name;
                        var option = document.createElement("option");
                        option.type = "radio";
                        option.value = web_name;
                        option.innerHTML = web_name;
                        web_name_select.appendChild(option);
                    }
                }else{
                    web_name_select.innerHTML='<option type="radio" value="null">NULL</option>';
                }
            };

            document.getElementById("web_name_select").onchange = function () { 
                document.getElementById("version_web_button_div").style.display = '';
                var version_web_data_div = document.getElementById("version_web_data_div");
                version_web_data_div.innerHTML = '';
                if (this.value == 'null') return;

                for (var i = 0; i < web_version_data.length; i++){
                    var web_child = web_version_data[i];
                    if (web_child.name == this.value) { 
                        var obj_data = {};
                        obj_data = web_child.value;  
                        if(obj_data == undefined) {
                            continue;
                        }
                        // obj_data = JSON.parse(obj_data);
                        obj_data = JSON.parse(obj_data);
                        for (var name in obj_data){
                            var obj_string = '';
                            if (typeof(obj_data[name]) == "object") {
                                obj_string = JSON.stringify(obj_data[name]);
                            } else {
                                obj_string = obj_data[name];
                            }

                            version_web_data_div.innerHTML += '<p>' +
                                '<input type="text" name="web_version_child_name_text" value="' + name + '"/>' +
                                '&nbsp;:&nbsp;<input type="text" name="web_version_child_data_text" value=' + obj_string + ' style="width:580px;"/>' +
                                '</p>';
                        }

                    }
                }
                // if (web_child == undefined) return;
                // for (var obj in web_child) {
                //     var obj_string = '',
                //         obj_data = web_child[obj];
                //     if (typeof(obj_data) == "object") {
                //         obj_string = JSON.stringify(obj_data);
                //     } else {
                //         obj_string = obj_data;
                //     }
                //     version_web_data_div.innerHTML += '<p>' +
                //         '<input type="text" name="web_version_child_name_text" value="' + obj + '"/>' +
                //         '&nbsp;:&nbsp;<input type="text" name="web_version_child_data_text" value=' + obj_string + ' style="width:580px;"/>' +
                //         '</p>';
                // }
            };

            document.getElementById("web_add_name_button").onclick = function () {
                document.getElementById("version_web_button_div").style.display = '';
                var version_web_data_div = document.getElementById("version_web_data_div");
                version_web_data_div.innerHTML = '<p>域名&nbsp;:&nbsp;<input type="text" id="web_add_name_text" style="width:400px;"/>&nbsp;' +
                    '<button id="web_add_name_confirm_button" >确定</button>' +
                    '</p>';
                document.getElementById("web_add_name_confirm_button").onclick = function () {
                    var web_name = document.getElementById("web_add_name_text").value;
                    var option = document.createElement("option");
                    option.type = "radio";
                    option.value = web_name;
                    option.innerHTML = web_name;
                    document.getElementById("web_name_select").appendChild(option);
                    web_version_data[web_version_data.length] = {name:web_name};  
                }
            };

            document.getElementById("web_del_name_button").onclick = function () {
                document.getElementById("version_web_button_div").style.display = '';
                document.getElementById("version_web_data_div").innerHTML = '';
                var wed_name_select = document.getElementById("web_name_select");
                var wed_name_selected = wed_name_select.value;
                if (wed_name_selected == undefined || wed_name_selected == 'null')
                    return;
                var index = wed_name_select.selectedIndex;
                wed_name_select.options.remove(index);
                for (var k = 0; k < web_version_data.length; k++){
                    if (web_version_data[k].name == wed_name_selected){
                        web_version_data.splice(k, 1);
                    }
                }
            };

            document.getElementById("web_version_back_button").onclick = function () {
                var web_type = document.getElementById("web_type_select").value;
                var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                ms.send_msg('comc', 'comc_get_web_conf_req', {
                    nid: nid,
                    flag: 1,
                    type: web_type,
                    name: name
                }, function (type, data) {
                    if (type != "comc_get_web_conf_ack") return;
                    if (data["result"] != "") {
                        ms.error('show', '获取web旧版本配置失败', data["result"]);
                        return;
                    }
                    var web_version_old = data["file_history"];
                    document.getElementById("version_web_data_div").innerHTML = '<p>旧版本配置&nbsp;:&nbsp;<select id="web_version_old_select"></select>' +
                        '&nbsp;<button id="web_version_back_confirm_button" >提交</button>' +
                        '</p>';
                    var web_version_old_select = document.getElementById("web_version_old_select");
                    if (web_version_old == undefined || web_version_old.length == 0) {
                        var option = document.createElement("option");
                        option.type = "radio";
                        option.value = 'null';
                        option.innerHTML = 'NULL';
                        web_version_old_select.appendChild(option);
                        return;
                    }
                    for (var i = 0; i < web_version_old.length; i++) {
                        var option = document.createElement("option");
                        option.type = "radio";
                        option.value = web_version_old[i];
                        option.innerHTML = web_version_old[i];
                        web_version_old_select.appendChild(option);
                    }

                    document.getElementById("web_version_back_confirm_button").onclick = function () {
                        this.disabled = true;
                        if (web_version_old_select.value == 'null') {
                            alert("请选择正确的旧版本配置！");
                            return;
                        }
                        var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                        ms.send_msg('comc', 'comc_set_web_conf_req',
                            {
                                nid: nid,
                                flag: 1,
                                name: name,
                                type: web_type,
                                file_history: web_version_old_select.value
                            },
                            function (type, data) {
                                if (type != 'comc_set_web_conf_ack') {
                                    ms.error('show', 'WEB切换回旧版本', '出现未知错误');
                                    return;
                                }
                                if (data["result"] == "") {
                                    document.getElementById("version_web_data_div").innerHTML = '';
                                    read_web_status_now();
                                    ms.error('show', 'WEB切换回' + web_version_old_select.value, "成功");
                                } else {
                                    ms.error('show', 'WEB切换回' + web_version_old_select.value, data["result"]);
                                }

                            }
                        );
                    };
                });
            };

            document.getElementById("web_update_index_button").onclick = function () {
                var web_type = document.getElementById("web_type_select").value; 
                var web_versions = [];   
                if (web_versions_now.length == 0) {
                    alert("请选择版本！");
                    return;
                }
                for (var i = 0; i < web_versions_now.length; i++){
                    if (web_type == web_versions_now[i].type) {
                        web_versions = web_versions_now[i].version;
                        break;
                    }
                }
                web_versions = web_versions[0].split(";");
                document.getElementById("version_web_data_div").innerHTML = '<p>已解压版本&nbsp;:&nbsp;<select id="web_version_index_select"></select>' +
                    '&nbsp;<button id="web_update_index_confirm_button" >提交</button>' +
                    '</p>';
                var web_version_index_select = document.getElementById("web_version_index_select");
                if (web_versions == undefined || web_versions.length == 0) {
                    var option = document.createElement("option");
                    option.type = "radio";
                    option.value = 'null';
                    option.innerHTML = 'NULL';
                    web_version_index_select.appendChild(option);
                    return;
                } 
                for (var i = 0; i < web_versions.length; i++) {
                    var option = document.createElement("option");
                    option.type = "radio";
                    option.value = web_versions[i];
                    option.innerHTML = web_versions[i];
                    web_version_index_select.appendChild(option);
                }
                document.getElementById("web_update_index_confirm_button").onclick = function () {
                    this.disabled = true;
                    if (web_version_index_select.value == 'null') {
                        alert("请选择正确的版本！");
                        return;
                    }
                    var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                    ms.send_msg('comc', 'comc_set_web_conf_req',
                        {
                            nid: nid,
                            flag: 2,
                            name: name,
                            type: web_type,
                            file_history: web_version_index_select.value
                        },
                        function (type, data) {
                            if (type != 'comc_set_web_conf_ack') {
                                ms.error('show', 'WEB更新index', '出现未知错误');
                                return;
                            }
                            document.getElementById("version_web_data_div").innerHTML = '';
                            read_web_status_now();
                            ms.error('show', 'WEB更新index到' + web_version_index_select.value, data["result"]);
                        }
                    );
                };
            };

            document.getElementById("web_add_version_child_button").onclick = function () {
                var version_web_data_div = document.getElementById("version_web_data_div");
                version_web_data_div.innerHTML += '<p>' +
                    '<input type="text" name="web_version_child_name_text" value=""/>' +
                    '&nbsp;:&nbsp;<input type="text" name="web_version_child_data_text" value="" style="width:580px;"/>' +
                    '</p>';
            };

            document.getElementById("web_modify_version_child_button").onclick = function () {   
                var wed_name_selected = document.getElementById("web_name_select").value; 
                if (wed_name_selected == undefined || wed_name_selected == 'null') {
                    return;
                }

                var web_version_child_names = document.getElementsByName("web_version_child_name_text"),
                    web_version_child_datas = document.getElementsByName("web_version_child_data_text");
                if (web_version_child_names == undefined || web_version_child_datas == undefined) {
                    return;
                }

                var web_conf_add = {};
                for (var i = 0; i < web_version_child_names.length; i++) {
                    if (web_version_child_datas[i] == undefined)
                        break;
                    var web_version_child_name = web_version_child_names[i].value,
                        web_version_child_data;
                    var web_version_child_data_text = web_version_child_datas[i].value;
                    if (web_version_child_name.indexOf('"') >= 0) {
                        alert('请输入正确的格式（字符不含符号），例如：ip；或者：config');
                    }
                    if (web_version_child_data_text.indexOf('{') >= 0 || web_version_child_data_text.indexOf('[') >= 0) {
                        try {
                            web_version_child_data = JSON.parse(web_version_child_data_text)
                        } catch (err) {
                            alert('请输入正确的格式，例如：["all"]；或者：{"ver":"v3.1.1.1601041954","sub_ver":"v1"}');
                            return;
                        }
                    } else {
                        web_version_child_data = web_version_child_data_text;
                    }
                    web_conf_add[web_version_child_name] = web_version_child_data;
                }
                for (var i = 0; i < web_version_data.length; i++){
                    if (web_version_data[i].name == wed_name_selected) { 
                        web_version_data[i].value = JSON.stringify(web_conf_add);
                        break;
                    }
                }
            };

            document.getElementById("web_version_apply_button").onclick = function () {
                var web_type = document.getElementById("web_type_select").value;
                if (web_version_data == null || web_version_data == undefined || web_version_data.length == 0 ) {
                    ms.error('show', '提交WEB版本配置失败', 'WEB配置文件为空');
                    return;
                }
                if (web_type == 'NULL' ) {
                    ms.error('show', '提交WEB版本配置失败', '请选择正确的类型！');
                    return;
                }
                
                var web_version = [];
                for (var i = 0; i < web_version_data.length; i++){
                    var version = {};
                    version["name"] = web_version_data[i].name;
                    version["value"] = web_version_data[i].value;
                    web_version.push(version);
                }
                
                var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                ms.send_msg_from('comc', 'comc_set_web_conf_req', {
                        nid: nid,
                        flag: 0,
                        name: name,
                        type: web_type,
                        conf: web_version
                    },
                    function (type, data) {  
                        if (type != 'comc_set_web_conf_ack') {
                            ms.error('show', '切换WEB版本的配置文件', '出现未知错误');
                            return;
                        }
                        // read_web_status_now();

                        if (data["result"] == "") {
                            ms.error('show', '切换WEB的新版本配置文件结果', '成功');
                        } else {
                            ms.error('show', '切换WEB的新版本配置文件结果', data["result"]);
                        }
                    });
            };

            document.getElementById("set_ipc_version_select_button").onclick = function () {
                var set_ipc_version_select_div = document.getElementById("set_ipc_version_select_div");
                if (this.value == "0") {
                    set_ipc_version_select_div.style.display = "";
                    this.value = '1';
                } else {
                    set_ipc_version_select_div.style.display = "none";
                    this.value = '0';
                }
            };

            document.getElementById("set_ipc_version_select_add_button").onclick = function () {
                var set_ipc_version_select_info_p = document.createElement('p');
                set_ipc_version_select_info_p.innerHTML = document.getElementById("set_ipc_version_select_info_p").innerHTML;
                document.getElementById("set_ipc_version_select_info_div").appendChild(set_ipc_version_select_info_p);
            };

            document.getElementById("set_ipc_version_select_file_button").onclick = function () {
                var set_ipc_version_select_file_div=document.getElementById("set_ipc_version_select_file_div");
                var set_ipc_version_select_info_div=document.getElementById("set_ipc_version_select_info_div");
                if (this.value == 0) {
                    set_ipc_version_select_file_div.style.display = '';
                    set_ipc_version_select_info_div.style.display = 'none';
                    this.value = 1;
                    set_ipc_version_select_file_div.innerHTML = '<p id="set_ipc_version_select_file_p"></P>' +
                        '<input type="text" value="版本ID" style="width:60px;border:0;text-align:center" readonly="true" /> :&nbsp;<input type="text" id="ipc_select_version_file"/>&nbsp;&nbsp;&nbsp;&nbsp;' +
                        '<input type="text" value="版本Status" style="width:70px;border:0;text-align:center" readonly="true" /> :&nbsp;<input type="text" id="ipc_select_status_file"/>&nbsp;&nbsp;&nbsp;&nbsp;';

                    var ipc_version_select_iframe = document.createElement("iframe");
                    document.getElementById('set_ipc_version_select_file_p').insertBefore(ipc_version_select_iframe, null);
                    ipc_version_select_iframe.id = 'set_ipc_version_select_file_iframe';
                    ipc_version_select_iframe.frameBorder = 0;
                    ipc_version_select_iframe.height = 25;
                    ipc_version_select_iframe.value = "0";

                    function upload_result() {   
                        if (ipc_version_select_iframe.value == "0")
                            return;
                        var doc = ipc_version_select_iframe.contentDocument || ipc_version_select_iframe.contentWindow.document;
                        var msg = doc.body.innerHTML, start = msg.indexOf("("), end = msg.lastIndexOf(")");
                        if (end > (start + 2)){
                            try {
                                msg = eval(msg.substring(start, end+1));
                            } catch (err) {
                                msg = "error";
                            }
                        }      

                        if (("error" == msg) || (null == msg) || (null == msg.data)) {
                            ms.error('show', '上传文件', '失败！');
                        } else {
                            if (msg.data["result"] == "") {
                                ms.error('show', '上传文件', '成功！');
                            } else {
                                ms.error('show', '上传文件的结果', msg.data["result"]);
                            }
                        }
                    }
                    function iframe_build() {
                        var doc = ipc_version_select_iframe.contentDocument || ipc_version_select_iframe.contentWindow.document;
                        try {
                            doc.open();
                            doc.close();
                        } catch (err) {
                        }
                        doc.body["style"]["cssText"] = "padding:0px;margin:0px;border:none;overflow:hidden;";
                        doc.body.innerHTML = "<form id='ipc_version_up_file_form' method='post' action='comc/comc_set_client_version_select_req.js?'" +
                            " enctype='multipart/form-data' " +
                            "style='padding:0px;margin:0px;border:none;overflow:hidden;'>" +
                            "<input type='file' id='dupload_data' name='dupload_data' hidefocus='true'" +
                            " title='upload'" +
                            " style='padding:0px;margin:0px;left:-5px;top:0px;verflow:hidden;cursor:f;" +
                            "line-height:24px;'" +
                            "/><br>" +
                            "</form>";
                        ipc_version_select_iframe.value = "1";
                        var form = doc.getElementById("ipc_version_up_file_form");
                        doc.getElementById("dupload_data").onchange = function () {
                            var path = this.value.replace(/.*:?\\(.*\\){0,}/g, '');
                            console.log(encodeURI(path.toString('utf-8')));
                            form.action += '&dfile_name=' + encodeURI(path.toString('utf-8'));
                        };
                    }
                    iframe_build();
                    evt.bind(ipc_version_select_iframe, 'load', upload_result);
                    window.frames["set_ipc_version_select_file_iframe"] = ipc_version_select_iframe;

                    // var iframe  = create_iframe_upload_node(tmp_p, function(data){
                    //     if(data == null){
                    //         ms.error('show','文件上传','失败');
                    //     } else {
                    //         if (data['result'] == '') {
                    //             ms.error('show', '文件上传', '成功');
                    //         } else {
                    //             ms.error('show', '文件上传', data['result']);
                    //         }
                    //     }
                    // });
                } else if (this.value == -1) {
                    set_ipc_version_select_file_div.style.display='';
                    set_ipc_version_select_info_div.style.display='none';
                    this.value = 1;
                } else if (this.value == 1 ) {
                    set_ipc_version_select_file_div.style.display='none';
                    set_ipc_version_select_info_div.style.display='';
                    this.value = -1;
                }
            };
            
            document.getElementById("set_ipc_version_select_confirm_button").onclick = function () {
                var set_ipc_version_select_info_div = document.getElementById("set_ipc_version_select_info_div");
                if(set_ipc_version_select_info_div.style.display == 'none'){
                    file_modle();
                }else{
                    ipc_modle();
                }

                function file_modle(){
                    var ipc_version_select = [];
                    var ipc_select_version_file = document.getElementById("ipc_select_version_file"),
                        ipc_select_status_file = document.getElementById("ipc_select_status_file");
                    var iframe = window.frames["set_ipc_version_select_file_iframe"];
                    var doc = iframe.contentDocument || iframe.contentWindow.document;
                    var form = doc.getElementById("ipc_version_up_file_form");
                    if(doc.getElementById("dupload_data").value == ''){
                        alert("请选择上传文件！");
                        return;
                    }
                    ipc_version_select[ipc_version_select.length] = {
                        id: "",
                        version: ipc_select_version_file.value,
                        status: ipc_select_status_file.value
                    }; 
                    var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                    form.action+= '&dnid='+nid +
                        '&dname='+ name +
                        '&dclient_version_select__x_countz_=1' +
                        '&dclient_version_select=' + ipc_version_select;
                    form.submit();
                }

                function ipc_modle(){
                    var ipc_version_select = [];
                    var ipc_select_id_s = document.getElementsByName("ipc_select_id"),
                        ipc_select_version_s = document.getElementsByName("ipc_select_version"),
                        ipc_select_status_s = document.getElementsByName("ipc_select_status");
                    var j = 0;
                    for (var i = 0; i < ipc_select_id_s.length; i++) {
                        if (ipc_select_id_s[i].value.length == 0 || (ipc_select_status_s[i].value.length == 0 && ipc_select_version_s[i].value.length == 0))
                            continue;
                        ipc_version_select[j++] = {
                            id: ipc_select_id_s[i].value,
                            version: ipc_select_version_s[i].value,
                            status: ipc_select_status_s[i].value
                        };
                    }
                    if (ipc_version_select.length <= 0) {
                        alert("请检查输入！");
                        return;
                    }
                    var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                    ms.send_msg('comc', 'comc_set_client_version_select_req', {
                        nid: nid,
                        name: name,
                        client_version_select: ipc_version_select
                    }, function (type, data) { 
                        if (type != "comc_set_client_version_select_ack"){
                            ms.error('show', '设置设备版本', '服务器返回结果出错！');
                            return;
                        }   
                        if (data["result"] == "") {
                            ms.error('show', '设置设备版本', '成功');
                        } else {
                            ms.error('show', '设置设备版本失败', data["result"]);
                        }
                    });
                }
            };

            function  find_comc(nodename) {
                var comc_name = '';
                for (var i = 0; i < comc_nodes_data.length; i++) {
                    for (var j = 0; j < comc_nodes_data[i]["nodes"].length; j++) {
                        if (comc_nodes_data[i]["nodes"][j]["name"] == nodename) {
                            comc_name = comc_nodes_data[i]["name"];
                            return comc_name;
                        }
                    }
                }
                return comc_name;
            }

            function show_server_version_status(data){ //show server version  
                
                if (data["result"] != '') {
                    ms.error('show', '获取服务器版本', data["result"]);
                     
                }
                if (data["server_version"].length > 0) {
                    if (data["server_version"][0]["version"]) {
                        node.srv_web_ver_now["server"] = data["server_version"][0]["version"];
                    }
                }
                var version_now = node["srv_web_ver_now"].server;  
                // if (version_now.indexOf("ccms_build_info") >= 0) {
                //     version_now = version_now.substring(version_now.indexOf(""), version_now.lastIndexOf(""));
                // }
                document.getElementById('server_version_now').value = '当前版本：' + version_now;
            }

            function show_web_version_status(data){ //show  web version
                 
                var web_version_show = document.getElementById("web");
                web_version_show.innerHTML += '当前版本：';
                if (data["web_version_all"].length > 0) {
                    var web_versions = data["web_version_all"][0].web_version;//[]
                    
                    if (web_versions != undefined){
                        web_versions_now = web_versions;
                    }
                    for (var i = 0; i < web_versions.length; i++) {
                        var web_type = web_versions[i].type;
                        var web_version = web_versions[i].version;//[]
                        var versions = '';
                        for (var j = 0; j < web_version.length; j++) {
                            versions += web_version[j];
                            versions = versions == "" ? "null" : versions;
                            versions += '; ';
                        }
                        web_version_show.innerHTML += '<p><b>'+web_type+':</b>&nbsp;&nbsp;' +
                            '<input type="text" style="width:640px;border:0;text-align:center;font-size:18px" readonly="true" value="'+versions+'"/></p>';
                    }
                }
            }
            function show_web_conf(data) {
                if (data["result"] != ''){
                    ms.error('show', '获取web配置文件', data["result"]);
                    return;
                }
                web_version_data_all = data["data"];
                var web_type_select = document.getElementById("web_type_select");
                web_type_select.innerHTML = "";
                for (var i = 0; i < web_version_data_all; i++){
                    var web_conf = web_version_data_all[i];
                    var web_type = web_conf.type;
                    var option = document.createElement("option");
                    option.type = "radio";
                    option.value = web_type;
                    option.innerHTML = web_type;
                    web_type_select.appendChild(option);
                }
                web_type_select.onchange();
            }
            function node_version_upload(div) {
                var node_version_upload_div = div;
                node_version_upload_div.innerHTML = '<h1>Version Machine</h1>' +
                    '<div id="mac_select_version_div"></div>' +
                    '<div id="special_version_div">' +
                    'DIY&nbsp;:&nbsp;<select id="special_version_select"><option type="radio" value="null">NULL</option></select>' +
                    '<div id="special_version_file_div"></div>' +
                    '</div><br><p>' +
                    '<button id="node_version_upload_btn">上传</button>&nbsp;&nbsp; &nbsp;&nbsp;' +
                    '&nbsp;&nbsp;&nbsp;&nbsp; ' +
                    '</p><br><div id="nodes_versions_div"></div>';
                var version_types = [],
                    nodes_name = [];

                var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                 
                ms.send_msg('comc', 'comc_get_conf_versions_req', {nid: nid}, function (type, data) {
                    if (type != "comc_get_conf_versions_ack") {
                        ms.error('show','获取配置中心版本失败',data["result"]);
                        return;
                    } else {
                        if (data["result"] == '') {
                            ms.error('show', '获取配置中心版本', '成功');
                            var mac_version = data["versions"];
                            
                            var mac_select_version_div = document.getElementById("mac_select_version_div"),
                                nodes_versions_div = document.getElementById("nodes_versions_div");
                            for (var i = 0; i < mac_version.length; i++) {
                                var version_type = mac_version[i].type;
                                version_types[version_types.length] = version_type;
                                var version_data = mac_version[i].version;//[]
                                mac_select_version_div.innerHTML += version_type + ':&nbsp';
                                var select = document.createElement("select");
                                select.id = 'batch_mac_' + version_type;
                                select.innerHTML = '<option type="radio" value="null">NULL</option>';
                                for (var j = 0; j < version_data.length; j++) {
                                    var option = document.createElement("option");
                                    option.type = "radio";
                                    option.value = version_data[j];
                                    option.innerHTML = version_data[j];
                                    select.appendChild(option);
                                }
                                mac_select_version_div.appendChild(select);
                                mac_select_version_div.innerHTML += '<br>';
                            }
                        } else {
                            ms.error('show', '获取配置中心版本', data["result"]);
                        }
                    }
                    /*var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                    ms.send_msg('comc', 'comc_nodes_list_req', {nid: nid}, function (type, data) {
                        if (type != 'comc_nodes_list_ack') {
                            return;
                        }
                        if (data.result == "") {
                            
                            // nodes_list = data;
                            for (var l = 0; l < data["comc_nodes"].length; l++) {
                                for (var d = 0; d < data["comc_nodes"][l]["nodes"].length; d++) {
                                    if (data["comc_nodes"][l]["nodes"][d]["name"] != "comc1") {
                                        nodes_name.push(data["comc_nodes"][l]["nodes"][d]["name"]);
                                    }
                                }
                            }
                            
                            //show node list
                            for (var j = 0; j < nodes_name.length; j++) {
                                var button = document.createElement("button");
                                var tmp_p = document.createElement("p");
                                button.id = 'bacth_' + nodes_name[j] + '_button';
                                button.name = nodes_name[j];
                                button.value = '0';
                                button.innerHTML = '<span style="font-size:14px;"><b>' + nodes_name[j] + '</b></span>';
                                tmp_p.innerHTML = '<input type="checkbox" name="nodes_name_checkbox" value = "' + nodes_name[j] + '"/>';

                                tmp_p.appendChild(button);
                                nodes_versions_div.appendChild(tmp_p);
                                nodes_versions_div.innerHTML += '<div id="bacth_' + nodes_name[j] + '_div"></div></br>';
                            }
                            for (var k = 0; k < nodes_name.length; k++) {
                                document.getElementById('bacth_' + nodes_name[k] + '_button').onclick = function () {
                                    do_node_version(this);
                                };
                            }
                        } else {
                            alert(data.result);
                        }
                    });*/

                    function do_node_version(button) {
                         
                        var node_name = button.name;
                        var bacth_node_div = document.getElementById('bacth_' + node_name + '_div');
                        if (button.value != '0') {
                            bacth_node_div.innerHTML = '';
                            button.value = '0';
                            return;
                        } else {
                            button.value = '1';
                        }
                        var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                        ms.send_msg('comc', 'comc_get_node_versions_req', {
                            nid: nid,
                            name: node_name
                        }, function (type, data) { 
                            if (type != "comc_get_node_versions_ack") {
                                ms.error('show','获取节点'+node_name+'版本失败', '未知错误');
                                return;
                            }
                            if (data["result"] == "") {
                                ms.error('show','获取节点'+node_name+'版本', '成功');
                                var node_version = data["versions"];
                                if (!node_version) {
                                    return;
                                }
                                 
                                for (var v = 0; v < node_version.length; v++) {
                                    var version_type = node_version[v].type;
                                    bacth_node_div.innerHTML += '<p id="' + node_name + version_type + '_p"><b>' + version_type + '</b></p>';
                                    var node_version_child = node_version[v].version;
                                    for (var i = 0; i < node_version_child.length; i++) {
                                        if (i % 5 == 0)
                                            document.getElementById(node_name + version_type + '_p').innerHTML += '<br>';
                                        document.getElementById(node_name + version_type + '_p').innerHTML += node_version_child[i] + '&nbsp';
                                    }
                                }
                            } else {
                                ms.error('show','获取节点'+node_name+'版本失败 ： ', data["result"]);
                            }

                        });

                    }
                });

                mx("#node_version_upload_btn").onclick = function () {
                    this.disabled = true;
                    // var nodes_name_check = [];
                    // var nodes_name_checkbox = document.getElementsByName("nodes_name_checkbox");
                    // for (var i = 0; i < nodes_name_checkbox.length; i++) {
                    //     if (nodes_name_checkbox[i].checked) {
                    //         nodes_name_check[nodes_name_check.length] = nodes_name_checkbox[i].value;
                    //     }
                    // }
                    do_node_upload_button(version_types, node_name);
                };

                function do_node_upload_button(version_types, nodes_name) {
                    if (nodes_name.length == 0 || version_types.length == 0) {
                        ms.error('show','上传版本失败',"选择信息有误，请检查后再试！");
                        alert("选择信息有误，请检查后再试！");
                        mx("#node_version_upload_btn").disabled = false;
                        return;
                    }

                    var versions = [];
                    for (var i = 0; i < version_types.length; i++) {
                        var select = document.getElementById("batch_mac_" + version_types[i]);
                        if (select == undefined)
                            continue;
                        var value = select.value;
                        if (value != 'null') {
                            versions[versions.length] = {type: version_types[i], version: [value]};
                        }
                    }
                    if (versions.length == 0) {
                        alert("选择信息有误，请检查后再试！");
                        mx("#node_version_upload_btn").disabled = false;
                        return;
                    }
                     
                    var n = versions.length;
                    for (var j = 0; j < versions.length; j++) {
                        var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                        ms.send_msg('comc', 'comc_upload_node_versions_req',
                            {
                                nid: nid,
                                name: nodes_name,
                                versions: versions[j]
                            },
                            function (type, data) {
                                n -= 1;
                                if (n == 0)
                                    mx("#node_version_upload_btn").disabled = false;
                                if (type == "comc_upload_node_versions_ack") {
                                    if (data["result"] == ''){
                                        ms.error('show','上传版本结果', 'success');
                                    } else {
                                        ms.error('show','上传版本结果', data["result"]);
                                    }
                                }
                            });
                    }
                }

            }
            function do_switch_ipc_status(status) {
                var version_manage_button = document.getElementById("version_manage_button");
                if (version_manage_button.value == '0') {
                    version_manage_button.value = '1';
                    do_show_version_button();
                    return;
                }

                for (var i = 0; i < version_ipc_type.length; i++) {
                    var select = document.getElementById(version_ipc_type[i] + '_select');
                    if (select == undefined || select.value == 'null')
                        continue;
                    var version = {};
                    version[status] = select.value;
                    var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                    ms.send_msg('comc', 'comc_set_client_version_req', {
                        nid: nid,
                        name: name,
                        client_version_all: [{type: version_ipc_type[i], version: version}]
                    }, function (type, data) {
                        if (type == "comc_set_client_version_ack") {
                            if (data.result == '') {
                                ms.error('show', '切换节点' + name + '上的设备版本', '成功');
                            } else {
                                ms.error('show', '切换节点' + name + '上的设备版本', data["result"]);
                            }
                        }
                    });
                }
            }
            function do_switch_client_status(status) {
                var version_manage_button = document.getElementById("version_manage_button");
                if (version_manage_button.value == '0') {
                    version_manage_button.value = '1';
                    do_show_version_button();
                    return;
                }
                for (var i = 0; i < client_type.length; i++) {
                    var select = document.getElementById(client_type[i] + '_select');
                    if (select == undefined || select.value == 'null')
                        continue;
                    var version = {};
                    version[status] = select.value;
                    var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                    ms.send_msg('comc', 'comc_set_client_version_req', {
                        nid: nid,
                        name: name,
                        client_version_all: [{type: client_type[i], version: version}]
                    }, function (type, data) {
                        if (type == "comc_set_client_version_ack") {
                            if (data.result == '') {
                                ms.error('show', '切换节点' + name + '上的版本', 'success');
                            } else {
                                ms.error('show', '切换节点' + name + '上的版本', data["result"]);
                            }
                        }
                    });
                }
            }
            function do_show_version_button() {//点击版本管理
                if (node["version"] != null) {
                    do_show_version();
                } else {
                    var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                    ms.send_msg('comc', 'comc_get_node_versions_req', {//取节点所有版本
                        nid: nid,
                        name: name
                    }, function (type, data) {
                        if (type == "comc_get_node_versions_ack") {
                            if (data["result"] == "") {
                                ms.error('show', '获取节点' + node_name + '版本', '成功');
                                node.version = data["versions"] || [];//[]
                                do_show_version();
                            } else {
                                ms.error('show','获取节点'+node_name+'版本失败', data["result"]);
                            }
                        } else {
                            ms.error('show','获取节点'+node_name+'版本失败', '未知错误');
                        }
                    });
                }
            }
            function do_show_version() { 
                var version_type_node;
                if (node.ccvs_flag == 'no') {
                    version_type_node = version_type;
                } else {
                    version_type_node = version_type_all;
                }
                for (var k = 0; k < version_type_node.length; k++) {
                    var type = version_type_node[k];
                    var flag = 0;
                    var version_data = [];
                    for (var l = 0; l < node.version.length; l++) {
                        if(node.version[l]["type"] == type) {
                            version_data = node.version[l]["version"];
                        }
                    }

                    var select = document.getElementById(type + '_select');
                    if (select == undefined) {
                        select = document.createElement("select");
                        select.id = type + '_select';
                    } else {
                        flag = 1;
                        select.innerHTML = '';
                    }

                    var option_null = document.createElement("option");
                    option_null.type = "radio";
                    option_null.value = 'null';
                    option_null.innerHTML = 'Null';
                    select.appendChild(option_null);

                    if (version_data != undefined) {
                        for (var i = 0; i < version_data.length; i++) {
                            var option = document.createElement("option");
                            option.type = "radio";
                            option.value = version_data[i];
                            option.innerHTML = version_data[i];
                            select.appendChild(option);
                        }
                    }

                    if (flag == 0) {
                        var version_child_page = document.getElementById(type + '_p');
                        version_child_page.appendChild(select);
                    }
                }
            }
            function read_web_status_now() {//read web conf
                var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                web_version_data = [];
                web_version_data_all = [];
                ms.send_msg('comc', 'comc_get_web_conf_req', {
                    nid: nid,
                    flag: 0,
                    name: name
                }, function (type, data) {
                    if (type != "comc_get_web_conf_ack") {
                        ms.error('show', '获取web配置文件失败', "未知错误");
                        return;
                    }
                    if (data["result"] != "") {
                        ms.error('show', '获取web配置文件失败', data["result"]);
                        return;
                    }
                    ms.error('show', '获取web配置文件', "成功");
                    
                    if (data["conf_all"] == undefined){
                        return;
                    }
                    web_version_data_all = data["conf_all"];//[]
                    var web_type_select = document.getElementById("web_type_select");
                    web_type_select.innerHTML = "";
                    for (var i = 0; i < web_version_data_all.length; i++){
                        var web_conf = web_version_data_all[i];
                        var web_type = web_conf.type;
                        var option = document.createElement("option");
                        option.type = "radio";
                        option.value = web_type;
                        option.innerHTML = web_type;
                        web_type_select.appendChild(option);
                    }
                    web_type_select.onchange();
                });
            }
            function show_ABtest(div,data){
                var root={name:"root",desc:"root",rate:0,children:[]};
                var count=0;
                found_child(data);
                div.innerHTML="";
                show_tree(div,0,root);

                function show_tree(div,index,node){
                    var i;
                    var row="";
                    for(i=0; i<index; i++)  row+="|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                    row+="|_name:"+node.name+";desc:"+node.desc+";rate:<input type='text' id='ABtest_"+node.name+"' value='"+node.rate+"'/><br>";
                    div.innerHTML+=row;
                    if(node.children && node.children.length > 0){
                        for(i=0; i<node.children.length; i++){
                            show_tree(div,index+1,node.children[i]);
                        }
                    }
                }

                function found_child(children){
                    var unfound_parent=[];
                    var ret;
                    for(var i=0; i<children.length; i++){
                        if(children[i].name == "root"){
                            root.rate=children[i].rate;
                            continue;
                        }
                        ret=found_parent(children[i],root);
                        if(ret != 1) unfound_parent.push(children[i]);
                    }
                    count++;
                    if(unfound_parent.length > 0 && count<= 3) found_child(unfound_parent);
                }

                function found_parent(child,parent){
                    var ret=0;
                    if(child.parent == parent.name){
                        var ch={name:child.name,desc:child.desc,rate:child.rate,children:[]};
                        parent.children.push(ch);
                        ret=1;
                    }else{
                        for(var i=0; i<parent.children.length; i++){
                            ret=found_parent(child,parent.children[i]);
                            if(ret == 1) break;
                        }
                    }
                    return ret;
                }
            }
            read_web_status_now();
        }
        
        function log_management(div) {
            var nodes=[];
            var nodes_list=[];
            var comc_nodes=[];
            var node_name;

            document.getElementById("option_page").style = "display:none;";
            div.innerHTML = '';
            div.innerHTML += '<div id="server_info">' +
                '<center>'+
                '<label id="comc_list_title" value="0" style="font-size: 14px" style="display: "">comc list</label>&nbsp;&nbsp;' +
                '<button id="go_back_log_home" value="0" style="font-size: 14px" style="display: none">返回</button>&nbsp;&nbsp;<br>' +
                '<div class="demo_line_05">-----------------------------------------------------------------------------------------------------------------------------------</div></center>'+
                '<div id="show_node_list_div" style="display: ""></div>'+
                '<div id="comc_log_management_div" style="display: none;"></div>' +
                '</div>';
            var show_node_list_div = document.getElementById("show_node_list_div");
            var comc_log_management_div = document.getElementById("comc_log_management_div");
            var go_back_log_home = document.getElementById("go_back_log_home");
            var comc_list_title = document.getElementById("comc_list_title");
            go_back_log_home.style.display = 'none';
            comc_get_node_list_class(show_node_list_div);

            function comc_get_node_list_class(div){
                var req={};
                div.innerHTML= '';
                var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
                req.nid=nid;
                function send_to_get_node_list(){
                    ms.send_msg('comc', 'comc_nodes_list_req',req , function (type, data) {
                        if (type != 'comc_nodes_list_ack'){
                            ms.error("show", "获取节点列表", "未知错误");
                            return;
                        }
                        if (data.result== "") {
                            ms.error("show", "获取节点列表", "成功");
                            nodes_list = data;
                            //show node list
                            show_node_list(show_node_list_div, data);
                        } else {
                            ms.error("show", "获取节点列表", data.result);
                            alert(data.result);
                        }
                    });
                }
                send_to_get_node_list();
            }

            function show_node_list(div, data){
                comc_nodes = data.comc_nodes || [];
                div.innerHTML = '';
                var comc_name = '';
                var num=0;
                var node_data=[];
                for (var k = 0; k < comc_nodes.length; k++) {
                    div.innerHTML += '<br><button id="'+k+ comc_nodes[k].name +k+'" style="color: #4169E1 ;font-size: 16px "></button><br/>';
                    if (document.getElementById(k + comc_nodes[k].name + k) != null)
                        document.getElementById(k + comc_nodes[k].name + k).innerHTML = comc_nodes[k].name;
                }

                var comcs = {};
                for(var k1 = 0; k1 < comc_nodes.length; k1++){
                    comcs[k1 + comc_nodes[k1].name + k1] = comc_nodes[k1].name;
                    document.getElementById(k1 + comc_nodes[k1].name + k1).onclick =
                        function(){
                            comc_name = comcs[this.id];  
                            document.getElementById("comc_log_management_div").style = "display:block;";
                            document.getElementById("show_node_list_div").style = "display:none;";
                            comc_log_management(comc_log_management_div, comc_name);
                        };
                }
            }

            function comc_log_management(comc_div, comc_name) {
                all_log_data = {};
                go_back_log_home.style.display = '';
                comc_list_title.style.display = 'none';
                document.getElementById("option_page").style="display:none;";
                comc_div.innerHTML = '';
                comc_div.innerHTML += '<div >'+
                    '<center>日志时间：<input class="laydate-icon" onclick="laydate()" id="date_data">&nbsp;&nbsp;'+
                    '开始时间：<input id="start_time">&nbsp;结束时间：<input id="end_time">&nbsp;&nbsp;'+
                    '操作日志<input type="checkbox" id="req_log">&nbsp;'+
                    '报警日志<input type="checkbox" id="alarm_log">&nbsp;&nbsp;'+
                    '<a  class="message_box" id="log_confirm_button"  value=0 >确定</a>'+
                    '<div id="log_div">'+
                    '<center>'+
                    '<button id="log_req_button"  value=0 >操作日志</button>&nbsp;&nbsp;&nbsp;&nbsp;'+
                    '<button id="log_alarm_button"  value=0 >报警日志</button><center>'+
                    '</div>'+
                    '</div>'+
                    '<div id="log_req_div" style="display:none;"></div>'+
                    '<div id="log_alarm_div" style="display:none;"></div>';

                var log_req_div = document.getElementById("log_req_div");
                var log_alarm_div = document.getElementById("log_alarm_div");
                var log_req_button = document.getElementById("log_req_button");
                var log_alarm_button = document.getElementById("log_alarm_button");

                go_back_log_home.onclick = function () {
                    log_management(div);
                    go_back_log_home.style.display = 'none';
                    comc_list_title.style.display = '';
                };

                var log_type_all = ["req_log", "alarm_log"];
                document.getElementById("log_confirm_button").onclick=function() {
                    var log_req = [];
                    for (var i =0; i<2; i++) {
                        if (document.getElementById(log_type_all[i]).checked == true) {
                            log_req.push(log_type_all[i]);
                        }
                    }
                    if (log_req.length == 0) {
                        // log_req.push("req_log");
                        alert("请选择日志种类");
                        return;
                    }

                    for (var j=0; j<log_req.length; j++) {
                        get_log(log_req[j]);
                    }
                    function get_log(log_type) {
                        var start = document.getElementById("start_time").value;
                        var end = document.getElementById("end_time").value;
                        var date = document.getElementById("date_data").value;
                        
                        if (date == "") {
                            alert("请选择日期");
                            return;
                        }
                        if (start == "" ) {
                            alert("请选择开始时间");
                            return;
                        }
                        if (end  == "") {
                            alert("请选择结束时间");
                            return;
                        }
                        var arr = date.split("-");
                        date = "";
                        for (var i=0; i<arr.length; i++) {
                            date += arr[i];
                        }
                        var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                        ms.send_msg('comc', 'comc_get_log_req', {
                            nid: nid,
                            comc_name: comc_name,
                            type: log_type,
                            start: start,
                            end: end,
                            date:date
                        }, function (type, data) {  
                            if (data.result == "") {
                                ms.error('show', '获取'+log_type, '成功');  console.log(data.log);
                                var log_data = data.log;
                                var log_arr = log_data.split("\n");
                                log_arr.splice(log_arr.length - 1, 1);
                                all_log_data[log_type] = log_arr;
                                all_log_data[log_type + "len"] = 0;
                            } else {
                                ms.error('show', '获取'+log_type, data.result);
                            }
                        });
                    }
                };
                log_req_button.onclick = function () {
                    if (log_req_div.style.display == '') {
                        return;
                    }
                    if (log_alarm_div.style.display == '') {
                        log_alarm_div.style.display = 'none';
                    }
                    if (log_req_div.style.display == 'none') {
                        log_req_div.style.display = '';
                    }
                    all_log_data["req_log" + "len"] = 0;
                    req_blank("req_log", log_req_div);
                };
                log_alarm_button.onclick = function () {
                    if (log_alarm_div.style.display == '') {
                        return;
                    }
                    if (log_req_div.style.display == '') {
                        log_req_div.style.display = 'none';
                    }
                    if (log_alarm_div.style.display == 'none') {
                        log_alarm_div.style.display = '';
                    }
                    all_log_data["alarm_log" + "len"] = 0;
                    alarm_log_show("alarm_log", log_alarm_div);
                };
                function req_blank(log_type, log_div) {
                    log_div.innerHTML = '';
                    var buff = "";
                    buff += '<table summary="">' +
                        '<caption>' + log_type + '</caption>' +
                        '<thead><tr class="odd"> <td class="column1"></td>' +
                        '<th scope="col" abbr="Home">时间</th>' +
                        '<th scope="col" abbr="Home Plus">姓名</th>' +
                        '<th scope="col" abbr="Business">具体操作</th></tr></thead><tbody>';

                    for (var i = 0; all_log_data[log_type] != undefined && all_log_data[log_type + "len"] < all_log_data[log_type].length && i < 20; i++) {
                        var arr = all_log_data[log_type][all_log_data[log_type + "len"]].split(" : ");
                        buff += '<tr><th scope="row" class="column1">' + i + '</th>' +
                            '<td>' + arr[0] + '</td><td>' + arr[1] + '</td><td>' + arr[2] + '</td></tr>';
                        all_log_data[log_type + "len"]++;
                    }

                    buff += '</tbody></table>';
                    log_div.innerHTML += buff;
                    var pre_page = log_type + "pre_page";
                    log_div.innerHTML += '<center><a  class="message_box" id="pre_page"  value="0">上一页</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                        '<a  class="message_box" id="next_page"  value=0 >下一页</a></center><br>';
                    document.getElementById("pre_page").onclick = function() {
                        if (all_log_data[log_type+"len"] > 20) {
                            all_log_data[log_type+"len"] = (parseInt((all_log_data[log_type+"len"]-1)/20) - 1)*20;
                            req_blank(log_type, log_div);
                        }
                    };
                    document.getElementById("next_page").onclick = function() {
                        if (all_log_data[log_type + "len"] < all_log_data[log_type].length) {
                            req_blank(log_type, log_div);
                        }
                    };
                }
                function alarm_log_show(log_type, log_div) {
                    log_div.innerHTML = '';
                    var buff = "";
                    buff += '<table summary="">' +
                        '<caption>' + log_type + '</caption>' +
                        '<thead><tr class="odd"> <td class="column1"></td>' +
                        '<th scope="col" abbr="Home">时间</th>' +
                        '<th scope="col" abbr="Home Plus">姓名</th>' +
                        '<th scope="col" abbr="Business">具体操作</th></tr></thead><tbody>';

                    for (var i = 0; all_log_data[log_type] != undefined && all_log_data[log_type + "len"] < all_log_data[log_type].length && i < 20; i++) {
                        var arr = all_log_data[log_type][all_log_data[log_type + "len"]].split(" : ");
                        buff += '<tr><th scope="row" class="column1">' + i + '</th>' +
                            '<td>' + arr[0] + '</td><td>' + arr[1] + '</td><td>' + arr[2] + '</td></tr>';
                        all_log_data[log_type + "len"]++;
                    }

                    buff += '</tbody></table>';
                    log_div.innerHTML += buff;
                    var pre_page = log_type + "pre_page";
                    log_div.innerHTML += '<center><a  class="message_box" id="pre_page2"  value="0">上一页</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                        '<a  class="message_box" id="next_page2"  value=0 >下一页</a></center><br>';
                    document.getElementById("pre_page2").onclick = function() {
                        if (all_log_data[log_type+"len"] > 20) {
                            all_log_data[log_type+"len"] = (parseInt((all_log_data[log_type+"len"]-1)/20) - 1)*20;
                            alarm_log_show(log_type, log_div);
                        }
                    };
                    document.getElementById("next_page2").onclick = function() {
                        if (all_log_data[log_type + "len"] < all_log_data[log_type].length) {
                            alarm_log_show(log_type, log_div);
                        }
                    };
                }
            }

        }

        function others_management(div) {
            document.getElementById("option_page").style="display:none;";
            server_info(div);
        }

        function error_class(type, error_type, error_data){
            switch (type){
                case "create":{
                    create();
                    break;
                }
                case  "destroy":{
                    destroy();
                    break;
                }
                case "show":{
                    show();
                    break;
                }
            }
            function create(){  
                message_box_div.innerHTML = '<center><iframe frameborder=1  width="800" height="150" id="message_box_iframe"></iframe></center>';
                iframe_err = document.getElementById("message_box_iframe");
                doc = iframe_err.contentDocument || iframe_err.contentWindow.document;
                try {
                    doc.open();
                    doc.close();
                }catch(err){}
                iframe_err.style.display = 'none';
            }

            function destroy(){
                message_box_div.innerHTML = '';
                doc = null;
                error_class_init = 'no';
            }

            function show(){ 
                if(doc == null || doc.length == 0)
                    return;
                var data = typeof(error_data) == "object" ? JSON.stringify(error_data) : error_data;
                doc.body.innerHTML += '<p>' + error_type + '&nbsp;:&nbsp;' + data +  '</p>';
            }
        }
    }

    function class_confcenter()
    {
        g_web = mx("#web_home");
        g_page = mx("#page");
        // g_error_page = mx("#error_page");
        var l_me = this;
        l_me.ctrl = login_class;
        // l_me.error = error_class;

        l_me.send_msg = function(to, type, data, on_ack){
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

        l_me.send_msg_from = function(to, type, data, on_ack){
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

        l_me.create_upload = function (div,on_ack){
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
    /*-----------------Setting options pages--------------------*/

    function software_home()
    {
        window.ms = new class_confcenter();
        window.onunload = function(){
            ms.ctrl({type:"destroy"});
        };
        ms.ctrl();
    }

    window.software_home = software_home;

})(window, document);