//# define
enum MarkBodyKid{
    PDF = 1,
    URL = 2,
}

class EventName{
    static mousedown = 'mousedown'
    static mousemove = 'mousemove'
    static mouseup = 'mouseup'
    //
    static touchstart = 'touchstart'
    static touchmove = 'touchmove'
    static touchend = 'touchend'
    static touchcancel = 'touchcancel'
    //
    static mousewheel = 'mousewheel'
}

function NewXY(x: number, y: number): IXY {
    return { x: x, y: y };
}

//通用类
class CommonClass {
    /**格式化时间 格式化为 yyyy-MM-dd 格式 */
    FmtDate(date: Date): string {
        var Y = date.getFullYear()
        var M = date.getMonth() + 1
        var D = date.getDate()
        var MStr: string = M >= 10 ? M.toString() : ('0' + M)
        var DStr: string = D >= 10 ? D.toString() : ('0' + D)
        return Y + '-' + MStr + '-' + DStr
    }
    /**时间计算*/
    GetDate(day: number): string {
        var date = new Date()
        date.setDate(date.getDate() + day)
        return Common.FmtDate(date)
    }
    /**本周周几*/
    GetDayDate(to: number): string {
        var date = new Date()
        var day = date.getDay()
        day = day == 0 ? 7 : day
        date.setDate(date.getDate() - day + to)
        return Common.FmtDate(date)
    }
    /**格式化日*/
    GetDay(strDate: string): number {
        var date = new Date(strDate)
        var day = date.getDay()
        return day = day == 0 ? 7 : day
    }
    /**标准时间字符串 例如yyyy-MM-dd 转 timestamp(单位毫秒)*/
    DateStr2TimeStamp(dateLine: string): number {
        var date = new Date(dateLine)
        return date.getTime()
    }
    //两个DateLine的间隔日
    DateLineSpaceDay(dateLine1: string, dateLine2: string): number {
        var ts1 = this.DateStr2TimeStamp(dateLine1)
        var ts2 = this.DateStr2TimeStamp(dateLine2)
        var ts = Math.abs(ts1 - ts2)
        return Math.floor(ts / 1000 / 3600 / 24)
    }
    /**终端判定 是台式机*/
    IsDesktop (): boolean {
        var userAgentInfo = navigator.userAgent
        var Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false
                break
            }
        }
        return flag
    }
    IsIE(): boolean {
        var userAgentInfo = navigator.userAgent
        var keys = ['MSIE', 'rv:11'] // MSIE是IE<=10   rv:11是IE==11
        for (var i = 0; i < keys.length; i++) {
            if (userAgentInfo.indexOf(keys[i]) > 0) {
                return true
            }
        }
        return false
    }
    /**在#dynamicDom前插入newDom*/
    InsertBeforeDynamicDom(newDom: HTMLElement): void {
        var dd = document.getElementById('dynamicDom')
        dd.parentNode.insertBefore(newDom, dd)
    }
    /**提示信息*/
    AlertFloatMsg(txt: string, e: MouseEvent): void {
        alert(txt)
    }

    preventDragDefault() {
        var _preventDefaultSingle = function (e) {
            e.preventDefault();
        };
        var _preventDragDefault = (target: any) => {
            target.addEventListener("dragleave", _preventDefaultSingle); //拖离
            target.addEventListener("drop", _preventDefaultSingle); //拖后放
            target.addEventListener("dragenter", _preventDefaultSingle); //拖进
            target.addEventListener("dragover", _preventDefaultSingle); //拖来拖去
            // target.addEventListener("mousedown", _preventDefaultSingle);
            // target.addEventListener("mouseup", _preventDefaultSingle);
            // target.addEventListener("mousemove", _preventDefaultSingle);
            // target.addEventListener("touchstart", _preventDefaultSingle);
            // target.addEventListener("touchmove", _preventDefaultSingle);
            // target.addEventListener("touchend", _preventDefaultSingle);
        }
        _preventDragDefault(document)
        _preventDragDefault(document.body)
    }

}
var Common = new CommonClass()
interface IPullDownMenuItem {
    Key: number | string
    Label: string
    Data: any
}
//
class ArrayUtil {
	/** 
     * arr是item为对象的数组, 通过item中的某个值 寻找它在数组中的index
     * e.g. arr : [{a:"2"},{a:"3"}]     ArrayUtil.IndexOfAttr(arr,'a',3)  return 1
    */
    static IndexOfAttr(arr: any[], key: string, value: any): number {
        var len = arr.length
        for (var i = 0; i < len; i++) {
            if (arr[i][key] == value) {
                return i;
            }
        }
        return -1;
    }
}

class MathUtil {
    static round(val:number,digit:number):number{
        digit = Math.pow(10, digit)
        return Math.round(val*digit)/digit
    }
    static distance(gapX: number, gapY: number): number;
    static distance(p0: IXY, p1: IXY): number;
    static distance(x0: number, y0: number, x1: number, y1: number): number;
    static distance(...args): number {
        var gapX: number, gapY: number
        if (args.length == 2) {
            if (typeof args[0] == 'number') {
                gapX = args[0]
                gapY = args[1]
            } else {
                var p0: IXY = args[0]
                var p1: IXY = args[1]
                gapX = p1.x - p0.x
                gapY = p1.y - p0.y
            }
        } else {
            gapX = args[2] - args[0]
            gapY = args[3] - args[1]
        }
        return Math.sqrt(gapX * gapX + gapY * gapY)
    }
}
