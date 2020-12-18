<template>
  <div>
    <div data-vjs-player>
      <video ref="videoNode" class="video-js vjs-default-skin vjs-big-play-centered">抱歉，您的浏览器不支持</video>
    </div>
  </div>
</template>
<script>
import videojs from "video.js";
//播放器中文，不能使用.js文件
// import videozhCN from "video.js/dist/lang/zh-CN.json";
//样式文件注意要加上
import "video.js/dist/video-js.css";
//如果要播放RTMP要使用flash 需要先npm i videojs-flash
import "videojs-flash";
export default {
  data () {
    return {
      player: null,
    };
  },
  //初始化播放器
  mounted () {
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
      sources: [
        {
          // type: 'rtmp/flv',
          // src: 'rtmp://202.69.69.180:443/webcast/bshdlive-pc'
          type:'application/x-mpegURL',
          src: 'http://iqiyi.cdn9-okzy.com/20200916/15483_11c434b2/index.m3u8'
          //type: 'rtmp/flv',
        }
      ]
    };
    this.player = videojs(
      this.$refs.videoNode,
      options,
      function onPlayerReady () {
        videojs.log(`Your player is ready!`);
      }
    );
    // videojs.addLanguage("zh-CN", videozhCN);
  },
  beforeDestroy () {
    if (this.player) {
      this.player.dispose();
    }
  }
}
</script>