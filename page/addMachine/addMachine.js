Page({
    data: {
        showModal: false,//显示modal
        addPline: true,//true为增加生产线,false为编辑生产线

        customerId: "",

        /*PLines: [

            /!* {
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
            },*!/
        ],
        PLinesIndex: -1,*/

        PLineId:"",

        PLineName: "",
        PLineMachine: "",
        PLineProduct: "",
        PLinePosition: "",

        machineName: "",
        machineNum: "",
        machineStation: "",
        remark: "",
        volume: null,
        picture: "",//url
        position: "",

    },
    onLoad(query) {//query包括customerId,PLines,PLinesIndex,showModal
        // updataPLines(this,query.customerId);
        console.log(JSON.stringify(query))
        if (!query.showModal) { //建立新设备
            this.setData({
                // PLines: JSON.parse(query.PLines),
                PLineId: query.PLineId,
                customerId: query.customerId,
                PLineName:query.PLineName,

            });
        } else if (query.showModal === "true") { //建立新生产线
            this.setData({
                showModal: true,
                // PLines: JSON.parse(query.PLines),
                customerId: query.customerId,
                // PLineId: query.PLineId,
            })
        }
    },
    PLinesChange(e) {//改变当前生产线
        const index = e.detail.value
        this.setData({
            PLinesIndex: index,
        });
    },
    PLinesPickerChange(e) {
        const index = e.detail.value
        if (index !== this.data.PLinesIndex) {
            const recordId = this.data.PLines[index].recordId;
            const url = getApp().globalData.domain + "/fmSampleRec.php"
            dd.httpRequest({
                url: url,
                method: 'POST',
                data: {
                    action: 'getPLineInfo',
                    // customerId: this.data.customerId
                    recordId: recordId

                },
                dataType: 'json',
                traditional: true,//这里设置为true
                success: (res) => {
                    if (res.data.success === true) {
                        // dd.alert({content: "建立生产线成功"});
                        this.setData({
                            PLinesIndex: index,
                            PLineName: res.data.data.PLineName,
                            PLineMachine: res.data.data.PLineMachine,
                            PLineProduct: res.data.data.PLineProduct,
                            PLinePosition: res.data.data.PLinePosition,
                        });

                    } else {
                        dd.alert({content: JSON.stringify(res)});
                    }
                },
                fail: (res) => {
                    console.log("httpRequestFail---", res)
                    dd.alert({content: JSON.stringify(res)});
                },
                complete: (res) => {
                    dd.hideLoading();
                }
            });
        }
    },
    onInput: function (e) {
        //key是input的标识,
        this.setData({
            [e.target.dataset.key]: e.detail.value
        });


    },
    onCancelRecord() {
        /*this.setData({
            showModal:false,
            PLineName:"",
            PLineMachine:"",
            PLineProduct:"",
            PLinePosition:"",
            PLinesIndex:-1

        })*/
        dd.navigateBack();
    },
    onCreateRecord() {  //建立生产线
        const t =this;
        //数据校验
        if (t.data.PLineName == "" || t.data.PLineMachine == "" || t.data.PLineProduct == ""||t.data.PLinePosition == "") {
            dd.alert({content: "提交数据有误,请检查!"});
            return;
        }
        dd.confirm({
            title: '提示',
            content: t.data.addPline === true?'建立新生产线.':'编辑生产线',
            confirmButtonText: '提交',
            success: (result) => {
                    const url = getApp().globalData.domain + "/fmSampleRec.php"
                    if (this.data.addPline === true) { //代表新增
                        dd.httpRequest({
                            url: url,
                            method: 'post',
                            data: {
                                action: 'editPLine',//既是新增也是修改

                                values: JSON.stringify({  //由于有数组,需要用这种方法向后端传,同时后端将字符串通过json_decode转为数组
                                    form_values: {
                                        PLineName: t.data.PLineName,
                                        PLineMachine: t.data.PLineMachine,
                                        PLineProduct: t.data.PLineProduct,
                                        PLinePosition: t.data.PLinePosition,
                                    },

                                }),
                                customerId: t.data.customerId
                                // customerId: 35

                            },
                            // dataType: 'json',
                            // traditional: true,//这里设置为true
                            success: (res) => {
                                if (res.data.success === true) {
                                    dd.alert({
                                        content: "建立生产线成功",
                                        success:(result)=>{
                                            getPLines(t.data.customerId,t.data.PLineId)
                                                .then(()=>{ dd.navigateBack()})
                                                .catch(err=>dd.alert({title:"添加设备失败",content:JSON.stringify(err)}))
                                        }
                                    });

                                } else {
                                    dd.alert({content: JSON.stringify(res)});
                                }
                            },
                            fail: (res) => {
                                console.log("httpRequestFail---", res)
                                dd.alert({content: "httpFail5:"+JSON.stringify(res)});
                            },
                            complete: (res) => {
                                dd.hideLoading();
                            }
                        });
                    }else{//编辑生产线,暂无调用入口
                            dd.httpRequest({
                                url: url,
                                method: 'POST',
                                data: {
                                    action: 'editPLine',
                                    values: JSON.stringify({  //由于有数组,需要用这种方法向后端传,同时后端将字符串通过json_decode转为数组
                                        form_values: {
                                            PLineName: t.data.PLineName,
                                            PLineMachine: t.data.PLineMachine,
                                            PLineProduct: t.data.PLineProduct,
                                            PLinePosition: t.data.PLinePosition,
                                        },

                                    }),
                                    // progressLineId: this.data.PLines[this.data.PLinesIndex]
                                     progressLineId: t.data.PLines[t.data.PLinesIndex].recordId
                                },
                                // dataType: 'json',
                                // traditional: true,//这里设置为true
                                success: (res) => {
                                    if (res.data.success === true) {
                                        dd.alert({
                                            content: "编辑生产线成功",
                                            success:(result)=>{
                                                // updataPLines(t,t.data.customerId)
                                                dd.navigateBack();

                                            }
                                        });

                                    } else {
                                        dd.alert({content: JSON.stringify(res)});
                                    }
                                },
                                fail: (res) => {
                                    console.log("httpRequestFail---", res)
                                    dd.alert({content: JSON.stringify(res)});
                                },
                                complete: (res) => {
                                    dd.hideLoading();
                                }
                            });
                    }
                },
            })
    },
    onAddPicture() {
        const t = this;
        dd.chooseImage({
            count: 1, //最多只能选9张图片
            success: (res) => {
                if (res.filePaths || res.apFilePaths) {
                    t.setData({
                            picture: res.filePaths[0]
                        }
                    );
                }
            },
        });
    },
    onPicturePreview(e) {
        const imageUrl = e.currentTarget.dataset.src;
        dd.previewImage({
            urls: [imageUrl]
        });
    },
    formSubmit(e) { //添加设备
        let t = this;
        let form = e.detail.value;

        //数据校验
        if (this.data.allPLinesIndex < 0 || form.machineName == "" || form.position == "" || form.machineNum == "" || form.machineStation == "" || form.volume < 0 || form.volue) {
            dd.alert({content: "提交数据有误,请检查!"});
            return;
        }


        dd.confirm({
            title: '提示',
            content: '提交后不能撤销.',
            confirmButtonText: '提交',
            success: (result) => {
                if (result.confirm === true) {
                    const app = getApp();
                    const url = getApp().globalData.domain + "/fmSampleRec.php"
                    dd.httpRequest({
                        url: url,
                        method: 'POST',
                        // headers:{'Content-Type': 'application/json'},
                        /*       $record['生产线ID'] =$_REQUEST['PLinesId'];
                           $record['设备名称'] =$_REQUEST['machineName'];
                           $record['设备编号'] =$_REQUEST['machineNum'];
                           $record['设备工位'] =$_REQUEST['machineStation'];
                           $record['备注'] = $_REQUEST['remark']?$_REQUEST['remark']:"";
                           $record['设备位置'] =$_REQUEST['position'];
                           $record['水箱容积'] =$_REQUEST['volume'];
                           $record['设备图片'] =$_REQUEST['pictureUrl']; //图片在服务器中的位置*/
                        data: {
                            action: 'createMachine',
                            values: JSON.stringify({  //由于有数组,需要用这种方法向后端传,同时后端将字符串通过json_decode转为数组
                                form_values: {
                                    machineName: form.machineName,
                                    machineNum: form.machineNum,
                                    machineStation: form.machineStation,
                                    remark: form.remark,
                                    position: form.position,
                                    volume: form.volume,
                                    PLinesId: t.data.PLineId
                                },
                            }),


                        },
                        dataType: 'json',
                        // traditional: true,//这里设置为true
                        success: (res) => {
                            if (res.data.success === true) {
                                if (this.data.picture !== "") {
                                    updatePicture(this.data.picture, '设备', '设备图片', res.data.machineRecordId)
                                        .then(()=>{ getPLines(t.data.customerId,t.data.PLineId)})
                                        .then(()=> {
                                            dd.alert({
                                                content: '提交成功',
                                                success: () => {
                                                    dd.navigateBack()
                                                }
                                            })
                                        })
                                        .catch(err=>dd.alert({title:"添加设备失败",content:JSON.stringify(err)}))
                                } else {
                                    dd.alert({
                                        content: '提交成功',
                                        success: () => {
                                            getPLines(t.data.customerId,t.data.PLineId)
                                                .then(()=>{ dd.navigateBack()
                                                })
                                                .catch(err=>dd.alert({title:"添加设备失败",content:JSON.stringify(err)}))
                                        }
                                    });
                                }
                            } else {
                                dd.alert({content: JSON.stringify(res)});
                            }
                        },
                        fail: (res) => {
                            console.log("httpRequestFail---", res)
                            dd.alert({content: JSON.stringify(res)});
                        },
                        complete: (res) => {
                            dd.hideLoading();
                        }
                    });


                }
            },
        });

    },
    onDeletePicture(e) {
        const t = this;
        const index = e.currentTarget.dataset.index; //第几张图

        t.setData({
                picture: ""
            }
        );

    },
    onTestResquest() {  //建立生产线
        const t = this;
        const url = getApp().globalData.domain + "/fmSampleRec.php";
        //将应用服务器临时文件,上传阿里云
        dd.httpRequest({
            url: url,
            method: 'get',
            data: {
                action: "editSampleRecord",

            },
            success: function (res) {
                // dd.alert({content: JSON.stringify(res)});
                if (res.data.success == true) {
                    dd.alert({content: "成功"});

                } else {
                    dd.alert({content: "修改记录失败"});
                    dd.hideLoading();

                }
            },
            fail: (res) => {
                // jQuery('#loading').hideLoading();//loading 消失，保存完成。
                dd.alert({content: "修改记录失败5:" + JSON.stringify(res)});

            },

        });
    }
})

function updatePicture(imgPath,layoutName,fieldName,recordID) {
    return new Promise(function (resolve, reject) {
        dd.uploadFile({
            url: getApp().globalData.domain + '/upload/uploadContainer.php',
            fileType: 'image',
            fileName: 'file',
            filePath: imgPath,
            formData: {
                layoutName: layoutName,
                fieldName: fieldName,
                recordID: recordID
            },
            success: res => {
                console.log(JSON.parse(res.data));
                if (JSON.parse(res.data).result !== "success") {
                    reject('failure');
                    /* dd.alert({content: `上传服务器失败：${JSON.stringify(res)}`,
                                 success:()=>{
                                 }
                     })*/

                } else {
                    resolve(true);

                /*    dd.alert({
                        content: '提交成功',
                        success: () => {
                        },
                    })*/
                }
            },
            fail: function (res) {
                reject('failure');
               /* dd.alert({content: `上传失败：${JSON.stringify(res)}`,
                    success:()=> {
                    }
                });*/
            },
        });
    })

}

function updataPLines(t) {
    //读取fm选择样品记录列表
    const url = getApp().globalData.domain + "/fmSampleRec.php";
    dd.httpRequest({
        url: url,
        method: 'get',
        data: {
            action: 'getPLines',
            customerId:query.customerId//江达

        },
        dataType: 'json',
        success: (res) => {
            // dd.alert({'content':"custom:"+JSON.stringify(res.data.content.data)})
            if (res.data.success) {
                /*const allplines =  [...res.data.data.progressLines,...[{
                    "progressLineName": "新增",
                    "progressLineId": "-1",
                    "recordId":-1

                },
                    {
                        "progressLineName": "编辑",
                        "progressLineId": "-2",
                        "recordId":-2
                    }]]*/
                t.setData({
                    // allPLines: allplines,
                    PLines:res.data.data.progressLines,
                    showModal:false,
                    PLineName:"",
                    PLineMachine:"",
                    PLineProduct:"",
                    PLinePosition:"",
                    PLinesIndex:-1
                });
            }else{
                dd.alert({'content': JSON.stringify(res)})
            }
        },
        fail: (res) => {
            dd.alert({'content': JSON.stringify(res)})
        },
        complete: (res) => {
        }
    })
}

/**
 *
 * @param customerId
 * @param PLineId,等于"",则代表建立生产线,有值,则代表新增设备
 */


function getPLines(customerId,PLineId) {
    return new Promise(function (resolve, reject) {
        //读取fm选择样品记录列表
        const url = getApp().globalData.domain + "/fmSampleRec.php";
        dd.httpRequest({
            url: url,
            method: 'get',
            data: {
                action: 'getProgressLines',
                customerId: customerId,
            },
            dataType: 'json',
            success: (res) => {
                if (res.data.success === true) {
                    const pages = getCurrentPages();
                    const prevPage = pages[pages.length - 2];     //获取上一个页面, 既添加样品数据detailed
                    const ProgressLine = res.data.data.progressLines;
                    let ProgressLineIndex, selectMachineIndex, selectMachine;
                    if (PLineId == "") { //建立生产线
                        ProgressLineIndex = ProgressLine.length - 1;
                        selectMachineIndex = -1;
                        selectMachine = [];

                    } else {//建立设备
                        ProgressLineIndex = ProgressLine.findIndex((PLine) => PLine.PLineId === PLineId);
                        selectMachine = ProgressLine[ProgressLineIndex].machines;
                        selectMachineIndex = ProgressLine[ProgressLineIndex].machines.length - 1;
                    }

                    prevPage.setData({             //修改上一个页面的变量
                        ProgressLine,
                        ProgressLineIndex,
                        selectMachineIndex,
                        selectMachine
                    });
                    resolve(true);
                } else {
                    reject('failure');
                }
            },
            fail: (res) => {
                dd.alert({'content': JSON.stringify(res)})
                reject('failure');

            }
        })
    })
}


