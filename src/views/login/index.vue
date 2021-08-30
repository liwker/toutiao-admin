<template>
  <div class="login-container">
    <div class="login-warp">
      <el-form ref="form" :model="user">
        <h2>欢迎登录</h2>
        <el-form-item>
          <el-input placeholder="请输入账号" v-model="user.mobile"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input type="password" placeholder="请输入密码" v-model="user.passWord"></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="checked">我已阅读并同意用户协议和隐私条款</el-checkbox>
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
// import request from '@/utils/request.js'

export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '13911111111',
        passWord: '246810'
      },
      checked: false,
      isLoading: false
    }
  },
  methods: {
    /* onLogin () {
      // 启用loading
      this.isLoading = true
      // 获取表单数据
      const user = this.user
      // 请求后端并做出响应
      request({
        method: 'POST',
        url: '/mp/v1_0/authorizations',
        data: user
      }).then(res => {
        // 成功：
        console.log(res)
        this.$message.success('登录成功')
        this.isLoading = false
      }).catch(err => {
        // 失败：
        console.log(err)
        this.$message.error('登录失败：手机号或密码错误')
        this.isLoading = false
      })
    }
  } */

    // 模拟登录
    onLogin () {
      // 启用loading
      this.isLoading = true
      // 获取表单数据
      const user = this.user
      // 请求后端并做出响应
      setTimeout(() => {
        if (user.mobile === '13911111111' && user.passWord === '246810') {
          this.$message.success('登录成功')
        } else {
          this.$message.error('登录失败：手机号或密码错误')
        }
        this.isLoading = false
      }, 1500)
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
