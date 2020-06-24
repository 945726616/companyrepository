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
  },
  msg_tips (options) { // 弹出的消息提示框
    let bid = parseInt(Math.random() * 100000);
    $("#tip_div").html('<div id="tip_container' + bid + '" class="container tip_container"><div id="tip' + bid + '" class="mtip"><i class="micon"></i><span id="tsc' + bid + '"></span><i id="mclose' + bid + '" class="mclose"></i></div></div>');
    let $tip_container = $("#tip_container" + bid)
    let $tip = $("#tip" + bid);
    let $tipSpan = $("#tsc" + bid);
    let $colse = $("#mclose" + bid);
    //
    clearTimeout(window.timer);
    console.log($tip_container, 'container')
    if ($tip_container) {
      $tip.attr("class", options.type).addClass("mtip");
      $tipSpan.html(options.msg);
      $tip_container.slideDown(300);
      //
      window.timer = setTimeout(function () {
        $tip_container.slideUp(300);
      }, options.timeout);
      //
      $tip_container.on("mouseover", function () {
        clearTimeout(window.timer);
      });
      //
      $tip_container.on("mouseout", function () {
        window.timer = setTimeout(function () {
          $tip_container.slideUp(300);
        }, options.timeout);
      });
      //
      $colse.on("click", function () {
        $tip_container.slideUp(300);
      });
    }
  }
}

export default publicFunc