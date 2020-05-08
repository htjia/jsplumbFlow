<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="editVisible"
      class="padding-dialog"
      title="编辑"
      width="1000px"
      @close="handleClose">
      <el-row :gutter="15">
        <el-col :span="17">
          <!--<el-button-->
          <!--style="float: left;margin-right: 15px;margin-bottom: 10px"-->
          <!--size="small"-->
          <!--type="primary"-->
          <!--icon="el-icon-edit"-->
          <!--@click="handleBatchModif" > 批量修改</el-button>-->
          <div class="input-item" style="margin-right: 0;margin-bottom: 10px">
            <span class="input-title">输出表名称 </span>
            <el-input v-model="outTableName" class="search-input" size="small" maxlength="20" clearable/>
          </div>
          <div class="input-item">
            <span class="input-title">输出方式 </span>
            <el-select v-model="outType" size="small" class="search-input" placeholder="请选择" clearable>
              <el-option
                v-for="item in outTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </div>
          <el-table
            v-loading="loading"
            ref="tables"
            :data="list"
            element-loading-text="拼命加载中"
            height="358"
            border
            fit
            @selection-change="handleSelect">
            <el-table-column type="selection" width="55" fixed/>
            <el-table-column label="字段名" align="center" prop="name"/>
            <el-table-column label="类型" align="center" prop="type"/>
          </el-table>
        </el-col>
        <el-col :span="7">
          <div class="module-container left-container">
            <div class="module-title">
              <div class="module-title-text">选择数据源</div>
            </div>
            <div class="module-content">
              <el-select v-model="dataSource" size="small" style="width: 100%;margin-bottom: 5px" placeholder="请选择" clearable @change="selectChange">
                <el-option
                  v-for="item in dataSourceList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
              <el-input
                v-model="filterText"
                size="small"
                placeholder="输入关键字进行过滤"/>
              <div v-loading="treeLoading" element-loading-text="拼命加载中" style="height: 250px;overflow: auto;margin-top: 5px">
                <el-tree
                  ref="tree"
                  :data="treeData"
                  :props="defaultProps"
                  :filter-node-method="filterNode"
                  class="filter-tree"
                  default-expand-all
                  @node-click="nodeClick"
                />
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <div slot="footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="batchModify"
      class="padding-dialog"
      title="批量修改"
      width="900px"
      @close="handleCloseBatchModify">
      <el-row :gutter="15">
        <el-col :span="17">
          <el-table
            :data="list"
            height="358"
            border
            fit>
            <el-table-column label="字段名" align="center" prop="taskCode"/>
            <el-table-column label="源类型" align="center" prop="groupName" show-overflow-tooltip/>
            <el-table-column label="描述" align="center" prop="typeName" show-overflow-tooltip/>
          </el-table>
        </el-col>
        <el-col :span="7">
          <div style="margin-top: 100px">
            <div class="input-item batch-item">
              <span class="input-title">输出类型 </span>
              <el-select v-model="batch.outType" size="small" class="search-input" placeholder="请选择" clearable>
                <el-option
                  v-for="item in outTypeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </div>
            <div class="input-item batch-item">
              <span class="input-title">输出长度 </span>
              <el-input v-model="batch.outPutLength" class="search-input" size="small" maxlength="20" clearable/>
            </div>
            <div class="input-item batch-item">
              <span class="input-title">输出精度 </span>
              <el-input v-model="batch.outPutAccuracy" class="search-input" size="small" maxlength="20" clearable/>
            </div>
          </div>
        </el-col>
      </el-row>
      <div slot="footer">
        <el-button type="primary" @click="submitBatchForm">确 定</el-button>
        <el-button @click="batchModify = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import { query, queryTable, queryTableFiled, flowInput } from '@/api/enterpriseDataCenter/dataSource'
export default {
  props: {
    editDialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      editVisible: false,
      batchModify: false,
      treeLoading: false,
      loading: false,
      batch: {
        outType: '',
        outPutLength: '',
        outPutAccuracy: ''
      },
      outTableName: '',
      dataSource: '',
      activeNum: 1,
      selectedSourceId: 1,
      dataSourceList: [],
      selectedTable: [],
      outType: '',
      node: {},
      config: '',
      list: [{}],
      data: {},
      filterText: '',
      outTypeList: [
        { id: 'append', name: '新增' },
        { id: 'replace', name: '覆盖' }
      ],
      treeData: [{
        id: 1,
        label: '生产管理',
        children: [{
          id: 4,
          label: '检验上报'
        }]
      }, {
        id: 2,
        label: '质量管理',
        children: [{
          id: 5,
          label: '供应商'
        }, {
          id: 6,
          label: '来料检验'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'tableName'
      }
    }
  },
  watch: {
    editDialogVisible(val) {
      this.editVisible = this.editDialogVisible
      if (this.editVisible) {
        this.fetchDataSource()
        setTimeout(() => {
          // this.nodeInitFun()
          this.queryTableFiledFun()
        }, 100)
      }
    },
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    handleSelect(data) {
      this.selectedTable = data
    },
    selectChange(id) {
      this.selectedSourceId = id
      this.treeLoading = true
      this.config = this.dataSourceList.find(item => item.id === id).config
      queryTable(id).then(res => {
        this.treeLoading = false
        this.treeData = res.data
      })
    },
    fetchDataSource() {
      this.treeData = []
      const params = {
        pageNum: 1,
        pageSize: 1000,
        name: ''
      }
      query(params).then(res => {
        this.dataSourceList = res.data.datasouces
        setTimeout(() => {
          this.initData()
        }, 100)
      })
    },
    initData() {
      this.data.nodeList.filter((node) => {
        if (node.id === this.node.id) {
          if (node.config) {
            this.dataSource = node.config.dataSource
            this.outType = node.config.ifexists
            this.outTableName = node.config.tablename
            if (node.config.dataSource !== '' && node.config.dataSource !== undefined) {
              this.selectChange(this.dataSource)
            }
            if (node.config.fields.length > 0) {
              setTimeout(() => {
                this.list.map((row) => {
                  node.config.fields.map(item => {
                    if (row.name === item.name) {
                      this.$refs.tables.toggleRowSelection(row)
                    }
                  })
                })
              }, 500)
            }
          } else {
            this.dataSource = ''
            this.outType = ''
            this.outTableName = ''
          }
        }
      })
    },
    nodeClick(data) {
      console.log(data)
      if (data.children === undefined) {
        this.outTableName = data.tableName
      }
    },
    // 获取表下的字段
    queryTableFiledFun() {
      const params = {
        table_name: 'history_eqpt_data',
        datasource_id: '2e9ba392-22a8-449e-b266-443e7722c9c8'
      }
      queryTableFiled(params).then(res => {
        const list = []
        res.data.map(item => {
          list.push(
            { name: item.columnName, type: item.columnType, aliasName: item.columnName}
          )
        })
        this.list = list
      })
    },
    nodeInitFun() {
      const obj = {
        dag: this.data
      }
      this.loading = true
      const params = {
        id: this.node.id,
        flowId: this.$route.query.id,
        flow: JSON.stringify(obj)
      }
      flowInput(params).then(res => {
        res[0].fields.map(item => {
          item['aliasName'] = item.name
        })
        this.list = res[0].fields

        this.loading = false
      })
    },
    // 提交批量操作
    submitBatchForm() {

    },
    handleCloseBatchModify() {
      this.batchModify = false
      this.batch.outType = ''
      this.batch.outPutLength = ''
      this.batch.outPutAccuracy = ''
    },
    handleBatchModif() {
      this.batchModify = true
    },
    handlePreviou() {
      if (this.activeNum !== 1) {
        this.activeNum -= 1
      }
    },
    handleNext() {
      if (this.activeNum !== 3) {
        this.activeNum += 1
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    submitForm() {
      const jsonConfig = JSON.parse(this.config)
      const config = {
        tablename: this.outTableName,
        ifexists: this.outType,
        database: jsonConfig.database,
        type: jsonConfig.type,
        password: jsonConfig.password,
        host: jsonConfig.host,
        port: jsonConfig.port,
        username: jsonConfig.username,
        fields: this.selectedTable,
        dataSource: this.dataSource
      }
      this.data.nodeList.filter((node) => {
        if (node.id === this.node.id) {
          node.config = config
        }
      })
      console.log(this.data)
      this.$emit('dialogClose')
    },
    handleClose() {
      this.$emit('dialogClose')
    },
    /**
       * 表单修改，这里可以根据传入的ID进行业务信息获取
       * @param data
       * @param id
       */
    init(data, id) {
      this.data = data
      data.nodeList.filter((node) => {
        if (node.id === id) {
          this.node = cloneDeep(node)
        }
      })
    },
    reset() {
      this.data.nodeList.filter((node) => {
        if (node.id === this.node.id) {
          this.node = cloneDeep(node)
        }
      })
    },
    save() {
      this.data.nodeList.filter((node) => {
        if (node.id === this.node.id) {
          node.name = this.node.name
          node.left = this.node.left
          node.top = this.node.top
        }
      })
    }
  }
}
</script>

<style scoped>
  .input-item{
    float: right;
    margin-right: 10px;
  }
  .batch-item{
    margin-bottom: 15px;
  }
  .batch-item .search-input{
    width: 160px;
  }
  .search-input{
    width: 130px;
  }
  .left-container{
    border: 1px solid #e2e2e2;
    height: 400px;
  }
  .padding-dialog>>> td .cell, .padding-dialog>>> th .cell{
    line-height: 30px !important;
    height: 30px !important;
  }
  .padding-dialog>>> td{
    height: 30px !important;
  }
  .padding-dialog>>> .el-tree-node__content:hover {
    background-color: #9bcac7;
    color: #fff;
  }
</style>
