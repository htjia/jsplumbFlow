<template>
  <div :class="className" :id="id" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'
import resize from '@/utils/resize'
// import ecConfig from 'echarts/src/config.js'
export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    },
    options: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      chart: null,
      flag: false,
      parameterRecommend1: null,
      parameterRecommend2: null,
      parameterRecommend3: null
    }
  },
  watch: {
    options: {
      handler: function(val, oldVal) {
        // this.initChart()
        this.chart.setOption(val, true)
      },
      deep: true
    },
    flag: {
      handler: function(val, oldVal) {
        // this.initChart()
        console.log(val, oldVal)
      },
      deep: true
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    // throttle(func, wait) {
    //   let timeout
    //   return function() {
    //     const context = this
    //     const args = arguments
    //     if (!timeout) {
    //       timeout = setTimeout(() => {
    //         timeout = null
    //         func.apply(context, args)
    //       }, wait)
    //     }
    //   }
    // },
    initChart() {
      const _this = this
      this.chart = echarts.init(document.getElementById(this.id))
      this.chart.setOption(this.options, true)
      this.chart.off('click')
      this.chart.on('click', function(e) {
        _this.$emit('chartAllClick', e)
      })
      // 图例点击事件
      // this.chart.on('legendselectchanged', function(params) {
      // })
      // datazoom事件
    },
    onResize() {
      this.chart.resize()
    },
    eConsole(param) {
      console.log(param)
    }
  }
}
</script>
