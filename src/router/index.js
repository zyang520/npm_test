import Vue from 'vue'
import Router from 'vue-router'
import Box from '@/view/Box'

const Login = r => require.ensure([], () => r(require('@/view/login/Login')), `login`);
const AppList = r => require.ensure([], () => r(require('@/view/AppList.vue')), `AppList`);
const AppDetail = r => require.ensure([], () => r(require('@/view/AppDetail.vue')), `AppDetail`);
const AppChainCodeList = r => require.ensure([], () => r(require('@/view/AppChainCodeList.vue')), `AppChainCodeList`);
const ChainCodeCenter = r => require.ensure([], () => r(require('@/view/ChainCodeCenter.vue')), `ChainCodeCenter`);
const TransactionLog = r => require.ensure([], () => r(require('@/view/TransactionLog.vue')), `TransactionLog`);


Vue.use(Router)

const routes = [
    {
        path: '/Login',
        component: Login
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
                component: AppList
            },
            {
                path: '/chainCodeCenter',
                name: 'chainCodeCenter',
                meta: {
                    requireAuth: true
                },
                component: ChainCodeCenter
            },
            {
                path: 'appDetail',
                name: 'appDetail',
                meta: {
                    requireAuth: true
                },
                component: AppDetail
            },
            {
                path: 'appChainCodeList',
                name: 'appChainCodeList',
                meta: {
                    requireAuth: true
                },
                component: AppChainCodeList
            },
            {
                path: 'transactionLog',
                name: 'transactionLog',
                meta: {
                    requireAuth: true
                },
                component: TransactionLog
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


