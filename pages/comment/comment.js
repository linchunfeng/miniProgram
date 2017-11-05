// pages/write/write.js
var app = getApp();
var actName = '', phoneNum = '', vcode = '', uid;
var cosUrl = "https://" + "sh" + ".file.myqcloud.com/files/v2/" + "1253953771" + "/" + "source" + "/img"
var cosSignatureUrl = "http://115.159.90.248:8888"

Page({
  data: {
    imageList: [''],
    typeDetail: { id: "", cate_name: "" },
    openId: ''
  },
  onLoad: function (options) {
    this.setData({
      openId: options.id
    })
    // 页面渲染完成
  },
  chooseImage: function () {
    var that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        console.log(res)
        that.setData({
          imageList: res.tempFilePaths
        })
        
      }
    })
  },
  openAlert: function () {
      var that = this
      wx.showModal({
          content: '评论成功',
          showCancel: false,
          success: function (res) {
              if (res.confirm) {
                  console.log('用户点击确定')
              }
          }
      });
  },
  formSubmit: function(e){
    var that = this
    
    var imgName = app.getCurrentTime()
    var imgOr = ''
    if (that.data.imageList[0] != '') imgOr = 'Yes'
    else imgOr = 'No'
    
    var comData = '1 ' + that.data.openId + ' ' + e.detail.value.content + ' ' + imgName + ' ' + imgOr
    
    app.addComment(comData)
    
    if(imgOr == 'Yes'){
      app.uploadImage(that.data.imageList[0],imgName)
    }


  }
})

