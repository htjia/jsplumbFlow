<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="editVisible"
    class="dialog"
    title="编辑"
    width="800px"
    @close="handleClose">
    <el-steps :active="activeNum" align-center style="margin-bottom: 20px">
      <el-step title="选择输入数据"/>
      <el-step title="输入数据预览"/>
      <el-step title="输入数据结构预览"/>
    </el-steps>
    <div v-show="activeNum === 1">
      <el-row :gutter="15">
        <el-col :span="8">
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
        <el-col :span="16">
          <div class="module-container left-container">
            <div class="module-title">
              <div class="module-title-text">SQL编辑器</div>
            </div>
            <div style="height: 356px;">
              <json-editor ref="jsonEditor" v-model="sql" mode="sql"/>
            </div>
            <!--<el-input :rows="16" v-model="sql" type="textarea"/>-->
          </div>
        </el-col>
      </el-row>
    </div>
    <div v-show="activeNum === 2">
      <el-table
        :data="list"
        height="400"
        border
        fit>
        <el-table-column v-for="(item, index) in tableHeader" :key="index" :label="item" :prop="item" align="center" show-overflow-tooltip/>
      </el-table>
    </div>
    <div v-show="activeNum === 3">
      <el-table
        :data="list2"
        height="400"
        border
        fit>
        <el-table-column label="字段名" align="center" prop="columnName"/>
        <el-table-column label="类型" align="center" prop="columnType" show-overflow-tooltip/>
        <el-table-column label="注释" align="center" prop="columnComment" show-overflow-tooltip/>
      </el-table>
    </div>
    <div style="float: right; margin-top: 5px;margin-right: 30px" class="handle">
      <span :class="{'high-ligh': activeNum !== 1}" @click="handlePreviou">上一步</span>
      <span :class="{'high-ligh': activeNum !== 3}" style="margin-left: 10px" @click="handleNext">下一步</span>
    </div>
    <div style="height: 80px;">
      <div slot="footer" style="float: left;margin-top: 20px">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { cloneDeep } from 'lodash'
import { query, queryTable, queryTableData, queryTableFiled } from '@/api/enterpriseDataCenter/dataSource'
import JsonEditor from '@/components/JsonEditor'
export default {
  components: {
    JsonEditor
  },
  props: {
    editDialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      value: '',
      editVisible: false,
      treeLoading: false,
      dataSource: '',
      tableName: '',
      selectedSourceId: '',
      tableHeader: [],
      list2: [],
      activeNum: 1,
      dataSourceList: [],
      sql: '',
      node: {},
      list: [],
      data: {},
      filterText: '',
      treeData: [],
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
      }
    },
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted() {
  },
  methods: {
    selectChange(id) {
      this.selectedSourceId = id
      this.treeLoading = true
      queryTable(id).then(res => {
        this.treeLoading = false
        this.treeData = res.data
      })
    },
    fetchDataSource() {
      this.activeNum = 1
      this.treeData = []
      const params = {
        pageNum: 1,
        pageSize: 1000,
        name: ''
      }
      query(params).then(res => {
        this.dataSourceList = res.data.datasouces
        if (this.node.dataSource !== '') {
          setTimeout(() => {
            this.initData()
          }, 100)
        }
      })
    },
    initData() {
      this.data.nodeList.filter((node) => {
        if (node.id === this.node.id) {
          this.dataSource = node.dataSource
          this.sql = node.sql
          this.tableName = node.tableName
          if (node.dataSource !== '' && node.dataSource !== undefined) {
            this.selectChange(this.dataSource)
          }
        }
      })
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
      if (this.activeNum === 2 && this.sql !== '' && this.sql !== undefined) {
        this.queryTableDataFun()
      }
      if (this.activeNum === 3 && this.tableName !== '' && this.tableName !== undefined) {
        this.queryTableFiledFun()
      }
    },
    // 获取表下的字段
    queryTableFiledFun() {
      const params = {
        table_name: this.tableName,
        datasource_id: this.dataSource
      }
      queryTableFiled(params).then(res => {
        this.list2 = res.data
      })
    },
    // 获取表下的数据
    queryTableDataFun() {
      const params = {
        sql: this.sql,
        id: this.dataSource
      }
      queryTableData(params).then(res => {
        this.list = res.data
        if (this.list.length > 0) {
          this.tableHeader = Object.keys(this.list[0])
        }
      })
    },
    nodeClick(data) {
      if (data.children === undefined) {
        this.tableName = data.tableName
        this.sql = `select * from ${data.tableName}`
        this.$emit('tableChange')
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.tableName.indexOf(value) !== -1
    },
    submitForm() {
      const dataSource = this.dataSourceList.find(item => item.id === this.selectedSourceId)
      const config = JSON.parse(dataSource.config)
      config.sql = this.sql
      this.data.nodeList.filter((node) => {
        if (node.id === this.node.id) {
          node.config = config
          node.sql = this.sql
          node.dataSource = this.dataSource
          node.tableName = this.tableName
        }
      })
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
      console.log(123123)
      this.data = data
      data.nodeList.filter((node) => {
        if (node.id === id) {
          this.node = cloneDeep(node)
        }
      })
      console.log(this.node, '0000000000000')
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
  .flow-node-form {
    background-color: #f7f9fb;
    /*margin-left: 5px;*/
  }

  .flow-node-form-header {
    height: 32px;
    border-top: 1px solid #dce3e8;
    border-bottom: 1px solid #dce3e8;
    background: #ebeef2;
    color: #000;
    line-height: 32px;
    padding-left: 12px;
    font-size: 14px;
  }

  .flow-node-form-body {
    margin-top: 10px;
    padding-right: 10px;
    padding-bottom: 20px;
  }
  .left-container{
    border: 1px solid #e2e2e2;
    height: 400px;
  }
  .left-container .title{
    line-height: 45px;
  }
  .dialog>>> .el-textarea__inner{
    border-radius: 0;
    border: none
  }
  .handle span{
    cursor: default;
  }
  .handle .high-ligh{
    color: #009494;
    cursor: pointer;
  }
  .dialog>>> td .cell, .dialog>>> th .cell{
    line-height: 30px !important;
    height: 30px !important;
  }
  .dialog>>> td{
    height: 30px !important;
  }
  .dialog>>> .el-tree-node__content:hover {
    background-color: #9bcac7;
    color: #fff;
  }
</style>
