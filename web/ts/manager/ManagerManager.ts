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

class ManagerManagerClass {
    UserConfig = {
        /**posn list显示子部门的职位 */
        ShownDeptChildren: true,
    }
    //
    Data: ManagerDataClass
    VuePath = "manager/"
    VueProjectList: CombinedVueInstance1<{ auth: { [key: number]: boolean }, projectList: ProjectSingle[], newName: string }>
    VueProjectEdit: CombinedVueInstance1<{ projectList: ProjectSingle[], project: ProjectSingle, newName: string, dpTree: DepartmentSingle[], currPage: ProjectEditPageIndex }>
    VueUserList: CombinedVueInstance1<{ userList: UserSingle[], otherUserList: UserSingle[], newUserUid: number, filterText: string }>
    VueDepartmentList: CombinedVueInstance1<{ newName: string }>
    VuePositionList: CombinedVueInstance1<{ newName: string }>
    VueAuthList: CombinedVueInstance1<{ checkedChange: boolean }>
    VueSelectUser: CombinedVueInstance1<{ checkedChange: boolean, filterText: string }>
    Init() {
        this.Data = ManagerData
        UrlParam.Callback = this.UrlParamCallback.bind(this)
        this.InitVue(this.UrlParamCallback.bind(this))
    }
    UrlParamCallback() {
        Common.PopupHideAll()
        var pid: number = UrlParam.Get(URL_PARAM_KEY.PID, 0)
        var proj: ProjectSingle = this.Data.GetProjectListHasAuth().FindOfAttr(FieldName.PID, pid)
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
                        this.deptList = TreeUtil.Map(ManagerData.CurrProj.DeptTree)
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
                                    this.Data.RemoveMyAuth(AUTH.PROJECT_EDIT)
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
                                if (this.Data.ProjectList.IndexOfAttr(FieldName.Name, newName) > -1) {
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
                            if (this.Data.ProjectList.IndexOfAttr(FieldName.Name, newName) > -1) {
                                Common.AlertError(`项目名称 ${newName} 已经存在`)
                                return
                            }
                            this.Data.ProjectList.push(
                                {
                                    Pid: this.Data.ProjectList[this.VueProjectList.projectList.length - 1].Pid + 1,
                                    Name: this.VueProjectList.newName.toString(),
                                    MasterUid: 0, UserList: [],
                                    CreateTime: new Date().getTime(),
                                    DeptTree: [this.Data.NewDeptManager()],
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
        var proj: ProjectSingle = this.Data.GetProjectListHasAuth().FindOfAttr(FieldName.PID, UrlParam.Get(URL_PARAM_KEY.PID))
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
                    onEditName: (e: Event, dp: DepartmentSingle, i0: int) => {
                        var newName = (e.target as HTMLInputElement).value
                        dp.Name = newName
                    },
                    onAddChild: (parentDp: DepartmentSingle, i0: int) => {
                        var dp: DepartmentSingle = {
                            Did: this.Data.NewDepartmentUuid, Name: ``, Depth: parentDp.Depth + 1, Children: [], PositionList: [
                                { Posid: this.Data.NewPositionUuid, Did: this.Data.NewDepartmentUuid, Name: ``, AuthorityList: [], UserList: [], },//给一个默认的职位
                            ],
                            Fid: parentDp.Did,
                            Sort: 1,
                        }
                        this.Data.NewDepartmentUuid++
                        this.Data.NewPositionUuid++
                        this.Data.DeptDict[dp.Did] = dp
                        parentDp.Children.push(dp)
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
                        brothers.RemoveByAttr(FieldName.Did, dept.Did)
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
                        var brotherIndex = ArrayUtil.IndexOfAttr(brothers, FieldName.Did, dp.Did)
                        var brother = brothers[brotherIndex + 1]
                        brothers.splice(brotherIndex, 1)
                        brothers.splice(brotherIndex + 1, 0, dp)
                    },
                    onSortUp: (e, dp: DepartmentSingle, i0: int) => {
                        if (!this.DeptListCheckSortUp(dp, i0)) {
                            return
                        }
                        var brothers: DepartmentSingle[] = this.Data.GetBrotherDepartmentList(dp)
                        var brotherIndex = ArrayUtil.IndexOfAttr(brothers, FieldName.Did, dp.Did)
                        brothers.splice(brotherIndex, 1)
                        brothers.splice(brotherIndex - 1, 0, dp)
                    },
                    onDel: (dp: DepartmentSingle, i0: int) => {
                        Common.ConfirmDelete(() => {
                            var brothers: DepartmentSingle[] = this.Data.GetBrotherDepartmentList(dp)
                            var brotherIndex = ArrayUtil.IndexOfAttr(brothers, FieldName.Did, dp.Did)
                            brothers.splice(brotherIndex, 1)
                            //
                            delete this.Data.DeptDict[dp.Did]
                        }, `即将删除部门 "${dp.Name || '空'}" 及其子部门<br/>
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
                            var dp: DepartmentSingle = {
                                Did: this.Data.NewDepartmentUuid, Name: this.VueDepartmentList.newName.toString(), Depth: 0, Children: [], PositionList: [
                                    {//给一个默认的职位
                                        Posid: this.Data.NewPositionUuid,
                                        Did: this.Data.NewDepartmentUuid,
                                        Name: this.VueDepartmentList.newName.toString(),
                                        AuthorityList: [],
                                        UserList: [],
                                    },
                                ],
                                Fid: 0, Sort: 1,
                            }
                            this.VueDepartmentList.newName = ''
                            this.Data.NewDepartmentUuid++
                            this.Data.NewPositionUuid++
                            this.Data.DeptDict[dp.Did] = dp
                            this.Data.CurrProj.DeptTree.push(dp)
                        },
                    },
                }
            ).$mount()
            this.VueDepartmentList = vue
            //#show
            Common.InsertIntoDom(vue.$el, this.VueProjectEdit.$refs.pageContent)
            //#drag Sortable
            var _renderTagDepthDrag = ($ele: JQuery, depth: number) => {
                console.log("[debug]",depth,":[depth]")
                var rs: string[] = []
                for (var i = 0; i < depth*2; i++) {
                    rs.push(`<span class="glyphicon glyphicon-minus" aria-hidden="true"></span>`)
                }
                console.log("[debug]",rs)
                $ele.html(rs.join(''))
            }
            var _oldDepth: number = 0;
            var opt = {
                draggable: ".list-complete-item",
                handle: ".btn-drag",
                group: 'dragGroup',
                scorll: true,
                animation: 150, //动画参数
                // ghostClass: 'sortable-ghostClass',
                chosenClass: 'sortable-chosenClass',
                onStart: (evt: SortableEvent) => {
                    var $curr: JQuery = $(evt.item)
                    $curr.find('.tag-depth').hide()
                    var dept: DepartmentSingle = this.Data.DeptDict[parseInt($(evt.item).attr(FieldName.Did))]
                    $curr.find('.tag-depth-drag').show()
                    _oldDepth = dept.Depth
                    _renderTagDepthDrag($curr.find('.tag-depth-drag'), dept.Depth)
                },
                onMove: (evt: SortableEvent) => {
                    var $curr: JQuery = $(evt.item)
                    var toDid = parseInt($(evt.to).attr(FieldName.Did))
                    var toParentDept: DepartmentSingle = this.Data.DeptDict[toDid]
                    var depth: number
                    if (toParentDept == null) {
                        depth = 0
                    } else {
                        depth = toParentDept.Depth+1
                    }
                    // if (_oldDepth != depth) {
                        _oldDepth = depth
                        _renderTagDepthDrag($curr.find('.tag-depth-drag'), depth)
                    // }
                },
                onEnd: (evt: SortableEvent) => {
                    var $curr: JQuery = $(evt.item)
                    $curr.find('.tag-depth').show()
                    $curr.find('.tag-depth-drag').hide()
                },
                onAdd: (evt: SortableEvent) => {//从一个列表挪到另一个列表
                    // console.log("[debug] onAdd:", $(evt.item).attr(FieldName.Did), $(evt.from).attr(FieldName.Did),evt.oldIndex, '->', $(evt.to).attr(FieldName.Did), evt.newIndex)
                    var dept: DepartmentSingle = this.Data.DeptDict[parseInt($(evt.item).attr(FieldName.Did))]
                    var fromBrothers = this.Data.GetBrotherDepartmentList(dept)
                    var toDid = parseInt($(evt.to).attr(FieldName.Did))
                    var toParentDept: DepartmentSingle = this.Data.DeptDict[toDid]
                    var toIndex: number = evt.newIndex
                    //
                    //从当前父tree中删除
                    var brothers: DepartmentSingle[] = this.Data.GetBrotherDepartmentList(dept)
                    brothers.RemoveByAttr(FieldName.Did, dept.Did)
                    //
                    if (toParentDept == null) {
                        //改为顶级部门
                        dept.Fid = 0
                        dept.Depth = 0
                        this.Data.CurrProj.DeptTree.splice(toIndex + 1, 0, dept)//因为顶级有个`管理部`占用了一格,因此要+1
                    } else {
                        //放到其他部门下
                        dept.Fid = toParentDept.Did
                        dept.Depth = toParentDept.Depth + 1
                        toParentDept.Children.splice(toIndex, 0, dept)
                    }
                    //子部门的深度改变
                    TreeUtil.Every(dept.Children, (child: DepartmentSingle, _, __, depthChild: number): boolean => {
                        child.Depth = dept.Depth + depthChild + 1
                        return true
                    })

                },
                onUpdate: (evt: SortableEvent) => {//在一个列表中移动
                    // console.log("[debug] onUpdate:", $(evt.item).attr(FieldName.Did), 'index:', evt.oldIndex, '->', evt.newIndex)
                    var dept: DepartmentSingle = this.Data.DeptDict[parseInt($(evt.item).attr(FieldName.Did))]
                    var fromBrothers = this.Data.GetBrotherDepartmentList(dept)
                    var fromIndex: number = evt.oldIndex
                    var toIndex: number = evt.newIndex
                    if (dept.Fid == 0) {
                        fromBrothers.splice(fromIndex + 1, 1)
                        fromBrothers.splice(toIndex + 1, 0, dept)
                    } else {
                        fromBrothers.splice(fromIndex, 1)
                        fromBrothers.splice(toIndex, 0, dept)
                    }
                }
            }
            var $listComp = $('.listComp')
            // console.log("[debug]", $('.listComp'), ":[$('.listComp').length]")
            for (var i = 1; i < $listComp.length; i++) {
                Sortable.create($listComp.get(i), opt)
            }
        })
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
        var brotherIndex = ArrayUtil.IndexOfAttr(brothers, FieldName.Did, dp.Did)
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
                    onEditName: (e: Event, dept: DepartmentSingle, pos: PositionSingle, index: number) => {
                        var newName = (e.target as HTMLInputElement).value
                        pos.Name = newName
                    },
                    onEditAuth: (dept: DepartmentSingle, pos: PositionSingle, index: number) => {
                        this.ShowAuthList(pos)
                    },
                    onEditUserList: (dept: DepartmentSingle, posn: PositionSingle) => {
                        UrlParam.Set(URL_PARAM_KEY.PAGE, ProjectEditPageIndex.User).Set(URL_PARAM_KEY.FKEY, posn.Name).Reset()
                        this.ShowUserList(dept, posn)
                    },
                    CheckSortUp: (dept: DepartmentSingle, pos: PositionSingle, index: int) => {
                        return index > 0
                    },
                    CheckSortDown: (dept: DepartmentSingle, pos: PositionSingle, index: int) => {
                        return index < dept.PositionList.length - 1
                    },
                    onSortDown: (dept: DepartmentSingle, pos: PositionSingle, index: int) => {
                        if (index < dept.PositionList.length - 1) {
                            dept.PositionList.splice(index + 1, 0, dept.PositionList.splice(index, 1)[0])
                        }
                    },
                    onSortUp: (dept: DepartmentSingle, pos: PositionSingle, index: int) => {
                        if (index > 0) {
                            dept.PositionList.splice(index - 1, 0, dept.PositionList.splice(index, 1)[0])
                        }
                    },
                    onDel: (dept: DepartmentSingle, pos: PositionSingle, index: int) => {
                        if (dept.PositionList.length == 1) {
                            Common.AlertError(`每个部门下至少要保留一个职位`)
                        } else {
                            Common.ConfirmDelete(() => {
                                dept.PositionList.splice(index, 1)
                            }, `即将删除职位 "${pos.Name || '空'}"`)
                        }
                    },
                },
            })
            var _did = UrlParam.Get(URL_PARAM_KEY.DID, 0)
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
                                var pos: PositionSingle = { Posid: this.Data.NewPositionUuid++, Did: currDept.Did, Name: this.VuePositionList.newName.toString(), AuthorityList: [], UserList: [] }
                                this.VuePositionList.newName = ''
                                currDept.PositionList.push(pos)
                            }
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
                    auth: this.Data.MyAuth,
                    pos: pos,
                    authorityModuleList: this.Data.AuthorityModuleList,
                    checkedChange: false,//为了让check函数被触发,
                },
                methods: {
                    checkModChecked: _checkModChecked.bind(this),
                    checkAuthChecked: (_, auth: AuthoritySingle): boolean => {
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
    ShowUserList(backDept: DepartmentSingle = null, backPosn: PositionSingle = null) {
        var proj: ProjectSingle = this.Data.CurrProj
        var filterText = UrlParam.Get(URL_PARAM_KEY.FKEY, '')
        this.VueProjectEdit.currPage = ProjectEditPageIndex.User
        Loader.LoadVueTemplate(this.VuePath + "UserList", (tpl: string) => {
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
                            UrlParam.Set(URL_PARAM_KEY.PAGE, ProjectEditPageIndex.Position).Set(URL_PARAM_KEY.DID, backDept.Did).Set(URL_PARAM_KEY.FKEY, null).Reset()
                            this.ShowPositionList()
                        },
                        ShowDpName: (did: number): string => {
                            var dp = this.Data.DeptDict[did]
                            return dp ? dp.Name : '空'
                        },
                        ShowPosName: (did: number, posid: number): string => {
                            var dp = this.Data.DeptDict[did]
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
                            var dp = this.Data.DeptDict[did]
                            if (dp) {
                                return dp.PositionList;
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
                        onPosChange: (user: UserSingle, pos: PositionSingle) => {
                            this.Data.RemoveUserPosnid(user)
                            this.Data.SetUserPosnid(user, user.Did, pos.Posid)
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
                            var newUser: UserSingle = ArrayUtil.FindOfAttr<PositionSingle>(this.VueUserList.otherUserList, FieldName.Uid, this.VueUserList.newUserUid)
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

var ManagerManager = new ManagerManagerClass()