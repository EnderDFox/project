// pm project main.go
package main

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

type Message struct {
	Cid   uint64 `json:"Cid"`
	Uid   uint64 `json:"Uid"`
	Param string `json:"Param"`
}

type PackMsg struct {
	Data   *Message
	Client *websocket.Conn
}

var (
	broadcast = make(chan PackMsg)
	upgrader  = websocket.Upgrader{}
	command   = NewCommand()
	session   = NewSession()
	dispather = NewDispather()
	config    = NewConfig()
	timer     = NewTimer()
	db        = NewDb()
)

func main() {
	//mysql服务器
	if db.IsOk() {
		log.Println("MySql Connect Success")
	}
	//定时器
	go timer.Run()

	//wb服务器
	http.Handle("/", http.FileServer(http.Dir(config.Web)))
	//http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./web/upload/"))))
	log.Println("Web Server Is Success")
	//ws服务器
	http.HandleFunc("/ws", handleConnections)
	log.Println("Web Socket Is Success")
	//注册函数
	dispather.Retister()
	//写回通道
	go handleMessages()
	//开启监听
	err := http.ListenAndServe(config.Ws.Host+":"+config.Ws.Port, nil)
	if err != nil {
		log.Println("ListenAndServe", err)
	}
}

//客户端链接处理
func handleConnections(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("handleConnections", err)
	}
	defer ws.Close()
	for {
		msg := Message{}
		err := ws.ReadJSON(&msg)
		if err != nil {
			log.Println("Client is Close", err)
			break
		}
		pack := PackMsg{}
		pack.Data = &msg
		pack.Client = ws
		broadcast <- pack
	}
}

//数据通道读取
func handleMessages() {
	for {
		pack := <-broadcast
		command.Disptch(&pack)
	}
}
