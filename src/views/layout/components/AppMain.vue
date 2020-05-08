<template>
  <!--<el-scrollbar class="scrollbar-wrapper">-->
  <section ref="mainApp" class="app-main">
    <transition name="fade-transform" mode="out-in">
      <!-- or name="fade" -->
      <!-- <router-view :key="key"></router-view> -->
      <router-view ref="routerView" :key="activeKey"/>
    </transition>
  </section>
  <!--</el-scrollbar>-->
</template>

<script>
export default {
  name: 'AppMain',
  data() {
    return {
      activeKey: ''
    }
  },
  computed: {
    // key() {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // }
  },
  mounted() {
    this.$router.afterEach((to, from, next) => {
      // debugger
      // window.scrollTo(0, 0)
      // this.$refs.mainApp.scrollTop = 0
    })
  },
  methods: {
    fetchData() {
      this.activeKey = Math.random()
    },
    submitFlowData() {
      this.$refs.routerView.submitFlowData()
    },
    runFlowData() {
      this.$refs.routerView.runFlowData()
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  height: calc(100vh - 106px);
  flex-grow: 1;
  position: relative;
  overflow: auto;
  background: #E5E5E5;
  padding: 10px 10px 11px 11px;
}
.app-main::-webkit-scrollbar {/*滚动条整体样式*/
  width: 8px;     /*高宽分别对应横竖滚动条的尺寸*/
  height: 8px;
  -webkit-appearance: none;
}
.app-main::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
  border-radius: 10px;
  background: #cdcdcd;
}
.app-main::-webkit-scrollbar-thumb:hover{
  background: #bbb;
}
.app-main::-webkit-scrollbar-track {/*滚动条里面轨道*/
  /*-webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);*/
  border-radius: 0px;
  background: #f5f5f5;
}
</style>
