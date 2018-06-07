//晨会管理
class CollateManagerClass {
	//注册函数
	RegisterFunc() {
		Commond.Register(L2C.L2C_COLLATE_VIEW, this.View.bind(this))
		Commond.Register(L2C.L2C_COLLATE_STEP_EDIT, this.StepEdit.bind(this))
		Commond.Register(L2C.L2C_COLLATE_STEP_ADD, this.ExtraAdd.bind(this))
		Commond.Register(L2C.L2C_COLLATE_EXTRA_EDIT, this.ExtraEdit.bind(this))
		Commond.Register(L2C.L2C_COLLATE_EXTRA_DELETE, this.ExtraDelete.bind(this))
	}
	//预览
	View(data: L2C_CollateView) {
		CollateData.Init(data)
		CollatePanel.SetDateRange()
		CollatePanel.CreateCollate()
		CollatePanel.BindActions()
	}
	//编辑
	StepEdit(data) {
		//数据变化
		CollateData.WorkMap[data.Wid] = data
		$('#content tr[date="' + data.Date + '"] li[wid="' + data.Wid + '"] span:first').attr('class', 'check_' + data.Inspect)
	}
	//新增
	ExtraAdd(data) {
		//数据变化
		CollateData.ExtraMap[data.Eid] = data
		$('#content tr[date="' + data.Date + '"] td[uid="' + data.Uid + '"] ol').append(CollatePanel.GetWorkExtra(data))
	}
	//编辑
	ExtraEdit(data) {
		//数据变化
		CollateData.ExtraMap[data.Eid] = data
		$('#content tr[date="' + data.Date + '"] td[uid="' + data.Uid + '"] li[eid="' + data.Eid + '"]').after(CollatePanel.GetWorkExtra(data)).remove()
	}
	//删除
	ExtraDelete(data) {
		var extra = CollateData.ExtraMap[data.Eid]
		$('#content tr[date="' + extra.Date + '"] td[uid="' + extra.Uid + '"] li[eid="' + extra.Eid + '"]').remove()
		//数据变化
		delete CollateData.ExtraMap[data.Eid]
	}
}

var CollateManager = new CollateManagerClass()

