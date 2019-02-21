<template>
  <div class="header" id="header">
       <div class="header-container">
          <div class="header-left">
             <img src="@/assets/images/logo-95.png">
             <div class="letter">
               <p class="title">区块链链码开发中心</p>
             </div>


              <el-menu router :default-active="$route.path" class="el-menu-demo" mode="horizontal">
                  <el-menu-item index="/myApp">我的应用</el-menu-item>
                  <el-menu-item index="/dd">日志</el-menu-item>
                  <el-menu-item  index="/chainCodeList">链码列表</el-menu-item>
                  <el-menu-item index="/channelList">通道列表</el-menu-item>
              </el-menu>


          </div>

          <div class="header-right">
              <div class="header-right">
                  <el-dropdown   @command="handleLogout">
              <span class="el-dropdown-link">
                欢迎您，杨志<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
                      <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item  command="logOut" >注销</el-dropdown-item>
                      </el-dropdown-menu>
                  </el-dropdown>


              </div>



          </div>

       </div>
  </div>



</template>


<script>
    export default {
        data() {
            return {
                activeIndex: '0'

            };
        },
        methods: {
            handleLogout(command){   //登录退出
                if(command == 'logOut'){
                    this.$http({
                        method:'get',
                        url:'/demo/user/loginOut',
                    }).then(res => {
                        if(res.success == true){
                            localStorage.removeItem('userName');
                            localStorage.removeItem('accessToken');
                            this.$router.push(this.$route.query.redirect || '/');
                            window.location.reload();
                        }
                    });
                }
            }
        }
    }

</script>




<style lang="scss" scoped>
    .el-menu{
        background-color: transparent;
        float:left;
        margin-left:100px;
    }
    .el-menu--horizontal>.el-menu-item{
        color:#fff;
    }

    .el-menu.el-menu--horizontal{
        border-bottom:none;
    }
  .header{
      background-color: #108ee9;
      -webkit-box-shadow:0px 0px 10px 1px #999;;
      box-shadow: 0px 0px 10px 1px #999;
      width:100%;
      height:60px;
      z-index: 100;

     .header-container:after{
         content:"";clear:both;display:block;
     }
    .header-left{
      margin-left:15px;
      float:left;
      img{float:left;margin:5px;height:38px;margin-top: 12px;}
      .letter{float:left;
        >P.title{color:#fff;font-size:20px;border-left:none;padding-top:16px;}
        >p.sub-title{color:#fff;font-size: 12px;}
      }
    }
    .logo-title{
       color:#000;

    float: left;
    height: 50px;
    padding: 15px 15px;
    font-size: 18px;
    line-height: 20px;
    }

    .header-right{
      float:right;
      margin-right:15px;
      line-height: 60px;

      .right-icon{
         display:inline-block;
         a{
             color:#fff;
             margin-left:8px;
             margin-right:8px;
         }

      }
    }



    .header-nav{
      li{
        float:left;
        line-height:52px;

        a{
          color:#fff;
          padding-left:15px;
          padding-right:15px;
          display:inline-block;
          height:100%;
        }
      }
    }
  }

  .el-dropdown{
    line-height:52px;
    color:#fff;
    outline:none;
  }



    .el-menu--horizontal>.el-menu-item.is-active {
        border-bottom: 2px solid #409EFF;
        color: #303133;
        background: #fff;
        color: #333 !important;
    }


  body.page-sidebar-right-show .header-right{margin-right:235px;}





</style>
