var ManageMainClass = /** @class */ (function () {
    function ManageMainClass() {
    }
    ManageMainClass.prototype.Init = function () {
        Common.InitUrlParams();
        VueManager.Init(this.OnInitVueCpl);
    };
    ManageMainClass.prototype.OnInitVueCpl = function () {
        ManageManager.Init();
    };
    return ManageMainClass;
}());
var ManageMain = new ManageMainClass();
//# sourceMappingURL=ManageMain.js.map