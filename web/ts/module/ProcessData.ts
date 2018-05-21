//进度数据
class ProcessDataClass {
	//项目信息
	Project: ProjectSingle
	//工作内容
	WorkMap: { [key: number]: WorkSingle }
	//流程内容
	LinkMap: { [key: number]: LinkSingle }
	//功能内容
	ModeMap: { [key: number]: ModeSingle }
	//评分内容
	ScoreMap: { [key: number]: ScoreSingle }
	//版本内容
	VerMap: { [key: number]: VerSingle }	//key: DateLine
	//版本和版本时间
	VersionList: VersionSingle[]
	VersionMap: { [key: number]: VersionSingle }	//key: Vid
	VersionDateLineMap: { [key: number]: PublishSingle[] }	//key: DateLine
	//流程工作
	LinkWorkMap: { [key: number]: { [key: string]: WorkSingle } }
	//数据初始化
	Init(data: { Project: ProjectSingle, ModeList: ModeSingle[], LinkList: LinkSingle[], WorkList: WorkSingle[], ScoreList: ScoreSingle[], VerList: VerSingle[], VersionList: VersionSingle[], }) {
		//初始化
		this.Project = data.Project
		this.WorkMap = {}
		this.LinkMap = {}
		this.ModeMap = {}
		this.ScoreMap = {}
		this.VerMap = {}
		this.LinkWorkMap = {}
		//过滤可用流程 key:LinkSingle.Mid	item:LinkSingle
		var checkMode: { [key: number]: number } = {}
		//过滤可用用户 key:UserSingle.Uid
		var checkUser: { [key: number]: UserSingle } = Data.DepartmentUserMap[ProjectNav.FilterDid]
		//环节过滤
		$.each(data.LinkList, (k, v: LinkSingle) => {
			//流程名查询
			if (v.Name.indexOf(ProcessFilter.Pack.LinkName) == -1) {
				return true
			}
			//负责人查询
			if (Data.GetUser(v.Uid).Name.indexOf(ProcessFilter.Pack.LinkUserName) == -1) {
				return true
			}
			//是否归档
			if (ProcessFilter.Pack.LinkStatus != -1 && v.Status != ProcessFilter.Pack.LinkStatus) {
				return true
			}
			//策划特例
			if (ProjectNav.FilterDid == DidField.DESIGN) {
				//用户检查			
				if (checkUser && !checkUser[v.Uid]) {
					return true
				}
				//环节保存
				this.LinkMap[v.Lid] = v
			} else {
				//环节保存
				this.LinkMap[v.Lid] = v
				//用户检查			
				if (checkUser && !checkUser[v.Uid]) {
					return true
				}
			}

			//环节保存
			this.LinkMap[v.Lid] = v
			//用户检查			
			if (checkUser && !checkUser[v.Uid]) {
				return true
			}
			//有效模块
			checkMode[v.Mid] = v.Mid
			return true
		})
		//模块过滤
		$.each(data.ModeList, (k, v: ModeSingle) => {
			//功能类型
			/*
			if(ProjectNav.FilterDid != DidValue.ALL && ProjectNav.FilterDid != v.Did){
				return true
			}
			*/
			//查看版本
			if (ProjectNav.FilterDid == DidField.VERSION && DidField.VERSION != v.Did) {
				return true
			}
			if (ProjectNav.FilterDid == DidField.QA && DidField.QA != v.Did) {
				return true
			}
			//版本号查询
			if (v.Ver.indexOf(ProcessFilter.Pack.Ver) == -1) {
				return true
			}
			//功能名查询
			if (v.Name.indexOf(ProcessFilter.Pack.ModeName) == -1) {
				return true
			}
			//是否归档
			if (ProcessFilter.Pack.ModeStatus != -1 && v.Status != ProcessFilter.Pack.ModeStatus) {
				return true
			}
			//过滤无效功能
			if (!checkMode[v.Mid]) {
				return true
			}
			this.ModeMap[v.Mid] = v
			return true
		})
		//进度
		$.each(data.WorkList, (k, v: WorkSingle) => {
			this.WorkMap[v.Wid] = v
			if (!this.LinkWorkMap[v.Lid]) {
				this.LinkWorkMap[v.Lid] = {}
			}
			this.LinkWorkMap[v.Lid][v.Date] = v
		})
		//评分
		$.each(data.ScoreList, (k, v: ScoreSingle) => {
			/*旧代码, 但没有score啊
			 if(v.Score == 0){
				return true
			} */
			this.ScoreMap[v.Wid] = v
			return true
		})
		//版本
		$.each(data.VerList, (k, v: VerSingle) => {
			this.VerMap[v.DateLine] = v
		})
		//
		this.ParseVersionData(data.VersionList)
	}
	//处理版本数据
	ParseVersionData(versionList: VersionSingle[]) {
		this.VersionList = []
		this.VersionMap = {}
		this.VersionDateLineMap = {}
		//
		$.each(versionList, (k, v: VersionSingle) => {
			this.VersionList.push(v);//后端会直接用create_time排好序, 所以这里不再排序了
			this.VersionMap[v.Vid] = v;
			if (!v.PublishList) {
				v.PublishList = []
			}
			//补齐不足的genre数据
			{
				var _publishMap: { [key: number]: PublishSingle } = {} //key: genre
				v.PublishList.forEach((p: PublishSingle) => {
					_publishMap[p.Genre] = p
				});
				for (var genre = GenreField.BEGIN; genre <= GenreField.SUMMARY; genre++) {
					var p: PublishSingle
					p = _publishMap[genre]
					if (!p) {
						p = { Genre: genre, DateLine: '' }
					}
					p.Vid = v.Vid//后端传来的都没有vid, 需要自己加上
					if (p.DateLine) {
						this.VersionDateLineMap[p.DateLine] = p
					}
				}
			}
		})
	}
}

var ProcessData = new ProcessDataClass()