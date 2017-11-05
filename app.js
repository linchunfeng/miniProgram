//app.js
var cosUrl = "https://" + "sh" + ".file.myqcloud.com/files/v2/" + "1253953771" + "/" + "source" + "/img"
var cosSignatureUrl = "http://115.159.90.248:8888"
App({
    onLaunch: function () {
        //调用API从本地缓存中获取数据
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

    },

    getUserInfo: function (cb) {
        var that = this
        if (this.globalData.userInfo) {
            typeof cb == "function" && cb(this.globalData.userInfo)
        } else {
            //调用登录接口
            wx.getUserInfo({
                withCredentials: false,
                success: function (res) {
                    that.globalData.userInfo = res.userInfo
                    typeof cb == "function" && cb(that.globalData.userInfo)
                }
            })
        }
    },

    //上传图片，需要提供图片路径以及图片名（图片名由当前时间构成
    uploadImage: function (path, name) {
        wx.request({
            url: cosSignatureUrl,
            success: function (cosRes) {
                // 头部带上签名，上传文件至COS
                wx.uploadFile({
                    url: cosUrl + '/' + name,
                    filePath: path,
                    header: { 'Authorization': cosRes.data },
                    name: 'filecontent',
                    formData: { op: 'upload' },
                    success: function (uploadRes) {
                    },
                    fail: function (e) {
                        console.log('上传图片失败' + e);
                    }
                })
            },
            fail: function (e) {
                console.log('cos鉴权失败');
            }
        })
    },
    downloadImage: function (name, re) {
        wx.request({
            url: cosSignatureUrl,
            success: function (cosRes) {
                wx.downloadFile({
                    url: 'http://source-1253953771.cossh.myqcloud.com/img' + '/' + name,
                    header: { 'Authorization': cosRes.data },
                    success: function (res) {
                        re(res.tempFilePath)
                    },
                    fail: function (e) {
                        console.log('下载图片失败' + e);
                    }
                })
            },
            fail: function (e) {
                console.log('cos鉴权失败');
            }
        })
    },
    //增加或更新用户，当前用户不存在时增加，存在时更新，'openid nickName gender age city-country 头像链接'
    addUser: function (usrInfo) {
        wx.request({
            url: 'http://115.159.90.248:8080/getuserinfo/addUser',
            data: {
                userData: usrInfo
            },
            success: function (data) {
                console.log('增加/更新用户成功 ' + data.data)
            },
            fail: function (data) {
                console.log('X增加/更新用户失败 ' + data.data)
            }
        })
    },
    //增加评论,格式'addId openid content imgName 是否上传图片[Yes/No]'
    addComment: function (comData) {
        wx.request({
            url: 'http://115.159.90.248:8080/getuserinfo/addComment',
            data: {
                commentData: comData
            },
            success:function(){
                wx.showModal({
                    content: '评论成功',
                    showCancel: false,
                    success: function (res) {
                        if (res.confirm) {
                            console.log('用户点击确定')
                            wx.redirectTo({
                                url: '../commentDetail/commentDetail?id=1001',
                                success: function (res) {
                                },
                            })
                        }

                    }
                });
            },
            fail: function (data) {
                console.log('评论发送失败 ' + data.data)
            }
        })
    },
    //增加路径，格式'openid longitude latitude'
    addRoute: function (routeData) {
        wx.request({
            url: 'http://115.159.90.248:8080/getuserinfo/addRoute',
            data: {
                routeData: routeData
            },
            fail: function (data) {
                console.log(routeData + '保存失败 ' + data.data)
            }
        })
    },
    //由openid获得用户信息
    getUser: function (openid, res) {
        wx.request({
            url: 'http://115.159.90.248:8080/getuserinfo/getUser',
            data: {
                openid: openid
            },
            success: function (data) {
                console.log('获取用户信息成功 ' + data.data)
                //res(data.data)
            },
            fail: function (data) {
                console.log('X获取用户信息失败 ' + data.data)
            }
        })
    },
    //由addId获得某范围内的所有地点
    getComment: function (addId, res) {
        wx.request({
            url: 'http://115.159.90.248:8080/getuserinfo/getComment',
            data: {
                addId: addId
            },
            success: function (data) {
                console.log('获取地点成功 ' + data.data)
                res(data.data)
            },
            fail: function (data) {
                console.log('X获取地点失败 ' + data.data)
            }
        })
    },
    //由placeId获取某地点所有评论
    getCommentDetail: function (placeId, res) {
        wx.request({
            url: 'http://115.159.90.248:8080/getuserinfo/getCommentDetail',
            data: {
                placeId: placeId
            },
            success: function (data) {
                console.log('获取评论成功 ' + data.data)
                res(data.data)
            },
            fail: function (data) {
                console.log('X获取评论失败 ' + data.data)
            }
        })
    },
    //通过openid获得路径
    getRoute: function (openid, res) {
        wx.request({
            url: 'http://115.159.90.248:8080/getuserinfo/getRoute',
            data: {
                openid: openid
            },
            success: function (data) {
                console.log('获取' + openid + '路径成功 ' + data.data)
                res(data.data)
            },
            fail: function (data) {
                console.log('X获取' + openid + '路径失败 ' + data.data)
            }
        })
    },
    //用于返回当前时间的函数，返回值为String,格式已确定
    getCurrentTime: function () {
        var date = new Date();
        var year = date.getFullYear(); //获取当前年份
        var mon = date.getMonth() + 1; //获取当前月份
        var da = date.getDate(); //获取当前日
        var h = date.getHours(); //获取小时
        var m = date.getMinutes(); //获取分钟
        var s = date.getSeconds(); //获取秒
        var imgName = year + '-' + mon + '-' + da + ' ' + h + ':' + m + ':' + s;
        return imgName
    },
    globalData: {
        userInfo: null
    }
})
