//# defind
var EventName = /** @class */ (function () {
    function EventName() {
    }
    EventName.mousedown = 'mousedown';
    EventName.mousemove = 'mousemove';
    EventName.mouseup = 'mouseup';
    //
    EventName.touchstart = 'touchstart';
    EventName.touchmove = 'touchmove';
    EventName.touchend = 'touchend';
    EventName.touchcancel = 'touchcancel';
    //
    EventName.mousewheel = 'mousewheel';
    return EventName;
}());
//通用类
var CommonClass = /** @class */ (function () {
    function CommonClass() {
    }
    CommonClass.prototype.NewXY = function (x, y) {
        return { x: x, y: y };
    };
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
    /**终端判定 是台式机*/
    CommonClass.prototype.IsDesktop = function () {
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
    CommonClass.prototype.preventDragDefault = function () {
        var _preventDefaultSingle = function (e) {
            e.preventDefault();
        };
        var _preventDragDefault = function (target) {
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
        };
        _preventDragDefault(document);
        _preventDragDefault(document.body);
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
var MathUtil = /** @class */ (function () {
    function MathUtil() {
    }
    MathUtil.round = function (val, digit) {
        digit = Math.pow(10, digit);
        return Math.round(val * digit) / digit;
    };
    MathUtil.distance = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var gapX, gapY;
        if (args.length == 2) {
            if (typeof args[0] == 'number') {
                gapX = args[0];
                gapY = args[1];
            }
            else {
                var p0 = args[0];
                var p1 = args[1];
                gapX = p1.x - p0.x;
                gapY = p1.y - p0.y;
            }
        }
        else {
            gapX = args[2] - args[0];
            gapY = args[3] - args[1];
        }
        return Math.sqrt(gapX * gapX + gapY * gapY);
    };
    return MathUtil;
}());
//# sourceMappingURL=Common.js.map