/*
  用户相关请求模块
*/
import { myRequest } from '@/utils/request.js'

// 用户登录
export const login = () => {
  return myRequest({
    // method: 'POST',
    // url: '/mp/v1_0/authorizations',
    // data: user
    method: 'GET',
    url: 'liwker/data-api/contents/json/toutiao.json'
  })
}

// 获取用户信息
export const getUserProfile = () => {
  return myRequest({
    method: 'GET',
    url: 'liwker/data-api/contents/json/toutiao.json'
  })
}
