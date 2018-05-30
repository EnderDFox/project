//通用类
var CommonClass = /** @class */ (function () {
    function CommonClass() {
    }
    /**格式化时间 格式化为 yyyy-MM-dd 格式 */
    CommonClass.prototype.FmtDate = function (date) {
        var Y = date.getFullYear();
        var M = date.getMonth() + 1;
        var D = date.getDate();
        var MStr = M >= 10 ? M.toString() : ('0' + M);
        var DStr = D >= 10 ? D.toString() : ('0' + D);
        return Y + '-' + MStr + '-' + DStr;
    };
    /**时间计算*/
    CommonClass.prototype.GetDate = function (day) {
        var date = new Date();
        date.setDate(date.getDate() + day);
        return Common.FmtDate(date);
    };
    /**本周周几*/
    CommonClass.prototype.GetDayDate = function (to) {
        var date = new Date();
        var day = date.getDay();
        day = day == 0 ? 7 : day;
        date.setDate(date.getDate() - day + to);
        return Common.FmtDate(date);
    };
    /**格式化日*/
    CommonClass.prototype.GetDay = function (strDate) {
        var date = new Date(strDate);
        var day = date.getDay();
        return day = day == 0 ? 7 : day;
    };
    /**标准时间字符串 例如yyyy-MM-dd 转 timestamp(单位毫秒)*/
    CommonClass.prototype.DateStr2TimeStamp = function (dateLine) {
        var date = new Date(dateLine);
        return date.getTime();
    };
    //两个DateLine的间隔日
    CommonClass.prototype.DateLineSpaceDay = function (dateLine1, dateLine2) {
        var ts1 = this.DateStr2TimeStamp(dateLine1);
        var ts2 = this.DateStr2TimeStamp(dateLine2);
        var ts = Math.abs(ts1 - ts2);
        return Math.floor(ts / 1000 / 3600 / 24);
    };
    /**终端判定*/
    CommonClass.prototype.IsPC = function () {
        var userAgentInfo = navigator.userAgent;
        var Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
    };
    CommonClass.prototype.IsIE = function () {
        var userAgentInfo = navigator.userAgent;
        var keys = ['MSIE', 'rv:11']; // MSIE是IE<=10   rv:11是IE==11
        for (var i = 0; i < keys.length; i++) {
            if (userAgentInfo.indexOf(keys[i]) > 0) {
                return true;
            }
        }
        return false;
    };
    /**在#dynamicDom前插入newDom*/
    CommonClass.prototype.InsertBeforeDynamicDom = function (newDom) {
        var dd = document.getElementById('dynamicDom');
        dd.parentNode.insertBefore(newDom, dd);
    };
    /**提示信息*/
    CommonClass.prototype.AlertFloatMsg = function (txt, e) {
        alert(txt);
    };
    return CommonClass;
}());
var Common = new CommonClass();
//
var ArrayUtil = /** @class */ (function () {
    function ArrayUtil() {
    }
    /**
     * arr是item为对象的数组, 通过item中的某个值 寻找它在数组中的index
     * e.g. arr : [{a:"2"},{a:"3"}]     ArrayUtil.IndexOfAttr(arr,'a',3)  return 1
    */
    ArrayUtil.IndexOfAttr = function (arr, key, value) {
        var len = arr.length;
        for (var i = 0; i < len; i++) {
            if (arr[i][key] == value) {
                return i;
            }
        }
        return -1;
    };
    return ArrayUtil;
}());
//# sourceMappingURL=Common.js.map