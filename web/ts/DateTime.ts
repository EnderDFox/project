//日期控件
class DateTimeClass{
	//日期
	Date:Date = new Date()
	//范围
	Range:Date
	//回调
	CallFunc:Function
	//元素
	InputEle:HTMLElement
	//中文日期
	WeekMap = ['一','二','三','四','五','六','日']
	//初始化
	Init(){
		//创建数据
		this.CreateTable()
		//绑定事件
		this.BindActions()
	}
	//显示控件
	Open(ele:HTMLInputElement,str,func){
		//回调
		this.CallFunc = func
		//元素
		this.InputEle = ele
		//设置时间
		this.SetDate(str)
		//填内容
		this.FillDate()
		//设置位置
		this.SetPosition()
	}
	//设置位置
	SetPosition(){
		var plan = $('#dateTime')
		var left = $(this.InputEle).offset().left - plan.outerWidth() - 2
		var top = $(this.InputEle).offset().top
		plan.css({top:top,left:left}).show()
	}
	//设置时间
	SetDate(str:string){
		if(!str){
			str = new Date().format()
		}
		var info = str.split('-')
		var Y = parseInt(info[0])
		var M = parseInt(info[1])-1
		var D = parseInt(info[2])
		this.Date = new Date(Y,M,D)
		this.Range = new Date(Y,M,D)
	}
	//创建数据
	CreateTable(){
		var html = ''
		//头
		html+= '<div class="head"> \
			<div class="left"><div class="arrow-left"></div></div> \
			<div class="title"></div> \
			<div class="right"><div class="arrow-right"></div></div> \
		</div>'
		//周
		html+= '<div class="week">'
		$(this.WeekMap).each(function(k,v){
			html+= '<div>'+v+'</div>'
		})
		html+= '</div>'
		//日
		html+= '<div class="days">'
		for(var i=0;i<42;i++){
			html+= '<div></div>'
		}
		html+= '</div>'
		html+= '<div class="clear"></div>'
		$('#dateTime').html(html)
	}
	//填内容
	FillDate(){
		var now = new Date()
		var plan = $('#dateTime')
		var begin = new Date(this.Date.getFullYear(),this.Date.getMonth(),1)
		var day = begin.getDay()
		var month = begin.getMonth()
		//标题
		plan.find('.title').html(begin.getFullYear()+'年'+((month+1)<10?('0'+(month+1)):(month+1))+'月')
		if(day == 0){
			day = 7
		}
		begin.setDate(-day+1)
		//内容
		var list = plan.find('.days div').removeClass()
		for(var i=0;i<42;i++){
			begin.setDate(begin.getDate()+1)
			var dNum = begin.getDate()
			var mNum = begin.getMonth()+1
			var d = dNum<10?'0'+dNum:dNum.toString()
			var m = mNum<10?'0'+mNum:mNum.toString()
			var e = list.eq(i).html(d)
			if(month != begin.getMonth()){
				e.addClass('notin')
			}
			//选中日期
			if(this.Range.getFullYear() == begin.getFullYear() && this.Range.getMonth() == begin.getMonth() && this.Range.getDate() == begin.getDate()){
				e.addClass('range')
			}
			//今天日期
			if(now.getFullYear() == begin.getFullYear() && now.getMonth() == begin.getMonth() && now.getDate() == begin.getDate()){
				e.addClass('today')
			}
			e.data('date',begin.getFullYear()+'-'+m+'-'+d)
		}
	}
	//绑定事件
	BindActions(){
		var plan = $('#dateTime')
		//日期选择
		plan.find('.days').unbind().delegate('div','click',function(){
			DateTime.CallFunc($(this).data('date'))
			DateTime.HideDate()
		})
		//左右翻页
		plan.find('.head').unbind().delegate('div','click',function(){
			var type = $(this).attr('class')
			switch(type){
				case 'left':
					DateTime.UpdateDate(0,-1,0)
					DateTime.FillDate()
					break
				case 'right':
					DateTime.UpdateDate(0,1,0)
					DateTime.FillDate()
					break
			}
		})
	}
	//修改日期
	UpdateDate(y:number,m:number,d:number){
		var Y = this.Date.getFullYear()
		var M = this.Date.getMonth()
		var D = this.Date.getDate()
		this.Date = new Date(Y+y,M+m,D+d)
	}
	//关闭
	HideDate(){
		$('#dateTime').fadeOut(Config.FadeTime)
	}
}

var DateTime = new DateTimeClass()