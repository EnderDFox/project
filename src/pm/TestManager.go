package main

import "github.com/gorilla/websocket"

type TestManager struct {
}

func NewTestManager() *TestManager {
	ob := &TestManager{}
	return ob
}

func (this *TestManager) RegisterFunction() {
	command.Register(C2L_TEST_1, &C2L_M_TEST_1{})
}

type C2L_M_TEST_1 struct{}

func (this *C2L_M_TEST_1) execute(client *websocket.Conn, msg *Message) bool {
	// common.ProjectModeSort2Sort()
	// common.ModeLinkSort2Sort()
	// common.TplLinkSort2Sort()
	// test_manager.InsertSort()
	this.Test1()
	return true
}

func (this *C2L_M_TEST_1) Test1() {
	stmt, err := db.GetDb().Prepare(`UPDATE pm.pm_version SET name = 'aa' WHERE vid=122`)
	defer stmt.Close()
	db.CheckErr(err)
	_, err = stmt.Exec()
	db.CheckErr(err)
}
