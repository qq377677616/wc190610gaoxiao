<template>
  <div class="home container">
    <div class="banner">
      <!-- <img :src="homeData.getActiveSet.ac_img"/> -->
      <div class="img backret backset" :style="{backgroundImage: 'url(' + homeData.getActiveSet.ac_img + ')'}"></div>   
    </div>
    <div class="con">
      <div class="news">
        <text-scroll :text-list="textList" scroll-type="scroll-up"></text-scroll>
      </div>
      <div class="con-top">
        <ul class="details flex-cen">
          <li>
            <img src="../../assets/images/page1_21.png" alt="">
            <p>{{homeData.acSignNum}}</p>
          </li>
          <li>
            <img src="../../assets/images/page1_19.png" alt="">
            <p>{{homeData.acVoteTotal}}</p>
          </li>
          <li>
            <img src="../../assets/images/page1_17.png" alt="">
            <p>{{homeData.pv}}</p>
          </li>    
        </ul>
        <div class="time">
          <h3>活动结束倒计时</h3>
          <ul class="flex-cen">
            <li>{{curTimes.day}}天</li><li>{{curTimes.hours}}时</li><li>{{curTimes.min}}分</li><li>{{curTimes.seconds}}秒</li>
          </ul>    
        </div>
        <div class="enroll">
          <img src="../../assets/images/page1_btn1.png" @click="jump_signUp" alt="">    
        </div>
      </div> 
      <div class="con-center">
        <div class="search flex-cen">
          <div class="input">
            <input type="text" v-model="inputText" placeholder="请输入编号或姓名">
          </div>
          <div class="btn" @click="searchs"></div>
        </div>  
        <div class="list">
        <div class="flex">  
            <ul class="left">
            <li v-for="(item, index) in beautyList_even" :key="index" @click="jump_details(item.signup_id)">
                <div class="img" :style="{backgroundImage: 'url('+item.img+')'}"></div>
                <div class="title">
                <h3 class="nowrap">{{item.username || '高校之星'}}</h3>
                <p>{{item.signup_id}}号，{{item.vote_total}}票</p>    
                </div>
                <img src="../../assets/images/page1_btn3.png" class="icon"/>
            </li>    
            </ul>
            <ul class="right">
            <li v-for="(item, index) in beautyList_odd" :key="index" @click="jump_details(item.signup_id)">
                <div class="img" :style="{backgroundImage: 'url('+item.img+')'}"></div>
                <div class="title">
                <h3 class="nowrap">{{item.username || '高校之星'}}</h3>
                <p>{{item.signup_id}}号，{{item.vote_total}}票</p>    
                </div>
                <img src="../../assets/images/page1_btn3.png" class="icon"/>
            </li>    
            </ul>
        </div>
        <div class="more" @click="clickMore">{{moreTypeText}}</div>   
        </div> 
      </div>
      <div class="con-bottom wrap">
        <h3>活动规则</h3>
        <!-- <h4>【活动背景】</h4> -->
        <div class="rule-con" v-html="homeData.getActiveSet.ac_rule"></div>
        <!-- <p>1、本次秒杀活动为中国电信天翼用户专享。2、活动期间使用任何舞弊行为的用户一经发现,即刻取消秒杀活动资格。3、每日秒杀的礼品数量有限,秒完即止。</p>
        <p>1、本次秒杀活动为中国电信天翼用户专享。2、活动期间使用任何舞弊行为的用户一经发现,即刻取消秒杀活动资格。3、每日秒杀的礼品数量有限,秒完即止。</p>
        <p>1、本次秒杀活动为中国电信天翼用户专享。2、活动期间使用任何舞弊行为的用户一经发现,即刻取消秒杀活动资格。3、每日秒杀的礼品数量有限,秒完即止。</p>
        <p>1、本次秒杀活动为中国电信天翼用户专享。2、活动期间使用任何舞弊行为的用户一经发现,即刻取消秒杀活动资格。3、每日秒杀的礼品数量有限,秒完即止。</p> -->
      </div> 
      <advertisement></advertisement> 
    </div> 
  </div>
</template>

<script>
import TextScroll from 'base/text-scroll/text-scroll'
import Advertisement from 'components/advertisement/advertisement'
import { geHomeData, gePeopleList } from 'api/request'
export default {
  name: 'HelloWorld',
  data () {
    return {
      collegeTitle: '高校',
      homeData: { getActiveSet: {} },
      autoTime: null,
      curTimes: {day: '--',hours: '--',min: '--',seconds: '--'},
      textList: [],
      inputText: '',
      beautyList: [],
      curPage: 1,
      pageLength: 6,
      moreType: 1,
      timeout_autoGet: null 
    }
  },
  created() {
    this.geHomeData()
    this.gePeopleList()
  },
  computed: {
    beautyList_even() {
      return this.beautyList.filter((item, index, arr) => {
        if (index % 2 == 0) {
          return item
        }
      })
    },
    beautyList_odd() {
      return this.beautyList.filter((item, index, arr) => {
        if (index % 2 != 0) {
          return item
        }
      })
    },
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
      } 
      return _moreTypeText
    }
  },
  watch: {
    inputText(newValue) {
      console.log(newValue)
      clearTimeout(this.timeout_autoGet)
      if (newValue == '') {
        this.timeout_autoGet = setTimeout(() => {
          this.resetParame()
          this.gePeopleList()
        }, 800)
      }
    }
  },
  methods: {
    //获取首页上部分数据
    geHomeData() {
      geHomeData().then(res => {
        console.log(res)
        if (res.error == 200) {
          this.homeData = res.data
          this.textList = [res.data.getActiveSet.notice]
          this.collegeTitle = res.data.getActiveSet.ac_name
          this.calcTime(res.data.getActiveSet.count_down, res => {
            if (res.status == 1) {
              this.curTimes = res
            } else {
              console.log("【活动结束】")
            }
          })
          document.title = this.collegeTitle
        }
      })
    },
    //获取报名列表
    gePeopleList(keyword) {
      var _data = {}
      if (keyword) {
        _data.keyword = keyword
      } else {
        _data.page =  this.curPage
        _data.length =  this.pageLength
      }
      gePeopleList(_data).then(res => {
        if (res.error == 200) {
          if (res.data.list.length == 0 && this.curPage == 1) {
            this.moreType = 0
          } else if (res.data.list.length < this.pageLength) {
            this.moreType = 3 
          } else {
            this.moreType = 1
          } 
          this.beautyList = this.beautyList.concat(res.data.list)
        }
      })
    },
    //点击查看更多
    clickMore() {
      if (this.moreType != 1) return
      this.curPage++
      this.moreType = 2
      this.gePeopleList()
    },
    //搜索
    searchs(){
      if (this.inputText == '') {
        this.$toast('请先输入编号或姓名')
        return
      }
      this.resetParame()
      this.gePeopleList(this.inputText)
    },
    //重置请求参数
    resetParame() {
      this.beautyList = []
      this.curPage = 1
      this.moreType = 1
    },
    //倒计时
    calcTime(time, callback){
      let _totalTime
      let _isCircle = false
      _totalTime = time
      clearInterval(this.autoTime)
      this.autoTime = setInterval(() => {
        let _day = parseInt(time / (24 * 60 * 60))
        let _hours = parseInt((time % (24 * 60 * 60)) / (60 * 60))
        let _min = parseInt((time - _day * (24 * 60 * 60) - _hours * (60 * 60)) / (60))
        let _seconds = parseInt((time - _day * (24 * 60 * 60) - _hours * (60 * 60)) - _min * 60)
        if (callback) {
          callback({
            status: 1,
            day:　_day,
            hours: _hours,
            min: _min,
            seconds: _seconds
          })
        }
        if (time > 0) {
          time--
          //this.$emit("realTime", {curSeconds: time, curTime: this.currentTime})
        } else {
          clearInterval(this.autoTime)
          if (callback) { callback({status: 2, message: "时间到"}) }
        }
      }, 1000)
    },
    //跳转    
    jump_details(id) {
      this.$router.push({path: '/details', query: {id: id}})
      //this.$router.replace({path: '/details', query: {id: id}})
    },
    jump_signUp() {
      // this.$router.push('/signUp')
      this.$router.replace('/signUp')
    }
  },
  components: {
    TextScroll:　TextScroll,
    Advertisement: Advertisement
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .container{padding-bottom:.98rem;}
  .con{background: url(../../assets/images/page1_jpg.jpg) repeat-y top center;background-size:cover;}
  .banner img{width:100%;}
  .banner .img{height:5.46rem;background-position: center;}
  .details{padding-top:.17rem;}
  .details li{flex:1;text-align: center;}
  .details li:nth-child(2){border-left:.04rem solid #fff;border-right:.04rem solid #fff;}
  .details img{width:1.36rem;}
  .details p{font-size:.28rem;color:#e7667d;padding:.16rem 0 .1rem;}
  .time,.con .enroll{text-align: center;}
  .time h3{font-size: .28rem;color:#fff;padding:.24rem 0 .26rem;}
  .time ul li{width:1.19rem;height:.63rem;line-height: .63rem;margin: 0 .09rem;background: url(../../assets/images/page1_7.png) no-repeat center;background-size:cover;font-size: .28rem;color:#fff;text-align: center;}
  .con .enroll{margin-top: .42rem;}
  .con .enroll img{width:5.34rem;}
  .con .search{padding:.4rem 0 .45rem;}
  .search .input{width:4.66rem;background: url(../../assets/images/page1_4.png) repeat-y top center;background-size:cover;font-size: .28rem;color:#515151;}
  .search .input input{width:100%;height:.85rem;line-height:.85rem;padding-left: .2rem;box-sizing: border-box;}
  .search .btn{width:2.19rem;height:.86rem;margin-left:.31rem;background: url(../../assets/images/page1_btn2.png) repeat-y top center;background-size:cover;}
  .con-center li{width:3.7rem;height:4.05rem;position: relative;background: url(../../assets/images/page1_24.png) repeat-y top center;background-size:cover;padding:.18rem .21rem .2rem .17rem;box-sizing: border-box;text-align: center;margin-bottom: .08rem;}
  .con-center .right li{height:4.58rem;background-image: url(../../assets/images/page1_30.png);margin-bottom: 0;}
  .con-center li .title{width:2.71rem;height:.81rem;background: url(../../assets/images/page1_25.png) repeat-y top center;background-size:cover;position: absolute;left:.54rem;top:.06rem;}
  .con-center li .icon{width:.88rem;height:.74rem;position: absolute;right:.31rem;bottom:.39rem;}
  .con-center li .img{height:100%;background-size: cover;background-repeat: no-repeat;background-position: center;border-radius: .3rem;}
  .con-center li h3{font-size:.28rem;color:#fff;padding:.1rem .1rem .08rem;}
  .con-center li p{font-size:.24rem;color:#2681b7;}
  .con-center .more{padding:.2rem 0;text-align: center;font-size: .28rem;color:#fff;text-decoration: underline;}
  .con-bottom{padding:.6rem 0 .52rem;font-size: .28rem;color:#e7667d;}
  .con-bottom h3{text-align: center;}
  .con-bottom h4{padding: .32rem 0;}
  .con-bottom p{font-size: .28rem;line-height: 1.5;}
  .rule-con img{max-width: 100%;margin:.2rem 0;}
  .home .con-bottom >>> img{width:100%;}
</style>
