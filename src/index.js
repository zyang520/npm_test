import Vue from 'vue'
import App from './app.vue'
import  router from './router'
import store from './store/store'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI);

import'@/css/common.css'
import '@/css/fontawesome/font-awesome.min.css'

import http from '@/js/http'
Vue.use(http);

// 如果是本地localhost环境，则启动mock，模拟真实数据
/*if (/localhost/.test(location.href)) {*/
    require('@/mocks/mock')
/*}*/






new Vue({
    el: '#app',
    template : '<App/>',
    router,
    store,
    components: { App }
})
