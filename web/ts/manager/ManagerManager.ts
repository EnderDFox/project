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
    VuePositionList: CombinedVueInstance1<{ newName: string }>
    VueAuthList: CombinedVueInstance1<{ checkedChange: boolean }>
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
                                    Name: this.VueProjectList.newName.toString(),
                                }
                            )
                            this.VueProjectList.newName = ''
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
        Loader.LoadVueTemplateList([`${this.VuePath}ProjectEdit`], (tplList: string[]) => {
            var vue = new Vue(
                {
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
                        departmentOption: this.DepartmentOption.bind(this),
                        onEditName: (e: Event, dp: DepartmentSingle, i0: int) => {
                            var newName = (e.target as HTMLInputElement).value
                            dp.Name = newName
                        },
                        onEditPosition: (dp: DepartmentSingle, i0: int) => {
                            this.ShowPositionList(dp)
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
                            var brothers: DepartmentSingle[] = ManagerData.GetBrotherDepartmentList(dp)
                            var brotherIndex = ArrayUtil.IndexOfAttr(brothers, FieldName.Did, dp.Did)
                            var brother = brothers[brotherIndex + 1]
                            brothers.splice(brotherIndex, 1)
                            brothers.splice(brotherIndex + 1, 0, dp)
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
                            var brothers: DepartmentSingle[] = ManagerData.GetBrotherDepartmentList(dp)
                            var brotherIndex = ArrayUtil.IndexOfAttr(brothers, FieldName.Did, dp.Did)
                            brothers.splice(brotherIndex, 1)
                            brothers.splice(brotherIndex - 1, 0, dp)
                            //
                            ManagerData.RefreshAllDepartmentList()
                        },
                        onDel: (e, dp: DepartmentSingle, i0: int) => {
                            var brothers: DepartmentSingle[] = ManagerData.GetBrotherDepartmentList(dp)
                            var brotherIndex = ArrayUtil.IndexOfAttr(brothers, FieldName.Did, dp.Did)
                            brothers.splice(brotherIndex, 1)
                            //
                            delete ManagerData.DepartmentDict[dp.Did]
                            ManagerData.RefreshAllDepartmentList()

                        },
                        onAdd: () => {
                            var dp: DepartmentSingle = {
                                Did: this.NewDepartmentUuid, Name: this.VueDepartmentList.newName.toString(), Depth: 0, Children: [], PositionList: [
                                    { Posid: this.NewPositionUuid, Did: this.NewDepartmentUuid, Name: this.VueDepartmentList.newName.toString(), AuthorityList: [] },//给一个默认的职位
                                ],
                                Fid: 0,
                            }
                            this.VueDepartmentList.newName = ''
                            this.NewDepartmentUuid++
                            this.NewPositionUuid++
                            ManagerData.DepartmentDict[dp.Did] = dp
                            ManagerData.DepartmentTree.push(dp)
                            ManagerData.DepartmentList.push(dp)
                        },
                        onAddChild: (parentDp: DepartmentSingle, i0: int) => {
                            var dp: DepartmentSingle = {
                                Did: this.NewDepartmentUuid, Name: ``, Depth: parentDp.Depth + 1, Children: [], PositionList: [
                                    { Posid: this.NewPositionUuid, Did: this.NewDepartmentUuid, Name: ``, AuthorityList: [] },//给一个默认的职位
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
            //TEST
            // this.ShowPositionList(ManagerData.DepartmentList[0])
        })
    }
    DepartmentOption(dp: DepartmentSingle) {
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
    }
    CheckSortDown(dp: DepartmentSingle, i0: int) {
        var brothers: DepartmentSingle[] = ManagerData.GetBrotherDepartmentList(dp)
        var brotherIndex = ArrayUtil.IndexOfAttr(brothers, FieldName.Did, dp.Did)
        if (brotherIndex < brothers.length - 1) {
            return true
        }
        return false
    }
    CheckSortUp(dp: DepartmentSingle, i0: int) {
        var brothers: DepartmentSingle[] = ManagerData.GetBrotherDepartmentList(dp)
        var brotherIndex = ArrayUtil.IndexOfAttr(brothers, FieldName.Did, dp.Did)
        if (brotherIndex > 0) {
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
    ShowPositionList(dp: DepartmentSingle) {
        Loader.LoadVueTemplate(this.VuePath + "PositionList", (tpl: string) => {
            var vue = new Vue(
                {
                    template: tpl,
                    data: {
                        dp: dp,
                        newName: ``,
                        allDepartmentList: ManagerData.DepartmentList,
                    },
                    methods: {
                        dpFullName: (dp: DepartmentSingle) => {
                            var rs: string[] = []
                            var parentDp = dp
                            while (parentDp) {
                                if (parentDp.Did == dp.Did) {
                                    rs.unshift(`<li class="active">${parentDp.Name}</li>`)
                                } else {
                                    rs.unshift(`<li>${parentDp.Name}</li>`)
                                }
                                parentDp = ManagerData.DepartmentDict[parentDp.Fid]
                            }
                            return `<ol class="breadcrumb">
                                        ${rs.join(``)}
                                    </ol>`
                        },
                        departmentOption: this.DepartmentOption.bind(this),
                        onEditParentDp: (dp: DepartmentSingle, parentDp: DepartmentSingle) => {
                            this.ShowPositionList(parentDp)
                        },
                        onEditName: (e: Event, pos: PositionSingle, index: number) => {
                            var newName = (e.target as HTMLInputElement).value
                            pos.Name = newName
                        },
                        onEditAuth: (pos: PositionSingle, index: number) => {
                            this.ShowAuthList(pos)
                        },
                        CheckSortDown: (pos: PositionSingle, index: int) => {
                            return index < dp.PositionList.length - 1
                        },
                        CheckSortUp: (pos: PositionSingle, index: int) => {
                            return index > 0

                        },
                        onSortDown: (pos: PositionSingle, index: int) => {
                            if (index < dp.PositionList.length - 1) {
                                dp.PositionList.splice(index + 1, 0, dp.PositionList.splice(index, 1)[0])
                            }
                        },
                        onSortUp: (pos: PositionSingle, index: int) => {
                            if (index > 0) {
                                dp.PositionList.splice(index - 1, 0, dp.PositionList.splice(index, 1)[0])
                            }
                        },
                        onDel: (e, pos: PositionSingle, index: int) => {
                            dp.PositionList.splice(index, 1)
                        },
                        onAdd: () => {
                            var pos: PositionSingle = { Posid: this.NewPositionUuid++, Did: dp.Did, Name: this.VuePositionList.newName.toString(), AuthorityList: [] }
                            this.VuePositionList.newName = ''
                            dp.PositionList.push(pos)
                        },
                    },
                }
            ).$mount()
            this.VuePositionList = vue
            //#show
            Common.InsertIntoDom(vue.$el, '#projectEditContent')
        })
    }
    ShowAuthList(pos: PositionSingle) {
        Loader.LoadVueTemplate(this.VuePath + "AuthList", (tpl: string) => {
            var selectedAuthDict: { [key: number]: AuthoritySingle } = {};
            for (var i = 0; i < pos.AuthorityList.length; i++) {
                var auth: AuthoritySingle = pos.AuthorityList[i]
                selectedAuthDict[auth.Authid] = auth
            }
            var _checkModChecked = (_, mod: AuthorityModuleSingle): boolean => {
                // console.log("[debug]", '_checkAllModSelected')
                for (var i = 0; i < mod.AuthorityList.length; i++) {
                    var auth = mod.AuthorityList[i]
                    if (!selectedAuthDict[auth.Authid]) {
                        return false
                    }
                }
                return true
            }
            var vue = new Vue({
                template: tpl,
                data: {
                    pos: pos,
                    authorityModuleList: ManagerData.AuthorityModuleList,
                    checkedChange: false,//为了让check函数被触发
                },
                methods: {
                    checkModChecked: _checkModChecked.bind(this),
                    checkAuthChecked: (_, auth: AuthoritySingle): boolean => {
                        // console.log("[debug] checkAuthSelected", auth.Authid, selectedAuthDict[auth.Authid])
                        return selectedAuthDict[auth.Authid] != null
                    },
                    onSwitchMod: (mod: AuthorityModuleSingle) => {
                        var allSelected = _checkModChecked(null, mod)
                        for (var i = 0; i < mod.AuthorityList.length; i++) {
                            var auth = mod.AuthorityList[i]
                            if (allSelected) {
                                delete selectedAuthDict[auth.Authid]
                            } else {
                                selectedAuthDict[auth.Authid] = auth
                            }
                        }
                        this.VueAuthList.checkedChange = !this.VueAuthList.checkedChange
                    },
                    onSwitchAuth: (e: Event, auth: AuthoritySingle) => {
                        if (selectedAuthDict[auth.Authid]) {
                            delete selectedAuthDict[auth.Authid]
                        } else {
                            selectedAuthDict[auth.Authid] = auth
                        }
                        // auth.CheckedChange = !auth.CheckedChange
                        this.VueAuthList.checkedChange = !this.VueAuthList.checkedChange
                    },
                    onSave: () => {
                        pos.AuthorityList.splice(0, pos.AuthorityList.length)
                        for (var authIdStr in selectedAuthDict) {
                            pos.AuthorityList.push(selectedAuthDict[authIdStr])
                        }
                    },
                    onReset: () => {
                        for (var authIdStr in selectedAuthDict) {
                            delete selectedAuthDict[authIdStr]
                        }
                        for (var i = 0; i < pos.AuthorityList.length; i++) {
                            var auth: AuthoritySingle = pos.AuthorityList[i]
                            selectedAuthDict[auth.Authid] = auth
                        }
                        this.VueAuthList.checkedChange = !this.VueAuthList.checkedChange
                    },
                },
            }).$mount()
            this.VueAuthList = vue
            // $(vue.$el).alert('close');
            Common.InsertBeforeDynamicDom(vue.$el)
            Common.AlginCenterInWindow($(vue.$el).find('.popup_content'))
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
                                if (posid > 0) {
                                    var pos: PositionSingle = ArrayUtil.FindOfAttr(dp.PositionList, FieldName.Posid, posid) as PositionSingle
                                    // console.log("[debug]", posid, ":[posid]", pos, ":[pos]")
                                    return pos ? pos.Name : '--'
                                } else {
                                    return '空'
                                }
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
                        departmentOption: this.DepartmentOption.bind(this),
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
    /**职位 - 权限列表 */

}

var ManagerManager = new ManagerManagerClass()