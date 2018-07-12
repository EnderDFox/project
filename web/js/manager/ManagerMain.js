var ManagerMainClass = /** @class */ (function () {
    function ManagerMainClass() {
    }
    ManagerMainClass.prototype.Init = function () {
        ManagerData.Init();
        //
        if (ManagerData.MyAuth[Auth.PROJECT_LIST]) {
            ManagerManager.ShowProjectList();
        }
        else {
            ManagerManager.ShowProjectEdit(ManagerData.ProjectList[0]); //没有项目管理权限
        }
    };
    return ManagerMainClass;
}());
var ManagerMain = new ManagerMainClass();
//# sourceMappingURL=ManagerMain.js.map