//通用类
var Common = {
	//格式化时间
	FmtDate:function(date){
		var Y = date.getFullYear()
		var M = date.getMonth() + 1
		var D = date.getDate()
		M = M>=10?M:('0'+M)
		D = D>=10?D:('0'+D)
		return Y+'-'+M+'-'+D
	},
	//时间计算
	GetDate:function(day){
		var date = new Date()
		date.setDate(date.getDate() + day)
		return Common.FmtDate(date)
	},
	//本周周几
	GetDayDate:function(to){
		var date = new Date()
		var day = date.getDay()
		day = day==0?7:day
		date.setDate(date.getDate() - day + to)
		return Common.FmtDate(date)
	},
	//格式化日
	GetDay:function(strDate){
		var date = new Date(strDate)
		var day = date.getDay()
		return day = day==0?7:day
	},
	//终端判定
	IsPC:function(){
		var userAgentInfo = navigator.userAgent
		var Agents = ['Android','iPhone','SymbianOS','Windows Phone','iPad','iPod']
		var flag = true;
		for (var v = 0; v < Agents.length; v++) {
			if (userAgentInfo.indexOf(Agents[v]) > 0) {
				flag = false
				break
			}
		}
		return flag
	},
	//警告提示
	Warning:function(o,e,func,txt){
		var plan = $('#warning').css({left:e.pageX,top:e.pageY}).show().adjust(-5)
		plan.find('.tips').html(txt)
		plan.find('.cancel,.close').unbind().click(function(e){
			e.stopPropagation()//防止冒泡上去 引发mouseOut关闭了uploadWork
			plan.fadeOut(Config.FadeTime)
		})
		plan.find('.confirm').unbind().click(function(e){
			e.stopPropagation()//防止冒泡上去 引发mouseOut关闭了uploadWork
			plan.fadeOut(Config.FadeTime)
			if(func){
				func(e)
			}
		})
	},
	InsertBeforeDynamicDom:function(newDom){
		var dd = document.getElementById('dynamicDom')
		dd.parentNode.insertBefore(newDom, dd)																																			
	},
	IsIE:function(){
		var userAgentInfo = navigator.userAgent
		var keys = ['MSIE','rv:11'] // MSIE是IE<=10   rv:11是IE==11
		for (var i = 0; i < keys.length; i++) {
			if (userAgentInfo.indexOf(keys[i]) > 0) {
				return true
			}
		}
		return false
	},
	//提示信息
	AlertFloatMsg:function(txt,e){
		alert(txt)
	}
}

var ArrayUtil = {
	//arr是item为对象的数组, 通过item中的某个值 寻找它在数组中的index
	//e.g. arr : [{a:"2"},{a:"3"}]     ArrayUtil.IndexOfAttr(arr,'a',3)  return 1
	IndexOfAttr:function(arr,key,value){
		// var len = arr.length
		// for (var i = 0; i < len; i++) {
		for (var i in arr) {
			if(arr[i][key]==value){
				return i;
			}
		}
		return -1;
	}
}

//======原生扩展
//------Array扩展
if(!Array.prototype.findIndex){
	Array.prototype.findIndex = function(predicateFn,thisArg){
		var len = this.length
		for (var i = 0; i < len; i++) {
			var item = this[i];
			if(predicateFn.call(thisArg,item,i,this)){
				return i
			}
		}
		return -1
	}
}
if(!Array.from){
	Array.from = function(iterable){
		// IE(包括IE11)没有这个方法,用[].slice.call(new Uint8Array..代替
		return [].slice.call(new Uint8Array(iterable));
	}
}
//------Date扩展
Date.prototype.format = function(format) {
	var date = {
		   "M+": this.getMonth() + 1,
		   "d+": this.getDate(),
		   "h+": this.getHours(),
		   "m+": this.getMinutes(),
		   "s+": this.getSeconds(),
		   "q+": Math.floor((this.getMonth() + 3) / 3),
		   "S+": this.getMilliseconds()
	};
	if (/(y+)/i.test(format)) {
		   format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
	}
	for (var k in date) {
		   if (new RegExp("(" + k + ")").test(format)) {
				  format = format.replace(RegExp.$1, RegExp.$1.length == 1
						 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
		   }
	}
	return format;
}