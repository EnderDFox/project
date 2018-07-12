class ManagerMainClass {
    Init(): void {
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