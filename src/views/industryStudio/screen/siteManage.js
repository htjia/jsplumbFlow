
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { selectall, addAnalysis, deleteAnalysis, updateAnalysis } from '@/api/analysis'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      infoDialogVisible: false,
      programForm: {
        name: '',
        remark: ''
      },
      rules: {
        name: [{ required: true, message: '内容不可为空', trigger: 'blur' }]
      },
      list: [],
      dataname: '',
      type: '',
      pageSize: 10,
      pageNum: 1,
      totalPage: 0,
      currentId: 0,
      typeList: [
        {
          id: 0,
          name: 'Mysql'
        },
        {
          id: 1,
          name: 'SQLsever'
        },
        {
          id: 2,
          name: 'Oracle'
        },
        {
          id: 3,
          name: 'Hbase'
        }
      ]
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    // 查询按钮点击
    handleSearch() {
      this.pageNum = 1
      this.fetchData()
    },
    // 每页数量改变
    sizeChange(pageSize) {
      this.pageSize = pageSize
      this.fetchData()
    },
    clearAll() {
      this.pageNum = 1
      this.pageSize = 10
      this.dataname = ''
      this.type = ''
      this.fetchData()
    },
    // 当前页数改变
    currentChange(pageNum) {
      this.pageNum = pageNum
      this.fetchData()
    },
    fetchData() {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        name: (this.dataname === '' || this.dataname === null) ? null : this.dataname
      }
      selectall(params).then(res => {
        this.list = res.data.list
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    deleteItem(row) {
      this.$confirm('确定删除该报告?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: row.id
        }
        deleteAnalysis(params).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.fetchData()
        })
      })
    },
    handleEdit(row) {
      this.currentId = row.id
      this.programForm = {
        name: row.name,
        remark: row.remark
      }
      this.editDialogVisible = true
    },
    // 添加
    handleAdd() {
      this.programForm = {
        name: '',
        remark: ''
      }
      this.addDialogVisible = true
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
    },
    // 取消
    resetForm(formName) {
      this.addDialogVisible = false
      this.editDialogVisible = false
      this.$refs[formName].resetFields()
    },
    // 添加提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            name: this.programForm.name,
            remark: this.programForm.remark,
            creater: 1
          }
          addAnalysis(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '添加成功!'
              })
              this.$refs[formName].resetFields()
              this.addDialogVisible = false
              this.fetchData()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 编辑提交
    submitEditForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            id: this.currentId,
            name: this.programForm.name,
            remark: this.programForm.remark,
            creater: 1
          }
          updateAnalysis(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.$refs[formName].resetFields()
              this.editDialogVisible = false
              this.fetchData()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    findInfo(item) {
      sessionStorage.setItem('reportInfo', JSON.stringify(item))
      this.$router.push({ path: '/presentation/index' })
    },
    viewItem(row) {
      window.open('/#/publicView/index:' + row.id, '_blank')
    }
  }
}

