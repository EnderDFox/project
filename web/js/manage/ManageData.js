var ManageDataClass = /** @class */ (function () {
    function ManageDataClass() {
        /**我的权限 */
        this.MyAuth = {};
        //
        this.NewDepartmentUuid = 100001;
        this.NewPositionUuid = 200001;
    }
    ManageDataClass.prototype.Init = function (data) {
        this.InitAuthData(data.AuthList);
        this.InitUserData(data.UserList);
        this.InitProjData(data.ProjList);
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
                uid = 67; //超级管理员id
                this.AddMyAuth(AUTH.PROJECT_LIST);
                this.AddMyAuth(AUTH.PROJECT_MANAGE);
                break;
        }
        //
        this.CurrUser = this.UserDict[uid];
    };
    ManageDataClass.prototype.InitAuthData = function (authList) {
        //# auth module
        this.AuthModList = [
            {
                Modid: 10, Name: '后台管理', Description: "\u5305\u62EC \u90E8\u95E8 \u804C\u4F4D \u6743\u9650\u4FEE\u6539\u7B49", AuthorityList: [],
                CheckedChange: false,
            },
            {
                Modid: 20, Name: '工作管理', Description: "\u5305\u62EC \u6A21\u5757 \u6D41\u7A0B \u5DE5\u4F5C \u8BC4\u4EF7\u7B49", AuthorityList: [],
                CheckedChange: false,
            },
        ];
        //#
        this.AuthModDict = {};
        for (var i = 0; i < this.AuthModList.length; i++) {
            var am = this.AuthModList[i];
            this.AuthModDict[am.Modid] = am;
        }
        //#
        this.AuthDict = {};
        for (var i = 0; i < authList.length; i++) {
            var auth = authList[i];
            auth.CheckedChange = false;
            this.AuthDict[auth.Authid] = auth;
            if (auth.Modid > 0) { //Modid=0是顶级权限
                this.AuthModDict[auth.Modid].AuthorityList.push(auth);
            }
        }
    };
    ManageDataClass.prototype.InitUserData = function (userList) {
        //#user
        this.UserList = userList;
        this.UserDict = {};
        for (var i = 0; i < this.UserList.length; i++) {
            var user = this.UserList[i];
            user.Did = 0;
            user.Posnid = 0;
            this.UserDict[user.Uid] = user;
        }
    };
    ManageDataClass.prototype.InitProjData = function (projList) {
        this.ProjList = projList;
        for (var i = 0; i < projList.length; i++) {
            var proj = projList[i];
            proj.UserList = [];
            proj.DeptTree = [];
            proj.MasterUid = 0; //TODO:
        }
        //# TODO:
        this.ProjList[0].UserList.push.apply(this.ProjList[0].UserList, this.UserList.slice(0, 10));
        for (var i = 0; i < this.ProjList[0].UserList.length; i++) {
            this.ProjList[0].UserList[i].Sort = i + 1;
        }
    };
    /**初始化虚拟数据 */
    ManageDataClass.prototype.InitSimulateData = function () {
        this.DeptDict = {};
        //#department
        var proj = this.ProjList[0];
        proj.DeptTree = [
            this.NewDeptManager(),
            {
                Did: 1, Fid: 0, Name: '策划', Depth: 0, Children: [],
                PositionList: [
                    { Posnid: 100, Did: 2, Name: '策划', UserList: [], AuthorityList: [] },
                    { Posnid: 101, Did: 2, Name: '策划主管', UserList: [], AuthorityList: [] },
                ]
            },
            {
                Did: 2, Fid: 0, Name: '美术', Depth: 0,
                PositionList: [
                    { Posnid: 201, Did: 2, Name: '美术主管', UserList: [], AuthorityList: [] },
                ], Children: [
                    {
                        Did: 21, Fid: 2, Name: 'UI', Depth: 1, Children: [],
                        PositionList: [{ Posnid: 2102, Did: 2, Name: 'UI', UserList: [], AuthorityList: [] },]
                    },
                    {
                        Did: 22, Fid: 2, Name: '3D', Depth: 1, Children: [],
                        PositionList: [
                            { Posnid: 2200, Did: 2, Name: '3D主管', UserList: [], AuthorityList: [] },
                            { Posnid: 2201, Did: 2, Name: '3D建模', UserList: [], AuthorityList: [] },
                            { Posnid: 2202, Did: 2, Name: '3D渲染', UserList: [], AuthorityList: [] },
                            { Posnid: 2203, Did: 2, Name: '3D动作', UserList: [], AuthorityList: [] },
                        ]
                    },
                    {
                        Did: 23, Fid: 2, Name: '原画', Depth: 1,
                        PositionList: [{ Posnid: 301, Did: 2, Name: '原画主管', UserList: [], AuthorityList: [] }],
                        Children: [
                            {
                                Did: 231, Fid: 23, Name: '角色原画', Depth: 2, Children: [],
                                PositionList: [{ Posnid: 23100, Did: 2, Name: '角色原画', UserList: [], AuthorityList: [] },]
                            },
                            {
                                Did: 232, Fid: 23, Name: '场景原画', Depth: 2, Children: [],
                                PositionList: [{ Posnid: 23200, Did: 2, Name: '场景原画', UserList: [], AuthorityList: [] },]
                            },
                        ],
                    },
                ],
            },
            {
                Did: 3, Fid: 0, Name: '后端', Depth: 0, Children: [],
                PositionList: [
                    { Posnid: 300, Did: 2, Name: '后端', UserList: [], AuthorityList: [] },
                    { Posnid: 301, Did: 2, Name: '后端主管', UserList: [], AuthorityList: [] },
                ]
            },
            {
                Did: 4, Fid: 0, Name: '前端', Depth: 0, Children: [],
                PositionList: [
                    { Posnid: 400, Did: 2, Name: '前端', UserList: [], AuthorityList: [] },
                    { Posnid: 401, Did: 2, Name: '前端主管', UserList: [], AuthorityList: [] },
                ]
            },
        ];
        //
        this.InitAllDeptDict(proj.DeptTree);
    };
    ManageDataClass.prototype.InitAllDeptDict = function (deptTree) {
        if (deptTree === void 0) { deptTree = null; }
        for (var i = 0; i < deptTree.length; i++) {
            var dept = deptTree[i];
            if (dept.Sort == null) {
                dept.Sort = 1;
            }
            this.DeptDict[dept.Did] = dept;
            if (dept.Children.length > 0) {
                this.InitAllDeptDict(dept.Children);
            }
        }
    };
    ManageDataClass.prototype.AddMyAuth = function (auth) {
        this.MyAuth[auth] = this.MyAuth[AUTH[auth]] = true;
        // Object.freeze(this.MyAuth)
        // Object.freeze(this.MyAuth[Auth.PROJECT_LIST])
        // Object.freeze(this.MyAuth[Auth[Auth.PROJECT_LIST])
    };
    ManageDataClass.prototype.RemoveMyAuth = function (auth) {
        this.MyAuth[auth] = this.MyAuth[AUTH[auth]] = false;
    };
    ManageDataClass.prototype.GetProjByPid = function (pid) {
        return this.ProjList.FindByKey(FieldName.PID, pid);
    };
    /**返回当前用户有权限的工程列表 */
    ManageDataClass.prototype.GetProjectListHasAuth = function () {
        var projList;
        if (ManageData.MyAuth[AUTH.PROJECT_LIST]) {
            projList = ManageData.ProjList;
        }
        else {
            //只看自己所处的项目
            projList = [];
            for (var i = 0; i < ManageData.ProjList.length; i++) {
                var proj = ManageData.ProjList[i];
                if (proj.UserList.IndexOfByKey(FieldName.Uid, ManageData.CurrUser.Uid) > -1) {
                    projList.push(proj);
                    if (proj.MasterUid == ManageData.CurrUser.Uid) {
                        ManageData.AddMyAuth(AUTH.PROJECT_MANAGE);
                    }
                }
            }
        }
        return projList;
    };
    /**得到一个proj下所有职位的list */
    ManageDataClass.prototype.GetProjAllPosnList = function (proj, rs) {
        if (rs === void 0) { rs = null; }
        rs = rs || [];
        for (var i = 0; i < proj.DeptTree.length; i++) {
            var item = proj.DeptTree[i];
            this.GetDeptAllPosnList(item, rs);
        }
        return rs;
    };
    /**一个部门及其子部门下所有的职位 */
    ManageDataClass.prototype.GetDeptAllPosnList = function (dept, rs) {
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
    ManageDataClass.prototype.GetDeptUserList = function (dept, rs) {
        if (rs === void 0) { rs = null; }
        rs = rs || [];
        for (var i = 0; i < dept.PositionList.length; i++) {
            var posn = dept.PositionList[i];
            rs.push.apply(rs, posn.UserList);
        }
        return rs;
    };
    /**一个部门及其子部门下所有的user */
    ManageDataClass.prototype.GetDeptAllUserList = function (dept, rs) {
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
    /**获取默认的管理员部门 */
    ManageDataClass.prototype.NewDeptManager = function () {
        var dept = {
            Did: this.NewDepartmentUuid, Name: '管理部', Fid: 0, Depth: 0,
            Sort: 0,
            Children: [],
            PositionList: [
                {
                    Posnid: this.NewPositionUuid++, Did: this.NewDepartmentUuid, Name: '制作人', UserList: [],
                    AuthorityList: [this.AuthDict[AUTH.PROJECT_MANAGE], this.AuthDict[AUTH.DEPARTMENT_MANAGE]]
                },
                {
                    Posnid: this.NewPositionUuid++, Did: this.NewDepartmentUuid, Name: 'PM', UserList: [],
                    AuthorityList: [this.AuthDict[AUTH.PROJECT_MANAGE], this.AuthDict[AUTH.DEPARTMENT_MANAGE]]
                },
                {
                    Posnid: this.NewPositionUuid++, Did: this.NewDepartmentUuid, Name: '管理员', UserList: [],
                    AuthorityList: [this.AuthDict[AUTH.PROJECT_MANAGE], this.AuthDict[AUTH.DEPARTMENT_MANAGE]]
                },
            ]
        };
        this.NewDepartmentUuid++;
        this.DeptDict[dept.Did] = dept;
        return dept;
    };
    /**检测childDept是否是parentDept的子孙dept */
    ManageDataClass.prototype.IsDepartmentChild = function (parentDept, childDept) {
        for (var i = 0; i < parentDept.Children.length; i++) {
            if (parentDept.Children[i].Did == childDept.Did) {
                return true;
            }
            else {
                if (ManageData.IsDepartmentChild(parentDept.Children[i], childDept)) {
                    return true;
                }
            }
        }
        return false;
    };
    ManageDataClass.prototype.GetDepartmentFullNameArr = function (dp) {
        var rs = [];
        while (dp) {
            rs.unshift(dp.Name);
            dp = this.DeptDict[dp.Fid];
        }
        return rs;
    };
    ManageDataClass.prototype.GetBrotherDepartmentList = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var fid;
        if (typeof (args[0]) == 'number' || typeof (args[0]) == 'string') {
            fid = parseInt(args[0]);
        }
        else {
            fid = args[0].Fid;
        }
        if (fid) {
            return ManageData.DeptDict[fid].Children;
        }
        else { //顶级部门
            return this.CurrProj.DeptTree;
        }
    };
    ManageDataClass.prototype.RemoveUserPosnid = function (user) {
        if (user.Did) {
            var oldDept = ManageData.DeptDict[user.Did];
            var oldPosn = oldDept.PositionList.FindByKey(FieldName.Posnid, user.Posnid);
            if (oldPosn) {
                oldPosn.UserList.RemoveByKey(FieldName.Uid, user.Uid);
            }
        }
    };
    ManageDataClass.prototype.SetUserPosnid = function (user, did, posnid) {
        if (posnid === void 0) { posnid = -1; }
        var dept = ManageData.DeptDict[did];
        user.Did = dept.Did;
        var posn;
        if (posnid == -1) {
            posn = dept.PositionList[0];
        }
        else {
            posn = dept.PositionList.FindByKey(FieldName.Posnid, posnid);
        }
        user.Posnid = posn.Posnid;
        posn.UserList.push(user);
    };
    return ManageDataClass;
}());
var ManageData = new ManageDataClass();
//# sourceMappingURL=ManageData.js.map