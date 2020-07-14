<template>
<!-- 入口文件 -->
  <div id="app">
    <div id="tip_div"></div>
    <div id="buffer_page">
      <div id="buffer_image"></div>
    </div>
    <div id="delete_tips"></div>
    <div id='add_device_page'></div>
    <topBar />
    <!-- 调用路由部分进行渲染 -->
    <router-view />
  </div>
</template>

<script>
import TopBar from './components/top'
export default {
  name: "App",
  components: { // 组件注册
    topBar: TopBar
  },
  methods: {
    jumpToDevlist () { // 请求超时点击可跳转回设备列表页面
      this.publicFunc.closeBufferPage()
      this.$router.push('/devlist')
    }
  },
  async mounted () {
    import(`@/lib/plugins/jquery.ibutton.js`)
    import(`@/lib/plugins/jquery.mousewheel.min.js`)
    let userLanguage = sessionStorage.getItem('userLanguage')
    if (userLanguage) {
      await this.$chooseLanguage.lang(userLanguage)
    } else {
      await this.$chooseLanguage.lang('en')
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}
</style>
