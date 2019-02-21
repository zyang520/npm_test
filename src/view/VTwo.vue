<template>
    <div style="width:100%;height:100%;">
        <TitlePage title="我的应用/app1/channel1" desc=""></TitlePage>
        <div class="table-container">
            <el-row style="margin-bottom: 10px;">
                <el-button type="primary" icon="el-icon-edit" @click="createDialogVisible = true">创建应用</el-button>
                <el-button type="primary" icon="el-icon-edit" @click="uploadDialogVisible = true">上传应用</el-button>
                <el-button type="primary" icon="el-icon-delete">删除</el-button>
            </el-row>
            <el-table
                    :data="tableData"
                    border
                    stripe
                    style="width: 100%">
                <el-table-column
                        prop="appName"
                        label="应用名称"
                        width="180">
                         <template slot-scope="scope">
                    <el-button type="text" size="small" @click="handleAppLink(scope.row)" >{{scope.row.appName}}</el-button>
               </template>
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
                        prop="createTime"
                        label="创建时间">
                </el-table-column>
            </el-table>
        </div>

        <el-dialog title="创建应用" :visible.sync="uploadDialogVisible">
            <el-form :model="form">
                <el-form-item label="应用名称" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="上传配置文件" :label-width="formLabelWidth">
                    <el-upload
                            class="upload-demo"
                            drag
                            action="https://jsonplaceholder.typicode.com/posts/"
                            multiple>
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip">只能上传.card文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="uploadDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="uploadDialogVisible = false">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="创建应用" :visible.sync="createDialogVisible">
            <el-form :model="form">
                <el-form-item label="应用名称" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="链名称" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="组织编号" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
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
                uploadDialogVisible: false,
                bpi: false,
                form: {
                    name: '',
                },
                formLabelWidth: '120px',
                tableData: []
            }
        },
        mounted () {
            let self = this;
            this.$http({
                method:'get',
                url:'/vTwo/list'

            }).then(res => {
                if(res.success == true){
                    self.tableData = res.data;

                }
            });

          /*  axios
                .get('/api/v1/app/list?a='+ Date())
                .then(response => {
                    console.log(response.data);
                    this.tableData = response.data.data;
                });*/
        },
        methods: {
             handleAppLink(row,id){
           //  debugger;
        console.log(row.ac_id);

        this.$router.push({path:'/appDetInfo',query:{rowData : row}});

        
        }  
        },
    }
</script>


<style>
    .table-container {
        margin: 20px;
    }
</style>


