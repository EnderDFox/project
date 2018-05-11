//晨会数据
var CollateData = {
	//工作内容
	WorkMap:{},
	//流程内容
	LinkMap:{},
	//功能内容
	ModeMap:{},
	//标签内容
	TagsMap:{},
	//时间用户内容
	DateUserMap:{},
	//补充内容
	ExtraMap:{},
	//时间补充内容
	DateExtraMap:{},
	//版本内容
	VerMap:{},
	//状态描述
	StatusList:[{'Info':'持续','Tag':''},{'Info':'延期','Tag':'延'},{'Info':'等待','Tag':'待'},{'Info':'完成','Tag':'完'},{'Info':'休息','Tag':'休'},{'Info':'优化','Tag':'优'}],
	//检查描述
	InspectList:['未知','完成','持续','未完成'],
	//版本描述
	VerList:['','版本开始','版本完结','版本封存','版本延期','版本发布','版本总结','版本删除'],
	//数据初始化
	Init:function(data){
		this.WorkMap = {}
		this.LinkMap = {}
		this.ModeMap = {}
		this.TagsMap = {}
		this.ExtraMap = {}
		this.DateUserMap = {}
		this.DateExtraMap = {}
		this.VerMap = {}
		//功能内容
		$(data.ModeList).each(function(){
			CollateData.ModeMap[this.Mid] = this
		})
		//流程内容
		$(data.LinkList).each(function(){
			CollateData.LinkMap[this.Lid] = this
		})
		//标签内容
		$(data.TagsList).each(function(){
			CollateData.TagsMap[this.Tag] = this
		})
		//工作内容
		$(data.WorkList).each(function(){
			CollateData.WorkMap[this.Wid] = this
			if(!CollateData.DateUserMap[this.Date]){
				CollateData.DateUserMap[this.Date] = {}
			}
			if(!CollateData.DateUserMap[this.Date][CollateData.LinkMap[this.Lid].Uid]){
				CollateData.DateUserMap[this.Date][CollateData.LinkMap[this.Lid].Uid] = []
			}
			CollateData.DateUserMap[this.Date][CollateData.LinkMap[this.Lid].Uid].push(this)
		})
		//补充内容
		$(data.ExtraList).each(function(){
			CollateData.ExtraMap[this.Eid] = this
			if(!CollateData.DateExtraMap[this.Date]){
				CollateData.DateExtraMap[this.Date] = {}
			}
			if(!CollateData.DateExtraMap[this.Date][this.Uid]){
				CollateData.DateExtraMap[this.Date][this.Uid] = []
			}
			CollateData.DateExtraMap[this.Date][this.Uid].push(this)
		})
		//版本
		$(data.VerList).each(function(k,v){
			CollateData.VerMap[v.DateLine] = v
		})
	}
}