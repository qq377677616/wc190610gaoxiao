<template>
  <div class="prize">
    <!-- <div class="title"><img src="../../assets/images/page5_4.png" alt=""></div> -->
    <div class="con">
      <div v-html="eventPrizes"></div>
      <!-- <img src="../../assets/images/page5_4s.png" alt=""> -->
      <!-- <h3>一切以实物为准，最终解释权归“不一定传媒”所有</h3> -->
      <advertisement></advertisement>   
    </div>
  </div>      
</template>

<script>
import Advertisement from 'components/advertisement/advertisement'
import { geEventPrizes } from 'api/request'
export default {
  data() {
    return {
      eventPrizes: '' 
    }
  },
  created() {
    this.geEventPrizes()
    document.title = "活动奖品"
  },
  methods: {
    geEventPrizes() {
      geEventPrizes().then(res => {
        if (res.error == 200) {
          console.log(res)
          this.eventPrizes = res.data.ac_prize
        }
      })
    }
  },
  components: {
    Advertisement: Advertisement
  }
} 
</script>

<style scoped>
  .prize{text-align: center;background: url(../../assets/images/page1_jpg.jpg) repeat-y top center;background-size:cover;min-height: 100%;}
  /* .prize .title img{width:6.68rem;padding-top: .29rem;}
  .prize .con{padding-bottom: .98rem;}  
  .prize .con img{width:6.59rem;} 
  .prize .con h3{font-size:.2rem;color:#868282;padding: .42rem 0;text-align: center;text-decoration: underline;}  */
  .prize >>> img{width:100%;} 
</style>
