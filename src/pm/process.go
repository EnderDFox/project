package main

import (
	"log"
	"strconv"
	"strings"
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
func (this *Process) ScoreEdit(wid, quality, efficiency, manner uint64, info string) bool {
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
	this.owner.SendToAll(L2C_PROCESS_SCORE_EDIT, scoreSingle)
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
func (this *Process) ModeMove(swap []uint64, dir string) bool {
	stmt, err := db.GetDb().Prepare(`SELECT pid,name,mode_sort FROM ` + config.Pm + `.pm_project WHERE pid = ?`)
	defer stmt.Close()
	db.CheckErr(err)
	projectSingle := &ProjectSingle{}
	var modeSort string
	stmt.QueryRow(COMMON_PID).Scan(&projectSingle.Pid, &projectSingle.Name, &modeSort)
	sortMap := make(map[string]int)
	for _, v := range swap {
		sortMap[strconv.Itoa(int(v))] = 0
	}
	sortList := strings.Split(modeSort, ",")
	for k, v := range sortList {
		if _, ok := sortMap[v]; !ok {
			continue
		}
		sortMap[v] = k
	}
	//开始交换
	for k, v := range swap {
		s := ((k - 1) ^ (k-1)>>31) - (k-1)>>31
		sortList[sortMap[strconv.Itoa(int(v))]] = strconv.Itoa(int(swap[s]))
	}
	//更新到主表
	stmt, err = db.GetDb().Prepare(`UPDATE ` + config.Pm + `.pm_project SET mode_sort = ? WHERE pid = ?`)
	db.CheckErr(err)
	projectSingle.ModeSort = sortList
	res, err := stmt.Exec(strings.Join(sortList, ","), COMMON_PID)
	db.CheckErr(err)
	res.RowsAffected()
	data := &L2C_ProcessModeMove{
		Swap:          swap,
		Dir:           dir,
		ProjectSingle: projectSingle,
	}
	this.owner.SendToAll(L2C_PROCESS_MODE_MOVE, data)
	return true
}

//颜色
func (this *Process) LinklColor(lid, color uint64) bool {
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
	//查询
	stmt, err := db.GetDb().Prepare(`SELECT mid,vid,name,link_sort,did FROM ` + config.Pm + `.pm_mode WHERE mid = ?`)
	defer stmt.Close()
	db.CheckErr(err)
	var sortStr string
	modeSingle := &ModeSingle{}
	stmt.QueryRow(mid).Scan(&modeSingle.Mid, &modeSingle.Vid, &modeSingle.Name, &sortStr, &modeSingle.Did)
	if modeSingle.Mid == 0 {
		return false
	}
	modeSingle.Color = color
	modeSingle.LinkSort = strings.Split(sortStr, ",")
	//更新
	stmt, err = db.GetDb().Prepare(`UPDATE ` + config.Pm + `.pm_mode SET color = ? WHERE mid = ?`)
	db.CheckErr(err)
	stmt.Exec(color, mid)
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
	//更新项目
	stmt, err = db.GetDb().Prepare(`SELECT pid,name,mode_sort FROM ` + config.Pm + `.pm_project WHERE pid = ?`)
	db.CheckErr(err)
	projectSingle := &ProjectSingle{}
	var sortStr string
	stmt.QueryRow(COMMON_PID).Scan(&projectSingle.Pid, &projectSingle.Name, &sortStr)
	for _, v := range strings.Split(sortStr, ",") {
		if v == strconv.Itoa(int(mid)) {
			continue
		}
		projectSingle.ModeSort = append(projectSingle.ModeSort, v)
	}
	//更新到
	stmt, err = db.GetDb().Prepare(`UPDATE ` + config.Pm + `.pm_project SET mode_sort = ? WHERE pid = ?`)
	db.CheckErr(err)
	_, err = stmt.Exec(strings.Join(projectSingle.ModeSort, ","), COMMON_PID)
	db.CheckErr(err)
	data := &L2C_ProcessModeDelete{
		Mid:           mid,
		ProjectSingle: projectSingle,
	}
	this.owner.SendToAll(L2C_PROCESS_MODE_DELETE, data)
	return true
}

//插入一个空流程
func (this *Process) LinkAddOne(newMid uint64) *LinkSingle {
	stmt, err := db.GetDb().Prepare(`INSERT INTO ` + config.Pm + `.pm_link (mid,uid,add_uid,create_time) VALUES (?,?,?,?)`)
	res, err := stmt.Exec(newMid, this.owner.GetUid(), this.owner.GetUid(), time.Now().Unix())
	db.CheckErr(err)
	lid, err := res.LastInsertId()
	db.CheckErr(err)
	//更新到modeSort
	stmt, err = db.GetDb().Prepare(`UPDATE ` + config.Pm + `.pm_mode SET link_sort = ? WHERE mid = ?`)
	db.CheckErr(err)
	_, err = stmt.Exec(lid, newMid)
	db.CheckErr(err)
	//
	linkSingle := &LinkSingle{}
	linkSingle.Lid = uint64(lid)
	linkSingle.Mid = uint64(newMid)
	linkSingle.Uid = this.owner.GetUid()
	linkSingle.Name = ""
	return linkSingle
}

//插入
func (this *Process) ModeAdd(mid uint64, name string, vid uint64, did uint64, tmid uint64) bool {
	//插入一个模块
	stmt, err := db.GetDb().Prepare(`INSERT INTO ` + config.Pm + `.pm_mode (pid,name,add_uid,vid,did,create_time) VALUES (?,?,?,?,?,?)`)
	defer stmt.Close()
	db.CheckErr(err)
	pid := COMMON_PID
	res, err := stmt.Exec(pid, name, this.owner.GetUid(), vid, did, time.Now().Unix())
	db.CheckErr(err)
	newMid, err := res.LastInsertId()
	db.CheckErr(err)
	var link_sort_link []string
	var linkList []*LinkSingle
	if tmid <= 0 {
		//没用模板  插入一个环节
		linkSingle := this.LinkAddOne(uint64(newMid))
		link_sort_link = append(link_sort_link, strconv.Itoa(int(linkSingle.Lid)))
		linkList = append(linkList, linkSingle)
		//
	} else {
		//按照模板中插入环节
		var tplMode = this.owner.Template().GetTplModeByTmid(tmid)
		if len(tplMode.LinkSort) == 0 {
			//模板里没有流程 插入一个空环节
			linkSingle := this.LinkAddOne(uint64(newMid))
			link_sort_link = append(link_sort_link, strconv.Itoa(int(linkSingle.Lid)))
			linkList = append(linkList, linkSingle)
		} else {
			didToUidMap := *timer.getDidToUidMap()
			for _, tlid := range tplMode.LinkSort {
				var tplLink = this.owner.Template().GetTplLinkByTlid_string(tlid)
				//stmt, err = db.GetDb().Prepare(`INSERT INTO ` + config.Pm + `.pm_link (mid,uid,add_uid,create_time,name) SELECT ?,?,?,?,name FROM pm.pm_template_link WHERE tlid = ?`)
				//res, err = stmt.Exec(newMid, this.owner.GetUid(), this.owner.GetUid(), time.Now().Unix(),tlid)
				stmt, err = db.GetDb().Prepare(`INSERT INTO ` + config.Pm + `.pm_link (mid,uid,add_uid,create_time,name) VALUES (?,?,?,?,?)`)
				//uid 要使用模板的did所对应的部门老大uid
				res, err = stmt.Exec(newMid, didToUidMap[tplLink.Did], this.owner.GetUid(), time.Now().Unix(), tplLink.Name)
				db.CheckErr(err)
				lid, err := res.LastInsertId()
				link_sort_link = append(link_sort_link, strconv.Itoa(int(lid)))
				db.CheckErr(err)
				//
				linkSingle := &LinkSingle{}
				linkSingle.Lid = uint64(lid)
				linkSingle.Mid = uint64(newMid)
				linkSingle.Uid = didToUidMap[tplLink.Did]
				linkSingle.Name = tplLink.Name
				linkList = append(linkList, linkSingle)
			}
			//更新到modeSort
			stmt, err = db.GetDb().Prepare(`UPDATE ` + config.Pm + `.pm_mode SET link_sort = ? WHERE mid = ?`)
			db.CheckErr(err)
			_, err = stmt.Exec(strings.Join(link_sort_link, ","), newMid)
			db.CheckErr(err)
		}
	}
	//查询项目
	project := this.GetProject()
	var newMdeSort []string
	for _, v := range project.ModeSort {
		newMdeSort = append(newMdeSort, v)
		if v == strconv.Itoa(int(mid)) {
			newMdeSort = append(newMdeSort, strconv.Itoa(int(newMid)))
		}
	}
	//更新到modeSort
	stmt, err = db.GetDb().Prepare(`UPDATE ` + config.Pm + `.pm_project SET mode_sort = ? WHERE pid = ?`)
	db.CheckErr(err)
	_, err = stmt.Exec(strings.Join(newMdeSort, ","), COMMON_PID)
	db.CheckErr(err)
	modeSingle := &ModeSingle{}
	modeSingle.Mid = uint64(newMid)
	modeSingle.Vid = vid
	modeSingle.Color = 0
	modeSingle.Name = name
	modeSingle.Did = 0
	//modeSingle.LinkSort = append(modeSingle.LinkSort, strconv.Itoa(int(lid)))
	modeSingle.LinkSort = link_sort_link
	//
	data := &L2C_ProcessModeAdd{
		Mid:        mid,
		ModeSingle: modeSingle,
		LinkList:   linkList,
	}
	this.owner.SendToAll(L2C_PROCESS_MODE_ADD, data)
	return true
}

//编辑
func (this *Process) ModeEdit(mid uint64, name string, vid uint64) bool {
	//查询
	stmt, err := db.GetDb().Prepare(`SELECT mid,link_sort,color,did FROM ` + config.Pm + `.pm_mode WHERE mid = ?`)
	defer stmt.Close()
	db.CheckErr(err)
	var sortStr string
	modeSingle := &ModeSingle{}
	stmt.QueryRow(mid).Scan(&modeSingle.Mid, &sortStr, &modeSingle.Color, &modeSingle.Did)
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
	modeSingle.LinkSort = strings.Split(sortStr, ",")
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
	stmt, err := db.GetDb().Prepare(`SELECT mid,vid,name,link_sort,color,did FROM ` + config.Pm + `.pm_mode WHERE mid in (SELECT mid FROM ` + config.Pm + `.pm_link WHERE lid = ?)`)
	defer stmt.Close()
	db.CheckErr(err)
	modeSingle := &ModeSingle{}
	var linkSort string
	stmt.QueryRow(lid).Scan(&modeSingle.Mid, &modeSingle.Vid, &modeSingle.Name, &linkSort, &modeSingle.Color, &modeSingle.Did)
	for _, v := range strings.Split(linkSort, ",") {
		if v == strconv.Itoa(int(lid)) {
			continue
		}
		modeSingle.LinkSort = append(modeSingle.LinkSort, v)
	}
	//更新到主表
	stmt, err = db.GetDb().Prepare(`UPDATE ` + config.Pm + `.pm_mode SET link_sort = ? WHERE mid = ?`)
	db.CheckErr(err)
	_, err = stmt.Exec(strings.Join(modeSingle.LinkSort, ","), modeSingle.Mid)
	db.CheckErr(err)
	//删除环节
	stmt, err = db.GetDb().Prepare(`DELETE FROM ` + config.Pm + `.pm_link WHERE lid = ?`)
	db.CheckErr(err)
	_, err = stmt.Exec(lid)
	db.CheckErr(err)
	//删除数据
	stmt, err = db.GetDb().Prepare(`DELETE FROM ` + config.Pm + `.pm_work WHERE lid = ?`)
	db.CheckErr(err)
	_, err = stmt.Exec(lid)
	db.CheckErr(err)
	data := &L2C_ProcessLinkDelete{
		Lid:        lid,
		ModeSingle: modeSingle,
	}
	this.owner.SendToAll(L2C_PROCESS_LINK_DELETE, data)
	return true
}

//插入
func (this *Process) GridAdd(lid uint64, name string) bool {
	stmt, err := db.GetDb().Prepare(`SELECT mid,vid,name,link_sort,color,did FROM ` + config.Pm + `.pm_mode WHERE mid in (SELECT mid FROM ` + config.Pm + `.pm_link WHERE lid = ?)`)
	defer stmt.Close()
	db.CheckErr(err)
	modeSingle := &ModeSingle{}
	var linkSort string
	stmt.QueryRow(lid).Scan(&modeSingle.Mid, &modeSingle.Vid, &modeSingle.Name, &linkSort, &modeSingle.Color, &modeSingle.Did)
	//插入新的行
	stmt, err = db.GetDb().Prepare(`INSERT INTO ` + config.Pm + `.pm_link (mid,uid,add_uid,name,create_time) VALUES (?,?,?,?,?)`)
	db.CheckErr(err)
	uid := this.owner.GetUid()
	addUid := this.owner.GetUid()
	res, err := stmt.Exec(modeSingle.Mid, uid, addUid, name, time.Now().Unix())
	db.CheckErr(err)
	newLid, err := res.LastInsertId()
	db.CheckErr(err)
	var sortList []string
	for _, v := range strings.Split(linkSort, ",") {
		sortList = append(sortList, v)
		if strconv.Itoa(int(lid)) == v {
			sortList = append(sortList, strconv.Itoa(int(newLid)))
		}
	}
	//更新到主表
	stmt, err = db.GetDb().Prepare(`UPDATE ` + config.Pm + `.pm_mode SET link_sort = ? WHERE mid = ?`)
	db.CheckErr(err)
	modeSingle.LinkSort = sortList
	res, err = stmt.Exec(strings.Join(sortList, ","), modeSingle.Mid)
	db.CheckErr(err)
	linkSingle := &LinkSingle{
		Lid:  uint64(newLid),
		Mid:  modeSingle.Mid,
		Uid:  uid,
		Name: name,
	}
	data := &L2C_ProcessGridAdd{
		Lid:        lid,
		LinkSingle: linkSingle,
		ModeSingle: modeSingle,
	}
	this.owner.SendToAll(L2C_PROCESS_GRID_ADD, data)
	return true
}

//环节交换
func (this *Process) GridSwap(swap []uint64, dir string) bool {
	stmt, err := db.GetDb().Prepare(`SELECT mid,vid,name,link_sort,color,did FROM ` + config.Pm + `.pm_mode WHERE mid in (SELECT mid FROM ` + config.Pm + `.pm_link WHERE lid = ?)`)
	defer stmt.Close()
	db.CheckErr(err)
	modeSingle := &ModeSingle{}
	var linkSort string
	stmt.QueryRow(swap[0]).Scan(&modeSingle.Mid, &modeSingle.Vid, &modeSingle.Name, &linkSort, &modeSingle.Color, &modeSingle.Did)
	sortMap := make(map[string]int)
	for _, v := range swap {
		sortMap[strconv.Itoa(int(v))] = 0
	}
	sortList := strings.Split(linkSort, ",")
	for k, v := range sortList {
		if _, ok := sortMap[v]; !ok {
			continue
		}
		sortMap[v] = k
	}
	//开始交换
	for k, v := range swap {
		s := ((k - 1) ^ (k-1)>>31) - (k-1)>>31
		sortList[sortMap[strconv.Itoa(int(v))]] = strconv.Itoa(int(swap[s]))
	}
	//更新到主表
	stmt, err = db.GetDb().Prepare(`UPDATE ` + config.Pm + `.pm_mode SET link_sort = ? WHERE mid = ?`)
	db.CheckErr(err)
	modeSingle.LinkSort = sortList
	res, err := stmt.Exec(strings.Join(sortList, ","), modeSingle.Mid)
	db.CheckErr(err)
	res.RowsAffected()
	data := &L2C_ProcessGridSwap{
		Swap:       swap,
		Dir:        dir,
		ModeSingle: modeSingle,
	}
	this.owner.SendToAll(L2C_PROCESS_GRID_SWAP, data)
	return true
}

//用户改变
func (this *Process) UserChange(lid, uid uint64) bool {
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
	this.owner.SendToAll(L2C_PROCESS_USER_CHANGE, data)
	return true
}

//状态改变
func (this *Process) GridChange(lid uint64, date string, status uint64) bool {
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
	this.owner.SendToAll(L2C_PROCESS_GRID_CHANGE, data)
	return true
}

//清理状态
func (this *Process) GridClear(lid uint64, date string) bool {
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
	data := &L2C_ProcessGridClear{
		Wid: wid,
	}
	this.owner.SendToAll(L2C_PROCESS_GRID_CLEAR, data)
	return true
}

//获取模块列表
func (this *Process) GetModeList() []*ModeSingle {
	stmt, err := db.GetDb().Prepare(`SELECT mid,vid,name,link_sort,color,did,status FROM ` + config.Pm + `.pm_mode`)
	defer stmt.Close()
	db.CheckErr(err)
	rows, err := stmt.Query()
	defer rows.Close()
	db.CheckErr(err)
	var modeList []*ModeSingle
	for rows.Next() {
		single := &ModeSingle{}
		var sortStr string
		rows.Scan(&single.Mid, &single.Vid, &single.Name, &sortStr, &single.Color, &single.Did, &single.Status)
		single.LinkSort = strings.Split(sortStr, ",")
		modeList = append(modeList, single)
	}
	return modeList
}

//获取环节列表
func (this *Process) GetLinkList() []*LinkSingle {
	stmt, err := db.GetDb().Prepare(`SELECT lid,mid,name,uid,color,status FROM ` + config.Pm + `.pm_link`)
	defer stmt.Close()
	db.CheckErr(err)
	rows, err := stmt.Query()
	defer rows.Close()
	db.CheckErr(err)
	var linkList []*LinkSingle
	for rows.Next() {
		single := &LinkSingle{}
		rows.Scan(&single.Lid, &single.Mid, &single.Name, &single.Uid, &single.Color, &single.Status)
		linkList = append(linkList, single)
	}
	return linkList
}

//获取工作列表
func (this *Process) GetWorkList(BeginDate, EndDate string) []*WorkSingle {
	stmt, err := db.GetDb().Prepare(`SELECT wid,lid,date,status,tips,min_num,max_num,tag FROM ` + config.Pm + `.pm_work WHERE date >= ? AND date <= ?`)
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
	stmt, err := db.GetDb().Prepare(`SELECT pid,name,mode_sort FROM ` + config.Pm + `.pm_project WHERE pid = ?`)
	defer stmt.Close()
	db.CheckErr(err)
	row := stmt.QueryRow(COMMON_PID)
	project := &ProjectSingle{}
	var modeSort string
	row.Scan(&project.Pid, &project.Name, &modeSort)
	project.ModeSort = strings.Split(modeSort, ",")
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
func (this *Process) View(BeginDate, EndDate string) bool {
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
}
