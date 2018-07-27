var CommonClass = /** @class */ (function () {
    function CommonClass() {
        //## Vue
        this.VuePath = 'common/';
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
    /**
     * 获取当前时间偏移后的 DateLine
     * @param offsetDay 偏移天数
     */
    CommonClass.prototype.GetDate = function (offsetDay) {
        var date = new Date();
        date.setDate(date.getDate() + offsetDay);
        return Common.FmtDate(date);
    };
    /**
     * 获取当前时间偏移后的 Date
     * @param Day 偏移天数
     */
    CommonClass.prototype.GetOffsetDate = function (offset) {
        var date = new Date();
        date.setDate(date.getDate() + offset.Day);
        return date;
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
    /**
     * timestamp(单位毫秒) 转 yyyy-MM-dd
     * @param dateLine
     */
    CommonClass.prototype.TimeStamp2DateStr = function (time) {
        var date = new Date();
        date.setTime(time);
        return this.FmtDate(date);
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
    CommonClass.prototype.Warning = function () {
        var _a, _b, _d;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var dom, evt, func, txt;
        if (args.length == 4) {
            dom = $(args[0]); //TODO:Ldom也没用上呢
            _a = args.slice(1, 4), evt = _a[0], func = _a[1], txt = _a[2];
        }
        else if (args.length == 3) {
            evt = args[0], func = args[1], txt = args[2];
        }
        else if (args.length == 2) {
            if (typeof args[0] == 'function') {
                _b = [args[0], args[1]], func = _b[0], txt = _b[1];
            }
            else {
                _d = [args[0], args[1]], evt = _d[0], txt = _d[1];
            }
        }
        else if (args.length == 1) {
            txt = args[1];
        }
        var plan = $('#warning');
        if (evt) {
            plan.xy(evt.pageX, evt.pageY);
        }
        else {
            this.AlginCenterInWindow(plan);
        }
        plan.show().adjust(-5);
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
    /**在window内居中 */
    CommonClass.prototype.AlginCenterInWindow = function (dom) {
        var $dom = $(dom);
        var winLeft = $(window).scrollLeft();
        var winTop = $(window).scrollTop();
        $dom.css('position', 'absolute');
        $dom.xy(winLeft + $(window).innerWidth() / 2 - $dom.width() / 2, winTop + $(window).innerHeight() / 2 - $dom.height() / 2);
    };
    /**在#dynamicDom前插入newDom*/
    CommonClass.prototype.InsertBeforeDynamicDom = function (dom) {
        var $dom = $(dom);
        var dd = document.getElementById('dynamicDom');
        dd.parentNode.insertBefore($dom.get(0), dd);
    };
    /**将资源插入pageDom内 */
    CommonClass.prototype.InsertIntoDom = function (newDom, container) {
        var _c = typeof (container) == 'string' ? $(container).get(0) : container;
        _c.innerHTML = '';
        _c.appendChild(newDom);
    };
    CommonClass.prototype.InsertIntoPageDom = function (dom) {
        var $dom = $(dom);
        var dd = document.getElementById('pageDom');
        dd.innerHTML = ''; //清空先
        dd.appendChild($dom.get(0));
    };
    /**提示信息*/
    CommonClass.prototype.AlertFloatMsg = function (txt, e) {
        alert(txt);
    };
    //### 下拉菜单
    CommonClass.prototype.ShowPullDownMenu = function (x, y, itemList, clickCallback) {
        var _this = this;
        if (this.VuePullDownMenu == null) {
            Loader.LoadVueTemplate(this.VuePath + "PullDownMenu", function (txt) {
                _this.VuePullDownMenu = new Vue({
                    template: txt,
                    data: {
                        itemList: [],
                        clickCallback: null,
                    },
                    methods: {
                        onClick: function (item) {
                            // console.log("[log]","clickCallback:",item.Id)
                            _this.HidePullDownMenu();
                            _this.VuePullDownMenu.clickCallback(item);
                        }
                    }
                }).$mount();
                Common.InsertBeforeDynamicDom(_this.VuePullDownMenu.$el);
                _this._ShowPullDownMenu(x, y, itemList, clickCallback);
            });
        }
        else {
            this._ShowPullDownMenu(x, y, itemList, clickCallback);
        }
    };
    CommonClass.prototype._ShowPullDownMenu = function (x, y, itemList, clickCallback) {
        this.VuePullDownMenu.itemList = itemList;
        this.VuePullDownMenu.clickCallback = clickCallback;
        $(this.VuePullDownMenu.$el).xy(x, y).show().adjust(-5);
    };
    CommonClass.prototype.HidePullDownMenu = function () {
        if (this.VuePullDownMenu) {
            $(this.VuePullDownMenu.$el).hide();
        }
    };
    /**popup */
    CommonClass.prototype.Popup = function (dom) {
        var $dom = $(dom);
        Common.InsertBeforeDynamicDom($dom);
        this.AlginCenterInWindow($dom.find('.popup_content'));
    };
    CommonClass.prototype.Alert = function (arg) {
        var _this = this;
        var _arg = {
            Title: "",
            Content: "",
            Theme: "primary",
            BtnOkLabel: "\u786E\u5B9A",
            BtnCancelLabel: "\u53D6\u6D88",
            ShowBtnCancel: true,
        };
        for (var key in arg) {
            _arg[key] = arg[key];
        }
        if (_arg.Title.trim() == "") {
            _arg.Title = "&nbsp;";
        }
        //
        if (this.VueAlert) {
            $(this.VueAlert.$el).remove();
            this.VueAlert = null;
        }
        this.VueAlert = new Vue({
            template: Loader.VueTemplateLoadedDict[Common.VuePath + "Alert"],
            data: {
                arg: _arg,
            },
            methods: {
                OnOk: function () {
                    if (_arg.CallbackOk) {
                        _arg.CallbackOk();
                    }
                    $(_this.VueAlert.$el).remove();
                    _this.VueAlert = null;
                },
                OnClose: function () {
                    $(_this.VueAlert.$el).remove();
                    _this.VueAlert = null;
                },
            }
        }).$mount();
        this.Popup(this.VueAlert.$el);
    };
    CommonClass.prototype.ConfirmDelete = function (callbackOk, content) {
        if (content === void 0) { content = ""; }
        var arg = {
            Title: "确定删除吗?",
            Content: content,
            CallbackOk: callbackOk,
            Theme: "danger",
        };
        this.Alert(arg);
    };
    CommonClass.prototype.AlertError = function (content, title) {
        if (content === void 0) { content = ""; }
        if (title === void 0) { title = "错误"; }
        var arg = {
            Title: title,
            Content: content,
            Theme: "danger",
            BtnOkLabel: "好的",
            ShowBtnCancel: false,
        };
        this.Alert(arg);
    };
    CommonClass.prototype.AlertWarning = function (content, title) {
        if (content === void 0) { content = ""; }
        if (title === void 0) { title = "警告"; }
        var arg = {
            Title: title,
            Content: content,
            Theme: "warning",
            BtnOkLabel: "好的",
            ShowBtnCancel: false,
        };
        this.Alert(arg);
    };
    CommonClass.prototype.ConfirmWarning = function (content, title, callbackOk) {
        if (content === void 0) { content = ""; }
        if (title === void 0) { title = ""; }
        var arg = {
            Title: title,
            Content: content,
            Theme: "warning",
            CallbackOk: callbackOk,
        };
        this.Alert(arg);
    };
    CommonClass.prototype.ShowNoAccountPage = function () {
        Loader.LoadVueTemplate(Common.VuePath + "NoAccount", function (tpl) {
            $('body').append(new Vue({ template: tpl }).$mount().$el);
        });
    };
    CommonClass.prototype.InitUrlParams = function () {
        this.UrlParamDict = {};
        var str = window.location.href.toLowerCase();
        var index0 = str.indexOf('?');
        if (index0 > -1) {
            str = str.substring(index0 + 1, str.length);
            console.log("[debug]", str, ":[str]");
            var sp = str.split(/\&|\?/);
            for (var i = 0; i < sp.length; i++) {
                var spi = sp[i];
                var equrlIndex = spi.indexOf('=');
                if (equrlIndex > 0) //如果=在第一个也不能要
                    var key = spi.substring(0, equrlIndex);
                var val = spi.substring(equrlIndex + 1, spi.length);
                console.log("[debug]", key, ":[key]", val, ":[val]");
                this.UrlParamDict[key.toLowerCase()] = val;
            }
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
            if ((key == null && arr[key] == value) || arr[i][key] == value) {
                return i;
            }
        }
        return -1;
    };
    ArrayUtil.FindOfAttr = function (arr, key, value) {
        var len = arr.length;
        for (var i = 0; i < len; i++) {
            if ((key == null && arr[key] == value) || arr[i][key] == value) {
                return arr[i];
            }
        }
        return null;
    };
    ArrayUtil.RemoveByAttr = function (arr, key, value) {
        var index = ArrayUtil.IndexOfAttr(arr, key, value);
        if (index > -1) {
            arr.splice(index, 1);
        }
        return index;
    };
    /**用一个数组减去另一个数组 */
    ArrayUtil.SubByAttr = function (arr0, arr1, key) {
        var rs = [];
        for (var i = 0; i < arr0.length; i++) {
            var item0 = arr0[i];
            var index0 = ArrayUtil.IndexOfAttr(arr1, key, item0[key]);
            if (index0 == -1) {
                rs.push(item0);
            }
        }
        return rs;
    };
    return ArrayUtil;
}());
//# sourceMappingURL=Common.js.map