package main

import (
	"strings"
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
	data := &L2C_TPLModeView{
		Modes: this.owner.Template().GetModeList(this.owner.Uid),
	}
	this.owner.SendTo(L2C_TPL_MODE_VIEW, data)
	return true
}

func (this *Template) TemplateModeAdd(param *C2L_TPLModeAdd) bool {
	modes := this.owner.Template().GetModeList(this.owner.Uid)
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

func (this *Template) TemplateModeEditName(param *C2L_TPLModeEditName) bool {
	stmt, err := db.GetDb().Prepare(`UPDATE ` + config.Pm + `.pm_template_mode SET name = ? WHERE tmid = ?`)
	defer stmt.Close()
	db.CheckErr(err)
	_, err = stmt.Exec(param.Name, param.Tmid)
	db.CheckErr(err)
	data := &L2C_TPLModeEditName{
		Tmid: param.Tmid,
		Name: param.Name,
	}
	this.owner.SendTo(L2C_TPL_MODE_EDIT_NAME, data)
	return true
}

func (this *Template) TemplateModeDelete(param *C2L_TPLModeDelete) bool {
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
	data := &L2C_TPLModeDelete{
		Tmid: param.Tmid,
	}
	this.owner.SendTo(L2C_TPL_MODE_DELETE, data)
	return true
}

func (this *Template) TemplateLinkAdd(param *C2L_TPLLinkAdd) bool {
	links := this.owner.Template().GetLinkList(param.Tmid)
	if len(links) >= template_manager.LinkMax {
		return false
	}
	//插入一个模板-模块
	stmt, err := db.GetDb().Prepare(`INSERT INTO ` + config.Pm + `.pm_template_link (tmid,name,did,add_uid,create_time) VALUES (?,?,?,?,?)`)
	defer stmt.Close()
	db.CheckErr(err)
	res, err := stmt.Exec(param.Tmid, param.Name, param.Did, this.owner.Uid, time.Now().Unix())
	db.CheckErr(err)
	newTlid, err := res.LastInsertId()
	db.CheckErr(err)
	//获取旧的功能link_sort
	stmt, err = db.GetDb().Prepare(`SELECT link_sort FROM ` + config.Pm + `.pm_template_mode WHERE tmid = ?`)
	defer stmt.Close()
	db.CheckErr(err)
	var linkSortStr string
	stmt.QueryRow(param.Tmid).Scan(&linkSortStr)
	//更新到modeSort
	stmt, err = db.GetDb().Prepare(`UPDATE ` + config.Pm + `.pm_template_mode SET link_sort = ? WHERE tmid = ?`)
	db.CheckErr(err)
	_, err = stmt.Exec(common.SortStringUtil_push_int64(linkSortStr, newTlid), param.Tmid)
	db.CheckErr(err)
	//
	data := &L2C_TPLLinkAdd{
		Tlid: uint64(newTlid),
		Tmid: param.Tmid,
		Did:  param.Did,
		Name: param.Name,
	}
	this.owner.SendTo(L2C_TPL_LINK_ADD, data)
	return true
}

func (this *Template) TemplateLinkEditName(param *C2L_TPLLinkEditName) bool {
	stmt, err := db.GetDb().Prepare(`UPDATE ` + config.Pm + `.pm_template_link SET name = ? WHERE tlid = ?`)
	defer stmt.Close()
	db.CheckErr(err)
	_, err = stmt.Exec(param.Name, param.Tlid)
	db.CheckErr(err)
	data := &L2C_TPLLinkEditName{
		Tlid: param.Tlid,
		Name: param.Name,
	}
	this.owner.SendTo(L2C_TPL_LINK_EDIT_NAME, data)
	return true
}

func (this *Template) TemplateLinkEditDid(param *C2L_TPLLinkEditDid) bool {
	stmt, err := db.GetDb().Prepare(`UPDATE ` + config.Pm + `.pm_template_link SET did = ? WHERE tlid = ?`)
	defer stmt.Close()
	db.CheckErr(err)
	_, err = stmt.Exec(param.Did, param.Tlid)
	db.CheckErr(err)
	data := &L2C_TPLLinkEditDid{
		Tlid: param.Tlid,
		Did:  param.Did,
	}
	this.owner.SendTo(L2C_TPL_LINK_EDIT_DID, data)
	return true
}

func (this *Template) TemplateLinkEditSort(param *C2L_TPLLinkEditSort) bool {
	//
	Tmid := this.owner.Template().GetTmidByTlid(param.Tlid)
	//获取旧的功能link_sort
	stmt, err := db.GetDb().Prepare(`SELECT link_sort FROM ` + config.Pm + `.pm_template_mode WHERE tmid = ?`)
	defer stmt.Close()
	db.CheckErr(err)
	var linkSort string
	stmt.QueryRow(Tmid).Scan(&linkSort)
	//更新到modeSort
	stmt, err = db.GetDb().Prepare(`UPDATE ` + config.Pm + `.pm_template_mode SET link_sort = ? WHERE tmid = ?`)
	db.CheckErr(err)
	if param.Kind == 1 {
		linkSort = common.SortStringUtil_sortUp_uint64(linkSort, param.Tlid)
	} else {
		linkSort = common.SortStringUtil_sortDown_uint64(linkSort, param.Tlid)
	}
	_, err = stmt.Exec(linkSort, Tmid)
	db.CheckErr(err)
	//
	data := &L2C_TPLLinkEditSort{
		Tmid:     Tmid,
		LinkSort: strings.Split(linkSort, ","),
	}
	this.owner.SendTo(L2C_TPL_LINK_EDIT_SORT, data)
	return true
}

func (this *Template) TemplateLinkDelete(param *C2L_TPLLinkDelete) bool {
	stmt, err := db.GetDb().Prepare(`UPDATE ` + config.Pm + `.pm_template_link SET is_del = 1 WHERE tlid = ?`)
	defer stmt.Close()
	db.CheckErr(err)
	_, err = stmt.Exec(param.Tlid)
	db.CheckErr(err)
	//
	Tmid := this.owner.Template().GetTmidByTlid(param.Tlid)
	//获取旧的功能link_sort
	stmt, err = db.GetDb().Prepare(`SELECT link_sort FROM ` + config.Pm + `.pm_template_mode WHERE tmid = ?`)
	defer stmt.Close()
	db.CheckErr(err)
	var linkSort string
	stmt.QueryRow(Tmid).Scan(&linkSort)
	//更新到modeSort
	stmt, err = db.GetDb().Prepare(`UPDATE ` + config.Pm + `.pm_template_mode SET link_sort = ? WHERE tmid = ?`)
	db.CheckErr(err)
	_, err = stmt.Exec(common.SortStringUtil_delete_uint64(linkSort, param.Tlid), Tmid)
	db.CheckErr(err)
	//
	data := &L2C_TPLLinkDelete{
		Tlid: param.Tlid,
	}
	this.owner.SendTo(L2C_TPL_LINK_DELETE, data)
	return true
}

//# 功能函数
func (this *Template) GetTmidByTlid(Tlid uint64) uint64 {
	//获取旧的功能link_sort
	stmt, err := db.GetDb().Prepare(`SELECT tmid FROM ` + config.Pm + `.pm_template_link WHERE tlid = ?`)
	defer stmt.Close()
	db.CheckErr(err)
	var Tmid uint64
	stmt.QueryRow(Tlid).Scan(&Tmid)
	return Tmid
}

//获取功能列表
func (this *Template) GetModeList(uid uint64) []*TPLModeSingle {
	stmt, err := db.GetDb().Prepare(`SELECT tmid,name,link_sort FROM ` + config.Pm + `.pm_template_mode WHERE add_uid=? and is_del=0`)
	defer stmt.Close()
	db.CheckErr(err)
	rows, err := stmt.Query(uid)
	defer rows.Close()
	db.CheckErr(err)
	var modeList []*TPLModeSingle
	for rows.Next() {
		var linkSort string
		single := &TPLModeSingle{}
		rows.Scan(&single.Tmid, &single.Name, &linkSort)
		modeList = append(modeList, single)
		single.LinkSort = strings.Split(linkSort, ",")
		single.Links = this.GetLinkList(single.Tmid)
	}
	return modeList
}

//获取流程列表
func (this *Template) GetLinkList(tmid uint64) []*TPLLinkSingle {
	stmt, err := db.GetDb().Prepare(`SELECT tlid,tmid,name,did FROM ` + config.Pm + `.pm_template_link WHERE tmid=? and is_del=0`)
	defer stmt.Close()
	db.CheckErr(err)
	rows, err := stmt.Query(tmid)
	defer rows.Close()
	db.CheckErr(err)
	var modeList []*TPLLinkSingle
	for rows.Next() {
		single := &TPLLinkSingle{}
		rows.Scan(&single.Tlid, &single.Tmid, &single.Name, &single.Did)
		modeList = append(modeList, single)
	}
	return modeList
}

//获取流程列表 TODO:结果并没有根据 sortStr排序 ,需要修改
func (this *Template) GetLinkListBySort(tmid uint64, sortStr string) []*TPLLinkSingle {
	stmt, err := db.GetDb().Prepare(`SELECT tlid,tmid,name,did FROM ` + config.Pm + `.pm_template_link WHERE tlid in (?) and is_del=0`)
	defer stmt.Close()
	db.CheckErr(err)
	rows, err := stmt.Query(sortStr)
	db.CheckErr(err)
	defer rows.Close()
	var modeList []*TPLLinkSingle
	for rows.Next() {
		single := &TPLLinkSingle{}
		rows.Scan(&single.Tlid, &single.Tmid, &single.Name, &single.Did)
		modeList = append(modeList, single)
	}
	return modeList
}

//获取功能 通过 功能模板id
func (this *Template) GetTplModeByTmid(tmid uint64) *TPLModeSingle {
	stmt, err := db.GetDb().Prepare(`SELECT tmid,name,link_sort FROM ` + config.Pm + `.pm_template_mode WHERE tmid=? and is_del=0`)
	defer stmt.Close()
	db.CheckErr(err)
	var mode = &TPLModeSingle{}
	var linkSortStr string
	stmt.QueryRow(tmid).Scan(&mode.Tmid, &mode.Name, &linkSortStr)
	mode.LinkSort = strings.Split(linkSortStr, ",")
	db.CheckErr(err)
	return mode
}

//获取流程 通过 模板流程id
func (this *Template) GetTplLinkByTlid_string(tlid string) *TPLLinkSingle {
	stmt, err := db.GetDb().Prepare(`SELECT tlid,tmid,name,did FROM ` + config.Pm + `.pm_template_link WHERE tlid=? and is_del=0`)
	defer stmt.Close()
	db.CheckErr(err)
	var link = &TPLLinkSingle{}
	stmt.QueryRow(tlid).Scan(&link.Tlid, &link.Tmid, &link.Name, &link.Did)
	db.CheckErr(err)
	return link
}

func (this *Template) Get() {

}
