import request from '@/utils/request'

// 查询
export function getList(params) {
  return request({
    url: '/user/list',
    method: 'get',
    params
  })
}

// 添加用户
export function add(params) {
  return request({
    url: '/user/add',
    method: 'post',
    params
  })
}

// 修改用户
export function update(params) {
  return request({
    url: '/user/update',
    method: 'post',
    params
  })
}

// 删除用户
export function remove(params) {
  return request({
    url: `/user/${params}/delete`,
    method: 'delete'
  })
}

// 修改密码
export function updatePwd(params) {
  return request({
    url: '/user/updatePwd',
    method: 'put',
    params
  })
}

// 详细信息
export function configInfo(id) {
  return request({
    url: `/user/${id}/detail`,
    method: 'get'
  })
}

// 配置ing
export function saveUserDetail(params) {
  return request({
    url: '/user/SaveUserDetail',
    method: 'post',
    data: params
  })
}
// 重置密码
export function restPassWord(params) {
  return request({
    url: '/user/restPassWord',
    method: 'post',
    params
  })
}
