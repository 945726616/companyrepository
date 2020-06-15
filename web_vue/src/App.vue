<template>
<!-- 入口文件 -->
  <div id="app">
    <!-- 调用路由部分进行渲染 -->
    <router-view />
  </div>
</template>

<script>

export default {
  name: "App"
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
