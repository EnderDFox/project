package main

import (
	"encoding/json"
	"log"

	"github.com/gorilla/websocket"
)

type SessionManager struct{}

func NewSessionManager() *SessionManager {
	return &SessionManager{}
}

func (this *SessionManager) RegisterFunction() {
	command.Register(C2L_SESSION_LOGIN, &C2L_M_SESSION_LOGIN{})
}

//登陆
type C2L_M_SESSION_LOGIN struct{}

func (this *C2L_M_SESSION_LOGIN) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_SessionLogin{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		log.Println("C2L_M_SESSION_LOGIN err:", err)
		return false
	}
	session.Login(client, param.Account, param.Verify)
	return true
}
