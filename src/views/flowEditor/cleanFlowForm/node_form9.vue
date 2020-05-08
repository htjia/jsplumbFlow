<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="editVisible"
    class="padding-dialog"
    title="编辑"
    width="800px"
    @close="handleClose">
    <el-row :gutter="10">
      <el-col :span="16">
        <div class="module-container">
          <div class="module-title" style="border: 1px solid #aad7d7; border-bottom: none">
            <div class="module-title-text">选择拆分的字段</div>
          </div>
          <div class="module-content" style="padding: 0;border: none">
            <el-table
              :data="list"
              height="420"
              border
              fit
              @row-click="rowClick"
            >
              <el-table-column label="字段名称" align="center" prop="name"/>
              <el-table-column label="类型" align="center" prop="type" width="150"/>
              <el-table-column label="单选" align="center" prop="status" width="80">
                <template slot-scope="scope">
                  <el-radio :label="scope.row.name" v-model="tableRadio">&nbsp;</el-radio>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="module-container">
          <div class="module-title" style="border: 1px solid #aad7d7; border-bottom: none">
            <div class="module-title-text">选择分隔符</div>
          </div>
          <div class="module-content" style="padding: 0;border: none">
            <el-table
              :data="splitList"
              height="420"
              border
              fit
              @row-click="splitRowClick"
            >
              <el-table-column label="类型" align="center" prop="name" width="80"/>
              <el-table-column label="单选" align="center" prop="status">
                <template slot-scope="scope">
                  <el-radio :label="scope.row.id" v-model="splitRadio">&nbsp;</el-radio>
                  <el-input
                    v-if="scope.row.id === 'other'"
                    v-model="otherText"
                    size="mini"
                    style="width: 120px;"
                    maxlength="20"
                    placeholder="请输入"/>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
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
import { flowInput } from '@/api/enterpriseDataCenter/dataSource'
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
      splitRadio: '/t',
      tableRadio: '',
      otherText: '',
      editVisible: false,
      loading: false,
      linkTypeList: [],
      splitList: [
        { name: 'TAB键', id: '/t' },
        { name: '分号', id: ';' },
        { name: '逗号', id: ',' },
        { name: '空格', id: ' ' },
        { name: '其他', id: 'other' }
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
      list: [],
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
    rowClick(row) {
      this.tableRadio = row.name
    },
    splitRowClick(row) {
      this.splitRadio = row.id
    },
    nodeInitFun() {
      console.log(111)
      if (this.node.config) {
        console.log(123)
        this.tableRadio = this.node.config.fieldName
        this.splitRadio = this.node.config.otherText === '' ? this.node.config.separator : 'other'
        this.otherText = this.node.config.otherText
      }
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
          item['active'] = false
        })
        this.list = res[0].fields
        this.loading = false
      })
    },
    submitForm() {
      if (this.tableRadio === '') {
        this.$message.error('请选择拆分的字段!')
        return false
      }
      if (this.splitRadio === 'other' && this.otherText === '') {
        this.$message.error('请输入其他分隔符!')
        return false
      }
      const config = {
        fieldName: this.tableRadio,
        separator: this.splitRadio === 'other' ? this.otherText : this.splitRadio,
        otherText: this.splitRadio === 'other' ? this.otherText : ''
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
  .padding-dialog>>> .el-radio{
    margin-right: 0px;
  }
</style>
