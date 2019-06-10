<template>
  <div class="gift con">
    <div class="con-top">
      <div class="title flex-cen">
        <div class="box flex-cen">
          <img :src="detailsData.headimgurl" alt="">
          <div class="text">
            <p><span class="nowrap">{{detailsData.username}}</span></p>
            <h4>给TA送上一份礼物吧</h4>
          </div>
        </div>
      </div>
      <ul class="flex-cen">
        <li><img src="../../assets/images/page2_42.png" alt=""><p>{{detailsData.signup_id}}</p></li>
        <li><img src="../../assets/images/page2_40.png" alt=""><p>{{detailsData.vote_total}}</p></li>
        <li><img src="../../assets/images/page2_38.png" alt=""><p>{{detailsData.hot_num}}</p></li>
        <li><img src="../../assets/images/page2_36.png" alt=""><p>{{detailsData.gift_point}}</p></li>
      </ul> 
    </div>
    <div class="con-center">
      <div class="prize">
        <ul class="box">
          <li :class="{'backset': true, 'cur': curSelectIndex == index}" v-for="(item, index) in prizeList" :key="`k${index}`" :style="{backgroundImage: 'url(' + item.gift_icon + ')'}" @click="selectPrize(index, item.gift_name, item.gift_id, item.price, item.jifen_price)"></li>
        </ul>
        <div class="payment-btn"><img src="../../assets/images/page4_btn.png" @click="purchase" alt=""></div>
        <div class="num">
          <h3>请选择以上礼物</h3>
          <div class="input flex-cen">
            <span>数量:</span>
            <input type="number" pattern="\d*" v-model="num" @input="input" @blur="blur"/>
          </div>
        </div>
      </div>
      <div class="sending-words">
        <div class="input"><input type="text" placeholder="请输入礼物寄语" :maxlength="maxInputNum" v-model="sendingWords" @blur="blur"/></div>
        <h4>我的积分 {{integral}}</h4>
      </div>
    </div>
    <div>
    <advertisement></advertisement>
    <mt-actionsheet
      :actions="actionsheet"
      v-model="sheetVisible">
    </mt-actionsheet>
    </div>
  </div>      
</template>

<script>
import { Indicator } from 'mint-ui'
import { backPageTop } from 'common/js/util'
import Advertisement from 'components/advertisement/advertisement'
import { geHomeData, getDetails, getIntegral, payment, givingGifts, integralPay } from 'api/request'
export default {
  data() {
    return {
      signup_id: '', 
      num: 1,
      MinVotes: 1,
      MaxVotes: 99,
      detailsData: {},
      prizeList: [],
      gifts: {},
      curSelectIndex: -1,
      integral: '--',
      sendingWords: '',
      maxInputNum: 30,
      WeixinJSBridge_data: {},
      actionsheet: [
        {
          name: '微信支付',
          method : this.weChatPay	// 调用methods中的函数
        }, 
        {
          name: '积分支付', 
          method : this.integralPay	// 调用methods中的函数
        }
      ],
      sheetVisible: false
    }
  },
  mounted(){
    this.geHomeData()
    this.getDetails()
    this.getIntegral()
  },
  created() {
    this.signup_id = this.$route.query.id
  },
  methods: {
    geHomeData() {
      geHomeData().then(res => {
        if (res.error == 200) {
          document.title = res.data.getActiveSet.ac_name || '给Ta送礼物吧~'
        }
      })
    },
    getDetails() {
      getDetails({ signup_id: this.signup_id}).then(res => {
        console.log(res)
        if (res.error == 200) {
          this.detailsData = res.data.signupInfo
          this.prizeList = res.data.giftSet
        }
      })
    },
    getIntegral() {
      getIntegral().then(res => {
        if (res.error == 200) {
          this.integral = res.data.jifen_remain
        }
      })
    },
    selectPrize(index, gift_name, gift_id, price, jifen_price) {
      this.curSelectIndex = index
      this.gifts.gift_name = gift_name
      this.gifts.gift_id = gift_id
      this.gifts.price = price
      this.gifts.jifen_price = jifen_price
      console.log(this.gifts)
    },
    purchase() {
      if (this.curSelectIndex < 0) {
        this.$toast("请选择一款礼物")
        return
      } else if (!this.sendingWords) {
        this.$toast("礼物寄语不能为空")
        return
      }
      this.sheetVisible = true
    },
    //微信支付
    weChatPay() {
      console.log("【微信支付】")
      Indicator.open({text: '微信支付中',spinnerType: 'fading-circle'})
      let _data = {
        signup_id: this.signup_id,
        gift_id: this.gifts.gift_id,
        gift_num: this.num
      }
      payment(_data).then(res => {
        if (res.error == 200) {
          this.WeixinJSBridge_data.appId = res.data.getJsApiParam.appId
          this.WeixinJSBridge_data.timeStamp = res.data.getJsApiParam.timeStamp
          this.WeixinJSBridge_data.nonceStr = res.data.getJsApiParam.nonceStr
          this.WeixinJSBridge_data.package = res.data.getJsApiParam.package
          this.WeixinJSBridge_data.signType = res.data.getJsApiParam.signType
          this.WeixinJSBridge_data.paySign = res.data.getJsApiParam.paySign
          this.order_id = res.data.order_id
          this.callpay()
        } else {
          Indicator.close()
          this.$toast(res.info)
        }
      }).catch(err => {
        console.log(err)
        Indicator.close()
        this.$toast("支付失败，请稍后再试")
      })
    },
    callpay() {
      if (typeof WeixinJSBridge == "undefined") {
        if (document.addEventListener) {
          document.addEventListener('WeixinJSBridgeReady', jsApiCall, false);
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', jsApiCall);
          document.attachEvent('onWeixinJSBridgeReady', jsApiCall);
        }
      } else {
      	this.jsApiCall();
      }
    },
    jsApiCall() {
      let _self = this
      WeixinJSBridge.invoke('getBrandWCPayRequest', this.WeixinJSBridge_data,function(res) {
        if (res.err_msg == "get_brand_wcpay_request:ok") {
          givingGifts({ order_id: _self.order_id }).then(res => {
            if (res.error == 200) {
              console.log("【礼物送出去了】")
              console.log(res)
              setTimeout(() => {
                Indicator.close()
                _self.$toast("支付成功，礼物送成功啦~")
                this.curSelectIndex = -1
                this.getDetails()
              }, 1500)
            } else {
              Indicator.close()
              _self.$toast(res.info)
            }
          })
        } else {// 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
          Indicator.close()
          _self.$toast("支付失败")
        }  
      });
    },
    //积分支付
    integralPay() {
      // if (this.integral < this.gifts.jifen_price) {
      //   this.$toast("您的积分不足")
      //   return
      // }
      console.log("【积分支付】")
      Indicator.open({text: '积分支付中',spinnerType: 'fading-circle'})
      let _data = {
        signup_id: this.signup_id,
        gift_id: this.gifts.gift_id,
        gift_num: this.num
      }
      integralPay(_data).then(res => {
        console.log(res)
        if (res.error == 200) {
          setTimeout(() => {
            this.getIntegral()
            Indicator.close()
            this.$toast("支付成功，礼物送成功啦~")
            this.getDetails()
            this.curSelectIndex = -1
          }, 1500)
        } else {
          Indicator.close()
          this.$toast(res.info)
        }
      })
    },
    input(e) {
      let _num = this.num
      if (_num > this.MaxVotes) {
        this.num = this.MaxVotes
        this.$toast(`一次赠送礼物数量最多${this.MaxVotes}哦~`)  
      } else if (_num < this.MinVotes) {
        this.num = this.MinVotes
        this.$toast(`一次赠送礼物数量不能少于${this.MinVotes}哦~`)  
      } 
    },
    blur() {
      console.log("【回到顶部】")
      backPageTop()
    }
  },
  components: {
    Advertisement: Advertisement
  }
} 
</script>

<style scoped>
  .con{text-align: center;background:#FFD5DF url(../../assets/images/page1_jpg.jpg) repeat-y top center;background-size:cover;min-height: 100vh;}
  .con-top .title .box{width:3.56rem;height:1.09rem;background: url(../../assets/images/page4_24.png) repeat-y top center;background-size:cover;text-align: left;}
  .con-top .title .box img{width:.7rem;height:.7rem;border-radius: 50%;margin-right:.15rem;}
  .con-top .title .box .text{max-width: 65%;}
  .con-top .title .box p{font-size: .28rem;color:#fff;}
  .con-top .title .box p span{display: block;}
  .con-top .title .box h4{font-size: .24rem;color:#fff;padding-top: .08rem;white-space: nowrap;}
  .con-top ul{padding:.4rem 0 .42rem;}
  .con-top ul li{flex:1;}
  .con-top ul li img{width:1.36rem;}
  .con-top ul li p{padding-top: .16rem;font-size: .28rem;color:#e7667d;}
  .con-center .prize{width:7.5rem;height:8.77rem;background: url(../../assets/images/bg_01.png) repeat-y top center;background-size:cover;font-size: 0;}
  .con-center ul{padding:.8rem .8rem .6rem;height:4.77rem;}
  .con-center ul li{display: inline-block;position: relative;}
  .con-center ul li.cur::after{content:"";display: block;width:100%;height:100%;background: url(../../assets/images/page4_31.png) repeat-y top center;background-size:100% 100%;position: absolute;left:0;top:0;}
  .con-center ul li, .con-center ul li img{width:1.88rem;height:1.51rem;border-radius: .1rem;}
  .con-center ul li:nth-child(3n-1){margin:0 .08rem;}
  .con-center ul li:nth-child(4),.con-center ul li:nth-child(5),.con-center ul li:nth-child(6){margin-top:.12rem;margin-bottom:.12rem;}
  .payment-btn img{width:3.42rem;}
  .num{padding:.4rem 0 .2rem;}
  .num h3{font-size:.28rem;color:#e7667d;}
  .num .input{width:1.98rem;height:.6rem;background: url(../../assets/images/bg_02.png) repeat-y top center;background-size:cover;margin:.18rem auto 0;}
  .num .input span,.num .input input{font-size: .28rem;color:#fff;}
  .num .input span{padding-left: .13rem;}
  .num .input input{flex:1;width:1rem;text-align: center;}
  .sending-words .input{width:5.89rem;height:.8rem;background: url(../../assets/images/page2_33.png) repeat-y top center;background-size:cover;margin:0 auto;}
  .sending-words input{padding-left: .5rem;font-size: .28rem;color:#2681B7;height:.8rem;line-height: .8rem;text-align: left;width:100%;box-sizing: border-box;}
  .sending-words ::-webkit-input-placeholder{color:#2681B7;}
  .sending-words h4{padding:.27rem 0 .3rem;color:#e7667d;font-size: .28rem;}
</style>
