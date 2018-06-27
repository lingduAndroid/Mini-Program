var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    switchChange: false,
    show: "none",
    showFloor:"none",
    // replyFloor:false,
    showMsg:false,
    upvote: false, //回复没点过赞
    upvoteId: [] ,
    upvoteBigId: [],
    upvoteBig:false//帖子没点过赞
  },
  //还没授权再次弹出授权
  getSetting:function(){
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 如果发送时已授权，直接使用，未授权弹出授予权限，获取发送者的用户名
          wx.getUserInfo({
            lang: "zh_CN",
            success: function (res) {
              that.setData({
                userInfo: res.userInfo
              })
            }
          })
        }
        else {
          wx.showToast({
            title: '请授予权限',
            icon: 'success',
            duration: 2000
          })
        }
      }
    })
  },
  //楼中楼回复
  replyFloor:function(ev){
    this.setData({
      showFloor: "inline",
      replyFloorIndex:ev.currentTarget.dataset.index
    })
  },
  cancelModal:function(){
     this.setData({
       showMsg:false
     })
  },
  //取消
  cancelFloor: function () {
    this.setData({
      showFloor: "none"
    })
  },
  //楼中楼确认回复执行的函数  
  confirmFloor: function () {
    this.setData({
      showFloor: "none"    //设置回复框隐藏
    })
    var that = this;
    if (this.data.inputVal == null) {
      wx.showToast({
        title: '留言不能为空哦',
        icon: 'success',
        duration: 2000
      })
    }
    else { 
      //楼层表内添加数据
      wx.request({
        url: 'https://zerodegreeli.cn/floor/add.php',
        data: {
          replyId: that.data.floorData[that.data.replyFloorIndex].replyId,
          user: that.data.userInfo.nickName,
          msg: that.data.inputVal,
          num: 0,
          reply: that.data.floorData[that.data.replyFloorIndex].user,
          postId: that.data.replyId
        },
        method: 'GET',
        header: {
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
            flag: true,  
            showMsg: false,          
            inputVal: ''
          })
          //重新加载数据
          // that.getFloor();
        },
        fail: function (res) {
          console.log('fail');
        },
        complete: function (res) {
          console.log('complete');
        }
      })
    }
  },
  //根据页面跳转传来的id渲染帖子信息
  select:function(){
    var that =this;
    wx.request({
      url: 'https://zerodegreeli.cn/reply/select.php',
      data: {
        replyId: that.data.replyId
      },
      success: function (res) {
        that.setData({
          msg: res.data
        })
      //从首页消息界面点击帖子已被删除时执行
        if(res.data[0]==null){ 
          wx.showToast({
            title: '帖子已被删除',
            icon: 'success',
            duration: 2000
          }) 
          setTimeout(function () {
            wx.redirectTo({
              url: '/pages/city/city' //1秒后自动跳转
            })
          }, 1000) //延迟时间 这里是1秒 

        }
        that.getData();
      },
      fail: function (res) {
        console.log('fail');
      },
      complete: function (res) {
        console.log('complete');
      }
    })
  },
  //获取数据库回复帖子的内容,设置为messageData
  getData: function () {
    var that = this;
    wx.request({
      url: 'https://zerodegreeli.cn/reply/message.php',
      data: {
        switchChange: that.data.switchChange,
        replyId:that.data.replyId
      },
      success: function (res) {
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
  },//获得数据库中回复楼层的内容，设置为floorData 
  getFloor:function(ev){
    var that = this;
    this.setData({
      showMsg:true,
      a: ev.currentTarget.dataset.index
    })
    wx.request({
      url: 'https://zerodegreeli.cn/floor/message.php',
      data: {
        replyId: this.data.messageData[this.data.a].id
      },
      success: function (res) {
        that.setData({
          floorData: res.data
        })
      },
      fail: function (res) {
        console.log('fail');
      },
      complete: function (res) {
      }
    })
  },
  //是否选中按点赞数排序
  switchChange: function (e) {
    this.setData({
      switchChange: e.detail.value
    })
    this.getData();
  },
  //获取用户发送的信息
  changeInputValue(ev) {
    this.setData({
      inputVal: ev.detail.value
    })
  },
  //在帖子下回复,往messageData里加数据
  sendMsg() {
    if (this.data.inputVal == null) {
      wx.showToast({
        title: '留言不能为空哦',
        icon: 'success',
        duration: 2000
      })
    }
    else {
      var that = this; 
      this.getSetting();
      //传入后台添加信息
      wx.request({
        url: 'https://zerodegreeli.cn/reply/add.php',
        data: {
          replyId: that.data.replyId,
          user: that.data.userInfo.nickName,
          msg: that.data.inputVal,
          num: 0,
          reply:that.data.msg[0].user,
          // reply: undefined,
          headPath:that.data.userInfo.avatarUrl
        },
        method: 'GET',
        header: {
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
            flag: true
          })
          //重新加载数据
          that.getData();
          
        },
        fail: function (res) {
          console.log('fail');
        },
        complete: function (res) {
          console.log('complete');
        }
      })    
      //发送后设置输入框为空
      this.setData({
        inputVal: ''
      });      
    }
  },
  //添加回复
  sendReply() {
    if (this.data.inputVal == null) {
      wx.showToast({
        title: '回复不能为空哦',
        icon: 'success',
        duration: 2000
      })
    }
    else {
      var that = this;
      this.getSetting();  //查看是否授权
      // if (this.data.replyFloor){
      //    this.setData({
      //      reply: this.data.messageData[this.data.replyIndex].user
      //    })
      // }else{
      //   this.setData({
      //     reply: this.data.msg[0].user
      //   })
      // }

      //传入后台添加信息，往floorData里加数据
      wx.request({
        url: 'https://zerodegreeli.cn/floor/add.php',
        data: {
          replyId: that.data.messageData[that.data.replyIndex].id,
          user: that.data.userInfo.nickName,
          msg: that.data.inputVal,
          num: 0,
          reply: this.data.messageData[this.data.replyIndex].user,
          postId:that.data.replyId
        },
        method: 'GET',
        header: {
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
            flag: true
          })
          //重新加载数据
          that.getData();
          that.getFloor();
        },
        fail: function (res) {
          console.log('fail');
        },
        complete: function (res) {
          console.log('complete');
        }
      })
    }
  },
  //回复
  reply: function (ev) {
    //显示回复框，获取回复的用户名
    this.setData({
      replyIndex: ev.target.dataset.index,
      show: "inline",
      // replyFloor: true,
      replyPerson: this.data.messageData[ev.target.dataset.index].user
    })
  },
  //取消
  cancel: function () {
    this.setData({
      show: "none",
      replyFloor: false,
    })
  },
  //确认回复帖子执行的函数  
  confirm: function () {
    this.setData({
      show: "none" //设置回复框隐藏      
    })
    var that = this;
    if (this.data.inputVal == null) {
      wx.showToast({
        title: '留言不能为空哦',
        icon: 'success',
        duration: 2000
      })
    }
    else {  
      //调用sendReply()   
      this.sendReply();

      if(this.data.messageData[this.data.replyIndex].userReply=="undefined")
      {
        //改变回复用户和信息传入后台
        wx.request({
          url: 'https://zerodegreeli.cn/reply/reply.php',
          data: {
            id: that.data.messageData[this.data.replyIndex].id,
            messageReply: that.data.inputVal,
            userReply: that.data.userInfo.nickName
          },
          method: 'GET',
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            console.log(res.data)
            that.getData();
          },
          fail: function (res) {
            console.log('fail');
          }
        })
      }
      //发送后设置输入框为空
      this.setData({
        inputVal: '',
        replyFloor: false
      });
    }
    // this.sendMsg();
  },
  //点赞
  upvote: function (ev) {
    console.log(ev.target.dataset.index)
    var a = ev.target.dataset.index;  //获取用户点击下标
    var that = this;
    this.data.messageData[a].number *= 1;//字符串转成数字 
    //将下标对应的后台唯一主键id存入数组储存在本地，如果已点过赞就不再加
    for (var i = 0; i < this.data.upvoteId.length; i++) {
      console.log(this.data.upvoteId[i])
      if (this.data.upvoteId[i].id == this.data.messageData[a].id) {
        wx.showToast({
          title: '你已经点过赞了噢',
          icon: 'success',
          duration: 1000
        })
        this.setData({
          upvote: true
        })
        break;
      }
    }
    //如果没有点过赞
    if (!this.data.upvote) {
      this.data.messageData[a].number += 1;
      //数组存储在本地 
      var list = this.data.upvoteId;
      list.push({
        id: this.data.messageData[a].id
      });
      wx.setStorage({
        key: "upvoteId",
        data: list
      })
      //改变点赞数传入后台
      wx.request({
        url: 'https://zerodegreeli.cn/reply/number.php',
        data: {
          num: that.data.messageData[a].number,
          time: that.data.messageData[a].time,
          user: that.data.messageData[a].user
        },
        method: 'GET',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data)
          that.getData();
        },
        fail: function (res) {
          console.log('fail');
        }
      })
    }
    else {
      this.setData({
        upvote: false
      })
    }
  },
  //帖子点赞
  upvoteBig: function () {
    var that = this;
    this.data.msg[0].number *= 1;//字符串转成数字 
    //将下标对应的后台唯一主键id存入数组储存在本地，如果已点过赞就不再加
    for (var i = 0; i < this.data.upvoteBigId.length; i++) {
      if (this.data.upvoteBigId[i].id == this.data.msg[0].id) {
        wx.showToast({
          title: '你已经点过赞了噢',
          icon: 'success',
          duration: 1000
        })
        this.setData({
          upvoteBig: true
        })
        break;
      } 
    } 
    //如果没有点过赞
    if (!this.data.upvoteBig) {
      this.data.msg[0].number += 1;
      var list = this.data.upvoteBigId;
      list.push({
        id: this.data.msg[0].id
      });
      wx.setStorage({
        key: "upvoteBigIds",
        data: list
      })
      //改变点赞数传入后台
      wx.request({
        url: 'https://zerodegreeli.cn/message/number.php',
        data: {
          num: that.data.msg[0].number,
          time: that.data.msg[0].time,
          user: that.data.msg[0].user
        },
        method: 'GET',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data)
          that.select();
        },
        fail: function (res) {
          console.log('fail');
        }
      })
    }
    else {
      this.setData({
        upvote: false
      })
    }
  },
  //删除留言
  DelMsg(ev) {
    var n = ev.target.dataset.index;
    //     console.log(this.data.msgData);
    //     console.log(this.data.msgData[n].msg);
    //     var message = this.data.msgData[1].msg;
    //  var list = this.data.msgData;   
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认删除吗',
      //传入后台删除数据
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://zerodegreeli.cn/reply/delete.php',
            data: {
              replyId: that.data.replyId,
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
    this.getData();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //跳转到该界面带入点击信息的id设置为replyId
    this.setData({
      replyId:options.id
    })
    var that = this;  
    var messageData = new Array();
    //获取本地存储的已点赞的数组
     wx.getStorage({
       key: 'upvoteId',
       success: function (res) {
         console.log(res.data)
         that.setData({
           upvoteId: res.data
         })
       }, fail: function (res) {
         console.log("失败")
       }
     }) 
     //获取本地存储的已点赞的帖子id
     wx.getStorage({
       key: 'upvoteBigIds',
       success: function (res) {
         console.log(res.data)
         that.setData({
           upvoteBigId: res.data
         })
       }, fail: function (res) {
         console.log("失败")
       }
     })
    this.select(); //帖子数据设置为msg
    //获取用户信息
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