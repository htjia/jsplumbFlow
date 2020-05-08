import request from '@/utils/request'

export function add(params) {
  return request({
    url: '/datasource',
    method: 'post',
    data: params
  })
}
// 测试连接
export function test(params) {
  return request({
    url: '/datasource/test',
    method: 'post',
    data: params
  })
}
export function updata(params) {
  return request({
    url: '/datasource',
    method: 'put',
    data: params
  })
}
export function remove(id) {
  return request({
    url: `/datasource/${id}`,
    method: 'delete'
  })
}
// 查询
export function query(params) {
  return request({
    url: `/datasource/${params.pageNum}/${params.pageSize}`,
    method: 'get',
    params
  })
}
// 查询数据下所有表
export function queryTable(id) {
  return request({
    url: `/datasource/${id}/tables`,
    method: 'get'
  })
}
// 提交步骤
export function flowInput(params) {
  return request({
    url: `/flow/input/${params.flowId}/${params.id}`,
    method: 'post',
    data: params
  })
}

// 获取表的数据
export function queryTableData(params) {
  return request({
    url: `/datasource/${params.id}/data`,
    method: 'post',
    data: params
  })
}
// 获取表的字段
export function queryTableFiled(params) {
  return request({
    url: `/datasource/${params.datasource_id}/${params.table_name}/schema`,
    method: 'get',
    params
  })
}
// 获取函数
export function queryFunList(params) {
  return request({
    url: `/expression/func/infos`,
    method: 'get',
    params
  })
}
// 获取上传的文件
export function findFillByDataId(params) {
  return request({
    url: `/attachment/findByDataId`,
    method: 'get',
    params
  })
}
// 删除上传的文件
export function deleteFile(params) {
  return request({
    url: `/attachment/deleteById`,
    method: 'delete',
    params
  })
}
