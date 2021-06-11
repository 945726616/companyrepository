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
function get_list()
{
    g_page = mx("#page");
    g_page.innerHTML='<div id="login_page">'+
        'start<input type="uint32" id="list_start"/><br/>'+
        'counts<input type="uint32" id="list_counts"/><br/>'+
        'language<input type="lenstr" id="language"/><br/>'+
        'status<input type="lenstr" id="status"/><br/>'+
        'area<input type="lenstr" id="area"/><br/>'+
        '<button id="get_list">��ȡ</button><br>'+
        '<button id="return_home">����</button><br>'+
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
        var req = {start:start,counts:counts,language:language,p:p};
        window.send_msg("cpis", "cpis_get_list_req", req, function (type, data) {

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
                get_list();
            }
        });
    };
    document.getElementById("return_home").onclick=function() {
        login_class();
    }
}
function   get_value(){
    g_page = mx("#page");
    g_page.innerHTML='<div id="login_page">'+
        'flag<input type="uint32" id="flag"/><br/>'+
        'keys0<input type="lenstr" id="keys0"/><br/>'+
        'keys1<input type="lenstr" id="keys1"/><br/>'+
        'tokens<input type="lenstr" id="tokens"/><br/>'+
        '<button id="get_value">获取</button><br>'+
        '<button id="return_home">返回</button><br>'+
        '</div>';
    document.getElementById("get_value").onclick=function(){
        var flag = document.getElementById("flag").value;
        var keys0 = document.getElementById("keys0").value;
        var keys1 = document.getElementById("keys1").value;
        var tokens = document.getElementById("tokens").value;
        var key=[];
        if(keys1==""){
            key.push(keys0);
        }else{
            key.push(keys0);
            key.push(keys1);
        }

        var req = {flag:flag,keys:key,token:tokens};
        window.send_msg(0x50000000, 'csfs_get_list_object_value_req', req, function (type, data) {

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
                get_list();
            }
        });
    };
    document.getElementById("return_home").onclick=function() {
        login_class();
    }
}
function create_ticket(){
    var req={};
    g_page = mx("#page");
    g_page.innerHTML='<div id="login_page">'+
        'title<input type="lenstr" id="title"/><br/>'+
        'series<input type="lenstr" id="series"/><br/>'+
        'upload_pic<input type="file" name="file" id="file"/><br>'+
        '<button id="get_item">获取item</button><br>'+
        '<button id="return_home">返回</button><br>'+
        '</div>';
    document.getElementById("file").onchange=function() {
        var file = this.files[0];
        console.log(file);
        var fr = new FileReader();
        fr.onload = function() {
            console.log(this.result);
            req.upload_pic=this.result.replace('data:image/png;base64','data:application/octet-stream;base64');
        };
        fr.readAsDataURL(file);
    };
    document.getElementById("get_item").onclick=function() {
        var title = document.getElementById("title").value;
        var series = document.getElementById("series").value;
        req.title=title;
        req.series=series;
        get_item();
    };
    document.getElementById("return_home").onclick=function() {
       login_class();
    };
      function get_item(){
          g_page = mx("#page");
          g_page.innerHTML='<div id="login_page">'+
              'user<input type="lenstr" id="user"/><br/>'+
              'date<input type="lenstr" id="date"/><br/>'+
              'data<input type="lenstr" id="data"/><br/>'+
              'pic<input type="lenstr" id="pic"/><br/>'+
              '<button id="get">发送</button><br>'+
              '<button id="return_home">返回</button><br>'+
              '</div>';
          document.getElementById("get").onclick=function() {
              var user = document.getElementById("user").value;
              var date = document.getElementById("date").value;
              var data = document.getElementById("data").value;
              var pic = document.getElementById("pic").value;
              req.content_item={user:user,date:date,data:data,pic:pic};
                send();
          };
      }

    function send(){
        send_msg_from("ctck", "ctck_create_ticket_req", req, function (type, data) {

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
                get_list();
            }
        });
    };
}
function login_class(){
    g_page = mx("#page");
    g_page.innerHTML='<div id="login_page">'+
        '<button id="get_value">进行csfs_get_list_value</button><br>'+
        '<button id="create">进行ctck_create_ticket_req</button><br>'+
        '</div>';

    document.getElementById("get_value").onclick=function(){
        get_value();
    };
    document.getElementById("create").onclick=function(){
       create_ticket();
    };


}