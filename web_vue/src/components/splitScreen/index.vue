<template>
  <div id="splitScreen">
    <!-- 中间播放分屏轮播区域 -->
    <div id="centerPlayScreen">
      <!-- <video-player class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="true" :options="playerOptions">
      </video-player> -->

      <div class="playScreen" @click="clickPlayScreen(1)">
        <video-player class="video-player vjs-custom-skin" style="width: 100%" ref="videoPlayer" :playsinline="true" :options="playerOptions">
        </video-player>
        <div id="screen_1" class="centerAddIco">+</div>
      </div>
      <div class="playScreen" @click="clickPlayScreen(2)">
        <div id="screen_2" class="centerAddIco">+</div>
      </div>
      <div class="playScreen" @click="clickPlayScreen(3)">
        <div id="screen_3" class="centerAddIco">+</div>
      </div>
      <div class="playScreen" @click="clickPlayScreen(4)">
        <div id="screen_4" class="centerAddIco">+</div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
@import './index.scss';
</style>
<script>
import videojs from 'video.js'
window.videojs = videojs
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
import { videoPlayer } from 'vue-video-player'
import 'videojs-flash'
import SWF_URL from 'videojs-swf/dist/video-js.swf'

// require('videojs-contrib-hls/dist/videojs-contrib-hls.js')
//引入hls.js
// import 'videojs-contrib-hls'
// import 'videojs-contrib-hls/dist/videojs-contrib-hls.js'

videojs.options.flash.swf = SWF_URL // 设置flash路径，Video.js会在不支持html5的浏览中使用flash播放视频文件
export default {
  components: {
    videoPlayer
  },
  data () {
    return {
      videoSrc: '',
      playerOptions: {
        live: true,
        autoplay: true, // 如果true，浏览器准备好时开始播放
        muted: false, // 默认情况下将会消除任何音频
        loop: false, // 是否视频一结束就重新开始
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        aspectRatio: '4:3', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        controlBar: {
          timeDivider: false,
          durationDisplay: false,
          remainingTimeDisplay: false,
          currentTimeDisplay: false, // 当前时间
          volumeControl: false, // 声音控制键
          playToggle: false, // 暂停和播放键
          progressControl: false, // 进度条
          fullscreenToggle: false // 全屏按钮
        },
        // html: {
        //   hls: {
        //     withCredentials: false
        //   }
        // },
        techOrder: ['html5'], // 兼容顺序
        sources: [
          {type: 'application/x-mpegURL', src: 'http://iqiyi.cdn9-okzy.com/20200916/15483_11c434b2/index.m3u8', withCredentials: false}
        //   {
        //   type: '', //'rtmp/flv',
        //   src: '' // 视频地址-改变它的值播放的视频会改变
        // }
        ],
        notSupportedMessage: '此视频暂无法播放，请稍后再试' // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
      }
    }
  },
  methods: {
    clickPlayScreen (num) {
      console.log('enter play screen', num)
      this.$api.play.getPlayUrl({
        sn: '1jfiegbrhyjva',
        profile_token: 'p1'
      }).then(res => {
        console.log(res, 'getPlayUrl_res')
        // flash (测试成功)
        // this.$set(this.playerOptions, 'flash', {hls:{withCredentials: false}, swf: SWF_URL})
        // this.$set(this.playerOptions, 'techOrder', ['flash'])
        // this.$set(this.playerOptions, 'sources', [{type: 'rtmp/flv', src: 'rtmp://202.69.69.180:443/webcast/bshdlive-pc'}])
        // hls
        // this.$set(this.playerOptions, 'hls', true)
        // this.$set(this.playerOptions, 'sources', [{ type: 'application/x-mpegURL', src: 'https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8', withCredentials: true }]) //'rtmp/flv' res.data.uri.url + '.m3u8'
        console.log(this.playerOptions, 'playerOptions')
      })
    }
  },
  mounted () {
    console.log('enter split Screen')
  }
}
</script>