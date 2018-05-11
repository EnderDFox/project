//个人数据
var ProfileData = {
	//个人内容
	DataMap:{},
	//日期内容
	DateList:[],
	//标签内容
	TagsMap:{},
	//数据初始化
	Init:function(data){
		this.TagsMap = {}
		this.DataMap = {}
		this.DateList = []
		//个人内容
		$(data.ProfileList).each(function(){
			if(!ProfileData.DataMap[this.Date]){
				ProfileData.DataMap[this.Date] = []
				ProfileData.DateList.push(this.Date)
			}
			ProfileData.DataMap[this.Date].push(this)
		})
		//标签内容
		$(data.TagsList).each(function(){
			ProfileData.TagsMap[this.Tag] = this
		})
	}
}

