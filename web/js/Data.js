//Data类
var Data = {
	//用户列表
	UserList:[],
	//用户Map
	UserMap:{},
	//部门列表
	DepartmentList:[],
	//部门递归
	DepartmentLoop:[],
	//部门Map
	DepartmentMap:{},
	//部门用户Map
	DepartmentUserMap:{},
	//设置用户列表
	SetUserData:function(data){
		Data.UserList = data.List
		$.each(data.List,function(k,v){
			Data.UserMap[v.Uid] = v
		})
	},
	//获取用户
	GetUser:function(Uid){
		return Data.UserMap[Uid]
	},
	//设置部门列表
	SetDepartmentData:function(data){
		Data.DepartmentList = data.List
		$.each(data.List,function(k,v){
			Data.DepartmentMap[v.Did] = v
		})
		//部门递归
		Data.LoopDepartment(Data.DepartmentLoop,0)
	},
	//部门递归
	LoopDepartment:function(loop,fid){
		$.each(Data.DepartmentList,function(k,v){
			if(v.Fid == fid){
				var data = {'info':v,'list':[],'user':[]}
				loop.push(data)
				Data.LoopDepartment(data.list,v.Did)
				Data.AddUser(data.user,v)
			}
		})
	},
	//添加用户
	AddUser:function(loop,dpt){
		var RootId = dpt.Fid
		if(RootId == 0){
			RootId = dpt.Did
		}
		if(!Data.DepartmentUserMap[RootId]){
			Data.DepartmentUserMap[RootId] = {}
		}
		$.each(Data.UserList,function(k,v){
			if(v.Did ==  dpt.Did){
				Data.DepartmentUserMap[RootId][v.Uid] = v
			}
			if(v.IsDel == 1){
				return true
			}
			if(v.Did == dpt.Did){
				loop.push(v)
			}
		})
	},
	//注册函数
	RegisterFunc:function(){
		Commond.Register(L2C.L2C_USER_LIST,Data.SetUserData)
		Commond.Register(L2C.L2C_DEPARTMENT_LIST,Data.SetDepartmentData)
	}
}


