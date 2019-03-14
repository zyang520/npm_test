<template>
    <div style="width:100%;height:100%;">
        <TitlePage title="我的应用/应用详情" desc=""></TitlePage>
        <div class="base-info">
            <h2>基本信息</h2>
            <ul>
                <li>
                    <span>应用名称：</span>
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
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="peers"
                        label="Peer节点">
                </el-table-column>
            </el-table>


            <div class="block" style="margin-top:15px;float:right;">
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
                currentPage: 1, // 当前页码
                total: 20, // 总条数
                pageSize: 10, // 每页的数据条数
                detailData: {},
                tableData: []
            }
        },
        mounted() {
            var appId = this.$route.query.appId;
            //加载app详情
            this.$http({
                method: 'get',
                url: '/app/getById',
                data: {"appId": appId}
            }).then(res => {
                if (res.code == 10000) {
                    this.detailData = res.data;
                }
            });
            //加载通道
            this.$http({
                method: 'get',
                url: '/channel/list',
                data: {"appId": appId}
            }).then(res => {
                if (res.code == 10000) {
                    this.tableData = res.data;
                }
            });
        },
        methods: {
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.currentPage = 1;
                this.pageSize = val;
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.currentPage = val;

            },
            handleAppLink(row, id) {
                this.$router.push({path: '/appChainCodeList', query: {appId: row.appId, channelName: row.channelName}});
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


