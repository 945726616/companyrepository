window.onload = function () {
    nav_lang = navigator.language || navigator.browserLanguage || navigator.userLanguage || navigator.systemLanguage || "",
    nav_lang=nav_lang.toLowerCase();
    if(nav_lang){
        if(nav_lang=="zh"||nav_lang=="zh-cn"){
            nav_lang="zh"
        }else {
            nav_lang="en";
        }
    }
    if(nav_lang=="zh"){
        lang_title="应用详情";
        lang_name="vimtag";
        //lang_download="下载：200万次";
        //lang_size="大小：21.0M";
        lang_info="24小时远程监控查看直播视频。";
        lang_ios="去APP Store下载";
        lang_normal_download="下载";
        lang_fast_download="去Google Play下载";
        android_download="http://61.147.109.92:7080/app/vimtag.apk";
        google_download="https://play.google.com/store/apps/details?id=com.vimtag.vimtaga&hl=en_US";
        apple_download="http://itunes.apple.com/us/app/vimtag/id1025437540?l=zh&ls=1&mt=8";
        lang_introduction_header="相关介绍";
        lang_introduction_content="Vimtag是一款云端监控服务软件，本款软件配合云端摄像头使用，让用户随时随地的查看视频资讯，我们为你提供清晰、流畅的观看体验，智能的控制让你随时关爱自己的家人，喜欢的用户快来下载吧！";
    }else if(nav_lang=="en"){
        lang_title="APP INFO";
        lang_name="vimtag";
        //lang_download="Download：200";
        //lang_size="Size：21.0M";
        lang_info="24 hours remote monitoring and viewing live video.";
        lang_ios="APP Store";
        lang_normal_download="Download";
        lang_fast_download="Google Play";
        android_download="http://96.46.4.26:7080/app/vimtag.apk";
        google_download="https://play.google.com/store/apps/details?id=com.vimtag.vimtaga&hl=en_US";
        apple_download="http://itunes.apple.com/us/app/vimtag/id1025437540?l=zh&ls=1&mt=8";
        lang_introduction_header="Introduction";
        lang_introduction_content="Vimtag is a cloud monitoring service software, the software with the cloud camera, let users see video information anytime, anywhere, we provide you with clear, smooth viewing experience, intelligent control let you care for your family, like the user to download!";
    }

    document.title=lang_title;
    document.getElementById("app-name").innerHTML=lang_name;
    //document.getElementsByClassName("app-download")[0].innerHTML=lang_download;
    
    document.getElementsByClassName("app-description")[0].innerHTML=lang_info;
    document.getElementById("app-introduction-header").innerHTML=lang_introduction_header;
    document.getElementById("app-introduction-content").innerHTML=lang_introduction_content;
var u = navigator.userAgent;
if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {//安卓手机
    //alert("安卓手机");
    // window.location.href = "mobile/index.html";
    if(nav_lang=="zh"){
        document.getElementsByClassName("app-size")[0].innerHTML="大小：11.3M";
    }else{
        document.getElementsByClassName("app-size")[0].innerHTML="Size：11.3M";
    }
    document.getElementById("btn-download-wrapper").innerHTML="<a href='javascript:;' class='btn-normal' id='btn-normal-download'></a>"
    +"<a href='javascript:;' class='btn-strong normal' id='btn-fast-download'>"
    +"<div class='downloading status'>"
    +"<div class='progress'>"
    +"<div class='bar' style='width:80%'></div>"
    +"</div>"
    +"<div class='text' id='downloading-text'></div></div>"
    +"<div class='normal status'>"
    +"<div class='text'>"
    +"<span id='normal-text'></span>"
    +"</div></div></a>";
    document.getElementById("btn-normal-download").innerHTML=lang_normal_download;
    document.getElementById("normal-text").innerHTML=lang_fast_download;
    bnd = document.getElementById("btn-normal-download");
    bnd.onclick=function(){
        window.location.href = android_download;
    }
    bfd = document.getElementById("btn-fast-download");
    bfd.onclick=function(){
        window.location.href = google_download;
    }
} else if (u.indexOf('iPhone') > -1 || u.indexOf('iPad')>-1) {//苹果手机
    // window.location.href = "mobile/index.html";
    //alert("苹果手机");
    if(nav_lang=="zh"){
        document.getElementsByClassName("app-size")[0].innerHTML="大小：21.0M";
    }else{
        document.getElementsByClassName("app-size")[0].innerHTML="Size：21.0M";
    }
     document.getElementById("btn-download-wrapper").innerHTML="<a href='javascript:;' class='btn-strong normal' id='btn-fast-download'>"
    +"<div class='downloading status'>"
    +"<div class='progress'>"
    +"<div class='bar' style='width:80%'></div>"
    +"</div>"
    +"<div class='text' id='downloading-text'></div></div>"
    +"<div class='normal status'>"
    +"<div class='text'>"
    +"<span id='normal-text'></span>"
    +"</div></div></a>";
    document.getElementById("normal-text").innerHTML=lang_ios;
    if(u.indexOf('Safari')>-1){
        url=apple_download;
    }else{
        url="http://mp.weixin.qq.com/mp/redirect?url="+apple_download;
    }
    bfd = document.getElementById("btn-fast-download");
    bfd.onclick=function(){
        window.location.href = url;
    }

}else{
    document.getElementById("btn-download-wrapper").innerHTML="<a href='javascript:;' class='btn-normal' id='btn-normal-download'></a>"
    +"<a href='javascript:;' class='btn-strong normal' id='btn-fast-download'>"
    +"<div class='downloading status'>"
    +"<div class='progress'>"
    +"<div class='bar' style='width:80%'></div>"
    +"</div>"
    +"<div class='text' id='downloading-text'></div></div>"
    +"<div class='normal status'>"
    +"<div class='text'>"
    +"<span id='normal-text'></span>"
    +"</div></div></a>";
    document.getElementById("btn-normal-download").innerHTML=lang_normal_download;
    document.getElementById("normal-text").innerHTML=lang_fast_download;
    bnd = document.getElementById("btn-normal-download");
    bnd.onclick=function(){
        window.location.href = android_download;
    }
    bfd = document.getElementById("btn-fast-download");
    bfd.onclick=function(){
        window.location.href = google_download;
    }
}
}