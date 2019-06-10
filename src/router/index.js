import Vue from 'vue'
import Router from 'vue-router'
// import home from '@/components/home/home'
import details from '@/components/home/details'
import gift from '@/components/home/gift'
import prize from '@/components/prize/prize'
import signUp from '@/components/signUp/signUp'
import ranking from '@/components/ranking/ranking'

Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: resolve => require(['@/components/home/home'], resolve)
    },
    {
      path: '/details',
      name: 'details',
      component: resolve => require(['@/components/home/details'], resolve)
    },
    {
      path: '/gift',
      name: 'gift',
      component: resolve => require(['@/components/home/gift'], resolve)
    },
    {
      path: '/prize',
      name: 'prize',
      component: resolve => require(['@/components/prize/prize'], resolve)
    },
    {
      path: '/signUp',
      name: 'signUp',
      component: resolve => require(['@/components/signUp/signUp'], resolve)
    },
    {
      path: '/ranking',
      name: 'ranking',
      component: resolve => require(['@/components/ranking/ranking'], resolve)
    }
  ]
})
