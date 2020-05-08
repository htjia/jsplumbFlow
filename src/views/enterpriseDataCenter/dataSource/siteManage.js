
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { add, query, updata, remove, test } from '@/api/enterpriseDataCenter/dataSource'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    return {
      listLoading: false,
      testLoading: false,
      isEdit: false,
      addDialogVisible: false,
      editDialogVisible: false,
      currentcCreateTime: '',
      isTest: 2,
      dataName: '',
      dataType: '',
      list: [{}],
      dataTypeList: [
        { name: 'MySQL' },
        { name: 'Oracle' },
        { name: 'SQL Sever' },
        { name: 'PostgreSQL' }
      ],
      dataForm: {
        name: '',
        type: '',
        address: '',
        userName: '',
        dataPort: '',
        password: '',
        dataBase: '',
        remark: ''
      },
      rules: {
        name: [{ required: true, message: '请输入数据源名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型', trigger: 'blur' }],
        address: [{ required: true, message: '请输入主机地址', trigger: 'blur' }],
        userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        dataPort: [{ required: true, message: '请输入端口号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        dataBase: [{ required: true, message: '请输入数据库名', trigger: 'blur' }]
      },
      pageSize: 10,
      pageNum: 1,
      totalPage: 0,
      currentId: 0
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
      this.dataName = ''
      this.dataType = ''
      this.fetchData()
    },
    // 当前页数改变
    currentChange(pageNum) {
      this.pageNum = pageNum
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        name: this.dataName
      }
      query(params).then(res => {
        this.list = res.data.datasouces
        this.totalPage = parseInt(res.data.total)
        this.listLoading = false
      })
    },
    deleteItem(row) {
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
    handleEdit(row) {
      this.isEdit = true
      this.addDialogVisible = true
      this.currentId = row.id
      this.isTest = row.istest
      this.currentcCreateTime = row.createTime
      this.dataForm.name = row.name
      this.dataForm.remark = row.comment
      this.dataForm.type = row.type
      const config = JSON.parse(row.config)
      this.dataForm.address = config.host
      this.dataForm.dataPort = config.port
      this.dataForm.userName = config.username
      this.dataForm.password = config.password
      this.dataForm.dataBase = config.database
    },
    handleAdd() {
      this.isEdit = false
      this.addDialogVisible = true
      this.isTest = 2
      this.dataForm.name = ''
      this.dataForm.remark = ''
      this.dataForm.type = ''
      this.dataForm.address = ''
      this.dataForm.dataPort = ''
      this.dataForm.userName = ''
      this.dataForm.password = ''
      this.dataForm.dataBase = ''
    },
    findInfo() {
      this.infoDialogVisible = true
    },
    closeDialog(formName) {
      this.testLoading = false
      this.$refs[formName].resetFields()
    },
    // 取消
    resetForm(formName) {
      this.addDialogVisible = false
      this.$refs[formName].resetFields()
    },
    handleTest(formName) {
      const params = {
        type: this.dataForm.type,
        host: this.dataForm.address,
        port: this.dataForm.dataPort,
        username: this.dataForm.userName,
        password: this.dataForm.password,
        database: this.dataForm.dataBase
      }
      this.$refs.dataForm.validateField('type', errMsg => {
        if (!errMsg) {
          this.$refs.dataForm.validateField('address', errMsg => {
            if (!errMsg) {
              this.$refs.dataForm.validateField('dataPort', errMsg => {
                if (!errMsg) {
                  this.$refs.dataForm.validateField('userName', errMsg => {
                    if (!errMsg) {
                      this.$refs.dataForm.validateField('password', errMsg => {
                        if (!errMsg) {
                          this.$refs.dataForm.validateField('dataBase', errMsg => {
                            if (!errMsg) {
                              this.testLoading = true
                              test(params).then(res => {
                                this.testLoading = false
                                if (res.data.isTest) {
                                  this.$message({
                                    type: 'success',
                                    message: '连接成功!'
                                  })
                                  this.isTest = 0
                                } else {
                                  this.$message({
                                    type: 'error',
                                    message: '连接失败!'
                                  })
                                  this.isTest = 1
                                }
                              })
                            }
                          })
                        }
                      })
                    }
                  })
                }
              })
            }
          })
        }
      })
    },
    // 添加提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const config = {
            type: this.dataForm.type,
            host: this.dataForm.address,
            port: this.dataForm.dataPort,
            username: this.dataForm.userName,
            password: this.dataForm.password,
            database: this.dataForm.dataBase
          }
          const params = {
            istest: this.isTest,
            comment: this.dataForm.remark,
            config: JSON.stringify(config),
            name: this.dataForm.name,
            type: this.dataForm.type
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
    }
  }
}

