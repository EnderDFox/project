class ManagerMainClass {
    Init(): void {
        VueManager.Init(this.OnInitVueCpl)
    }
    private OnInitVueCpl(){
        ManagerData.Init()
        //
        if(ManagerData.MyAuth[Auth.PROJECT_LIST]){
            ManagerManager.ShowProjectList()
        }else{
            ManagerManager.ShowProjectEdit(ManagerData.ProjectList[0])//没有项目管理权限
        }
    }
}
var ManagerMain = new ManagerMainClass()