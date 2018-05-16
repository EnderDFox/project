var VersionManagerClass = /** @class */ (function () {
    function VersionManagerClass() {
        this.AuePath = "version/"; //模板所在目录
    }
    //初始化
    VersionManagerClass.prototype.Init = function () {
        // WSConn.sendMsg(C2L.C2L_TPL_MODE_VIEW, {})
    };
    //注册函数
    VersionManagerClass.prototype.RegisterFunc = function () {
    };
    VersionManagerClass.prototype.ShowEditList = function (e) {
        var _this = this;
        this.HideVersionList(false);
        ProcessPanel.HideMenu();
        //真正执行显示面板的函数
        var _show = function () {
            var pageX, pageY;
            var editMode = $('#editMode');
            if (editMode.is(":visible")) {
                pageX = editMode.x() + editMode.width() + 5;
                pageY = editMode.y();
            }
            if (!pageX) {
                pageX = e.pageX;
            }
            if (!pageY) {
                pageY = e.pageY;
            }
            var plan = $(_this.VueEditList.$el).xy(pageX, pageY).show().adjust(-5);
            plan.find('.close').unbind().click(function () {
                _this.HideVersionList();
                ProcessPanel.HideMenu();
            });
        };
        Loader.LoadVueTemplate(this.AuePath + "EditVersionList", function (txt) {
            _this.VueEditList = new Vue({
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
                    onAdd: function () {
                    },
                    onEditName: function () {
                    },
                    onDel: function () {
                    },
                    onEdit: function (e, item) {
                        _this.ShowVersionDetail(item);
                    },
                }
            }).$mount();
            Common.InsertBeforeDynamicDom(_this.VueEditList.$el);
            _show();
        });
    };
    VersionManagerClass.prototype.HideVersionList = function (fade) {
        if (fade === void 0) { fade = true; }
        if (this.VueEditList) {
            if (fade) {
                $(this.VueEditList.$el).fadeOut(Config.FadeTime, function () {
                    $(this).remove();
                });
            }
            else {
                $(this.VueEditList.$el).remove();
            }
            this.VueEditList = null;
        }
    };
    VersionManagerClass.prototype.ShowVersionDetail = function (arg) {
        var _this = this;
        this.HideVersionDetail(false);
        var version;
        if (typeof (arg) == 'number') {
            version = this.VueEditList.versions.filter(function (item) {
                if (item.Vid == arg) {
                    return true;
                }
                return false;
            })[0];
        }
        else {
            version = arg;
        }
        //
        var _show = function () {
            //为了和功能列表面板高度相同
            var pageX, pageY;
            var uiList = $(_this.VueEditList.$el);
            if (uiList.isShow()) {
                pageX = uiList.x() + uiList.width() + 5;
                pageY = uiList.y();
            }
            var plan = $(_this.VueEditDetail.$el).xy(pageX, pageY).show().adjust(-5);
            plan.find('.close').unbind().click(function () {
                _this.HideVersionDetail();
                // ProcessPanel.HideMenu()
            });
        };
        Loader.LoadVueTemplate(this.AuePath + "EditVersionDetail", function (txt) {
            _this.VueEditDetail = new Vue({
                template: txt,
                data: {
                    version: version
                },
                methods: {}
            }).$mount();
            Common.InsertBeforeDynamicDom(_this.VueEditDetail.$el);
            _show();
        });
    };
    VersionManagerClass.prototype.HideVersionDetail = function (fade) {
        if (fade === void 0) { fade = true; }
        if (this.VueEditDetail) {
            if (fade) {
                $(this.VueEditDetail.$el).fadeOut(Config.FadeTime, function () {
                    $(this).remove();
                });
            }
            else {
                $(this.VueEditDetail.$el).remove();
            }
            this.VueEditDetail = null;
        }
    };
    VersionManagerClass.prototype.Hide = function () {
        this.HideVersionList();
        this.HideVersionDetail();
    };
    return VersionManagerClass;
}());
var VersionManager = new VersionManagerClass();
//# sourceMappingURL=VersionManager.js.map