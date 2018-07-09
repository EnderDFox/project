/** 管理项目 部门 职位 权限 */

class ManagerManagerClass {
    VuePath = "manager/"
    VueProjectList: CombinedVueInstance1<{ projectList: ProjectSingle[] }>
    VueProjectSingle: CombinedVueInstance1<{ project: ProjectSingle, newName: string }>
    VueDepartmentSingle: CombinedVueInstance1<{ department: DepartmentSingle, fullName: string, newName: string, allDepartmentList: DepartmentSingle[], positionList: any }>
    Show() {
        this.ShowProjectList()
    }
    ShowProjectList() {
        Loader.LoadVueTemplate(this.VuePath + "ProjectList", (tpl: string) => {
            var vue = new Vue(
                {
                    template: tpl,
                    data: {
                        projectList: [
                            { Pid: 1, Name: 'Amazing' },
                            { Pid: 2, Name: 'Maxwell' },
                        ],
                    },
                    methods: {
                        onClose: function () {
                            $(this.$el).hide()
                        },
                        onEdit: (e, proj: ProjectSingle) => {
                            this.ShowProjectSingle(proj)
                        },
                        onDel: (e, proj: ProjectSingle, index: int) => {
                            this.VueProjectList.projectList.splice(index, 1)
                        },
                        onAdd: () => {
                            this.ShowProjectSingle(null)
                        }
                    },
                }
            ).$mount()
            this.VueProjectList = vue
            //#show
            Common.InsertBeforeDynamicDom(vue.$el)
            Common.AlginCenterInWindow(vue.$el)
            $(vue.$el).show()
        })
    }
    ShowProjectSingle(proj: ProjectSingle) {
        Loader.LoadVueTemplateList([`${this.VuePath}DepartmentSingle`, `${this.VuePath}ProjectEdit`], (tplList: string[]) => {
            //注册组件
            Vue.component('DepartmentItemComponent', {
                template: tplList[0],
                props: {
                    department: Object
                },
                data: function () {
                    return {}
                },
                methods: {

                }
            })
            //
            var departmentList: DepartmentSingle[] = [
                { Did: 1, Name: '策划', depth: 0, Children: [] },
                {
                    Did: 2, Name: '美术', depth: 0, Children: [
                        { Did: 21, Name: 'UI', depth: 1, Children: [] },
                        { Did: 22, Name: '3D', depth: 1, Children: [] },
                        {
                            Did: 23, Name: '原画', depth: 1, Children: [
                                { Did: 231, Name: '角色原画', depth: 2, Children: [] },
                                { Did: 232, Name: '场景原画', depth: 2, Children: [] },
                            ],
                        },
                    ],
                },
                { Did: 3, Name: '后端', depth: 0, Children: [] },
                { Did: 4, Name: '前端', depth: 0, Children: [] },
            ]
            var vue = new Vue(
                {
                    template: tplList[1],
                    data: {
                        project: proj,
                        departmentList: departmentList,
                        newName: proj ? proj.Name : '',
                    },
                    methods: {
                        onClose: function () {
                            $(this.$el).hide()
                        },
                        onEditName: () => {

                        },
                        onEdit: (e,dp:DepartmentSingle) => {
                            this.ShowDepartmentSingle(dp)
                        },
                        onDel: (e, proj: ProjectSingle, index: int) => {
                        },
                        onSubmit: () => {
                        }
                    },
                }
            ).$mount()
            this.VueProjectSingle = vue
            //#show
            Common.InsertBeforeDynamicDom(vue.$el)
            Common.AlginCenterInWindow(vue.$el)
            $(vue.$el).show()
        })
    }
    ShowDepartmentSingle(proj: ProjectSingle) {
        Loader.LoadVueTemplate(this.VuePath + "DepartmentSingle", (tpl: string) => {
            var vue = new Vue(
                {
                    template: tpl,
                    data: {

                    },
                    methods: {
                        onClose: function () {
                        },
                        onEdit: (e, proj: ProjectSingle) => {
                        },
                        onDel: (e, proj: ProjectSingle, index: int) => {
                        },
                        onAdd: () => {
                        }
                    },
                }
            ).$mount()
            this.VueDepartmentSingle = vue
            //#show
            Common.InsertBeforeDynamicDom(vue.$el)
            Common.AlginCenterInWindow(vue.$el)
            $(vue.$el).show()
        })
    }
}

var ManagerManager = new ManagerManagerClass()