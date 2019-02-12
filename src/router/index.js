import Vue from 'vue'
import Router from 'vue-router'
import Box from '@/view/Box'



Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Box,
        children:[
            {
                path: '/myApp',
                name: 'myApp',
                component: resolve => require(['@/view/vTwo.vue'], resolve)
            },
            {
                 path: '/chainCodeList',
                 name: 'chainCodeList',
                   component: resolve => require(['@/view/ChainCodeList.vue'], resolve)
            },{
                path: 'channelList',
                name: 'channelList',
                component: resolve => require(['@/view/ChannelList.vue'], resolve)
            },
            {
                path: '/',
                component: resolve => require(['@/view/vTwo.vue'], resolve)
            }
    ]
    }
  ]
})
