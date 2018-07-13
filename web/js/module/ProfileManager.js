//个人类
var ProfileManagerClass = /** @class */ (function () {
    function ProfileManagerClass() {
    }
    //注册函数
    ProfileManagerClass.prototype.RegisterFunc = function () {
        Commond.Register(L2C.L2C_PROFILE_VIEW, this.View.bind(this));
    };
    //预览
    ProfileManagerClass.prototype.View = function (data) {
        ProfileData.Init(data);
        ProfilePanel.CreateProfile();
        ProfilePanel.BindActions();
    };
    return ProfileManagerClass;
}());
var ProfileManager = new ProfileManagerClass();
//# sourceMappingURL=ProfileManager.js.map