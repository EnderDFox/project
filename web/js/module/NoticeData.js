//提示类
var NoticeData = {
	//通知列表
	NoticeList:{},
	//通知数据
	NoticeMap:{},
	//数据长度
	NoticeLen:0,
	//设置信息
	Init:function(data){
		NoticeData.NoticeMap = {}
		NoticeData.NoticeLen = data.List.length
		NoticeData.NoticeList = data.List
		$.each(data.List,function(k,v){
			NoticeData.NoticeMap[v.Wid] = v
		})
	}
}