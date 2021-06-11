/**
 * Created with JetBrains WebStorm.
 * User: mining
 * Date: 14-8-13
 * Time: 上午9:04
 * To change this template use File | Settings | File Templates.
 */
(function(window,document){
    var g_agree_flag = true,
        g_play_flag = false,
        g_photo_flag = false,
        g_switch_flag = [],
        g_send_flag = true,
        g_sm_flag = true,
        g_dev_list_info,
        g_weekArray = new Array(mcs_sunday, mcs_monday, mcs_tuesday, mcs_wednesday,mcs_thursday, mcs_friday, mcs_saturday),
        g_shown_pic = 0,
        g_history_url = [],
        g_playing_mme,
        g_playing_nick,
        g_playing_sn,
        g_playing_num,
        g_playing_url,
        g_play_back_url,
        g_timer,
        g_wifi_list_info,
        g_cam_conf,
        g_cam_conf_reset = [6,70,60,50],
        g_sign_up_name,
        g_sign_in_flag = false,
        g_is_back_to_dev_list = false,
        g_mic_flag,
        g_last_time,
        g_load_images = new Array(),
        g_dom_turn_around,
        g_push_num,
        g_show_message_box,
        g_shown_history = true,
        g_dom_loading_gif,
        g_online_num = 0,
        g_first_time,
        g_history_message = [],
        g_login_type,
        g_login_dev_sn,
        g_location_host = location.host,
        g_dev_type,
        g_time_type,
        g_wifi_connection,
        g_wifi_connection_time= 0,
        g_photograph_time= 0,
        g_add_sn,
        g_old_pwd,
        g_connection_time= 0,
        g_web_client_v="v2.9.1.1509141032",
        g_max_id=[],
        g_big_img_url=[],
        g_receive_flag,
        g_click_time,
        g_mask_data=new Array(),
        g_start_pos,
        g_end_pos;
        g_avc=null;
        




    function common_menu(obj)
    {
        if(obj.type == "login"||obj.type == "dev_list")
        {
            if(!$("#menu_box")[0])
            {
                var dom_menu_box = document.createElement("div");
                dom_menu_box.setAttribute("id","menu_box");
                $("#page")[0].appendChild(dom_menu_box);
            }
            $("#menu_box")[0].innerHTML = "<div id = 'menu_center'>"
                + "<div id = 'cloud'>"
                + "<div style='background-position: -265px 0px'  class = 'img_top'></div>"
                + "<span class = 'cloud_font'>"+mcs_cloud+"</span>"
                + "</div>"
                + "<div id = 'site_map'>"
                + "<div  style='background-position: -280px 0px' class = 'img_top'></div>"
                + "<span class = 'site_map_font'>"+mcs_local+"</span>"
                + "</div>"
                + "</div>";
            if(obj.type == "dev_list"&&!$("#add_dev")[0]&&g_login_type!= "IPC"&&g_login_type!= "dev")
            {
                $("#menu_box")[0].innerHTML += "<div id = 'add_dev' style='background-position: 0 -28px'></div>";
            }
            (function(){
                var cloud = $("#cloud"),site_map = $("#site_map");
                $("#cloud").click(function()
                {
                    cloud.css("background","#22aaaa");
                    cloud.find("div").css("background-position","-265px 0px");
                    cloud.find("span").css("color","#ffffff");
                    site_map.css("background","#ffffff");
                    site_map.find("div").css("background-position","-280px 0px");
                    site_map.find("span").css("color","#22aaaa");
                });
                $("#site_map").click(function()
                {
                    cloud.css("background","#ffffff");
                    cloud.find("div").css("background-position","-250px 0px");
                    cloud.find("span").css("color","#22aaaa");
                    site_map.css("background","#22aaaa");
                    site_map.find("div").css("background-position","-295px 0px");
                    site_map.find("span").css("color","#ffffff");
                });
            })();
        }
        else
        {
            $("#menu_box")[0].innerHTML = "<div id = 'dev_play_menu_left'>"
                + "<div id = 'back_to_list'>"
                + "<div id = 'back_img' style='background-position: -21px -28px'></div>"
                + "<span class = 'back_text'>"+mcs_device_list+"</span>"
                + "</div>"
                + "</div>"
                + "<div id = 'dev_play_menu_right'>"
                + "<div id = 'setup'>"
                + "<div id = 'setup_img' style='background-position: -136px -28px' class = 'play_img'></div>"
                + "</div>"
                + "<div id = 'history'>"
                + "<div id = 'history_img' style='background-position: -95px -28px' class = 'play_img'></div>"
                + "<div id = 'push_box'></div>"
                + "</div>"
                + "<div id = 'playing'>"
                + "<div id = 'playing_img' style='background-position: -33px -28px' class = 'play_img'></div>"
                + "</div>"
                + "</div>";
            (function()
            {
                var dom_playing = $("#playing"),dom_history = $("#history"),dom_setup = $("#setup"),dom_back = $("#back_to_list"),
                    num;
                for(var i = 0;i<g_dev_list_info.length;i++)
                {
                    if(g_dev_list_info[i].sn == g_playing_sn)
                    {
                        if(g_push_num = parseInt(getCookie(g_dev_list_info[i].sn)))
                        {
                            var dom_push_box = $("#push_box");
                            dom_push_box.fadeIn();
                            dom_push_box.text(g_push_num);
                        }
                        num = i;
                        break;
                    }
                }

                dom_playing[0].onclick = function()
                {
                    document.body.style.overflowX = "hidden";
                    $("#play_box").remove();
                    g_shown_history = true;
                    g_dom_loading_gif.fadeIn();
                    if(g_dom_turn_around)
                    {
                    	for(var i = 0;i<5;i++)
	                    {
	                       g_dom_turn_around[i].remove();
	                    }
                    }
                    $("#setup_list").remove();
                    play_class({num:g_playing_num});
                    g_dom_loading_gif.fadeOut();
                };

                dom_history[0].onclick = function()
                {
                    document.body.style.overflowX = "hidden";
                    g_dom_loading_gif.fadeIn();
                    if(g_shown_history)
                    {
                        var history_main;
                        setCookie(g_dev_list_info[g_playing_num].sn,0);
                        $("#push_box").fadeOut();
                        $("#help_switch").remove();
                        if(!(history_main = $("#history_main")[0]))
                        {
                            $("#play_box").remove();
                            $("#play_back_box").remove();
                            $("#bottom_box").remove();
                            change_ico(this);
                            history_main = create_dom("history_main",$("#menu_box"));
                            history_main.style.height = $(window).height()-100+"px";
                            history_class();
                            $("#setup_list").remove();
                            if(g_dom_turn_around)
                            {
                                for(var i = 0;i<5;i++)
                                {
                                     g_dom_turn_around[i].remove();
                                }
                            }
                        }
                        else
                        {
                            history_main.innerHTML = "";
                            history_class();
                        }
                        g_shown_history = false;
                    }
                    else
                    {
                        g_dom_loading_gif.fadeOut();
                    }
                };

                dom_setup[0].onclick = function()
                {
                    g_shown_history = true;
                    g_dom_loading_gif.fadeIn();
                    $("#play_box").remove();
                    $("#play_back_box").remove();
                    $("#bottom_box").remove();
                    $("#history_main").remove();
                    $("#help_switch").remove();
                    change_ico(this);
                    setup_class({type:obj.type});
                    $("#about").click();
                    if(g_dom_turn_around)
                    {
                        for(var i = 0;i<5;i++)
                        {
                            g_dom_turn_around[i].remove();
                        }
                    }
                    
                    g_dom_loading_gif.fadeOut();
                };

                dom_back.click(function()
                {
                    $("#bottom_box").css({"height":"50px"});
                    document.body.style.overflowX = "hidden";
                    g_shown_history = true;
                    g_dom_loading_gif.fadeIn();
                    $("#menu_box").html();
                    $("#main_box").fadeIn();
                    $("#play_box").remove();
                    $("#play_back_box").remove();
                    $("#setup_list").remove();
                    $("#history_main").remove();
                    $("#help_switch").remove();
                    $("#box_list").remove();
                    $("#timeline").remove();
                    $("#bottom_box").remove();
                    if(g_dom_turn_around)
					{
						for(var i = 0;i<5;i++)
		                {
		                     g_dom_turn_around[i].remove();
		                }

					}
                    dev_list_class();
                });
            })();
        }

    }

    // function common_bottom()
    // {
        // if(!$("#bottom_box")[0])
        // {
        //     var dom_bottom_box = document.createElement("div");
        //     dom_bottom_box.setAttribute("id","bottom_box");
        //     $("#page")[0].appendChild(dom_bottom_box);
        // }
        // $("#bottom_box")[0].innerHTML = "<div id = 'bottom_main'>"
        //     +"<div id = 'home' class = 'bottom_div'>"
        //         +"<div id = 'home_ico' style='background-position: -27px 0px' class = 'img_bottom'></div>"
        //         +"<div class='text_bottom'>"+mcs_home+"</div>"
        //     +"</div>"
        //     +"<div id = 'service' class = 'bottom_div'>"
        //         +"<div id = 'service_ico' style='background-position: -193px 0px' class = 'img_bottom'></div>"
        //         +"<div class='text_bottom'>"+mcs_customer_service+"</div>"
        //     +"</div>"
        //     +"<div id = 'device_list' class = 'bottom_div_ex'>"
        //         +"<div id = 'device_list_ico' style='background-position: -112px 0px' class = 'img_bottom'></div>"
        //     +"<div class='text_bottom'>"+mcs_device_list+"</div>"
        //     +"</div>"
        //     +"<div id = 'me' class = 'bottom_div'>"
        //         +"<div id = 'me_ico'  style='background-position: -84px 0px' class = 'img_bottom'></div>"
        //     +" <div class='text_bottom'>"+mcs_my+"</div>"
        //     +"</div>"
        //     +"</div>";
        // (function()
        // {
        //     function change_ico()
        //     {
        //         $("#home_ico").css("background-position","-27px 0px");
        //         $("#service_ico").css("background-position","-193px 0px");
        //         $("#device_list_ico").css("background-position","-140px 0px");
        //         $("#me_ico").css("background-position","-84px 0px");
        //     }
        //     var home = document.getElementById("home"),
        //         service = document.getElementById("service"),
        //         list = document.getElementById("device_list"),
        //         me = document.getElementById("me");
        //     home.onclick = (function(){
        //         change_ico();
        //         $("#forgot_page").remove();
        //         $("#home_ico").css("background-position","0px 0px");
        //     });
        //     service.onclick = (function(){
        //         change_ico();
        //         $("#service_ico").css("background-position","-168px 0px");
        //         $("#dev_list").remove();
        //         $("#box_list").remove();
        //         $("#my_box").remove();
        //         $("#forgot_page").remove();
        //         service_class();
        //     });
        //     list.onclick = (function(){
        //         change_ico();
        //         $("#device_list_ico").css("background-position","-112px 0px");
        //         $("#main_box").remove();
        //         $("#service_page").remove();
        //         $("#forgot_page").remove();
        //         $("#my_box").remove();
        //         $("#box_list").remove();
        //         if(!g_sign_in_flag) {
        //             login_class();
        //         }
        //         else
        //         {
        //             g_dom_loading_gif.fadeIn();
        //             dev_list_class();
        //         }
        //     });
        //     me.onclick = (function(){
        //         g_dom_loading_gif.fadeOut();
        //         change_ico();
        //         $("#me_ico").css("background-position","-56px 0px");
        //         $("#dev_list").remove();
        //         $("#box_list").remove();
        //         $("#forgot_page").remove();
        //         $("#service_page").remove();
        //         $("#main_box").remove();
        //         my_class();
        //     });
        // })();
    // }

    function add_input_event(values)
    {
        var l_dom_input = $("input"),l_num,l_input_values = values,l_length = l_dom_input.length;

        l_dom_input.focus(function() {
            for (var j = 0; j <l_length; j++)
            {
                if (this == l_dom_input[j])
                {
                    if(this.value == mcs_input_password||this.value == mcs_password||this.value == mcs_confirm_password)
                    {
                        this.style.display = "none";
                        $(this).next().css("display","block");
                        $(this).next().focus();
                    }
                    else if(this.value == l_input_values[j])
                    {
                        this.value = "";
                        this.style.color = "#000000";
                    }
                    l_num = j;
                    break;
                }
            }

        });

        l_dom_input.blur(function()
        {
            if(this.value == "")
            {
                if(this.type == "password")
                {
                    this.style.display = "none";
                    $(this).prev().css("display","block");
                }
                else
                {
                    this.value = l_input_values[l_num];
                    this.style.color = "#999999";
                }
            }

        });
    }

    function change_ico(obj)
    {
        var play = $("#playing"),history = $("#history"),setup = $("#setup");
        play.css("border","0");
        history.css("border","0");
        setup.css("border","0");
        play.find("div").css("background-position","-54px -28px");
        history.find("div").css("background-position","-95px -28px");
        setup.find("div").css("background-position","-136px -28px");
        obj.style.borderBottom = "2px solid #22aaaa";
        if(obj==history[0])
        {
            history.find("div").css("background-position","-74px -28px");
        }
        else if(obj==setup[0])
        {
            setup.find("div").css("background-position","-115px -28px");
        }
    }

    function mmq_pick_ack()
    {
        mcloud_agent.dev_msg_listener_add("",function(msg,ref)
        {
            if(msg.result == ""&&g_dev_list_info)
            {
                var dev_list_obj,length = msg.items.length,num;
                for(var i = 0;i<length;i++)
                {
                    for(var k = 0;k<g_dev_list_info.length;k++)
                    {
                        if(g_dev_list_info[k].sn == msg.items[i].sn)
                        {
                            num = k;
                            break;
                        }
                    }
                    if(msg.items[i]&&(msg.items[i].type == "snapshot"||msg.items[i].type == "alert" ||msg.items[i].type == "record"))
                    {
                        g_push_num=parseInt(getCookie(g_dev_list_info[num].sn))+1;
                        setCookie(g_dev_list_info[num].sn,g_push_num);
                        if($("#play_box")[0]&&g_playing_sn == msg.items[i].sn)
                        {
                            var dom_push = $("#push_box");
                            dom_push.fadeIn();
                            dom_push.text(g_push_num);
                        }
                        else if($("#history_main")[0]&&g_playing_sn == msg.items[i].sn&&msg.items[i].msg_id>g_max_id[num])
                        {
                            $(document).ready(function()
                            {
                                setCookie(g_dev_list_info[num].sn,0);
                                var item = msg.items[i],now_params = item.p,url,date = new Date(item.date * 1000).Format("yyyy-MM-dd");
                                g_history_message.unshift(item);
                                for (var j = 0; j < now_params.length; j++)
                                {
                                    if (now_params[j].n == "img_thumb_token" && now_params[j].v != 0 && now_params[j].v != "")
                                    {
                                        url = "http://" + g_location_host + "/ccm/ccm_pic_get.jpg?hfrom_handle=887330&dsess=1&dsess_nid=" + mcloud_agent.create_nid() + "&dsess_sn=" + g_playing_sn + "&dtoken=" + now_params[j].v;
                                        break;
                                    }
                                }
                                if(!url)
                                {
                                    return;
                                }
                                if(g_first_time!= date)
                                {
                                    var time = document.createElement("div"),history_img = document.createElement("div"),
                                        img = document.createElement("img");
                                    time.setAttribute("class", "time_div");
                                    time.innerHTML = date + "  " + g_weekArray[new Date(item.date * 1000).getDay()];
                                    $("#history_main")[0].insertBefore(time,$(".time_div")[0]);
                                    history_img.setAttribute("class", "img_box");
                                    img.setAttribute("class", "video_and_photo");
                                    img.setAttribute("id", item.msg_id);
                                    img.setAttribute("name", item.type);
                                    img.src = url;
                                    history_img.appendChild(img);
                                    $("#history_main")[0].insertBefore(history_img,$(".time_div")[1]);
                                }
                                else
                                {
                                    var history_img = document.createElement("div"),img = document.createElement("img");
                                    history_img.setAttribute("class", "img_box");
                                    img.setAttribute("class", "video_and_photo");
                                    img.setAttribute("id", item.msg_id);
                                    img.setAttribute("name", item.type);
                                    img.src = url;
                                    history_img.appendChild(img);
                                    $("#history_main")[0].insertBefore(history_img,$(".img_box")[0]);
                                }
                                var mark = document.createElement("div");
                                mark.setAttribute("class", "mark_of_pic");
                                mark.innerHTML = (item.type == "snapshot")?mcs_snapshot:(item.type == "record")?mcs_record:mcs_motion_alert;
                                history_img.appendChild(mark);
                                history_class({type:"add"});
                            });

                        }
                        else if($("#dev_list")[0])
                        {
                            var dom_push = $(".push_box");
                            dom_push[num].style.display = "block";
                            dom_push[num].innerHTML = g_push_num;
                        }
                    }
                    if(msg.items[i].type == "device"&&msg.items[i].code == "info"&&num>=0&&msg.items[i].p)
                    {
                        for(var j = 0;j < msg.items[i].p.length;j++)
                        {
                            if(msg.items[i].p[j].n == "status"&&msg.items[i].p[j].v == "Online")
                            {
                                g_dev_list_info[num].stat = "Online";
                                if($("#dev_list")[0])
                                {
                                    $(".dev_state")[num].style.backgroundPosition = "0 -104px";
                                    $(".dev_list_img")[num].style.backgroundImage = "url("+mcloud_agent.pic_url_get({sn:msg.items[i].sn,token:"p3"});+")";
                                }
                            }
                            else if(msg.items[i].p[j].n == "status"&&msg.items[i].p[j].v == "Offline")
                            {
                                g_dev_list_info[num].stat = "Offline";
                                if($("#dev_list")[0])
                                {
                                    $(".dev_state")[num].style.backgroundPosition = "0 -120px";
                                }
                                else if(g_playing_sn == msg.items[i].sn)
                                {
                                    alert_box({text:mcs_equipment_dropped},function()
                                    {
                                        $("#menu_box")[0].innerHTML = "";
                                        $("#main_box").fadeIn();
                                        $("#play_box").remove();
                                        $("#bottom_box")[0].style.display = "block";
                                        $("#setup_list").remove();
                                        $("#history_main").remove();
                                        $("#help_switch").remove();
                                        $("#show_main").remove();
                                        if(g_dom_turn_around)
                                        {
                                            for(var i = 0;i<5;i++)
                                            {
                                                g_dom_turn_around[i].remove();
                                            }
                                        }
                                        dev_list_class();
                                    });

                                }
                            }
                            else if(msg.items[i].p[j].n == "status"&&msg.items[i].p[j].v == "InvalidAuth")
                            {
                                g_dev_list_info[num].stat = "InvalidAuth";
                                if($("#dev_list")[0])
                                {
                                    $(".dev_state")[num].style.backgroundPosition = "0 -112px";
                                }
                            }
                            else if(msg.items[i].p[j].n == "nick")
                            {
                                var new_nick = msg.items[i].p[j].v || msg.items[i].sn.toLowerCase();
                                g_dev_list_info[num].nick = new_nick;
                                if($("#dev_list")[0])
                                {
                                    $($(".dev_nick")[num]).find("span").text(new_nick);
                                }
                            }
                        }
                    }
                }
            }
        });
    }

    function login_class()
    {
        function login_main()
        {
            var dom_main_box;
            if(!(dom_main_box = $("#main_box")[0]))
            {
                dom_main_box = create_dom("main_box",$("#menu_box"));
            }
            dom_main_box.innerHTML = "<div id = 'login_box'>"
                +"<div class = 'normal_input_div'>"
                +"<div id = 'sign_in_name_ico' style='background-position: -220px 0px' class = 'normal_input_ico'></div>"
                +"<input id = 'sign_in_name' type = 'text' value = '"+mcs_username_or_device_id+"' class = 'normal_show_input'>"
                +"</div>"
                +"<div class = 'normal_input_div'>"
                +"<div id = 'sign_in_pwd_ico' style='background-position: -235px 0px' class = 'normal_input_ico'></div>"
                +"<input id = 'sign_in_show_pwd' type = 'text' value = "+mcs_password+" class = 'normal_show_input'>"
                +"<input id = 'sign_in_pwd' type = 'password' value = '' class = 'normal_input'>"
                +"</div>"
                +"<input type = 'button' value = "+mcs_sign_in+" id = 'sign_in_button' class = 'normal_button'>"
                +"<div id = 'visitor_sign_in'>"
                +"<span  class = 'clicked_font'>"+mcs_guest_login+"</span>"
                +"</div>"
                +"<div class = 'normal_div'>"
                +"<span id = 'register' class = 'clicked_font'>"+mcs_sign_up+"</span>"
                +"<span id = 'forget_password' class = 'clicked_font'>"+mcs_forgot_your_password+"</span>"
                +"</div>"
                +"</div>" ;
        }

        function login_event()
        {
            $("#sign_in_button").click(function()
            {
                var srv = g_location_host,
                    user = $("#sign_in_name").val(),
                    password = $("#sign_in_pwd").val(),
                    user_length=user.length,
                    pwd_length=password.length;

                g_dom_loading_gif.fadeIn();

                check_user_and_pass_length(user,password);

                mcloud_agent.sign_in({srv:srv,user:user,password:password}, {user:user,password:password},
                    function(msg,ref)
                    {
                        if(msg.result == "")
                        {
                            if(ref.user.length == 13&&ref.user.substring(0,1) == "1"&&g_login_type!= "IPC")
                            {
                                g_login_type = "dev";
                                if(ref.user.substring(0,3) == "166")
                                {
                                    g_dev_type = "inactive";
                                }
                            }
                            else if(g_login_type!= "IPC")
                            {
                                g_login_type = "";
                            }
                            mmq_pick_ack();
                            setCookie("name",ref.user);
                            setCookie("pass",ref.password);
                            g_sign_in_flag = true;
                            if(ref.password == "admin")
                            {
                                g_add_sn=ref.user;
                                g_old_pwd="admin";
                                change_password();
                            }
                            else
                            {
                                setTimeout(function()
                                {
                                    dev_list_class();
                                },1000);
                            }

                        }

                        else if(msg.result == "accounts.user.offline")
                        {
                            g_dom_loading_gif.fadeOut();
                            help_page();
                        }

                        else
                        {
                            g_dom_loading_gif.fadeOut();
                            alert_box({text:mcs_invalid_password});
                        }
                    });
            });

            $("#forget_password").click(function()
            {
                $("#main_box").remove();

                forget_class();
            });

            $("#register").click(function()
            {
                register_class();
            });



            if(g_login_type == "IPC")
            {
                var user = $("#sign_in_name")[0],pwd = $("#sign_in_show_pwd");
                user.style.color = "#000000";
                user.value = g_login_dev_sn;
                if(g_login_dev_sn == getCookie("name"))
                {
                    pwd.css("display","none");
                    pwd.next().css("display","block");
                    pwd.next().val(getCookie("pass"));
                }
            }

            else if(getCookie("name"))
            {
                var user = $("#sign_in_name")[0],pwd = $("#sign_in_show_pwd");
                user.style.color = "#000000";
                user.value = getCookie("name");
                pwd.css("display","none");
                pwd.next().css("display","block");
                pwd.next().val(getCookie("pass"));
            }



        }

        if(!g_dom_loading_gif)
        {
            var loading_gif = document.createElement("img");
            loading_gif.setAttribute("id","loading_gif");
            loading_gif.src = "imgs" +
            "/loading2.gif";
            $("#page")[0].appendChild(loading_gif);
            g_dom_loading_gif = $(loading_gif);
        }
        common_menu({type:"login"});
        login_main();
        // common_bottom();
        login_event();
        add_input_event([mcs_username_or_device_id,mcs_password]);
        // $("#bottom_box")[0].style.display = "block";
    }

    function register_class(obj)
    {
        function create_register_menu()
        {
            $("#menu_box")[0].innerHTML = "<div id = 'reg_box'>"
                + "<div id = 'back_to_login' class = 'back'>"
                + "<div id = 'back_to_login_ico' class = 'back_ico'></div>"
                + "<span id = 'b_text' class = 'back_text'>"+mcs_sign_in+"</span>"
                + "</div>"
                + "<div class = 'center_text'>"+mcs_sign_up+"</div>"
                + "</div>";
        }

        function create_register_main()
        {
            var dom_register_box;
            if(!(dom_register_box = $("#register_box")[0]))
            {
                dom_register_box = create_dom("register_box",$("#menu_box")[0]);
            }
            dom_register_box.innerHTML = "<div id = 'step'>"
                +"<div id = 'step1' class = 'step_class'>"
                +"<span id = 'step1_text' class = 'step_text'>"+mcs_enter_mailbox+"</span>"
                +"<div style='background-position:-502px 0px' class = 'step_img'></div>"
                +"</div>"
                +"<div id = 'step2' class = 'step_class'>"
                +"<span id = 'step2_text' class = 'step_text'>"+mcs_verification+"</span>"
                +"<div style='background-position:-502px 0px' class = 'step_img'></div>"
                +"</div>"
                +"<div id = 'step3' class = 'step_class_ex'>"
                +"<span id = 'step3_text'class = 'step_text'>"+mcs_set_password+"</span>"
                +"</div>"
                +"</div>"
                +"<div id = 'changed_box'>"
                +"<div id = 'email_box'>"
                +"<div class = 'normal_input_ico' style='background-position:-352px 0px'></div>"
                +"<input type = 'text' value = '"+mcs_input_email_addr+"' class = 'normal_show_input'>"
                +"</div>"
                +"<input id = 'get_code' type = 'button' value = '"+mcs_get_verification_code+"'>"
                +"<div id = 'agreement_div'>"
                +"<div id = 'agreement_img' style='background-position:-367px  0px'></div>"
                +"<span id = 'agreement_text1'>"+mcs_read_and_agree+"</span>"
                +"<span id = 'agreement_text2'>"+mcs_user_agreement+"</span>"
                +"</div>"
                +"<div id = 'protocol'>"
                +"<p>一、总则</p>"
                +"<p>&nbsp;&nbsp;1.1&nbsp;用户应当同意不本协议的条款并按照页面上的提示完成全部的注册程序。"
                +"用户在进行注册程序过程中点击&quot;同意&quot;按钮即表示用户与迈岭公司达成协议，"
                +"完全接受本协议项下地全部条款"
                +"</p>"
                +"<p>"
                +"&nbsp;&nbsp;1.2&nbsp;用户注册成功后，迈岭将给与每个用户一个用户账号及相应地密码，"
                +"该用户账号和密码由用户负责保管；用户应当对其用户账号进行的所有活动和事件负法律责任。"
                +"</p>"
                +"</div>"
                +"</div>";                
        }

        function create_register_bottom()
        {
            // $("#bottom_box")[0].style.display = "none";
        }

        function create_check_page()
        {
            function create_check_main()
            {
                $("#register_box")[0].innerHTML = "<div id = 'step'>"
                    +"<div id = 'step1' class = 'step_class'>"
                    +"<span id = 'step1_text' class = 'step_text'>"+mcs_enter_mailbox+"</span>"
                    +"<div style='background-position:-502px 0px' class = 'step_img'></div>"
                    +"</div>"
                    +"<div id = 'step2' class = 'step_class'>"
                    +"<span id = 'step2_text' class = 'step_text'>"+mcs_verification+"</span>"
                    +"<div style='background-position:-502px 0px' class = 'step_img'></div>"
                    +"</div>"
                    +"<div id = 'step3' class = 'step_class_ex'>"
                    +"<span id = 'step3_text' class = 'step_text'>"+mcs_set_password+"</span>"
                    +"</div>"
                    +"</div>"
                    +"<div id = 'check_email'>"
                    +"<span  class = 'normal_text'><div id = 'check_email_img' style='background-position:-352px 0px'></div>"+g_sign_up_name+"<span>"
                    +"</div>"
                    +"<div id = 'check_tip'>"
                    +"<span id = 'check_tip_text' class = 'normal_text'><div id = 'check_tip_img' style='background-position:-396px 0px'></div>"+mcs_receive_mail+"</span>"
                    +"</div>"
                    +"<div id = 'check_code_main'>"
                    +"<div id = 'check_code_div'>"
                    +"<input id = 'check_code' type = 'text' value = '"+mcs_enter_confirmation_code+"' class = 'special_input'>"
                    +"</div>"
                    +"<div>"
                    +"<input id = 'submit_button' type = 'button' value = '"+mcs_submit+"'>"
                    +"</div>"
                    +"<div>"
                    +"<input id = 'get_again_button' type = 'button' value = '"+mcs_get_code_again+"'>"
                    +"</div>"
                    +"</div>";
            }

            function add_check_event()
            {
                var back,submit;
                back = document.getElementById("back_to_login");
                submit = document.getElementById("submit_button");
                submit.onclick = (function()
                {
                    if($("#check_code").val() == "111111")
                    {
                        create_set_pwd_page();
                    }
                    else
                    {
                        alert_box({text:mcs_verification_code_error});
                    }

                });
                back.onclick = (function()
                {
                    var flag = document.getElementsByClassName("center_text")[0];
                    if(flag.textContent == mcs_action_modify_password)
                    {
                        register_class({type:"forgot"});
                    }
                    else
                    {
                        register_class();
                    }
                });
            }

            create_check_main();
            $("#b_text").text(mcs_enter_mailbox);
            $("#step2")[0].style.borderBottom = "2px solid #22aaaa";
            $("#step1_text").css("color","#000000");
            $("#step2_text").css("color","#000000");
            add_check_event();
            add_input_event([mcs_enter_confirmation_code]);
        }

        function create_set_pwd_page(obj)
        {
            $("#step1")[0].style.border = 0;
            $("#step2")[0].style.border = 0;
            $("#b_text")[0].innerHTML = mcs_back;
            $("#step1_text")[0].style.color = "#000000";
            $("#step2_text")[0].style.color = "#000000";
            $("#step3_text")[0].style.color = "#000000";
            $("#step")[0].style.borderBottom = "2px solid #22aaaa";
            $("#check_tip_text").html("<div id = 'check_tip_img' style='background-position:-396px 0px'></div>"+mcs_code_pass_and_set_pass);
            $("#check_code_main").remove();
            $("#register_box")[0].innerHTML += "<div id = 'set_pwd'>"
                +"<div id = 'input_pwd' class = 'input_pwd_div'>"
                +"<div class = 'input_pwd_img' style='background-position: -235px 0px'></div>"
                +"<input  type = 'text' value = '"+mcs_input_password+"' class = 'normal_show_input'>"
                +"<input  type = 'password' value = '' class = 'normal_input'>"
                +"</div>"
                +"<div id = 'input_pwd_again'  class = 'input_pwd_div'>"
                +"<div class = 'input_pwd_img' style='background-position: -235px 0px'></div>"
                +"<input  type = 'text' value = '"+mcs_confirm_password+"' class = 'normal_show_input'>"
                +"<input  type = 'password' value = '' class = 'normal_input'>"
                +"</div>"
                +"<input type = 'button' value = '"+mcs_set_password+"' id = 'set_pwd_button'>"
                +"</div>";

            function add_set_pwd_event()
            {
                var back,button;
                back = document.getElementById("back_to_login");
                button = document.getElementById("set_pwd_button");
                back.onclick = (function()
                {
                    create_check_page();
                });
                button.onclick = (function()
                {
                    var pwd = $(".normal_input");

                    if(check_password(pwd[0].value,pwd[1].value))
                    {
                        mcloud_agent.sign_up({srv:g_location_host,user:g_sign_up_name,password:pwd[0].value},null,function(msg,ref)
                        {
                            if(msg.result!= "")
                            {
                                error_handling(msg.result);
                            }
                            else
                            {
                                set_prompt({text:mcs_successful_whether_login});
                                $("#ok").click(function()
                                {
                                    $("#prompt_div").remove();
                                    $("#prompt").remove();
                                    setCookie("name",g_sign_up_name);
                                    setCookie("pass",$(".normal_input")[0].value);
                                    $("#register_box").remove();
                                    login_class();
                                    $("#sign_in_button").click();
                                });
                                $("#cancel").click(function()
                                {
                                    $("#prompt_div").remove();
                                    $("#prompt").remove();
                                    $("#register_box").remove();
                                    login_class();
                                });
                            }
                        });
                    }
                });
            }
            add_set_pwd_event();
            add_input_event([mcs_input_password,mcs_confirm_password]);

        }

        function add_register_event()
        {
            var get_code = $("#get_code"),
                back = $("#back_to_login"),
                agreement = $("#agreement_img"),
                user_agreement = $("#agreement_text2");
            get_code.click(function()
            {
                if(g_agree_flag)
                {
                    g_sign_up_name = $(".normal_show_input").val();
                    re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
                    if(re.test(g_sign_up_name))
                    {
                        create_check_page();
                    }
                    else
                    {
                        alert_box({text:mcs_invalid_email_addr});
                    }
                }
            });

            back[0].onclick=(function()
            {
                $("#register_box").remove();
                login_class();
            });

            agreement.click(function()
            {
                if(g_agree_flag)
                {
                    this.style.backgroundPosition="-382px 0";
                    g_agree_flag=false;
                }
                else
                {
                    this.style.backgroundPosition="-367px 0";
                    g_agree_flag=true;
                }
            });

            user_agreement.click(function()
            {
                var dom_protocol = $("#protocol");
                if(dom_protocol.is(":hidden"))
                {
                    dom_protocol.show();
                }
                else
                {
                    dom_protocol.hide();
                }
            });

        }

        $("#main_box").remove();
        create_register_menu();
        create_register_main();
        create_register_bottom();
        add_register_event();
        add_input_event([mcs_input_email_addr]);

        document.getElementById("step1_text").style.color = "#000000";

        if(obj&&obj.type == "forgot")
        {
            $(".center_text").html(mcs_action_modify_password);
            $("#agreement_div")[0].style.display = "none";
            $("#protocol")[0].style.display = "none";
        }
    }

    function forget_class()
    {
        function create_forget_menu()
        {
            $("#menu_box")[0].innerHTML = "<div id = 'reg_box'>"
                + "<div id = 'back_to_login' class = 'back'>"
                + "<div id = 'back_to_login_ico' class = 'back_ico'></div>"
                + "<span id = 'b_text' class = 'back_text'>"+mcs_sign_in+"</span>"
                + "</div>"
                + "<div >"
                + "<div class = 'center_text'>"+mcs_forgot_your_password+"</div>"
                + "</div>"
                + "</div>";
        }

        function create_forget_main()
        {
            var dom_forgot_page;
            dom_forgot_page = create_dom("forgot_page",$("#menu_box")[0]);
            dom_forgot_page.innerHTML = "<p style = 'font-size:14px'>"+mcs_forgot_cloud_account_pass+"</p>"
                +"<div>"
                +"<button id = 'forget_pwd_button' class = 'normal_button'>"
                +"<span>"+mcs_retrieve_account_pass+"</span>"
                +"</button>"
                +"</div>"
                +"<div class = 'normal_div' id = 'info'>"
                +"<div style='background-position:-510px 0px' class = 'normal_ico'></div>"
                +"<span class = 'special_text'>"+mcs_forgot_device_password+"</span>"
                +"<div id = 'info_ex_ico' style='background-position:-405px -1px'></div>"
                +"</div>"
                +"<div id = 'help_text'>"
                +"<p id = 'sp_text'>"+mcs_restart_step1+"</p>"
                +"<div class = 'sp_div'>"
                +"<div style='background-position:-446px 0px' class = 'normal_ico'></div>"
                +"<div style='background-position:-461px 0px'class = 'normal_ico'></div>"
                +"<div id = 'pin_f' style='background-position:-476px 0px' class = 'normal_ico'></div>"
                +"</div>"
                +"<p class = 'normal_text'>"+mcs_restart_step2+"</p>"
                +"<p class = 'normal_text'>"+mcs_restart_step3+"</p>"
                +"<p class = 'normal_text'>"+mcs_restart_step4+"</p>"
                +"<p class = 'normal_text'>"+mcs_restart_step5s+"</p>"
                +"</div>";
        }

        function add_forget_event()
        {
            $("#back_to_login").click(function()
            {
                $("#forgot_page").remove();
                login_class();
            });

            $("#forget_pwd_button").click(function()
            {
                $("#forgot_page").remove();
                register_class({type:"forgot"});
            });

            $("#info").click(function()
            {
                var help_info = $("#help_text"),ico = $("#info_ex_ico")[0];
                if(help_info.is(":hidden"))
                {
                    help_info.fadeIn();
                    ico.style.visibility = "visible";
                }
                else
                {
                    help_info.fadeOut();
                    ico.style.visibility = "hidden";
                }
            });
        }

        create_forget_menu();
        create_forget_main();
        add_forget_event();
    }

    function service_class()
    {

        function create_service_menu() {
            $("#menu_box")[0].innerHTML = "<div id = 'problem'>"
                + "<div id = 'comm_problem'>"
                + "<span>常见问题</span>"
                + "</div>"
                + "<div id = 'all_problem'>"
                + "<span>所有问题</span>"
                + "</div>"
                + "<div id = 'my_problem'>"
                + "<span>我的问题</span>"
                + "</div>"
                + "</div>"
                + "<div id = 'edit' title = '编辑主题' style='cursor:pointer'>"
                + "</div>";
        }

        function create_service_main() {
            if (!document.getElementById("service_page")) {
                var service = document.createElement("div");
                service.setAttribute("id", "service_page");
                $(service).insertAfter($("#menu_box")[0]);
            }
            $("#main_box").remove();
            document.getElementById("service_page").innerHTML = "<div class = 'problem'>"
                + "<div class = 'title'>云摄像机，开启空间智能化新生活</div>"
                + "<div class = 'text'>云计算是基于云计算、云监控、云存储、云存储平台基础上推出的一款造型精美并能提供高清画质实时观看的新型智能设备</div>"
                + "</div>";
        }

        function add_service_event() {
            var doms = [$("#comm_problem")[0], $("#my_problem")[0], $("#all_problem")[0]];

            function change_border(obj) {
                for (var i = 0; i < 3; i++) {
                    doms[i].style.borderBottom = "0";
                }
                obj.style.borderBottom = "1px solid #22aaaa";
            }

            for (var i = 0; i < 3; i++) {
                doms[i].onclick = (function () {
                    change_border(this);
                });
            }
            $("#edit")[0].onclick = (function () {

                $("#service_page").remove();
                $("#bottom_box")[0].style.display = "none";
                create_edit();
            });
            $(".problem").click(function () {
                create_problem();
            });
        }

        function create_edit()
        {
            function create_edit_menu()
            {
                $("#menu_box")[0].innerHTML = "<div class = 'back'>"
                    + "<div  class = 'back_ico'></div>"
                    + "<span class = 'back_text'>我的问题</span>"
                    + "</div>"
                    + "<div class = 'center_text'>编辑主题</div>";
            }

            function create_edit_main()
            {
                var div = document.createElement("div");
                div.setAttribute("id", "main_box");
                $(div).insertAfter($("#menu_box")[0]);
                div.innerHTML = "<input type = 'text' id = 'title_input' value = '输入主题' style='margin-left:50px'>"
                    + "<textarea clos = '20' rows = '5' id = 'content' style='margin-left:50px'>在此输入您的内容</textarea>"
                    + "<input type = 'button' value = '提交' class = 'normal_button' style='margin-left:50px;width:72%'>";
            }

            function add_edit_event()
            {
                $(".back").click(function () {
                    service_class();
                    $("#service_page")[0].style.display = "block";
                    $("#bottom_box")[0].style.display = "block";
                });
                $(".normal_button").click(function () {
                    var title, content;
                    title = $("#title_input")[0].value;
                    content = $("#content")[0].value;
                    if (title == "" || title == "输入主题") {
                        alert_box({text:"标题不能为空"});
                        return;
                    }
                    if (content == "" || content == "在此输入您的内容") {
                        alert_box({text:"内容不能为空"});
                        return;
                    }
                    service_class();
                    $("#bottom_box")[0].style.display = "block";
                });
                $("#content")[0].onfocus = (function () {
                    if (this.value == "在此输入您的内容") {
                        this.value = "";
                        this.style.color = "#000000";
                    }
                });
                $("#content")[0].onblur = (function () {
                    if (this.value == "") {
                        this.value = "在此输入您的内容";
                        this.style.color = "#999999";
                    }
                });
            }

            create_edit_menu();
            create_edit_main();
            add_edit_event();
            add_input_event(["输入主题"]);
        }

        function create_problem() {
            g_send_flag = true;
            function create_problem_menu()
            {
                $("#menu_box")[0].innerHTML = "<div class = 'back'>"
                    + "<div  class = 'back_ico'></div>"
                    + "<span class = 'back_text'>我的问题</span>"
                    + "</div>"
                    + "<div id = 'share' title='分享'>"
                    + "</div>";
            }

            function create_problem_main()
            {
                document.getElementById("service_page").innerHTML = "<div class = 'articles'>"
                    + "<div class = 'title_box'>"
                    + "<div class = 'title'>云摄像机，开启空间智能化新生活</div>"
                    + "<span class = 'author'>开发组&lt;dev@mipcm.com&gt;</span>"
                    + "<span class = 'edit_time'>2014-08-27&nbsp;8:15</span>"
                    + "</div>"
                    + "<div class = 'main'>"
                    + "<p class = 'main_text'>&nbsp;&nbsp;&nbsp;&nbsp;盖茨曾经把自己的家建成高科技的样板工程,他认为&quot;未来之家&quot;"
                    + "包括可以控制阳光照进屋子的时间，身在异地也能知晓家中的情况等等。</p>"
                    + "<p class = 'main_text'>"
                    + "&nbsp;&nbsp;&nbsp;&nbsp;云摄像机主要是表现为智能便捷，通过智能手机可以使其旋转，俯仰，可以及大范围地监控场所安全，并可以手机操作播放保存视频和截屏等。"
                    + "</p>"
                    + "</div>"
                    + "</div>";
            }

            function create_problem_bottom()
            {
                $("#bottom_box")[0].style.display = "none";
                if (g_sm_flag) {
                    $("#page")[0].innerHTML  += "<div class = 'send_message'>"
                        + "<div class = 'sm_main'>"
                        + "<button class = 'add_pic'>"
                        + "<div  class = 'add_pic_img'></div>"
                        + "</button>"
                        + "<input class = 'sm_input' type = 'text' value = '在此输入您的话'>"
                        + "<button class = 'send'>"
                        + "<div class = 'send_img'></div>"
                        + "</button>"
                        + "</div>"
                        + "</div>";
                    g_sm_flag = false;
                }

            }

            function add_problem_event()
            {
                $(".back")[0].onclick = (function () {
                    $(".send_message").remove();
                    $("#bottom_box")[0].style.display = "block";
                    common_bottom();
                    $("#service_ico").css("background-position","-168px 0px");
                    $("#device_list_ico").css("background-position","-140px 0px");
                    service_class();
                });
                $(".send")[0].onclick = (function () {
                    var text = $("input:text")[0].value;
                    if (text == "" || text == "在此输入您的话") {
                        alert_box({text:"输入框不能为空"});
                        return;
                    }
                    else {
                        if (g_send_flag) {
                            g_send_flag = false;
                            $(".author").css("display","none");
                            $(".edit_time").css("float","left");
                            $(".title_box")[0].style.borderBottom = "0";

                            $(".title_box")[0].innerHTML  += "<div class = 'edit'>"
                                + "</div>";
                            $(".main")[0].innerHTML = "<fieldset class = 'message_box'>"
                                + "<legend class = 'box_time'>2014-08-27&nbsp;8:15</legend>"
                                + "<div class = 'cs'>"
                                + "<p>云摄像机是基于云计算、云监控、云存储平台基础上推出的一款造型精美并能提供高清画质实时观看的新型智能设备</p>"
                                + "<span class = 'left_triangle'></span>"
                                + "</div>"
                                + "</div>"
                                + "<div class = 's'>"
                                + "<p>我是按这个步骤来得，手机体验步骤</p>"
                                + "<p>1.安卓手机：在安卓市场或安智市场或PLAY上带你下载软件：mipc</p>"
                                + "<span class = 'right_triangle'></span>"
                                + "</div>"
                                + "</fieldset>";
                            $(".edit")[0].onclick = (function () {
                                create_problem();
                            });
                        }

                        var message = document.createElement("div");
                        message.setAttribute("class", "cs");
                        message.innerHTML = $(".cs")[0].innerHTML;
                        $(message).find("p")[0].innerHTML = $(".sm_input")[0].value;
                        $(".message_box")[0].appendChild(message);
                        $("input:text")[0].value = "";
                    }
                });
            }

            create_problem_menu();
            create_problem_main();
            create_problem_bottom();
            add_problem_event();
            add_input_event(["在此输入您的话"]);
        }

        g_sm_flag = true;
        create_service_menu();
        create_service_main();
        add_service_event();
    }

    function my_class()
    {
        function create_main()
        {
            var dom_my_box;
            if(!(dom_my_box = $("#my_box")[0]))
            {
                dom_my_box = create_dom("my_box",$("#menu_box"));
            }
            dom_my_box.innerHTML = "<input type = 'button' value = '"+mcs_user_password+"' class = 'my_button'>"
                +"<div id = 'my_admin_pwd'>"
                +"<div id = 'ap' class = 'list_right_item'>"
                +"<span class = 'attribute_key_text'>"+mcs_admin_password+":</span>"
                +"<input type = 'password' id = 'admin_pwd_input' class = 'list_right_input'>"
                +"</div>"
                +"<div id = 'new_ap' class = 'list_right_item_ex'>"
                +"<span class = 'attribute_key_text'>"+mcs_new_password+":</span>"
                +"<input type = 'password' id = 'new_admin_pwd_input' class = 'list_right_input'>"
                +"</div>"
                +"<div id = 'new_ap_a' class = 'list_right_item_ex'>"
                +"<span class = 'attribute_key_text'>"+mcs_confirm_new_password+":</span>"
                +"<input type = 'password' id = 'new_admin_pwd_input_re' class = 'list_right_input'>"
                +"</div>"
                +"<input type = 'button' id = 'change_ap' class = 'change_button' value = "+mcs_ok+">"
                +"</div>"
                +"<input id = 'sign_out_button' type = 'button' value = '"+mcs_guest_password+"' class = 'my_button'>"
                +"<div id = 'my_visitors_pwd'>"
                +"<div id = 'vp' class = 'list_right_item'>"
                +"<span class = 'attribute_key_text'>"+mcs_admin_password+":</span>"
                +"<input type = 'password' id = 'admin_pwd_input' class = 'list_right_input'>"
                +"</div>"
                +"<div id = 'new_vp' class = 'list_right_item_ex'>"
                +"<span class = 'attribute_key_text'>"+mcs_new_password+":</span>"
                +"<input type = 'password' id = 'new_admin_pwd_input' class = 'list_right_input'>"
                +"</div>"
                +"<div id = 'new_vp_a' class = 'list_right_item_ex'>"
                +"<span class = 'attribute_key_text'>"+mcs_confirm_new_password+":</span>"
                +"<input type = 'password' id = 'new_admin_pwd_input_re' class = 'list_right_input'>"
                +"</div>"
                +"<input type = 'button' id = 'change_vp' class = 'change_button' value = "+mcs_ok+">"
                +"</div>"
                +"<div>"
                +"<input id = 'sign_out_button' type = 'button' value = "+mcs_exit+" class = 'my_button'>"
                +"</div>"
                +"<input id = 'about_button' type = 'button' value = "+mcs_about+" class = 'my_button'>";
        }

        function add_me_event()
        {
            var buttons = $(".my_button"),buttons_e = $(".change_button");
            if(!g_sign_in_flag)
            {
                $(buttons[0]).fadeOut();
                $(buttons[1]).fadeOut();
                $(buttons[2]).fadeOut();
            }

            buttons[0].onclick = (function()
            {
                var p = $(this).next();
                if(p.is(":hidden"))
                {
                    p.fadeIn();
                    p.next().next().fadeOut();
                }
                else
                {
                    p.fadeOut();
                }
            });

            buttons[1].onclick = (function()
            {
                var p = $(this).next();
                if(p.is(":hidden"))
                {
                    p.fadeIn();
                    $(this).prev().fadeOut();
                }
                else
                {
                    p.fadeOut();
                }
            });

            buttons[2].onclick = (function()
            {
                set_prompt({text:mcs_prompt_exit});
                $("#ok").click(function()
                {
                    $("#prompt_div").remove();
                    $("#prompt").remove();
                    g_dom_loading_gif.fadeIn();
                    mcloud_agent.sign_out(null,function(msg,ref)
                    {
                        g_dom_loading_gif.fadeOut();
                        if(msg.result!= "")
                        {
                            error_handling(msg.result);
                        }
                        else
                        {
                            g_sign_in_flag = false;
                            $("#my_box").remove();
                            login_class();
                        }
                    });
                });
                $("#cancel").click(function()
                {
                    $("#prompt_div").remove();
                    $("#prompt").remove();
                });
            });

            buttons[3].onclick = (function()
            {
                alert_box({text:mcs_software_version+":"+g_web_client_v});
            });

            for(var i = 0;i<2;i++)
            {
                buttons_e[i].onclick = (function()
                {
                    var input = $("input:password"),i = (this == $(".change_button")[0])?0: 1,
                        old = input[0+i*3].value, new_ = input[1+i*3].value,confirm = input[2+i*3].value;
                    g_dom_loading_gif.fadeIn();

                    if(check_password(new_,confirm,old))
                    {
                        mcloud_agent.account_passwd_set({old_pass:old,new_pass:new_,is_guest:i},{is_guest:i,pass:new_},function(msg,ref)
                        {
                            g_dom_loading_gif.fadeOut();
                            if(msg.result== "")
                            {
                                show_message_box({text:mcs_set_successfully});
                                if(ref.is_guest==0)
                                {
                                    setCookie("pass",ref.pass);
                                }
                            }
                            else if(msg.result=="accounts.pass.invalid")
                            {
                                alert_box({text:mcs_invalid_password});
                            }
                            else
                            {
                                error_handling(msg.result);
                            }
                        });
                    }
                });
            }
        }

        common_menu({type:"login"});
        create_main();
        add_me_event();

        if(g_login_type == "IPC"||g_login_type == "dev")
        {
            var button = $(".my_button");
            button[0].style.display = "none";
            button[1].style.display = "none";
        }

    }

    function dev_list_class()
    {
        function create_dev_list_main()
        {
            function load_imgs()
            {

                var images = new Array(),push_num;
                for(var i = 0;i<g_dev_list_info.length;i++)
                {
                    push_num = parseInt(getCookie(g_dev_list_info[i].sn));
                    g_push_num = (push_num)?push_num:0;
                    if(!g_load_images[i])
                    {
                        g_load_images[i] = new Image();
                    }
                    images[i] = new Image();
                    images[i].src = mcloud_agent.pic_url_get({sn:g_dev_list_info[i].sn,token:"p2"});
                    images[i].onload = (function()
                    {
                        if($("#dev_list")[0])
                        {
                            g_online_num--;
                            if(g_online_num == 0)
                            {
                                g_dom_loading_gif.fadeOut();
                            }
                            for(var j = 0;j<g_dev_list_info.length;j++)
                            {
                                if(this == images[j])
                                {
                                    break;
                                }
                            }
                            g_load_images[j].src = this.src;
                            $(".dev_list_img")[j].style.backgroundImage= "url("+this.src+")";
                            /*this is for IE8 replace background-size*/
                            if($.browser.version == "8.0"||$.browser.version == "7.0"||$.browser.version == "6.0")
                            {
                            	$(".dev_list_img")[j].style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod = 'scale')";
                                $(".dev_list_img")[j].filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = this.src;
                            }
                        }
                    });
                    setCookie(g_dev_list_info[i].sn,g_push_num);
                }

            }
            mcloud_agent.devs_refresh({},null,function(msg,ref)
            {
                if(msg.result == "InvalidSession")
                {
                    create_dev_list_main();
                }
                else if(msg.result == "")
                {
                    var dev_list;
                    g_dev_list_info = mcloud_agent.devs.list;   
                    if(g_dev_list_info.length==0)
                    {
                    	g_dom_loading_gif.fadeOut();
                    }    
                    else if(!(dev_list = $("#dev_list")[0])&&!$("#my_box")[0])
                    {
                        g_dom_loading_gif.fadeOut();
                    	  load_imgs();
                        dev_list = create_dom("dev_list",$("#menu_box"));
                        g_online_num=0;
                        for(var i = 0;i<g_dev_list_info.length;i++)
                        {
                            var divs = document.createElement("div"),nick = document.createElement("div"),
                                push_box = document.createElement("div");
                            divs.setAttribute("class","dev_list_img");
                            nick.setAttribute("class","dev_nick");
                            push_box.setAttribute("class","push_box");
                            var sn = (g_dev_list_info[i].nick)?g_dev_list_info[i].nick:g_dev_list_info[i].sn;
                            nick.innerHTML = "<div class = 'dev_state'></div>"+"<span >"+sn+"</span>";
                            divs.appendChild(nick);
                            divs.appendChild(push_box);
                            /*this is for IE8 replace background-size*/
                            if($.browser.version == "8.0"||$.browser.version == "7.0"||$.browser.version == "6.0")
                            {
                                divs.style.backgroundImage = "url(/imgs/pic.png)";
                            }
                            else
                            {
                                divs.style.backgroundImage = (g_load_images[i].src)?"url("+g_load_images[i].src+")":"url(/imgs/pic.png)";
                            }
                            dev_list.appendChild(divs);
                            if(g_push_num=parseInt(getCookie(g_dev_list_info[i].sn)))
                            {
                                push_box.innerHTML = g_push_num;
                                push_box.style.display = "block";
                            }
                            if(g_dev_list_info[i].stat == "Offline")
                            {
                                $(".dev_state")[i].style.backgroundPosition = "0 -120px";
                            }
                            else if(g_dev_list_info[i].stat == "InvalidAuth")
                            {
                                $(".dev_state")[i].style.backgroundPosition = "0 -112px";
                            }
                            else
                            {
                                $(".dev_state")[i].style.backgroundPosition = "0 -104px";
                            }
                            if(g_dev_list_info[i].stat == "Online")
                            {
                                g_online_num++;
                            }

                        }
                    }
                    common_menu({type:"dev_list"});
                    add_dev_list_event();
                }
                else
                {
                    error_handling(msg.result);
                }
            });
        }

        function add_dev_list_event()
        {
            var imgs = $(".dev_list_img"),length = imgs.length;
            imgs.click(function()
            {
                g_dom_loading_gif.fadeIn();
                for(var j = 0;j<length;j++)
                {
                    if(this == imgs[j])
                    {
                        g_playing_num = j;
                        g_playing_sn = g_dev_list_info[j].sn;

                        if(g_dev_list_info[j].stat == "Online")
                        {
                            $("dev_list").html();
                            if(g_dev_list_info[j].type == "BOX"){
                                box_list(mcloud_agent.devs.list[j]);
                            }else{
                                play_class({num:j});
                            }
                        }
                        else if(g_dev_list_info[j].stat == "InvalidAuth")
                        {
                            g_dom_loading_gif.fadeOut();
                            refill_pwd(this);
                        }
                        else
                        {
                            g_dom_loading_gif.fadeOut();
                            alert_box({text:mcs_device_offline});
                        }
                        break;
                    }
                }
            });

            imgs.contextmenu(function(event)
            {
                var dom_menu_box,num,event = event || window.event;
                if(!$("#right_key_menu")[0])
                {
                    dom_menu_box = document.createElement("div");
                    dom_menu_box.setAttribute("id","right_key_menu");
                    dom_menu_box.innerHTML = "<div id = 'delete_item' class = 'menu_item'>"+mcs_delete_device+"</div>";
                    $("#dev_list").append(dom_menu_box);
                }
                else
                {
                    dom_menu_box = $("#right_key_menu")[0];
                }
                dom_menu_box.style.top = event.clientY + "px";
                dom_menu_box.style.left = event.clientX + "px";
                var dom_delete = $("#delete_item");
                for(var i = 0 ; i<length ; i++)
                {
                    if(this == imgs[i])
                    {
                        num=i;
                        break;
                    }
                }
                dom_delete[0].onclick = function()
                {
                    set_prompt({text:mcs_are_you_sure_delete});
                    $("#ok").click(function()
                    {
                        $("#prompt_div").remove();
                        $("#prompt").remove();
                        mcloud_agent.dev_del({sn:g_dev_list_info[num].sn},null,function(msg,ref)
                        {
                        if(msg.result =="")
                        {
                            show_message_box({text:mcs_set_successfully});
                            $("#dev_list").remove();
                            dev_list_class();
                        }
                        });
                    });
                    $("#cancel").click(function()
                    {
                        $("#prompt_div").remove();
                        $("#prompt").remove();
                    });

                };

                document.onclick = function(event)
                {
                    if(!$("#dev_list")[0])
                    {
                        document.onclick = null;
                        return;
                    }
                    var event = event || window.event,
                        dom_menu = $("#right_key_menu");
                        if(dom_menu){
                            left = dom_menu[0].offsetLeft,
                            top = dom_menu[0].offsetTop,
                            width = dom_menu[0].offsetWidth,
                            height = dom_menu[0].offsetHeight;
                        }
                        
                        event_X = event.clientX,
                        event_Y = event.clientY;
                    if(event_X<left||event>left+width||event_Y<top||event_Y>top+height)
                    {
                        dom_menu.remove();
                    }

                };

                return false;
            });

            $("#add_dev").click(function()
            {
                $("#dev_list").remove();
                $("#add_dev_box").show();
                add_dev_class();
            });
        }

        function refill_pwd(obj)
        {
            var box;
            box = document.createElement("div");
            box.setAttribute("class","refill_pwd_box");
            box.innerHTML = "<div class = 'refill_pwd_title'>"+mcs_re_enter_the_password+"</div>"
            +"<div class = 'refill_pwd_name'>"
                +"<div style = 'float: left;width:70px'>"+mcs_device_id+"</div>"
                +"<div class = 'dev_sn'>"+g_playing_sn+"</div>"
            +"</div>"
            +"<div class = 'refill_pwd_pass'>"
                +"<div style='float:left;width:70px'>"+mcs_password+"</div>"
                +"<input type = 'text' value = '"+mcs_input_password+"' class = 'refill_pwd_pass_show_input'>"
                +"<input type = 'password' value = '' class = 'refill_pwd_pass_input'>"
            +"</div>"
            +"<input type = 'button' id = 'refill_pwd_button_y' value = "+mcs_ok+">"
            +"<input type = 'button' id = 'refill_pwd_button_n' value = "+mcs_cancel+">";

            $("#page")[0].appendChild(box);

            $("#refill_pwd_button_y").click(function()
            {
                g_dom_loading_gif.fadeIn();
                var pass = $(".refill_pwd_pass_input").val();
                mcloud_agent.dev_add({sn:g_playing_sn,pass:pass},{pass:pass},function(msg,ref)
                {
                    if(msg.result!= "")
                    {
                        g_dom_loading_gif.fadeOut();
                        alert_box({text:mcs_invalid_password});
                    }
                    else
                    {
                        g_dom_loading_gif.fadeOut();
                        g_dev_list_info[g_playing_num].stat = "Online";
                        $(box).remove();
                        obj.style.backgroundImage = "url("+mcloud_agent.pic_url_get({sn:g_playing_sn,token:"p3"})+")";
                        $(obj).find(".dev_nick").find(".dev_state")[0].style.backgroundPosition = "0 -104px";
                        if(ref.pass == "admin")
                        {
                            set_prompt({text:mcs_password_too_simple_hint});
                            $("#ok").click(function()
                            {
                                g_is_back_to_dev_list = true;
                                $("#prompt_div").remove();
                                $("#prompt").remove();
                                setup_class();
                                $("#admin_pwd").click();

                            });
                            $("#cancel").click(function()
                            {
                                $("#prompt_div").remove();
                                $("#prompt").remove();
                            });
                        }
                    }
                });
            });

            $("#refill_pwd_button_n").click(function()
            {
                $(box).remove();
            });
            add_input_event([mcs_input_password]);
            return;
        }

        $("#help_box").remove();
        $("#main_box").remove();
        $("#my_box").remove();
        g_playing_sn = null;

        create_dev_list_main();
        // common_bottom();
    }

    function add_dev_class(obj)
    {
        var l_selected_wifi_name = mcs_enter_wifi;
        function create_add_dev_menu()
        {
            $("#menu_box")[0].innerHTML = "<div id = 'reg_box'>"
                + "<div id = 'back_to_list' class = 'back'>"
                + "<div id = 'back_to_list_ico'  class = 'back_ico'></div>"
                + "<span id = 'b_text' class = 'back_text'>"+mcs_device_list+"</span>"
                + "</div>"
                + "<div class = 'center_text'>"+mcs_input_device_id+"</div>"
                + "</div>";
        }

        function create_add_dev_main()
        {
            var dom_add_dev_box;
            if(!(dom_add_dev_box = $("#add_dev_box")[0]))
            {
                dom_add_dev_box = create_dom("add_dev_box",$("#menu_box")[0]);
            }
            dom_add_dev_box.innerHTML = "<div id = 'input_id'>"
                +"<div id = 'dev_id' class = 'normal_input_div'>"
                +"<div class = 'normal_input_ico' style='background-position:-510px 0px'></div>"
                +"<input id='dev_id_input' type = 'text' class = 'normal_show_input' value = '"+mcs_device_id +"'>"
                +"</div>"
                +"<input id = 'next' type = 'button' value = "+mcs_action_next+" class = 'normal_button'>"
                +"<div id = 'warning'>"
                +"<div style='background-position:-525px 0px' class = 'warning_ico'></div>"
                +"<span class = 'warning_text'>设备已经存在</span>"
                +"</div>"
                +"</div>";
        }

        function add_dev_event()
        {
            $("#back_to_list").click(function()
            {
                $("#add_dev_box").hide();
                g_dom_loading_gif.fadeIn();
                dev_list_class();
                g_dom_loading_gif.fadeOut();
            });
            $("#next").click(function()
            {
                var dev_id = $(".normal_show_input").val().toLowerCase();
                g_dom_loading_gif.fadeIn();
                if(dev_id == ""||dev_id == mcs_device_id.toLowerCase())
                {
                    g_dom_loading_gif.fadeOut();
                    alert_text({text:mcs_blank_device_id});
                }
                else
                {
                    for(var i = 0;i<g_dev_list_info.length;i++)
                    {
                        if(g_dev_list_info[i].dev_id == dev_id)
                        {
                            alert_box({text:mcs_device_existed});
                            g_dom_loading_gif.fadeOut();
                            return 0;
                        }
                    }
                    mcloud_agent.dev_add({sn:dev_id,pass:""},null,function(msg,ref)
                    {
                        g_dom_loading_gif.fadeOut();
                        switch(msg.result)
                        {
                            case "":
                                g_add_sn = dev_id;
                                dev_id = "";
                                create_link_way();
                                break;

                            case "accounts.user.invalid":
                                var dom_warning=$("#warning");
                                dom_warning.fadeIn("fast",function()
                                {
                                    dom_warning.fadeOut(2000);
                                });
                                $(".warning_text").text(mcs_device_not_exist);
                                break;

                            case "accounts.user.offline":
                                g_add_sn = $(".normal_show_input")[0].value.toLowerCase();
                                $(".normal_show_input")[0].value = "";
                                create_link_way();
                                break;


                            case "accounts.pass.invalid":
                                g_add_sn = $(".normal_show_input")[0].value.toLowerCase();
                                $(".normal_show_input")[0].value = "";
                                create_add();
                                break;

                            default :
                                error_handling(msg.result);
                        }
                    });

                }
            });
        }

        function create_link_way()
        {
            function create_link_way_menu()
            {
                $("#menu_box")[0].innerHTML = "<div id = 'reg_box'>"
                    + "<div id = 'back_to_input' class = 'back'>"
                    + "<div id = 'back_to_input_ico' class = 'back_ico'></div>"
                    + "<span id = 'b_text' class = 'back_text'>"+mcs_input_device_id+"</span>"
                    + "</div>"
                    + "<div class = 'center_text'>"+mcs_select_network+"</div>"
                    + "</div>";
            }

            function create_link_way_main()
            {
                $("#add_dev_box")[0].innerHTML = "<div id = 'link_way'>"
                    +"<div class = 'normal_div'>"
                    +"<div style='background-position:-510px 0px' class = 'normal_ico'></div>"
                    +"<span class = 'normal_text'>"+mcs_device_id+":"+g_add_sn+"</span>"
                    +"</div>"
                    +"<div class = 'special_div'>"
                    +"<img src = 'imgs/loading2.gif' class = 'loading_ico'>"
                    +"<span class = 'normal_text'>"+mcs_state_wait_device_online+"</span>"
                    +"</div>"
                    +"<div class = 'normal_div'>"+mcs_select_network+"</div>"
                    +"<button id = 'ethernet' class = 'normal_button'>"
                        +"<div class='button_box'>"
                            +"<div class = 'button_ico' style='background-position:-221px -14px'></div>"
                            +"<span style='float: left'>"+mcs_ethernet+"</span>"
                        +"</div>"
                    +"</button>"
                    +"<button id = 'wifi' class = 'normal_button'>"
                        +"<div class='button_box'>"
                            +"<div class = 'button_ico' style='background-position:-236px -14px'></div>"
                            +"<span style='float: left'>"+mcs_wifi+"</span>"
                        +"</div>"
                    +"</button>"
                    +"<div id='tip_info'>"
                    +"<span class = 'tip_text'><div class = 'tip_ico'></div>"+mcs_needs_to_open_the_DHCP+"</span>"
                    +"</div>"
                    +"</div>";
            }

            function add_link_way_event()
            {
                $("#back_to_input")[0].onclick = (function()
                {
                    g_dom_loading_gif.fadeOut();
                    add_dev_class();
                });

                $("#ethernet")[0].onclick = (function()
                {
                    create_install_dev({type:"ethernet"});
                });
                $("#wifi")[0].onclick = (function()
                {

                    create_install_dev({type:"wifi"});
                });
                function is_dev_online()
                {
                    mcloud_agent.dev_add({sn:g_add_sn,pass:""},null,function(msg,ref)
                    {
                        if($("#tip_info")[0])
                        {
                            if(msg.result == "accounts.pass.invalid")
                            {
                                g_dom_loading_gif.fadeOut();
                                create_add();
                            }
                            else
                            {
                                is_dev_online();
                            }
                        }

                    });
                }
                is_dev_online();
            }

            create_link_way_menu();
            create_link_way_main();
            add_link_way_event();
            g_dom_loading_gif.fadeIn();
        }

        function create_install_dev(obj)
        {
            function install_dev_main(obj)
            {
                $("#add_dev_box")[0].innerHTML = "<div id = 'link_way'>"
                    +"<div class = 'normal_div'>"
                    +"<div class = 'normal_ico' style='background-position:-510px 0px'></div>"
                    +"<span class = 'normal_text'>"+mcs_device_id+":"+g_add_sn+"</span>"
                    +"</div>"
                    +"<div class = 'special_div'>"
                    +"<img src = 'imgs/loading2.gif' class = 'loading_ico'>"
                    +"<span class = 'normal_text'>"+mcs_state_wait_device_online+"</span>"
                    +"</div>"
                    +"<div class = 'install_step'>"
                    +"<span class = 'normal_text'>"+mcs_installation_steps+":</span>"
                    +"<p>"+msc_link_step1+"</p>"
                    +"<p>"+msc_link_step2+"</p>"
                    +"<p>"+msc_link_step3+"</p>"
                    +"</div>"
                    +"<div id='tip_info'>"
                    +"<div  class = 'tip_ico'></div>"
                    +"<span class = 'tip_text'>"+msc_link_tip+"</span>"
                    +"</div>"
                    +"</div>";
                if(obj.type == "wifi")
                {
                    $(".install_step")[0].innerHTML = "<span class = 'normal_text'>"+mcs_installation_steps+":</span>"
                        +"<p>"+mcs_adhoc_step1+"</p>"
                        +"<p>"+mcs_adhoc_step2+"</p>"
                        +"<p>"+mcs_adhoc_step3+"</p>"
                        +"<p>"+mcs_adhoc_step4+"</p>"
                        +"<p>"+mcs_adhoc_step5+"</p>";
                    $(".tip_text").text(mcs_adhoc_tip);
                }
            }

            function install_dev_event()
            {
                $("#back_to_input")[0].onclick = (function()
                {
                    create_link_way();
                });
            }

            $("#b_text").text(mcs_select_network);
            $(".center_text").text(mcs_installation_equipment);

            install_dev_main(obj);
            install_dev_event();
        }

        function create_set_pwd_ex()
        {
            function set_pwd_main()
            {
                $("#add_dev_box")[0].innerHTML = "<div class = 'normal_div'>"
                    +"<div class = 'normal_ico' style='background-position:-510px 0px'></div>"
                    +"<span class = 'normal_text'>"+mcs_device_id+":"+g_add_sn+"</span>"
                    +"</div>"
                    +"<div class = 'normal_div'>"
                    +"<div class = 'normal_text'>"+mcs_current_password_strength+":"+mcs_low+"</div>"
                    +"<div id = 'pass_strength_low'></div>"
                    +"</div>"
                    +"<div id = 'warning' style = 'display: block'>"
                    +"<span class = 'warning_text' style='line-height: 20px'><div class='warning_ico' style='margin: 3px 2px 0 2px'></div>"+mcs_password_too_simple_hint+"</span>"
                    +"</div>"
                    +"<div class = 'normal_input_div'>"
                    +"<div class = 'normal_input_ico' style='background-position: -235px 0px'></div>"
                    +"<input type = 'text' class = 'normal_show_input' value = '"+mcs_input_password+"'>"
                    +"<input type = 'password' class = 'normal_input'>"
                    +"</div>"
                    +"<div class = 'normal_input_div'>"
                    +"<div class = 'normal_input_ico' style='background-position: -235px 0px'></div>"
                    +"<input type = 'text' class = 'normal_show_input' value = '"+mcs_confirm_password+"'>"
                    +"<input type = 'password' class = 'normal_input'>"
                    +"</div>"
                    +"<div class = 'normal_div'>"
                    +"<div class = 'normal_text'>"+mcs_new_password_strength+"</div>"
                    +"<div id = 'pass_strength_high'></div>"
                    +"</div>"
                    +"<input type = 'button' class = 'normal_button' value = "+mcs_settings+" id = 'set_button'>"
                    +"<span class = 'tip_text'>"+mcs_set_pass_tip+"</span>";
            }

            function set_pwd_event()
            {
                $("#set_button")[0].onclick = (function()
                {
                    var dom_input=$(".normal_input");
                    g_dom_loading_gif.fadeIn();
                    if(check_password(dom_input[0].value,dom_input[1].value))
                    {
                        mcloud_agent.dev_passwd_set({sn:g_add_sn,old_pass:g_old_pwd,new_pass:$(".normal_input")[0].value,is_guest:0},null,function(msg,ref)
                        {
                            if(msg.result!= "")
                            {
                                g_dom_loading_gif.fadeOut();
                                error_handling(msg.result);
                            }
                            else
                            {
                                if(g_old_pwd=="admin")
                                {
                                    function sign_in()
                                    {
                                        mcloud_agent.sign_in({srv:g_location_host,user:g_add_sn,password:$(".normal_input")[0].value},null,function(msg,ref)
                                        {
                                            g_dom_loading_gif.fadeOut();
                                            if(msg.result!= "")
                                            {
                                                sign_in();
                                            }
                                            else
                                            {
                                                g_dom_loading_gif.fadeOut();
                                                mmq_pick_ack();
                                                setTimeout(create_set_wifi,1000);
                                            }
                                        });
                                    }
                                    sign_in();
                                }
                                else
                                {
                                    mcloud_agent.dev_add({sn:g_add_sn,pass:$(".normal_input")[0].value}, null, function(msg,ref)
                                    {
                                        g_dom_loading_gif.fadeOut();
                                        if(msg.result!= "")
                                        {
                                            error_handling(msg.result);
                                        }
                                        else
                                        {
                                            create_set_name();
                                        }
                                    });
                                }

                            }
                        });
                    }
                });
                $(".normal_input")[0].onblur = (function()
                {
                    if(this.value.length>=6)
                    {
                        $("#pass_strength_high").fadeIn();
                    }
                    else
                    {
                        $("#pass_strength_high").fadeOut();
                    }
                });
            }

            $("#menu_box")[0].innerHTML = "<div class = 'center_text'>"+mcs_set_password_sp+"</div>";

            set_pwd_main();
            add_input_event([mcs_input_password,mcs_confirm_password]);
            set_pwd_event();

        }

        function create_add()
        {
            function create_add_main()
            {
                $("#add_dev_box").html( "<div class = 'normal_div'>"
                    +"<div class = 'normal_ico' style='background-position:-510px 0px'></div>"
                    +"<span>"+mcs_device_id+":"+g_add_sn+"</span>"
                    +"</div>"
                    +"<div id = 'input_pwd' class = 'normal_input_div'>"
                    +"<div class = 'normal_input_ico' style='background-position: -235px 0px'></div>"
                    +"<input type = 'text' value = '"+mcs_input_password+"' class = 'normal_show_input'>"
                    +"<input type = 'password' value = '' class = 'normal_input'>"
                    +"</div>"
                    +"<input type = 'button' id = 'add_button' value = "+mcs_action_add+">"
                    +"<div class = 'normal_div' id = 'warning_sp'>"
                    +"<div class = 'warning_ico'></div>"
                    +"<span class = 'warning_text'>"+mcs_invalid_password+"</span>"
                    +"</div>"
                    +"<div class = 'normal_div' id = 'info'>"
                    +"<div id = 'info_ico' class = 'special_ico'></div>"
                    +"<span id = 'info_text' class = 'special_text'>"+mcs_forgot_your_password+"</span>"
                    +"</div>"
                    +"<div id = 'help_info'>"
                    +"<p id = 'sp_text'>"+mcs_restart_step1+"</p>"
                    +"<div>"
                    +"<div class = 'normal_ico' style='background-position: -446px 0px' ></div>"
                    +"<div class = 'normal_ico' style='background-position: -461px 0px'></div>"
                    +"<div class = 'normal_ico' style='background-position: -476px 0px'></div>"
                    +"</div>"
                    +"<p>"+mcs_restart_step2+"</p>"
                    +"<p>"+mcs_restart_step3+")</p>"
                    +"<p>"+mcs_restart_step4+"</p>"
                    +"<p>"+mcs_restart_step5+"</p>"
                    +"</div>");
            }

            function add_event()
            {
                $(".back")[0].onclick = (function()
                {
                    g_dom_loading_gif.fadeOut();
                    add_dev_class();
                });
                $("#add_button").click(function()
                {
                    g_dom_loading_gif.fadeIn();
                    g_old_pwd = $(".normal_input")[0].value;
                    if(g_old_pwd== ""||g_old_pwd == mcs_input_password)
                    {
                        $("#warning_sp")[0].style.visibility = "visible";
                        setTimeout(" $('#warning_sp')[0].style.visibility = 'hidden';",3000);
                    }
                    else
                    {
                        mcloud_agent.dev_add({sn:g_add_sn,pass:g_old_pwd},"",function(msg,ref)
                        {
                            g_dom_loading_gif.fadeOut();
                            if(msg.result == "")
                            {
                                if(g_old_pwd == "admin")
                                {
                                    create_set_pwd_ex();
                                }
                                else
                                {
                                    if(msg.info.nick!= ""&&msg.info.nick!= msg.info.dev_id)
                                    {
                                        mcloud_agent.net_get({sn:g_add_sn},"",function(msg,ref)
                                        {
                                            if(msg.networks[1].wifi_client.info.stat == "ok")
                                            {
                                                $("#add_dev_box")[0].remove();
                                                dev_list_class();
                                            }
                                            else
                                            {
                                                create_set_wifi();

                                            }
                                        });
                                    }
                                    else
                                    {
                                        create_set_name();
                                    }
                                }
                            }
                            else
                            {
                                if(msg.result=="account.user.")
                                {
                                    error_handling({text:mcs_device_existed});
                                }
                                else
                                {
                                    $("#warning_sp")[0].style.visibility = "visible";
                                    setTimeout(" $('#warning_sp')[0].style.visibility = 'hidden';",3000);
                                }

                            }
                        });

                    }
                });
                $("#info")[0].onclick = (function()
                {
                    if($("#info_ico")[0].style.display == "none")
                    {
                        $("#info_ico")[0].style.display = "block";
                        $("#help_info")[0].style.display = "block";
                    }
                    else
                    {
                        $("#info_ico")[0].style.display = "none";
                        $("#help_info")[0].style.display = "none";
                    }
                });
            }

            $("#b_text").text(mcs_input_device_id);
            $(".center_text").text(mcs_action_add);
            create_add_main();
            add_event();
            add_input_event([mcs_input_password]);
            $("#info_ico")[0].style.display = "none";
            $("#help_info")[0].style.display = "none";

        }

        function create_set_wifi()
        {
            function set_wifi_menu()
            {
                $("#menu_box")[0].innerHTML = "<div class = 'back'>"
                    + "<div class = 'back_ico'></div>"
                    + "<span class = 'back_text'>"+mcs_nick_modify+"</span>"
                    + "</div>"
                    + "<div class = 'center_text'>"+mcs_action_config_wifi+"</div>";
            }

            function set_wifi_main()
            {
                $("#add_dev_box")[0].innerHTML = "<div class = 'normal_div'>"
                    +"<div class = 'normal_ico'  style='background-position: -510px 0px' ></div>"
                    +"<span class = 'normal_text'>"+mcs_device_id+":"+g_add_sn+"</span>"
                    +"</div>"
                    +"<div id = 'wifi_info'>"
                    +"<span class = 'stay_left'>"+mcs_current_wifi+"</span>"
                    +"<span class = 'stay_right'>"+l_selected_wifi_name+"<div class='stay_right_ico'></div></span>"
                    +"</div>"
                    +"<div class = 'normal_input_div'>"
                    +"<div class = 'normal_input_ico' style='background-position: -235px 0px'></div>"
                    +"<input type = 'text' class = 'normal_show_input' value = '"+mcs_input_password+"'>"
                    +"<input type = 'password' class = 'normal_input' value = ''>"
                    +"</div>"
                    +"<input type = 'button' class = 'normal_button' value = "+mcs_connect+">"
                    +"<input type = 'button' class = 'special_button' value = "+mcs_action_skip+">"
                    +"<div id = 'check_div'>"
                    +"<input type = 'checkbox' class = 'tip_checkbox'>"
                    +"<span class = 'normal_text'>"+mcs_donot_remind+"</span>"
                    +"</div>";
            }

            function set_wifi_event()
            {
                $(".back")[0].onclick = (function()
                {
                    g_dom_loading_gif.fadeOut();
                    create_set_name();
                });
                $(".normal_button")[0].onclick = (function()
                {
                    if(l_selected_wifi_name!= mcs_enter_wifi)
                    {
                        this.setAttribute("disabled","false");
                        if($(".normal_input"[0].value))
                        {
                            var key = $(".normal_input")[0].value;
                            var ssid = l_selected_wifi_name;
                            g_dom_loading_gif.fadeIn();
                            mcloud_agent.net_set({sn:g_add_sn,networks:{enabled:1,phy:{conf:{mode:"wificlient"}},token:"ra0",
                                wifi_client:{conf:{enabled:1,key:key,ssid:ssid}}}},null,function(msg,ref)
                            {
                                if(msg.result!= "")
                                {
                                    error_handling(msg.result);
                                    g_dom_loading_gif.fadeOut();
                                }
                                else
                                {
                                    get_wifi_connection_info();
                                }
                            });
                        }
                    }
                    else
                    {
                        alert_box({text:mcs_enter_wifi});
                    }
                });
                $(".special_button")[0].onclick = (function()
                {
                    $("#add_dev_box").remove();
                    dev_list_class();
                });
                $(".stay_right")[0].onclick = (function()
                {
                    g_dom_loading_gif.fadeIn();
                    create_choose_wifi();
                    g_dom_loading_gif.fadeOut();
                });
                mcloud_agent.net_get({sn:g_add_sn},null,function(msg,ref)
                {
                    if(msg.result!= "")
                    {
                        error_handling(msg.result);
                    }
                    else
                    {
                        g_wifi_list_info = msg.networks[1].wifi_client;
                    }
                });
            }

            function get_wifi_connection_info()
            {
                mcloud_agent.net_get({sn:g_add_sn},null,function(msg,ref)
                {
                    if(msg.result!= "")
                    {
                        error_handling(msg.result);
                    }
                    else
                    {
                        if(msg.networks[1].wifi_client.info.stat == "ok")
                        {
                            g_dom_loading_gif.fadeOut();
                            g_connection_time = 0;
                            $("#add_dev_box").remove();
                            dev_list_class();
                            show_message_box({text:mcs_connection_successfully});
                        }
                        else
                        {
                            g_connection_time++;
                            if(g_connection_time>10)
                            {
                                alert_box({text:"wifi "+mcs_invalid_password});
                                g_connection_time = 0;
                                return;
                            }
                            setTimeout(get_wifi_connection_info,1000);
                        }
                    }
                });
            }

            set_wifi_menu();
            set_wifi_main();
            set_wifi_event();
            add_input_event([mcs_input_password]);
        }

        function create_set_name()
        {
            function set_name_main()
            {
                $("#add_dev_box")[0].innerHTML = "<div class = 'normal_div'>"
                    +"<div class = 'normal_ico'  style='background-position:-510px 0px'></div>"
                    +"<span class = 'normal_text'>"+mcs_device_id+":"+g_add_sn+"</span>"
                    +"</div>"
                    +"<div class = 'normal_div' id = 'tip_info'>"
                    +"<div class='tip_ico'></div>"
                    +"<span class = 'normal_text'>"+mcs_nickname_not_set+"</span>"
                    +"</div>"
                    +"<div class = 'normal_input_div'>"
                    +"<input class = 'special_input' value = '"+mcs_input_nick+"' type = 'text'>"
                    +"</div>"
                    +"<input class = 'normal_button' value = '"+mcs_settings+"' type = 'button'>"
                    +"<div id = 'warning_ex'>"
                    +"<div class='warning_ico'></div>"
                    +"<span class = 'warning_text'>"+mcs_failed_to_set_the+""
                    +"</div>"
                    +"<input class = 'special_button' value = "+mcs_action_skip+" type = 'button'>"
                    +"<input class = 'special_button' value = '"+mcs_the_end+"' type = 'button'>"
                    +"<div id = 'check_div'>"
                    +"<input type = 'checkbox' class = 'tip_checkbox'>"
                    +"<span class = 'normal_text'>"+mcs_donot_remind+"</span>"
                    +"</div>";
            }

            function set_name_event()
            {
                $(".normal_button")[0].onclick = (function()
                {
                    g_dom_loading_gif.fadeIn();
                    mcloud_agent.nick_set({sn:g_add_sn,name:$(".special_input").val()},null,function(msg,ref)
                    {
                        g_dom_loading_gif.fadeOut();
                        if(msg.result!= "")
                        {
                            error_handling(msg.result);
                        }
                        else
                        {

                            if($(".tip_checkbox")[0].checked)
                            {
                                create_set_wifi();
                                $(".special_button").fadeOut();
                                $("#check_div").fadeOut();
                            }
                            else
                            {
                                create_set_wifi();
                            }

                        }
                    });

                });
                $(".special_button")[0].onclick = (function()
                {
                    create_set_wifi();
                });
                $(".special_button")[1].onclick = (function()
                {
                    $("#add_dev_box").remove();
                    dev_list_class();
                });
            }

            var back = $(".back")[0];
            if(back)
            {
                back.innerHTML = "";
            }
            $(".center_text").text(mcs_nick_modify);
            set_name_main();
            set_name_event();
            add_input_event([mcs_input_nick]);
        }

        function create_choose_wifi()
        {
            function choose_wifi_main()
            {
                document.getElementById("add_dev_box").innerHTML = "<div id = wifi_list_s>"
                    +"<div class = 'wifi_list_item'>"
                    +"<span class = 'stay_left'>"+mcs_wifi_list+"</span>"
                    +"<span class = 'refresh'>"
                    +"<div class = 'normal_ico' style='background-position: -250px -14px'></div>"
                    +"<span class = 'special_text'>"+mcs_refresh+"</span>"
                    +"</span>"
                    +"</div>"
                    +"</div>"
                    +"<input class = 'special_button' value = "+mcs_ok+" type = 'button'>";
            }

            function choose_wifi_event()
            {
                $(".back")[0].onclick = (function()
                {
                    create_set_wifi();
                });
                if(g_wifi_list_info&&g_wifi_list_info.ap_list)
                {
                    for(var i = 0;i<g_wifi_list_info.ap_list.length;i++)
                    {
                        var item,choosed_mark,wifi_name,sign,lock;
                        item = document.createElement("div");
                        choosed_mark = document.createElement("div");
                        wifi_name = document.createElement("span");
                        sign = document.createElement("div");
                        lock = document.createElement("div");
                        choosed_mark.setAttribute("class","mark");
                        item.setAttribute("class","wifi_list_item");
                        wifi_name.setAttribute("class","wifi_name");
                        sign.setAttribute("class","wifi_sign_ico");
                        lock.setAttribute("class","wifi_lock_ico");
                        wifi_name.innerHTML = g_wifi_list_info.ap_list[i].ssid;
                        item.appendChild(choosed_mark);
                        item.appendChild(wifi_name);
                        item.appendChild(sign);
                        if(g_wifi_list_info.ap_list[i].encrypt == "on")
                        {
                            item.appendChild(lock);
                        }
                        $("#wifi_list_s")[0].appendChild(item);
                        item.onclick = (function()
                        {
                            $(".mark").fadeOut();
                            $(this).find(".mark")[0].style.display = "block";
                            l_selected_wifi_name = $(this).find(".wifi_name").text();
                        });
                    }
                }
                else
                {
                    var div = document.createElement("div");
                    div.innerHTML = mcs_wifi_list_empty;
                    div.style.cssText = "margin-top:10px;margin-bottom:10px;text-align:center";
                    $("#wifi_list_s")[0].appendChild(div);
                }

                $(".special_button")[0].style.marginTop = "10px";
                $(".special_button").click(function()
                {
                    create_set_wifi();
                });
                $(".refresh").click(function()
                {
                    g_dom_loading_gif.fadeIn();
                    mcloud_agent.net_get({sn:g_add_sn},null,function(msg,ref)
                    {
                        if(msg.result!= "")
                        {
                            error_handling(msg.result);
                        }
                        else
                        {
                            g_dom_loading_gif.fadeOut();
                            g_wifi_list_info = msg.networks[1].wifi_client;
                            create_choose_wifi();
                        }
                    });
                });
            }

            $(".back_text").text(mcs_action_config_wifi);
            $(".center_text").text(mcs_select_wifi_hotspots);
            choose_wifi_main();
            choose_wifi_event();
            g_dom_loading_gif.fadeOut();
        }

        if(!obj)
        {
            create_add_dev_menu();
            create_add_dev_main();
            add_dev_event();
            add_input_event([mcs_device_id]);
            g_dom_loading_gif.fadeOut();
        }
        else
        {
            create_set_pwd_ex();
            g_dom_loading_gif.fadeOut();
        }

    }
    //添加盒子功能开始
    function box_list(obj){
        g_avc_conf = { filter: "original", filterHorLuma: "optimized", filterVerLumaEdge: "optimized", getBoundaryStrengthsA: "optimized" }
        g_avc = new Avc();
        g_avc.configure(g_avc_conf);
        g_select_device_ipc = obj.sn;
        var l_me = this,
            // l_me_parent = obj.parent,
            // l_parent_callback = obj.on_event,
            l_dom_view_range,
            l_dom_show_data_g,l_dom_timeline_context,
            l_dom_base_line_path,
            l_dom_current_pos_line,
            l_dom_zoom_div,l_dom_zoom_minutes,l_dom_zoom_hour,l_dom_zoom_day,
            l_dom_scroll_later,l_dom_scroll_earlier,
            l_dom_preview,l_dom_preview_pointer,
            l_dom_preview_pointer_shadow,
            l_dom_preview_slide,l_dom_preview_event_array,
            l_dom_preview_right_slider,l_dom_preview_left_slider,
            l_calendar_table_tds=[],l_date_infos=[],l_local_date_infos=[],
            l_local_segs= [],l_segs = [],l_local_alarm_segs=[],
            l_dom_calendar_scroll_earlier,l_dom_calendar_scroll_later,
            l_dom_calendar_table,l_dom_calendar_range,
            l_current_temp_date,l_current_temp_date_ms,
            l_each_grid_width,l_each_second_width,l_each_pixel_time,
            l_base_start_time,l_base_end_time,
            l_week_index=l_today_index=0,
            l_select_dev_sn,l_move_path_x,
            l_current_zoom,l_selected_time,
            l_selected_calendar_dom,
            l_current_selected_time_save,
            l_rect_pos_x,//mouseover rect offSetX
            l_is_preview_show,
            l_ctx, l_img_data,
            l_timer = null,l_u8_data,
            l_nal, l_nal_len,
            l_start, l_frame,
            l_loop_num=l_canvas_index=0,
            l_last_pos_in_canvas_x=0,
            l_b64_str_array,l_canvas_dom_array,
            l_currentDate = new Date(),
            l_current_year=l_currentDate.getFullYear(),
            l_current_month= l_currentDate.getMonth() + 1,
            l_current_day = l_currentDate.getDate(),
            l_hour = l_currentDate.getHours(),
            l_minute = l_currentDate.getMinutes(),
            l_second = l_currentDate.getSeconds(),
            l_type=mcloud_agent.devs.get(g_select_device_ipc).type;
            l_me_parent_clientWidth = document.body.clientWidth-100;
        function get_box_devs(obj){
            $("#dev_list").remove();    //防止双击重复请求
            g_dom_loading_gif.fadeIn();
            mcloud_agent.box_get({box_sn:obj.sn,flag:1},{flag:1},on_ack);
        }
        function on_ack(msg,ref){
            if(msg.result == "" && msg.ipcs){
                create_box_main(msg);
            }    
        }
        function create_box_main(obj){
            common_menu({type:"box"});
            $("#dev_list").remove();
            $("#playing").hide();
            $("#history").hide();
            $("#menu_box").after("<div id='box_list'></div>")
            if(obj.result == "" && obj.ipcs){
                var dev = "";
                background_position_online = "background-position: 0px -104px";
                background_position_offline = "background-position: 0px -120px";
                for(var i = 0 ; i < obj.ipcs.length ; i++){
                    dev+="<div class='dev_list_img' style='margin-top:50px;'><img class='device_pic' width=320 height=180 src='/imgs/pic.png'/><div class='dev_nick'><div class='dev_state' style='"+(obj.ipcs[i].online?background_position_online:background_position_offline)+"'></div><span>"+obj.ipcs[i].sn+"</span></div><div class='push_box'></div></div>";
                }
                $("#box_list")[0].innerHTML = dev;
            }
            
            pic_base64_get(obj.ipcs);   
            for(var i = 0 ; i < obj.ipcs.length ; i++){
                $(".dev_list_img").eq(i).click(function(){
                    num = $(this).index();
                    $(".dev_list_img").remove();
                    // add_box_play(obj.ipcs[num]);
                    create_video_list(obj.ipcs[num]);
                })
            }
            g_dom_loading_gif.fadeOut();
        }
        function create_video_list(obj){
            $("#bottom_box").hide();
            $("#box_list").html("<div id='date_click'><button class='date_time_click selected'>1h</button><button class='date_time_click'>30min</button><button class='date_time_click'>5min</button></div>");
            video_list("1h",obj.sn);
            date_time_click(obj.sn);
        }
        function date_time_click(sn){
            $(".date_time_click").each(function(){
                $(this).click(function(){
                    $(".date_time_click").removeClass("selected");
                    $(this).addClass("selected");
                    var date = $(this).html();
                    video_list(date,sn);
                })
            })
        }
        function video_list(selected_company,sn){
            $(".dev_list_img").remove();
            // l_current_year = 2015;
            // l_current_month = 09;
            // l_current_day = 15;
            l_current_temp_date_ms = new Date(l_current_year+"/"+l_current_month+"/"+l_current_day+" 00:00:00").getTime();
            time_now = new Date(l_current_year+"/"+l_current_month+"/"+l_current_day+" "+l_hour+":"+l_minute+":"+l_second).getTime();
            var company;
            if(selected_company=="1h"){
                company=3600;
            }else if(selected_company=="30min"){
                company=1800;
            }else if(selected_company=="5min"){
                company=300;
            }
            var num = parseInt((time_now-l_current_temp_date_ms)/(company*1000));
            for(var i=0;i<num;i++){
                $("#box_list").append("<div class='dev_list_img' style='margin-top:50px;display:none;'><img class='device_pic' width='320' height='180' src='/imgs/pic.png'/><div class='dev_nick'><span></span></div><div class='push_box'></div></div>");
            }
            var start_time = l_current_temp_date_ms;
            var end_time = time_now;
            mcloud_agent.box_get({box_sn:g_select_device_ipc,dev_sn:sn,flag:4,start_time:start_time,end_time:end_time},{box_sn:g_select_device_ipc,dev_sn:sn,flag:4,base_start_time:start_time,index:i,num:num,company:company},video_list_ack);
        }
        function video_list_ack(msg,ref){
            if(msg.result==""){
                if(msg.segs){
                    var dom_device_pic = document.getElementsByClassName("device_pic");
                    var start_time;
                    var end_time;
                    var index=0;
                    var date;
                    var date_show;
                    var token;
                    var stm_length = msg.segs.length;
                    var last_stm = parseInt(msg.segs[stm_length-1].stm,16);
                    for(var i=0;i<ref.num;){
                        var stm = parseInt(msg.segs[index].stm,16);
                        var etm = parseInt(msg.segs[index].etm,16);
                        start_time = l_current_temp_date_ms+(ref.company*i*1000);
                        end_time = start_time+ref.company*1000;
                        if(stm>=start_time&&stm<end_time){
                            token = ref.dev_sn+"_p3_"+msg.segs[index].cid+"_"+msg.segs[index].sid;
                            date = getDateWeek(start_time);
                            date_show = date.hours+":"+date.minutes+":"+"00"/*date.seconds*/;
                            // $(".dev_list_img").eq(ref.num-i-1).show();
                            $(".dev_list_img").eq(ref.num-i-1).addClass("dev_list_show");
                            $(".device_pic").eq(ref.num-i-1).addClass("dev_pic_show");
                            $(".dev_list_img").eq(ref.num-i-1).attr("token",token);

                            $(".dev_nick").eq(ref.num-i-1).children("span").html(date_show);
                            video_play({index:ref.num-i-1,start_time:start_time,end_time:end_time,sn:ref.dev_sn});
                            i++;
                            index++;
                        }else if(stm>=end_time){
                            i++;
                        }else{
                            index++;
                        }

                        if(last_stm == stm){
                            base64_get();
                            break;
                        }
                        if(i==ref.num){
                            base64_get();
                        }
                    }
                }
            }
        }
        function base64_get(){

            var dom_device_pic = document.getElementsByClassName("dev_pic_show");
            var sw = document.body.scrollWidth; //body的宽度
            var sh = document.body.scrollHeight; //body的高度
            var ch = document.documentElement.clientHeight; //可见的高度
            var dev_w = $(".dev_list_img").width()+parseInt($(".dev_list_img").css("margin-left"));
            var dev_h = $(".dev_list_img").height()+parseInt($(".dev_list_img").css("margin-top"));
            var dev_num = parseInt(sw/dev_w)*Math.ceil(ch/dev_h);
            var num = parseInt(sw/dev_w);
            var k=0;
            for(k;k<dev_num;k++){
                if(k<dom_device_pic.length){
                    $(".dev_list_show").eq(k).show();
                    var token = $(".dev_list_show").eq(k).attr("token");
                    pic_base64_get_play({box_sn:g_select_device_ipc,token:token,dom:dom_device_pic[k]});
                }else{
                    break;
                }
            }
            window.onscroll = function(){
                var sh = document.body.scrollHeight;//body的高度
                var ch = document.documentElement.clientHeight;//可见高度
                var scrollTop = (document.documentElement.scrollTop || document.body.scrollTop);
                if(sh-ch==scrollTop) {
                    for(var j=0;j<num;j++){
                        if(k<dom_device_pic.length){
                            $(".dev_list_show").eq(k).show();                        
                            var token = $(".dev_list_show").eq(k).attr("token");
                            pic_base64_get_play({box_sn:g_select_device_ipc,token:token,dom:dom_device_pic[k]});
                            k++;
                        }
                    }
                }
            }
        }
        function pic_base64_get_play(obj){
            mcloud_agent.pic_base64_get({sn:obj.box_sn,token:obj.token,flag:1},{flag:1},
                                function(msg,ref)
                                {
                                    if( msg && !msg.result && msg.frame)
                                    {
                                        var l_b64_str_array=msg.frame;
                                        if( /*g_old_browser_version&&*/ !(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/9./i)=="9.")){ 
                                            mjme_init(l_b64_str_array,obj.dom);
                                        }
                                    }
                                }
                            );
        }
        function video_play(obj){
            $(".dev_list_img").eq(obj.index).click(function(){
                $("#date_click").remove();
                var date_hide = $(".dev_list_img").eq(obj.index).attr("date-hide");
                $(".dev_list_img").remove();
                $("#box_list").html("<div id='timeline_box'><canvas id='timeline_canvas'></canvas></div><div id='timeline_tips'></div>");
                var play = document.createElement("div");
                bottom_box = $("#timeline_box")[0];
                play.setAttribute("id","play_back_box");
                var height = $(window).height()-130,width = parseInt(height*16/9),top = ($(window).height()-height-10)/2,left = ($(window).width()-width)/2;
                play.style.cssText = "height:"+height+"px;width:"+width+"px;left:"+left+"px;top:"+top+"px;";
                top_height = top+height;
                document.getElementById("timeline_box").style.cssText = "display:none;width:"+width+"px;left:"+left+"px;top:"+top_height+"px;";
                document.getElementById("timeline_tips").style.cssText = "font-size:12px;color:#fff;position:absolute;top:"+(top_height-50)+"px;";
                $("#timeline_canvas").attr("width",width+"px");
                $("#timeline_canvas").attr("height","30px");
                l_dom_timeline_context = document.getElementById("timeline_canvas").getContext('2d');
                l_dom_timeline_context.beginPath();
                l_dom_timeline_context.fillStyle = "#AFDC00";
                bottom_box.parentNode.insertBefore(play,bottom_box);
                l_select_dev_sn = obj.sn;
                mcloud_agent.box_get({box_sn:g_select_device_ipc,dev_sn:obj.sn,flag:4,start_time:obj.start_time,end_time:obj.end_time},{flag:4},video_play_ack);
                play_back_box_event({start_time:obj.start_time,end_time:obj.end_time});
            })
        }
        function video_play_ack(msg,ref){
            l_segs = msg.segs;
            var local_segs_index = 0;
            var retc_width = $("#timeline_box").width()/l_segs.length;
            for(var i=0;i<l_segs.length;i++){
                var start_date_ms=parseInt((l_segs[i].stm),16);
                var end_date_ms=parseInt((l_segs[i].etm),16);
                var start_date=new Date(start_date_ms);
                var end_date=new Date(end_date_ms);
                var start_time_hour=start_date.getHours();
                var start_time_minute=start_date.getMinutes();
                var start_time_second=start_date.getSeconds();
                var end_time_hour=end_date.getHours();
                var end_time_minute=end_date.getMinutes();
                var end_time_second=end_date.getSeconds();
                var date_time_pos=start_time_hour*60+"/"+((start_time_hour*60+start_time_minute-2)<0?0:((start_time_hour*60+start_time_minute-2))*60+start_time_second);
                var pos_start=(start_date_ms-l_segs.base_start_time)*l_each_second_width+15;
                var pos_end=(end_date_ms-start_date_ms)*l_each_second_width;
                l_local_segs[local_segs_index]=
                    {   
                        pos_start:pos_start,
                        pos_end:pos_start+pos_end,
                        token:l_select_dev_sn+"_"+l_segs[i].cid+"_"+l_segs[i].sid,
                        pic_token:l_select_dev_sn+"_p3_"+l_segs[i].cid+"_"+l_segs[i].sid,
                        f:l_segs[i].f,
                        date_time_pos:date_time_pos
                    };
                    if(l_segs[i].f)
                    {
                        l_local_alarm_segs[local_alarm_segs_index]=
                        {   
                            pos_start:pos_start,
                            pos_end:pos_start+pos_end,
                            start_date_ms:start_date_ms,
                            token:l_select_dev_sn+"_"+l_segs[i].cid+"_"+l_segs[i].sid,
                            pic_token:l_select_dev_sn+"_p3_"+l_segs[i].cid+"_"+l_segs[i].sid,
                            f:l_segs[i].f,
                            date_time_pos:date_time_pos
                        };
                        local_alarm_segs_index++;
                    }
                local_segs_index++;
                l_dom_timeline_context.fillRect(i*retc_width, 0, retc_width, 30);
            }
            timeline_click(0);
        }
        function timeline_click(flag){
                if(!flag){
                    flag = 0;
                }
                mcloud_agent.playback({sn:g_select_device_ipc,protocol:"rtdp",token:l_local_segs[flag].token},{},function(msg,ref){
                                if(msg.result!= "")
                                {
                                    error_handling(msg.result);
                                }
                                else
                                {
                                    g_play_back_url = msg.url;
                                    var inner_window_info = {dom_id:("inner_window" + g_playing_num), index:g_playing_num, video_chls:null, audio_chls:null, mme:null, ipc_state:"", node_sn:""};
                                    create_mme({inner_window_info:inner_window_info,page:"playback",protocol:"auto",dom:$("#play_back_box")[0]});
                                }
                });
        }
        function play_back_box_event(obj){
            df_time = obj.end_time - obj.start_time;
            $("#play_back_box").hover(function(){
                var top = top_height-30;
                $("#timeline_box").stop();
                $("#timeline_box").show();
                $("#timeline_box").animate({"height":"30px","top":top+"px"},500);
            },function(){
                var top = top_height;
                $("#timeline_box").stop();
                $("#timeline_box").animate({"height":"0px","top":top+"px"},500,function(){$(this).hide()});
            });
            $("#timeline_box").hover(function(){
                var top = top_height-30;
                $("#timeline_box").stop();
                $("#timeline_box").show();
                $("#timeline_box").animate({"height":"30px","top":top+"px"},500);
            },function(){
                var top = top_height;
                $("#timeline_box").stop();
                $("#timeline_tips").hide();
                $("#timeline_box").animate({"height":"0px","top":top+"px"},500,function(){$(this).hide()});
            });
            $("#timeline_box").mousemove(function(e){
                var tbox_width = $(this).width();
                var tbox_left = parseInt($(this).css("left"));
                event = e || window.event;
                var x = event.clientX-tbox_left;
                var flag_time = parseInt((df_time/tbox_width)*x)+obj.start_time;
                var date = new getDateWeek(flag_time);
                var show_time = date.hours+":"+date.minutes+":"+date.seconds;
                $("#timeline_tips").show();
                $("#timeline_tips").css({"left":event.clientX+"px"});
                $("#timeline_tips").html(show_time);
            })
            $("#timeline_box").click(function(e){
                var tbox_width = $(this).width();
                var tbox_left = parseInt($(this).css("left"));
                event = e || window.event;
                var x = event.clientX-tbox_left;
                var flag = parseInt(x*(l_local_segs.length/tbox_width));
                timeline_click(flag);
            })
        }
        // 获取图片
        function pic_base64_get(obj){
            l_b64_str_array=[];
            l_canvas_dom_array=[];
            l_canvas_index=0;
            var c_index=0;
            l_canvas_dom_array = document.getElementsByClassName("device_pic");
            for(var i=0;i<obj.length;i++)
            {
                pic_index = i;
                var token=obj[pic_index].sn+"_p3_"+Math.pow(2,31) +"_"+Math.pow(2,31);
                pic_base64_get_play({box_sn:g_select_device_ipc,token:token,dom:l_canvas_dom_array[i]});
                // mcloud_agent.pic_base64_get({sn:g_select_device_ipc,token:token,flag:1},{index:pic_index},
                //     function(msg,ref)
                //     {
                //         if( msg && !msg.result && msg.frame)
                //         {
                //             l_b64_str_array[ref.index]=msg.frame;
                //             // c_index++;
                //             // if(c_index>=obj.length) 
                //             // {
                //                 if( /*g_old_browser_version&&*/ !(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.match(/9./i)=="9.")){ 
                //                    mjme_init(l_b64_str_array[ref.index],l_canvas_dom_array[ref.index]);
                //                 }
                                
                //             // }
                //         }
                //     }
                // );
            }

        }
        function mjme_on_decode(buf, width, height,img_dom) {
            if (!buf/* || !this.render*/) {
              return;
            }
            function image(w, h) {
                        this.header = '';
                        this.data = Array();
                        this.width = w;
                        this.height = h;
                    }
                    
                    // Convert a value to a little endian hexadecimal value
                    function getLittleEndianHex(value) {
                        var result = [];
                        
                        for (var bytes = 4; bytes > 0; bytes--) {
                            result.push(String.fromCharCode(value & 255));
                            value >>= 8;
                        }
                        
                        return result.join('');
                    }
                    
                    // Set the required bitmap header
                    function setImageHeader(img)
                    {
                        var numFileBytes = getLittleEndianHex(img.width * img.height);
                        var w = getLittleEndianHex(img.width);
                        var h = getLittleEndianHex(img.height);

                        img.header = 
                            'BM' +                      // Signature
                            numFileBytes +              // size of the file (bytes)*
                           '\x00\x00' +                 // reserved
                           '\x00\x00' +                 // reserved
                           '\x36\x00\x00\x00' +         // offset of where BMP data lives (54 bytes)
                           '\x28\x00\x00\x00' +         // number of remaining bytes in header from here (40 bytes)
                           w +                          // the width of the bitmap in pixels*
                           h +                          // the height of the bitmap in pixels*
                           '\x01\x00' +                 // the number of color planes (1)
                           '\x20\x00' +                 // 32 bits / pixel
                           '\x00\x00\x00\x00' +         // No compression (0)
                           '\x00\x00\x00\x00' +         // size of the BMP data (bytes)*
                           '\x13\x0B\x00\x00' +         // 2835 pixels/meter - horizontal resolution
                           '\x13\x0B\x00\x00' +         // 2835 pixels/meter - the vertical resolution
                           '\x00\x00\x00\x00' +         // Number of colors in the palette (keep 0 for 32-bit)
                           '\x00\x00\x00\x00';          // 0 important colors (means all colors are important)
                    }
                    
                    // Fill a rectangle
                    function fillRectangle(img,color) {
                        /*for (var ny = y; ny < y + h; ny++) {
                            for (var nx = x; nx < x + w; nx++) {
                              var pix_data=String.fromCharCode(color[nx],color[nx],color[nx],255);
                                img.data[ny * img.width + nx] = pix_data;
                            }
                            }*/
                            for (var i = 0; i < color.length; i++) {
                              var pix_data=String.fromCharCode(color[i],color[i],color[i],255);
                                img.data[i] = pix_data;
                            }
                        
                    }
                    
                    // Flip image vertically
                    function flipImage(img) {
                        var newImgData = new Array();
                        
                        for(var x = 0; x < img.width; x++) {
                            for(var y = 0; y < img.height; y ++) {
                                var ny = img.height - 1 - y;
                                newImgData[(ny * img.width) + x] = img.data[(y * img.width) + x];
                            }
                        }
                        
                        img.data = newImgData;
                    }
                    
                    // Main draw function
                    function drawImage() {
                        var img = new image(160, 90);
                        
                        setImageHeader(img);
                        
                        fillRectangle(img,buf);
                        
                        // Flip image vertically    
                        flipImage(img);
                        
                        // If window.btoa is supported, use it since it's often faster
                        if(window.btoa != undefined) {
                            return 'data:image/bmp;base64,' + btoa(img.header + img.data.join(""));
                        }
                        // If not, use our base64 library
                        else {
                            return 'data:image/bmp;base64,' + jQuery.base64.encode(img.header + img.data.join(""));
                        }
                    }
               img_dom.src=drawImage(); 
        }
        function mjme_init(b64_str,canvas_dom)
        {
            l_ctx==null;
            // if(l_timer){ clearInterval(l_timer); l_timer = null; };
            l_start=l_frame=l_loop_num=l_nal_len=0;
            g_avc.onPictureDecoded = mjme_on_decode;
            l_ctx=canvas_dom;
            
            var m_data=mcodec.b64_2_binary(b64_str);
            if(!m_data) return;
            l_u8_data = new Uint8Array(m_data);
            l_nal = new Uint8Array(0x10000);
            l_nal_len = 0;
            // if(l_timer){ clearInterval(l_timer); l_timer = null; };
            
            for(var i=0;i<3;i++)
            {
                mjme_frame(canvas_dom);
                // l_timer = setTimeout(mjme_frame(canvas_dom), 100);
            }
        }
        function mjme_frame(canvas_dom)
        {
            var i;  
            l_frame = 0;
            l_loop_num++;
            // if(l_loop_num>1)
            // {
            //     l_canvas_index++;
            //     if(l_canvas_index<l_b64_str_array.length&&l_canvas_index<l_canvas_dom_array.length)
            //         mjme_init(l_b64_str_array[l_canvas_index],l_canvas_dom_array[l_canvas_index]);
            //     else 
            //     {
            //         return;
            //     }
            // }
            if(!l_u8_data)return;
            for(i = l_start; i < l_u8_data.length;)
            {
                if((0 != l_u8_data[i]) || (0 != l_u8_data[i+1]) || (0 != l_u8_data[i+2]) || (1 != l_u8_data[i+3]))
                {
                    l_nal[l_nal_len++] = l_u8_data[i++];
                    continue;
                }
                if(l_nal_len)
                {
                    g_avc.decode(new Uint8Array(l_nal.buffer, 0, l_nal_len>65536?65536:l_nal_len),canvas_dom);
                }
                i += 4;
                l_start = i;
                l_nal_len = 0;
                if(l_frame)
                {
                    break;
                }
            }
            if(l_nal_len)
            {
                g_avc.decode(new Uint8Array(l_nal.buffer, 0, l_nal_len>65536?65536:l_nal_len),canvas_dom);
            }
            if((0 == l_frame) && (l_start < l_u8_data.length))
            {
                l_start = 0;
                l_nal_len = 0;
            }
        }
        function getDateWeek(datetimes)
        {
            var selectedDate=new Date(datetimes);
            var year = selectedDate.getFullYear();
            year = year.toString().length < 2 ? "0" + year : year;
            var month= selectedDate.getMonth() + 1;
            month= month.toString().length < 2 ? "0" + month : month;
            var day = selectedDate.getDate();
            day = day.toString().length < 2 ? "0" + day : day;
            var hours = selectedDate.getHours();
            hours = hours.toString().length < 2 ? "0" + hours : hours;
            var minutes = selectedDate.getMinutes();
            minutes = minutes.toString().length < 2 ? "0" + minutes : minutes;
            var seconds = selectedDate.getSeconds();
            seconds = seconds.toString().length < 2 ? "0" + seconds : seconds;
            var dateInfo = new Date(year+"/"+month+"/"+day+" 00:00:00");
            var week = "";
             switch(dateInfo.getDay())
             {
                case 0:
                    week="Sun";
                    break;
                case 1:
                    week="Mon";
                    break;
                case 2:
                    week="Tue";
                    break;
                case 3:
                    week="Wed";
                    break;
                case 4:
                    week="Thu";
                    break;
                case 5:
                    week="Fri";
                    break;
                case 6:
                    week="Sat";
                    break;
            }
            return {year:year,month:month,day:day,week:week,hours:hours,minutes:minutes,seconds:seconds,date_times:datetimes};
        }
        function ccm_segs_get(obj)
        {
            //clear_rect();
            l_select_dev_sn=obj.dev_sn;
            if(obj.get_calendar_data)
            {
                mcloud_agent.box_get({box_sn:obj.box_sn,dev_sn:obj.dev_sn,flag:2,start_time:0,end_time:0},{box_sn:obj.box_sn,dev_sn:obj.dev_sn,flag:2,base_start_time:obj.start_time},ccm_calendar_data_ack);
                
            }
            //l_dom_scroll_later.style.display=(obj.start_time==l_base_start_time)?"none":"block"; 
            var end_time=obj.start_time+60*60*24*1000;
            var flag=4;        
            mcloud_agent.box_get({box_sn:obj.box_sn,dev_sn:obj.dev_sn,flag:flag,start_time:obj.start_time,end_time:end_time},{box_sn:obj.box_sn,dev_sn:obj.dev_sn,flag:flag,base_start_time:obj.start_time},ccm_segs_get_ack);    
        }
        function ccm_segs_get_ack(msg,ref)
        {
            // if(!l_me_parent) return;
            if( msg && !msg.result && (msg.segs_sdc||msg.segs))
            {
                l_segs=[];
                if(ref.flag==4)
                {
                    l_segs=msg.segs;
                }
                else if(ref.flag==8)
                {
                    var cid,sid,stm,etm,f;
                    cid=sdc_decode(msg.segs_sdc.cid,msg.segs_sdc.record_num);
                    sid=sdc_decode(msg.segs_sdc.sid,msg.segs_sdc.record_num);
                    stm=sdc_decode(msg.segs_sdc.stm,msg.segs_sdc.record_num);
                    etm=sdc_decode(msg.segs_sdc.etm,msg.segs_sdc.record_num);
                    f=sdc_decode(msg.segs_sdc.f,msg.segs_sdc.record_num);
                    for(var i=0;i<(cid?cid.length:0);i++)
                    {
                        l_segs[i]={cid:cid[i],sid:sid[i],stm:stm[i],etm:etm[i],f:f[i]};
                    }
                }
                
                //l_segs={cid:cid,sid:sid,stm:stm,etm:etm,f:f};
                
                draw_data_rect({base_start_time:ref.base_start_time});
            }
        }
        g_dom_loading_gif.fadeOut();
        get_box_devs(obj);
    }
    //添加盒子功能结束
    function play_class(obj)
    {
        function create_play_main(obj)
        {
            if(!$("#bottom_box")[0])
            {
                var dom_bottom_box = document.createElement("div");
                dom_bottom_box.setAttribute("id","bottom_box");
                $("#page")[0].appendChild(dom_bottom_box);
            }
            $("#bottom_box").show();
            var play_token = getCookie("token");
            if(!play_token)
            {
                setCookie("token","p1");
                play_token = "p1";
            }

            var play = document.createElement("div"),
                bottom_box = $("#bottom_box")[0];
            play.setAttribute("id","play_box");
            var height = $(window).height()-130,width = parseInt(height*16/9),top = ($(window).height()-height-10)/2,left = ($(window).width()-width)/2;
            play.style.cssText = "height:"+height+"px;width:"+width+"px;left:"+left+"px;top:"+top+"px;";

            bottom_box.parentNode.insertBefore(play,bottom_box);
            var inner_window_info = {dom_id:("inner_window" + obj.num), index:obj.num, video_chls:null, audio_chls:null, mme:null, ipc_state:"", node_sn:""};
            create_mme({inner_window_info:inner_window_info,page:"home",protocol:"auto",dom:play});

            if(!g_show_message_box&&getCookie("g_show_message_box")!= "true")
            {
                g_show_message_box = true;
                setCookie("g_show_message_box","true");
                create_message_box();
                var dom_help_switch = $("#help_switch");
                dom_help_switch.text(mcs_close_tip);
                dom_help_switch.animate({ marginLeft: "-0px"},100);
                $("#message_box_background").fadeIn("fast");
            }
            else
            {
                var dom_help_switch = $("#help_switch");
                dom_help_switch.text(mcs_open_tips);
                dom_help_switch.animate({ marginLeft: "-40px"},100);
            }

            if(!$("#help_switch")[0])
            {
                var help_box = document.createElement("div");
                help_box.setAttribute("id","help_switch");
                help_box.innerHTML = mcs_open_tips;
                $("#page")[0].appendChild(help_box);
                help_box.onclick = (function()
                {
                    var dom_message_box = $("#message_box_background");
                    if(dom_message_box[0])
                    {
                        dom_message_box.fadeOut("fast",function()
                        {
                            dom_message_box.remove();
                        });
                        this.innerHTML = mcs_open_tips;
                    }
                    else
                    {
                        this.innerHTML = mcs_close_tip;
                        create_message_box();
                        $("#message_box_background").fadeIn("fast");
                    }
                });
                help_box.onmouseover = (function()
                {
                    if(this.innerHTML == mcs_open_tips)
                    {
                        $(this).animate({ marginLeft: "0px"},100);
                    }
                });
                help_box.onmouseout = (function()
                {
                    if(this.innerHTML == mcs_open_tips)
                    {
                        $(this).animate({ marginLeft: "-40px"},100);
                    }
                });
            }
        }

        function create_play_bottom()
        {
            $("#bottom_box")[0].innerHTML = "<div id = 'dev_play_bottom_main'>"
                +"<div id = 'record'>"
                    +"<div id = 'play_time'>00:00</div>"
                +"</div>"
                +"<div id = 'photograph' >"
                +"</div>"
                +"<div id = 'mic'>"
                    +"<div id = 'mic_time'>00:00</div>"
                    +"<div id = 'mic_div'>"
                        +"<span id = 'mic_text'>"+mcs_press_start_talk+"<span>"
                    +"</div>"
                    +"<div class = 'triangle'>"
                        +"<span class = 'bot'></span>"
                        +"<span class = 'top'></span>"
                    +"</div>"
                +"</div>"
                +"<div id = 'setting' >"
                    +"<div id = 'setting_img'></div>"
                    +"<div id = 'setting_page'></div>"
                    +"<div id = 'background_div'></div>"
                    +"<div class = 'triangle'>"
                    +"<span class = 'bot'></span>"
                    +"<span class = 'top'></span>"
                    +"</div>"
                +"</div>"
            +"</div>";
        }

        function create_message_box()
        {
            var dom_message_box;
            dom_message_box = create_dom("message_box_background",$("#menu_box"));
            dom_message_box.innerHTML = "<div id = 'message_left_bg'></div>"
                +"<div id = 'message_left'>"+mcs_click_left+"</div>"
                +"<div id = 'message_right_bg'></div>"
                +"<div id = 'message_right'>"+mcs_click_right+"</div>"
                +"<div id = 'message_top_bg'></div>"
                +"<div id = 'message_top'>"+mcs_click_move+"</div>"
                +"<div id = 'message_bottom_bg'></div>"
                +"<div id = 'message_bottom'>"+mcs_click_down+"</div>"
                +"<div id = 'message_center_bg'></div>"
                +"<div id = 'message_center'>"+mcs_drag_rotation+"</div>";

            var dom_top = $("#message_top_bg"),dom_bottom = $("#message_bottom_bg"),
                dom_left = $("#message_left_bg"),dom_right = $("#message_right_bg"),
                dom_center = $("#message_center_bg"),dom_play_box = $("#play_box"),width = dom_play_box.width(),
                height = dom_play_box.height(),top = dom_play_box.offset().top,left = dom_play_box.offset().left;
            dom_top[0].style.cssText = "width:"+width*0.8+"px;height:"+height*0.15+"px;top:"+top+"px;left:"+(left+width*0.1)+"px";
            dom_top.next()[0].style.cssText = "width:"+width*0.8+"px;height:"+height*0.15+"px;top:"+top+"px;left:"+(left+width*0.1)+"px";
            dom_top.next().css("line-height",dom_top.height()+"px");
            dom_bottom[0].style.cssText = "width:"+width*0.8+"px;height:"+height*0.15+"px;bottom:"+(top+10)+"px;left:"+(left+width*0.1)+"px";
            dom_bottom.next()[0].style.cssText = "width:"+width*0.8+"px;height:"+height*0.15+"px;bottom:"+(top+10)+"px;left:"+(left+width*0.1)+"px";
            dom_bottom.next().css("line-height",dom_bottom.height()+"px");
            dom_left[0].style.cssText = "width:"+width*0.1+"px;height:"+height+"px;top:"+top+"px;left:"+left+"px";
            dom_left.next()[0].style.cssText = "width:"+width*0.1+"px;height:"+height+"px;top:"+top+"px;left:"+left+"px";
            dom_left.next().css("line-height",dom_left.height()+"px");
            dom_right[0].style.cssText = "width:"+width*0.1+"px;height:"+height+"px;top:"+top+"px;left:"+(left+0.9*width)+"px";
            dom_right.next()[0].style.cssText = "width:"+width*0.1+"px;height:"+height+"px;top:"+top+"px;left:"+(left+0.9*width)+"px";
            dom_right.next().css("line-height",dom_right.height()+"px");
            dom_center[0].style.cssText = "width:"+width*0.8+"px;height:"+(height*0.7)+"px;left:"+(left+dom_left.width())+"px;top:"+(dom_top.height()+top)+"px";
            dom_center.next()[0].style.cssText = "width:"+width*0.8+"px;height:"+(height*0.7)+"px;left:"+(left+dom_left.width())+"px;top:"+(dom_top.height()+top)+"px";
            dom_center.next().css("line-height",dom_center.height()+"px");
        }

        function play_event()
        {
            var setting_flag = false,dom_record=$("#record"),dom_photograph=$("#photograph"),dom_mic=$("#mic"),
                dom_setting=$("#setting_img"),show_flag=[false,false,false,false],time;

            function create_tip_dom(obj)
            {
                var tip=document.createElement("div");
                tip.setAttribute("id",obj.id);
                tip.setAttribute("class","ico_tip");
                tip.innerHTML = obj.text;
                obj.dom.append(tip);
                return tip;
            }

            dom_record.click(function()
            {
                var r_time = 0;
                g_dom_loading_gif.fadeIn();
                show_flag[0] = false;
                $("#record_tip").hide();
                if(g_play_flag == false) 
                {
                    g_play_flag = true;
                    $(this).css("background-position","0 -49px");
                    mcloud_agent.record({sn:g_playing_sn,keep_time:60000},null,function(msg,ref)
                    {
                        g_dom_loading_gif.fadeOut();
                        if(msg.result!= "")
                        {
                            error_handling(msg.result);
                            g_play_flag = false;
                            $("#record").css("background-position","-51px -49px");
                        }
                        else if(msg.result == ""&&msg.sd_ready == 0)
                        {
                            alert_box({text:mcs_sdcard_not_ready});
                            g_play_flag = false;
                            $("#record").css("background-position","-51px -49px");
                        }
                        else
                        {

                            function record_time()
                            {
                                if(g_play_flag)
                                {
                                    r_time += 60;
                                    $("#play_time").text(input_time_change({type:"int",data:r_time}));
                                    setTimeout(record_time,1000);
                                }
                                else
                                {
                                    $("#play_time").text("00:00");
                                }
                            }
                            setTimeout(record_time,1000);
                        }
                    });
                }
                else
                {
                    g_play_flag = false;
                    $("#record").css("background-position","-51px -49px");
                    mcloud_agent.record({sn:g_playing_sn,keep_time:-1},null,function(msg,ref)
                    {
                        if(msg.result!= "")
                        {
                            error_handling(msg.result);
                        }
                        else
                        {
                            g_dom_loading_gif.fadeOut();

                        }
                    });
                }
            });

            dom_record.mouseover(function()
            {
            	  show_flag[0] = true;
            	  time = setTimeout(function()
            	  {
            	  		if(show_flag[0])
            	  		{
            	  				var dom_tip = $("#record_tip")[0];
				                if(!dom_tip)
				                {
				                    dom_tip = create_tip_dom({id:"record_tip",text:mcs_record,dom:dom_record});
				                }
				                dom_tip.style.display = "block";
            	  		}
            	  		
            	  },1000);
                
            });

            dom_record.mouseout(function()
            {
            		show_flag[0] = false;
                $("#record_tip").hide();
            });

            dom_photograph.click(function()
            {
            		show_flag[1] = false;
            		$("#snapshot_tip").hide();
                time=setTimeout(function()
                {
                    g_photograph_time++;
                    alert_box({text:mcs_snapshot_failed});
                    $("#photograph").css("background-position","-153px -49px");
                    g_dom_loading_gif.fadeOut();
                },5000);
                g_dom_loading_gif.fadeIn();
                g_photo_flag = true;
                $(this).css("background-position","-102px -49px");
                mcloud_agent.pic_get({sn:g_playing_sn,token:"p1"},{time:g_photograph_time},function(msg,ref)
                {
                    clearTimeout(time);
                    if(msg.result!= "")
                    {
                        error_handling(msg.result);
                        g_dom_loading_gif.fadeOut();
                        $("#photograph").css("background-position","-153px -49px");
                    }
                    else if(g_photograph_time==ref.time&&msg.result=="")
                    {
                        var img = new Image();
                        img.src = msg.url;
                        show_photo(img);
                    }
                });
                // g_server_device = g_location_host;
                // create_snapshot_preview();
                // function create_snapshot_preview()
                // {  
                //     play_box_left = parseInt($("#play_box").css("left"));
                //     preview_left = play_box_left+100;
                //     play_box_top = parseInt($("#play_box").css("top"));
                //     preview_top = play_box_top+40;
                //     play_box_width = parseInt($("#play_box").css("width"));
                //     play_box_height = parseInt($("#play_box").css("height"));
                //     if(play_box_width < 876 || play_box_height < 493){
                //         preview_width = play_box_width/1.3;
                //         preview_height = play_box_height/1.3;
                //     }else{
                //         preview_width = 876/1.3;
                //         preview_height = 493/1.3;
                //     }
                //     var url = window.location.protocol + "//" + g_server_device + "/ccm/ccm_pic_get.jpg?hfrom_handle=887330&dsess=1&dsess_nid="+mcloud_agent.create_nid()+"&dsess_sn="+g_playing_sn+"&dtoken="+"p1_xxxxxxxxxx";
                //     $("#play_box").after("<div id='snapshot_preview' style='left:"+preview_left+"px;top:"+preview_top+"px;'>"
                //                             +"<div id='snapshot_preview_inner'>"
                //                                 +"<div id='snapshot_preview_close' style='background:url(http://"+g_server_device+"/imgs/mipc_img.png) -390px -146px no-repeat;left:"+preview_width+"px'>"
                //                                 +"</div>"
                //                                 +"<img width='"+preview_width+"px' height='"+preview_height+"px' src='"+url+"'>"
                //                             +"</div>" 
                //                         +"</div>")
                //     $("#snapshot_preview_close").hover(function(){
                //         $(this).css({"background":"url(http://"+g_server_device+"/imgs/mipc_img.png) -360px -146px no-repeat"})
                //     },function(){
                //         $(this).css({"background":"url(http://"+g_server_device+"/imgs/mipc_img.png) -390px -146px no-repeat"})
                //     })
                //     $("#snapshot_preview_close").click(function(){
                //         $("#snapshot_preview").remove();
                //     })
                // }

            });

            dom_photograph.mouseover(function()
            {
            		show_flag[1] = true;
            	  time = setTimeout(function()
            	  {
            	  		if(show_flag[1])
            	  		{
            	  				var dom_tip = $("#snapshot_tip")[0];
				                if(!dom_tip)
				                {
				                    dom_tip = create_tip_dom({id:"snapshot_tip",text:mcs_snapshot,dom:dom_photograph});
				                }
				                dom_tip.style.display = "block";
            	  		}
            	  		
            	  },1000);
            	
                
            });

            dom_photograph.mouseout(function()
            {
            		show_flag[1] = false;
                $("#snapshot_tip").hide();
            });

            dom_mic.mousedown(function()
            {
                g_dom_loading_gif.fadeIn();
                show_flag[2] = false;
                $("#mic_tip").hide();
                $(this).css("background-position","-204px -49px");
                $("#mic_div").css("display","block");
                $(".triangle")[0].style.display = "block";
                mcloud_agent.pushtalk({sn:g_playing_sn,protocol:"rtdp",token:"p1"},null,function(msg,ref)
                {
                    g_dom_loading_gif.fadeOut();
                    if(msg.result!= "")
                    {
                        error_handling(msg.result);
                    }
                    else
                    {
                        if(!$("#mic_div").is(":hidden"))
                        {
                            chl_audio_create({type:"publish",url:msg.url, params:"", inner_window_info:g_playing_mme.ref_obj.inner_window_info});
                            var m_time = 0;
                            g_mic_flag = true;
                            setTimeout(mic_time,1000);
                        }
                        else
                        {
                            g_playing_mme.chl_destroy(g_playing_mme.ref_obj.inner_window_info.audio_chls);
                            g_playing_mme.ref_obj.inner_window_info.audio_chls = null;
                        }
                        function mic_time()
                        {
                            if(g_mic_flag)
                            {
                                m_time += 60;
                                $("#mic_time").text(input_time_change({type:"int",data:m_time}));
                                setTimeout(mic_time,1000);
                            }
                            else
                            {
                                $("#mic_time").text("00:00");
                            }
                        }
                    }
                });

            });

            dom_mic.mouseup(function()
            {
                g_mic_flag = false;
                dom_mic.css("background-position","-255px -49px");
                $("#mic_div").css("display","none");
                $(".triangle")[0].style.display = "none";
                g_playing_mme.chl_destroy(g_playing_mme.ref_obj.inner_window_info.audio_chls);
                g_playing_mme.ref_obj.inner_window_info.audio_chls = null;
            });

            dom_mic.mouseover(function()
            {
                show_flag[2]=true;
                var time=setTimeout(function()
                {
                    if(show_flag[2] && $("#mic_text").is(":hidden"))
                    {
                        var dom_tip = $("#mic_tip")[0];
                        if(!dom_tip)
                        {
                            dom_tip = create_tip_dom({id:"mic_tip",text:mcs_call,dom:dom_mic});
                        }
                        dom_tip.style.display = "block";
                    }
                },1000);

            });

            dom_mic.mouseout(function()
            {
                show_flag[2]=false;
                $("#mic_tip").hide();
            });

            dom_setting.click(function()
            {
                var dom_setting_page = $("#setting_page");
                show_flag[3] = false;
                $("#setting_tip").hide();
                if(setting_flag == false)
                {
                    g_dom_loading_gif.fadeIn();
                    setting_flag = true;
                    $("#setting").css("background-position","-306px -49px ");
                    dom_setting_page.css("display","block");
                    $("#background_div").css("display","block");
                    create_setting_page();
                    $(".triangle")[1].style.display = "block";
                    if(g_dom_turn_around)
                    {
                        for(var i = 0;i<5;i++)
                        {
                            g_dom_turn_around[i].css("display","none");
                        }
                    }
                }
                else
                {
                    setting_flag = false;
                    $("#setting").css("background-position","-357px -49px");
                    $("#setting_page").css("display","none");
                    $("#background_div").css("display","none");
                    $(".triangle")[1].style.display = "none";
                    if(g_dom_turn_around)
                    {
                        for(var i = 0;i<5;i++)
                        {
                            g_dom_turn_around[i].css("display","block");
                        }
                    }
                }
            });

            dom_setting.mouseover(function()
            {
								show_flag[3]=true;
                var time=setTimeout(function()
                {
                		if(show_flag[3])
                		{
	                			var dom_tip = $("#setting_tip")[0];
				                if(!dom_tip)
				                {
				                    dom_tip = create_tip_dom({id:"setting_tip",text:mcs_settings,dom:dom_setting});
				                }
				                dom_tip.style.display = "block";
                		}
		                
		            },1000);
            });

            dom_setting.mouseout(function()
            {
            		show_flag[3]=false;
                $("#setting_tip").hide();
            });
        }

        function create_setting_page()
        {
            document.getElementById("setting_page").innerHTML = "<div id = 'setting_menu'>"
                +"<div id = 'set_video'>"
                +"<div id='set_video_img' ></div>"
                +"<span class = 'setting_menu_text'>"+mcs_audio_and_video+"<span>"
                +"</div>"
                +"<div id = 'set_pic'>"
                +"<div id = 'set_pic_img'></div>"
                +"<span class = 'setting_menu_text'>"+mcs_picture+"<span>"
                +"</div>"
                +"</div>"
                +"<div id = 'setting_main'>"
                +"<div class = 'setting_item'>"
                +"<span class = 'setting_text'>"+mcs_sharpness+"</span>"
                +"<div id = 'sharpness' class = 'out_box'>"
                +"<div class = 'in_box'></div>"
                +"<div class = 'circle'><div class = 'show_value'></div></div>"
                +"</div>"
                +"</div>"
                +"<div class = 'setting_item'>"
                +"<span class = 'setting_text'>"+mcs_color_saturation+"</span>"
                +"<div id = 'saturation' class = 'out_box'>"
                +"<div class = 'in_box'></div>"
                +"<div class = 'circle'><div class = 'show_value'></div></div>"
                +"</div>"
                +"</div>"
                +"<div class = 'setting_item'>"
                +"<span class = 'setting_text'>"+mcs_contrast+"</span>"
                +"<div id = 'contrast' class = 'out_box'>"
                +"<div class = 'in_box'></div>"
                +"<div class = 'circle'><div class = 'show_value'></div></div>"
                +"</div>"
                +"</div>"
                +"<div class = 'setting_item'>"
                +"<span class = 'setting_text'>"+mcs_brightness+"</span>"
                +"<div id = 'brightness' class = 'out_box'>"
                +"<div class = 'in_box'></div>"
                +"<div class = 'circle'><div class = 'show_value'></div></div>"
                +"</div>"
                +"</div>"
                +"<div class = 'setting_item'>"
                +"<span class = 'setting_text'>"+mcs_mode+"</span>"
                +"<input type = 'button' value = "+mcs_auto+" class = 'left_button'>"
                +"<input type = 'button' value = "+mcs_daytime+" class = 'center_button'>"
                +"<input type = 'button' value = "+mcs_night+" class = 'right_button'>"
                +"</div>"
                +"<input type = 'button' value = "+mcs_reset+" id = 'reset'>"
                +"</div>";
            var circle = $(".circle"),dom_out_box = $(".out_box");
            for(var i = 0;i<circle.length;i++)
            {
                circle[i].style.top = dom_out_box[i].offsetTop+"px";
            }

            function add_setting_event()
            {
                var dom_left = $(".left_button")[0],dom_center = $(".center_button")[0],dom_right = $(".right_button")[0],
                    dom_out_box = $(".out_box"),dom_in_box = $(".in_box"),outX,values_flag = [false,false,false,false],
                    dom_circle = $(".circle"),left,top,mouseX, i,evt,dom_value = $(".show_value");
                dom_out_box.mousedown(function(e)
                {
                    for(i = 0;i<4;i++)
                    {
                        if(this == dom_out_box[i])
                        {
                            values_flag[i] = true;
                            break;
                        }
                    }
                    evt = window.event || e;
                    outX = this.offsetLeft;
                    mouseX = evt.clientX-getLeft($("#setting_page")[0]);
                    var value = mouseX-outX;
                    if(value>160)
                    {
                        dom_in_box[i].style.width = "160px";
                        dom_circle[i].style.left = outX+160+"px";
                    }
                    else if(value <= 0)
                    {
                        dom_in_box[i].style.width = "0";
                        dom_circle[i].style.left = outX+"px";
                    }
                    else
                    {
                        dom_in_box[i].style.width = value+"px";
                        dom_circle[i].style.left = mouseX+"px";
                    }
                    dom_value[i].style.display = "block";
                    dom_value[i].innerHTML = parseInt(dom_in_box[i].offsetWidth/1.6);

                });

                document.onmousemove = (function(e)
                {
                    evt = window.event||e;
                    if(values_flag[0]||values_flag[1]||values_flag[2]||values_flag[3])
                    {
                        mouseX = evt.clientX-getLeft($("#setting_page")[0]);
                        var value = mouseX-outX;
                        if(value>160)
                        {
                            dom_in_box[i].style.width = "160px";
                            dom_circle[i].style.left = outX+160+"px";
                        }
                        else if(value <= 0)
                        {
                            dom_in_box[i].style.width = "0";
                            dom_circle[i].style.left = outX+"px";
                        }
                        else
                        {
                            dom_in_box[i].style.width = value+"px";
                            dom_circle[i].style.left = mouseX+"px";
                        }
                        dom_value[i].innerHTML = parseInt(dom_in_box[i].offsetWidth/1.6);
                    }
                });

                document.onmouseup = (function(e)
                {
                    if(values_flag[0]||values_flag[1]||values_flag[2]||values_flag[3])
                    {
                        g_dom_loading_gif.fadeIn();
                        dom_value.fadeOut();
                        g_cam_conf.sharpness = parseInt(dom_in_box[0].offsetWidth/1.6);
                        g_cam_conf.color_saturation = parseInt(dom_in_box[1].offsetWidth/1.6);
                        g_cam_conf.contrast = parseInt(dom_in_box[2].offsetWidth/1.6);
                        g_cam_conf.brightness = parseInt(dom_in_box[3].offsetWidth/1.6);
                        mcloud_agent.cam_set(g_cam_conf,null,function(msg,ref)
                        {
                            g_dom_loading_gif.fadeOut();
                            if(msg.result!= "")
                            {
                                error_handling(msg.result);
                            }
                        });
                        values_flag = [false,false,false,false];
                    }

                });

                function change_cam_mode(obj)
                {
                    dom_left.style.background = "#ffffff";
                    dom_left.style.color = "#22aaaa";
                    dom_center.style.background = "#ffffff";
                    dom_center.style.color = "#22aaaa";
                    dom_right.style.background = "#ffffff";
                    dom_right.style.color = "#22aaaa";
                    if(obj == "auto")
                    {
                        dom_left.style.background = "#22aaaa";
                        dom_left.style.color = "#ffffff";
                    }
                    else if(obj == "day")
                    {
                        dom_center.style.color = "#ffffff";
                        dom_center.style.background = "#22aaaa";
                    }
                    else
                    {
                        dom_right.style.background = "#22aaaa";
                        dom_right.style.color = "#ffffff";
                    }
                }

                $("#set_video")[0].onclick = (function()
                {
                    g_dom_loading_gif.fadeIn();
                    $("#set_video")[0].style.borderBottom = "1px solid #22aaaa";
                    $("#set_pic")[0].style.borderBottom = "0";
                    document.getElementById("setting_main").innerHTML = "<div>"
                        +"<div class = 'setting_item'>"
                        +"<span class = 'setting_text'>"+mcs_sound+"</span>"
                        +"</div>"
                        +"<div class = 'setting_item'>"
                        +"<span class = 'setting_text'>"+mcs_volume+"</span>"
                        +"<div id = 'volue' class = 'out_box'>"
                        +"<div class = 'in_box'></div>"
                        +"<div class = 'circle'><div class = 'show_value'></div></div>"
                        +"</div>"
                        +"</div>"
                        +"<div class = 'setting_item_ex'>"
                        +"<span class = 'setting_text'>"+mcs_outinput+"</span>"
                        +"<input type = 'button' value = '"+mcs_handsfree+"' class = 'left_button'>"
                        +"<input type = 'button' value = '"+mcs_headphone+"' class = 'center_button'>"
                        +"<input type = 'button' value = '"+mcs_mute+"' class = 'right_button'>"
                        +"</div>"
                        +"<div class = 'setting_item'>"
                        +"<span class = 'setting_text'>"+mcs_video+"</span>"
                        +"</div>"
                        +"<div class = 'setting_item'>"
                        +"<span class = 'setting_text'>"+mcs_size+"</span>"
                        //+"<input type = 'button' value = '自动' class = 'left_button'>"
                        +"<input type = 'button' value = '720p' class = 'left_button'>"
                        +"<input type = 'button' value = '360p' class = 'center_button'>"
                        +"<input type = 'button' value = '180p' class = 'center_button'>"
                        +"<input type = 'button' value = '90p' class = 'right_button'>"
                        +"</div>"
                        /*  +"<div class = 'setting_item'>"
                         +"<span class = 'setting_text'>质量</span>"
                         +"<input type = 'button' value = '默认' class = 'left_button'>"
                         +"<input type = 'button' value = '流畅' class = 'center_button'>"
                         +"<input type = 'button' value = '清晰' class = 'right_button'>"
                         +"<span class = 'setting_text'>优先</span>"
                         +"</div>"*/
                        +"</div>";
                    $("#set_video_img").css("background-position","-310px 0");
                    $("#set_pic_img").css("background-position","-555px 0");
                    var buttons = $("input:button"),
                        tokens = ["720p","360p","180p","90p"],dom_in_box=$(".in_box"),dom_circle=$(".circle"),
                        dom_out_box=$("#volue"),mic_value,move_flag=false;
                    for(var i = 3;i<7;i++)
                    {
                        if(getCookie("token") == "p"+(i-3))
                        {
                            buttons[i].style.cssText = "background:#22aaaa;color:#ffffff";
                        }
                        buttons[i].onclick = (function()
                        {
                            var token = (this.value == "720p")?"p0":((this.value == "360p")?"p1":((this.value == "180p")?"p2":"p3"));
                            g_dom_loading_gif.fadeIn();
                            if(token!= getCookie("token"))
                            {
                                setCookie("token",token);
                                for(var i = 3;i<7;i++)
                                {
                                    buttons[i].style.cssText = "background:#ffffff;color:#22aaaa";
                                }
                                this.style.cssText = "background:#22aaaa;color:#ffffff";

                                var inner_window_info = {dom_id:("inner_window" + g_playing_num), index:g_playing_num, video_chls:null, audio_chls:null, mme:null, ipc_state:"", node_sn:""};
                                create_mme({inner_window_info:inner_window_info,page:"home",protocol:"auto",dom:$("#play_box")[0]});
                            }
                        });
                    }
                    mcloud_agent.audio_get({sn:g_playing_sn},null,function(msg,ref)
                    {
                        g_dom_loading_gif.fadeOut();
                        if(msg.result!= "")
                        {
                            error_handling(msg.result);
                        }
                        else
                        {
                            dom_in_box[0].style.width = msg.speaker_level*1.6+"px";
                            dom_circle[0].style.cssText = "left:"+(dom_out_box[0].offsetLeft+msg.speaker_level*1.6)+"px;top:"+dom_out_box[0].offsetTop+"px";
                            mic_value=msg.mic_level;
                        }

                    });
                    dom_out_box.mousedown(function(e)
                    {
                        move_flag=true;
                        evt = window.event || e;
                        outX = this.offsetLeft;
                        mouseX = evt.clientX-getLeft($("#setting_page")[0]);
                        var value = mouseX-outX;
                        if(value>160)
                        {
                            dom_in_box[0].style.width = "160px";
                            dom_circle[0].style.left = outX+160+"px";
                        }
                        else if(value <= 0)
                        {
                            dom_in_box[0].style.width = "0";
                            dom_circle[0].style.left = outX+"px";
                        }
                        else
                        {
                            dom_in_box[0].style.width = value+"px";
                            dom_circle[0].style.left = mouseX+"px";
                        }
                        dom_value = $(".show_value");
                        dom_value[0].style.display = "block";
                        dom_value[0].innerHTML = parseInt(dom_in_box[0].offsetWidth/1.6);

                    });
                    document.onmousemove = (function(e)
                    {
                        if(move_flag)
                        {
                            evt = window.event||e;
                            mouseX = evt.clientX-getLeft($("#setting_page")[0]);
                            var value = mouseX-outX;
                            if(value>160)
                            {
                                dom_in_box[0].style.width = "160px";
                                dom_circle[0].style.left = outX+160+"px";
                            }
                            else if(value <= 0)
                            {
                                dom_in_box[0].style.width = "0";
                                dom_circle[0].style.left = outX+"px";
                            }
                            else
                            {
                                dom_in_box[0].style.width = value+"px";
                                dom_circle[0].style.left = mouseX+"px";
                            }
                            dom_value[0].innerHTML = parseInt(dom_in_box[0].offsetWidth/1.6);
                        }

                    });

                    document.onmouseup = (function(e)
                    {
                        move_flag=false;
                        g_dom_loading_gif.fadeIn();
                        dom_value.fadeOut();
                        // mcloud_agent.audio_set({sn:g_playing_sn,mic_level:mic_value,speaker_level:parseInt(dom_in_box[0].offsetWidth/1.6)},null,function(msg,ref)
                        // {
                        //    if(msg.result!="")
                        //    {
                        //        error_handling(msg.result);
                        //    }
                        //    else
                        //    {
                        //        g_dom_loading_gif.fadeOut();

                        //    }
                        // });
                    });
                });

                $("#set_pic")[0].onclick = (function()
                {
                    g_dom_loading_gif.fadeIn();
                    create_setting_page();
                    g_dom_loading_gif.fadeOut();
                });

                dom_left.onclick = (function()
                {
                    g_dom_loading_gif.fadeIn();
                    change_cam_mode("auto");
                    g_cam_conf.day_night = "auto";
                    g_cam_conf.sn = g_playing_sn;
                    mcloud_agent.cam_set(g_cam_conf,null,function(msg,ref)
                    {
                        g_dom_loading_gif.fadeOut();
                        if(msg.result!= "")
                        {
                            error_handling(msg.result);
                        }
                        else
                        {
                            show_message_box({text:mcs_set_successfully});
                        }
                    });
                });

                dom_center.onclick = (function()
                {
                    g_dom_loading_gif.fadeIn();
                    change_cam_mode("day");
                    g_cam_conf.day_night = "day";
                    mcloud_agent.cam_set(g_cam_conf,null,function(msg,ref)
                    {
                        g_dom_loading_gif.fadeOut();
                        if(msg.result!= "")
                        {
                            error_handling(msg.result);
                        }
                        else
                        {
                            show_message_box({text:mcs_set_successfully});
                        }
                    });
                });

                dom_right.onclick = (function()
                {
                    g_dom_loading_gif.fadeIn();
                    change_cam_mode("night");
                    g_cam_conf.day_night = "night";
                    g_cam_conf.sn = g_playing_sn;
                    mcloud_agent.cam_set(g_cam_conf,null,function(msg,ref)
                    {
                        g_dom_loading_gif.fadeOut();
                        if(msg.result!= "")
                        {
                            error_handling(msg.result);
                        }
                        else
                        {
                            show_message_box({text:mcs_set_successfully});
                        }
                    });
                });

                $("#reset").click(function()
                {
                    g_dom_loading_gif.fadeIn();
                    for(var i = 0;i<4;i++)
                    {
                        dom_in_box[i].style.width = g_cam_conf_reset[i]*1.6+"px";
                        dom_circle[i].style.left = dom_out_box[i].offsetLeft+dom_in_box[i].offsetWidth+"px";
                    }
                    change_cam_mode("auto");
                    g_cam_conf.sharpness = g_cam_conf_reset[0];
                    g_cam_conf.color_saturation = g_cam_conf_reset[1];
                    g_cam_conf.contrast = g_cam_conf_reset[2];
                    g_cam_conf.brightness = g_cam_conf_reset[3];
                    g_cam_conf.day_night = "auto";
                    mcloud_agent.cam_set(g_cam_conf,null,function(msg,ref)
                    {
                        g_dom_loading_gif.fadeOut();
                        if(msg.result!= "")
                        {
                            error_handling(msg.result);
                        }
                    });
                });

                mcloud_agent.cam_get({sn:g_playing_sn},null,function(msg,ref)
                {
                    g_dom_loading_gif.fadeOut();
                    if(msg.result == "")
                    {
                        g_cam_conf = msg;
                        g_cam_conf.sn = g_playing_sn;
                        dom_in_box[0].style.width = parseInt(g_cam_conf.sharpness*1.6)+"px";
                        dom_in_box[1].style.width = parseInt(g_cam_conf.color_saturation*1.6)+"px";
                        dom_in_box[2].style.width = parseInt(g_cam_conf.contrast*1.6)+"px";
                        dom_in_box[3].style.width = parseInt(g_cam_conf.brightness*1.6)+"px";
                        for(var j = 0;j<4;j++)
                        {
                            dom_circle[j].style.left = dom_out_box[j].offsetLeft+dom_in_box[j].offsetWidth+"px";
                            dom_circle[j].style.top = dom_out_box[j].offsetTop+"px";
                        }

                        change_cam_mode(g_cam_conf.day_night);
                    }
                    else
                    {
                        error_handling(msg.result);
                    }
                });
            }
            add_setting_event();
        }

        // $("#bottom_box")[0].style.display = "block";
        $("#dev_list").remove();
        $("#history_main").remove();
        $("#setup_list").remove();

        common_menu({type:"play"});
        create_play_main({num:obj.num});
        create_play_bottom();
        play_event();

    }

    function create_rotation_point()
    {
        var around_flag = true,dom_menu_box = $("#menu_box"),dom_arrow = new Array();
        if(!$("#turn_up")[0])
        {
            create_dom("turn_up",dom_menu_box);
            create_dom("turn_down",dom_menu_box);
            create_dom("turn_left",dom_menu_box);
            create_dom("turn_right",dom_menu_box);
            create_dom("turn_center",dom_menu_box);
        }

        function mouse_down()
        {
            if($("#play_box")[0])
            {
                var x, y,num,dom_play_box = $("#play_box")[0],
                    width = dom_play_box.offsetWidth,height = dom_play_box.offsetHeight,top = dom_play_box.offsetTop,
                    left = dom_play_box.offsetLeft;
                g_dom_turn_around = new Array();
                g_dom_turn_around = [$("#turn_up"),$("#turn_down"),$("#turn_left"),$("#turn_right"),$("#turn_center")];
                g_dom_turn_around[0][0].innerHTML = "<div id = 'up_img'></div>";
                g_dom_turn_around[1][0].innerHTML = "<div id = 'down_img'></div>";
                g_dom_turn_around[2][0].innerHTML = "<div id = 'left_img'></div>";
                g_dom_turn_around[3][0].innerHTML = "<div id = 'right_img'></div>";
                dom_arrow = [$("#up_img"),$("#down_img"),$("#left_img"),$("#right_img")];
                g_dom_turn_around[0][0].style.cssText = "width:"+width*0.8+"px;height:"+height*0.15+"px;top:"+top+"px;left:"+(left+width*0.1)+"px";
                g_dom_turn_around[1][0].style.cssText = "width:"+width*0.8+"px;height:"+height*0.15+"px;bottom:"+(top+10)+"px;left:"+(left+width*0.1)+"px";
                g_dom_turn_around[2][0].style.cssText = "width:"+width*0.1+"px;height:"+height+"px;top:"+top+"px;left:"+left+"px";
                g_dom_turn_around[3][0].style.cssText = "width:"+width*0.1+"px;height:"+height+"px;top:"+top+"px;right:"+left+"px";
                g_dom_turn_around[4][0].style.cssText = "width:"+width*0.8+"px;height:"+(height*0.7)+"px;left:"+(left+width*0.1)+"px;top:"+(top+height*0.15)+"px";

                for(var i = 0;i<4;i++)
                {
                    g_dom_turn_around[i].mousedown(function()
                    {
                        around_flag = true;
                        num = (this == g_dom_turn_around[0][0])?0:((this == g_dom_turn_around[1][0])?1:((this == g_dom_turn_around[2][0])?2:3));
                        x = (num == 0||num == 1)?0:((num == 2)?-15:15);
                        y = (num == 2||num == 3)?0:((num == 0)?5:-5);
                        mcloud_agent.ptz_ctrl({sn:g_playing_sn,x:x,y:y},{dom:this},function(msg,ref)
                        {
                            if(msg.result!= "")
                            {
                                error_handling(msg.result);
                            }
                            else if(msg.result == ""&&around_flag)
                            {
                                $(ref.dom).mousedown();
                            }
                        });
                    });

                    g_dom_turn_around[i].mouseover(function()
                    {
                        num = (this == g_dom_turn_around[0][0])?0:((this == g_dom_turn_around[1][0])?1:((this == g_dom_turn_around[2][0])?2:3));
                    });

                    g_dom_turn_around[i].mouseout(function()
                    {
                        num = (this == g_dom_turn_around[0][0])?0:((this == g_dom_turn_around[1][0])?1:((this == g_dom_turn_around[2][0])?2:3));
                    });

                }
            }
        }

        function mouse_move()
        {
            if($("#play_box")[0])
            {
                var move_flag = false,mouseX,mouseY,window_width,window_height,
                moving_distanceX,moving_distanceY,clickX,clickY;
                $("#turn_center").mousedown(function(e)
                {
                    if($("#play_box")[0])
                    {
                        var evt = window.event || e;
                        mouseX = evt.clientX,mouseY = evt.clientY,
                            window_width = $(window).width(),window_height = $(window).height();
                        var min_X = window_width*0.1+$("#turn_left")[0].offsetWidth,max_X = window_width*0.9-$("#turn_right")[0].offsetWidth,
                            min_Y = $("#turn_up")[0].offsetTop+$("#turn_up")[0].offsetHeight,max_Y = $("#turn_down")[0].offsetTop;
                        if(mouseX>min_X&&mouseX<max_X&&mouseY>min_Y&&mouseY<max_Y)
                        {
                            move_flag = true;
                            clickX = mouseX;
                            clickY = mouseY;
                        }
                    }
                });

                document.onmousemove = (function(e)
                {
                    if($("#play_box")[0])
                    {
                        var evt = window.event || e;
                        if(move_flag)
                        {
                            moving_distanceX = evt.clientX-clickX;
                            moving_distanceY = evt.clientY-clickY;
                            if(Math.abs(moving_distanceX)>Math.abs(moving_distanceY))
                            {
                                if(moving_distanceX>0)
                                {
                                    dom_arrow[0].fadeOut();
                                    dom_arrow[1].fadeOut();
                                    dom_arrow[3].fadeOut();
                                    dom_arrow[2].fadeIn();
                                }
                                else if(moving_distanceX<0)
                                {
                                    dom_arrow[0].fadeOut();
                                    dom_arrow[1].fadeOut();
                                    dom_arrow[3].fadeIn();
                                    dom_arrow[2].fadeOut();
                                }
                                $("#turn_center").css("cursor","w-resize");
                            }
                            else
                            {
                                if(moving_distanceY>0)
                                {
                                    dom_arrow[0].fadeIn();
                                    dom_arrow[1].fadeOut();
                                    dom_arrow[2].fadeOut();
                                    dom_arrow[3].fadeOut();
                                }
                                else if(moving_distanceY<0)
                                {
                                    dom_arrow[1].fadeIn();
                                    dom_arrow[0].fadeOut();
                                    dom_arrow[2].fadeOut();
                                    dom_arrow[3].fadeOut();
                                }
                                $("#turn_center").css("cursor","s-resize");
                            }
                        }
                    }
                });

                document.onmouseup = (function(e)
                {
                    var evt = window.event || e;
                    if($("#play_box")[0])
                    {
                        if(move_flag)
                        {
                            move_flag = false;
                            moving_distanceX = evt.clientX-clickX;
                            moving_distanceY = evt.clientY-clickY;
                            clickX = evt.clientX;
                            clickY = evt.clientY;
                            move(-moving_distanceX,moving_distanceY);

                        }
                        around_flag = false;
                        $("#turn_center").css("cursor","default");
                        return;
                    }
                });

                function move(distanceX,distanceY)
                {
                    mcloud_agent.ptz_ctrl({sn:g_playing_sn,x:parseInt(distanceX/10),y:parseInt(distanceY/10)},"",function(msg,ref)
                    {
                        for(var i = 0;i<4;i++)
                        {
                            dom_arrow[i].fadeOut();
                        }
                        if(msg.result!= "")
                        {
                            error_handling(msg.result);
                        }
                    });
                }
            }
        }

        mouse_down();
        mouse_move();

        if(!$("#setting_page").is(":hidden"))
        {
            for(var i = 0;i<5;i++)
            {
                g_dom_turn_around[i].css("display","none");
            }
        }
    }

    function history_class(obj)
    {
        function create_history_main()
        {
            $("#more_pic").remove();
            mcloud_agent.msgs_get({sn:g_playing_sn,start:l_start,counts:"-30",filter:""},null,
                function(msg,ref)
                {
                    if(msg.result == "")
                    {
                        l_length = (msg.messages)?msg.messages.length:0;
                        l_start = (msg.messages)?msg.messages[l_length-1].msg_id:"0X7fffffff";
                        g_max_id[g_playing_num] = msg.max_id;
                        l_min_id = msg.min_id;
                        var i = 0,load_images = new Array();
                        for(var i = 0;i<l_length;i++)
                        {
                            l_pic_id[i + 30 * g_click_time] = msg.messages[i];
                            g_history_message[i + 30 * g_click_time] = msg.messages[i];
                            l_message[i + 30 * g_click_time] = msg.messages[i].p;
                            msg.messages[i].p = msg.messages[i].p?msg.messages[i].p:" ";
                            var now_params = msg.messages[i].p;
                            if(!g_last_time)
                            {
                            	g_first_time = new Date(msg.messages[i].date * 1000).Format("yyyy-MM-dd");
                            }
                            if (new Date(msg.messages[i].date * 1000).Format("yyyy-MM-dd") != g_last_time) {
                                g_last_time = new Date(msg.messages[i].date * 1000).Format("yyyy-MM-dd");
                                var time = document.createElement("div");
                                time.setAttribute("class", "time_div");
                                time.innerHTML = g_last_time + "  " + g_weekArray[new Date(msg.messages[i].date * 1000).getDay()];
                                $("#history_main")[0].appendChild(time);
                                $(time).css("clear", "both");
                            }
                            var history_img = document.createElement("div");
                            history_img.setAttribute("class", "img_box");
                            var img = document.createElement("img");
                            img.setAttribute("class", "video_and_photo");
                            img.setAttribute("id", msg.messages[i].msg_id);
                            img.setAttribute("name", msg.messages[i].type);
                            history_img.appendChild(img);
                            $("#history_main")[0].appendChild(history_img);
                            for (var j = 0; j < now_params.length; j++) 
                            {
                                if (now_params[j].n == "img_thumb_token" && now_params[j].v != 0 && now_params[j].v != "") 
                                {
                                    var pic_url = "http://" + g_location_host + "/ccm/ccm_pic_get.jpg?hfrom_handle=887330&dsess=1&dsess_nid=" + mcloud_agent.create_nid() + "&dsess_sn=" + g_playing_sn + "&dtoken=" + now_params[j].v;
                                    load_images[i+g_click_time*30] = new Image();
                                    load_images[i+g_click_time*30].src = pic_url;
                                    load_images[i+g_click_time*30].onload = (function()
                                    {
                                    	var dom_image = $(".video_and_photo");
                                    	if(dom_image.length > 0)
									                    {
                                            for(var j = 0;j < g_history_message.length;j++)
                                            {
                                                if(this == load_images[j])
                                                {
                                                    break;
                                                }
                                            }
                                            	dom_image[j].src = this.src;
                                     	}
                                    });
                                    g_history_url[i + 30 * g_click_time] = pic_url;
                                }
                                else if(now_params[j].n == "img_token" && now_params[j].v != 0 && now_params[j].v != "")
                                {
                                	g_big_img_url[i + 30 * g_click_time]="http://" + g_location_host + "/ccm/ccm_pic_get.jpg?hfrom_handle=887330&dsess=1&dsess_nid=" + mcloud_agent.create_nid() + "&dsess_sn=" + g_playing_sn + "&dtoken=" + now_params[j].v;
                                }
                            }
                            var mark = document.createElement("div");
                            mark.setAttribute("class", "mark_of_pic");
                            mark.innerHTML = (msg.messages[i].type == "snapshot")?mcs_snapshot:(msg.messages[i].type == "record")?mcs_record:mcs_motion_alert;
                            history_img.appendChild(mark);
                            if (i == l_length - 1) {
                                g_shown_pic  += l_length;
                                if (msg.total > g_shown_pic&&msg.total>30) {
                                    var more_pic = document.createElement("input");
                                    more_pic.setAttribute("type", "button");
                                    more_pic.setAttribute("id", "more_pic");
                                    more_pic.setAttribute("value", mcs_show_more);
                                    $("#history_main")[0].appendChild(more_pic);
                                }
                                add_history_event();
                            }
                            g_shown_history = true;
                        }
                        if(!msg.messages)
                        {
                            $("#history_main")[0].innerHTML = mcs_no_history;
                        }
                        g_dom_loading_gif.fadeOut();
                    }
                    else if(msg.result = "InvalidSession")
                    {
                        create_history_main();
                    }
                    else
                    {
                        error_handling(msg.result);
                    }
                });
        }

        function add_history_event()
        {
            var video_and_photo = $(".video_and_photo"),
                dom_more = $("#more_pic");
            for(var i = 0;i<video_and_photo.length;i++)
            {
                video_and_photo[i].onclick = (function()
                {
                    var p;
                    for(var j = 0;j<video_and_photo.length;j++)
                    {
                        if(this == video_and_photo[j])
                        {
                            p = g_history_message[j].p[0];
                            break;
                        }
                    }
                    if(this.name == "snapshot")
                    {
                        show_snapshot({id:this.id,text:this.name,num:g_shown_pic,j:j});
                    }
                    else if(this.name == "record")
                    {
                        show_snapshot({id:this.id,text:this.name,num:g_shown_pic,token: p.v,j:j});
                    }
                    else if(this.name == "alert")
                    {
                        show_snapshot({id:this.id,text:this.name,num:g_shown_pic,j:j});
                    }

                });
            }
            if(dom_more[0])
            {
                dom_more[0].onclick = function()
                {
                    g_click_time++;
                    g_dom_loading_gif.fadeIn();
                    create_history_main();
                };
            }

        }

        function show_snapshot(obj)
        {
            create_show_menu();
            create_show_main({id:obj.id,text:obj.text,token:obj.token,num:obj.j});
            add_show_event();
            function create_show_menu()
            {
                $("#menu_box")[0].innerHTML = "<div class = 'back'>"
                    +"<div  class = 'back_ico'></div>"
                    +"<span class = 'back_text'>"+mcs_history+"</span>"
                    +"</div>"
                    +"<div id = 'share'>"
                    +"</div>";
            }
            function create_show_main(obj)
            {
                $("#history_main")[0].style.display = "none";
                var date = new Date(g_history_message[obj.num].date*1000),dom_show_main;
                dom_show_main = create_dom("show_main",$("#menu_box")[0]);
                dom_show_main.innerHTML = "<div class = 'time_div_s'>"
                    +"<span class = 'time_left'>"+date.Format("yyyy-MM-dd")+"  "+g_weekArray[date.getDay()]+" "+date.Format("hh:mm:ss")+"</span>"
                    +"<span id = 'photo_type' class = 'time_right'></span>"
                    +"</div>"
                    +"<div id = 'show'>"
                    +"<img class = 'show_pic'>"
                    +"</div>";
                var height = $(window).height()*540/775;
                var width = $(window).width()*960/1440;
                $("#show")[0].style.cssText = "width:"+width+"px;height:"+height+"px;margin-left:"+(-width/2)+"px;";

                if(obj.text == "record")
                {
                    $(".show_pic").fadeOut();
                    $("#photo_type").text(mcs_record);
                    mcloud_agent.playback({sn:g_playing_sn,protocol:"rtdp",token:obj.token},null,function(msg,ref)
                    {
                        if(msg.result!= "")
                        {
                            error_handling(msg.result);
                        }
                        else
                        {
                            g_play_back_url = msg.url;
                            var inner_window_info = {dom_id:("inner_window" + g_playing_num), index:g_playing_num, video_chls:null, audio_chls:null, mme:null, ipc_state:"", node_sn:""};
                            create_mme({inner_window_info:inner_window_info,page:"playback",protocol:"auto",dom:$("#show")[0]});
                        }
                    });
                }
                else
                {
                    if(obj.text == "snapshot")
                    {
                        $("#photo_type").text(mcs_snapshot);
                    }
                    else
                    {
                        $("#photo_type").text(mcs_motion_alert);
                    }
                    $(".show_pic").fadeIn();
                    $(".show_pic")[0].src = g_big_img_url[obj.num];
                }
            }
            function add_show_event()
            {
                $(".back")[0].onclick = (function()
                {
                    common_menu({type:"play"});
                    $("#history_main")[0].style.display = "none";
                    $("#bottom_box").hide();
                    change_ico($("#history")[0]);
                    $("#show_main").remove();
                    $("#history_main").fadeIn();
                    add_history_event();
                });
            }

        }

        if(!obj)
        {
            var l_start = "0X7fffffff",l_length,l_message = [];
            var l_pic_id = [],l_min_id;
            g_click_time = 0;
            g_shown_pic = 0;
            g_last_time = 0;
            $("#setup_list").remove();
            create_history_main();
        }
        else
        {
            add_history_event();
        }
    }

    function setup_class(obj)
    {
        function setup_main(obj)
        {
            var dom_setup_list;
            if(!(dom_setup_list = $("#setup_list")[0]))
            {
                dom_setup_list = create_dom("setup_list",$("#menu_box"));
            }
            if(obj.type == "box"){
                    $("#box_list").remove();
                    dom_setup_list.innerHTML = "<div id = 'list_left'>"
                        +"<div id = about class = 'list_idle_div'>"
                        +"<span class = 'list_left_text'>"+mcs_about+"</span>"
                        +"<div class = 'list_img' ></div>"
                        +"</div>"
                        +"<div id = 'dev_name' class = 'list_idle_div'>"
                        +"<span class = 'list_left_text'>"+mcs_nickname+"</span>"
                        +"<div class = 'list_img' ></div>"
                        +"</div>"
                        +"<div id = 'admin_pwd' class = 'list_idle_div'>"
                        +"<span class = 'list_left_text'>"+mcs_admin_password+"</span>"
                        +"<div class = 'list_img' ></div>"
                        +"</div>"
                        +"<div id = 'visitor_pwd' class = 'list_idle_div'>"
                        +"<span class = 'list_left_text'>"+mcs_guest_password+"</span>"
                        +"<div class = 'list_img' ></div>"
                        +"</div>"
                        +"<div id = 'network_1' class = 'list_idle_div'>"
                        +"<span class = 'list_left_text'>"+mcs_ethernet+"</span>"
                        +"<div class = 'list_img' ></div>"
                        +"</div>"
                        +"<div id = 'network_2' class = 'list_idle_div'>"
                        +"<span class = 'list_left_text'>"+mcs_wifi+"</span>"
                        +"<div class = 'list_img' ></div>"
                        +"</div>"
                        +"<div id = 'sd_card' class = 'list_idle_div'>"
                        +"<span class = 'list_left_text'>"+"硬盘"+"</span>"
                        +"<div class = 'list_img' ></div>"
                        +"</div>"
                        +"<div id = 'date' class = 'list_idle_div'>"
                        +"<span class = 'list_left_text'>"+mcs_date_time+"</span>"
                        +"<div class = 'list_img' ></div>"
                        +"</div>"
                        +"<div id = 'system' class = 'list_idle_div'>"
                        +"<span class = 'list_left_text'>"+mcs_system+"</span>"
                        +"<div class = 'list_img' ></div>"
                        +"</div>"
                        +"<div id = 'del_dev' class = 'list_idle_div'>"
                        +"<span class = 'list_left_text'>"+mcs_delete_device+"</span>"
                        +"<div class = 'list_img' ></div>"
                        +"</div>"
                        +"</div>"
                        +"<div id = 'list_right'>"
                        +"</div>";
                
                }else{
                    dom_setup_list.innerHTML = "<div id = 'list_left'>"
                        +"<div id = about class = 'list_idle_div'>"
                        +"<span class = 'list_left_text'>"+mcs_about+"</span>"
                        +"<div class = 'list_img' ></div>"
                        +"</div>"
                        +"<div id = 'dev_name' class = 'list_idle_div'>"
                        +"<span class = 'list_left_text'>"+mcs_nickname+"</span>"
                        +"<div class = 'list_img' ></div>"
                        +"</div>"
                        +"<div id = 'admin_pwd' class = 'list_idle_div'>"
                        +"<span class = 'list_left_text'>"+mcs_admin_password+"</span>"
                        +"<div class = 'list_img' ></div>"
                        +"</div>"
                        +"<div id = 'visitor_pwd' class = 'list_idle_div'>"
                        +"<span class = 'list_left_text'>"+mcs_guest_password+"</span>"
                        +"<div class = 'list_img' ></div>"
                        +"</div>"
                        +"<div id = 'network_1' class = 'list_idle_div'>"
                        +"<span class = 'list_left_text'>"+mcs_ethernet+"</span>"
                        +"<div class = 'list_img' ></div>"
                        +"</div>"
                        +"<div id = 'network_2' class = 'list_idle_div'>"
                        +"<span class = 'list_left_text'>"+mcs_wifi+"</span>"
                        +"<div class = 'list_img' ></div>"
                        +"</div>"
                        +"<div id = 'osd' class = 'list_idle_div'>"
                        +"<span class = 'list_left_text'>"+mcs_osd+"</span>"
                        +"<div class = 'list_img' ></div>"
                        +"</div>"
                        +"<div id = 'sd_card' class = 'list_idle_div'>"
                        +"<span class = 'list_left_text'>"+mcs_sdcord+"</span>"
                        +"<div class = 'list_img' ></div>"
                        +"</div>"
                        //+"<div id = 'storage_device' class = 'list_idle_div'>"
                        //+"<span class = 'list_left_text'>"+mcs_storage_device+"</span>"
                        //+"<div class = 'list_img' ></div>"
                        //+"</div>"
                        +"<div id = 'alert_dev' class = 'list_idle_div'>"
                        +"<span class = 'list_left_text'>"+mcs_alarm_device+"</span>"
                        +"<div class = 'list_img' ></div>"
                        +"</div>"
                        +"<div id = 'alert_linkage' class = 'list_idle_div'>"
                        +"<span class = 'list_left_text'>"+mcs_alarm_action+"</span>"
                        +"<div class = 'list_img' ></div>"
                        +"</div>"
                        +"<div id = 'plan' class = 'list_idle_div'>"
                        +"<span class = 'list_left_text'>"+mcs_scheduled_recording+"</span>"
                        +"<div class = 'list_img' ></div>"
                        +"</div>"
                        +"<div id = 'date' class = 'list_idle_div'>"
                        +"<span class = 'list_left_text'>"+mcs_date_time+"</span>"
                        +"<div class = 'list_img' ></div>"
                        +"</div>"
                        +"<div id = 'system' class = 'list_idle_div'>"
                        +"<span class = 'list_left_text'>"+mcs_system+"</span>"
                        +"<div class = 'list_img' ></div>"
                        +"</div>"
                        +"<div id = 'other' class = 'list_idle_div'>"
                        +"<span class = 'list_left_text'>"+mcs_others+"</span>"
                        +"<div class = 'list_img' ></div>"
                        +"</div>"
                        +"<div id = 'del_dev' class = 'list_idle_div'>"
                        +"<span class = 'list_left_text'>"+mcs_delete_device+"</span>"
                        +"<div class = 'list_img' ></div>"
                        +"</div>"
                        +"</div>"
                        +"<div id = 'list_right'>"
                        +"</div>";
                }
            dom_setup_list.style.cssText = "height:"+$(window).height()-41+"px";
            if(g_login_type == "IPC"||g_login_type == "dev")
            {
                $("#del_dev")[0].style.display = "none";
            }
        }

        function setup_event()
        {
            var list_items;
            list_items = $(".list_idle_div");
            for(var i = 0;i<list_items.length;i++)
            {
                list_items[i].onclick = (function() {
                    g_dom_loading_gif.fadeIn();
                    for (var i = 0; i < list_items.length; i++)
                    {
                        list_items[i].setAttribute("class", "list_idle_div");
                        if(this == list_items[i])
                        {
                            g_receive_flag = i;
                        }
                    }
                    this.setAttribute("class", "list_active_div");
                    var id = this.id;
                    get_list_right({type: id});
                    add_list_event({type: id});
                });
            }
        }

        function get_list_right(obj)
        {
            switch(obj.type)
            {
                case "about":
                {
                    $("#list_right").html( "<div id = 'about_info' class = 'list_right_box'>"
                        +"<div id = 'logo_box'>"
                            +"<img id = 'logo_img'>"
                        +"</div>"
                        +"<div class = 'list_right_item'>"
                        +"<span class = 'attribute_key_text'>"+mcs_model+"</span>"
                        +"<span class = 'attribute_value_text'></span>"
                        +"</div>"                        
                        +"<div class = 'list_right_item'>"
                        +"<span class = 'attribute_key_text'>"+mcs_manufacturer+"</span>"
                        +"<span class = 'attribute_value_text'></span>"
                        +"</div>"
                        +"<div class = 'list_right_item'>"
                        +"<span class = 'attribute_key_text'>"+mcs_software_version+"</span>"
                        +"<span class = 'attribute_value_text'></span>"
                        +"</div>"
                        +"<div class = 'list_right_item'>"
                        +"<span class = 'attribute_key_text'>"+mcs_plugin_version+"</span>"
                        +"<span class = 'attribute_value_text'></span>"
                        +"</div>"
                        +"<div class = 'list_right_item'>"
                        +"<span class = 'attribute_key_text'>"+mcs_device_id+"</span>"
                        +"<span class = 'attribute_value_text'></span>"
                        +"</div>"
                        +"</div>");
                    mcloud_agent.dev_info_get({sn:g_playing_sn},null,function(msg,ref)
                    {
                        g_dom_loading_gif.fadeOut();
                        if(msg.result == "" && g_receive_flag==0)
                        {
                            var dom_text = $(".attribute_value_text");
                            if(msg.logo)
                            {
                                $("#logo_box").fadeIn();
                                $("#logo_img")[0].src = msg.logo;
                            }
                            dom_text[0].innerHTML = msg.model;
                            dom_text[1].innerHTML = msg.mfc;
                            dom_text[2].innerHTML = msg.ver;
                            dom_text[4].innerHTML = msg.sn;
                            mme.prototype.check_plug_install(null,function(msg,ref)
                            {
                                dom_text[3].innerHTML = ref;
                            });
                            g_playing_nick = msg.name;
                        }
                        else if(msg.result != "")
                        {
                            error_handling(msg.result);
                        }
                    });
                    break;
                }
                case "dev_name":
                {
                    $("#list_right").html( "<div id = 'dev_name_info' class = 'list_right_box'>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>"+mcs_nickname+":</span>"
                        +"<input type = 'text' value = ''id = 'dev_name_input' class = 'list_right_input'>"
                        +"</div>"
                        +"<input id = 'set_dev_name' value = "+mcs_action_apply+" class = 'list_right_button' type = 'button'>"
                        +"</div>");
                    if(g_playing_nick == "")
                    {
                        $("#dev_name_input")[0].value = g_playing_sn;
                    }
                    else
                    {
                        $("#dev_name_input")[0].value = g_playing_nick;
                    }
                    g_dom_loading_gif.fadeOut();
                    break;
                }
                case "admin_pwd":
                {
                    $("#list_right").html( "<div id = 'admin_pwd_info' class = 'list_right_box'>"
                        +"<div class = 'list_right_item'>"
                        +"<span class = 'attribute_key_text'>"+mcs_admin_password+":</span>"
                        +"<input type = 'password' id = 'admin_pwd_input' class = 'list_right_input'>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>"+mcs_new_password+":</span>"
                        +"<input type = 'password' id = 'new_admin_pwd_input' class = 'list_right_input'>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>"+mcs_confirm_new_password+":</span>"
                        +"<input type = 'password' id = 'new_admin_pwd_input_re' class = 'list_right_input'>"
                        +"</div>"
                        +"<input type = 'button' value = "+mcs_action_apply+" class = 'list_right_button'>"
                        +"</div>");
                    g_dom_loading_gif.fadeOut();
                    break;
                }
                case "visitor_pwd":
                {
                    $("#list_right").html("<div id = 'visitor_pwd_info' class = 'list_right_box'>"
                        +"<div class = 'list_right_item'>"
                        +"<span class = 'attribute_key_text'>"+mcs_admin_password+":</span>"
                        +"<input type = 'password' id = 'visitor_pwd_input' class = 'list_right_input'>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>"+mcs_guest_password+":</span>"
                        +"<input type = 'password' id = 'new_visitor_pwd_input' class = 'list_right_input'>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>"+mcs_confirm_new_password+":</span>"
                        +"<input type = 'password' id = 'new_visitor_pwd_input_re' class = 'list_right_input'>"
                        +"</div>"
                        +"<input type = 'button' value = "+mcs_action_apply+" class = 'list_right_button'>"
                        +"</div>");
                    g_dom_loading_gif.fadeOut();
                    break;
                }
                case "network_1":
                {
                    $("#list_right").html( "<div id = 'network_info' class = 'list_right_box'>"
                        +"<div class = 'list_right_item'>"
                        +"<span class = 'attribute_key_text'>"+mcs_network_interface+"</span>"
                        +"<span class = 'attribute_value_text'>"+mcs_ethernet+"</span>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>"+mcs_enabled+"</span>"
                        +"<div id = 'network_switch' class = 'label' >"
                        +"<span id = 'label_text_left0' class = 'label_text_left'>ON</span>"
                        +"<div id = 'label_img0'  class = 'label_img'></div>"
                        +"<span id = 'label_text_right0' class = 'label_text_right'>OFF</span>"
                        +"</div>"
                        +"</div>"
                        +"<div id = 'open_switch'>"
                        +"<div class = 'list_right_item'>"
                        +"<span class = 'attribute_key_text'>"+mcs_mac_address+"</span>"
                        +"<span class = 'attribute_value_text'></span>"
                        +"</div>"
                        +"<div class = 'list_right_item'>"
                        +"<span class = 'attribute_key_text'>"+mcs_network_status+"</span>"
                        +"<span class = 'attribute_value_text'></span>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>"+mcs_ip+":</span>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>-"+mcs_auto_obtain+"</span>"
                        +"<input type = 'radio' name = 'id_type' class = 'auto_get'>"
                        +"</div>"
                        +"<div id = 'auto_get_id'>"
                        +"<div class = 'list_right_item'>"
                        +"<span class = 'attribute_key_text'>&nbsp&nbsp-"+mcs_ip_address+"</span>"
                        +"<span class = 'attribute_value_text'></span>"
                        +"</div>"
                        +"<div class = 'list_right_item'>"
                        +"<span class = 'attribute_key_text'>&nbsp&nbsp-"+mcs_gateway+"</span>"
                        +"<span class = 'attribute_value_text'></span>"
                        +"</div>"
                        +"<div class = 'list_right_item'>"
                        +"<span class = 'attribute_key_text'>&nbsp&nbsp-"+mcs_network_mask+"</span>"
                        +"<span class = 'attribute_value_text'></span>"
                        +"</div>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>-"+mcs_manually_set+"</span>"
                        +"<input type = 'radio' name = 'id_type' class = 'manually_set'>"
                        +"</div>"
                        +"<div id = 'manually_set_id'>"
                        +"<div class = 'list_right_item'>"
                        +"<span class = 'attribute_key_text'>&nbsp&nbsp-"+mcs_ip_address+"</span>"
                        +"<input type = 'text' class = 'normal_input_right'>"
                        +"</div>"
                        +"<div class = 'list_right_item'>"
                        +"<span class = 'attribute_key_text'>&nbsp&nbsp-"+mcs_gateway+"</span>"
                        +"<input type = 'text' class = 'normal_input_right'>"
                        +"</div>"
                        +"<div class = 'list_right_item'>"
                        +"<span class = 'attribute_key_text'>&nbsp&nbsp-"+mcs_network_mask+"</span>"
                        +"<input type = 'text' class = 'normal_input_right'>"
                        +"</div>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>"+mcs_dns+":</span>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>-"+mcs_auto_obtain+"</span>"
                        +"<input type = 'radio' name = 'dns_type' class = 'auto_get'>"
                        +"</div>"
                        +"<div id = 'auto_get_dns'>"
                        +"<div class = 'list_right_item'>"
                        +"<span class = 'attribute_key_text'>&nbsp&nbsp-"+mcs_dns_prim+"</span>"
                        +"<span class = 'attribute_value_text'></span>"
                        +"</div>"
                        +"<div class = 'list_right_item'>"
                        +"<span class = 'attribute_key_text'>&nbsp&nbsp-"+mcs_secondary_dns+"</span>"
                        +"<span class = 'attribute_value_text'></span>"
                        +"</div>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>-"+mcs_manually_set+"</span>"
                        +"<input type = 'radio' name = 'dns_type' class = 'manually_set'>"
                        +"</div>"
                        +"<div id = 'manually_set_dns'>"
                        +"<div class = 'list_right_item'>"
                        +"<span class = 'attribute_key_text'>&nbsp&nbsp-"+mcs_dns_prim+"</span>"
                        +"<input type = 'text' class = 'normal_input_right'>"
                        +"</div>"
                        +"<div class = 'list_right_item'>"
                        +"<span class = 'attribute_key_text'>&nbsp&nbsp-"+mcs_secondary_dns+"</span>"
                        +"<input type = 'text' class = 'normal_input_right'>"
                        +"</div>"
                        +"</div>"
                        +"</div>"
                        +"<input type = 'button' value = "+mcs_action_apply+" class = 'list_right_button'>"
                        +"</div>");
                    break;
                }
                case "network_2":
                {
                    $("#list_right").html("<div id = 'network_info' class = 'list_right_box'>"
                        +"<div class = 'list_right_item'>"
                        +"<span class = 'attribute_key_text'>"+mcs_network_interface+"</span>"
                        +"<span class = 'attribute_value_text'>"+mcs_wifi+"</span>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>"+mcs_enabled+"</span>"
                        +"<div id = 'network_switch' class = 'label' >"
                        +"<span id = 'label_text_left0' class = 'label_text_left'>ON</span>"
                        +"<div id = 'label_img0' class = 'label_img'></div>"
                        +"<span id = 'label_text_right0' class = 'label_text_right'>OFF</span>"
                        +"</div>"
                        +"</div>"
                        +"<div id = 'open_switch'>"
                        +"<div class = 'list_right_item'>"
                        +"<span class = 'attribute_key_text'>"+mcs_mac_address+"</span>"
                        +"<span class = 'attribute_value_text'></span>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>"+mcs_wifi_mode+"</span>"
                        +"<div id = 'wifi_type_switch' class = 'label' >"
                        +"<span id = 'label_text_left1' class = 'label_text_left'>"+mcs_client+"</span>"
                        +"<div id = 'label_img1' class = 'label_img'></div>"
                        +"<span id = 'label_text_right1' class = 'label_text_right'>"+mcs_ap+"</span>"
                        +"</div>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>"+mcs_network_status+"</span>"
                        +"<span class = 'attribute_value_text'></span>"
                        +"</div>"
                        +"<div id = 'link_state'>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>"+mcs_select_network+":</span>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                            +"<span class = 'attribute_key_text'>-"+mcs_wifi_list+"</span>"
                            +"<input type = 'button' value = "+mcs_refresh+" id = 'refresh_wifi'>"
                            +"<div id = 'wifi_list_div'>"
                                +"<input type = 'text' value = "+mcs_not_select+" id = 'select_wifi'>"
                                +"<div class = 'list_triangle'></div>"
                                +"<div id = wifi_list>"
                                +"</div>"
                            +"</div>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>-"+mcs_password+"</span>"
                        +"<input type = 'password'  id = 'wifi_pwd'>"
                        +"<div id='wifi_link_stat'>"
                        +"<img src='imgs/loading2.gif' id='loading_conn'>"
                        +"<span>"+mcs_connecting+"</span>"
                        +"</div>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>"+mcs_ip+":</span>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>-"+mcs_auto_obtain+"</span>"
                        +"<input type = 'radio' name = 'id_type' class = 'auto_get'>"
                        +"</div>"
                        +"<div id = 'auto_get_id'>"
                        +"<div class = 'list_right_item'>"
                        +"<span class = 'attribute_key_text'>&nbsp&nbsp-"+mcs_ip_address+"</span>"
                        +"<span class = 'attribute_value_text'></span>"
                        +"</div>"
                        +"<div class = 'list_right_item'>"
                        +"<span class = 'attribute_key_text'>&nbsp&nbsp-"+mcs_gateway+"</span>"
                        +"<span class = 'attribute_value_text'></span>"
                        +"</div>"
                        +"<div class = 'list_right_item'>"
                        +"<span class = 'attribute_key_text'>&nbsp&nbsp-"+mcs_network_mask+"</span>"
                        +"<span class = 'attribute_value_text'></span>"
                        +"</div>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>-"+mcs_manually_set+"</span>"
                        +"<input type = 'radio' name = 'id_type' class = 'manually_set'>"
                        +"</div>"
                        +"<div id = 'manually_set_id'>"
                        +"<div class = 'list_right_item'>"
                        +"<span class = 'attribute_key_text'>&nbsp&nbsp-"+mcs_ip_address+"</span>"
                        +"<input type = 'text' class = 'normal_input_right'>"
                        +"</div>"
                        +"<div class = 'list_right_item'>"
                        +"<span class = 'attribute_key_text'>&nbsp&nbsp-"+mcs_gateway+"</span>"
                        +"<input type = 'text' class = 'normal_input_right'>"
                        +"</div>"
                        +"<div class = 'list_right_item'>"
                        +"<span class = 'attribute_key_text'>&nbsp&nbsp-"+mcs_network_mask+"</span>"
                        +"<input type = 'text' class = 'normal_input_right'>"
                        +"</div>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>"+mcs_dns+":</span>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>-"+mcs_auto_obtain+"</span>"
                        +"<input type = 'radio' name = 'dns_type' class = 'auto_get'>"
                        +"</div>"
                        +"<div id = 'auto_get_dns'>"
                        +"<div class = 'list_right_item'>"
                        +"<span class = 'attribute_key_text'>&nbsp&nbsp-"+mcs_dns_prim+"</span>"
                        +"<span class = 'attribute_value_text'></span>"
                        +"</div>"
                        +"<div class = 'list_right_item'>"
                        +"<span class = 'attribute_key_text'>&nbsp&nbsp-"+mcs_secondary_dns+"</span>"
                        +"<span class = 'attribute_value_text'></span>"
                        +"</div>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>-"+mcs_manually_set+"</span>"
                        +"<input type = 'radio' name = 'dns_type' class = 'manually_set'>"
                        +"</div>"
                        +"<div id = 'manually_set_dns'>"
                        +"<div class = 'list_right_item'>"
                        +"<span class = 'attribute_key_text'>&nbsp&nbsp-"+mcs_dns_prim+"</span>"
                        +"<input type = 'text' class = 'normal_input_right'>"
                        +"</div>"
                        +"<div class = 'list_right_item'>"
                        +"<span class = 'attribute_key_text'>&nbsp&nbsp-"+mcs_secondary_dns+"</span>"
                        +"<input type = 'text' class = 'normal_input_right'>"
                        +"</div>"
                        +"</div>"
                        +"</div>"
                        +"<div id = 'dhcp'>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>"+mcs_dhcp+"</span>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>-"+mcs_start_address+"</span>"
                        +"<span class = 'attribute_value_text'></span>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>-"+mcs_end_address+"</span>"
                        +"<span class = 'attribute_value_text'></span>"
                        +"</div>"
                        +"<div class = 'list_right_item'>"
                        +"<span class = 'attribute_key_text'>-"+mcs_gateway+"</span>"
                        +"<span class = 'attribute_value_text'></span>"
                        +"</div>"
                        +"</div>"
                        +"</div>"
                        +"<input type = 'button' value = "+mcs_action_apply+" class = 'list_right_button'>"
                        +"</div>");
                    break;
                }
                case "osd":
                {
                    $("#list_right").html( "<div id = 'osd_info' class = 'list_right_box'>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>"+mcs_display_text+"</span>"
                        +"<div class = 'label' >"
                        +"<span id = 'label_text_left0' class = 'label_text_left'>ON</span>"
                        +"<div id = 'label_img0' ' class = 'label_img'></div>"
                        +"<span id = 'label_text_right0' class = 'label_text_right'>OFF</span>"
                        +"</div>"
                        +"</div>"
                        +"<div id = 'name_div_s' class = 'list_right_item'>"
                        +"<span class = 'attribute_key_text'>"+mcs_name+"</span>"
                        +"<input class = 'normal_input_right' type = 'text'>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>"+mcs_display_date+"</span>"
                        +"<div class = 'label' >"
                        +"<span id = 'label_text_left1' class = 'label_text_left'>ON</span>"
                        +"<div id = 'label_img1'  class = 'label_img'></div>"
                        +"<span id = 'label_text_right1' class = 'label_text_right'>OFF</span>"
                        +"</div>"
                        +"</div>"
                        +"<div id = 'date_div_s' class = 'list_right_item'>"
                        +"<span class = 'attribute_key_text'>"+mcs_date_format+"</span>"
                        +"<select id = 'select_date'>"
                        +"<option value = '1'>YYYY-MM-DD</option>"
                        +"<option value = '2'>MM-DD-YYYY</option>"
                        +"</select>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>"+mcs_display_time+"</span>"
                        +"<div class = 'label' >"
                        +"<span id = 'label_text_left2' class = 'label_text_left'>ON</span>"
                        +"<div id = 'label_img2'  class = 'label_img'></div>"
                        +"<span id = 'label_text_right2' class = 'label_text_right'>OFF</span>"
                        +"</div>"
                        +"</div>"
                        +"<div id = 'time_div_s' class = 'list_right_item' >"
                        +"<span class = 'attribute_key_text'>"+mcs_time_format+"</span>"
                        +"<select id = 'select_time'>"
                        +"<option value = '0'>"+mcs_24_hour+"</option>"
                        +"<option value = '1'>"+mcs_12_hour+"</option>"
                        +"</select>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>"+mcs_display_weeks+"</span>"
                        +"<div class = 'label' >"
                        +"<span id = 'label_text_left3' class = 'label_text_left'>ON</span>"
                        +"<div id = 'label_img3'  class = 'label_img'></div>"
                        +"<span id = 'label_text_right3' class = 'label_text_right'>OFF</span>"
                        +"</div>"
                        +"</div>"
                        +"<input type = 'button' class = 'list_right_button' value = "+mcs_action_apply+">"
                        +"</div>");
                    break;
                }
                case "sd_card":
                {
                    $("#list_right").html("<div id = 'sd_info' class = 'list_right_box'>"
                        +"<div class = 'list_right_item'>"
                        +"<span class = 'attribute_key_text'>"+mcs_enabled+"</span>"
                        +"<div class = 'label' >"
                        +"<span id = 'label_text_left0' class = 'label_text_left'>ON</span>"
                        +"<div id = 'label_img0' class = 'label_img'></div>"
                        +"<span id = 'label_text_right0' class = 'label_text_right'>OFF</span>"
                        +"</div>"
                        +"</div>"
                        +"<div id = 'open_switch'>"
                        +"<div class = 'list_right_item'>"
                        +"<span class = 'attribute_key_text'>"+mcs_status+"</span>"
                        +"<span class = 'attribute_value_text'></span>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>"+mcs_capacity+"</span>"
                        +"<span class = 'attribute_value_text'></span>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>"+mcs_usage+"</span>"
                        +"<span class = 'attribute_value_text'></span>"
                        +"</div>"
                        +"<div class = 'list_right_item'>"
                        +"<span class = 'attribute_key_text'>"+mcs_valid+"</span>"
                        +"<span class = 'attribute_value_text'></span>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>-"+mcs_format+"</span>"
                        +"<input type = 'button' class = 'list_right_button_ex' value = "+mcs_format+">"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>-"+mcs_unmount+"</span>"
                        +"<input type = 'button' class = 'list_right_button_ex' value = "+mcs_unmount+">"
                        +"</div>"
                        +"</div>"
                        +"<input type = 'button' class = 'list_right_button' value = "+mcs_action_apply+">"
                        +"</div>");
                    break;
                }
                case "storage_device":
                {
                    $("#list_right").html("<div id = 'storage_device_info' class = 'list_right_box'>"
                        +"<div class = 'list_right_item'>"
                        +"<span class = 'attribute_key_text'>"+mcs_enabled+"</span>"
                        +"<div class = 'label' >"
                        +"<span id = 'label_text_left0' class = 'label_text_left'>ON</span>"
                        +"<div id = 'label_img0' class = 'label_img'></div>"
                        +"<span id = 'label_text_right0' class = 'label_text_right'>OFF</span>"
                        +"</div>"
                        +"</div>"
                        +"<div id = 'open_switch'>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>"+"设备ID"+"</span>"
                        +"<input type = 'text' id = 'dev_id' class = 'list_right_input'>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>"+"密码"+"</span>"
                        +"<input type = 'password' id = 'dev_pwd' class = 'list_right_input'>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>"+"连接状态"+"</span>"
                        +"<span class = 'attribute_value_text'>已连接</span>"
                        +"</div>"
                        +"</div>"
                        +"<input type = 'button' class = 'list_right_button' value = "+mcs_action_apply+">"
                        +"</div>");
                    break;
                }
                case "alert_dev":
                {
                    $("#list_right").html( "<div id = 'alert_dev_info' class = 'list_right_box' >"
                        +"<div class = 'list_right_item_ex'>"
                        	+"<span class = 'attribute_key_text'>"+mcs_i_o_alarm+"</span>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        	+"<span class = 'attribute_key_text'>-"+mcs_input+"</span>"
                        	+"<span class = 'attribute_value_text'></span>"
                        +"</div>"
                        +"<div class = 'list_right_item'>"
                        	+"<span class = 'attribute_key_text'>-"+mcs_outinput+"</span>"
                        	+"<span class = 'attribute_value_text'></span>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        	+"<span class = 'attribute_key_text'>"+mcs_motion_detection_sensitivity+"</span>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        	+"<span class = 'attribute_key_text'>-"+mcs_daytime+"</span>"
                            +"<div id = 'day' class = 'out_box'>"
                            	+"<div class = 'in_box'></div>"
                            	+"<div class = 'circle'><div class = 'show_value'></div></div>"
                            +"</div>"
                        +"</div>"
                        +"<div class = 'list_right_item'>"
                       		+"<span class = 'attribute_key_text'>-"+mcs_night+"</span>"
                        	+"<div id = 'night' class = 'out_box'>"
	                        	+"<div class = 'in_box'></div>"
	                        	+"<div class = 'circle'><div class = 'show_value'></div></div>"
                        	+"</div>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        	+"<span class = 'attribute_key_text'>遮罩</span>"
                        	+"<div class = 'label' >"
		                        +"<span id = 'label_text_left0' class = 'label_text_left'>ON</span>"
		                        +"<div id = 'label_img0' class = 'label_img'></div>"
		                        +"<span id = 'label_text_right0' class = 'label_text_right'>OFF</span>"
	                        +"</div>"
                        +"</div>"
                        +"<div id = 'mask_div'>"
	                        	+"<input id = 'set_mask' type = 'button' value = '设置'>"
	                    +"</div> "
                        +"<input type = 'button' class = 'list_right_button' value = "+mcs_action_apply+">"
                        +"</div>");
                    var circle = $(".circle");
                    circle[0].style.top = $("#day")[0].offsetTop+"px";
                    circle[1].style.top = $("#night")[0].offsetTop+"px";
                    break;
                }
                
                case "alert_linkage":
                {
                    $("#list_right").html( "<div id = 'alert_linkage_info' class = 'list_right_box'>"
                        +"<div class = 'list_right_item'>"
                        +"<span class = 'attribute_key_text'>"+mcs_name+"</span>"
                        +"<select id = 'select_name'>"
                        +"<option value = "+mcs_motion+">"+mcs_motion+"</option>"
                        +"<option value = "+mcs_i_o_alarm+">"+mcs_i_o_alarm+"</option>"
                        +"</select>"
                        +"</div>"
                        +"<div class = 'list_right_item'>"
                        +"<span class = 'attribute_key_text'>"+mcs_enabled+"</span>"
                        +"<div class = 'label' >"
                        +"<span id = 'label_text_left0' class = 'label_text_left'>ON</span>"
                        +"<div id = 'label_img0'  class = 'label_img'></div>"
                        +"<span id = 'label_text_right0' class = 'label_text_right'>OFF</span>"
                        +"</div>"
                        +"</div>"
                        +"<div id = 'open_switch'>"
                        +"<div class = 'list_right_item'>"
                        +"<span class = 'attribute_key_text'>"+mcs_alarm_sources+"</span>"
                        +"<span id = 'call_type' class = 'attribute_value_text'></span>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>"+mcs_alarm_action+"</span>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>-"+mcs_i_o_alarm+"</span>"
                        +"<div class = 'label' >"
                        +"<span id = 'label_text_left1' class = 'label_text_left'>ON</span>"
                        +"<div id = 'label_img1'  class = 'label_img'></div>"
                        +"<span id = 'label_text_right1' class = 'label_text_right'>OFF</span>"
                        +"</div>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>-"+mcs_snapshot+"</span>"
                        +"<div class = 'label' >"
                        +"<span id = 'label_text_left2' class = 'label_text_left'>ON</span>"
                        +"<div id = 'label_img2'  class = 'label_img'></div>"
                        +"<span id = 'label_text_right2' class = 'label_text_right'>OFF</span>"
                        +"</div>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>-"+mcs_record+"</span>"
                        +"<div class = 'label' >"
                        +"<span id = 'label_text_left3' class = 'label_text_left'>ON</span>"
                        +"<div id = 'label_img3' class = 'label_img'></div>"
                        +"<span id = 'label_text_right3' class = 'label_text_right'>OFF</span>"
                        +"</div>"
                        +"</div>"
                        +"<div id = 'video_div' class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>&nbsp;&nbsp;-"+mcs_pre_record_length+"</span>"
                        +"<input class = 'normal_input_right'  type = 'text'>"
                        +"</div>"
                        +"</div>"
                        +"<input type = 'button' class = 'list_right_button' value = "+mcs_action_apply+">"
                        +"<input type = 'button' class = 'list_right_button' value = "+mcs_alert_on+">"
                        +"</div>");
                    break;
                }
                
                case "plan":
                {
                    $("#list_right").html("<div id = 'plan_info' class = 'list_right_box'>"
                        +"<div class = 'list_right_item'>"
                        +"<span class = 'attribute_key_text'>"+mcs_enabled+"</span>"
                        +"<div class = 'label' >"
                        +"<span id = 'label_text_left0' class = 'label_text_left'>ON</span>"
                        +"<div id = 'label_img0' class = 'label_img'></div>"
                        +"<span id = 'label_text_right0' class = 'label_text_right'>OFF</span>"
                        +"</div>"
                        +"</div>"
                        +"<div id = 'open_switch'>"
                        +"<div class = 'list_right_item'>"
                        +"<span class = 'attribute_key_text'>"+mcs_7x24_hours+"</span>"
                        +"<input type = 'radio' name = 'plan' class = 'right_radio'>"
                        +"</div>"
                        +"<div class = 'list_right_item'>"
                        +"<span class = 'attribute_key_text'>"+mcs_scheduled_recording+"</span>"
                        +"<input type = 'radio' name = 'plan' class = 'right_radio'>"
                        +"</div>"
                        +"<div id = 'plans'>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>"+mcs_scheduled_one+":</span>"
                        +"<div class = 'label' >"
                        +"<span id = 'label_text_left1' class = 'label_text_left'>ON</span>"
                        +"<div id = 'label_img1'  class = 'label_img'></div>"
                        +"<span id = 'label_text_right1' class = 'label_text_right'>OFF</span>"
                        +"</div>"
                        +"</div>"
                        +"<div id = 'plan_video_1'>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>"+mcs_begin_time+"</span>"
                        +"<input type = 'text' value = '00:00' class = 'time_input'>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>"+mcs_end_time+"</span>"
                        +"<input type = 'text' value = '00:00' class = 'time_input'>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>"+mcs_week+"</span>"
                        +"</div>"
                        +"<div class = 'list_right_item'>"
                        +"<input type = 'checkbox' class = 'week_checkbox'>"
                        +"<span class = 'week_text'>"+mcs_sun+"</span>"
                        +"<input type = 'checkbox' class = 'week_checkbox'>"
                        +"<span class = 'week_text'>"+mcs_mon+"</span>"
                        +"<input type = 'checkbox' class = 'week_checkbox'>"
                        +"<span class = 'week_text'>"+mcs_tue+"</span>"
                        +"<input type = 'checkbox' class = 'week_checkbox'>"
                        +"<span class = 'week_text'>"+mcs_wed+"</span>"
                        +"<input type = 'checkbox' class = 'week_checkbox'>"
                        +"<span class = 'week_text'>"+mcs_thu+"</span>"
                        +"<input type = 'checkbox' class = 'week_checkbox'>"
                        +"<span class = 'week_text'>"+mcs_fri+"</span>"
                        +"<input type = 'checkbox' class = 'week_checkbox'>"
                        +"<span class = 'week_text'>"+mcs_sat+"</span>"
                        +"<input type = 'checkbox' class = 'week_checkbox'>"
                        +"<span class = 'week_text'>"+mcs_all+"</span>"
                        +"</div>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>"+mcs_scheduled_two+":</span>"
                        +"<div class = 'label' >"
                        +"<span id = 'label_text_left2' class = 'label_text_left'>ON</span>"
                        +"<div id = 'label_img2'  class = 'label_img'></div>"
                        +"<span id = 'label_text_right2' class = 'label_text_right'>OFF</span>"
                        +"</div>"
                        +"</div>"
                        +"<div id = 'plan_video_2'>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>"+mcs_begin_time+"</span>"
                        +"<input type = 'text' value = '00:00' class = 'time_input'>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>"+mcs_end_time+"</span>"
                        +"<input type = 'text' value = '00:00' class = 'time_input'>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>"+mcs_week+"</span>"
                        +"</div>"
                        +"<div class = 'list_right_item'>"
                        +"<input type = 'checkbox' class = 'week_checkbox'>"
                        +"<span class = 'week_text'>"+mcs_sun+"</span>"
                        +"<input type = 'checkbox' class = 'week_checkbox'>"
                        +"<span class = 'week_text'>"+mcs_mon+"</span>"
                        +"<input type = 'checkbox' class = 'week_checkbox'>"
                        +"<span class = 'week_text'>"+mcs_tue+"</span>"
                        +"<input type = 'checkbox' class = 'week_checkbox'>"
                        +"<span class = 'week_text'>"+mcs_wed+"</span>"
                        +"<input type = 'checkbox' class = 'week_checkbox'>"
                        +"<span class = 'week_text'>"+mcs_thu+"</span>"
                        +"<input type = 'checkbox' class = 'week_checkbox'>"
                        +"<span class = 'week_text'>"+mcs_fri+"</span>"
                        +"<input type = 'checkbox' class = 'week_checkbox'>"
                        +"<span class = 'week_text'>"+mcs_sat+"</span>"
                        +"<input type = 'checkbox' class = 'week_checkbox'>"
                        +"<span class = 'week_text'>"+mcs_all+"</span>"
                        +"</div>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>"+mcs_scheduled_three+":</span>"
                        +"<div class = 'label' >"
                        +"<span id = 'label_text_left3' class = 'label_text_left'>ON</span>"
                        +"<div id = 'label_img3'  class = 'label_img'></div>"
                        +"<span id = 'label_text_right3' class = 'label_text_right'>OFF</span>"
                        +"</div>"
                        +"</div>"
                        +"<div id = 'plan_video_3'>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>"+mcs_begin_time+"</span>"
                        +"<input type = 'text' value = '00:00' class = 'time_input'>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>"+mcs_end_time+"</span>"
                        +"<input type = 'text' value = '00:00' class = 'time_input'>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>"+mcs_week+"</span>"
                        +"</div>"
                        +"<div class = 'list_right_item'>"
                        +"<input type = 'checkbox' class = 'week_checkbox'>"
                        +"<span class = 'week_text'>"+mcs_sun+"</span>"
                        +"<input type = 'checkbox' class = 'week_checkbox'>"
                        +"<span class = 'week_text'>"+mcs_mon+"</span>"
                        +"<input type = 'checkbox' class = 'week_checkbox'>"
                        +"<span class = 'week_text'>"+mcs_tue+"</span>"
                        +"<input type = 'checkbox' class = 'week_checkbox'>"
                        +"<span class = 'week_text'>"+mcs_wed+"</span>"
                        +"<input type = 'checkbox' class = 'week_checkbox'>"
                        +"<span class = 'week_text'>"+mcs_thu+"</span>"
                        +"<input type = 'checkbox' class = 'week_checkbox'>"
                        +"<span class = 'week_text'>"+mcs_fri+"</span>"
                        +"<input type = 'checkbox' class = 'week_checkbox'>"
                        +"<span class = 'week_text'>"+mcs_sat+"</span>"
                        +"<input type = 'checkbox' class = 'week_checkbox'>"
                        +"<span class = 'week_text'>"+mcs_all+"</span>"
                        +"</div>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>"+mcs_scheduled_four+":</span>"
                        +"<div class = 'label' >"
                        +"<span id = 'label_text_left4' class = 'label_text_left'>ON</span>"
                        +"<div id = 'label_img4' class = 'label_img'></div>"
                        +"<span id = 'label_text_right4' class = 'label_text_right'>OFF</span>"
                        +"</div>"
                        +"</div>"
                        +"<div id = 'plan_video_4'>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>"+mcs_begin_time+"</span>"
                        +"<input type = 'text' value = '00:00' class = 'time_input'>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>"+mcs_end_time+"</span>"
                        +"<input type = 'text' value = '00:00' class = 'time_input'>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>"+mcs_week+"</span>"
                        +"</div>"
                        +"<div class = 'list_right_item'>"
                        +"<input type = 'checkbox' class = 'week_checkbox'>"
                        +"<span class = 'week_text'>"+mcs_sun+"</span>"
                        +"<input type = 'checkbox' class = 'week_checkbox'>"
                        +"<span class = 'week_text'>"+mcs_mon+"</span>"
                        +"<input type = 'checkbox' class = 'week_checkbox'>"
                        +"<span class = 'week_text'>"+mcs_tue+"</span>"
                        +"<input type = 'checkbox' class = 'week_checkbox'>"
                        +"<span class = 'week_text'>"+mcs_wed+"</span>"
                        +"<input type = 'checkbox' class = 'week_checkbox'>"
                        +"<span class = 'week_text'>"+mcs_thu+"</span>"
                        +"<input type = 'checkbox' class = 'week_checkbox'>"
                        +"<span class = 'week_text'>"+mcs_fri+"</span>"
                        +"<input type = 'checkbox' class = 'week_checkbox'>"
                        +"<span class = 'week_text'>"+mcs_sat+"</span>"
                        +"<input type = 'checkbox' class = 'week_checkbox'>"
                        +"<span class = 'week_text'>"+mcs_all+"</span>"
                        +"</div>"
                        +"</div>"
                        +"</div>"
                        +"</div>"
                        +"<input class = 'list_right_button' type = 'button' value = "+mcs_action_apply+">"
                        +"</div>");
                    break;
                }
                
                case "date":
                {
                    $("#list_right").html("<div id = 'date_info' class = 'list_right_box'>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>"+mcs_date+"</span>"
                        +"<div id = 'date_div'>"
                        +"<input class = 'date' type = 'text' readonly='readonly'>"
                        +"<span>"+" - "+"</span>"
                        +"<input class = 'date' type = 'text' readonly='readonly'>"
                        +"<span>"+" - "+"</span>"
                        +"<input class = 'date' type = 'text' readonly='readonly'>"
                        +"</div>"
                        +"</div>"
                        +"<div class = 'list_right_item'>"
                        +"<span class = 'attribute_key_text'>"+mcs_time+"</span>"
                        +"<div id = 'time_div'>"
                        +"<input class = 'time' type = 'text'  readonly='readonly'>"
                        +"<span>:</span>"
                        +"<input class = 'time' type = 'text'  readonly='readonly'>"
                        +"<span>:</span>"
                        +"<input class = 'time' type = 'text' readonly='readonly'>"
                        +"</div>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>"+mcs_time_zone+"</span>"
                        +"<select id = 'select_timezone'>"
                        +"<option value = '-14'>UTC-12:00</option>"
                        +"<option value = '-13'>UTC-11:00</option>"
                        +"<option value = '-12'>UTC-10:00</option>"
                        +"<option value = '-11'>UTC-09:30</option>"
                        +"<option value = '-10'>UTC-09:00</option>"
                        +"<option value = '-9'>UTC-08:00</option>"
                        +"<option value = '-8'>UTC-07:00</option>"
                        +"<option value = '-7'>UTC-06:00</option>"
                        +"<option value = '-6'>UTC-05:00</option>"
                        +"<option value = '-5'>UTC-04:00</option>"
                        +"<option value = '-4'>UTC-03:30</option>"
                        +"<option value = '-3'>UTC-03:00</option>"
                        +"<option value = '-2'>UTC-02:00</option>"
                        +"<option value = '-1'>UTC-01:00</option>"
                        +"<option value = '1'>UTC+00:00</option>"
                        +"<option value = '2'>UTC+01:00</option>"
                        +"<option value = '3'>UTC+02:00</option>"
                        +"<option value = '4'>UTC+03:00</option>"
                        +"<option value = '5'>UTC+03:30</option>"
                        +"<option value = '6'>UTC+04:00</option>"
                        +"<option value = '7'>UTC+04:30</option>"
                        +"<option value = '8'>UTC+05:00</option>"
                        +"<option value = '9'>UTC+05:30</option>"
                        +"<option value = '10'>UTC+05:45</option>"
                        +"<option value = '11'>UTC+06:00</option>"
                        +"<option value = '12'>UTC+06:30</option>"
                        +"<option value = '13'>UTC+07:00</option>"
                        +"<option value = '14'>UTC+08:00</option>"
                        +"<option value = '15'>UTC+09:00</option>"
                        +"<option value = '16'>UTC+09:30</option>"
                        +"<option value = '17'>UTC+10:00</option>"
                        +"<option value = '18'>UTC+10:30</option>"
                        +"<option value = '19'>UTC+11:00</option>"
                        +"<option value = '20'>UTC+12:00</option>"
                        +"<option value = '21'>UTC+13:00</option>"
                        +"<option value = '22'>UTC+14:00</option>"
                        +"</select>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>"+mcs_auto_sync_date_time+"</span>"
                        +"<div class = 'label' >"
                        +"<span id = 'label_text_left0' class = 'label_text_left'>ON</span>"
                        +"<div id = 'label_img0'  class = 'label_img'></div>"
                        +"<span id = 'label_text_right0' class = 'label_text_right'>OFF</span>"
                        +"</div>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                        +"<span class = 'attribute_key_text'>"+mcs_ntp+"</span>"
                        +"<input type = 'text' value = '' id = 'service_address'>"
                        +"</div>"
                        +"<input type = 'button' class = 'list_right_button' value = "+mcs_action_apply+">"
                        +"</div>");
                    break;
                }
                case "system":
                {
                    $("#list_right").html("<div id = 'system_info' class = 'list_right_box'>"
                        +"<div class = 'list_right_item' style = 'display:none'>"
                            +"<span class = 'attribute_key_text'>"+mcs_online_upgrade+"</span>"
                            +"<input type = 'button' class = 'list_right_button_ex' value = "+mcs_upgrade+">"
                            +"<span class = 'attribute_value_text'></span>"
                        +"</div>"
                        +"<div class = 'list_right_item' style = 'display:none'>"
                            +"<span class = 'attribute_key_text'>"+mcs_activation+"</span>"
                            +"<input type = 'button' class = 'list_right_button_ex' value = "+mcs_activate+">"
                            +"<input type = 'input' class = 'list_right_input'>"
                        +"</div>"
                        +"<div class = 'list_right_item' style = 'display:none'>"
                            +"<span class = 'attribute_key_text'>"+mcs_upload_upgrade+"</span>"
                            +"<div id = 'upload'></div>"
                        +"</div>"
                        +"<div class = 'list_right_item'>"
                        +"<span class = 'attribute_key_text'>"+mcs_restore_the_factory_settings+"</span>"
                        +"<input type = 'button' class = 'list_right_button_ex' value = "+mcs_restore+">"
                        +"</div>"
                        +"<div class = 'list_right_item'>"
                        +"<span class = 'attribute_key_text'>"+mcs_reboot+"</span>"
                        +"<input type = 'button' class = 'list_right_button_ex' value = "+mcs_reboot+">"
                        +"</div>"
                        +"</div>");

                    if(g_dev_type == "inactive")
                    {
                        var dom = $(".list_right_item");
                        dom[0].style.border = 0;
                        dom[1].style.display = "block";
                    }
                    if(g_login_type == "IPC")
                    {
                        var dom = $(".list_right_item");
                        dom[0].style.border = 0;
                        dom[2].style.display = "block";
                    }
                    break;
                }
                
                case "other":
                {
                    $("#list_right").html("<div id = 'other_info' class = 'list_right_box'>"
                        +"<div class = 'list_right_item_ex'>"
                            +"<span class = 'attribute_key_text'>"+mcs_audio+":</span>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                            +"<span class = 'attribute_key_text'>-"+mcs_speaker+"</span>"
                            +"<div id = 'speaker_vol' class = 'out_box'>"
                                +"<div class = 'in_box'></div>"
                                +"<div class = 'circle'><div class = 'show_value'></div></div>"
                            +"</div>"
                        +"</div>"
                        +"<div class = 'list_right_item'>"
                        +"<span class = 'attribute_key_text'>-"+mcs_mic+"</span>"
                            +"<div id = 'mic_vol' class = 'out_box'>"
                                +"<div class = 'in_box'></div>"
                                +"<div class = 'circle'><div class = 'show_value'></div></div>"
                            +"</div>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                            +"<span class = 'attribute_key_text'>"+mcs_equipment_flip+"</span>"
                            +"<div class = 'label'>"
                                +"<span id = 'label_text_left0' class = 'label_text_left'>ON</span>"
                                +"<div id = 'label_img0' class = 'label_img'></div>"
                                +"<span id = 'label_text_right0' class = 'label_text_right'>OFF</lable></span>"
                            +"</div>"
                        +"</div>"
                        +"<div class = 'list_right_item_ex'>"
                            +"<span class = 'attribute_key_text'>"+mcs_power_frequency+"</span>"
                            +"<input type = 'button' id = 'button_60hz' value = '60hz'>"
                            +"<input type = 'button' id = 'button_50hz' value = '50hz'>"
                        +"</div>"
                        +"<input type = 'button' class = 'list_right_button' value = "+mcs_action_apply+">"
                        +"</div>");
                    var circle = $(".circle");
                    circle[0].style.top = $("#speaker_vol")[0].offsetTop+"px";
                    circle[1].style.top = $("#mic_vol")[0].offsetTop+"px";
                    break;
                }
                
                case "del_dev":
                {
                    $("#list_right").html("<div id = 'del_dev_info' class = 'list_right_box'>"
                        +"<input type = 'button' id = 'del_dev_button' value = "+mcs_delete_device+">"
                        +"</div>");
                    break;
                }
                default :
                    break;
            }
        }

        function add_list_event(obj)
        {
            var num = 0 ,dom_labels = $(".label"),length = dom_labels.length;
            for(var m = 0;m<length;m++) {
                dom_labels[m].onclick = (function () {
                    for(var k = 0;k<length;k++)
                    {
                        if(this == $(".label")[k])
                        {
                            num = k;
                            break;
                        }
                    }
                    if (g_switch_flag[num] == 0) {
                        $("#label_text_right"+num).fadeOut("fast");
                        $("#label_img"+num).animate({ marginRight: "0px"});
                        $("#label_text_left"+num).fadeIn("fast");
                        g_switch_flag[num] = 1;
                        switch(obj.type)
                        {
                            case "network_1":
                            {
                                $("#open_switch").fadeIn("fast");
                                break;
                            }
                            case "network_2":
                            {
                                if($(".attribute_value_text")[1].innerHTML!= mcs_fault)
                                {
                                    if(num == 0)
                                    {
                                        $("#open_switch").fadeIn("fast");
                                    }
                                    else
                                    {
                                        $("#link_state").fadeIn("fast");
                                        $("#dhcp").fadeOut("fast");
                                    }
                                }
                                break;
                            }
                            case "osd":
                            {
                                if(num == 0) {
                                    $("#name_div_s").fadeIn("fast");
                                    $("#name_div_s")[0].previousSibling.style.borderBottom = "0";
                                }
                                else if(num == 1){
                                    $("#date_div_s").fadeIn("fast");
                                    $("#date_div_s")[0].previousSibling.style.borderBottom = "0";
                                }
                                else if(num == 2){
                                    $("#time_div_s").fadeIn("fast");
                                    $("#time_div_s")[0].previousSibling.style.borderBottom = "0";
                                }
                                break;
                            }
                            case "sd_card":
                            {
                                $("#open_switch").fadeIn("slow");
                                break;
                            }
                            case "storage_device":
                            {
                                $("#open_switch").fadeIn("slow");
                                break;
                            } 
							case "alert_dev":
							{
								$("#mask_div").fadeIn("fast");	
							}
							
                            case "alert_linkage":
                            {
                                if(num == 0) {
                                    $("#open_switch").fadeIn("fast");
                                }
                                else if(num == 3)
                                {
                                    $("#video_div").fadeIn("fast");
                                }
                                break;
                            }
                            case "plan":
                            {
                                if(num == 0)
                                {
                                    var dom_right_radio=$(".right_radio");
                                    $("#open_switch").fadeIn("fast");
                                    //$("#plans").fadeOut();
                                    if(dom_right_radio[1].checked)
                                    {
                                        radio[1].onclick();
                                    }
                                }
                                else
                                {
                                    $("#plan_video_"+num+"").fadeIn("fast");
                                }
                                break;
                            }
                            case "date":
                            {
                                g_time_type="NTP";
                                $(".time").attr("readonly","readonly");
                                $(".date").attr("readonly","readonly");
                            }
                            default :
                                break;

                        }
                    }
                    else {
                        $("#label_text_right"+num).fadeIn("fast");
                        $("#label_img"+num).animate({ marginRight: "40px"});
                        $("#label_text_left"+num).fadeOut("fast");
                        g_switch_flag[num] = 0;
                        switch(obj.type)
                        {
                            case "network_1":
                            {
                                $("#open_switch").fadeOut("fast");
                                break;
                            }
                            case "network_2":
                            {
                                if($(".attribute_value_text")[1].innerHTML!= mcs_fault)
                                {
                                    if(num == 0)
                                    {
                                        $("#open_switch").fadeOut("fast");
                                    }
                                    else
                                    {
                                        $("#link_state").fadeOut("fast");
                                        $("#dhcp").fadeIn("fast");
                                    }
                                }
                                break;
                            }
                            case "osd":
                            {
                                if(num == 0) {
                                    $("#name_div_s").fadeOut("fast");
                                    $("#name_div_s")[0].previousSibling.style.borderBottom = "1px solid #22aaaa";
                                }
                                else if(num == 1) {
                                    $("#date_div_s").fadeOut("fast");
                                    $("#date_div_s")[0].previousSibling.style.borderBottom = "1px solid #22aaaa";
                                }
                                else if(num == 2) {
                                    $("#time_div_s").fadeOut("fast");
                                    $("#time_div_s")[0].previousSibling.style.borderBottom = "1px solid #22aaaa";
                                }
                                break;
                            }
                            case "sd_card":
                            {
                                $("#open_switch").fadeOut("slow");
                                break;
                            }
                            case "storage_device":
                            {
                                $("#open_switch").fadeOut("slow");
                                break;
                            } 
                            case "alert_dev":
							{
								$("#mask_div").fadeOut("fast");	
							}
                            
                            case "alert_linkage":
                            {
                                if(num == 0) {
                                    $("#open_switch").fadeOut("fast");
                                }
                                else if(num == 3)
                                {
                                    $("#video_div").fadeOut("fast");
                                }
                                break;
                            }
                            case "plan":
                            {
                                if(num == 0)
                                {
                                    $("#open_switch").fadeOut("slow");

                                }
                                else
                                {
                                    $("#plan_video_"+num+"").fadeOut("fast");
                                }
                                break;
                            }
                            case "date":
                            {
                                g_time_type="manually";
                                $(".time").removeAttr("readonly");
                                $(".date").removeAttr("readonly");
                            }
                            default:
                                break;

                        }
                    }
                });
            }
            switch(obj.type)
            {
                case "dev_name":
                {
                    $("#set_dev_name")[0].onclick = (function()
                    {
                        g_dom_loading_gif.fadeIn();
                        if($("#dev_name_input")[0].value == "")
                        {
                            g_dom_loading_gif.fadeOut();
                            alert_box({text:mcs_nick_not_empty});
                        }
                        else
                        {
                            mcloud_agent.nick_set({sn:g_playing_sn,name:$("#dev_name_input")[0].value},{name:$("#dev_name_input")[0].value},function(msg,ref)
                            {
                                g_dom_loading_gif.fadeOut();
                                if(msg.result == "")
                                {
                                    show_message_box({text:mcs_set_successfully});
                                    g_playing_nick = ref.name;
                                }
                                else
                                {
                                    error_handling(msg.result);
                                }
                            });
                        }
                    });
                    break;
                }

                case "admin_pwd":
                {
                    $(".list_right_button")[0].onclick = (function()
                    {
                        var admin_pwd,new_pwd,confirm_pwd;
                        g_dom_loading_gif.fadeIn();
                        admin_pwd = $(".list_right_input")[0].value;
                        new_pwd = $(".list_right_input")[1].value;
                        confirm_pwd = $(".list_right_input")[2].value;

                       if(check_password(new_pwd,confirm_pwd,admin_pwd))
                       {
                           mcloud_agent.dev_passwd_set({sn:g_playing_sn,old_pass:admin_pwd,new_pass:new_pwd,is_guest: 0},{pass:new_pwd},function(msg,ref)
                           {
                               g_dom_loading_gif.fadeOut();
                               if(msg.result == "")
                               {
                                   mcloud_agent.sign_in({srv:g_location_host,user:getCookie("name"),password:getCookie("pass")},null,function(msg,ref)
                                   {
                                       if(msg.result=="")
                                       {
                                           show_message_box({text:mcs_set_successfully});
                                       }
                                       else
                                       {
                                           error_handling(msg.result);
                                       }
                                   });

                                   if(g_is_back_to_dev_list)
                                   {
                                       document.body.style.overflowX = "hidden";
                                       g_is_back_to_dev_list = false;
                                       $("#setup_list").remove();
                                       dev_list_class();
                                   }
                               }
                               else
                               {
                                   error_handling(msg.result);
                               }
                           });
                       }
                    });
                    break;
                }

                case "visitor_pwd":
                {
                    $(".list_right_button")[0].onclick = (function()
                    {
                        var admin_pwd,new_pwd,confirm_pwd;
                        g_dom_loading_gif.fadeIn();
                        admin_pwd = $(".list_right_input")[0].value;
                        new_pwd = $(".list_right_input")[1].value;
                        confirm_pwd = $(".list_right_input")[2].value;

                        if(check_password(new_pwd,confirm_pwd,admin_pwd))
                        {
                            mcloud_agent.dev_passwd_set({sn:g_playing_sn,old_pass:admin_pwd,new_pass:new_pwd,is_guest:1},null,function(msg,ref)
                            {
                                g_dom_loading_gif.fadeOut();
                                if(msg.result == "")
                                {
                                    show_message_box({text:mcs_set_successfully});
                                }
                                else
                                {
                                    error_handling(msg.result);
                                }
                            });
                        }
                    });
                    break;
                }

                case "network_1":
                {
                    var radio1 = document.getElementsByName("id_type");
                    radio1[0].onclick = (function()
                    {
                        $("#manually_set_id").fadeOut("fast");
                        if($(".attribute_value_text")[3].innerHTML!= "")
                        {
                            $("#auto_get_id").fadeIn("fast");
                        }
                    });
                    radio1[1].onclick = (function()
                    {
                        $("#auto_get_id").fadeOut("fast");
                        $("#manually_set_id").fadeIn("fast");
                    });
                    var radio2 = document.getElementsByName("dns_type");
                    radio2[0].onclick = (function()
                    {
                        $("#manually_set_dns").fadeOut("fast");
                        if($(".attribute_value_text")[6].innerHTML!= "")
                        {
                            $("#auto_get_dns").fadeIn("fast");
                        }
                    });
                    radio2[1].onclick = (function()
                    {
                        $("#auto_get_dns").fadeOut("fast");
                        $("#manually_set_dns").fadeIn("fast");
                    });
                    mcloud_agent.net_get({sn:g_playing_sn},null,function(msg,ref)
                    {
                        g_dom_loading_gif.fadeOut();
                        if(msg.result!= "")
                        {
                            error_handling(msg.result);
                        }
                        else if(msg.result == "" && g_receive_flag == 4)
                        {
                            g_switch_flag[0] = (msg.networks[0].enabled == 1)?0:1;
                            $(".attribute_value_text")[1].innerHTML = msg.networks[0].phy.info.mac;
                            $(".attribute_value_text")[2].innerHTML = (msg.networks[0].phy.info.stat == "ok")?mcs_connnected:mcs_not_connected;
                            if(msg.networks[0].ipv4.conf.mode == "dhcp")
                            {
                                radio1[0].checked = true;
                                radio1[0].onclick();
                                $(".attribute_value_text")[3].innerHTML = msg.networks[0].ipv4.info.ip.addr;
                                $(".attribute_value_text")[4].innerHTML = msg.networks[0].ipv4.info.ip.gw;
                                $(".attribute_value_text")[5].innerHTML = msg.networks[0].ipv4.info.ip.mask;
                            }
                            else
                            {
                                radio1[1].checked = true;
                                radio1[1].onclick();
                                $(".normal_input_right")[0].value = msg.networks[0].ipv4.info.ip.addr;
                                $(".normal_input_right")[1].value = msg.networks[0].ipv4.info.ip.gw;
                                $(".normal_input_right")[2].value = msg.networks[0].ipv4.info.ip.mask;
                            }
                            if(msg.dns.conf.mode == "dhcp")
                            {
                                radio2[0].checked = true;
                                radio2[0].onclick();
                                $(".attribute_value_text")[6].innerHTML = msg.dns.info.dns[0];
                                $(".attribute_value_text")[7].innerHTML = msg.dns.info.dns[1];
                            }
                            else
                            {
                                radio2[1].checked = true;
                                radio2[1].onclick();
                                $(".normal_input_right")[3].value = msg.dns.info.dns[0];
                                $(".normal_input_right")[4].value = msg.dns.info.dns[1];
                            }

                            $(".list_right_button")[0].onclick = (function()
                            {
                                set_prompt({text:mcs_modify_network_prompt});
                                $("#ok").click(function()
                                {
                                    g_dom_loading_gif.fadeIn();
                                    $("#prompt_div").remove();
                                    $("#prompt").remove();
                                    var conf_dns,conf_ip,ipv4;
                                    conf_dns = (radio2[0].checked)?{mode:"dhcp",static_dns:""}:{mode:"static",static_dns:[$(".normal_input_right")[3].value,$(".normal_input_right")[4].value]};
                                    conf_ip = (radio1[0].checked)?{mode:"dhcp",static_ip:""}:{mode:"static",static_ip:{addr:$(".normal_input_right")[0].value,gw:$(".normal_input_right")[1].value,mask:$(".normal_input_right")[2].value}};
                                    ipv4 = {conf:conf_ip};
                                    mcloud_agent.net_set({sn:g_playing_sn,networks:{ipv4:ipv4,enabled:g_switch_flag[0]},dns:{conf:conf_dns}},null,function(msg,ref)
                                    {
                                        g_dom_loading_gif.fadeOut();
                                        if(msg.result!= "")
                                        {
                                            error_handling(msg.result);
                                        }
                                        else
                                        {
                                            show_message_box({text:mcs_set_successfully});
                                        }
                                    });
                                });
                                $("#cancel")[0].onclick = (function()
                                {
                                    $("#prompt_div").remove();
                                    $("#prompt").remove();
                                });
                            });
                            
                            $(".label")[0].onclick();
                        }
                    });
                    break;
                }

                case "network_2":
                {
                    var radio1 = document.getElementsByName("id_type"),
                        network_wifi;
                    radio1[0].onclick = (function()
                    {
                        $("#manually_set_id").fadeOut("fast");
                        $("#auto_get_id").fadeIn("fast");
                    });
                    radio1[1].onclick = (function()
                    {
                        $("#auto_get_id").fadeOut("fast");
                        $("#manually_set_id").fadeIn("fast");
                    });
                    var radio2 = document.getElementsByName("dns_type");
                    radio2[0].onclick = (function()
                    {
                        $("#manually_set_dns").fadeOut("fast");
                        $("#auto_get_dns").fadeIn("fast");
                    });
                    radio2[1].onclick = (function()
                    {
                        $("#auto_get_dns").fadeOut("fast");
                        $("#manually_set_dns").fadeIn("fast");
                    });
                    mcloud_agent.net_get({sn:g_playing_sn},null,function(msg,ref)
                    {
                        g_dom_loading_gif.fadeOut();
                        if(msg.result!= "")
                        {
                            error_handling(msg.result);
                        }
                        else if(msg.networks[1].phy.info.stat == "err")
                        {
                            var dom_link_stat;
                            $(".attribute_value_text")[2].innerHTML = mcs_fault;
                            $("#open_switch").fadeOut();
                            dom_link_stat = create_dom("link_stat",$(".list_right_item_ex")[0]);
                            dom_link_stat.innerHTML = "<span class = 'attribute_key_text'>"+mcs_network_status+"</span>"
                                +"<span class = 'attribute_value_text'>"+mcs_fault+"</span>";
                        }
                        else if(msg.result == "" && g_receive_flag == 5)
                        {
                            var dom_text = $(".attribute_value_text"),dom_label=$(".label"),
                                dom_input=$(".normal_input_right");
                                
                            network_wifi = msg.networks[1];
                            
                            g_switch_flag[0] = (msg.networks[1].enabled == 1)?0:1;
                            g_switch_flag[1] = (msg.networks[1].phy.conf.mode == "adhoc")?1:0;
                            dom_label[1].onclick();
                            
                            dom_text[8].innerHTML = network_wifi.dhcp_srv.conf.ip_start;
                            dom_text[9].innerHTML = network_wifi.dhcp_srv.conf.ip_end;
                            dom_text[10].innerHTML = network_wifi.dhcp_srv.conf.gw;

                            var conf = network_wifi.wifi_client.conf;
                            g_wifi_list_info = network_wifi.wifi_client;

                            if(g_wifi_list_info.info.stat == "ok")
                            {
                                g_wifi_connection="finish";
                                $("#wifi_link_stat").fadeOut();
                                $("#select_wifi").val(conf.ssid);
                                $("#wifi_pwd").val(conf.key);
                            }
                            else if(g_wifi_list_info.info.stat == "info.connecting")
                            {
                                g_wifi_connection="connection";
                                $("#wifi_link_stat").fadeIn();
                                $("#select_wifi").val(conf.ssid);
                                $("#wifi_pwd").val(conf.key);
                                check_wifi_stat();
                            }

                            $(".list_triangle")[0].onclick = (function()
                            {
                                if($("#wifi_list").is(":hidden"))
                                {
                                    if($("#wifi_list")[0].innerHTML == "")
                                    {
                                        var item = [];
                                        for(var i = 0;i<g_wifi_list_info.ap_list.length;i++)
                                        {
                                            item[i] = document.createElement("div");
                                            var select_point = document.createElement("div");
                                            var wifi_name = document.createElement("span");
                                            var signal_strength = document.createElement("img");
                                            item[i].setAttribute("class","wifi_list_item");
                                            wifi_name.setAttribute("class","wifi_name");
                                            wifi_name.innerHTML = g_wifi_list_info.ap_list[i].ssid;
                                            select_point.setAttribute("class","mark");
                                            if(g_wifi_list_info.ap_list[i].ssid == $("#select_wifi").val())
                                            {
                                                select_point.style.display = "block";
                                            }
                                            item[i].appendChild(select_point);
                                            item[i].appendChild(wifi_name);
                                            $("#wifi_list")[0].appendChild(item[i]);
                                            item[i].onmouseover = (function()
                                            {
                                                this.style.background = "#22aaaa";
                                            });
                                            item[i].onmouseout = (function()
                                            {
                                                this.style.background = "#ffffff";
                                            });
                                            item[i].onclick = (function()
                                            {
                                                $("#select_wifi").val($(this).text());
                                                $(".mark").fadeOut();
                                                $(this).find("div").fadeIn();
                                                $("#wifi_list").fadeOut();
                                            });
                                        }
                                    }
                                    $("#wifi_list").fadeIn();
                                }
                                else
                                {
                                    $("#wifi_list").fadeOut();
                                }
                            });

                            $("#refresh_wifi").click(function()
                            {
                                g_dom_loading_gif.fadeIn();
                                mcloud_agent.net_get({sn:g_playing_sn},null,function(msg,ref)
                                {
                                    g_dom_loading_gif.fadeOut();
                                    if(msg.result!= "")
                                    {
                                        error_handling(msg.result);
                                    }
                                    else
                                    {
                                        g_wifi_list_info = network_wifi.wifi_client;
                                    }
                                });
                            });

                            dom_text[1].innerHTML = network_wifi.phy.info.mac;
                            dom_text[2].innerHTML = (network_wifi.phy.info.stat == "ok")?mcs_connnected:mcs_not_connected;
                            if(network_wifi.ipv4.conf.mode == "dhcp")
                            {
                                radio1[0].checked = true;
                                radio1[0].onclick();
                                dom_text[3].innerHTML = network_wifi.ipv4.info.ip.addr;
                                dom_text[4].innerHTML = network_wifi.ipv4.info.ip.gw;
                                dom_text[5].innerHTML = network_wifi.ipv4.info.ip.mask;
                            }
                            else
                            {
                                radio1[1].checked = true;
                                radio1[1].onclick();
                                dom_input[0].value = network_wifi.ipv4.info.ip.addr;
                                dom_input[1].value = network_wifi.ipv4.info.ip.gw;
                                dom_input[2].value = network_wifi.ipv4.info.ip.mask;
                            }
                            if(msg.dns.conf.mode == "dhcp")
                            {
                                radio2[0].checked = true;
                                radio2[0].onclick();
                                dom_text[6].innerHTML = msg.dns.info.dns[0];
                                dom_text[7].innerHTML = msg.dns.info.dns[1];
                            }
                            else
                            {
                                radio2[1].checked = true;
                                radio2[1].onclick();
                                dom_input[3].value = msg.dns.info.dns[0];
                                dom_input[4].value = msg.dns.info.dns[1];
                            }

                            $(".list_right_button")[0].onclick = (function()
                            {
                                set_prompt({text:mcs_modify_network_prompt});
                                $("#ok")[0].onclick = (function()
                                {
                                    g_dom_loading_gif.fadeIn();
                                    $("#prompt_div").remove();
                                    $("#prompt").remove();
                                    var conf_dns = ($(".auto_get")[1].checked)?{mode:"dhcp",static_dns:""}:{mode:"static",static_dns:[$(".normal_input_right")[3].value,$(".normal_input_right")[4].value]};
                                    var wifi_client = {conf:{enabled: g_wifi_list_info.conf.enabled,
                                        key: $("#wifi_pwd").val(),
                                        ssid: $("#select_wifi").val(),
                                        usr: $("#select_wifi").val()}};
                                    var phy = {conf:{mode:(g_switch_flag[1] == 1)?"wificlient":"adhoc",mtu:0}};
                                    var conf_ip = ($(".auto_get")[0].checked)?{enabled:1,mode:"dhcp",static_ip:""}:{enabled:1,mode:"static",static_ip:{addr:$(".normal_input_right")[0].value,gw:$(".normal_input_right")[1].value,mask:$(".normal_input_right")[2].value}};
                                    var ipv4 = {conf:conf_ip};
                                    mcloud_agent.net_set({sn:g_playing_sn,networks:{token: "ra0",phy:phy,ipv4:ipv4,enabled:g_switch_flag[0],wifi_client:wifi_client},dns:{conf:conf_dns}},null,function(msg,ref)
                                    {
                                        g_dom_loading_gif.fadeOut();
                                        if(msg.result!= "")
                                        {
                                            error_handling(msg.result);
                                        }
                                        else
                                        {
                                            show_message_box({text:mcs_set_successfully});
                                            g_wifi_connection="connection";
                                            $("#wifi_link_stat").fadeIn();
                                            setTimeout(check_wifi_stat,3000);
                                        }
                                    });
                                });
                                $("#cancel")[0].onclick = (function()
                                {
                                    $("#prompt_div").remove();
                                    $("#prompt").remove();
                                });
                            });
                            
                            dom_label[0].onclick();
                            
                        }
                    });
                    break;
                }

                case "osd":
                {
                    mcloud_agent.osd_get({sn:g_playing_sn},null,function(msg,ref)
                    {
                        g_dom_loading_gif.fadeOut();
                        if(msg.result!= "")
                        {
                            error_handling(msg.result);
                        }
                        else if(msg.result == "" && g_receive_flag == 6)
                        {
                            g_switch_flag[0] = (msg.text_enable == 1)?0:1;
                            g_switch_flag[1] = (msg.date_enable == 1)?0:1;
                            g_switch_flag[2] = (msg.time_enable == 1)?0:1;
                            g_switch_flag[3] = (msg.week_enable == 1)?0:1;
                            for(var i = 0;i<4;i++)
                            {
                                $(".label")[i].onclick();
                            }
                            $(".normal_input_right")[0].value = msg.text;
                            for(var i in $("#select_date")[0].options)
                            {
                                if($("#select_date")[0].options[i].text == msg.date_format)
                                {
                                    $("#select_date")[0].options[i].selected = true;
                                    break;
                                }
                            }
                            $("#select_time").val(msg.time_12h);
                            $(".list_right_button")[0].onclick = (function()
                            {
                                g_dom_loading_gif.fadeIn();
                                mcloud_agent.osd_set({sn:g_playing_sn,text:$(".normal_input_right")[0].value,text_enable:g_switch_flag[0],
                                    week_enable:g_switch_flag[3],date_format:$("#select_date").find("option:selected").text(),date_enable:g_switch_flag[1],
                                    time_12h:$("#select_time").val(),time_enable:g_switch_flag[2]},null,function(msg,ref)
                                {
                                    g_dom_loading_gif.fadeOut();
                                    if(msg.result!= "")
                                    {
                                        error_handling(msg.result);
                                    }
                                    else
                                    {
                                        show_message_box({text:mcs_set_successfully});
                                    }
                                });
                            });
                        }
                    });
                    break;
                }

                case "sd_card":
                {
                    mcloud_agent.sd_get({sn:g_playing_sn},null,function(msg,ref)
                    {
                        g_dom_loading_gif.fadeOut();
                        if(msg.result!= "")
                        {
                            error_handling(msg.result);
                        }
                        else if(msg.result == "" && g_receive_flag == 7||6)
                        {
                            var ctrl_type = msg.status,dom_text=$(".attribute_value_text"),
                                dom_button_ex=$(".list_right_button_ex"),
                                dom_button=$(".list_right_button"),
                                dom_item_ex=$(".list_right_item_ex"),
                                dom_item=$(".list_right_item");
                            g_switch_flag[0] = (msg.enable == 1)?0:1;

                            if(msg.status == "empty")
                            {
                                dom_text[0].innerHTML = mcs_no_sdcard;
                                dom_item_ex.hide();
                                $(".list_right_item")[2].style.display = "none";
                                dom_button.hide();
                            }
                            else if(msg.status == "mount")
                            {
                                dom_text[0].innerHTML = mcs_connnected;
                                dom_text[1].innerHTML = msg.capacity+"MB";
                                dom_text[2].innerHTML = msg.usage+"MB";
                                dom_text[3].innerHTML = msg.availableSize+"MB";
                            }
                            else if(msg.status == "umount")
                            {
                                for(var i = 0;i<3;i++)
                                {
                                    dom_item_ex[i].style.display = "none";
                                }
                                dom_item[2].style.display = "none";
                                dom_text[0].innerHTML = mcs_unmounted;
                                $(".attribute_key_text")[6].innerHTML = " -"+mcs_mount;
                                dom_button_ex[1].value = mcs_mount;
                            }
                            else if(msg.status == "repair"||msg.status == "ro"||msg.status=="readonly")
                            {
                                for(var i = 0;i<3;i++)
                                {
                                    dom_button_ex[i].style.display = "none";
                                }
                                dom_item[2].style.display = "none";
                                dom_text[0].innerHTML = mcs_fault;
                                $(".attribute_key_text")[6].innerHTML = " -"+mcs_repair;
                                dom_button_ex[1].value = mcs_repair;

                            }
                            dom_button_ex[0].onclick = (function()
                            {
                                set_prompt({text:mcs_format_prompt});
                                $("#ok")[0].onclick = (function()
                                {
                                    g_dom_loading_gif.fadeIn();
                                    $("#prompt_div").remove();
                                    $("#prompt").remove();
                                    mcloud_agent.sd_set({sn:g_playing_sn,ctrl_type:"format",enable:g_switch_flag[0]},null,function(msg,ref)
                                    {
                                        g_dom_loading_gif.fadeOut();
                                        if(msg.result!= "")
                                        {
                                            error_handling(msg.result);
                                        }
                                        else
                                        {
                                            alert_box({text:mcs_sdcard_formating},function()
                                            {
                                                mcloud_agent.reboot({sn:g_playing_sn},ref,function(msg,ref)
                                                {
                                                    if(msg.result!= "")
                                                    {
                                                        error_handling(msg.result);
                                                    }
                                                    else
                                                    {
                                                        alert_box({text:mcs_restore_camera},function()
                                                        {
                                                            $("#setup_list").remove();
                                                            dev_list_class();
                                                        });
                                                    }

                                                });
                                            });


                                        }
                                    });
                                });
                                $("#cancel")[0].onclick = (function()
                                {
                                    $("#prompt_div").remove();
                                    $("#prompt").remove();
                                });

                            });
                            dom_button_ex[1].onclick = (function()
                            {
                                if(this.value == mcs_unmount)
                                {
                                    set_prompt({text:mcs_umount_prompt});
                                    $("#ok")[0].onclick = (function()
                                    {
                                        g_dom_loading_gif.fadeIn();
                                        $("#prompt_div").remove();
                                        $("#prompt").remove();
                                        mcloud_agent.sd_set({sn:g_playing_sn,ctrl_type:"umount",enable:g_switch_flag[0]},null,function(msg,ref)
                                        {
                                            g_dom_loading_gif.fadeOut();
                                            if(msg.result!= "")
                                            {
                                                error_handling(msg.result);
                                            }
                                            else
                                            {
                                                for(var i = 0;i<3;i++)
                                                {
                                                    $(".list_right_item_ex")[i].style.display = "none";
                                                }
                                                $(".list_right_item")[2].style.display = "none";
                                                $(".attribute_value_text")[0].innerHTML = mcs_unmounted;
                                                $(".attribute_key_text")[6].innerHTML = " -"+mcs_mount;
                                                $(".list_right_button_ex")[1].value = mcs_mount;
                                                ctrl_type = "umount";
                                            }
                                        });
                                    });
                                    $("#cancel")[0].onclick = (function()
                                    {
                                        $("#prompt_div").remove();
                                        $("#prompt").remove();
                                    });
                                }
                                else if(this.value == mcs_mount)
                                {
                                    mcloud_agent.sd_set({sn:g_playing_sn,ctrl_type:"mount",enable:g_switch_flag[0]},null,function(msg,ref)
                                    {
                                        if(msg.result!= "")
                                        {
                                            error_handling(msg.result);
                                        }
                                        else
                                        {
                                            $(".list_right_item_ex").fadeIn();
                                            $(".list_right_item")[2].style.display = "block";
                                            $(".attribute_value_text")[0].innerHTML = mcs_connnected;
                                            $(".attribute_key_text")[6].innerHTML = " -"+mcs_unmount;
                                            $(".list_right_button_ex")[1].value = mcs_unmount;
                                            ctrl_type = "mount";
                                            mcloud_agent.sd_get({sn:g_playing_sn},null,function(msg,ref)
                                            {
                                                if(msg.result != "")
                                                {
                                                    error_handling(msg.result);
                                                }
                                                else
                                                {
                                                    $(".attribute_value_text")[1].innerHTML = msg.capacity+"MB";
                                                    $(".attribute_value_text")[2].innerHTML = msg.usage+"MB";
                                                    $(".attribute_value_text")[3].innerHTML = msg.availableSize+"MB";
                                                }
                                            });
                                        }
                                    });
                                }
                                else
                                {
                                    set_prompt({text:mcs_repair_prompt});
                                    mcloud_agent.sd_set({sn:g_playing_sn,ctrl_type:"ro",enable:g_switch_flag[0]},null,function(msg,ref)
                                    {
                                        if(msg.result!= "")
                                        {
                                            error_handling(msg.result);
                                        }
                                        else
                                        {
                                            alert_box({text:mcs_sdcard_repairing},function()
                                            {
                                                mcloud_agent.reboot({sn:g_playing_sn},ref,function(msg,ref)
                                                {
                                                    if(msg.result!= "")
                                                    {
                                                        error_handling(msg.result);
                                                    }
                                                    else
                                                    {
                                                        alert_box({text:mcs_restore_camera},function()
                                                        {
                                                            $("#setup_list").remove();
                                                            dev_list_class();
                                                        });

                                                    }

                                                });
                                            });

                                        }
                                    });
                                }

                            });
                            dom_button[0].onclick = (function()
                            {
                                g_dom_loading_gif.fadeIn();
                                mcloud_agent.sd_set({sn:g_playing_sn,ctrl_type:ctrl_type,enable:g_switch_flag[0]},null,function(msg,ref)
                                {
                                    g_dom_loading_gif.fadeOut();
                                    if(msg.result!= "")
                                    {
                                        error_handling(msg.result);
                                    }
                                    else
                                    {
                                        show_message_box({text:mcs_set_successfully});
                                    }
                                });
                            });
                            $(".label")[0].onclick();
                        }
                    });
                    break;
                }
                case "storage_device":
                {
                    mcloud_agent.box_conf_get({box_sn:g_playing_sn},null,function(msg,ref){
                        g_dom_loading_gif.fadeOut();
                        if(msg.result == ""){
                            if(msg.conf.enable==1){
                                $("#label_img0").css({"margin-right":"0px"});
                                $("#label_text_left0").show();
                                $("#label_text_right0").hide();
                                $("#open_switch").show();
                                $("#dev_id").val(msg.conf.username);
                                $("#dev_pwd").val(msg.conf.password);
                                $(".attribute_value_text").html("已连接");
                            }else if(msg.conf.enable==0){
                                $("#label_img0").css({"margin-right":"40px"});
                                $("#open_switch").hide();
                                $("#dev_id").val(msg.conf.username);
                                $("#dev_pwd").val(msg.conf.password);
                                $(".attribute_value_text").html("未连接");
                                $("#label_text_left0").hide();
                                $("#label_text_right0").show();
                            }
                        }else{
                            $(".attribute_value_text").html("未连接");
                        }
                    });
                    $(".list_right_button").click(function(){
                        n_storage_device_css = $("#label_img0").css("margin-right");
                        g_dom_loading_gif.fadeIn();
                        dev_id = $("#dev_id").val();
                        dev_pwd = $("#dev_pwd").val();
                        if(dev_id==""){alert_box({text:"设备ID不能为空"});return;}
                        if(dev_pwd==""){alert_box({text:"密码不能为空"});return;}
                        mcloud_agent.box_login({box_sn:g_playing_sn,enable:n_storage_device_css=="0px"?1:0,username:dev_id,password:dev_pwd},null,function(msg,ref){
                            g_dom_loading_gif.fadeOut();
                            if(msg.result == "")
                            {
                                alert_box({text:"设置成功"});
                            }

                            else
                            {
                                alert_box({text:"设置失败"});
                                log("error:box_login_ack return Result error in class_options_storage_device.");
                                return -1;
                            }
                        });
                    })
                    break;  
                }
                case "alert_dev":
                {

                    var dom_out_box = $(".out_box"),outX,evt,
                        dom_in_box = $(".in_box"),day_flag = false,night_flag = false,
                        dom_circle = $(".circle"),left,top,mouseX, i,dom_value = $(".show_value"),
                        dom_mask = $("#set_mask");
                    dom_out_box.mousedown(function(e)
                    {
                        if(this == dom_out_box[0])
                        {
                            day_flag = true;
                            i = 0;
                        }
                        else
                        {
                            night_flag = true;
                            i = 1;
                        }
                        evt = window.event||e;
                        outX = this.offsetLeft;
                        mouseX = evt.clientX;
                        dom_in_box[i].style.width = mouseX-outX+"px";
                        dom_circle[i].style.left = mouseX+"px";

                        dom_value[i].style.display = "block";
                        dom_value[i].innerHTML = parseInt(dom_in_box[i].offsetWidth/1.6);
                    });

                    document.onmousemove = (function(e)
                    {
                        evt = window.event||e;
                        if(day_flag||night_flag)
                        {
                            mouseX = evt.clientX;
                            var value = mouseX-outX;
                            if(value>160)
                            {
                                dom_in_box[i].style.width = "160px";
                                dom_circle[i].style.left = outX+160+"px";
                            }
                            else if(value <= 0)
                            {
                                dom_in_box[i].style.width = "0";
                                dom_circle[i].style.left = outX+"px";
                            }
                            else
                            {
                                dom_in_box[i].style.width = value+"px";
                                dom_circle[i].style.left = mouseX+"px";
                            }
                            dom_value[i].innerHTML = parseInt(dom_in_box[i].offsetWidth/1.6);
                        }
                    });

                    document.onmouseup = (function()
                    {
                        day_flag = false;
                        night_flag = false;
                        dom_value.fadeOut();
                    });

					          dom_mask.click(function()
					          {
						           var dom_play_box,height = 360,width =640,
							         top = ($(window).height()-height-10)/2,left = ($(window).width()-width)/2,
							         inner_window_info = {dom_id:("inner_window" + 999), index:obj.num, video_chls:null, audio_chls:null, mme:null, ipc_state:"", node_sn:""};
						
						           dom_play_box = create_dom("play_box_m",$("#bottom_box"));
            			     dom_play_box.style.cssText = "height:"+height+"px;width:"+width+"px;left:"+left+"px;top:"+top+"px;";
            			     create_mme({inner_window_info:inner_window_info,page:"home",protocol:"auto",dom:dom_play_box});
						           motion_mask();
					          });

                    mcloud_agent.alarm_trigger_get({sn:g_playing_sn},null,function(msg,ref)
                    {
                        g_dom_loading_gif.fadeOut();
                        if(msg.result!= "")
                        {
                            error_handling(msg.result);
                        }
                        else if(msg.result == "" && g_receive_flag == 9)
                        {
                            g_dom_loading_gif.fadeOut();
                            $(".attribute_value_text")[0].innerHTML = (msg.io_input == "Open")?mcs_normally_open:mcs_normally_close;
                            $(".attribute_value_text")[1].innerHTML = (msg.io_output == "Open")?mcs_normally_open:mcs_normally_close;

                            dom_in_box[0].style.width = msg.sensitivity*1.6+"px";
                            dom_in_box[1].style.width = msg.night_sensitivity*1.6+"px";
                            dom_circle[0].style.cssText = "left:"+(dom_out_box[0].offsetLeft+msg.sensitivity*1.6)+"px;top:"+dom_out_box[0].offsetTop+"px";
                            dom_circle[1].style.cssText = "left:"+(dom_out_box[1].offsetLeft+msg.night_sensitivity*1.6)+"px;top:"+dom_out_box[1].offsetTop+"px";


                            $(".list_right_button")[0].onclick = (function()
                            {
                                g_dom_loading_gif.fadeIn();
                                mcloud_agent.alarm_trigger_set({sn:g_playing_sn,io_input:msg.io_input,io_output:msg.io_output,sensitivity:parseInt(dom_in_box[0].offsetWidth/1.6),night_sensitivity:parseInt(dom_in_box[1].offsetWidth/1.6)},null,function(msg,ref)
                                {
                                    g_dom_loading_gif.fadeOut();
                                    if(msg.result!= "")
                                    {
                                        error_handling(msg.result);
                                    }
                                    else
                                    {
                                        show_message_box({text:mcs_set_successfully});
                                    }
                                });

                            });
                        }
                    });
                    
                    mcloud_agent.motion_mask_get({sn:g_playing_sn},null,function(msg,ref)
                    {
                    	if(msg.result=="")
                    	{
                    		if(msg.conf.enable=="1")
                    		{
                    			g_switch_flag[0] = 0;
                    		}
                    		else
                    		{
                    			g_switch_flag[0] = 1;
                    		}
                    		$(".label").click();
                    	}
                    });
                    break;
                }

                case "alert_linkage":
                {
                    var actions,protect_enable;
                    status = $("#label_img0").css("margin-left");
                    if(status == "1px"){
                        $("#open_switch").show();
                    }else{
                        $("#open_switch").hide();
                    }
                    $("#select_name")[0].onchange = (function()
                    {
                        if($("#select_name").val() == mcs_motion)
                        {
                            $("#call_type")[0].innerHTML = $("#select_name").val();
                            g_switch_flag[0] = (actions[0].enable == 1)?0:1;
                            g_switch_flag[1] = (actions[0].io_out_enable == 1)?0:1;
                            g_switch_flag[2] = (actions[0].snapshot_enable == 1)?0:1;
                            g_switch_flag[3] = (actions[0].record_enable == 1)?0:1;
                            for(var i = 0;i<4;i++)
                            {
                                $(".label")[i].onclick();
                            }
                            $(".normal_input_right").val(actions[0].pre_record_time);
                        }
                        else
                        {
                            $("#call_type")[0].innerHTML = $("#select_name").val();
                            g_switch_flag[0] = (actions[1].enable == 1)?0:1;
                            g_switch_flag[1] = (actions[1].io_out_enable == 1)?0:1;
                            g_switch_flag[2] = (actions[1].snapshot_enable == 1)?0:1;
                            g_switch_flag[3] = (actions[1].record_enable == 1)?0:1;
                            for(var i = 0;i<4;i++)
                            {
                                $(".label")[i].onclick();
                            }
                            $(".normal_input_right").val(actions[1].pre_record_time);

                        }
                    });
                    mcloud_agent.alarm_action_get({sn:g_playing_sn},null,function(msg,ref)
                    {
                        g_dom_loading_gif.fadeOut();
                        if(msg.result!= "")
                        {
                            error_handling(msg.result);
                        }
                        else if(msg.result == "" && g_receive_flag == 10)
                        {
                            actions = msg.actions;
                            protect_enable = msg.enable;
                            $("#call_type")[0].innerHTML = $("#select_name")[0].value;
                            g_switch_flag[0] = (actions[0].enable == 1)?0:1;
                            g_switch_flag[1] = (actions[0].io_out_enable == 1)?0:1;
                            g_switch_flag[2] = (actions[0].snapshot_enable == 1)?0:1;
                            g_switch_flag[3] = (actions[0].record_enable == 1)?0:1;
                            for(var i = 0;i<4;i++)
                            {
                                $(".label")[i].onclick();
                            }
                            $(".normal_input_right").val(actions[0].pre_record_time);
                            $(".list_right_button")[1].value = (msg.enable == 1)?mcs_alert_off:mcs_alert_on;
                            $(".list_right_button")[0].onclick = (function()
                            {
                                g_dom_loading_gif.fadeIn();
                                var k = ($("#select_name").val() == mcs_motion)?0:1;
                                actions[k].enable = g_switch_flag[0];
                                actions[k].io_out_enable = g_switch_flag[1];
                                actions[k].snapshot_enable = g_switch_flag[2];
                                actions[k].record_enable = g_switch_flag[3];
                                actions[k].pre_record_time = $(".normal_input_right").val();
                                mcloud_agent.alarm_action_set({sn:g_playing_sn,enable:protect_enable,actions:actions[k]},null,function(msg,ref)
                                {
                                    g_dom_loading_gif.fadeOut();
                                    if(msg.result!= "")
                                    {
                                        error_handling(msg.result);
                                    }
                                    else
                                    {
                                        show_message_box({text:mcs_set_successfully});
                                    }
                                });

                            });
                            $(".list_right_button")[1].onclick = (function()
                            {
                                if(this.value == mcs_alert_off)
                                {
                                    protect_enable = 0;
                                    set_prompt({text:mcs_prompt_alert_off});
                                }
                                else
                                {
                                    protect_enable = 1;
                                    set_prompt({text:mcs_prompt_alert_on});
                                }
                                $("#ok")[0].onclick = (function()
                                {
                                    $("#prompt_div").remove();
                                    $("#prompt").remove();
                                    mcloud_agent.alarm_action_set({sn:g_playing_sn,enable:protect_enable},null,function(msg,ref)
                                    {
                                        if(msg.result!= "")
                                        {
                                            error_handling(msg.result);
                                        }
                                        else
                                        {
                                            $(".list_right_button")[1].value = (protect_enable == 0)?mcs_alert_on:mcs_alert_off;
                                            show_message_box({text:mcs_set_successfully});
                                        }
                                    });
                                });
                                $("#cancel")[0].onclick = (function()
                                {
                                    $("#prompt_div").remove();
                                    $("#prompt").remove();
                                });
                            });
                        }

                    });
                    break;
                }

                case "plan":
                {
                    var radio = document.getElementsByName("plan");
                    for(var i = 0;i<4;i++)
                    {
                        $(".week_checkbox")[7+8*i].onclick = (function()
                        {
                            for(var i = 0;i<4;i++)
                            {
                                if(this == $(".week_checkbox")[7+8*i])
                                {
                                    break;
                                }
                            }
                            if(this.checked)
                            {
                                for(var j = 0;j<8;j++)
                                {
                                    $(".week_checkbox")[j+i*8].checked = true;
                                }
                            }
                            else
                            {
                                for(var j = 0;j<8;j++)
                                {
                                    $(".week_checkbox")[j+i*8].checked = false;
                                }
                            }
                        });
                    }
                    mcloud_agent.record_get({sn:g_playing_sn},null,function(msg,ref)
                    {
                        g_dom_loading_gif.fadeOut();
                        if(msg.result!= "")
                        {
                            error_handling(msg.result);
                        }
                        else if(msg.result == "" && g_receive_flag == 11)
                        {
                            var dom_labels = $(".label");
                            g_switch_flag[0] = (msg.enable == 1)?0:1;
                            if(msg.full_time == 1)
                            {
                                radio[0].checked = true;
                                radio[0].onclick();
                            }
                            if(msg.times)
                            {
                                radio[1].checked = true;
                                radio[1].onclick();
                                for(var i = 4;i >= 1;i--)
                                {
                                	if(msg.times[i-1])
                                	{
                                		g_switch_flag[i] = 0;
                                	}
                                	else
                                	{
                                		g_switch_flag[i] = 1;
                                	}
                                    dom_labels[i].onclick();
                                }
                                
                                for(var i = 0;i<msg.times.length;i++)
                                {
                                    var count = 0,wday = msg.times[i].wday,
                                        dom_time = $(".time_input"),
                                        dom_checkbox = $(".week_checkbox");
                                    while(count<7)
                                    {
                                        dom_checkbox[count+8*i].checked = (wday%2 == 1)?true:false;
                                        wday = parseInt(wday/2);
                                        count++;
                                    }
                                    dom_time[0+i*2].value = input_time_change({type:"int",data:msg.times[i].start});
                                    dom_time[1+i*2].value = input_time_change({type:"int",data:msg.times[i].end});
                                }
                            }
                            else
                            {
                                for(var i = 4;i >= 1;i--)
                                {
                                    g_switch_flag[i] = 1;
                                    dom_labels[i].onclick();
                                }
                            }
                            $(".list_right_button")[0].onclick = (function()
                            {
                                var times = [],wday = 0,dom_checkbox = $(".week_checkbox"),num = -1,
                                    dom_time = $(".time_input");
                                g_dom_loading_gif.fadeIn();
                                for(var i = 1;i<5;i++)
                                {
                                    if(g_switch_flag[i])
                                    {
                                        wday = 0;
                                        num++;
                                        for(var j = 0;j<8;j++)
                                        {
                                            wday += ((dom_checkbox[j+(i-1)*8].checked == true)?1:0)*(Math.pow(2,j));
                                        }
                                        if(wday != 0)
                                        {
                                            times[num] = {start:input_time_change({type:"string",data:dom_time[0+(i-1)*2].value}),end:input_time_change({type:"string",data:dom_time[1+(i-1)*2].value}),wday:wday};
                                            if(times[i-1].start>times[i-1].end)
                                            {
                                                alert_box({text:mcs_end_time_should_lt_begin});
                                                return;
                                            }
                                        }


                                    }
                                }
                                mcloud_agent.record_set({sn:g_playing_sn,enable:g_switch_flag[0],full_time:(radio[0].checked == true)?1:0,times:times},null,function(msg,ref)
                                {
                                    g_dom_loading_gif.fadeOut();
                                    if(msg.result!= "")
                                    {
                                        error_handling(msg.result);
                                    }
                                    else
                                    {
                                        show_message_box({text:mcs_set_successfully});
                                    }
                                });
                            });
                            $(".label")[0].onclick();
                            
                        }
                    });
                    radio[0].onclick = (function()
                    {
                        $("#plans").fadeOut("fast");
                    });
                    radio[1].onclick = (function()
                    {
                        $("#plans").fadeIn("fast");
                    });
                    break;
                }

                case "date":
                {
                    mcloud_agent.time_get({sn:g_playing_sn},null,function(msg,ref)
                    {
                        g_dom_loading_gif.fadeOut();
                        if(msg.result!= "")
                        {
                            error_handling(msg.result);
                        }
                        else if(msg.result == "" && g_receive_flag == 12||7)
                        {
                            if(msg.auto_sync == 1)
                            {
                                g_switch_flag[0] = 0;
                                $(".label")[0].onclick();
                            }
                            else
                            {
                                g_switch_flag[0] = 1;
                                $(".label")[0].onclick();
                            }
                            $(".date")[0].value = msg.year;
                            $(".date")[1].value = msg.mon;
                            $(".date")[2].value = msg.day;
                            $(".time")[0].value = (msg.hour<10)?("0"+msg.hour):msg.hour;
                            $(".time")[1].value = (msg.min<10)?("0"+msg.min):msg.min;
                            $(".time")[2].value = (msg.sec<10)?("0"+msg.sec):msg.sec;
                            $("#service_address")[0].value = msg.ntp_addr;
                            var options = $("#select_timezone")[0].options;
                            for(var i = 0;i<options.length;i++)
                            {
                                if(options[i].text == msg.timezone)
                                {
                                    options[i].selected = true;
                                    break;
                                }
                            }
                            if(g_timer)
                            {
                                clearInterval(g_timer);
                            }

                            function set_time()
                            {
                                if(!document.getElementById("date_info"))
                                {
                                    clearInterval(g_timer);
                                    return;
                                }
                                var dom_time=$(".time"),hour=dom_time[0].value,
                                min=dom_time[1].value,sec=dom_time[2].value;
                                sec++;
                                if(sec == 60)
                                {
                                    dom_time[2].value = "00";
                                    min++;
                                    dom_time[1].value = (min<10)?("0"+min):min;
                                    if(min == 60)
                                    {
                                        hour++;
                                        dom_time[0].value=(hour<10)?("0"+hour):hour;
                                        if(hour == 24)
                                        {
                                            dom_time[0].value = 00;
                                        }
                                    }
                                }
                                else
                                {
                                    dom_time[2].value=(sec<10)?("0"+sec):sec;
                                }

                            }
                            g_timer = setInterval(set_time,950);

                            $(".list_right_button")[0].onclick = (function()
                            {
                                g_dom_loading_gif.fadeIn();
                                mcloud_agent.time_set({sn:g_playing_sn,type:g_time_type,timezone:$("#select_timezone").find("option:selected").text(),auto_sync:g_switch_flag[0],ntp_addr:$("#service_address").val(),hour:$(".time")[0].value,min:$(".time")[1].value,sec:$(".time")[2].value,year:$(".date")[0].value,mon:$(".date")[1].value,day:$(".date")[2].value},null,function(msg,ref)
                                {
                                    if(msg.result == "")
                                    {
                                        mcloud_agent.time_get({sn:g_playing_sn},null,function(msg,ref)
                                        {
                                            g_dom_loading_gif.fadeOut();
                                            if(msg.result!= "")
                                            {
                                                error_handling(msg.result);
                                            }
                                            else
                                            {
                                                var dom_date=$(".date"),dom_time=$(".time");
                                                dom_date[0].value = msg.year;
                                                dom_date[1].value = msg.mon;
                                                dom_date[2].value = msg.day;
                                                dom_time[0].value = (msg.hour<10)?("0"+msg.hour):msg.hour;
                                                dom_time[1].value = (msg.min<10)?("0"+msg.min):msg.min;
                                                dom_time[2].value = (msg.sec<10)?("0"+msg.sec):msg.sec;
                                                show_message_box({text:mcs_set_successfully});
                                            }
                                        });
                                    }
                                    else
                                    {
                                        error_handling(msg.result);
                                    }
                                });
                            });
                        }
                    });
                    break;
                }

                case "system":
                {
                		
                    mcloud_agent.upgrade_get({sn:g_playing_sn,check: 1},null,function(msg,ref)
                    {
                        g_dom_loading_gif.fadeOut();
                        if(msg.result!= 0)
                        {
                            error_handling(msg.result);
                        }
                        else if(msg.result == 0 && g_receive_flag == 13||8)
                        {
                            var dom_buttons = $(".list_right_button_ex"),dom_upload = $("#upload"),
                                dom_text = $(".attribute_value_text");
                            file_upload_class();
                            if(msg.ver_current!= msg.ver_valid)
                            {
                                dom_text[0].innerHTML = mcs_new_version+":"+msg.ver_valid+""+mcs_valid+"";
                                dom_buttons[0].style.display = "block";
                            }
                            else
                            {
                                dom_text[0].innerHTML = mcs_already_latest_version;
                                dom_buttons[0].style.display = "none";
                            }
                            $(".list_right_item")[0].style.display = "block";
                            dom_buttons[0].onclick = (function()
                            {
                                set_prompt({text:mcs_upgrade_to_ver+":"+msg.ver_valid});
                                $("#ok")[0].onclick = (function()
                                {
                                    $("#prompt_div").remove();
                                    $("#prompt").remove();
                                    var dom_update=dom_buttons[0];
                                    dom_update.value=mcs_downloading;
                                    dom_update.setAttribute("disabled",false);
                                    dom_text[0].innerHTML = "<img id = 'loading' src = 'imgs/loading2.gif'>";
                                    mcloud_agent.upgrade_set({sn:g_playing_sn},null,function(msg,ref)
                                    {
                                        if(msg.result == "")
                                        {
                                            function is_finish()
                                            {
                                                mcloud_agent.upgrade_get({sn:g_playing_sn,check:1},"",function(msg,ref)
                                                {
                                                    if(msg.status == "finish")
                                                    {
                                                        dom_update.value = mcs_upgrade_finish;
                                                        dom_update.setAttribute("disabled",false);
                                                        $("#loading").remove();
                                                        set_prompt({text:mcs_sdcard_reset});
                                                        $("#ok")[0].onclick = (function()
                                                        {
                                                            $("#prompt_div").remove();
                                                            $("#prompt").remove();
                                                            mcloud_agent.reboot({sn:g_playing_sn},null,function()
                                                            {
                                                                if(msg.result == "")
                                                                {
                                                                    $("#setup_list").remove();
                                                                    dev_list_class();
                                                                }
                                                            });
                                                        });
                                                        $("#cancel")[0].onclick = (function()
                                                        {
                                                            $("#prompt_div").remove();
                                                            $("#prompt").remove();
                                                        });
                                                    }
                                                    else
                                                    {
                                                        is_finish();
                                                    }
                                                });
                                            }
                                            is_finish();

                                        }
                                        else
                                        {
                                            error_handling(msg.result);
                                        }
                                    });
                                });
                                $("#cancel")[0].onclick = (function()
                                {
                                    $("#prompt_div").remove();
                                    $("#prompt").remove();
                                });
                            });

                            dom_buttons[1].onclick = (function()
                            {
                                mcloud_agent.dev_activate({sn:g_playing_sn,activationCode:$(".list_right_input").val()},null,function(msg,ref)
                                {
                                    if(msg.result == "")
                                    {
                                        alert_box({text:mcs_active_ok_login},function()
                                        {
                                            login_class();
                                        });

                                    }
                                    else
                                    {
                                        alert_box({text:mcs_active_fail_invalid_link});
                                    }
                                });
                            });

                            dom_buttons[2].onclick = (function()
                            {
                                set_prompt({text:mcs_restore_factory_settings_prompt,text_s:mcs_keep_network_settings});
                                $("#ok")[0].onclick = (function()
                                {
                                    var keep_extends_cofig = ($("#restore_checkbox")[0].checked)?1:0;
                                    g_dom_loading_gif.fadeIn();
                                    mcloud_agent.restore({sn:g_playing_sn,keep_extends_cofig:keep_extends_cofig},null,function(msg,ref)
                                    {
                                        if(msg.result == "")
                                        {
                                            mcloud_agent.reboot({sn:g_playing_sn},{sn:g_playing_sn},function(msg,ref)
                                            {
                                                g_dom_loading_gif.fadeOut();
                                                if(msg.result == "")
                                                {
                                                    setCookie(ref.sn,0);
                                                    show_message_box({text:mcs_set_successfully});
                                                }
                                                else
                                                {
                                                    error_handling(msg.result);
                                                }
                                            });
                                        }
                                        else
                                        {
                                            g_dom_loading_gif.fadeOut();
                                            error_handling(msg.result);
                                        }
                                    });
                                    $("#prompt_div").remove();
                                    $("#prompt").remove();
                                });
                                $("#cancel")[0].onclick = (function()
                                {
                                    $("#prompt_div").remove();
                                    $("#prompt").remove();
                                });

                            });

                            dom_buttons[3].onclick = (function()
                            {
                                set_prompt({text:mcs_do_you_want_restart});
                                $("#ok")[0].onclick = (function()
                                {
                                    $("#prompt_div").remove();
                                    $("#prompt").remove();
                                    g_dom_loading_gif.fadeIn();
                                    mcloud_agent.reboot({sn:g_playing_sn},null,function(msg,ref)
                                    {
                                        g_dom_loading_gif.fadeOut();
                                        if(msg.result == "")
                                        {
                                            show_message_box({text:mcs_set_successfully});
                                        }
                                        else
                                        {
                                            error_handling(msg.result);
                                        }
                                    });
                                });
                                $("#cancel")[0].onclick = (function()
                                {
                                    $("#prompt_div").remove();
                                    $("#prompt").remove();
                                });

                            });

                            dom_upload.mouseover(function()
                            {
                                this.style.backgroundPosition="-16px -104px ";
                            });
                            dom_upload.mouseout(function()
                            {
                                this.style.backgroundPosition="-47px -104px ";
                            });


                        }
                    });
                    break;
                }

                case "other":
                {
                    var dom_out_box = $(".out_box"),outX,evt,
                        dom_in_box = $(".in_box"),mic_flag = false,speaker_flag = false,
                        dom_circle = $(".circle"),left,top,mouseX,set_flag = 0, i,dom_value = $(".show_value");
                    dom_out_box.mousedown(function(e)
                    {
                        if(this == dom_out_box[0])
                        {
                            mic_flag = true;
                            i = 0;
                        }
                        else
                        {
                            speaker_flag = true;
                            i = 1;
                        }
                        evt = window.event||e;
                        outX = this.offsetLeft;
                        mouseX = evt.clientX;
                        dom_in_box[i].style.width = (mouseX-outX)+"px";
                        dom_circle[i].style.left = mouseX+"px";

                        dom_value[i].style.display = "block";
                        dom_value[i].innerHTML = parseInt(dom_in_box[i].offsetWidth/1.6);

                    });

                    document.onmousemove = (function(e)
                    {
                        if(mic_flag||speaker_flag)
                        {
                            evt = window.event||e;
                            mouseX = evt.clientX;
                            var value = mouseX-outX;
                            if(value >= 160)
                            {
                                dom_in_box[i].style.width = "160px";
                                dom_circle[i].style.left = outX+160+"px";
                            }
                            else if(value <= 0)
                            {
                                dom_in_box[i].style.width = "0";
                                dom_circle[i].style.left = outX+"px";
                            }
                            else
                            {
                                dom_in_box[i].style.width = value+"px";
                                dom_circle[i].style.left = mouseX+"px";
                            }

                            dom_value[i].innerHTML = parseInt(dom_in_box[i].offsetWidth/1.6);
                        }
                    });

                    document.onmouseup = (function()
                    {
                        mic_flag = false;
                        speaker_flag = false;
                        dom_value.fadeOut();
                    });

                    mcloud_agent.audio_get({sn:g_playing_sn},null,function(msg,ref)
                    {
                        g_dom_loading_gif.fadeOut();
                        if(msg.result!= "")
                        {
                            error_handling(msg.result);
                        }
                        else if(msg.result == "" && $("#other_info")[0] && g_receive_flag ==14)
                        {
                            dom_in_box[1].style.width = msg.mic_level*1.6+"px";
                            dom_in_box[0].style.width = msg.speaker_level*1.6+"px";
                            dom_circle[1].style.cssText = "left:"+(dom_out_box[1].offsetLeft+msg.mic_level*1.6)+"px;top:"+dom_out_box[1].offsetTop+"px";
                            dom_circle[0].style.cssText = "left:"+(dom_out_box[0].offsetLeft+msg.speaker_level*1.6)+"px;top:"+dom_out_box[0].offsetTop+"px";
                        }
                    });

                    mcloud_agent.cam_get({sn:g_playing_sn},null,function(msg,ref)
                    {
                        if(msg.result == "")
                        {
                            g_cam_conf = msg;
                            g_cam_conf.sn = g_playing_sn;
                            g_switch_flag[0] = (msg.flip == 0)?1:0;
                            $(".label").click();
                            if(msg.flicker_freq == 0)
                            {
                                $("#button_50hz").click();
                            }
                            else
                            {
                                $("#button_60hz").click();
                            }

                        }
                    });

                    $(".list_right_button")[0].onclick = (function()
                    {
                        g_dom_loading_gif.fadeIn();
                        g_cam_conf.flicker_freq = ($("#button_50hz")[0].style.color == "#F7F7F7")?1:0;
                        g_cam_conf.flip = ($("#label_text_left0").is(":hidden"))?0:1;
                        mcloud_agent.audio_set({sn:g_playing_sn,mic_level:parseInt(dom_in_box[1].offsetWidth/1.6),speaker_level:parseInt(dom_in_box[0].offsetWidth/1.6)},null,function(msg,ref)
                        {
                            if(msg.result!= "")
                            {
                                g_dom_loading_gif.fadeOut();
                                set_flag = 0;
                                error_handling(msg.result);
                            }
                            else
                            {
                                set_flag++;
                                if(set_flag == 2)
                                {
                                    g_dom_loading_gif.fadeOut();
                                    show_message_box({text:mcs_set_successfully});
                                    set_flag = 0;
                                }
                            }
                        });
                        mcloud_agent.cam_set(g_cam_conf,null,function(msg,ref)
                        {
                            if(msg.result!= "")
                            {
                                g_dom_loading_gif.fadeOut();
                                set_flag = 0;
                                error_handling(msg.result);
                            }
                            else
                            {
                                set_flag++;
                                if(set_flag == 2)
                                {
                                    g_dom_loading_gif.fadeOut();
                                    show_message_box({text:mcs_set_successfully});
                                    set_flag = 0;
                                }
                            }
                        });
                    });

                    $("#button_50hz").click(function()
                    {
                        this.style.cssText = "background: #22aaaa;color: #F7F7F7;";
                        $("#button_60hz")[0].style.cssText = "background: #F7F7F7;color: #22aaaa;";
                    });

                    $("#button_60hz").click(function()
                    {
                        this.style.cssText = "background: #22aaaa;color: #F7F7F7;";
                        $("#button_50hz")[0].style.cssText = "background: #F7F7F7;color: #22aaaa;";
                    });
                    break;
                }

                case "del_dev":
                {
                    $("#del_dev_button").click(function()
                    {
                        set_prompt({text:mcs_are_you_sure_delete});
                        $("#ok")[0].onclick = (function()
                        {
                            $("#prompt_div").remove();
                            $("#prompt").remove();
                            mcloud_agent.dev_del({sn:g_playing_sn},null,function(msg,ref)
                            {
                                if(msg.result!= "")
                                {
                                    error_handling(msg.result);
                                }
                                else
                                {
                                    show_message_box({text:mcs_set_successfully});
                                    mcloud_agent.devs_refresh({filter:""},null,function(msg,ref)
                                    {
                                        if(msg.result == "")
                                        {
                                            g_dev_list_info = mcloud_agent.devs.list;
                                            $("#setup_list").remove();
                                            $("#main_box").fadeIn();
                                            dev_list_class();
                                        }
                                        else
                                        {
                                            error_handling(msg.result);
                                        }
                                    });
                                }
                            });
                        });
                        $("#cancel").click(function()
                        {
                            $("#prompt_div").remove();
                            $("#prompt").remove();
                        });
                    });
                    g_dom_loading_gif.fadeOut();
                    break;
                }

                default:
                    break;
            }
        }

        document.body.style.overflowX = "auto";
        $("#dev_list").remove();
        setup_main({type:obj.type});
        setup_event();

    }

    function file_upload_class()
    {
        var l_flag    = 0,
            l_alpha   = 1.0,
            l_field_name = "dimg_content",
            iframe  = document.createElement("iframe"),
            form,
            l_file;

        function iframe_build()
        {
            var file_content, alpha = 0.01, html_text,
                doc = iframe.contentDocument || iframe.contentWindow.document;

            /* it is very important, you should not delete these tow line codes */
            try {
                doc.open();
                doc.close();
            }catch(err){}

            doc.body.style.cssText = "padding:0px;margin:0px;border:none;overflow:hidden;";
            html_text = "<form id='upf' method='post' action='/ccm/ccm_upgrade.js?dsess=1&dsess_nid=" + mcloud_agent.create_nid() + "&dimg_src=upload'"
            + " enctype='multipart/form-data' "
            + "style='padding:0px;margin:0px;border:none;width:32px;height:32px;overflow:hidden;'>"
            + "<input type='file' id='" + l_field_name +  "' hidefocus='true'"
            + " title='" + mcs_caption + "'"
            + " style='padding:0px;margin:0px;position:absolute;left:-5px;top:0px;verflow:hidden;cursor:f;"
            + "width:24px;height:24px;line-height:24px;"
            + mhack.css_alpha(alpha) + "'"
            + " name='" + l_field_name + "' "
            + "/>"
            + "</form>";

            doc.body.innerHTML = html_text;
            if(iframe.style.visibility == "hidden")
            {
                iframe.style.visibility = "";
            }

            form = doc.getElementById("upf");
            l_file = doc.getElementById(l_field_name);
            //文件更改事件
            l_file.onchange = function ()
            {
                if("" == l_file.value)
                {
                    alert_box({text:"select nothing"});
                    return;
                }
                iframe.style.visibility = "hidden";

                form.submit();
                l_flag = 1;
                g_dom_loading_gif.fadeIn();
            };
        }

        function ifame_on_load()
        {
            var doc = iframe.contentDocument || iframe.contentWindow.document;
            if (doc && ((undefined == doc.readyState) || (doc.readyState == "complete")))
            {
                if(1 == l_flag)
                {
                    var msg = doc.body.innerHTML,
                        param = null,
                        s = msg, start = s.indexOf("("), end = s.lastIndexOf(")");

                    if ((end > (start + 2))
                        && ('{' == s.charAt(start + 1))
                        && ('}' == s.charAt(end - 1))) {
                        try {
                            param = meval(s.substring(start + 1, end));
                        } catch (err) {
                            param = "error";
                        }
                    }

                    if (("error" == param) || (null == param) || (null == param.data) || ("" != param.data.ret.code))
                    {
                        alert_box({text:mcs_update_failed});
                    }
                    else
                    {
                        g_dom_loading_gif.fadeOut();
                        set_prompt({text:mcs_upgrade_successful_restart_to_take_effect});
                        $("#ok")[0].onclick = (function() {
                            $("#prompt_div").remove();
                            $("#prompt").remove();
                            mcloud_agent.reboot({sn:g_playing_sn},null,function(msg,ref)
                            {
                                g_dom_loading_gif.fadeOut();
                                if(msg.result == "")
                                {
                                    show_message_box({text:mcs_set_successfully});
                                }
                                else
                                {
                                    error_handling(msg.result);
                                }
                            });
                        });
                        $("#cancel").click(function()
                        {
                            $("#prompt_div").remove();
                            $("#prompt").remove();
                        });
                        l_flag = 0;
                    }
                    iframe_build();
                }
            }
        }
        iframe.setAttribute("id","up_iframe");
        /* must use attach to iframe */
        $("#upload")[0].appendChild(iframe);
        iframe.onload = ifame_on_load;

        iframe.style.cssText = "border:none;padding:0px;margin:0px;width:32px;height:32px;position:absolute;" +  mhack.css_alpha(l_alpha);
        iframe.title =  "upload file here";
        iframe.src = "";
        iframe_build();
    }

    function error_handling(obj)
    {
        if(obj == "accounts.pass.invalid")
        {
            if($("#admin_pwd_info")[0]||$("#visitor_pwd_info")[0])
            {
                alert_box({text:mcs_invalid_password});
                return;
            }
        }
        else if(obj == "accounts.user.offline")
        {
            alert_box({text:mcs_device_offline},function()
            {
                $("#back_to_list").click();
            });

        }
        else if(obj == "permission.denied")
        {
            alert_box({text:mcs_permission_denied});
        }
        else if(obj == "InvalidSession")
        {
            alert_box({text:mcs_connection_is_interrupted},function()
            {
                $("#page")[0].innerHTML="";
                login_class();
            });

        }
        else
        {
            alert_box({text:obj});
        }

    }

    function create_mme(obj)
    {
        var panel,
            ua = navigator.userAgent.toLowerCase(),
            server_device,
            mme_params, url_params = (location.search || location.hash || "");

        panel = obj.dom;
        panel.style.width = obj.dom.offsetWidth + "px";
        panel.style.height = obj.dom.offsetHeight + "px";
        server_device = g_location_host;

        if(server_device == "96.46.4.26")
        {
            mme.prototype.types.install.codebase = navigator.platform == "MacIntel"?"http://us.mipcm.com/mme/npmme.pkg?0.140523.pkg":"http://us.mipcm.com/mme/mme.exe?0.140523.exe";
        }
        else
        {
            mme.prototype.types.install.codebase = navigator.platform == "MacIntel"?"http://dl.mipcm.com:7080/mme/npmme.pkg?0.140523.pkg":"http://dl.mipcm.com:7080/mme/mme.exe?0.140523.exe";
        }

        mme.prototype.types.flash.install_url = "mme/mme.swf?0.130715.swf";
        mme_params = {parent:panel, params:"{key:'data:application/octet-stream;base64,NGO/Mnqt7aXYO3hdsIe87bCTuqTRRSPMwJGuT26CuSedGTi2h7wroHY0IZObBPKYA/exp+e/efFj35sLiDKQpRfRFz8Th8zlYtrYki24JiN7vpGb2bUN9nY7quZ56SicUoqLd+KcCrvWheZ5NaE+slPpCg+F+hUdhNl4JXbVxzx5U6jS92D/SBoDfpMTvF8n3ELgtVFOm3VG+22f97jzrRT22WqSzmmwsM5CNX3cwVfeM5vSPVzeo/kw0ERT9k1mdqG1lScyhMuYsgrWZ0zQSKUni7AUUoiO8qqSfW28XR6CJgp5/JiLHa0kAQtVCVxm886cpuLLUn2SJCHQwS985Fd6PH49IhI+ZgKK5NA+LX+qV3tHHkGdt0C+4n7AMOxHGB+iqepOiK13Bm3YkX7BB9uR80IAltc5YVA0CWg/jog8cCETr1pWm8XngSP4pJa4ZwJq5VuPcBKDTYzqXPJsnIDpZ7L+oz457Ysz+Cc7N7keTCXuI3aFPOjxvdAdCQqKb0Hra3LuxCr5FCfZxx/mn1rddD24Ol74WXtfRJqDs8K/zYpWMnuLU7NjTNdJGMjDs2zYpq56Vd2gq0sS+yyHyhvU4lcIxT05+YfiDMSznuF4BQuKyK7yxa0X73GjUNZFxV3lqIkGKWXjMf4rv4RyE2j1mEqgqGuAW+s2PZ35xOE'}",
            on_event:function(e){on_plug_event(e);},
            ref_obj:obj,
            debug:(0  <= url_params.indexOf("debug = 1"))};

        if(ua.match(/windows|win32/))
        {
            if(0  <= url_params.indexOf("windowless = 0"))
            {
                mme_params.windowless = false;
            }
            else if(0  <= url_params.indexOf("windowless = 1"))
            {
                mme_params.windowless = true;
            }
        }

        //mme_params.windowless = false;
        obj.inner_window_info.mme = new mme(mme_params);
        g_playing_mme = obj.inner_window_info.mme;
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
            g_dom_loading_gif.fadeOut();
        }
        else if(obj.type == "ready")
        {
            var proto = obj.ref_obj.protocol;
            if(obj.plug.type.name == "flash")
            {
                proto = "rtmp";
            }
            else
            {
                if(proto == "auto")
                    proto = "rtdp";
            }

            mcloud_agent.play({sn:g_playing_sn,protocol:proto,token:getCookie("token")},{obj:obj.ref_obj},function(msg,ref)
            {
                if(msg.result!= "")
                {
                    error_handling(msg.result);
                }
                else
                {
                    g_dom_loading_gif.fadeOut();
                    g_playing_url = msg.url;
                    if(ref.obj.page == "home")
                    {
                        chl_video_create({type:"play",url:g_playing_url, params:"", inner_window_info:ref.obj.inner_window_info});
                    }
                    else if(ref.obj.page == "playback")
                    {
                        chl_video_create({type:"playback",url:g_play_back_url, params:"", inner_window_info:ref.obj.inner_window_info});
                    }

                    if($("#help_switch")[0]&&$("#setting_page").is(":hidden"))
                    {
                        create_rotation_point();
                    }
                }
            });


        }
        else if(obj.type == "license")
        {
            alert_box({text:"license is invalid"});
        }
    }

    function chl_video_create(obj)
    {
        var url = obj.url, chl_params = (obj.type == "publish")?"":",thread:\"istream\", jitter:{max:3000}"/* for old version's mme plugin */,
            trans_params = (obj.type == "play")?",trans:[{flow_ctrl:\"jitter\",thread:\"istream\"}]":
                ((obj.type == "playback")?",trans:[{flow_ctrl:\"delay\",thread:\"istream\"}]":"");
        //obj.inner_window_info.mme.destroy();
        obj.inner_window_info.video_chls = obj.inner_window_info.mme.chl_create({
            params:("{"+((obj.type=="publish")?"dst":"src")+":[{url:\""+url+"\"}]"+trans_params+chl_params+"}")});
		
		obj.inner_window_info.mme.ctrl(obj.inner_window_info.video_chls,"speaker.mute","{value:1}");
		
		
        if((obj.type == "playback"))
        {
            setTimeout(function(){
                obj.inner_window_info.mme.ctrl(obj.inner_window_info.video_chls, "play", "{}");
            }, 1000);
        }
    }

    function chl_audio_create(obj)
    {
        var url = obj.url, chl_params = "";
        obj.inner_window_info.audio_chls = obj.inner_window_info.mme.chl_create({
            params:("{src:[{url:'mic://0',type:'audio'}], dst:[{url:'" + url + "'}]" + (("" != chl_params)?",":"") + chl_params + "}")});
        if(obj.inner_window_info.audio_chls !== null)
        {
        }
    }

    function show_message_box(obj)
    {
        var dom_message = $("#message_box");
        if(!dom_message[0])
        {
            var message = document.createElement("div");
            message.setAttribute("id","message_box");
            document.getElementById("page").appendChild(message);
            dom_message = $(message);
        }
        dom_message.html(obj.text);
        dom_message.fadeIn(1000);
        dom_message.fadeOut(2000);
    }
    
    function alert_box(obj,call_back)
    {
   		var dom_alert = $("#alert_box"),dom_back = $("#alert_back");
    	if(!dom_alert[0])
    	{
            var alert_box = document.createElement("div");
            alert_box.setAttribute("id","alert_box");
            alert_box.innerHTML = "<div id = 'alert_main'><div id = 'alert_main_text'>"+obj.text+"</div></div>"
            +"<div id = 'alert_bottom'>"
                +"<input type = 'button' id = 'confirm' value = '"+mcs_action_ok+"'>"
            +"</div>";
            var dom_page = $("#page");
            dom_page.append(alert_box);

            dom_alert = $(alert_box);
            dom_back = $(create_dom("alert_back",alert_box));
    	}
        else
        {
            dom_alert.show();
            dom_back.show();
        }
    	$("#alert_main_text").html(obj.text);
        $("#confirm").click(function()
        {
            dom_alert.hide();
            dom_back.hide();
            if(call_back)
            {
                call_back();
            }

        });
    			
    }

    function set_prompt(obj)
    {
        var prompt_div = document.createElement("div"),
            prompt = document.createElement("div"),dom_page = $("#page"),dom_main;
        prompt.innerHTML="<div id='p_main'><div id = 'p_main_text'>"+obj.text+"</div></div>"
        +"<div id = 'p_bottom'>"
            +"<input type = 'button' id = 'ok' value = '"+mcs_ok+"'>"
            +"<input type = 'button' id = 'cancel' value = '"+mcs_action_cancel+"'>"
        +"</div>";


        prompt_div.setAttribute("id","prompt_div");
        prompt.setAttribute("id","prompt");

        dom_page.append(prompt);
        dom_page.append(prompt_div);
        dom_main = $("#p_main");

        if(obj.text_s)
        {
            var select = document.createElement("div");
            select.innerHTML = "<input type = 'checkbox' checked = 'true' id = 'restore_checkbox'>"
                +"<span id = 'restore_select_text'>"+obj.text_s+"</span>";
            select.setAttribute("id","restore_select");

            prompt.insertBefore(select,$("#p_bottom")[0]);
            dom_main.css("height","110px");
        }

    }

    function show_photo(obj)
    {
        var photo_box,photo,close;
        photo_box = document.createElement("div");
        photo = document.createElement("div");
        close = document.createElement("div");
        photo_box.setAttribute("class","photo_box");
        photo.setAttribute("class","photo_img");
        close.setAttribute("class","close_img");
        photo_box.appendChild(photo);
        photo_box.appendChild(close);
        $("#play_box")[0].appendChild(photo_box);
        obj.onload = (function()
        {
            photo_box.style.display="block";
            photo.style.backgroundImage = "url("+obj.src+")";
            g_dom_loading_gif.fadeOut();
            $("#photograph").css("background-position","-153px -49px");
        });
        close.onmouseover = (function()
        {
            this.style.backgroundPosition="0 -128px";
        });
        close.onmouseout = (function()
        {
            this.style.backgroundPosition="-32px -128px";
        });
        close.onclick = (function()
        {
            $(".photo_box").remove();
        });
        document.onclick =(function(e)
        {
            var dom_photo_box=$(".photo_box");
            if(dom_photo_box[0]&&!click_in_box(e,dom_photo_box))
            {
                $(".photo_box").remove();
                document.onclick = "";
            }
        });
    }
//写cookies

    function setCookie(name,value)
    {
        var Days = 30;
        var exp = new Date();
        exp.setTime(exp.getTime()+Days*24*60*60*1000);
        document.cookie = name+"="+ escape (value)+";expires=" + exp.toGMTString();
    }

//读取cookies
    function getCookie(name)
    {
        var arr,reg = new RegExp("(^| )"+name+"=([^;]*)(;|$)");

        if(arr = document.cookie.match(reg))

            return unescape(arr[2]);
        else
            return null;
    }

//删除cookies
    function delCookie(name)
    {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = getCookie(name);
        if(cval!= null)
            document.cookie = name + "="+cval+";expires="+exp.toGMTString();
    }

    function input_time_change(obj)
    {
        if(obj.type == "string")
        {
            return  obj.data.substring(obj.data.indexOf(":"),0)*60*60+obj.data.substring(obj.data.indexOf(":")+1,obj.data.length)*60;
        }
        else if(obj.type == "int")
        {
            var hour,Minute;
            hour = parseInt(obj.data/3600);
            Minute = (obj.data%3600)/60;
            if(hour<10)
            {
                hour = "0"+hour;
            }
            if(Minute<10)
            {
                Minute = "0"+Minute;
            }
            return hour+":"+Minute;
        }
    }

    function create_dom(id,before_dom)
    {
        var div = document.createElement("div");
        div.setAttribute("id",id);
        $(div).insertAfter(before_dom);
        return div;
    }
    
    function create_dom_in(id,parent_dom)
    {
        var div = document.createElement("div");
        div.setAttribute("id",id);
        $(parent_dom).append(div);
        return div;
    }

    function help_page()
    {
        var dom_help,srv = g_location_host,
            user = $("#sign_in_name").val(),
            password = $("#sign_in_pwd").val();
        dom_help = create_dom("help_box",$("#menu_box"));
        dom_help.innerHTML = "<div id = 'link_way_sp'>"
        +"<div class = 'normal_div'>"
        +"<div class = 'normal_ico' style='background-position:-510px 0px'></div>"
        +"<span class = 'normal_text'>"+mcs_device_id+":"+$("#sign_in_name").val()+"</span>"
        +"</div>"
        +"<div class = 'special_div'>"
        +"<img src = 'imgs/loading2.gif' class = 'loading_ico'>"
        +"<span class = 'normal_text'>"+mcs_state_wait_device_online+"</span>"
        +"</div>"
        +"<div class = 'install_step'>"
        +"<span class = 'normal_text'>"+mcs_installation_steps+":</span>"
        +"<p>"+mcs_step1_check_connect+"</p>"
        +"<p>"+mcs_step2_check_connect+"</p>"
        +"<p>"+mcs_third_step+")</p>"
        +"</div>"
        +"<div id='tip_info'>"
        +"<div  class = 'tip_ico'></div>"
        +"<span class = 'tip_text'>"+mcs_hint_check_network+"</span>"
        +"</div>"
        +"</div>";

        
        function is_online()
        {
            mcloud_agent.sign_in({srv:srv,user:user,password:password}, {user:user,password:password},
                function(msg,ref)
                {
                    if(msg.result == "")
                    {
                        if(ref.user.length == 13&&ref.user.substring(0,1) == "1"&&g_login_type!= "IPC")
                        {
                            g_login_type = "dev";
                            if(ref.user.substring(0,3) == "166")
                            {
                                g_dev_type = "inactive";
                            }
                        }
                        mmq_pick_ack();
                        setCookie("name",ref.user);
                        setCookie("pass",ref.password);
                        g_sign_in_flag = true;
                        $("#me").attr("disabled",false);
                        setTimeout(dev_list_class,1000);
                    }
                    else
                    {
                        is_online();
                    }
                });
        }

        is_online();
    }

    function change_password()
    {
        create_dom("add_dev_box",$("#menu_box"));
        add_dev_class({run:"add"});
    }

    function check_user_and_pass_length(user,pass)
    {
        var user_length=user.length,pass_length=pass.length;
        if(user == ""||user == mcs_username_or_device_id)
        {
            g_dom_loading_gif.fadeOut();
            alert_box({text:mcs_blank_username});
            return;
        }
        else if(pass == ""||pass == mcs_password)
        {
            g_dom_loading_gif.fadeOut();
            alert_box({text:mcs_blank_password});
            return;
        }
        else if(user_length<6||user_length>20)
        {
            g_dom_loading_gif.fadeOut();
            alert_box({text:mcs_user_letter_range_hint});
            return;
        }
        else if(pass_length<6||user_length>20)
        {
            g_dom_loading_gif.fadeOut();
            alert_box({text:mcs_password_range_hint});
            return;
        }
    }

    function check_password(one_pass,two_pass,other_pass)
    {
        var one_pass_length=one_pass.length,two_pass_length=two_pass.length,other_pass_length;
        if(!other_pass)
        {
            other_pass=true;
            other_pass_length=6;
        }
        else
        {
            other_pass_length=other_pass.length;
        }
        if(!one_pass||!two_pass||!other_pass)
        {
            g_dom_loading_gif.fadeOut();
            alert_box({text:mcs_blank_password});
            return false;
        }
        else if(one_pass!=two_pass)
        {
            g_dom_loading_gif.fadeOut();
            alert_box({text:mcs_two_password_input_inconsistent});
            return false;
        }
        else if(one_pass_length<6||one_pass_length>20||two_pass_length<6||two_pass_length>20||other_pass_length>20)
        {
            g_dom_loading_gif.fadeOut();
            alert_box({text:mcs_password_range_hint});
            return false;
        }
        else
        {
            return true;
        }


    }

    Date.prototype.Format = function(fmt)
    {
        var o = {
            "M+" : this.getMonth()+1,                 //月份
            "d+" : this.getDate(),                    //日
            "h+" : this.getHours(),                   //小时
            "m+" : this.getMinutes(),                 //分
            "s+" : this.getSeconds(),                 //秒
            "q+" : Math.floor((this.getMonth()+3)/3), //季度
            "S"  : this.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o)
            if(new RegExp("("+ k +")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        return fmt;
    };

    function getLeft(e)
    {
        var offset = e.offsetLeft;
        if(e.offsetParent != null) offset += getLeft(e.offsetParent);
        return offset;
    }

    function check_wifi_stat()
    {
        mcloud_agent.net_get({sn:g_playing_sn},null,function(msg,ref)
        {
            if(msg.result!= "")
            {
                error_handling(msg.result);
            }
            else
            {
                if(msg.networks[1].wifi_client.info.stat == "ok")
                {
                    var dom_text=$(".attribute_value_text");
                    g_dom_loading_gif.fadeOut();
                    $("#wifi_link_stat").text(mcs_connection_successfully +"!");
                    $("#wifi_link_stat").fadeOut(1000);
                    g_wifi_connection="finish";
                    g_wifi_connection_time=0;

                    if(dom_text[0])
                    {
                        dom_text[3].innerHTML =  msg.networks[1].ipv4.info.ip.addr;
                        dom_text[4].innerHTML = msg.networks[1].ipv4.info.ip.gw;
                        dom_text[5].innerHTML = msg.networks[1].ipv4.info.ip.mask;
                    }


                }
                else /*if(msg.networks[1].wifi_client.info.stat == "info.connecting")*/
                {
                    g_wifi_connection_time++;
                    $("#wifi_link_stat").fadeIn();
                    g_wifi_connection="connection";
                    if(g_wifi_connection_time>5)
                    {
                        g_wifi_connection="";
                        g_wifi_connection_time=0;
                        $("#wifi_link_stat").fadeOut();
                        alert_box({text:mcs_invalid_password});
                    }
                    else
                    {
                        setTimeout(check_wifi_stat,2000);
                    }

                }
            }
        });
    }

    function click_in_box(e,box)
    {
        var left=box.offset().left,right=left+box.width(),top=box.offset().top,bottom=top+box.height();
        if(e.clientX>left&&e.clientX<right&& e.clientY>top&& e.clientY<bottom)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

 	function motion_mask()
   	{
		var dom_mask_box = $("#mask_box");
		if(!dom_mask_box[0])
		{
			mcloud_agent.motion_mask_get({sn:g_playing_sn},null,function(msg, ref)
			{
				if(msg.result=="")
				{
					var dom_mask_pic ,dom_background;
					
					dom_mask_box = create_dom("mask_box",$("#bottom_box"));
					
					dom_mask_pic = document.createElement("div");
					dom_mask_pic.setAttribute("id","mask_pic");
					
					dom_background = document.createElement("div");
					dom_background.setAttribute("id","mask_bg");	
					
					dom_mask_box.appendChild(dom_mask_pic);
					dom_mask_box.appendChild(dom_background);
					
					describe_mask(dom_mask_pic,msg.conf);
				}
			});
        }
       	else
		{
			dom_mask_box.remove();
		}
       	function describe_mask(dom,conf)
       	{
         	var i, j,width,height,top,left,dom_play_box=$("#play_box_m"),
            		dom_button_box,dom_draw,dom_clean,dom_point, data=new Array();
                	
        	width = dom_play_box.width();
           	height = dom_play_box.height();
         	top=dom_play_box.offset().top;
       		left=dom_play_box.offset().left;
                
            dom.style.cssText="width:"+width+"px;height:"+height+"px;top:"+top+"px;left:"+left+"px";
            for(i=0;i<conf.pos.length;i++)
            {
            	var temp;
            	data[i]=new Array();
               	temp=conf.pos[i].bitmap;
               	for(j=0;j<=15;j++)
               	{
               		data[i][j]=temp[j];
               	}
            }
            for(i=0;i<9;i++)
            {
                for(j=0;j<16;j++)
               {
               		dom_point = document.createElement("div");
              	    dom_point.setAttribute("class","mask_point");
                    dom_point.style.cssText="width:"+(width/16-2)+"px;height:"+(height/9-2)+"px;";
                    if(conf.pos)
                    {
                      	for(var k=0;k<conf.pos.length;k++)
	                   {
	                      	if(conf.pos[k].index==i&&data[k][j]==1)
	                       	{
	                       		dom_point.style.backgroundColor="#000000";
	                       		break;
	                       	}
	                       }
                    }
                       
                    dom.appendChild(dom_point);
                }
            }
            dom_button_box=create_dom_in("mask_button_box",dom);
            
			dom_reset = create_dom_in("mask_reset",dom_button_box);
			dom_reset.innerHTML = "重置";
            dom_confirm = create_dom_in("mask_confirm",dom_button_box);
			dom_confirm.innerHTML = "确定";
            dom_cancel = create_dom_in("mask_cancel",dom_button_box);
			dom_cancel.innerHTML = "取消";
            var dom_points=$(".mask_point") , draw_flag = false;
            
            g_mask_pic_pos = $("#mask_pic").offset();

        	dom_points.mousedown(function(e)
          	{
      			var evt = window.event || e,
                        mouseX = evt.clientX,mouseY = evt.clientY,
                        x_pos,y_pos;
                
                x_pos = Math.ceil((mouseX - g_mask_pic_pos.left)/this.offsetWidth) - 1;
                y_pos = Math.ceil((mouseY- g_mask_pic_pos.top)/this.offsetHeight) - 1;
          		g_start_pos={x_pos:x_pos,y_pos:y_pos};
          		g_mouse_start_pos = {x_pos:mouseX,y_pos:mouseY};
          		draw_flag = true ;
         	});
         	
         	$("#mask_box").mousemove(function(e)
         	{
         		if(draw_flag)
         		{
         			var evt = window.event || e,
                        mouseX = evt.clientX,mouseY = evt.clientY,
                        dom_rect,max_x,max_y,min_x,min_y;
                         
                         if(!(dom_rect = $("#rect_box")[0]))
                         {
                         	dom_rect = create_dom_in("rect_box",$("#mask_box"));
                         }              
                        
                        
	               		max_x =	(g_mouse_start_pos.x_pos > mouseX) ? g_mouse_start_pos.x_pos : mouseX;
	               		min_x =	(g_mouse_start_pos.x_pos < mouseX) ? g_mouse_start_pos.x_pos : mouseX;   		
	               		max_y =	(g_mouse_start_pos.y_pos > mouseY) ? g_mouse_start_pos.y_pos : mouseY;
	               		min_y = 	(g_mouse_start_pos.y_pos < mouseY) ? g_mouse_start_pos.y_pos : mouseY;     
	               		
                        dom_rect.style.cssText = "left:"+min_x+"px; top:"+min_y+"px;width:"+(max_x-min_x)+"px;height:"+(max_y-min_y)+"px;" ;
         		}        
         	});
         	
         	$("#mask_box").mouseup(function(e)
         	{
         		if(draw_flag)
         		{
         			var evt = window.event || e,
                        mouseX = evt.clientX,mouseY = evt.clientY,
                        x_pos,y_pos;
                 
                 	draw_flag = false;
	                $("#rect_box").remove();    
	                x_pos = Math.ceil((mouseX - g_mask_pic_pos.left)/dom_point.offsetWidth) -1;
	                y_pos = Math.ceil((mouseY- g_mask_pic_pos.top)/dom_point.offsetHeight) -1;
	                
	          		g_end_pos={x_pos:x_pos,y_pos:y_pos};        
	                
	                if(g_start_pos.x_pos == g_end_pos.x_pos && g_start_pos.y_pos == g_end_pos.y_pos )
	                {
	                	var pos = g_start_pos.x_pos+16*g_start_pos.y_pos;
	                	if(dom_points[pos].style.background=="")
		          		{
		          			dom_points[pos].style.background = "#000000";
		          		}
		           		else
		           		{
		           			dom_points[pos].style.background = "";
		           		}
	                }
	                else
	               {
	               		var max_x,max_y,min_x,min_y;
	               		max_x =	(g_start_pos.x_pos > g_end_pos.x_pos) ? g_start_pos.x_pos : g_end_pos.x_pos;
	               		min_x =	(g_start_pos.x_pos < g_end_pos.x_pos) ? g_start_pos.x_pos : g_end_pos.x_pos;   		
	               		max_y =	(g_start_pos.y_pos > g_end_pos.y_pos) ? g_start_pos.y_pos : g_end_pos.y_pos;
	               		min_y = 	(g_start_pos.y_pos < g_end_pos.y_pos) ? g_start_pos.y_pos : g_end_pos.y_pos;
	               		for(var i = min_y ; i <= max_y; i++)
	               		{
	               			for(var j = min_x ; j <= max_x;j++)
	               			{
	               				if(dom_points[i*16+j].style.background == "")
	               				{
	               					dom_points[i*16+j].style.background = "#000000";
	               				}
	               				else
	               				{
	               					dom_points[i*16+j].style.background = "";
	;               			}
	               			}
	               			
	               		}
	               }
         		}
         		
         		
         	});
         	
            dom_cancel.onclick = function()
            {
             	$("#mask_box").remove();
             	$("#play_box_m").remove();
           	};
           	
           	dom_cancel.onmouseover=function()
           	{
           		this.style.background = "#22aaaa";
           	};
           	
           	dom_cancel.onmouseout=function()
           	{
           		this.style.background = "#ffffff";
           	};
        	
        	dom_confirm.onclick = function()
          	{
                var data=new Array(),i,j,count=0,pos=new Array(),mask_data=new Array(),line_counts=0;
                dom_mask_points=$(".mask_point");
                length=dom_mask_points.length;
                for(i=0;i<9;i++)
                {
                	count=0;
                	data[i]=new Array();
                	for(j=0;j<=15;j++)
                	{
                		if(dom_mask_points[i*16+j].style.backgroundColor!= "")
	                	{
	                		 data[i][j]=1;
	                		 count++;
	                	}
	                	else
	                	{
	                		data[i][j]=0;
	                	}
                	}
                	if(count!=0)
                	{
                		pos[line_counts]={index:i,bitmap:data[i]};
                		line_counts++;
                	}
		
                }
                
                if(line_counts<=5)
	            {
	            	if(line_counts==0)
	                {
	                	conf={matrix_width:16,matrix_height:9,enable:0};
	                }
	                else
	                {
	                	conf={matrix_width:16,matrix_height:9,enable:1,pos:pos};
	                }
	                set_motion_mask(conf);	
                }
                else 
                {
                	var conf_1,conf_2,pos_1 = new Array() , pos_2 = new Array();
                    for(i=0;i<line_count;i++)
                    {
                    	if(i<=5)
                    	{
                    		pos_1.push(pos[i]);
                    	}
                    	else
                    	{
                    		pos_2.push(pos[i]);
                    	}
                    	
                    }
                	conf_1 = {matrix_width:16,matrix_height:9,enable:1,pos:pos_1};
                	conf_2 = {matrix_width:16,matrix_height:9,enable:1,pos:pos_2};
                	set_motion_mask(conf_1,conf_2);
                }
			};
			
			function set_motion_mask(conf_1,conf_2)
			{
				if(!conf_2)
				{
					mcloud_agent.motion_mask_set({sn:g_playing_sn,conf:conf_1},null,function(msg, ref)
	                {
		            	if(msg.result=="")
		               	{
	                		alert_box({text:"ok"});
	                		$("#mask_box").remove();
	                		$("#play_box_m").remove();
	                	}
	                });
				}
				else
				{
					mcloud_agent.motion_mask_set({sn:g_playing_sn,conf:conf_1},null,function(msg, ref)
	                {
		            	if(msg.result=="")
		               	{
		               		mcloud_agent.motion_mask_set({sn:g_playing_sn,conf:conf_2},null,function(msg, ref)
		               		{
		               			if(msg.result=="")
		               			{
		               				alert_box({text:"ok"});
		                		$("#mask_box").remove();
		                		$("#play_box_m").remove();
		               			}
		               		});
	                		
	                	}
	                });
				}
			}
			
			
			dom_confirm.onmouseover=function()
           	{
           		this.style.background = "#22aaaa";
           	};
           	
           	dom_confirm.onmouseout=function()
           	{
           		this.style.background = "#ffffff";
           	};
			
			
			
			dom_reset.onclick = function()
			{
				dom_points.css("backgroundColor","");
			};
			
			dom_reset.onmouseover=function()
           	{
           		this.style.background = "#22aaaa";
           	};
           	
           	dom_reset.onmouseout=function()
           	{
           		this.style.background = "#ffffff";
           	};
			
		}
	}


    window.onresize = (function()
    {
        var dom_play_box = $("#play_box"),dom_history_main = $("#history_main");
        var dom_play_back_box = $("#play_back_box");
        var height = $(window).height()-130,width = parseInt(height*16/9),top = ($(window).height()-height-10)/2,left = ($(window).width()-width)/2;
        if(dom_play_back_box[0]){
            document.getElementById("play_back_box").style.cssText = "height:"+height+"px;width:"+width+"px;left:"+left+"px;top:"+top+"px;";
        }
        if(dom_play_box[0])
        {
            dom_play_box[0].style.cssText = "height:"+height+"px;width:"+width+"px;left:"+left+"px;top:"+top+"px;";
            g_dom_turn_around[0][0].style.cssText = "width:"+width*0.8+"px;height:"+height*0.15+"px;top:"+top+"px;left:"+(left+width*0.1)+"px";
            g_dom_turn_around[1][0].style.cssText = "width:"+width*0.8+"px;height:"+height*0.15+"px;bottom:"+(top+10)+"px;left:"+(left+width*0.1)+"px";
            g_dom_turn_around[2][0].style.cssText = "width:"+width*0.1+"px;height:"+height+"px;top:"+top+"px;left:"+left+"px";
            g_dom_turn_around[3][0].style.cssText = "width:"+width*0.1+"px;height:"+height+"px;top:"+top+"px;left:"+(left+0.9*width)+"px";
            g_dom_turn_around[4][0].style.cssText = "width:"+width*0.8+"px;height:"+(height*0.7)+"px;left:"+(left+width*0.1)+"px;top:"+(top+height*0.15)+"px";

            var dom_top = $("#message_top"),dom_bottom = $("#message_bottom"),
                dom_left = $("#message_left"),dom_right = $("#message_right"),
                dom_center = $("#message_center"),width = $("#play_box").width(),height = $("#play_box").height(),
                dom_top_bg = $("#message_top_bg"),dom_bottom_bg = $("#message_bottom_bg"),
                dom_left_bg = $("#message_left_bg"),dom_right_bg = $("#message_right_bg"),
                dom_center_bg = $("#message_center_bg") ;
            if(dom_top[0])
            {
                dom_top[0].style.cssText = "width:"+width*0.8+"px;height:"+height*0.15+"px;top:"+top+"px;left:"+(left+width*0.1)+"px";
                dom_top_bg[0].style.cssText = "width:"+width*0.8+"px;height:"+height*0.15+"px;top:"+top+"px;left:"+(left+width*0.1)+"px";
                dom_top.css("line-height",dom_top.height()+"px");

                dom_bottom[0].style.cssText = "width:"+width*0.8+"px;height:"+height*0.15+"px;bottom:"+(top+10)+"px;left:"+(left+width*0.1)+"px";
                dom_bottom_bg[0].style.cssText = "width:"+width*0.8+"px;height:"+height*0.15+"px;bottom:"+(top+10)+"px;left:"+(left+width*0.1)+"px";
                dom_bottom.css("line-height",dom_bottom.height()+"px");

                dom_left[0].style.cssText = "width:"+width*0.1+"px;height:"+height+"px;top:"+top+"px;left:"+left+"px";
                dom_left_bg[0].style.cssText = "width:"+width*0.1+"px;height:"+height+"px;top:"+top+"px;left:"+left+"px";
                dom_left.css("line-height",dom_left.height()+"px");

                dom_right[0].style.cssText = "width:"+width*0.1+"px;height:"+height+"px;top:"+top+"px;left:"+(left+0.9*width)+"px";
                dom_right_bg[0].style.cssText = "width:"+width*0.1+"px;height:"+height+"px;top:"+top+"px;left:"+(left+0.9*width)+"px";
                dom_right.css("line-height",dom_right.height()+"px");
                
                dom_center[0].style.cssText = "width:"+width*0.8+"px;height:"+(height*0.7)+"px;left:"+(left+dom_left.width())+"px;top:"+(dom_top.height()+top)+"px";
                dom_center_bg[0].style.cssText = "width:"+width*0.8+"px;height:"+(height*0.7)+"px;left:"+(left+dom_left.width())+"px;top:"+(dom_top.height()+top)+"px";
                dom_center.css("line-height",dom_center.height()+"px");
            }
            if(!$("#setting_page").is(":hidden"))
            {
                for(var i = 0;i<5;i++)
                {
                    g_dom_turn_around[i].css("display","none");
                }
            }

        }
        else if(dom_history_main[0])
        {
            dom_history_main.css("height",$(window).height()-100+"px");
            if($("#show")[0])
            {
                var height = $(window).height()*540/775;
                var width = $(window).width()*960/1440;
                $("#show")[0].style.cssText = "width:"+width+"px;height:"+height+"px;margin-left:"+(-width/2)+"px;";
            }
        }
    });

    document.onkeydown = function(event)
    {
        var e = event || window.event,
            dom_sign_in = $("#sign_in_button"),
            dom_confirm = $("#confirm"),
            dom_ok = $("#ok"),
            dom_next = $("#next");
        if(e && e.keyCode==13)
        { // enter 键
            if(dom_sign_in[0] && !dom_sign_in.is(":hidden"))
            {
                dom_sign_in.focus();
                dom_sign_in.click();
            }
            else if(dom_confirm[0]&&!dom_confirm.is(":hidden"))
            {
                dom_confirm.focus();
                dom_confirm.click();
            }
            else if(dom_ok[0] && !dom_ok.is(":hidden"))
            {
                dom_ok.focus();
                dom_ok.click();
            }
            else if(dom_next[0] && !dom_next.is(":hidden"))
            {
                dom_next.focus();
                dom_next.click();
            }
        }
    };

    document.ondblclick=(function()
    {
        var dom_message_box=$("#message_box_background");
        if(dom_message_box[0])
        {
            dom_message_box.fadeOut(1000,function(){
                dom_message_box.remove();
            });
            var dom_switch=$("#help_switch");
            dom_switch.text(mcs_open_tips);
            dom_switch.mouseout();
        }
    });


    window.onload = (function()
    {
        mcloud_agent.svr_dev_get(null,function(msg,ref)
        {
            if(msg.result == "")
            {
                g_login_type = msg.type;
                g_login_dev_sn = msg.sn;
            }
         	login_class();
        });

    });

})(window,document);