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
//-----------------------------------------------
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

    //-----------------------------------------

    function login_class(){

        function login_page(){
            g_page.innerHTML='<div id="login_page">'+
                '账号<input type="text" id="user"/><br/>'+
                '密码<input type="password" id="pass"/><br/>'+
                '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button id="login_button">登陆</button><br>'+
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
                          /*  login_data.sid = data.sid;
                            login_data.seq = data.seq;
                            var nid_check=create_nid( 0, login_data.sid, login_data.seq, login_data.share_key );
                            ms.send_msg('cct','cct_login_req',{request:"login",nid:nid_check},function(type, data){
                                if(data["result"] == 'success'){
                                    confcenter_names=data["confcenter_names"] == undefined ? []:data["confcenter_names"];
                                    ms.error("create");
                                }else{
                                    alert(data["result"]);
                                }
                            });*/
                        }else{
                            alert("密码或者账号错误！");
                        }
                    });
                });
            }
        }

     /*   login_page();
        login_event();*/
       fork();
    }
    function fork()
    {
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            '<button id="node_auth_req">权限设置（node_auth_req）</button><br>'+
            '<button id="node_auth_user_req">查看权限列表（node_auth_user_req）</button><br>'+
            '<button id="cdms_auth_req">cdms权限管理（cdms_auth_req）</button><br>'+
            '<button id="cdms_test">cdms测试页面（cdms_test）</button><br>'+
            '<button id="cpis_auth_req">cpis权限管理（cpis_auth_req）</button><br>'+
            '<button id="cpis_test">cpis测试页面（cpis_test）</button><br>'+
            '<button id="cbms_auth_req">cbms权限管理（cbms_auth_req）</button><br>'+
            '<button id="cbms_test">cbms测试页面（cbms_test）</button><br>'+
            '<button id="ctck_test">ctck测试页面（ctck_test）</button><br>'+
            '<button id="cmall_test">cmall测试页面（cmall_test）</button><br>'+
            '<button id="test_test">测试（test_test）</button><br>'+
            '<button id="test_cdfs">测试（test_cdfs）</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';
        document.getElementById("node_auth_req").onclick=function() {
            node_auth_req();
        };
        document.getElementById("node_auth_user_req").onclick=function() {
            node_auth_user_req();
        };
        document.getElementById("cdms_auth_req").onclick=function() {
            cdms_auth_req();
        };
        document.getElementById("cdms_test").onclick=function() {
            cdms_test();
        };
        document.getElementById("cpis_auth_req").onclick=function() {
            cpis_auth_req();
        };
        document.getElementById("cpis_test").onclick=function() {
            cpis_test();
        };
        document.getElementById("cbms_auth_req").onclick=function() {
            cbms_auth_req();
        };
        document.getElementById("cbms_test").onclick=function() {
            cbms_test();
        };
        document.getElementById("ctck_test").onclick=function() {
            ctck_test();
        };
        document.getElementById("cmall_test").onclick=function() {
            cmall_test();
        };
        document.getElementById("test_test").onclick=function() {
            test_test();
        };
        document.getElementById("test_cdfs").onclick=function() {
            test_cdfs();
        };
        document.getElementById("return_home").onclick=function() {
            login_class();
        };

    }

    //--------------------------------------------------------
    function cpis_auth_req()
    {
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            '<button id="cpis_auth_user_list_req">cpis_auth_user_list_req</button><br>'+
            '<button id="cpis_look_auth_user_req">cpis_look_auth_user_req</button><br>'+
            '<button id="cpis_set_auth_user_req">cpis_set_auth_user_req</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';
        document.getElementById("cpis_auth_user_list_req").onclick=function() {
            cpis_auth_user_list_req();
        };
        document.getElementById("cpis_look_auth_user_req").onclick=function() {
            cpis_look_auth_user_req();
        };
        document.getElementById("cpis_set_auth_user_req").onclick=function() {
            cpis_set_auth_user_req();
        };
        document.getElementById("return_home").onclick=function() {
            fork();
        };

    }
    function cpis_auth_user_list_req()
    {
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            'start<input type="text" id="start"/><br/>'+
            'counts<input type="text" id="counts"/><br/>'+
            '<button id="get_segment">完成</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';
        document.getElementById("get_segment").onclick=function(){
            var start = document.getElementById("start").value;
            var counts = document.getElementById("counts").value;
            var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
            var ret={start:start,nid:nid,counts:counts};
           ms.send_msg('cpis', 'cpis_auth_user_list_req', ret, function (type, data) {
                if (data.result == "failed") {
                    console.log("niconiconi");
                    //   console.log(error);
                }else {
                    console.log(data);
                }
                g_page.innerHTML='<div id="login_page">'+
                    '<button id="return">返回</button><br>'+
                    '</div>';
                document.getElementById("return").onclick=function() {
                    cpis_auth_user_list_req();
                }
            });
        };
        document.getElementById("return_home").onclick=function() {
            cpis_auth_req();
        }

    }
    function cpis_look_auth_user_req()
    {
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            'user<input type="text" id="user"/><br/>'+
            'auth<input type="text" id="auth"/><button id="auth_save">存入</button><button id="auth_clear">清空</button><br>'+
            '<button id="get_segment">完成</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';
        var auth=[];
        var i= 0,j=0;
        document.getElementById("auth_save").onclick=function() {
            var id=document.getElementById("auth").value;
            auth[i++] =id;
            this.value="";
        };

        document.getElementById("auth_clear").onclick=function() {
            auth.splice(0, auth.length);
            i=0;
        };
        document.getElementById("get_segment").onclick=function(){
            var user = document.getElementById("user").value;
            var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
            var ret={nid:nid,user:user,auth:auth};
            ms.send_msg('cpis', 'cpis_look_auth_user_req', ret, function (type, data) {
                if (data.result == "failed") {
                    console.log("niconiconi");
                    //   console.log(error);
                }else {
                    console.log(data);
                }
                g_page.innerHTML='<div id="login_page">'+
                    '<button id="return">返回</button><br>'+
                    '</div>';
                document.getElementById("return").onclick=function() {
                    cpis_look_auth_user_req();
                }
            });
        };
        document.getElementById("return_home").onclick=function() {
            cpis_auth_req();
        }

    }
    function cpis_set_auth_user_req()
    {
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            'user<input type="text" id="user"/><br/>'+
            'auth<input type="text" id="auth"/><button id="auth_save">存入</button><button id="auth_clear">清空</button><br>'+
            'auth_level<input type="text" id="auth_level"/><button id="auth_level_save">存入</button><button id="auth_level_clear">清空</button><br>'+
            '<button id="get_segment">完成</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';
        var auth=[];
        var auth_level = [];
        var i= 0,j=0;
        document.getElementById("auth_save").onclick=function() {
            var id=document.getElementById("auth").value;
            auth[i++] =id;
            this.value="";

        };
        document.getElementById("auth_level_save").onclick=function() {
            var lag=document.getElementById("auth_level").value;
            auth_level[j++] = lag;
            this.value="";

        };
        document.getElementById("auth_clear").onclick=function() {
            auth.splice(0, auth.length);
            i=0;
        };
        document.getElementById("auth_level_clear").onclick=function() {
            auth_level.splice(0, auth_level.length);
            j=0;
        };
        document.getElementById("get_segment").onclick=function(){
            var user = document.getElementById("user").value;
            var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
            var ret={nid:nid,user:user,auth:auth,auth_level:auth_level};
            ms.send_msg('cpis', 'cpis_set_auth_user_req', ret, function (type, data) {
                if (data.result == "failed") {
                    console.log("niconiconi");
                    //   console.log(error);
                }else {
                    console.log(data);
                }
                g_page.innerHTML='<div id="login_page">'+
                    '<button id="return">返回</button><br>'+
                    '</div>';
                document.getElementById("return").onclick=function() {
                    cpis_set_auth_user_req();
                }
            });
        };
        document.getElementById("return_home").onclick=function() {
            cpis_auth_req();
        }

    }
    //--------------------------------------------------------
    function cdms_auth_req()
    {
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            '<button id="cdms_auth_user_list_req">cdms_auth_user_list_req</button><br>'+
            '<button id="cdms_look_auth_user_req">cdms_look_auth_user_req</button><br>'+
            '<button id="cdms_set_auth_user_req">cdms_set_auth_user_req</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';
        document.getElementById("cdms_auth_user_list_req").onclick=function() {
            cdms_auth_user_list_req();
        };
        document.getElementById("cdms_look_auth_user_req").onclick=function() {
            cdms_look_auth_user_req();
        };
        document.getElementById("cdms_set_auth_user_req").onclick=function() {
            cdms_set_auth_user_req();
        };
        document.getElementById("return_home").onclick=function() {
            fork();
        };

    }
    function cdms_auth_user_list_req()
    {
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            'start<input type="text" id="start"/><br/>'+
            'counts<input type="text" id="counts"/><br/>'+
            '<button id="get_segment">完成</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';
        document.getElementById("get_segment").onclick=function(){
            var start = document.getElementById("start").value;
            var counts = document.getElementById("counts").value;
            var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
            var ret={start:start,nid:nid,counts:counts};
            ms.send_msg('cdms', 'cdms_auth_user_list_req', ret, function (type, data) {
                console.log(data);
                if (data.result == "failed") {
                    console.log("niconiconi");
                    //   console.log(error);
                }else {
                    console.log(data);
                }
                g_page.innerHTML='<div id="login_page">'+
                    '<button id="return">返回</button><br>'+
                    '</div>';
                document.getElementById("return").onclick=function() {
                    cdms_auth_user_list_req();
                }
            });
        };
        document.getElementById("return_home").onclick=function() {
            cdms_auth_req();
        }

    }
    function cdms_look_auth_user_req()
    {
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            'user<input type="text" id="user"/><br/>'+
            'auth<input type="text" id="auth"/><button id="auth_save">存入</button><button id="auth_clear">清空</button><br>'+
            '<button id="get_segment">完成</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';
        var auth=[];
        var i= 0,j=0;
        document.getElementById("auth_save").onclick=function() {
            var id=document.getElementById("auth").value;
            auth[i++] =id;
            this.value="";
        };

        document.getElementById("auth_clear").onclick=function() {
            auth.splice(0, auth.length);
            i=0;
        };
        document.getElementById("get_segment").onclick=function(){
            var user = document.getElementById("user").value;
            var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
            var ret={nid:nid,user:user,auth:auth};
            ms.send_msg('cdms', 'cdms_look_auth_user_req', ret, function (type, data) {
                console.log(data);
                if (data.result == "failed") {
                    console.log("niconiconi");
                    //   console.log(error);
                }else {
                    console.log(data);
                }
                g_page.innerHTML='<div id="login_page">'+
                    '<button id="return">返回</button><br>'+
                    '</div>';
                document.getElementById("return").onclick=function() {
                    cdms_look_auth_user_req();
                }
            });
        };
        document.getElementById("return_home").onclick=function() {
            cdms_auth_req();
        }

    }
    function cdms_set_auth_user_req()
    {
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            'user<input type="text" id="user"/><br/>'+
            'auth<input type="text" id="auth"/><button id="auth_save">存入</button><button id="auth_clear">清空</button><br>'+
            'auth_level<input type="text" id="auth_level"/><button id="auth_level_save">存入</button><button id="auth_level_clear">清空</button><br>'+
            '<button id="get_segment">完成</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';
        var auth=[];
        var auth_level = [];
        var i= 0,j=0;
        document.getElementById("auth_save").onclick=function() {
            var id=document.getElementById("auth").value;
            auth[i++] =id;
            this.value="";

        };
        document.getElementById("auth_level_save").onclick=function() {
            var lag=document.getElementById("auth_level").value;
            auth_level[j++] = lag;
            this.value="";

        };
        document.getElementById("auth_clear").onclick=function() {
            auth.splice(0, auth.length);
            i=0;
        };
        document.getElementById("auth_level_clear").onclick=function() {
            auth_level.splice(0, auth_level.length);
            j=0;
        };
        document.getElementById("get_segment").onclick=function(){
            var user = document.getElementById("user").value;
            var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
            var ret={nid:nid,user:user,auth:auth,auth_level:auth_level};
            ms.send_msg('cdms', 'cdms_set_auth_user_req', ret, function (type, data) {
                console.log(data);
                if (data.result == "failed") {
                    console.log("niconiconi");
                    //   console.log(error);
                }else {
                    console.log(data);
                }
                g_page.innerHTML='<div id="login_page">'+
                    '<button id="return">返回</button><br>'+
                    '</div>';
                document.getElementById("return").onclick=function() {
                    cdms_set_auth_user_req();
                }
            });
        };
        document.getElementById("return_home").onclick=function() {
            cdms_auth_req();
        }

    }


    function cbms_auth_req()
    {
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            '<button id="cbms_auth_user_list_req">cbms_auth_user_list_req</button><br>'+
            '<button id="cbms_look_auth_user_req">cbms_look_auth_user_req</button><br>'+
            '<button id="cbms_set_auth_user_req">cbms_set_auth_user_req</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';
        document.getElementById("cbms_auth_user_list_req").onclick=function() {
            cbms_auth_user_list_req();
        };
        document.getElementById("cbms_look_auth_user_req").onclick=function() {
            cbms_look_auth_user_req();
        };
        document.getElementById("cbms_set_auth_user_req").onclick=function() {
            cbms_set_auth_user_req();
        };
        document.getElementById("return_home").onclick=function() {
            fork();
        };

    }
    function cbms_auth_user_list_req()
    {
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            'start<input type="text" id="start"/><br/>'+
            'counts<input type="text" id="counts"/><br/>'+
            '<button id="get_segment">完成</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';
        document.getElementById("get_segment").onclick=function(){
            var start = document.getElementById("start").value;
            var counts = document.getElementById("counts").value;
            var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
            var ret={start:start,nid:nid,counts:counts};
            ms.send_msg('cbms', 'cbms_auth_user_list_req', ret, function (type, data) {
                if (data.result == "failed") {
                    console.log("niconiconi");
                    //   console.log(error);
                }else {
                    console.log(data);
                }
                g_page.innerHTML='<div id="login_page">'+
                    '<button id="return">返回</button><br>'+
                    '</div>';
                document.getElementById("return").onclick=function() {
                    cbms_auth_user_list_req();
                }
            });
        };
        document.getElementById("return_home").onclick=function() {
            cbms_auth_req();
        }

    }
    function cbms_look_auth_user_req()
    {
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            'user<input type="text" id="user"/><br/>'+
            'auth<input type="text" id="auth"/><button id="auth_save">存入</button><button id="auth_clear">清空</button><br>'+
            '<button id="get_segment">完成</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';
        var auth=[];
        var i= 0,j=0;
        document.getElementById("auth_save").onclick=function() {
            var id=document.getElementById("auth").value;
            auth[i++] =id;
            this.value="";
        };

        document.getElementById("auth_clear").onclick=function() {
            auth.splice(0, auth.length);
            i=0;
        };
        document.getElementById("get_segment").onclick=function(){
            var user = document.getElementById("user").value;
            var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
            var ret={nid:nid,user:user,auth:auth};
            ms.send_msg('cbms', 'cbms_look_auth_user_req', ret, function (type, data) {
                if (data.result == "failed") {
                    console.log("niconiconi");
                    //   console.log(error);
                }else {
                    console.log(data);
                }
                g_page.innerHTML='<div id="login_page">'+
                    '<button id="return">返回</button><br>'+
                    '</div>';
                document.getElementById("return").onclick=function() {
                    cbms_look_auth_user_req();
                }
            });
        };
        document.getElementById("return_home").onclick=function() {
            cbms_auth_req();
        }

    }
    function cbms_set_auth_user_req()
    {
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            'user<input type="text" id="user"/><br/>'+
            'auth<input type="text" id="auth"/><button id="auth_save">存入</button><button id="auth_clear">清空</button><br>'+
            'auth_level<input type="text" id="auth_level"/><button id="auth_level_save">存入</button><button id="auth_level_clear">清空</button><br>'+
            '<button id="get_segment">完成</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';
        var auth=[];
        var auth_level = [];
        var i= 0,j=0;
        document.getElementById("auth_save").onclick=function() {
            var id=document.getElementById("auth").value;
            auth[i++] =id;
            this.value="";

        };
        document.getElementById("auth_level_save").onclick=function() {
            var lag=document.getElementById("auth_level").value;
            auth_level[j++] = lag;
            this.value="";

        };
        document.getElementById("auth_clear").onclick=function() {
            auth.splice(0, auth.length);
            i=0;
        };
        document.getElementById("auth_level_clear").onclick=function() {
            auth_level.splice(0, auth_level.length);
            j=0;
        };
        document.getElementById("get_segment").onclick=function(){
            var user = document.getElementById("user").value;
            var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
            var ret={nid:nid,user:user,auth:auth,auth_level:auth_level};
            ms.send_msg('cbms', 'cbms_set_auth_user_req', ret, function (type, data) {
                if (data.result == "failed") {
                    console.log("niconiconi");
                    //   console.log(error);
                }else {
                    console.log(data);
                }
                g_page.innerHTML='<div id="login_page">'+
                    '<button id="return">返回</button><br>'+
                    '</div>';
                document.getElementById("return").onclick=function() {
                    cbms_set_auth_user_req();
                }
            });
        };
        document.getElementById("return_home").onclick=function() {
            cbms_auth_req();
        }
    }


    function node_auth_req()
    {
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            'req<input type="text" id="req"/><br/>'+
            'sign<input type="text" id="sign"/><br/>'+
            'user<input type="text" id="user"/><br/>'+
            'auth<input type="text" id="auth"/><button id="auth_save">存入</button><button id="auth_clear">清空</button><br>'+
            'auth_level<input type="text" id="auth_level"/><button id="auth_level_save">存入</button><button id="auth_level_clear">清空</button><br>'+
            '<button id="get_segment">完成</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';
        var auth=[];
        var auth_level = [];
        var i= 0,j=0;
        document.getElementById("auth_save").onclick=function() {
            var id=document.getElementById("auth").value;
            auth[i++] =id;
            this.value="";

        };
        document.getElementById("auth_level_save").onclick=function() {
            var lag=document.getElementById("auth_level").value;
            auth_level[j++] = lag;
            this.value="";

        };
        document.getElementById("auth_clear").onclick=function() {
            auth.splice(0, auth.length);
            i=0;
        };
        document.getElementById("auth_level_clear").onclick=function() {
            auth_level.splice(0, auth_level.length);
            j=0;
        };
        document.getElementById("get_segment").onclick=function(){
            var req = document.getElementById("req").value;
            var sign = document.getElementById("sign").value;
            var user = document.getElementById("user").value;
            var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
            var ret={req:req,nid:nid,sign:sign,user:user,auth:auth,auth_level:auth_level};
            ms.send_msg(0x50000000, 'node_auth_req', ret, function (type, data) {
                if (data.result == "failed") {
                    console.log("niconiconi");
                    //   console.log(error);
                }else {
                    console.log(data);
                }
                g_page.innerHTML='<div id="login_page">'+
                    '<button id="return">返回</button><br>'+
                    '</div>';
                document.getElementById("return").onclick=function() {
                    node_auth_req();
                }
            });
        };
        document.getElementById("return_home").onclick=function() {
            fork();
        }
    }

    function node_auth_user_req()
    {
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            'start<input type="text" id="start"/><br/>'+
            'sign<input type="text" id="sign"/><br/>'+
            'counts<input type="text" id="counts"/><br/>'+
            '<button id="get_segment">完成</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';
        document.getElementById("get_segment").onclick=function(){
            var start = document.getElementById("start").value;
            var sign = document.getElementById("sign").value;
            var counts = document.getElementById("counts").value;
            var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
            var ret={start:start,nid:nid,sign:sign,counts:counts};
            ms.send_msg(0x50000000, 'node_auth_user_req', ret, function (type, data) {
                if (data.result == "failed") {
                    console.log("niconiconi");
                    //   console.log(error);
                }else {
                    console.log(data);
                }
                g_page.innerHTML='<div id="login_page">'+
                    '<button id="return">返回</button><br>'+
                    '</div>';
                document.getElementById("return").onclick=function() {
                    node_auth_user_req();
                }
            });
        };
        document.getElementById("return_home").onclick=function() {
            fork();
        }
    }



    var segment={};
    function get_pic()
    {
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            'pic_id<input type="text" id="key_pic_get"/><br/>'+
            '<button id="get_pic">完成</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';
        document.getElementById("get_pic").onclick=function(){
            var pic_key = document.getElementById("key_pic_get").value;
            var req = {pic_key:pic_key};
            ms.send_msg("cdms", "cdms_get_pic_req", req, function (type, data) {

                if (data.result == "failed") {
                    console.log("niconiconi");
                    //   console.log(error);

                }else {
                    console.log("niconiconi");
                }
                alert(data.result);

                g_page.innerHTML='<div id="login_page">'+
                    '<button id="return">返回</button><br>'+
                    '</div>';
                document.getElementById("return").onclick=function() {
                    get_pic();
                }
            });
        };
        document.getElementById("return_home").onclick=function() {
            fork();
        }
    }

    function set_pic()
    {
        /* function previewImage(file)
         {
         var MAXWIDTH  = 100;
         var MAXHEIGHT = 100;
         var div = document.getElementById('preview');
         if (file.files && file.files[0])
         {
         div.innerHTML = '<img id=imghead>';
         var img = document.getElementById('imghead');
         img.onload = function(){
         var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
         img.width = rect.width;
         img.height = rect.height;
         img.style.marginLeft = rect.left+'px';
         img.style.marginTop = rect.top+'px';
         };
         var reader = new FileReader();
         reader.onload = function(evt){img.src = evt.target.result;};
         reader.readAsDataURL(file.files[0]);
         }
         else
         {
         var sFilter='filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src="';
         file.select();
         var src = document.selection.createRange().text;
         div.innerHTML = '<img id=imghead>';
         var img_1 = document.getElementById('imghead');
         img_1.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;
         var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img_1.offsetWidth, img_1.offsetHeight);
         status =('rect:'+rect.top+','+rect.left+','+rect.width+','+rect.height);
         div.innerHTML = "<div id=divhead style='width:"+rect.width+"px;height:"+rect.height+"px;margin-top:"+rect.top+"px;margin-left:"+rect.left+"px;"+sFilter+src+"\"'></div>";
         }
         }
         function clacImgZoomParam( maxWidth, maxHeight, width, height ){
         var param = {top:0, left:0, width:width, height:height};
         if( width>maxWidth || height>maxHeight )
         {
         rateWidth = width / maxWidth;
         rateHeight = height / maxHeight;
         if( rateWidth > rateHeight )
         {
         param.width =  maxWidth;
         param.height = Math.round(height / rateWidth);
         }else
         {
         param.width = Math.round(width / rateHeight);
         param.height = maxHeight;
         }
         }
         param.left = Math.round((maxWidth - param.width) / 2);
         param.top = Math.round((maxHeight - param.height) / 2);
         return param;
         }*/
        var image ;

        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
                /*  '<style type="text/css">'+
                 '#preview{width:100px;height:100px;border:1px solid #000;overflow:hidden;}'+
                 '#imghead {filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=image);}'+
                 '</style>'+
                 '<div id="preview">'+
                 '<img id="imghead" width="100" height="100" border="0" src="../images/demo.jpg" >'+
                 '</div>'+
                 '<br/>'+
                 '<input type="file" onchange="previewImage(this)" /><br>'+*/
            "<form id='up_file_form' method='post' action='cdms/cdms_set_pic_req.js?'" +
            " enctype='multipart/form-data' " +
            "style='padding:0px;margin:0px;border:none;overflow:hidden;'>" +
            '<img id="image"src=""/><br/>'+
            '<input type="file" id="dupload_data" name="dupload_data"/>'+
            'REQ<input type="text" id="request"/><br/>'+
            'segment_id<input type="text" id="segment_id"/><br/>'+
            '语言<input type="text" id="language"/><br/>'+
            '<button id="set">tupia</button><br>'+
            '<button id="set_pic">完成</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';
        var form = document.getElementById("up_file_form");

        document.getElementById("set").onclick=function selectImage(){
            /*   var file=document.getElementById("dupload_data");
             if(!file.files || !file.files[0]){
             return;
             }
             */
            var reader = new FileReader();
            reader.onload = function(evt){
                document.getElementById('image').src = evt.target.result;
                image = evt.target.result;
            };
            //  reader.readAsDataURL(file.files[0]);
        };

        document.getElementById("set_pic").onclick=function(){
            var request = document.getElementById("request").value,
                segment_id = document.getElementById("segment_id").value,
                language = document.getElementById("language").value,
            /* upload_data = document.getElementById("file").value;*/
                upload_data = JSON.stringify(image);
            console.log(image);
            var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
            form.action += '&drequest=' + request;
            form.action += '&dsegment_id=' + segment_id;
            form.action += '&dlanguage=' + language;
            form.action += '&dnid=' + nid;
            form.submit();
            var req = {/*upload_data:image,*//* nid:"0",*/ request:request, segment_id:segment_id, language:language };
            /* window.send_msg('cdms', 'cdms_set_pic_req', req, function (type, data) {

             if (data.result == "failed") {
             console.log("niconiconi");
             console.log(data.result);
             }else {

             }
             g_page.innerHTML='<div id="login_page">'+
             '<button id="return">返回</button><br>'+
             '</div>';
             document.getElementById("return").onclick=function() {
             set_pic();
             }
             });*/
        };
        document.getElementById("return_home").onclick=function() {
            fork();
        }
    }

    function get_segment()
    {
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            'segment_name<input type="text" id="segment_name"/><br/>'+
            'segment_ids<input type="text" id="segment_ids"/><button id="segment_id_save">存入</button><button id="segment_id_clear">清空</button><br>'+
            'languages<input type="text" id="languages"/><button id="language_save">存入</button><button id="language_clear">清空</button><br>'+
            '<button id="get_segment">完成</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';
        var segment_ids=[];
        var languages = [];
        var i= 0,j=0;
        document.getElementById("segment_id_save").onclick=function() {
            var id=document.getElementById("segment_ids").value;
            segment_ids[i++] =id;
            this.value="";

        };
        document.getElementById("language_save").onclick=function() {
            var lag=document.getElementById("languages").value;
            languages[j++] = lag;
            this.value="";

        };
        document.getElementById("segment_id_clear").onclick=function() {
            segment_ids.splice(0, segment_ids.length);
            i=0;
        };
        document.getElementById("language_clear").onclick=function() {
            languages.splice(0, languages.length);
            j=0;
        };
        document.getElementById("get_segment").onclick=function(){
            var segment_name = document.getElementById("segment_name").value;
            var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
            var req = {};
            if (i == 0) {
                req = {nid:nid,segment_name:segment_name, language:languages};
            } else {
                req = {nid:nid,segment_ids:segment_ids, language:languages};
            }

            ms.send_msg('cdms', 'cdms_get_segment_req', req, function (type, data) {
                if (data.result == "failed") {
                    console.log("niconiconi");
                    //   console.log(error);
                }else {
                    console.log(data.total);
                    console.log(data);

                }
                g_page.innerHTML='<div id="login_page">'+
                    '<button id="return">返回</button><br>'+
                    '</div>';
                document.getElementById("return").onclick=function() {
                    get_segment();
                }
            });
        };
        document.getElementById("return_home").onclick=function() {
            fork();
        }
    }


  /*  function set_segment()
    {
        function save_segment()
        {
            segment.info={};

            g_page = mx("#page");
            g_page.innerHTML='<div id="login_page">'+
                'name<input type="text" id="name"/><br>'+
                'remark<input type="text" id="remark"/><br>'+
                'short_name<input type="text" id="short_name"/><br>'+
                'title<input type="text" id="title_1"/><br>'+
                'big_pic<input type="text" id="big_pic"/><br>'+
                'small_pic<input type="text" id="small_pic"/><br>'+
                'language<input type="text" id="language"/><br>'+
                'langs<input type="text" id="langs"/><br><button id="save_langs">存入</button><button id="langs_clear">清空</button></button><br>'+
                '<button id="segment" >完成</button><br>'+
                '</div>';
            var i=0;
            segment.langs=[];
            document.getElementById("save_langs").onclick=function() {
                segment.name=document.getElementById("name").value;
                segment.remark=document.getElementById("remark").value;
                segment.short_name=document.getElementById("short_name").value;
                segment.info.title=document.getElementById("title_1").value;
                segment.info.big_pic=document.getElementById("big_pic").value;
                segment.info.language=document.getElementById("language").value;
                segment.langs[i]={};
                segment.langs[i].title=document.getElementById("title_1").value;
                segment.langs[i].big_pic=document.getElementById("big_pic").value;
                segment.langs[i].small_pic=document.getElementById("small_pic").value;
                segment.langs[i].language=document.getElementById("langs").value;
                /!* var lag=document.getElementById("langs").value;
                 segment.langs[i]["language"]=lag;*!/
                i++;
            };
            document.getElementById("langs_clear").onclick=function() {
                delete segment.langs;
                i=0;
            };

            document.getElementById("segment").onclick=function() {
                set_segment();
            };

        }


        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            'flag<input type="text" id="flag"/><br/>'+
            'segment_id<input type="text" id="segment_id"/><br>'+
            '<button id="save_segment">存segment</button><br>'+
            '<button id="set_segment">完成</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';


        document.getElementById("save_segment").onclick=function() {

            save_segment();

        };
        document.getElementById("set_segment").onclick=function(){
            var segment_id = document.getElementById("segment_id").value,
                flag=document.getElementById("flag").value;
            // console.log(segment.langs);
            var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
            var req = {nid:nid,flag: flag, segment_id: segment_id, segment: segment};
            console.log(req);
            ms.send_msg('cdms', 'cdms_set_segment_req', req, function (type, data) {
                segment={};
                if (data.result == "failed") {
                    console.log("niconiconi");
                    //  console.log(error);

                }else {

                }
                console.log(data);
                g_page.innerHTML='<div id="login_page">'+
                    '<button id="return">返回</button><br>'+
                    '</div>';
                document.getElementById("return").onclick=function() {
                    set_segment();
                }
            });
        };
        document.getElementById("return_home").onclick=function() {
            fork();
        }
    }*/

    function set_segment()
    {
        function save_segment()
        {
            segment.info={};
            var big_pic;
            var small_pic;
            function showPreview(source) {
                var file = source.files[0];
                if(window.FileReader) {
                    var fr = new FileReader();
                    fr.onloadend = function(e) {
                        console.log(e.target.result);
                        if (source.name == "file") {
                            big_pic=e.target.result;
                        } else if (source.name == "file_1") {
                            small_pic=e.target.result;
                        }
                        /*document.getElementById("portrait").src = e.target.result;*/
                    };
                    fr.readAsDataURL(file);
                }
            }

            g_page = mx("#page");
            g_page.innerHTML='<div id="login_page">'+
                'name<input type="text" id="name"/><br>'+
                'remark<input type="text" id="remark"/><br>'+
                'short_name<input type="text" id="short_name"/><br>'+
                'title<input type="text" id="title_1"/><br>'+
                    /* 'big_pic<input type="text" id="big_pic"/><br>'+
                     'small_pic<input type="text" id="small_pic"/><br>'+*/
                'big_pic<input type="file" name="file" id="file"/><br>'+
                'small_pic<input type="file" name="file_1" id="file_1"/> <br>'+
                'language<input type="text" id="language"/><br>'+
                'langs<input type="text" id="langs"/><br><button id="save_langs">存入</button><button id="langs_clear">清空</button></button><br>'+
                '<button id="segment" >完成</button><br>'+
                '</div>';
            var i=0;

            segment.langs=[];
            document.getElementById("file").onchange=function() {
                console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
                var file = this.files[0];
                console.log(file);
                var fr = new FileReader();
                fr.onload = function() {
                    console.log(this.result);
                    big_pic=this.result.replace('data:image/jpeg;base64','data:application/octet-stream;base64');
                };
                fr.readAsDataURL(file);
            };
            document.getElementById("file_1").onchange=function() {
                console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
                var file = this.files[0];
                console.log(file);
                var fr = new FileReader();
                fr.onload = function() {
                    console.log(this.result);
                    small_pic=this.result.replace('data:image/jpeg;base64','data:application/octet-stream;base64');
                };
                fr.readAsDataURL(file);
            };
            document.getElementById("save_langs").onclick=function() {
                segment.name=document.getElementById("name").value;
                segment.remark=document.getElementById("remark").value;
                segment.short_name=document.getElementById("short_name").value;
                segment.info.title=document.getElementById("title_1").value;
                /*  segment.info.big_pic=document.getElementById("big_pic").value;*/
                segment.info.big_pic=big_pic;
                segment.info.small_pic=small_pic;
                segment.info.language=document.getElementById("language").value;
                segment.langs[i]={};
                segment.langs[i].title=document.getElementById("title_1").value;
                /*segment.langs[i].big_pic=document.getElementById("big_pic").value;
                 segment.langs[i].small_pic=document.getElementById("small_pic").value;*/
                segment.langs[i].big_pic=big_pic;
                segment.langs[i].small_pic=small_pic;
                segment.langs[i].language=document.getElementById("langs").value;
                /* var lag=document.getElementById("langs").value;
                 segment.langs[i]["language"]=lag;*/
                i++;
            };
            document.getElementById("langs_clear").onclick=function() {
                delete segment.langs;
                i=0;
            };

            document.getElementById("segment").onclick=function() {
                set_segment();
            };

        }


        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            'flag<input type="uint32" id="flag"/><br/>'+
            'segment_id<input type="text" id="segment_id"/><br>'+
            '<button id="save_segment">存segment</button><br>'+
            '<button id="set_segment">完成</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';


        document.getElementById("save_segment").onclick=function() {

            save_segment();

        };
        document.getElementById("set_segment").onclick=function(){
            var segment_id = document.getElementById("segment_id").value,
                flag=document.getElementById("flag").value;
            // console.log(segment.langs);
            var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
            var req = {nid:nid,flag: flag, segment_id: segment_id, segment: segment};
            console.log(req);
            ms.send_msg_from('cdms', 'cdms_set_segment_req', req, function (type, data) {
                segment={};
                if (data.result == "failed") {
                    console.log("niconiconi");
                    //  console.log(error);

                }else {

                }
                console.log(data);
                g_page.innerHTML='<div id="login_page">'+
                    '<button id="return">返回</button><br>'+
                    '</div>';
                document.getElementById("return").onclick=function() {
                    set_segment();
                }
            });
        };
        document.getElementById("return_home").onclick=function() {
            fork();
        }
    }

    function set_segment_users() {
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            'id<input type="text" id="users_id"/><br/>'+
            'user_add_segment_id<input type="text" id="add_segment_id"/><button id="add_segment_id_save">存入</button><button id="add_segment_id_clear">清空</button><br>'+
            'user_del_segment_id<input type="text" id="del_segment_id"/><button id="del_segment_id_save">存入</button><button id="del_segment_id_clear">清空</button><br>'+
            '<button id="set_segment_users">完成</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';
        var add_segment_id=[];
        var del_segment_id = [];
        var i= 0,j=0;
        document.getElementById("add_segment_id_save").onclick=function() {
            var id=document.getElementById("add_segment_id").value;
            add_segment_id[i++] =id;
            this.value="";

        };
        document.getElementById("add_segment_id_clear").onclick=function() {
            add_segment_id.splice(0, add_segment_id.length);
            i=0;
        };
        document.getElementById("del_segment_id_save").onclick=function() {
            var id=document.getElementById("del_segment_id").value;
            del_segment_id[j++] =id;
            this.value="";

        };
        document.getElementById("del_segment_id_clear").onclick=function() {
            del_segment_id.splice(0, del_segment_id.length);
            j=0;
        };
        document.getElementById("set_segment_users").onclick=function(){
            var id = document.getElementById("users_id").value;
            var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
            var req = {nid:nid,id:id,users_add:add_segment_id,users_del:del_segment_id};
            ms.send_msg('cdms', 'cdms_set_segment_users_req', req, function (type, data) {
                if (data.result == "failed") {
                    console.log("niconiconi");
                    //   console.log(error);
                }else {
                    console.log(data.total);
                    console.log(data);

                }
                g_page.innerHTML='<div id="login_page">'+
                    '<button id="return">返回</button><br>'+
                    '</div>';
                document.getElementById("return").onclick=function() {
                    set_segment_users();;
                }
            });
        };
        document.getElementById("return_home").onclick=function() {
            fork();
        }
    }

    function cdms_set_segment_users_lot_req() {
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            'id<input type="text" id="users_id"/><br/>'+
            'user_add_segment_id<input type="text" id="add_segment_id"/><button id="add_segment_id_save">存入</button><button id="add_segment_id_clear">清空</button><br>'+
            'user_del_segment_id<input type="text" id="del_segment_id"/><button id="del_segment_id_save">存入</button><button id="del_segment_id_clear">清空</button><br>'+
            '<button id="save_segment_users">存入</button>'+
            '<button id="clear_segment_users">清空</button><br>'+
            '<button id="set_segment_users">完成</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';
        var add_segment_id=[];
        var del_segment_id = [];
        var item=[];
        var i= 0,j=0;
        document.getElementById("add_segment_id_save").onclick=function() {
            var id=document.getElementById("add_segment_id").value;
            add_segment_id[i++] =id;
            this.value="";

        };
        document.getElementById("add_segment_id_clear").onclick=function() {
            add_segment_id.splice(0, add_segment_id.length);
            i=0;
        };
        document.getElementById("del_segment_id_save").onclick=function() {
            var id=document.getElementById("del_segment_id").value;
            del_segment_id[j++] =id;
            this.value="";

        };
        document.getElementById("del_segment_id_clear").onclick=function() {
            del_segment_id.splice(0, del_segment_id.length);
            j=0;
        };
        document.getElementById("save_segment_users").onclick=function() {
            var data={};
            data.id=document.getElementById("users_id").value;
            data.users_add=add_segment_id;
            data.users_del=del_segment_id;
            item.push(data);
        };
        document.getElementById("clear_segment_users").onclick=function() {
            item.length=0;
        };
        document.getElementById("set_segment_users").onclick=function(){
            var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );

            var req = {nid:nid,item:item};
            window.send_msg('cdms', 'cdms_set_segment_users_lot_req', req, function (type, data) {
                if (data.result == "failed") {
                    console.log("niconiconi");
                    //   console.log(error);
                }else {
                    console.log(data);

                }
                g_page.innerHTML='<div id="login_page">'+
                    '<button id="return">返回</button><br>'+
                    '</div>';
                document.getElementById("return").onclick=function() {
                    cdms_set_segment_users_lot_req();;
                }
            });
        };
        document.getElementById("return_home").onclick=function() {
            fork();
        }
    }
    function data_base() {
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            'file_name<input type="text" id="file_name"/><br/>'+
            '<button id="set_segment_users">完成</button><br>'+
            '<button id="read_file">读取</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';

        document.getElementById("set_segment_users").onclick=function(){
            var req={};
            var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
            req.nid=nid;
            req.file_name=document.getElementById("file_name").value;
            window.send_msg('cdms', 'cdms_data_base_req', req, function (type, data) {
                if (data.result == "failed") {
                    console.log("niconiconi");
                    //   console.log(error);
                }else {
                    console.log(data);

                }
                g_page.innerHTML='<div id="login_page">'+
                    '<button id="return">返回</button><br>'+
                    '</div>';
                document.getElementById("return").onclick=function() {
                    data_base();
                }
            });
        };

        document.getElementById("read_file").onclick=function(){
            var req={};
            var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
            req.nid=nid;
            req.file_name=document.getElementById("file_name").value;
            window.send_msg('cdms', 'cdms_load_data_req', req, function (type, data) {
                if (data.result == "failed") {
                    console.log("niconiconi");
                    //   console.log(error);
                }else {
                    console.log(data);

                }
                g_page.innerHTML='<div id="login_page">'+
                    '<button id="return">返回</button><br>'+
                    '</div>';
                document.getElementById("return").onclick=function() {
                    data_base();
                }
            });
        };
        document.getElementById("return_home").onclick=function() {
            fork();
        }
    }
//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
    function get_serial_list()
    {
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            'start<input type="uint32" id="list_start"/><br/>'+
            'counts<input type="uint32" id="list_counts"/><br/>'+
            'language<input type="lenstr" id="language"/><br/>'+
            'status<input type="lenstr" id="status"/><br/>'+
            'area<input type="lenstr" id="area"/><br/>'+
            '<button id="get_list">获取</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';
        document.getElementById("get_list").onclick=function(){
            var start = document.getElementById("list_start").value;
            var counts = document.getElementById("list_counts").value;
            var language = document.getElementById("language").value;
            var status = document.getElementById("status").value;
            var area = document.getElementById("area").value;
            var p=[];
            p[0]={n:"status",v:status};
            p[1]={n:"area",v:area};
            var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
            var req = {nid:nid,start:start,counts:counts,language:language,p:p};
            window.send_msg("cpis", "cpis_get_list_req", req, function (type, data) {

                if (data.result == "failed") {
                    console.log("get_error");
                    console.log(error);

                }else {
                    console.log("get_success");
                    console.log(data);
                }
                //alert(data.result);
                var datas=JSON.stringify(data.cpis_serials);
                g_page.innerHTML='<div id="login_page">'+
                    '<body>'+datas+'</body><br>'+
                    '<button id="return">返回</button><br>'+
                    '</div>';
                document.getElementById("return").onclick=function() {
                    get_serial_list();
                }
            });
        };
        document.getElementById("return_home").onclick=function() {
            cpis_test();
        }
    }
    function get_serials_req(){
        var req={};
        var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
        req.nid=nid;
        req.serial_id=[];
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            'serial_id<input type="lenstr" id="serial_id"/><br/>'+
            'language<input type="lenstr" id="language"/><br/>'+
            'status<input type="lenstr" id="status"/><br/>'+
            'area<input type="lenstr" id="area"/><br/>'+
            '<button id="add_serial_id">添加id</button><br>'+
            '<button id="get_serials">获取</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';
        document.getElementById("get_serials").onclick=function(){
            var id = document.getElementById("serial_id").value;
            var language = document.getElementById("language").value;
            var status = document.getElementById("status").value;
            var area = document.getElementById("area").value;
            var p=[];
            p[0]={n:"status",v:status};
            p[1]={n:"area",v:area};
            req.language=language;
            req.serial_id.push(id);
            req.p=p;
            send_to_cpis();
        };
        document.getElementById("add_serial_id").onclick=function(){
            var id = document.getElementById("serial_id").value;
            var language = document.getElementById("language").value;
            var status = document.getElementById("status").value;
            var area = document.getElementById("area").value;
            var p=[];
            p[0]={n:"status",v:status};
            p[1]={n:"area",v:area};
            req.language=language;
            req.serial_id.push(id);
            req.p=p;
            add_id();
        };
        document.getElementById("return_home").onclick=function() {
            cpis_test();
        };
        function  add_id(){
            g_page = mx("#page");
            g_page.innerHTML='<div id="login_page">'+
                'serial_id<input type="lenstr" id="serial_id"/><br/>'+
                '<button id="add_id">添加id</button><br>'+
                '<button id="get">获取</button><br>'+
                '<button id="return_home">返回</button><br>'+
                '</div>';
            document.getElementById("add_id").onclick=function(){
                var id = document.getElementById("serial_id").value;
                req.serial_id.push(id);
                add_id();
            };
            document.getElementById("get").onclick=function(){
                var id = document.getElementById("serial_id").value;
                req.serial_id.push(id);
                send_to_cpis();
            };
            document.getElementById("return_home").onclick=function() {
                get_serials_req();
            };
        }
        function  send_to_cpis(){

            window.send_msg("cpis", "cpis_get_serials_req", req, function (type, data) {

                if (data.result == "failed") {
                    console.log("get_error");
                    console.log(error);

                }else {
                    console.log("get_success");
                    console.log(data);
                }
                //alert(data.result);
                var datas=JSON.stringify(data.cpis_serials);
                g_page.innerHTML='<div id="login_page">'+
                    '<body>'+datas+'</body><br>'+
                    '<button id="return">返回</button><br>'+
                    '</div>';
                document.getElementById("return").onclick=function() {
                    get_serials_req();
                }
            });
        }

    }
    //--------------------------
    function set_serial() {

        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            '<button id="add_serial">添加系列</button><br>'+
            '<button id="del_serial">删除系列</button><br>'+
            '<button id="change_serial">修改系列基本内容</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';
        document.getElementById("add_serial").onclick=function(){
            add_serial();
        };
        document.getElementById("del_serial").onclick=function(){
            del_serial();
        };
        document.getElementById("change_serial").onclick=function(){
            change_serial();
        };
        document.getElementById("return_home").onclick=function(){
            fork();
        };

        function add_serial(){
            g_page = mx("#page");
            g_page.innerHTML='<div id="login_page">'+
                'name<input type="uint32" id="name"/><br/>'+
                'status<input type="lenstr" id="status"/><br/>'+
                'area<input type="lenstr" id="area"/><br/>'+
                'area1<input type="lenstr" id="area1"/><br/>'+
                'area2<input type="lenstr" id="area2"/><br/>'+
                'summery<input type="lenstr" id="summery"/><br/>'+
                '<button id="set_serial">设置</button><br>'+
                '<button id="return_home">返回</button><br>'+
                '</div>';
            document.getElementById("set_serial").onclick=function(){
                var flag=0;
                var name = document.getElementById("name").value;
                var status = document.getElementById("status").value;
                var area = document.getElementById("area").value;
                var area1 = document.getElementById("area1").value;
                var area2 = document.getElementById("area2").value;
                var summery = document.getElementById("summery").value;
                var filter={};
                filter.status=status;
                filter.area=[];
                filter.area.push(area,area1,area2);
                var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
                var req = {nid:nid,id:"",name:name,flag:flag,filter:filter,summery:summery};
                window.send_msg("cpis", "cpis_set_serial_req", req, function (type, data) {

                    if (data.result == "failed") {
                        console.log("get_error");
                        console.log(error);

                    }else {
                        console.log("get_success");
                        console.log(data);
                    }
                    alert(data.result+"   serial_id is:"+data.serial_id);

                    g_page.innerHTML='<div id="login_page">'+
                        '<button id="return">返回</button><br>'+
                        '</div>';
                    document.getElementById("return").onclick=function() {
                        set_serial();
                    }
                });
            };
            document.getElementById("return_home").onclick=function() {
                set_serial();
            }
        }
        function del_serial(){
            g_page = mx("#page");
            g_page.innerHTML='<div id="login_page">'+
                'id<input type="uint32" id="serial_id"/><br/>'+
                '<button id="set_serial">设置</button><br>'+
                '<button id="return_home">返回</button><br>'+
                '</div>';
            document.getElementById("set_serial").onclick=function(){
                var id = document.getElementById("serial_id").value;
                var flag=1;
                var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
                var req = {nid:nid,id:id,flag:flag};
                window.send_msg("cpis", "cpis_set_serial_req", req, function (type, data) {

                    if (data.result == "failed") {
                        console.log("get_error");
                        console.log(error);

                    }else {
                        console.log("get_success");
                        console.log(data);
                    }
                    if(data.result==""){
                        alert("success");
                    }
                    else{
                        alert(data.result);
                    }


                    g_page.innerHTML='<div id="login_page">'+
                        '<button id="return">返回</button><br>'+
                        '</div>';
                    document.getElementById("return").onclick=function() {
                        set_serial();
                    }
                });
            };
            document.getElementById("return_home").onclick=function() {
                set_serial();
            }
        }

        function change_serial(){
            g_page = mx("#page");
            g_page.innerHTML='<div id="login_page">'+
                'id<input type="uint32" id="serial_id"/><br/>'+
                'name<input type="uint32" id="name"/><br/>'+
                'status<input type="lenstr" id="status"/><br/>'+
                'area<input type="lenstr" id="area"/><br/>'+
                'area1<input type="lenstr" id="area1"/><br/>'+
                'area2<input type="lenstr" id="area2"/><br/>'+
                'summery<input type="lenstr" id="summery"/><br/>'+
                '<button id="set_serial">设置</button><br>'+
                '<button id="return_home">返回</button><br>'+
                '</div>';
            document.getElementById("set_serial").onclick=function(){
                var id = document.getElementById("serial_id").value;
                var flag=0;
                var name = document.getElementById("name").value;
                var status = document.getElementById("status").value;
                var area = document.getElementById("area").value;
                var area1 = document.getElementById("area1").value;
                var area2 = document.getElementById("area2").value;
                var summery = document.getElementById("summery").value;
                var filter={};
                filter.status=status;
                filter.area=[];
                filter.area.push(area,area1,area2);
                var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
                var req = {nid:nid,id:id,name:name,flag:flag,filter:filter,summery:summery};
                window.send_msg("cpis", "cpis_set_serial_req", req, function (type, data) {

                    if (data.result == "failed") {
                        console.log("get_error");
                        console.log(error);

                    }else {
                        console.log("get_success");
                        console.log(data);
                    }
                    if(data.result==""){
                        alert("success");
                    }
                    else{
                        alert(data.result);
                    }

                    g_page.innerHTML='<div id="login_page">'+
                        '<button id="return">返回</button><br>'+
                        '</div>';
                    document.getElementById("return").onclick=function() {
                        set_serial();
                    }
                });
            };
            document.getElementById("return_home").onclick=function() {
                set_serial();
            }
        }

    }
    //--------------------------------
    function  set_model(){
        var i=0;
        var j=0;
        var k=0;
        var req={};
        var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
        req.nid=nid;
        var filter={};
        g_page = mx("#page");
        g_page.innerHTML = '<div id="login_page">' +
            '<button id="add_model">添加型号</button><br>' +
            '<button id="del_model">删除型号</button><br>' +
            '<button id="change_model">修改型号</button><br>' +
            '<button id="serial_init">修改系列默认内容</button><br>' +
            '<button id="return_home">return</button><br>' +
            '</div>';

        document.getElementById("return_home").onclick=function() {
            cpis_test();
        };
        document.getElementById("add_model").onclick=function() {
            add_model();
        };
        document.getElementById("del_model").onclick=function() {
            del_model();
        };
        document.getElementById("change_model").onclick=function() {
            change_model();
        };
        document.getElementById("serial_init").onclick=function() {
            serial_init();
        };
        function add_model(){
            g_page = mx("#page");
            g_page.innerHTML = '<div id="login_page">' +
                'serial_id<input type="text" id="serial_id"/><br>' +
                'model_name<input type="text" id="model_name"/><br>' +
                'status<input type="text" id="status"/><br>' +
                'area1<input type="text" id="area1"/><br>' +
                'area2<input type="text" id="area2"/><br>' +
                '<button id="add_main">add_main</button><br>' +
                '<button id="add_info">add_info</button><br>' +
                '<button id="send">set_with_no_main_and_info</button><br>' +
                '<button id="return_home">return</button><br>' +
                '</div>';

            document.getElementById("return_home").onclick=function() {
                set_model();
            };
            document.getElementById("send").onclick=function() {
                req.flag = 0;
                req.serial_id = document.getElementById("serial_id").value;
                req.name = document.getElementById("model_name").value;
                var filter={};
                var status=document.getElementById("status").value;
                var area1=document.getElementById("area1").value;
                var area2=document.getElementById("area2").value;
                filter.status=status;
                filter.area=[];
                filter.area=[area1,area2];
                req.filter=filter;
                req.nid=nid;
                send_to_cpis();
            };
            document.getElementById("add_main").onclick=function() {
                req.flag = 0;
                req.serial_id = document.getElementById("serial_id").value;
                req.mdoel_name = document.getElementById("model_name").value;
                var filter={};
                var status=document.getElementById("status").value;
                var area1=document.getElementById("area1").value;
                var area2=document.getElementById("area2").value;
                filter.status=status;
                filter.area=[];
                filter.area=[area1,area2];
                req.filter=filter;
                req.main={};
                req.main.groups=[];
                get_main_groups()
            };
            document.getElementById("add_info").onclick=function() {
                req.flag = 0;
                req.serial_id = document.getElementById("serial_id").value;
                req.mdoel_name = document.getElementById("model_name").value;
                var filter={};
                var status=document.getElementById("status").value;
                var area1=document.getElementById("area1").value;
                var area2=document.getElementById("area2").value;
                filter.status=status;
                filter.area=[];
                filter.area=[area1,area2];
                req.filter=filter;
                req.info={};
                req.info.groups=[];
                get_info_groups()
            }
        }
//-------------------------------
        function del_model(){
            g_page = mx("#page");
            g_page.innerHTML = '<div id="login_page">' +
                'serial_id<input type="text" id="serial_id"/><br>' +
                'model_id<input type="text" id="model_id"/><br>' +
                '<button id="delete">删除</button><br>' +
                '<button id="return_home">return</button><br>' +
                '</div>';

            document.getElementById("return_home").onclick=function() {
                set_model();
            };
            document.getElementById("delete").onclick=function() {
                req.flag = 1;
                req.serial_id = document.getElementById("serial_id").value;
                req.model_id = document.getElementById("model_id").value
                send_to_cpis();
            }

        }
//-------------------------------
        function change_model(){
            g_page = mx("#page");
            g_page.innerHTML = '<div id="login_page">' +
                'serial_id<input type="text" id="serial_id"/><br>' +
                'model_id<input type="text" id="model_id"/><br>' +
                'model_name<input type="text" id="model_name"/><br>' +
                'status<input type="text" id="status"/><br>' +
                'area1<input type="text" id="area1"/><br>' +
                'area2<input type="text" id="area2"/><br>' +
                '<button id="add_main">add_main</button><br>' +
                '<button id="add_info">add_info</button><br>' +
                '<button id="send">set_with_no_main_and_info</button><br>' +
                '<button id="return_home">return</button><br>' +
                '</div>';

            document.getElementById("return_home").onclick=function() {
                set_model();
            }
            document.getElementById("send").onclick=function() {
                req.flag = 0;
                req.serial_id = document.getElementById("serial_id").value;
                req.model_id = document.getElementById("model_id").value;
                req.name = document.getElementById("model_name").value;
                var filter={};
                var status=document.getElementById("status").value;
                var area1=document.getElementById("area1").value;
                var area2=document.getElementById("area2").value;
                filter.status=status;
                filter.area=[];
                filter.area=[area1,area2];
                req.filter=filter;
                req.nid=nid;
                send_to_cpis();
            }
            document.getElementById("add_main").onclick=function() {
                req.flag = 0;
                req.serial_id = document.getElementById("serial_id").value;
                req.model_id = document.getElementById("model_id").value;
                req.mdoel_name = document.getElementById("model_name").value;
                var filter={};
                var status=document.getElementById("status").value;
                var area1=document.getElementById("area1").value;
                var area2=document.getElementById("area2").value;
                filter.status=status;
                filter.area=[];
                filter.area=[area1,area2];
                req.filter=filter;
                req.main={};
                req.main.groups=[];
                get_main_groups()
            }
            document.getElementById("add_info").onclick=function() {
                req.flag = 0;
                req.serial_id = document.getElementById("serial_id").value;
                req.model_id = document.getElementById("model_id").value;
                req.mdoel_name = document.getElementById("model_name").value;
                var filter={};
                var status=document.getElementById("status").value;
                var area1=document.getElementById("area1").value;
                var area2=document.getElementById("area2").value;
                filter.status=status;
                filter.area=[];
                filter.area=[area1,area2];
                req.filter=filter;
                req.info={};
                req.info.groups=[];
                get_info_groups()
            }
        }
//-------------------------------
        function serial_init(){
            g_page = mx("#page");
            g_page.innerHTML = '<div id="login_page">' +
                'serial_id<input type="text" id="serial_id"/><br>' +
                '<button id="add_main">add_main</button><br>' +
                '<button id="add_info">add_info</button><br>' +
                '<button id="send">set_with_no_main_and_info</button><br>' +
                '<button id="return_home">return</button><br>' +
                '</div>';

            document.getElementById("return_home").onclick=function() {
                set_model();
            }
            document.getElementById("send").onclick=function() {
                req.flag = 0;
                req.serial_id = document.getElementById("serial_id").value;
                req.model_id = "default";
                req.nid=nid;
                send_to_cpis();
            }
            document.getElementById("add_main").onclick=function() {
                req.flag = 0;
                req.serial_id = document.getElementById("serial_id").value;
                req.model_id ="default";
                req.main={};
                req.main.groups=[];
                get_main_groups()
            }
            document.getElementById("add_info").onclick=function() {
                req.flag = 0;
                req.serial_id = document.getElementById("serial_id").value;
                req.model_id = "default";
                req.info={};
                req.info.groups=[];
                get_info_groups()
            }
        }
// ------------------------------

        function get_main_groups() {
            g_page = mx("#page");
            g_page.innerHTML = '<div id="login_page">' +
                'main_groups_id<input type="text" id="main_groups_id"/><br>' +
                'main_groups_status<input type="text" id="main_groups_status"/><br>' +
                'main_groups_area1<input type="text" id="main_groups_area1"/><br>' +
                'main_groups_area2<input type="text" id="main_groups_area2"/><br>' +
                'main_groups_area3<input type="text" id="main_groups_area3"/><br>' +
                '<button id="add_main_segment">add_main_segment</button><br>' +
                '<button id="add_main_group">add_main_group</button><br>' +
                '<button id="send_with_now">发送</button><br>' +
                '<button id="return_home">return</button><br>' +
                '</div>';
            document.getElementById("send_with_now").onclick = function () {
                req.main.groups[i]={};
                req.main.groups[i].segment={};
                var filter={};
                filter.status=document.getElementById("main_groups_status").value;
                var area1=document.getElementById("main_groups_area1").value;
                var area2=document.getElementById("main_groups_area2").value;
                var area3=document.getElementById("main_groups_area3").value;
                filter.area=[];
                filter.area=[area1,area2,area3];
                req.main.groups[i].id=document.getElementById("main_groups_id").value;
                req.main.groups[i].filter=filter;
                send_to_cpis();
            }
            document.getElementById("add_main_segment").onclick = function () {
                req.main.groups[i]={};
                req.main.groups[i].segment={};
                var filter={};
                filter.status=document.getElementById("main_groups_status").value;
                var area1=document.getElementById("main_groups_area1").value;
                var area2=document.getElementById("main_groups_area2").value;
                var area3=document.getElementById("main_groups_area3").value;
                filter.area=[];
                filter.area=[area1,area2,area3];
                req.main.groups[i].id=document.getElementById("main_groups_id").value;
                req.main.groups[i].filter=filter;
                get_main_segments();
            }
            document.getElementById("add_main_group").onclick = function () {
                req.main.groups[i]={};
                req.main.groups[i].segment={};
                var filter={};
                filter.status=document.getElementById("main_groups_status").value;
                var area1=document.getElementById("main_groups_area1").value;
                var area2=document.getElementById("main_groups_area2").value;
                var area3=document.getElementById("main_groups_area3").value;
                filter.area=[];
                filter.area=[area1,area2,area3];
                req.main.groups[i].id=document.getElementById("main_groups_id").value;
                req.main.groups[i].filter=filter;
                j=0;
                i++;
                get_main_groups();
            }
            document.getElementById("return_home").onclick = function () {
                delete(req);
                set_model();
            }
        }

        function  get_main_segments(){
            g_page = mx("#page");
            g_page.innerHTML = '<div id="login_page">' +
                'main_segment_id<input type="text" id="main_segment_id"/><br>' +
                'main_segment_status<input type="text" id="main_segment_status"/><br>' +
                'main_segment_area1<input type="text" id="main_segment_area1"/><br>' +
                'main_segment_area2<input type="text" id="main_segment_area2"/><br>' +
                '<button id="main_segment">add_main_segment</button><br>' +
                '<button id="add_main_group">add_main_group</button><br>' +
                '<button id="send_data_now">发送</button><br>' +
                '<button id="add_info_group">add_info_group</button><br>' +
                '<button id="return_home">return</button><br>' +
                '</div>';
            document.getElementById("send_data_now").onclick = function () {
                req.main.groups[i].segment[j]={};
                var filter={};
                var ids="";
                filter.status=document.getElementById("main_segment_status").value;
                var area1=document.getElementById("main_segment_area1").value;
                var area2=document.getElementById("main_segment_area2").value;
                filter.area=[];
                filter.area=[area1,area2];
                ids=document.getElementById("main_segment_id").value;
                req.main.groups[i].segment[j].id=ids;
                req.main.groups[i].segment[j].filter=filter;
                send_to_cpis();
            }
            document.getElementById("main_segment").onclick = function () {
                req.main.groups[i].segment[j]={};
                var filter={};
                var ids="";
                filter.status=document.getElementById("main_segment_status").value;
                var area1=document.getElementById("main_segment_area1").value;
                var area2=document.getElementById("main_segment_area2").value;
                filter.area=[];
                filter.area=[area1,area2];
                ids=document.getElementById("main_segment_id").value;
                req.main.groups[i].segment[j].id=ids;
                req.main.groups[i].segment[j].filter=filter;
                j++;
                get_main_segments();
            }
            document.getElementById("add_main_group").onclick = function () {
                req.main.groups[i].segment[j]={};
                var filter={};
                var ids="";
                filter.status=document.getElementById("main_segment_status").value;
                var area1=document.getElementById("main_segment_area1").value;
                var area2=document.getElementById("main_segment_area2").value;
                filter.area=[];
                filter.area=[area1,area2];
                ids=document.getElementById("main_segment_id").value;
                req.main.groups[i].segment[j].id=ids;
                req.main.groups[i].segment[j].filter=filter;
                j=0;
                i++;
                get_main_groups();
            }
            document.getElementById("add_info_group").onclick = function () {
                req.main.groups[i].segment[j]={};
                var filter={};
                var ids="";
                filter.status=document.getElementById("main_segment_status").value;
                var area1=document.getElementById("main_segment_area1").value;
                var area2=document.getElementById("main_segment_area2").value;
                filter.area=[];
                filter.area=[area1,area2];
                ids=document.getElementById("main_segment_id").value;
                req.main.groups[i].segment[j].id=ids;
                req.main.groups[i].segment[j].filter=filter;
                j=0;
                i=0;
                req.info={};
                req.info.groups=[];
                get_info_groups();
            }
        }
        function  get_info_groups(){
            g_page = mx("#page");
            g_page.innerHTML = '<div id="login_page">' +
                'info_groups_id<input type="text" id="info_groups_id"/><br>' +
                'info_groups_status<input type="text" id="info_groups_status"/><br>' +
                'info_groups_area1<input type="text" id="info_groups_area1"/><br>' +
                'info_groups_area2<input type="text" id="info_groups_area2"/><br>' +
                'info_groups_area3<input type="text" id="info_groups_area3"/><br>' +
                '<button id="info_segment">add_info_segment</button><br>' +
                '<button id="info_group">add_info_group</button><br>' +
                '<button id="send_it_now">发送</button><br>' +
                '<button id="return_home">return</button><br>' +
                '</div>';
            document.getElementById("send_it_now").onclick = function () {
                req.info.groups[i]={};
                req.info.groups[i].segment={};
                var filter={};
                filter.status=document.getElementById("info_groups_status").value;
                var area1=document.getElementById("info_groups_area1").value;
                var area2=document.getElementById("info_groups_area2").value;
                var area3=document.getElementById("info_groups_area3").value;
                filter.area=[];
                filter.area=[area1,area2,area3];
                req.info.groups[i].id=document.getElementById("info_groups_id").value;
                req.info.groups[i].filter=filter;
                send_to_cpis();
            }
            document.getElementById("info_segment").onclick = function () {
                req.info.groups[i]={};
                req.info.groups[i].segment={};
                var filter={};
                filter.status=document.getElementById("info_groups_status").value;
                var area1=document.getElementById("info_groups_area1").value;
                var area2=document.getElementById("info_groups_area2").value;
                var area3=document.getElementById("info_groups_area3").value;
                filter.area=[];
                filter.area=[area1,area2,area3];
                req.info.groups[i].id=document.getElementById("info_groups_id").value;
                req.info.groups[i].filter=filter;
                get_info_segments();
            }
            document.getElementById("info_group").onclick = function () {
                req.info.groups[i]={};
                req.info.groups[i].segment={};
                var filter={};
                filter.status=document.getElementById("info_groups_status").value;
                var area1=document.getElementById("info_groups_area1").value;
                var area2=document.getElementById("info_groups_area2").value;
                var area3=document.getElementById("info_groups_area3").value;
                filter.area=[];
                filter.area=[area1,area2,area3];
                req.info.groups[i].id=document.getElementById("info_groups_id").value;
                req.info.groups[i].filter=filter;
                j=0;
                i++;
                get_info_groups();
            }
            document.getElementById("return_home").onclick = function () {
                delete(req);
                set_model();
            }
        }
        function  get_info_segments(){
            g_page = mx("#page");
            g_page.innerHTML = '<div id="login_page">' +
                'info_segment_id<input type="text" id="info_segment_id"/><br>' +
                'info_segment_status<input type="text" id="info_segment_status"/><br>' +
                'info_segment_area1<input type="text" id="info_segment_area1"/><br>' +
                'info_segment_area2<input type="text" id="info_segment_area2"/><br>' +
                '<button id="info_segment">add_info_segment</button><br>' +
                '<button id="info_group">add_info_group</button><br>'+
                '<button id="send_to_cpis">发送</button><br>' +
                '<button id="return_home">return</button><br>' +
                '</div>';
            document.getElementById("info_segment").onclick = function () {
                var segment={};
                var filter={};
                filter.status=document.getElementById("info_segment_status").value;
                var area1=document.getElementById("info_segment_area1").value;
                var area2=document.getElementById("info_segment_area2").value;
                filter.area=[];
                filter.area=[area1,area2];
                segment.id=document.getElementById("info_segment_id").value;
                segment.filter=filter;
                req.info.groups[i].segment[j]=segment;
                // req.info.groups[i].segment[j].id= document.getElementById("info_segment_id").value;
                //   req.info.groups[i].segment[j].filter= filter;
                j++;
                get_info_segments();
            }
            document.getElementById("info_group").onclick = function () {
                var segment={};
                var filter={};
                filter.status=document.getElementById("info_segment_status").value;
                var area1=document.getElementById("info_segment_area1").value;
                var area2=document.getElementById("info_segment_area2").value;
                filter.area=[];
                filter.area=[area1,area2];
                segment.id=document.getElementById("info_segment_id").value;
                segment.filter=filter;
                req.info.groups[i].segment[j]=segment;
                // req.info.groups[i].segment[j].id= document.ge
                j=0;
                i++;
                get_info_groups();
            }
            document.getElementById("send_to_cpis").onclick = function () {
                var segment={};
                var filter={};
                filter.status=document.getElementById("info_segment_status").value;
                var area1=document.getElementById("info_segment_area1").value;
                var area2=document.getElementById("info_segment_area2").value;
                var area=[];
                area=[area1,area2];
                filter.area=area;
                segment.id=document.getElementById("info_segment_id").value;
                segment.filter=filter;
                req.info.groups[i].segment[j]=segment;
                // req.info.groups[i].segment[j].id= document.getElementById("info_segment_id").value;
                //   req.info.groups[i].segment[j].filter= filter;
                send_to_cpis();

            }
        }

        function  send_to_cpis(){
            console.log(req);
            //  var send_data={flag:req.flag,name:req.name,filter:req.filter,main:req.main,info:req.info,p:p};
            window.send_msg_from("cpis", "cpis_set_model_req", req, function (type, data) {

                if (data.result == "failed") {
                    console.log("get_error");
                    console.log(error);

                }else {
                    console.log("get_success");
                    console.log(data);
                }
                if(data.result==""){
                    alert("success");
                }
                else{
                    alert(data.result);
                }

                g_page.innerHTML='<div id="login_page">'+
                    '<button id="return">返回</button><br>'+
                    '</div>';
                document.getElementById("return").onclick=function() {
                    set_model();
                }
            });
        }

    }
    //-----------------------
    function set_model1(){

        g_page = mx("#page");
        g_page.innerHTML = '<div id="login_page">' +
            'flag<input type="text" id="flag"/><br>' +
            'serial_id<input type="text" id="serial_id"/><br>' +
            'model_id<input type="text" id="model_id"/><br>' +
            'model_name<input type="text" id="model_name"/><br>' +
            'status<input type="text" id="status"/><br>' +
            'area1<input type="text" id="area1"/><br>' +
            'area1<input type="text" id="area2"/><br>' +
            '<button id="enext">设置</button><br>' +
            '<button id="return_home">return</button><br>' +
            '</div>';

        document.getElementById("enext").onclick = function () {
            var flag=document.getElementById("flag").value;
            var serial_id = document.getElementById("serial_id").value;
            var model_id = document.getElementById("model_id").value;
            var model_name = document.getElementById("model_name").value;
            var status = document.getElementById("status").value;
            var area1 = document.getElementById("area1").value;
            var area2 = document.getElementById("area2").value;
            var req={};
            req.flag=flag;
            req.serial_id=serial_id;
            req.model_id=model_id;
            req.name=model_name;
            var area=[];
            area.push(area1,area2);
            var  filter={};
            filter.status=status;
            filter.area=area;
            req.filter={};
            req.filter[0]={};
            req.filter[0]=filter;

            req.main={};
            req.info={};
            req.main.groups=[];
            req.main.groups[0]={};
            req.main.groups[0].id="cdms.cpis.0";
            req.main.groups[0].filter={};
            req.main.groups[0].filter=filter;
            req.main.groups[0].segments=[];
            req.main.groups[0].segments[0]={};
            req.main.groups[0].segments[0].id="cdms.cpis.1";
            req.main.groups[0].segments[0].filter={};
            req.main.groups[0].segments[0].filter=filter;

            req.main.groups[0].segments[1]={};
            req.main.groups[0].segments[1].id="cdms.cpis.2";
            req.main.groups[0].segments[1].filter={};
            req.main.groups[0].segments[1].filter=filter;

            req.main.groups[0].segments[2]={};
            req.main.groups[0].segments[2].id="cdms.cpis.3";
            req.main.groups[0].segments[2].filter={};
            req.main.groups[0].segments[2].filter=filter;

            //----------------------------------------------
            req.main.groups[1]={};
            req.main.groups[1].id="cdms.cpis.4";
            req.main.groups[1].filter={};
            req.main.groups[1].filter=filter;
            req.main.groups[1].segments=[];
            req.main.groups[1].segments[0]={};
            req.main.groups[1].segments[0].id="cdms.cpis.5";
            req.main.groups[1].segments[0].filter={};
            req.main.groups[1].segments[0].filter=filter;

            req.main.groups[1].segments[1]={};
            req.main.groups[1].segments[1].id="cdms.cpis.6";
            req.main.groups[1].segments[1].filter={};
            req.main.groups[1].segments[1].filter=filter;

            req.main.groups[1].segments[2]={};
            req.main.groups[1].segments[2].id="cdms.cpis.7";
            req.main.groups[1].segments[2].filter={};
            req.main.groups[1].segments[2].filter=filter;

            //----------------------------------------------
            //req.main.groups[2]={};
            //req.main.groups[2].id="cdms.cpis.8";
            //req.main.groups[2].filter={};
            //req.main.groups[2].filter=filter;
            //req.main.groups[2].segments=[];
            //req.main.groups[2].segments[0]={};
            //req.main.groups[2].segments[0].id="cdms.cpis.9";
            //req.main.groups[2].segments[0].filter={};
            //req.main.groups[2].segments[0].filter=filter;
            //
            //req.main.groups[2].segments[1]={};
            //req.main.groups[2].segments[1].id="cdms.cpis.10";
            //req.main.groups[2].segments[1].filter={};
            //req.main.groups[2].segments[1].filter=filter;
            //
            //req.main.groups[2].segments[2]={};
            //req.main.groups[2].segments[2].id="cdms.cpis.11";
            //req.main.groups[2].segments[2].filter={};
            //req.main.groups[2].segments[2].filter=filter;
            ////----------------------------------------------
            //req.main.groups[3]={};
            //req.main.groups[3].id="cdms.cpis.12";
            //req.main.groups[3].filter={};
            //req.main.groups[3].filter=filter;
            //req.main.groups[3].segments=[];
            //req.main.groups[3].segments[0]={};
            //req.main.groups[3].segments[0].id="cdms.cpis.13";
            //req.main.groups[3].segments[0].filter={};
            //req.main.groups[3].segments[0].filter=filter;
            //
            //req.main.groups[3].segments[1]={};
            //req.main.groups[3].segments[1].id="cdms.cpis.14";
            //req.main.groups[3].segments[1].filter={};
            //req.main.groups[3].segments[1].filter=filter;
            //
            //req.main.groups[3].segments[2]={};
            //req.main.groups[3].segments[2].id="cdms.cpis.15";
            //req.main.groups[3].segments[2].filter={};
            //req.main.groups[3].segments[2].filter=filter;
            ////----------------------------------------------
            //req.main.groups[4]={};
            //req.main.groups[4].id="cdms.cpis.16";
            //req.main.groups[4].filter={};
            //req.main.groups[4].filter=filter;
            //req.main.groups[4].segments=[];
            //req.main.groups[4].segments[0]={};
            //req.main.groups[4].segments[0].id="cdms.cpis.17";
            //req.main.groups[4].segments[0].filter={};
            //req.main.groups[4].segments[0].filter=filter;
            //
            //req.main.groups[4].segments[1]={};
            //req.main.groups[4].segments[1].id="cdms.cpis.18";
            //req.main.groups[4].segments[1].filter={};
            //req.main.groups[4].segments[1].filter=filter;
            //
            //req.main.groups[4].segments[2]={};
            //req.main.groups[4].segments[2].id="cdms.cpis.19";
            //req.main.groups[4].segments[2].filter={};
            //req.main.groups[4].segments[2].filter=filter;

            //----------------------------------------
            req.info={};
            req.info.groups=[];
            req.info.groups[0]={};
            req.info.groups[0].id="cdms.cpis.8";
            req.info.groups[0].filter={};
            req.info.groups[0].filter=filter;
            req.info.groups[0].segments=[];
            req.info.groups[0].segments[0]={};
            req.info.groups[0].segments[0].id="cdms.cpis.9";
            req.info.groups[0].segments[0].filter={};
            req.info.groups[0].segments[0].filter=filter;

            req.info.groups[0].segments[1]={};
            req.info.groups[0].segments[1].id="cdms.cpis.10";
            req.info.groups[0].segments[1].filter={};
            req.info.groups[0].segments[1].filter=filter;

            req.info.groups[0].segments[2]={};
            req.info.groups[0].segments[2].id="cdms.cpis.11";
            req.info.groups[0].segments[2].filter={};
            req.info.groups[0].segments[2].filter=filter;

            //----------------------------------------------
            //req.info.groups[1]={};
            //req.info.groups[1].id="cdms.cpis.12";
            //req.info.groups[1].filter={};
            //req.info.groups[1].filter=filter;
            //req.info.groups[1].segments=[];
            //req.info.groups[1].segments[0]={};
            //req.info.groups[1].segments[0].id="cdms.cpis.13";
            //req.info.groups[1].segments[0].filter={};
            //req.info.groups[1].segments[0].filter=filter;
            //
            //req.info.groups[1].segments[1]={};
            //req.info.groups[1].segments[1].id="cdms.cpis.14";
            //req.info.groups[1].segments[1].filter={};
            //req.info.groups[1].segments[1].filter=filter;
            //
            //req.info.groups[1].segments[2]={};
            //req.info.groups[1].segments[2].id="cdms.cpis.15";
            //req.info.groups[1].segments[2].filter={};
            //req.info.groups[1].segments[2].filter=filter;
            console.log(req);
            console.log(req.main.groups);
            var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
            var ack={nid:nid,flag:req.flag,serial_id:req.serial_id,
                model_id:req.model_id,
                name:model_name,
                main:req.main,
                info:req.info,
                filter:req.filter};
            console.log("---------------");
            console.log(req.info);
            console.log("---------------");
            send_msg_from("cpis", "cpis_set_model_req", ack, function (type, data) {
                console.log("123");
                if (data.result == "failed") {
                    console.log("get_error");
                    console.log(error);

                }else {
                    console.log("set_success");
                    console.log(data);
                }
                if(data.result==""){
                    alert("success");
                }
                else{
                    alert(data.result);
                }

                g_page.innerHTML='<div id="login_page">'+
                    '<button id="return">返回</button><br>'+
                    '</div>';
                document.getElementById("return").onclick=function() {
                    set_model1();
                }
            });
        }
        document.getElementById("return_home").onclick=function() {
            cpis_test();
        }
    }
    //---------------------------
    function  get_model(){
        var req={};
        req.serials=[];
        req.p=[];
        var serials={};
        var i=0;
        var j=0;
        g_page = mx("#page");
        g_page.innerHTML = '<div id="login_page">' +
            'language<input type="text" id="language"/><br>' +
            '<button id="serials">add_serials</button><br>' +
            '<button id="return_home">return</button><br>' +
            '</div>';
        document.getElementById("serials").onclick = function () {
            req.language = document.getElementById("language").value;
            req.serials=[];
            get_serials();
        }
        function get_serials(){
            g_page = mx("#page");
            g_page.innerHTML = '<div id="login_page">' +
                'serial_id<input type="text" id="serial_id"/><br>' +
                '<button id="ser_id">add_models</button><br>' +
                '<button id="return_home">return</button><br>' +
                '</div>';

            document.getElementById("ser_id").onclick = function () {
                req.serials[i]={};
                req.serials[i].serial_id=document.getElementById("serial_id").value;
                req.serials[i].models=[];
                get_models();

            }

        }
        function get_models(){
            g_page = mx("#page");
            g_page.innerHTML = '<div id="login_page">' +
                'model_id<input type="text" id="model_id"/><br>' +
                '<button id="add_model_id">add_model_id</button><br>' +
                '<button id="add_serials">add_serial</button><br>' +
                '<button id="get_filter">get_filter</button><br>' +
                '<button id="return">return</button><br>' +
                '</div>';
            document.getElementById("add_model_id").onclick = function () {
                var model_id= document.getElementById("model_id").value;
                req.serials[i].models.push(model_id);
                get_models();
            }
            document.getElementById("add_serials").onclick = function () {
                var model_id= document.getElementById("model_id").value;
                req.serials[i].models.push(model_id);
                i++;
                get_serials();
            }
            document.getElementById("get_filter").onclick = function () {
                var model_id= document.getElementById("model_id").value;
                req.serials[i].models.push(model_id);
                get_filter();
            }
        }
        function   get_filter(){
            g_page = mx("#page");
            g_page.innerHTML = '<div id="login_page">' +
                'status<input type="text" id="status"/><br>' +
                'area<input type="text" id="area"/><br>' +
                '<button id="send_to_cpis">send_to_cpis</button><br>' +
                '<button id="return">return</button><br>' +
                '</div>';
            //document.getElementById("add_filter").onclick = function () {
            //    var status= document.getElementById("status").value;
            //    var area= document.getElementById("area").value;
            //    p[0]={n:status,v:status};
            //    p[1]={n:area,v:area};
            //
            //    req.p= p;
            //    get_filter();
            //}
            document.getElementById("send_to_cpis").onclick = function () {
                var status= document.getElementById("status").value;
                var area= document.getElementById("area").value;
                req.p=[];
                req.p[0]={n:"status",v:status};
                req.p[1]={n:"area",v:area};
                console.log(req);
                var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
                req.nid=nid;
                send_msg_from("cpis", "cpis_get_models_req", req, function (type, data) {

                    if (data.result == "failed") {
                        console.log("get_error");
                        console.log(error);

                    }else {
                        console.log("get_success");
                        console.log(data);
                    }
                    if(data.result==""){
                        alert("success");
                    }
                    else{
                        alert(data.result);
                    }

                    var datas=JSON.stringify(data.cpis_serials);
                    g_page.innerHTML='<div id="login_page">'+
                        '<body>'+datas+'</body><br>'+
                        '<button id="return">返回</button><br>'+
                        '</div>';
                    document.getElementById("return").onclick=function() {
                        set_model();
                    }
                });
            }
        }
        document.getElementById("return_home").onclick = function (){
            cpis_test();
        }



    }
    //---------------------------------
    function  backup_data(){
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            'file_name<input type="text" id="file_name"/><br>' +
            '<button id="back_up">备份</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';
        document.getElementById("return_home").onclick=function() {
            cpis_test();
        }
        document.getElementById("back_up").onclick=function() {
            var file_name=document.getElementById("file_name").value;
            var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
            var req={};
            req.nid=nid;
            req.file_name=file_name;
            console.log(req);
            ms.send_msg("cpis", "cpis_set_data_backup_req", req, function (type, data) {

                if (data.result != "") {
                    console.log("get_error");
                    console.log(error);
                } else {
                    console.log("success");
                    console.log(data);
                }
                if(data.result==""){
                    alert("success");
                }
                else{
                    alert(data.result);
                }

                g_page.innerHTML = '<div id="login_page">' +
                    '<button id="return">返回</button><br>' +
                    '</div>';
                document.getElementById("return").onclick = function () {
                    cpis_test();
                }
            });


        }
    }
    function recovery_data(){
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            'file_name<input type="text" id="file_name"/><br>' +
            '<button id="recovery_up">还原</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';
        document.getElementById("return_home").onclick=function() {
            cpis_test();
        }
        document.getElementById("recovery_up").onclick=function() {
            var file_name=document.getElementById("file_name").value;
            var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
            var req={};
            req.nid=nid;
            req.file_name=file_name;
            console.log(req);
            ms.send_msg("cpis", "cpis_set_data_recovery_req", req, function (type, data) {

                if (data.result != "") {
                    console.log("get_error");
                    console.log(error);
                } else {
                    console.log("success");
                    console.log(data);
                }
                if(data.result==""){
                    alert("success");
                }
                else{
                    alert(data.result);
                }

                g_page.innerHTML = '<div id="login_page">' +
                    '<button id="return">返回</button><br>' +
                    '</div>';
                document.getElementById("return").onclick = function () {
                    cpis_test();
                }
            });


        }
    }
    function sort_list(){
        var req={};
        req.serials=[];
        var i=0;
        var j=0;
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            'serial<input type="text" id="serial_id"/><br/>'+
            '<button id="add_serial_id">添加</button><br>'+
            '<button id="send_data">发送</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';
        document.getElementById("return_home").onclick=function() {
            cpis_test();
        }
        document.getElementById("send_data").onclick = function () {
            var id= document.getElementById("serial_id").value;
            req.serials.push(id);
            send_data_to_cpis();
        }
        document.getElementById("add_serial_id").onclick = function () {
            var id= document.getElementById("serial_id").value;
            req.serials.push(id);
            add_serial_id();
        }
        function  add_serial_id(){
            g_page = mx("#page");
            g_page.innerHTML='<div id="login_page">'+
                'serial<input type="text" id="serial_id"/><br/>'+
                '<button id="add_id">添加</button><br>'+
                '<button id="send">发送</button><br>'+
                '<button id="return_home">返回</button><br>'+
                '</div>';
            document.getElementById("add_id").onclick = function () {
                var id= document.getElementById("serial_id").value;
                req.serials.push(id);
                add_serial_id();
            }
            document.getElementById("send").onclick = function () {
                var id= document.getElementById("serial_id").value;
                req.serials.push(id);
                send_data_to_cpis();
            }
        }

        function send_data_to_cpis(){
            var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
            req.nid=nid;
            console.log(req);
            window.send_msg("cpis", "cpis_sort_list_req", req, function (type, data) {

                if (data.result == "failed") {
                    console.log("get_error");
                    console.log(error);

                } else {
                    console.log("success");
                    console.log(data);
                }
                if(data.result==""){
                    alert("success");
                }
                else{
                    alert(data.result);
                }

                g_page.innerHTML = '<div id="login_page">' +
                    '<button id="return">返回</button><br>' +
                    '</div>';
                document.getElementById("return").onclick = function () {
                    cpis_test();
                }
            });
        }
    }

    //--------------------------------

    segment={};
    function creat_tree(){
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            'flag   <select  id = "mySelect">'+
            '<option  value=0>    0    </option>   '+
            '<option   value=1>    1    </option>  '+
            '</select><br/>'+
            '<button id="select_flag">确定</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';


        // console.log(flag);
        document.getElementById("select_flag").onclick=function() {
            var segment_ids=[];
            var i= 0;
            var flag = parseInt(document.getElementById("mySelect").value);
            console.log(flag);
            if (flag == 1) {
                g_page.innerHTML = '<div id="login_page">' +
                    'flag <button>1</button><br/>' +
                    'parent<input type="text" id="parent_get"/><br/>' +
                    'title<input type="text" id="title_get"/><br/>' +
                    'content<input type="text" id="content_get"/><button id="segment_id_save">存入</button><button id="segment_id_clear">清空</button><br>'+
                    '<button id="creat_tree1">完成</button><br>' +
                    '<button id="return">返回</button><br>' +
                    '</div>';

                document.getElementById("segment_id_save").onclick = function () {
                    segment_ids[i++] = document.getElementById("content_get").value;
                    console.log(segment_ids);
                    this.value = "";
                };

                document.getElementById("segment_id_clear").onclick = function () {
                    segment_ids.splice(0, segment_ids.length);
                    i = 0;
                };
            } else if (flag == 0) {
                g_page.innerHTML = '<div id="login_page">' +
                    'flag <button>0</button><br/>' +
                    'parent<input type="text" id="parent_get"/><br/>' +
                    'title<input type="text" id="title_get"/><br/>' +
                        //'content<input type="text" id="content_get"/><button id="segment_id_save">存入</button><button id="segment_id_clear">清空</button><br>'+
                    '<button id="creat_tree1">完成</button><br>' +
                    '<button id="return">返回</button><br>' +
                    '</div>';
            }

            document.getElementById("return").onclick = function () {
                creat_tree();
                return;
            };



            document.getElementById("creat_tree1").onclick = function () {
                var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                // var flag = parseInt(document.getElementById("mySelect").value);
                var title = document.getElementById("title_get").value;
                var parent = document.getElementById("parent_get").value;

                var req = {nid: nid, flag: flag, parent: parent, title: title, content: segment_ids};
                console.log(req);
                ms.send_msg("cbms", "cbms_creat_req", req, function (type, data) {
                    if (data.result == "error") {
                        console.log("cbms_creat_req error");
                        console.log(error);
                    } else if (data.result == "") {
                        console.log("success");
                    } else {
                        console.log("Undefined");
                    }
                    alert(data.result);
                    g_page.innerHTML = '<div id="login_page">' +
                        '<button id="return">返回</button><br>' +
                        '</div>';
                    document.getElementById("return").onclick = function () {
                        creat_tree();
                    }
                });
            };
        };
        document.getElementById("return_home").onclick=function() {
            cbms_test();
        }
    }

    function set_tree(){
        g_page = mx("#page");
        g_page.innerHTML ='<div id="login_page">'+
            'flag   <select  id = "mySelect">'+
            '<option  value=0>    0    </option>   '+
            '<option   value=1>    1    </option>  '+
            '</select><br/>'+
            'parent<input type="text" id="parent_get"/><br/>' +
            'id<input type="text" id="id_get"/><br/>' +
            'title<input type="text" id="title_get"/><br/>' +
            'content<input type="text" id="content_get"/><button id="segment_id_save">存入</button><button id="segment_id_clear">清空</button><br>' +
            '<button id="creat_tree">完成</button><br>' +
            '<button id="return_home">返回</button><br>' +
            '</div>';

        var segment_ids = [];
        var i = 0;
        document.getElementById("segment_id_save").onclick = function () {
            segment_ids[i++] = document.getElementById("content_get").value;
            console.log(segment_ids);
            this.value = "";
        };
        document.getElementById("segment_id_clear").onclick = function () {
            segment_ids.splice(0, segment_ids.length);
            i = 0;
        };

        document.getElementById("creat_tree").onclick = function () {
            var flag = parseInt(document.getElementById("mySelect").value);
            var id  = document.getElementById("id_get").value;
            var parent = document.getElementById("parent_get").value;
            var nid =create_nid( 2, login_data.lid, 5,login_data.share_key );
            var title = document.getElementById("title_get").value;
            var req = {nid:nid,flag: flag, parent: parent, id:id , title: title, content: segment_ids};

            console.log(req);
            ms.send_msg("cbms", "cbms_set_req", req, function (type, data) {
                if (data.result == "error") {
                    console.log("cbms_creat_req error");
                    console.log(error);
                } else if (data.result == "") {
                    console.log("success");
                } else {
                    console.log("Undefined");
                }
                alert(data.result);
                g_page.innerHTML = '<div id="login_page">' +
                    '<button id="return">返回</button><br>' +
                    '</div>';
                document.getElementById("return").onclick = function () {
                    creat_tree();
                }
            });
        };
        document.getElementById("return_home").onclick = function () {
            cbms_test();
        }
    }

    function get_tree_req(){
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            'dir<input type="text" id="dir_name"/><br/>'+
            'language<input type="text" id="language_name"/><br/>'+
            '<button id="get_tree_req">完成</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';

        document.getElementById("get_tree_req").onclick=function(){
            var dir_name = document.getElementById("dir_name").value;
            var language = document.getElementById("language_name").value;
            var nid =create_nid( 2, login_data.lid, 5,login_data.share_key );
            var req = {nid:nid,dir:dir_name,language:language};
            console.log(req);
            ms.send_msg('cbms', 'cbms_get_tree_req', req, function (type, data) {
                if (data.result == "error") {
                    console.log("cbms_get_tree_req error");
                    console.log(error);
                } else if (data.result == "") {
                    console.log("success");
                } else {
                    console.log("Undefined");
                }
                alert(data.result);
                g_page.innerHTML='<div id="login_page">'+
                    '<button id="return">返回</button><br>'+
                    '</div>';
                document.getElementById("return").onclick=function() {
                    get_tree_req();
                }
            });
        };
        document.getElementById("return_home").onclick=function() {
            cbms_test();
        }
    }


    function del_tree_req(){
        g_page = mx("#page");
        g_page.innerHTML = '<div id="login_page">' +
            'flag   <select  id = "mySelect">'+
            '<option  value=0>    0    </option>   '+
            '<option   value=1>    1    </option>  '+
            '</select><br/>'+
            'id<input type="text" id="id_get"/><br/>' +
            '<button id="del_tree_req">完成</button><br>' +
            '<button id="return_home">返回</button><br>' +
            '</div>';
        document.getElementById("del_tree_req").onclick = function () {
            var flag = parseInt(document.getElementById("mySelect").value);
            var id  = document.getElementById("id_get").value;
            var nid =create_nid( 2, login_data.lid, 5,login_data.share_key );
            var req = {nid:nid,flag: flag,id:id};
            console.log(req);
            ms.send_msg("cbms", "cbms_del_req", req, function (type, data) {
                if (data.result == "error") {
                    console.log("cbms_del_req error");
                    console.log(error);
                } else if (data.result == "") {
                    console.log("success");
                } else {
                    console.log("Undefined");
                }
                alert(data.result);
                g_page.innerHTML = '<div id="login_page">' +
                    '<button id="return">返回</button><br>' +
                    '</div>';
                document.getElementById("return").onclick = function () {
                    del_tree_req();
                }
            });
        };
        document.getElementById("return_home").onclick = function () {
            cbms_test();
        }
    }

    function backup_req(){
        g_page = mx("#page");
        g_page.innerHTML = '<div id="login_page">' +
            'backup_file_name<input type="text" id="id_get"/><br/>' +
            '<button id="del_tree_req">完成</button><br>' +
            '<button id="return_home">返回</button><br>' +
            '</div>';

        document.getElementById("del_tree_req").onclick = function () {
            // var flag = parseInt(document.getElementById("mySelect").value);
            var file  = document.getElementById("id_get").value;
            var nid =create_nid( 2, login_data.lid, 5,login_data.share_key );
            var req = {nid:nid,file_name:file};
            //  var req={};

            console.log(req);
            ms.send_msg("0x50300000", "cbms_set_data_backup_req", req, function (type, data) {
                if (data.result == "error") {
                    console.log("cbms_set_data_backup_req error");
                    console.log(error);
                } else if (data.result == ""){
                    console.log("success");
                } else {
                    console.log("Undefined");
                }
                alert(data.result);
                g_page.innerHTML = '<div id="login_page">' +
                    '<button id="return">返回</button><br>' +
                    '</div>';
                document.getElementById("return").onclick = function () {
                    backup_req();
                }
            });
        };
        document.getElementById("return_home").onclick = function () {
            cbms_test();
        }
    }

    function recovery_req(){

        try {
            g_page = mx("#page");
            g_page.innerHTML = '<div id="login_page">' +
                'recovery_file_name<input type="text" id="id_get"/><br/>' +
                '<button id="del_tree_req">完成</button><br>' +
                '<button id="return_home">返回</button><br>' +
                '</div>';

            document.getElementById("del_tree_req").onclick = function () {
                // var flag = parseInt(document.getElementById("mySelect").value);
                var file = document.getElementById("id_get").value;
                var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
                var req = {nid: nid, file_name: file};
                //  var req={};
                console.log(req);
                ms.send_msg("0x50300000", "cbms_set_data_recovery_req", req, function (type, data) {
                    try {
                        if (data.result == "error") {
                            console.log("cbms_set_data_recovery_req error");
                            console.log(error);
                        } else if (data.result == "") {
                            console.log("success");
                        } else {
                            console.log("Undefined");
                        }
                        alert(data.result);
                        g_page.innerHTML = '<div id="login_page">' +
                            '<button id="return">返回</button><br>' +
                            '</div>';
                        document.getElementById("return").onclick = function () {
                            backup_req();
                        }
                    }catch(e){
                        console.log(e.message);
                    }
                });
            };
            document.getElementById("return_home").onclick = function () {
                cbms_test();
            }
        }catch(e){
            console.log(e.message);
        }
    }
    //----------------------------------
    function cpis_test(){
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            '<button id="get_list">获得列表</button><br>'+
            '<button id="get_serial">获得系列</button><br>'+
            '<button id="get_model">获取型号</button><br>'+
            '<button id="set_model1">快速设置型号</button><br>'+
            '<button id="set_model">设置型号</button><br>'+
            '<button id="set_serial">设置系列</button><br>'+
            '<button id="sort_list">验证排序</button><br>'+
            '<button id="backup_data">数据备份</button><br>'+
            '<button id="recovery_data">数据还原</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';

        document.getElementById("get_list").onclick=function(){
            get_serial_list();
        };
        document.getElementById("get_serial").onclick=function(){
            get_serials_req();
        };
        document.getElementById("get_model").onclick=function(){
            get_model();
        };
        document.getElementById("set_serial").onclick=function(){
            set_serial();
        };
        document.getElementById("set_model1").onclick=function(){
            set_model1();
        };
        document.getElementById("set_model").onclick=function(){
            set_model();
        };
        document.getElementById("sort_list").onclick=function(){
            sort_list();
        };
        document.getElementById("backup_data").onclick=function(){
            backup_data();
        };
        document.getElementById("recovery_data").onclick=function(){
            recovery_data();
        };
        document.getElementById("return_home").onclick=function() {
            fork();
        }
    }

    //------------------------------------------------------------------------------------------------------------------


    function cdms_test(){
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            '<button id="get_pic">取得图片</button><br>'+
            '<button id="set_pic">保存图片</button><br>'+
            '<button id="get_segment">取得segment</button><br>'+
            '<button id="set_segment">保存segment</button><br>'+
            '<button id="set_segment_users">修改users</button><br>'+
            '<button id="cdms_set_segment_users_lot_req">cdms_set_segment_users_lot_req</button><br>'+
            '<button id="data_base">data_base</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';

        document.getElementById("get_pic").onclick=function(){
            get_pic();
        };
        document.getElementById("set_pic").onclick=function(){
            set_pic();
        };
        document.getElementById("get_segment").onclick=function(){
            get_segment();
        };
        document.getElementById("set_segment").onclick=function(){
            set_segment();
        };
        document.getElementById("set_segment_users").onclick=function(){
            set_segment_users();
        };
        document.getElementById("cdms_set_segment_users_lot_req").onclick=function(){
            cdms_set_segment_users_lot_req();
        };
        document.getElementById("data_base").onclick=function(){
            data_base();
        };
        document.getElementById("return_home").onclick=function() {
            fork();
        }

    }

//------------------------------ctck------------------------------------------------------------------------------------
    function ctck_get_user_ticket_req()
    {
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            'user<input type="lenstr" id="user"/><br/>'+
            'start<input type="uint32" id="start"/><br/>'+
            'counts<input type="uint32" id="counts"/><br/>'+
            'flag<input type="uint32" id="flag"/><br/>'+
            '<button id="get_value">获取</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';
        document.getElementById("get_value").onclick=function(){
            var user = document.getElementById("user").value;
            var start = document.getElementById("start").value;
            var counts = document.getElementById("counts").value;
            var flag = document.getElementById("flag").value;
            var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
            var req = {nid:nid,user:user,start:start,counts:counts,flag:flag};
            window.send_msg(0x50400000, 'ctck_get_user_ticket_req', req, function (type, data) {

                if (data.result == "failed") {
                    console.log("get_error");
                    console.log(error);

                }else {
                    console.log("get_success");
                    console.log(data);
                }
                alert(data.result);

                g_page.innerHTML='<div id="login_page">'+
                    '<button id="return">返回</button><br>'+
                    '</div>';
                document.getElementById("return").onclick=function() {
                    ctck_get_user_ticket_req();
                }
            });
        };
        document.getElementById("return_home").onclick=function() {
            ctck_test();
        }
    }

    function ctck_get_new_ticket_req()
    {
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

                if (data.result == "failed") {
                    console.log("get_error");
                    console.log(error);

                }else {
                    console.log("get_success");
                    console.log(data);
                    console.log(data.ctck_tickets);
                }
                alert(data.result);

                g_page.innerHTML='<div id="login_page">'+
                    '<button id="return">返回</button><br>'+
                    '</div>';
                document.getElementById("return").onclick=function() {
                    ctck_get_new_ticket_req();
                }
            });
        };
        document.getElementById("return_home").onclick=function() {
            ctck_test();
        }
    }

    function ctck_get_ticket_content_req()
    {
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            'id<input type="lenstr" id="id"/><br/>'+
            '<button id="set_value">存入</button>'+
            '<button id="clear_value">清空</button><br>'+
            '<button id="get_value">获取</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';

        var id=[];
        document.getElementById("set_value").onclick=function() {
            var p= document.getElementById("id").value;
            id.push(p);
        };
        document.getElementById("clear_value").onclick=function() {
            id.length=0;
        };
        document.getElementById("get_value").onclick=function(){
            var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
            var req = {nid:nid,id:id};
            console.log(req);
            window.send_msg(0x50400000, 'ctck_get_ticket_content_req', req, function (type, data) {

                if (data.result == "failed") {
                    console.log("get_error");
                    console.log(error);

                }else {
                    console.log("get_success");
                    console.log(data);
                }
                alert(data.result);

                g_page.innerHTML='<div id="login_page">'+
                    '<button id="return">返回</button><br>'+
                    '</div>';
                document.getElementById("return").onclick=function() {
                    ctck_get_ticket_content_req();
                }
            });
        };
        document.getElementById("return_home").onclick=function() {
            ctck_test();
        }
    }

    function ctck_get_pic_req()
    {
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            'pic_id<input type="lenstr" id="pic_id"/><br/>'+
            '<button id="get_value">获取</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';

        document.getElementById("get_value").onclick=function(){
            var pic_id=document.getElementById("pic_id").value;
            var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
            var req = {nid:nid,pic_id:pic_id};
            window.send_msg(0x50400000, 'ctck_get_pic_req', req, function () {

                g_page.innerHTML+='<div id="pic_div">'+
                    'img src="http://192.168.3.120:10080/1346371584/ctck_get_pic_req.js?hfrom_handle=1111…dnid=MNaatu%5fWzUTpvMwAxToY%2ew5BBWMHIKSBAg&dpic_id=ctck%2ectck%2ecdfs%2e1">'+
                    '</div>';
                if (data.result == "failed") {
                    console.log("get_error");
                    console.log(error);

                }else {
                    console.log("get_success");
                    console.log(data);
                }

            });
            g_page.innerHTML+='<div id="pic_div">'+
                'img src="http://192.168.3.120:10080/1346371584/ctck_get_pic_req.js?hfrom_handle=1111…dnid=MNaatu%5fWzUTpvMwAxToY%2ew5BBWMHIKSBAg&dpic_id=ctck%2ectck%2ecdfs%2e1">'+
                '</div>';
        };
        document.getElementById("return_home").onclick=function() {
            ctck_test();
        }
    }

    function ctck_get_user_req()
    {
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            'start<input type="uint32" id="start"/><br/>'+
            'counts<input type="uint32" id="counts"/><br/>'+
            'name<input type="lenstr" id="name"/><br/>'+
            'flag<input type="uint32" id="flag"/><br/>'+
            '<button id="get_value">获取</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';
        document.getElementById("get_value").onclick=function(){
            var start = document.getElementById("start").value;
            var counts = document.getElementById("counts").value;
            var name = document.getElementById("name").value;
            var flag = document.getElementById("flag").value;
            var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
            var req = {nid:nid,start:start,counts:counts,name:name,flag:flag};
            window.send_msg(0x50400000, 'ctck_get_user_req', req, function (type, data) {

                if (data.result == "failed") {
                    console.log("get_error");
                    console.log(error);

                }else {
                    console.log("get_success");
                    console.log(data);
                }
                alert(data.result);

                g_page.innerHTML='<div id="login_page">'+
                    '<button id="return">返回</button><br>'+
                    '</div>';
                document.getElementById("return").onclick=function() {
                    ctck_get_user_req();
                }
            });
        };
        document.getElementById("return_home").onclick=function() {
            ctck_test();
        }
    }

    function ctck_create_ticket_req()
    {
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            'title<input type="lenstr" id="title"/><br/>'+
            'series<input type="lenstr" id="series"/><br/>'+
            'upload_pic<input type="file" name="file" id="file"/><br>'+
            'data<input type="lenstr" id="data"/><br/>'+
            '<button id="get_value">获取</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';

        var upload_pic;
        var content_item={};
        document.getElementById("file").onchange=function() {
            console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
            var file = this.files[0];
         //   console.log(file);
            var fr = new FileReader();
            fr.onload = function() {
             //   console.log(this.result);
                upload_pic=this.result.replace('data:image/jpeg;base64','data:application/octet-stream;base64');
            };
            fr.readAsDataURL(file);
        };
        document.getElementById("get_value").onclick=function(){
            content_item.data = document.getElementById("data").value;
            var title=document.getElementById("title").value;
            var series=document.getElementById("series").value;
            var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
            var req = {nid:nid,title:title,series:series,upload_pic:upload_pic,content_item:content_item};
            console.log(req);
            window.send_msg_from(0x50400000, 'ctck_create_ticket_req', req, function (type, data) {

                if (data.result == "failed") {
                    console.log("get_error");
                    console.log(error);

                }else {
                    console.log("get_success");
                    console.log(data);
                }
                alert(data.result);

                g_page.innerHTML='<div id="login_page">'+
                    '<button id="return">返回</button><br>'+
                    '</div>';
                document.getElementById("return").onclick=function() {
                    ctck_create_ticket_req();
                }
            });
        };
        document.getElementById("return_home").onclick=function() {
            ctck_test();
        }
    }


    function ctck_pick_up_req()
    {
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            'ticket_key<input type="lenstr" id="ticket_key"/><br/>'+
            '<button id="get_value">获取</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';
        document.getElementById("get_value").onclick=function(){
            var ticket_key = document.getElementById("ticket_key").value;
            var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
            var req = {nid:nid,ticket_key:ticket_key};
            window.send_msg(0x50400000, 'ctck_pick_up_req', req, function (type, data) {

                if (data.result == "failed") {
                    console.log("get_error");
                    console.log(error);

                }else {
                    console.log("get_success");
                    console.log(data);
                }
                alert(data.result);

                g_page.innerHTML='<div id="login_page">'+
                    '<button id="return">返回</button><br>'+
                    '</div>';
                document.getElementById("return").onclick=function() {
                    ctck_pick_up_req();
                }
            });
        };
        document.getElementById("return_home").onclick=function() {
            ctck_test();
        }
    }

    function ctck_set_ticket_req()
    {
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            'ticket_id<input type="lenstr" id="ticket_id"/><br/>'+
            'status<input type="uint32" id="status"/><br/>'+
            'replier<input type="lenstr" id="replier"/><br/>'+
            '<button id="get_value">获取</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';

        document.getElementById("get_value").onclick=function(){
            var status = document.getElementById("status").value;
            var ticket_id = document.getElementById("ticket_id").value;
            var replier = document.getElementById("replier").value;
            var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
            var req = {nid:nid,ticket_id:ticket_id,status:status,replier:replier};
            window.send_msg(0x50400000, 'ctck_set_ticket_req', req, function (type, data) {

                if (data.result == "failed") {
                    console.log("get_error");
                    console.log(error);

                }else {
                    console.log("get_success");
                    console.log(data);
                }
                alert(data.result);

                g_page.innerHTML='<div id="login_page">'+
                    '<button id="return">返回</button><br>'+
                    '</div>';
                document.getElementById("return").onclick=function() {
                    ctck_set_ticket_req();
                }
            });
        };
        document.getElementById("return_home").onclick=function() {
            ctck_test();
        }
    }

    function ctck_reply_ticket_req()
    {
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            'ticket_id<input type="lenstr" id="ticket_id"/><br/>'+
            'upload_pic<input type="file" name="file" id="file"/><br>'+
            'data<input type="lenstr" id="data"/><br/>'+
            '<button id="get_value">获取</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';
        var upload_pic;
        var content_item={};
        document.getElementById("file").onchange=function() {
            console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
            var file = this.files[0];
         //   console.log(file);
            var fr = new FileReader();
            fr.onload = function() {
           //     console.log(this.result);
                upload_pic=this.result.replace('data:image/jpeg;base64','data:application/octet-stream;base64');
            };
            fr.readAsDataURL(file);
        };
        document.getElementById("get_value").onclick=function(){
            content_item.data = document.getElementById("data").value;
            var ticket_id=document.getElementById("ticket_id").value;
            var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
            var req = {nid:nid,ticket_id:ticket_id,upload_pic:upload_pic,content_item:content_item};
            console.log(req);
            window.send_msg_from(0x50400000, 'ctck_reply_ticket_req', req, function (type, data) {

                if (data.result == "failed") {
                    console.log("get_error");
                    console.log(error);

                }else {
                    console.log("get_success");
                    console.log(data);
                }
                alert(data.result);

                g_page.innerHTML='<div id="login_page">'+
                    '<button id="return">返回</button><br>'+
                    '</div>';
                document.getElementById("return").onclick=function() {
                    ctck_reply_ticket_req();
                }
            });
        };
        document.getElementById("return_home").onclick=function() {
            ctck_test();
        }
    }

    function ctck_del_content_item_req()
    {
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            'ticket_id<input type="lenstr" id="ticket_id"/><br/>'+
            'item_id<input type="lenstr" id="item_id"/><br/>'+
            '<button id="get_value">获取</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';

        document.getElementById("get_value").onclick=function(){
            var ticket_id=document.getElementById("ticket_id").value;
            var item_id=document.getElementById("item_id").value;
            var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
            var req = {nid:nid,ticket_id:ticket_id,item_id:item_id};
            window.send_msg(0x50400000, 'ctck_del_content_item_req', req, function (type, data) {

                if (data.result == "failed") {
                    console.log("get_error");
                    console.log(error);

                }else {
                    console.log("get_success");
                    console.log(data);
                }
                alert(data.result);

                g_page.innerHTML='<div id="login_page">'+
                    '<button id="return">返回</button><br>'+
                    '</div>';
                document.getElementById("return").onclick=function() {
                    ctck_del_content_item_req();
                }
            });
        };
        document.getElementById("return_home").onclick=function() {
            ctck_test();
        }

    }

    function ctck_get_auth_req()
    {
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            'user<input type="lenstr" id="user"/><br/>'+
            '<button id="get_value">获取</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';

        document.getElementById("get_value").onclick=function(){
            var user = document.getElementById("user").value;
            var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
            var req = {nid:nid,user:user};
            window.send_msg(0x50400000, 'ctck_get_auth_req', req, function (type, data) {

                if (data.result == "failed") {
                    console.log("get_error");
                    console.log(error);

                }else {
                    console.log("get_success");
                    console.log(data);
                }
                alert(data.result);

                g_page.innerHTML='<div id="login_page">'+
                    '<button id="return">返回</button><br>'+
                    '</div>';
                document.getElementById("return").onclick=function() {
                    ctck_get_auth_req();
                }
            });
        };
        document.getElementById("return_home").onclick=function() {
            ctck_test();
        }
    }

    function ctck_set_auth_req()
    {
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            'flg<input type="uint32" id="flg"/><br/>'+
            'user<input type="lenstr" id="user"/><br/>'+
            'auth<input type="lenstr" id="auth"/><br/>'+
            'auth_mod<input type="uint32" id="auth_mod"/><br/>'+
            '<button id="set_auth_value">存入auth</button>'+
            '<button id="clear_auth_value">清空auth</button><br>'+
            '<button id="set_auth_mod_value">存入auth_mod</button>'+
            '<button id="clear_auth_mod_value">清空auth_mod</button><br>'+
            '<button id="get_value">获取</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';
        var auth=[];
        var auth_mod=[];
        document.getElementById("set_auth_value").onclick=function() {
            var p= document.getElementById("auth").value;
            auth.push(p);
        };
        document.getElementById("clear_auth_value").onclick=function() {
            auth.length=0;
        };
        document.getElementById("set_auth_mod_value").onclick=function() {
            var p= document.getElementById("auth_mod").value;
            auth_mod.push(p);
        };
        document.getElementById("clear_auth_mod_value").onclick=function() {
            auth_mod.length=0;
        };
        document.getElementById("get_value").onclick=function(){
            var user = document.getElementById("user").value;
            var flg = document.getElementById("flg").value;
            var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
            var req = {nid:nid,user:user,flg:flg,auth:auth,auth_mod:auth_mod};
            console.log(req)
            window.send_msg(0x50400000, 'ctck_set_auth_req', req, function (type, data) {

                if (data.result == "failed") {
                    console.log("get_error");
                    console.log(error);

                }else {
                    console.log("get_success");
                    console.log(data);
                }
                alert(data.result);

                g_page.innerHTML='<div id="login_page">'+
                    '<button id="return">返回</button><br>'+
                    '</div>';
                document.getElementById("return").onclick=function() {
                    ctck_set_auth_req();
                }
            });
        };
        document.getElementById("return_home").onclick=function() {
            ctck_test();
        }

    }

    function ctck_test_cdfs_req()
    {
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            'data<input type="uint32" id="data"/><br/>'+
            'ticket_handle<input type="lenstr" id="ticket_handle"/><br/>'+
            '<button id="set_auth_value">存入auth</button>'+
            '<button id="clear_auth_value">清空auth</button><br>'+
            '<button id="get_value">获取</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';
        var ticket_handle=[];
        document.getElementById("set_auth_value").onclick=function() {
            var p= document.getElementById("ticket_handle").value;
            ticket_handle.push(p);
        };
        document.getElementById("clear_auth_value").onclick=function() {
            ticket_handle.length=0;
        };
        document.getElementById("get_value").onclick=function(){
            var data = document.getElementById("data").value;
            var req = {data:data,ticket_handle:ticket_handle};
            console.log(req);
            window.send_msg(0x50400000, 'ctck_test_cdfs_req', req, function (type, data) {

                if (data.result == "failed") {
                    console.log("get_error");
                    console.log(error);

                }else {
                    console.log("get_success");
                    console.log(data);
                }
                alert(data.result);

                g_page.innerHTML='<div id="login_page">'+
                    '<button id="return">返回</button><br>'+
                    '</div>';
                document.getElementById("return").onclick=function() {
                    ctck_test_cdfs_req();
                }
            });
        };
        document.getElementById("return_home").onclick=function() {
            ctck_test();
        }

    }
    function csfs_set_num_req(){
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            'flag<input type="uint32" id="flag"/><br/>'+
            'keys1<input type="lenstr" id="keys1"/><br/>'+
            'keys2<input type="lenstr" id="keys2"/><br/>'+
            'value1<input type="int32" id="value1"/><br/>'+
            'value2<input type="int32" id="value2"/><br/>'+
            'token<input type="lenstr" id="token"/><br/>'+
            '<button id="set_num">发送</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';

        document.getElementById("set_num").onclick=function(){
            var flag = document.getElementById("flag").value;
            var keys1 = document.getElementById("keys1").value;
            var keys2 = document.getElementById("keys2").value;
            var value1 = document.getElementById("value1").value;
            var value2 = document.getElementById("value2").value;
            var token = document.getElementById("token").value;
            var key=[];
            var value=[];
            if(keys2==undefined||keys2==""){
                key=[keys1];
                value=[value1];
            }else{
                key=[keys1,keys2];
                value=[value1,value2];
            }
            var req = {flag:flag,keys:key,value:value,token:token};
            console.log(req);
            window.send_msg(0x50000000, 'csfs_set_num_req', req, function (type, data) {

                if (data.ret == "failed") {
                    console.log("get_error");
                    console.log(error);

                }else {
                    console.log("get_success");
                    console.log(data);
                }
                alert(data.ret);

                g_page.innerHTML='<div id="login_page">'+
                    '<button id="return">返回</button><br>'+
                    '</div>';
                document.getElementById("return").onclick=function() {
                    csfs_set_num_req();
                }
            });
        };
        document.getElementById("return_home").onclick=function() {
            ctck_test();
        }
    }
    function ctck_get_series(){
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            'lang<input type="lenstr" id="lang"/><br/>'+
            '<button id="get_series">发送</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';

        document.getElementById("get_series").onclick=function(){
            var lang = document.getElementById("lang").value;

            var req = {lang:lang};
            console.log(req);
            window.send_msg(0x50400000, 'ctck_get_series_req', req, function (type, data) {

                if (data.ret == "failed") {
                    console.log("get_error");
                    console.log(error);

                }else {
                    console.log("get_success");
                    console.log(data);
                }
                alert(data.ret);

                g_page.innerHTML='<div id="login_page">'+
                    '<button id="return">返回</button><br>'+
                    '</div>';
                document.getElementById("return").onclick=function() {
                    ctck_get_series();
                }
            });
        };
        document.getElementById("return_home").onclick=function() {
            ctck_test();
        }
    }
    function ctck_test(){
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            '<button id="ctck_get_user_ticket_req">进行ctck_get_user_ticket_req</button><br>'+
            '<button id="ctck_get_new_ticket_req">进行ctck_get_new_ticket_req</button><br>'+
            '<button id="ctck_get_ticket_content_req">进行ctck_get_ticket_content_req</button><br>'+
            '<button id="ctck_get_pic_req">进行ctck_get_pic_req</button><br>'+
            '<button id="ctck_get_user_req">进行ctck_get_user_req</button><br>'+
            '<button id="ctck_create_ticket_req">进行ctck_create_ticket_req</button><br>'+
            '<button id="ctck_pick_up_req">进行ctck_pick_up_req</button><br>'+
            '<button id="ctck_set_ticket_req">进行ctck_set_ticket_req</button><br>'+
            '<button id="ctck_reply_ticket_req">进行ctck_reply_ticket_req</button><br>'+
            '<button id="ctck_del_content_item_req">进行ctck_del_content_item_req</button><br>'+
            '<button id="ctck_get_auth_req">进行ctck_get_auth_req</button><br>'+
            '<button id="ctck_set_auth_req">进行ctck_set_auth_req</button><br>'+
            '<button id="ctck_test_cdfs_req">进行ctck_test_cdfs_req</button><br>'+
            '<button id="csfs_set_num_req">进行csfs_set_num_req</button><br>'+
            '<button id="ctck_get_series">进行ctck_get_series_req</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';

        document.getElementById("ctck_get_user_ticket_req").onclick=function(){
            ctck_get_user_ticket_req();
        };
        document.getElementById("ctck_get_new_ticket_req").onclick=function(){
            ctck_get_new_ticket_req();
        };
        document.getElementById("ctck_get_ticket_content_req").onclick=function(){
            ctck_get_ticket_content_req();
        };
        document.getElementById("ctck_get_pic_req").onclick=function(){
            ctck_get_pic_req();
        };
        document.getElementById("ctck_get_user_req").onclick=function(){
            ctck_get_user_req();
        };
        document.getElementById("ctck_create_ticket_req").onclick=function(){
            ctck_create_ticket_req();
        };
        document.getElementById("ctck_pick_up_req").onclick=function(){
            ctck_pick_up_req();
        };
        document.getElementById("ctck_set_ticket_req").onclick=function(){
            ctck_set_ticket_req();
        };
        document.getElementById("ctck_reply_ticket_req").onclick=function(){
            ctck_reply_ticket_req();
        };
        document.getElementById("ctck_del_content_item_req").onclick=function(){
            ctck_del_content_item_req();
        };
        document.getElementById("ctck_get_auth_req").onclick=function(){
            ctck_get_auth_req();
        };
        document.getElementById("ctck_set_auth_req").onclick=function(){
            ctck_set_auth_req();
        };
        document.getElementById("ctck_test_cdfs_req").onclick=function(){
            ctck_test_cdfs_req();
        };
        document.getElementById("csfs_set_num_req").onclick=function(){
            csfs_set_num_req();
        };
        document.getElementById("ctck_get_series").onclick=function(){
            ctck_get_series();
        };
        document.getElementById("return_home").onclick=function() {
            fork();
        }
    }
    function set_stock(){
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            'model_key<input type="lenstr" id="model_key"/><br/>'+
            '<button id="set_stock">发送</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';

        document.getElementById("set_stock").onclick=function(){
            var model_key = document.getElementById("model_key").value;
            var param1=["红色","有图案"];
            var param2=["绿色","无图案"];
            var stocks=[];
            stocks[0]={};
            stocks[1]={};
            stocks[0]={param:param1,real_num:200,mall_num:200};
            stocks[1]={param:param2,real_num:200,mall_num:200};
            var stock_total={area:"en",stocks:stocks};
            var req={};
            var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
            req.nid = nid;
            req.model_key=model_key;
            req.stock_total=stock_total;
            console.log(req);
            window.send_msg(0x50500000, 'cmall_set_stock_req', req, function (type, data) {

                if (data.result == "failed") {
                    console.log("get_error");
                    console.log(error);

                }else {
                    console.log("get_success");
                    console.log(data);
                }
                alert(data.result);

                g_page.innerHTML='<div id="login_page">'+
                    '<button id="return">返回</button><br>'+
                    '</div>';
                document.getElementById("return").onclick=function() {
                    set_price();
                }
            });
        };
        document.getElementById("return_home").onclick=function() {
            cmall_test();
        }
    }
    function set_price(){
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            'model_key<input type="lenstr" id="model_key"/><br/>'+
            'area1<input type="lenstr" id="area1"/><br/>'+
            'uint1<input type="lenstr" id="uint1"/><br/>'+
            'amount1<input type="int32" id="amount1"/><br/>'+
            'area2<input type="lenstr" id="area2"/><br/>'+
            'uint2<input type="lenstr" id="uint2"/><br/>'+
            'amount2<input type="int32" id="amount2"/><br/>'+
            '<button id="set_price">发送</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';

        document.getElementById("set_price").onclick=function(){
            var model_key = document.getElementById("model_key").value;
            var area1 = document.getElementById("area1").value;
            var uint1 = document.getElementById("uint1").value;
            var amount1 = document.getElementById("amount1").value;
            var area2 = document.getElementById("area2").value;
            var uint2 = document.getElementById("uint2").value;
            var amount2 = document.getElementById("amount2").value;
            var price=[];
            if(area2==undefined||area2==""){
                price[0]={area:area1,unit:uint1,amount:amount1};
            }else{
                price[0]={area:area1,unit:uint1,amount:amount1};
                price[1]={area:area2,unit:uint2,amount:amount2};
            }
            var req={};
            var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
            req.nid = nid;
            req.model_key=model_key;
            req.prices=[];
            req.prices=price;
            console.log(req);
            window.send_msg(0x50500000, 'cmall_set_price_req', req, function (type, data) {

                if (data.result == "failed") {
                    console.log("get_error");
                    console.log(error);

                }else {
                    console.log("get_success");
                    console.log(data);
                }
                alert(data.result);

                g_page.innerHTML='<div id="login_page">'+
                    '<button id="return">返回</button><br>'+
                    '</div>';
                document.getElementById("return").onclick=function() {
                    set_price();
                }
            });
        };
        document.getElementById("return_home").onclick=function() {
            cmall_test();
        }
    }
    function create_orders1() {
        g_page = mx("#page");
        g_page.innerHTML = '<div id="login_page">' +
            '<button id="create_order1">快速创建</button><br>' +
            '<button id="return">返回</button><br>' +
            '</div>';

        document.getElementById("create_order1").onclick = function () {
            var req = {};
            var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
            req.nid = nid;
            var product = [];
            product[0] = {};
            req.product = [];
            req.product = product;
            req.invoice = {};
            req.addres = {};
            var param = ["红色", "有图案"];
            var param1 = ["绿色", "无图案"];
            product[0] = {
                id: 0,
                serial_id: "cpis.cpis.serial.0",
                modle_id: "test01",
                stock_id: "",
                param: param,
                number: 2
            };
            product[1] = {
                id: 1,
                serial_id: "cpis.cpis.serial.1",
                modle_id: "test02",
                stock_id: "",
                param: param1,
                number: 1
            };
            req.invoice = {
                flag: 0,
                name: "平平",
                phone: "18888888888",
                email: "ddasdsads@163.com",
                content: "dsadfssfsafgadfsgadfsgsagdsagdsag"
            };
            req.addres = {
                flag: 1,
                id: 0,
                name: "平平",
                country: "中国",
                province: "广东省",
                address: "深圳西丽",
                postcode: "543210",
                phone: "18888888888",
                landline: "88888888"
            };
            console.log(req);
            send_msg_from("0x50500000", "cmall_create_order_req", req, function (type, data) {

                if (data.result == "failed") {
                    console.log("get_error");
                    console.log(error);

                } else {
                    console.log("get_success");
                    console.log(data);
                }
                alert(data.result);

                g_page.innerHTML = '<div id="login_page">' +
                    '<button id="return">返回</button><br>' +
                    '</div>';
                document.getElementById("return").onclick = function () {
                    cmall_test();
                }
            });

        };
        document.getElementById("return").onclick = function () {
            fork();
        };
    }
    function up_logistics(){
      var req={};
      req.orders_id=[];
      req.logistics_id=[];
      req.logistics=[];
      var i=0;
      up_logisti();
      function up_logisti(){
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            'orders_id<input type="uint32" id="orders_id"/><br/>'+
            'logistics_id<input type="lenstr" id="logistics_id"/><br/>'+
            'logistics<input type="lenstr" id="logistics"/><br/>'+
            '<button id="up_logis">发送</button><br>'+
            '<button id="add">添加</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';
        document.getElementById("add").onclick=function(){
            var orders_id = 1000000000+Number(document.getElementById("orders_id").value);
                var logistics_id= document.getElementById("logistics_id").value;
                var logistics = document.getElementById("logistics").value;
              req.orders_id[i]=orders_id;
              req.logistics_id[i]=logistics_id;
              req.logistics[i]=logistics;
              i++;
              up_logisti();
            };

            document.getElementById("up_logis").onclick=function(){
                    var orders_id = 1000000000+Number(document.getElementById("orders_id").value);
                    var logistics_id= document.getElementById("logistics_id").value;
                    var logistics = document.getElementById("logistics").value;
                  req.orders_id[i]=orders_id;
                  req.logistics_id[i]=logistics_id;
                  req.logistics[i]=logistics;
                  send_to_cmall();
                };
          document.getElementById("return_home").onclick=function(){
                      i=0;
                      cmall_test();
                    };


      }


      function send_to_cmall(){
        var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
        req.nid = nid;
        console.log(req);
        window.send_msg(0x50500000, 'cmall_update_logistics_req', req, function (type, data) {

            if (data.result == "failed") {
                console.log("get_error");
                console.log(error);

            }else {
                console.log("get_success");
                console.log(data);
            }
            alert(data.result);

            g_page.innerHTML='<div id="login_page">'+
                '<button id="return">返回</button><br>'+
                '</div>';
            document.getElementById("return").onclick=function() {
            up_logistics();
            }
        });
      }
    }
    function get_order(){
        var req={};
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            'flag<input type="uint32" id="flag"/><br/>'+
            'start<input type="uint32" id="start"/><br/>'+
            'counts<input type="uint32" id="counts"/><br/>'+
            'month<input type="uint32" id="month"/><br/>'+
            '<button id="get_order">发送</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';

        document.getElementById("get_order").onclick=function(){
            var start = document.getElementById("start").value;
            var counts = document.getElementById("counts").value;
            var month = document.getElementById("month").value;
            var flag = document.getElementById("flag").value;
            req.start=start;
            req.counts=counts;
            req.month=month;
            req.flag=flag;
            var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
            req.nid = nid;
            console.log(req);
            window.send_msg(0x50500000, 'cmall_get_order_req', req, function (type, data) {

                if (data.result == "failed") {
                    console.log("get_error");
                    console.log(error);

                }else {
                    console.log("get_success");
                    console.log(data);
                }
                alert(data.result);

                g_page.innerHTML='<div id="login_page">'+
                    '<button id="return">返回</button><br>'+
                    '</div>';
                document.getElementById("return").onclick=function() {
                   cmall_test();
                }
            });
        };


        document.getElementById("return_home").onclick=function(){

            cmall_test();
        };



    }
    function up_paid(){
        var req={};
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            'debug_pass<input type="lenstr" id="debug_pass"/><br/>'+
            'order_id<input type="lenstr" id="order_id"/><br/>'+
            'pay_id<input type="lenstr" id="pay_id"/><br/>'+
            '<button id="up_pay_status">发送</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';

        document.getElementById("up_pay_status").onclick=function(){
            var debug_pass = document.getElementById("debug_pass").value;
            var order_id = document.getElementById("order_id").value;
            var pay_id = document.getElementById("pay_id").value;
            req.debug_pass=debug_pass;
            req.order_id=1000000000+Number(order_id);
            req.pay_id=pay_id;
            var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
            req.nid = nid;
            console.log(req);
            window.send_msg(0x50500000, 'cmall_update_pay_req', req, function (type, data) {

                if (data.result == "failed") {
                    console.log("get_error");
                    console.log(error);

                }else {
                    console.log("get_success");
                    console.log(data);
                }
                alert(data.result);

                g_page.innerHTML='<div id="login_page">'+
                    '<button id="return">返回</button><br>'+
                    '</div>';
                document.getElementById("return").onclick=function() {
                    cmall_test();
                }
            });
        };


        document.getElementById("return_home").onclick=function(){

            cmall_test();
        };

    }
    function check_order(){
        var req={};
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            'start<input type="uint32" id="start"/><br/>'+
            'counts<input type="uint32" id="counts"/><br/>'+
            'user<input type="lenstr" id="user"/><br/>'+
            'status<input type="lenstr" id="status"/><br/>'+
            '<button id="check_order">发送</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';

        document.getElementById("check_order").onclick=function(){
            var start = document.getElementById("start").value;
            var counts = document.getElementById("counts").value;
            var user = document.getElementById("user").value;
            var status = document.getElementById("status").value;
            req.start=start;
            req.counts=counts;
            req.user=user;
            req.status=status;
            var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
            req.nid = nid;
            console.log(req);
            window.send_msg(0x50500000, 'cmall_check_order_req', req, function (type, data) {

                if (data.result == "failed") {
                    console.log("get_error");
                    console.log(error);

                }else {
                    console.log("get_success");
                    console.log(data);
                }
                alert(data.result);

                g_page.innerHTML='<div id="login_page">'+
                    '<button id="return">返回</button><br>'+
                    '</div>';
                document.getElementById("return").onclick=function() {
                    check_order();
                }
            });
        };


        document.getElementById("return_home").onclick=function(){

            cmall_test();
        };



    }
    function update_order(){
        var req={};
        req.orders_id=[];
        var i=0;
        up_order();
        function up_order(){
            g_page = mx("#page");
            g_page.innerHTML='<div id="login_page">'+
                'orders_id<input type="uint32" id="orders_id"/><br/>'+
                '<button id="up_order">设置order_status</button><br>'+
                '<button id="add">添加</button><br>'+
                '<button id="return_home">返回</button><br>'+
                '</div>';
            document.getElementById("add").onclick=function(){
                var orders_id = 1000000000+Number(document.getElementById("orders_id").value);
                req.orders_id[i]=orders_id;
                i++;
                up_order();
            };

            document.getElementById("up_order").onclick=function(){
                var orders_id = 1000000000+Number(document.getElementById("orders_id").value);
                req.orders_id[i]=orders_id;
                send_to_set_order();
            };
            document.getElementById("return_home").onclick=function(){
                i=0;
                cmall_test();
            };


        }


        function send_to_set_order(){
            g_page = mx("#page");
            g_page.innerHTML='<div id="login_page">'+
                'orders_status<input type="lenstr" id="orders_status"/><br/>'+
                '<button id="set_order">发送</button><br>'+
                '<button id="return_home">返回</button><br>'+
                '</div>';
            document.getElementById("set_order").onclick=function(){
                var orders_status = document.getElementById("orders_status").value;
                req.order_status=orders_status;


            var nid = create_nid(2, login_data.lid, 5, login_data.share_key);
            req.nid = nid;
            console.log(req);
            window.send_msg(0x50500000, 'cmall_update_order_req', req, function (type, data) {

                if (data.result == "failed") {
                    console.log("get_error");
                    console.log(error);

                }else {
                    console.log("get_success");
                    console.log(data);
                }
                alert(data.result);

                g_page.innerHTML='<div id="login_page">'+
                    '<button id="return">返回</button><br>'+
                    '</div>';
                document.getElementById("return").onclick=function() {
                    update_order();
                }
            });
            };
            document.getElementById("return_home").onclick=function(){
                i=0;
                update_order();
        };
        }
    }
    function cmall_test(){
        g_page = mx("#page");
        g_page.innerHTML = '<div id="login_page">' +
            '<button id="set_price">设置价格</button><br>' +
            '<button id="set_stock">设置库存</button><br>' +
            '<button id="create_order">创建订单</button><br>' +
            '<button id="get_order">获取订单</button><br>' +
            '<button id="check_order">获取订单总表</button><br>' +
            '<button id="up_order">更新订单</button><br>' +
            '<button id="up_logi">更新物流</button><br>' +
            '<button id="up_paid">更新支付状态</button><br>' +
            '</div>';
        document.getElementById("set_price").onclick = function () {
            set_price();
        };
        document.getElementById("set_stock").onclick = function () {
            set_stock();
        };
        document.getElementById("create_order").onclick = function () {
            create_orders1();
        };
        document.getElementById("up_logi").onclick = function () {
            up_logistics();
        };
        document.getElementById("up_order").onclick = function () {
            update_order();
        };
        document.getElementById("check_order").onclick = function () {
            check_order();
        };
        document.getElementById("get_order").onclick = function () {
            get_order();
        };
        document.getElementById("up_paid").onclick = function () {
            up_paid();
        };
    }

    function test_test(){
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
             'upload_file<input type="file" name="file" id="file"/><br>'+
            '<input id="token">token</input><br>'+
            '<input id="user">user</input><br>'+
            '<input id="start_time">start_time</input><br>'+
            '<input id="end_time">end_time</input><br>'+
            '<input id="trigger">trigger</input><br>'+
            '<input id="stream_type">stream_type</input><br>'+
            '<button id="set_pic">完成</button><br>'+
            '</div>';
        var upload_pic;
        document.getElementById("file").onchange=function() {
            console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
            var file = this.files[0];
            //   console.log(file);
            var fr = new FileReader();
            fr.onload = function() {
                //   console.log(this.result);
                upload_pic=this.result.replace('data:image/jpeg;base64','data:application/octet-stream;base64');
            };
            fr.readAsDataURL(file);
        };




        document.getElementById("set_pic").onclick=function(){
            console.log("==================================================");
            var token=document.getElementById("token").value;
            var user=document.getElementById("user").value;
            var start_time=document.getElementById("start_time").value;
            var end_time=document.getElementById("end_time").value;
            var trigger=document.getElementById("trigger").value;
            var stream_type=document.getElementById("stream_type").value;
            if (upload_pic == "") {

                upload_pic = "1234567890";
            }
            var req = {token:token,user:user,start_time:start_time,data:upload_pic,end_time:end_time,trigger:trigger,stream_type:stream_type};

            /* upload_data = document.getElementById("file").value;*/


                window.send_msg_from(0x10920000, 'cmfs_set', req, function (type, data) {
                    console.log(data);
                });


         //   var req = {/*upload_data:image,*//* nid:"0",*/ request:request, segment_id:segment_id, language:language };

        };
    }

    function test_cdfs(){
        g_page = mx("#page");
        g_page.innerHTML='<div id="login_page">'+
            "<form id='up_file_form' method='post' action='cats/cats_activation_req.js?'" +
            " enctype='multipart/form-data' " +
            "style='padding:0px;margin:0px;border:none;overflow:hidden;'>" +

            '<input type="file" id="dFirmwareContent" name="dFirmwareContent"/>'+

           // 'flag<input type="text" id="flag"/><br/>'+
          //  'text<input type="text" id="text"/><br/>'+
            '<button id="set">tupia</button><br>'+
            '<button id="set_pic">完成</button><br>'+
            '<button id="return_home">返回</button><br>'+
            '</div>';
        var form = document.getElementById("up_file_form");
        document.getElementById("set_pic").onclick=function(){
            var flag = document.getElementById("flag").value;

            /*
             doc.body["style"]["cssText"] = "padding:0px;margin:0px;border:none;overflow:hidden;";
             doc.body.innerHTML = "<form id='up_file_form' method='post' action='cct/upgrade_request.js?dFirmwareSrc=upload'" +
             " enctype='multipart/form-data' " +
             "style='padding:0px;margin:0px;border:none;overflow:hidden;'>" +
             "<input type='file' id='dFirmwareContent' name='dFirmwareContent' hidefocus='true'" +
             " title='upload'" +
             " style='padding:0px;margin:0px;left:-5px;top:0px;verflow:hidden;cursor:f;" +
             "line-height:24px;'" +
             "/><br>" +
             "</form>";
             iframe.value="1";
             var form = doc.getElementById("up_file_form");
             doc.getElementById("dFirmwareContent").onchange = function () {
             var path = this.value.replace(/.*:?\\(.*\\){0,}/g, '');
             form.action += '&dfilename=' + encodeURI(path.toString('utf-8'));
             };



             */





            /* upload_data = document.getElementById("file").value;
            *

             <flag			                  type="uint32"/>
             <_msysenv>
             <file_exchange                  type="lenstr"                           counts="0-100"/>
             </_msysenv>
             <FirmwareContent                    type="bytes"                            info="firmware content. valid wgwen upload"/>
             <models                        type="lenstr"/>
             <text    */

           // console.log(image);

            form.action += '&dflag=1'+'&models=P1';

            form.submit();
            var req = {/*upload_data:image,*//* nid:"0",*/ request:request, segment_id:segment_id, language:language };
            /* window.send_msg('cdms', 'cdms_set_pic_req', req, function (type, data) {

             if (data.result == "failed") {
             console.log("niconiconi");
             console.log(data.result);
             }else {

             }
             g_page.innerHTML='<div id="login_page">'+
             '<button id="return">返回</button><br>'+
             '</div>';
             document.getElementById("return").onclick=function() {
             set_pic();
             }
             });*/
        };
    }

    //------------------------------------------------------------------------------------------------------------------
    function cbms_test() {
        g_page = mx("#page");
        g_page.innerHTML = '<div id="login_page">' +
            '<button id="creat_tree">creat tree</button><br>' +
            '<button id="set_tree">set tree</button><br>' +
            '<button id="get_tree_req">get tree</button><br>' +
            '<button id="del_tree_req">del tree</button><br>' +
            '<button id="backup_req">backup</button><br>' +
            '<button id="recovery_req">recovery</button><br>' +
            '<button id="return_home">返回</button><br>'+
            '</div>';

        document.getElementById("creat_tree").onclick = function () {
            creat_tree();
        };
        document.getElementById("set_tree").onclick = function () {
            set_tree();
        };
        document.getElementById("get_tree_req").onclick = function () {
            get_tree_req();
        };
        document.getElementById("del_tree_req").onclick = function () {
            del_tree_req();
        };

        document.getElementById("backup_req").onclick = function () {
            backup_req();
        };

        document.getElementById("recovery_req").onclick = function () {
            recovery_req();
        };
        document.getElementById("return_home").onclick = function () {
            fork();
        };
    }





    function error_class(type,error_type,error_data){
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
    /*-----------------Setting options pages--------------------*/

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
