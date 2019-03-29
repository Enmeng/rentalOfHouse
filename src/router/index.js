import Vue from 'vue'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import Router from 'vue-router'
import signInUp from '@/components/signInUp'
import userPage from '@/components/userPage'
import rentSeekingPerPageTemp from '@/components/rentSeekingPer/rentSeekingPerPageTemp'
import rentalKnowledge from '@/components/rentSeekingPer/rentalKnowledge'
import warning from '@/components/rentSeekingPer/warning'
import postDetail from '@/components/rentSeekingPer/postDetail'
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
    },
    {
      path: '/rentalKnowledge',
      name: 'rentalKnowledge',
      component: rentalKnowledge
    },
    {
      path: '/warning',
      name: 'warning',
      component: warning
    },
    {
      path: '/postDetail',
      name: 'postDetail',
      component: postDetail
    }
  ]
})
