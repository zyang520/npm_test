import Vue from 'vue'
import Vuex from 'vuex'
import App from './app.vue'
import router from './router'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI);
Vue.use(Vuex)

// 加载components
import plugins from './plugins/index';
Vue.use(plugins);

import '@/css/common.css'
import '@/css/base.css'
import '@/css/fontawesome/font-awesome.min.css'

import http from '@/js/http'

Vue.use(http);

// 如果是本地localhost环境，则启动mock，模拟真实数据
/*if (/localhost/.test(location.href)) {*/
// require('@/mocks/mock')
/*}*/

const store = new Vuex.Store({
    state: {
        count: 0,
        activeMenuIndex:"",
        userName:"",
    },
    mutations: {
        increment (state) {
            state.count++
        },
        //修改当前显示的菜单
        setActiveMenuIndex(state, index){
            state.activeMenuIndex = index;
        },
        setUserName(state, name){
            state.userName = name;
        }
    }
});

new Vue({
    el: '#app',
    template: '<App/>',
    router,
    store,
    components: {App}
});
