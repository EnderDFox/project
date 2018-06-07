//晨会面板
var CollatePanelClass = /** @class */ (function () {
    function CollatePanelClass() {
        //日期数据
        this.DateList = [];
    }
    //初始化
    CollatePanelClass.prototype.Init = function () {
    };
    //入口协议
    CollatePanelClass.prototype.Index = function () {
        WSConn.sendMsg(C2L.C2L_COLLATE_VIEW, CollateFilter.GetPack());
    };
    //日期范围
    CollatePanelClass.prototype.SetDateRange = function () {
        var list = [];
        var date = new Date(CollateFilter.Pack.BeginDate);
        while (true) {
            var info = {};
            info.y = date.getFullYear();
            var m = date.getMonth() + 1;
            var d = date.getDate();
            info.w = date.getDay();
            info.m = m >= 10 ? m.toString() : ('0' + m);
            info.d = d >= 10 ? d.toString() : ('0' + d);
            info.w = info.w == 0 ? 7 : info.w;
            info.s = info.y + '-' + info.m + '-' + info.d;
            list.push(info);
            date.setDate(date.getDate() + 1);
            if (info.s == CollateFilter.Pack.EndDate) {
                break;
            }
        }
        CollatePanel.DateList = list;
    };
    //组合头部
    CollatePanelClass.prototype.GetTheadHtml = function () {
        var html = '';
        html += '<tr class="title">';
        html += '<td class="type_0">日期</td>';
        $.each(Data.UserList, function (k, v) {
            if (v.Did == 0) {
                return true;
            }
            if (v.IsHide == 1) {
                return true;
            }
            html += '<td class="type_' + v.Did + '">' + v.Name + '</td>';
            return true;
        });
        html += '</tr>';
        return html;
    };
    //组合tbody
    CollatePanelClass.prototype.GetTbodyHtml = function () {
        var today = Common.GetDate(0);
        var day = Common.GetDay(today);
        var html = '';
        $.each(this.DateList, function (r, d) {
            var trClass = [];
            if (d.w >= 6) {
                trClass.push('weekend');
            }
            html += '<tr class="' + trClass.join(' ') + '" date="' + d.s + '">';
            var tdClass = ['frist'];
            if (d.s == today) {
                tdClass.push('today');
            }
            html += '<td class="' + tdClass.join(' ') + '">';
            html += '<dl>';
            if (ProcessData.HasVersionDateLineMap(d.s)) {
                var p = ProcessData.VersionDateLineMap[d.s][0];
                var _genre = p.Genre;
                var version = ProcessData.VersionMap[p.Vid];
                var publishName = '版本' + VersionManager.GetPublishName(_genre);
                html += '<dd class="notice sk_' + _genre + '">' + version.Ver + ' ' + publishName + '</dd>';
            }
            else {
                var p = VersionManager.GetNextNearestPublish(d.s, false);
                if (p) {
                    var _genre = p.Genre;
                    var version = ProcessData.VersionMap[p.Vid];
                    var publishName = '版本' + VersionManager.GetPublishName(_genre);
                    html += '<dd class="notice sk_' + _genre + '">' + Common.DateLineSpaceDay(p.DateLine, d.s) + '天后</dd>';
                    html += '<dd class="notice sk_' + _genre + '">' + version.Ver + ' ' + publishName + '</dd>';
                }
            }
            html += '<dt>' + d.s + '</dt>';
            html += '<dd>星期' + DateTime.WeekMap[d.w - 1] + '</dd>';
            html += '</dl>';
            html += '</td>';
            var cols = 1;
            $.each(Data.UserList, function (k, v) {
                if (v.Did == 0) {
                    return;
                }
                if (v.IsHide == 1) {
                    return;
                }
                html += '<td uid="' + v.Uid + '"><ol>';
                //进度内容
                if (CollateData.DateUserMap[d.s] && CollateData.DateUserMap[d.s][v.Uid]) {
                    $.each(CollateData.DateUserMap[d.s][v.Uid], function (k, w) {
                        html += CollatePanel.GetWorkInfo(w);
                    });
                }
                //补充内容
                if (CollateData.DateExtraMap[d.s] && CollateData.DateExtraMap[d.s][v.Uid]) {
                    $.each(CollateData.DateExtraMap[d.s][v.Uid], function (k, e) {
                        html += CollatePanel.GetWorkExtra(e);
                    });
                }
                html += '</ol>';
                if (r >= (day - 2)) {
                    //html+= '<div class="extra">+添加内容...</div>'
                }
                html += '</td>';
                cols++;
            });
            html += '</tr>';
            if (d.w == 7) {
                html += '<tr class="space"><td colspan="' + cols + '"></td></tr>';
            }
        });
        return html;
    };
    //工作补充
    CollatePanelClass.prototype.GetWorkExtra = function (e) {
        var html = '';
        html += '<li eid="' + e.Eid + '">';
        html += '<span class="check_' + e.Inspect + '">' + e.Name + '</span>';
        html += '<span class="special">（' + CollateData.InspectList[e.Inspect] + '）</span>';
        html += '<span class="edit">√</span>';
        html += '</li>';
        return html;
    };
    //工作内容
    CollatePanelClass.prototype.GetWorkInfo = function (w) {
        var html = '';
        var link = CollateData.LinkMap[w.Lid];
        html += '<li wid="' + w.Wid + '">';
        html += '<span class="check_' + w.Inspect + '">' + VersionManager.GetVersionVer(CollateData.ModeMap[link.Mid].Vid) + CollateData.ModeMap[link.Mid].Name + '-' + link.Name + '</span>';
        html += '<span class="special">';
        if (w.MinNum > 0 || w.MaxNum > 0) {
            html += '（' + w.MinNum + '/' + w.MaxNum + '）';
        }
        if (w.Tips != '') {
            html += '（' + w.Tips + '）';
        }
        if (w.Tag != '') {
            var TagInfo = CollateData.TagsMap[w.Tag];
            if (TagInfo) {
                html += '（' + TagInfo.Info + '）';
            }
            else {
                html += '（' + w.Tag + '）';
            }
        }
        else {
            html += '（' + CollateData.StatusList[w.Status].Info + '）';
        }
        html += '</span>';
        html += '</li>';
        return html;
    };
    //建立内容
    CollatePanelClass.prototype.CreateCollate = function () {
        //组合thead
        var html = '<div id="freezeTop" class="collateLock"><div class="lockTop"><table class="collate" id="rowLock">';
        html += CollatePanel.GetTheadHtml();
        html += '</table></div></div>';
        html += '<div class="collateLockBody"><table class="collate">';
        //组合tbody
        html += CollatePanel.GetTbodyHtml();
        html += '</table></div>';
        Main.Draw(html);
        $('#freezeTop').unbind().freezeTop();
    };
    //事件绑定
    CollatePanelClass.prototype.BindActions = function () {
        var _this = this;
        //功能区域绑定
        Main.Content.unbind().delegate('li', 'click', function (e) {
            CollatePanel.HideMenu();
            /*
            if(e.button !== Main.MouseDir) {
                return false
            }
            */
            if (!User.IsWrite) {
                return;
            }
            if ($(_this).is('[wid]')) {
                CollatePanel.ShowStepMenu(_this, e);
            }
            else {
                CollatePanel.ShowExtraMenu(_this, e);
            }
        }).delegate('td', 'click', function (e) {
            if (!User.IsWrite) {
                return;
            }
            switch (e.currentTarget.localName) {
                case 'td':
                    CollatePanel.HideMenu();
                    break;
                case 'div':
                    CollatePanel.HideMenu();
                    CollatePanel.ShowExtraEdit(e.currentTarget, e);
                    break;
            }
        });
    };
    //显示菜单
    CollatePanelClass.prototype.ShowStepMenu = function (o, e) {
        var wid = $(o).attr('wid');
        var top = e.pageY + 1;
        var left = e.pageX + 1;
        $('#menuStep').css({ left: left, top: top }).unbind().delegate('.row', 'click', function () {
            var type = $(this).attr('type');
            switch (type) {
                case 'cancel':
                case 'finish':
                case 'last':
                case 'defer':
                    var inspect = $(this).attr('inspect');
                    WSConn.sendMsg(C2L.C2L_COLLATE_STEP_EDIT, { 'Wid': parseInt(wid), 'Inspect': parseInt(inspect) });
                    break;
            }
            CollatePanel.HideMenu();
        }).show().adjust(-5);
    };
    //显示补充
    CollatePanelClass.prototype.ShowExtraMenu = function (o, e) {
        var top = e.pageY + 1;
        var left = e.pageX + 1;
        $('#menuExtra').css({ left: left, top: top }).unbind().delegate('.row', 'click', function () {
            CollatePanel.HideMenu();
            var type = $(this).attr('type');
            switch (type) {
                case 'edit':
                    CollatePanel.ShowExtraEdit(o, e);
                    break;
                case 'delete':
                    var eid = $(o).attr('eid');
                    WSConn.sendMsg(C2L.C2L_COLLATE_EXTRA_DELETE, { 'Eid': parseInt(eid) });
                    break;
            }
        }).show().adjust(-5);
    };
    //编辑面板
    CollatePanelClass.prototype.ShowExtraEdit = function (o, e) {
        var top = e.pageY + 1;
        var left = e.pageX + 1;
        var plan = $('#addStep').css({ left: left, top: top }).unbind().show().adjust(-5);
        var name = plan.find('textarea').val('').focus();
        var eid = parseInt($(o).attr('eid')) | 0;
        var param = {};
        param.Eid = eid;
        param.Inspect = 1;
        if (param.Eid > 0) {
            var extra = CollateData.ExtraMap[eid];
            name.val(extra.Name);
            param.Inspect = extra.Inspect;
        }
        plan.find('.confirm').unbind().click(function () {
            var inspect = plan.find('.inspect .on').index() + 1;
            if (param.Eid > 0) {
                WSConn.sendMsg(C2L.C2L_COLLATE_EXTRA_EDIT, { 'Eid': param.Eid, 'Name': name.val(), 'Inspect': inspect });
            }
            else {
                var date = $(o).parent().attr('date');
                var uid = $(o).attr('uid');
                WSConn.sendMsg(C2L.C2L_COLLATE_STEP_ADD, { 'Uid': parseInt(uid), 'Date': date, 'Name': name.val(), 'inspect': inspect });
            }
            plan.hide();
        });
        plan.find('.inspect').unbind().delegate('div', 'click', function () {
            plan.find('.inspect div').removeClass('on');
            $(this).addClass('on');
        }).find('div').removeClass('on').eq(param.Inspect - 1).addClass('on');
        plan.find('.cancel,.close').unbind().click(function () {
            plan.fadeOut(Config.FadeTime);
        });
    };
    //关闭菜单
    CollatePanelClass.prototype.HideMenu = function () {
        $('#menuStep,#menuExtra,#addStep').hide();
    };
    return CollatePanelClass;
}());
var CollatePanel = new CollatePanelClass();
//# sourceMappingURL=CollatePanel.js.map