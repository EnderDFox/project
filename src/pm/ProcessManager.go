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
	command.Register(C2L_PROCESS_MODE_ADD, &C2L_M_PROCESS_MODE_ADD{})
	command.Register(C2L_PROCESS_MODE_EDIT, &C2L_M_PROCESS_MODE_EDIT{})
	command.Register(C2L_PROCESS_MODE_COLOR, &C2L_M_PROCESS_MODE_COLOR{})
	command.Register(C2L_PROCESS_MODE_SWAP_SORT, &C2L_M_PROCESS_MODE_SWAP_SORT{})
	command.Register(C2L_PROCESS_MODE_STORE, &C2L_M_PROCESS_MODE_STORE{})
	command.Register(C2L_PROCESS_MODE_DELETE, &C2L_M_PROCESS_MODE_DELETE{})
	command.Register(C2L_PROCESS_LINK_ADD, &C2L_M_PROCESS_LINK_ADD{})
	command.Register(C2L_PROCESS_LINK_EDIT, &C2L_M_PROCESS_LINK_EDIT{})
	command.Register(C2L_PROCESS_LINK_COLOR, &C2L_M_PROCESS_LINK_COLOR{})
	command.Register(C2L_PROCESS_LINK_SWAP_SORT, &C2L_M_PROCESS_LINK_SWAP_SORT{})
	command.Register(C2L_PROCESS_LINK_STORE, &C2L_M_PROCESS_LINK_STORE{})
	command.Register(C2L_PROCESS_LINK_DELETE, &C2L_M_PROCESS_LINK_DELETE{})
	command.Register(C2L_PROCESS_LINK_USER_CHANGE, &C2L_M_PROCESS_LINK_USER_CHANGE{})
	command.Register(C2L_PROCESS_WORK_EDIT, &C2L_M_PROCESS_WORK_EDIT{})
	command.Register(C2L_PROCESS_WORK_STATUS, &C2L_M_PROCESS_WORK_STATUS{})
	command.Register(C2L_PROCESS_WORK_SCORE, &C2L_M_PROCESS_WORK_SCORE{})
	command.Register(C2L_PROCESS_WORK_CLEAR, &C2L_M_PROCESS_WORK_CLEAR{})
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
type C2L_M_PROCESS_MODE_SWAP_SORT struct{}

func (this *C2L_M_PROCESS_MODE_SWAP_SORT) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_ProcessModeSwapSort{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Process().ModeSwapSort(param.Swap)
	return true
}

//评分
type C2L_M_PROCESS_WORK_SCORE struct{}

func (this *C2L_M_PROCESS_WORK_SCORE) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_ProcessWorkScore{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Process().WorkScore(param.Wid, param.Quality, param.Efficiency, param.Manner, param.Info)
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
type C2L_M_PROCESS_LINK_ADD struct{}

func (this *C2L_M_PROCESS_LINK_ADD) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_ProcessLinkAdd{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Process().LinkAdd(param.Lid, param.Name)
	return true
}

//交换
type C2L_M_PROCESS_LINK_SWAP_SORT struct{}

func (this *C2L_M_PROCESS_LINK_SWAP_SORT) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_ProcessLinkSwapSort{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Process().LinkSwapSort(param.Swap)
	return true
}

//改用户
type C2L_M_PROCESS_LINK_USER_CHANGE struct{}

func (this *C2L_M_PROCESS_LINK_USER_CHANGE) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_ProcessLinkUserChange{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Process().LinkUserChange(param.Lid, param.Uid)
	return true
}

//清理
type C2L_M_PROCESS_WORK_CLEAR struct{}

func (this *C2L_M_PROCESS_WORK_CLEAR) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_ProcessWorkClear{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Process().WorkClear(param.Lid, param.Date)
	return true
}

//状态
type C2L_M_PROCESS_WORK_STATUS struct{}

func (this *C2L_M_PROCESS_WORK_STATUS) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_ProcessWorkStatus{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Process().WorkStatus(param.Lid, param.Date, param.Status)
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
