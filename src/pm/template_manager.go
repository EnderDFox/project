package main

import (
	"encoding/json"
	"strconv"
	"strings"
	"time"

	"github.com/gorilla/websocket"
)

type TemplateManager struct {
	ModeMax int //mode 最大数量
	LinkMax int //link 最大数量
}

func NewTemplateManager() *TemplateManager {
	ob := &TemplateManager{}
	ob.ModeMax = 5
	ob.LinkMax = 50
	return ob
}

func (this *TemplateManager) RegisterFunction() {
	//功能
	command.Register(C2L_TPL_MODE_VIEW, &C2L_M_TPL_MODE_VIEW{})
	command.Register(C2L_TPL_MODE_ADD, &C2L_M_TPL_MODE_ADD{})
	command.Register(C2L_TPL_MODE_EDIT_NAME, &C2L_M_TPL_MODE_EDIT_NAME{})
	command.Register(C2L_TPL_MODE_DELETE, &C2L_M_TPL_MODE_DELETE{})
	//流程
	command.Register(C2L_TPL_LINK_ADD, &C2L_M_TPL_LINK_ADD{})
	command.Register(C2L_TPL_LINK_EDIT_NAME, &C2L_M_TPL_LINK_EDIT_NAME{})
	command.Register(C2L_TPL_LINK_EDIT_DID, &C2L_M_TPL_LINK_EDIT_DID{})
	command.Register(C2L_TPL_LINK_EDIT_SORT, &C2L_M_TPL_LINK_EDIT_SORT{})
	command.Register(C2L_TPL_LINK_DELETE, &C2L_M_TPL_LINK_DELETE{})
}

type L2C_TPLModeView struct {
	Modes []*TPLModeSingle
}

type C2L_TPLModeAdd struct {
	Name string
}
type L2C_TplModeAdd struct {
	Tmid uint64
	Name string
}

type C2L_TPLModeEditName struct {
	Tmid uint64
	Name string
}

type L2C_TPLModeEditName struct {
	Tmid uint64
	Name string
}

type C2L_TPLModeDelete struct {
	Tmid uint64
}
type L2C_TPLModeDelete struct {
	Tmid uint64
}

type C2L_TPLLinkAdd struct {
	Tmid uint64
	Name string
	Did  uint64
}

type L2C_TPLLinkAdd struct {
	Tlid uint64
	Tmid uint64
	Name string
	Did  uint64
}

type C2L_TPLLinkEditName struct {
	Tlid uint64
	Name string
}
type L2C_TPLLinkEditName struct {
	Tlid uint64
	Name string
}
type C2L_TPLLinkEditDid struct {
	Tlid uint64
	Did  uint64
}
type L2C_TPLLinkEditDid struct {
	Tlid uint64
	Did  uint64
}
type C2L_TPLLinkEditSort struct {
	Tlid uint64
	Kind uint8 //操作方式 1: 上移   0:下移动
}
type L2C_TPLLinkEditSort struct {
	Tmid     uint64
	LinkSort []string
}
type C2L_TPLLinkDelete struct {
	Tlid uint64
}
type L2C_TPLLinkDelete struct {
	Tlid uint64
}

type TPLModeSingle struct {
	Tmid     uint64
	Name     string
	LinkSort []string
	Links    []*TPLLinkSingle
}

type TPLLinkSingle struct {
	Tlid uint64
	Tmid uint64
	Name string
	Did  uint64
}

//获得模板
type C2L_M_TPL_MODE_VIEW struct{}

func (this *C2L_M_TPL_MODE_VIEW) execute(client *websocket.Conn, msg *Message) bool {
	//param := &C2L_TPLModeView{}
	//err := json.Unmarshal([]byte(msg.Param), param)
	//if err != nil {
	//	return false
	//}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	data := &L2C_TPLModeView{
		Modes: template_manager.GetModeList(user.Uid),
	}
	user.SendTo(L2C_TPL_MODE_VIEW, data)
	return true
}

//获取功能列表
func (this *TemplateManager) GetModeList(uid uint64) []*TPLModeSingle {
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
func (this *TemplateManager) GetLinkList(tmid uint64) []*TPLLinkSingle {
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
func (this *TemplateManager) GetLinkListBySort(tmid uint64, sortStr string) []*TPLLinkSingle {
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
func (this *TemplateManager) GetTplModeByTmid(tmid uint64) *TPLModeSingle {
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
func (this *TemplateManager) GetTplLinkByTlid_string(tlid string) *TPLLinkSingle {
	stmt, err := db.GetDb().Prepare(`SELECT tlid,tmid,name,did FROM ` + config.Pm + `.pm_template_link WHERE tlid=? and is_del=0`)
	defer stmt.Close()
	db.CheckErr(err)
	var link = &TPLLinkSingle{}
	stmt.QueryRow(tlid).Scan(&link.Tlid, &link.Tmid, &link.Name, &link.Did)
	db.CheckErr(err)
	return link
}

//新建 功能
type C2L_M_TPL_MODE_ADD struct{}

func (this *C2L_M_TPL_MODE_ADD) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_TPLModeAdd{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	modes := template_manager.GetModeList(user.Uid)
	if len(modes) >= template_manager.ModeMax {
		return false
	}
	//插入一个模板-模块
	stmt, err := db.GetDb().Prepare(`INSERT INTO ` + config.Pm + `.pm_template_mode (name,add_uid,create_time) VALUES (?,?,?)`)
	defer stmt.Close()
	db.CheckErr(err)
	res, err := stmt.Exec(param.Name, user.Uid, time.Now().Unix())
	db.CheckErr(err)
	newMid, err := res.LastInsertId()
	db.CheckErr(err)
	data := &L2C_TplModeAdd{
		Tmid: uint64(newMid),
		Name: param.Name,
	}
	user.SendTo(L2C_TPL_MODE_ADD, data)
	return true
}

//增加 流程
type C2L_M_TPL_LINK_ADD struct{}

func (this *C2L_M_TPL_LINK_ADD) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_TPLLinkAdd{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	links := template_manager.GetLinkList(param.Tmid)
	if len(links) >= template_manager.LinkMax {
		return false
	}
	//插入一个模板-模块
	stmt, err := db.GetDb().Prepare(`INSERT INTO ` + config.Pm + `.pm_template_link (tmid,name,did,add_uid,create_time) VALUES (?,?,?,?,?)`)
	defer stmt.Close()
	db.CheckErr(err)
	res, err := stmt.Exec(param.Tmid, param.Name, param.Did, user.Uid, time.Now().Unix())
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
	_, err = stmt.Exec(SortStringUtil_push_int64(linkSortStr, newTlid), param.Tmid)
	db.CheckErr(err)
	//
	data := &L2C_TPLLinkAdd{
		Tlid: uint64(newTlid),
		Tmid: param.Tmid,
		Did:  param.Did,
		Name: param.Name,
	}
	user.SendTo(L2C_TPL_LINK_ADD, data)
	return true
}

//===sort字段处理
//新增
func SortStringUtil_push_int64(sortStrOri string, val int64) string {
	return SortStringUtil_push(sortStrOri, strconv.Itoa(int(val)))
}
func SortStringUtil_push(sortStrOri string, newStr string) string {
	if sortStrOri == "" {
		return newStr
	} else {
		var sortList []string = strings.Split(sortStrOri, ",")
		sortList = append(sortList, newStr)
		return strings.Join(sortList, ",")
	}
}

//删除
func SortStringUtil_delete_uint64(sortStrOri string, val uint64) string {
	return SortStringUtil_delete(sortStrOri, strconv.Itoa(int(val)))
}
func SortStringUtil_delete(sortStrOri string, val string) string {
	var sortListOri []string = strings.Split(sortStrOri, ",")
	var index = StringArrayIndexOf(&sortListOri, &val)
	if index == -1 {
		return sortStrOri
	}
	var sortList []string = sortListOri[0:index]
	if index < len(sortListOri)-1 {
		sortList = append(sortList, sortListOri[index+1:]...)
	}
	return strings.Join(sortList, ",")
}

//排序 上移
func SortStringUtil_sortUp_uint64(sortStrOri string, val uint64) string {
	return SortStringUtil_sortUp(sortStrOri, strconv.Itoa(int(val)))
}
func SortStringUtil_sortUp(sortStrOri string, val string) string {
	var sortListOri []string = strings.Split(sortStrOri, ",")
	var sortList []string
	var index = StringArrayIndexOf(&sortListOri, &val)
	if index == -1 {
		return sortStrOri
	}
	if index == 0 {
		//是第一个 挪到最后去
		sortList = append(sortListOri[1:], val)
	} else {
		if index == 1 { //避免越界
			sortList = []string{val, sortListOri[0]}
		} else {
			sortList = append(sortListOri[0:index-1], val, sortListOri[index-1])
		}
		if index+1 < len(sortListOri) { //避免越界
			sortList = append(sortList, sortListOri[index+1:]...) //增加后续的
		}
	}
	return strings.Join(sortList, ",")
}

//排序 下移
func SortStringUtil_sortDown_uint64(sortStrOri string, val uint64) string {
	return SortStringUtil_sortDown(sortStrOri, strconv.Itoa(int(val)))
}
func SortStringUtil_sortDown(sortStrOri string, val string) string {
	var sortListOri []string = strings.Split(sortStrOri, ",")
	var sortList []string
	var index = StringArrayIndexOf(&sortListOri, &val)
	if index == -1 {
		return sortStrOri
	}
	if index == len(sortListOri)-1 {
		//是最后一个 挪到第一个去
		sortList = append([]string{val}, sortListOri[:len(sortListOri)-1]...)
	} else {
		sortList = append(sortListOri[0:index], sortListOri[index+1], val)
		if index+2 < len(sortListOri) { //避免越界
			sortList = append(sortList, sortListOri[index+2:]...)
		}
	}
	return strings.Join(sortList, ",")
}

func StringArrayIndexOf(arr *[]string, val *string) int {
	for i, v := range *arr {
		if *val == v {
			return i
		}
	}
	return -1
}

//===
//编辑mode名称
type C2L_M_TPL_MODE_EDIT_NAME struct{}

func (this *C2L_M_TPL_MODE_EDIT_NAME) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_TPLModeEditName{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	stmt, err := db.GetDb().Prepare(`UPDATE ` + config.Pm + `.pm_template_mode SET name = ? WHERE tmid = ?`)
	defer stmt.Close()
	db.CheckErr(err)
	_, err = stmt.Exec(param.Name, param.Tmid)
	db.CheckErr(err)
	data := &L2C_TPLModeEditName{
		Tmid: param.Tmid,
		Name: param.Name,
	}
	user.SendTo(L2C_TPL_MODE_EDIT_NAME, data)
	return true
}

//编辑link名称
type C2L_M_TPL_LINK_EDIT_NAME struct{}

func (this *C2L_M_TPL_LINK_EDIT_NAME) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_TPLLinkEditName{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	stmt, err := db.GetDb().Prepare(`UPDATE ` + config.Pm + `.pm_template_link SET name = ? WHERE tlid = ?`)
	defer stmt.Close()
	db.CheckErr(err)
	_, err = stmt.Exec(param.Name, param.Tlid)
	db.CheckErr(err)
	data := &L2C_TPLLinkEditName{
		Tlid: param.Tlid,
		Name: param.Name,
	}
	user.SendTo(L2C_TPL_LINK_EDIT_NAME, data)
	return true
}

//编辑link部门
type C2L_M_TPL_LINK_EDIT_DID struct{}

func (this *C2L_M_TPL_LINK_EDIT_DID) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_TPLLinkEditDid{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	stmt, err := db.GetDb().Prepare(`UPDATE ` + config.Pm + `.pm_template_link SET did = ? WHERE tlid = ?`)
	defer stmt.Close()
	db.CheckErr(err)
	_, err = stmt.Exec(param.Did, param.Tlid)
	db.CheckErr(err)
	data := &L2C_TPLLinkEditDid{
		Tlid: param.Tlid,
		Did:  param.Did,
	}
	user.SendTo(L2C_TPL_LINK_EDIT_DID, data)
	return true
}

//删除mode
type C2L_M_TPL_MODE_DELETE struct {
}

func (this *C2L_M_TPL_MODE_DELETE) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_TPLModeDelete{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
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
	user.SendTo(L2C_TPL_MODE_DELETE, data)
	return true
}

//编辑排序
type C2L_M_TPL_LINK_EDIT_SORT struct{}

func (this *C2L_M_TPL_LINK_EDIT_SORT) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_TPLLinkEditSort{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	//
	Tmid := GetTmidByTlid(param.Tlid)
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
		linkSort = SortStringUtil_sortUp_uint64(linkSort, param.Tlid)
	} else {
		linkSort = SortStringUtil_sortDown_uint64(linkSort, param.Tlid)
	}
	_, err = stmt.Exec(linkSort, Tmid)
	db.CheckErr(err)
	//
	data := &L2C_TPLLinkEditSort{
		Tmid:     Tmid,
		LinkSort: strings.Split(linkSort, ","),
	}
	user.SendTo(L2C_TPL_LINK_EDIT_SORT, data)
	return true
}

//删除link
type C2L_M_TPL_LINK_DELETE struct {
}

func (this *C2L_M_TPL_LINK_DELETE) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_TPLLinkDelete{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	stmt, err := db.GetDb().Prepare(`UPDATE ` + config.Pm + `.pm_template_link SET is_del = 1 WHERE tlid = ?`)
	defer stmt.Close()
	db.CheckErr(err)
	_, err = stmt.Exec(param.Tlid)
	db.CheckErr(err)
	//
	Tmid := GetTmidByTlid(param.Tlid)
	//获取旧的功能link_sort
	stmt, err = db.GetDb().Prepare(`SELECT link_sort FROM ` + config.Pm + `.pm_template_mode WHERE tmid = ?`)
	defer stmt.Close()
	db.CheckErr(err)
	var linkSort string
	stmt.QueryRow(Tmid).Scan(&linkSort)
	//更新到modeSort
	stmt, err = db.GetDb().Prepare(`UPDATE ` + config.Pm + `.pm_template_mode SET link_sort = ? WHERE tmid = ?`)
	db.CheckErr(err)
	_, err = stmt.Exec(SortStringUtil_delete_uint64(linkSort, param.Tlid), Tmid)
	db.CheckErr(err)
	//
	data := &L2C_TPLLinkDelete{
		Tlid: param.Tlid,
	}
	user.SendTo(L2C_TPL_LINK_DELETE, data)
	return true
}

func GetTmidByTlid(Tlid uint64) uint64 {
	//获取旧的功能link_sort
	stmt, err := db.GetDb().Prepare(`SELECT tmid FROM ` + config.Pm + `.pm_template_link WHERE tlid = ?`)
	defer stmt.Close()
	db.CheckErr(err)
	var Tmid uint64
	stmt.QueryRow(Tlid).Scan(&Tmid)
	return Tmid
}
