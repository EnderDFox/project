interface IVersionSimple {
    Vid?: number
    Ver?: string
    Name?: string
    PublishBegin?: IPublishSimple    //版本开始
    PublishEnd?: IPublishSimple      //版本完结
    PublishSeal?: IPublishSimple     //版本封存
    PublishDelay?: IPublishSimple    //版本延迟
    PublishPub?: IPublishSimple      //版本发布
    PublishSummary?: IPublishSimple  //版本总结
}
interface IPublishSimple {
    Vid?: number
    // genre?:number
    DateLine?: string
    DateLineTimestamp?: number
}

class VersionManagerClass {
    AuePath: string = "version/" //模板所在目录
    //初始化
    Init() {
        // WSConn.sendMsg(C2L.C2L_TPL_MODE_VIEW, {})
    }
    //注册函数
    RegisterFunc() {
    }
    //编辑 模板-功能列表
    VueEditList: CombinedVueInstance1<{ versions: IVersionSimple[] }>
    ShowEditList(e) {
        this.HideVersionList(false)
        ProcessPanel.HideMenu()
        //真正执行显示面板的函数
        var _show = () => {
            var pageX, pageY
            var editMode = $('#editMode')
            if (editMode.is(":visible")) {
                pageX = editMode.x() + editMode.width() + 5
                pageY = editMode.y()
            }
            if (!pageX) {
                pageX = e.pageX
            }
            if (!pageY) {
                pageY = e.pageY
            }
            var plan = $(this.VueEditList.$el).xy(pageX, pageY).show().adjust(-5)
            plan.find('.close').unbind().click(() => {
                this.HideVersionList()
                ProcessPanel.HideMenu()
            })
        }
        Loader.LoadVueTemplate(this.AuePath + "EditVersionList", (txt: string) => {
            this.VueEditList = new Vue({
                template: txt,
                data: {
                    newName: '',
                    versions: [
                        {
                            Vid: 1,
                            Ver: '1.0.1',
                            Name: '测试版本A',
                            PublishBegin: {
                                DateLine: '2018-04-01',
                            },
                            PublishEnd: {
                                DateLine: '2018-04-03',
                            },
                            PublishSeal: {
                                DateLine: '2018-04-05',
                            },
                            PublishDelay: {
                                DateLine: '2018-04-07',
                            },
                            PublishPub: {
                                DateLine: '2018-04-09',
                            },
                            PublishSummary: {
                                DateLine: '2018-04-11',
                            },
                        },
                        {
                            Vid: 2,
                            Ver: '1.0.2',
                            Name: '测试版本B',
                            PublishBegin: {
                                DateLine: '2018-05-01',
                            },
                            PublishEnd: {
                                DateLine: '2018-05-03',
                            },
                            PublishSeal: {
                                DateLine: '2018-05-05',
                            },
                            PublishDelay: {
                                DateLine: '2018-05-07',
                            },
                            PublishPub: {
                                DateLine: '2018-05-09',
                            },
                            PublishSummary: {
                                DateLine: '2018-05-11',
                            },
                        },
                    ]
                },
                methods: {
                    onAdd: () => {
                    },
                    onEditName: () => {
                    },
                    onDel: () => {
                    },
                    onEdit: (e, item: IVersionSimple) => {
                        this.ShowVersionDetail(item)
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
    VueEditDetail: CombinedVueInstance1<{ version: IVersionSimple }>
    ShowVersionDetail(arg: number | IVersionSimple) {
        this.HideVersionDetail(false)
        var version: IVersionSimple
        if (typeof (arg) == 'number') {
            version = this.VueEditList.versions.filter((item) => {
                if (item.Vid == arg as number) {
                    return true
                }
                return false
            })[0]
        } else {
            version = arg as IVersionSimple
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
            plan.find('.close').unbind().click(() => {
                this.HideVersionDetail()
                // ProcessPanel.HideMenu()
            })
        }
        Loader.LoadVueTemplate(this.AuePath + "EditVersionDetail", (txt: string) => {
            this.VueEditDetail = new Vue({
                template: txt,
                data: {
                    version: version
                },
                methods: {

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
}
var VersionManager = new VersionManagerClass()