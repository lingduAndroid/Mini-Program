var app=getApp();
Page({
  message: function (event) {
    wx.navigateTo({
      url: '/pages/message/message?id='+this.data.weatherData.location //跳转到消息界面
    })
  },
  //修改用户城市记录
  correctCity:function(){
    var that =this;
  wx.request({
    url: 'https://zerodegreeli.cn/user/correctCity.php',
    data: {
      city: that.data.city,
      user: that.data.userInfo.nickName,
      headPath: that.data.userInfo.avatarUrl
    },
    success: function (res) {
      console.log("修改成功")
    },
    fail: function (res) {
      console.log('fail');
    }
  })
  },
  onLoad: function (options) {
    console.log(options.id)
    this.setData({
      city:options.id  //设置城市
    })
    var that = this
    //获取用户信息
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
       this.correctCity();
    }
    wx.request({
      url: 'https://free-api.heweather.com/s6/weather/forecast?key=ec5380e032e44400897037b514433e0d&location=' + options.id , //事件跳转时从city传过来的id值，和风天气API使用规范
      header: {
        "content-type": "json" //解析类型json，默认json
      },
      success: function (res) {
        //当搜索不存在的城市时
        if (res.data.HeWeather6[0].status=="unknown city"){
          wx.navigateTo({
            url: '/pages/logs/logs'   //接口get城市options.id无法识别时,status值为unknown city
          }) 
          setTimeout(function () {
            wx.redirectTo({
                 url: '/pages/city/city' //2秒后自动跳转
                })
          }, 2000) //延迟时间 这里是2秒 
                     
        }else{
        console.log(res.data.HeWeather6[0].daily_forecast)
        console.log(res.data.HeWeather6[0].basic)
        console.log(res.data)  //打印接口返回的数据
        that.setData({
          weather: res.data.HeWeather6[0].daily_forecast,
          weatherData: res.data.HeWeather6[0].basic,         
          swiperList: [
     {
              date: res.data.HeWeather6[0].daily_forecast[0].date,
              weatherTmp: res.data.HeWeather6[0].daily_forecast[0].tmp_min + "到" + res.data.HeWeather6[0].daily_forecast[0].tmp_max,
              weatherCond: res.data.HeWeather6[0].daily_forecast[0].cond_txt_d + "转" + res.data.HeWeather6[0].daily_forecast[0].cond_txt_n,
              weatherWind: res.data.HeWeather6[0].daily_forecast[0].wind_dir + ":" + res.data.HeWeather6[0].daily_forecast[0].wind_sc //第一天的天气信息
     },
     {
       date: res.data.HeWeather6[0].daily_forecast[1].date,
       weatherTmp: res.data.HeWeather6[0].daily_forecast[1].tmp_min + "到" + res.data.HeWeather6[0].daily_forecast[1].tmp_max,
       weatherCond: res.data.HeWeather6[0].daily_forecast[1].cond_txt_d + "转" + res.data.HeWeather6[0].daily_forecast[1].cond_txt_n,
       weatherWind: res.data.HeWeather6[0].daily_forecast[1].wind_dir + ":" + res.data.HeWeather6[0].daily_forecast[1].wind_sc  //第二天
        },
     {
       date: res.data.HeWeather6[0].daily_forecast[2].date,
       weatherTmp: res.data.HeWeather6[0].daily_forecast[2].tmp_min + "到" + res.data.HeWeather6[0].daily_forecast[2].tmp_max,
       weatherCond: res.data.HeWeather6[0].daily_forecast[2].cond_txt_d + "转" + res.data.HeWeather6[0].daily_forecast[2].cond_txt_n,
       weatherWind: res.data.HeWeather6[0].daily_forecast[2].wind_dir + ":" + res.data.HeWeather6[0].daily_forecast[2].wind_sc
     }
          ]
        })    
        wx.hideNavigationBarLoading() //隐藏加载图标
        }
      },
      fail: function () {
        console.log("请求失败")
      },
      complete: function () {

      }
    })
    wx.request({
      url: 'https://free-api.heweather.com/s6/weather/now?key=ec5380e032e44400897037b514433e0d&location=' + options.id, //事件跳转时从city传过来的id值，和风天气API使用规范，可以去官网查看
      header: {
        "content-type": "json" //解析类型json，默认json
      },
      success: function (res) {
        console.log("now")
        console.log(res.data)
        that.setData({       
               weatherNow:res.data.HeWeather6[0].now.tmp    
      })
      },
     fail: function () {
      console.log("请求失败")
    },
  complete: function () {

  } 
  })
    wx.showNavigationBarLoading()  //显示导航条加载
  },
  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '实时天气查看，给家里一份问候，在城市留下你的情绪和故事吧！',
      path: '/pages/index/index'
    }
  }
})