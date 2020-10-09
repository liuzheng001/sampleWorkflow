Date.prototype.format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
//百度坐标转高德（传入经度、纬度）
function bd_decrypt(bd_lng, bd_lat) {

    var X_PI = Math.PI * 3000.0 / 180.0;

    var x = bd_lng - 0.0065;

    var y = bd_lat - 0.006;

    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);

    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);

    var gg_lng = z * Math.cos(theta);

    var gg_lat = z * Math.sin(theta);
    return {lng: gg_lng, lat: gg_lat}
}

//高德坐标转百度（传入经度、纬度）
function bd_encrypt(gg_lng, gg_lat) {
    var X_PI = Math.PI * 3000.0 / 180.0;

    var x = gg_lng, y = gg_lat;

    var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * X_PI);

    var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * X_PI);

    var bd_lng = z * Math.cos(theta) + 0.0065;

    var bd_lat = z * Math.sin(theta) + 0.006;

    return {

        bd_lat: bd_lat,

        bd_lng: bd_lng

    };
}
/*//内网穿透工具介绍:
// https://open-doc.dingtalk.com/microapp/debug/ucof2g
//替换成开发者后台设置的安全域名
// let domain = "http://47.103.63.213/eapp-corp";
let domain = "http://r1w8478651.imwork.net:9998/eapp-corp";
//test git,回复
let url = domain + '/login.php'; */

let development = false; //开发环境为true,工厂环境为false,工厂环境服务器是47.103.63.213
let domain,applicationServer;
if (development===true){
    domain = "http://r1w8478651.imwork.net:9998/eapp-corp";
    applicationServer = "http://r1w8478651.imwork.net:9998/corp_demo_php-master/"
} else{
    domain = "http://47.103.63.213/eapp-corp";
    // domain = "https://www.ckkj.net.cn/eapp-corp";//阿里云已安装ssl证书,已知错误getFMmessage时,第一次不能得到customer清单,第二次可以,原因不明
    applicationServer = "https://filemaker.ckkj.net.cn:8890/corp_php-master/"
}
let url = domain + '/login.php';

App({  
  onLaunch(options) {
    console.log('App Launch', options);
    console.log('getSystemInfoSync', dd.getSystemInfoSync());
    console.log('SDKVersion', dd.SDKVersion);
        
    //调试关闭
    this.globalData.corpId = options.query.corpId;

    //调试打开
    // this.globalData.corpId ='ding1fdec36666e1349d35c2f4657eb6378f' ;
    
    //调试关闭，不调用后台
    this.loginSystem();
  }, 
  onShow() { 
  // dd.alert({content:'应用打开了'});
  //   console.log('App Show');
  },
  onHide() {
  /*dd.alert({content:'应用到后台了'});
    console.log('App Hide');*/
  },
  onError(msg){
      console.log(msg);
  },
  globalData: {
    applicationServer:applicationServer,
    domain:domain,
    corpId:'',
    username:'',
    userId:'',
    departments:[],
    flashScheduleFlag:false,//刷新schedule标志,只有在schedule.js提交才能更改为true

  },
  loginSystem() {
      // dd.showLoading();
      dd.getAuthCode({
            success: (res) => {
                // dd.alert({content: "step1"+res.authCode});
                dd.httpRequest({
                    url: url,
                    method: 'POST',
                    data: {
                        authCode: res.authCode
                    },
                    dataType: 'json',
                    success: (res) => {
                        // dd.alert({content: "step2"});
                        console.log('success----', res)
                        let userId = res.data.result.userId;
                        let userName = res.data.result.userName;
                        const app = getApp();
                        app.globalData.userId = userId;
                        app.globalData.username = userName;
                        app.globalData.departments = res.data.result.departments;
                        // 调试时关闭getworkflow
                      /* dd.switchTab({ //日历
                                url: '/page/index'
                            })*/
                        dd.getStorage({
                            key: 'tabbarIndex',
                            success: function (res) {
                                //不存在samleRecord key时，res.data为null
                                if (res.data == null || res.data.tabbarIndex === 1) {
                                    dd.switchTab({
                                        url: '/page/trialRecord/trialRecordList/trialRecordList'
                                    })
                                } else {
                                    dd.switchTab({
                                        url: '/page/selectCustomer/selectCustomer'
                                    })

                                }
                            },
                            fail: function () {

                            },
                        })
                    },
                    fail: (res) => {
                        console.log("httpRequestFail---", res)
                        dd.alert({content: JSON.stringify(res)});
                    },
                    complete: (res) => {
                        // dd.hideLoading();
                    }

                });
            },
          fail: (err)=>{
              dd.alert({content: JSON.stringify(err)})
          }
        })
    },
});