class ManageMainClass {
    Init(): void {
        Common.InitUrlParams()
        VueManager.Init(this.OnInitVueCpl)
        Commond.Register(L2C.L2C_MANAGE_VIEW, this.L2C_ManageView.bind(this))
    }
    private OnInitVueCpl() {
        WSConn.sendMsg(C2L.C2L_MANAGE_VIEW, null)
    }
    L2C_ManageView(data: L2C_ManageView) {
        ManageData.Init(data)
        //
        if (ManageData.CurrUser == null) {
            Common.ShowNoAccountPage()
        } else {
            ManageManager.Init()
        }
    }
}
var ManageMain = new ManageMainClass()