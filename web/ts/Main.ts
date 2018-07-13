//入口类
class MainClass {
    //终端判断
    IsPc: boolean
    //鼠标方向0左2右
    MouseDir: int = 0
    //内容对象
    Content:JQuery
    //加载对象
    LoadBar:JQuery
    //初始化
    Init() {
        //屏蔽右键
        $(document).bind('contextmenu', function (e) {
            return false
        })
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
        this.IsPc = Common.IsPC()
        if (this.IsPc) {
            this.MouseDir = 2//使用右键
        }
        //模板填入
        Templet.Init(()=>{
            //内容元素
            this.Content = $('#content')
            //加载对象
            this.LoadBar = $('#loading .bar')
            //日历空间
            DateTime.Init()
            //导航组件
            ProjectNav.Init()
            //设置名字
            User.ShowName()
        })
    }
    //渲染
    Draw(html) {
        //$('html').scrollTop(0).scrollLeft(0)
        window.scrollTo(0, 0)
        this.Content.empty().html(html)
        this.Clear()
        return this.Content
    }
    //过度
    Over(func) {
        this.LoadBar.stop().css({ 'width': '0%', 'opacity': 1 }).animate({ 'width': '35%' }, 100, func).animate({ 'width': '75%' }, 250)
        return this.Content
    }
    //清理
    Clear() {
        this.LoadBar.stop().animate({ 'width': '100%' }, 100).animate({ 'opacity': 0 }, 100)
    }
}

var Main = new MainClass()