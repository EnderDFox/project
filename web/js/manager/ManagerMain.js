var ManagerMainClass = /** @class */ (function () {
    function ManagerMainClass() {
    }
    ManagerMainClass.prototype.Init = function () {
        Common.InitUrlParams();
        VueManager.Init(this.OnInitVueCpl);
    };
    ManagerMainClass.prototype.OnInitVueCpl = function () {
        ManagerData.Init();
        //
        if (ManagerData.CurrUser == null) {
            Common.ShowNoAccountPage();
        }
        else {
            ManagerManager.Init();
        }
    };
    return ManagerMainClass;
}());
var ManagerMain = new ManagerMainClass();
//# sourceMappingURL=ManagerMain.js.map