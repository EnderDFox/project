package main

import (
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

//===
