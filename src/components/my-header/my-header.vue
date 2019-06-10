<template>
  <div class="my-header">
    <ul class="flex-aro">
      <!-- <li v-for="item in tabbarList" class="mine" @click="jump"><img :src="item.icon" alt=""><img :src="item.selectedIcon" alt=""></li> -->
      <li :class="index == 0 ? 'cur' : ''" @click="jump('/', 0)"><img src="../../assets/images/page1_67.png" alt=""><img src="../../assets/images/page1_63.png" alt=""></li>
      <li :class="index == 1 ? 'cur' : ''" @click="jump('/signUp', 1)"><img src="../../assets/images/page1_65.png" alt=""><img src="../../assets/images/page1_61.png" alt=""></li>
      <li :class="index == 2 ? 'cur' : ''" @click="jump('/prize', 2)"><img src="../../assets/images/page1_66.png" alt=""><img src="../../assets/images/page1_62.png" alt=""></li>
      <li :class="index == 3 ? 'cur' : ''" @click="jump('/ranking', 3)"><img src="../../assets/images/page1_64.png" alt=""><img src="../../assets/images/page1_60.png" alt=""></li> 
      <!-- <router-link tag="li" class="mine" to="/"><img src="../../assets/images/page1_67.png" alt=""><img src="../../assets/images/page1_63.png" alt=""></router-link>
      <router-link tag="li" class="mine" to="/video"><img src="../../assets/images/page1_65.png" alt=""><img src="../../assets/images/page1_61.png" alt=""></router-link>
      <router-link tag="li" class="mine" to="/prize"><img src="../../assets/images/page1_66.png" alt=""><img src="../../assets/images/page1_62.png" alt=""></router-link>
      <router-link tag="li" class="mine" to="/my"><img src="../../assets/images/page1_64.png" alt=""><img src="../../assets/images/page1_60.png" alt=""></router-link>    -->
    </ul>    
  </div>      
</template>

<script>
export default {
  props: {
    index: Number
  },
  data() {
    return {
      tabbarList: [
        { path: '/', icon: '../../assets/images/page1_67.png', selectedIcon: '../../assets/images/page1_63.png' },
        { path: '/signUp', icon: '../../assets/images/page1_65.png', selectedIcon: '../../assets/images/page1_61.png' },
        { path: '/prize', icon: '../../assets/images/page1_66.png', selectedIcon: '../../assets/images/page1_62.png' },
        { path: '/ranking', icon: '../../assets/images/page1_64.png', selectedIcon: '../../assets/images/page1_60.png' },
      ],
      curSelectedIndex: 0
    }
  },
  methods: {
    jump(e, index) {
      this.curSelectedIndex = index
      // this.$router.replace(e)
      this.$router.replace(e)
    }
  }
} 
</script>

<style scoped>
  .my-header{position: fixed;width: 100%;left: 0;bottom: 0;background: #fff;border-radius: 5px 5px 0 0;font-size: .26rem;height:.98rem;display:flex;z-index: 9999;box-shadow: 0 0 20px -2px #FFB8C4;}
  .my-header img{width:.53rem;}
  .my-header ul{width:100%;}
  .my-header li:nth-child(2) img{width:.52rem;}
  .my-header li:nth-child(4) img{width:.54rem;}
  li.cur img:first-child,.my-header img:last-child{display:none;}
  li.cur img:last-child{display: block;}   
</style>
