class ManagerDataClass {
    CurrUser: UserSingle
    /**我的权限 */
    MyAuth: { [key: number]: boolean } = {};
    ProjectList: ProjectSingle[]
    UserList: UserSingle[]
    UserDict: { [key: number]: UserSingle };
    /*user 关系表 */
    UserRlat: { [key: number]: UserSingle }
    DepartmentTree: DepartmentSingle[]
    /**all department list */
    DepartmentList: DepartmentSingle[]
    DepartmentDict: { [key: number]: DepartmentSingle }
    //
    AuthorityModuleList: AuthorityModuleSingle[]
    Init() {
        /* var authCodeArr: number[]
        // console.log("[debug]", str)
        if (Common.UrlParamDict['auth']) {
            authCodeArr = Common.UrlParamDict['auth'].split(",").map<number>((item: string) => { return parseInt(item) })
        } else {
            authCodeArr = []
        } 
        //
        for (var i = 0; i < authCodeArr.length; i++) {
            var authCode = authCodeArr[i]
            if (Auth[authCode]) {
                this.MyAuth[authCode] = this.MyAuth[Auth[authCode]] = true
            }
        }*/

        //
        this.InitSimulateData()
        //
        var uid = Number(Common.UrlParamDict['uid'])
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
        //#
        this.AuthorityModuleList = [
            {
                Modid: 1, Name: '工具管理', AuthorityList: [
                    { Authid: 101, Name: '项目列表' },
                    { Authid: 102, Name: '所属项目' },
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
            { Pid: 1, Name: '项目A', MasterUid: 3, UserList: [], CreateTime: Common.GetOffsetDate({ Day: -33 }).getTime() },
            { Pid: 2, Name: '项目B', MasterUid: 0, UserList: [], CreateTime: Common.GetOffsetDate({ Day: -22 }).getTime() },
            { Pid: 3, Name: '项目C', MasterUid: 0, UserList: [], CreateTime: Common.GetOffsetDate({ Day: -11 }).getTime() },
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
        this.DepartmentTree = [
            /* {
                Did: -1, Name: '项目管理', Depth: 0, Children: [], PositionList: [
                    { Posid: 0, Did: -1, Name: '制作人' ,UserList:[] },
                    { Posid: 1, Did: -1, Name: '产品经理' ,UserList:[] },
                ]
            }, */
            {
                Did: 1, Name: '策划', Depth: 0, Children: [], PositionList: [
                    { Posid: 100, Did: 2, Name: '策划', UserList: [] },
                    { Posid: 101, Did: 2, Name: '策划主管', UserList: [] },
                ]
            },
            {
                Did: 2, Name: '美术', Depth: 0, PositionList: [
                    { Posid: 201, Did: 2, Name: '美术主管', UserList: [] },
                ], Children: [
                    { Did: 21, Name: 'UI', Depth: 1, Children: [], PositionList: [{ Posid: 2102, Did: 2, Name: 'UI', UserList: [] },] },
                    {
                        Did: 22, Name: '3D', Depth: 1, Children: [], PositionList: [
                            { Posid: 2200, Did: 2, Name: '3D', UserList: [] },
                            { Posid: 2201, Did: 2, Name: '3D主管', UserList: [] },
                        ]
                    },
                    {
                        Did: 23, Name: '原画', Depth: 1, PositionList: [{ Posid: 301, Did: 2, Name: '原画主管', UserList: [] }], Children: [
                            { Did: 231, Name: '角色原画', Depth: 2, Children: [], PositionList: [{ Posid: 23100, Did: 2, Name: '角色原画', UserList: [] },] },
                            { Did: 232, Name: '场景原画', Depth: 2, Children: [], PositionList: [{ Posid: 23200, Did: 2, Name: '场景原画', UserList: [] },] },
                        ],
                    },
                ],
            },
            {
                Did: 3, Name: '后端', Depth: 0, Children: [], PositionList: [
                    { Posid: 300, Did: 2, Name: '后端', UserList: [] },
                    { Posid: 301, Did: 2, Name: '后端主管', UserList: [] },
                ]
            },
            {
                Did: 4, Name: '前端', Depth: 0, Children: [], PositionList: [
                    { Posid: 400, Did: 2, Name: '前端', UserList: [] },
                    { Posid: 401, Did: 2, Name: '前端主管', UserList: [] },
                ]
            },
        ]
        //
        this.DepartmentDict = {}
        this.InitAllDepartmentDict()
        this.DepartmentList = []
        this.GetAllDepartmentList(this.DepartmentTree, 0, this.DepartmentList)
    }

    InitAuthorityModuleList() {
        var amList = this.AuthorityModuleList
        for (var i = 0; i < amList.length; i++) {
            var am = amList[i]
            am.CheckedChange = false
            for (var j = 0; j < am.AuthorityList.length; j++) {
                var auth = am.AuthorityList[j]
                auth.CheckedChange = false
            }
        }
    }

    InitAllDepartmentDict(dpTree: DepartmentSingle[] = null) {
        dpTree ? null : dpTree = this.DepartmentTree
        for (var i = 0; i < dpTree.length; i++) {
            var dp = dpTree[i]
            this.DepartmentDict[dp.Did] = dp
            if (dp.Children.length > 0) {
                this.InitAllDepartmentDict(dp.Children)
            }
        }
    }
    RefreshAllDepartmentList() {
        this.DepartmentList.splice(0, this.DepartmentList.length)
        this.GetAllDepartmentList(this.DepartmentTree, 0, this.DepartmentList)
    }
    /**把一个 部门list和每个子孙部门一起合并为一个大list */
    GetAllDepartmentList(dpTree: DepartmentSingle[], fid: number, rs: DepartmentSingle[] = []): DepartmentSingle[] {
        for (var i = 0; i < dpTree.length; i++) {
            var dp = dpTree[i]
            if (fid > -1) {
                dp.Fid = fid;
                dp.PositionList.every((pos: PositionSingle) => {
                    pos.AuthorityList = []
                    return true
                })
            }
            rs.push(dp)
            if (dp.Children.length > 0) {
                this.GetAllDepartmentList(dp.Children, dp.Did, rs)
            }
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
    GetProjByPid(pid: number): ProjectSingle {
        return this.ProjectList.FindOfAttr(FieldName.PID, pid)
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
            dp = this.DepartmentDict[dp.Fid]
        }
        return rs
    }
    /**得到一个 部门的兄弟部门数组 */
    GetBrotherDepartmentList(dp: DepartmentSingle): DepartmentSingle[] {
        if (dp.Fid) {
            return ManagerData.DepartmentDict[dp.Fid].Children
        } else {//顶级部门
            return ManagerData.DepartmentTree
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
    RemoveUserPosnid(user: UserSingle) {
        if (user.Did) {
            var oldDept: DepartmentSingle = ManagerData.DepartmentDict[user.Did]
            var oldPosn: PositionSingle = oldDept.PositionList.FindOfAttr(FieldName.Posid, user.Posid)
            if (oldPosn) {
                oldPosn.UserList.RemoveByAttr(FieldName.Uid, user.Uid)
            }
        }
    }
    SetUserPosnid(user: UserSingle, did: number, posnid: number = -1) {
        var dept: DepartmentSingle = ManagerData.DepartmentDict[did]
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