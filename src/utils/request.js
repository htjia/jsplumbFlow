import axios from 'axios'
// import { Message, MessageBox } from 'element-ui'
import { Message } from 'element-ui'
import store from '../store'
// import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API // api 的 base_url
  // timeout: 10000 // 请求超时时间
})
// request拦截器
service.interceptors.request.use(
  config => {
    // config.headers['Access-Control-Allow-Origin'] = '*'
    // config.headers['Access-Control-Allow-Credentials'] = true
    // config.headers['Access-Control-Allow-Methods'] = 'PUT,POST,GET,DELETE,OPTIONS'
    if (config.method === 'post') {
      config.headers['Content-Type'] = 'application/json'
      const href = window.location.href.substring(window.location.href.lastIndexOf('/') + 1)
      let flag = false
      if (href === 'productionManageInfo') {
        flag = true
      } else if (href === 'testInfo') {
        flag = true
      }
      if (flag) {
        const rowinfo = sessionStorage.getItem('rowinfo')
        if (rowinfo !== undefined && rowinfo !== null) {
          const dataInfo = JSON.parse(rowinfo)
          config.headers['taskId'] = dataInfo.taskId
          config.headers['taskStateId'] = dataInfo.taskStateId
        }
      }
    }
    if (sessionStorage.getItem('User-Id') !== undefined && sessionStorage.getItem('User-Id') !== null) {
      config.headers['userId'] = sessionStorage.getItem('User-Id')
    }
    if (store.getters.token) {
      // config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    // code为非0是抛错
    const res = response.data
    if (res.code !== 0 && res.code !== 5009 && res.code !== 999 && res.code < 8000) {
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(res.message)
    } else if (res.code === 999) {
      sessionStorage.setItem('outof', res.message)
      setTimeout(() => {
        store.dispatch('LogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      }, 1000)
    } else {
      return response.data
    }
  },
  error => {
    if (error.response.status !== 404) {
      console.log('err' + error) // for debug
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
