class ManagerDataClass {
    /**我的权限 */
    MyAuth: { [key: number]: boolean } = {};
    ProjectList: ProjectSingle[]
    UserList: UserSingle[]
    DepartmentTree: DepartmentSingle[]
    /**all department list */
    DepartmentList: DepartmentSingle[]
    DepartmentDict: { [key: number]: DepartmentSingle }
    //
    AuthorityModuleList: AuthorityModuleSingle[]
    Init() {
        //#权限
        var urlParam = window.location.href.toLowerCase()
        var authCodeArr: number[]
        // console.log("[debug]", str)
        if (urlParam.indexOf('auth=') > -1) {
            urlParam = urlParam.split('auth=').pop().toString()
            urlParam = urlParam.split(/\&|\?/).shift().toString()
            authCodeArr = urlParam.split(",").map<number>((item: string) => { return parseInt(item) })
        } else {
            authCodeArr = []
        }
        //
        for (var i = 0; i < authCodeArr.length; i++) {
            var authCode = authCodeArr[i]
            if (Auth[authCode]) {
                this.MyAuth[authCode] = this.MyAuth[Auth[authCode]] = true
            }
        }
        Object.freeze(this.MyAuth)
        //#
        this.AuthorityModuleList = [
            {
                Modid: 1, Name: '模块A', AuthorityList: [
                    { Authid: 101, Name: '权限A1' },
                    { Authid: 102, Name: '权限A2' },
                    { Authid: 103, Name: '权限A3' },
                    { Authid: 104, Name: '权限A4' },
                    { Authid: 105, Name: '权限A5' },
                    { Authid: 106, Name: '权限A6' },
                    { Authid: 107, Name: '权限A7' },
                    { Authid: 108, Name: '权限A8' },
                    { Authid: 109, Name: '权限A9' },
                    { Authid: 110, Name: '权限A10' },
                ]
            },
            {
                Modid: 2, Name: '模块B', AuthorityList: [
                    { Authid: 21, Name: '权限B1' },
                    { Authid: 22, Name: '权限B2' },
                ]
            },
            {
                Modid: 3, Name: '模块C', AuthorityList: [
                    { Authid: 31, Name: '权限C1' },
                    { Authid: 32, Name: '权限C2' },
                    { Authid: 33, Name: '权限C3' },
                    { Authid: 34, Name: '权限C4' },
                    { Authid: 35, Name: '权限C5' },
                ]
            },
        ]
        this.InitAuthorityModuleList()
        //#project
        this.ProjectList = [
            { Pid: 1, Name: '项目A' },
            { Pid: 2, Name: '项目B' },
        ]
        //#user
        this.UserList = []
        for (var i = 0; i < 12; i++) {
            this.UserList.push({ Uid: i + 1, Name: `用户${String.fromCharCode(65 + i)}`, Did: 0, Posid: 0 })
        }
        //#
        for (var i = 0; i < this.ProjectList.length; i++) {
            var proj: ProjectSingle = this.ProjectList[i]
            proj.UserList = []
            proj.UserList.push(this.UserList[3])
            proj.UserList.push(this.UserList[5])
        }
        //#department
        this.DepartmentTree = [
            {
                Did: 1, Name: '策划', Depth: 0, Children: [], PositionList: [
                    { Posid: 100, Did: 2, Name: '策划' },
                    { Posid: 101, Did: 2, Name: '策划主管' },
                ]
            },
            {
                Did: 2, Name: '美术', Depth: 0, PositionList: [
                    { Posid: 201, Did: 2, Name: '美术主管' },
                ], Children: [
                    { Did: 21, Name: 'UI', Depth: 1, Children: [], PositionList: [{ Posid: 2102, Did: 2, Name: 'UI' },] },
                    {
                        Did: 22, Name: '3D', Depth: 1, Children: [], PositionList: [
                            { Posid: 2200, Did: 2, Name: '3D' },
                            { Posid: 2201, Did: 2, Name: '3D主管' },
                        ]
                    },
                    {
                        Did: 23, Name: '原画', Depth: 1, PositionList: [{ Posid: 301, Did: 2, Name: '原画主管' }], Children: [
                            { Did: 231, Name: '角色原画', Depth: 2, Children: [], PositionList: [{ Posid: 23100, Did: 2, Name: '角色原画' },] },
                            { Did: 232, Name: '场景原画', Depth: 2, Children: [], PositionList: [{ Posid: 23200, Did: 2, Name: '场景原画' },] },
                        ],
                    },
                ],
            },
            {
                Did: 3, Name: '后端', Depth: 0, Children: [], PositionList: [
                    { Posid: 300, Did: 2, Name: '后端' },
                    { Posid: 301, Did: 2, Name: '后端主管' },
                ]
            },
            {
                Did: 4, Name: '前端', Depth: 0, Children: [], PositionList: [
                    { Posid: 400, Did: 2, Name: '前端' },
                    { Posid: 401, Did: 2, Name: '前端主管' },
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
}
var ManagerData = new ManagerDataClass()