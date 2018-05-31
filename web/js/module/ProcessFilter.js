//进度筛选
var ProcessFilterClass = /** @class */ (function () {
    function ProcessFilterClass() {
        //数据包
        this.Pack = {};
        //# Vue
        this.VueUuid = 0;
        this.VuePath = 'process/';
    }
    //初始化
    ProcessFilterClass.prototype.Init = function () {
        //数据初始
        this.InitPack();
        //
        this.InitVue();
    };
    //搜索初始化
    ProcessFilterClass.prototype.InitPack = function () {
        this.Pack.BeginDate = Common.GetDate(-7);
        this.Pack.EndDate = Common.GetDate(31);
        this.Pack.ModeName = [];
        this.Pack.Vid = [];
        this.Pack.ModeStatus = [];
        this.Pack.LinkStatus = [];
        this.Pack.LinkName = [];
        this.Pack.LinkUserName = [];
        this.Pack.WorkStatus = [];
        this.Pack.WorkFile = [];
    };
    /**重置 VueFilter 但不变Pack, 以免点击了取消后还要恢复 */
    ProcessFilterClass.prototype.ResetVueFilter = function () {
        this.VueFilter.beginDate = Common.GetDate(-7);
        this.VueFilter.endDate = Common.GetDate(31);
        this.SetCheckBoxValues(this.VueFilter.vid, []);
        this.SetTextFieldValues(this.VueFilter.modeName, []);
        this.SetCheckBoxValues(this.VueFilter.modeStatus, []);
        this.SetTextFieldValues(this.VueFilter.linkName, []);
        this.SetTextFieldValues(this.VueFilter.linkUserName, []);
        this.SetCheckBoxValues(this.VueFilter.linkStatus, []);
        this.SetCheckBoxValues(this.VueFilter.workStatus, []);
        this.SetCheckBoxValues(this.VueFilter.workFile, []);
    };
    /**将VueFilter填充到Pack*/
    ProcessFilterClass.prototype.VueFilterToPack = function () {
        // console.log("[log]", this.VueFilter.beginDate.toString(), this.VueFilter.endDate.toString())
        //
        var beginDateTs = Common.DateStr2TimeStamp(this.VueFilter.beginDate);
        var endDateTs = Common.DateStr2TimeStamp(this.VueFilter.endDate);
        if (endDateTs >= beginDateTs) {
            this.Pack.BeginDate = this.VueFilter.beginDate.toString();
            this.Pack.EndDate = this.VueFilter.endDate.toString();
        }
        else {
            this.Pack.BeginDate = this.VueFilter.endDate.toString();
            this.Pack.EndDate = this.VueFilter.beginDate.toString();
        }
        //
        this.Pack.Vid = this.GetCheckBoxValues(this.VueFilter.vid);
        this.Pack.ModeName = this.GetTextFieldValues(this.VueFilter.modeName);
        this.Pack.ModeStatus = this.GetCheckBoxValues(this.VueFilter.modeStatus);
        this.Pack.LinkName = this.GetTextFieldValues(this.VueFilter.linkName);
        this.Pack.LinkUserName = this.GetTextFieldValues(this.VueFilter.linkUserName);
        this.Pack.LinkStatus = this.GetCheckBoxValues(this.VueFilter.linkStatus);
        this.Pack.WorkStatus = this.GetCheckBoxValues(this.VueFilter.workStatus);
        this.Pack.WorkFile = this.GetCheckBoxValues(this.VueFilter.workFile);
    };
    /**将Pack中的数据填充到VueFilter */
    ProcessFilterClass.prototype.PackToVueFilter = function () {
        this.VueFilter.beginDate = this.Pack.BeginDate;
        this.VueFilter.endDate = this.Pack.EndDate;
        //vid必须每次都重新设置,因为完结可以编辑
        this.VueFilter.vid.Inputs.splice(0, this.VueFilter.vid.Inputs.length);
        var len = ProcessData.VersionList.length;
        for (var i = 0; i < len; i++) {
            var version = ProcessData.VersionList[i];
            this.VueFilter.vid.Inputs.push({ Value: version.Vid, Label: version.Ver, Checked: this.Pack.Vid.indexOf(version.Vid) > -1, Title: VersionManager.GetVersionFullname(version), });
        }
        this.SetTextFieldValues(this.VueFilter.modeName, this.Pack.ModeName);
        this.SetCheckBoxValues(this.VueFilter.modeStatus, this.Pack.ModeStatus);
        this.SetTextFieldValues(this.VueFilter.linkName, this.Pack.LinkName);
        this.SetTextFieldValues(this.VueFilter.linkUserName, this.Pack.LinkUserName);
        this.SetCheckBoxValues(this.VueFilter.linkStatus, this.Pack.LinkStatus);
        this.SetCheckBoxValues(this.VueFilter.workStatus, this.Pack.WorkStatus);
        this.SetCheckBoxValues(this.VueFilter.workFile, this.Pack.WorkFile);
    };
    //获取发送给服务器的数据
    ProcessFilterClass.prototype.GetSvrPack = function () {
        var param = {
            'BeginDate': this.Pack.BeginDate,
            'EndDate': this.Pack.EndDate
        };
        return param;
    };
    //绑定事件
    ProcessFilterClass.prototype.BindActions = function () {
        //面板事件
        var self = this;
        var plan = $(this.VueFilter.$el);
        //关闭日期
        plan.unbind().mousedown(function (e) {
            if ($(e.target).attr('class') != 'date') {
                DateTime.HideDate();
            }
            if ($(e.target).attr('class') != 'select') {
                Common.HidePullDownMenu();
            }
        });
    };
    ProcessFilterClass.prototype.InitVue = function () {
        var _this = this;
        Loader.LoadVueTemplateList([this.VuePath + "FilterItemTextField", this.VuePath + "FilterItemCheckBox", this.VuePath + "ProcessFilter"], function (tplList) {
            //注册组件
            Vue.component('FilterItemTextField', {
                template: tplList[0],
                props: {
                    item: Object
                },
                data: function () {
                    return {};
                },
                methods: {}
            });
            Vue.component('FilterItemCheckBox', {
                template: tplList[1],
                props: {
                    item: Object
                },
                data: function () {
                    return {};
                },
                methods: {}
            });
            //初始化数据
            var data = {};
            data.beginDate = '';
            data.endDate = '';
            data.vid = {
                Uuid: _this.VueUuid++, Name: '功能版本', InputName: 'Vid', ShowLen: VersionManager.ListShowMax, ShowLenMin: VersionManager.ListShowMax, ShowLenMax: 20,
                Inputs: []
            };
            data.modeName = { Uuid: _this.VueUuid++, Name: '功能名称', InputName: 'ModeName', Placeholder: '输入功能名称', Value: '', Prompt: '', };
            data.modeStatus = {
                Uuid: _this.VueUuid++, Name: '功能归档', InputName: 'ModeStatus', ShowLen: -1, ShowLenMin: 0, ShowLenMax: 0,
                Inputs: [
                    { Value: 0, Label: '进行中的', Checked: false, Title: '', },
                    { Value: 1, Label: '已归档的', Checked: false, Title: '', },
                ]
            };
            data.linkName = { Uuid: _this.VueUuid++, Name: '流程名称', InputName: 'LinkName', Placeholder: '输入流程名称', Value: '', Prompt: '', };
            data.linkUserName = { Uuid: _this.VueUuid++, Name: '流程负责', InputName: 'LinkUserName', Placeholder: '输入负责人', Value: '小 狐', Prompt: '可以输入多个值, 用`空格`分割', };
            data.linkStatus = {
                Uuid: _this.VueUuid++, Name: '流程归档', InputName: 'LinkStatus', ShowLen: -1, ShowLenMin: 0, ShowLenMax: 0,
                Inputs: [
                    { Value: 0, Label: '进行中的', Checked: false, Title: '', },
                    { Value: 1, Label: '已归档的', Checked: false, Title: '', },
                ]
            };
            data.workStatus = {
                Uuid: _this.VueUuid++, Name: '工作状态', InputName: 'WorkStatus', ShowLen: -1, ShowLenMin: 0, ShowLenMax: 0,
                Inputs: [
                    { Value: WorkStatusField.WORK, Label: '工作', Checked: false, Title: '', },
                    { Value: WorkStatusField.FINISH, Label: '完成', Checked: false, Title: '', },
                    { Value: WorkStatusField.DELAY, Label: '延期', Checked: false, Title: '', },
                    { Value: WorkStatusField.WAIT, Label: '等待', Checked: false, Title: '', },
                    { Value: WorkStatusField.REST, Label: '休假', Checked: false, Title: '', },
                    { Value: WorkStatusField.OPTIMIZE, Label: '优化', Checked: false, Title: '', },
                ]
            };
            data.workFile = {
                Uuid: _this.VueUuid++, Name: '工作附件', InputName: 'WorkStatus', ShowLen: -1, ShowLenMin: 0, ShowLenMax: 0,
                Inputs: [
                    { Value: 1, Label: '有附件', Checked: false, Title: '', },
                ]
            };
            var oldLeft;
            //初始化 VueFilter 
            _this.VueFilter = new Vue({
                template: tplList[2],
                data: data,
                methods: {
                    //日期绑定
                    onClickDate: function (e, kind) {
                        var dom = e.target;
                        DateTime.Open(dom, $(dom).val(), function (date) {
                            switch (kind) {
                                case 1:
                                    _this.VueFilter.beginDate = date;
                                    break;
                                case 2:
                                    _this.VueFilter.endDate = date;
                                    break;
                            }
                        });
                    },
                    //数据框变化(暂时仅用于负责人)
                    onInputChange: function (e, item) {
                        console.log("[info]", e.type, ":[e.type]");
                        switch (item.InputName) {
                            case _this.VueFilter.linkUserName.InputName:
                                var dom = e.target;
                                //### 获取当前所选的关键字
                                // console.log("[info]", dom.selectionStart, ":[dom.selectionStart]")
                                var selectStart = dom.selectionStart;
                                var selectEnd = dom.selectionStart;
                                var wordArr = [];
                                //  = dom.value.charAt(selectStart)
                                while (selectStart > 0) {
                                    var char = dom.value.charAt(selectStart - 1);
                                    if (char && char != ' ') {
                                        wordArr.unshift(char);
                                        selectStart--;
                                    }
                                    else {
                                        break;
                                    }
                                }
                                while (selectEnd < dom.value.length) {
                                    var char = dom.value.charAt(selectEnd);
                                    if (char && char != ' ') {
                                        wordArr.push(char);
                                        selectEnd++;
                                    }
                                    else {
                                        break;
                                    }
                                }
                                var word = wordArr.join('');
                                //### menu data
                                if (!word) {
                                    Common.HidePullDownMenu();
                                    return;
                                }
                                var itemList = [];
                                var len = Data.UserList.length;
                                for (var i = 0; i < len; i++) {
                                    var user = Data.UserList[i];
                                    if (user.Name.indexOf(word) == -1) {
                                        continue;
                                    }
                                    itemList.push({ Key: user.Uid, Label: user.Name });
                                }
                                //### show menu
                                var left;
                                if (e['pageX']) {
                                    left = e['pageX'];
                                    oldLeft = left;
                                }
                                else {
                                    left = oldLeft || $(dom).offset().left;
                                }
                                var top = $(dom).offset().top + $(dom).outerHeight();
                                Common.ShowPullDownMenu(left, top, itemList, function (menuItem) {
                                    console.log("[info]", menuItem.Label, ":[item.Label]", "in user menu", word, ":[word]");
                                    var before = item.Value.toString().substring(0, selectStart);
                                    var after = item.Value.toString().substring(selectEnd, item.Value.length);
                                    console.log("[info]", before, ":[before]", after, ":[after]");
                                    item.Value = before + menuItem.Label + after;
                                    $(dom).select();
                                });
                                break;
                        }
                    },
                    onReset: _this.ResetVueFilter.bind(_this),
                    onSubmit: function () {
                        _this.VueFilterToPack();
                        Main.Over(function () {
                            ProcessPanel.Index();
                        });
                        ProcessPanel.HideMenu();
                        _this.HideFilter(true);
                    },
                    onClose: function () {
                        _this.HideFilter(true);
                    },
                }
            }).$mount();
            //放入html
            Common.InsertBeforeDynamicDom(_this.VueFilter.$el);
            //绑定事件
            _this.BindActions();
        });
    };
    //显示面板
    ProcessFilterClass.prototype.ShowFilter = function (o, e) {
        this.PackToVueFilter();
        var plan = $(this.VueFilter.$el);
        var top = $(o).offset().top + 50;
        var left = $(o).offset().left - plan.outerWidth();
        plan.css({ top: top, left: left }).show();
    };
    ProcessFilterClass.prototype.HideFilter = function (fade) {
        if (this.VueFilter) {
            if (fade === void 0) {
                fade = true;
            }
            if (fade) {
                $(this.VueFilter.$el).fadeOut(Config.FadeTime);
            }
            else {
                $(this.VueFilter.$el).hide();
            }
        }
        Common.HidePullDownMenu();
    };
    //得到checkbox全部值
    ProcessFilterClass.prototype.GetCheckBoxValues = function (item) {
        var vals = [];
        var len = item.Inputs.length;
        for (var i = 0; i < len; i++) {
            var input = item.Inputs[i];
            if (input.Checked) {
                vals.push(parseInt(input.Value.toString()));
            }
        }
        return vals;
    };
    ProcessFilterClass.prototype.SetCheckBoxValues = function (item, vals) {
        var len = item.Inputs.length;
        for (var i = 0; i < len; i++) {
            var input = item.Inputs[i];
            input.Checked = (vals.indexOf(input.Value) > -1);
        }
    };
    //得到textField全部值
    ProcessFilterClass.prototype.GetTextFieldValues = function (item) {
        var val = item.Value.toString();
        val = val.trim();
        var vals = val.split(' ');
        for (var i = vals.length - 1; i >= 0; i--) {
            if (vals[i] == "") {
                vals.splice(i, 1);
            }
        }
        return vals;
    };
    ProcessFilterClass.prototype.SetTextFieldValues = function (item, vals) {
        item.Value = vals.join(' ');
    };
    return ProcessFilterClass;
}());
//
var ProcessFilter = new ProcessFilterClass();
//# sourceMappingURL=ProcessFilter.js.map