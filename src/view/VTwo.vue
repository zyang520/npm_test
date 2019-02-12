<template>
    <div style="width:100%;height:100%;">
        <TitlePage title="我的应用/app1/channel1" desc=""></TitlePage>
        <div class="table-container">
            <el-row style="margin-bottom: 10px;">
                <el-button type="primary" icon="el-icon-edit" @click="createDialogVisible = true">创建应用</el-button>
                <el-button type="primary" icon="el-icon-delete">删除</el-button>
            </el-row>
            <el-table
                    :data="tableData"
                    border
                    stripe
                    style="width: 100%">
                <el-table-column
                        prop="name"
                        label="应用名称"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="chain"
                        label="链名称"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="org"
                        label="组织"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="channel"
                        label="通道信息"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="status"
                        label="状态"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="date"
                        label="创建时间">
                </el-table-column>
            </el-table>
        </div>


        <el-dialog title="创建应用" :visible.sync="createDialogVisible">
            <el-form :model="form">
                <el-form-item label="应用名称" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="活动区域" :label-width="formLabelWidth">
                    <el-select v-model="form.region" placeholder="请选择活动区域">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="createDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="createDialogVisible = false">确 定</el-button>
            </div>
        </el-dialog>
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
                createDialogVisible: false,
                form: {
                    name: '',
                    region: ''
                },
                formLabelWidth: '120px',
                tableData: [{
                    date: '2016-05-02',
                    name: '测试1',
                    chain: 'chain.com'
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    chain: 'chain.com'
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    chain: 'chain.com'
                }, {
                    date: '2016-05-03',
                    name: '王小虎',
                    chain: 'chain.com'
                }]
            }
        }
    }
</script>


<style>
    .table-container {
        margin: 20px;
    }
</style>


