<template>
  <div class="home-container">
    <!-- 1.为ECharts准备一个具备大小（宽高）的Dom -->
    <div
      ref="main"
      style="width: 600px; height: 400px; top: 50%; transform: translateY(-55%); left: 40px"
    ></div>
    <div v-show="!flag" class="loading">
      <span>数据加载中</span>
      <el-image v-loading="loading" style="height: 100%;"></el-image>
    </div>
  </div>
</template>

<script>
import { getArticleChannels, getArticles } from '@/api/article.js'
// 2.加载
import echarts from 'echarts'

export default {
  name: 'HomeIndex',
  components: {},
  props: {},
  data () {
    return {
      channels: [], // 文章频道列表
      flag: false,
      loading: true
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadChannels()
  },
  mounted () {
    let timer = setInterval(() => {
      if (this.flag) {
        // 3.基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(this.$refs.main)
        var data = this.genData(this.channels.length)
        // console.log(data)
        var option = {
            title: {
                text: '各频道文章统计',
                subtext: '',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
                type: 'scroll',
                orient: 'vertical',
                right: 10,
                top: 20,
                bottom: 20,
                data: data.legendData,
                selected: data.selected
            },
            series: [
                {
                    name: '频道',
                    type: 'pie',
                    radius: '55%',
                    center: ['40%', '50%'],
                    data: data.seriesData,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        }
        // 5.使用刚指定的配置项和数据显示图表。
        myChart.setOption(option)

        clearInterval(timer)
      }
    }, 250)
  },
  methods: {
    // 获取频道
    loadChannels () {
      getArticleChannels().then(res => {
        // console.log(res)
        this.channels = res.data.data.channels
        this.loadChannelsCount()
      })
    },
    // 获取各频道文章数
    loadChannelsCount () {
      for (let i = 0; i < this.channels.length; i++) {
        getArticles({
          channel_id: this.channels[i].id
        }).then(res => {
          // 给每个频道添加总文章数
          this.channels[i].totalCount = res.data.data['total_count']
        }).then(() => {
          if (i === this.channels.length-1) {
            this.flag = true
          }
        })
      }
    },
    // 设置图表参数
    genData (count) {
      var legendData = [];
      var seriesData = [];
      var selected = {};
      for (let i = 0; i < count; i++) {
          let name = this.channels[i].name
          let value = this.channels[i].totalCount
          console.log(value)
          legendData.push(name);
          seriesData.push({
              name,
              value
          });
          selected[name] = i < count;
      }

      return {
          legendData: legendData,
          seriesData: seriesData,
          selected: selected
      }
    }
  }
}
</script>

<style scoped lang="less">
.home-container {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  padding: 20px;
  background-color: #fff;
  background-image: url("https://bu.dusays.com/2021/09/10/e70b1207bd238.png");
  background-repeat: no-repeat;
  background-size: 70%;
  background-position: bottom right;
  background-clip: content-box;
  background-origin: content-box;
}
.loading {
  width: 200px;
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  left: 30%;
  transform: translate(-100%, -120%);
  top: 50%;
}
</style>
