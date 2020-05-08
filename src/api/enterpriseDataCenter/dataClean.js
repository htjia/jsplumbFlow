import request from '@/utils/request'

export function add(params) {
  return request({
    url: '/dataflow',
    method: 'post',
    data: params
  })
}
export function updata(params) {
  return request({
    url: '/dataflow',
    method: 'put',
    data: params
  })
}
export function remove(id) {
  return request({
    url: `/dataflow/${id}`,
    method: 'delete'
  })
}
// 运行
export function runFLow(params) {
  return request({
    url: '/flow/test',
    method: 'post',
    data: params
  })
}
// 查询
export function query(params) {
  return request({
    url: `/dataflow/${params.pageNum}/${params.pageSize}`,
    method: 'get',
    params
  })
}
// -------------------- km --------------
// 查询
export function analysisQuery(params) {
  return request({
    url: `/analysisflow/${params.pageNum}/${params.pageSize}`,
    method: 'get',
    params
  })
}
export function analysisAdd(params) {
  return request({
    url: '/analysisflow',
    method: 'post',
    data: params
  })
}
export function analysisUpdata(params) {
  return request({
    url: '/analysisflow',
    method: 'put',
    data: params
  })
}
export function analysisRemove(id) {
  return request({
    url: `/analysisflow/${id}`,
    method: 'delete'
  })
}
export function analysisRun(params) {
  return request({
    url: `/analysisflow/run/${params.flowId}`,
    method: 'post',
    data: params
  })
}
// test run
export function testRun(params) {
  return request({
    url: `/analysisflow/run/demo/${params.flowId}`,
    method: 'post',
    data: params
  })
}

