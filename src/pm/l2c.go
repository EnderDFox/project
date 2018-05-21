package main

const (
	L2C_SESSION_LOGIN          = 10001
	L2C_USER_LIST              = 10002
	L2C_DEPARTMENT_LIST        = 10003
	L2C_SAVE_COLLATE           = 11001
	L2C_SESSION_LOGIN_ERROR    = 20001
	L2C_PROCESS_VIEW           = 50001
	L2C_PROCESS_GRID_CHANGE    = 50002
	L2C_PROCESS_GRID_CLEAR     = 50003
	L2C_PROCESS_USER_CHANGE    = 50004
	L2C_PROCESS_GRID_SWAP      = 50005
	L2C_PROCESS_GRID_ADD       = 50006
	L2C_PROCESS_LINK_DELETE    = 50007
	L2C_PROCESS_LINK_EDIT      = 50008
	L2C_PROCESS_WORK_EDIT      = 50009
	L2C_PROCESS_MODE_EDIT      = 50010
	L2C_PROCESS_MODE_ADD       = 50011
	L2C_PROCESS_MODE_DELETE    = 50012
	L2C_PROCESS_MODE_COLOR     = 50013
	L2C_PROCESS_SCORE_EDIT     = 50014
	L2C_PROCESS_MODE_MOVE      = 50015
	L2C_PROCESS_MODE_STORE     = 50016
	L2C_PROCESS_LINK_COLOR     = 50017
	L2C_PROCESS_LINK_STORE     = 50018
	L2C_PROCESS_PUBLISH_EDIT   = 50019
	L2C_PROCESS_PUBLISH_DELETE = 50020
	L2C_PROCESS_SCORE_NOTICE   = 51001
	L2C_COLLATE_VIEW           = 60001
	L2C_COLLATE_STEP_EDIT      = 60002
	L2C_COLLATE_STEP_ADD       = 60003
	L2C_COLLATE_EXTRA_EDIT     = 60004
	L2C_COLLATE_EXTRA_DELETE   = 60005
	L2C_PROFILE_VIEW           = 70001
	L2C_TPL_MODE_VIEW          = 51010
	L2C_TPL_MODE_ADD           = 51011
	L2C_TPL_MODE_EDIT_NAME     = 51012
	L2C_TPL_MODE_DELETE        = 51013
	L2C_TPL_LINK_ADD           = 51021
	L2C_TPL_LINK_EDIT_NAME     = 51022
	L2C_TPL_LINK_EDIT_DID      = 51023
	L2C_TPL_LINK_EDIT_SORT     = 51024
	L2C_TPL_LINK_DELETE        = 51025
	L2C_UPLOAD_ADD             = 80001
	L2C_UPLOAD_DELETE          = 80002
	L2C_VERSION_ADD            = 80101
	L2C_VERSION_DELETE         = 80102
	L2C_VERSION_CHANGE_VER     = 80103
	L2C_VERSION_CHANGE_NAME    = 80104
	L2C_VERSION_CHANGE_PUBLISH = 80105
)

type L2C_SessionLogin struct {
	Uid         uint64
	Pid         uint64
	Gid         uint64
	Did         uint64
	Name        string
	Vip         uint64
	Is_del      uint64
	Rtx_name    string
	Rtx_account string
	Rtx_group   string
	Reg_time    uint64
	Login_count uint64
	Login_time  uint64
	IsWrite     bool
}

type L2C_LoginError struct {
}

type L2C_UserList struct {
	List []*UserSingle
}

type L2C_DepartmentList struct {
	List []*DepartmentSingle
}

type L2C_CollateExtraDelete struct {
	Eid uint64
}

type L2C_SaveCollate struct {
	Path string
}

type L2C_ProcessScoreNotice struct {
	List []*ScoreNoticeSingle
}

type L2C_ProcessView struct {
	ModeList    []*ModeSingle
	LinkList    []*LinkSingle
	WorkList    []*WorkSingle
	ScoreList   []*ScoreSingle
	VerList     []*VerSingle
	Project     *ProjectSingle
	VersionList []*VersionSingle
}

type L2C_CollateView struct {
	ModeList  []*ModeSingle
	LinkList  []*LinkSingle
	WorkList  []*WorkSingle
	TagsList  []*TagSingle
	ExtraList []*ExtraSingle
	VerList   []*VerSingle
}

type L2C_ProfileView struct {
	TagsList    []*TagSingle
	ProfileList []*ProfileSingle
}

type L2C_ProcessGridClear struct {
	Wid uint64
}

type L2C_ProcessGridSwap struct {
	Swap       []uint64
	Dir        string
	ModeSingle *ModeSingle
}

type L2C_ProcessGridAdd struct {
	Lid        uint64
	LinkSingle *LinkSingle
	ModeSingle *ModeSingle
}

type L2C_ProcessLinkDelete struct {
	Lid        uint64
	ModeSingle *ModeSingle
}

type L2C_ProcessModeAdd struct {
	Mid        uint64
	ModeSingle *ModeSingle
	LinkList   []*LinkSingle
}

type L2C_ProcessModeDelete struct {
	Mid           uint64
	ProjectSingle *ProjectSingle
}

type L2C_ProcessModeMove struct {
	Swap          []uint64
	Dir           string
	ProjectSingle *ProjectSingle
}

type L2C_ProcessModeStore struct {
	Mid uint64
}

type L2C_ProcessLinkStore struct {
	Lid uint64
}

type L2C_ProcessPublishEdit struct {
	Genre    uint64
	DateLine string
}

type L2C_ProcessPublishDelete struct {
	DateLine string
}

type L2C_VersionAdd struct {
	Vid  uint64
	Ver  string
	Name string
}

type L2C_VersionDelete struct {
	Vid uint64
}

type L2C_VersionChangeVer struct {
	Vid uint64
	Ver string
}

type L2C_VersionChangeName struct {
	Vid  uint64
	Name string
}

type L2C_VersionChangePublish struct {
	Vid      uint64
	Genre    uint32
	DateLine string
}
