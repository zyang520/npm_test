
import Mock from 'mockjs'


//登录
Mock.mock('/demo/user/login', function () {
    return {
        'success' : true,
        'data': {
            token: 'test1_mock',
            userName: 'zcy`'

        }
    }
});


//登录退出
Mock.mock('/demo/user/loginOut', function () {
    return {
        'success' : true
    }
});

// 查询链码列表
Mock.mock('/app/list', function () {
    return {
        "code": 10000,
        "msg": "接口调用成功",
        "data": [
            {
                "id": "app1",
                "appName": "test1",
                "apiKey": "f7f29c2bea2845ad98e31c4fd748091a",
                "secretKey": "cd8c3972a8b84beb919bbc9a527b31e4",
                "userId": "1",
                "createTime": "2019-02-27 11:36:42",
                "lastUpdateTime": "2019-02-27",
                "chainName": "test_channel2_org1_e036fa767a2d4fd6bae43eb38657d546",
                "chainVersion": "hlfv1",
                "clientOrg": "org1",
                "networkConfigJson": "{\"name\":\"test_channel2_org1_e036fa767a2d4fd6bae43eb38657d546\",\"x-type\":\"hlfv1\",\"x-commitTimeout\":300000,\"version\":\"1.0.0\",\"client\":{\"organization\":\"org1\",\"connection\":{\"timeout\":{\"peer\":{\"endorser\":\"300000\",\"eventHub\":\"300000\",\"eventReg\":\"300000\"},\"orderer\":\"300000\"}}},\"channels\":{\"channel2\":{\"orderers\":[\"orderer0.orderer.test.com\"],\"peers\":{\"peer1.org1.test.com\":{}}}},\"organizations\":{\"org1\":{\"mspid\":\"org1msp\",\"peers\":[\"peer1.org1.test.com\"],\"certificateAuthorities\":[\"ca.org1.test.com\"],\"adminPrivateKey\":{\"pem\":\"-----BEGIN PRIVATE KEY-----\\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgkoWUXE4SDsJw2rIVjBQh/+NtptK7NivN/i6BaOFwwDahRANCAAQEDy581kFKD7y9L42dVp2KEdt8wCdg/HC0MY4Uzahtlen2SqX6nAM3HWrEoMK8DrjW3jVKgHQMCT+1AYSyRZ9v\\n-----END PRIVATE KEY-----\"},\"signedCert\":{\"pem\":\"-----BEGIN CERTIFICATE-----\\nMIICEDCCAbagAwIBAgIQfZWOmWFJP5fzq58sH+keyzAKBggqhkjOPQQDAjBtMQswCQYDVQQGEwJVUzETMBEGA1UECBMKQ2FsaWZvcm5pYTEWMBQGA1UEBxMNU2FuIEZyYW5jaXNjbzEWMBQGA1UEChMNb3JnMS50ZXN0LmNvbTEZMBcGA1UEAxMQY2Eub3JnMS50ZXN0LmNvbTAeFw0xODEyMjAwMTUwMTlaFw0yODEyMTcwMTUwMTlaMFgxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpDYWxpZm9ybmlhMRYwFAYDVQQHEw1TYW4gRnJhbmNpc2NvMRwwGgYDVQQDDBNBZG1pbkBvcmcxLnRlc3QuY29tMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEBA8ufNZBSg+8vS+NnVadihHbfMAnYPxwtDGOFM2obZXp9kql+pwDNx1qxKDCvA641t41SoB0DAk/tQGEskWfb6NNMEswDgYDVR0PAQH/BAQDAgeAMAwGA1UdEwEB/wQCMAAwKwYDVR0jBCQwIoAgWLpgWAoQFowXJO9f5YDREOmmttIamxa4yVH1emEBxoIwCgYIKoZIzj0EAwIDSAAwRQIhANBiSJy7vDNJ5dPYLkFxlt94EsJqkZB4yrwezJJFNlvxAiBCPy3ME34qiyZlhl2BwQlCm1U/OHOQegh+y9LPF6Q68A==\\n-----END CERTIFICATE-----\"}},\"org2\":{\"mspid\":\"org2msp\",\"peers\":[\"peer1.org2.test.com\"],\"certificateAuthorities\":[\"ca.org2.test.com\"],\"adminPrivateKey\":{\"pem\":\"-----BEGIN PRIVATE KEY-----\\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgkoWUXE4SDsJw2rIVjBQh/+NtptK7NivN/i6BaOFwwDahRANCAAQEDy581kFKD7y9L42dVp2KEdt8wCdg/HC0MY4Uzahtlen2SqX6nAM3HWrEoMK8DrjW3jVKgHQMCT+1AYSyRZ9v\\n-----END PRIVATE KEY-----\"},\"signedCert\":{\"pem\":\"-----BEGIN CERTIFICATE-----\\nMIICEDCCAbagAwIBAgIQfZWOmWFJP5fzq58sH+keyzAKBggqhkjOPQQDAjBtMQswCQYDVQQGEwJVUzETMBEGA1UECBMKQ2FsaWZvcm5pYTEWMBQGA1UEBxMNU2FuIEZyYW5jaXNjbzEWMBQGA1UEChMNb3JnMS50ZXN0LmNvbTEZMBcGA1UEAxMQY2Eub3JnMS50ZXN0LmNvbTAeFw0xODEyMjAwMTUwMTlaFw0yODEyMTcwMTUwMTlaMFgxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpDYWxpZm9ybmlhMRYwFAYDVQQHEw1TYW4gRnJhbmNpc2NvMRwwGgYDVQQDDBNBZG1pbkBvcmcxLnRlc3QuY29tMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEBA8ufNZBSg+8vS+NnVadihHbfMAnYPxwtDGOFM2obZXp9kql+pwDNx1qxKDCvA641t41SoB0DAk/tQGEskWfb6NNMEswDgYDVR0PAQH/BAQDAgeAMAwGA1UdEwEB/wQCMAAwKwYDVR0jBCQwIoAgWLpgWAoQFowXJO9f5YDREOmmttIamxa4yVH1emEBxoIwCgYIKoZIzj0EAwIDSAAwRQIhANBiSJy7vDNJ5dPYLkFxlt94EsJqkZB4yrwezJJFNlvxAiBCPy3ME34qiyZlhl2BwQlCm1U/OHOQegh+y9LPF6Q68A==\\n-----END CERTIFICATE-----\"}}},\"orderers\":{\"orderer0.orderer.test.com\":{\"url\":\"grpc://10.121.60.19:8927\"}},\"peers\":{\"peer1.org1.test.com\":{\"url\":\"grpc://10.121.60.19:9036\",\"eventUrl\":\"grpc://10.121.60.19:9038\"},\"peer1.org2.test.com\":{\"url\":\"grpc://10.121.60.19:9036\",\"eventUrl\":\"grpc://10.121.60.19:9038\"}},\"certificateAuthorities\":{\"ca.org1.test.com\":{\"url\":\"http://10.121.60.19:9039\",\"caName\":\"ca.org1.test.com\"},\"ca.org2.test.com\":{\"url\":\"http://10.121.60.19:9039\",\"caName\":\"ca.org1.test.com\"}}}"
            }
        ],
        "errorCode": null,
        "errorMsg": null,
        "errorStackTrace": null
    }
});

Mock.mock('/app/getById', function () {
    return {
        "code": 10000,
        "msg": "接口调用成功",
        "data": {
            "id": "app1",
            "appName": "test11",
            "apiKey": "f7f29c2bea2845ad98e31c4fd748091a",
            "secretKey": "cd8c3972a8b84beb919bbc9a527b31e4",
            "userId": "1",
            "createTime": "2019-02-27 11:36:42",
            "lastUpdateTime": "2019-02-27",
            "chainName": "test_channel2_org1_e036fa767a2d4fd6bae43eb38657d546",
            "chainVersion": "hlfv1",
            "clientOrg": "org1",
            "networkConfigJson": null
        },
        "errorCode": null,
        "errorMsg": null,
        "errorStackTrace": null
    }
});

Mock.mock('/channel/list', function () {
    return {
        "code": 10000,
        "msg": "接口调用成功",
        "data": [
            {
                "appId": "app1",
                "appName": "test1",
                "chainName": "test_channel2_org1_e036fa767a2d4fd6bae43eb38657d546",
                "channelName": "channel2",
                "peers": [
                    {
                        "name": "peer1.org1.test.com",
                        "url": "grpc://10.121.60.19:9036",
                        "endorsingPeer": true,
                        "chaincodeQuery": true,
                        "ledgerQuery": true,
                        "eventSource": false
                    }
                ],
                "orderers": [
                    {
                        "name": "orderer0.orderer.test.com",
                        "url": "grpc://10.121.60.19:8927"
                    }
                ]
            }
        ],
        "errorCode": null,
        "errorMsg": null,
        "errorStackTrace": null
    }
});

Mock.mock('/chaincode/list', function () {
    return {
        "code": 10000,
        "msg": "接口调用成功",
        "data": [
            {
                "chainCodeName": "aaa",
                "chainCodeVersion": "1.0.16",
                "chainCodePath": "",
                "chainCodeLanguage": null,
                "apiDocUrl": "http://localhost:8081/chaincode/apiDoc?appId=app1&channelName=channel2&chainCodeName=aaa",
                "resetUrl": "http://localhost:8081/assets/swagger-ui/index.html?url=http%3A%2F%2Flocalhost%3A8081%2Fchaincode%2FapiDoc%3FappId%3Dapp1%26channelName%3Dchannel2%26chainCodeName%3Daaa",
                "status": [
                    {
                        "peerName": "peer1.org1.test.com",
                        "peerUrl": "grpc://10.121.60.19:9036",
                        "hasInstall": true
                    }
                ]
            },
            {
                "chainCodeName": "abcd",
                "chainCodeVersion": "1.0.1",
                "chainCodePath": "",
                "chainCodeLanguage": null,
                "apiDocUrl": "http://localhost:8081/chaincode/apiDoc?appId=app1&channelName=channel2&chainCodeName=abcd",
                "resetUrl": "http://localhost:8081/assets/swagger-ui/index.html?url=http%3A%2F%2Flocalhost%3A8081%2Fchaincode%2FapiDoc%3FappId%3Dapp1%26channelName%3Dchannel2%26chainCodeName%3Dabcd",
                "status": [
                    {
                        "peerName": "peer1.org1.test.com",
                        "peerUrl": "grpc://10.121.60.19:9036",
                        "hasInstall": true
                    }
                ]
            },
            {
                "chainCodeName": "abcd1",
                "chainCodeVersion": "1.0.4",
                "chainCodePath": "",
                "chainCodeLanguage": null,
                "apiDocUrl": "http://localhost:8081/chaincode/apiDoc?appId=app1&channelName=channel2&chainCodeName=abcd1",
                "resetUrl": "http://localhost:8081/assets/swagger-ui/index.html?url=http%3A%2F%2Flocalhost%3A8081%2Fchaincode%2FapiDoc%3FappId%3Dapp1%26channelName%3Dchannel2%26chainCodeName%3Dabcd1",
                "status": [
                    {
                        "peerName": "peer1.org1.test.com",
                        "peerUrl": "grpc://10.121.60.19:9036",
                        "hasInstall": true
                    }
                ]
            },
            {
                "chainCodeName": "abcd4",
                "chainCodeVersion": "1.0.5",
                "chainCodePath": "",
                "chainCodeLanguage": null,
                "apiDocUrl": "http://localhost:8081/chaincode/apiDoc?appId=app1&channelName=channel2&chainCodeName=abcd4",
                "resetUrl": "http://localhost:8081/assets/swagger-ui/index.html?url=http%3A%2F%2Flocalhost%3A8081%2Fchaincode%2FapiDoc%3FappId%3Dapp1%26channelName%3Dchannel2%26chainCodeName%3Dabcd4",
                "status": [
                    {
                        "peerName": "peer1.org1.test.com",
                        "peerUrl": "grpc://10.121.60.19:9036",
                        "hasInstall": true
                    }
                ]
            },
            {
                "chainCodeName": "bbb",
                "chainCodeVersion": "1.0.16",
                "chainCodePath": "",
                "chainCodeLanguage": null,
                "apiDocUrl": "http://localhost:8081/chaincode/apiDoc?appId=app1&channelName=channel2&chainCodeName=bbb",
                "resetUrl": "http://localhost:8081/assets/swagger-ui/index.html?url=http%3A%2F%2Flocalhost%3A8081%2Fchaincode%2FapiDoc%3FappId%3Dapp1%26channelName%3Dchannel2%26chainCodeName%3Dbbb",
                "status": [
                    {
                        "peerName": "peer1.org1.test.com",
                        "peerUrl": "grpc://10.121.60.19:9036",
                        "hasInstall": true
                    }
                ]
            },
            {
                "chainCodeName": "dddd",
                "chainCodeVersion": "1.0.1",
                "chainCodePath": "",
                "chainCodeLanguage": null,
                "apiDocUrl": "http://localhost:8081/chaincode/apiDoc?appId=app1&channelName=channel2&chainCodeName=dddd",
                "resetUrl": "http://localhost:8081/assets/swagger-ui/index.html?url=http%3A%2F%2Flocalhost%3A8081%2Fchaincode%2FapiDoc%3FappId%3Dapp1%26channelName%3Dchannel2%26chainCodeName%3Ddddd",
                "status": [
                    {
                        "peerName": "peer1.org1.test.com",
                        "peerUrl": "grpc://10.121.60.19:9036",
                        "hasInstall": true
                    }
                ]
            }
        ],
        "errorCode": null,
        "errorMsg": null,
        "errorStackTrace": null
    }
});




