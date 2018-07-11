/** 管理项目 部门 职位 权限 */

class ManagerManagerClass {
    VuePath = "manager/"
    dpTree: DepartmentSingle[] = [
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
    VueProjectList: CombinedVueInstance1<{ projectList: ProjectSingle[] }>
    VueProjectSingle: CombinedVueInstance1<{ project: ProjectSingle, newName: string, dpTree: DepartmentSingle[] }>
    VueDepartmentSingle: CombinedVueInstance1<{ department: DepartmentSingle, fullName: string, newName: string, allDepartmentList: DepartmentSingle[], positionList: PositionSingle[] }>
    Show() {
        this.ShowProjectList()
        // this.ShowPositionSingle({ Posid: 2, Did: 2, Name: 'UI' })
        this.ShowUserList()
    }
    ShowProjectList() {
        Loader.LoadVueTemplate(this.VuePath + "ProjectList", (tpl: string) => {
            var vue = new Vue(
                {
                    template: tpl,
                    data: {
                        projectList: ManagerData.ProjectList,
                    },
                    methods: {
                        onClose: function () {
                            $(this.$el).hide()
                        },
                        onEdit: (e, proj: ProjectSingle) => {
                            this.ShowProjectEdit(proj)
                        },
                        onDel: (e, proj: ProjectSingle, index: int) => {
                            this.VueProjectList.projectList.splice(index, 1)
                        },
                        onAdd: () => {
                            this.ShowProjectEdit(null)
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
    ShowProjectEdit(proj: ProjectSingle) {
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
            var vue = new Vue(
                {
                    template: tplList[1],
                    data: {
                        project: proj,
                        dpTree: this.dpTree,
                        newName: proj ? proj.Name : '',
                        auth: ManagerData.MyAuth,
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
            Common.InsertIntoPageDom(vue.$el)
            // Common.AlginCenterInWindow(vue.$el)
            $(vue.$el).show()
        })
    }
    ShowDepartmentSingle(dp: DepartmentSingle) {
        Loader.LoadVueTemplate(this.VuePath + "DepartmentEdit", (tpl: string) => {
            var vue = new Vue(
                {
                    template: tpl,
                    data: {
                        department: dp, fullName: dp.Name, newName: dp.Name,
                        allDepartmentList: this.GetAllDepartmentList(this.dpTree),
                        positionList: [
                            { Posid: 1, Did: 2, Name: '美术主管' },
                            { Posid: 2, Did: 2, Name: 'UI' },
                            { Posid: 3, Did: 2, Name: '原画' },
                            { Posid: 4, Did: 2, Name: '角色' },
                        ],
                    },
                    methods: {
                        departmentOption: (dp: DepartmentSingle) => {
                            if (dp.depth == 0) {
                                return dp.Name
                            } else {
                                var rs: string = ''
                                for (var i = 0; i < dp.depth; i++) {
                                    rs += '-'
                                }
                                // rs += '└';
                                rs += dp.Name
                                return rs
                            }
                        },
                        onClose: function () {
                            $(this.$el).hide()
                        },
                        onEdit: (e, pos: PositionSingle) => {
                            this.ShowPositionSingle(pos)
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

    ShowPositionSingle(pos: PositionSingle) {
        Loader.LoadVueTemplate(this.VuePath + "PositionEdit", (tpl: string) => {
            var vue = new Vue(
                {
                    template: tpl,
                    data: {
                        pos: pos, fullName: pos.Name, newName: pos.Name.toString(),
                        allDepartmentList: this.GetAllDepartmentList(this.dpTree),
                        showKind: 1,
                        userList: ManagerData.UserList.slice(0, 7),
                        authorityModuleList: [
                            {
                                Modid: 1, Name: '模块A', AuthorityList: [
                                    { Aid: 101, Name: '权限A1' },
                                    { Aid: 102, Name: '权限A2' },
                                    { Aid: 103, Name: '权限A3' },
                                    { Aid: 104, Name: '权限A4' },
                                    { Aid: 105, Name: '权限A5' },
                                    { Aid: 106, Name: '权限A6' },
                                    { Aid: 107, Name: '权限A7' },
                                    { Aid: 108, Name: '权限A8' },
                                    { Aid: 109, Name: '权限A9' },
                                    { Aid: 110, Name: '权限A10' },
                                ]
                            },
                            {
                                Modid: 2, Name: '模块B', AuthorityList: [
                                    { Aid: 21, Name: '权限B1' },
                                    { Aid: 22, Name: '权限B2' },
                                ]
                            },
                            {
                                Modid: 3, Name: '模块C', AuthorityList: [
                                    { Aid: 31, Name: '权限C1' },
                                    { Aid: 32, Name: '权限C2' },
                                    { Aid: 33, Name: '权限C3' },
                                    { Aid: 34, Name: '权限C4' },
                                    { Aid: 35, Name: '权限C5' },
                                ]
                            },
                        ]
                    },
                    methods: {
                        departmentOption: (dp: DepartmentSingle) => {
                            if (dp.depth == 0) {
                                return dp.Name
                            } else {
                                var rs: string = ''
                                for (var i = 0; i < dp.depth; i++) {
                                    rs += '-'
                                }
                                // rs += '└';
                                rs += dp.Name
                                return rs
                            }
                        },
                        onClose: function () {
                            $(this.$el).hide()
                        },
                        onEdit: (e, pos: PositionSingle) => {
                            this.ShowPositionSingle(pos)
                        },
                        onDel: (e, pos: PositionSingle, index: int) => {
                        },
                        onAdd: () => {
                        }
                    },
                }
            ).$mount()
            // this.VueDepartmentSingle = vue
            //#show
            Common.InsertBeforeDynamicDom(vue.$el)
            Common.AlginCenterInWindow(vue.$el)
            $(vue.$el).show()
        })
    }
    ShowUserList() {
        Loader.LoadVueTemplate(this.VuePath + "UserList", (tpl: string) => {
            var vue = new Vue(
                {
                    template: tpl,
                    data: {
                        projectList: [
                            { Pid: 1, Name: 'Amazing' },
                            { Pid: 2, Name: 'Maxwell' },
                        ],
                        userList: ManagerData.UserList,
                        allDepartmentList: this.GetAllDepartmentList(this.dpTree),
                        positionList: [
                            { Posid: 1, Did: 2, Name: '美术主管' },
                            { Posid: 2, Did: 2, Name: 'UI' },
                            { Posid: 3, Did: 2, Name: '原画' },
                            { Posid: 4, Did: 2, Name: '角色' },
                        ],
                    },
                    methods: {
                        departmentOption: (dp: DepartmentSingle) => {
                            if (dp.depth == 0) {
                                return dp.Name
                            } else {
                                var rs: string = ''
                                for (var i = 0; i < dp.depth; i++) {
                                    rs += '-'
                                }
                                // rs += '└';
                                rs += dp.Name
                                return rs
                            }
                        },
                        onClose: function () {
                            $(this.$el).hide()
                        },
                        onDel: (e, pos: PositionSingle, index: int) => {
                        },
                        onAdd: () => {
                        }
                    },
                }
            ).$mount()
            // this.VueDepartmentSingle = vue
            //#show
            Common.InsertBeforeDynamicDom(vue.$el)
            Common.AlginCenterInWindow(vue.$el)
            $(vue.$el).show()
        })
    }
}

var ManagerManager = new ManagerManagerClass()