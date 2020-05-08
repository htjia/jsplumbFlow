import request from '@/utils/request'

// 查询
export function labelList(params) {
  return request({
    url: '/metaSource/findTree',
    method: 'get',
    params
  })
}

// 添加
export function add(params) {
  return request({
    url: '/metaSource/save',
    method: 'post',
    params
  })
}
// 修改
export function update(params) {
  return request({
    url: '/metaSource/update',
    method: 'put',
    params
  })
}

// 删除
export function remove(id) {
  return request({
    url: `/metaSource/${id}`,
    method: 'delete',
    params: {
      id
    }
  })
}

// 详情
export function detail(code) {
  return request({
    url: '/metaSource/query',
    method: 'post',
    params: {
      code
    }
  })
}

// 详情
export function initmetatable(isCover) {
  return request({
    url: '/tableHandle/createTable',
    method: 'get',
    params: {
      cover: isCover
    }
  })
}
