//晨会管理
var CollateManager = {
	//注册函数
	RegisterFunc:function(){
		Commond.Register(L2C.L2C_COLLATE_VIEW,CollateManager.View)
		Commond.Register(L2C.L2C_COLLATE_STEP_EDIT,CollateManager.StepEdit)
		Commond.Register(L2C.L2C_COLLATE_STEP_ADD,CollateManager.ExtraAdd)
		Commond.Register(L2C.L2C_COLLATE_EXTRA_EDIT,CollateManager.ExtraEdit)
		Commond.Register(L2C.L2C_COLLATE_EXTRA_DELETE,CollateManager.ExtraDelete)
	},
	//预览
	View:function(data){
		CollateData.Init(data)
		CollatePanel.SetDateRange()
		CollatePanel.CreateCollate()
		CollatePanel.BindActions()
	},
	//编辑
	StepEdit:function(data){
		//数据变化
		CollateData.WorkMap[data.Wid] = data
		$('#content tr[date="'+data.Date+'"] li[wid="'+data.Wid+'"] span:first').attr('class','check_'+data.Inspect)
	},
	//新增
	ExtraAdd:function(data){
		//数据变化
		CollateData.ExtraMap[data.Eid] = data
		$('#content tr[date="'+data.Date+'"] td[uid="'+data.Uid+'"] ol').append(CollatePanel.GetWorkExtra(data))
	},
	//编辑
	ExtraEdit:function(data){
		//数据变化
		CollateData.ExtraMap[data.Eid] = data
		$('#content tr[date="'+data.Date+'"] td[uid="'+data.Uid+'"] li[eid="'+data.Eid+'"]').after(CollatePanel.GetWorkExtra(data)).remove()
	},
	//删除
	ExtraDelete:function(data){
		var extra = CollateData.ExtraMap[data.Eid]
		$('#content tr[date="'+extra.Date+'"] td[uid="'+extra.Uid+'"] li[eid="'+extra.Eid+'"]').remove()
		//数据变化
		delete CollateData.ExtraMap[data.Eid]
	}
}

