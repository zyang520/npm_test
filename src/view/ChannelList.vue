<template>
  <div style="width:100%;height:100%;">
    <TitlePage title="我的应用/通道列表" desc=""></TitlePage>
    <div class="table-container">
      <el-table
              :data="tableData"
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
                label="姓名"
                width="180">
        </el-table-column>
        <el-table-column
                prop="address"
                label="地址">
        </el-table-column>
      </el-table>



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
  }
}
</script>


<style>
  .table-container{margin:20px;}
</style>


