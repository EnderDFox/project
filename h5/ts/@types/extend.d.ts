//======interface
declare interface IXY {
    x: number
    y: number
}
//======原生扩展 js代码位于Common.js
//------Array扩展
interface Array<T> {
    findIndex(predicateFn: (item: T, index?: number, arr?: T[]) => boolean, thisArg?: any): number
}
//------Date扩展
interface Date {
    //'yyyy-MM-dd h:m:s'
    format(format: string): string
}

//======JQuery扩展 必须和 JQueryExtend.ts一致
interface JQueryStatic {
    md5(val: string): string
}
interface JQuery<TElement extends Node = HTMLElement> extends Iterable<TElement> {
    x(): number
    x(vx: number): this
    y(): number
    y(vy: number): this
    xy(): IXY
    xy(vx: number, vy: number): this
    w(): number
    w(vw: number): this
    h(): number
    h(vh: number): this
    wh(): IXY
    wh(vw: number, vh: number): this
    isShow(): boolean
    adjust(offsetY: number): this
}

//======完善其他 d.ts 或为其增加扩展方法  
//------仅仅是type定义  没有js代码
declare type CombinedVueInstance1<Data> = Vue & Data;


//======pdfjs
interface PDFJSStatic {
    GlobalWorkerOptions: any
}

interface PDFRenderTask {
    promise: any
}


interface PDFDocumentProxy {
    getPageIndex(dest: any): PDFPromise<number>
}


