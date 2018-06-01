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
    /**终端判定*/
    IsPC(): boolean {
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
        var _preventDragDefault = (target:any)=>{
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
