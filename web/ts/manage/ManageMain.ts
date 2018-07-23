class ManageMainClass {
    Init(): void {
        Common.InitUrlParams()
        VueManager.Init(this.OnInitVueCpl)
    }
    private OnInitVueCpl(){
        ManageData.Init()
        //
        if(ManageData.CurrUser==null){
            Common.ShowNoAccountPage()
        }else{
            ManageManager.Init()
        }
    }
}
var ManageMain = new ManageMainClass()