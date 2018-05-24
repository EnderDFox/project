interface C2L_VersionAdd {
    Ver: string
    Name: string
}

interface C2L_VersionDelete {
    Vid: uint64
}

interface C2L_VersionChangeVer {
    Vid: uint64
    Ver: string
}

interface C2L_VersionChangeName {
    Vid: uint64
    Name: string
}

interface C2L_VersionChangePublish {
    Vid: uint64
    Genre: uint32
    DateLine: string
}

interface C2L_VersionChangeSort {
    Vid1: uint64
    Vid2: uint64
}

interface L2C_VersionAdd {
    VersionSingle: VersionSingle
}

interface L2C_VersionDelete {
    Vid: uint64
}

interface L2C_VersionChangeVer {
    Vid: uint64
    Ver: string
}

interface L2C_VersionChangeName {
    Vid: uint64
    Name: string
}

interface L2C_VersionChangePublish {
    Vid: uint64
    Genre: uint32
    DateLine: string
}
class VersionManagerClass {
    /**模板所在目录*/
    AuePath: string = "version/"
    /**显示的最大数量*/
    ListShowMax: number = 5
    /**初始化*/
    Init() {
        Commond.Register(L2C.L2C_VERSION_ADD, this.onL2C_VersionAdd.bind(this))
        Commond.Register(L2C.L2C_VERSION_DELETE, this.onL2C_VersionDelete.bind(this))
        Commond.Register(L2C.L2C_VERSION_CHANGE_VER, this.onL2C_VersionChangeVer.bind(this))
        Commond.Register(L2C.L2C_VERSION_CHANGE_NAME, this.onL2C_VersionChangeName.bind(this))
        Commond.Register(L2C.L2C_VERSION_CHANGE_PUBLISH, this.onL2C_VersionChangePublish.bind(this))
        Commond.Register(L2C.L2C_VERSION_CHANGE_SORT, this.onL2C_VersionChangeSort.bind(this))
    }
    //注册函数
    RegisterFunc() {
    }
    get VersionList(): VersionSingle[] {
        return ProcessData.VersionList;
    }
    onL2C_VersionAdd(data: L2C_VersionAdd) {
        var v: VersionSingle = {
            Vid: data.VersionSingle.Vid,
            Ver: data.VersionSingle.Ver,
            Name: data.VersionSingle.Name,
            Sort: data.VersionSingle.Sort,
            PublishList: []
        }
        for (var genre = GenreField.BEGIN; genre <= GenreField.SUMMARY; genre++) {
            v.PublishList.push({ Vid: v.Vid, Genre: genre, DateLine: '' })
        }
        //
        this.VersionList.unshift(v)
        ProcessData.VersionMap[v.Vid] = v
    }
    onL2C_VersionDelete(data: L2C_VersionDelete) {
        var index = ArrayUtil.IndexOfAttr(this.VersionList, "Vid", data.Vid)
        if (index >= -1) {
            //其他的修改sort, 新增的sort最大, 所以如果删掉一个, 
            for (var i = index + 1; i < this.VersionList.length; i++) {
                var otherVersion = this.VersionList[i]
                otherVersion.Sort--
            }
            //删除吧
            this.VersionList.splice(index, 1)
        }
        var v = ProcessData.VersionMap[data.Vid]
        if (v) {
            delete ProcessData.VersionMap[data.Vid]
            if (v && v.PublishList) {
                var len = v.PublishList.length
                for (var i = 0; i < len; i++) {
                    var p = v.PublishList[i]
                    this.DoPublishDelete(p)
                }
            }
            this.RefreshMode(data.Vid)
            if (this.VueVersionDetail && this.VueVersionDetail.version.Vid == v.Vid) {
                this.HideVersionDetail()
            }
        }
    }
    onL2C_VersionChangeVer(data: L2C_VersionChangeVer) {
        var v = ProcessData.VersionMap[data.Vid]
        if (v) {
            //FormatVer可能会导致 newVer!=input.value,但 newVer==item.Ver, 需要把item.Ver设置为item.Ver, 此时如果vue值相同, 赋值是不会触发html变化,需要先赋另一个值
            Vue.set(v, "Ver", data.Ver)
            this.RefreshMode(data.Vid)
        }
    }
    onL2C_VersionChangeName(data: L2C_VersionChangeName) {
        var v = ProcessData.VersionMap[data.Vid]
        if (v) {
            v.Name = data.Name
            this.RefreshMode(data.Vid)
        }
    }
    onL2C_VersionChangePublish(data: L2C_VersionChangePublish) {
        var v = ProcessData.VersionMap[data.Vid]
        if (v && v.PublishList) {
            var len = v.PublishList.length
            for (var i = 0; i < len; i++) {
                var p = v.PublishList[i]
                if (p.Genre == data.Genre) {
                    var DateLineOld = p.DateLine.toString()
                    //先把旧的`DateLine`删了
                    this.DoPublishDelete(p)
                    //设置新`DateLine`
                    p.DateLine = data.DateLine
                    if (p.DateLine) {
                        if (!ProcessData.VersionDateLineMap[p.DateLine]) {
                            ProcessData.VersionDateLineMap[p.DateLine] = []
                        }
                        ProcessData.VersionDateLineMap[p.DateLine].push(p)
                        ProcessManager.PublishEdit(p)
                    }
                    break
                }
            }
        }
        //校验当前的
        if (this.VueVersionDetail && this.VueVersionDetail.version.Vid == data.Vid) {
            this.ValidatePublishDateLine()
        }
    }
    onL2C_VersionChangeSort(data: C2L_VersionChangeSort) {
        var x: number, y: number
        var v1: VersionSingle, v2: VersionSingle
        var len = this.VersionList.length
        for (var i = 0; i < len; i++) {
            var version = this.VersionList[i]
            if (version.Vid == data.Vid1) {
                v1 = version
                x = i
            } else if (version.Vid == data.Vid2) {
                v2 = version
                y = i
            }
        }
        //
        var sort = v1.Sort
        v1.Sort = v2.Sort
        v2.Sort = sort
        //
        this.VueVersionList.versions.splice(x, 1, ...this.VueVersionList.versions.splice(y, 1, this.VueVersionList.versions[x]))
    }
    //## EditMode 选择器
    VueSelect: CombinedVueInstance1<{ versions: VersionSingle[], ListShowMax: number, CurrVid: number }>
    /**
     * 
     * @param currVid 必须有的的currVid因为是当前的值
     */
    BindSelect(domId: string, currVid: number, callback: Function) {
        var _show = () => {
            this.VueSelect.versions = this.VersionList
            this.VueSelect.CurrVid = currVid
            this.VueSelect.$nextTick(() => {
                if (callback != null) {
                    callback(this.VueSelect.$el)
                }
            })
        }
        if (this.VueSelect == null) {
            Loader.LoadVueTemplate(this.AuePath + "VersionSelect", (txt: string) => {
                this.VueSelect = new Vue({
                    el: domId,
                    template: txt,
                    data: {
                        versions: [],
                        ListShowMax: this.ListShowMax,
                        CurrVid: 0,
                    },
                })
                _show()
            })
        } else {
            _show()
        }
    }
    //## 编辑`模板-功能列表`
    VueVersionList: CombinedVueInstance1<{ newVer: string, newName: string, versions: VersionSingle[], showVid: number, ListShowMax: number }>
    /** 
     * @showVid 默认打开的Vid
     * @showGenre 默认打开的publish需要, 闪一下
     */
    ShowVersionList(showVid = 0, showGenre = 0) {
        this.HideVersionList(false)
        ProcessPanel.HideMenu()
        //真正执行显示面板的函数
        var _show = () => {
            var pageX, pageY
            var uiEditMode = $('#editMode')
            if (uiEditMode.isShow()) {
                pageX = uiEditMode.x() + uiEditMode.width() + 5
                pageY = uiEditMode.y()
            } else {
                pageX = 160 + $(window).scrollLeft()
                pageY = 150 + $(window).scrollTop()
            }
            var plan = $(this.VueVersionList.$el).xy(pageX, pageY).show().adjust(-5)
            if (showVid) {
                this.ShowVersionDetail(showVid, showGenre)
            }
        }
        Loader.LoadVueTemplate(this.AuePath + "EditVersionList", (txt: string) => {
            this.VueVersionList = new Vue({
                template: txt,
                data: {
                    newVer: '',
                    newName: '',
                    versions: ProcessData.VersionList,
                    showVid: showVid,   //打开时闪一下 -> 现在改成常亮
                    ListShowMax: this.ListShowMax,
                },
                methods: {
                    onAddVer: (isEnter: boolean = false) => {
                        this.VueVersionList.newVer = this.FormatVer(this.VueVersionList.newVer)
                        if (isEnter) {
                            $('#editVersionList_newName').get(0).focus()
                        }
                    },
                    onAdd: () => {
                        console.log("[debug]", "new Ver", this.VueVersionList.newVer.trim().toString())
                        var data: C2L_VersionAdd = { Ver: this.VueVersionList.newVer.trim().toString(), Name: this.VueVersionList.newName.trim().toString() }
                        WSConn.sendMsg(C2L.C2L_VERSION_ADD, data)
                        this.VueVersionList.newVer = ""
                        this.VueVersionList.newName = ""
                    },
                    onEditVer: (e, item: VersionSingle) => {
                        //格式化为 正确的版本格式
                        var newVer = this.FormatVer(e.target.value)
                        if (newVer == "") {//再次修改就别设置 ""了
                            newVer = item.Ver.toString()
                        }
                        if (newVer != item.Ver.toString()) {
                            item.Ver = newVer
                            var data: C2L_VersionChangeVer = { Vid: item.Vid, Ver: newVer }
                            WSConn.sendMsg(C2L.C2L_VERSION_CHANGE_VER, data)
                        } else if (newVer != e.target.value) {
                            //FormatVer可能会导致 newVer!=input.value,但 newVer==item.Ver, 需要把item.Ver设置为item.Ver, 此时如果vue值相同, 赋值是不会触发html变化,需要先赋另一个值
                            Vue.set(item, 'Ver', newVer)
                        }
                    },
                    onEditName: (e, item: VersionSingle) => {
                        var newName: string = e.target.value
                        newName = newName.trim()
                        if (item.Name != newName) {
                            var data: C2L_VersionChangeName = { Vid: item.Vid, Name: newName }
                            WSConn.sendMsg(C2L.C2L_VERSION_CHANGE_NAME, data)
                        }
                    },
                    onSortUp: (e, item: VersionSingle, index: number) => {
                        var data: C2L_VersionChangeSort = { Vid1: item.Vid, Vid2: this.VersionList[index - 1].Vid }
                        WSConn.sendMsg(C2L.C2L_VERSION_CHANGE_SORT, data)
                    },
                    onSortDown: (e, item: VersionSingle, index: number) => {
                        var data: C2L_VersionChangeSort = { Vid1: item.Vid, Vid2: this.VersionList[index + 1].Vid }
                        WSConn.sendMsg(C2L.C2L_VERSION_CHANGE_SORT, data)
                    },
                    onDel: (e, item: VersionSingle, index: number) => {
                        Common.Warning(null, e, function () {
                            var data: C2L_VersionDelete = { Vid: item.Vid }
                            WSConn.sendMsg(C2L.C2L_VERSION_DELETE, data)
                        }, '删除后不可恢复，确认删除吗？');
                    },
                    onEdit: (e, item: VersionSingle) => {
                        this.ShowVersionDetail(item)
                    },
                    onClose: () => {
                        this.HideVersionList()
                        this.HideVersionDetail()
                        ProcessPanel.HideMenu()
                    },
                }
            }).$mount()
            Common.InsertBeforeDynamicDom(this.VueVersionList.$el)
            _show()
        })
    }
    HideVersionList(fade: boolean = true) {
        if (this.VueVersionList) {
            if (fade) {
                $(this.VueVersionList.$el).fadeOut(Config.FadeTime, function () {
                    $(this).remove()
                })

            } else {
                $(this.VueVersionList.$el).remove()
            }
            this.VueVersionList = null
        }
    }
    //版本编辑内容
    VueVersionDetail: CombinedVueInstance1<{ version: VersionSingle, ListShowMax: number }>
    ShowVersionDetail(showVid: number | VersionSingle, showGenre: number = 0) {
        this.HideVersionDetail(false)
        var version: VersionSingle
        if (typeof (showVid) == 'number') {
            version = this.VueVersionList.versions.filter((item) => {
                if (item.Vid == showVid as number) {
                    return true
                }
                return false
            })[0]
        } else {
            version = showVid as VersionSingle
            showVid = version.Vid
        }
        this.VueVersionList.showVid = showVid // 当前正打开的记录有变化
        //
        var _show = () => {
            //为了和功能列表面板高度相同
            var pageX, pageY
            var uiList = $(this.VueVersionList.$el)
            if (uiList.isShow()) {
                pageX = uiList.x() + uiList.width() + 5
                var index = ArrayUtil.IndexOfAttr(this.VueVersionList.versions, 'Vid', version.Vid)
                // console.log("[info]",index,":[index]",version.Vid,":[version.Vid]",version.Ver,":[version.Ver]")
                if (index > -1) {
                    var btnEdit = uiList.find('.btnEdit').get(index)//放到编辑按钮下面
                    if (btnEdit) {
                        pageY = uiList.y() + $(btnEdit).y() + $(btnEdit).outerHeight() + 2
                    } else {
                        pageY = uiList.y()
                    }
                } else {
                    pageY = uiList.y()
                }
            } else {
                //其实不应该进入这里
                pageX = 160 + $(window).scrollLeft()
                pageY = 150 + $(window).scrollTop()
            }
            var plan = $(this.VueVersionDetail.$el).xy(pageX, pageY).show().adjust(-5)
            //关闭日期
            plan.unbind().mousedown((e) => {
                if ($(e.target).attr('class') != 'date') {
                    DateTime.HideDate()
                }
                /*  if ($(e.target).attr('class') != 'select') {
                 $('#storeMenu').hide()
                 } */
            })
            //日期绑定
            plan.find('.date').unbind().click(function (this: HTMLInputElement) {
                DateTime.Open(this, $(this).val(), (date) => {
                    // console.log("[debug]","DateTime:",date)
                    $(this).val(date)
                    // $(this).trigger('change')
                    $(this).click()//change无法触发,只好用click
                })
            })
            this.ValidatePublishDateLine()
            // setTimeout(() => {
            // }, 1000);
            /*   Vue.nextTick(()=>{
                  this.ValidatePublishDateLine()
              })) */
        }
        Loader.LoadVueTemplate(this.AuePath + "EditVersionDetail", (txt: string) => {
            this.VueVersionDetail = new Vue({
                template: txt,
                data: {
                    version: version,
                    showGenre: showGenre,   //打开的索引,需要闪烁一下
                    ListShowMax: this.ListShowMax,
                },
                /*  filters: {
                     publishName:function(){
                         return 'iopioi'
                     },
                     // publishName: this.GetPublishName.bind(this),
                 }, */
                methods: {
                    publishName: this.GetPublishName.bind(this),
                    onDateClick: (e, item: PublishSingle) => {
                        // console.log("[info]","onClick Date",e.target.value)
                        if (e.target.value && item.DateLine != e.target.value) {
                            // console.log("[info]","onClick Date send",e.target.value)
                            var data: C2L_VersionChangePublish = { Vid: item.Vid, Genre: item.Genre, DateLine: e.target.value }
                            WSConn.sendMsg(C2L.C2L_VERSION_CHANGE_PUBLISH, data)
                        }
                    },
                    onDelete: (e, item: PublishSingle) => {
                        Common.Warning(null, e, function () {
                            var data: C2L_VersionChangePublish = { Vid: item.Vid, Genre: item.Genre, DateLine: '' }
                            WSConn.sendMsg(C2L.C2L_VERSION_CHANGE_PUBLISH, data)
                        }, '删除后不可恢复，确认删除吗？');
                    },
                    onClose: () => {
                        this.HideVersionDetail()
                        // ProcessPanel.HideMenu()
                    }
                }
            }).$mount()
            Common.InsertBeforeDynamicDom(this.VueVersionDetail.$el)
            _show()
        })
    }
    /**验证当前的 DateLine 有时间问题的 设置IsError=true */
    ValidatePublishDateLine() {
        var hasDateStart = Boolean(this.VueVersionDetail.version.PublishList[0].DateLine)
        var lastDateLineTimestamp = 0
        var lastPublish: PublishSingle
        var len = this.VueVersionDetail.version.PublishList.length
        for (var i = 0; i < len; i++) {
            var p = this.VueVersionDetail.version.PublishList[i]
            if (p.DateLine) {
                // console.log("[debug]", Common.DateStr2TimeStamp(p.DateLine))
                var _timestamp = Common.DateStr2TimeStamp(p.DateLine)
                if (i == 0) {
                    p.ErrorMsg = ''
                    lastDateLineTimestamp = _timestamp
                    lastPublish = p
                } else {
                    if (hasDateStart == false) {
                        //没设置start 却先设置其它时间了, 则start需要标红
                        this.VueVersionDetail.version.PublishList[0].ErrorMsg = '必须设置开始日期'
                    }
                    if (_timestamp < lastDateLineTimestamp) {
                        //后面的时间必须大于等于前面的时间,否则标红
                        p.ErrorMsg = `${this.GetPublishName(p.Genre)}日期必须晚于${this.GetPublishName(lastPublish.Genre)}日期`
                    } else {
                        p.ErrorMsg = ''
                    }
                    lastDateLineTimestamp = _timestamp
                    lastPublish = p
                }
            } else {
                p.ErrorMsg = ''
            }
        }
    }
    HideVersionDetail(fade: boolean = true) {
        if (this.VueVersionList) {
            this.VueVersionList.showVid = 0
        }
        if (this.VueVersionDetail) {
            if (fade) {
                $(this.VueVersionDetail.$el).fadeOut(Config.FadeTime, function () {
                    $(this).remove()
                })
            } else {
                $(this.VueVersionDetail.$el).remove()
            }
            this.VueVersionDetail = null
        }
    }
    Hide() {
        this.HideVersionList()
        this.HideVersionDetail()
    }
    /**根据日期决定打开的面板 */
    ShowVersionByDateLine(dateLine: string) {
        if (ProcessData.HasVersionDateLineMap(dateLine)) {
            var p: PublishSingle = ProcessData.VersionDateLineMap[dateLine][0]
            this.ShowVersionList(p.Vid, p.Genre)
        } else {
            this.ShowVersionList()
        }
    }
    /**显示进度页面 表格头 日期格子中的tooltip */
    ShowTableHeaderTooltip(dateLine: string, x: number, y: number) {
        var str = ``
        if (ProcessData.HasVersionDateLineMap(dateLine)) {
            var pList: PublishSingle[] = ProcessData.VersionDateLineMap[dateLine]
            if (pList.length > 1) {
                str += `<span style="color:#FF0000">警告:有多个版本日期</span><br/>`
                str += `<span style="color:#FF0000">点击右键编辑</span><br/>`
            }
            var len = pList.length
            for (var i = 0; i < len; i++) {
                var p: PublishSingle = pList[i]
                var v: VersionSingle = ProcessData.VersionMap[p.Vid]
                str += `<span style="max-width:144px;display:inline-block;" class="text-overflow-hide">版本:${this.GetVersionFullname(v)}</span><br/>`
                str += `<span class="sk_${p.Genre}">${this.GetPublishName(p.Genre)}日期</span><br/>`
                if (i < len - 1) {
                    str += `<hr/>`
                }
            }
        } else {
            str = `无版本`
        }
        $('#workTips').xy(x, y).show().adjust(-5).html(str)
    }
    /**显示进度页面 表格头 右键打开的菜单 */
    ShowTableHeaderMenu(dateLine: string, x: number, y: number) {
        var itemList: IPullDownMenuItem[] = []
        var pList: PublishSingle[] = ProcessData.VersionDateLineMap[dateLine]
        if (pList && pList.length > 0) {
            var len = pList.length
            for (var i = 0; i < len; i++) {
                var p: PublishSingle = pList[i]
                var v: VersionSingle = ProcessData.VersionMap[p.Vid]
                var item: IPullDownMenuItem = { Key: p.Vid, Label: `版本:${v.Ver} ${this.GetPublishName(p.Genre)}日期`, Data: p.Genre }
                itemList.push(item)
            }
            Common.ShowPullDownMenu(x, y, itemList, (item: IPullDownMenuItem) => {
                this.ShowVersionList(item.Key as number, item.Data as number)
            })
        } else {
            //TODO:
        }
    }
    DoPublishDelete(p: PublishSingle): void {
        if (p && p.DateLine) {
            ProcessData.DeleteVersionDateLineMap(p)
            if (ProcessData.HasVersionDateLineMap(p.DateLine)) {
                ProcessManager.PublishEdit(ProcessData.VersionDateLineMap[p.DateLine][0])//还有其它的日期,刷新一下
            } else {
                ProcessManager.PublishDelete(p.DateLine)//没有其它的日期, 删除掉吧
            }
        }
    }
    /**
     * 刷新对应的mode
     * @param vid 
     */
    RefreshMode(vid: number): void {
        for (var k in ProcessData.ModeMap) {
            var mode: ModeSingle = ProcessData.ModeMap[k]
            if (mode.Vid == vid) {
                if (!ProcessData.VersionMap[vid]) {
                    //已经是delete的vid
                    mode.Vid = 0
                }
                ProcessManager.ModeEdit(mode)
            }
        }
    }
    /**
     * 格式化版本号   只能是 数字和`.` 例如 1.3   4.5.6
     * @param ori 
     */
    FormatVer(ori: string): string {
        return ori.replace(/[^0-9\.]/g, '').trim()
    }
    //
    PublishGenreNameList: string[] = ['开始', '完结', '封存', '延期', '发布', '总结']
    GetPublishName(genre: number): string {
        return this.PublishGenreNameList[genre - 1]
    }
    //
    GetVersionVer(vid: number): string {
        var versionVer = ''
        if (vid) {
            var versionSingle = ProcessData.VersionMap[vid]
            if (versionSingle) {
                versionVer = versionSingle.Ver
            }
        }
        return versionVer
    }
    GetVersionFullname(version: VersionSingle): string {
        return this.GetVersionVer(version.Vid) + (version.Name == '' ? '' : '-' + version.Name);
    }
}
var VersionManager = new VersionManagerClass()