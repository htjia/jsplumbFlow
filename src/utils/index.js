/**
 * Created by jiachenpan on 16/11/18.
 */

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

// 计算椭圆
export function ellipse(longa, shortb, centerx, centery, angle) {
  const data = []
  const longlength = parseInt(longa * 10000)
  const shortlength = parseInt(shortb * 10000)
  const hd = Math.PI / 180 * angle
  // 中心点
  const x0 = parseInt(centerx * 10000)
  const y0 = parseInt(centery * 10000)
  const Rotate = function(Source, Angle) { // Angle为正时逆时针转动, 单位为弧度
    let A = Math.atan2(Source.Y, Source.X)// atan2自带坐标系识别, 注意X,Y的顺序
    A += Angle// 旋转
    const R = Math.sqrt(Source.X * Source.X + Source.Y * Source.Y)// 半径
    return {
      X: Math.cos(A) * R,
      Y: Math.sin(A) * R
    }
  }
  for (let i = 0 - longlength; i < 0; i++) {
    const si = { X: i, Y: Math.sqrt(1 - Math.pow((0 - i) / longlength, 2)) * shortlength }
    const la = Rotate(si, hd)
    const d = [(la.X + x0) * 0.0001, (la.Y + y0) * 0.0001]
    data.push(d)
  }
  for (let i = 0; i < (longlength + 1); i++) {
    const si = { X: i, Y: Math.sqrt(1 - Math.pow(i / longlength, 2)) * shortlength }
    const la = Rotate(si, hd)
    const d = [(la.X + x0) * 0.0001, (la.Y + y0) * 0.0001]
    data.push(d)
  }
  for (let i = longlength; i > 0; i--) {
    const si = { X: i, Y: 0 - Math.sqrt(1 - Math.pow(i / longlength, 2)) * shortlength }
    const la = Rotate(si, hd)
    const d = [(la.X + x0) * 0.0001, (la.Y + y0) * 0.0001]
    data.push(d)
  }
  for (let i = 0; i > (0 - (longlength + 1)); i--) {
    const si = { X: i, Y: 0 - Math.sqrt(1 - Math.pow(i / longlength, 2)) * shortlength }
    const la = Rotate(si, hd)
    const d = [(la.X + x0) * 0.0001, (la.Y + y0) * 0.0001]
    data.push(d)
  }
  return data
}
// 计算坐标轴最大最小值
export function maxormin(list) {
  const data = {
    minx: 10000,
    miny: 10000,
    maxx: -10000,
    maxy: -10000
  }
  for (let i = 0; i < list.length; i++) {
    if (list[i][0] > data.maxx) {
      data.maxx = parseFloat((parseFloat(list[i][0] + '') + 0.015).toFixed(3))
    }
    if (list[i][1] > data.maxy) {
      data.maxy = parseFloat((parseFloat(list[i][1] + '') + 0.01).toFixed(3))
    }
    if (list[i][0] < data.minx) {
      data.minx = parseFloat((parseFloat(list[i][0] + '') - 0.015).toFixed(3))
      if (data.minx < 0) {
        data.minx = 0
      }
    }
    if (list[i][1] < data.miny) {
      data.miny = parseFloat((parseFloat(list[i][1] + '') - 0.01).toFixed(3))
      if (data.miny < 0) {
        data.miny = 0
      }
    }
  }
  return data
}
// table折行显示
export function DYrenderHeader(h, { column, $index }, index) {
  if (column.label.indexOf('(') > -1) {
    const before = column.label.substring(0, column.label.indexOf('('))
    const after = column.label.substring(column.label.indexOf('('))
    return [h('p', {}, [before]), h('p', {}, [after])]
  }
}
// 校验double5,2
export function check52(value) {
  if (value === null || value.trim().length === 0) {
    return false
  } else {
    if (isNaN(value)) {
      return false
    } else {
      let length1 = 0
      if ((parseFloat(value) + '').indexOf('.') > -1) {
        length1 = (value + '').substring((value + '').indexOf('.') + 1).length
      } else {
        return true
      }
      if (length1 > 2) {
        return false
      } else {
        return true
      }
    }
  }
}
// 校验double5,4
export function check54(value) {
  if (value === null || value.trim().length === 0) {
    return false
  } else {
    if (isNaN(value)) {
      return false
    } else {
      let length1 = 0
      if ((parseFloat(value) + '').indexOf('.') > -1) {
        length1 = (value + '').substring((value + '').indexOf('.') + 1).length
      } else {
        return true
      }
      if (length1 > 4) {
        return false
      } else {
        return true
      }
    }
  }
}
// colorList
export function colorList(index) {
  const colors = ['#009494', '#1D89F3', '#F5A11B', '#2ECC71', '#7D1EA9', '#34495E', '#23C6C8', '#7A1057', '#E25D5D', '#6E7074', '#65A2A7', '#B0A5E0', '#A68C4C',
    '#3D46C1', '#F1D1AF', '#06366E', '#333333', '#788EE6', '#52F1E7', '#2688A6', '#FEF046', '#F5A1C1', '#718497', '#87CFDD', '#CFFE48', '#583A33', '#3DFF9D',
    '#2FCBEF', '#FF0000', '#24973E']
  return colors[index]
}
export function zwnumList(index) {
  const zwnum = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
  return zwnum[index]
}
