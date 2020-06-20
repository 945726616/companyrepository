const publicFunc = {
  async importCss (docPath) { // 引入CSS文件
    if (window.location.href.indexOf('vimtag') > -1) {
      await require('../css/vimtag' + docPath)
    } else if (window.location.href.indexOf('ebit') > -1) {
      await require('../css/ebit' + docPath)
    } else {
      await require('../css/mipc' + docPath)
    }
  },
  urlParam () { // 截取url参数
    let args = new Object()
    if (process.env.NODE_ENV === 'production') {
      let query = location.href.split('?')[1]//Get the query string
      let pairs = query.split("&")//Disconnect the comma
      for (let i = 0; i < pairs.length; i++) {
        let pos = pairs[i].indexOf('=')//Find name=value
        if (pos == -1) continue//If you do not find just skip
        let argname = pairs[i].substring(0, pos)//extract name
        let value = pairs[i].substring(pos + 1)//extract value
        args[argname] = unescape(value)//Save as property
      }
    }
    return args
  }
}

export default publicFunc