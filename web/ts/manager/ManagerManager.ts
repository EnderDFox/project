/** 管理项目 部门 职位 权限 */
enum ProjectEditPage {
    Department = 1,
    User = 2,
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
    VueSelectUser: CombinedVueInstance1<{ checkedChange: boolean, filterText: string }>
    Init() {
        UrlParam.Callback = this.UrlParamCallback.bind(this)
        this.InitVue(this.UrlParamCallback.bind(this))
    }
    UrlParamCallback() {
        Common.PopupHideAll()
        var pid: number = UrlParam.Get(URL_PARAM_KEY.PID, 0)
        var proj: ProjectSingle = ManagerData.GetProjectListHasAuth().FindOfAttr(FieldName.PID, pid)
        if (proj) {
            this.ShowProjectEdit()
        } else {
            this.ShowProjectList()
        }
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
    /**没有权限访问的页面 通常是通过url进入的 */
    ShowNoAuthPage() {
        //TODO:
    }
    ShowProjectList() {
        //
        Loader.LoadVueTemplate(this.VuePath + "ProjectList", (tpl: string) => {
            var vue = new Vue(
                {
                    template: tpl,
                    data: {
                        newName: '',
                        auth: ManagerData.MyAuth,
                        projectList: ManagerData.GetProjectListHasAuth(),
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
                            UrlParam.Set(URL_PARAM_KEY.PID, proj.Pid).Set(URL_PARAM_KEY.PAGE, ProjectEditPage.User).Reset()
                            this.ShowProjectEdit()
                        },
                        onShowDepartmentList: (proj: ProjectSingle, index: number) => {
                            UrlParam.Set(URL_PARAM_KEY.PID, proj.Pid).Set(URL_PARAM_KEY.PAGE, ProjectEditPage.Department).Reset()
                            this.ShowProjectEdit()
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
    ShowProjectEdit() {
        var proj: ProjectSingle = ManagerData.GetProjectListHasAuth().FindOfAttr(FieldName.PID, UrlParam.Get(URL_PARAM_KEY.PID))
        Loader.LoadVueTemplateList([`${this.VuePath}ProjectEdit`], (tplList: string[]) => {
            var currPage = UrlParam.Get(URL_PARAM_KEY.PAGE, [ProjectEditPage.Department, ProjectEditPage.User])
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
                        projectList: ManagerData.GetProjectListHasAuth(),
                        dpTree: ManagerData.DepartmentTree,
                        newName: proj ? proj.Name : '',
                        auth: ManagerData.MyAuth,
                        currPage: currPage,
                        currUser: ManagerData.CurrUser,
                    },
                    methods: {
                        onShowProjList: () => {
                            UrlParam.RemoveAll()
                            $(this.VueProjectEdit.$el).hide()
                            this.ShowProjectList()
                        },
                        onShowCurrProj: () => {
                            if (this.VueProjectEdit.projectList.length == 1) {
                                //仅在只有一个项目 可以用, 多个项目就是下拉列表了
                                UrlParam.Set(URL_PARAM_KEY.PAGE, ProjectEditPage.Department).Reset()
                                this.ShowProjectEdit()
                            }
                        },
                        onShowProj: (proj: ProjectSingle, index: number) => {
                            UrlParam.Set(URL_PARAM_KEY.PID, proj.Pid).Set(URL_PARAM_KEY.PAGE, ProjectEditPage.Department).Reset()
                            this.ShowProjectEdit()
                        },
                        onShowPage: (page: ProjectEditPage) => {
                            UrlParam.Set(URL_PARAM_KEY.PAGE, page).Remove(URL_PARAM_KEY.DID).Remove(URL_PARAM_KEY.FKEY).Reset()
                            this.VueProjectEdit.currPage = page;
                            this.ShowProjectEditPage()
                        },
                    },
                }
            ).$mount()
            this.VueProjectEdit = vue
            //#show
            Common.InsertIntoPageDom(vue.$el)
            this.ShowProjectEditPage()
        })
    }
    ShowProjectEditPage() {
        var currPage: ProjectEditPage = UrlParam.Get(URL_PARAM_KEY.PAGE, [ProjectEditPage.Department, ProjectEditPage.User])
        switch (currPage) {
            case ProjectEditPage.User:
                this.ShowUserList(this.VueProjectEdit.project)
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
                            UrlParam.Set(URL_PARAM_KEY.DID, dp.Did).Reset()
                            this.ShowPositionList()
                        },
                        onEditUserList: (dept: DepartmentSingle) => {
                            UrlParam.Set(URL_PARAM_KEY.PAGE, ProjectEditPage.User).Set(URL_PARAM_KEY.FKEY, dept.Name).Reset()
                            this.ShowUserList(proj)
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
            var _did = UrlParam.Get(URL_PARAM_KEY.DID, 0)
            if (_did && ManagerData.DepartmentDict[_did]) {
                this.ShowPositionList()
            }
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
    ShowPositionList() {
        var _did = UrlParam.Get(URL_PARAM_KEY.DID, 0)
        var dept: DepartmentSingle = ManagerData.DepartmentDict[_did]
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
                            UrlParam.Set(URL_PARAM_KEY.DID, parentDp.Did).Reset()
                            this.ShowPositionList()
                        },
                        onEditName: (e: Event, pos: PositionSingle, index: number) => {
                            var newName = (e.target as HTMLInputElement).value
                            pos.Name = newName
                        },
                        onEditAuth: (pos: PositionSingle, index: number) => {
                            this.ShowAuthList(pos)
                        },
                        onEditUserList: (posn: PositionSingle) => {
                            UrlParam.Set(URL_PARAM_KEY.PAGE, ProjectEditPage.User).Set(URL_PARAM_KEY.FKEY, posn.Name).Reset()
                            this.ShowUserList(ManagerData.GetProjByPid(dept.Pid), dept, posn)
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
            var checkedDict: { [key: number]: AuthoritySingle } = {};
            for (var i = 0; i < pos.AuthorityList.length; i++) {
                var auth: AuthoritySingle = pos.AuthorityList[i]
                checkedDict[auth.Authid] = auth
            }
            var _checkModChecked = (_, mod: AuthorityModuleSingle): boolean => {
                // console.log("[debug]", '_checkAllModSelected')
                for (var i = 0; i < mod.AuthorityList.length; i++) {
                    var auth = mod.AuthorityList[i]
                    if (!checkedDict[auth.Authid]) {
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
                        return checkedDict[auth.Authid] != null
                    },
                    onSwitchMod: (mod: AuthorityModuleSingle) => {
                        var allSelected = _checkModChecked(null, mod)
                        for (var i = 0; i < mod.AuthorityList.length; i++) {
                            var auth = mod.AuthorityList[i]
                            if (allSelected) {
                                delete checkedDict[auth.Authid]
                            } else {
                                checkedDict[auth.Authid] = auth
                            }
                        }
                        this.VueAuthList.checkedChange = !this.VueAuthList.checkedChange
                    },
                    onSwitchAuth: (e: Event, auth: AuthoritySingle) => {
                        if (checkedDict[auth.Authid]) {
                            delete checkedDict[auth.Authid]
                        } else {
                            checkedDict[auth.Authid] = auth
                        }
                        // auth.CheckedChange = !auth.CheckedChange
                        this.VueAuthList.checkedChange = !this.VueAuthList.checkedChange
                    },
                    onSave: () => {
                        pos.AuthorityList.splice(0, pos.AuthorityList.length)
                        for (var authIdStr in checkedDict) {
                            pos.AuthorityList.push(checkedDict[authIdStr])
                        }
                        this.VueAuthList.$el.remove()
                        this.VueAuthList = null
                    },
                    onReset: () => {
                        for (var authIdStr in checkedDict) {
                            delete checkedDict[authIdStr]
                        }
                        for (var i = 0; i < pos.AuthorityList.length; i++) {
                            var auth: AuthoritySingle = pos.AuthorityList[i]
                            checkedDict[auth.Authid] = auth
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
    ShowUserList(proj: ProjectSingle, backDept: DepartmentSingle = null, backPosn: PositionSingle = null) {
        var filterText = UrlParam.Get(URL_PARAM_KEY.FKEY, '')
        console.log("[debug]", filterText, ":[filterText]")
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
                            console.log("[debug]", filterText, ":[filterText]", typeof (filterText))
                            var rs = userList.concat()
                            var dict: { [key: number]: boolean } = {};
                            if (filterText) {
                                var _filterText = filterText.toString().toLowerCase().trim()
                                var _filterTextSp = _filterText.split(/[\s\,]/g)
                                rs.every((user: UserSingle): boolean => {
                                    if (StringUtil.IndexOfKeyArr(user.Name.toLowerCase(), _filterTextSp) > -1) {
                                        dict[user.Uid] = true
                                    } else {
                                        if (user.Did) {
                                            var dept: DepartmentSingle = ManagerData.DepartmentDict[user.Did]
                                            if (StringUtil.IndexOfKeyArr(dept.Name.toLowerCase(), _filterTextSp) > -1) {
                                                dict[user.Uid] = true
                                            } else {
                                                for (var i = 0; i < dept.PositionList.length; i++) {
                                                    var posn = dept.PositionList[i]
                                                    if (posn.Posid == user.Posid && StringUtil.IndexOfKeyArr(posn.Name.toLowerCase(), _filterTextSp) > -1) {
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
                            UrlParam.Set(URL_PARAM_KEY.PAGE, ProjectEditPage.Department).Set(URL_PARAM_KEY.DID, backDept.Did).Set(URL_PARAM_KEY.FKEY, null).Reset()
                            this.ShowPositionList()
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
                        onAddSelect: () => {
                            this.ShowSelectUser(proj, ArrayUtil.SubByAttr(ManagerData.UserList, proj.UserList, FieldName.Uid))
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
    /**选择 用户 */
    ShowSelectUser(proj: ProjectSingle, userList: UserSingle[]) {
        if (userList.length == 0) {
            Common.AlertWarning('所有用户都已经被添加到了这个项目中')
            return
        }
        Loader.LoadVueTemplate(this.VuePath + "SelectUser", (tpl: string) => {
            var checkedDict: { [key: number]: UserSingle } = {};
            var _GetFilterList = (userList: UserSingle[], filterText: string): UserSingle[] => {
                var _filterText = filterText.toString().toLowerCase().trim()
                if (_filterText) {
                    var _filterTextSp = _filterText.split(/[\s\,]/g)
                    return userList.filter((user: UserSingle) => {
                        if (checkedDict[user.Uid]) {
                            return true
                        }
                        return StringUtil.IndexOfKeyArr(user.Name.toLowerCase(), _filterTextSp) > -1
                    })
                } else {
                    return userList
                }
            }
            var vue = new Vue({
                template: tpl,
                data: {
                    userList: userList,
                    checkedChange: false,//为了让check函数被触发,
                    auth: ManagerData.MyAuth,
                    filterText: '',
                },
                methods: {
                    GetFilterList: _GetFilterList.bind(this),
                    checkChecked: (_, user: UserSingle) => {
                        return checkedDict[user.Uid] != null
                    },
                    onChangeChecked: (user: UserSingle) => {
                        if (checkedDict[user.Uid]) {
                            delete checkedDict[user.Uid]
                        } else {
                            checkedDict[user.Uid] = user
                        }
                        this.VueSelectUser.checkedChange = !this.VueSelectUser.checkedChange
                    },
                    OnCheckedAll: () => {
                        var _userList: UserSingle[] = _GetFilterList(userList, this.VueSelectUser.filterText)
                        var isAllCheck: boolean = true
                        for (var i = 0; i < _userList.length; i++) {
                            var user: UserSingle = _userList[i]
                            if (!checkedDict[user.Uid]) {
                                isAllCheck = false
                                break;
                            }
                        }
                        for (var i = 0; i < _userList.length; i++) {
                            var user: UserSingle = _userList[i]
                            if (isAllCheck) {
                                delete checkedDict[user.Uid]
                            } else {
                                checkedDict[user.Uid] = user
                            }
                        }
                        this.VueSelectUser.checkedChange = !this.VueSelectUser.checkedChange
                    },
                    onOk: () => {
                        for (var i = 0; i < userList.length; i++) {
                            var user: UserSingle = userList[i]
                            if (checkedDict[user.Uid]) {
                                proj.UserList.push(user)
                            }
                        }
                        $(this.VueSelectUser.$el).remove()
                    }
                },
            }).$mount()
            this.VueSelectUser = vue
            // $(vue.$el).alert('close');
            Common.Popup($(vue.$el))
        })
    }
}

var ManagerManager = new ManagerManagerClass()