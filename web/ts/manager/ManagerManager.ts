/** 管理项目 部门 职位 权限 */
enum ProjectEditPage {
    User = 1,
    Department = 2,
}

class ManagerManagerClass {
    VuePath = "manager/"
    VueProjectList: CombinedVueInstance1<{ projectList: ProjectSingle[], newName: string }>
    VueProjectEdit: CombinedVueInstance1<{ project: ProjectSingle, newName: string, dpTree: DepartmentSingle[], currPage: ProjectEditPage }>
    VueUserList: CombinedVueInstance1<{ otherUserList: UserSingle[], newUserUid: number }>
    VueDepartmentList: CombinedVueInstance1<{ allDepartmentList: DepartmentSingle[], newName: string }>
    NewDepartmentUuid = 100001
    NewPositionUuid = 200001
    VuePositionEdit: CombinedVueInstance1<{ newName: string }>
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
                        newName: '',
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
                                    Name: this.VueProjectList.newName,
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
                        allDepartmentList: ManagerData.DepartmentList,
                        newName: '',
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
                        onEditName: (e: Event, dp: DepartmentSingle, i0: int) => {
                            var newName = (e.target as HTMLInputElement).value
                            dp.Name = newName
                        },
                        onEditPosition: (dp: DepartmentSingle, i0: int) => {
                            this.ShowPositionEdit(dp)
                        },
                        CheckShowEditParentDp: this.CheckShowEditParentDp.bind(this),
                        onEditParentDp: (dp: DepartmentSingle, parentDp: DepartmentSingle) => {
                            if (parentDp == null) {
                                if (dp.Fid == 0) {
                                    return//已经是顶级职位了
                                }
                            }
                            if (!this.CheckShowEditParentDp(dp, parentDp)) {
                                return
                            }
                            var currParentDp = ManagerData.DepartmentDict[dp.Fid]
                            if (currParentDp != null) {
                                ArrayUtil.RemoveByAttr(currParentDp.Children, FieldName.Did, dp.Did)

                            }
                            var allDpList = this.VueDepartmentList.allDepartmentList
                            if (parentDp == null) {
                                //顶级部门
                                dp.Fid = 0
                                dp.Depth = 0
                                var i0 = ArrayUtil.IndexOfAttr(allDpList, FieldName.Did, dp.Did)
                                allDpList.splice(i0, 1)[0]
                                allDpList.push(dp)
                            } else {
                                dp.Fid = parentDp.Did
                                dp.Depth = parentDp.Depth + 1
                                parentDp.Children.push(dp)
                                //
                                var i0 = ArrayUtil.IndexOfAttr(allDpList, FieldName.Did, dp.Did)
                                allDpList.splice(i0, 1)[0]
                                var i1 = ArrayUtil.IndexOfAttr(allDpList, FieldName.Did, parentDp.Did)
                                var allChildrenLen = ManagerData.GetAllDepartmentList(parentDp.Children, -1).length
                                allDpList.splice(i1 + allChildrenLen, 0, dp)
                            }
                        },
                        CheckSortDown: this.CheckSortDown.bind(this),
                        CheckSortUp: this.CheckSortUp.bind(this),
                        onSortDown: (e, dp: DepartmentSingle, i0: int) => {
                            if (!this.CheckSortDown(dp, i0)) {
                                return
                            }
                            var children: DepartmentSingle[]
                            if (dp.Fid) {
                                children = ManagerData.DepartmentDict[dp.Fid].Children
                            } else {
                                children = ManagerData.DepartmentTree
                            }
                            var childIndex = ArrayUtil.IndexOfAttr(children, FieldName.Did, dp.Did)
                            var brother = children[childIndex + 1]
                            children.splice(childIndex, 1)
                            children.splice(childIndex + 1, 0, dp)
                            //
                            ManagerData.RefreshAllDepartmentList()
                            // var allDpList = this.VueDepartmentList.allDepartmentList
                            // var i1 = ArrayUtil.IndexOfAttr(allDpList, FieldName.Did, brother.Did)
                            // allDpList.splice(i1, 0, allDpList.splice(i0, 1)[0])
                        },
                        onSortUp: (e, dp: DepartmentSingle, i0: int) => {
                            if (!this.CheckSortUp(dp, i0)) {
                                return
                            }
                            var children: DepartmentSingle[]
                            if (dp.Fid) {
                                children = ManagerData.DepartmentDict[dp.Fid].Children
                            } else {
                                children = ManagerData.DepartmentTree
                            }
                            var childIndex = ArrayUtil.IndexOfAttr(children, FieldName.Did, dp.Did)
                            children.splice(childIndex, 1)
                            children.splice(childIndex - 1, 0, dp)
                            //
                            ManagerData.RefreshAllDepartmentList()
                        },
                        onDel: (e, dp: DepartmentSingle, i0: int) => {
                            var children: DepartmentSingle[]
                            if (dp.Fid) {
                                children = ManagerData.DepartmentDict[dp.Fid].Children
                            } else {
                                children = ManagerData.DepartmentTree
                            }
                            var childIndex = ArrayUtil.IndexOfAttr(children, FieldName.Did, dp.Did)
                            children.splice(childIndex, 1)
                            //
                            ManagerData.RefreshAllDepartmentList()

                        },
                        onAdd: () => {
                            var dp: DepartmentSingle = {
                                Did: this.NewDepartmentUuid, Name: this.VueDepartmentList.newName, Depth: 0, Children: [], PositionList: [
                                    { Posid: this.NewPositionUuid, Did: this.NewDepartmentUuid, Name: this.VueDepartmentList.newName },//给一个默认的职位
                                ],
                                Fid: 0,
                            }
                            this.NewDepartmentUuid++
                            this.NewPositionUuid++
                            ManagerData.DepartmentDict[dp.Did] = dp
                            ManagerData.DepartmentTree.push(dp)
                            ManagerData.DepartmentList.push(dp)
                        },
                        onAddChild: (parentDp: DepartmentSingle, i0: int) => {
                            var dp: DepartmentSingle = {
                                Did: this.NewDepartmentUuid, Name: ``, Depth: parentDp.Depth + 1, Children: [], PositionList: [
                                    { Posid: this.NewPositionUuid, Did: this.NewDepartmentUuid, Name: `` },//给一个默认的职位
                                ],
                                Fid: parentDp.Did
                            }
                            this.NewDepartmentUuid++
                            this.NewPositionUuid++
                            ManagerData.DepartmentDict[dp.Did] = dp
                            parentDp.Children.push(dp)
                            var allDpList = this.VueDepartmentList.allDepartmentList
                            allDpList.splice(i0 + ManagerData.GetAllDepartmentList(parentDp.Children, -1).length, 0, dp)
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
    CheckSortDown(dp: DepartmentSingle, i0: int) {
        var children: DepartmentSingle[]
        if (dp.Fid) {
            children = ManagerData.DepartmentDict[dp.Fid].Children
        } else {
            children = ManagerData.DepartmentTree
        }
        var childIndex = ArrayUtil.IndexOfAttr(children, FieldName.Did, dp.Did)
        if (childIndex < children.length - 1) {
            return true
        }
        return false
    }
    CheckSortUp(dp: DepartmentSingle, i0: int) {
        var children: DepartmentSingle[]
        if (dp.Fid) {
            children = ManagerData.DepartmentDict[dp.Fid].Children
        } else {
            children = ManagerData.DepartmentTree
        }
        var childIndex = ArrayUtil.IndexOfAttr(children, FieldName.Did, dp.Did)
        if (childIndex > 0) {
            return true
        }
        return false
    }
    CheckShowEditParentDp(dp: DepartmentSingle, parentDp: DepartmentSingle) {
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
    }
    ShowPositionEdit(pos: PositionSingle) {
        Loader.LoadVueTemplate(this.VuePath + "PositionEdit", (tpl: string) => {
            var vue = new Vue(
                {
                    template: tpl,
                    data: {
                        pos: pos, fullName: pos.Name,
                        newName: ``,
                        allDepartmentList: ManagerData.DepartmentList,
                        showKind: 1,
                        userList: ManagerData.UserList.slice(0, 7),
                        authorityModuleList: ManagerData.AuthorityModuleList,
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
                            this.ShowPositionEdit(pos)
                        },
                        onDel: (e, pos: PositionSingle, index: int) => {
                        },
                        onAdd: () => {
                        }
                    },
                }
            ).$mount()
            this.VuePositionEdit = vue
            //#show
            Common.InsertIntoDom(vue.$el, '#projectEditContent')
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
                        allDepartmentList: ManagerData.DepartmentList,
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