// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// import 'common/js/wxConfig.js'
import 'common/js/default.js'
import 'common/css/reset.css'
import 'swiper/dist/css/swiper.css'
import 'animate.css'
import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'
import 'common/js/remAdaptation.js'
import md5 from 'js-md5'

Vue.config.productionTip = false

Vue.use(Mint)
Vue.prototype.$md5 = md5
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
