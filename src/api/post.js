import request from '@/utils/request'

// 查询
export function postList(params) {
  return request({
    url: '/station/query',
    method: 'post',
    params
  })
}

// 新增
export function add(params) {
  return request({
    url: '/station/save',
    method: 'post',
    params
  })
}

// 删除
export function remove(params) {
  return request({
    url: `/station/${params.id}/delete`,
    method: 'delete',
    params
  })
}
