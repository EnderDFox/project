//晨会筛选
class CollateFilterClass {
	//数据包
	Pack: IDateBeginAndEnd = { BeginDate: '', EndDate: '' }
	//初始化
	Init() {
		//数据初始
		this.PackInit()
		//填充数据
		this.FillInput()
		//绑定事件
		this.BindActions()
	}
	//搜索初始化
	PackInit() {
		this.Pack.BeginDate = Common.GetDayDate(1)
		this.Pack.EndDate = Common.GetDayDate(7)
	}
	//填充Input
	FillInput() {
		var plan = $('#workFilter')
		$.each(this.Pack, function (k, v) {
			plan.find('input[name="' + k + '"]').val(v)
		})
	}
	//填充Pack
	FillPack() {
		var plan = $('#workFilter')
		plan.find('input').each((k, v: HTMLInputElement) => {
			this.Pack[v.name] = v.value
		})
	}
	//获取数据
	GetPack(): IDateBeginAndEnd {
		var param = {
			BeginDate: this.Pack.BeginDate,
			EndDate: this.Pack.EndDate
		}
		return param
	}
	//绑定事件
	BindActions() {
		//面板事件
		var plan = $('#workFilter')
		plan.find('.confirm').unbind().click(() => {
			this.FillPack()
			Main.Over(function () {
				CollatePanel.Index()
			})
			CollatePanel.HideMenu()
			plan.fadeOut(Config.FadeTime)
		})
		plan.find('.cancel,.close').unbind().click(() => {
			plan.fadeOut(Config.FadeTime)
			DateTime.HideDate()
		})
		//关闭日期
		plan.unbind().mousedown((e: JQuery.Event) => {
			if ($(e.currentTarget).attr('class') != 'date') {
				DateTime.HideDate()
			}
		})
		//日期绑定
		plan.find('.date').unbind().click((e: JQuery.Event) => {
			var el = e.currentTarget as HTMLInputElement
			DateTime.Open(el, $(el).val(), (date: string) => {
				$(el).val(date)
			})
		})
	}
	//显示面板
	ShowFilter(o:HTMLElement, e:JQuery.Event) {
		var plan = $('#workFilter')
		var top = $(o).offset().top + 50
		var left = $(o).offset().left - plan.outerWidth()
		plan.css({ top: top, left: left }).show()
	}
}

var CollateFilter = new CollateFilterClass()