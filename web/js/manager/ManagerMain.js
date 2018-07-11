var ManagerMainClass = /** @class */ (function () {
    function ManagerMainClass() {
    }
    ManagerMainClass.prototype.Init = function () {
        ManagerData.Init();
        //
        ManagerManager.ShowProjectList();
        // ManagerManager.ShowProjectEdit(ManagerData.ProjectList[0])
    };
    return ManagerMainClass;
}());
var ManagerMain = new ManagerMainClass();
//# sourceMappingURL=ManagerMain.js.map