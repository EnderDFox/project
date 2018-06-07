//Data类
var DataClass = /** @class */ (function () {
    function DataClass() {
        //用户列表
        this.UserList = [];
        //用户Map
        this.UserMap = {};
        //部门列表
        this.DepartmentList = [];
        //部门递归
        this.DepartmentLoop = [];
        //部门Map
        this.DepartmentMap = {};
        /** 部门用户Map
         * key1:DidField   key2:UserSingle.Uid
         */
        this.DepartmentUserMap = {};
    }
    //设置用户列表
    DataClass.prototype.SetUserData = function (data) {
        var _this = this;
        this.UserList = data.List;
        $.each(data.List, function (k, v) {
            _this.UserMap[v.Uid] = v;
        });
    };
    //获取用户
    DataClass.prototype.GetUser = function (Uid) {
        return this.UserMap[Uid];
    };
    //设置部门列表
    DataClass.prototype.SetDepartmentData = function (data) {
        var _this = this;
        this.DepartmentList = data.List;
        $.each(data.List, function (k, v) {
            _this.DepartmentMap[v.Did] = v;
        });
        //部门递归
        this.LoopDepartment(this.DepartmentLoop, 0);
    };
    //部门递归
    //loop 是空的, 会用push补满
    DataClass.prototype.LoopDepartment = function (loop, fid) {
        var _this = this;
        $.each(this.DepartmentList, function (k, v) {
            //v:DepartmentSingle{Did Fid Name} 
            if (v.Fid == fid) {
                var data = { info: v, list: [], user: [] };
                loop.push(data);
                _this.LoopDepartment(data.list, v.Did);
                _this.AddUser(data.user, v);
            }
        });
    };
    //添加用户
    //dpt:DepartmentSingle
    DataClass.prototype.AddUser = function (user, dpt) {
        var _this = this;
        var RootId = dpt.Fid;
        if (RootId == 0) {
            RootId = dpt.Did;
        }
        if (!this.DepartmentUserMap[RootId]) {
            this.DepartmentUserMap[RootId] = {};
        }
        //v:UserSingle
        $.each(this.UserList, function (k, v) {
            if (v.Did == dpt.Did) {
                _this.DepartmentUserMap[RootId][v.Uid] = v;
            }
            if (v.IsDel == 1) {
                return true;
            }
            if (v.Did == dpt.Did) {
                user.push(v);
            }
            return true;
        });
    };
    //注册函数
    DataClass.prototype.RegisterFunc = function () {
        Commond.Register(L2C.L2C_USER_LIST, this.SetUserData.bind(this));
        Commond.Register(L2C.L2C_DEPARTMENT_LIST, this.SetDepartmentData.bind(this));
    };
    return DataClass;
}());
var Data = new DataClass();
//# sourceMappingURL=Data.js.map