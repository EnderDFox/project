/** 管理项目 部门 职位 权限 */
var ProjectEditPage;
(function (ProjectEditPage) {
    ProjectEditPage[ProjectEditPage["User"] = 1] = "User";
    ProjectEditPage[ProjectEditPage["Department"] = 2] = "Department";
})(ProjectEditPage || (ProjectEditPage = {}));
var ManagerManagerClass = /** @class */ (function () {
    function ManagerManagerClass() {
        this.VuePath = "manager/";
        this.NewDepartmentUuid = 100001;
        this.NewPositionUuid = 200001;
        /**职位 - 权限列表 */
    }
    ManagerManagerClass.prototype.Init = function () {
        this.InitVue(this.ShowProjectList.bind(this));
    };
    ManagerManagerClass.prototype.InitVue = function (cb) {
        Loader.LoadVueTemplateList([this.VuePath + "NavbarComp"], function (tplList) {
            //注册组件
            Vue.component('navbar-comp', {
                template: tplList[0],
                props: {
                    isProjList: String,
                    currUser: Object,
                },
            });
            //#
            cb();
        });
    };
    ManagerManagerClass.prototype.ShowProjectList = function () {
        var _this = this;
        //
        Loader.LoadVueTemplate(this.VuePath + "ProjectList", function (tpl) {
            var projList;
            if (ManagerData.MyAuth[AUTH.PROJECT_LIST]) {
                projList = ManagerData.ProjectList;
            }
            else {
                //只看自己所处的项目
                projList = [];
                for (var i = 0; i < ManagerData.ProjectList.length; i++) {
                    var proj = ManagerData.ProjectList[i];
                    if (proj.UserList.IndexOfAttr(FieldName.Uid, ManagerData.CurrUser.Uid) > -1) {
                        projList.push(proj);
                        if (proj.MasterUid == ManagerData.CurrUser.Uid) {
                            ManagerData.AddMyAuth(AUTH.PROJECT_EDIT);
                        }
                    }
                }
            }
            var vue = new Vue({
                template: tpl,
                data: {
                    newName: '',
                    auth: ManagerData.MyAuth,
                    projectList: projList,
                    currUser: ManagerData.CurrUser,
                },
                methods: {
                    GetDateStr: function (timeStamp) {
                        return Common.TimeStamp2DateStr(timeStamp);
                    },
                    GetProjMaster: function (proj) {
                        if (proj.MasterUid > 0) {
                            return ManagerData.UserDict[proj.MasterUid].Name;
                        }
                        else {
                            return '空';
                        }
                    },
                    OnEditMaster: function (proj, user) {
                        if (proj.MasterUid == ManagerData.CurrUser.Uid && !ManagerData.MyAuth[AUTH.PROJECT_LIST]) {
                            //是这个项目的负责人,并且不是超管
                            Common.ConfirmWarning("\u4F60\u662F\u8FD9\u4E2A\u9879\u76EE\u73B0\u5728\u7684\u8D1F\u8D23\u4EBA <br/>\u5982\u679C\u4FEE\u6539\u8D1F\u8D23\u4EBA,\u4F60\u5C06\u5931\u53BB\u8FD9\u4E2A\u9879\u76EE\u7684\u7BA1\u7406\u6743\u9650", "\u8981\u5C06'\u8D1F\u8D23\u4EBA'\u4FEE\u6539\u4E3A'" + user.Name + "'\u5417?", function () {
                                proj.MasterUid = user.Uid;
                                ManagerData.RemoveMyAuth(AUTH.PROJECT_EDIT);
                            });
                        }
                        else {
                            proj.MasterUid = user.Uid;
                        }
                    },
                    GetProjUserCount: function (proj) {
                        return proj.UserList.length;
                    },
                    GetProjUserCountTitle: function (proj) {
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
                            if (ManagerData.ProjectList.IndexOfAttr(FieldName.Name, newName) > -1) {
                                Common.AlertError("\u9879\u76EE\u540D\u79F0 " + newName + " \u5DF2\u7ECF\u5B58\u5728");
                                e.target.value = proj.Name;
                                return;
                            }
                            proj.Name = newName;
                        }
                    },
                    onClose: function () {
                    },
                    onShowUserList: function (proj, index) {
                        _this.ShowProjectEdit(proj, ProjectEditPage.User);
                    },
                    onShowDepartmentList: function (proj, index) {
                        _this.ShowProjectEdit(proj, ProjectEditPage.Department);
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
                        if (ManagerData.ProjectList.IndexOfAttr(FieldName.Name, newName) > -1) {
                            Common.AlertError("\u9879\u76EE\u540D\u79F0 " + newName + " \u5DF2\u7ECF\u5B58\u5728");
                            return;
                        }
                        ManagerData.ProjectList.push({
                            Pid: ManagerData.ProjectList[_this.VueProjectList.projectList.length - 1].Pid + 1,
                            Name: _this.VueProjectList.newName.toString(),
                            MasterUid: 0, UserList: [],
                            CreateTime: new Date().getTime(),
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
    ManagerManagerClass.prototype.ShowProjectEdit = function (proj, currPage) {
        var _this = this;
        Loader.LoadVueTemplateList([this.VuePath + "ProjectEdit"], function (tplList) {
            var vue = new Vue({
                template: tplList[0],
                data: {
                    project: proj,
                    projectList: _this.VueProjectList.projectList,
                    dpTree: ManagerData.DepartmentTree,
                    newName: proj ? proj.Name : '',
                    auth: ManagerData.MyAuth,
                    currPage: currPage,
                    currUser: ManagerData.CurrUser,
                },
                methods: {
                    onClose: function () {
                        $(this.$el).hide();
                    },
                    onShowProjList: function () {
                        $(_this.VueProjectEdit.$el).hide();
                        _this.ShowProjectList();
                    },
                    onShowCurrProj: function () {
                        if (_this.VueProjectEdit.projectList.length == 1) {
                            //仅在只有一个项目 可以用, 多个项目就是下拉列表了
                            _this.ShowProjectEdit(_this.VueProjectEdit.project, ProjectEditPage.Department);
                        }
                    },
                    onShowProj: function (proj, index) {
                        _this.ShowProjectEdit(proj, _this.VueProjectEdit.currPage);
                    },
                    onShowPage: function (page) {
                        _this.VueProjectEdit.currPage = page;
                        _this.ShowProjectEditPage(_this.VueProjectEdit.currPage);
                    },
                },
            }).$mount();
            _this.VueProjectEdit = vue;
            //#show
            Common.InsertIntoPageDom(vue.$el);
            _this.ShowProjectEditPage(_this.VueProjectEdit.currPage);
        });
    };
    ManagerManagerClass.prototype.ShowProjectEditPage = function (currPage) {
        switch (currPage) {
            case ProjectEditPage.User:
                this.ShowUserList(this.VueProjectEdit.project);
                break;
            case ProjectEditPage.Department:
                this.ShowDepartmentList(this.VueProjectEdit.project);
                break;
        }
    };
    ManagerManagerClass.prototype.ShowDepartmentList = function (proj) {
        var _this = this;
        this.VueProjectEdit.currPage = ProjectEditPage.Department;
        Loader.LoadVueTemplate(this.VuePath + "DepartmentList", function (tpl) {
            var vue = new Vue({
                template: tpl,
                data: {
                    allDepartmentList: ManagerData.DepartmentList,
                    newName: '',
                    auth: ManagerData.MyAuth,
                },
                methods: {
                    departmentOption: _this.DepartmentOption.bind(_this),
                    onEditName: function (e, dp, i0) {
                        var newName = e.target.value;
                        dp.Name = newName;
                    },
                    onEditPosition: function (dp, i0) {
                        _this.ShowPositionList(dp);
                    },
                    CheckShowEditParentDp: _this.CheckShowEditParentDp.bind(_this),
                    onEditParentDp: function (dp, parentDp) {
                        if (parentDp == null) {
                            if (dp.Fid == 0) {
                                return; //已经是顶级职位了
                            }
                        }
                        if (!_this.CheckShowEditParentDp(dp, parentDp)) {
                            return;
                        }
                        var currParentDp = ManagerData.DepartmentDict[dp.Fid];
                        if (currParentDp != null) {
                            ArrayUtil.RemoveByAttr(currParentDp.Children, FieldName.Did, dp.Did);
                        }
                        var allDpList = _this.VueDepartmentList.allDepartmentList;
                        if (parentDp == null) {
                            //顶级部门
                            dp.Fid = 0;
                            dp.Depth = 0;
                            var i0 = ArrayUtil.IndexOfAttr(allDpList, FieldName.Did, dp.Did);
                            allDpList.splice(i0, 1)[0];
                            allDpList.push(dp);
                        }
                        else {
                            dp.Fid = parentDp.Did;
                            dp.Depth = parentDp.Depth + 1;
                            parentDp.Children.push(dp);
                            //
                            var i0 = ArrayUtil.IndexOfAttr(allDpList, FieldName.Did, dp.Did);
                            allDpList.splice(i0, 1)[0];
                            var i1 = ArrayUtil.IndexOfAttr(allDpList, FieldName.Did, parentDp.Did);
                            var allChildrenLen = ManagerData.GetAllDepartmentList(parentDp.Children, -1).length;
                            allDpList.splice(i1 + allChildrenLen, 0, dp);
                        }
                    },
                    CheckSortDown: _this.CheckSortDown.bind(_this),
                    CheckSortUp: _this.CheckSortUp.bind(_this),
                    onSortDown: function (e, dp, i0) {
                        if (!_this.CheckSortDown(dp, i0)) {
                            return;
                        }
                        var brothers = ManagerData.GetBrotherDepartmentList(dp);
                        var brotherIndex = ArrayUtil.IndexOfAttr(brothers, FieldName.Did, dp.Did);
                        var brother = brothers[brotherIndex + 1];
                        brothers.splice(brotherIndex, 1);
                        brothers.splice(brotherIndex + 1, 0, dp);
                        //
                        ManagerData.RefreshAllDepartmentList();
                        // var allDpList = this.VueDepartmentList.allDepartmentList
                        // var i1 = ArrayUtil.IndexOfAttr(allDpList, FieldName.Did, brother.Did)
                        // allDpList.splice(i1, 0, allDpList.splice(i0, 1)[0])
                    },
                    onSortUp: function (e, dp, i0) {
                        if (!_this.CheckSortUp(dp, i0)) {
                            return;
                        }
                        var brothers = ManagerData.GetBrotherDepartmentList(dp);
                        var brotherIndex = ArrayUtil.IndexOfAttr(brothers, FieldName.Did, dp.Did);
                        brothers.splice(brotherIndex, 1);
                        brothers.splice(brotherIndex - 1, 0, dp);
                        //
                        ManagerData.RefreshAllDepartmentList();
                    },
                    onDel: function (dp, i0) {
                        Common.ConfirmDelete(function () {
                            var brothers = ManagerData.GetBrotherDepartmentList(dp);
                            var brotherIndex = ArrayUtil.IndexOfAttr(brothers, FieldName.Did, dp.Did);
                            brothers.splice(brotherIndex, 1);
                            //
                            delete ManagerData.DepartmentDict[dp.Did];
                            ManagerData.RefreshAllDepartmentList();
                        }, "\u5373\u5C06\u5220\u9664\u90E8\u95E8 \"" + (dp.Name || '空') + "}\" \u53CA\u5176\u5B50\u90E8\u95E8<br/>\n                            \u8BE5\u90E8\u95E8\u53CA\u5176\u5B50\u90E8\u95E8\u7684\u6240\u6709\u804C\u4F4D\u90FD\u5C06\u88AB\u5220\u9664");
                    },
                    onAdd: function () {
                        var dp = {
                            Did: _this.NewDepartmentUuid, Name: _this.VueDepartmentList.newName.toString(), Depth: 0, Children: [], PositionList: [
                                { Posid: _this.NewPositionUuid, Did: _this.NewDepartmentUuid, Name: _this.VueDepartmentList.newName.toString(), AuthorityList: [] },
                            ],
                            Fid: 0,
                        };
                        _this.VueDepartmentList.newName = '';
                        _this.NewDepartmentUuid++;
                        _this.NewPositionUuid++;
                        ManagerData.DepartmentDict[dp.Did] = dp;
                        ManagerData.DepartmentTree.push(dp);
                        ManagerData.DepartmentList.push(dp);
                    },
                    onAddChild: function (parentDp, i0) {
                        var dp = {
                            Did: _this.NewDepartmentUuid, Name: "", Depth: parentDp.Depth + 1, Children: [], PositionList: [
                                { Posid: _this.NewPositionUuid, Did: _this.NewDepartmentUuid, Name: "", AuthorityList: [] },
                            ],
                            Fid: parentDp.Did
                        };
                        _this.NewDepartmentUuid++;
                        _this.NewPositionUuid++;
                        ManagerData.DepartmentDict[dp.Did] = dp;
                        parentDp.Children.push(dp);
                        var allDpList = _this.VueDepartmentList.allDepartmentList;
                        allDpList.splice(i0 + ManagerData.GetAllDepartmentList(parentDp.Children, -1).length, 0, dp);
                    },
                },
            }).$mount();
            _this.VueDepartmentList = vue;
            //#show
            Common.InsertIntoDom(vue.$el, '#projectEditContent');
            //TEST
            // this.ShowPositionList(ManagerData.DepartmentList[0])
        });
    };
    ManagerManagerClass.prototype.DepartmentOption = function (dp) {
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
    ManagerManagerClass.prototype.CheckSortDown = function (dp, i0) {
        var brothers = ManagerData.GetBrotherDepartmentList(dp);
        var brotherIndex = ArrayUtil.IndexOfAttr(brothers, FieldName.Did, dp.Did);
        if (brotherIndex < brothers.length - 1) {
            return true;
        }
        return false;
    };
    ManagerManagerClass.prototype.CheckSortUp = function (dp, i0) {
        var brothers = ManagerData.GetBrotherDepartmentList(dp);
        var brotherIndex = ArrayUtil.IndexOfAttr(brothers, FieldName.Did, dp.Did);
        if (brotherIndex > 0) {
            return true;
        }
        return false;
    };
    ManagerManagerClass.prototype.CheckShowEditParentDp = function (dp, parentDp) {
        if (dp.Did == parentDp.Did) {
            return false;
        }
        if (dp.Fid == parentDp.Did) {
            return false;
        }
        if (ManagerData.IsDepartmentChild(dp, parentDp)) {
            return false;
        }
        return true;
    };
    ManagerManagerClass.prototype.ShowPositionList = function (dp) {
        var _this = this;
        Loader.LoadVueTemplate(this.VuePath + "PositionList", function (tpl) {
            var vue = new Vue({
                template: tpl,
                data: {
                    dp: dp,
                    newName: "",
                    allDepartmentList: ManagerData.DepartmentList,
                    auth: ManagerData.MyAuth,
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
                            parentDp = ManagerData.DepartmentDict[parentDp.Fid];
                        }
                        return "<ol class=\"breadcrumb\">\n                                        " + rs.join("") + "\n                                    </ol>";
                    },
                    /**回到部门列表 */
                    onBackDepartmentList: function () {
                        console.log("[debug]", "onBackDepartmentList");
                        _this.ShowDepartmentList(ManagerData.GetProjByPid(dp.Pid));
                    },
                    departmentOption: _this.DepartmentOption.bind(_this),
                    onEditParentDp: function (dp, parentDp) {
                        _this.ShowPositionList(parentDp);
                    },
                    onEditName: function (e, pos, index) {
                        var newName = e.target.value;
                        pos.Name = newName;
                    },
                    onEditAuth: function (pos, index) {
                        _this.ShowAuthList(pos);
                    },
                    CheckSortDown: function (pos, index) {
                        return index < dp.PositionList.length - 1;
                    },
                    CheckSortUp: function (pos, index) {
                        return index > 0;
                    },
                    onSortDown: function (pos, index) {
                        if (index < dp.PositionList.length - 1) {
                            dp.PositionList.splice(index + 1, 0, dp.PositionList.splice(index, 1)[0]);
                        }
                    },
                    onSortUp: function (pos, index) {
                        if (index > 0) {
                            dp.PositionList.splice(index - 1, 0, dp.PositionList.splice(index, 1)[0]);
                        }
                    },
                    onDel: function (e, pos, index) {
                        if (dp.PositionList.length == 1) {
                            Common.AlertWarning("\u6BCF\u4E2A\u90E8\u95E8\u4E0B\u81F3\u5C11\u8981\u4FDD\u7559\u4E00\u4E2A\u804C\u4F4D");
                        }
                        else {
                            Common.ConfirmDelete(function () {
                                dp.PositionList.splice(index, 1);
                            }, "\u5373\u5C06\u5220\u9664\u804C\u4F4D \"" + (pos.Name || '空') + "\"");
                        }
                    },
                    onAdd: function () {
                        var pos = { Posid: _this.NewPositionUuid++, Did: dp.Did, Name: _this.VuePositionList.newName.toString(), AuthorityList: [] };
                        _this.VuePositionList.newName = '';
                        dp.PositionList.push(pos);
                    },
                },
            }).$mount();
            _this.VuePositionList = vue;
            //#show
            Common.InsertIntoDom(vue.$el, '#projectEditContent');
        });
    };
    ManagerManagerClass.prototype.ShowAuthList = function (pos) {
        var _this = this;
        Loader.LoadVueTemplate(this.VuePath + "AuthList", function (tpl) {
            var selectedAuthDict = {};
            for (var i = 0; i < pos.AuthorityList.length; i++) {
                var auth = pos.AuthorityList[i];
                selectedAuthDict[auth.Authid] = auth;
            }
            var _checkModChecked = function (_, mod) {
                // console.log("[debug]", '_checkAllModSelected')
                for (var i = 0; i < mod.AuthorityList.length; i++) {
                    var auth = mod.AuthorityList[i];
                    if (!selectedAuthDict[auth.Authid]) {
                        return false;
                    }
                }
                return true;
            };
            var vue = new Vue({
                template: tpl,
                data: {
                    pos: pos,
                    authorityModuleList: ManagerData.AuthorityModuleList,
                    checkedChange: false,
                    auth: ManagerData.MyAuth,
                },
                methods: {
                    checkModChecked: _checkModChecked.bind(_this),
                    checkAuthChecked: function (_, auth) {
                        // console.log("[debug] checkAuthSelected", auth.Authid, selectedAuthDict[auth.Authid])
                        return selectedAuthDict[auth.Authid] != null;
                    },
                    onSwitchMod: function (mod) {
                        var allSelected = _checkModChecked(null, mod);
                        for (var i = 0; i < mod.AuthorityList.length; i++) {
                            var auth = mod.AuthorityList[i];
                            if (allSelected) {
                                delete selectedAuthDict[auth.Authid];
                            }
                            else {
                                selectedAuthDict[auth.Authid] = auth;
                            }
                        }
                        _this.VueAuthList.checkedChange = !_this.VueAuthList.checkedChange;
                    },
                    onSwitchAuth: function (e, auth) {
                        if (selectedAuthDict[auth.Authid]) {
                            delete selectedAuthDict[auth.Authid];
                        }
                        else {
                            selectedAuthDict[auth.Authid] = auth;
                        }
                        // auth.CheckedChange = !auth.CheckedChange
                        _this.VueAuthList.checkedChange = !_this.VueAuthList.checkedChange;
                    },
                    onSave: function () {
                        pos.AuthorityList.splice(0, pos.AuthorityList.length);
                        for (var authIdStr in selectedAuthDict) {
                            pos.AuthorityList.push(selectedAuthDict[authIdStr]);
                        }
                        _this.VueAuthList.$el.remove();
                        _this.VueAuthList = null;
                    },
                    onReset: function () {
                        for (var authIdStr in selectedAuthDict) {
                            delete selectedAuthDict[authIdStr];
                        }
                        for (var i = 0; i < pos.AuthorityList.length; i++) {
                            var auth = pos.AuthorityList[i];
                            selectedAuthDict[auth.Authid] = auth;
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
    ManagerManagerClass.prototype.ShowUserList = function (proj) {
        var _this = this;
        this.VueProjectEdit.currPage = ProjectEditPage.User;
        Loader.LoadVueTemplate(this.VuePath + "UserList", function (tpl) {
            var vue = new Vue({
                template: tpl,
                data: {
                    otherUserList: ArrayUtil.SubByAttr(ManagerData.UserList, proj.UserList, FieldName.Uid),
                    userList: proj.UserList,
                    allDepartmentList: ManagerData.DepartmentList,
                    newUserUid: 0,
                    auth: ManagerData.MyAuth,
                },
                methods: {
                    ShowDpName: function (did) {
                        var dp = ManagerData.DepartmentDict[did];
                        return dp ? dp.Name : '空';
                    },
                    ShowPosName: function (did, posid) {
                        var dp = ManagerData.DepartmentDict[did];
                        if (dp) {
                            if (posid > 0) {
                                var pos = ArrayUtil.FindOfAttr(dp.PositionList, FieldName.Posid, posid);
                                // console.log("[debug]", posid, ":[posid]", pos, ":[pos]")
                                return pos ? pos.Name : '--';
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
                            var user = ArrayUtil.FindOfAttr(this.otherUserList, FieldName.Uid, uid);
                            if (user) {
                                return user.Name;
                            }
                        }
                        return '选择新成员';
                    },
                    GetPosList: function (did) {
                        var dp = ManagerData.DepartmentDict[did];
                        if (dp) {
                            return dp.PositionList;
                        }
                        else {
                            return [];
                        }
                    },
                    departmentOption: _this.DepartmentOption.bind(_this),
                    onDpChange: function (user, dp) {
                        user.Did = dp.Did;
                        if (dp.PositionList.length > 0) {
                            user.Posid = dp.PositionList[0].Posid;
                        }
                        else {
                            user.Posid = 0;
                        }
                    },
                    onPosChange: function (user, pos) {
                        user.Posid = pos.Posid;
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
                            _this.VueUserList.otherUserList = ArrayUtil.SubByAttr(ManagerData.UserList, proj.UserList, FieldName.Uid);
                        }, "\u5373\u5C06\u5220\u9664\u6210\u5458 \"" + user.Name + "\"");
                    },
                    onAdd: function () {
                        var newUser = ArrayUtil.FindOfAttr(_this.VueUserList.otherUserList, FieldName.Uid, _this.VueUserList.newUserUid);
                        if (newUser) {
                            proj.UserList.push(newUser);
                            _this.VueUserList.newUserUid = 0;
                            _this.VueUserList.otherUserList = ArrayUtil.SubByAttr(ManagerData.UserList, proj.UserList, FieldName.Uid);
                        }
                    },
                },
            }).$mount();
            _this.VueUserList = vue;
            //#show
            Common.InsertIntoDom(vue.$el, '#projectEditContent');
        });
    };
    return ManagerManagerClass;
}());
var ManagerManager = new ManagerManagerClass();
//# sourceMappingURL=ManagerManager.js.map