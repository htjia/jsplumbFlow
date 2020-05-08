import request from '@/utils/request'

// 查询
export function roles(params) {
  return request({
    url: '/FieldType/list',
    method: 'get',
    params
  })
}

// 新增
export function add(params) {
  return request({
    url: '/FieldType/add',
    method: 'post',
    params
  })
}

// 修改
export function update(params) {
  return request({
    url: '/FieldType/update',
    method: 'put',
    params
  })
}

// 删除
export function remove(params) {
  return request({
    url: `/FieldType/delete`,
    method: 'get',
    params
  })
}
