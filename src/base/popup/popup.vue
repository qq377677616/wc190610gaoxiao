<template>
  <div class="popup flex-cen">
    <div class="box fadeShow">
      <slot></slot>
      <div class="close" @click="close"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SIdentify',
  data() {
    return {

    }
  },
  props: {

  },
  mounted () {

  },
  methods: {
    close() {
      this.$emit("closePopup")
    }
  },
  watch: {

  }
}
</script>

<style scoped>
  .popup{position: fixed;width:100%;height:100%;left:0;top:0;background: rgba(0,0,0,.7);z-index:500;}
  .popup .box{padding:.1rem .2rem;border-radius:.2rem;background: #fff;margin-top:-50%;position: relative;}
  .popup .box .close{width:.44rem;height:1.08rem;background: url(../../assets/images/close.png) no-repeat center;position: absolute;top:100%;left:calc(50% - .22rem);background-size:100% 100%;}
  .popup .box img{width:4rem;height:4rem;}
  .popup .box h4{padding:.1rem 0 .3rem;text-align: center;}
</style>


