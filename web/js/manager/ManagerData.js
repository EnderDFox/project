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
        var uid = Number(UrlParam.Get('uid'));
        if (isNaN(uid)) {
            uid = 0;
        }
        //#权限
        switch (uid) {
            case 0:
                uid = 999999; //超级管理员id
                this.AddMyAuth(AUTH.PROJECT_LIST);
                this.AddMyAuth(AUTH.PROJECT_EDIT);
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
                Modid: 1, Name: '工具管理', AuthorityList: [
                    { Authid: 101, Name: '项目列表' },
                    { Authid: 102, Name: '所属项目' },
                    { Authid: 32, Name: '部门' },
                    { Authid: 33, Name: '职位' },
                    { Authid: 34, Name: '权限', Description: "\u529F\u80FD,\u6D41\u7A0B\u7684\u4FEE\u6539" },
                    { Authid: 35, Name: '成员', Description: "\u6240\u5728\u90E8\u95E8\u53CA\u5176\u5B50\u90E8\u95E8\u5185\u6240\u6709\u6210\u5458\u7684\u589E\u52A0,\u4FEE\u6539\u548C\u5220\u9664" },
                ]
            },
            {
                Modid: 11, Name: '项目模块', AuthorityList: [
                    { Authid: 1101, Name: '功能管理' },
                    { Authid: 1102, Name: '工作编辑', Description: "\u5DE5\u4F5C\u7684\u4FEE\u6539" },
                    { Authid: 1103, Name: '工作评论', Description: "\u5BF9\u5DF2\u6709\u5DE5\u4F5C\u8FDB\u884C\u8BC4\u8BBA" },
                    { Authid: 1121, Name: '晨会管理' },
                ]
            },
            {
                Modid: 2, Name: '所属部门管理', Description: "\u8BE5\u5458\u5DE5\u6240\u5728\u90E8\u95E8\u53CA\u5176\u5B50\u90E8\u95E8\u7684\u7BA1\u7406\u6743\u9650",
                AuthorityList: [
                    { Authid: 21, Name: '成员管理', Description: "\u6240\u5728\u90E8\u95E8\u53CA\u5176\u5B50\u90E8\u95E8\u5185\u6240\u6709\u6210\u5458\u7684\u589E\u52A0/\u4FEE\u6539/\u5220\u9664" },
                    { Authid: 22, Name: '职位管理' },
                    { Authid: 23, Name: '子部门管理', Description: "\u53EF\u4EE5\u589E\u52A0/\u4FEE\u6539/\u5220\u9664\u5B50\u90E8\u95E8" },
                    { Authid: 24, Name: '功能管理', Description: "\u529F\u80FD/\u6D41\u7A0B\u7684\u4FEE\u6539" },
                    { Authid: 25, Name: '工作编辑', Description: "\u5DE5\u4F5C\u7684\u4FEE\u6539" },
                    { Authid: 26, Name: '工作评论', Description: "\u5BF9\u5DF2\u6709\u5DE5\u4F5C\u8FDB\u884C\u8BC4\u8BBA" },
                ]
            },
        ];
        this.InitAuthorityModuleList();
        //#project
        this.ProjectList = [
            { Pid: 1, Name: '项目A', MasterUid: 3, UserList: [], CreateTime: Common.GetOffsetDate({ Day: -33 }).getTime() },
            { Pid: 2, Name: '项目B', MasterUid: 0, UserList: [], CreateTime: Common.GetOffsetDate({ Day: -22 }).getTime() },
            { Pid: 3, Name: '项目C', MasterUid: 0, UserList: [], CreateTime: Common.GetOffsetDate({ Day: -11 }).getTime() },
        ];
        //#user
        this.UserList = [];
        this.UserDict = {};
        for (var i = 0; i < 26; i++) {
            var user = { Uid: i + 1, Name: "\u7528\u6237" + String.fromCharCode(65 + i), Did: 0, Posid: 0 };
            this.UserList.push(user);
            this.UserDict[user.Uid] = user;
        }
        var user = { Uid: 999999, Name: "admin", Did: 0, Posid: 0 };
        this.UserList.push(user);
        this.UserDict[user.Uid] = user;
        //#
        this.ProjectList[0].UserList.push.apply(this.ProjectList[0].UserList, this.UserList.slice(0, 10));
        for (var i = 0; i < this.ProjectList[0].UserList.length; i++) {
            this.ProjectList[0].UserList[i].Sort = i + 1;
        }
        this.ProjectList[2].UserList.push.apply(this.ProjectList[2].UserList, this.UserList.slice(5, 12));
        for (var i = 0; i < this.ProjectList[2].UserList.length; i++) {
            this.ProjectList[2].UserList[i].Sort = i + 1;
        }
        //#department
        this.DepartmentTree = [
            /* {
                Did: -1, Name: '项目管理', Depth: 0, Children: [],
                PositionList: [
                    { Posid: 0, Did: -1, Name: '制作人' ,UserList:[] },
                    { Posid: 1, Did: -1, Name: '产品经理' ,UserList:[] },
                ]
            }, */
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
        ];
        //
        this.DepartmentDict = {};
        this.InitAllDepartmentDict();
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
    /**返回当前用户有权限的工程列表 */
    ManagerDataClass.prototype.GetProjectListHasAuth = function () {
        var projList;
        if (ManagerData.MyAuth[AUTH.PROJECT_LIST]) {
            projList = ManagerData.ProjectList;
        }
        else {
            //只看自己所处的项目
            projList = [];
            for (var i = 0; i < ManagerData.ProjectList.length; i++) {
                var proj = ManagerData.ProjectList[i];
                if (proj.UserList.IndexOfAttr(FieldName.Uid, ManagerData.CurrUser.Uid) > -1) {
                    projList.push(proj);
                    if (proj.MasterUid == ManagerData.CurrUser.Uid) {
                        ManagerData.AddMyAuth(AUTH.PROJECT_EDIT);
                    }
                }
            }
        }
        return projList;
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
    /**得到一个proj下所有职位的list */
    ManagerDataClass.prototype.GetProjAllPosnList = function (proj, rs) {
        if (rs === void 0) { rs = null; }
        rs = rs || [];
        for (var i = 0; i < this.DepartmentTree.length; i++) {
            var item = this.DepartmentTree[i];
            this.GetDeptAllPosnList(item, rs);
        }
        return rs;
    };
    /**一个部门及其子部门下所有的职位 */
    ManagerDataClass.prototype.GetDeptAllPosnList = function (dept, rs) {
        if (rs === void 0) { rs = null; }
        rs = rs || [];
        rs.push.apply(rs, dept.PositionList);
        for (var i = 0; i < dept.Children.length; i++) {
            var child = dept.Children[i];
            this.GetDeptAllPosnList(child, rs);
        }
        return rs;
    };
    /**一个部门下的成员,不包括子部门 */
    ManagerDataClass.prototype.GetDeptUserList = function (dept, rs) {
        if (rs === void 0) { rs = null; }
        rs = rs || [];
        for (var i = 0; i < dept.PositionList.length; i++) {
            var posn = dept.PositionList[i];
            rs.push.apply(rs, posn.UserList);
        }
        return rs;
    };
    /**一个部门及其子部门下所有的user */
    ManagerDataClass.prototype.GetDeptAllUserList = function (dept, rs) {
        if (rs === void 0) { rs = null; }
        rs = rs || [];
        for (var i = 0; i < dept.PositionList.length; i++) {
            var posn = dept.PositionList[i];
            rs.push.apply(rs, posn.UserList);
        }
        for (var i = 0; i < dept.Children.length; i++) {
            var child = dept.Children[i];
            this.GetDeptAllUserList(child, rs);
        }
        return rs;
    };
    ManagerDataClass.prototype.GetProjByPid = function (pid) {
        return this.ProjectList.FindOfAttr(FieldName.PID, pid);
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
        this.MyAuth[auth] = this.MyAuth[AUTH[auth]] = true;
        // Object.freeze(this.MyAuth)
        // Object.freeze(this.MyAuth[Auth.PROJECT_LIST])
        // Object.freeze(this.MyAuth[Auth[Auth.PROJECT_LIST])
    };
    ManagerDataClass.prototype.RemoveMyAuth = function (auth) {
        this.MyAuth[auth] = this.MyAuth[AUTH[auth]] = false;
    };
    ManagerDataClass.prototype.RemoveUserPosnid = function (user) {
        if (user.Did) {
            var oldDept = ManagerData.DepartmentDict[user.Did];
            var oldPosn = oldDept.PositionList.FindOfAttr(FieldName.Posid, user.Posid);
            if (oldPosn) {
                oldPosn.UserList.RemoveByAttr(FieldName.Uid, user.Uid);
            }
        }
    };
    ManagerDataClass.prototype.SetUserPosnid = function (user, did, posnid) {
        if (posnid === void 0) { posnid = -1; }
        var dept = ManagerData.DepartmentDict[did];
        user.Did = dept.Did;
        var posn;
        if (posnid == -1) {
            posn = dept.PositionList[0];
        }
        else {
            posn = dept.PositionList.FindOfAttr(FieldName.Posid, posnid);
        }
        user.Posid = posn.Posid;
        posn.UserList.push(user);
    };
    return ManagerDataClass;
}());
var ManagerData = new ManagerDataClass();
//# sourceMappingURL=ManagerData.js.map