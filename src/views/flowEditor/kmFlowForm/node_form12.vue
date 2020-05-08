<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="editVisible"
    class="padding-dialog"
    title="编辑"
    width="800px"
    @close="handleClose">
    <el-table
      :data="list"
      height="420"
      border
      fit>
      <el-table-column label="选择模型" align="center" prop="status">
        <template slot-scope="scope">
          <el-radio :label="scope.row.id" v-model="tableRadio">&nbsp;</el-radio>
        </template>
      </el-table-column>
      <el-table-column label="以生产模型名称" align="center" width="180" prop="name"/>
      <el-table-column label="组件名称" align="center" width="120" prop="template"/>
      <el-table-column label="数据分析名称" align="center" width="120" prop="dataName"/>
      <el-table-column label="分析描述" align="center" prop="remark"/>
      <el-table-column label="生产时间" align="center" width="120" prop="time"/>
    </el-table>
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
      tableRadio: '1',
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
      list: [
        { id: '1', name: 'K-means', template: '设备等级聚类', dataName: '设备派工推荐', remark: '无', time: '2020-04-02 10:32' },
        { id: '2', name: 'K-means', template: '模具等级聚类', dataName: '设备派工推荐', remark: '无', time: '2020-04-02 10:35' }
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
