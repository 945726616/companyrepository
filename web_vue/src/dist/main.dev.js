"use strict";

var _vue = _interopRequireDefault(require("vue"));

var _store = _interopRequireDefault(require("./store"));

var _router = _interopRequireDefault(require("./router"));

var _App = _interopRequireDefault(require("./App.vue"));

var _api = _interopRequireDefault(require("./api"));

var _jquery = _interopRequireDefault(require("jquery"));

require("./css/public.scss");

var _languageExport = _interopRequireDefault(require("./lib/exportModule/languageExport"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// 引入多国语言切换插件
_vue["default"].prototype.$chooseLanguage = _languageExport["default"]; // 获取浏览器默认语言并调用默认语言包

var chromeLang = (navigator.language || navigator.userLanguage).substr(0, 2);

if (chromeLang === 'zh') {
  var originalLang = navigator.language || navigator.userLanguage;

  if (originalLang === 'zh-TW') {
    chromeLang = 'tw';
  }
}

sessionStorage.setItem('userLanguage', chromeLang);

_languageExport["default"].lang(chromeLang);

_vue["default"].prototype.$ = _jquery["default"];
_vue["default"].prototype.$api = _api["default"];
_vue["default"].config.productionTip = false;
new _vue["default"]({
  router: _router["default"],
  store: _store["default"],
  render: function render(h) {
    return h(_App["default"]);
  }
}).$mount('#app');