class UploadManagerClass {

    AuePath = "upload/"
    IsShow = false
    ReadingCount = 0
    ItemMax: number = 6  //附件最大数量
    VueTempId: number = 1 //为了vue模板中的key  为了C2L_UpdateWorkAdd时 确认L2C返回的item
    LoadingDict: { [key: number]: LoadingDictItem } = {}    //上传中的 key:wid
    Init() {
    }
    RegisterFunc() {
        Commond.Register(L2C.L2C_UPLOAD_ADD, this.L2C_UploadWorkAdd.bind(this))
        Commond.Register(L2C.L2C_UPLOAD_DELETE, this.L2C_UploadWorkDelete.bind(this))
    }
    L2C_UploadWorkAdd(data: FileSingle) {
        var wid: number = data.Wid
        //当前loading中的要处理一下
        var uploadCount = 0
        if (this.LoadingDict[wid]) {
            var len = this.LoadingDict[wid].items.length
            for (var i = 0; i < len; i++) {
                var item = this.LoadingDict[wid].items[i]
                if (item.TempId == data.TempId) {
                    item.Fid = data.Fid
                    item.CreateTime = data.CreateTime
                    this.FormatItemStateUrl(item)
                    break;
                }
            }
            //检查是否全部add完成
            uploadCount = this.GetUploadCount(this.LoadingDict[wid].items)
            if (uploadCount == 0) {//全完成
                delete this.LoadingDict[wid]
                if (this.vueUploadWork.wid == wid) {
                    //是当前正在使用的
                    this.vueUploadWork.uploadTaskState = UploadTaskState.UploadComplete
                    this.vueUploadWork.uploadingSum = 0
                    this.vueUploadWork.uploadingCount = 0
                    this.UploadCompleteAutoClose()
                }
            } else {
                if (this.vueUploadWork.wid == wid) {
                    //是当前正在使用的
                    this.vueUploadWork.uploadingCount = uploadCount
                }
            }
        }
        //刷新work中的数据
        var work: WorkSingle = ProcessData.WorkMap[wid]
        if (work) {
            work.uploading = uploadCount > 0
            if (!work.FileList) {
                work.FileList = []
            }
            var file: FileSingle = {}
            file.Fid = data.Fid
            file.Kind = data.Kind
            file.Name = data.Name
            file.CreateTime = data.CreateTime
            this.FormatItemStateUrl(file)
            work.FileList.push(file)
            //刷新work格子的状态
            ProcessManager.WorkEdit(work)
        }
    }
    L2C_UploadWorkDelete(data: { Wid: number, Fids: number[] }) {
        var wid: number = data.Wid
        //刷新work中的数据
        var work: WorkSingle = ProcessData.WorkMap[wid]
        if (work && work.FileList) {
            for (var i = work.FileList.length - 1; i >= 0; i--) {
                var item = work.FileList[i]
                if (data.Fids.indexOf(item.Fid) > -1) {
                    work.FileList.splice(i, 1)//删除对应的file
                }
            }
            // var index = work.FileList.eac((item) => {
            //     return item.Fid == data.Fid
            // })
            //刷新work格子的状态
            ProcessManager.WorkEdit(work)
        }
    }
    //格式化已经设置为url的file
    FormatItemStateUrl(item: FileSingle) {
        item.state = UploadItemState.Url
        item.src = this.CountFilePath(item.Kind, item.Fid, item.CreateTime, true)
        item.srcOri = this.CountFilePath(item.Kind, item.Fid, item.CreateTime, false)
    }
    /**
     * 计算file的src路径
     * @param fileKind 
     * @param fid 
     * @param create_time 
     * @param isThumb 是否缩略图
     */
    CountFilePath(fileKind: number, fid: number, create_time: number, isThumb: boolean): string {
        var md5str: string = $.md5(fid.toString())
        var tm = new Date();
        tm.setTime(create_time * 1000);
        return `/upload/${md5str.substr(0, 2)}/${tm.format('yyyyMMdd_hhmm')}_${fid.toString()}.${this.GetExtByFileKind(fileKind)}` + (isThumb ? ".t.jpg" : "")
    }
    // 根据FileKind计算文件的后缀名
    GetExtByFileKind(fileKind: number): string {
        switch (fileKind) {
            case FileKind.PNG:
                return "png"
            case FileKind.JPG:
                return "jpg"
            case FileKind.BMP:
                return "bmp"
        }
        return "_"
    }
    //用work.FileList 初始化 auexxx.items
    InitAueItems(fileList: FileSingle[]): FileSingle[] {
        var items: FileSingle[] = []
        var hasAdd: boolean = false;//add仅添加一个
        for (var i = 0; i < this.ItemMax; i++) {
            //获取旧的
            var item: FileSingle
            items.push({})
            item = items[i]
            //有图的copy值
            if (fileList && i < fileList.length && fileList[i].Fid > 0) {
                var file: FileSingle = fileList[i]
                item.TempId = this.VueTempId++
                item.Fid = file.Fid
                item.Kind = file.Kind
                item.Name = file.Name
                item.CreateTime = file.CreateTime
                this.FormatItemStateUrl(item)
            } else {
                //没图的设置空值
                item.TempId = this.VueTempId++
                item.Fid = 0
                item.Kind = 0
                item.state = hasAdd ? UploadItemState.None : UploadItemState.Add;
                hasAdd = true
                item.Name = ''
                item.CreateTime = 0
                item.src = null
                item.srcOri = null
            }
        }
        return items
    }
    //加入新文件
    DoAddFile(file: File, fileName?: string) {
        this.vueUploadWork.uploadTaskState = UploadTaskState.None
        // console.log("[debug]", "DoAddFile", file)
        // console.log("[debug]", "file.type", file.type)
        if (!file) {
            return
        } else {
            var fileKind: FileKind
            switch (file.type) {
                case 'image/png':
                    fileKind = FileKind.PNG
                    break
                case 'image/jpeg':
                    fileKind = FileKind.JPG
                    break
                case 'image/bmp':
                    fileKind = FileKind.BMP
                    break
                default:
                    //未知的文件
                    return
            }
            // this.ReadingCount++
            // this.vueUploadWork.submitEnabled = false
            //--找到第一个不是没有值的图片
            var thisItem: FileSingle
            var len = this.vueUploadWork.items.length
            for (var i = 0; i < len; i++) {
                var _item = this.vueUploadWork.items[i]
                if (_item.state == UploadItemState.Add) {
                    _item.state = UploadItemState.Reading
                    if (i < this.ItemMax - 1) {//下一个变成 增加 状态
                        this.vueUploadWork.items[i + 1].state = UploadItemState.Add;
                    }
                    thisItem = _item
                    break;
                } /*  去掉这个注释 可以去掉重复的图 
                else if(item.state == UploadItemState.Success){
                    if(item.src == base64){
                        //已经选过的文件不要传了
                        break;
                    }
                } */
            }
            if (thisItem == null) {
                return
            }
            thisItem.Kind = fileKind
            thisItem.Name = fileName || file.name
            this.ReadingCount++
            this.vueUploadWork.submitEnabled = false
            //--解析base64  base64发给后端的,即使后端是[]byte也能接受
            var readerBase64 = new FileReader();
            readerBase64.onload = (e: ProgressEvent) => {
                // console.log("[debug]", "readerBase64 e:", e)
                var base64 = (e.target as FileReader).result as string
                thisItem.state = UploadItemState.Base64
                thisItem.src = base64
                //---解析二进制   因为上传要使用二进制
                var readerBuffer = new FileReader();
                readerBuffer.onload = (e: ProgressEvent) => {
                    // console.log("[debug]", "readerBuffer e:", e, i)
                    // thisItem.buffer = Array['from'](new Uint8Array((e.target as FileReader).result))//IE没有这个方法,用[].slice.call(new Uint8Array..代替
                    thisItem.buffer = [].slice.call(new Uint8Array((e.target as FileReader).result))
                    this.ReadingCount--
                    if (this.ReadingCount <= 0) {//全部read完成
                        this.vueUploadWork.submitEnabled = true
                    }
                }
                readerBuffer.readAsArrayBuffer(file)
                //--
            }
            readerBase64.readAsDataURL(file);//获取base64编码
        }
    }
    //work上传附件界面
    deleteFids: number[] = []
    vueUploadWork: CombinedVueInstance1<{ wid: number, uploadingPercent: number, uploadingBufferedAmount: number, uploadTaskState: UploadTaskState, submitEnabled: boolean, uploadingCount: number, uploadingSum: number, items: FileSingle[] }>
    ShowUploadWork(o: HTMLElement, wid: number): void {
        // console.log("[debug]", "ProcessData.WorkMap[wid]:", ProcessData.WorkMap[wid])
        var _work: WorkSingle = ProcessData.WorkMap[wid]
        if (!_work) {
            console.log("[warn]", `work wid(${wid}) can not find`)
            return;
        }
        var _show = () => {
            this.IsShow = true
            $(this.vueUploadWork.$el).xy($(o).x() + $(o).outerWidth() + 4, $(o).y() - 2).show().adjust(-5)
            $(document).on('dragleave drop dragenter dragover', (e) => {
                e.preventDefault();
            })
            this.deleteFids = []
            this.vueUploadWork.wid = wid
            if (this.LoadingDict[wid]) {//用loading中的数据
                this.vueUploadWork.uploadTaskState = UploadTaskState.Uploading
                this.vueUploadWork.uploadingSum = this.LoadingDict[wid].uploadingSum
                this.vueUploadWork.uploadingBufferedAmount = this.LoadingDict[wid].uploadingBufferedAmount
                this.vueUploadWork.uploadingCount = this.GetUploadCount(this.LoadingDict[wid].items)
                this.vueUploadWork.items = this.LoadingDict[wid].items
                this.UpdateUploadProcess()
            } else {
                this.vueUploadWork.uploadTaskState = UploadTaskState.None
                this.vueUploadWork.uploadingSum = 0
                this.vueUploadWork.uploadingCount = 0
                this.vueUploadWork.uploadingPercent = 0
                this.vueUploadWork.items = this.InitAueItems(_work.FileList)
            }
            this.vueUploadWork.submitEnabled = false
            PopManager.CancelMouseOut(this.vueUploadWork.$el)
            PopManager.RegisterMouseOut(this.vueUploadWork.$el, () => {
                if ((this.vueImageShowcase == null || this.vueImageShowcase.IsShow == false)) {//显示大图时点击不要关闭这个窗口
                    this.CloseUploadWork()
                }
            })
        }
        //
        if (this.vueUploadWork == null) {
            Loader.LoadVueTemplate(this.AuePath + 'UploadWork', (txt) => {
                this.vueUploadWork = new Vue({
                    template: txt,
                    data: {
                        wid: 0,
                        uploadingCount: 0,
                        uploadingSum: 0,
                        uploadingPercent: 0,
                        uploadingBufferedAmount: 0,
                        uploadTaskState: UploadTaskState.None,
                        submitEnabled: false,   //确定按钮状态, 仅在添加了图片或这删除掉图片后这个按钮才可用,  打开面板/reading/loading时都不可用
                        items: []
                    },
                    methods: {
                        //图片点击
                        onImageClick: (index: number) => {
                            //拿出有图的
                            var rs: ImageShowcaseImage[] = []
                            var rsIndex: number
                            var len = this.vueUploadWork.items.length
                            for (var i = 0; i < len; i++) {
                                var item = this.vueUploadWork.items[i]
                                if (item.state == UploadItemState.Url) {
                                    rs.push({ src: item.srcOri, name: item.Name })
                                } else if (item.state == UploadItemState.Base64) {
                                    rs.push({ src: item.src, name: item.Name })
                                }
                                if (i == index) {
                                    rsIndex = rs.length - 1
                                }
                            }
                            this.ShowImageShowcase(rs, rsIndex + 1)
                        },
                        //开始选择文件,准备上传
                        onSelectFileStart: (e: Event, index: number) => {
                            if (this.vueUploadWork.items[index] && this.vueUploadWork.items[index].state == UploadItemState.Add) {
                                $(this.vueUploadWork.$el).find('.inputFile').click()
                            }
                        },
                        //选择好文件
                        onChangeInputFile: this.OnSelectFile.bind(this),
                        onDeleteFile: (index: number) => {
                            this.DoDeleteFile(index)
                        },
                        onSubmit: (e: MouseEvent) => {
                            var _doSubmit = () => {
                                //计算删除 (先删除再增加, 如果先增加, 后端会超过最大数量的)
                                var deleteCount = this.deleteFids.length
                                if (deleteCount > 0) {
                                    WSConn.sendMsg(C2L.C2L_UPLOAD_DELETE, { Wid: this.vueUploadWork.wid, Fids: this.deleteFids })
                                    this.deleteFids = []
                                }
                                //计算增加
                                var uploadCount = 0
                                var len = this.vueUploadWork.items.length
                                for (var i = 0; i < len; i++) {
                                    var item = this.vueUploadWork.items[i]
                                    if (item.state == UploadItemState.Base64) {
                                        //只要有一个增加,就加入loading
                                        this.LoadingDict[this.vueUploadWork.wid] = {
                                            uploadingBufferedAmount:this.vueUploadWork.uploadingBufferedAmount,
                                            uploadingSum:this.GetUploadCount(this.vueUploadWork.items),
                                            items:this.vueUploadWork.items,
                                        }
                                        //
                                        WSConn.sendMsg(C2L.C2L_UPLOAD_ADD, {
                                            Wid: this.vueUploadWork.wid,
                                            TempId: item.TempId,
                                            Kind: item.Kind,
                                            Name: item.Name,
                                            Data: item.src.split('base64,').pop() //取 data:image/png;base64, 后面的值
                                        })
                                        uploadCount++
                                    }
                                }
                                var work: WorkSingle = ProcessData.WorkMap[this.vueUploadWork.wid]
                                if (work) {
                                    work.uploading = uploadCount > 0
                                    //刷新work格子的状态
                                    ProcessManager.WorkEdit(work)
                                }
                                //
                                this.vueUploadWork.submitEnabled = false
                                //
                                if (uploadCount > 0) {
                                    this.vueUploadWork.uploadTaskState = UploadTaskState.Uploading
                                    this.vueUploadWork.uploadingSum = uploadCount
                                    this.vueUploadWork.uploadingCount = 0
                                    // console.log("[debug]", 'WSConn.ws.bufferedAmount start', WSConn.ws.bufferedAmount)
                                    this.vueUploadWork.uploadingBufferedAmount = WSConn.ws.bufferedAmount
                                    this.UpdateUploadProcess()
                                } else {
                                    if (deleteCount > 0) {

                                    } else {
                                        this.CloseUploadWork()//这种情况应该进不来, 因为没有上传/删除文件时 确定按钮无法点击
                                    }
                                }
                            }
                            //删除确认
                            if (this.deleteFids.length > 0) {
                                var uploadCount: number = this.GetUploadCount(this.vueUploadWork.items)
                                if (uploadCount > 0) {
                                    Common.Warning(null, e, function (e: Event) {
                                        _doSubmit()
                                    }, `即将删除${this.deleteFids.length}张图片,\n上传${uploadCount}张图片,\n删除后不可恢复，确认删除吗？`)
                                } else {
                                    Common.Warning(null, e, function (e: Event) {
                                        _doSubmit()
                                    }, `即将删除${this.deleteFids.length}张图片,\n删除后不可恢复，确认删除吗？`)
                                }
                            } else {
                                _doSubmit()
                            }
                        },
                        onClose: () => {
                            this.CloseUploadWork()
                        }
                    }
                }).$mount()
                Common.InsertBeforeDynamicDom(this.vueUploadWork.$el)
                this.vueUploadWork.$el.addEventListener('drop', this.OnDomDragDrop.bind(this))
                this.vueUploadWork.$el.addEventListener('paste', this.OnDomPaste.bind(this))
                _show()
            })
        } else {
            _show()
        }
    }
    CloseUploadWork() {
        this.IsShow = false
        clearTimeout(this.UpdateUploadProcessTimeoutId)
        clearTimeout(this.UploadCompleteAutoCloseTimeId)
        $(this.vueUploadWork.$el).fadeOut(Config.FadeTime)
        $(document).off('dragleave drop dragenter dragover')
        PopManager.CancelMouseOut(this.vueUploadWork.$el)
    }
    //上传完成后自动关闭, 现在不要这个需求了
    UploadCompleteAutoCloseTimeId: number = -1
    UploadCompleteAutoClose() {
        /*  this.UploadCompleteAutoCloseTimeId = setTimeout(() => {
             this.CloseUploadWork()
         }, 2000); */
    }
    //模拟进度条进度
    UpdateUploadProcessTimeoutId: number = -1
    UpdateUploadProcess() {
        clearTimeout(this.UpdateUploadProcessTimeoutId)
        if (this.IsShow && this.vueUploadWork.uploadTaskState==UploadTaskState.Uploading && this.vueUploadWork.uploadingBufferedAmount>0) {
            // console.log("[debug]",WSConn.ws.bufferedAmount,"=`WSConn.ws.bufferedAmount`")
            var percent = (this.vueUploadWork.uploadingBufferedAmount - WSConn.ws.bufferedAmount) / this.vueUploadWork.uploadingBufferedAmount
            percent = Math.floor(percent*100)
            percent = Math.min(Math.max(percent,0),100)
            this.vueUploadWork.uploadingPercent =  percent
            if(percent<100){
                this.UpdateUploadProcessTimeoutId = setTimeout(() => { this.UpdateUploadProcess() }, 10);
            }
        }
    }
    //work评价弹出的附件列表
    vueWorkFileBox: CombinedVueInstance1<{ wid: number, items: FileSingle[] }>
    ShowProcessWorkFileBox(wid: number): void {
        var work: WorkSingle = ProcessData.WorkMap[wid]
        if (!work) {
            console.log("[warn]", `work wid(${wid}) can not find`)
            return;
        }
        var _show = () => {
            //刷新数据
            this.vueWorkFileBox.wid = wid
            //改成了 没有数据或空数据 也显示附件框 所以这里先注释掉
            // if (!work.FileList || work.FileList.length == 0 || !work.FileList[0].Fid) {//没有数据或空数据时不显示附件
            // this.vueWorkFileBox.items = []
            // } else {
            this.vueWorkFileBox.items = this.InitAueItems(work.FileList)
            // }
        }
        //
        if (this.vueWorkFileBox == null) {//重复修改这个 无效,不知道为什么
            Loader.LoadVueTemplate(this.AuePath + 'ProcessWorkFileBox', (txt) => {
                this.vueWorkFileBox = new Vue({
                    template: txt,
                    data: {
                        wid: wid,
                        items: []
                    },
                    methods: {
                        //图片点击
                        onImageClick: (index: number) => {
                            //拿出有图的
                            var rs: ImageShowcaseImage[] = []
                            var rsIndex: number
                            var len = this.vueWorkFileBox.items.length
                            for (var i = 0; i < len; i++) {
                                var item = this.vueWorkFileBox.items[i]
                                if (item.state == UploadItemState.Url) {
                                    rs.push({ src: item.srcOri, name: item.Name })
                                }
                                if (i == index) {
                                    rsIndex = rs.length - 1
                                }
                            }
                            this.ShowImageShowcase(rs, rsIndex + 1)
                        },
                    }
                }).$mount()
                $('#editScore').find('.fileBox').replaceWith(this.vueWorkFileBox.$el)
                _show()
            })
        } else {
            _show()
        }
    }
    //选择文件事件
    OnSelectFile(e: Event): void {
        // console.log("[debug]", `OnSelectFile`, e)
        var len = (e.target as HTMLInputElement).files.length
        for (var i = 0; i < len; i++) {
            var file = (e.target as any).files[i]
            this.DoAddFile(file)
        }
        (e.target as HTMLInputElement).value = ''//选择相同的东西时 input[file]不会触发change事件, 把value设置为''才能保证下次继续触发change
    }
    //拖拽事件
    OnDomDragDrop(e: DragEvent): void {
        if (this.IsShow == false || this.vueUploadWork.uploadTaskState==UploadTaskState.Uploading) { return }
        // console.log("[debug]", "drag drop e:", e)
        var fileList = e.dataTransfer.files; //获取文件对象
        //检测是否是拖拽文件到页面的操作
        if (fileList.length == 0) {
            // console.log("[warn]", "DragDrop fileList.length=0")
            return;
        }
        //检测文件是不是图片
        var len = fileList.length
        for (var i = 0; i < len; i++) {
            var file = fileList[i]
            this.DoAddFile(file)
        }
    }
    //粘贴图片事件
    OnDomPaste(e: ClipboardEvent): void {
        if (this.IsShow == false || this.vueUploadWork.uploadTaskState==UploadTaskState.Uploading) { return }
        // console.log("[debug]", "paste e:", e)
        if (Common.IsIE()) {
            //IE的e是DragEvent 但没正确的粘贴数据  好在IE11时 contenteditable="true" 可以粘贴进去chrome反而贴不进去 
            //IE10就没办法了
            // console.log("[debug]", "This is IE");
            return
        }
        if (e.clipboardData) {
            if (e.clipboardData.items.length == 0) {
                // console.log("[warn]", "e.clipboardData.items.length", 0);
                return
            }
            var len = e.clipboardData.items.length
            for (var i = 0; i < len; i++) {
                var item = e.clipboardData.items[i]
                // console.log("[debug]", "type:", i, ':', item.type)
                if (item.type.indexOf('image') > -1) {
                    // console.log("[debug]", "item is image");
                    var file = item.getAsFile();//读取e.clipboardData中的数据
                    if (file) {
                        //粘贴文件名始终时image,所以需要给一个随即名
                        this.DoAddFile(file, `paste_${new Date().format('yyyyMMdd_hhmm')}_${i}`)
                    } else {
                        // console.log("[debug]", "getAsFile err");
                    }
                } else {
                    // console.log("[debug]", "item is not image");
                    // console.log("[debug]", "item.getAsFile():", item.getAsFile());
                }
            }
        } else {
            // console.log("[warn]", "e.clipboardData=null", e);
        }
    }
    //移除文件
    DoDeleteFile(index: number): void {
        this.vueUploadWork.uploadTaskState = UploadTaskState.None
        var item = this.vueUploadWork.items[index]
        this.vueUploadWork.items.splice(index, 1)
        if (item.Fid > 0) {
            //Fid保存下来,等onSubmit时一起提交
            this.deleteFids.push(item.Fid)
        }
        //如果删除的是新增加的,这时需要检测是否重新检测CheckSubmitEnabled ,而且还要检测是否有Reading
        this.vueUploadWork.submitEnabled = this.CheckSubmitEnabled()
        //尾部补充一个新的
        var lastItem = this.vueUploadWork.items[this.vueUploadWork.items.length - 1]
        var item: FileSingle = {
            TempId: this.VueTempId++,
            state: (lastItem.state == UploadItemState.Base64 || lastItem.state == UploadItemState.Url) ? UploadItemState.Add : UploadItemState.None,
        }
        this.vueUploadWork.items.push(item)
    }
    CheckSubmitEnabled(): boolean {
        if (this.ReadingCount > 0) {
            return false
        }
        if (this.deleteFids.length > 0) {
            return true
        }
        var len = this.vueUploadWork.items.length
        for (var i = 0; i < len; i++) {
            var item = this.vueUploadWork.items[i]
            if (item.state == UploadItemState.Base64) {
                return true
                // break
            }
        }
        return false
    }
    //计算需要上传的图片数量
    GetUploadCount(items: FileSingle[]): number {
        var count: number = 0
        var len = items.length
        for (var i = 0; i < len; i++) {
            var item = items[i]
            if (item.state == UploadItemState.Base64) {
                count++
            }
        }
        return count
    }
    //显示大图查看器
    vueImageShowcase: CombinedVueInstance1<{ IsShow: boolean, currImageSrc: string, currImageName: string, currPage: number, totalPage: number, images: ImageShowcaseImage[] }>
    currImageEle: JQuery<HTMLElement>
    ShowImageShowcase(images: ImageShowcaseImage[], currPage: number) {
        if (this.vueImageShowcase == null) {
            Loader.LoadVueTemplate(Common.AuePath + 'ImageShowcase', (txt) => {
                this.vueImageShowcase = new Vue({
                    template: txt,
                    data: {
                        IsShow: true,
                        currImageSrc: '',
                        currImageName: '',
                        currPage: 1,
                        totalPage: 1,
                        images: [],
                    },
                    methods: {
                        prevPage: () => {
                            if (this.vueImageShowcase.currPage > 1) {
                                this.vueImageShowcase.currPage--
                            } else {
                                this.vueImageShowcase.currPage = this.vueImageShowcase.images.length
                            }
                            this._setImageShowcaseImage()
                        },
                        nextPage: () => {
                            if (this.vueImageShowcase.currPage < this.vueImageShowcase.images.length) {
                                this.vueImageShowcase.currPage++
                            } else {
                                this.vueImageShowcase.currPage = 1
                            }
                            this._setImageShowcaseImage()
                        },
                        onImageLoad: (e: Event) => {
                            console.log("[debug]", "onImageLoad e:", e)
                            var img: HTMLImageElement = e.target as HTMLImageElement
                            console.log("[debug]", img.naturalWidth, img.naturalHeight)
                            console.log("[debug]", this.vueImageShowcase.$el.clientWidth, this.vueImageShowcase.$el.clientHeight)
                            this.currImageEle.show()
                            //修改图片位置,让它居中
                            var gapLeftRight = 80;//左右留空
                            var gapTop = 40;//上留空
                            var gapBottom = 60;//下留空
                            var maxWidth: number = this.vueImageShowcase.$el.clientWidth - gapLeftRight * 2;
                            var maxHeight: number = this.vueImageShowcase.$el.clientHeight - gapTop - gapBottom;
                            var rate = img.naturalWidth / img.naturalHeight
                            if (img.naturalWidth <= maxWidth && img.naturalHeight <= maxHeight) {
                                img.width = img.naturalWidth;
                                img.height = img.naturalHeight;
                            } else if (img.naturalWidth <= maxWidth) {
                                //仅高溢出
                                img.height = maxHeight;
                                img.width = maxHeight * rate;
                            } else if (img.naturalHeight <= maxHeight) {
                                //仅宽溢出
                                img.width = maxWidth;
                                img.height = maxWidth / rate;
                            } else {
                                //高宽全溢出
                                var _height = maxHeight;
                                var _width = maxHeight * rate;
                                if (_width <= maxWidth) {
                                    img.width = _width
                                    img.height = _height
                                } else {
                                    img.width = maxWidth;
                                    img.height = maxWidth / rate;
                                }
                            }
                            this.currImageEle.xy((maxWidth - img.width) / 2 + gapLeftRight, (maxHeight - img.height) / 2 + gapTop)
                        },
                        onClose: this._closeImageShowcase.bind(this)
                    }
                }).$mount()
                Common.InsertBeforeDynamicDom(this.vueImageShowcase.$el)
                this._showImageShowcase(images, currPage)
                $(window).resize(() => {
                    this._closeImageShowcase()
                })
            })
        } else {
            this._showImageShowcase(images, currPage)
        }
    }
    _showImageShowcase(images: ImageShowcaseImage[], currPage: number) {
        $(this.vueImageShowcase.$el).xy(0, 0).show()
        Object.freeze(images)
        this.vueImageShowcase.images = images
        this.vueImageShowcase.IsShow = true
        this.vueImageShowcase.currPage = currPage
        this.vueImageShowcase.totalPage = this.vueImageShowcase.images.length
        this.currImageEle = $(this.vueImageShowcase.$el).find('.big_img')
        this._setImageShowcaseImage()
    }
    _closeImageShowcase() {
        if (this.vueImageShowcase != null) {
            this.vueImageShowcase.IsShow = false
            $(this.vueImageShowcase.$el).hide()
        }
    }
    _setImageShowcaseImage() {
        var image = this.vueImageShowcase.images[this.vueImageShowcase.currPage - 1]
        if (this.vueImageShowcase.currImageSrc == image.src) {
            //相同的src不会触发变化 也不会触发load,没必要重复赋值
        } else {
            this.currImageEle.hide()//等load后再show
            this.vueImageShowcase.currImageSrc = image.src
        }
        this.vueImageShowcase.currImageName = image.name
    }
}

//上传任务总状态
enum UploadTaskState {
    None = 0,//空闲
    Uploading = 2,//上传中
    UploadComplete = 3,//上传完成
}
//上传文件状态
enum UploadItemState {
    None = 0,//空 占位
    Add = 1,//显示 增加 文字 , 点击后可以增加图片
    Base64 = 2,//有base64文件状态
    Url = 3,//有url文件状态 后端传来
    Reading = 4,//reading状态
}

enum FileKind {
    PNG = 1,
    JPG = 2,
    BMP = 3,
}

interface LoadingDictItem{
    uploadingSum:number;
    uploadingBufferedAmount:number;
    items:FileSingle[]
}

interface ImageShowcaseImage {
    src: string;
    name?: string;
}

var UploadManager = new UploadManagerClass()