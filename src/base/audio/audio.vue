<template>
  <div class="audio">
    <audio :src="musicSrc" id="audio" loop></audio>
    <transition name="right-left">
      <div class="btns" v-show="isPlay > 0" @click="playPause('audio')">
        <img src="../../assets/images/icon_01.png" alt="" class="btn-play" v-show="isPlay == 1">
        <img src="../../assets/images/icon_01s.png" alt=""  v-show="isPlay == 2">
      </div>
    </transition>
  </div>
</template>

<script>
import { shareConfig } from 'api/request'
export default {
  data() {
    return {
      // musicSrc: 'https://game.flyh5.cn/resources/game/wechat/szq/gaoxiao/music.mp3',
      musicSrc: '',
      isPlay: 0
    }
  },
  mounted() {
    this.shareConfig()
  },
  created() {

  },
  methods: {
    shareConfig() {
      shareConfig().then(res => {
        if (res.error == 200) {
          this.musicSrc = res.data.music
          this.autoPlayAudio("audio")
        } else {
          this.autoPlayAudio("audio")
        }
      }).catch(err => {
        console.log(err)
        this.autoPlayAudio("audio")
      })
    },
    autoPlayAudio(audioId) {
      let _audio = document.getElementById(audioId)
      _audio.oncanplay = () => {
        _audio.play()
        this.isPlay = 1
        console.log("【背景音乐自动播放OK1】")
      }
      document.addEventListener("WeixinJSBridgeReady", () => {
        _audio.play();
        this.isPlay = 1
        console.log("【背景音乐自动播放OK2】")
      }, false);
    },
    playPause(audioId) {
      let _audio = document.getElementById(audioId)
      if (_audio.paused) {
        _audio.play()
        this.isPlay = 1
      } else { 
        _audio.pause() 
        this.isPlay = 2 
      }
    }
  }
}
</script>

<style scoped>
  .btns{position: fixed;right:0;top:0;padding: .3rem;z-index:999;transition: all .8s;}
  .btns img.btn-play{animation: rotate 2s linear infinite;}
  .btns img{box-shadow: 0 0 20px -2px #FFB8C4;border-radius: 50%;}
  .btns, .btns img{width:.5rem;height:.5rem;}
  .right-left-leave-active{right: -2rem;opacity: 0;}
  .right-left-enter{right: -2rem;opacity: 0;}
  @keyframes rotate{
    from {transform: rotate(0)}
    to {transform: rotate(360deg)}
  }
</style>

