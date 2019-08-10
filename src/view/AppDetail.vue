<template>
    <div style="width:100%;height:100%;">
        <TitlePage :title="buildTitle()" desc=""></TitlePage>
        <div class="base-info">
            <h2>基本信息</h2>
            <ul>
                <li>
                    <span>连接名称：</span>
                    <span>{{detailData.appName}}</span>
                </li>
                <li>
                    <span>API Key：</span>
                    <span>{{detailData.apiKey}}</span>
                </li>
                <li>
                    <span>Secret Key：</span>
                    <span>{{detailData.secretKey}}</span>
                </li>
                <li>
                    <span>链名称：</span>
                    <span>{{detailData.chainName}}</span>
                </li>
                <li>
                    <span>链版本：</span>
                    <span>{{detailData.chainVersion}}</span>
                </li>
                <li>
                    <span>创建时间：</span>
                    <span>{{detailData.createTime}}</span>
                </li>
                <li>
                    <span>更新时间：</span>
                    <span>{{detailData.lastUpdateTime}}</span>
                </li>
                <li>
                    <span>客户端组织：</span>
                    <span>{{detailData.clientOrg}}</span>
                </li>
            </ul>
        </div>

        <div class="channel-list">
            <h2>通道列表</h2>
            <el-table
                    :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                    border
                    stripe
                    v-loading="gridLoading"
                    style="width: 100%">
                <el-table-column
                        prop="channelName"
                        label="通道名称"
                        width="180">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="handleAppLink(scope.row)">{{scope.row.channelName}}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="orderers"
                        label="Orderer节点"
                        width="450"
                        :formatter="orderer_format">
                </el-table-column>
                <el-table-column
                        prop="peers"
                        label="Peer节点">
                    <template slot-scope="scope">
                        <div>
                            <el-popover trigger="hover" placement="top" style="float:left;margin-right: 20px;" v-for="item in scope.row.peers">
                                <p><span style="width: 80px;display: inline-block">名称: </span>{{ item.name }}</p>
                                <p><span style="width: 80px;display: inline-block">url: </span>{{ item.url }}</p>
                                <p><span style="width: 80px;display: inline-block">区块高度: </span><span v-if="item.blockHeight > 0">{{ item.blockHeight }}</span><span v-else>----</span></p>
                                <p><span style="width: 80px;display: inline-block">状态: </span><span v-if="item.enable == true">可用</span><span v-else>不可用</span></p>
                                <div slot="reference" class="name-wrapper" >
                                    <el-tag size="medium" :type="item.enable == true?'success':'danger'">{{ item.name }}</el-tag>
                                </div>
                            </el-popover>
                        </div>
                    </template>
                </el-table-column>
            </el-table>


            <div class="block" style="margin-top:10px;float:right;">
                <el-pagination align='center' @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page="currentPage" :page-sizes="[1,5,10,20]" :page-size="pageSize"
                               layout="total, sizes, prev, pager, next, jumper" :total="tableData.length">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import TitlePage from '@/components/TitlePage'

    export default {
        components: {
            TitlePage
        },
        data() {
            return {
                gridLoading: false,
                currentPage: 1, // 当前页码
                total: 20, // 总条数
                pageSize: 10, // 每页的数据条数
                detailData: {
                    appName: "",
                    apiKey: "",
                    secretKey: "",
                    chainName: "",
                    chainVersion: "",
                    createTime: "",
                    lastUpdateTime: "",
                    clientOrg: ""
                },
                tableData: [],
                queryAppId: "",
                queryAppName: ""
            }
        },
        activated() {
            this.$store.commit('setActiveMenuIndex', "1");
            this.queryAppId = this.$route.query.appId;
            this.queryAppName = this.$route.query.appName;
            //加载app详情
            this.$http({
                method: 'get',
                url: '/app/getById',
                data: {"appId": this.queryAppId}
            }).then(data => {
                this.detailData.appName = data.appName;
                this.detailData.apiKey = data.apiKey;
                this.detailData.secretKey = data.secretKey;
                this.detailData.chainName = data.chainName;
                this.detailData.chainVersion = data.chainVersion;
                this.detailData.createTime = data.createTime;
                this.detailData.lastUpdateTime = data.lastUpdateTime;
                this.detailData.clientOrg = data.clientOrg;
            });
            this.loadChannelData();
        },
        methods: {
            loadChannelData() {
                //加载通道
                let self = this;
                self.tableData = [];
                self.gridLoading = true;
                this.$http({
                    method: 'get',
                    url: '/channel/list',
                    data: {"appId": this.queryAppId}
                }).then(data => {
                    self.gridLoading = false;
                    this.tableData = data;
                });
            },
            handleSizeChange(val) {
                this.currentPage = 1;
                this.pageSize = val;
            },
            handleCurrentChange(val) {
                this.currentPage = val;
            },
            handleAppLink(row, id) {
                this.$router.push({
                    path: '/appChainCodeList',
                    query: {appId: this.queryAppId, appName: this.queryAppName, channelName: row.channelName}
                });
            },
            orderer_format(row, column, cellValue, index) {
                return cellValue.map(function (i) {
                    return i["name"] + "(" + i["url"] + ")"
                }).join(",");
            },
            peers_format(row, column, cellValue, index) {
                return cellValue.map(function (i) {
                    return i["name"] + "(" + i["url"] + ")"
                }).join(",");
            },
            buildTitle() {
                return "我的链/" + this.queryAppName;
            }
        }
    }
</script>


<style>
    .base-info, .channel-list {
        margin: 20px;
    }

    .base-info h2, .channel-list h2 {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 10px;
    }

    .base-info li > span:first-child {
        display: inline-block;
        font-size: 14px;
        height: 32px;
        line-height: 32px;
        width: 100px;
        text-align: right;
    }
</style>


