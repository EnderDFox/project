//进度数据
var ProcessData = {
	//项目信息
	Project:{},
	//工作内容
	WorkMap:{},
	//流程内容
	LinkMap:{},
	//功能内容
	ModeMap:{},
	//评分内容
	ScoreMap:{},
	//版本内容
	VerMap:{},
	//流程工作
	LinkWorkMap:{},
	//数据初始化
	Init:function(data){
		this.Project = data.Project
		this.WorkMap = {}
		this.LinkMap = {}
		this.ModeMap = {}
		this.ScoreMap = {}
		this.VerMap = {}
		this.LinkWorkMap = {}
		//流程
		var checkMode = {}
		//用户
		var checkUser = Data.DepartmentUserMap[ProjectNav.FilterDid]
		//console.log(checkUser)
		//环节
		$(data.LinkList).each(function(k,v){
			//流程名查询
			if(v.Name.indexOf(ProcessFilter.Pack.LinkName) == -1){
				return true
			}
			//负责人查询
			if(Data.GetUser(v.Uid).Name.indexOf(ProcessFilter.Pack.LinkUserName) == -1){
				return true
			}
			//是否归档
			if(ProcessFilter.Pack.LinkStatus != -1 && v.Status != ProcessFilter.Pack.LinkStatus){
				return true
			}
			
			
			//策划特例
			if(ProjectNav.FilterDid == 1){
				//用户检查			
				if(checkUser && !checkUser[v.Uid]){
					return true
				}
				//环节保存
				ProcessData.LinkMap[v.Lid] = v
			}else{
				//环节保存
				ProcessData.LinkMap[v.Lid] = v
				//用户检查			
				if(checkUser && !checkUser[v.Uid]){
					return true
				}
			}
			
			//环节保存
			ProcessData.LinkMap[v.Lid] = v
			//用户检查			
			if(checkUser && !checkUser[v.Uid]){
				return true
			}
			//有效模块
			checkMode[v.Mid] = v.Mid
		})
		//模块
		$(data.ModeList).each(function(k,v){
			//功能类型
			/*
			if(ProjectNav.FilterDid != -1 && ProjectNav.FilterDid != v.Did){
				return true
			}
			*/
			//查看版本
			if(ProjectNav.FilterDid == 0 && ProjectNav.FilterDid != v.Did){
				return true
			}
			if(ProjectNav.FilterDid == 6 && ProjectNav.FilterDid != v.Did){
				return true
			}
			//版本号查询
			if(v.Ver.indexOf(ProcessFilter.Pack.Ver) == -1){
				return true
			}
			//功能名查询
			if(v.Name.indexOf(ProcessFilter.Pack.ModeName) == -1){
				return true
			}
			//是否归档
			if(ProcessFilter.Pack.ModeStatus != -1 && v.Status != ProcessFilter.Pack.ModeStatus){
				return true
			}
			//过滤无效功能
			if(!checkMode[v.Mid]){
				return true
			}
			ProcessData.ModeMap[v.Mid] = v
		})
		//console.log(checkMode)
		//console.log(ProcessData.ModeMap)
		
		//进度
		$(data.WorkList).each(function(k,v){
			ProcessData.WorkMap[v.Wid] = v
			if(!ProcessData.LinkWorkMap[v.Lid]){
				ProcessData.LinkWorkMap[v.Lid] = {}
			}
			ProcessData.LinkWorkMap[v.Lid][v.Date] = v
		})
		//评分
		$(data.ScoreList).each(function(k,v){
			if(v.Score == 0){
				return true
			}
			ProcessData.ScoreMap[v.Wid] = v
		})
		//版本
		$(data.VerList).each(function(k,v){
			ProcessData.VerMap[v.DateLine] = v
		})
	}
}