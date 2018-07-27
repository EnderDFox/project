/** 管理项目 部门 职位 权限 */
var ProjectEditPageIndex;
(function (ProjectEditPageIndex) {
    ProjectEditPageIndex[ProjectEditPageIndex["Department"] = 1] = "Department";
    ProjectEditPageIndex[ProjectEditPageIndex["Position"] = 2] = "Position";
    ProjectEditPageIndex[ProjectEditPageIndex["User"] = 3] = "User";
    ProjectEditPageIndex[ProjectEditPageIndex["AuthGroup"] = 4] = "AuthGroup";
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
        WSConn.sendMsg(PB_CMD.MANAGE_VIEW, null);
    };
    ManageManagerClass.prototype.RegisterPB = function () {
        Commond.Register(PB_CMD.MANAGE_VIEW, this.PB_ManageView.bind(this));
        Commond.Register(PB_CMD.MANAGE_PROJ_ADD, this.PB_ProjAdd.bind(this));
        Commond.Register(PB_CMD.MANAGE_PROJ_DEL, this.PB_ProjDel.bind(this));
        Commond.Register(PB_CMD.MANAGE_PROJ_EDIT_NAME, this.PB_ProjEditName.bind(this));
        //
        Commond.Register(PB_CMD.MANAGE_DEPT_ADD, this.PB_DeptAdd.bind(this));
        Commond.Register(PB_CMD.MANAGE_DEPT_DEL, this.PB_DeptDel.bind(this));
        Commond.Register(PB_CMD.MANAGE_DEPT_EDIT_NAME, this.PB_DeptEditName.bind(this));
        Commond.Register(PB_CMD.MANAGE_DEPT_EDIT_SORT, this.PB_DeptEditSort.bind(this));
        //
        Commond.Register(PB_CMD.MANAGE_POSN_ADD, this.PB_PosnAdd.bind(this));
        Commond.Register(PB_CMD.MANAGE_POSN_DEL, this.PB_PosnDel.bind(this));
        Commond.Register(PB_CMD.MANAGE_POSN_EDIT_NAME, this.PB_PosnEditName.bind(this));
        Commond.Register(PB_CMD.MANAGE_POSN_EDIT_SORT, this.PB_PosnEditSort.bind(this));
        Commond.Register(PB_CMD.MANAGE_POSN_EDIT_AUTH, this.PB_PosnEditAuth.bind(this));
        //
        Commond.Register(PB_CMD.MANAGE_USER_EDIT_DEPT, this.PB_UserEditDept.bind(this));
        Commond.Register(PB_CMD.MANAGE_PROJ_DEL_USER, this.PB_ProjDelUser.bind(this));
        // Commond.Register(PB_CMD.MANAGE_USER_EDIT_SORT, this.PB_UserEditSort.bind(this))
        // Commond.Register(PB_CMD.MANAGE_USER_EDIT_AUTH_GROUP, this.PB_UserEditAuthGroup.bind(this))
        // //
        // Commond.Register(PB_CMD.MANAGE_AUTH_GROUP_ADD, this.PB_AuthGroup.bind(this))
        // Commond.Register(PB_CMD.MANAGE_AUTH_GROUP_DEL, this.PB_AuthGroup.bind(this))
        // Commond.Register(PB_CMD.MANAGE_AUTH_GROUP_EDIT_NAME, this.PB_AuthGroup.bind(this))
        // Commond.Register(PB_CMD.MANAGE_AUTH_GROUP_EDIT_DSC, this.PB_AuthGroup.bind(this))
        // Commond.Register(PB_CMD.MANAGE_AUTH_GROUP_EDIT_SORT, this.PB_AuthGroup.bind(this))
        // Commond.Register(PB_CMD.MANAGE_AUTH_GROUP_EDIT_AUTH, this.PB_AuthGroup.bind(this))
        // Commond.Register(PB_CMD.MANAGE_AUTH_GROUP_EDIT_USER, this.PB_AuthGroup.bind(this))
    };
    ManageManagerClass.prototype.PB_ManageView = function (data) {
        if (this.Data.IsInit == false) { //第一次
            this.Data.Init(data);
            //
            var uid = Number(UrlParam.Get('uid'));
            if (isNaN(uid)) {
                uid = 0;
            }
            //#权限
            switch (uid) {
                case 0:
                    uid = 67; //超级管理员id
                    this.Data.AddMyAuth(AUTH.PROJECT_LIST);
                    this.Data.AddMyAuth(AUTH.PROJECT_MANAGE);
                    break;
            }
            //
            this.Data.CurrUser = this.Data.UserDict[uid];
            //
            if (this.Data.CurrUser == null) {
                Common.ShowNoAccountPage();
            }
            else {
                UrlParam.Callback = this.UrlParamCallback.bind(this);
                //初始化 vue 然后 根据网址参数跳转页面
                this.InitVue(this.UrlParamCallback.bind(this));
            }
        }
        else {
            this.Data.Init(data);
            //根据网址参数跳转页面
            this.UrlParamCallback();
        }
    };
    ManageManagerClass.prototype.PB_ProjAdd = function (proj) {
        proj.MasterUid = 0;
        proj.UserList = [];
        //#因为只有一个默认的dept只处理这一个就行
        var dept = proj.DeptTree[0];
        //
        dept.Children = [];
        for (var i = 0; i < dept.PosnList.length; i++) {
            this.Data.FormatPosnSingle(dept.PosnList[i]);
        }
        dept.Depth = 0;
        this.Data.DeptDict[dept.Did] = dept;
        //#
        this.Data.ProjList.push(proj);
    };
    ManageManagerClass.prototype.PB_ProjDel = function (data) {
        this.Data.ProjList.RemoveByKey(FIELD_NAME.Pid, data.Pid);
        delete this.Data.ProjDict[data.Pid];
    };
    ManageManagerClass.prototype.PB_ProjEditName = function (data) {
        if (this.Data.ProjDict[data.Pid]) {
            this.Data.ProjDict[data.Pid].Name = data.Name;
        }
    };
    ManageManagerClass.prototype.PB_DeptAdd = function (dept) {
        var _this = this;
        dept.Children = [];
        for (var i = 0; i < dept.PosnList.length; i++) {
            this.Data.FormatPosnSingle(dept.PosnList[i]);
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
        //重新刷新排序功能
        Vue.nextTick(function () {
            _this.DoDeptListSortabled();
        });
    };
    ManageManagerClass.prototype.PB_DeptDel = function (data) {
        for (var i = 0; i < data.DidList.length; i++) {
            var did = data.DidList[i];
            var dept = this.Data.DeptDict[did];
            if (dept) {
                var brothers = this.Data.GetBrotherDepartmentList(dept);
                if (brothers) {
                    var brotherIndex = ArrayUtil.IndexOfByKey(brothers, FIELD_NAME.Did, dept.Did);
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
    ManageManagerClass.prototype.PB_DeptEditSort = function (data) {
        var dept = this.Data.DeptDict[data.Did];
        if (dept) {
            if (dept.Fid != data.Fid) {
                //移动到新表中
                var oldBrothers = this.Data.GetBrotherDeptListByFid(dept.Fid);
                if (oldBrothers) {
                    oldBrothers.RemoveByKey(FIELD_NAME.Did, dept.Did); //从自己的表中删除
                }
                dept.Fid = data.Fid;
                //加入新列表中,后面会把它删除掉的
                var newBrothers = this.Data.GetBrotherDeptListByFid(data.Fid);
                if (newBrothers) {
                    newBrothers.push(dept);
                }
                //改深度
                if (data.Fid == 0) {
                    dept.Depth = 0;
                }
                else {
                    var toParentDept = this.Data.DeptDict[data.Fid];
                    dept.Depth = toParentDept.Depth + 1;
                }
                //子部门的深度改变
                TreeUtil.Every(dept.Children, function (child, _, __, depthChild) {
                    child.Depth = dept.Depth + depthChild + 1;
                    return true;
                });
            }
            //
            dept.Sort = data.Sort;
            //
            var brothers = this.Data.GetBrotherDeptListByFid(data.Fid);
            if (brothers) {
                //目标sort之后的sort都+1
                for (var i = brothers.length - 1; i >= 0; i--) {
                    var brother = brothers[i];
                    if (brother.Did != dept.Did && brother.Sort >= data.Sort) {
                        brother.Sort += 1;
                    }
                }
                //重新排序
                brothers.sort(function (a, b) {
                    if (a.Sort < b.Sort) {
                        return -1;
                    }
                    else if (a.Sort > b.Sort) {
                        return 1;
                    }
                    return 0;
                });
            }
        }
    };
    ManageManagerClass.prototype.PB_PosnAdd = function (posn) {
        var dept = this.Data.DeptDict[posn.Did];
        if (dept) {
            this.Data.FormatPosnSingle(posn);
            dept.PosnList.push(posn);
        }
    };
    ManageManagerClass.prototype.PB_PosnDel = function (data) {
        var _a = this.Data.GetPosnByPosnid(data.Posnid), dept = _a[0], posn = _a[1];
        if (dept && posn) {
            dept.PosnList.RemoveByKey(FIELD_NAME.Posnid, data.Posnid);
        }
    };
    ManageManagerClass.prototype.PB_PosnEditName = function (data) {
        var _a = this.Data.GetPosnByPosnid(data.Posnid), dept = _a[0], posn = _a[1];
        if (dept && posn) {
            posn.Name = data.Name;
        }
    };
    ManageManagerClass.prototype.PB_PosnEditSort = function (data) {
        var _a = this.Data.GetPosnByPosnid(data.Posnid), _ = _a[0], _posn = _a[1];
        if (_posn) {
            var dept = this.Data.DeptDict[_posn.Did];
            if (dept) {
                for (var i = 0; i < dept.PosnList.length; i++) {
                    var posn = dept.PosnList[i];
                    if (posn.Posnid == data.Posnid) {
                        posn.Sort = data.Sort;
                    }
                    else {
                        if (posn.Sort >= data.Sort) {
                            posn.Sort += 1;
                        }
                    }
                }
                //重新排序
                dept.PosnList.sort(function (a, b) {
                    if (a.Sort < b.Sort) {
                        return -1;
                    }
                    else if (a.Sort > b.Sort) {
                        return 1;
                    }
                    return 0;
                });
            }
        }
    };
    ManageManagerClass.prototype.PB_PosnEditAuth = function (data) {
        var _a = this.Data.GetPosnByPosnid(data.Posnid), dept = _a[0], posn = _a[1];
        if (dept && posn) {
            this.Data.FormatPosnAuthidList(posn, data.AuthidList);
        }
    };
    ManageManagerClass.prototype.PB_UserEditDept = function (data) {
        // this.Data.RemoveUserPosnid(user)
        // this.Data.SetUserPosnid(user, user.Did, posn.Posnid)
        for (var i = 0; i < data.UserDeptList.length; i++) {
            var rlat = data.UserDeptList[i];
            var user = this.Data.UserDict[rlat.Uid];
            if (user) {
                var proj = this.Data.ProjDict[rlat.Pid];
                if (proj) {
                    if (proj.UserList.IndexOfByKey(FIELD_NAME.Uid, rlat.Uid) == -1) {
                        //原本不在工程中
                        proj.UserList.push(user);
                    }
                    //旧的职位先删除该玩家
                    this.Data.PosnDelUidInDeptTree(rlat.Uid, proj.DeptTree);
                    //加入到职位中
                    if (rlat.Posnid > 0) {
                        //user 必定 did 和 posid一起设置因此这里一起改就行了
                        var _a = this.Data.GetPosnByPosnidInDeptTree(rlat.Posnid, proj.DeptTree), _ = _a[0], posn = _a[1];
                        if (posn) {
                            posn.UserList.push(user);
                        }
                    }
                }
                if (this.Data.CurrProj && this.Data.CurrProj.Pid == rlat.Pid) {
                    //设置为当前工程
                    user.Pid = rlat.Pid;
                    user.Did = rlat.Did;
                    user.Posnid = rlat.Posnid;
                }
            }
        }
    };
    ManageManagerClass.prototype.PB_ProjDelUser = function (data) {
        var proj = this.Data.ProjDict[data.Pid];
        if (proj) {
            proj.UserList.RemoveByKey(FIELD_NAME.Uid, data.Uid);
            //职位里也要删除
            this.Data.PosnDelUidInDeptTree(data.Uid, proj.DeptTree);
        }
    };
    //#
    ManageManagerClass.prototype.UrlParamCallback = function () {
        Common.PopupHideAll();
        var pid = UrlParam.Get(URL_PARAM_KEY.PID, 0);
        var proj = this.Data.GetProjectListHasAuth().FindByKey(FIELD_NAME.Pid, pid);
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
                    /**回到 全部功臣管列表 */
                    OnShowProjList: function () {
                        if (_this.VueProjectEdit) {
                            $(_this.VueProjectEdit.$el).remove();
                        }
                        UrlParam.RemoveAll().Reset();
                        WSConn.sendMsg(PB_CMD.MANAGE_VIEW, null); //重新拉数据 然后根据网址参数跳转到 ShowProjectList
                        // this.ShowProjectList()
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
                            if (_this.Data.ProjList.IndexOfByKey(FIELD_NAME.Name, newName) > -1) {
                                Common.AlertError("\u5373\u5C06\u628A\u9879\u76EE \"" + proj.Name + "\" \u6539\u540D\u4E3A \"" + newName + "\" <br/><br/>\u4F46\u9879\u76EE\u540D\u79F0 \"" + newName + "\" \u5DF2\u7ECF\u5B58\u5728");
                                e.target.value = proj.Name;
                                return;
                            }
                            Common.ConfirmWarning("\u5373\u5C06\u628A\u9879\u76EE \"" + proj.Name + "\" \u6539\u540D\u4E3A \"" + newName + "\"", null, function () {
                                var data = {
                                    Pid: proj.Pid,
                                    Name: newName.toString(),
                                };
                                WSConn.sendMsg(PB_CMD.MANAGE_PROJ_EDIT_NAME, data);
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
                            var data = {
                                Pid: proj.Pid,
                            };
                            WSConn.sendMsg(PB_CMD.MANAGE_PROJ_DEL, data);
                        }, "\u5373\u5C06\u5220\u9664\u9879\u76EE \"" + proj.Name + "\"");
                    },
                    onAdd: function () {
                        var newName = _this.VueProjectList.newName.toString().trim();
                        if (!newName) {
                            Common.AlertError("\u9879\u76EE\u540D\u79F0 " + newName + " \u4E0D\u53EF\u4EE5\u4E3A\u7A7A");
                            return;
                        }
                        if (_this.Data.ProjList.IndexOfByKey(FIELD_NAME.Name, newName) > -1) {
                            Common.AlertError("\u9879\u76EE\u540D\u79F0 " + newName + " \u5DF2\u7ECF\u5B58\u5728");
                            return;
                        }
                        var data = {
                            Name: newName
                        };
                        _this.VueProjectList.newName = '';
                        WSConn.sendMsg(PB_CMD.MANAGE_PROJ_ADD, data);
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
        var proj = this.Data.GetProjectListHasAuth().FindByKey(FIELD_NAME.Pid, UrlParam.Get(URL_PARAM_KEY.PID));
        this.Data.CurrProj = proj;
        this.Data.FormatUserListInProj(proj);
        Loader.LoadVueTemplateList([this.VuePath + "ProjectEdit"], function (tplList) {
            var currPage = _this.GetCurrpageFromUrlParam();
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
                        UrlParam.Set(URL_PARAM_KEY.PID, proj.Pid).Set(URL_PARAM_KEY.PAGE, _this.GetCurrpageFromUrlParam()).Reset();
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
    ManageManagerClass.prototype.GetCurrpageFromUrlParam = function () {
        return UrlParam.Get(URL_PARAM_KEY.PAGE, [ProjectEditPageIndex.Department, ProjectEditPageIndex.Position, ProjectEditPageIndex.User, ProjectEditPageIndex.AuthGroup]);
    };
    ManageManagerClass.prototype.SwitchProjectEditPageContent = function () {
        var currPage = this.GetCurrpageFromUrlParam();
        switch (currPage) {
            case ProjectEditPageIndex.Department:
                this.ShowDepartmentList();
                break;
            case ProjectEditPageIndex.Position:
                this.ShowPosnList();
                break;
            case ProjectEditPageIndex.User:
                this.ShowUserList();
                break;
            case ProjectEditPageIndex.AuthGroup:
                this.ShowAuthGroupList();
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
                            if (TreeUtil.FindByKey(_this.Data.CurrProj.DeptTree, FIELD_NAME.Name, newName)) {
                                Common.AlertError("\u5373\u5C06\u628A\u90E8\u95E8 \"" + dept.Name + "\" \u6539\u540D\u4E3A \"" + newName + "\" <br/><br/>\u4F46\u804C\u4F4D\u540D\u79F0 \"" + newName + "\" \u5DF2\u7ECF\u5B58\u5728");
                                e.target.value = dept.Name;
                                return;
                            }
                            var data = { Did: dept.Did, Name: newName };
                            if (!dept.Name) {
                                //原本没名字
                                WSConn.sendMsg(PB_CMD.MANAGE_DEPT_EDIT_NAME, data);
                            }
                            else {
                                Common.ConfirmWarning("\u5373\u5C06\u628A\u90E8\u95E8 \"" + dept.Name + "\" \u6539\u540D\u4E3A \"" + newName + "\"", null, function () {
                                    WSConn.sendMsg(PB_CMD.MANAGE_DEPT_EDIT_NAME, data);
                                }, function () {
                                    e.target.value = dept.Name;
                                });
                            }
                        }
                    },
                    onAddChild: function (parentDp, i0) {
                        var data = {
                            Pid: _this.Data.CurrProj.Pid,
                            Fid: parentDp.Did,
                            Name: _this.VueDeptList.newName.toString(),
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
                        brothers.RemoveByKey(FIELD_NAME.Did, dept.Did);
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
                        _this.ShowPosnList();
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
                        var brotherIndex = ArrayUtil.IndexOfByKey(brothers, FIELD_NAME.Did, dp.Did);
                        var brother = brothers[brotherIndex + 1];
                        brothers.splice(brotherIndex, 1);
                        brothers.splice(brotherIndex + 1, 0, dp);
                    },
                    onSortUp: function (e, dp, i0) {
                        if (!_this.DeptListCheckSortUp(dp, i0)) {
                            return;
                        }
                        var brothers = _this.Data.GetBrotherDepartmentList(dp);
                        var brotherIndex = ArrayUtil.IndexOfByKey(brothers, FIELD_NAME.Did, dp.Did);
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
                        var newName = _this.VueDeptList.newName.toString().trim();
                        if (!newName) {
                            Common.AlertError("\u90E8\u95E8\u540D\u79F0 " + newName + " \u4E0D\u53EF\u4EE5\u4E3A\u7A7A");
                            return;
                        }
                        if (TreeUtil.FindByKey(_this.Data.CurrProj.DeptTree, FIELD_NAME.Name, newName)) {
                            Common.AlertError("\u90E8\u95E8\u540D\u79F0 " + newName + " \u5DF2\u7ECF\u5B58\u5728");
                            return;
                        }
                        var data = {
                            Pid: _this.Data.CurrProj.Pid,
                            Name: newName,
                        };
                        _this.VueDeptList.newName = '';
                        WSConn.sendMsg(PB_CMD.MANAGE_DEPT_ADD, data);
                    },
                },
            }).$mount();
            _this.VueDeptList = vue;
            //#show
            Common.InsertIntoDom(vue.$el, _this.VueProjectEdit.$refs.pageContent);
            //
            _this.DoDeptListSortabled();
        });
    };
    ManageManagerClass.prototype.DoDeptListSortabled = function () {
        var _this = this;
        if (this.DeptListSortableArr) {
            for (var i = 0; i < this.DeptListSortableArr.length; i++) {
                var item = this.DeptListSortableArr[i];
                item.destroy();
            }
            this.DeptListSortableArr = null;
        }
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
            group: 'deptDragGroup',
            scorll: true,
            // animation: 150, //动画参数
            // ghostClass: 'sortable-ghostClass',
            chosenClass: 'sortable-chosenClass',
            onStart: function (evt) {
                var $curr = $(evt.item);
                $curr.find('.tag-depth').hide();
                var dept = _this.Data.DeptDict[parseInt($(evt.item).attr(FIELD_NAME.Did))];
                $curr.find('.tag-depth-drag').show();
                _originDepth = parseInt($curr.find('.tag-depth-drag:first').attr('depth'));
                _lastDepth = dept.Depth;
                _renderTagDepthDrag($curr, dept.Depth);
            },
            onMove: function (evt) {
                var $curr = $(evt.dragged);
                var dept = _this.Data.DeptDict[parseInt($curr.attr(FIELD_NAME.Did))];
                var toDid = parseInt($(evt.to).attr(FIELD_NAME.Did));
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
            onUpdate: function (evt) {
                var dept = _this.Data.DeptDict[parseInt($(evt.item).attr(FIELD_NAME.Did))];
                var brothers = _this.Data.GetBrotherDepartmentList(dept);
                var oldIndex = brothers.IndexOfByKey(FIELD_NAME.Did, dept.Did);
                var toIndex = evt.newIndex;
                oldIndex += 1;
                if (dept.Fid == 0) {
                    toIndex += 1;
                }
                var toSort;
                if (oldIndex < toIndex) {
                    //从上挪到下
                    toIndex += 1;
                    if (toIndex >= brothers.length) {
                        toSort = brothers[brothers.length - 1].Sort + 1;
                    }
                    else {
                        toSort = brothers[toIndex].Sort;
                    }
                }
                else {
                    //从下挪到上
                    toSort = brothers[toIndex].Sort;
                }
                var data = {
                    Did: dept.Did,
                    Fid: dept.Fid,
                    Sort: toSort,
                };
                WSConn.sendMsg(PB_CMD.MANAGE_DEPT_EDIT_SORT, data);
            },
            onAdd: function (evt) {
                var dept = _this.Data.DeptDict[parseInt($(evt.item).attr(FIELD_NAME.Did))];
                var toParentDid = parseInt($(evt.to).attr(FIELD_NAME.Did));
                var brothers = _this.Data.GetBrotherDeptListByFid(toParentDid);
                var toIndex = evt.newIndex;
                if (toParentDid == 0) {
                    toIndex += 1; //因为顶级有个`管理部`占用了一格,因此要+1
                }
                var brother = brothers[toIndex];
                var data = {
                    Did: dept.Did,
                    Fid: toParentDid,
                    Sort: brother ? brother.Sort : brothers[brothers.length - 1].Sort,
                };
                var toParentDept = _this.Data.DeptDict[toParentDid];
                console.log("[debug]", toParentDept ? toParentDept.Name : null, ":[toParentDept]");
                console.log("[debug]", data, brother ? brother.Name : null);
                WSConn.sendMsg(PB_CMD.MANAGE_DEPT_EDIT_SORT, data);
            },
        };
        var $listComp = $('.deptListComp');
        this.DeptListSortableArr = [];
        for (var i = 1; i < $listComp.length; i++) {
            this.DeptListSortableArr.push(Sortable.create($listComp.get(i), opt));
        }
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
        var brotherIndex = ArrayUtil.IndexOfByKey(brothers, FIELD_NAME.Did, dp.Did);
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
    ManageManagerClass.prototype.ShowPosnList = function () {
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
                        _this.ShowPosnList();
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
                                WSConn.sendMsg(PB_CMD.MANAGE_POSN_EDIT_NAME, {
                                    Posnid: posn.Posnid,
                                    Name: newName,
                                });
                            }, function () {
                                e.target.value = posn.Name;
                            });
                        }
                    },
                    onEditAuth: function (dept, posn, index) {
                        _this.ShowAuthList(posn.AuthidList, function (_authidList) {
                            WSConn.sendMsg(PB_CMD.MANAGE_POSN_EDIT_AUTH, {
                                Posnid: posn.Posnid,
                                AuthidList: _authidList,
                            });
                        });
                    },
                    /**检查是否有部门管理权限 */
                    checkDeptMgrChecked: function (posn) {
                        return posn.AuthList.IndexOfByKey(FIELD_NAME.Authid, AUTH.DEPARTMENT_MANAGE) > -1
                            && posn.AuthList.IndexOfByKey(FIELD_NAME.Authid, AUTH.DEPARTMENT_PROCESS) > -1;
                    },
                    /**修改是否有部门管理权限 */
                    onChangeDeptMgrChecked: function (posn) {
                        var _authidList = [];
                        var has = posn.AuthList.IndexOfByKey(FIELD_NAME.Authid, AUTH.DEPARTMENT_MANAGE) > -1
                            && posn.AuthList.IndexOfByKey(FIELD_NAME.Authid, AUTH.DEPARTMENT_PROCESS) > -1;
                        for (var i = 0; i < posn.AuthList.length; i++) {
                            var auth = posn.AuthList[i];
                            if (auth.Authid != AUTH.DEPARTMENT_MANAGE && auth.Authid != AUTH.DEPARTMENT_PROCESS) {
                                _authidList.push(auth.Authid);
                            }
                        }
                        if (!has) {
                            //无 改成 有
                            _authidList.push(AUTH.DEPARTMENT_MANAGE);
                            _authidList.push(AUTH.DEPARTMENT_PROCESS);
                        }
                        WSConn.sendMsg(PB_CMD.MANAGE_POSN_EDIT_AUTH, {
                            Posnid: posn.Posnid,
                            AuthidList: _authidList,
                        });
                    },
                    onEditUserList: function (dept, posn) {
                        _this.ShowSelectUserForPosn(posn);
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
                                var data = {
                                    Posnid: posn.Posnid,
                                };
                                WSConn.sendMsg(PB_CMD.MANAGE_POSN_DEL, data);
                            }, "\u5373\u5C06\u5220\u9664\u804C\u4F4D \"" + posn.Name + "\"");
                        }
                    },
                },
            });
            var _did = UrlParam.Get(URL_PARAM_KEY.DID, 0);
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
                    /**显示子部门的职位 的按钮是否可用*/
                    EnabledToggleShownDeptChildren: function () {
                        if (!currDept) {
                            return false;
                        }
                        return currDept.Children.length > 0;
                    },
                    /**显示子部门的职位 */
                    OnToggleShownDeptChildren: function () {
                        _this.UserConfig.ShownDeptChildren = !_this.UserConfig.ShownDeptChildren;
                    },
                    OnDeptChange: function (toDept) {
                        UrlParam.Set(URL_PARAM_KEY.DID, toDept ? toDept.Did : 0).Reset();
                        _this.ShowPosnList();
                    },
                    OnEnterDeptById: function (did) {
                        UrlParam.Set(URL_PARAM_KEY.DID, did).Reset();
                        _this.ShowPosnList();
                    },
                    OnEnterDept: function (toDept) {
                        UrlParam.Set(URL_PARAM_KEY.DID, toDept ? toDept.Did : 0).Reset();
                        _this.ShowPosnList();
                    },
                    onAdd: function () {
                        if (currDept) {
                            var newName = _this.VuePosnList.newName.toString().trim();
                            if (!newName) {
                                Common.AlertError("\u804C\u4F4D\u540D\u79F0 " + newName + " \u4E0D\u53EF\u4EE5\u4E3A\u7A7A");
                                return;
                            }
                            if (_this.Data.GetPosnByName(_this.Data.CurrProj.DeptTree, newName)) {
                                Common.AlertError("\u804C\u4F4D\u540D\u79F0 " + newName + " \u5DF2\u7ECF\u5B58\u5728");
                                return;
                            }
                            var data = {
                                Did: currDept.Did,
                                Name: newName,
                            };
                            _this.VuePosnList.newName = '';
                            WSConn.sendMsg(PB_CMD.MANAGE_POSN_ADD, data);
                        }
                    },
                },
            }).$mount();
            _this.VuePosnList = vue;
            //#show
            Common.InsertIntoDom(vue.$el, _this.VueProjectEdit.$refs.pageContent);
            //
            _this.DoPosnListSortabled();
        });
    };
    /**权限组 列表 */
    ManageManagerClass.prototype.ShowAuthGroupList = function () {
        var _this = this;
        this.VueProjectEdit.currPage = ProjectEditPageIndex.AuthGroup;
        Loader.LoadVueTemplateList([this.VuePath + "AuthGroupList", this.VuePath + "AuthGroupListComp"], function (tplList) {
            Vue.component("AuthGroupListComp", {
                template: tplList[1],
                props: {
                    authGroupList: Array,
                },
                data: function () {
                    return {
                        auth: _this.Data.MyAuth,
                    };
                },
                methods: {
                    onEditName: function (e, ag, index) {
                        var newName = e.target.value.trim();
                        if (!newName) {
                            e.target.value = ag.Name;
                            return;
                        }
                        if (newName != ag.Name) {
                            if (_this.Data.CurrProj.AuthGroupList.FindByKey(FIELD_NAME.Name, newName)) {
                                Common.AlertError("\u5373\u5C06\u628A\u6743\u9650\u7EC4 \"" + ag.Name + "\" \u6539\u540D\u4E3A \"" + newName + "\" <br/><br/>\u4F46\u8BE5\u540D\u79F0 \"" + newName + "\" \u5DF2\u7ECF\u5B58\u5728");
                                e.target.value = ag.Name;
                                return;
                            }
                            Common.ConfirmWarning("\u5373\u5C06\u628A\u804C\u4F4D \"" + ag.Name + "\" \u6539\u540D\u4E3A \"" + newName + "\"", null, function () {
                                WSConn.sendMsg(PB_CMD.MANAGE_AUTH_GROUP_EDIT_NAME, {
                                    Agid: ag.Agid,
                                    Name: newName,
                                });
                            }, function () {
                                e.target.value = ag.Name;
                            });
                        }
                    },
                    onEditAuth: function (ag, index) {
                        _this.ShowAuthList(ag.AuthidList, function (_authidList) {
                            WSConn.sendMsg(PB_CMD.MANAGE_AUTH_GROUP_EDIT_AUTH, {
                                Agid: ag.Agid,
                                AuthidList: _authidList,
                            });
                        });
                    },
                    /**检查是否有部门管理权限 */
                    checkDeptMgrChecked: function (ag) {
                        return ag.AuthidList.indexOf(AUTH.DEPARTMENT_MANAGE) > -1
                            && ag.AuthidList.indexOf(AUTH.DEPARTMENT_PROCESS) > -1;
                    },
                    /**修改是否有部门管理权限 */
                    onChangeDeptMgrChecked: function (ag) {
                        var _authidList = [];
                        var has = ag.AuthidList.indexOf(AUTH.DEPARTMENT_MANAGE) > -1
                            && ag.AuthidList.indexOf(AUTH.DEPARTMENT_PROCESS) > -1;
                        for (var i = 0; i < ag.AuthidList.length; i++) {
                            var authid = ag.AuthidList[i];
                            if (authid != AUTH.DEPARTMENT_MANAGE && authid != AUTH.DEPARTMENT_PROCESS) {
                                _authidList.push(authid);
                            }
                        }
                        if (!has) {
                            //无 改成 有
                            _authidList.push(AUTH.DEPARTMENT_MANAGE);
                            _authidList.push(AUTH.DEPARTMENT_PROCESS);
                        }
                        WSConn.sendMsg(PB_CMD.MANAGE_AUTH_GROUP_EDIT_AUTH, {
                            Agid: ag.Agid,
                            AuthidList: _authidList,
                        });
                    },
                    onEditUserList: function (ag) {
                        _this.ShowSelectUserForAuthGroup(ag);
                    },
                    onDel: function (ag, index) {
                        Common.ConfirmDelete(function () {
                            var data = {
                                Agid: ag.Agid,
                            };
                            WSConn.sendMsg(PB_CMD.MANAGE_AUTH_GROUP_DEL, data);
                        }, "\u5373\u5C06\u5220\u9664\u804C\u4F4D \"" + ag.Name + "\"");
                    },
                },
            });
            var vue = new Vue({
                template: tplList[0],
                data: {
                    auth: _this.Data.MyAuth,
                    authGroupList: _this.Data.CurrProj.AuthGroupList,
                    newName: "",
                },
                methods: {
                    onAdd: function () {
                        var newName = _this.VueAuthGroupList.newName.toString().trim();
                        if (!newName) {
                            Common.AlertError("\u6743\u9650\u7EC4\u540D\u79F0 " + newName + " \u4E0D\u53EF\u4EE5\u4E3A\u7A7A");
                            return;
                        }
                        if (_this.Data.CurrProj.AuthGroupList.FindByKey(FIELD_NAME.Name, newName)) {
                            Common.AlertError("\u6743\u9650\u7EC4\u540D\u79F0 " + newName + " \u5DF2\u7ECF\u5B58\u5728");
                            return;
                        }
                        var data = {
                            Pid: _this.Data.CurrProj.Pid,
                            Name: newName,
                            Dsc: '',
                        };
                        _this.VueAuthGroupList.newName = '';
                        WSConn.sendMsg(PB_CMD.MANAGE_AUTH_GROUP_ADD, data);
                    },
                },
            }).$mount();
            _this.VueAuthGroupList = vue;
            //#show
            Common.InsertIntoDom(vue.$el, _this.VueProjectEdit.$refs.pageContent);
            //
            _this.DoPosnListSortabled();
        });
    };
    ManageManagerClass.prototype.DoPosnListSortabled = function () {
        var _this = this;
        if (this.PosnListSortableArr) {
            for (var i = 0; i < this.PosnListSortableArr.length; i++) {
                var item = this.PosnListSortableArr[i];
                item.destroy();
            }
            this.PosnListSortableArr = null;
        }
        //#drag Sortable
        var opt = {
            draggable: ".list-complete-item",
            handle: ".btn-drag",
            scorll: true,
            // animation: 150, //动画参数
            // ghostClass: 'sortable-ghostClass',
            chosenClass: 'sortable-chosenClass',
            onUpdate: function (evt) {
                var dept = _this.Data.DeptDict[parseInt($(evt.item).attr(FIELD_NAME.Did))];
                var posnid = parseInt($(evt.item).attr(FIELD_NAME.Posnid));
                var oldIndex = evt.oldIndex;
                var toIndex = evt.newIndex;
                var toSort;
                if (oldIndex < toIndex) {
                    //从上挪到下
                    toIndex += 1;
                    if (toIndex >= dept.PosnList.length) {
                        toSort = dept.PosnList[dept.PosnList.length - 1].Sort + 1;
                    }
                    else {
                        toSort = dept.PosnList[toIndex].Sort;
                    }
                }
                else {
                    //从下挪到上
                    toSort = dept.PosnList[toIndex].Sort;
                }
                WSConn.sendMsg(PB_CMD.MANAGE_POSN_EDIT_SORT, {
                    Posnid: posnid,
                    Sort: toSort,
                });
            },
        };
        var $listComp = $('.posnListComp');
        // console.log("[debug]",$listComp.length,":[listComp.length]")
        // console.log("[debug]",$listComp)
        this.PosnListSortableArr = [];
        for (var i = 0; i < $listComp.length; i++) {
            // console.log("[debug]",i,$listComp.get(i),)
            // console.log("[debug]",i,$($listComp.get(i)).find('.list-complete-item').length)
            this.PosnListSortableArr.push(Sortable.create($listComp.get(i), opt));
        }
    };
    ManageManagerClass.prototype.ShowAuthList = function (authidList, onOkCb) {
        var _this = this;
        Loader.LoadVueTemplate(this.VuePath + "AuthList", function (tpl) {
            var checkedDict = {};
            for (var i = 0; i < authidList.length; i++) {
                checkedDict[authidList[i]] = authidList[i];
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
                                checkedDict[auth.Authid] = auth.Authid;
                            }
                        }
                        _this.VueAuthList.checkedChange = !_this.VueAuthList.checkedChange;
                    },
                    onSwitchAuth: function (e, auth) {
                        if (checkedDict[auth.Authid]) {
                            delete checkedDict[auth.Authid];
                        }
                        else {
                            checkedDict[auth.Authid] = auth.Authid;
                        }
                        // auth.CheckedChange = !auth.CheckedChange
                        _this.VueAuthList.checkedChange = !_this.VueAuthList.checkedChange;
                    },
                    onSave: function () {
                        // posn.AuthList.splice(0, posn.AuthList.length)
                        var _authidList = [];
                        for (var authIdStr in checkedDict) {
                            _authidList.push(parseInt(authIdStr));
                        }
                        onOkCb(_authidList);
                        //
                        _this.VueAuthList.$el.remove();
                        _this.VueAuthList = null;
                    },
                    onReset: function () {
                        for (var authIdStr in checkedDict) {
                            delete checkedDict[authIdStr];
                        }
                        for (var i = 0; i < authidList.length; i++) {
                            checkedDict[authidList[i]] = authidList[i];
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
                    otherUserList: ArrayUtil.SubByAttr(_this.Data.UserList, proj.UserList, FIELD_NAME.Uid),
                    backPosn: backPosn,
                    filterText: filterText,
                    newUserUid: 0,
                },
                methods: {
                    filterUserList: function (userList, filterText) {
                        //标准过滤方式
                        var _filterText = filterText.toString().toLowerCase().trim();
                        if (!_filterText) {
                            return userList;
                        }
                        var _filterTextSp = _filterText.split(/[\s\,]/g);
                        return userList.filter(function (user) {
                            if (StringUtil.IndexOfKeyArr(user.Name.toLowerCase(), _filterTextSp) > -1) {
                                return true;
                            }
                            else {
                                if (user.Did) {
                                    var dept = _this.Data.DeptDict[user.Did];
                                    if (StringUtil.IndexOfKeyArr(dept.Name.toLowerCase(), _filterTextSp) > -1) {
                                        return true;
                                    }
                                    else {
                                        for (var i = 0; i < dept.PosnList.length; i++) {
                                            var posn = dept.PosnList[i];
                                            if (posn.Posnid == user.Posnid && StringUtil.IndexOfKeyArr(posn.Name.toLowerCase(), _filterTextSp) > -1) {
                                                return true;
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                            return false;
                        });
                        //标准筛选
                        //下面是 符合条件 排列到前面的效果,
                        /*  var rs = userList.concat()
                         var dict: { [key: number]: boolean } = {};
                         if (filterText) {
                             var _filterText = filterText.toString().toLowerCase().trim()
                             var _filterTextSp = _filterText.split(/[\s\,]/g)
                             rs.every((user: UserSingle): boolean => {
                                 if (StringUtil.IndexOfKeyArr(user.Name.toLowerCase(), _filterTextSp) > -1) {
                                     dict[user.Uid] = true
                                 } else {
                                     if (user.Did) {
                                         var dept: DepartmentSingle = this.Data.DeptDict[user.Did]
                                         if (StringUtil.IndexOfKeyArr(dept.Name.toLowerCase(), _filterTextSp) > -1) {
                                             dict[user.Uid] = true
                                         } else {
                                             for (var i = 0; i < dept.PosnList.length; i++) {
                                                 var posn = dept.PosnList[i]
                                                 if (posn.Posnid == user.Posnid && StringUtil.IndexOfKeyArr(posn.Name.toLowerCase(), _filterTextSp) > -1) {
                                                     dict[user.Uid] = true
                                                     break;
                                                 }
                                             }
                                         }
                                     }
                                 }
                                 return true
                             })
                             rs.sort((u0: UserSingle, u1: UserSingle): number => {
                                 if (dict[u0.Uid] && !dict[u1.Uid]) {
                                     return -1
                                 } else if (!dict[u0.Uid] && dict[u1.Uid]) {
                                     return 1
                                 }
                                 return 0
                             })
                         }
                         return rs; */
                    },
                    OnBackPosn: function () {
                        UrlParam.Set(URL_PARAM_KEY.PAGE, ProjectEditPageIndex.Position).Set(URL_PARAM_KEY.DID, backDept.Did).Set(URL_PARAM_KEY.FKEY, null).Reset();
                        _this.ShowPosnList();
                    },
                    ShowDpName: function (did) {
                        var dp = _this.Data.DeptDict[did];
                        return dp ? dp.Name : '空';
                    },
                    ShowPosName: function (did, posnid) {
                        var dp = _this.Data.DeptDict[did];
                        if (dp) {
                            if (posnid > 0) {
                                var posn = dp.PosnList.FindByKey(FIELD_NAME.Posnid, posnid);
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
                            var user = ArrayUtil.FindByKey(this.otherUserList, FIELD_NAME.Uid, uid);
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
                        if (dept) {
                            var dept = ManageData.DeptDict[dept.Did];
                            var posn;
                            posn = dept.PosnList[0];
                            WSConn.sendMsg(PB_CMD.MANAGE_USER_EDIT_DEPT, {
                                UserDeptList: [
                                    {
                                        Uid: user.Uid,
                                        Pid: _this.Data.CurrProj.Pid,
                                        Did: dept.Did,
                                        Posnid: posn.Posnid,
                                    }
                                ]
                            });
                        }
                        else {
                            WSConn.sendMsg(PB_CMD.MANAGE_USER_EDIT_DEPT, {
                                UserDeptList: [
                                    {
                                        Uid: user.Uid,
                                        Pid: _this.Data.CurrProj.Pid,
                                        Did: 0,
                                        Posnid: 0,
                                    }
                                ]
                            });
                        }
                    },
                    onPosChange: function (user, posn) {
                        WSConn.sendMsg(PB_CMD.MANAGE_USER_EDIT_DEPT, {
                            UserDeptList: [
                                {
                                    Uid: user.Uid,
                                    Pid: user.Pid,
                                    Did: user.Did,
                                    Posnid: posn.Posnid,
                                }
                            ]
                        });
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
                            WSConn.sendMsg(PB_CMD.MANAGE_PROJ_DEL_USER, {
                                Uid: user.Uid,
                                Pid: _this.Data.CurrProj.Pid,
                            });
                        }, "\u5373\u5C06\u5220\u9664\u6210\u5458 \"" + user.Name + "\"");
                    },
                    onAddSelect: function () {
                        _this.ShowSelectUserForProj(proj, ArrayUtil.SubByAttr(_this.Data.UserList, proj.UserList, FIELD_NAME.Uid));
                    },
                },
            }).$mount();
            _this.VueUserList = vue;
            //#show
            Common.InsertIntoDom(vue.$el, _this.VueProjectEdit.$refs.pageContent);
        });
    };
    /**为proj选择 用户 */
    ManageManagerClass.prototype.ShowSelectUserForProj = function (proj, userList) {
        if (userList.length == 0) {
            Common.AlertWarning('所有用户都已经被添加到了这个项目中');
            return;
        }
        this.ShowSelectUser(userList, [], function (checkedDict) {
            var rlatList = [];
            for (var i = 0; i < userList.length; i++) {
                var user = userList[i];
                if (checkedDict[user.Uid]) {
                    var rlat = {
                        Uid: user.Uid,
                        Pid: proj.Pid,
                        Did: 0,
                        Posnid: 0,
                    };
                    rlatList.push(rlat);
                }
            }
            if (rlatList.length) {
                WSConn.sendMsg(PB_CMD.MANAGE_USER_EDIT_DEPT, {
                    UserDeptList: rlatList
                });
            }
        });
    };
    /* 为posn选择用户 */
    ManageManagerClass.prototype.ShowSelectUserForPosn = function (posn) {
        var _this = this;
        var userList = this.Data.CurrProj.UserList.filter(function (user) {
            if (user.Posnid == 0 || user.Posnid == posn.Posnid) {
                return true;
            }
            return false;
        });
        if (userList.length == 0) {
            Common.ConfirmWarning("\u9879\u76EE\u4E2D\u6CA1\u6709\"\u7A7A\u804C\u4F4D\"\u7684\u6210\u5458\u4E86, \u662F\u5426\u53BB \"\u6210\u5458\u9875\u9762\" \u6DFB\u52A0\u65B0\u6210\u5458?", null, function () {
                UrlParam.Set(URL_PARAM_KEY.PAGE, ProjectEditPageIndex.User).Reset();
                _this.ShowUserList();
            });
            return;
        }
        this.ShowSelectUser(userList, posn.UserList, function (checkedDict) {
            var rlatList = [];
            for (var i = 0; i < posn.UserList.length; i++) {
                var _user = posn.UserList[i];
                if (!checkedDict[_user.Uid]) {
                    //以前在,现在不在列表中了
                    var rlat = {
                        Uid: _user.Uid,
                        Pid: _this.Data.CurrProj.Pid,
                        Did: 0,
                        Posnid: 0,
                    };
                    rlatList.push(rlat);
                }
            }
            for (var uidStr in checkedDict) {
                var _uid = parseInt(uidStr);
                if (posn.UserList.IndexOfByKey(FIELD_NAME.Uid, _uid) == -1) {
                    //原本不在,现在加进来
                    var rlat = {
                        Uid: _uid,
                        Pid: _this.Data.CurrProj.Pid,
                        Did: posn.Did,
                        Posnid: posn.Posnid,
                    };
                    rlatList.push(rlat);
                }
            }
            if (rlatList.length) {
                WSConn.sendMsg(PB_CMD.MANAGE_USER_EDIT_DEPT, {
                    UserDeptList: rlatList
                });
            }
        });
    };
    ManageManagerClass.prototype.ShowSelectUserForAuthGroup = function (ag) {
        var _this = this;
        var userList = this.Data.CurrProj.UserList;
        if (userList.length == 0) {
            Common.ConfirmWarning("\u9879\u76EE\u4E2D\u8FD8\u6CA1\u6709\u6210\u5458, \u662F\u5426\u53BB \"\u6210\u5458\u9875\u9762\" \u6DFB\u52A0\u65B0\u6210\u5458?", null, function () {
                UrlParam.Set(URL_PARAM_KEY.PAGE, ProjectEditPageIndex.User).Reset();
                _this.ShowUserList();
            });
            return;
        }
        //已经勾选的user
        var checkedUserList = [];
        this.Data.CurrProj.UserList.forEach(function (user) {
            if (user.AuthGroupDict[_this.Data.CurrProj.Pid][ag.Agid]) {
                checkedUserList.push(user);
            }
        });
        /* user.AuthGroupDict[uag.Pid] */
        this.ShowSelectUser(userList, checkedUserList, function (checkedDict) {
            var list = [];
            var uidList = [];
            //原本没有, 现在勾上了
            for (var uidStr in checkedDict) {
                var uid = parseInt(uidStr);
                uidList.push(uid);
            }
            if (list.length) {
                WSConn.sendMsg(PB_CMD.MANAGE_AUTH_GROUP_EDIT_USER, {
                    Agid: ag.Agid,
                    Pid: _this.Data.CurrProj.Pid,
                    UidList: uidList,
                });
            }
        });
    };
    ManageManagerClass.prototype.ShowSelectUser = function (userList, checkedUserList, onOkCb) {
        var _this = this;
        Loader.LoadVueTemplate(this.VuePath + "SelectUser", function (tpl) {
            var checkedDict = {};
            //初始化check字典
            for (var i = 0; i < checkedUserList.length; i++) {
                var _user = checkedUserList[i];
                checkedDict[_user.Uid] = _user;
            }
            //
            var _GetFilterList = function (userList, filterText) {
                var _filterText = filterText.toString().toLowerCase().trim();
                if (_filterText) {
                    var _filterTextSp = _filterText.split(/[\s\,]/g);
                    return userList.filter(function (user) {
                        if (checkedDict[user.Uid]) { //已经选中的默认显示
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
                        onOkCb(checkedDict);
                        //
                        $(_this.VueSelectUser.$el).remove();
                        _this.VueSelectUser = null;
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