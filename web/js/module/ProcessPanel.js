//进度类
var ProcessPanel = {
	//时间跨度
	DateList:{rows:{},list:[]},
	//初始化
	Init:function(){
		
	},
	//入口协议
	Index:function(){
		WSConn.sendMsg(C2L.C2L_PROCESS_VIEW,ProcessFilter.GetPack())
	},
	//设置时间范围
	SetDateRange:function(){
		var rows = {}
		var list = []
		var date = new Date(ProcessFilter.Pack.BeginDate)
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
			var K = info.y+'-'+info.m
			if(!rows[K]){
				rows[K] = 0
			}
			rows[K]++
			list.push(info)
			date.setDate(date.getDate() + 1)
			if(info.s == ProcessFilter.Pack.EndDate){
				break;
			}
		}
		ProcessPanel.DateList = {rows:rows,list:list}
	},
	//绑定事件
	BindActions:function(){
		//功能区域绑定
		Main.Content.unbind().delegate('.mode','mousedown',function(e){
			e.stopPropagation()
			ProcessPanel.HideMenu()
			TemplateManager.Hide()
			if(e.button !== Main.MouseDir) {
				return false
			}
			if(!User.IsWrite){
				return false
			}
			ProcessPanel.ShowMenuMode(this,e)
		}).find('.linkMap').unbind().delegate('td','mousedown',function(e){
			e.stopPropagation()
			//流程区域绑定
			ProcessPanel.HideMenu()
			TemplateManager.Hide()
			if(e.button !== Main.MouseDir) {
				return false
			}
			var type = $(this).attr('type')
			switch(type){
				case 'step':
					ProcessPanel.ShowMenuStep(this,e,User.IsWrite)
					break
				case 'duty':
					if(!User.IsWrite){
						return false
					}
					ProcessPanel.ShowMenuUser(this,e)
					break
				case 'link':
					if(!User.IsWrite){
						return false
					}
					ProcessPanel.ShowMenuLink(this,e)
					break
			}
			//console.log('鼠标右键点击',type,navigator.platform)
		}).delegate('td','mouseenter',function(e){
			e.stopPropagation()
			var grid = $(this).data('grid')
			if(!grid || grid.wid == 0){
				return true
			}
			var work = ProcessData.WorkMap[grid.wid]
			if(!work){
				return true
			}
			var info = []
			if(work.Tips != ''){
				info.push('<div>描述:'+work.Tips+'</div>')
			}
			if(work.MinNum > 0 || work.MaxNum > 0){
				info.push('<div>数量:'+work.MinNum+'/'+work.MaxNum+'</div>')
			}
			if(info.length > 0){
				var top = $(this).offset().top - 7
				var left = $(this).offset().left + $(this).width() + 8
				$('#workTips').css({top:top,left:left}).show().adjust(-5).html(info.join(''))
			}
		}).delegate('td','mouseleave',function(e){
			e.stopPropagation()
			$('#workTips').hide()
		})
		Main.Content.find('.title').unbind().delegate('td','mousedown',function(e){
			e.stopPropagation()
			//流程区域绑定
			ProcessPanel.HideMenu()
			TemplateManager.Hide()
			if(e.button !== Main.MouseDir) {
				return false
			}
			if(!User.IsWrite){
				return false
			}
			var index = $(this).index()
			if(index < 3){
				return false
			}
			ProcessPanel.ShowMenuPub(this,e)
		}).delegate('td','mouseenter',function(e){
			e.stopPropagation()
			if($(this).find('.stroke').length == 1){
				var top = $(this).offset().top - 7
				var left = $(this).offset().left + $(this).width() + 8
				var genre = $(this).find('.stroke').attr('genre')
				$('#workTips').css({top:top,left:left}).show().adjust(-5).html('<div>'+CollateData.VerList[genre]+'</div>')
			}
		}).delegate('td','mouseleave',function(e){
			e.stopPropagation()
			$('#workTips').hide()
		})
	},
	//组合头部
	GetTheadHtml:function(){
		var today = Common.GetDate(0)
		var html = ''
		html+= '<thead>'
		html+= '<tr> \
					<td colspan="3" class="tools">功能列表</td>'
		$.each(ProcessPanel.DateList.rows,function(date,num){
			var mt = date.substr(-2)
			if(num > 1){
				html+= '<td colspan="'+num+'" class="date_'+(parseInt(mt)%2)+'">'+date+'</td>'
			}else{
				html+= '<td class="date_'+(parseInt(mt)%2)+'">'+mt+'</td>'
			}
		})
		html+= '</tr> \
				<tr class="title"> \
					<td class="func">功能</td> \
					<td class="link">流程</td> \
					<td class="duty">负责人</td>'
		$.each(ProcessPanel.DateList.list,function(k,info){
			if(info.s == today){
				html+= '<td class="today">'
			}else{
				html+= '<td>'
			}
			html+= '<div class="info">'+info.d+'</div>'
			if(ProcessData.VerMap[info.s]){
				html+= '<div class="stroke sk_'+ProcessData.VerMap[info.s].Genre+'" genre="'+ProcessData.VerMap[info.s].Genre+'"></div>'
			}
			html+= '</td>'
		})
		html+= '</tr>'
		html+= '</thead>'
		return html
	},
	//组合流程
	GetLinkHtml:function(lid){
		var html = ''
		var link = ProcessData.LinkMap[lid]
		if(!link){
			return html
		}
		html+= '<tr lid="'+link.Lid+'"> \
					<td class="link bg_'+link.Color+'" type="link">'+(link.Name==''?'空':link.Name)+'</td> \
					<td class="duty" type="duty">'+Data.GetUser(link.Uid).Name+'</td>'
		//进度
		$.each(ProcessPanel.DateList.list,function(k,info){
			//填充
			if(info.w < 6){
				html+= '<td type="step"></td>'
			}else{
				html+= '<td type="step" class="weekend"></td>'
			}
		})
		html+= '</tr>'
		return html
	},
	//组合流程列表
	GetLinkListHtml:function(mode){
		var html = ''
		html+= '<table class="linkMap">'
		$.each(mode.LinkSort,function(k,lid){
			//流程与进度
			html+= ProcessPanel.GetLinkHtml(lid)
		})
		html+= '</table>'
		return html
	},
	//组合功能
	GetModeHtml:function(mid){
		var html = ''
		var mode = ProcessData.ModeMap[mid]
		if(!mode){
			return html
		}
		html+= '<tr> \
					<td class="mode bg_'+mode.Color+'" mid="'+mode.Mid+'">'+mode.Ver+(mode.Name==''?'空':mode.Name)+'</td> \
					<td colspan="'+(ProcessPanel.DateList.list.length+2)+'">'
		//流程
		html+= ProcessPanel.GetLinkListHtml(mode)
		html+= '</td> \
				</tr> \
				<tr class="space"><td colspan="'+(ProcessPanel.DateList.list.length+3)+'"></td></tr>'
		return html
	},
	//组合tbody
	GetTbodyHtml:function(){
		var html = ''
		html+= '<tbody>'
		//功能
		$.each(ProcessData.Project.ModeSort,function(k,mid){
			html+= ProcessPanel.GetModeHtml(mid)
		})
		html+= '</tbody>'
		return html
	},
	//建立内容
	CreateProcess:function(){
		//组合thead
		var html = '<div id="freezeTop" class="processLock"><div class="lockTop"><table class="process">'
		html+= ProcessPanel.GetTheadHtml()
		html+= '</table></div></div>'
		html+= '<div class="processLockBody"><table class="process">'
		//组合tbody
		html+= ProcessPanel.GetTbodyHtml()
		html+= '</table></div>'
		//流程数据
		Main.Draw(html).find('.linkMap tr').each(function(){
			var lid = parseInt($(this).attr('lid'))
			ProcessPanel.SetLinkData(lid,this)
		})
		$('#freezeTop').unbind().freezeTop()
	},
	//流程数据
	SetLinkData:function(lid,e){
		var linkWork = ProcessData.LinkWorkMap[lid]
		var dateList = ProcessPanel.DateList.list
		$(e).find('td:gt(1)').each(function(k,v){
			var grid = $.extend({},dateList[k])
			grid.lid = lid
			grid.wid = 0
			//填充
			if(linkWork && linkWork[grid.s]){
				grid.wid = linkWork[grid.s].Wid
				var work = ProcessData.WorkMap[grid.wid]
				ProcessPanel.ShowWorkGrid.call(this,grid,work)
			}
			//绑定grid
			$.data(this,'grid',grid)
		})
		//绑定lid
		$(e).data('lid',lid)
	},
	//显示一个work格子内容
	ShowWorkGrid:function(grid,work){
		var info = work.Tag
		if(info == ''){
			info = CollateData.StatusList[work.Status].Tag
		}
		info = '<div class="info">'+info+'</div>'
		if(work.Tips != '' || work.MinNum > 0 || work.MaxNum > 0){
			info+= '<div class="arrow-right"></div>'
		}
		if(ProcessData.ScoreMap[grid.wid] && ProcessData.ScoreMap[grid.wid].Quality > 0){
			info+= '<div class="arrow-left"></div>'
		}
		//uploading
		if(work.uploading){
			// info+= '<div class="work_uploading"></div>' //uploading时 work角标不用闪 所以这里先注释掉,用下一行的代码代替
			info+= '<div class="arrow-right-bottom"></div>'
		}else if(work.FileList && work.FileList.length>0){
			info+= '<div class="arrow-right-bottom"></div>'
		}
		//
		$(this).attr({'class':'ss_'+work.Status}).html(info)
	},
	//功能菜单
	ShowMenuMode:function(o,e){
		var mid = $(o).attr('mid')
		var top = e.pageY + 1
		var left = e.pageX + 1
		var mode = ProcessData.ModeMap[mid]
		$('#menuMode').css({left:left,top:top}).unbind().delegate('.row[type!="color"]','click',function(){
			var type = $(this).attr('type')
			switch(type){
				case 'insert':
					ProcessPanel.ShowEditMode(o,e,C2L.C2L_PROCESS_MODE_ADD)
					break
				case 'edit':
					ProcessPanel.ShowEditMode(o,e,C2L.C2L_PROCESS_MODE_EDIT)
					break
				case 'delete':
					Common.Warning(o,e,function(){
						WSConn.sendMsg(C2L.C2L_PROCESS_MODE_DELETE,{'Mid':mode.Mid})
					},'删除后不可恢复，确认删除吗？')
					break
				case 'forward':
					var prev = $(o).parent().prev().prev()
					if(prev.length > 0){
						var beMid = prev.find('.mode').attr('mid')
						WSConn.sendMsg(C2L.C2L_PROCESS_MODE_MOVE,{'Swap':[parseInt(beMid),mode.Mid],'Dir':'before'})
					}
					break
				case 'backward':
					var next = $(o).parent().next().next()
					if(next.length > 0){
						var beMid = next.find('.mode').attr('mid')
						WSConn.sendMsg(C2L.C2L_PROCESS_MODE_MOVE,{'Swap':[parseInt(beMid),mode.Mid],'Dir':'after'})
					}
					break
				case 'store':
					Common.Warning(o,e,function(){
						WSConn.sendMsg(C2L.C2L_PROCESS_MODE_STORE,{'Mid':mode.Mid})
					},'是否将已完成的功能进行归档？')
					break
			}
			ProcessPanel.HideMenu()
		}).show().adjust(-5).find('.row[type="color"]').unbind().hover(function(){
			$(this).find('.pluginColor').show().unbind().delegate('div','click',function(){
				WSConn.sendMsg(C2L.C2L_PROCESS_MODE_COLOR,{'Mid':mode.Mid,'Color':$(this).index()})
				ProcessPanel.HideMenu()
			})
		},function(){
			$(this).find('.pluginColor').hide()
		})
	},
	//编辑功能
	ShowEditMode:function(o,e,cid){
		TemplateManager.Hide();
		var mid = $(o).attr('mid')
		var mode = ProcessData.ModeMap[mid]
		var plan = $('#editMode').css({left:e.pageX,top:e.pageY}).show().adjust(-5)
		var name = plan.find('textarea').val('').focus()
		var ver = plan.find('.ver').val('')
		if(cid == C2L.C2L_PROCESS_MODE_EDIT){
			name.val(mode.Name).select()
			ver.val(mode.Ver)
			plan.find(".tpl_li").hide()
			plan.find(".tpl_edit").hide()
		} else {
			plan.find(".tpl_li").show();
			ProcessPanel.RefreshEditModeSelect();
			plan.find('.tpl_edit').show().unbind().click(function (e) {
				TemplateManager.ShowEditTplModeList(e)
			})
		}
		plan.find('.confirm').unbind().click(function(){
			var data = {'Mid':mode.Mid,'Did':Math.abs(ProjectNav.FilterDid),'Name':$.trim(name.val()),'Ver':ver.val()};
			if(cid==C2L.C2L_PROCESS_MODE_ADD){
				data["Tmid"] = parseInt(plan.find("#tplModeSelect").val())
			}
			WSConn.sendMsg(cid,data)
			plan.hide()
			TemplateManager.Hide()
		})
		plan.find('.cancel,.close').unbind().click(function(){
			plan.fadeOut(Config.FadeTime)
			TemplateManager.Hide()
		})
	},
	//选择模板的下拉框
	RefreshEditModeSelect:function(){
		/* var plan = $('#editMode')
		var select = plan.find(".tpl_select").empty()
		var len = TemplateManager.DataModes.length
		select.append("<option value='0'>不使用</option>");
		for (var i = 0; i < len; i++) {
			var mode = TemplateManager.DataModes[i];
			select.append("<option value='"+mode.Tmid+"'>"+mode.Name+"("+mode.Links.length+")</option>");
		} */
		TemplateManager.BindTplSelect("#place_tplModeSelect")
	},
	//内容菜单
	//IsWrite: true:管理员 false:非管理员
	ShowMenuStep:function(o,e,IsWrite){
		var top = e.pageY + 1
		var left = e.pageX + 1
		var grid = $(o).data('grid')
		//没有work状态的不显示某些选项
		if(grid.wid){
			$('#menuDay').find("[type=upload],[type=score],[type=clear]").find('.txt').removeClass('menu_disabled')
		}else{
			$('#menuDay').find("[type=upload],[type=score],[type=clear]").find('.txt').addClass('menu_disabled')
		}
		if(!IsWrite){
			//$('#menuDay').find(".extends,[type=work],[type=finish],[type=delay],[type=wait],[type=rest],[type=optimize],[type=edit],[type=score],[type=clear]").hide()
			$('#menuDay .row[type!=upload]').hide()
		}
		//
		$('#menuDay').css({left:left,top:top}).unbind().delegate('.row[type!="status"]','click',function(){
			var type = $(this).attr('type')
			switch(type){
				case 'work':
				case 'finish':
				case 'delay':
				case 'wait':
				case 'rest':
				case 'optimize':
					var status = $(this).attr('status')
					WSConn.sendMsg(C2L.C2L_PROCESS_GRID_CHANGE,{'Lid':grid.lid,'Wid':grid.wid,'Date':grid.s,'Status':parseInt(status)})
					break
				case 'edit':
					ProcessPanel.ShowEditStep(o)
					break
				case 'score'://评价
					if(grid.wid){
						ProcessPanel.OnShowEditScore(o)
					}
					break
				case 'upload'://附件
					if(grid.wid){
						UploadManager.ShowUploadWork(o,grid.wid)
					}
					break
				case 'clear':
					if(grid.wid){
						WSConn.sendMsg(C2L.C2L_PROCESS_GRID_CLEAR,{'Lid':grid.lid,'Wid':grid.wid,'Date':grid.s})
					}
					break
			}
			ProcessPanel.HideMenu()
		}).show().adjust(-5)
	},
	//编辑工作补充
	ShowEditStep:function(o){
		var cur = $(o).parent()
		var top = $(o).position().top - 2
		var left = $(o).position().left + $(o).outerWidth() - 2
		var plan = $('#editInfo').css({left:left,top:top}).show().adjust(-5)
		var tips = plan.find('textarea').val('').focus()
		var tag = plan.find('.tag').val('')
		var minNum = plan.find('.min').val(0)
		var maxNum = plan.find('.max').val(0)
		var grid = $(o).data('grid')
		var work = ProcessData.WorkMap[grid.wid]
		var pack = {}
		pack.Wid = 0
		if(work){
			tips.val(work.Tips).select()
			tag.val(work.Tag)
			minNum.val(work.MinNum)
			maxNum.val(work.MaxNum)
			pack.Wid = work.Wid
		}
		plan.find('.confirm').unbind().click(function(){
			pack.Lid = cur.data('lid')
			pack.Date = grid.s
			pack.Tips = tips.val()
			pack.MinNum = parseInt(minNum.val())
			pack.MaxNum = parseInt(maxNum.val())
			pack.Tag = tag.val()
			WSConn.sendMsg(C2L.C2L_PROCESS_WORK_EDIT,pack)
			$('#editInfo').hide()
		})
		plan.find('.cancel,.close').unbind().click(function(){
			plan.fadeOut(Config.FadeTime)
		})
	},
	//评价
	OnShowEditScore:function(o){
		var wid = $(o).data('grid').wid
		var cur = $(o).parent()
		var left = $(o).position().left + $(o).outerWidth() - 2
		var top = $(o).position().top - 2
		ProcessPanel.ShowEditScore(wid,left,top)
	},
	ShowEditScore:function(wid,left,top){
		var plan = $('#editScore').css({left:left,top:top}).show().adjust(-5)
		var info = plan.find('textarea').val('').focus()
		var qcos = plan.find('select:eq(0)').val('0')
		var ecos = plan.find('select:eq(1)').val('0')
		var mcos = plan.find('select:eq(2)').val('0')
		var score = ProcessData.ScoreMap[wid]
		if(score){
			info.val(score.Info).select()
			qcos.val(score.Quality)
			ecos.val(score.Efficiency)
			mcos.val(score.Manner)
		}
		UploadManager.ShowProcessWorkFileBox(wid)
		plan.find('.confirm').unbind().click(function(){
			WSConn.sendMsg(C2L.C2L_PROCESS_SCORE_EDIT,{'Wid':wid,'Quality':parseInt(qcos.val()),'Efficiency':parseInt(ecos.val()),'Manner':parseInt(mcos.val()),'Info':info.val()})
			$('#editScore').hide()
		})
		plan.find('.cancel,.close').unbind().click(function(){
			plan.fadeOut(Config.FadeTime)
		})
	},	
	//流程菜单
	ShowMenuLink:function(o,e){
		var cur = $(o).parent()
		var top = e.pageY + 1
		var left = e.pageX + 1
		$('#menuLink').css({left:left,top:top}).unbind().delegate('.row','click',function(){
			var type = $(this).attr('type')
			switch(type){
				case 'forward':
					var prev = cur.prev()
					if(prev.length > 0){
						WSConn.sendMsg(C2L.C2L_PROCESS_GRID_SWAP,{'Swap':[prev.data('lid'),cur.data('lid')],'Dir':'before'})
					}
					break
				case 'backward':
					var next = cur.next()
					if(next.length > 0){
						WSConn.sendMsg(C2L.C2L_PROCESS_GRID_SWAP,{'Swap':[next.data('lid'),cur.data('lid')],'Dir':'after'})
					}
					break
				case 'insert':
					ProcessPanel.ShowEditLink(o,C2L.C2L_PROCESS_GRID_ADD)
					break
				case 'edit':
					ProcessPanel.ShowEditLink(o,C2L.C2L_PROCESS_LINK_EDIT)
					break
				case 'store':
					Common.Warning(o,e,function(){
						WSConn.sendMsg(C2L.C2L_PROCESS_LINK_STORE,{'Lid':cur.data('lid')})
					},'是否将已完成的流程进行归档？')
					break
				case 'delete':
					if(cur.parent().find('tr').length > 1){
						Common.Warning(o,e,function(){
							WSConn.sendMsg(C2L.C2L_PROCESS_LINK_DELETE,{'Lid':cur.data('lid')})
						},'删除后不可恢复，确认删除吗？')
					}
					break
			}
			ProcessPanel.HideMenu()
		}).show().adjust(-5).find('.row[type="color"]').unbind().hover(function(){
			$(this).find('.pluginColor').show().unbind().delegate('div','click',function(){
				WSConn.sendMsg(C2L.C2L_PROCESS_LINK_COLOR,{'Lid':cur.data('lid'),'Color':$(this).index()})
				ProcessPanel.HideMenu()
			})
		},function(){
			$(this).find('.pluginColor').hide()
		})
	},
	//编辑流程名字
	ShowEditLink:function(o,cid){
		var cur = $(o).parent()
		var lid = cur.data('lid')
		var top = $(o).position().top - 2
		var left = $(o).position().left + $(o).outerWidth() - 2
		var link = ProcessData.LinkMap[lid]
		var plan = $('#editLink').css({left:left,top:top}).show().adjust(-5)
		var name = plan.find('textarea').val('').focus()
		if(cid == C2L.C2L_PROCESS_LINK_EDIT){
			name.val(link.Name).select()
		}
		plan.find('.confirm').unbind().click(function(){
			WSConn.sendMsg(cid,{'Lid':lid,'Name':$.trim(name.val())})
			$('#editLink').hide()
		})
		plan.find('.cancel,.close').unbind().click(function(){
			plan.fadeOut(Config.FadeTime)
		})
	},
	//人员菜单
	ShowMenuUser:function(o,e){
		var top = e.pageY + 1
		var left = e.pageX + 1
		var lid = $(o).parent().data('lid')
		var plan = $('#menuUser')
		plan.css({left:left,top:top}).unbind().delegate('.spread .row','click',function(){
			var uid = $(this).attr('uid')
			if(uid){
				WSConn.sendMsg(C2L.C2L_PROCESS_USER_CHANGE,{'Lid':lid,'Uid':parseInt(uid)})
				ProcessPanel.HideMenu()
			}
		}).show().adjust(-5)
	},
	//发布菜单
	ShowMenuPub:function(o,e){
		var cur = $(o).parent()
		var top = e.pageY + 1
		var left = e.pageX + 1
		var index = $(o).index() - 3
		var info = ProcessPanel.DateList.list[index]
		$('#pubMenu').css({left:left,top:top}).unbind().delegate('.row','click',function(){
			var type = $(this).attr('type')
			switch(type){
				case 'begin':
				case 'end':
				case 'seal':
				case 'delay':
				case 'pub':
				case 'summary':
					WSConn.sendMsg(C2L.C2L_PROCESS_PUBLISH_EDIT,{'DateLine':info.s,'Genre':$(this).index()+1})
					break
				case 'del':
					WSConn.sendMsg(C2L.C2L_PROCESS_PUBLISH_DELETE,{'DateLine':info.s})
					break
			}
			//console.log($(this).index())
			ProcessPanel.HideMenu()
		}).show().adjust(-5)
	},
	//选中迷你小匡
	ShowMiniBox:function(e){
		console.log('鼠标左键点击',e.target.localName)
		
		
		var offset = $(e.target).offset()
		var top = offset.top
		var left = offset.left
		var height = 38
		var width = 38
		
		//$(o).append($('#commonMini').show().css({'height':height,'width':width}))
		
		
		
		$('#commonMini').show().css({'top':top,'left':left,'height':height,'width':width}).unbind().bind('mousedown',function(ev){
			if(ev.button !== Main.MouseDir){
				return false
			}
			//下层的元素
			//$(o).mousedown()
			console.log(e)
		})
		
		//clientHeight
		//offsetHeight
	},
	//关闭所有菜单
	HideMenu:function(){
		$('#menuUser,#menuLink,#menuDay,#menuMode,#pubMenu,#workTips,#dateTime,#menuStep,#menuExtra,#menuDepartment').hide()
	}
}