package main

import (
	"encoding/json"

	"github.com/gorilla/websocket"
)

type CollateManager struct{}

func NewCollateManager() *CollateManager {
	return &CollateManager{}
}

func (this *CollateManager) RegisterFunction() {
	command.Register(C2L_COLLATE_VIEW, &C2L_M_COLLATE_VIEW{})
	command.Register(C2L_COLLATE_STEP_EDIT, &C2L_M_COLLATE_STEP_EDIT{})
	command.Register(C2L_COLLATE_STEP_ADD, &C2L_M_COLLATE_STEP_ADD{})
	command.Register(C2L_COLLATE_EXTRA_EDIT, &C2L_M_COLLATE_EXTRA_EDIT{})
	command.Register(C2L_COLLATE_EXTRA_DELETE, &C2L_M_COLLATE_EXTRA_DELETE{})
}

//编辑
type C2L_M_COLLATE_EXTRA_DELETE struct{}

func (this *C2L_M_COLLATE_EXTRA_DELETE) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_CollateExtraDelete{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Collate().ExtraDelete(param.Eid)
	return true
}

//编辑
type C2L_M_COLLATE_EXTRA_EDIT struct{}

func (this *C2L_M_COLLATE_EXTRA_EDIT) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_CollateExtraEdit{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Collate().ExtraEdit(param.Eid, param.Inspect, param.Name)
	return true
}

//增加
type C2L_M_COLLATE_STEP_ADD struct{}

func (this *C2L_M_COLLATE_STEP_ADD) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_CollateStepAdd{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Collate().StepAdd(param.Date, param.Uid, param.Name, param.Inspect)
	return true
}

//编辑
type C2L_M_COLLATE_STEP_EDIT struct{}

func (this *C2L_M_COLLATE_STEP_EDIT) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_CollateStepEdit{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Collate().StepEdit(param.Wid, param.Inspect)
	return true
}

//预览
type C2L_M_COLLATE_VIEW struct{}

func (this *C2L_M_COLLATE_VIEW) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_CollateView{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Collate().View(param.BeginDate, param.EndDate)
	return true
}
