<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="流程数据信息"
    width="70%"
  >
    <!--一个高亮显示的插件-->
    <codemirror
      :value="flowJsonData"
      :options="options"
      class="code"
    />
  </el-dialog>
</template>

<script>
import { codemirror } from 'vue-codemirror'

// require("codemirror/mode/javascript/javascript.js")

export default {
  components: {
    codemirror
  },
  props: {
    data: Object
  },
  data() {
    return {
      dialogVisible: false,
      flowJsonData: {},
      options: {
        mode: { name: 'javascript', json: true },
        lineNumbers: true
      }
    }
  },
  methods: {
    init() {
      this.dialogVisible = true
      this.flowJsonData = JSON.stringify(this.data, null, 4).toString()
    }
  }
}
</script>
