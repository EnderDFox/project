/** 管理项目 部门 职位 权限 */
enum ProjectEditPage {
    User = 1,
    Department = 2,
}

class ManagerManagerClass {
    VuePath = "manager/"
    VueProjectList: CombinedVueInstance1<{ auth: { [key: number]: boolean }, projectList: ProjectSingle[], newName: string }>
    VueProjectEdit: CombinedVueInstance1<{ projectList: ProjectSingle[], project: ProjectSingle, newName: string, dpTree: DepartmentSingle[], currPage: ProjectEditPage }>
    VueUserList: CombinedVueInstance1<{ userList: UserSingle[], otherUserList: UserSingle[], newUserUid: number, filterText: string }>
    VueDepartmentList: CombinedVueInstance1<{ allDepartmentList: DepartmentSingle[], newName: string }>
    NewDepartmentUuid = 100001
    NewPositionUuid = 200001
    VuePositionList: CombinedVueInstance1<{ newName: string }>
    VueAuthList: CombinedVueInstance1<{ checkedChange: boolean }>
    Init() {
        this.InitVue(this.ShowProjectList.bind(this))
    }
    InitVue(cb: () => void) {
        Loader.LoadVueTemplateList([`${this.VuePath}NavbarComp`], (tplList: string[]) => {
            //注册组件
            Vue.component('navbar-comp', {
                template: tplList[0],
                props: {
                    isProjList: String,
                    currUser: Object,
                },
            })
            //#
            cb()
        })
    }
    ShowProjectList() {
        //
        Loader.LoadVueTemplate(this.VuePath + "ProjectList", (tpl: string) => {
            var projList: ProjectSingle[];
            if (ManagerData.MyAuth[AUTH.PROJECT_LIST]) {
                projList = ManagerData.ProjectList
            } else {
                //只看自己所处的项目
                projList = []
                for (var i = 0; i < ManagerData.ProjectList.length; i++) {
                    var proj = ManagerData.ProjectList[i]
                    if (proj.UserList.IndexOfAttr(FieldName.Uid, ManagerData.CurrUser.Uid) > -1) {
                        projList.push(proj)
                        if (proj.MasterUid == ManagerData.CurrUser.Uid) {
                            ManagerData.AddMyAuth(AUTH.PROJECT_EDIT)
                        }
                    }
                }
            }
            var vue = new Vue(
                {
                    template: tpl,
                    data: {
                        newName: '',
                        auth: ManagerData.MyAuth,
                        projectList: projList,
                        currUser: ManagerData.CurrUser,
                    },
                    methods: {
                        GetDateStr: (timeStamp: number): string => {
                            return Common.TimeStamp2DateStr(timeStamp)
                        },
                        GetProjMaster: (proj: ProjectSingle): string => {
                            if (proj.MasterUid > 0) {
                                return ManagerData.UserDict[proj.MasterUid].Name
                            } else {
                                return '空'
                            }
                        },
                        OnEditMaster: (proj: ProjectSingle, user: UserSingle) => {
                            if (proj.MasterUid == ManagerData.CurrUser.Uid && !ManagerData.MyAuth[AUTH.PROJECT_LIST]) {
                                //是这个项目的负责人,并且不是超管
                                Common.ConfirmWarning(`你是这个项目现在的负责人 <br/>如果修改负责人,你将失去这个项目的管理权限`, `要将'负责人'修改为'${user.Name}'吗?`, () => {
                                    proj.MasterUid = user.Uid
                                    ManagerData.RemoveMyAuth(AUTH.PROJECT_EDIT)
                                })
                            } else {
                                proj.MasterUid = user.Uid
                            }
                        },
                        GetProjAllDeptList: (proj: ProjectSingle): DepartmentSingle[] => {
                            return ManagerData.DepartmentList
                        },
                        GetProjUserCount: (proj: ProjectSingle): number => {
                            return proj.UserList.length
                        },
                        GetProjUserCountTitle: (proj: ProjectSingle): string => {
                            var userNameArr: string[] = []
                            for (var i = 0; i < proj.UserList.length; i++) {
                                var user = proj.UserList[i]
                                userNameArr.push(user.Name)
                            }
                            return userNameArr.join(`,`)
                        },
                        onEditName: (e: Event, proj: ProjectSingle, index: number) => {
                            var newName = (e.target as HTMLInputElement).value.trim()
                            if (!newName) {
                                (e.target as HTMLInputElement).value = proj.Name
                                return
                            }
                            if (newName != proj.Name) {
                                if (ManagerData.ProjectList.IndexOfAttr(FieldName.Name, newName) > -1) {
                                    Common.AlertError(`项目名称 ${newName} 已经存在`);
                                    (e.target as HTMLInputElement).value = proj.Name;
                                    return
                                }
                                proj.Name = newName
                            }
                        },
                        onClose: () => {
                        },
                        onShowUserList: (proj: ProjectSingle, index: number) => {
                            this.ShowProjectEdit(proj, ProjectEditPage.User)
                        },
                        onShowDepartmentList: (proj: ProjectSingle, index: number) => {
                            this.ShowProjectEdit(proj, ProjectEditPage.Department)
                        },
                        onDel: (e, proj: ProjectSingle, index: int) => {
                            Common.ConfirmDelete(() => {
                                this.VueProjectList.projectList.splice(index, 1)
                            }, `即将删除项目 "${proj.Name}"`)
                        },
                        onAdd: () => {
                            var newName: string = this.VueProjectList.newName.toString().trim()
                            if (!newName) {
                                Common.AlertError(`项目名称 ${newName} 不可以为空`)
                                return
                            }
                            if (ManagerData.ProjectList.IndexOfAttr(FieldName.Name, newName) > -1) {
                                Common.AlertError(`项目名称 ${newName} 已经存在`)
                                return
                            }
                            ManagerData.ProjectList.push(
                                {
                                    Pid: ManagerData.ProjectList[this.VueProjectList.projectList.length - 1].Pid + 1,
                                    Name: this.VueProjectList.newName.toString(),
                                    MasterUid: 0, UserList: [],
                                    CreateTime: new Date().getTime(),
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
        })
    }
    ShowProjectEdit(proj: ProjectSingle, currPage: ProjectEditPage) {
        Loader.LoadVueTemplateList([`${this.VuePath}ProjectEdit`], (tplList: string[]) => {
            //TODO:
            ManagerData.DepartmentList.every((dept: DepartmentSingle): boolean => {
                dept.Pid = proj.Pid
                return true
            })
            //
            var vue = new Vue(
                {
                    template: tplList[0],
                    data: {
                        project: proj,
                        projectList: this.VueProjectList.projectList,
                        dpTree: ManagerData.DepartmentTree,
                        newName: proj ? proj.Name : '',
                        auth: ManagerData.MyAuth,
                        currPage: currPage,
                        currUser: ManagerData.CurrUser,
                    },
                    methods: {
                        onClose: function () {
                            $(this.$el).hide()
                        },
                        onShowProjList: () => {
                            $(this.VueProjectEdit.$el).hide()
                            this.ShowProjectList()
                        },
                        onShowCurrProj: () => {
                            if (this.VueProjectEdit.projectList.length == 1) {
                                //仅在只有一个项目 可以用, 多个项目就是下拉列表了
                                this.ShowProjectEdit(this.VueProjectEdit.project, ProjectEditPage.Department)
                            }
                        },
                        onShowProj: (proj: ProjectSingle, index: number) => {
                            this.ShowProjectEdit(proj, this.VueProjectEdit.currPage)
                        },
                        onShowPage: (page: ProjectEditPage) => {
                            this.VueProjectEdit.currPage = page;
                            this.ShowProjectEditPage(this.VueProjectEdit.currPage)
                        },
                    },
                }
            ).$mount()
            this.VueProjectEdit = vue
            //#show
            Common.InsertIntoPageDom(vue.$el)
            this.ShowProjectEditPage(this.VueProjectEdit.currPage)
        })
    }
    ShowProjectEditPage(currPage: ProjectEditPage) {
        switch (currPage) {
            case ProjectEditPage.User:
                this.ShowUserList(this.VueProjectEdit.project, '')
                break;
            case ProjectEditPage.Department:
                this.ShowDepartmentList(this.VueProjectEdit.project)
                break;
        }
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
                        auth: ManagerData.MyAuth,
                    },
                    methods: {
                        departmentOption: this.DepartmentOption.bind(this),
                        onEditName: (e: Event, dp: DepartmentSingle, i0: int) => {
                            var newName = (e.target as HTMLInputElement).value
                            dp.Name = newName
                        },
                        onEditPosition: (dp: DepartmentSingle, i0: int) => {
                            this.ShowPositionList(dp)
                        },
                        onEditUserList: (dept: DepartmentSingle) => {
                            this.ShowUserList(proj, dept.Name)
                        },
                        GetDeptAllPosnList: ManagerData.GetDeptAllPosnList.bind(ManagerData),
                        GetDeptUserList: ManagerData.GetDeptUserList.bind(ManagerData),
                        GetDeptAllUserList: ManagerData.GetDeptAllUserList.bind(ManagerData),
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
                        onDel: (dp: DepartmentSingle, i0: int) => {
                            Common.ConfirmDelete(() => {
                                var brothers: DepartmentSingle[] = ManagerData.GetBrotherDepartmentList(dp)
                                var brotherIndex = ArrayUtil.IndexOfAttr(brothers, FieldName.Did, dp.Did)
                                brothers.splice(brotherIndex, 1)
                                //
                                delete ManagerData.DepartmentDict[dp.Did]
                                ManagerData.RefreshAllDepartmentList()
                            }, `即将删除部门 "${dp.Name || '空'}}" 及其子部门<br/>
                            该部门及其子部门的所有职位都将被删除`)
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
                rs += '--'
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
    ShowPositionList(dept: DepartmentSingle) {
        Loader.LoadVueTemplate(this.VuePath + "PositionList", (tpl: string) => {
            var vue = new Vue(
                {
                    template: tpl,
                    data: {
                        dp: dept,
                        newName: ``,
                        allDepartmentList: ManagerData.DepartmentList,
                        auth: ManagerData.MyAuth,
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
                        /**回到部门列表 */
                        onBackDepartmentList: () => {
                            this.ShowDepartmentList(ManagerData.GetProjByPid(dept.Pid))
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
                        onEditUserList: (posn: PositionSingle) => {
                            this.ShowUserList(ManagerData.GetProjByPid(dept.Pid), posn.Name, dept, posn)
                        },
                        CheckSortDown: (pos: PositionSingle, index: int) => {
                            return index < dept.PositionList.length - 1
                        },
                        CheckSortUp: (pos: PositionSingle, index: int) => {
                            return index > 0

                        },
                        onSortDown: (pos: PositionSingle, index: int) => {
                            if (index < dept.PositionList.length - 1) {
                                dept.PositionList.splice(index + 1, 0, dept.PositionList.splice(index, 1)[0])
                            }
                        },
                        onSortUp: (pos: PositionSingle, index: int) => {
                            if (index > 0) {
                                dept.PositionList.splice(index - 1, 0, dept.PositionList.splice(index, 1)[0])
                            }
                        },
                        onDel: (e, pos: PositionSingle, index: int) => {
                            if (dept.PositionList.length == 1) {
                                Common.AlertError(`每个部门下至少要保留一个职位`)
                            } else {
                                Common.ConfirmDelete(() => {
                                    dept.PositionList.splice(index, 1)
                                }, `即将删除职位 "${pos.Name || '空'}"`)
                            }
                        },
                        onAdd: () => {
                            var pos: PositionSingle = { Posid: this.NewPositionUuid++, Did: dept.Did, Name: this.VuePositionList.newName.toString(), AuthorityList: [], UserList: [] }
                            this.VuePositionList.newName = ''
                            dept.PositionList.push(pos)
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
                    checkedChange: false,//为了让check函数被触发,
                    auth: ManagerData.MyAuth,
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
                        this.VueAuthList.$el.remove()
                        this.VueAuthList = null
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
                    }
                },
            }).$mount()
            this.VueAuthList = vue
            // $(vue.$el).alert('close');
            Common.Popup($(vue.$el))
        })
    }
    ShowUserList(proj: ProjectSingle, filterText: string, backDept: DepartmentSingle = null, backPosn: PositionSingle = null) {
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
                        auth: ManagerData.MyAuth,
                        filterText: filterText,
                        backPosn: backPosn,
                    },
                    methods: {
                        filterUserList: function (userList: UserSingle[], filterText: string): UserSingle[] {
                            var rs = userList.concat()
                            var dict: { [key: number]: boolean } = {};
                            if (filterText) {
                                var _filterText = filterText.toLowerCase().trim()
                                rs.every((user: UserSingle): boolean => {
                                    if (user.Name.toLowerCase().indexOf(_filterText) > -1) {
                                        dict[user.Uid] = true
                                    } else {
                                        if (user.Did) {
                                            var dept: DepartmentSingle = ManagerData.DepartmentDict[user.Did]
                                            if (dept.Name.toLowerCase().indexOf(_filterText) > -1) {
                                                dict[user.Uid] = true
                                            } else {
                                                for (var i = 0; i < dept.PositionList.length; i++) {
                                                    var posn = dept.PositionList[i]
                                                    if (posn.Posid == user.Posid && posn.Name.toLowerCase().indexOf(_filterText) > -1) {
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
                            return rs;
                        },
                        OnBackPosn: () => {
                            this.ShowPositionList(backDept)
                        },
                        ShowDpName: (did: number): string => {
                            var dp = ManagerData.DepartmentDict[did]
                            return dp ? dp.Name : '空'
                        },
                        ShowPosName: (did: number, posid: number): string => {
                            var dp = ManagerData.DepartmentDict[did]
                            if (dp) {
                                if (posid > 0) {
                                    var pos: PositionSingle = dp.PositionList.FindOfAttr(FieldName.Posid, posid)
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
                        onDpChange: (user: UserSingle, dept: DepartmentSingle) => {
                            ManagerData.RemoveUserPosnid(user)
                            ManagerData.SetUserPosnid(user, dept.Did)
                        },
                        onPosChange: (user: UserSingle, pos: PositionSingle) => {
                            ManagerData.RemoveUserPosnid(user)
                            ManagerData.SetUserPosnid(user, user.Did, pos.Posid)
                        },
                        onSortDown: (user: UserSingle, index: int) => {
                            if (index < proj.UserList.length - 1) {
                                proj.UserList.splice(index + 1, 0, proj.UserList.splice(index, 1)[0])
                            }
                        },
                        onSortUp: (user: UserSingle, index: int) => {
                            if (index > 0) {
                                proj.UserList.splice(index - 1, 0, proj.UserList.splice(index, 1)[0])
                            }
                        },
                        onDel: (user: UserSingle, index: int) => {
                            Common.ConfirmDelete(() => {
                                proj.UserList.splice(index, 1)
                                this.VueUserList.otherUserList = ArrayUtil.SubByAttr(ManagerData.UserList, proj.UserList, FieldName.Uid)
                            }, `即将删除成员 "${user.Name}"`)
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
        })
    }
    /**职位 - 权限列表 */

}

var ManagerManager = new ManagerManagerClass()