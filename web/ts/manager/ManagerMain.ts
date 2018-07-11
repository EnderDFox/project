class ManagerMainClass {
    Init(): void {
        ManagerData.Init()
        ManagerManager.ShowProjectEdit(ManagerData.ProjectList[0])
        // ManagerManager.Show()
    }
}
var ManagerMain = new ManagerMainClass()