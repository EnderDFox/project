//通用类
interface IAlertArg {
	Title?: string
	Content?: string
	CallbackOk?: () => void
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
	InsertIntoDom(newDom: HTMLElement, container: string | HTMLElement): void {
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
	Popup(dom: HTMLElement | JQuery<HTMLElement>) {
		var $dom = $(dom)
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
			_arg.Title = "&nbsp;"
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
					if (_arg.CallbackOk) {
						_arg.CallbackOk()
					}
					$(this.VueAlert.$el).remove()
					this.VueAlert = null;
				},
				OnClose: () => {
					$(this.VueAlert.$el).remove()
					this.VueAlert = null;
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
	AlertError(content: string = "", title: string = "错误") {
		var arg: IAlertArg = {
			Title: title,
			Content: content,
			Theme: "danger",
			BtnOkLabel: "好的",
			ShowBtnCancel: false,
		}
		this.Alert(arg)
	}
	AlertWarning(content: string = "", title: string = "警告") {
		var arg: IAlertArg = {
			Title: title,
			Content: content,
			Theme: "warning",
			BtnOkLabel: "好的",
			ShowBtnCancel: false,
		}
		this.Alert(arg)
	}
	ConfirmWarning(content: string = "", title: string = "", callbackOk: () => void) {
		var arg: IAlertArg = {
			Title: title,
			Content: content,
			Theme: "warning",
			CallbackOk: callbackOk,
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
				console.log("[debug]", key, ":[key]", val, ":[val]")
				this.UrlParamDict[key.toLowerCase()] = val
			}
		}
	}
}
var Common = new CommonClass()

interface IPullDownMenuItem {
	Key: number | string
	Label: string
	Data?: any
}

class StringUtil{
	/**val中是否包含 keyArr 中的某一个值, 如果有,返回该值在val中的位置*/
	static IndexOfKeyArr(val:string, keyArr:string[]):number{
		for (var i = 0; i < keyArr.length; i++) {
			var key = keyArr[i]
			var index = val.indexOf(key)
			if(index>-1){
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
	static IndexOfAttr(arr: any[], key: string, value: any): number {
		var len = arr.length
		for (var i = 0; i < len; i++) {
			if ((key == null && arr[key] == value) || arr[i][key] == value) {
				return i;
			}
		}
		return -1;
	}
	static FindOfAttr<T>(arr: T[], key: string, value: any): T {
		var len = arr.length
		for (var i = 0; i < len; i++) {
			if ((key == null && arr[key] == value) || arr[i][key] == value) {
				return arr[i];
			}
		}
		return null;
	}
	static RemoveByAttr(arr: any[], key: string, value: any): number {
		var index = ArrayUtil.IndexOfAttr(arr, key, value)
		if (index > -1) {
			arr.splice(index, 1)
		}
		return index
	}
	/**用一个数组减去另一个数组 */
	static SubByAttr<T>(arr0: T[], arr1: T[], key: string): T[] {
		var rs: T[] = []
		for (var i = 0; i < arr0.length; i++) {
			var item0 = arr0[i]
			var index0 = ArrayUtil.IndexOfAttr(arr1, key, item0[key])
			if (index0 == -1) {
				rs.push(item0)
			}
		}
		return rs
	}
}
