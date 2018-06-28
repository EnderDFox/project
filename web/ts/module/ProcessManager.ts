//进度管理
class ProcessManagerClass {
	//注册函数
	RegisterFunc() {
		Commond.Register(L2C.L2C_PROCESS_VIEW, this.View.bind(this))
		//mode
		Commond.Register(L2C.L2C_PROCESS_MODE_ADD, this.ModeAdd.bind(this))
		Commond.Register(L2C.L2C_PROCESS_MODE_EDIT, this.ModeEdit.bind(this))
		Commond.Register(L2C.L2C_PROCESS_MODE_COLOR, this.ModeColor.bind(this))
		Commond.Register(L2C.L2C_PROCESS_MODE_SWAP_SORT, this.ModeSwapSort.bind(this))
		Commond.Register(L2C.L2C_PROCESS_MODE_STORE, this.ModeStore.bind(this))
		Commond.Register(L2C.L2C_PROCESS_MODE_DELETE, this.ModeDelete.bind(this))
		//link
		Commond.Register(L2C.L2C_PROCESS_LINK_ADD, this.LinkAdd.bind(this))
		Commond.Register(L2C.L2C_PROCESS_LINK_EDIT, this.LinkEdit.bind(this))
		Commond.Register(L2C.L2C_PROCESS_LINK_COLOR, this.LinkColor.bind(this))
		Commond.Register(L2C.L2C_PROCESS_LINK_SWAP_SORT, this.LinkSwapSort.bind(this))
		Commond.Register(L2C.L2C_PROCESS_LINK_STORE, this.LinkStore.bind(this))
		Commond.Register(L2C.L2C_PROCESS_LINK_DELETE, this.LinkDelete.bind(this))
		Commond.Register(L2C.L2C_PROCESS_LINK_USER_CHANGE, this.LinkUserChange.bind(this))
		//work
		Commond.Register(L2C.L2C_PROCESS_WORK_EDIT, this.WorkEdit.bind(this))	//工作编辑
		Commond.Register(L2C.L2C_PROCESS_WORK_STATUS, this.WorkStatus.bind(this))		//改变工作状态
		Commond.Register(L2C.L2C_PROCESS_WORK_SCORE, this.WorkScore.bind(this))
		Commond.Register(L2C.L2C_PROCESS_WORK_CLEAR, this.WorkClear.bind(this))
	}
	//预览
	View(data: L2C_ProcessView) {
		ProcessData.Init(data)
		ProcessPanel.SetDateRange()
		ProcessPanel.CreateProcess()
	}
	//清空工作
	WorkClear(data: L2C_ProcessWorkClear) {
		var work = ProcessData.WorkMap[data.Wid]
		$('#content .trWork[lid="' + work.Lid + '"] td').each((index: number, el: HTMLElement): void | false => {
			var grid: IWorkGrid = $(el).data('grid')
			if (!grid) {
				return
			}
			if (work.Date == grid.s) {
				$(el).removeClass().empty()
				if (grid.w >= 6) {
					$(el).addClass('weekend')
				}
				grid.wid = 0
				return false
			}
			return
		})
		//数据变化
		delete ProcessData.WorkMap[data.Wid]
	}
	//新增流程
	LinkAdd(data: L2C_ProcessLinkAdd) {
		//数据变化
		ProcessData.LinkMap[data.LinkSingle.Lid] = data.LinkSingle
		var mode: ModeSingle = ProcessData.ModeMap[data.LinkSingle.Mid]
		if (mode) {
			var prevIndex = ArrayUtil.IndexOfAttr(mode.LinkList, FieldName.Lid, data.PrevLid)
			if (prevIndex > -1) {
				mode.LinkList.splice(prevIndex + 1, 0, data.LinkSingle)
			}
			ProcessPanel.ChangeModeNameMaxHeight(mode)
			//
			//vue会自动处理的,这里可以注释掉了
		/* 	var add = $(ProcessPanel.GetLinkHtml(data.LinkSingle))
			$('#content .trLink[lid="' + data.PrevLid + '"]').after(add)
			ProcessPanel.SetLinkData(data.LinkSingle.Lid, add.get(0))
			//
			*/
			var add = $(ProcessPanel.GetWorkHtml(data.LinkSingle))
			$('#content .trWork[lid="' + data.PrevLid + '"]').after(add)
			ProcessPanel.SetWorkData(data.LinkSingle.Lid, add.get(0)) 
		}
	}
	//流程名字
	LinkEdit(data: LinkSingle) {
		//数据变化
		var link: LinkSingle = ProcessData.LinkMap[data.Lid]
		if (link) {
			ProcessData.LinkMap[link.Lid].Name = data.Name
		/* 	$('#content .trLink[lid="' + link.Lid + '"] .link').html(
				ProcessPanel.GetLinkName(link)
			) */
		}
	}
	//流程颜色
	LinkColor(data: LinkSingle) {
		//数据变化
		var link: LinkSingle = ProcessData.LinkMap[data.Lid]
		if (link) {
			link.Color = data.Color
			// $('#content .trLink[lid="' + data.Lid + '"] .link').attr('class', 'link bg_' + data.Color)
		}
	}
	//改变责任
	LinkUserChange(data: LinkSingle) {
		//数据变化
		var link: LinkSingle = ProcessData.LinkMap[data.Lid]
		if (link) {
			link.Uid = data.Uid
			// $('#content .trLink[lid="' + data.Lid + '"] .duty').html(ProcessPanel.GetLinkUserName(data))
		}
	}
	//交换流程
	LinkSwapSort(data: L2C_ProcessLinkSwapSort) {
		//数据变化
		var link0 = ProcessData.LinkMap[data.Swap[0]]
		var link1 = ProcessData.LinkMap[data.Swap[1]]
		if (!link0 || !link1) {
		} else {
			var mode: ModeSingle = ProcessData.ModeMap[link0.Mid]
			var index0 = ArrayUtil.IndexOfAttr(mode.LinkList, FieldName.Lid, link0.Lid)
			var index1 = ArrayUtil.IndexOfAttr(mode.LinkList, FieldName.Lid, link1.Lid)
			if (index0 > -1 && index0 > -1) {
				mode.LinkList.splice(index0, 1, ...mode.LinkList.splice(index1, 1, link0))
			}
			//
		/* 	var A = $('#content .trLink[lid="' + link0.Lid + '"]')
			var B = $('#content .trLink[lid="' + link1.Lid + '"]')
			A.before(B)
			//
			var A = $('#content .trWork[lid="' + link0.Lid + '"]')
			var B = $('#content .trWork[lid="' + link1.Lid + '"]')
			A.before(B) */
		}
	}
	//归档处理
	LinkStore(data: L2C_ProcessLinkStore) {
		//在进行状态中
		if (data.Status == LinkStatusField.STORE) {
			var link = ProcessData.LinkMap[data.Lid]
			if (link) {
				if (ProcessData.CheckNumberArray(LinkStatusField.STORE, ProcessFilter.Pack.LinkStatus) == false) {
					//归档
					this.DoLinkDelete(link)
				}
				else {
					link.Status = data.Status
					// this.LinkEdit(link)
				}
			}
		} else {
			var link = ProcessData.LinkMap[data.Lid]
			if (link) {
				link.Status = data.Status
				// this.LinkEdit(link)
			}
		}
	}
	//删除流程
	LinkDelete(data: L2C_ProcessLinkDelete) {
		//数据变化
		var link: LinkSingle = ProcessData.LinkMap[data.Lid]
		if (link) {
			this.DoLinkDelete(link)
		}
	}
	DoLinkDelete(link: LinkSingle) {
		var mode: ModeSingle = ProcessData.ModeMap[link.Mid]
		ArrayUtil.RemoveByAttr(mode.LinkList, FieldName.Lid, link.Lid)
		//删除工作
		$.each(ProcessData.WorkMap, (k, v: WorkSingle) => {
			if (v.Lid != link.Lid) {
				return
			}
			delete ProcessData.WorkMap[v.Wid]
		})
		delete ProcessData.LinkMap[link.Lid]
		//
		ProcessPanel.ChangeModeNameMaxHeight(mode)
		//
		// $('#content .trLink[lid="' + link.Lid + '"]').remove()
		$('#content .trWork[lid="' + link.Lid + '"]').remove()
	}
	/**改变工作 状态 :工作 完成 延期 等待 优化 请假*/
	WorkStatus(data: WorkSingle) {
		this.WorkEdit(data)
	}
	/**工作编辑 */
	WorkEdit(data: WorkSingle) {
		//数据变化
		ProcessData.WorkMap[data.Wid] = data
		$('#content .trWork[lid="' + data.Lid + '"] td').each((index: number, el: HTMLElement): void | false => {
			var grid: IWorkGrid = $(el).data('grid')
			if (!grid) {
				return
			}
			if (data.Date == grid.s) {
				grid.wid = data.Wid
				ProcessPanel.ShowWorkGrid(el, grid, data)
				return false
			}
			return
		})
	}
	//添加功能
	ModeAdd(data: L2C_ProcessModeAdd) {
		//
		var prevIndex = ArrayUtil.IndexOfAttr(ProcessData.Project.ModeList, FieldName.Mid, data.PrevMid)
		data.ModeSingle.LinkList = data.LinkList
		delete data['LinkList']
		// ProcessData.LinkMap[data.LinkSingle.Lid] = data.LinkSingle
		var len = data.ModeSingle.LinkList.length
		for (var i = 0; i < len; i++) {
			var link = data.ModeSingle.LinkList[i];
			ProcessData.LinkMap[link.Lid] = link
		}
		if (prevIndex > -1) {
			ProcessData.Project.ModeList.splice(prevIndex + 1, 0, data.ModeSingle)
		}
		ProcessData.ModeMap[data.ModeSingle.Mid] = data.ModeSingle
		/* 
		//# add mode
		//lfet
		var add = $(ProcessPanel.GetModeHtmlLeft(data.ModeSingle.Mid))
		// $('#content .trModeLeft[mid="' + data.PrevMid + '"]').next().after(add)
		$('#content .trModeLeft[mid="' + data.PrevMid + '"]').after(add)
		add.find('.trLink').each(function () {
			var lid = parseInt($(this).attr('lid'))
			ProcessPanel.SetLinkData(lid, this)
		})*/
		//right
		var add = $(ProcessPanel.GetModeHtmlRight(data.ModeSingle.Mid))
		$('#content .trModeRight[mid="' + data.PrevMid + '"]').after(add)
		// $('#content .trModeRight[mid="' + data.PrevMid + '"]').next().after(add)
		add.find('.trWork').each(function () {
			var lid = parseInt($(this).attr('lid'))
			ProcessPanel.SetWorkData(lid, this)
		})
		//#
		ProcessPanel.BindActions()
	}
	//编辑功能
	ModeEdit(data: ModeSingle) {
		//数据变化
		var mode: ModeSingle = ProcessData.ModeMap[data.Mid]
		if (mode) {
			mode.Name = data.Name
			mode.Vid = data.Vid
			// $('#content .mode[mid="' + mode.Mid + '"]').html(
			// 	ProcessPanel.GetModeName(mode)
			// )
		}
	}
	//功能颜色
	ModeColor(data: ModeSingle) {
		//数据变化
		var mode: ModeSingle = ProcessData.ModeMap[data.Mid]
		if (mode) {
			ProcessData.ModeMap[data.Mid].Color = data.Color
			// $('#content .mode[mid="' + data.Mid + '"]').attr('class', 'mode bg_' + data.Color)
		}
	}
	//功能交换
	ModeSwapSort(data: L2C_ProcessModeSwapSort): void {
		//数据变化
		var mode0: ModeSingle = ProcessData.ModeMap[data.Swap[0]]
		var mode1: ModeSingle = ProcessData.ModeMap[data.Swap[1]]
		if (!mode0 || !mode1) {
		} else {
			var project: ProjectSingle = ProcessData.Project
			var index0 = ArrayUtil.IndexOfAttr(project.ModeList, FieldName.Mid, mode0.Mid)
			var index1 = ArrayUtil.IndexOfAttr(project.ModeList, FieldName.Mid, mode1.Mid)
			if (index0 > -1 && index0 > -1) {
				project.ModeList.splice(index0, 1, ...project.ModeList.splice(index1, 1, mode0))
			}
			/* //left
			var A = $('#content .mode[mid="' + data.Swap[0] + '"]').parent()
			// var AN = A.next()
			var B = $('#content .mode[mid="' + data.Swap[1] + '"]').parent()
			// var BN = B.next()
			A.before(B)
			// A.before(AN)
			//right
			var A = $('#content .trModeRight[mid="' + data.Swap[0] + '"]')
			// var AN = A.next()
			var B = $('#content .trModeRight[mid="' + data.Swap[1] + '"]')
			// var BN = B.next()
			A.before(B) 
			// A.before(AN)
			*/
		}
	}
	//归档处理
	ModeStore(data: L2C_ProcessModeStore) {
		if (data.Status == ModeStatusField.STORE) {//归档 => 进行中
			var mode = ProcessData.ModeMap[data.Mid]
			if (mode) {
				if (ProcessData.CheckNumberArray(ModeStatusField.STORE, ProcessFilter.Pack.ModeStatus) == false) {
					//仅显示`进行中`, 则删除
					this.DoModeDelete(mode)
				} else {//设置为归档效果
					mode.Status = data.Status
					// this.ModeEdit(mode)
				}
			}
		} else {//归档 => 进行中
			var mode = ProcessData.ModeMap[data.Mid]
			if (mode) {
				mode.Status = data.Status
				// this.ModeEdit(mode)
			}
		}
	}
	//删除功能
	ModeDelete(data: L2C_ProcessModeDelete) {
		var mode: ModeSingle = ProcessData.ModeMap[data.Mid]
		if (mode) {
			this.DoModeDelete(mode)
		}
	}
	DoModeDelete(mode: ModeSingle) {
		ArrayUtil.RemoveByAttr(ProcessData.Project.ModeList, FieldName.Mid, mode.Mid)
		delete ProcessData.ModeMap[mode.Mid]
		$.each(mode.LinkList, (k, link: LinkSingle) => {
			//删除工作
			$.each(ProcessData.WorkMap, (k, v: WorkSingle) => {
				if (v.Lid != link.Lid) {
					return
				}
				delete ProcessData.WorkMap[v.Wid]
			})
			//删除流程
			delete ProcessData.LinkMap[link.Lid]
		})
		//
	/* 	var del = $('#content .mode[mid="' + mode.Mid + '"]').parent()
		// del.next().remove()
		del.remove()
		del = $('#content .trModeRight[mid="' + mode.Mid + '"]')
		// del.next().remove()
		del.remove() */
	}
	//设置评分
	WorkScore(data: ScoreSingle) {
		//数据变化
		// if (data.Score == 0) {
		// delete ProcessData.ScoreMap[data.Wid]
		// } else {
		ProcessData.ScoreMap[data.Wid] = data
		// }
		var work = ProcessData.WorkMap[data.Wid]
		this.WorkEdit(work)
		NoticeManager.ScoreEdit(data)
	}
	/**
	 * @data PublishSingle 
	 */
	PublishEdit(data: L2C_ProcessPublishEdit) {
		$.each(ProcessPanel.DateList.list, function (k, v) {
			if (data.DateLine != v.s) {
				return true
			}
			var pub = $('#content .title td:eq(' + (k + 3) + ')')
			pub.find('.stroke').remove()
			pub.append('<div class="stroke sk_' + data.Genre + '" date_line="' + data.DateLine + '"></div>')
			return false
		})
		//数据变化
		// ProcessData.VersionDateLineMap[data.DateLine] = data		//VersionManager中设置了 这里不需要了
	}
	/**
	 * @dateLine PublishSingle.DateLine
	 */
	PublishDelete(dateLine: string) {
		$.each(ProcessPanel.DateList.list, function (k, v) {
			if (dateLine != v.s) {
				return true
			}
			$('#content .title td:eq(' + (k + 3) + ')').find('.stroke').remove()
			return false
		})
		//数据变化
		// delete ProcessData.VersionDateLineMap[data.DateLine]
	}
}


var ProcessManager = new ProcessManagerClass()