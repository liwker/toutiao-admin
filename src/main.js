import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 引入Element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 加载全局样式文件
import './styles/index.less'

// 应用插件
Vue.use(ElementUI)

// 关闭生产提示
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
