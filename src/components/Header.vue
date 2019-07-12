<template>
    <div class="header" id="header">
        <div class="header-container">
            <div class="header-left">
                <img src="@/assets/images/logo-95.png">
                <div class="letter">
                    <p class="title">链码中心</p>
                </div>
                <el-menu router
                         :default-active="activeMenuIndex"
                         class="el-menu-demo"
                         @select="handleSelect"
                         mode="horizontal"
                         :router="use_router">
                    <el-menu-item index="1" :route="{path: '/app'}">我的链</el-menu-item>
                    <el-menu-item index="2" :route="{path: '/transactionLog'}">日志</el-menu-item>
                    <!--<el-menu-item index="3">链码中心</el-menu-item>-->
                </el-menu>
            </div>
            <div class="header-right">
                <div class="header-right">
                    <el-dropdown @command="handleLogout">
              <span class="el-dropdown-link">
                欢迎您，<span>{{ userName }}</span><i class="el-icon-arrow-down el-icon--right"></i>
              </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="logOut">注销</el-dropdown-item>
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
                activeMenuIndex: '',
                use_router: false,
                userName: localStorage.getItem('userName')
            };
        },
        watch: {
            //监听当前的菜单
            '$store.state.activeMenuIndex': 'updateActiveMenu'
        },
        methods: {
            updateActiveMenu() {
                console.log("updateActiveMenu");
                this.activeMenuIndex = this.$store.state.activeMenuIndex;
            },
            getCurrentIndex() {
                return 1;
            },
            handleLogout(command) {   //登录退出
                if (command == 'logOut') {
                    localStorage.removeItem('userName');
                    this.$router.push(this.$route.query.redirect || '/login');
                }
            },
            handleSelect(index, keyPath, menuItem) {
                //this.activeMenuIndex = index;
                this.$router.push(menuItem.route);
            }
        }
    }

</script>


<style lang="scss" scoped>
    .el-menu {
        background-color: transparent;
        float: left;
        margin-left: 100px;
    }

    .el-menu--horizontal > .el-menu-item {
        color: #fff;
    }

    .el-menu.el-menu--horizontal {
        border-bottom: none;
    }

    .header {
        background-color: #108ee9;
        -webkit-box-shadow: 0px 0px 10px 1px #999;;
        box-shadow: 0px 0px 10px 1px #999;
        width: 100%;
        height: 60px;
        z-index: 100;

        .header-container:after {
            content: "";
            clear: both;
            display: block;
        }
        .header-left {
            margin-left: 15px;
            float: left;
            img {
                float: left;
                margin: 5px;
                height: 38px;
                margin-top: 12px;
            }
            .letter {
                float: left;
                > P.title {
                    color: #fff;
                    font-size: 20px;
                    border-left: none;
                    padding-top: 16px;
                }
                > p.sub-title {
                    color: #fff;
                    font-size: 12px;
                }
            }
        }
        .logo-title {
            color: #000;

            float: left;
            height: 50px;
            padding: 15px 15px;
            font-size: 18px;
            line-height: 20px;
        }

        .header-right {
            float: right;
            margin-right: 15px;
            line-height: 60px;

            .right-icon {
                display: inline-block;
                a {
                    color: #fff;
                    margin-left: 8px;
                    margin-right: 8px;
                }

            }
        }

        .header-nav {
            li {
                float: left;
                line-height: 52px;

                a {
                    color: #fff;
                    padding-left: 15px;
                    padding-right: 15px;
                    display: inline-block;
                    height: 100%;
                }
            }
        }
    }

    .el-dropdown {
        line-height: 52px;
        color: #fff;
        outline: none;
    }

    .el-menu--horizontal > .el-menu-item.is-active {
        border-bottom: 2px solid #409EFF;
        color: #303133;
        background: #fff;
        color: #333 !important;
    }

    body.page-sidebar-right-show .header-right {
        margin-right: 235px;
    }

</style>
