var VersionManagerClass = /** @class */ (function () {
    function VersionManagerClass() {
        this.AuePath = "version/"; //模板所在目录
        //
        this.PublishGenreNameList = ['开始', '完结', '封存', '延期', '发布', '总结'];
    }
    //初始化
    VersionManagerClass.prototype.Init = function () {
        Commond.Register(L2C.L2C_VERSION_ADD, this.L2C_VersionAdd.bind(this));
        Commond.Register(L2C.L2C_VERSION_DELETE, this.L2C_VersionDelete.bind(this));
        Commond.Register(L2C.L2C_VERSION_CHANGE_VER, this.L2C_VersionChangeVer.bind(this));
        Commond.Register(L2C.L2C_VERSION_CHANGE_NAME, this.L2C_VersionChangeName.bind(this));
        Commond.Register(L2C.L2C_VERSION_CHANGE_PUBLISH, this.L2C_VersionChangePublish.bind(this));
    };
    //注册函数
    VersionManagerClass.prototype.RegisterFunc = function () {
    };
    Object.defineProperty(VersionManagerClass.prototype, "VersionList", {
        get: function () {
            return ProcessData.VersionList;
        },
        enumerable: true,
        configurable: true
    });
    VersionManagerClass.prototype.L2C_VersionAdd = function (data) {
        var v = {
            Vid: data.Vid,
            Ver: data.Ver,
            Name: data.Name,
            PublishList: []
        };
        for (var genre = GenreField.BEGIN; genre <= GenreField.SUMMARY; genre++) {
            v.PublishList.push({ Vid: v.Vid, Genre: genre, DateLine: '' });
        }
        //
        this.VersionList.unshift(v);
        ProcessData.VersionMap[v.Vid] = v;
    };
    VersionManagerClass.prototype.L2C_VersionDelete = function (data) {
        var index = ArrayUtil.IndexOfAttr(this.VersionList, "Vid", data.Vid);
        if (index >= -1) {
            this.VersionList.splice(index, 1);
        }
        var v = ProcessData.VersionMap[data.Vid];
        if (v) {
            delete ProcessData.VersionMap[data.Vid];
            if (v && v.PublishList) {
                var len = v.PublishList.length;
                for (var i = 0; i < len; i++) {
                    var p = v.PublishList[i];
                    this.DoPublishDelete(p);
                }
            }
            this.RefreshMode(data.Vid);
            if (this.VueVersionDetail && this.VueVersionDetail.version.Vid == v.Vid) {
                this.HideVersionDetail();
            }
        }
    };
    VersionManagerClass.prototype.L2C_VersionChangeVer = function (data) {
        var v = ProcessData.VersionMap[data.Vid];
        if (v) {
            //FormatVer可能会导致 newVer!=input.value,但 newVer==item.Ver, 需要把item.Ver设置为item.Ver, 此时如果vue值相同, 赋值是不会触发html变化,需要先赋另一个值
            Vue.set(v, "Ver", data.Ver);
            this.RefreshMode(data.Vid);
        }
    };
    VersionManagerClass.prototype.L2C_VersionChangeName = function (data) {
        var v = ProcessData.VersionMap[data.Vid];
        if (v) {
            v.Name = data.Name;
            this.RefreshMode(data.Vid);
        }
    };
    VersionManagerClass.prototype.L2C_VersionChangePublish = function (data) {
        var v = ProcessData.VersionMap[data.Vid];
        if (v && v.PublishList) {
            var len = v.PublishList.length;
            for (var i = 0; i < len; i++) {
                var p = v.PublishList[i];
                if (p.Genre == data.Genre) {
                    var DateLineOld = p.DateLine.toString();
                    //先把旧的`DateLine`删了
                    this.DoPublishDelete(p);
                    //设置新`DateLine`
                    p.DateLine = data.DateLine;
                    if (p.DateLine) {
                        if (!ProcessData.VersionDateLineMap[p.DateLine]) {
                            ProcessData.VersionDateLineMap[p.DateLine] = [];
                        }
                        ProcessData.VersionDateLineMap[p.DateLine].push(p);
                        ProcessManager.PublishEdit(p);
                    }
                    break;
                }
            }
        }
        //校验当前的
        if (this.VueVersionDetail && this.VueVersionDetail.version.Vid == data.Vid) {
            this.ValidatePublishDateLine();
        }
    };
    VersionManagerClass.prototype.BindSelect = function (domId, callback) {
        var _this = this;
        if (this.VueSelect == null) {
            Loader.LoadVueTemplate(this.AuePath + "VersionSelect", function (txt) {
                _this.VueSelect = new Vue({
                    el: domId,
                    template: txt,
                    data: {
                        versions: [],
                    }
                });
                _this.VueSelect.versions = _this.VersionList;
                _this.VueSelect.$nextTick(function () {
                    if (callback != null) {
                        callback(_this.VueSelect.$el);
                    }
                });
            });
        }
        else {
            this.VueSelect.versions = this.VersionList;
            if (callback != null) {
                callback(this.VueSelect.$el);
            }
        }
    };
    /**
     * @showVid 默认打开的Vid
     * @showGenre 默认打开的publish需要, 闪一下
     */
    VersionManagerClass.prototype.ShowVersionList = function (showVid, showGenre) {
        var _this = this;
        if (showVid === void 0) { showVid = 0; }
        if (showGenre === void 0) { showGenre = 0; }
        this.HideVersionList(false);
        ProcessPanel.HideMenu();
        //真正执行显示面板的函数
        var _show = function () {
            var pageX, pageY;
            var uiEditMode = $('#editMode');
            if (uiEditMode.isShow()) {
                pageX = uiEditMode.x() + uiEditMode.width() + 5;
                pageY = uiEditMode.y();
            }
            else {
                pageX = 160 + $(window).scrollLeft();
                pageY = 150 + $(window).scrollTop();
            }
            var plan = $(_this.VueVersionList.$el).xy(pageX, pageY).show().adjust(-5);
            if (showVid) {
                _this.ShowVersionDetail(showVid, showGenre);
            }
        };
        Loader.LoadVueTemplate(this.AuePath + "EditVersionList", function (txt) {
            _this.VueVersionList = new Vue({
                template: txt,
                data: {
                    newVer: '',
                    newName: '',
                    versions: ProcessData.VersionList,
                    showVid: showVid,
                },
                methods: {
                    onAddVer: function (isEnter) {
                        if (isEnter === void 0) { isEnter = false; }
                        _this.VueVersionList.newVer = _this.FormatVer(_this.VueVersionList.newVer);
                        if (isEnter) {
                            $('#editVersionList_newName').get(0).focus();
                        }
                    },
                    onAdd: function () {
                        console.log("[debug]", "new Ver", _this.VueVersionList.newVer.trim().toString());
                        var data = { Ver: _this.VueVersionList.newVer.trim().toString(), Name: _this.VueVersionList.newName.trim().toString() };
                        WSConn.sendMsg(C2L.C2L_VERSION_ADD, data);
                        _this.VueVersionList.newVer = "";
                        _this.VueVersionList.newName = "";
                    },
                    onEditVer: function (e, item) {
                        //格式化为 正确的版本格式
                        var newVer = _this.FormatVer(e.target.value);
                        if (newVer == "") { //再次修改就别设置 ""了
                            newVer = item.Ver.toString();
                        }
                        if (newVer != item.Ver.toString()) {
                            item.Ver = newVer;
                            var data = { Vid: item.Vid, Ver: newVer };
                            WSConn.sendMsg(C2L.C2L_VERSION_CHANGE_VER, data);
                        }
                        else if (newVer != e.target.value) {
                            //FormatVer可能会导致 newVer!=input.value,但 newVer==item.Ver, 需要把item.Ver设置为item.Ver, 此时如果vue值相同, 赋值是不会触发html变化,需要先赋另一个值
                            Vue.set(item, 'Ver', newVer);
                        }
                    },
                    onEditName: function (e, item) {
                        var newName = e.target.value;
                        newName = newName.trim();
                        if (item.Name != newName) {
                            var data = { Vid: item.Vid, Name: newName };
                            WSConn.sendMsg(C2L.C2L_VERSION_CHANGE_NAME, data);
                        }
                    },
                    onDel: function (e, item, index) {
                        Common.Warning(null, e, function () {
                            var data = { Vid: item.Vid };
                            WSConn.sendMsg(C2L.C2L_VERSION_DELETE, data);
                        }, '删除后不可恢复，确认删除吗？');
                    },
                    onEdit: function (e, item) {
                        _this.ShowVersionDetail(item);
                    },
                    onClose: function () {
                        _this.HideVersionList();
                        _this.HideVersionDetail();
                        ProcessPanel.HideMenu();
                    },
                }
            }).$mount();
            Common.InsertBeforeDynamicDom(_this.VueVersionList.$el);
            _show();
        });
    };
    VersionManagerClass.prototype.HideVersionList = function (fade) {
        if (fade === void 0) { fade = true; }
        if (this.VueVersionList) {
            if (fade) {
                $(this.VueVersionList.$el).fadeOut(Config.FadeTime, function () {
                    $(this).remove();
                });
            }
            else {
                $(this.VueVersionList.$el).remove();
            }
            this.VueVersionList = null;
        }
    };
    VersionManagerClass.prototype.ShowVersionDetail = function (showVid, showGenre) {
        var _this = this;
        if (showGenre === void 0) { showGenre = 0; }
        this.HideVersionDetail(false);
        var version;
        if (typeof (showVid) == 'number') {
            version = this.VueVersionList.versions.filter(function (item) {
                if (item.Vid == showVid) {
                    return true;
                }
                return false;
            })[0];
        }
        else {
            version = showVid;
            showVid = version.Vid;
        }
        this.VueVersionList.showVid = showVid; // 当前正打开的记录有变化
        //
        var _show = function () {
            //为了和功能列表面板高度相同
            var pageX, pageY;
            var uiList = $(_this.VueVersionList.$el);
            if (uiList.isShow()) {
                pageX = uiList.x() + uiList.width() + 5;
                var index = ArrayUtil.IndexOfAttr(_this.VueVersionList.versions, 'Vid', version.Vid);
                // console.log("[info]",index,":[index]",version.Vid,":[version.Vid]",version.Ver,":[version.Ver]")
                if (index > -1) {
                    var btnEdit = uiList.find('.btnEdit').get(index); //放到编辑按钮下面
                    if (btnEdit) {
                        pageY = uiList.y() + $(btnEdit).y() + $(btnEdit).outerHeight() + 2;
                    }
                    else {
                        pageY = uiList.y();
                    }
                }
                else {
                    pageY = uiList.y();
                }
            }
            else {
                //其实不应该进入这里
                pageX = 160 + $(window).scrollLeft();
                pageY = 150 + $(window).scrollTop();
            }
            var plan = $(_this.VueVersionDetail.$el).xy(pageX, pageY).show().adjust(-5);
            //关闭日期
            plan.unbind().mousedown(function (e) {
                if ($(e.target).attr('class') != 'date') {
                    DateTime.HideDate();
                }
                /*  if ($(e.target).attr('class') != 'select') {
                 $('#storeMenu').hide()
                 } */
            });
            //日期绑定
            plan.find('.date').unbind().click(function () {
                var _this = this;
                DateTime.Open(this, $(this).val(), function (date) {
                    // console.log("[debug]","DateTime:",date)
                    $(_this).val(date);
                    // $(this).trigger('change')
                    $(_this).click(); //change无法触发,只好用click
                });
            });
            _this.ValidatePublishDateLine();
            // setTimeout(() => {
            // }, 1000);
            /*   Vue.nextTick(()=>{
                  this.ValidatePublishDateLine()
              })) */
        };
        Loader.LoadVueTemplate(this.AuePath + "EditVersionDetail", function (txt) {
            _this.VueVersionDetail = new Vue({
                template: txt,
                data: {
                    version: version,
                    showGenre: showGenre,
                },
                /*  filters: {
                     publishName:function(){
                         return 'iopioi'
                     },
                     // publishName: this.GetPublishName.bind(this),
                 }, */
                methods: {
                    publishName: _this.GetPublishName.bind(_this),
                    onDateClick: function (e, item) {
                        // console.log("[info]","onClick Date",e.target.value)
                        if (e.target.value && item.DateLine != e.target.value) {
                            // console.log("[info]","onClick Date send",e.target.value)
                            var data = { Vid: item.Vid, Genre: item.Genre, DateLine: e.target.value };
                            WSConn.sendMsg(C2L.C2L_VERSION_CHANGE_PUBLISH, data);
                        }
                    },
                    onDelete: function (e, item) {
                        Common.Warning(null, e, function () {
                            var data = { Vid: item.Vid, Genre: item.Genre, DateLine: '' };
                            WSConn.sendMsg(C2L.C2L_VERSION_CHANGE_PUBLISH, data);
                        }, '删除后不可恢复，确认删除吗？');
                    },
                    onClose: function () {
                        _this.HideVersionDetail();
                        // ProcessPanel.HideMenu()
                    }
                }
            }).$mount();
            Common.InsertBeforeDynamicDom(_this.VueVersionDetail.$el);
            _show();
        });
    };
    /**验证当前的 DateLine 有时间问题的 设置IsError=true */
    VersionManagerClass.prototype.ValidatePublishDateLine = function () {
        var hasDateStart = Boolean(this.VueVersionDetail.version.PublishList[0].DateLine);
        var lastDateLineTimestamp = 0;
        var lastPublish;
        var len = this.VueVersionDetail.version.PublishList.length;
        for (var i = 0; i < len; i++) {
            var p = this.VueVersionDetail.version.PublishList[i];
            if (p.DateLine) {
                // console.log("[debug]", Common.DateStr2TimeStamp(p.DateLine))
                var _timestamp = Common.DateStr2TimeStamp(p.DateLine);
                if (i == 0) {
                    p.ErrorMsg = '';
                    lastDateLineTimestamp = _timestamp;
                    lastPublish = p;
                }
                else {
                    if (hasDateStart == false) {
                        //没设置start 却先设置其它时间了, 则start需要标红
                        this.VueVersionDetail.version.PublishList[0].ErrorMsg = '必须设置开始日期';
                    }
                    if (_timestamp < lastDateLineTimestamp) {
                        //后面的时间必须大于等于前面的时间,否则标红
                        p.ErrorMsg = this.GetPublishName(p.Genre) + "\u65E5\u671F\u5FC5\u987B\u665A\u4E8E" + this.GetPublishName(lastPublish.Genre) + "\u65E5\u671F";
                    }
                    else {
                        p.ErrorMsg = '';
                    }
                    lastDateLineTimestamp = _timestamp;
                    lastPublish = p;
                }
            }
            else {
                p.ErrorMsg = '';
            }
        }
    };
    VersionManagerClass.prototype.HideVersionDetail = function (fade) {
        if (fade === void 0) { fade = true; }
        if (this.VueVersionList) {
            this.VueVersionList.showVid = 0;
        }
        if (this.VueVersionDetail) {
            if (fade) {
                $(this.VueVersionDetail.$el).fadeOut(Config.FadeTime, function () {
                    $(this).remove();
                });
            }
            else {
                $(this.VueVersionDetail.$el).remove();
            }
            this.VueVersionDetail = null;
        }
    };
    VersionManagerClass.prototype.Hide = function () {
        this.HideVersionList();
        this.HideVersionDetail();
    };
    /**根据日期决定打开的面板 */
    VersionManagerClass.prototype.ShowVersionByDateLine = function (dateLine) {
        if (ProcessData.HasVersionDateLineMap(dateLine)) {
            var p = ProcessData.VersionDateLineMap[dateLine][0];
            this.ShowVersionList(p.Vid, p.Genre);
        }
        else {
            this.ShowVersionList();
        }
    };
    /**显示进度页面 表格头 日期格子中的tooltip */
    VersionManagerClass.prototype.ShowTableHeaderTooltip = function (dateLine, x, y) {
        var str = "";
        if (ProcessData.HasVersionDateLineMap(dateLine)) {
            var pList = ProcessData.VersionDateLineMap[dateLine];
            if (pList.length > 1) {
                str += "<span style=\"color:#FF0000\">\u8B66\u544A:\u6709\u591A\u4E2A\u7248\u672C\u65E5\u671F</span><br/>";
                str += "<span style=\"color:#FF0000\">\u70B9\u51FB\u53F3\u952E\u7F16\u8F91</span><br/>";
            }
            var len = pList.length;
            for (var i = 0; i < len; i++) {
                var p = pList[i];
                var v = ProcessData.VersionMap[p.Vid];
                str += "<span style=\"max-width:144px;display:inline-block;\" class=\"text-overflow-hide\">\u7248\u672C:" + this.GetVersionFullname(v) + "</span><br/>";
                str += "<span class=\"sk_" + p.Genre + "\">" + this.GetPublishName(p.Genre) + "\u65E5\u671F</span><br/>";
                if (i < len - 1) {
                    str += "<hr/>";
                }
            }
        }
        else {
            str = "\u65E0\u7248\u672C";
        }
        $('#workTips').xy(x, y).show().adjust(-5).html(str);
    };
    /**显示进度页面 表格头 右键打开的菜单 */
    VersionManagerClass.prototype.ShowTableHeaderMenu = function (dateLine, x, y) {
        var _this = this;
        var itemList = [];
        var pList = ProcessData.VersionDateLineMap[dateLine];
        if (pList && pList.length > 0) {
            var len = pList.length;
            for (var i = 0; i < len; i++) {
                var p = pList[i];
                var v = ProcessData.VersionMap[p.Vid];
                var item = { Key: p.Vid, Label: "\u7248\u672C:" + v.Ver + " " + this.GetPublishName(p.Genre) + "\u65E5\u671F", Data: p.Genre };
                itemList.push(item);
            }
            Common.ShowPullDownMenu(x, y, itemList, function (item) {
                _this.ShowVersionList(item.Key, item.Data);
            });
        }
        else {
            //TODO:
        }
    };
    VersionManagerClass.prototype.DoPublishDelete = function (p) {
        if (p && p.DateLine) {
            ProcessData.DeleteVersionDateLineMap(p);
            if (ProcessData.HasVersionDateLineMap(p.DateLine)) {
                ProcessManager.PublishEdit(ProcessData.VersionDateLineMap[p.DateLine][0]); //还有其它的日期,刷新一下
            }
            else {
                ProcessManager.PublishDelete(p.DateLine); //没有其它的日期, 删除掉吧
            }
        }
    };
    /**
     * 刷新对应的mode
     * @param vid
     */
    VersionManagerClass.prototype.RefreshMode = function (vid) {
        for (var k in ProcessData.ModeMap) {
            var mode = ProcessData.ModeMap[k];
            if (mode.Vid == vid) {
                if (!ProcessData.VersionMap[vid]) {
                    //已经是delete的vid
                    mode.Vid = 0;
                }
                ProcessManager.ModeEdit(mode);
            }
        }
    };
    /**
     * 格式化版本号   只能是 数字和`.` 例如 1.3   4.5.6
     * @param ori
     */
    VersionManagerClass.prototype.FormatVer = function (ori) {
        return ori.replace(/[^0-9\.]/g, '').trim();
    };
    VersionManagerClass.prototype.GetPublishName = function (genre) {
        return this.PublishGenreNameList[genre - 1];
    };
    //
    VersionManagerClass.prototype.GetVersionVer = function (vid) {
        var versionVer = '';
        if (vid) {
            var versionSingle = ProcessData.VersionMap[vid];
            if (versionSingle) {
                versionVer = versionSingle.Ver;
            }
        }
        return versionVer;
    };
    VersionManagerClass.prototype.GetVersionFullname = function (version) {
        return this.GetVersionVer(version.Vid) + (version.Name == '' ? '' : '-' + version.Name);
    };
    return VersionManagerClass;
}());
var VersionManager = new VersionManagerClass();
//# sourceMappingURL=VersionManager.js.map