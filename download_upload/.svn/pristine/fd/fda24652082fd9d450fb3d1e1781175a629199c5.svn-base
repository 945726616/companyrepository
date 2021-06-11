(function(window, document){
    login_data={};
    to_list=['cdms','cpis','cbms','ctck','0x50000000','cmall','test','comc'];
    req_list=['cmall_set_addr_req','cmall_get_addr_req','cmall_get_cart_req','cmall_set_cart_req'];
    list=['to','req'];
    all_req_list={cmall:['cmall_set_addr_req','cmall_get_addr_req','cmall_get_cart_req','cmall_set_cart_req','cmall_get_price_req',
    'cmall_set_price_req','cmall_get_stock_req','cmall_set_stock_req','cmall_get_order_req','cmall_create_order_req','cmall_pay_req',
    'cmall_update_pay_req','cmall_check_order_req','cmall_update_logistics_req','cmall_update_order_req','cmall_create_comment_req',
    'cmall_review_comment_req','cmall_get_comment_req','cmall_set_auth_user_req','cmall_look_auth_user_req','cmall_auth_user_list_req'],
                    test:['test_req'],comc:['comc_get_server_basic_info_req','comc_get_server_basic_info_count_req','comc_set_server_basic_info_count_req']};
   /* all_value_list={cmall:{cmall_set_addr_req:['flag','addres','id','name','country','province','address','postcode','phone','landline'], cmall_get_addr_req:['flag'],
        cmall_get_cart_req:['start','counts','language'],cmall_set_cart_req:['flag','id','serial_id','modle_id','param','number']}
    };*/
    all_value_list={cmall:{cmall_set_addr_req:{flag:"int32",addres:{flag:"int32",id:"int32",name:"lenstr",country:"lenstr",province:"lenstr",address:"lenstr",postcode:"lenstr",
        phone:"lenstr",landline:"lenstr"}}, cmall_get_addr_req:{flag:"lenstr"},
        cmall_get_cart_req:{flag:"int32",start:"int32",counts:"int32",language:"lenstr"},cmall_set_cart_req:{flag:"int32",id:"int32",serial_id:"lenstr",modle_id:"lenstr",
            param:[],number:"int32"},cmall_get_price_req:{flag:"lenstr",model_key:"lenstr",p:[{n:"lenstr",v:"lenstr"}]},cmall_set_price_req:{model_key:"lenstr",
            prices:[{area:"lenstr",unit:"lenstr",amount:"uint32"}]},cmall_get_stock_req:{flag:"lenstr",area:"lenstr",model_key:"lenstr",p:[{n:"lenstr",v:"lenstr"}]},
        cmall_set_stock_req:{model_key:"lenstr", stock_total:{area:"lenstr",stocks:[{param:[],real_num:"lenstr",mall_num:"uint32"}]}},cmall_get_order_req:
        {flag:"uint32",month:"uint32",start:"uint32",counts:"uint32"},cmall_create_order_req:{},cmall_pay_req:{order_id:"uint32",pay_type:"uint32"},cmall_update_pay_req:{
            debug_pass:"lenstr",pay_id:"lenstr",order_id:"uint32",pay_type:"uint32"},cmall_check_order_req:{start:"uint32",counts:"uint32",month:"uint32",user:"lenstr",status:"lenstr"},
        cmall_update_logistics_req:{orders_id:"uint32",logistics_id:"lenstr"},cmall_update_order_req:{orders_id:"uint32",order_status:"lenstr"},cmall_create_comment_req:{
            order_id:"uint32",product_id:"lenstr",rate:"uint32",comment:"lenstr"},cmall_review_comment_req:{comments_id:"lenstr",comment:"lenstr",comment_review:"uint32"},
        cmall_get_comment_req:{start:"uint32",counts:"uint32",flag:"uint32",serial_id:"lenstr"},cmall_set_auth_user_req: {auth:[],auth_level:[],user:"lenstr"},
        cmall_look_auth_user_req:{auth:[],user:"lenstr"},cmall_auth_user_list_req:{start:"uint32",counts:"uint32"}},
        test:{test_req:{test_1:[{test_1_1:"lenstr"}]}},comc:{comc_get_server_basic_info_req:{},comc_get_server_basic_info_count_req:{},comc_set_server_basic_info_count_req:{
            count_conf:[{name:"lenstr",value:[]}]
        }}
    };
    all_value_list.cmall.cmall_create_order_req.product=[{id:"int32",serial_id:"lenstr",stock_id:"lenstr",modle_id:"lenstr",param:[],number:"int32",comment_id:"lenstr"}];
    //all_value_list.cmall.cmall_create_order_req.total_price=all_value_list.cmall.cmall_set_price_req.prices;
    all_value_list.cmall.cmall_create_order_req.invoice={flag:"uint32",name:"lenstr",phone:"lenstr",email:"lenstr",content:"lenstr"};
    all_value_list.cmall.cmall_create_order_req.addres=all_value_list.cmall.cmall_set_addr_req.addres;
    powers=[];
    user_power={};
    powers_flag=0;
    confcenter_names=[];
    node_list_names=[];
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

    function login_class(){
     /*   function document.onkeydown()
        {
            if(window.event.keyCode == 13)
            {
                alert("enter");
                document.getElementById('login_button').click();
            }
        }*/
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
                    console.log(document.getElementById("pass").value);
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
            if(user == 'admin'){
                powers_flag = 1;
            }
            console.log(pass);
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
                console.log(login_req);
                ms.send_msg(0x50000000,'cacs_login_req',login_req,function(type, data){
                    console.log(data);
                    if( data.result.length == 0 ){
                        fork();

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
        g_page.innerHTML='<div id="login_page">'+
            '<h1>test page</h1>' +
            '<textarea name="textfield3" cols="100" rows="3" id="data_text"></textarea>'+
            '<div id="textarea">' +
            '</div>' +
            '<div id="Parameters_v1">' +
            '<h2>Parameters</h2>' +
            '<button id="add_Parameters">添加参数</button>'+
            '<button id="nid_e">有nid</button><br>'+
            '</div>' +
            '<div id="Parameters">' +
            '</div>' +
            '<div id="address">' +
            '<h2>address</h2>' +
            '</div>' +
            '<button id="send_msg">发送</button>'+
            '<button id="return">返回</button><br>'+
            '</div>';
        var all_data={};
        var tmp = document.createElement("div");
        tmp.innerHTML = "to" + ':&nbsp';
        var select = document.createElement("select");
        select.id = "to";
        select.innerHTML = '<option type="radio" value="null">NULL</option>';
        for (var i = 0; i < to_list.length; i++) {
            var option = document.createElement("option");
            option.type = "radio";
            option.value = to_list[i];
            option.innerHTML = to_list[i];
            select.appendChild(option);
        }
        tmp.appendChild(select);
        document.getElementById("address").appendChild(tmp);
        var value_list={};
        document.getElementById("add_Parameters").onclick=function(){
            function removeAllChild()
            {
                var div = document.getElementById("Parameters");
                while(div.hasChildNodes()) //当div下还存在子节点时 循环继续
                {
                    div.removeChild(div.firstChild);
                }
            }
            removeAllChild();
            // add_parameters(all_data);
            all_data={};
            build_parameters(all_data,value_list,"","",function(d) {
                all_data = JSON.parse(d);
                document.getElementById("data_text").value=d;
            });
        };
        document.getElementById("return").onclick=function() {
            fork();
        };
        document.getElementById("nid_e").onclick=function() {
            var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );
            all_data.nid=nid;
        };
        document.getElementById("to").onchange=function() {
           if (document.getElementById("req_p") != undefined) {
               var div=document.getElementById("req_p")
               div.parentNode.removeChild(div);
           }

            var req_list=all_req_list[document.getElementById("to").value];
            var tmp = document.createElement("div");
            tmp.id="req_p";
            tmp.innerHTML = "req" + ':&nbsp';
            var select = document.createElement("select");
            select.id = "req";
            select.innerHTML = '<option type="radio" value="null">NULL</option>';
            for (var i = 0; i < req_list.length; i++) {
                var option = document.createElement("option");
                option.type = "radio";
                option.value = req_list[i];
                option.innerHTML = req_list[i];
                select.appendChild(option);
            }
            tmp.appendChild(select);
            document.getElementById("address").appendChild(tmp);
            document.getElementById("req").onchange=function() {
                console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
                value_list=all_value_list[document.getElementById("to").value] [document.getElementById("req").value];
            }
        };
        document.getElementById("send_msg").onclick=function() {
            // var nid=create_nid( 2, login_data.lid, 5,login_data.share_key );

            var req=document.getElementById("req").value;
            var to=document.getElementById("to").value;
            // all_data.nid=nid;
            console.log(all_data);
            ms.send_msg(to, req, all_data, function (type, data) {
                if (document.getElementById("data_text_ack") == undefined) {
                    var tmp = document.createElement("div");
                    tmp.innerHTML +='reply<br>';
                    tmp.innerHTML += '<textarea name="textfield3" cols="100" rows="3" id="data_text_ack"></textarea>';
                    document.getElementById("textarea").appendChild(tmp);
                }
                document.getElementById("data_text_ack").value=JSON.stringify(data);

                if (data.result == "failed") {
                    console.log("get_error");
                    console.log(error);

                }else {
                    console.log("get_success");
                    console.log(data);
                }
          //      alert(data.result);
                /*
                 g_page.innerHTML='<div id="login_page">'+
                 '<button id="return">返回</button><br>'+
                 '</div>';
                 document.getElementById("return").onclick=function() {
                 fork();
                 }*/
            });

        }
        function isArrayFn(value){
            if (typeof Array.isArray === "function") {
                return Array.isArray(value);
            }else{
                return Object.prototype.toString.call(value) === "[object Array]";
            }
        }
        function build_parameters(data,parameters,len,kkk,callback) {

            len += '&nbsp;';
            var dd = {};
            var tmp = document.createElement("div");
            tmp.innerHTML = '';
            var kk = "";
            if (kkk != "") {
                tmp.innerHTML += len + kkk + '<br>';
                kk = kkk;
            }
            var key_s=[];
            document.getElementById("Parameters").appendChild(tmp);
            for (var k in parameters) {
                if (typeof(parameters[k]) != "object") {
                    tmp.innerHTML += len + k + '<input type="' + parameters[k] + '" id="' + k + '"/><br>';
                } else {
                    if (isArrayFn(parameters[k]) == true) {
                        data[k] = [];
                        if (parameters[k].length == 0) {
                            arr_save(kkk,k,len,function(d,k) {
                                dd[k]=d;
                                console.log('------------------------------');
                                console.log(k)
                            });
                            /*  tmp.innerHTML += len + k + '<input type="text" id="' + k + '"/><br>' +
                             len + '<button id="save_arr_'+k+'">存入</button><button id="clear_arr_'+k+'">清空</button><br>';
                             dd[k] = [];
                             // console.log("save_arr_"+k);
                             /!*    document.getElementById("save_arr_"+k).onclick = function () {
                             console.log("ooooooooooooooooooooooooooooooooooooooo");
                             var arr_data = document.getElementById(k).value;
                             dd[k].push(arr_data);
                             };
                             document.getElementById("clear_arr_"+k).onclick = function () {
                             dd[k].length = 0;
                             };*!/*/
                        } else {
                            build_parameters(data[k], parameters[k][0], len, k,function(d,k) {
                                dd[k] = JSON.parse(d);
                            });
                        }
                    } else {
                        data[k] = {};
                        build_parameters(data[k], parameters[k], len, k,function(d,k) {
                            dd[k] =  JSON.parse(d);
                        });
                    }
                }
            }
            for (var i=0;i<key_s.length;i++) {
                document.getElementById("save_arr_"+key_s[i]).onclick = function () {
                    console.log("ooooooooooooooooooooooooooooooooooooooo");
                    var arr_data = document.getElementById(key_s[i]).value;
                    dd[key_s[i]].push(arr_data);
                };
                document.getElementById("clear_arr_"+key_s[i]).onclick = function () {
                    dd[key_s[i]].length = 0;
                };
            }
            //   console.log(dd);
            if (isArrayFn(data) == true) {
                var arr={}
                tmp.innerHTML += len + '<button id="save_arr_'+kkk+'">存入'+kkk+'</button><button id="clear_arr_'+kkk+'">清空</button><br>';
                document.getElementById("save_arr_"+kkk).onclick = function () {
                    console.log(dd);
                    for (var k in parameters) {
                        if (typeof(parameters[k]) != "object") {
                            arr[k] = document.getElementById(k).value;
                        } else {
                            arr[k] = dd[k];
                        }
                    }
                    data.push(arr);
                    var dddd=JSON.stringify(data);
                    callback(dddd,kkk);
                    /*   var dddd=JSON.stringify(data);
                     document.getElementById("data_text").value=dddd;*/
                };
                document.getElementById("clear_arr_"+kkk).onclick = function () {
                    data.length=0;
                };
            } else {
                tmp.innerHTML += len + '<button id="Confirm_' + kk + '">确定</button><br>';

                document.getElementById("Confirm_" + kk).onclick = function () {
                    console.log(dd);
                    for (var k in parameters) {
                        if (typeof(parameters[k]) != "object") {
                            data[k] = document.getElementById(k).value;
                        } else {
                            data[k] = dd[k];
                            console.log(dd[k]);
                        }
                    }
                    console.log(JSON.stringify(data));
                    console.log(data);
                    console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
                    var dddd=JSON.stringify(data);
                    callback(dddd,kkk);
                    document.getElementById("data_text").value=dddd;

                };
            }


            //      document.getElementById("Parameters").appendChild(tmp);
        }
        function arr_save(kkk,k,len,callback) {
            var dd={};
            var tmp = document.createElement("div");
            tmp.innerHTML = '';
            tmp.innerHTML +=len+kkk+'<br>';
            document.getElementById("Parameters").appendChild(tmp);
            tmp.innerHTML += len + k + '<input type="text" id="' + k + '"/><br>' +
                len + '<button id="save_arr_'+k+'">存入'+k+'</button><button id="clear_arr_'+k+'">清空</button><br>'+
                len+ '<button id="Confirm_'+k+'">确定</button><br>';
            dd[k] = [];
            console.log("save_arr_"+k);
            document.getElementById("save_arr_"+k).onclick = function () {
                console.log("ooooooooooooooooooooooooooooooooooooooo");
                var arr_data = document.getElementById(k).value;
                dd[k].push(arr_data);
            };
            document.getElementById("clear_arr_"+k).onclick = function () {
                dd[k].length = 0;
            };
            document.getElementById("Confirm_"+k).onclick = function () {
                callback(dd[k],k);
                var dddd=JSON.stringify(dd[k]);
                document.getElementById("data_text").value=dddd;
            }
        }


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
