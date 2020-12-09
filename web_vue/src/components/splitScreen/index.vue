<template>
  <div id="splitScreen">
    <!-- 中间播放分屏轮播区域 -->
    <div id="centerPlayScreen">
      <div class="playScreen" @click="clickPlayScreen(1)"><div id="screen_1" class="centerAddIco">+</div></div>
      <div class="playScreen" @click="clickPlayScreen(2)"><div id="screen_2" class="centerAddIco">+</div></div>
      <div class="playScreen" @click="clickPlayScreen(3)"><div id="screen_3" class="centerAddIco">+</div></div>
      <div class="playScreen" @click="clickPlayScreen(4)"><div id="screen_4" class="centerAddIco">+</div></div>
    </div>
  </div>
</template>
<style lang="scss">
@import './index.scss';
</style>
<script>
export default {
  data () {
    return {

    }
  },
  methods: {
    clickPlayScreen (num) {
      console.log('enter play screen', num)
      this.$api.play.play({
        dom: $("#screen_" + num),
        sn: this.$store.state.jumpPageData.selectDeviceIpc,
        profile_token: 'p2'
      })
    }
  },
  mounted () {
    console.log('enter split Screen')
  }
}
</script>