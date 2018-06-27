var app = getApp();
 Page({ 
   data: {
     switchChange: false, //按点赞数排序不被选中状态
     show: "none" ,  //隐藏回复弹出框
   },
   showReply:function(e){
     var y = e.currentTarget.dataset.index;
     var that =this;
     console.log(this.data.messageData[y].id)
      wx.navigateTo({
        url: '/pages/reply/reply?id=' + this.data.messageData[y].id ,
      })
   },
   //是否选中按点赞数排序
   switchChange: function (e) {
    this.setData({
      switchChange:e.detail.value 
    }) 
    this.getData();      
   },
   
//获取数据库城市表的内容
  getData: function () {
    var that =this;
    wx.request({
      url: 'https://zerodegreeli.cn/message/message.php',
      //传入按时间排序还是按点赞数排序以及城市
      data: {
        switchChange:that.data.switchChange,
        city: that.data.city
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      //获取返回的对应城市信息的数组
      success: function (res) {
        console.log(res.data)
        that.setData({
          messageData: res.data
        })
      },
      fail: function (res) {
        console.log('fail');
      },
      complete: function (res) {
        console.log('complete');
      }
    })
  },  
    //  data: {
    //     msgData:[] 
    // },
    //获取用户发送的信息
     changeInputValue(ev){
        this.setData({
            inputVal:ev.detail.value
     })
   },  
   //删除留言
   DelMsg(ev){
        var n= ev.target.dataset.index; 
    //     console.log(this.data.msgData);
    //     console.log(this.data.msgData[n].msg);
    //     var message = this.data.msgData[1].msg;
    //  var list = this.data.msgData;   
          var that =this;  
          wx.showModal({
            title: '提示',
            content: '确认删除吗',
            //传入后台删除数据
            success: function (res) {
              if(res.confirm){
                wx.request({
                  url: 'https://zerodegreeli.cn/message/delete.php',
                  data: {
                    city: that.data.city,
                    user: that.data.userInfo.nickName,
                    time: that.data.messageData[n].time
                    //  msg: that.data.messageData[n].message
                  },
                  method: 'GET',
                  header: {
                    'content-type': 'application/json' // 默认值
                  },
                  //返回删除后的数据
                  success: function (res) {
                    console.log(res.data)
                    that.getData();
                  },
                  fail: function (res) {
                    console.log('fail');
                  },
                  complete: function (res) {
                    console.log('complete');
                  }
                })
              }
            }
          })    
         
    //      list.splice(n, 1);  //删除数组第n位元素，也就是第n+1个 
    //      wx.setStorage({
    //        key: 'messages',
    //        data: list,
    //      })     
    //  this.setData({
    //          msgData:list
    //  });
     this.getData();
      },
  //添加留言
   sendMsg(){     
     if(this.data.inputVal==null){
       wx.showToast({
         title: '留言不能为空哦',
         icon: 'success',
         duration: 2000
       })      
     } 
     else{     
        // var list = this.data.msgData;
        var that =this;
        // list.push({
        //   msg: this.data.inputVal
        // });  
        wx.getSetting({
          success: function (res) {
            if (res.authSetting['scope.userInfo']) {
              // 如果发送时已授权，直接使用，未授权弹出授予权限，获取发送者的用户名
              wx.getUserInfo({
                lang: "zh_CN",
                success: function (res) {
                  that.setData({
                    userInfo:res.userInfo
                  })
                }
              })
            }
            else{
              wx.showToast({
                title: '请授予权限',
                icon: 'success',
                duration: 2000
              })  
            }
          }
        })
        //传入后台添加信息
        wx.request({
          url: 'https://zerodegreeli.cn/message/add.php',
          data: {
            city:that.data.city,
            user: that.data.userInfo.nickName,
            msg: that.data.inputVal,
            num: 0,
            reply:that.data.replyTo,
            headPath:that.data.userInfo.avatarUrl
          },
          method:'GET',
          header:{
            'content-type': 'application/json' // 默认值
          },
          //发送成功显示图标
          success: function (res) {
            console.log(res.data)  
            wx.showToast({
              title: '发送成功',
              icon: 'success',
              duration: 2000
            }) 
            that.setData({
              flag:true
            })
            //重新加载数据
            that.getData();
          //   setTimeout(function () {
          //     wx.redirectTo({
          //       url: '/pages/message/message?id=' + that.data.city  //redirectTO会把跳转之前的移出栈
          //   })  
          // }, 1000)  
          },
          fail: function (res) {
            console.log('fail');
          },
          complete: function (res) {
            console.log('complete');
          }   
        }) 
        // this.onLoad();
        // wx.startPullDownRefresh();        //下拉刷新    
        //发送后设置输入框为空
     this.setData({
             inputVal:''
           }); 
    //  wx.setStorage({
    //    key: 'messages',
    //    data: this.data.msgData,
    //  })           
     }   
   },onLoad: function (options) {
     var flag = false;
     var messageData = new Array();  
    //  var upvoteUser = new Array();
     var that =this;   
      this.setData({   
    //    switchChange:"false",
    //    show:"none",   //隐藏回复弹出框
       city: options.id
    })
     this.getData();
    //  wx.request({
    //    url: 'https://zerodegreeli.cn/message/message.php',
    //    data: {
    //      city: that.data.city
    //    },
    //    method: 'GET',
    //    header: {
    //      'content-type': 'application/json' // 默认值
    //    },
    //    success: function (res) {
    //      console.log(res.data)
    //      console.log(res.data[0].id)
    //      that.setData({
    //        messageData:res.data    
    //      })
    //    },
    //    fail: function (res) {
    //      console.log('fail');
    //    },
    //    complete: function (res) {
    //      console.log('complete');
    //    }
    //  })  
     if (app.globalData.userInfo) {
       this.setData({
         userInfo: app.globalData.userInfo
       })
     } else if (this.data.canIUse) {
       app.userInfoReadyCallback = res => {
         this.setData({
           userInfo: res.userInfo
         })
       }
     } else {
       wx.getUserInfo({
         success: res => {
           app.globalData.userInfo = res.userInfo
           this.setData({
             userInfo: res.userInfo
           })
         }
       })
     }    
      //  wx.getStorage({
      //    key: 'messages',
      //    success: function (res) {
      //      that.setData({
      //         msgData:res.data
      //      })
      //    },
      //    fail: function (res) {
      //      console.log("失败")
      //    }
      //  }) 
      
   },
   onUnload: function () {    
    },
    //分享
   onShareAppMessage: function () {
     return {
       title: '在城市留下你的情绪和故事吧！',
       path: '/pages/index/index'
     }
   }    
  })