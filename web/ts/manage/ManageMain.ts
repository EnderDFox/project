class ManageMainClass {
    Init(): void {
        Common.InitUrlParams()
        VueManager.Init(this.OnInitVueCpl)
    }
    private OnInitVueCpl() {
        ManageManager.Init()
    }
}
var ManageMain = new ManageMainClass()