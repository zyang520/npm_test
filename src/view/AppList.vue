<template>
    <div style="width:100%;height:100%;">
        <TitlePage title="我的链" desc=""></TitlePage>
        <div class="table-container">
            <el-row style="margin-bottom: 10px;">
                <!--<el-button type="primary" icon="el-icon-edit" @click="createDialogVisible = true">创建链连接</el-button>-->
                <el-button type="primary" icon="el-icon-edit" @click="uploadDialogVisible = true;">创建链连接</el-button>
                <!--<el-button type="primary" icon="el-icon-delete">删除</el-button>-->
            </el-row>
            <el-table
                    :data="tableData"
                    border
                    stripe
                    v-loading="gridLoading"
                    style="width: 100%">
                <el-table-column
                        prop="appName"
                        label="连接名称"
                        width="180">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="handleAppLink(scope.row)">{{scope.row.appName}}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="chainName"
                        label="链名称"
                        width="280"
                        :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column
                        prop="chainVersion"
                        label="链版本"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="clientOrg"
                        label="客户端组织"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="apiKey"
                        label="ApiKey"
                        width="300">
                </el-table-column>
                <el-table-column
                        prop="createTime"
                        label="创建时间">
                </el-table-column>
                <el-table-column
                        fixed="right"
                        label="操作"
                        width="100">
                    <template slot-scope="scope">
                        <el-button @click="downloadApp(scope.row)" type="text" size="small">下载</el-button>
                        <el-button @click="deleteApp(scope.row)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

        </div>

        <!--使用配置文件创建-->
        <el-dialog title="创建链连接" :visible.sync="uploadDialogVisible" :before-close="resetUploadDialog">
            <el-form ref="uploadForm1" :model="uploadForm">
                <el-form-item label="连接名称" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="uploadForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="上传配置文件" :label-width="formLabelWidth">
                    <el-upload
                            class="upload-demo"
                            ref="appCardFile"
                            drag
                            :action="UploadUrl()"
                            multiple
                            :on-success="fileUploadSuccess"
                            :limit="fileListLimit"
                            >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip">只能上传.card文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="uploadDialogVisible = false;resetUploadDialog();">取 消</el-button>
                <el-button type="primary" @click="createAppByFile">确 定</el-button>
            </div>
        </el-dialog>

        <!--不使用配置文件创建-->
        <el-dialog title="创建链连接" :visible.sync="createDialogVisible">
            <el-form :model="form">
                <el-form-item label="连接名称" :label-width="formLabelWidth">
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
                fileListLimit:1,
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
            this.$store.commit('setActiveMenuIndex', "1");
            this.loadData();
        },
        methods: {
            resetUploadDialog(done){
                this.$refs.uploadForm1.resetFields();
                this.$refs.appCardFile.clearFiles();
                if (!!done) {
                    done();
                }
            },
            loadData(){
                let self = this;
                self.tableData = [];
                self.gridLoading = true;
                self.$http({
                    method: 'get',
                    url: '/app/list'
                }).then(data => {
                    self.gridLoading = false;
                    // console.log(data);
                    self.tableData = data;
                });
            },
            handleAppLink(row) {
                this.$router.push({path: '/appDetail', query: {appId: row.id, appName: row.appName}});
            },
            downloadApp(row) {
                var element = document.createElement('frame');
                element.style.display='none';
                element.src = this.api_host + '/app/download?id=' + row.id;
                document.body.appendChild(element);
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
                    this.$message.error('连接名称必须填写');
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
                }).then(data => {
                    // console.log(data);
                    this.$message.success('创建链连接成功');
                    this.uploadDialogVisible = false;
                    this.loadData();
                });
            },
            fileUploadSuccess(response, file, fileList){
                if(!!response.id){
                    this.attachId = response.id;
                } else {
                    this.attachId = null;
                    this.$message.error("上传文件失败");
                    this.$refs.appCardFile.clearFiles();
                }
            },
            deleteApp(row){
                this.$confirm('此操作将永久删除该连接, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http({
                        method: 'get',
                        url: '/app/delete_by_id',
                        data:{
                            "appId": row.id
                        }
                    }).then(data => {
                       if(data){
                           this.$message.success('删除连接成功');
                           this.loadData();
                       } else {
                           this.$message.success('删除失败');
                       }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            }
        },
    }
</script>


<style>
    .table-container {
        margin: 20px;
    }
</style>


