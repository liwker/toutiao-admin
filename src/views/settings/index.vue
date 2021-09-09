<template>
  <div class="settings-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- /面包屑 -->
      </div>
      <el-row>
        <el-col :span="16">
          <!-- 个人信息表单 -->
          <el-form
            ref="form"
            :model="user"
            label-width="80px"
            :rules="formRules"
          >
            <el-form-item label="编号">
              {{ user.id }}
            </el-form-item>
            <el-form-item label="手机">
              {{ user.mobile }}
            </el-form-item>
            <el-form-item label="媒体名称" prop="name">
              <el-input v-model="user.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍" prop="intro">
              <el-input type="textarea" v-model="user.intro"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="user.email"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                @click="onUpdateUser"
                :loading="updateProfileLoading"
              >保存</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <!-- 头像 -->
        <el-col :span="6" :offset="2">
          <label for="file" class="pointer">
            <el-avatar
              shape="square"
              :size="150"
              fit="fit"
              :src="user.photo"
            ></el-avatar>
            <p>点击修改头像</p>
          </label>
          <input
            type="file"
            id="file"
            ref="file"
            hidden
            @change="onFileChange"
          />
        </el-col>
      </el-row>
    </el-card>

    <el-dialog
      title="修改头像"
      :visible.sync="dialogVisible"
      append-to-body
      @opened="onDialogOpen"
      @closed="onDialogClosed"
    >
      <div class="preview-image-wrap">
        <img
          class="preview-image"
          :src="previewImage"
          ref="preview-image"
        >
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="onUpdatePhoto"
          :loading="updatePhotoLoading"
        >确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import {
  getUserProfile,
  updateUserPhoto,
  updateUserProfile
} from '@/api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'

export default {
  name: 'SettingsIndex',
  components: {},
  props: {},
  data () {
    return {
      user: { // 用户资料
        email: '',
        id: null,
        intro: '',
        mobile: '',
        name: '',
        photo: ''
      },
      formRules: {
        name: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 7,
            message: '长度在1~7个字符',
            trigger: 'blur'
          }
        ],
        intro: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱地址',
            trigger: 'blur'
          },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ]
      },
      dialogVisible: false, // 控制图片弹出层
      previewImage: '', // 预览图片
      cropper: null, // 裁切器实例
      updatePhotoLoading: false, // 更新头像 loading 状态
      updateProfileLoading: false // 更新基本信息 loading 状态
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadUser()
  },
  mounted () {},
  methods: {
    // 更新基本信息
    onUpdateUser () {
      // 表单验证
      // 提交表单
      this.updateProfileLoading = true
      updateUserProfile(this.user).then(res => {
        this.$message.success('保存成功')
        this.updateProfileLoading = false
        // 传递给顶栏用户信息
        this.$bus.$emit('updateUser', this.user)
      })
    },
    // 获取用户资料
    loadUser () {
      getUserProfile().then(res => {
        // console.log(res)
        this.user = res.data.data
      })
    },
    // 上传头像
    onFileChange () {
      // 处理图片预览
      const file = this.$refs.file
      // 生成blob地址
      const blobData = window.URL.createObjectURL(file.files[0])
      this.previewImage = blobData

      // 展示弹出层，预览图片
      this.dialogVisible = true
      // 清空文件
      this.$refs.file.value = ''
    },
    // 当弹出层出来后，创建剪切
    onDialogOpen () {
      // 获取图片 DOM 节点
      const image = this.$refs['preview-image']
      // 初始化裁切器
      if (this.cropper) {
        // 替换
        this.cropper.replace(this.previewImage)
        return
      }
      this.cropper = new Cropper(image, {
        aspectRatio: 1,
        viewMode: 1,
        dragMode: 'none',
        cropBoxResizable: false,
        movable: true
      })
    },
    // 关闭弹出层后 销毁裁切器
    onDialogClosed () {
      this.cropper.destroy()
    },
    // 更新头像
    onUpdatePhoto () {
      // 更新按钮开始 loading
      this.updatePhotoLoading = true
      // 获取裁切图片对象
      this.cropper.getCroppedCanvas().toBlob(file => {
        const fd = new FormData()
        fd.append('photo', file)
        // 请求提交
        updateUserPhoto(fd).then(res => {
          // console.log(res)
          // 关闭对话框
          this.dialogVisible = false
          // 更新页面
          this.user.photo = window.URL.createObjectURL(file)
          // 用服务端返回的图片进行预览有点慢
          // this.user.photo = res.data.data.photo

          // 关闭 loading 状态
          this.updatePhotoLoading = false
          this.$message.success('更新头像成功')
          this.$bus.$emit('updateUser', this.user)
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.pointer {
  cursor: pointer;
}
.preview-image-wrap {
  .preview-image {
    display: block;
    max-width: 100%;
    height: 200px;
  }
}
</style>
