import Vue from 'vue'
import VueRouter from 'vue-router'
// 在 Vue-cli 创建的项目中 @ 表示 src，是src的别名
import Login from '@/views/login/'
import Home from '@/views/home/'
import Layout from '@/views/layout/'
import Article from '@/views/article/'

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
  const login = JSON.parse(window.localStorage.getItem('login'))
  if (to.path !== '/login') {
    if (login) {
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
