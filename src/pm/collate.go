package main

import (
	"strconv"
	"strings"
	"time"
)

type Collate struct {
	owner *User
}

func NewCollate(user *User) *Collate {
	instance := &Collate{}
	instance.owner = user
	return instance
}

//预览
func (this *Collate) GetStepList(BeginDate, EndDate string, lidMap map[uint64]uint64) []*WorkSingle {
	stmt, err := db.GetDb().Prepare(`SELECT wid,lid,date,status,min_num,max_num,tag,tips,inspect FROM ` + config.Pm + `.pm_work WHERE date >= ? AND date <= ?`)
	defer stmt.Close()
	db.CheckErr(err)
	rows, err := stmt.Query(BeginDate, EndDate)
	defer rows.Close()
	db.CheckErr(err)
	var workList []*WorkSingle
	for rows.Next() {
		single := &WorkSingle{}
		rows.Scan(&single.Wid, &single.Lid, &single.Date, &single.Status, &single.MinNum, &single.MaxNum, &single.Tag, &single.Tips, &single.Inspect)
		single.FileList = this.owner.Upload().GetFileList(FILE_JOIN_KIND_WORK, single.Wid)
		workList = append(workList, single)
		lidMap[single.Lid] = single.Lid
	}
	return workList
}

//环节 还有问题 parent link没有被拿出来
func (this *Collate) GetLinkList(lidMap, midMap map[uint64]uint64) []*LinkSingle {
	if len(lidMap) == 0 {
		return nil
	}
	var lidList []string
	for _, lid := range lidMap {
		lidList = append(lidList, strconv.Itoa(int(lid)))
	}
	parentLidMap := make(map[uint64]uint64)
	var linkList []*LinkSingle
	linkList = this.GetLinkList2(lidMap,midMap)
	//把parent_lid拿出来
	for _,link := range linkList{
		if(link.ParentLid>0){
			_, okP := parentLidMap[link.ParentLid]
			if(okP==false){
				_, okC := lidMap[link.ParentLid]
				if(okC==false){
					parentLidMap[link.ParentLid] = link.ParentLid
				}
			}
		} 
	}
	var parentLinkList []*LinkSingle
	parentLinkList = this.GetLinkList2(parentLidMap,midMap)
	for _,parentLink := range parentLinkList{
		linkList = append(linkList, parentLink)
	}
	return linkList
}

func (this *Collate) GetLinkList2(lidMap, midMap map[uint64]uint64) []*LinkSingle{
	if len(lidMap) == 0 {
		return nil
	}
	var linkList []*LinkSingle
	var lidList []string
	for _, lid := range lidMap {
		lidList = append(lidList, strconv.Itoa(int(lid)))
	}
	stmt, err := db.GetDb().Prepare(`SELECT lid,mid,name,uid,sort,parent_lid FROM ` + config.Pm + `.pm_link WHERE lid IN (` + strings.Join(lidList, ",") + `)`)
	defer stmt.Close()
	db.CheckErr(err)
	rows, err := stmt.Query()
	defer rows.Close()
	db.CheckErr(err)
	for rows.Next() {
		single := &LinkSingle{}
		rows.Scan(&single.Lid, &single.Mid, &single.Name, &single.Uid, &single.Sort, &single.ParentLid)
		linkList = append(linkList, single)
		midMap[single.Mid] = single.Mid
	}
	return linkList
}

//模块
func (this *Collate) GetModeList(midMap map[uint64]uint64) []*ModeSingle {
	if len(midMap) == 0 {
		return nil
	}
	var midList []string
	for _, mid := range midMap {
		midList = append(midList, strconv.Itoa(int(mid)))
	}
	stmt, err := db.GetDb().Prepare(`SELECT mid,vid,name FROM ` + config.Pm + `.pm_mode WHERE mid IN (` + strings.Join(midList, ",") + `)`)
	defer stmt.Close()
	db.CheckErr(err)
	rows, err := stmt.Query()
	defer rows.Close()
	db.CheckErr(err)
	var modeList []*ModeSingle
	for rows.Next() {
		single := &ModeSingle{}
		rows.Scan(&single.Mid, &single.Vid, &single.Name)
		modeList = append(modeList, single)
	}
	return modeList
}

//标签
func (this *Collate) GetTagsList() []*TagSingle {
	stmt, err := db.GetDb().Prepare(`SELECT tag,info FROM ` + config.Pm + `.pm_tags`)
	defer stmt.Close()
	db.CheckErr(err)
	rows, err := stmt.Query()
	defer rows.Close()
	db.CheckErr(err)
	var tagsList []*TagSingle
	for rows.Next() {
		single := &TagSingle{}
		rows.Scan(&single.Tag, &single.Info)
		tagsList = append(tagsList, single)
	}
	return tagsList
}

//附加
func (this *Collate) GetExtraList(BeginDate, EndDate string) []*ExtraSingle {
	stmt, err := db.GetDb().Prepare(`SELECT eid,uid,name,date,inspect FROM ` + config.Pm + `.pm_extra WHERE date >= ? AND date <= ?`)
	defer stmt.Close()
	db.CheckErr(err)
	rows, err := stmt.Query(BeginDate, EndDate)
	defer rows.Close()
	db.CheckErr(err)
	var extraList []*ExtraSingle
	for rows.Next() {
		single := &ExtraSingle{}
		rows.Scan(&single.Eid, &single.Uid, &single.Name, &single.Date, &single.Inspect)
		extraList = append(extraList, single)
	}
	return extraList
}

//预览
func (this *Collate) View(BeginDate, EndDate string) bool {
	//环节id
	lidMap := make(map[uint64]uint64)
	//模块id
	midMap := make(map[uint64]uint64)
	//额外列表
	extraList := this.GetExtraList(BeginDate, EndDate)
	//内容列表
	workList := this.GetStepList(BeginDate, EndDate, lidMap)
	//环节列表
	linkList := this.GetLinkList(lidMap, midMap)
	//模块列表
	modeList := this.GetModeList(midMap)
	//标签列表
	tagsList := this.GetTagsList()
	data := &L2C_CollateView{
		ModeList:    modeList,
		LinkList:    linkList,
		WorkList:    workList,
		TagsList:    tagsList,
		ExtraList:   extraList,
		VersionList: this.owner.Version().VersionList(),
	}
	this.owner.SendTo(L2C_COLLATE_VIEW, data)
	return true
}

//删除
func (this *Collate) ExtraDelete(eid uint64) bool {
	stmt, err := db.GetDb().Prepare(`DELETE FROM ` + config.Pm + `.pm_extra WHERE eid = ?`)
	defer stmt.Close()
	db.CheckErr(err)
	_, err = stmt.Exec(eid)
	db.CheckErr(err)
	data := &L2C_CollateExtraDelete{
		Eid: eid,
	}
	this.owner.SendToAll(L2C_COLLATE_EXTRA_DELETE, data)
	return true
}

//编辑补充
func (this *Collate) ExtraEdit(eid, inspect uint64, name string) bool {
	stmt, err := db.GetDb().Prepare(`UPDATE ` + config.Pm + `.pm_extra SET inspect = ?,name = ? WHERE eid = ?`)
	defer stmt.Close()
	db.CheckErr(err)
	_, err = stmt.Exec(inspect, name, eid)
	db.CheckErr(err)
	stmt, err = db.GetDb().Prepare(`SELECT eid,uid,name,date,inspect FROM ` + config.Pm + `.pm_extra WHERE eid = ?`)
	db.CheckErr(err)
	single := &ExtraSingle{}
	stmt.QueryRow(eid).Scan(&single.Eid, &single.Uid, &single.Name, &single.Date, &single.Inspect)
	this.owner.SendToAll(L2C_COLLATE_EXTRA_EDIT, single)
	return true
}

//增加补充
func (this *Collate) StepAdd(date string, uid uint64, name string, inspect uint64) bool {
	stmt, err := db.GetDb().Prepare(`INSERT INTO ` + config.Pm + `.pm_extra (date,uid,pm_uid,name,inspect,inspect_time) VALUES (?,?,?,?,?,?)`)
	defer stmt.Close()
	db.CheckErr(err)
	res, err := stmt.Exec(date, uid, this.owner.GetUid(), name, inspect, time.Now().Unix())
	db.CheckErr(err)
	eid, _ := res.LastInsertId()
	single := &ExtraSingle{
		Eid:     uint64(eid),
		Uid:     uid,
		Date:    date,
		Name:    name,
		Inspect: inspect,
	}
	this.owner.SendToAll(L2C_COLLATE_STEP_ADD, single)
	return true
}

//编辑进度
func (this *Collate) StepEdit(wid, inspect uint64) bool {
	stmt, err := db.GetDb().Prepare(`UPDATE ` + config.Pm + `.pm_work SET inspect = ?,inspect_time = ?,inspect_uid = ? WHERE wid = ?`)
	defer stmt.Close()
	db.CheckErr(err)
	_, err = stmt.Exec(inspect, time.Now().Unix(), this.owner.GetUid(), wid)
	db.CheckErr(err)
	stmt, err = db.GetDb().Prepare(`SELECT wid,lid,date,status,min_num,max_num,tag,tips,inspect FROM ` + config.Pm + `.pm_work WHERE wid = ?`)
	db.CheckErr(err)
	single := &WorkSingle{}
	stmt.QueryRow(wid).Scan(&single.Wid, &single.Lid, &single.Date, &single.Status, &single.MinNum, &single.MaxNum, &single.Tag, &single.Tips, &single.Inspect)
	this.owner.SendToAll(L2C_COLLATE_STEP_EDIT, single)
	return true
}
