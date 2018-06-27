//index.js
//获取应用实例
const app = getApp()
Page({
  //初始化数据
  data: {
    motto: '点击进入',
    userInfo: {},
    // hasUserInfo: false,
     canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  jumpToSecondPage: function () {
    wx.navigateTo({
      url: '/pages/city/city' // bindtap会向上传递父元素冒泡,catchtap不会 redirectTo跳转前的页面移出栈，navigate不会移出
    })
  },  
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo
    })
  },
  //如果已授权

  //获取数据库中回复该用户帖子 的数据，为messageData
  getData: function () {
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
        var num =that.data.messageData.length + that.data.msgData.length - that.data.userData[0].length;
        console.log(num)
           //用户数据库中上次访问消息界面消息的数量少于回复的数量，显示数目
          if (that.data.userData[0].length < that.data.messageData.length+that.data.msgData.length) {
            wx.setTabBarBadge({
              index: 1,
              text: num+""
            })
          }         
      },
      fail: function (res) {
        console.log('fail');
      },
      complete: function (res) {
        console.log('complete');
      }
    })
  },
  //获取楼层回复该用户的的数据msgData,通过msgData.length和messageData.length相加获取当前回复的数据长度
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
      },
      fail: function (res) {
        console.log('fail');
      }
    })
  },
  //添加用户表内数据
  addUser:function(){
    var that =this;
    //通过用户名和头像检测该用户是否已经注册过
    wx.request({
      url: 'https://zerodegreeli.cn/user/ifExists.php',
      data: {
        user: that.data.userInfo.nickName,
        headPath: that.data.userInfo.avatarUrl
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          test:res.data
        })
        if(that.data.test[0]!=null){
          console.log("youle")
        }
        else{
          //如果没注册过，user表内添加该用户数据，看过的回复数length初始0
        wx.request({
          url: 'https://zerodegreeli.cn/user/add.php',
          data: {
            user: that.data.userInfo.nickName,
            headPath: that.data.userInfo.avatarUrl
          },
          success: function (res) {
            console.log("添加成功")
          },
          fail: function (res) {
            console.log('fail');
          }
        })
        }       
      },
      fail: function (res) {
        console.log('fail');
      }
    })
  }, 
  //获取该用户表内的数据
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
        //获取回复用户的信息以及用户上次点击消息所查看到的位置
        that.getData();  
      },
      fail: function (res) {
        console.log('fail');
      },
      complete: function (res) {

      }
    })
  },
  onLoad: function () {
    // var userData = new Array();
    var that =this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            lang:"zh_CN",  //中文返回
            success: function (res) {
              that.setData({
                userInfo: res.userInfo     
              })
              that.getFloor();
              that.getUser();
                      
              that.addUser();                                                     
            }
          })
        }
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: '便捷的城市交流小程序，在城市留下你的情绪和故事吧！',
      path: '/pages/index/index'
    }
  }
})
