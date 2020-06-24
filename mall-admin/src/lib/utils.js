
const utils = {}

/**
 * 格式化时间
 * @param {Number} timestamp 时间戳
 * @param {String} format 格式化样式
 */
utils.timeFormat = function (time, format = 'yyyy-MM-dd') {
  if (typeof time === 'number') {
    var theTime = typeof (time) === 'object'
      ? time
      : new Date(time)
    var _year = theTime.getFullYear()
    format = format.replace('yyyy', _year)
    var _month = theTime.getMonth() + 1
    format = format.replace('MM', _month < 10
      ? '0' + _month
      : _month)
    var _day = theTime.getDate()
    format = format.replace('dd', _day < 10
      ? '0' + _day
      : _day)
    var _hour = theTime.getHours()
    format = format.replace('HH', _hour < 10
      ? '0' + _hour
      : _hour)
    var _minute = theTime.getMinutes()
    format = format.replace('mm', _minute < 10
      ? '0' + _minute
      : _minute)
    var _second = theTime.getSeconds()
    format = format.replace('ss', _second < 10
      ? '0' + _second
      : _second)
    return format
  } else {
    return false
  }
}
utils.timeTrim = function (time, num = 19) {
  if (time) {
    return time.slice(0, num)
  } else {
    return ''
  }
}
/**
     * 滚动动画scrollTo
     * @param {Element} el DOM节点
     * @param {Number} y scrollTop
     */
utils.scrollTo = function (el, y = 0) {
  if (y < 0) {
    throw Error('y must greater than 0')
  }
  const yD = el.scrollTop - y
  if (yD === 0 || yD < 1.1) {

  } else {
    const targetY = Math.round(yD / 1.5)
    const timer = setTimeout(() => {
      el.scrollTop = targetY
      this.scrollTo(el, y)
      clearTimeout(timer)
    }, 20)
  }
}

/**
 * 图片地址处理
 * @param {String} imgUrl 图片地址
 */
utils.handleImgPrefix = function (imgUrl) {
  // const env = process.env.NODE_ENV
  // let api = env === 'development' ? '/api' : ''
  // if (!imgUrl) return
  // const protocol = location.protocol
  // let _splitImg = imgUrl.split(',')
  // _splitImg.shift()
  // return protocol + '//' + location.host + api + '/' + _splitImg.join('/')
  return 'http://' + imgUrl
}
/**
 * 图片地址处理
 * @param {String} imgUrl 图片地址
 */
utils.imgPrefixHttps = function (str) {
  if (str) {
    var tempstr = str.split(',')[0]
    console.log(tempstr)
    var index = tempstr.indexOf('/imageContent')
    console.log(index)
    return window.location.origin + tempstr.slice(index)
  } else {
    return ''
  }
}

/**
 * 数组排序
 * @param {Array} arr 数组
 * @param {Number} newIndex 新位置
 * @param {Number} oldIndex 旧位置
 */
utils.arraySort = (arr, newIndex, oldIndex) => {
  let tempArr = [...arr]
  const target = tempArr.splice(oldIndex, 1)
  tempArr.splice(newIndex, 0, target[0])
  return tempArr
}
// 让数字保留两位小数
utils.getFloatNum = (value) => {
  if (value) {
    value = Math.round(parseFloat(value) * 100) / 100
    var xsd = value.toString().split('.')
    if (xsd.length === 1) {
      value = value.toString() + '.00'
      return value
    }
    if (xsd.length > 1) {
      if (xsd[1].length < 2) {
        value = value.toString() + '0'
      }
      return value
    }
  } else {
    return value
  }
}
// 网络图片转base64
utils.getUrlBase64 = (img, callabck) => {
  function getBase64Image (img, width, height) { // width、height调用时传入具体像素值，控制大小 ,不传则默认图像大小
    var canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height

    var ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    var dataURL = canvas.toDataURL()
    return dataURL
  }
  var image = new Image()
  image.crossOrigin = 'Anonymous'
  image.src = img
  if (img) {
    console.log(img)
    image.onload = function () {
      callabck && callabck(getBase64Image(image))
      // return getBase64Image(image)
    }
  }
}
// 文件转base64
utils.getBase64 = (file) => {
  return new Promise(function (resolve, reject) {
    let reader = new FileReader()
    let imgResult = ''
    reader.readAsDataURL(file)
    reader.onload = function () {
      imgResult = reader.result
    }
    reader.onerror = function (error) {
      reject(error)
    }
    reader.onloadend = function () {
      resolve(imgResult)
    }
  })
}
// 将base64转换为文件
utils.dataURLtoFile = (dataurl, filename) => {
  let arr = dataurl.split(',')
  // let mime = arr[0].match(/:(.*?);/)[1]
  // console.log("mime==================",mime)
  let bstr = atob(arr[1])
  let n = bstr.length
  let u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename + '.jpeg', { type: 'image/jpeg' })
}
// 将base64转换为blob再将blob转换为file 兼容好
utils.dataURLtoBlobtoFile = (dataurl, fileName) => {
  let arr = dataurl.split(',')
  let mime = arr[0].match(/:(.*?);/)[1]
  let bstr = atob(arr[1])
  let n = bstr.length
  let u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  let theBlob = new Blob([u8arr], { type: mime })
  theBlob.lastModifiedDate = new Date()
  theBlob.name = fileName
  return theBlob
}
// 获取随机数
utils.getRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min
}
// 带有非法字符不让输入
utils.getSafeStr = (str) => {
  var re = /select|update|delete|exec|count|'|"|=|;|>|<|%/i
  if (re.test(str)) {
    return false
  } else {
    return true
  }
}
// 统一手机号验证正则
utils.phoneRex = /^1[345789]\d{9}$/
// 浮点数正则 不包含0
utils.floatRex = /(^[1-9]\d*(\.\d{1,2})?$)|^0\.\d{1,2}$/
// 浮点数正则 包含0
utils.floatAllRex = /(^[1-9]\d*|^0)(\.\d{1,2})?$/
// intRex 正整数正则 不包括0
utils.intRex = /^[1-9]\d*$/
// intRex 正整数正则 包括0
utils.intAllRex = /^[1-9]\d*|0$/
utils.formatNum = (num) => {
  if (num < 0) {
    return 0
  } else {
    return parseFloat(num).toFixed(2)
  }
}
export default utils
