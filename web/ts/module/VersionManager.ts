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

interface TooltipItem {
    version?: VersionSingle
    publish?: PublishSingle
}


class VersionManagerClass {
    /**模板所在目录*/
    VuePath: string = "version/"
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
        var i1: number, i2: number
        var v1: VersionSingle, v2: VersionSingle
        var len = this.VersionList.length
        for (var i = 0; i < len; i++) {
            var version = this.VersionList[i]
            if (version.Vid == data.Vid1) {
                v1 = version
                i1 = i
            } else if (version.Vid == data.Vid2) {
                v2 = version
                i2 = i
            }
        }
        //
        var sort = v1.Sort
        v1.Sort = v2.Sort
        v2.Sort = sort
        //
        this.VueVersionList.versions.splice(i1, 1, ...this.VueVersionList.versions.splice(i2, 1, this.VueVersionList.versions[i1]))
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
            Loader.LoadVueTemplate(this.VuePath + "VersionSelect", (txt: string) => {
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
        Loader.LoadVueTemplate(this.VuePath + "EditVersionList", (txt: string) => {
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
                //找不到 btnEdit时的默认值
                pageX = uiList.x() + uiList.width() - 175
                pageY = uiList.y()
                //
                var index = ArrayUtil.IndexOfAttr(this.VueVersionList.versions, 'Vid', version.Vid)
                // console.log("[info]",index,":[index]",version.Vid,":[version.Vid]",version.Ver,":[version.Ver]")
                if (index > -1) {
                    var btnEdit = uiList.find('.btnEdit').get(index)//放到编辑按钮下面
                    if (btnEdit) {
                        pageX = uiList.x() + $(btnEdit).x() + $(btnEdit).outerWidth() / 2
                        pageY = uiList.y() + $(btnEdit).y() + $(btnEdit).outerHeight() + 2
                    }
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
            })
            this.ValidatePublishDateLine()
        }
        Loader.LoadVueTemplate(this.VuePath + "EditVersionDetail", (txt: string) => {
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
                    onDateClick: (e, item: PublishSingle, index: number) => {
                        if (!e.target.value || item.DateLine == e.target.value) {
                            var _dateLine = $(e.target).val()
                            if (!_dateLine) {
                                //找到前一个时间
                                while (index > 0) {
                                    index--
                                    if (this.VueVersionDetail.version.PublishList[index].DateLine) {
                                        _dateLine = this.VueVersionDetail.version.PublishList[index].DateLine
                                        break;
                                    }
                                }
                            }
                            DateTime.Open(e.target, _dateLine, (date) => {
                                $(e.target).val(date)
                                var data: C2L_VersionChangePublish = { Vid: item.Vid, Genre: item.Genre, DateLine: date }
                                WSConn.sendMsg(C2L.C2L_VERSION_CHANGE_PUBLISH, data)
                            })
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
                    if (_timestamp <= lastDateLineTimestamp) {
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
    VueTableHeaderTooltip: CombinedVueInstance1<{ currDateLine: string, items: TooltipItem[], IsWrite: boolean }>
    ShowTableHeaderTooltip(dateLine: string, x: number, y: number);
    ShowTableHeaderTooltip(dateLine: string, x: number, y: number, showWrite: boolean);
    ShowTableHeaderTooltip(vid: number, x: number, y: number);
    ShowTableHeaderTooltip(vid: number, x: number, y: number, showWrite: boolean);
    ShowTableHeaderTooltip(...args) {
        var x: number = args[1]
        var y: number = args[2]
        var showWrite: boolean
        if (args[3] == undefined) {
            showWrite = User.IsWrite
        } else {
            showWrite = Boolean(showWrite)
        }
        var _show = () => {
            var dateLine = null
            var items: TooltipItem[] = []
            if (typeof args[0] == 'string') {
                dateLine = args[0]
                //通过dateLine查询
                if (ProcessData.HasVersionDateLineMap(dateLine)) {
                    var pList: PublishSingle[] = ProcessData.VersionDateLineMap[dateLine]
                    var len = pList.length
                    for (var i = 0; i < len; i++) {
                        var p: PublishSingle = pList[i]
                        var v: VersionSingle = ProcessData.VersionMap[p.Vid]
                        this.ClearSpaceDayCount(v.PublishList)
                        items.push({ version: v, publish: p })
                    }
                    //
                    if (items.length == 1) {
                        var np = this.GetNextNearestPublish(dateLine, false, items[0].version)
                        if (np) {
                            np.SubDayCount = Common.DateLineSpaceDay(dateLine, np.DateLine)
                        }
                    }
                } else {
                    var nearestVersion = this.GetNearestVersion(dateLine)
                    if (nearestVersion) {
                        this.ClearSpaceDayCount(nearestVersion.PublishList)
                        //
                        var p = this.GetPrevNearestPublish(dateLine, false)
                        if (p) {
                            p.SubDayCount = -Common.DateLineSpaceDay(dateLine, p.DateLine)
                            items.push({ version: nearestVersion, publish: p })
                            var np = this.GetNextNearestPublish(dateLine, false)
                            if (np) {
                                np.SubDayCount = Common.DateLineSpaceDay(dateLine, np.DateLine)
                            }
                        }
                    }
                }
            } else {
                //通过vid查询
                var vid = args[0]
                var version: VersionSingle = ProcessData.VersionMap[vid]
                items.push({ version: version, publish: null })
                if (version.PublishList) {
                    var len = version.PublishList.length
                    for (var i = 0; i < len; i++) {
                        var p: PublishSingle = version.PublishList[i]
                        if (p) {
                            p.SubDayCount = 0
                        }
                    }
                }
            }
            //
            this.VueTableHeaderTooltip.currDateLine = dateLine
            this.VueTableHeaderTooltip.items = items
            this.VueTableHeaderTooltip.IsWrite = showWrite
            //
            $(this.VueTableHeaderTooltip.$el).css({ 'width': items.length > 1 ? items.length * 160 : 200 })
            this.VueTableHeaderTooltip.$nextTick(() => {
                $(this.VueTableHeaderTooltip.$el).find('.versionFullname').css({ 'max-width': items.length > 1 ? 140 : 200 })
                //nextTick后 outerHTML才能拿到渲染好的
                $('#workTips').xy(x, y).html(this.VueTableHeaderTooltip.$el.outerHTML)
                this.VueTableHeaderTooltip.$nextTick(() => {
                    //不nextTick, $el的width则无法传递给#workTips
                    $('#workTips').show().adjust(-5)
                })
            })
        }
        if (this.VueTableHeaderTooltip == null) {
            Loader.LoadVueTemplate(this.VuePath + 'TableHeaderTooltip', (txt: string) => {
                this.VueTableHeaderTooltip = new Vue({
                    template: txt,
                    data: {
                        currDateLine: '',
                        items: [],
                        IsWrite: false
                    },
                    methods: {
                        GetVersionFullname: this.GetVersionFullname.bind(this),
                        GetPublishName: this.GetPublishName.bind(this),
                    }
                }).$mount()
                _show()
            })
        } else {
            _show()
        }
    }
    /**显示进度页面 表格头 右键打开的菜单 */
    ShowTableHeaderMenu(dateLine: string, x: number, y: number) {
        var itemList: IPullDownMenuItem[] = []
        var pList: PublishSingle[] = ProcessData.VersionDateLineMap[dateLine]
        if (pList && pList.length > 0) {
            var len = pList.length
            if (len == 1) {
                this.ShowVersionList(pList[0].Vid, pList[0].Genre)
            } else {
                for (var i = 0; i < len; i++) {
                    var p: PublishSingle = pList[i]
                    var v: VersionSingle = ProcessData.VersionMap[p.Vid]
                    var item: IPullDownMenuItem = { Key: p.Vid, Label: `版本:${v.Ver} ${this.GetPublishName(p.Genre)}日期`, Data: p.Genre }
                    itemList.push(item)
                }
                Common.ShowPullDownMenu(x, y, itemList, (item: IPullDownMenuItem) => {
                    this.ShowVersionList(item.Key as number, item.Data as number)
                })
            }
        } else {
            var nearestVersion = this.GetNearestVersion(dateLine)
            if (nearestVersion) {
                this.ShowVersionList(nearestVersion.Vid)
            } else {
                this.ShowVersionList()
            }
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
    GetVersionFullname(vid: number): string;
    GetVersionFullname(version: VersionSingle): string;
    GetVersionFullname(...args): string {
        var version: VersionSingle
        if (typeof args[0] == 'number') {
            version = ProcessData.VersionMap[args[0]]
        } else {
            version = args[0]
        }
        return this.GetVersionVer(version.Vid) + (version.Name == '' ? '' : '-' + version.Name);
    }
    /**获取前面最近的version, 根据有begin来判断 */
    GetNearestVersion(dateLine: string): VersionSingle {
        var currTimestamp = Common.DateStr2TimeStamp(dateLine)
        //找到最近的BEGIN并且没有总结的日期的
        var nearestVersion: VersionSingle    //最近的version 判断BEGIN DateLine
        var nearestTimestamp: number
        var len = this.VersionList.length
        for (var i = 0; i < len; i++) {
            var version = this.VersionList[i]
            if (version.PublishList[0].DateLine) {
                var _timestamp = Common.DateStr2TimeStamp(version.PublishList[GenreField.BEGIN - 1].DateLine)
                if (currTimestamp > _timestamp) {
                    if (!nearestVersion || _timestamp > nearestTimestamp) {
                        nearestVersion = version
                        nearestTimestamp = _timestamp
                    }
                }
            }
        }
        if (nearestVersion) {//如果已经过了总结日期,说明已经结束了
            var _timestamp = Common.DateStr2TimeStamp(nearestVersion.PublishList[GenreField.SUMMARY - 1].DateLine)
            if (_timestamp < currTimestamp) {
                // console.log("[debug]", "已经结束了")
            } else {
                return nearestVersion
            }
        } else {
            // console.log("[debug]", "没日期")
        }
        return null
    }
    /**获取前面最近的publish */
    GetPrevNearestPublish(dateLine: string, equal: boolean, v: VersionSingle = null): PublishSingle {
        var nearestVersion: VersionSingle;
        if (v) {
            nearestVersion = v
        } else {
            nearestVersion = this.GetNearestVersion(dateLine)
        }
        if (nearestVersion) {
            var currTimestamp = Common.DateStr2TimeStamp(dateLine)
            var nextNearestPublish: PublishSingle
            var nextNearestTimestamp: number
            var len = nearestVersion.PublishList.length
            for (var i = 0; i < len; i++) {
                var p = nearestVersion.PublishList[i]
                if (p.DateLine) {
                    var _timestamp = Common.DateStr2TimeStamp(p.DateLine)
                    if (currTimestamp > _timestamp || (equal && currTimestamp == _timestamp)) {
                        if (!nextNearestPublish || (_timestamp > nextNearestTimestamp)) {
                            nextNearestPublish = p
                            nextNearestTimestamp = _timestamp
                        }
                    }
                }
            }
            return nextNearestPublish
        } else {
            return null
        }
    }
    /**获取后面最近的publish */
    GetNextNearestPublish(dateLine: string, equal: boolean, v: VersionSingle = null): PublishSingle {
        var nearestVersion: VersionSingle;
        if (v) {
            nearestVersion = v
        } else {
            nearestVersion = this.GetNearestVersion(dateLine)
        }
        if (nearestVersion) {
            var currTimestamp = Common.DateStr2TimeStamp(dateLine)
            var nextNearestPublish: PublishSingle
            var nextNearestTimestamp: number
            var len = nearestVersion.PublishList.length
            for (var i = 0; i < len; i++) {
                var p = nearestVersion.PublishList[i]
                if (p.DateLine) {
                    var _timestamp = Common.DateStr2TimeStamp(p.DateLine)
                    if (currTimestamp < _timestamp || (equal && currTimestamp == _timestamp)) {
                        if (!nextNearestPublish || _timestamp < nextNearestTimestamp) {
                            nextNearestPublish = p
                            nextNearestTimestamp = _timestamp
                        }
                    }
                }
            }
            return nextNearestPublish
        } else {
            return null
        }
    }
    ClearSpaceDayCount(pList: PublishSingle[]) {
        var len = pList.length
        for (var i = 0; i < len; i++) {
            var item = pList[i]
            item.SubDayCount = 0
        }
    }
}
var VersionManager = new VersionManagerClass()