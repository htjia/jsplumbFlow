import WebDataRocks from 'WebDataRocks'
import { barcn } from '@/views/industryStudio/presentation/ch'
// 加载透视表
export function setrept(id) {
  var report = new WebDataRocks({
    container: '#' + id,
    // toolbar: true,
    // beforetoolbarcreated: this.toolbars,
    global: {
      localization: barcn
    },
    height: '100%',
    report: {}
  })
  return report
}
// 解析sql数据
export function loadByUrl(obj, isActive, isTabelActive, barList, lineList, pieList, tableList, scatterList, zuheList, leidaList, tabsInfo, baseName, _this) {
  const type = obj[isActive].layout[isTabelActive].type
  obj[isActive].layout[isTabelActive].sql.database = baseName
  obj[isActive].layout[isTabelActive].sql.measures = []
  obj[isActive].layout[isTabelActive].sql.dimensions = []
  obj[isActive].layout[isTabelActive].sql.limit = '0,' + ((obj[isActive].layout[isTabelActive].pageInfo !== undefined && obj[isActive].layout[isTabelActive].pageInfo.pageSize !== undefined) ? obj[isActive].layout[isTabelActive].pageInfo.pageSize : 10000)
  obj[isActive].layout[isTabelActive].isError = false
  // 生成不同图组sql的传参
  if (type === 'bar' || type === 'tiao' || type === 'duidie') {
    if (barList[0].childrenx.length !== 1) {
      _this.$message({
        type: 'error',
        message: '请拖入维度数据!'
      })
      obj[isActive].layout[isTabelActive].isError = true
      return
    }
    if (barList[0].childreny.length === 0) {
      _this.$message({
        type: 'error',
        message: '请拖入度量数据!'
      })
      obj[isActive].layout[isTabelActive].isError = true
      return
    }
    obj[isActive].layout[isTabelActive].xList = []
    obj[isActive].layout[isTabelActive].yList = []
    for (const item of barList[0].childrenx) {
      obj[isActive].layout[isTabelActive].xList.push(item)
    }
    obj[isActive].layout[isTabelActive].sql.dimensions = [
      {
        column: tabsInfo + '.' + barList[0].childrenx[0].name,
        dateFormat: (barList[0].childrenx[0].columnType.indexOf('time') > -1 || barList[0].childrenx[0].columnType.indexOf('date') > -1) ? barList[0].childrenx[0].key : null
      }
    ]
    obj[isActive].layout[isTabelActive].sql.measures = []
    for (const item of barList[0].childreny) {
      obj[isActive].layout[isTabelActive].yList.push(item)
      obj[isActive].layout[isTabelActive].sql.measures.push({
        column: tabsInfo + '.' + item.name,
        type: item.key
      })
    }
  } else if (type === 'line') {
    if (lineList[0].childrenx.length !== 1) {
      _this.$message({
        type: 'error',
        message: '请拖入维度数据!'
      })
      obj[isActive].layout[isTabelActive].isError = true
      return
    }
    if (lineList[0].childreny.length === 0) {
      _this.$message({
        type: 'error',
        message: '请拖入度量数据!'
      })
      obj[isActive].layout[isTabelActive].isError = true
      return
    }
    obj[isActive].layout[isTabelActive].xList = []
    obj[isActive].layout[isTabelActive].yList = []
    for (const item of lineList[0].childrenx) {
      obj[isActive].layout[isTabelActive].xList.push(item)
    }
    obj[isActive].layout[isTabelActive].sql.dimensions = [{
      column: tabsInfo + '.' + lineList[0].childrenx[0].name,
      dateFormat: (lineList[0].childrenx[0].columnType.indexOf('time') > -1 || lineList[0].childrenx[0].columnType.indexOf('date') > -1) ? lineList[0].childrenx[0].key : null
    }]
    obj[isActive].layout[isTabelActive].sql.measures = []
    for (const item of lineList[0].childreny) {
      obj[isActive].layout[isTabelActive].yList.push(item)
      obj[isActive].layout[isTabelActive].sql.measures.push({
        column: tabsInfo + '.' + item.name,
        type: item.key
      })
    }
  } else if (type === 'pie' || type === 'loudou') {
    if (pieList[0].childrenx.length !== 1) {
      _this.$message({
        type: 'error',
        message: '请拖入维度数据!'
      })
      obj[isActive].layout[isTabelActive].isError = true
      return
    }
    if (pieList[0].childreny.length !== 1) {
      _this.$message({
        type: 'error',
        message: '请拖入度量数据!'
      })
      obj[isActive].layout[isTabelActive].isError = true
      return
    }
    obj[isActive].layout[isTabelActive].xList = []
    obj[isActive].layout[isTabelActive].yList = []
    for (const item of pieList[0].childrenx) {
      obj[isActive].layout[isTabelActive].xList.push(item)
    }
    obj[isActive].layout[isTabelActive].sql.dimensions = [{
      column: tabsInfo + '.' + pieList[0].childrenx[0].name,
      dateFormat: (pieList[0].childrenx[0].columnType.indexOf('time') > -1 || pieList[0].childrenx[0].columnType.indexOf('date') > -1) ? pieList[0].childrenx[0].key : null
    }]
    obj[isActive].layout[isTabelActive].sql.measures = []
    for (const item of pieList[0].childreny) {
      obj[isActive].layout[isTabelActive].yList.push(item)
      obj[isActive].layout[isTabelActive].sql.measures.push({
        column: tabsInfo + '.' + item.name,
        type: 'sum'
      })
    }
  } else if (type === 'table') {
    if (tableList[0].childreny.length === 0) {
      _this.$message({
        type: 'error',
        message: '请拖入度量数据!'
      })
      obj[isActive].layout[isTabelActive].isError = true
      return
    }
    obj[isActive].layout[isTabelActive].yList = []
    obj[isActive].layout[isTabelActive].sql.limit = ''
    obj[isActive].layout[isTabelActive].sql.measures = []
    obj[isActive].layout[isTabelActive].sql.dimensions = []
    if (obj[isActive].layout[isTabelActive].pageInfo.show) {
      obj[isActive].layout[isTabelActive].sql.limit = (obj[isActive].layout[isTabelActive].pageInfo.pageNum - 1) + ',' + obj[isActive].layout[isTabelActive].pageInfo.pageSize
    }
    for (const item of tableList[0].childreny) {
      obj[isActive].layout[isTabelActive].yList.push(item)
      if (item.type === 'weidu') {
        obj[isActive].layout[isTabelActive].sql.dimensions.push({
          column: tabsInfo + '.' + item.name,
          dateFormat: (item.columnType.indexOf('time') > -1 || item.columnType.indexOf('date') > -1) ? item.key : null
        })
      } else {
        obj[isActive].layout[isTabelActive].sql.measures.push({
          column: tabsInfo + '.' + item.name
        })
      }
    }
  } else if (type === 'tstab') {
    if (tableList[0].childreny.length === 0) {
      _this.$message({
        type: 'error',
        message: '请拖入度量数据!'
      })
      obj[isActive].layout[isTabelActive].isError = true
      return
    }
    obj[isActive].layout[isTabelActive].yList = []
    obj[isActive].layout[isTabelActive].sql.measures = []
    obj[isActive].layout[isTabelActive].sql.dimensions = []
    for (const item of tableList[0].childreny) {
      obj[isActive].layout[isTabelActive].yList.push(item)
      if (item.type === 'weidu') {
        obj[isActive].layout[isTabelActive].sql.dimensions.push({
          column: tabsInfo + '.' + item.name,
          dateFormat: (item.columnType.indexOf('time') > -1 || item.columnType.indexOf('date') > -1) ? item.key : null
        })
      } else {
        obj[isActive].layout[isTabelActive].sql.measures.push({
          column: tabsInfo + '.' + item.name,
          type: item.key
        })
      }
    }
  } else if (type === 'scatter') {
    if (scatterList[0].childrenx.length !== 1 || scatterList[0].childreny.length !== 1) {
      _this.$message({
        type: 'error',
        message: '请拖入度量数据!'
      })
      return
    }
    obj[isActive].layout[isTabelActive].xList = []
    obj[isActive].layout[isTabelActive].yList = []
    for (const item of scatterList[0].childrenx) {
      obj[isActive].layout[isTabelActive].xList.push(item)
    }
    for (const item of scatterList[0].childreny) {
      obj[isActive].layout[isTabelActive].yList.push(item)
    }
    obj[isActive].layout[isTabelActive].sql.measures = [{
      column: tabsInfo + '.' + scatterList[0].childrenx[0].name
    },
    {
      column: tabsInfo + '.' + scatterList[0].childreny[0].name
    }]
  } else if (type === 'zuhe') {
    if (zuheList[0].childrenx.length !== 1) {
      _this.$message({
        type: 'error',
        message: '请拖入维度数据!'
      })
      obj[isActive].layout[isTabelActive].isError = true
      return
    }
    if (zuheList[0].childreny1.length === 0) {
      _this.$message({
        type: 'error',
        message: '请拖入Y轴(折线)度量数据!'
      })
      obj[isActive].layout[isTabelActive].isError = true
      return
    }
    if (zuheList[0].childreny.length === 0) {
      _this.$message({
        type: 'error',
        message: '请拖入Y轴(柱状)度量数据!'
      })
      obj[isActive].layout[isTabelActive].isError = true
      return
    }
    obj[isActive].layout[isTabelActive].xList = []
    obj[isActive].layout[isTabelActive].yList = []
    obj[isActive].layout[isTabelActive].yList1 = []
    for (const item of zuheList[0].childrenx) {
      obj[isActive].layout[isTabelActive].xList.push(item)
    }
    obj[isActive].layout[isTabelActive].sql.dimensions = [{
      column: tabsInfo + '.' + zuheList[0].childrenx[0].name,
      dateFormat: (zuheList[0].childrenx[0].columnType.indexOf('time') > -1 || zuheList[0].childrenx[0].columnType.indexOf('date') > -1) ? zuheList[0].childrenx[0].key : null
    }]
    obj[isActive].layout[isTabelActive].sql.measures = []
    for (const item of zuheList[0].childreny1) {
      obj[isActive].layout[isTabelActive].yList1.push(item)
      obj[isActive].layout[isTabelActive].sql.measures.push({
        column: tabsInfo + '.' + item.name,
        type: item.key
      })
    }
    for (const item of zuheList[0].childreny) {
      obj[isActive].layout[isTabelActive].yList.push(item)
      obj[isActive].layout[isTabelActive].sql.measures.push({
        column: tabsInfo + '.' + item.name,
        type: item.key
      })
    }
  } else if (type === 'leida') {
    if (leidaList[0].childrenx.length === 0) {
      _this.$message({
        type: 'error',
        message: '请拖入维度数据!'
      })
      obj[isActive].layout[isTabelActive].isError = true
      return
    }
    if (leidaList[0].childreny.length < 3) {
      _this.$message({
        type: 'error',
        message: '请拖入维度数据不少于3个!'
      })
      obj[isActive].layout[isTabelActive].isError = true
      return
    }
    obj[isActive].layout[isTabelActive].xList = []
    obj[isActive].layout[isTabelActive].yList = []
    obj[isActive].layout[isTabelActive].sql.dimensions = []
    for (const item of leidaList[0].childrenx) {
      obj[isActive].layout[isTabelActive].xList.push(item)
      obj[isActive].layout[isTabelActive].sql.dimensions.push({
        column: tabsInfo + '.' + item.name
      })
    }
    obj[isActive].layout[isTabelActive].sql.measures = []
    for (const item of leidaList[0].childreny) {
      obj[isActive].layout[isTabelActive].yList.push(item)
      obj[isActive].layout[isTabelActive].sql.measures.push({
        column: tabsInfo + '.' + item.name,
        type: item.key
      })
    }
  }
  _this.setHistory()
  // 传参
  _this.getReload(_this.substrateFindOptions[_this.isActive].layout[_this.isTabelActive].sql, _this.isTabelActive, _this.substrateFindOptions[_this.isActive].layout[_this.isTabelActive].type)
}
