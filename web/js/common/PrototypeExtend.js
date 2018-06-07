// JavaScript原生扩展, 因为无法用TypeScript扩展,只好写在js中
//# Array扩展 一般都是IE没有但,chrome和firefox有点函数
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
//# Date扩展
Date.prototype.format = function(format) {
	if(!format){
		format = 'yyyy-MM-dd'
	}
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