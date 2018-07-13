package main

import (
	"crypto/md5"
	"fmt"
	"log"

	"github.com/gorilla/websocket"
)

type Session struct {
	Users map[uint64]*User
	Key   string
}

func NewSession() *Session {
	instance := &Session{}
	instance.Users = make(map[uint64]*User)
	instance.Key = "23528d0315eac50e44927b0051e6e75f"
	return instance
}

//添加用户
func (this *Session) AddUser(user *User) bool {
	this.Users[user.GetUid()] = user
	return true
}

//获取用户
func (this *Session) GetUser(uid uint64) *User {
	user, ok := this.Users[uid]
	if ok {
		return user
	}
	return nil
}

//获取所有用户
func (this *Session) GetUsers() map[uint64]*User {
	return this.Users
}

//登陆
func (this *Session) Login(client *websocket.Conn, account, verify string, pid uint64) bool {
	has := md5.Sum([]byte(this.Key + account))
	md5str := fmt.Sprintf("%x", has)
	log.Println(md5str, ":[md5str]", verify, ":[verify]", this.Key, ":[this.Key]", account, ":[account]", pid, ":[pid]")
	if md5str != verify {
		log.Println(account, " login error")
		msg := &L2C_Message{
			Cid:  L2C_SESSION_LOGIN_ERROR,
			Uid:  0,
			Data: &L2C_LoginError{},
			Ret:  COMMON_OK,
		}
		client.WriteJSON(msg)
		return false
	}
	//
	projectSingle := common.GetProjectById(pid)
	if projectSingle == nil {
		log.Println(account, " no pid:", pid)
		msg := &L2C_Message{
			Cid:  L2C_SESSION_LOGIN_ERROR,
			Uid:  0,
			Data: &L2C_LoginError{},
			Ret:  COMMON_OK,
		}
		client.WriteJSON(msg)
		return false
	}
	//
	stmt, err := db.GetDb().Prepare(`SELECT uid FROM ` + config.Mg + `.mag_user WHERE rtx_account = ?`)
	defer stmt.Close()
	db.CheckErr(err)
	var uid uint64
	row := stmt.QueryRow(account)
	row.Scan(&uid)
	if uid == 0 {
		return false
	}
	user := this.GetUser(uid)
	if user == nil {
		user = NewUser()
	} else {
		//踢掉老用户
		//user.GetClient().Close()
	}
	stmt, err = db.GetDb().Prepare(`SELECT uid, pid, gid, did, name, vip, is_del, is_hide, rtx_name, rtx_account, rtx_group, reg_time, login_count, login_time FROM ` + config.Mg + `.mag_user WHERE uid = ?`)
	if err != nil {
		return false
	}
	row = stmt.QueryRow(uid)
	row.Scan(&user.Uid, &user.Pid, &user.Gid, &user.Did, &user.Name, &user.Vip, &user.IsDel, &user.IsHide, &user.RtxName, &user.RtxAccount, &user.RtxGroup, &user.RegTime, &user.LoginCount, &user.LoginTime)
	user.Pid = pid
	this.AddUser(user)
	user.Login(client)
	return true
}

//注册
func (this *Session) Register() bool {
	return true
}
