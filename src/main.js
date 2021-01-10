import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
//导入阿里icon图标
import './assets/iconfont/iconfont.css'
//全局样式表
import './assets/css/global.css'
//axios导入挂载
import axios from 'axios'
Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://www.ysqorz.top:8888/api/private/v1/'
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
