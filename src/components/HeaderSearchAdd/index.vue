<template>
  <div class="header-search-add">
    <el-input v-model="searchkey" :placeholder="placeholderText" size="medium" class="searchInput" clearable>
      <template slot="append"><el-button type="primary" icon="el-icon-search" @click="handleSearch">搜 索</el-button></template>
    </el-input>
    <el-button
      v-if="hasAddBtn"
      size="medium"
      class="float-right-btn"
      type="primary"
      icon="el-icon-plus"
      @click="handleAdd">添 加</el-button>
  </div>
</template>

<script>
export default {
  name: 'HeaderSearchAdd',
  props: {
    placeholderText: {
      type: String,
      required: true
    },
    hasAddBtn: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      searchkey: ''
    }
  },
  methods: {
    handleSearch() {
      this.$emit('handleSearch', this.searchkey.trim())
    },
    handleAdd() {
      this.$emit('handleAdd')
    }
  }
}
</script>

<style scoped>
  .svg-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
</style>
