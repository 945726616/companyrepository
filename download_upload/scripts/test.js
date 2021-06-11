function ipcm( obj )
{
    this.create( obj );
}

ipcm.prototype =
{
    get_default_skin:function()
    {
        return{width:1280, margin:5};
    },

    create:function( obj )
    {
        var me = this;

        this.node = {};

        if( "object" != typeof( obj ) || obj.parent == null )
        {
            alert( "New list_view failed with invalid input param" );
            return;
        }

        if( typeof( obj.parent ) == "object" )
        {
            this.node.cont = obj.parent;
        }
        else
        {
            if(( this.node.cont = document.getElementById( obj.parent )) == null )
            {
                alert( "New ts failed: parent(" + obj.parent + ") does not existed" );
                return;
            }
        }

        this.skin = this.get_default_skin();
        if( obj.skin != null && "object" == typeof(obj.skin))
        {
            obj_merge(this.skin, obj.skin);
        }

        this.node.cont.style.cssText = "width:" + this.skin.width + "px; word-wrap:break-word";
        this.obj_comm_test = new comm_test ({ipcm:me});
    },

    destroy:function()
    {
        var me = this;
        for( var key in me )
        {
            if( me[key] && me[key].destroy != null && typeof(me[key].destroy) == "function" )
            {
                me[key].destroy();
            }
        }
    },

    update:function()
    {
        var me = this;
        for( var key in me )
        {
            if( me[key] && me[key].update != null && typeof(me[key].update) == "function" )
            {
                me[key].update();
            }
        }
    },

    send_msg:function( to, type, data, on_ack)
    {
        if(this.local_debug)
        {
            this.do_local_debug(type, data, on_ack);
            return;
        }
        else
        {
            var me = this;
            rpc.call({srv:"/", to:to, type:type, data:data, static:false, way:"json",
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
        }
    },

    send_qid_msg:function( mmq_qid, to, type, data, on_ack)
    {
        if(this.local_debug)
        {
            this.do_local_debug(type, data, on_ack);
            return;
        }
        else
        {
            var me = this;
            rpc.call({srv:"/", to:to, type:type, data:data, static:false, way:"json", qid:mmq_qid,
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
        }
    },


    send_debug_msg:function( cid, type, data, on_ack)
    {
        this.do_local_debug(type, data, on_ack);
        return;
    },

    do_local_debug:function(type, data, on_ack)
    {
        switch(type)
        {
            default:
            {
                alert("unkown message:[" + type + "]");
                break;
            }
        }
    },

    create_nid:function( id_type, id, seq, share_key )
    {
        var nid = codec.nid( seq, id, share_key, id_type, null, null, md5_ex, "hex" );
        return nid;
    },

    des_md5_encrypt:function( message, pass )
    {
        var md5_message = CryptoJS.MD5( message );
        var key = CryptoJS.MD5( pass );
        var iv  = CryptoJS.enc.Hex.parse('0000000000000000');
        var des = CryptoJS.DES.encrypt( md5_message, key, {iv:iv, padding: CryptoJS.pad.NoPadding}).ciphertext.toString();
        return des;
    }
}

function comm_test( obj )
{
    this.create( obj );
}

comm_test.prototype =
{
    create:function( obj )
    {
        var me = this;
        this.node = {};
        this.ipcm = obj.ipcm;

        this.node.cont = document.createElement( "div" );
        this.ipcm.node.cont.appendChild( this.node.cont );
        this.node.cont.style.cssText = "border:1px solid blue; margin:" + this.ipcm.skin.margin + "px;";

        var temp = document.createElement( "span" );
        temp.innerHTML = "comp:";
        this.node.cont.appendChild( temp );
        
        (this.node.comp = document.createElement( "input" )).type= "text";
        this.node.cont.appendChild( this.node.comp );

        var temp = document.createElement( "span" );
        temp.innerHTML = "msg_type:";
        this.node.cont.appendChild( temp );
        
        (this.node.msg_type = document.createElement( "input" )).type= "text";
        this.node.cont.appendChild( this.node.msg_type );

        var temp = document.createElement( "span" );
        temp.innerHTML = "pass[0]:";
        this.node.cont.appendChild( temp );
        
        (this.node.pass0 = document.createElement( "input" )).type= "password";
        this.node.cont.appendChild( this.node.pass0 );

        var temp = document.createElement( "span" );
        temp.innerHTML = "pass[1]:";
        this.node.cont.appendChild( temp );
        
        (this.node.pass1 = document.createElement( "input" )).type= "password";
        this.node.cont.appendChild( this.node.pass1 );

        /* Commit */
        this.node.commit = document.createElement( "button" );
        this.node.commit.innerHTML = "commit";
        this.node.commit.onclick = function()
        {
            me.ipcm.send_msg( me.node.comp.value, me.node.msg_type.value, eval("("+me.node.msg.value+")"), function(type, data){ if( me.node.msg_type.value == "cacs_dh_req" ){ me.on_dh_ack( data );}else if( me.node.msg_type.value == "cacs_login_req" ){ me.on_login_ack( data ); }else if( me.node.msg_type.value == "mmq_create" ){ me.on_mmq_create_ack( data ); }else{ me.on_test_ack( data ); }});
        }
        this.node.cont.appendChild( this.node.commit );

        /* Commit */
        this.node.commit = document.createElement( "button" );
        this.node.commit.innerHTML = "commit_qid";
        this.node.commit.onclick = function()
        {
            me.ipcm.send_qid_msg( me.ipcm.qid, me.node.comp.value, me.node.msg_type.value, eval("("+me.node.msg.value+")"), function(type, data){ if( me.node.msg_type.value == "cacs_dh_req" ){ me.on_dh_ack( data );}else if( me.node.msg_type.value == "cacs_login_req" ){ me.on_login_ack( data ); }else if( me.node.msg_type.value == "mmq_create" ){ me.on_mmq_create_ack( data ); }else{ me.on_test_ack( data ); }});
        }
        this.node.cont.appendChild( this.node.commit );

        var temp = document.createElement( "span" );
        temp.innerHTML = "<br>msg:";
        this.node.cont.appendChild( temp );

        this.node.msg = document.createElement( "textarea" );
        this.node.msg.cols = 100;
        this.node.msg.rows = 5;
        this.node.cont.appendChild( this.node.msg );

        /* help */
        this.node.help = document.createElement( "div" );
        this.node.cont.appendChild( this.node.help );
        
        /* acs */
        var temp = document.createElement( "span" );
        temp.innerHTML = "<br>acs:";
        this.node.cont.appendChild( temp );

        /* acs.dh */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "dh";
        this.node.btn.onclick = function()
        {
            me.ipcm.secret_key = dh.gen_private();
            me.ipcm.pub_key = dh.gen_public(me.ipcm.secret_key);
            me.node.comp.value = "ccm";
            me.node.msg_type.value = "cacs_dh_req";
            me.node.msg.value = "{bnum_prime:'" + dh.prime + "', root_num:'" + dh.g + "', key_a2b:'" + me.ipcm.pub_key + "', tid:'1'}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* acs.login */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "login";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 2, me.ipcm.lid, 5, me.ipcm.share_key );
            var pass = me.ipcm.des_md5_encrypt( me.node.pass0.value, me.ipcm.share_key );
            var pass_test = me.ipcm.des_md5_encrypt( "123", "456" );
            me.node.comp.value = "ccm";
            me.node.msg_type.value = "cacs_login_req";
            me.node.msg.value = "{lid:'" + me.ipcm.lid + "', nid:'" + nid + "', user:'user', pass:'" + pass + "', user_refer:'xxx', session_req:1, session_refer:'xxx', login_refer:'xxx'}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* acs.bind */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "bind";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 2, me.ipcm.lid, 5, me.ipcm.share_key );
            var pass = me.ipcm.des_md5_encrypt( me.node.pass0.value, me.ipcm.share_key );
            me.node.comp.value = "ccms";
            me.node.msg_type.value = "cacs_bind_req";
            me.node.msg.value = "{nid:'" + nid + "', user:'test01', email:'', mobile:'', pass:'" + pass + "', lang:'en'}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* acs.query */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "query";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 2, me.ipcm.lid, 5, me.ipcm.share_key );
            me.node.comp.value = "ccms";
            me.node.msg_type.value = "cacs_query_req";
            me.node.msg.value = "{nid:'" + nid + "', user:'test01'}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* acs.logout */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "logout";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "ccm";
            me.node.msg_type.value = "cacs_logout_req";
            me.node.msg.value = "{nid:'" + nid + "'}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* acs.pass */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "pass";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 2, me.ipcm.lid, 5, me.ipcm.share_key );
            var old_pass = me.ipcm.des_md5_encrypt( me.node.pass0.value, me.ipcm.share_key );
            var new_pass = me.ipcm.des_md5_encrypt( me.node.pass1.value, me.ipcm.share_key );
            me.node.comp.value = "ccm";
            me.node.msg_type.value = "cacs_passwd_req";
            me.node.msg.value = "{nid:'" + nid + "', old_pass:'" + old_pass + "', new_pass:'" + new_pass + "', guest:0, user:'xxx' }";
        }
        this.node.cont.appendChild( this.node.btn );

        /* acs.su_pass */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "su_pass";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            var old_pass = me.ipcm.des_md5_encrypt( me.node.pass0.value, me.ipcm.share_key );
            var new_pass = me.ipcm.des_md5_encrypt( me.node.pass1.value, me.ipcm.share_key );
            me.node.comp.value = "ccm";
            me.node.msg_type.value = "cacs_su_passwd_req";
            me.node.msg.value = "{nid:'" + nid + "', user:'xxxx', su_pass:'" + old_pass + "', new_pass:'" + new_pass + "', guest:0 }";
        }
        this.node.cont.appendChild( this.node.btn );

        /* acs.checknid */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "check_nid";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "ccm";
            me.node.msg_type.value = "cacs_check_nid_req";
            me.node.msg.value = "{nid:'" + nid + "', flag:''}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* acs.reg */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "reg";
        this.node.btn.onclick = function()
        {
            var pass = me.ipcm.des_md5_encrypt( me.node.pass0.value, me.ipcm.share_key );
            me.node.comp.value = "ccm";
            me.node.msg_type.value = "cacs_reg_req";
            me.node.msg.value = "{lid:'" + me.ipcm.lid + "', user:'xxx', mail:'xxx@163.com', pass:'" + pass + "', user_refer:'xxx'}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* acs.recovery */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "recovery";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 2, me.ipcm.lid, 6, me.ipcm.share_key );
            me.node.comp.value = "ccm";
            me.node.msg_type.value = "cacs_recovery_req";
            me.node.msg.value = "{nid:'" + nid + "', user:'xxx', lang:'xxx'}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* ccms */
        var temp = document.createElement( "span" );
        temp.innerHTML = "<br>ccms:";
        this.node.cont.appendChild( temp );

        /* ccms.get.device */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "get_device";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            var pass = me.ipcm.des_md5_encrypt( me.node.pass0.value, me.ipcm.share_key );
            me.node.comp.value = "ccm";
            me.node.msg_type.value = "CcmGetSubDevicesRequest";
            me.node.msg.value = "{Session:{Nid:'" + nid + "'}, Start:0, Counts:20}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* ccms.add.device */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "add_device";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            var pass = me.ipcm.des_md5_encrypt( me.node.pass0.value, me.ipcm.share_key );
            me.node.comp.value = "ccms";
            me.node.msg_type.value = "CcmAddSubDeviceRequest";
            me.node.msg.value = "{Session:{Nid:'" + nid + "'}, SerialNumber:'xxxx', pass:'" + pass + "'}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* ccms.del.device */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "del_device";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            var pass = me.ipcm.des_md5_encrypt( me.node.pass0.value, me.ipcm.share_key );
            me.node.comp.value = "ccms";
            me.node.msg_type.value = "CcmDelSubDeviceRequest";
            me.node.msg.value = "{Session:{Nid:'" + nid + "'}, SerialNumber:'xxxx'}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* ccms.msid_set */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "msid_set";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "ccms";
            me.node.msg_type.value = "ccms_debug";
            me.node.msg.value = "{Session:{Nid:'" + nid + "', SerialNumber:'xxx'}, password:'pass', method:'msid', args:['--sn', 'xxx', '--id', 'msxxx']}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* ccms.apns_desc */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "apns_desc_mining";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "ccms";
            me.node.msg_type.value = "ccms_debug";
            me.node.msg.value = "{Session:{Nid:'" + nid + "', SerialNumber:'xxx'}, password:'pass', method:'apns_desc', args:['--type', 'com.shenzhenmining.mipci', '--host', 'gateway.push.apple.com', '--port', '2195', '--client_cert', 'mipci_apns_production_cert.pem', '--client_key', 'mipci_apns_production_key.pem', '--client_key_pwd', '1mk1d3aap', '--ca_cert', 'entrust_2048_ca.pem']}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* ccms.apns_desc */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "apns_desc_luxcam";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "ccms";
            me.node.msg_type.value = "ccms_debug";
            me.node.msg.value = "{Session:{Nid:'" + nid + "', SerialNumber:'xxx'}, password:'pass', method:'apns_desc', args:['--type', 'com.luxsecurity.luxcami', '--host', 'gateway.push.apple.com', '--port', '2195', '--client_cert', 'luxcami_apns_production_cert.pem', '--client_key', 'luxcami_apns_production_key.pem', '--client_key_pwd', '1mkapu.ap', '--ca_cert', 'entrust_2048_ca.pem']}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* ccms.apns_cb */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "apns_cb_del";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "ccms";
            me.node.msg_type.value = "ccms_debug";
            me.node.msg.value = "{Session:{Nid:'" + nid + "', SerialNumber:'xxx'}, password:'pass', method:'apns_cb_del', args:['--token', 'xxx']}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* ccms.device_kickoff */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "device_kickoff";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "ccms";
            me.node.msg_type.value = "ccms_debug";
            me.node.msg.value = "{Session:{Nid:'" + nid + "', SerialNumber:'xxx'}, password:'pass', method:'device_kickoff', args:['--sn', 'xxx']}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* ccms.ccm_subscribe */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "subscribe";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "ccms";
            me.node.msg_type.value = "CcmSubscribeRequest";
            me.node.msg.value = "{Session:{Nid:'" + nid + "', SerialNumber:'xxx'}, apns_type:'com.shenzhenmining.mipci', apns_token:'xxx', apns_token_prev:''}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* ccds */
        var temp = document.createElement( "span" );
        temp.innerHTML = "<br>ccds:";
        this.node.cont.appendChild( temp );

        /* ccds.get.ipc.config */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "get_ipc_config";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "ccms";
            me.node.msg_type.value = "ccms_get_ipc_config_req";
            me.node.msg.value = "{Session:{Nid:'" + nid + "', mode:0, SerialNumber:'xxx'}}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* ccds.get.oinfo */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "get_oinfo";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "ccms";
            me.node.msg_type.value = "ccm_oinfo_get";
            me.node.msg.value = "{Session:{Nid:'" + nid + "'}, oid:'xxx', lang:'en'}";
        }
        this.node.cont.appendChild( this.node.btn );

        var temp = document.createElement( "span" );
        temp.innerHTML = "<br>&nbsp;&nbsp;&nbsp;&nbsp;";
        this.node.cont.appendChild( temp );

        /* ccds.set.ipc.config */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "set_oinfo";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "ccms";
            me.node.msg_type.value = "ccm_oinfo_set";
            me.node.msg.value = "{Session:{Nid:'" + nid + "', SerialNumber:'xxx'}, oid:'xxx', lang:'en', info:{logo:'xxx', model:'yyy', mfc:'zzz'}}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* ccds.set.ipc.config */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "set_ipc_config";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "ccms";
            me.node.msg_type.value = "ccms_set_ipc_config_req";
            me.node.msg.value = "{Session:{Nid:'" + nid + "', SerialNumber:'xxx'}, mode:0, system:'', user:''}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* ccds.subdev.limit */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "subdev.dev";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "ccms";
            me.node.msg_type.value = "ccds_debug";
            me.node.msg.value = "{Session:{Nid:'" + nid + "', SerialNumber:'xxx'}, password:'pass', method:'subdev.set', args:['--user', 'xxx', '--device', '32']}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* ccds.oid.set */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "oid.set";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "ccms";
            me.node.msg_type.value = "ccds_debug";
            me.node.msg.value = "{Session:{Nid:'" + nid + "', SerialNumber:'xxx'}, password:'pass', method:'oid.set', args:['--sn', 'xxx', '--oid', 'xxx']}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* ccds.ocfg.set */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "ocfg.set";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "ccms";
            me.node.msg_type.value = "ccds_debug";
            me.node.msg.value = "{Session:{Nid:'" + nid + "', SerialNumber:'xxx'}, password:'pass', method:'ocfg.set', args:['--oid', 'xxx', '--ocfg', 'xxx']}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* ccds.gcid.set */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "gcid.set";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "ccms";
            me.node.msg_type.value = "ccds_debug";
            me.node.msg.value = "{Session:{Nid:'" + nid + "', SerialNumber:'xxx'}, password:'pass', method:'gcid.set', args:['--appid', 'xxx', '--gcid', 'xxx']}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* ccds.gdid.set */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "gdid.set";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "ccms";
            me.node.msg_type.value = "ccds_debug";
            me.node.msg.value = "{Session:{Nid:'" + nid + "', SerialNumber:'xxx'}, password:'pass', method:'gdid.set', args:['--oid', 'xxx', '--gdid', 'xxx']}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* ccds.acl_enabel_gcid.set */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "acl.enable.gcid";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "ccms";
            me.node.msg_type.value = "ccds_debug";
            me.node.msg.value = "{Session:{Nid:'" + nid + "', SerialNumber:'xxx'}, password:'pass', method:'acl.enable.gcid', args:['--gcid', 'xxx', '--enable', 'xxx']}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* ccds.acl_enabel_gdid.set */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "acl.enable.gdid";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "ccms";
            me.node.msg_type.value = "ccds_debug";
            me.node.msg.value = "{Session:{Nid:'" + nid + "', SerialNumber:'xxx'}, password:'pass', method:'acl.enable.gdid', args:['--gdid', 'xxx', '--enable', 'xxx']}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* ccds.acl.rule */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "acl.rule";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "ccms";
            me.node.msg_type.value = "ccds_debug";
            me.node.msg.value = "{Session:{Nid:'" + nid + "', SerialNumber:'xxx'}, password:'pass', method:'acl.rule', args:['--gcid', 'xxx', '--gdid', 'xxx', '--enable', 'xxx']}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* csfs */
        var temp = document.createElement( "span" );
        temp.innerHTML = "<br>csfs:";
        this.node.cont.appendChild( temp );

        /* csfs.set */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "set";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "csfs";
            me.node.msg_type.value = "csfs_set";
            me.node.msg.value = "{nid:'', flag:0, keys:['key_xxx','key_yyy'], tokens:['token_xxx','token_yyy'], datas:['data_xxx','data_yyy']}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* csfs.get */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "get";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "csfs";
            me.node.msg_type.value = "csfs_get";
            me.node.msg.value = "{nid:'', flag:0, keys:['key_xxx','key_yyy'], tokens:['token_xxx','token_yyy']}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* cdfs */
        var temp = document.createElement( "span" );
        temp.innerHTML = "<br>cdfs:";
        this.node.cont.appendChild( temp );

        /* cdfs.set */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "set";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "cdfs";
            me.node.msg_type.value = "cdfs_set";
            me.node.msg.value = "{nid:'', flag:0, handles:[], mirror_count:'', token:'token_xxx', data:'data_xxx'}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* cdfs.get */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "get";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "cdfs";
            me.node.msg_type.value = "cdfs_get";
            me.node.msg.value = "{nid:'', flag:0, items:[{handles:['handle_xxx'], token:'token_xxx', offset:0, len:0}]}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* cmfs */
        var temp = document.createElement( "span" );
        temp.innerHTML = "<br>cmfs:";
        this.node.cont.appendChild( temp );

        /* cmfs.set */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "format";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "cmfs";
            me.node.msg_type.value = "cmfs_format";
            me.node.msg.value = "{nid:0x10930000, path:'data/test_stor_1', create_flag:1, stor_size:8, format_type:0, cluster_size:2 ,sector_size:512, seg_cache_num:100, seg_buff_num:100}";
        }
        this.node.cont.appendChild( this.node.btn );


        /* ccvs */
        var temp = document.createElement( "span" );
        temp.innerHTML = "<br>ccvs:";
        this.node.cont.appendChild( temp );

        /* ccvs.query.version.old */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "query_version.old";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "ccms";
            me.node.msg_type.value = "ccms_query_firmware_req";
            me.node.msg.value = "{Session:{Nid:'" + nid + "', SerialNumber:'xxx'}}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* ccvs.query.version */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "query_version.new";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "ccms";
            me.node.msg_type.value = "ccms_get_ipc_version_update_req";
            me.node.msg.value = "{Session:{Nid:'" + nid + "', SerialNumber:'xxx'}, img_version:'', project_version:''}";
        }
        this.node.cont.appendChild( this.node.btn );

        var temp = document.createElement( "span" );
        temp.innerHTML = "<br>&nbsp;&nbsp;&nbsp;&nbsp;";
        this.node.cont.appendChild( temp );

        /* ccvs.refresh.version.list */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "refresh_version_list";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "ccms";
            me.node.msg_type.value = "ccms_refresh_ipc_version_req";
            me.node.msg.value = "{Session:{Nid:'" + nid + "'}}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* ccvs.get.version.list */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "get_version_list";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "ccms";
            me.node.msg_type.value = "ccms_get_ipc_version_list_req";
            me.node.msg.value = "{Session:{Nid:'" + nid + "'}, start:0, counts:0}";
        }
//        this.node.cont.appendChild( this.node.btn );

        /* ccvs.set.version.select */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "set_version_select";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "ccms";
            me.node.msg_type.value = "ccms_set_ipc_version_select_req";
            me.node.msg.value = "{Session:{Nid:'" + nid + "', SerialNumber:'xxx'}, select:{version:'', status:'testing'}}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* ccvs.get.version.select */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "get_version_select";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "ccms";
            me.node.msg_type.value = "ccms_get_ipc_version_select_req";
            me.node.msg.value = "{Session:{Nid:'" + nid + "', SerialNumber:'xxx'}}";
        }
//        this.node.cont.appendChild( this.node.btn );

        /* ccm */
        var temp = document.createElement( "span" );
        temp.innerHTML = "<br>ccm:";
        this.node.cont.appendChild( temp );

        /* ccm.reset */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "reset";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "ccm";
            me.node.msg_type.value = "SystemRebootRequest";
            me.node.msg.value = "{Session:{Nid:'" + nid + "', SerialNumber:'xxx'}}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* ccm.upgrade */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "upgrade";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "ccm";
            me.node.msg_type.value = "CcmUpgradeRequest";
            me.node.msg.value = "{Session:{Nid:'" + nid + "', SerialNumber:'xxx'}, FirmwareSrc:'download'}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* ccm.upgrade_status */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "upgrade_status";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "ccm";
            me.node.msg_type.value = "CcmGetUpgradeStatusRequest";
            me.node.msg.value = "{Session:{Nid:'" + nid + "', SerialNumber:'xxx'}, CheckVersion:0}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* ccm.record_set */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "record_set";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "ccm";
            me.node.msg_type.value = "CcmSetRecordingTaskConfigurationRequest";
            me.node.msg.value = "{Session:{Nid:'" + nid + "', SerialNumber:'xxx'}, TaskConfiguration:{TimeRecord:{Enable:0, AllTime:0, Times:[{Wday:0,Start:0,End:0}]}, ProfileToken:'p0', immediate:0}}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* ccm.record_get */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "record_get";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "ccm";
            me.node.msg_type.value = "CcmGetRecordingTaskConfigurationRequest";
            me.node.msg.value = "{Session:{Nid:'" + nid + "', SerialNumber:'xxx'}}";
        }
        this.node.cont.appendChild( this.node.btn );


        /* mipcgw */
        var temp = document.createElement( "span" );
        temp.innerHTML = "<br>mipcgw:";
        this.node.cont.appendChild( temp );

        /* mipcgw.get */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "get";
        this.node.btn.onclick = function()
        {
            me.node.comp.value = "cmipcgw";
            me.node.msg_type.value = "cmipcgw_get_req";
            me.node.msg.value = "{client:{mode:'', id:''}}";
        }
        this.node.cont.appendChild( this.node.btn );

        var temp = document.createElement( "span" );
        temp.innerHTML = "<br>&nbsp;&nbsp;&nbsp;&nbsp;";
        this.node.cont.appendChild( temp );

        /* mipcgw.set */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "server_set.lg";
        this.node.btn.onclick = function()
        {
            me.node.comp.value = "cmipcgw";
            me.node.msg_type.value = "cmipcgw_set_req";
            me.node.msg.value = "{password:'', mode:'', id:'xxxxxx', server:{signal:['http://58.61.153.230:7080/ccm','binnet://58.61.153.230:7001'], debug:'telnet://58.61.153.230:7024',license:'binnet://58.61.153.230:7001',ping:'58.61.153.230',ntp:'17.82.253.7'}}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* mipcgw.set */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "server_set.us";
        this.node.btn.onclick = function()
        {
            me.node.comp.value = "cmipcgw";
            me.node.msg_type.value = "cmipcgw_set_req";
            me.node.msg.value = "{password:'pass', mode:'', id:'xxxxxx', server:{signal:['http://ts0.mipcm.com:6080/ccm','binnet://ts0.mipcm.com:6001'], debug:'telnet://58.61.153.230:7024',license:'binnet://58.61.153.230:7001',ping:'58.61.153.230',ntp:'17.82.253.7'}}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* ccms.msid_set */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "cmsid_set";
        this.node.btn.onclick = function()
        {
            me.node.comp.value = "cmipcgw";
            me.node.msg_type.value = "cmipcgw_debug";
            me.node.msg.value = "{password:'pass', method:'cmsid', start:0, counts:0, size:0, args:['--user', 'xxx', '--id', 'xxx']}";
        }
        this.node.cont.appendChild( this.node.btn );


        /* mmq */
        var temp = document.createElement( "span" );
        temp.innerHTML = "<br>mmq:";
        this.node.cont.appendChild( temp );

        /* mmq.create */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "create";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "ccm";
            me.node.msg_type.value = "mmq_create";
            me.node.msg.value = "{timeout:10000}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* mmq.pick */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "pick";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "ccm";
            me.node.msg_type.value = "mmq_pick";
            me.node.msg.value = "{qid:'xxx',refer:'yy', timeout:5000}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* mmq.destroy */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "destroy";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "ccm";
            me.node.msg_type.value = "mmq_destroy";
            me.node.msg.value = "{qid:'xxx'}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* dump */
        var temp = document.createElement( "span" );
        temp.innerHTML = "<br>dump:";
        this.node.cont.appendChild( temp );

        /* dump.ccms */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "ccms";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "ccms";
            me.node.msg_type.value = "ccms_debug";
            me.node.msg.value = "{Session:{Nid:'" + nid + "', SerialNumber:'xxx'}, password:'pass', method:'dump', start:0, counts:0, size:0, args:['--type', 'mod', '--filter', '', '--filter_cid', '0', '--filter_lid', '0', '--filter_sid', '0', '--filter_device_status', '0', '--filter_link_status', '0', '--filter_session_status', '0']}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* ccds.dump */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "ccds";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "ccms";
            me.node.msg_type.value = "ccds_debug";
            me.node.msg.value = "{Session:{Nid:'" + nid + "', SerialNumber:'xxx'}, password:'pass', method:'dump', start:0, counts:0, size:0, args:['--type', 'mod', '--filter', '', '--filter_device', '',]}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* dump.ccvs */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "ccvs";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "ccms";
            me.node.msg_type.value = "ccvs_debug";
            me.node.msg.value = "{Session:{Nid:'" + nid + "'}, password:'pass', method:'dump', args:['--type', 'mod']}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* dump.cdmq */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "cdmq";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "cdmq";
            me.node.msg_type.value = "cdmq_debug";
            me.node.msg.value = "{Session:{Nid:'" + nid + "'}, password:'pass', method:'dump', args:['--type', 'mod']}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* dump.cgmq */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "cgmq";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "cgmq";
            me.node.msg_type.value = "cgmq_debug";
            me.node.msg.value = "{Session:{Nid:'" + nid + "'}, password:'pass', method:'dump', args:['--type', 'mod']}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* dump.mipcgw */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "mipcgw";
        this.node.btn.onclick = function()
        {
            me.node.comp.value = "cmipcgw";
            me.node.msg_type.value = "cmipcgw_debug";
            me.node.msg.value = "{password:'pass', method:'dump', start:0, counts:0, size:0, args:['--type', 'mod']}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* dump.ccm */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "ccm";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "ccm";
            me.node.msg_type.value = "ccm_debug";
            me.node.msg.value = "{Session:{Nid:'" + nid + "', SerialNumber:'xxx'}, password:'pass', method:'dump', start:0, counts:0, size:0, args:['--type', 'all','--filter','']}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* dump.gw */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "gw";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "0";
            me.node.msg_type.value = "cgw_debug";
            me.node.msg.value = "{password:'pass', method:'dump', start:0, counts:0, size:0, args:['--type', 'mod','--filter','']}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* result */
        this.node.info = document.createElement( "div" );
        this.node.cont.appendChild( this.node.info );
        this.update();
    },

    destroy:function()
    {
        this.ipcm.node.cont.removeChild( this.node.cont );
    },

    update:function()
    {
    },

    on_dh_ack:function( data )
    {
        var me = this;

        if( data.result.length == 0 )
        {
            this.ipcm.tid = data.tid;
            this.ipcm.lid = data.lid;
            this.ipcm.share_key = dh.gen_shared_secret( this.ipcm.secret_key, data.key_b2a );
        }

        this.node.info.innerHTML = codec.str_2_html( codec.obj_2_str( data )).replace(/\\r\\n/g, "<br>");
        this.ipcm.update();
    },
    
    on_login_ack:function( data )
    {
        var me = this;

        if( data.result.length == 0 )
        {
            this.ipcm.sid = data.sid;
            this.ipcm.seq = data.seq;
        }

        this.node.info.innerHTML = codec.str_2_html( codec.obj_2_str( data )).replace(/\\r\\n/g, "<br>");
        this.ipcm.update();
    },
    
    on_mmq_create_ack:function( data )
    {
        var me = this;

        if( data.result.length == 0 )
        {
            this.ipcm.qid = data.qid;
        }

        this.node.info.innerHTML = codec.str_2_html( codec.obj_2_str( data )).replace(/\\r\\n/g, "<br>");
        this.ipcm.update();
    },

    
    on_test_ack:function( data )
    {
        var me = this;

        this.node.info.innerHTML = codec.str_2_html( codec.obj_2_str( data )).replace(/\\r\\n/g, "<br>");
        this.ipcm.update();
    }
}
