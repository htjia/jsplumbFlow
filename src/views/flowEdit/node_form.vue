<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="visible"
    title="节点信息"
  >
    <el-form ref="dataForm" :model="node" label-width="80px">
      <el-form-item label="名称">
        <el-input v-model="node.name"/>
      </el-form-item>
      <el-form-item label="left坐标">
        <el-input v-model="node.left"/>
      </el-form-item>
      <el-form-item label="top坐标">
        <el-input v-model="node.top"/>
      </el-form-item>
      <el-form-item label="ico图标">
        <el-input v-model="node.ico"/>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button icon="el-icon-close" @click="visible = false">取消</el-button>
      <el-button type="primary" icon="el-icon-check" @click="visible = false">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      node: {}
    }
  },
  methods: {
    /**
             * 表单修改，这里可以根据传入的ID进行业务信息获取
             * @param data
             * @param id
             */
    init(data, id) {
      this.visible = true
      data.nodeList.filter((node) => {
        if (node.id === id) {
          this.node = node
        }
      })
    }
  }
}
</script>
