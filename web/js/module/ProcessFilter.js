//进度筛选
var ProcessFilterClass = /** @class */ (function () {
    function ProcessFilterClass() {
        //数据包
        this.Pack = {};
    }
    //初始化
    ProcessFilterClass.prototype.Init = function () {
        //数据初始
        this.PackInit();
        //填充数据
        this.FillInput();
        //绑定事件
        this.BindActions();
    };
    //搜索初始化
    ProcessFilterClass.prototype.PackInit = function () {
        this.Pack.BeginDate = Common.GetDate(-7);
        this.Pack.EndDate = Common.GetDate(31);
        this.Pack.ModeName = '';
        this.Pack.Vid = 0;
        this.Pack.ModeStatus = 0;
        this.Pack.LinkStatus = 0;
        this.Pack.LinkName = '';
        this.Pack.LinkUserName = '';
    };
    //填充Input
    ProcessFilterClass.prototype.FillInput = function () {
        var plan = $('#stepFilter');
        $.each(this.Pack, function (k, v) {
            plan.find('input[name="' + k + '"]').val(v);
        });
    };
    //填充Pack
    ProcessFilterClass.prototype.FillPack = function () {
        var self = this;
        var plan = $('#stepFilter');
        plan.find('input').each(function () {
            self.Pack[this.name] = this.value;
        });
    };
    //设置Pack
    ProcessFilterClass.prototype.SetPack = function (key, val) {
        this.Pack[key] = val;
    };
    //重置Pack
    ProcessFilterClass.prototype.ResetPack = function () {
        var plan = $('#stepFilter');
        plan.find('input').val('');
        this.PackInit();
        this.FillInput();
    };
    //获取数据
    ProcessFilterClass.prototype.GetPack = function () {
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
        var plan = $('#stepFilter');
        plan.find('.confirm').unbind().click(function () {
            self.FillPack();
            Main.Over(function () {
                ProcessPanel.Index();
            });
            ProcessPanel.HideMenu();
            plan.fadeOut(Config.FadeTime);
        });
        plan.find('.cancel,.close').unbind().click(function () {
            plan.fadeOut(Config.FadeTime);
            DateTime.HideDate();
            $('#storeMenu').hide();
            Common.HidePullDownMenu();
        });
        //关闭日期
        plan.unbind().mousedown(function (e) {
            if ($(e.target).attr('class') != 'date') {
                DateTime.HideDate();
            }
            if ($(e.target).attr('class') != 'select') {
                $('#storeMenu').hide();
                Common.HidePullDownMenu();
            }
        });
        //日期绑定
        plan.find('.date').unbind().click(function () {
            var dom = this;
            DateTime.Open(dom, $(dom).val(), function (date) {
                $(dom).val(date);
            });
        });
        //归档绑定
        plan.find('.select[stype="ModeStatus"],.select[stype="LinkStatus"]').unbind().click(function (e) {
            Common.HidePullDownMenu();
            var menu = $('#storeMenu');
            var stype = $(this).attr('stype');
            var dom = this;
            var top = $(this).offset().top + $(this).outerHeight() + 2;
            var left = $(this).offset().left; /*- menu.outerWidth() - 2*/
            menu.css({ left: left, top: top }).unbind().delegate('.row', 'click', function () {
                $(dom).val($(this).find('.txt').html());
                menu.hide();
                self.SetPack(stype, $(this).index() - 1);
            }).show();
        });
        //用户搜索
        plan.find('.user').unbind().bind('input', function () {
            var html = '';
            var dom = this;
            var sear = $('#searchUser');
            $.each(Data.UserList, function (k, v) {
                if (dom.value == '') {
                    return;
                }
                if (v.Name.indexOf(dom.value) == -1) {
                    return;
                }
                html += '<li uid="' + v.Uid + '">' + v.Name + '</li>';
            });
            if (html != '') {
                var top = $(dom).offset().top + $(dom).outerHeight();
                var left = $(dom).offset().left;
                sear.css({ top: top, left: left }).unbind().delegate('li', 'click', function () {
                    sear.hide();
                    $(dom).val($(this).html());
                }).html(html).show();
            }
            else {
                sear.hide();
            }
        }).blur(function (e) {
            self.SetPack('LinkUid', $.trim(this.value));
        });
        //选中效果
        plan.find('input:not([readonly])').focus(function () {
            $(this).select();
        });
    };
    ProcessFilterClass.prototype.HideFilter = function (fade) {
        if (fade === void 0) {
            fade = true;
        }
        if (fade) {
            $('#stepFilter').fadeOut(Config.FadeTime);
        }
        else {
            $('#stepFilter').hide();
        }
        $('#storeMenu').hide();
        Common.HidePullDownMenu();
    };
    //显示面板
    ProcessFilterClass.prototype.ShowFilter = function (o, e) {
        var self = this;
        var plan = $('#stepFilter');
        var top = $(o).offset().top + 50;
        var left = $(o).offset().left - plan.outerWidth();
        plan.css({ top: top, left: left }).show();
        //版本刷新
        var oldVid = this.Pack.Vid;
        if (oldVid > 0) {
            var oldVidLabel = null;
            var len = Math.min(ProcessData.VersionList.length, 10);
            for (var i = 0; i < len; i++) {
                var version = ProcessData.VersionList[i];
                if (oldVid == version.Vid) {
                    oldVidLabel = VersionManager.GetVersionFullname(version).toString();
                }
            }
            if (oldVidLabel == null) {
                //old vid发生变化, 需要重设
                this.SetPack('Vid', 0);
                plan.find('.select[stype="Vid"]').val("版本号");
            }
            else {
                //全名有可能在版本编辑中变化了,这里需要重新设置
                plan.find('.select[stype="Vid"]').val(oldVidLabel);
            }
        }
        //版本绑定
        plan.find('.select[stype="Vid"]').unbind().click(function (e) {
            $('#storeMenu').hide();
            var dom = this;
            var left = $(this).offset().left;
            var top = $(this).offset().top + $(this).outerHeight() + 2;
            var itemList = [{ Key: 0, Label: '空' }];
            var len = Math.min(ProcessData.VersionList.length, 10);
            for (var i = 0; i < len; i++) {
                var version = ProcessData.VersionList[i];
                var item = { Key: parseInt(version.Vid.toString()), Label: VersionManager.GetVersionFullname(version).toString() };
                itemList.push(item);
            }
            //
            Common.ShowPullDownMenu(left, top, itemList, function (item) {
                if (item.Key == 0) {
                    $(dom).val("版本号");
                }
                else {
                    $(dom).val(item.Label);
                }
                self.SetPack('Vid', item.Key);
            });
        });
        //
    };
    return ProcessFilterClass;
}());
//
var ProcessFilter = new ProcessFilterClass();
//# sourceMappingURL=ProcessFilter.js.map