//User类
var User = {
	Uid:0,         
	Pid:0,         
	Gid:0,         
	Did:0,         
	Name:'',        
	Vip:0,         
	Is_del:0,      
	Rtx_name:'',    
	Rtx_account:'', 
	Rtx_group:'',   
	Reg_time:0,    
	Login_count:0,
	Login_time:0,
	IsWrite:false,
	LoadData:function(data){
		User.Uid			= data.Uid		
		User.Pid       	 	= data.Pid       	
		User.Gid          	= data.Gid        
		User.Did          	= data.Did        
		User.Name         	= data.Name       
		User.Vip          	= data.Vip        
		User.Is_del       	= data.Is_del     
		User.Rtx_name     	= data.Rtx_name   
		User.Rtx_account	= data.Rtx_account
		User.Rtx_group    	= data.Rtx_group  
		User.Reg_time     	= data.Reg_time   
		User.Login_count  	= data.Login_count
		User.Login_time   	= data.Login_time
		User.IsWrite		= data.IsWrite
	},
	//显示用户名
	SetName:function(){
		$('#uname').html(User.Name)
	},
	//用户登陆
	Login:function(){
		var Account = $.cookie('get',{name:'Account'})
		var Verify = $.cookie('get',{name:'Verify'})
		WSConn.sendMsg(C2L.C2L_SESSION_LOGIN,{'Account':Account,'Verify':Verify})
	},
	//登陆错误
	LoginError:function(data){
		location.href = 'http://wx.studio.youzu.com/pm.hh'
	},
	//注册函数
	RegisterFunc:function(){
		Commond.Register(L2C.L2C_SESSION_LOGIN,User.LoadData)
		Commond.Register(L2C.L2C_SESSION_LOGIN_ERROR,User.LoginError)
	}
}