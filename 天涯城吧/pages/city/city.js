const app = getApp()
Page({
  cityToWeather: function (event) {
    var cityId = event.currentTarget.dataset.cityId    //获取所点击的城市
    console.log(cityId) 
    wx.navigateTo({
      url: '/pages/weather/weather?id='+ cityId   //跳转，不移出栈
    })
  },
  cityEnquire: function (e) {
    this.setData({
      citys: e.detail.value   //用户搜索的城市
    })
  },
  //搜索城市
  select: function (event) {
  wx.navigateTo({
    url: '/pages/weather/weather?id='+this.data.citys  //跳转城市对应的天气
  })
  },
  //获取该用户表内数据，历史城市设置
  getUser: function () {
    var that = this;
    wx.request({
      url: 'https://zerodegreeli.cn/user/selectUser.php',
      data: {
        user: that.data.userInfo.nickName,
        headPath: that.data.userInfo.avatarUrl
      },
      success: function (res) {
        console.log("查询成功")
        that.setData({
          userData: res.data
        })
        //判断用户有没有点击过城市
        if(that.data.userData[0].city=="空"){
          that.setData({
            historyCity:that.data.userInfo.city
          })     
        }
        else{
          that.setData({
            historyCity: that.data.userData[0].city
          }) 
        }
      },
      fail: function (res) {
        console.log('fail');
      }
    })
  },
  onLoad: function () {    
    var that=this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          app.getUserInfo=res.userInfo
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            lang: "zh_CN",
            success: function (res) {
              that.setData({
               userInfo:res.userInfo   //设置用户信息
              })
              that.getUser();//获取用户数据，设置历史城市
            }
          })
        }
      }
    })
  },
  data: {
    //输出热门城市
    rankList: [
      {
        city: "长沙",
        id:"长沙"
      },
      {
        city: "北京",
        id: "北京"
      },
      {
        city: "上海",
        id: "上海"
      },
      {
        city: "广州",
        id: "广州"
      },
      {
        city: "深圳",
        id: "深圳"
      },
      {
        city: "西安",
        id: "西安"
      },
      {
        city: "济南",
        id: "济南"
      },
      {
        city: "郑州",
        id: "郑州"
      },
      {
        city: "武汉",
        id: "武汉"
      },
      {
        city: "天津",
        id: "天津"
      },
      {
        city: "杭州",
        id: "杭州"
      },
      {
        city: "合肥",
        id: "合肥"
      },
      {
        city: "哈尔滨",
        id: "哈尔滨"
      },
      {
        city: "乌鲁木齐",
        id: "乌鲁木齐"
      },
      {
        city: "南京",
        id: "南京"
      },
      {
        city: "重庆",
        id: "重庆"
      },
      {
        city: "黄山",
        id: "黄山"
      },
      {
        city: "长春",
        id: "长春"
      },
      {
        city: "青岛",
        id: "青岛"
      },
      {
        city: "昆明",
        id: "昆明"
      }
    ]
  },
  //分享
  onShareAppMessage: function () {
    return {
      title: '便捷的城市交流小程序，在城市留下你的情绪和故事吧！',
      path: '/pages/index/index',
      success: function (res) {
        console.log("分享成功")
      },
      fail: function (res) {
        console.log(res)
      }
    }
  } 
})