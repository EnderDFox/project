package main

import "github.com/gorilla/websocket"

type CMD interface {
	execute(client *websocket.Conn, msg *Message) bool
}

type Command struct {
	List map[uint64]CMD
}

func NewCommand() *Command {
	instance := &Command{}
	instance.List = make(map[uint64]CMD)
	return instance
}

//注册
func (this *Command) Register(cid uint64, cmd CMD) {
	this.List[cid] = cmd
}

//数据分发
func (this *Command) Disptch(pack *PackMsg) bool {
	msg := pack.Data
	cmd, ok := this.List[msg.Cid]
	if !ok {
		return false
	}
	cmd.execute(pack.Client, pack.Data)
	return true
}
