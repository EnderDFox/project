//项目导航
var ProjectNav = {
	//过滤器
	FilterDid:0,
	//菜单选择
	NavMenu:1,
	//初始化
	Init:function(){
		//筛选器
		ProcessFilter.Init()
		CollateFilter.Init()
		//初始化
		ProcessPanel.Init()
		TemplateManager.Init()
		//初始化
		CollatePanel.Init()
		//绑定事件
		ProjectNav.BindActions()

		UploadManager.Init()
	},
	//绑定事件
	BindActions:function(){
		var plan = $('#projectNav')
		//子菜单事件
		plan.find('.body').delegate('li','click',function(){
			ProcessPanel.HideMenu()
			if($(this).hasClass('on')){
				return false
			}
			plan.find('.body li').removeClass()
			var did = $(this).addClass('on').attr('did')
			ProjectNav.FilterDid = parseInt(did)
			//ProcessFilter.ResetPack()
			//ProcessPanel.Index()
			Main.Over(function(){
				ProcessPanel.Index()
			})
		})
		//父菜单事件
		plan.find('.head').delegate('li','click',function(){
			ProcessPanel.HideMenu()
			ProjectNav.HideMenu()
			if($(this).hasClass('on')){
				return false
			}
			plan.find('.head li').removeClass()
			$(this).addClass('on')
			var type = $(this).attr('type')
			switch(type){
				case 'ProfilePanel':
					ProjectNav.ProfilePanelShow()
					break
				case 'ProcessPanel':
					ProjectNav.ProcessPanelShow()
					break
				case 'CollatePanel':
					ProjectNav.CollatePanelShow()
					break
			}
		}).find('li:eq('+ProjectNav.NavMenu+')').click()
		//筛选
		$('#projectSer').click(function(e){
			switch(ProjectNav.NavMenu){
				case 1:
					ProcessPanel.HideMenu()
					ProcessFilter.ShowFilter(this,e)
					break
				case 2:
					CollatePanel.HideMenu()
					CollateFilter.ShowFilter(this,e)
					break
			}
		})
		//保存
		$('#saveFile').click(function(){
			switch(ProjectNav.NavMenu){
				case 0:
					break
				case 1:
					break
				case 2:
					Main.Over(function(){
						WSConn.sendMsg(C2L.C2L_SAVE_COLLATE,CollateFilter.Pack)
					})
					break
			}
		})
		plan.find(".tpl_edit").click(function(e){
			TemplateManager.ShowEditTplModeList(e)
		})
		//信息提示
		NoticePanel.BindActions()
	},
	//个人主页
	ProfilePanelShow:function(){
		var plan = $('#projectNav')
		Main.Over(function(){
			ProfilePanel.Index()
		})
		$('#saveFile,#projectSer').hide()
		plan.find(".tpl_edit").hide()
		ProjectNav.NavMenu = 0
	},
	//进度面板
	ProcessPanelShow:function(){
		var plan = $('#projectNav')
		Main.Over(function(){
			ProcessPanel.Index()
		})
		plan.find('.body li').removeClass().filter('[did="'+ProjectNav.FilterDid+'"]').addClass('on')
		plan.find('.menu').show()
		$('#projectSer').show()
		$('#saveFile').hide()
		// plan.find(".tpl_edit").show()//暂时不需要这个入口
		plan.find(".tpl_edit").hide()
		ProjectNav.NavMenu = 1
		if(Loader.isDebug){
			plan.find('.test_fox').show().on('click',function(e){
				// UploadManager.ShowUploadWork(e.target,101)
			})
		}
	},
	//晨会面板
	CollatePanelShow:function(){
		var plan = $('#projectNav')
		Main.Over(function(){
			CollatePanel.Index()
		})
		plan.find('.menu').hide()
		$('#saveFile,#projectSer').show()
		plan.find(".tpl_edit").hide()
		ProjectNav.NavMenu = 2
	},
	//关闭菜单
	HideMenu:function(){
		$('#stepFilter,#workFilter,#storeMenu,#extraNotice').hide()
	}
}