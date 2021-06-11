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
            rpc.call({srv:"http://www.mipcm.com/", to:to, type:type, data:data, static:false, way:"json", ref:ref,
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
    pwd_list:["1jfiegaaaaeqq",
    "9a6613755f8c591b459061baf19c69e5",
    "c569bd28a95b381517470aff5b820dba",
    "1jfiegbpv31qq",
    "d230bb360f892f2a14c7a000f8daee0a",
    "eafd118e973f5b65484a64883a4ad278",
    "c81fd7ba3ec7ff93e9ba99714e563b8c",
    "a8e23cd1cecfd4236fba7e8255c7cdd0"],
    create:function( obj )
    {
        var me = this;
        this.node = {};
        this.ipcm = obj.ipcm;

        this.node.cont = document.createElement( "div" );
        this.ipcm.node.cont.appendChild( this.node.cont );
        this.tables = [];

        /* Commit */
        this.node.commit = document.createElement( "button" );
        this.node.commit.innerHTML = "刷新";
        this.node.commit.onclick = function()
        {
            me.table_clear ();
            for (i = 0; i < me.ipc_list.length; i++)
            {
                var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );

                me.ipcm.send_msg ("ccms", "ccm_debug",
                {Session:{Nid:nid, SerialNumber:me.ipc_list[i]}, password:me.pwd_list[i], method:"sd_dump"},
                function (type, data, ref) {
                    me.on_ccm_debug_ack (type, data, ref);
                }, me.ipc_list[i]);
            }
        }
        this.node.cont.appendChild( this.node.commit );
        this.dh_req ();

        this.ctrl_table_create ();
        this.table_create ();

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

    ctrl_table_create: function ()
    {
        this.ctrl_wrapper = document.createElement ("div");
        this.ctrl_table = document.createElement ("table");

        var tr = document.createElement ("tr");

        tr.innerHTML = "<th>设备ID</th>";
    },

    ctrl_table_destroy: function ()
    {
    },

    table_create: function ()
    {
        var row1, row2, cell;

        this.st_table = document.createElement ("table");

        row1 = document.createElement ("tr");
        row1.innerHTML = "<th rowspan='2'>设备ID</th>"
        + "<th rowspan='2'>容量</th>"
        + "<th rowspan='2'>开始时间</th>"
        + "<th rowspan='2'>录制时长</th>"
        + "<th colspan='5'>重启</th>"
        + "<th rowspan='2'>只读</th>"
        + "<th rowspan='2'>删除日志</th>"
        + "<th rowspan='2'>删除图片</th>"
        + "<th rowspan='2'>删除录像</th>"
        + "<th rowspan='2'>删除容量</th>"
        + "<th rowspan='2'>录像</th>"
        + "<th rowspan='2' title='此按钮会格式化SD卡，清空debug日志，并重启'>清空</th>"
        + "<th rowspan='2'>流水</th>";

        row2 = document.createElement ("tr");
        row2.innerHTML = "<th>总数</th>"
        + "<th>正常</th>"
        + "<th>异常</th>"
        + "<th>最大间隔</th>"
        + "<th>最小间隔</th>";

        this.st_table.appendChild (row1);
        this.st_table.appendChild (row2);

        this.node.cont.appendChild(this.st_table);
        this.st_table.border = 1;

        this.st_div = document.createElement ("div");
        this.node.cont.appendChild (this.st_div);
    },

    table_clear: function ()
    {
        while (this.st_table.rows.length > 2)
        {
            this.st_table.deleteRow (2);
        }

        while (this.launch_div)
        {
            remove_self (this.launch_div);
            this.launch_div = null;
        }
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
            var pass = me.ipcm.des_md5_encrypt( "232920137", me.ipcm.share_key );

            this.ipcm.send_msg ("ccm", "cacs_login_req", {lid:me.ipcm.lid, nid:nid, user:"xianwei", pass:pass, session_req:1}, function (type, data) {
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
        }
    },
    on_ccm_debug_ack:function (type, msg, ref)
    {
        var me = this;
        var row = document.createElement ("tr");
        var max_interval = 0, min_interval = 999;

        if (msg.Result && msg.Result.Reason)
        {
            row.innerHTML = "<td>" + ref + "</td><td colspan='16'>" + msg.Result.Reason + "</td>";
            this.st_table.appendChild (row);

            return;
        }

        var del_size = 0, del_msg_count = 0, del_img_count = 0;

        var capacity = (/\[[^\]]*]/).exec (msg.sresult);
        var launch_list = msg.sresult.match (/mipcm startup success/g) || [];
        var normal_reboot_times = msg.sresult.match (/reboot/g) || [];
        var readonly_list = msg.sresult.match (/readonly/g) || [];
        var del_record_list = msg.sresult.match (/remove/g) || [];
        var del_size_list = msg.sresult.match (/\d+(.\d+)?(?=MB space)/g) || [];
        del_size_list.forEach (function (item, i, array) {
            del_size += parseInt (item);
        });
        var del_msg_list = msg.sresult.match (/\d+(.\d+)?(?= message,)/g) || [];
        del_msg_list.forEach (function (item, i, array) {
            del_msg_count += parseInt (item);
        });
        var del_img_list = msg.sresult.match (/\d+(.\d+)?(?= image)/g) || [];
        del_img_list.forEach (function (item, i, array) {
            del_img_count += parseInt (item);
        });

        var list = msg.sresult.split (/\n/g) || [];
        var date1 = new Date();
        for (var i = 0; i < list.length; i++) {
            if (list[i].indexOf ("2013") >= 0) {
                date1 = new Date (list[i].substring (0, 28)).cst_fixed();
                break;
            }
        }

        var prev_date = null, t_date = null, now_date = new Date ();
        for (var i = 0; i < list.length; i++) {
            if (list[i].indexOf ("2013 mipcm startup success") >= 0)
            {
                if (!prev_date) prev_date = new Date (list[i].substring (0, 28)).cst_fixed();
                else {
                    t_date = new Date (list[i].substring (0, 28)).cst_fixed();

                    var t = (t_date - prev_date) / 3600 / 1000;
                    if (t > max_interval) max_interval = t;
                    if (t < min_interval) min_interval = t;

                    prev_date = t_date;
                }
            }
        }

        if (prev_date) {
            var t = (now_date - prev_date) / 3600 / 1000;
            if (t > max_interval) max_interval = t;
            if (t < min_interval) min_interval = t;
        }

        row.innerHTML = "<td>" + ref + "</td>"
        + "<td>" + capacity + "</td>"
        + "<td>" + date1.toLocaleString() + "</td>"
        + "<td>" + ((now_date - date1) / 3600 / 1000).toFixed(1) + "小时</td>"
        + "<td>" + (launch_list.length - 1) + "</td>"
        + "<td>" + normal_reboot_times.length + "</td>"
        + "<td>" + (launch_list.length - 1 - normal_reboot_times.length) + "</td>"
        + "<td>" + max_interval.toFixed(1) + "小时</td>"
        + "<td>" + min_interval.toFixed(1) + "小时</td>"
        + "<td>" + readonly_list.length + "</td>"
        + "<td>" + del_msg_count + "</td>"
        + "<td>" + del_img_count + "</td>"
        + "<td>" + del_record_list.length + "</td>"
        + "<td>" + (del_size / 1024).toFixed(1) + "G</td>"
        + "<td><button id='record_" + ref + "'>" +  (msg.iresult ? "关闭":"开启") + "</button></td>"
        + "<td><button id='clear_" + ref + "'>清空</button></td>"
        + "<td><button id='show_log_" + ref + "'>显示</button></td>";

        this.st_table.appendChild (row);

        mx("#record_" + ref).dev_id = ref;
        mx("#record_" + ref).onclick = function () {
            this.disable = 1;
            var record_btn = this;
            if (this.innerHTML == "开启") {
                me.record_start (this.dev_id, function (result) {
                    record_btn.disable = 0;

                    if (result == 0)
                        record_btn.innerHTML = "关闭";
                });
            }
            else {
                me.record_stop (this.dev_id, function (result) {
                    record_btn.disable = 0;

                    if (result == 0)
                        record_btn.innerHTML = "开启";
                });
            }
        }

        mx("#clear_" + ref).dev_id = ref;
        mx("#clear_" + ref).onclick = function () {
            var clear_btn = this;
            this.disable = 1;
            me.sd_dump_clear (this.dev_id, function () {
                clear_btn.disable = 1;
            });
        }

        mx("#show_log_" + ref).dev_id = ref;
        mx("#show_log_" + ref).onclick = function () {
            var log = mx("#log_" + this.dev_id);
            if (this.innerHTML == "显示") {
                log.style.display = 'block';
                this.innerHTML = "隐藏";
            }
            else {
                log.style.display = '';
                this.innerHTML = "显示";
            }
        }

        var log = document.createElement ("div");
        log.innerHTML = msg.sresult.replace (/\r?\n/g, "<br>");
        log.className = "ipc_log";
        log.id = "log_" + ref;
        this.st_div.appendChild (log);

        this.launch_table_create (ref, list);
    },

    launch_table_create: function (dev_id, list)
    {
        if (!this.launch_div)
        {
            this.launch_div = document.createElement ("div");
            this.node.cont.appendChild (this.launch_div);

            this.launch_div.className = "launch";
        }

        var table = document.createElement ("table");
        this.launch_div.appendChild (table);

        var row = document.createElement ("tr");
        row.innerHTML = "<th colspan='2'>" + dev_id + "</th>";
        table.appendChild (row);

        var row = document.createElement ("tr");
        row.innerHTML = "<th>登录</th><th>时间</th>";
        table.appendChild (row);

        for (var i = j = 0; i < list.length; i++)
        {
            if (list[i].indexOf ("2013 mipcm startup success") >= 0)
            {
                var row = document.createElement ("tr");
                var date1 = new Date (list[i].substring (0, 28)).cst_fixed();

                row.innerHTML = "<td>" + (++j) + "</td>"
                + "<td>" + date1.toLocaleString() + "</td>";

                table.appendChild (row);
            }
        }
    },

    sd_dump_clear: function (dev_id, callback)
    {
        var me = this;
        var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );

        me.ipcm.send_msg ("ccms", "ccm_debug",
        {Session:{Nid:nid, SerialNumber:dev_id}, password:"mining@sz@2010", method:"sd_dump_refresh"},
        function (type, data, ref) {
            callback ();
        });
    },

    record_start: function (dev_id, callback)
    {
        var me = this;
        var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
        this.ipcm.send_msg ("ccm", "CcmSetRecordingTaskConfigurationRequest",
        {Session:{Nid:nid, SerialNumber:dev_id}, TaskConfiguration:{TimeRecord:{Enable:1, AllTime:1}, ProfileToken:'p0'}}, function (type, msg) {
            callback (msg.Result.length == 0);
        });
    },

    record_stop: function (dev_id, callback)
    {
        var me = this;
        var nid = me.ipcm.create_nid( 0, me.ipcm.sid, me.ipcm.seq, me.ipcm.share_key );
        this.ipcm.send_msg ("ccm", "CcmSetRecordingTaskConfigurationRequest",
        {Session:{Nid:nid, SerialNumber:dev_id}, TaskConfiguration:{TimeRecord:{Enable:0, AllTime:0}, ProfileToken:'p0'}}, function (type, msg) {
            callback (msg.Result.length == 0);
        });
    },

    reboot_table_create: function (list)
    {
        var table = document.createElement ("table");

        var row = document.createElement ("tr");

        row.innerHTML = "<th></th><th></th>";

        for (var i = 0; i < list.length; i++)
        {
        }
    },

    on_test_ack:function( data )
    {
        var me = this;

        this.node.info.innerHTML = codec.str_2_html( codec.obj_2_str( data )).replace(/\\r\\n/g, "<br>");
        this.ipcm.update();
    }
}
