<template>
  <div
    ref="node"
    :style="nodeContainerStyle"
    class="flow-node-container"
    @mouseenter="mouseEnter=true"
    @mouseleave="mouseEnter=false"
    @click="clickNode"
    @mouseup="changeNodePosition"
  >
    <!--        <div class="flow-node-header">-->
    <!--            &lt;!&ndash;左上角的那个图标样式&ndash;&gt;-->
    <!--            <i :class="nodeIcoClass"></i>-->
    <!--            &lt;!&ndash;鼠标移入到节点中时右上角的【编辑】、【删除】 按钮&ndash;&gt;-->
    <!--            <div v-show="mouseEnter" class="flow-node-operate">-->
    <!--                <a href="#" @click="editNode"><img src="@/assets/edit.png"></a>&nbsp;-->
    <!--                <a href="#" @click="deleteNode"><img src="@/assets/delete.png"></a> &nbsp;-->
    <!--            </div>-->
    <!--        </div>-->
    <!--节点的正文部分-->
    <!--        <div class="flow-node-body">-->
    <!--            {{node.name}}-->
    <!--        </div>-->
    <div class="flow-node-left"/>

    <div class="flow-node-left-ico flow-node-drag">
      <!--<i :class="nodeIcoClass"/>-->
      <div class="flow-node-drag top-div"/>
      <i class="flow-node-drag">
        <svg-icon :icon-class="node.ico" class="flow-node-drag"/>
      </i>
    </div>

    <div :show-overflow-tooltip="true" class="flow-node-text">
      {{ node.name }}
    </div>
    <div v-if="node.name !== '表拼接'" class="flow-node-right-ico edit-icon" @click="editNode">
      <i style="font-size: 15px" class="el-icon-edit"/>
    </div>
    <!--v-if="mouseEnter"-->
    <div class="flow-node-right-ico" @click="deleteNode">
      <i class="el-icon-delete"/>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // eslint-disable-next-line vue/require-default-prop
    node: Object
  },
  data() {
    return {
      // 控制节点操作显示
      mouseEnter: false,
      stateImg: require('@/assets/ok.png')
    }
  },
  computed: {
    // 节点容器样式
    nodeContainerStyle() {
      let background = ''
      let borderColor = ''
      if (this.node.nodeId === '11') {
        background = '#e1f2f2'
        borderColor = '#cadbdb'
      }
      if (this.node.nodeId === '12' || this.node.nodeId === '23') {
        background = '#e2fdfe'
        borderColor = '#cfe8e9'
      }
      if (this.node.nodeId === '13' || this.node.nodeId === '20') {
        background = '#edf2fc'
        borderColor = '#dbe0ea'
      }
      if (this.node.nodeId === '14' || this.node.nodeId === '21') {
        background = '#efe3df'
        borderColor = '#d4c8c4'
      }
      if (this.node.nodeId === '15' || this.node.nodeId === '22') {
        background = '#fef2dd'
        borderColor = '#e7dbc6'
      }
      if (this.node.nodeId === '16' || this.node.nodeId === '24') {
        background = '#d5f1e6'
        borderColor = '#c5e1d6'
      }
      if (this.node.nodeId === '17' || this.node.nodeId === '25') {
        background = '#f1ecfe'
        borderColor = '#dad5e7'
      }
      if (this.node.nodeId === '18') {
        background = '#caead6'
        borderColor = '#b7d5c1'
      }
      if (this.node.nodeId === '19' || this.node.nodeId === '1-7' ) {
        background = '#c4e4fc'
        borderColor = '#aecee6'
      }
      return {
        top: this.node.top,
        left: this.node.left,
        background,
        borderColor
      }
    },
    nodeIcoClass() {
      var nodeIcoClass = {}
      nodeIcoClass[this.node.ico] = true
      // 添加该class可以推拽连线出来
      nodeIcoClass['flow-node-drag'] = true
      return nodeIcoClass
    }
  },
  methods: {
    // 删除节点
    deleteNode() {
      this.$emit('deleteNode', this.node.id)
    },
    // 编辑节点
    editNode() {
      this.$emit('editNode', this.node)
    },
    // 点击节点
    clickNode() {
      this.$emit('clickNode', this.node)
    },
    // 鼠标移动后抬起
    changeNodePosition() {
      // 避免抖动
      if (this.node.left === this.$refs.node.style.left && this.node.top === this.$refs.node.style.top) {
        return
      }
      this.$emit('changeNodeSite', {
        nodeId: this.node.id,
        left: this.$refs.node.style.left,
        top: this.$refs.node.style.top
      })
    }
  }
}
</script>

<style>

  .flow-node-header {
    background-color: #66a6e0;
    height: 25px;
    cursor: pointer;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }

  .flow-node-header a {
    text-decoration: none;
    line-height: 25px;
    vertical-align: middle;
  }

  .flow-node-header a img {
    line-height: 25px;
    vertical-align: middle;
    margin-bottom: 5px;
  }

  .flow-node-body {
    /*background-color: beige;*/
    background-color: white;
    text-align: center;
    cursor: pointer;
    height: 25px;
    line-height: 25px;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }

  /* 修改、删除按钮样式*/
  .flow-node-operate {
    position: absolute;
    top: 0px;
    right: 0px;
    line-height: 25px
  }

  .flow-node-container {
    position: absolute;
    display: flex;
    width: 70px;
    height: 70px;
    border: 2px solid #94a8ac;
    border-radius: 5px;
    background-color: #fff;
  }

  .flow-node-container:hover {
    /* 设置移动样式*/
    cursor: move;
    /*box-shadow: #1879FF 0px 0px 12px 0px;*/
    background-color: #F0F7FF;
    opacity: 1;
  }

  .flow-node-left {
    width: 0px;
    background-color: #1879FF;
    border-radius: 4px 0 0 4px;
  }

  .flow-node-left-ico {
    line-height: 25px;
    height: 35px;
    margin: 10px auto;
    font-size: 30px;
    position: relative;
  }

  .top-div {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }

  .flow-node-left-ico:hover {
    /* 设置拖拽的样式 */
    cursor: crosshair;
  }

  .flow-node-text {
    color: #494949;
    font-size: 12px;
    line-height: 35px;
    margin-left: 8px;
    width: 100px;
    /* 设置超出宽度文本显示方式*/
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: absolute;
    bottom: -29px;
    left: -23px;
    text-align: center;
  }

  .flow-node-right-ico {
    width: 25px;
    text-align: center;
    line-height: 33px;
    position: absolute;
    right: 0px;
    bottom: -2px;
    color: #f56c6c;
    cursor: pointer;
  }

  .edit-icon.flow-node-right-ico {
    right: 40px;
    color: #009494;
  }

</style>
