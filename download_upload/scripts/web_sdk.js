var s_ref={
     server_device:"",
	   register_waiting_flag:1,
	   login_waiting_flag:1,
	   login_status:"",
	   now_server_sn:"",
	   service_options:"",
	   view_split_count:1,
	   playback_split_count:1,
	   notif_info:{},
	   device_list_obj:{},
	   device_list_link:createLinkList()
}

var err_cacs_system = "accounts.system",
        err_cacs_user_existed_0 = "accounts.user.existed",
        err_cacs_user_existed_1 = "User existed",
        err_cacs_user_offline_0 = "accounts.user.offline",
        err_cacs_user_offline_1 = "Device Offline",
        err_cacs_user_unknown_0 = "accounts.user.unknown",
        err_cacs_user_unknown_1 = "Invalid user",
        err_cacs_pass_invalid_0 = "accounts.pass.invalid",
        err_cacs_pass_invalid_1 = "Invalid pass",
        err_cacs_lid_invalid_0 = "accounts.lid.invalid",
        err_cacs_lid_invalid_1 = "invalid lid",
        err_cacs_sid_invalid_0 = "accounts.sid.invalid",
        err_cacs_sid_invalid_1 = "invalid sid",
        err_cacs_nid_invalid_0 = "accounts.nid.invalid",
        err_cacs_nid_invalid_1 = "invalid nid";
        
    function createLinkList(obj)
    {
        var _this = {}, first = null, temp;
        _this.length = 0;

        _this.get_first = function() {return first;}
        _this.add = function(val, priority)
        {
            var flag = priority ? priority : 0;
            var node = priority_pos(flag), prev_temp;

            for(temp = first, prev_temp = null; temp; prev_temp = temp, temp = temp.next)
            {
                if(temp.data == val)
                {
                    if(temp.priority == flag) return 1;                       //already exists
                    else
                    {
                        if(node && node.data == temp.data)
                           node = node.pre;
                        _this.del(val);
                    }
                }
            }
            if(!node)
                first = {data:val, pre:null, next:first || null, priority:flag};
            else
            {
                if(node.next)
                    node.next = (node.next.pre = {data:val, pre:node, next:node.next, priority:flag});
                else
                    node.next = {data:val, pre:node, next:node.next, priority:flag};
            }
            ++_this.length;
            return 0;
        }
        _this.del = function(val)
        {
            if(first == null) return null;
            if(first.data == val)
            {
                temp = first;
                first = first.next;
                --_this.length;
                return temp;
            }
            else
            {
                var ptemp = temp = first;
                for( ; temp; ptemp = temp, temp = temp.next)
                {
                    if(temp.data == val)
                    {
                        if(temp.next)
                            temp.next.pre = ptemp;
                        ptemp.next = temp.next;
                        --_this.length;
                        return temp;
                    }
                }
            }
        }
        function priority_pos(priority)
        {
            var prev_temp = null;
            if(!first) return first;

            for(temp = first; temp; prev_temp = temp, temp = temp.next)
            {
                if(priority > temp.priority) return prev_temp;
            }
            return prev_temp;
        }
        _this.pos = function(val)
        {
            var i = 0;
            for(temp = first; temp; temp = temp.next, ++i)
            {
                if(temp.data == val || temp.data == val.toLowerCase() || temp.data == val.toUpperCase()){
                    return i;
                }
            }
            return null;
        }
        _this.empty = function()
        {
            first = null;
            _this.length = 0;
        }
        return _this;
    }
   
var mdev_agent=(function(){
	 
     var MRetultTypeSeccess          = "MRetultTypeSeccess",
         MRetultTypeNoRespone        = "MRetultTypeNoRespone",
         MRetultTypeFormatInvalid    = "MRetultTypeFormatInvalid",
         MRetultTypePwdInvalid       = "MRetultTypePwdInvalid",
         MRetultTypeUserUnknow       = "MRetultTypeUserUnknow",
         MRetultTypeUserExist        = "MRetultTypeUserExist",
         MRetultTypePermissionDenied = "MRetultTypePermissionDenied",
         MRetultTypePwdChange        = "MRetultTypePwdChange",
         MRetultTypeOther            = "MRetultTypeOther";
         
     var MSDCtrlType = new Array("M_SDCtrlTypeFormat","M_SDCtrlTypeUmount","M_SDCtrlTypeMount","M_SDCtrlTypeRepair");
      MDevice_list = createLinkList();
      dev_msg_listene_list={};
      
    var mdev_devs=(function(obj)
    {
       var _this={},first = null, temp;
        _this.length = 0;
        
       _this.get_first = function() {return first;}
       _this.init=function()
        { 
               
        }
       _this.save=function()
        {
            
        }
       _this.reset=function()
        {
        }
       _this.getCounts=function()
        {
           return _this.length;
        }
       _this.getDevByIndex=function(index)
        {
            var i = 0;
            for(temp = first; temp; temp = temp.next, ++i)
            {
                if(index==i){
                    return temp.data;
                }
            }
            return null;
        }
       _this.getDevBySn=function(sn)
        {
            if(first.data.sn == sn)
            {  
               return first.data;
            }
            else
            {
                var ptemp = temp = first;
                for( ; temp; ptemp = temp, temp = temp.next)
                {
                    if(temp.data.sn == sn)
                    {
                        return temp.data;
                    }
                }
            }
        }
       _this.pos = function(sn)
        {
            var i = 0;
            for(temp = first; temp; temp = temp.next, ++i)
            {
                if(temp.data.sn == sn || temp.data.sn == sn.toLowerCase() || temp.data.sn == sn.toUpperCase()){
                    return i;
                }
            }
            return null;
        }
       _this.delDev=function(sn)
        {
            if(first == null) return null;
            if(first.data.sn == sn)
            {
                temp = first;
                first = first.next;
                --_this.length;
                return temp;
            }
            else
            {
                var ptemp = temp = first;
                for( ; temp; ptemp = temp, temp = temp.next)
                {
                    if(temp.data.sn == sn)
                    {
                        if(temp.next)
                            temp.next.pre = ptemp;
                        ptemp.next = temp.next;
                        --_this.length;
                        return temp;
                    }
                }
            }
        }
       _this.addDev=function(val,priority)
        {
            var flag = priority ? priority : 0;
            var node = priority_pos(flag), prev_temp;

            for(temp = first, prev_temp = null; temp; prev_temp = temp, temp = temp.next)
            {
                if(temp.data == val)
                {
                    if(temp.priority == flag) return 1;                       //already exists
                    else
                    {
                        if(node && node.data == temp.data)
                           node = node.pre;
                        _this.del(val);
                    }
                }
            }
            if(!node)
                first = {data:val, pre:null, next:first || null, priority:flag};
            else
            {
                if(node.next)
                    node.next = (node.next.pre = {data:val, pre:node, next:node.next, priority:flag});
                else
                    node.next = {data:val, pre:node, next:node.next, priority:flag};
            }
            ++_this.length;
            return 0;
        }
       _this.empty = function()
        {
            first = null;
            _this.length = 0;
        }
        function priority_pos(priority)
        {
            var prev_temp = null;
            if(!first) return first;

            for(temp = first; temp; prev_temp = temp, temp = temp.next)
            {
                if(priority > temp.priority) return prev_temp;
            }
            return prev_temp;
        }
        return _this;
    })();
    var mdev_msgs=function(obj)
    {
        var _this={};
        _this.save=function()
        {
            
        }
       _this.reset=function()
        {
            
        }
       _this.getCounts=function(){
		return _this.length;
	    }
	   _this.mdev_msg=function(msgId ){
		    return null;
	    }
	   _this.add=function( msg ){
	       return null;
	    }
	   _this.del=function( id ){
		   return null;
	    }
    }
    function hasFunction(mFirmwareVersion,fun)
    {
        switch( fun ){
		       case	INFO:
           case	NETWORK: 
		       case	OSD: 
		       case	OTHER: 
		       {
			         if (mFirmwareVersion> "13.01.01.00.00" ){
				         return true;
                     }
			         break;
               }
		       case	PLAY_BACK: 
		       case	SDCARD: 
		       case	ALARM:
		       case	ALARM_ACTION: 
		       case	DATE_TIME:
		       case	PHOTE:
		       case	RECORDING: 
		       case	PLAN_VIDEO:
		       {
			        if (mFirmwareVersion > "13.06.01.00.00"){
				         return true;
			        }
			        break;
	           }
		       case OINFO_PARAM:
		       case PUSHTASK:
		       {	
			        if (mFirmwareVersion > "13.09.01.00.00"){
				          return true;
			        }
			        break;
		       }
		       case GUEST_PASSWORD:
		       {
			        if (mFirmwareVersion > "13.10.01.00.00" ){
				         return true;
			        }
			        break;
		       }
		       default:
			         break;
		    }
		    return false;    
    }
    var class_account=(function()
    {
        var str =
        {
            idle_lid_relate_str : "idle_lid_relate_info",
            remember_msg_str    : "remember_msg_info",
            cacs_tid_str        : "cacs_tid_info"
        };
        var me = this,
            on_ack=null,
            now_handle_info       = {tid:0, lid:0, sid:0, seq:0, share_key:"", addr:""},
            temp_password         = null,
               
            auto_login            = false,
            ready_login           = false,
            login_use_local       = false,
            InvalidSession        = false,
            temporary_account,Duplicate_send_msg_ex,
            last_login={date:"",hfrom_handle:""};
			
        function deteformat(date)
        {
               year = date.getFullYear();
               year = year.toString().length < 2 ? "0" + year : year;
               month= date.getMonth() + 1;
               month= month.toString().length < 2 ? "0" + month : month;
               day = date.getDate();
               day = day.toString().length < 2 ? "0" + day : day;
               hour = date.getHours();
               hour = hour.toString().length < 2 ? "0" + hour : hour;
               minute = date.getMinutes();
               minute = minute.toString().length < 2 ? "0" + minute : minute;
               second = date.getSeconds();
               second = second.toString().length < 2 ? "0" + second : second;
               return year+""+month+""+day+""+hour+""+minute+""+second; 
        }
        function on_cacs_dh_ack(type, msg, ref)
        {
            if(msg.result == "")
            {
                var share_key = dh.gen_shared_secret(ref.secret_key, msg.key_b2a);
                local_storage.set(str.cacs_tid_str, msg.tid);
               
                set_storage_data({str:str.idle_lid_relate_str, data:{lid:msg.lid, share_key:share_key}});
                now_handle_info.tid       = msg.tid;
                now_handle_info.lid       = msg.lid;
                now_handle_info.share_key = share_key;
               
                md5password   = CryptoJS.enc.Hex.parse(temp_password);
                var password  = des_md5_encrypt(md5password, share_key);
                temp_password = null;
                send_msg("cacs_login_req", {lid:msg.lid,nid:create_nid_base_lid(ctrl({type:"get_info"})), user:ref.user, pass:password, session_req:1,param:[{name:"spv",value:"v1"}]},
                        function(type, msg, ref){on_cacs_login_ack(type, msg, ref);},
                        {ip:ref.ip, user:ref.user, lid_relate:{lid:msg.lid, share_key:share_key},pass:md5password.toString(), remember:ref.flag, to:"ccm",on_ack:ref.on_ack});
            }
        }
        function create_nid(obj)
        {
            ++ obj.seq;
            var nid = codec.nid( obj.seq, obj.sid, obj.share_key, 0, null, null, md5_ex, "hex" );
            return nid;
        }
        function create_nid_base_lid(obj)
        {
            ++ obj.seq;
            var nid = codec.nid( obj.seq, obj.lid, obj.share_key, 2, null, null, md5_ex, "hex" );
            return nid;
        }
        function md5_message_encrypt(message)
        {
            return  CryptoJS.MD5( message );
        }
        function des_md5_encrypt( md5_message, pass )
        {
            var key = CryptoJS.MD5(pass);
            var iv  = CryptoJS.enc.Hex.parse('0000000000000000');
            var des = CryptoJS.DES.encrypt(md5_message, key, {iv:iv, padding: CryptoJS.pad.NoPadding}).ciphertext.toString();
            return des;
        }
        function get_storage_data(obj)
        {
            var data_str;
            data_str = local_storage.get(obj.str);
            if(undefined == data_str || 0 == data_str.length)
                return null;
            return meval(data_str);
        }
        function set_storage_data(obj)
        {
            var data_str = codec.obj_2_str (obj.data);
            local_storage.set(obj.str, data_str);
        }
        function on_cacs_register_dh_ack(type, msg, ref)
        {
            if(msg.result == "")
            {
                var share_key = dh.gen_shared_secret(ref.secret_key, msg.key_b2a);
                local_storage.set(str.cacs_tid_str, msg.tid);
                set_storage_data({str:str.idle_lid_relate_str, data:{lid:msg.lid, share_key:share_key}});
                now_handle_info.tid       = msg.tid;
                now_handle_info.lid       = msg.lid;
                now_handle_info.share_key = share_key;
                
                var md5password   = CryptoJS.enc.Hex.parse(temp_password);
                var password = des_md5_encrypt(md5password, share_key);
                send_msg("cacs_reg_req", {lid:msg.lid, user:ref.user, pass:password, session_req:1},
                        function(type, msg, ref){on_cacs_reg_ack(type, msg, ref);},{ip:ref.ip, to:"ccm", user:ref.user,on_ack:ref.on_ack});
            }
        }
        function cacs_reg_req(obj)
        {
            var idle_lid_relate_data;
            temp_password = obj.pass;
            /*if((null == now_handle_info.share_key) || ("" == now_handle_info.share_key))
            {*/
                var secret_key = dh.gen_private();
                var pub_key = dh.gen_public(secret_key);
                send_msg("cacs_dh_req", {bnum_prime:dh.prime, root_num:dh.g, key_a2b:pub_key, tid:now_handle_info.tid},
                        function(type, msg, ref) {on_cacs_register_dh_ack(type, msg, ref);},
                        {ip:s_ref.server_device, to:"ccm", secret_key:secret_key, user:obj.user,on_ack:obj.onEvent});
           /* }
            else
            {
                var md5password   = CryptoJS.enc.Hex.parse(obj.pass);
                var password = des_md5_encrypt(md5password, now_handle_info.share_key);
                
                send_msg("cacs_reg_req", {lid:x.lid, user:obj.data.user, pass:password},
                        function(type, msg,ref){on_cacs_reg_ack(type, msg, ref);},{ip:s_ref.server_device, to:"ccm", user:obj.user,on_ack:obj.onEvent});
            }*/
        }
        function on_cacs_reg_ack(type, msg, ref)
        {
            if(!msg.result)
            {
                ref.on_ack({result:"",data:{type:"mcs_successful_whether_login",user:ref.user, password:temp_password, flag:0}}); 
            }
            else
            {
                if(msg.result == err_cacs_user_existed_0 || msg.result == err_cacs_user_existed_1)
                {
                     ref.on_ack({result:"",data:{type:"already_exists"}});
                }
            }
            s_ref.register_waiting_flag = 1;
        }
        function on_cacs_dh_req(obj) 
        {
           var  secret_key = dh.gen_private();
                var pub_key = dh.gen_public(secret_key);
                send_msg("cacs_dh_req", {bnum_prime:dh.prime, root_num:dh.g, key_a2b:pub_key, tid:tid},
                        function(type, msg, ref) {on_cacs_dh_ack(type, msg, ref);},
                        {ip:s_ref.server_device, to:"ccm", secret_key:secret_key, obj:obj});
        }
        function cacs_login_req(obj)
        {
            var idle_lid_relate_data, tid = now_handle_info.tid || local_storage.get(str.cacs_tid_str) || 0;
            now_handle_info.tid = tid;
            var user=obj;
            temp_password = user.pass;
            /*if(((null == now_handle_info.share_key) || ("" == now_handle_info.share_key))
               &&(idle_lid_relate_data = get_storage_data({str:str.idle_lid_relate_str})))
            {
                now_handle_info.lid       = idle_lid_relate_data.lid;
                now_handle_info.share_key = idle_lid_relate_data.share_key;
            }*/
            if((null == now_handle_info.share_key) || ("" == now_handle_info.share_key))
            {
                var secret_key = dh.gen_private();
                var pub_key = dh.gen_public(secret_key);
                send_msg("cacs_dh_req", {bnum_prime:dh.prime, root_num:dh.g, key_a2b:pub_key, tid:tid},
                        function(type, msg, ref) {on_cacs_dh_ack(type, msg, ref);},
                        {ip:s_ref.server_device, to:"ccm", secret_key:secret_key, user:user.user, flag:user.flag,on_ack:obj.onEvent});
            }
            else
            {
                var md5password   = md5_message_encrypt(obj.password);
                var password = des_md5_encrypt(md5password, now_handle_info.share_key);
                if(login_use_local != "used")
                    login_use_local = "use";
                send_msg("cacs_login_req", {lid:now_handle_info.lid, user:user.user, pass:password, session_req:1,param:[{name:"spv",value:"v1"}]},
                        function(type, msg, ref){on_cacs_login_ack(type, msg, ref);},
                        {ip:s_ref.server_device, user:user.user, pass:md5password.toString(), lid_relate:{lid:now_handle_info.lid,share_key:now_handle_info.share_key}, remember:user.rememberPwd, to:"ccm",on_ack:obj.onEvent});
            }
        }
        function on_cacs_login_ack(type, msg, ref)
        {
            if(msg.result == "")
            {
                s_ref.login_waiting_flag= 1;
                now_handle_info.sid  = msg.sid;
                now_handle_info.seq  = msg.seq;
                now_handle_info.addr = msg.addr;
                local_storage.set(str.idle_lid_relate_str, "");
                 
                temporary_account={user:ref.user,pass:ref.pass,lid:ref.lid_relate.lid, share_key:ref.lid_relate.share_key};
                /* if(ref.remember)
                {
                    set_storage_data({str:str.remember_msg_str, data:{user:ref.user,pass:ref.pass,lid:ref.lid_relate.lid, share_key:ref.lid_relate.share_key}});
                }*/
                var reg = /^\d/;
                if(reg.exec(ref.user))
                    s_ref.login_status = "ipc";
                else
                    s_ref.login_status = "register_user";
                ready_login = true;
                ref.on_ack({result:"",data:{ip:ref.ip}});
            }
            else
            {
                if(login_use_local == "use")
                {
                    login_use_local = "used";
                    var secret_key = dh.gen_private();
                    var pub_key = dh.gen_public(secret_key);
                    send_msg("cacs_dh_req", {bnum_prime:dh.prime, root_num:dh.g, key_a2b:pub_key, tid:local_storage.get(str.cacs_tid_str) || 0},
                            function(type, msg, ref) {on_cacs_dh_ack(type, msg, ref);},
                            {ip:s_ref.server_device, to:"ccm", secret_key:secret_key, user:ref.user,flag:ref.flag,on_ack:ref.on_ack});
                }
                else if(msg.result == err_cacs_user_offline_0 || msg.result == err_cacs_user_offline_1)
                {
                    ref.on_ack({result:"",data:{type:"mcs_offline"}});
                    s_ref.login_waiting_flag= 1;
                    return -1;
                }
                else if(msg.result == err_cacs_user_unknown_0 || msg.result == err_cacs_user_unknown_1)
                {
                    ref.on_ack({result:"",data:{type:"mcs_username_does_not_exis"}});
                    s_ref.login_waiting_flag= 1;
                    return -1;
                }
                else if(msg.result == err_cacs_pass_invalid_0 || msg.result == err_cacs_pass_invalid_1)
                {
                    ref.on_ack({result:"",data:{type:"mcs_invalid_password"}});
                    s_ref.login_waiting_flag= 1;
                    return -1;
                }
            }
        }
        function on_cacs_new_dh_req(obj)
        {
            tid = now_handle_info.tid;
            var secret_key = dh.gen_private();
              var pub_key = dh.gen_public(secret_key);
              send_msg("cacs_dh_req", {bnum_prime:dh.prime, root_num:dh.g, key_a2b:pub_key, tid:tid},
                       function(type, msg, ref) {on_cacs_new_dh_ack(type, msg, ref);},
                        {ip:s_ref.server_device, to:"ccm", secret_key:secret_key, user:obj.user,pass:obj.pass});
        }
        function on_cacs_new_dh_ack(type, msg, ref) 
        {
            if(msg.result == "")
            {
                var share_key = dh.gen_shared_secret(ref.secret_key, msg.key_b2a);
                local_storage.set(str.cacs_tid_str, msg.tid);
               
                set_storage_data({str:str.idle_lid_relate_str, data:{lid:msg.lid, share_key:share_key}});
                now_handle_info.tid       = msg.tid;
                now_handle_info.lid       = msg.lid;
                now_handle_info.share_key = share_key;
                
                var md5password=CryptoJS.enc.Hex.parse(ref.pass)    
                var password = des_md5_encrypt(md5password, share_key);

                send_msg("cacs_login_req", {lid:msg.lid,nid:create_nid_base_lid(ctrl({type:"get_info"})), user:ref.user, pass:password, session_req:1,param:[{name:"spv",value:"v1"}]},
                        function(type, msg, ref){on_cacs_new_login_ack(type, msg, ref);},
                        {ip:ref.ip, user:ref.user, lid_relate:{lid:msg.lid, share_key:share_key},pass:ref.pass, to:"ccm"});
            }
            else
            {
               
            }
        }
        function on_cacs_new_login_ack(type, msg, ref)  
        {
            if(msg.result=="")
            {
                s_ref.login_waiting_flag= 1;
                now_handle_info.sid  = msg.sid;
                now_handle_info.seq  = msg.seq;
                now_handle_info.addr = msg.addr;
                class_device.ctrl({type:"re_login"});
                return;
            }
            else
            {
                ref.on_ack({request:"",data:{type:"mcs_connection_is_interrupted"}}); 
            }
        }
        function Duplicate_send_msg(obj)
        {
                if(Duplicate_send_msg_ex.ref)
                {
                     Duplicate_send_msg_ex.ref.Repeat=true;
                }
                else
                {
                   Duplicate_send_msg_ex.ref={Repeat:true};     
                }
                if(Duplicate_send_msg_ex.send_msg)
                {
                  var data=Duplicate_send_msg_ex.data;
                  if(Duplicate_send_msg_ex.data && Duplicate_send_msg_ex.data.sess)
                  {
                       data={sess:{nid:create_nid(ctrl({type:"get_info"}))}};
                  }else if(Duplicate_send_msg_ex.data && Duplicate_send_msg_ex.data.nid)
                  {
                       data={nid:create_nid(ctrl({type:"get_info"}))};    
                  }
                   send_msg(Duplicate_send_msg_ex.type,data , Duplicate_send_msg_ex.on_ack, Duplicate_send_msg_ex.ref);
                }
                else
                {
                   send_msg_ex(Duplicate_send_msg_ex.sn,Duplicate_send_msg_ex.type, Duplicate_send_msg_ex.data, Duplicate_send_msg_ex.on_ack, Duplicate_send_msg_ex.ref);
                }    
        }
        function on_cacs_logout_ack(type, msg, ref)
        {
            if(msg.result == "")
            {
                var remember_data = get_storage_data({str:str.remember_msg_str});
                local_storage.set(str.remember_msg_str, "");
            }
            ref.on_ack({result:"", data:{create_page:"create_login_interface",type:ref.type, sn:ref.sn}});
        }
        function cacs_passwd_req(obj)
        {
            var node, node_sn, pnode, pnode_sn;

            node_sn = s_ref.now_server_sn;
            node = s_ref.device_list_obj["sn_" + node_sn];
            if(!node)
            {
                return;
            }
            if(node.isParent)
            {
                pnode = node;
                pnode_sn = node_sn;
            }
            else
            {
                pnode_sn = node.parent_sn;
                pnode = s_ref.device_list_obj["sn_" + pnode_sn];
            }
            send_msg("cacs_passwd_req", {nid:create_nid(ctrl({type:"get_info"})),
                old_pass:ctrl({type:"md5_pass", data:{pass:obj.old_pass}}),
                new_pass:ctrl({type:"md5_pass", data:{pass:obj.pass}}),guest:obj.guest?1:0},
                function(type, msg, ref){cacs_passwd_ack(type, msg, ref);}, {ip:pnode.ip, to:"ccm", sn:node_sn,guest:obj.guest?1:0});
        }
        function cacs_passwd_ack(type,msg,ref)
        {
            ref.on_ack({type:"cacs_passwd_ack",data:{type:type,msg:msg,ref:ref}});
        }
        function ctrl(obj)
        {
            switch(obj.type)
            {
                case "begin":
                    {   
                        var remember_data = get_storage_data({str:str.remember_msg_str});
                        if(remember_data)
                        {
                            var reg = /^\d/;
                            if(reg.exec(remember_data.user))
                                s_ref.login_status = "ipc";
                            else
                                s_ref.login_status = "register_user";
                            now_handle_info.lid       = remember_data.lid;
                            now_handle_info.share_key = remember_data.share_key;
                            obj.on_ack({type:"ready"});
                            now_handle_info.share_key=null;  
                        }
                        else
                        {
                            obj.on_ack({type:"ready"});
                        }
                        break;
                    }
                case "get_info":
                    {
                        return now_handle_info;
                    }
                case "account_create":
                    {
                        cacs_reg_req(obj);
                        return;
                    }
                case "signIn":
                    {
                        cacs_login_req(obj);
                        break;
                    }
                case "signOut":
                    {
                        send_msg("cacs_logout_req", {nid:create_nid(ctrl({type:"get_info"}))},
                        function(type, msg, ref){on_cacs_logout_ack(type, msg, ref);}, {ip:s_ref.server_device, to:"ccm", type:obj.data.type, sn:obj.data.sn,on_ack:obj.on_ack});
                        break;
                    }
                case "md5_pass":
                    {
                        return des_md5_encrypt(md5_message_encrypt(obj.data.pass), now_handle_info.share_key);
                    }
                case "ready_login":
                    {
                        return auto_login || ready_login;
                    }
                case "cacs_passwd_req":
                    {
                        cacs_passwd_req(obj.data);
                        break;
                    }
                case "Duplicate_send_msg":
                    {
                       Duplicate_send_msg(); 
                       break;   
                    }
                default:
                   
            }
        }
        function send_msg(type,data, on_ack, ref)
        {
            //if(type != "mmq_pick")
            //   system_signal_trans.create(type);
            rpc.call({srv:"http://" + ref.ip + "/", to:ref.to, type:type, data:data, ref:ref, "static":false, way:"json", qid:(ref.qid == null)?null:ref.qid,
                on_ack:function(msg, ref) {
                    if(type != "mmq_pick")
                    if(msg && msg.data && msg.data.ret && msg.data.ret.sub && type != "mmq_pick")
                    {
                        if(msg.data.ret.reason == "InvalidSession" || msg.data.ret.sub=="accounts.sid.invalid" || msg.data.ret.sub=="accounts.nid.invalid" || msg.data.ret.sub=="accounts.lid.invalid" || msg.data.ret.sub=="ccms.session.invalid")
                        {
                            if(msg.from_handle<last_login.hfrom_handle)
                            {
                                if(data.sess)
                                {
                                    data.sess={id:create_nid(now_handle_info)};
                                }
                                if(data.nid)
                                {
                                    data.nid=create_nid(now_handle_info); 
                                }
                                send_msg(type,data,on_ack,ref);
                            }
                            else if((deteformat(new Date())-last_login.date)>5)
                            {
                                if(type!="cacs_login_req" && type!="cacs_dh_req" && type != "mmq_pick")
                                {
                                    Duplicate_send_msg_ex={type:type,data:data,on_ack:on_ack,ref:ref,send_msg:1};
                                }
                                ms.ctrl({type:"mmq_destroy"});
                                setTimeout(function(){on_cacs_new_dh_req(temporary_account);},1000);
                            }
                            else if((deteformat(new Date())-last_login.date)<5)
                            {
                                 ref.on_ack({result:"mcs_connection_is_interrupted"});  
                            }
                        }
                        if(msg.data.ret.sub =="permission.denied")
                        {
                           on_ack({result:"permission_denied"});     
                        }
                    }
                    if(msg && msg.data && msg.data.result=="permission.denied")
                    {
                        on_ack({result:"permission_denied"});
                    }
                    if("object" == typeof(msg))
                    {
                        if(type=="cacs_login_req")
                        {
                           last_login.date = deteformat(new Date());
                           last_login.handle = msg.from_handle;
                        }
                        if(0 == system_exception_handling(msg.type, msg.data))
                            on_ack(msg.type, msg.data, ref);
                    }
                    else if("cancel" != msg)
                    {
                        if(0 == system_exception_handling(msg.type, msg.data))
                            on_ack(msg, msg, ref);
                    }
                }
            });
        }
        function send_msg_ex(sn, type, data, on_ack, ref)
        {
            var node, node_sn, pnode, pnode_sn;
            node_sn = sn;
            node = mdev_devs.getDevBySn(sn)||s_ref.device_list_obj["sn_"+sn];
            
            if(!node)
            {
                return -1;
            }
            if(node.isParent)
            {
                pnode = node;
                pnode_sn = node_sn;
            }
            else
            {
                pnode_sn = node.parent_sn;
                pnode = s_ref.device_list_obj["sn_"+pnode_sn];
            }
            data["sess"] = {nid:create_nid(now_handle_info), sn:node_sn};
               rpc.call({srv:"http://" + pnode.ip + "/", to:"ccm", type:type, data:data, ref:ref, "static":false, way:"json", qid:null,
                on_ack:function(msg, ref) {
                    
                    if(msg && msg.data && msg.data.ret && msg.data.ret.sub)
                    {
                        if(msg.data.ret.reason == "InvalidSession" || msg.data.ret.sub=="accounts.sid.invalid" || msg.data.ret.sub=="accounts.nid.invalid" || msg.data.ret.sub=="accounts.lid.invalid" || msg.data.ret.sub=="ccms.session.invalid")
                        {
                            if(msg.from_handle<last_login.hfrom_handle)
                            {
                                 send_msg(type,data ,on_ack,ref);
                            }
                            else if((deteformat(new Date())-last_login.date)>5)
                            {
                                if(type!="cacs_login_req" && type!="cacs_dh_req")
                                {
                                       Duplicate_send_msg_ex={sn:sn,type:type,data:data,on_ack:on_ack,ref:ref,send_msg:0};
                                }
                                 ms.ctrl({type:"mmq_destroy"});
                                 setTimeout(function(){on_cacs_new_dh_req(temporary_account);},1000);
                            }
                            else if((deteformat(new Date())-last_login.date)<5)
                            {
                                 on_ack(msg.type,{result:"mcs_connection_is_interrupted"},ref);  
                            }
                        } 
                        if(msg.data.ret.sub=="permission.denied")
                        {
                           on_ack(msg.type,{ret:"permission_denied"},msg.type);     
                        }
                          
                    }
                    if(msg && msg.data && msg.data.result=="permission.denied")
                    {
                        ref.on_ack(msg.type,{ret:"permission_denied"},msg.type);
                    }
                    if("object" == typeof(msg))
                    {
                        if(0 == system_exception_handling(msg.type, msg.data))
                            on_ack(msg.type, msg.data, ref);
                    }
                    else if("cancel" != msg)
                    {
                        if(0 == system_exception_handling(msg.type, msg.data))
                            on_ack(msg, msg, ref);
                    }
                }
            });
        }
        return{
          create_nid          : create_nid,
          create_nid_base_lid : create_nid_base_lid,
          get_storage_data    : get_storage_data,
          set_storage_data    : set_storage_data,
          ctrl                : ctrl,
          send_msg            : send_msg,
          send_msg_ex         : send_msg_ex,
          md5_message_encrypt : md5_message_encrypt,
          des_md5_encrypt     : des_md5_encrypt
        }  
    })();
    var class_device =(function(obj)
    {
        var me = this,
        on_ack=null,
        device_SerialNumber,device_Nick,device_Type,device_ip,
        qid,me_qid,notif_count = 0, create_mmq=true,mmq_pick_time,re_login=false;
        
        function ccm_info_get_ack(type, msg, ref)
        {
          
            if(msg && msg.ret && msg.ret.code == "")
            {
                var data_str;
                if(class_account.ctrl({type:"ready_login"}))
                {
                    var name;
                    if(msg.type == "MS")
                    {
                       s_ref.service_options=msg.type;
                       device_SerialNumber=msg.sn;
                       device_Nick=msg.nick;
                       device_Type=msg.type;
                       device_ip=ref.ip;
                       class_account.send_msg("mmq_create", {timeout:30000},
                                    function(type, msg, ref){mmq_create_ack(type, msg, ref);}, {ip:s_ref.server_device, to:"ccm",on_ack:ref.on_ack});
                       if(s_ref.login_status == "register_user")
                            s_ref.now_server_sn = msg.sn;
                    }
                    else if(msg.type == "IPC")
                    {
                        s_ref.network_environ = "private";
                        Version="";
                        s_ref.service_options=msg.type ;
                        name = msg.nick || msg.sn;
                        s_ref.device_list_link.add("sn_" + msg.sn);
                        
                        if(msg.ver!="")
                        {
                           if(msg.ver >= "13.09.14.12.30")
                           {
                                  Version =version_Category.guest_version;
                           }
                           else if(msg.ver >= "13.05.20.17.57")
                           {
                                  Version=version_Category.Schedule_recording;
                           }
                           else if(msg.ver >= "13.05.09.17.57")
                           {
                                  Version=version_Category.Version_recording;
                           }
                           else if(msg.ver>"13.04.01.01.35")
                           {
                              	  Version=version_Category.Info_version
                           }else if(msg.ver <= "13.04.01.01.35" && msg.ver > "13.01.01.01.35")
                           {
                           		  Version=version_Category.Snapshot_version;
                           }else
                           {
                                  Version=version_Category.Basic_version;   
                           }
                        }
                        else
                        {
                             Version=version_Category.Basic_version; 
                        }

                        mdev_devs.addDev({sn:msg.sn,name:name, ver:Version,type:msg.type, ip:ref.ip, cap:"",model:"",mfc:"",logo:"",pub_ip:"",url:"",
                          location:"",status:"" ,msg_id_max:0,msg_id_min:0, msg_id_cur:0,player_counts:0,sersor_status:"",wifi_status:"",sd_status:"",eth_status:"",cloud_status:"",firewall_status:""});
                                
                        class_account.send_msg("mmq_create", {timeout:30000},
                                    function(type, msg, ref){mmq_create_ack(type, msg, ref);}, {ip:s_ref.server_device, to:"ccm"});
                                    
                        ref.on_ack({result:"",data:{type:"main_page_create",server_type:msg.type, sn:msg.sn}});
                    }
                }
            }
            else
            { 
                return -1
            }
        }
        function ccm_get_sub_devices_request(obj)
        {
            if(s_ref.service_options!="IPC"){
               class_account.send_msg("ccm_devs_get", {sess:{nid:class_account.create_nid(class_account.ctrl({type:"get_info"})), sn:device_SerialNumber},
                    start:0, counts:128},
                    function(type, msg, ref){ccm_devs_get_ack(type, msg, ref);},
                    {ip:device_ip, sn:device_SerialNumber, nick:device_Nick, type:device_Type, to:"ccm",Refresh:obj.Refresh?obj.Refresh:0,on_ack:obj.on_ack});
            }
        }
        function ccm_devs_get_ack(type, msg, ref)
        {
         
            if(msg && msg.ret&& msg.ret.code == "")
            {
                var i, length, name, devices;
                if(ref.Refresh)
                {
                    s_ref.device_list_link.empty();  
                    s_ref.device_list_obj={};  
                }
                if(msg.total == 1)
                {
                    s_ref.view_split_count = s_ref.playback_split_count = 1;
                }
                name = ref.nick || ref.sn;
                
                s_ref.device_list_obj["sn_" + ref.sn] = {name:name, type:"MS", ip:ref.ip, isParent:true,
                    state:{online:"Online", view:0, recording:0, call:0, playback:0}};
                devices = msg.devs;
                if(devices)
                {
                    length = devices.length;
                    for(i = 0; i < length ; ++i)
                    {
                        name = devices[i].nick || devices[i].sn;
                        Version="";

                        if(devices[i].stat === "Online")
                            s_ref.device_list_link.add("sn_" + devices[i].sn);
                        else if(devices[i].stat === "InvalidAuth")
                            s_ref.device_list_link.add("sn_" + devices[i].sn);
                        else if(devices[i].stat === "Offline")
                            s_ref.device_list_link.add("sn_" + devices[i].sn);

                        if(devices[i].img_ver!="")
                        {
                           if(devices[i].img_ver>= "13.09.14.12.30")
                           {
                                  Version =version_Category.guest_version;
                           }
                           else if(devices[i].img_ver >= "13.05.20.17.57")
                           {
                                  Version=version_Category.Schedule_recording;
                           }
                           else  if(devices[i].img_ver >= "13.05.09.17.57")
                           {
                                  Version=version_Category.Version_recording;
                           }
                           else if(devices[i].img_ver>"13.04.01.01.35")
                           {
                              	  Version=version_Category.Info_version
                           }else if(devices[i].img_ver <= "13.04.01.01.35" && devices[i].img_ver > "13.01.01.01.35")
                           {
                           		  Version=version_Category.Snapshot_version;
                           }else
                           {
                                Version=version_Category.Basic_version;   
                           }
                        }
                        else
                        {
                             Version=version_Category.Basic_version; 
                        }
                         	
                        mdev_devs.addDev({sn:devices[i].sn,name:name, ver:Version,type:devices[i].type, ip:devices[i].addr, cap:"",model:"",mfc:"",logo:"",pub_ip:"",url:"",
                          location:"",status:devices[i].stat ,msg_id_max:0,msg_id_min:0, msg_id_cur:0,player_counts:0,sersor_status:"",wifi_status:"",sd_status:"",eth_status:"",cloud_status:"",firewall_status:""});
                                
                    }
                }
                else
                {
                   s_ref.device_list_obj["sn_" + ref.sn] = {name:name, type:"MS", ip:ref.ip, isParent:true,
                    state:{online:"Online", view:0, recording:0, call:0, playback:0}};
                }
                if(!ref.Refresh && ref.on_ack)
                {
                    ref.on_ack({result:"",data:{type:"main_page_create",server_type:ref.type, sn:ref.sn}}); 
                }else if(!re_login)
                {
                    ref.on_ack({result:"",data:{type:"refresh_device_list",data:1,sn:ref.sn}});    
                }
                if(re_login)
                {
                    re_login=false;
                    class_account.ctrl({type:"Duplicate_send_msg"});
                }
            }
            else
            {                
                return -1;
            }
        }
        function mmq_create_ack(type, msg, ref)
        { 
            if(!msg.result)
            {
                me_qid = msg.qid;
                class_account.send_msg("ccm_subscribe", {sess:{nid:class_account.create_nid(class_account.ctrl({type:"get_info"}))}},
                        function(type, msg, ref){ccm_subscribe_ack(type, msg, ref);},{ip:s_ref.server_device, to:"ccm", qid:me_qid,Refresh:ref.Refresh?ref.Refresh:0,on_ack:ref.on_ack});
            }
            else
            {
                return -1;
            }
        }
        function ccm_subscribe_ack(type, msg, ref)
        {
            if(msg && msg.ret&& msg.ret.code == "")
            {
                if(create_mmq)
                {
                   ccm_get_sub_devices_request({Refresh:ref.Refresh?ref.Refresh:0,on_ack:ref.on_ack});
                }       
                mmq_pick_req({on_ack:ref.on_ack});
            }
            else
            {
                return -1;
            }
        }
        function mmq_pick_req(obj)
        {
            if(mmq_pick_time)
            {
                  clearInterval(mmq_pick_time);
                   mmq_pick_time=null; 
            }
			
            class_account.send_msg("mmq_pick", {qid:me_qid, timeout:300000},
                    function(type, msg, ref){mmq_pick_ack(type, msg, ref);}, {ip:s_ref.server_device, to:"ccm", qid:me_qid});
             mmq_pick_time=setInterval(function(){mmq_pick_req()},330000);
        }
        function mmq_pick_ack(type, msg, ref)
        {
            if(msg && msg.result=="err.mmq.pick.duplicate")
            {
                return -1;
            }
            if(type == "mmq_pick_ack")
            {
                if(msg.result)
                {
                    create_mmq=false;
                    setTimeout(function() {
                        class_account.send_msg("mmq_create", {timeout:30000},
                                    function(type, msg, ref){mmq_create_ack(type, msg, ref);}, {ip:s_ref.server_device, to:"ccm"});
                    }, 3000);
                    return -1;
                }
            }
            else if(type == "ccm_msg")
            {
                var i, length = msg.items.length, old_count = notif_count;
                for(i = 0; i < length; ++i)
                {
                    if(msg.items && msg.items[i].msg_id)
                    {
                       dev_msg_listener_response({type:"mmq_pick",data:{result:"",data:{type:"refresh_notif_latest",now_item:msg.items[length - 1],sn:msg.items[i].msg_id}}});
                    }
                    if(msg.items[i].type == "device" && msg.items[i].code == "info")
                    {
                        for(j=0;j<msg.items[i].p.length;j++)
                        {  
                            var device_list_obj;
                            if(s_ref.device_list_obj["sn_" + msg.items[i].sn.toLowerCase()])
                                  device_list_obj = s_ref.device_list_obj["sn_" + msg.items[i].sn.toLowerCase()];
                            else if(s_ref.device_list_obj["sn_" + msg.items[i].sn.toUpperCase()])
                            	  device_list_obj = s_ref.device_list_obj["sn_" + msg.items[i].sn.toUpperCase()];
                            
                             if(msg.items[i].p[j].n == "status" &&  msg.items[i].p[j].v=="Online" )
                             {
                                s_ref.device_list_link.add("sn_" + msg.items[i].sn);
                                device_list_obj.state.online = "Online";
                             }
                             else if(msg.items[i].p[j].n == "status" &&  msg.items[i].p[j].v=="Offline")
                             {
                                  //s_ref.device_list_link.add("sn_" + msg.items[i].sn);
                                 // device_list_obj.state.online = "Offline";
                             }
                             else if(msg.items[i].p[j].n == "status" &&  msg.items[i].p[j].v=="InvalidAuth")
                             {
                               // if(!device_list_obj)return;
                               // device_list_obj.state.online = "InvalidAuth";
                             }
                             else if(msg.items[i].p[j].n == "nick" && device_list_obj)
                             {
                                var new_nick = msg.items[i].p[j].v || msg.items[i].sn.toLowerCase();
                                //device_list_obj.name = new_nick;
                             }
                             else if(msg.items[i].p[j].n == "firmware_version" && device_list_obj)
                             {
                                  Version=version_Category.Basic_version;
                                  if(msg.items[i].p[j].v!="")
                                  {
                                      if(msg.items[i].p[j].v>= "13.09.14.12.30")
                                      {
                                         Version =version_Category.guest_version;
                                      }
                                      else if(msg.items[i].p[j].v>= "13.05.20.17.57")
                                      {
                                          Version=version_Category.Schedule_recording;
                                      }
                                      else if(msg.items[i].p[j].v>"13.05.09.17.57")
                                      {
                                           Version=version_Category.Version_recording;
                                      }
                                       else if(msg.items[i].p[j].v>"13.04.01.01.35")
                                       {
                              	           Version=version_Category.Info_version; 
                                       }else if(msg.items[i].p[j].v <= "13.04.01.01.35" && msg.items[i].p[j].v > "13.01.01.01.35")
                                       {
                           		           Version=version_Category.Snapshot_version;
                                       }else
                                       {
                                           Version=version_Category.Basic_version;   
                                       }
                                  }
                                device_list_obj.Version=Version;
                             } 
                        }
                        dev_msg_listener_response({type:"mmq_pick",data:{result:"",data:{type:"refresh_device_list",data:1,sn:msg.items[i].sn}}});
                    }
                    else if(msg.items[i].type == "nick")
                    {
                        for(j=0;j<msg.items[i].p.length;j++)
                        {
                             if(msg.items[i].p[j].n == "nick")
                             {
                                var new_nick = msg.items[i].p[j].v || msg.items[i].sn.toLowerCase();

                                 if(s_ref.device_list_obj["sn_" + msg.items[i].sn.toLowerCase()])
                                    s_ref.device_list_obj["sn_" + msg.items[i].sn.toLowerCase()].name = new_nick;
                                 else if(s_ref.device_list_obj["sn_" + msg.items[i].sn.toUpperCase()])
                            	    s_ref.device_list_obj["sn_" + msg.items[i].sn.toUpperCase()].name = new_nick;
                             }
                        }
                        dev_msg_listener_response({type:"mmq_pick",data:{result:"",data:{type:"refresh_device_list",data:1,sn:msg.items[i].sn}}});
                    }
                    else if(msg.items[i].msg_id!=0)
                    {
        	           if(determine_the_version({type:"Anti",version:version_Category.Snapshot_version}))
        	           {
        	              return;
        	           }
                       if(msg.items[i].p)
                       {
                           for(j=0;j<msg.items[i].p.length;j++)
                           { 
                            
                        	   if(msg.items[i].p[j].n=="content")    
                               {
                          	       var objs=eval("(" + msg.items[i].p[j].v + ")");
                          	       if(objs.Extension){
                          	         imagings={type:"update_imaging",Brightness_value:"",Contrast_value:"",ColorSaturation_value:"", Sharpness_value:""};
                                     imagings.Brightness_value      = objs.Extension.Imaging.Brightness;
                                     imagings.Contrast_value        = objs.Extension.Imaging.Contrast;
                                     imagings.ColorSaturation_value = objs.Extension.Imaging.ColorSaturation;
                                     imagings.Sharpness_value       = objs.Extension.Imaging.Sharpness;
                                     dev_msg_listener_response({type:"mmq_pick",data:{result:"",data:imagings}});
                                   }
                                   return;
                               }
                           }
                        }
                        var msgs=new Object();
                        msgs.items=msg.items[i];
                        msg.items[i].display = 0;          
                                                    //is not a good habit
                        notif_count = 0;
                        if(!s_ref.notif_info["sn_" + msg.items[i].sn])
                        {
                            s_ref.notif_info["sn_" + msg.items[i].sn] = createLinkList();
                        }
                        s_ref.notif_info["sn_" + msg.items[i].sn].add(msgs);
                        if(msg.items[i].sn == g_ref.select_device_ipc && s_ref.now_page == "alarm")
                             dev_msg_listener_response({type:"mmq_pick",data:{type:"refresh_alarm", data:{item:msgs}}});
                        else
                        {
                            if(old_count < 99 && !mx("#alarm_search_content_tb"+msg.items[i].msg_id)) /////?
                            {
                                for(var i in s_ref.notif_info)
                                {
                                    if(s_ref.notif_info.hasOwnProperty(i))
                                    {
                                        ++notif_count;
                                    }
                                }
                            }
                            else
                                notif_count = old_count;
                        }
                    }
                }
                if(notif_count != old_count)
                {
                   //parent_callback({type:"refresh_notif",data:{notif_count:notif_count,sn:msg.sess?msg.sess.sn:null}});
                }
            }
		    mmq_pick_req();
        }
        function mmq_destroy_ack(type, msg, ref)
        {
            if(msg.result=="")
            {
                clearInterval(mmq_pick_time);
            }
        }
        function ctrl(obj)
        {
           switch(obj.type)
           {
              case "ccm_get_device":
              case "ccm_get_devices_info":
                    {
                        class_account.send_msg("ccm_info_get", {}, function(type, msg, ref){ccm_info_get_ack(type, msg, ref);}, {ip:s_ref.server_device, to:"ccm",on_ack:obj.onEvent});
                        break;
                    }
              case "Refresh_devs":
                    {
                        ccm_get_sub_devices_request({Refresh:1});
                        break;
                    }
              case "mmq_destroy":
                    {
                         class_account.send_msg("mmq_destroy", {qid:me_qid},
                                    function(type, msg, ref){mmq_destroy_ack(type, msg, ref);}, {ip:s_ref.server_device, to:"ccm", qid:me_qid});
                         break;    
                    }
              case "re_login":
                    {
                       re_login=true;
                       create_mmq=true;
                       class_account.send_msg("mmq_create", {timeout:30000},
                                    function(type, msg, ref){mmq_create_ack(type, msg, ref);}, {ip:s_ref.server_device, to:"ccm",Refresh:3});
                       break;
                    }
              case "ccm_get_sub_dvices":
                    {
                        ccm_get_sub_devices_request({});
                        break;
                    }
             default: 
           } 
        }
        return {ctrl:ctrl}
    })();
  
    function account_create(obj)
    {
        class_account.ctrl({
              type:"account_create",
              user:obj.user,
              pass:obj.pass,
              onEvent:function(msg)
              {
                 if(!msg.result)
                 {
                    if(msg.data.type=="mcs_successful_whether_login")
                    {
                        obj.onEvent({result:"",ref:obj.ref});
                    }
                    else if(msg.data.type=="already_exists")
                    {
                        obj.onEvent({result:"",ref:obj.ref});
                    }
                 }
                 else 
                 {
                    obj.onEvent({result:msg.result,ref:obj.ref});
                 }
              }
        });
    }
    function signin(obj)
    {
        class_account.ctrl({
             type:"signIn",
             user:obj.user,
             pass:obj.pass,
             rememberPwd:obj.flag,
             onEvent:function(msg)
             {
                 if(!msg.result)
                 {
                     if(msg.data.type=="mcs_offline"||"mcs_username_does_not_exis"||"mcs_invalid_password")
                     {
                         obj.onEvent({result:msg.data.type,ref:obj.ref});
                     }
                 }
                 else
                 {
                     obj.onEvent({result:msg.result,ref:obj.ref});       
                 }
             }
       }); 
    }
    function signout(obj)
    {
         class_account.send_msg("cacs_logout_req", {nid:class_account.create_nid(class_account.ctrl({type:"get_info"}))},
           function(type, msg, ref){          
               if(msg.result == "")
               {
                 obj.onEvent({result:"",ref:obj.ref});
               }
               obj.onEvent({result:"",ref:obj.ref});             
           },{ip:s_ref.server_device, to:"ccm"});
    }
    function devs_refresh(obj)
    {
        mdev_devs.empty();
        class_device.ctrl({
              type:"ccm_get_device",
              onEvent:function(msg)
              {
                if(!msg.result)
                {
                    obj.onEvent({result:"",MDevs:mdev_devs,ref:obj.ref});
                }
                else
                {
                    obj.onEvent({result:msg.result,ref:obj.ref});    
                }
              }
          });
    }
    function svr_dev_get(obj)
    { 
         class_account.send_msg("ccm_info_get", {},
          function(type, msg, ref){
               if(msg && msg.ret && msg.ret.code == "")
               {
                   obj.onEvent({result:"",server_type:msg.type, sn:msg.sn,ref:obj.ref})
               }
               else
               {
                   obj.onEvent({result:msg,ref:obj.ref});
               }
          }, {ip:obj.ip, to:"ccm"});
    }
    function account_passwd_set(obj)
    {
        var node, node_sn, pnode, pnode_sn;

            node_sn = s_ref.now_server_sn;
            node = s_ref.device_list_obj["sn_" + node_sn];
            if(!node)
            {
                log("Please select the specific device in cacs_passwd_req.");
                return;
            }
            if(node.isParent)
            {
                pnode = node;
                pnode_sn = node_sn;
            }
            else
            {
                pnode_sn = node.parent_sn;
                pnode = s_ref.device_list_obj["sn_" + pnode_sn];
            }
        var old_pass=class_account.des_md5_encrypt(CryptoJS.enc.Hex.parse(obj.old_pass), class_account.ctrl({type:"get_info"}).share_key),
            new_pass=class_account.des_md5_encrypt(CryptoJS.enc.Hex.parse(obj.pass), class_account.ctrl({type:"get_info"}).share_key);
        var  md5password   = CryptoJS.enc.Hex.parse(obj.pass);
		
        class_account.send_msg("cacs_passwd_req", {nid:class_account.create_nid(class_account.ctrl({type:"get_info"})),
           old_pass:old_pass,
           new_pass:new_pass,
           guest:obj.is_guest?1:0},
           function(type, msg, ref){
              if(msg && msg.result=="")
               {
                  obj.onEvent({result:"",ref:obj.ref}); 
               }
               else
               {
                    
               }
           }, {ip:pnode.ip, to:"ccm", sn:node_sn,guest:obj.guest?1:0});
    }
    function dev_add(obj)
    {
        var  md5password   = CryptoJS.enc.Hex.parse(obj.pass);
        var  password = class_account.des_md5_encrypt(md5password, class_account.ctrl({type:"get_info"}).share_key);
                
         class_account.send_msg_ex(s_ref.now_server_sn, "ccm_dev_add",
             {sn:obj.sn, pwd:password},
              function(type, msg, ref){
                    if(msg && msg.ret&& msg.ret.code == "")
                    {
                         obj.onEvent({result:"",info:msg.info,ref:obj.ref});    
                    }
                    else if(msg.ret.sub)
                    {
                        if(msg.ret.sub=="accounts.user.offline")
                        {
                          
                        }
                        else if(msg.ret.sub=="accounts.pass.invalid")
                        {  
                          
                        }
                        else if(msg.ret.sub=="accounts.user.invalid")
                        {  
                              
                        }
                        else if(msg.ret.sub=="ccms.system.err")
                        {
                                
                        }
                        else if(msg.ret.sub == "subdev.exceed.device")
                        {
                            
                        }
                        else if(msg.ret.sub == "subdev.exceed.user")
                        {
                 
                        }        
                    }
              });
    }
    function dev_del(obj)
    {
        class_account.send_msg_ex(obj.sn, "ccm_dev_del", {sn:obj.sn},
            function(type, msg, ref){
                if(msg && msg.ret&& msg.ret.code == "")
                {
                    obj.onEvent({result:"",ref:obj.ref});    
                }
            });
    }
    function play(obj)
    {
        var node,pnode,pnode_an,node_sn;
           
            node_sn = obj.sn;
            node = mdev_devs.getDevBySn(obj.sn);
            if(!node)
            {
                return -1;
            }
            if(node.isParent)
            {
                pnode = node;
                pnode_sn = node_sn;
            }
            else
            {
                pnode_sn = node.parent_sn;
                pnode = s_ref.device_list_obj["sn_"+pnode_sn];
            }
        
            class_account.send_msg("ccm_play", {sess:{nid:class_account.create_nid(class_account.ctrl({type:"get_info"})), sn:obj.sn},
              setup:{stream:"RTP_Unicast", trans:{proto:obj.protocol}}, token:obj.token},
              function(type, msg, ref){ 
                    if(msg && msg.ret&& msg.ret.code == "")
                    {
                        if(msg.uri && msg.uri.url)
                        {
                            obj.onEvent({result:"",url:msg.uri.url,ref:obj.ref});
                        }    
                    }else
                    {
                    	
                    }
              },{ip:pnode.ip, to:"ccm"});
    }
    function pushtalk(obj)
    {
        var node, node_sn, pnode, pnode_sn;
            node_sn =s_ref.select_device_ipc;
            node = mdev_devs.getDevBySn(obj.sn);
            if(node.isParent)
            {
                pnode = node;
                pnode_sn = node_sn;
            }
            else
            {
                pnode_sn = node.parent_sn;
                pnode = s_ref.device_list_obj["sn_" + pnode_sn];
            }
            class_account.send_msg("ccm_talk", {sess:{nid:class_account.create_nid(class_account.ctrl({type:"get_info"})), sn:node_sn},
                setup:{stream:"RTP_Unicast", trans:{proto:obj.protocol}}, token:obj.token},
                function(type, msg, ref){
                  if(msg && msg.ret&& msg.ret.code == "")
                    {
                        if(msg.uri && msg.uri.url)
                        {
                           obj.onEvent({result:"",url:msg.uri.url,ref:obj.ref});
                        }    
                    }
                    else
                    {
                        obj.onEvent({result:msg.ret,ref:obj.ref});    
                    }
                }, {ip:pnode.ip, to:"ccm"});
    }
    function record(obj)
    {
        var recording_status=1;
        class_account.send_msg_ex(obj.sn, "ccm_record_task_get", {},
              function(type, msg, ref){ccm_record_task_get_ack(type, msg, ref);}, {type:obj.data, sn:obj.sn});
        function ccm_record_task_get_ack(type, msg, ref)
        {
            if(msg && msg.ret&&msg.ret.code == "")
            {
                if(msg.sd_ready==1)
                {
                   if(/*determine_the_version({type:"Positive",version:version_Category.Version_recording})*/true)
                   {
                        if(recording_status)
                        {
                             recording_status=0;
                             msg.task.keep=60000;
                             ccm_set_recording_task_config_request(msg.task);
                             recordset_Interval=setInterval(function(){
                                 ccm_set_recording_task_config_request(msg.task);
                             },40000);
                        }
                        else
                        {
                            clearInterval(recordset_Interval);
                            recording_status=1; 
                            msg.data.task.keep = -1;
                            ccm_set_recording_task_config_request(msg.data.task);
                            adjust_recording_button_state({recording_state:"normal"});
                        }
                   }
                   else
                   {
                     if(msg.task.sch.enable && msg.task.sch.full_time)
                     {
                        msg.task.sch.enable = 0;
                        msg.task.sch.full_time = 0;
                     }
                     else
                     {
                        msg.task.sch.enable = 1;
                        msg.task.sch.full_time = 1;
                         
                     }
                     ccm_set_recording_task_config_request(msg.task);
                   }
                }                
                else if(msg.sd_ready==0)
                {
                   obj.onEvent({result:"mcs_sdcard_not_ready",ref:obj.ref});  
                }
            }
            else
            {
                return -1;
            }
        }
        function ccm_set_recording_task_config_request(obj)
        {
            var node, node_sn, pnode, pnode_sn;

            node_sn = obj.sn;
            node = mdev_devs.getDevBySn(node_sn)
            if(!node)
            {
                return;
            }
            if(node.isParent)
            {
                pnode = node;
                pnode_sn = node_sn;
            }
            else
            {
                pnode_sn = node.parent_sn;
                pnode = s_ref.device_list_obj["sn_" + pnode_sn];
            }
            class_account.send_msg("ccm_record_task_set", {sess:{nid:class_account.create_nid(class_account.ctrl({type:"get_info"})), sn:node_sn},
                task:obj},
                function(type, msg, ref){ccm_record_task_set_ack(type, msg, ref);}, {ip:pnode.ip, to:"ccm"});
        }
        function ccm_record_task_set_ack(type, msg, ref)
        {
            if(msg && msg.ret && msg.ret.code == "")
            {
                 obj.onEvent({result:"",ref:obj.ref});
            }
            else if(msg && msg.ret&& msg.ret.code == "SdIsNotReady")
            {
                 obj.onEvent({result:"",type:"normal",ref:obj.ref});  
                 return -1;
            }
            else
            {
                 obj.onEvent({result:"",type:"normal",ref:obj.ref});       
            }
        }
    }
    function playback(obj)
    {
        var pnode;
        pnode= mdev_devs(obj.sn);
        class_account.send_msg("ccm_replay", {sess:{nid:class_account.create_nid(class_account.ctrl({type:"get_info"})), sn:obj.sn},
              setup:{stream:"RTP_Unicast", trans:{proto:obj.protocol}}, token:obj.token},
              function(type, msg, ref){ 
                    if(msg && msg.ret&& msg.ret.code == "")
                    {
                        if(msg.uri && msg.uri.url)
                        {
                           obj.onEvent({result:"",url:msg.uri.url,ref:obj.ref});
                        }    
                    }
              },{ip:pnode.ip, to:"ccm"});
    }
    function ptz_ctrl(obj)
    {
	    var node, node_sn, pnode, pnode_sn, pos, str, inner_window_info;

            node_sn = obj.sn;
			node = mdev_devs.getDevBySn(node_sn);
            if(!node)
            {
                //log("Please select the specific device in relative_move_request.");
                return;
            }
            if(node.isParent)
            {
                pnode = node;
                pnode_sn = node_sn;
            }
            else
            {
                pnode_sn = node.parent_sn;
                pnode = s_ref.device_list_obj["sn_" + pnode_sn];
            }
            class_account.send_msg("ccm_ptz_ctl", {sess:{nid:class_account.create_nid(class_account.ctrl({type:"get_info"})), sn:node_sn}, token:"ptz0",
                trans:{pan_tilt:{x:obj.x, y:obj.y,}},
                speed:{pan_tilt:{x:0, y:0},
                   }},
            function(type, msg, ref){
			      if(msg && msg.ret&& msg.ret.code == "")
                   {
                       obj.onEvent({result:"",ref:obj.ref});
                   }
                   else
                   {
                       obj.onEvent({result:msg.ret,ref:obj.ref});     
                   }
		}, {ip:pnode.ip, to:"ccm"});
      
    }
    function dev_msgs_get(obj)
    {
        //
    }
    function dev_msg_listener_add(obj)
    {
        if(!dev_msg_listene_list[obj.type])
        {
           dev_msg_listene_list[obj.type]= new createLinkList();   
        }
        dev_msg_listene_list[obj.type].add({on_ack:obj.onEvent});
    }
    
    function dev_msg_listener_del(obj)
    {
        if(dev_msg_listene_list[obj.type])
        {
             for(i = dev_msg_listene_list[obj.type].get_first(); i; i = i.next)
             {
                var data =i.data;
                if(data.on_ack==obj.onEvent)
                {
                    dev_msg_listene_list[obj.type].del(data);
                }
             }
        }
    }
    function dev_msg_listener_response(obj)
    {
        if(dev_msg_listene_list[obj.type])
        {
             for(i = dev_msg_listene_list[obj.type].get_first(); i; i = i.next)
             {
                 var data = i.data;
                 data.on_ack(obj.data);
             }
        }
    }
    function pic_get(obj)
    {
        obj.onEvent({result:"",url:"http://" + s_ref.server_device + "/ccm/ccm_pic_get.jpg?hfrom_handle=887330&dsess=1&dsess_nid="+class_account.create_nid(class_account.ctrl({type:"get_info"}))+"&dsess_sn="+obj.sn+"&dtoken="+obj.token,ref:obj.ref});
    }
    function dev_passwd_set(obj)                                                                                                                                                                                                                  
    {
        var old_pass=class_account.des_md5_encrypt(CryptoJS.enc.Hex.parse(obj.old_pass), class_account.ctrl({type:"get_info"}).share_key),
            new_pass=class_account.des_md5_encrypt(CryptoJS.enc.Hex.parse(obj.pass), class_account.ctrl({type:"get_info"}).share_key);
            class_account.send_msg_ex(obj.sn, "ccm_pwd_set", {user:[{username:obj.username,
               old_pwd:old_pass,
               pwd:new_pass,
                level:"",
                guest:obj.is_guest?1:0}]},
               function(type, msg, ref){
                   if(msg && msg.ret&& msg.ret.code == "")
                   {
                       obj.onEvent({result:"",ref:obj.ref});
                   }
                   else
                   {
                       obj.onEvent({result:msg.ret,ref:obj.ref});     
                   }
               });
    }
    function dev_nick_set(obj)
    {
         class_account.send_msg_ex(obj.sn, "ccm_nick_set", {nick:obj.name}, 
         function(type, msg, ref){
              if(msg && msg.ret&& msg.ret.code == "")
              {
                 obj.onEvent({result:"",ref:obj.ref});
              }
              else
              {
                 obj.onEvent({result:msg.ret});  
              }
         });
    }
    var video_sources_token = "";
    function dev_cam_get(obj)
    {
         var brightness,contrast,color_saturation,sharpness,mode,flip,power;
           var node,pnode,pnode_an,node_sn;
           
           
            node_sn = obj.sn;

            node = mdev_devs.getDevBySn(obj.sn);
            if(!node)
            {
                return -1;
            }
            if(node.isParent)
            {
                pnode = node;
                pnode_sn = node_sn;
            }
            else
            {
                pnode_sn = node.parent_sn;
                pnode = s_ref.device_list_obj["sn_" + pnode_sn];
            }
         class_account.send_msg("ccm_video_srcs_get", {sess:{nid:class_account.create_nid(class_account.ctrl({type:"get_info"})), sn:obj.sn}},
          function(type, msg, ref){
            if(msg && msg.ret&& msg.ret.code == "")
            {
                if(msg.vss)
                {
                    if(msg.vss[0].extension && msg.vss[0].extension.conf)
                    {
                        brightness       = msg.vss[0].extension.conf.brightness;
                        contrast         = msg.vss[0].extension.conf.color_saturation;
                        color_saturation = msg.vss[0].extension.conf.contrast;
                        sharpness        = msg.vss[0].extension.conf.sharpness;
                        mode             = msg.vss[0].extension.conf.mode;
                    }  
                    video_sources_token  = msg.vss[0].token;
                }
            }
            class_account.send_msg("ccm_misc_get", {sess:{nid:class_account.create_nid(class_account.ctrl({type:"get_info"})), sn:obj.sn}},
                    function(type, msg, ref){ccm_misc_get_ack(type, msg, ref);}, {ip:pnode.ip, to:"ccm"});
          }, {ip:pnode.ip, to:"ccm"}); 
          function ccm_misc_get_ack(type,msg,ref)
          {
             if(msg && msg.ret&& msg.ret.code == "")
             {
                if(msg.info)
                {
                   flip  = msg.info.flip;
                   power = msg.info.power_freq;   
                }
             }
             else
             {
               obj.onEvent({result:msg.result,ref:obj.ref});
             }
             obj.onEvent({result:"",brightness:brightness,contrast:contrast,color_saturation:color_saturation,sharpness:sharpness,mode:mode,flip:flip,power:power,ref:obj.ref});
          }
                 
    }
    function dev_cam_set(obj)
    {
         class_account.send_msg_ex(obj.sn, "ccm_img_set", {token:video_sources_token,
            conf:{brightness:obj.brightness,contrast:obj.contrast,color_saturation:obj.color_saturation,sharpness:obj.sharpness,mode:obj.mode}},
                   function(type, msg, ref){
                     if(msg && msg.ret&& msg.ret.code == "")
                     {
                        obj.onEvent({result:"",ref:obj.ref});
                     }
                     else
                     {
                        obj.onEvent({result:msg.ret,ref:obj.ref});   
                     }
                     if(obj.fiip)
                     {
                         ccm_misc_set(obj)
                     }
                 });
         function ccm_misc_set(obj)
         {
            class_account.send_msg_ex(obj.sn,"ccm_misc_set", {info:{flip:obj.flip,power_freq:obj.power}},  
                function(type, msg, ref){
                     if(msg && msg.ret&& msg.ret.code == "")
                     {
                        obj.onEvent({result:"",ref:obj.ref});
                     }
                     else
                     {
                        obj.onEvent({result:msg.ret,ref:obj.ref});
                     }
                });
         }
    }
    function dev_net_get(obj)
    {
            var node, node_sn, pnode, pnode_sn,info={};
            var networks =[], //   = null  ,
                dns={},       // = {enable,mode,dns,secondary_dns,status},
               /* wifi_obj={},  //= {ssid,quality,signal_level},
                ip_obj={},    //   = {mode,enable,ip,gateway,mask,status},
                net_info_obj={},// = {name,mode,type,mac,status},
                dhcp_srv_obj={};// = {enable,gateway,start_ip,end_ip},
                net_obj= {enable:"",token:"",net_info_obj:"",ip_obj:"",use_wifi_ssid:"",use_wifi_passwd:"",use_wifi_status:"",use_wifi_enable:"",wifi_list:"",dhcp_srv_obj:""};
                */
             
            node_sn = obj.sn;
            node = mdev_devs.getDevBySn(node_sn);
            if(!node)
            {
                return;
            } 
            if(node.isParent)
            {
                pnode = node;
                pnode_sn = node_sn;
            }
            else
            {
                pnode_sn = node.parent_sn;
                pnode = s_ref.device_list_obj["sn_" + pnode_sn];
            }
            set_wifi_config_response_ok = 0;
            class_account.send_msg("ccm_net_get", {sess:{nid:class_account.create_nid(class_account.ctrl({type:"get_info"})), sn:node_sn},
                tokens:["eth0", "ra0"], items:[obj.filter,obj.filter], force_scan:obj.filter=="all"?0:1},
                function(type, msg, ref){
                    if(msg && msg.ret&&msg.ret.code == "")
                     {
                         if(msg.info.ifs)
                         {
                              if(msg.info.ifs[0])
                              {
                                 var net_obj={},net_info_obj={},ip_obj={};
                                 net_obj.enable = msg.info.ifs[0].enabled;
                                 net_obj.token  = msg.info.ifs[0].token;
                                 if( msg.info.ifs[0].phy)
                                 {
								    var msg_phy=msg.info.ifs[0].phy;
                                        net_info_obj.name   = msg_phy.info.name;
                                        net_info_obj.mode   = msg_phy.conf.mode;
                                        net_info_obj.type   = msg_phy.info.type;
                                        net_info_obj.mac    = msg_phy.info.mac;
                                        net_info_obj.status = msg_phy.info.stat;
                                        net_obj.net_info_obj=net_info_obj;
                                 }
                                 if(msg.info.ifs[0].ipv4)
                                 {
								     var msg_ipv4=msg.info.ifs[0].ipv4;
                                      ip_obj.mode     = msg_ipv4.conf.mode;
                                      ip_obj.enable   = msg_ipv4.conf.enabled;
                                      ip_obj.ip       = msg_ipv4.info.ip.addr;
                                      ip_obj.gateway  = msg_ipv4.info.ip.gw;
                                      ip_obj.mask     = msg_ipv4.info.ip.mask;
                                      ip_obj.status   = msg_ipv4.info.stat;
                                      net_obj.ip_obj=ip_obj;
                                 }
                                 networks[0]=net_obj;
                              }
                              if(msg.info.ifs[1]) 
                              {
                                 var net_obj={},net_info_obj={},ip_obj={},dhcp_srv_obj={};
                                 net_obj.enable = msg.info.ifs[1].enabled;
                                 net_obj.token  = msg.info.ifs[1].token;
                                 if(msg.info.ifs[1].wifi_client)
                                 {
								    var msg_client=msg.info.ifs[1].wifi_client;
                                   net_obj.use_wifi_ssid   = msg_client.conf.ssid;
                                   net_obj.use_wifi_passwd = msg_client.conf.key;
                                   net_obj.use_wifi_status = msg_client.info.stat;
                                   net_obj.use_wifi_enable = msg_client.conf.enabled;
                                   var wifi_lists=[];
                                   if(msg.info.ifs[1].wifi_client.ap_list)
                                   {
								      var msg_aplist=msg.info.ifs[1].wifi_client.ap_list;
                                      for(var i=0;i<msg_aplist.length;i++)
                                      { 
									       var wifi_obj={};
                                           wifi_obj.ssid         = msg_aplist[i].ssid;
                                           wifi_obj.quality      = msg_aplist[i].quality;
                                           wifi_obj.signal_level = msg_aplist[i].signal_level;
                                           wifi_lists[i]=wifi_obj;
                                      }
                                   }
                                   net_obj.wifi_list=wifi_lists;
                                 }
                                 if( msg.info.ifs[1].phy)
                                 {
								    var msg_phy=msg.info.ifs[1].phy;
                                        net_info_obj.name   = msg_phy.info.name;
                                        net_info_obj.mode   = msg_phy.conf.mode;
                                        net_info_obj.type   = msg_phy.info.type;
                                        net_info_obj.mac    = msg_phy.info.mac;
                                        net_info_obj.status = msg_phy.info.stat;
                                        net_obj.net_info_obj= net_info_obj;
                                 }
                                 if(msg.info.ifs[1].ipv4)
                                 {
								    var msg_ipc = msg.info.ifs[1].ipv4
                                      ip_obj.mode     = msg_ipc.conf.mode;
                                      ip_obj.enable   = msg_ipc.conf.enabled;
                                      ip_obj.ip       = msg_ipc.info.ip.addr;
                                      ip_obj.gateway  = msg_ipc.info.ip.gw;
                                      ip_obj.mask     = msg_ipc.info.ip.mask;
                                      ip_obj.status   = msg_ipc.info.stat;
                                      net_obj.ip_obj= ip_obj;
                                 }
                                 if(msg.info.ifs[1].dhcp_srv && msg.info.ifs[1].dhcp_srv.conf)
                                 {
								    var msg_conf= msg.info.ifs[1].dhcp_srv.conf;
                                        dhcp_srv_obj.enable  = msg_conf.enabled;
                                        dhcp_srv_obj.gateway  = msg_conf.gw;
                                        dhcp_srv_obj.start_ip = msg_conf.ip_start;
                                        dhcp_srv_obj.end_ip   = msg_conf.ip_end;
									    net_obj.dhcp_srv_obj=dhcp_srv_obj;
                                 }
                                 networks[1]=net_obj;
                              }
                              if(msg.info.dns)
                              {  
							     var msg_dns=msg.info.dns;
                                 dns.enable        = msg_dns.conf.enabled;
                                 dns.mode          = msg_dns.conf.mode;
                                 dns.dns           = msg_dns.info.dns;
                                 dns.secondary_dns = msg_dns.conf.static_dns;
                                 dns.status        = msg_dns.info.stat;
                              }
                              obj.onEvent({result:"",networks:networks,dns:dns,ref:obj.ref});
                        }
                     }
                     else
                     {
                        obj.onEvent({result:msg.ret,ref:obj.ref});   
                     }
                }, {ip:pnode.ip, to:"ccm"});
    }
    function dev_net_set(obj)
    {
	    var node, node_sn, pnode, pnode_sn,info={},dns={};
          
            node_sn = obj.sn;
            node = mdev_devs.getDevBySn(node_sn);
            if(!node)
            {
                return;
            } 
            if(node.isParent)
            {
                pnode = node;
                pnode_sn = node_sn;
            }
            else
            {
                pnode_sn = node.parent_sn;
                pnode = s_ref.device_list_obj["sn_" + pnode_sn];
            }
        var msg_dns={},networks=[];
	     /*	msg_dns.conf={};
		    msg_dns.info={};
		
		if(obj.dns)
		{
		   msg_dns.conf.enable=obj.dns.enable;
		   msg_dns.conf.mode=obj.dns.mode;
		   msg_dns.conf.static_dns=obj.dns.secondary_dns;
		   msg_dns.info.dns=obj.dns.dns;
		   msg_dns.info.stat=obj.dns.status;
	    }*/
		if(obj.dns)
        {  
			var msg_dns=obj.dns;
			dns.info={};
			dns.conf={};
            dns.conf.enabled = msg_dns.enable;
            dns.conf.mode  = msg_dns.mode;
            dns.info.dns   = msg_dns.dns;
            dns.conf.static_dns =msg_dns.secondary_dns;
        }
		if(obj.networks)
		{
		    if(obj.networks[0].token=="eth0")
			{
			   var networks_0={};
			   networks_0.enabled=obj.networks[0].enable;
			   networks_0.token  =obj.networks[0].token;
			   if(obj.networks[0].net_info_obj)
			   {
			      var msg_net_info_obj=obj.networks[0].net_info_obj,
				      msg_phy={};
					  msg_phy.info={};
					  msg_phy.conf={};
				      msg_phy.info.name = msg_net_info_obj.name;
                      msg_phy.conf.mode = msg_net_info_obj.mode;
                      msg_phy.info.type = msg_net_info_obj.type;
                      msg_phy.info.mac  = msg_net_info_obj.mac;
                      msg_phy.info.stat = msg_net_info_obj.status;
					  networks_0.phy=msg_phy;
			   }
			   if(obj.networks[0].ip_obj)
			   { 
			      var msg_obj=obj.networks[0].ip_obj,
				      msg_ipv4={};
					  msg_ipv4.conf={};
					 // msg_ipv4.info={};
					 // msg_ipv4.info.ip={};
					  msg_ipv4.conf.static_ip=[];
					  msg_ipv4.conf.debug_ip =[];
                      msg_ipv4.conf.mode     = msg_obj.mode;
                      msg_ipv4.conf.enabled  = msg_obj.enable;
					  if(msg_obj.ip)
					  {
					    var obj_ip={};
						obj_ip.addr = msg_obj.ip;
						obj_ip.mask = msg_obj.mask;
						obj_ip.gw   = msg_obj.gateway;
						msg_ipv4.conf.static_ip=[obj_ip];
					  }
                      /*msg_ipv4.info.ip.addr  = msg_obj.ip;
                      msg_ipv4.info.gw       = msg_obj.gateway;
                      msg_ipv4.info.mask     = msg_obj.mask;
                      msg_ipv4.info.stat     = msg_obj.status;
					  */
					  networks_0.ipv4=msg_ipv4;
			   } 
			   networks[0]=networks_0;
			}
			if(obj.networks[0].token=="ra0")
			{
			    
			   var networks_1={},msg_client={},net_obj=obj.networks[0];
			   networks_1.enabled=obj.networks[0].enable;
			   networks_1.token  =obj.networks[0].token;
			   msg_client.info={};
			   msg_client.conf={};
			   msg_client.conf.ssid = net_obj.use_wifi_ssid;
               msg_client.conf.key  = net_obj.use_wifi_passwd;
               msg_client.info.stat = net_obj.use_wifi_status;
               msg_client.conf.enabled = net_obj.use_wifi_enable;
			   networks_1.wifi_client=msg_client;
			   if(net_obj.net_info_obj)
			   {
			      var msg_net_info_obj=net_obj.net_info_obj,
				      msg_phy={};
					  msg_phy.info={};
					  msg_phy.conf={};
				      msg_phy.info.name = msg_net_info_obj.name;
                      msg_phy.conf.mode = msg_net_info_obj.mode;
                      msg_phy.info.type = msg_net_info_obj.type;
                      msg_phy.info.mac  = msg_net_info_obj.mac;
                      msg_phy.info.stat = msg_net_info_obj.status;
					  networks_1.phy=msg_phy;
			   }
			   if(net_obj.ip_obj)
			   { 
			      var msg_obj=net_obj.ip_obj,
				      msg_ipv4={};
					  msg_ipv4.conf={};
					  msg_ipv4.info={};
                      msg_ipv4.conf.mode     = msg_obj.mode;
                      msg_ipv4.conf.enabled  = msg_obj.enable;
                      msg_ipv4.info.ip.addr  = msg_obj.ip;
                      msg_ipv4.info.gw       = msg_obj.gateway;
                      msg_ipv4.info.mask     = msg_obj.mask;
                      msg_ipv4.info.stat     = msg_obj.status;
					  networks_1.ipv4=msg_ipv4;
			   }
			   if(net_obj.dhcp_srv_obj)
			   {
			        var dhcp_srv_obj= net_obj.dhcp_srv_obj;
                        msg_conf.enabled = dhcp_srv_obj.enable;
                        msg_conf.gw     = dhcp_srv_obj.gateway;
                        msg_conf.ip_start = dhcp_srv_obj.start_ip;
                        msg_conf.ip_end   = dhcp_srv_obj.end_ip;
						networks_1.dhcp_srv=msg_conf;
			   }
			   networks[0]=networks_1;
		    }
	    
		    
		}
		
		    info["ifs"]=networks;
			info["dns"]=dns;
		   class_account.send_msg("ccm_net_set", {sess:{nid:class_account.create_nid(class_account.ctrl({type:"get_info"})), sn:node_sn},info:info},
				 function(type, msg, ref){
                    if(msg && msg.ret&&msg.ret.code == "")
                     {
                        obj.onEvent({result:"",ref:obj.ref});
					 }
				     else
					 {
                        obj.onEvent({result:msg.ret,ref:obj.ref});
					 }
					 
				}, {ip:pnode.ip, to:"ccm"});
    }
    function dev_osd_get(obj)
    {
        var text,text_enable,week,date,date_enable,time_12h,time_enable;
        class_account.send_msg_ex(obj.sn, "ccm_osd_get", {}, 
             function(type, msg, ref){
                if(msg && msg.ret&&msg.ret.code == "")
                {
                    if(msg.osd)
                    {
                       text       = msg.osd.text;
                       text_enable = msg.osd.text_enable;
                       week = msg.osd.week;
                       if(msg.osd.date)
                       {
                           date       = msg.osd.date.format;
                           date_enable = msg.osd.date.date_enable;
                           time_12    = msg.osd.date.enable_12h;
                           time_enable = msg.osd.date.time_enable;
                       }
                    }
                    obj.onEvent({result:"",text:text,text_enable:text_enable,week:week,date:date,date_enable:date_enable,time_12h:time_12h,time_enable:time_enable,ref:obj.ref});
                } 
                else
                {
                   obj.onEvent({result:msg.ret});    
                }
            });
    }
    function dev_osd_set(obj)
    {
         class_account.send_msg_ex(obj.sn, "ccm_osd_set",{osd:{text:obj.text,text_enable:obj.text_enable,week:obj.week,
             date:{format:obj.date,date_enable:obj.date_enable,enable_12h:obj.time_12h,time_enable:obj.time_enable}}}
            ,function(type, msg, ref){
                if(msg && msg.ret&&msg.ret.code == "")
                {
                   obj.onEvent({result:"",ref:obj.ref});
                }
            }); 
    }
    function dev_sd_get(obj)
    {
        var enable,status,capacity,usage,availableSize;
         class_account.send_msg_ex(obj.sn, "ccm_disk_get", {}, 
            function(type, msg, ref){
               if(msg && msg.ret&&msg.ret.code == "")
               {
                  if(msg.disks)
                  {
                      capacity      = msg.disks[0].size+"MB";
                      usage         = msg.disks[0].used_size+"MB";
                      availableSize = msg.disks[0].available_size+"MB";
                      status        = msg.disks[0].stat;
                      if(msg.disks[0].conf)
                      {
                         enable=msg.disks[0].conf.enable;
                      }
                  }
                  obj.onEvent({result:"",enable:enable,status:status,capacity:capacity,usage:usage,availableSize:availableSize,ref:obj.ref});
               }
               else 
               {
                  obj.onEvent({result:msg.ret,ref:obj.ref}); 
               }
            });
    }
    function dev_sd_set(obj)
    {
        if(obj.ctrl_type)
        {
            class_account.send_msg_ex(obj.sn, "ccm_disk_ctl", {token:"sd",type:obj.ctrl_type},
               function(type, msg, ref){
                  if(msg && msg.ret&&msg.ret.code=="")
        	      {
        	         obj.onEvent({result:"",ref:obj.ref});
        	      }
        	      else
        	      {
        	         obj.onEvent({result:msg.ret,ref:obj.ref});   
        	      }
                });
        }
        else
        {
            class_account.send_msg_ex(obj.sn, "ccm_disk_ctl", {token:"sd",conf:{enable:obj.enable}},
               function(type, msg, ref){
                  if(msg && msg.ret&&msg.ret.code=="")
        	      {
        	         obj.onEvent({result:"",ref:obj.ref});
        	      }
        	      else
        	      {
        	         obj.onEvent({result:msg.result,ref:obj.ref});   
        	      }
                });
        }
    }
    function dev_time_get(obj)
    {
        var pnode,
         type,timezone,hour,min,sec,year,mon,day,auto_sync,srv_ip;
        
        
        var node,pnode,pnode_an,node_sn;
            node_sn = obj.sn;
            node = mdev_devs.getDevBySn(obj.sn);
			
            if(!node)
            {
                return -1;
            }
            if(node.isParent)
            {
                pnode = node;
                pnode_sn = node_sn;
            }
            else
            {
                pnode_sn = node.parent_sn;
                pnode = s_ref.device_list_obj["sn_" + pnode_sn];
            }
			
            class_account.send_msg("ccm_date_get", {sess:{nid:class_account.create_nid(class_account.ctrl({type:"get_info"})), sn:obj.sn}},
             function(type, msg, ref){
                if(msg && msg.ret&&msg.ret.code=="")
        	    {
        	        if(msg.utc_date)
        	        {
        	            if(msg.utc_date.time)
        	            {
        	                hour= msg.utc_date.time.hour;
        	                min = msg.utc_date.time.min;
        	                sec = msg.utc_date.time.sec;
        	            }
        	            if(msg.utc_date.date)
        	            {
        	                year = msg.utc_date.date.year;
        	                mon  = msg.utc_date.date.mon;
        	                day  = msg.utc_date.date.day;
        	            }
        	        }
        	    }
        	    else
        	    {
        	       obj.onEvent({result:msg.result,ref:obj.ref});    
        	    }     
                ccm_ntp_get();   
            }, {ip:pnode.ip, to:"ccm"});
			
         function ccm_ntp_get()
         {
            
            class_account.send_msg("ccm_ntp_get", {sess:{nid:class_account.create_nid(class_account.ctrl({type:"get_info"})), sn:node_sn}},
             function(type, msg, ref){
                if(msg && msg.ret&&msg.ret.code=="")
        	    {
        	        if(msg.info)
        	        {
        	           if(msg.info.manual)
        	           {
        	                srv_ip=msg.info.manual[0].ip;
        	           }
        	           auto_sync = msg.info.auto_sync;
        	           timezone  = msg.info.timezone;
        	        }
        	        obj.onEvent({result:"",type:type,timezone:timezone,hour:hour,min:min,sec:sec,year:year,mon:mon,day:day,auto_sync:auto_sync,srv_ip:srv_ip,ref:obj.ref});
        	    }    
             }, {ip:pnode.ip, to:"ccm"});
         }
    }
    function dev_time_set(obj)
    {
        var node,pnode,pnode_an,node_sn;
            node_sn = obj.sn;

            node = mdev_devs.getDevBySn(obj.sn);
            if(!node)
            {
                return -1;
            }
            if(node.isParent)
            {
                pnode = node;
                pnode_sn = node_sn;
            }
            else
            {
                pnode_sn = node.parent_sn;
                pnode = s_ref.device_list_obj["sn_" + pnode_sn];
            }
           class_account.send_msg("ccm_date_set",{sess:{nid:class_account.create_nid(class_account.ctrl({type:"get_info"})), sn:node_sn},
            type:obj.type,daylight_savings:0,timezone:obj.timezone,utc_date:{time:{hour:obj.hour,min:obj.min,sec:obj.sec},date:{year:obj.year,mon:obj.mon,day:obj.day}}},
              function(type, msg, ref){
                  if(msg && msg.ret&&msg.ret.code=="")
        	      {
        	         ntpset();
        	      }
        	      else
        	      {
        	         obj.onEvent({result:msg.ret,ref:obj.ref});  
        	      }  
        	     
              }, {ip:pnode.ip, to:"ccm", type:obj.type});
        
        function ntpset()
        {
             class_account.send_msg("ccm_ntp_set", {sess:{nid:class_account.create_nid(class_account.ctrl({type:"get_info"})), sn:node_sn},
                auto_sync:obj.auto_sync,timezone:obj.timezone,manual:[{ip:obj.srv_ip}]},
                function(type, msg, ref){
                  if(msg && msg.ret&&msg.ret.code=="")
        	      {
        	         obj.onEvent({result:"",ref:obj.ref});
        	      }
        	      else
        	      {
        	         obj.onEvent({result:msg.result,ref:obj.ref});  
        	      }   
                }, {ip:pnode.ip, to:"ccm"});
        }
    }
    function dev_alarm_trigger_get(obj)
    {
        var io_input,io_output,sensitivity,night_sensitivity;
        class_account.send_msg_ex(obj.sn, "ccm_alert_dev_get", {},
         function(type, msg, ref){
           if(msg && msg.ret&&msg.ret.code=="")
        	 {
        	    if(msg.conf)
        	    {
        	        io_input          = msg.conf.io_in_mode;
        	        io_output         = msg.conf.io_out_mode;
        	        sensitivity       = msg.conf.motion_level;
        	        night_sensitivity = msg.conf.motion_level_night;
        	        obj.onEvent({result:"",io_input:io_input,io_output:io_output,sensitivity:sensitivity,night_sensitivity:night_sensitivity,ref:obj.ref});
        	    }
        	 }
        	 else
        	 {
        	    obj.onEvent({result:msg.ret,ref:obj.ref});   
        	 }
         });
    }
    function dev_alarm_trigger_set(obj)
    {
        class_account.send_msg_ex(obj.sn, "ccm_alert_dev_set", {conf:{io_in_mode:obj.io_input,io_out_mode:obj.io_output,motion_level:obj.sensitivity,motion_level_night:obj.night_sensitivity}},
         function(type, msg, ref){
            if(msg && msg.ret&&msg.ret.code=="")
        	 {
        	     obj.onEvent({result:"",ref:obj.ref});
        	 }
        	else
        	 {
        	    obj.onEvent({result:msg.ret,ref:obj.ref});   
        	 }
         });
    }
    function dev_alarm_action_get(obj)
    {
        var enable,actions=[];     //alarm_items[{token,enable,name,srcs,[{devs:[]}],io_out_enable,snapshot_enable,record_enable,snapshot_interval,pre_record_time},]
        class_account.send_msg_ex(obj.sn, "ccm_alert_action_get",{},
         function(type, msg, ref){
             if(msg && msg.ret&&msg.ret.code=="")
        	 {
        	       enable=msg.enable;
        	       if(msg.actions)
        	          actions=msg.actions;
        	       obj.onEvent({result:"",enable:enable,actions:actions,ref:obj.ref});
        	 }
        	 else
        	 {
        	      obj.onEvnet({result:msg.ret,ref:obj.ref});   
        	 }
        });

    }
    function dev_alarm_action_set(obj)
    {
        class_account.send_msg_ex(obj.sn, "ccm_alert_action_set",{enable:obj.enable,actions:obj.actions},
         function(type, msg, ref){
            if(msg && msg.ret&&msg.ret.code=="")
        	 {
        	    obj.onEvent({result:"",ref:obj.ref});
        	 }
        	else
        	 {
        	    obj.onEvnet({result:msg.ret,ref:obj.ref});   
        	 }
        });
    
    }
    function dev_record_get(obj)
    { 
        var enable,full_time,sd_ready,record_time;
        class_account.send_msg_ex(obj.sn, "ccm_record_task_get", {},
           function(type, msg, ref){
             if(msg && msg.ret&&msg.ret.code=="")
        	 {
        	    if(msg.task && msg.task.sch)
        	    {
        	       enable     = msg.task.sch.enable;
        	       full_time  = msg.task.sch.full_time;
        	       if(msg.task.sch.times)
        	       {
        	          record_time=msg.task.sch.times; 
        	       }
        	       sd_ready  = msg.task.sd_ready;
        	    }
        	    obj.onEvent({result:"",enable:enable,full_time:full_time,sd_ready:sd_ready,record_time:record_time,ref:obj.ref});
        	 }
        	 else
        	 {
        	    obj.onEvent({result:msg.ret,ref:obj.ref});   
        	 }
           });
    }
    function dev_record_set(obj)
    {
        class_account.send_msg_ex(obj.sn, "ccm_record_task_set", {task:{sch:{enable:obj.enable,full_time:obj.full_time,times:obj.record_time}}},
           function(type, msg, ref){
             if(msg && msg.ret&&msg.ret.code=="")
        	 {
        	    obj.onEvent({result:"",ref:obj.ref});
        	 }
           	 else
        	 {
        	    obj.onEvnet({result:msg.result,ref:obj.ref});   
        	 }
           
           });
    }
    function dev_upgrade_get(obj)
    {
        var status,progress,ver_current,ver_valid,ver_base,change_history,remark;
         var node, node_sn, pnode, pnode_sn;

            node_sn = obj.sn;
               node = mdev_devs.getDevBySn(node_sn);
            if(!node)
            {
                return;
            }
            if(node.isParent)
            {
                pnode = node;
                pnode_sn = node_sn;
            }
            else
            {
                pnode_sn = node.parent_sn;
                pnode = s_ref.device_list_obj["sn_" + pnode_sn];
            }
            class_account.send_msg("ccm_upgrade_get", {sess:{nid:class_account.create_nid(class_account.ctrl({type:"get_info"})), sn:node_sn},
                check:(obj && obj.check)?obj.check:0},
                    function(type, msg, ref){
                       if(msg && msg.ret&&msg.ret.code=="")
        	           {
        	              status       = msg.stat;
        	              progress     = msg.progress;
        	              ver_current  = msg._cur_ver;
        	              ver_valid    = msg._valid_ver;
        	              ver_base     = msg.img_ver;
        	              change_history = msg.changes;

        	              obj.onEvent({result:"",status:status,progress:progress,ver_current:ver_current,ver_valid:ver_valid,ver_base:ver_base,change_history:change_history,ref:obj.ref});
        	           }
        	           else
        	           {
        	              obj.onEvent({result:msg.ret,ref:obj.ref}); 
        	           }  
                    },               
                    {ip:pnode.ip, to:"ccm", sn:node_sn, psn:pnode_sn, check_ver:(obj && obj.check)?obj.check:0, type:(obj && obj.type)?obj.type:0});
          
    }
    function dev_upgrade_set(obj)
    {
        var node, node_sn, pnode, pnode_sn;

            node_sn = obj.sn;
            node =  mdev_devs.getDevBySn(node_sn);
            if(!node)
            {
                return;
            }
            if(node.isParent)
            {
                pnode = node;
                pnode_sn = node_sn;
            }
            else
            {
                pnode_sn = node.parent_sn;
                pnode = s_ref.device_list_obj["sn_" + pnode_sn];
            }
            class_account.send_msg("ccm_upgrade", {sess:{nid:class_account.create_nid(class_account.ctrl({type:"get_info"})), sn:node_sn}, img_src:"download"},
                   function(type, msg, ref){
                        if(msg && msg.ret&&msg.ret.code=="")
        	            {
        	                obj.onEvent({result:"",ref:obj.ref});
        	            }
                   }, {ip:pnode.ip, to:"ccm", sn:node_sn, psn:pnode_sn});
    }
	  var speaker_token,mic_conf;
    function dev_audio_get(obj)
    {
	    var mic_level,speaker_level,flip,power;
        var node, node_sn, pnode, pnode_sn;
            node_sn = obj.sn;
            node = mdev_devs.getDevBySn(node_sn);
            if(!node)
            {
                return;
            }
            if(node.isParent)
            {
                pnode = node;
                pnode_sn = node_sn;
            }
            else
            {
                pnode_sn = node.parent_sn;
                pnode = s_ref.device_list_obj["sn_" + pnode_sn];
            }
            class_account.send_msg("ccm_mic_get", {sess:{nid:class_account.create_nid(class_account.ctrl({type:"get_info"})), sn:node_sn}},
                function(type, msg, ref){
                    if(msg && msg.ret&&msg.ret.code=="")
        	        {
				        if(msg.conf)
                        {
				            mic_level= msg.conf[0].level;
					        mic_conf =msg.conf;
					    }						  
					}
					 ccm_speakers_get();  
                }, {ip:pnode.ip, to:"ccm"});
		    function ccm_speakers_get()
			{
			    class_account.send_msg_ex(obj.sn, "ccm_speakers_get", {}, function(type, msg, ref){
				    var token;
				    if(msg && msg.ret&&msg.ret.code=="")
        	        {
					   if(msg.speakers)
                       {
						    token=msg.speakers[0].token;
					   }	
					}
					else
					{
					      
					}
					ccm_speaker_get({token:token})
				});   
			}
			function ccm_speaker_get(ref)
			{   
			    class_account.send_msg_ex(obj.sn, "ccm_speaker_get", {token:ref.token}, function(type, msg, ref){
				      if(msg && msg.ret&&msg.ret.code=="")
        	           {
					        if(msg.conf)
                            {
							    speaker_level=msg.conf.level;
							    speaker_token=msg.conf.token;
							}
					   }
					   else
					   {	      
					   }
					   obj.onEvent({result:"",mic_level:mic_level,speaker_level:speaker_level,ref:obj.ref});
				});   
			}
    }
    function dev_audio_set(obj)
    {
        var node, node_sn, pnode, pnode_sn;

         node_sn = obj.sn;
         node = mdev_devs.getDevBySn(node_sn);
         if(!node)
         {
                return;
         }
         if(node.isParent)
         {
                pnode = node;
                pnode_sn = node_sn;
         }
         else
         {
                pnode_sn = node.parent_sn;
                pnode = s_ref.device_list_obj["sn_" + pnode_sn];
         }
         class_account.send_msg("ccm_speaker_set", {sess:{nid:class_account.create_nid(class_account.ctrl({type:"get_info"})), sn:node_sn},
                conf:{token:speaker_token,level:obj.speaker_level},force_persistence:1},
                function(type, msg, ref){
				      if(msg && msg.ret&&msg.ret.code=="")
        	          {
					      ccm_mic_set();
					  }
					  else
					  {
					      obj.onEvent({result:msg.ret});
					  }
			   }, {ip:pnode.ip, to:"ccm"});
	      function ccm_mic_set()
		  {
		       mic_conf[0].level=obj.mic_level;
               class_account.send_msg("ccm_mic_set", {sess:{nid:class_account.create_nid(class_account.ctrl({type:"get_info"})), sn:node_sn},
               conf:mic_conf, force_persistence:1},
                function(type, msg, ref){
				   if(msg && msg.ret&&msg.ret.code=="")
        	       {
					     ccm_misc_set(); 
				   }
				   else
				   {
					     obj.onEvent({result:msg.ret});
				   }
				}, {ip:pnode.ip, to:"ccm"});
		  }
		  function ccm_misc_set()
		  {
		     class_account.send_msg("ccm_misc_set", {sess:{nid:class_account.create_nid(class_account.ctrl({type:"get_info"})), sn:node_sn},
                info:{flip:obj.flip,power_freq:obj.power}},  //TSH selected框框用数组枚举
                function(type, msg, ref){
				    if(msg && msg.ret&&msg.ret.code=="")
        	       {
					      obj.onEvent({result:"",ref:obj.ref});
				   }
				   else
				   {
					     obj.onEvent({result:msg.ret});
				   }
				}, {ip:pnode.ip, to:"ccm"});
          }
    }
    function dev_reboot(obj)
    {
            var node, node_sn, pnode, pnode_sn;
            node_sn =obj.sn;
            node = mdev_devs.getDevBySn(node_sn)
            if(!node)
            {
                return;
            }
            if(node.isParent)
            {
                pnode = node;
                pnode_sn = node_sn;
            }
            else
            {
                pnode_sn = node.parent_sn;
                pnode = s_ref.device_list_obj["sn_" + pnode_sn];
            }
            class_account.send_msg("ccm_reboot", {sess:{nid:class_account.create_nid(class_account.ctrl({type:"get_info"})), sn:node_sn}},
                    function(type, msg, ref){
                       if(msg && msg.ret&&msg.ret.code=="")
        	           {
        	              obj.onEvent({result:"",ref:obj.ref});
        	           }
        	           else
        	           {
        	              obj.onEvent({result:msg.ret,ref:obj.ref}); 
        	           }
                    }, {ip:pnode.ip, to:"ccm", sn:node_sn, psn:pnode_sn});
    }
    function dev_restore(obj)
    {
          var node, node_sn, pnode, pnode_sn;

            node_sn = obj.sn;
               node = mdev_devs.getDevBySn(node_sn);
            if(!node)
            {
                return;
            }
            if(node.isParent)
            {
                pnode = node;
                pnode_sn = node_sn;
            }
            else
            {
                pnode_sn = node.parent_sn;
                pnode = s_ref.device_list_obj["sn_" + pnode_sn];
            }
            class_account.send_msg("ccm_restore", {sess:{nid:class_account.create_nid(class_account.ctrl({type:"get_info"})), sn:node_sn},backup:obj.keep_base_cofig},
                function(type, msg, ref){
                    if(msg && msg.ret&&msg.ret.code=="")
        	        {
        	            obj.onEvent({result:"",ref:obj.ref});
        	        }
        	        else
        	        {
        	            obj.onEvent({result:msg.ret,ref:obj.ref}); 
        	        }      
                }, {ip:pnode.ip, to:"ccm"});
    }
	  function account_recovery(obj)
	  {
	    var secret_key = dh.gen_private();
        var pub_key = dh.gen_public(secret_key);
        var tid = now_handle_info.tid;
            class_account.send_msg("cacs_dh_req", {bnum_prime:dh.prime, root_num:dh.g, key_a2b:pub_key, tid:tid},
            function(type, msg, ref) {
                if(msg.result == "")
                {
                    var share_key = dh.gen_shared_secret(secret_key, msg.key_b2a);
                    local_storage.set(str.cacs_tid_str, msg.tid);
                    now_handle_info.tid       = msg.tid;
                    now_handle_info.lid       = msg.lid;
                    now_handle_info.share_key = share_key;
                    class_account.send_msg("cacs_recovery_req", {nid:acs.create_nid_base_lid(now_handle_info), user:obj.data.user,lang:s_ref.now_lang,param:[{name:"appid",value:s_ref.hostname}]},
                        function(type, msg, ref){
                            if(msg.result =="")
                            {
							                  obj.onEvent({result:"",ref:obj.ref});
                                
                            }else
							              {
							                  obj.onEvent({result:msg.result,ref:obj.ref});
							              }
                           
                        },
                    {ip:ref.ip, to:"ccm"});
                }
            },
            {ip:s_ref.server_device, to:"ccm"});            
	  }
    function passwd_encrypt(obj)
    {
        var md5password   = class_account.md5_message_encrypt(obj.pass);
        return md5password.toString();
    }
    function packload(obj)
    {
        var remember_data = class_account.get_storage_data({str:obj.key});
        if(remember_data)
        {
            return remember_data;
        }
        else
        {
            return null;    
        }
    }   
    function packSave(obj)
    { 
        class_account.set_storage_data({str:obj.key,data:obj.value});
    }
    return{
       svr_dev_get:svr_dev_get,
       account_create:account_create,
       sign_in:signin,
       sign_out:signout,
       account_passwd_set:account_passwd_set,
       devs_refresh:devs_refresh,
       dev_add:dev_add,
       dev_del:dev_del,
       play:play,
       pushtalk:pushtalk,
       dev_record_get:record,    //..
       playback:playback,
       ptz_ctrl:ptz_ctrl,
       dev_msgs_get:dev_msgs_get,
       dev_msg_watch:dev_msg_listener_add,
       dev_msg_dewatch:dev_msg_listener_del,
       pic_get:pic_get,
       dev_passwd_set:dev_passwd_set,
       dev_name_set:dev_nick_set,
       dev_cam_get:dev_cam_get,
       dev_cam_set:dev_cam_set,
       dev_net_get:dev_net_get,//..
       dev_net_set:dev_net_set,
       dev_osd_get:dev_osd_get,
       dev_osd_set:dev_osd_set,
       dev_sd_get:dev_sd_get,
       dev_sd_set:dev_sd_set,
       dev_time_get:dev_time_get,
       dev_time_set:dev_time_set,
       dev_alarm_trigger_get:dev_alarm_trigger_get,
       dev_alarm_trigger_set:dev_alarm_trigger_set,
       dev_alarm_action_get:dev_alarm_action_get,
       dev_alarm_action_set:dev_alarm_action_set,
       dev_record_get:dev_record_get,  //..
       dev_record_set:dev_record_set,
       dev_upgrade_get:dev_upgrade_get,
       dev_upgrade_set:dev_upgrade_set,
       dev_audio_get:dev_audio_get,
       dev_audio_set:dev_audio_set,
       dev_reboot:dev_reboot,
       dev_restore:dev_restore,
	     account_recovery:account_recovery,
       passwd_encrypt:passwd_encrypt,
       packload:packload,
       packSave:packSave
    };
})();   
