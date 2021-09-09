<template>
  <el-container class="layout-container">
    <el-aside
      :width="asideWidth"
      class="aside"
    >
      <!-- 侧边栏 -->
      <app-aside class="aside-menu" :isCollapse="isCollapse"></app-aside>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div>
          <i
            class="pointer"
            :class="{
              'el-icon-s-unfold': isCollapse,
              'el-icon-s-fold': !isCollapse
            }"
            @click="zhedie"
          ></i>
          个人练习测试~
        </div>
        <!-- 头像块 -->
        <el-dropdown>
          <div class="avatar-wrap">
            <img :src="userInfo.photo" alt="头像">
            <span>{{userInfo.name}}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>设置</el-dropdown-item>
            <el-dropdown-item @click.native="onLogout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main class="main">
        <!-- 子路由出口 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import appAside from './components/aside.vue'
import { getUserProfile } from '@/api/user.js'

export default {
  name: 'LayoutIndex',
  components: { appAside },
  props: {},
  data () {
    return {
      userInfo: {
        photo: require('@/assets/vue.png'),
        name: '007'
      },
      isCollapse: false
    }
  },
  computed: {
    asideWidth () {
      return this.isCollapse ? 'auto' : '200px'
    }
  },
  watch: {},
  created () {
    // 请求获取用户资料
    this.loadUserPrifile()
  },
  mounted () {
    this.$bus.$on('updateUser', ({ name, photo }) => {
      this.userInfo.name = name
      this.userInfo.photo = photo
    })
  },
  beforeDestroy () {
    this.$bus.$off('updateUser')
  },
  methods: {
    // 获取用户信息
    loadUserPrifile () {
      getUserProfile().then(res => {
        // console.log(res)
        this.userInfo.name = res.data.data.name
        this.userInfo.photo = res.data.data.photo
      })
    },
    /* loadUserPrifile () {
      // 先判断本地是否有缓存
      let userInfo = window.localStorage.getItem('user')
      if (userInfo) {
        userInfo = JSON.parse(userInfo)
        this.userInfo.name = userInfo.name
        this.userInfo.photo = userInfo.photo
        return false
      }
      // 发送请求
      getUserProfile().then(res => {
        // userInfo = Buffer.from(res.data.content, 'base64')
        // userInfo = JSON.parse(userInfo.toString()).userProfile

        this.userInfo.name = userInfo.name
        this.userInfo.photo = userInfo.photo
        // 本地缓存
        window.localStorage.setItem('user', JSON.stringify(userInfo))
      }).catch(err => {
        // 失败：
        console.log(err)
        this.$message.error('获取用户信息失败')
      })
    },
 */
    // 折叠导航栏
    zhedie () {
      this.isCollapse = !this.isCollapse
    },

    // 退出登录
    onLogout () {
      this.$confirm('是否登出账号?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 清除用户登录状态
        window.localStorage.removeItem('user')
        // 跳转到登录页面
        this.$router.push('/login')
        // 提示
        this.$message({
          type: 'success',
          message: '登出成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消登出'
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
  .layout-container{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    // 侧边栏
    .aside{
      background-color: #d3dce6;

      .aside-menu{
        height: 100%;
      }
    }

    // 头部区
    .header{
      height: 70px;
      background-color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #ccc;

      // 指向
      .pointer:hover {
        cursor: pointer;
      }

      // 头像
      .avatar-wrap {
        display: flex;
        align-items: center;
        img {
          width: 50px;
          border-radius: 50%;
        }
      }
    }

    // 内容区
    .main{
      background-color: #e9eef3;
    }
  }

</style>
