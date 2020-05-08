import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { roles, add, remove, menus } from '@/api/roles'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    const validateName = (rule, value, callback) => {
      const chinese = new RegExp('[\u4e00-\u9fa5]')
      if (value.trim().length === 0) {
        callback(new Error('请输入角色名称'))
      } else {
        if (value.length > 20) {
          callback(new Error('角色名称不能大于 20 位'))
        } else if (!chinese.test(value)) {
          callback(new Error('角色名称必须为中文'))
        } else {
          callback()
        }
      }
    }
    return {
      routers: [],
      routerValues: [],
      checkAll: false,
      isIndeterminate: false,
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      checkedRouters: [],
      list: [],
      searchkey: '',
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      name: '',
      roleForm: {
        roleName: '',
        checkedRouters: []
      },
      rules: {
        roleName: [{ required: true, validator: validateName, trigger: 'blur' }],
        checkedRouters: [{ type: 'array', required: true, message: '请选择用户权限', trigger: 'blur' }]
      },
      selectedArr: [],
      currentId: ''
    }
  },
  watch: {
  },
  created() {
    const params = {
      pageNum: 1,
      pageSize: 15,
      searchkey: ''
    }
    this.fetchData(params)
  },
  mounted() {
    this.getRouterList()
  },
  methods: {
    handleCheckAllChange(val) {
      this.roleForm.checkedRouters = val ? this.routerValues : []
      this.isIndeterminate = false
      console.log(this.roleForm.checkedRouters)
    },
    handleCheckedRoutersChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.routers.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.routers.length
    },
    // 每页数量改变
    sizeChange(pageSize) {
      const params = {
        pageNum: this.pageNum,
        pageSize
      }
      this.pageSize = pageSize
      this.fetchData(params)
    },
    // 当前页数改变
    currentChange(pageNum) {
      const params = {
        pageSize: this.pageSize,
        pageNum
      }
      this.pageNum = pageNum
      this.fetchData(params)
    },
    handleSearch(data) {
      this.pageNum = 1
      const params = {
        pageSize: this.pageSize,
        pageNum: 1,
        searchkey: data
      }
      this.fetchData(params)
    },
    // 查询
    fetchData(params) {
      this.listLoading = true
      const requestParams = params || {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        searchkey: this.searchkey
      }
      roles(requestParams).then(res => {
        if (res.code === 0) {
          this.list = res.data.list
          this.totalPage = parseInt(res.data.total)
          this.listLoading = false
        }
      })
    },
    // 添加
    handleAdd() {
      this.roleForm.roleName = ''
      this.roleForm.checkedRouters = []
      this.isIndeterminate = false
      this.checkAll = false
      this.addDialogVisible = true
    },
    // 关闭
    handleClose(formName) {
      this.$refs[formName].resetFields()
    },
    // 添加提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            name: this.roleForm.roleName.trim(),
            cnname: this.roleForm.roleName.trim(),
            roleMenuList: this.roleForm.checkedRouters
          }
          add(params).then(res => {
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
            name: this.roleForm.roleName.trim(),
            cnname: this.roleForm.roleName.trim(),
            id: this.currentId,
            roleMenuList: this.roleForm.checkedRouters
          }
          add(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '编辑成功!'
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
    // 取消
    resetForm(formName) {
      this.editDialogVisible = false
      this.addDialogVisible = false
      this.$refs[formName].resetFields()
    },
    // 编辑
    handleEdit(row) {
      const checkedCount = row.roleMenuList.length
      this.checkAll = checkedCount === this.routers.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.routers.length
      this.currentId = row.id
      this.roleForm.roleName = row.cnname
      this.roleForm.checkedRouters = row.roleMenuList
      this.editDialogVisible = true
    },
    // 删除
    handleDelete(row) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        remove(row.id).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.editDialogVisible = false
            this.fetchData()
          }
        })
      }).catch(() => {
      })
    },
    // 获取菜单
    getRouterList() {
      menus({}).then(res => {
        if (res.code === 0) {
          const RouterMap = []
          for (const item of res.data) {
            RouterMap.push({
              name: item.menuName,
              value: item.id
            })
            this.routerValues.push(item.id)
          }
          this.routers = RouterMap
        }
      })
    }
  }
}

