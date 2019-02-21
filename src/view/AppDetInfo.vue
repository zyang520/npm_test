<template>
    <div style="width:100%;height:100%;">
     <TitlePage title="我的应用/应用详情" desc=""></TitlePage>
       <div class="base-info">
           <h2>基本信息</h2>
           <ul>
              <li>
                 <span>应用名称：</span>
                 <span>app1</span>
              </li>

              <li>
                 <span>API Key：</span>
                 <span>app1</span>
              </li>

              <li>
                 <span>Secret Key：</span>
                 <span>app1</span>
              </li>

              <li>
                 <span>创建时间：</span>
                 <span>app1</span>
              </li>

              <li>
                 <span>更新时间：</span>
                 <span>app1</span>
              </li>

              <li>
                 <span>客户端组织：</span>
                 <span>app1</span>
              </li>


           </ul>
       
       </div>


       <div class="channel-list">
          <h2>通道列表</h2>
<el-table
             :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
              border
              stripe
              style="width: 100%">
        <el-table-column
                prop="date"
                label="日期-通道"
                width="180">
        </el-table-column>
        <el-table-column
                prop="name"
                label="名称"
                width="180">

                 <template slot-scope="scope">
                    <el-button type="text" size="small" @click="handleAppLink(scope.row)" >{{scope.row.name}}</el-button>
               </template>
        </el-table-column>
        <el-table-column
                prop="address"
                label="地址">
        </el-table-column>
      </el-table>
       

        <div class="block" style="margin-top:15px;float:right;">
            <el-pagination align='center' @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[1,5,10,20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="tableData.length">
            </el-pagination>
        </div>
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
                currentPage: 1, // 当前页码
                total: 20, // 总条数
                pageSize: 10, // 每页的数据条数
               tableData: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
        }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
        }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
        }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
        }]
            }
        },
        mounted () {
            
        },
        methods: {
             handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.currentPage = 1;
            this.pageSize = val;
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.currentPage = val;
            
        },
         handleAppLink(row,id){
        this.$router.push({path:'/chainCodeList',query:{rowData : row}});

        
        }  
        }
    }
</script>


<style>
   .base-info,.channel-list{margin:20px;}
   .base-info h2,.channel-list h2{font-size:18px;font-weight:bold;margin-bottom:10px;}

   .base-info li>span:first-child{display:inline-block;font-size:14px;height:32px;line-height:32px;width:100px;text-align:right;}
</style>


