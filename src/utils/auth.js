// import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const UserIdKey = 'User-Id'

export function getToken() {
  // return Cookies.get(TokenKey)
  return sessionStorage.getItem(TokenKey)
}

export function setToken(token) {
  // return Cookies.set(TokenKey, token)
  return sessionStorage.setItem(TokenKey, token)
}

export function removeToken() {
  // return Cookies.remove(TokenKey)
  return sessionStorage.removeItem(TokenKey)
}

export function getUserId() {
  return sessionStorage.getItem(UserIdKey)
}
export function removeUserId() {
  return sessionStorage.removeItem(UserIdKey)
}
export function setUserId(id) {
  return sessionStorage.setItem(UserIdKey, id)
}
