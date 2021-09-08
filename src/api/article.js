// 文章相关请求
import { request } from '@/utils/request'

// 获取文章列表
export const getArticles = params => {
  // Body 参数用 data
  // Query 参数用 params
  // Headers 参数用 headers
  return request({
    method: 'GET',
    url: '/mp/v1_0/articles',
    params
  })
}

// 获取文章频道
export const getArticleChannels = () => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/channels'
  })
}

// 删除文章
export const deleteArticle = () => {
  return request({
    method: 'DELETE',
    url: '/mp/v1_0/articles/:target'
  })
}
