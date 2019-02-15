<template>
  <div class="whole-page" style="margin-top:-1px;">
    <div class="wrap">
      <div class="login_wrap container" id="login_wrap">
        <!--  左侧 -->
        <div class="border_side row" id="border_side">
          <div class="login-module col-md-4 col-sm-12 col-xs-12 row" id="login">
            <div class="logoWrap col-md-12 col-sm-12 col-xs-12">
              <a class="logo hidden-xs" href="##">
                <img class="img-responsive" src="@/assets/images/logo-95.png" style="max-height: 45px;margin-left:20px; margin-top: 3px;display:inline-block;" alt="LOGO">
                <span  style="color:#0d467b;vertical-align: -7px;font-size:22px;">区块链链码开发中心</span>
              </a>

            </div>

              <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="login-form">
                <el-form-item prop="username">
                  <p class="label">账号：</p>
                  <el-input  v-model="ruleForm.username" value="" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <p class="label">密码：</p>
                  <el-input type="password"  v-model="ruleForm.password" placeholder="密码" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>

                <div class="login-btn">
                  <el-button type="primary" @click="submitForm('ruleForm')"  v-loading.fullscreen.lock="fullscreenLoading">登录</el-button>
                </div>
              </el-form>



          </div>
        </div>


      </div>
    </div>

    <footer id="fotb" style="width:100%;height:60px;position:fixed;bottom:0;color:#fff;line-height: 60px;">
      <div id="copyright" class="container">
        <p class="ver_wrap"><span style="text-align: center;">© 版权所有 |</span>
          <span style="text-align: center;"><a href="http://www.richwaytec.com">远光软件技术有限公司 |</a></span><a href="http://www.richwaytec.com">
            <span style="margin-left:10px;">京ICP备17058539号</span>
          </a></p><a href="http://www.richwaytec.com">
      </a></div><a href="http://www.richwaytec.com">
    </a></footer>
  </div>
</template>

<script>
  import md5 from 'js-md5';
  import * as types from '@/store/types';
export default {
    data() {
        return {
            ruleForm: {
                username: '',
                password: ''
            },
            rules: {
                username: [{required: true, message: '请输入账号', trigger: 'blur'}],
                password: [{required: true, message: '请输入密码', trigger: 'blur'}]
            },
            fullscreenLoading: false
        }
    },
    mounted() {
        this.$store.commit(types.TITLE, 'Login');
    },
    methods: {
        submitForm(formName) {
            const self = this;
            self.$refs[formName].validate(valid => {
                if (valid) {
                    var qs = require('qs');
                    var datas = {
                        loginName: self.ruleForm.username,
                        loginPassWord: self.ruleForm.password
                    };
                    this.fullscreenLoading = true;


                }

            });

            this.$http({
                url:'/demo/user/login',
            }).then(res => {
                if(res.success){
                    self.fullscreenLoading = false;
                    localStorage.setItem('userName', res.data.userName);
                    localStorage.setItem('accessToken', res.data.token);
                    this.$store.commit(types.LOGIN,  res.data.token)
                    //this.$router.push(this.$route.query.redirect || '/');
                }
            });



        }
    }
}
</script>

<style lang="scss" scoped>
    @import "./css/login.scss";
</style>


