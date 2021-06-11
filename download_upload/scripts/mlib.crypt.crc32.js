function crc32(crc, str)
{
    var i, j, v, tbl = crc32.prototype.tbl||(crc32.prototype.tbl = []);
    if(0 == tbl.length)
    {/* need  prepare crc table */
        for(i = 0; i < 256; i++) 
        {
            for(v = i, j = 0; j < 8; j++){ v = ((v >> 1) & 0x7fffffff) ^ ((v & 1)?0xedb88320:0); }
            tbl[i] = v;
        }
    }
    /* get crc32 value */
    v = crc ^ 0xffffffff;
    for(i = 0; i < str.length; ++i)
    {
       v = tbl[(v ^ str.charCodeAt(i)) & 0xff] ^ ((v >> 8) & 0x00ffffff);
    }
    return (v ^ 0xffffffff) >>> 0;
}