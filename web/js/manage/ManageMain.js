var ManageMainClass = /** @class */ (function () {
    function ManageMainClass() {
    }
    ManageMainClass.prototype.Init = function () {
        Common.InitUrlParams();
        VueManager.Init(this.OnInitVueCpl);
        Commond.Register(L2C.L2C_MANAGE_VIEW, this.L2C_ManageView.bind(this));
    };
    ManageMainClass.prototype.OnInitVueCpl = function () {
        WSConn.sendMsg(C2L.C2L_MANAGE_VIEW, null);
    };
    ManageMainClass.prototype.L2C_ManageView = function (data) {
        ManageData.Init(data);
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