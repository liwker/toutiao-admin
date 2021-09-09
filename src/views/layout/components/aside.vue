<template>
  <el-menu
    :default-active="$route.path"
    background-color="#002033"
    text-color="#fff"
    active-text-color="#ffd04b"
    class="nav-menu"
    router
    :collapse="isCollapse"
  >
    <h1>后台管理</h1>
    <el-menu-item index="/">
      <i class="el-icon-s-home"></i>
      <span slot="title">首页</span>
    </el-menu-item>

    <el-menu-item index="/article">
      <i class="el-icon-document"></i>
      <span slot="title">内容管理</span>
    </el-menu-item>

    <el-menu-item index="/image">
      <i class="el-icon-picture-outline"></i>
      <span slot="title">素材管理</span>
    </el-menu-item>

    <el-menu-item index="/publish">
      <i class="el-icon-s-promotion"></i>
      <span slot="title">发布文章</span>
    </el-menu-item>

    <el-menu-item index="/comment">
      <i class="el-icon-chat-dot-round"></i>
      <span slot="title">评论管理</span>
    </el-menu-item>

    <el-menu-item index="/fans">
      <i class="el-icon-pie-chart"></i>
      <span slot="title">粉丝管理</span>
    </el-menu-item>

    <el-menu-item index="settings">
      <i class="el-icon-setting"></i>
      <span slot="title">个人设置</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'Aside',
  components: {},
  props: ['isCollapse'],
  data () {
    return {

    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {

  }
}
</script>

<style scoped lang="less">
  .nav-menu {
    // 标题
    h1 {
      color: #fff;
      text-align: center;
      letter-spacing: 3px;
      font-weight: 400;
      font-size: 1.3em;
    }
  }
</style>
