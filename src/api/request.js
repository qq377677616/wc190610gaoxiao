import axios from 'axios'
import Qs from 'qs'
let REQUESTURL = '/api' //跨域请求代理
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
//axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
if (process.env.NODE_ENV == 'development'){
  //本地开发模式
  console.log("【本地开发模式】")
  axios.interceptors.request.use(
    config => { 
      //config.headers['content-type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
      return config
    },
    error => {
      return Promise.reject(error)
    })
} else {
  //线上发布模式
  console.log("【线上发布模式】")
  REQUESTURL = 'http://game.flyh5.cn/game/wx5b08e0adcb96058c/mar_college'
  // REQUESTURL = 'http://game.flyh5.cn/game/wx5b08e0adcb96058c/bac_college'
}

//首页用户个人信息
export function geHomeData() {
  let url = `${REQUESTURL}/api.php?a=homeinfo`
  return axios.post(url).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })      
}
//首页报名列表
export function gePeopleList(data) {
  let url = `${REQUESTURL}/api.php?a=signuplist`
  return axios.post(url, Qs.stringify(data)).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })      
}
//活动奖品
export function geEventPrizes() {
  let url = `${REQUESTURL}/api.php?a=ac_prize`
  return axios.post(url).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })      
}
//排行榜数据
export function getRanking(data) {
  let url = `${REQUESTURL}/api.php?a=vote_rank`
  return axios.post(url, Qs.stringify(data)).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })      
}
//报名详情
export function getDetails(data) {
  let url = `${REQUESTURL}/api.php?a=signupdetail`
  return axios.post(url, Qs.stringify(data)).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })      
}
//报名
export function uploadWorks(data) {
  let url = `${REQUESTURL}/api.php?a=signup`
  return axios.post(url, Qs.stringify(data)).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })      
}
//获取礼物列表
export function getGiftsList(data) {
  let url = `${REQUESTURL}/api.php?a=getgifts`
  return axios.post(url, Qs.stringify(data)).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })      
}
//加密获取token
export function getToken() {
  let url = `${REQUESTURL}/api.php?a=get_token`
  return axios.post(url).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })      
}
//投票
export function vote(data) {
  let url = `${REQUESTURL}/api.php?a=normal_vote`
  return axios.post(url, Qs.stringify(data)).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })      
}
//送礼物--支付
export function payment(data) {
  let url = `${REQUESTURL}/api.php?a=pay_gift`
  return axios.post(url, Qs.stringify(data)).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })      
}
//送礼物--支付后送出去
export function givingGifts(data) {
  let url = `${REQUESTURL}/api.php?a=give_gift`
  return axios.post(url, Qs.stringify(data)).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })      
}
//我的积分
export function getIntegral() {
  let url = `${REQUESTURL}/api.php?a=userinfo`
  return axios.post(url).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })      
}
//积分支付购买礼物
export function integralPay(data) {
  let url = `${REQUESTURL}/api.php?a=jifen_gift`
  return axios.post(url, Qs.stringify(data)).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })      
}
//分享配置、背景音乐
export function shareConfig() {
  let url = `${REQUESTURL}/api.php?a=ac_set`
  return axios.post(url).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })      
}
//广告位
export function advertisement() {
  let url = `${REQUESTURL}/api.php?a=advert`
  return axios.post(url).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })      
}
//是否能普通投票
export function isVote() {
  let url = `${REQUESTURL}/api.php?a=can_vote`
  return axios.post(url).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })      
}
//是否能购买礼物
export function isBuyingGifts() {
  let url = `${REQUESTURL}/api.php?a=can_gift`
  return axios.post(url).then((res) => {
    return Promise.resolve(res.data)
  }).catch((err) => {
    return Promise.reject(err)
  })      
}
// export async function isBuyingGifts() {
//   let url = `${REQUESTURL}/api.php?a=can_gift`
//   try {
//     const res = await axios.post(url);
//     return Promise.resolve(res.data);
//   }
//   catch (err) {
//     return Promise.reject(err);
//   }      
// }
