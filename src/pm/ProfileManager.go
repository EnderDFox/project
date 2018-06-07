package main

import (
	"encoding/json"

	"github.com/gorilla/websocket"
)

type ProfileManager struct{}

func NewProfileManager() *ProfileManager {
	return &ProfileManager{}
}

func (this *ProfileManager) RegisterFunction() {
	command.Register(C2L_PROFILE_VIEW, &C2L_M_PROFILE_VIEW{})
}

//预览
type C2L_M_PROFILE_VIEW struct{}

func (this *C2L_M_PROFILE_VIEW) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_ProfileView{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Profile().View()
	return true
}
