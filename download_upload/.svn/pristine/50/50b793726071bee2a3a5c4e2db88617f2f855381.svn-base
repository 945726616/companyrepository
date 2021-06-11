function ipcm( obj )
{
    this.create( obj );
}

ipcm.prototype =
{
    get_default_skin:function()
    {
        return{width:1024, margin:5};
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
        temp.innerHTML = "pass:";
        this.node.cont.appendChild( temp );
        
        (this.node.pass = document.createElement( "input" )).type= "password";
        this.node.pass.value = "testok";
        this.node.cont.appendChild( this.node.pass );

        var temp = document.createElement( "span" );
        temp.innerHTML = "new_pass:";
        this.node.cont.appendChild( temp );
        
        (this.node.new_pass = document.createElement( "input" )).type= "password";
        this.node.cont.appendChild( this.node.new_pass );

        /* Commit */
        this.node.commit = document.createElement( "button" );
        this.node.commit.innerHTML = "commit";
        this.node.commit.onclick = function()
        {
            me.ipcm.send_msg( me.node.comp.value, me.node.msg_type.value, eval("("+me.node.msg.value+")"), function(type, data){ if( me.node.msg_type.value == "cacs_dh_req" ){ me.on_dh_ack( data );}else if( me.node.msg_type.value == "cacs_login_req" ){ me.on_login_ack( data ); }else{ me.on_test_ack( data ); }});
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
            me.node.comp.value = "ccds";
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
            var pass = me.ipcm.des_md5_encrypt( me.node.pass.value, me.ipcm.share_key );
            me.node.comp.value = "ccds";
            me.node.msg_type.value = "cacs_login_req";
            me.node.msg.value = "{lid:'" + me.ipcm.lid + "', nid:'" + nid + "', user:'test01', pass:'" + pass + "', user_refer:'xxx', session_req:1, session_refer:'xxx', login_refer:'xxx'}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* acs.bind */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "bind";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 2, me.ipcm.lid, 5, me.ipcm.share_key );
            var pass = me.ipcm.des_md5_encrypt( me.node.pass.value, me.ipcm.share_key );
            me.node.comp.value = "ccds";
            me.node.msg_type.value = "cacs_bind_req";
            me.node.msg.value = "{nid:'" + nid + "', user:'test01', email:'', mobile:'', pass:'" + pass + "', lang:'en'}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* acs.reg */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "reg";
        this.node.btn.onclick = function()
        {
            var pass = me.ipcm.des_md5_encrypt( me.node.pass.value, me.ipcm.share_key );
            me.node.comp.value = "ccds";
            me.node.msg_type.value = "cacs_reg_req";
            me.node.msg.value = "{lid:'" + me.ipcm.lid + "', user:'xxx', mail:'xxx@163.com', pass:'" + pass + "', user_refer:'xxx'}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* acs.query */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "query";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 2, me.ipcm.lid, 5, me.ipcm.share_key );
            me.node.comp.value = "ccds";
            me.node.msg_type.value = "cacs_query_req";
            me.node.msg.value = "{nid:'" + nid + "', user:'test01'}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* acs.recovery */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "recovery";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 2, me.ipcm.lid, 6, me.ipcm.share_key );
            me.node.comp.value = "ccds";
            me.node.msg_type.value = "cacs_recovery_req";
            me.node.msg.value = "{nid:'" + nid + "', user:'xxx', lang:'xxx'}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* acs.logout */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "logout";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "ccds";
            me.node.msg_type.value = "cacs_logout_req";
            me.node.msg.value = "{nid:'" + nid + "'}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* acs.pass */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "pass";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 2, me.ipcm.lid, 7, me.ipcm.share_key );
            var old_pass = me.ipcm.des_md5_encrypt( me.node.pass.value, me.ipcm.share_key );
            var new_pass = me.ipcm.des_md5_encrypt( me.node.new_pass.value, me.ipcm.share_key );
            me.node.comp.value = "ccds";
            me.node.msg_type.value = "cacs_passwd_req";
            me.node.msg.value = "{nid:'" + nid + "', old_pass:'" + old_pass + "', new_pass:'" + new_pass + "', guest:0, user:''}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* acs.su_pass */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "su_pass";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 2, me.ipcm.lid, 8, me.ipcm.share_key );
            var old_pass = me.ipcm.des_md5_encrypt( me.node.pass.value, me.ipcm.share_key );
            var new_pass = me.ipcm.des_md5_encrypt( me.node.new_pass.value, me.ipcm.share_key );
            me.node.comp.value = "ccds";
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
            me.node.comp.value = "ccds";
            me.node.msg_type.value = "cacs_check_nid_req";
            me.node.msg.value = "{nid:'" + nid + "', flag:''}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* clicm */
        var temp = document.createElement( "span" );
        temp.innerHTML = "<br>clicm:";
        this.node.cont.appendChild( temp );

        /* clicm.query */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "query";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "clicm";
            me.node.msg_type.value = "clicm_query";
            me.node.msg.value = "{nid:'" + nid + "', user:'xxxx', start:0, counts:0, flag:0, save_file:0, acodes:''}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* clicm.query.help */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "query.help";
        this.node.btn.onclick = function()
        {
            me.node.help.innerHTML = "1: grant log; 2: summary; 10: test sn; 11: sn; 12:active test sn; 13: active sn; 14:inactive test sn; 15:inactive sn; 20:sn info 100:log";
        }
        this.node.cont.appendChild( this.node.btn );

        /* clicm.grant */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "grant";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "clicm";
            me.node.msg_type.value = "clicm_granted_active_code";
            me.node.msg.value = "{nid:'" + nid + "', user:'xxxx', num:0, code_type:0, active_num:0}";
        }
        this.node.cont.appendChild( this.node.btn );

        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "alloc";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "clicm";
            me.node.msg_type.value = "clicm_get_active_code";
            me.node.msg.value = "{nid:'" + nid + "', code_type:1, num:0, mfc:'f001'}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* dump */
        var temp = document.createElement( "span" );
        temp.innerHTML = "<br>dump:";
        this.node.cont.appendChild( temp );

        /* dump.clicm */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "dump";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "clicm";
            me.node.msg_type.value = "clicm_debug";
            me.node.msg.value = "{nid:'" + nid + "', password:'pass', method:'dump', start:0, counts:0, size:0, args:['--type', 'all', '--filter_user', '']}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* calc_pass */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "calc_pass";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "clicm";
            me.node.msg_type.value = "clicm_calc_pass";
            me.node.msg.value = "{nid:'" + nid + "', sn:'', ctx:'', manage_pass:1,user_pass:''}";
        }
        this.node.cont.appendChild( this.node.btn );

        /* calc_pass */
        this.node.btn = document.createElement( "button" );
        this.node.btn.innerHTML = "calc_pass_right_set";
        this.node.btn.onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            me.node.comp.value = "clicm";
            me.node.msg_type.value = "clicm_debug";
            me.node.msg.value = "{nid:'" + nid + "', password:'pass', method:'set_calc_pass_right', args:['--user', 'xxx', '--sn', '', '--right', '']}";
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
    
    on_test_ack:function( data )
    {
        var me = this;

        this.node.info.innerHTML = codec.str_2_html( codec.obj_2_str( data )).replace(/\\r\\n/g, "<br>");
        this.ipcm.update();
    }
}
