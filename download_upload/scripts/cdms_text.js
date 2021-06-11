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
        window.send_msg("cdms", "cdms_get_pic_req", req, function (type, data) {

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
        login_class();
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
        form.action += '&drequest=' + request;
        form.action += '&dsegment_id=' + segment_id;
        form.action += '&dlanguage=' + language;
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
        login_class();
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
        var req = {};
        if (i == 0) {
            req = {segment_name:segment_name, language:languages};
        } else {
            req = {segment_ids:segment_ids, language:languages};
        }
        window.send_msg('cdms', 'cdms_get_segment_req', req, function (type, data) {
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
        login_class();
    }
}


function set_segment()
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
        var req = {flag: flag, segment_id: segment_id, segment: segment};
        console.log(req);
        window.send_msg('cdms', 'cdms_set_segment_req', req, function (type, data) {
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
        login_class();
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
        var req = {id:id,users_add:add_segment_id,users_del:del_segment_id};
        window.send_msg('cdms', 'cdms_set_segment_users_req', req, function (type, data) {
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
        login_class();
    }
}



function login_class(){
    g_page = mx("#page");
    g_page.innerHTML='<div id="login_page">'+
        '<button id="get_pic">取得图片</button><br>'+
        '<button id="set_pic">保存图片</button><br>'+
        '<button id="get_segment">取得segment</button><br>'+
        '<button id="set_segment">保存segment</button><br>'+
        '<button id="set_segment_users">修改users</button><br>'+
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

}




















