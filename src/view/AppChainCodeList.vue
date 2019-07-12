<template>
    <div style="width:100%;height:100%;">
        <TitlePage :title="buildTitle()" desc=""></TitlePage>
        <div class="table-container">
            <el-row style="margin-bottom: 10px;">
                <el-button type="primary" icon="el-icon-edit" @click="updateChaincodes">获取安装情况</el-button>
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
                        <a target="_blank" :href="scope.row.resetUrl" style="color: #409EFF; height: 32px;display: inline-block;line-height: 32px;font-size: 12px;"><span>访问接口</span></a>
                        <router-link tag="a" target="_blank" style="color: #409EFF; height: 32px;display: inline-block;line-height: 32px;font-size: 12px;"
                                     :to="{name:'transactionLog',query:{appId: queryAppId,channelName: queryChannelName,chainCodeName: scope.row.chainCodeName}}">
                            <span>日志查询</span>
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
                <el-form :model="installForm" ref="installForm1">
                    <el-form-item label="选择Peer节点" :label-width="formLabelWidth" prop="peers">
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
                    <el-form-item label="链码名称" :label-width="formLabelWidth" prop="name">
                        <el-input v-model="installForm.name" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="链码版本" :label-width="formLabelWidth" prop="version">
                        <el-input v-model="installForm.version" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="链码文件" :label-width="formLabelWidth">
                        <el-upload
                                class="upload-demo"
                                ref="uploadDemo"
                                name="file"
                                drag
                                :data="uploadExtraData"
                                :action="uploadUrl()"
                                multiple
                                :on-success="uploadSuccess"
                                :auto-upload="true"
                                :limit="fileListLimit"
                        >
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                            <div class="el-upload__tip" slot="tip">只能上传.zip文件，且不超过100M</div>
                        </el-upload>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="installDialogVisible = false;resetUploadDialog();">取 消</el-button>
                    <el-button type="primary" @click="chainCodeSubmit">确 定</el-button>
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
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="initDialogVisible = false; resetInitDialog();">取 消</el-button>
                    <el-button type="primary" @click="initializeSubmit">初始化</el-button>
                </div>
            </el-dialog>

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
                },
                initializeForm: {
                    chainCode: ""
                },
                peers: [],
                uploadExtraData: {
                    "attachmentType": "java_chain_code",
                },
                uploadAttachId: null,
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
                this.$refs.uploadDemo.clearFiles();
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
            uploadSuccess(response, file, fileList) {
                if (!!response.id) {
                    this.uploadAttachId = response.id;
                } else {
                    this.uploadAttachId = null;
                    this.$message.error("上传文件失败");
                    this.$refs.uploadDemo.clearFiles();
                }
            },
            chainCodeSubmit() {
                var self = this;
                this.$http({
                    method: 'post',
                    url: '/chaincode/installJava',
                    data: {
                        "appId": this.queryAppId,
                        "peerNames": this.installForm.peers.join(","),
                        "chaincodeName": this.installForm.name,
                        "chaincodeVersion": this.installForm.version,
                        "attachmentId": this.uploadAttachId,
                    }
                }).then(data => {
                    var hasError = false;
                    for (var i = 0; i < data.length; i++) {
                        var item = data[i];
                        if (item["success"] != true) {
                            var message1 = "链码" + self.installForm.name + "在节点" + item["peerName"] + "上安装失败，失败原因:" + item["errorInfo"]["errorMessage"];
                            //self.$message.error(message1);
                            self.$message({
                                showClose: true,
                                duration: 0,
                                type: 'error',
                                message: message1
                            });
                            hasError = true;
                            break;
                        }
                    }
                    if (!hasError) {
                        this.$message.success("安装成功!");
                        setTimeout(function () {
                            self.installDialogVisible = false;
                        }, 500);
                    }
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

                // var d1 = "chaincode: testerror:v1 Instantiate Failure, failed with Channel Channel{id: 1, name: mychannel} sending proposal with transaction 3b6ee73ff3ae46435ef8c3ec8f21f1a6454b92fafd5c8f1c3a485ad00c5cae58 to Peer{ id: 3, name: peer0.org1.example.com, channelName: mychannel, url: grpc://10.121.60.17:7051} failed because of timeout(120000 milliseconds) expiration, on peer Peer{ id: 3, name: peer0.org1.example.com, channelName: mychannel, url: grpc://10.121.60.17:7051}";
                // d1 = d1 + d1;
                // d1 = d1 + d1;
                // d1 = d1 + d1;
                // self.$message({
                //     showClose: true,
                //     duration: 0,
                //     type: 'error',
                //     dangerouslyUseHTMLString: true,
                //     message: '<div><strong>链码初始化上失败，失败原因: </strong><div contenteditable="true"  style="max-height: 300px; margin: 10px 10px;">' + d1 + '</div></div>'
                // });
                // return ''
                if (this.initializeForm.chainCode == "") {
                    this.$message.error("请选择一个链码");
                    return;
                }
                // debugger;
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
                    }
                }).then(data => {
                    // debugger;
                    self.initializeDialogLoading = false;
                    if (data && data.success == true) {
                        this.$message.success("初始化成功!");
                        self.initDialogVisible = false;
                        self.loadGridData();
                    } else {
                        self.$message({
                            showClose: true,
                            duration: 0,
                            type: 'error',
                            dangerouslyUseHTMLString: true,
                            message: '<strong>链码初始化上失败，失败原因: <div style="max-height: 500px; overflow-y: auto;">' + data["errorInfo"]["errorMessage"] + '</div></strong>'
                        });
                    }
                });
            },
            logDetail(row) {
                return "/#/transactionLog?appId=fc77ec9e04c34c99afd277b1774d4a3e&channelName=mychannel&chainCodeName=test11";
            },
            buildTitle() {
                return "我的链/" + this.queryAppName + "/" + this.queryChannelName;
            }
        }
    }
</script>


<style>
    .table-container {
        margin: 20px;
    }
</style>


