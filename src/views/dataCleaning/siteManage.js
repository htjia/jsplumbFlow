
import PageHeaderLayout from '@/components/PageHeaderLayout'
import HeaderSearchAdd from '@/components/HeaderSearchAdd'
import VueGridLayout from 'vue-grid-layout'
export default {
  components: { PageHeaderLayout, HeaderSearchAdd, VueGridLayout },
  data() {
    return {
      listLoading: false,
      addDialogVisible: false,
      editDialogVisible: false,
      infoDialogVisible: false,
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
        taskCode: this.dataname === '' ? null : this.dataname,
        type: this.type === '' ? null : this.type
      }
      console.log(params)
      // InProductTaskList(params).then(res => {
      //   this.list = res.data.list
      //   this.totalPage = parseInt(res.data.total)
      //   this.listLoading = false
      // })
    },
    deleteItem(row) {
      this.$confirm('确定删除该数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(123)
      })
    },
    handleEdit(row) {
      this.editDialogVisible = true
    },
    handleAdd() {
      this.addDialogVisible = true
    },
    findInfo() {
      this.infoDialogVisible = true
    }
  }
}

