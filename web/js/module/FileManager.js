//文件管理
var FileManagerClass = /** @class */ (function () {
    function FileManagerClass() {
    }
    //注册函数
    FileManagerClass.prototype.RegisterFunc = function () {
        Commond.Register(L2C.L2C_SAVE_COLLATE, this.SaveCollate.bind(this));
    };
    //晨会保存
    FileManagerClass.prototype.SaveCollate = function (data) {
        var url = 'http://' + location.host + '/' + data.Path;
        location.href = url;
        Main.Clear();
    };
    return FileManagerClass;
}());
var FileManager = new FileManagerClass();
//# sourceMappingURL=FileManager.js.map