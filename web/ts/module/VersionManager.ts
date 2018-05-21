
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

interface L2C_VersionAdd {
    Vid: uint64
    Ver: string
    Name: string
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
    AuePath: string = "version/" //模板所在目录
    //初始化
    Init() {
        Commond.Register(L2C.L2C_VERSION_ADD, this.L2C_VersionAdd.bind(this))
        Commond.Register(L2C.L2C_VERSION_DELETE, this.L2C_VersionDelete.bind(this))
        Commond.Register(L2C.L2C_VERSION_CHANGE_VER, this.L2C_VersionChangeVer.bind(this))
        Commond.Register(L2C.L2C_VERSION_CHANGE_NAME, this.L2C_VersionChangeName.bind(this))
        Commond.Register(L2C.L2C_VERSION_CHANGE_PUBLISH, this.L2C_VersionChangePublish.bind(this))
    }
    //注册函数
    RegisterFunc() {
    }
    get VersionList(): VersionSingle[] {
        return ProcessData.VersionList;
    }
    L2C_VersionAdd(data: L2C_VersionAdd) {
        var v: VersionSingle = {
            Vid: data.Vid,
            Ver: data.Ver,
            Name: data.Name,
            PublishList: []
        }
        for (var genre = GenreField.BEGIN; genre <= GenreField.SUMMARY; genre++) {
            v.PublishList.push({ Vid: v.Vid, Genre: genre, DateLine: '' })
        }
        //
        this.VersionList.unshift(v)
        ProcessData.VersionMap[v.Vid] = v
    }
    L2C_VersionDelete(data: L2C_VersionDelete) {
        var index = ArrayUtil.IndexOfAttr(this.VersionList, "Vid", data.Vid)
        if (index >= -1) {
            this.VersionList.splice(index, 1)
        }
        var v = ProcessData.VersionMap[data.Vid]
        delete ProcessData.VersionMap[data.Vid]
        if (v && v.PublishList) {
            var len = v.PublishList.length
            for (var i = 0; i < len; i++) {
                var p = v.PublishList[i]
                if (p.DateLine) {
                    delete ProcessData.VersionDateLineMap[p.DateLine]
                }
            }
        }
    }
    L2C_VersionChangeVer(data: L2C_VersionChangeVer) {
        var v = ProcessData.VersionMap[data.Vid]
        if (v) {
            v.Ver = 'temp'//FormatVer会导致newVer和input.value不一致,但可能newVer和item.Ver一样,需要把item.Ver设置为item.Ver, 此时如果vue值相同, 赋值是不会触发html变化,需要先赋另一个值
            v.Ver = data.Ver
        }
    }
    L2C_VersionChangeName(data: L2C_VersionChangeName) {
        var v = ProcessData.VersionMap[data.Vid]
        if (v) {
            v.Name = data.Name
        }
    }
    L2C_VersionChangePublish(data: L2C_VersionChangePublish) {
        var v = ProcessData.VersionMap[data.Vid]
        if (v && v.PublishList) {
            var len = v.PublishList.length
            for (var i = 0; i < len; i++) {
                var p = v.PublishList[i]
                if (p.Genre == data.Genre) {
                    p.DateLine = data.DateLine
                    if (p.DateLine) {
                        ProcessData.VersionDateLineMap[p.DateLine] = p
                    }
                    break
                }
            }
        }
    }
    //选择器
    VueSelect: CombinedVueInstance1<{}>
    BindSelect(domId: string, callback: Function) {
        if (this.VueSelect == null) {
            Loader.LoadVueTemplate(this.AuePath + "VersionSelect", (txt: string) => {
                this.VueSelect = new Vue({
                    el: domId,
                    template: txt,
                    data: {
                        versions: ProcessData.VersionList,
                    }
                })
                if (callback != null) {
                    callback(this.VueSelect.$el)
                }
            })
        } else {
            if (callback != null) {
                callback(this.VueSelect.$el)
            }
        }
    }
    //编辑 模板-功能列表
    VueEditList: CombinedVueInstance1<{ newVer: string, newName: string, versions: VersionSingle[] }>
    ShowEditList(e) {
        this.HideVersionList(false)
        ProcessPanel.HideMenu()
        //真正执行显示面板的函数
        var _show = () => {
            var pageX, pageY
            var uiEditMode = $('#editMode')
            if (uiEditMode.isShow()) {
                pageX = uiEditMode.x() + uiEditMode.width() + 5
                pageY = uiEditMode.y()
            }
            if (!pageX) pageX = e.pageX
            if (!pageY) pageY = e.pageY
            var plan = $(this.VueEditList.$el).xy(pageX, pageY).show().adjust(-5)
        }
        Loader.LoadVueTemplate(this.AuePath + "EditVersionList", (txt: string) => {
            this.VueEditList = new Vue({
                template: txt,
                data: {
                    newVer: '',
                    newName: '',
                    versions: ProcessData.VersionList,
                },
                methods: {
                    onAddVer: (isEnter: boolean = false) => {
                        this.VueEditList.newVer = this.FormatVer(this.VueEditList.newVer)
                        if (isEnter) {
                            $('#editVersionList_newName').get(0).focus()
                        }
                    },
                    onAdd: () => {
                        console.log("[debug]", "new Ver", this.VueEditList.newVer.trim().toString())
                        var data: C2L_VersionAdd = { Ver: this.VueEditList.newVer.trim().toString(), Name: this.VueEditList.newName.trim().toString() }
                        WSConn.sendMsg(C2L.C2L_VERSION_ADD, data)
                        this.VueEditList.newVer = ""
                        this.VueEditList.newName = ""
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
                            item.Ver = 'temp'//FormatVer会导致newVer和input.value不一致,但可能newVer和item.Ver一样,需要把item.Ver设置为item.Ver, 此时如果vue值相同, 赋值是不会触发html变化,需要先赋另一个值
                            item.Ver = newVer
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
            Common.InsertBeforeDynamicDom(this.VueEditList.$el)
            _show()
        })
    }
    HideVersionList(fade: boolean = true) {
        if (this.VueEditList) {
            if (fade) {
                $(this.VueEditList.$el).fadeOut(Config.FadeTime, function () {
                    $(this).remove()
                })

            } else {
                $(this.VueEditList.$el).remove()
            }
            this.VueEditList = null
        }
    }
    //版本编辑内容
    VueEditDetail: CombinedVueInstance1<{ versionList: VersionSingle }>
    ShowVersionDetail(arg: number | VersionSingle) {
        this.HideVersionDetail(false)
        var versionList: VersionSingle
        if (typeof (arg) == 'number') {
            versionList = this.VueEditList.versions.filter((item) => {
                if (item.Vid == arg as number) {
                    return true
                }
                return false
            })[0]
        } else {
            versionList = arg as VersionSingle
        }
        //
        var _show = () => {
            //为了和功能列表面板高度相同
            var pageX, pageY
            var uiList = $(this.VueEditList.$el)
            if (uiList.isShow()) {
                pageX = uiList.x() + uiList.width() + 5
                pageY = uiList.y()
            }
            var plan = $(this.VueEditDetail.$el).xy(pageX, pageY).show().adjust(-5)
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
        }
        Loader.LoadVueTemplate(this.AuePath + "EditVersionDetail", (txt: string) => {
            this.VueEditDetail = new Vue({
                template: txt,
                data: {
                    versionList: versionList
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
                    onClose: () => {
                        this.HideVersionDetail()
                        // ProcessPanel.HideMenu()
                    }
                }
            }).$mount()
            Common.InsertBeforeDynamicDom(this.VueEditDetail.$el)
            _show()
        })
    }
    HideVersionDetail(fade: boolean = true) {
        if (this.VueEditDetail) {
            if (fade) {
                $(this.VueEditDetail.$el).fadeOut(Config.FadeTime, function () {
                    $(this).remove()
                })
            } else {
                $(this.VueEditDetail.$el).remove()
            }
            this.VueEditDetail = null
        }
    }
    Hide() {
        this.HideVersionList()
        this.HideVersionDetail()
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
}
var VersionManager = new VersionManagerClass()