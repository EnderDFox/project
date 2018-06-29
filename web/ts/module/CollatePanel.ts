//晨会面板
class CollatePanelClass {
	VuePath: string = 'collate/'
	//日期数据
	DateList: IDateItem[] = []
	//初始化
	Init() {

	}
	//入口协议
	Index() {
		WSConn.sendMsg(C2L.C2L_COLLATE_VIEW, CollateFilter.GetPack())
	}
	//日期范围
	SetDateRange() {
		var list = []
		var date = new Date(CollateFilter.Pack.BeginDate)
		while (true) {
			var info: IDateItem = {}
			info.y = date.getFullYear()
			var m = date.getMonth() + 1
			var d = date.getDate()
			info.w = date.getDay()
			info.m = m >= 10 ? m.toString() : ('0' + m)
			info.d = d >= 10 ? d.toString() : ('0' + d)
			info.w = info.w == 0 ? 7 : info.w
			info.s = info.y + '-' + info.m + '-' + info.d
			list.push(info)
			date.setDate(date.getDate() + 1)
			if (info.s == CollateFilter.Pack.EndDate) {
				break;
			}
		}
		CollatePanel.DateList = list
	}
	//组合头部
	GetTheadHtmlLeft() {
		var html = ''
		html += '<tr class="title">'
		html += '<td class="type_0">日期</td>'
		html += '</tr>'
		return html
	}
	GetTheadHtmlRight() {
		var html = ''
		html += '<tr class="title">'
		$.each(Data.UserList, (k, user: UserSingle) => {
			if (user.Did == 0) {
				return true
			}
			if (user.IsHide == 1) {
				return true
			}
			html += '<td class="type_' + user.Did + '">' + user.Name + '</td>'
			return true
		})
		html += '</tr>'
		return html
	}
	//组合tbody
	GetTbodyHtmlLeft() {
		var today = Common.GetDate(0)
		var day = Common.GetDay(today)
		var html = ''
		$.each(this.DateList, (k, dateItem: IDateItem) => {
			html += this.GetTbodyFirstTd(today, dateItem)
			html += '</tr>'
			if (dateItem.w == 7) {
				html += '<tr class="space"><td style="width:150px;min-width:150px;"></td></tr>'
			}
		})
		return html
	}
	/**组合第一列 */
	GetTbodyFirstTd(today: string, dateItem: IDateItem): string {
		var html: string = ''
		var trClass = []
		if (dateItem.w >= 6) {
			trClass.push('weekend')
		}
		html += '<tr class="' + trClass.join(' ') + '" date="' + dateItem.s + '">'
		var tdClass = ['frist']
		if (dateItem.s == today) {
			tdClass.push('today')
		}
		html += '<td class="' + tdClass.join(' ') + '">'
		html += '<dl>'
		if (ProcessData.HasVersionDateLineMap(dateItem.s)) {
			var publish: PublishSingle = ProcessData.VersionDateLineMap[dateItem.s][0]
			var _genre = publish.Genre
			var version = ProcessData.VersionMap[publish.Vid]
			var publishName = '版本' + VersionManager.GetPublishName(_genre)
			html += '<dd class="notice sk_' + _genre + '">' + version.Ver + ' ' + publishName + '</dd>'
		} else {
			var publish: PublishSingle = VersionManager.GetNextNearestPublish(dateItem.s, false)
			if (publish) {
				var _genre = publish.Genre
				var version = ProcessData.VersionMap[publish.Vid]
				var publishName = '版本' + VersionManager.GetPublishName(_genre)
				html += '<dd class="notice sk_' + _genre + '">' + Common.DateLineSpaceDay(publish.DateLine, dateItem.s) + '天后</dd>'
				html += '<dd class="notice sk_' + _genre + '">' + version.Ver + ' ' + publishName + '</dd>'
			}
		}
		html += '<dt>' + dateItem.s + '</dt>'
		html += '<dd>星期' + DateTime.WeekMap[dateItem.w - 1] + '</dd>'
		html += '</dl>'
		html += '</td>'
		return html;
	}
	GetTbodyHtmlRight() {
		var today = Common.GetDate(0)
		var day = Common.GetDay(today)
		var html = ''
		$.each(this.DateList, (r, dateItem: IDateItem) => {
			//
			var trClass = []
			if (dateItem.w >= 6) {
				trClass.push('weekend')
			}
			html += '<tr class="' + trClass.join(' ') + '" date="' + dateItem.s + '">'
			var tdClass = ['frist']
			if (dateItem.s == today) {
				tdClass.push('today')
			}
			//
			var cols = 1
			$.each(Data.UserList, (k, user: UserSingle) => {
				if (user.Did == 0) {
					return
				}
				if (user.IsHide == 1) {
					return
				}
				html += '<td uid="' + user.Uid + '"><ol>'
				//进度内容
				if (CollateData.DateUserMap[dateItem.s] && CollateData.DateUserMap[dateItem.s][user.Uid]) {
					$.each(CollateData.DateUserMap[dateItem.s][user.Uid], function (k, work: WorkSingle) {
						html += CollatePanel.GetWorkInfo(work)
					})
				}
				//补充内容
				if (CollateData.DateExtraMap[dateItem.s] && CollateData.DateExtraMap[dateItem.s][user.Uid]) {
					$.each(CollateData.DateExtraMap[dateItem.s][user.Uid], function (k, extra: ExtraSingle) {
						html += CollatePanel.GetWorkExtra(extra)
					})
				}
				html += '</ol>'
				if (r >= (day - 2)) {
					//html+= '<div class="extra">+添加内容...</div>'
				}
				html += '</td>'
				cols++
			})
			html += '</tr>'
			if (dateItem.w == 7) {
				html += '<tr class="space"><td colspan="' + cols + '"></td></tr>'
			}
		})
		return html
	}
	//工作补充
	GetWorkExtra(data: ExtraSingle) {
		var html = ''
		html += '<li eid="' + data.Eid + '">'
		html += '<span class="check_' + data.Inspect + '">' + data.Name + '</span>'
		html += '<span class="special">（' + CollateData.InspectList[data.Inspect] + '）</span>'
		html += '<span class="edit">√</span>'
		html += '</li>'
		return html
	}
	//工作内容
	GetWorkInfo(work: WorkSingle) {
		var html = ''
		var link = CollateData.LinkMap[work.Lid]
		html += '<li wid="' + work.Wid + '">'
		var mode = CollateData.ModeMap[link.Mid]
		if(!mode){
			console.log("[debug]","Can not find mode",link.Mid,":[link.Mid]",link,":[link]")
			return ''
		}
		var linkFullName = VersionManager.GetVersionVer(mode.Vid) + mode.Name
		if(link.ParentLid>0){
			var parentLink = CollateData.LinkMap[link.ParentLid]
			if(parentLink){
				linkFullName = linkFullName + '-' + parentLink.Name
			}
		}
		linkFullName = linkFullName + '-' + link.Name
		html += '<span wid="' + work.Wid + '" class="check_' + work.Inspect + '">' + linkFullName + '</span>'
		html += '<span class="special">'
		if (work.MinNum > 0 || work.MaxNum > 0) {
			html += '（' + work.MinNum + '/' + work.MaxNum + '）'
		}
		if (work.Tips != '') {
			html += '（' + work.Tips + '）'
		}
		if (work.Tag != '') {
			var TagInfo = CollateData.TagsMap[work.Tag]
			if (TagInfo) {
				html += '（' + TagInfo.Info + '）'
			} else {
				html += '（' + work.Tag + '）'
			}
		} else {
			html += '（' + CollateData.StatusList[work.Status].Info + '）'
		}
		html += '</span>'
		if (work.FileList && work.FileList.length > 0) {
			html += `<span style="color:#3333CC;">(附件x${work.FileList.length})</span>`
		}
		html += '</li>'
		return html
	}
	//建立内容
	CreateCollate() {
		Loader.LoadVueTemplate(this.VuePath + `PanelFrame`, (tpl: string) => {
			Main.Draw(tpl)
			$('#tableTitleLeft').html(this.GetTheadHtmlLeft())
			$('#tableTitleRight').html(this.GetTheadHtmlRight())
			$('#tableBodyLeft').html(this.GetTbodyHtmlLeft())
			$('#tableBodyRight').html(this.GetTbodyHtmlRight())
			var resetSize = () => {
				var $trLeftList = $('#tableBodyLeft').find('tr')
				var $trRightList = $('#tableBodyRight').find('tr')
				var len = $trLeftList.length
				for (var i = 0; i < len; i++) {
					var trLeft = $trLeftList[i]
					var trRight = $trRightList[i]
					// var hL = $(trLeft).height()
					// var hR = $(trRight).height()
					var hL = trLeft.clientHeight
					var hR = trRight.clientHeight
					// console.log("[debug]",i,":[i]------")
					// console.log("[info]",$(trRight).get(0).clientHeight,":[$(trLeft).get(0).clientHeight]",hR)
					// continue;
					// console.log("[info]", i,":[i]", hL, ":[hL]", hR, ":[hR]", hMax, ":[hMax]")
					if (hL == hR && hR == 40) {
						//还没刷新, 等下一次
						requestAnimationFrame(resetSize);
						break;
					}
					var _offset = 2//不明白为什么必须+2 双方高度才能对齐,可能是因为border?
					if (Common.IsIE()) {
						_offset = 0
					}
					var hMax = Math.max(hL, hR)
					if (hL < hMax) {
						$(trLeft).height(hMax + _offset)
					} else if (hR < hMax) {
						$(trRight).height(hMax + _offset)
					}
				}
			}
			requestAnimationFrame(resetSize);
			$('#freezeTitleRight').unbind().freezeTop(true)
			$('#freezeBodyLeft').unbind().freezeLeft(false)
			//
			this.BindActions()
		})
		/* //组合thead
		var html = '<div id="freezeTop" class="collateLock"><div class="lockTop"><table class="collate" id="rowLock">'
		html += CollatePanel.GetTheadHtmlRight()
		html += '</table></div></div>'
		html += '<div class="collateLockBody"><table class="collate">'
		//组合tbody
		html += CollatePanel.GetTbodyHtml()
		html += '</table></div>'*/
	}
	//事件绑定
	BindActions() {
		//功能区域绑定
		Main.Content.unbind().delegate('td', 'click', (e: JQuery.Event) => {
			if (!User.IsWrite) {
				return
			}
			this.HideMenu()
			var el: HTMLElement = e.target as HTMLElement
			var wid = parseInt($(el).attr('wid'))
			if (wid) {
				this.ShowStepMenu(el, e)
			}
		})
		{
			/* 
			.delegate('li', 'click', (e: JQuery.Event) => {
				CollatePanel.HideMenu()
				// if(e.button !== Main.MouseDir) {
					// 	return false
					// }
					if (!User.IsWrite) {
						return
					}
					if ($(e.currentTarget).is('[wid]')) {
						CollatePanel.ShowStepMenu(e.currentTarget as HTMLElement, e)
					} else {
						CollatePanel.ShowExtraMenu(e.currentTarget as HTMLElement, e)
					}
				}).delegate('td', 'click', (e: JQuery.Event) => {
					console.log("[info]",e.currentTarget,e.target)
					//界面结构是 td里面有li,  所以点击li显示ShowStepMenu后 在这里会触发CollatePanel.HideMenu, 从而关闭StepMenu, 反正ExtraEdit暂时用不到,所以先注释掉
					if (!User.IsWrite) {
						return
					}
					switch ((e.currentTarget  as HTMLElement).localName) {
						case 'td':
						CollatePanel.HideMenu()
						break
						case 'div'://不可能走到这里吧?
						CollatePanel.HideMenu()
						CollatePanel.ShowExtraEdit(e.currentTarget as HTMLElement, e)
						break
					}
				}) */
		}
	}
	//显示菜单
	ShowStepMenu(el: HTMLElement, e: JQuery.Event) {
		var wid = $(el).attr('wid')
		if (!wid) {
			return
		}
		var top = e.pageY + 1
		var left = e.pageX + 1
		$('#menuStep').css({ left: left, top: top }).unbind().delegate('.row', 'click', (e: JQuery.Event) => {
			var type = $(e.currentTarget).attr('type')
			switch (type) {
				case 'cancel':
				case 'finish':
				case 'last':
				case 'defer':
					var inspect = $(e.currentTarget).attr('inspect')
					WSConn.sendMsg(C2L.C2L_COLLATE_STEP_EDIT, { 'Wid': parseInt(wid), 'Inspect': parseInt(inspect) })
					break
			}
			CollatePanel.HideMenu()
		}).show().adjust(-5)
	}
	//显示补充
	ShowExtraMenu(o: HTMLElement, e: JQuery.Event) {
		var top = e.pageY + 1
		var left = e.pageX + 1
		$('#menuExtra').css({ left: left, top: top }).unbind().delegate('.row', 'click', function () {
			CollatePanel.HideMenu()
			var type = $(this).attr('type')
			switch (type) {
				case 'edit':
					CollatePanel.ShowExtraEdit(o, e)
					break
				case 'delete':
					var eid = $(o).attr('eid')
					WSConn.sendMsg(C2L.C2L_COLLATE_EXTRA_DELETE, { 'Eid': parseInt(eid) })
					break
			}
		}).show().adjust(-5)
	}
	//编辑面板
	ShowExtraEdit(o: HTMLElement, e: JQuery.Event) {
		var top = e.pageY + 1
		var left = e.pageX + 1
		var plan = $('#addStep').css({ left: left, top: top }).unbind().show().adjust(-5)
		var name = plan.find('textarea').val('').focus()
		var eid = parseInt($(o).attr('eid')) | 0
		var param: { Eid?: number, Inspect?: number } = {}
		param.Eid = eid
		param.Inspect = 1
		if (param.Eid > 0) {
			var extra = CollateData.ExtraMap[eid]
			name.val(extra.Name)
			param.Inspect = extra.Inspect
		}
		plan.find('.confirm').unbind().click(function () {
			var inspect = plan.find('.inspect .on').index() + 1
			if (param.Eid > 0) {
				WSConn.sendMsg(C2L.C2L_COLLATE_EXTRA_EDIT, { 'Eid': param.Eid, 'Name': name.val(), 'Inspect': inspect })
			} else {
				var date = $(o).parent().attr('date')
				var uid = $(o).attr('uid')
				WSConn.sendMsg(C2L.C2L_COLLATE_STEP_ADD, { 'Uid': parseInt(uid), 'Date': date, 'Name': name.val(), 'inspect': inspect })
			}
			plan.hide()
		})
		plan.find('.inspect').unbind().delegate('div', 'click', function () {
			plan.find('.inspect div').removeClass('on')
			$(this).addClass('on')
		}).find('div').removeClass('on').eq(param.Inspect - 1).addClass('on')
		plan.find('.cancel,.close').unbind().click(function () {
			plan.fadeOut(Config.FadeTime)
		})
	}
	//关闭菜单
	HideMenu() {
		$('#menuStep,#menuExtra,#addStep').hide()
	}
}

var CollatePanel = new CollatePanelClass()