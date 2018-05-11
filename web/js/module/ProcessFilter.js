//进度筛选
var ProcessFilter = {
	//数据包
	Pack:{'BeginDate':'','EndDate':'','ModeName':'','Ver':'','ModeStatus':0,'LinkStatus':0,'LinkName':'','LinkUserName':''},
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
		this.Pack.BeginDate = Common.GetDate(-7)
		this.Pack.EndDate = Common.GetDate(31)
		this.Pack.ModeName = ''
		this.Pack.Ver = ''
		this.Pack.ModeStatus = 0
		this.Pack.LinkStatus = 0
		this.Pack.LinkName = ''
		this.Pack.LinkUserName = ''
	},
	//填充Input
	FillInput:function(){
		var plan = $('#stepFilter')
		$.each(this.Pack,function(k,v){
			plan.find('input[name="'+k+'"]').val(v)
		})
	},
	//填充Pack
	FillPack:function(){
		var plan = $('#stepFilter')
		plan.find('input').each(function(){
			ProcessFilter.Pack[this.name] = this.value
		})
	},
	//设置Pack
	SetPack:function(key,val){
		this.Pack[key] = val
	},
	//重置Pack
	ResetPack:function(){
		var plan = $('#stepFilter')
		plan.find('input').val('')
		this.PackInit()
		this.FillInput()
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
		var plan = $('#stepFilter')
		plan.find('.confirm').unbind().click(function(){
			ProcessFilter.FillPack()
			Main.Over(function(){
				ProcessPanel.Index()
			})
			ProcessPanel.HideMenu()
			plan.fadeOut(Config.FadeTime)
		})
		plan.find('.cancel,.close').unbind().click(function(){
			plan.fadeOut(Config.FadeTime)
			DateTime.HideDate()
			$('#storeMenu').hide()
		})
		//关闭日期
		plan.unbind().mousedown(function(e){
			if($(e.target).attr('class') != 'date'){
				DateTime.HideDate()
			}
			if($(e.target).attr('class') != 'select'){
				$('#storeMenu').hide()
			}
		})
		//日期绑定
		plan.find('.date').unbind().click(function(){
			var self = this
			DateTime.Open(self,$(self).val(),function(date){
				$(self).val(date)
			})
		})
		//归档绑定
		plan.find('.select').unbind().click(function(e){
			var menu = $('#storeMenu')
			var type = $(this).attr('stype')
			var self = this
			var top = $(this).offset().top + $(this).outerHeight() + 2
			var left = $(this).offset().left /*- menu.outerWidth() - 2*/
			menu.css({left:left,top:top}).unbind().delegate('.row','click',function(){
				$(self).val($(this).find('.txt').html())
				menu.hide()
				ProcessFilter.SetPack(type,$(this).index() - 1)
			}).show()
		})
		//用户搜索
		plan.find('.user').unbind().bind('input',function(){
			var html = ''
			var self = this
			var sear = $('#searchUser')
			$.each(Data.UserList,function(k,v){
				if(self.value == ''){
					return true
				}
				if(v.Name.indexOf(self.value) == -1){
					return true
				}
				html+= '<li uid="'+v.Uid+'">'+v.Name+'</li>'
			})
			if(html != ''){
				var top = $(self).offset().top + $(self).outerHeight()
				var left = $(self).offset().left
				sear.css({top:top,left:left}).unbind().delegate('li','click',function(){
					sear.hide()
					$(self).val($(this).html())
				}).html(html).show()
			}else{
				sear.hide()
			}
		}).blur(function(e){
			ProcessFilter.SetPack('LinkUid',$.trim(this.value))
		})
		//选中效果
		plan.find('input:not([readonly])').focus(function(){
			$(this).select()
		})
	},
	//显示面板
	ShowFilter:function(o,e){
		var plan = $('#stepFilter')
		var top = $(o).offset().top + 50
		var left = $(o).offset().left - plan.outerWidth()
		plan.css({top:top,left:left}).show()
	}
}
