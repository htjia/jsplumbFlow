import request from '@/utils/request'

export function login(account, password) {
  return request({
    url: '/tUserRoleMixController/logOn',
    method: 'get',
    params: {
      account,
      password
    }
  })
}

// 获取对应的menus
export function getMeuns(params) {
  return request({
    url: '/tPrivilegeController/getUserTree',
    method: 'get',
    params
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function licenseInfo() {
  return request({
    url: '/license/info',
    method: 'get'
  })
}
