<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="editVisible"
    class="padding-dialog"
    title="编辑"
    width="1200px"
    @close="handleClose">
    <el-row :gutter="15">
      <el-col :span="8">
        <div class="module-container">
          <div class="module-title" style="border-bottom: none">
            <div class="module-title-text">选择字段</div>
          </div>
          <div class="module-content">
            <div>
              <div class="table-title-box">
                <span class="table-title" style="border-right: 1px solid #e2e2e2; font-weight: bold;width: 70%;">字段名称</span>
                <span class="table-title" style="font-weight: bold;width: 28%">类型</span>
              </div>
              <div style="height: 446px;border: 1px solid #aad7d7;border-top: none; overflow: auto">
                <draggable v-model="list1" :options="draggableOptions" @start="list1Start">
                  <div v-for="item in list1" :type="item.name" :key="item.name" style="border-bottom: 1px solid #aad7d7">
                    <span class="table-title" style="border-right: 1px solid #aad7d7;width: 70%;">{{ item.name }}</span>
                    <span class="table-title" style="width: 28% ">{{ item.type }}</span>
                  </div>
                </draggable>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="module-title">
          <div class="module-title-text">分组字段</div>
        </div>
        <div class="module-content right-module">
          <draggable v-model="list2" :options="draggableOptions2" class="list-group" @add="add">
            <div v-for="(item, index) in list2" :key="item.name" :class="{'active-item': activeIndex === index}" class="filed-item" @click="fieldItemClick(index, item)">
              {{ item.name }}
              <i class="el-icon-close close-icon" style="float: right;margin-top: 8px;margin-right: 8px;" @click="deleteList2Item(index, item)"/>
              <span style="float: right;margin-right: 20px">( {{ item.type }} ) 类型</span>
            </div>
          </draggable>
        </div>
        <div class="module-content bottom-module-content">
          <div v-if="list2.length > 0" class="input-item" style="margin-bottom: 10px">
            <span class="input-title">组别列名 </span>
            <el-input v-model="currentFiled.targetCol" class="search-input" size="mini" maxlength="20" clearable/>
            <!--<el-radio-group v-if="filedType === 'INTEGER'" v-model="radio2" style="margin-left: 15px">-->
            <!--<el-radio label="1">左开右闭</el-radio>-->
            <!--<el-radio label="2">左闭右开</el-radio>-->
            <!--</el-radio-group>-->
          </div>
          <!--<el-form v-if="filedType === 'INTEGER'" ref="tableForm" :validate-on-rule-change="false" :model="tableForm" :rules="tableRules" size="mini" status-icon label-width="0px" label-position="right">-->
          <!--</el-form>-->
          <el-table
            v-if="false"
            :data="tableForm.list"
            height="245"
            border
            fit>
            <el-table-column label="组号" align="center" width="60">
              <template slot-scope="scope">
                组{{ scope.$index+1 }}
              </template>
            </el-table-column>
            <el-table-column label="组别名称" align="center" width="120">
              <template slot-scope="scope">
                <el-form-item
                  :prop="`list.${scope.$index}.name`"
                  :rules="tableRules.name"
                >
                  <el-input v-model="scope.row.name" style="width: 200%;" size="mini" maxlength="10" clearable/>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="范围" align="center" class="min-max" prop="taskCode">
              <template slot-scope="scope">
                <el-form-item
                  :prop="`list.${scope.$index}.min`"
                  :rules="tableRules.minVal"
                >
                  <el-input v-model="scope.row.min" style="width: 90%;" size="mini" maxlength="10" clearable/> ~
                </el-form-item>
                <el-form-item
                  :prop="`list.${scope.$index}.max`"
                  :rules="tableRules.minVal"
                >
                  <el-input v-model="scope.row.max" style="width: 90%;" size="mini" maxlength="10" clearable/>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="70">
              <template slot-scope="scope">
                <el-button
                  v-if="scope.$index === list.length - 1"
                  size="mini"
                  icon="el-icon-plus"
                  circle
                  type="primary"
                  @click="handleAdd"/>
                <el-button
                  v-if="list.length > 1"
                  size="mini"
                  type="danger"
                  circle
                  icon="el-icon-delete"
                  @click="handleDelete(scope.$index)"/>
              </template>
            </el-table-column>
          </el-table>
          <el-table
            v-if="list2.length > 0"
            :data="currentFiled.conditions"
            :key="tableKey"
            height="245"
            border
            fit>
            <el-table-column label="组号" align="center" width="60">
              <template slot-scope="scope">
                组{{ scope.$index+1 }}
              </template>
            </el-table-column>
            <el-table-column label="组别名称" align="center" width="120">
              <template slot-scope="scope">
                <el-input v-model="scope.row.value" style="width: 95%;" size="mini" maxlength="10" clearable/>
              </template>
            </el-table-column>
            <el-table-column label="分组表达式" align="center" prop="taskCode">
              <template slot-scope="scope">
                <el-input v-model="scope.row.expression" style="width: 95%;" size="mini" maxlength="200" clearable/>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="70">
              <template slot-scope="scope">
                <el-button
                  v-if="scope.$index === currentFiled.conditions.length - 1"
                  size="mini"
                  icon="el-icon-plus"
                  circle
                  type="primary"
                  @click="handleAdd"/>
                <el-button
                  v-if="currentFiled.conditions.length > 1"
                  size="mini"
                  type="danger"
                  circle
                  icon="el-icon-delete"
                  @click="handleDelete(scope.$index, scope.row)"/>
              </template>
            </el-table-column>
          </el-table>
          <div v-if="false" style="margin-top: 10px">
            <el-radio v-model="radio" label="1">不在类别总督字段分组为</el-radio>
            <el-input v-model="dataName" class="search-input" size="mini" maxlength="20" clearable/>
            <el-radio v-model="radio" label="2">不在类别中的字段保留原始值</el-radio>
          </div>
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
import draggable from 'vuedraggable'
import { flowInput } from '@/api/enterpriseDataCenter/dataSource'
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
    // 表头参数验证最小值
    const validateColMin = (rule, value, cb) => {
      const minVal = this.tableColForm.tableHeader[rule.field.split('.')[1]].min
      const maxVal = this.tableColForm.tableHeader[rule.field.split('.')[1]].max
      if (minVal === '') {
        cb(new Error('请输入'))
      } else if (maxVal !== '') {
        if (+maxVal < +minVal) {
          cb(new Error('不能大于最大参数'))
        } else {
          this.tableColForm.tableHeader.map((item, index) => {
            if (+index !== +rule.field.split('.')[1]) {
              if (item.min !== '' && item.max !== '') {
                if (+item.min <= +minVal && +item.max > +minVal) {
                  cb(new Error('与已有参数冲突'))
                }
              }
            }
          })
          cb()
        }
      } else {
        cb()
      }
    }
    // 表头参数验证最大值
    const validateColMax = (rule, value, cb) => {
      const minVal = this.tableColForm.tableHeader[rule.field.split('.')[1]].min
      const maxVal = this.tableColForm.tableHeader[rule.field.split('.')[1]].max
      if (maxVal === '') {
        cb(new Error('请输入'))
      } else if (minVal !== '') {
        // 如果存在最小值,判断最小值不能大于最大值
        if (+minVal > +maxVal) {
          cb(new Error('不能小于最小参数'))
        } else {
          this.tableColForm.tableHeader.map((item, index) => {
            if (+index !== +rule.field.split('.')[1]) {
              if (item.min !== '' && item.max !== '') {
                if (+item.min < +maxVal && +item.max > +maxVal) {
                  cb(new Error('与已有参数冲突'))
                }
                if (+item.min >= +minVal && +item.max <= +maxVal) {
                  cb(new Error('与已有参数冲突'))
                }
              }
            }
          })
          cb()
        }
      } else {
        cb()
      }
    }
    return {
      dataName: '',
      currentFiled: {
        targetCol: '',
        conditions: []
      },
      loading: '',
      startType: '',
      radio: '1',
      radio2: '1',
      activeIndex: -1,
      filedType: 0,
      tableKey: 0,
      tableRules: {
        minVal: [{ required: true, validator: validateColMin, trigger: 'blur' }],
        maxVal: [{ required: true, validator: validateColMax, trigger: 'blur' }],
        name: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      tableForm: {
        list: [
          {}
        ]
      },
      typeList: [
        { id: 1, name: '合计' },
        { id: 2, name: '最大值' },
        { id: 3, name: '最小值' },
        { id: 4, name: '均值' },
        { id: 5, name: '总体标准差' },
        { id: 6, name: '总体方差' }
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
        sort: false
      },
      draggableOptions3: {
        group: {
          name: 'description',
          pull: false
        }
      },
      editVisible: false,
      filterText: '',
      list: [{}],
      list3: [
        { name: '检验报废2', type: '数值型', id: 9 }
      ],
      list1: [],
      list2: [],
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
    }
  },
  methods: {
    list1Start(e) {
      this.startType = e.item.attributes.type.nodeValue
    },
    add(evt, e) {
      this.list2.map((item, index) => {
        if (item.name === this.startType) {
          this.currentFiled = item
          this.activeIndex = index
        }
      })
    },
    nodeInitFun() {
      const obj = {
        dag: this.data
      }
      console.log(this.data)
      this.loading = true
      this.list2 = this.node.config.withconditions
      const params = {
        id: this.node.id,
        flowId: this.$route.query.id,
        flow: JSON.stringify(obj)
      }
      flowInput(params).then(res => {
        res[0].fields.map(item => {
          item['targetCol'] = ''
          item['conditions'] = [{ value: '', expression: '' }]
        })
        if (this.list2.length > 0) {
          const listNames = []
          this.list2.map(item => {
            listNames.push(item.name)
          })
          this.list1 = res[0].fields.filter(function(item) {
            return listNames.indexOf(item.name) < 0
          })
          setTimeout(() => {
            this.fieldItemClick(0, this.list2[0])
            this.tableKey++
          }, 100)
        } else {
          this.list1 = res[0].fields
        }
        // this.list1 = res[0].fields
        this.loading = false
      })
    },
    fieldItemClick(index, item) {
      this.activeIndex = index
      this.filedType = item.type
      this.currentFiled = item
    },
    handleAdd() {
      this.currentFiled.conditions.push({
        value: '',
        expression: ''
      })
    },
    handleDelete(index, row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(row)
        this.currentFiled.conditions.splice(index, 1)
      })
    },
    deleteList2Item(index, item) {
      this.list2.splice(index, 1)
      if (this.list2.length > 0) {
        this.activeIndex = 0
        this.currentFiled = this.list2[0]
        setTimeout(() => {
          this.fieldItemClick(0, this.list2[0])
          this.tableKey++
        }, 100)
      }
      item.targetCol = ''
      item.conditions = [{ value: '', expression: '' }]
      this.list1.push(item)
    },
    deleteList3Item(index, item) {
      this.list3.splice(index, 1)
      item.value = ''
      this.list1.push(item)
    },
    submitForm() {
      const withconditions = []
      let flag = false
      let condFlag = false
      let filedName = ''
      this.list2.map(item => {
        if (item.targetCol === '') {
          flag = true
          filedName = item.name
        }
        item.conditions.map(cond => {
          if (cond.expression === '' || cond.value === '') {
            condFlag = true
            filedName = item.name
          }
        })
        withconditions.push({
          withCol: item.name,
          name: item.name,
          type: item.type,
          targetCol: item.targetCol,
          conditions: item.conditions
        })
      })
      if (flag) {
        this.$message.error(filedName + ' 字段组别列名不能为空!')
        return
      }
      if (condFlag) {
        this.$message.error(filedName + ' 字段分组信息能为空!')
        return
      }
      const config = {
        withconditions
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
  .right-module{
    height: 180px;
    border: 1px solid #e2e2e2;
    border-top: none;
    overflow: auto;
    padding: 5px;
    padding-right: 0px;
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
    height: 165px;
    box-sizing: border-box;
  }
  .filed-item{
    border: 1px solid #aad7d7;
    margin: 5px;
    line-height: 28px;
    padding-left: 15px;
    float: left;
    width: 371px;
  }
  .bottom-module-content{
    height: 303px;
    padding: 10px;
    border: 1px solid #e2e2e2;
    border-top: none;
  }
  .search-input{
    width: 150px;
  }
  .padding-dialog>>> .el-form-item--mini.el-form-item{
    width: 50%;
    margin-bottom: 0;
    float: left;
  }
  .active-item{
    background: #8bcec7;
    color: #fff;
  }
</style>
