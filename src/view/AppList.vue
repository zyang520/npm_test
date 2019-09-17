<template>
    <div style="width:100%;height:100%;">
        <TitlePage title="我的链" desc=""></TitlePage>
        <div class="table-container">
            <el-row style="margin-bottom: 10px;">
                <el-button type="primary" icon="el-icon-edit" @click="createLink.dialogVisible = true;">创建链连接</el-button>
                <el-input
                        v-model="search"
                        placeholder="搜索"
                        clearable
                        style="width: 200px;margin-left: 30px;"/>
            </el-row>
            <el-table
                    :data="filterData().slice((currentPage-1)*pageSize,currentPage*pageSize)"
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
                        width="200">
                    <template slot-scope="scope">
                        <el-button @click="downloadApp(scope.row)" type="text" size="small">下载</el-button>
                        <el-button @click="updateApp(scope.row)" type="text" size="small">修改</el-button>
                        <el-button @click="deleteApp(scope.row)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="block" style="margin-top:10px;float:right;">
                <el-pagination align='center' @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page="currentPage" :page-sizes="[1,5,10,20]" :page-size="pageSize"
                               layout="total, sizes, prev, pager, next, jumper" :total="filterData().length">
                </el-pagination>
            </div>
        </div>

        <!--使用配置文件创建-->
        <el-dialog title="创建链连接" :visible.sync="createLink.dialogVisible" :before-close="resetCreateDialog">
            <el-form ref="createLinkForm1" :model="createLink.form">
                <el-form-item label="连接名称" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="createLink.form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="上传配置文件" :label-width="formLabelWidth">
                    <el-upload
                            class="upload-demo"
                            ref="createFile"
                            drag
                            :action="UploadUrl()"
                            multiple
                            :on-success="createUploadSuccess"
                            :limit="fileListLimit"
                            >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip">只能上传.card文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="createLink.dialogVisible = false;resetCreateDialog();">取 消</el-button>
                <el-button type="primary" @click="createAppByFile();">确 定</el-button>
            </div>
        </el-dialog>


        <!--使用配置文件创建-->
        <el-dialog title="修改链连接" :visible.sync="updateLink.dialogVisible" :before-close="resetUpdateDialog">
            <el-form ref="updateLinkForm1" :model="updateLink.form">
                <el-form-item label="ID" style="display: none;"  :label-width="formLabelWidth" prop="appId">
                    <el-input v-model="updateLink.form.appId"></el-input>
                </el-form-item>
                <el-form-item label="连接名称" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="updateLink.form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="上传配置文件" :label-width="formLabelWidth">
                    <el-upload
                            class="upload-demo"
                            ref="updateFile"
                            drag
                            :action="UploadUrl()"
                            multiple
                            :on-success="updateUploadSuccess"
                            :limit="fileListLimit"
                    >
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip">只能上传.card文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="updateLink.dialogVisible = false;resetUpdateDialog();">取 消</el-button>
                <el-button type="primary" @click="updateAppByFile();">确 定</el-button>
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
                search:"",
                fileListLimit:1,
                gridLoading:false,
                createLink:{
                    dialogVisible: false,
                    form: {
                        name: '',
                        attachId:null,//上传附件Id
                    }
                },
                updateLink:{
                    dialogVisible: false,
                    form: {
                        appId: '',
                        name: '',
                        attachId:null,//上传附件Id
                    }
                },
                bpi: false,
                formLabelWidth: '120px',
                tableData: [],
                currentPage: 1, // 当前页码
                total: 20, // 总条数
                pageSize: 10, // 每页的数据条数
            }
        },
        activated: function () {
            this.$store.commit('setActiveMenuIndex', "1");
            this.currentPage = 1;
            this.pageSize = 10;
            this.loadData();
        },
        methods: {
            filterData() {
                return this.tableData.filter(data => !this.search || data.appName.toLowerCase().includes(this.search.toLowerCase()));
            },
            resetCreateDialog(done){
                this.$refs.createLinkForm1.resetFields();
                this.$refs.createFile.clearFiles();
                if (!!done) {
                    done();
                }
            },
            resetUpdateDialog(done){
                this.$refs.updateLinkForm1.resetFields();
                this.$refs.updateFile.clearFiles();
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
            updateApp(row) {
                var self = this;
                self.updateLink.form.appId = row['id'];
                self.updateLink.form.name = row['appName'];
                self.updateLink.dialogVisible = true;
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
                var self = this;
                var appName = this.createLink.form.name;
                var attachId = this.createLink.form.attachId;
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
                    self.$message.success('创建链连接成功');
                    self.createLink.dialogVisible = false;
                    self.loadData();
                    self.resetCreateDialog();
                }, error => {
                    self.$message.error(error.data.errorMessage);
                });
            },
            updateAppByFile(){
                var self = this;
                var appId = this.updateLink.form.appId;
                var appName = this.updateLink.form.name;
                var attachId = this.updateLink.form.attachId;
                if(!!!appName){
                    this.$message.error('连接名称必须填写');
                    return;
                }
                this.$http({
                    method: 'post',
                    url: '/app/update',
                    data:{
                        "appId": appId,
                        "appName": appName,
                        "attachmentId": attachId,
                    }
                }).then(data => {
                    self.$message.success('更新链连接成功');
                    self.updateLink.dialogVisible = false;
                    self.loadData();
                    self.resetUpdateDialog();
                }, error => {
                    self.$message.error(error.data.errorMessage);
                });
            },
            createUploadSuccess(response, file, fileList){
                if(!!response.id){
                    this.createLink.form.attachId = response.id;
                } else {
                    this.createLink.form.attachId = null;
                    this.$message.error("上传文件失败");
                    this.$refs.createFile.clearFiles();
                }
            },
            updateUploadSuccess(response, file, fileList){
                if(!!response.id){
                    this.updateLink.form.attachId = response.id;
                } else {
                    this.updateLink.form.attachId = null;
                    this.$message.error("上传文件失败");
                    this.$refs.updateFile.clearFiles();
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

            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.currentPage = 1;
                this.pageSize = val;
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.currentPage = val;
            },
        },
    }
</script>


<style>
    .table-container {
        margin: 20px;
    }
</style>


