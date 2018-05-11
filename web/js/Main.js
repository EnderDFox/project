//入口类
var Main = {
	//终端判断
	IsPc:true,
	//鼠标方向0左2右
	MouseDir:0,
	//内容对象
	Content:null,
	//加载对象
	LoadBar:null,
	//初始化
	Init:function(){
		//屏蔽右键
		$(document).bind('contextmenu',function(e){
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
		if(this.IsPc){
			this.MouseDir = 2
		}
		//模板填入
		Templet.Init()
		//内容元素
		this.Content = $('#content')
		//加载对象
		this.LoadBar = $('#loading .bar')
		//日历空间
		DateTime.Init()
		//搜索组件
		Search.Init()
		//导航组件
		ProjectNav.Init()
		//设置名字
		User.SetName()
	},
	//渲染
	Draw:function(html){
		//$('html').scrollTop(0).scrollLeft(0)
		window.scrollTo(0,0)
		this.Content.empty().html(html)
		this.Clear()
		return this.Content
	},
	//过度
	Over:function(func){
		this.LoadBar.stop().css({'width':'0%','opacity':1}).animate({'width':'35%'},100,func).animate({'width':'75%'},250)
		return this.Content
	},
	//清理
	Clear:function(){
		this.LoadBar.stop().animate({'width':'100%'},100).animate({'opacity':0},100)
	}
}