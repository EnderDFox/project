//Data类
class DataClass {
    //用户列表
    UserList: UserSingle[] = []
    //用户Map
    UserMap: { [key: number]: UserSingle } = {};
    //部门列表
    DepartmentList: DepartmentSingle[] = []
    //部门递归
    DepartmentLoop: DepartmentInfo[] = []
    //部门Map
    DepartmentMap: { [key: number]: DepartmentSingle } = {};
    /** 部门用户Map
     * key1:DidField   key2:UserSingle.Uid
     */
    DepartmentUserMap: { [key: number]: { [key: number]: UserSingle } } = {};
    //设置用户列表
    SetUserData(data: { List: UserSingle[] }) {
        this.UserList = data.List
        $.each(data.List, (k, v: UserSingle) => {
            this.UserMap[v.Uid] = v
        })
    }
    //获取用户
    GetUser(Uid: number): UserSingle {
        return this.UserMap[Uid]
    }

    //设置部门列表
    SetDepartmentData(data: { List: DepartmentSingle[] }) {
        this.DepartmentList = data.List
        $.each(data.List, (k, v: DepartmentSingle) => {
            this.DepartmentMap[v.Did] = v
        })
        //部门递归
        this.LoopDepartment(this.DepartmentLoop, 0)
    }
    //部门递归
    //loop 是空的, 会用push补满
    LoopDepartment(loop: DepartmentInfo[], fid: DidField) {
        $.each(this.DepartmentList, (k, v: DepartmentSingle) => {
            //v:DepartmentSingle{Did Fid Name} 
            if (v.Fid == fid) {
                var data: DepartmentInfo = { info: v, list: [], user: [] }
                loop.push(data)
                this.LoopDepartment(data.list, v.Did)
                this.AddUser(data.user, v)
            }
        })
    }
    //添加用户
    //dpt:DepartmentSingle
    AddUser(user: UserSingle[], dpt: DepartmentSingle) {
        var RootId: DidField = dpt.Fid
        if (RootId == 0) {
            RootId = dpt.Did
        }
        if (!this.DepartmentUserMap[RootId]) {
            this.DepartmentUserMap[RootId] = {}
        }
        //v:UserSingle
        $.each(this.UserList, (k, v: UserSingle) => {
            if (v.Did == dpt.Did) {
                this.DepartmentUserMap[RootId][v.Uid] = v
            }
            if (v.IsDel == 1) {
                return true
            }
            if (v.Did == dpt.Did) {
                user.push(v)
            }
            return true
        })
    }
    //注册函数
    RegisterFunc() {
        Commond.Register(L2C.L2C_USER_LIST, this.SetUserData.bind(this))
        Commond.Register(L2C.L2C_DEPARTMENT_LIST, this.SetDepartmentData.bind(this))
    }
}

var Data = new DataClass()


