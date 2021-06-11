function detectOS(){
    var u = navigator.userAgent;
    var OS;
    if(u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) OS = "Android";
    if(u.indexOf('iPhone') > -1 || u.indexOf('iPad')>-1) OS = "iPhone";
    if(u.indexOf('Windows') > -1) OS = "Windows";
    if(u.indexOf('Intel Mac') > -1) OS = "Mac";
    return OS;
}
function getParam(url,name){  
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
function get_download_info()
{
    var hl = getParam(location.href,"hl");
    var d_language = localStorage.getItem("language_choice_info");
    if(hl){
        nav_lang = hl;
    }
    else if(d_language){
        nav_lang = d_language;
    }else{
        nav_lang = navigator.language || navigator.browserLanguage || navigator.userLanguage || navigator.systemLanguage || "",
        nav_lang=nav_lang.toLowerCase().substr(0,2);
    }
    var OS = detectOS();    
    var download_info = [];
    var download_type = [];
    var host = window.location.host;
    host = "vimtag";
    if(host.indexOf("vimtag")>-1)
    {
        download_type = ["windows_vimtag","mac_vimtag","android_vimtag","ios_vimtag"];
        download_even(0);
    }
    function download_even(num)
    {
        if(num>3)
        {
            return;
        }
        else
        {
            mcloud_agent.get_download({srv:location.host,ver_sn: "", ver_type: download_type[num], ver_from: "v3.7.1.1607051739", lang: nav_lang}, null, function(msg,ref){
                download_info = msg.info;
                download_even(++num);
            })
        }
    }

}
function start()
{
    get_download_info()
}