package main

import (
	"encoding/json"

	"github.com/gorilla/websocket"
)

type TemplateManager struct {
	ModeMax int //mode 最大数量
	LinkMax int //link 最大数量
}

func NewTemplateManager() *TemplateManager {
	ob := &TemplateManager{}
	ob.ModeMax = 5
	ob.LinkMax = 50
	return ob
}

func (this *TemplateManager) RegisterFunction() {
	//功能
	command.Register(C2L_TPL_MODE_VIEW, &C2L_M_TPL_MODE_VIEW{})
	command.Register(C2L_TPL_MODE_ADD, &C2L_M_TPL_MODE_ADD{})
	command.Register(C2L_TPL_MODE_EDIT_NAME, &C2L_M_TPL_MODE_EDIT_NAME{})
	command.Register(C2L_TPL_MODE_DELETE, &C2L_M_TPL_MODE_DELETE{})
	//流程
	command.Register(C2L_TPL_LINK_ADD, &C2L_M_TPL_LINK_ADD{})
	command.Register(C2L_TPL_LINK_EDIT_NAME, &C2L_M_TPL_LINK_EDIT_NAME{})
	command.Register(C2L_TPL_LINK_EDIT_DID, &C2L_M_TPL_LINK_EDIT_DID{})
	command.Register(C2L_TPL_LINK_EDIT_SORT, &C2L_M_TPL_LINK_EDIT_SORT{})
	command.Register(C2L_TPL_LINK_DELETE, &C2L_M_TPL_LINK_DELETE{})
}

//获得模板
type C2L_M_TPL_MODE_VIEW struct{}

func (this *C2L_M_TPL_MODE_VIEW) execute(client *websocket.Conn, msg *Message) bool {
	//param := &C2L_TPLModeView{}
	//err := json.Unmarshal([]byte(msg.Param), param)
	//if err != nil {
	//	return false
	//}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Template().TemplateModeView()
	return true
}

//新建 功能
type C2L_M_TPL_MODE_ADD struct{}

func (this *C2L_M_TPL_MODE_ADD) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_TPLModeAdd{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Template().TemplateModeAdd(param)
	return true
}

//编辑mode名称
type C2L_M_TPL_MODE_EDIT_NAME struct{}

func (this *C2L_M_TPL_MODE_EDIT_NAME) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_TPLModeEditName{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Template().TemplateModeEditName(param)
	return true
}

//删除mode
type C2L_M_TPL_MODE_DELETE struct {
}

func (this *C2L_M_TPL_MODE_DELETE) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_TPLModeDelete{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Template().TemplateModeDelete(param)
	return true
}

//增加 流程
type C2L_M_TPL_LINK_ADD struct{}

func (this *C2L_M_TPL_LINK_ADD) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_TPLLinkAdd{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Template().TemplateLinkAdd(param)
	return true
}

//编辑link名称
type C2L_M_TPL_LINK_EDIT_NAME struct{}

func (this *C2L_M_TPL_LINK_EDIT_NAME) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_TPLLinkEditName{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Template().TemplateLinkEditName(param)
	return true
}

//编辑link部门
type C2L_M_TPL_LINK_EDIT_DID struct{}

func (this *C2L_M_TPL_LINK_EDIT_DID) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_TPLLinkEditDid{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Template().TemplateLinkEditDid(param)
	return true
}

//编辑排序
type C2L_M_TPL_LINK_EDIT_SORT struct{}

func (this *C2L_M_TPL_LINK_EDIT_SORT) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_TPLLinkEditSort{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Template().TemplateLinkEditSort(param)
	return true
}

//删除link
type C2L_M_TPL_LINK_DELETE struct {
}

func (this *C2L_M_TPL_LINK_DELETE) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_TPLLinkDelete{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Template().TemplateLinkDelete(param)
	return true
}
