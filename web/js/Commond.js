//指令调用类
var Commond = {
	//map
	FuncMap:{},
	//注册
	Register:function(cid,func){
		Commond.FuncMap[cid] = func
	},
	//运行
	Execute:function(cid,data){
		if(!Commond.FuncMap[cid]){
			return false
		}
		Commond.FuncMap[cid](data)
	}
}
