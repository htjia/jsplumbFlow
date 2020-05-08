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
        <!--:on-exceed="onExceed"  文件个数超出限制钩子函数-->
        <!--:action="fileUrl"-->
        <!--:data="firstSampleParams"-->
        <el-upload
          ref="upload"
          :file-list="fileList"
          :auto-upload="true"
          :limit="3"
          :on-change="uploadChange"
          :on-success="onSuccess"
          :with-credentials="false"
          :before-upload="beforeUpload"
          :data="uploadParams"
          :action="fileUrl"
          class="upload-demo"
        >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <!--<el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>-->
          <!--<span slot="tip" class="el-upload__tip" style="margin-left: 15px;">只能上传 dll 文件，且只能上传一份</span>-->
        </el-upload>
        <div class="module-container" style="margin-top: 10px">
          <div class="module-title">
            <div class="module-title-text">选择文件</div>
          </div>
          <div v-loading="loading" element-loading-text="拼命加载中" class="module-content" style="padding: 5px; height: 455px;">
            <draggable v-model="list1" :options="draggableOptions" @start="list1Start">
              <div v-for="(item, index) in list1" :key="item.name" :type="item.name" class="field-item" @click="clickItem(item, index)">
                {{ item.name }}
                <i style="float: right;margin-top: 7px;margin-right: 5px;cursor: pointer;" class="el-icon-close" @click.stop="delectItemFile(item.id)"/>
              </div>
            </draggable>
          </div>
        </div>
      </el-col>
      <el-col :span="16" class="right">
        <div class="module-title">
          <div class="module-title-text">分组字段</div>
        </div>
        <div class="module-content right-module">
          <draggable v-model="list2" :options="draggableOptions2" style="height: 165px;" @add="add">
            <div v-for="(item, index) in list2" :key="item.name" :class="{'active-item': activeIndex === index}" class="filed-item" @click="fillItemClick(index, item)">
              {{ item.name }}
              <i class="el-icon-close close-icon" style="float: right;margin-top: 8px;margin-right: 8px;" @click="deleteList2Item(index, item)"/>
              <span style="float: right;margin-right: 20px">( {{ item.type }} ) 类型</span>
            </div>
          </draggable>
        </div>
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
import { flowInput, findFillByDataId, deleteFile } from '@/api/enterpriseDataCenter/dataSource'
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
      activeIndex: -1,
      currentFill: '',
      startType: '',
      list2: [],
      fileList: [],
      sortTypeList: [{ name: '升序', id: 'ASC' }, { name: '降序', id: 'DESC' }],
      node: {},
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
      list1: [],
      data: {},
      dataId: '',
      fileUrl: process.env.BASE_API + '/dataflow/upload',
      uploadParams: { }
    }
  },
  watch: {
    editDialogVisible(val) {
      this.editVisible = this.editDialogVisible
      if (this.editVisible) {
        setTimeout(() => {
          // this.nodeInitFun()
        }, 100)
      }
    }
  },
  methods: {
    list1Start(e) {
      this.startType = e.item.attributes.type.nodeValue
    },
    // 根据id查询所有上传文件
    findFillByDataIdFun(dataId) {
      findFillByDataId({ dataId }).then(res => {
        this.list1 = res.data
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
    fillItemClick(index, item) {
      this.activeIndex = index
      this.currentFill = item
    },
    delectItemFile(id, index) {
      deleteFile({ id }).then(res => {
        this.list1.splice(index, 1)
        if (this.list1.length === 0) {
          this.uploadParams = {}
        }
      })
    },
    uploadChange(file, fileList) {
    },
    onSuccess(res, file, fileList) {
      // this.fileName = file.name
      this.dataId = res.data.dataId
      this.uploadParams['dataId'] = res.data.dataId
      this.findFillByDataIdFun(res.data.dataId)
    },
    onExceed() {
      this.$message({
        type: 'error',
        message: '超出文件上传数量!'
      })
    },
    beforeUpload(file) {
      const isLt50M = file.size / 1024 / 1024 < 50
      if (!isLt50M) {
        this.$message({
          type: 'error',
          message: '上传文件大小不能超过 50MB!'
        })
      }
      return isLt50M
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
      this.loading = true
      this.list2 = this.node.config.conditions
      const params = {
        id: this.node.id,
        flowId: this.$route.query.id,
        flow: JSON.stringify(obj)
      }
      flowInput(params).then(res => {
        res[0].fields.map(item => {
          item['direction'] = ''
        })
        if (this.list2.length > 0) {
          const listNames = []
          this.list2.map(item => {
            listNames.push(item.name)
          })
          this.list1 = res[0].fields.filter(function(item) {
            return listNames.indexOf(item.name) < 0
          })
        } else {
          this.list1 = res[0].fields
        }
        this.loading = false
      })
    },
    clickItem(item, index) {
      this.list1.splice(index, 1)
      this.list2.unshift(item)
    },
    handleDelete(index, item) {
      this.list2.splice(index, 1)
      item.direction = ''
      this.list1.push(item)
    },
    submitForm() {
      let flag = false
      this.list2.map(item => {
        if (item.direction === '') {
          flag = true
        }
      })
      if (flag) {
        this.$message.error('请选择排序方式！')
        return false
      }
      const config = {
        conditions: this.list
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
  .padding-dialog>>> .el-upload-list{
    display: none;
  }
  .right-module{
    height: 180px;
    border: 1px solid #e2e2e2;
    border-top: none;
    overflow: auto;
    padding: 5px;
    padding-right: 0px;
  }
  .filed-item{
    border: 1px solid #aad7d7;
    margin: 5px;
    line-height: 28px;
    padding-left: 15px;
    float: left;
    width: 271px;
  }
  .active-item{
    background: #8bcec7;
    color: #fff;
  }
</style>
