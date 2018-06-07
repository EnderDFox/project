//个人类
class ProfileManagerClass {
    //注册函数
    RegisterFunc() {
        Commond.Register(L2C.L2C_PROFILE_VIEW, this.View.bind(this))
    }
    //预览
    View(data:L2C_ProfileView) {
        ProfileData.Init(data)
        ProfilePanel.CreateProfile()
        ProfilePanel.BindActions()
    }
}

var ProfileManager = new ProfileManagerClass()