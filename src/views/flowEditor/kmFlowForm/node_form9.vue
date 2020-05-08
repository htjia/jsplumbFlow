<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="editVisible"
    class="padding-dialog"
    title="编辑"
    width="800px"
    @close="handleClose">
    <div class="input-item">
      <span class="input-title">链接类型 </span>
      <el-select v-model="joinType" size="small" class="search-input" style="margin-bottom: 10px" placeholder="请选择">
        <el-option
          v-for="item in joinTypeList"
          :key="item.name"
          :label="item.name"
          :value="item.name"/>
      </el-select>
      <el-table
        :data="list"
        height="358"
        border
        fit>
        <el-table-column label="左表" align="center" prop="taskCode">
          <template slot-scope="scope">
            <el-select v-model="scope.row.left" size="mini" style="width: 95%;" placeholder="请选择">
              <el-option
                v-for="item in tableOneList"
                :key="item.name"
                :label="item.name"
                :value="item.name"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="连接符" align="center" prop="taskCode">
          <template slot-scope="scope">
            <el-select v-model="scope.row.operator" size="mini" style="width: 95%;" placeholder="请选择">
              <el-option
                v-for="item in operatorList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="右表" align="center" prop="taskCode">
          <template slot-scope="scope">
            <el-select v-model="scope.row.right" size="mini" style="width: 95%;" placeholder="请选择">
              <el-option
                v-for="item in tableTwoList"
                :key="item.name"
                :label="item.name"
                :value="item.name"/>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="scope.$index === list.length - 1"
              size="mini"
              icon="el-icon-plus"
              type="primary"
              @click="handleAdd">新增</el-button>
            <el-button
              v-if="list.length > 1"
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
import { queryTableFiled } from '@/api/enterpriseDataCenter/dataSource'
export default {
  props: {
    editDialogVisible: {
      type: Boolean,
      default: false
    },
    table: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      editVisible: false,
      tableTwoList: [],
      operatorList: [
        { id: 'eq', name: '=' }
      ],
      tableOneList: [],
      joinTypeList: [
        { name: 'left' },
        { name: 'right' },
        { name: 'inner' },
        { name: 'full' }
      ],
      list: [
        { left: '', right: '', operator: 'eq' }
      ],
      joinType: 'left',
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
          // this.queryTableFiledFun()
        }, 100)
      }
    }
  },
  methods: {
    // 获取表下的字段
    queryTableFiledFun() {
      const params = {
        table_name: 'mould_rank_set',
        datasource_id: '2e9ba392-22a8-449e-b266-443e7722c9c8'
      }
      queryTableFiled(params).then(res => {
        res.data.map(item => {
          // this.tableTwoList.push(
          //   { name: item.columnName, type: item.columnType, value: '自变量' },
          // )
          this.tableTwoList.push(
            { name: item.columnName, type: item.columnType, value: '自变量' },
          )
        })
      })
      // const arr = [
      //   { name: 'history_eqpt_date' },
      //   { name: 'eqpt_rank' }
      // ]
      // this.tableOneList = [...this.tableOneList, ...arr]
    },
    nodeInitFun() {
      this.joinType = this.node.config.joinType
      this.tableOneList = this.node.config.left
      this.tableTwoList = this.node.config.right
      this.list = this.node.config.conditions
    },
    submitForm() {
      let flag = false
      const conditions = []
      this.list.map(item => {
        if (item.left === '' || item.right === '' || item.operator === '') {
          flag = true
        }
        conditions.push({
          left: item.left,
          right: item.right,
          operator: item.operator
        })
      })
      if (flag) {
        this.$message.error('请完善关联消息！')
        return false
      }
      console.log(conditions)
      this.data.nodeList.filter((node) => {
        if (node.id === this.node.id) {
          node.config.conditions = conditions
          node.config.joinType = this.joinType
          node.config.left = this.tableOneList
          node.config.right = this.tableTwoList
        }
      })
      this.$emit('dialogClose')
    },
    handleAdd() {
      this.list.push({ left: '', right: '', operator: 'eq' })
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

<style>
  .flow-node-form {
    background-color: #f7f9fb;
    /*margin-left: 5px;*/
  }

  .flow-node-form-header {
    height: 32px;
    border-top: 1px solid #dce3e8;
    border-bottom: 1px solid #dce3e8;
    background: #ebeef2;
    color: #000;
    line-height: 32px;
    padding-left: 12px;
    font-size: 14px;
  }

  .flow-node-form-body {
    margin-top: 10px;
    padding-right: 10px;
    padding-bottom: 20px;
  }
</style>
