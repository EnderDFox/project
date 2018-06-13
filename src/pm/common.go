package main

import (
	"log"
	"os"
	"strconv"
	"strings"
)

const (
	COMMON_OK  = 1
	COMMON_PID = 1
)

type Common struct {
}

func NewCommon() *Common {
	instance := &Common{}
	return instance
}

//初始化 所有文件夹 避免上传时再初始化 会慢
func (this *Common) CreateDir(path string) {
	// wd, _ := os.Getwd() //当前的目录
	// log.Println("wd:", wd)
	os.Mkdir(path, os.ModePerm)
	/*err := os.Mkdir(path, os.ModePerm)
	if err != nil {
		fmt.Println("err:", err) //已存在的文件 也会报这个错误
	} else {
		fmt.Println("创建目录 cpl")
	} */
}

func (this *Common) StringArrayIndexOf(arr *[]string, val *string) int {
	for i, v := range *arr {
		if *val == v {
			return i
		}
	}
	return -1
}

//===sort字段处理
//新增
func (this *Common) SortStringUtil_push_int64(sortStrOri string, val int64) string {
	return this.SortStringUtil_push(sortStrOri, strconv.Itoa(int(val)))
}
func (this *Common) SortStringUtil_push(sortStrOri string, newStr string) string {
	if sortStrOri == "" {
		return newStr
	} else {
		var sortList []string = strings.Split(sortStrOri, ",")
		sortList = append(sortList, newStr)
		return strings.Join(sortList, ",")
	}
}

//删除
func (this *Common) SortStringUtil_delete_uint64(sortStrOri string, val uint64) string {
	return this.SortStringUtil_delete(sortStrOri, strconv.Itoa(int(val)))
}
func (this *Common) SortStringUtil_delete(sortStrOri string, val string) string {
	var sortListOri []string = strings.Split(sortStrOri, ",")
	var index = this.StringArrayIndexOf(&sortListOri, &val)
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
func (this *Common) SortStringUtil_sortUp_uint64(sortStrOri string, val uint64) string {
	return this.SortStringUtil_sortUp(sortStrOri, strconv.Itoa(int(val)))
}
func (this *Common) SortStringUtil_sortUp(sortStrOri string, val string) string {
	var sortListOri []string = strings.Split(sortStrOri, ",")
	var sortList []string
	var index = this.StringArrayIndexOf(&sortListOri, &val)
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
func (this *Common) SortStringUtil_sortDown_uint64(sortStrOri string, val uint64) string {
	return this.SortStringUtil_sortDown(sortStrOri, strconv.Itoa(int(val)))
}
func (this *Common) SortStringUtil_sortDown(sortStrOri string, val string) string {
	var sortListOri []string = strings.Split(sortStrOri, ",")
	var sortList []string
	var index = this.StringArrayIndexOf(&sortListOri, &val)
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

//pm_project.mode_sort转存到sort
func (this *Common) ProjectModeSort2Sort() {
	stmt, err := db.GetDb().Prepare(`SELECT mode_sort FROM ` + config.Pm + `.pm_project`)
	defer stmt.Close()
	db.CheckErr(err)
	rows, err := stmt.Query()
	defer rows.Close()
	db.CheckErr(err)
	for rows.Next() {
		var modeSort string
		rows.Scan(&modeSort)
		modeSortStrArr := strings.Split(modeSort, ",")
		for i, midStr := range modeSortStrArr {
			log.Println(midStr, ":[lidStr] ProjectModeSort2Sort")
			stmt, err := db.GetDb().Prepare(`UPDATE ` + config.Pm + `.pm_mode SET sort = ? WHERE mid = ?`)
			defer stmt.Close()
			db.CheckErr(err)
			_, err = stmt.Exec(i+1, midStr)
			db.CheckErr(err)
		}
	}
}

//pm_mode.link_sort转存到sort
func (this *Common) ModeLinkSort2Sort() {
	stmt, err := db.GetDb().Prepare(`SELECT mid,link_sort FROM ` + config.Pm + `.pm_mode`)
	defer stmt.Close()
	db.CheckErr(err)
	rows, err := stmt.Query()
	defer rows.Close()
	db.CheckErr(err)
	for rows.Next() {
		var mid uint64
		var linkSort string
		rows.Scan(&mid, &linkSort)
		linkSortStrArr := strings.Split(linkSort, ",")
		for i, lidStr := range linkSortStrArr {
			log.Println(lidStr, ":[lidStr] ModeLinkSort2Sort")
			stmt, err := db.GetDb().Prepare(`UPDATE ` + config.Pm + `.pm_link SET sort = ? WHERE lid = ?`)
			defer stmt.Close()
			db.CheckErr(err)
			_, err = stmt.Exec(i+1, lidStr)
			db.CheckErr(err)
		}
	}
}

//pm_template_mode.link_sort转存到sort
func (this *Common) TplLinkSort2Sort() {
	stmt, err := db.GetDb().Prepare(`SELECT tmid,link_sort FROM ` + config.Pm + `.pm_template_mode`)
	defer stmt.Close()
	db.CheckErr(err)
	rows, err := stmt.Query()
	defer rows.Close()
	db.CheckErr(err)
	for rows.Next() {
		var tmid uint64
		var linkSort string
		rows.Scan(&tmid, &linkSort)
		linkSortStrArr := strings.Split(linkSort, ",")
		for i, tlidStr := range linkSortStrArr {
			// log.Println(tlidStr, ":[tlidStr]")
			stmt, err := db.GetDb().Prepare(`UPDATE ` + config.Pm + `.pm_template_link SET sort = ? WHERE tlid = ?`)
			defer stmt.Close()
			db.CheckErr(err)
			_, err = stmt.Exec(i+1, tlidStr)
			db.CheckErr(err)
		}
	}
}

/*这个会报错*/
func (this *Common) TplUpdateSort2(tmid uint64) {
	stmt, err := db.GetDb().Prepare(`UPDATE ` + config.Pm + `.pm_template_link AS ta,(SELECT  (@i:=@i+1) AS i,t1.sort,t1.tlid FROM ` + config.Pm + `.pm_template_link AS t1 ,(SELECT @i:=0) AS t2 WHERE t1.tmid=1 ORDER BY t1.sort) AS tb SET ta.sort = tb.i WHERE ta.tlid = tb.tlid`)
	defer stmt.Close()
	db.CheckErr(err)
	_, err = stmt.Exec()
	db.CheckErr(err)
}

//===
