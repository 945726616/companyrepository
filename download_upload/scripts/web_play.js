function PlayCell( params ) {
    if(!params) return;
    this.device = params.device;
    this.windowInfo = params.windowInfo;
    this.playMME;
    this.domID = params.domID || "";
    this.parentNodeDom = params.parentNodeDom || "";
    this.definition = params.definition;
    this.mcloud_agent = new mcloud_agent();
    this.mcloud_account = new mcloud_account();
    this.index = params.index;
    this.oncall = params.oncall || function () {};
    this.errFun = params.errFun || function () {};
    this.sucFun = params.sucFun || function () {};
    this.getInfo = params.getInfo;
    this.allData = params.allData;
    this.removeID = params.removeID;
}
PlayCell.prototype.init = function (booleans) {
        if(booleans){
            var viewContent =
                "<div id='UICollectionView'>"
                + "</div>";
            jQuery("#UITestView").html(viewContent);
            console.log(this.device.pwd);
            var appendStr =
                "<div class='bigCell' data-id='"+ this.device.name +"' data-ip='"+ this.device.ip +"' data-pwd='"+ this.device.pwd +"' data-index='"+ this.index +"'>"
                + "<div id='"+ this.domID +"' class='bigUICollectionViewCell'></div>"
                + "<div class='UICollectionViewTitle' >"+ this.device.name + "</div>"
                + "</div>";
            jQuery("#UICollectionView").html(appendStr);
        }else {
            var appendStr =
                "<div class='cell' data-id='"+ this.device.name +"' data-ip='"+ this.device.ip +"' data-pwd='"+ this.device.pwd +"' data-index='"+ this.index +"'>"
                + "<div id='"+ this.domID +"' class='UICollectionViewCell'></div>"
                    + "<span class='UICollectionViewTitle' >"
                        + "<span style='display: inline-block;width: 100%;'>"
                            + "<span style='margin-left: 10px;display: inline-block;width: 45%;'>ID: " + this.device.name + "</span>"
                            + "<span style='display: inline-block;'>IP："+ this.device.ip +"</span>"
                            + "<button id='" +"removeDiv" + this.index + "' data-index='"+ this.index +"' data-id='"+ this.device.name +"' class='removeDiv'>删除</button>"
                        + "</span>"
                        + "<span style='display: inline-block;width: 100%;position: relative;'>"
                            + "<span  style='margin-left: 10px;display: inline-block;width: 45%;'>版本：<span class='dev_os_version' id='"+"dev_os_version"+ this.index + "'>"+ this.device.version +"</span></span>"
                            + "<span class='showWifiInfo' id='"+"showWifiInfo"+ this.index + "' style='display: inline-block;width: 50%;'></span>"
                        + "</span>"
                        + "<span style='display: inline-block;width: 100%;position: relative;'>"
                            + "<span style='margin-left: 10px;display: inline-block;width: 100%;'>SD：<span  class='showSDInfo' id='"+"showSDInfo"+ this.index + "' ></span></span>"
                        + "</span>"
                    + "</span>"
                    + "<div class='cellclickhover' id='"+"cellclickhover"+ this.index + "'></div>"
                    + "<span class='showWifi' id='"+"showWifi"+ this.index + "'><span style='border-bottom: 1px solid white;display: inline-block;width: 100%;height: 30px;color: greenyellow'>SSID详情（质量 / 信号）</span></span>"
                + "</div>";
            jQuery("#"+this.parentNodeDom).html(appendStr);
        }
        this.bindEvent(booleans);
    };

PlayCell.prototype.bindEvent = function (booleans) {
        var self = this;
        if (booleans){}else {
            jQuery(".cell").unbind("click").bind("click",function (event) {
                jQuery("#showProgressView > img").show();
                if(event.stopPropagation){
                    event.stopPropagation();
                }else {
                    event.cancelBubble = true;
                }
                if(event.preventDefault){
                    event.preventDefault();
                }else{
                    event.returnValue = false;
                }
                var id = jQuery(this).data("id");
                var ip = jQuery(this).data("ip");
                var pwd = jQuery(this).data("pwd");
                var index = jQuery(this).data("index");
                var obj = {
                    id : id,
                    ip : ip,
                    pwd : pwd,
                    index : index
                }
                self.oncall(obj);
            });

            jQuery("#removeDiv" + this.index).on("click",function (event) {
                if(event.stopPropagation){
                    event.stopPropagation();
                }else {
                    event.cancelBubble = true;
                }
                if(event.preventDefault){
                    event.preventDefault();
                }else{
                    event.returnValue = false;
                }
                var index = jQuery(this).data("index");
                var id = jQuery(this).data("id");
                jQuery("#device_list_li" + index).remove();
                self.removeID(id);
            });
        }
        self.allData({
            id : self.device.name,
            ip : self.device.ip,
            pwd : self.device.pwd,
            index : self.index
        });
        self.mcloud_agent.sign_in({srv: self.device.ip, user: self.device.name, password: mmd5.hex(self.device.pwd)}, null, function (msg, ref) {
            // console.log(msg);
            self.mcloud_agent.set_srv(self.device.ip);
            self.getWifiInfo(self.device.name, self.index);
            self.getSDInfo(self.device.name, self.index);
            self.getInfo(self.device.ip,self.index);
            if (msg.result === "") {
                self.sucFun(self);
                self.createMME({inner_window_info:self.windowInfo,protocol:"auto",dom:document.getElementById(self.domID)});
            }else {
                if (msg.result === "accounts.pass.invalid"){
                    jQuery("#" + self.domID).html("密码错误");
                    self.errFun(self)
                }
            }
        });
    };

PlayCell.prototype.getSDInfo = function (sn,index) {
    this.mcloud_agent.sd_get({sn:sn},null,function(msg,ref) {
        if (msg.result == "") {
            if (msg.status === "empty") {
                jQuery("#showSDInfo" + index).html("未插卡");
            } else {
                jQuery("#showSDInfo" + index).html("总容量："　+　msg.capacity +"M<span style='margin-left: 20px;'>可用：" +　msg.availableSize + "M</span><span style='margin-left: 20px;'>已用："　+　msg.usage + "M</span>");
            }
        }else {
            jQuery("#showSDInfo" + index).html("设备未登陆");
        }
    });
};

PlayCell.prototype.getWifiInfo = function(sn, index) {
    this.mcloud_agent.net_get({sn:sn},null,function(msg,ref){
        if(msg.result === ""){
            var now_ifs = msg.networks[1];
            if(now_ifs.wifi_client && typeof now_ifs.wifi_client.ap_list != "undefined") {
                var i, length, signal_level = 0;
                length = now_ifs.wifi_client.ap_list.length;
                var SSID;
                var tempN = 0;
                var singleN = 0;
                if(length > 0){
                    for(i = 0; i < length; ++i) {
                        if(now_ifs.wifi_client.ap_list[i].ssid.substring(0,3)!="ipc") {
                            if (now_ifs.wifi_client.ap_list[i].quality >= 0 && now_ifs.wifi_client.ap_list[i].quality <= 100) {
                                if (tempN < now_ifs.wifi_client.ap_list[i].quality) {
                                    tempN = now_ifs.wifi_client.ap_list[i].quality;
                                    singleN = now_ifs.wifi_client.ap_list[i].signal;
                                    SSID = now_ifs.wifi_client.ap_list[i].ssid;
                                }
                                signal_level = Math.floor(now_ifs.wifi_client.ap_list[i].quality / 20);
                                signal_level = (signal_level >= 5 ? 4 : signal_level);
                            }
                            var li = document.createElement("li");
                            li.style.borderBottom = "1px solid lightgrey";
                            li.style.color = "white"
                            li.innerHTML = "<span>" + now_ifs.wifi_client.ap_list[i].ssid + "</span><div style='float:right;margin-right:30px;'>" + now_ifs.wifi_client.ap_list[i].quality + "/" + now_ifs.wifi_client.ap_list[i].signal + "</div><img src='" + "imgs/wifi_signal" + signal_level + ".png'" + " style='position: absolute;right: 2px;width: 20px;margin-top: 5px;' />";

                            jQuery("#showWifi" + index).append(li);
                        }
                    }
                    var signalP = Math.floor(tempN / 20);
                        signalP = (signalP >= 5 ? 4 : signalP);
                    jQuery("#showWifiInfo" +　index).html("SSID: "+SSID+"<span style='margin-left: 10px;'>" + tempN + "/" + singleN+"</span><img src='" + "imgs/wifi_signal"+signalP+".png'"+" style='width: 20px;margin-left: 5px;margin-top: -5px;'/>");
                } else {
                    styleShow(index,"未搜索到wifi");
                }
            }else if(now_ifs.phy.info.status == "err"||now_ifs.phy.info.stat == "err") {
                styleShow(index,"SSID连接故障");
            }else {
                styleShow(index,"SSID连接故障");
            }
        }else {
            styleShow(index,"设备未登陆");
        }

    });
    function styleShow(index,info) {
        jQuery("#showWifi" + index).css({"display":"none"});
        jQuery("#showWifiInfo" + index).html(info);
    }
}

PlayCell.prototype.createMME = function (obj) {
        var self = this;
        var panel, server_device,mme_params,
            ua = navigator.userAgent.toLowerCase(),
            url_params = (location.search || location.hash || "");
            panel = obj.dom;
            panel.style.width = obj.dom.offsetWidth + "px";
            panel.style.height = obj.dom.offsetHeight + "px";
            server_device = location.host;
        if(server_device == "96.46.4.26") {
            mme.prototype.types.install.codebase=navigator.platform == "MacIntel"?"http://us.mipcm.com/mme/npmme.pkg?0.140523.pkg":"http://us.mipcm.com/mme/mme.exe?0.140523.exe";
        } else {
            mme.prototype.types.install.codebase=navigator.platform == "MacIntel"?"http://dl.mipcm.com:7080/mme/npmme.pkg?0.140523.pkg":"http://dl.mipcm.com:7080/mme/mme.exe?0.140523.exe";
        }
        mme.prototype.types.flash.install_url="mme/mme.swf?0.130715.swf";
        mme_params = {
            parent:panel,
            params:"{key:'data:application/octet-stream;base64,NGO/Mnqt7aXYO3hdsIe87bCTuqTRRSPMwJGuT26CuSedGTi2h7wroHY0IZObBPKYA/exp+e/efFj35sLiDKQpRfRFz8Th8zlYtrYki24JiN7vpGb2bUN9nY7quZ56SicUoqLd+KcCrvWheZ5NaE+slPpCg+F+hUdhNl4JXbVxzx5U6jS92D/SBoDfpMTvF8n3ELgtVFOm3VG+22f97jzrRT22WqSzmmwsM5CNX3cwVfeM5vSPVzeo/kw0ERT9k1mdqG1lScyhMuYsgrWZ0zQSKUni7AUUoiO8qqSfW28XR6CJgp5/JiLHa0kAQtVCVxm886cpuLLUn2SJCHQwS985Fd6PH49IhI+ZgKK5NA+LX+qV3tHHkGdt0C+4n7AMOxHGB+iqepOiK13Bm3YkX7BB9uR80IAltc5YVA0CWg/jog8cCETr1pWm8XngSP4pJa4ZwJq5VuPcBKDTYzqXPJsnIDpZ7L+oz457Ysz+Cc7N7keTCXuI3aFPOjxvdAdCQqKb0Hra3LuxCr5FCfZxx/mn1rddD24Ol74WXtfRJqDs8K/zYpWMnuLU7NjTNdJGMjDs2zYpq56Vd2gq0sS+yyHyhvU4lcIxT05+YfiDMSznuF4BQuKyK7yxa0X73GjUNZFxV3lqIkGKWXjMf4rv4RyE2j1mEqgqGuAW+s2PZ35xOE'}",
            on_event: function (e) {self.onPlugEvent(e)},
            ref_obj:obj,
            debug:(0 <= url_params.indexOf("debug=1"))
        };
        if(ua.match(/windows|win32/)) {
            if(0 <= url_params.indexOf("windowless=0")) {
                mme_params.windowless = false;
            } else if(0 <= url_params.indexOf("windowless=1")) {
                mme_params.windowless = true;
            }
        }
        obj.inner_window_info.mme = new mme(mme_params);
        self.playMME = obj.inner_window_info.mme;
    };

PlayCell.prototype.onPlugEvent = function (obj) {
        var self = this;
        if (obj.type == "ready") {
            var proto = obj.ref_obj.protocol;
            if (obj.plug.type.name == "flash") {
                proto = "rtmp";
            } else if (proto == "auto") {
                proto = "rtdp";
            }
            self.mcloud_agent.play({sn: self.device.name, protocol: proto, token: self.definition}, obj.ref_obj, function (msg, ref) {
                if (msg.result === "") {
                    self.chlVideoCreate({type: "play",url: msg.url, params: "", inner_window_info: ref.inner_window_info});
                }else {
                    jQuery("#" + self.domID).html("错误：" + msg.result);
                    self.errFun(self)
                }
            });
        }
    };

PlayCell.prototype.chlVideoCreate = function (obj) {
        var url = obj.url, chl_params = (obj.type == "publish")?"":",thread:\"istream\", jitter:{max:3000}"/* for old version's mme plugin */,
            trans_params = (obj.type == "play")?",trans:[{flow_ctrl:\"jitter\",thread:\"istream\"}]":
                ((obj.type == "playback")?",trans:[{flow_ctrl:\"delay\",thread:\"istream\"}]":"");
        obj.inner_window_info.video_chls = obj.inner_window_info.mme.chl_create({
            params:("{" + ((obj.type == "publish")?"dst":"src") + ":[{url:\"" + url + "\"}]" + trans_params + chl_params + "}")});
    };