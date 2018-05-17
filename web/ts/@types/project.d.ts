
declare interface FileSingle{
    Wid?:number
    TempId?: number //为了vue过渡的key
    state?: UploadItemState
    src?: string    //已上传则这个值是url(缩略图) 没上传则这个值是base64
    srcOri?: string    //已上传则这个值是url(原图) 没上传则没有这个值(因为base64无法预览)
    Fid?:number     //仅已上传时可用, 是pm_file.fid
    Kind?:number
    CreateTime?:number  //仅已上传时可用, 是创建时间
    Name?:string
    buffer?:any  //二进制数据
}


declare interface WorkSingle{
    Lid?:number
    Date?:string
    Wid?:number
    FileList?:FileSingle[]
    uploading?:boolean  //是否正在上传
}


declare class UserClass {
    Did: number
    Uid: number
    Login(): void
    RegisterFunc(): void
}
declare var User: UserClass

declare class DataClass {
    DepartmentLoop: DepartmentInfo[]
    RegisterFunc(): void
}
declare var Data;

declare class DepartmentInfo {
    Did: number
}

declare class ProfileManagerClass {
    RegisterFunc(): void
}
declare var ProfileManager: ProfileManagerClass

declare class ProcessManagerClass {
    RegisterFunc(): void
    WorkEdit(data:WorkSingle):void
}
declare var ProcessManager: ProcessManagerClass

declare class CollateManagerClass {
    RegisterFunc(): void
}
declare var CollateManager: CollateManagerClass
declare class FileManagerClass {
    RegisterFunc(): void
}
declare var FileManager: FileManagerClass
declare class NoticeManagerClass {
    RegisterFunc(): void
}
declare var NoticeManager: NoticeManagerClass

declare class CommondClass {
    Execute(cid: number, data: any): void
    Register(cid: number, callback: Function): void
}
declare var Commond: CommondClass

declare class CommonClass {
    Warning(o: any, e: Event, callback: Function, txt: string): void
    /**添加AueDom到$dynamicDom */
    InsertBeforeDynamicDom(newDom: HTMLElement): void
    IsIE(): boolean
}
declare var Common: CommonClass

declare class MainClass {
    Init(): void
}
declare var Main: MainClass

declare class ProcessPanelClass {
    HideMenu(): void
}
declare var ProcessPanel: ProcessPanelClass

declare class ProjectNavClass{
    FilterDid:number
}
declare var ProjectNav:ProjectNavClass

declare class ProcessFilterClass{
    Pack:any
}
declare var ProcessFilter:ProcessFilterClass
