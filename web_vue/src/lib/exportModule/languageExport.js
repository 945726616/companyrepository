// 采用将语言缩写存储在sessionStorage中进行语言的切换操作
const chooseLanguage = {
  lang(lang) {
    sessionStorage.setItem('userLanguage', lang)
    return import(`../plugins/language/language.${lang}.min.js`)
  }
}

export default chooseLanguage
