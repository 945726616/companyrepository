const publicFunc = {
  async importCss (docPath) { // 引入CSS文件
    if (window.location.href.indexOf('vimtag') > -1) {
      await require('../css/vimtag' + docPath)
    } else if (window.location.href.indexOf('ebitcam') > -1) {
      require('../css/ebit' + docPath)
    } else {
      require('../css/mipc' + docPath)
    }
  }
}

export default publicFunc