var TemplateManagerClass = /** @class */ (function () {
    function TemplateManagerClass() {
        this.AuePath = "template"; //模板所在 .html
    }
    //初始化
    TemplateManagerClass.prototype.Init = function () {
        WSConn.sendMsg(C2L.C2L_TPL_MODE_VIEW, {});
    };
    //注册函数
    TemplateManagerClass.prototype.RegisterFunc = function () {
        Commond.Register(L2C.L2C_TPL_MODE_VIEW, this.L2C_ModeView.bind(this));
        Commond.Register(L2C.L2C_TPL_MODE_ADD, this.L2C_ModeAdd.bind(this));
        Commond.Register(L2C.L2C_TPL_MODE_EDIT_NAME, this.L2C_ModeEditName.bind(this));
        Commond.Register(L2C.L2C_TPL_MODE_DELETE, this.L2C_ModeDelete.bind(this));
        Commond.Register(L2C.L2C_TPL_LINK_ADD, this.L2C_LinkAdd.bind(this));
        Commond.Register(L2C.L2C_TPL_LINK_EDIT_NAME, this.L2C_LinkEditName.bind(this));
        Commond.Register(L2C.L2C_TPL_LINK_EDIT_DID, this.L2C_LinkEditDid.bind(this));
        Commond.Register(L2C.L2C_TPL_LINK_EDIT_SORT, this.L2C_LinkEditSort.bind(this));
        Commond.Register(L2C.L2C_TPL_LINK_DELETE, this.L2C_LinkDelete.bind(this));
    };
    TemplateManagerClass.prototype.L2C_ModeView = function (data) {
        if (!data.Modes) {
            data.Modes = [];
        }
        var len = data.Modes.length;
        for (var i = 0; i < len; i++) {
            var mode = data.Modes[i];
            if (!mode.Links) {
                mode.Links = [];
            }
            for (var j = 0; j < mode.Links.length; j++) {
                var link = mode.Links[j];
                if (!link.Children) {
                    link.Children = [];
                }
            }
        }
        //
        this.DataModes = data.Modes;
    };
    TemplateManagerClass.prototype.L2C_ModeAdd = function (data) {
        var modes = this.DataModes;
        modes.push({
            Tmid: data.Tmid,
            Name: data.Name,
            Links: [],
        });
    };
    TemplateManagerClass.prototype.L2C_ModeEditName = function (data) {
        var modes = this.DataModes;
        var index = ArrayUtil.IndexOfByKey(modes, FIELD_NAME.Tmid, data.Tmid);
        if (index > -1) {
            var mode = modes[index].Name = data.Name;
        }
    };
    TemplateManagerClass.prototype.L2C_ModeDelete = function (data) {
        var modes = this.DataModes;
        var index = ArrayUtil.IndexOfByKey(modes, FIELD_NAME.Tmid, data.Tmid);
        if (index > -1) {
            //先如果删除的是正在编辑的,则关闭编辑流程列表面板
            if (this.vue_editTplModeDetail && this.vue_editTplModeDetail.mode.Tmid == modes[index].Tmid) {
                this.RemoveEditTplModeDetail();
            }
            //
            modes.splice(index, 1);
        }
    };
    TemplateManagerClass.prototype.L2C_LinkAdd = function (link) {
        var _this = this;
        if (!link.Children) {
            link.Children = [];
        }
        var modes = this.DataModes;
        var index = ArrayUtil.IndexOfByKey(modes, FIELD_NAME.Tmid, link.Tmid);
        if (index == -1) {
            console.log("[debug]", "L2C_LinkAdd index==-1", mode, ":[mode]");
            return;
        }
        var mode = modes[index];
        //
        if (link.ParentTlid == 0) {
            mode.Links.push(link);
            if (this.vue_editTplModeDetail && this.vue_editTplModeDetail.linkList.length > 10) {
                //滚动条滚动到底
                Vue.nextTick(function () {
                    var scrollee = $(_this.vue_editTplModeDetail.$el).find('ul');
                    scrollee.scrollTop(scrollee[0].scrollHeight);
                });
            }
        }
        else {
            for (var i = 0; i < mode.Links.length; i++) {
                var parentLink = mode.Links[i];
                if (parentLink.Tlid == link.ParentTlid) {
                    parentLink.Children.push(link);
                    break;
                }
            }
        }
    };
    TemplateManagerClass.prototype.L2C_LinkEditName = function (data) {
        var modes = this.DataModes;
        var len = modes.length;
        for (var i = 0; i < len; i++) {
            var mode = modes[i];
            for (var j = 0; j < mode.Links.length; j++) {
                var tlink = mode.Links[j];
                if (tlink.Tlid == data.Tlid) {
                    tlink.Name = data.Name;
                    return;
                }
                else {
                    var index = ArrayUtil.IndexOfByKey(tlink.Children, FIELD_NAME.Tlid, data.Tlid);
                    if (index > -1) {
                        tlink.Children[index].Name = data.Name;
                        return;
                    }
                }
            }
        }
    };
    TemplateManagerClass.prototype.L2C_LinkEditDid = function (data) {
        var modes = this.DataModes;
        var len = modes.length;
        for (var i = 0; i < len; i++) {
            var mode = modes[i];
            for (var j = 0; j < mode.Links.length; j++) {
                var tlink = mode.Links[j];
                if (tlink.Tlid == data.Tlid) {
                    tlink.Did = data.Did;
                    return;
                }
                else {
                    var index = ArrayUtil.IndexOfByKey(tlink.Children, FIELD_NAME.Tlid, data.Tlid);
                    if (index > -1) {
                        tlink.Children[index].Did = data.Did;
                        return;
                    }
                }
            }
        }
    };
    /**link排序变化  */
    TemplateManagerClass.prototype.L2C_LinkEditSort = function (data) {
        var modes = this.DataModes;
        var mode;
        var index = ArrayUtil.IndexOfByKey(modes, FIELD_NAME.Tmid, data.Tmid);
        if (index > -1) {
            mode = modes[index];
        }
        else {
            console.log("[error] L2C_LinkEditSort mode index==-1", data);
            return;
        }
        var _linkList;
        if (data.ParentTlid == 0) {
            _linkList = mode.Links;
        }
        else {
            var parentTlink = ArrayUtil.FindByKey(mode.Links, FIELD_NAME.Tlid, data.ParentTlid);
            if (parentTlink) {
                _linkList = parentTlink.Children;
            }
            else {
                console.log("[error] L2C_LinkEditSort parentTlink index==-1", data);
                return;
            }
        }
        var i1, i2;
        var l1, l2;
        var len = _linkList.length;
        for (var i = 0; i < len; i++) {
            var link = _linkList[i];
            if (link.Tlid == data.Tlid1) {
                l1 = link;
                i1 = i;
            }
            else if (link.Tlid == data.Tlid2) {
                l2 = link;
                i2 = i;
            }
        }
        //
        /*  没必要同步sort
          var sort = l1.Sort
          l1.Sort = l2.Sort
          l2.Sort = sort */
        //交换数据位置
        // _linkList = this.vue_editTplLinkChild.linkList
        _linkList.splice.apply(_linkList, [i1, 1].concat(_linkList.splice(i2, 1, _linkList[i1])));
    };
    TemplateManagerClass.prototype.L2C_LinkDelete = function (data) {
        var modes = this.DataModes;
        var len = modes.length;
        for (var i = 0; i < len; i++) {
            var mode = modes[i];
            for (var j = 0; j < mode.Links.length; j++) {
                var tlink = mode.Links[j];
                if (tlink.Tlid == data.Tlid) {
                    mode.Links.splice(j, 1);
                    if (this.vue_editTplLinkChild && this.vue_editTplLinkChild.parentLink.Tlid == data.Tlid) {
                        this.RemoveEditTplLinkChild();
                    }
                    return;
                }
                else {
                    var index = ArrayUtil.IndexOfByKey(tlink.Children, FIELD_NAME.Tlid, data.Tlid);
                    if (index > -1) {
                        tlink.Children.splice(index, 1);
                        return;
                    }
                }
            }
        }
    };
    //通过Tlid获得对应的 tpl mode
    /*  GetModeByTlid(tlid: number) {
         var modes = this.DataModes
         var len = modes.length
         for (var i = 0; i < len; i++) {
             var mode = modes[i]
             var index = ArrayUtil.IndexOfAttr(mode.Links, FieldName.Tlid, tlid)
             if (index > -1) {
                 return mode
             }
         }
         return null;
     } */
    /**
     * 通过 tlid获取TplLinkSingle
     */
    TemplateManagerClass.prototype.GetTplLinkSingleByTlid = function (tlid) {
        var modes = this.DataModes;
        var len = modes.length;
        for (var i = 0; i < len; i++) {
            var mode = modes[i];
            var index = ArrayUtil.IndexOfByKey(mode.Links, FIELD_NAME.Tlid, tlid);
            if (index > -1) {
                return mode.Links[tlid];
            }
        }
        return null;
    };
    TemplateManagerClass.prototype.BindTplSelect = function (domId) {
        var _this = this;
        if (this.vue_tplSelect == null) {
            Loader.LoadVueTemplate(this.AuePath, "TplModeSelect", function (tpl) {
                _this.vue_tplSelect = new Vue({
                    el: domId,
                    template: tpl,
                    data: {
                        modes: _this.DataModes
                    }
                });
            });
        }
    };
    TemplateManagerClass.prototype.ShowEditTplModeList = function (e) {
        var _this = this;
        ProcessPanel.HideMenu();
        //真正执行显示面板的函数
        var show = function () {
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
            var plan = $(_this.vue_editTplModeList.$el).xy(pageX, pageY).show().adjust(-5);
            /*  var plan = $(this.vue_editTplModeList.$el).css({
                 left: pageX,
                 top: pageY
             }).show().adjust(-5) */
            plan.find('.close').unbind().click(function () {
                plan.fadeOut(Config.FadeTime);
                _this.RemoveEditTplModeDetail();
                ProcessPanel.HideMenu();
            });
        };
        //判断是否需要初始化: 加载模板
        if (this.vue_editTplModeList == null) {
            Loader.LoadVueTemplate(this.AuePath, "EditTplModeList", function (tpl) {
                _this.vue_editTplModeList = new Vue({
                    template: tpl,
                    data: {
                        newName: "",
                        modes: _this.DataModes,
                        showTmid: 0,
                    },
                    methods: {
                        onAdd: function (e) {
                            var modes = this.modes;
                            var newName = this.newName.toString().trim();
                            /*  if (newName == "") {
                                 Common.AlertFloatMsg("名称不能为空", e)
                                 return;
                             } */
                            WSConn.sendMsg(C2L.C2L_TPL_MODE_ADD, {
                                Name: newName
                            });
                            this.newName = "";
                        },
                        onEditName: function (e, Tmid) {
                            var modes = this.modes;
                            var index = ArrayUtil.IndexOfByKey(modes, FIELD_NAME.Tmid, Tmid);
                            if (index > -1) {
                                var mode = modes[index];
                                var newName = $('#editTplModeList_' + Tmid + '_name').val().trim();
                                if (newName == '' || newName == mode.Name.toString()) {
                                    // Common.AlertFloatMsg("请输入新的名称", e)
                                    //input恢复成旧名称
                                    var oldName = mode.Name.toString();
                                    mode.Name = "temp_-=-=-=-=-=-=-=-"; //输入和旧的一样,不会刷新,所以要先赋值一个不一样的
                                    mode.Name = oldName;
                                }
                                else {
                                    WSConn.sendMsg(C2L.C2L_TPL_MODE_EDIT_NAME, {
                                        Tmid: mode.Tmid,
                                        Name: newName
                                    });
                                }
                            }
                            else {
                                return;
                            }
                        },
                        onEdit: _this.ShowEditTplModeDetail.bind(_this),
                        onDel: function (e, Tmid) {
                            Common.Warning(this.$el, e, function () {
                                WSConn.sendMsg(C2L.C2L_TPL_MODE_DELETE, {
                                    Tmid: Tmid
                                });
                            }, '删除后不可恢复，确认删除吗？');
                        }
                    }
                }).$mount();
                $('#dynamicDom').before(_this.vue_editTplModeList.$el);
                show();
            });
        }
        else {
            show();
        }
    };
    TemplateManagerClass.prototype.RemoveEditTplModeDetail = function () {
        if (this.vue_editTplModeList) {
            this.vue_editTplModeList.showTmid = 0;
        }
        if (this.vue_editTplModeDetail) {
            $(this.vue_editTplModeDetail.$el).remove();
            this.vue_editTplModeDetail = null;
        }
        this.RemoveEditTplLinkChild();
    };
    TemplateManagerClass.prototype.RemoveEditTplLinkChild = function () {
        if (this.vue_editTplModeDetail) {
            this.vue_editTplModeDetail.showTlid = 0;
        }
        if (this.vue_editTplLinkChild) {
            $(this.vue_editTplLinkChild.$el).remove();
            this.vue_editTplLinkChild = null;
        }
    };
    //显示编辑模版-功能-流程列表
    TemplateManagerClass.prototype.ShowEditTplModeDetail = function (e, showTmid, parentTlink) {
        var _this = this;
        if (parentTlink === void 0) { parentTlink = null; }
        if (parentTlink == null) {
            this.RemoveEditTplModeDetail();
        }
        else {
            this.RemoveEditTplLinkChild();
        }
        ProcessPanel.HideMenu();
        //
        var _vue;
        var modeIndex;
        //
        var modes = this.vue_editTplModeList.modes;
        var mode;
        modeIndex = ArrayUtil.IndexOfByKey(modes, FIELD_NAME.Tmid, showTmid);
        if (modeIndex > -1) {
            mode = modes[modeIndex];
        }
        else {
            console.log("[error]", "modeIndex==-1", showTmid, ":[showTmid]");
            return;
        }
        this.vue_editTplModeList.showTmid = showTmid;
        //
        var linkIndex;
        if (parentTlink != null) {
            linkIndex = ArrayUtil.IndexOfByKey(mode.Links, FIELD_NAME.Tlid, parentTlink.Tlid);
            if (linkIndex > -1) {
            }
            else {
                console.log("[error]", "linkIndex==-1", parentTlink, ":[parentTlink]");
                return;
            }
        }
        //真正执行显示面板的函数
        var show = function () {
            //为了和功能列表面板高度相同
            var pageX, pageY;
            if (parentTlink == null) {
                var tplModeList = $(_this.vue_editTplModeList.$el);
                if (tplModeList.isShow()) {
                    pageX = tplModeList.x() + 256 + 30;
                    if (modeIndex > -1) {
                        var btnEdit = tplModeList.find('.btnEdit').get(modeIndex); //放到编辑按钮下面
                        if (btnEdit) {
                            pageY = tplModeList.y() + $(btnEdit).y() + $(btnEdit).outerHeight() + 2;
                        }
                        else {
                            pageY = tplModeList.y();
                        }
                    }
                    else {
                        pageY = tplModeList.y();
                    }
                }
            }
            else {
                var tplModeDetail = $(_this.vue_editTplModeDetail.$el);
                if (tplModeDetail.isShow()) {
                    pageX = tplModeDetail.x() + 283 + 30;
                    if (linkIndex > -1) {
                        var btnEdit = tplModeDetail.find('.btnEditChildren').get(linkIndex); //放到编辑按钮下面
                        if (btnEdit) {
                            pageY = tplModeDetail.y() + $(btnEdit).y() + $(btnEdit).outerHeight() + 2;
                        }
                        else {
                            pageY = tplModeDetail.y();
                        }
                    }
                    else {
                        pageY = tplModeDetail.y();
                    }
                }
            }
            if (!pageX)
                pageX = e.pageX;
            if (!pageY)
                pageY = e.pageY;
            var plan = $(_vue.$el).xy(pageX, pageY).show().adjust(-5);
            if (parentTlink) {
                _this.vue_editTplModeDetail.showTlid = parentTlink.Tlid;
            }
        };
        //判断是否需要初始化: 加载模板
        Loader.LoadVueTemplate(this.AuePath, "EditTplModeDetail", function (tpl) {
            //读取顶级部门保存为字典
            var departmentDict = {};
            var len = Data.DepartmentLoop.length;
            for (var i = 0; i < len; i++) {
                var dinfo = Data.DepartmentLoop[i].info;
                departmentDict[dinfo.Did] = dinfo;
            }
            //
            _vue = new Vue({
                template: tpl,
                data: {
                    newName: "",
                    newDid: User.Did,
                    mode: mode,
                    linkList: parentTlink == null ? mode.Links : parentTlink.Children,
                    parentLink: parentTlink,
                    showTlid: 0,
                },
                methods: {
                    onAdd: function (e) {
                        var newName = _vue.newName.toString().trim();
                        WSConn.sendMsg(C2L.C2L_TPL_LINK_ADD, {
                            Tmid: _vue.mode.Tmid,
                            Name: newName,
                            Did: parseInt(_vue.newDid.toString()),
                            ParentTlid: parentTlink == null ? 0 : parentTlink.Tlid,
                        });
                        _vue.newName = "";
                    },
                    onClone: function (e, tlink) {
                        WSConn.sendMsg(C2L.C2L_TPL_LINK_CLONE, {
                            CopyTlid: tlink.Tlid
                        });
                    },
                    onEditName: function (e, tlink) {
                        var newName = $('#editTplModeDetail_' + tlink.Tlid + '_name').val().trim();
                        if (newName == '' || newName == tlink.Name.toString()) {
                            //input恢复成旧名称
                            var oldName = tlink.Name.toString();
                            tlink.Name = "temp_abcdefghijklmnopqrstuvwxyz"; //输入和旧的一样,不会刷新,所以要先赋值一个不一样的
                            tlink.Name = oldName;
                        }
                        else {
                            WSConn.sendMsg(C2L.C2L_TPL_LINK_EDIT_NAME, {
                                Tlid: tlink.Tlid,
                                Name: newName,
                            });
                        }
                    },
                    onEditChildren: function (e, tlink) {
                        _this.ShowEditTplModeDetail(e, showTmid, tlink);
                    },
                    onChangeDid: function (e, tlid) {
                        _this.ShowMenuDepartment(e, function (newDid) {
                            if (tlid == -1) { //这是新建 里的部门选择
                                _vue.newDid = newDid;
                            }
                            else {
                                var index = ArrayUtil.IndexOfByKey(_vue.linkList, FIELD_NAME.Tlid, tlid);
                                if (index > -1) { //第一个不需要上移了
                                    _vue.linkList[index].Did = newDid;
                                    WSConn.sendMsg(C2L.C2L_TPL_LINK_EDIT_DID, {
                                        Tlid: _vue.linkList[index].Tlid,
                                        Did: newDid,
                                    });
                                }
                            }
                        });
                    },
                    onSortUp: function (e, tplLink, index) {
                        WSConn.sendMsg(C2L.C2L_TPL_LINK_EDIT_SORT, {
                            Tmid: _vue.mode.Tmid,
                            ParentTlid: _vue.parentLink == null ? 0 : _vue.parentLink.Tlid,
                            Tlid1: _vue.linkList[index - 1].Tlid,
                            Tlid2: tplLink.Tlid,
                        });
                    },
                    onSortDown: function (e, tplLink, index) {
                        WSConn.sendMsg(C2L.C2L_TPL_LINK_EDIT_SORT, {
                            Tmid: _vue.mode.Tmid,
                            ParentTlid: _vue.parentLink == null ? 0 : _vue.parentLink.Tlid,
                            Tlid1: tplLink.Tlid,
                            Tlid2: _vue.linkList[index + 1].Tlid,
                        });
                    },
                    onDel: function (e, tlink) {
                        Common.Warning(_vue.$el, e, function () {
                            WSConn.sendMsg(C2L.C2L_TPL_LINK_DELETE, {
                                Tlid: tlink.Tlid
                            });
                        }, '删除后不可恢复，确认删除吗？');
                    },
                    onClose: function (e) {
                        if (parentTlink == null) {
                            _this.RemoveEditTplModeDetail();
                        }
                        else {
                            _this.RemoveEditTplLinkChild();
                        }
                    },
                },
                filters: {
                    didName: function (Did) {
                        return (departmentDict[Did] || departmentDict[1]).Name; //管理员Did=0 不属于任何部门，先用策划的
                    }
                },
            }).$mount();
            $('#dynamicDom').before(_vue.$el);
            if (parentTlink == null) {
                _this.vue_editTplModeDetail = _vue;
            }
            else {
                _this.vue_editTplLinkChild = _vue;
                parentTlink.Children = _this.vue_editTplLinkChild.linkList;
            }
            show();
        });
    };
    TemplateManagerClass.prototype.ShowMenuDepartment = function (e, callback) {
        var _this = this;
        ProcessPanel.HideMenu();
        this.ShowMenuDepartment_callback = callback;
        //真正执行显示面板的函数
        var show = function () {
            $('#dynamicDom').before(_this.vue_menuDepartment.$el); //为了显示到其它界面上层
            PopManager.CancelMouseOut(_this.vue_menuDepartment.$el);
            var plan = $(_this.vue_menuDepartment.$el).css({
                left: e.pageX,
                top: e.pageY
            }).show().adjust(-5);
            PopManager.RegisterMouseOut(_this.vue_menuDepartment.$el, function () {
                $(_this.vue_menuDepartment.$el).hide();
                PopManager.CancelMouseOut(_this.vue_menuDepartment.$el);
            });
        };
        //判断是否需要初始化: 加载模板
        if (this.vue_menuDepartment == null) {
            Loader.LoadVueTemplate(this.AuePath, "MenuDepartment", function (tpl) {
                //读取部门保存为数组
                var departments = [];
                var len = Data.DepartmentLoop.length;
                for (var i = 0; i < len; i++) {
                    var dinfo = Data.DepartmentLoop[i].info;
                    departments.push({
                        Did: dinfo.Did,
                        Name: dinfo.Name
                    });
                }
                _this.vue_menuDepartment = new Vue({
                    template: tpl,
                    methods: {
                        onClick: function (Did) {
                            if (_this.ShowMenuDepartment_callback) {
                                _this.ShowMenuDepartment_callback(parseInt(Did.toString()));
                            }
                            ProcessPanel.HideMenu();
                        }
                    },
                    data: {
                        departments: departments
                    }
                }).$mount();
                show();
            });
        }
        else {
            show();
        }
    };
    TemplateManagerClass.prototype.Hide = function () {
        $("#editTplModeList,#menuDepartment").hide();
        this.RemoveEditTplModeDetail();
    };
    return TemplateManagerClass;
}());
var TemplateManager = new TemplateManagerClass();
//# sourceMappingURL=TemplateManager.js.map