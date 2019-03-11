// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import eventBus from './eventBus'

Vue.config.productionTip = false;

// 定义全局变量,设置用户账号
var userName='';
if(window.localStorage){
            var storage=window.localStorage;
            if(storage.getItem("userName")!=undefined){
               userName=storage.getItem("userName");
            }
}
Vue.prototype.gUserName={
  userName:userName,
  setUserName(newName){
    this.userName=newName;
  }
}
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
