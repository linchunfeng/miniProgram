//index.js
//获取应用实例
var app = getApp();
var openId = '';
Page({
    data: {
        //默认尚未开始记录轨迹
        hasTrack:false,
        //用户信息
        userInfo: {},
        //默认未获取地址  
        hasLocation: false ,
        inputShowed: false,
        inputVal: "请选择地点",
        /*markers: [
            {
            iconPath: "../../image/pos2.png",
            id: 0,
            latitude: 24.438325,
            longitude: 118.097416,
            width: 30,
            height: 30
            },
            {
                iconPath: "../../image/plicon.png",
                id: 1001,
                latitude: 24.439311,
                longitude: 118.097416,
                width: 30,
                height: 30
            }
        ],*/
        markers:[],
         test:[
             {
                 addId:1,
                 placeId: 1001,
                 latitude: 24.438311,
                 longitude: 118.097416,
             },
             {
                 addId: 1,
                 placeId: 1002,
                 latitude: 24.439320,
                 longitude: 118.097420,
             }
         ],
        controls:[{
            id:101,
            position:{
                left:5,
                top:90,
                width: 50,
                height: 50
            },
            iconPath:'../../image/leftbtn.png',
            clickable:true
        },
        {
            id:102,
            position:{
                left:5,
                top:90,
                width: 50,
                height: 50
            },
            iconPath:'../../image/rightbtn.png',
            clickable:true
        },
        {
            id: 103,
            position: {
                left: 500,
                top: 90,
                width: 180,
                height: 60
            },
            iconPath: '../../image/centerbtn.png',
            clickable: true
        }
        ],
        polyline: [{
            points: [],
            color: "#f3d142",
            width: 5
        }]
    },
    regionchange(e) {
        console.log(e.type)
    },
    markertap(e) {
        var that = this
        console.log("marker" + e.markerId)
        wx.navigateTo({
            url: '../commentDetail/commentDetail?id='+e.markerId,
            success: function (res) {
            },
        })
    },
    showInput: function () {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function () {
        this.setData({
            inputVal: "",
            inputShowed: false
        });
    },
    clearInput: function () {
        this.setData({
            inputVal: ""
        });
    },
    inputTyping: function (e) {
        this.setData({
            inputVal: e.detail.value
        });
    },
    //获取经纬度,获取用户信息  
    onLoad: function (options) {  
        var that = this
        var test22;
        /*获取有评论的地址 */
        app.getComment('1',
            function (data) {
                console.log(data)
                test22=data;
            }
        )
        console.log(test22[1])
        /*test */
        function MarkerItem(id, latitude, longitude) {
            this.iconPath = "../../image/plicon.png";
            this.id = id;
            this.latitude = latitude;
            this.longitude =longitude;
            this.width = 30;
            this.height = 30;
        }

        for(var index=0;index<that.data.test.length;++index)
        {
            var temp = new MarkerItem(that.data.test[index].placeId, that.data.test[index].latitude, that.data.test[index].longitude)
            that.data.markers.push(temp);
        }
        that.setData({
            markers: that.data.markers
        })
        console.log(that.data.markers);
        /**test */
        wx.getLocation({
            success: function (res) {
                console.log(res)
                that.setData({
                    longitude: res.longitude,
                    latitude: res.latitude
                })
            }
        })
        
        wx.login({
            success: function (res) {
                if (res.code) {
                    wx.request({
                        url: 'https://api.weixin.qq.com/sns/jscode2session',
                        data: {
                            js_code: res.code,
                            appid: 'wxa283cb73dc19bdc8',
                            secret: '8703eba73a3cd42f908dad9da5e0c3f8',
                            grant_type: 'authorization_code'
                        },
                        success: function (data) {
                            openId = data.data.openid
                            console.log(data.data)
                        }
                    })
                } else {
                    console.log('获取用户登录态失败' + res.errMsg)
                }
            }
        }),
        //调整三个按钮位置
        wx.getSystemInfo({
            success: function (res) {
                console.log("手机型号" + res.model)
                console.log(res.pixelRatio)
                console.log(res.windowWidth)
                console.log(res.windowHeight)
                console.log(res.language)
                console.log(res.version)
                //更新数据  
                console.log(that.data.controls)
                that.data.controls[0].position.top = (res.windowHeight) * 0.75+3
                that.data.controls[1].position.top = (res.windowHeight) * 0.75+3
                that.data.controls[2].position.top = (res.windowHeight) * 0.75
                that.data.controls[0].position.left = (res.windowWidth) * 0.05
                that.data.controls[1].position.left = (res.windowWidth) * 0.95-50
                that.data.controls[2].position.left = (res.windowWidth) * 0.50-90
                that.setData({
                    UserSystemInfo: res,
                    controls: that.data.controls
                })

            }
        }) 
        //调用应用实例的方法获取全局数据
        app.getUserInfo(function (userInfo) {
            //更新数据
            that.setData({
                userInfo: userInfo
            })
            console.log(userInfo);
            var usrInfo = openId + ' ' + that.data.userInfo.nickName + ' ' + that.data.userInfo.gender + ' ' + '0 ' + that.data.userInfo.city + '-' + that.data.userInfo.country + ' ' + that.data.userInfo.avatarUrl

            app.addUser(usrInfo);
        })
    },
    //搜索框
    chooseLocation:function(){
        var that=this
        wx.chooseLocation({
            success: function(res) {
                console.log(res)
                that.setData({
                    inputVal: res.name
                })
                that.setData({
                    longitude: res.longitude,
                    latitude: res.latitude,
                    'markers[0].longitude':res.longitude,
                    'markers[0].latitude': res.latitude,
                })
                console.log(that.data.markers);
            },
        })
    },
    getLocation: function (e) {
        console.log(e)
        var that = this
        wx.getLocation({
            success: function (res) {
                console.log(res)
                that.setData({
                    longitude: res.longitude,
                    latitude: res.latitude,
                    inputVal: "请选择地点"
                })
            }
        })
    },  
    goPersonalCenter: function () {
        //关闭当前页面，跳转到应用内的某个页面。
        wx.navigateTo({
            url: '../personalCenter/personalCenter',
            success: function (res) {
            },
        })
    },
    locationChange: function () {
        var that = this
        //改变按钮的样式
        if(that.data.hasTrack==false)
        {
            that.data.controls[2].iconPath = '../../image/endbtn.png';
            that.setData({
                controls: that.data.controls,
                hasTrack:true
            })
            //每隔两秒，生成一个新的坐标
            for(var index=0;index<5;++index)
            {
                //setTimeout(function () {
                    wx.getLocation({
                        success: function (res) {
                            function PointItem(latitude, longitude) {
                                this.latitude = latitude;
                                this.longitude = longitude;
                            }
                            var temp = new PointItem(res.latitude + 1 * index, res.longitude + 2 * index)
                            console.log(temp)
                            that.data.polyline[0].points.push(temp);
                            that.setData({
                                polyline: that.data.polyline
                            })
                        }
                    })
                //}.bind(that), 2000)
            }
            /*setInterval(function () {
                    wx.getLocation({
                        success: function (res) {
                            function PointItem(latitude, longitude) {
                                this.latitude = latitude;
                                this.longitude = longitude;
                            }
                            var temp = new PointItem(res.latitude + 0.00003 * index, res.longitude + 0.000005 * index)
                            console.log(temp)
                            that.data.polyline.points.push(temp);
                            that.setData({
                                polyline: that.data.polyline
                            })
                            
                            console.log(that.data.polyline);
                            index++;
                    }
                })
            }, 3000)*/
        }
        else{
            that.data.controls[2].iconPath = '../../image/centerbtn.png';
            that.setData({
                controls: that.data.controls,
                hasTrack: false
            })
        }
        /*setInterval(function () {
            wx.getLocation({
                success: function (res) {
                    that.setData({
                        latitude: res.latitude,
                        longitude: res.longitude,
                        polyline: [{
                            points: [{
                                longitude: res.longitude,
                                latitude: res.latitude,
                            },{
                                    longitude: res.longitude + 0.0003,
                                    latitude: res.latitude + 0.0005,
                            }],
                            color: "#f3d142",
                            width: 5
                        }]
                    })
                    /*console.log(that.data.polyline.color)
                    that.polyline.points.push({
                        longitude: res.longitude+0.00003,
                        latitude: res.latitude+0.000005,
                    })*//*
                    index++
                    console.log("test"+index)
                }
            })
        }, 3000)*/
    },
    //三个按钮
    controltap(e) {
        var that=this
        if (e.controlId == 101) {
            that.getLocation();
        }
        if (e.controlId == 102) {
            that.goPersonalCenter();
        }
        if (e.controlId == 103) {
            that.locationChange();
        }
        console.log(e.controlId)
    }
})
