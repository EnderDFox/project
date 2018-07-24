//一些枚举需要提前写
type int = number
type int32 = number
type int64 = number
type uint = number
type uint32 = number
type uint64 = number
type char = string

/**
 * 网址参数使用的key
 */
class URL_PARAM_KEY {
    static UID = 'uid'
    static PID = 'pid'
    static PAGE = 'page'
    static DID = 'did'
    /**search key */
    static FKEY = 'fkey'
}

//项目id  pm_project.pid
enum PidFeild {
    AGAME = 1,
}
//# 数据库中的字段
/**db.manager.department.did*/
enum DidField {
    VERSION = 0,    //版本
    ALL = -1,       //全部
    DESIGN = 1,     //策划
    ART = 2,        //美术
    CLIENT = 4,     //前端
    SERVER = 5,     //后端
    QA = 6,         //质检
    SUPERVISOR = 14, //监修
    TOOL = 16,       //工具
    SUPERVISOR_ART = 101,   //美监
}
/**db.pm.publish.genre*/
enum GenreField {
    // '开始', '完结', '封存', '延期', '发布', '总结'
    BEGIN = 1,
    END = 2,
    SEAL = 3,
    DELAY = 4,
    PUB = 5,
    SUMMARY = 6,
}

// 0:工作 3:完成 1:延期 2:等待 4:休假 5:优化
enum WorkStatusField {
    WORK = 0,
    FINISH = 3,
    DELAY = 1,
    WAIT = 2,
    REST = 4,
    OPTIMIZE = 5,
    COMPLETE = 6,
    SUBMIT = 7,
    MODIFY = 8,
    PASS = 9,
}
//mode/link  0:正常  1:归档
enum ModeStatusField {
    NORMAL = 0,
    STORE = 1,
}
enum LinkStatusField {
    NORMAL = 0,
    STORE = 1,
}

//# const

class FieldName {
    static PID = "Pid"
    static Uid = "Uid"
    static Did = "Did"
    static Posnid = "Posnid"
    static Authid = "Authid"
    static Mid = "Mid"
    static Lid = "Lid"
    static Tmid = "Tmid"
    static Tlid = "Tlid"
    static Name = "Name"
}


//===data struck
interface IXY {
    x: number
    y: number
}

interface UserSingle {
    Uid?: number
    Pid?: PidFeild
    Did?: DidField
    Posnid?: DidField
    Name?: string
    IsDel?: number
    IsHide?: number
    Sort?: number
}

interface ProjectSingle {
    Pid?: number
    Name?: string
    CreateTime?: number
    //负责人id
    MasterUid?: number
    //client cache data
    DeptTree?: DepartmentSingle[]
    UserList?: UserSingle[]
    ModeList?: ModeSingle[]
}

interface DepartmentSingle {
    Did?: DidField
    Pid?: PidFeild
    Fid?: DidField//上级部门
    Name?: string
    Sort?: number
    //client
    Depth?: number
    Children?: DepartmentSingle[]
    PosnList?: PositionSingle[]
}

interface PositionSingle {
    Posnid?: int
    Did?: DidField
    Name?: string
    AuthList?: AuthSingle[]
    //client
    UserList?: UserSingle[]
}
interface AuthModSingle {
    Modid?: int
    Name?: string
    AuthList?: AuthSingle[]
    Description?: string //dsc/descr
    //client
    CheckedChange?: boolean
}
interface AuthSingle {
    Authid?: int
    Modid?: int
    Name?: string
    Description?: string //dsc/descr
    Sort?: number
    //client
    CheckedChange?: boolean
}

interface DepartmentInfo {
    info?: DepartmentSingle
    list?: DepartmentInfo[]//子部门
    user?: UserSingle[]
}


interface ModeSingle {
    Mid?: number
    Vid?: number
    Name?: string
    Color?: uint32
    Did?: DidField
    Status?: ModeStatusField
    //client temp data
    LinkList?: LinkSingle[]
}

interface LinkSingle {
    Lid?: number
    Mid?: number
    Uid?: number
    Name?: string
    Color?: number
    Status?: LinkStatusField
    Sort?: number
    Children?: LinkSingle[]
    ParentLid?: number
}

interface WorkSingle {
    Wid?: number
    Lid?: number
    Status?: WorkStatusField
    Date?: string
    Tips?: string
    MinNum?: number
    MaxNum?: number
    Tag?: string
    Inspect?: number
    FileList?: FileSingle[]
    //
    uploading?: boolean  //是否正在上传
}

interface ScoreSingle {
    Wid?: number
    Info?: string
    Quality?: number
    Efficiency?: number
    Manner?: number
}

interface FileSingle {
    Wid?: number
    TempId?: number //为了vue过渡的key
    state?: UploadItemState
    src?: string    //已上传则这个值是url(缩略图) 没上传则这个值是base64
    srcOri?: string    //已上传则这个值是url(原图) 没上传则没有这个值(因为base64无法预览)
    Fid?: number     //仅已上传时可用, 是pm_file.fid
    Kind?: number
    CreateTime?: number  //仅已上传时可用, 是创建时间
    Name?: string
    buffer?: any[]  //二进制数据
}

interface VersionSingle {
    Vid?: number
    Ver?: string
    Name?: string
    Sort?: uint32
    PublishList?: PublishSingle[]
}

interface PublishSingle {
    Vid?: number
    Genre?: uint32
    DateLine?: string
    ErrorMsg?: string
    SubDayCount?: uint32
}

interface ProcessFilterPack {
    BeginDate: string
    EndDate: string
    ModeName: string
    Vid: number
    ModeStatus: number
    LinkStatus: number
    LinkName: string
    LinkUserName: string

}
interface ScoreNoticeSingle {
    Wid: number
    Lid: number
    Date: string
    Uid: number
    Mid: number
    Lname: string
    Did: number
    Mname: string
    Vid: number
}
interface L2C_SessionLogin {
    Uid?: uint64
    Gid?: uint64
    Did?: uint64
    Name?: string
    Vip?: uint64
    Is_del?: uint64
    Rtx_name?: string
    Rtx_account?: string
    Rtx_group?: string
    Reg_time?: uint64
    Login_count?: uint64
    Login_time?: uint64
    IsWrite?: boolean
}
interface L2C_ProfileView {
    ProfileList: ProfileSingle[]
    TagsList: TagSingle[]
}
interface ProfileSingle {
    MName: string
    LName: string
    Date: string
    Tips: string
    Status: number
    Inspect: number
    MinNum: number
    MaxNum: number
    Tag: string
    Vid: number
}
interface TagSingle {
    Tag: string
    Info: string
}


interface L2C_CollateView {
    ModeList?: ModeSingle[]
    LinkList?: LinkSingle[]
    WorkList?: WorkSingle[]
    TagsList?: TagSingle[]
    ExtraList?: ExtraSingle[]
    VersionList?: VersionSingle[]
}

interface L2C_CollateExtraDelete {
    Eid?: number
}

interface ExtraSingle {
    Eid?: number
    Uid?: number
    Date?: string
    Name?: string
    Inspect?: number
}

interface IDateBeginAndEnd {
    BeginDate?: string
    EndDate?: string
}

interface IDateItem {
    s?: string
    m?: string
    d?: string
    y?: number
    w?: number
}
interface IWorkGrid extends IDateItem {
    lid?: number
    wid?: number
}

interface C2L_ProcessView {
    BeginDate?: string
    EndDate?: string
    ModeStatus?: uint32[]
    LinkStatus?: uint32[]
}

interface L2C_ProcessView {
    ModeList: ModeSingle[]
    LinkList: LinkSingle[]
    WorkList: WorkSingle[]
    ScoreList: ScoreSingle[]
    Project: ProjectSingle
    VersionList: VersionSingle[]
}


interface C2L_ProcessWorkEdit {
    Wid?: number
    Lid?: number
    Date?: string
    Tips?: string
    MinNum?: number
    MaxNum?: number
    Tag?: string
}

interface C2L_ProcessLinkAdd {
    PrevLid?: number
    Name?: string
    ParentLid?: number
}
interface C2L_ProcessLinkEdit {
    Lid?: number
    Name?: string
}


interface L2C_ProcessLinkDelete {
    Lid?: uint64
}

interface L2C_ProcessLinkAdd {
    PrevLid?: uint64
    LinkSingle?: LinkSingle
}

interface L2C_ProcessLinkSwapSort {
    Swap?: uint64[]
}

interface L2C_ProcessWorkClear {
    Wid?: uint64
}


interface L2C_ProcessModeAdd {
    PrevMid?: uint64
    ModeSingle?: ModeSingle
    LinkList?: LinkSingle[]
}

interface L2C_ProcessModeDelete {
    Mid?: uint64
}


interface L2C_ProcessModeSwapSort {
    Swap?: uint64[]
}

interface L2C_ProcessModeStore {
    Mid?: uint64
    Status?: ModeStatusField
}
interface L2C_ProcessLinkStore {
    Lid?: uint64
    Status?: LinkStatusField
}
interface L2C_ProcessPublishEdit {
    Genre?: uint64
    DateLine?: string
}

interface L2C_ProcessPublishDelete {
    DateLine?: string
}

interface L2C_ManageView {
    AuthList?: AuthSingle[]
    UserList?: UserSingle[]
    ProjList?: ProjectSingle[]
    DeptList?: DepartmentSingle[]
    PosnList?: PositionSingle[]
    UserProjReltList?: UserSingle[]
}

interface C2L_ManageDeptAdd {
    Pid: uint64
    Name: string
    Fid?: uint64
}
interface C2L_ManageDeptDel {
    DidList: uint64[]
}
interface C2L_ManageDeptEditName {
    Did: uint64
    Name: string
}

enum AUTH {
    PROJECT_LIST = 70,
    //后台
    PROJECT_MANAGE = 101,
    DEPARTMENT_MANAGE = 110, //所属部门的管理权限
    //前台
    PROJECT_PROCESS = 201, //所属项目的前台
    DEPARTMENT_PROCESS = 210, //所属部门的后台
    COLLATE_EDIT = 230, //晨会权限 修改状态
}