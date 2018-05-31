interface IProcessFilterPack {
    BeginDate?: string
    EndDate?: string
    Vid?: number
    ModeName?: string
    ModeStatus?: number
    LinkName?: string
    LinkUserName?: string
    LinkStatus?: number
}

interface IFilterItemTextField {
    Uuid: number
    Name: string
    InputName: string
    Placeholder: string
    Value: string
}

interface IFilterItemCheckBox {
    Uuid: number
    Name: string
    InputName: string
    Inputs: IFilterItemCheckBoxInput[]
    ShowLen: number
    ShowLenMin: number
    ShowLenMax: number
}

interface IFilterItemCheckBoxInput {
    Value: number | string
    Label: string
    Checked: boolean
    Title: string
}

//进度筛选
class ProcessFilterClass {
    //数据包
    Pack: IProcessFilterPack = {};
    //初始化
    Init() {
        //数据初始
        this.PackInit()
        //
        this.InitVue()
    }
    //搜索初始化
    PackInit() {
        this.Pack.BeginDate = Common.GetDate(-7)
        this.Pack.EndDate = Common.GetDate(31)
        this.Pack.ModeName = ''
        this.Pack.Vid = 0
        this.Pack.ModeStatus = 0
        this.Pack.LinkStatus = 0
        this.Pack.LinkName = ''
        this.Pack.LinkUserName = ''
    }
    //填充Input
    FillInput() {
        var plan = $(this.VueFilter.$el)
        $.each(this.Pack, function (k, v) {
            plan.find('input[name="' + k + '"]').val(v)
        })
    }
    //填充Pack
    FillPack() {
        var self = this
        var plan = $(this.VueFilter.$el)
        plan.find('input').each(function (this: HTMLInputElement) {
            self.Pack[this.name] = this.value
        })
    }
    //设置Pack
    SetPack(key, val) {
        this.Pack[key] = val
    }
    //重置Pack
    ResetPack() {
        var plan = $(this.VueFilter.$el)
        plan.find('input').val('')
        this.PackInit()
        this.FillInput()
    }
    //获取数据
    GetPack() {
        var param = {
            'BeginDate': this.Pack.BeginDate,
            'EndDate': this.Pack.EndDate
        }
        return param
    }
    //绑定事件
    BindActions() {
        //面板事件
        var self = this
        var plan = $(this.VueFilter.$el)
        plan.find('.cancel,.close').unbind().click(function () {
            plan.fadeOut(Config.FadeTime)
            DateTime.HideDate()
            Common.HidePullDownMenu()
        })
        //关闭日期
        plan.unbind().mousedown(function (e) {
            if ($(e.target).attr('class') != 'date') {
                DateTime.HideDate()
            }
            if ($(e.target).attr('class') != 'select') {
                Common.HidePullDownMenu()
            }
        })
        //日期绑定
        plan.find('.date').unbind().click(function (this: HTMLInputElement) {
            var dom = this
            DateTime.Open(dom, $(dom).val(), function (date) {
                $(dom).val(date)
            })
        })
        //归档绑定
        plan.find('.select[stype="ModeStatus"],.select[stype="LinkStatus"]').unbind().click(function (this: HTMLElement, e) {
            var dom = this
            var left = $(this).offset().left /*- menu.outerWidth() - 2*/
            var top = $(this).offset().top + $(this).outerHeight() + 2
            var stype = $(this).attr('stype')
            var itemList: IPullDownMenuItem[] = [
                { Key: -1, Label: '选择全部' },
                { Key: 0, Label: '进行中的' },
                { Key: 1, Label: '已归档的' },
            ]
            Common.ShowPullDownMenu(left, top, itemList, (item) => {
                $(dom).val(item.Label)
                self.SetPack(stype, item.Key)
            })
        })
        //用户搜索
        plan.find('.user').unbind().bind('input', function (this: HTMLInputElement) {
            var html = ''
            var dom = this
            var sear = $('#searchUser')
            $.each(Data.UserList, function (k, v) {
                if (dom.value == '') {
                    return
                }
                if (v.Name.indexOf(dom.value) == -1) {
                    return
                }
                html += '<li uid="' + v.Uid + '">' + v.Name + '</li>'
            })
            if (html != '') {
                var top = $(dom).offset().top + $(dom).outerHeight()
                var left = $(dom).offset().left
                sear.css({ top: top, left: left }).unbind().delegate('li', 'click', function () {
                    sear.hide()
                    $(dom).val($(this).html())
                }).html(html).show()
            } else {
                sear.hide()
            }
        }).blur(function (this: HTMLInputElement, e) {
            self.SetPack('LinkUid', $.trim(this.value))
        })
        //选中效果
        plan.find('input:not([readonly])').focus(function () {
            $(this).select()
        })
    }
    //# Vue
    VueUuid = 0
    VuePath = 'process/'
    VueFilter: CombinedVueInstance1<{
        itemVid: IFilterItemCheckBox, itemModeName: IFilterItemTextField, itemModeStatus: IFilterItemCheckBox,
        itemLinkName: IFilterItemTextField, itemLinkUserName: IFilterItemTextField, itemLinkStatus: IFilterItemCheckBox
    }>
    InitVue() {
        Loader.LoadVueTemplateList([`${this.VuePath}FilterItemTextField`, `${this.VuePath}FilterItemCheckBox`, `${this.VuePath}ProcessFilter`], (tplList: string[]) => {
            //注册组件
            Vue.component('FilterItemTextField', {
                template: tplList[0],
                props: {
                    item: Object
                },
                data: function () {
                    return {}
                },
                methods: {

                }
            })
            Vue.component('FilterItemCheckBox', {
                template: tplList[1],
                props: {
                    item: Object
                },
                data: function () {
                    return {}
                },
                methods: {

                }
            })
            //初始化 VueFilter 
            this.VueFilter = new Vue({
                template: tplList[2],
                data: {
                    itemVid: null,
                    itemModeName: null,
                    itemModeStatus: null,
                    itemLinkName: null,
                    itemLinkUserName: null,
                    itemLinkStatus: null,
                },
                methods: {
                    onSubmit: () => {
                        var vids: number[] = this.GetCheckBoxValues(this.VueFilter.itemVid.Inputs)
                        console.log("[info]", vids, ":[vids]")
                        this.GetTextFieldValues(this.VueFilter.itemModeName)
                        //# backup
                        // this.FillPack()
                        /*  Main.Over(() => {
                             ProcessPanel.Index()
                        }) */
                        // ProcessPanel.HideMenu()
                        this.HideFilter(true)
                    }
                }
            }).$mount()
            //放入html
            Common.InsertBeforeDynamicDom(this.VueFilter.$el)
            //初始化数据
            this.VueFilter.itemModeName = { Uuid: this.VueUuid++, Name: '功能名称', InputName: 'ModeName', Placeholder: '输入功能名称', Value: '' }
            //
            this.VueFilter.itemModeStatus = {
                Uuid: this.VueUuid++, Name: '功能归档', InputName: 'ModeStatus', ShowLen: -1, ShowLenMin: 0, ShowLenMax: 0,
                Inputs: [
                    { Value: '0', Label: '进行中的', Checked: false, Title: '', },
                    { Value: '1', Label: '已归档的', Checked: false, Title: '', },
                ]
            }
            //
            this.VueFilter.itemLinkName = { Uuid: this.VueUuid++, Name: '流程名称', InputName: 'LinkName', Placeholder: '输入流程名称', Value: '' }
            this.VueFilter.itemLinkUserName = { Uuid: this.VueUuid++, Name: '流程负责', InputName: 'LinkUserName', Placeholder: '输入负责人', Value: '' }
            //
            this.VueFilter.itemLinkStatus = {
                Uuid: this.VueUuid++, Name: '流程归档', InputName: 'LinkStatus', ShowLen: -1, ShowLenMin: 0, ShowLenMax: 0,
                Inputs: [
                    { Value: '0', Label: '进行中的', Checked: false, Title: '', },
                    { Value: '1', Label: '已归档的', Checked: false, Title: '', },
                ]
            }
            //填充数据
            this.FillInput()
            //绑定事件
            this.BindActions()
        })
    }
    //显示面板
    ShowFilter(o, e) {
        var self = this
        var plan = $(this.VueFilter.$el)
        var top = $(o).offset().top + 50
        var left = $(o).offset().left - plan.outerWidth()
        plan.css({ top: top, left: left }).show()
        //vue data
        //初始化data
        var item: IFilterItemCheckBox
        //version vid
        item = {
            Uuid: this.VueUuid++, Name: '功能版本', InputName: 'Vid', ShowLen: VersionManager.ListShowMax, ShowLenMin: VersionManager.ListShowMax, ShowLenMax: 20,
            Inputs: []
        }
        // var len = Math.min(ProcessData.VersionList.length, VersionManager.ListShowMax)
        var len = ProcessData.VersionList.length
        for (var i = 0; i < len; i++) {
            var version = ProcessData.VersionList[i];
            item.Inputs.push({ Value: version.Vid, Label: version.Ver, Checked: false, Title: VersionManager.GetVersionFullname(version), })
        }
        this.VueFilter.itemVid = item
        //版本刷新 每次打开时刷新一下版本
        var oldVid = this.Pack.Vid
        if (oldVid > 0) {
            var oldVidLabel = null
            var len = Math.min(ProcessData.VersionList.length, VersionManager.ListShowMax)
            for (var i = 0; i < len; i++) {
                var version = ProcessData.VersionList[i];
                if (oldVid == version.Vid) {
                    oldVidLabel = VersionManager.GetVersionFullname(version).toString()
                }
            }
            if (oldVidLabel == null) {
                //old vid发生变化, 需要重设
                this.SetPack('Vid', 0)
                plan.find('.select[stype="Vid"]').val("版本号")
            } else {
                //全名有可能在版本编辑中变化了,这里需要重新设置
                plan.find('.select[stype="Vid"]').val(oldVidLabel)
            }
        }
        //版本 绑定input打开menu 每次打开时刷新一下版本
        plan.find('.select[stype="Vid"]').unbind().click(function (e) {
            var dom = this
            var left = $(this).offset().left
            var top = $(this).offset().top + $(this).outerHeight() + 2
            //
            var itemList: IPullDownMenuItem[] = [{ Key: 0, Label: '空' }]
            var len = Math.min(ProcessData.VersionList.length, 10)
            for (var i = 0; i < len; i++) {
                var version = ProcessData.VersionList[i];
                var item = { Key: parseInt(version.Vid.toString()), Label: VersionManager.GetVersionFullname(version).toString() }
                itemList.push(item)
            }
            //
            Common.ShowPullDownMenu(left, top, itemList, (item) => {
                if (item.Key == 0) {
                    $(dom).val("版本号")
                } else {
                    $(dom).val(item.Label)
                }
                self.SetPack('Vid', item.Key)
            })
        })
        //
    }
    HideFilter(fade) {
        if (this.VueFilter) {
            if (fade === void 0) { fade = true; }
            if (fade) {
                $(this.VueFilter.$el).fadeOut(Config.FadeTime)
            } else {
                $(this.VueFilter.$el).hide()
            }
        }
        Common.HidePullDownMenu()
    }
    //得到checkbox全部值
    GetCheckBoxValues(inputs: IFilterItemCheckBoxInput[]): number[] {
        var vals: number[] = []
        var len = inputs.length
        for (var i = 0; i < len; i++) {
            var input = inputs[i]
            if (input.Checked) {
                vals.push(parseInt(input.Value.toString()))
            }
        }
        return vals
    }
    //得到textField全部值
    GetTextFieldValues(item: IFilterItemTextField): string[] {
        var val = item.Value.toString()
        val = val.trim()
        return val.split(' ')
    }
}
//
var ProcessFilter = new ProcessFilterClass()
