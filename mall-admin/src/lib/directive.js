
const directive = {}
// 注册一个全局自定义指令 `可以输入数字`
const onInput = (el, ele, binding, vnode) => {
  let handle = () => {
    let val = ele.value
    // modifiers为修饰符对象，传入了float，则其float属性为true
    if (binding.modifiers.float) {
      // 清除"数字"和"."以外的字符
      val = val.replace(/[^\d.]/g, '')
      // 只保留第一个, 清除多余的
      val = val.replace(/\.{2,}/g, '.')
      // 第一个字符如果是.号，则补充前缀0
      val = val.replace(/^\./g, '0.')
      // 保留几位小数
      if (typeof binding.value !== 'undefined') {
        // 期望保留的最大小数位数
        let pointKeep = 0
        if (typeof binding.value === 'string' ||
          typeof binding.value === 'number') {
          pointKeep = parseInt(binding.value)
        }
        if (!isNaN(pointKeep)) {
          if (!Number.isInteger(pointKeep) ||
            pointKeep < 0) {
            pointKeep = 0
          }
          const str = '^(\\d+)\\.(\\d{' + pointKeep + '}).*$'
          const reg = new RegExp(str)
          if (pointKeep === 0) {
            // 不需要小数点
            val = val.replace(reg, '$1')
          } else {
            // 通过正则保留小数点后指定的位数
            val = val.replace(reg, '$1.$2')
          }
        }
      }
    } else {
      // 只保留整数
      val = ele.value.replace(/[^\d]/g, '')
      val = val ? parseInt(val) : ''
    }
    ele.value = val
  }
  return handle
}
// 能输入整数（包括负数）
const onStokeInput = (el, ele, binding, vnode) => {
  let handle = () => {
    let val = ele.value
    var t = ele.value.charAt(0)
    // 只保留整数
    val = ele.value.replace(/[^\d]/g, '')
    val = val ? parseInt(val) : ''
    if (t === '-') {
      val = '-' + val
    } else {

    }
    ele.value = val
  }
  return handle
}
// 数字输入
directive.numberInput = {
  bind (el, binding, vnode) {
    const ele = el.tagName === 'INPUT' ? el : el.querySelector('input')
    ele.addEventListener('input', onInput(el, ele, binding, vnode), false)
  }
}
// 库存输入
directive.stokeInput = {
  bind (el, binding, vnode) {
    const ele = el.tagName === 'INPUT' ? el : el.querySelector('input')
    ele.addEventListener('input', onStokeInput(el, ele, binding, vnode), false)
  }
}
export default directive
