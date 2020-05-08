
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { getResure, getdatalist, gettablekey, getParameterData } from '@/api/getdate'
import { updateAnalysis } from '@/api/analysis'
import Chart from '@/components/Charts'
import VueGridLayout from 'vue-grid-layout'
import 'webdatarocks/webdatarocks.css'
import draggable from 'vuedraggable'
import Cookies from 'js-cookie'
import views from '../presentation/views'
import WebDataRocks from 'WebDataRocks'
import { barcn } from '@/views/industryStudio/presentation/ch'
import { setSearch, setTable, setChart, editFilter, formatDates, formatDate } from '@/views/industryStudio/presentation/func'
import { setrept, loadByUrl } from '@/views/industryStudio/presentation/load'
import { menu, barinfo, lineinfo, scatterinfo, pieinfo, tableinfo, tableinfo1, zuheinfo, leidainfo, inputlist, condListx, condListsx, dataWDListx, aggregateFunListx, dataList } from '@/views/industryStudio/presentation/ch'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd, Chart, VueGridLayout, draggable, views },
  data() {
    return {
      listLoading: false, // 加载标识
      showDiaLog: false, // 预览框
      showtableDiaLog: false, // 添加数据表框
      searchKey: '', // 数据表关键字搜索
      pageTitle: '', // 页面标题
      isEditpage: false, // 是否编辑页面名称
      isTabelActive: -1, // 选中编辑图和表的index
      isTabelActives: -1, // 预览选中图和表的index
      isSearchActive: -1, // 搜索框定位
      list: [], // 左侧选择数据库表
      // 默认打开的左侧菜单的id
      defaultOpeneds: ['1'],
      defaultOpenedsx: ['1', '2'],
      resid: '', // 选择数据表的key
      resList: [], // 数据列表
      retablist: [], // 选择数据库后加载的表
      selectvalue: [], // 初始化获取已选择列表
      historyList: [], // 记录操作历史
      historyIndex: -1, // 历史前进后退定位index
      pageSize: 0, // 分页数
      // 维度和度量菜单
      menuList: JSON.parse(menu()),
      // 保证拖动维度和度量时，树状结构不变
      alreadyList: '',
      baseName: '', // 数据库名称
      ldList: [], // 联动集合
      // 柱状图、条形图、堆叠图编辑菜单
      barList: JSON.parse(barinfo()),
      // 条形图编辑菜单
      lineList: JSON.parse(lineinfo()),
      // 散点图编辑菜单
      scatterList: JSON.parse(scatterinfo()),
      // 饼图编辑菜单
      pieList: JSON.parse(pieinfo()),
      // 普通表和透视表编辑菜单
      tableList: JSON.parse(tableinfo()),
      // 组合图编辑菜单
      zuheList: JSON.parse(zuheinfo()),
      // 雷达图编辑菜单
      leidaList: JSON.parse(leidainfo()),
      // 搜索查询框菜单
      searchList: JSON.parse(inputlist()),
      // 日期类型
      dataLists: JSON.parse(dataList()),
      viewList: [], // 预览页签数组
      roseType: false, // 饼图是否按玫瑰妆展示
      legendShow: true, // 雷达图图例是否显示
      legendTop: 'top', // 雷达图图例显示位置
      legendLeft: 'center', // 雷达图图例显示位置
      tooltipShow: true, // 雷达图提示是否显示
      tooltipTriggerOn: 'mousemove', // 雷达图提示方式
      dateType: '', // 日期格式类型
      dataWDList: JSON.parse(dataWDListx()), // 维度为日期数据处理
      // 页面页签
      substrateFindOptions: [
        {
          id: 0, // 每个页签id，唯一标识
          name: '页面1', // 页签名称
          isEdit: false, // 是否编辑页签名称
          background: '#e5e5e5', // 页签背景色
          isAuxiliary: true, // 页签编辑是否需要辅助线
          layout: [] // 页签内容
        }
      ],
      // 页面总集和保存时使用
      setalls: {
        substrateFindOptions: null,
        list: [],
        resid: ''
      },
      // 拖拽配置
      draggableOptions: {
        preventOnFilter: false
      },
      clientWidth: 0, // 获取绘图宽度0.95
      screenWidth: 0, // 获取屏幕宽度0.98
      lineFlag: false, // 折现是否曲线展示
      isview: false, // 历史操作是重载画布
      isActive: 0, // 编辑是选中页签index
      isActives: 0, // 预览时选中页签index
      isDragging: false, // 左侧menu是否开始拖拽
      moveItem: null, // 左侧menu拖拽的内容
      dataIsShow: false, // 数据标签是否显示
      dataposition: 'inside', // 数据标签显示方式
      defaultRadius: 70, // 饼图默认半径
      defaultRadiusst: 0, // 饼图其实位置
      guoluList: [], // 条件查询
      condList: JSON.parse(condListx()), // 维度条件下拉
      condLists: JSON.parse(condListsx()), // 度量条件下拉
      widusList: [], // 维度集合
      // sql聚合算法
      aggregateFunList: JSON.parse(aggregateFunListx()),
      reportsInfo: null, // 初始化选择的库内容
      tabsInfo: null // 选择的表名称
    }
  },
  computed: {
    // 菜单拖拽配置
    dragOptions1() {
      return {
        animation: 0,
        group: {
          name: 'description',
          pull: 'clone'
        },
        ghostClass: 'ghost'
      }
    },
    // 菜单拖拽配置
    dragOptions2() {
      return {
        animation: 0,
        group: 'description'
      }
    }
  },
  mounted() {
    // 初始化默认折叠左侧路由
    const sidebarStatus = Cookies.get('sidebarStatus')
    if (sidebarStatus === '0') {
      this.$store.dispatch('ToggleSideBar')
    }
    // 初始化页面参数
    this.setalls = {
      substrateFindOptions: this.substrateFindOptions,
      list: [],
      resid: ''
    }
    // 获取宽度
    const pars = document.getElementById('contens').parentNode
    pars.parentNode.className = 'conetntsx'
    this.clientWidth = document.getElementById('conentid').clientWidth * 0.9
    this.screenWidth = document.body.clientWidth * 0.98
    // 进入页面初始化已保存的数据
    const reportInfo = sessionStorage.getItem('reportInfo')
    if (reportInfo !== undefined && reportInfo !== null) {
      this.reportsInfo = JSON.parse(reportInfo)
      this.pageTitle = this.reportsInfo.name
      if (this.reportsInfo.content !== undefined && this.reportsInfo.content !== '' && this.reportsInfo.content !== null) {
        this.setalls = JSON.parse(this.reportsInfo.content)
        this.substrateFindOptions = this.setalls.substrateFindOptions
        this.historyIndex = 0
        this.historyList.push(JSON.stringify(this.substrateFindOptions))
        this.list = this.setalls.list
        this.resid = this.setalls.resid
        if (this.setalls.tabsInfos !== undefined && this.setalls.tabsInfos !== null && this.setalls.tabsInfos.tableName !== undefined) {
          this.baseName = this.setalls.tabsInfos.database
          this.getTablistkey(this.setalls.tabsInfos)
        }
        const _this = this
        setTimeout(function() {
          _this.reloadInfo()
        }, 500)
      } else {
        this.historyIndex = 0
        this.historyList.push(JSON.stringify(this.substrateFindOptions))
      }
    }
    // 初始化获取所有数据库
    this.getResource()
    // 监听编辑页面宽度变化变更数据
    const _this = this
    document.getElementById('conentid').addEventListener('transitionend', function() {
      _this.clientWidth = document.getElementById('conentid').clientWidth * 0.9
      _this.screenWidth = document.body.clientWidth * 0.98
    })
  },
  methods: {
    // 打开添加表
    openTab() {
      this.selectvalue = []
      this.showtableDiaLog = true
      if (this.resid !== '') {
        this.getTablist()
      }
    },
    // 添加表时勾选操作
    handleSelect(value) {
      this.selectvalue = value
    },
    // 添加表弹出框确认按钮
    confirms() {
      this.showtableDiaLog = false
      // 将已勾选的表赋值给左侧列表
      let values = {}
      for (const value of this.resList) {
        if (value.id === this.resid) {
          values = JSON.parse(value.config)
          this.baseName = values.database
          break
        }
      }
      this.list = []
      for (const item of this.selectvalue) {
        item.database = values.database
        this.list.push(item)
      }
      // 获取选择的表和key，用以保存时使用
      this.setalls.list = this.list
      this.setalls.resid = this.resid
    },
    // 获取数据库集合
    getResource() {
      const params = {
        pageSize: 1,
        pageNum: 10000
      }
      getResure(params).then(res => {
        this.resList = res.data.datasouces
      })
    },
    // 选择库时触发，获取库中表的集合
    getTablist() {
      const params = {
        id: this.resid
      }
      getdatalist(params).then(res => {
        this.retablist = res.data
      })
    },
    // 点击左侧选择的数据表时，获取表字段
    getTablistkey(item) {
      if (item.tableName === this.tabsInfo) {
        return
      }
      if (item !== null) {
        this.tabsInfo = item.tableName
        if (this.isTabelActive > -1) {
          this.clearInfo()
        }
      }
      this.setalls.tabsInfos = item
      const params = {
        id: this.resid,
        name: this.tabsInfo
      }
      gettablekey(params).then(res => {
        this.menuList[0].children = []
        this.menuList[1].children = []
        this.alreadyList = ''
        // 将表中字段划分维度和度量（除时间字符串外其余均为度量）
        for (const item of res.data) {
          if (item.columnType.indexOf('time') > -1 || item.columnType.indexOf('date') > -1 || item.columnType.indexOf('varchar') > -1 || item.columnType.indexOf('text') > -1) {
            this.menuList[0].children.push({
              id: '1' + (this.menuList[0].children.length + 1),
              type: 'weidu',
              name: item.columnName,
              key: '',
              conditions: '',
              value: '',
              tableName: this.tabsInfo,
              columnType: item.columnType,
              columnComment: item.columnComment,
              ico: 'el-icon-time'
            })
          } else {
            this.menuList[1].children.push({
              id: '2' + (this.menuList[1].children.length + 1),
              type: 'duliang',
              name: item.columnName,
              key: '',
              conditions: '',
              value: '',
              tableName: this.tabsInfo,
              columnType: item.columnType,
              columnComment: item.columnComment,
              ico: 'el-icon-time'
            })
          }
        }
        this.alreadyList = JSON.stringify(this.menuList)
        this.getinfo(null, this.isTabelActive)
      })
    },
    // 左侧数据库表排序
    sortClick(item, row) {
      if (row.$slots.default[0].text.indexOf('按首字母A-Z') > -1) {
        this.list.sort(function(a, b) {
          return a.tableName.substring(0, 1).toLowerCase().charCodeAt(0) - b.tableName.substring(0, 1).toLowerCase().charCodeAt(0)
        })
      } else {
        this.list.sort(function(a, b) {
          return b.tableName.substring(0, 1).toLowerCase().charCodeAt(0) - a.tableName.substring(0, 1).toLowerCase().charCodeAt(0)
        })
      }
    },
    // 点击左侧选择的数据表删除操作
    removeTablistkey(index) {
      this.list.splice(index, 1)
    },
    // 左侧度量或维度拖拽时获取拖拽数据
    onMove({ relatedContext, draggedContext }) {
      this.moveItem = draggedContext.element
      const relatedElement = relatedContext.element
      const draggedElement = draggedContext.element
      return (
        (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      )
    },
    // 度量维度拖拽开始是触发（暂时无用）
    rightStart() {
      this.isDragging = true
    },
    rightEnd() {
      this.isDragging = false
      // 左边数据不变
      this.menuList = []
      const _this = this
      setTimeout(() => {
        _this.menuList = JSON.parse(_this.alreadyList)
      })
    },
    // 新增页签
    addPage() {
      this.substrateFindOptions.push({
        id: this.substrateFindOptions.length,
        name: '页面' + (this.substrateFindOptions.length + 1),
        isEdit: false,
        background: '#e5e5e5',
        isAuxiliary: true,
        layout: []
      })
      this.setHistory()
    },
    // 删除页签
    removetabact(index) {
      this.$confirm('是否删除该页面？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.isActive = 0
        this.substrateFindOptions.splice(index, 1)
      })
    },
    // 是否编辑页面名称
    settitle() {
      this.isEditpage = true
    },
    // 编辑保存页面名称
    updatetitle() {
      if (this.pageTitle.trim() === '') {
        this.$message({
          type: 'error',
          message: '标题名称不能为空!'
        })
        return
      }
      this.reportsInfo.name = this.pageTitle
      // this.updateSuccess()
      this.isEditpage = false
      this.setHistory()
    },
    // 是否编辑页签名称
    settitles(index) {
      this.substrateFindOptions[index].isEdit = true
    },
    // 判断是页签触发什么按钮
    editClick(item, row) {
      if (row.$slots.default[1].text.indexOf('编辑') > -1) {
        const index = row.$slots.default[0].data.attrs.id.substring(6)
        this.settitles(parseInt(index))
        // 编辑页签时，input光标定位
        setTimeout(function() {
          document.getElementById('intpu' + index).focus()
        }, 100)
      } else if (row.$slots.default[1].text.indexOf('删除') > -1) {
        const index = row.$slots.default[0].data.attrs.id.substring(6)
        this.removetabact(parseInt(index))
      } else {
        // 保存
        const index = row.$slots.default[0].data.attrs.id.substring(4)
        this.updatetitles(parseInt(index))
      }
    },
    // 编辑保存页签名称
    updatetitles(index) {
      if (this.substrateFindOptions[index].name.trim() === '') {
        this.$message({
          type: 'error',
          message: '标签名称不能为空!'
        })
        return
      }
      this.substrateFindOptions[index].isEdit = false
      this.setHistory()
    },
    // 切换页签
    navClick(type) {
      if (this.isActive !== type) {
        this.historyList = []
        this.historyIndex = 0
        this.historyList.push(JSON.stringify(this.substrateFindOptions))
        this.isActive = type
        if (this.substrateFindOptions[this.isActive].isAuxiliary) {
          this.substrateFindOptions[this.isActive].isAuxiliary = false
          const _this = this
          setTimeout(() => {
            _this.substrateFindOptions[this.isActive].isAuxiliary = true
          }, 100)
        }
        this.isTabelActive = -1
        const _this = this
        setTimeout(function() {
          _this.reloadInfo()
        }, 500)
      }
    },
    // 切换聚合数组是重新加载数据
    updateDL(index) {
      this.getDataByUrl()
    },
    // 拖入过滤数据
    getConditions() {
      const type = this.substrateFindOptions[this.isActive].layout[this.isTabelActive].type
      this.substrateFindOptions[this.isActive].layout[this.isTabelActive].condList = []
      let list = []
      if (type === 'bar' || type === 'tiao' || type === 'duidie') {
        list = this.barList[1].children
      } else if (type === 'line') {
        list = this.lineList[1].children
      } else if (type === 'pie' || type === 'loudou') {
        list = this.pieList[1].children
      } else if (type === 'table' || type === 'tstab') {
        list = this.tableList[1].children
      } else if (type === 'scatter') {
        list = this.scatterList[1].children
      } else if (type === 'zuhe') {
        list = this.zuheList[1].children
      }
      if (type === 'search') {
        this.searchList[1].children = [this.moveItem]
        list = this.searchList[1].children
        this.substrateFindOptions[this.isActive].layout[this.isTabelActive].searchinput[this.isSearchActive].tableName = this.moveItem.tableName
        this.substrateFindOptions[this.isActive].layout[this.isTabelActive].searchinput[this.isSearchActive].sqlName = this.moveItem.name
        if (this.substrateFindOptions[this.isActive].layout[this.isTabelActive].searchinput[this.isSearchActive].type !== 'select') {
          return
        }
        this.substrateFindOptions[this.isActive].layout[this.isTabelActive].searchinput[this.isSearchActive].searchList = []
        this.substrateFindOptions[this.isActive].layout[this.isTabelActive].searchinput[this.isSearchActive].searchSQL = {
          measures: [{
            column: list[0].tableName + '.' + list[0].name,
            type: 'distinct'
          }],
          dimensions: [],
          filter: [],
          order: [],
          database: this.baseName
        }
        getParameterData(this.substrateFindOptions[this.isActive].layout[this.isTabelActive].searchinput[this.isSearchActive].searchSQL).then(res => {
          list[0].wedulist = []
          for (const item of res.data.list) {
            list[0].wedulist.push({
              key: item[list[0].tableName + '' + list[0].name],
              name: item[list[0].tableName + '' + list[0].name]
            })
            this.substrateFindOptions[this.isActive].layout[this.isTabelActive].searchinput[this.isSearchActive].searchList.push({
              key: item[list[0].tableName + '' + list[0].name],
              name: item[list[0].tableName + '' + list[0].name]
            })
          }
        })
      } else {
        this.substrateFindOptions[this.isActive].layout[this.isTabelActive].condList = []
        for (let i = 0; i < list.length; i++) {
          if (list[i].type === 'weidu') {
            list[i].wedulist = []
            const sql = {
              measures: [{
                column: list[i].tableName + '.' + list[i].name,
                type: 'distinct'
              }],
              database: this.baseName
            }
            getParameterData(sql).then(res => {
              for (const item of res.data.list) {
                list[i].wedulist.push({
                  key: item[list[i].tableName + '' + list[i].name],
                  name: item[list[i].tableName + '' + list[i].name]
                })
              }
              if (type !== 'search') {
                this.substrateFindOptions[this.isActive].layout[this.isTabelActive].condList.push(list[i])
                this.$nextTick(() => {
                  this.substrateFindOptions[this.isActive].layout[this.isTabelActive].condList
                })
              }
            })
          } else {
            this.substrateFindOptions[this.isActive].layout[this.isTabelActive].condList.push(list[i])
          }
        }
      }
    },
    // 编辑页面搜索输入过滤条件
    updateSearchGL() {
      this.substrateFindOptions[this.isActive].layout[this.isTabelActive].searchinput[this.isSearchActive].searchSQL.filter = [{
        column: this.searchList[1].children[0].tableName + '.' + this.searchList[1].children[0].name,
        operator: this.searchList[1].children[0].conditions,
        value: this.searchList[1].children[0].value
      }]
      getParameterData(this.substrateFindOptions[this.isActive].layout[this.isTabelActive].searchinput[this.isSearchActive].searchSQL).then(res => {
        this.substrateFindOptions[this.isActive].layout[this.isTabelActive].searchinput[this.isSearchActive].searchList = []
        for (const item of res.data.list) {
          this.substrateFindOptions[this.isActive].layout[this.isTabelActive].searchinput[this.isSearchActive].searchList.push({
            key: item[this.searchList[1].children[0].tableName + '' + this.searchList[1].children[0].name],
            name: item[this.searchList[1].children[0].tableName + '' + this.searchList[1].children[0].name]
          })
        }
      })
    },
    // 编辑页面输入过滤条件
    updateGL() {
      this.substrateFindOptions[this.isActive].layout[this.isTabelActive].sql.filter = []
      const type = this.substrateFindOptions[this.isActive].layout[this.isTabelActive].type
      if (type === 'bar' || type === 'tiao' || type === 'duidie') {
        if (this.barList[0].childrenx.length !== 1) {
          this.$message({
            type: 'error',
            message: '请拖入维度数据!'
          })
          this.substrateFindOptions[this.isActive].layout[this.isTabelActive].isError = true
          return
        }
        if (this.barList[0].childreny.length === 0) {
          this.$message({
            type: 'error',
            message: '请拖入度量数据!'
          })
          this.substrateFindOptions[this.isActive].layout[this.isTabelActive].isError = true
          return
        }
      } else if (type === 'line') {
        if (this.lineList[0].childrenx.length !== 1) {
          this.$message({
            type: 'error',
            message: '请拖入维度数据!'
          })
          this.substrateFindOptions[this.isActive].layout[this.isTabelActive].isError = true
          return
        }
        if (this.lineList[0].childreny.length === 0) {
          this.$message({
            type: 'error',
            message: '请拖入度量数据!'
          })
          this.substrateFindOptions[this.isActive].layout[this.isTabelActive].isError = true
          return
        }
      } else if (type === 'pie' || type === 'loudou') {
        if (this.pieList[0].childrenx.length !== 1) {
          this.$message({
            type: 'error',
            message: '请拖入维度数据!'
          })
          this.substrateFindOptions[this.isActive].layout[this.isTabelActive].isError = true
          return
        }
        if (this.pieList[0].childreny.length !== 1) {
          this.$message({
            type: 'error',
            message: '请拖入度量数据!'
          })
          this.substrateFindOptions[this.isActive].layout[this.isTabelActive].isError = true
          return
        }
      } else if (type === 'table') {
        if (this.tableList[0].childreny.length === 0) {
          this.$message({
            type: 'error',
            message: '请拖入度量数据!'
          })
          this.substrateFindOptions[this.isActive].layout[this.isTabelActive].isError = true
          return
        }
      } else if (type === 'tstab') {
        if (this.tableList[0].childreny.length === 0) {
          this.$message({
            type: 'error',
            message: '请拖入度量数据!'
          })
          this.substrateFindOptions[this.isActive].layout[this.isTabelActive].isError = true
          return
        }
      } else if (type === 'scatter') {
        if (this.scatterList[0].childrenx.length !== 1 || this.scatterList[0].childreny.length !== 1) {
          this.$message({
            type: 'error',
            message: '请拖入度量数据!'
          })
          return
        }
      } else if (type === 'zuhe') {
        if (this.zuheList[0].childrenx.length !== 1) {
          this.$message({
            type: 'error',
            message: '请拖入维度数据!'
          })
          this.substrateFindOptions[this.isActive].layout[this.isTabelActive].isError = true
          return
        }
        if (this.zuheList[0].childreny1.length === 0) {
          this.$message({
            type: 'error',
            message: '请拖入Y轴(折线)度量数据!'
          })
          this.substrateFindOptions[this.isActive].layout[this.isTabelActive].isError = true
          return
        }
        if (this.zuheList[0].childreny.length === 0) {
          this.$message({
            type: 'error',
            message: '请拖入Y轴(柱状)度量数据!'
          })
          this.substrateFindOptions[this.isActive].layout[this.isTabelActive].isError = true
          return
        }
      }
      let list = []
      if (type === 'bar' || type === 'tiao' || type === 'duidie') {
        list = this.barList[1].children
      } else if (type === 'line') {
        list = this.lineList[1].children
      } else if (type === 'pie' || type === 'loudou') {
        list = this.pieList[1].children
      } else if (type === 'table' || type === 'tstab') {
        list = this.tableList[1].children
      } else if (type === 'scatter') {
        list = this.scatterList[1].children
      } else if (type === 'zuhe') {
        list = this.zuheList[1].children
      }
      let flag = false
      for (const item of list) {
        if (item.value === '' || item.conditions === '') {
          flag = true
        } else {
          this.substrateFindOptions[this.isActive].layout[this.isTabelActive].sql.filter.push({
            column: item.tableName + '.' + item.name,
            operator: item.conditions,
            value: item.value
          })
        }
      }
      if (flag) {
        this.$message({
          type: 'error',
          message: '请填写完整的过滤条件!'
        })
      }
      this.getReload(this.substrateFindOptions[this.isActive].layout[this.isTabelActive].sql, this.isTabelActive, this.substrateFindOptions[this.isActive].layout[this.isTabelActive].type)
    },
    // 删除过路条件
    deleteTJ(index) {
      this.$confirm('是否删除该度量？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const type = this.substrateFindOptions[this.isActive].layout[this.isTabelActive].type
        if (type === 'bar' || type === 'tiao' || type === 'duidie') {
          this.barList[1].children.splice(index, 1)
        } else if (type === 'line') {
          this.lineList[1].children.splice(index, 1)
        } else if (type === 'pie' || type === 'loudou') {
          this.pieList[1].children.splice(index, 1)
        } else if (type === 'table' || type === 'tstab') {
          this.tableList[1].children.splice(index, 1)
        } else if (type === 'scatter') {
          this.scatterList[1].children.splice(index, 1)
        } else if (type === 'zuhe') {
          this.zuheList[1].children.splice(index, 1)
        }
        this.getConditions()
        this.updateGL()
      })
    },
    // 拖入维度数据
    getlogbarwd(event) {
      const type = this.substrateFindOptions[this.isActive].layout[this.isTabelActive].type
      // 处理拖入度量数据时删除
      if (this.moveItem.type !== 'weidu') {
        this.$message({
          type: 'error',
          message: '请拖入维度数据!'
        })
        if (type === 'bar' || type === 'tiao' || type === 'duidie') {
          this.barList[0].childrenx.splice(this.barList[0].childrenx.length - 1, 1)
        } else if (type === 'line') {
          this.lineList[0].childreny.splice(this.lineList[0].childreny.length - 1, 1)
        } else if (type === 'zuhe') {
          this.zuheList[0].childrenx.splice(this.zuheList[0].childrenx.length - 1, 1)
        } else if (type === 'leida') {
          this.leidaList[0].childrenx.splice(this.leidaList[0].childrenx.length - 1, 1)
        }
        return
      }
      // 维度数据目前只支持单个数据
      if (type === 'bar' || type === 'tiao' || type === 'duidie') {
        this.barList[0].childrenx = [this.moveItem]
      } else if (type === 'line') {
        this.lineList[0].childrenx = [this.moveItem]
      } else if (type === 'pie' || type === 'loudou') {
        this.pieList[0].childrenx = [this.moveItem]
      } else if (type === 'zuhe') {
        this.zuheList[0].childrenx = [this.moveItem]
      }
      // 获取数据
      this.getDataByUrl()
      this.rightEnd()
    },
    // 拖入度量数据
    getlogbardl1(event) {
      // 处理拖入维度数据时删除
      if (this.moveItem.type !== 'duliang') {
        this.$message({
          type: 'error',
          message: '请拖入度量数据!'
        })
        this.scatterList[0].childrenx.splice(this.scatterList[0].childrenx.length - 1, 1)
        return
      }
      // 维度数据目前只支持单个数据
      this.scatterList[0].childrenx = [this.moveItem]
      this.getDataByUrl()
      this.rightEnd()
    },
    // 拖入度量数据
    getlogbardl2(event) {
      const type = this.substrateFindOptions[this.isActive].layout[this.isTabelActive].type
      // 处理拖入维度数据时删除
      if (this.moveItem.type !== 'duliang') {
        this.$message({
          type: 'error',
          message: '请拖入度量数据!'
        })
        if (type === 'zuhe') {
          this.zuheList[0].childreny1.splice(this.zuheList[0].childreny1.length - 1, 1)
        } else {
          this.scatterList[0].childreny.splice(this.scatterList[0].childreny.length - 1, 1)
        }
        return
      }
      // 散点数据目前只支持单个数据
      if (type === 'zuhe') {
        this.zuheList[0].childreny1 = [this.moveItem]
      } else {
        this.scatterList[0].childreny = [this.moveItem]
      }
      this.getDataByUrl()
      this.rightEnd()
    },
    // 拖入度量数据
    getlogbardl(event) {
      const type = this.substrateFindOptions[this.isActive].layout[this.isTabelActive].type
      // 处理拖入维度数据时删除
      if (this.moveItem.type !== 'duliang' && type !== 'table' && type !== 'tstab') {
        this.$message({
          type: 'error',
          message: '请拖入度量数据!'
        })
        if (type === 'bar' || type === 'tiao' || type === 'duidie') {
          this.barList[0].childreny.splice(this.barList[0].childreny.length - 1, 1)
        } else if (type === 'line') {
          this.lineList[0].childreny.splice(this.lineList[0].childreny.length - 1, 1)
        } else if (type === 'pie' || type === 'loudou') {
          this.pieList[0].childreny.splice(this.lineList[0].childreny.length - 1, 1)
        } else if (type === 'zuhe') {
          this.zuheList[0].childreny.splice(this.zuheList[0].childreny.length - 1, 1)
        } else if (type === 'zuhe') {
          this.leidaList[0].childreny.splice(this.leidaList[0].childreny.length - 1, 1)
        }
        return
      }
      // 处理拖入重复key值
      if (type === 'bar' || type === 'tiao' || type === 'duidie') {
        for (let i = 0; i < this.barList[0].childreny.length; i++) {
          let flag = false
          for (let x = 0; x < this.barList[0].childreny.length; x++) {
            if (i !== x && this.barList[0].childreny[x].id === this.barList[0].childreny[i].id) {
              this.barList[0].childreny.splice(x, 1)
              flag = true
              break
            }
          }
          if (flag) {
            break
          }
        }
        // 暂时处理不同表清除数据
        if (this.barList[0].childreny.length > 0 && this.barList[0].childreny[0].tableName !== this.moveItem.tableName) {
          if (this.barList[0].childrenx.length > 0 && this.barList[0].childrenx[0].tableName !== this.moveItem.tableName) {
            this.barList[0].childrenx = []
          }
          this.barList[0].childreny = [this.moveItem]
        }
      } else if (type === 'line') {
        for (let i = 0; i < this.lineList[0].childreny.length; i++) {
          let flag = false
          for (let x = 0; x < this.lineList[0].childreny.length; x++) {
            if (i !== x && this.lineList[0].childreny[x].id === this.lineList[0].childreny[i].id) {
              this.lineList[0].childreny.splice(x, 1)
              flag = true
              break
            }
          }
          if (flag) {
            break
          }
        }
        // 暂时处理不同表清除数据
        if (this.lineList[0].childreny.length > 0 && this.lineList[0].childreny[0].tableName !== this.moveItem.tableName) {
          if (this.lineList[0].childrenx.length > 0 && this.lineList[0].childrenx[0].tableName !== this.moveItem.tableName) {
            this.lineList[0].childrenx = []
          }
          this.lineList[0].childreny = [this.moveItem]
        }
      } else if (type === 'table' || type === 'tstab') {
        for (let i = 0; i < this.tableList[0].childreny.length; i++) {
          let flag = false
          for (let x = 0; x < this.tableList[0].childreny.length; x++) {
            if (i !== x && this.tableList[0].childreny[x].id === this.tableList[0].childreny[i].id) {
              this.tableList[0].childreny.splice(x, 1)
              flag = true
              break
            }
          }
          if (flag) {
            break
          }
        }
        // 暂时处理不同表清除数据
        if (this.tableList[0].childreny.length > 0 && this.tableList[0].childreny[0].tableName !== this.moveItem.tableName) {
          this.tableList[0].childreny = [this.moveItem]
        }
      } else if (type === 'pie' || type === 'loudou') {
        this.pieList[0].childreny = [this.moveItem]
        // 暂时处理不同表清除数据
        if (this.pieList[0].childrenx.length > 0 && this.pieList[0].childrenx[0].tableName !== this.moveItem.tableName) {
          this.pieList[0].childrenx = []
        }
      } else if (type === 'zuhe') {
        for (let i = 0; i < this.zuheList[0].childreny.length; i++) {
          let flag = false
          for (let x = 0; x < this.zuheList[0].childreny.length; x++) {
            if (i !== x && this.zuheList[0].childreny[x].id === this.zuheList[0].childreny[i].id) {
              this.zuheList[0].childreny.splice(x, 1)
              flag = true
              break
            }
          }
          if (flag) {
            break
          }
        }
        // 暂时处理不同表清除数据
        if (this.zuheList[0].childreny.length > 0 && this.zuheList[0].childreny[0].tableName !== this.moveItem.tableName) {
          if (this.zuheList[0].childrenx.length > 0 && this.zuheList[0].childrenx[0].tableName !== this.moveItem.tableName) {
            this.zuheList[0].childrenx = []
          }
          this.zuheList[0].childreny = [this.moveItem]
        }
      } else if (type === 'leida') {
        for (let i = 0; i < this.leidaList[0].childreny.length; i++) {
          let flag = false
          for (let x = 0; x < this.leidaList[0].childreny.length; x++) {
            if (i !== x && this.leidaList[0].childreny[x].id === this.leidaList[0].childreny[i].id) {
              this.leidaList[0].childreny.splice(x, 1)
              flag = true
              break
            }
          }
          if (flag) {
            break
          }
        }
        // 暂时处理不同表清除数据
        if (this.leidaList[0].childreny.length > 0 && this.leidaList[0].childreny[0].tableName !== this.moveItem.tableName) {
          if (this.leidaList[0].childrenx.length > 0 && this.leidaList[0].childrenx[0].tableName !== this.moveItem.tableName) {
            this.leidaList[0].childrenx = []
          }
          this.leidaList[0].childreny = [this.moveItem]
        }
        console.log(this.leidaList[0].childreny)
      }
      this.getDataByUrl()
      this.rightEnd()
    },
    // 拖入度量数据
    getlogbardlX(event) {
      const type = this.substrateFindOptions[this.isActive].layout[this.isTabelActive].type
      // 处理拖入维度数据时删除
      if (this.moveItem.type !== 'duliang' && type !== 'table' && type !== 'tstab') {
        this.$message({
          type: 'error',
          message: '请拖入度量数据!'
        })
        if (type === 'zuhe') {
          this.zuheList[0].childreny1.splice(this.zuheList[0].childreny1.length - 1, 1)
        }
        return
      }
      // 处理拖入重复key值
      if (type === 'zuhe') {
        for (let i = 0; i < this.zuheList[0].childreny1.length; i++) {
          let flag = false
          for (let x = 0; x < this.zuheList[0].childreny1.length; x++) {
            if (i !== x && this.zuheList[0].childreny1[x].id === this.zuheList[0].childreny1[i].id) {
              this.zuheList[0].childreny1.splice(x, 1)
              flag = true
              break
            }
          }
          if (flag) {
            break
          }
        }
      }
      this.getDataByUrl()
      this.rightEnd()
    },
    // 拖入的数据生成参数
    getDataByUrl() {
      this.setitem()
      loadByUrl(this.substrateFindOptions, this.isActive, this.isTabelActive, this.barList, this.lineList, this.pieList, this.tableList, this.scatterList, this.zuheList, this.leidaList, this.tabsInfo, this.baseName, this)
    },
    // 删除维度或度量数据start
    deleteItems(index) {
      this.$confirm('是否删除该度量？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const type = this.substrateFindOptions[this.isActive].layout[this.isTabelActive].type
        if (type === 'bar' || type === 'tiao' || type === 'duidie') {
          this.barList[0].childreny.splice(index, 1)
        } else if (type === 'line') {
          this.lineList[0].childreny.splice(index, 1)
        } else if (type === 'pie' || type === 'loudou') {
          this.pieList[0].childreny.splice(index, 1)
        } else if (type === 'table' || type === 'tstab') {
          this.tableList[0].childreny.splice(index, 1)
        } else if (type === 'zuhe') {
          this.zuheList[0].childreny.splice(index, 1)
        } else if (type === 'leida') {
          this.leidaList[0].childreny.splice(index, 1)
        }
        this.getDataByUrl()
      })
    },
    // 删除维度或度量数据start
    deleteItemswd(index) {
      this.$confirm('是否删除该维度？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const type = this.substrateFindOptions[this.isActive].layout[this.isTabelActive].type
        if (type === 'bar' || type === 'tiao' || type === 'duidie') {
          this.barList[0].childrenx.splice(index, 1)
        } else if (type === 'line') {
          this.lineList[0].childrenx.splice(index, 1)
        } else if (type === 'pie' || type === 'loudou') {
          this.pieList[0].childrenx.splice(index, 1)
        } else if (type === 'table' || type === 'tstab') {
          this.tableList[0].childrenx.splice(index, 1)
        } else if (type === 'zuhe') {
          this.zuheList[0].childrenx.splice(index, 1)
        } else if (type === 'leida') {
          this.leidaList[0].childrenx.splice(index, 1)
        }
        this.getDataByUrl()
      })
    },
    deleteItemsx(index) {
      this.$confirm('是否删除该度量？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const type = this.substrateFindOptions[this.isActive].layout[this.isTabelActive].type
        if (type === 'zuhe') {
          this.zuheList[0].childreny1.splice(index, 1)
        }
        this.getDataByUrl()
      })
    },
    deleteItems1(index) {
      this.$confirm('是否删除该度量？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.scatterList[0].childrenx.splice(index, 1)
        this.getDataByUrl()
      })
    },
    deleteItems2(index) {
      this.$confirm('是否删除该度量？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.scatterList[0].childreny.splice(index, 1)
        this.getDataByUrl()
      })
    },
    // 删除维度或度量数据end
    // webdatarock 处理工具按钮（目前不用）
    toolbars(toolbar) {
      var tabs = toolbar.getTabs()
      toolbar.getTabs = function() {
        delete tabs[1]
        return tabs
      }
    },
    // 加载遍历编辑页面数据展示
    reloadInfo() {
      for (let i = 0; i < this.substrateFindOptions[this.isActive].layout.length; i++) {
        if (this.substrateFindOptions[this.isActive].layout[i].type !== 'search') {
          if (this.substrateFindOptions[this.isActive].layout[i].sql.measures.length !== 0 || this.substrateFindOptions[this.isActive].layout[i].sql.dimensions.length !== 0) {
            this.getReload(this.substrateFindOptions[this.isActive].layout[i].sql, i, this.substrateFindOptions[this.isActive].layout[i].type)
          } else if (this.substrateFindOptions[this.isActives].layout[i].type === 'tstab') {
            this.setpoit(this.substrateFindOptions[this.isActives].layout[i].type + this.substrateFindOptions[this.isActives].layout[i].i)
          }
        }
      }
    },
    // 编辑页通过sql参数获取数据
    getReload(sql, i, type) {
      this.listLoading = true
      this.getReloadx(sql, i, type, this.substrateFindOptions, this.isActive, this.listLoading)
    },
    // 编辑页面加载数据
    getReloadx(sql, i, type, obj, isActive, listLoading) {
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
            container: '#tstab' + obj[isActive].layout[i].i,
            global: {
              localization: barcn
            },
            // toolbar: true,
            // beforetoolbarcreated: this.toolbars,
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
              // obj[isActive].layout[i].options.series[x].name = keys[x]
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
              obj[isActive].layout[i].options.series[x].name = keys[x]
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
                  show: obj[isActive].layout[i].opt.dataIsShow,
                  position: obj[isActive].layout[i].opt.dataposition
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
    },
    // 是否展示页签背景辅助线
    pageInfo() {
      if (this.substrateFindOptions[this.isActive].isAuxiliary) {
        this.substrateFindOptions[this.isActive].isAuxiliary = false
        // 处理辅助线展示的bug
        const _this = this
        setTimeout(() => {
          _this.substrateFindOptions[this.isActive].isAuxiliary = true
          _this.setHistory()
        }, 100)
      }
    },
    // 修改普通表每页分页数
    isshowpage() {
      const num = parseInt(this.pageSize + '')
      if (num > 10000) {
        this.$confirm('数据超过10000，加载将变缓慢，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.substrateFindOptions[this.isActive].layout[this.isTabelActive].pageInfo.pageNum = 1
          this.substrateFindOptions[this.isActive].layout[this.isTabelActive].pageInfo.pageSize = num
          // 改变分页数后重新请求数据
          this.getDataByUrl()
        }, () => {
          this.pageSize = this.substrateFindOptions[this.isActive].layout[this.isTabelActive].pageInfo.pageSize
        })
      } else {
        this.substrateFindOptions[this.isActive].layout[this.isTabelActive].pageInfo.pageNum = 1
        this.substrateFindOptions[this.isActive].layout[this.isTabelActive].pageInfo.pageSize = num
        // 改变分页数后重新请求数据
        this.getDataByUrl()
      }
    },
    // 获取联动数组
    getLDList() {
      if (this.isTabelActive < 0) {
        return
      }
      this.ldList = []
      const type = this.substrateFindOptions[this.isActive].layout[this.isTabelActive].type
      if (type !== 'table' && type !== 'tstab') {
        for (let x = 0; x < this.substrateFindOptions[this.isActive].layout.length; x++) {
          if (x !== this.isTabelActive) {
            this.ldList.push({
              id: this.substrateFindOptions[this.isActive].layout[x].i,
              name: this.substrateFindOptions[this.isActive].layout[x].title.text === '' ? ('未命名' + this.substrateFindOptions[this.isActive].layout[x].type) : this.substrateFindOptions[this.isActive].layout[x].title.text
            })
          }
        }
      }
    },
    // 图联动点击
    chartAllClick(e) {
      const _this = this
      setTimeout(function() {
        const ldsql = []
        if (_this.substrateFindOptions[_this.isActive].layout[_this.isTabelActive].ldList.length > 0) {
          const type = _this.substrateFindOptions[_this.isActive].layout[_this.isTabelActive].type
          if (type === 'bar' || type === 'pie' || type === 'line' || type === 'duidie' || type === 'loudou' || type === 'zuhe' || type === 'tiao') {
            const key = _this.substrateFindOptions[_this.isActive].layout[_this.isTabelActive].xList[0]
            ldsql.push({
              column: key.tableName + '.' + key.name,
              operator: '=',
              value: e.name
            })
          }
          for (const item of _this.substrateFindOptions[_this.isActive].layout[_this.isTabelActive].ldList) {
            let ks = -1
            for (let i = 0; i < _this.substrateFindOptions[_this.isActive].layout.length; i++) {
              if (item === _this.substrateFindOptions[_this.isActive].layout[i].i) {
                ks = i
                break
              }
            }
            if (ks > -1) {
              _this.substrateFindOptions[_this.isActive].layout[ks].ldsql = ldsql
              _this.getReload(_this.substrateFindOptions[_this.isActive].layout[ks].sql, ks, _this.substrateFindOptions[_this.isActive].layout[ks].type)
            }
          }
        }
      }, 200)
    },
    // 还原联动初始
    resetLD(index) {
      for (const item of this.substrateFindOptions[this.isActive].layout[this.isTabelActive].ldList) {
        let ks = -1
        for (let i = 0; i < this.substrateFindOptions[this.isActive].layout.length; i++) {
          if (item === this.substrateFindOptions[this.isActive].layout[i].i) {
            ks = i
            break
          }
        }
        if (ks > -1) {
          this.substrateFindOptions[this.isActive].layout[ks].ldsql = []
          this.getReload(this.substrateFindOptions[this.isActive].layout[ks].sql, ks, this.substrateFindOptions[this.isActive].layout[ks].type)
        }
      }
    },
    // 清除数据
    clearInfo() {
      const type = this.substrateFindOptions[this.isActive].layout[this.isTabelActive].type
      if (type === 'bar' || type === 'tiao' || type === 'duidie') {
        this.barList[0].childrenx = []
        this.barList[0].childreny = []
        this.barList[1].children = []
      } else if (type === 'line') {
        this.lineList[0].childrenx = []
        this.lineList[0].childreny = []
        this.lineList[1].children = []
      } else if (type === 'pie' || type === 'loudou') {
        this.pieList[0].childrenx = []
        this.pieList[0].childreny = []
        this.pieList[1].children = []
      } else if (type === 'scatter') {
        this.scatterList[0].childrenx = []
        this.scatterList[0].childreny = []
        this.scatterList[1].children = []
      } else if (type === 'table' || type === 'tstab') {
        this.tableList[0].childrenx = []
        this.tableList[0].childreny = []
        this.tableList[1].children = []
      } else if (type === 'zuhe') {
        this.zuheList[0].childrenx = []
        this.zuheList[0].childreny = []
        this.zuheList[0].childreny1 = []
        this.zuheList[1].children = []
      }
    },
    // 当前编辑页点击新增图时，判断添加何种图
    picClick(item, row) {
      this.clientWidth = document.getElementById('conentid').clientWidth * 0.9
      // 判断不同宽度下图展示宽度
      const ys = document.getElementById('conentid').clientWidth >= 1050 ? 8 : ((document.getElementById('conentid').clientWidth < 1050 && document.getElementById('conentid').clientWidth >= 900) ? 10 : 12)
      // 添加新图时，获取需要添加新图的位置x,y
      let x = 0
      let y = 0
      let xs = 0
      let ysx = 0
      let ws = 0
      let hs = 0
      // 按照id正序排序
      this.substrateFindOptions[this.isActives].layout.sort(function(a, b) {
        return a.i - b.i
      })
      // 获取最新id
      const ids = this.substrateFindOptions[this.isActive].layout.length === 0 ? 0 : this.substrateFindOptions[this.isActive].layout[this.substrateFindOptions[this.isActive].layout.length - 1].i + 1
      // 按照x位置排序
      this.substrateFindOptions[this.isActives].layout.sort(function(a, b) {
        if (a.x !== b.x) {
          return a.x - b.x
        } else {
          return a.y - b.y
        }
      })
      // 获取编辑页最下面的图宽高
      if (this.substrateFindOptions[this.isActive].layout.length !== 0) {
        xs = this.substrateFindOptions[this.isActive].layout[this.substrateFindOptions[this.isActive].layout.length - 1].x
        ysx = this.substrateFindOptions[this.isActive].layout[this.substrateFindOptions[this.isActive].layout.length - 1].y
        ws = this.substrateFindOptions[this.isActive].layout[this.substrateFindOptions[this.isActive].layout.length - 1].w
        hs = this.substrateFindOptions[this.isActive].layout[this.substrateFindOptions[this.isActive].layout.length - 1].h
      }
      // 判断新图的位置
      if ((ws + xs + ys) < 25) {
        x = ws + xs
        y = ysx
      } else {
        x = 0
        y = ysx + hs
      }
      this.substrateFindOptions[this.isActive].layout.push(setChart(x, y, ys, ids, row))
      // 添加后定位到该图进行编辑
      this.isTabelActive = this.substrateFindOptions[this.isActive].layout.length - 1
      this.clearInfo()
      this.getLDList()
      this.setSingele()
      this.setHistory()
    },
    tableClick(item, row) {
      this.clientWidth = document.getElementById('conentid').clientWidth * 0.9
      let y = 0
      // 按照id正序排序
      this.substrateFindOptions[this.isActives].layout.sort(function(a, b) {
        return a.i - b.i
      })
      let hs = 0
      let ysx = 0
      // 获取最新id
      const ids = this.substrateFindOptions[this.isActive].layout.length === 0 ? 0 : this.substrateFindOptions[this.isActive].layout[this.substrateFindOptions[this.isActive].layout.length - 1].i + 1
      // 按照x位置排序
      this.substrateFindOptions[this.isActives].layout.sort(function(a, b) {
        if (a.x !== b.x) {
          return a.x - b.x
        } else {
          return a.y - b.y
        }
      })
      if (this.substrateFindOptions[this.isActive].layout.length !== 0) {
        ysx = this.substrateFindOptions[this.isActive].layout[this.substrateFindOptions[this.isActive].layout.length - 1].y
        hs = this.substrateFindOptions[this.isActive].layout[this.substrateFindOptions[this.isActive].layout.length - 1].h
      }
      // 判断新图的位置
      y = ysx + hs
      this.substrateFindOptions[this.isActive].layout.push(setTable(row, ids, y))
      // 添加后定位到该图进行编辑
      this.isTabelActive = this.substrateFindOptions[this.isActive].layout.length - 1
      if (row.$slots.default[1].text.indexOf('透视表') > -1) {
        const _this = this
        setTimeout(function() {
          _this.setpoit('tstab' + ids)
        }, 500)
        this.tableList = JSON.parse(tableinfo1())
      } else {
        this.tableList = JSON.parse(tableinfo())
      }
      this.clearInfo()
      this.setSingele()
      this.setHistory()
    },
    // 全局搜索框
    filterClick(item, row) {
      // 获取最新id
      const ids = this.substrateFindOptions[this.isActive].layout.length === 0 ? 0 : this.substrateFindOptions[this.isActive].layout[this.substrateFindOptions[this.isActive].layout.length - 1].i + 1
      // 初始化全局搜索，searchinput为所有所搜条件
      var data = { x: 0, y: 0, w: 24, h: 5, i: ids, isError: false, isSearch: false, type: 'search', static: true, searchinput: [], title: {
        show: true,
        text: '',
        left: 'left',
        textStyle: {
          color: '#666666',
          fontSize: 14
        }
      }}
      let getNum = -1
      for (let i = 0; i < this.substrateFindOptions[this.isActive].layout.length; i++) {
        if (this.substrateFindOptions[this.isActive].layout[i].type === 'search') {
          // 遍历查看页面是否已经有搜错条件
          data = this.substrateFindOptions[this.isActive].layout[i]
          getNum = i
          break
        }
      }
      setSearch(row, data, ids)
      // 定位搜索框位置
      if (getNum === -1) {
        this.substrateFindOptions[this.isActive].layout.push(data)
        this.isTabelActive = 0
        this.isSearchActive = 0
      } else {
        this.substrateFindOptions[this.isActive].layout[getNum] = data
        this.isSearchActive = data.searchinput.length - 1
        this.isTabelActive = getNum
      }
    },
    // 页面图和表拖拽结束后触发
    resizedEvent(i, newH, newW, newHPx, newWPx) {
      for (let x = 0; x < this.substrateFindOptions[this.isActive].layout.length; x++) {
        if (this.substrateFindOptions[this.isActive].layout[x].i === i) {
          this.substrateFindOptions[this.isActive].layout[x].type = this.substrateFindOptions[this.isActive].layout[x].type.substring(3)
          if (this.substrateFindOptions[this.isActive].layout[x].type === 'tstab') {
            if (this.substrateFindOptions[this.isActive].layout[x].sql.measures.length !== 0 || this.substrateFindOptions[this.isActive].layout[x].sql.dimensions.length !== 0) {
              this.getReload(this.substrateFindOptions[this.isActive].layout[i].sql, i, this.substrateFindOptions[this.isActive].layout[i].type)
            } else {
              this.setpoit(this.substrateFindOptions[this.isActive].layout[x].type + this.substrateFindOptions[this.isActive].layout[x].i)
            }
          }
          break
        }
      }
      this.setHistory()
    },
    // 页面图和表拖拽过程中触发
    resizeEvents(i, newH, newW, newHPx, newWPx) {
      for (let x = 0; x < this.substrateFindOptions[this.isActive].layout.length; x++) {
        if (this.substrateFindOptions[this.isActive].layout[x].i === i && this.substrateFindOptions[this.isActive].layout[x].type.indexOf('fix') < 0) {
          this.substrateFindOptions[this.isActive].layout[x].type = 'fix' + this.substrateFindOptions[this.isActive].layout[x].type
          break
        }
      }
    },
    // 删除当前编辑页的图或表
    deleteItem(index) {
      this.$confirm('是否删除该数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.isTabelActive = -1
        this.substrateFindOptions[this.isActive].layout.splice(index, 1)
      })
    },
    // 删除搜索
    deleteSearch(index, indexs) {
      this.$confirm('是否删除该数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.isSearchActive = -1
        this.substrateFindOptions[this.isActive].layout[index].searchinput.splice(indexs, 1)
      })
    },
    // 修改图或表的标题位置
    settitlect(type) {
      this.substrateFindOptions[this.isActive].layout[this.isTabelActive].title.left = type
      this.setHistory()
    },
    // 修改图或表的图例位置(左、中、右)
    settitlelg(type) {
      this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.legend.left = type
      this.setHistory()
    },
    // 修改图或表的图例位置(上、下)
    settitlelgs(type) {
      this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.legend.top = type
      this.setHistory()
    },
    // 修改图或表的提示方式
    settitletip(type) {
      this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.tooltip.triggerOn = type
      this.setHistory()
    },
    // 图是否展示数据标签
    setDataiS() {
      for (let i = 0; i < this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.series.length; i++) {
        this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.series[i].label.show = this.dataIsShow
      }
      this.setHistory()
    },
    // 修改折现样式
    settitleline(flag) {
      this.lineFlag = flag
      for (let i = 0; i < this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.series.length; i++) {
        if (this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.series[i].type === 'line') {
          this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.series[i].smooth = flag
        }
      }
      this.setHistory()
    },
    // 修改雷达图样式
    settitleleida(flag) {
      this.lineFlag = flag
      this.substrateFindOptions[this.isActive].layout[this.isTabelActive].opt.lineFlag = flag
      for (let i = 0; i < this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.length; i++) {
        if (flag) {
          this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options[i].radar.shape = 'polygon'
        } else {
          this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options[i].radar.shape = 'circle'
        }
      }
      this.setHistory()
    },
    // 雷达图是否展示数据标签
    setDataiSld() {
      this.substrateFindOptions[this.isActive].layout[this.isTabelActive].opt.dataIsShow = this.dataIsShow
      for (let i = 0; i < this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.length; i++) {
        this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options[i].series.label.show = this.dataIsShow
      }
      this.setHistory()
    },
    // 修改雷达图例是否显示
    setldtl() {
      this.substrateFindOptions[this.isActive].layout[this.isTabelActive].opt.legendShow = this.legendShow
      for (let i = 0; i < this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.length; i++) {
        this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options[i].legend.show = this.legendShow
      }
      this.setHistory()
    },
    // 修改雷达提示是否显示
    setldtlst() {
      this.substrateFindOptions[this.isActive].layout[this.isTabelActive].opt.tooltipShow = this.tooltipShow
      for (let i = 0; i < this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.length; i++) {
        this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options[i].tooltip.show = this.tooltipShow
      }
      this.setHistory()
    },
    // 修改雷达图例位置
    settitleld(type) {
      this.legendTop = type
      this.substrateFindOptions[this.isActive].layout[this.isTabelActive].opt.legendTop = this.legendTop
      for (let i = 0; i < this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.length; i++) {
        this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options[i].legend.top = this.legendTop
      }
      this.setHistory()
    },
    // 修改雷达图例位置
    settitlelds(type) {
      this.legendLeft = type
      this.substrateFindOptions[this.isActive].layout[this.isTabelActive].opt.legendTop = this.legendLeft
      for (let i = 0; i < this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.length; i++) {
        this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options[i].legend.left = this.legendLeft
      }
      this.setHistory()
    },
    // 修改雷达图顶点名称大小
    setDdisng() {
      this.substrateFindOptions[this.isActive].layout[this.isTabelActive].maxList = this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options[0].radar.indicator
      this.setHistory()
    },
    // 修改图或表的数据标签展示位置
    settitledat(type) {
      this.dataposition = type
      this.substrateFindOptions[this.isActive].layout[this.isTabelActive].opt.dataposition = this.dataposition
      for (let i = 0; i < this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.series.length; i++) {
        this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.series[i].label.position = type
      }
      this.setHistory()
    },
    // 修改饼状图的起始角度
    setradius() {
      this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.series[0].radius = [this.defaultRadiusst + '%', this.defaultRadius + '%']
    },
    // 修改饼状图是否玫瑰图形展示
    roseTypes() {
      this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.series[0].roseType = this.roseType ? 'area' : ''
      this.setHistory()
    },
    // 获取搜索定位
    getSearchActive(index, type) {
      this.isSearchActive = index
      for (let x = 0; x < this.substrateFindOptions[this.isActive].layout.length; x++) {
        if (this.substrateFindOptions[this.isActive].layout[x].type === 'search') {
          this.isTabelActive = x
          break
        }
      }
      if (this.substrateFindOptions[this.isActive].layout[this.isTabelActive].searchinput[this.isSearchActive].type === 'single') {
        this.searchList[0].children = []
        for (const item of this.substrateFindOptions[this.isActive].layout[this.isTabelActive].searchinput[this.isSearchActive].list) {
          this.searchList[0].children.push(item)
        }
      }
    },
    // 编辑图标参数时，记录历史
    setfuzhu() {
      this.setHistory()
    },
    // 编辑图例名称和颜色
    setitem() {
      console.log(this.substrateFindOptions[this.isActive].layout[this.isTabelActive])
      this.substrateFindOptions[this.isActive].layout[this.isTabelActive].infoList = []
      const type = this.substrateFindOptions[this.isActive].layout[this.isTabelActive].type
      if (type === 'bar' || type === 'tiao' || type === 'duidie') {
        for (let y = 0; y < this.barList[0].childreny.length; y++) {
          let flag = -1
          for (let i = 0; i < this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.series.length; i++) {
            const nams = this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.series[i].name.split('.')
            if (nams[1] === this.barList[0].childreny[y].name) {
              flag = i
              break
            }
          }
          if (flag > -1) {
            this.substrateFindOptions[this.isActive].layout[this.isTabelActive].infoList.push({
              name: this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.series[flag].name,
              color: this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.series[flag].itemStyle.color
            })
          } else {
            this.substrateFindOptions[this.isActive].layout[this.isTabelActive].infoList.push({
              name: this.barList[0].childreny[y].tableName + '.' + this.barList[0].childreny[y].name,
              color: y === 0 ? '#009494' : ''
            })
          }
        }
      } else if (type === 'line') {
        for (let y = 0; y < this.lineList[0].childreny.length; y++) {
          let flag = -1
          for (let i = 0; i < this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.series.length; i++) {
            const nams = this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.series[i].name.split('.')
            if (nams[1] === this.lineList[0].childreny[y].name) {
              flag = i
              break
            }
          }
          if (flag > -1) {
            this.substrateFindOptions[this.isActive].layout[this.isTabelActive].infoList.push({
              name: this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.series[flag].name,
              color: this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.series[flag].itemStyle.color
            })
          } else {
            this.substrateFindOptions[this.isActive].layout[this.isTabelActive].infoList.push({
              name: this.lineList[0].childreny[y].tableName + '.' + this.lineList[0].childreny[y].name,
              color: y === 0 ? '#009494' : ''
            })
          }
        }
      } else if (type === 'pie' || type === 'loudou') {
        for (let y = 0; y < this.pieList[0].childreny.length; y++) {
          for (let i = 0; i < this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.series[0].data.length; i++) {
            this.substrateFindOptions[this.isActive].layout[this.isTabelActive].infoList.push({
              name: this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.series[0].data[i],
              color: this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.series[0].data[i].itemStyle.color
            })
          }
        }
      } else if (type === 'scatter') {
        for (let i = 0; i < this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.series.length; i++) {
          this.substrateFindOptions[this.isActive].layout[this.isTabelActive].infoList.push({
            name: this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.series[i].name,
            color: this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.series[i].itemStyle.color
          })
        }
      } else if (type === 'zuhe') {
        for (let y = 0; y < this.zuheList[0].childreny.length; y++) {
          let flag = -1
          for (let i = 0; i < this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.series.length; i++) {
            const nams = this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.series[i].name.split('.')
            if (nams[1] === this.zuheList[0].childreny[y].name) {
              flag = i
              break
            }
          }
          if (flag > -1) {
            this.substrateFindOptions[this.isActive].layout[this.isTabelActive].infoList.push({
              name: this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.series[flag].name,
              color: this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.series[flag].itemStyle.color
            })
          } else {
            this.substrateFindOptions[this.isActive].layout[this.isTabelActive].infoList.push({
              name: this.zuheList[0].childreny[y].tableName + '.' + this.zuheList[0].childreny[y].name,
              color: ''
            })
          }
        }
        for (let y = 0; y < this.zuheList[0].childreny1.length; y++) {
          let flag = -1
          for (let i = 0; i < this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.series.length; i++) {
            const nams = this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.series[i].name.split('.')
            if (nams[1] === this.zuheList[0].childreny1[y].name) {
              flag = i
              break
            }
          }
          if (flag > -1) {
            this.substrateFindOptions[this.isActive].layout[this.isTabelActive].infoList.push({
              name: this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.series[flag].name,
              color: this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.series[flag].itemStyle.color
            })
          } else {
            this.substrateFindOptions[this.isActive].layout[this.isTabelActive].infoList.push({
              name: this.zuheList[0].childreny1[y].tableName + '.' + this.zuheList[0].childreny1[y].name,
              color: ''
            })
          }
        }
      }
      console.log(this.substrateFindOptions[this.isActive].layout[this.isTabelActive].infoList)
    },
    // 全局搜索条件
    searchByFilter(type) {
      const sql = []
      for (let x = 0; x < this.substrateFindOptions[this.isActive].layout.length; x++) {
        if (this.substrateFindOptions[this.isActive].layout[x].type === 'search') {
          for (const item of this.substrateFindOptions[this.isActive].layout[x].searchinput) {
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
      console.log(sql)
      for (let i = 0; i < this.substrateFindOptions[this.isActive].layout.length; i++) {
        this.substrateFindOptions[this.isActive].layout[i].qjsql = sql
      }
      this.reloadInfo()
    },
    // 打开预览
    view(id) {
      this.showDiaLog = true
    },
    // 关闭预览
    dialogFalse(val) {
      this.showDiaLog = val.dialog
    },
    // 新增单选框
    handleAdd() {
      this.substrateFindOptions[this.isActive].layout[this.isTabelActive].searchinput[this.isSearchActive].list.push({
        text: '单选框' + (this.substrateFindOptions[this.isActive].layout[this.isTabelActive].searchinput[this.isSearchActive].list.length + 1),
        label: '' + (this.substrateFindOptions[this.isActive].layout[this.isTabelActive].searchinput[this.isSearchActive].list.length + 1)
      })
    },
    // 删除单选框
    handleDelete(index) {
      this.$confirm('是否删除该单选框？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.substrateFindOptions[this.isActive].layout[this.isTabelActive].searchinput[this.isSearchActive].list.splice(index, 1)
      })
    },
    // 预览或编辑时，点击某个图或表二，获取index，并初始化编辑内容
    getinfo(item, index) {
      if (this.isTabelActive !== -1) {
        this.clearInfo()
      }
      this.isTabelActive = index
      if (this.isTabelActive < 0) {
        return
      }
      if (this.substrateFindOptions[this.isActive].layout[this.isTabelActive].pageInfo === undefined) {
        this.substrateFindOptions[this.isActive].layout[this.isTabelActive].pageInfo = {
          show: true,
          pageNum: 1,
          pageSize: 10000,
          totalPage: 10
        }
      }
      this.pageSize = this.substrateFindOptions[this.isActive].layout[this.isTabelActive].pageInfo.pageSize
      this.getLDList()
      this.moveItem = null
      this.setSingele()
    },
    setSingele() {
      const type = this.substrateFindOptions[this.isActive].layout[this.isTabelActive].type
      if (type === 'line') {
        this.lineFlag = this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.series[0].smooth
        this.dataposition = this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.series[0].label.position
        this.dataIsShow = this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.series[0].label.show
        for (const item of this.substrateFindOptions[this.isActive].layout[this.isTabelActive].xList) {
          this.lineList[0].childrenx.push(item)
        }
        for (const item of this.substrateFindOptions[this.isActive].layout[this.isTabelActive].yList) {
          this.lineList[0].childreny.push(item)
        }
        for (const item of this.substrateFindOptions[this.isActive].layout[this.isTabelActive].condList) {
          this.lineList[1].children.push(item)
        }
      } else if (type === 'bar' || type === 'tiao' || type === 'scatter' || type === 'duidie') {
        this.dataposition = this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.series[0].label.position
        this.dataIsShow = this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.series[0].label.show
        if (type === 'bar' || type === 'tiao' || type === 'duidie') {
          for (const item of this.substrateFindOptions[this.isActive].layout[this.isTabelActive].xList) {
            this.barList[0].childrenx.push(item)
          }
          for (const item of this.substrateFindOptions[this.isActive].layout[this.isTabelActive].yList) {
            this.barList[0].childreny.push(item)
          }
          for (const item of this.substrateFindOptions[this.isActive].layout[this.isTabelActive].condList) {
            this.barList[1].children.push(item)
          }
        } else {
          for (const item of this.substrateFindOptions[this.isActive].layout[this.isTabelActive].xList) {
            this.scatterList[0].childrenx.push(item)
          }
          for (const item of this.substrateFindOptions[this.isActive].layout[this.isTabelActive].yList) {
            this.scatterList[0].childreny.push(item)
          }
          for (const item of this.substrateFindOptions[this.isActive].layout[this.isTabelActive].condList) {
            this.scatterList[1].children.push(item)
          }
        }
      } else if (type === 'pie' || type === 'loudou') {
        this.dataposition = this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.series[0].label.position
        this.dataIsShow = this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.series[0].label.show
        if (type === 'pie') {
          var start = this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.series[0].radius[0]
          var end = this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.series[0].radius[1]
          this.defaultRadiusst = parseInt(start.substring(0, start.length - 1))
          this.defaultRadius = parseInt(end.substring(0, end.length - 1))
          this.roseType = (this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.series[0].roseType === 'radius')
        }
        for (const item of this.substrateFindOptions[this.isActive].layout[this.isTabelActive].xList) {
          this.pieList[0].childrenx.push(item)
        }
        for (const item of this.substrateFindOptions[this.isActive].layout[this.isTabelActive].yList) {
          this.pieList[0].childreny.push(item)
        }
        for (const item of this.substrateFindOptions[this.isActive].layout[this.isTabelActive].condList) {
          this.pieList[1].children.push(item)
        }
      } else if (type === 'table' || type === 'tstab') {
        if (type === 'table') {
          this.pageSize = this.substrateFindOptions[this.isActive].layout[this.isTabelActive].pageInfo.pageSize
          this.tableList = JSON.parse(tableinfo())
        } else {
          this.tableList = JSON.parse(tableinfo1())
        }
        for (const item of this.substrateFindOptions[this.isActive].layout[this.isTabelActive].yList) {
          this.tableList[0].childreny.push(item)
        }
        for (const item of this.substrateFindOptions[this.isActive].layout[this.isTabelActive].condList) {
          this.tableList[1].children.push(item)
        }
      } else if (type === 'zuhe') {
        this.lineFlag = this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.series[0].smooth
        this.dataposition = this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.series[0].label.position
        this.dataIsShow = this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options.series[0].label.show
        for (const item of this.substrateFindOptions[this.isActive].layout[this.isTabelActive].xList) {
          this.zuheList[0].childrenx.push(item)
        }
        for (const item of this.substrateFindOptions[this.isActive].layout[this.isTabelActive].yList) {
          this.zuheList[0].childreny.push(item)
        }
        for (const item of this.substrateFindOptions[this.isActive].layout[this.isTabelActive].yList1) {
          this.zuheList[0].childreny1.push(item)
        }
        for (const item of this.substrateFindOptions[this.isActive].layout[this.isTabelActive].condList) {
          this.zuheList[1].children.push(item)
        }
      } else if (type === 'leida') {
        this.lineFlag = (this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options[0].radar.shape === 'polygon')
        this.legendShow = this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options[0].legend.show
        this.legendTop = this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options[0].legend.top
        this.legendLeft = this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options[0].legend.left
        this.tooltipShow = this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options[0].tooltip.show
        this.tooltipTriggerOn = this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options[0].tooltip.triggerOn
        this.dataposition = this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options[0].series.label.position
        this.dataIsShow = this.substrateFindOptions[this.isActive].layout[this.isTabelActive].options[0].series.label.show
        for (const item of this.substrateFindOptions[this.isActive].layout[this.isTabelActive].xList) {
          this.leidaList[0].childrenx.push(item)
        }
        for (const item of this.substrateFindOptions[this.isActive].layout[this.isTabelActive].yList) {
          this.leidaList[0].childreny.push(item)
        }
        for (const item of this.substrateFindOptions[this.isActive].layout[this.isTabelActive].condList) {
          this.leidaList[1].children.push(item)
        }
      }
    },
    // 编辑页透视表没有数据时，加载
    setpoit(id) {
      setrept(id)
    },
    // 记录历史
    setHistory() {
      if (this.historyList.length >= 20) {
        this.historyList.splice(0, 1)
      }
      this.historyList.push(JSON.stringify(this.substrateFindOptions))
      this.historyIndex = this.historyList.length - 1
      // sessionStorage.setItem('historyList', JSON.stringify(this.historyList))
    },
    // 读取历史
    getHistory() {
      this.substrateFindOptions = JSON.parse(this.historyList[this.historyIndex])
      this.isTabelActive = -1
      if (this.substrateFindOptions[this.isActive].isAuxiliary) {
        this.substrateFindOptions[this.isActive].isAuxiliary = false
        const _this = this
        setTimeout(() => {
          _this.substrateFindOptions[this.isActive].isAuxiliary = true
        }, 100)
      }
    },
    // 后退历史按钮
    goBack() {
      if (this.historyIndex > 0) {
        this.isview = true
        this.historyIndex = this.historyIndex - 1
        this.getHistory()
        const _this = this
        setTimeout(() => {
          _this.isview = false
          _this.reloadInfo()
        }, 100)
      }
    },
    // 前进历史按钮
    goForward() {
      if (this.historyIndex !== -1 && this.historyIndex < this.historyList.length - 1) {
        this.isview = true
        this.historyIndex = this.historyIndex + 1
        this.getHistory()
        const _this = this
        setTimeout(() => {
          _this.isview = false
          _this.reloadInfo()
        }, 100)
      }
    },
    // 改变普通表每页展示个数
    sizeChange(index) {
      this.getReload(this.substrateFindOptions[this.isActive].layout[index].sql, this.isTabelActive, this.substrateFindOptions[this.isActive].layout[index].type)
    },
    // 切换普通表页数
    currentChange(pageNum) {
      this.substrateFindOptions[this.isActive].layout[this.isTabelActive].pageInfo.pageNum = pageNum
      if (this.substrateFindOptions[this.isActives].layout[this.isTabelActive].pageInfo.show) {
        this.substrateFindOptions[this.isActive].layout[this.isTabelActive].sql.limit = (pageNum - 1) + ',' + this.substrateFindOptions[this.isActive].layout[this.isTabelActive].pageInfo.pageSize
      } else {
        this.substrateFindOptions[this.isActive].layout[this.isTabelActive].sql.limit = ''
      }
      this.getReload(this.substrateFindOptions[this.isActive].layout[this.isTabelActive].sql, this.isTabelActive, this.substrateFindOptions[this.isActive].layout[this.isTabelActive].type)
    },
    // 保存整个页面
    updateSuccess() {
      const params = {
        id: this.reportsInfo.id,
        name: this.reportsInfo.name,
        remark: this.reportsInfo.remark,
        creater: 1,
        content: (this.substrateFindOptions.length === 1 && this.substrateFindOptions[0].layout.length === 0) ? '' : JSON.stringify(this.setalls)
      }
      updateAnalysis(params).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
          this.setalls.substrateFindOptions = this.substrateFindOptions
          this.reportsInfo.content = (this.substrateFindOptions.length === 1 && this.substrateFindOptions[0].layout.length === 0) ? null : JSON.stringify(this.setalls)
          sessionStorage.setItem('reportInfo', JSON.stringify(this.reportsInfo))
          // this.$router.back(-1)
        }
      })
    }
  },
  destroyed() {
    const pars = document.getElementById('contens').parentNode
    pars.parentNode.className = 'app-main'
  }
}

