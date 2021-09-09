<template>
  <div class="image-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>素材管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- /面包屑 -->
      </div>
      <div class="action-head">
        <el-radio-group
          v-model="collect"
          size="mini"
          @change="onCollectChange"
        >
          <el-radio-button
            :label="false"
          >全部</el-radio-button>
          <el-radio-button
            :label="true"
          >收藏</el-radio-button>
        </el-radio-group>
        <el-button
          size="mini"
          type="success"
          @click="dialogUploadVisible = true"
        >上传素材</el-button>
      </div>
      <!-- 素材列 -->
      <el-row :gutter="10">
        <el-col
          :xs="12" :sm="8" :md="6" :lg="4"
          v-for="img of images"
          :key="img.id"
          class="image-item"
        >
          <el-image
            style="height: 100px"
            :src="img.url"
            fit = "cover"
          ></el-image>
          <div class="image-action">
            <el-button
            type="warning"
              circle
              size="mini"
              :icon="img.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'"
              :loading="img.loading"
              @click="onCollect(img)"
            ></el-button>
            <!-- <i
             :class="{
               'el-icon-star-on': img.is_collected,
               'el-icon-star-off': !img.is_collected
             }"
             @click="onCollect(img)"
            ></i> -->
            <i class="el-icon-delete-solid"></i>
          </div>
        </el-col>
      </el-row>
      <!-- /素材列表 -->
    </el-card>
    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="totalCount"
      :page-size="pageSize"
      :current-page.sync="page"
      @current-change="onPageChange"
    ></el-pagination>
    <!-- 分页 -->
    <!-- 上传素材 -->
    <el-dialog
      title="上传素材"
      :visible.sync="dialogUploadVisible"
      :append-to-body="true"
    >
      <el-upload
        class="upload-demo"
        drag
        action="http://api-toutiao-web.itheima.net/mp/v1_0/user/images"
        :headers="uploadHeaders"
        name="image"
        multiple
        :show-file-list="false"
        :on-success="onUploadSuccess"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { getImages, collectImage } from '@/api/image.js'

export default {
  name: 'ImageIndex',
  components: {},
  props: {},
  data () {
    const user = JSON.parse(window.localStorage.getItem('user'))
    return {
      collect: false, // 默认查询全部素材
      images: [], // 图片素材列表
      dialogUploadVisible: false, // 上传图片，弹出层
      uploadHeaders: {
        Authorization: `Bearer ${user.token}`
      },
      totalCount: 0, // 总页数
      pageSize: 12, // 每页显示个数
      page: 1 // 当前页码
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadImages()
  },
  mounted () {},
  methods: {
    loadImages (page = 1) {
      this.page = page
      getImages({
        collect: this.collect,
        page,
        per_page: this.pageSize
      }).then(res => {
        // console.log(res)
        const results = res.data.data.results
        // 给每个素材对象添加 loading 状态
        for (const img of results) {
          img.loading = false
        }
        this.images = results
        this.totalCount = res.data.data.total_count
      })
    },
    // 切换素材
    onCollectChange () {
      this.loadImages()
    },
    // 上传图片成功
    onUploadSuccess () {
      // 关闭对话框
      this.dialogUploadVisible = false
      // 更新列表
      this.loadImages()
      this.$message.success('上传成功')
    },
    // 切页
    onPageChange (page) {
      this.loadImages(page)
    },
    // 收藏
    onCollect (img) {
      // 展示 loading
      img.loading = true
      collectImage(img.id, !img.is_collected).then(res => {
        // console.log(res)
        img.is_collected = !img.is_collected
        img.loading = false
      })
    }
  }
}
</script>

<style scoped lang="less">
.action-head {
  padding-bottom: 20px;
  display: flex;
  justify-content: space-between;
}
.image-item {
  position: relative;

  .image-action {
    height: 30px;
    background-color: rgba(204,204,204,.5);
    position: absolute;
    bottom: 4px;
    left: 5px;
    right: 5px;
    font-size: 18px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    color: #fff;
  }
}
</style>
