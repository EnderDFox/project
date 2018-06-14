package main

import (
	"encoding/json"
	"log"

	"github.com/gorilla/websocket"
)

type ProcessManager struct{}

func NewProcessManager() *ProcessManager {
	return &ProcessManager{}
}

func (this *ProcessManager) RegisterFunction() {
	command.Register(C2L_PROCESS_VIEW, &C2L_M_PROCESS_VIEW{})
	command.Register(C2L_PROCESS_GRID_CHANGE, &C2L_M_PROCESS_GRID_CHANGE{})
	command.Register(C2L_PROCESS_GRID_CLEAR, &C2L_M_PROCESS_GRID_CLEAR{})
	command.Register(C2L_PROCESS_USER_CHANGE, &C2L_M_PROCESS_USER_CHANGE{})
	command.Register(C2L_PROCESS_GRID_SWAP, &C2L_M_PROCESS_GRID_SWAP{})
	command.Register(C2L_PROCESS_GRID_ADD, &C2L_M_PROCESS_GRID_ADD{})
	command.Register(C2L_PROCESS_LINK_DELETE, &C2L_M_PROCESS_LINK_DELETE{})
	command.Register(C2L_PROCESS_LINK_EDIT, &C2L_M_PROCESS_LINK_EDIT{})
	command.Register(C2L_PROCESS_WORK_EDIT, &C2L_M_PROCESS_WORK_EDIT{})
	command.Register(C2L_PROCESS_MODE_EDIT, &C2L_M_PROCESS_MODE_EDIT{})
	command.Register(C2L_PROCESS_MODE_ADD, &C2L_M_PROCESS_MODE_ADD{})
	command.Register(C2L_PROCESS_MODE_DELETE, &C2L_M_PROCESS_MODE_DELETE{})
	command.Register(C2L_PROCESS_MODE_COLOR, &C2L_M_PROCESS_MODE_COLOR{})
	command.Register(C2L_PROCESS_SCORE_EDIT, &C2L_M_PROCESS_SCORE_EDIT{})
	command.Register(C2L_PROCESS_MODE_MOVE, &C2L_M_PROCESS_MODE_MOVE{})
	command.Register(C2L_PROCESS_MODE_STORE, &C2L_M_PROCESS_MODE_STORE{})
	command.Register(C2L_PROCESS_LINK_COLOR, &C2L_M_PROCESS_LINK_COLOR{})
	command.Register(C2L_PROCESS_LINK_STORE, &C2L_M_PROCESS_LINK_STORE{})
}

//归档
type C2L_M_PROCESS_LINK_STORE struct{}

func (this *C2L_M_PROCESS_LINK_STORE) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_ProcessLinkStore{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Process().LinkStore(param.Lid, param.Status)
	return true
}

//归档
type C2L_M_PROCESS_MODE_STORE struct{}

func (this *C2L_M_PROCESS_MODE_STORE) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_ProcessModeStore{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Process().ModeStore(param.Mid, param.Status)
	return true
}

//移动
type C2L_M_PROCESS_MODE_MOVE struct{}

func (this *C2L_M_PROCESS_MODE_MOVE) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_ProcessModeMove{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Process().ModeMove(param.Swap)
	return true
}

//评分
type C2L_M_PROCESS_SCORE_EDIT struct{}

func (this *C2L_M_PROCESS_SCORE_EDIT) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_ProcessScoreEdit{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Process().ScoreEdit(param.Wid, param.Quality, param.Efficiency, param.Manner, param.Info)
	return true
}

//颜色
type C2L_M_PROCESS_LINK_COLOR struct{}

func (this *C2L_M_PROCESS_LINK_COLOR) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_ProcessLinkColor{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Process().LinkColor(param.Lid, param.Color)
	return true
}

//颜色
type C2L_M_PROCESS_MODE_COLOR struct{}

func (this *C2L_M_PROCESS_MODE_COLOR) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_ProcessModeColor{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Process().ModeColor(param.Mid, param.Color)
	return true
}

//删除
type C2L_M_PROCESS_MODE_DELETE struct{}

func (this *C2L_M_PROCESS_MODE_DELETE) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_ProcessModeDelete{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Process().ModeDelete(param.Mid)
	return true
}

//插入
type C2L_M_PROCESS_MODE_ADD struct{}

func (this *C2L_M_PROCESS_MODE_ADD) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_ProcessModeAdd{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Process().ModeAdd(param.PrevMid, param.Name, param.Vid, param.Did, param.Tmid)
	return true
}

//编辑
type C2L_M_PROCESS_MODE_EDIT struct{}

func (this *C2L_M_PROCESS_MODE_EDIT) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_ProcessModeEdit{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		log.Println(`err unmarshal:`, err)
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		log.Println(`err user:`, err)
		return false
	}
	user.Process().ModeEdit(param.Mid, param.Name, param.Vid)
	return true
}

//编辑
type C2L_M_PROCESS_WORK_EDIT struct{}

func (this *C2L_M_PROCESS_WORK_EDIT) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_ProcessWorkEdit{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Process().WorkEdit(param.Lid, param.MinNum, param.MaxNum, param.Date, param.Tips, param.Tag)
	return true
}

//编辑
type C2L_M_PROCESS_LINK_EDIT struct{}

func (this *C2L_M_PROCESS_LINK_EDIT) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_ProcessLinkEdit{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Process().LinkEdit(param.Lid, param.Name)
	return true
}

//删除
type C2L_M_PROCESS_LINK_DELETE struct{}

func (this *C2L_M_PROCESS_LINK_DELETE) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_ProcessLinkDelete{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Process().LinkDelete(param.Lid)
	return true
}

//添加
type C2L_M_PROCESS_GRID_ADD struct{}

func (this *C2L_M_PROCESS_GRID_ADD) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_ProcessGridAdd{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Process().GridAdd(param.Lid, param.Name)
	return true
}

//交换
type C2L_M_PROCESS_GRID_SWAP struct{}

func (this *C2L_M_PROCESS_GRID_SWAP) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_ProcessGridSwap{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Process().GridSwap(param.Swap)
	return true
}

//改用户
type C2L_M_PROCESS_USER_CHANGE struct{}

func (this *C2L_M_PROCESS_USER_CHANGE) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_ProcessUserChange{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Process().UserChange(param.Lid, param.Uid)
	return true
}

//清理
type C2L_M_PROCESS_GRID_CLEAR struct{}

func (this *C2L_M_PROCESS_GRID_CLEAR) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_ProcessGridClear{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Process().GridClear(param.Lid, param.Date)
	return true
}

//状态
type C2L_M_PROCESS_GRID_CHANGE struct{}

func (this *C2L_M_PROCESS_GRID_CHANGE) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_ProcessGridChange{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Process().GridChange(param.Lid, param.Date, param.Status)
	return true
}

//预览
type C2L_M_PROCESS_VIEW struct{}

func (this *C2L_M_PROCESS_VIEW) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_ProcessView{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Process().View(param.BeginDate, param.EndDate)
	return true
}
