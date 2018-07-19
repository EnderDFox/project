/** 管理项目 部门 职位 权限 */
enum ProjectEditPageIndex {
    Department = 1,
    Position = 2,
    User = 3,
}

class ManagerManagerClass {
    VuePath = "manager/"
    VueProjectList: CombinedVueInstance1<{ auth: { [key: number]: boolean }, projectList: ProjectSingle[], newName: string }>
    VueProjectEdit: CombinedVueInstance1<{ projectList: ProjectSingle[], project: ProjectSingle, newName: string, dpTree: DepartmentSingle[], currPage: ProjectEditPageIndex }>
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
        Loader.LoadVueTemplateList([`${this.VuePath}NavbarComp`, `${this.VuePath}DeptDropdownComp`], (tplList: string[]) => {
            //注册组件
            Vue.component('NavbarComp', {
                template: tplList[0],
                props: {
                },
                data: function () {
                    return {
                        currUser: ManagerData.CurrUser,
                    }
                },
                methods: {
                    OnShowProjList: () => {
                        if (this.VueProjectEdit) {
                            $(this.VueProjectEdit.$el).remove()
                        }
                        UrlParam.RemoveAll().Reset()
                        this.ShowProjectList()
                    },
                }
            })
            Vue.component('DeptDropdownComp', {
                template: tplList[1],
                props: {
                    // deptList: Array,
                    buttonId: String,
                    buttonLabel: String,
                    CheckItemCb: Function,
                },
                data: function () {
                    return {
                        deptList: ManagerData.DepartmentTree,
                    }
                },
                methods: {
                    departmentOption: this.DepartmentOption.bind(this),
                    OnButtonClick: function () {//点击时刷新列表
                        this.deptList = TreeUtil.Map(ManagerData.DepartmentTree)
                    },
                }
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
                        auth: ManagerData.MyAuth,
                        currUser: ManagerData.CurrUser,
                        newName: '',
                        projectList: ManagerData.GetProjectListHasAuth(),
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
                        GetProjAllDeptLength: (proj: ProjectSingle): number => {
                            return TreeUtil.Length(ManagerData.DepartmentTree)
                        },
                        GetProjAllPosnLength: (proj: ProjectSingle): number => {
                            console.log("[debug]", "This GetProjAllPosnLength")
                            return ManagerData.GetProjAllPosnList(proj).length
                        },
                        GetProjUserLength: (proj: ProjectSingle): number => {
                            return proj.UserList.length
                        },
                        GetProjUserListTitle: (proj: ProjectSingle): string => {
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
                                    Common.AlertError(`即将把项目 "${proj.Name}" 改名为 "${newName}" <br/><br/>但项目名称 "${newName}" 已经存在`);
                                    (e.target as HTMLInputElement).value = proj.Name;
                                    return
                                }
                                Common.ConfirmWarning(`即将把项目 "${proj.Name}" 改名为 "${newName}"`, null, () => {
                                    proj.Name = newName
                                }, () => {
                                    (e.target as HTMLInputElement).value = proj.Name
                                })
                            }
                        },
                        onClose: () => {
                        },
                        onShowDepartmentList: (proj: ProjectSingle, index: number) => {
                            UrlParam.Set(URL_PARAM_KEY.PID, proj.Pid).Set(URL_PARAM_KEY.PAGE, ProjectEditPageIndex.Department).Reset()
                            this.ShowProjectEdit()
                        },
                        onShowPosnList: (proj: ProjectSingle, index: number) => {
                            UrlParam.Set(URL_PARAM_KEY.PID, proj.Pid).Set(URL_PARAM_KEY.PAGE, ProjectEditPageIndex.Position).Reset()
                            this.ShowProjectEdit()
                        },
                        onShowUserList: (proj: ProjectSingle, index: number) => {
                            UrlParam.Set(URL_PARAM_KEY.PID, proj.Pid).Set(URL_PARAM_KEY.PAGE, ProjectEditPageIndex.User).Reset()
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
            var currPage = UrlParam.Get(URL_PARAM_KEY.PAGE, [ProjectEditPageIndex.Department, ProjectEditPageIndex.User])
            TreeUtil.Every(ManagerData.DepartmentTree, (dept: DepartmentSingle): boolean => {
                dept.Pid = proj.Pid
                return true
            })
            //
            var vue = new Vue(
                {
                    template: tplList[0],
                    data: {
                        auth: ManagerData.MyAuth,
                        currUser: ManagerData.CurrUser,
                        currPage: currPage,
                        projectList: ManagerData.GetProjectListHasAuth(),
                        project: proj,
                        dpTree: ManagerData.DepartmentTree,
                        newName: proj ? proj.Name : '',
                    },
                    methods: {
                        onShowCurrProj: () => {
                            if (this.VueProjectEdit.projectList.length == 1) {
                                //仅在只有一个项目 可以用, 多个项目就是下拉列表了
                                UrlParam.Set(URL_PARAM_KEY.PAGE, ProjectEditPageIndex.Department).Reset()
                                this.ShowProjectEdit()
                            }
                        },
                        onShowProj: (proj: ProjectSingle, index: number) => {
                            UrlParam.Set(URL_PARAM_KEY.PID, proj.Pid).Set(URL_PARAM_KEY.PAGE, ProjectEditPageIndex.Department).Reset()
                            this.ShowProjectEdit()
                        },
                        onShowPage: (page: ProjectEditPageIndex) => {
                            UrlParam.Set(URL_PARAM_KEY.PAGE, page).Remove(URL_PARAM_KEY.DID).Remove(URL_PARAM_KEY.FKEY).Reset()
                            this.VueProjectEdit.currPage = page;
                            this.SwitchProjectEditPageContent()
                        },
                    },
                }
            ).$mount()
            this.VueProjectEdit = vue
            //#show
            Common.InsertIntoPageDom(vue.$el)
            this.SwitchProjectEditPageContent()
        })
    }
    SwitchProjectEditPageContent() {
        var currPage: ProjectEditPageIndex = UrlParam.Get(URL_PARAM_KEY.PAGE, [ProjectEditPageIndex.Department, ProjectEditPageIndex.User])
        switch (currPage) {
            case ProjectEditPageIndex.User:
                this.ShowUserList(this.VueProjectEdit.project)
                break;
            case ProjectEditPageIndex.User:
                this.ShowPositionList()
                break;
            case ProjectEditPageIndex.Department:
                this.ShowDepartmentList(this.VueProjectEdit.project)
                break;
        }
    }
    ShowDepartmentList(proj: ProjectSingle) {
        this.VueProjectEdit.currPage = ProjectEditPageIndex.Department
        Loader.LoadVueTemplateList([`${this.VuePath}DeptList`, `${this.VuePath}DeptListComp`], (tplList: string[]) => {
            Vue.component('DeptListComp', {
                template: tplList[1],
                props: {
                    deptTree: Array,
                    index: Number,
                },
                data: function () {
                    return {
                        auth: ManagerData.MyAuth,
                        allDepartmentList: ManagerData.DepartmentTree,
                    }
                },
                methods: {
                    GetDeptAllPosnList: ManagerData.GetDeptAllPosnList.bind(ManagerData),
                    GetDeptUserList: ManagerData.GetDeptUserList.bind(ManagerData),
                    GetDeptAllUserList: ManagerData.GetDeptAllUserList.bind(ManagerData),
                    CheckCanMoveParentDp: this.CheckCanMoveParentDp.bind(this),
                    CheckSortDown: this.CheckSortDown.bind(this),
                    CheckSortUp: this.CheckSortUp.bind(this),
                    onEditName: (e: Event, dp: DepartmentSingle, i0: int) => {
                        var newName = (e.target as HTMLInputElement).value
                        dp.Name = newName
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
                    },
                    onEditParentDp1: (...args) => {
                        console.log("[debug]", args)
                    },
                    onEditParentDp: (dp: DepartmentSingle, parentDp: DepartmentSingle) => {
                        if (parentDp == null) {
                            if (dp.Fid == 0) {
                                return//已经是顶级职位了
                            }
                        } else {
                            if (!this.CheckCanMoveParentDp(dp, parentDp)) {
                                return
                            }
                        }
                        //从当前父tree中删除
                        var brothers: DepartmentSingle[] = ManagerData.GetBrotherDepartmentList(dp)
                        brothers.RemoveByAttr(FieldName.Did, dp.Did)
                        //
                        if (parentDp == null) {
                            //改为顶级部门
                            dp.Fid = 0
                            dp.Depth = 0
                            ManagerData.DepartmentTree.push(dp)
                        } else {
                            //放到其他部门下
                            dp.Fid = parentDp.Did
                            dp.Depth = parentDp.Depth + 1
                            parentDp.Children.push(dp)
                        }
                        //子部门的深度改变
                        TreeUtil.Every(dp.Children, (child: DepartmentSingle, _, __, depthChild: number): boolean => {
                            child.Depth = dp.Depth + depthChild + 1
                            return true
                        })
                    },
                    onEditPosition: (dp: DepartmentSingle, i0: int) => {
                        UrlParam.Set(URL_PARAM_KEY.DID, dp.Did).Reset()
                        this.ShowPositionList()
                    },
                    onEditUserList: (dept: DepartmentSingle) => {
                        UrlParam.Set(URL_PARAM_KEY.PAGE, ProjectEditPageIndex.User).Set(URL_PARAM_KEY.FKEY, dept.Name).Reset()
                        this.ShowUserList(proj)
                    },
                    onSortDown: (e, dp: DepartmentSingle, i0: int) => {
                        if (!this.CheckSortDown(dp, i0)) {
                            return
                        }
                        var brothers: DepartmentSingle[] = ManagerData.GetBrotherDepartmentList(dp)
                        var brotherIndex = ArrayUtil.IndexOfAttr(brothers, FieldName.Did, dp.Did)
                        var brother = brothers[brotherIndex + 1]
                        brothers.splice(brotherIndex, 1)
                        brothers.splice(brotherIndex + 1, 0, dp)
                    },
                    onSortUp: (e, dp: DepartmentSingle, i0: int) => {
                        if (!this.CheckSortUp(dp, i0)) {
                            return
                        }
                        var brothers: DepartmentSingle[] = ManagerData.GetBrotherDepartmentList(dp)
                        var brotherIndex = ArrayUtil.IndexOfAttr(brothers, FieldName.Did, dp.Did)
                        brothers.splice(brotherIndex, 1)
                        brothers.splice(brotherIndex - 1, 0, dp)
                    },
                    onDel: (dp: DepartmentSingle, i0: int) => {
                        Common.ConfirmDelete(() => {
                            var brothers: DepartmentSingle[] = ManagerData.GetBrotherDepartmentList(dp)
                            var brotherIndex = ArrayUtil.IndexOfAttr(brothers, FieldName.Did, dp.Did)
                            brothers.splice(brotherIndex, 1)
                            //
                            delete ManagerData.DepartmentDict[dp.Did]
                        }, `即将删除部门 "${dp.Name || '空'}" 及其子部门<br/>
                        该部门及其子部门的所有职位都将被删除`)
                    },
                }
            })
            var vue = new Vue(
                {
                    template: tplList[0],
                    data: {
                        auth: ManagerData.MyAuth,
                        deptTree: ManagerData.DepartmentTree,
                        allDepartmentList: ManagerData.DepartmentTree,
                        newName: '',
                    },
                    methods: {
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
                        },
                    },
                }
            ).$mount()
            this.VueDepartmentList = vue
            //#show
            Common.InsertIntoDom(vue.$el, this.VueProjectEdit.$refs.pageContent)
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
    /**是否可以移动到 目标部门 */
    CheckCanMoveParentDp(dp: DepartmentSingle, parentDp: DepartmentSingle) {
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
                        auth: ManagerData.MyAuth,
                        allDepartmentList: ManagerData.DepartmentTree,
                        dp: dept,
                        newName: ``,
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
                        OnDeptChange: (toDept: DepartmentSingle) => {
                            UrlParam.Set(URL_PARAM_KEY.DID, toDept.Did).Reset()
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
                            UrlParam.Set(URL_PARAM_KEY.PAGE, ProjectEditPageIndex.User).Set(URL_PARAM_KEY.FKEY, posn.Name).Reset()
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
            Common.InsertIntoDom(vue.$el, this.VueProjectEdit.$refs.pageContent)
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
                    auth: ManagerData.MyAuth,
                    pos: pos,
                    authorityModuleList: ManagerData.AuthorityModuleList,
                    checkedChange: false,//为了让check函数被触发,
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
        this.VueProjectEdit.currPage = ProjectEditPageIndex.User
        Loader.LoadVueTemplate(this.VuePath + "UserList", (tpl: string) => {
            var vue = new Vue(
                {
                    template: tpl,
                    data: {
                        auth: ManagerData.MyAuth,
                        userList: proj.UserList,
                        otherUserList: ArrayUtil.SubByAttr(ManagerData.UserList, proj.UserList, FieldName.Uid),
                        allDepartmentList: ManagerData.DepartmentTree,
                        backPosn: backPosn,
                        filterText: filterText,
                        newUserUid: 0,
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
                            UrlParam.Set(URL_PARAM_KEY.PAGE, ProjectEditPageIndex.Department).Set(URL_PARAM_KEY.DID, backDept.Did).Set(URL_PARAM_KEY.FKEY, null).Reset()
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
                        OnDeptChange: (user: UserSingle, dept: DepartmentSingle) => {
                            ManagerData.RemoveUserPosnid(user)
                            if (dept) {
                                ManagerData.SetUserPosnid(user, dept.Did)
                            }
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
            Common.InsertIntoDom(vue.$el, this.VueProjectEdit.$refs.pageContent)
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
                    auth: ManagerData.MyAuth,
                    userList: userList,
                    filterText: '',
                    checkedChange: false,//为了让check函数被触发,
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