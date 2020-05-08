<template>
  <div ref="tool" style="height: calc(100vh - 127px);background-color: #66a6e0;">
    <el-menu :default-openeds="defaultOpeneds" background-color="#FFF" active-text-color="#009494" class="itemset" style="height: calc(100vh - 127px);">
      <el-submenu v-for="menu in menuList" :index="menu.id" :key="menu.id" class="setback">
        <!--一级菜单名称、不可拖拽 -->
        <template slot="title">
          <i :class="menu.ico"/>
          <span>{{ menu.name }}</span>
        </template>
        <!--一级菜单子菜单、可拖拽菜单-->
        <el-menu-item-group>
          <draggable v-model="menu.children" :options="draggableOptions" @end="addNode" @choose="move">
            <el-menu-item
              v-for="son in menu.children"
              :key="son.id"
              :index="son.id"
              :type="son.type"
            >
              <i :class="son.ico"/>{{ son.name }}
            </el-menu-item>
          </draggable>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
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
  data() {
    return {
      draggableOptions: {
        preventOnFilter: false
      },
      // 默认打开的左侧菜单的id
      defaultOpeneds: ['1'],
      menuList: [
        {
          id: '1',
          type: 'group',
          name: '数据输入',
          ico: 'el-icon-video-play',
          children: [
            {
              id: '11',
              type: 'timer',
              name: '关系数据库输入',
              ico: 'el-icon-time'
            }, {
              id: '12',
              type: 'task',
              name: '文件输入',
              ico: 'el-icon-odometer'
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
    // if (this.isFirefox()) {
    //   document.body.ondrop = function(event) {
    //     // 解决火狐浏览器无法获取鼠标拖拽结束的坐标问题
    //     mousePosition.left = event.layerX
    //     mousePosition.top = event.clientY - 50
    //     event.preventDefault()
    //     event.stopPropagation()
    //   }
    // }
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
          if (children[j].type === type) {
            return children[j]
          }
        }
      }
    },
    // 拖拽开始时触发
    move(evt) {
      console.log(this.clientX, this.clientY)
      var type = evt.item.attributes.type.nodeValue
      this.nodeMenu = this.getMenu(type)
    },
    // 拖拽结束时触发
    addNode(evt, e) {
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
<style scoped>
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
  .el-menu {
    border-right: solid 1px #e6e6e6;
    list-style: none;
    position: relative;
    margin: 0;
    padding-left: 0;
    background-color: #FFF;
  }
  .el-menu i {
    color: #009494 !important;
  }
  .itemset >>> .el-submenu__icon-arrow {
    color: #009494 !important;
  }
  .setback >>> .el-submenu__title:hover{
    background-color: #FFF !important;
  }
  .setback >>> .el-menu-item:hover{
    background-color: #FFF !important;
  }
  .container{
    height: calc(100vh - 158px);
  }
</style>
