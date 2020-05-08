<template>
  <div class="my-table">
    <el-table
      :data="data"
      :summary-method="summaryMethod"
      border
      fit
      stripe
      highlight-current-row
      show-summary
    >
      <my-column v-for="(item,index) in col" :key="index" :col="item" />
    </el-table>
  </div>
</template>

<script>
import MyColumn from './MyColumn'
export default {
  components: {
    MyColumn
  },
  props: {
    col: {
      type: Array,
      default: null
    },
    summaryMethod: {
      type: Function,
      default: null
    },
    data: {
      type: Array,
      default: null
    }
  }
}
</script>
<style scoped>
</style>
