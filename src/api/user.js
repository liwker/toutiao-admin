/*
  用户相关请求模块
*/
import { request } from '@/utils/request.js'

// 用户登录
export const login = (user) => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/authorizations',
    data: user
  })
}

// 获取用户信息
export const getUserProfile = () => {
  // token在请求拦截器中设置了
  return request({
    method: 'GET',
    url: '/mp/v1_0/user/profile'
  })
}

// 修改用户头像,data 为FromData对象
export const updateUserPhoto = data => {
  return request({
    method: 'PATCH',
    url: '/mp/v1_0/user/photo',
    data
  })
}

// 修改用户基本信息
export const updateUserProfile = data => {
  return request({
    method: 'PATCH',
    url: '/mp/v1_0/user/profile',
    data
  })
}

// 获取粉丝信息
export const getFans = (page, perPage) => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/followers',
    params: {
      page,
      per_page: perPage
    }
  })
}
