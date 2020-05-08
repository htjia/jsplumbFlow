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
    <el-form v-show="activeTabIndex === 0" ref="dataForm" :validate-on-rule-change="false" :model="dataForm" :rules="rules" size="mini" status-icon label-width="130px" label-position="right">
      <el-row :gutter="15">
        <el-col :span="12">
          <el-form-item prop="unification" label="基评估器数量">
            <el-input v-model="dataForm.unification" type="number" class="search-input" placeholder="请输入基评估器数量"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="数的最大深度">
            <el-input v-model="dataForm.sdzdsd" type="number" class="search-input" placeholder="请输入数的最大深度"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="12">
          <el-form-item prop="randomSeed" label="随机种子">
            <el-input v-model="dataForm.randomSeed" type="number" class="search-input" placeholder="请输入随机种子"/>
          </el-form-item>
          <el-form-item label="样本平衡">
            <el-select v-model="dataForm.clusterNum" size="mini" class="search-input" placeholder="请选择" clearable>
              <el-option
                v-for="item in clusterList"
                :key="item.name"
                :label="item.name"
                :value="item.name"/>
            </el-select>
          </el-form-item>
          <el-form-item label="分支数的特征个数">
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
          <el-form-item prop="iterationNum" label="模型评价标准">
            <el-select v-model="dataForm.iterationNum" size="mini" class="search-input" placeholder="请选择" clearable multiple collapse-tags>
              <el-option
                v-for="item in algorithmMethodList"
                :key="item.name"
                :label="item.name"
                :value="item.name"/>
            </el-select>
          </el-form-item>
          <el-form-item prop="algorithmMethod" label="检验样本占比%">
            <el-input v-model="dataForm.algorithmMethod" type="number" class="search-input" placeholder="请输入检验样本占比"/>
          </el-form-item>
          <el-form-item prop="measure" label="不纯度衡量标准">
            <el-select v-model="dataForm.measure" size="mini" class="search-input" placeholder="请选择" clearable>
              <el-option
                v-for="item in measureList"
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
        { name: 'auto' },
        { name: 'all' },
        { name: 'log2' }
      ],
      clusterList: [
        { name: 'Balanced' },
        { name: 'None' }
      ],
      algorithmMethodList: [
        { name: '标准率' },
        { name: '召回率' },
        { name: 'ROC曲线' }
      ],
      sortTypeList: [
        { name: '从大到小' },
        { name: '从小到大' }
      ],
      measureList: [
        { name: '基尼系数' },
        { name: '信息熵' }
      ],
      dataForm: {
        dataStandard: '',
        unification: '',
        sdzdsd: '',
        clusterNum: '',
        iterationNum: [],
        randomSeed: '',
        initMethod: '',
        algorithmMethod: '',
        sortType: '',
        measure: '',
        decisionField: ''
      },
      rules: {
        dataStandard: [{ required: true, message: '请选择', trigger: 'blur' }],
        unification: [{ required: true, message: '请输入基评估器数量', trigger: 'blur' }],
        clusterNum: [{ required: true, message: '请输入聚类个数', trigger: 'blur' }],
        iterationNum: [{ required: true, message: '请选择', trigger: 'blur' }],
        randomSeed: [{ required: true, message: '请输入随机种子', trigger: 'blur' }],
        initMethod: [{ required: true, message: '请选择', trigger: 'blur' }],
        algorithmMethod: [{ required: true, message: '请输入检验样本占比', trigger: 'blur' }]
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
      list1: [],
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
    queryTableFiledFun(table) {
      const params = {
        table_name: table,
        datasource_id: '2e9ba392-22a8-449e-b266-443e7722c9c8'
      }
      queryTableFiled(params).then(res => {
        const list1 = []
        res.data.map(item => {
          list1.push(
            { name: item.columnName, type: item.columnType, value: '自变量' },
          )
        })
        this.list1 = Array.from(new Set([...this.list1, ...list1]))
        this.deepList = cloneDeep(this.list1)
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
        this.dataForm.measure = this.node.config.measure
        this.dataForm.sdzdsd = this.node.config.sdzdsd
        this.dataForm.randomSeed = this.node.config.random_state
        this.dataForm.clusterNum = this.node.config.n_clusters
        this.dataForm.iterationNum = this.node.config.max_iter
        this.dataForm.initMethod = this.node.config.init
        this.dataForm.algorithmMethod = this.node.config.algorithm
        this.radio = this.node.config.radio
      } else {
        this.dataForm.unification = ''
        this.dataForm.measure = ''
        this.dataForm.sdzdsd = ''
        this.dataForm.randomSeed = ''
        this.dataForm.clusterNum = ''
        this.dataForm.iterationNum = []
        this.dataForm.initMethod = ''
        this.dataForm.algorithmMethod = ''
        this.radio = '1'
      }
      this.list1 = []
      const table = ['eqpt_rank_set', 'history_shift_data', 'mould_rank_set']
      table.map(item => {
        this.queryTableFiledFun(item)
      })
      // this.list1.push({ name: 'prediction', type: 'varcher', value: '因变量' })
      // if (this.list2.length > 0) {
      //   const listNames = []
      //   this.list2.map(item => {
      //     listNames.push(item.name)
      //   })
      //   this.list1 = this.deepList.filter(function(item) {
      //     return listNames.indexOf(item.name) < 0
      //   })
      // } else {
      //   this.list1 = this.deepList
      // }
    },
    submitForm() {
      console.log(this.list2)
      const config = {
        sdzdsd: this.dataForm.sdzdsd,
        standarsdization: this.dataForm.unification,
        measure: this.dataForm.measure,
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
