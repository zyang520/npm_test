<template>
    <div style="width:100%;height:100%;">
        <TitlePage :title="buildTitle()" desc=""></TitlePage>
        <div class="table-container">
            <el-row style="margin-bottom: 10px;">
                <el-button type="primary" icon="el-icon-edit" @click="updateChaincodes">获取安装情况</el-button>
                <el-button type="primary" icon="el-icon-edit" @click="installDialogVisible = true">安装链码</el-button>
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
                        <a target="_blank" :href="scope.row.resetUrl">访问接口</a>
                    </template>
                </el-table-column>
            </el-table>

            <div class="block" style="margin-top:15px;float:right;">
                <el-pagination align='center' @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page="currentPage" :page-sizes="[1,5,10,20]" :page-size="pageSize"
                               layout="total, sizes, prev, pager, next, jumper" :total="filterData().length">
                </el-pagination>
            </div>

            <el-dialog title="安装链码" :visible.sync="installDialogVisible">
                <el-form :model="installForm">
                    <el-form-item label="选择Peer节点" :label-width="formLabelWidth">
                        <el-select
                                v-model="selectPeers"
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
                    <el-form-item label="链码名称" :label-width="formLabelWidth">
                        <el-input v-model="installForm.name" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="链码版本" :label-width="formLabelWidth">
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
                    <el-button @click="installDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="chainCodeSubmit">确 定</el-button>
                </div>
            </el-dialog>


            <el-dialog title="初始化链码" :visible.sync="initDialogVisible"
                       v-loading="initializeDialogLoading"
                       element-loading-text="拼命初始化中，估计得一分钟"
                       element-loading-spinner="el-icon-loading"
                       element-loading-background="rgba(0, 0, 0, 0.1)">
                <el-form :model="initializeForm">
                    <el-form-item label="当前通道" :label-width="formLabelWidth">
                        <el-input v-model="queryChannelName" autocomplete="off" :disabled="true" style="width: 200px;"></el-input>
                    </el-form-item>
                    <el-form-item label="选择链码" :label-width="formLabelWidth">
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
                    <el-button @click="initDialogVisible = false">取 消</el-button>
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
                installForm:{
                    name:"",
                    version:"",
                },
                initializeForm:{
                    chainCode:""
                },
                peers: [],
                selectPeers: [],
                uploadExtraData: {
                    "attachmentType":"java_chain_code",
                },
                uploadAttachId:null,
                installChaincodesOption:[

                ],
                queryChaincodesLoading: false,
                initializeDialogLoading: false
            }

        },
        activated() {
            this.queryAppId= this.$route.query.appId;
            this.queryAppName= this.$route.query.appName;
            this.queryChannelName= this.$route.query.channelName;
            let self = this;
            this.loadGridData();
            this.$http({
                method: 'get',
                url: '/app/queryPeersByChannel',
                data: {"appId": this.queryAppId,"channelName": this.queryChannelName}
            }).then(res => {
                if (res.code == 10000) {
                    self.peers = res.data;
                }
            });
        },
        methods: {
            filterData(){
                return this.tableData.filter(data => !this.search || data.chainCodeName.toLowerCase().includes(this.search.toLowerCase()));
            },
            loadGridData(){
                var self = this;
                self.gridLoading = true;
                self.tableData = [];
                this.$http({
                    method: 'get',
                    url: '/chaincode/InitializeList',
                    data: {"appId": this.queryAppId, "channelName": this.queryChannelName}
                }).then(res => {
                    self.gridLoading = false;
                    console.log(res);
                    if (res.code == 10000) {
                        self.tableData = res.data;
                    }
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
            uploadUrl(){
                return this.api_host + "/attachment/upload";
            },
            uploadSuccess(response, file, fileList){
                if(response.code == 10000){
                    this.uploadAttachId = response.data.id;
                } else {
                    this.uploadAttachId = null;
                    this.$message.error("上传文件失败");
                    this.$refs.uploadDemo.clearFiles();
                }
            },
            chainCodeSubmit(){
                var self = this;
                this.$http({
                    method: 'post',
                    url: '/chaincode/installJava',
                    data: {
                        "appId": this.queryAppId,
                        "peerNames": this.selectPeers.map(function(i){return i;}).join(","),
                        "chaincodeName": this.installForm.name,
                        "chaincodeVersion": this.installForm.version,
                        "attachmentId": this.uploadAttachId,
                    }
                }).then(res => {
                    if(res.code == 10000){
                        var data = res.data;
                        var hasError = false;
                        for(var i = 0; i < data.length; i++){
                            var item = data[i];
                            if(item["statusCode"] != 200){
                                var message1 = "链码" + self.installForm.name + "在节点" + item["peerName"] + "上安装失败，失败原因:" + item["message"];
                                //self.$message.error(message1);
                                self.$message({
                                    showClose: true,
                                    duration:0,
                                    type: 'error',
                                    message:message1
                                });
                                hasError = true;
                                break;
                            }
                        }
                        if(!hasError){
                            this.$message.success("安装成功!");
                            setTimeout(function(){
                                self.installDialogVisible = false;
                            }, 500);
                        }
                    } else {
                        this.$message.error("系统错误!");
                    }
                });
            },
            updateChaincodes(){
                this.$http({
                    method: 'get',
                    url: '/chaincode/updateInstallChaincodes',
                    data: {
                        "appId": this.queryAppId,
                        "channeName": this.queryChannelName,
                    }
                }).then(res => {
                    if(res.code == 10000){
                        this.$message.success("更新成功!");
                        this.loadGridData();
                    } else {
                        this.$message.error(response.errorMsg);
                    }
                });
            },
            status_format(row, column, cellValue, index){
                return cellValue.map(function (i) {
                    var hasInstall = i["hasInstall"]?"已安装":"未安装";
                    return i["peerName"] + "(" + hasInstall + ")"
                }).join(",");
            },
            openInitDialog(){
                var self = this;
                this.$http({
                    method: 'get',
                    url: '/chaincode/InstallList',
                    data: {
                        "appId": this.queryAppId,
                        "channelName": this.queryChannelName,
                    }
                }).then(res => {
                    if(res.code == 10000){
                        self.installChaincodesList =  res.data;
                        res.data.forEach(function(item){
                            var initialize = item.initialize ? "(已初始化)":"";
                            item.key = item.chainCodeName + "::" + item.chainCodeVersion;
                            item.label = item.chainCodeName + "::" + item.chainCodeVersion + initialize;
                            item.disabled = item.initialize;
                        });
                        self.installChaincodesOption =  res.data;
                        this.initDialogVisible = true;
                    } else {
                        this.$message.error("加载安装链码数据失败!");
                    }
                });
            },
            initializeSubmit(){
                var self = this;
                if(this.initializeForm.chainCode == ""){
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
                    }
                }).then(res => {
                    self.initializeDialogLoading = false;
                    console.log(res);
                    if(res.code == 10000){
                        if(res.data && res.data.statusCode == 200){
                            this.$message.success("初始化成功!");
                            self.initDialogVisible = false;
                            self.loadGridData();
                        } else {
                            self.$message({
                                showClose: true,
                                duration:0,
                                type: 'error',
                                message:"链码初始化上失败，失败原因:" + res.data.message
                            });
                        }
                    } else {
                        self.$message.error("系统错误!");
                    }
                });
            },
            buildTitle(){
                return "我的应用/"+ this.queryAppName + "/" + this.queryChannelName;
            }
        }
    }
</script>


<style>
    .table-container {
        margin: 20px;
    }
</style>


