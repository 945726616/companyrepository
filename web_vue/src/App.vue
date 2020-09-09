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
import TopBar from './components/top/top'
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
    let userLanguage = localStorage.getItem('language_choice_info') ? localStorage.getItem('language_choice_info') : sessionStorage.getItem('userLanguage')
    if (userLanguage) {
      await this.$chooseLanguage.lang(userLanguage)
    } else {
      await this.$chooseLanguage.lang('en')
    }
    if (sessionStorage.getItem('login_flag')) {
      this.$store.dispatch('setLoginFlag', sessionStorage.getItem('login_flag'));
      let user_info = JSON.parse(sessionStorage.getItem('user_info'));
      this.$store.dispatch('setLid', user_info.lid) //登录返回lid head中
      this.$store.dispatch('setName', user_info.name)
      this.$store.dispatch('setSid', user_info.sid)
      this.$store.dispatch('setGuest', user_info.guest)
      this.$store.dispatch('setSeq', user_info.seq)
      this.$store.dispatch('setTid', user_info.tid)
      this.$store.dispatch('setShareKey', user_info.shareKey)
      this.$api.login.dev_msg_listener_add();
    }
  },
  watch: {
    "$store.state.user.qid" (val) {
      let user_info = JSON.parse(sessionStorage.getItem('user_info'))
      user_info.qid = val;
      sessionStorage.setItem('user_info', JSON.stringify(user_info))
    }
  },
  destroyed () {
    if (this.$store.state.user.setMmqPickTimeFlag1) {
      clearInterval(this.$store.state.user.setMmqPickTimeFlag1)
    }
    if (this.$store.state.user.setMmqPickTimeFlag2) {
      clearInterval(this.$store.state.user.setMmqPickTimeFlag2)
    }
    sessionStorage.removeItem('user_info')
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