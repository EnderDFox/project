/* 管理后台 */

package main

import (
	"github.com/gorilla/websocket"
)

type ManageManager struct{}

func NewManageManager() *ProcessManager {
	return &ProcessManager{}
}

func (this *ManageManager) RegisterFunction() {
	command.Register(C2L_MANAGE_VIEW, &C2L_M_MANAGE_VIEW{})
}

//
type C2L_M_MANAGE_VIEW struct{}

func (this *C2L_M_MANAGE_VIEW) execute(client *websocket.Conn, msg *Message) bool {
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Manage().View()
	return true
}
