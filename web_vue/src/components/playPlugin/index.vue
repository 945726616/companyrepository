<template>
  <div v-show='playerObj' :style='{width: playerObj.playWidth}'>
    <div id="playerArea">
      <video v-show="playerObj.playRef" :ref="playerObj.playRef" class="video-js vjs-default-skin vjs-big-play-centered">{{mcs_download_client}}</video>
    </div>
    <!-- <div id="player1">
      <video ref="videoNode1" class="video-js vjs-default-skin vjs-big-play-centered">抱歉，您的浏览器不支持</video>
    </div>
    <div id="player2">
      <video ref="videoNode2" class="video-js vjs-default-skin vjs-big-play-centered">抱歉，您的浏览器不支持</video>
    </div>
    <div id="player3">
      <video ref="videoNode3" class="video-js vjs-default-skin vjs-big-play-centered">抱歉，您的浏览器不支持</video>
    </div>
    <div id="player4">
      <video ref="videoNode4" class="video-js vjs-default-skin vjs-big-play-centered">抱歉，您的浏览器不支持</video>
    </div> -->
  </div>
</template>
<script>
import videojs from "video.js"
//播放器中文，不能使用.js文件
// import videozhCN from "video.js/dist/lang/zh-CN.json";
//样式文件注意要加上
import "video.js/dist/video-js.css"
//如果要播放RTMP要使用flash 需要先npm i videojs-flash
import "videojs-flash"
export default {
  props: { // 组件封装传递参数
    playerObj: { // 调用播放器插件播放需要传递的传递的参数
      type: Object,
      default: function () { }
    },
  },
  data () {
    return {
      player: null, // 播放器对象
      mcs_download_client: mcs_download_client, // 浏览器不支持插件，请下载Vimtag客户端

    }
  },
  //初始化播放器
  mounted () {
    console.log('enter playPlugin', this.playerObj, this.$refs[this.playerObj.playRef])
    let options = {
      autoplay: true, //自动播放
      // controls: true, // 控制条展示
      // controlBar: {
      //   timeDivider: false,
      //   durationDisplay: false,
      //   remainingTimeDisplay: false,
      //   currentTimeDisplay: false, // 当前时间
      //   volumeControl: false, // 声音控制键
      //   playToggle: false, // 暂停和播放键
      //   progressControl: false, // 进度条
      //   fullscreenToggle: false // 全屏按钮
      // },
      preload: "auto", //自动加载
      errorDisplay: true, //错误展示
      fluid: true, //跟随外层容器变化大小，跟随的是外层宽度
      // controlBar: true,  // 设为false不渲染控制条DOM元素，只设置controls为false虽然不展示，但是存在
      // textTrackDisplay: false,  // 不渲染字幕相关DOM
      userActions: {
        hotkeys: true //是否支持热键
      },
      notSupportedMessage: "此视频暂无法播放，请稍后再试",
      // techOrder: ["flash"],//定义Video.js技术首选的顺序 "html5",
      // techOrder: ["html5"],
      // sources: [
      //   {
      //     // type: 'rtmp/flv',
      //     // src: 'rtmp://45.113.201.2:6010/live/1jfiegbqwrviq_p0_LIRAAXECKUQA'
      //     type:'application/x-mpegURL',
      //     src: 'http://iqiyi.cdn9-okzy.com/20200916/15483_11c434b2/index.m3u8'
      //     //type: 'rtmp/flv',
      //   }
      // ]
    }
    if (this.publicFunc.hasUsableFlash()) { // 判断flash是否开启方法 true为开启了flash false为关闭flash
      options.techOrder = ['flash'] // 启用flash解析
      options.sources = [{type: 'rtmp/flv', src: 'rtmp://45.113.201.2:6010/live/1jfiegbqwrviq_p0_LIRAAXECKUQA'}]
    } else {
      options.techOrder = ['html5'] // 启用html5解析
      options.sources = [{type:'application/x-mpegURL', src: 'http://iqiyi.cdn9-okzy.com/20200916/15483_11c434b2/index.m3u8'}]
    }

    // videojs.options = options
    let playDom = this.$refs[this.playerObj.playRef]
    this.player = videojs(
      this.$refs[this.playerObj.playRef],
      options,
      function onPlayerReady () {
        videojs.log(`Your player is ready!`, this.player)
      }
    )
    console.log(this.player, 'this.player')
    // this.player2 = videojs(
    //   this.$refs.videoNode2,
    //   options,
    //   function onPlayerReady () {
    //     videojs.log(`Your player is ready!`)
    //   }
    // )
    // this.player3 = videojs(
    //   this.$refs.videoNode3,
    //   options,
    //   function onPlayerReady () {
    //     videojs.log(`Your player is ready!`)
    //   }
    // )
    // this.player4 = videojs(
    //   this.$refs.videoNode4,
    //   options,
    //   function onPlayerReady () {
    //     videojs.log(`Your player is ready!`)
    //   }
    // )
  },
  beforeDestroy () { // 页面注销时注销所有播放器
    if (this.player) {
      this.player.dispose()
    }
    // if (this.player2) {
    //   this.player2.dispose()
    // }
    // if (this.player3) {
    //   this.player3.dispose()
    // }
    // if (this.player4) {
    //   this.player4.dispose()
    // }
  }
}
</script>