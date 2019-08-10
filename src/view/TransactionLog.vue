<template>
    <div style="width:100%;height:100%;">
        <TitlePage title="日志中心" desc=""></TitlePage>
        <div class="table-container">
            <el-form :inline="true" :model="form1" ref="form1" class="demo-form-inline">
                <el-form-item label="交易日期" prop="timeField">
                    <el-date-picker
                            v-model="form1.timeField"
                            align="right"
                            type="date"
                            :clearable="false"
                            placeholder="选择日期"
                            :picker-options="pickerOptions21">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="连接" prop="appIdField.val">
                    <el-select v-model="form1.appIdField.val" @change="appIdFieldChange" clearable placeholder="所属连接">
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
                        <el-option label="交易" value="invoke"></el-option>
                        <el-option label="查询" value="query"></el-option>
                    </el-select>
                </el-form-item>
                <br/>
                <el-form-item label="交易结果" prop="statusField.val">
                    <el-select v-model="form1.statusField.val" placeholder="交易结果">
                        <el-option label="所有" value=""></el-option>
                        <el-option label="成功" value="success"></el-option>
                        <el-option label="失败" value="failure"></el-option>
                    </el-select>
                </el-form-item>
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
                        label="连接"
                        width="120"
                        :show-overflow-tooltip="true"> 
                </el-table-column>
                <el-table-column
                        prop="channelName"
                        label="通道"
                        width="120"
                        :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column
                        prop="chainCodeName"
                        label="链码"
                        width="100"
                        :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column
                        prop="transactionOrgMsp"
                        label="发起组织"
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
                        prop="status"
                        label="交易状态"
                        :formatter="transactionStatusFormat">
                </el-table-column>
                <el-table-column
                        prop="transactionCostTime"
                        label="交易耗时(毫秒)"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="status"
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
                    statusField: {
                        val: "",
                    },
                    timeField: this.getInitDate(),
                    transactionIdField: "",
                },
                fileListLimit: 1,
                attachId: null,//上传附件Id
                createDialogVisible: false,
                uploadDialogVisible: false,
                bpi: false,
                formLabelWidth: '120px',
                pickerOptions21: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
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
            //配置菜单
            this.$store.commit('setActiveMenuIndex', "2");
            this.form1.appIdField.val = this.$route.query.appId;
            this.form1.channelNameField.val = this.$route.query.channelName;
            this.form1.chainCodeIdField.val = this.$route.query.chainCodeName;
            this.appIdFieldLoadData(this.table1LoadData);
        },
        methods: {
            getInitDate(){
                //昨天
                // const date = new Date();
                // date.setTime(date.getTime() - 3600 * 1000 * 24);
                // return date;
                //今天
                return new Date();
            },
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
            appIdFieldLoadData(call) {
                // 加载应用选择框
                let self = this;
                this.resetAppIdField();
                self.$http({
                    method: 'get',
                    url: '/app/list'
                }).then(data => {
                    self.form1.appIdField.options =data.map(function (item) {
                        return {"label": item.appName, "value": item.id};
                    });
                    if(!!this.$route.query.appId){
                        this.form1.appIdField.val = this.$route.query.appId;
                        this.appIdFieldChange(this.$route.query.appId, call);
                    } else {
                        if(!!call){
                            call();
                        }
                    }
                });
            },
            appIdFieldChange(val, call) {
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
                    }).then(data => {
                        self.form1.channelNameField.options = data.map(function (item) {
                            return {"label": item.channelName, "value": item.channelName};
                        });
                        if(!!self.$route.query.channelName){
                            self.form1.channelNameField.val = self.$route.query.channelName;
                            self.channelNameFieldChange(this.form1.channelNameField.val, call);
                        } else {
                            if(!!call){
                                call();
                            }
                        }
                    });
                }
            },
            channelNameFieldChange(val, call) {
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
                    }).then(data => {
                        self.form1.chainCodeIdField.options = data.map(function (item) {
                            return {"label": item.chainCodeName, "value": item.chainCodeName};
                        });
                        if(!!self.$route.query.chainCodeName){
                            this.form1.chainCodeIdField.val = self.$route.query.chainCodeName;
                        }
                        if(!!call){
                            call();
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
                        url: '/traceLog/logList',
                        data: {
                            appId: self.form1.appIdField.val,
                            channelName: self.form1.channelNameField.val,
                            chainCodeName: self.form1.chainCodeIdField.val,
                            method: self.form1.methodField.val,
                            status: self.form1.statusField.val,
                            transactionId: self.form1.transactionIdField,
                            transactionDate: self.formatTime(self.form1.timeField, 'yyyy-MM-dd'),
                            pageNum: self.table1.current,
                            pageSize: self.table1.size,
                        }
                    }).then(data => {
                        self.table1.loading = false;
                        self.table1.records = data.records;
                        self.table1.total = data.total;
                        self.table1.pages = data.pages;
                        self.table1.size = data.size;
                    });
                }
            },
            handleDetailLink(row) {
                var $self = this;
                var appName = row["appName"];
                this.detailDialog.visible = true;
                this.$http({
                    method: 'get',
                    url: '/traceLog/getById',
                    data: {
                        "traceId": row["traceId"],
                    }
                }).then(data => {
                    $self.detailData = [
                        {"prop": "交易ID", "value": data.transactionId},
                        {"prop": "交易发起时间", "value": $self.formatTime(data.transactionStartTime)},
                        {"prop": "连接名称", "value": appName},
                        {"prop": "通道名称", "value": data.channelName},
                        {"prop": "组织msp", "value": data.transactionOrgMsp},
                        {"prop": "链码名称", "value": data.chainCodeName},
                        {"prop": "交易方式", "value": data.transactionType},
                        {"prop": "交易路径", "value": data.transactionPath},
                        {"prop": "交易请求参数", "value": data.transactionParameter},
                        {"prop": "交易返回结果", "value": data.transactionResponse},
                        {"prop": "交易状态", "value": $self.getTransactionStatus(data.status)},
                        {"prop": "上链状态", "value": $self.getBlockStatus(data.transactionType, data.status)},
                        {"prop": "区块高度", "value": data.blockNumber},
                        {"prop": "区块数据HASH", "value": data.dataHash},
                        {"prop": "区块HASH", "value": data.blockHash},
                        {"prop": "父区块HASH", "value": data.previousHash},
                        {"prop": "交易时间戳", "value": $self.formatTime(data.timeStamp)},
                    ];
                    if(!!data.blockRecordFailResponse){
                        $self.detailData.push({"prop": "上链失败原因", "value": data.blockRecordFailResponse});
                    }
                        
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
                return this.getTransactionStatus(row["status"]);
            },
            getTransactionStatus(status) {
                if (status == 0) {
                    return "交易失败"
                } else {
                    return "交易成功"
                }
            },
            blockStatusFormat(row, column, cellValue, index) {
                return this.getBlockStatus(row["transactionType"], row["status"]);
            },
            getBlockStatus(transactionType, status){
                if (transactionType == 'query'){
                    return "----";
                }
                if (status == 1) {
                    return "等待上链"
                } else if (status == 3) {
                    return "上链成功"
                } else if (status == 2) {
                    return "上链失败"
                } else {
                    return "----";
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
                return this.formatTime(cellValue, "yyyy-MM-dd hh:mm:ss")
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.appIdFieldLoadData(this.table1LoadData);
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
                    fmt = "yyyy-MM-dd hh:mm:ss";
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


