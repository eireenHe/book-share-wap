var filters = {
  fixTimeStamp (time) {
    var YYYY = time.getFullYear()
    var MM = (time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1)
    var DD = time.getDate() < 10 ? '0' + time.getDate() : time.getDate()
    var HH = time.getHours() < 10 ? '0' + time.getHours() : time.getHours()
    var mm = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()
    var ss = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds()
    return YYYY + '-' + MM + '-' + DD + ' ' + HH + ':' + mm + ':' + ss
  }
}
export default filters
