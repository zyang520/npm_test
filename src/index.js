import Vue from 'vue'
import App from './app.vue'
import  router from './router'




import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI);



import'@/css/common.css'
import '@/css/fontawesome/font-awesome.min.css'






new Vue({
  el: '#app',
  template : '<App/>',
   router,
  components: { App }
})
