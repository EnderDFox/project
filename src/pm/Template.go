package main

import (
	"time"
)

type Template struct {
	owner *User
}

func NewTemplate(user *User) *Template {
	instance := &Template{}
	instance.owner = user
	return instance
}

func (this *Template) TemplateModeView() bool {
	data := &L2C_TplModeView{
		Modes: this.GetModeList(this.owner.Uid),
	}
	this.owner.SendTo(L2C_TPL_MODE_VIEW, data)
	return true
}

func (this *Template) TemplateModeAdd(param *C2L_TplModeAdd) bool {
	modes := this.GetModeList(this.owner.Uid)
	if len(modes) >= template_manager.ModeMax {
		return false
	}
	//插入一个模板-模块
	stmt, err := db.GetDb().Prepare(`INSERT INTO ` + config.Pm + `.pm_template_mode (name,add_uid,create_time) VALUES (?,?,?)`)
	defer stmt.Close()
	db.CheckErr(err)
	res, err := stmt.Exec(param.Name, this.owner.Uid, time.Now().Unix())
	db.CheckErr(err)
	newMid, err := res.LastInsertId()
	db.CheckErr(err)
	data := &L2C_TplModeAdd{
		Tmid: uint64(newMid),
		Name: param.Name,
	}
	this.owner.SendTo(L2C_TPL_MODE_ADD, data)
	return true
}

func (this *Template) TemplateModeEditName(param *C2L_TplModeEditName) bool {
	stmt, err := db.GetDb().Prepare(`UPDATE ` + config.Pm + `.pm_template_mode SET name = ? WHERE tmid = ?`)
	defer stmt.Close()
	db.CheckErr(err)
	_, err = stmt.Exec(param.Name, param.Tmid)
	db.CheckErr(err)
	data := &L2C_TplModeEditName{
		Tmid: param.Tmid,
		Name: param.Name,
	}
	this.owner.SendTo(L2C_TPL_MODE_EDIT_NAME, data)
	return true
}

func (this *Template) TemplateModeDelete(param *C2L_TplModeDelete) bool {
	stmt, err := db.GetDb().Prepare(`UPDATE ` + config.Pm + `.pm_template_mode SET is_del = 1 WHERE tmid = ?`)
	defer stmt.Close()
	db.CheckErr(err)
	_, err = stmt.Exec(param.Tmid)
	//res, err := stmt.Exec(param.Tmid)
	db.CheckErr(err)
	//num, err := res.RowsAffected()
	//db.CheckErr(err)
	//if num == 0 {
	//	return false
	//}
	data := &L2C_TplModeDelete{
		Tmid: param.Tmid,
	}
	this.owner.SendTo(L2C_TPL_MODE_DELETE, data)
	return true
}

func (this *Template) TemplateLinkAdd(param *C2L_TplLinkAdd) bool {
	links := this.GetLinkList(param.Tmid)
	if len(links) >= template_manager.LinkMax {
		return false
	}
	//插入一个模板-模块
	stmt, err := db.GetDb().Prepare(`INSERT INTO ` + config.Pm + `.pm_template_link (tmid,name,did,add_uid,create_time,sort) VALUES (?,?,?,?,?,(
		(SELECT IFNULL(
			(SELECT ms FROM(SELECT max(sort)+1 AS ms FROM ` + config.Pm + `.pm_template_link WHERE tmid=?) m)
		,1))
		))`)
	defer stmt.Close()
	db.CheckErr(err)
	res, err := stmt.Exec(param.Tmid, param.Name, param.Did, this.owner.Uid, time.Now().Unix(), param.Tmid)
	db.CheckErr(err)
	newTlid, err := res.LastInsertId()
	db.CheckErr(err)
	//
	data := &L2C_TplLinkAdd{
		Tlid: uint64(newTlid),
		Tmid: param.Tmid,
		Did:  param.Did,
		Name: param.Name,
	}
	this.owner.SendTo(L2C_TPL_LINK_ADD, data)
	return true
}

func (this *Template) TemplateLinkEditName(param *C2L_TplLinkEditName) bool {
	stmt, err := db.GetDb().Prepare(`UPDATE ` + config.Pm + `.pm_template_link SET name = ? WHERE tlid = ?`)
	defer stmt.Close()
	db.CheckErr(err)
	_, err = stmt.Exec(param.Name, param.Tlid)
	db.CheckErr(err)
	data := &L2C_TplLinkEditName{
		Tlid: param.Tlid,
		Name: param.Name,
	}
	this.owner.SendTo(L2C_TPL_LINK_EDIT_NAME, data)
	return true
}

func (this *Template) TemplateLinkEditDid(param *C2L_TplLinkEditDid) bool {
	stmt, err := db.GetDb().Prepare(`UPDATE ` + config.Pm + `.pm_template_link SET did = ? WHERE tlid = ?`)
	defer stmt.Close()
	db.CheckErr(err)
	_, err = stmt.Exec(param.Did, param.Tlid)
	db.CheckErr(err)
	data := &L2C_TplLinkEditDid{
		Tlid: param.Tlid,
		Did:  param.Did,
	}
	this.owner.SendTo(L2C_TPL_LINK_EDIT_DID, data)
	return true
}

func (this *Template) TemplateLinkEditSort(tmid uint64, tlid1 uint64, tlid2 uint64) bool {
	db.SwapSort(`pm_template_link`, `tlid`, tlid1, tlid2)
	//
	data := &L2C_TplLinkEditSort{
		Tmid:  tmid,
		Tlid1: tlid1,
		Tlid2: tlid2,
	}
	this.owner.SendTo(L2C_TPL_LINK_EDIT_SORT, data)
	return true
}

func (this *Template) TemplateLinkDelete(param *C2L_TplLinkDelete) bool {
	stmt, err := db.GetDb().Prepare(`UPDATE ` + config.Pm + `.pm_template_link SET is_del = 1 WHERE tlid = ?`)
	defer stmt.Close()
	db.CheckErr(err)
	_, err = stmt.Exec(param.Tlid)
	db.CheckErr(err)
	//比当前大的sort-1 没必要改,不影响排序的
	//
	data := &L2C_TplLinkDelete{
		Tlid: param.Tlid,
	}
	this.owner.SendTo(L2C_TPL_LINK_DELETE, data)
	return true
}

//# 功能函数
func (this *Template) GetTmidByTlid(Tlid uint64) uint64 {
	stmt, err := db.GetDb().Prepare(`SELECT tmid FROM ` + config.Pm + `.pm_template_link WHERE tlid = ?`)
	defer stmt.Close()
	db.CheckErr(err)
	var Tmid uint64
	stmt.QueryRow(Tlid).Scan(&Tmid)
	return Tmid
}

//获取功能列表
func (this *Template) GetModeList(uid uint64) []*TplModeSingle {
	stmt, err := db.GetDb().Prepare(`SELECT tmid,name FROM ` + config.Pm + `.pm_template_mode WHERE add_uid=? and is_del=0`)
	defer stmt.Close()
	db.CheckErr(err)
	rows, err := stmt.Query(uid)
	defer rows.Close()
	db.CheckErr(err)
	var modeList []*TplModeSingle
	for rows.Next() {
		single := &TplModeSingle{}
		rows.Scan(&single.Tmid, &single.Name)
		modeList = append(modeList, single)
		single.Links = this.GetLinkList(single.Tmid)
	}
	return modeList
}

//获取流程列表
func (this *Template) GetLinkList(tmid uint64) []*TplLinkSingle {
	stmt, err := db.GetDb().Prepare(`SELECT tlid,tmid,name,did FROM ` + config.Pm + `.pm_template_link WHERE tmid=? and is_del=0 ORDER BY sort`)
	defer stmt.Close()
	db.CheckErr(err)
	rows, err := stmt.Query(tmid)
	defer rows.Close()
	db.CheckErr(err)
	var modeList []*TplLinkSingle
	for rows.Next() {
		single := &TplLinkSingle{}
		rows.Scan(&single.Tlid, &single.Tmid, &single.Name, &single.Did)
		modeList = append(modeList, single)
	}
	return modeList
}

//获取功能模板, 通过 功能模板id
func (this *Template) GetTplModeByTmid(tmid uint64) *TplModeSingle {
	stmt, err := db.GetDb().Prepare(`SELECT tmid,name FROM ` + config.Pm + `.pm_template_mode WHERE tmid=? and is_del=0`)
	defer stmt.Close()
	db.CheckErr(err)
	var mode = &TplModeSingle{}
	stmt.QueryRow(tmid).Scan(&mode.Tmid, &mode.Name)
	db.CheckErr(err)
	return mode
}
