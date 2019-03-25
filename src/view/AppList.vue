<template>
    <div style="width:100%;height:100%;">
        <TitlePage title="我的应用" desc=""></TitlePage>
        <div class="table-container">
            <el-row style="margin-bottom: 10px;">
                <!--<el-button type="primary" icon="el-icon-edit" @click="createDialogVisible = true">创建应用</el-button>-->
                <el-button type="primary" icon="el-icon-edit" @click="uploadDialogVisible = true">上传应用</el-button>
                <el-button type="primary" icon="el-icon-delete">删除</el-button>
            </el-row>
            <el-table
                    :data="tableData"
                    border
                    stripe
                    v-loading="gridLoading"
                    style="width: 100%">
                <el-table-column
                        prop="appName"
                        label="应用名称"
                        width="180">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="handleAppLink(scope.row)">{{scope.row.appName}}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="chainName"
                        label="链名称"
                        width="280">
                </el-table-column>
                <el-table-column
                        prop="chainVersion"
                        label="链版本"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="clientOrg"
                        label="组织"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="apiKey"
                        label="apiKey"
                        width="280">
                </el-table-column>
                <el-table-column
                        prop="createTime"
                        label="创建时间">
                </el-table-column>
            </el-table>
        </div>

        <el-dialog title="创建应用" :visible.sync="uploadDialogVisible">
            <el-form :model="uploadForm">
                <el-form-item label="应用名称" :label-width="formLabelWidth">
                    <el-input v-model="uploadForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="上传配置文件" :label-width="formLabelWidth">
                    <el-upload
                            class="upload-demo"
                            drag
                            :action="UploadUrl()"
                            multiple
                            :on-success="fileUploadSuccess"
                            >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip">只能上传.card文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="uploadDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="createAppByFile">确 定</el-button>
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
                attachId:null,//上传附件Id
                gridLoading:false,
                createDialogVisible: false,
                uploadDialogVisible: false,
                bpi: false,
                form: {
                    name: '',
                },
                uploadForm: {
                    name: '',
                },
                formLabelWidth: '120px',
                tableData: []
            }
        },
        activated: function () {
            this.loadData();
        },
        methods: {
            loadData(){
                console.log("loadData");
                let self = this;
                self.tableData = [];
                self.gridLoading = true;
                self.$http({
                    method: 'get',
                    url: '/app/list'
                }).then(res => {
                    self.gridLoading = false;
                    console.log(res);
                    if (res.code == 10000) {
                        self.tableData = res.data;
                    }
                });
            },
            handleAppLink(row) {
                this.$router.push({path: '/appDetail', query: {appId: row.id, appName: row.appName}});
            },
            UploadUrl(){
                return this.api_host + "/attachment/upload?attachmentType=chain_code_card";
                this.$router.go(0);
            },
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
            },
            createAppByFile(){
                var appName = this.uploadForm.name;
                var attachId = this.attachId;
                if(!!!appName){
                    this.$message.error('应用名称必须填写');
                    return;
                }
                if(!!!attachId){
                    this.$message.error('配置文件必须上传');
                    return;
                }
                this.$http({
                    method: 'post',
                    url: '/app/create',
                    data:{
                        "appName": appName,
                        "attachmentId": attachId,
                    }
                }).then(res => {
                    console.log(res);
                    if (res.code == 10000) {
                        this.$message.success('创建应用成功');
                        this.uploadDialogVisible = false;
                        this.loadData();
                    } else {
                        this.$message.error('创建应用失败');
                    }
                });
            },
            fileUploadSuccess(response, file, fileList){
                if(response.code == 10000){
                    this.attachId = response.data.id;
                } else {
                    this.attachId = null;
                    this.$message.error("上传文件失败");
                    this.$refs.uploadDemo.clearFiles();
                }
            }
        },
    }
</script>


<style>
    .table-container {
        margin: 20px;
    }
</style>


