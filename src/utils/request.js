// 基于 axios 封装的请求模块
import axios from 'axios'

// 创建 axios实例
const request = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net' // 请求的基础路径
})
// request.default.baseURL = 'xxx'  // 同样效果

const myRequest = axios.create({
  baseURL: 'https://gitee.com/api/v5/repos/' // 请求的基础路径
})

// 请求拦截器
request.interceptors.request.use(
  // config 是当前请求相关的配置信息对象，是可以修改的
  function (config) {
    // 获取token
    const user = JSON.parse(window.localStorage.getItem('user'))

    // 如果有登录信息了，则统一设置 token
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }

    // return config之后才能发送请求
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

// 响应拦截器

export { request, myRequest }
