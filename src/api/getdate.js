import request from '@/utils/request'

// 获取对应的menus
export function getResure(params) {
  return request({
    url: `/datasource/${params.pageSize}/${params.pageNum}`,
    method: 'get'
  })
}

export function getdatalist(params) {
  return request({
    url: `/datasource/${params.id}/tables`,
    method: 'get'
  })
}

export function gettablekey(params) {
  return request({
    url: `/datasource/${params.id}/${params.name}/schema`,
    method: 'get'
  })
}
export function getParameterData(params) {
  return request({
    url: '/industryReportController/query',
    method: 'post',
    data: params
  })
}
