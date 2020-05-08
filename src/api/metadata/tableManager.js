import request from '@/utils/request'

// 查询表
export function queryTables(params) {
  return request({
    url: '/database/tables',
    method: 'get',
    params
  })
}

// 查询表字段
export function queryFieldList(params) {
  return request({
    url: '/database/columns',
    method: 'get',
    params
  })
}
// 获取Spark链接
export function getComputerCenter(params) {
  return request({
    url: '/colony/getComputerCenter',
    method: 'get',
    params
  })
}
// 获取Hadoop链接
export function getDataCenter(params) {
  return request({
    url: '/colony/getDataCenter',
    method: 'get',
    params
  })
}
