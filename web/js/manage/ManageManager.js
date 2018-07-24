/** 管理项目 部门 职位 权限 */
var ProjectEditPageIndex;
(function (ProjectEditPageIndex) {
    ProjectEditPageIndex[ProjectEditPageIndex["Department"] = 1] = "Department";
    ProjectEditPageIndex[ProjectEditPageIndex["Position"] = 2] = "Position";
    ProjectEditPageIndex[ProjectEditPageIndex["User"] = 3] = "User";
})(ProjectEditPageIndex || (ProjectEditPageIndex = {}));
/**部门下拉列表可用性 */
var DeptDropdownItemEnabled;
(function (DeptDropdownItemEnabled) {
    DeptDropdownItemEnabled[DeptDropdownItemEnabled["ENABLED"] = 0] = "ENABLED";
    DeptDropdownItemEnabled[DeptDropdownItemEnabled["DISABLED"] = 2] = "DISABLED";
    DeptDropdownItemEnabled[DeptDropdownItemEnabled["HIDE"] = 4] = "HIDE";
})(DeptDropdownItemEnabled || (DeptDropdownItemEnabled = {}));
var ManageManagerClass = /** @class */ (function () {
    function ManageManagerClass() {
        this.UserConfig = {
            /**posn list显示子部门的职位 */
            ShownDeptChildren: true,
        };
        this.VuePath = "manage/";
    }
    ManageManagerClass.prototype.Init = function () {
        this.RegisterPB();
        this.Data = ManageData;
        UrlParam.Callback = this.UrlParamCallback.bind(this);
        this.InitVue(this.UrlParamCallback.bind(this));
    };
    ManageManagerClass.prototype.RegisterPB = function () {
        Commond.Register(PB_CMD.MANAGE_DEPT_ADD, this.PB_DeptAdd.bind(this));
        Commond.Register(PB_CMD.MANAGE_DEPT_DEL, this.PB_DeptDel.bind(this));
        Commond.Register(PB_CMD.MANAGE_DEPT_EDIT_NAME, this.PB_DeptEditName.bind(this));
        // Commond.Register(PB_CMD.MANAGE_DEPT_EDIT_SORT, this.PB_DeptAdd.bind(this))
    };
    ManageManagerClass.prototype.PB_DeptAdd = function (dept) {
        dept.Children = [];
        for (var i = 0; i < dept.PosnList.length; i++) {
            var posn = dept.PosnList[i];
            posn.UserList = [];
            posn.AuthList == null ? posn.AuthList = [] : undefined;
        }
        //
        if (dept.Fid == 0) {
            dept.Depth = 0;
            this.Data.GetProjByPid(dept.Pid).DeptTree.push(dept);
        }
        else {
            var parentDept = this.Data.DeptDict[dept.Fid];
            dept.Depth = parentDept.Depth + 1;
            parentDept.Children.push(dept);
        }
        this.Data.DeptDict[dept.Did] = dept;
    };
    ManageManagerClass.prototype.PB_DeptDel = function (data) {
        for (var i = 0; i < data.DidList.length; i++) {
            var did = data.DidList[i];
            var dept = this.Data.DeptDict[did];
            if (dept) {
                var brothers = this.Data.GetBrotherDepartmentList(dept);
                if (brothers) {
                    var brotherIndex = ArrayUtil.IndexOfByKey(brothers, FieldName.Did, dept.Did);
                    brothers.splice(brotherIndex, 1);
                }
                //
                delete this.Data.DeptDict[dept.Did];
            }
        }
    };
    ManageManagerClass.prototype.PB_DeptEditName = function (data) {
        var dept = this.Data.DeptDict[data.Did];
        if (dept) {
            dept.Name = data.Name;
            for (var i = 0; i < dept.PosnList.length; i++) {
                var posn = dept.PosnList[i];
                if (!posn.Name) { //空名职位 也 同步为部门名
                    posn.Name = dept.Name;
                }
            }
        }
    };
    //#
    ManageManagerClass.prototype.UrlParamCallback = function () {
        Common.PopupHideAll();
        var pid = UrlParam.Get(URL_PARAM_KEY.PID, 0);
        var proj = this.Data.GetProjectListHasAuth().FindByKey(FieldName.PID, pid);
        if (proj) {
            this.ShowProjectEdit();
        }
        else {
            this.ShowProjectList();
        }
    };
    ManageManagerClass.prototype.InitVue = function (cb) {
        var _this = this;
        Loader.LoadVueTemplateList([this.VuePath + "NavbarComp", this.VuePath + "DeptDropdownComp"], function (tplList) {
            //注册组件
            Vue.component('NavbarComp', {
                template: tplList[0],
                props: {},
                data: function () {
                    return {
                        currUser: _this.Data.CurrUser,
                    };
                },
                methods: {
                    OnShowProjList: function () {
                        if (_this.VueProjectEdit) {
                            $(_this.VueProjectEdit.$el).remove();
                        }
                        UrlParam.RemoveAll().Reset();
                        _this.ShowProjectList();
                    },
                }
            });
            Vue.component('DeptDropdownComp', {
                template: tplList[1],
                props: {
                    // deptList: Array,
                    btnId: String,
                    btnLabel: String,
                    btnDisabled: Boolean,
                    checkItemCb: Function,
                    currDept: Object,
                },
                data: function () {
                    return {
                        deptList: _this.Data.CurrProj.DeptTree,
                    };
                },
                methods: {
                    deptOption: _this.DeptOption.bind(_this),
                    OnBtnClick: function () {
                        this.deptList = TreeUtil.Map(ManageData.CurrProj.DeptTree);
                    },
                }
            });
            //#
            cb();
        });
    };
    /**没有权限访问的页面 通常是通过url进入的 */
    ManageManagerClass.prototype.ShowNoAuthPage = function () {
        //TODO:
    };
    ManageManagerClass.prototype.ShowProjectList = function () {
        var _this = this;
        //
        Loader.LoadVueTemplate(this.VuePath + "ProjectList", function (tpl) {
            var vue = new Vue({
                template: tpl,
                data: {
                    auth: _this.Data.MyAuth,
                    currUser: _this.Data.CurrUser,
                    newName: '',
                    projectList: _this.Data.GetProjectListHasAuth(),
                },
                methods: {
                    GetDateStr: function (timeStamp) {
                        return Common.TimeStamp2DateStr(timeStamp);
                    },
                    GetProjMaster: function (proj) {
                        if (proj.MasterUid > 0) {
                            return _this.Data.UserDict[proj.MasterUid].Name;
                        }
                        else {
                            return '空';
                        }
                    },
                    OnEditMaster: function (proj, user) {
                        if (proj.MasterUid == _this.Data.CurrUser.Uid && !_this.Data.MyAuth[AUTH.PROJECT_LIST]) {
                            //是这个项目的负责人,并且不是超管
                            Common.ConfirmWarning("\u4F60\u662F\u8FD9\u4E2A\u9879\u76EE\u73B0\u5728\u7684\u8D1F\u8D23\u4EBA <br/>\u5982\u679C\u4FEE\u6539\u8D1F\u8D23\u4EBA,\u4F60\u5C06\u5931\u53BB\u8FD9\u4E2A\u9879\u76EE\u7684\u7BA1\u7406\u6743\u9650", "\u8981\u5C06'\u8D1F\u8D23\u4EBA'\u4FEE\u6539\u4E3A'" + user.Name + "'\u5417?", function () {
                                proj.MasterUid = user.Uid;
                                _this.Data.RemoveMyAuth(AUTH.PROJECT_MANAGE);
                            });
                        }
                        else {
                            proj.MasterUid = user.Uid;
                        }
                    },
                    GetProjAllDeptLength: function (proj) {
                        return TreeUtil.Length(proj.DeptTree);
                    },
                    GetProjAllPosnLength: function (proj) {
                        return _this.Data.GetProjAllPosnList(proj).length;
                    },
                    GetProjUserLength: function (proj) {
                        return proj.UserList.length;
                    },
                    GetProjUserListTitle: function (proj) {
                        var userNameArr = [];
                        for (var i = 0; i < proj.UserList.length; i++) {
                            var user = proj.UserList[i];
                            userNameArr.push(user.Name);
                        }
                        return userNameArr.join(",");
                    },
                    onEditName: function (e, proj, index) {
                        var newName = e.target.value.trim();
                        if (!newName) {
                            e.target.value = proj.Name;
                            return;
                        }
                        if (newName != proj.Name) {
                            if (_this.Data.ProjList.IndexOfByKey(FieldName.Name, newName) > -1) {
                                Common.AlertError("\u5373\u5C06\u628A\u9879\u76EE \"" + proj.Name + "\" \u6539\u540D\u4E3A \"" + newName + "\" <br/><br/>\u4F46\u9879\u76EE\u540D\u79F0 \"" + newName + "\" \u5DF2\u7ECF\u5B58\u5728");
                                e.target.value = proj.Name;
                                return;
                            }
                            Common.ConfirmWarning("\u5373\u5C06\u628A\u9879\u76EE \"" + proj.Name + "\" \u6539\u540D\u4E3A \"" + newName + "\"", null, function () {
                                proj.Name = newName;
                            }, function () {
                                e.target.value = proj.Name;
                            });
                        }
                    },
                    onClose: function () {
                    },
                    onShowDepartmentList: function (proj, index) {
                        UrlParam.Set(URL_PARAM_KEY.PID, proj.Pid).Set(URL_PARAM_KEY.PAGE, ProjectEditPageIndex.Department).Reset();
                        _this.ShowProjectEdit();
                    },
                    onShowPosnList: function (proj, index) {
                        UrlParam.Set(URL_PARAM_KEY.PID, proj.Pid).Set(URL_PARAM_KEY.PAGE, ProjectEditPageIndex.Position).Reset();
                        _this.ShowProjectEdit();
                    },
                    onShowUserList: function (proj, index) {
                        UrlParam.Set(URL_PARAM_KEY.PID, proj.Pid).Set(URL_PARAM_KEY.PAGE, ProjectEditPageIndex.User).Reset();
                        _this.ShowProjectEdit();
                    },
                    onDel: function (e, proj, index) {
                        Common.ConfirmDelete(function () {
                            _this.VueProjectList.projectList.splice(index, 1);
                        }, "\u5373\u5C06\u5220\u9664\u9879\u76EE \"" + proj.Name + "\"");
                    },
                    onAdd: function () {
                        var newName = _this.VueProjectList.newName.toString().trim();
                        if (!newName) {
                            Common.AlertError("\u9879\u76EE\u540D\u79F0 " + newName + " \u4E0D\u53EF\u4EE5\u4E3A\u7A7A");
                            return;
                        }
                        if (_this.Data.ProjList.IndexOfByKey(FieldName.Name, newName) > -1) {
                            Common.AlertError("\u9879\u76EE\u540D\u79F0 " + newName + " \u5DF2\u7ECF\u5B58\u5728");
                            return;
                        }
                        _this.Data.ProjList.push({
                            Pid: _this.Data.ProjList[_this.VueProjectList.projectList.length - 1].Pid + 1,
                            Name: _this.VueProjectList.newName.toString(),
                            MasterUid: 0, UserList: [],
                            CreateTime: new Date().getTime(),
                            DeptTree: [_this.Data.NewDeptManager()],
                        });
                        _this.VueProjectList.newName = '';
                    }
                },
            }).$mount();
            _this.VueProjectList = vue;
            //#show
            Common.InsertIntoPageDom(vue.$el);
        });
    };
    ManageManagerClass.prototype.ShowProjectEdit = function () {
        var _this = this;
        var proj = this.Data.GetProjectListHasAuth().FindByKey(FieldName.PID, UrlParam.Get(URL_PARAM_KEY.PID));
        this.Data.CurrProj = proj;
        Loader.LoadVueTemplateList([this.VuePath + "ProjectEdit"], function (tplList) {
            var currPage = UrlParam.Get(URL_PARAM_KEY.PAGE, [ProjectEditPageIndex.Department, ProjectEditPageIndex.Position, ProjectEditPageIndex.User]);
            TreeUtil.Every(_this.Data.CurrProj.DeptTree, function (dept) {
                dept.Pid = proj.Pid;
                return true;
            });
            //
            var vue = new Vue({
                template: tplList[0],
                data: {
                    auth: _this.Data.MyAuth,
                    currUser: _this.Data.CurrUser,
                    currPage: currPage,
                    projectList: _this.Data.GetProjectListHasAuth(),
                    project: proj,
                    dpTree: _this.Data.CurrProj.DeptTree,
                    newName: proj ? proj.Name : '',
                },
                methods: {
                    onShowCurrProj: function () {
                        if (_this.VueProjectEdit.projectList.length == 1) {
                            //仅在只有一个项目 可以用, 多个项目就是下拉列表了
                            UrlParam.Set(URL_PARAM_KEY.PAGE, ProjectEditPageIndex.Department).Reset();
                            _this.ShowProjectEdit();
                        }
                    },
                    onShowProj: function (proj, index) {
                        UrlParam.Set(URL_PARAM_KEY.PID, proj.Pid).Set(URL_PARAM_KEY.PAGE, ProjectEditPageIndex.Department).Reset();
                        _this.ShowProjectEdit();
                    },
                    onShowPage: function (page) {
                        UrlParam.Set(URL_PARAM_KEY.PAGE, page).Remove(URL_PARAM_KEY.DID).Remove(URL_PARAM_KEY.FKEY).Reset();
                        _this.VueProjectEdit.currPage = page;
                        _this.SwitchProjectEditPageContent();
                    },
                },
            }).$mount();
            _this.VueProjectEdit = vue;
            //#show
            Common.InsertIntoPageDom(vue.$el);
            _this.SwitchProjectEditPageContent();
        });
    };
    ManageManagerClass.prototype.SwitchProjectEditPageContent = function () {
        var currPage = UrlParam.Get(URL_PARAM_KEY.PAGE, [ProjectEditPageIndex.Department, ProjectEditPageIndex.Position, ProjectEditPageIndex.User]);
        switch (currPage) {
            case ProjectEditPageIndex.Department:
                this.ShowDepartmentList();
                break;
            case ProjectEditPageIndex.Position:
                this.ShowPositionList();
                break;
            case ProjectEditPageIndex.User:
                this.ShowUserList();
                break;
        }
    };
    ManageManagerClass.prototype.ShowDepartmentList = function () {
        var _this = this;
        this.VueProjectEdit.currPage = ProjectEditPageIndex.Department;
        Loader.LoadVueTemplateList([this.VuePath + "DeptList", this.VuePath + "DeptListComp"], function (tplList) {
            Vue.component('DeptListComp', {
                template: tplList[1],
                props: {
                    parentDept: Object,
                    deptTree: Array,
                    index: Number,
                },
                data: function () {
                    return {
                        auth: _this.Data.MyAuth,
                    };
                },
                methods: {
                    GetDeptAllPosnList: _this.Data.GetDeptAllPosnList.bind(_this.Data),
                    GetDeptUserList: _this.Data.GetDeptUserList.bind(_this.Data),
                    GetDeptAllUserList: _this.Data.GetDeptAllUserList.bind(_this.Data),
                    CheckCanMoveParentDp: _this.CheckCanMoveParentDp.bind(_this),
                    CheckSortDown: _this.DeptListCheckSortDown.bind(_this),
                    CheckSortUp: _this.DeptListCheckSortUp.bind(_this),
                    onEditName: function (e, dept, i0) {
                        var newName = e.target.value.trim();
                        if (!newName) {
                            e.target.value = dept.Name;
                            return;
                        }
                        if (newName != dept.Name) {
                            if (TreeUtil.FindByKey(_this.Data.CurrProj.DeptTree, FieldName.Name, newName)) {
                                Common.AlertError("\u5373\u5C06\u628A\u90E8\u95E8 \"" + dept.Name + "\" \u6539\u540D\u4E3A \"" + newName + "\" <br/><br/>\u4F46\u804C\u4F4D\u540D\u79F0 \"" + newName + "\" \u5DF2\u7ECF\u5B58\u5728");
                                e.target.value = dept.Name;
                                return;
                            }
                            var data = { Did: dept.Did, Name: newName };
                            Common.ConfirmWarning("\u5373\u5C06\u628A\u90E8\u95E8 \"" + dept.Name + "\" \u6539\u540D\u4E3A \"" + newName + "\"", null, function () {
                                WSConn.sendMsg(PB_CMD.MANAGE_DEPT_EDIT_NAME, data);
                            }, function () {
                                e.target.value = dept.Name;
                            });
                        }
                    },
                    onAddChild: function (parentDp, i0) {
                        /*  var dp: DepartmentSingle = {
                             Did: this.Data.NewDepartmentUuid, Name: ``, Depth: parentDp.Depth + 1, Children: [], PositionList: [
                                 { Posnid: this.Data.NewPositionUuid, Did: this.Data.NewDepartmentUuid, Name: ``, AuthorityList: [], UserList: [], },//给一个默认的职位
                             ],
                             Fid: parentDp.Did,
                             Sort: 1,
                         }
                         this.Data.NewDepartmentUuid++
                         this.Data.NewPositionUuid++
                         this.Data.DeptDict[dp.Did] = dp
                         parentDp.Children.push(dp) */
                        var data = {
                            Pid: _this.Data.CurrProj.Pid,
                            Fid: parentDp.Did,
                            Name: _this.VueDepartmentList.newName.toString(),
                        };
                        WSConn.sendMsg(PB_CMD.MANAGE_DEPT_ADD, data);
                    },
                    DeptDropdownCheckItemCb: function (dept, deptDropdown) {
                        if (deptDropdown.Sort == 0) {
                            return DeptDropdownItemEnabled.HIDE;
                        }
                        else if (!_this.CheckCanMoveParentDp(dept, deptDropdown)) {
                            return DeptDropdownItemEnabled.DISABLED;
                        }
                        else {
                            return DeptDropdownItemEnabled.ENABLED;
                        }
                    },
                    onEditParentDp: function (dept, toParentDept) {
                        if (toParentDept == null) {
                            if (dept.Fid == 0) {
                                return; //已经是顶级职位了
                            }
                        }
                        else {
                            if (!_this.CheckCanMoveParentDp(dept, toParentDept)) {
                                return;
                            }
                        }
                        //从当前父tree中删除
                        var brothers = _this.Data.GetBrotherDepartmentList(dept);
                        brothers.RemoveByKey(FieldName.Did, dept.Did);
                        //
                        if (toParentDept == null) {
                            //改为顶级部门
                            dept.Fid = 0;
                            dept.Depth = 0;
                            _this.Data.CurrProj.DeptTree.push(dept);
                        }
                        else {
                            //放到其他部门下
                            dept.Fid = toParentDept.Did;
                            dept.Depth = toParentDept.Depth + 1;
                            toParentDept.Children.push(dept);
                        }
                        //子部门的深度改变
                        TreeUtil.Every(dept.Children, function (child, _, __, depthChild) {
                            child.Depth = dept.Depth + depthChild + 1;
                            return true;
                        });
                    },
                    onEditPosition: function (dp, i0) {
                        UrlParam.Set(URL_PARAM_KEY.PAGE, ProjectEditPageIndex.Position).Set(URL_PARAM_KEY.DID, dp.Did).Reset();
                        _this.ShowPositionList();
                    },
                    onEditUserList: function (dept) {
                        UrlParam.Set(URL_PARAM_KEY.PAGE, ProjectEditPageIndex.User).Set(URL_PARAM_KEY.FKEY, dept.Name).Reset();
                        _this.ShowUserList();
                    },
                    onSortDown: function (e, dp, i0) {
                        if (!_this.DeptListCheckSortDown(dp, i0)) {
                            return;
                        }
                        var brothers = _this.Data.GetBrotherDepartmentList(dp);
                        var brotherIndex = ArrayUtil.IndexOfByKey(brothers, FieldName.Did, dp.Did);
                        var brother = brothers[brotherIndex + 1];
                        brothers.splice(brotherIndex, 1);
                        brothers.splice(brotherIndex + 1, 0, dp);
                    },
                    onSortUp: function (e, dp, i0) {
                        if (!_this.DeptListCheckSortUp(dp, i0)) {
                            return;
                        }
                        var brothers = _this.Data.GetBrotherDepartmentList(dp);
                        var brotherIndex = ArrayUtil.IndexOfByKey(brothers, FieldName.Did, dp.Did);
                        brothers.splice(brotherIndex, 1);
                        brothers.splice(brotherIndex - 1, 0, dp);
                    },
                    onDel: function (dept, i0) {
                        Common.ConfirmDelete(function () {
                            //所有子的did都拿出来发给后端
                            var didList = TreeUtil.Map([dept], function (dept) {
                                return dept.Did;
                            });
                            var data = { DidList: didList };
                            WSConn.sendMsg(PB_CMD.MANAGE_DEPT_DEL, data);
                        }, "\u5373\u5C06\u5220\u9664\u90E8\u95E8 \"" + dept.Name + "\" \u53CA\u5176\u5B50\u90E8\u95E8<br/>\n                        \u8BE5\u90E8\u95E8\u53CA\u5176\u5B50\u90E8\u95E8\u7684\u6240\u6709\u804C\u4F4D\u90FD\u5C06\u88AB\u5220\u9664");
                    },
                }
            });
            var vue = new Vue({
                template: tplList[0],
                data: {
                    auth: _this.Data.MyAuth,
                    deptTree: _this.Data.CurrProj.DeptTree,
                    newName: '',
                },
                filters: {
                    /**除去第一个数据后剩下的 */
                    remainDeptTree: function (deptTree) {
                        return deptTree.slice(1, deptTree.length);
                    }
                },
                methods: {
                    onAdd: function () {
                        /*  var dp: DepartmentSingle = {
                             Did: this.Data.NewDepartmentUuid, Name: this.VueDepartmentList.newName.toString(), Depth: 0, Children: [], PositionList: [
                                 {//给一个默认的职位
                                     Posnid: this.Data.NewPositionUuid,
                                     Did: this.Data.NewDepartmentUuid,
                                     Name: this.VueDepartmentList.newName.toString(),
                                     AuthorityList: [],
                                     UserList: [],
                                 },
                             ],
                             Fid: 0, Sort: 1,
                         }
                         this.VueDepartmentList.newName = ''
                         this.Data.NewDepartmentUuid++
                         this.Data.NewPositionUuid++
                         this.Data.DeptDict[dp.Did] = dp
                         this.Data.CurrProj.DeptTree.push(dp) */
                        var data = {
                            Pid: _this.Data.CurrProj.Pid,
                            Name: _this.VueDepartmentList.newName.toString(),
                        };
                        WSConn.sendMsg(PB_CMD.MANAGE_DEPT_ADD, data);
                    },
                },
            }).$mount();
            _this.VueDepartmentList = vue;
            //#show
            Common.InsertIntoDom(vue.$el, _this.VueProjectEdit.$refs.pageContent);
            //#drag Sortable
            var _renderTagDepthDrag = function ($curr, depth) {
                var $eleArr = $curr.find('.tag-depth-drag');
                for (var eleI = 0; eleI < $eleArr.length; eleI++) {
                    var $ele = $($eleArr[eleI]);
                    var __originDepth = parseInt($ele.attr('depth'));
                    var __cDepth = __originDepth + (depth - _originDepth);
                    var rs = [];
                    for (var i = 0; i < __cDepth * 2; i++) {
                        rs.push("<span class=\"glyphicon glyphicon-minus\" aria-hidden=\"true\"></span>");
                    }
                    $ele.html(rs.join(''));
                }
            };
            var _originDepth; //托转项目原始的depth
            var _lastDepth = 0; //上一次render时使用的depth
            var opt = {
                draggable: ".list-complete-item",
                handle: ".btn-drag",
                group: 'dragGroup',
                scorll: true,
                // animation: 150, //动画参数
                // ghostClass: 'sortable-ghostClass',
                chosenClass: 'sortable-chosenClass',
                onStart: function (evt) {
                    var $curr = $(evt.item);
                    $curr.find('.tag-depth').hide();
                    var dept = _this.Data.DeptDict[parseInt($(evt.item).attr(FieldName.Did))];
                    $curr.find('.tag-depth-drag').show();
                    _originDepth = parseInt($curr.find('.tag-depth-drag:first').attr('depth'));
                    _lastDepth = dept.Depth;
                    _renderTagDepthDrag($curr, dept.Depth);
                },
                onMove: function (evt) {
                    var $curr = $(evt.dragged);
                    var dept = _this.Data.DeptDict[parseInt($curr.attr(FieldName.Did))];
                    var toDid = parseInt($(evt.to).attr(FieldName.Did));
                    var toParentDept = _this.Data.DeptDict[toDid];
                    var depth;
                    if (toParentDept == null) {
                        depth = 0;
                    }
                    else {
                        //判断目标不是自己活自己的子成员
                        if (dept.Did == toParentDept.Did || _this.Data.IsDepartmentChild(dept, toParentDept)) {
                            return;
                        }
                        depth = toParentDept.Depth + 1;
                    }
                    if (_lastDepth != depth) {
                        _lastDepth = depth;
                        _renderTagDepthDrag($curr, depth);
                    }
                },
                onEnd: function (evt) {
                    var $curr = $(evt.item);
                    $curr.find('.tag-depth').show();
                    $curr.find('.tag-depth-drag').hide();
                },
                onAdd: function (evt) {
                    // console.log("[debug] onAdd:", $(evt.item).attr(FieldName.Did), $(evt.from).attr(FieldName.Did),evt.oldIndex, '->', $(evt.to).attr(FieldName.Did), evt.newIndex)
                    var dept = _this.Data.DeptDict[parseInt($(evt.item).attr(FieldName.Did))];
                    var fromBrothers = _this.Data.GetBrotherDepartmentList(dept);
                    var toDid = parseInt($(evt.to).attr(FieldName.Did));
                    var toParentDept = _this.Data.DeptDict[toDid];
                    var toIndex = evt.newIndex;
                    //
                    //从当前父tree中删除
                    var brothers = _this.Data.GetBrotherDepartmentList(dept);
                    brothers.RemoveByKey(FieldName.Did, dept.Did);
                    //
                    if (toParentDept == null) {
                        //改为顶级部门
                        dept.Fid = 0;
                        dept.Depth = 0;
                        _this.Data.CurrProj.DeptTree.splice(toIndex + 1, 0, dept); //因为顶级有个`管理部`占用了一格,因此要+1
                    }
                    else {
                        //放到其他部门下
                        dept.Fid = toParentDept.Did;
                        dept.Depth = toParentDept.Depth + 1;
                        toParentDept.Children.splice(toIndex, 0, dept);
                    }
                    //子部门的深度改变
                    TreeUtil.Every(dept.Children, function (child, _, __, depthChild) {
                        child.Depth = dept.Depth + depthChild + 1;
                        return true;
                    });
                },
                onUpdate: function (evt) {
                    // console.log("[debug] onUpdate:", $(evt.item).attr(FieldName.Did), 'index:', evt.oldIndex, '->', evt.newIndex)
                    var dept = _this.Data.DeptDict[parseInt($(evt.item).attr(FieldName.Did))];
                    var fromBrothers = _this.Data.GetBrotherDepartmentList(dept);
                    var fromIndex = evt.oldIndex;
                    var toIndex = evt.newIndex;
                    if (dept.Fid == 0) {
                        fromBrothers.splice(fromIndex + 1, 1);
                        fromBrothers.splice(toIndex + 1, 0, dept);
                    }
                    else {
                        fromBrothers.splice(fromIndex, 1);
                        fromBrothers.splice(toIndex, 0, dept);
                    }
                }
            };
            var $listComp = $('.listComp');
            // console.log("[debug]", $('.listComp'), ":[$('.listComp').length]")
            for (var i = 1; i < $listComp.length; i++) {
                Sortable.create($listComp.get(i), opt);
            }
        });
    };
    ManageManagerClass.prototype.DeptOption = function (dp) {
        if (dp.Depth == 0) {
            return dp.Name;
        }
        else {
            var rs = '';
            for (var i = 0; i < dp.Depth; i++) {
                rs += '--';
            }
            // rs += '└';
            rs += dp.Name;
            return rs;
        }
    };
    ManageManagerClass.prototype.DeptListCheckSortUp = function (dp, i0) {
        if (dp.Fid == 0) {
            if (i0 > 1) { //顶级因为有个`管理员`部门
                return true;
            }
        }
        else {
            if (i0 > 0) {
                return true;
            }
        }
        return false;
    };
    ManageManagerClass.prototype.DeptListCheckSortDown = function (dp, i0) {
        var brothers = this.Data.GetBrotherDepartmentList(dp);
        var brotherIndex = ArrayUtil.IndexOfByKey(brothers, FieldName.Did, dp.Did);
        if (brotherIndex < brothers.length - 1) {
            return true;
        }
        return false;
    };
    /**是否可以移动到 目标部门 */
    ManageManagerClass.prototype.CheckCanMoveParentDp = function (dp, parentDp) {
        if (dp.Did == parentDp.Did) {
            return false;
        }
        if (dp.Fid == parentDp.Did) {
            return false;
        }
        if (this.Data.IsDepartmentChild(dp, parentDp)) {
            return false;
        }
        return true;
    };
    ManageManagerClass.prototype.ShowPositionList = function () {
        var _this = this;
        this.VueProjectEdit.currPage = ProjectEditPageIndex.Position;
        Loader.LoadVueTemplateList([this.VuePath + "PosnList", this.VuePath + "PosnListComp"], function (tplList) {
            Vue.component("PosnListComp", {
                template: tplList[1],
                props: {
                    currDept: Object,
                    dept: Object,
                    startDepth: Number,
                    shownDeptChildren: Boolean,
                },
                data: function () {
                    return {
                        auth: _this.Data.MyAuth,
                    };
                },
                methods: {
                    OnEnterDept: function (toDept) {
                        UrlParam.Set(URL_PARAM_KEY.DID, toDept.Did).Reset();
                        _this.ShowPositionList();
                    },
                    onEditName: function (e, dept, posn, index) {
                        var newName = e.target.value.trim();
                        if (!newName) {
                            e.target.value = posn.Name;
                            return;
                        }
                        if (newName != posn.Name) {
                            if (_this.Data.GetPosnByName(_this.Data.CurrProj.DeptTree, newName)) {
                                Common.AlertError("\u5373\u5C06\u628A\u804C\u4F4D \"" + posn.Name + "\" \u6539\u540D\u4E3A \"" + newName + "\" <br/><br/>\u4F46\u804C\u4F4D\u540D\u79F0 \"" + newName + "\" \u5DF2\u7ECF\u5B58\u5728");
                                e.target.value = posn.Name;
                                return;
                            }
                            Common.ConfirmWarning("\u5373\u5C06\u628A\u804C\u4F4D \"" + posn.Name + "\" \u6539\u540D\u4E3A \"" + newName + "\"", null, function () {
                                posn.Name = newName; //TODO:
                            }, function () {
                                e.target.value = posn.Name;
                            });
                        }
                    },
                    onEditAuth: function (dept, posn, index) {
                        _this.ShowAuthList(posn);
                    },
                    checkDeptMgrChecked: function (posn) {
                        return posn.AuthList.IndexOfByKey(FieldName.Authid, AUTH.DEPARTMENT_MANAGE) > -1
                            && posn.AuthList.IndexOfByKey(FieldName.Authid, AUTH.DEPARTMENT_PROCESS) > -1;
                    },
                    onChangeDeptMgrChecked: function (posn) {
                        var has = posn.AuthList.IndexOfByKey(FieldName.Authid, AUTH.DEPARTMENT_MANAGE) > -1
                            && posn.AuthList.IndexOfByKey(FieldName.Authid, AUTH.DEPARTMENT_PROCESS) > -1;
                        if (has) {
                            posn.AuthList.RemoveByKey(FieldName.Authid, AUTH.DEPARTMENT_MANAGE);
                            posn.AuthList.RemoveByKey(FieldName.Authid, AUTH.DEPARTMENT_PROCESS);
                        }
                        else {
                            posn.AuthList.push(_this.Data.AuthDict[AUTH.DEPARTMENT_MANAGE]);
                            posn.AuthList.push(_this.Data.AuthDict[AUTH.DEPARTMENT_PROCESS]);
                        }
                    },
                    onEditUserList: function (dept, posn) {
                        UrlParam.Set(URL_PARAM_KEY.PAGE, ProjectEditPageIndex.User).Set(URL_PARAM_KEY.FKEY, posn.Name).Reset();
                        _this.ShowUserList(dept, posn);
                    },
                    CheckSortUp: function (dept, posn, index) {
                        return index > 0;
                    },
                    CheckSortDown: function (dept, posn, index) {
                        return index < dept.PosnList.length - 1;
                    },
                    onSortDown: function (dept, posn, index) {
                        if (index < dept.PosnList.length - 1) {
                            dept.PosnList.splice(index + 1, 0, dept.PosnList.splice(index, 1)[0]);
                        }
                    },
                    onSortUp: function (dept, posn, index) {
                        if (index > 0) {
                            dept.PosnList.splice(index - 1, 0, dept.PosnList.splice(index, 1)[0]);
                        }
                    },
                    onDel: function (dept, posn, index) {
                        if (dept.PosnList.length == 1) {
                            Common.AlertError("\u6BCF\u4E2A\u90E8\u95E8\u4E0B\u81F3\u5C11\u8981\u4FDD\u7559\u4E00\u4E2A\u804C\u4F4D");
                        }
                        else {
                            Common.ConfirmDelete(function () {
                                dept.PosnList.splice(index, 1);
                            }, "\u5373\u5C06\u5220\u9664\u804C\u4F4D \"" + (posn.Name || '空') + "\"");
                        }
                    },
                },
            });
            var _did = UrlParam.Get(URL_PARAM_KEY.DID, 0);
            console.log("[debug]", _did, ":[_did]");
            console.log("[debug]", _this.Data.DeptDict);
            var currDept;
            if (_did > 0) {
                currDept = _this.Data.DeptDict[_did];
            }
            else {
                //显示全部部门
            }
            var vue = new Vue({
                template: tplList[0],
                data: {
                    auth: _this.Data.MyAuth,
                    isRoot: _did == 0,
                    currDept: currDept,
                    deptTree: currDept ? [currDept] : _this.Data.CurrProj.DeptTree,
                    newName: "",
                    startDepth: currDept ? currDept.Depth : 0,
                    userConfig: _this.UserConfig,
                },
                methods: {
                    dpFullName: function (dp) {
                        var rs = [];
                        var parentDp = dp;
                        while (parentDp) {
                            if (parentDp.Did == dp.Did) {
                                rs.unshift("<li class=\"active\">" + parentDp.Name + "</li>");
                            }
                            else {
                                rs.unshift("<li>" + parentDp.Name + "</li>");
                            }
                            parentDp = _this.Data.DeptDict[parentDp.Fid];
                        }
                        return "<ol class=\"breadcrumb\">\n                                        " + rs.join("") + "\n                                    </ol>";
                    },
                    GetEnterParentDeptTitle: function (did) {
                        if (did > 0) {
                            return "\u56DE\u5230 \u4E0A\u7EA7\u90E8\u95E8\"" + _this.Data.DeptDict[did].Name + "\" \u7684\u804C\u4F4D\u5217\u8868";
                        }
                        else {
                            return "\u56DE\u5230 \u5168\u90E8\u90E8\u95E8 \u7684\u804C\u4F4D\u5217\u8868";
                        }
                    },
                    DeptDropdownCheckItemCb: function (deptDropdown) {
                        if (currDept) {
                            if (currDept.Did == deptDropdown.Did) {
                                return DeptDropdownItemEnabled.DISABLED;
                            }
                            else {
                                return DeptDropdownItemEnabled.ENABLED;
                            }
                        }
                        else {
                            return DeptDropdownItemEnabled.ENABLED;
                        }
                    },
                    /**回到部门列表 */
                    onBackDepartmentList: function () {
                        _this.ShowDepartmentList();
                    },
                    OnToggleShownDeptChildren: function () {
                        _this.UserConfig.ShownDeptChildren = !_this.UserConfig.ShownDeptChildren;
                    },
                    OnDeptChange: function (toDept) {
                        UrlParam.Set(URL_PARAM_KEY.DID, toDept ? toDept.Did : 0).Reset();
                        _this.ShowPositionList();
                    },
                    OnEnterDeptById: function (did) {
                        UrlParam.Set(URL_PARAM_KEY.DID, did).Reset();
                        _this.ShowPositionList();
                    },
                    OnEnterDept: function (toDept) {
                        UrlParam.Set(URL_PARAM_KEY.DID, toDept ? toDept.Did : 0).Reset();
                        _this.ShowPositionList();
                    },
                    onAdd: function () {
                        if (currDept) {
                            var posn = {
                                Posnid: _this.Data.NewPositionUuid++, Did: currDept.Did, Name: _this.VuePositionList.newName.toString(), UserList: [],
                                AuthList: currDept.Sort == 0 ? [_this.Data.AuthDict[AUTH.DEPARTMENT_MANAGE]] : [],
                            };
                            _this.VuePositionList.newName = '';
                            currDept.PosnList.push(posn);
                        }
                    },
                },
            }).$mount();
            console.log("[debug]", vue.deptTree, ":[vue.deptTree]");
            _this.VuePositionList = vue;
            //#show
            Common.InsertIntoDom(vue.$el, _this.VueProjectEdit.$refs.pageContent);
        });
    };
    ManageManagerClass.prototype.ShowAuthList = function (posn) {
        var _this = this;
        Loader.LoadVueTemplate(this.VuePath + "AuthList", function (tpl) {
            var checkedDict = {};
            for (var i = 0; i < posn.AuthList.length; i++) {
                var auth = posn.AuthList[i];
                checkedDict[auth.Authid] = auth;
            }
            var _checkModChecked = function (_, mod) {
                // console.log("[debug]", '_checkAllModSelected')
                for (var i = 0; i < mod.AuthList.length; i++) {
                    var auth = mod.AuthList[i];
                    if (!checkedDict[auth.Authid]) {
                        return false;
                    }
                }
                return true;
            };
            var vue = new Vue({
                template: tpl,
                data: {
                    auth: _this.Data.MyAuth,
                    posn: posn,
                    authorityModuleList: _this.Data.AuthModList,
                    checkedChange: false,
                },
                methods: {
                    checkModChecked: _checkModChecked.bind(_this),
                    checkAuthChecked: function (_, auth) {
                        return checkedDict[auth.Authid] != null;
                    },
                    onSwitchMod: function (mod) {
                        var allSelected = _checkModChecked(null, mod);
                        for (var i = 0; i < mod.AuthList.length; i++) {
                            var auth = mod.AuthList[i];
                            if (allSelected) {
                                delete checkedDict[auth.Authid];
                            }
                            else {
                                checkedDict[auth.Authid] = auth;
                            }
                        }
                        _this.VueAuthList.checkedChange = !_this.VueAuthList.checkedChange;
                    },
                    onSwitchAuth: function (e, auth) {
                        if (checkedDict[auth.Authid]) {
                            delete checkedDict[auth.Authid];
                        }
                        else {
                            checkedDict[auth.Authid] = auth;
                        }
                        // auth.CheckedChange = !auth.CheckedChange
                        _this.VueAuthList.checkedChange = !_this.VueAuthList.checkedChange;
                    },
                    onSave: function () {
                        posn.AuthList.splice(0, posn.AuthList.length);
                        for (var authIdStr in checkedDict) {
                            posn.AuthList.push(checkedDict[authIdStr]);
                        }
                        _this.VueAuthList.$el.remove();
                        _this.VueAuthList = null;
                    },
                    onReset: function () {
                        for (var authIdStr in checkedDict) {
                            delete checkedDict[authIdStr];
                        }
                        for (var i = 0; i < posn.AuthList.length; i++) {
                            var auth = posn.AuthList[i];
                            checkedDict[auth.Authid] = auth;
                        }
                        _this.VueAuthList.checkedChange = !_this.VueAuthList.checkedChange;
                    }
                },
            }).$mount();
            _this.VueAuthList = vue;
            // $(vue.$el).alert('close');
            Common.Popup($(vue.$el));
        });
    };
    ManageManagerClass.prototype.ShowUserList = function (backDept, backPosn) {
        var _this = this;
        if (backDept === void 0) { backDept = null; }
        if (backPosn === void 0) { backPosn = null; }
        this.VueProjectEdit.currPage = ProjectEditPageIndex.User;
        Loader.LoadVueTemplate(this.VuePath + "UserList", function (tpl) {
            var proj = _this.Data.CurrProj;
            var filterText = UrlParam.Get(URL_PARAM_KEY.FKEY, '');
            var vue = new Vue({
                template: tpl,
                data: {
                    auth: _this.Data.MyAuth,
                    userList: proj.UserList,
                    otherUserList: ArrayUtil.SubByAttr(_this.Data.UserList, proj.UserList, FieldName.Uid),
                    backPosn: backPosn,
                    filterText: filterText,
                    newUserUid: 0,
                },
                methods: {
                    filterUserList: function (userList, filterText) {
                        var rs = userList.concat();
                        var dict = {};
                        if (filterText) {
                            var _filterText = filterText.toString().toLowerCase().trim();
                            var _filterTextSp = _filterText.split(/[\s\,]/g);
                            rs.every(function (user) {
                                if (StringUtil.IndexOfKeyArr(user.Name.toLowerCase(), _filterTextSp) > -1) {
                                    dict[user.Uid] = true;
                                }
                                else {
                                    if (user.Did) {
                                        var dept = _this.Data.DeptDict[user.Did];
                                        if (StringUtil.IndexOfKeyArr(dept.Name.toLowerCase(), _filterTextSp) > -1) {
                                            dict[user.Uid] = true;
                                        }
                                        else {
                                            for (var i = 0; i < dept.PosnList.length; i++) {
                                                var posn = dept.PosnList[i];
                                                if (posn.Posnid == user.Posnid && StringUtil.IndexOfKeyArr(posn.Name.toLowerCase(), _filterTextSp) > -1) {
                                                    dict[user.Uid] = true;
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                                return true;
                            });
                            rs.sort(function (u0, u1) {
                                if (dict[u0.Uid] && !dict[u1.Uid]) {
                                    return -1;
                                }
                                else if (!dict[u0.Uid] && dict[u1.Uid]) {
                                    return 1;
                                }
                                return 0;
                            });
                        }
                        return rs;
                    },
                    OnBackPosn: function () {
                        UrlParam.Set(URL_PARAM_KEY.PAGE, ProjectEditPageIndex.Position).Set(URL_PARAM_KEY.DID, backDept.Did).Set(URL_PARAM_KEY.FKEY, null).Reset();
                        _this.ShowPositionList();
                    },
                    ShowDpName: function (did) {
                        var dp = _this.Data.DeptDict[did];
                        return dp ? dp.Name : '空';
                    },
                    ShowPosName: function (did, posnid) {
                        var dp = _this.Data.DeptDict[did];
                        if (dp) {
                            if (posnid > 0) {
                                var posn = dp.PosnList.FindByKey(FieldName.Posnid, posnid);
                                return posn ? posn.Name : '--';
                            }
                            else {
                                return '空';
                            }
                        }
                        else {
                            return '空';
                        }
                    },
                    ShowUserName: function (uid) {
                        this.newUserUid = uid;
                        if (uid) {
                            var user = ArrayUtil.FindByKey(this.otherUserList, FieldName.Uid, uid);
                            if (user) {
                                return user.Name;
                            }
                        }
                        return '选择新成员';
                    },
                    GetPosList: function (did) {
                        var dp = _this.Data.DeptDict[did];
                        if (dp) {
                            return dp.PosnList;
                        }
                        else {
                            return [];
                        }
                    },
                    OnDeptChange: function (user, dept) {
                        _this.Data.RemoveUserPosnid(user);
                        if (dept) {
                            _this.Data.SetUserPosnid(user, dept.Did);
                        }
                    },
                    onPosChange: function (user, posn) {
                        _this.Data.RemoveUserPosnid(user);
                        _this.Data.SetUserPosnid(user, user.Did, posn.Posnid);
                    },
                    onSortDown: function (user, index) {
                        if (index < proj.UserList.length - 1) {
                            proj.UserList.splice(index + 1, 0, proj.UserList.splice(index, 1)[0]);
                        }
                    },
                    onSortUp: function (user, index) {
                        if (index > 0) {
                            proj.UserList.splice(index - 1, 0, proj.UserList.splice(index, 1)[0]);
                        }
                    },
                    onDel: function (user, index) {
                        Common.ConfirmDelete(function () {
                            proj.UserList.splice(index, 1);
                            _this.VueUserList.otherUserList = ArrayUtil.SubByAttr(_this.Data.UserList, proj.UserList, FieldName.Uid);
                        }, "\u5373\u5C06\u5220\u9664\u6210\u5458 \"" + user.Name + "\"");
                    },
                    onAddSelect: function () {
                        _this.ShowSelectUser(proj, ArrayUtil.SubByAttr(_this.Data.UserList, proj.UserList, FieldName.Uid));
                    },
                    onAdd: function () {
                        var newUser = ArrayUtil.FindByKey(_this.VueUserList.otherUserList, FieldName.Uid, _this.VueUserList.newUserUid);
                        if (newUser) {
                            proj.UserList.push(newUser);
                            _this.VueUserList.newUserUid = 0;
                            _this.VueUserList.otherUserList = ArrayUtil.SubByAttr(_this.Data.UserList, proj.UserList, FieldName.Uid);
                        }
                    },
                },
            }).$mount();
            _this.VueUserList = vue;
            //#show
            Common.InsertIntoDom(vue.$el, _this.VueProjectEdit.$refs.pageContent);
        });
    };
    /**选择 用户 */
    ManageManagerClass.prototype.ShowSelectUser = function (proj, userList) {
        var _this = this;
        if (userList.length == 0) {
            Common.AlertWarning('所有用户都已经被添加到了这个项目中');
            return;
        }
        Loader.LoadVueTemplate(this.VuePath + "SelectUser", function (tpl) {
            var checkedDict = {};
            var _GetFilterList = function (userList, filterText) {
                var _filterText = filterText.toString().toLowerCase().trim();
                if (_filterText) {
                    var _filterTextSp = _filterText.split(/[\s\,]/g);
                    return userList.filter(function (user) {
                        if (checkedDict[user.Uid]) {
                            return true;
                        }
                        return StringUtil.IndexOfKeyArr(user.Name.toLowerCase(), _filterTextSp) > -1;
                    });
                }
                else {
                    return userList;
                }
            };
            var vue = new Vue({
                template: tpl,
                data: {
                    auth: _this.Data.MyAuth,
                    userList: userList,
                    filterText: '',
                    checkedChange: false,
                },
                methods: {
                    GetFilterList: _GetFilterList.bind(_this),
                    checkChecked: function (_, user) {
                        return checkedDict[user.Uid] != null;
                    },
                    onChangeChecked: function (user) {
                        if (checkedDict[user.Uid]) {
                            delete checkedDict[user.Uid];
                        }
                        else {
                            checkedDict[user.Uid] = user;
                        }
                        _this.VueSelectUser.checkedChange = !_this.VueSelectUser.checkedChange;
                    },
                    OnCheckedAll: function () {
                        var _userList = _GetFilterList(userList, _this.VueSelectUser.filterText);
                        var isAllCheck = true;
                        for (var i = 0; i < _userList.length; i++) {
                            var user = _userList[i];
                            if (!checkedDict[user.Uid]) {
                                isAllCheck = false;
                                break;
                            }
                        }
                        for (var i = 0; i < _userList.length; i++) {
                            var user = _userList[i];
                            if (isAllCheck) {
                                delete checkedDict[user.Uid];
                            }
                            else {
                                checkedDict[user.Uid] = user;
                            }
                        }
                        _this.VueSelectUser.checkedChange = !_this.VueSelectUser.checkedChange;
                    },
                    onOk: function () {
                        for (var i = 0; i < userList.length; i++) {
                            var user = userList[i];
                            if (checkedDict[user.Uid]) {
                                proj.UserList.push(user);
                            }
                        }
                        $(_this.VueSelectUser.$el).remove();
                    }
                },
            }).$mount();
            _this.VueSelectUser = vue;
            // $(vue.$el).alert('close');
            Common.Popup($(vue.$el));
        });
    };
    return ManageManagerClass;
}());
var ManageManager = new ManageManagerClass();
//# sourceMappingURL=ManageManager.js.map