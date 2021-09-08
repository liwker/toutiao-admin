<template>
  <div class="login-container">
    <div class="login-warp">
      <el-form
        ref="login-form"
        :model="user"
        :rules="formRules"
      >
        <h2>欢迎登录</h2>
        <el-form-item prop="mobile">
          <el-input placeholder="请输入账号" v-model="user.mobile"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input
            type="password"
            placeholder="请输入密码"
            v-model="user.code"
          ></el-input>
        </el-form-item>
        <el-form-item prop="agree">
          <el-checkbox v-model="user.agree">我已阅读并同意用户协议和隐私条款</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="isLoading"
            @click="onLogin"
          >登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/user.js'

export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '13911111111',
        code: '246810',
        agree: false
      },
      formRules: {
        mobile: [
          { required: true, message: '请输入账户', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        agree: [
          {
            // 自定义验证规则
            validator: (rule, value, callback) => {
              if (value) {
                callback()
              } else {
                callback(new Error('请同意用户协议'))
              }
            }
          }
        ]
      },
      isLoading: false
    }
  },
  methods: {
    onLogin () {
      this.$refs['login-form'].validate(valid => {
        if (!valid) {
          // 表单验证失败
          return false
        } else {
          // 验证通过
          this.login()
        }
      })
    },

    login () {
    // 启用loading
      this.isLoading = true

      // 请求api 并做出响应
      login(this.user).then(res => {
        // 成功：
        // console.log(res)
        this.$message.success('登录成功')
        // 本地缓存
        window.localStorage.setItem('user', JSON.stringify(res.data.data))

        // 跳转到首页
        this.$router.push({
          name: 'home'
        })
        this.isLoading = false
      }).catch(err => {
        // 失败：
        console.log(err)
        this.$message.error('登录失败')
        this.isLoading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .login-container {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url('./login_bg.jpg');
    background-repeat: no-repeat;
    background-size: cover;

    .login-warp{
      min-width: 300px;
      padding: 20px 50px 10px;
      background-color: rgba(255, 255, 255, .9);
      box-shadow: 2px 3px 15px rgba(155, 155, 155, .55);
      h2{
        text-align: center;
        font-style: italic;
        color: rgba(91,209,215,1);
        letter-spacing: 2px;
      }
      .el-form{

        .el-form-item{
          // text-align: center;
          .el-button{
            width: 100%;
          }
        }
      }
    }
  }
</style>
