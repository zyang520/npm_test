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
                path: '/',
                redirect: '/app'
            },
            {
                path: '/app',
                name: 'app',
                meta: {
                    requireAuth: true
                },
                component: resolve => require(['@/view/AppList.vue'], resolve)
            },
            {
                path: '/chainCodeCenter',
                name: 'chainCodeCenter',
                meta: {
                    requireAuth: true
                },
                component: resolve => require(['@/view/ChainCodeCenter.vue'], resolve)
            },
            {
                path: 'appDetail',
                name: 'appDetail',
                meta: {
                    requireAuth: true
                },
                component: resolve => require(['@/view/AppDetail.vue'], resolve)
            },
            {
                path: 'appChainCodeList',
                name: 'appChainCodeList',
                meta: {
                    requireAuth: true
                },
                component: resolve => require(['@/view/AppChainCodeList.vue'], resolve)
            }
        ]
    }
];

const router = new Router({routes});
export default router;


// 页面刷新时，重新赋值token
router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
        if (localStorage.getItem('userName')) { // 通过vuex state获取当前的token是否存在
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
});


