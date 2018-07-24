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
        this.InitDeptData(data.DeptList);
        this.InitPosnData(data.PosnList);
        // this.InitDeptData(data.PosnList)
        // this.InitDeptData(data.PosnList)
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
                Modid: 10, Name: '后台管理', Description: "\u5305\u62EC \u90E8\u95E8 \u804C\u4F4D \u6743\u9650\u4FEE\u6539\u7B49", AuthList: [],
                CheckedChange: false,
            },
            {
                Modid: 20, Name: '工作管理', Description: "\u5305\u62EC \u6A21\u5757 \u6D41\u7A0B \u5DE5\u4F5C \u8BC4\u4EF7\u7B49", AuthList: [],
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
                this.AuthModDict[auth.Modid].AuthList.push(auth);
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
        this.ProjDict = {};
        for (var i = 0; i < projList.length; i++) {
            var proj = projList[i];
            this.ProjDict[proj.Pid] = proj;
            proj.DeptTree = [];
            proj.UserList = [];
            proj.MasterUid = 0; //TODO:
        }
        //# TODO: 加入user吧
        this.ProjList[0].UserList.push.apply(this.ProjList[0].UserList, this.UserList.slice(0, 10));
        for (var i = 0; i < this.ProjList[0].UserList.length; i++) {
            this.ProjList[0].UserList[i].Sort = i + 1;
        }
    };
    ManageDataClass.prototype.InitDeptData = function (deptList) {
        this.DeptDict = {};
        for (var i = 0; i < deptList.length; i++) {
            var dept = deptList[i];
            dept.Children = [];
            dept.PosnList = [];
            this.DeptDict[dept.Did] = dept;
        }
        //DeptDict有数据了再统一放置childre
        for (var i = 0; i < deptList.length; i++) {
            var dept = deptList[i];
            if (dept.Fid == 0) {
                this.ProjDict[dept.Pid].DeptTree.push(dept);
            }
            else {
                var parent = this.DeptDict[dept.Fid];
                if (parent) { //需要判断,因为可能是fid已经被删除的部门 还残留
                    parent.Children.push(dept);
                }
            }
        }
        //再重新计算深度
        for (var i = 0; i < this.ProjList.length; i++) {
            var proj = this.ProjList[i];
            this.ReCountDeptTreeDepth(proj.DeptTree);
        }
    };
    ManageDataClass.prototype.ReCountDeptTreeDepth = function (deptTree, depth) {
        if (depth === void 0) { depth = 0; }
        for (var i = 0; i < deptTree.length; i++) {
            var dept = deptTree[i];
            dept.Depth = depth;
            this.ReCountDeptTreeDepth(dept.Children, depth + 1);
        }
    };
    ManageDataClass.prototype.InitPosnData = function (posnList) {
        for (var i = 0; i < posnList.length; i++) {
            var posn = posnList[i];
            posn.AuthList = [];
            posn.UserList = [];
            this.DeptDict[posn.Did].PosnList.push(posn);
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
        rs.push.apply(rs, dept.PosnList);
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
        for (var i = 0; i < dept.PosnList.length; i++) {
            var posn = dept.PosnList[i];
            rs.push.apply(rs, posn.UserList);
        }
        return rs;
    };
    /**一个部门及其子部门下所有的user */
    ManageDataClass.prototype.GetDeptAllUserList = function (dept, rs) {
        if (rs === void 0) { rs = null; }
        rs = rs || [];
        for (var i = 0; i < dept.PosnList.length; i++) {
            var posn = dept.PosnList[i];
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
    ManageDataClass.prototype.GetBrotherDeptListByFid = function (fid) {
        if (fid) {
            if (ManageData.DeptDict[fid]) {
                return ManageData.DeptDict[fid].Children;
            }
            else {
                return null;
            }
        }
        else { //顶级部门
            return this.CurrProj.DeptTree;
        }
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
        return this.GetBrotherDeptListByFid(fid);
    };
    ManageDataClass.prototype.RemoveUserPosnid = function (user) {
        if (user.Did) {
            var oldDept = ManageData.DeptDict[user.Did];
            var oldPosn = oldDept.PosnList.FindByKey(FieldName.Posnid, user.Posnid);
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
            posn = dept.PosnList[0];
        }
        else {
            posn = dept.PosnList.FindByKey(FieldName.Posnid, posnid);
        }
        user.Posnid = posn.Posnid;
        posn.UserList.push(user);
    };
    /**通过名称获取职位 */
    ManageDataClass.prototype.GetPosnByName = function (deptTree, posnName) {
        for (var i = 0; i < deptTree.length; i++) {
            var dept = deptTree[i];
            var posn = dept.PosnList.FindByKey(FieldName.Name, posnName);
            if (posn) {
                return posn;
            }
            if (dept.Children) {
                var posnChild = this.GetPosnByName(dept.Children, posnName);
                if (posnChild) {
                    return posnChild;
                }
            }
        }
        return null;
    };
    return ManageDataClass;
}());
var ManageData = new ManageDataClass();
//# sourceMappingURL=ManageData.js.map