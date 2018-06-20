//进度类
class ProcessPanelClass {
	/** 时间跨度
	 * key:dateLine	val:count
	 */
	DateList: { rows?: { [key: string]: number }, list?: IDateItem[] } = { rows: {}, list: [] }
	/**
	 * 初始化
	 */
	Init() {

	}
	/**
	 * 入口协议
	 */
	Index() {
		WSConn.sendMsg(C2L.C2L_PROCESS_VIEW, ProcessFilter.GetSvrPack())
	}
	/**
	 * 设置时间范围
	 */
	SetDateRange() {
		var rows: { [key: string]: number } = {};
		var list: IDateItem[] = []
		var date = new Date(ProcessFilter.Pack.BeginDate)
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
			var K = info.y + '-' + info.m
			if (!rows[K]) {
				rows[K] = 0
			}
			rows[K]++
			list.push(info)
			date.setDate(date.getDate() + 1)
			if (info.s == ProcessFilter.Pack.EndDate) {
				break;
			}
		}
		this.DateList = { rows: rows, list: list }
	}
	//绑定事件
	BindActions() {
		//功能区域绑定
		Main.Content.unbind().delegate('.mode', 'mousedown', (e: JQuery.Event): void | false => {
			e.stopPropagation()
			this.HideMenu()
			TemplateManager.Hide()
			VersionManager.Hide()
			if (e.button !== Main.MouseDir) {
				return false
			}
			if (!User.IsWrite) {
				return false
			}
			this.ShowMenuMode(e.currentTarget as HTMLElement, e)
		}).find('.linkMap').unbind().delegate('td', 'mousedown', (e: JQuery.Event): void | false => {
			e.stopPropagation()
			//流程区域绑定
			this.HideMenu()
			TemplateManager.Hide()
			VersionManager.Hide()
			if (e.button !== Main.MouseDir) {
				return false
			}
			var type = $(e.currentTarget).attr('type')
			switch (type) {
				case 'step':
					this.ShowMenuStep(e.currentTarget as HTMLElement, e, User.IsWrite)
					break
				case 'duty':
					if (!User.IsWrite) {
						return false
					}
					this.ShowMenuUser(e.currentTarget as HTMLElement, e)
					break
				case 'link':
					if (!User.IsWrite) {
						return false
					}
					this.ShowMenuLink(e.currentTarget as HTMLElement, e)
					break
			}
			//console.log('鼠标右键点击',type,navigator.platform)
		}).delegate('td', 'mouseenter', (e: JQuery.Event): void | false => {
			e.stopPropagation()
			var grid: IWorkGrid = $(e.currentTarget).data('grid')
			if (!grid || grid.wid == 0) {
				return
			}
			var work = ProcessData.WorkMap[grid.wid]
			if (!work) {
				return
			}
			var info = []
			if (work.Tips != '') {
				info.push('<div>描述:' + work.Tips + '</div>')
			}
			if (work.MinNum > 0 || work.MaxNum > 0) {
				info.push('<div>数量:' + work.MinNum + '/' + work.MaxNum + '</div>')
			}
			if (info.length > 0) {
				var top = $(e.currentTarget).offset().top + $(e.currentTarget).height() + 2
				var left = $(e.currentTarget).offset().left + $(e.currentTarget).width() + 2
				$('#workTips').css({ top: top, left: left }).show().adjust(-5).html(info.join(''))
			}
		}).delegate('td', 'mouseleave', function (e) {
			e.stopPropagation()
			$('#workTips').hide()
		})
		Main.Content.find('.title').unbind().delegate('td', 'mousedown', (e: JQuery.Event): void | false => {
			e.stopPropagation()
			//流程区域绑定
			this.HideMenu()
			TemplateManager.Hide()
			VersionManager.Hide()
			/* 改成左键单击 但也保留右键 为了兼容旧版本
			if (e.button !== Main.MouseDir) {
				return false
			} */
			if (!User.IsWrite) {
				return false
			}
			this.ShowMenuPub(e.currentTarget as HTMLElement, e)
		}).delegate('td', 'mouseenter', (e: JQuery.Event) => {
			e.stopPropagation()
			// if($(e.currentTarget).find('.stroke').length == 1){//判断仅有date_line的
			var top = $(e.currentTarget).offset().top + $(e.currentTarget).height() + 2
			var left = $(e.currentTarget).offset().left + $(e.currentTarget).width() + 2
			var dateLine = $(e.currentTarget).attr('date_line')
			if (dateLine) {
				VersionManager.ShowTableHeaderTooltip(dateLine, left, top)
			}
			// }
		}).delegate('td', 'mouseleave', function (e) {
			e.stopPropagation()
			$('#workTips').hide()
		})
	}
	//组合头部
	GetTheadHtmlLeft(): string {
		var today = Common.GetDate(0)
		var html = ``
		html += `<thead>
				<tr> 
					<td colspan="3" class="tools">功能列表</td>
				</tr> 
				<tr> 
					<td class="func">功能</td> 
					<td class="link">流程</td> 
					<td class="duty">负责人</td>
				</tr>
				</thead>`
		return html
	}
	GetTheadHtmlRight(): string {
		var today = Common.GetDate(0)
		var html = ``
		html += `<thead>`
		html += `<tr> `
		$.each(this.DateList.rows, function (date: string, num: number) {
			var mt = date.substr(-2)
			if (num > 1) {
				html += `<td colspan="${num}" class="date_${(parseInt(mt) % 2)}">${date}</td>`
			} else {
				html += `<td class="date_${(parseInt(mt) % 2)}">${mt}</td>`
			}
		})
		html += `</tr>`
		html += `<tr class="title"> `
		$.each(this.DateList.list, function (k, info) {
			if (info.s == today) {
				html += `<td class="today"`
			} else {
				html += `<td`
			}
			html += ` date_line="${info.s}">`
			html += ` <div class="info" > ${info.d} </div>`
			if (ProcessData.HasVersionDateLineMap(info.s)) {
				var _genre = ProcessData.VersionDateLineMap[info.s][0].Genre
				html += `<div class="stroke sk_${_genre}" date_line="${info.s}"></div>`
			}
			html += `</td>`
		})
		html += `</tr>`
		html += `</thead>`
		return html
	}
	//组合流程列表 一个mode下的多个link
	GetLinkListHtml(mode: ModeSingle) {
		var html = ''
		html += '<table class="linkMap">'
		$.each(mode.LinkList, (k, link: LinkSingle) => {
			//流程与进度
			html += this.GetLinkHtml(link)
		})
		html += '</table>'
		return html
	}
	//组合流程 单个link
	GetLinkHtml(link: LinkSingle) {
		var html = ''
		if (!link) {
			return html
		}
		html += `<tr class="trLink" lid="${link.Lid}">`
		html += `	<td class="link bg_${link.Color}" type="link">
						${this.GetLinkName(link)}
					</td>
					<td class="duty" type="duty">${Data.GetUser(link.Uid).Name}</td>`
		html += '</tr>'
		return html
	}
	GetLinkName(link: LinkSingle): string {
		return `<div>
				${(link.Name == '' ? '空' : link.Name)} ${ProcessPanel.GetModeLinkStatusName(link.Status)}
				</div>`
	}
	//组合work列表 一个mode下的多个link中的每个work
	GetWorkListHtml(mode: ModeSingle) {
		var html = ''
		html += '<table class="linkMap">'
		$.each(mode.LinkList, (k, link: LinkSingle) => {
			//流程与进度
			html += this.GetWorkHtml(link)
		})
		html += '</table>'
		return html
	}
	GetWorkHtml(link: LinkSingle) {
		var html = ''
		if (!link) {
			return html
		}
		html += `<tr class="trWork" lid="${link.Lid}">`
		$.each(this.DateList.list, (k, info: IDateItem) => {
			//填充
			if (info.w < 6) {
				html += '<td type="step"></td>'
			} else {
				html += '<td type="step" class="weekend"></td>'
			}
		})
		html += '</tr>'
		return html
	}
	//组合功能
	GetModeHtmlLeft(mid: number) {
		var html = ''
		var mode = ProcessData.ModeMap[mid]
		if (!mode) {
			return html
		}

		html += `<tr class="trModeLeft" mid="${mode.Mid}">
					<td class="mode bg_${mode.Color}" mid="${mode.Mid}">
						${this.GetModeName(mode)}
					</td> 
					<td colspan="2">
						${this.GetLinkListHtml(mode)}
					</td> 
				</tr> `
		html += `<tr class="space"><td colspan="3"></td></tr>`
		// html += `<tr class="space"><td colspan="${(this.DateList.list.length + 3)}"></td></tr>`
		return html
	}
	/**修改mdoe td内部的最大高度 */
	ChangeModeNameMaxHeight(mode: ModeSingle) {
		var maxHeight = Math.max(1, mode.LinkList ? mode.LinkList.length : 0) * 40
		$('#content .mode[mid="' + mode.Mid + '"] div').css('max-height', maxHeight)
	}
	GetModeName(mode: ModeSingle): string {
		var maxHeight = Math.max(1, mode.LinkList ? mode.LinkList.length : 0) * 40
		return `<div style="max-height:${maxHeight}px;">
				${VersionManager.GetVersionVer(mode.Vid)}${(mode.Name == '' ? '空' : mode.Name)}${this.GetModeLinkStatusName(mode.Status)}
				<div>`
	}
	GetModeHtmlRight(mid: number) {
		var html = ''
		var mode = ProcessData.ModeMap[mid]
		if (!mode) {
			return html
		}
		html += `<tr class="trModeRight" mid="${mode.Mid}">
					<td colspan="${(this.DateList.list.length)}">
					${this.GetWorkListHtml(mode)}
					</td> 
				</tr> `
		html += `<tr class="space"><td colspan="${(this.DateList.list.length)}"></td></tr>`
		return html
	}
	//组合tbody
	GetTbodyHtmlLeft() {
		var html = ''
		html += '<tbody>'
		//功能
		$.each(ProcessData.Project.ModeList, (k, mode: ModeSingle) => {
			html += this.GetModeHtmlLeft(mode.Mid)
		})
		html += '</tbody>'
		return html
	}
	//组合tbody
	GetTbodyHtmlRight() {
		var html = ''
		html += '<tbody>'
		//功能
		$.each(ProcessData.Project.ModeList, (k, mode: ModeSingle) => {
			html += this.GetModeHtmlRight(mode.Mid)
		})
		html += '</tbody>'
		return html
	}
	//建立内容
	CreateProcess() {
		Loader.LoadVueTemplate(ProcessFilter.VuePath + `PanelFrame`, (tpl: string) => {
			var $main = Main.Draw(tpl)
			//组合thead
			$('#tableTitleLeft').html(this.GetTheadHtmlLeft())
			$('#tableTitleRight').html(this.GetTheadHtmlRight())
			$('#tableBodyLeft').html(this.GetTbodyHtmlLeft())
			$('#tableBodyRight').html(this.GetTbodyHtmlRight())
			//流程数据
			$main.find('.trLink').each((index: number, el: HTMLElement) => {
				var lid = parseInt($(el).attr('lid'))
				this.SetLinkData(lid, el)
			})
			$main.find('.trWork').each((index: number, el: HTMLElement) => {
				var lid = parseInt($(el).attr('lid'))
				this.SetWorkData(lid, el)
			})
			$('#freezeTitleRight').unbind().freezeTop(true)
			$('#freezeBodyLeft').unbind().freezeLeft(false)
			this.BindActions()
		})
	}
	SetLinkData(lid: number, dom: HTMLElement) {
		//绑定lid
		$(dom).data('lid', lid)
	}
	//work数据
	SetWorkData(lid: number, dom: HTMLElement) {
		var linkWork = ProcessData.LinkWorkMap[lid]
		var dateList = this.DateList.list
		$(dom).find('td').each((k, el: HTMLElement) => {
			var grid: IWorkGrid = $.extend({}, dateList[k])
			grid.lid = lid
			grid.wid = 0
			//填充
			if (linkWork && linkWork[grid.s]) {
				grid.wid = linkWork[grid.s].Wid
				var work = ProcessData.WorkMap[grid.wid]
				this.ShowWorkGrid(el, grid, work)
			}
			//绑定work的data grid
			$.data(el, 'grid', grid)
		})
	}
	//显示一个work格子内容
	ShowWorkGrid(dom: HTMLElement, grid: IWorkGrid, work: WorkSingle) {
		var info = work.Tag
		if (info == '') {
			info = CollateData.StatusList[work.Status].Tag
		}
		info = '<div class="info">' + info + '</div>'
		if (work.Tips != '' || work.MinNum > 0 || work.MaxNum > 0) {
			info += '<div class="arrow-right"></div>'
		}
		if (ProcessData.ScoreMap[grid.wid] && ProcessData.ScoreMap[grid.wid].Quality > 0) {
			info += '<div class="arrow-left"></div>'
		}
		//uploading
		if (work.uploading) {
			// info+= '<div class="work_uploading"></div>' //uploading时 work角标不用闪 所以这里先注释掉,用下一行的代码代替
			info += '<div class="arrow-right-bottom"></div>'
		} else if (work.FileList && work.FileList.length > 0) {
			info += '<div class="arrow-right-bottom"></div>'
		}
		//
		$(dom).attr({ 'class': 'ss_' + work.Status }).html(info)
	}
	//功能菜单
	ShowMenuMode(o: HTMLElement, e: JQuery.Event) {
		var mid = parseInt($(o).attr('mid'))
		var top = e.pageY + 1
		var left = e.pageX + 1
		var mode = ProcessData.ModeMap[mid]
		var $menuMode = $('#menuMode')
		$menuMode.find(`.store_txt`).text(mode.Status == ModeStatusField.NORMAL ? '归档' : '恢复归档')
		$menuMode.css({ left: left, top: top }).unbind().delegate('.row[type!="color"]', 'click', (e: JQuery.Event) => {
			var type = $(e.currentTarget).attr('type')
			switch (type) {
				case 'insert':
					this.ShowEditMode(o, e, C2L.C2L_PROCESS_MODE_ADD)
					break
				case 'edit':
					this.ShowEditMode(o, e, C2L.C2L_PROCESS_MODE_EDIT)
					break
				case 'delete':
					Common.Warning(o, e, function () {
						WSConn.sendMsg(C2L.C2L_PROCESS_MODE_DELETE, { 'Mid': mode.Mid })
					}, '删除后不可恢复，确认删除吗？')
					break
				case 'forward':
					var prev = $(o).parent().prev().prev()
					if (prev.length > 0) {
						var beMid = prev.find('.mode').attr('mid')
						WSConn.sendMsg(C2L.C2L_PROCESS_MODE_MOVE, { 'Swap': [parseInt(beMid), mode.Mid] })
					}
					break
				case 'backward':
					var next = $(o).parent().next().next()
					if (next.length > 0) {
						var beMid = next.find('.mode').attr('mid')
						WSConn.sendMsg(C2L.C2L_PROCESS_MODE_MOVE, { 'Swap': [mode.Mid, parseInt(beMid)] })
					}
					break
				case 'store':
					if (mode.Status == ModeStatusField.NORMAL) {
						Common.Warning(o, e, function () {
							WSConn.sendMsg(C2L.C2L_PROCESS_MODE_STORE, { 'Mid': mode.Mid, 'Status': ModeStatusField.STORE })
						}, '是否将已完成的功能进行归档？')
					} else {
						WSConn.sendMsg(C2L.C2L_PROCESS_MODE_STORE, { 'Mid': mode.Mid, 'Status': ModeStatusField.NORMAL })
					}
					break
			}
			this.HideMenu()
		}).show().adjust(-5).find('.row[type="color"]').unbind().hover((e: JQuery.Event) => {
			$(e.currentTarget).find('.pluginColor').show().unbind().delegate('div', 'click', (e: JQuery.Event) => {
				WSConn.sendMsg(C2L.C2L_PROCESS_MODE_COLOR, { 'Mid': mode.Mid, 'Color': $(e.currentTarget).index() })
				this.HideMenu()
			})
		}, (e: JQuery.Event) => {
			$(e.currentTarget).find('.pluginColor').hide()
		})
	}
	//编辑功能
	ShowEditMode(o: HTMLElement, e: JQuery.Event, cid: number) {
		ProcessFilter.HideFilter()
		TemplateManager.Hide();
		VersionManager.Hide()
		var mid = $(o).attr('mid')
		var mode = ProcessData.ModeMap[mid]
		var plan = $('#editMode').css({ left: e.pageX, top: e.pageY }).show().adjust(-5)
		var name = plan.find('textarea').val('').focus()
		if (cid == C2L.C2L_PROCESS_MODE_EDIT) {
			name.val(mode.Name).select()
			plan.find(".tpl_li").hide()
			plan.find(".tpl_edit").hide()
		} else {
			plan.find(".tpl_li").show();
			TemplateManager.BindTplSelect("#place_tplModeSelect")
			plan.find('.tpl_edit').show().unbind().click(function (e) {
				TemplateManager.ShowEditTplModeList(e)
				VersionManager.Hide()
			})
		}
		//版本
		VersionManager.BindSelect("#place_versionSelect", mode.Vid, function (dom) {
			if (cid == C2L.C2L_PROCESS_MODE_EDIT) {
				if (ProcessData.VersionMap[mode.Vid]) {
					$(dom).val(mode.Vid)
				} else {
					$(dom).val(0)//已经被删除了
				}
			} else {
				$(dom).val(0)
			}
		})
		plan.find('.version_edit').show().unbind().click(function (e) {
			TemplateManager.Hide()
			VersionManager.ShowVersionList()
		})
		//确定 取消
		plan.find('.confirm').unbind().click(function () {
			var data = { 'Did': Math.abs(ProjectNav.FilterDid), 'Name': $.trim(name.val() as string), 'Vid': parseInt(plan.find("#versionSelect").val() as string) };
			if (cid == C2L.C2L_PROCESS_MODE_ADD) {
				data["PrevMid"] = mode.Mid
				data["Tmid"] = parseInt(plan.find("#tplModeSelect").val() as string)
			} else {
				data["Mid"] = mode.Mid
			}
			WSConn.sendMsg(cid, data)
			plan.hide()
			TemplateManager.Hide()
			VersionManager.Hide()
		})
		plan.find('.cancel,.close').unbind().click(function () {
			plan.fadeOut(Config.FadeTime)
			TemplateManager.Hide()
			VersionManager.Hide()
		})
	}
	//内容菜单
	//IsWrite: true:管理员 false:非管理员
	ShowMenuStep(o: HTMLElement, e: JQuery.Event, IsWrite: boolean) {
		var top = e.pageY + 1
		var left = e.pageX + 1
		var grid: IWorkGrid = $(o).data('grid')
		//没有work状态的不显示某些选项
		if (grid.wid) {
			$('#menuDay').find("[type=upload],[type=score],[type=clear]").find('.txt').removeClass('menu_disabled')
		} else {
			$('#menuDay').find("[type=upload],[type=score],[type=clear]").find('.txt').addClass('menu_disabled')
		}
		if (!IsWrite) {
			//$('#menuDay').find(".extends,[type=work],[type=finish],[type=delay],[type=wait],[type=rest],[type=optimize],[type=edit],[type=score],[type=clear]").hide()
			$('#menuDay .row[type!=upload]').hide()
		}
		//
		$('#menuDay').css({ left: left, top: top }).unbind().delegate('.row[type!="status"]', 'click', (e: JQuery.Event) => {
			var type = $(e.currentTarget).attr('type')
			switch (type) {
				case 'work':
				case 'finish':
				case 'delay':
				case 'wait':
				case 'rest':
				case 'optimize':
					var status = $(e.currentTarget).attr('status')
					WSConn.sendMsg(C2L.C2L_PROCESS_GRID_CHANGE, { 'Lid': grid.lid, 'Wid': grid.wid, 'Date': grid.s, 'Status': parseInt(status) })
					break
				case 'edit':
					this.ShowEditStep(o)
					break
				case 'score'://评价
					if (grid.wid) {
						this.OnShowEditScore(o)
					}
					break
				case 'upload'://附件
					if (grid.wid) {
						UploadManager.ShowUploadWork(o, grid.wid)
					}
					break
				case 'clear':
					if (grid.wid) {
						WSConn.sendMsg(C2L.C2L_PROCESS_GRID_CLEAR, { 'Lid': grid.lid, 'Wid': grid.wid, 'Date': grid.s })
					}
					break
			}
			this.HideMenu()
		}).show().adjust(-5)
	}
	//编辑工作补充
	ShowEditStep(o: HTMLElement) {
		var cur = $(o).parent()
		var top = $(o).position().top - 2
		var left = $(o).position().left + $(o).outerWidth() - 2
		var plan = $('#editInfo').css({ left: left, top: top }).show().adjust(-5)
		var tips = plan.find('textarea').val('').focus()
		var tag = plan.find('.tag').val('')
		var minNum = plan.find('.min').val(0)
		var maxNum = plan.find('.max').val(0)
		var grid: IWorkGrid = $(o).data('grid')
		var work: WorkSingle = ProcessData.WorkMap[grid.wid]
		var pack: C2L_ProcessWorkEdit = {}
		pack.Wid = 0
		if (work) {
			tips.val(work.Tips).select()
			tag.val(work.Tag)
			minNum.val(work.MinNum)
			maxNum.val(work.MaxNum)
			pack.Wid = work.Wid
		}
		plan.find('.confirm').unbind().click(function () {
			pack.Lid = cur.data('lid')
			pack.Date = grid.s
			pack.Tips = tips.val() as string
			pack.MinNum = parseInt(minNum.val() as string)
			pack.MaxNum = parseInt(maxNum.val() as string)
			pack.Tag = tag.val() as string
			WSConn.sendMsg(C2L.C2L_PROCESS_WORK_EDIT, pack)
			$('#editInfo').hide()
		})
		plan.find('.cancel,.close').unbind().click(function () {
			plan.fadeOut(Config.FadeTime)
		})
	}
	//评价
	OnShowEditScore(o: HTMLElement) {
		var wid: number = ($(o).data('grid') as IWorkGrid).wid
		var left: number = $(o).position().left + $(o).outerWidth() - 2
		var top: number = $(o).position().top - 2
		this.ShowEditScore(wid, left, top)
	}
	ShowEditScore(wid: number, left: number, top: number) {
		var plan = $('#editScore').css({ left: left, top: top }).show().adjust(-5)
		var info = plan.find('textarea').val('').focus()
		var qcos = plan.find('select:eq(0)').val('0')
		var ecos = plan.find('select:eq(1)').val('0')
		var mcos = plan.find('select:eq(2)').val('0')
		var score = ProcessData.ScoreMap[wid]
		if (score) {
			info.val(score.Info).select()
			qcos.val(score.Quality)
			ecos.val(score.Efficiency)
			mcos.val(score.Manner)
		}
		UploadManager.ShowProcessWorkFileBox(wid)
		plan.find('.confirm').unbind().click(function () {
			WSConn.sendMsg(C2L.C2L_PROCESS_SCORE_EDIT, { 'Wid': wid, 'Quality': parseInt(qcos.val() as string), 'Efficiency': parseInt(ecos.val() as string), 'Manner': parseInt(mcos.val() as string), 'Info': info.val() })
			$('#editScore').hide()
		})
		plan.find('.cancel,.close').unbind().click(function () {
			plan.fadeOut(Config.FadeTime)
		})
	}
	//流程菜单
	ShowMenuLink(o: HTMLElement, e: JQuery.Event) {
		var cur = $(o).parent()
		var top = e.pageY + 1
		var left = e.pageX + 1
		var link: LinkSingle = ProcessData.LinkMap[parseInt(cur.data('lid'))]
		var $menuLink = $('#menuLink')
		$menuLink.find(`.store_txt`).text(link.Status == LinkStatusField.NORMAL ? '归档' : '恢复归档')
		$menuLink.css({ left: left, top: top }).unbind().delegate('.row', 'click', (e: JQuery.Event) => {
			var type = $(e.currentTarget).attr('type')
			switch (type) {
				case 'forward':
					var prev = cur.prev()
					if (prev.length > 0) {
						WSConn.sendMsg(C2L.C2L_PROCESS_GRID_SWAP, { 'Swap': [prev.data('lid'), cur.data('lid')] })
					}
					break
				case 'backward':
					var next = cur.next()
					if (next.length > 0) {
						WSConn.sendMsg(C2L.C2L_PROCESS_GRID_SWAP, { 'Swap': [cur.data('lid'), next.data('lid')] })
					}
					break
				case 'insert':
					this.ShowEditLink(o, C2L.C2L_PROCESS_GRID_ADD)
					break
				case 'edit':
					this.ShowEditLink(o, C2L.C2L_PROCESS_LINK_EDIT)
					break
				case 'store':
					if (link.Status == LinkStatusField.NORMAL) {
						if (cur.parent().find('tr').length > 1) {
							Common.Warning(cur,e, function () {
								WSConn.sendMsg(C2L.C2L_PROCESS_LINK_STORE, { 'Lid': cur.data('lid'), 'Status': LinkStatusField.STORE })
							}, '是否将已完成的流程进行归档？')
						} else {
							Common.Warning(cur,e,null, '至少要保留一个流程')
						}
					} else {
						WSConn.sendMsg(C2L.C2L_PROCESS_LINK_STORE, { 'Lid': cur.data('lid'), 'Status': LinkStatusField.NORMAL })
					}
					break
				case 'delete':
					if (cur.parent().find('tr').length > 1) {
						Common.Warning(cur,e, function () {
							WSConn.sendMsg(C2L.C2L_PROCESS_LINK_DELETE, { 'Lid': cur.data('lid') })
						}, '删除后不可恢复，确认删除吗？')
					} else {
						Common.Warning(cur,e,null, '至少要保留一个流程')
					}
					break
			}
			this.HideMenu()
		}).show().adjust(-5).find('.row[type="color"]').unbind().hover((e: JQuery.Event) => {
			$(e.currentTarget).find('.pluginColor').show().unbind().delegate('div', 'click', (e: JQuery.Event) => {
				WSConn.sendMsg(C2L.C2L_PROCESS_LINK_COLOR, { 'Lid': cur.data('lid'), 'Color': $(e.currentTarget).index() })
				this.HideMenu()
			})
		}, (e: JQuery.Event) => {
			$(e.currentTarget).find('.pluginColor').hide()
		})
	}
	//编辑流程名字
	ShowEditLink(o: HTMLElement, cid: number) {
		var cur = $(o).parent()
		var lid: number = cur.data('lid')
		var top: number = $(o).position().top - 2
		var left: number = $(o).position().left + $(o).outerWidth() - 2
		var link: LinkSingle = ProcessData.LinkMap[lid]
		var plan: JQuery = $('#editLink').css({ left: left, top: top }).show().adjust(-5)
		var name = plan.find('textarea').val('').focus()
		if (cid == C2L.C2L_PROCESS_LINK_EDIT) {
			name.val(link.Name).select()
		}
		plan.find('.confirm').unbind().click(function () {
			WSConn.sendMsg(cid, { 'Lid': lid, 'Name': $.trim(name.val() as string) })
			$('#editLink').hide()
		})
		plan.find('.cancel,.close').unbind().click(function () {
			plan.fadeOut(Config.FadeTime)
		})
	}
	//人员菜单
	ShowMenuUser(o: HTMLElement, e: JQuery.Event) {
		var top = e.pageY + 1
		var left = e.pageX + 1
		var lid = $(o).parent().data('lid')
		var plan = $('#menuUser')
		plan.css({ left: left, top: top }).unbind().delegate('.spread .row', 'click', (e: JQuery.Event) => {
			var uid = $(e.currentTarget).attr('uid')
			if (uid) {
				WSConn.sendMsg(C2L.C2L_PROCESS_USER_CHANGE, { 'Lid': lid, 'Uid': parseInt(uid) })
				this.HideMenu()
			}
		}).show().adjust(-5)
	}
	//发布菜单
	ShowMenuPub(o: HTMLElement, e: JQuery.Event) {
		var top = e.pageY + 4
		var left = e.pageX + 2
		var index = $(o).index()
		var info = this.DateList.list[index]
		this.HideMenu()
		if (info) {
			VersionManager.ShowTableHeaderMenu(info.s, left, top)
		}
	}
	//选中迷你小匡
	ShowMiniBox(e: JQuery.Event) {
		console.log('鼠标左键点击', (e.currentTarget as HTMLElement).localName)
		var offset = $(e.currentTarget).offset()
		var top = offset.top
		var left = offset.left
		var height = 38
		var width = 38

		//$(o).append($('#commonMini').show().css({'height':height,'width':width}))



		$('#commonMini').show().css({ 'top': top, 'left': left, 'height': height, 'width': width }).unbind().bind('mousedown', function (ev): void | false {
			if (ev.button !== Main.MouseDir) {
				// return false
			}
			//下层的元素
			//$(o).mousedown()
			console.log(e)
		})

		//clientHeight
		//offsetHeight
	}
	GetModeLinkStatusName(status: ModeStatusField | LinkStatusField): string {
		switch (status) {
			case ModeStatusField.STORE:
				return `<span class="status_store">(已归档)<span>`
		}
		return ''
	}
	//关闭所有菜单
	HideMenu() {
		$('#menuUser,#menuLink,#menuDay,#menuMode,#pubMenu,#workTips,#dateTime,#menuStep,#menuExtra,#menuDepartment').hide()
		Common.HidePullDownMenu()
	}
}


var ProcessPanel = new ProcessPanelClass()