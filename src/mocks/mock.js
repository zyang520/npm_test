
import Mock from 'mockjs'


//登录
Mock.mock('/user/login', function () {
    return {
        'success' : true,
        'data': {
            token: 'test1_mock',
            userName: 'zcy`'

        }
    }
});


//登录退出
Mock.mock('/user/loginOut', function () {
    return {
        'success' : true
    }
});

// 查询链码列表
Mock.mock('/vTwo/list', function () {
    return {
        'success' : true,
        'total' : 2,
        'data': [{
            appName: '通道_1',
            chain: 'v1`',
            org: '远光软件',
            status:'正常',
            createTime:'2018-02-14 16:50:32'
        },{
            appName: '通道_2',
            chain: 'v1`',
            org: '远光软件',
            status:'正常',
            createTime:'2018-02-14 16:50:32'
        },{
            appName: '通道_3',
            chain: 'v1`',
            org: '远光软件',
            status:'正常',
            createTime:'2018-02-14 16:50:32'
        },{
            appName: '通道_4',
            chain: 'v1`',
            org: '远光软件',
            status:'正常',
            createTime:'2018-02-14 16:50:32'
        },{
            appName: '通道_5',
            chain: 'v1`',
            org: '远光软件',
            status:'正常',
            createTime:'2018-02-14 16:50:32'
        },{
            appName: '通道_6',
            chain: 'v1`',
            org: '远光软件',
            status:'正常',
            createTime:'2018-02-14 16:50:32'
        },{
            appName: '通道_7',
            chain: 'v1`',
            org: '远光软件',
            status:'正常',
            createTime:'2018-02-14 16:50:32'
        }]
    }
});


//调用防范
/* this.$http.get('/robot/info').then(res=>{
      //write your code  here
        debugger;
}).catch(error=>console.log(error));  */
