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
    CommonClass.prototype.AlginCenterInWindow = function (dom, useScorll) {
        if (useScorll === void 0) { useScorll = true; }
        var $dom = $(dom);
        var winLeft = 0;
        var winTop = 0;
        if (useScorll) {
            winLeft = $(window).scrollLeft();
            winTop = $(window).scrollTop();
        }
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
    CommonClass.prototype.PopupHideAll = function () {
        if (this.CurrPopupDom) {
            $(this.CurrPopupDom).remove();
        }
    };
    CommonClass.prototype.Popup = function (dom) {
        var $dom = $(dom);
        this.CurrPopupDom = $dom;
        Common.InsertBeforeDynamicDom($dom);
        this.AlginCenterInWindow($dom.find('.popup_content'), false);
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
            _arg.Title = "&nbsp;"; //没有内容 会导致heading div高度不够
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
                    $(_this.VueAlert.$el).remove();
                    _this.VueAlert = null;
                    if (_arg.CallbackOk) {
                        _arg.CallbackOk();
                    }
                },
                OnClose: function () {
                    $(_this.VueAlert.$el).remove();
                    _this.VueAlert = null;
                    if (_arg.CallbackCancel) {
                        _arg.CallbackCancel();
                    }
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
        if (title === void 0) { title = null; }
        if (title == null) {
            title = "错误";
        }
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
        if (title === void 0) { title = null; }
        if (title == null) {
            title = "警告";
        }
        var arg = {
            Title: title,
            Content: content,
            Theme: "warning",
            BtnOkLabel: "好的",
            ShowBtnCancel: false,
        };
        this.Alert(arg);
    };
    CommonClass.prototype.ConfirmWarning = function (content, title, callbackOk, callbackCancel) {
        if (content === void 0) { content = ""; }
        if (title === void 0) { title = null; }
        if (callbackCancel === void 0) { callbackCancel = null; }
        if (title == null) {
            title = "请确认";
        }
        var arg = {
            Title: title,
            Content: content,
            Theme: "warning",
            CallbackOk: callbackOk,
            CallbackCancel: callbackCancel,
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
        UrlParam.Init();
    };
    return CommonClass;
}());
var Common = new CommonClass();
var UrlParamClass = /** @class */ (function () {
    function UrlParamClass() {
        this.ParamDict = {};
    }
    UrlParamClass.prototype.Init = function () {
        window.addEventListener('popstate', this._parse.bind(this));
        this._parse();
    };
    UrlParamClass.prototype._parse = function () {
        this.ParamDict = {};
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
                val = decodeURI(val);
                console.log("[debug]", key, ":[key]", val, ":[val]");
                this.ParamDict[key.toLowerCase()] = val;
            }
        }
        if (this.Callback != null) {
            this.Callback();
        }
    };
    /**重新生成url参数 */
    UrlParamClass.prototype.Reset = function () {
        var rs = [];
        for (var key in this.ParamDict) {
            rs.push(key + '=' + this.ParamDict[key]);
        }
        var param = rs.join('&');
        var paramEncode = encodeURI(param);
        history.pushState(param, null, '?' + paramEncode);
        return this;
    };
    UrlParamClass.prototype.RemoveAll = function () {
        var isChange = false;
        for (var key in this.ParamDict) {
            if (key == URL_PARAM_KEY.UID) {
                //本项目略过这个
            }
            else {
                delete this.ParamDict[key];
                isChange = true;
            }
        }
        if (isChange) {
            // this.ResetUrlParam()
        }
        return this;
    };
    UrlParamClass.prototype.Remove = function (key) {
        this.Set(key, null);
        return this;
    };
    UrlParamClass.prototype.Set = function (key, val) {
        this.SetArr({ key: key, val: val });
        return this;
    };
    UrlParamClass.prototype.SetArr = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var isChange = false;
        for (var i = 0; i < args.length; i++) {
            var arg = args[i];
            if (arg.val == null) {
                if (this.ParamDict.hasOwnProperty(arg.key)) {
                    delete this.ParamDict[arg.key];
                    isChange = true;
                }
            }
            else {
                if (this.ParamDict[arg.key] != arg.val) {
                    this.ParamDict[arg.key] = arg.val;
                    isChange = true;
                }
            }
        }
        return this;
        /* 	if (isChange) {
                this.ResetUrlParam()
            } */
    };
    UrlParamClass.prototype.f = function (a) {
        return 'a';
    };
    UrlParamClass.prototype.Get = function (key) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var _a = this._parseGetParam(args), defaultVal = _a[0], enabledValArr = _a[1];
        var val;
        if (this.ParamDict.hasOwnProperty(key)) {
            val = this.ParamDict[key];
            var valNumber = parseFloat(val);
            if (valNumber.toString() == val) {
                //是数字需要转换成数字
                val = valNumber;
            }
        }
        else {
            val = defaultVal;
        }
        if (enabledValArr && enabledValArr.length > 0) {
            if (enabledValArr.indexOf(val) > -1) { //有这个值就返回,否则返回默认值
                return val;
            }
            else {
                return defaultVal;
            }
        }
        else {
            return val;
        }
    };
    UrlParamClass.prototype._parseGetParam = function (args) {
        var defaultVal;
        var enabledValArr;
        switch (args.length) {
            case 0:
                defaultVal = null;
                break;
            case 1:
                if (typeof (args[0]) == 'object') {
                    enabledValArr = args[0];
                    defaultVal = enabledValArr[0];
                }
                else {
                    defaultVal = args[0];
                }
                break;
            case 2:
                defaultVal = args[0];
                enabledValArr = args[1];
                break;
        }
        return [defaultVal, enabledValArr];
    };
    return UrlParamClass;
}());
var UrlParam = new UrlParamClass();
var StringUtil = /** @class */ (function () {
    function StringUtil() {
    }
    /**val中是否包含 keyArr 中的某一个值, 如果有,返回该值在val中的位置*/
    StringUtil.IndexOfKeyArr = function (val, keyArr) {
        for (var i = 0; i < keyArr.length; i++) {
            var key = keyArr[i];
            var index = val.indexOf(key);
            if (index > -1) {
                return index;
            }
        }
        return -1;
    };
    return StringUtil;
}());
//
var ArrayUtil = /** @class */ (function () {
    function ArrayUtil() {
    }
    /**
     * arr是item为对象的数组, 通过item中的某个值 寻找它在数组中的index
     * e.g. arr : [{a:"2"},{a:"3"}]     ArrayUtil.IndexOfAttr(arr,'a',3)  return 1
    */
    ArrayUtil.IndexOfByKey = function (arr, key, value) {
        return arr.IndexOfByKey(key, value);
    };
    ArrayUtil.FindByKey = function (arr, key, value) {
        return arr.FindByKey(key, value);
    };
    ArrayUtil.RemoveByKey = function (arr, key, value) {
        return arr.RemoveByKey(key, value);
    };
    /**用一个数组减去另一个数组 */
    ArrayUtil.SubByAttr = function (arr0, arr1, key) {
        var rs = [];
        for (var i = 0; i < arr0.length; i++) {
            var item0 = arr0[i];
            var index0 = ArrayUtil.IndexOfByKey(arr1, key, item0[key]);
            if (index0 == -1) {
                rs.push(item0);
            }
        }
        return rs;
    };
    return ArrayUtil;
}());
/* interface TreeItem {
    Children?: TreeItem[]
}
interface Tree<T extends TreeItem> extends Array<T> {
} */
/*树 型 数组 的处理, 子数组名必须是Children */
var TreeUtil = /** @class */ (function () {
    function TreeUtil() {
    }
    TreeUtil.Length = function (tree) {
        var len = tree.length;
        for (var i = 0; i < tree.length; i++) {
            var item = tree[i];
            if (item.Children) {
                len += TreeUtil.Length(item.Children);
            }
        }
        return len;
    };
    /**
     * map() 方法返回一个新数组，数组中的元素为原始数组元素调用函数处理后的值。
     * 	map() 方法按照原始数组元素顺序依次处理元素。
     * callbackfn 如果 是null则不作处理,将所有TreeItem都返回
     * */
    TreeUtil.Map = function (tree, callbackfn, rs) {
        if (callbackfn === void 0) { callbackfn = null; }
        if (rs === void 0) { rs = null; }
        rs = rs || [];
        for (var i = 0; i < tree.length; i++) {
            var item = tree[i];
            var newItem = callbackfn ? callbackfn(item, i, tree) : item;
            rs.push(newItem);
            if (item.Children) {
                TreeUtil.Map(item.Children, callbackfn, rs);
            }
        }
        return rs;
    };
    /**返回 使用 在每个tree/Children的位置数组 例如   2.1.3   没找到则返回length=0的数组*/
    TreeUtil.IndexOfByKey = function (tree, key, value, indexArr) {
        indexArr = indexArr || [];
        for (var i = 0; i < tree.length; i++) {
            var item = tree[i];
            if ((key == null && item == value) || item[key] == value) {
                indexArr.push(i);
                return indexArr;
            }
            else { //没有匹配,则继续找子
                if (item.Children) {
                    var rs = TreeUtil.FindByKey(item.Children, key, value, indexArr);
                    if (rs) {
                        //Children中找到了, 直接返回吧
                        return indexArr;
                    }
                }
            }
        }
        return indexArr;
    };
    TreeUtil.FindByKey = function (tree, key, value, indexArr) {
        if (indexArr === void 0) { indexArr = null; }
        indexArr = indexArr || [];
        for (var i = 0; i < tree.length; i++) {
            var item = tree[i];
            if ((key == null && item == value) || item[key] == value) {
                indexArr.push(i);
                return item;
            }
            else { //没有匹配,则继续找子
                if (item.Children) {
                    var rs = TreeUtil.FindByKey(item.Children, key, value, indexArr);
                    if (rs) {
                        //Children中找到了, 直接返回吧
                        return rs;
                    }
                }
            }
        }
        return null;
    };
    TreeUtil.RemoveByKey = function (tree, key, value, indexArr) {
        if (indexArr === void 0) { indexArr = null; }
        indexArr = indexArr || [];
        for (var i = 0; i < tree.length; i++) {
            var item = tree[i];
            if ((key == null && item == value) || item[key] == value) {
                indexArr.push(i);
                tree.splice(i, 1);
                return item;
            }
            else { //没有匹配,则继续找子
                if (item.Children) {
                    var rs = TreeUtil.RemoveByKey(item.Children, key, value, indexArr);
                    if (rs) {
                        //Children中找到了, 直接返回吧
                        return rs;
                    }
                }
            }
        }
        return null;
    };
    /**every() 方法用于检测数组所有元素是否都符合指定条件（通过函数提供）。

every() 方法使用指定函数检测数组中的所有元素：

如果数组中检测到有一个元素不满足，则整个表达式返回 false ，且剩余的元素不会再进行检测。
如果所有元素都满足条件，则返回 true。 */
    TreeUtil.Every = function (tree, callbackfn, depth) {
        if (depth === void 0) { depth = 0; }
        for (var i = 0; i < tree.length; i++) {
            var item = tree[i];
            var rs = callbackfn(item, i, tree, depth);
            if (!rs) {
                return false;
            }
            else { //没有匹配,则继续找 子Tree
                if (item.Children) {
                    var rs = TreeUtil.Every(item.Children, callbackfn, depth + 1);
                    if (rs = false) {
                        //Children中找到了, 直接返回吧
                        return false;
                    }
                }
            }
        }
        return true;
    };
    return TreeUtil;
}());
//# sourceMappingURL=Common.js.map