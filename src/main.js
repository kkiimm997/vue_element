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
import {request} from './network/request'
import TreeTable from 'vue-table-with-tree-grid'
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
//通过require style 导入富文本编辑器的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.prototype.$axios = axios;
Vue.prototype.$http = request()
// axios.defaults.baseURL = 'http://www.ysqorz.top:8888/api/private/v1/'
// axios.interceptors.request.use(config => {

//   config.headers.Authorization = window.sessionStorage.getItem('token')
//   return config 
// })
Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)
//时间过滤器
Vue.filter('dateFormat', function(originVal){
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2,'0')
  const d = (dt.getDay() + '').padStart(2,'0')
  const hh = (dt.getHours() + '').padStart(2,'0')
  const mm = (dt.getMinutes() + '').padStart(2,'0')
  const ss =  (dt.getSeconds() + '').padStart(2,'0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

//将富文本编辑器注册为全局可用组件
Vue.use(VueQuillEditor)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
