
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import { getList, remove, configInfo, saveUserDetail, restPassWord } from '@/api/user'
import { roles } from '@/api/roles'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd },
  data() {
    const validateUserName = (rule, value, callback) => {
      const pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
      const chinese = new RegExp('[\u4e00-\u9fa5]')
      if (value.trim().length === 0) {
        callback(new Error('请输入用账号'))
      } else {
        if (chinese.test(value)) {
          callback(new Error('账号不能为汉字'))
        } else if (pattern.test(value)) {
          callback(new Error('账号不能包含特殊字符'))
        } else if (value.length < 5) {
          callback(new Error('账号长度不能小于 5 位'))
        } else if (value.length > 20) {
          callback(new Error('账号长度不能大于 20 位'))
        } else {
          callback()
        }
      }
    }
    const validateName = (rule, value, callback) => {
      const pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
      const num = new RegExp('[0-9]')
      if (value.trim().length === 0) {
        callback(new Error('请输入姓名'))
      } else {
        if (num.test(value)) {
          callback(new Error('姓名不能包含数字'))
        } else if (pattern.test(value)) {
          callback(new Error('姓名不能包含特殊字符'))
        } else if (value.length > 20) {
          callback(new Error('姓名长度不能大于 20 位'))
        } else {
          callback()
        }
      }
    }
    const validatePassWord = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('请输入密码'))
      } else {
        if (value.length < 6) {
          callback(new Error('密码长度不能小于 6 位'))
        } else if (value.length > 20) {
          callback(new Error('密码长度不能大于 20 位'))
        } else {
          callback()
        }
      }
    }
    const validateConfirmPassWord = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('请输入确认密码'))
      } else {
        if (value !== this.userForm.passWord) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      }
    }
    // const validateDept = (rule, value, callback) => {
    //   if (value.length === 0) {
    //     callback(new Error('请选择部门'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      updatePwdDialogVisible: false,
      configDialogVisible: false,
      list: [],
      postOptions: [],
      roleOptions: [],
      deptList: [],
      username: '',
      defaultProps: {
        children: 'child',
        label: 'label'
      },
      treeData: [],
      searchkey: '',
      pageSize: 15,
      pageNum: 1,
      totalPage: 0,
      name: '',
      userForm: {
        name: '',
        userName: '',
        passWord: '',
        confirmPassWord: '',
        role: ''
      },
      // configForm: {
      //   post: '',
      //   dept: ''
      // },
      // configRules: {
      //   post: [{ required: true, message: '请选择岗位', trigger: 'blur' }],
      //   dept: [{ required: true, validator: validateDept, trigger: 'blur' }]
      // },
      rules: {
        name: [{ required: true, validator: validateName, trigger: 'blur' }],
        userName: [{ required: true, validator: validateUserName, trigger: 'blur' }],
        passWord: [{ required: true, validator: validatePassWord, trigger: 'blur' }],
        confirmPassWord: [{ required: true, validator: validateConfirmPassWord, trigger: 'blur' }],
        role: [{ required: true, message: '请选择角色', trigger: 'blur' }]
      },
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
    this.getRoleList()
  },
  methods: {
    getRoleList() {
      const requestParams = {
        pageSize: 1000,
        pageNum: 1,
        searchkey: ''
      }
      roles(requestParams).then(res => {
        if (res.code === 0) {
          this.roleOptions = res.data.list
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
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
      getList(requestParams).then(res => {
        if (res.code === 0) {
          this.list = res.data.list
          this.totalPage = parseInt(res.data.total)
          this.listLoading = false
        } else {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    },
    // 添加
    handleAdd() {
      this.userForm.name = ''
      this.userForm.userName = ''
      this.userForm.passWord = ''
      this.userForm.confirmPassWord = ''
      this.userForm.role = []
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
          const role = []
          for (const item of this.userForm.role) {
            role.push({
              id: item
            })
          }
          const params = {
            listRole: role,
            sysUser: {
              // id: this.currentId,
              name: this.userForm.name.trim(),
              username: this.userForm.userName.trim().toLocaleLowerCase(),
              password: this.userForm.passWord.trim()
            }
          }
          console.log(params)
          saveUserDetail(params).then(res => {
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
          const role = []
          for (const item of this.userForm.role) {
            role.push({
              id: item
            })
          }
          const params = {
            listRole: role,
            sysUser: {
              id: this.currentId,
              username: this.userForm.userName.trim().toLocaleLowerCase(),
              name: this.userForm.name.trim()
            }
          }
          console.log(params)
          saveUserDetail(params).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '编辑成功!'
              })
              this.editDialogVisible = false
              this.$refs[formName].resetFields()
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
      this.updatePwdDialogVisible = false
      this.addDialogVisible = false
      this.configDialogVisible = false
      this.$refs[formName].resetFields()
    },
    // 编辑
    handleEdit(row) {
      this.userForm.role = []
      this.currentId = row.id
      this.userForm.name = row.name
      this.userForm.userName = row.username
      this.editDialogVisible = true
      configInfo(row.id).then(res => {
        if (res.code === 0) {
          console.log(res.data)
          for (const item of res.data.listRole) {
            this.userForm.role.push(item.id)
          }
        }
      })
    },
    // 删除
    handleDelete(row) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
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
    // 重置密码
    handleUpdatePwd(row) {
      console.log(row)
      this.currentId = row.id
      this.$confirm(`确认将用户名为 “${row.username}” 的密码重置为 888888 ？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        restPassWord({ id: row.id }).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '重置成功!'
            })
            this.fetchData()
          }
        })
      }).catch(() => {
      })
    },
    // 配置
    handleConfig(row) {
      this.configForm.post = []
      this.configForm.role = []
      this.checkedKeys = []
      this.currentId = row.id
      this.username = row.username
      this.configDialogVisible = true
      configInfo(row.id).then(res => {
        if (res.code === 0) {
          const post = []
          const role = []
          const dept = []
          for (const item of res.data.listStation) {
            post.push(item.id)
          }
          for (const item of res.data.listRole) {
            role.push(item.id)
          }
          for (const item of res.data.listDepartment) {
            dept.push(item.id)
          }
          this.configForm.post = post
          this.configForm.role = role
          this.$refs.tree.setCheckedKeys(dept)
        }
      })
    }
  }
}

