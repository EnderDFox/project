//晨会筛选
var CollateFilter = {
	//数据包
	Pack:{'BeginDate':'','EndDate':''},
	//初始化
	Init:function(){
		//数据初始
		this.PackInit()
		//填充数据
		this.FillInput()
		//绑定事件
		this.BindActions()
	},
	//搜索初始化
	PackInit:function(){
		this.Pack.BeginDate = Common.GetDayDate(1)
		this.Pack.EndDate = Common.GetDayDate(7)
	},
	//填充Input
	FillInput:function(){
		var plan = $('#workFilter')
		$.each(this.Pack,function(k,v){
			plan.find('input[name="'+k+'"]').val(v)
		})
	},
	//填充Pack
	FillPack:function(){
		var plan = $('#workFilter')
		plan.find('input').each(function(){
			CollateFilter.Pack[this.name] = this.value
		})
	},
	//获取数据
	GetPack:function(){
		var param = {
			'BeginDate':this.Pack.BeginDate,
			'EndDate':this.Pack.EndDate
		}	
		return param
	},
	//绑定事件
	BindActions:function(){
		//面板事件
		var plan = $('#workFilter')
		plan.find('.confirm').unbind().click(function(){
			CollateFilter.FillPack()
			Main.Over(function(){
				CollatePanel.Index()
			})
			CollatePanel.HideMenu()
			plan.fadeOut(Config.FadeTime)
		})
		plan.find('.cancel,.close').unbind().click(function(){
			plan.fadeOut(Config.FadeTime)
			DateTime.HideDate()
		})
		//关闭日期
		plan.unbind().mousedown(function(e){
			if($(e.target).attr('class') != 'date'){
				DateTime.HideDate()
			}
		})
		//日期绑定
		plan.find('.date').unbind().click(function(){
			var self = this
			DateTime.Open(self,$(self).val(),function(date){
				$(self).val(date)
			})
		})
	},
	//显示面板
	ShowFilter:function(o,e){
		var plan = $('#workFilter')
		var top = $(o).offset().top + 50
		var left = $(o).offset().left - plan.outerWidth()
		plan.css({top:top,left:left}).show()
	}
}