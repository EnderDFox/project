//进度管理
var ProcessManager = {
	//注册函数
	RegisterFunc:function(){
		Commond.Register(L2C.L2C_PROCESS_VIEW,ProcessManager.View)
		Commond.Register(L2C.L2C_PROCESS_GRID_CHANGE,ProcessManager.GridChange)
		Commond.Register(L2C.L2C_PROCESS_GRID_CLEAR,ProcessManager.GridClear)
		Commond.Register(L2C.L2C_PROCESS_USER_CHANGE,ProcessManager.UserChange)
		Commond.Register(L2C.L2C_PROCESS_GRID_SWAP,ProcessManager.GridSwap)
		Commond.Register(L2C.L2C_PROCESS_GRID_ADD,ProcessManager.GridAdd)
		Commond.Register(L2C.L2C_PROCESS_LINK_DELETE,ProcessManager.LinkDelete)
		Commond.Register(L2C.L2C_PROCESS_LINK_EDIT,ProcessManager.LinkEdit)
		Commond.Register(L2C.L2C_PROCESS_WORK_EDIT,ProcessManager.WorkEdit)
		Commond.Register(L2C.L2C_PROCESS_MODE_EDIT,ProcessManager.ModeEdit)
		Commond.Register(L2C.L2C_PROCESS_MODE_ADD,ProcessManager.ModeAdd)
		Commond.Register(L2C.L2C_PROCESS_MODE_DELETE,ProcessManager.ModeDelete)
		Commond.Register(L2C.L2C_PROCESS_MODE_COLOR,ProcessManager.ModeColor)
		Commond.Register(L2C.L2C_PROCESS_LINK_COLOR,ProcessManager.LinkColor)
		Commond.Register(L2C.L2C_PROCESS_SCORE_EDIT,ProcessManager.ScoreEdit)
		Commond.Register(L2C.L2C_PROCESS_MODE_MOVE,ProcessManager.ModeMove)
		Commond.Register(L2C.L2C_PROCESS_MODE_STORE,ProcessManager.ModeStore)
		Commond.Register(L2C.L2C_PROCESS_LINK_STORE,ProcessManager.LinkStore)
		Commond.Register(L2C.L2C_PROCESS_PUBLISH_EDIT,ProcessManager.PublishEdit)
		Commond.Register(L2C.L2C_PROCESS_PUBLISH_DELETE,ProcessManager.PublishDelete)
	},
	//预览
	View:function(data){
		ProcessData.Init(data)
		ProcessPanel.SetDateRange()
		ProcessPanel.CreateProcess()
		ProcessPanel.BindActions()
	},
	//改变工作
	GridChange:function(data){
		ProcessManager.WorkEdit(data)
		/*
		//数据变化
		ProcessData.WorkMap[data.Wid] = data
		$('#content tr[lid="'+data.Lid+'"] td').each(function(){
			var grid = $(this).data('grid')
			if(!grid){
				return true
			}
			if(data.Date == grid.s){
				$(this).removeClass().addClass('ss_'+data.Status)
				grid.wid = data.Wid
				return false
			}
		})
		*/
	},
	//清空工作
	GridClear:function(data){
		var work = ProcessData.WorkMap[data.Wid]
		$('#content tr[lid="'+work.Lid+'"] td').each(function(){
			var grid = $(this).data('grid')
			if(!grid){
				return true
			}
			if(work.Date == grid.s){
				$(this).removeClass().empty()
				if(grid.w >= 6){
					$(this).addClass('weekend')
				}
				grid.wid = 0
				return false
			}
		})
		//数据变化
		delete ProcessData.WorkMap[data.Wid]
	},
	//改变责任
	UserChange:function(data){
		//数据变化
		ProcessData.LinkMap[data.Lid] = data
		$('#content tr[lid="'+data.Lid+'"] td:eq(1)').html(Data.GetUser(data.Uid).Name)
	},
	//交换流程
	GridSwap:function(data){
		//数据变化
		ProcessData.ModeMap[data.ModeSingle.Mid] = data.ModeSingle
		var A = $('#content tr[lid="'+data.Swap[0]+'"]')
		var B = $('#content tr[lid="'+data.Swap[1]+'"]')
		if(data.Dir == 'before'){
			A.before(B)
		}else{
			A.after(B)
		}
	},
	//新增流程
	GridAdd:function(data){
		//数据变化
		ProcessData.ModeMap[data.ModeSingle.Mid] = data.ModeSingle
		ProcessData.LinkMap[data.LinkSingle.Lid] = data.LinkSingle
		var add = $(ProcessPanel.GetLinkHtml(data.LinkSingle.Lid))
		$('#content tr[lid="'+data.Lid+'"]').after(add)
		//绑定数据
		ProcessPanel.SetLinkData(data.LinkSingle.Lid,add)
	},
	//删除流程
	LinkDelete:function(data){
		//数据变化
		ProcessData.ModeMap[data.ModeSingle.Mid] = data.ModeSingle
		delete ProcessData.LinkMap[data.Lid]
		$('#content tr[lid="'+data.Lid+'"]').remove()
	},
	//流程名字
	LinkEdit:function(data){
		//数据变化
		ProcessData.LinkMap[data.Lid] = data
		$('#content tr[lid="'+data.Lid+'"] .link').attr('class','link bg_'+data.Color).html(data.Name==''?'空':data.Name)
	},
	//工作补充
	WorkEdit:function(data){
		//数据变化
		ProcessData.WorkMap[data.Wid] = data
		$('#content tr[lid="'+data.Lid+'"] td').each(function(){
			var grid = $(this).data('grid')
			if(!grid){
				return true
			}
			if(data.Date == grid.s){
				grid.wid = data.Wid
				ProcessPanel.ShowWorkGrid(this,grid,data)
				/* var info = data.Tag
				if(info == ''){
					info = CollateData.StatusList[data.Status].Tag
				}
				info = '<div class="info">'+info+'</div>'
				if(data.Tips != '' || data.MinNum > 0 || data.MaxNum > 0){
					info+= '<div class="arrow-right"></div>'
				}
				if(ProcessData.ScoreMap[grid.wid] && ProcessData.ScoreMap[grid.wid].Quality > 0){
					info+= '<div class="arrow-left"></div>'
				}
				//uploading
				if(data.uploading){
					info+= '<div class="uploading">▲</div>'
				}else//arrow-right-bottom
				if(data.FileList && data.FileList.length>0){
					info+= '<div class="arrow-right-bottom"></div>'
				}
				//
				$(this).attr({'class':'ss_'+data.Status}).html(info) */
				return false
			}
		})
	},
	//编辑功能
	ModeEdit:function(data){
		//数据变化
		ProcessData.ModeMap[data.Mid] = data
		$('#content .mode[mid="'+data.Mid+'"]').html(VersionManager.GetVersionVer(data.Vid)+(data.Name==''?'空':data.Name))
	},
	//添加功能
	ModeAdd:function(data){
		//数据变化
		ProcessData.ModeMap[data.ModeSingle.Mid] = data.ModeSingle
		// ProcessData.LinkMap[data.LinkSingle.Lid] = data.LinkSingle
		var len = data.LinkList.length
		for (var i = 0; i < len; i++) {
			var link = data.LinkList[i];
			ProcessData.LinkMap[link.Lid] = link
		}		
		var add = $(ProcessPanel.GetModeHtml(data.ModeSingle.Mid))
		$('#content .mode[mid="'+data.Mid+'"]').parent().next().after(add)
		//绑定流程数据
		add.find('.linkMap tr').each(function(){
			var lid = parseInt($(this).attr('lid'))
			ProcessPanel.SetLinkData(lid,this)
		})
		ProcessPanel.BindActions()
	},
	//删除功能
	ModeDelete:function(data){
		//数据变化
		ProcessData.Project = data.ProjectSingle
		var mode = ProcessData.ModeMap[data.Mid]
		if(!mode){
			return
		}
		$.each(mode.LinkSort,function(k,lid){
			//删除工作
			$.each(ProcessData.WorkMap,function(k,v){
				if(v.Lid != lid){
					return true
				}
				delete ProcessData.WorkMap[v.Wid]
			})
			//删除流程
			delete ProcessData.LinkMap[lid]
		})
		//删除功能
		delete ProcessData.ModeMap[data.Mid]
		var del = $('#content .mode[mid="'+data.Mid+'"]').parent()
		del.next().remove()
		del.remove()
	},
	//功能颜色
	ModeColor:function(data){
		//数据变化
		ProcessData.ModeMap[data.Mid] = data
		$('#content .mode[mid="'+data.Mid+'"]').removeClass().addClass('mode bg_'+data.Color)
	},
	//流程颜色
	LinkColor:function(data){
		//数据变化
		ProcessData.LinkMap[data.Lid] = data
		$('#content tr[lid="'+data.Lid+'"] .link').attr('class','link bg_'+data.Color).html(data.Name==''?'空':data.Name)
	},
	//设置评分
	ScoreEdit:function(data){
		//数据变化
		if(data.Score == 0){
			delete ProcessData.ScoreMap[data.Wid]
		}else{
			ProcessData.ScoreMap[data.Wid] = data
		}
		var work = ProcessData.WorkMap[data.Wid]
		ProcessManager.WorkEdit(work)
		NoticeManager.ScoreEdit(data)
	},
	//功能交换
	ModeMove:function(data){
		//数据变化
		ProcessData.Project = data.ProjectSingle
		var A = $('#content .mode[mid="'+data.Swap[0]+'"]').parent()
		if(A.length == 0){
			return false
		}
		var AN = A.next()
		var B = $('#content .mode[mid="'+data.Swap[1]+'"]').parent()
		if(B.length == 0){
			return false
		}
		var BN = B.next()
		if(data.Dir == 'before'){
			A.before(B)
			A.before(AN)
		}else{
			A.after(B)
			B.before(BN)
		}
	},
	//归档处理
	ModeStore:function(data){
		//在进行状态中
		if(ProcessFilter.Pack.ModeStatus == 0){
			var mode = ProcessData.ModeMap[data.Mid]
			$.each(mode.LinkSort,function(k,lid){
				//删除工作
				$.each(ProcessData.WorkMap,function(k,v){
					if(v.Lid != lid){
						return true
					}
					delete ProcessData.WorkMap[v.Wid]
				})
				//删除流程
				delete ProcessData.LinkMap[lid]
			})
			delete ProcessData.ModeMap[data.Mid]
			var del = $('#content .mode[mid="'+data.Mid+'"]').parent()
			del.next().remove()
			del.remove()
		}
	},
	//归档处理
	LinkStore:function(data){
		//在进行状态中
		if(ProcessFilter.Pack.LinkStatus == 0){
			//数据变化
			delete ProcessData.LinkMap[data.Lid]
			$('#content tr[lid="'+data.Lid+'"]').remove()
		}
	},
	/**
	 * @data PublishSingle 
	 */
	PublishEdit:function(data){
		$.each(ProcessPanel.DateList.list,function(k,v){
			if(data.DateLine != v.s){
				return true
			}
			var pub = $('#content .title td:eq('+(k+3)+')')
			pub.find('.stroke').remove()
			pub.append('<div class="stroke sk_'+data.Genre+'" date_line="'+data.DateLine+'"></div>')
			return false
		})
		//数据变化
		// ProcessData.VersionDateLineMap[data.DateLine] = data		//VersionManager中设置了 这里不需要了
	},
	/**
	 * @dateLine PublishSingle.DateLine
	 */
	PublishDelete:function(dateLine){
		$.each(ProcessPanel.DateList.list,function(k,v){
			if(dateLine != v.s){
				return true
			}
			$('#content .title td:eq('+(k+3)+')').find('.stroke').remove()
			return false
		})
		//数据变化
		// delete ProcessData.VersionDateLineMap[data.DateLine]
	}
}