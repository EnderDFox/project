/** 管理项目 部门 职位 权限 */
var ManagerManagerClass = /** @class */ (function () {
    function ManagerManagerClass() {
        this.VuePath = "manager/";
    }
    ManagerManagerClass.prototype.Show = function () {
        this.ShowProjectList();
    };
    ManagerManagerClass.prototype.ShowProjectList = function () {
        var _this = this;
        Loader.LoadVueTemplate(this.VuePath + "ProjectList", function (tpl) {
            var vue = new Vue({
                template: tpl,
                data: {
                    projectList: [
                        { Pid: 1, Name: 'Amazing' },
                        { Pid: 2, Name: 'Maxwell' },
                    ],
                },
                methods: {
                    onClose: function () {
                        $(this.$el).hide();
                    },
                    onEdit: function (e, proj) {
                        _this.ShowProjectSingle(proj);
                    },
                    onDel: function (e, proj, index) {
                        _this.VueProjectList.projectList.splice(index, 1);
                    },
                    onAdd: function () {
                        _this.ShowProjectSingle(null);
                    }
                },
            }).$mount();
            _this.VueProjectList = vue;
            //#show
            Common.InsertBeforeDynamicDom(vue.$el);
            Common.AlginCenterInWindow(vue.$el);
            $(vue.$el).show();
        });
    };
    ManagerManagerClass.prototype.ShowProjectSingle = function (proj) {
        var _this = this;
        Loader.LoadVueTemplateList([this.VuePath + "DepartmentItemComponent", this.VuePath + "ProjectEdit"], function (tplList) {
            //注册组件
            Vue.component('DepartmentItemComponent', {
                template: tplList[0],
                props: {
                    dp: Object
                },
                data: function () {
                    return {};
                },
                methods: {
                    onEdit: function (dp) {
                        // console.log("[debug,this is comp]",dp.Name,":[dp]")
                        this.$emit('onEdit', dp);
                    }
                }
            });
            //
            var dpTree = [
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
            ];
            var vue = new Vue({
                template: tplList[1],
                data: {
                    project: proj,
                    dpTree: dpTree,
                    newName: proj ? proj.Name : '',
                },
                methods: {
                    onClose: function () {
                        $(this.$el).hide();
                    },
                    onEditName: function () {
                    },
                    // onEdit: (e, dp: DepartmentSingle) => {
                    onEdit: function (dp) {
                        // console.log("[debug]",dp.Name,dp.Did)
                        _this.ShowDepartmentSingle(dp);
                    },
                    onDel: function (e, proj, index) {
                    },
                    onSubmit: function () {
                    }
                },
            }).$mount();
            _this.VueProjectSingle = vue;
            //#show
            Common.InsertBeforeDynamicDom(vue.$el);
            Common.AlginCenterInWindow(vue.$el);
            $(vue.$el).show();
        });
    };
    ManagerManagerClass.prototype.ShowDepartmentSingle = function (dp) {
        var _this = this;
        Loader.LoadVueTemplate(this.VuePath + "DepartmentEdit", function (tpl) {
            var allDepartmentList = [];
            var vue = new Vue({
                template: tpl,
                data: {
                    department: dp, fullName: "", newName: dp.Name,
                    allDepartmentList: _this.GetAllDepartmentList(_this.VueProjectSingle.dpTree),
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
                    onEdit: function (e, pos) {
                    },
                    onDel: function (e, pos, index) {
                    },
                    onAdd: function () {
                    }
                },
            }).$mount();
            _this.VueDepartmentSingle = vue;
            //#show
            Common.InsertBeforeDynamicDom(vue.$el);
            Common.AlginCenterInWindow(vue.$el);
            $(vue.$el).show();
        });
    };
    ManagerManagerClass.prototype.GetAllDepartmentList = function (dpTree) {
        var rs = [];
        for (var i = 0; i < dpTree.length; i++) {
            var dp = dpTree[i];
            rs.push(dp);
            if (dp.Children.length > 0) {
                rs = rs.concat(this.GetAllDepartmentList(dp.Children));
            }
        }
        return rs;
    };
    return ManagerManagerClass;
}());
var ManagerManager = new ManagerManagerClass();
//# sourceMappingURL=ManagerManager.js.map