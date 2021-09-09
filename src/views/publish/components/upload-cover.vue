<template>
  <div class="upload-cover">
    <div class="cover-wrap" @click="showCoverSelect">
      <img
        class="cover-image"
        ref="cover-image"
        :src="value"
      >
    </div>

    <el-dialog
      title="选择封面"
      :visible.sync="dialogVisible"
      width="30%"
      append-to-body
    >
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="素材库" name="first">
          素材库内容
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="second">
          <input
            type="file"
            ref="file"
            @change="onFileChange"
          >
          <img ref="preview-image" width="150">
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="onCoverConfirm"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { uploadImage } from '@/api/image'
export default {
  name: 'UploadCover',
  components: {},
  // props: ['cover-image'],
  props: ['value'],
  data () {
    return {
      dialogVisible: false,
      activeName: 'first'
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  beforeDestroy () {},
  methods: {
    showCoverSelect () {
      // 展示弹窗
      this.dialogVisible = true
    },

    handleClick () {

    },
    // 预览上传图片
    onFileChange () {
      // 获取文件对象
      const file = this.$refs.file.files[0]
      // 图片预览
      const blob = window.URL.createObjectURL(file)
      this.$refs['preview-image'].src = blob

      // 防止选择同一图片，不触发 change 事件
      // this.$refs.file.values = ''
    },

    onCoverConfirm () {
      // 如果为上传图片
      if (this.activeName === 'second') {
        const file = this.$refs.file.files[0]
        if (!file) {
          this.$message('请选择图片')
          return
        }
        // 执行上传文件操作
        const fd = new FormData()
        fd.append('image', file)
        uploadImage(fd).then(res => {
          // 关闭弹出层
          this.dialogVisible = false
          // 展示上传图片
          this.$refs['cover-image'].src = res.data.data.url

          // 将图片地址发送给父组件
          // this.$emit('update-cover', res.data.data.url)
          this.$emit('input', res.data.data.url)
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
.cover-wrap {
  width: 150px;
  height: 120px;
  border: 1px solid #000;
  .cover-image {
    height: 100%;
    width: 100%;
  }
}
</style>
