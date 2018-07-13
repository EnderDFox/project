package main

import (
	"fmt"
)

//"fmt"

type ModeRow struct {
	Mid  uint64
	Name string
	Vid  uint64
}

type Test struct {
	ModeRows map[uint64]*ModeRow
}

func NewTest() *Test {
	instance := &Test{}
	instance.ModeRows = make(map[uint64]*ModeRow)
	return instance
}

//加载所有数据
func (this *Test) LoadData() {
	smt, err := db.GetDb().Prepare(`select mid,name,vid from ` + config.Pm + `.pm_mode`)
	defer smt.Close()
	db.CheckErr(err)
	rows, err := smt.Query()
	db.CheckErr(err)
	for rows.Next() {
		row := &ModeRow{}
		rows.Scan(&row.Mid, &row.Name, &row.Vid)
		this.ModeRows[row.Mid] = row
	}
}

//增加
func (this *Test) Add(mid uint64, args ...interface{}) {

}

//更新
func (this *Test) Update(mid uint64, args ...interface{}) {

}

//删除
func (this *Test) Del(mid uint64) {

}

//显示列表
func (this *Test) Show() {
	for _, row := range this.ModeRows {
		fmt.Println(row.Mid, row.Name, row.Vid)
	}
}

//调试一下
func (this *Test) Debug() {
	this.LoadData()
	//this.Show()
	dbSave := NewDbSave()
	go dbSave.ReadChan()
	dbSave.WriteChan()
	//this.Show()
}
