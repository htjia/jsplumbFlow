<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="editVisible"
    class="padding-dialog"
    title="编辑"
    width="800px"
    @close="handleClose">
    <el-row :gutter="15">
      <el-col :span="8">
        <div class="module-container">
          <div class="module-title">
            <div class="module-title-text">选择字段</div>
          </div>
          <div v-loading="loading" element-loading-text="拼命加载中" class="module-content" style="padding: 5px; height: 455px;">
            <draggable v-model="list1" :options="draggableOptions">
              <div v-for="(item, index) in list1" :key="item.name" class="field-item" @click="clickItem(item, index)">
                {{ item.name }}
              </div>
            </draggable>
          </div>
        </div>
      </el-col>
      <el-col :span="16" class="right">
        <draggable v-model="list" :options="draggableOptions2" class="list-group">
          <el-table
            :data="list"
            height="500"
            border
            fit>
            <el-table-column label="字段名" align="center" prop="name"/>
            <el-table-column label="类型" align="center" prop="type"/>
            <el-table-column label="排序方式" align="center">
              <template slot-scope="scope">
                <el-select v-model="scope.row.direction" placeholder="请选择" size="mini" style="width: 95%" filterable>
                  <el-option
                    v-for="item in sortTypeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"/>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="60">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="danger"
                  circle
                  icon="el-icon-delete"
                  @click="handleDelete(scope.$index, scope.row)"/>
              </template>
            </el-table-column>
          </el-table>
        </draggable>

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
import draggable from 'vuedraggable'
export default {
  components: {
    draggable
  },
  props: {
    editDialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      editVisible: false,
      list: [],
      sortTypeList: [{ name: '升序', id: 'ASC' }, { name: '降序', id: 'DESC' }],
      node: {},
      draggableOptions: {
        group: 'description'
      },
      draggableOptions2: {
        group: {
          name: 'description',
          pull: false
        },
        sort: false
      },
      list1: [],
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
    nodeInitFun() {
      this.list = this.node.config.list
      this.list1 = this.node.config.list1
    },
    clickItem(item, index) {
      this.list1.splice(index, 1)
      this.list.unshift(item)
    },
    handleDelete(index, item) {
      this.list.splice(index, 1)
      item.direction = ''
      this.list1.push(item)
    },
    submitForm() {
      let flag = false
      this.list.map(item => {
        if (item.direction === '') {
          flag = true
        }
      })
      if (flag) {
        this.$message.error('请选择排序方式！')
        return false
      }
      const config = {
        list: this.list,
        list1: this.list1
      }
      this.data.nodeList.filter((node) => {
        if (node.id === this.node.id) {
          node.config = config
        }
      })
      console.log(this.data)
      this.$emit('dialogClose')
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
  .right>>> .sortable-ghost{
    display: none;
  }
  .module-container{
    height: 500px;
    border: 1px solid #e2e2e2
  }
  .field-item{
    height: 28px;
    line-height: 28px;
    border: 1px solid #9dc5ca;
    padding-left: 10px;
    margin: 5px;
    background: rgb(240, 249, 249);
  }
</style>
