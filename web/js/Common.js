//通用类
var CommonClass = /** @class */ (function () {
    function CommonClass() {
        //## Aue
        this.AuePath = 'common/';
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
    /**警告提示*/
    CommonClass.prototype.Warning = function (o, e, func, txt) {
        var plan = $('#warning').css({ left: e.pageX, top: e.pageY }).show().adjust(-5);
        plan.find('.tips').html(txt);
        plan.find('.cancel,.close').unbind().click(function (e) {
            e.stopPropagation(); //防止冒泡上去 引发mouseOut关闭了uploadWork
            plan.fadeOut(Config.FadeTime);
        });
        plan.find('.confirm').unbind().click(function (e) {
            e.stopPropagation(); //防止冒泡上去 引发mouseOut关闭了uploadWork
            plan.fadeOut(Config.FadeTime);
            if (func) {
                func(e);
            }
        });
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
    //### 下拉菜单
    CommonClass.prototype.ShowPullDownMenu = function (x, y, itemList, clickCallback) {
        var _this = this;
        if (this.VuePullDownMenu == null) {
            Loader.LoadVueTemplate(this.AuePath + "PullDownMenu", function (txt) {
                _this.VuePullDownMenu = new Vue({
                    template: txt,
                    data: {
                        itemList: [],
                    },
                    methods: {
                        onClick: function (item) {
                            // console.log("[log]","clickCallback:",item.Id)
                            _this.HidePullDownMenu();
                            clickCallback(item);
                        }
                    }
                }).$mount();
                Common.InsertBeforeDynamicDom(_this.VuePullDownMenu.$el);
                _this._ShowPullDownMenu(x, y, itemList);
            });
        }
        else {
            this._ShowPullDownMenu(x, y, itemList);
        }
    };
    CommonClass.prototype._ShowPullDownMenu = function (x, y, itemList) {
        this.VuePullDownMenu.itemList = itemList;
        $(this.VuePullDownMenu.$el).xy(x, y).show();
    };
    CommonClass.prototype.HidePullDownMenu = function () {
        if (this.VuePullDownMenu) {
            $(this.VuePullDownMenu.$el).hide();
        }
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