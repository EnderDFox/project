class ManagerMainClass {
    Init(): void {
        ManagerData.Init()
        //
        ManagerManager.ShowProjectList()
        // ManagerManager.ShowProjectEdit(ManagerData.ProjectList[0])
    }
}
var ManagerMain = new ManagerMainClass()