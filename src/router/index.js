import Vue from 'vue'
import VueRouter from 'vue-router'
// 在 Vue-cli 创建的项目中 @ 表示 src，是src的别名
import Login from '@/views/login/'

Vue.use(VueRouter)

// 路由配置表
const routes = [
  {
    path: '/',
    component: Login
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  }
]

const router = new VueRouter({
  routes
})

export default router
