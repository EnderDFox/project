var ManagerDataClass = /** @class */ (function () {
    function ManagerDataClass() {
        /**我的权限 */
        this.MyAuth = {};
    }
    ManagerDataClass.prototype.Init = function () {
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
        this.InitSimulateData();
        //
        var uid = Number(Common.UrlParamDict['uid']);
        if (isNaN(uid)) {
            uid = 0;
        }
        //#权限
        switch (uid) {
            case 0:
                uid = 999999; //超级管理员id
                this.AddMyAuth(Auth.PROJECT_LIST);
                this.AddMyAuth(Auth.PROJECT_EDIT);
                break;
        }
        //
        this.CurrUser = this.UserDict[uid];
    };
    /**初始化虚拟数据 */
    ManagerDataClass.prototype.InitSimulateData = function () {
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
                Modid: 3, Name: '所属部门管理', AuthorityList: [
                    { Authid: 31, Name: '成员管理' },
                    { Authid: 32, Name: '职位管理' },
                    { Authid: 33, Name: '子部门管理' },
                    { Authid: 34, Name: '功能管理' },
                    { Authid: 35, Name: '工作管理' },
                ]
            },
        ];
        this.InitAuthorityModuleList();
        //#project
        this.ProjectList = [
            { Pid: 1, Name: '项目A', MasterUid: 3, UserList: [] },
            { Pid: 2, Name: '项目B', MasterUid: 0, UserList: [] },
            { Pid: 3, Name: '项目C', MasterUid: 0, UserList: [] },
        ];
        //#user
        this.UserList = [];
        this.UserDict = {};
        for (var i = 0; i < 27; i++) {
            var user = { Uid: i + 1, Name: "\u7528\u6237" + String.fromCharCode(65 + i), Did: 0, Posid: 0 };
            this.UserList.push(user);
            this.UserDict[user.Uid] = user;
        }
        var user = { Uid: 999999, Name: "admin", Did: 0, Posid: 0 };
        this.UserList.push(user);
        this.UserDict[user.Uid] = user;
        //#
        this.ProjectList[0].UserList.push.apply(this.ProjectList[0].UserList, this.UserList.slice(0, 10));
        this.ProjectList[2].UserList.push.apply(this.ProjectList[2].UserList, this.UserList.slice(5, 12));
        //#department
        this.DepartmentTree = [
            /* {
                Did: -1, Name: '项目管理', Depth: 0, Children: [], PositionList: [
                    { Posid: 0, Did: -1, Name: '制作人' },
                    { Posid: 1, Did: -1, Name: '产品经理' },
                ]
            }, */
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
        ];
        //
        this.DepartmentDict = {};
        this.InitAllDepartmentDict();
        this.DepartmentList = [];
        this.GetAllDepartmentList(this.DepartmentTree, 0, this.DepartmentList);
    };
    ManagerDataClass.prototype.InitAuthorityModuleList = function () {
        var amList = this.AuthorityModuleList;
        for (var i = 0; i < amList.length; i++) {
            var am = amList[i];
            am.CheckedChange = false;
            for (var j = 0; j < am.AuthorityList.length; j++) {
                var auth = am.AuthorityList[j];
                auth.CheckedChange = false;
            }
        }
    };
    ManagerDataClass.prototype.InitAllDepartmentDict = function (dpTree) {
        if (dpTree === void 0) { dpTree = null; }
        dpTree ? null : dpTree = this.DepartmentTree;
        for (var i = 0; i < dpTree.length; i++) {
            var dp = dpTree[i];
            this.DepartmentDict[dp.Did] = dp;
            if (dp.Children.length > 0) {
                this.InitAllDepartmentDict(dp.Children);
            }
        }
    };
    ManagerDataClass.prototype.RefreshAllDepartmentList = function () {
        this.DepartmentList.splice(0, this.DepartmentList.length);
        this.GetAllDepartmentList(this.DepartmentTree, 0, this.DepartmentList);
    };
    /**把一个 部门list和每个子孙部门一起合并为一个大list */
    ManagerDataClass.prototype.GetAllDepartmentList = function (dpTree, fid, rs) {
        if (rs === void 0) { rs = []; }
        for (var i = 0; i < dpTree.length; i++) {
            var dp = dpTree[i];
            if (fid > -1) {
                dp.Fid = fid;
                dp.PositionList.every(function (pos) {
                    pos.AuthorityList = [];
                    return true;
                });
            }
            rs.push(dp);
            if (dp.Children.length > 0) {
                this.GetAllDepartmentList(dp.Children, dp.Did, rs);
            }
        }
        return rs;
    };
    /**检测dp1是否是dp0的子孙dp */
    ManagerDataClass.prototype.IsDepartmentChild = function (dp0, dp1) {
        for (var i = 0; i < dp0.Children.length; i++) {
            if (dp0.Children[i].Did == dp1.Did) {
                return true;
            }
            else {
                if (ManagerData.IsDepartmentChild(dp0.Children[i], dp1)) {
                    return true;
                }
            }
        }
        return false;
    };
    ManagerDataClass.prototype.GetDepartmentFullNameArr = function (dp) {
        var rs = [];
        while (dp) {
            rs.unshift(dp.Name);
            dp = this.DepartmentDict[dp.Fid];
        }
        return rs;
    };
    /**得到一个 部门的兄弟部门数组 */
    ManagerDataClass.prototype.GetBrotherDepartmentList = function (dp) {
        if (dp.Fid) {
            return ManagerData.DepartmentDict[dp.Fid].Children;
        }
        else { //顶级部门
            return ManagerData.DepartmentTree;
        }
    };
    ManagerDataClass.prototype.AddMyAuth = function (auth) {
        this.MyAuth[auth] = this.MyAuth[Auth[auth]] = true;
        // Object.freeze(this.MyAuth)
        // Object.freeze(this.MyAuth[Auth.PROJECT_LIST])
        // Object.freeze(this.MyAuth[Auth[Auth.PROJECT_LIST])
    };
    ManagerDataClass.prototype.RemoveMyAuth = function (auth) {
        this.MyAuth[auth] = this.MyAuth[Auth[auth]] = false;
    };
    return ManagerDataClass;
}());
var ManagerData = new ManagerDataClass();
//# sourceMappingURL=ManagerData.js.map