/** 管理项目 部门 职位 权限 */
var ProjectEditPage;
(function (ProjectEditPage) {
    ProjectEditPage[ProjectEditPage["User"] = 1] = "User";
    ProjectEditPage[ProjectEditPage["Department"] = 2] = "Department";
})(ProjectEditPage || (ProjectEditPage = {}));
var ManagerManagerClass = /** @class */ (function () {
    function ManagerManagerClass() {
        this.VuePath = "manager/";
    }
    ManagerManagerClass.prototype.Show = function () {
        this.ShowProjectList();
        // this.ShowPositionSingle({ Posid: 2, Did: 2, Name: 'UI' })
        // this.ShowUserList()
    };
    ManagerManagerClass.prototype.ShowProjectList = function () {
        var _this = this;
        Loader.LoadVueTemplate(this.VuePath + "ProjectList", function (tpl) {
            var vue = new Vue({
                template: tpl,
                data: {
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
                            Name: "\u7A7A" + _this.VueProjectList.projectList.length,
                        });
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
        Loader.LoadVueTemplateList([this.VuePath + "DepartmentItemComponent", this.VuePath + "ProjectEdit"], function (tplList) {
            //注册组件
            Vue.component('DepartmentItemComponent', {
                template: tplList[0],
                props: {
                    dp: Object
                },
                data: function () {
                    return {};
                },
                methods: {
                    onEdit: function (dp) {
                        // console.log("[debug,this is comp]",dp.Name,":[dp]")
                        this.$emit('onEdit', dp);
                    }
                }
            });
            //
            var vue = new Vue({
                template: tplList[1],
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
                    // onEdit: (e, dp: DepartmentSingle) => {
                    onEdit: function (dp) {
                        // console.log("[debug]",dp.Name,dp.Did)
                        _this.ShowDepartmentSingle(dp);
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
            _this.ShowUserList(_this.VueProjectEdit.project);
        });
    };
    ManagerManagerClass.prototype.ShowDepartmentList = function (proj) {
        this.VueProjectEdit.currPage = ProjectEditPage.Department;
    };
    ManagerManagerClass.prototype.ShowDepartmentSingle = function (dp) {
        var _this = this;
        Loader.LoadVueTemplate(this.VuePath + "DepartmentEdit", function (tpl) {
            var vue = new Vue({
                template: tpl,
                data: {
                    department: dp, fullName: dp.Name, newName: dp.Name,
                    allDepartmentList: ManagerData.GetAllDepartmentList(),
                    positionList: [
                        { Posid: 1, Did: 2, Name: '美术主管' },
                        { Posid: 2, Did: 2, Name: 'UI' },
                        { Posid: 3, Did: 2, Name: '原画' },
                        { Posid: 4, Did: 2, Name: '角色' },
                    ],
                },
                methods: {
                    departmentOption: function (dp) {
                        if (dp.depth == 0) {
                            return dp.Name;
                        }
                        else {
                            var rs = '';
                            for (var i = 0; i < dp.depth; i++) {
                                rs += '-';
                            }
                            // rs += '└';
                            rs += dp.Name;
                            return rs;
                        }
                    },
                    onClose: function () {
                    },
                    onEdit: function (e, pos) {
                        _this.ShowPositionSingle(pos);
                    },
                    onDel: function (e, pos, index) {
                    },
                    onAdd: function () {
                    }
                },
            }).$mount();
            _this.VueDepartmentSingle = vue;
            //#show
            Common.InsertBeforeDynamicDom(vue.$el);
            Common.AlginCenterInWindow(vue.$el);
            $(vue.$el).show();
        });
    };
    ManagerManagerClass.prototype.ShowPositionSingle = function (pos) {
        var _this = this;
        Loader.LoadVueTemplate(this.VuePath + "PositionEdit", function (tpl) {
            var vue = new Vue({
                template: tpl,
                data: {
                    pos: pos, fullName: pos.Name, newName: pos.Name.toString(),
                    allDepartmentList: ManagerData.GetAllDepartmentList(),
                    showKind: 1,
                    userList: ManagerData.UserList.slice(0, 7),
                    authorityModuleList: [
                        {
                            Modid: 1, Name: '模块A', AuthorityList: [
                                { Aid: 101, Name: '权限A1' },
                                { Aid: 102, Name: '权限A2' },
                                { Aid: 103, Name: '权限A3' },
                                { Aid: 104, Name: '权限A4' },
                                { Aid: 105, Name: '权限A5' },
                                { Aid: 106, Name: '权限A6' },
                                { Aid: 107, Name: '权限A7' },
                                { Aid: 108, Name: '权限A8' },
                                { Aid: 109, Name: '权限A9' },
                                { Aid: 110, Name: '权限A10' },
                            ]
                        },
                        {
                            Modid: 2, Name: '模块B', AuthorityList: [
                                { Aid: 21, Name: '权限B1' },
                                { Aid: 22, Name: '权限B2' },
                            ]
                        },
                        {
                            Modid: 3, Name: '模块C', AuthorityList: [
                                { Aid: 31, Name: '权限C1' },
                                { Aid: 32, Name: '权限C2' },
                                { Aid: 33, Name: '权限C3' },
                                { Aid: 34, Name: '权限C4' },
                                { Aid: 35, Name: '权限C5' },
                            ]
                        },
                    ]
                },
                methods: {
                    departmentOption: function (dp) {
                        if (dp.depth == 0) {
                            return dp.Name;
                        }
                        else {
                            var rs = '';
                            for (var i = 0; i < dp.depth; i++) {
                                rs += '-';
                            }
                            // rs += '└';
                            rs += dp.Name;
                            return rs;
                        }
                    },
                    onClose: function () {
                        $(this.$el).hide();
                    },
                    onEdit: function (e, pos) {
                        _this.ShowPositionSingle(pos);
                    },
                    onDel: function (e, pos, index) {
                    },
                    onAdd: function () {
                    }
                },
            }).$mount();
            // this.VueDepartmentSingle = vue
            //#show
            Common.InsertBeforeDynamicDom(vue.$el);
            Common.AlginCenterInWindow(vue.$el);
            $(vue.$el).show();
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
                    allDepartmentList: ManagerData.GetAllDepartmentList(),
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
                            var pos = ArrayUtil.FindOfAttr(dp.PositionList, FieldName.Posid, posid);
                            console.log("[debug]", posid, ":[posid]", pos, ":[pos]");
                            return pos ? pos.Name : '--';
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
                    departmentOption: function (dp) {
                        if (dp.depth == 0) {
                            return dp.Name;
                        }
                        else {
                            var rs = '';
                            for (var i = 0; i < dp.depth; i++) {
                                rs += '-';
                            }
                            // rs += '└';
                            rs += dp.Name;
                            return rs;
                        }
                    },
                    onDpChange: function (user, dp) {
                        console.log("[debug]", dp, ":[dp]");
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