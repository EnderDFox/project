//提示类
var NoticeManager = {
	//注册函数
	RegisterFunc:function(){
		Commond.Register(L2C.L2C_PROCESS_SCORE_NOTICE,NoticeManager.ScoreNotice)
	},
	//点评提示
	ScoreNotice:function(data){
		NoticeData.Init(data)
		NoticePanel.CreateNotice()
		//NoticePanel.BindActions()
	},
	//评价完成
	ScoreEdit:function(data){
		if(!NoticeData.NoticeMap[data.Wid]){
			return false
		}
		//数据改变
		NoticeData.NoticeLen--
		delete NoticeData.NoticeMap[data.Wid]
		//元素操作
		$('#umsgs').html(NoticeData.NoticeLen)
		$('#extraNotice .list li[wid="'+data.Wid+'"]').slideUp(300,function(){
			$(this).remove()
		})
	}
}