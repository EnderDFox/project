//文件管理
var FileManager = {
	//注册函数
	RegisterFunc:function(){
		Commond.Register(L2C.L2C_SAVE_COLLATE,FileManager.SaveCollate)
	},
	//晨会保存
	SaveCollate:function(data){
		var url = 'http://'+location.host+'/'+data.Path
		location.href = url
		Main.Clear()
	}
}

