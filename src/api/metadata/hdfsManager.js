import request from '@/utils/request'

// 查询
export function queryhdfs(params) {
  return request({
    url: '/HDFSManagement/list',
    method: 'get',
    params
  })
}

// 新增
export function add(params) {
  return request({
    url: '/HDFSManagement/add',
    method: 'post',
    params
  })
}

// 修改
export function update(params) {
  return request({
    url: '/HDFSManagement/update',
    method: 'put',
    params
  })
}

// 删除
export function remove(params) {
  return request({
    url: `/HDFSManagement/delete`,
    method: 'get',
    params
  })
}
