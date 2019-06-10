<template>
  <div class="signUp container">
    <div class="signUp-box">
      <ul class="wrap">
        <li class="flex-cen">
          <p>选手姓名</p>
          <input type="text" placeholder="请输入姓名或昵称" v-model="input_name" @blur="blur">
        </li>
        <li class="flex">
          <p>参赛宣言</p>
          <textarea placeholder="一句话描述自己的参赛宣言" v-model="input_declaration" @blur="blur" maxlength="25"></textarea>
        </li>
        <li class="flex-cen">
          <p>手机</p>
          <input type="number" placeholder="请输入手机" v-model="input_phone" @blur="blur">
        </li>
        <li class="flex-cen">
          <p>收货地址</p>
          <input type="text" placeholder="请输入收货地址" v-model="input_address" @blur="blur">
        </li>
        <li class="upload-img">
          <h3>请上传1-5张照片，第一张为封面图</h3>
          <dl>
            <dd class="backset" v-for="(item, index) in myImgList" :key="index" :style="{backgroundImage: 'url(' + item + ')'}"></dd> 
            <dd class="add-btn" v-show="selectImg.length < 5" @click="chooseImage"></dd>
          </dl>
        </li>
      </ul>
      <div class="submit">
        <h3>请如实填写报名信息，获取参赛资格！</h3>
        <div class="btn" @click="uploadWorks"></div>
      </div>
      <advertisement></advertisement>
      <popup v-if="isShowPopup" @closePopup="showPopup"><img src="../../assets/images/code.jpg" alt=""><h4>长按二维码关注公众号</h4></popup>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import wx from 'weixin-js-sdk'
  import {Indicator} from 'mint-ui'
  import Popup from 'base/popup/popup'
  import { base64Switch, backPageTop, isSystem } from 'common/js/util'
  import { reg_mobile } from 'common/js/regexp'
  import Advertisement from 'components/advertisement/advertisement'
  import { uploadWorks } from 'api/request'
  export default {
    created() { 
      document.title = "报名参加"
      console.log(isSystem())
    },
    data() {
      return {
        input_name: '',
        input_declaration: '',
        input_phone: '',
        input_address: '',
        maxSelectImg: 5,
        selectImg: [],
        localIdsList: [],
        localIdsCurindex: 0,
        isShowPopup: false
      }  
    },
    computed: {
      myImgList() {
        if (isSystem().isiOS) {
          return this.selectImg
        } else {
          return this.localIdsList
        }
      }
    },
    methods: {
      uploadWorks() {
        if (!this.judge()) return
        Indicator.open({text: '作品上传中',spinnerType: 'fading-circle'})
        let _data = {
          username: this.input_name,
          declaration: this.input_declaration,
          mobile: this.input_phone,
          addr: this.input_address
        }
        _data.img = this.selectImg
        console.log("【上传给后台的数据】")
        console.log(_data)
        uploadWorks(_data).then(res => {
          console.log("【提交后的返回】")
          console.log(res)
          Indicator.close()
          if (res.error == 200) {
            setTimeout(() => {
              this.$toast("作品上传成功")
              setTimeout(() => {
                this.$router.replace('/')
              }, 1500)
            }, 1500)
          } else if (res.error == 401) {
            Indicator.close()
            this.$toast("您已上传过作品")  
          } else if (res.error == 403) {
            this.$toast("请先关注公众号") 
            this.showPopup()
          } else{
            this.$toast(res.info)
          }
        })
      },
      judge() {
        if (!this.input_name) {
          this.$toast("请填写姓名或昵称")
          return false
        } else if (!this.input_declaration) {
          this.$toast("请填写自己的参赛宣言")
          return false
        } else if (!this.input_phone) {
          this.$toast("请填写手机号")
          return false
        } else if (!reg_mobile.test(this.input_phone)) {
          this.$toast("请填写符合规范的手机号")
          return false
        } else if (!this.input_address) {
          this.$toast("请填写您的收货地址")
          return false
        } else if (this.selectImg.length == 0) {
          this.$toast("请上传最少1张您自己美美哒的照片~")
          return false
        }
        return true
      },
      chooseImage() {
        var _self = this
        wx.chooseImage({
          count: _self.maxSelectImg - _self.localIdsList.length, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            _self.localIdsList = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            console.log(`【刚才选择了${_self.localIdsList.length}张照片】`)
            console.log(_self.localIdsList)
            _self.getLocalImgData()
          }
        })
      },
      getLocalImgData() {
        let _self = this
        wx.getLocalImgData({
          localId: _self.localIdsList[_self.localIdsCurindex], // 图片的localID
          success: function (res) {
            _self.localIdsCurindex++
            if (_self.localIdsCurindex <= _self.localIdsList.length) {
              if (res.errMsg == "getLocalImgData:ok") {
                console.log("【刚选择的图片】")
                console.log(base64Switch(res.localData).slice(0, 30))
                _self.selectImg.push(base64Switch(res.localData))
                _self.getLocalImgData()
                if (_self.localIdsCurindex == _self.localIdsList.length) {
                  console.log("【多张图片上传OK】")
                  console.log('共' + _self.selectImg.length + '张')
                  console.log(_self.selectImg)
                  _self.localIdsCurindex = 0
                }
              } else {
                
              }
            }  
          }
        })
      },
      showPopup() {
        this.isShowPopup = !this.isShowPopup
      },
      blur() {
        backPageTop()
      }
    },
    components: {
      Advertisement: Advertisement,
      Popup: Popup
    }
  } 
</script>

<style scoped>
  /* .container{padding-bottom: .98rem;} */
  .signUp{background:#FFD5DF url(../../assets/images/page1_jpg.jpg) repeat-y top center;background-size:cover;min-height:100vh;}
  .signUp .signUp-box{background: #fff;min-height:calc(100vh - 1.14rem);padding-bottom: .98rem;}
  .signUp ul{margin-top: .16rem;}
  .signUp ul li{font-size: .28rem;}
  .signUp ul li p{font-size: .28rem;color:#e7667d;padding:0 .2rem 0 .38rem;width:1.12rem;}
  .signUp ul li input,.signUp ul li textarea{flex:1;}
  .signUp ul li input::-webkit-input-placeholder,.signUp ul li textarea::-webkit-input-placeholder{color:#afafaf;}
  .signUp ul li textarea{height:1.7rem;line-height: 1.3;padding-top: .29rem;}
  .signUp ul li p, .signUp ul li input{height:.86rem;line-height: .86rem;}
  .signUp ul li:not(:last-child){border-bottom:1px dashed #dcdcdc;}
  .signUp ul li h3{font-size: .28rem;color:#afafaf;padding:.24rem 0 .36rem;}
  .signUp ul li.upload-img{padding-left: 0.38rem;}
  .signUp ul li dl{height:3.28rem;}
  .signUp ul li dd{width:1.44rem;height:1.44rem;position: relative;display: inline-block;margin:.1rem;}
  .signUp ul li dd.add-btn::after{content:"";display: block;width:1.58rem;height:1.55rem;background: url(../../assets/images/page3_btn1.png) repeat-y top center;background-size:cover;position: relative;left:-.06rem;top:-.05rem;}
  .signUp .submit{margin: .5rem 0;}
  .signUp .submit h3{text-align: center;font-size: .28rem;color:#afafaf;}
  .signUp .submit .btn{width:5.34rem;height:.8rem;background: url(../../assets/images/page3_btn2.png) repeat-y top center;background-size:cover;margin:.34rem auto 0;}
</style>
