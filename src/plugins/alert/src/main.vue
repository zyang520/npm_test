<template>
    <el-dialog :title="title"
               :visible.sync="show"
               width="35%">
        <span>{{ content }}</span>
        <div style="margin-top: 50px;" v-if="errorData.errorCode">
            <hr style="border: 0.5px solid lightgrey; margin-top: 5px;"/>
            <span @click="detailShow = !detailShow" style="cursor: pointer;">查看详情</span>
            <el-form :model="errorData" style="width: 100%;" v-show="detailShow">
                <el-form-item label="错误码:" :label-width="detailLabelWidth" prop="errorCode">
                    <el-input v-model="errorData.errorCode" :readonly="true" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="错误信息:" :label-width="detailLabelWidth" prop="errorMessage">
                    <el-input v-model="errorData.errorMessage" :readonly="true" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="错误详情:" :label-width="detailLabelWidth" prop="errorDetail">
                    <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 5}"
                            :readonly="true"
                            v-model="errorData.errorDetail">
                    </el-input>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
                    <el-button @click="cancel">{{cancelText}}</el-button>
            </span>
    </el-dialog>
</template>
<script>
    export default {
        data() {
            return {
                name: 'ec-alert',
                show: false,
                title: '提示',
                content: '系统错误',
                cancelText: '取消',
                detailLabelWidth: "120px",
                detailShow: false,
                errorData: {
                    errorCode: "",
                    errorDetail: "",
                    errorMessage: "",
                }
            }
        },
        computed: {},
        mounted() {
            //console.log(1111);
        },
        methods: {
            cancel() {
                this.show = false;
            }
        }
    }
</script>
<style lang="scss" scoped>

</style>