//===data struck
interface IXY {
    x: number
    y: number
}

interface UserSingle {
    Uid?: number
    Did?: DidField
    Name?: string
    IsDel?: number
    IsHide?: number
}

interface DepartmentSingle {
    Did?: DidField
    Fid?: DidField//上级部门
    Name?: string
}

interface DepartmentInfo {
    info?: DepartmentSingle
    list?: DepartmentInfo[]//子部门
    user?: UserSingle[]
}

interface ProjectSingle {
    Pid?: number
    Name?: string
    modeSort?: string[]
}

interface ModeSingle {
    Mid?: uint64
    Vid?: uint64
    Ver?: string[]
    Name?: string[]
    Color?: uint32
    LinkSort?: string[]
    Did?: DidField
    Status?: number
}

interface LinkSingle {
    Lid?: number
    Mid?: number
    Uid?: number
    Name?: string
    Color?: number
    Status?: number
}

interface WorkSingle {
    Lid?: number
    Date?: string
    Wid?: number
    FileList?: FileSingle[]
    uploading?: boolean  //是否正在上传
}

interface ScoreSingle {
    Wid?: number
    Info?: string
    Quality?: number
    Efficiency?: number
    Manner?: number
}

interface VerSingle {
    Genre?: number
    DateLine?: string
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
    Vid?: uint64
    Ver?: string
    Name?: string
    Sort?: uint32
    PublishList?: PublishSingle[]
}

interface PublishSingle {
    Vid?: uint64
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
    // Ver:string
    ModeStatus: number
    LinkStatus: number
    LinkName: string
    LinkUserName: string

}

//===class and instance
/** */
declare class UserClass {
    Did: DidField
    Uid: number
    Login(): void
    RegisterFunc(): void
    IsWrite: boolean
}
declare var User: UserClass
/** */
declare class DataClass {
    DepartmentLoop: DepartmentInfo[]
    /**
     * key 1: DidField
     * key 2: UserSingle.Uid
     */
    DepartmentUserMap: { [key: number]: { [key: number]: UserSingle } }
    RegisterFunc(): void
    GetUser(uid: number): UserSingle
}
declare var Data: DataClass;
/** */
declare class ProfileManagerClass {
    RegisterFunc(): void
}
declare var ProfileManager: ProfileManagerClass
/** */
declare class ProcessManagerClass {
    RegisterFunc(): void
    ModeEdit(data: ModeSingle): void
    WorkEdit(data: WorkSingle): void
    PublishEdit(publish: PublishSingle): void
    PublishDelete(dateLine: string): void
}
declare var ProcessManager: ProcessManagerClass
/** */
declare class CollateManagerClass {
    RegisterFunc(): void
}
declare var CollateManager: CollateManagerClass
/** */
declare class FileManagerClass {
    RegisterFunc(): void
}
declare var FileManager: FileManagerClass
/** */
declare class NoticeManagerClass {
    RegisterFunc(): void
}
declare var NoticeManager: NoticeManagerClass
/** */
declare class CommondClass {
    Execute(cid: number, data: any): void
    Register(cid: number, callback: Function): void
}
declare var Commond: CommondClass
/** */
declare class MainClass {
    Init(): void
}
declare var Main: MainClass
/** */
declare class ProcessPanelClass {
    HideMenu(): void
}
declare var ProcessPanel: ProcessPanelClass
/** */
declare class ProjectNavClass {
    FilterDid: DidField
}
declare var ProjectNav: ProjectNavClass
/** */
declare class ProcessFilterClass {
    Pack: ProcessFilterPack
}
declare var ProcessFilter: ProcessFilterClass
