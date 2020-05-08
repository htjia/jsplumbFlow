import PageHeaderLayout from '@/components/PageHeaderLayout'
import Chart from '@/components/Charts'
import VueGridLayout from 'vue-grid-layout'
import 'webdatarocks/webdatarocks.css'
import draggable from 'vuedraggable'
import Sortable from 'sortablejs'
import { editFilter, formatDates, formatDate } from '@/views/industryStudio/presentation/func'
import { condListx, condListsx } from '@/views/industryStudio/presentation/ch'
import { setrept } from '@/views/industryStudio/presentation/load'
import WebDataRocks from 'WebDataRocks'
import { barcn } from '@/views/industryStudio/presentation/ch'
import { selectOne } from '@/api/analysis'
import { getParameterData } from '@/api/getdate'

export default {
  components: { PageHeaderLayout, Chart, VueGridLayout, draggable, Sortable },
  data() {
    return {
      listLoading: false, // 加载标识
      showDiaLogs: false, // 预览框
      isview: false, // 历史操作是重载画布
      isTabelActives: -1, // 预览选中图和表的index
      pageSize: 0, // 分页数
      viewList: [], // 预览页签数组
      isActives: 0, // 预览时选中页签index
      clientWidth: 0, // 获取绘图宽度0.95
      screenWidth: 0, // 获取屏幕宽度0.98
      condList: JSON.parse(condListx()), // 维度条件下拉
      condLists: JSON.parse(condListsx()), // 度量条件下拉
      substrateFindOptions: [],
      isPhone: false,
      screeWidth: 0,
      phoneitem: {
        x: 0,
        w: 24
      }
    }
  },
  mounted() {
    this.checkconput()
    console.log(this.isPhone)
    this.screenWidth = parseInt(((document.body.clientWidth - 0) * 0.98) + '')
    this.screeWidth = document.body.clientWidth
    console.log(this.screenWidth)
    const _this = this
    document.body.addEventListener('transitionend', function() {
      _this.screenWidth = parseInt(((document.body.clientWidth - 0) * 0.98) + '')
      _this.screeWidth = document.body.clientWidth
      _this.checkconput()
    })
    this.fetchData(this.$route.params.id)
  },
  methods: {
    checkconput() {
      var sUserAgent = navigator.userAgent.toLowerCase()
      var bIsIpad = sUserAgent.match(/ipad/i) === 'ipad'
      var bIsIphoneOs = sUserAgent.match(/iphone os/i) === 'iphone os'
      var bIsMidp = sUserAgent.match(/midp/i) === 'midp'
      var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) === 'rv:1.2.3.4'
      var bIsUc = sUserAgent.match(/ucweb/i) === 'ucweb'
      var bIsAndroid = sUserAgent.match(/android/i) === 'android'
      var bIsCE = sUserAgent.match(/windows ce/i) === 'windows ce'
      var bIsWM = sUserAgent.match(/windows mobile/i) === 'windows mobile'
      if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM || document.body.clientWidth < 800) {
        this.isPhone = true
      } else {
        this.isPhone = false
      }
    },
    // 获取预览信息
    fetchData(id) {
      const params = {
        id: id.substring(1)
      }
      selectOne(params).then(res => {
        if (res.data.content !== undefined && res.data.content !== null) {
          const content = JSON.parse(res.data.content)
          this.substrateFindOptions = content.substrateFindOptions
          this.views()
        }
      })
    },
    // 图联动点击
    chartAllClick(e) {
      const _this = this
      setTimeout(function() {
        const ldsql = []
        if (_this.viewList[_this.isActives].layout[_this.isTabelActives].ldList.length > 0) {
          const type = _this.viewList[_this.isActives].layout[_this.isTabelActives].type
          if (type === 'bar' || type === 'pie' || type === 'line' || type === 'duidie' || type === 'loudou' || type === 'zuhe' || type === 'tiao') {
            const key = _this.viewList[_this.isActives].layout[_this.isTabelActives].xList[0]
            ldsql.push({
              column: key.tableName + '.' + key.name,
              operator: '=',
              value: e.name
            })
          }
          for (const item of _this.viewList[_this.isActives].layout[_this.isTabelActives].ldList) {
            let ks = -1
            for (let i = 0; i < _this.viewList[_this.isActives].layout.length; i++) {
              if (item === _this.viewList[_this.isActives].layout[i].i) {
                ks = i
                break
              }
            }
            if (ks > -1) {
              _this.viewList[_this.isActives].layout[ks].ldsql = ldsql
              _this.getReloads(_this.viewList[_this.isActives].layout[ks].sql, ks, _this.isActives, _this.viewList[_this.isActives].layout[ks].type)
            }
          }
        }
      }, 200)
    },
    // 还原联动初始
    resetLD(index) {
      for (const item of this.viewList[this.isActives].layout[index].ldList) {
        let ks = -1
        for (let i = 0; i < this.viewList[this.isActives].layout.length; i++) {
          if (item === this.viewList[this.isActives].layout[i].i) {
            ks = i
            break
          }
        }
        if (ks > -1) {
          this.viewList[this.isActives].layout.layout[ks].ldsql = []
          this.getReloads(this.viewList[this.isActives].layout[index].sql, index, this.isActives, this.viewList[this.isActives].layout[index].type)
        }
      }
    },
    // 全局搜索条件
    searchByFilter(type) {
      const sql = []
      for (let x = 0; x < this.viewList[this.isActives].layout.length; x++) {
        if (this.viewList[this.isActives].layout[x].type === 'search') {
          for (const item of this.viewList[this.isActives].layout[x].searchinput) {
            if (item.type === 'range' && item.tableName.length > 0) {
              sql.push({
                column: item.tableName + '.' + item.sqlName,
                operator: '>=',
                value: (item.ts === 'week') ? formatDate(item['start' + item.id]) : item['start' + item.id]
              })
              sql.push({
                column: item.tableName + '.' + item.sqlName,
                operator: '<=',
                value: (item.ts === 'week') ? formatDates(item['end' + item.id]) : item['end' + item.id]
              })
            } else {
              sql.push(editFilter(item))
            }
          }
          break
        }
      }
      for (let i = 0; i < this.viewList[this.isActives].layout.length; i++) {
        this.viewList[this.isActives].layout[i].qjsql = sql
      }
      this.reloadInfos()
    },
    // 关闭弹出框向父级传值
    closeDialog() {
      this.$nextTick(() => {
        this.$emit('dialogFalse', { dialog: this.showDiaLogs })
      })
    },
    // 打开预览
    views() {
      this.isActives = 0
      const str = JSON.stringify(this.substrateFindOptions)
      const lists = JSON.parse(str)
      this.viewList = []
      for (const item of lists) {
        let y = 0
        for (let i = 0; i < item.layout.length; i++) {
          item.layout[i].ldsql = []
          if (this.isPhone) {
            item.layout[i].y = y
            y = y + item.layout[i].h
          }
        }
        if (item.type === 'table' && item.pageInfo.show) {
          item.pageInfo.pageNum = 1
          item.sql.limit = '0,' + item.pageInfo.pageSize
        }
        this.viewList.push(item)
      }
      console.log(this.viewList)
      this.showDiaLogs = true
      const _this = this
      setTimeout(function() {
        _this.reloadInfos()
      }, 500)
    },
    // 预览页通过sql参数获取数据
    getReloads(sql, i, key, type) {
      this.getReloadxs(sql, i, key, type, this.viewList, this.isActives, this.listLoading)
    },
    // 加载遍历预览页面数据展示
    reloadInfos() {
      for (let i = 0; i < this.viewList[this.isActives].layout.length; i++) {
        if (this.viewList[this.isActives].layout[i].type !== 'search') {
          if (this.viewList[this.isActives].layout[i].sql.measures.length !== 0 || this.viewList[this.isActives].layout[i].sql.dimensions.length !== 0) {
            this.getReloads(this.viewList[this.isActives].layout[i].sql, i, this.isActives, this.viewList[this.isActives].layout[i].type)
          } else if (this.viewList[this.isActives].layout[i].type === 'tstab') {
            this.setpoit(this.viewList[this.isActives].layout[i].type + this.viewList[this.isActives].layout[i].i + 'x')
          }
          if (this.viewList[this.isActives].layout[i].type === 'table') {
            this.columnDrop('table' + i, i)
          }
        }
      }
    },
    // 预览时输入过滤条件
    updateGLs() {
      this.viewList[this.isActives].layout[this.isTabelActives].sql.filter = []
      const list = this.viewList[this.isActives].layout[this.isTabelActives].condList
      // let flag = false
      for (const item of list) {
        if (item.value === '' || item.conditions === '') {
          // flag = true
        } else {
          this.viewList[this.isActives].layout[this.isTabelActives].sql.filter.push({
            column: item.tableName + '.' + item.name,
            operator: item.conditions,
            value: item.value
          })
        }
      }
      // if (flag) {
      //   this.$message({
      //     type: 'error',
      //     message: '请填写完整的过滤条件!'
      //   })
      //   return
      // }
      this.getReloads(this.viewList[this.isActives].layout[this.isTabelActives].sql, this.isTabelActives, this.isActives, this.viewList[this.isActives].layout[this.isTabelActives].type)
    },
    // 预览页面切换页面
    navClicks(type) {
      if (this.isActives !== type) {
        this.isActives = type
        const _this = this
        setTimeout(function() {
          _this.reloadInfos()
        }, 500)
      }
    },
    // 预览或编辑时，点击某个图或表二，获取index，并初始化编辑内容
    getinfo(item, index) {
      this.isTabelActives = index
    },
    // 编辑页透视表没有数据时，加载
    setpoit(id) {
      setrept(id)
    },
    // 改变普通表每页展示个数
    sizeChange(index) {
      if (this.viewList[this.isActives].layout[index].pageInfo.show) {
        this.viewList[this.isActives].layout[index].sql.limit = ''
      } else {
        this.viewList[this.isActives].layout[index].sql.limit = ''
      }
      this.getReloads(this.viewList[this.isActives].layout[index].sql, index, this.isActives, this.viewList[this.isActives].layout[index].type)
    },
    // 切换普通表页数
    currentChange(pageNum) {
      this.viewList[this.isActives].layout[this.isTabelActives].pageInfo.pageNum = pageNum
      if (this.viewList[this.isActives].layout[this.isTabelActives].pageInfo.show) {
        this.viewList[this.isActives].layout[this.isTabelActives].sql.limit = (pageNum - 1) + ',' + this.viewList[this.isActives].layout[this.isTabelActives].pageInfo.pageSize
      } else {
        this.viewList[this.isActives].layout[this.isTabelActives].sql.limit = ''
      }
      this.getReloads(this.viewList[this.isActives].layout[this.isTabelActives].sql, this.isTabelActives, this.isActives, this.viewList[this.isActives].layout[this.isTabelActives].type)
    },
    // 普通表格列拖拽
    columnDrop(id, i) {
      const wrapperTr = document.querySelector('#' + id + 'x > .el-table__header-wrapper tr')
      // eslint-disable-next-line no-unused-vars
      var sort = Sortable.create(wrapperTr, {
        animation: 180,
        delay: 0,
        onEnd: evt => {
          const oldItem = this.viewList[this.isActives].layout[i].options.title[evt.oldIndex]
          this.viewList[this.isActives].layout[i].options.title.splice(evt.oldIndex, 1)
          this.viewList[this.isActives].layout[i].options.title.splice(evt.newIndex, 0, oldItem)
          this.viewList[this.isActives].layout[i].type = 'tablse'
          const _this = this
          setTimeout(function() {
            _this.viewList[_this.isActives].layout[i].type = 'table'
            sort = null
            setTimeout(function() {
              _this.columnDrop(id, i)
            }, 500)
          })
        }
      })
    },
    // 预览框加载数据
    getReloadxs(sql, i, key, type, obj, isActive, listLoading) {
      this.listLoading = true
      obj[isActive].layout[i].isError = false
      // 处理bug
      const str = JSON.stringify(sql)
      const lis = JSON.parse(str)
      const sqls = {
        measures: lis.measures,
        dimensions: lis.dimensions,
        filter: lis.filter,
        order: lis.order,
        database: lis.database,
        limit: lis.limit
      }
      // 处理联动状态sql
      if (obj[isActive].layout[i].ldsql.length > 0) {
        for (const item of obj[isActive].layout[i].ldsql) {
          sqls.filter.push(item)
        }
      }
      // 处理联动状态sql
      if (obj[isActive].layout[i].qjsql !== undefined && obj[isActive].layout[i].qjsql.length > 0) {
        for (const item of obj[isActive].layout[i].qjsql) {
          if (item.column.length > 0) {
            sqls.filter.push(item)
          }
        }
      }
      getParameterData(sqls).then(res => {
        // start 处理请求后台返回数据后将表名和字段名中间的.消失的问题
        let dataList = []
        const dimensionsList = {}
        for (const dimensions of sql.dimensions) {
          const value = dimensions.column.split('.')
          dimensionsList[value[0] + '' + value[1]] = dimensions.column
        }
        const measuresList = {}
        for (const measures of sql.measures) {
          const value = measures.column.split('.')
          measuresList[value[0] + '' + value[1]] = measures.column
        }
        try {
          const keys = Object.keys(res.data.list[0])
          for (const item of res.data.list) {
            const data = {}
            for (const key of keys) {
              if (dimensionsList[key]) {
                data[dimensionsList[key]] = item[key]
              } else if (measuresList[key]) {
                data[measuresList[key]] = item[key]
              }
            }
            dataList.push(data)
          }
        } catch (e) {
          dataList = []
          obj[isActive].layout[i].isError = true
        }
        this.listLoading = false
        if (dataList.length === 0) {
          return
        }
        // end 处理请求后台返回数据后将表名和字段名中间的.消失的问题
        if (type === 'tstab') {
          new WebDataRocks({
            container: '#tstab' + obj[isActive].layout[i].i + 'x',
            global: {
              localization: barcn
            },
            height: '100%',
            report: {
              dataSource: {
                data: dataList
              }
            }
          })
        } else if (type === 'table') {
          obj[isActive].layout[i].options.list = []
          obj[isActive].layout[i].options.title = []
          const keys = Object.keys(dataList[0])
          for (const item of dataList) {
            var ites = {}
            for (const key of keys) {
              const keyname = key.split('.')[1]
              ites[keyname + ''] = item[key]
            }
            obj[isActive].layout[i].options.list.push(ites)
          }
          for (const key of keys) {
            obj[isActive].layout[i].options.title.push({
              key: key.split('.')[1],
              keyname: key.split('.')[1],
              width: 0
            })
          }
          obj[isActive].layout[i].pageInfo.totalPage = parseInt(res.data.total)
        } else if (type === 'bar' || type === 'tiao' || type === 'duidie') {
          const xdata = []
          const keys = Object.keys(dataList[0])
          const dimensions = obj[isActive].layout[i].sql.dimensions[0].column
          var sers = obj[isActive].layout[i].options.series[0]
          obj[isActive].layout[i].options.series = []
          for (let x = 0; x < keys.length; x++) {
            if (dimensions === keys[x]) {
              keys.splice(x, 1)
              break
            }
          }
          for (const item of dataList) {
            xdata.push(item[dimensions])
            for (let x = 0; x < keys.length; x++) {
              if (x >= obj[isActive].layout[i].options.series.length) {
                if (type === 'bar') {
                  obj[isActive].layout[i].options.series.push({
                    name: obj[isActive].layout[i].infoList.length === 0 ? keys[x] : obj[isActive].layout[i].infoList[x].name,
                    data: [],
                    label: {
                      show: sers.label.show,
                      position: sers.label.position
                    },
                    itemStyle: {
                      color: obj[isActive].layout[i].infoList.length === 0 ? (x === 0 ? '#009494' : '') : obj[isActive].layout[i].infoList[x].color,
                      barBorderRadius: [5, 5, 0, 0]
                    },
                    barMaxWidth: 20,
                    type: 'bar'
                  })
                } else if (type === 'duidie') {
                  obj[isActive].layout[i].options.series.push({
                    name: obj[isActive].layout[i].infoList.length === 0 ? keys[x] : obj[isActive].layout[i].infoList[x].name,
                    data: [],
                    label: {
                      show: sers.label.show,
                      position: sers.label.position
                    },
                    itemStyle: {
                      color: obj[isActive].layout[i].infoList.length === 0 ? (x === 0 ? '#009494' : '') : obj[isActive].layout[i].infoList[x].color
                    },
                    stack: 'duidie',
                    barMaxWidth: 20,
                    type: 'bar'
                  })
                } else {
                  obj[isActive].layout[i].options.series.push({
                    name: obj[isActive].layout[i].infoList.length === 0 ? keys[x] : obj[isActive].layout[i].infoList[x].name,
                    data: [],
                    label: {
                      show: sers.label.show,
                      position: sers.label.position
                    },
                    itemStyle: {
                      color: obj[isActive].layout[i].infoList.length === 0 ? (x === 0 ? '#009494' : '') : obj[isActive].layout[i].infoList[x].color,
                      barBorderRadius: [0, 5, 5, 0]
                    },
                    barMaxWidth: 15,
                    barCateGoryGap: 20,
                    type: 'bar'
                  })
                }
              }
              obj[isActive].layout[i].options.series[x].data.push(item[keys[x]])
            }
          }
          if (type === 'bar' || type === 'duidie') {
            obj[isActive].layout[i].options.xAxis.data = xdata
          } else {
            obj[isActive].layout[i].options.yAxis.data = xdata
          }
        } else if (type === 'pie' || type === 'loudou') {
          const dimensions = obj[isActive].layout[i].sql.dimensions[0].column
          const measures = obj[isActive].layout[i].sql.measures[0].column
          const data = []
          obj[isActive].layout[i].options.series[0].data = []
          for (const item of dataList) {
            data.push(item[dimensions])
            obj[isActive].layout[i].options.series[0].data.push({
              value: item[measures],
              name: item[dimensions],
              itemStyle: {
                color: (obj[isActive].layout[i].infoList.length === 0 && obj[isActive].layout[i].infoList.length >= obj[isActive].layout[i].options.series[0].data.length) ? (obj[isActive].layout[i].options.series[0].data.length === 0 ? '#009494' : '') : obj[isActive].layout[i].infoList[obj[isActive].layout[i].options.series[0].data.length].color
              }
            })
          }
        } else if (type === 'line') {
          const xdata = []
          const keys = Object.keys(dataList[0])
          const dimensions = obj[isActive].layout[i].sql.dimensions[0].column
          var serss = obj[isActive].layout[i].options.series[0]
          obj[isActive].layout[i].options.series = []
          for (let x = 0; x < keys.length; x++) {
            if (dimensions === keys[x]) {
              keys.splice(x, 1)
              break
            }
          }
          for (const item of dataList) {
            xdata.push(item[dimensions])
            for (let x = 0; x < keys.length; x++) {
              if (x >= obj[isActive].layout[i].options.series.length) {
                obj[isActive].layout[i].options.series.push({
                  name: obj[isActive].layout[i].infoList.length === 0 ? keys[x] : obj[isActive].layout[i].infoList[x].name,
                  data: [],
                  label: {
                    show: serss.label.show,
                    position: serss.label.position
                  },
                  itemStyle: {
                    color: obj[isActive].layout[i].infoList.length === 0 ? (x === 0 ? '#009494' : '') : obj[isActive].layout[i].infoList[x].color
                  },
                  smooth: serss.smooth,
                  type: 'line'
                })
              }
              obj[isActive].layout[i].options.series[x].data.push(item[keys[x]])
            }
          }
          obj[isActive].layout[i].options.xAxis.data = xdata
        } else if (type === 'scatter') {
          const keys = Object.keys(dataList[0])
          obj[isActive].layout[i].options.series[0].data = []
          for (const item of dataList) {
            obj[isActive].layout[i].options.series[0].data.push([item[keys[0]], item[keys[1]]])
          }
          obj[isActive].layout[i].options.series[0].itemStyle.color = obj[isActive].layout[i].infoList.length === 0 ? '#009494' : obj[isActive].layout[i].infoList[0].color
        } else if (type === 'zuhe') {
          const xdata = []
          const keys = Object.keys(dataList[0])
          const dimensions = obj[isActive].layout[i].sql.dimensions[0].column
          const tableName = dimensions.split('.')[0]
          var sersx = obj[isActive].layout[i].options.series[0]
          var sersx1 = null
          for (const vlue of obj[isActive].layout[i].options.series) {
            if (vlue.type === 'bar') {
              sersx1 = vlue
              break
            }
          }
          obj[isActive].layout[i].options.series = []
          for (let x = 0; x < keys.length; x++) {
            if (dimensions === keys[x]) {
              keys.splice(x, 1)
              break
            }
          }
          for (const item of dataList) {
            xdata.push(item[dimensions])
            for (let x = 0; x < keys.length; x++) {
              let flag = false
              for (const y1 of obj[isActive].layout[i].yList1) {
                if (keys[x] === (tableName + '.' + y1.name)) {
                  flag = true
                  break
                }
              }
              if (x >= obj[isActive].layout[i].options.series.length) {
                if (flag) {
                  obj[isActive].layout[i].options.series.push({
                    name: obj[isActive].layout[i].infoList.length === 0 ? keys[x] : obj[isActive].layout[i].infoList[x].name,
                    data: [],
                    label: {
                      show: sersx.label.show,
                      position: sersx.label.position
                    },
                    itemStyle: {
                      color: obj[isActive].layout[i].infoList.length === 0 ? '' : obj[isActive].layout[i].infoList[0].color
                    },
                    yAxisIndex: 1,
                    smooth: sersx.smooth,
                    type: 'line'
                  })
                } else {
                  obj[isActive].layout[i].options.series.push({
                    name: obj[isActive].layout[i].infoList.length === 0 ? keys[x] : obj[isActive].layout[i].infoList[x].name,
                    data: [],
                    label: {
                      show: sersx1.label.show,
                      position: sersx1.label.show
                    },
                    itemStyle: {
                      color: obj[isActive].layout[i].infoList.length === 0 ? '' : obj[isActive].layout[i].infoList[0].color
                    },
                    barMaxWidth: 20,
                    type: 'bar'
                  })
                }
              }
              obj[isActive].layout[i].options.series[x].data.push(item[keys[x]])
            }
          }
          obj[isActive].layout[i].options.xAxis[0].data = xdata
        } else if (type === 'leida') {
          obj[isActive].layout[i].options = []
          const keys = Object.keys(res.data.list[0])
          const indicator = []
          if (obj[isActive].layout[i].maxList.length === 0) {
            for (const key of keys) {
              if (measuresList[key]) {
                indicator.push({
                  name: key,
                  max: 100,
                  key: key
                })
                obj[isActive].layout[i].maxList.push({
                  name: key,
                  max: 100,
                  key: key
                })
              }
            }
          } else {
            for (const key of keys) {
              if (measuresList[key]) {
                let flag = null
                for (const st of obj[isActive].layout[i].maxList) {
                  if (st.key === key) {
                    flag = st
                    break
                  }
                }
                if (flag !== null) {
                  indicator.push({
                    name: flag.name,
                    max: flag.max,
                    key: flag.key
                  })
                } else {
                  indicator.push({
                    name: key,
                    max: 100,
                    key: key
                  })
                }
              }
            }
            obj[isActive].layout[i].maxList = []
            for (const st of indicator) {
              obj[isActive].layout[i].maxList.push({
                name: st.name,
                max: st.max,
                key: st.key
              })
            }
          }
          for (const item of res.data.list) {
            const keyx = Object.keys(item)
            let name = ''
            const data = []
            for (const key of keyx) {
              if (dimensionsList[key]) {
                name = name + item[key]
              } else {
                data.push(item[key])
              }
            }
            var opst = {
              title: {
                show: false,
                text: res.data.total
              },
              tooltip: {
                show: obj[isActive].layout[i].opt.tooltipShow,
                triggerOn: obj[isActive].layout[i].opt.tooltipTriggerOn
              },
              legend: {
                show: obj[isActive].layout[i].opt.legendShow,
                left: obj[isActive].layout[i].opt.legendLeft,
                itemHeight: 10,
                itemWidth: 15,
                top: obj[isActive].layout[i].opt.legendTop
              },
              grid: {
                top: 33,
                left: 40,
                right: 30,
                bottom: 35
              },
              radar: {
                shape: obj[isActive].layout[i].opt.lineFlag ? 'polygon' : 'circle',
                indicator: indicator,
                radius: '60%'
              },
              series: {
                name: name,
                type: 'radar',
                itemStyle: {
                  color: '#009494'
                },
                label: {
                  show: false,
                  position: 'inside'
                },
                data: [
                  {
                    value: data,
                    name: name
                  }
                ]
              }
            }
            obj[isActive].layout[i].options.push(opst)
          }
        }
        this.listLoading = false
        return false
      }, () => {
        this.listLoading = false
        obj[isActive].layout[i].isError = true
        return false
      })
    }
  }
}

