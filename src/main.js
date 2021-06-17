import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/font_29zz55l67l/iconfont.css'
import axios from "axios";

Vue.config.productionTip = false

axios.defaults.baseURL = 'http://www.ysqorz.top:8888/api/private/v1/'
Vue.prototype.$http = axios


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
