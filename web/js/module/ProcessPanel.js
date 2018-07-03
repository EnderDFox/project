//进度类
var ProcessPanelClass = /** @class */ (function () {
    function ProcessPanelClass() {
        /** 时间跨度
         * key:dateLine	val:count
         */
        this.DateList = { rows: {}, list: [] };
    }
    /**
     * 初始化
     */
    ProcessPanelClass.prototype.Init = function () {
    };
    /**
     * 入口协议
     */
    ProcessPanelClass.prototype.Index = function () {
        WSConn.sendMsg(C2L.C2L_PROCESS_VIEW, ProcessFilter.GetSvrPack());
    };
    /**
     * 设置时间范围
     */
    ProcessPanelClass.prototype.SetDateRange = function () {
        var rows = {};
        var list = [];
        var date = new Date(ProcessFilter.Pack.BeginDate);
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
            var K = info.y + '-' + info.m;
            if (!rows[K]) {
                rows[K] = 0;
            }
            rows[K]++;
            list.push(info);
            date.setDate(date.getDate() + 1);
            if (info.s == ProcessFilter.Pack.EndDate) {
                break;
            }
        }
        this.DateList = { rows: rows, list: list };
    };
    //绑定事件
    ProcessPanelClass.prototype.BindActions = function () {
        var _this = this;
        //功能区域绑定
        Main.Content.unbind().delegate('.addNew', 'click', function (e) {
            _this.ShowEditMode(0, e, C2L.C2L_PROCESS_MODE_ADD);
        }).delegate('.mode', 'mousedown', function (e) {
            e.stopPropagation();
            _this.HideMenu();
            TemplateManager.Hide();
            VersionManager.Hide();
            if (e.button !== Main.MouseDir) {
                return false;
            }
            if (!User.IsWrite) {
                return false;
            }
            _this.ShowMenuMode(e.currentTarget, e);
        }).find('.linkMap').unbind().delegate('td', 'mousedown', function (e) {
            e.stopPropagation();
            //流程区域绑定
            _this.HideMenu();
            TemplateManager.Hide();
            VersionManager.Hide();
            if (e.button !== Main.MouseDir) {
                return false;
            }
            var type = $(e.currentTarget).attr('type');
            switch (type) {
                case 'step':
                    _this.ShowMenuStep(e.currentTarget, e, User.IsWrite);
                    break;
                case 'duty':
                    if (!User.IsWrite) {
                        return false;
                    }
                    _this.ShowMenuUser(e.currentTarget, e);
                    break;
                /* case 'link':
                    if (!User.IsWrite) {
                        return false
                    }
                    this.ShowMenuLink(e.currentTarget as HTMLElement, e)
                    break */
            }
            //console.log('鼠标右键点击',type,navigator.platform)
        }).delegate('td', 'mouseenter', function (e) {
            e.stopPropagation();
            var grid = $(e.currentTarget).data('grid');
            if (!grid || grid.wid == 0) {
                return;
            }
            var work = ProcessData.WorkMap[grid.wid];
            if (!work) {
                return;
            }
            var info = [];
            if (work.Tips != '') {
                info.push('<div>描述:' + work.Tips + '</div>');
            }
            if (work.MinNum > 0 || work.MaxNum > 0) {
                info.push('<div>数量:' + work.MinNum + '/' + work.MaxNum + '</div>');
            }
            if (info.length > 0) {
                var top = $(e.currentTarget).offset().top + $(e.currentTarget).height() + 2;
                var left = $(e.currentTarget).offset().left + $(e.currentTarget).width() + 2;
                $('#workTips').css({ top: top, left: left }).show().adjust(-5).html(info.join(''));
            }
        }).delegate('td', 'mouseleave', function (e) {
            e.stopPropagation();
            $('#workTips').hide();
        });
        Main.Content.find('.title').unbind().delegate('td', 'mousedown', function (e) {
            e.stopPropagation();
            //流程区域绑定
            _this.HideMenu();
            TemplateManager.Hide();
            VersionManager.Hide();
            /* 改成左键单击 但也保留右键 为了兼容旧版本
            if (e.button !== Main.MouseDir) {
                return false
            } */
            if (!User.IsWrite) {
                return false;
            }
            _this.ShowMenuPub(e.currentTarget, e);
        }).delegate('td', 'mouseenter', function (e) {
            e.stopPropagation();
            // if($(e.currentTarget).find('.stroke').length == 1){//判断仅有date_line的
            var top = $(e.currentTarget).offset().top + $(e.currentTarget).height() + 2;
            var left = $(e.currentTarget).offset().left + $(e.currentTarget).width() + 2;
            var dateLine = $(e.currentTarget).attr('date_line');
            if (dateLine) {
                VersionManager.ShowTableHeaderTooltip(dateLine, left, top);
            }
            // }
        }).delegate('td', 'mouseleave', function (e) {
            e.stopPropagation();
            $('#workTips').hide();
        });
    };
    ProcessPanelClass.prototype.GetTheadHtmlRight = function () {
        var today = Common.GetDate(0);
        var html = "";
        html += "<thead>";
        html += "<tr> ";
        $.each(this.DateList.rows, function (date, num) {
            var mt = date.substr(-2);
            if (num > 1) {
                html += "<td colspan=\"" + num + "\" class=\"date_" + (parseInt(mt) % 2) + "\">" + date + "</td>";
            }
            else {
                html += "<td class=\"date_" + (parseInt(mt) % 2) + "\">" + mt + "</td>";
            }
        });
        html += "</tr>";
        html += "<tr class=\"title\"> ";
        $.each(this.DateList.list, function (k, info) {
            if (info.s == today) {
                html += "<td class=\"today\"";
            }
            else {
                html += "<td";
            }
            html += " date_line=\"" + info.s + "\">";
            html += " <div class=\"info\" > " + info.d + " </div>";
            if (ProcessData.HasVersionDateLineMap(info.s)) {
                var _genre = ProcessData.VersionDateLineMap[info.s][0].Genre;
                html += "<div class=\"stroke sk_" + _genre + "\" date_line=\"" + info.s + "\"></div>";
            }
            html += "</td>";
        });
        html += "</tr>";
        html += "</thead>";
        return html;
    };
    ProcessPanelClass.prototype.GetLinkName = function (link) {
        return "<div>" + (link.Name == '' ? '空' : link.Name) + " " + ProcessPanel.GetModeLinkStatusName(link.Status) + (Loader.isDebug ? '(' + link.Lid + ')' : '') + "</div>";
    };
    ProcessPanelClass.prototype.GetLinkUserName = function (link) {
        if (!link || !Data.GetUser(link.Uid)) {
            return "<div>\u7A7A</div>";
        }
        return "<div>" + Data.GetUser(link.Uid).Name + "</div>";
    };
    //组合work列表 一个mode下的多个link中的每个work
    ProcessPanelClass.prototype.GetWorkListHtml = function (mode) {
        var _this = this;
        var html = '';
        html += '<table class="linkMap">';
        $.each(mode.LinkList, function (k, link) {
            //流程与进度
            if (link.Children && link.Children.length) {
                var len = link.Children.length;
                for (var i = 0; i < len; i++) {
                    var linkChild = link.Children[i];
                    html += _this.GetWorkHtml(linkChild);
                }
            }
            else {
                html += _this.GetWorkHtml(link);
            }
        });
        html += '</table>';
        return html;
    };
    ProcessPanelClass.prototype.GetWorkHtml = function (link) {
        var html = '';
        if (!link) {
            return html;
        }
        html += "<tr class=\"trWork\" lid=\"" + link.Lid + "\">";
        $.each(this.DateList.list, function (k, info) {
            //填充
            if (info.w < 6) {
                html += '<td type="step"></td>';
            }
            else {
                html += '<td type="step" class="weekend"></td>';
            }
        });
        html += '</tr>';
        return html;
    };
    /**修改mdoe td内部的最大高度 */
    ProcessPanelClass.prototype.GetModeNameMaxHeight = function (mode) {
        var count = 0;
        if (mode.LinkList) {
            var len = mode.LinkList.length;
            for (var i = 0; i < len; i++) {
                var link = mode.LinkList[i];
                if (link.Children && link.Children.length > 0) {
                    count += link.Children.length;
                }
                else {
                    count++;
                }
            }
        }
        var maxHeight = Math.max(1, count) * 40;
        return maxHeight;
    };
    ProcessPanelClass.prototype.ChangeModeNameMaxHeight = function (mode) {
        $('#content .mode[mid="' + mode.Mid + '"] div').css('max-height', this.GetModeNameMaxHeight(mode));
    };
    ProcessPanelClass.prototype.GetModeName = function (mode) {
        return "<div style=\"max-height:" + this.GetModeNameMaxHeight(mode) + "px;\">\n\t\t" + VersionManager.GetVersionVer(mode.Vid) + (mode.Name == '' ? '空' : mode.Name) + this.GetModeLinkStatusName(mode.Status) + (Loader.isDebug ? '(' + mode.Mid + ')' : '') + "\n\t\t\t\t<div>";
    };
    ProcessPanelClass.prototype.GetModeHtmlRight = function (mid) {
        var html = '';
        var mode = ProcessData.ModeMap[mid];
        if (!mode) {
            return html;
        }
        html += "<tr class=\"trModeRight\" mid=\"" + mode.Mid + "\" style=\"border-bottom: solid 4px #002060;\">\n\t\t\t\t\t<td colspan=\"" + (this.DateList.list.length) + "\">\n\t\t\t\t\t" + this.GetWorkListHtml(mode) + "\n\t\t\t\t\t</td> \n\t\t\t\t</tr> ";
        // html += `<tr class="space"><td colspan="${(this.DateList.list.length)}"></td></tr>`
        return html;
    };
    //组合tbody
    ProcessPanelClass.prototype.GetTbodyHtmlRight = function () {
        var _this = this;
        var html = '';
        html += '<tbody>';
        //功能
        $.each(ProcessData.Project.ModeList, function (k, mode) {
            html += _this.GetModeHtmlRight(mode.Mid);
        });
        html += '</tbody>';
        return html;
    };
    //建立内容
    ProcessPanelClass.prototype.CreateProcess = function () {
        var _this = this;
        Loader.LoadVueTemplate(ProcessFilter.VuePath + "PanelFrame", function (tpl) {
            var data = {
                // modeList:[],
                modeList: ProcessData.Project.ModeList,
            };
            //组合thead
            var vue = new Vue({
                template: tpl,
                data: data,
                methods: {
                    GetModeName: function (mode) {
                        return _this.GetModeName(mode);
                    },
                    GetLinkName: function (link) {
                        return _this.GetLinkName(link);
                    },
                    GetLinkUserName: function (link) {
                        return _this.GetLinkUserName(link);
                    },
                    onLinkName: function (e, mode, link, isChild) {
                        if (isChild === void 0) { isChild = false; }
                        // console.log("[debug] onLinkName", e, ":[e]")
                        if (!User.IsWrite) {
                            return;
                        }
                        _this.ShowLinkMenu(e.target, e.pageX, e.pageY, mode, link, isChild);
                    },
                },
            }).$mount();
            var $main = Main.Draw(vue.$el);
            //
            $('#tableTitleRight').html(_this.GetTheadHtmlRight());
            $('#tableBodyRight').html(_this.GetTbodyHtmlRight());
            //流程数据
            $main.find('.trWork').each(function (index, el) {
                var lid = parseInt($(el).attr('lid'));
                _this.SetWorkData(lid, el);
            });
            $('#freezeTitleRight').unbind().freezeTop(true);
            $('#freezeBodyLeft').unbind().freezeLeft(false);
            _this.BindActions();
        });
    };
    //work数据
    ProcessPanelClass.prototype.SetWorkData = function (lid, dom) {
        var _this = this;
        var linkWork = ProcessData.LinkWorkMap[lid];
        var dateList = this.DateList.list;
        $(dom).find('td').each(function (k, el) {
            var grid = $.extend({}, dateList[k]);
            grid.lid = lid;
            grid.wid = 0;
            //填充
            if (linkWork && linkWork[grid.s]) {
                grid.wid = linkWork[grid.s].Wid;
                var work = ProcessData.WorkMap[grid.wid];
                _this.ShowWorkGrid(el, grid, work);
            }
            //绑定work的data grid
            $.data(el, 'grid', grid);
        });
    };
    //显示一个work格子内容
    ProcessPanelClass.prototype.ShowWorkGrid = function (dom, grid, work) {
        var info = work.Tag;
        if (info == '') {
            info = CollateData.StatusList[work.Status].Tag;
        }
        info = '<div class="info">' + info + '</div>';
        if (work.Tips != '' || work.MinNum > 0 || work.MaxNum > 0) {
            info += '<div class="arrow-right"></div>';
        }
        if (ProcessData.ScoreMap[grid.wid] && ProcessData.ScoreMap[grid.wid].Quality > 0) {
            info += '<div class="arrow-left"></div>';
        }
        //uploading
        if (work.uploading) {
            // info+= '<div class="work_uploading"></div>' //uploading时 work角标不用闪 所以这里先注释掉,用下一行的代码代替
            info += '<div class="arrow-right-bottom"></div>';
        }
        else if (work.FileList && work.FileList.length > 0) {
            info += '<div class="arrow-right-bottom"></div>';
        }
        //
        $(dom).attr({ 'class': 'ss_' + work.Status }).html(info);
    };
    //功能菜单
    ProcessPanelClass.prototype.ShowMenuMode = function (o, e) {
        var _this = this;
        var mid = parseInt($(o).attr('mid'));
        var top = e.pageY + 1;
        var left = e.pageX + 1;
        var mode = ProcessData.ModeMap[mid];
        var $menuMode = $('#menuMode');
        $menuMode.find(".store_txt").text(mode.Status == ModeStatusField.NORMAL ? '归档' : '恢复归档');
        $menuMode.css({ left: left, top: top }).unbind().delegate('.row[type!="color"]', 'click', function (e) {
            var type = $(e.currentTarget).attr('type');
            switch (type) {
                case 'insert':
                    _this.ShowEditMode(mid, e, C2L.C2L_PROCESS_MODE_ADD);
                    break;
                case 'edit':
                    _this.ShowEditMode(mid, e, C2L.C2L_PROCESS_MODE_EDIT);
                    break;
                case 'delete':
                    Common.Warning(o, e, function () {
                        WSConn.sendMsg(C2L.C2L_PROCESS_MODE_DELETE, { 'Mid': mode.Mid });
                    }, '删除后不可恢复，确认删除吗？');
                    break;
                case 'forward':
                    // var prev = $(o).parent().prev().prev()
                    var prev = $(o).parent().prev();
                    if (prev.length > 0) {
                        var beMid = prev.find('.mode').attr('mid');
                        WSConn.sendMsg(C2L.C2L_PROCESS_MODE_SWAP_SORT, { 'Swap': [parseInt(beMid), mode.Mid] });
                    }
                    break;
                case 'backward':
                    // var next = $(o).parent().next().next()
                    var next = $(o).parent().next();
                    if (next.length > 0) {
                        var beMid = next.find('.mode').attr('mid');
                        WSConn.sendMsg(C2L.C2L_PROCESS_MODE_SWAP_SORT, { 'Swap': [mode.Mid, parseInt(beMid)] });
                    }
                    break;
                case 'store':
                    if (mode.Status == ModeStatusField.NORMAL) {
                        Common.Warning(o, e, function () {
                            WSConn.sendMsg(C2L.C2L_PROCESS_MODE_STORE, { 'Mid': mode.Mid, 'Status': ModeStatusField.STORE });
                        }, '是否将已完成的功能进行归档？');
                    }
                    else {
                        WSConn.sendMsg(C2L.C2L_PROCESS_MODE_STORE, { 'Mid': mode.Mid, 'Status': ModeStatusField.NORMAL });
                    }
                    break;
            }
            _this.HideMenu();
        }).show().adjust(-5).find('.row[type="color"]').unbind().hover(function (e) {
            $(e.currentTarget).find('.pluginColor').show().unbind().delegate('div', 'click', function (e) {
                WSConn.sendMsg(C2L.C2L_PROCESS_MODE_COLOR, { 'Mid': mode.Mid, 'Color': $(e.currentTarget).index() });
                _this.HideMenu();
            });
        }, function (e) {
            $(e.currentTarget).find('.pluginColor').hide();
        });
    };
    //编辑功能
    ProcessPanelClass.prototype.ShowEditMode = function (mid, e, cid) {
        ProcessFilter.HideFilter();
        TemplateManager.Hide();
        VersionManager.Hide();
        var mode;
        if (mid > 0) { //新增时可能没有mid
            mode = ProcessData.ModeMap[mid];
        }
        var plan = $('#editMode').css({ left: e.pageX, top: e.pageY }).show().adjust(-5);
        var name = plan.find('textarea').val('').focus();
        if (cid == C2L.C2L_PROCESS_MODE_EDIT) {
            name.val(mode.Name).select();
            plan.find(".tpl_li").hide();
            plan.find(".tpl_edit").hide();
        }
        else {
            //TEST
            // plan.find(".tpl_li").hide()
            // plan.find(".tpl_edit").hide()
            //TODO:子流程模板好了再打开
            plan.find(".tpl_li").show();
            TemplateManager.BindTplSelect("#place_tplModeSelect");
            plan.find('.tpl_edit').show().unbind().click(function (e) {
                TemplateManager.ShowEditTplModeList(e);
                VersionManager.Hide();
            });
        }
        //版本
        VersionManager.BindSelect("#place_versionSelect", mode ? mode.Vid : 0, function (dom) {
            if (cid == C2L.C2L_PROCESS_MODE_EDIT) {
                if (ProcessData.VersionMap[mode.Vid]) {
                    $(dom).val(mode.Vid);
                }
                else {
                    $(dom).val(0); //已经被删除了
                }
            }
            else {
                $(dom).val(0);
            }
        });
        plan.find('.version_edit').show().unbind().click(function (e) {
            TemplateManager.Hide();
            VersionManager.ShowVersionList();
        });
        //确定 取消
        plan.find('.confirm').unbind().click(function () {
            var data = { 'Did': Math.abs(ProjectNav.FilterDid), 'Name': $.trim(name.val()), 'Vid': parseInt(plan.find("#versionSelect").val()) };
            if (cid == C2L.C2L_PROCESS_MODE_ADD) {
                data["PrevMid"] = mid;
                data["Tmid"] = parseInt(plan.find("#tplModeSelect").val());
            }
            else {
                data["Mid"] = mid;
            }
            WSConn.sendMsg(cid, data);
            plan.hide();
            TemplateManager.Hide();
            VersionManager.Hide();
        });
        plan.find('.cancel,.close').unbind().click(function () {
            plan.fadeOut(Config.FadeTime);
            TemplateManager.Hide();
            VersionManager.Hide();
        });
    };
    //内容菜单
    //IsWrite: true:管理员 false:非管理员
    ProcessPanelClass.prototype.ShowMenuStep = function (o, e, IsWrite) {
        var _this = this;
        var top = e.pageY + 1;
        var left = e.pageX + 1;
        var grid = $(o).data('grid');
        //没有work状态的不显示某些选项
        if (grid.wid) {
            $('#menuDay').find("[type=upload],[type=score],[type=clear]").find('.txt').removeClass('menu_disabled');
        }
        else {
            $('#menuDay').find("[type=upload],[type=score],[type=clear]").find('.txt').addClass('menu_disabled');
        }
        if (!IsWrite) {
            //$('#menuDay').find(".extends,[type=work],[type=finish],[type=delay],[type=wait],[type=rest],[type=optimize],[type=edit],[type=score],[type=clear]").hide()
            $('#menuDay .row[type!=upload]').hide();
        }
        //delegate('.row[type!="status"],.row[type!="supervisor"]' 无效, 只好仅用一个了
        $('#menuDay').css({ left: left, top: top }).unbind().delegate('.row[type!="status"]', 'click', function (e) {
            var type = $(e.currentTarget).attr('type');
            switch (type) {
                case 'work':
                case 'finish':
                case 'delay':
                case 'wait':
                case 'rest':
                case 'optimize':
                case 'complete':
                case 'submit':
                case 'modify':
                case 'pass':
                    var status = $(e.currentTarget).attr('status');
                    WSConn.sendMsg(C2L.C2L_PROCESS_WORK_STATUS, { 'Lid': grid.lid, 'Wid': grid.wid, 'Date': grid.s, 'Status': parseInt(status) });
                    break;
                case 'edit':
                    _this.ShowEditStep(o);
                    break;
                case 'score': //评价
                    if (grid.wid) {
                        _this.OnShowEditScore(o);
                    }
                    break;
                case 'upload': //附件
                    if (grid.wid) {
                        UploadManager.ShowUploadWork(o, grid.wid);
                    }
                    break;
                case 'clear':
                    if (grid.wid) {
                        WSConn.sendMsg(C2L.C2L_PROCESS_WORK_CLEAR, { 'Lid': grid.lid, 'Wid': grid.wid, 'Date': grid.s });
                    }
                    break;
                default:
                    console.log("[warn]", "click unknown type:", type);
                    return;
            }
            _this.HideMenu();
        }).show().adjust(-5);
    };
    //编辑工作补充
    ProcessPanelClass.prototype.ShowEditStep = function (o) {
        var cur = $(o).parent();
        var top = $(o).position().top - 2;
        var left = $(o).position().left + $(o).outerWidth() - 2;
        var plan = $('#editInfo').css({ left: left, top: top }).show().adjust(-5);
        var tips = plan.find('textarea').val('').focus();
        var tag = plan.find('.tag').val('');
        var minNum = plan.find('.min').val(0);
        var maxNum = plan.find('.max').val(0);
        var grid = $(o).data('grid');
        var work = ProcessData.WorkMap[grid.wid];
        var pack = {};
        pack.Wid = 0;
        if (work) {
            tips.val(work.Tips).select();
            tag.val(work.Tag);
            minNum.val(work.MinNum);
            maxNum.val(work.MaxNum);
            pack.Wid = work.Wid;
        }
        plan.find('.confirm').unbind().click(function () {
            // pack.Lid = parseInt(cur.attr('lid'))//或者 = grid.lid 
            pack.Lid = grid.lid;
            pack.Date = grid.s;
            pack.Tips = tips.val();
            pack.MinNum = parseInt(minNum.val());
            pack.MaxNum = parseInt(maxNum.val());
            pack.Tag = tag.val();
            WSConn.sendMsg(C2L.C2L_PROCESS_WORK_EDIT, pack);
            $('#editInfo').hide();
        });
        plan.find('.cancel,.close').unbind().click(function () {
            plan.fadeOut(Config.FadeTime);
        });
    };
    //评价
    ProcessPanelClass.prototype.OnShowEditScore = function (o) {
        var wid = $(o).data('grid').wid;
        var left = $(o).position().left + $(o).outerWidth() - 2;
        var top = $(o).position().top - 2;
        this.ShowEditScore(wid, left, top);
    };
    ProcessPanelClass.prototype.ShowEditScore = function (wid, left, top) {
        var plan = $('#editScore').css({ left: left, top: top }).show().adjust(-5);
        var info = plan.find('textarea').val('').focus();
        var qcos = plan.find('select:eq(0)').val('0');
        var ecos = plan.find('select:eq(1)').val('0');
        var mcos = plan.find('select:eq(2)').val('0');
        var score = ProcessData.ScoreMap[wid];
        if (score) {
            info.val(score.Info).select();
            qcos.val(score.Quality);
            ecos.val(score.Efficiency);
            mcos.val(score.Manner);
        }
        UploadManager.ShowProcessWorkFileBox(wid);
        plan.find('.confirm').unbind().click(function () {
            WSConn.sendMsg(C2L.C2L_PROCESS_WORK_SCORE, { 'Wid': wid, 'Quality': parseInt(qcos.val()), 'Efficiency': parseInt(ecos.val()), 'Manner': parseInt(mcos.val()), 'Info': info.val() });
            $('#editScore').hide();
        });
        plan.find('.cancel,.close').unbind().click(function () {
            plan.fadeOut(Config.FadeTime);
        });
    };
    //流程菜单
    ProcessPanelClass.prototype.ShowMenuLink = function (dom, e) {
        var lid = parseInt($(dom).attr('lid'));
        if (lid > 0) {
            var link = ProcessData.LinkMap[lid];
            var mode = ProcessData.ModeMap[link.Mid];
            this.ShowLinkMenu(dom, e.pageX, e.pageY, mode, link);
        }
    };
    ProcessPanelClass.prototype.ShowLinkMenu = function (dom, pageX, pageY, mode, link, isChild) {
        var _this = this;
        if (isChild === void 0) { isChild = false; }
        var $menuLink = $('#menuLink');
        $menuLink.find(".store_txt").text(link.Status == LinkStatusField.NORMAL ? '归档' : '恢复归档');
        // console.log("[debug]", "xy:", pageX, pageY)
        $menuLink.xy(pageX + 1, pageY + 1).unbind().delegate('.row', 'click', function (e) {
            var type = $(e.currentTarget).attr('type');
            switch (type) {
                case 'forward': //上移
                    var _linkList = link.ParentLid ? ProcessData.LinkMap[link.ParentLid].Children : mode.LinkList;
                    var index0 = ArrayUtil.IndexOfAttr(_linkList, FieldName.Lid, link.Lid);
                    if (index0 > 0) {
                        WSConn.sendMsg(C2L.C2L_PROCESS_LINK_SWAP_SORT, { 'Swap': [_linkList[index0 - 1].Lid, link.Lid] });
                    }
                    break;
                case 'backward': //下移动
                    var _linkList = link.ParentLid ? ProcessData.LinkMap[link.ParentLid].Children : mode.LinkList;
                    var index0 = ArrayUtil.IndexOfAttr(_linkList, FieldName.Lid, link.Lid);
                    if (index0 < _linkList.length - 1) {
                        WSConn.sendMsg(C2L.C2L_PROCESS_LINK_SWAP_SORT, { 'Swap': [link.Lid, _linkList[index0 + 1].Lid] });
                    }
                    break;
                case 'insert':
                    _this.ShowEditLink(dom, link, C2L.C2L_PROCESS_LINK_ADD);
                    break;
                case 'edit':
                    _this.ShowEditLink(dom, link, C2L.C2L_PROCESS_LINK_EDIT);
                    break;
                case 'store':
                    if (link.Status == LinkStatusField.NORMAL) {
                        if (link.ParentLid > 0 || mode.LinkList.length > 1) {
                            Common.Warning(e, function () {
                                WSConn.sendMsg(C2L.C2L_PROCESS_LINK_STORE, { 'Lid': link.Lid, 'Status': LinkStatusField.STORE });
                            }, '是否将已完成的流程进行归档？');
                        }
                        else {
                            Common.Warning(e, null, '至少要保留一个流程');
                        }
                    }
                    else {
                        WSConn.sendMsg(C2L.C2L_PROCESS_LINK_STORE, { 'Lid': link.Lid, 'Status': LinkStatusField.NORMAL });
                    }
                    break;
                case 'delete':
                    if (link.ParentLid > 0 || mode.LinkList.length > 1) {
                        Common.Warning(e, function () {
                            WSConn.sendMsg(C2L.C2L_PROCESS_LINK_DELETE, { 'Lid': link.Lid });
                        }, '删除后不可恢复，确认删除吗？');
                    }
                    else {
                        Common.Warning(e, null, '至少要保留一个流程');
                    }
                    break;
            }
            _this.HideMenu();
        }).show().adjust(-5).find('.row[type="color"]').unbind().hover(function (e) {
            $(e.currentTarget).find('.pluginColor').show().unbind().delegate('div', 'click', function (e) {
                WSConn.sendMsg(C2L.C2L_PROCESS_LINK_COLOR, { 'Lid': link.Lid, 'Color': $(e.currentTarget).index() });
                _this.HideMenu();
            });
        }, function (e) {
            $(e.currentTarget).find('.pluginColor').hide();
        });
    };
    //编辑流程名字
    ProcessPanelClass.prototype.ShowEditLink = function (dom, link, cmdId) {
        var top = $(dom).position().top - 2;
        var left = $(dom).position().left + $(dom).outerWidth() - 2;
        var plan = $('#editLink').xy(left, top).show().adjust(-5);
        var name = plan.find('textarea').val('').focus();
        if (cmdId == C2L.C2L_PROCESS_LINK_EDIT) {
            $('#editLinkSelectAddKind').hide();
            //填入旧数据
            name.val(link.Name).select();
        }
        else {
            $('#editLinkSelectAddKind').val('0').show();
            if (link.ParentLid == 0) {
                $('#editLinkSelectAddKind option[value="1"]').show();
            }
            else {
                $('#editLinkSelectAddKind option[value="1"]').hide();
            }
        }
        //
        plan.find('.confirm').unbind().click(function () {
            if (cmdId == C2L.C2L_PROCESS_LINK_ADD) {
                var _addLinkChild = parseInt($('#editLinkSelectAddKind').val());
                var dataAdd = {};
                dataAdd.Name = $.trim(name.val());
                dataAdd.PrevLid = _addLinkChild ? 0 : link.Lid;
                dataAdd.ParentLid = _addLinkChild ? link.Lid : 0;
                WSConn.sendMsg(cmdId, dataAdd);
            }
            else {
                var dataEdit = {};
                dataEdit.Name = $.trim(name.val());
                dataEdit.Lid = link.Lid;
                WSConn.sendMsg(cmdId, dataEdit);
            }
            $('#editLink').hide();
        });
        plan.find('.cancel,.close').unbind().click(function () {
            plan.fadeOut(Config.FadeTime);
        });
    };
    //人员菜单
    ProcessPanelClass.prototype.ShowMenuUser = function (o, e) {
        var _this = this;
        var top = e.pageY + 1;
        var left = e.pageX + 1;
        var lid = parseInt($(o).attr('lid'));
        var plan = $('#menuUser');
        plan.css({ left: left, top: top }).unbind().delegate('.spread .row', 'click', function (e) {
            var uid = $(e.currentTarget).attr('uid');
            if (uid) {
                WSConn.sendMsg(C2L.C2L_PROCESS_LINK_USER_CHANGE, { 'Lid': lid, 'Uid': parseInt(uid) });
                _this.HideMenu();
            }
        }).show().adjust(-5);
    };
    //发布菜单
    ProcessPanelClass.prototype.ShowMenuPub = function (o, e) {
        var top = e.pageY + 4;
        var left = e.pageX + 2;
        var index = $(o).index();
        var info = this.DateList.list[index];
        this.HideMenu();
        if (info) {
            VersionManager.ShowTableHeaderMenu(info.s, left, top);
        }
    };
    //选中迷你小匡
    ProcessPanelClass.prototype.ShowMiniBox = function (e) {
        console.log('鼠标左键点击', e.currentTarget.localName);
        var offset = $(e.currentTarget).offset();
        var top = offset.top;
        var left = offset.left;
        var height = 38;
        var width = 38;
        //$(o).append($('#commonMini').show().css({'height':height,'width':width}))
        $('#commonMini').show().css({ 'top': top, 'left': left, 'height': height, 'width': width }).unbind().bind('mousedown', function (ev) {
            if (ev.button !== Main.MouseDir) {
                // return false
            }
            //下层的元素
            //$(o).mousedown()
            console.log(e);
        });
        //clientHeight
        //offsetHeight
    };
    ProcessPanelClass.prototype.GetModeLinkStatusName = function (status) {
        switch (status) {
            case ModeStatusField.STORE:
                return "<span class=\"status_store\">(\u5DF2\u5F52\u6863)</span>";
        }
        return '';
    };
    //关闭所有菜单
    ProcessPanelClass.prototype.HideMenu = function () {
        $('#menuUser,#menuLink,#menuDay,#menuMode,#pubMenu,#workTips,#dateTime,#menuStep,#menuExtra,#menuDepartment').hide();
        Common.HidePullDownMenu();
    };
    return ProcessPanelClass;
}());
var ProcessPanel = new ProcessPanelClass();
//# sourceMappingURL=ProcessPanel.js.map