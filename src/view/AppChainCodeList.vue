<template>
    <div style="width:100%;height:100%;">
        <TitlePage :title="buildTitle()" desc=""></TitlePage>
        <div class="table-container">
            <el-row style="margin-bottom: 10px;">
                <el-button type="primary" icon="el-icon-edit" @click="updateChaincodes">获取安装情况</el-button>
                <!--<el-button type="primary" icon="el-icon-edit" @click="showErrorDialog2">获取安装情况</el-button>-->
                <el-button type="primary" icon="el-icon-edit" @click="installDialogVisible = true;">安装链码</el-button>
                <el-button type="primary" icon="el-icon-edit" @click="openInitDialog">初始化链码</el-button>
                <el-input
                        v-model="search"
                        placeholder="搜索链码"
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
                        prop="status"
                        label="安装情况"
                        :formatter="status_format">
                </el-table-column>
                <el-table-column
                        prop="resetUrl"
                        label="操作"
                >
                    <template slot-scope="scope">
                        <a target="_blank" :href="scope.row.resetUrl" style="color: #409EFF; height: 32px;display: inline-block;line-height: 32px;font-size: 12px;"><span>链码接口</span></a>
                        <router-link tag="a" target="_blank" style="color: #409EFF; height: 32px;display: inline-block;line-height: 32px;font-size: 12px;"
                                     :to="{name:'transactionLog',query:{appId: queryAppId,channelName: queryChannelName,chainCodeName: scope.row.chainCodeName}}">
                            <span>访问日志</span>
                        </router-link>
                    </template>
                </el-table-column>
            </el-table>

            <div class="block" style="margin-top:10px;float:right;">
                <el-pagination align='center' @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page="currentPage" :page-sizes="[1,5,10,20]" :page-size="pageSize"
                               layout="total, sizes, prev, pager, next, jumper" :total="filterData().length">
                </el-pagination>
            </div>

            <el-dialog title="安装链码" :visible.sync="installDialogVisible" :before-close="resetUploadDialog">
                <el-form :model="installForm" :rules="installFormRules" ref="installForm1">
                    <el-form-item label="选择Peer节点" :label-width="formLabelWidth" prop="peers" style="margin-bottom: 30px;">
                        <el-select
                                v-model="installForm.peers"
                                multiple
                                collapse-tags
                                placeholder="请选择"
                                style="width: 300px"
                        >
                            <el-option
                                    v-for="item in peers"
                                    :key="item.name"
                                    :label="item.name"
                                    :value="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="链码名称" :label-width="formLabelWidth" prop="name" style="margin-bottom: 30px;">
                        <el-input v-model="installForm.name" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="链码版本" :label-width="formLabelWidth" prop="version" style="margin-bottom: 30px;">
                        <el-input v-model="installForm.version" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="链码文件" :label-width="formLabelWidth" prop="uploadInstallId">
                        <el-upload
                                class="upload-demo"
                                ref="uploadInstallField"
                                name="file"
                                dragname
                                :data="uploadInstallExtraData"
                                :action="uploadUrl()"
                                multiple
                                :on-success="uploadInstallSuccess"
                                :on-remove="uploadInstallRemove"
                                :auto-upload="true"
                                :limit="fileListLimit"
                        >
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传gzip文件，且不超过4M</div>
                        </el-upload>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="installDialogVisible = false;resetUploadDialog();">取 消</el-button>
                    <el-button type="primary" @click="chainCodeSubmit();">确 定</el-button>
                </div>
            </el-dialog>


            <el-dialog title="初始化链码" :before-close="resetInitDialog"
                       :visible.sync="initDialogVisible"
                       v-loading="initializeDialogLoading"
                       element-loading-text="拼命初始化中，估计得一分钟"
                       element-loading-spinner="el-icon-loading"
                       element-loading-background="rgba(0, 0, 0, 0.1)">
                <el-form :model="initializeForm" ref="initializeForm1">
                    <el-form-item label="当前通道" :label-width="formLabelWidth">
                        <el-input v-model="queryChannelName" autocomplete="off" :disabled="true"
                                  style="width: 200px;"></el-input>
                    </el-form-item>
                    <el-form-item label="选择链码" :label-width="formLabelWidth" prop="chainCode">
                        <el-select
                                v-model="initializeForm.chainCode"
                                filterable
                                reserve-keyword
                                collapse-tags
                                placeholder="请选择">
                            <el-option
                                    v-for="item in installChaincodesOption"
                                    :key="item.key"
                                    :label="item.label"
                                    :value="item.key"
                                    :disabled="item.disabled">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="指定策略文件" :label-width="formLabelWidth">
                        <el-upload
                                class="upload-demo"
                                ref="uploadInitField"
                                name="file"
                                drag
                                :data="uploadInitExtraData"
                                :action="uploadUrl()"
                                multiple
                                :on-success="uploadInitSuccess"
                                :auto-upload="true"
                                :limit="fileListLimit"
                        >
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                            <div class="el-upload__tip" slot="tip">只能上传.yaml文件，且不超过1M</div>
                        </el-upload>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="initDialogVisible = false; resetInitDialog();">取 消</el-button>
                    <el-button type="primary" @click="initializeSubmit();">初始化</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import TitlePage from '@/components/TitlePage';
    export default {
        components: {
            TitlePage
        },
        data() {
            let javaChainCode = "java_chain_code";
            return {
                search: "",
                gridLoading: false,
                currentPage: 1, // 当前页码
                total: 20, // 总条数
                pageSize: 10, // 每页的数据条数
                tableData: [],
                formLabelWidth: '120px',
                fileListLimit: 1,
                initDialogVisible: false,
                installDialogVisible: false,
                queryAppId: "",
                queryChannelName: "",
                installForm: {
                    peers: [],
                    name: "",
                    version: "",
                    uploadInstallId: null
                },
                installFormRules: {
                    uploadInstallId: [{required: true, message: '请上传文件', trigger: 'change'}],
                    peers: [{required: true, message: '请选择节点', trigger: 'change'}],
                    name: [{required: true, message: '请输入链码名称', trigger: 'blur'},
                        {pattern: /^(\w){2,20}$/, message: '只能输入2-20个字母、数字、下划线，并且只能以数字或字母开头', trigger: 'blur'}],
                    version: [{required: true, message: '请输入链码版本', trigger: 'blur'},
                        {pattern:/^v\d{1,3}\.\d{1,3}\.\d{1,3}$/, message:'版本号格式为v1.1.1', trigger: 'blur'}]
                },
                initializeForm: {
                    chainCode: "",
                    uploadInitId: null
                },
                peers: [],
                uploadInstallExtraData: {
                    "attachmentType": "java_chain_code",
                },
                uploadInitExtraData: {
                    "attachmentType": "policy_file",
                },
                installChaincodesOption: [],
                queryChaincodesLoading: false,
                initializeDialogLoading: false
            }

        },
        activated() {
            this.$store.commit('setActiveMenuIndex', "1");
            this.queryAppId = this.$route.query.appId;
            this.queryAppName = this.$route.query.appName;
            this.queryChannelName = this.$route.query.channelName;
            let self = this;
            this.currentPage = 1;
            this.pageSize = 10;
            this.loadGridData();
            this.$http({
                method: 'get',
                url: '/app/queryPeersByChannel',
                data: {"appId": this.queryAppId, "channelName": this.queryChannelName}
            }).then(data => {
                self.peers = data;
            });
        },
        methods: {
            resetUploadDialog(done){
                this.$refs.uploadInstallField.clearFiles();
                this.$refs.installForm1.resetFields();
                if (!!done) {
                    done();
                }
            },
            resetInitDialog(done){
                this.$refs.initializeForm1.resetFields();
                if (!!done) {
                    done();
                }
            },
            filterData() {
                return this.tableData.filter(data => !this.search || data.chainCodeName.toLowerCase().includes(this.search.toLowerCase()));
            },
            loadGridData() {
                var self = this;
                self.gridLoading = true;
                self.tableData = [];
                this.$http({
                    method: 'get',
                    url: '/chaincode/InitializeList',
                    data: {"appId": this.queryAppId, "channelName": this.queryChannelName}
                }).then(data => {
                    self.gridLoading = false;
                    self.tableData = data;
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
            uploadUrl() {
                return this.api_host + "/attachment/upload";
            },
            uploadInstallSuccess(response, file, fileList) {
                if (!!response.id) {
                    this.installForm.uploadInstallId = response.id;
                } else {
                    this.installForm.uploadInstallId = null;
                    this.$message.error("链码文件上传失败");
                    this.$refs.uploadInstallField.clearFiles();
                }
            },
            uploadInstallRemove(file, fileList) {
                this.installForm.uploadInstallId = null;
            },
            uploadInitSuccess(response, file, fileList) {
                if (!!response.id) {
                    this.initializeForm.uploadInitId= response.id;
                } else {
                    this.initializeForm.uploadInitId = null;
                    this.$message.error("策略文件上传失败");
                    this.$refs.uploadInitField.clearFiles();
                }
            },
            chainCodeSubmit() {
                var self = this;
                var checkPass = false;
                self.$refs['installForm1'].validate(valid => {
                    if (valid) {
                        checkPass = true;
                    }
                });
                if (!checkPass) {
                    return;
                }
                this.$http({
                    method: 'post',
                    url: '/chaincode/installJava',
                    data: {
                        "appId": this.queryAppId,
                        "peerNames": this.installForm.peers.join(","),
                        "chaincodeName": this.installForm.name,
                        "chaincodeVersion": this.installForm.version,
                        "attachmentId": this.installForm.uploadInstallId,
                    }
                }).then(data => {
                    self.$message.success("安装成功!");
                    self.installDialogVisible = false;
                    self.resetUploadDialog();
                }, error => {
                    self.$alert({
                        content:"安装出错",
                        errorData:error.data
                    });
                });
            },
            updateChaincodes() {
                this.$http({
                    method: 'get',
                    url: '/chaincode/updateInstallChaincodes',
                    data: {
                        "appId": this.queryAppId,
                        "channeName": this.queryChannelName,
                    }
                }).then(res => {
                    this.$message.success("更新成功!");
                    this.loadGridData();
                });
            },
            status_format(row, column, cellValue, index) {
                return cellValue.map(function (i) {
                    var hasInstall = i["hasInstall"] ? "已安装" : "未安装";
                    return i["peerName"] + "(" + hasInstall + ")"
                }).join(",");
            },
            openInitDialog() {
                var self = this;
                this.$http({
                    method: 'get',
                    url: '/chaincode/InstallList',
                    data: {
                        "appId": this.queryAppId,
                        "channelName": this.queryChannelName,
                    }
                }).then(data => {
                    self.installChaincodesList = data;
                    data.forEach(function (item) {
                        var initialize = item.initialize ? "(已初始化)" : "";
                        item.key = item.chainCodeName + "::" + item.chainCodeVersion;
                        item.label = item.chainCodeName + "::" + item.chainCodeVersion + initialize;
                        item.disabled = item.initialize;
                    });
                    self.installChaincodesOption = data;
                    this.initDialogVisible = true;
                });
            },
            initializeSubmit() {
                var self = this;
                if (this.initializeForm.chainCode == "") {
                    this.$message.error("请选择一个链码");
                    return;
                }
                var chainCodeData = this.initializeForm.chainCode.split("::");
                var chainCodeName = chainCodeData[0];
                var chainCodeVersion = chainCodeData[1];
                this.initializeDialogLoading = true;
                this.$http({
                    method: 'post',
                    url: '/chaincode/InitializeJava',
                    data: {
                        "appId": this.queryAppId,
                        "channelName": this.queryChannelName,
                        "chaincodeName": chainCodeName,
                        "chaincodeVersion": chainCodeVersion,
                        "attachmentId": this.initializeForm.uploadInitId,
                    }
                }).then(data => {
                    self.initializeDialogLoading = false;
                    this.$message.success("初始化成功!");
                    self.initDialogVisible = false;
                    self.loadGridData();
                    self.resetInitDialog();
                }, error => {
                    self.initializeDialogLoading = false;
                    if (error && error.data) {
                        self.$alert({
                            content:"初始化出错",
                            errorData:error.data
                        });
                    }
                });
            },
            buildTitle() {
                return "我的链/" + this.queryAppName + "/" + this.queryChannelName;
            },
            showErrorDialog2(){
                //这里弹出dialog就额可以了\
                this.$alert();
            }
        }
    }
</script>


<style>
    .table-container {
        margin: 20px;
    }
</style>


<style>
    .errorInfo {
        width: 100%;
    }
    .errorInfo li {
        margin-bottom: 10px;
    }
    .errorInfo li span{
        width:20%;
        display: inline-block;
        float: left;
    }

</style>


