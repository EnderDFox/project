package main

import (
	"github.com/gorilla/websocket"
)

type User struct {
	//数据集合
	Uid         uint64
	Pid         uint64
	Gid         uint64
	Did         uint64
	Name        string
	Vip         uint64
	Is_del      uint64
	Is_hide     uint64
	Rtx_name    string
	Rtx_account string
	Rtx_group   string
	Reg_time    uint64
	Login_count uint64
	Login_time  uint64
	//文件描述
	client *websocket.Conn
	//初始化类
	profilePtr *Profile
	processPtr *Process
	collatePtr *Collate
	savePtr    *Save
}

func NewUser() *User {
	instance := &User{}
	instance.Init()
	return instance
}

func (this *User) GetUid() uint64 {
	return this.Uid
}

func (this *User) GetName() string {
	return this.Name
}

func (this *User) GetClient() *websocket.Conn {
	return this.client
}

func (this *User) Profile() *Profile {
	return this.profilePtr
}

func (this *User) Process() *Process {
	return this.processPtr
}

func (this *User) Collate() *Collate {
	return this.collatePtr
}

func (this *User) Save() *Save {
	return this.savePtr
}

//模块初始化
func (this *User) Init() {
	//个人模块
	this.profilePtr = NewProfile(this)
	//进度模块
	this.processPtr = NewProcess(this)
	//晨会模块
	this.collatePtr = NewCollate(this)
	//保存模块
	this.savePtr = NewSave(this)
}

//数据发送
func (this *User) SendTo(cid uint64, data interface{}) {
	msg := &L2C_Message{
		Cid:  cid,
		Uid:  this.Uid,
		Data: data,
		Ret:  COMMON_OK,
	}
	this.client.WriteJSON(msg)
}

//数据发送
func (this *User) SendToAll(cid uint64, data interface{}) {
	users := session.GetUsers()
	for _, user := range users {
		user.SendTo(cid, data)
	}
}

//登陆后操作
func (this *User) Login(client *websocket.Conn) {
	//设置文件描述
	this.client = client
	//同步当前用户
	this.NtfUser()
	//同步用户列表
	this.NtfUserList()
	//同步组织列表
	this.NtfDepartmentList()
	//推送信息
	this.NtfModule()
}

//推送信息
func (this *User) NtfModule() bool {
	if this.Gid == 0 {
		return false
	}
	//推送通知信息
	timer.ProcessScore()
	return true
}

//同步当前用户
func (this *User) NtfUser() bool {
	IsWrite := this.Gid == 1
	data := &L2C_SessionLogin{
		Uid:         this.Uid,
		Pid:         this.Pid,
		Gid:         this.Gid,
		Did:         this.Did,
		Name:        this.Name,
		Vip:         this.Vip,
		Is_del:      this.Is_del,
		Rtx_name:    this.Rtx_name,
		Rtx_account: this.Rtx_account,
		Rtx_group:   this.Rtx_group,
		Reg_time:    this.Reg_time,
		Login_count: this.Login_count,
		Login_time:  this.Login_time,
		IsWrite:     IsWrite,
	}
	this.SendTo(L2C_SESSION_LOGIN, data)
	return true
}

//同步用户列表
func (this *User) NtfUserList() bool {
	stmt, err := db.GetDb().Prepare(`SELECT uid,did,name,is_del,is_hide FROM ` + config.Mg + `.mag_user ORDER BY sort ASC`)
	defer stmt.Close()
	if err != nil {
		return false
	}
	rows, err := stmt.Query()
	defer rows.Close()
	if err != nil {
		return false
	}
	data := &L2C_UserList{}
	for rows.Next() {
		single := &UserSingle{}
		rows.Scan(&single.Uid, &single.Did, &single.Name, &single.IsDel, &single.IsHide)
		data.List = append(data.List, single)
	}
	this.SendTo(L2C_USER_LIST, data)
	return true
}

//同步组织列表
func (this *User) NtfDepartmentList() bool {
	stmt, err := db.GetDb().Prepare(`SELECT did,name,fid FROM manager.mag_department ORDER BY sort ASC`)
	defer stmt.Close()
	if err != nil {
		return false
	}
	rows, err := stmt.Query()
	defer rows.Close()
	if err != nil {
		return false
	}
	data := &L2C_DepartmentList{}
	for rows.Next() {
		single := &DepartmentSingle{}
		rows.Scan(&single.Did, &single.Name, &single.Fid)
		data.List = append(data.List, single)
	}
	this.SendTo(L2C_DEPARTMENT_LIST, data)
	return true
}
