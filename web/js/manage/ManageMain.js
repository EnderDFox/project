var ManageMainClass = /** @class */ (function () {
    function ManageMainClass() {
    }
    ManageMainClass.prototype.Init = function () {
        Common.InitUrlParams();
        VueManager.Init(this.OnInitVueCpl);
    };
    ManageMainClass.prototype.OnInitVueCpl = function () {
        ManageData.Init();
        //
        if (ManageData.CurrUser == null) {
            Common.ShowNoAccountPage();
        }
        else {
            ManageManager.Init();
        }
    };
    return ManageMainClass;
}());
var ManageMain = new ManageMainClass();
//# sourceMappingURL=ManageMain.js.map