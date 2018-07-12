var ManagerDataClass = /** @class */ (function () {
    function ManagerDataClass() {
        /**我的权限 */
        this.MyAuth = {};
    }
    ManagerDataClass.prototype.Init = function () {
        //#权限
        var urlParam = window.location.href.toLowerCase();
        var authCodeArr;
        // console.log("[debug]", str)
        if (urlParam.indexOf('auth=') > -1) {
            urlParam = urlParam.split('auth=').pop().toString();
            urlParam = urlParam.split(/\&|\?/).shift().toString();
            authCodeArr = urlParam.split(",").map(function (item) { return parseInt(item); });
        }
        else {
            authCodeArr = [];
        }
        //
        for (var i = 0; i < authCodeArr.length; i++) {
            var authCode = authCodeArr[i];
            if (Auth[authCode]) {
                this.MyAuth[authCode] = this.MyAuth[Auth[authCode]] = true;
            }
        }
        //
        Object.freeze(this.MyAuth);
        //#project
        this.ProjectList = [
            { Pid: 1, Name: '项目A' },
            { Pid: 2, Name: '项目B' },
        ];
        //#user
        this.UserList = [];
        for (var i = 0; i < 12; i++) {
            this.UserList.push({ Uid: i + 1, Name: "\u7528\u6237" + String.fromCharCode(65 + i), Did: 0, Posid: 0 });
        }
        //#
        for (var i = 0; i < this.ProjectList.length; i++) {
            var proj = this.ProjectList[i];
            proj.UserList = [];
            proj.UserList.push(this.UserList[3]);
            proj.UserList.push(this.UserList[5]);
        }
        //#department
        this.DepartmentTree = [
            {
                Did: 1, Name: '策划', depth: 0, Children: [], PositionList: [
                    { Posid: 100, Did: 2, Name: '策划' },
                    { Posid: 101, Did: 2, Name: '策划主管' },
                ]
            },
            {
                Did: 2, Name: '美术', depth: 0, PositionList: [
                    { Posid: 201, Did: 2, Name: '美术主管' },
                ], Children: [
                    { Did: 21, Name: 'UI', depth: 1, Children: [], PositionList: [{ Posid: 2102, Did: 2, Name: 'UI' },] },
                    {
                        Did: 22, Name: '3D', depth: 1, Children: [], PositionList: [
                            { Posid: 2200, Did: 2, Name: '3D' },
                            { Posid: 2201, Did: 2, Name: '3D主管' },
                        ]
                    },
                    {
                        Did: 23, Name: '原画', depth: 1, PositionList: [{ Posid: 301, Did: 2, Name: '原画主管' }], Children: [
                            { Did: 231, Name: '角色原画', depth: 2, Children: [], PositionList: [{ Posid: 23100, Did: 2, Name: '角色原画' },] },
                            { Did: 232, Name: '场景原画', depth: 2, Children: [], PositionList: [{ Posid: 23200, Did: 2, Name: '场景原画' },] },
                        ],
                    },
                ],
            },
            {
                Did: 3, Name: '后端', depth: 0, Children: [], PositionList: [
                    { Posid: 300, Did: 2, Name: '前端' },
                    { Posid: 301, Did: 2, Name: '后端主管' },
                ]
            },
            {
                Did: 4, Name: '前端', depth: 0, Children: [], PositionList: [
                    { Posid: 400, Did: 2, Name: '前端' },
                    { Posid: 401, Did: 2, Name: '前端主管' },
                ]
            },
        ];
        //
        this.DepartmentDict = {};
        this.InitAllDepartmentDict();
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
    ManagerDataClass.prototype.GetAllDepartmentList = function (dpTree) {
        if (dpTree === void 0) { dpTree = null; }
        dpTree ? null : dpTree = this.DepartmentTree;
        var rs = [];
        for (var i = 0; i < dpTree.length; i++) {
            var dp = dpTree[i];
            rs.push(dp);
            if (dp.Children.length > 0) {
                rs = rs.concat(this.GetAllDepartmentList(dp.Children));
            }
        }
        return rs;
    };
    return ManagerDataClass;
}());
var ManagerData = new ManagerDataClass();
//# sourceMappingURL=ManagerData.js.map