//个人类
var ProfileManager = {
	//注册函数
	RegisterFunc:function(){
		Commond.Register(L2C.L2C_PROFILE_VIEW,ProfileManager.View)
	},
	//预览
	View:function(data){
		ProfileData.Init(data)
		ProfilePanel.CreateProfile()
		ProfilePanel.BindActions()
	},
}