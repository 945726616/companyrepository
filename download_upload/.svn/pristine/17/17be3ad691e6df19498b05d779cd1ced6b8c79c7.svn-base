
mcloud_agent = window.mcloud_agent;
g_lang = ""; 
Array.prototype.remove = function(val) {
	var idx = this.indexOf(val);
	if (idx > -1) {
	this.splice(idx, 1);
	}
};
Array.prototype.removeLength = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};
Array.prototype.indexOf = function(el){
 	for (var i=0,n=this.length; i<n; i++){
  		if (this[i] === el){
   			return i;
  		}
 	}
 	return -1;
}
Array.prototype.insert = function (index, item) {
	this.splice(index, 0, item);
};
Date.prototype.format = function(format)
{
    var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(),    //day
        "h+" : this.getHours(),   //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
        "S" : this.getMilliseconds() //millisecond
    }
    if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
        (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)if(new RegExp("("+ k +")").test(format))
        format = format.replace(RegExp.$1,
            RegExp.$1.length==1 ? o[k] :
                ("00"+ o[k]).substr((""+ o[k]).length));
    return format;
} 
function getUrlParam(url,name){  //Get address bar parameters
     var pattern = new RegExp("[?&]"+name+"\=([^&]+)", "g");  
     var matcher = pattern.exec(url);  
     var items = null;  
     if(null != matcher){  
             try{  
                    items = decodeURIComponent(decodeURIComponent(matcher[1]));  
             }catch(e){  
                     try{  
                             items = decodeURIComponent(matcher[1]);  
                     }catch(e){  
                             items = matcher[1];  
                     }  
             }  
     }  
     return items;  
}
function count(o){  //Calculate the number of objects
    var t = typeof o;
    if(t == 'string'){
            return o.length;
    }else if(t == 'object'){
            var n = 0;
            for(var i in o){
                    n++;
            }
            return n;
    }
    return false;
}; 
function mx(data)
{
	var str = data.substring(1);
	if(data.substring(0,1) == "#")
	{
		return document.getElementById(str);
	}
	else if (data.substring(0,1) == ".")
	{
		return document.getElementsByClassName(str);
	}
	else
	{
		return document.getElementsByTagName(data);
	}
}
function select_brother(obj,num,type)
{
	if(type == "after")
	{
		for(var i=0;i<num;i++)
		{
			obj = obj.nextSibling;
		}	
		return obj;
	}
	else if(type == "before")
	{	
		return obj;
	}
	else if(type == "first")
	{
		for(var i=0;i<num;i++)
		{
			obj = obj.previousSibling;
		}
		return obj;
	}				
}
function random()
{
	return mmd5.hex("r"+Math.random());
}
function hasClass(obj, cls) {  
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));  
}  
  
function addClass(obj, cls) {  
    if (!this.hasClass(obj, cls)) obj.className += " " + cls;  
}  
  
function removeClass(obj, cls) {  
    if (hasClass(obj, cls)) {  
        var reg = new RegExp('(\\s|^)' + cls);  
        obj.className = obj.className.replace(reg, '');  
    }  
}
function del_tip()
{
	mx("#admin_del_box").style.display = "block";
	mx("#admin_del_ok").onclick = function ()
	{
		mx("#admin_del_box").style.display = "none";
	}
	mx("#admin_del_cancel").onclick = function ()
	{
		mx("#admin_del_box").style.display = "none";
		return;
	}
}
function getParam(paramName) {
	paramValue = "";
	isFound = false;
	if (this.location.search.indexOf("?") == 0 && this.location.search.indexOf("=") > 1) {
		arrSource = unescape(this.location.search).substring(1, this.location.search.length).split("&");
		i = 0;
		while (i < arrSource.length && !isFound) {
			if (arrSource[i].indexOf("=") > 0) {
				if (arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase()) {
					paramValue = arrSource[i].split("=")[1];
					isFound = true;
				}
			}
			i++;
		}
	}
	return paramValue;
}

function create_login_page()
{
	mx("body").item(0).style.height = document.documentElement.clientHeight + "px";
	mx("body").item(0).innerHTML = 
	"<div id='login_page'>"
		+"<div id='login_input'>"
			+"<div id='login_title'>"+((getParam("sign")=="ebit")?("ebit管理系统"):("vimtag管理系统"))+"</div>"
			+"<div id='login_username'>"
				+"<div id='login_username_img'></div>"
				+"<input id='login_username_input' type='text' placeholder='用户名'value='"+(localStorage.getItem('admin_user')?localStorage.getItem('admin_user'):'')+"'>"
			+"</div>"
			+"<div id='login_password'>"
				+"<div id='login_password_img'></div>"
				+"<input id='login_password_input' type='password' placeholder='密码'value='"+(localStorage.getItem('admin_pass')?localStorage.getItem('admin_pass'):'')+"'>"
			+"</div>"	
			+"<div id='login_submit'>登录</div>	"	
		+"</div>"
	+"</div>";
	if (getParam("sign")=="ebit"){
		document.getElementById("login_page").style.backgroundImage = "none"
		document.getElementById("login_page").style.backgroundColor = "#F5F5F5"
		document.getElementById("login_title").style.color = "#FF781F"
		document.getElementById("login_submit").style.backgroundColor = "#FF781F"
	}
	mx("#login_submit").onclick = function ()
	{

		login_event();
	}
	function login_event()
	{
		var l_user = mx("#login_username_input").value;
		var l_pass = mx("#login_password_input").value;
		mcloud_agent.login_req({username:l_user,password:l_pass},null,function (msg,ref){

			if(msg.result == "")
			{
				localStorage.setItem('admin_user',document.getElementById('login_username_input').value);
				localStorage.setItem('admin_pass',document.getElementById('login_password_input').value);
                mcloud_agent.look_user_auth({user:l_user}, null, function (msgp, ref) {
                    console.log(msgp);
                    if (msgp.result == ""){
                        if (l_user == "mipcmadmin"||msgp.auth.length == 7){
                            main();
                        }else {
                            for (var i = 0; i < msgp.auth.length; i ++){
                                if (msgp.auth[i] == "send"){
                                    main(msgp.auth);
                                }
                            }
                        }
                    }else{
                    	alert("该账号没设置权限");
					}
                })
			}else if(msg.result == "accounts.pass.invalid"||msg.result == "accounts.user.unknown")
			{
				localStorage.removeItem('admin_user');
				localStorage.removeItem('admin_pass');
				document.getElementById('login_username_input').value = "";
				document.getElementById('login_password_input').value = "";

				alert("用户名或密码错误")
			}
		})
	}
}
function login()
{
	create_login_page();
}
window.onresize = function()
{
	mx("body").item(0).style.height = document.documentElement.clientHeight-30 + "px";
	if(mx("#admin_right"))
	{
		mx("#admin_right").style.width = mx("body").item(0).offsetWidth-160 + "px";
	}
}
function create_main_page(auth)
{
	mx("body").item(0).style.height = document.documentElement.clientHeight-30 + "px";
	mx("#admin_right").style.width = mx("body").item(0).offsetWidth-160 + "px";
	mx("#admin_left_menu_order").onclick = function (){
		jQuery(".admin_left_menu").css({"color":"#fff"});
		this.style.color = "#00A6BA";
		modify_order(auth);
        $("#admin_right2").hide();
		$("#admin_right2").empty();
	}
	mx("#admin_left_menu_shop").onclick = function()
	{
		jQuery(".admin_left_menu").css({"color":"#fff"});
		this.style.color = "#00A6BA";
		modify_shop();
        $("#admin_right2").hide();
		$("#admin_right2").empty();

	}
	mx("#admin_left_menu_column").onclick = function()
	{
		jQuery(".admin_left_menu").css({"color":"#fff"});
		this.style.color = "#00A6BA";
		modify_column();
        $("#admin_right2").hide();
		$("#admin_right2").empty();

	}
	mx("#admin_left_menu_info").onclick = function()
	{
		mx("#load_box").style.display = "none";
		jQuery(".admin_left_menu").css({"color":"#fff"});
		this.style.color = "#00A6BA";
		resource_library("info");
        $("#admin_right2").hide();
		$("#admin_right2").empty();

	}
	mx("#admin_left_menu_paramet").onclick = function()
	{
		jQuery(".admin_left_menu").css({"color":"#fff"});
		this.style.color = "#00A6BA";
		resource_library("paramet");
        $("#admin_right2").hide();
		$("#admin_right2").empty();

	}
	mx("#admin_left_menu_stock").onclick = function()
	{
		jQuery(".admin_left_menu").css({"color":"#fff"});
		this.style.color = "#00A6BA";
		modify_stock();
        $("#admin_right2").hide();
		$("#admin_right2").empty();

	}
	mx("#admin_left_menu_auth").onclick = function()
	{
		jQuery(".admin_left_menu").css({"color":"#fff"});
		this.style.color = "#00A6BA";
		modify_auth();
        $("#admin_right2").hide();
		$("#admin_right2").empty();

	}
	if (auth){
        modify_order(auth);
    }else{
        modify_shop();
    }
}
function modify_shop()
{
	document.onkeyup = function(){}
	create_shop_page();
	// create_info_page();
}
function create_parameter_page(obj)
{
	var parameter_content;
	var table_content;
	var display_btn = 0;
	var display_shop_btn = 1;
	var serials_content = "";
	var l_data;
	mx("#admin_right").innerHTML = 
	"<div id='parameter_control_assembly'>"
		+"<div id='parameter_control'>"
			+"<button id='display_shop_btn'>隐藏产品</button>"
			+"<button id='add_new_shop_btn'>添加型号</button>"
			+"<button id='back_shop_btn'>返回</button>"
		+"</div>"
		+"<div id='series_list_box' style='display:block;'>"
		+"</div>"
	+"</div>"
	+"<div id='parameter_table_box' style='display:none;'>"
		+"<table id='admin_right_parameter_table'></table>"
	+"</div>";
	mcloud_agent.models_get({serial_id:obj.id,models:obj.models,language:g_lang},null,function(msg,ref){
		console.log(msg);
		if(msg && msg.result == "")
		{
			console.log(msg);
			l_data = msg.serials[0];
			var models_length = l_data.models?l_data.models.length:0;
			for(var s_index = 0; s_index<models_length; s_index++)
			{
				serials_content+="<div class='series_list'>"
					+"<div><input class='input_width_60 shop_model_name' type='text' value='"+l_data.models[s_index].name+"'></div>"
					+"<div class='shop_parameter_show' index='"+s_index+"'>库存</div>"
					+"<div class='shop_parameter_edit' index='"+s_index+"'>修改</div>"
					+"<div class='shop_parameter_price' index='"+s_index+"'>价格</div>"
					+"<div class='shop_parameter_status' index='"+s_index+"'>购买方式</div>"
					+"<div class='shop_parameter_stock' index='"+s_index+"' style='display:none;'>库存</div>"
					+"<div class='shop_parameter_delect' index='"+s_index+"'>删除</div>"
				+"</div>"
			}
			mx("#series_list_box").innerHTML = serials_content;
			// get_shop_parameter (l_data.models?l_data.models[0]:"");
			add_parameter_event();
		}
	})
	function add_parameter_event ()
	{
		function set_model_parameter(models,type)
		{

			var img_url;
			var model_name = "";
			var model_length = 0;
			var model_content = "";
			var model_id = "";
			var model_img = "";
			var model_groups = [];
			var model_groups_child = [];
			var model_groups_index = -1;
			if(models)
			{
				var model = models.model;
				model_name = type=="create"?"":models.name;
				model_id = type=="create"?"":models.id;
				model_img = model.info.groups?model.info.groups[0].title.info.big_pic:"";
				model_length = model.info.groups?model.info.groups.length:0;
				for(var model_i=0;model_i<model_length;model_i++){
					model_groups.push(model.info.groups[model_i].title.id);
					model_groups_index++;
					model_groups_child[model_groups_index] = [];
					var model_info_length = model.info.groups[model_i].segments?model.info.groups[model_i].segments.length:0;
					for(var model_j=0;model_j<model_info_length;model_j++){
						model_groups_child[model_groups_index].push(model.info.groups[model_i].segments[model_j].id);
					}
				}
			}
			model_content += "<div>参数图片：<img id='pre_model_img' src='"+window.location.protocol+"//"+window.location.host+"/cdms/cdms_get_pic_req.js?dnid="+mcloud_agent._create_nid()+"&dpic_key="+model_img+"&"+random()+"' width='150px'/></div>"
			for(var l=0;l<model_length;l++)
			{
				model_content +=
					"<div>"
					+"<span class='class_content'>"+model.info.groups[l].title.info.title+"</span>"
					+" <button class='model_button_edit' index='"+l+"' m_index='"+model.info.groups[l].title.id+"' d_index='null'>修改</button>"
					+" <button class='model_button_del' index='"+l+"' m_index='"+model.info.groups[l].title.id+"' d_index='null'>删除</button>"
					+"</div>";
				var s_length = model.info.groups[l].segments?model.info.groups[l].segments.length:0;
				for(var s=0;s<s_length;s++)
				{
					model_content +=
						"<div style='margin-left:20px;'>"
						+"<span class='paramet_content'>"+model.info.groups[l].segments[s].info.title+" ："+model.info.groups[l].segments[s].info.desc+"</span>"
						+" <button class='model_button_edit' index='"+l+"' m_index='"+model.info.groups[l].title.id+"' d_index='"+model.info.groups[l].segments[s].id+"'>修改</button>"
						+" <button class='model_button_del' index='"+l+"' m_index='"+model.info.groups[l].title.id+"' d_index='"+model.info.groups[l].segments[s].id+"'>删除</button>"
						+"</div>";
				}
			}
			mcloud_agent.segment_get({start:0,counts:1000,language:g_lang,segment_name:"_vimtag_segment_paramet_info_"},null,function (msg,ref){
				mx("#admin_right").innerHTML =
					"<div id='add_model_box'>"
					+"<div>型号：<input type='text' id='add_model_name' value='"+model_name+"'/></div>"
					+"<div id='paramet_content'>"+model_content+"</div>"
					+"<div id='add_model_box_button'><button id='add_model_category_button'>添加类别</button> <button id='add_model_content_button'>添加项目</button></div>"
					+"<div>选择发布地区<br>"
					+ "<input id='zh' class='area_select' type='checkbox' value='zh' style='margin-left: 10px'>中国"
					+"<input id='tw' class='area_select' type='checkbox' value='tw' style='margin-left: 10px'>台湾"
					+"<input id='en' class='area_select' type='checkbox' value='en' style='margin-left: 10px'>英国"
					+"<input id='ja' class='area_select' type='checkbox' value='ja' style='margin-left: 10px'>日本"
					+"<input id='ko' class='area_select' type='checkbox' value='ko' style='margin-left: 10px'>韩国"
					+"<input id='de' class='area_select' type='checkbox' value='de' style='margin-left: 10px'>德国"
					+"<input id='fr' class='area_select' type='checkbox' value='fr' style='margin-left: 10px'>法国"
					+"<br><input id='es' class='area_select' type='checkbox' value='es' style='margin-left: 10px'>西班牙"
					+"<input id='ar' class='area_select' type='checkbox' value='ar' style='margin-left: 10px'>阿拉伯"
					+"<input id='pt' class='area_select' type='checkbox' value='pt' style='margin-left: 10px'>葡萄牙"
					+"<input id='it' class='area_select' type='checkbox' value='it' style='margin-left: 10px'>意大利"
					+"<input id='ru' class='area_select' type='checkbox' value='ru' style='margin-left: 10px'>俄罗斯"
					+"<input id='us' class='area_select' type='checkbox' value='us' style='margin-left: 10px'>美国"
					+"<input id='hk' class='area_select' type='checkbox' value='hk' style='margin-left: 10px'>香港"
					+ "</div>"
					+"<button id='add_model_button_submit'>确定</button> <button id='add_model_button_back'>返回</button>"
					+"</div>";
				console.log(models)
				if (models){
					for (var o = 0;o < models.filter.area.length;o++){
						if (models.filter.area[o] == "zh"){
							document.getElementById('zh').checked = true;
						}
						if (models.filter.area[o] == "tw"){
							document.getElementById('tw').checked = true;
						}
						if (models.filter.area[o] == "en"){
							document.getElementById('en').checked = true;
						}
						if (models.filter.area[o] == "ja"){
							document.getElementById('ja').checked = true;
						}
						if (models.filter.area[o] == "ko"){
							document.getElementById('ko').checked = true;
						}
						if (models.filter.area[o] == "de"){
							document.getElementById('de').checked = true;
						}
						if (models.filter.area[o] == "fr"){
							document.getElementById('fr').checked = true;
						}
						if (models.filter.area[o] == "es"){
							document.getElementById('es').checked = true;
						}
						if (models.filter.area[o] == "ar"){
							document.getElementById('ar').checked = true;
						}
						if (models.filter.area[o] == "pt"){
							document.getElementById('pt').checked = true;
						}
						if (models.filter.area[o] == "it"){
							document.getElementById('it').checked = true;
						}
						if (models.filter.area[o] == "ru"){
							document.getElementById('ru').checked = true;
						}
						if (models.filter.area[o] == "us"){
							document.getElementById('us').checked = true;
						}
						if (models.filter.area[o] == "hk"){
							document.getElementById('hk').checked = true;
						}
					}

				}
				mx("#segment_page_box").style.width = "100%";
				set_model_parameter_event(msg);
			})

			function set_model_parameter_event(msg){
				mx("#add_model_category_button").onclick = function(){
					var html_content = "";
					for(var i=0;i<msg.segment_ids.length;i++){
						var data = msg.segments[i].info;
						var img_url = msg.segments[i].info.big_pic?window.location.protocol+"//"+window.location.host+"/cdms/cdms_get_pic_req.js?dnid="+mcloud_agent._create_nid()+"&dpic_key="+msg.segments[i].info.big_pic+"&"+random():"";
						var remark = msg.segments[i].remark;
						if(remark == "class"){
							html_content += "<div class='paramet_info_list_box' index='"+i+"' mark='class'>"
								+"<div class='paramet_info_list_class'>"+(remark=="class"?"类别":"项目")+"</div>"
								+"<div class='paramet_info_list_title'>"+data.title+"</div>"
								+"<div class='paramet_info_list_content'>"+data.desc+"</div>"
								+"</div>";
						}
					}
					mx("#segment_page_box").innerHTML = html_content;
					mx("#segment_page").style.display = "block";
					add_paramet_list();
				}
				mx("#add_model_content_button").onclick = function(){
					var html_content = "";
					for(var i=0;i<msg.segment_ids.length;i++){
						var data = msg.segments[i].info;
						var img_url = msg.segments[i].info.big_pic?window.location.protocol+"//"+window.location.host+"/cdms/cdms_get_pic_req.js?dnid="+mcloud_agent._create_nid()+"&dpic_key="+msg.segments[i].info.big_pic+"&"+random():"";
						var remark = msg.segments[i].remark;
						if(remark == "paramet"){
							html_content += "<div class='paramet_info_list_box' index='"+i+"' mark='paramet'>"
								+"<div class='paramet_info_list_class'>"+(remark=="class"?"类别":"项目")+"</div>"
								+"<div class='paramet_info_list_title'>"+data.title+"</div>"
								+"<div class='paramet_info_list_content'>"+data.desc+"</div>"
								+"</div>";
						}
					}
					mx("#segment_page_box").innerHTML = html_content;
					mx("#segment_page").style.display = "block";
					add_paramet_list();
				}
				function add_paramet_list(){
					var paramet_info_list_box_length = mx(".paramet_info_list_box").length;
					for(var j=0;j<paramet_info_list_box_length;j++){
						mx(".paramet_info_list_box")[j].onclick = function(){
							var index = this.getAttribute("index");
							var mark = this.getAttribute("mark");

							if(mark=="class"){
								var m_index = msg.segment_ids[index];
								model_groups.push(msg.segment_ids[index]);
								var s_index = model_groups.length-1;
								model_groups_index++;
								model_groups_child[model_groups_index] = [];
								mx("#paramet_content").innerHTML +="<div>"
									+"<div>"+msg.segments[index].info.title+" <button class='model_button_del' index='"+s_index+"' m_index='"+m_index+"' d_index='null'>删除</button></div>"
									+"</div>";
							}else if(mark=="paramet"){
								var m_index = model_groups[model_groups.length-1];
								var s_index = model_groups.length-1;
								var d_index = msg.segment_ids[index];
								model_groups_child[model_groups_index].push(msg.segment_ids[index]);
								mx("#paramet_content").innerHTML +="<div>"
									+"<div style='margin-left:20px;'>"+msg.segments[index].info.title+" : "+msg.segments[index].info.desc+" <button class='model_button_del' index='"+s_index+"' m_index='"+m_index+"' d_index='"+d_index+"'>删除</button></div>"
									+"</div>";
							}
						}
					}
					del_paramet_list();
					edit_paramet_list();
				}
				function del_paramet_list(){
					var model_button_del_length = mx(".model_button_del").length;
					for(var i=0;i<model_button_del_length;i++){
						mx(".model_button_del")[i].onclick = function(){
							var m_index = this.getAttribute("m_index");
							var d_index = this.getAttribute("d_index");
							var index = this.getAttribute("index");
							if(d_index=="null"){
								model_groups_child.removeLength(model_groups.indexOf(m_index))
								model_groups.remove(m_index);
								for(var j=0;j<model_button_del_length;j++){
									var j_index = mx(".model_button_del")[j].getAttribute("index");
									if(index == j_index){
										mx(".model_button_del")[j].parentNode.style.display = "none";
									}
								}
								this.parentNode.style.display = "none";
							}else{
								model_groups_child[model_groups.indexOf(m_index)].remove(d_index);
								this.parentNode.style.display = "none";
							}
						}
					}
				}
				function edit_paramet_list(){
					var model_button_edit_length = mx(".model_button_edit").length;
					for(var i=0;i<model_button_edit_length;i++){
						mx(".model_button_edit")[i].onclick = function(){
							var d_index = this.getAttribute("d_index");
							var m_index = this.getAttribute("m_index");
							var _this = this;
							if(d_index=="null"){
								console.log(1);
								var html_content = "";
								for(var j=0;j<msg.segment_ids.length;j++){
									var data = msg.segments[j].info;
									var img_url = msg.segments[j].info.big_pic?window.location.protocol+"//"+window.location.host+"/cdms/cdms_get_pic_req.js?dnid="+mcloud_agent._create_nid()+"&dpic_key="+msg.segments[j].info.big_pic+"&"+random():"";
									var remark = msg.segments[j].remark;
									if(remark == "class"){
										html_content += "<div class='paramet_info_list_box_edit' index='"+j+"' mark='class'>"
											+"<div class='paramet_info_list_class'>"+(remark=="class"?"类别":"项目")+"</div>"
											+"<div class='paramet_info_list_title'>"+data.title+"</div>"
											+"<div class='paramet_info_list_content'>"+data.desc+"</div>"
											+"</div>";
									}
								}
								mx("#segment_page_box").innerHTML = html_content;
								mx("#segment_page").style.display = "block";
								var paramet_info_list_box_length = mx(".paramet_info_list_box_edit").length;
								for(var k=0;k<paramet_info_list_box_length;k++){
									mx(".paramet_info_list_box_edit")[k].onclick = function(){
										var index = this.getAttribute("index");
										var i_index = model_groups.indexOf(m_index);
										model_groups.remove(m_index);
										model_groups.insert(i_index,msg.segment_ids[index]);
										_this.parentNode.childNodes[0].innerHTML = msg.segments[index].info.title;
										mx("#segment_page").style.display = "none";
									}
								}
							}else{
								var html_content = "";
								for(var j=0;j<msg.segment_ids.length;j++){
									var data = msg.segments[j].info;
									var remark = msg.segments[j].remark;
									if(remark == "paramet"){
										html_content += "<div class='paramet_info_list_box_edit' index='"+j+"' mark='paramet'>"
											+"<div class='paramet_info_list_class'>"+(remark=="class"?"类别":"项目")+"</div>"
											+"<div class='paramet_info_list_title'>"+data.title+"</div>"
											+"<div class='paramet_info_list_content'>"+data.desc+"</div>"
											+"</div>";
									}
								}
								mx("#segment_page_box").innerHTML = html_content;
								mx("#segment_page").style.display = "block";
								var paramet_info_list_box_length = mx(".paramet_info_list_box_edit").length;
								for(var k=0;k<paramet_info_list_box_length;k++){
									mx(".paramet_info_list_box_edit")[k].onclick = function(){
										var index = this.getAttribute("index");
										_this.parentNode.childNodes[0].innerHTML = msg.segments[index].info.title + " : " + msg.segments[index].info.desc;
										var i_index = model_groups.indexOf(m_index);
										var di_index = model_groups_child[i_index].indexOf(d_index);
										model_groups_child[i_index].remove(d_index);
										model_groups_child[i_index].insert(di_index, msg.segment_ids[index]);
										mx("#segment_page").style.display = "none";
										console.log(i_index,di_index)
										console.log(model_groups_child[i_index])
									}
								}
							}
						}
					}
				}
				mx("#add_model_button_back").onclick = function(){
					create_parameter_page(obj);
				}
				// console.log(obj.id,model_id)

				mx("#add_model_button_submit").onclick = function(){
					var area_arr = [];
					for (var g = 0; g < 14;g++){
						if (mx(".area_select")[g].checked == true){
							area_arr.push(mx(".area_select")[g].value);
						}
					}
					mx("#load_box").style.display = "block";
					var model_data = {};
					var model_data_req = [];
					model_data.flag = 0;
					model_data.serial_id = obj.id;
					model_data.model_id = model_id;
					model_data.name = mx("#add_model_name").value;
					model_data.status = "y";
					model_data.main ="";
					model_data.filter = {status:"y",area:area_arr};

					for(var i=0;i<model_groups.length;i++){
						model_data_req[i] = {};
						model_data_req[i].filter = {status:"y",area:["zh","tw","en","ja","ko","de","fr","es","ar","pt","it","ru","us","hk"]};
						model_data_req[i].id = model_groups[i];
						model_data_req[i].segments = [];

						for(var j=0;j<model_groups_child[i].length;j++){
							model_data_req[i].segments.push({filter:{status:"y",area:["zh","tw","en","ja","ko","de","fr","es","ar","pt","it","ru","us","hk"]},id:model_groups_child[i][j]});
						}
					}
					model_data.info = model_data_req;
					console.log(model_data)
					mcloud_agent.models_set(model_data,null,function (msg,ref)
					{
						if (msg.data.result == ""){
							mx("#load_box").style.display = "none";
							mx("#add_model_button_back").click();
						}
						// mcloud_agent.serial_get({id:[obj.id],language:g_lang},null,function (msgdata,ref){
						// 	mx("#load_box").style.display = "none";
						// 	if(msgdata.result == "")
						// 	{
						// 		create_parameter_page(msgdata.cpis_serials[0]);
						// 	}
                        //
						// })
					})
				}
				del_paramet_list();
				edit_paramet_list();
			}
		}
		function set_model_price(models){
			var country_lang;
			if (g_lang == "en"){
				country_lang = "us";
			}else{
				country_lang = g_lang;
			}
			mcloud_agent.get_price({flag:0,model_key:models.id,country:country_lang},null,function (msg,ref){
				console.log(msg);
				// if(msg&&msg.result==""){
					var unit = msg.prices?msg.prices[0].unit:"";
				    var country = (msg.result=="")?msg.country:"";
					var amount = msg.prices?msg.prices[0].amount:"";
				    var original_amount = msg.prices?msg.prices[0].original_amount:"";
					mx("#admin_right").innerHTML = 
					"<div id='set_price_page'>"
						+"<div>"+models.name+"</div>"
						+"<div>地区：<input type='text' id='set_price_country' value='"+country+"'placeholder='中国：zh；美元：us'></div>"
						+"<div>货币：<input type='text' id='set_price_unit' value='"+unit+"'placeholder='人民币：￥；美元：USD'></div>"
						+"<div>原价：<input type='text' id='set_original_price_val' value='"+original_amount/100+"'></div>"
					    +"<div>优惠价：<input type='text' id='set_price_val' value='"+amount/100+"'></div>"

					+"<div><button id='set_price_submit'>确定</button> <button id='set_price_back'>返回</button></div>"
					+"</div>";
					mx("#set_price_submit").onclick = function(){
						var price_val = mx("#set_price_val").value*100;
						var price_ori_val = mx("#set_original_price_val").value*100;
						var price_unit = mx("#set_price_unit").value;
						mcloud_agent.set_price({model_key:models.id,prices:[{area:[document.getElementById('set_price_country').value],unit:price_unit,amount:price_val,original_amount:price_ori_val}]},null,function (msgs,ref){
							if(msgs&&msgs.result==""){
								create_parameter_page(obj);
							}
						})
					}
					mx("#set_price_back").onclick = function(){
						create_parameter_page(obj);
					}
				// }
			})			
		}
		function set_model_stock(models){
			mx("#admin_right").innerHTML = 
				"<div id='set_stock_page'>"
					+"<div>创建一个库：<input type='text' id='create_new_stock'><button id='create_new_stock_btn'>确定创建</button></div>"
					+"<div>库存名：<select id='warehouse'></select></div>"
					+"<div>虚拟库存：<span id='mall_num'></span></div>"
					+"<div>实际库存：<span id='real_num'></psna></div>"
					+"<div>输入数量:<input id='set_stock_num' type='text' value='0'></div>"
					+"<div><button id='in_stock'>入库</button> <button id='back_stock'>返回</button></div>"
				+"</div>";
			mcloud_agent.get_stock({flag:null,model_key:models.id},null,function (msg,ref){
				if(msg&&msg.result==""){
					var data = msg.stock_total;
					var dom_warehouse = "";
					for(var i=0;i<data.length;i++){
						dom_warehouse += "<option value='"+i+"'>"+data[i].warehouse+"</option>"
					}
					mx("#warehouse").innerHTML = dom_warehouse;
					mx("#mall_num").innerHTML = data[0].stocks[0].mall_num;
					mx("#real_num").innerHTML = data[0].stocks[0].real_num;
					mx("#warehouse").onchange = function(){
						var w_index = this.value;
						mx("#mall_num").innerHTML = data[w_index].stocks[0].mall_num;
						mx("#real_num").innerHTML = data[w_index].stocks[0].real_num;
					}
					mx("#back_stock").onclick = function(){
						create_parameter_page(obj);
					}
					mx("#in_stock").onclick = function(){
						// var num = mx("#set_stock_num").value;
						// var warehouse_name = mx("#warehouse").value;
						// mcloud_agent.set_stock({model_key:models.id,stock_total:[warehouse:warehouse_name,stocks:{product_model:"",param:"",real_num:num,mall_num:num}]},null,function (msgs.ref){
						// 	console.log(msgs)
						// })
					}
				}
			});
		}
		function set_model_buy_way(models){

			console.log(models.id);
			function add_new_page (){
				mx("#admin_right").innerHTML = "<div>"
					+"购买方式：<input id='buy_way_name' type='text'><br>"
					+"链接：<input id='buy_way_url' type='text'><br>"
					+"选择国家:<input class='add_new_way_country' type='checkbox' value='zh' style='margin-left: 10px'>中国"
					+"<input class='add_new_way_country' type='checkbox' value='tw' style='margin-left: 10px'>台湾"
					+"<input class='add_new_way_country' type='checkbox' value='en' style='margin-left: 10px'>英国"
					+"<input class='add_new_way_country' type='checkbox' value='ja' style='margin-left: 10px'>日本"
					+"<input class='add_new_way_country' type='checkbox' value='ko' style='margin-left: 10px'>韩国"
					+"<input class='add_new_way_country' type='checkbox' value='de' style='margin-left: 10px'>德国"
					+"<input class='add_new_way_country' type='checkbox' value='fr' style='margin-left: 10px'>法国"
					+"<br><input class='add_new_way_country' type='checkbox' value='es' style='margin-left: 10px'>西班牙"
					+"<input class='add_new_way_country' type='checkbox' value='ar' style='margin-left: 10px'>阿拉伯"
					+"<input class='add_new_way_country' type='checkbox' value='pt' style='margin-left: 10px'>葡萄牙"
					+"<input class='add_new_way_country' type='checkbox' value='it' style='margin-left: 10px'>意大利"
					+"<input class='add_new_way_country' type='checkbox' value='ru' style='margin-left: 10px'>俄罗斯"
					+"<input class='add_new_way_country' type='checkbox' value='us' style='margin-left: 10px'>美国<br>"
					+"<button id='ensure_add_new_way_btn'>确定</button><button id='back_buy_way_page_btn'>返回</button>"
					+ "</div>"
				document.getElementById('ensure_add_new_way_btn').onclick = function (){
					var area_arr = [];
					for (var i = 0 ;i < 13; i++){
						if (mx(".add_new_way_country")[i].checked == true){
							area_arr.push({country:mx(".add_new_way_country")[i].value,url:document.getElementById('buy_way_url').value});
						}
					}
					mcloud_agent.set_buy_way({flag:0,model_key:models.id,buy_way:[{name:document.getElementById('buy_way_name').value,area:area_arr}]}, null, function (msgp, ref) {
						console.log(msgp);
						if (msgp.result == ""){
							set_model_buy_way(models);
						}
					})
				}
				document.getElementById('back_buy_way_page_btn').onclick = function (){
					set_model_buy_way(models);
				}
			}
				mcloud_agent.get_buy_way({flag:1,model_key:models.id}, null, function (msgp, ref) {
				console.log(msgp);
					var country_arr = ["zh","tw","en","ja","ko","de","fr","es","ar","pt","it","ru","us"];
					var country_name = ["中国","台湾","英国","日本","韩国","德国","法国","西班牙","阿拉伯","葡萄牙","意大利","俄罗斯","美国"];

				if (msgp.buy_way){
					var had_set_div = ""


					for (var i = 0; i < msgp.buy_way.length;i++){
						had_set_div += "<div class='for_remove'><div class='buy_way_div_q' style='border: 1px solid lightgrey'><div class='buy_way_div'><label>购买方式：<label class='buy_way_name'>"+msgp.buy_way[i].name+"</label></label><button class='ensure_delete_the_way_btn' name = "+msgp.buy_way[i].name+" index = "+i+">删除</button>"
						for (var j = 0; j < msgp.buy_way[i].area.length; j ++){
							var url_country_select_div = "<div class='country_url_div'><br><label>国家：</label>"
								+"<select class='select"+i+"' style='width: 80px'>"
								+"<option class='zh"+i+"' value='zh'>中国</option>"
								+"<option class='tw"+i+"' value='tw'>台湾</option>"
								+"<option class='en"+i+"' value='en'>英国</option>"
								+"<option class='ja"+i+"' value='ja'>日本</option>"
								+"<option class='ko"+i+"' value='ko'>韩国</option>"
								+"<option class='de"+i+"' value='de'>德国</option>"
								+"<option class='fr"+i+"' value='fr'>法国</option>"
								+"<option class='es"+i+"' value='es'>西班牙</option>"
								+"<option class='ar"+i+"' value='ar'>阿拉伯</option>"
								+"<option class='pt"+i+"' value='pt'>葡萄牙</option>"
								+"<option class='it"+i+"' value='it'>意大利</option>"
								+"<option class='ru"+i+"' value='ru'>俄罗斯</option>"
								+"<option class='us"+i+"' value='us'>美国</option>"
                                +"<option class='hk"+i+"' value='us'>香港</option>"
								+"</select><br>"
							had_set_div += url_country_select_div
								+"链接：<input class='url"+i+"' type='text'value='"+msgp.buy_way[i].area[j].url+"'><button class='ensure_delete'>删除</button><br></div>"
						}
						had_set_div += "</div></div><button class='add_other_country_url' index = "+i+">增加其他国家链接</button><br></div>"
					}
					console.log(111)
					mx("#admin_right").innerHTML = "<div><label>设置购买方式</label><button id='reload_data'>刷新</button><br>"
						+"<div id='all_buy_way_div'>"
						+had_set_div
						+"</div>"
						+ "<button id='add_new_btn'>增加新购买方式</button><button id='ensure_set_buy_way_btn'>确定</button>"
					delete_function();
					function delete_function() {
						var length = mx(".ensure_delete").length;
						for (var b = 0; b < length; b++){
							mx(".ensure_delete")[b].onclick = function () {
								this.parentNode.style.display = "none";
							}
						}
					}
					document.getElementById('reload_data').onclick = function (){
						set_model_buy_way(models);
					}
					document.getElementById('add_new_btn').onclick = function (){
						add_new_page();
					}
					for (var l = 0; l < msgp.buy_way.length; l++){
						for (var e = 0; e < msgp.buy_way[l].area.length; e ++){
							console.log(msgp.buy_way[l].area[e].country,l,e)
							document.getElementsByClassName(msgp.buy_way[l].area[e].country+l)[e].selected = true;
						}
						document.getElementsByClassName('ensure_delete_the_way_btn')[l].onclick = function (){
							var d_name = this.getAttribute('name');
							var d_index = this.getAttribute('index');
							mcloud_agent.set_buy_way({flag:1,model_key:models.id,buy_way:[{name:d_name}]}, null, function (msgp, ref) {
								if (msgp.result == ""){
									var obj = mx(".ensure_delete_the_way_btn")[d_index].parentNode.parentNode.parentNode;
									obj.style.display = "none";
								}
							})
						}

						document.getElementsByClassName('add_other_country_url')[l].onclick = function (){
							var b_index = this.getAttribute('index');
							var url_country_select_div = "<div class='country_url_div'><br><label>国家：</label>"
								+"<select class='select"+b_index+"' style='width: 80px'>"
								+"<option class='zh"+b_index+"' value='zh'>中国</option>"
								+"<option class='tw"+b_index+"' value='tw'>台湾</option>"
								+"<option class='en"+b_index+"' value='en'>英国</option>"
								+"<option class='ja"+b_index+"' value='ja'>日本</option>"
								+"<option class='ko"+b_index+"' value='ko'>韩国</option>"
								+"<option class='de"+b_index+"' value='de'>德国</option>"
								+"<option class='fr"+b_index+"' value='fr'>法国</option>"
								+"<option class='es"+b_index+"' value='es'>西班牙</option>"
								+"<option class='ar"+b_index+"' value='ar'>阿拉伯</option>"
								+"<option class='pt"+b_index+"' value='pt'>葡萄牙</option>"
								+"<option class='it"+b_index+"' value='it'>意大利</option>"
								+"<option class='ru"+b_index+"' value='ru'>俄罗斯</option>"
								+"<option class='us"+b_index+"' value='us'>美国</option>"
								+"</select><br>"
							var input_url_div = "链接：<input class='url"+b_index+"' type='text'><button class='ensure_delete'>删除</button><br></div>"

							jQuery(".buy_way_div_q").eq(b_index).append(url_country_select_div+input_url_div);
							delete_function();
						}
					}
                    document.getElementById('ensure_set_buy_way_btn').onclick = function () {
                    	var name_arr = [];

						var buy_way_arr = [];
                    	for (var n = 0 ;n < mx(".buy_way_div").length; n++){
							// name_arr.push(mx(".buy_way_name").innerHTML);
							var area_arr = [];
							for (var m = 0; m < mx(".select"+n).length; m++){
								if (mx(".select"+n)[m].parentNode.parentNode.parentNode.parentNode.style.display != "none"&&mx(".select"+n)[m].parentNode.style.display != "none"){
									area_arr.push({country:mx(".select"+n)[m].value,url:mx(".url"+n)[m].value});
								}
							}
							if (mx(".buy_way_name")[n].parentNode.parentNode.parentNode.parentNode.style.display != "none"){
								if (area_arr.length != 0){
									buy_way_arr.push({name:mx(".buy_way_name")[n].innerHTML,area:area_arr})
								}
							}
						}
						console.log(buy_way_arr);
						// mcloud_agent.set_buy_way({flag:0,model_key:models.id,buy_way:buy_way_arr}, null, function (msgp, ref) {
						// 	if (msgp.result == ""){
						// 		alert("设置成功");
						// 	}
						// })
					}
				}
				else if (msgp.result == "buy way list does not exist!"){
					var add_way_div = "<div class='buy_way_div'>"
							+"购买方式：<input class='buy_way_name' type='text'><br>"
							+"链接：<input class='buy_way_url' type='text'><br>"
							+"选择国家:"
						+ "</div>"
					mx("#admin_right").innerHTML = "<div><label>设置购买方式</label><button id='reload_data'>刷新</button><br>"
						+"<button id='add_new_button'>新增购买方式</button>"
						+ "</div>"
					document.getElementById('reload_data').onclick = function (){
						set_model_buy_way(models);
					}
					document.getElementById('add_new_button').onclick = function (){
						add_new_page();
					}
				}
			})
		}
		mx("#back_shop_btn").onclick = function ()
		{
			create_shop_page();
		}
		mx("#display_shop_btn").onclick = function ()
		{
			if(display_shop_btn == 0)
			{
				display_shop_btn = 1;
				this.innerHTML = "隐藏产品";
				mx("#series_list_box").style.display = "block";
			}
			else if(display_shop_btn == 1)
			{
				display_shop_btn = 0;
				this.innerHTML = "显示产品";
				mx("#series_list_box").style.display = "none";
			}
		}
		mx("#add_new_shop_btn").onclick = function ()
		{
			var add_model_data = l_data?(l_data.models?l_data.models[0]:""):"";
			console.log(add_model_data);
			set_model_parameter(add_model_data,"create");
		}
		var length = mx(".series_list").length;
		for (var i=0;i<length;i++)
		{
			mx(".shop_parameter_show")[i].onclick = function ()
			{
				var index = this.getAttribute("index");
				get_shop_parameter (l_data.models[index]);

			}
			mx(".shop_parameter_edit")[i].onclick = function ()
			{
				var index = this.getAttribute("index");
				set_model_parameter(l_data.models[index]);
			}
			mx(".shop_parameter_price")[i].onclick = function ()
			{
				var index = this.getAttribute("index");
				set_model_price(l_data.models[index]);
			}
			var mark_num1 = 0;
			mx(".shop_parameter_status")[i].onclick = function ()
			{
				var index = this.getAttribute("index");
				// console.log(l_data.models[index])
				set_model_buy_way(l_data.models[index]);
			}
			mx(".shop_parameter_stock")[i].onclick = function ()
			{
				var index = this.getAttribute("index");
				set_model_stock(l_data.models[index]);
			}
			mx(".shop_parameter_delect")[i].onclick = function ()
			{
				var _this = this;
				var index = this.getAttribute("index");
				mx("#admin_del_box").style.display = "block";
				mx("#admin_del_ok").onclick = function ()
				{
					mx("#admin_del_box").style.display = "none";
					console.log(l_data.models[index].id)
					mcloud_agent.models_set({flag:1,serial_id:obj.id,model_id:l_data.models[index].id},null,function (msg,ref){
						if(msg.data.result == "")
						{
							_this.parentNode.style.display = "none";
						}
					})
				}
				mx("#admin_del_cancel").onclick = function ()
				{
					mx("#admin_del_box").style.display = "none";
					return;
				}				
			}
		}
	}
	add_parameter_event();
	function get_shop_parameter (data)
	{
		console.log(data)
		var mark_card = 0;
		var stock_id;
		mcloud_agent.get_type_list({flag:2,start:0,counts:20,type:"card",language:"zh"}, null, function (msgp, ref) {
			console.log(msgp);
			for (var i = 0; i < msgp.cpis_type[0].cpis_serials.length; i++){
				for (var j = 0; j < msgp.cpis_type[0].cpis_serials[i].models.length; j++){
					if (msgp.cpis_type[0].cpis_serials[i].models[j] == data.id){
						mark_card = 1;
						console.log(mark_card)
						break;
					}
				}
			}
			function some_func() {
				mx("#admin_right").innerHTML = "<div>"
					+"<label style='display: "+((mark_card==1)?("none"):(""))+"'>虚拟库存：0</label>"
					+"<br><label style='display: "+((mark_card==1)?("none"):(""))+"'>真实库存：0</label>"
					+"<div style='display: "+((mark_card==1)?("none"):(""))+"'>增加虚拟库存<input id='mall_num' type='text' ></div>"
					+"<div style='display: "+((mark_card==1)?("none"):(""))+"'>增加真实库存<input id='real_num' type='text'></div>"
					+"<div style='display: "+((mark_card==1)?(""):("none"))+"'>输入激活码<input id='card_name' type='text'></div>"
					+"<br>"
					+"<br><button id='ensure_set_stock'>确定</button><button id='look_card_id'>查看激活码库存</button>"
					+"</div>"
				function look_list(mark_flag){
					mcloud_agent.check_virtual_product({flag: mark_flag, stock_id: stock_id, start: 0, counts: 20}, null, function (msg, ref) {
						console.log(msg)
						if (msg.result == ""){
							var content = "";
							for (var i = 0; i < msg.products.length; i++){
								content += "<label>"+msg.products[i].name+"</label><br>"
							}
							document.getElementById('card_list').innerHTML = content
						}
					})
				}
				document.getElementById('look_card_id').onclick = function () {
					mx("#admin_right").innerHTML = "<div>"
						+"<div><button id='look_all'>查看总表</button><button id='look_can'>查看可用</button></div>"
						+ "<div id='card_list' style='margin-left: 20px'></div>"
						+ "<button id='back_stock'>返回</button>"
						+ "</div>"
					var mark_flag;
					document.getElementById('look_all').onclick = function (){
						mark_flag = 1;
						look_list(mark_flag);
					}
					document.getElementById('look_can').onclick = function (){
						mark_flag = 2;
						look_list(mark_flag);
					}
					document.getElementById('back_stock').onclick = function () {
						get_shop_parameter(data);
					}
					document.getElementById('look_can').click();
				}
				document.getElementById('ensure_set_stock').onclick= function (){
					if (mark_card == 1){
						mcloud_agent.set_stock({flag:1,model_key:data.id,stock_total:[{warehouse:"China",stocks:[{param:["白色"],type:"fictitious",products:[{name:document.getElementById('card_name').value,value:""}]}]}]}, null, function (msg, ref){
							if (msg.result == ""){
								alert("添加成功")
								// mx("#admin_left_menu_shop").click();
							}
						})
					}else{
						mcloud_agent.set_stock({model_key:data.id,stock_total:[{warehouse:"China",stocks:[{param:["白色"],real_num:document.getElementById('real_num').value,mall_num:document.getElementById('mall_num').value}]}]}, null, function (msg, ref){
							if (msg.result == ""){
								alert("添加成功")
								// mx("#admin_left_menu_shop").click();
							}
						})
					}
				}
			}
			mcloud_agent.get_stock({flag:0,model_key:data.id}, null, function (msgs, ref){
				console.log(msgs)
				if (msgs.result == ""){
					stock_id = msgs.stock_total[0].stocks[0].product_key;
					some_func()
				}else{
					some_func()
				}
			})
		})
		// table_content = "<tr><th></th><th>"+data.name+"</th><th id='price_th'></th></tr>";
		// var length = data&&data.model.info.groups?data.model.info.groups.length:0;
		// for(var i=0;i<length;i++)
		// {
		// 	var groups = data.model.info.groups[i];
		// 	var info_length = groups.segments?groups.segments.length:0;
		//
		//
		// 	for(var j=0;j<info_length;j++)
		// 	{
		// 		table_content +="<tr>";
		// 		if(j==0)
		// 		{
		// 			table_content +="<td class='first_td parameter_td' flag='1' rowspan='"+info_length+"'>"+groups.title.info.title+"</td>";
		// 		}
		// 		table_content +="<td class='second_td parameter_td' flag='1' r='"+j+"'>"+groups.segments[j].info.title+"</td>"
		// 						+"<td class='third_td parameter_td' flag='1' r='"+j+"'>"+groups.segments[j].info.desc+"</td>";
		// 		table_content +="</tr>";
		// 	}
		// }
		// table_content += "</table>";
		// mx("#admin_right_parameter_table").innerHTML = table_content;
		// mcloud_agent.get_price({flag:null,model_key:data.id},null,function (msg,ref){
		// 	if(msg&&msg.result==""){
		// 		mx("#price_th").innerHTML += "单价：<span style='color:#f00;'>"+msg.prices[0].unit+msg.prices[0].original_amount+"</span>";
		// 	}
		// });
	}
}
function create_info_page(obj)
{
	mcloud_agent.models_get({serial_id:obj.id,models:[],language:[g_lang]},null,function (model_msg,model_ref){
		console.log(model_msg)
		var model_msg_id = "";
		var html_content = "";
		var groups_data = [];
		// if(model_msg.serials&&model_msg.serials[0]&&model_msg.serials[0].serial.main.groups[0]&&model_msg.serials[0].serial.main.groups[0].title.id){
		if(model_msg.serials&&model_msg.serials[0]&&model_msg.serials[0].serial.main.groups){
			model_msg_id = model_msg.serials[0].serial.main.groups[0].title.id;
		}
		mx("#admin_right").innerHTML ="<div style='width: 43%;text-align: center;display: inline-block;font-size: 22px;position: fixed;float: left;top: 0%;left: 12.2%;color: white'>电脑版</div>"
			+"<div style='width: 20%;text-align: center;display: inline-block;font-size: 22px;position: fixed;float: right;top: 0%;right: 15%;color: white'>手机版</div>"
			    +"<div id='prv_info_box'>"
			    +"<div id='prv_info_main' style='display: inline-block;width: 50%'></div>"
				+"<div id='mobile_info_main'style='display: inline-block;width: 50%;float: right;background-color: white'></div>"
				+"<div id='add_info'>添加</div>"
				+"<div><button id='main_set_submit'>确定</button> <button id='main_set_back'>返回</button></div>"
			+"<div>";
		mx("#segment_page_box").style.width = "50%";
		mx("#segment_page").style.display="block";
		//如果有东西就显示
		if(model_msg&&model_msg.result==""&&model_msg.serials[0].serial.main.groups){
			var model_data = model_msg.serials[0].serial.main.groups[0];
			var model_data_segments_length = model_data.segments?model_data.segments.length:0;
			console.log(model_data)
			//PC展示
			for(var i=0;i<model_data_segments_length;i++){

				var mod_data = model_data.segments[i].info;
				var mod_id = model_data.segments[i].id;
				var mod_remark = model_data.segments[i].remark;
				console.log(mod_data.css)
				var mod_height = mod_data.css?"height:"+(mx("#prv_info_box").offsetWidth*mod_data.css)/2 + "px;":"";
				var mod_img_url = mod_data.big_pic?window.location.protocol+"//"+window.location.host+"/cdms/cdms_get_pic_req.js?dnid="+mcloud_agent._create_nid()+"&dpic_key="+mod_data.big_pic+"&"+random():"";
				mx("#prv_info_main").innerHTML += "<div id='pc"+mod_id+"' class='preview_segment_dom "+mod_data.link+"' style='"+(mod_remark=="in"?mod_height+"background-image:url("+mod_img_url+");":"")+"'>"
					+"<label style='color: red'>"+mod_id+"</label>"

					+"<div index='"+mod_id+"' class='paragraph_del'>&times;</div>"
					// +"<div index='"+mod_id+"' class='paragraph_edit'>修改</div>"
					+"<div class='paragraph_title'>"+mod_data.title+"</div>"
					+"<div class='paragraph_content'>"+mod_data.desc+"</div>"
					+"<img class='paragraph_img' "+(mod_remark=="out"?"src='"+mod_img_url+"'":"")+">"
				+"</div>";
				groups_data.push(mod_id);
			}
			//手机展示
			for(var i=0;i<model_data_segments_length;i++){

				var mod_data = model_data.segments[i].info;
				var mod_id = model_data.segments[i].id;

				var mod_img_url1 = mod_data.small_pic?window.location.protocol+"//"+window.location.host+"/cdms/cdms_get_pic_req.js?dnid="+mcloud_agent._create_nid()+"&dpic_key="+mod_data.small_pic+"&"+random():"";

				mx("#mobile_info_main").innerHTML += "<div id='phone"+mod_id+"' class='preview_segment_dom'>"
					+"<div index='"+mod_id+"' class='paragraph_del'>&times;</div>"
					+"<label style='color: red'>"+mod_id+"</label>"
					// +"<div index='"+mod_id+"' class='paragraph_edit'>修改</div>"
					// +"<div class='paragraph_title'>"+mod_data.title+"</div>"
					// +"<div class='paragraph_content'>"+mod_data.desc+"</div>"
					+"<img class='paragraph_img' src='"+mod_img_url1+"' style='width: 100%'>"
					+"</div>";

				// groups_data.push(mod_id);
			}
			paragraph_del();
		}
		//获取所有的详情资源
		console.log(g_lang)
		mcloud_agent.segment_get({start:0,counts:1000,language:[g_lang],segment_name:"_vimtag_segment_main_info_"},null,function (msg,ref){
			console.log(msg);
			for(var i=0;i<msg.segment_ids.length;i++){
				var data = msg.segments[i].info;
				var height = data.css?"height:"+(mx("#segment_page_box").offsetWidth*data.css) + "px;":"";
				var img_url = msg.segments[i].info.big_pic?window.location.protocol+"//"+window.location.host+"/cdms/cdms_get_pic_req.js?dnid="+mcloud_agent._create_nid()+"&dpic_key="+msg.segments[i].info.big_pic+"&"+random():"";
				var small_img_url = msg.segments[i].info.big_pic?window.location.protocol+"//"+window.location.host+"/cdms/cdms_get_pic_req.js?dnid="+mcloud_agent._create_nid()+"&dpic_key="+msg.segments[i].info.small_pic+"&"+random():"";
				var remark = msg.segments[i].remark;
				html_content += "<div index='"+i+"' class='preview_segment_box_index "+data.link+"' style='"+(remark=="in"?height+"background-image:url("+img_url+");":"")+"overflow: hidden'>"
					+"<label style='color: red;'>"+msg.segment_ids[i]+"</label>"
					+"<div class='paragraph_title m_paragraph_title'>"+(msg.segments[i].langs&&msg.segments[i].langs[0].title?msg.segments[i].langs[0].title:msg.segments[i].info.title)+"</div>"
					+"<div class='paragraph_content  m_paragraph_content'>"+(msg.segments[i].langs&&msg.segments[i].langs[0].desc?msg.segments[i].langs[0].desc:msg.segments[i].info.desc)+"</div>"
					+"<img class='paragraph_img' "+(remark=="out"?"src='"+img_url+"'":"")+" style='float: right'>"

					+"</div>"

			}
			segment_page_box_head = "<label>选择下列模块进行添加</label>"
			mx("#segment_page_box").innerHTML = segment_page_box_head+html_content;
			for(var j=0;j<msg.segment_ids.length;j++){
				//点击添加
				mx(".preview_segment_box_index")[j].onclick = function(){

					mx("#segment_page").style.display="none";
					var index = this.getAttribute("index");
					groups_data.push(msg.segment_ids[index])
					var select_data = msg.segments[index].info;
					var select_height = select_data.css?"height:"+(mx("#prv_info_box").offsetWidth*select_data.css) + "px;":"";
					var select_img_url = select_data.big_pic?window.location.protocol+"//"+window.location.host+"/cdms/cdms_get_pic_req.js?dnid="+mcloud_agent._create_nid()+"&dpic_key="+select_data.big_pic+"&"+random():"";
					var select_remark = msg.segments[index].remark;
					mx("#prv_info_main").innerHTML += "<div id='pc"+msg.segment_ids[index]+"' class='preview_segment_dom "+select_data.link+"' style='"+(select_remark=="in"?select_height+"background-image:url("+select_img_url+");":"")+"'>"
					+"<div index='"+msg.segment_ids[index]+"' class='paragraph_del'>&times;</div>"
					// +"<div index='"+msg.segment_ids[index]+"' class='paragraph_edit'>修改</div>"
					+"<div class='paragraph_title'>"+(msg.segments[index].langs&&msg.segments[index].langs[0].title?msg.segments[index].langs[0].title:msg.segments[index].info.title)+"</div>"
					+"<div class='paragraph_content'>"+(msg.segments[index].langs&&msg.segments[index].langs[0].desc?msg.segments[index].langs[0].desc:msg.segments[index].info.desc)+"</div>"
					+"<img class='paragraph_img' "+(select_remark=="out"?"src='"+select_img_url+"'":"")+">"
				+"</div>"

					var mod_img_url1 = select_data.small_pic?window.location.protocol+"//"+window.location.host+"/cdms/cdms_get_pic_req.js?dnid="+mcloud_agent._create_nid()+"&dpic_key="+select_data.small_pic+"&"+random():"";

					mx("#mobile_info_main").innerHTML += "<div id='phone"+msg.segment_ids[index]+"' class='preview_segment_dom'>"
						+"<div index='"+msg.segment_ids[index]+"' class='paragraph_del'>&times;</div>"
						// +"<div index='"+mod_id+"' class='paragraph_edit'>修改</div>"
						+"<div class='paragraph_title'>"+(msg.segments[index].langs&&msg.segments[index].langs[0].title?msg.segments[index].langs[0].title:msg.segments[index].info.title)+"</div>"
						+"<div class='paragraph_content'>"+(msg.segments[index].langs&&msg.segments[index].langs[0].desc?msg.segments[index].langs[0].desc:msg.segments[index].info.desc)+"</div>"
						+"<img class='paragraph_img' src='"+mod_img_url1+"' width='100%'>"
						+"</div>";
				paragraph_del();
				}
			}
		})
		function paragraph_del(){
			var length = mx(".paragraph_del").length;
			var edit_length = mx(".paragraph_edit").length;
			for(var k=0;k<length;k++){
				mx(".paragraph_del")[k].onclick = function(){
					var index = this.getAttribute("index");
                    document.getElementById('pc'+index).style.display = "none";
					document.getElementById('phone'+index).style.display = "none";
					this.parentNode.style.display = "none";
					groups_data.remove(index);
				}
			}
		}
		mx("#add_info").onclick = function(){
			mx("#segment_page").style.display="block";
		}
		mx("#main_set_back").onclick = function(){
			create_shop_page();
		}
		mx("#main_set_submit").onclick = function(){
			var groups_data_req = [];
			for(var i=0;i<groups_data.length;i++){
				groups_data_req.push({id:groups_data[i],filter:{status:"y",area:["zh","tw","en","ja","ko","de","fr","es","ar","pt","it","ru","us"]}})
			}
			var segment_req = new Object();
			segment_req.flag = "0";
			segment_req.segment = new Object();
			segment_req.segment.name = "";
			segment_req.id = "";
			segment_req.segment.remark = "";
			segment_req.segment.short_name = "";
			segment_req.segment.info = new Object();
			segment_req.segment.info.title = "";
			segment_req.segment.info.desc = "";
			segment_req.segment.info.big_pic = "";
			segment_req.segment.info.small_pic = "";
			segment_req.segment.info.video = "";
			segment_req.segment.info.link = "";
			segment_req.segment.info.language = g_lang;
			segment_req.segment.info.css = "";
			segment_req.segment.langs = [segment_req.segment.info];
			mcloud_agent.segment_set(segment_req,null,function (msg,ref){
				console.log(segment_req,msg);
				var l_model_req = new Object();
				l_model_req.flag = "0";
				l_model_req.serial_id = obj.id;
				l_model_req.model_id = "default";
				l_model_req.name = "";
				l_model_req.filter = {status:"y",area:["zh","tw","en","ja","ko","de","fr","es","ar","pt","it","ru","us"]};
				l_model_req.info = {};
				l_model_req.main = [];
				l_model_req.main[0] = new Object();
				l_model_req.main[0].filter = {status:"y",area:["zh","tw","en","ja","ko","de","fr","es","ar","pt","it","ru","us"]};
				l_model_req.main[0].segments = groups_data_req;
				l_model_req.main[0].id = msg.segment_id;
				console.log(l_model_req);
				mcloud_agent.models_set(l_model_req,null,function (msg,ref){
					modify_shop();
				})
			})
			
		}
	})
}
function create_shop_page()
{
	var l_serials_data;
	var l_serials_html = "";
	var length;
	mx("#admin_right").innerHTML = 
	"<div id='admin_right_shop'>"		
	+"</div>"
	+"<div id='add_shop_button_box'>"
		+"<button id='add_shop_button'>添加产品</button>"
        +"<button id='set_product_type'>设置产品类型</button>"
	+"</div>";
	mcloud_agent.list_get({sign:getParam('sign'),start:0,counts:128,language:g_lang},null,function (msg){
		console.log(msg)
		if(msg.result == "" && msg.cpis_serials)
		{
			console.log(msg)
			l_serials_data = msg.cpis_serials;
			length = l_serials_data.length;
			l_serials_html = 
			"<table id='admin_right_shop_table'>"
			+"<tr>"
				+"<th>图片</th>"
				+"<th>名称</th>"
			    // +"<th>状态</th>"
				+"<th>修改</th>"
				+"<th>详情</th>"
				+"<th>参数</th>"
				// +"<th>视频</th>"
				+"<th>删除</th>"
			+"</tr>";
			for (var i=0;i<length;i++)
			{
				l_serials_html +=
				"<tr index='"+i+"'>"
					+"<td class='td_click'><img src='"+window.location.protocol+"//"+window.location.host+"/cdms/cdms_get_pic_req.js?dnid="+mcloud_agent._create_nid()+"&dpic_key="+l_serials_data[i].summery.info.big_pic+"&"+random()+"' style='width:50px;'></td>"
					+"<td>"+l_serials_data[i].summery.info.title+"</td>"
				    // +"<td class='td_click td_show_or_hide' >"+(l_serials_data[i].filter.status == "y"?"已上架":"已下架")+"</td>"
					+"<td class='td_click td_edit' >修改</td>"
					+"<td class='td_click td_description'>查看</td>"
					+"<td class='td_click td_parameter'>查看</td>"
					// +"<td class='td_click td_video'>上传</td>"
					+"<td class='td_click td_delete'>删除</td>"
				+"</tr>"
			}
			l_serials_html +="</table>";
			mx("#admin_right_shop").innerHTML = l_serials_html;
			on_event()
		}
	})
	function on_event()
	{
		for(var j=0;j<length;j++)
		{
			mx(".td_edit")[j].onclick = function ()
			{
				var _this_index = this.parentNode.getAttribute("index");
				set_serial(l_serials_data[_this_index]);
			}
			mx(".td_description")[j].onclick = function ()
			{
				var _this_index = this.parentNode.getAttribute("index");
				create_info_page(l_serials_data[_this_index]);
			}
			// var mark_num2 = 0;
			// mx(".td_show_or_hide")[j].onclick = function ()
			// {
			// 	var _this_index = this.parentNode.getAttribute("index");
			// 	if (mark_num2 == 0){
			// 		mark_y_or_n = l_serials_data[_this_index].filter.status;
			// 	}
			// 	var data_id = l_serials_data[_this_index].id;
			// 	var data_name = l_serials_data[_this_index].name;
			// 	var segment_id = l_serials_data[_this_index].summery.id;
			// 	if (mark_y_or_n == "y"){
			// 		mark_y_or_n = "n";
			// 	}else {
			// 		mark_y_or_n = "y";
			// 	}
			// 	var area_arr = l_serials_data[_this_index].filter.area;
			// 	mcloud_agent.serial_set({id:data_id,name:data_name,flag:0,summery:segment_id,status:mark_y_or_n,area:area_arr},null,function (msgs,refs)
			// 	{
			// 		if (msgs.result == ""){
			// 			if (mark_y_or_n == "y"){
			// 				document.getElementsByClassName('td_show_or_hide')[_this_index].innerHTML = "已上架"
			// 			}else {
			// 				document.getElementsByClassName('td_show_or_hide')[_this_index].innerHTML = "已下架"
			// 			}
			// 		}
			// 	})
			// }
			mx(".td_parameter")[j].onclick = function ()
			{
				var _this_index = this.parentNode.getAttribute("index");
				console.log(l_serials_data[_this_index]);

				create_parameter_page(l_serials_data[_this_index]);
			}
			mx(".td_delete")[j].onclick = function ()
			{	
				var _this = this; 			
				var _this_index = this.parentNode.getAttribute("index");
				mx("#admin_del_box").style.display = "block";
				mx("#admin_del_ok").onclick = function ()
				{
					mx("#admin_del_box").style.display = "none";
					console.log(l_serials_data[_this_index].id);
					mcloud_agent.serial_set({sign:getParam('sign'),flag:1,id:l_serials_data[_this_index].id},null,function (msg){
						if(msg.result == "")
						{
							_this.parentNode.style.display = "none";
						}					
					})
				}
				mx("#admin_del_cancel").onclick = function ()
				{
					mx("#admin_del_box").style.display = "none";
					return;
				}				
			}
		}
	}
	function set_type(serial_id_arr) {
        mcloud_agent.get_type_list({sign:getParam('sign'),flag:0,start:0,counts:20,language:"zh"}, null, function (msgp, ref) {
            console.log(msgp);

            var serial_id_name_div = "";
            for (var i = 0; i < serial_id_arr.length; i++){
                serial_id_name_div += "<div class='id_name_div' i_index='"+serial_id_arr[i].id+"' n_index='"+serial_id_arr[i].name+"'><label>id:"+serial_id_arr[i].id+"</label>"
                    +"<label>缩写:"+serial_id_arr[i].name+"</label><br></div>"

            }
            mx("#admin_right").innerHTML = "<div>设置产品分类</div>"
                +"<div id='ipc' style='border: 1px lightgrey solid'><label>云摄像头</label><input class='radio_btn' type='radio' name ='aaa'><br>"
                +"<div id='ipc_id'></div>"
                +"</div>"
                +"<div id='parts' style='border: 1px lightgrey solid'><label>配件</label><input class='radio_btn' type='radio'name ='aaa'><br>"
                +"<div id='parts_id'></div>"
                +"</div>"
                +"<div id='box' style='border: 1px lightgrey solid'><label>盒子</label><input class='radio_btn' type='radio'name ='aaa'><br>"
                +"<div id='box_id'></div>"
                +"</div>"
                +"<div id='pet' style='border: 1px lightgrey solid'><label>宠物用品</label><input class='radio_btn' type='radio'name ='aaa'><br>"
                +"<div id='pet_id'></div>"
                +"</div>"
				+"<div id='test' style='border: 1px lightgrey solid'><label>测试</label><input class='radio_btn' type='radio'name ='aaa'><br>"
				+"<div id='test_id'></div>"
				+"</div>"
				+"<div id='card' style='border: 1px lightgrey solid'><label>充值卡</label><input class='radio_btn' type='radio'name ='aaa'><br>"
				+"<div id='card_id'></div>"
				+"</div>"
                +"<button id='ensure_set_type_btn'>确定</button>"
                +"<div style='top: 50px;float: right;height: 350px;width: 300px;position: fixed;z-index: 99999;right: 20%;background-color: white;overflow: scroll'>"
                +"<div id='serial_type_title' style='width: 100%;text-align: center'></div>"
                +serial_id_name_div
                + "</div>"
            var mark_select;
            for (var o = 0; o < mx('.radio_btn').length; o++){
                mx('.radio_btn')[o].onclick = function (){
                    mark_select = this.parentNode.id;
                }
            }
            mx('.radio_btn')[0].click();
            for (var y = 0; y < mx('.id_name_div').length; y++){
                mx('.id_name_div')[y].onclick = function (){
                    var id = this.getAttribute('i_index');
                    $("#"+mark_select+"_id").append("<div class='"+mark_select+"_s_id' index='"+this.getAttribute('i_index')+"'>缩写:"+this.getAttribute('n_index')+"<button class='delete_btn'>删除</button></div>");
                    for (var q = 0; q < mx('.delete_btn').length; q++){
                        mx('.delete_btn')[q].onclick = function (){
                            this.parentNode.style.display = "none";
                        }
                    }
                }
            }
            if (msgp.result == ""&&msgp.cpis_type){
                var type_var;
                var seriad_var;
                for (var u = 0; u < msgp.cpis_type.length; u++){
                    type_var = msgp.cpis_type[u].type;
                    if (type_var == "ipc"&&msgp.cpis_type[u].cpis_serials){
                        for (var h = 0; h < msgp.cpis_type[u].cpis_serials.length; h++){
                            seriad_var = msgp.cpis_type[u].cpis_serials[h]
                            $("#"+type_var).append("<div class='"+type_var+"_s_id' index='"+seriad_var.id+"'>缩写:"+seriad_var.summery.short_name+"<button class='delete_btn'>删除</button></div>");
                        }
                    }
                    if (type_var == "box"&&msgp.cpis_type[u].cpis_serials){
                        for (var h = 0; h < msgp.cpis_type[u].cpis_serials.length; h++){
                            seriad_var = msgp.cpis_type[u].cpis_serials[h]
                            $("#"+type_var).append("<div class='"+type_var+"_s_id' index='"+seriad_var.id+"'>缩写:"+seriad_var.summery.short_name+"<button class='delete_btn'>删除</button></div>");
                        }
                    }
                    if (type_var == "pet"&&msgp.cpis_type[u].cpis_serials){
                        for (var h = 0; h < msgp.cpis_type[u].cpis_serials.length; h++){
                            seriad_var = msgp.cpis_type[u].cpis_serials[h]
                            $("#"+type_var).append("<div class='"+type_var+"_s_id' index='"+seriad_var.id+"'>缩写:"+seriad_var.summery.short_name+"<button class='delete_btn'>删除</button></div>");
                        }
                    }
                    if (type_var == "parts"&&msgp.cpis_type[u].cpis_serials){
                        for (var h = 0; h < msgp.cpis_type[u].cpis_serials.length; h++){
                            seriad_var = msgp.cpis_type[u].cpis_serials[h]
                            $("#"+type_var).append("<div class='"+type_var+"_s_id' index='"+seriad_var.id+"'>缩写:"+seriad_var.summery.short_name+"<button class='delete_btn'>删除</button></div>");
                        }
                    }
					if (type_var == "test"&&msgp.cpis_type[u].cpis_serials){
						for (var h = 0; h < msgp.cpis_type[u].cpis_serials.length; h++){
							seriad_var = msgp.cpis_type[u].cpis_serials[h]
							$("#"+type_var).append("<div class='"+type_var+"_s_id' index='"+seriad_var.id+"'>缩写:"+seriad_var.summery.short_name+"<button class='delete_btn'>删除</button></div>");
						}
					}
					if (type_var == "card"&&msgp.cpis_type[u].cpis_serials){
						for (var h = 0; h < msgp.cpis_type[u].cpis_serials.length; h++){
							seriad_var = msgp.cpis_type[u].cpis_serials[h]
							$("#"+type_var).append("<div class='"+type_var+"_s_id' index='"+seriad_var.id+"'>缩写:"+seriad_var.summery.short_name+"<button class='delete_btn'>删除</button></div>");
						}
					}
                }
                for (var q = 0; q < mx('.delete_btn').length; q++){
                    mx('.delete_btn')[q].onclick = function (){
                        this.parentNode.style.display = "none";
                    }
                }
            }
            mx("#ensure_set_type_btn").onclick = function (){
                var ipc_serial_arr = [];
                var parts_serial_arr = [];
                var box_serial_arr = [];
                var pet_serial_arr = [];
				var test_serial_arr = [];
				var card_serial_arr = [];
                console.log()
                for (var i = 0; i < mx('.ipc_s_id').length; i++){
                    if (mx('.ipc_s_id')[i].style.display!="none"){
                        ipc_serial_arr.push(mx('.ipc_s_id')[i].getAttribute('index'));
                    }
                }
                for (var i = 0; i < mx('.parts_s_id').length; i++){
                    if (mx('.parts_s_id')[i].style.display!="none"){
                        parts_serial_arr.push(mx('.parts_s_id')[i].getAttribute('index'));
                    }
                }
                for (var i = 0; i < mx('.box_s_id').length; i++){
                    if (mx('.box_s_id')[i].style.display!="none"){
                        box_serial_arr.push(mx('.box_s_id')[i].getAttribute('index'));
                    }
                }
                for (var i = 0; i < mx('.pet_s_id').length; i++){
                    if (mx('.pet_s_id')[i].style.display!="none"){
                        pet_serial_arr.push(mx('.pet_s_id')[i].getAttribute('index'));
                    }
                }
				for (var i = 0; i < mx('.test_s_id').length; i++){
					if (mx('.test_s_id')[i].style.display!="none"){
						test_serial_arr.push(mx('.test_s_id')[i].getAttribute('index'));
					}
				}
				for (var i = 0; i < mx('.card_s_id').length; i++){
					if (mx('.card_s_id')[i].style.display!="none"){
						card_serial_arr.push(mx('.card_s_id')[i].getAttribute('index'));
					}
				}
                var all_serial_arr = [{type:"ipc",serial_id:ipc_serial_arr},{type:"parts",serial_id:parts_serial_arr},{type:"box",serial_id:box_serial_arr},{type:"pet",serial_id:pet_serial_arr},{type:"test",serial_id:test_serial_arr},{type:"card",serial_id:card_serial_arr}];
                console.log(all_serial_arr);
                mcloud_agent.serials_type({sign:getParam('sign'),flag:1,serial_type:all_serial_arr}, null, function (msgp, ref) {
                    console.log(msgp);
					mx("#admin_left_menu_shop").click();
                })
            }
        })
    }
	function set_serial(serial)
	{
		var serial_name = "",
			serial_short = "",
			serial_desc = "",
			serial_img = "";
		var img_url;
		if(serial)
		{
			serial_name = serial.summery.info.title?serial.summery.info.title:"";
			serial_short = serial.summery.short_name?serial.summery.short_name:"";
			serial_desc = serial.summery.info.desc?serial.summery.info.desc:"";
			serial_img = serial.summery.info.big_pic?""+window.location.protocol+"//"+window.location.host+"/cdms/cdms_get_pic_req.js?dnid="+mcloud_agent._create_nid()+"&dpic_key="+serial.summery.info.big_pic+"&"+random():"";
		}		
		mx("#admin_right").innerHTML = 
			"<div id='add_serial_name'>*名称：<input type='text' id='input_serial_name' value='"+serial_name+"'></div>"
			+"<div id='add_serial_short_name'>*简称：<input type='text' id='input_serial_shrot_name' value='"+serial_short+"'></div>"
			+"<div id='add_serial_desc'>描述：<input type='text' id='input_serial_desc' value='"+serial_desc+"'></div>"
			+"<div id='add_serial_b_pic'>图片：<input type='file' id='serial_file_pic'><img src='"+serial_img+"' id='serial_pre_img' style='width:100px;'></div>"
			+"<div><input id='all_country' type='checkbox' value='全部地区' name='全部地区'/>全部地区"
            +"<br><input id='zh' class='area_select' type='checkbox' value='zh' name='中国'/>中国"
		    +"<input id='tw' class='area_select' type='checkbox' value='tw' name='台湾' style='margin-left: 20px'/>台湾"
		    +"<br><input id='en' class='area_select' type='checkbox' value='en' name='英国'/>英国"
		    +"<input id='ja' class='area_select' type='checkbox' value='ja' name='日本' style='margin-left: 20px'/>日本"
		    +"<br><input id='ko' class='area_select' type='checkbox' value='ko' name='韩国'/>韩国"
	     	+"<input id='de' class='area_select' type='checkbox' value='de' name='德国' style='margin-left: 20px'/>德国"
		    +"<br><input id='fr' class='area_select' type='checkbox' value='fr' name='法国'/>法国"
	        +"<input id='es' class='area_select' type='checkbox' value='es' name='西班牙' style='margin-left: 20px'/>西班牙"
		    +"<br><input id='ar' class='area_select' type='checkbox' value='ar' name='阿拉伯'/>阿拉伯"
		    +"<input id='pt' class='area_select' type='checkbox' value='pt' name='葡萄牙' style='margin-left: 20px'/>葡萄牙"
		    +"<br><input id='it' class='area_select' type='checkbox' value='it' name='印度'/>印度"
		    +"<input id='ru' class='area_select' type='checkbox' value='ru' name='俄罗斯' style='margin-left: 20px'/>俄罗斯"
		    +"<br><input id='us' class='area_select' type='checkbox' value='us' name='美国'/>美国"
			+"<input id='hk' class='area_select' type='checkbox' value='hk' name='香港' style='margin-left: 20px'/>香港"
            +"<br><input id='test' class='area_select' type='checkbox' value='test' name='公司内网'/>公司内网"
            +"<input id='test_user' class='area_select' type='checkbox' value='test_user' name='指定账号' style='margin-left: 20px'/>指定账号"

			+ "</div>"
			// +"<div id='add_serial_s_pic'>小图：<input type='text'></div>"
			// +"<div id='add_serial_video'>视频：<input type='text'></div>"
			// +"<div id='add_serial_show'>显示：<select id='input_serial_show'>"
			// 	+"<option value='y'>显示</option>"
			// 	+"<option value='n'>隐藏</option>"
			// +"</select></div>"
			+"<div>"
				+"<button id='add_serial_submit'>确定</button>"
				+"<button id='add_serial_back'>返回</button>"
			+"</div>"
		+"</div>";
		var area_arr = [];
		// console.log(serial.filter.area)
		var select_mark = 0;
		document.getElementById('all_country').onclick = function () {
			console.log(select_mark%2)
			if (select_mark%2 == 0){
				for (var k = 0 ;k < 16;k++){
					mx(".area_select")[k].checked = true;
				}
				select_mark +=1

			}else{
				for (var k = 0 ;k < 16;k++){
					mx(".area_select")[k].checked = false;
				}
				select_mark +=1
			}
		}
		if (serial){
			// if (serial.filter.area.length == 15&&serial.filter.area){
			// 	document.getElementById('all_country').click();
			// }
            console.log(serial.filter.area);
			for (var k = 0 ;k < 16;k++){
				if (serial.filter.area[k] == "zh"&&serial.filter.area){
					document.getElementById('zh').checked = true;
				}
				if (serial.filter.area[k] == "tw"&&serial.filter.area){
					document.getElementById('tw').checked = true;
				}
				if (serial.filter.area[k] == "en"&&serial.filter.area){
					document.getElementById('en').checked = true;
				}
				if (serial.filter.area[k] == "ja"&&serial.filter.area){
					document.getElementById('ja').checked = true;
				}
				if (serial.filter.area[k] == "ko"&&serial.filter.area){
					document.getElementById('ko').checked = true;
				}
				if (serial.filter.area[k] == "de"&&serial.filter.area){
					document.getElementById('de').checked = true;
				}
				if (serial.filter.area[k] == "fr"&&serial.filter.area){
					document.getElementById('fr').checked = true;
				}
				if (serial.filter.area[k] == "es"&&serial.filter.area){
					document.getElementById('es').checked = true;
				}
				if (serial.filter.area[k] == "ar"&&serial.filter.area){
					document.getElementById('ar').checked = true;
				}
				if (serial.filter.area[k] == "pt"&&serial.filter.area){
					document.getElementById('pt').checked = true;
				}
				if (serial.filter.area[k] == "it"&&serial.filter.area){
					document.getElementById('it').checked = true;
				}
				if (serial.filter.area[k] == "ru"&&serial.filter.area){
					document.getElementById('ru').checked = true;
				}
				if (serial.filter.area[k] == "us"&&serial.filter.area){
					document.getElementById('us').checked = true;
				}
				if (serial.filter.area[k] == "test"&&serial.filter.area){
					document.getElementById('test').checked = true;
				}
				if (serial.filter.area[k] == "test_user"&&serial.filter.area){
					document.getElementById('test_user').checked = true;
				}
                if (serial.filter.area[k] == "hk"&&serial.filter.area){
                    document.getElementById('hk').checked = true;
                }
			}
		}

		mx("#serial_file_pic").onchange = function ()
		{
			if (typeof FileReader === 'undefined') {  
			    alert('Your browser does not support FileReader...');  
			    return;  
			}
			var newimg = new Image();  
			
			var reader = new FileReader();  
			reader.onload = function(e) {  
			    var img = document.getElementById("serial_pre_img"); 
		    	img.src = this.result;
			    if(this.result.indexOf("data:image/png;base64,")>-1)
			    {
			    	var str = "data:image/png;base64,";
			    	img_url = "data:application/octet-stream;base64," + this.result.substr(str.length);  
			    }else if(this.result.indexOf("data:image/jpeg;base64,")>-1)
			    {
			    	var str = "data:image/jpeg;base64,";
			    	img_url = "data:application/octet-stream;base64," + this.result.substr(str.length); 
			    }
			          
			    newimg.src = this.result;
			}  
			reader.readAsDataURL(this.files[0]);  
		}
		mx("#add_serial_back").onclick = function ()
		{
			create_shop_page();
		}
		mx("#add_serial_submit").onclick = function ()
		{
			var data = {};
			if(serial)
			{
				data.id = serial.summery.id;
			}
			data.flag = 0;
			data.lang = g_lang;
			data.desc = mx("#input_serial_desc").value;
			// data.status = mx("#input_serial_show").value;
			data.status = "y";
			data.segment = {};

			if(mx("#input_serial_name").value)
			{
				data.segment.name = mx("#input_serial_name").value;
			}
			else
			{
				alert("名称不能为空")
				return;
			}
			if(mx("#input_serial_shrot_name").value)
			{
				data.segment.short_name = mx("#input_serial_shrot_name").value;
			}
			else
			{
				alert("简称不能为空")
				return;
			}
			data.segment.remark	= "";
			data.segment.info = {title:data.segment.name,desc:data.desc,big_pic:img_url,small_pic:"",video:"",link:"",language:data.lang,css:""};
			data.segment.langs = [data.segment.info];
			mcloud_agent.segment_set(data,null,function (msg,ref)
			{
				if(msg.result == "")
				{
					for (var k = 0 ;k < 16;k++){
						if (mx(".area_select")[k].checked == true){
							area_arr.push(mx(".area_select")[k].value);
						}
					}
					var data_id = serial?serial.id:"";
					mcloud_agent.serial_set({sign:getParam('sign'),id:data_id,name:data.segment.name,flag:0,summery:msg.segment_id,status:data.status,area:area_arr},null,function (msgs,refs)
					{
						console.log(area_arr);
						create_shop_page(mx("#top_lang").value);
					})
				}
			})
		}
	}
	mx("#add_shop_button").onclick = function ()
	{
		set_serial();
	}
	mx("#set_product_type").onclick = function () {
	    console.log(l_serials_data);
        var serial_id_arr = [];
        for (var h = 0; h < l_serials_data.length; h++){
            serial_id_arr.push({id:l_serials_data[h].id,name:l_serials_data[h].summery.short_name});
        }
        set_type(serial_id_arr);
    }
}
function create_column_page(obj)
{
	var column_obj_data;
	mx("#admin_right").innerHTML = 
	"<div id='admin_right_column'>"		
	+"</div>"
	+"<div id='add_column_button_box'>"
		+"<button id='add_column_button'>添加栏目</button>"
	+"</div>";
	mcloud_agent.column_get({start:0,counts:20,id:null,language:g_lang},null,function (msg,ref){
		console.log(msg)
		var column_content = "";
		var children_length = msg.children?msg.children.length:0;
		column_obj_data = msg.children;
		for(var c=0;c<children_length;c++)
		{
			column_content +=
			"<div class='column_list'>"
				+"<div class='first_column_list' index='' flag='"+msg.children[c].flag+"' num='"+c+"'>"
					+"<button class='second_column_display'>展开</button> "
					+"<span>"+msg.children[c].title.title+"</span> "
					+"<button class='second_column_add'>添加子目录</button> "
					+"<button class='second_column_child_add'>添加子内容</button> "
					+"<button class='edit_first_column'>编辑</button> "
					+"<button class='del_column_btn'>删除</button>"
					+"<div class='column_second_list'>"
					+"</div>"
				+"</div>"
			+"</div>";
		}
		mx("#admin_right_column").innerHTML = column_content;
		on_event();
	})
	function on_event()
	{
		mx("#add_column_button").onclick = function ()
		{
			set_column();
		}
		var second_length = mx(".second_column_display").length;
		var third_length = mx(".third_column_display").length;
		for(var s=0;s<second_length;s++)
		{
			mx(".second_column_display")[s].onclick = function ()
			{
				var column_second_list = this.parentNode.getElementsByClassName("column_second_list")[0];
				// var id = this.parentNode.getAttribute("index");
				var num = this.parentNode.getAttribute("num");
				var id = column_obj_data[num].id;
				if(column_second_list.innerHTML == "")
				{
					mcloud_agent.column_get({start:0,counts:20,id:id,language:g_lang},null,function (msg,ref){
						if(msg.result == "")
						{
							column_obj_data[num].children = msg.children;
							var second_length = msg.children.length;
							for(var sc=0;sc<second_length;sc++)
							{
								column_second_list.innerHTML += 
								"<div class='second_column_list' index='"+id+"' flag='"+msg.children[sc].flag+"' first='"+num+"' num='"+sc+"'>"
									+"<button class='third_column_display'>展开</button> "
									+"<span style='margin-left:25px;'>|----"+msg.children[sc].title.title+"</span> "
									+"<button class='third_column_add'>添加子内容</button> "
									+"<button class='edit_second_column'>编辑</button> "
									+"<button class='del_column_btn'>删除</button><br>"
									+"<div class='column_third_list'></div>"
								+"</div>";	
							}	
							on_event();
						}						
					})
				}
				if(column_second_list.style.display == "block")
				{
					column_second_list.style.display = "none";
					this.innerHTML = "展开";
				}else{
					column_second_list.style.display = "block";
					this.innerHTML = "收起";
				}				
			}
			mx(".second_column_add")[s].onclick = function ()
			{
				var num = this.parentNode.getAttribute("num");
				var id = column_obj_data[num].id;
				set_column({parent:id});
			}
			mx(".second_column_child_add")[s].onclick = function ()
			{
				var num = this.parentNode.getAttribute("num");
				var id = column_obj_data[num].id;
				set_column({parent:id,flag:1});
			}
			mx(".edit_first_column")[s].onclick = function ()
			{
				var num = this.parentNode.getAttribute("num");
				var id = this.parentNode.getAttribute("index");
				var data = column_obj_data[num];
				data.parent = id;
				console.log(data);
				set_column(data);
			}
		}
		for(var t=0;t<third_length;t++)
		{
			mx(".third_column_display")[t].onclick = function ()
			{
				var column_third_list = this.parentNode.getElementsByClassName("column_third_list")[0];
				var first_num = this.parentNode.getAttribute("first");
				var num = this.parentNode.getAttribute("num");
				var id = column_obj_data[first_num].children[num].id;
				if(column_third_list.innerHTML == "")
				{
					mcloud_agent.column_get({start:0,counts:20,id:id,language:g_lang},null,function (msg,ref){
						if(msg.result == "")
						{
							column_obj_data[first_num].children[num].children = msg.children;
							var third_length = msg.children.length;
							for(var tc=0;tc<third_length;tc++)
							{
								column_third_list.innerHTML += 
								"<div class='third_column_list' index='"+id+"' flag='"+msg.children[tc].flag+"' first='"+first_num+"' second='"+num+"' num='"+tc+"'>"
									+"<span style='margin-left:115px;'>|----"+msg.children[tc].title.title+"</span> "
									+"<button class='edit_third_column'>编辑</button> "
									+"<button class='del_column_btn'>删除</button><br>"
								+"</div>";	
							}
							on_event();
						}						
					})
				}
				if(column_third_list.style.display == "block")
				{
					column_third_list.style.display = "none";
					this.innerHTML = "展开";
				}else{
					column_third_list.style.display = "block";
					this.innerHTML = "收起";
				}
			}
			mx(".third_column_add")[t].onclick = function ()
			{
				var first_num = this.parentNode.getAttribute("first");
				var num = this.parentNode.getAttribute("num");
				var id = column_obj_data[first_num].children[num].id;
				set_column({parent:id,flag:1});
			}
			mx(".edit_second_column")[t].onclick = function ()
			{
				var id = this.parentNode.getAttribute("index");
				var first_num = this.parentNode.getAttribute("first");
				var num = this.parentNode.getAttribute("num");
				var data = column_obj_data[first_num].children[num];
				console.log(data)

				data.parent = id;
				set_column(data);
			}
		}
		var edit_third_length = mx(".edit_third_column").length;
		for(var etc=0;etc<edit_third_length;etc++)
		{
			mx(".edit_third_column")[etc].onclick = function ()
			{
				var id = this.parentNode.getAttribute("index");
				var first_num = this.parentNode.getAttribute("first");
				var second_num = this.parentNode.getAttribute("second");
				var num = this.parentNode.getAttribute("num");
				var data = column_obj_data[first_num].children[second_num].children[num];
				data.parent = id;
				set_column(data);
			}
		}
		var del_length = mx(".del_column_btn").length;
		for(var d=0;d<del_length;d++)
		{
			mx(".del_column_btn")[d].onclick = function ()
			{
				var del_obj = {};
				var first_num = this.parentNode.getAttribute("first");
				var second_num = this.parentNode.getAttribute("second");
				var num = this.parentNode.getAttribute("num");
				if(first_num)
				{
					if(second_num){
						del_obj.id = column_obj_data[first_num].children[second_num].children[num].id;
					}
					else
					{
						del_obj.id = column_obj_data[first_num].children[num].id;
					}
				}
				else
				{
					del_obj.id = column_obj_data[num].id;
				}
				del_obj.flag = this.parentNode.getAttribute("flag");
				del_obj.parentnode = this.parentNode;
				del_column(del_obj);
			}
		}
	}
	function set_column(column)
	{
		var column_title = "",
			column_title_id = "",
			column_link = "",
			column_flag = 0,
			column_id = "",
			column_content_id = [],
			column_parent_id = "",
			column_content_length = 0,
			column_content = {},
			column_big_pic = "";
		    column_small_pic = "";
		if(column)
		{
			column_content = column.content?column.content:{};
			column_content_length = column.content?column.content.length:0;
			column_title = column.title?column.title.title:"";
			column_title_id = column.title_id?column.title_id:"";
			column_link = column.title?column.title.link:"";
			column_flag = column.flag?column.flag:0;
			column_parent_id = column.parent?column.parent:"";
			column_id = column.id?column.id:"";
			column_content_id = column.content_id?column.content_id:[];
			column_big_pic = column.title?window.location.protocol+"//"+window.location.host+"/cdms/cdms_get_pic_req.js?dnid="+mcloud_agent._create_nid()+"&dpic_key="+column.title.big_pic+"&"+random():"";
			column_small_pic = column.title?window.location.protocol+"//"+window.location.host+"/cdms/cdms_get_pic_req.js?dnid="+mcloud_agent._create_nid()+"&dpic_key="+column.title.small_pic+"&"+random():"";
		}
		if(column_flag)
		{
			var column_content_html = "";
			var img_url = '';
			mx("#admin_right").innerHTML = 
				"<div>页面：<select id='input_column_page'>"
					+"<option class='select_pages' value='service_info.htm'>服务</option>"
					+"<option class='select_pages' value='faq.htm'>FAQ</option>"
					+"<option class='select_pages' value='download.htm'>下载</option>"
					+"<option class='select_pages' value='introduce.htm'>简介</option>"
					+"<option class='select_pages' value='news.htm'>新闻</option>"
					+"<option class='select_pages' value='contact.htm'>联系</option>"
				+"</select></div>"
				+"<div id='add_column_name'>名称：<input type='text' id='input_column_name' value='"+column_title+"'></div>"
				+"<div>电脑图片：<input type='file' id='column_file_pic' /><img src='"+column_big_pic+"' id='column_pre_img' width='100px' /></div>"

				+"<div id='column_content_box'></div>"
				+"<div>"
					+"<button id='add_column_content_btn'>添加段落</button> "
					+"<button id='add_column_submit'>确定</button> <button id='add_column_back'>返回</button>"
				+"</div>"
			+"</div>";
			var page_length = mx(".select_pages").length;
			for(var page_index=0;page_index<page_length;page_index++)
			{
				if(mx(".select_pages")[page_index].value == column_link)
				{
					mx(".select_pages")[page_index].setAttribute("selected","true");
				}
			}
			for(var cc=0;cc<column_content_length;cc++)
			{
				column_content_html +=
				"<div class='set_column_list' index='"+column_content_id[cc]+"'>"
					+"<div>标题：<input class='column_content_title' type='text' value='"+column_content[cc].title+"'/> </div>"
					+"<div><div style='float:left;'>内容：</div><textarea class='column_content_content'>"+column_content[cc].desc+"</textarea></div>"
					+"<div><button class='del_column_content_btn'>删除</button></div>"
				+"</div>";
			}
			mx("#column_file_pic").onchange = function ()
			{
				if (typeof FileReader === 'undefined') {  
				    alert('Your browser does not support FileReader...');  
				    return;  
				}
				var newimg = new Image();  
				
				var reader = new FileReader();  
				reader.onload = function(e) {  
				    var img = document.getElementById("column_pre_img"); 
			    	img.src = this.result;
				    if(this.result.indexOf("data:image/png;base64,")>-1)
				    {
				    	var str = "data:image/png;base64,";
				    	img_url = "data:application/octet-stream;base64," + this.result.substr(str.length);  
				    }else if(this.result.indexOf("data:image/jpeg;base64,")>-1)
				    {
				    	var str = "data:image/jpeg;base64,";
				    	img_url = "data:application/octet-stream;base64," + this.result.substr(str.length); 
				    }
				          
				    newimg.src = this.result;
				}  
				reader.readAsDataURL(this.files[0]);  
			}			
			mx("#column_content_box").innerHTML = column_content_html;
			function del_column_content_event()
			{
				var del_column_content_btn_length = mx(".del_column_content_btn").length;
				for(var del_num=0;del_num<del_column_content_btn_length;del_num++)
				{
					mx(".del_column_content_btn")[del_num].onclick = function ()
					{
						// var _this_parent = this.parentNode.parentNode;
						this.parentNode.parentNode.style.display="none";
					}
				}
				var set_column_list_length = mx(".set_column_list").length;
				for(var set_column_list_index=0;set_column_list_index<set_column_list_length;set_column_list_index++)
				{
					mx(".column_content_title")[set_column_list_index].onfocus = function()
					{
						this.parentNode.parentNode.setAttribute("flag","1");
					}
					mx(".column_content_content")[set_column_list_index].onfocus = function()
					{
						this.parentNode.parentNode.setAttribute("flag","1");
					}
				}
			}
			
			mx("#add_column_content_btn").onclick = function ()
			{
				var node = document.createElement('div');
					node.innerHTML = 
					"<div class='set_column_list' flag='1'>标题：<input class='column_content_title' type='text' /> </div>"
					+"<div><div style='float:left;'>内容：</div><textarea class='column_content_content'></textarea></div>"
					+"<div><button class='del_column_content_btn'>删除</button></div>";
					mx("#column_content_box").appendChild(node);
					del_column_content_event();
			}
			mx("#add_column_submit").onclick = function ()
			{
				mx("#load_box").style.display = "block";
				var add_length = mx(".set_column_list").length;
				var column_segment_id = [];
				var column_segment = {};
				column_segment.flag = 0;
				column_segment.segment_id = "";
				column_segment.segment = {};
				column_segment.segment.name = "";
				column_segment.segment.remark = "";
				column_segment.segment.short_name = "";
				column_segment.segment.info = {};
				column_segment.segment.info.title = "";
				column_segment.segment.info.desc = "";
				column_segment.segment.info.big_pic = "";
				column_segment.segment.info.small_pic = "";
				column_segment.segment.info.video = "";
				column_segment.segment.info.link = "";
				column_segment.segment.info.language = g_lang;
				column_segment.segment.info.css = "";
				function edit_column_title()
				{
					column_segment.segment_id = column_title_id;
					column_segment.segment.info.title = mx("#input_column_name").value;
					column_segment.segment.info.link = mx("#input_column_page").value;
					column_segment.segment.langs = [column_segment.segment.info];
					column_segment.segment.info.big_pic = img_url;
					mcloud_agent.segment_set(column_segment,null,function (msg,ref){
						if(msg.result == "" || msg.result == "success")
						{
							column_title_id = msg.segment_id;
							add_column_content(0)
						}
					})
				}
				function add_column_content(num)
				{
					if(num>=add_length)
					{
						var column_data = {};
						column_data.flag = column_flag;
						column_data.parent = column_parent_id;
						column_data.id = column_id;
						column_data.status = "y";
						column_data.title = column_title_id;
						column_data.content = column_segment_id;
						mcloud_agent.column_set(column_data,null,function (msg,ref){
							mx("#load_box").style.display = "none";
							create_column_page();
						})
						return;
					}
					else
					{
						var edit_id = mx(".set_column_list")[num].getAttribute("index");
						var edit_flat = mx(".set_column_list")[num].getAttribute("flag");
						if(edit_flat == 1)
						{
							column_segment.segment_id = edit_id?edit_id:"";
							column_segment.segment.info.title = mx(".column_content_title")[num].value;
							column_segment.segment.info.desc = mx(".column_content_content")[num].value;
							column_segment.segment.langs = [column_segment.segment.info];
							mcloud_agent.segment_set(column_segment,null,function (msg,ref){
								if(msg.result == "")
								{
									column_segment_id.push(msg.segment_id);
									add_column_content(++num)
								}
							})
						}
						else
						{
							column_segment_id.push(edit_id);
							add_column_content(++num)
						}
					}
				}
				edit_column_title();
			}
			del_column_content_event();
		}
		else
		{
			var img_url = "";
			var small_img_url = "";
			mx("#admin_right").innerHTML = 
			"<div id='add_serial_box'>"
				+"<div id='add_column_name'>名称：<input type='text' id='input_column_name' value='"+column_title+"'></div>"
				+"<div>电脑图片：<input type='file' id='column_file_pic' /><img src='"+column_big_pic+"' id='column_pre_img' width='100px' /></div>"
			+"<div>手机图片：<input type='file' id='column_file_small_pic' /><img src='"+column_small_pic+"' id='column_pre_small_img' width='100px' /></div>"

			+"<div>"
					+"<button id='add_column_submit'>确定</button> <button id='add_column_back'>返回</button>"
				+"</div>"
			+"</div>";
			mx("#column_file_pic").onchange = function ()
			{
				if (typeof FileReader === 'undefined') {  
				    alert('Your browser does not support FileReader...');  
				    return;  
				}
				var newimg = new Image();  
				
				var reader = new FileReader();  
				reader.onload = function(e) {  
				    var img = document.getElementById("column_pre_img"); 
			    	img.src = this.result;
				    if(this.result.indexOf("data:image/png;base64,")>-1)
				    {
				    	var str = "data:image/png;base64,";
				    	img_url = "data:application/octet-stream;base64," + this.result.substr(str.length);  
				    }else if(this.result.indexOf("data:image/jpeg;base64,")>-1)
				    {
				    	var str = "data:image/jpeg;base64,";
				    	img_url = "data:application/octet-stream;base64," + this.result.substr(str.length); 
				    }
				          
				    newimg.src = this.result;
				}  
				reader.readAsDataURL(this.files[0]);  
			}
			mx("#column_file_small_pic").onchange = function ()
			{
				if (typeof FileReader === 'undefined') {
					alert('Your browser does not support FileReader...');
					return;
				}
				var newimg = new Image();

				var reader = new FileReader();
				reader.onload = function(e) {
					var img = document.getElementById("column_pre_small_img");
					img.src = this.result;
					if(this.result.indexOf("data:image/png;base64,")>-1)
					{
						var str = "data:image/png;base64,";
						small_img_url = "data:application/octet-stream;base64," + this.result.substr(str.length);
					}else if(this.result.indexOf("data:image/jpeg;base64,")>-1)
					{
						var str = "data:image/jpeg;base64,";
						small_img_url = "data:application/octet-stream;base64," + this.result.substr(str.length);
					}

					newimg.src = this.result;
				}
				reader.readAsDataURL(this.files[0]);
			}
			mx("#add_column_submit").onclick = function()
			{
				var column_segment_id = [];
				var req_data = {};
				req_data.flag = 0;
				req_data.id = column_title_id;
				req_data.segment = {};
				req_data.segment.name = "";
				req_data.segment.remark = "";
				req_data.segment.short_name = "";
				req_data.segment.info = {};
				req_data.segment.info.title = mx("#input_column_name").value;
				req_data.segment.info.desc = "";
				req_data.segment.info.big_pic = img_url;
				req_data.segment.info.small_pic = small_img_url;
				req_data.segment.info.video = "";
				req_data.segment.info.link = "";
				req_data.segment.info.language = g_lang;
				req_data.segment.info.css = "";
				req_data.segment.langs = [req_data.segment.info];
				mcloud_agent.segment_set(req_data,null,function (msg,ref){
					if(msg.result == "")
					{
						if(column_title_id)
						{
							create_column_page();
							return;
						}
						var column_data = {};
						column_data.flag = column_flag;
						column_data.parent = column_parent_id;
						column_data.id = column_id;
						column_data.status = "y";
						column_data.title = msg.segment_id;
						mcloud_agent.column_set(column_data,null,function (msg,ref){
							create_column_page();
						})
					}
				})
			}
		}
		mx("#add_column_back").onclick = function()
		{
			create_column_page();
		}
	}
	function del_column(column)
	{
		mx("#admin_del_box").style.display = "block";
		mx("#admin_del_ok").onclick = function ()
		{
			mx("#admin_del_box").style.display = "none";
			mcloud_agent.column_del(column,column,function (msg,ref){
				ref.parentnode.style.display = "none";					
			})
		}
		mx("#admin_del_cancel").onclick = function ()
		{
			mx("#admin_del_box").style.display = "none";
			return;
		}
	}
	on_event();
}
function create_order_page(auth){
    var order_counts = 20;
	if (auth){
		var selet_status_div =  "<option value='dealing'>待处理</option>"
			+"<option value='send'>已发货</option>"
			+"<option value='received'>已收货</option>"
			+"<option value='finish'>交易完成</option>"
	}else{

		var selet_status_div = "<option value='paid'>待发货</option>"
			+"<option value='send'>已发货</option>"
			+"<option value='received'>已收货</option>"
			+"<option value='finish'>交易完成</option>"
	}
    mx("#admin_right").innerHTML = "<div id='search_option_box' style='display: inline-block'>"
        // +"<div style='margin-top: 50px;font-size: 14px;margin-left: 50px;float:left'>宝贝名称:<input id='product_name_input' type='text' placeholder='请输入型号'></div>"
        +"<div style='margin-top: 50px;font-size: 14px;margin-left: 50px;float:left;'><input id='date_input' type='month'>订单状态:<select id='order_status' style='width: 170px'>"
        // +"<option value=''>请选择</option>"
	    +selet_status_div
        + "</select></div>"
        +"<div style='margin-top: 50px;font-size: 14px;margin-left: 50px;float: left'>买家昵称:<input id='user_name_input' type='text' placeholder='请输入买家账号'></div>"
        +"<div style='margin-top: 50px;font-size: 14px;margin-left: 50px;float:left'>订单编号:<input id='order_id_input' type='text' placeholder='请输入订单号'></div>"
        // +"<div style='margin-top: 50px;font-size: 14px;margin-left: 50px;float:left'>成交时间:<input id='time_input' type='text' placeholder='请输入年月（如201606）'></div>"
        +"<div style='margin-top: 50px;font-size: 14px;margin-left: 50px;float:left'><button id='search_order' style='width: 100px'>搜索订单</button></div>"
        +"</div>"
        +"<div  style='height:1px;width: 100%;background-color:#d6d7dc;'></div>"
        +"<div id='class_name'style='display: inline-block'>"
        + "<span style='margin-left: 200px'>名称</span>"
        +"<span style='margin-left: 200px'>单价</span>"
        +"<span style='margin-left: 100px'>数量</span>"
        +"<span style='margin-left: 100px'>买家</span>"
        +"<span style='margin-left: 100px'>交易状态</span>"
        +"<span style='margin-left: 100px'>商品总价</span>"
        +"</div>"
        +"<div  style='height:0.024rem;width: 100%;margin-left:0%;border-bottom: 1px lightgrey solid'></div>"
        +"<table  id='order_show_box' border=1 ></table>"
        +"<div id='page_num' style='width:250px;margin:0 auto;'></div>";
    function order_even_add(){
        // mx("#order_status").onchange = function(){
        //     var obj = {start:0};
        //     obj.status = this.value;
        //     obj.user = mx("#user_name_input").value;
        //     order_req(obj)
        // }
        mx("#search_order").onclick = function(){
            if (mx("#user_name_input").value == ""&&mx("#order_id_input").value == ""){
                var obj = {start:0};
                obj.status = mx("#order_status").value;
                obj.month = mx("#date_input").value.replace("-","");
                order_req(obj);
            }else{
                var obj = {start:0};
                obj.user = mx("#user_name_input").value;
                obj.order_ids = mx("#order_id_input").value;
                obj.status = mx("#order_status").value?mx("#order_status").value:"paid";
                order_req(obj);
            }
        }
    }
    function order_req(obj,i_index){
        obj.counts = obj.counts?obj.counts:order_counts;
        console.log(obj)
        if(obj.order_ids){
            mcloud_agent.get_order({order_ids:obj.order_ids} ,obj ,function (msg ,ref){
                if(msg&&msg.result==""){
                    if(msg.end==0){
                        alert("没有记录")
                    }else{
                        msg.num=0;
						if (i_index){
							order_single_show(msg,ref,i_index);
						}else{
							order_list_show(msg,ref)
						}
                    }
                }else{
                    alert(msg.result)
                }
            })
        }else{
        	console.log(auth)
        	if (auth){
        		if (obj.status == "dealing"){
					mcloud_agent.get_untreat_order(obj, obj, function (msg, ref) {
						console.log(msg);
						if(msg&&msg.result == ""){
							if(msg.end==0||msg.total == 0){
								alert("没有记录")
							}else{
								msg.num=obj.start;
								order_list_show(msg,ref)
							}
						}else{
							alert(msg.result)
						}
					})
				}else {
					mcloud_agent.get_processed_order(obj, obj, function (msg, ref) {
						console.log(msg);
						if(msg&&msg.result == ""){
							if(msg.end==0||msg.total == 0){
								alert("没有记录")
							}else{
								msg.num=obj.start;
								order_list_show(msg,ref)
							}
						}else{
							alert(msg.result)
						}
					})
				}
			}else{
				mcloud_agent.check_order(obj, obj, function (msg, ref) {
					console.log(msg);
					if(msg&&msg.result == ""){
						if(msg.end==0||msg.total == 0){
							alert("没有记录")
						}else{
							msg.num=obj.start;
							order_list_show(msg,ref)
						}
					}else{
						alert(msg.result)
					}
				})
			}

        }
    }
    function order_list_show(msg,ref){
        var orders_status = ref.status;
        // var obj={status:orders_status,user:(ref.user)?(ref.user):("")};
        var obj = ref;
        var page_num = parseInt(msg.num/order_counts);
        if (orders_status == "paid"||orders_status == "dealing"){
            status_str = "待发货";
        }
        else if (orders_status == "send"){
            status_str = "已发货";
        }
        else if (orders_status == "received"){
            status_str = "已收货";
        }
        else if (orders_status == "finish"){
            status_str = "已完成";
        }
        var content = "";
        for(var i=0;i<msg.orders.length;i++) {
			var new_time = new Date(msg.orders[i].create_date * 1000).format("yyyy-MM-dd hh:mm:ss")
			var send_time = new Date(msg.orders[i].send_date * 1000).format("yyyy-MM-dd hh:mm:ss")

			var order_id = msg.orders[i].id;
			var user_str = msg.orders[i].user;
			content += "<tr class='order_single_list' style='border: 1px solid lightgrey'>"
				+ "<td colspan='2'>订单号：" + order_id + "<br>交易时间：" + new_time + " 发货时间：" + send_time + "<label style='margin-left: 10px'>" + ((msg.orders[i].pay_debug == 1) ? ("测试") : ("")) + "</label></td>"
				+ "</tr>"
			for (var k = 0; k < msg.orders[i].product.length; k++) {
				var msg_orders = msg.orders[i].product[k].others;
				console.log(msg_orders)

				// console.log(msg_orders);
				// var create_time = new Date(msg.orders[i].create_date *1000);
				// var new_time = create_time.getFullYear()+"."+(create_time.getMonth()+1)+"."+create_time.getDay();


				for (var j = 0; j < msg_orders.length; j++) {
					if (msg_orders[j].name == "img") {
						img_str = msg_orders[j].value;
					}
					if (msg_orders[j].name == "title") {
						model_name = msg_orders[j].value;
					}
					if (msg_orders[j].name == "px") {
						px_str = msg_orders[j].value;
					}
					if (msg_orders[j].name == "price") {
						price_str = msg_orders[j].value;
					}
				}


					var num = msg.orders[i].product[0].number;
					var price_num;
					var price_unit = price_str.substr(0, 1);
					if (price_unit == "U") {
						price_num = price_str.substr(3, 100);
						price_unit = "USD";
					} else {
						price_num = price_str.substr(1, 100);
						price_unit = "￥";
					}
					var total_price = price_unit + Number(num * price_num).toFixed(2);

				content +=  "<tr class='order_list' index='" + i + "' order_id='" + order_id + "' style='text-align:center;'><td width='300px'><img id='img" + i + "' src='" + window.location.protocol + "//" + window.location.host + "/cdms/cdms_get_pic_req.js?dpic_key=" + img_str + "'style='width: 75px;height: 75px;float:left;border: 1px solid lightgrey;margin-left: 100px'><br>" + model_name + "<br>像素:" + px_str + "</td>"
						+ "<td width='200px'style='padding-left: 40px'>" + price_str + "</td>"
						+ "<td width='65px'style=''>" + num + "</td>"
						+ "<td width='190px'>" + user_str + "</td>"
						+ "<td width='80px'>" + status_str + "</td>"
						+ "<td width='250px'>" + total_price + "</td>"
						+ "</tr>"


				jQuery("#order_show_box").html(content);
				jQuery("#page_num").html("<button id='pre_order' href='javascripts:;'>上一页</button>"
					+ "<span>" + (page_num + 1) + "</span>"
					+ "<button id='next_order' href='javascripts:;'>下一页</button>"
					+ "<span>共" + msg.total + "条记录</span>");
				if (ref.order_ids) {
					mx("#page_num").style.display = "none";
				} else {
					mx("#page_num").style.display = "block";
				}
				mx("#pre_order").onclick = function () {
					if (page_num == 0) {
						msg.num = 0;
					} else {
						msg.num = msg.num - order_counts;
					}
					obj.start = msg.num;
					order_req(obj);
				}
				mx("#next_order").onclick = function () {
					if (msg.num >= (msg.total - 20)) {

					} else {
						msg.num = msg.num + order_counts;
					}
					obj.start = msg.num;
					obj.order_ids = "";
					order_req(obj);
				}
				for (var j = 0; j < mx(".order_list").length; j++) {
					mx(".order_list")[j].onclick = function () {
						obj.order_ids = this.getAttribute("order_id");
						var i_index = this.getAttribute('index');
						console.log(i_index)
						$("#admin_right2").show();
						order_req(obj, i_index);
					}
				}
			}
		}
    }
    function order_single_show(msg,ref,i_index){
    	console.log(msg);
		var product_content = "";
		for (var k = 0; k < msg.orders[0].product.length; k++){
			product_content+="<tr>"
				+"<td><img class='orders_info_img' style='width:50px;' src=''><span class='orders_info_title'></span>/<span class='orders_info_color'></span><span class='orders_info_px'></span></td>"
				+"<td class='orders_info_price'></td>"
				+"<td>"+msg.orders[0].product[k].number+"</td>"
				+"<td>售后服务</td>"
				+"<td>"+msg.orders[0].user+"</td>"
				+"<td id='order_status2'></td>"
				+"<td>"+((k==0)?(msg.orders[0].total_price.unit+msg.orders[0].total_price.amount/100):(""))+"</td>"
				+"</tr>"
		}
        mx("#admin_right2").innerHTML =
            "<div>订单详情</div>"
            +"<button id='back_order_list' style='float: right'>关闭</button>"
            +"<div style='width:80%;margin:0 auto'>"
            +"<table style='width:100%;text-align:center;line-height:30px;' border='1'cellpadding='2' cellspacing='0'>"
            +"<tr>"
            +"<td class='order_single_title'>订单编号</td>"
            +"<td>"+msg.orders[0].id+"</td>"
            +"</tr>"
            +"<tr>"
            +"<td class='order_single_title'>交易信息</td>"
            +"<td>支付宝</td>"
            +"</tr>"
            +"<tr>"
            +"<td class='order_single_title'>创建时间</td>"
            +"<td>"+(new Date(msg.orders[0].create_date*1000).format("yyyy-MM-dd hh:mm:ss"))+"</td>"
            +"</tr>"
            +"<tr>"
            +"<td class='order_single_title'>发货时间</td>"
            +"<td>"+(msg.orders[0].send_date?(new Date(msg.orders[0].send_date*1000).format("yyyy-MM-dd hh:mm:ss")):"")+"</td>"
            +"</tr>"
            +"<tr>"
            +"<td class='order_single_title'>成交时间</td>"
            +"<td></td>"
            +"</tr>"
            +"<tr>"
            +"<td class='order_single_title'>收获地址</td>"
            +"<td id='addr_info'>"
            +"<div id='addr_info_name'>"+msg.orders[0].addr.name+"</div>"
            +"<div id='addr_info_phone'>"+msg.orders[0].addr.phone+"</div>"
            +"<div id='addr_info_address'>"+msg.orders[0].addr.address+"</div>"
            +"<div id='addr_info_country'>"+msg.orders[0].addr.country+"</div>"
            +"<div id='addr_info_province'>"+msg.orders[0].addr.province+"</div>"
            +"<div id='addr_info_postcode'>"+msg.orders[0].addr.postcode+"</div>"
            +"</td>"
            +"</tr>"
            +"<tr>"
            +"<td class='order_single_title'>物流方式</td>"
            +"<td>"+(msg.orders[0].logistics?msg.orders[0].logistics:"")+"</td>"
            +"</tr>"
            +"<tr>"
            +"<td class='order_single_title'>运单号</td>"
            +"<td>"+(msg.orders[0].logistics_id?(msg.orders[0].logistics_id+"<button id='check_logistics'>查看物流</button>"):"")+"</td>"
            +"</tr>"
            +"</table>"
            +"</div>"
            +"<div style='width:80%;margin:0 auto;margin-top:30px;'>"
            +"<table style='width:100%;text-align:center;line-height:30px;'>"
            +"<tr>"
            +"<td>名称</td>"
            +"<td>单价</td>"
            +"<td>数量</td>"
            +"<td>售后服务</td>"
            +"<td>买家</td>"
            +"<td>交易状态</td>"
            +"<td>商品总价</td>"
            +"</tr>"
		    +product_content
            +"</table>"
            +"</div>";
        mx("#back_order_list").onclick = function (){
            $("#admin_right2").hide();
			$("#admin_right2").empty();

		}
        var order_show_name_data = msg.orders[0].product;
        for(var i=0;i<order_show_name_data.length;i++){
        	for (var j=0; j<order_show_name_data[i].others.length; j++){
				if(order_show_name_data[i].others[j].name=="img"){
					mx(".orders_info_img")[i].src=window.location.protocol+"//"+window.location.host+"/cdms/cdms_get_pic_req.js?dpic_key="+order_show_name_data[i].others[j].value;
				}else if(order_show_name_data[i].others[j].name=="title"){
					mx(".orders_info_title")[i].innerHTML = order_show_name_data[i].others[j].value;
				}else if(order_show_name_data[i].others[j].name=="color"){
					mx(".orders_info_color")[i].innerHTML = order_show_name_data[i].others[j].value;
				}else if(order_show_name_data[i].others[j].name=="px"){
					mx(".orders_info_px")[i].innerHTML = order_show_name_data[i].others[j].value;
				}else if(order_show_name_data[i].others[j].name=="price"){
					mx(".orders_info_price")[i].innerHTML = order_show_name_data[i].others[j].value;
				}
        	}
        }
        if(msg.orders[0].order_status=="paid"){
            mx("#order_status2").innerHTML = "<button id='send_product'>发货</button><button id='distribute_order' style='margin-left: 10px'>分货</button>";
            mx("#send_product").onclick = function(){
                order_send_product(msg,ref,i_index);
            }
            mx("#distribute_order").onclick = function(){
                order_distribute_product(msg,ref,i_index);
            }
        }else if(msg.orders[0].order_status=="send"){
            mx("#order_status2").innerHTML = "已发货";
        }else if(msg.orders[0].order_status=="received"){
            mx("#order_status2").innerHTML = "已收货";
        }
        if(mx("#check_logistics")){
            mx("#check_logistics").onclick = function(){
                check_logistics(msg,ref);
            }
        }
    }
    function check_logistics(msg,ref){
        +"<option value='中通快递'>中通快递</option>"
        +"<option value='韵达快递'>韵达快递</option>"
        +"<option value='申通快递'>申通快递</option>"
        +"<option value='天天快递'>天天快递</option>"
        +"<option value='圆通快递'>圆通快递</option>"
        var logistics;
        if(msg.orders[0].logistics=="中通快递"){
            logistics = "zhongtong";
        }else if(msg.orders[0].logistics=="韵达快递"){
            logistics = "yunda";
        }else if(msg.orders[0].logistics=="申通快递"){
            logistics = "shentong";
        }else if(msg.orders[0].logistics=="天天快递"){
            logistics = "tiantian";
        }else if(msg.orders[0].logistics=="圆通快递"){
            logistics = "yuantong";
        }
        mcloud_agent.check_logistics({com:logistics,num:msg.orders[0].logistics_id},null,function (msgs,ref){
            if(msgs&&msgs.result==""){
                var logistics_info = eval("("+msgs.data+")");
                mx("#admin_right2").innerHTML = "<div><button id='logistics_info_back' style='float: right'>关闭</button></div>"
					+"<div>"
                    +"<table id='logistics_info' style='line-height:30px;'>"
                    +"</table>"
                    +"</div>";
                var logistics_info_data = logistics_info.data;
                var table_content = "<tr>"
                    +"<th>时间</th>"
                    +"<th>信息</th>"
                    +"</tr>";
                for(var i=0;i<logistics_info_data.length;i++){
                    table_content += "<tr>"
                        +"<td>"+logistics_info_data[i].time+"<td>"
                        +"<td>"+logistics_info_data[i].context+"<td>"
                        +"</tr>";
                }
                mx("#logistics_info").innerHTML = table_content;
                mx("#logistics_info_back").onclick = function(){
                    $("#admin_right2").hide();
					$("#admin_right2").empty();

				}
            }
        })
        mx("#admin_right2").innerHTML = ""
    }
    function order_send_product(msg,ref,i_index){
        mx("#admin_right2").innerHTML =
            "<div>联系物流</div>"
            +"<div>"
            +"<div>"
            +"选择物流：<select id='waybill'>"
            +"<option value='ems'>EMS</option>"
            +"<option value='shunfeng'>顺丰快递</option>"
            +"<option value='中通快递'>中通快递</option>"
            +"<option value='韵达快递'>韵达快递</option>"
            +"<option value='申通快递'>申通快递</option>"
            +"<option value='天天快递'>天天快递</option>"
            +"<option value='圆通快递'>圆通快递</option>"
            +"</select>"
            +"运单号：<input id='waybill_number' type='text'>"
            +"</div>"
            +"<div><button id='send_submit'>确定</button> <button id='send_back'>返回</button></div>"
            +"</div>";

        mx("#send_back").onclick = function(){
            $("#admin_right2").hide();
			$("#admin_right2").empty();

		}
        mx("#send_submit").onclick = function (){
			mx("#load_box").style.display = "block";

			var send_obj = {orders_id:msg.orders[0].id};
            send_obj.logistics_id = mx("#waybill_number").value;
            send_obj.logistics = mx("#waybill").value;
			if (auth){
				send_obj.flag = 2;
			}else{
				send_obj.flag = 0;
			}
			console.log(send_obj);
			mcloud_agent.update_logistics(send_obj,null,function(msg,ref){
				mx("#load_box").style.display = "none";

				if(msg.result==""){
					$("#admin_right2").hide();
					$("#admin_right2").empty();
					mx(".order_single_list")[i_index].style.display = "none";
					mx(".order_list")[i_index].style.display = "none";
					create_order_page(auth)
                }else{
                	alert(msg.result)
				}
            })
        }
    }
    function order_distribute_product(msg,ref,i_index){
        console.log(msg);
        mcloud_agent.get_auth_user_list({start:0,counts:20}, null, function (msgp, ref) {

            console.log(msgp);
            if (msgp.result == ""){
                var user_div = "";
                for (var i = 0; i < msgp.user.length; i ++){
                    user_div += "<option value='"+msgp.user[i]+"'>"+msgp.user[i]+"</option>"
                }
                mx("#admin_right2").innerHTML = "<div style='margin-left: 20px'>分发订单</div>"
                    +"<br><label>账号名：</label>"
                    +"<select id='account'>"
                    +user_div
                    +"</select><br>"
                    +"<label>订单号：<label id='distribute_order_id'>"+msg.orders[0].id+"</label></label><br>"
                    +"<button id='ensure_set'>确定</button><button id='back_btn'>返回</button>"
				mx("#back_btn").onclick = function (){
					$("#admin_right2").hide();
					$("#admin_right2").empty();
				}
                mx("#ensure_set").onclick = function (){
					mx("#load_box").style.display = "block";

					console.log(mx("#account").value,mx("#distribute_order_id").innerHTML)
                    mcloud_agent.transfer_order({new_user:mx("#account").value,order_ids:mx("#distribute_order_id").innerHTML}, null, function (msga, ref) {
						mx("#load_box").style.display = "none";
						console.log(msga);
                        if (msga.result == ""){
                            $("#admin_right2").hide();
							$("#admin_right2").empty();
							mx(".order_single_list")[i_index].style.display = "none";
							mx(".order_list")[i_index].style.display = "none";
						}else{
                            alert(msga.result);
                        }
                    })
                }
            }else{
            	alert(msgp.result)
			}
        })
    }
    order_even_add();
	if (auth){
		order_req({start:0,status:"dealing"});
	}else{
		order_req({start:0,status:"paid"});
	}
}
function create_stock_page(){

	 mcloud_agent.get_warehouse({}, null, function (msg, ref){
	     console.log(msg)
		 if (msg.result == ""){
	     	var add_div = "<div>"
				    +"<div><div id='add_div'style='display: none'>地区：<input id='add_warehouse' type='text'>"
				    +"<input id='add_zh' type='checkbox' value='zh' style='margin-left: 10px'>中国"
				    +"<input id='add_tw' type='checkbox' value='tw' style='margin-left: 10px'>台湾"
				    +"<input id='add_en' type='checkbox' value='en' style='margin-left: 10px'>英国"
				    +"<input id='add_ja' type='checkbox' value='ja' style='margin-left: 10px'>日本"
				    +"<input id='add_ko' type='checkbox' value='ko' style='margin-left: 10px'>韩国"
				    +"<input id='add_de' type='checkbox' value='de' style='margin-left: 10px'>德国"
				    +"<input id='add_fr' type='checkbox' value='fr' style='margin-left: 10px'>法国"
				    +"<br><input id='add_es' type='checkbox' value='es' style='margin-left: 10px'>西班牙"
				    +"<input id='add_ar' type='checkbox' value='ar' style='margin-left: 10px'>阿拉伯"
				    +"<input id='add_pt' type='checkbox' value='pt' style='margin-left: 10px'>葡萄牙"
				    +"<input id='add_it' type='checkbox' value='it' style='margin-left: 10px'>意大利"
				    +"<input id='add_ru' type='checkbox' value='ru' style='margin-left: 10px'>俄罗斯"
				    +"<input id='add_us' type='checkbox' value='us' style='margin-left: 10px'>美国</div>"
				    + "<button id='add_button'>添加仓库</button><button id='ensure_add'>确认添加</button>"
				    + "</div>"
	     	var div = "";
	     	 for (var i = 0; i< msg.warehouse.length; i ++){
				 div += "<div>地区："+msg.warehouse[i].warehouse+"</div>"
					 +"<input id='zh"+i+"' type='checkbox' value='zh' style='margin-left: 10px'>中国"
					 +"<input id='tw"+i+"' type='checkbox' value='tw' style='margin-left: 10px'>台湾"
					 +"<input id='en"+i+"' type='checkbox' value='en' style='margin-left: 10px'>英国"
					 +"<input id='ja"+i+"' type='checkbox' value='ja' style='margin-left: 10px'>日本"
					 +"<input id='ko"+i+"' type='checkbox' value='ko' style='margin-left: 10px'>韩国"
					 +"<input id='de"+i+"' type='checkbox' value='de' style='margin-left: 10px'>德国"
					 +"<input id='fr"+i+"' type='checkbox' value='fr' style='margin-left: 10px'>法国"
					 +"<br><input id='es"+i+"' type='checkbox' value='es' style='margin-left: 10px'>西班牙"
					 +"<input id='ar"+i+"' type='checkbox' value='ar' style='margin-left: 10px'>阿拉伯"
					 +"<input id='pt"+i+"' type='checkbox' value='pt' style='margin-left: 10px'>葡萄牙"
					 +"<input id='it"+i+"' type='checkbox' value='it' style='margin-left: 10px'>意大利"
					 +"<input id='ru"+i+"' type='checkbox' value='ru' style='margin-left: 10px'>俄罗斯"
					 +"<input id='us"+i+"' type='checkbox' value='us' style='margin-left: 10px'>美国"
			 }
			 mx("#admin_right").innerHTML = div;
			 for (var j = 0; j < msg.warehouse.length; j++){
			 	for (var k = 0; k < msg.warehouse[j].country.length; k++){
			 		if (msg.warehouse[j].country[k] == "zh"){
			 			document.getElementById('zh'+j).checked = true;
					}
					if (msg.warehouse[j].country[k] == "tw"){
						document.getElementById('tw'+j).checked = true;
					}
					if (msg.warehouse[j].country[k] == "en"){
						document.getElementById('en'+j).checked = true;
					}
					if (msg.warehouse[j].country[k] == "ja"){
						document.getElementById('ja'+j).checked = true;
					}
					if (msg.warehouse[j].country[k] == "ko"){
						document.getElementById('ko'+j).checked = true;
					}
					if (msg.warehouse[j].country[k] == "de"){
						document.getElementById('de'+j).checked = true;
					}
					if (msg.warehouse[j].country[k] == "fr"){
						document.getElementById('fr'+j).checked = true;
					}
					if (msg.warehouse[j].country[k] == "es"){
						document.getElementById('es'+j).checked = true;
					}
					if (msg.warehouse[j].country[k] == "ar"){
						document.getElementById('ar'+j).checked = true;
					}
					if (msg.warehouse[j].country[k] == "pt"){
						document.getElementById('pt'+j).checked = true;
					}
					if (msg.warehouse[j].country[k] == "it"){
						document.getElementById('it'+j).checked = true;
					}
					if (msg.warehouse[j].country[k] == "ru"){
						document.getElementById('ru'+j).checked = true;
					}
					if (msg.warehouse[j].country[k] == "us"){
						document.getElementById('us'+j).checked = true;
					}
				}
			 }
		 }
	 })

}
function create_auth_page(){
	var select_div ="<select class='level_select'>"
		+"<option value='1'>权限1</option>"
		+"<option value='2'>权限2</option>"
		+"<option value='0'>删除</option>"
		+"</select>"
    var select_div2 ="<select class='level_select'>"
        +"<option value='2'>权限2</option>"
        +"<option value='0'>删除</option>"
        +"</select>"
	mx("#admin_right").innerHTML = "<div>目前的权限账号：</div>"
	    +"<div id='auth_list'></div>"
	    +"<button id='add_new_user'>添加新的权限账号</button>"
		+"<button id='edit_user_auth'>修改账号权限</button>"
	mcloud_agent.get_auth_user_list({start:0,counts:50}, null, function (msgp, ref) {
	    console.log(msgp);
		if (msgp.result == ""){
			var user_list = "";
			for (var i = 0; i < msgp.user.length; i++){
				user_list += "<div>"+msgp.user[i]+"<input class='user_radio' type='radio' name='user' value='"+msgp.user[i]+"' style='margin-left: 10px;margin-top: 10px'></div>"
			}
			mx("#auth_list").innerHTML = user_list;
			if (mx(".user_radio")[0]){
				mx(".user_radio")[0].checked = true;
			}
		}
	})
	mx("#add_new_user").onclick = function (){

		mx("#admin_right").innerHTML = "<div>添加新的权限账号：</div>"
		    +"<input id='auth_name' type='text'><br>"
		    +"权限选择：<br>"
		    +"<input id='send' class='auth_input' type='checkbox' style='margin-left: 10px'>发货权限"
			+select_div
			+"<input id='distribute' class='auth_input' type='checkbox' style='margin-left: 10px'>分发订单给指定账号发货"
			+select_div
			+"<input id='check_order' class='auth_input' type='checkbox' style='margin-left: 10px'>查看订单总表"
			+select_div
			+"<br><input id='set_stock' class='auth_input' type='checkbox' style='margin-left: 10px'>设置库存和仓库"
			+select_div
			+"<input id='set_buyway' class='auth_input' type='checkbox' style='margin-left: 10px'>设置购买方式"
			+select_div
			+"<input id='set_price' class='auth_input' type='checkbox' style='margin-left: 10px'>设置价格"
			+select_div
			+"<input id='look_auth' class='auth_input' type='checkbox' style='margin-left: 10px'>查看权限"
			+select_div2
		    +"<br><button id='ensure_set'>确定</button>"
		mx("#ensure_set").onclick = function (){
			var auth_arr = [];
			var auth_level_arr = [];
			for (var i = 0; i < mx(".auth_input").length; i++){
				if (mx(".auth_input")[i].checked == true){
					auth_level_arr.push(mx(".level_select")[i].value);
					auth_arr.push(mx(".auth_input")[i].id);
				}
			}
			mcloud_agent.set_auth_user({auth:auth_arr,auth_level:auth_level_arr,user:document.getElementById("auth_name").value}, null, function (msgp, ref) {
			    console.log(ref);
				if (msgp.result == ""){
					create_auth_page();
				}else{
					alert(msgp.result);
				}
			})
		}
	}
	mx("#edit_user_auth").onclick = function (){
		var user;
		for (var i = 0; i < mx(".user_radio").length; i++){
			if (mx(".user_radio")[i].checked == true){
				user = mx(".user_radio")[i].value;
			}
		}
		mx("#admin_right").innerHTML =  "<div>修改账号权限：</div>"
			+"<label id='auth_name'>"+user+"</label><br>"
			+"权限选择：<br>"
			+"<input id='send' class='auth_input' type='checkbox' style='margin-left: 10px'>发货权限"
			+select_div
			+"<input id='distribute' class='auth_input' type='checkbox' style='margin-left: 10px'>分发订单给指定账号发货"
			+select_div
			+"<input id='check_order' class='auth_input' type='checkbox' style='margin-left: 10px'>查看订单总表"
			+select_div
			+"<br><input id='set_stock' class='auth_input' type='checkbox' style='margin-left: 10px'>设置库存和仓库"
			+select_div
			+"<input id='set_buyway' class='auth_input' type='checkbox' style='margin-left: 10px'>设置购买方式"
			+select_div
			+"<input id='set_price' class='auth_input' type='checkbox' style='margin-left: 10px'>设置价格"
			+select_div
			+"<input id='look_auth' class='auth_input' type='checkbox' style='margin-left: 10px'>查看权限"
			+select_div2
			+"<br><button id='ensure_set'>确定</button><button id='back_to_auth'>返回</button>"
		mx("#back_to_auth").onclick = function (){
			create_auth_page();
		}
		console.log(user);
		mcloud_agent.look_user_auth({user:user}, null, function (msgp, ref) {
			console.log(msgp);
			if (msgp.result == ""){
				for (var i = 0 ; i < msgp.auth.length; i++){
					for (var j = 0; j < mx(".auth_input").length; j ++){
						if (msgp.auth[i] == mx(".auth_input")[j].id){
							mx("#"+msgp.auth[i]).checked = true;
							mx(".level_select")[j].value = msgp.auth_level[i];
						}
					}
				}
			}
		})
		mx("#ensure_set").onclick = function (){
			var auth_arr = [];
			var auth_level_arr = [];
			for (var i = 0; i < mx(".auth_input").length; i++){
				if (mx(".auth_input")[i].checked == true){
					auth_level_arr.push(mx(".level_select")[i].value);
					auth_arr.push(mx(".auth_input")[i].id);
				}
			}
			mcloud_agent.set_auth_user({auth:auth_arr,auth_level:auth_level_arr,user:document.getElementById("auth_name").innerHTML}, null, function (msgp, ref) {
				console.log(ref);
				if (msgp.result == ""){
					create_auth_page();
				}else{
					alert(msgp.result);
				}
			})
		}
	}
}
function resource_library(remark){
	var mark="";
	if(remark=="info"){
		mark = "_vimtag_segment_main_info_";
	}else if(remark=="paramet"){
		mark = "_vimtag_segment_paramet_info_";
	}
	mx("#admin_right").innerHTML = "<div>"
		+"<div><button id='add_segment_btn'>添加资源</button></div>"
		+"<div>"
			+"<table id='segment_table' style='width:100%'>"
				
			+"</table>"
		+"</div>"
	+"</div>";
	console.log(mark);
	mcloud_agent.segment_get({start:0,counts:1000,language:[g_lang],segment_name:mark},null,function (msg,ref){
		console.log(msg)
		if(msg&&msg.result==""){
			mx("#segment_table").innerHTML +=
				"<tr>"
					+"<td>ID</td>"
					+"<td>标题</td>"
					+"<td>内容</td>"
					+"<td>查看</td>"
					+"<td>删除</td>"
				+"</tr>";
			for(var i=0;i<msg.segment_ids.length;i++){
				mx("#segment_table").innerHTML +=
				"<tr class='segment_tr' style='border: 1px solid lightgrey'>"
					+"<td style='border-top: 1px lightgrey solid;border-right:1px lightgrey solid '>"+msg.segment_ids[i]+"</td>"
					+"<td style='border-top: 1px lightgrey solid;border-right:1px lightgrey solid'>"+(msg.segments[i].langs&&msg.segments[i].langs[0].title?msg.segments[i].langs[0].title:msg.segments[i].info.title)+"</td>"
					+"<td style='border-top: 1px lightgrey solid;border-right:1px lightgrey solid'>"+(msg.segments[i].langs&&msg.segments[i].langs[0].desc?msg.segments[i].langs[0].desc:msg.segments[i].info.desc)+"</td>"
					+"<td class='edit_segment' tid='"+msg.segment_ids[i]+"' style='border-top: 1px lightgrey solid;border-right:1px lightgrey solid'>详情</td>"
					+"<td class='"+(msg.segments[i].users?"":"del_segment")+"' tid='"+msg.segment_ids[i]+"' style='border-top: 1px lightgrey solid'>删除</td>"
				+"</tr>";
			}
			add_event();
		}
	})
	function set_segment_page(data,ref){
		console.log(data)
		mx("#admin_right").innerHTML = "<div>"
			+"<div>类型:<select id='select_segment_type'>"
				+"<option class='select_segment_type_option' value='1'>详情库-外</option>"
				+"<option class='select_segment_type_option' value='2'>详情库-内</option>"
				+"<option class='select_segment_type_option' value='3'>参数库-类名</option>"
				+"<option class='select_segment_type_option' value='4'>参数库-内容</option>"
			+"</select></div>"
			+"<div id='segment_box'>"
			+"</div>"
		+"</div>";
		if(data){
			if(data.segments[0].short_name=="_vimtag_segment_main_info_" && data.segments[0].remark=="out"){
				mx(".select_segment_type_option")[0].setAttribute("selected","selected");
			}else if(data.segments[0].short_name=="_vimtag_segment_main_info_" && data.segments[0].remark=="in"){
				mx(".select_segment_type_option")[1].setAttribute("selected","selected");
			}else if(data.segments[0].short_name=="_vimtag_segment_paramet_info_" && data.segments[0].remark=="class"){
				mx(".select_segment_type_option")[2].setAttribute("selected","selected");
			}else{
				mx(".select_segment_type_option")[3].setAttribute("selected","selected");
			}
		}
		
		if(remark=="info"){
			create_info_lib_out_page("out");
		}else if(remark=="paramet"){
			if(data && data.segments[0].short_name=="_vimtag_segment_paramet_info_" && data.segments[0].remark=="class"){
				mx(".select_segment_type_option")[2].setAttribute("selected","selected");
			}else{
				mx(".select_segment_type_option")[3].setAttribute("selected","selected");
			}
			create_paramet_lib_page("paramet");
		}
		
		mx("#select_segment_type").onchange = function(){
			var this_val = this.value;
			if(this_val == 1){
				create_info_lib_out_page("out")
			}else if(this_val == 2){
				create_info_lib_out_page("in")
			}else if(this_val == 3){
				create_paramet_lib_page("class");
			}else if(this_val == 4){
				create_paramet_lib_page("paramet");
			}
		}
		var img_data = "";
		var small_img_data = "";
		var height_to_width = "";
		function preImg(sourceId, targetId,type) {  
		    if (typeof FileReader === 'undefined') {  
		        alert('Your browser does not support FileReader...');  
		        return;  
		    }
		    var newimg = new Image();  

		    var reader = new FileReader();  
		    reader.onload = function(e) {  
		        var img = document.getElementById(targetId); 
		        if(type&&type=="in")
		        {
		        	img.parentNode.style.backgroundImage = "url(" + this.result + ")";  
		        }
		        else
		        {
		        	img.src = this.result;	
		        }
		        if(this.result.indexOf("data:image/png;base64,")>-1)
		        {
		        	var str = "data:image/png;base64,";
		        	// img_url[index] = "data:application/octet-stream;base64," + this.result.substr(str.length);  
		        	img_data = "data:application/octet-stream;base64," + this.result.substr(str.length);  
		        }else if(this.result.indexOf("data:image/jpeg;base64,")>-1)
		        {
		        	var str = "data:image/jpeg;base64,";
		        	// img_url[index] = "data:application/octet-stream;base64," + this.result.substr(str.length); 
		        	img_data = "data:application/octet-stream;base64," + this.result.substr(str.length); 
		        }
		              
		        newimg.src = this.result;
		        newimg.onload = function ()
		        {
		        	var body_width = mx("#segment_box").offsetWidth;
		        	var img_width = newimg.width;
		        	var img_height = newimg.height;
		        	height_to_width = img_height/img_width;
		        	if(type&&type=="in")
		        	{
		        		img.style.height = (body_width*height_to_width) + "px";
		        	}
		        }
		    }  
		    reader.readAsDataURL(document.getElementById(sourceId).files[0]);  
		}
		function preSmallImg(sourceId, targetId) {
			if (typeof FileReader === 'undefined') {
				alert('Your browser does not support FileReader...');
				return;
			}
			var newimg = new Image();

			var reader = new FileReader();
			reader.onload = function(e) {
				var img = document.getElementById(targetId);

					img.src = this.result;

				if(this.result.indexOf("data:image/png;base64,")>-1)
				{
					var str = "data:image/png;base64,";
					// img_url[index] = "data:application/octet-stream;base64," + this.result.substr(str.length);
					small_img_data = "data:application/octet-stream;base64," + this.result.substr(str.length);
				}else if(this.result.indexOf("data:image/jpeg;base64,")>-1)
				{
					var str = "data:image/jpeg;base64,";
					// img_url[index] = "data:application/octet-stream;base64," + this.result.substr(str.length);
					small_img_data = "data:application/octet-stream;base64," + this.result.substr(str.length);
				}

				newimg.src = this.result;
				newimg.onload = function ()
				{
					var body_width = mx("#segment_box").offsetWidth;
					var img_width = newimg.width;
					var img_height = newimg.height;
					// height_to_width = img_height/img_width;

					// img.style.height = (body_width*height_to_width) + "px";

				}
			}
			reader.readAsDataURL(document.getElementById(sourceId).files[0]);
		}

		function create_info_lib_out_page(type){
			mx(".select_segment_type_option")[2].style.display="none";
			mx(".select_segment_type_option")[3].style.display="none";
			var info_title = "";
			var info_desc = "";
			var info_img = "";
			var info_small_img = "";
			var info_link = "";
			var img_url_id = "";
			var small_img_url_id = "";
			var info_remark = type;
			var info_id = "";
			if(data){
				console.log(data)
				info_title = data.segments[0].langs&&data.segments[0].langs[0].title?data.segments[0].langs[0].title:(data.segments[0].info.title?data.segments[0].info.title:"");
				info_desc = data.segments[0].langs&&data.segments[0].langs[0].desc?data.segments[0].langs[0].desc:(data.segments[0].info.desc?data.segments[0].info.desc:"");
				info_img = data.segments[0].langs&&data.segments[0].langs[0].big_pic?window.location.protocol+"//"+window.location.host+"/cdms/cdms_get_pic_req.js?dnid="+mcloud_agent._create_nid()+"&dpic_key="+data.segments[0].langs[0].big_pic+"&"+random():(data.segments[0].info.big_pic?window.location.protocol+"//"+window.location.host+"/cdms/cdms_get_pic_req.js?dnid="+mcloud_agent._create_nid()+"&dpic_key="+data.segments[0].info.big_pic+"&"+random():"");
				info_small_img = data.segments[0].langs&&data.segments[0].langs[0].small_pic?window.location.protocol+"//"+window.location.host+"/cdms/cdms_get_pic_req.js?dnid="+mcloud_agent._create_nid()+"&dpic_key="+data.segments[0].langs[0].small_pic+"&"+random():(data.segments[0].info.small_pic?window.location.protocol+"//"+window.location.host+"/cdms/cdms_get_pic_req.js?dnid="+mcloud_agent._create_nid()+"&dpic_key="+data.segments[0].info.small_pic+"&"+random():"");
				info_link = data.segments[0].langs&&data.segments[0].langs[0].link?data.segments[0].langs[0].link:(data.segments[0].info.link?data.segments[0].info.link:"");
				img_url_id = data.segments[0].langs&&data.segments[0].langs[0].big_pic?data.segments[0].langs[0].big_pic:(data.segments[0].info.big_pic?data.segments[0].info.big_pic:"");
				small_img_url_id = data.segments[0].langs&&data.segments[0].langs[0].small_pic?data.segments[0].langs[0].small_pic:(data.segments[0].info.small_pic?data.segments[0].info.small_pic:"");
				info_remark = data.segments[0].remark?data.segments[0].remark:type;
				info_id = data.segment_ids[0]?data.segment_ids[0]:"";
			}
			mx("#segment_box").innerHTML = 
				"<div id='preview_segment_box' class='"+info_link+"' "+(info_remark=="in"?"style='background-image:url("+info_img+")'":"")+">"
					+"<div class='paragraph_title' id='paragraph_title'>"+info_title+"</div>"
					+"<div class='paragraph_content' id='paragraph_content'>"+info_desc+"</div>"
					+"<img class='paragraph_img' id='paragraph_img' style='width: 60%' "+(info_remark=="out"?"src='"+info_img+"'":"")+">"
				+"</div>"
				+"<img id='small_paragraph_img' src='"+info_small_img+"'style='width: 30%'>"

				+"<div id='ctrl_box'>"
					+"<div><input type='file' id='segment_img'></div>"
					+"<div>图片宽度:<input id='img_width_set' class='input_width_40' type='text'></div>"
					+"<div>标题:<input id='segment_title_set' type='text' value='"+info_title+"'></div>"
					+"<div>标题颜色:<div id='title_color_black_btn' class='title_color_black_button'></div> <div id='title_color_white_btn' class='title_color_white_button'></div></div>"
					+"<div>标题位置:<button id='title_left_btn'>靠左</button> <button id='title_mid_btn'>居中</button> <button id='title_right_btn'>靠右</button></div>"
					+"<div>上边距：<input id='title_top' type='text' class='input_width_40'> 下边距：<input id='title_bottom' type='text' class='input_width_40'></div>"
					+"<div>描述:<input id='segment_content_set' type='text' value='"+info_desc+"'></div>"
					+"<div>描述颜色:<div id='content_color_black_btn' class='title_color_black_button'></div> <div id='content_color_white_btn' class='title_color_white_button'></div></div>"
					+"<div>描述位置:<button id='content_left_btn'>靠左</button> <button id='content_mid_btn'>居中</button> <button id='content_right_btn'>靠右</button></div>"
					+"<div>上边距：<input type='text' id='content_top' class='input_width_40'> 下边距：<input type='text' id='content_bottom' class='input_width_40'></div>"
					+"<div>选择手机小图：<input type='file' id='segment_small_img'></div>"
					+"<div><button id='segment_submit'>确定</button> <button>返回</button></div>"
				+"</div>"

			;
			if(info_img&&info_remark=="in"){
				var preview_segment_box_height = mx("#preview_segment_box").offsetWidth*data.segments[0].info.css;
				mx("#preview_segment_box").style.height = preview_segment_box_height + "px";
			}
			
			mx("#segment_img").onchange = function(){
				preImg(this.id, "paragraph_img",type);
			}
			mx("#segment_small_img").onchange = function(){
				preSmallImg(this.id, "small_paragraph_img");
			}
			mx("#img_width_set").onfocus = function (){
				var _this = this;
				document.onkeyup = function ()
				{
					var value = _this.value;
					if(value>0 && value<101)
					{
						value = value;
					}
					else
					{
						value = 0;
					}
					for(var i=0;i<101;i++)
					{
						removeClass(mx("#preview_segment_box"),"pa-width-"+i);
					}
					removeClass(mx("#preview_segment_box"),"pa-width-0");
					addClass(mx("#preview_segment_box"),"pa-width-"+value);
				}
			}
			mx("#segment_title_set").onfocus = function(){
				var _this = this;
				document.onkeyup = function ()
				{
					mx("#paragraph_title").innerHTML = _this.value;
				}
			}
			mx("#title_color_black_btn").onclick =function(){
				removeClass(mx("#preview_segment_box"),"pa-title-white");
				addClass(mx("#preview_segment_box"),"pa-title-black");
			}
			mx("#title_color_white_btn").onclick =function(){
				removeClass(mx("#preview_segment_box"),"pa-title-black");
				addClass(mx("#preview_segment_box"),"pa-title-white");
			}
			mx("#title_left_btn").onclick = function(){
				removeClass(mx("#preview_segment_box"),"pa-title-font-center");
				removeClass(mx("#preview_segment_box"),"pa-title-font-right");
				addClass(mx("#preview_segment_box"),"pa-title-font-left");
			}
			mx("#title_mid_btn").onclick = function(){
				removeClass(mx("#preview_segment_box"),"pa-title-font-left");
				removeClass(mx("#preview_segment_box"),"pa-title-font-right");
				addClass(mx("#preview_segment_box"),"pa-title-font-center");
			}
			mx("#title_right_btn").onclick = function(){
				removeClass(mx("#preview_segment_box"),"pa-title-font-center");
				removeClass(mx("#preview_segment_box"),"pa-title-font-left");
				addClass(mx("#preview_segment_box"),"pa-title-font-right");
			}
			mx("#title_top").onfocus = function(){
				var _this = this;
				document.onkeyup = function ()
				{
					var value = _this.value;
					if(value>0 && value<100)
					{
						value = value;
					}
					else
					{
						value = 0;
					}
					for(var i=0;i<100;i++)
					{
						removeClass(mx("#preview_segment_box"),"pa-title-top-"+i);
					}
					removeClass(mx("#preview_segment_box"),"pa-title-top-");
					addClass(mx("#preview_segment_box"),"pa-title-top-"+value);
				}
			}
			mx("#title_bottom").onfocus = function(){
				var _this = this;
				document.onkeyup = function ()
				{
					var value = _this.value;
					if(value>0 && value<100)
					{
						value = value;
					}
					else
					{
						value = 0;
					}
					for(var i=0;i<100;i++)
					{
						removeClass(mx("#preview_segment_box"),"pa-title-bottom-"+i);
					}
					removeClass(mx("#preview_segment_box"),"pa-title-bottom-");
					addClass(mx("#preview_segment_box"),"pa-title-bottom-"+value);
				}
			}
			mx("#segment_content_set").onfocus = function(){
				var _this = this;
				document.onkeyup = function ()
				{
					mx("#paragraph_content").innerHTML = _this.value;
				}
			}
			mx("#content_color_black_btn").onclick =function(){
				removeClass(mx("#preview_segment_box"),"pa-content-white");
				addClass(mx("#preview_segment_box"),"pa-content-black");
			}
			mx("#content_color_white_btn").onclick =function(){
				removeClass(mx("#preview_segment_box"),"pa-content-black");
				addClass(mx("#preview_segment_box"),"pa-content-white");
			}
			mx("#content_left_btn").onclick = function(){
				removeClass(mx("#preview_segment_box"),"pa-content-font-center");
				removeClass(mx("#preview_segment_box"),"pa-content-font-right");
				addClass(mx("#preview_segment_box"),"pa-content-font-left");
			}
			mx("#content_mid_btn").onclick = function(){
				removeClass(mx("#preview_segment_box"),"pa-content-font-left");
				removeClass(mx("#preview_segment_box"),"pa-content-font-right");
				addClass(mx("#preview_segment_box"),"pa-content-font-center");
			}
			mx("#content_right_btn").onclick = function(){
				removeClass(mx("#preview_segment_box"),"pa-content-font-center");
				removeClass(mx("#preview_segment_box"),"pa-content-font-left");
				addClass(mx("#preview_segment_box"),"pa-content-font-right");
			}
			mx("#content_top").onfocus = function(){
				var _this = this;
				document.onkeyup = function ()
				{
					var value = _this.value;
					if(value>0 && value<100)
					{
						value = value;
					}
					else
					{
						value = 0;
					}
					for(var i=0;i<100;i++)
					{
						removeClass(mx("#preview_segment_box"),"pa-content-top-"+i);
					}
					removeClass(mx("#preview_segment_box"),"pa-content-top-");
					addClass(mx("#preview_segment_box"),"pa-content-top-"+value);
				}
			}
			mx("#content_bottom").onfocus = function(){
				var _this = this;
				document.onkeyup = function ()
				{
					var value = _this.value;
					if(value>0 && value<100)
					{
						value = value;
					}
					else
					{
						value = 0;
					}
					for(var i=0;i<100;i++)
					{
						removeClass(mx("#preview_segment_box"),"pa-content-bottom-"+i);
					}
					removeClass(mx("#preview_segment_box"),"pa-content-bottom-");
					addClass(mx("#preview_segment_box"),"pa-content-bottom-"+value);
				}
			}
			mx("#segment_submit").onclick = function(){
				mx("#load_box").style.display = "block";
                // console.log(small_img_data,small_img_url_id);
				var segment_data = {};
				segment_data.segment={};
				segment_data.id = info_id;
				segment_data.segment.name = "";
				segment_data.flag = 0;
				segment_data.segment.short_name = "_vimtag_segment_main_info_";
				segment_data.segment.remark = info_remark;
				segment_data.segment.info = {};
				segment_data.segment.info.title = mx("#segment_title_set").value?mx("#segment_title_set").value:"";
				segment_data.segment.info.desc = mx("#segment_content_set").value?mx("#segment_content_set").value:"";
				segment_data.segment.info.big_pic = img_data?img_data:img_url_id;
				segment_data.segment.info.small_pic = small_img_data?small_img_data:small_img_url_id;
				segment_data.segment.info.link = mx("#preview_segment_box").className;
				// console.log(segment_data.id,segment_data.segment.info.link);

				segment_data.segment.info.css = height_to_width;
				segment_data.segment.info.language = g_lang;
				// console.log(segment_data);
				segment_data.segment.langs = [segment_data.segment.info];
				console.log(segment_data)
				mcloud_agent.segment_set(segment_data,null,function (msg,ref){
					if(msg&&msg.result==""){
						mx("#load_box").style.display = "none";
						resource_library("info");
					}else if (msg.result == "undefinedcsfs.param.invalid"){
						setTimeout(function (){mx("#segment_submit").click()},2500);
					}
				})
			}
		}
		function create_paramet_lib_page(type){
			var info_title = "";
			var info_desc = "";
			var info_img = "";
			var small_info_img = "";
			var info_link = "";
			var img_url_id = "";
			var small_img_url_id = "";

			var info_remark = type;
			var info_id = "";
			if(data){
				info_title = data.segments[0].langs&&data.segments[0].langs[0].title?data.segments[0].langs[0].title:(data.segments[0].info.title?data.segments[0].info.title:"");
				info_desc = data.segments[0].langs&&data.segments[0].langs[0].desc?data.segments[0].langs[0].desc:(data.segments[0].info.desc?data.segments[0].info.desc:"");
				info_img = data.segments[0].langs&&data.segments[0].langs[0].big_pic?window.location.protocol+"//"+window.location.host+"/cdms/cdms_get_pic_req.js?dnid="+mcloud_agent._create_nid()+"&dpic_key="+data.segments[0].langs[0].big_pic+"&"+random():(data.segments[0].info.big_pic?window.location.protocol+"//"+window.location.host+"/cdms/cdms_get_pic_req.js?dnid="+mcloud_agent._create_nid()+"&dpic_key="+data.segments[0].info.big_pic+"&"+random():"");
				small_info_img = data.segments[0].langs&&data.segments[0].langs[0].small_pic?window.location.protocol+"//"+window.location.host+"/cdms/cdms_get_pic_req.js?dnid="+mcloud_agent._create_nid()+"&dpic_key="+data.segments[0].langs[0].small_pic+"&"+random():(data.segments[0].info.small_pic?window.location.protocol+"//"+window.location.host+"/cdms/cdms_get_pic_req.js?dnid="+mcloud_agent._create_nid()+"&dpic_key="+data.segments[0].info.small_pic+"&"+random():"");
				info_link = data.segments[0].langs&&data.segments[0].langs[0].link?data.segments[0].langs[0].link:(data.segments[0].info.link?data.segments[0].info.link:"");
				img_url_id = data.segments[0].langs&&data.segments[0].langs[0].big_pic?data.segments[0].langs[0].big_pic:(data.segments[0].info.big_pic?data.segments[0].info.big_pic:"");
				small_img_url_id = data.segments[0].langs&&data.segments[0].langs[0].small_pic?data.segments[0].langs[0].small_pic:(data.segments[0].info.small_pic?data.segments[0].info.small_pic:"");
				info_remark = data.segments[0].langs&&data.segments[0].langs[0].remark?data.segments[0].langs[0].remark:(data.segments[0].remark?data.segments[0].remark:type);
				info_id = data.segment_ids[0]?data.segment_ids[0]:"";
			}
			mx(".select_segment_type_option")[0].style.display = "none";
			mx(".select_segment_type_option")[1].style.display = "none";
			mx("#segment_box").innerHTML = "<div>"
				+"<div>标题：<input type='text' id='segment_title_set' value='"+info_title+"'></div>"
				+"<div>内容：<input type='text' id='segment_content_set' value='"+info_desc+"'></div>"
				+"<div>电脑图片：<input type='file' id='paramet_top_img_set'></div>"
				// +"<div>手机图片：<input type='file' id='paramet_top_small_img_set'></div>"
				+"<div><img id='prv_paramet_top_img' style='width:100px;' src='"+info_img+"'></div>"
				// +"<div><img id='prv_paramet_small_top_img' style='width:100px;' src='"+small_info_img+"'></div>"
				+"<div><button id='paramet_set_submit'>确定</button> <button>取消</button></div>"
			+"<div>";
			mx("#paramet_top_img_set").onchange = function(){
				preImg(this.id, "prv_paramet_top_img",type);
			}
			// mx("#paramet_top_small_img_set").onchange = function(){
			// 	preSmallImg(this.id, "prv_paramet_small_top_img");
			// }
			mx("#paramet_set_submit").onclick = function(){
				var segment_data = {};
				segment_data.segment={};
				segment_data.id = info_id;
				segment_data.segment.name = "";
				segment_data.flag = 0;
				segment_data.segment.short_name = "_vimtag_segment_paramet_info_";
				segment_data.segment.remark = info_remark?info_remark:type;
				segment_data.segment.info = {};
				segment_data.segment.info.title = mx("#segment_title_set").value?mx("#segment_title_set").value:"";
				segment_data.segment.info.desc = mx("#segment_content_set").value?mx("#segment_content_set").value:"";
				segment_data.segment.info.big_pic = img_data?img_data:img_url_id;
				// segment_data.segment.info.small_pic = small_img_data?small_img_data:small_img_url_id;
				segment_data.segment.info.link = "";
				segment_data.segment.info.css = "";
				segment_data.segment.info.language = g_lang;
				segment_data.segment.langs = [segment_data.segment.info];
				mcloud_agent.segment_set(segment_data,null,function (msg,ref){
					console.log(msg)
					if(msg&&msg.result==""){
						resource_library("paramet");
					}
				})
			}
		}
	}
	function add_event(){
		mx("#add_segment_btn").onclick = function(){
			set_segment_page();
		}
		var segment_tr = mx(".segment_tr")
		for(var i=0;i<segment_tr.length;i++){
			mx(".edit_segment")[i].onclick = function(){
				var s_id = this.getAttribute("tid");
				mx("#admin_right").innerHTML = "";
				mcloud_agent.segment_get({start:0,counts:1,language:[g_lang],segment_ids:[s_id]},null,set_segment_page)
			}
			
		}
		for(var j=0;j<mx(".del_segment").length;j++){
			mx(".del_segment")[j].onclick = function(){
				var s_id = this.getAttribute("tid");
				var  _this = this;
				mx("#admin_del_box").style.display = "block";
				mx("#admin_del_ok").onclick = function ()
				{
					mx("#admin_del_box").style.display = "none";
					mcloud_agent.segment_set({flag:1,id:s_id},{dom:_this},function (msg,ref){
						if(msg&&msg.result==""){
							ref.dom.parentNode.style.display = "none";
						}
					})
				}
				mx("#admin_del_cancel").onclick = function ()
				{
					mx("#admin_del_box").style.display = "none";
				}
			}
		}
	}
	add_event();
}
function modify_faq()
{
	document.onkeyup = function(){}
	var faq_content;
	faq_content = 
		"<div id='faq_fun_assembly'>"
			+"添加问题类型：<input type='text' id='add_faq_type_text' class='input_width_60'><button id='add_faq_type'>确定</button>"
		+"</div>"
		+"<div id='faq_type_table'>"
			+"<div class='faq_type_list' type='link'>"
				+"<div><input type='text' class='input_width_60' value='连接问题'></div>"
				+"<div class='faq_type_show'>查看</div>"
				+"<div class='faq_type_edit'>修改</div>"
				+"<div class='faq_type_delect'>删除</div>"
			+"</div>"
			+"<div class='faq_type_list' type='show'>"
				+"<div><input type='text' class='input_width_60' value='显示问题'></div>"
				+"<div class='faq_type_show'>查看</div>"
				+"<div class='faq_type_edit'>修改</div>"
				+"<div class='faq_type_delect'>删除</div>"
			+"</div>"
			+"<div class='faq_type_list' type='photo'>"
				+"<div><input type='text' class='input_width_60' value='拍照问题'></div>"
				+"<div class='faq_type_show'>查看</div>"
				+"<div class='faq_type_edit'>修改</div>"
				+"<div class='faq_type_delect'>删除</div>"
			+"</div>"
			+"<div class='faq_type_list' type='pass'>"
				+"<div><input type='text' class='input_width_60' value='密码问题'></div>"
				+"<div class='faq_type_show'>查看</div>"
				+"<div class='faq_type_edit'>修改</div>"
				+"<div class='faq_type_delect'>删除</div>"
			+"</div>"
			+"<div class='faq_type_list' type='sd'>"
				+"<div><input type='text' class='input_width_60' value='SD卡问题'></div>"
				+"<div class='faq_type_show'>查看</div>"
				+"<div class='faq_type_edit'>修改</div>"
				+"<div class='faq_type_delect'>删除</div>"
			+"</div>"
			+"<div class='faq_type_list' type='other'>"
				+"<div><input type='text' class='input_width_60' value='其他'></div>"
				+"<div class='faq_type_show'>查看</div>"
				+"<div class='faq_type_edit'>修改</div>"
				+"<div class='faq_type_delect'>删除</div>"
			+"</div>"
		+"</div>"
		+"<div id='faq_content_box'>"
			+"<div id='faq_content_text'></div>"
		+"</div>";
	mx("#admin_right").innerHTML = faq_content;
	faq_type_event();
	function faq_type_event()
	{
		var length = mx('.faq_type_list').length;
		for (var l=0;l<length;l++)
		{
			mx(".faq_type_show")[l].onclick = function ()
			{
				var type = this.parentNode.getAttribute("type");
				faq_question(type);
			}
			mx(".faq_type_delect")[l].onclick = function ()
			{
				this.parentNode.style.display = "none";
			}
		}
	}
	mx("#add_faq_type").onclick = function ()
	{
		var add_faq_type_name = mx("#add_faq_type_text").value;
		var dom_faq_type_list;
		if(add_faq_type_name)
		{
			dom_faq_type_list = document.createElement("div");
			dom_faq_type_list.className = "faq_type_list";
			dom_faq_type_list.innerHTML = 
				"<div><input type='text' class='input_width_60' value='"+add_faq_type_name+"'></div>"
				+"<div class='faq_type_show'>查看</div>"
				+"<div class='faq_type_edit'>修改</div>"
				+"<div class='faq_type_delect'>删除</div>"
			mx("#faq_type_table").appendChild(dom_faq_type_list);
			faq_type_event();
		}
	}
	faq_question("link");
	function faq_question(type)
	{
		var content = "";
		jQuery.getJSON("./json/faq/"+type+"_zh.json",function(data)
		{
			var data_length = count(data.content);
			for(var i=0;i<data_length;i++)
			{
				content += "<div class='faq_first_level' contenteditable='true'>" + data.content[i].q + "</div>";
				var question_length = count(data.content[i].a);
				for (var j=0;j<question_length;j++)
				{
					content += "<div class='faq_second_level' contenteditable='true'>" + data.content[i].a[j].q + "</div>";
					var answer_length = count(data.content[i].a[j].a)
					for (var k=0;k<answer_length;k++)
					{
						content += "<div class='faq_third_level' contenteditable='true'>" + data.content[i].a[j].a[k] + "</div>";
					}
				}

			}
			mx("#faq_content_text").innerHTML = content;
			faq_edit_event()
		})
	}
	function faq_edit_event()
	{
		var faq_first_level_length = mx(".faq_first_level").length;
		var faq_second_level_length = mx(".faq_second_level").length;
		var faq_third_level_length = mx(".faq_third_level").length;
		for(var f=0;f<faq_first_level_length;f++)
		{
			var old_content;
			mx(".faq_first_level")[f].onfocus = function()
			{
				old_content = this.innerHTML;
			}
			mx(".faq_first_level")[f].onblur = function()
			{
				var child = this.childNodes;
				var child_length = this.childNodes.length-1;
				for(var c=child_length;c>0;c--)
				{
					
					child[c].setAttribute("contenteditable","true");
					child[c].style.color = "#f00";
					if(child[c].innerHTML == "<br>")
					{
						this.removeChild(child[c]);
					}
					else if(child[c].innerHTML.substring(0,1) == "3")
					{
						var child_content = child[c].innerHTML;
						child[c].innerHTML = child_content.substring(1,child_content.length-1);
						child[c].className = "faq_third_level";
						this.parentNode.insertBefore(child[c],child[c].parentNode.nextSibling);
					}
					else if(child[c].innerHTML.substring(0,1) == "2")
					{
						var child_content = child[c].innerHTML;
						child[c].innerHTML = child_content.substring(1,child_content.length-1);
						child[c].className = "faq_second_level";
						this.parentNode.insertBefore(child[c],child[c].parentNode.nextSibling);
					}
					else
					{
						if(child[c].innerHTML.substring(0,1) == "1")
						{
							var child_content = child[c].innerHTML;
							child[c].innerHTML = child_content.substring(1,child_content.length-1);
						}						
						child[c].className = "faq_first_level";
						this.parentNode.insertBefore(child[c],child[c].parentNode.nextSibling);
					}
				}
				var new_content = this.innerHTML;
				if(old_content != new_content)
				{
					this.style.color = "#f00";
				}
				if(!new_content)
				{
					this.style.display = "none";
				}
				faq_edit_event();
			}
		}
		for(var s=0;s<faq_second_level_length;s++)
		{
			var old_content;
			mx(".faq_second_level")[s].onfocus = function()
			{
				old_content = this.innerHTML;
			}
			mx(".faq_second_level")[s].onblur = function()
			{
				var child = this.childNodes;
				var child_length = this.childNodes.length-1;
				for(var c=child_length;c>0;c--)
				{
					
					child[c].setAttribute("contenteditable","true");
					child[c].style.color = "#f00";
					if(child[c].innerHTML == "<br>")
					{
						this.removeChild(child[c]);
					}
					else if(child[c].innerHTML.substring(0,1) == "3")
					{
						var child_content = child[c].innerHTML;
						child[c].innerHTML = child_content.substring(1,child_content.length-1);
						child[c].className = "faq_third_level";
						this.parentNode.insertBefore(child[c],child[c].parentNode.nextSibling);
					}
					else if(child[c].innerHTML.substring(0,1) == "2")
					{
						var child_content = child[c].innerHTML;
						child[c].innerHTML = child_content.substring(1,child_content.length-1);
						child[c].className = "faq_second_level";
						this.parentNode.insertBefore(child[c],child[c].parentNode.nextSibling);
					}
					else
					{
						if(child[c].innerHTML.substring(0,1) == "1")
						{
							var child_content = child[c].innerHTML;
							child[c].innerHTML = child_content.substring(1,child_content.length-1);
						}						
						child[c].className = "faq_first_level";
						this.parentNode.insertBefore(child[c],child[c].parentNode.nextSibling);
					}
				}
				var new_content = this.innerHTML;
				if(old_content != new_content)
				{
					this.style.color = "#f00";
				}
				if(!new_content)
				{
					this.style.display = "none";
				}
				faq_edit_event();
			}
		}
		for(var t=0;t<faq_third_level_length;t++)
		{
			var old_content;
			mx(".faq_third_level")[t].onfocus = function()
			{
				old_content = this.innerHTML;
			}
			mx(".faq_third_level")[t].onblur = function()
			{				
				var child = this.childNodes;
				var child_length = this.childNodes.length-1;
				for(var c=child_length;c>0;c--)
				{
					
					child[c].setAttribute("contenteditable","true");
					child[c].style.color = "#f00";
					if(child[c].innerHTML == "<br>")
					{
						this.removeChild(child[c]);
					}
					else if(child[c].innerHTML.substring(0,1) == "3")
					{
						var child_content = child[c].innerHTML;
						child[c].innerHTML = child_content.substring(1,child_content.length-1);
						child[c].className = "faq_third_level";
						this.parentNode.insertBefore(child[c],child[c].parentNode.nextSibling);
					}
					else if(child[c].innerHTML.substring(0,1) == "2")
					{
						var child_content = child[c].innerHTML;
						child[c].innerHTML = child_content.substring(1,child_content.length-1);
						child[c].className = "faq_second_level";
						this.parentNode.insertBefore(child[c],child[c].parentNode.nextSibling);
					}
					else
					{
						if(child[c].innerHTML.substring(0,1) == "1")
						{
							var child_content = child[c].innerHTML;
							child[c].innerHTML = child_content.substring(1,child_content.length-1);
						}						
						child[c].className = "faq_first_level";
						this.parentNode.insertBefore(child[c],child[c].parentNode.nextSibling);
					}
				}
				var new_content = this.innerHTML;
				if(old_content != new_content)
				{
					this.style.color = "#f00";
				}
				if(!new_content)
				{
					this.style.display = "none";
				}
				faq_edit_event();
			}
		}
	}
}
function modify_order(auth){
	document.onkeyup = function(){};
	create_order_page(auth);
}
function modify_column()
{
	document.onkeyup = function(){};
	create_column_page();
}
function modify_stock()
{
	document.onkeyup = function(){};
	create_stock_page();
}
function modify_auth()
{
	document.onkeyup = function(){};
	create_auth_page();
}
function main(auth)
{
	mx("body").item(0).innerHTML = "<div id='admin_top'>"
		+"<div id='admin_top_left'>"+((getParam("sign")=="ebit")?("ebit管理系统"):("vimtag管理系统"))+"</div>"
		+"<div id='admin_top_right'>"
			+"<div id='lang'>语言: <select name='' id='top_lang'>"
				+"<option class='select_lang' value='zh'>中文(简体)</option>"
				+"<option class='select_lang' value='tw'>中文(繁体)</option>"
				+"<option class='select_lang' value='en'>English</option>"
				+"<option class='select_lang' value='ja'>日本語</option>"
				+"<option class='select_lang' value='ko'>한국의</option>"
				+"<option class='select_lang' value='de'>Deutsch</option>"
				+"<option class='select_lang' value='fr'>française</option>"
				+"<option class='select_lang' value='es'>española</option>"
				+"<option class='select_lang' value='ar'>العربية</option>"
				+"<option class='select_lang' value='pt'>português</option>"
				+"<option class='select_lang' value='it'>italiana</option>"
				+"<option class='select_lang' value='ru'>русский</option>"
			+"</select></div>"
			+"<a href='login.htm'><div id='exit'>退出</div></a>"
		+"</div>"
	+"</div>"
	+"<div id='admin_left'>"
		+"<div class='admin_left_menu' id='admin_left_menu_order'>全部订单</div>"
		+"<div class='admin_left_menu' id='admin_left_menu_shop' style='display: "+((auth)?('none'):(''))+"'>商品管理</div>"
		+"<div class='admin_left_menu' id='admin_left_menu_column' style='display: "+((auth)?('none'):(''))+"'>栏目管理</div>"
		+"<div class='admin_left_menu' id='admin_left_menu_info' style='display: "+((auth)?('none'):(''))+"'>详情库</div>"
		+"<div class='admin_left_menu' id='admin_left_menu_paramet' style='display: "+((auth)?('none'):(''))+"'>参数库</div>"
		+"<div class='admin_left_menu' id='admin_left_menu_auth' style='display: "+((auth)?('none'):(''))+"'>权限管理</div>"
		+"<div class='admin_left_menu' id='admin_left_menu_stock' style='display: none'>仓库管理</div>"
		// +"<div class='admin_left_menu' id='admin_left_menu_faq'>FAQ</div>"
	+"</div>"
	+"<div id='admin_right'></div>"
    +"<div id='admin_right2'></div>"
	+"<div id='admin_del_box'>"
		+"<div id='admin_del_main'>"
			+"<div id='admin_del_tip'>确定要删除吗</div>"
			+"<div><div id='admin_del_ok'>确定</div><div id='admin_del_cancel'>取消</div></div>"
		+"</div>"
	+"</div>"
	+"<div id='load_box'><div id='load_img'></div></div>"
	+"<div id='segment_page'><div id='segment_page_main'><div id='close_segment_page'>&times;</div><div id='segment_page_box'></div></div></div>";
	if (getParam("sign")=="ebit"){
		document.getElementById('admin_top').style.backgroundColor = "#FF781F";
		// document.getElementById('admin_left').style.backgroundColor = "#FF781F";
	}
	var select_lang_length = mx(".select_lang").length;
	for(var select_lang_index=0;select_lang_index<select_lang_length;select_lang_index++)
	{
		if(mx(".select_lang")[select_lang_index].value == g_lang)
		{
			mx(".select_lang")[select_lang_index].setAttribute("selected","true");
		}
	}
	mx("#top_lang").onchange = function ()
	{
		g_lang = this.value;
		localStorage.setItem("language_choice_info",g_lang)
		create_main_page();
	}
	mx("#close_segment_page").onclick = function(){
		mx("#segment_page").style.display="none";
	}
	create_main_page(auth);
}
window.onload=function()
{
	var pathname = location.pathname;
	var step = pathname.lastIndexOf("/")+1;
	var filename = pathname.substr(step);
	g_lang = localStorage.getItem("language_choice_info")?localStorage.getItem("language_choice_info"):"zh";
	switch(filename){
		case "":
		case "admin.htm":
		{
			login();
			// main();
			break;
		}
		case "admin.debug.htm":
		{
			login();
			// main();
			break;
		}
		case "login.htm":
		{
			login();
			break;
		}
	}
}