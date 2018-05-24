package main

//版本 与 版本时间控制

import (
	"encoding/json"

	"github.com/gorilla/websocket"
)

type VersionManager struct{}

func NewVersionManager() *VersionManager {
	return &VersionManager{}
}

func (this *VersionManager) RegisterFunction() {
	command.Register(C2L_VERSION_ADD, &C2L_M_VERSION_ADD{})
	command.Register(C2L_VERSION_DELETE, &C2L_M_VERSION_DELETE{})
	command.Register(C2L_VERSION_CHANGE_VER, &C2L_M_VERSION_CHANGE_VER{})
	command.Register(C2L_VERSION_CHANGE_NAME, &C2L_M_VERSION_CHANGE_NAME{})
	command.Register(C2L_VERSION_CHANGE_PUBLISH, &C2L_M_VERSION_CHANGE_PUBLISH{})
	command.Register(C2L_VERSION_CHANGE_SORT, &C2L_M_VERSION_CHANGE_SORT{})
}

type C2L_M_VERSION_ADD struct{}

func (this *C2L_M_VERSION_ADD) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_VersionAdd{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Version().VersionAdd(param.Ver, param.Name)
	return true
}

type C2L_M_VERSION_DELETE struct{}

func (this *C2L_M_VERSION_DELETE) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_VersionDelete{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Version().VersionDelete(param.Vid)
	return true
}

type C2L_M_VERSION_CHANGE_VER struct{}

func (this *C2L_M_VERSION_CHANGE_VER) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_VersionChangeVer{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Version().VersionChangeVer(param.Vid, param.Ver)
	return true
}

type C2L_M_VERSION_CHANGE_NAME struct{}

func (this *C2L_M_VERSION_CHANGE_NAME) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_VersionChangeName{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Version().VersionChangeName(param.Vid, param.Name)
	return true
}

type C2L_M_VERSION_CHANGE_PUBLISH struct{}

func (this *C2L_M_VERSION_CHANGE_PUBLISH) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_VersionChangePublish{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Version().VersionChangePublish(param.Vid, param.Genre, param.DateLine)
	return true
}

type C2L_M_VERSION_CHANGE_SORT struct{}

func (this *C2L_M_VERSION_CHANGE_SORT) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_VersionChangeSort{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Version().VersionChangeSort(param.Vid1, param.Vid2)
	return true
}
