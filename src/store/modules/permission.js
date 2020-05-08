import { asyncRouterMap, constantRouterMap } from '@/router'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
// function hasPermission(roles, route) {
//   if (route.meta && route.meta.roles) {
//     return roles.some(role => route.meta.roles.includes(role))
//   } else {
//     return true
//   }
// }

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param roles
 */
// function filterAsyncRouter(routes, roles) {
//   const res = []
//
//   routes.forEach(route => {
//     const tmp = { ...route }
//     if (hasPermission(roles, tmp)) {
//       if (tmp.children) {
//         tmp.children = filterAsyncRouter(tmp.children, roles)
//       }
//       res.push(tmp)
//     }
//   })
//
//   return res
// }

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const item = asyncRouterMap
        // const menu = sessionStorage.getItem('menu')
        // if (menu !== undefined && menu !== null) {
        //   const menus = JSON.parse(menu)
        //   for (let i = 1; i < item.length; i++) {
        //     let flag = true
        //     for (const me of menus) {
        //       if (me.router === item[i].path.substring(1)) {
        //         flag = false
        //         if (me.childList.length > 0) {
        //           for (let ii = 0; ii < item[i].children.length; ii++) {
        //             let flag1 = true
        //             for (const me1 of me.childList) {
        //               if (me1.router === item[i].children[ii].path) {
        //                 flag1 = false
        //                 if (me1.childList.length > 0) {
        //                   if (me1.router === 'mixtureRatio' || me1.router === 'historySearch') {
        //                     ii++
        //                     flag1 = false
        //                     break
        //                   }
        //                   if (me1.router === 'productionManage' || me1.router === 'test') {
        //                     if (me1.childList.length === 2) {
        //                       ii++
        //                       flag1 = false
        //                       break
        //                     } else {
        //                       ii++
        //                       flag1 = false
        //                       break
        //                     }
        //                   }
        //                   for (let iii = 0; iii < item[i].children[ii].children.length; iii++) {
        //                     let flag2 = true
        //                     for (const me2 of me1.childList) {
        //                       if (me2.router === item[i].children[ii].children[iii].path) {
        //                         flag2 = false
        //                         break
        //                       }
        //                     }
        //                     if (flag2) {
        //                       item[i].children[ii].children.splice(iii, 1)
        //                       iii--
        //                     }
        //                   }
        //                 } else {
        //                   flag1 = false
        //                   break
        //                 }
        //               }
        //             }
        //             if (flag1) {
        //               item[i].children.splice(ii, 1)
        //               ii--
        //             }
        //           }
        //         } else {
        //           flag = false
        //           break
        //         }
        //       }
        //     }
        //     if (flag) {
        //       item.splice(i, 1)
        //       i--
        //     }
        //   }
        // }
        commit('SET_ROUTERS', item)
        resolve()
      })
    }
  }
}

export default permission
