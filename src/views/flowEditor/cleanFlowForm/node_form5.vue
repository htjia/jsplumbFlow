<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="editVisible"
    class="padding-dialog"
    title="编辑"
    width="900px"
    @close="handleClose">
    <el-row :gutter="15">
      <el-col :span="13">
        <div class="module-container">
          <div class="module-title" style="border-bottom: none">
            <div class="module-title-text">选择字段</div>
          </div>
          <div class="module-content">
            <el-input
              v-model="filterText"
              size="small"
              placeholder="搜索字段名"/>
            <div>
              <div class="table-title-box">
                <span class="table-title" style="border-right: 1px solid #e2e2e2; font-weight: bold">字段名称</span>
                <span class="table-title" style="font-weight: bold">类型</span>
              </div>
              <div style="height: 414px;border: 1px solid #aad7d7;border-top: none;">
                <draggable v-model="list1" :options="draggableOptions" @start="list1Start" @end="list1End">
                  <div v-for="item in list1" :key="item.name" :type="item.type" style="border-bottom: 1px solid #aad7d7">
                    <span class="table-title" style="border-right: 1px solid #aad7d7">{{ item.name }}</span>
                    <span class="table-title">{{ item.type }}</span>
                  </div>
                </draggable>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="11">
        <div class="module-title">
          <div class="module-title-text">分组字段</div>
        </div>
        <div class="module-content right-module">
          <draggable v-model="list2" :options="draggableOptions2" class="list-group">
            <div v-for="(item, index) in list2" :key="item.name" style="border: 1px solid #aad7d7;margin: 5px;line-height: 28px;padding-left: 15px;">
              {{ item.name }}
              <i class="el-icon-close close-icon" style="float: right;margin-top: 8px;margin-right: 8px;" @click="deleteList2Item(index, item)"/>
              <!--<span style="float: right;margin-right: 20px">( {{ item.type }} ) 类型</span>-->
            </div>
          </draggable>
        </div>
        <div class="module-title" style="border-top: none">
          <div class="module-title-text">聚合字段</div>
        </div>
        <div class="module-content right-module">
          <draggable v-model="list3" :options="draggableOptions3" class="list-group">
            <div v-for="(item, index) in list3" :key="item.name" style="border: 1px solid #aad7d7;margin: 5px;line-height: 28px;padding-left: 15px;">
              {{ item.name }}
              <i class="el-icon-close close-icon" style="float: right;margin-top: 8px;margin-right: 8px;" @click="deleteList3Item(index, item)"/>
              <el-select v-model="item.agg" size="mini" style="width: 90px;float: right;margin-right: 8px" placeholder="请选择" clearable>
                <el-option
                  v-for="item in typeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </div>
          </draggable>
        </div>
      </el-col>
    </el-row>
    <div style="height: 50px;margin-top: 20px">
      <span slot="footer" style="float: right;">
        <el-button type="primary" @click="submitForm('dataForm')">确 定</el-button>
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
      typeList: [
        { id: 'count', name: '计数' },
        { id: 'sum', name: '求和' },
        { id: 'max', name: '最大值' },
        { id: 'min', name: '最小值' },
        { id: 'avg', name: '均值' }
      ],
      draggableOptions: {
        group: 'description',
        sort: false
      },
      draggableOptions2: {
        group: {
          name: 'description',
          pull: false
        },
        sort: false,
        disabled: false
      },
      draggableOptions3: {
        group: {
          name: 'description',
          pull: false
        },
        sort: false,
        disabled: false
      },
      editVisible: false,
      filterText: '',
      list: [],
      deepList: [],
      list3: [
      ],
      list1: [
      ],
      list2: [
      ],
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
        }, 100)
      }
    },
    filterText(val) {
      this.filterNode(val)
    }
  },
  methods: {
    list1Start(e) {
      const type = e.item.attributes.type.nodeValue
      console.log(type, 'type==============')
      if (type.toUpperCase() === 'INTEGER' || type.toUpperCase() === 'DOUBLE' || type.toUpperCase() === 'FLOAT' || type.toUpperCase() === 'LONG') {
        console.log('数字类型')
      } else {
        this.draggableOptions3.disabled = true
      }
    },
    list1End(e) {
      this.draggableOptions3.disabled = false
    },
    filterNode(value) {
      if (!value) {
        const listNames = []
        const rightList = [...this.list2, ...this.list3]
        rightList.map(item => {
          listNames.push(item.name)
        })
        this.list1 = this.deepList.filter(function(item) {
          return listNames.indexOf(item.name) < 0
        })
      } else {
        this.list1 = this.list1.filter(item => item.name.indexOf(value) !== -1)
      }
    },
    nodeInitFun() {
      if (this.node.config) {
        this.list2 = this.node.config.groupKeys
        this.list3 = this.node.config.aggFields
      } else {
        this.list2 = []
        this.list3 = []
      }
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
        const rightList = [...this.list2, ...this.list3]
        if (rightList.length > 0) {
          const rightListNames = []
          rightList.map(item => {
            rightListNames.push(item.name)
          })
          this.list1 = res[0].fields.filter(function(item) {
            return rightListNames.indexOf(item.name) < 0
          })
        } else {
          this.list1 = res[0].fields
        }
        this.deepList = cloneDeep(this.list1)
        this.loading = false
      })
    },
    deleteList2Item(index, item) {
      this.list2.splice(index, 1)
      this.list1.push(item)
      this.deepList = cloneDeep(this.list1)
    },
    deleteList3Item(index, item) {
      this.list3.splice(index, 1)
      item.value = ''
      this.list1.push(item)
      this.deepList = cloneDeep(this.list1)
    },
    submitForm() {
      const groupKeys = []
      const aggFields = []
      this.list2.map(item => {
        groupKeys.push({
          name: item.name,
          type: item.type
        })
      })
      this.list3.map(item => {
        aggFields.push({
          name: item.name,
          type: item.type,
          colName: item.name,
          agg: item.agg,
          alias: item.name
        })
      })
      const config = {
        groupKeys,
        aggFields
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
  .module-title{
    border: 1px solid #e2e2e2;
  }
  .module-content{
    padding: 0;
  }
  .module-content>>> .el-input__inner{
    border-radius: 0;
  }
  .right-module{
    height: 220px;
    border: 1px solid #e2e2e2;
    border-top: none;
    overflow: auto;
    padding: 5px;
  }
  .table-title-box{
    border: 1px solid #e2e2e2;
    border-top: none;
    background: #aad7d7;
    border-bottom: 2px solid #aad7d7;
  }
  .table-title{
    display: inline-block;
    width: 49%;
    height: 35px;
    line-height: 35px;
    text-align: center;
    box-sizing: border-box;
  }
  .close-icon:hover{
    color: #009494
  }
  .list-group{
    height: 200px;
  }
</style>
