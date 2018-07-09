/** 管理项目 部门 职位 权限 */

class ManagerManagerClass {
    VuePath = "manager/"
    VueProjectList: CombinedVueInstance1<{ projectList: ProjectSingle[] }>
    VueProjectSingle: CombinedVueInstance1<{ project: ProjectSingle, newName: string, dpTree: DepartmentSingle[] }>
    VueDepartmentSingle: CombinedVueInstance1<{ department: DepartmentSingle, fullName: string, newName: string, allDepartmentList: DepartmentSingle[], positionList: PositionSingle[] }>
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
        Loader.LoadVueTemplateList([`${this.VuePath}DepartmentItemComponent`, `${this.VuePath}ProjectEdit`], (tplList: string[]) => {
            //注册组件
            Vue.component('DepartmentItemComponent', {
                template: tplList[0],
                props: {
                    dp: Object
                },
                data: function () {
                    return {}
                },
                methods: {
                    onEdit: function (dp: DepartmentSingle) {
                        // console.log("[debug,this is comp]",dp.Name,":[dp]")
                        this.$emit('onEdit', dp)
                    }
                }
            })
            //
            var dpTree: DepartmentSingle[] = [
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
                        dpTree: dpTree,
                        newName: proj ? proj.Name : '',
                    },
                    methods: {
                        onClose: function () {
                            $(this.$el).hide()
                        },
                        onEditName: () => {

                        },
                        // onEdit: (e, dp: DepartmentSingle) => {
                        onEdit: (dp: DepartmentSingle) => {
                            // console.log("[debug]",dp.Name,dp.Did)
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
    ShowDepartmentSingle(dp: DepartmentSingle) {
        Loader.LoadVueTemplate(this.VuePath + "DepartmentEdit", (tpl: string) => {
            var allDepartmentList: DepartmentSingle[] = []
            var vue = new Vue(
                {
                    template: tpl,
                    data: {
                        department: dp, fullName: "", newName: dp.Name,
                        allDepartmentList: this.GetAllDepartmentList(this.VueProjectSingle.dpTree),
                        positionList: [
                            { Posid: 1, Did: 2, Name: '美术主管' },
                            { Posid: 2, Did: 2, Name: 'UI' },
                            { Posid: 3, Did: 2, Name: '原画' },
                            { Posid: 4, Did: 2, Name: '角色' },
                        ],
                    },
                    methods: {
                        onClose: function () {
                        },
                        onEdit: (e, pos: PositionSingle) => {
                        },
                        onDel: (e, pos: PositionSingle, index: int) => {
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

    GetAllDepartmentList(dpTree: DepartmentSingle[]): DepartmentSingle[] {
        var rs: DepartmentSingle[] = []
        for (var i = 0; i < dpTree.length; i++) {
            var dp = dpTree[i]
            rs.push(dp)
            if (dp.Children.length > 0) {
                rs = rs.concat(this.GetAllDepartmentList(dp.Children))
            }
        }
        return rs;
    }
}

var ManagerManager = new ManagerManagerClass()