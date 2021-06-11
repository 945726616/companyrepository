function mipc_play( dst, param )
{
    var node = {};
    var args;
    var mme_obj = {};
    var secret_key, pub_key, share_key;
    var video_stream_uri="", plug_type,replay_Interval;
    var tid, lid, sid, seq;
    var plug_type, debug=0;
    var action_name="Operation";
    var err_cacs_user_offline_0 = "accounts.user.offline",
        err_cacs_user_offline_1 = "Device Offline",
        err_cacs_user_unknown_0 = "accounts.user.unknown",
        err_cacs_user_unknown_1 = "Invalid user",
        err_cacs_pass_invalid_0 = "accounts.pass.invalid",
        err_cacs_pass_invalid_1 = "Invalid pass";

    play( dst, param );
    function play( dst, param )
    {
        if( dst == null || param == null )
        {
            mlog( action_name+" fail for invalid input param" );
            return;
        }

        if( typeof( dst ) == "object" )
        {
            node.cont = dst;
        }
        else
        {
            if(( node.cont = document.getElementById( dst )) == null )
            {
                mlog( action_name+" fail for param d( " + obj.dst + " ) does not existed" );
                return;
            }
        }

        if( typeof( param ) != "string" )
        {
            mlog( action_name+" fail for param p is not String" );
            return;
        }
        
        args=new Object();   
        var pairs=param.split( "&" );
        for( var i=0; i<pairs.length; i++ )   
        {   
            var pos=pairs[i].indexOf('=');
            if( pos == -1 )
            {
                continue;   
            }
            
            var argname = pairs[i].substring( 0,pos );
            var value = pairs[i].substring( pos+1 );
            args[argname] = unescape( value );
        }

        action_name=(args.t=="reboot")?"Reboot":"Play";
        if( args.u == null )
        {
            mlog( action_name+" fail for invalid param u" );
            return;
        }
        
        if( args.p == null )
        {
            mlog( action_name+" fail for invalid param p" );
            return;
        }
        if( args.t == null )
        {
            args.t="play";
        }
        if( args.r == null || ( args.r != "hd" && args.r != "st" && args.r != "half" && args.r != "min" )&&args.t!="reboot")
        {
            mlog( "Play fail for invalid param r( hd|st|half|min )" );
            return;
        }

        if( args.debug && args.debug == 1 )
        {
            debug = 1;
        }

        /* 1. Start dh */
        secret_key = dh.gen_private();
        pub_key = dh.gen_public(secret_key);
        var msg = "{bnum_prime:'" + dh.prime + "', root_num:'" + dh.g + "', key_a2b:'" + pub_key + "', tid:'1'}";
        send_msg( "ccm", "cacs_dh_req", msg, function(type, data){ on_dh_ack( data );});

    }

    function on_dh_ack( data )
    {
        if( data.result.length == 0 )
        {
            tid = data.tid;
            lid = data.lid;
            share_key = dh.gen_shared_secret( secret_key, data.key_b2a );

            var nid = create_nid( 2, lid, 5, share_key );
            var pass = des_md5_encrypt( args.p, share_key );
            var msg = "{lid:'" + lid + "', nid:'" + nid + "', user:'" + args.u + "', pass:'" + pass + "', user_refer:'xxx', session_req:1, session_refer:'xxx', login_refer:'xxx'}";
            send_msg( "ccm", "cacs_login_req", msg, function(type, data){ on_login_ack( data );});
        }
        else
        {
            mlog( action_name+" fail when dh" );
        }
    }

    function on_login_ack( data )
    {
        if( data.result.length == 0 )
        {
            sid = data.sid;
            seq = data.seq;
            if(args.t=="reboot")
            {
                var nid = create_nid( 0, sid, seq, share_key );
                var msg = "{Session:{Nid:'" + nid + "', SerialNumber:'" + args.u + "'}}";
                send_msg( "ccm", "SystemRebootRequest", msg, function(type, data)
                { 
                    if( data.Result != null && data.Result.Code != null && data.Result.Code.length == 0 )
                    {
                        return;
                    }
                    else
                    {
                        mlog( "Reboot fail ( " + data.Result.SubCode + " )" );
                    }
                });
            }
            else
            {
                var params_obj = {params:{width:document.documentElement.scrollWidth, height:document.documentElement.scrollHeight}};
                params_obj.key = 'data:application/octet-stream;base64,NGO/Mnqt7aXYO3hdsIe87bCTuqTRRSPMwJGuT26CuSedGTi2h7wroHY0IZObBPKYA/exp+e/efFj35sLiDKQpRfRFz8Th8zlYtrYki24JiN7vpGb2bUN9nY7quZ56SicUoqLd+KcCrvWheZ5NaE+slPpCg+F+hUdhNl4JXbVxzxY0uNV6ci7eEG44g4nf+TVB84SbVPllsSLhoQ4u6bGgiijR4s2A7HIDhEXTxEZIRjqSIH4QVUQUpkiIsQVwCm7gEXMGjvIhSv1CemWWX/C8HTPDxSWZgyVSXVVaPx/bEcSdcz/t6FKbx/crZ4xOry5PcdTd9zGMPxWo/2j2WrlWspUpkM4DJvNu3lhaO2Y3Y8G0Ly2e/em84b23Uu56U3nQdF+4Yv9jSvSoK6GyG0xuA3zbw/A2tKCN2yrdTdWX+s+K89rLvcqIAMJ9AAimXCPlKqImtkfJA2Bgp6yjF+AS7CF5MVnYgsLhArJtum+/EOST6Khl18Wz940iBLVyLJOS/25onfm/C3rSXNZmjq95YLT9yp99Qdg/2K7ZS5F1YVZ7C2Puyb99fIyBWGCtRtt0SPs0HRBXorx/zk2fjaR1BwVrStkS5Xkx46JFtCCVez5lmFALtUHS/Qj6Gw8rYICY2peJbztbBpCzJZtPVvIAFylfgMlNBRT8/Zt9G/JJ5g';
                var merge_params = codec.obj_2_str(params_obj);
                mme_obj = new mme({parent:node.cont,
                              params:merge_params,
                              ref_obj:null,
                              on_event:mme_on_event,
                              debug:1,
                              windowless:((0 <= (location.search || location.hash || "").indexOf("windowless=0"))?false:true)});   
            }
            
        }
        else
        {
            if( data.result == err_cacs_user_offline_0 
                || data.result == err_cacs_user_offline_1 )
            {
                mlog( action_name+" fail for device offline" );
            }
            else if( data.result == err_cacs_user_unknown_0 
                || data.result == err_cacs_user_unknown_1 )
            {
                mlog( action_name+" fail for invalid user" );
            }
            else if( data.result == err_cacs_pass_invalid_0
                || data.result == err_cacs_pass_invalid_1 )
            {
                mlog( action_name+" fail for invalid password" );
            }
            else
            {
                mlog( action_name+" fail ( " + data.result + " )" );
            }
        }
    }

    function mme_on_event( obj )
    {
        if( obj.type == "ready" )
        {
            var proto;
            if(obj.plug.type.name == "flash")
            {
                plug_type="flash";
                proto = "rtmp";
            }
            else
            {
                proto = "rtdp";
            }
            get_stream_uri_request(proto);
        }
        if(obj.type == "close")
        {
           var proto;
            if(obj.plug.type.name == "flash")
            {
                plug_type="flash";
                proto = "rtmp";
            }
            else
            {
                proto = "rtdp";
            }
          video_stream_uri = "";
           
         	replay_Interval = setInterval(function(){ 
         	    get_stream_uri_request(proto)                
            },parseInt(30000*Math.random()+30000));
           
        }
    }
		
		function get_stream_uri_request(proto)
		{
				var nid = create_nid( 0, sid, seq, share_key );
        var token=(args.r=="hd")?"p0":((args.r=="st")?"p1":((args.r=="half")?"p2":"p3"));
        var msg = "{Session:{Nid:'" + nid + "', SerialNumber:'" + args.u + "'}, StreamSetup:{Stream:'RTP_Unicast', Transport:{Protocol:'" + proto + "'}}, ProfileToken:'" + token + "'}";
        send_msg( "ccm", "GetStreamUriRequest", msg, function(type, data){ on_get_stream_uri_ack( data );});	
		}
		
    function on_get_stream_uri_ack( data )
    {
        if( data.Result != null && data.Result.Code != null && data.Result.Code.length == 0 )
        {
            if( video_stream_uri != "" )  return;                 
            if( replay_Interval )    clearInterval(replay_Interval);
            video_stream_uri = data.MediaUri.Uri;
            var chl_params="{src:[{url:'" + video_stream_uri + "',thread:'istream',jitter:{init:100,max:5000}}]}";
            mme_obj.chl_create( {params:chl_params} );
        }
        

    }

    function mlog( msg )
    {
        node.cont.innerHTML="<div style=\"height:50%;\"></div><div style=\"text-align:center; margin:auto; \"><span style=\"background:#f36161; padding:10px; border-radius:4px; vertical-align:middle; valign:middle; line-height:30px \">" + msg + "</span>";
    }
    
    function create_nid( id_type, id, seq, share_key )
    {
        var nid = codec.nid( seq, id, share_key, id_type, null, null, md5_ex, "hex" );
        return nid;
    }

    function des_md5_encrypt( message, pass )
    {
        var md5_message = CryptoJS.MD5( message );
        var key = CryptoJS.MD5( pass );
        var iv  = CryptoJS.enc.Hex.parse('0000000000000000');
        var des = CryptoJS.DES.encrypt( md5_message, key, {iv:iv, padding: CryptoJS.pad.NoPadding}).ciphertext.toString();
        return des;
    }
    
    function send_msg( to, type, msg, on_ack)
    {
        var data = eval("("+msg+")");
        if( debug == 1 )
        {
            var rpc_src="http://218.14.146.199:7080/";   
            var rpc_way="json";
        }
        else
        {
            var rpc_src="/";   
            var rpc_way=null;
        }
        
        rpc.call({ srv:rpc_src, to:to, type:type, data:data, "static":false, way:rpc_way, 
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
}
