<template>
    <div style="width:100%;height:100%;">
        <TitlePage title="日志中心" desc=""></TitlePage>
        <div class="table-container">
            <el-form :inline="true" :model="form1" ref="form1" class="demo-form-inline">
                <el-form-item label="应用" prop="appIdField.val">
                    <el-select v-model="form1.appIdField.val" @change="appIdFieldChange" clearable placeholder="所属应用">
                        <el-option
                                v-for="item in form1.appIdField.options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="通道" prop="channelNameField.val">
                    <el-select v-model="form1.channelNameField.val" @change="channelNameFieldChange" clearable
                               placeholder="所属通道">
                        <el-option
                                v-for="item in form1.channelNameField.options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="链码" prop="chainCodeIdField.val">
                    <el-select v-model="form1.chainCodeIdField.val" clearable filterable placeholder="所属链码">
                        <el-option
                                v-for="item in form1.chainCodeIdField.options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="交易类型" prop="methodField.val">
                    <el-select v-model="form1.methodField.val" placeholder="交易类型">
                        <el-option label="所有" value=""></el-option>
                        <el-option label="invoke" value="invoke"></el-option>
                        <el-option label="query" value="query"></el-option>
                        <el-option label="asyn_invoke" value="asyn_invoke"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="交易时间" prop="timeField">
                    <el-date-picker
                            v-model="form1.timeField"
                            type="daterange"
                            align="right"
                            unlink-panels
                            :picker-options="pickerOptions2"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <br/>
                <el-form-item label="交易ID" prop="transactionIdField">
                    <el-input v-model="form1.transactionIdField" placeholder="交易ID" clearable>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onQuery">查询</el-button>
                    <el-button @click="resetForm('form1')">重置</el-button>
                </el-form-item>
            </el-form>
            <el-table
                    :data="table1.records"
                    border
                    stripe
                    v-loading="table1.loading"
                    style="width: 100%">
                <el-table-column
                        prop="appName"
                        label="应用"
                        width="120"
                        :show-overflow-tooltip="true"> 
                </el-table-column>
                <el-table-column
                        prop="transactionOrgMsp"
                        label="组织MSP"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="channelName"
                        label="通道"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="chainCodeName"
                        label="链码"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="transactionStartTime"
                        label="交易发起时间"
                        :formatter="transactionStartTimeFormat"
                        width="190">
                </el-table-column>
                <el-table-column
                        prop="transactionId"
                        label="交易ID"
                        width="120"
                        :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column
                        prop="transactionType"
                        label="交易类型"
                        :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column
                        prop="transactionPath"
                        label="交易路径"
                        :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column
                        prop="transactionStatus"
                        label="交易状态"
                        :formatter="transactionStatusFormat">
                </el-table-column>
                <el-table-column
                        prop="transactionCostTime"
                        label="交易耗时(毫秒)">
                </el-table-column>
                <el-table-column
                        prop="blockStatus"
                        label="上链状态"
                        :formatter="blockStatusFormat">
                </el-table-column>
                <el-table-column
                        prop="blockNumber"
                        label="区块编号">
                </el-table-column>
                <el-table-column
                        fixed="right"
                        label="操作"
                        width="100">
                    <template slot-scope="scope">
                        <el-button @click="handleDetailLink(scope.row)" type="text" size="small">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block" style="margin-top:10px;float:right;">
                <el-pagination align='center' @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page="table1.current" :page-sizes="[1,5,10,20]" :page-size="table1.size"
                               layout="total, sizes, prev, pager, next, jumper" :total="table1.total">
                </el-pagination>
            </div>
        </div>
        <el-dialog title="交易详细信息" :visible.sync="detailDialog.visible" :center="true">
            <el-table
                    :data="detailData"
                    style="width: 100%"
                    height="500px"
                    :show-header="false"
                >
                <el-table-column
                        fixed
                        prop="prop"
                        label="属性"
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="value"
                        label="值">
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<style>
    .el-row {
        margin-bottom: 20px;
    }
    .bg-purple {
        background: #d3dce6;
    }
    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }
    .block{
        overflow: hidden;
    }
    .item_title{
        float: left;
        width: 20%;
    }
    .item_context{
        float: left;
    }

</style>

<script>
    import TitlePage from '@/components/TitlePage'
    export default {
        components: {
            TitlePage
        },
        data() {
            return {
                detailData:[
                ],
                queryParam: {
                    appId: "",
                    channelName: "",
                    chainCodeName: ""
                },
                table1: {
                    loading: false,//table显示正在加载数据
                    records: [],
                    total: 0,//总共多少条
                    size: 10,// 每页多少
                    current: 1,//第几页
                    pages: 0//总共多少页
                },
                form1: {
                    appIdField: {
                        val: "",
                        options: []
                    },
                    channelNameField: {
                        val: "",
                        options: []
                    },
                    chainCodeIdField: {
                        val: "",
                        options: []
                    },
                    methodField: {
                        val: "",
                    },
                    timeField: [new Date(), new Date()],
                    transactionIdField: "",
                },
                fileListLimit: 1,
                attachId: null,//上传附件Id
                createDialogVisible: false,
                uploadDialogVisible: false,
                bpi: false,
                formLabelWidth: '120px',
                pickerOptions2: {
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', [new Date(), new Date()]);
                        }
                    }, {
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                detailDialog: {
                    visible: false,
                    form: {
                        name: "",
                        region: ""
                    }
                }
            }
        },
        activated: function () {
            this.$store.commit('setActiveMenuIndex', "2");
            this.queryParam.appId= this.$route.query.appId;
            this.queryParam.channelName= this.$route.query.channelName;
            this.queryParam.chainCodeName= this.$route.query.chainCodeName;
            this.$refs["form1"].resetFields();
            this.appIdFieldLoadData();
            this.table1LoadData();
        },
        methods: {
            resetAppIdField() {
                this.form1.appIdField.val = "";
                this.form1.appIdField.options = [];
            },
            resetChannelNameField() {
                this.form1.channelNameField.val = "";
                this.form1.channelNameField.options = [];
            },
            resetChainCodeIdField() {
                this.form1.chainCodeIdField.val = "";
                this.form1.chainCodeIdField.options = [];
            },
            appIdFieldLoadData() {
                let self = this;
                this.resetAppIdField();
                self.$http({
                    method: 'get',
                    url: '/app/list'
                }).then(res => {
                    if (res.code == 10000) {
                        self.form1.appIdField.options = res.data.map(function (item) {
                            return {"label": item.appName, "value": item.id};
                        });
                        if(!!this.queryParam.appId){
                            this.form1.appIdField.val = this.queryParam.appId;
                            this.appIdFieldChange(this.form1.appIdField.val);
                        }
                    }
                });
            },
            appIdFieldChange(val) {
                let self = this;
                this.resetChannelNameField();
                this.resetChainCodeIdField();
                if (val != "") {
                    self.$http({
                        method: 'get',
                        url: '/channel/list',
                        data: {
                            appId: val
                        }
                    }).then(res => {
                        if (res.code == 10000) {
                            self.form1.channelNameField.options = res.data.map(function (item) {
                                return {"label": item.channelName, "value": item.channelName};
                            });
                            if(!!this.queryParam.channelName){
                                this.form1.channelNameField.val = this.queryParam.channelName;
                                this.channelNameFieldChange(this.form1.channelNameField.val);
                            }
                        }
                    });
                }
            },
            channelNameFieldChange(val) {
                let self = this;
                this.resetChainCodeIdField();
                if (val != "") {
                    self.form1.chainCodeIdField.options = [];
                    self.$http({
                        method: 'get',
                        url: '/chaincode/InitializeList',
                        data: {
                            appId: self.form1.appIdField.val,
                            channelName: val
                        }
                    }).then(res => {
                        if (res.code == 10000) {
                            self.form1.chainCodeIdField.options = res.data.map(function (item) {
                                return {"label": item.chainCodeName, "value": item.chainCodeName};
                            });
                            if(!!this.queryParam.chainCodeName){
                                this.form1.chainCodeIdField.val = this.queryParam.chainCodeName;
                            }
                        }
                    });
                }
            },
            table1LoadData() {
                let self = this;
                self.table1.records = [];
                if (!!self.form1.timeField) {
                    self.table1.loading = true;
                    self.$http({
                        method: 'get',
                        url: '/transaction/logList',
                        data: {
                            appId: self.form1.appIdField.val,
                            channelName: self.form1.channelNameField.val,
                            chainCodeName: self.form1.chainCodeIdField.val,
                            method: self.form1.methodField.val,
                            transactionId: self.form1.transactionIdField,
                            startTime: self.form1.timeField[0],
                            endTime: self.form1.timeField[1],
                            pageNum: self.table1.current,
                            pageSize: self.table1.size,
                        }
                    }).then(res => {
                        self.table1.loading = false;
                        console.log(res);
                        if (res.code == 10000) {
                            self.table1.records = res.data.records;
                            self.table1.total = res.data.total;
                            self.table1.pages = res.data.pages;
                            self.table1.size = res.data.size;
                        }
                    });
                }
            },
            handleDetailLink(row) {
                var $self = this;
                var appName = row["appName"];
                this.detailDialog.visible = true;
                this.$http({
                    method: 'get',
                    url: '/transaction/getById',
                    data: {
                        "transactionId": row["transactionId"],
                    }
                }).then(res => {
                    if (res.code == 10000) {
                        $self.detailData = [
                            {"prop": "交易ID", "value": res.data.transactionId},
                            {"prop": "应用名称", "value": appName},
                            {"prop": "通道名称", "value": res.data.channelName},
                            {"prop": "组织msp", "value": res.data.transactionOrgMsp},
                            {"prop": "链码名称", "value": res.data.chainCodeName},
                            {"prop": "交易发起时间", "value": $self.formatTime(res.data.transactionStartTime)},
                            {"prop": "交易方式", "value": res.data.transactionType},
                            {"prop": "交易路径", "value": res.data.transactionPath},
                            {"prop": "交易请求参数", "value": res.data.transactionParameter},
                            {"prop": "交易返回结果", "value": res.data.transactionResponse},
                            {"prop": "交易状态", "value": $self.getTransactionStatus(res.data.transactionStatus)},
                            {"prop": "上链状态", "value": $self.getBlockStatus(res.data.transactionType, res.data.transactionStatus, res.data.blockStatus)},
                            {"prop": "区块高度", "value": res.data.blockNumber},
                            {"prop": "区块数据HASH", "value": res.data.dataHash},
                            {"prop": "区块HASH", "value": res.data.blockHash},
                            {"prop": "父区块HASH", "value": res.data.previousHash},
                            {"prop": "交易时间戳", "value": $self.formatTime(res.data.timeStamp)},
                        ];
                        if(!!res.data.blockRecordFailResponse){
                            $self.detailData.push({"prop": "上链失败原因", "value": res.data.blockRecordFailResponse});
                        }
                        
                    }
                });
            },
            UploadUrl() {
                return this.api_host + "/attachment/upload?attachmentType=chain_code_card";
                this.$router.go(0);
            },
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {
                    });
            },
            createAppByFile() {
                var appName = this.uploadForm.name;
                var attachId = this.attachId;
                if (!!!appName) {
                    this.$message.error('应用名称必须填写');
                    return;
                }
                if (!!!attachId) {
                    this.$message.error('配置文件必须上传');
                    return;
                }
                this.$http({
                    method: 'post',
                    url: '/app/create',
                    data: {
                        "appName": appName,
                        "attachmentId": attachId,
                    }
                }).then(res => {
                    if (res.code == 10000) {
                        this.$message.success('创建应用成功');
                        this.uploadDialogVisible = false;
                        this.table1LoadData();
                    } else {
                        this.$message.error('创建应用失败');
                    }
                });
            },
            fileUploadSuccess(response, file, fileList) {
                if (response.code == 10000) {
                    this.attachId = response.data.id;
                } else {
                    this.attachId = null;
                    this.$message.error("上传文件失败");
                    this.$refs.uploadDemo.clearFiles();
                }
            },
            deleteApp(row) {
                this.$confirm('此操作将永久删除该应用, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http({
                        method: 'get',
                        url: '/app/delete_by_id',
                        data: {
                            "appId": row.id
                        }
                    }).then(res => {
                        console.log(res);
                        if (res.code == 10000) {
                            this.$message.success('删除应用成功');
                            this.table1LoadData();
                        } else {
                            this.$message.error('删除应用失败');
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
                this.table1.size = val;
                this.table1LoadData();
            },
            handleCurrentChange(val) {
                this.table1.current = val;
                this.table1LoadData();
            },
            transactionStatusFormat(row, column, cellValue, index) {
                return this.getTransactionStatus(cellValue);
            },
            getTransactionStatus(transactionStatus) {
                return transactionStatus == true ? "交易成功" : "交易失败";
            },
            blockStatusFormat(row, column, cellValue, index) {
                return this.getBlockStatus(row["transactionType"], row["transactionStatus"], cellValue);
            },
            getBlockStatus(transactionType, transactionStatus, blockStatus){
                if (transactionType == 'query'){
                    return "----";
                }
                if (transactionStatus == false) {
                    return "----";
                } else {
                    if (blockStatus == 0) {
                        return "等待上链"
                    } else if (blockStatus == 1) {
                        return "上链成功"
                    } else if (blockStatus == 2) {
                        return "上链失败"
                    } else {
                        return "----";
                    }
                }
            },
            onQuery() {
                if(!!!this.form1.timeField){
                    this.$message('请输入时间信息');
                    return;
                }
                this.table1LoadData();
            },
            transactionStartTimeFormat(row, column, cellValue, index) {
                return this.formatTime(cellValue, "yyyy-MM-dd hh:mm:ss.S")
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                if(!!this.queryParam.appId){
                    this.appIdFieldLoadData();
                }
                this.table1LoadData();
            },
            formatTime(dt, fmt) {
                if(dt == "" || dt == null || dt == undefined){
                    return "";
                }
                var date = null;
                if(typeof(dt) == "string"){
                    date = new Date(dt);
                } else {
                    date = dt;
                }
                //debugger;
                if(fmt == "" || fmt == null || fmt == undefined){
                    fmt = "yyyy-MM-dd hh:mm:ss.S";
                }
                var o = {
                    "M+": date.getMonth() + 1,                 //月份
                    "d+": date.getDate(),                    //日
                    "h+": date.getHours(),                   //小时
                    "m+": date.getMinutes(),                 //分
                    "s+": date.getSeconds(),                 //秒
                    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                    "S": date.getMilliseconds()             //毫秒
                };
                if (/(y+)/.test(fmt))
                    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
                for (var k in o)
                    if (new RegExp("(" + k + ")").test(fmt))
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                return fmt;
            }
        },
    }
</script>


<style>

</style>


