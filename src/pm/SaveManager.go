package main

import (
	"encoding/json"

	"github.com/gorilla/websocket"
)

type SaveManager struct{}

func NewSaveManager() *SaveManager {
	return &SaveManager{}
}

func (this *SaveManager) RegisterFunction() {
	command.Register(C2L_SAVE_COLLATE, &C2L_M_SAVE_COLLATE{})
}

//编辑
type C2L_M_SAVE_COLLATE struct{}

func (this *C2L_M_SAVE_COLLATE) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_SaveCollate{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Save().Collate(param.BeginDate, param.EndDate)
	return true
}
