package main

//=======================通讯数据结构=======================
type C2L_Message struct {
	Cid  uint64
	Uid  uint64
	Data interface{}
}

type L2C_Message struct {
	Cid  uint64
	Uid  uint64
	Data interface{}
	Ret  uint64
}

//=======================业务数据结构=======================

type UserSingle struct {
	Uid    uint64
	Did    uint64
	Name   string
	IsDel  uint64
	IsHide uint64
}

type DepartmentSingle struct {
	Did  uint64
	Name string
	Fid  uint64
}

type ScoreNoticeSingle struct {
	Wid   uint64
	Lid   uint64
	Date  string
	Uid   uint64
	Mid   uint64
	Lname string
	Did   uint64
	Mname string
	Ver   string
}

type ModeSingle struct {
	Mid      uint64
	Vid      uint64
	Ver      string
	Name     string
	Color    uint64
	LinkSort []string
	Did      uint64
	Status   uint64
}

type TagSingle struct {
	Tag  string
	Info string
}

type LinkSingle struct {
	Lid    uint64
	Mid    uint64
	Uid    uint64
	Name   string
	Color  uint64
	Status uint64
}

type WorkSingle struct {
	Wid      uint64
	Lid      uint64
	Status   uint64
	Date     string
	Tips     string
	MinNum   uint64
	MaxNum   uint64
	Tag      string
	Inspect  uint64
	FileList []*FileSingle
}

type ProfileSingle struct {
	MName   string
	LName   string
	Date    string
	Tips    string
	Status  uint64
	Inspect uint64
	MinNum  uint64
	MaxNum  uint64
	Tag     string
	Ver     string
}

type ProjectSingle struct {
	Pid      uint64
	Name     string
	ModeSort []string
}

type VerSingle struct {
	Genre    uint64
	DateLine string
}

type ExtraSingle struct {
	Eid     uint64
	Uid     uint64
	Date    string
	Name    string
	Inspect uint64
}

type ScoreSingle struct {
	Wid        uint64
	Info       string
	Quality    uint64
	Efficiency uint64
	Manner     uint64
}

type VersionSingle struct {
	Vid         uint64
	Ver         string
	Name        string
	PublishList []*PublishSingle
}

type PublishSingle struct {
	Vid      uint64
	Genre    uint64
	DateLine string
}
