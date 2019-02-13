import Vue from 'vue'
import App from './app.vue'
import  router from './router'




import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI);



import'@/css/common.css'
import '@/css/fontawesome/font-awesome.min.css'

import axios from "axios"
axios.defaults.baseURL = "http://localhost:8081";
window.axios = axios;


new Vue({
  el: '#app',
  template : '<App/>',
   router,
  components: { App }
})
