function mipc_play( obj )
{
    new mplay( obj );
}

function mplay( obj )
{
    this.play( obj );
}

mplay.prototype =
{
    play:function( obj )
    {
        var me = this;

        this.param = obj;
        this.node = {};
        
        if("object" == typeof( obj ))
        {
            if(obj.t=="reboot")
            {
                if( !obj.u  || !obj.p )
                {
                    alert( "Reboot fail for invalid input param" );
                    return;
                }
            }
            else
            {
                if(!obj.d || !obj.u  || !obj.p || !obj.r )
                {
                    alert( "Play fail for invalid input param" );
                    return;
                }
            }
            if( typeof( obj.d ) == "object" )
            {
                this.node.cont = obj.d;
            }
            else
            {
                if(!( this.node.cont = document.getElementById( obj.d )) )
                {
                    alert( "Play fail for param d( " + obj.d + " ) does not existed" );
                    return;
                }
            }
        }
        else
        {
            alert( "Operation fail for invalid input param" );
            return;
        }
        
        var page_ifm = 'http://www.mipcm.com/mipc_play_index.htm?v1.1.1.111111#u='+ obj.u + '&p=' + obj.p + '&r=' + obj.r+ '&t=' + obj.t;
        if( obj.debug == 1 )
        {
            page_ifm += "&debug=1";
        }
        this.node.cont.innerHTML = "<iframe style='border:0px; width:100%; height:100%' src='" + page_ifm + "'></iframe>";
    }
}
