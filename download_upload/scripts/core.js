/* mining lib js */
function meval(s){ try{return eval("(" + s + ")"); }catch(e){return null;} }

function obj_merge(d, s)
{
    var i, v, o, n;
    if (!s) return d;

    for(n in s)
    {
        if(((v = s[n]) != undefined) && (null != v))
        {
            if (v.constructor === Array)
            {
                d[n] = o = [];
                for (i = 0, len = v.length; i < len; i++)
                {
                    o[i] = v[i];
                }
            }
            else if(typeof(v) != "object"){d[n] = v;}
            else{
                if (((o = d[n]) == undefined) || (null == o)){ d[n] = (o = {}); };
                obj_merge(o, v);
            }
        }
    }
    return d;
}

/*-----------------system object extention tool---------------------------*/
(function(window, String, Date, Array, Function){
    var s_prototype = "prototype",
        Array_prototype = Array[s_prototype],
        String_prototype = String[s_prototype],
        Date_prototype = Date[s_prototype],
        Function_prototype = Function[s_prototype];
        
    String_prototype.cmp = function (s)
    {
        var i, sub, me = this, len = Math.min(me.length, s.length);
        for(i = 0; i < len; i++){ if(sub = me.charCodeAt(i) - s.charCodeAt(i)){ return sub; }; };
        return me.length - s.length;
    }
    String_prototype.trim = function(){return this.replace(/(^\s*)|(\s*$)/g, "");}

    Date_prototype.toString1 = function ()
    {
        var me = this,
            mon = me.getMonth() + 1,
            day = me.getDate(),
            hour = me.getHours(),
            min = me.getMinutes(),
            sec = me.getSeconds();
    
        return me.getFullYear() + "年"
            + ((mon < 10) ? "0":"") + mon + "月"
            + ((day < 10) ? "0":"") + day + "日"
            + ((hour < 10) ? "0":"") + hour + ":"
            + ((min < 10) ? "0":"") + min + ":"
            + ((sec < 10) ? "0":"") + sec;
    }

    Array_prototype.filter = Array_prototype.filter || function (fun)
    {
        var i, val, me = this, len = me.length, res = [], thisp = arguments[1];
        if (typeof fun != "function")
        {
            throw new TypeError();
        }

        for (i = 0; i < len; i++)
        {
            if (i in me)
            {
                val = me[i];
                if (fun.call(thisp, val, i, me))
                {
                    res.push(val);
                }
            }
        }

        return res;
    };

    Array_prototype.some = Array_prototype.some || function(fun /*, thisp*/)
    {
        var me = this, i, len = me.length, thisp = arguments[1];
        if (typeof fun != "function")
        throw new TypeError();

        for (i = 0; i < len; i++)
        {
            if (i in me && fun.call(thisp, me[i], i, me))
            return true;
        }

        return false;
    };

    Array_prototype.forEach = Array_prototype.forEach || function(fun /*, thisp*/)
    {
        var i, me = this, len = me.length, thisp = arguments[1];
        if (typeof fun != "function")
        throw new TypeError();

        for (i = 0; i < len; i++)
        {
            if (i in me)
            fun.call(thisp, me[i], i, me);
        }
    };

    (window.publisher = function()
    {
        this.subscribers = [];
    })[s_prototype].deliver = function ()
    {
        var i = 0, obj, me = this, len, subscribers = me.subscribers, prev_len = subscribers.length;
        while(i < prev_len)
        {
            obj = subscribers[i];
            if (me.filter && !me.filter (obj, arguments)) { i++; continue; }
            obj.fn.apply (obj.fn, arguments);
            len = subscribers[s_length];
            if (prev_len > len) { prev_len = len; }
            else { i++; }
        }    
        return me;
    }

    Function_prototype.subscribe = function (_publisher)
    {
        var len, i = 1, obj = {}, me = this, already_exists = _publisher.subscribers.some (
            function (el) {
                return el.fn === me;
            }
        );
    
        if (!already_exists) {
            for (len = arguments.length; i < len; i++)
            {
                obj ["arg" + (i - 1)] = arguments[i];
            }
    
            obj.fn = me;
            _publisher.subscribers.push (obj);
        }
    
        return me;
    }

    Function_prototype.unsubscribe = function (_publisher)
    {
        var me = this;
        _publisher.subscribers = _publisher.subscribers.filter (
            function (el) {
                return el.fn !== me;
            }
        );
    
        return me;
    };
})(window, String, Date, Array, Function);
/*-----------------system object extention tool---------------------------*/


/*-----------------codec--------------------------------------------------*/
var codec = null;
(function(Array, meval){
    var s_object    = "object",
        fn_v2c      = String.fromCharCode,
        fn_meval    = meval,
        utf8_c      = [0x00,0xc0,0xe0,0xf0,0xf8,0xfc],
        s_hex       = "0123456789abcdef",
        s_base62    = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
        s_base64    = s_base62 + "+/=",
        s_mining64  = s_base62 + "_.-",
        uri_map     = {},
        html_map    = [['&','&amp;'], ['\\n','&#10;'], ['\\r','&#13;'], ['\\t','&#9;'], ['`','&#96;'], ['\'','&#39;'], ['"','&quot;'], [' ','&nbsp;'], ['<','&lt;'], ['>','&gt;']],
        ubb_map = [ {s:/\[img\]([^\]]*)\[\/img\]/gi, d:'<img src="$1" border="0"/>'},
                    {s:/\[flash\]([^\]]*)\[\/flash\]/gi,
                     d:'<embed type="application/x-shockwave-flash"'
                        + ' pluginspage="http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash"'
                        + ' quality="heigh" src="$1"/></embed>'},
                    {s:/\[url=([^\]]*)\]([^\]]*)\[\/url\]/gi, d:'<a href="$1" target="_blank">$2</a>'},
                    {s:/\[url\]([^\]]*)\[\/url\]/gi, d:'<a href="$1" target="_blank">$1</a>'},
                    {s:/\[email=([^\]]*)\]([^\]]*)\[\/email\]/gi, d:'<a href="mailto:$1">$2</a>'},
                    {s:/\[email\]([^\]]*)\[\/email\]/gi, d:'<a href="mailto:$1">$1</a>'},
                    {s:/\[color=([^\]]*)\]([^\]]*)\[\/color\]/gi, d:'<font color="$1">$2</font>'},
                    {s:/\[face=([^\]]*)\]([^\]]*)\[\/face\]/gi, d:'<font face="$1">$2</font>'},
                    {s:/\[size=1\]([^\]]*)\[\/size\]/gi, d:'<font size="1">$1</font>'},
                    {s:/\[size=2\]([^\]]*)\[\/size\]/gi, d:'<font size="2">$1</font>'},
                    {s:/\[size=3\]([^\]]*)\[\/size\]/gi, d:'<font size="3">$1</font>'},
                    {s:/\[size=4\]([^\]]*)\[\/size\]/gi, d:'<font size="4">$1</font>'},
                    {s:/\[align=([^\]]*)\]([^]]*)\[\/face\]/gi, d:'<align="$1">$2</align>'},
                    {s:/\[fly\]([^\]]*)\[\/fly\]/gi, d:'<marquee>$1</marquee>'},
                    {s:/\[b\]([^\]]*)\[\/b\]/gi, d:'<b>$1</b>'},
                    {s:/\[i\]([^\]]*)\[\/i\]/gi, d:'<i>$1</i>'},
                    {s:/\[u\]([^\]]*)\[\/u\]/gi, d:'<u>$1</u>'},
                    {s:/\[code\]([^\]]*)\[\/code\]/gi, d:'<pre><font size="2" face="Verdana,Arial">$1</font></pre>'},
                    {s:/\[list\]([^\]]*)\[\/list\]/gi, d:'<ul>$1</ul>'},
                    {s:/\[list=1\]([^\]]*)\[\/list\]/gi, d:'<ol type="1">$1</ol>'},
                    {s:/\[list=a\]([^\]]*)\[\/list\]/gi, d:'<ol type="a">$1</ol>'},
                    {s:/\[\*\]([^\]]*)\[\/\*\]/gi, d:'<li>$1</li>'},
                    {s:/\[quote\]([^\]]*)\[\/quote\]/gi, d:'<blockquote>$1</blockquote>'}],
        vi,vs;
        
        for(vi = 0, vs = "\0\t\n\r\"\\' #%&+-_./:;=?@"; vi < vs.length; ++vi)
        {
            uri_map[vs.charAt(vi)] = 1;
        }
        
        function fn_c2hex(pfx, v){ return (pfx?pfx:"%") + s_hex.charAt(v >> 4) + s_hex.charAt(v & 15)}
        function fn_hex2i(v){ return ((48 <= v)&&(57 >= v))?(v - 48):(((65 <= v)&&(71 >= v))?(v - 55):(((97 <= v)&&(102 >= v))?(v - 87):0));}
        function fn_i2a(v, min_len)
        {
            var i, j, c, r = "", s = "" + v;
            if(0 == s.indexOf("0x"))
            {/* hex string */
                for(i = s.length - 1; i > 1;)
                {
                    for(c = 0, j = 0; (j < 8) && (i > 1) ; --i, j += 4)
                    {
                        c += (fn_hex2i(s.charCodeAt(i)) << j);
                    }
                    r = fn_v2c(c) + r;
                }
            }
            else
            {/* number */
                for(i = 24; i >= 0; i -= 8)
                {
                    if(v >= (1 << i)){ r += fn_v2c((v >> i) & 0xff);}
                }
            }
            while(r.length < min_len){ r = "\0" + r; };
            return r;
        }
        
        function fn_str_2_b64(s, mining_64){
            var v, sub_bits, bit, j, i = 0, r = "", len = s.length, map = mining_64?s_mining64:s_base64;
            while(i<len)
            {
                for(sub_bits = 0; (sub_bits < 24)&&(i < len); sub_bits += 8,++i)
                { 
                    v = (v << 8) + s.charCodeAt(i); 
                }
                for(j = 0; j < 24; j += 6, v &= ((1 << (sub_bits - j)) - 1))
                {
                    bit = sub_bits - j - 6;
                    r += (j < sub_bits)?map.charAt((bit < 0)?(v << -bit):(v >> bit)):"";
                }
            }            
            return r;
        }

        function fn_str_2_uri_param(s, pfx)
        {
            var c, v, i, j, n, len, cs, r = "";
            for(i = 0, len = s.length; i < len; ++i)
            {
                if(127 >= (v = s.charCodeAt(i))){r += uri_map[c = s.charAt(i)]?fn_c2hex(pfx,v):c; }
                else
                {/* wchar */
                    cs = "";
                    n = (v < 0x80)?0:((v < 0x800)?1:((v < 0x10000)?2:((v < 0x400000)?3:((v < 0x8000000)?4:5))));
                    for(j = n; j > 0; --j, v = v >> 6){ cs = fn_c2hex(pfx,0x80 | (v & 0x3f)) + cs; };
                    v |= utf8_c[n];
                    r += fn_c2hex(pfx,v) + cs;
                }
            }
            return r;
        }

        function fn_uri_param_2_str(s, pfx)
        {
            var c, v, i, imx = s.length, j, k, kmx, r = "";
            pfx = pfx||'%';
            for(i = 0; i < imx;)
            {
                if((pfx != s.charAt(i)) || ((i + 3) > imx)){ r += s.charAt(i); ++i; }
                else
                {
                    c = (fn_hex2i(s.charCodeAt(i + 1) & 0xff) << 4) + fn_hex2i(s.charCodeAt(i + 2) & 0xff);
                    for(j = utf8_c.length, v = 0; j > 1; --j)
                    {
                        if(c >= utf8_c[j - 1])
                        {
                            if((kmx = (i + (3 * j))) <= imx)
                            {
                                v = c - utf8_c[j - 1];
                                for(k = i + 3; k < kmx; k += 3)
                                {
                                    if(pfx != s.charAt(k)){break;}/* invalid */
                                    v = (v << 6) + (((fn_hex2i(s.charCodeAt(k + 1) & 0xff) << 4) + fn_hex2i(s.charCodeAt(k + 2) & 0xff)) & 0x5f);
                                }
                                if(k == kmx){ r += fn_v2c(v); i += (j * 3); }; /* invalid */
                            }
                            break;
                        }
                    }
                    if(0 == v){ r += fn_v2c(c); i += 3; };
                }
            }
            return r;
        }

        function fn_uri_2_obj(s)
        {/*  !!!!!!!!!!!!!!!!!!not match obj_2_uri, if match it need change this, this function just support 1-level param */
            var ret = {}, c, ni, vi, nlen, vlen, i, imx = s.length,
                nc = ((0 < imx) && ('-' == s.charAt(0)))?'-':'=', vc = ('-' == nc)?'-':'&', pfx = (vc == "-")?"_":"%";
            for(i = 1; i < imx; ++i)
            {
                for(ni = i; ((i < imx) && (nc != (c = s.charAt(i))) && (c != vc)); ++i){};/* name*/
                nlen = i - ni;
                i += (((i < imx) && (nc == c))?1:0);

                for(vi = i; ((i < imx) && (vc != s.charAt(i))); ++i){};/*value*/
                vlen = i - vi;

                if((0 < nlen) && (0 < vlen)){ ret[s.substr(ni, nlen)] = fn_uri_param_2_str(s.substr(vi, vlen), pfx); };
            }
            return ret;
        }

        function fn_obj_2_url(obj, split/* default is "&" */)
        {
            var nc = ("-" == split)?"-":"=", vc = ("=" == nc)?"&":"-", pfx = ("-" == split)?"_":"%";
            function _obj_2_uri(obj, path)
            {
                var n, v, x, n_path, s = (obj.constructor == Array)?(path + "__x_countz_" + nc + obj.length):"";
                for(n in obj)
                {
                    if((undefined != (v = obj[n])) && (null != v))
                    {
                        if(x = ('%' == (""+n).charAt(0))){ n = n.substr(1); };
                        n_path = path + ((0 != n)?((("" == path)?"d":"_") + n):"");

                        if (typeof(v) != "function"){
                            if(typeof(v) == s_object)
                            {
                                s += ((""==s)?"":vc) + ((v.constructor == Array)?"":(n_path + nc +"1" + vc)) + _obj_2_uri(v, n_path);
                            }
                            else
                            {
                                s += ((""==s)?"":vc) + n_path + nc + (x?v:fn_str_2_uri_param("" + v, pfx));
                            }
                        }
                    }
                }
                return s;
            };
            return _obj_2_uri(obj, "", split);
        }

        function fn_json_txt_2_url(s, split/* "&" | "-" */)
        {
            var b = s.indexOf("("), e = s.lastIndexOf(")");
            if((0 < b) && (e > b)){ s = s.substring(b+1, e); };
            return fn_obj_2_url(fn_meval(s), split);
        }

        function fn_obj_2_form(obj, action)
        {
            function _obj_2_form(obj, path, cpath)
            {
                var n, v, n_path, n_cpath, arry = obj.constructor == Array,
                    s = arry?("<input type=\"hidden\" name=\"" + path + "__x_countz_\" value=\"" + obj.length +"\"/>\r\n"):"";
                for(n in obj)
                {
                    if((undefined != (v = obj[n])) && (null != v))
                    {
                        n_path = path + ((0 != n)?((("" == path)?"d":"_") + n):"");
                        n_cpath = "" + cpath + (arry?("[" + n + "]"):((("" == cpath)?"":".") + n));
                        if(typeof(v) == s_object)
                        {/* check is object, create a div */
                            s += "<div style=\"border:1px solid #00ffff;padding:2px;\"><br/>\r\n" + ((0 == n)?"":("<input type=\"hidden\" name=\"" + n_path + "\" value=\"1\"/>\r\n")) + _obj_2_form(v, n_path, n_cpath) + "</div>\r\n";
                        }
                        else
                        {
                            s += "<label>" + n_cpath + ":</label>" + "<input type=\"text\" name=\""+ n_path +"\" value=\"" + v + "\"/><br/>";
                        }
                    }
                }
                return s;
            };
            return "<form action=\"" + action + "\" method=\"get\" style=\"border:2px solid blue;padding:1px;\"><button id=\"submit\" type=\"submit\">提交</button><br/>" + _obj_2_form(obj, "", "") + "</form>";
        }

        function fn_obj_2_str(obj)
        {
            if(obj)
            {
                var n, v, i, c, cnt = 0, len, arry = obj.constructor == Array, s = arry?"[":"{";
                for(n in obj)
                {
                    v = obj[n];
                    s += ((0 == (cnt++))?"":",") + (arry?"":(n + ":"));
                    switch(typeof(v))
                    {
                    case "number":{ s += v; break; }
                    case "object":{ s += fn_obj_2_str(v); break; }
                    case "string":
                        s += "\"";
                        for (i = 0, len = v.length; i < len; ++i)
                        {
                            c = v.charAt(i);
                            s += ((c != '\"') && (c != '\\'))?(('\n' == c)?"\\n":((c == '\r')?"\\r":c)):("\\" + c);
                        }
                        s += "\"";
                        break;
                    }
                }
                return s + (arry?"]":"}");
            }
            return "";
        }

        function fn_json_txt_2_form(s, action)
        {
            var b = s.indexOf("("), e = s.lastIndexOf(")");
            if((0 < b) && (e > b)){ s = s.substring(b+1, e); };
            return fn_obj_2_form(fn_meval(s), action);
        }

        function fn_str_2_html(s){ for( var i = 0; i < html_map.length; ++i ){ s = s.replace( new RegExp( html_map[i][0], 'g' ), html_map[i][1]); }; return s; }
        function fn_html_2_str(s){ for( var i = html_map.length - 1; i >= 0; --i ){ s = s.replace( new RegExp( html_map[i][1], 'g' ), html_map[i][0]); }; return s; }
        function fn_ubb_2_html(s){ for( var r, i = ubb_map.length; i >= 0; --i){ r = ubb_map[i]; s = s.replace(r.s, r.d); }; return s; }

        function fn_hex_2_uri_param(s)
        {
            var i, r = "";
            for(i = 0; i < s.length; ++i){ r += ((0 == (1&i))?"%":"") + s.charAt(i); };
            return r;
        }
        
	/* id_type:[ 0:sid, 1:tid, 2:lid ] */
        function fn_nid(seq, id, share_key, id_type, username, password, md5_ex, md5_hex_name)
        {
            var s_seq = fn_i2a(seq), 
                s_id = id?fn_i2a(id):"", 
                s_id_type = id_type?fn_i2a(id_type):"", 
                s_password_md5 = password?fn_i2a("0x" + md5_ex[md5_hex_name](password)):"",
                s_nid_idty = (s_seq?      (fn_v2c((2 << 5) + s_seq.length)       + s_seq):"") 
                           + (s_id?       (fn_v2c((3 << 5) + s_id.length)        + s_id):"")
                           + (s_id_type?  (fn_v2c((4 << 5) + s_id_type.length)   + s_id_type):"")
                           + (username?   (fn_v2c((5 << 5) + username.length)    + username):""),
                s_md5_src =  s_nid_idty
                           + (share_key?(fn_v2c((0 << 5) + share_key.length) + share_key):"")
                           + (s_password_md5?(fn_v2c((0 << 5) + s_password_md5.length) + s_password_md5):"")
                s_md5 = fn_i2a("0x" + md5_ex[md5_hex_name](s_md5_src));
           return  fn_str_2_b64(fn_v2c((1 << 5) + s_md5.length) + s_md5 + s_nid_idty, 1);
        }
        
        function fn_nid2(seq, tid, did, uid, lid, share_key, username, password, md5_ex, md5_hex_name)
        {
            var s_seq = fn_i2a(seq), 
                s_tid = tid?fn_i2a(tid):"", 
                s_did = did?fn_i2a(did):"", 
                s_uid = uid?fn_i2a(uid):"", 
                s_lid = lid?fn_i2a(lid):"", 
                s_password_md5 = password?fn_i2a("0x" + md5_ex[md5_hex_name](password)):"",
                s_nid_idty = (s_seq?      (fn_v2c((2 << 5) + s_seq.length)       + s_seq):"") 
                           + (username?   (fn_v2c((5 << 5) + username.length)    + username):"")
                           + (s_tid?      (fn_v2c((7 << 5) + 10) + fn_v2c(s_tid.length) + s_tid):"")
                           + (s_did?      (fn_v2c((7 << 5) + 11) + fn_v2c(s_did.length) + s_did):"")
                           + (s_uid?      (fn_v2c((7 << 5) + 12) + fn_v2c(s_uid.length) + s_uid):"")
                           + (s_lid?      (fn_v2c((7 << 5) + 13) + fn_v2c(s_lid.length) + s_lid):""),
                s_md5_src =  s_nid_idty
                           + (share_key?(fn_v2c((0 << 5) + share_key.length) + share_key):"")
                           + (s_password_md5?(fn_v2c((0 << 5) + s_password_md5.length) + s_password_md5):"")
                s_md5 = fn_i2a("0x" + md5_ex[md5_hex_name](s_md5_src));
           return  fn_str_2_b64(fn_v2c((1 << 5) + s_md5.length) + s_md5 + s_nid_idty, 1);
        }

        /* asigned to window */
        codec = {
            magic:"codec",
            str_2_b64:fn_str_2_b64,
            str_2_uri_param:fn_str_2_uri_param,
            uri_param_2_str:fn_uri_param_2_str,
            uri_2_obj:fn_uri_2_obj,
            obj_2_url:fn_obj_2_url,
            json_txt_2_url:fn_json_txt_2_url,
            obj_2_form:fn_obj_2_form,
            json_txt_2_form:fn_json_txt_2_form,
            obj_2_str:fn_obj_2_str,
            str_2_html:fn_str_2_html,
            html_2_str:fn_html_2_str,
            ubb_2_html:fn_ubb_2_html,
            hex_2_uri_param:fn_hex_2_uri_param,
            nid:fn_nid,
            nid2:fn_nid2
        }
})(Array, meval);
/*-----------------codec--------------------------------------------------*/

var evt = {
    /* guid:1, */
    bind:function(element, type, handler)
    {
        if (element.attachEvent) { element.attachEvent('on' + type, handler); }
        else if (element.addEventListener) { element.addEventListener(type, handler, false); }
        else element['on' + type] = handler;
    },

    unbind:function(element, type, handler)
    {
        if (element.detachEvent) { element.detachEvent('on' + type, handler); }
        else if (element.removeEventListener) { element.removeEventListener(type, handler, false); }
        else element['on' + type] = null;
    },

    mude:function(e){ if(e.preventDefault) { e.preventDefault (); } else { e.returnValue = false; }; },
    stop:function(e){ if(e.stopPropagation) { e.stopPropagation (); } else { e.cancelBubble = true; }; },

    props: "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),
    fix:function(e)
    {
        var i, n, old_e = e, props = this.props;
        e = {};
        for (i = props.length; i; ) {
            n = props[ --i ];
            e[n] = old_e[n];
        }

        if ( !e.target ) {/* Fix target property, if necessary */
            e.target = e.srcElement || document; /* Fixes #1925 where srcElement might not be defined either */
        }

        if ( e.target.nodeType === 3 ) {/* check if target is a textnode (safari) */
            e.target = e.target.parentNode;
        }

        if ( !e.relatedTarget && e.fromElement ) {/* Add relatedTarget, if necessar */
            e.relatedTarget = e.fromElement === e.target ? e.toElement : e.fromElement;
        }

        if ( e.pageX == null && e.clientX != null ) {/* Calculate pageX/Y if missing and clientX/Y available */
            var doc = document.documentElement, body = document.body;
            e.pageX = e.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
            e.pageY = e.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);
        }

        /* Add which for key events */
        if ( !e.which && ((e.charCode || e.charCode === 0) ? e.charCode : e.keyCode) ) {
            e.which = e.charCode || e.keyCode;
        }

        if ( !e.metaKey && e.ctrlKey ) {/* Add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs) */
            e.metaKey = e.ctrlKey;
        }

        /* Add which for click: 1 === left; 2 === middle; 3 === right; Note: button is not normalized, so don't use it */
        if ( !e.which && e.button !== undefined ) {
            e.which = (e.button & 1 ? 1 : ( e.button & 2 ? 3 : ( e.button & 4 ? 2 : 0 ) ));
        }
        return e;
    }
};

function is_ancestor (ancestor, child)
{
    var e, body = document.body, parentNode = "parentNode";
    if (ancestor == body)
    {
        return true;
    }

    for (e = child[parentNode]; e && e != body; e = e[parentNode])
    {
        if (ancestor === e)
        {
            return true;
        }
    }

    return false;
}

function getElementsByClass (searchClass,node,tag)
{
    var classElements = [];
    if ( node == null )
    node = document;
    if ( tag == null )
    tag = '*';
    var els = node.getElementsByTagName(tag);
    var elsLen = els.length;
    var pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)");
    for (i = 0, j = 0; i < elsLen; i++) {
        if (pattern.test(els[i].className)) {
            classElements[j] = els[i];
            j++;
        }
    }
    return classElements;
}

(function (window, undefined) {
    var html_expr = /^(div|span|button|input|table|row|col|td|tr|option|select|img)/;

    function hehe (selector, context) {
        var match, doc = context || document;

        switch (typeof (selector))
        {
            case 'string':
            {
                var name = selector.substring(1);
                switch(selector.charAt(0)){
                    case '#':
                        return doc.getElementById(name);
                    case '.':
                        return (doc.getElementsByClassName ? doc.getElementsByClassName (name) : getElementsByClass(name, doc));
                    case '/':
                        return doc.getElementsByTagName(name);
                    default:
                        return doc.getElementsByName(selector);
                }
            }

            case 'object':
            {
                return selector;
            }

            case 'function':
            {
                hehe.funcs.push (selector);
            }
        }
    }

    hehe.funcs = [];        // The array of functions to call when the document loads
    hehe.loaded = false;    // The function have not been run yet

    // Run all registered functions in the order in which there were registered.
    // It is safe to call hehe.run() more than once: invocations after the
    // first do noting. It is safe for an initializtion function to call
    // $() to register another function
    hehe.run = function () {
        if (hehe.loaded) return;       // If we've  already run, do nothing

        for (var i = 0; i < hehe.funcs.length; i++) {
            hehe.funcs[i]();
        }

        hehe.loaded = true;         // Remember that we've already run once
        delete hehe.funcs;          // But don't remember the functions themselves.
        delete hehe.run;            // And forget about this function too!
    }

    // Register hehe.run() as the onload event handler for the window
    if (window.addEventListener) { window.addEventListener("load", hehe.run, false); }
    else if (window.attachEvent) window.attachEvent ("onload", hehe.run);
    else window.onload = hehe.run;

    hehe.service_gid = 1052078;
    hehe.ie6 = (navigator.userAgent.indexOf ('MSIE 6.') >= 0);
    hehe.ie = (navigator.userAgent.indexOf('MSIE') >= 0);

    window.hehe = window.mx = hehe;
})(window);

(function(window,document){
    var border_space, padding_space, text_border_space, td_bdv, tmp, agent = navigator.userAgent,
        body/* init flag */,
        opera = 0 <= agent.indexOf("Opera"),
        ie_ver, ie_mode, ie = (!opera) && (0 <= agent.indexOf("compatible")) && (0 <= agent.indexOf("MSIE")),
        firefox = (0 <= agent.indexOf("Firefox")),
        safari = (0 <= agent.indexOf("Safari")) && (0 > agent.indexOf("Chrome")),
        chrome =  0 <= agent.indexOf("Chrome"),
        webkit = 0 <= agent.indexOf("Webkit"),
        gecko = 0 <= agent.indexOf("Gecko"),
        s_offsetWidth = "offsetWidth",
	s_createElement = "createElement",
        inited = false;

    /* test ie ver */
    if(ie)
    {
       if(!(ie_mode = document.documentMode)) { ie_mode = ("CSS1Compat" == document.compatMode)?7:5; }
       tmp = new RegExp("MSIE (\\d+\\.\\d+);");
       tmp.test(agent);
       ie_ver = parseFloat(RegExp["$1"]);
    }

    function init()
    {
        if(body){return;};
        body = document.body;

        tmp = document[s_createElement]("div");
        body.appendChild(tmp);
        tmp.style.cssText = "width:3px;margin:0px;padding:0px;border:1px solid white;";
        border_space = ((tmp[s_offsetWidth] - 3) / 2);
        tmp.style.cssText = "width:3px;border:none;margin:0px;padding:1px;";
        padding_space = ((tmp[s_offsetWidth] - 3) / 2);
        tmp.innerHTML = "<table style=\"border-collapse:separate;border-spacing:0;\"><tr><td style=\"height:3px; border:0px\"></td></tr></table>"
        td_bdv = (((tmp.getElementsByTagName( "td" )[0])[s_offsetHeight] - 3) / 2);
        body.removeChild(tmp);

        tmp = document[s_createElement]("textarea");
        body.appendChild(tmp);
        tmp.style.cssText = "width:10px;border:1px solid white;margin:0px;padding:0px";
        text_border_space = ((tmp[s_offsetWidth] - 10) / 2);
        tmp.style.cssText = "width:10px;border:0px solid white;margin:0px;padding:1px";
        text_padding_space = ((tmp[s_offsetWidth] - 10) / 2);
        body.removeChild(tmp);
    }

    window.hack = {
        magic:"hack",
        ie_mode:ie_mode,
        ie:ie,
        ie_ver:ie_ver,
        chrome:chrome,
        opera:opera,
        get_border_space:function(){ init(); return border_space; },
        get_padding_space:function(){ init(); return padding_space; },
        get_text_border_space:function(){ init(); return text_border_space; },
        get_text_padding_space:function(){ init(); return text_padding_space; },
        get_td_border_space_v:function(){ init(); return td_bdv; },
        css_alpha:function(alpha){ return (ie && (ie_mode < 9))?("filter:alpha(opacity=" + (100.0 * alpha) + ");"):("opacity:" + alpha + ";");},
        get_body_height:function(){ init(); return Math.max(body.clientHeight, ((("CSS1Compat" == document.compatMode) && document.documentElement) || body).clientHeight);},
        css_box_shadow:function(size, color)
        {
            tmp = "2px 2px " + size + "px " + color + ";";
            return (ie && (ie_mode < 9))?
                    (   "filter:progid:DXImageTransform.Microsoft.Shadow(color=" + color + ", Direction=135, Strength=" + Math.round(size / 2) + ");" )
                    :(    "-moz-box-shadow:" + tmp /*firefox*/
                        + "-webkit-box-shadow:" + tmp /*webkit*/
                        + "box-shadow:" + tmp /*opera or ie9*/ );
        }
    };
})(window,document);

function sound_play(wav, swf)
{
    var player = window.snd_player;
    if(!!player)
    {
        if(!hack.ie){ player.innerHTML = ""; };
        player.parentNode.removeChild(player);
    }
    window.snd_player = (player = document.createElement(hack.ie?"embed":"bgsound"));
    player.style.cssText = "width:1px;height:1px;left:0px;top:0px;";
    player.src = (hack.ie?wav:swf);
    if(hack.ie){player.src = wav;}
    else{player.innerHTML = "<embed width='0' height='0' src='" + swf + "'></embed>";}
    document.body.appendChild(player);
}

function dom_get_item_by_name(root, tag_name, name)
{
    if(nodes = root.getElementsByTagName(tag_name))
    {
        for(node_index = 0; node_index < nodes.length; ++node_index)
        {
            node = nodes[node_index];
            if(name == node.getAttribute("name")){ return node; }
        }
    }
    return null;
}

/*-----------------alert_ex--------------------------------------------------*/
var alert_ex = (function () {
    var id = "alert_ex", class_name = "message_box", default_title = "提醒",
    msg_box, close, title, content;

    return function (string1, title1, callback) {
        if (!msg_box)
        {
            msg_box = document.createElement ("div");
            msg_box.id = "alert_ex";
            msg_box.className = "message_box";

            msg_box.innerHTML = '<div class="head"><div class="title"></div></div>'
            + '<div class="body">'
            +   '<div class="content"></div>'
            +   '<div class="submit">'
            +       '<button class="close smallBtn">确定</button>'
            +   '</div>'
            + '</div>';

            document.body.appendChild (msg_box);
            title = $(".title", msg_box)[0];
            content = $(".content", msg_box)[0];
            close = $(".close", msg_box)[0];
            close.onclick = function (e) {
                if (callback)
                {
                    callback ();
                }
                msg_box.style.display = "none";
                evt.stop (e || window.event);
            }
        }

        title.innerHTML = title1 || default_title;
        content.innerHTML = string1;
        msg_box.style.display = "";
        msg_box.style.left = (viewport_width () - msg_box.clientWidth) / 2 + "px";
    }
}) ();
/*-----------------alert_ex--------------------------------------------------*/
/*-----------------tip_ex--------------------------------------------------*/
var tip_ex = (function () {
    var id = "tip_ex", default_title = "提醒", default_timeout = 1500,
    default_interval = 125, timeout_timer, interval_timer,
    msg_box, title, content;

    return function (string1, title1, timeout/* miliseconds */, interval /* miliseconds */) {
        if (!msg_box)
        {
            msg_box = document.createElement ("div")
            msg_box.id = id;
            msg_box.className = "message_box";

            msg_box.innerHTML = '<div class="head"><div class="title"></div></div>'
            + '<div class="body">'
            +   '<div class="content"></div>'
            + '</div>';

            document.body.appendChild (msg_box);
            title = $(".title", msg_box)[0];
            content = $(".content", msg_box)[0];
        }

        title.innerHTML = title1 || default_title;
        content.innerHTML = string1;

        msg_box.style.cssText = "";
        msg_box.style.left = (viewport_width() - msg_box.clientWidth) / 2 + "px";

        if (timeout_timer)
        {
            clearTimeout (timeout_timer);
            timeout_timer = null;
        }

        if (interval_timer)
        {
            clearInterval (interval_timer);
            interval_timer = null;
        }

        timeout_timer = setTimeout (function () {
            var alpha = 1, orig_css = msg_box.style.cssText;
            timeout_timer = null;
            interval_timer = setInterval (function () {
                msg_box.style.cssText = hack.css_alpha (alpha -= 1/4) + orig_css;

                if (alpha == 0)
                {
                    msg_box.style.cssText = "";
                    msg_box.style.display = "none";
                }
            }, interval || default_interval);
        }, timeout || default_timeout);
    }
})();
/*-----------------tip_ex--------------------------------------------------*/
/*-----------------prompt_ex--------------------------------------------------*/
/*
 * question
 * answer
 * ok_callback
 * cancel_callback */
var prompt_ex = (function () {
    var id = "prompt_ex", class_name = "message_box",
    msg_box, question, answer, ok_btn, cancel_btn;

    return function (obj) {
        var me = this, msg_box;

        if (!msg_box)
        {
            msg_box = document.createElement ("div");
            msg_box.id = id;
            msg_box.className = class_name;
            msg_box.innerHTML = '<div class="body">'
            +   '<div class="content">'
            +       '<label class="question"></label>'
            +       '<input class="answer"></input>'
            +   '</div>'
            +   '<div class="submit">'
            +       '<button class="ok smallBtn">确定</button>&nbsp;&nbsp;&nbsp;'
            +       '<button class="cancel smallBtn">取消</button>'
            +   '</div>'
            + '</div>';

            document.body.appendChild (msg_box);

            question = $(".question", msg_box)[0];
            answer = $(".answer", msg_box)[0];
            ok_btn = $(".ok", msg_box)[0];
            cancel_btn = $(".cancel", msg_box)[0];

            answer.onkeypress = function (e) {
                var evt = e || window.event;
                if ((evt.which | evt.keyCode) == 13)
                {
                    ok_btn.click ();
                    evt.returnValue = false;
                }
            }
        }

        question.innerHTML = obj.question;
        answer.value = obj.answer || "";
        answer.select ();

        msg_box.style.display = "";
        ok_btn.onclick = function () {
            if (obj.ok_callback)
            {
                obj.ok_callback (answer.value);
            }
            msg_box.style.display = "none";
        }

        cancel_btn.onclick = function () {
            if (obj.cancel_callback)
            {
                obj.cancel_callback ();
            }
            msg_box.style.display = "none";
        }

        msg_box.style.left = (viewport_width() - msg_box.clientWidth) / 2 + "px";
    }
})();
/*-----------------prompt_ex--------------------------------------------------*/

/* title_twinkle() null clear. */
(function(){
    var oldv, newv, tm, is_new, doc = document, t = "title";
    window.title_twinkle = function(title){
        if (tm)
        {
            clearInterval (tm);
            tm = null;
            if (oldv) doc[t] = oldv;
        }

        if(title) {
            oldv = doc[t];
            doc[t] = (newv = title);
            tm = setInterval(function(){ doc[t] = (is_new = !is_new)?oldv:newv; }, 1000);
        }
    }
})();

function insert_after (node, after)
{
    if (after.nextSibling)
    {
        after.parentNode.insertBefore (node, after.nextSibling);
    }
    else
    {
        after.parentNode.appendChild (node);
    }
}

function remove_self (node)
{
    if (node && node.parentNode)
    {
        node.parentNode.removeChild (node);
    }

    return node;
}

// Get the X coordinate of the element e.
function get_x (e) {
    var x = 0;                  // Start with 0
    while (e) {                 // Start at element e
        x += e.offsetLeft;      // Add in the offset
        e = e.offsetParent;     // Add move up to the offsetParent
    }

    return x;
}

// Get the Y coordinate of the element e.
function get_y (element) {
    var y = 0;
    for (var e = element; e; e = e.offsetParent)            // Iterate the offsetParents
        y += e.offsetTop;

    // Now loop up through the ancestors of the element, looking ofr
    // any that have scrollTop set. Subtract these scrolling values from
    // the total offset. However, we must be sure to stop the loop before
    // we reach document.body, or we'll take document scrolling into account
    // and end up converting our offset to window coordinates.
    for (e = element.parentNode; e && e != document.body; e = e.parentNode)
    {
        if (e.scrollTop) y -= e.scrollTop;
    }

    // This is the Y coordinate with document-internal scrolling accounted for
    return y;
}

function viewport_width () {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
}

function viewport_height () {
    return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}


/*-----------------cookie_ex---------------------------------------------------*/
function cookie_ex(name)
{
    var i, me = this, cookies, allcookies = document.cookie, cookie = null;
    me.name = name;
    me.value = "";
    if (allcookies == "") return;
    cookies = allcookies.split(';');
    for(i = 0; i < cookies.length; i++) {
        cookies[i] = cookies[i].replace(/(^\s*)/g, "");
        if (cookies[i].substring(0, name.length+1) == (name + "=")) {
            cookie = cookies[i];
            break;
        }
    }

    if(cookie == null){ return };
    me.value = decodeURIComponent(cookie.substring(name.length+1));
}

cookie_ex.prototype =
{
    store:function(daysToLive, path, domain, secure)
    {
        var cookie = this.name + '=' + encodeURIComponent( this.value );
        if( daysToLive && daysToLive != 0)
        {
            var expires_date = new Date();
            expires_date.setDate(expires_date.getDate() + daysToLive);
            cookie += "; expires=" + expires_date.toGMTString();
        }

        if (path) cookie += "; path=" + path;
        if (domain) cookie += "; domain=" + domain;
        if (secure) cookie += "; secure";

        document.cookie = cookie;
    },
    remove:function(path, domain, secure)
    {
        this.value = "";
        this.store( -1, path, domain, secure);
    },

    enabled:function()
    {
        if (navigator.cookieEnabled != undefined) return navigator.cookieEnabled;
        if (Cookie.enabled.cache != undefined) return Cookie.enabled.cache;
        document.cookie = "testcookie=test; max-age=10000";  // Set cookie
        var cookies = document.cookie;
        if (cookies.indexOf("testcookie=test") == -1) {
            return Cookie.enabled.cache = false;
        }
        else {
            document.cookie = "testcookie=test; max-age=0";  // Delete cookie
            return Cookie.enabled.cache = true;
        }
    }
};
/*-----------------cookie_ex---------------------------------------------------*/

(function(window,document){
    var inited = 0,
        magic = "local_storage",
        local_storage,
        doc_element = document.documentElement || null;
        try
        {/* hack for liu's IE10 */
            local_storage = window.localStorage || null;
        }catch(e){ local_storage = null; };

    function set(key, value)
    {
        try
        {
            if(local_storage)
            {
                if(("" == value) || (null == value))
                {
                    local_storage.removeItem(key);
                }
                else
                {
                    local_storage.setItem(key, value);
                }
            }
            else if(doc_element)
            {/* for ie browser */
                if(0 == inited)
                {
                    doc_element.addBehavior("#default#userdata");
                    inited = 1;
                }
                doc_element.load(magic);
                doc_element.setAttribute(key, value);
                doc_element.save(magic);
            }
            else
            {
                return 1;
            }
            return 0;
        }catch(err)
        {
            //alert("local_storage set:" + err.message);
            return 1;
        }
    }

    function get(key)
    {
        try
        {
            if(local_storage)
            {
                return local_storage.getItem(key);
            }
            else if(doc_element)
            {/* for ie */
                if(0 == inited)
                {
                    doc_element.addBehavior("#default#userdata");
                    inited = 1;
                }
                doc_element.load(magic);
                return doc_element.getAttribute(key);
            }
        }catch(ex)
        {
            //alert("local_storage.get:" + ex.message + "  key : " + key);
        }
        return null;
    }

    function clear()
    {
        try
        {
            if(local_storage)
            {
                localStorage.clear();
            }
            else if(doc_element)
            {
                doc_element.load(magic);
                doc_element.expires = new Date(315532799000).toUTCString();
                doc_element.save(magic);
            }
            return 0;
        }catch(ex)
        {
            //alert("local_storage.clear:" + ex.message);
            return 1;
        }
    }

    window.local_storage =
    {
        magic : magic,
        init_flag : 0,
        set:set,
        get:get,
        clear:clear
    };
})(window,document);

/* rpc.call({...});  */
(function(window, document){
    var timeout = 300000/* ms */,
        calls  = {},
        xs = {},
        seq = Math.floor((Math.random() * 1000000)),
        fnull = function(){},
        head, timer;

    function cancel()
    { 
        for(var n in calls)
        { 
            if(calls[n]){ ack(calls[n], "cancel"); }
        } 
    }

    function init()
    {
        timer = setInterval(on_timer, 5000);
        evt.bind(window, "unload", function()
            { 
                clearInterval(timer);
                window.message = null;
                cancel();
                for(var n in xs)
                {
                    if(xs[n]){ delete xs[n]; }
                }
            });

        window.message = function(msg)
            {
                var c = calls[msg.to_handle];
                if(c){ ack(c, msg); }
            };
    }

    function on_timer()
    {
        var n, c, tm = (new Date()).getTime();
        for(n in calls)
        {
            if((c = calls[n]) && (c.time < tm)){ ack(c, "timeout"); }
        }
    }

    function ack(c, msg)
    {
        var js = c.js, seq = c.seq, x = c.x;
        delete calls[seq];
        if(js){ delete c.js; if(js.parentNode){ head.removeChild(js); };};
        if(x){ delete c.x; x.abort(); };
        c.on_ack(msg, c.ref);
        if(x){ x.onreadystatechange = fnull; xs[seq] = x; };
    }

    function js_call(c)
    {
        var o = (c.js = document.createElement("script"));
        o.type = "text/javascript";
        o.language = "javascript";
        o.async = true;
        o.src = c.url;
        (head || (head = (document.getElementsByTagName("head")[0] || document.documentElement))).insertBefore(o, head.firstChild);
    }
    function x_on_rsp(c, x)
    {
        if((c.x == x) && (x.readyState == 4))
        {
            var msg, seq = c.seq;
            if(0 == x.status)
            {/* abort a connection */
                if(calls[seq]/* active connection */){ ack(c, "abort"); };return;
            }
            if((200 == x.status)||(304 == x.status/*opera*/))
            {
                var c, s = x.responseText, b = s.indexOf("("), e = s.lastIndexOf(")");
                if(((e > (b + 2)) && ('{' == s.charAt(b + 1)) && ('}' == s.charAt(e - 1))))
                {
                    msg = meval(s.substring(b + 1, e));
                }
            }
            c.x = null;
            ack(c, msg || "error");
            x.onreadystatechange = fnull;
            xs[seq] = x;
        }
    }

    function x_call(c)
    {
        var n, x;
        for(n in xs){ if(x = xs[n]){ delete xs[n]; x.abort(); break; }};
        x = x || (window.XMLHttpRequest?new XMLHttpRequest():new ActiveXObject("Microsoft.XMLHTTP"));
        x.open(c.param?"post":"get", c.url, true);
        x.onreadystatechange = function(){x_on_rsp(c, x);};
        if(c.param){ x.setRequestHeader("content-type", "application/x-www-form-urlencoded;charset=utf-8"); };
        (c.x = x).send(c.param);
    }

    function call(msg/*
                  srv:"srv_base_url" [if null means "/"],
                  to:comp_id|"comp_name" [if null means directly to srv],
                  type:"req_message_type" [must],
                  static:true|false(default) [is static encode, if null false, if method=post will force changeto false ]
                  method:get|post [just for xhr, if null default post],
                  from_handle:number[if null, ++seq, default:should be null],
                  way:json|xhr|iframe|form|test [if null default cross domain:json or same:domain xhr, not support ifram/form now.]
                  data:{}[if null, empty],
                  ref:xxx, [if null ignore ],
                  on_ack:function(msg, ref){}[must] */)
    {
        if(msg && msg.on_ack && msg.type)
        {
            var dyn = !msg["static"], post = (("json" != msg.way) && ("get" != msg.method)), from_handle = msg["from_handle"], qid = msg["qid"],
                cn = (dyn || post)?"&":"-", cv = ("-" == cn)?"-":"=",
                app = (msg.srv?msg.srv:"/") + (msg.to?msg.to:"") + "/" +  msg.type,
                param = "hfrom_handle" + cv + ((null == from_handle)?(++seq):from_handle) + ((null == qid)?"":(cn + "hqid" + cv + qid)) + cn + codec.obj_2_url(msg.data, cn),
                c = {seq: seq, on_ack:msg.on_ack, time:((new Date()).getTime() + (msg.timeout?msg.timeout:timeout)),
                     url: (post?(app + ".js"):(dyn?(app + ".js?" + param):(app + "/-" + param + ".js"))),
                     param: (post?param:""),
                     ref: msg.ref};
            if("test" != msg.way)
            {
                calls[seq] = c;
                try{
                    ("json" == msg.way)?js_call(c):x_call(c);
                }catch(t){ ack(c, "error"); };
            }
            return c.url;
        }
    }

    init();
    window.rpc = {magic:"rpc", call:call, cancel:cancel};
})(window,document);
/*-----------------rpc-------------------------------------------------*/

/* drag(el, mousedown_evt, on_update) */
function drag(el, mousedown_evt, on_update, on_update_ref)
{
    var stl = el.style, o_cursor = stl.cursor, evt = window.evt,
        ix = el.offsetLeft, iy = el.offsetTop, mx = mousedown_evt.clientX, my =  mousedown_evt.clientY,
        dc = document, dc_xel = (dc.compatMode == "CSS1Compat")?dc.documentElement:null;

    stl.cursor = "move";
    evt.bind(dc, "mousemove", on_evt);
    evt.bind(dc, "mouseup", on_evt);
    evt.bind(dc, "blur", on_evt);
    if (el.setCapture){ el.setCapture(); evt.bind(el, "losecapture", on_evt); };/*ie*/

    evt.stop (mousedown_evt);
    evt.mude (mousedown_evt);

   /* title_twinkle (null);
   try {
       im.session.im_box.group_menu.hide (null);
   } catch (e) {};
   xxxxxxxxxx refer im */
    function on_evt(e)
    {
        switch((e = e || window.event).type)
        {
            case "blur":
            case "losecapture":
            case "mouseup":
            {
                stl.cursor = o_cursor;
                evt.unbind(dc, "mousemove", on_evt);
                evt.unbind(dc, "mouseup", on_evt);
                evt.unbind(dc, "blur", on_evt);
                if(el.releaseCapture){ evt.unbind(el, "losecapture", on_evt); el.releaseCapture(); };
                break;
            }
            case "mousemove":
            {
                var x = (ix + e.clientX - mx), y = (iy + e.clientY - my),
                    p = el.offsetParent,
                    xmx = Math.max(p.scrollWidth, p.clientWidth),
                    ymx = Math.max(p.scrollHeight, p.clientHeight, (dc_xel && (p == dc.body))?dc_xel.clientHeight:0);

                if((x + el.offsetWidth) > xmx){ x = xmx - el.offsetWidth; };
                if((y + el.offsetHeight) > ymx){ y = ymx - el.offsetHeight; };
                if(x < 0){ x = 0; };
                if(y < 0){ y = 0; };
                stl.left = x + "px";
                stl.top = y + "px";
                if(on_update){ on_update(on_update_ref); };
                break;
            }
        }
        evt.stop (e);
    }
}

/*-----------------lang_get--------------------------------------------------*/
(function() {
    var param, lang,
	nav_lang = navigator.language || navigator.browserLanguage || navigator.userLanguage || navigator.systemLanguage || "",
        nav_is_cn = (nav_lang.indexOf("cn") >= 0) || (nav_lang.indexOf("zh") >= 0) || (nav_lang.indexOf("CN") >= 0) || (nav_lang.indexOf("ZH") >= 0),
        lang_choice = local_storage.get("language_choice_info");
    if(lang_choice == "chinese")
    {
        param = {lang:"cn"};
    }
    else if(lang_choice == "english")
    {
        param = {lang:"en"};
    }
    else
    {
        param = codec.uri_2_obj(location.search||location.hash||"");
    }
    lang = (param?param.lang:null) || (nav_is_cn?"cn":"en");
    window.lang_get = function(langs){ return langs[lang] || langs.cn || langs.en; };
})();
/*-----------------lang_get--------------------------------------------------*/

/*-----------------media_engine-------------------------------------------------*/
function mme(obj/*
    {parent:xxx,
     on_event:function(event-object{plug:this, ref_obj:xxx}){},
     ref_obj:xxx,
     plug_install_mute:true|false,
     on_install_ui:function({panel:install_div_panel, download:cosebase-url}, params:"xxx=xxx"){build html download and use flash a-link with name=[flash|plug]}},
     enable_native_plug:true[default]|false,
     enable_flash_plug:true[default]|false
     */)
{
    this.create(obj);
}
mme.prototype =
{
    magic:"mme",
    langs:
    {
        en:{
            plz_select:"please select ",
            mic:"microphone",
            cam:"camera",
            and:"and ",

            set_done:"OK",
            installing:"Installing...",
            rebot_hint:"After Install, Restart Browser",
            install_mme:"Install Video Pluggin",

            try_flash:"Try Video with Flash",
            download:"Download and Install",
            l1:"More clear / high resolution video screen, a better full-screen display",
            l2:"Network intelligence to adapt, video connected to faster, more fluid video and audio effects",

            l3:"Safe and viruses, ease of use, reliable and professional organizations certified signatures",
            l4:"Permanent free",
            l5:"System Requirements: Windows XP or later; browser: IE, Chrome, Firefox, Safari, Opera ..."
        },
        cn:{
            plz_select:"选择",
            mic:"麦克风",
            cam:"摄像头",
            and:"和",

            set_done:"确定",
            installing:"正在安装...",
            rebot_hint:"安装完毕后重启浏览器",
            install_mme:"安装视频加速器",

            try_flash:"我先试试普通视频",
            download:"立即安装视频加速器",
            l1:"更清晰/高分辨率的视频画面，更好的全屏显示效果",
            l2:"网络智能适应，视频接通更快，影音效果更流畅",

            l3:"安全无病毒，放心使用，专业机构认证的可靠签名",
            l4:"永久免费",
            l5:"系统要求：Windows XP 或更高版本；浏览器：IE,Chrome,Firefox,Safari,Opera..."
        }
    },
    types:
    {
        install:{codebase:(navigator.platform == "MacIntel")?"mme/npmme.pkg?0.160622.pkg":"mme/mme.exe?0.160622.exe"},
        activex:{name:"activex", xname:"MME.MMECtrl.1", clsid:"F3711E49-C6C3-4598-8888-8FD986250C98", codebase:"mme/mme_ie.cab", install_url:"", install_img:"", install_hint:""},
        xpcom:{name:"xpcom", mime:"application/mining-media-engine", codebase:"mme/npmme.xpi", install_url:"", install_img:"", install_hint:""},
        flash:{name:"flash", xname:"ShockwaveFlash.ShockwaveFlash", mime:"application/x-shockwave-flash", clsid:"D27CDB6E-AE6D-11cf-96B8-444553540000",
                    codebase:"", install_img:"",
                    install_url:"http://www.adobe.com/go/getflashplayer", src:"/mme/mme.swf?0.130715.swf", install_hint:""}
    },
    debug:true,
    windowless:(0 > ("" + navigator.platform).indexOf("Linux"))/* true, linux:if true will can not auto open cammer(must set global setting enable acess) */,
    id_allocer:{value:0},
    ver_min:0.140906,
    chl_status:{closed:0, initting:1, initting_device:2, running:3},
    plug_status:{closed:0, initting:1, installing:2, running:3},
    enable_native_plug:true,
    enable_flash_plug:true,
    /* chls:[], type:"publish"|"play", url:"xxx", running:true|false, timer:inerval, times:time-out-check-counts, refer:user-data */
    get_default_skin: function (){ return {dev_panel:{width:360, height:180}}; },
    create_plug:function(parent, enable_flash_plug, enable_native_plug, plug_params)
    {
        var test, info, plug = null, id = this.id?this.id:(++this.id_allocer.value), type = null,
            ie = (!!window.ActiveXObject || "ActiveXObject" in window);
        
        if(enable_native_plug && ((null == this.ver_cur) || (this.ver_cur >= this.ver_min)))
        {/* plugin just support win32 now */
            if(ie && (navigator.platform == "Win32")){ try{test = new ActiveXObject(this.types.activex.xname); type = this.types.activex;}catch(e){}; }
            else if((null != navigator.mimeTypes)
                    && (0 < navigator.mimeTypes.length)
                    && (null != navigator.mimeTypes[this.types.xpcom.mime])
                    && navigator.mimeTypes[this.types.xpcom.mime].enabledPlugin){ type = this.types.xpcom; };
        }
        if(!type && enable_flash_plug)
        {/* check flash */
            if(ie){ try{test = new ActiveXObject(this.types.flash.xname); type = this.types.flash; }catch(e){}; }
            else if((null != navigator.mimeTypes)
                    && (0 < navigator.mimeTypes.length)
                    && (null != navigator.mimeTypes[this.types.flash.mime])
                    && navigator.mimeTypes[this.types.flash.mime].enabledPlugin){ type = this.types.flash; };
        }
        if(type)
        {
            if(this.type != mme.prototype){ this.type = type; };
            plug_params = plug_params.replace(/'/g, "\"");
            //plug_params = codec.str_2_uri_param((plug_params)?plug_params.replace(/'/g, "\""):plug_params);
            
            /* for chrome video color error bug hack */
            if((navigator.platform == "Win32") && navigator.userAgent.toLowerCase().match(/chrome\/([\d.]+)/))
            {
                parent.style.background="black";
            }
            
            parent.innerHTML = "<object id='plug_" + id +  "' width='100%' height='100%'"
                + (ie?(" classid='clsid:" + type.clsid + "'"):(" type='" + type.mime + "'"))
                + " codebase='" + type.codebase + "'"
                + ((type == this.types.flash)?(" data='" + type.src + "'" + (this.windowless?(" wmode='transparent'"):"")):"")
                + ">"
                + ((type == this.types.flash)?
                    (   " <param name='movie' value='" + type.src + "'/>"
                        + " <param name='allowScriptAccess' value='always'/>"
                        + " <param name='flashVars' value='mme_debug=" + this.debug + "&mme_on_event=plug_" + this.id + "_on_event&mme_params=" + encodeURIComponent(plug_params) + "'/>"
                        + " <param name='allowFullScreen' value='true'/>"
                        + (this.windowless?(" <param name='wmode' value='transparent'/>"):"")
                        + "   <a href='" + type.install_url + "'>"
                        + "        <img border='none' src='" + type.install_img + "' alt='" + type.install_hint + "'/>"
                        + "   </a>")
                    :(  " <param name='mme_on_event' value='plug_" + this.id + "_on_event'/>"
                        + (this.windowless?(" <param name='windowless' value='" + this.windowless + "'/>"):"")
                        + "<param name='mme_params' value='" + plug_params + "'/>"))
                + "</object>";
            plug = ie?window["plug_" + id]:document.getElementById("plug_" + id);
            if(plug)
            {
                try
                {
                    if((type.name != "flash")
                       && (info = meval(plug.ctrl(0, "query", "{flag:1}"))))
                    {
                        mme.prototype.ver_cur = info.version;
                        if(info.version < this.ver_min)
                        {/* version to small */
                            parent.innerHTML = "";
                            return null;
                        }
                    }
                }catch(x){};
            }
            else
            {
                parent.innerHTML = "";
            }
            return plug;
        }
        return null;
    },

    /* plug_valid: */
    check_plug_install:function(ref, on_check_ack/* function(ref, version) */)
    {
        var plug, info, timer, timer_counts = 20, cont = document.createElement("div"), ret = false;
        cont.style.cssText = "position:absolute;width:1px;height:1px;left:-1px;top:-1px;";
        document.body.appendChild(cont);
        if(plug = this.create_plug(cont, false, true, "{}"))
        {/* have none flash plugin */
            timer = setInterval(function(){
                if(((plug && ("undefined" != typeof(plug.ctrl)))
                   ||(0 >= (--timer_counts))))
                {
                    /* if("undefined" != typeof(plug.clipboard_get_img))
                    {
                        mme.prototype.clipboard_plug = plug;
                    }*/
                    if(plug && ("undefined" != typeof(plug.ctrl)))
                    {
                        try
                        {
                            if(info = meval(plug.ctrl(0, "query", "{flag:1}")))
                            {
                                ret = (info.version >= mme.prototype.ver_min);
                                mme.prototype.plug_valid = ret;
                            }
                        }catch(x){};
                    }
                    clearInterval(timer);
                    cont.innerHTML = "";
                    cont.parentNode.removeChild(cont);
                    on_check_ack(ref, info?info.version:null);
                }}, 50);
        }
        else
        {
            cont.innerHTML = "";
            cont.parentNode.removeChild(cont);
            on_check_ack(ref, (null == this.ver_cur)?null:this.ver_cur);
        }
    },
    clipboard_get_img:function(mime)
    {
        if(null == this.clipboard_plug)
        {
            document.body.appendChild(mme.prototype.clipboard_cont = document.createElement("div"));
            mme.prototype.clipboard_cont.style.cssText = "position:absolute;top:-1px;left:-1px;width:1px;height:1px;";
            mme.prototype.clipboard_plug = mme.prototype.create_plug(mme.prototype.clipboard_cont, false, true, "{}");
            if((null == mme.prototype.clipboard_plug)
               ||("undefined" == typeof(mme.prototype.clipboard_plug.clipboard_get_img)))
            {
                mme.prototype.clipboard_plug = null;
                mme.prototype.clipboard_cont.innerHTML = "";
                mme.prototype.clipboard_cont.parentNode.removeChild(mme.prototype.clipboard_cont);
                mme.prototype.clipboard_cont = undefined;
            }
        }
        return this.clipboard_plug?this.clipboard_plug.clipboard_get_img(mime):null;
    },
    clear_install:function()
    {
        if(this.install_timer){ clearInterval(this.install_timer); delete this.install_timer; };
        if(this.install_panel){ if(this.install_panel){ this.install_panel.innerHTML = ""; this.install_panel.parentNode.removeChild(this.install_panel);}; delete this.install_panel;};
        if(this.install_test_panel){ if(this.install_test_panel.parentNode){ this.install_test_panel.innerHTML = ""; this.install_test_panel.parentNode.removeChild(this.install_test_panel);}; delete this.install_test_panel; };
    },

    install:function()
    {
        var a, i, link_name, alist, me = this, codebase = mme.prototype.types.install.codebase,
         		description_flag='block',button_width=210,font_size=18,flash_float_type='left',plug_float_type='right',
         		plug_magin_top=0,description_div,title_flag='block',install_div,flash_a,plug_a,title_center;
        this.clear_install();
        this.parent.appendChild(this.install_panel = document.createElement("div"));
				install_div=this.install_panel;
				function setFloatStyle(obj,style)
				{
						var sty=obj.style;
						if('cssFloat' in sty){
								obj.style.cssFloat=style;
						}else if('styleFloat' in sty){
								obj.style.styleFloat=style;
						}
				}
        /* build default ui */
        this.install_panel.style.cssText = "position:absolute;left:0px;top:0px;width:100%;height:100%;background-color: black;color:#fff;line-height:2em;font-size:14px;visibility:hidden;";
        if(install_div.clientWidth<460||install_div.clientHeight<320)
        {
        		description_flag='none';	
        }
        if(install_div.clientWidth<460)
        {
        		button_width=install_div.clientWidth*0.8;
        		font_size=12;
        		flash_float_type='none';
        		plug_float_type='none';
        		plug_magin_top=5;
        }
        if(install_div.clientWidth<290||install_div.clientHeight<160)
        {
        		title_flag='none';		
        }
        
        this.install_panel.innerHTML =
            "<div style='position:absolute;left:4%;width:92%;overflow:none;'>"
            +"<center id='title_center' style='display:"+title_flag+"'><span style='font-size:18px;'><b>" + this.lang.install_mme + "</b></span></center><br/>"
            +"<div id='install_description_div' style='display:"+description_flag+"'>"
            + "<li>" + this.lang.l1 + "</li><li>" + this.lang.l2 + "</li><li>" + this.lang.l3 + "</li>"
            + "<li>" + this.lang.l4 + "</li><li>" + this.lang.l5 + "</li><br/>"
            +"</div>"
            + "<a name='flash' href='#'"
            + " style='float:"+flash_float_type+";background:#333;font-size:"+font_size+"px;color:#fff;text-decoration:none;text-align:center;"
            + "display:inline-block;width:"+button_width+"px;height:auto;line-height:32px;"
            + "-moz-border-radius:5px;-webkit-border-radius:5px;border-radius:5Px;"
            + hack.css_box_shadow(1, "#666666") + "'"
            + " onmouseover='this.style.background=\"#666\";'"
            + " onmouseout='this.style.background=\"#333\";'"
            + " >" + this.lang.try_flash + "</a>"
            + "<a name='plug' href='" + codebase + "' target='_blank'"
            + " style='float:"+plug_float_type+";background:#333;font-size:"+font_size+"px;color:#fff;text-decoration:none;text-align:center;"
            + "display:inline-block;width:"+button_width+"px;height:auto;margin-top:"+plug_magin_top+"px;line-height:32px;"
            + "-moz-border-radius:5px;-webkit-border-radius:5px;border-radius:5Px;"
            + hack.css_box_shadow(1, "#666666") + "'"
            + " onmouseover='this.style.background=\"#666\";'"
            + " onmouseout='this.style.background=\"#333\";'"
            + ">" + this.lang.download + "</a>"
            + "<span name='plug_installing' style='display:none'></span>"
            + "</div><div style='float:clear;'></div>";
        

        document.body.appendChild(this.install_test_panel = document.createElement("div"));
        
        window.onresize=function(){
        		description_div=document.getElementById("install_description_div");
        		title_center=document.getElementById("title_center");
        		flash_a = dom_get_item_by_name(install_div, "*", "flash");
        		plug_a = dom_get_item_by_name(install_div, "*", "plug");
        		if(description_div)
        				description_div.style.display=(install_div.clientWidth<460||install_div.clientHeight<320)?'none':'block';
		        if(install_div.clientWidth<460)
    				{
    						  if(flash_a)
					        {
					        		flash_a.style.width=install_div.clientWidth*0.8+'px';
					        		setFloatStyle(flash_a,'none');
					        		flash_a.style.fontSize='12px';
					        }
					        if(plug_a)
					        {
					        		plug_a.style.width=install_div.clientWidth*0.8+'px';
					        		setFloatStyle(plug_a,'none');
					        		plug_a.style.marginTop='5px';
					        		plug_a.style.fontSize='12px';
					        }
    				}
    				else
    				{
    							if(flash_a)
					        {
					        		flash_a.style.width='210px';
					        		setFloatStyle(flash_a,'left');
					        		flash_a.style.fontSize='18px';
					        }
					        if(plug_a)
					        {
					        		plug_a.style.width='210px';
					        		setFloatStyle(plug_a,'right');
					        		plug_a.style.marginTop='0px';
					        		plug_a.style.fontSize='18px';
					        }			
    				}
    				if(title_center)
    							title_center.style.display=(install_div.clientWidth<290&&install_div.clientHeight<160)?'none':'block';
        }
        
        if(this.on_event)
        {
            /* function({panel:install_div_panel, download:cosebase-url}){ build html-content, must let first a-link as try-flash, and second a-link is download with name=[flash|plug]} */
            this.on_event({type:"install_ui", panel:this.install_panel, download:codebase, ver_cur:this.ver_cur});
        }
        this.install_panel.style.visibility = "";
        this.install_test_panel.style.cssText = "position:absolute;left:-1px;top:-1px;width:1px;height:1px;";
        if(a = dom_get_item_by_name(this.install_panel, "*", "flash"))
        {
            evt.bind(a, "click", function(e)
                {
                     me.clear_install();
                     me.status = me.plug_status.initting;
                     if(null == (me.plug_obj = me.create_plug(me.parent, true, true, me.create_params)))
                     {
                         me.status = me.plug_status.closed;
                         if(me.on_event){me.on_event({type:"missing"});};
                     }
                     else
                     {
                         if(me.on_event){me.on_event({type:"create"});};
                     }
                     return false;
                 });
        }
        if(a = dom_get_item_by_name(this.install_panel, "*", "plug"))
        {
            evt.bind(a, "click", function(e)
                {
                    a = dom_get_item_by_name(me.install_panel, "*", "plug_installing");
                    if(a)
                    {
                        a.style.display = "";
                        a.innerHTML = me.lang.installing;
                        if(a = dom_get_item_by_name(me.install_panel, "*", "plug"))
                        {
                            a.style.display = "none";
                        }
                    }
                    else if(a = dom_get_item_by_name(me.install_panel, "*", "plug"))
                    {
                        a.innerHTML = "<b>" + ((hack.ie || hack.chrome)?me.lang.installing:me.lang.rebot_hint) + "</b>";
                    }
                    if(hack.ie || hack.chrome)
                    {
                        me.install_timer = setInterval(function(){
                                if(mme.prototype.create_plug(me.install_test_panel, false, true, me.create_params))
                                {
                                    me.clear_install();
                                    me.status = me.plug_status.initting;
                                    if(null == (me.plug_obj = me.create_plug(me.parent, true, true, me.create_params)))
                                    {
                                        me.status = me.plug_status.closed;
                                        if(me.on_event){me.on_event({type:"missing"});};
                                    }
                                    else
                                    {
                                        if(me.on_event){me.on_event({type:"create"});};
                                    }
                                }
                            }, 1000);
                    }
                });
        }
    },

    on_plug_event:function(json)
    {
        var e= meval(json);
        if(e.target && e.target.type && e.target.url)
        {
            e.chl = this.chl_get(e.target.type, e.target.url)
        }
        
        switch (e.type)
        {
            case "is_ready": { return (null != this.plug_obj); break; }
            case "ready": { this.status = this.plug_status.running; break; }
            case "close":
            {
                if(e.chl){ e.chl.status = this.chl_status.closed; e.chl.id = 0; };
                break;
            }
            case "active": { break; }
        }
        if(this.is_created && this.on_event)
        {
            this.on_event(e);
        }
        return 0;
    },
    create:function(obj)
    {
        var parent = obj.parent, me = this;

        /* init parent and skin */
        this.skin = this.get_default_skin();
        if("object" == typeof(obj.skin))
        {
            obj_merge(this.skin, obj.skin);
        }
        this.parent = parent;
        if(undefined != obj.debug){ this.debug = obj.debug; }
        if(undefined != obj.windowless){ this.windowless = obj.windowless; }
        if(undefined != obj.enable_native_plug){ this.enable_native_plug = obj.enable_native_plug; }
        if(undefined != obj.enable_flash_plug){ this.enable_flash_plug = obj.enable_flash_plug; }
        this.on_event = obj.on_event;
        this.cam_index = -1;
        this.mic_index = -1;
        this.chls = [];
        this.create_params = obj.params||"";
        this.ref_obj = obj.ref_obj;
        this.is_created = false;
        if(obj.on_event)
        {
            this.on_event_callback = obj.on_event;
            this.on_event = function(e)
            {
                e.plug = me;
                e.ref_obj = me.ref_obj;
                me.on_event_callback(e);
                e.plug = (e.ref_obj = null);
            };
        }

        /* do create */
        this.id = (++ this.id_allocer.value);
        window["plug_" + this.id + "_on_event"] = function(s){ return me.on_plug_event(s); };
        this.status = this.plug_status.initting;

        /* try create native plugin */
        if(null == (this.plug_obj = this.create_plug(parent,
                                                     this.enable_flash_plug && ((!obj.plug_install_mute) || ((navigator.platform != "Win32") && (navigator.platform != "MacIntel"))),  //(!!obj.plug_install_mute)
                                                     this.enable_native_plug,
                                                     this.create_params)))
        {/* create native plug in failed */
            if(this.enable_native_plug
               && (!obj.plug_install_mute) 
               && ((navigator.platform == "Win32") || (navigator.platform == "MacIntel")))
            {/* try install */
                if(this.ver_cur >= this.ver_min)
                {/* old plugin with lower version */
                    me.status = me.plug_status.initting;
                    if(null == (me.plug_obj = me.create_plug(parent, true, true, me.create_params)))
                    {
                        me.status = me.plug_status.closed;
                        if(me.on_event){me.on_event({type:"missing"});};
                    }
                    else
                    {
                        if(me.on_event){me.on_event({type:"create"});};
                    }
                }
                else
                {
                    this.status = this.plug_status.installing;
                    this.install(function()
                        {
                            me.status = me.plug_status.initting;
                            if(null == (me.plug_obj = me.create_plug(parent, true, true, me.create_params)))
                            {
                                me.status = me.plug_status.closed;
                                if(me.on_event){me.on_event({type:"missing"});};
                            }
                            else
                            {
                                if(me.on_event){me.on_event({type:"create"});};
                            }
                        });
                }
            }
            else
            {/* can not install */
                me.status = me.plug_status.closed;
                if(me.on_event){me.on_event({type:"missing"});};
            }
        }
        else if((this.status == this.plug_status.running) && me.on_event)
        {
            setTimeout(function(){if(me.on_event){ me.on_event({type:"ready"});};}, 0);
        }
        this.is_created = true;
    },
    destroy:function()
    {
        this.clear_install();
        window["plug_" + this.id + "_on_event"] = null;
        for(var chl, i = this.chls.length - 1; 0 <= i; --i)
        {
            if(chl = this.chls[i]){ this.chl_destroy(chl); };
        }

        if(this.dev_form)
        {
            this.dev_form.onsubmit = null;
            this.dev_form.innerHTML = "";
            this.dev_form.parentNode.removeChild(this.dev_form);
            delete this.dev_form;
        }

        if(this.plug_obj){ delete this.plug_obj; };
        if(this.parent)
        {
            this.parent.innerTHML = "";
            delete this.parent;
        }
        if(this.id){ delete this.id; };
        if(this.status){ delete this.status; };
        if(this.on_event){ delete this.on_event; };
    },
    update:function()
    {
    },

    is_ready:function(func)
    { 
        return (this.plug_obj
                && (this.status == this.plug_status.running)
                && ((null == func) || (("undefined" != typeof(this.plug_obj[func]))))); 
    },

    select_device:function(cams, mics, on_done)
    {
        var dev, i, radio, radios, me = this, dev_form = this.dev_form, html = "";
        if(null == dev_form)
        {
            this.parent.appendChild(this.dev_from = (dev_form = document.createElement ('form')));
            dev_form.style.cssText = "position:absolute;left:0px;top:0px;width:100%;height:100%;overflow-y:auto;overflow-x:none;padding:0px;margin:0px;background:transparent;background:#000;color:#fff;line-height:1.5em;font-size:12px;";
        }
        dev_form.style.visibility = "hidden";
        dev_form.innerHTML = "";
        //dev_form.style.display = "";
        html += "<div style='position:absolute;left:5%;width:90%'><br/><center><span style='font-size:18x;'><b>" + this.lang.plz_select + this.lang.cam + this.lang.and + this.lang.mic + "</span></center>"
        if(cams && (0 < cams.length))
        {
            html += "<br/><span>" + this.lang.cam + "</span><br/>";
            for(i = 0; i < cams.length; i++)
            {
                dev = cams[i];
                html += "<input type='radio' name='cam' id='cam_" + dev.index + "' value='" + dev.index + "' " + ((0 == i)?"checked":"") + "/>"
                        + "<label for='cam_" + dev.index + "'>" + dev.name + "</label><br/>"
            }
        }
        if(mics && (0 < mics.length))
        {
            html += "<br/><span>" + this.lang.mic + "</span><br/>";
            for(i = 0; i < mics.length; i++)
            {
                dev = mics[i];
                html += "<input type='radio' name='mic' id='mic_" + dev.index + "' value='" + dev.index + "' " + ((0 == i)?"checked":"") + "/>"
                        + "<label for='mic_" + dev.index + "'>" + dev.name + "</label><br/>"
            }
        }
        html += "<br/><center>"
             + "<input type='submit' value='" + this.lang.set_done + "'"
             + " onmouseover='this.style.background=\"#666\";'"
             + " onmouseout='this.style.background=\"#333\";'"
             + " style='cursor:pointer;border:none;padding:0px;margin:0px;font-size:14px;color:#fff;width:120px;height:24px;"
             + "-moz-border-radius:3px;-webkit-border-radius:3px;border-radius:3Px;"
             + hack.css_box_shadow(1, "#666666")
             + "line-height:32px;background:#333;'/></center></div>";
        dev_form.innerHTML = html;

        if(this.on_event)
        {/* call back */
            this.on_event({type:"select_device_ui", form:dev_form, mics:mics, cams:cams});
        }
        dev_form.style.visibility = "";

        dev_form.onsubmit = function()
        {
            for(i = 0, radios = dev_form.getElementsByTagName("input"); i < radios.length; ++i)
            {
                if(((radio = radios[i]).type == "radio") && radio.checked)
                {
                    if(radio.name == "cam"){ me.cam_index = radio.value; }
                    else if(radio.name == "mic"){ me.mic_index = radio.value; }
                }
            }
            dev_form.style.display = "none";
            on_done();
            return false;
        }
    },
    init_device:function(obj/* {on_done:function(is_valid)}*/)
    {
        var me = this;
        function on_init_device_done()
        {
            if(obj.on_done){ obj.on_done(); };
        }
        if (null == this.plug_info)
        {
            this.plug_info = meval(this.plug_obj.ctrl(0, "query", "{flag:65535}"));
            if(this.plug_info && this.plug_info.camera)
            {/* remove google vitual camera */
                var cam_arr = [], i, cam, cams = this.plug_info.camera;
                for (i = 0; i < cams.length; ++i)
                {
                    if((cam = cams[i]) && (cam.name.indexOf ("Google Camera Adapter") < 0)){ cam_arr.push (cam); }
                }
                this.plug_info.camera = cam_arr;
            }
        }

        if((0 > this.cam_index) && (this.plug_info.camera.length == 1))
        {
            this.cam_index = this.plug_info.camera[0].index;
        }
        if((0 > this.mic_index) && (this.plug_info.microphone.length >= 1))
        {
            this.mic_index = this.plug_info.microphone[0].index;
        }
        if(((0 > this.cam_index) && (1 < this.plug_info.camera.length))
           /* ||((0 > this.mic_index) && (1 < this.plug_info.microphone.length))*/)
        {
            this.select_device(this.plug_info.camera, this.plug_info.microphone, on_init_device_done);
        }
        else
        {
            on_init_device_done();
        }
    },

    chl_get:function(type, url)
    {
        for(var chls = this.chls, i = chls.length - 1; i >= 0; --i)
        {
            if((chl = chls[i]) && (chl.type == type) && (url == chl.url)){ return chl; };
        }
        return null;
    },
    chl_destroy:function(chl)
    {
        for(var chls = this.chls, i = chls.length - 1; i >= 0; --i)
        {
            if(chl == chls[i])
            {
                if(chl.timer){ clearTimeout(chl.timer); chl.timer = null; };
                if(this.chl_status.initting_device == chl.status){ this.dev_from.style.display = "none"; };
                chl.status = this.chl_status.stopped;
                if(0 < chl.id)
                {
                    if(this.is_ready("chl_destroy")){ this.plug_obj.chl_destroy(chl.id); };
                    chl.id = 0;
                }
                chl.refer = null;
                chls.splice(i, 1);
                break;
            }
        }
    },
    chl_dev_index_param:function(cam_index, mic_index)
    {
        return "\ncam.index=" + cam_index + "\nmic.index=" + mic_index;
    },
    chl_create:function(obj/*{type:"publish"|"play", url:"xxx", params:"", refer:xxx}*/)
    {
        if(!this.is_ready("chl_create"))
        {
            return null;
        }
        else
        {
            var me = this, ret, chl = {params:(obj.params||"")};
            if(0 >= (chl.id = me.plug_obj.chl_create(chl.params)))
            {
                return null;
            }
            this.chls[this.chls.length] = chl;
            return chl;
        }
    },
    ctrl:function(chl, method, params)
    {
        try
        {
            return this.is_ready("ctrl")?this.plug_obj.ctrl(chl?chl.id:0, method, params):"{type:\"error\",status:-1}";
        }catch(err)
        {
            return "{type:\"error\",status:-1}";
        }
    }
}
mme.prototype.lang = lang_get(mme.prototype.langs);
/*-----------------media_engine-------------------------------------------------*/

/* ----------------------google analytics--------------------*/
/*
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-922747-2']);
  _gaq.push(['_setDomainName', '.hehehi.com']);
  _gaq.push(['_trackPageview']);
function google_analytics_init() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);}
if(0 > (location.hash || location.search || "").indexOf("debug=1"))
{
    mx(google_analytics_init);
}*/
/* ----------------------google analytics--------------------*/
