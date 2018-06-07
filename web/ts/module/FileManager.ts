//文件管理
class FileManagerClass {
    //注册函数
    RegisterFunc() {
        Commond.Register(L2C.L2C_SAVE_COLLATE, this.SaveCollate.bind(this))
    }
    //晨会保存
    SaveCollate(data: { Path: string }) {
        var url = 'http://' + location.host + '/' + data.Path
        location.href = url
        Main.Clear()
    }
}
var FileManager = new FileManagerClass()

