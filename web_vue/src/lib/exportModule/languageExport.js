// import ar from '../plugins/language/language.ar.min.js'
// import cz from '../plugins/language/language.cz.min.js'
// import de from '../plugins/language/language.de.min.js'
// import en from '../plugins/language/language.en.min.js'
// import es from '../plugins/language/language.es.min.js'
// import fr from '../plugins/language/language.fr.min.js'
// import hu from '../plugins/language/language.hu.min.js'
// import it from '../plugins/language/language.it.min.js'
// import iw from '../plugins/language/language.iw.min.js'
// import ja from '../plugins/language/language.ja.min.js'
// import ko from '../plugins/language/language.ko.min.js'
// import nl from '../plugins/language/language.nl.min.js'
// import pl from '../plugins/language/language.pl.min.js'
// import pt from '../plugins/language/language.pt.min.js'
// import ru from '../plugins/language/language.ru.min.js'
// import sk from '../plugins/language/language.sk.min.js'
// import th from '../plugins/language/language.th.min.js'
// import tr from '../plugins/language/language.tr.min.js'
// import tw from '../plugins/language/language.tw.min.js'
// import uk from '../plugins/language/language.uk.min.js'
// import vi from '../plugins/language/language.vi.min.js'
// import zh from '../plugins/language/language.zh.min.js'

const chooseLanguage = {
  lang(lang) {
    // let script = `<script type="text/javascript" src="../plugins/language/language.${lang}.min.js"></script>`
    // $("body").append(script)
    console.log('调用该函数')
    sessionStorage.setItem('userLanguage', lang)
    return import(`../plugins/language/language.${lang}.min.js`)
  }
}

export default chooseLanguage

// ar: ar,
//   cz: cz,
//   de: de,
//   en: en,
//   es: es,
//   fr: fr,
//   hu: hu,
//   it: it,
//   iw: iw,
//   ja: ja,
//   ko: ko,
//   nl: nl,
//   pl: pl,
//   pt: pt,
//   ru: ru,
//   sk: sk,
//   th: th,
//   tr: tr,
//   tw: tw,
//   uk: uk,
//   vi: vi,
//   zh: zh
// const chooseLanguage = {
//   ar: import('../plugins/language/language.ar.min.js'),
//   cz: import('../plugins/language/language.ar.min.js'),
//   de: import('../plugins/language/language.ar.min.js'),
//   en: import('../plugins/language/language.ar.min.js'),
//   es: import('../plugins/language/language.ar.min.js'),
//   fr: import('../plugins/language/language.ar.min.js'),
//   hu: import('../plugins/language/language.ar.min.js'),
//   it: import('../plugins/language/language.ar.min.js'),
//   iw: import('../plugins/language/language.ar.min.js'),
//   ja: import('../plugins/language/language.ar.min.js'),
//   ko: import('../plugins/language/language.ar.min.js'),
//   nl: import('../plugins/language/language.ar.min.js'),
//   pl: import('../plugins/language/language.ar.min.js'),
//   pt: import('../plugins/language/language.ar.min.js'),
//   ru: import('../plugins/language/language.ar.min.js'),
//   sk: import('../plugins/language/language.ar.min.js'),
//   th: import('../plugins/language/language.ar.min.js'),
//   tr: import('../plugins/language/language.ar.min.js'),
//   tw: import('../plugins/language/language.ar.min.js'),
//   uk: import('../plugins/language/language.ar.min.js'),
//   vi: import('../plugins/language/language.ar.min.js'),
//   zh: import('../plugins/language/language.ar.min.js')
// }