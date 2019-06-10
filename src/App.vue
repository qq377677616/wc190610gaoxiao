<template>
  <div id="app" :class="{'on': isShowTabbar}">
    <!-- <transition :name="transitionRouter"><keep-alive><router-view class="router-view"></router-view></keep-alive></transition> -->
    <transition :name="transitionRouter"><router-view class="router-view"></router-view></transition>
    <my-header :index="index" v-show="isShowTabbar"></my-header>
    <my-audio></my-audio>
  </div>
</template>

<script>
import wx from 'weixin-js-sdk'
import MyHeader from 'components/my-header/my-header'
import myAudio from 'base/audio/audio'
import { shareConfig } from 'api/request'
import { loadScript, backPageTop, getUrlParameter, GetQueryString } from 'common/js/util'
export default {
  name: 'App',
  data() {
    return {
      transitionRouter: 'router-right',
      isShowTabbar: true,
      index: 0,
      shareList: {
        shareTitle: '高校之星，遇见最美的你',// 分享标题
        shareDesc: '是美女，你就来。',// 分享描述
        shareLink: "http://game.flyh5.cn/game/wx5b08e0adcb96058c/mar_college/?ac_id=" + GetQueryString("ac_id"),// 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        shareIcon: "https://game.flyh5.cn/resources/game/wechat/szq/gaoxiao/logo.jpg",// 分享图标
      }
    }
  },
  created() {
    this.isRouterPath(this.$route.path)
    this.shareConfigInit()
  },
  methods: {
    shareConfigInit() {
      shareConfig().then(res => {
        if (res.error == 200) {
          this.shareList.shareTitle = res.data.share_title
          this.shareList.shareDesc = res.data.share_desc
          this.shareList.shareIcon = res.data.share_img
          this.wxConfigInit()
        } else {
          this.wxConfigInit()
        }
      }).catch(err => {
        console.log(err)
        this.wxConfigInit()
      })
    },
    wxConfigInit() {
      let _self = this
      wx.config({
        debug: false,
        appId: wx_config['appId'], 
        timestamp: wx_config['timestamp'],
        nonceStr: wx_config['nonceStr'],
        signature: wx_config['signature'],
        jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'updateAppMessageShareData', 'updateTimelineShareData', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'translateVoice', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice','onVoicePlayEnd', 'pauseVoice', 'stopVoice', 'uploadVoice', 'downloadVoice', 'chooseImage', 'getLocalImgData', 'previewImage', 'uploadImage', 'downloadImage', 'getNetworkType', 'openLocation', 'getLocation', 'hideOptionMenu', 'showOptionMenu', 'closeWindow', 'scanQRCode', 'chooseWXPay', 'openProductSpecificView', 'addCard', 'chooseCard', 'openCard']
      })
      wx.ready(function() {
        console.log("【微信readyOk了】")
        /*分享给【微信好友】和【QQ好友】*/
        wx.updateAppMessageShareData({ 
          title: _self.shareList.shareTitle,
          desc: _self.shareList.shareDesc,
          link: _self.shareList.shareLink,
          imgUrl: _self.shareList.shareIcon,
          success: function () {
            //alert("【微信好友】和【QQ好友】")
          } 
        })
        /*分享给【朋友圈】和【QQ空间】*/
        wx.updateTimelineShareData({ 
          title: _self.shareList.shareTitle,
          desc: _self.shareList.shareDesc,
          link: _self.shareList.shareLink,
          imgUrl: _self.shareList.shareIcon,
          success: function () {
            //alert("【朋友圈】和【QQ空间】")
          }
        });
        // // 2.1监听“分享到朋友”按钮点击、自定义分享内容及分享结果接口
        wx.onMenuShareAppMessage({
          title: _self.shareList.shareTitle,
          desc: _self.shareList.shareDesc,
          link: _self.shareList.shareLink,
          imgUrl: _self.shareList.shareIcon,
          success: function(res) {
          }
        });
        // // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
        wx.onMenuShareTimeline({
          title: _self.shareList.shareTitle,
          desc: _self.shareList.shareDesc,
          link: _self.shareList.shareLink,
          imgUrl: _self.shareList.shareIcon,
          success: function(res) {
          }
        })
      })
      wx.error(function(err){
        console.log(err)
        this.shareConfigInit()
      })
    },
    isRouterPath(path) {
      if (path == '/') {
        this.index = 0  
      } else if (path == '/signUp') {
        this.index = 1  
      } else if (path == '/prize') {
        this.index = 2  
      } else if (path == '/ranking') {
        this.index = 3  
      } else if (path == '/details' || path == '/gift') {
        this.isShowTabbar = false
      }
    }
  },
  watch: {
    '$route'(to, from) {
      backPageTop()
      this.isRouterPath(to.path)
      if ((from.path == '/' && to.path == '/details') || (from.path == '/ranking' && to.path == '/details') || (from.path == '/details' && to.path == '/gift')) {
        this.transitionRouter = 'router-right'
      } else if ((from.path == '/gift' && to.path == '/details') || (from.path == '/details' && to.path == '/') || (from.path == '/details' && to.path == '/ranking')) {
        this.transitionRouter = 'router-left'
      } else {
        this.transitionRouter = ''
      }
      if (to.path == '/details' || to.path == '/gift') {
        this.isShowTabbar = false
      } else {
        this.isShowTabbar = true  
      }
    }
  },
  components: {
    MyHeader: MyHeader,
    myAudio: myAudio
  }
}
</script>

<style scoped>
  #app{background: #FFD5DF;width:100%;min-height: 100vh;}
  /* #app.on{padding-bottom:.98rem;} */
  .router-view{ transition: all .5s cubic-bezier(.55,0,.1,1);width: 100%;position: absolute;}
  .router-right-enter, .router-left-leave-active{opacity: 0;transform: translate(60%, 0);} 
  .router-right-leave-active, .router-left-enter{opacity: 0;transform: translate(-100%, 0);}  
</style>
