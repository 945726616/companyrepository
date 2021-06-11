Date.prototype.cst_fixed = function ()
{
    this.setHours (this.getHours() - 14);

    return this;
}

function ipcm( obj )
{
    this.create( obj );
}

ipcm.prototype =
{
    l_srv : window.location.host,
    
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

    send_msg:function( to, type, data, on_ack, ref)
    {
        if(this.local_debug)
        {
            this.do_local_debug(type, data, on_ack);
            return;
        }
        else
        {
            var me = this;
            rpc.call({srv:"http://" + this.l_srv + "/", to:to, type:type, data:data, way:"json", ref:ref,
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
    ipc_list:["1jfiegaaaaeqq", "1jfiegbpv36lq", "1jfiegbpv5dtq", "1jfiegbpv31qq", "1jfiegbpv5h1a", "1jfiegbpv5gmq", "1jfiegbpv5gpq", "1jfiegbpv5gra"],
    sn:null,
    create:function( obj )
    {
        var me = this, rate_select;
        this.node = {};
        this.ipcm = obj.ipcm;

        this.node.cont = document.createElement( "div" );
        this.ipcm.node.cont.appendChild( this.node.cont );

        this.node.login_wrapper = document.createElement ("div");
        this.node.cont.appendChild (this.node.login_wrapper);

        var login_table = document.createElement ("table");
        this.node.login_wrapper.appendChild (login_table);

        var row = document.createElement ("tr");
        row.innerHTML = "<tr><td>设备id：</td><td><input type='text' id='user_input'></input></td></tr>";
        login_table.appendChild (row);

        var row = document.createElement ("tr");
        row.innerHTML = "<tr><td>密码：</td><td><input type='password' id='password_input'></input></td></tr>";
        login_table.appendChild (row);

        var row = document.createElement ("tr");
        row.innerHTML = "<tr><td></td><td><button id='login_btn'>登录</button></td></tr>";
        login_table.appendChild (row);
    
        me.get_device_info();
        mx("#login_btn").onclick = function () {
            me.dh_req ();
        }

        this.node.update_div = document.createElement ("div");
        this.node.update_div.style.display = "none";
        this.node.cont.appendChild (this.node.update_div);

        var update_table = document.createElement ("table");
        update_table.border = 1;
        this.node.update_div.appendChild (update_table);

        var row = document.createElement ("tr");
        row.innerHTML = "<tr><td>设备sn</td><td><input id='sn_input'></input></td></tr>";
        update_table.appendChild (row);

        var row = document.createElement ("tr");
        row.innerHTML = "<tr><td>项目</td><td><select id='prj_select'>"
        + "<option value='0'>定频测试</otpion>"
        + "<option value='1'>单频载波</otpion>"
        update_table.appendChild (row);

        var row = document.createElement ("tr");
        row.innerHTML = "<tr><td>信道</td><td><select id='chl_select'>"
        + "<option value='0'>自动</otpion>"
        + "<option value='1'>1</otpion>"
        + "<option value='2'>2</otpion>"
        + "<option value='3'>3</otpion>"
        + "<option value='4'>4</otpion>"
        + "<option value='5'>5</otpion>"
        + "<option value='6'>6</otpion>"
        + "<option value='7'>7</otpion>"
        + "<option value='8'>8</otpion>"
        + "<option value='9'>9</otpion>"
        + "<option value='10'>10</otpion>"
        + "<option value='11'>11</otpion>"
        + "<option value='12'>12</otpion>"
        + "<option value='13'>13</otpion>"
        + "<option value='14'>14</otpion>"
        + "</select></td></tr>";
        update_table.appendChild (row);

        var row = document.createElement ("tr");
        row.innerHTML = "<tr><td>功率</td><td><input id='pwr_input'></input></td></tr>";
        update_table.appendChild (row);

        var row = document.createElement ("tr");
        row.id = "mode_row";
        row.innerHTML = "<tr><td>模式</td><td><select id='mode_select'>"
        + "<option value='1' selected='selected'>CCK(802.11b)</option>"
        + "<option value='4'>OFDM(802.11g)</option>"
        + "<option value='6'>Green Field(802.11n)</option>"
        + "</select></td></tr>";
        update_table.appendChild (row);
        mx("#mode_select").onchange = function () {
            if (this.options[this.selectedIndex].value == '1') { // cck
                mx("#cck_row").style.display = '';
                mx("#ofdm_row").style.display = 'none';
                mx("#mcs20_row").style.display = 'none';
                mx("#mcs40_row").style.display = 'none';
                mx("#bw_row").style.display = "none";

                rate_select = mx("#cck_select");
            }
            else if (this.options[this.selectedIndex].value == '4') { // ofdm
                mx("#cck_row").style.display = 'none';
                mx("#ofdm_row").style.display = '';
                mx("#mcs20_row").style.display = 'none';
                mx("#mcs40_row").style.display = 'none';
                mx("#bw_row").style.display = "none";

                rate_select = mx("#ofdm_select");
            }
            else { // 6, 11n mode
                mx("#cck_row").style.display = 'none';
                mx("#ofdm_row").style.display = 'none';
                mx("#bw_row").style.display = "";
                if (mx("#bw_select").options[mx("#bw_select").selectedIndex].value == '0') { // 20MHz
                    mx("#mcs20_row").style.display = '';
                    mx("#mcs40_row").style.display = 'none';

                    rate_select = mx("#mcs20_select");
                }
                else {
                    mx("#mcs20_row").style.display = 'none';
                    mx("#mcs40_row").style.display = '';

                    rate_select = mx("#mcs40_select");
                }
            }
        }

        var row = document.createElement ("tr");
        row.id = "bw_row";
        row.style.display = 'none';
        row.innerHTML = "<tr><td>带宽</td><td><select id='bw_select'>"
        + "<option value='0' selected='selected'>20MHz</otpion>"
        + "<option value='1'>40MHz</otpion>"
        + "</select>"
        + "</td></tr>";
        update_table.appendChild (row);
        mx("#bw_select").onchange = function () {
            if (this.options[this.selectedIndex].value == '0') {
                mx("#mcs20_row").style.display = '';
                mx("#mcs40_row").style.display = 'none';
            }
            else if (this.options[this.selectedIndex].value == '1') {
                mx("#mcs20_row").style.display = 'none';
                mx("#mcs40_row").style.display = '';
            }
        }

        var row = document.createElement ("tr");
        row.id = 'cck_row';
        row.innerHTML = "<tr><td>CCK</td><td><select id='cck_select'>"
        + "<option value='0' selected='selected'>1Mbps</option>"
        + "<option value='1'>2Mbps</option>"
        + "<option value='2'>5.5Mbps</option>"
        + "<option value='3'>11Mbps</option>"
        + "</select></td></tr>";
        update_table.appendChild (row);
        rate_select = mx("#cck_select");

        var row = document.createElement ("tr");
        row.id = 'ofdm_row';
        row.style.display = 'none';
        row.innerHTML = "<tr><td>OFDM</td><td><select id='ofdm_select'>"
        + "<option value='0' selected='selected'>6Mbps</option>"
        + "<option value='1'>9Mbps</option>"
        + "<option value='2'>12Mbps</option>"
        + "<option value='3'>18Mbps</option>"
        + "<option value='4'>24Mbps</option>"
        + "<option value='5'>36Mbps</option>"
        + "<option value='6'>48Mbps</option>"
        + "<option value='7'>54Mbps</option>"
        + "</select></td></tr>";
        update_table.appendChild (row);

        var row = document.createElement ("tr");
        row.id = 'mcs20_row';
        row.style.display = 'none';
        row.innerHTML = "<tr><td>MCS</td><td><select id='mcs20_select'>"
        + "<option value='0' selected='selected'>MCS=0;6.5Mbps</option>"
        + "<option value='1'>MCS=1;13Mbps</option>"
        + "<option value='2'>MCS=2;19.5Mbps</option>"
        + "<option value='3'>MCS=3;26Mbps</option>"
        + "<option value='4'>MCS=4;39Mbps</option>"
        + "<option value='5'>MCS=5;52Mbps</option>"
        + "<option value='6'>MCS=6;58.5Mbps</option>"
        + "<option value='7'>MCS=7;65Mbps</option>"
        + "<option value='8'>MCS=8;13Mbps</option>"
        + "<option value='9'>MCS=9;26Mbps</option>"
        + "<option value='10'>MCS=10;39Mbps</option>"
        + "<option value='11'>MCS=11;52Mbps</option>"
        + "<option value='12'>MCS=12;78Mbps</option>"
        + "<option value='13'>MCS=13;104Mbps</option>"
        + "<option value='14'>MCS=14;117Mbps</option>"
        + "<option value='15'>MCS=15;130Mbps</option>"
        + "</select></td></tr>";
        update_table.appendChild (row);

        var row = document.createElement ("tr");
        row.id = 'mcs40_row';
        row.style.display = 'none';
        row.innerHTML = "<tr><td>MCS</td><td><select id='mcs40_select'>"
        + "<option value='0' selected='selected'>MCS=0;13Mbps</option>"
        + "<option value='1'>MCS=1;27Mbps</option>"
        + "<option value='2'>MCS=2;40.5Mbps</option>"
        + "<option value='3'>MCS=3;54Mbps</option>"
        + "<option value='4'>MCS=4;81Mbps</option>"
        + "<option value='5'>MCS=5;108Mbps</option>"
        + "<option value='6'>MCS=6;117Mbps</option>"
        + "<option value='7'>MCS=7;130Mbps</option>"
        + "<option value='8'>MCS=8;27Mbps</option>"
        + "<option value='9'>MCS=9;54Mbps</option>"
        + "<option value='10'>MCS=10;81Mbps</option>"
        + "<option value='11'>MCS=11;108Mbps</option>"
        + "<option value='12'>MCS=12;162Mbps</option>"
        + "<option value='13'>MCS=13;216Mbps</option>"
        + "<option value='14'>MCS=14;243Mbps</option>"
        + "<option value='15'>MCS=15;270Mbps</option>"
        + "</select></td></tr>";
        update_table.appendChild (row);

        var row = document.createElement ("tr");
        row.innerHTML = "<tr><td></td><td colspan='2'><button id='chl_btn'>修改</button></td></tr>";
        update_table.appendChild (row);

        mx("#chl_btn").onclick = function()
        {
            var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
            var prj = mx("#prj_select").options[mx("#prj_select").selectedIndex].value;
            var chl = mx("#chl_select").options[mx("#chl_select").selectedIndex].value;
            var bw = mx("#bw_select").options[mx("#bw_select").selectedIndex].value;
            var mode = mx("#mode_select").options[mx("#mode_select").selectedIndex].value;
            var pwr = mx("#pwr_input").value;

            if ((mode == '1') || (mode == '4'))
                bw=0;

            rate = rate_select.options [rate_select.selectedIndex].value;

            me.ipcm.send_msg ("ccm", "ccm_debug_m",
            {sess:{nid:nid, sn:mx("#sn_input").value}, passwd:"mining@sz@2010", method:"update_wireless",
            args:["Project=" + prj, "Channel=" + chl, "HtBw=" + bw, "HT_MCS=" + rate, "WirelessMode=" + mode, "Power=" + pwr]},
            function (type, data) {
                me.on_ccm_debug_ack (data);
            });
	    
        }


        this.node.info = document.createElement ("div");
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

    login_create: function ()
    {
    },
    
    get_device_info: function ()
    {
        this.ipcm.send_msg ("ccm", "CcmGetDeviceRequest",{Session:{}},function (type, data) {
                if ( data.Result.Code == "" )
                {
                    this.sn = data.SerialNumber;
                    mx("#user_input").value = this.sn;
                }
        });
    },

    dh_req:function ()
    {
        var me = this;
        this.ipcm.secret_key = dh.gen_private();
        this.ipcm.pub_key = dh.gen_public(me.ipcm.secret_key);

        this.ipcm.send_msg ("ccm", "cacs_dh_req", {bnum_prime:dh.prime, root_num:dh.g, key_a2b:me.ipcm.pub_key, tid:'1'}, function (type, msg) {
            me.on_dh_ack (msg);
        });
    },

    on_dh_ack:function( data )
    {
        var me = this;

        if( data.result.length == 0 )
        {
            this.ipcm.tid = data.tid;
            this.ipcm.lid = data.lid;
            this.ipcm.share_key = dh.gen_shared_secret( this.ipcm.secret_key, data.key_b2a );

            var nid = me.ipcm.create_nid( 2, me.ipcm.lid, 5, me.ipcm.share_key );
            var pass = me.ipcm.des_md5_encrypt( mx("#password_input").value, me.ipcm.share_key );

            me.ipcm.send_msg ("ccm", "cacs_login_req", {lid:me.ipcm.lid, nid:nid, user:mx("#user_input").value, pass:pass, session_req:1}, function (type, data) {
                me.on_login_ack (data);
            });
        }

        this.ipcm.update();
    },

    on_login_ack:function( data )
    {
        var me = this;

        if( data.result.length == 0 )
        {
            this.ipcm.sid = data.sid;
            this.ipcm.seq = data.seq;

            var username = mx("#user_input").value;

            this.node.login_wrapper.innerHTML = username + "已登录";
            mx("#sn_input").value = username;
            this.node.update_div.style.display = "";
        }
    },

    on_ccm_debug_ack: function (data)
    {
        var me = this;
        this.node.info.innerHTML = codec.str_2_html( codec.obj_2_str( data )).replace(/\\r?\\n/g, "<br>");
    }
}
