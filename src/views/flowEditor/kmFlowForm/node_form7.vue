<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="editVisible"
    class="padding-dialog"
    title="编辑"
    width="650px"
    @close="handleClose">
    <el-form ref="dataForm" :validate-on-rule-change="false" :model="dataForm" :rules="rules" size="mini" status-icon label-width="110px" label-position="right">
      <div class="module-title" style="margin-top: -12px">
        <div class="module-title-text">选择字段</div>
      </div>
      <el-form-item prop="unification" label="数据标准化">
        <el-select v-model="dataForm.unification" size="mini" class="search-input" placeholder="请选择">
          <el-option
            v-for="item in unificationList"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
      </el-form-item>
      <div class="module-title">
        <div class="module-title-text">算法配置参数</div>
      </div>
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
      <div class="module-title">
        <div class="module-title-text">聚类定序</div>
      </div>
      <el-radio v-model="radio" label="1">禁用</el-radio>
      <el-radio v-model="radio" label="2">启用</el-radio>
      <el-row style="margin-top: 10px">
        <el-col :span="8">
          <el-select v-model="dataForm.decisionField" size="mini" class="search-input" placeholder="请选择判定字段" clearable>
            <el-option
              v-for="item in decisionFieldList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-select v-model="dataForm.sortType" size="mini" class="search-input" placeholder="请选择" clearable>
            <el-option
              v-for="item in sortTypeList"
              :key="item.name"
              :label="item.name"
              :value="item.name"/>
          </el-select>
        </el-col>
      </el-row>
    </el-form>
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

export default {
  props: {
    editDialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      radio: '1',
      editVisible: false,
      linkTypeList: [],
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
      tableOneList: [
        { id: 1, name: '设备名称' },
        { id: 2, name: '设备ID' }
      ],
      tableTwoList: [
        { id: 1, name: '设备名称' },
        { id: 2, name: '设备ID' }
      ],
      operatorList: [
        { id: 0, name: '=' },
        { id: 1, name: '>' },
        { id: 2, name: '<' }
      ],
      list: [{}],
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
    }
  },
  methods: {
    nodeInitFun() {
      if (this.node.config) {
        this.dataForm.unification = this.node.config.standarsdization
        this.dataForm.randomSeed = this.node.config.random_state
        this.dataForm.clusterNum = this.node.config.n_clusters
        this.dataForm.iterationNum = this.node.config.max_iter
        this.dataForm.initMethod = this.node.config.init
        this.dataForm.algorithmMethod = this.node.config.algorithm
        this.radio = this.node.config.radio
      } else {
        this.dataForm.unification = ''
        this.dataForm.randomSeed = ''
        this.dataForm.clusterNum = ''
        this.dataForm.iterationNum = ''
        this.dataForm.initMethod = ''
        this.dataForm.algorithmMethod = ''
        this.radio = '1'
      }
    },
    submitForm() {
      const config = {
        standarsdization: this.dataForm.unification,
        random_state: this.dataForm.randomSeed,
        n_clusters: this.dataForm.clusterNum,
        max_iter: this.dataForm.iterationNum,
        init: this.dataForm.initMethod,
        algorithm: this.dataForm.algorithmMethod,
        radio: this.radio
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
    handleDelete(index) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.list.splice(index, 1)
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
    width: 178px;
  }
</style>
