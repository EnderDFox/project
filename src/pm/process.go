package main

import (
	"log"
	"time"
)

type Process struct {
	owner *User
}

func NewProcess(user *User) *Process {
	instance := &Process{}
	instance.owner = user
	return instance
}

//评分
func (this *Process) WorkScore(wid, quality, efficiency, manner uint64, info string) bool {
	if wid == 0 {
		return false
	}
	stmt, err := db.GetDb().Prepare(`REPLACE INTO ` + config.Pm + `.pm_work_score (wid,add_uid,quality, efficiency, manner,info,create_time) VALUES (?,?,?,?,?,?,?)`)
	defer stmt.Close()
	db.CheckErr(err)
	res, err := stmt.Exec(wid, this.owner.GetUid(), quality, efficiency, manner, info, time.Now().Unix())
	db.CheckErr(err)
	num, err := res.RowsAffected()
	db.CheckErr(err)
	if num == 0 {
		return false
	}
	scoreSingle := &ScoreSingle{
		Wid:        wid,
		Info:       info,
		Quality:    quality,
		Efficiency: efficiency,
		Manner:     manner,
	}
	this.owner.SendToAll(L2C_PROCESS_WORK_SCORE, scoreSingle)
	return true
}

//归档
func (this *Process) ModeStore(mid uint64, status uint8) bool {
	stmt, err := db.GetDb().Prepare(`UPDATE ` + config.Pm + `.pm_mode SET status = ? WHERE mid = ?`)
	defer stmt.Close()
	db.CheckErr(err)
	res, err := stmt.Exec(status, mid)
	db.CheckErr(err)
	num, err := res.RowsAffected()
	db.CheckErr(err)
	if num == 0 {
		return false
	}
	data := &L2C_ProcessModeStore{
		Mid:    mid,
		Status: status,
	}
	this.owner.SendToAll(L2C_PROCESS_MODE_STORE, data)
	return true
}

//归档
func (this *Process) LinkStore(lid uint64, status uint8) bool {
	stmt, err := db.GetDb().Prepare(`UPDATE ` + config.Pm + `.pm_link SET status = ? WHERE lid = ?`)
	defer stmt.Close()
	db.CheckErr(err)
	res, err := stmt.Exec(status, lid)
	db.CheckErr(err)
	num, err := res.RowsAffected()
	db.CheckErr(err)
	if num == 0 {
		return false
	}
	data := &L2C_ProcessLinkStore{
		Lid:    lid,
		Status: status,
	}
	this.owner.SendToAll(L2C_PROCESS_LINK_STORE, data)
	return true
}

//移动
func (this *Process) ModeSwapSort(swap []uint64) bool {
	db.SwapSort(`pm_mode`, `mid`, swap[0], swap[1])
	data := &L2C_ProcessModeSwapSort{
		Swap: swap,
	}
	this.owner.SendToAll(L2C_PROCESS_MODE_SWAP_SORT, data)
	return true
}

//颜色
func (this *Process) LinkColor(lid, color uint64) bool {
	//查询
	stmt, err := db.GetDb().Prepare(`SELECT lid,uid,mid,name,status FROM ` + config.Pm + `.pm_link WHERE lid = ?`)
	defer stmt.Close()
	db.CheckErr(err)
	linkSingle := &LinkSingle{}
	stmt.QueryRow(lid).Scan(&linkSingle.Lid, &linkSingle.Uid, &linkSingle.Mid, &linkSingle.Name, &linkSingle.Status)
	stmt, err = db.GetDb().Prepare(`UPDATE ` + config.Pm + `.pm_link SET color = ? WHERE lid = ?`)
	db.CheckErr(err)
	_, err = stmt.Exec(color, linkSingle.Lid)
	db.CheckErr(err)
	linkSingle.Color = color
	this.owner.SendToAll(L2C_PROCESS_LINK_COLOR, linkSingle)
	return true
}

//颜色
func (this *Process) ModeColor(mid, color uint64) bool {
	stmt, err := db.GetDb().Prepare(`UPDATE ` + config.Pm + `.pm_mode SET color = ? WHERE mid = ?`)
	db.CheckErr(err)
	stmt.Exec(color, mid)
	modeSingle := &ModeSingle{}
	modeSingle.Mid = mid
	modeSingle.Color = color
	this.owner.SendToAll(L2C_PROCESS_MODE_COLOR, modeSingle)
	return true
}

//删除
func (this *Process) ModeDelete(mid uint64) bool {
	//删除模块
	stmt, err := db.GetDb().Prepare(`DELETE FROM ` + config.Pm + `.pm_mode WHERE mid = ?`)
	defer stmt.Close()
	db.CheckErr(err)
	_, err = stmt.Exec(mid)
	db.CheckErr(err)
	//删除工作
	stmt, err = db.GetDb().Prepare(`DELETE FROM ` + config.Pm + `.pm_work WHERE lid IN (SELECT lid FROM ` + config.Pm + `.pm_link WHERE mid = ?)`)
	db.CheckErr(err)
	_, err = stmt.Exec(mid)
	db.CheckErr(err)
	//删除环节
	stmt, err = db.GetDb().Prepare(`DELETE FROM ` + config.Pm + `.pm_link WHERE mid = ?`)
	db.CheckErr(err)
	_, err = stmt.Exec(mid)
	db.CheckErr(err)
	data := &L2C_ProcessModeDelete{
		Mid: mid,
	}
	this.owner.SendToAll(L2C_PROCESS_MODE_DELETE, data)
	return true
}

//插入一个空流程
func (this *Process) LinkAddOne(mid uint64) *LinkSingle {
	stmt, err := db.GetDb().Prepare(`INSERT INTO ` + config.Pm + `.pm_link (mid,uid,add_uid,create_time,sort) VALUES (?,?,?,?,1)`)
	res, err := stmt.Exec(mid, this.owner.GetUid(), this.owner.GetUid(), time.Now().Unix())
	db.CheckErr(err)
	lid, err := res.LastInsertId()
	db.CheckErr(err)
	//
	linkSingle := &LinkSingle{}
	linkSingle.Lid = uint64(lid)
	linkSingle.Mid = uint64(mid)
	linkSingle.Uid = this.owner.GetUid()
	linkSingle.Name = ""
	return linkSingle
}

func (this *Process) GetPidSortByMid(mid uint64) (uint64, uint32) {
	if mid > 0 {
		var pid uint64
		var sort uint32
		stmt, err := db.GetDb().Prepare(`SELECT pid,sort FROM ` + config.Pm + `.pm_mode WHERE mid = ?`)
		defer stmt.Close()
		db.CheckErr(err)
		stmt.QueryRow(mid).Scan(&pid, &sort)
		if pid == 0 {
			log.Println(`Can not find pid, when mid=`, mid)
			return 0, 0
		}
		return pid, sort
	} else {
		return this.owner.GetPid(), 0
	}
}

//插入
func (this *Process) ModeAdd(prevMid uint64, name string, vid uint64, did uint64, tmid uint64) bool {
	//获取 prev mode 的 pid 和sort
	pid, sort := this.GetPidSortByMid(prevMid)
	//目标后的link的sort+1
	stmt, err := db.GetDb().Prepare(`UPDATE ` + config.Pm + `.pm_mode SET sort=sort+1 WHERE is_del=0 AND pid=? AND sort >?`)
	defer stmt.Close()
	db.CheckErr(err)
	_, err = stmt.Exec(pid, sort)
	db.CheckErr(err)
	//插入一个模块
	stmt, err = db.GetDb().Prepare(`INSERT INTO ` + config.Pm + `.pm_mode (pid,name,add_uid,vid,did,create_time,sort) VALUES (?,?,?,?,?,?,?)`)
	defer stmt.Close()
	db.CheckErr(err)
	res, err := stmt.Exec(pid, name, this.owner.GetUid(), vid, did, time.Now().Unix(), sort+1)
	db.CheckErr(err)
	newMid, err := res.LastInsertId()
	db.CheckErr(err)
	//## 新建 link list
	var linkList []*LinkSingle
	if tmid <= 0 {
		//没用模板  插入一个环节
		linkSingle := this.LinkAddOne(uint64(newMid))
		linkList = append(linkList, linkSingle)
		//
	} else {
		//按照模板中插入环节
		var tplLinkList = this.owner.Template().GetLinkList(tmid, 0)
		if len(tplLinkList) == 0 {
			//模板里没有流程 插入一个空环节
			linkSingle := this.LinkAddOne(uint64(newMid))
			linkList = append(linkList, linkSingle)
		} else {
			didToUidMap := *timer.getDidUidMapByPid(this.owner.GetPid())
			for i, tplLink := range tplLinkList {
				//stmt, err = db.GetDb().Prepare(`INSERT INTO ` + config.Pm + `.pm_link (mid,uid,add_uid,create_time,name) SELECT ?,?,?,?,name FROM pm.pm_template_link WHERE tlid = ?`)
				//res, err = stmt.Exec(newMid, this.owner.GetUid(), this.owner.GetUid(), time.Now().Unix(),tlid)
				stmt, err = db.GetDb().Prepare(`INSERT INTO ` + config.Pm + `.pm_link (mid,uid,add_uid,create_time,name,sort) VALUES (?,?,?,?,?,?)`)
				//uid 要使用模板的did所对应的部门老大uid
				res, err = stmt.Exec(newMid, didToUidMap[tplLink.Did], this.owner.GetUid(), time.Now().Unix(), tplLink.Name, i+1)
				db.CheckErr(err)
				lid, err := res.LastInsertId()
				db.CheckErr(err)
				//
				linkSingle := &LinkSingle{}
				linkSingle.Lid = uint64(lid)
				linkSingle.Mid = uint64(newMid)
				linkSingle.Uid = didToUidMap[tplLink.Did]
				linkSingle.Name = tplLink.Name
				linkSingle.Sort = uint32(i) + 1
				linkSingle.ParentLid = 0
				linkList = append(linkList, linkSingle)
				//# 插入子流程
				for iChild, tplLinkChild := range tplLink.Children {
					log.Println(`iChild:`, iChild)
					stmt, err = db.GetDb().Prepare(`INSERT INTO ` + config.Pm + `.pm_link (mid,uid,add_uid,create_time,name,sort,parent_lid) VALUES (?,?,?,?,?,?,?)`)
					res, err = stmt.Exec(newMid, didToUidMap[tplLinkChild.Did], this.owner.GetUid(), time.Now().Unix(), tplLinkChild.Name, iChild+1, linkSingle.Lid)
					db.CheckErr(err)
					child_lid, err := res.LastInsertId()
					db.CheckErr(err)
					//
					linkSingleChild := &LinkSingle{}
					linkSingleChild.Lid = uint64(child_lid)
					linkSingleChild.Mid = uint64(newMid)
					linkSingleChild.Uid = didToUidMap[tplLinkChild.Did]
					linkSingleChild.Name = tplLinkChild.Name
					linkSingleChild.Sort = uint32(iChild) + 1
					linkSingleChild.ParentLid = linkSingle.Lid
					linkSingle.Children = append(linkSingle.Children, linkSingleChild)
				}
			}
		}
	}
	//send
	data := &L2C_ProcessModeAdd{
		PrevMid: prevMid,
		ModeSingle: &ModeSingle{
			Mid:   uint64(newMid),
			Vid:   vid,
			Color: 0,
			Name:  name,
			Did:   0,
			Sort:  sort + 1,
		},
		LinkList: linkList,
	}
	this.owner.SendToAll(L2C_PROCESS_MODE_ADD, data)
	return true
}

//编辑
func (this *Process) ModeEdit(mid uint64, name string, vid uint64) bool {
	//查询
	stmt, err := db.GetDb().Prepare(`SELECT mid,color,did FROM ` + config.Pm + `.pm_mode WHERE mid = ?`)
	defer stmt.Close()
	db.CheckErr(err)
	modeSingle := &ModeSingle{}
	stmt.QueryRow(mid).Scan(&modeSingle.Mid, &modeSingle.Color, &modeSingle.Did)
	if modeSingle.Mid == 0 {
		log.Println(`modeSingle.Mid:`, modeSingle.Mid)
		return false
	}
	stmt, err = db.GetDb().Prepare(`UPDATE ` + config.Pm + `.pm_mode SET name = ?,vid = ? WHERE mid = ?`)
	db.CheckErr(err)
	_, err = stmt.Exec(name, vid, mid)
	db.CheckErr(err)
	modeSingle.Name = name
	modeSingle.Vid = vid
	this.owner.SendToAll(L2C_PROCESS_MODE_EDIT, modeSingle)
	return true
}

//编辑
func (this *Process) WorkEdit(lid, minNum, maxNum uint64, date, tips, tag string) bool {
	//查询
	stmt, err := db.GetDb().Prepare(`SELECT wid,status FROM ` + config.Pm + `.pm_work WHERE date = ? AND lid = ?`)
	defer stmt.Close()
	db.CheckErr(err)
	row := stmt.QueryRow(date, lid)
	var wid, status uint64
	row.Scan(&wid, &status)
	if wid > 0 {
		stmt, err = db.GetDb().Prepare(`UPDATE ` + config.Pm + `.pm_work SET min_num = ?,max_num = ?,tips = ?,tag = ? WHERE date = ? AND lid = ?`)
		db.CheckErr(err)
		_, err = stmt.Exec(minNum, maxNum, tips, tag, date, lid)
		db.CheckErr(err)
	} else {
		stmt, err = db.GetDb().Prepare(`INSERT INTO ` + config.Pm + `.pm_work (lid,status,min_num,max_num,tips,date,tag,create_time) VALUES (?,?,?,?,?,?,?,?)`)
		db.CheckErr(err)
		res, err := stmt.Exec(lid, status, minNum, maxNum, tips, date, tag, time.Now().Unix())
		db.CheckErr(err)
		newWid, err := res.LastInsertId()
		wid = uint64(newWid)
	}
	data := &WorkSingle{
		Wid:      wid,
		Lid:      lid,
		Status:   status,
		Date:     date,
		Tips:     tips,
		MinNum:   minNum,
		MaxNum:   maxNum,
		Tag:      tag,
		FileList: this.owner.Upload().GetFileList(FILE_JOIN_KIND_WORK, wid),
	}
	this.owner.SendToAll(L2C_PROCESS_WORK_EDIT, data)
	return true
}

//编辑
func (this *Process) LinkEdit(lid uint64, name string) bool {
	//查询
	stmt, err := db.GetDb().Prepare(`SELECT uid,mid,color,status FROM ` + config.Pm + `.pm_link WHERE lid = ?`)
	defer stmt.Close()
	db.CheckErr(err)
	linkSingle := &LinkSingle{}
	stmt.QueryRow(lid).Scan(&linkSingle.Uid, &linkSingle.Mid, &linkSingle.Color, &linkSingle.Status)
	stmt, err = db.GetDb().Prepare(`UPDATE ` + config.Pm + `.pm_link SET name = ? WHERE lid = ?`)
	defer stmt.Close()
	db.CheckErr(err)
	_, err = stmt.Exec(name, lid)
	db.CheckErr(err)
	linkSingle.Name = name
	linkSingle.Lid = lid
	this.owner.SendToAll(L2C_PROCESS_LINK_EDIT, linkSingle)
	return true
}

//删除
func (this *Process) LinkDelete(lid uint64) bool {
	//删除环节
	stmt, err := db.GetDb().Prepare(`DELETE FROM ` + config.Pm + `.pm_link WHERE lid = ? OR parent_lid = ?`)
	db.CheckErr(err)
	_, err = stmt.Exec(lid, lid)
	db.CheckErr(err)
	//删除work数据
	stmt, err = db.GetDb().Prepare(`DELETE FROM ` + config.Pm + `.pm_work WHERE lid IN (SELECT lid FROM ` + config.Pm + `.pm_link WHERE lid = ? OR parent_lid = ?)`)
	db.CheckErr(err)
	_, err = stmt.Exec(lid, lid)
	db.CheckErr(err)
	//# 子流程 删除 work
	//#
	data := &L2C_ProcessLinkDelete{
		Lid: lid,
	}
	this.owner.SendToAll(L2C_PROCESS_LINK_DELETE, data)
	return true
}

//插入新 link
func (this *Process) LinkAdd(prevLid uint64, name string, parentLid uint64) bool {
	if prevLid == 0 && parentLid == 0 {
		log.Println(`revLid==0 && parentLid==0`)
		return false
	}
	var mid, sort, _parentLid = this.GetMidSortByPrevLidAndParentLid(prevLid, parentLid)
	if mid == 0 {
		log.Println(`Can not find mid, when prevLid=`, prevLid, `parentLid=`, parentLid)
		return false
	}
	//目标后的link的sort+1
	stmt, err := db.GetDb().Prepare(`UPDATE ` + config.Pm + `.pm_link SET sort=sort+1 WHERE is_del=0 AND mid=? AND parent_lid=? AND sort >?`)
	defer stmt.Close()
	db.CheckErr(err)
	_, err = stmt.Exec(mid, _parentLid, sort)
	db.CheckErr(err)
	//插入新的行
	stmt, err = db.GetDb().Prepare(`INSERT INTO ` + config.Pm + `.pm_link (mid,uid,add_uid,name,create_time,sort,parent_lid) VALUES (?,?,?,?,?,?,?)`)
	db.CheckErr(err)
	uid := this.owner.GetUid()
	res, err := stmt.Exec(mid, uid, uid, name, time.Now().Unix(), sort+1, _parentLid)
	db.CheckErr(err)
	newLid, err := res.LastInsertId()
	db.CheckErr(err)
	//send
	linkSingle := &LinkSingle{
		Lid:       uint64(newLid),
		Mid:       mid,
		Uid:       uid,
		Name:      name,
		Sort:      sort + 1,
		ParentLid: _parentLid,
	}
	data := &L2C_ProcessLinkAdd{
		PrevLid:    prevLid,
		LinkSingle: linkSingle,
	}
	this.owner.SendToAll(L2C_PROCESS_LINK_ADD, data)
	return true
}

func (this *Process) GetMidSortByPrevLidAndParentLid(prevLid uint64, parentLid uint64) (uint64, uint32, uint64) {
	var lid uint64
	if prevLid == 0 {
		lid = parentLid
	} else {
		lid = prevLid
	}
	//获得prev link的mid和sort
	stmt, err := db.GetDb().Prepare(`SELECT mid,sort,parent_lid FROM ` + config.Pm + `.pm_link WHERE lid = ?`)
	defer stmt.Close()
	db.CheckErr(err)
	var mid uint64
	var sort uint32
	var _parentLid uint64
	stmt.QueryRow(lid).Scan(&mid, &sort, &_parentLid)
	if prevLid == 0 && parentLid > 0 { //在子流程最后增加一个新的子流程
		_parentLid = parentLid
		//获取子流程里最大sort值, 父流程都是插入,没有在最后补充一个的情况,因此不需要max(sort)
		// SELECT IFNULL(max(sort),0) FROM pm.pm_link WHERE is_del=0 AND parent_lid=4877
		stmt, err := db.GetDb().Prepare(`SELECT IFNULL(max(sort),0) FROM ` + config.Pm + `.pm_link WHERE is_del=0 AND parent_lid=?`)
		defer stmt.Close()
		db.CheckErr(err)
		stmt.QueryRow(parentLid).Scan(&sort)
	}
	return mid, sort, _parentLid
}

//link交换  link 交换位置
func (this *Process) LinkSwapSort(swap []uint64) bool {
	db.SwapSort(`pm_link`, `lid`, swap[0], swap[1])
	data := &L2C_ProcessLinkSwapSort{
		Swap: swap,
	}
	this.owner.SendToAll(L2C_PROCESS_LINK_SWAP_SORT, data)
	return true
}

//用户改变
func (this *Process) LinkUserChange(lid, uid uint64) bool {
	//查询
	stmt, err := db.GetDb().Prepare(`SELECT mid,name FROM ` + config.Pm + `.pm_link WHERE lid = ?`)
	defer stmt.Close()
	db.CheckErr(err)
	row := stmt.QueryRow(lid)
	var mid uint64
	var name string
	row.Scan(&mid, &name)
	if mid == 0 {
		return false
	}
	stmt, err = db.GetDb().Prepare(`UPDATE ` + config.Pm + `.pm_link SET uid = ? WHERE lid = ?`)
	db.CheckErr(err)
	res, err := stmt.Exec(uid, lid)
	db.CheckErr(err)
	res.RowsAffected()
	data := &LinkSingle{
		Lid:  lid,
		Uid:  uid,
		Mid:  mid,
		Name: name,
	}
	this.owner.SendToAll(L2C_PROCESS_LINK_USER_CHANGE, data)
	return true
}

//状态改变
func (this *Process) WorkStatus(lid uint64, date string, status uint64) bool {
	//查询
	stmt, err := db.GetDb().Prepare(`SELECT wid,tips,min_num,max_num,tag FROM ` + config.Pm + `.pm_work WHERE date = ? AND lid = ?`)
	defer stmt.Close()
	db.CheckErr(err)
	var wid, minNum, maxNum uint64
	var tips, tag string
	stmt.QueryRow(date, lid).Scan(&wid, &tips, &minNum, &maxNum, &tag)
	if wid == 0 {
		//写入操作
		stmt, err := db.GetDb().Prepare(`INSERT INTO ` + config.Pm + `.pm_work (lid,add_uid,date,status,create_time) VALUES (?,?,?,?,?)`)
		defer stmt.Close()
		db.CheckErr(err)
		res, err := stmt.Exec(lid, this.owner.GetUid(), date, status, time.Now().Unix())
		db.CheckErr(err)
		lastid, err := res.LastInsertId()
		db.CheckErr(err)
		wid = uint64(lastid)
	} else {
		//更新操作
		stmt, err := db.GetDb().Prepare(`UPDATE ` + config.Pm + `.pm_work SET status = ? WHERE wid = ?`)
		defer stmt.Close()
		db.CheckErr(err)
		res, err := stmt.Exec(status, wid)
		db.CheckErr(err)
		res.RowsAffected()
	}
	data := &WorkSingle{
		Wid:      wid,
		Lid:      lid,
		Status:   status,
		Date:     date,
		Tips:     tips,
		MaxNum:   maxNum,
		MinNum:   minNum,
		Tag:      tag,
		FileList: this.owner.Upload().GetFileList(FILE_JOIN_KIND_WORK, wid),
	}
	this.owner.SendToAll(L2C_PROCESS_WORK_STATUS, data)
	return true
}

//清理状态
func (this *Process) WorkClear(lid uint64, date string) bool {
	stmt, err := db.GetDb().Prepare(`SELECT wid FROM ` + config.Pm + `.pm_work WHERE date = ? AND lid = ?`)
	defer stmt.Close()
	db.CheckErr(err)
	row := stmt.QueryRow(date, lid)
	var wid uint64
	row.Scan(&wid)
	if wid == 0 {
		return false
	}
	stmt, err = db.GetDb().Prepare(`DELETE FROM ` + config.Pm + `.pm_work WHERE wid = ?`)
	db.CheckErr(err)
	_, err = stmt.Exec(wid)
	db.CheckErr(err)
	data := &L2C_ProcessWorkClear{
		Wid: wid,
	}
	this.owner.SendToAll(L2C_PROCESS_WORK_CLEAR, data)
	return true
}

//获取模块列表
func (this *Process) GetModeList() []*ModeSingle {
	stmt, err := db.GetDb().Prepare(`SELECT mid,vid,name,color,did,status,sort FROM ` + config.Pm + `.pm_mode WHERE is_del=0 AND pid=? ORDER BY sort`)
	defer stmt.Close()
	db.CheckErr(err)
	rows, err := stmt.Query(this.owner.GetPid())
	defer rows.Close()
	db.CheckErr(err)
	var modeList []*ModeSingle
	for rows.Next() {
		single := &ModeSingle{}
		rows.Scan(&single.Mid, &single.Vid, &single.Name, &single.Color, &single.Did, &single.Status, &single.Sort)
		modeList = append(modeList, single)
	}
	return modeList
}

//获取环节列表
func (this *Process) GetLinkList() []*LinkSingle {
	stmt, err := db.GetDb().Prepare(`SELECT lid,mid,name,uid,color,status,sort,parent_lid FROM ` + config.Pm + `.pm_link WHERE is_del=0 ORDER BY sort`)
	defer stmt.Close()
	db.CheckErr(err)
	rows, err := stmt.Query()
	defer rows.Close()
	db.CheckErr(err)
	var linkList []*LinkSingle
	for rows.Next() {
		single := &LinkSingle{}
		rows.Scan(&single.Lid, &single.Mid, &single.Name, &single.Uid, &single.Color, &single.Status, &single.Sort, &single.ParentLid)
		linkList = append(linkList, single)
	}
	return linkList
}

//获取工作列表
func (this *Process) GetWorkList(BeginDate, EndDate string) []*WorkSingle {
	stmt, err := db.GetDb().Prepare(`SELECT wid,lid,date,status,tips,min_num,max_num,tag FROM ` + config.Pm + `.pm_work WHERE date >= ? AND date <= ? `)
	defer stmt.Close()
	db.CheckErr(err)
	rows, err := stmt.Query(BeginDate, EndDate)
	defer rows.Close()
	db.CheckErr(err)
	var workList []*WorkSingle
	for rows.Next() {
		single := &WorkSingle{}
		rows.Scan(&single.Wid, &single.Lid, &single.Date, &single.Status, &single.Tips, &single.MinNum, &single.MaxNum, &single.Tag)
		single.FileList = this.owner.Upload().GetFileList(FILE_JOIN_KIND_WORK, single.Wid)
		workList = append(workList, single)
	}
	return workList
}

//所属项目
func (this *Process) GetProject() *ProjectSingle {
	stmt, err := db.GetDb().Prepare(`SELECT pid,name FROM ` + config.Pm + `.pm_project WHERE pid = ?`)
	defer stmt.Close()
	db.CheckErr(err)
	row := stmt.QueryRow(this.owner.GetPid())
	project := &ProjectSingle{}
	row.Scan(&project.Pid, &project.Name)
	return project
}

//获取评分列表
func (this *Process) GetScoreList() []*ScoreSingle {
	stmt, err := db.GetDb().Prepare(`SELECT wid,quality,efficiency,manner,info FROM ` + config.Pm + `.pm_work_score`)
	defer stmt.Close()
	db.CheckErr(err)
	rows, err := stmt.Query()
	defer rows.Close()
	db.CheckErr(err)
	var scoreList []*ScoreSingle
	for rows.Next() {
		single := &ScoreSingle{}
		rows.Scan(&single.Wid, &single.Quality, &single.Efficiency, &single.Manner, &single.Info)
		scoreList = append(scoreList, single)
	}
	return scoreList
}

//进度总览
func (this *Process) View(BeginDate, EndDate string, modeStatus, linkStatus []uint32) bool {
	//项目
	project := this.GetProject()
	var modeStatusSQL string
	if len(modeStatus) > 0 {
		modeStatusSQL = `AND status in (` + common.Uint32ArrayJoin(modeStatus, `,`) + `)`
	} else {
		modeStatusSQL = ``
	}
	log.Println(modeStatusSQL, ":[modeStatusSQL]")
	var linkStatusSQL string
	if len(linkStatus) > 0 {
		linkStatusSQL = `AND t_l.status in (` + common.Uint32ArrayJoin(linkStatus, `,`) + `)`
	} else {
		linkStatusSQL = ``
	}
	log.Println(linkStatusSQL, ":[linkStatusSQL]")
	//sql
	stmt, err := db.GetDb().Prepare(`SELECT
		t5.*,t_s.wid AS swid,t_s.quality,t_s.efficiency,t_s.manner,t_s.info
	FROM
		(
			SELECT
				t3.*, t_w.wid,t_w.date,t_w.status,t_w.tips,t_w.min_num,t_w.max_num,t_w.tag
			FROM
				(
					SELECT
						t_m.*,t_l.lid,t_l.NAME AS lname,t_l.uid AS luid,t_l.color AS lcolor,t_l.status AS lstatus,t_l.sort AS lsort,t_l.parent_lid AS lparent_lid
					FROM
						(
							SELECT
								mid,vid,NAME AS mname,color AS mcolor,did AS mdid,status AS mstatus,sort AS msort
							FROM ` + config.Pm + `.pm_mode WHERE
								is_del=0 AND pid=?
								` + modeStatusSQL + `
						) AS t_m
					LEFT JOIN ` + config.Pm + `.pm_link AS t_l ON t_m.mid = t_l.mid AND t_l.is_del=0 
					` + linkStatusSQL + `
					ORDER BY t_m.msort,t_l.sort
				) AS t3
			LEFT JOIN ` + config.Pm + `.pm_work AS t_w ON t3.lid = t_w.lid 
			AND date >= ? AND date <= ?
		) AS t5
	LEFT JOIN ` + config.Pm + `.pm_work_score AS t_s ON t5.wid = t_s.wid`)
	//
	defer stmt.Close()
	db.CheckErr(err)
	rows, err := stmt.Query(this.owner.GetPid(), BeginDate, EndDate)
	defer rows.Close()
	db.CheckErr(err)
	//
	var modeList []*ModeSingle
	var linkList []*LinkSingle
	var workList []*WorkSingle
	var scoreList []*ScoreSingle
	midMap := make(map[uint64]uint64)
	lidMap := make(map[uint64]uint64)
	widMap := make(map[uint64]uint64)
	for rows.Next() {
		modeSingle := &ModeSingle{}
		linkSingle := &LinkSingle{}
		workSingle := &WorkSingle{}
		scoreSingle := &ScoreSingle{}
		rows.Scan(&modeSingle.Mid, &modeSingle.Vid, &modeSingle.Name, &modeSingle.Color, &modeSingle.Did, &modeSingle.Status, &modeSingle.Sort, &linkSingle.Lid, &linkSingle.Name, &linkSingle.Uid, &linkSingle.Color, &linkSingle.Status, &linkSingle.Sort, &linkSingle.ParentLid, &workSingle.Wid, &workSingle.Date, &workSingle.Status, &workSingle.Tips, &workSingle.MinNum, &workSingle.MaxNum, &workSingle.Tag, &scoreSingle.Wid, &scoreSingle.Quality, &scoreSingle.Efficiency, &scoreSingle.Manner, &scoreSingle.Info)
		//
		linkSingle.Mid = modeSingle.Mid
		workSingle.Lid = linkSingle.Lid
		//
		if _, ok := midMap[modeSingle.Mid]; !ok {
			midMap[modeSingle.Mid] = modeSingle.Mid
			modeList = append(modeList, modeSingle)
		}
		if linkSingle.Lid > 0 {
			if _, ok := lidMap[linkSingle.Lid]; !ok {
				lidMap[linkSingle.Lid] = linkSingle.Lid
				linkList = append(linkList, linkSingle)
			}
		}
		if workSingle.Wid > 0 {
			if _, ok := widMap[workSingle.Wid]; !ok {
				widMap[workSingle.Wid] = workSingle.Wid
				workSingle.FileList = this.owner.Upload().GetFileList(FILE_JOIN_KIND_WORK, workSingle.Wid)
				workList = append(workList, workSingle)
			}
		}
		if scoreSingle.Wid > 0 {
			scoreList = append(scoreList, scoreSingle)
		}
	}
	//#L2C
	data := &L2C_ProcessView{
		ModeList:    modeList,
		LinkList:    linkList,
		WorkList:    workList,
		ScoreList:   scoreList,
		Project:     project,
		VersionList: this.owner.Version().VersionList(),
	}
	this.owner.SendTo(L2C_PROCESS_VIEW, data)
	return true
}

/* backup
func (this *Process) View(BeginDate, EndDate string, modeStatus, linkStatus []uint32) bool {
	//环节
	linkList := this.GetLinkList()
	//工作
	workList := this.GetWorkList(BeginDate, EndDate)
	//模块
	modeList := this.GetModeList()
	//评分
	scoreList := this.GetScoreList()
	//项目
	project := this.GetProject()
	data := &L2C_ProcessView{
		ModeList:    modeList,
		LinkList:    linkList,
		WorkList:    workList,
		ScoreList:   scoreList,
		Project:     project,
		VersionList: this.owner.Version().VersionList(),
	}
	this.owner.SendTo(L2C_PROCESS_VIEW, data)
	return true
} */
