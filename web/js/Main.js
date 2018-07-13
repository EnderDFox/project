//入口类
var MainClass = /** @class */ (function () {
    function MainClass() {
        //鼠标方向0左2右
        this.MouseDir = 0;
    }
    //初始化
    MainClass.prototype.Init = function () {
        var _this = this;
        //屏蔽右键
        $(document).bind('contextmenu', function (e) {
            return false;
        });
        /*
        .bind('mousewheel',function(e){
            e.preventDefault();
            var csp = window.pageYOffset
            var wd = e.originalEvent.wheelDelta
            window.scrollTo(window.pageXOffset, csp - wd)
            return false
        })
        */
        //终端判断
        this.IsPc = Common.IsPC();
        if (this.IsPc) {
            this.MouseDir = 2; //使用右键
        }
        //模板填入
        Templet.Init(function () {
            //内容元素
            _this.Content = $('#content');
            //加载对象
            _this.LoadBar = $('#loading .bar');
            //日历空间
            DateTime.Init();
            //导航组件
            ProjectNav.Init();
            //设置名字
            User.ShowName();
        });
    };
    //渲染
    MainClass.prototype.Draw = function (html) {
        //$('html').scrollTop(0).scrollLeft(0)
        window.scrollTo(0, 0);
        this.Content.empty().html(html);
        this.Clear();
        return this.Content;
    };
    //过度
    MainClass.prototype.Over = function (func) {
        this.LoadBar.stop().css({ 'width': '0%', 'opacity': 1 }).animate({ 'width': '35%' }, 100, func).animate({ 'width': '75%' }, 250);
        return this.Content;
    };
    //清理
    MainClass.prototype.Clear = function () {
        this.LoadBar.stop().animate({ 'width': '100%' }, 100).animate({ 'opacity': 0 }, 100);
    };
    return MainClass;
}());
var Main = new MainClass();
//# sourceMappingURL=Main.js.map