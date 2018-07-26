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
    /**全部权限组 */
    AuthGroupDict: { [key: number]: AuthGroupSingle };
    //当前
    CurrUser: UserSingle
    /**我的权限 */
    MyAuth: { [key: number]: boolean } = {};
    CurrProj: ProjectSingle
    //
    NewDepartmentUuid = 100001
    NewPositionUuid = 200001
    //
    IsInit: boolean = false
    Init(data: L2C_ManageView) {
        this.IsInit = true
        this.InitAuthData(data.AuthList || [])
        this.InitUserData(data.UserList || [])
        this.InitProjData(data.ProjList || [])
        this.InitDeptData(data.DeptList || [])
        // this.InitPosnData(data.PosnList || [])
        this.InitUserDeptData(data.UserDeptList || [])
        this.InitAughGroupData(data.AuthGroupList || [])
        //
        this.InitUserAughGroupData(data.UserAuthGroupList || [])
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
            user.AuthGroupDict = {}
            this.UserDict[user.Uid] = user
        }
    }
    private InitProjData(projList: ProjectSingle[]) {
        this.ProjList = projList
        this.ProjDict = {}
        for (var i = 0; i < projList.length; i++) {
            var proj: ProjectSingle = projList[i]
            this.ProjDict[proj.Pid] = proj
            proj.UserList = []
            proj.DeptTree = []
            proj.AuthGroupList = []
            proj.MasterUid = 0;//TODO:
        }
    }
    private InitDeptData(deptList: DepartmentSingle[]) {
        this.DeptDict = {}
        for (var i = 0; i < deptList.length; i++) {
            var dept = deptList[i]
            dept.Children = []
            dept.PosnList = []
            this.DeptDict[dept.Did] = dept
        }
        //DeptDict有数据了再统一放置childre
        for (var i = 0; i < deptList.length; i++) {
            var dept = deptList[i]
            if (dept.Fid == 0) {
                this.ProjDict[dept.Pid].DeptTree.push(dept)
            } else {
                var parent = this.DeptDict[dept.Fid]
                if (parent) {//需要判断,因为可能是fid已经被删除的部门 还残留
                    parent.Children.push(dept)
                }
            }
        }
        //再重新计算深度
        for (var i = 0; i < this.ProjList.length; i++) {
            var proj = this.ProjList[i]
            this.ReCountDeptTreeDepth(proj.DeptTree)
        }
    }
    ReCountDeptTreeDepth(deptTree: DepartmentSingle[], depth = 0) {
        for (var i = 0; i < deptTree.length; i++) {
            var dept = deptTree[i]
            dept.Depth = depth
            this.ReCountDeptTreeDepth(dept.Children, depth + 1)
        }
    }
    private InitPosnData(posnList: PositionSingle[]) {
        for (var i = 0; i < posnList.length; i++) {
            var posn = posnList[i]
            this.FormatPosnSingle(posn)
            this.DeptDict[posn.Did].PosnList.push(posn)
        }
    }
    private InitUserDeptData(userDeptList: UserDeptSingle[]) {
        for (var i = 0; i < userDeptList.length; i++) {
            var rlat = userDeptList[i]
            var user = this.UserDict[rlat.Uid]
            if (user) {
                if (rlat.Pid) {
                    var proj: ProjectSingle = this.ProjDict[rlat.Pid]
                    if (proj) {
                        proj.UserList.push(user)
                        user.AuthGroupDict[proj.Pid] = {}
                        if (rlat.Posnid > 0) {
                            var [_, posn] = this.GetPosnByPosnidInDeptTree(rlat.Posnid, proj.DeptTree)
                            if (posn) {
                                posn.UserList.push(user)
                            } else {
                                //该职位可能已经被删除了
                            }
                        }
                    }
                } else {
                    //超级管理员记录 TODO:
                }
            }
        }
    }
    private InitAughGroupData(agList:AuthGroupSingle[]){
        this.AuthGroupDict = {}
        //
        agList.forEach((ag:AuthGroupSingle,index,)=>{
            this.AuthGroupDict[ag.Agid] = ag
            this.ProjDict[ag.Pid].AuthGroupList.push(ag)
        })
    }
    private InitUserAughGroupData(uagList:UserAuthGroupSingle[]){
        uagList.forEach((uag:UserAuthGroupSingle)=>{
            var user = this.UserDict[uag.Uid]
            user.AuthGroupDict[uag.Pid][uag.Agid] = uag
        })
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
        return this.ProjList.FindByKey(FIELD_NAME.Pid, pid)
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
                if (proj.UserList.IndexOfByKey(FIELD_NAME.Uid, ManageData.CurrUser.Uid) > -1) {
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
    GetBrotherDeptListByFid(fid: number): DepartmentSingle[] {
        if (fid) {
            if (ManageData.DeptDict[fid]) {
                return ManageData.DeptDict[fid].Children
            } else {
                return null
            }
        } else {//顶级部门
            return this.CurrProj.DeptTree
        }
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
        return this.GetBrotherDeptListByFid(fid)
    }
    SetUserPosnid(user: UserSingle, did: number, posnid: number) {
        var dept: DepartmentSingle = ManageData.DeptDict[did]
        user.Did = dept.Did
        var posn: PositionSingle = dept.PosnList.FindByKey(FIELD_NAME.Posnid, posnid)
        user.Posnid = posn.Posnid
        posn.UserList.push(user)
    }
    /**通过名称获取职位 */
    GetPosnByName(deptTree: DepartmentSingle[], posnName: string): PositionSingle {
        for (var i = 0; i < deptTree.length; i++) {
            var dept: DepartmentSingle = deptTree[i]
            var posn = dept.PosnList.FindByKey(FIELD_NAME.Name, posnName)
            if (posn) {
                return posn
            }
            if (dept.Children) {
                var posnChild = this.GetPosnByName(dept.Children, posnName)
                if (posnChild) {
                    return posnChild
                }
            }
        }
        return null
    }
    /* FormatDeptSingle(dept: DepartmentSingle) {

    }*/
    FormatPosnSingle(posn: PositionSingle) {
        posn.UserList == null ? posn.UserList = [] : undefined
        this.FormatPosnAuthidList(posn, posn.AuthidList)
    }
    FormatPosnAuthidList(posn: PositionSingle, authidList: uint64[]) {
        if (posn.AuthList) {
            posn.AuthList.splice(0, posn.AuthList.length)
        } else {
            posn.AuthList = []
        }
        if (authidList) {
            for (var i = 0; i < authidList.length; i++) {
                var authid = authidList[i]
                posn.AuthList.push(this.AuthDict[authid])
            }
        }
    }
    /**根据posnid获取posn */
    GetPosnByPosnid(posnid: number): [DepartmentSingle, PositionSingle] {
        for (var i = 0; i < this.ProjList.length; i++) {
            var proj = this.ProjList[i]
            var [_dept, _posn] = this.GetPosnByPosnidInDeptTree(posnid, proj.DeptTree)
            if (_dept && _posn) {
                return [_dept, _posn]
            }
        }
        return [null, null]
    }
    GetPosnByPosnidInDeptTree(posnid: number, deptTree: DepartmentSingle[]): [DepartmentSingle, PositionSingle] {
        for (var i = 0; i < deptTree.length; i++) {
            var dept = deptTree[i]
            var posn: PositionSingle = dept.PosnList.FindByKey(FIELD_NAME.Posnid, posnid)
            if (posn) {
                return [dept, posn]
            } else {
                var [_dept, _posn] = this.GetPosnByPosnidInDeptTree(posnid, dept.Children)
                if (_dept && _posn) {
                    return [_dept, _posn]
                }
            }
        }
        return [null, null]
    }
    /*职位的UserList中删除uid*/
    PosnDelUidInDeptTree(uid: number, deptTree: DepartmentSingle[]): void {
        for (var i = 0; i < deptTree.length; i++) {
            var dept = deptTree[i]
            this.PosnListDelUid(uid, dept.PosnList)
            this.PosnDelUidInDeptTree(uid, dept.Children)
        }
    }
    PosnListDelUid(uid: number, posnList: PositionSingle[]) {
        for (var i = 0; i < posnList.length; i++) {
            var posn = posnList[i]
            posn.UserList.RemoveByKey(FIELD_NAME.Uid, uid)
        }
    }
    /**设置工程userList的一些值都设置为这个工程内的 */
    FormatUserListInProj(proj: ProjectSingle) {
        for (var i = 0; i < proj.UserList.length; i++) {
            var user = proj.UserList[i]
            user.Pid = proj.Pid
        }
        //
        this.FormatUserListInDeptTree(proj.DeptTree)
    }
    private FormatUserListInDeptTree(deptTree: DepartmentSingle[]) {
        for (var i = 0; i < deptTree.length; i++) {
            var dept = deptTree[i]
            this.FormatUserListInPosnList(dept.PosnList)
            //递归子dept
            this.FormatUserListInDeptTree(dept.Children)
        }
    }
    private FormatUserListInPosnList(posnList: PositionSingle[]) {
        for (var i = 0; i < posnList.length; i++) {
            var posn = posnList[i]
            posn.UserList.every((user:UserSingle):boolean=>{
                user.Did = posn.Did
                user.Posnid = posn.Posnid
                return true
            })
        }
    }
}
var ManageData = new ManageDataClass()