<template>
<!-- 入口文件 -->
  <div id="app">
    <div id="tip_div"></div>
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
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
</style>
