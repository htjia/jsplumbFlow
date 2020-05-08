import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'
// 若你想不管路由下面的 children 声明的个数都显示你的根路由
// 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由

/**
* hidden: true                   当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面
* alwaysShow: true               //当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
                                 //只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
                                 //若你想不管路由下面的 children 声明的个数都显示你的根路由
                                 //你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
* redirect: noredirect           当设置 noredirect 的时候该路由在面包屑导航中不可被点击
* name:'router-name'             设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
* meta : {
    title: 'title'               设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             设置该路由的图标
    noCache: true                如果设置为true ,则不会被 <keep-alive> 缓存(默认 false)
    roles: ['admin', 'editor']   设置该路由进入的权限，支持多个权限叠加
}
  }
**/
// const spark = sessionStorage.getItem('spark')
// const hadoop = sessionStorage.getItem('hadoop')
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    // hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'home' }
    }]
  }
]
export const asyncRouterMap = [
  { path: '*', redirect: '/404', hidden: true },
  // {
  //   path: '/dataIntegration',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'DataIntegration',
  //       component: () => import('@/views/dataIntegration/index'),
  //       meta: { title: '数据集成', icon: 'zzscgl' }
  //     }
  //   ]
  // },
  {
    path: '/dashboard',
    component: Layout,
    alwaysShow: true,
    redirect: '/dashboard/dataSource',
    meta: { title: '工业应用', icon: 'gongyeyy' },
    children: [
      {
        path: 'dataSource',
        name: 'DataSource',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '设备派工推荐', icon: 'shebeiqdgl' }
      },
      {
        path: 'dataClean',
        name: 'DataClean',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '高级计划排程', icon: 'shengmzq' }
      }
    ]
  },
  // {
  //   path: '/dataCleaning',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'DataCleaning',
  //       component: () => import('@/views/dataCleaning/index'),
  //       meta: { title: '数据清洗', icon: 'easgdgl' }
  //     }
  //   ]
  // },
  {
    path: '/flowEditor',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'flowEditor',
        component: () => import('@/views/flowEditor/index'),
        meta: { title: '数据流编辑器', icon: 'sctjfx' }
      }
    ]
  },
  {
    path: '/flowEditor',
    component: Layout,
    alwaysShow: true,
    redirect: '/flowEditor/dataSource',
    meta: { title: '企业数据中心', icon: 'qiyesjzx' },
    children: [
      {
        path: 'dataSource',
        name: 'DataSource',
        component: () => import('@/views/enterpriseDataCenter/dataSource/index'),
        meta: { title: '数据源管理', icon: 'chendishuju' }
      },
      {
        path: 'dataClean',
        name: 'DataClean',
        component: () => import('@/views/enterpriseDataCenter/dataClean/index'),
        meta: { title: '数据清洗', icon: 'shujuqx' }
      },
      {
        path: 'dataCleans',
        name: 'DataCleans',
        component: () => import('@/views/dataLabelManage/index'),
        meta: { title: '数据标签管理', icon: 'lvdanxinxsz' }
      },
      {
        path: 'businessIndexLibrary',
        name: 'BusinessIndexLibrary',
        component: () => import('@/views/businessIndexLibrary/index'),
        meta: { title: '业务指标库', icon: 'lvdanxinxsz' }
      },
    ]
  },
  {
    path: '/dataAnalysis',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'DataAnalysis',
        component: () => import('@/views/dataAnalysis/index'),
        meta: { title: '数据分析Studio', icon: 'shujufenxi' }
      }
    ]
  },
  {
    path: '/industryStudio',
    component: Layout,
    children: [
      {
        path: 'screen',
        name: 'screen',
        component: () => import('@/views/industryStudio/screen/index'),
        meta: { title: '工业报告Studio', icon: 'fenxipz' }
      }
    ]
  },
  {
    path: '/presentation',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'screen',
        component: () => import('@/views/industryStudio/presentation/index'),
        meta: { title: '工业报告', icon: 'cllxbm' }
      }
    ]
  },
  {
    path: '/publicView',
    hidden: true,
    component: Layout,
    children: [
      {
        path: 'index:id',
        name: 'PublicView',
        component: () => import('@/views/industryStudio/publicView/index'),
        meta: { title: '工业报告预览', icon: 'cllxbm' }
      }
    ]
  },
  // {
  //   path: '/industryStudio',
  //   component: Layout,
  //   alwaysShow: true,
  //   redirect: '/industryStudio/screen',
  //   meta: { title: '工业报告Studio', icon: 'fenxipz' },
  //   children: [
  //     {
  //       path: 'screen',
  //       name: 'Screen',
  //       component: () => import('@/views/industryStudio/screen/index'),
  //       meta: { title: '工业大屏', icon: 'djsbk' }
  //     },
  //     {
  //       path: 'presentation',
  //       name: 'Presentation',
  //       hidden: true,
  //       component: () => import('@/views/industryStudio/presentation/index'),
  //       meta: { title: '工业报告', icon: 'cllxbm' }
  //     }
  //   ]
  // },
  {
    path: '/taskManage',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'TaskManage',
        component: () => import('@/views/taskManage/index'),
        meta: { title: '任务管理', icon: 'peizhigl' }
      }
    ]
  },
  {
    path: '/dashboards',
    component: Layout,
    alwaysShow: true,
    redirect: '/dashboards/dataSource',
    meta: { title: '组织权限管理', icon: 'zhandianpz' },
    children: [
      {
        path: 'dataSource',
        name: 'DataSource',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '组织机构', icon: 'zhandiangl' }
      },
      {
        path: 'dataCleana',
        name: 'DataCleana',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '部门管理', icon: 'bumengw' }
      },
      {
        path: 'dataCleanb',
        name: 'DataCleanb',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '功能权限', icon: 'gongxugl' }
      },
      {
        path: 'dataCleanc',
        name: 'DataCleanc',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '数据权限', icon: 'shujqx' }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
