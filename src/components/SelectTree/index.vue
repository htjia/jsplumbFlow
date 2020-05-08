<template>
  <el-popover
    ref="popover"
    popper-class="kt-select-tree__popover"
    placement="bottom-start"
    trigger="click"
  >
    <!-- 显示content -->
    <div>
      <el-input
        v-if="filterable"
        v-model="searchValue"
        class="kt-select-tree__input"
        placeholder="请输入关键字"
        size="mini"
      />
      <el-tree
        ref="tree"
        :style="{'min-width':treeWidth}"
        :data="treeData"
        :props="dynaDefProps"
        :node-key="dynaDefProps.id"
        :highlight-current="!multiple"
        :expand-on-click-node="false"
        :default-expanded-keys="defaultExpandedKeys"
        :show-checkbox="multiple"
        :default-expand-all="defaultExpandAll"
        :filter-node-method="onTreeFilter"
        class="kt-select-tree"
        check-on-click-node
        @node-click="onNodeClick"
        @check="onCheck"
      >
        <span slot-scope="{ node, data }" class="kt-select-tree_label">
          <slot :node="node" :data="data">{{ node.label }}</slot>
        </span>
      </el-tree>
    </div>
    <!-- 触发html -->
    <el-select
      ref="select"
      slot="reference"
      :style="{'width':width}"
      v-model="labelValue"
      :size="size"
      :multiple="multiple"
      :clearable="clearable"
      :collapse-tags="collapseTags"
      :placeholder="placeholder"
      popper-class="kt-select-tree__option"
      @change="onChange"
      @clear="onClear"
      @visible-change="clearTree"
    />
  </el-popover>
</template>

<script>
export default {
  name: 'KtSelectTree',
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    data: {
      type: Array,
      required: true
    },
    value: {
      type: String | Array,
      required: true
    },
    defaultExpandedKeys: {
      type: Array,
      required: true
    },
    width: {
      type: String,
      default: 'auto'
    },
    size: {
      type: String,
      default: 'small'
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    filterable: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    collapseTags: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 传参的值
      modelValue: void 0,
      // 展示框的值
      labelValue: void 0,
      // 搜索框的值
      searchValue: void 0,
      changeMessage: this.value,
      // 树节点宽度
      treeWidth: 'auto',
      // 扁平化数据
      options: []
    }
  },
  computed: {
    // 树节点配置选项
    dynaDefProps() {
      return this.returnCont1()
    },
    // value() {
    //   return this.returnCont()
    // },
    // 树节点数据
    treeData() {
      return this.returnCont()
    }
  },
  watch: {
    searchValue(val) {
      this.debounceQuery(val)
    },
    modelValue(val) {
      // ⭐⭐⭐ modelValue -> labelValue
      if (val && Array.isArray(this.options) && this.options.length > 0) {
        // 筛选数组的长度
        const length = this.options.filter(item => item.parentId === undefined).length
        if (this.multiple) this.labelValue = this.options.filter(node => val.includes(node[this.dynaDefProps.id])).map(node => node[this.dynaDefProps.label])
        else this.labelValue = this.options.filter(node => node[this.dynaDefProps.id] === val)[0][this.dynaDefProps.label]
        if (this.labelValue.length === length && this.labelValue.length !== 0) {
          this.labelValue = ['全部设备']
        }
      }
      // ⭐⭐⭐ modelValue -> value
      this.$emit('input', val)
    },
    // ⭐⭐⭐ value -> labelValue
    value(val) {
      if (!val) this.labelValue = void 0
    }
  },
  methods: {
    returnCont1() {
      return Object.assign({}, {
        parentId: 'parentId',
        id: 'id',
        label: 'name',
        children: 'children',
        filter: 'filter'
      }, {})
    },
    // 下拉触发函数
    clearTree(flag) {
      if (flag === true && this.labelValue[0] === '全部设备') {
        this.$refs.tree.setCheckedKeys([])
      }
    },
    returnCont() {
      if (this.data.length > 0) {
        // 备份降维模型
        this.options = this.flattenTree(this.data)
        // ⭐⭐⭐ 初始化绑定节点 ⭐⭐⭐
        this.$nextTick(() => {
          // ⭐⭐⭐ value -> modelValue
          if (this.multiple) {
            if (Array.isArray(this.value) && this.value.length > 0) {
              // 绑定值
              if (this.value.length === 1 && this.value[0] === '全部设备') {
                const MyIndex = []
                this.options.map((item) => {
                  if (!item.hasOwnProperty('parentId')) {
                    MyIndex[MyIndex.length] = item.id
                  }
                })
                this.modelValue = MyIndex
              } else {
                this.modelValue = this.value
              }
              this.labelValue = this.options.filter(node => this.value.includes(node[this.dynaDefProps.id])).map(node => node[this.dynaDefProps.label])
              this.$refs.tree.setCheckedKeys(this.value)
              const length = this.options.filter(item => item.parentId === undefined).length
              if (this.labelValue.length !== 0 && length === this.labelValue.length) {
                this.labelValue = ['全部设备']
              }
            }
          } else {
            if (this.value) {
              this.labelValue = this.options.filter(node => node[this.dynaDefProps.id] === this.value).map(node => node[this.dynaDefProps.label])[0]
              this.$refs.tree.setCurrentKey(this.value)
              this.modelValue = this.value
            }
          }
        })
        // 初始化树模型
        return this.data
      } else {
        this.labelValue = []
      }
    },
    /* 点击节点 */
    onNodeClick(node, data) {
      if (!this.multiple) {
        // 绑定值
        this.modelValue = node[this.dynaDefProps.id]
        // 对外暴露绑定函数
        this.$emit('node-click', node, data)
        // 隐藏菜单
        this.onCloseTree()
      }
    },
    /* 点击节点复选框 */
    onCheck(node, data) {
      if (this.multiple) {
        const juniorNodes = data.checkedNodes.filter(node => !node[this.dynaDefProps.children])
        // 绑定值
        this.modelValue = juniorNodes.map(node => node[this.dynaDefProps.id])
        // 对外暴露绑定函数
        this.$emit('check', node, data)
      }
    },
    /* 节点过滤函数 */
    onTreeFilter(value, data) {
      if (!value) return true
      return data[this.dynaDefProps.filter] ? data[this.dynaDefProps.label].indexOf(value) !== -1 || data[this.dynaDefProps.filter].indexOf(value.toUpperCase()) !== -1 : data[this.dynaDefProps.label].indexOf(value) !== -1
    },
    /* 延迟过滤节点 */
    debounceQuery(val) {
      this.$refs.tree.filter(val)
    },
    /* popover菜单关闭 */
    onCloseTree() {
      this.$refs.popover.showPopper = false
    },
    /* 下拉选value变化 */
    onChange(val) {
      if (this.multiple) {
        this.modelValue = this.options.filter(node => val.includes(node[this.dynaDefProps.label])).map(node => node[this.dynaDefProps.id])
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(this.modelValue)
        })
      }
    },
    /* 单选模式下清空 */
    onClear() {
      this.modelValue = void 0
    },
    /* 数组降维 */
    flattenTree(arr = []) {
      const result = []
      const copy = [].concat(JSON.parse(JSON.stringify(arr))) // 深度拷贝数组
      const fun = (arr) => {
        arr.forEach(node => {
          result.push(node)
          if (this.isArray(node)) fun(node[this.dynaDefProps.children])
          delete node[this.dynaDefProps.children]
        })
      }
      fun(copy)
      return result
    },
    /* 判断数组 */
    isArray(data) {
      return data[this.dynaDefProps.children] && Array.isArray(data[this.dynaDefProps.children]) && data[this.dynaDefProps.children].length > 0
    }
  }
  // created() {
  //   // 获取输入框宽度同步至树状菜单宽度
  //   this.$nextTick(() => {
  //     this.treeWidth = `${(this.width || this.$refs.select.$refs.reference.$el.clientWidth) - 24}px`
  //   })
  // }
}
</script>
<style>
  /* 下拉选option */
.kt-select-tree__option {
    display: none;
    padding: 0 !important;
}
/* 弹出框 */
.kt-select-tree__popover{
    margin-top: 0 !important;
    padding: 5px 0;
}
/* 搜索框 */
.kt-select-tree__input{
    padding: 0 4px 4px !important;
}
/* tree树形控件 */
.kt-select-tree {
    overflow-y: scroll;
    max-height: 380px;
}
.kt-select-tree::-webkit-scrollbar {
    z-index: 11;
    width: 6px;
}
.kt-select-tree::-webkit-scrollbar-track,
.kt-select-tree::-webkit-scrollbar-corner {
    background: #fff;
}
.kt-select-tree::-webkit-scrollbar-thumb {
    width: 6px;
    border-radius: 5px;
    background: #b4bccc;
}
.kt-select-tree::-webkit-scrollbar-track-piece {
    width: 6px;
    background: #fff;
}
/* 覆盖默认高亮效果 */
.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
    background-color: #409eff !important;
    color: #fff;
}
.el-tree-node__content>.el-checkbox {
    margin-left: 8px !important;
}
.kt-select-tree__input{
  width:300px;
}
</style>
