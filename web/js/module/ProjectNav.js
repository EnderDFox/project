//项目导航
var ProjectNavClass = /** @class */ (function () {
    function ProjectNavClass() {
        //过滤器
        this.FilterDid = 0;
        //菜单选择
        this.NavMenu = 1;
    }
    //初始化
    ProjectNavClass.prototype.Init = function () {
        //筛选器
        ProcessFilter.Init();
        CollateFilter.Init();
        //初始化
        ProcessPanel.Init();
        VersionManager.Init();
        TemplateManager.Init();
        //初始化
        CollatePanel.Init();
        //绑定事件
        this.BindActions();
        UploadManager.Init();
    };
    //绑定事件
    ProjectNavClass.prototype.BindActions = function () {
        var _this = this;
        var plan = $('#projectNav');
        //子菜单事件
        plan.find('.body').delegate('li', 'click', function (e) {
            ProcessPanel.HideMenu();
            if ($(e.currentTarget).hasClass('on')) { //当前正选中的li,再次点击不处理
                return false;
            }
            plan.find('.body li').removeClass();
            var did = $(e.currentTarget).addClass('on').attr('did');
            _this.FilterDid = parseInt(did);
            //ProcessFilter.ResetPack()
            //ProcessPanel.Index()
            Main.Over(function () {
                ProcessPanel.Index();
            });
            return true;
        });
        //父菜单事件
        plan.find('.head').delegate('li', 'click', function (e) {
            ProcessPanel.HideMenu();
            _this.HideMenu();
            if ($(e.currentTarget).hasClass('on')) {
                return false;
            }
            plan.find('.head li').removeClass();
            $(e.currentTarget).addClass('on');
            var type = $(e.currentTarget).attr('type');
            switch (type) {
                case 'ProfilePanel':
                    _this.ProfilePanelShow();
                    break;
                case 'ProcessPanel':
                    _this.ProcessPanelShow();
                    break;
                case 'CollatePanel':
                    _this.CollatePanelShow();
                    break;
            }
            return true;
        }).find('li:eq(' + this.NavMenu + ')').click();
        //筛选
        $('#projectSer').click(function (e) {
            switch (_this.NavMenu) {
                case 1:
                    ProcessPanel.HideMenu();
                    ProcessFilter.ShowFilter(e.currentTarget, e);
                    break;
                case 2:
                    CollatePanel.HideMenu();
                    CollateFilter.ShowFilter(e.currentTarget, e);
                    break;
            }
        });
        //保存
        $('#saveFile').click(function (e) {
            switch (_this.NavMenu) {
                case 0:
                    break;
                case 1:
                    break;
                case 2:
                    Main.Over(function () {
                        WSConn.sendMsg(C2L.C2L_SAVE_COLLATE, CollateFilter.Pack);
                    });
                    break;
            }
        });
        plan.find(".tpl_edit").click(function (e) {
            TemplateManager.ShowEditTplModeList(e);
        });
        //信息提示
        NoticePanel.BindActions();
    };
    //个人主页
    ProjectNavClass.prototype.ProfilePanelShow = function () {
        var plan = $('#projectNav');
        Main.Over(function () {
            ProfilePanel.Index();
        });
        $('#saveFile,#projectSer').hide();
        plan.find(".tpl_edit").hide();
        this.NavMenu = 0;
    };
    //进度面板
    ProjectNavClass.prototype.ProcessPanelShow = function () {
        var plan = $('#projectNav');
        Main.Over(function () {
            ProcessPanel.Index();
        });
        plan.find('.body li').removeClass().filter('[did="' + this.FilterDid + '"]').addClass('on');
        plan.find('.menu').show();
        $('#projectSer').show();
        $('#saveFile').hide();
        // plan.find(".tpl_edit").show()//暂时不需要这个入口
        plan.find(".tpl_edit").hide();
        this.NavMenu = 1;
        if (Loader.isDebug) {
            plan.find('.test_fox').show().on('click', function (e) {
                // UploadManager.ShowUploadWork(e.currentTarget,101)
            });
        }
    };
    //晨会面板
    ProjectNavClass.prototype.CollatePanelShow = function () {
        var plan = $('#projectNav');
        Main.Over(function () {
            CollatePanel.Index();
        });
        plan.find('.menu').hide();
        $('#saveFile,#projectSer').show();
        plan.find(".tpl_edit").hide();
        this.NavMenu = 2;
    };
    //关闭菜单
    ProjectNavClass.prototype.HideMenu = function () {
        $('#workFilter,#extraNotice').hide();
        ProcessFilter.HideFilter(false);
        Common.HidePullDownMenu();
    };
    return ProjectNavClass;
}());
var ProjectNav = new ProjectNavClass();
//# sourceMappingURL=ProjectNav.js.map