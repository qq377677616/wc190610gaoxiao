<template>
  <div class="identify flex-cen">
    <div class="box fadeShow">
      <div class="input"><input type="text" v-model="inputValue" placeholder="请输入验证码" :maxlength="codeLength"></div>
      <div class="img">
        <canvas id="s-canvas" :width="contentWidth" :height="contentHeight" @click="randomCode"></canvas>
      </div>
      <div class="btn" @click="verification">确定</div>
      <div class="close" @click="close"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SIdentify',
  data() {
    return {
      identifyCode: '8888',
      codeLength: 4,
      inputValue: ''
    }
  },
  props: {
    fontSizeMin: { // 字体最小值
      type: Number,
      default: 25
    },
    fontSizeMax: { // 字体最大值
      type: Number,
      default: 35
    },
    backgroundColorMin: { // 验证码图片背景色最小值
      type: Number,
      default: 200
    },
    backgroundColorMax: {  // 验证码图片背景色最大值
      type: Number,
      default: 220
    },
    dotColorMin: { // 背景干扰点最小值
      type: Number,
      default: 60
    },
    dotColorMax: { // 背景干扰点最大值
      type: Number,
      default: 120
    },
    contentWidth: { //容器宽度
      type: Number,
      default: 130
    },
    contentHeight: { //容器高度
      type: Number,
      default: 44
    }
  },
  mounted () {
    this.randomCode()
  },
  methods: {
    //验证
    verification() {
      if (this.inputValue == '') {
        this.$toast('验证码不能为空')
        return
      }
      if (this.inputValue.toLowerCase() == this.identifyCode.toLowerCase()) {
        this.$emit('verification')
      } else {
        this.$toast('验证码错误')
      }
      this.inputValue = ''
      this.randomCode()
    },
    //生成一个随机验证码
    randomCode() {
      let _identifyCode = ''
      for (let i = 0; i < this.codeLength; i++) {
        let _num = this.randomNum(0, 9) % 2
        if (_num == 0) {
          _identifyCode += this.randomNum(0, 9)
        } else {
          _identifyCode += this.getCharacter()
        }
      }
      this.identifyCode = _identifyCode
    },
    //随机生成一个大小写字母
    getCharacter(flag){ 
      let character = ""
      flag = flag || this.randomNum(0, 9) % 2
      if (flag == 0) { 
        character = String.fromCharCode(Math.floor( Math.random() * 26) + "a".charCodeAt(0)); 
      } 
      if (flag == 1) { 
        character = String.fromCharCode(Math.floor( Math.random() * 26) + "A".charCodeAt(0)); 
      } 
      return character
    }, 
    // 生成一个随机数
    randomNum (min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    // 生成一个随机的颜色
    randomColor (min, max) {
      let r = this.randomNum(min, max)
      let g = this.randomNum(min, max)
      let b = this.randomNum(min, max)
      return 'rgb(' + r + ',' + g + ',' + b + ')'
    },
    drawPic () {
      let canvas = document.getElementById('s-canvas')
      let ctx = canvas.getContext('2d')
      ctx.textBaseline = 'bottom'
      // 绘制背景
      ctx.fillStyle = this.randomColor(this.backgroundColorMin, this.backgroundColorMax)
      ctx.fillRect(0, 0, this.contentWidth, this.contentHeight)
      // 绘制文字
      for (let i = 0; i < this.identifyCode.length; i++) {
        this.drawText(ctx, this.identifyCode[i], i)
      }
      this.drawLine(ctx)
      this.drawDot(ctx)
    },
    drawText (ctx, txt, i) {
      ctx.fillStyle = this.randomColor(50, 160) //随机生成字体颜色
      ctx.font = this.randomNum(this.fontSizeMin, this.fontSizeMax) + 'px SimHei' //随机生成字体大小
      let x = (i + 1) * (this.contentWidth / (this.identifyCode.length + 1))
      let y = this.randomNum(this.fontSizeMax, this.contentHeight - 5)
      var deg = this.randomNum(-30, 30)
      // 修改坐标原点和旋转角度
      ctx.translate(x, y)
      ctx.rotate(deg * Math.PI / 180)
      ctx.fillText(txt, 0, 0)
      // 恢复坐标原点和旋转角度
      ctx.rotate(-deg * Math.PI / 180)
      ctx.translate(-x, -y)
    },
    drawLine (ctx) {
      // 绘制干扰线
      for (let i = 0; i < 4; i++) {
        ctx.strokeStyle = this.randomColor(100, 200)
        ctx.beginPath()
        ctx.moveTo(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight))
        ctx.lineTo(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight))
        ctx.stroke()
      }
    },
    drawDot (ctx) {
      // 绘制干扰点
      for (let i = 0; i < 30; i++) {
        ctx.fillStyle = this.randomColor(0, 255)
        ctx.beginPath()
        ctx.arc(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight), 1, 0, 2 * Math.PI)
        ctx.fill()
      }
    },
    close() {
      this.$emit("closeIdentify")
    }
  },
  watch: {
    identifyCode () {
      this.drawPic()
    }
  }
}
</script>

<style scoped>
  .identify{position: fixed;width:100%;height:100%;left:0;top:0;background: rgba(0,0,0,.7);z-index:500;}
  .identify .box{padding:.4rem;border-radius:.2rem;background: #fff;margin-top:-50%;position: relative;}
  .identify .box .input{padding:.1rem;background: #e9e9e9;border-radius: .05rem;}
  .identify .box .input input{width:4.6rem;height:.6rem;font-size: .28rem;padding:0 .1rem;}
  .identify .box .img{padding:.25rem 0;}
  .identify .box .img img{width:2.6rem;height:.88rem;}
  .identify .box .btn{width:5rem;height:.8rem;line-height: .8rem;text-align: center;font-size: .32rem;color:#fff;background: #FB8090;border-radius: .1rem;}
  .identify .box .close{width:.44rem;height:1.08rem;background: url(../../assets/images/close.png) no-repeat center;position: absolute;top:100%;left:calc(50% - .22rem);background-size:100% 100%;}
</style>


