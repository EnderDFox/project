/** 管理项目 部门 职位 权限 */
enum ProjectEditPage {
    User = 1,
    Department = 2,
}

class ManagerManagerClass {
    VuePath = "manager/"
    VueProjectList: CombinedVueInstance1<{ projectList: ProjectSingle[] }>
    VueProjectEdit: CombinedVueInstance1<{ project: ProjectSingle, newName: string, dpTree: DepartmentSingle[], currPage: ProjectEditPage }>
    VueUserList: CombinedVueInstance1<{ otherUserList: UserSingle[], newUserUid: number }>
    VueDepartmentList: CombinedVueInstance1<{ allDepartmentList: DepartmentSingle[], newDpName: string }>
    VueDepartmentSingle: CombinedVueInstance1<{ department: DepartmentSingle, fullName: string, newName: string, allDepartmentList: DepartmentSingle[], positionList: PositionSingle[] }>
    Show() {
        // this.ShowPositionSingle({ Posid: 2, Did: 2, Name: 'UI' })
        // this.ShowUserList()
    }
    ShowProjectList() {
        Loader.LoadVueTemplate(this.VuePath + "ProjectList", (tpl: string) => {
            var vue = new Vue(
                {
                    template: tpl,
                    data: {
                        projectList: ManagerData.ProjectList,
                    },
                    methods: {
                        onEditName: (e: Event, proj: ProjectSingle, index: number) => {
                            var newName = (e.target as HTMLInputElement).value
                            proj.Name = newName
                        },
                        onClose: function () {
                            $(this.$el).hide()
                        },
                        onEdit: (e: Event, proj: ProjectSingle, index: number) => {
                            // console.log("[debug]",vue,":[vue]")
                            $(this.VueProjectList.$el).hide()
                            this.ShowProjectEdit(proj)
                            /*   if (index > 0) {
                                  var i1 = index - 1
                                  var i2 = index
                                  this.VueProjectList.projectList.splice(i1, 1, ...this.VueProjectList.projectList.splice(i2, 1, this.VueProjectList.projectList[i1]))
                              } */
                        },
                        onDel: (e, proj: ProjectSingle, index: int) => {
                            this.VueProjectList.projectList.splice(index, 1)
                        },
                        onAdd: () => {
                            // this.ShowProjectEdit(null)
                            this.VueProjectList.projectList.push(
                                {
                                    Pid: this.VueProjectList.projectList[this.VueProjectList.projectList.length - 1].Pid + 1,
                                    Name: `空${this.VueProjectList.projectList.length}`,
                                }
                            )
                        }
                    },
                }
            ).$mount()
            this.VueProjectList = vue
            //#show
            Common.InsertIntoPageDom(vue.$el)
            $(vue.$el).show()
        })
    }
    ShowProjectEdit(proj: ProjectSingle) {
        Loader.LoadVueTemplateList([`${this.VuePath}DepartmentItemComponent`, `${this.VuePath}ProjectEdit`], (tplList: string[]) => {
            //注册组件
            Vue.component('DepartmentItemComponent', {
                template: tplList[0],
                props: {
                    dp: Object
                },
                data: function () {
                    return {}
                },
                methods: {
                    onEdit: function (dp: DepartmentSingle) {
                        // console.log("[debug,this is comp]",dp.Name,":[dp]")
                        this.$emit('onEdit', dp)
                    }
                }
            })
            //
            var vue = new Vue(
                {
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
                            $(this.$el).hide()
                        },
                        onEditProj: (e, proj: ProjectSingle, index: number) => {
                            this.ShowProjectEdit(proj)
                        },
                        onEnterProjMg: () => {
                            $(this.VueProjectEdit.$el).hide()
                            this.ShowProjectList()
                        },
                        onSelectPage: (page: ProjectEditPage) => {
                            this.VueProjectEdit.currPage = page;
                            switch (page) {
                                case ProjectEditPage.User:
                                    this.ShowUserList(this.VueProjectEdit.project)
                                    break;
                                case ProjectEditPage.Department:
                                    this.ShowDepartmentList(this.VueProjectEdit.project)
                                    break;
                            }
                        },
                        // onEdit: (e, dp: DepartmentSingle) => {
                        onEdit: (dp: DepartmentSingle) => {
                            // console.log("[debug]",dp.Name,dp.Did)
                            this.ShowDepartmentSingle(dp)
                        },
                        onDel: (e, proj: ProjectSingle, index: int) => {
                        },
                        onSubmit: () => {
                        }
                    },
                }
            ).$mount()
            this.VueProjectEdit = vue
            //#show
            Common.InsertIntoPageDom(vue.$el)
            $(vue.$el).show()
            // this.ShowUserList(this.VueProjectEdit.project)
            this.ShowDepartmentList(this.VueProjectEdit.project)
        })
    }
    ShowDepartmentList(proj: ProjectSingle) {
        this.VueProjectEdit.currPage = ProjectEditPage.Department
        Loader.LoadVueTemplate(this.VuePath + "DepartmentList", (tpl: string) => {
            var vue = new Vue(
                {
                    template: tpl,
                    data: {
                        allDepartmentList: ManagerData.GetAllDepartmentList(),
                        newDpName: '',
                    },
                    methods: {
                        ShowParentDpName: (did: number): string => {
                            var dp = ManagerData.DepartmentDict[did]
                            return dp ? dp.Name : '选择上级部门'
                        },
                        departmentOption: (dp: DepartmentSingle) => {
                            if (dp.Depth == 0) {
                                return dp.Name
                            } else {
                                var rs: string = ''
                                for (var i = 0; i < dp.Depth; i++) {
                                    rs += ' -'
                                }
                                // rs += '└';
                                rs += dp.Name
                                return rs
                            }
                        },
                        onEditName: () => {

                        },
                        CheckShowEditParentDp: (dp: DepartmentSingle, parentDp: DepartmentSingle) => {
                            if (dp.Did == parentDp.Did) {
                                return false
                            }
                            if (dp.Fid == parentDp.Did) {
                                return false
                            }
                            if (ManagerData.IsDepartmentChild(dp, parentDp)) {
                                return false
                            }
                            return true
                        },
                        onEditParentDp: (dp: DepartmentSingle, parentDp: DepartmentSingle) => {
                            var currParentDp = ManagerData.DepartmentDict[dp.Fid]
                            if (currParentDp != null) {
                                ArrayUtil.RemoveByAttr(currParentDp.Children, FieldName.Did, dp.Did)

                            }
                            if (parentDp == null) {
                                //顶级部门
                                dp.Fid = 0
                                dp.Depth = 0
                                var i0 = ArrayUtil.IndexOfAttr(this.VueDepartmentList.allDepartmentList, FieldName.Did, dp.Did)
                                this.VueDepartmentList.allDepartmentList.splice(i0, 1)[0]
                                this.VueDepartmentList.allDepartmentList.push(dp)
                            } else {
                                dp.Fid = parentDp.Did
                                dp.Depth = parentDp.Depth + 1
                                parentDp.Children.push(dp)
                                //
                                var i0 = ArrayUtil.IndexOfAttr(this.VueDepartmentList.allDepartmentList, FieldName.Did, dp.Did)
                                this.VueDepartmentList.allDepartmentList.splice(i0, 1)[0]
                                var i1 = ArrayUtil.IndexOfAttr(this.VueDepartmentList.allDepartmentList, FieldName.Did, parentDp.Did)
                                var allChildrenLen = ManagerData.GetAllDepartmentList(parentDp.Children, -1).length
                                this.VueDepartmentList.allDepartmentList.splice(i1 + allChildrenLen, 0, dp)
                            }
                        },
                        onDel: (e, user: UserSingle, index: int) => {
                            proj.UserList.splice(index, 1)
                            this.VueUserList.otherUserList = ArrayUtil.SubByAttr(ManagerData.UserList, proj.UserList, FieldName.Uid)
                        },
                        onAdd: () => {
                            var newUser: UserSingle = ArrayUtil.FindOfAttr<PositionSingle>(this.VueUserList.otherUserList, FieldName.Uid, this.VueUserList.newUserUid)
                            if (newUser) {
                                proj.UserList.push(newUser)
                                this.VueUserList.newUserUid = 0
                                this.VueUserList.otherUserList = ArrayUtil.SubByAttr(ManagerData.UserList, proj.UserList, FieldName.Uid)
                            }
                        },
                    },
                }
            ).$mount()
            this.VueDepartmentList = vue
            //#show
            Common.InsertIntoDom(vue.$el, '#projectEditContent')
            $(vue.$el).show()
        })
    }
    ShowDepartmentSingle(dp: DepartmentSingle) {
        Loader.LoadVueTemplate(this.VuePath + "DepartmentEdit", (tpl: string) => {
            var vue = new Vue(
                {
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
                        departmentOption: (dp: DepartmentSingle) => {
                            if (dp.Depth == 0) {
                                return dp.Name
                            } else {
                                var rs: string = ''
                                for (var i = 0; i < dp.Depth; i++) {
                                    rs += '-'
                                }
                                // rs += '└';
                                rs += dp.Name
                                return rs
                            }
                        },
                        onClose: () => {
                        },
                        onEdit: (e, pos: PositionSingle) => {
                            this.ShowPositionSingle(pos)
                        },
                        onDel: (e, pos: PositionSingle, index: int) => {
                        },
                        onAdd: () => {
                        }
                    },
                }
            ).$mount()
            this.VueDepartmentSingle = vue
            //#show
            Common.InsertBeforeDynamicDom(vue.$el)
            Common.AlginCenterInWindow(vue.$el)
            $(vue.$el).show()
        })
    }

    ShowPositionSingle(pos: PositionSingle) {
        Loader.LoadVueTemplate(this.VuePath + "PositionEdit", (tpl: string) => {
            var vue = new Vue(
                {
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
                        departmentOption: (dp: DepartmentSingle) => {
                            if (dp.Depth == 0) {
                                return dp.Name
                            } else {
                                var rs: string = ''
                                for (var i = 0; i < dp.Depth; i++) {
                                    rs += '-'
                                }
                                // rs += '└';
                                rs += dp.Name
                                return rs
                            }
                        },
                        onClose: function () {
                            $(this.$el).hide()
                        },
                        onEdit: (e, pos: PositionSingle) => {
                            this.ShowPositionSingle(pos)
                        },
                        onDel: (e, pos: PositionSingle, index: int) => {
                        },
                        onAdd: () => {
                        }
                    },
                }
            ).$mount()
            // this.VueDepartmentSingle = vue
            //#show
            Common.InsertBeforeDynamicDom(vue.$el)
            Common.AlginCenterInWindow(vue.$el)
            $(vue.$el).show()
        })
    }
    ShowUserList(proj: ProjectSingle) {
        this.VueProjectEdit.currPage = ProjectEditPage.User
        Loader.LoadVueTemplate(this.VuePath + "UserList", (tpl: string) => {
            var vue = new Vue(
                {
                    template: tpl,
                    data: {
                        otherUserList: ArrayUtil.SubByAttr(ManagerData.UserList, proj.UserList, FieldName.Uid),
                        userList: proj.UserList,
                        allDepartmentList: ManagerData.GetAllDepartmentList(),
                        newUserUid: 0,
                    },
                    methods: {
                        ShowDpName: (did: number): string => {
                            var dp = ManagerData.DepartmentDict[did]
                            return dp ? dp.Name : '空'
                        },
                        ShowPosName: (did: number, posid: number): string => {
                            var dp = ManagerData.DepartmentDict[did]
                            if (dp) {
                                var pos: PositionSingle = ArrayUtil.FindOfAttr(dp.PositionList, FieldName.Posid, posid) as PositionSingle
                                console.log("[debug]", posid, ":[posid]", pos, ":[pos]")
                                return pos ? pos.Name : '--'
                            } else {
                                return '空'
                            }
                        },
                        ShowUserName: function (uid: number): string {
                            this.newUserUid = uid
                            if (uid) {
                                var user: UserSingle = ArrayUtil.FindOfAttr(this.otherUserList, FieldName.Uid, uid) as PositionSingle
                                if (user) {
                                    return user.Name
                                }
                            }
                            return '选择新成员'
                        },
                        GetPosList: (did: number): PositionSingle[] => {
                            var dp = ManagerData.DepartmentDict[did]
                            if (dp) {
                                return dp.PositionList;
                            } else {
                                return []
                            }
                        },
                        departmentOption: (dp: DepartmentSingle) => {
                            if (dp.Depth == 0) {
                                return dp.Name
                            } else {
                                var rs: string = ''
                                for (var i = 0; i < dp.Depth; i++) {
                                    rs += '-'
                                }
                                // rs += '└';
                                rs += dp.Name
                                return rs
                            }
                        },
                        onDpChange: (user: UserSingle, dp: DepartmentSingle) => {
                            user.Did = dp.Did
                            if (dp.PositionList.length > 0) {
                                user.Posid = dp.PositionList[0].Posid
                            } else {
                                user.Posid = 0
                            }
                        },
                        onClose: function () {
                            $(this.$el).hide()
                        },
                        onDel: (e, user: UserSingle, index: int) => {
                            proj.UserList.splice(index, 1)
                            this.VueUserList.otherUserList = ArrayUtil.SubByAttr(ManagerData.UserList, proj.UserList, FieldName.Uid)
                        },
                        onAdd: () => {
                            var newUser: UserSingle = ArrayUtil.FindOfAttr<PositionSingle>(this.VueUserList.otherUserList, FieldName.Uid, this.VueUserList.newUserUid)
                            if (newUser) {
                                proj.UserList.push(newUser)
                                this.VueUserList.newUserUid = 0
                                this.VueUserList.otherUserList = ArrayUtil.SubByAttr(ManagerData.UserList, proj.UserList, FieldName.Uid)
                            }
                        },
                    },
                }
            ).$mount()
            this.VueUserList = vue
            //#show
            Common.InsertIntoDom(vue.$el, '#projectEditContent')
            $(vue.$el).show()
        })
    }
}

var ManagerManager = new ManagerManagerClass()