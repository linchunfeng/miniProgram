// pages/commentDetail/commentDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comment:[{
        id:12,
        nickName:'一位不愿透露姓名的游客',
        avatarUrl:"",
        content:'南门其实不在南边耶',
        sendtime:'2017-09-08'
    },{
        id: 13,
        nickName: '另一位不愿透露姓名的游客',
        avatarUrl: "",
        content: '南普陀',
        sendtime: '2017-09-08'
    },
    {
        id: 14,
        nickName: '还有一位不愿透露姓名的游客',
        avatarUrl: "",
        content: 'hello world',
        sendtime: '2017-09-08'
    }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  
  },
  //链接到评论页
  goComment:function(){
      wx.navigateTo({
          url: '../comment/comment',
          success: function (res) {
          },
      })
  }
})