//指令调用类
class CommondClass{
	//map
	FuncMap:{ [key: number]: (data:any)=>void } = {};
	//注册
	Register(cid,func:(data:any)=>void ){
		this.FuncMap[cid] = func
	}
	//运行
	Execute(cid,data:any):boolean{
		if(!this.FuncMap[cid]){
			return false
		}
        this.FuncMap[cid](data)
        return true
	}
}
var Commond = new CommondClass()
