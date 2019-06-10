<template>
  <div class="advertisement" v-if="advertisementList.length >= 0">
    <div class="swiper-container wrap">
      <ul class="swiper-wrapper">
        <li class="swiper-slide backgroset" v-for="(item, index) in advertisementList" :key="`k${index}`" :style="{backgroundImage: 'url('+item.ad_img+')'}"><a :href="item.ad_url"></a></li>
      </ul>
      <div class="swiper-pagination"></div>
    </div>
  </div>
</template>

<script>
import Swiper from 'swiper'
import { advertisement } from 'api/request'
export default {
  name: 'advertisement',
  data() {
    return {
      advertisementList: [],
      swiper: null
    }
  },
  activated() {
    if (this.swiper) {
      //this.advertisement()
      // let _swiper = this.swiper
      // this.swiperInit()
      // _swiper.update()
    }
  },
  mounted() {
    this.advertisement()
  },
  methods: {
    advertisement() {
      this.advertisementLis = []
      advertisement().then(res => {
        if (res.error == 200) {
          this.advertisementList = res.data
          this.swiperInit()
        }
      })
    },
    swiperInit() {
      this.swiper = new Swiper('.swiper-container', {
        spaceBetween: 5,
        centeredSlides: true,
        observer:true,
        observeSlideChildren:true,
        observeParents:true,
        //loop: true,
        autoplay: {
          delay: 2500,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        }
      })
    }
  }
}
</script>

<style scoped>
  .advertisement{padding: .2rem 0;}
  .advertisement li{width:100%;height:1.5rem;background: url(../../assets/images/img_01.jpg);}
  .advertisement li a{display: block;height:100%;}
  /* .swiper-container{overflow: initial;} */
</style>
