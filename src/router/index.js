import Vue from 'vue'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import Router from 'vue-router'
import signInUp from '@/components/signInUp'
import userPage from '@/components/userPage'
import rentSeekingPerPageTemp from '@/components/rentSeekingPer/rentSeekingPerPageTemp'
Vue.use(Router)
Vue.use(iView);
export default new Router({
  routes: [
    {
      path: '/',
      name: 'signInUp',
      component: signInUp
    },
    {
      path: '/userPage',
      name: 'userPage',
      component: userPage
    },
    {
      path: '/rentSeekingPerPageTemp',
      name: 'rentSeekingPerPageTemp',
      component: rentSeekingPerPageTemp
    }
  ]
})
