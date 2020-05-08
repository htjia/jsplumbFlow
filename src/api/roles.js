import request from '@/utils/request'

// 查询
export function roles(params) {
  return request({
    url: '/role/query',
    method: 'get',
    params
  })
}

// 新增
export function add(params) {
  return request({
    url: '/role/add',
    method: 'post',
    data: params
  })
}

// 修改
export function update(params) {
  return request({
    url: '/role/add',
    method: 'post',
    params
  })
}

// 删除
export function remove(params) {
  return request({
    url: `/role/${params}/delete`,
    method: 'delete'
  })
}
// 获取所有菜单列表
export function menus(params) {
  return request({
    url: '/Menu/list',
    method: 'get',
    params
  })
}
