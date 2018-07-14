class ManagerMainClass {
    Init(): void {
        Common.InitUrlParams()
        VueManager.Init(this.OnInitVueCpl)
    }
    private OnInitVueCpl(){
        ManagerData.Init()
        //
        if(ManagerData.CurrUser==null){
            Common.ShowNoAccountPage()
        }else{
            ManagerManager.Init()
        }
    }
}
var ManagerMain = new ManagerMainClass()