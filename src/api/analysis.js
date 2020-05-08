import request from '@/utils/request'

// 获取对应的menus
export function selectall(params) {
  return request({
    url: '/industryReportController/select',
    method: 'get',
    params
  })
}
// 获取对应的menus
export function selectOne(params) {
  return request({
    url: '/industryReportController/selectOne',
    method: 'get',
    params
  })
}

export function addAnalysis(params) {
  return request({
    url: '/industryReportController/add',
    method: 'post',
    data: params
  })
}

export function deleteAnalysis(params) {
  return request({
    url: '/industryReportController/delete',
    method: 'delete',
    params
  })
}

export function updateAnalysis(params) {
  return request({
    url: '/industryReportController/update',
    method: 'put',
    data: params
  })
}
