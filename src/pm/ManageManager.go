/* 管理后台 */

package main

import (
	"encoding/json"

	"github.com/gorilla/websocket"
)

type ManageManager struct{}

func NewManageManager() *ManageManager {
	return &ManageManager{}
}

func (this *ManageManager) RegisterFunction() {
	command.Register(PB_CMD_MANAGE_VIEW, &C2L_M_MANAGE_VIEW{})
	command.Register(PB_CMD_MANAGE_DEPT_ADD, &C2L_M_MANAGE_DEPT_ADD{})
	command.Register(PB_CMD_MANAGE_DEPT_DEL, &C2L_M_MANAGE_DEPT_DEL{})
	command.Register(PB_CMD_MANAGE_DEPT_EDIT_NAME, &C2L_M_MANAGE_DEPT_EDIT_NAME{})
	command.Register(PB_CMD_MANAGE_DEPT_EDIT_SORT, &C2L_M_MANAGE_DEPT_EDIT_SORT{})
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

/* 部门增加 */
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

/* 部门删除    客户端会把一个部门和它所有子部门的id都传过来, 一起del*/
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

/* 部门删除 */
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
	// num := user.Manage().DeptEditName(param.Did, param.Name)
	// if num > 0 {
	user.SendToAll(PB_CMD_MANAGE_DEPT_EDIT_SORT, param)
	// }
	return true
}
