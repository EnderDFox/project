package main

const (
	C2L_SESSION_LOGIN = 10001
	C2L_SAVE_COLLATE  = 11001
	//#
	C2L_PROCESS_VIEW = 50001
	//mode
	C2L_PROCESS_MODE_ADD       = 50011
	C2L_PROCESS_MODE_EDIT      = 50012
	C2L_PROCESS_MODE_COLOR     = 50013
	C2L_PROCESS_MODE_SWAP_SORT = 50014
	C2L_PROCESS_MODE_STORE     = 50015
	C2L_PROCESS_MODE_DELETE    = 50016
	//link
	C2L_PROCESS_LINK_ADD         = 50021
	C2L_PROCESS_LINK_EDIT        = 50022
	C2L_PROCESS_LINK_COLOR       = 50023
	C2L_PROCESS_LINK_SWAP_SORT   = 50024
	C2L_PROCESS_LINK_STORE       = 50025
	C2L_PROCESS_LINK_DELETE      = 50026
	C2L_PROCESS_LINK_USER_CHANGE = 50027
	//work
	C2L_PROCESS_WORK_EDIT   = 50031
	C2L_PROCESS_WORK_STATUS = 50032
	C2L_PROCESS_WORK_SCORE  = 50033
	C2L_PROCESS_WORK_CLEAR  = 50034
	//#
	C2L_COLLATE_VIEW           = 60001
	C2L_COLLATE_STEP_EDIT      = 60002
	C2L_COLLATE_STEP_ADD       = 60003
	C2L_COLLATE_EXTRA_EDIT     = 60004
	C2L_COLLATE_EXTRA_DELETE   = 60005
	C2L_PROFILE_VIEW           = 70001
	C2L_TPL_MODE_VIEW          = 51010
	C2L_TPL_MODE_ADD           = 51011
	C2L_TPL_MODE_EDIT_NAME     = 51012
	C2L_TPL_MODE_DELETE        = 51013
	C2L_TPL_LINK_ADD           = 51021
	C2L_TPL_LINK_EDIT_NAME     = 51022
	C2L_TPL_LINK_EDIT_DID      = 51023
	C2L_TPL_LINK_EDIT_SORT     = 51024
	C2L_TPL_LINK_DELETE        = 51025
	C2L_TPL_LINK_CLONE         = 51026
	C2L_UPLOAD_ADD             = 80001
	C2L_UPLOAD_DELETE          = 80002
	C2L_VERSION_ADD            = 80101
	C2L_VERSION_DELETE         = 80102
	C2L_VERSION_CHANGE_VER     = 80103
	C2L_VERSION_CHANGE_NAME    = 80104
	C2L_VERSION_CHANGE_PUBLISH = 80105
	C2L_VERSION_CHANGE_SORT    = 80106
	C2L_TEST_1                 = 90101
)

type C2L_SessionLogin struct {
	Account string
	Verify  string
	Pid     uint64
}

type C2L_ProcessView struct {
	BeginDate  string
	EndDate    string
	ModeStatus []uint32
	LinkStatus []uint32
}

type C2L_ProcessWorkStatus struct {
	Wid    uint64
	Lid    uint64
	Date   string
	Status uint64
}

type C2L_ProcessWorkClear struct {
	Wid  uint64
	Lid  uint64
	Date string
}

type C2L_ProcessLinkUserChange struct {
	Lid uint64
	Uid uint64
}

type C2L_ProcessLinkSwapSort struct {
	Swap []uint64
}

type C2L_ProcessLinkAdd struct {
	PrevLid   uint64
	Name      string
	ParentLid uint64
}

type C2L_ProcessLinkDelete struct {
	Lid uint64
}

type C2L_ProcessLinkEdit struct {
	Lid  uint64
	Name string
}

type C2L_ProcessWorkEdit struct {
	Wid    uint64
	Lid    uint64
	Date   string
	Tips   string
	MinNum uint64
	MaxNum uint64
	Tag    string
}

type C2L_ProcessModeEdit struct {
	Mid  uint64
	Name string
	Vid  uint64
	Did  uint64
}

type C2L_ProcessModeAdd struct {
	PrevMid uint64
	Name    string
	Vid     uint64
	Did     uint64
	Tmid    uint64
}

type C2L_ProcessModeDelete struct {
	Mid uint64
}

type C2L_ProcessModeColor struct {
	Mid   uint64
	Color uint64
}

type C2L_ProcessLinkColor struct {
	Lid   uint64
	Color uint64
}

type C2L_ProcessWorkScore struct {
	Wid        uint64
	Quality    uint64
	Efficiency uint64
	Manner     uint64
	Info       string
}

type C2L_ProcessModeSwapSort struct {
	Swap []uint64
}

type C2L_ProcessModeStore struct {
	Mid    uint64
	Status uint8 //0:正常  1:归档
}

type C2L_ProcessLinkStore struct {
	Lid    uint64
	Status uint8 //0:正常  1:归档
}

type C2L_ProcessEdit struct {
	Genre    uint64
	DateLine string
}

type C2L_ProcessDelete struct {
	DateLine string
}

type C2L_CollateView struct {
	BeginDate string
	EndDate   string
}

type C2L_CollateStepEdit struct {
	Wid     uint64
	Inspect uint64
}

type C2L_CollateStepAdd struct {
	Name    string
	Date    string
	Uid     uint64
	Inspect uint64
}

type C2L_CollateExtraEdit struct {
	Name    string
	Eid     uint64
	Inspect uint64
}

type C2L_CollateExtraDelete struct {
	Eid uint64
}

type C2L_SaveCollate struct {
	BeginDate string
	EndDate   string
}

type C2L_ProfileView struct {
}

type C2L_VersionAdd struct {
	Ver  string
	Name string
}

type C2L_VersionDelete struct {
	Vid uint64
}

type C2L_VersionChangeVer struct {
	Vid uint64
	Ver string
}

type C2L_VersionChangeName struct {
	Vid  uint64
	Name string
}

type C2L_VersionChangePublish struct {
	Vid      uint64
	Genre    uint32
	DateLine string
}

type C2L_VersionChangeSort struct {
	Vid1 uint64
	Vid2 uint64
}

type C2L_TplModeAdd struct {
	Name string
}
type C2L_TplModeEditName struct {
	Tmid uint64
	Name string
}
type C2L_TplModeDelete struct {
	Tmid uint64
}
type C2L_TplLinkAdd struct {
	Tmid       uint64
	Name       string
	Did        uint64
	ParentTlid uint64
}
type C2L_TplLinkClone struct {
	CopyTlid uint64
}
type C2L_TplLinkEditName struct {
	Tlid uint64
	Name string
}
type C2L_TplLinkEditDid struct {
	Tlid uint64
	Did  uint64
}

type C2L_TplLinkEditSort struct {
	Tmid       uint64
	ParentTlid uint64
	Tlid1      uint64
	Tlid2      uint64
}

type C2L_TplLinkDelete struct {
	Tlid uint64
}

type C2L_UpdateWorkAdd struct {
	Wid    uint64
	TempId uint64
	Kind   uint32
	Name   string
	Data   []byte //文件二进制流
}

type C2L_UpdateWorkDelete struct {
	Wid  uint64
	Fids []uint64
}
