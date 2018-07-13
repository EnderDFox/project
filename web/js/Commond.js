//指令调用类
var CommondClass = /** @class */ (function () {
    function CommondClass() {
        //map
        this.FuncMap = {};
    }
    //注册
    CommondClass.prototype.Register = function (cid, func) {
        this.FuncMap[cid] = func;
    };
    //运行
    CommondClass.prototype.Execute = function (cid, data) {
        if (!this.FuncMap[cid]) {
            return false;
        }
        this.FuncMap[cid](data);
        return true;
    };
    return CommondClass;
}());
var Commond = new CommondClass();
//# sourceMappingURL=Commond.js.map