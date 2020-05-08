
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
// import FlowPanel from '@/views/flowEditor/panel'
// export default {
//   components: { PageHeaderLayout, HeaderSearchAdd, FlowPanel }
// }
import draggable from 'vuedraggable'
import { jsPlumb } from 'jsplumb'
import { easyFlowMixin } from '@/views/mixins/easy_flow_mixin'
import { updata, runFLow, analysisRun, analysisUpdata, testRun } from '@/api/enterpriseDataCenter/dataClean'
import { queryTableData } from '@/api/enterpriseDataCenter/dataSource'
import flowNode from './node'
import nodeMenu from './node_menu'
import chart from '@/components/Charts'
// import FlowInfo from '@/views/test/info'
import FlowNodeForm1 from './cleanFlowForm/node_form1'
import FlowNodeForm2 from './cleanFlowForm/node_form2'
import FlowNodeForm3 from './cleanFlowForm/node_form3'
import FlowNodeForm4 from './cleanFlowForm/node_form4'
import FlowNodeForm5 from './cleanFlowForm/node_form5'
import FlowNodeForm6 from './cleanFlowForm/node_form6'
import cleanForm7 from './cleanFlowForm/node_form7'
import cleanForm8 from './cleanFlowForm/node_form8'
import cleanForm9 from './cleanFlowForm/node_form9'
import cleanForm10 from './cleanFlowForm/node_form10'
import FlowNodeForm7 from './kmFlowForm/node_form7'
import FlowNodeForm8 from './kmFlowForm/node_form8'
import FlowNodeForm9 from './kmFlowForm/node_form9'
import FlowNodeForm10 from './kmFlowForm/node_form10'
import FlowNodeForm11 from './kmFlowForm/node_form11'
import FlowNodeForm12 from './kmFlowForm/node_form12'
import FlowNodeForm13 from './kmFlowForm/node_form13'
import FlowNodeForm14 from './kmFlowForm/node_form14'
import FlowNodeForm15 from './kmFlowForm/node_form15'
import lodash from 'lodash'
import { getDataA } from './data_A'
import { getDataB } from './data_B'
import { getDataC } from './data_C'

export default {
  components: {
    PageHeaderLayout,
    HeaderSearchAdd,
    draggable,
    chart,
    flowNode,
    nodeMenu,
    FlowNodeForm1,
    FlowNodeForm2,
    FlowNodeForm3,
    FlowNodeForm4,
    FlowNodeForm5,
    FlowNodeForm6,
    cleanForm7,
    cleanForm8,
    cleanForm9,
    cleanForm10,
    FlowNodeForm7,
    FlowNodeForm8,
    FlowNodeForm9,
    FlowNodeForm10,
    FlowNodeForm11,
    FlowNodeForm12,
    FlowNodeForm13,
    FlowNodeForm14,
    FlowNodeForm15
  },
  // 一些基础配置移动该文件中
  mixins: [easyFlowMixin],
  data() {
    return {
      addDialogVisible: true,
      runLoading: false,
      isKmeans: false,
      isChange: false,
      tableName: '',
      // jsPlumb 实例
      jsPlumb: null,
      // 控制画布销毁
      easyFlowVisible: true,
      // 控制流程数据显示与隐藏
      flowInfoVisible: false,
      showLog: false,
      // 是否加载完毕标志位
      loadEasyFlowFinish: false,
      editDialogVisible: false,
      editDialogVisible2: false,
      editDialogVisible3: false,
      editDialogVisible4: false,
      editDialogVisible5: false,
      editDialogVisible6: false,
      editDialogCleanForm7: false,
      editDialogCleanForm8: false,
      editDialogCleanForm9: false,
      editDialogCleanForm10: false,
      editDialogCleanForm11: false,
      editDialogVisible7: false,
      editDialogVisible8: false,
      editDialogVisible9: false,
      editDialogVisible10: false,
      editDialogVisible11: false,
      editDialogVisible12: false,
      editDialogVisible13: false,
      editDialogVisible14: false,
      editDialogVisible15: false,
      logActive: 1,
      table: '',
      // 数据
      data: {},
      logMessage: [],
      logTableList: [],
      tableHeader: [],
      resultTableList: [],
      resultTableHeader: [],
      options: {
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        series: [
          {
            type: 'pie',
            radius: '50%',
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    }
  },
  mounted() {
    this.initSSE()
    this.jsPlumb = jsPlumb.getInstance()
    this.$nextTick(() => {
      this.table = this.$route.query.tb
      // 默认加载流程A的数据、在这里可以根据具体的业务返回符合流程数据格式的数据即可
      // this.dataReload(getDataA())
      if (this.$route.query.flow) {
        this.dataReload(JSON.parse(this.$route.query.flow))
      } else {
        this.dataReload(getDataA())
      }
    })
    this.setNodeMenu()
  },
  methods: {
    tabClick(index) {
      this.logActive = index
    },
    setNodeMenu() {
      if (this.$route.query.kmeans) {
        this.isKmeans = true
      } else {
        this.isKmeans = false
      }
    },
    closeDialog() {
      this.$router.back(-1)
    },
    setShowLog() {
      this.showLog = !this.showLog
    },
    initSSE() {
      if ('EventSource' in window) {
        console.log('浏览器支持SSE')
      } else {
        this.$message.error('浏览器不支持SSE，无法查看日志！')
      }
      this.source = new EventSource(process.env.BASE_API + `/log/push/${this.$route.query.id}`)
      this.source.onmessage = this.sseonmessage
      this.source.onopen = this.sseonopen
      this.source.onerror = this.sseonerror
    },
    sseonerror(event) {
      // console.log('链接失败')
    },
    sseonmessage(event) {
      // console.log(event.data, '收到消息')
      event.data && this.logMessage.push(event.data)
    },
    sseonopen(event) {
      // console.log('链接已创建')
    },
    dialogClose() {
      this.editDialogVisible = false
      this.editDialogVisible2 = false
      this.editDialogVisible3 = false
      this.editDialogVisible4 = false
      this.editDialogVisible5 = false
      this.editDialogVisible6 = false
      this.editDialogCleanForm7 = false
      this.editDialogCleanForm8 = false
      this.editDialogCleanForm9 = false
      this.editDialogCleanForm10 = false
      this.editDialogCleanForm11 = false
      this.editDialogVisible7 = false
      this.editDialogVisible8 = false
      this.editDialogVisible9 = false
      this.editDialogVisible10 = false
      this.editDialogVisible11 = false
      this.editDialogVisible12 = false
      this.editDialogVisible13 = false
      this.editDialogVisible14 = false
      this.editDialogVisible15 = false
    },
    // 返回唯一标识
    getUUID() {
      return Math.random().toString(36).substr(3, 10)
    },
    jsPlumbInit() {
      this.jsPlumb.ready(() => {
        // 导入默认配置
        this.jsPlumb.importDefaults(this.jsplumbSetting)
        // 会使整个jsPlumb立即重绘。
        this.jsPlumb.setSuspendDrawing(false, true)
        // 初始化节点
        this.loadEasyFlow()
        // 单点击了连接线,
        this.jsPlumb.bind('click', (conn, originalEvent) => {
          this.$confirm('确定删除所点击的线吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.jsPlumb.deleteConnection(conn)
          }).catch(() => {
          })
        })
        // 连线
        this.jsPlumb.bind('connection', (evt) => {
          const from = evt.source.id
          const to = evt.target.id
          if (this.loadEasyFlowFinish) {
            this.data.lineList.push({ from: from, to: to })
          }
        })

        // 删除连线回调
        this.jsPlumb.bind('connectionDetached', (evt) => {
          this.deleteLine(evt.sourceId, evt.targetId)
        })

        // 改变线的连接节点
        this.jsPlumb.bind('connectionMoved', (evt) => {
          this.changeLine(evt.originalSourceId, evt.originalTargetId)
        })

        // 连线右击
        this.jsPlumb.bind('contextmenu', (evt) => {
          console.log('contextmenu', evt)
        })

        // 连线
        this.jsPlumb.bind('beforeDrop', (evt) => {
          console.log(evt)
          const from = evt.sourceId
          const to = evt.targetId
          if (this.hasLine(from, to)) {
            this.$message.error('该关系已存在,不允许重复创建')
            return false
          }
          // 判断数据输入组件是否为首
          if (this.isFirst(from, to)) {
            this.$message.error('数据输入组件不能被连')
            return false
          }
          // 判断列排序组件只能对应一张表（只练一条线）
          if (this.isOneTableSort(from, to)) {
            this.$message.error('列排序组件必须关联一张表')
            return false
          }
          // 判断表关联组件是否超出两条连线
          if (this.isTwoJoin(to)) {
            this.$message.error('表关联组件必须关联两张表')
            return false
          }
          // 判断输出组件是否在末尾
          if (this.isLast(from, to)) {
            this.$message.error('数据输出组件不能连接其他组件')
            return false
          }
          if (from === to) {
            this.$message.error('节点不支持连接自己')
            return false
          }
          if (this.hashOppositeLine(from, to)) {
            this.$message.error('不支持两个节点之间连线回环')
            return false
          }
          this.$message.success('连接成功')
          return true
        })
        // 选中
        this.jsPlumb.bind('addToDragSelection', (evt) => {
          console.log(evt)
        })

        // beforeDetach
        this.jsPlumb.bind('beforeDetach', (evt) => {
          console.log('beforeDetach', evt)
        })
      })
    },
    // 加载流程图
    loadEasyFlow() {
      // 初始化节点
      for (var i = 0; i < this.data.nodeList.length; i++) {
        const node = this.data.nodeList[i]
        // 设置源点，可以拖出线连接其他节点
        this.jsPlumb.makeSource(node.id, this.jsplumbSourceOptions)
        // // 设置目标点，其他源点拖出的线可以连接该节点
        this.jsPlumb.makeTarget(node.id, this.jsplumbTargetOptions)
        this.jsPlumb.draggable(node.id, { containment: 'parent' })
      }
      // 初始化连线
      for (var j = 0; j < this.data.lineList.length; j++) {
        const line = this.data.lineList[j]
        this.jsPlumb.connect({ source: line.from, target: line.to }, this.jsplumbConnectOptions)
      }
      this.$nextTick(function() {
        this.loadEasyFlowFinish = true
      })
    },
    // 删除线
    deleteLine(from, to) {
      this.data.lineList = this.data.lineList.filter(function(line) {
        if (line.from === from && line.to === to) {
          return false
        }
        return true
      })
    },
    submitFlowData() {
      const params = {
        id: this.$route.query.id,
        flow: JSON.stringify(this.data)
      }
      if (this.isKmeans) {
        analysisUpdata(params).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.$router.back(-1)
        })
        // this.$message({
        //   type: 'success',
        //   message: '操作成功!'
        // })
        // this.$router.back(-1)
      } else {
        updata(params).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          // this.$router.back(-1)
        })
      }
    },
    tableChange() {
      this.isChange = true
    },
    runFlowData() {
      if (this.data.nodeList.length === 0) {
        return false
      }
      this.showLog = true
      this.logMessage = []
      this.runLoading = true
      if (this.isKmeans) {
        if (this.$route.query.tb === '1') {
          if (this.data.nodeList.length !== 2 && this.data.lineList.length !== 1) {
            return false
          }
          let dataSourceNode = ''
          let kmNode = ''
          this.data.nodeList.map(item => {
            if (item.nodeId === '11') {
              dataSourceNode = item
            }
            if (item.nodeId === '25') {
              kmNode = item
            }
          })
          console.log(kmNode)
          const params = {
            flowId: this.$route.query.id,
            standarsdization: kmNode.config.standarsdization,
            random_state: kmNode.config.random_state,
            n_clusters: kmNode.config.n_clusters,
            max_iter: kmNode.config.max_iter,
            init: kmNode.config.init,
            algorithm: kmNode.config.algorithm,
            datasource: {
              type: dataSourceNode.config.type,
              host: dataSourceNode.config.host,
              port: dataSourceNode.config.port,
              username: dataSourceNode.config.username,
              password: dataSourceNode.config.password,
              database: dataSourceNode.config.database,
              sql: dataSourceNode.config.sql
            }
          }
          analysisRun(params).then(res => {
            this.$message({
              type: 'success',
              message: '执行成功！'
            })
            this.logTableList = res.data.clusters__data
            this.tableHeader = Object.keys(res.data.clusters__data[0])
            const chartData = []
            for (const key in res.data.clusters_info) {
              chartData.push({
                value: res.data.clusters_info[key]
              })
            }
            chartData.map((item, index) => {
              item['name'] = `聚类${index + 1}`
            })
            this.options.series[0].data = chartData
            this.$nextTick(() => {
              var div = document.getElementById('logContainer')
              div.scrollTop = div.scrollHeight
            })
            this.logActive = 2
          }).catch(() => {
            this.runLoading = false
          })
        } else {
          this.logActive = 1
          let methodtype = ''
          if (this.$route.query.tb === 'history_eqpt_data' || this.$route.query.tb === 'history_mould_data') {
            methodtype = 'grading'
          } else if (this.$route.query.tb === 'eqpt_rank_set') {
            methodtype = 'model'
          } else if (this.$route.query.tb === 'history_shift_data') {
            methodtype = 'recommend'
          }
          let dataSourceNode = ''
          this.data.nodeList.map(item => {
            if (item.nodeId === '11') {
              dataSourceNode = item
            }
          })
          const params = {
            flowId: this.$route.query.id,
            datasource: {
              type: dataSourceNode.config.type,
              host: dataSourceNode.config.host,
              port: dataSourceNode.config.port,
              username: dataSourceNode.config.username,
              password: dataSourceNode.config.password,
              database: dataSourceNode.config.database,
              sql: dataSourceNode.config.sql
            },
            methodtype
          }
          this.runLoading = true
          testRun(params).then(res => {
            this.runLoading = false
            if (this.$route.query.tb === 'history_eqpt_data') {
              this.logTableList = res.data.eqpt_rank_set
              this.tableHeader = Object.keys(res.data.eqpt_rank_set[0])
              this.resultTableList = res.data.eqpt_rank_set
              this.resultTableHeader = Object.keys(res.data.eqpt_rank_set[0])
            } else if (this.$route.query.tb === 'history_mould_data') {
              this.logTableList = res.data.mould_rank_set
              this.tableHeader = Object.keys(res.data.mould_rank_set[0])
              this.resultTableList = res.data.mould_rank_set
              this.resultTableHeader = Object.keys(res.data.mould_rank_set[0])
            } else if (this.$route.query.tb === 'history_shift_data') {
              this.logTableList = res.data
              this.tableHeader = Object.keys(res.data[0])
              this.resultTableList = res.data
              this.resultTableHeader = Object.keys(res.data[0])
            }
            this.$message({
              type: 'success',
              message: '执行成功！'
            })
            this.logActive = 2
          }).catch(() => {
            this.runLoading = false
          })
        }
      } else {
        const obj = {
          dag: this.data
        }
        const params = {
          id: this.$route.query.id,
          flow: JSON.stringify(obj)
        }
        runFLow(params).then(res => {
          this.$message({
            type: 'success',
            message: '执行成功！'
          })
          this.$nextTick(() => {
            var div = document.getElementById('logContainer')
            div.scrollTop = div.scrollHeight
          })
          this.runLoading = false
        }).catch(() => {
          this.runLoading = false
        })
      }
    },
    // 改变连线
    changeLine(oldFrom, oldTo) {
      this.deleteLine(oldFrom, oldTo)
    },
    // 改变节点的位置
    changeNodeSite(data) {
      for (var i = 0; i < this.data.nodeList.length; i++) {
        const node = this.data.nodeList[i]
        if (node.id === data.nodeId) {
          node.left = data.left
          node.top = data.top
        }
      }
    },
    /**
     * 拖拽结束后添加新的节点
     * @param evt
     * @param nodeMenu 被添加的节点对象
     * @param mousePosition 鼠标拖拽结束的坐标
     */
    addNode(evt, nodeMenu, mousePosition) {
      // const width = this.$refs.nodeMenu.$el.clientWidth
      const div = document.getElementById('flowContainer')
      const body = document.body
      const divx1 = body.clientWidth - div.clientWidth
      const divy1 = body.clientHeight - div.clientHeight
      const UUID = this.getUUID()
      const left = mousePosition.left - divx1
      const top = mousePosition.top - divy1
      // if (left < 0) {
      //   left = evt.originalEvent.layerX - width
      // }
      // if (top < 0) {
      //   top = evt.originalEvent.clientY - 50
      // }
      var node = {
        id: UUID,
        nodeId: nodeMenu.id, // 用来判断不同组件编辑时弹对应窗口
        name: nodeMenu.name,
        // nodeType: nodeMenu.nodeType,
        metadataid: nodeMenu.metadataid,
        left: left + 'px',
        top: top + 'px',
        ico: nodeMenu.ico,
        show: true
      }
      // 输入组件
      if (nodeMenu.id === '11') {
        node.dataSource = ''
        node.dataSourceList = []
        node.sql = ''
      }
      // 输出组件
      if (nodeMenu.id === '12') {
        // node.config = {
        //   dataSource: '',
        //   ifexists: '',
        //   tablename: '',
        //   fields: []
        // }
      }
      // 关联组件
      if (nodeMenu.id === '13') {
        node.config = {
          conditions: [{ left: '', right: '', operator: 'eq' }]
        }
      }
      // 列排序
      if (nodeMenu.id === '16') {
        node.config = {
          conditions: []
        }
      }
      // 分组
      if (nodeMenu.id === '14' || nodeMenu.id === '1-7') {
        node.config = {
          withconditions: []
        }
      }
      // 过滤
      if (nodeMenu.id === '18' || nodeMenu.id === '25' || nodeMenu.id === '21') {
        node.config = {
          filterList: [],
          list1: []
        }
      }
      // 分组
      if (nodeMenu.id === '19') {
        node.config = {
          left: [],
          right: [],
          conditions: [{ left: '', right: '', operator: 'eq' }]
        }
      }
      // 排序
      if (nodeMenu.id === '24') {
        node.config = {
          list: [],
          list1: []
        }
      }
      /**
       * 这里可以进行业务判断、是否能够添加该节点
       */
      for (var i = 0; i < this.data.nodeList.length; i++) {
        var item = this.data.nodeList[i]
        if (item.nodeId === nodeMenu.id && node.nodeId === '12') {
          this.$message.error('单个流程只能有一个数据输出组件')
          return false
        }
      }
      this.data.nodeList.push(node)
      this.$nextTick(function() {
        this.jsPlumb.makeSource(UUID, this.jsplumbSourceOptions)
        this.jsPlumb.makeTarget(UUID, this.jsplumbTargetOptions)
        this.jsPlumb.draggable(UUID, {
          containment: 'parent'
        })
      })
    },
    /**
     * 删除节点
     * @param nodeId 被删除节点的ID
     */
    deleteNode(nodeId) {
      this.$confirm('确定要该节点？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        /**
         * 这里需要进行业务判断，是否可以删除
         */
        let deleteIndex = ''
        this.data.nodeList = this.data.nodeList.filter((node, index) => {
          if (node.id === nodeId) {
            // 伪删除，将节点隐藏，否则会导致位置错位
            deleteIndex = index
            // node.show = false
          }
          return true
        })
        this.data.nodeList.splice(deleteIndex, 1)
        this.$nextTick(function() {
          this.jsPlumb.removeAllEndpoints(nodeId)
        })
      }).catch(() => {
      })
      return true
    },
    // 点击节点
    clickNode(node) {
      if (node.nodeId === '11' || node.nodeId === '12') {
        this.queryTableDataFun(node, node.nodeId)
      } else if (node.nodeId === '23' && this.isKmeans) {
        this.logTableList = this.resultTableList
        this.tableHeader = this.resultTableHeader
      }
    },
    // 获取表下的数据
    queryTableDataFun(node, nodeId) {
      const params = {
        sql: '',
        id: ''
      }
      if (nodeId === '11') {
        params.sql = node.sql
        params.id = node.dataSource
      } else {
        params.sql = `select * from ${node.config.tablename}`
        params.id = node.config.dataSource
      }
      if (params.sql !== '') {
        queryTableData(params).then(res => {
          this.logTableList = res.data
          if (this.logTableList.length > 0) {
            this.tableHeader = Object.keys(this.logTableList[0])
          }
        })
      }
    },
    editNode(node) {
      // 输入
      if (node.nodeId === '11') {
        this.editDialogVisible = true
        setTimeout(() => {
          this.$refs.nodeForm1.init(this.data, node.id)
        }, 100)
      }
      // 输出
      if (node.nodeId === '12') {
        if (this.hasDataSource(node.id)) {
          this.editDialogVisible2 = true
          setTimeout(() => {
            this.$refs.nodeForm2.init(this.data, node.id)
          }, 100)
        } else {
          this.$message.error('请选择数据源!')
        }
      }
      // 表关联
      if (node.nodeId === '13') {
        if (this.isTwoJoin(node.id)) {
          if (this.hasTwoDataSource(node.id)) {
            this.editDialogVisible3 = true
            setTimeout(() => {
              this.$refs.nodeForm3.init(this.data, node.id)
            }, 100)
          } else {
            this.$message.error('请选择数据源!')
          }
        } else {
          this.$message.error('表关联组件必须关联两张表!')
        }
      }
      // 数据分组
      if (node.nodeId === '14') {
        if (this.hasDataSource(node.id)) {
          this.editDialogVisible4 = true
          setTimeout(() => {
            this.$refs.nodeForm4.init(this.data, node.id)
          }, 100)
        } else {
          this.$message.error('请选择数据源!')
        }
      }
      // 分组聚合
      if (node.nodeId === '15') {
        if (this.hasDataSource(node.id)) {
          this.editDialogVisible5 = true
          setTimeout(() => {
            this.$refs.nodeForm5.init(this.data, node.id)
          }, 100)
        } else {
          this.$message.error('请选择数据源!')
        }
      }
      // 列排序
      if (node.nodeId === '16') {
        if (this.hasDataSource(node.id)) {
          this.editDialogVisible6 = true
          setTimeout(() => {
            this.$refs.nodeForm6.init(this.data, node.id)
          }, 100)
        } else {
          this.$message.error('请选择数据源!')
        }
      }
      // 计算列
      if (node.nodeId === '1-7') {
        if (this.hasDataSource(node.id)) {
          this.editDialogCleanForm7 = true
          setTimeout(() => {
            this.$refs.cleanForm1_7.init(this.data, node.id)
          }, 100)
        } else {
          this.$message.error('请选择数据源!')
        }
      }
      // 一列拆多列
      if (node.nodeId === '1-8') {
        if (this.hasDataSource(node.id)) {
          this.editDialogCleanForm8 = true
          setTimeout(() => {
            this.$refs.cleanForm1_8.init(this.data, node.id)
          }, 100)
        } else {
          this.$message.error('请选择数据源!')
        }
      }
      // 一行拆多行
      if (node.nodeId === '1-9') {
        if (this.hasDataSource(node.id)) {
          this.editDialogCleanForm9 = true
          setTimeout(() => {
            this.$refs.cleanForm1_9.init(this.data, node.id)
          }, 100)
        } else {
          this.$message.error('请选择数据源!')
        }
      }
      // csv文件输入
      if (node.nodeId === '1-10') {
        // if (this.hasDataSource(node.id)) {
        // } else {
        //   this.$message.error('请选择数据源!')
        // }
        this.editDialogCleanForm10 = true
        setTimeout(() => {
          this.$refs.cleanForm1_10.init(this.data, node.id)
        }, 100)
      }
      // km
      if (node.nodeId === '17') {
        if (this.hasDataSource(node.id)) {
          this.editDialogVisible7 = true
          setTimeout(() => {
            this.$refs.nodeForm7.init(this.data, node.id)
          }, 100)
        } else {
          this.$message.error('请选择数据源!')
        }
      }
      // -----------------km----------------------
      // 数据过滤
      if (node.nodeId === '18') {
        this.editDialogVisible8 = true
        setTimeout(() => {
          this.$refs.nodeForm8.init(this.data, node.id)
        }, 100)
      }
      // 分析表关联
      if (node.nodeId === '19') {
        this.editDialogVisible9 = true
        setTimeout(() => {
          this.$refs.nodeForm9.init(this.data, node.id)
        }, 100)
      }
      // km
      if (node.nodeId === '25') {
        if (this.table === '1') { // 新增的流程
          if (this.hasDataSource(node.id)) {
            this.editDialogVisible15 = true
            setTimeout(() => {
              this.$refs.nodeForm15.init(this.data, node.id)
            }, 100)
          } else {
            this.$message.error('请选择数据源!')
          }
        } else {
          this.editDialogVisible15 = true
          setTimeout(() => {
            this.$refs.nodeForm15.init(this.data, node.id)
          }, 100)
        }
      }
      // 输出
      if (node.nodeId === '23') {
        this.editDialogVisible13 = true
        setTimeout(() => {
          this.$refs.nodeForm13.init(this.data, node.id)
        }, 100)
      }
      // 随机森林
      if (node.nodeId === '21') {
        this.editDialogVisible11 = true
        setTimeout(() => {
          this.$refs.nodeForm11.init(this.data, node.id)
        }, 100)
      }
      // 模型调用
      if (node.nodeId === '22') {
        this.editDialogVisible12 = true
        setTimeout(() => {
          this.$refs.nodeForm12.init(this.data, node.id)
        }, 100)
      }
      // 列排序
      if (node.nodeId === '24') {
        this.editDialogVisible14 = true
        setTimeout(() => {
          this.$refs.nodeForm14.init(this.data, node.id)
        }, 100)
      }
    },
    // 输入组件是否被连接
    isFirst(from, to) {
      for (var i = 0; i < this.data.nodeList.length; i++) {
        var node = this.data.nodeList[i]
        if (node.id === to && node.nodeId === '11') {
          return true
        }
      }
      return false
    },
    // 判断表关联组件连线条数不能大于二
    isTwoJoin(to) {
      const joinNodeId = this.data.nodeList.find(item => item.nodeId === '13' && item.id === to).id
      const joinLineArr = []
      this.data.lineList.map(item => {
        if (item.to === joinNodeId) {
          joinLineArr.push(item)
        }
      })
      if (joinLineArr.length === 2) {
        return true
      }
      return false
    },
    //  判断表关联组件两个数据源是否选了表数据
    hasTwoDataSource(nodeId) {
      const dataSourde = this.data.nodeList.filter(item => item.nodeId === '11')
      console.log(dataSourde)
      for (var j = 0; j < dataSourde.length; j++) {
        var item = dataSourde[j]
        if (!item.sql) {
          return false
        }
      }
      return true
    },
    // 验证是否有数据源
    hasDataSource(nodeId) {
      const dataSourde = this.data.nodeList.find(item => item.nodeId === '11')
      console.log(dataSourde)
      if (dataSourde === undefined) {
        return false
      } else {
        this.tableName = dataSourde.tableName
        if (dataSourde.sql) {
          for (var i = 0; i < this.data.lineList.length; i++) {
            var line = this.data.lineList[i]
            if (line.from === dataSourde.id) {
              return true
            }
          }
          return false
        }
        return false
      }
    },
    isOneTableSort(from, to) {
      const sortNodeId = this.data.nodeList.find(item => item.nodeId === '16' && item.id === to).id
      const joinLineArr = []
      this.data.lineList.map(item => {
        if (item.to === sortNodeId) {
          joinLineArr.push(item)
        }
      })
      if (joinLineArr.length === 1) {
        return true
      }
    },
    // 输出组件是否为末尾
    isLast(from, to) {
      for (var i = 0; i < this.data.nodeList.length; i++) {
        var node = this.data.nodeList[i]
        if (node.id === from && node.nodeId === '12') {
          return true
        }
      }
      return false
    },
    // 是否具有该线
    hasLine(from, to) {
      for (var i = 0; i < this.data.lineList.length; i++) {
        var line = this.data.lineList[i]
        if (line.from === from && line.to === to) {
          return true
        }
      }
      return false
    },
    // 是否含有相反的线
    hashOppositeLine(from, to) {
      return this.hasLine(to, from)
    },
    nodeRightMenu(nodeId, evt) {
      this.menu.show = true
      this.menu.curNodeId = nodeId
      this.menu.left = evt.x + 'px'
      this.menu.top = evt.y + 'px'
    },
    // 流程数据信息
    dataInfo() {
      this.flowInfoVisible = true
      this.$nextTick(function() {
        this.$refs.flowInfo.init()
      })
    },
    // 加载流程图
    dataReload(data) {
      this.easyFlowVisible = false
      this.data.nodeList = []
      this.data.lineList = []
      this.$nextTick(() => {
        data = lodash.cloneDeep(data)
        this.easyFlowVisible = true
        this.data = data
        this.$nextTick(() => {
          this.jsPlumb = jsPlumb.getInstance()
          this.$nextTick(() => {
            this.jsPlumbInit()
          })
        })
      })
    },
    // 模拟载入数据dataA
    dataReloadA() {
      this.dataReload(getDataA())
    },
    // 模拟载入数据dataB
    dataReloadB() {
      this.dataReload(getDataB())
    },
    // 模拟载入数据dataC
    dataReloadC() {
      this.dataReload(getDataC())
    },
    changeLabel() {
      var lines = this.jsPlumb.getConnections({
        source: 'nodeA',
        target: 'nodeB'
      })
      lines[0].setLabel({
        label: '',
        cssClass: 'labelClass a b'
      })
    }
  }
}
