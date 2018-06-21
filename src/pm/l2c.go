package main

const (
	L2C_SESSION_LOGIN          = 10001
	L2C_USER_LIST              = 10002
	L2C_DEPARTMENT_LIST        = 10003
	L2C_SAVE_COLLATE           = 11001
	L2C_SESSION_LOGIN_ERROR    = 20001
	//#
	L2C_PROCESS_VIEW           = 50001
	//mode
	L2C_PROCESS_MODE_ADD       = 50011
	L2C_PROCESS_MODE_EDIT      = 50012
	L2C_PROCESS_MODE_COLOR     = 50013
	L2C_PROCESS_MODE_SWAP_SORT      = 50014
	L2C_PROCESS_MODE_STORE     = 50015
	L2C_PROCESS_MODE_DELETE    = 50016
	//link
	L2C_PROCESS_LINK_ADD       = 50021
	L2C_PROCESS_LINK_EDIT      = 50022
	L2C_PROCESS_LINK_COLOR     = 50023
	L2C_PROCESS_LINK_SWAP_SORT      = 50024
	L2C_PROCESS_LINK_STORE     = 50025
	L2C_PROCESS_LINK_DELETE    = 50026
	L2C_PROCESS_LINK_USER_CHANGE    = 50027
	//work
	L2C_PROCESS_WORK_EDIT      = 50031
	L2C_PROCESS_WORK_STATUS    = 50032
	L2C_PROCESS_WORK_SCORE     = 50033
	L2C_PROCESS_WORK_CLEAR     = 50034
	//
	L2C_PROCESS_SCORE_NOTICE   = 51001
	//#
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
	L2C_VERSION_CHANGE_SORT    = 80106
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
	Project     *ProjectSingle
	VersionList []*VersionSingle
}

type L2C_CollateView struct {
	ModeList    []*ModeSingle
	LinkList    []*LinkSingle
	WorkList    []*WorkSingle
	TagsList    []*TagSingle
	ExtraList   []*ExtraSingle
	VersionList []*VersionSingle
}

type L2C_ProfileView struct {
	TagsList    []*TagSingle
	ProfileList []*ProfileSingle
}

type L2C_ProcessWorkClear struct {
	Wid uint64
}

type L2C_ProcessLinkSwapSort struct {
	Swap []uint64
}

type L2C_ProcessLinkAdd struct {
	PrevLid    uint64
	LinkSingle *LinkSingle
}

type L2C_ProcessLinkDelete struct {
	Lid uint64
}

type L2C_ProcessModeAdd struct {
	PrevMid    uint64
	ModeSingle *ModeSingle
	LinkList   []*LinkSingle
}

type L2C_ProcessModeDelete struct {
	Mid uint64
}

type L2C_ProcessModeSwapSort struct {
	Swap []uint64
}

type L2C_ProcessModeStore struct {
	Mid    uint64
	Status uint8 //0:正常  1:归档
}

type L2C_ProcessLinkStore struct {
	Lid    uint64
	Status uint8 //0:正常  1:归档
}

type L2C_ProcessPublishEdit struct {
	Genre    uint64
	DateLine string
}

type L2C_ProcessPublishDelete struct {
	DateLine string
}

type L2C_VersionAdd struct {
	VersionSingle *VersionSingle
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

type L2C_TplModeView struct {
	Modes []*TplModeSingle
}

type L2C_TplModeAdd struct {
	Tmid uint64
	Name string
}

type L2C_TplModeEditName struct {
	Tmid uint64
	Name string
}

type L2C_TplModeDelete struct {
	Tmid uint64
}

type L2C_TplLinkAdd struct {
	Tlid uint64
	Tmid uint64
	Name string
	Did  uint64
}

type L2C_TplLinkEditName struct {
	Tlid uint64
	Name string
}

type L2C_TplLinkEditDid struct {
	Tlid uint64
	Did  uint64
}
type L2C_TplLinkEditSort struct {
	Tmid  uint64
	Tlid1 uint64
	Tlid2 uint64
}
type L2C_TplLinkDelete struct {
	Tlid uint64
}

type L2C_UpdateWorkAdd struct {
	Wid        uint64
	TempId     uint64
	Fid        uint64
	Kind       uint32
	Name       string
	CreateTime uint32
}

type L2C_UpdateWorkDelete struct {
	Wid  uint64
	Fids []uint64
}
