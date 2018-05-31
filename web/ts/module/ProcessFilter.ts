interface IVueFilter {
    beginDate?: string, endDate?: string,
    vid?: IFilterItemCheckBox, modeName?: IFilterItemTextField, modeStatus?: IFilterItemCheckBox,
    linkName?: IFilterItemTextField, linkUserName?: IFilterItemTextField, linkStatus?: IFilterItemCheckBox
}
interface IProcessFilterPack {
    BeginDate?: string
    EndDate?: string
    Vid?: number[]
    ModeName?: string[]
    ModeStatus?: number[]
    LinkName?: string[]
    LinkUserName?: string[]
    LinkStatus?: number[]
}

interface IFilterItemTextField {
    Uuid: number
    Name: string
    InputName: string
    Placeholder: string
    Value: string
    Prompt: string
}

interface IFilterItemCheckBox {
    Uuid: number
    Name: string
    InputName: string
    Inputs: IFilterItemCheckBoxInput[]
    ShowLen: number
    ShowLenMin: number
    ShowLenMax: number
    Prompt?: string
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
        this.InitPack()
        //
        this.InitVue()
    }
    //搜索初始化
    InitPack() {
        this.Pack.BeginDate = Common.GetDate(-7)
        this.Pack.EndDate = Common.GetDate(31)
        this.Pack.ModeName = []
        this.Pack.Vid = []
        this.Pack.ModeStatus = []
        this.Pack.LinkStatus = []
        this.Pack.LinkName = []
        this.Pack.LinkUserName = []
    }
    /**重置 VueFilter 但不变Pack, 以免点击了取消后还要恢复 */
    ResetVueFilter() {
        this.VueFilter.beginDate = Common.GetDate(-7)
        this.VueFilter.endDate = Common.GetDate(31)
        this.SetCheckBoxValues(this.VueFilter.vid.Inputs, [])
        this.SetTextFieldValues(this.VueFilter.modeName, [])
        this.SetCheckBoxValues(this.VueFilter.modeStatus.Inputs, [])
        this.SetTextFieldValues(this.VueFilter.linkName, [])
        this.SetTextFieldValues(this.VueFilter.linkUserName, [])
        this.SetCheckBoxValues(this.VueFilter.linkStatus.Inputs, [])
    }
    //设置Pack
    SetPack(key, val) {
        this.Pack[key] = val
    }
    //获取发送给服务器的数据
    GetSvrPack() {
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
        //关闭日期
        plan.unbind().mousedown(function (e) {
            if ($(e.target).attr('class') != 'date') {
                DateTime.HideDate()
            }
            if ($(e.target).attr('class') != 'select') {
                Common.HidePullDownMenu()
            }
        })
    }
    //# Vue
    VueUuid = 0
    VuePath = 'process/'
    VueFilter: CombinedVueInstance1<IVueFilter>
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
            //初始化数据
            var data: IVueFilter = {}
            data.beginDate = ''
            data.endDate = ''
            data.vid = {
                Uuid: this.VueUuid++, Name: '功能版本', InputName: 'Vid', ShowLen: VersionManager.ListShowMax, ShowLenMin: VersionManager.ListShowMax, ShowLenMax: 20,
                Inputs: []
            }
            data.modeName = { Uuid: this.VueUuid++, Name: '功能名称', InputName: 'ModeName', Placeholder: '输入功能名称', Value: '', Prompt: '', }
            data.modeStatus = {
                Uuid: this.VueUuid++, Name: '功能归档', InputName: 'ModeStatus', ShowLen: -1, ShowLenMin: 0, ShowLenMax: 0,
                Inputs: [
                    { Value: '0', Label: '进行中的', Checked: false, Title: '', },
                    { Value: '1', Label: '已归档的', Checked: false, Title: '', },
                ]
            }
            data.linkName = { Uuid: this.VueUuid++, Name: '流程名称', InputName: 'LinkName', Placeholder: '输入流程名称', Value: '', Prompt: '', }
            data.linkUserName = { Uuid: this.VueUuid++, Name: '流程负责', InputName: 'LinkUserName', Placeholder: '输入负责人', Value: '小 狐', Prompt: '可以输入多个值, 用`空格`分割', }
            data.linkStatus = {
                Uuid: this.VueUuid++, Name: '流程归档', InputName: 'LinkStatus', ShowLen: -1, ShowLenMin: 0, ShowLenMax: 0,
                Inputs: [
                    { Value: '0', Label: '进行中的', Checked: false, Title: '', },
                    { Value: '1', Label: '已归档的', Checked: false, Title: '', },
                ]
            }
            var oldLeft: number
            //初始化 VueFilter 
            this.VueFilter = new Vue({
                template: tplList[2],
                data: data,
                methods: {
                    //日期绑定
                    onClickDate: (e: MouseEvent, kind: number) => {
                        var dom = e.target as HTMLInputElement
                        DateTime.Open(dom, $(dom).val(), (date: string) => {
                            switch (kind) {
                                case 1:
                                    this.VueFilter.beginDate = date
                                    break;
                                case 2:
                                    this.VueFilter.endDate = date
                                    break;
                            }
                        })
                    },
                    //数据框变化(暂时仅用于负责人)
                    onInputChange: (e: Event, item: IFilterItemTextField) => {
                        console.log("[info]", e.type, ":[e.type]")
                        switch (item.InputName) {
                            case this.VueFilter.linkUserName.InputName:
                                var dom = e.target as HTMLInputElement
                                //### 获取当前所选的关键字
                                // console.log("[info]", dom.selectionStart, ":[dom.selectionStart]")
                                var selectStart = dom.selectionStart
                                var selectEnd = dom.selectionStart
                                var wordArr: string[] = []
                                //  = dom.value.charAt(selectStart)
                                while (selectStart > 0) {
                                    var char = dom.value.charAt(selectStart - 1)
                                    if (char && char != ' ') {
                                        wordArr.unshift(char)
                                        selectStart--
                                    } else {
                                        break
                                    }
                                }
                                while (selectEnd < dom.value.length) {
                                    var char = dom.value.charAt(selectEnd)
                                    if (char && char != ' ') {
                                        wordArr.push(char)
                                        selectEnd++
                                    } else {
                                        break
                                    }
                                }
                                var word = wordArr.join('')
                                //### menu data
                                if (!word) {
                                    Common.HidePullDownMenu()
                                    return
                                }
                                var itemList: IPullDownMenuItem[] = []
                                var len = Data.UserList.length
                                for (var i = 0; i < len; i++) {
                                    var user: UserSingle = Data.UserList[i]
                                    if (user.Name.indexOf(word) == -1) {
                                        continue
                                    }
                                    itemList.push({ Key: user.Uid, Label: user.Name })
                                }
                                //### show menu
                                var left: number
                                if (e['pageX']) {
                                    left = e['pageX']
                                    oldLeft = left
                                } else {
                                    left = oldLeft || $(dom).offset().left
                                }
                                var top = $(dom).offset().top + $(dom).outerHeight()
                                Common.ShowPullDownMenu(left, top, itemList, (menuItem) => {
                                    console.log("[info]", menuItem.Label, ":[item.Label]", "in user menu", word, ":[word]")
                                    var before = item.Value.toString().substring(0, selectStart)
                                    var after = item.Value.toString().substring(selectEnd, item.Value.length)
                                    console.log("[info]", before, ":[before]", after, ":[after]")
                                    item.Value = before + menuItem.Label + after
                                    $(dom).select()
                                    // $(dom).val(item.Label)
                                    // self.SetPack(stype, item.Key)
                                })
                                break;
                        }
                    },
                    onReset: this.ResetVueFilter.bind(this),
                    onSubmit: () => {
                        this.VueFilterToPack()
                        /*  Main.Over(() => {
                             ProcessPanel.Index()
                        }) */
                        // ProcessPanel.HideMenu()
                        // this.HideFilter(true)
                    },
                    onClose: () => {
                        this.HideFilter(true)
                    },
                }
            }).$mount()
            //放入html
            Common.InsertBeforeDynamicDom(this.VueFilter.$el)
            //绑定事件
            this.BindActions()
        })
    }
    //显示面板
    ShowFilter(o, e) {
        this.PackToVueFilter()
        this.VueFilter.vid.ShowLen = this.VueFilter.vid.ShowLenMin.valueOf()
        var plan = $(this.VueFilter.$el)
        var top = $(o).offset().top + 50
        var left = $(o).offset().left - plan.outerWidth()
        plan.css({ top: top, left: left }).show()
    }
    /**将VueFilter填充到Pack*/
    VueFilterToPack() {
        // console.log("[log]", this.VueFilter.beginDate.toString(), this.VueFilter.endDate.toString())
        //
        var beginDateTs = Common.DateStr2TimeStamp(this.VueFilter.beginDate)
        var endDateTs = Common.DateStr2TimeStamp(this.VueFilter.endDate)
        if (endDateTs >= beginDateTs) {
            this.Pack.BeginDate = this.VueFilter.beginDate.toString()
            this.Pack.EndDate = this.VueFilter.endDate.toString()
        } else {
            this.Pack.BeginDate = this.VueFilter.endDate.toString()
            this.Pack.EndDate = this.VueFilter.beginDate.toString()
        }
        //
        this.Pack.Vid = this.GetCheckBoxValues(this.VueFilter.vid.Inputs)
        this.Pack.ModeName = this.GetTextFieldValues(this.VueFilter.modeName)
        this.Pack.ModeStatus = this.GetCheckBoxValues(this.VueFilter.modeStatus.Inputs)
        this.Pack.LinkName = this.GetTextFieldValues(this.VueFilter.linkName)
        this.Pack.LinkUserName = this.GetTextFieldValues(this.VueFilter.linkUserName)
        this.Pack.LinkStatus = this.GetCheckBoxValues(this.VueFilter.linkStatus.Inputs)
    }
    /**将Pack中的数据填充到VueFilter */
    PackToVueFilter() {
        this.VueFilter.beginDate = this.Pack.BeginDate
        this.VueFilter.endDate = this.Pack.EndDate
        //vid必须每次都重新设置,因为完结可以编辑
        this.VueFilter.vid.Inputs.splice(0, this.VueFilter.vid.Inputs.length)
        var len = ProcessData.VersionList.length
        for (var i = 0; i < len; i++) {
            var version = ProcessData.VersionList[i];
            this.VueFilter.vid.Inputs.push({ Value: version.Vid, Label: version.Ver, Checked: this.Pack.Vid.indexOf(version.Vid) > -1, Title: VersionManager.GetVersionFullname(version), })
        }
        this.SetTextFieldValues(this.VueFilter.modeName, this.Pack.ModeName)
        this.SetCheckBoxValues(this.VueFilter.modeStatus.Inputs, this.Pack.ModeStatus)
        this.SetTextFieldValues(this.VueFilter.linkName, this.Pack.LinkName)
        this.SetTextFieldValues(this.VueFilter.linkUserName, this.Pack.LinkUserName)
        this.SetCheckBoxValues(this.VueFilter.linkStatus.Inputs, this.Pack.LinkStatus)
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
    SetCheckBoxValues(inputs: IFilterItemCheckBoxInput[], vals: number[]): void {
        var len = inputs.length
        for (var i = 0; i < len; i++) {
            var input = inputs[i]
            input.Checked = (vals.indexOf(input.Value as number) > -1)
        }
    }
    //得到textField全部值
    GetTextFieldValues(item: IFilterItemTextField): string[] {
        var val = item.Value.toString()
        val = val.trim()
        var vals = val.split(' ')
        for (var i = vals.length - 1; i >= 0; i--) {
            if (vals[i] == "") {
                vals.splice(i, 1)
            }
        }
        return vals
    }
    SetTextFieldValues(item: IFilterItemTextField, vals: string[]) {
        item.Value = vals.join(' ')
    }
}
//
var ProcessFilter = new ProcessFilterClass()
