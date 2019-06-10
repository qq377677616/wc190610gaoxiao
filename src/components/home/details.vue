<template>
  <div class="details con" ref="con">
    <div class="con-top">
      <div class="title flex-cen">
        <div class="box flex-cen">
          <img :src="detailsData.headimgurl" alt="">
          <p><span class="nowrap">{{detailsData.username}}</span></p>
        </div>
      </div>
      <ul class="flex-cen">
        <li><img src="../../assets/images/page2_42.png" alt=""><p>{{detailsData.signup_id}}</p></li>
        <li><img src="../../assets/images/page2_40.png" alt=""><p>{{detailsData.vote_total}}</p></li>
        <li><img src="../../assets/images/page2_38.png" alt=""><p>{{detailsData.hot_num}}</p></li>
        <li><img src="../../assets/images/page2_36.png" alt=""><p>{{detailsData.gift_point}}</p></li>
      </ul>
      <div class="declaration flex-cen">
        <img src="../../assets/images/page2_35.png" alt="">
        <div class="box nowrap">
          <div ref="nowrapBox">
            <span v-show="isLong" ref="nowrapSpan">{{detailsData.declaration}}</span>
            <marquee v-show="!isLong" direction="left" scrollamount="5" behaviour="scroll">{{detailsData.declaration}}</marquee> 
          </div>
        </div>  
      </div>  
    </div>
    <div class="con-center">
      <div class="box wrap swiper-container2">
        <ul class="swiper-wrapper">
          <li class="swiper-slide backset" v-for="(item, index) in beautyList" :key="index" :style="{backgroundImage: 'url('+item+')'}" @click="lookImgList(index)"><img src="" alt=""></li>
        </ul>
        <div class="swiper-pagination2"></div>
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
      </div>
    </div>
    <advertisement></advertisement>
    <div class="con-bottom wrap">
      <div class="title"><img src="../../assets/images/page2_32.png" alt=""></div>
      <ul>
        <li class="flex-cen" v-for="(item, index) in giftList" :key="`k${index}`">
          <img :src="item.headimgurl" alt="">
          <div class="text">
            <h3>给TA送了{{item.gift_num}}份{{item.gift_name}}！</h3>
            <p>{{item.ctime}}</p>
          </div>
        </li>
        <li class="more">{{moreTypeText}}</li>
      </ul>
      <div class="vote">
        <div class="wrap">
          <img :class="['gift', 'animated', isSwing ? 'swing' : '', status_isBuyingGifts != 200 ? 'dis' : '']" src="../../assets/images/page2_btn4.png" @click="jump_gift" alt="">
          <img :class="['vote-btn', 'animated', isRubberBand ? 'rubberBand' : '', (status_isVote != 200 && status_isVote != 443) ? 'dis' : '']" src="../../assets/images/page2_btn3.png" alt="" @click="isCodeVote">
        </div>
      </div>
    </div>
    <identify v-if="isShowIdentify" @closeIdentify="showIdentify" @verification="vote"></identify>
    <popup v-if="isShowPopup" @closePopup="showPopup"><img src="../../assets/images/code.jpg" alt=""><h4>长按二维码关注公众号</h4></popup>
  </div>      
</template>

<script>
import wx from 'weixin-js-sdk'
import Swiper from 'swiper'
import Identify from 'base/identify/identify'
import Popup from 'base/popup/popup'
import {Indicator} from 'mint-ui'
import Advertisement from 'components/advertisement/advertisement'
import { getDetails, getGiftsList, vote, shareConfig, isVote, isBuyingGifts, getToken } from 'api/request'
export default {
  data() {
    return {
      detailsData: {},
      beautyList: [],
      giftList: [],
      signup_id: '',
      curScrollTop: 0,
      curPage: 1,
      moreType: 1,
      pageLength: 5,
      isMoreType: true,
      isVoteClick: true,
      isShowIdentify: false,
      isShowPopup: false,
      isRubberBand: false,
      isSwing: false,
      interval_class: null,
      swiper: null,
      status_isVote: null,
      status_isVote_text: '服务器繁忙，请稍后再后',
      status_isBuyingGifts: null,
      status_isBuyingGifts_text: '服务器繁忙，请稍后再后',
      isLong: true,
      apiKey: 'college2019325100938111111111111'
    }
  },
  activated() {
    if (this.swiper) {
      let _swiper = this.swiper
      //console.log(_swiper)
      //this.swiperInit()
      //_swiper.update()
      //_swiper.autoplay.start()
    }
  },
  created() {
    this.shareConfig()
    this.isVote()
    this.signup_id = this.$route.query.id
    this.getDetails()
    this.getGiftsList()
    // this.autoClass()
  },
  mounted(){
    window.addEventListener('scroll', res => {
      this.curScrollTop =  document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset
    })
  },
  updated() {
    // this.calcWidth()
  },
  destroyed() {
    //window.removeEventListener('scroll')
  },
  watch:{
    curScrollTop(newValue) {
      let innerHeight = this.$refs.con.clientHeight;
      let outerHeight = document.documentElement.clientHeight;
      if (innerHeight <= (outerHeight + newValue + 10)) {
        if (!this.isMoreType) return
        this.isMoreType = false
        console.log("【加载更多操作】")
        console.log(this.curPage)
        if (this.moreType != 1 || this.curPage == 1) return
        this.moreType = 2
        this.getGiftsList()
      }
    }
  },
  computed: {
    moreTypeText() {
      let _moreTypeText
      if (this.moreType == 0) {
        _moreTypeText = '暂无相关数据'
      } else if (this.moreType == 1) {
        _moreTypeText = '查看更多'
      } else if (this.moreType == 2) {
        _moreTypeText = '加载中...'
      } else if (this.moreType == 3) {
        _moreTypeText = '没有更多了~'
      } else {
        _moreTypeText = '网络异常，请稍后再试~'
      }  
      return _moreTypeText
    }
  },
  methods: {
    calcWidth() {
      this.$nextTick(() => {
        if (this.$refs.nowrapBox.clientWidth < this.$refs.nowrapSpan.clientWidth) {
          this.isLong = false
        }
      })
    },
    getDetails() {
      getDetails({ signup_id: this.signup_id}).then(res => {
        console.log(res)
        if (res.error == 200) {
          this.detailsData = res.data.signupInfo
          this.beautyList = res.data.signupInfo.imgArr
          document.title = `我是${this.detailsData.username}，编号${this.detailsData.signup_id}，正在参加“高校之星遇见最美的你”投票活动`
          this.swiperInit()
          this.calcWidth()
        }
      })
    },
    getGiftsList() {
      let _data = {
        signup_id: this.signup_id,
        page: this.curPage,
        length: this.pageLength
      }
      getGiftsList(_data).then(res => {
        if (res.error == 200) {
          this.isMoreType = true
          if (res.data.list.length == 0 && this.curPage == 1) {
            this.moreType = 0
          } else if (res.data.list.length < this.pageLength) {
            this.moreType = 3 
          } else {
            this.moreType = 1
          }
          console.log("this.giftList", this.giftList)
          this.giftList = this.giftList.concat(res.data.list)
          this.curPage++
        }
      }).catch(err => {
        this.moreType = -1
        this.isMoreType = true
      })
    },
    isCodeVote() {
      if (this.status_isVote !=200 && this.status_isVote !=443) {
        this.$toast(this.status_isVote_text)
        return
      }
      let _isCode = sessionStorage.getItem("isCode")
      if (_isCode == 0) {
        this.vote()
      } else {
        this.showIdentify()
      }
    },
    showPopup() {
      this.isShowPopup = !this.isShowPopup
    },
    showIdentify() {
      this.isShowIdentify = !this.isShowIdentify
    },
    isVote() {
      Promise.all([isVote(), isBuyingGifts()]).then(res => {
        console.log(res)
        this.status_isVote = res[0].error
        this.status_isVote_text = res[0].info
        this.status_isBuyingGifts = res[1].error
        this.status_isBuyingGifts_text = res[1].info
        this.autoClass()
      })
    },
    vote() {
      if (!this.isVoteClick) return
      if (this.isShowIdentify) { this.showIdentify() }
      this.isVoteClick = false
      Indicator.open({text: '正在投票中',spinnerType: 'fading-circle'})
      getToken().then(res => {
        console.log(res)
        let _openId = sessionStorage.getItem("openid")
        let _order_id = this.$md5(_openId + this.apiKey + res.data.code)
        return vote({ signup_id: this.signup_id, order_id: _order_id })
      }).then(res => {
        console.log(res)
        Indicator.close()
        this.isVoteClick = true
        if (res.error == 200) {
          setTimeout(() => {
            this.$toast("投票成功")  
            this.getDetails()
          }, 1000)
        } else if (res.error == 443) {
          this.$toast("请先关注公众号")
          this.showPopup()
        } else {
          this.$toast(res.info)
        }
      }).catch(err => {
        console.log(err)
        Indicator.close()
        this.$toast("网络异常，请稍后再试")
        this.isVoteClick = true
      })
      // vote({ signup_id: this.signup_id }).then(res => {
      //   console.log(res)
      //   Indicator.close()
      //   this.isVoteClick = true
      //   if (res.error == 200) {
      //     setTimeout(() => {
      //       this.$toast("投票成功")  
      //       this.getDetails()
      //     }, 1000)
      //   } else if (res.error == 443) {
      //     this.$toast("请先关注公众号")
      //     this.showPopup()
      //   } else {
      //     this.$toast(res.info)
      //   }
      // }).catch(err => {
      //   console.log(err)
      //   Indicator.close()
      //   this.$toast("网络异常，请稍后再试")
      //   this.isVoteClick = true
      // })
    },
    shareConfig() {
      shareConfig().then(res => {
        if (res.error == 200) {
          sessionStorage.setItem("isCode", res.data.vote_vercode)
        }
      })  
    },
    lookImgList(index) {
      this.previewImage(this.beautyList[index], this.beautyList)
    },
    previewImage(curImg, imgArr) {
      wx.previewImage({
        current: curImg, // 当前显示图片的http链接
        urls: imgArr // 需要预览的图片http链接列表
      });
    },
    jump_gift() {
      if (this.status_isBuyingGifts !=200) {
        this.$toast(this.status_isBuyingGifts_text)
        return
      }
      this.$router.push({path: '/gift', query: {id: this.signup_id}})
    },
    swiperInit() {
      this.swiper = new Swiper('.swiper-container2', {
        spaceBetween: 30,
        centeredSlides: true,
        observer:true,
        observeSlideChildren:true,
        observeParents:true,
        autoplay: {
          delay: 2500,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.swiper-pagination2',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      })
    },
    autoClass(){
      if (this.status_isVote == 200 || this.status_isVote == 413) {
        this.interval_class = setInterval(() => {
          this.isRubberBand = !this.isRubberBand        
        }, 2000)
      }
      if (this.status_isBuyingGifts == 200) {``
        this.interval_class = setInterval(() => {
          this.isSwing = !this.isSwing        
        }, 3000)
      }
    }
  },
  components: {
    Identify: Identify,
    Popup: Popup,
    Advertisement: Advertisement
  }
} 
</script>

<style scoped>
  .con{text-align: center;background: url(../../assets/images/page1_jpg.jpg) repeat-y top center;background-size:cover;min-height: 100vh;}
  .con-top .title .box{width:2.65rem;height:.81rem;background: url(../../assets/images/page2_56.png) repeat-y top center;background-size:cover;}
  .con-top .title .box img{width:.52rem;height:.52rem;border-radius: 50%;margin-right:.15rem;}
  .con-top .title .box p{font-size: .28rem;color:#fff;max-width: 60%;}
  .con-top .title .box p span{display: block;}
  .con-top ul{padding:.4rem 0 .42rem;}
  .con-top ul li{flex:1;}
  .con-top ul li img{width:1.36rem;}
  .con-top ul li p{padding-top: .16rem;font-size: .28rem;color:#e7667d;}
  .declaration img{width:1.08rem;}
  .declaration .box{width:5.89rem;background: url(../../assets/images/page2_33.png) repeat-y top center;background-size:cover;margin-left:.08rem;padding:0 .35rem;box-sizing: border-box;font-size: .28rem;color:#2681b7;text-align: left;}
    .declaration .box marquee{position: absolute;left:0;top:0;width:100%;height:100%;}
  .declaration .box>div{height:.8rem;line-height:.8rem;position: relative;}
  .declaration .box span{display: inline-block;}
  .con-center{padding-top: .55rem;}
  .con-center .box{border:.1rem solid #fff;box-shadow: 0px 2px 12px 0px rgba(246, 163, 183, 0.71);border-radius:.3rem;overflow: hidden;}
  .con-center .box ul{width:100%;height:100%;}
  .con-center ul li{width:100% !important;height:7.6rem;border-radius:.3rem;}
  .swiper-container2{position: relative;}
  .swiper-button-prev{background-image: url(../../assets/images/page2_btn1.png);background-size:.34rem;}
  .swiper-button-next{background-image: url(../../assets/images/page2_btn2.png);background-size:.34rem;}
  .swiper-pagination2.swiper-pagination-bullets{position:absolute;z-index: 50;}
  /* .con-bottom{padding:.64rem 0 1.9rem;} */
  .con-bottom{padding:.4rem 0 1.9rem;}
  .con-bottom .title{padding-bottom:.18rem;text-align: left;}
  .con-bottom .title img{width:1.77rem;}
  .con-bottom ul li{padding:.2rem 0;}
  .con-bottom ul li:not(:last-child){border-bottom: 1px dashed #fff;text-align: left;}
  .con-bottom ul li .text{flex:1;}
  .con-bottom ul li img{width:.74rem;height:.74rem;border-radius: 50%;margin-right:.17rem;}
  .con-bottom ul li h3{font-size: .28rem;color:#e76a80;}
  .con-bottom ul li p{font-size: .24rem;color:#fff;padding-top:.13rem;}
  .con-bottom ul li.more{padding:.4rem 0;font-size: .28rem;color:#fff;}
  .con-bottom .vote{width:100%;height:.98rem;background: #fff;position: fixed;left:0;bottom:0;z-index: 500;text-align: right;}
  .con-bottom .vote img.gift{width:1.1rem;}
  .con-bottom .vote .wrap{display: flex;align-items: center;justify-content: flex-end;height:100%;}
  .con-bottom .vote img.vote-btn{width:1.8rem;position: absolute;left:calc(50% - .9rem);top:-.83rem;}
  .con-bottom .vote img.vote-btn.dis,.con-bottom .vote img.gift.dis{filter:grayscale(1);}
</style>
