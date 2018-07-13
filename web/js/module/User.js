//User类
var UserClass = /** @class */ (function () {
    function UserClass() {
        this.Uid = 0;
        this.Pid = 0;
        this.Gid = 0;
        this.Did = 0;
        this.Name = '';
        this.Vip = 0;
        this.Is_del = 0;
        this.Rtx_name = '';
        this.Rtx_account = '';
        this.Rtx_group = '';
        this.Reg_time = 0;
        this.Login_count = 0;
        this.Login_time = 0;
        /**是否有管理权限 */
        this.IsWrite = false;
    }
    UserClass.prototype.LoadData = function (data) {
        this.Uid = data.Uid;
        this.Gid = data.Gid;
        this.Did = data.Did;
        this.Name = data.Name;
        this.Vip = data.Vip;
        this.Is_del = data.Is_del;
        this.Rtx_name = data.Rtx_name;
        this.Rtx_account = data.Rtx_account;
        this.Rtx_group = data.Rtx_group;
        this.Reg_time = data.Reg_time;
        this.Login_count = data.Login_count;
        this.Login_time = data.Login_time;
        this.IsWrite = data.IsWrite;
    };
    //显示用户名
    UserClass.prototype.ShowName = function () {
        $('#uname').html(this.Name);
    };
    //用户登陆
    UserClass.prototype.Login = function () {
        var Account = $.cookie('get', { name: 'Account' });
        var Verify = $.cookie('get', { name: 'Verify' });
        WSConn.sendMsg(C2L.C2L_SESSION_LOGIN, { 'Account': Account, 'Verify': Verify, 'Pid': this.Pid });
    };
    //登陆错误
    UserClass.prototype.LoginError = function (data) {
        location.href = 'http://wx.studio.youzu.com/pm.hh';
    };
    //注册函数
    UserClass.prototype.RegisterFunc = function () {
        Commond.Register(L2C.L2C_SESSION_LOGIN, this.LoadData.bind(this));
        Commond.Register(L2C.L2C_SESSION_LOGIN_ERROR, this.LoginError.bind(this));
    };
    return UserClass;
}());
var User = new UserClass();
//# sourceMappingURL=User.js.map