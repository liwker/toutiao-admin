// 基于 axios 封装的请求模块
import axios from 'axios'

// 创建 axios实例
const request = axios.create({
  baseURL: 'https://ttapi.research.itcast.cn/' // 请求的基础路径
})
// request.default.baseURL = 'xxx'  // 同样效果

const myRequest = axios.create({
  baseURL: 'https://gitee.com/api/v5/repos/' // 请求的基础路径
})

// 请求拦截器
/* myRequest.interceptors.request.use(
  function (config) {
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
) */

// 响应拦截器

export { request, myRequest }
