/**
 * 由于小程序内暂不支持打开对于的审批详情页和待办页面,所以暂不使用
 */
Page({
    data: {
        navTab: ['生产线和设备','日期范围'],
        currentTabIndex:1,//当前tabIndex
        refresh:false,

        sampleID: "",

        cursor:1,
        //用于数组的追加和暂存
        allProject:[],
        //用于渲染页面的数组
        listData:[//日程表 
            /* {
                 "instanceID": "d6f0436a-6392-47ec-853e-e89ee3f19088",
                 "退换货单位": "湖北荆州带钢厂",
                 "退换货名称": "12",
                 "退换货数量": 12,
                 "申请退换时间": "07/21/2019",
                 "checked":false
             },
             {
                 "instanceID": "ff0124ca-f160-432a-bc4f-2e6ea818c64d",
                 "退换货单位": "湖北荆州带钢厂",
                 "退换货名称": "12",
                 "退换货数量": 12,
                 "申请退换时间": "07/21/2019",
                   "checked":false

             },*/

        ],
        
        //当前列表row号
        row:0,
        customerId:"",
        // customerId:35,

        //list向右滑动按钮
        swiptRightButton:[{ type: 'delete', text: '删除', fColor: 'black' }],
        swipeIndex:-1,
        deleteAuthority:false,
        //筛选记录
        showModal:false,
        ProgressLine:
            [
                 /*{
                     "PLineName": "铝轮2线",
                     "PLineId": "8BF88712-9CC8-435D-871D-A6F83551B4DA",
                     "machines": [
                         {
                             "machineIdentification": "201#-全铝加工-铝轮粗加工",
                             "machineID": "6BADCDDD-0FA0-405C-9F83-BC20C4B2FDAE"
                         },

                     ]
                 },
             {
                 "PLineName": "铝轮19线",
                 "PLineId": "946C93C7-8DD0-4160-959B-14636AF30981",
                 "machines": [
                 {
                     "machineIdentification": "1901--2",
                     "machineID": "2B9779E7-A105-4087-88B2-06C6B5A59C5F"
                 },
                 {
                     "machineIdentification": "1902-铝轮加工-切削",
                     "machineID": "DF2D72F7-9952-41BD-BA2C-FD14D8D54D1D"
                 }
                  ]
             },*/

            ],
        ProgressLineIndex:-1,
        value:[0,0],//第一个代表生产线,第二个代表设备
       /* searchEndDate    : new Date().format("yyyy-MM-dd"),
        searchBeginDate  :new Date(new Date()-1000 * 60 * 60 * 24 * 30).format("yyyy-MM-dd"),//前30天*/
        searchEndDate    :"/",
        searchBeginDate  :"/",//前30天
        //当前数据,取消时恢复
        beginDate:"/",
        endDate:"/",
        plineName:"所有",
        machineName: "所有",
        currentValue:[0,0]
    },
    onLoad(query) {
        const t = this;
        //还原,否则会被记忆,但this.setData的渲染数据不会被记忆
        this.data.allProject = [];
        this.data.cursor = 1;

       this.data.customerId = query.customerId;

        // this.data.customerId=35
        //临时,今后通过角色权限来做
        // if (getApp().globalData.username === "刘正" || getApp().globalData.username === "舒印" || getApp().globalData.username === "刘帅") {
        if (getApp().globalData.username === "刘正" || getApp().globalData.username === "舒印" ) {
            this.data.deleteAuthority = true;
        }
        //得到progressLine内容
        const url = getApp().globalData.domain + "/fmSampleRec.php";
        dd.httpRequest({
            url: url,
            method: 'get',
            data: {
                action: 'getProgressLines',
                customerId: query.customerId,
                // customerId: 35,
            },
            dataType: 'json',
            success: (values) => {
                if (values.data.success === true) {
                    //得到生产线和设备数据
                    let ProgressLine = values.data.data.progressLines;
                    ProgressLine.forEach( item => {
                    //     debugger
                        item.machines.unshift({
                            "machineIdentification": "所有",
                            "machineID": ""
                        })
                    })
                    ProgressLine.unshift({"PLineName": "所有",
                        "PLineId": "",
                        "machines": [
                        {
                            "machineIdentification": "所有",
                            "machineID": ""
                        },
                        ]}
                    )

                    t.setData({
                        ProgressLine: values.data.data.progressLines,
                    });
                }
            },
            fail: (res) => {
                dd.alert({'content': JSON.stringify(res)})
            }
        });
        getList(this.data.customerId,this.data.cursor,t);


    },
    onShow() {
        //还原,否则会被记忆,但this.setData的渲染数据不会被记忆
        //refresh为true,如果是从editMachine返回并且对machine或Pline进行了编辑,则重载
        if (this.data.refresh ) {

            const t = this;
            this.data.allProject = [];
            this.data.cursor = 1;
            // this.data.customerId = query.customerId;

            // this.data.customerId=35
            //临时,今后通过角色权限来做
            // if (getApp().globalData.username === "刘正" || getApp().globalData.username === "舒印" || getApp().globalData.username === "刘帅") {
            if (getApp().globalData.username === "刘正" || getApp().globalData.username === "舒印") {
                this.data.deleteAuthority = true;
            }
            //得到progressLine内容
            const url = getApp().globalData.domain + "/fmSampleRec.php";
            dd.httpRequest({
                url: url,
                method: 'get',
                data: {
                    action: 'getProgressLines',
                    // customerId: query.customerId,
                    // customerId: 35,
                },
                dataType: 'json',
                success: (values) => {
                    if (values.data.success === true) {
                        //得到生产线和设备数据
                        let ProgressLine = values.data.data.progressLines;
                        ProgressLine.forEach(item => {
                            //     debugger
                            item.machines.unshift({
                                "machineIdentification": "所有",
                                "machineID": ""
                            })
                        })
                        ProgressLine.unshift({
                                "PLineName": "所有",
                                "PLineId": "",
                                "machines": [
                                    {
                                        "machineIdentification": "所有",
                                        "machineID": ""
                                    },
                                ]
                            }
                        )

                        t.setData({
                            ProgressLine: values.data.data.progressLines,
                        });
                    }
                },
                fail: (res) => {
                    dd.alert({'content': JSON.stringify(res)})
                }
            });
            getList(this.data.customerId, this.data.cursor, t);
        }

    },
    /* onPullDownRefresh() { //下拉刷新
         console.log('onPullDownRefresh', new Date())
         const mythis = this;
         mythis.data.cursor =  1;
         mythis.data.allProject = [];
         getDDInstance( this.data.templateID,this.data.cursor, this.data.start_time,mythis)
         dd.stopPullDownRefresh()

     },*/
    //筛选modal
    searchCondition() {
        this.setData({
            showModal: true,
        })
    },
    resetDate() {
        this.setData({
            searchEndDate    :"/",
            searchBeginDate  :"/",
        })
    },
    onCancel(isShow) {
        this.setData({
            showModal: false,
            value:this.data.currentValue,
            searchEndDate    :this.data.endDate,
            searchBeginDate  :this.data.beginDate,
        });
    },
    onGetSearchList() {
        // this.data.listData=[];
        // getList(this.data.customerId,1,this,plineId,machineId);
       if (this.data.searchBeginDate==='/' && this.data.searchEndDate!=='/' || this.data.searchEndDate==='/' && this.data.searchBeginDate!=='/') {
            dd.alert({content:"日期选择有误."});
            return ;
        }
        const plineNum = this.data.value[0];
        const machineNum =this.data.value[1];
        const plineName = this.data.ProgressLine[plineNum].PLineName;
        const machineName = this.data.ProgressLine[plineNum].machines[machineNum].machineIdentification
        this.setData({
            showModal: false,
            plineName,
            machineName,
            beginDate:this.data.searchBeginDate,
            endDate:this.data.searchEndDate,
            currentValue:this.data.value
        });

        getList(this.data.customerId,1,this);

    },
    onChangePline(e) {
        const firstKey = e.detail.value[0];

        let secondNum ;

        if (this.data.value[0] === firstKey){  //picker的第一键值没变
            secondNum = e.detail.value[1];
        }else{
            secondNum = 0;
        }

        this.setData({
            value:[e.detail.value[0],secondNum],
        })
        console.log("value:"+this.data.value[0]+","+this.data.value[1]);
    },
    changeDate(e) {//异常中,改变日期
        const t =this;
        const type = e.currentTarget.dataset.type;
        let currentDate,target;


        if (type =="begin") {
            currentDate = t.data.searchBeginDate;
            target = "searchBeginDate";

        } else {
            currentDate = t.data.searchEndDate;
            target = "searchEndDate";
        }

        dd.datePicker({
            format: 'yyyy-MM-dd',
            currentDate: currentDate,
            success: (res) => {
                const selectDate = new Date(res.date);

                if (e.currentTarget.dataset.type === 'begin') {
                    if(selectDate > new Date(t.data.searchEndDate)){
                        dd.alert({content:"开始日期不能大于结束日期"})
                        return;
                    }
                }else{
                    if(selectDate < new Date(t.data.searchBeginDate)){
                        dd.alert({content:"结束日期不能小于开始日期"})
                        return;
                    }
                }
                t.setData({
                    [target]:selectDate.format("yyyy-MM-dd")//必须是“yyyy-mm-dd hh:mm” 和“yyyy-mm-dd”规式,要补0
                })

            }
        });

    },
    /**
     * 列表项向左滑动操作
     * @param e
     */
    onRightItemClick(e) {
        // const { type } = e.detail;
        const t = this;
        dd.confirm({
            title: '提示',
            content: '确认删除该记录?请将上传的media进入详情先删除.',
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            success: (result) => {
                if (result.confirm ) {
                    const url = getApp().globalData.domain+'/fmSampleRec.php';
                    // const url = "http://r1w8478651.imwork.net:9998/eapp-corp/fmSampleRec.php?action=deleteSampleRecord"
                    dd.httpRequest({
                        url: url,
                        method: 'post',
                        dataType: 'json',
                        data: {
                            action: "deleteSampleRecord",
                            sampleDataRecID: e.extra,

                        },
                        success: function (res) {
                            if (res.data.success) {
                                let listData = t.data.listData;
                                listData.splice(t.data.swipeIndex, 1);
                                t.setData({
                                        listData,
                                        swipeIndex:-1
                                    }
                                );
                                e.done();//好像真机不执行
                            } else {
                                dd.alert({
                                    content: "删除记录数据失败" + JSON.stringify(res)
                                });
                            }
                        }
                    })
                }
            },
        });
    },
    onSwipeStart(e) {
        this.setData({
            swipeIndex: e.index,
        });
    },
    /**
     * 页面上拉触底事件的处理函数，与点击加载更多做同样的操作
     */
    onReachBottom: function () {
        if (this.data.cursor != null ) {
            console.log("上拉加载");
            var mythis = this;
            dd.showToast({
                type: 'success',
                content: '加载中...',
                duration: 300,
            });
            getList( this.data.customerId,this.data.cursor, mythis)
        }else {
          this.setData({
              cursor:null
          })
        }

    },


    /**
     * 生命周期函数--监听页面卸载
     */
    /*onUnload: function () {

        const that = this
        const pages = getCurrentPages();
        // const currPage = pages[pages.length - 1];   //当前页面
        const prevPage = pages[pages.length - 2];  //上一个页面

        prevPage.setData({
            relevantList: that.data.relevantList

        });
    },*/

    //进入sample数据详情
    onSampleRecDetail(e){
      this.setData({
         row:e.currentTarget.dataset.row,
          refresh:false
       })
       const sampleDataRecID =e.currentTarget.dataset.id;
        dd.navigateTo({
            url: "/page/editSampleRecord/editSampleRecord?sampleDataRecID="+sampleDataRecID+"&customerId="+this.data.customerId
        })
    }
});

/**
 * 获取项目列表
 */
function getList(customerId,cursor, mythis){//plineId生产线Id,machineId机床Id
    const url = getApp().globalData.domain+'/fmSampleRec.php';
    const plineNum = mythis.data.value[0];
    const machineNum =mythis.data.value[1];
    let plineId ="" ;
    let machineId="" ;
    if (mythis.data.ProgressLine.length > 0) {
        plineId = mythis.data.ProgressLine[plineNum].PLineId;
        machineId = mythis.data.ProgressLine[plineNum].machines[machineNum].machineID;
    }
    dd.httpRequest({
        url: url,
        method: 'post',
        dataType: 'json',
        data: {
            action:"getCustomerDataRecList",
            customerId: customerId,
            size:10,
            cursor:cursor,
            plineId,
            machineId,
            beginDate:mythis.data.searchBeginDate,
            endDate:mythis.data.searchEndDate
        },

        success: function (res) {
            if(res.data.success == true) {
                //如果搜出来的结果cursor为空, 就说明后面已经没数据可加载了，所以将state设为0
                if (res.data.nextCursor == null){
                    mythis.data.cursor = null;
                  }else{
                    if (cursor === 1){
                        mythis.data.allProject = res.data.data;
                        // mythis.data.cursor = res.data.nextCursor;
                    } else {
                        //循环将结果集追加到数组后面
                        for (let i = 0; i < res.data.data.length; i++) {
                            mythis.data.allProject.push(res.data.data[i]);
                        }
                        // mythis.data.cursor = res.data.nextCursor;
                    }
                    mythis.setData({
                        listData:mythis.data.allProject,
                        cursor:res.data.nextCursor
                    })
                }
            }else{
                if (res.data.error.errorCode == 401 ) { //无记录
                    // dd.alert({content: '尚无跟踪记录.'})
                    if (plineId || machineId || mythis.data.searchBeginDate!=="/" || mythis.data.searchEndDate!=="/") { //加入筛选
                        mythis.data.allProject = [];

                        dd.showToast({
                            type: 'fail',
                            content: '该筛选条件,没有记录.',
                            duration: 500,
                            success: () => {
                                mythis.setData({
                                    cursor:null,
                                    listData:mythis.data.allProject

                                })
                            },
                        });

                    }else { //无任何数据记录
                        dd.showToast({
                            type: 'fail',
                            content: '无记录',
                            duration: 500,
                            success: () => {
                                dd.navigateBack();
                            },
                        });
                    }
                }else{
                    dd.alert({content:"获取数据列表失败."});

                }

            }
        },
        fail: function (res) {
            dd.alert({content:"获取数据列表失败."+JSON.stringify(res)});
        }
    });
}



