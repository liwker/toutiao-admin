<template>
  <div class="comment-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>评论管理</span>
      </div>
      <el-table :data="articles" style="width: 100%">
        <el-table-column prop="title" label="标题" width="180">
        </el-table-column>
        <el-table-column prop="total_comment_count" label="总评论数">
        </el-table-column>
        <el-table-column prop="fans_comment_count" label="粉丝评论数据">
        </el-table-column>
        <el-table-column label="评论状态">
          <template slot-scope="scope">
            {{scope.row.comment_status ? '正常' : '关闭'}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 开关组件绑定的数据是一个布尔值，它会根据布尔值的真假来决定开关状态 -->
            <el-switch
              v-model="scope.row.comment_status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :disabled="scope.row.statusDisabled"
              @change="onStatusChange(scope.row)"
            >
            </el-switch>
          </template>
          <!-- <template>
            <el-button type="primary">修改</el-button>
          </template> -->
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        class="pages"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page.sync="page"
        :page-sizes="[10,20,50,100]"
        :page-size.sync="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        background=""
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getArticles, updateCommentStatus } from '@/api/article'

export default {
  name: 'CommentIndex',
  components: {},
  props: {},
  data () {
    return {
      articles: [], // 文章列表（文章的评论数据字段）
      totalCount: 0, // 总数据条数
      pageSize: 10, // 每页个数
      page: 1 // 当前激活的页码
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticles()
  },
  mounted () {},
  methods: {
    loadArticles (page = 1) {
      // 分页激活页码与请求页码保持一致
      this.page = page
      getArticles({
        response_type: 'comment',
        page,
        per_page: this.pageSize
      }).then(res => {
        // console.log(res)
        const results = res.data.data.results
        for (const comment of results) {
          comment.statusDisabled = false
        }
        this.articles = results
        this.totalCount = res.data.data.total_count
      })
    },
    // 修改状态
    onStatusChange (article) {
      // 禁用开关
      article.statusDisabled = true
      // 提交修改
      updateCommentStatus(article.id.toString(), article.comment_status).then(res => {
        // console.log(res)
        // 启用开关
        article.statusDisabled = false
        this.$message.success(article.comment_status ? '开启成功' : '关闭成功')
      })
    },
    // 页跳转
    handleCurrentChange (page) {
      this.loadArticles(page)
    },
    handleSizeChange () {
      this.loadArticles(1)
    }
  }
}
</script>

<style scoped lang="less">
// 页码
.pages {
  float: right;
  margin: 20px auto 15px;
}
</style>
