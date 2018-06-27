var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    switchChange: false
  },
  //是否选中显示楼中楼回复
  switchChange: function (e) {
    this.setData({
      switchChange: e.detail.value
    })    
  },
  //设置用户当前所浏览的回复消息位置
  getLength: function () {
    var that = this;
    wx.request({
      url: 'https://zerodegreeli.cn/user/length.php',  
      data: {
        user: that.data.userInfo.nickName,
        headPath: that.data.userInfo.avatarUrl,
        length:that.data.messageData.length+that.data.msgData.length
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        console.log("设置当前位置成功")
      },
      fail: function (res) {
        console.log('fail');
      }     
    })
  },
  //获取回复信息
  getReply:function(){
    var that =this;
  wx.request({
    url: 'https://zerodegreeli.cn/user/select.php',
    data: {
      user: that.data.userInfo.nickName
    },
    method: 'GET',
    header: {
      'content-type': 'application/json' // 默认值
    },
    success: function (res) {
      console.log(res.data)
      that.setData({
        messageData: res.data
      })
      //获取长度
     that.getLength();
    },
    fail: function (res) {
      console.log('fail');
    },
    complete: function (res) {
    }
  })
  },
  //获取楼层回复数据
  getFloor: function () {
    var that = this;
    wx.request({
      url: 'https://zerodegreeli.cn/user/selectFloor.php',
      data: {
        reply: that.data.userInfo.nickName
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          msgData: res.data
        })
        //获取长度
        that.getLength();
      },
      fail: function (res) {
        console.log('fail');
      },
      complete: function (res) {
      }
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
      },
      fail: function (res) {
        console.log('fail');
      },
      complete: function (res) {

      }
    })
  },
  //跳转天气
  cityToWeather: function (event) {
    var cityId = this.data.userData[0].city   //获取所点击的城市
    console.log(cityId)
    wx.navigateTo({
      url: '/pages/weather/weather?id=' + cityId   //跳转，不移出栈
    })
  },
  //点击回复的帖子根据replyId跳转到对应的帖子
click:function(ev){  //view是currentTarget
  wx.navigateTo({
    url: '/pages/reply/reply?id=' + this.data.messageData[ev.currentTarget.dataset.index].replyId
  })
},
//点击楼中楼回复根据replyId跳转到对应的帖子
clickFloor: function (ev) {
  console.log(ev.currentTarget.dataset.index)  
  wx.navigateTo({
    url: '/pages/reply/reply?id=' + this.data.msgData[ev.currentTarget.dataset.index].postId
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.hideTabBarRedDot({
      index: 1,
      success: function () {
        console.log("成功")
      }
    })
    //若已授权获取用户信息
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            lang: "zh_CN",  //中文返回
            success: function (res) {
              that.setData({
                userInfo: res.userInfo
              })
              //获取用户表的数据
              that.getUser();
              //获取回复信息
              that.getFloor();
              that.getReply();             
            }
          })
        }
      }
    })                                      
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
      title: '在城市留下你的情绪和故事吧！',
      path: '/pages/index/index'
    }
  }
})