<template>
  <div class="signUp container">
    <div class="time">
      <h3>活动结束倒计时</h3>
      <ul class="flex-cen">
        <li>{{curTimes.day}}天</li><li>{{curTimes.hours}}时</li><li>{{curTimes.min}}分</li><li>{{curTimes.seconds}}秒</li>
      </ul>    
    </div>
    <div class="ranking">
      <div class="tab flex-cen">
        <div :class="['left', 'flex-cen', currentType == 1 ? 'on' : '']" @click="selectType(1)"><img src="../../assets/images/page6_btn2.png" alt=""><img src="../../assets/images/page6_btn5.png" alt=""></div>
        <div :class="['right', 'flex-cen', currentType == 2 ? 'on' : '']" @click="selectType(2)"><img src="../../assets/images/page6_btn3.png" alt=""><img src="../../assets/images/page6_btn4.png" alt=""></div>
      </div>
      <ul class="list">
        <li class="flex-cen" v-for="(item, index) in rankingList" :key="index" @click="jump_details(item.signup_id)">
          <div class="img"><img :src="item.headimgurl" alt=""></div>
          <div class="text">
            <h3>{{item.username}}</h3>
            <h4><span>票数{{item.vote_total}}</span><span>礼物{{item.gift_point}}</span></h4>
            <p class="nowrap">{{item.declaration || '高校之星，你最美！'}}</p>
          </div>
          <div class="order flex-cen">{{index + 1}}</div>
        </li>
        <li class="no" v-if="rankingList.length == 0">暂无相关数据</li>
      </ul> 
    </div>
    <advertisement></advertisement>
  </div>
</template>

<script type="text/ecmascript-6">
  import Advertisement from 'components/advertisement/advertisement'
  import { getRanking } from 'api/request'
  export default {
    created() { 
      this.getRanking()
      document.title = "排名"
    },
    data() {
      return {
        curTimes: {day: '--',hours: '--',min: '--',seconds: '--'},
        currentType: 1,
        rankingList: []
      }  
    },
    computed: {

    },
    methods: {
      getRanking() {
        getRanking({ type: this.currentType}).then(res => {
          console.log(res)
          if (res.error == 200) {
            this.rankingList = []
            this.rankingList = this.rankingList.concat(res.data.voteRankList)
            if (this.curTimes.day != '--') return
            this.calcTime(res.data.count_down, res => {
              if (res.status == 1) {
                this.curTimes = res
              } else {
                console.log("【活动结束】")
              }
            })
          }
        })
      },
      //选择票数榜和礼物榜
      selectType(index) {
        this.currentType = index
        this.getRanking()
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
      jump_details(id) {
        console.log(id)
        this.$router.push({path: 'details', query: {id: id}})
      }
    },
    components: {
      Advertisement: Advertisement
    }
  } 
</script>

<style scoped>
  .container{padding-bottom:.98rem;}
  .signUp{background: url(../../assets/images/page1_jpg.jpg) repeat-y top center;background-size:cover;padding-top: 0.11rem;min-height:100vh;}
  .time,.con .enroll{text-align: center;}
  .time h3{font-size: .28rem;color:#fff;padding:.24rem 0 .26rem;}
  .time ul li{width:1.19rem;height:.63rem;line-height: .63rem;margin: 0 .09rem;background: url(../../assets/images/page1_7.png) no-repeat center;background-size:cover;font-size: .28rem;color:#fff;text-align: center;}
  .tab{padding:.6rem 0 .25rem;}
  .tab>div{height:.64rem;flex:1;width:1.36rem;}
  .tab .left{border-right:.02rem solid #fff;}
  .tab .right{border-left:.02rem solid #fff;}
  .tab img{width:1.36rem;}
  .tab img:last-child,.tab .on img:first-child{display: none;}
  .tab .on img:last-child{display: block;}
  .ranking ul{width:94%;margin:0 auto;}
  .ranking li{background: #fff;border-radius: .08rem;margin-bottom: .2rem;padding:.3rem 0;}
  .ranking li.no{padding:2rem 0;text-align: center;}
  .ranking li .img{margin:0 .32rem 0 .27rem;flex:1;background: #FFD5DF;border-radius: 50%;}
  .ranking li .img img{width:.74rem;height:.74rem;border-radius:50%;}
  .ranking li .text{font-size: .28rem;flex:7;width:0;}
  .ranking li h3,.ranking li p,.ranking li .order{color:#7f8389;}
  .ranking li h4{color:#e7667d;padding:.15rem 0;}
  .ranking li h4 span{padding-right: .24rem;}
  .ranking li .order{font-size: .2rem;flex:2;position: relative;}
  .ranking li p{font-size: .28rem;}
  .ranking li:first-child .order::after,.ranking li:nth-child(2) .order::after,.ranking li:nth-child(3) .order::after{content:"";display: block;width: .36rem;height: .4rem;background: url(../../assets/images/page6_29.png) no-repeat;background-size: cover;position: absolute;left:50%;top:50%;transform: translate(-50%, -50%);}
  .ranking li:nth-child(2) .order::after{background-image:url(../../assets/images/page6_22.png);}
  .ranking li:nth-child(3) .order::after{background-image:url(../../assets/images/page6_15.png);}
</style>
