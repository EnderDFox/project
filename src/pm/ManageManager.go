/* 管理后台 */

package main

import (
	"encoding/json"
	"log"

	"github.com/gorilla/websocket"
)

type ManageManager struct{}

func NewManageManager() *ManageManager {
	return &ManageManager{}
}

func (this *ManageManager) RegisterFunction() {
	command.Register(PB_CMD_MANAGE_VIEW, &C2L_M_MANAGE_VIEW{})
	command.Register(PB_CMD_MANAGE_PROJ_ADD, &C2L_M_MANAGE_PROJ_ADD{})
	command.Register(PB_CMD_MANAGE_PROJ_DEL, &C2L_M_MANAGE_PROJ_DEL{})
	command.Register(PB_CMD_MANAGE_PROJ_EDIT_NAME, &C2L_M_MANAGE_PROJ_EDIT_NAME{})
	//#
	command.Register(PB_CMD_MANAGE_DEPT_ADD, &C2L_M_MANAGE_DEPT_ADD{})
	command.Register(PB_CMD_MANAGE_DEPT_DEL, &C2L_M_MANAGE_DEPT_DEL{})
	command.Register(PB_CMD_MANAGE_DEPT_EDIT_NAME, &C2L_M_MANAGE_DEPT_EDIT_NAME{})
	command.Register(PB_CMD_MANAGE_DEPT_EDIT_SORT, &C2L_M_MANAGE_DEPT_EDIT_SORT{})
	//#
	command.Register(PB_CMD_MANAGE_POSN_ADD, &C2L_M_MANAGE_POSN_ADD{})
	command.Register(PB_CMD_MANAGE_POSN_DEL, &C2L_M_MANAGE_POSN_DEL{})
	command.Register(PB_CMD_MANAGE_POSN_EDIT_NAME, &C2L_M_MANAGE_POSN_EDIT_NAME{})
	command.Register(PB_CMD_MANAGE_POSN_EDIT_SORT, &C2L_M_MANAGE_POSN_EDIT_SORT{})
	command.Register(PB_CMD_MANAGE_POSN_EDIT_AUTH, &C2L_M_MANAGE_POSN_EDIT_AUTH{})
	//#
	command.Register(PB_CMD_MANAGE_USER_EDIT_DEPT, &C2L_M_MANAGE_USER_EDIT_DEPT{})
	command.Register(PB_CMD_MANAGE_PROJ_DEL_USER, &C2L_M_MANAGE_PROJ_DEL_USER{})
	// command.Register(PB_CMD_MANAGE_USER_EDIT_SORT, &C2L_M_MANAGE_USER_EDIT_SORT{})
	// command.Register(PB_CMD_MANAGE_USER_EDIT_AUTH_GROUP, &C2L_M_MANAGE_USER_EDIT_SORT{})
	//#
	/*
		command.Register(PB_CMD_MANAGE_AUTH_GROUP_ADD, &C2L_M_MANAGE_AUTH_GROUP_ADD{})
		command.Register(PB_CMD_MANAGE_AUTH_GROUP_DEL, &C2L_M_MANAGE_AUTH_GROUP_DEL{})
		command.Register(PB_CMD_MANAGE_AUTH_GROUP_EDIT_NAME, &C2L_M_MANAGE_AUTH_GROUP_EDIT_NAME{})
		command.Register(PB_CMD_MANAGE_AUTH_GROUP_EDIT_DSC, &C2L_M_MANAGE_AUTH_GROUP_EDIT_DSC{})
		command.Register(PB_CMD_MANAGE_AUTH_GROUP_EDIT_SORT, &C2L_M_MANAGE_AUTH_GROUP_EDIT_SORT{})
		command.Register(PB_CMD_MANAGE_AUTH_GROUP_EDIT_AUTH, &C2L_M_MANAGE_AUTH_GROUP_EDIT_AUTH{})
	*/
}

//
type C2L_M_MANAGE_VIEW struct{}

func (this *C2L_M_MANAGE_VIEW) execute(client *websocket.Conn, msg *Message) bool {
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.SendTo(PB_CMD_MANAGE_VIEW, user.Manage().View())
	return true
}

/* 项目 增加 */
type C2L_M_MANAGE_PROJ_ADD struct{}

func (this *C2L_M_MANAGE_PROJ_ADD) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_ManageProjAdd{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	dept := user.Manage().ProjAdd(param.Name)
	if dept != nil {
		user.SendToAll(PB_CMD_MANAGE_PROJ_ADD, dept)
	}
	return true
}

type C2L_M_MANAGE_PROJ_DEL struct{}

func (this *C2L_M_MANAGE_PROJ_DEL) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_ManageProjDel{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	num := user.Manage().ProjDel(param.Pid)
	if num > 0 {
		user.SendToAll(PB_CMD_MANAGE_PROJ_DEL, param)
	}
	return true
}

type C2L_M_MANAGE_PROJ_EDIT_NAME struct{}

func (this *C2L_M_MANAGE_PROJ_EDIT_NAME) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_ManageProjEditName{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	num := user.Manage().ProjEditName(param.Pid, param.Name)
	if num > 0 {
		user.SendToAll(PB_CMD_MANAGE_PROJ_EDIT_NAME, param)
	}
	return true
}

/* 部门 增加 */
type C2L_M_MANAGE_DEPT_ADD struct{}

func (this *C2L_M_MANAGE_DEPT_ADD) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_ManageDeptAdd{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	dept := user.Manage().DeptAdd(param.Pid, param.Fid, param.Name)
	if dept != nil {
		user.SendToAll(PB_CMD_MANAGE_DEPT_ADD, dept)
	}
	return true
}

/* 部门 删除    客户端会把一个部门和它所有子部门的id都传过来, 一起del*/
type C2L_M_MANAGE_DEPT_DEL struct{}

func (this *C2L_M_MANAGE_DEPT_DEL) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_ManageDeptDel{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	num := user.Manage().DeptDel(param.DidList...)
	if num > 0 {
		user.SendToAll(PB_CMD_MANAGE_DEPT_DEL, param)
	}
	return true
}

/* 部门 编辑 */
type C2L_M_MANAGE_DEPT_EDIT_NAME struct{}

func (this *C2L_M_MANAGE_DEPT_EDIT_NAME) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_ManageDeptEditName{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	num := user.Manage().DeptEditName(param.Did, param.Name)
	if num > 0 {
		user.SendToAll(PB_CMD_MANAGE_DEPT_EDIT_NAME, param)
	}
	return true
}

/* 部门改位置和sort */
type C2L_M_MANAGE_DEPT_EDIT_SORT struct{}

func (this *C2L_M_MANAGE_DEPT_EDIT_SORT) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_ManageDeptEditSort{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Manage().DeptEditSort(param.Did, param.Fid, param.Sort)
	user.SendToAll(PB_CMD_MANAGE_DEPT_EDIT_SORT, param)
	return true
}

//# Posn
type C2L_M_MANAGE_POSN_ADD struct{}

func (this *C2L_M_MANAGE_POSN_ADD) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_ManagePosnAdd{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	posn := user.Manage().PosnAdd(param.Did, param.Name)
	if posn != nil {
		user.SendToAll(PB_CMD_MANAGE_POSN_ADD, posn)
	}
	return true
}

/* 部门 删除    客户端会把一个部门和它所有子部门的id都传过来, 一起del*/
type C2L_M_MANAGE_POSN_DEL struct{}

func (this *C2L_M_MANAGE_POSN_DEL) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_ManagePosnDel{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	num := user.Manage().PosnDel(param.Posnid)
	if num > 0 {
		user.SendToAll(PB_CMD_MANAGE_POSN_DEL, param)
	} else {
		log.Println("[log]", "PosnDel", num, ":[num]", param.Posnid, ":[param.Posnid]]")
	}
	return true
}

/* 部门 编辑 */
type C2L_M_MANAGE_POSN_EDIT_NAME struct{}

func (this *C2L_M_MANAGE_POSN_EDIT_NAME) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_ManagePosnEditName{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	num := user.Manage().PosnEditName(param.Posnid, param.Name)
	if num > 0 {
		user.SendToAll(PB_CMD_MANAGE_POSN_EDIT_NAME, param)
	}
	return true
}

type C2L_M_MANAGE_POSN_EDIT_SORT struct{}

func (this *C2L_M_MANAGE_POSN_EDIT_SORT) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_ManagePosnEditSort{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Manage().PosnEditSort(param.Posnid, param.Sort)
	user.SendToAll(PB_CMD_MANAGE_POSN_EDIT_SORT, param)
	return true
}

type C2L_M_MANAGE_POSN_EDIT_AUTH struct{}

func (this *C2L_M_MANAGE_POSN_EDIT_AUTH) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_ManagePosnEditAuth{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Manage().PosnEditAuth(true, param.Posnid, param.AuthidList...)
	user.SendToAll(PB_CMD_MANAGE_POSN_EDIT_AUTH, param)
	return true
}

type C2L_M_MANAGE_USER_EDIT_DEPT struct{}

func (this *C2L_M_MANAGE_USER_EDIT_DEPT) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_ManageUserEditDept{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Manage().UserEditDept(param.UserDeptList...)
	user.SendToAll(PB_CMD_MANAGE_USER_EDIT_DEPT, param)
	return true
}

type C2L_M_MANAGE_PROJ_DEL_USER struct{}

func (this *C2L_M_MANAGE_PROJ_DEL_USER) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_ManageProjDelUser{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Manage().ProjDelUser(param.Uid, param.Pid)
	user.SendToAll(PB_CMD_MANAGE_PROJ_DEL_USER, param)
	return true
}
