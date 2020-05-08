import request from '@/utils/request'

// 查询
export function query(params) {
  return request({
    url: '/metaField/findByTable',
    method: 'get',
    params
  })
}

// 新增
export function add(params) {
  return request({
    url: '/metaField/save',
    method: 'post',
    params
  })
}

// 修改
export function update(params) {
  return request({
    url: '/metaField/update',
    method: 'put',
    params
  })
}

// 删除
export function remove(params) {
  return request({
    url: `metaField/${params}`,
    method: 'delete'
  })
}
// typeList
export function queryType(params) {
  return request({
    url: 'FieldType/list',
    method: 'get',
    params
  })
}
// 配置标签
export function labelRelations(params) {
  return request({
    url: '/labelRelations/save',
    method: 'post',
    data: params
  })
}
// 配置字段
export function fieldRelations(params) {
  return request({
    url: '/fieldRelations/save',
    method: 'post',
    data: params
  })
}
