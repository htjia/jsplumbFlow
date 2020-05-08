
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { add, query, updata, remove } from '@/api/enterpriseDataCenter/dataClean'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
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
        name: [{ required: true, message: '请输入数据清洗名称', trigger: 'blur' }]
      },
      currentId: ''
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    handleInFlow(data) {
      this.$router.push({ path: '/flowEditor/index', query: { id: data.id, flow: data.flow }})
    },
    // 新增
    handleAdd() {
      this.isEdit = false
      this.addDialogVisible = true
    },
    handleDeleteRow(row) {
      this.$confirm('确定删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        remove(row.id).then(res => {
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
      query(params).then(res => {
        this.list = res.data.dataflows
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
      this.dataForm = {
        name: '',
        remark: ''
      }
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
            updata(params).then(res => {
              this.$message({
                type: 'success',
                message: '编辑成功!'
              })
              this.addDialogVisible = false
              this.fetchData()
            })
          } else {
            add(params).then(res => {
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

