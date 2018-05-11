
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
    Wid?:number
    FileList?:FileSingle[]
    uploading?:boolean  //是否正在上传
}


declare interface IXY {
    x: number
    y: number
}
declare class ArrayUtil {
    static IndexOfAttr(arr: any[], key: string, value: any): number
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

declare class ProcessDataClass{
    WorkMap:{[key:number]:WorkSingle}
}
declare var ProcessData:ProcessDataClass

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

//======原生扩展 js代码位于Common.js
//------Array扩展
interface Array<T> {
    findIndex(predicateFn: (item: T, index?: number, arr?: T[]) => boolean, thisArg?: any): number
}
//------Date扩展
interface Date {
    //'yyyy-MM-dd h:m:s'
    format(format:string):string
}

//======JQuery扩展 必须和 JQueryExtend.ts一致
interface JQueryStatic{
    md5(val:string):string
}
interface JQuery<TElement extends Node = HTMLElement> extends Iterable<TElement> {
    x(): number
    x(vx: number): this
    y(): number
    y(vy: number): this
    xy(): IXY
    xy(vx: number, vy: number): this
    isShow(): boolean
    adjust(offsetY: number): this
}

//======完善其他 d.ts 或为其增加扩展方法  
//------仅仅是type定义  没有js代码
declare type CombinedVueInstance1<Data> = Vue & Data;




