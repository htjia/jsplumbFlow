import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权

const whiteList = ['/login', '/publicView'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  sessionStorage.removeItem('publicView')
  if ((to.path).indexOf('/publicView/index') > -1) {
    sessionStorage.setItem('publicView', to.path)
  }
  if (getToken()) { // 判断是否有token
    if (to.path === '/login') {
      next({ path: '/' })
      // 如果当前页面是仪表板，则不会在每个钩子之后触发，因此手动处理它。
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetInfo').then(res => { // 拉取用户信息
          // next()
          const roles = ['admin']// res.data // note: roles must be a array! such as: ['editor','develop']
          // console.log('获取成功')
          // const roles = ['externalLink', 'uploadLog', 'department', 'departmentDetail', 'post', 'roles', 'listDetail', 'user',
          //   'equipment', 'equipmentRecommend', 'apiToken', 'equipmentDetail', 'parameterRecommend', 'forecast', 'forecastDetail', 'report', 'metadataManager', '']
          // const roles = ['equipmentRecommend', 'report', 'uploadLog']
          store.dispatch('GenerateRoutes', { roles }).then(() => { // 根据roles权限生成可访问的路由表
            const item = store.getters.addRouters
            router.addRoutes(item) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          })
          next()
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({ path: '/' })
          })
        })
      } else { // 当有用户权限的时候，说明所有可访问路由已生成 如访问没权限的全面会自动进入404页面
        next()
      }
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      // next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      next('/login') // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
