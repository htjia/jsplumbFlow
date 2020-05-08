<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="editVisible"
    class="padding-dialog"
    title="编辑"
    width="800px"
    @close="handleClose">
    <div class="tab-control" style="margin-top: -10px">
      <span
        :class="{activeTab: activeTabIndex === 0}"
        @click="tabClick(0)"
      >参数配置</span>
      <span
        :class="{activeTab: activeTabIndex === 1}"
        class="has-margin-left"
        @click="tabClick(1)"
      >角色定义</span>
    </div>
    <el-form v-show="activeTabIndex === 0" ref="dataForm" :validate-on-rule-change="false" :model="dataForm" :rules="rules" size="mini" status-icon label-width="110px" label-position="right">
      <el-form-item prop="unification" label="数据标准化">
        <el-select v-model="dataForm.unification" size="mini" class="search-input" placeholder="请选择">
          <el-option
            v-for="item in unificationList"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-row :gutter="15">
        <el-col :span="12">
          <el-form-item prop="clusterNum" label="聚类个数">
            <el-input v-model="dataForm.clusterNum" type="number" class="search-input" placeholder="请输入聚类个数"/>
          </el-form-item>
          <el-form-item prop="randomSeed" label="随机种子">
            <el-input v-model="dataForm.randomSeed" type="number" class="search-input" placeholder="请输入随机种子"/>
          </el-form-item>
          <el-form-item prop="dataStandard" label="初始化方法">
            <el-select v-model="dataForm.initMethod" size="mini" class="search-input" placeholder="请选择" clearable>
              <el-option
                v-for="item in initMethodList"
                :key="item.name"
                :label="item.name"
                :value="item.name"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="iterationNum" label="最大迭代次数">
            <el-input v-model="dataForm.iterationNum" type="number" class="search-input" placeholder="请输入最大迭代次数"/>
          </el-form-item>
          <el-form-item prop="algorithmMethod" label="算法实现方法">
            <el-select v-model="dataForm.algorithmMethod" size="mini" class="search-input" placeholder="请选择" clearable>
              <el-option
                v-for="item in algorithmMethodList"
                :key="item.name"
                :label="item.name"
                :value="item.name"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="聚类定序">
        <el-radio v-model="radio" label="1">禁用</el-radio>
        <el-radio v-model="radio" label="2">启用</el-radio>
      </el-form-item>
    </el-form>
    <el-row v-show="activeTabIndex === 1" :gutter="15">
      <el-col :span="8">
        <div class="module-container">
          <div class="module-title" style="border:1px solid #e2e2e2;margin-bottom: 0">
            <div class="module-title-text">选择字段</div>
          </div>
          <div class="module-content" style="padding: 0">
            <el-input
              v-model="filterText"
              size="small"
              placeholder="搜索字段名"/>
            <div>
              <div style="height: 388px;border: 1px solid #e2e2e2;border-top: none; overflow: auto; padding: 5px">
                <draggable v-model="list1" :options="draggableOptions">
                  <div v-for="(item, index) in list1" :type="item.name" :key="item.name" class="field-item" @click="addItem(item, index)" v-text="item.name"/>
                </draggable>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="16" class="right">
        <div class="input-item">
          <span class="input-title">角色判断批量处理 </span>
          <el-select v-model="ruleType" size="small" class="search-input" style="margin-bottom: 10px" placeholder="请选择" @change="selectChange">
            <el-option
              v-for="item in opeartorList"
              :key="item.name"
              :label="item.name"
              :value="item.name"/>
          </el-select>
        </div>
        <draggable v-model="list2" :options="draggableOptions2" class="list-group">
          <el-table
            :data="list2"
            height="420"
            border
            fit>
            <el-table-column label="字段名" align="center" width="260" prop="name"/>
            <el-table-column
              :filters="filters"
              :filter-method="filterType"
              label="类型"
              align="center"
              width="100"
              prop="type"
            />
            <el-table-column label="角色定义" align="center" prop="taskCode">
              <template slot-scope="scope">
                <el-select v-model="scope.row.value" placeholder="请选择" size="mini" style="width: 95%" filterable>
                  <el-option
                    v-for="item in opeartorList"
                    :key="item.name"
                    :label="item.name"
                    :value="item.name"/>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="50">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  circle
                  icon="el-icon-delete"
                  @click="handleDelete(scope.$index, scope.row)"/>
              </template>
            </el-table-column>
          </el-table>
        </draggable>
      </el-col>
    </el-row>
    <div style="height: 50px;margin-top: 20px">
      <span slot="footer" style="float: right;">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </div>
  </el-dialog>
</template>

<script>
import { cloneDeep } from 'lodash'
import { queryTableFiled } from '@/api/enterpriseDataCenter/dataSource'
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },
  props: {
    editDialogVisible: {
      type: Boolean,
      default: false
    },
    isChange: {
      type: Boolean,
      default: false
    },
    addTableName: {
      type: String,
      default: ''
    },
    table: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      radio: '1',
      activeTabIndex: 0,
      fieldType: '',
      editVisible: false,
      linkTypeList: [],
      filters: [],
      unificationList: [
        { name: '标准化', id: 'Standardization' },
        { name: '统一化', id: 'Normalization' }
      ],
      initMethodList: [
        { name: 'k-means++' },
        { name: 'random' }
      ],
      algorithmMethodList: [
        { name: 'auto' },
        { name: 'full' },
        { name: 'elkan' }
      ],
      sortTypeList: [
        { name: '从大到小' },
        { name: '从小到大' }
      ],
      decisionFieldList: [
      ],
      dataForm: {
        dataStandard: '',
        unification: '',
        clusterNum: '',
        iterationNum: 300,
        randomSeed: '',
        initMethod: '',
        algorithmMethod: '',
        sortType: '',
        decisionField: ''
      },
      rules: {
        dataStandard: [{ required: true, message: '请选择', trigger: 'blur' }],
        unification: [{ required: true, message: '请选择', trigger: 'blur' }],
        clusterNum: [{ required: true, message: '请输入聚类个数', trigger: 'blur' }],
        iterationNum: [{ required: true, message: '请输入最大迭代次数', trigger: 'blur' }],
        randomSeed: [{ required: true, message: '请输入随机种子', trigger: 'blur' }],
        initMethod: [{ required: true, message: '请选择', trigger: 'blur' }],
        algorithmMethod: [{ required: true, message: '请选择', trigger: 'blur' }]
      },
      draggableOptions: {
        group: {
          name: 'description'
        },
        sort: false
      },
      draggableOptions2: {
        group: {
          name: 'description',
          pull: false
        },
        sort: false
      },
      list1: [
        { name: '设备ID', type: 'INTEGER', value: '自变量' },
        { name: '设备名称', type: 'VARCHER', value: '自变量' },
        { name: '模具编码', type: 'VARCHER', value: '自变量' },
        { name: '质检报告', type: 'VARCHER', value: '自变量' },
        { name: '合模数', type: 'INTEGER', value: '自变量' },
        { name: '装箱数', type: 'INTEGER', value: '自变量' }
      ],
      list2: [],
      filterText: '',
      tableOneList: [
        { id: 1, name: '设备名称' },
        { id: 2, name: '设备ID' }
      ],
      tableTwoList: [
        { id: 1, name: '设备名称' },
        { id: 2, name: '设备ID' }
      ],
      opeartorList: [
        { name: '自变量' },
        { name: '因变量' }
      ],
      ruleType: '自变量',
      list: [{}],
      deepList: [],
      fieldTypeList: [
        { name: 'INTEGER' },
        { name: 'DOUBLE' },
        { name: 'FLOAT' },
        { name: 'LONG' },
        { name: 'LONG' },
        { name: 'VARCHAR' }
      ],
      linkType: '',
      node: {},
      data: {}
    }
  },
  watch: {
    editDialogVisible(val) {
      this.editVisible = this.editDialogVisible
      if (this.editVisible) {
        setTimeout(() => {
          this.nodeInitFun()
        }, 100)
      }
    },
    filterText(val) {
      this.filterNode(val)
    }
  },
  mounted() {
    this.deepList = cloneDeep(this.list1)
  },
  methods: {
    selectChange(type) {
      this.list1.map(item => { item.value = type })
      this.list2.map(item => { item.value = type })
    },
    // 获取表下的字段
    queryTableFiledFun() {
      // let table = ''
      // if (this.table === 'eqpt_rank_set') {
      //   table = 'history_shift_data'
      // } else {
      //   table = this.table
      // }
      const params = {
        table_name: this.addTableName,
        datasource_id: '2e9ba392-22a8-449e-b266-443e7722c9c8'
      }
      queryTableFiled(params).then(res => {
        const list1 = []
        res.data.map(item => {
          list1.push(
            { name: item.columnName, type: item.columnType, value: '自变量' },
          )
        })
        this.list1 = list1
        this.deepList = cloneDeep(this.list1)
        if (this.list2.length > 0) {
          const listNames = []
          this.list2.map(item => {
            listNames.push(item.name)
          })
          this.list1 = this.deepList.filter(function(item) {
            return listNames.indexOf(item.name) < 0
          })
          // this.list1.push({ name: 'prediction', type: 'int', value: '自变量' })
        } else {
          this.list1 = this.deepList
        }
      })
    },
    filterType(value, row) {
      return row.type === value
    },
    filterNode(value) {
      if (!value) {
        const listNames = []
        this.list2.map(item => {
          listNames.push(item.name)
        })
        this.list1 = this.deepList.filter(function(item) {
          return listNames.indexOf(item.name) < 0
        })
      } else {
        this.list1 = this.list1.filter(item => item.name.indexOf(value) !== -1)
      }
    },
    addItem(item, index) {
      this.list2.push(cloneDeep(item))
      this.list1.splice(index, 1)
    },
    tabClick(index) {
      this.activeTabIndex = index
      if (index === 1) {
        this.filters = []
        this.list2.map(item => {
          this.filters.push({
            text: item.type,
            value: item.type
          })
        })
      }
    },
    nodeInitFun() {
      this.activeTabIndex = 0
      this.list2 = this.node.config.filterList
      this.list1 = this.node.config.list1
      if (this.node.config.standarsdization) {
        this.dataForm.unification = this.node.config.standarsdization
        this.dataForm.randomSeed = this.node.config.random_state
        this.dataForm.clusterNum = this.node.config.n_clusters
        this.dataForm.iterationNum = this.node.config.max_iter
        this.dataForm.initMethod = this.node.config.init
        this.dataForm.algorithmMethod = this.node.config.algorithm
        this.radio = this.node.config.radio
        if (this.table === '1') {
          this.queryTableFiledFun()
          if (this.isChange) {
            this.list2 = []
          }
        }
      } else {
        this.dataForm.unification = ''
        this.dataForm.randomSeed = ''
        this.dataForm.clusterNum = ''
        this.dataForm.iterationNum = ''
        this.dataForm.initMethod = ''
        this.dataForm.algorithmMethod = ''
        this.radio = '1'
        this.queryTableFiledFun()
      }
    },
    submitForm() {
      console.log(this.list2)
      if (this.list2.length === 0) {
        this.$message.error('角色定义不能为空')
        this.activeTabIndex = 1
        return false
      }
      const config = {
        standarsdization: this.dataForm.unification,
        random_state: this.dataForm.randomSeed,
        n_clusters: this.dataForm.clusterNum,
        max_iter: this.dataForm.iterationNum,
        init: this.dataForm.initMethod,
        algorithm: this.dataForm.algorithmMethod,
        radio: this.radio,
        filterList: this.list2,
        list1: this.list1
      }
      this.data.nodeList.filter((node) => {
        if (node.id === this.node.id) {
          node.config = config
        }
      })
      console.log(this.data)
      this.$emit('dialogClose')
    },
    handleAdd() {
      this.list.push({
        value1: '',
        value2: '',
        operator: ''
      })
    },
    handleDelete(index, row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.list2.splice(index, 1)
        row.value = this.ruleType
        this.list1.push(row)
      })
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
  .padding-dialog>>> .el-form-item--mini.el-form-item{
    margin-bottom: 15px;
  }
  .right>>> .sortable-ghost{
    display: none;
  }
  .module-title{
    margin-bottom: 12px;
  }
  .search-input{
    width: 150px;
  }
  .input-item{
    float: left;
  }
</style>
