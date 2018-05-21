var VersionManagerClass = /** @class */ (function () {
    function VersionManagerClass() {
        this.AuePath = "version/"; //模板所在目录
        //
        this.PublishGenreNameList = ['开始', '完结', '封存', '延期', '发布', '总结'];
    }
    //初始化
    VersionManagerClass.prototype.Init = function () {
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
            var uiEditMode = $('#editMode');
            if (uiEditMode.isShow()) {
                pageX = uiEditMode.x() + uiEditMode.width() + 5;
                pageY = uiEditMode.y();
            }
            if (!pageX)
                pageX = e.pageX;
            if (!pageY)
                pageY = e.pageY;
            var plan = $(_this.VueEditList.$el).xy(pageX, pageY).show().adjust(-5);
        };
        Loader.LoadVueTemplate(this.AuePath + "EditVersionList", function (txt) {
            _this.VueEditList = new Vue({
                template: txt,
                data: {
                    newVer: '',
                    newName: '',
                    versions: ProcessData.VersionList,
                },
                methods: {
                    onAddVer: function (isEnter) {
                        if (isEnter === void 0) { isEnter = false; }
                        _this.VueEditList.newVer = _this.FormatVer(_this.VueEditList.newVer);
                        if (isEnter) {
                            $('#editVersionList_newName').get(0).focus();
                        }
                    },
                    onAdd: function () {
                        var vid = _this.VueEditList.versions.length > 0 ? _this.VueEditList.versions[_this.VueEditList.versions.length - 1].Vid + 1 : 1;
                        _this.VueEditList.versions.unshift({
                            Vid: vid,
                            Ver: _this.VueEditList.newVer,
                            Name: _this.VueEditList.newName,
                            PublishList: [
                                { Vid: vid, Genre: GenreField.BEGIN, DateLine: '' },
                                { Vid: vid, Genre: GenreField.END, DateLine: '' },
                                { Vid: vid, Genre: GenreField.SEAL, DateLine: '' },
                                { Vid: vid, Genre: GenreField.DELAY, DateLine: '' },
                                { Vid: vid, Genre: GenreField.PUB, DateLine: '' },
                                { Vid: vid, Genre: GenreField.SUMMARY, DateLine: '' },
                            ]
                        });
                        // console.log("[info]","onAdd")
                    },
                    onEditVer: function (e, item) {
                        var newVer = _this.FormatVer(e.target.value);
                        if (newVer != item.Ver.toString()) {
                            item.Ver = newVer;
                        }
                        else {
                            if (newVer != e.target.value) {
                                item.Ver = 't'; //vue值相同 赋值是不会触发html变化,需要现赋另一个值
                                item.Ver = newVer;
                            } //else 完全没变化,不需要管
                        }
                        // console.log("[info]",item.Ver,e.target.value)
                    },
                    onEditName: function (e, item) {
                        item.Name = e.target.value;
                    },
                    onDel: function (e, item, index) {
                        _this.VueEditList.versions.splice(index, 1);
                    },
                    onEdit: function (e, item) {
                        _this.ShowVersionDetail(item);
                    },
                    onClose: function () {
                        _this.HideVersionList();
                        ProcessPanel.HideMenu();
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
                    $(_this).val(date);
                });
            });
        };
        Loader.LoadVueTemplate(this.AuePath + "EditVersionDetail", function (txt) {
            _this.VueEditDetail = new Vue({
                template: txt,
                data: {
                    version: version
                },
                /*  filters: {
                     publishName:function(){
                         return 'iopioi'
                     },
                     // publishName: this.GetPublishName.bind(this),
                 }, */
                methods: {
                    publishName: _this.GetPublishName.bind(_this),
                    onDateClick: function (genre) {
                        //TODO: 
                    },
                    onClose: function () {
                        _this.HideVersionDetail();
                        // ProcessPanel.HideMenu()
                    }
                }
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
    /**
     * 格式化版本号   只能是 数字和. 例如 1.3   4.5.6
     * @param ori
     */
    VersionManagerClass.prototype.FormatVer = function (ori) {
        return ori.replace(/[^0-9\.]/g, '');
    };
    VersionManagerClass.prototype.GetPublishName = function (genre) {
        return this.PublishGenreNameList[genre - 1];
    };
    return VersionManagerClass;
}());
var VersionManager = new VersionManagerClass();
//# sourceMappingURL=VersionManager.js.map