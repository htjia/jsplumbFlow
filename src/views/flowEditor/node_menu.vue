<template>
  <div ref="tool" class="flow-menu">
    <el-collapse v-model="activeNames">
      <el-collapse-item v-for="menu in menuList" :key="menu.id" :name="menu.id">
        <template slot="title">
          {{ menu.name }}
        </template>
        <draggable v-model="menu.children" :options="draggableOptions" @end="end" @start="move">
          <div
            v-for="(son, index) in menu.children"
            :key="index"
            :type="son.nodeType"
            :style="son.style"
            class="flow-node-menu">
            <div class="flow-node-menu-left"/>
            <div class="flow-node-menu-left-ico">
              <!--<i :class="son.ico"/>-->
              <svg-icon :icon-class="son.ico" style="font-size: 18px"/>
            </div>
            <div class="flow-node-menu-text">
              {{ son.name }}
            </div>
          </div>
        </draggable>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import draggable from 'vuedraggable'

var mousePosition = {
  left: -1,
  top: -1
}

export default {
  components: {
    draggable
  },
  props: {
    isKmeans: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeNames: '1',
      // draggable配置参数参考 https://www.cnblogs.com/weixin186/p/10108679.html
      draggableOptions: {
        preventOnFilter: false,
        sort: false,
        disabled: false,
        ghostClass: 'tt',
        // 不使用H5原生的配置
        forceFallback: true,
        put: true
        // 拖拽的时候样式
        // fallbackClass: 'flow-node-draggable'
      },
      // 默认打开的左侧菜单的id
      defaultOpeneds: ['1', '2'],
      menuList: [
        {
          id: '1',
          type: 'group',
          name: '数据编辑器',
          ico: 'el-icon-video-play',
          children: [
            {
              id: '11',
              nodeType: '11',
              metadataid: 'cn.brainmx.cobra.pipeline.handlers.TableInputHandler',
              name: '数据输入',
              ico: 'shujusr',
              // 自定义覆盖样式
              style: {}
            }, {
              id: '1-10',
              nodeType: '1-10',
              metadataid: 'cn.brainmx.cobra.pipeline.handlers.TransposedRowHandler',
              name: 'csv文件输入',
              ico: 'chaifendh',
              // 自定义覆盖样式
              style: {}
            }, {
              id: '1-11',
              nodeType: '1-11',
              metadataid: 'cn.brainmx.cobra.pipeline.handlers.TransposedRowHandler',
              name: 'exc文件输入',
              ico: 'chaifendh',
              // 自定义覆盖样式
              style: {}
            }, {
              id: '13',
              nodeType: '13',
              metadataid: 'cn.brainmx.cobra.pipeline.handlers.JoinHandler',
              name: '表关联',
              ico: 'biaoggl',
              // 自定义覆盖样式
              style: {}
            }, {
              id: '14',
              nodeType: '14',
              metadataid: 'cn.brainmx.cobra.pipeline.handlers.WithColumnHandler',
              name: '数据分组',
              ico: 'shujfz',
              // 自定义覆盖样式
              style: {}
            }, {
              id: '15',
              nodeType: '15',
              metadataid: 'cn.brainmx.cobra.pipeline.handlers.GroupByHandler',
              name: '分组聚合',
              ico: 'fenljh',
              // 自定义覆盖样式
              style: {}
            }, {
              id: '16',
              nodeType: '16',
              metadataid: 'cn.brainmx.cobra.pipeline.handlers.SortHandler',
              name: '列排序',
              ico: 'liepaix',
              // 自定义覆盖样式
              style: {}
            }, {
              id: '1-7',
              nodeType: '1-7',
              metadataid: 'cn.brainmx.cobra.pipeline.handlers.ExpressionHandler',
              name: '计算列',
              ico: 'jisuanlie',
              // 自定义覆盖样式
              style: {}
            }, {
              id: '1-8',
              nodeType: '1-8',
              metadataid: 'cn.brainmx.cobra.pipeline.handlers.TransposedColHandler',
              name: '一列拆多列',
              ico: 'chaifendl',
              // 自定义覆盖样式
              style: {}
            }, {
              id: '1-9',
              nodeType: '1-9',
              metadataid: 'cn.brainmx.cobra.pipeline.handlers.TransposedRowHandler',
              name: '一行拆多行',
              ico: 'chaifendh',
              // 自定义覆盖样式
              style: {}
            }, {
              id: '12',
              nodeType: '12',
              metadataid: 'cn.brainmx.cobra.pipeline.handlers.TableOutputHandler',
              name: '数据输出',
              ico: 'shujusc',
              // 自定义覆盖样式
              style: {}
            }
          ]
        }
      ],
      kmeansMenu: [
        {
          id: '1',
          type: 'group',
          name: '数据编辑器',
          ico: 'el-icon-video-play',
          children: [
            {
              id: '11',
              nodeType: '11',
              metadataid: 'cn.brainmx.cobra.pipeline.handlers.TableInputHandler',
              name: '数据输入',
              ico: 'shujusr',
              // 自定义覆盖样式
              style: {}
            },
            {
              id: '18',
              nodeType: '18',
              metadataid: 'cn.brainmx.cobra.pipeline.handlers.TableOutputHandler',
              name: '数据过滤',
              ico: 'shujugl',
              // 自定义覆盖样式
              style: {}
            },
            {
              id: '25',
              nodeType: '25',
              name: 'Kmeans聚类',
              ico: 'kmeansjl',
              // 自定义覆盖样式
              style: {}
            },
            {
              id: '19',
              nodeType: '19',
              metadataid: 'cn.brainmx.cobra.pipeline.handlers.JoinHandler',
              name: '表关联',
              ico: 'biaoggl',
              // 自定义覆盖样式
              style: {}
            },
            {
              id: '20',
              nodeType: '20',
              metadataid: 'cn.brainmx.cobra.pipeline.handlers.TableOutputHandler',
              name: '表拼接',
              ico: 'biaoghb',
              // 自定义覆盖样式
              style: {}
            },
            {
              id: '21',
              nodeType: '21',
              metadataid: 'cn.brainmx.cobra.pipeline.handlers.TableOutputHandler',
              name: '随机森林',
              ico: 'suijisl',
              // 自定义覆盖样式
              style: {}
            },
            {
              id: '22',
              nodeType: '22',
              metadataid: 'cn.brainmx.cobra.pipeline.handlers.TableOutputHandler',
              name: '模型调用',
              ico: 'moxingdy',
              // 自定义覆盖样式
              style: {}
            },
            {
              id: '24',
              nodeType: '24',
              metadataid: 'cn.brainmx.cobra.pipeline.handlers.SortHandler',
              name: '列排序',
              ico: 'liepaix',
              // 自定义覆盖样式
              style: {}
            },
            {
              id: '23',
              nodeType: '23',
              metadataid: 'cn.brainmx.cobra.pipeline.handlers.TableOutputHandler',
              name: '数据输出',
              ico: 'shujusr',
              // 自定义覆盖样式
              style: {}
            }
          ]
        }
      ],
      nodeMenu: {},
      clientX: 0,
      clientY: 0
    }
  },
  created() {
    /**
             * 以下是为了解决在火狐浏览器上推拽时弹出tab页到搜索问题
             * @param event
             */
    if (this.isFirefox()) {
      document.body.ondrop = function(event) {
        // 解决火狐浏览器无法获取鼠标拖拽结束的坐标问题
        mousePosition.left = event.layerX
        mousePosition.top = event.clientY - 50
        event.preventDefault()
        event.stopPropagation()
      }
    }
    if (this.isKmeans) {
      this.menuList = this.kmeansMenu
    }
  },
  mounted() {
    this.getinrotrue()
  },
  methods: {
    getinrotrue() {
      window.addEventListener('mousemove', this.handleKey)
    },
    handleKey(event) {
      this.clientX = event.clientX
      this.clientY = event.clientY
    },
    // 根据类型获取左侧菜单对象
    getMenu(type) {
      for (let i = 0; i < this.menuList.length; i++) {
        const children = this.menuList[i].children
        for (let j = 0; j < children.length; j++) {
          if (children[j].nodeType === type) {
            return children[j]
          }
        }
      }
    },
    // 拖拽开始时触发
    move(evt, a, b, c) {
      var type = evt.item.attributes.type.nodeValue
      this.nodeMenu = this.getMenu(type)
    },
    // 拖拽结束时触发
    end(evt, e) {
      // this.$emit('addNode', evt, this.nodeMenu, mousePosition)
      const _this = this
      setTimeout(() => {
        const div = document.getElementById('flowContainer')
        const body = document.body
        const divx1 = body.clientWidth - div.clientWidth
        const divy1 = body.clientHeight - div.clientHeight
        const divx2 = div.offsetLeft + div.offsetWidth + divx1
        const divy2 = div.offsetTop + div.offsetHeight + divy1
        if (_this.clientX >= divx1 && _this.clientX <= divx2 && _this.clientY >= divy1 && _this.clientY <= divy2) {
          console.log(_this.clientX, _this.clientY, divx1, divy1, divx2, divy2)
          mousePosition.left = _this.clientX
          mousePosition.top = _this.clientY
          this.$emit('addNode', evt, _this.nodeMenu, mousePosition)
        }
      }, 100)
    },
    // 是否是火狐浏览器
    isFirefox() {
      var userAgent = navigator.userAgent
      if (userAgent.indexOf('Firefox') > -1) {
        return true
      }
      return false
    }
  }
}
</script>
<style>

    .flow-menu {
        text-align: center;
    }

    .flow-tool-menu {
        background-color: #eeeeee;
        cursor: pointer;
        padding-left: 5px;
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid #979797
    }

    .flow-tool-submenu {
        background-color: white;
        padding-left: 20px;
        cursor: pointer;
        height: 50px;
        line-height: 50px;
        vertical-align: middle;
        border-bottom: 1px solid #d3d3d3
    }

    .flow-node-draggable {
        border: 1px solid #1879FF;
        height: 35px !important;
        width: 170px !important;
        line-height: 35px;
    }

    .flow-node-menu {
        margin: 10px;
        display: flex;
        width: 90%;
        height: 30px;
        border: 1px solid #E0E3E7;
        border-radius: 5px;
        background-color: #fff;
    }

    .flow-node-menu:hover {
        /* 设置移动样式*/
        cursor: move;
        background-color: #F0F7FF;
        /*box-shadow: #1879FF 0px 0px 12px 0px;*/
        background-color: #F0F7FF;
        border: 1px solid #009494;
    }

    .flow-node-menu-left {
        width: 4px;
        background-color: #009494;
        border-radius: 3px 0 0 3px;
    }

    .flow-node-menu-left-ico {
        line-height: 30px;
        margin-left: 10px;
    }

    .flow-node-menu-text {
        color: #565758;
        font-size: 14px;
        line-height: 30px;
        margin-left: 4px;
        width: 100px;
        /* 设置超出宽度文本显示方式*/
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      text-align: left;
      padding-left: 6px;
    }
    .el-collapse-item__header{
      height: 40px;
      line-height: 40;
      margin-left: 15px;
      font-weight: bold;
      color: #666;
    }
</style>
