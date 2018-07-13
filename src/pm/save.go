package main

import (
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/tealeg/xlsx"
)

type Save struct {
	owner *User
}

func NewSave(user *User) *Save {
	instance := &Save{}
	instance.owner = user
	return instance
}

//获取用户列表
func (this *Save) GetUserMap() (map[uint64]*UserSingle, []*UserSingle) {
	stmt, err := db.GetDb().Prepare(`SELECT uid,did,name,is_del,is_hide FROM ` + config.Mg + `.mag_user ORDER BY sort ASC`)
	defer stmt.Close()
	db.CheckErr(err)
	rows, err := stmt.Query()
	defer rows.Close()
	db.CheckErr(err)
	var userList []*UserSingle
	userMap := make(map[uint64]*UserSingle)
	for rows.Next() {
		single := &UserSingle{}
		rows.Scan(&single.Uid, &single.Did, &single.Name, &single.IsDel, &single.IsHide)
		userMap[single.Uid] = single
		userList = append(userList, single)
	}
	return userMap, userList
}

//获取部门列表
func (this *Save) GetDepartmentMap() map[uint64]*DepartmentSingle {
	stmt, err := db.GetDb().Prepare(`SELECT did,name,fid FROM ` + config.Mg + `.mag_department ORDER BY sort ASC`)
	defer stmt.Close()
	db.CheckErr(err)
	rows, err := stmt.Query()
	defer rows.Close()
	db.CheckErr(err)
	departmentMap := make(map[uint64]*DepartmentSingle)
	for rows.Next() {
		single := &DepartmentSingle{}
		rows.Scan(&single.Did, &single.Name, &single.Fid)
		departmentMap[single.Did] = single
	}
	return departmentMap
}

//获取模块列表
func (this *Save) GetModeMap() map[uint64]*ModeSingle {
	stmt, err := db.GetDb().Prepare(`SELECT mid,vid,name FROM ` + config.Pm + `.pm_mode`)
	defer stmt.Close()
	db.CheckErr(err)
	rows, err := stmt.Query()
	defer rows.Close()
	db.CheckErr(err)
	modeMap := make(map[uint64]*ModeSingle)
	for rows.Next() {
		single := &ModeSingle{}
		rows.Scan(&single.Mid, &single.Vid, &single.Name)
		modeMap[single.Mid] = single
	}
	return modeMap
}

//获取模块列表
func (this *Save) GetTagMap() map[string]*TagSingle {
	stmt, err := db.GetDb().Prepare(`SELECT tag,info FROM ` + config.Pm + `.pm_tags`)
	defer stmt.Close()
	db.CheckErr(err)
	rows, err := stmt.Query()
	defer rows.Close()
	db.CheckErr(err)
	tagMap := make(map[string]*TagSingle)
	for rows.Next() {
		single := &TagSingle{}
		rows.Scan(&single.Tag, &single.Info)
		tagMap[single.Tag] = single
	}
	return tagMap
}

//附加内容列表√
func (this *Save) GetExtraMap(beginDate, endDate string) map[string]map[uint64][]*ExtraSingle {
	stmt, err := db.GetDb().Prepare(`SELECT eid,uid,name,date,inspect FROM ` + config.Pm + `.pm_extra WHERE date >= ? AND date <= ?`)
	defer stmt.Close()
	db.CheckErr(err)
	rows, err := stmt.Query(beginDate, endDate)
	defer rows.Close()
	db.CheckErr(err)
	extraMap := make(map[string]map[uint64][]*ExtraSingle)
	for rows.Next() {
		single := &ExtraSingle{}
		rows.Scan(&single.Eid, &single.Uid, &single.Name, &single.Date, &single.Inspect)
		if extraMap[single.Date] == nil {
			extraMap[single.Date] = make(map[uint64][]*ExtraSingle)
		}
		extraMap[single.Date][single.Uid] = append(extraMap[single.Date][single.Uid], single)
	}
	return extraMap
}

//获取环节用户
func (this *Save) GetLinkMap(beginDate, endDate string) map[uint64]*LinkSingle {
	stmt, err := db.GetDb().Prepare(`SELECT DISTINCT(lid) AS lid FROM ` + config.Pm + `.pm_work WHERE date >= ? AND date <= ?`)
	defer stmt.Close()
	db.CheckErr(err)
	rows, err := stmt.Query(beginDate, endDate)
	defer rows.Close()
	db.CheckErr(err)
	var lids []string
	for rows.Next() {
		var lid int
		rows.Scan(&lid)
		lids = append(lids, strconv.Itoa(lid))
	}
	if len(lids) == 0 {
		return nil
	}
	stmt, err = db.GetDb().Prepare(`SELECT lid,uid,name,mid FROM ` + config.Pm + `.pm_link WHERE lid IN (` + strings.Join(lids, ",") + `)`)
	db.CheckErr(err)
	rows, err = stmt.Query()
	db.CheckErr(err)
	linkMap := make(map[uint64]*LinkSingle)
	for rows.Next() {
		single := &LinkSingle{}
		rows.Scan(&single.Lid, &single.Uid, &single.Name, &single.Mid)
		linkMap[single.Lid] = single
	}
	return linkMap
}

//获取晨会列表
func (this *Save) GetWorkMap(beginDate, endDate string, linkMap map[uint64]*LinkSingle) map[string]map[uint64][]*WorkSingle {
	stmt, err := db.GetDb().Prepare(`SELECT wid,lid,date,status,min_num,max_num,tag,tips,inspect FROM ` + config.Pm + `.pm_work WHERE date >= ? AND date <= ?`)
	defer stmt.Close()
	db.CheckErr(err)
	rows, err := stmt.Query(beginDate, endDate)
	defer rows.Close()
	db.CheckErr(err)
	workDateUserMap := make(map[string]map[uint64][]*WorkSingle)
	for rows.Next() {
		single := &WorkSingle{}
		rows.Scan(&single.Wid, &single.Lid, &single.Date, &single.Status, &single.MinNum, &single.MaxNum, &single.Tag, &single.Tips, &single.Inspect)
		uid := linkMap[single.Lid].Uid
		if workDateUserMap[single.Date] == nil {
			workDateUserMap[single.Date] = make(map[uint64][]*WorkSingle)
		}
		workDateUserMap[single.Date][uid] = append(workDateUserMap[single.Date][uid], single)
	}
	return workDateUserMap
}

//晨会内容

func (this *Save) Collate(beginDate, endDate string) bool {
	//模块
	modeMap := this.GetModeMap()
	//环节
	linkMap := this.GetLinkMap(beginDate, endDate)
	//内容
	workMap := this.GetWorkMap(beginDate, endDate, linkMap)
	//用户
	userMap, userList := this.GetUserMap()
	//部门
	deptMap := this.GetDepartmentMap()
	//附加
	extraMap := this.GetExtraMap(beginDate, endDate)
	//标签
	tagMap := this.GetTagMap()
	//保存
	go this.SaveCollate(beginDate, endDate, extraMap, tagMap, modeMap, linkMap, workMap, userMap, userList, deptMap)
	return true
}

//获取样式
func (this *Save) GetStyle(bgColor string, bold bool, hAlign string) *xlsx.Style {
	style := xlsx.NewStyle()
	style.Font = *xlsx.NewFont(11, "微软雅黑")
	style.Font.Color = "00000000"
	style.Font.Bold = bold
	style.Alignment = xlsx.Alignment{}
	style.Alignment.WrapText = true
	style.Alignment.Vertical = "center"
	style.Alignment.Horizontal = hAlign
	if bgColor != "none" {
		style.Fill = *xlsx.NewFill("solid", bgColor, bgColor)
	}
	style.Border = *xlsx.NewBorder("thin", "thin", "thin", "thin")
	style.Border.BottomColor = "00000000"
	style.Border.LeftColor = "00000000"
	style.Border.TopColor = "00000000"
	style.Border.RightColor = "00000000"
	return style
}

//获取日期范围
func (this *Save) GetRangeDate(beginDate, endDate string) []string {
	var dateList []string
	info := strings.Split(beginDate, "-")
	tm, _ := time.Parse("01/02/2006", info[1]+"/"+info[2]+"/"+info[0])
	x := 0
	for {
		ntm := time.Unix(tm.Unix()+int64(86400*x), 0)
		date := ntm.Format("2006-01-02")
		dateList = append(dateList, date)
		//fmt.Println(ntm.Weekday().String())
		x++
		if endDate == date {
			break
		}
		//临时错误保护
		if x > 90 {
			break
		}
	}
	return dateList
}

//保存晨会
func (this *Save) SaveCollate(beginDate, endDate string, extraMap map[string]map[uint64][]*ExtraSingle, tagMap map[string]*TagSingle, modeMap map[uint64]*ModeSingle, linkMap map[uint64]*LinkSingle, workMap map[string]map[uint64][]*WorkSingle, userMap map[uint64]*UserSingle, userList []*UserSingle, deptMap map[uint64]*DepartmentSingle) bool {

	statusMap := make(map[uint64]string)
	statusMap[0] = "持续"
	statusMap[1] = "延期"
	statusMap[2] = "等待"
	statusMap[3] = "完成"
	statusMap[4] = "休息"
	statusMap[5] = "优化"

	inspectMap := make(map[uint64]string)
	inspectMap[0] = "未知"
	inspectMap[1] = "完成"
	inspectMap[2] = "持续"
	inspectMap[3] = "未完成"

	mapColor := make(map[uint64]string)
	mapColor[1] = "FFb1a0c7"
	mapColor[2] = "FF92d050"
	mapColor[3] = "FFe6b8b7"
	mapColor[4] = "FFe26b0a"
	mapColor[5] = "FF538dd5"
	mapColor[6] = "FFffd966"
	mapColor[7] = "FF92d050"
	mapColor[8] = "FF92d050"
	mapColor[9] = "FF92d050"
	mapColor[10] = "FF92d050"
	mapColor[11] = "FF92d050"
	mapColor[12] = "FF92d050"
	mapColor[13] = "FF92d050"
	mapColor[14] = "FFffc7ce"

	var saveFile = xlsx.NewFile()
	var sheetObj *xlsx.Sheet
	var rowObj *xlsx.Row
	var cellObj *xlsx.Cell

	//日期列表
	dateList := this.GetRangeDate(beginDate, endDate)
	if dateList == nil {
		return false
	}
	//第一行部门
	sheetObj, err := saveFile.AddSheet("晨会数据")
	if err != nil {
		fmt.Printf(err.Error())
	}
	rowObj = sheetObj.AddRow()
	rowObj.SetHeight(25)
	cellObj = rowObj.AddCell()
	cellObj.Value = "日期"
	cellObj.SetStyle(this.GetStyle("FF00ccff", true, "center"))
	for _, user := range userList {
		if user.Did == 0 {
			continue
		}
		if user.IsHide == 1 {
			continue
		}
		cellObj = rowObj.AddCell()
		cellObj.Value = user.Name
		cellObj.SetStyle(this.GetStyle(mapColor[user.Did], true, "center"))
	}
	//内容显示
	for _, date := range dateList {
		rowObj = sheetObj.AddRow()
		cellObj = rowObj.AddCell()
		cellObj.Value = date
		cellObj.SetStyle(this.GetStyle("none", false, "center"))
		for _, user := range userList {
			if user.Did == 0 {
				continue
			}
			if user.IsHide == 1 {
				continue
			}
			var infoList []string
			workList := workMap[date][user.Uid]
			if len(workList) > 0 {
				for k, work := range workList {
					var link = linkMap[work.Lid]
					var info = strconv.Itoa(k+1) + "."
					info += modeMap[link.Mid].Name + "-" + link.Name
					if work.MinNum > 0 || work.MaxNum > 0 {
						info += "（" + strconv.Itoa(int(work.MinNum)) + "/" + strconv.Itoa(int(work.MaxNum)) + "）"
					}
					if work.Tips != "" {
						info += "（" + work.Tips + "）"
					}
					if work.Tag != "" {
						if tag, ok := tagMap[work.Tag]; ok {
							info += "（" + tag.Info + "）"
						} else {
							info += "（" + work.Tag + "）"
						}
					} else {
						info += "（" + statusMap[work.Status] + "）"
					}
					infoList = append(infoList, info)
				}
			}
			extraList := extraMap[date][user.Uid]
			if len(extraList) > 0 {
				workLen := len(workList)
				for k, extra := range extraList {
					var info = strconv.Itoa(k+1+workLen) + "."
					info += extra.Name
					info += "（" + inspectMap[extra.Inspect] + "）"
					info += "√"
					infoList = append(infoList, info)
				}
			}
			cellObj = rowObj.AddCell()
			cellObj.Value = strings.Join(infoList, "\n")
			cellObj.SetStyle(this.GetStyle("none", false, "left"))
		}
	}
	//设置宽度
	sheetObj.SetColWidth(0, 1, 15)
	sheetObj.SetColWidth(1, sheetObj.MaxCol, 24)
	//文件保存
	fileName := beginDate + "_" + endDate + ".xlsx"
	err = saveFile.Save("./web/file/" + fileName)
	if err == nil {
		data := &L2C_SaveCollate{
			Path: "file/" + fileName,
		}
		this.owner.SendTo(L2C_SAVE_COLLATE, data)
	}
	return true
}
