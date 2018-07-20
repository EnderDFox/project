class ManagerDataClass {
    /**全部AUTH */
    AuthorityModuleList: AuthorityModuleSingle[]
    AuthDict: { [key: number]: AuthoritySingle };
    //
    ProjectList: ProjectSingle[]
    /**全部user */
    UserList: UserSingle[]
    UserDict: { [key: number]: UserSingle };
    /**部门字典 */
    DeptDict: { [key: number]: DepartmentSingle };
    //
    CurrUser: UserSingle
    /**我的权限 */
    MyAuth: { [key: number]: boolean } = {};
    CurrProj: ProjectSingle
    //
    NewDepartmentUuid = 100001
    NewPositionUuid = 200001
    Init() {
        this.InitSimulateData()
        //
        var uid = Number(UrlParam.Get('uid'))
        if (isNaN(uid)) {
            uid = 0
        }
        //#权限
        switch (uid) {
            case 0:
                uid = 999999//超级管理员id
                this.AddMyAuth(AUTH.PROJECT_LIST)
                this.AddMyAuth(AUTH.PROJECT_EDIT)
                break;
        }
        //
        this.CurrUser = this.UserDict[uid]
    }
    /**初始化虚拟数据 */
    private InitSimulateData() {
        this.AuthDict = {}
        this.DeptDict = {}
        //#
        this.AuthorityModuleList = [
            {
                Modid: 1, Name: '工具管理', AuthorityList: [
                    { Authid: AUTH.PROJECT_LIST, Name: '项目列表' },
                    { Authid: AUTH.PROJECT_EDIT, Name: '所属项目' },
                    { Authid: 32, Name: '部门' },
                    { Authid: 33, Name: '职位' },
                    { Authid: 34, Name: '权限', Description: `功能,流程的修改` },
                    { Authid: 35, Name: '成员', Description: `所在部门及其子部门内所有成员的增加,修改和删除` },
                ]
            },
            {
                Modid: 11, Name: '项目模块', AuthorityList: [
                    { Authid: 1101, Name: '功能管理' },
                    { Authid: 1102, Name: '工作编辑', Description: `工作的修改` },
                    { Authid: 1103, Name: '工作评论', Description: `对已有工作进行评论` },
                    { Authid: 1121, Name: '晨会管理' },
                ]
            },
            {
                Modid: 2, Name: '所属部门管理', Description: `该员工所在部门及其子部门的管理权限`,
                AuthorityList: [
                    { Authid: 21, Name: '成员管理', Description: `所在部门及其子部门内所有成员的增加/修改/删除` },
                    { Authid: 22, Name: '职位管理' },
                    { Authid: 23, Name: '子部门管理', Description: `可以增加/修改/删除子部门` },
                    { Authid: 24, Name: '功能管理', Description: `功能/流程的修改` },
                    { Authid: 25, Name: '工作编辑', Description: `工作的修改` },
                    { Authid: 26, Name: '工作评论', Description: `对已有工作进行评论` },
                ]
            },
        ]
        this.InitAuthorityModuleList()
        //#project
        this.ProjectList = [
            {
                Pid: 1, Name: '项目A', MasterUid: 3, UserList: [], CreateTime: Common.GetOffsetDate({ Day: -33 }).getTime(),
                DeptTree: []
            },
            {
                Pid: 2, Name: '项目B', MasterUid: 0, UserList: [], CreateTime: Common.GetOffsetDate({ Day: -22 }).getTime(),
                DeptTree: [this.NewDeptManager()]
            },
            {
                Pid: 3, Name: '项目C', MasterUid: 0, UserList: [], CreateTime: Common.GetOffsetDate({ Day: -11 }).getTime(),
                DeptTree: [this.NewDeptManager()]
            },
        ]
        //#user
        this.UserList = []
        this.UserDict = {}
        for (var i = 0; i < 26; i++) {
            var user: UserSingle = { Uid: i + 1, Name: `用户${String.fromCharCode(65 + i)}`, Did: 0, Posid: 0 }
            this.UserList.push(user)
            this.UserDict[user.Uid] = user
        }
        var user: UserSingle = { Uid: 999999, Name: "admin", Did: 0, Posid: 0 }
        this.UserList.push(user)
        this.UserDict[user.Uid] = user
        //#
        this.ProjectList[0].UserList.push.apply(this.ProjectList[0].UserList, this.UserList.slice(0, 10))
        for (var i = 0; i < this.ProjectList[0].UserList.length; i++) {
            this.ProjectList[0].UserList[i].Sort = i + 1
        }
        this.ProjectList[2].UserList.push.apply(this.ProjectList[2].UserList, this.UserList.slice(5, 12))
        for (var i = 0; i < this.ProjectList[2].UserList.length; i++) {
            this.ProjectList[2].UserList[i].Sort = i + 1
        }
        //#department
        var proj: ProjectSingle = this.ProjectList[0]
        proj.DeptTree = [
            this.NewDeptManager(),
            {
                Did: 1, Fid: 0, Name: '策划', Depth: 0, Children: [],
                PositionList: [
                    { Posid: 100, Did: 2, Name: '策划', UserList: [], AuthorityList: [] },
                    { Posid: 101, Did: 2, Name: '策划主管', UserList: [], AuthorityList: [] },
                ]
            },
            {
                Did: 2, Fid: 0, Name: '美术', Depth: 0,
                PositionList: [
                    { Posid: 201, Did: 2, Name: '美术主管', UserList: [], AuthorityList: [] },
                ], Children: [
                    {
                        Did: 21, Fid: 2, Name: 'UI', Depth: 1, Children: [],
                        PositionList: [{ Posid: 2102, Did: 2, Name: 'UI', UserList: [], AuthorityList: [] },]
                    },
                    {
                        Did: 22, Fid: 2, Name: '3D', Depth: 1, Children: [],
                        PositionList: [
                            { Posid: 2200, Did: 2, Name: '3D', UserList: [], AuthorityList: [] },
                            { Posid: 2201, Did: 2, Name: '3D主管', UserList: [], AuthorityList: [] },
                        ]
                    },
                    {
                        Did: 23, Fid: 2, Name: '原画', Depth: 1,
                        PositionList: [{ Posid: 301, Did: 2, Name: '原画主管', UserList: [], AuthorityList: [] }],
                        Children: [
                            {
                                Did: 231, Fid: 23, Name: '角色原画', Depth: 2, Children: [],
                                PositionList: [{ Posid: 23100, Did: 2, Name: '角色原画', UserList: [], AuthorityList: [] },]
                            },
                            {
                                Did: 232, Fid: 23, Name: '场景原画', Depth: 2, Children: [],
                                PositionList: [{ Posid: 23200, Did: 2, Name: '场景原画', UserList: [], AuthorityList: [] },]
                            },
                        ],
                    },
                ],
            },
            {
                Did: 3, Fid: 0, Name: '后端', Depth: 0, Children: [],
                PositionList: [
                    { Posid: 300, Did: 2, Name: '后端', UserList: [], AuthorityList: [] },
                    { Posid: 301, Did: 2, Name: '后端主管', UserList: [], AuthorityList: [] },
                ]
            },
            {
                Did: 4, Fid: 0, Name: '前端', Depth: 0, Children: [],
                PositionList: [
                    { Posid: 400, Did: 2, Name: '前端', UserList: [], AuthorityList: [] },
                    { Posid: 401, Did: 2, Name: '前端主管', UserList: [], AuthorityList: [] },
                ]
            },
        ]
        //
        this.InitAllDeptDict(proj.DeptTree)
    }
    InitAuthorityModuleList() {
        var amList = this.AuthorityModuleList
        for (var i = 0; i < amList.length; i++) {
            var am = amList[i]
            am.CheckedChange = false
            for (var j = 0; j < am.AuthorityList.length; j++) {
                var auth = am.AuthorityList[j]
                this.AuthDict[auth.Authid] = auth
                auth.CheckedChange = false
            }
        }
    }
    InitAllDeptDict(deptTree: DepartmentSingle[] = null) {
        for (var i = 0; i < deptTree.length; i++) {
            var dept = deptTree[i]
            if (dept.Sort == null) {
                dept.Sort = 1
            }
            this.DeptDict[dept.Did] = dept
            if (dept.Children.length > 0) {
                this.InitAllDeptDict(dept.Children)
            }
        }
    }
    AddMyAuth(auth: AUTH) {
        this.MyAuth[auth] = this.MyAuth[AUTH[auth]] = true
        // Object.freeze(this.MyAuth)
        // Object.freeze(this.MyAuth[Auth.PROJECT_LIST])
        // Object.freeze(this.MyAuth[Auth[Auth.PROJECT_LIST])
    }
    RemoveMyAuth(auth: AUTH) {
        this.MyAuth[auth] = this.MyAuth[AUTH[auth]] = false
    }
    GetProjByPid(pid: number): ProjectSingle {
        return this.ProjectList.FindOfAttr(FieldName.PID, pid)
    }
    /**返回当前用户有权限的工程列表 */
    GetProjectListHasAuth(): ProjectSingle[] {
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
        return projList
    }

    /**得到一个proj下所有职位的list */
    GetProjAllPosnList(proj: ProjectSingle, rs: PositionSingle[] = null): PositionSingle[] {
        rs = rs || [];
        for (var i = 0; i < proj.DeptTree.length; i++) {
            var item = proj.DeptTree[i]
            this.GetDeptAllPosnList(item, rs)
        }
        return rs
    }
    /**一个部门及其子部门下所有的职位 */
    GetDeptAllPosnList(dept: DepartmentSingle, rs: PositionSingle[] = null): PositionSingle[] {
        rs = rs || [];
        rs.push.apply(rs, dept.PositionList)
        for (var i = 0; i < dept.Children.length; i++) {
            var child = dept.Children[i]
            this.GetDeptAllPosnList(child, rs)
        }
        return rs
    }
    /**一个部门下的成员,不包括子部门 */
    GetDeptUserList(dept: DepartmentSingle, rs: UserSingle[] = null): UserSingle[] {
        rs = rs || [];
        for (var i = 0; i < dept.PositionList.length; i++) {
            var posn = dept.PositionList[i]
            rs.push.apply(rs, posn.UserList)
        }
        return rs
    }
    /**一个部门及其子部门下所有的user */
    GetDeptAllUserList(dept: DepartmentSingle, rs: UserSingle[] = null): UserSingle[] {
        rs = rs || [];
        for (var i = 0; i < dept.PositionList.length; i++) {
            var posn = dept.PositionList[i]
            rs.push.apply(rs, posn.UserList)
        }
        for (var i = 0; i < dept.Children.length; i++) {
            var child = dept.Children[i]
            this.GetDeptAllUserList(child, rs)
        }
        return rs
    }
    /**获取默认的管理员部门 */
    NewDeptManager(): DepartmentSingle {
        var dept: DepartmentSingle = {
            Did: this.NewDepartmentUuid, Name: '管理部门', Fid: 0, Depth: 0,
            Sort: 0,//标记管理员部门主要靠sort=0
            Children: [],
            PositionList: [
                { Posid: this.NewPositionUuid++, Did: this.NewDepartmentUuid, Name: '制作人', UserList: [], AuthorityList: [this.AuthDict[AUTH.PROJECT_EDIT]] },
                { Posid: this.NewPositionUuid++, Did: this.NewDepartmentUuid, Name: 'PM', UserList: [], AuthorityList: [this.AuthDict[AUTH.PROJECT_EDIT]] },
                { Posid: this.NewPositionUuid++, Did: this.NewDepartmentUuid, Name: '管理员', UserList: [], AuthorityList: [this.AuthDict[AUTH.PROJECT_EDIT]] },
            ]
        }
        this.NewDepartmentUuid++
        this.DeptDict[dept.Did] = dept
        return dept
    }
    /**检测dp1是否是dp0的子孙dp */
    IsDepartmentChild(dp0: DepartmentSingle, dp1: DepartmentSingle): boolean {
        for (var i = 0; i < dp0.Children.length; i++) {
            if (dp0.Children[i].Did == dp1.Did) {
                return true
            } else {
                if (ManagerData.IsDepartmentChild(dp0.Children[i], dp1)) {
                    return true
                }
            }
        }
        return false
    }
    GetDepartmentFullNameArr(dp: DepartmentSingle): string[] {
        var rs: string[] = []
        while (dp) {
            rs.unshift(dp.Name)
            dp = this.DeptDict[dp.Fid]
        }
        return rs
    }
    /**得到一个 部门的兄弟部门数组 */
    GetBrotherDepartmentList(dp: DepartmentSingle): DepartmentSingle[] {
        if (dp.Fid) {
            return ManagerData.DeptDict[dp.Fid].Children
        } else {//顶级部门
            return this.CurrProj.DeptTree
        }
    }
    RemoveUserPosnid(user: UserSingle) {
        if (user.Did) {
            var oldDept: DepartmentSingle = ManagerData.DeptDict[user.Did]
            var oldPosn: PositionSingle = oldDept.PositionList.FindOfAttr(FieldName.Posid, user.Posid)
            if (oldPosn) {
                oldPosn.UserList.RemoveByAttr(FieldName.Uid, user.Uid)
            }
        }
    }
    SetUserPosnid(user: UserSingle, did: number, posnid: number = -1) {
        var dept: DepartmentSingle = ManagerData.DeptDict[did]
        user.Did = dept.Did
        var posn: PositionSingle
        if (posnid == -1) {
            posn = dept.PositionList[0]
        } else {
            posn = dept.PositionList.FindOfAttr(FieldName.Posid, posnid)
        }
        user.Posid = posn.Posid
        posn.UserList.push(user)
    }
}
var ManagerData = new ManagerDataClass()