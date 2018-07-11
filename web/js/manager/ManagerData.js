var ManagerDataClass = /** @class */ (function () {
    function ManagerDataClass() {
        /**我的权限 */
        this.MyAuth = {};
    }
    ManagerDataClass.prototype.Init = function () {
        //#权限
        var urlParam = window.location.href.toLowerCase();
        var authCode = 0;
        // console.log("[debug]", str)
        if (urlParam.indexOf('auth=') > -1) {
            urlParam = urlParam.split('auth=').pop().toString();
            urlParam = urlParam.split(/\&|\?/).shift().toString();
            authCode = parseInt(urlParam);
        }
        //
        for (var key in Auth) {
            if (parseInt(key).toString() == key) { //typeof(Auth.xxx) 竟然也是 string, 只能用这方法做了
                var keyAsNum = parseInt(key);
                console.log("[debug]", key, ":[key]");
                this.MyAuth[key] = (authCode & keyAsNum) > 0;
                this.MyAuth[Auth[key]] = this.MyAuth[key];
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
            this.UserList.push({ Uid: i + 1, Name: "\u7528\u6237" + String.fromCharCode(65 + i) });
        }
    };
    return ManagerDataClass;
}());
var ManagerData = new ManagerDataClass();
//# sourceMappingURL=ManagerData.js.map