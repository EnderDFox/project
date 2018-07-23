//通用类
interface IAlertArg {
	Title?: string
	Content?: string
	CallbackOk?: () => void
	CallbackCancel?: () => void
	Theme?: string
	BtnOkLabel?: string
	BtnCancelLabel?: string
	ShowBtnCancel?: boolean
}
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
	/**
	 * 获取当前时间偏移后的 DateLine
	 * @param offsetDay 偏移天数
	 */
	GetDate(offsetDay: number): string {
		var date = new Date()
		date.setDate(date.getDate() + offsetDay)
		return Common.FmtDate(date)
	}
	/**
	 * 获取当前时间偏移后的 Date
	 * @param Day 偏移天数
	 */
	GetOffsetDate(offset: { Day: number }): Date {
		var date = new Date()
		date.setDate(date.getDate() + offset.Day)
		return date
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
	/**
	 * timestamp(单位毫秒) 转 yyyy-MM-dd 
	 * @param dateLine 
	 */
	TimeStamp2DateStr(time: number): string {
		var date = new Date()
		date.setTime(time)
		return this.FmtDate(date)
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
	/**警告提示*/
	Warning(dom: HTMLElement | JQuery<HTMLElement>, evt: JQuery.Event | MouseEvent, func: Function, txt: string): void;
	Warning(evt: JQuery.Event | MouseEvent, func: Function, txt: string): void;
	Warning(evt: JQuery.Event | MouseEvent, txt: string): void;
	Warning(func: Function, txt: string): void;
	Warning(txt: string): void;
	Warning(...args): void {
		var dom: HTMLElement | JQuery<HTMLElement>, evt: JQuery.Event | MouseEvent, func: Function, txt: string
		if (args.length == 4) {
			dom = $(args[0] as HTMLElement);//TODO:Ldom也没用上呢
			[evt, func, txt] = args.slice(1, 4)
		} else if (args.length == 3) {
			[evt, func, txt] = args
		} else if (args.length == 2) {
			if (typeof args[0] == 'function') {
				[func, txt] = [args[0], args[1]]
			} else {
				[evt, txt] = [args[0], args[1]]
			}
		} else if (args.length == 1) {
			txt = args[1]
		}
		var plan = $('#warning')
		if (evt) {
			plan.xy(evt.pageX, evt.pageY)
		} else {
			this.AlginCenterInWindow(plan)
		}
		plan.show().adjust(-5)
		plan.find('.tips').html(txt)
		plan.find('.cancel,.close').unbind().click(function (e) {
			e.stopPropagation()//防止冒泡上去 引发mouseOut关闭了uploadWork
			plan.fadeOut(Config.FadeTime)
		})
		plan.find('.confirm').unbind().click(function (e) {
			e.stopPropagation()//防止冒泡上去 引发mouseOut关闭了uploadWork
			plan.fadeOut(Config.FadeTime)
			if (func) {
				func(e)
			}
		})
	}
	/**在window内居中 */
	AlginCenterInWindow(dom: HTMLElement | JQuery<HTMLElement>, useScorll: boolean = true) {
		var $dom = $(dom)
		var winLeft = 0
		var winTop = 0
		if (useScorll) {
			winLeft = $(window).scrollLeft()
			winTop = $(window).scrollTop()
		}
		$dom.css('position', 'absolute')
		$dom.xy(winLeft + $(window).innerWidth() / 2 - $dom.width() / 2, winTop + $(window).innerHeight() / 2 - $dom.height() / 2)
	}
	/**在#dynamicDom前插入newDom*/
	InsertBeforeDynamicDom(dom: HTMLElement | JQuery<HTMLElement>) {
		var $dom = $(dom)
		var dd = document.getElementById('dynamicDom')
		dd.parentNode.insertBefore($dom.get(0), dd)
	}
	/**将资源插入pageDom内 */
	InsertIntoDom(newDom: HTMLElement, container: string | HTMLElement | Element | Element[] | Vue | Vue[]): void {
		var _c: HTMLElement = typeof (container) == 'string' ? $(container).get(0) : container as HTMLElement;
		_c.innerHTML = ''
		_c.appendChild(newDom)
	}
	InsertIntoPageDom(dom: HTMLElement | JQuery<HTMLElement>) {
		var $dom = $(dom)
		var dd = document.getElementById('pageDom')
		dd.innerHTML = ''//清空先
		dd.appendChild($dom.get(0))
	}
	/**提示信息*/
	AlertFloatMsg(txt: string, e: MouseEvent): void {
		alert(txt)
	}
	//## Vue
	VuePath = 'common/'
	VuePullDownMenu: CombinedVueInstance1<{ itemList: IPullDownMenuItem[], clickCallback: (item: IPullDownMenuItem) => void }>
	//### 下拉菜单
	ShowPullDownMenu(x: number, y: number, itemList: IPullDownMenuItem[], clickCallback: (item: IPullDownMenuItem) => void) {
		if (this.VuePullDownMenu == null) {
			Loader.LoadVueTemplate(this.VuePath + "PullDownMenu", (txt: string) => {
				this.VuePullDownMenu = new Vue({
					template: txt,
					data: {
						itemList: [],
						clickCallback: null,
					},
					methods: {
						onClick: (item: IPullDownMenuItem) => {
							// console.log("[log]","clickCallback:",item.Id)
							this.HidePullDownMenu()
							this.VuePullDownMenu.clickCallback(item)
						}
					}
				}).$mount()
				Common.InsertBeforeDynamicDom(this.VuePullDownMenu.$el)
				this._ShowPullDownMenu(x, y, itemList, clickCallback)
			})
		} else {
			this._ShowPullDownMenu(x, y, itemList, clickCallback)
		}
	}
	_ShowPullDownMenu(x: number, y: number, itemList: IPullDownMenuItem[], clickCallback: (item: IPullDownMenuItem) => void): void {
		this.VuePullDownMenu.itemList = itemList
		this.VuePullDownMenu.clickCallback = clickCallback
		$(this.VuePullDownMenu.$el).xy(x, y).show().adjust(-5)
	}
	HidePullDownMenu(): void {
		if (this.VuePullDownMenu) {
			$(this.VuePullDownMenu.$el).hide()
		}
	}
	/**popup of bootstrap3 */
	private CurrPopupDom: JQuery<HTMLElement>
	PopupHideAll() {
		if (this.CurrPopupDom) {
			$(this.CurrPopupDom).remove()
		}
	}
	Popup(dom: HTMLElement | JQuery<HTMLElement>) {
		var $dom = $(dom)
		this.CurrPopupDom = $dom
		Common.InsertBeforeDynamicDom($dom)
		this.AlginCenterInWindow($dom.find('.popup_content'), false)
	}
	/**删除确认 */
	VueAlert: CombinedVueInstance1<IAlertArg>
	Alert(arg: IAlertArg) {
		var _arg: IAlertArg = {
			Title: "",
			Content: "",
			Theme: "primary",
			BtnOkLabel: `确定`,
			BtnCancelLabel: `取消`,
			ShowBtnCancel: true,
		}
		for (var key in arg) {
			_arg[key] = arg[key]
		}
		if (_arg.Title.trim() == "") {
			_arg.Title = "&nbsp;"//没有内容 会导致heading div高度不够
		}
		//
		if (this.VueAlert) {
			$(this.VueAlert.$el).remove()
			this.VueAlert = null;
		}
		this.VueAlert = new Vue({
			template: Loader.VueTemplateLoadedDict[`${Common.VuePath}Alert`],
			data: {
				arg: _arg,
			},
			methods: {
				OnOk: () => {
					$(this.VueAlert.$el).remove()
					this.VueAlert = null;
					if (_arg.CallbackOk) {
						_arg.CallbackOk()
					}
				},
				OnClose: () => {
					$(this.VueAlert.$el).remove()
					this.VueAlert = null;
					if (_arg.CallbackCancel) {
						_arg.CallbackCancel()
					}
				},
			}
		}).$mount()
		this.Popup(this.VueAlert.$el)
	}
	ConfirmDelete(callbackOk: () => void, content: string = "") {
		var arg: IAlertArg = {
			Title: "确定删除吗?",
			Content: content,
			CallbackOk: callbackOk,
			Theme: "danger",
		}
		this.Alert(arg)
	}
	AlertError(content: string = "", title: string = null) {
		if (title == null) {
			title = "错误"
		}
		var arg: IAlertArg = {
			Title: title,
			Content: content,
			Theme: "danger",
			BtnOkLabel: "好的",
			ShowBtnCancel: false,
		}
		this.Alert(arg)
	}
	AlertWarning(content: string = "", title: string = null) {
		if (title == null) {
			title = "警告"
		}
		var arg: IAlertArg = {
			Title: title,
			Content: content,
			Theme: "warning",
			BtnOkLabel: "好的",
			ShowBtnCancel: false,
		}
		this.Alert(arg)
	}
	ConfirmWarning(content: string = "", title: string = null, callbackOk: () => void, callbackCancel: () => void = null) {
		if (title == null) {
			title = "请确认"
		}
		var arg: IAlertArg = {
			Title: title,
			Content: content,
			Theme: "warning",
			CallbackOk: callbackOk,
			CallbackCancel: callbackCancel,
		}
		this.Alert(arg)
	}
	ShowNoAccountPage() {
		Loader.LoadVueTemplate(`${Common.VuePath}NoAccount`, (tpl: string) => {
			$('body').append(new Vue({ template: tpl }).$mount().$el)
		})

	}
	//#解析网址参数
	UrlParamDict: { [key: string]: string };
	InitUrlParams() {
		this.UrlParamDict = {}
		UrlParam.Init()
	}
}
var Common = new CommonClass()

class UrlParamClass {
	Callback: () => void
	ParamDict: { [key: string]: string | number } = {};
	Init() {
		window.addEventListener('popstate', this._parse.bind(this))
		this._parse()
	}
	_parse() {
		this.ParamDict = {}
		var str = window.location.href.toLowerCase()
		var index0 = str.indexOf('?')
		if (index0 > -1) {
			str = str.substring(index0 + 1, str.length)
			console.log("[debug]", str, ":[str]")
			var sp = str.split(/\&|\?/)
			for (var i = 0; i < sp.length; i++) {
				var spi = sp[i]
				var equrlIndex = spi.indexOf('=')
				if (equrlIndex > 0)//如果=在第一个也不能要
					var key = spi.substring(0, equrlIndex)
				var val = spi.substring(equrlIndex + 1, spi.length)
				val = decodeURI(val)
				console.log("[debug]", key, ":[key]", val, ":[val]")
				this.ParamDict[key.toLowerCase()] = val
			}
		}
		if (this.Callback != null) {
			this.Callback()
		}
	}
	/**重新生成url参数 */
	Reset(): UrlParamClass {
		var rs: string[] = []
		for (var key in this.ParamDict) {
			rs.push(key + '=' + this.ParamDict[key])
		}
		var param = rs.join('&')
		var paramEncode = encodeURI(param)
		history.pushState(param, null, '?' + paramEncode)
		return this
	}
	RemoveAll(): UrlParamClass {
		var isChange: boolean = false
		for (var key in this.ParamDict) {
			if (key == URL_PARAM_KEY.UID) {
				//本项目略过这个
			} else {
				delete this.ParamDict[key]
				isChange = true
			}
		}
		if (isChange) {
			// this.ResetUrlParam()
		}
		return this
	}
	Remove(key: string): UrlParamClass {
		this.Set(key, null)
		return this
	}
	Set(key: string, val: string | number): UrlParamClass {
		this.SetArr({ key: key, val: val })
		return this
	}
	SetArr(...args: { key: string, val: string | number }[]): UrlParamClass {
		var isChange: boolean = false
		for (var i = 0; i < args.length; i++) {
			var arg = args[i]
			if (arg.val == null) {
				if (this.ParamDict.hasOwnProperty(arg.key)) {
					delete this.ParamDict[arg.key]
					isChange = true
				}
			} else {
				if (this.ParamDict[arg.key] != arg.val) {
					this.ParamDict[arg.key] = arg.val
					isChange = true
				}
			}
		}
		return this
		/* 	if (isChange) {
				this.ResetUrlParam()
			} */
	}
	f<T extends number | string>(a: T): T {
		return 'a' as T
	}
	Get<T extends number | string>(key: string): T;
	Get<T extends number | string>(key: string, defaultVal: T): T;
	Get<T extends number | string>(key: string, enabledValArr: T[]): T;
	Get<T extends number | string>(key: string, defaultVal: T, enabledValArr: T[]): T;
	Get<T extends number | string>(key: string, ...args) {
		var [defaultVal, enabledValArr] = this._parseGetParam<string>(args)
		var val
		if (this.ParamDict.hasOwnProperty(key)) {
			val = this.ParamDict[key]
			var valNumber = parseFloat(val)
			if (valNumber.toString() == val) {
				//是数字需要转换成数字
				val = valNumber
			}
		} else {
			val = defaultVal
		}
		if (enabledValArr && enabledValArr.length > 0) {
			if (enabledValArr.indexOf(val) > -1) {//有这个值就返回,否则返回默认值
				return val
			} else {
				return defaultVal
			}
		} else {
			return val
		}
	}
	_parseGetParam<T>(args: any[]): [T, T[]] {
		var defaultVal: T
		var enabledValArr: T[]
		switch (args.length) {
			case 0:
				defaultVal = null;
				break;
			case 1:
				if (typeof (args[0]) == 'object') {
					enabledValArr = args[0]
					defaultVal = enabledValArr[0]
				} else {
					defaultVal = args[0]
				}
				break;
			case 2:
				defaultVal = args[0]
				enabledValArr = args[1]
				break;
		}
		return [defaultVal, enabledValArr]
	}
}
var UrlParam = new UrlParamClass()


interface IPullDownMenuItem {
	Key: number | string
	Label: string
	Data?: any
}

class StringUtil {
	/**val中是否包含 keyArr 中的某一个值, 如果有,返回该值在val中的位置*/
	static IndexOfKeyArr(val: string, keyArr: string[]): number {
		for (var i = 0; i < keyArr.length; i++) {
			var key = keyArr[i]
			var index = val.indexOf(key)
			if (index > -1) {
				return index
			}
		}
		return -1
	}
}
//
class ArrayUtil {
	/** 
     * arr是item为对象的数组, 通过item中的某个值 寻找它在数组中的index
     * e.g. arr : [{a:"2"},{a:"3"}]     ArrayUtil.IndexOfAttr(arr,'a',3)  return 1
    */
	static IndexOfByKey(arr: any[], key: string, value: any): number {
		return arr.IndexOfByKey(key, value)
	}
	static FindByKey<T>(arr: T[], key: string, value: any): T {
		return arr.FindByKey(key, value)
	}
	static RemoveByKey(arr: any[], key: string, value: any): number {
		return arr.RemoveByKey(key, value)
	}
	/**用一个数组减去另一个数组 */
	static SubByAttr<T>(arr0: T[], arr1: T[], key: string): T[] {
		var rs: T[] = []
		for (var i = 0; i < arr0.length; i++) {
			var item0 = arr0[i]
			var index0 = ArrayUtil.IndexOfByKey(arr1, key, item0[key])
			if (index0 == -1) {
				rs.push(item0)
			}
		}
		return rs
	}
}

interface TreeItem {
	Children?: TreeItem[]
}
interface Tree extends Array<TreeItem> {
}
/* interface TreeItem {
	Children?: TreeItem[]
}
interface Tree<T extends TreeItem> extends Array<T> {
} */
/*树 型 数组 的处理, 子数组名必须是Children */
class TreeUtil {
	static Length(tree: Tree): number {
		var len = tree.length
		for (var i = 0; i < tree.length; i++) {
			var item: TreeItem = tree[i]
			if (item.Children) {
				len += TreeUtil.Length(item.Children)
			}
		}
		return len
	}
	/**
	 * map() 方法返回一个新数组，数组中的元素为原始数组元素调用函数处理后的值。
	 * 	map() 方法按照原始数组元素顺序依次处理元素。
	 * callbackfn 如果 是null则不作处理,将所有TreeItem都返回
	 * */
	static Map<T>(tree: Tree, callbackfn: (value: TreeItem, index: number, currTree: Tree) => T = null, rs: T[] = null): T[] {
		rs = rs || []
		for (var i = 0; i < tree.length; i++) {
			var item: TreeItem = tree[i]
			var newItem = callbackfn ? callbackfn(item, i, tree) : item as T
			rs.push(newItem)
			if (item.Children) {
				TreeUtil.Map(item.Children, callbackfn, rs)
			}
		}
		return rs
	}
	/**返回 使用 在每个tree/Children的位置数组 例如   2.1.3   没找到则返回length=0的数组*/
	static IndexOfAttr(tree: Tree, key: string, value: any, indexArr: number[]): number[] {
		indexArr = indexArr || []
		for (var i = 0; i < tree.length; i++) {
			var item: TreeItem = tree[i]
			if ((key == null && item == value) || item[key] == value) {
				indexArr.push(i)
				return indexArr;
			} else {//没有匹配,则继续找子
				if (item.Children) {
					var rs = TreeUtil.FindOfAttr(item.Children, key, value, indexArr)
					if (rs) {
						//Children中找到了, 直接返回吧
						return indexArr
					}
				}
			}
		}
		return indexArr
	}
	static FindOfAttr(tree: Tree, key: string, value: any, indexArr: number[] = null): TreeItem {
		indexArr = indexArr || []
		for (var i = 0; i < tree.length; i++) {
			var item: TreeItem = tree[i]
			if ((key == null && item == value) || item[key] == value) {
				indexArr.push(i)
				return item;
			} else {//没有匹配,则继续找子
				if (item.Children) {
					var rs = TreeUtil.FindOfAttr(item.Children, key, value, indexArr)
					if (rs) {
						//Children中找到了, 直接返回吧
						return rs
					}
				}
			}
		}
		return null
	}
	static RemoveByAttr(tree: Tree, key: string, value: any, indexArr: number[] = null): TreeItem {
		indexArr = indexArr || []
		for (var i = 0; i < tree.length; i++) {
			var item: TreeItem = tree[i]
			if ((key == null && item == value) || item[key] == value) {
				indexArr.push(i)
				tree.splice(i, 1)
				return item;
			} else {//没有匹配,则继续找子
				if (item.Children) {
					var rs = TreeUtil.RemoveByAttr(item.Children, key, value, indexArr)
					if (rs) {
						//Children中找到了, 直接返回吧
						return rs
					}
				}
			}
		}
		return null
	}
	/**every() 方法用于检测数组所有元素是否都符合指定条件（通过函数提供）。

every() 方法使用指定函数检测数组中的所有元素：

如果数组中检测到有一个元素不满足，则整个表达式返回 false ，且剩余的元素不会再进行检测。
如果所有元素都满足条件，则返回 true。 */
	static Every(tree: Tree, callbackfn: (value: TreeItem, index: number, currTree: Tree, depth: number) => boolean, depth: number = 0): boolean {
		for (var i = 0; i < tree.length; i++) {
			var item: TreeItem = tree[i]
			var rs = callbackfn(item, i, tree, depth)
			if (!rs) {
				return false
			} else {//没有匹配,则继续找 子Tree
				if (item.Children) {
					var rs: boolean = TreeUtil.Every(item.Children, callbackfn, depth + 1)
					if (rs = false) {
						//Children中找到了, 直接返回吧
						return false
					}
				}
			}
		}
		return true
	}

}