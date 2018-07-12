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
    }
    ManagerManagerClass.prototype.Show = function () {
        // this.ShowPositionSingle({ Posid: 2, Did: 2, Name: 'UI' })
        // this.ShowUserList()
    };
    ManagerManagerClass.prototype.ShowProjectList = function () {
        var _this = this;
        Loader.LoadVueTemplate(this.VuePath + "ProjectList", function (tpl) {
            var vue = new Vue({
                template: tpl,
                data: {
                    newName: '',
                    projectList: ManagerData.ProjectList,
                },
                methods: {
                    onEditName: function (e, proj, index) {
                        var newName = e.target.value;
                        proj.Name = newName;
                    },
                    onClose: function () {
                        $(this.$el).hide();
                    },
                    onEdit: function (e, proj, index) {
                        // console.log("[debug]",vue,":[vue]")
                        $(_this.VueProjectList.$el).hide();
                        _this.ShowProjectEdit(proj);
                        /*   if (index > 0) {
                              var i1 = index - 1
                              var i2 = index
                              this.VueProjectList.projectList.splice(i1, 1, ...this.VueProjectList.projectList.splice(i2, 1, this.VueProjectList.projectList[i1]))
                          } */
                    },
                    onDel: function (e, proj, index) {
                        _this.VueProjectList.projectList.splice(index, 1);
                    },
                    onAdd: function () {
                        // this.ShowProjectEdit(null)
                        _this.VueProjectList.projectList.push({
                            Pid: _this.VueProjectList.projectList[_this.VueProjectList.projectList.length - 1].Pid + 1,
                            Name: _this.VueProjectList.newName.toString(),
                        });
                        _this.VueProjectList.newName = '';
                    }
                },
            }).$mount();
            _this.VueProjectList = vue;
            //#show
            Common.InsertIntoPageDom(vue.$el);
            $(vue.$el).show();
        });
    };
    ManagerManagerClass.prototype.ShowProjectEdit = function (proj) {
        var _this = this;
        Loader.LoadVueTemplateList([this.VuePath + "ProjectEdit"], function (tplList) {
            var vue = new Vue({
                template: tplList[0],
                data: {
                    project: proj,
                    projectList: ManagerData.ProjectList,
                    dpTree: ManagerData.DepartmentTree,
                    newName: proj ? proj.Name : '',
                    auth: ManagerData.MyAuth,
                    currPage: ProjectEditPage.User,
                },
                methods: {
                    onClose: function () {
                        $(this.$el).hide();
                    },
                    onEditProj: function (e, proj, index) {
                        _this.ShowProjectEdit(proj);
                    },
                    onEnterProjMg: function () {
                        $(_this.VueProjectEdit.$el).hide();
                        _this.ShowProjectList();
                    },
                    onSelectPage: function (page) {
                        _this.VueProjectEdit.currPage = page;
                        switch (page) {
                            case ProjectEditPage.User:
                                _this.ShowUserList(_this.VueProjectEdit.project);
                                break;
                            case ProjectEditPage.Department:
                                _this.ShowDepartmentList(_this.VueProjectEdit.project);
                                break;
                        }
                    },
                    onDel: function (e, proj, index) {
                    },
                    onSubmit: function () {
                    }
                },
            }).$mount();
            _this.VueProjectEdit = vue;
            //#show
            Common.InsertIntoPageDom(vue.$el);
            $(vue.$el).show();
            // this.ShowUserList(this.VueProjectEdit.project)
            _this.ShowDepartmentList(_this.VueProjectEdit.project);
        });
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
                },
                methods: {
                    ShowParentDpName: function (did) {
                        var dp = ManagerData.DepartmentDict[did];
                        return dp ? dp.Name : '选择上级部门';
                    },
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
                        var children;
                        if (dp.Fid) {
                            children = ManagerData.DepartmentDict[dp.Fid].Children;
                        }
                        else {
                            children = ManagerData.DepartmentTree;
                        }
                        var childIndex = ArrayUtil.IndexOfAttr(children, FieldName.Did, dp.Did);
                        var brother = children[childIndex + 1];
                        children.splice(childIndex, 1);
                        children.splice(childIndex + 1, 0, dp);
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
                        var children;
                        if (dp.Fid) {
                            children = ManagerData.DepartmentDict[dp.Fid].Children;
                        }
                        else {
                            children = ManagerData.DepartmentTree;
                        }
                        var childIndex = ArrayUtil.IndexOfAttr(children, FieldName.Did, dp.Did);
                        children.splice(childIndex, 1);
                        children.splice(childIndex - 1, 0, dp);
                        //
                        ManagerData.RefreshAllDepartmentList();
                    },
                    onDel: function (e, dp, i0) {
                        var children;
                        if (dp.Fid) {
                            children = ManagerData.DepartmentDict[dp.Fid].Children;
                        }
                        else {
                            children = ManagerData.DepartmentTree;
                        }
                        var childIndex = ArrayUtil.IndexOfAttr(children, FieldName.Did, dp.Did);
                        children.splice(childIndex, 1);
                        //
                        ManagerData.RefreshAllDepartmentList();
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
            $(vue.$el).show();
        });
    };
    ManagerManagerClass.prototype.DepartmentOption = function (dp) {
        if (dp.Depth == 0) {
            return dp.Name;
        }
        else {
            var rs = '';
            for (var i = 0; i < dp.Depth; i++) {
                rs += '-';
            }
            // rs += '└';
            rs += dp.Name;
            return rs;
        }
    };
    ManagerManagerClass.prototype.CheckSortDown = function (dp, i0) {
        var children;
        if (dp.Fid) {
            children = ManagerData.DepartmentDict[dp.Fid].Children;
        }
        else {
            children = ManagerData.DepartmentTree;
        }
        var childIndex = ArrayUtil.IndexOfAttr(children, FieldName.Did, dp.Did);
        if (childIndex < children.length - 1) {
            return true;
        }
        return false;
    };
    ManagerManagerClass.prototype.CheckSortUp = function (dp, i0) {
        var children;
        if (dp.Fid) {
            children = ManagerData.DepartmentDict[dp.Fid].Children;
        }
        else {
            children = ManagerData.DepartmentTree;
        }
        var childIndex = ArrayUtil.IndexOfAttr(children, FieldName.Did, dp.Did);
        if (childIndex > 0) {
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
                    authorityModuleList: ManagerData.AuthorityModuleList,
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
                    departmentOption: _this.DepartmentOption.bind(_this),
                    onEditParentDp: function (dp, parentDp) {
                        _this.ShowPositionList(parentDp);
                    },
                    onEditName: function (e, pos, index) {
                        var newName = e.target.value;
                        pos.Name = newName;
                    },
                    onEditAuth: function (pos, index) {
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
                        dp.PositionList.splice(index, 1);
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
                    onClose: function () {
                        $(this.$el).hide();
                    },
                    onDel: function (e, user, index) {
                        proj.UserList.splice(index, 1);
                        _this.VueUserList.otherUserList = ArrayUtil.SubByAttr(ManagerData.UserList, proj.UserList, FieldName.Uid);
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
            $(vue.$el).show();
        });
    };
    return ManagerManagerClass;
}());
var ManagerManager = new ManagerManagerClass();
//# sourceMappingURL=ManagerManager.js.map