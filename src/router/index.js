import Vue from 'vue'
import Router from 'vue-router'
import Box from '@/view/Box'


Vue.use(Router)

const routes = [
    {
        path: '/Login',
        component: resolve => require(['@/view/login/Login'], resolve)
    },
    {
        path: '/',
        component: Box,
        meta: {
            requireAuth: true
        },
        children: [
            {
                path: '/myApp',
                name: 'myApp',
                meta: {
                    requireAuth: true
                },
                component: resolve => require(['@/view/vTwo.vue'], resolve)
            },
            {
                path: '/chainCodeList',
                name: 'chainCodeList',
                meta: {
                    requireAuth: true
                },
                component: resolve => require(['@/view/ChainCodeList.vue'], resolve)
            },
            {
                path: 'appDetInfo',
                name: 'appDetInfo',
                meta: {
                    requireAuth: true
                },
                component: resolve => require(['@/view/AppDetInfo.vue'], resolve)
            },
            {
                path: 'channelChainCodeList',
                name: 'channelChainCodeList',
                meta: {
                    requireAuth: true
                },
                component: resolve => require(['@/view/ChannelChainCodeList.vue'], resolve)
            },
            {
                path: '/',
                redirect: '/myApp'
            }
        ]
    }
];

const router = new Router({routes})
export default router;


// 页面刷新时，重新赋值token
router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
        if (localStorage.getItem('accessToken')) { // 通过vuex state获取当前的token是否存在
            next();
        }
        else {
            next({
                path: '/login'
            })
        }
    }
    else {
        next();
    }
})


