<template>
    <div style="width:100%;height:100%;">
        <TitlePage title="我的应用/链码列表" desc=""></TitlePage>
        <div class="table-container">
            <el-row style="margin-bottom: 10px;">
                <el-button type="primary" icon="el-icon-edit" @click="createDialogVisible = true">更新链码安装情况</el-button>
                <el-button type="primary" icon="el-icon-edit" @click="uploadDialogVisible = true">安装链码</el-button>
            </el-row>
            <el-table
                    :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                    border
                    stripe
                    style="width: 100%">
                <el-table-column
                        prop="chainCodeName"
                        label="链码名称"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="chainCodeVersion"
                        label="当前版本"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="condition"
                        label="安装情况">
                </el-table-column>
                <el-table-column
                        prop="resetUrl"
                        label="操作">
                    <template slot-scope="scope">
                        <a target="_blank" :href="scope.row.resetUrl">访问接口</a>
                    </template>
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
                tableData: []
            }

        },
        mounted() {
            var appId = this.$route.query.appId;
            var channelName = this.$route.query.channelName;
            let self = this;
            this.$http({
                method: 'get',
                url: '/chaincode/list',
                data: {"appId": appId, "channelName": channelName}
            }).then(res => {
                console.log(res);
                if (res.code == 10000) {
                    self.tableData = res.data;
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
            visitRest(url) {
                // console.log(url);
                alert(url);
            }
        }
    }
</script>


<style>
    .table-container {
        margin: 20px;
    }
</style>


