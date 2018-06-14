package main

import (
	"fmt"
)

type DbMsg struct {
	Type uint64
	Data interface{}
}

type DbSave struct {
	Broadcast chan *DbMsg
}

func NewDbSave() *DbSave {
	instance := &DbSave{}
	instance.Broadcast = make(chan *DbMsg)
	return instance
}

//写入通道
func (this *DbSave) WriteChan() {
	msg := &DbMsg{}
	msg.Data = "xxxxx"
	msg.Type = 100
	this.Broadcast <- msg
}

//读取通道
func (this *DbSave) ReadChan() {
	for {
		msg := <-this.Broadcast
		fmt.Println(msg)
	}
}
