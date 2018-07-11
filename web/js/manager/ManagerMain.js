var ManagerMainClass = /** @class */ (function () {
    function ManagerMainClass() {
    }
    ManagerMainClass.prototype.Init = function () {
        ManagerData.Init();
        ManagerManager.ShowProjectEdit(ManagerData.ProjectList[0]);
        // ManagerManager.Show()
    };
    return ManagerMainClass;
}());
var ManagerMain = new ManagerMainClass();
//# sourceMappingURL=ManagerMain.js.map