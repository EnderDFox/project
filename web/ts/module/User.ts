//User类
class UserClass {
	Uid: number = 0
	Pid: PidFeild = 0
	Gid: number = 0
	Did: DidField = 0
	Name: string = ''
	Vip: number = 0
	Is_del: number = 0
	Rtx_name: string = ''
	Rtx_account: string = ''
	Rtx_group: string = ''
	Reg_time: number = 0
	Login_count: number = 0
	Login_time: number = 0
	/**是否有管理权限 */
	IsWrite: boolean = false
	LoadData(data: any) {
		this.Uid = data.Uid
		this.Gid = data.Gid
		this.Did = data.Did
		this.Name = data.Name
		this.Vip = data.Vip
		this.Is_del = data.Is_del
		this.Rtx_name = data.Rtx_name
		this.Rtx_account = data.Rtx_account
		this.Rtx_group = data.Rtx_group
		this.Reg_time = data.Reg_time
		this.Login_count = data.Login_count
		this.Login_time = data.Login_time
		this.IsWrite = data.IsWrite
	}
	//显示用户名
	ShowName(): void {
		$('#uname').html(this.Name)
	}
	//用户登陆
	Login() {
		var Account: string = $.cookie('get', { name: 'Account' })
		var Verify: string = $.cookie('get', { name: 'Verify' })
		WSConn.sendMsg(C2L.C2L_SESSION_LOGIN, { 'Account': Account, 'Verify': Verify, 'Pid': this.Pid })
	}
	//登陆错误
	LoginError(data) {
		location.href = 'http://wx.studio.youzu.com/pm.hh'
	}
	//注册函数
	RegisterFunc() {
		Commond.Register(L2C.L2C_SESSION_LOGIN, this.LoadData.bind(this))
		Commond.Register(L2C.L2C_SESSION_LOGIN_ERROR, this.LoginError.bind(this))
	}
}

var User = new UserClass()