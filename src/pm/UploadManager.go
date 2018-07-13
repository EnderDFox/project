package main

import (
	"encoding/json"
	"log"

	"github.com/gorilla/websocket"
)

//work 上传 附件

type UploadManager struct{}

func NewUploadManager() *UploadManager {
	return &UploadManager{}
}

func (this *UploadManager) RegisterFunction() {
	command.Register(C2L_UPLOAD_ADD, &C2L_M_UPLOAD_ADD{})
	command.Register(C2L_UPLOAD_DELETE, &C2L_M_UPLOAD_DELETE{})
}

//新增功能
type C2L_M_UPLOAD_ADD struct{}

func (this *C2L_M_UPLOAD_ADD) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_UpdateWorkAdd{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		log.Println("C2L_M_UPLOAD_ADD json.Unmarshal err:", err)
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Upload().UploadAdd(param)
	return true
}

type C2L_M_UPLOAD_DELETE struct{}

func (this *C2L_M_UPLOAD_DELETE) execute(client *websocket.Conn, msg *Message) bool {
	param := &C2L_UpdateWorkDelete{}
	err := json.Unmarshal([]byte(msg.Param), param)
	if err != nil {
		// log.Printlog.Println("json.Unmarshal err:", err)
		return false
	}
	user := session.GetUser(msg.Uid)
	if user == nil {
		return false
	}
	user.Upload().UploadDelete(param)
	return true
}
