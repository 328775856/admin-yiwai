import request from 'libs/js/request.js'
const util = {}
util.getNowFormatDate = (date, type = 'ymdhms') => {
  let seperator1 = '-'
  let seperator2 = ':'
  let seperator3 = '/'
  let month = date.getMonth() + 1
  let strDate = date.getDate()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  if (type === 'ymdhms') {
    let currentdate =
      date.getFullYear() +
      seperator1 +
      month +
      seperator1 +
      strDate +
      ' ' +
      (date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`) +
      seperator2 +
      (date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`) +
      seperator2 +
      (date.getSeconds() > 9 ? date.getSeconds() : `0${date.getSeconds()}`)
    return currentdate
  } else if (type === 'ymd') {
    let currentdate =
      date.getFullYear() + seperator1 + month + seperator1 + strDate
    return currentdate
  } else {
    let currentdate =
      date.getFullYear() + seperator3 + month + seperator3 + strDate
    return currentdate
  }
}
/**
 * 提取七牛云token
 * @param
 * @returns {token}
 */
util.getQNToken = async () => {
  //geyQNToken接口获取uptoken
  const { code, data } = await request.post('getQNToken/v1', data)
  if (code == 10000 || code == '10000') {
    const token = data.uptoken
    return token
  } else {
    return false
  }
}
util._guid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
/**
 * 提取富文本base64数组
 * @param content
 * @returns {base64List}
 */
util.base64List = content => {
  if (content) {
    //匹配base64属性
    if (/src="data/.test(content)) {
      const srcReg = /src="data[\'\"]?([^\'\"]*)[\'\"]?/gi
      var src = content.match(srcReg)
      //获取图片地址
      const t = src[0].replace(/src=/i, '') //去除src=
      const s = t.replace(/"/gi, '') //去除多余的双引号
      console.log(s)
      return s
    }
  } else {
    return false
  }
}
/**
 * base64转二进制文件
 * @param dataURI
 * @returns {Blob}
 */
util.dataURItoBlob = dataURI => {
  var byteString = atob(dataURI.split(',')[1])
  var mimeString = dataURI
    .split(',')[0]
    .split(':')[1]
    .split(';')[0]
  var ab = new ArrayBuffer(byteString.length)
  var ia = new Uint8Array(ab)
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  return new Blob([ab], { type: mimeString })
}

/**
 * debounce函数
 * @param {*} func  实际要执行的函数
 * @param {*} wait  延迟时间
 */
util.debounce = function(func, wait) {
  var timer
  return function() {
    var context = this
    var args = arguments
    clearTimeout(timer)
    timer = setTimeout(function() {
      func.apply(context, args)
    }, wait)
  }
}
util.versions = () => {
  return 'v3.1'
}
export default util
