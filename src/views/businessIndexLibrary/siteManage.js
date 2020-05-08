
import PageHeaderLayout from '@/components/PageHeaderLayout'
import JsonEditor from '@/components/JsonEditor'
import { analysisAdd, analysisQuery, analysisUpdata, analysisRemove } from '@/api/enterpriseDataCenter/dataClean'
import CronInput from 'vue-cron-generator/src/components/cron-input'
import { DEFAULT_CRON_EXPRESSION } from 'vue-cron-generator/src/constant/filed'
export default {
  components: { PageHeaderLayout, JsonEditor, CronInput },
  data() {
    return {
      cron: DEFAULT_CRON_EXPRESSION,
      listLoading: false,
      isEdit: false,
      addDialogVisible: false,
      editDialogVisible: false,
      currentcCreateTime: '',
      list: [],
      dataName: '',
      dialogTitle: '',
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      dataForm: {
        name: '',
        remark: ''
      },
      rules: {
        name: [{ required: true, message: '请输入指标名称', trigger: 'blur' }]
      },
      currentId: '',
      fun: '',
      remark: '',
      description: '',
      funList: [],
      treeData: [],
      filterText: '',
      targetCol: '',
      expression: '',
      currentRow: {},
      filedType: 0,
      tableKey: 0,
      treeLoading: false,
      editVisible: false,
      targetColList: [],
      funData: [],
      fieldList: [],
      deepFieldList: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      node: {},
      filterNodeText: ''
    }
  },
  mounted() {
    console.log(DEFAULT_CRON_EXPRESSION, '===============')
    this.fetchData()
  },
  methods: {
    change(cron) {
      this.cron = cron
    },
    reset(cron) {
      this.cron = DEFAULT_CRON_EXPRESSION
    },
    clickItem(data, index) {
      // this.fieldList.map(item => {
      //   item['active'] = false
      // })
      // data['active'] = true
      // this.expression += data.name
      // this.insertInputTxt('textarea', data.name)
    },
    queryFunListFun() {
      queryFunList().then(res => {
        this.funData = cloneDeep(res.data)
        const arr = []
        res.data.map(item => {
          if (!arr.includes(item.type)) {
            arr.push(item.type)
          }
        })
        this.funList = arr
      })
    },
    selectChange(data) {
      this.treeData = this.funData.filter(item => {
        return item.type === data
      })
    },
    nodeClick(data) {
      // this.description = data.description
      // if (data.children === undefined) {
      //   this.expression += data.name
      // }
    },
    insertInputTxt(id, insertTxt) {
      var elInput = document.getElementById(id)
      var startPos = elInput.selectionStart
      var endPos = elInput.selectionEnd
      if (startPos === undefined || endPos === undefined) return
      var txt = elInput.value
      var result = txt.substring(0, startPos) + insertTxt + txt.substring(endPos)
      elInput.value = result
      elInput.focus()
      console.log(result)
      elInput.selectionStart = startPos + insertTxt.length
      elInput.selectionEnd = startPos + insertTxt.length
      console.log(this.expression)
      this.expression = result
      this.currentRow.expression = result
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    filterField(value) {
      if (!value) {
        this.fieldList = this.deepFieldList
      } else {
        this.fieldList = this.fieldList.filter(item => item.name.indexOf(value) !== -1)
      }
    },
    rowClick(row) {
      this.currentRow = row
      this.expression = row.expression
    },
    textareaChange() {
      console.log(1)
      console.log(this.expression)
      this.currentRow.expression = this.expression
    },
    nodeInitFun() {
      this.targetColList = this.node.config.withconditions
      // this.expression = this.targetColList.length > 0 ? this.targetColList[0].expression : ''
      if (this.targetColList.length > 0) {
        this.rowClick(this.targetColList[0])
      }
      setTimeout(() => {
        this.$refs.fieldTable.setCurrentRow(this.targetColList[0])
      }, 200)
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
        this.fieldList = res[0].fields
        this.deepFieldList = cloneDeep(res[0].fields)
        this.loading = false
      })
    },
    // handleAdd() {
    //   const has = this.targetColList.find(item => item.targetCol === this.targetCol)
    //   if (has) {
    //     this.$message.error('新增列名不能重复!')
    //     return false
    //   }
    //   if (this.targetCol.trim() === '') {
    //     this.$message.error('新增列名不能为空!')
    //     return false
    //   }
    //   this.targetColList.push({
    //     targetCol: this.targetCol,
    //     expression: ''
    //   })
    //   this.targetCol = ''
    //   setTimeout(() => {
    //     this.$refs.fieldTable.setCurrentRow(this.targetColList[this.targetColList.length - 1])
    //   }, 200)
    //   this.expression = this.targetColList[this.targetColList.length - 1].expression
    //   this.currentRow = this.targetColList[this.targetColList.length - 1]
    // },
    clearDialogAll() {
      this.expression = ''
    },
    handleDelete(index, row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(row)
        this.targetColList.splice(index, 1)
      })
    },
    submitForm() {
      const withconditions = []
      let flag = false
      let filedName = ''
      this.targetColList.map(item => {
        if (item.expression === '') {
          flag = true
          filedName = item.targetCol
        }
        withconditions.push({
          targetCol: item.targetCol,
          expression: item.expression
        })
      })
      if (flag) {
        this.$message.error(filedName + ' 字段配置不能为空!')
        return
      }
      const config = {
        withconditions
      }
      this.data.nodeList.filter((node) => {
        if (node.id === this.node.id) {
          node.config = config
        }
      })
      console.log(this.data)
      this.$emit('dialogClose')
    },
    handleInFlow(data, index) {
      let table = '1'
      switch (index) {
        case 0 : table = 'history_eqpt_data'
          break
        case 1 : table = 'history_mould_data'
          break
        case 2 : table = 'eqpt_rank_set'
          break
        case 3 : table = 'history_shift_data'
          break
      }
      this.$router.push({ path: '/flowEditor/index', query: { id: data.id, flow: data.flow, kmeans: 1, tb: table }})
    },
    // 新增
    handleAdd() {
      console.log(this.cron, '=============================')
      this.isEdit = false
      this.addDialogVisible = true
    },
    handleDeleteRow(row) {
      this.$confirm('确定删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        analysisRemove(row.id).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          if (this.list.length === 1 && this.pageNum !== 1) {
            this.pageNum = this.pageNum - 1
          }
          this.fetchData()
        })
      })
    },
    // 每页数量改变
    sizeChange(pageSize) {
      this.pageSize = pageSize
      this.fetchData()
    },
    // 当前页数改变
    currentChange(pageNum) {
      this.pageNum = pageNum
      this.fetchData()
    },
    handleSearch() {
      this.pageNum = 1
      this.fetchData()
    },
    // 查询
    fetchData() {
      this.listLoading = true
      const params = {
        name: this.dataName,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      analysisQuery(params).then(res => {
        this.list = res.data.dataflows
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    // 关闭
    handleClose(formName) {
      this.$refs.dataForm.resetFields()
      this.dataForm = {
        name: ''
      }
      this.addDialogVisible = false
    },
    handleEdit(row) {
      this.isEdit = true
      this.currentId = row.id
      this.currentcCreateTime = row.createTime
      this.addDialogVisible = true
      this.dataForm.name = row.name
      this.dataForm.remark = row.comment
    },
    // 添加提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            name: this.dataForm.name,
            comment: this.dataForm.remark
          }
          if (this.isEdit) {
            params.id = this.currentId
            params.createTime = this.currentcCreateTime
            analysisUpdata(params).then(res => {
              this.$message({
                type: 'success',
                message: '编辑成功!'
              })
              this.addDialogVisible = false
              this.fetchData()
            })
          } else {
            analysisAdd(params).then(res => {
              this.$message({
                type: 'success',
                message: '添加成功!'
              })
              this.addDialogVisible = false
              this.fetchData()
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 取消
    resetForm(formName) {
      this.addDialogVisible = false
      this.editDialogVisible = false
      this.$refs[formName].resetFields()
    },
    clearAll() {
      this.pageNum = 1
      this.pageSize = 15
      this.dataName = ''
      this.fetchData()
    }
  }
}

