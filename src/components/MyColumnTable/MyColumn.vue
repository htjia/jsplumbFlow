<template>
  <el-table-column :prop="col.prop" :fixed="col.fixed" :label="col.label" align="center">
    <template v-if="col.children">
      <my-column v-for="(item, index) in col.children" :key="index" :col="item"/>
    </template>
  </el-table-column>
</template>

<script>
export default {
  name: 'MyColumn',
  props: {
    col: {
      type: Object,
      default: null
    }
  }
}
</script>
<style scoped>
</style>
