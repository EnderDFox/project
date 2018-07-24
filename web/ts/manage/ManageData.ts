class ManageDataClass {
    /**全部AUTH */
    AuthModList: AuthModSingle[]
    AuthModDict: { [key: number]: AuthModSingle };
    AuthDict: { [key: number]: AuthSingle };
    //全部
    ProjList: ProjectSingle[]
    ProjDict: { [key: number]: ProjectSingle }
    /**全部user */
    UserList: UserSingle[]
    UserDict: { [key: number]: UserSingle };
    /**全部部门字典 */
    DeptDict: { [key: number]: DepartmentSingle };
    //当前
    CurrUser: UserSingle
    /**我的权限 */
    MyAuth: { [key: number]: boolean } = {};
    CurrProj: ProjectSingle
    //
    NewDepartmentUuid = 100001
    NewPositionUuid = 200001
    Init(data: L2C_ManageView) {
        this.InitAuthData(data.AuthList)
        this.InitUserData(data.UserList)
        this.InitProjData(data.ProjList)
        this.InitDeptData(data.DeptList)
        this.InitPosnData(data.PosnList)
        // this.InitDeptData(data.PosnList)
        // this.InitDeptData(data.PosnList)
        //
        var uid = Number(UrlParam.Get('uid'))
        if (isNaN(uid)) {
            uid = 0
        }
        //#权限
        switch (uid) {
            case 0:
                uid = 67//超级管理员id
                this.AddMyAuth(AUTH.PROJECT_LIST)
                this.AddMyAuth(AUTH.PROJECT_MANAGE)
                break;
        }
        //
        this.CurrUser = this.UserDict[uid]
    }
    private InitAuthData(authList: AuthSingle[]) {
        //# auth module
        this.AuthModList = [
            {
                Modid: 10, Name: '后台管理', Description: `包括 部门 职位 权限修改等`, AuthList: [],
                CheckedChange: false,
            },
            {
                Modid: 20, Name: '工作管理', Description: `包括 模块 流程 工作 评价等`, AuthList: [],
                CheckedChange: false,
            },
        ]
        //#
        this.AuthModDict = {}
        for (var i = 0; i < this.AuthModList.length; i++) {
            var am = this.AuthModList[i]
            this.AuthModDict[am.Modid] = am
        }
        //#
        this.AuthDict = {}
        for (var i = 0; i < authList.length; i++) {
            var auth: AuthSingle = authList[i]
            auth.CheckedChange = false
            this.AuthDict[auth.Authid] = auth
            if (auth.Modid > 0) {//Modid=0是顶级权限
                this.AuthModDict[auth.Modid].AuthList.push(auth)
            }
        }
    }
    private InitUserData(userList: UserSingle[]) {
        //#user
        this.UserList = userList
        this.UserDict = {}
        for (var i = 0; i < this.UserList.length; i++) {
            var user: UserSingle = this.UserList[i]
            user.Did = 0
            user.Posnid = 0
            this.UserDict[user.Uid] = user
        }
    }
    private InitProjData(projList: ProjectSingle[]) {
        this.ProjList = projList
        this.ProjDict = {}
        for (var i = 0; i < projList.length; i++) {
            var proj: ProjectSingle = projList[i]
            this.ProjDict[proj.Pid] = proj
            proj.DeptTree = []
            proj.UserList = []
            proj.MasterUid = 0;//TODO:
        }
        //# TODO:
        this.ProjList[0].UserList.push.apply(this.ProjList[0].UserList, this.UserList.slice(0, 10))
        for (var i = 0; i < this.ProjList[0].UserList.length; i++) {
            this.ProjList[0].UserList[i].Sort = i + 1
        }
    }
    private InitDeptData(deptList: DepartmentSingle[]) {
        this.DeptDict = {}
        for (var i = 0; i < deptList.length; i++) {
            var dept = deptList[i]
            dept.Children = []
            dept.PosnList = []
            this.DeptDict[dept.Did] = dept
            if (dept.Fid == 0) {
                dept.Depth = 0
                this.ProjDict[dept.Pid].DeptTree.push(dept)
            } else {
                dept.Depth = this.DeptDict[dept.Fid].Depth + 1
                this.DeptDict[dept.Fid].Children.push(dept)
            }
        }
    }
    private InitPosnData(posnList: PositionSingle[]) {
        for (var i = 0; i < posnList.length; i++) {
            var posn = posnList[i]
            posn.AuthList = []
            posn.UserList = []
            this.DeptDict[posn.Did].PosnList.push(posn)
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
        return this.ProjList.FindByKey(FieldName.PID, pid)
    }
    /**返回当前用户有权限的工程列表 */
    GetProjectListHasAuth(): ProjectSingle[] {
        var projList: ProjectSingle[];
        if (ManageData.MyAuth[AUTH.PROJECT_LIST]) {
            projList = ManageData.ProjList
        } else {
            //只看自己所处的项目
            projList = []
            for (var i = 0; i < ManageData.ProjList.length; i++) {
                var proj = ManageData.ProjList[i]
                if (proj.UserList.IndexOfByKey(FieldName.Uid, ManageData.CurrUser.Uid) > -1) {
                    projList.push(proj)
                    if (proj.MasterUid == ManageData.CurrUser.Uid) {
                        ManageData.AddMyAuth(AUTH.PROJECT_MANAGE)
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
        rs.push.apply(rs, dept.PosnList)
        for (var i = 0; i < dept.Children.length; i++) {
            var child = dept.Children[i]
            this.GetDeptAllPosnList(child, rs)
        }
        return rs
    }
    /**一个部门下的成员,不包括子部门 */
    GetDeptUserList(dept: DepartmentSingle, rs: UserSingle[] = null): UserSingle[] {
        rs = rs || [];
        for (var i = 0; i < dept.PosnList.length; i++) {
            var posn = dept.PosnList[i]
            rs.push.apply(rs, posn.UserList)
        }
        return rs
    }
    /**一个部门及其子部门下所有的user */
    GetDeptAllUserList(dept: DepartmentSingle, rs: UserSingle[] = null): UserSingle[] {
        rs = rs || [];
        for (var i = 0; i < dept.PosnList.length; i++) {
            var posn = dept.PosnList[i]
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
            Did: this.NewDepartmentUuid, Name: '管理部', Fid: 0, Depth: 0,
            Sort: 0,//标记管理员部门主要靠sort=0
            Children: [],
            PosnList: [
                {
                    Posnid: this.NewPositionUuid++, Did: this.NewDepartmentUuid, Name: '制作人', UserList: [],
                    AuthList: [this.AuthDict[AUTH.PROJECT_MANAGE], this.AuthDict[AUTH.DEPARTMENT_MANAGE]]
                },
                {
                    Posnid: this.NewPositionUuid++, Did: this.NewDepartmentUuid, Name: 'PM', UserList: [],
                    AuthList: [this.AuthDict[AUTH.PROJECT_MANAGE], this.AuthDict[AUTH.DEPARTMENT_MANAGE]]
                },
                {
                    Posnid: this.NewPositionUuid++, Did: this.NewDepartmentUuid, Name: '管理员', UserList: [],
                    AuthList: [this.AuthDict[AUTH.PROJECT_MANAGE], this.AuthDict[AUTH.DEPARTMENT_MANAGE]]
                },
            ]
        }
        this.NewDepartmentUuid++
        this.DeptDict[dept.Did] = dept
        return dept
    }
    /**检测childDept是否是parentDept的子孙dept */
    IsDepartmentChild(parentDept: DepartmentSingle, childDept: DepartmentSingle): boolean {
        for (var i = 0; i < parentDept.Children.length; i++) {
            if (parentDept.Children[i].Did == childDept.Did) {
                return true
            } else {
                if (ManageData.IsDepartmentChild(parentDept.Children[i], childDept)) {
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
    GetBrotherDepartmentList(did: number): DepartmentSingle[];
    GetBrotherDepartmentList(dp: DepartmentSingle): DepartmentSingle[];
    GetBrotherDepartmentList(...args: any[]): DepartmentSingle[] {
        var fid: number;
        if (typeof (args[0]) == 'number' || typeof (args[0]) == 'string') {
            fid = parseInt(args[0])
        } else {
            fid = (args[0] as DepartmentSingle).Fid
        }
        if (fid) {
            return ManageData.DeptDict[fid].Children
        } else {//顶级部门
            return this.CurrProj.DeptTree
        }
    }
    RemoveUserPosnid(user: UserSingle) {
        if (user.Did) {
            var oldDept: DepartmentSingle = ManageData.DeptDict[user.Did]
            var oldPosn: PositionSingle = oldDept.PosnList.FindByKey(FieldName.Posnid, user.Posnid)
            if (oldPosn) {
                oldPosn.UserList.RemoveByKey(FieldName.Uid, user.Uid)
            }
        }
    }
    SetUserPosnid(user: UserSingle, did: number, posnid: number = -1) {
        var dept: DepartmentSingle = ManageData.DeptDict[did]
        user.Did = dept.Did
        var posn: PositionSingle
        if (posnid == -1) {
            posn = dept.PosnList[0]
        } else {
            posn = dept.PosnList.FindByKey(FieldName.Posnid, posnid)
        }
        user.Posnid = posn.Posnid
        posn.UserList.push(user)
    }
}
var ManageData = new ManageDataClass()