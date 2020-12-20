Page({
    data: {
        // showDetailed:false,//显示数据记录详情,与showModal相反
        showModal: true,
        backMode: 0,//0代表导航键默认返回,记录storage,1代表用户提交记录返回,将storage清零
        showVideo: false,
        sampleID: null,//试用记录ID
        sampleDataRecID: -1,//样品数据记录ID
        testCategory: "",
        //选择产品
        selectProduct: "",
        //选择设备
        selectMachine: "",
        //选择的生产线
        selectProgressLine:"",
        machineId:"",
        pLineId:"",
        //试样类别
        category: '',
        //检测项目
        subjects: [//包括实测数据
            /*{recordId:"记录标识",name:"外观",classification:"检测项目",testMethod:"目测",checkData:"",checkContent:""},
            {name:"浓度",classification:"检测项目",testMethod:"目测",checkData:"",checkContent:""},
           */

        ],
        addSubjects: [//包括实测数据
            /* {recordId:"记录标识",name:"外观",classification:"检测项目",testMethod:"目测",checkData:""},
            {name:"浓度",classification:"检测项目",testMethod:"目测",checkData:""},*/
        ],

        /*showDetailModal:false,//显示检测项目详情
        subjectCategory:"",
        subjectsIndex:-1,*/

        //媒体信息,url保证视频文件唯一性,最好加上fm中的主键ID,比如样品记录数据ID
        thumbs: [
            /*{url:'http://r1w8478651.imwork.net:9998/upload/1557572616747-2019-05-11.jpg',category:'image'},
            {url:'http://r1w8478651.mp4',category:'video',isUpload:true},
            {url:'http://r1w8478651.imwork.net:9998/upload/1557572616747-2019-05-11.jpg',category:'image',isUpload:true},
            {url:'http://r1w8478651.mp4',category:'video',isUpload:false}*/
        ],
        //等待从阿里云上删除的媒体id
        waitDeleteVideoIds: [],
        waitDeleteImageIds: [],
        //显示视频预览
        showVideoPreview: false,
        videoUrl: "",

        //异常数据
        isException:false,
        exceptionBuildTime:"",//异常建立时间
        exceptionHandleTime:"",//异常处理时间
        exceptionDescription:"",//异常描述
        handlingMethod:"",
        handlingEffect:"",
        effectGroupIndex:-1,//0:'解决',1:'部分解决',2:'未解决'
        focus:false,//异常描述和处理效聚焦
        animationInfo:{}//异常动画参数

    },
    onLoad(query) {
        this.data.sampleDataRecID = query.sampleDataRecID;
        const t = this;
        //读取fm选择样品记录列表
        const url = getApp().globalData.domain + "/fmSampleRec.php";
        dd.httpRequest({
            url: url,
            method: 'get',
            data: {
                action: 'getSampleRecord',
                sampleDataRecID: this.data.sampleDataRecID
            },
            dataType: 'json',
            success: (res) => {
                // dd.alert({'content':"custom:"+JSON.stringify(res.data.content.data)})
                if (res.data.success === true) {

                    //清空
                    t.data.waitDeleteVideoIds=[];
                    t.data.waitDeleteImageIds=[];
                    //id值
                    // t.data.machineId=res.data.data.machineId,
                    // t.data.pLineId=res.data.data.pLineId,
                    t.setData({
                        selectProduct: res.data.data.product,
                        selectMachine: res.data.data.machine,
                        machineId:res.data.data.machineId,
                        pLineId:res.data.data.pLineId,
                        selectProgressLine: res.data.data.progressLine,
                        category: res.data.data.category,
                        testCategory: res.data.data.testCategory,
                        //检测项目
                        subjects: res.data.data.subjects,
                        addSubjects: res.data.data.addSubjects,
                        remark: res.data.data.remark,
                        thumbs: res.data.data.thumbs,
                        isException:res.data.data.exceptionBuildTime?true:false,
                        exceptionBuildTime:res.data.data.exceptionBuildTime,//异常建立时间
                        exceptionHandleTime:res.data.data.exceptionHandleTime,//异常处理时间
                        exceptionDescription:res.data.data.exceptionDescription,//异常描述
                        handlingMethod:res.data.data.handlingMethod,
                        handlingEffect:res.data.data.handlingEffect,
                        effectGroupIndex:res.data.data.effectGroupIndex//0:'解决',1:'部分解决',2:'未解决'
                    });
                } else {
                    dd.alert({content: '得到样品记录数据失败'})
                }
            },
            fail: (res) => {
                dd.alert({'content': JSON.stringify(res)})
            },
            complete: (res) => {
            }

        })

    },
    onShow(){
        
    },
    onUnload() {
        /*console.log("返回键按下,page销毁")
        //真机上可调试,ide直接忽略
        // dd.alert({content:JSON.stringify(this.data.subjects)})
        if (this.data.backMode === 1) { //提交退出
            dd.removeStorage({
                key: 'sampleRecord',
            });
        }else { //返回键退出
            //将数据写入storage
            dd.setStorage({
                key: 'sampleRecord',
                data: {
                    sampleID: this.data.sampleID,//试用记录ID
                    testCategory: this.data.testCategory,
                    testCategoryIndex: this.data.testCategoryIndex, //检测类型序号
                    //选择产品
                    selectProduct: this.data.selectProduct,
                    selectProductIndex: this.data.selectProductIndex,
                    //选择设备
                    selectMachine: this.data.selectMachine,
                    selectMachineIndex: this.data.selectMachineIndex,
                    //试样类别
                    category: this.data.category,
                    //检测项目
                    subjects: this.data.subjects,
                    addSubjects: this.data.addSubjects,

                    //媒体信息,url保证视频文件唯一性,最好加上fm中的主键ID,比如样品记录数据ID
                    thumbs: this.data.thumbs,
                    remark:this.data.remark,

                    stage: this.data.stage,//0是在选择机器和产品阶段,1为记录阶段

                },
                success: function () {
                    // dd.alert({content: '写入成功'});
                }
            });
        }*/
    },
    //编辑生产线或设备
    editPLineOrMachine(){
        dd.navigateTo({url: '/page/addMachine/addMachine?PLineId='+this.data.pLineId+'&machineId='+this.data.machineId+'&type=edit'});
    },
    //输入实测数据,写入对应subjects
    onInput: function (e) {
        const checkData = e.detail.value;
        const index = e.currentTarget.dataset.index;
        const testCategory = e.currentTarget.dataset.testCategory
        if (testCategory === "subjects") {
            this.data.subjects[index].checkData = checkData;
            this.setData({
                subjects: this.data.subjects
            })
        } else {
            this.data.addSubjects[index].checkData = checkData
            this.setData({
                addSubjects: this.data.addSubjects
            })

        }
    },
    onTextareaInput(e) {//textarea双向绑定
        const name = e.currentTarget.dataset.name;
        this.setData({
            [name]: e.detail.value
        });

    },
    /*//detailModal
    openDetailModal(e){
        const subjectsIndex= e.currentTarget.dataset.index;
        const subjectCategory = e.currentTarget.dataset.testCategory
        this.setData({showDetailModal:true,
                      subjectsIndex:subjectsIndex,
                      subjectCategory:subjectCategory});

    },
    onClose(){
        this.setData({
            showDetailModal:false
        })
    },*/
    //异常相关
    onException(){ //建立异常
        const t = this;
        dd.confirm({
            title: '提示',
            content: '建立异常.',
            confirmButtonText: '确认',
            success: (result) => {
                if (result.confirm == true) {
                    let currentTime = new Date();
                    let animation = dd.createAnimation({
                        duration: 1000,
                        timeFunction: 'ease-in-out',
                    });
                    t.animation = animation;
                    //向上滚动
                    // t.animation.translateY(-200).opacity(0).step();
                    t.animation.opacity(1).step();
                     t.setData({
                            isException: true,
                            exceptionBuildTime:currentTime.format("yyyy-MM-dd"),
                            focus: true,
                            animationInfo: t.animation.export()
                        })
                    //   dd.pageScrollTo({
                    //     scrollTop: 1000
                    //   })
                    //先要显示异常内容,再滚动否则无效,特别是ios
                    setTimeout(function () {
                       dd.pageScrollTo({
                        scrollTop: 1000
                    })
                    }, 200);

                }
            }
        })
    },
    radioChange(e) {

        let currentTime = new Date();
        this.setData({
            effectGroupIndex: e.detail.value,
            exceptionHandleTime:currentTime.format("yyyy-MM-dd")
        })

    },

    onBlur() {
        this.setData({
            focus: false,
        });
    },
    changeDate(e) {//异常中,改变日期
        const t =this;
        const type = e.currentTarget.dataset.type;
        let currentDate,target;

        if (type =="buildTime") {
            currentDate = t.data.exceptionBuildTime;
            target = "exceptionBuildTime";

        } else {
            currentDate = t.data.exceptionHandleTime;
            target = "exceptionHandleTime";
        }

        dd.datePicker({
            format: 'yyyy-MM-dd',
            currentDate: currentDate,
            success: (res) => {
                const selectDate = new Date(res.date);
                t.setData({
                    [target]:selectDate.format("yyyy-MM-dd")//必须是“yyyy-mm-dd hh:mm” 和“yyyy-mm-dd”规式,要补0
                })

            }
        });

    },
    //媒体容器相关
    onMediaPreview(e) {
        const imageUrl = e.currentTarget.dataset.src;
        const index = e.currentTarget.dataset.index;
        const category = e.currentTarget.dataset.category;
        if (category === 'video') {
            //通过videoId播放视频
            if (this.data.thumbs[index].isUpload == true) { //已上传阿里云,通过videoId播放
                const url =getApp().globalData.applicationServer+"PlayAiliyuVideoForVideoid.php";
                dd.httpRequest({
                    url: url,
                    method: 'POST',
                    data: {
                        videoId: this.data.thumbs[index].videoId,
                    },
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.success === true) {
                            this.setData({
                                videoUrl: res.data.src,
                                showVideo: true
                            })
                        } else {
                            alert("播放文件失败,稍后再试");
                        }
                    },
                    fail: (res) => {
                        console.log("httpRequestFail---", res)
                    },
                })
            } else { //未上传到阿里云
                this.setData({
                    videoUrl: imageUrl,
                    showVideo: true
                })
            }

        } else {
            dd.previewImage({
                urls: [imageUrl]
            })
        }
    },
    onCloseVideo() {
        this.setData({showVideo: false})
    },
    onAddMedia(e) {
        const t = this;
        let thumbs = this.data.thumbs;
        let options = ['图片', '视频'];

        dd.showActionSheet({
            title: "选择?",
            items: options,
            //cancelButtonText: '取消好了', //android无效
            success: (res) => {
                const index = res.index;
                if (index === 0) { //选择图片
                    dd.chooseImage({
                        count: 6 - thumbs.length, //最多只能选9张图片
                        success: (res) => {
                            if (res.filePaths || res.apFilePaths) {
                                let promiseArr = [];
                                res.filePaths.forEach(path => {
                                    promiseArr.push(updateImageToServer({url: path, category: 'image'}))
                                })
                                dd.showLoading();
                                Promise.all(promiseArr).then(results => { //results为promiseArr返回的数组合集,既上传文件的服务器url集
                                    dd.hideLoading();
                                    dd.alert({content: "上传成功"})
                                    results.forEach(item => {
                                        thumbs.push({url: item, category: 'image', isUpload: false});
                                    })
                                    t.setData({
                                            thumbs: thumbs
                                        }
                                    );
                                    dd.hideLoading();
                                })
                                //将数据存入,但没有上传
                                /*if(res.filePaths || res.apFilePaths) {
                                    res.filePaths.forEach(item => {
                                        const path = item;

                                        thumbs.push({url:path,category:'image'});
                                    })
                                    t.setData({
                                            thumbs: thumbs
                                        }
                                    );
                                }*/

                            }
                        },
                    });
                } else {//选择视频
                    dd.chooseVideo({
                        sourceType: ['album', 'camera'],
                        maxDuration: 60,
                        success: (res) => {
                            // const path = (res.filePaths && res.filePaths[0]) || (res.apFilePaths && res.apFilePaths[0]);
                            if (res.size > 20000000) {
                                dd.alert({content: "视频超过20M不能上传,请使用压缩软件剪辑后再上传."})
                            } else {
                                const path = res.filePath;
                                dd.showLoading();

                                /* //将数据存入,但没有上传
                                 thumbs.push({url:path,category:'video'})}
                                 t.setData({
                                     thumbs:thumbs
                                  });*/

                                //直接上传到应用服务器
                                //development服务器
                                const url =getApp().globalData.applicationServer+"uploadMediaToServer.php"
                                dd.uploadFile({
                                    // url: getApp().globalData.domain + '/upload/upload.php',
                                    url: url,
                                    fileType: 'video',
                                    fileName: 'file',
                                    filePath: path,
                                    formData: {fileType: 'video'},
                                    success: res => {
                                        console.log(JSON.parse(res.data));
                                        const data = JSON.parse(res.data)
                                        if (data.result == "success") {
                                            //返回上传图片urls
                                            dd.hideLoading();
                                            dd.alert({content: "上传成功"})
                                            thumbs.push({url: data.fileUrl, category: 'video', isUpload: false})
                                            t.setData({
                                                thumbs: thumbs
                                            });

                                        } else {
                                            dd.hideLoading();
                                            dd.alert({content: `上传服务器失败：${JSON.stringify(res)}`})
                                        }
                                    },
                                    fail: function (res) {
                                        dd.hideLoading();
                                        dd.alert({content: `上传失败：${JSON.stringify(res)}`});
                                    },
                                });
                            }
                        },
                        fail: (err) => {
                            console.log(err)
                        }
                    })
                }
            },
        })
    },
    onDeleteMedia(e) {
        const t = this;
        const index = e.currentTarget.dataset.index; //第几张图
        let thumbs = this.data.thumbs;

        //需将应用服务器中的媒体文件删除
        dd.confirm({
            title: '删除视频',
            content: '确定删除视频?.',
            confirmButtonText: '确认',
            success: (result) => {
                if (result.confirm === true) {
                    if (t.data.thumbs[index].isUpload == true) { //已上传在阿里云的文件,标记待删除
                        //删除记录
                        if (t.data.thumbs[index]['category'] === 'image') {
                            t.data.waitDeleteImageIds.push(t.data.thumbs[index]['videoId'])
                        } else {
                            t.data.waitDeleteVideoIds.push(t.data.thumbs[index]['videoId'])
                        }
                        //渲染
                        thumbs.splice(index, 1);
                        t.setData({
                                thumbs: thumbs
                            }
                        );
                    } else { //在应用服务器的文件,直接后台删除
                        dd.showLoading();
                        const url =getApp().globalData.applicationServer+"deleteUploadMedia.php"
                        dd.httpRequest({
                            url: url,
                            method: 'POST',
                            data: {
                                urlPath: thumbs[index].url,
                            },
                            dataType: 'json',
                            success: (res) => {
                                if (res.data.result === 'success') {
                                    thumbs.splice(index, 1);
                                    t.setData({
                                            thumbs: thumbs
                                        }
                                    );
                                } else {
                                    dd.alert({content: "删除上传文件失败,稍后再试"});
                                }
                                dd.hideLoading();

                            },
                            fail: (res) => {
                                console.log("httpRequestFail---", res)
                                dd.hideLoading();
                            },

                        })
                    }

                }
            }
        })

    },
    /*onUploadMedia() {
        if (this.data.thumbs.length >= 1) {
            const t = this;
            const thumbs = this.data.thumbs
            dd.confirm({
                title: '上传媒体',
                content: '媒体上传阿里云.',
                confirmButtonText: '提交',
                success: (result) => {
                    //将客户端文件通过应用服务器中转,再上传阿里云
                    /!*if (result.confirm === true) {
                        dd.showLoading();
                        const thumbs = this.data.thumbs;
                        let promiseArr = [];
                        for (let i = 0; i < thumbs.length; i++) {
                            promiseArr.push(updateMedia(thumbs[i]))
                        }
                        //ios不显示 dd.alert({content:results}),但this.data.imageUrls = results执行了原因不明
                        Promise.all(promiseArr)
                            .then(results => { //results为promiseArr返回的数组合集,既上传文件的服务器url集
                                dd.hideLoading();
                                dd.alert({content:"上传成功"})
                            })
                    }*!/
                    const url =getApp().globalData.applicationServer+"uploadMediasToAili.php"
                    //将应用服务器临时文件,上传阿里云
                    dd.httpRequest({
                        url: url,
                        method: 'post',
                        //测试数据
                        data: {
                            sampleDataRecID: 291,
                            thumbs: JSON.stringify(thumbs)
                        },
                        success: function (res) {
                            if (res.data.result == 'success') {
                                dd.alert({content: "已上传阿里云."});
                                t.setData({
                                        thumbs: []
                                    }
                                );
                            } else {
                                dd.alert({content: "上传阿里云失败"});
                            }
                        },
                        fail: function (res) {
                            dd.alert({content: "上传阿里云失败." + JSON.stringify(res)});
                        }
                    });
                },
                fail: function (res) {
                    dd.hideLoading();
                    dd.alert({content: `上传失败了：${JSON.stringify(res)}`});

                }
            })
        }
    },*/
    onSubmit(e) { //提交到fm
        const t = this;
        //数据校验,subject或addjectg不能都为0

            if (t.data.subjects.length == 0 && t.data.addSubjects.length == 0 ||
                (t.data.isException  && e.detail.value.exceptionDescription==="") ||
                (t.data.effectGroupIndex!==-1  && e.detail.value.handlingEffect==="")) {
                dd.alert({content: "提交数据有误,请检查!"});
                return
        }

        //上传数据到fm
        dd.confirm({
            title: '提交',
            content: '提交记录,确认?',
            confirmButtonText: '确认',
            success: (result) => {
                if (result.confirm==true) {
                    dd.showLoading();
                    const url = getApp().globalData.domain + "/fmSampleRec.php";
                    //将应用服务器临时文件,上传阿里云
                    dd.httpRequest({
                        url: url,
                        method: 'post',
                        data: {
                            action: "editSampleRecord",
                            sampleDataRecID: t.data.sampleDataRecID,
                            remark: t.data.remark,
                            subjects: JSON.stringify(t.data.subjects),
                            addSubjects: JSON.stringify(t.data.addSubjects),
                            exceptionDescription: e.detail.value.exceptionDescription,
                            effectGroupIndex: e.detail.value.effectGroupIndex,//后台不能变,只是index
                            handlingEffect: e.detail.value.handlingEffect,
                            exceptionBuildTime: e.detail.value.exceptionBuildTime,//异常建立时间
                            exceptionHandleTime: e.detail.value.exceptionHandleTime,//异常处理时间
                            handlingMethod: e.detail.value.handlingMethod,
                        },
                        success: function (res) {
                            // dd.alert({content: JSON.stringify(res)});
                            if (res.data.success == true) {
                                const url = getApp().globalData.applicationServer + "uploadMediasToAiliForComponents.php"
                                dd.httpRequest({
                                    url: url,
                                    method: 'POST',
                                    data: {
                                        thumbs: JSON.stringify(t.data.thumbs),
                                        sampleDataRecID: t.data.sampleDataRecID,
                                        recordSheetName: "试样记录数据",
                                        max: 6,
                                        waitDeleteVideoIds: t.data.waitDeleteVideoIds.join(','),
                                        waitDeleteImageIds: t.data.waitDeleteImageIds.join(',')
                                    },
                                    dataType: 'json',
                                    success: (res) => {
                                        // jQuery('#loading').hideLoading();//loading 消失，保存完成。
                                        dd.hideLoading();
                                        if (res.data.success === true) {
                                            /*alert("提交成功");*/
                                            // t.data.backMode = 1;

                                            dd.alert({
                                                content: "提交成功.",
                                                success: () => {
                                                    //更新上一页面的数据,即sampleList的当前行,比如异常状态,不读后台
                                                   /* const prevPage = pages[pages.length - 2];
                                                    /!*$resultdata[] = array('sampleDataRecID'=>$res['recordID'],'testCategory' => $res['检测类别'], 'machine' => $res['查询设备::设备识别标识'], 'PLineName'=>$res['查询生产线信息::生产线名'],'product' => $res['查询配方号::配方号'], 'recorder' => $res['创建人'],'buildTime'=>$buildTime,'projectName'=>$res['样品试用记录::记录类别'].'-'.$res['样品试用记录::类别'].'-'.date('Y/m/d', strtotime($res['样品试用记录::提交试用方案时间戳'])),'isException'=>$res['异常建立时间']?$res['异常建立时间']:null,'effectResult'=>$res['异常处理结果']);*!/
                                                    let listData = prevPage.data.listData;
                                                    listData.forEach(item => {
                                                        for(let key in item){
                                                           if (key ==="sampleDataRecID") {
                                                                listData
                                                           }
                                                        }
                                                        result.push(record);
                                                    })

                                                    prevPage.setData({             //修改上一个页面的变量
                                                        ProgressLine,
                                                        ProgressLineIndex,
                                                        selectMachineIndex,
                                                        selectMachine
                                                    });*/
                                                    dd.navigateBack();
                                                },
                                            });
                                        } else {
                                            dd.alert({content: "上传阿里云失败"});

                                        }
                                    },
                                    fail: (res) => {
                                        // jQuery('#loading').hideLoading();//loading 消失，保存完成。
                                        dd.alert({content: "上传阿里云失败." + JSON.stringify(res)});
                                        dd.hideLoading();

                                    },
                                })
                            } else {
                                dd.alert({content: "修改记录失败"});
                                dd.hideLoading();

                            }
                        },
                        fail: (res) => {
                            // jQuery('#loading').hideLoading();//loading 消失，保存完成。
                            dd.alert({content: "修改记录失败." + JSON.stringify(res)});
                            dd.hideLoading();

                        },

                    });
                }
            },
        });
    }
})


/*function updateMedia(thumb) {
    console.log('thumb:'+JSON.stringify(thumb));
    return new Promise(function (resolve,reject) {
        const url =getApp().globalData.applicationServer+"uploadVideoToAili.php"
        const fileType = thumb.category==="image"?"image":"video"
        dd.uploadFile({
            // url: getApp().globalData.domain + '/upload/upload.php',
            url:url,
            fileType: fileType,
            fileName: 'file',
            filePath: thumb.url,
            formData:{fileType:fileType},
            success: res => {
                console.log(JSON.parse(res.data));
                if (JSON.parse(res.data).result == "success") {
                    //返回上传图片urls
                    resolve(JSON.parse(res.data).fileUrl);
                } else {
                    dd.hideLoading();
                    dd.alert({content: `上传服务器失败：${JSON.stringify(res)}`})
                    reject('failure');
                }
            },
            fail: function (res) {
                dd.hideLoading();
                dd.alert({content: `上传失败：${JSON.stringify(res)}`});
                reject('failure');
            },
        });
    })
}*/

function updateImageToServer(thumb) {
    // console.log('thumb:'+JSON.stringify(thumb));
    return new Promise(function (resolve,reject) {
        const url =getApp().globalData.applicationServer+"uploadMediaToServer.php"
        const fileType = thumb.category==="image"?"image":"video"
        dd.uploadFile({
            // url: getApp().globalData.domain + '/upload/upload.php',
            url:url,
            fileType: fileType,
            fileName: 'file',
            filePath: thumb.url,
            formData:{fileType:fileType},
            success: res => {
                console.log(JSON.parse(res.data));
                if (JSON.parse(res.data).result == "success") {
                    //返回上传图片urls
                    resolve(JSON.parse(res.data).fileUrl);
                } else {
                    dd.hideLoading();
                    dd.alert({content: `上传服务器失败：${JSON.stringify(res)}`})
                    reject('failure');
                }
            },
            fail: function (res) {
                dd.hideLoading();
                dd.alert({content: `上传失败：${JSON.stringify(res)}`});
                reject('failure');
            },
        });
    })
}

function deleteImageToServer(thumb) {
    return new Promise(function (resolve,reject) {
        const url =getApp().globalData.applicationServer+"deleteUploadMedia.php"
        dd.httpRequest({
            url: url,
            method: 'POST',
            data: {
                urlPath: thumb.url,
            },
            dataType: 'json',
            success: (res) => {
                if (res.data.result === 'success') {
                   resolve('success')
                } else {
                    dd.alert({content: "清理上传文件失败,稍后再试"});
                    reject('failure');

                }
            },
            fail: (res) => {
                console.log("httpRequestFail---", res)
                reject('failure');

            },
        })

    })


}

