import Vue from 'vue'
import VueRouter from 'vue-router'
// 在 Vue-cli 创建的项目中 @ 表示 src，是src的别名
import Login from '@/views/login/'
import Home from '@/views/home/'
import Layout from '@/views/layout/'
import Article from '@/views/article/'
import Publish from '@/views/publish/'
import Image from '@/views/image/'
import Comment from '@/views/comment/'
import Settings from '@/views/settings/'
import Fans from '@/views/fans/'

Vue.use(VueRouter)

// 路由配置表
const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    // name: 'layout', // 因为有默认子路由，可以不要name
    component: Layout,
    children: [
      {
        path: '', // 默认子路由
        name: 'home',
        component: Home
      },
      {
        path: '/article',
        name: 'article',
        component: Article
      },
      {
        path: '/publish',
        name: 'publish',
        component: Publish
      },
      {
        path: '/image',
        name: 'image',
        component: Image
      },
      {
        path: '/comment',
        name: 'comment',
        component: Comment
      },
      {
        path: '/settings',
        name: 'settings',
        component: Settings
      },
      {
        path: '/fans',
        name: 'fans',
        component: Fans
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
  // 是否登录了
  const user = JSON.parse(window.localStorage.getItem('user'))
  // 只要不是访问登录界面，就要验证
  if (to.path !== '/login') {
    if (user) {
      // 已登录
      next()
    } else {
      // 没有登录
      next('/login')
    }
  } else {
    next()
  }
})

export default router
