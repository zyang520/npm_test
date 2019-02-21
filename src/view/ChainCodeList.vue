<template>
  <div style="width:100%;height:100%;">
    <TitlePage title="我的应用/链码列表" desc=""></TitlePage>
    <div class="table-container">
      <el-table
              :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
              border
              stripe
              style="width: 100%">
        <el-table-column
                prop="name"
                label="链码名称"
                width="180">
               
        </el-table-column>
        <el-table-column
                prop="version"
                label="当前版本"
                width="180">
        </el-table-column>
        <el-table-column
                prop="condition"
                label="安装情况">
        </el-table-column>
        <el-table-column
                prop="oper"
                label="操作">
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
  data () {
    return {
        currentPage: 1, // 当前页码
        total: 20, // 总条数
        pageSize: 10, // 每页的数据条数
        tableData: [{
            name: 'test1',
            version: 'v`',
            condition: 'pee0.org.test.com安装 未初始化',
            oper:'API访问'
        },{
            name: 'test2',
            version: 'v`',
            condition: 'pee0.org.test.com安装 未初始化',
            oper:'API访问'
        },{
            name: 'test3',
            version: 'v`',
            condition: 'pee0.org.test.com安装 未初始化',
            oper:'API访问'
        },{
            name: 'test4',
            version: 'v`',
            condition: 'pee0.org.test.com安装 未初始化',
            oper:'API访问'
        },{
            name: 'test5',
            version: 'v`',
            condition: 'pee0.org.test.com安装 未初始化',
            oper:'API访问'
        },{
            name: 'test6',
            version: 'v`',
            condition: 'pee0.org.test.com安装 未初始化',
            oper:'API访问'
        },{
            name: 'test7',
            version: 'v`',
            condition: 'pee0.org.test.com安装 未初始化',
            oper:'API访问'
        },{
            name: 'test8',
            version: 'v`',
            condition: 'pee0.org.test.com安装 未初始化',
            oper:'API访问'
        },{
            name: 'test9',
            version: 'v`',
            condition: 'pee0.org.test.com安装 未初始化',
            oper:'API访问'
        },{
            name: 'test10',
            version: 'v`',
            condition: 'pee0.org.test.com安装 未初始化',
            oper:'API访问'
        },{
            name: 'test11',
            version: 'v`',
            condition: 'pee0.org.test.com安装 未初始化',
            oper:'API访问'
        }]
    }
    
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

            
        }
        
    }
}
</script>


<style>
  .table-container{margin:20px;}
</style>


