/** 管理项目 部门 职位 权限 */
enum ProjectEditPageIndex {
    Department = 1,
    Position = 2,
    User = 3,
}
/**部门下拉列表可用性 */
enum DeptDropdownItemEnabled {
    ENABLED = 0,
    DISABLED = 2,
    HIDE = 4,
}

class ManageManagerClass {
    UserConfig = {
        /**posn list显示子部门的职位 */
        ShownDeptChildren: true,
    }
    //
    Data: ManageDataClass
    VuePath = "manage/"
    VueProjectList: CombinedVueInstance1<{ auth: { [key: number]: boolean }, projectList: ProjectSingle[], newName: string }>
    VueProjectEdit: CombinedVueInstance1<{ projectList: ProjectSingle[], project: ProjectSingle, newName: string, dpTree: DepartmentSingle[], currPage: ProjectEditPageIndex }>
    VueUserList: CombinedVueInstance1<{ userList: UserSingle[], otherUserList: UserSingle[], newUserUid: number, filterText: string }>
    VueDepartmentList: CombinedVueInstance1<{ newName: string }>
    VuePositionList: CombinedVueInstance1<{ newName: string }>
    VueAuthList: CombinedVueInstance1<{ checkedChange: boolean }>
    VueSelectUser: CombinedVueInstance1<{ checkedChange: boolean, filterText: string }>
    Init() {
        this.RegisterPB()
        this.Data = ManageData
        UrlParam.Callback = this.UrlParamCallback.bind(this)
        this.InitVue(this.UrlParamCallback.bind(this))
    }
    RegisterPB() {
        Commond.Register(PB_CMD.MANAGE_PROJ_ADD, this.PB_ProjAdd.bind(this))
        Commond.Register(PB_CMD.MANAGE_PROJ_DEL, this.PB_ProjDel.bind(this))
        Commond.Register(PB_CMD.MANAGE_PROJ_EDIT_NAME, this.PB_ProjEditName.bind(this))
        Commond.Register(PB_CMD.MANAGE_DEPT_ADD, this.PB_DeptAdd.bind(this))
        Commond.Register(PB_CMD.MANAGE_DEPT_DEL, this.PB_DeptDel.bind(this))
        Commond.Register(PB_CMD.MANAGE_DEPT_EDIT_NAME, this.PB_DeptEditName.bind(this))
        Commond.Register(PB_CMD.MANAGE_DEPT_EDIT_SORT, this.PB_DeptEditSort.bind(this))
    }
    PB_ProjAdd(proj: ProjectSingle) {
        proj.MasterUid = 0
        proj.UserList = []
        //#因为只有一个默认的dept只处理这一个就行
        var dept = proj.DeptTree[0]
        //
        dept.Children = []
        for (var i = 0; i < dept.PosnList.length; i++) {
            this.Data.FormatPosnSingle(dept.PosnList[i])
        }
        dept.Depth = 0
        this.Data.DeptDict[dept.Did] = dept
        //#
        this.Data.ProjList.push(proj)
    }
    PB_ProjDel(data: C2L_ManageProjDel) {
        this.Data.ProjList.RemoveByKey(FieldName.PID, data.Pid)
        delete this.Data.ProjDict[data.Pid]
    }
    PB_ProjEditName(data: C2L_ManageProjEditName) {
        if (this.Data.ProjDict[data.Pid]) {
            this.Data.ProjDict[data.Pid].Name = data.Name
        }
    }
    PB_DeptAdd(dept: DepartmentSingle) {
        dept.Children = []
        for (var i = 0; i < dept.PosnList.length; i++) {
            this.Data.FormatPosnSingle(dept.PosnList[i])
        }
        //
        if (dept.Fid == 0) {
            dept.Depth = 0
            this.Data.GetProjByPid(dept.Pid).DeptTree.push(dept)
        } else {
            var parentDept: DepartmentSingle = this.Data.DeptDict[dept.Fid]
            dept.Depth = parentDept.Depth + 1
            parentDept.Children.push(dept)
        }
        this.Data.DeptDict[dept.Did] = dept
        //重新刷新排序功能
        Vue.nextTick(() => {
            this.DoDeptListSortabled()
        })
    }
    PB_DeptDel(data: C2L_ManageDeptDel) {
        for (var i = 0; i < data.DidList.length; i++) {
            var did = data.DidList[i]
            var dept: DepartmentSingle = this.Data.DeptDict[did]
            if (dept) {
                var brothers: DepartmentSingle[] = this.Data.GetBrotherDepartmentList(dept)
                if (brothers) {
                    var brotherIndex = ArrayUtil.IndexOfByKey(brothers, FieldName.Did, dept.Did)
                    brothers.splice(brotherIndex, 1)
                }
                //
                delete this.Data.DeptDict[dept.Did]
            }
        }
    }
    PB_DeptEditName(data: C2L_ManageDeptEditName) {
        var dept: DepartmentSingle = this.Data.DeptDict[data.Did]
        if (dept) {
            dept.Name = data.Name
            for (var i = 0; i < dept.PosnList.length; i++) {
                var posn = dept.PosnList[i]
                if (!posn.Name) {//空名职位 也 同步为部门名
                    posn.Name = dept.Name
                }
            }
        }
    }
    PB_DeptEditSort(data: C2L_ManageDeptEditSort) {
        var dept: DepartmentSingle = this.Data.DeptDict[data.Did]
        if (dept) {
            if (dept.Fid != data.Fid) {
                //移动到新表中
                var oldBrothers = this.Data.GetBrotherDeptListByFid(dept.Fid)
                if (oldBrothers) {
                    oldBrothers.RemoveByKey(FieldName.Did, dept.Did)//从自己的表中删除
                }
                dept.Fid = data.Fid
                //加入新列表中,后面会把它删除掉的
                var newBrothers = this.Data.GetBrotherDeptListByFid(data.Fid)
                if (newBrothers) {
                    newBrothers.push(dept)
                }
                //改深度
                if (data.Fid == 0) {
                    dept.Depth = 0
                } else {
                    var toParentDept = this.Data.DeptDict[data.Fid]
                    dept.Depth = toParentDept.Depth + 1
                }
                //子部门的深度改变
                TreeUtil.Every(dept.Children, (child: DepartmentSingle, _, __, depthChild: number): boolean => {
                    child.Depth = dept.Depth + depthChild + 1
                    return true
                })
            }
            //
            dept.Sort = data.Sort
            //
            var brothers = this.Data.GetBrotherDeptListByFid(data.Fid)
            if (brothers) {
                //目标sort之后的sort都+1
                for (var i = brothers.length - 1; i >= 0; i--) {
                    var brother: DepartmentSingle = brothers[i]
                    if (brother.Did != dept.Did && brother.Sort >= data.Sort) {
                        brother.Sort += 1
                    }
                }
                //重新排序
                brothers.sort((a, b): number => {
                    if (a.Sort < b.Sort) {
                        return -1
                    } else if (a.Sort > b.Sort) {
                        return 1
                    }
                    return 0
                })
            }
        }
    }
    //#
    UrlParamCallback() {
        Common.PopupHideAll()
        var pid: number = UrlParam.Get(URL_PARAM_KEY.PID, 0)
        var proj: ProjectSingle = this.Data.GetProjectListHasAuth().FindByKey(FieldName.PID, pid)
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
                data: () => {
                    return {
                        currUser: this.Data.CurrUser,
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
                    btnId: String,
                    btnLabel: String,
                    btnDisabled: Boolean,
                    checkItemCb: Function,
                    currDept: Object,
                },
                data: () => {
                    return {
                        deptList: this.Data.CurrProj.DeptTree,
                    }
                },
                methods: {
                    deptOption: this.DeptOption.bind(this),
                    OnBtnClick: function () {//点击时刷新列表
                        this.deptList = TreeUtil.Map(ManageData.CurrProj.DeptTree)
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
                        auth: this.Data.MyAuth,
                        currUser: this.Data.CurrUser,
                        newName: '',
                        projectList: this.Data.GetProjectListHasAuth(),
                    },
                    methods: {
                        GetDateStr: (timeStamp: number): string => {
                            return Common.TimeStamp2DateStr(timeStamp)
                        },
                        GetProjMaster: (proj: ProjectSingle): string => {
                            if (proj.MasterUid > 0) {
                                return this.Data.UserDict[proj.MasterUid].Name
                            } else {
                                return '空'
                            }
                        },
                        OnEditMaster: (proj: ProjectSingle, user: UserSingle) => {
                            if (proj.MasterUid == this.Data.CurrUser.Uid && !this.Data.MyAuth[AUTH.PROJECT_LIST]) {
                                //是这个项目的负责人,并且不是超管
                                Common.ConfirmWarning(`你是这个项目现在的负责人 <br/>如果修改负责人,你将失去这个项目的管理权限`, `要将'负责人'修改为'${user.Name}'吗?`, () => {
                                    proj.MasterUid = user.Uid
                                    this.Data.RemoveMyAuth(AUTH.PROJECT_MANAGE)
                                })
                            } else {
                                proj.MasterUid = user.Uid
                            }
                        },
                        GetProjAllDeptLength: (proj: ProjectSingle): number => {
                            return TreeUtil.Length(proj.DeptTree)
                        },
                        GetProjAllPosnLength: (proj: ProjectSingle): number => {
                            return this.Data.GetProjAllPosnList(proj).length
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
                                if (this.Data.ProjList.IndexOfByKey(FieldName.Name, newName) > -1) {
                                    Common.AlertError(`即将把项目 "${proj.Name}" 改名为 "${newName}" <br/><br/>但项目名称 "${newName}" 已经存在`);
                                    (e.target as HTMLInputElement).value = proj.Name;
                                    return
                                }
                                Common.ConfirmWarning(`即将把项目 "${proj.Name}" 改名为 "${newName}"`, null, () => {
                                    var data: C2L_ManageProjEditName = {
                                        Pid: proj.Pid,
                                        Name: newName.toString(),
                                    }
                                    WSConn.sendMsg(PB_CMD.MANAGE_PROJ_EDIT_NAME, data)
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
                                var data: C2L_ManageProjDel = {
                                    Pid: proj.Pid,
                                }
                                WSConn.sendMsg(PB_CMD.MANAGE_PROJ_DEL, data)
                            }, `即将删除项目 "${proj.Name}"`)
                        },
                        onAdd: () => {
                            var newName: string = this.VueProjectList.newName.toString().trim()
                            if (!newName) {
                                Common.AlertError(`项目名称 ${newName} 不可以为空`)
                                return
                            }
                            if (this.Data.ProjList.IndexOfByKey(FieldName.Name, newName) > -1) {
                                Common.AlertError(`项目名称 ${newName} 已经存在`)
                                return
                            }
                            var data: C2L_ManageProjAdd = {
                                Name: newName
                            }
                            this.VueProjectList.newName = ''
                            WSConn.sendMsg(PB_CMD.MANAGE_PROJ_ADD, data)
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
        var proj: ProjectSingle = this.Data.GetProjectListHasAuth().FindByKey(FieldName.PID, UrlParam.Get(URL_PARAM_KEY.PID))
        this.Data.CurrProj = proj
        Loader.LoadVueTemplateList([`${this.VuePath}ProjectEdit`], (tplList: string[]) => {
            var currPage = UrlParam.Get(URL_PARAM_KEY.PAGE, [ProjectEditPageIndex.Department, ProjectEditPageIndex.Position, ProjectEditPageIndex.User])
            TreeUtil.Every(this.Data.CurrProj.DeptTree, (dept: DepartmentSingle): boolean => {
                dept.Pid = proj.Pid
                return true
            })
            //
            var vue = new Vue(
                {
                    template: tplList[0],
                    data: {
                        auth: this.Data.MyAuth,
                        currUser: this.Data.CurrUser,
                        currPage: currPage,
                        projectList: this.Data.GetProjectListHasAuth(),
                        project: proj,
                        dpTree: this.Data.CurrProj.DeptTree,
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
        var currPage: ProjectEditPageIndex = UrlParam.Get(URL_PARAM_KEY.PAGE, [ProjectEditPageIndex.Department, ProjectEditPageIndex.Position, ProjectEditPageIndex.User])
        switch (currPage) {
            case ProjectEditPageIndex.Department:
                this.ShowDepartmentList()
                break;
            case ProjectEditPageIndex.Position:
                this.ShowPositionList()
                break;
            case ProjectEditPageIndex.User:
                this.ShowUserList()
                break;
        }
    }
    ShowDepartmentList() {
        this.VueProjectEdit.currPage = ProjectEditPageIndex.Department
        Loader.LoadVueTemplateList([`${this.VuePath}DeptList`, `${this.VuePath}DeptListComp`], (tplList: string[]) => {
            Vue.component('DeptListComp', {
                template: tplList[1],
                props: {
                    parentDept: Object,
                    deptTree: Array,
                    index: Number,
                },
                data: () => {
                    return {
                        auth: this.Data.MyAuth,
                    }
                },
                methods: {
                    GetDeptAllPosnList: this.Data.GetDeptAllPosnList.bind(this.Data),
                    GetDeptUserList: this.Data.GetDeptUserList.bind(this.Data),
                    GetDeptAllUserList: this.Data.GetDeptAllUserList.bind(this.Data),
                    CheckCanMoveParentDp: this.CheckCanMoveParentDp.bind(this),
                    CheckSortDown: this.DeptListCheckSortDown.bind(this),
                    CheckSortUp: this.DeptListCheckSortUp.bind(this),
                    onEditName: (e: Event, dept: DepartmentSingle, i0: int) => {
                        var newName = (e.target as HTMLInputElement).value.trim()
                        if (!newName) {
                            (e.target as HTMLInputElement).value = dept.Name
                            return
                        }
                        if (newName != dept.Name) {
                            if (TreeUtil.FindByKey(this.Data.CurrProj.DeptTree, FieldName.Name, newName)) {
                                Common.AlertError(`即将把部门 "${dept.Name}" 改名为 "${newName}" <br/><br/>但职位名称 "${newName}" 已经存在`);
                                (e.target as HTMLInputElement).value = dept.Name;
                                return
                            }
                            var data: C2L_ManageDeptEditName = { Did: dept.Did, Name: newName }
                            if (!dept.Name) {
                                //原本没名字
                                WSConn.sendMsg(PB_CMD.MANAGE_DEPT_EDIT_NAME, data)
                            } else {
                                Common.ConfirmWarning(`即将把部门 "${dept.Name}" 改名为 "${newName}"`, null, () => {
                                    WSConn.sendMsg(PB_CMD.MANAGE_DEPT_EDIT_NAME, data)
                                }, () => {
                                    (e.target as HTMLInputElement).value = dept.Name
                                })
                            }
                        }
                    },
                    onAddChild: (parentDp: DepartmentSingle, i0: int) => {
                        var data: C2L_ManageDeptAdd = {
                            Pid: this.Data.CurrProj.Pid,
                            Fid: parentDp.Did,
                            Name: this.VueDepartmentList.newName.toString(),
                        }
                        WSConn.sendMsg(PB_CMD.MANAGE_DEPT_ADD, data)
                    },
                    DeptDropdownCheckItemCb: (dept: DepartmentSingle, deptDropdown: DepartmentSingle): number => {
                        if (deptDropdown.Sort == 0) {
                            return DeptDropdownItemEnabled.HIDE
                        } else if (!this.CheckCanMoveParentDp(dept, deptDropdown)) {
                            return DeptDropdownItemEnabled.DISABLED
                        } else {
                            return DeptDropdownItemEnabled.ENABLED
                        }
                    },
                    onEditParentDp: (dept: DepartmentSingle, toParentDept: DepartmentSingle) => {
                        if (toParentDept == null) {
                            if (dept.Fid == 0) {
                                return//已经是顶级职位了
                            }
                        } else {
                            if (!this.CheckCanMoveParentDp(dept, toParentDept)) {
                                return
                            }
                        }
                        //从当前父tree中删除
                        var brothers: DepartmentSingle[] = this.Data.GetBrotherDepartmentList(dept)
                        brothers.RemoveByKey(FieldName.Did, dept.Did)
                        //
                        if (toParentDept == null) {
                            //改为顶级部门
                            dept.Fid = 0
                            dept.Depth = 0
                            this.Data.CurrProj.DeptTree.push(dept)
                        } else {
                            //放到其他部门下
                            dept.Fid = toParentDept.Did
                            dept.Depth = toParentDept.Depth + 1
                            toParentDept.Children.push(dept)
                        }
                        //子部门的深度改变
                        TreeUtil.Every(dept.Children, (child: DepartmentSingle, _, __, depthChild: number): boolean => {
                            child.Depth = dept.Depth + depthChild + 1
                            return true
                        })
                    },
                    onEditPosition: (dp: DepartmentSingle, i0: int) => {
                        UrlParam.Set(URL_PARAM_KEY.PAGE, ProjectEditPageIndex.Position).Set(URL_PARAM_KEY.DID, dp.Did).Reset()
                        this.ShowPositionList()
                    },
                    onEditUserList: (dept: DepartmentSingle) => {
                        UrlParam.Set(URL_PARAM_KEY.PAGE, ProjectEditPageIndex.User).Set(URL_PARAM_KEY.FKEY, dept.Name).Reset()
                        this.ShowUserList()
                    },
                    onSortDown: (e, dp: DepartmentSingle, i0: int) => {
                        if (!this.DeptListCheckSortDown(dp, i0)) {
                            return
                        }
                        var brothers: DepartmentSingle[] = this.Data.GetBrotherDepartmentList(dp)
                        var brotherIndex = ArrayUtil.IndexOfByKey(brothers, FieldName.Did, dp.Did)
                        var brother = brothers[brotherIndex + 1]
                        brothers.splice(brotherIndex, 1)
                        brothers.splice(brotherIndex + 1, 0, dp)
                    },
                    onSortUp: (e, dp: DepartmentSingle, i0: int) => {
                        if (!this.DeptListCheckSortUp(dp, i0)) {
                            return
                        }
                        var brothers: DepartmentSingle[] = this.Data.GetBrotherDepartmentList(dp)
                        var brotherIndex = ArrayUtil.IndexOfByKey(brothers, FieldName.Did, dp.Did)
                        brothers.splice(brotherIndex, 1)
                        brothers.splice(brotherIndex - 1, 0, dp)
                    },
                    onDel: (dept: DepartmentSingle, i0: int) => {
                        Common.ConfirmDelete(() => {
                            //所有子的did都拿出来发给后端
                            var didList: uint64[] = TreeUtil.Map([dept], (dept: DepartmentSingle): uint64 => {
                                return dept.Did
                            })
                            var data: C2L_ManageDeptDel = { DidList: didList }
                            WSConn.sendMsg(PB_CMD.MANAGE_DEPT_DEL, data)
                        }, `即将删除部门 "${dept.Name}" 及其子部门<br/>
                        该部门及其子部门的所有职位都将被删除`)
                    },
                }
            })
            var vue = new Vue(
                {
                    template: tplList[0],
                    data: {
                        auth: this.Data.MyAuth,
                        deptTree: this.Data.CurrProj.DeptTree,
                        newName: '',
                    },
                    filters: {
                        /**除去第一个数据后剩下的 */
                        remainDeptTree: (deptTree: DepartmentSingle[]) => {
                            return deptTree.slice(1, deptTree.length)
                        }
                    },
                    methods: {
                        onAdd: () => {
                            var newName: string = this.VueDepartmentList.newName.toString().trim()
                            if (!newName) {
                                Common.AlertError(`部门名称 ${newName} 不可以为空`)
                                return
                            }
                            if (TreeUtil.FindByKey(this.Data.CurrProj.DeptTree, FieldName.Name, newName)) {
                                Common.AlertError(`部门名称 ${newName} 已经存在`)
                                return
                            }
                            var data: C2L_ManageDeptAdd = {
                                Pid: this.Data.CurrProj.Pid,
                                Name: newName,
                            }
                            this.VueDepartmentList.newName = ''
                            WSConn.sendMsg(PB_CMD.MANAGE_DEPT_ADD, data)
                        },
                    },
                }
            ).$mount()
            this.VueDepartmentList = vue
            //#show
            Common.InsertIntoDom(vue.$el, this.VueProjectEdit.$refs.pageContent)
            //
            this.DoDeptListSortabled()
        })
    }
    /**设置可以排序 */
    private DeptListSortableArr: Sortable[]
    DoDeptListSortabled() {
        if (this.DeptListSortableArr) {
            for (var i = 0; i < this.DeptListSortableArr.length; i++) {
                var item = this.DeptListSortableArr[i]
                item.destroy()
            }
            this.DeptListSortableArr = null;
        }
        //#drag Sortable
        var _renderTagDepthDrag = ($curr: JQuery, depth: number) => {
            var $eleArr = $curr.find('.tag-depth-drag')
            for (var eleI = 0; eleI < $eleArr.length; eleI++) {
                var $ele = $($eleArr[eleI])
                var __originDepth = parseInt($ele.attr('depth'))
                var __cDepth = __originDepth + (depth - _originDepth)
                var rs: string[] = []
                for (var i = 0; i < __cDepth * 2; i++) {
                    rs.push(`<span class="glyphicon glyphicon-minus" aria-hidden="true"></span>`)
                }
                $ele.html(rs.join(''))
            }
        }
        var _originDepth: number;//托转项目原始的depth
        var _lastDepth: number = 0;//上一次render时使用的depth
        var opt = {
            draggable: ".list-complete-item",
            handle: ".btn-drag",
            group: 'dragGroup',
            scorll: true,
            // animation: 150, //动画参数
            // ghostClass: 'sortable-ghostClass',
            chosenClass: 'sortable-chosenClass',
            onStart: (evt: SortableEvent) => {
                var $curr: JQuery = $(evt.item)
                $curr.find('.tag-depth').hide()
                var dept: DepartmentSingle = this.Data.DeptDict[parseInt($(evt.item).attr(FieldName.Did))]
                $curr.find('.tag-depth-drag').show()
                _originDepth = parseInt($curr.find('.tag-depth-drag:first').attr('depth'))
                _lastDepth = dept.Depth
                _renderTagDepthDrag($curr, dept.Depth)
            },
            onMove: (evt: SortableEvent) => {
                var $curr: JQuery = $(evt.dragged)
                var dept: DepartmentSingle = this.Data.DeptDict[parseInt($curr.attr(FieldName.Did))]
                var toDid = parseInt($(evt.to).attr(FieldName.Did))
                var toParentDept: DepartmentSingle = this.Data.DeptDict[toDid]
                var depth: number
                if (toParentDept == null) {
                    depth = 0
                } else {
                    //判断目标不是自己活自己的子成员
                    if (dept.Did == toParentDept.Did || this.Data.IsDepartmentChild(dept, toParentDept)) {
                        return
                    }
                    depth = toParentDept.Depth + 1
                }
                if (_lastDepth != depth) {
                    _lastDepth = depth
                    _renderTagDepthDrag($curr, depth)
                }
            },
            onEnd: (evt: SortableEvent) => {
                var $curr: JQuery = $(evt.item)
                $curr.find('.tag-depth').show()
                $curr.find('.tag-depth-drag').hide()
            },
            onUpdate: (evt: SortableEvent) => {//在原列表中移动
                var dept: DepartmentSingle = this.Data.DeptDict[parseInt($(evt.item).attr(FieldName.Did))]
                var brothers = this.Data.GetBrotherDepartmentList(dept)
                var oldIndex = brothers.IndexOfByKey(FieldName.Did, dept.Did)
                var toIndex: number = evt.newIndex
                oldIndex += 1;
                if (dept.Fid == 0) {
                    toIndex += 1;
                }
                var toSort: number
                if (oldIndex < toIndex) {
                    //从上挪到下,则移动
                    toIndex += 1
                    if (toIndex >= brothers.length) {
                        toSort = brothers[brothers.length - 1].Sort + 1
                    } else {
                        toSort = brothers[toIndex].Sort
                    }
                } else {
                    //从下挪到上
                    toSort = brothers[toIndex].Sort
                }
                var data: C2L_ManageDeptEditSort = {
                    Did: dept.Did,
                    Fid: dept.Fid,
                    Sort: toSort,
                }
                WSConn.sendMsg(PB_CMD.MANAGE_DEPT_EDIT_SORT, data)
            },
            onAdd: (evt: SortableEvent) => {//从一个列表挪到另一个列表
                var dept: DepartmentSingle = this.Data.DeptDict[parseInt($(evt.item).attr(FieldName.Did))]
                var toParentDid = parseInt($(evt.to).attr(FieldName.Did))
                var brothers = this.Data.GetBrotherDeptListByFid(toParentDid)
                var toIndex: number = evt.newIndex
                if (toParentDid == 0) {
                    toIndex += 1;//因为顶级有个`管理部`占用了一格,因此要+1
                }
                var brother: DepartmentSingle = brothers[toIndex]
                var data: C2L_ManageDeptEditSort = {
                    Did: dept.Did,
                    Fid: toParentDid,
                    Sort: brother ? brother.Sort : brothers[brothers.length - 1].Sort,
                }
                var toParentDept = this.Data.DeptDict[toParentDid]
                console.log("[debug]", toParentDept ? toParentDept.Name : null, ":[toParentDept]")
                console.log("[debug]", data, brother ? brother.Name : null)
                WSConn.sendMsg(PB_CMD.MANAGE_DEPT_EDIT_SORT, data)
            },
        }
        var $listComp = $('.listComp')
        // console.log("[debug]", $('.listComp'), ":[$('.listComp').length]")
        this.DeptListSortableArr = []
        for (var i = 1; i < $listComp.length; i++) {
            this.DeptListSortableArr.push(Sortable.create($listComp.get(i), opt))
        }
    }
    DeptOption(dp: DepartmentSingle) {
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
    DeptListCheckSortUp(dp: DepartmentSingle, i0: int) {
        if (dp.Fid == 0) {
            if (i0 > 1) {//顶级因为有个`管理员`部门
                return true
            }
        } else {
            if (i0 > 0) {
                return true
            }
        }
        return false
    }
    DeptListCheckSortDown(dp: DepartmentSingle, i0: int) {
        var brothers: DepartmentSingle[] = this.Data.GetBrotherDepartmentList(dp)
        var brotherIndex = ArrayUtil.IndexOfByKey(brothers, FieldName.Did, dp.Did)
        if (brotherIndex < brothers.length - 1) {
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
        if (this.Data.IsDepartmentChild(dp, parentDp)) {
            return false
        }
        return true
    }
    ShowPositionList() {
        this.VueProjectEdit.currPage = ProjectEditPageIndex.Position
        Loader.LoadVueTemplateList([`${this.VuePath}PosnList`, `${this.VuePath}PosnListComp`], (tplList: string[]) => {
            Vue.component(`PosnListComp`, {
                template: tplList[1],
                props: {
                    currDept: Object,
                    dept: Object,
                    startDepth: Number,
                    shownDeptChildren: Boolean,
                },
                data: () => {
                    return {
                        auth: this.Data.MyAuth,
                    }
                },
                methods: {
                    OnEnterDept: (toDept: DepartmentSingle) => {
                        UrlParam.Set(URL_PARAM_KEY.DID, toDept.Did).Reset()
                        this.ShowPositionList()
                    },
                    onEditName: (e: Event, dept: DepartmentSingle, posn: PositionSingle, index: number) => {
                        var newName = (e.target as HTMLInputElement).value.trim()
                        if (!newName) {
                            (e.target as HTMLInputElement).value = posn.Name
                            return
                        }
                        if (newName != posn.Name) {
                            if (this.Data.GetPosnByName(this.Data.CurrProj.DeptTree, newName)) {
                                Common.AlertError(`即将把职位 "${posn.Name}" 改名为 "${newName}" <br/><br/>但职位名称 "${newName}" 已经存在`);
                                (e.target as HTMLInputElement).value = posn.Name;
                                return
                            }
                            Common.ConfirmWarning(`即将把职位 "${posn.Name}" 改名为 "${newName}"`, null, () => {
                                posn.Name = newName//TODO:
                            }, () => {
                                (e.target as HTMLInputElement).value = posn.Name
                            })
                        }
                    },
                    onEditAuth: (dept: DepartmentSingle, posn: PositionSingle, index: number) => {
                        this.ShowAuthList(posn)
                    },
                    checkDeptMgrChecked: (posn: PositionSingle) => {
                        return posn.AuthList.IndexOfByKey(FieldName.Authid, AUTH.DEPARTMENT_MANAGE) > -1
                            && posn.AuthList.IndexOfByKey(FieldName.Authid, AUTH.DEPARTMENT_PROCESS) > -1
                    },
                    onChangeDeptMgrChecked: (posn: PositionSingle) => {
                        var has = posn.AuthList.IndexOfByKey(FieldName.Authid, AUTH.DEPARTMENT_MANAGE) > -1
                            && posn.AuthList.IndexOfByKey(FieldName.Authid, AUTH.DEPARTMENT_PROCESS) > -1
                        if (has) {
                            posn.AuthList.RemoveByKey(FieldName.Authid, AUTH.DEPARTMENT_MANAGE)
                            posn.AuthList.RemoveByKey(FieldName.Authid, AUTH.DEPARTMENT_PROCESS)
                        } else {
                            posn.AuthList.push(this.Data.AuthDict[AUTH.DEPARTMENT_MANAGE])
                            posn.AuthList.push(this.Data.AuthDict[AUTH.DEPARTMENT_PROCESS])
                        }
                    },
                    onEditUserList: (dept: DepartmentSingle, posn: PositionSingle) => {
                        UrlParam.Set(URL_PARAM_KEY.PAGE, ProjectEditPageIndex.User).Set(URL_PARAM_KEY.FKEY, posn.Name).Reset()
                        this.ShowUserList(dept, posn)
                    },
                    CheckSortUp: (dept: DepartmentSingle, posn: PositionSingle, index: int) => {
                        return index > 0
                    },
                    CheckSortDown: (dept: DepartmentSingle, posn: PositionSingle, index: int) => {
                        return index < dept.PosnList.length - 1
                    },
                    onSortDown: (dept: DepartmentSingle, posn: PositionSingle, index: int) => {
                        if (index < dept.PosnList.length - 1) {
                            dept.PosnList.splice(index + 1, 0, dept.PosnList.splice(index, 1)[0])
                        }
                    },
                    onSortUp: (dept: DepartmentSingle, posn: PositionSingle, index: int) => {
                        if (index > 0) {
                            dept.PosnList.splice(index - 1, 0, dept.PosnList.splice(index, 1)[0])
                        }
                    },
                    onDel: (dept: DepartmentSingle, posn: PositionSingle, index: int) => {
                        if (dept.PosnList.length == 1) {
                            Common.AlertError(`每个部门下至少要保留一个职位`)
                        } else {
                            Common.ConfirmDelete(() => {
                                dept.PosnList.splice(index, 1)
                            }, `即将删除职位 "${posn.Name || '空'}"`)
                        }
                    },
                },
            })
            var _did = UrlParam.Get(URL_PARAM_KEY.DID, 0)
            console.log("[debug]", _did, ":[_did]")
            console.log("[debug]", this.Data.DeptDict)
            var currDept: DepartmentSingle;
            if (_did > 0) {
                currDept = this.Data.DeptDict[_did]
            } else {
                //显示全部部门
            }
            var vue = new Vue(
                {
                    template: tplList[0],
                    data: {
                        auth: this.Data.MyAuth,
                        isRoot: _did == 0,
                        currDept: currDept,
                        deptTree: currDept ? [currDept] : this.Data.CurrProj.DeptTree,
                        newName: ``,
                        startDepth: currDept ? currDept.Depth : 0,
                        userConfig: this.UserConfig,
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
                                parentDp = this.Data.DeptDict[parentDp.Fid]
                            }
                            return `<ol class="breadcrumb">
                                        ${rs.join(``)}
                                    </ol>`
                        },
                        GetEnterParentDeptTitle: (did: number): string => {
                            if (did > 0) {
                                return `回到 上级部门"${this.Data.DeptDict[did].Name}" 的职位列表`
                            } else {
                                return `回到 全部部门 的职位列表`
                            }
                        },
                        DeptDropdownCheckItemCb: (deptDropdown: DepartmentSingle) => {
                            if (currDept) {
                                if (currDept.Did == deptDropdown.Did) {
                                    return DeptDropdownItemEnabled.DISABLED
                                } else {
                                    return DeptDropdownItemEnabled.ENABLED
                                }
                            } else {
                                return DeptDropdownItemEnabled.ENABLED
                            }
                        },
                        /**回到部门列表 */
                        onBackDepartmentList: () => {
                            this.ShowDepartmentList()
                        },
                        OnToggleShownDeptChildren: () => {
                            this.UserConfig.ShownDeptChildren = !this.UserConfig.ShownDeptChildren
                        },
                        OnDeptChange: (toDept: DepartmentSingle) => {
                            UrlParam.Set(URL_PARAM_KEY.DID, toDept ? toDept.Did : 0).Reset()
                            this.ShowPositionList()
                        },
                        OnEnterDeptById: (did: number) => {
                            UrlParam.Set(URL_PARAM_KEY.DID, did).Reset()
                            this.ShowPositionList()
                        },
                        OnEnterDept: (toDept: DepartmentSingle) => {
                            UrlParam.Set(URL_PARAM_KEY.DID, toDept ? toDept.Did : 0).Reset()
                            this.ShowPositionList()
                        },
                        onAdd: () => {
                            if (currDept) {
                                var posn: PositionSingle = {
                                    Posnid: this.Data.NewPositionUuid++, Did: currDept.Did, Name: this.VuePositionList.newName.toString(), UserList: [],
                                    AuthList: currDept.Sort == 0 ? [this.Data.AuthDict[AUTH.DEPARTMENT_MANAGE]] : [],
                                }
                                this.VuePositionList.newName = ''
                                currDept.PosnList.push(posn)
                            }
                        },
                    },
                }
            ).$mount()
            console.log("[debug]", vue.deptTree, ":[vue.deptTree]")
            this.VuePositionList = vue
            //#show
            Common.InsertIntoDom(vue.$el, this.VueProjectEdit.$refs.pageContent)
        })
    }
    ShowAuthList(posn: PositionSingle) {
        Loader.LoadVueTemplate(this.VuePath + "AuthList", (tpl: string) => {
            var checkedDict: { [key: number]: AuthSingle } = {};
            for (var i = 0; i < posn.AuthList.length; i++) {
                var auth: AuthSingle = posn.AuthList[i]
                checkedDict[auth.Authid] = auth
            }
            var _checkModChecked = (_, mod: AuthModSingle): boolean => {
                // console.log("[debug]", '_checkAllModSelected')
                for (var i = 0; i < mod.AuthList.length; i++) {
                    var auth = mod.AuthList[i]
                    if (!checkedDict[auth.Authid]) {
                        return false
                    }
                }
                return true
            }
            var vue = new Vue({
                template: tpl,
                data: {
                    auth: this.Data.MyAuth,
                    posn: posn,
                    authorityModuleList: this.Data.AuthModList,
                    checkedChange: false,//为了让check函数被触发,
                },
                methods: {
                    checkModChecked: _checkModChecked.bind(this),
                    checkAuthChecked: (_, auth: AuthSingle): boolean => {
                        return checkedDict[auth.Authid] != null
                    },
                    onSwitchMod: (mod: AuthModSingle) => {
                        var allSelected = _checkModChecked(null, mod)
                        for (var i = 0; i < mod.AuthList.length; i++) {
                            var auth = mod.AuthList[i]
                            if (allSelected) {
                                delete checkedDict[auth.Authid]
                            } else {
                                checkedDict[auth.Authid] = auth
                            }
                        }
                        this.VueAuthList.checkedChange = !this.VueAuthList.checkedChange
                    },
                    onSwitchAuth: (e: Event, auth: AuthSingle) => {
                        if (checkedDict[auth.Authid]) {
                            delete checkedDict[auth.Authid]
                        } else {
                            checkedDict[auth.Authid] = auth
                        }
                        // auth.CheckedChange = !auth.CheckedChange
                        this.VueAuthList.checkedChange = !this.VueAuthList.checkedChange
                    },
                    onSave: () => {
                        posn.AuthList.splice(0, posn.AuthList.length)
                        for (var authIdStr in checkedDict) {
                            posn.AuthList.push(checkedDict[authIdStr])
                        }
                        this.VueAuthList.$el.remove()
                        this.VueAuthList = null
                    },
                    onReset: () => {
                        for (var authIdStr in checkedDict) {
                            delete checkedDict[authIdStr]
                        }
                        for (var i = 0; i < posn.AuthList.length; i++) {
                            var auth: AuthSingle = posn.AuthList[i]
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
    ShowUserList(backDept: DepartmentSingle = null, backPosn: PositionSingle = null) {
        this.VueProjectEdit.currPage = ProjectEditPageIndex.User
        Loader.LoadVueTemplate(this.VuePath + "UserList", (tpl: string) => {
            var proj: ProjectSingle = this.Data.CurrProj
            var filterText = UrlParam.Get(URL_PARAM_KEY.FKEY, '')
            var vue = new Vue(
                {
                    template: tpl,
                    data: {
                        auth: this.Data.MyAuth,
                        userList: proj.UserList,
                        otherUserList: ArrayUtil.SubByAttr(this.Data.UserList, proj.UserList, FieldName.Uid),
                        backPosn: backPosn,
                        filterText: filterText,
                        newUserUid: 0,
                    },
                    methods: {
                        filterUserList: (userList: UserSingle[], filterText: string): UserSingle[] => {
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
                            return rs;
                        },
                        OnBackPosn: () => {
                            UrlParam.Set(URL_PARAM_KEY.PAGE, ProjectEditPageIndex.Position).Set(URL_PARAM_KEY.DID, backDept.Did).Set(URL_PARAM_KEY.FKEY, null).Reset()
                            this.ShowPositionList()
                        },
                        ShowDpName: (did: number): string => {
                            var dp = this.Data.DeptDict[did]
                            return dp ? dp.Name : '空'
                        },
                        ShowPosName: (did: number, posnid: number): string => {
                            var dp = this.Data.DeptDict[did]
                            if (dp) {
                                if (posnid > 0) {
                                    var posn: PositionSingle = dp.PosnList.FindByKey(FieldName.Posnid, posnid)
                                    return posn ? posn.Name : '--'
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
                                var user: UserSingle = ArrayUtil.FindByKey(this.otherUserList, FieldName.Uid, uid) as PositionSingle
                                if (user) {
                                    return user.Name
                                }
                            }
                            return '选择新成员'
                        },
                        GetPosList: (did: number): PositionSingle[] => {
                            var dp = this.Data.DeptDict[did]
                            if (dp) {
                                return dp.PosnList;
                            } else {
                                return []
                            }
                        },
                        OnDeptChange: (user: UserSingle, dept: DepartmentSingle) => {
                            this.Data.RemoveUserPosnid(user)
                            if (dept) {
                                this.Data.SetUserPosnid(user, dept.Did)
                            }
                        },
                        onPosChange: (user: UserSingle, posn: PositionSingle) => {
                            this.Data.RemoveUserPosnid(user)
                            this.Data.SetUserPosnid(user, user.Did, posn.Posnid)
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
                                this.VueUserList.otherUserList = ArrayUtil.SubByAttr(this.Data.UserList, proj.UserList, FieldName.Uid)
                            }, `即将删除成员 "${user.Name}"`)
                        },
                        onAddSelect: () => {
                            this.ShowSelectUser(proj, ArrayUtil.SubByAttr(this.Data.UserList, proj.UserList, FieldName.Uid))
                        },
                        onAdd: () => {
                            var newUser: UserSingle = ArrayUtil.FindByKey<PositionSingle>(this.VueUserList.otherUserList, FieldName.Uid, this.VueUserList.newUserUid)
                            if (newUser) {
                                proj.UserList.push(newUser)
                                this.VueUserList.newUserUid = 0
                                this.VueUserList.otherUserList = ArrayUtil.SubByAttr(this.Data.UserList, proj.UserList, FieldName.Uid)
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
                    auth: this.Data.MyAuth,
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

var ManageManager = new ManageManagerClass()