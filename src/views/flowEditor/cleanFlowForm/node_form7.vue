<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="editVisible"
    class="padding-dialog"
    title="编辑"
    width="1200px"
    @close="handleClose">
    <el-row :gutter="15">
      <el-col :span="6">
        <div class="input-item" style="margin-bottom: 10px">
          <span class="input-title">新列名 </span>
          <el-input v-model="targetCol" class="search-input" size="mini" maxlength="20" clearable/>
          <el-button type="primary" size="mini" icon="el-icon-plus" @click="handleAdd">新增</el-button>
        </div>
        <el-table
          ref="fieldTable"
          :data="targetColList"
          height="540"
          border
          highlight-current-row
          fit
          @row-click="rowClick"
        >
          <el-table-column label="新列名" align="center" prop="targetCol"/>
          <el-table-column label="操作" align="center" width="75">
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
      </el-col>
      <el-col :span="18">
        <div style="height: 180px;margin-bottom: 10px">
          <json-editor ref="jsonEditor" v-model="expression" mode="javascript" type="1" @codeChange="textareaChange"/>
        </div>
        <!--<textarea id="textarea" :disabled="targetColList.length === 0" :rows="8" v-model="expression" type="textarea" style="margin-bottom: 10px" @input="textareaChange"/>-->
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-search"
          @click="handleSearch" >检查</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="clearAll"
        >
          <svg-icon icon-class="clear"/>
          清空</el-button>
        <el-row :gutter="10" style="margin-top: 10px">
          <el-col :span="8">
            <div class="module-container">
              <div class="module-title">
                <div class="module-title-text">字段列表</div>
              </div>
              <div class="module-content" style="padding: 0;border: 1px solid #e2e2e2">
                <div style="padding: 5px;padding-bottom: 0">
                  <el-input
                    v-model="filterNodeText"
                    size="small"
                    placeholder="搜索字段名"/>
                </div>
                <div style="height: 270px;overflow: auto">
                  <div v-for="(item, index) in fieldList" :key="item.name" :class="{'field-active':item.active}" class="field-item" @click="clickItem(item, index)">
                    {{ item.name }}
                  </div>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="module-container">
              <div class="module-title">
                <div class="module-title-text">函数</div>
              </div>
              <div class="module-content" style="padding: 5px;border: 1px solid #e2e2e2">
                <el-select v-model="fun" size="small" placeholder="请选择" style="width: 100%;margin-bottom: 5px" @change="selectChange">
                  <el-option
                    v-for="item in funList"
                    :key="item"
                    :label="item"
                    :value="item"/>
                </el-select>
                <el-input
                  v-model="filterText"
                  size="small"
                  placeholder="输入关键字进行过滤"/>
                <div v-loading="treeLoading" element-loading-text="拼命加载中" style="height: 250px;overflow: auto;margin-top: 5px">
                  <el-tree
                    ref="tree"
                    :data="treeData"
                    :props="defaultProps"
                    :filter-node-method="filterNode"
                    class="filter-tree"
                    default-expand-all
                    @node-click="nodeClick"
                  />
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="module-container">
              <div class="module-title">
                <div class="module-title-text">函数说明</div>
              </div>
              <div class="module-content" style="padding: 10px;border: 1px solid #e2e2e2">
                {{ description }}
              </div>
            </div>
          </el-col>
        </el-row>
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
import draggable from 'vuedraggable'
import JsonEditor from '@/components/JsonEditor'
import { flowInput, queryFunList } from '@/api/enterpriseDataCenter/dataSource'
export default {
  components: {
    draggable,
    JsonEditor
  },
  props: {
    editDialogVisible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      fun: '',
      description: '',
      funList: [],
      treeData: [],
      filterText: '',
      targetCol: '',
      expression: '',
      currentRow: {},
      filedType: 0,
      tableKey: 0,
      treeLoading: false,
      editVisible: false,
      targetColList: [],
      funData: [],
      fieldList: [],
      deepFieldList: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      node: {},
      filterNodeText: '',
      data: {}
    }
  },
  watch: {
    editDialogVisible(val) {
      this.editVisible = this.editDialogVisible
      if (this.editVisible) {
        setTimeout(() => {
          this.nodeInitFun()
          this.queryFunListFun()
        }, 100)
      }
    },
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    filterNodeText(val) {
      this.filterField(val)
    }
  },
  methods: {
    clickItem(data, index) {
      // this.fieldList.map(item => {
      //   item['active'] = false
      // })
      // data['active'] = true
      // this.expression += data.name
      // this.insertInputTxt('textarea', data.name)
    },
    queryFunListFun() {
      queryFunList().then(res => {
        this.funData = cloneDeep(res.data)
        const arr = []
        res.data.map(item => {
          if (!arr.includes(item.type)) {
            arr.push(item.type)
          }
        })
        this.funList = arr
      })
    },
    selectChange(data) {
      this.treeData = this.funData.filter(item => {
        return item.type === data
      })
    },
    nodeClick(data) {
      // this.description = data.description
      // if (data.children === undefined) {
      //   this.expression += data.name
      // }
    },
    insertInputTxt(id, insertTxt) {
      var elInput = document.getElementById(id)
      var startPos = elInput.selectionStart
      var endPos = elInput.selectionEnd
      if (startPos === undefined || endPos === undefined) return
      var txt = elInput.value
      var result = txt.substring(0, startPos) + insertTxt + txt.substring(endPos)
      elInput.value = result
      elInput.focus()
      console.log(result)
      elInput.selectionStart = startPos + insertTxt.length
      elInput.selectionEnd = startPos + insertTxt.length
      console.log(this.expression)
      this.expression = result
      this.currentRow.expression = result
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    filterField(value) {
      if (!value) {
        this.fieldList = this.deepFieldList
      } else {
        this.fieldList = this.fieldList.filter(item => item.name.indexOf(value) !== -1)
      }
    },
    rowClick(row) {
      this.currentRow = row
      this.expression = row.expression
    },
    textareaChange() {
      console.log(1)
      console.log(this.expression)
      this.currentRow.expression = this.expression
    },
    nodeInitFun() {
      this.targetColList = this.node.config.withconditions
      // this.expression = this.targetColList.length > 0 ? this.targetColList[0].expression : ''
      if (this.targetColList.length > 0) {
        this.rowClick(this.targetColList[0])
      }
      setTimeout(() => {
        this.$refs.fieldTable.setCurrentRow(this.targetColList[0])
      }, 200)
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
        res[0].fields.map(item => {
          item['active'] = false
        })
        this.fieldList = res[0].fields
        this.deepFieldList = cloneDeep(res[0].fields)
        this.loading = false
      })
    },
    handleAdd() {
      const has = this.targetColList.find(item => item.targetCol === this.targetCol)
      if (has) {
        this.$message.error('新增列名不能重复!')
        return false
      }
      if (this.targetCol.trim() === '') {
        this.$message.error('新增列名不能为空!')
        return false
      }
      this.targetColList.push({
        targetCol: this.targetCol,
        expression: ''
      })
      this.targetCol = ''
      setTimeout(() => {
        this.$refs.fieldTable.setCurrentRow(this.targetColList[this.targetColList.length - 1])
      }, 200)
      this.expression = this.targetColList[this.targetColList.length - 1].expression
      this.currentRow = this.targetColList[this.targetColList.length - 1]
    },
    handleSearch() {

    },
    clearAll() {
      this.expression = ''
    },
    handleDelete(index, row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(row)
        this.targetColList.splice(index, 1)
      })
    },
    submitForm() {
      const withconditions = []
      let flag = false
      let filedName = ''
      this.targetColList.map(item => {
        if (item.expression === '') {
          flag = true
          filedName = item.targetCol
        }
        withconditions.push({
          targetCol: item.targetCol,
          expression: item.expression
        })
      })
      if (flag) {
        this.$message.error(filedName + ' 字段配置不能为空!')
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
    }
  }
}
</script>

<style scoped>
  .module-title {
    border: 1px solid #e2e2e2;
    border-bottom: none;
    padding: 4px 15px;
    height: 36px;
  }
  .module-content{
    padding: 0;
    height: 315px;
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
    width: 271px;
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
  .padding-dialog>>> .el-tree-node__content{
    height: 28px;
    line-height: 28px;
    border: 1px solid #9dc5ca;
    padding-left: 10px;
    background: rgb(240, 249, 249);
    margin-bottom: 5px;
  }
  .padding-dialog>>> .el-tree-node__content:hover{
    background: rgb(207, 241, 249);
    border: 1px solid #89caca;
  }
  .padding-dialog>>> .el-tree-node:focus>.el-tree-node__content{
    /*background: #89caca;*/
  }
  .padding-dialog>>> .el-table__body tr.current-row>td {
    background-color: #bee8e9;
  }
  .active-item{
    background: #b8eaeb;
    color: #fff;
  }
  #textarea{
    width: 100%;
    border-color: #e2e2e2;
    outline: none;
    padding: 8px;
  }
  #textarea:focus{
    border-color: #009494;
  }
  #textarea:disabled{
    background: #f1f1f1;
  }
</style>
