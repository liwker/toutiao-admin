<template>
  <div class="fans-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- /面包屑 -->
      </div>
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="粉丝列表" name="first">
          <el-row :gutter="50">
            <el-col
              style="margin-bottom: 15px;"
              :xs="12" :sm="8" :md="6" :lg="4"
              v-for="(fan, index) of fans"
              :key="index"
            >
              <el-card :body-style="cardStyle">
                <img class="image" :src="fan.photo">
                <div style="font-size: 13px;">{{fan.name}}</div>
                <el-button  type="primary" plain size="mini" class="button">+关注</el-button>
              </el-card>
            </el-col>
          </el-row>
          <!-- 分页 -->
          <el-pagination
            class="pages"
            background
            layout="total, prev, pager, next"
            :total="totalCount"
            :page-size="pageSize"
            :current-page.sync="page"
            @current-change="onPageChange"
          ></el-pagination>
          <!-- 分页 -->
        </el-tab-pane>
        <el-tab-pane label="粉丝画像" name="second">
          <!-- 1.为ECharts准备一个具备大小（宽高）的Dom -->
          <div ref="main" style="width: 600px;height:400px;"></div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

  </div>
</template>

<script>
import { getFans } from '@/api/user.js'
// 2.加载
import echarts from 'echarts'

export default {
  name: 'FansIndex',
  components: {},
  props: {},
  data () {
    return {
      fans: [],
      activeName: 'first',
      cardStyle: { height: '230px', padding: '0px 20px 0px', display: 'flex', 'flex-direction': 'column', 'justify-content': 'space-around', 'align-items': 'center' },
      totalCount: 0, // 总页数
      pageSize: 20, // 每页显示个数
      page: 1 // 当前页码
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadFans()
  },
  mounted () {
    // 3.基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(this.$refs.main)

    // 4.指定图表的配置项和数据
    var option = {
      title: {
        text: '粉丝增长详细'
      },
      tooltip: {},
      legend: {
        data: []
      },
      xAxis: {
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {},
      series: [{
        name: '',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20, 30]
      }]
    }

    // 5.使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
  },
  beforeDestroy () {},
  methods: {
    // 获取粉丝列表
    loadFans (page = 1) {
      // 分页激活页码与请求页码保持一致
      this.page = page
      getFans(page, this.pageSize).then(res => {
        // console.log(res)
        this.totalCount = res.data.data.total_count
        this.fans = res.data.data.results
      })
    },
    // 切页
    onPageChange (page) {
      this.loadFans(page)
    }
  }
}
</script>

<style scoped lang="less">

.image {
  width: 75%;
  border-radius: 50%;
  display: block;
}

.button {
  width: 72px;
  height: 35px;
  font-size: 13px;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both;
}

// 页码
.pages {
  float: right;
  margin: 20px auto 15px;
}
</style>
