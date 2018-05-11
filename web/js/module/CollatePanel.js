//晨会面板
var CollatePanel = {
	//日期数据
	DateList:{},
	//初始化
	Init:function(){
		
	},
	//入口协议
	Index:function(){
		WSConn.sendMsg(C2L.C2L_COLLATE_VIEW,CollateFilter.GetPack())
	},
	//日期范围
	SetDateRange:function(){
		var list = []
		var date = new Date(CollateFilter.Pack.BeginDate)
		while(true){
			var info = {}
			info.y = date.getFullYear()
			info.m = date.getMonth() + 1
			info.d = date.getDate()
			info.w = date.getDay()
			info.m = info.m>=10?info.m:('0'+info.m)
			info.d = info.d>=10?info.d:('0'+info.d)
			info.w = info.w==0?7:info.w
			info.s = info.y+'-'+info.m+'-'+info.d
			list.push(info)
			date.setDate(date.getDate() + 1)
			if(info.s == CollateFilter.Pack.EndDate){
				break;
			}
		}
		CollatePanel.DateList = list
	},
	//组合头部
	GetTheadHtml:function(){
		var html = ''
		html+= '<tr class="title">'
		html+= '<td class="type_0">日期</td>'
		$(Data.UserList).each(function(){
			if(this.Did == 0){
				return true
			}
			if(this.IsHide == 1){
				return true
			}
			html+= '<td class="type_'+this.Did+'">'+this.Name+'</td>'
		})
		html+= '</tr>'
		return html
	},
	//组合tbody
	GetTbodyHtml:function(){
		var today = Common.GetDate(0)
		var day = Common.GetDay(today)
		var html = ''
		$.each(this.DateList,function(r,d){
			var trClass = []
			if(d.w >= 6){
				trClass.push('weekend')
			}
			html+= '<tr class="'+trClass.join(' ')+'" date="'+d.s+'">'
			var tdClass = ['frist']
			if(d.s == today){
				tdClass.push('today')
			}
			html+= '<td class="'+tdClass.join(' ')+'">'
			html+= '<dl>'
			if(CollateData.VerMap[d.s]){
				html+= '<dd class="notice sk_'+CollateData.VerMap[d.s].Genre+'">['+CollateData.VerList[CollateData.VerMap[d.s].Genre]+']</dd>'
			}
			html+= '<dt>'+d.s+'</dt>'
			html+= '<dd>星期'+DateTime.WeekMap[d.w-1]+'</dd>'
			
			html+= '</dl>'
			html+= '</td>'
			var cols = 1
			$(Data.UserList).each(function(k,u){
				if(this.Did == 0){
					return true
				}
				if(this.IsHide == 1){
					return true
				}
				html+= '<td uid="'+u.Uid+'"><ol>'
				//进度内容
				if(CollateData.DateUserMap[d.s] && CollateData.DateUserMap[d.s][u.Uid]){
					$.each(CollateData.DateUserMap[d.s][u.Uid],function(k,w){
						html+= CollatePanel.GetWorkInfo(w)
					})
				}
				//补充内容
				if(CollateData.DateExtraMap[d.s] && CollateData.DateExtraMap[d.s][u.Uid]){
					$.each(CollateData.DateExtraMap[d.s][u.Uid],function(k,e){
						html+= CollatePanel.GetWorkExtra(e)
					})
				}
				html+= '</ol>'
				if(r >= (day-2)){
					//html+= '<div class="extra">+添加内容...</div>'
				}
				html+= '</td>'
				cols++
			})
			html+= '</tr>'
			if(d.w == 7){
				html+= '<tr class="space"><td colspan="'+cols+'"></td></tr>'
			}
		})
		return html
	},
	//工作补充
	GetWorkExtra:function(e){
		var html = ''
		html+= '<li eid="'+e.Eid+'">'
		html+= '<span class="check_'+e.Inspect+'">'+e.Name+'</span>'
		html+= '<span class="special">（'+CollateData.InspectList[e.Inspect]+'）</span>'
		html+= '<span class="edit">√</span>'
		html+= '</li>'
		return html
	},
	//工作内容
	GetWorkInfo:function(w){
		var html = ''
		var link = CollateData.LinkMap[w.Lid]
		html+= '<li wid="'+w.Wid+'">'
		html+= '<span class="check_'+w.Inspect+'">'+CollateData.ModeMap[link.Mid].Ver+CollateData.ModeMap[link.Mid].Name+'-'+link.Name+'</span>'
		html+= '<span class="special">'
		if(w.MinNum > 0 || w.MaxNum > 0){
			html+= '（'+w.MinNum+'/'+w.MaxNum+'）'
		}
		if(w.Tips != ''){
			html+= '（'+w.Tips+'）'
		}
		if(w.Tag != ''){
			var TagInfo = CollateData.TagsMap[w.Tag]
			if(TagInfo){
				html+= '（'+TagInfo.Info+'）'
			}else{
				html+= '（'+w.Tag+'）'
			}
		}else{
			html+= '（'+CollateData.StatusList[w.Status].Info+'）'
		}
		html+= '</span>'
		html+= '</li>'
		return html
	},
	//建立内容
	CreateCollate:function(){
		//组合thead
		var html = '<div id="freezeTop" class="collateLock"><div class="lockTop"><table class="collate" id="rowLock">'
		html+= CollatePanel.GetTheadHtml()
		html+= '</table></div></div>'
		html+= '<div class="collateLockBody"><table class="collate">'
		//组合tbody
		html+= CollatePanel.GetTbodyHtml()
		html+= '</table></div>'
		Main.Draw(html)
		$('#freezeTop').unbind().freezeTop()
	},
	//事件绑定
	BindActions:function(){
		//功能区域绑定
		Main.Content.unbind().delegate('li','click',function(e){
			CollatePanel.HideMenu()
			/*
			if(e.button !== Main.MouseDir) {
				return false
			}
			*/
			if(!User.IsWrite){
				return false
			}
			if($(this).is('[wid]')){
				CollatePanel.ShowStepMenu(this,e)
			}else{
				CollatePanel.ShowExtraMenu(this,e)
			}
		}).delegate('td','click',function(e){
			if(!User.IsWrite){
				return false
			}
			switch(e.target.localName){
				case 'td':
					CollatePanel.HideMenu()
					break
				case 'div':
					CollatePanel.HideMenu()
					CollatePanel.ShowExtraEdit(this,e)
					break
			}
		})
	},
	//显示菜单
	ShowStepMenu:function(o,e){
		var wid = $(o).attr('wid')
		var top = e.pageY + 1
		var left = e.pageX + 1
		$('#menuStep').css({left:left,top:top}).unbind().delegate('.row','click',function(){
			var type = $(this).attr('type')
			switch(type){
				case 'cancel':
				case 'finish':
				case 'last':
				case 'defer':
					var inspect = $(this).attr('inspect')
					WSConn.sendMsg(C2L.C2L_COLLATE_STEP_EDIT,{'Wid':parseInt(wid),'Inspect':parseInt(inspect)})
					break
			}
			CollatePanel.HideMenu()
		}).show().adjust(-5)
	},
	//显示补充
	ShowExtraMenu:function(o,e){
		var top = e.pageY + 1
		var left = e.pageX + 1
		$('#menuExtra').css({left:left,top:top}).unbind().delegate('.row','click',function(){
			CollatePanel.HideMenu()
			var type = $(this).attr('type')
			switch(type){
				case 'edit':
					CollatePanel.ShowExtraEdit(o,e)
					break
				case 'delete':
					var eid = $(o).attr('eid')
					WSConn.sendMsg(C2L.C2L_COLLATE_EXTRA_DELETE,{'Eid':parseInt(eid)})
					break
			}
		}).show().adjust(-5)
	},
	//编辑面板
	ShowExtraEdit:function(o,e){
		var top = e.pageY + 1
		var left = e.pageX + 1
		var plan = $('#addStep').css({left:left,top:top}).unbind().show().adjust(-5)
		var name = plan.find('textarea').val('').focus()
		var eid = $(o).attr('eid') | 0
		var param = {}
		param.Eid = parseInt(eid)
		param.Inspect = 1
		if(param.Eid > 0){
			var extra = CollateData.ExtraMap[eid]
			name.val(extra.Name)
			param.Inspect = extra.Inspect
		}
		plan.find('.confirm').unbind().click(function(){
			var inspect = plan.find('.inspect .on').index() + 1
			if(param.Eid > 0){
				WSConn.sendMsg(C2L.C2L_COLLATE_EXTRA_EDIT,{'Eid':param.Eid,'Name':name.val(),'Inspect':inspect})
			}else{
				var date = $(o).parent().attr('date')
				var uid = $(o).attr('uid')
				WSConn.sendMsg(C2L.C2L_COLLATE_STEP_ADD,{'Uid':parseInt(uid),'Date':date,'Name':name.val(),'inspect':inspect})
			}
			plan.hide()
		})
		plan.find('.inspect').unbind().delegate('div','click',function(){
			plan.find('.inspect div').removeClass('on')
			$(this).addClass('on')
		}).find('div').removeClass('on').eq(param.Inspect - 1).addClass('on')
		plan.find('.cancel,.close').unbind().click(function(){
			plan.fadeOut(Config.FadeTime)
		})
	},
	//关闭菜单
	HideMenu:function(){
		$('#menuStep,#menuExtra,#addStep').hide()
	}
}