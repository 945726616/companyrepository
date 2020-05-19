<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <testJq></testJq>
    <!-- <HelloWorld msg="welcome"/> -->
  </div>
</template>

<script>
// import HelloWorld from "./components/HelloWorld.vue"
import testJq from "./components/testJq.vue"

export default {
  name: "App",
  components: {
    testJq
    // HelloWorld
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
  margin-top: 60px;
}
</style>
