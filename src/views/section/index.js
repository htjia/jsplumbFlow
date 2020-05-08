import PageHeaderLayout from '@/components/PageHeaderLayout'
let id = 1000
export default {
  components: { PageHeaderLayout },
  data() {
    const validateNodeName = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('请输入名称'))
      } else {
        if (value.length < 5) {
          callback(new Error('不能小于5位'))
        } else {
          callback()
        }
      }
    }
    return {
      dialogVisible: false,
      editDialogVisible: false,
      filterText: '',
      currentNode: {},
      data2: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1'
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      ruleForm: {
        nodeName: ''
      },
      rules: {
        nodeName: [{ required: true, validator: validateNodeName, trigger: 'blur' }]
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },

  methods: {
    // 搜索
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 添加按钮
    append(data) {
      console.log(data)
      this.dialogVisible = true
      this.currentNode = data
    },
    // 添加fun
    addNode(data, name) {
      const newChild = { id: id++, label: name, children: [] }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
    },
    // 删除
    remove(node, data) {
      console.log(data.id)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.data2 = [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1'
          }]
        }]
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      console.log(index)
      children.splice(index, 1)
      console.log(children)
      this.$set(data, 'children', children)
    },
    // 编辑
    edit(data) {
      console.log(data)
      this.currentNode = data
      this.editDialogVisible = true
      this.ruleForm.nodeName = data.label
    },
    // 查看详情
    viewDetail(data) {
      this.$router.push({ path: '/sectionDetail/index', query: { id: 12 }})
      console.log(data)
    },
    // 关闭
    handleClose(done) {
      done()
    },
    // 添加提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addNode(this.currentNode, this.ruleForm.nodeName)
          this.dialogVisible = false
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
          this.currentNode.label = this.ruleForm.nodeName
          this.editDialogVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 取消
    resetForm(formName) {
      this.dialogVisible = false
      this.editDialogVisible = false
      this.$refs[formName].resetFields()
    }
  }
}
