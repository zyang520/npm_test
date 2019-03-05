import Vue from 'vue'
import Es6Promise from 'es6-promise'
import axios from 'axios'
import qs from 'qs'

/**
 * 状态码   可以自行拓展
 */
export const codeMessage = {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。'
};


const errorComFunc = (code) => {
    console.log(codeMessage[code] || `${code}: 请求失败`)
};

/**
 * axios 版本
 */
export function request(params) {
    let headers = {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
    };
    var accessToken = sessionStorage.getItem('accessToken');
    if (accessToken != null) {
        headers.token = accessToken;
    }
    // axios post的data须转换为URLSearchParams后台才能接收到
    const host = 'http://localhost:8081';
    return new Promise((resolve, reject) => {
        axios({
            method: params.method ? params.method : 'get',
            url: host + params.url,
            data: (params.method !== 'post') ? {} : qs.stringify(params.data),
            params: (params.method === 'post') ? {} : params.data,
            headers: headers
        }).then(response => {
            if (response.status === 200) {
                resolve(response.data)
            } else {
                console.log(codeMessage[response.status] || `${code}: 请求失败`)
            }
        }).catch((error) => {
            if (reject) {
                reject(error)
            } else {
                console.log('common error func')
            }
        })
    })
}

export default {
    install: () => {
        Vue.prototype.$http = request
    }
}
