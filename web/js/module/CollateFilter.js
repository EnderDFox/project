//晨会筛选
var CollateFilterClass = /** @class */ (function () {
    function CollateFilterClass() {
        //数据包
        this.Pack = { BeginDate: '', EndDate: '' };
    }
    //初始化
    CollateFilterClass.prototype.Init = function () {
        //数据初始
        this.PackInit();
        //填充数据
        this.FillInput();
        //绑定事件
        this.BindActions();
    };
    //搜索初始化
    CollateFilterClass.prototype.PackInit = function () {
        this.Pack.BeginDate = Common.GetDayDate(1);
        this.Pack.EndDate = Common.GetDayDate(7);
    };
    //填充Input
    CollateFilterClass.prototype.FillInput = function () {
        var plan = $('#workFilter');
        $.each(this.Pack, function (k, v) {
            plan.find('input[name="' + k + '"]').val(v);
        });
    };
    //填充Pack
    CollateFilterClass.prototype.FillPack = function () {
        var _this = this;
        var plan = $('#workFilter');
        plan.find('input').each(function (k, v) {
            _this.Pack[v.name] = v.value;
        });
    };
    //获取数据
    CollateFilterClass.prototype.GetPack = function () {
        var param = {
            BeginDate: this.Pack.BeginDate,
            EndDate: this.Pack.EndDate
        };
        return param;
    };
    //绑定事件
    CollateFilterClass.prototype.BindActions = function () {
        var _this = this;
        //面板事件
        var plan = $('#workFilter');
        plan.find('.confirm').unbind().click(function () {
            _this.FillPack();
            Main.Over(function () {
                CollatePanel.Index();
            });
            CollatePanel.HideMenu();
            plan.fadeOut(Config.FadeTime);
        });
        plan.find('.cancel,.close').unbind().click(function () {
            plan.fadeOut(Config.FadeTime);
            DateTime.HideDate();
        });
        //关闭日期
        plan.unbind().mousedown(function (e) {
            if ($(e.currentTarget).attr('class') != 'date') {
                DateTime.HideDate();
            }
        });
        //日期绑定
        plan.find('.date').unbind().click(function (e) {
            var el = e.currentTarget;
            DateTime.Open(el, $(el).val(), function (date) {
                $(el).val(date);
            });
        });
    };
    //显示面板
    CollateFilterClass.prototype.ShowFilter = function (o, e) {
        var plan = $('#workFilter');
        var top = $(o).offset().top + 50;
        var left = $(o).offset().left - plan.outerWidth();
        plan.css({ top: top, left: left }).show();
    };
    return CollateFilterClass;
}());
var CollateFilter = new CollateFilterClass();
//# sourceMappingURL=CollateFilter.js.map