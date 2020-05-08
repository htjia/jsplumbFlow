// 创建搜索框
export function setSearch(row, data, ids) {
  // 新增搜索条件
  if (row.$slots.default[1].text.indexOf('文本框') > -1) {
    var inputInfo = { type: 'input', span: 185, text: '文本框', tableName: '', sqlName: '', id: data.searchinput.length }
    inputInfo['input' + data.searchinput.length] = ''
    data.searchinput.push(inputInfo)
  } else if (row.$slots.default[1].text.indexOf('下拉框') > -1) {
    var selectInfo = { type: 'select', searchList: [], span: 185, text: '下拉框', tableName: '', sqlName: '', id: data.searchinput.length, searchSQL: {
      measures: [],
      dimensions: [],
      filter: [],
      order: []
    }}
    selectInfo['select' + data.searchinput.length] = ''
    data.searchinput.push(selectInfo)
  } else if (row.$slots.default[1].text.indexOf('日期') > -1) {
    var dataInfo = { type: 'date', span: 200, text: '日期', tableName: '', sqlName: '', ts: 'date', id: data.searchinput.length }
    dataInfo['date' + data.searchinput.length] = ''
    data.searchinput.push(dataInfo)
  } else if (row.$slots.default[1].text.indexOf('时间范围') > -1) {
    var datasInfo = { span: 380, text: '时间范围', type: 'range', tableName: '', sqlName: '', ts: 'date', id: data.searchinput.length }
    datasInfo['start' + data.searchinput.length] = ''
    datasInfo['end' + data.searchinput.length] = ''
    data.searchinput.push(datasInfo)
  } else if (row.$slots.default[1].text.indexOf('单选框') > -1) {
    var radioInfo = { span: 190, value: data.searchinput.length, type: 'single', tableName: '', sqlName: '', id: data.searchinput.length, list: [{
      text: '单选框',
      label: '1'
    },
    {
      text: '单选框1',
      label: '2'
    }] }
    radioInfo['radio' + data.searchinput.length] = '1'
    data.searchinput.push(radioInfo)
  } else if (row.$slots.default[1].text.indexOf('多选框') > -1) {
    var checkInfo = { span: 100, text: '多选框', value: data.searchinput.length, type: 'checks', tableName: '', sqlName: '', id: data.searchinput.length }
    checkInfo['check' + data.searchinput.length] = true
    data.searchinput.push(checkInfo)
  }
}
// 创建表格
export function setTable(row, ids, y) {
  // 栅格划分12等分，x横向的位置，y纵向的位置，w宽度，h高度，i唯一标识，type类型（table:普通表,tstab:透视表）
  // isError:是否绘图出错，static:是否静止不允许拖拽，sql: {measures:度量，dimensions:维度，filter:过滤条件,order:排序，title:标题，options:echart绘图参数}
  var obj = null
  if (row.$slots.default[1].text.indexOf('普通表') > -1) {
    obj = { x: 0, y: y, w: 24, h: 10, i: ids, isError: false, isSearch: false, ldsql: [], qjsql: [], type: 'table', static: false, pageInfo: {
      show: true,
      pageNum: 1,
      pageSize: 10,
      totalPage: 10
    }, sql: {
      measures: [],
      dimensions: [],
      filter: [],
      order: [],
      limit: ''
    }, yList: [], condList: [], title: {
      show: true,
      text: '普通表',
      left: 'left',
      textStyle: {
        color: '#666666',
        fontSize: 14
      }
    },
    options: {
      list: [{
        date: '2016-05-02',
        name: '王小虎',
        num: '12'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        num: '123'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        num: '1211'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        num: '4412'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        num: '4412'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        num: '4412'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        num: '4412'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        num: '4412'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        num: '4412'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        num: '4412'
      }],
      title: [
        {
          key: 'date',
          keyname: '日期',
          width: 0
        },
        {
          key: 'name',
          keyname: '操作员',
          width: 0
        },
        {
          key: 'num',
          keyname: '入库数',
          width: 0
        }
      ]
    }}
  } else if (row.$slots.default[1].text.indexOf('透视表') > -1) {
    obj = { x: 0, y: y, w: 24, h: 12, i: ids, isError: false, isSearch: false, ldsql: [], qjsql: [], type: 'tstab', static: false, pageInfo: {
      show: true,
      pageNum: 1,
      pageSize: 10000,
      totalPage: 10
    }, sql: {
      measures: [],
      dimensions: [],
      filter: [],
      order: []
    }, yList: [], condList: [], title: {
      show: true,
      text: '透视表',
      left: 'left',
      textStyle: {
        color: '#666666',
        fontSize: 14
      }
    }, options: {}}
  }
  return obj
}
// 创建普通图
export function setChart(x, y, ys, ids, row) {
  var obj = {}
  // 栅格划分12等分，x横向的位置，y纵向的位置，w宽度，h高度，i唯一标识，type类型（bar:柱状图,pie:饼图,line:折线图,tiao:条形图,scatter:散点图,duidie:堆叠图,loudou:漏斗图,zuhe:组合）
  // isError:是否绘图出错，static:是否静止不允许拖拽，sql: {measures:度量，dimensions:维度，filter:过滤条件,order:排序，title:标题，options:echart绘图参数}
  if (row.$slots.default[1].text.indexOf('柱状图') > -1) {
    obj = { x: x, y: y, w: ys, h: 6, i: ids, type: 'bar', isError: false, isSearch: false, static: false, ldsql: [], qjsql: [], opt: {
      dataposition: 'inside',
      dataIsShow: false
    }, pageInfo: {
      show: true,
      pageNum: 1,
      pageSize: 10000,
      totalPage: 10
    }, sql: {
      measures: [],
      dimensions: [],
      filter: [],
      order: []
    }, xList: [], yList: [], condList: [], ldList: [], infoList: [], title: {
      show: true,
      text: '柱状图',
      left: 'left',
      textStyle: {
        color: '#666666',
        fontSize: 14
      }
    },
    options: {
      title: {
        show: false,
        text: 'bar' + ids
      },
      legend: {
        show: true,
        left: 'center',
        itemHeight: 10,
        itemWidth: 15,
        top: 'top'
      },
      dataZoom: [
        {
          show: false,
          type: 'slider',
          start: 0,
          end: 100,
          height: 15,
          bottom: 0
        }
      ],
      tooltip: {
        show: true,
        trigger: 'axis',
        triggerOn: 'mousemove'
      },
      grid: {
        top: 33,
        left: 40,
        right: 30,
        bottom: 35
      },
      xAxis: {
        splitLine: {
          show: false
        },
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value',
        splitLine: {
          show: true
        }
      },
      series: [{
        name: '示例',
        data: [120, 200, 150, 80, 70, 110, 130],
        itemStyle: {
          color: '#009494',
          barBorderRadius: [5, 5, 0, 0]
        },
        label: {
          show: false,
          position: 'inside'
        },
        barMaxWidth: 20,
        type: 'bar'
      }]
    }}
  } else if (row.$slots.default[1].text.indexOf('饼图') > -1) {
    obj = { x: x, y: y, w: ys, h: 10, i: ids, type: 'pie', isError: false, isSearch: false, static: false, ldsql: [], qjsql: [], opt: {
      dataposition: 'inside',
      dataIsShow: false
    }, pageInfo: {
      show: true,
      pageNum: 1,
      pageSize: 10000,
      totalPage: 10
    }, sql: {
      measures: [],
      dimensions: [],
      filter: [],
      order: []
    }, xList: [], yList: [], condList: [], ldList: [], infoList: [], title: {
      show: true,
      text: '饼图',
      left: 'left',
      textStyle: {
        color: '#666666',
        fontSize: 14
      }
    },
    options: {
      title: {
        show: false,
        text: ids
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
        triggerOn: 'click'
      },
      legend: {
        show: true,
        orient: 'vertical',
        right: 'right',
        itemHeight: 10,
        itemWidth: 15,
        top: 'top'
      },
      grid: {
        top: 50,
        left: 40,
        right: 30,
        bottom: 30
      },
      series: [
        {
          name: '饼图数据',
          type: 'pie',
          radius: [0 + '%', 70 + '%'],
          clockwise: false,
          label: {
            show: true,
            position: 'outside'
          },
          center: ['50%', '60%'],
          roseType: '',
          data: [
            { value: 335, name: '直接访问', itemStyle: { color: '' }},
            { value: 310, name: '邮件营销', itemStyle: { color: '' }},
            { value: 234, name: '联盟广告', itemStyle: { color: '' }},
            { value: 135, name: '视频广告', itemStyle: { color: '' }},
            { value: 1548, name: '搜索引擎', itemStyle: { color: '' }}
          ]
        }
      ]
    }}
  } else if (row.$slots.default[1].text.indexOf('折线图') > -1) {
    obj = { x: x, y: y, w: ys, h: 6, i: ids, type: 'line', isError: false, isSearch: false, static: false, ldsql: [], qjsql: [], opt: {
      dataposition: 'inside',
      dataIsShow: false
    }, pageInfo: {
      show: true,
      pageNum: 1,
      pageSize: 10000,
      totalPage: 10
    }, sql: {
      measures: [],
      dimensions: [],
      filter: [],
      order: []
    }, xList: [], yList: [], condList: [], ldList: [], infoList: [], title: {
      show: true,
      text: '折线图',
      left: 'left',
      textStyle: {
        color: '#666666',
        fontSize: 14
      }
    },
    options: {
      title: {
        show: false,
        text: ids
      },
      legend: {
        show: true,
        left: 'center',
        itemHeight: 8,
        top: 'top'
      },
      dataZoom: [
        {
          show: false,
          type: 'slider',
          start: 0,
          end: 100,
          height: 15,
          bottom: 0
        }
      ],
      tooltip: {
        show: false,
        trigger: 'axis',
        triggerOn: 'click'
      },
      xAxis: {
        splitLine: {
          show: false
        },
        type: 'category',
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      },
      grid: {
        top: 33,
        left: 40,
        right: 30,
        bottom: 35
      },
      yAxis: {
        splitLine: {
          show: true
        },
        type: 'value'
      },
      series: [{
        name: '数据量',
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        itemStyle: {
          color: '#009494'
        },
        label: {
          show: false,
          position: 'inside'
        },
        smooth: false,
        type: 'line'
      },
      {
        name: '优化数',
        data: [720, 632, 801, 654, 1190, 1430, 1120],
        label: {
          show: false,
          position: 'inside'
        },
        itemStyle: {
          color: ''
        },
        smooth: false,
        type: 'line'
      },
      {
        name: '示例',
        data: [720, 302, 401, 834, 990, 1030, 1220],
        label: {
          show: false,
          position: 'inside'
        },
        itemStyle: {
          color: ''
        },
        smooth: false,
        type: 'line'
      }]
    }}
  } else if (row.$slots.default[1].text.indexOf('条形图') > -1) {
    obj = { x: x, y: y, w: ys, h: 6, i: ids, type: 'tiao', isError: false, isSearch: false, static: false, ldsql: [], qjsql: [], opt: {
      dataposition: 'inside',
      dataIsShow: false
    }, pageInfo: {
      show: true,
      pageNum: 1,
      pageSize: 10000,
      totalPage: 10
    }, sql: {
      measures: [],
      dimensions: [],
      filter: [],
      order: []
    }, xList: [], yList: [], condList: [], ldList: [], infoList: [], title: {
      show: true,
      text: '条形图',
      left: 'left',
      textStyle: {
        color: '#666666',
        fontSize: 14
      }
    },
    options: {
      title: {
        show: false,
        text: ids
      },
      legend: {
        show: true,
        left: 'center',
        itemHeight: 10,
        itemWidth: 15,
        top: 'top'
      },
      dataZoom: [
        {
          show: false,
          type: 'slider',
          start: 0,
          end: 100,
          height: 15,
          bottom: 0
        }
      ],
      tooltip: {
        show: false,
        trigger: 'axis',
        triggerOn: 'click',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        top: 33,
        left: 40,
        right: 30,
        bottom: 35
      },
      xAxis: {
        splitLine: {
          show: true
        },
        type: 'value'
      },
      yAxis: {
        splitLine: {
          show: false
        },
        type: 'category',
        data: ['周一', '周二', '周三', '周四', '周五'],
        containLabel: true
      },
      series: [{
        name: '数据',
        data: [120, 200, 150, 80, 120],
        itemStyle: {
          color: '#009494',
          barBorderRadius: [0, 5, 5, 0]
        },
        label: {
          show: false,
          position: 'inside'
        },
        barMaxWidth: 15,
        barCateGoryGap: 20,
        type: 'bar'
      }]
    }}
  } else if (row.$slots.default[1].text.indexOf('散点图') > -1) {
    obj = { x: x, y: y, w: ys, h: 6, i: ids, type: 'scatter', isError: false, isSearch: false, static: false, ldsql: [], qjsql: [], opt: {
      dataposition: 'inside',
      dataIsShow: false
    }, pageInfo: {
      show: true,
      pageNum: 1,
      pageSize: 10000,
      totalPage: 10
    }, sql: {
      measures: [],
      dimensions: [],
      filter: [],
      order: []
    }, xList: [], yList: [], condList: [], ldList: [], infoList: [], title: {
      show: true,
      text: '散点图',
      left: 'left',
      textStyle: {
        color: '#666666',
        fontSize: 14
      }
    },
    options: {
      title: {
        show: false,
        text: ids
      },
      legend: {
        show: true,
        left: 'center',
        itemHeight: 10,
        itemWidth: 15,
        top: 'top'
      },
      dataZoom: [
        {
          show: false,
          type: 'slider',
          start: 0,
          end: 100,
          height: 15,
          bottom: 0
        }
      ],
      tooltip: {
        show: false,
        trigger: 'axis',
        triggerOn: 'click'
      },
      grid: {
        top: 33,
        left: 40,
        right: 30,
        bottom: 35
      },
      xAxis: {
        splitLine: {
          show: true
        }
      },
      yAxis: {
        splitLine: {
          show: true
        }
      },
      series: [{
        name: '散点',
        symbolSize: 5,
        itemStyle: {
          color: '#009494'
        },
        label: {
          show: false,
          position: 'inside'
        },
        data: [
          [10.0, 8.04],
          [9.0, 8.34],
          [8.0, 9.54],
          [7.0, 7.14],
          [6.0, 6.94],
          [1.0, 3.94],
          [2.0, 4.94],
          [3.0, 2.94],
          [3.6, 3.94],
          [4.6, 7.94],
          [4, 5.94]
        ],
        type: 'scatter'
      }]
    }}
  } else if (row.$slots.default[1].text.indexOf('堆叠图') > -1) {
    obj = { x: x, y: y, w: ys, h: 6, i: ids, type: 'duidie', isError: false, isSearch: false, static: false, ldsql: [], qjsql: [], opt: {
      dataposition: 'inside',
      dataIsShow: false
    }, pageInfo: {
      show: true,
      pageNum: 1,
      pageSize: 10000,
      totalPage: 10
    }, sql: {
      measures: [],
      dimensions: [],
      filter: [],
      order: []
    }, xList: [], yList: [], condList: [], ldList: [], infoList: [], title: {
      show: true,
      text: '堆叠图',
      left: 'left',
      textStyle: {
        color: '#666666',
        fontSize: 14
      }
    },
    options: {
      title: {
        show: false,
        text: ids
      },
      legend: {
        show: true,
        left: 'center',
        itemHeight: 10,
        itemWidth: 15,
        top: 'top'
      },
      dataZoom: [
        {
          show: false,
          type: 'slider',
          start: 0,
          end: 100,
          height: 15,
          bottom: 0
        }
      ],
      tooltip: {
        show: false,
        trigger: 'axis',
        triggerOn: 'click'
      },
      grid: {
        top: 33,
        left: 40,
        right: 30,
        bottom: 35
      },
      xAxis: {
        splitLine: {
          show: false
        },
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value',
        splitLine: {
          show: true
        }
      },
      series: [{
        name: '示例',
        data: [120, 200, 150, 80, 70, 110, 130],
        itemStyle: {
          color: '#009494'
        },
        stack: '示例s',
        label: {
          show: false,
          position: 'inside'
        },
        barMaxWidth: 20,
        type: 'bar'
      },
      {
        name: '示例二',
        data: [20, 10, 50, 30, 40, 10, 30],
        itemStyle: {
          color: ''
        },
        label: {
          show: false,
          position: 'inside'
        },
        stack: '示例s',
        barMaxWidth: 20,
        type: 'bar'
      },
      {
        name: '示例三',
        data: [40, 30, 10, 20, 20, 30, 50],
        itemStyle: {
          color: ''
        },
        label: {
          show: false,
          position: 'inside'
        },
        stack: '示例s',
        barMaxWidth: 20,
        type: 'bar'
      }]
    }}
  } else if (row.$slots.default[1].text.indexOf('漏斗图') > -1) {
    obj = { x: x, y: y, w: ys, h: 7, i: ids, type: 'loudou', isError: false, isSearch: false, static: false, ldsql: [], qjsql: [], opt: {
      dataposition: 'inside',
      dataIsShow: false
    }, pageInfo: {
      show: true,
      pageNum: 1,
      pageSize: 10000,
      totalPage: 10
    }, sql: {
      measures: [],
      dimensions: [],
      filter: [],
      order: []
    }, xList: [], yList: [], condList: [], ldList: [], infoList: [], title: {
      show: true,
      text: '漏斗图',
      left: 'left',
      textStyle: {
        color: '#666666',
        fontSize: 14
      }
    },
    options: {
      title: {
        show: false,
        text: ids
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
        triggerOn: 'click'
      },
      legend: {
        show: true,
        left: 'center',
        itemHeight: 10,
        itemWidth: 15,
        top: 'top'
      },
      grid: {
        top: 50,
        left: 40,
        right: 30,
        bottom: 0
      },
      series: [
        {
          name: '预期',
          type: 'funnel',
          left: 'center',
          width: '70%',
          label: {
            show: true,
            position: 'inside'
          },
          bottom: 0,
          data: [
            { value: 60, name: '直接访问', itemStyle: { color: '' }},
            { value: 40, name: '邮件营销', itemStyle: { color: '' }},
            { value: 20, name: '联盟广告', itemStyle: { color: '' }},
            { value: 80, name: '视频广告', itemStyle: { color: '' }},
            { value: 100, name: '搜索引擎', itemStyle: { color: '' }}
          ]
        }
      ]
    }}
  } else if (row.$slots.default[1].text.indexOf('组合图') > -1) {
    obj = { x: x, y: y, w: ys, h: 6, i: ids, type: 'zuhe', isError: false, isSearch: false, static: false, ldsql: [], qjsql: [], opt: {
      dataposition: 'inside',
      dataIsShow: false
    }, pageInfo: {
      show: true,
      pageNum: 1,
      pageSize: 10000,
      totalPage: 10
    }, sql: {
      measures: [],
      dimensions: [],
      filter: [],
      order: []
    }, xList: [], yList: [], yList1: [], condList: [], ldList: [], infoList: [], title: {
      show: true,
      text: '组合图',
      left: 'left',
      textStyle: {
        color: '#666666',
        fontSize: 14
      }
    },
    options: {
      title: {
        show: false,
        text: ids
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        triggerOn: 'mousemove'
      },
      legend: {
        show: true,
        left: 'center',
        itemHeight: 10,
        itemWidth: 15,
        top: 'top'
      },
      dataZoom: [
        {
          show: false,
          type: 'slider',
          start: 0,
          end: 100,
          height: 15,
          bottom: 0
        }
      ],
      grid: {
        top: 33,
        left: 40,
        right: 30,
        bottom: 35
      },
      xAxis: [
        {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          splitLine: {
            show: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          splitLine: {
            show: true
          }
        },
        {
          type: 'value',
          splitLine: {
            show: false
          }
        }
      ],
      series: [
        {
          name: '平均数',
          type: 'line',
          yAxisIndex: 1,
          label: {
            show: false,
            position: 'inside'
          },
          itemStyle: {
            color: ''
          },
          smooth: false,
          data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
        },
        {
          name: '发布量',
          type: 'bar',
          label: {
            show: false,
            position: 'inside'
          },
          itemStyle: {
            color: '#009494'
          },
          barMaxWidth: 20,
          data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 23.6, 20.0, 6.4, 3.3]
        },
        {
          name: '预估量',
          type: 'bar',
          label: {
            show: false,
            position: 'inside'
          },
          itemStyle: {
            color: ''
          },
          barMaxWidth: 20,
          data: [2.3, 5.9, 9.9, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
        }
      ]
    }}
  } else if (row.$slots.default[1].text.indexOf('雷达图') > -1) {
    obj = { x: x, y: y, w: ys, h: 10, i: ids, type: 'leida', isError: false, isSearch: false, static: false, ldsql: [], qjsql: [], pageInfo: {
      show: true,
      pageNum: 1,
      pageSize: 10000,
      totalPage: 10
    }, sql: {
      measures: [],
      dimensions: [],
      filter: [],
      order: []
    }, xList: [], yList: [], maxList: [], condList: [], ldList: [], opt: {
      tooltipTriggerOn: 'mousemove',
      legendShow: true,
      legendLeft: 'center',
      legendTop: 'top',
      lineFlag: true,
      tooltipShow: true,
      dataposition: 'inside',
      dataIsShow: false
    }, infoList: [], title: {
      show: true,
      text: '雷达图',
      left: 'left',
      textStyle: {
        color: '#666666',
        fontSize: 14
      }
    },
    options: [{
      title: {
        show: false,
        text: ids
      },
      tooltip: {
        show: true,
        triggerOn: 'mousemove'
      },
      legend: {
        show: true,
        left: 'center',
        itemHeight: 10,
        itemWidth: 15,
        top: 'top'
      },
      grid: {
        top: 33,
        left: 40,
        right: 30,
        bottom: 35
      },
      radar: {
        shape: 'polygon',
        indicator: [
          { name: '销售', max: 6500 },
          { name: '管理', max: 16000 },
          { name: '信息技术', max: 30000 },
          { name: '客服', max: 38000 },
          { name: '研发', max: 52000 },
          { name: '市场', max: 25000 }
        ],
        radius: '60%'
      },
      series: {
        name: ' 开销',
        type: 'radar',
        itemStyle: {
          color: '#009494'
        },
        label: {
          show: false,
          position: 'inside'
        },
        data: [
          {
            value: [5000, 14000, 28000, 31000, 42000, 21000],
            name: '开销'
          }
        ]
      }
    }] }
  }
  return obj
}
// 遍历sql
export function editFilter(data) {
  const obj = {
    column: '',
    operator: '',
    value: ''
  }
  if (data.type === 'input' && data['input' + data.id].length > 0 && data.tableName.length > 0) {
    obj.column = data.tableName + '.' + data.sqlName
    obj.operator = 'like'
    obj.value = '%' + data['input' + data.id] + '%'
  } else if (data.type === 'select' && data['select' + data.id].length > 0 && data.tableName.length > 0) {
    obj.column = data.tableName + '.' + data.sqlName
    obj.operator = '='
    obj.value = data['select' + data.id]
  } else if (data.type === 'date' && data['date' + data.id].length > 0 && data.tableName.length > 0) {
    obj.column = data.tableName + '.' + data.sqlName
    obj.operator = '='
    obj.value = (data.ts === 'week') ? formatDate(data['date' + data.id]) : data['date' + data.id]
  } else if (data.type === 'single' && data['radio' + data.id].length > 0 && data.tableName.length > 0) {
    obj.column = data.tableName + '.' + data.sqlName
    obj.operator = '='
    obj.value = data['radio' + data.id]
  } else if (data.type === 'checks' && data['check' + data.id].length > 0 && data.tableName.length > 0) {
    obj.column = data.tableName + '.' + data.sqlName
    obj.operator = '='
    obj.value = data['check' + data.id]
  }
  return obj
}
// 时间戳转yyyy-mm-dd
export function formatDate(timeStamp) {
  var date = new Date(timeStamp)
  var y = 1900 + date.getYear()
  var m = '0' + (date.getMonth() + 1)
  var d = '0' + date.getDate()
  return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
}
// 时间戳转加6天yyyy-mm-dd
export function formatDates(timeStamp) {
  var dataTime = new Date()
  var dates = new Date(timeStamp)
  dataTime = dataTime.setDate(dates.getDate() + 6)
  var date = new Date(dataTime)
  var y = 1900 + date.getYear()
  var m = '0' + (date.getMonth() + 1)
  var d = '0' + date.getDate()
  return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
}
