<template>
  <transition-group tag="ul" :name="scrollType" class="text-scroll">
    <li v-for="(item, index) in textList" :key="`random${index}`" v-show="index==count">{{item}}</li>
  </transition-group>  
</template>

<script type="text/ecmascript-6">
// import { mapState } from 'vuex'
  export default {
    props: {
      textList: Array,
      scrollType: String    
    }, 
    created() { 
      this.start()
      // this.intervalId = setInterval(()=>{ // 定义定时器
      //   this.getText();
      // }, this.playTime)  
    },
    data() {
      return {
        count: 0, // 当前索引  当v-for中的index等于count时 v-show=true 即显示当前元素
        intervalId: null, // 定时器ID
        playTime: 2500 // 定时器执行    
      }  
    },
    computed: {
      // ...mapState({
      //   langs: "langs"
      // })
    },
    methods: {
        start() {
          this.intervalId = setInterval(()=>{ // 定义定时器
            this.getText()
          }, this.playTime) 
        },
        getText() {
          let len = this.textList.length; // 获取数组长度
          if (len == 0) {
            return // 当数组为空时，直接返回
          }
          if (this.count == len - 1) { // 当前为最后一个时
            this.count = 0 // 从第一个开始
          } else {
            this.count++ // 自增
          }
        }
    },
    destroyed() {
      clearInterval(this.intervalId) // 清除定时器
    }
  } 
</script>

<style scoped>
  /* .text-scroll{ height: .26rem;font-size: .11rem; overflow: hidden;position: relative; }  
  .text-scroll li{ max-width: 85%;height: .26rem;line-height: .26rem;position: absolute;font-size: .12rem;color: #fff;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;} */
  .news ul{height:.52rem;overflow: hidden;position: relative;width:100%;background:rgba(255,255,255,.5) url(../../assets/images/page1_73.png) no-repeat .52rem center;background-size: .31rem;}
  .news ul li{height:.52rem;line-height: .52rem;font-size: .24rem;color:#eb7489;position: absolute;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;;width:100%;box-sizing: border-box;left:0;padding:0 0.52rem 0 1.02rem;}
  .text-scroll li span{color: #B2C8F7;padding:0 .04rem;}   
  /* 向上滚动动画 */  
  .scroll-up-enter-active,.scroll-up-leave-active{transition: all .5s ease;}  
  .scroll-up-enter{transform: translate3d(0,100%,0);}
  .scroll-up-leave-to{transform: translate3d(0,-100%,0);}
  /* 向上匀速滚动动画 */
  .scroll-up-linear-enter-active,.scroll-up-linear-leave-active{transition: all 1s linear;}  /*此时间必须和 playTime 保持一致*/
  .scroll-up-linear-enter{transform: translate3d(0,100%,0);}
  .scroll-up-linear-leave-to{transform: translate3d(0,-100%,0);}
  /* 向左滚动动画 */
  .scroll-left-enter-active,.scroll-left-leave-active{transition: all 1s ease;}
  .scroll-left-enter{transform: translate3d(100%,0,0);}
  .scroll-left-leave-to{transform: translate3d(-100%,0,0);}
  /* 向左匀速滚动动画 */
  .scroll-left-linear-enter-active,.scroll-left-linear-leave-active{transition: all 4s linear;}   /*此时间必须和 playTime 保持一致*/
  .scroll-left-linear-enter{transform: translate3d(100%,0,0);}
  .scroll-left-linear-leave-to{transform: translate3d(-100%,0,0);}
</style>
