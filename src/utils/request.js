// 基于 axios 封装的请求模块
import axios from 'axios'
import JSONbig from 'json-bigint'
import router from '@/router'
import { Message } from 'element-ui'

// 创建 axios实例
const request = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net', // 请求的基础路径
  // request.default.baseURL = 'xxx'  // 同样效果

  // 定义后端返回的原始数据的处理
  transformResponse: [function (data) {
    // axios 默认使用JSON.parse来处理
    try {
      return JSONbig.parse(data)
    } catch (err) {
      // console.log('转化失败', err)
      return data
    }
  }]
})

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
request.interceptors.response.use(function (response) {
  // 所有响应码为 2xx 的响应进入
  return response
}, function (error) {
  const status = error.response.status
  // 任何不是 2xx 的响应码都会进入
  console.log('状态码异常')
  if (error.response && status === 401) {
    // 清除本地存储中的用户状态
    window.localStorage.removeItem('user')
    // 跳转到登录页面
    router.push('/login')
    // 提示
    Message('登录状态无效，请重新登录')
  } else if (status === 403) {
    // 没有操作权限
    Message('没有操作权限')
  } else if (status === 400) {
    // 客户端参数出错
    Message('参数错误，请检查请求参数')
  } else if (status >= 500) {
    // 服务端
    Message('服务端内部异常，请稍后重试')
  }
  return Promise.reject(error)
})

export { request, myRequest }
