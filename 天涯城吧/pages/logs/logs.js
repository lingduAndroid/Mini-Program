// //logs.js
// const util = require('../../utils/util.js')


Page({
  data: {
  }, 
  return: function (event) {
    wx.redirectTo({
      url: '/pages/city/city'
    })
  },
  onLoad: function () {

  },
  onShareAppMessage: function () {
    return {
      title: '最简单便捷的天气查看小程序，给家里一份问候，给远方的TA一份问候吧',
      path: '/pages/index/index'
    }
  }
})
