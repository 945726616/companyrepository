/*
    mlocal_storage
    depends: none
    
    ----history----------
    author: chengzhiyong date:2014-08-14 action: cut from core.js to a lib
*/

(function(window,document){
    var inited = 0,
        magic = "mlocal_storage",
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

    window.mlocal_storage =
    {
        magic : magic,
        init_flag : 0,
        set:set,
        get:get,
        clear:clear
    };
})(window,document);

