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
	user.SendToAll(PB_CMD_MANAGE_DEPT_ADD, dept)
	return true
}
