class ManagerDataClass {
    /**我的权限 */
    MyAuth: { [key: number]: boolean } = {};
    ProjectList: ProjectSingle[]
    UserList: UserSingle[]
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
        //
        Object.freeze(this.MyAuth)
        //#project
        this.ProjectList = [
            { Pid: 1, Name: '项目A' },
            { Pid: 2, Name: '项目B' },
        ]
        //#user
        this.UserList = []
        for (var i = 0; i < 12; i++) {
            this.UserList.push({ Uid: i + 1, Name: `用户${String.fromCharCode(65 + i)}` })
        }
    }
}
var ManagerData = new ManagerDataClass()