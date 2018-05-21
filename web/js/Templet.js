//http://cn.piliapp.com/symbol/
//模板内容
var Templet = {
	Tpl:{'Project':'<!--项目导航--> \
<div id="projectNav" class="commonNav"> \
	<div class="user"> \
		<div id="uname" class="uname"></div> \
		<div id="umsgs" class="umsgs">0</div> \
	</div> \
	<div class="head"> \
		<ul class="tools"> \
			<li type="ProfilePanel">日程</li> \
			<li type="ProcessPanel">进度</li> \
			<li type="CollatePanel">晨会</li> \
		</ul> \
	</div> \
	<div class="body"> \
		<ul class="menu"> \
			<li did="0">版本</li> \
			<li did="-1">全部</li> \
			<li did="1">策划</li> \
			<li did="2">美术</li> \
			<li did="4">前端</li> \
			<li did="5">后端</li> \
			<li did="6">质检</li> \
			<li did="14">监修</li> \
			<li did="16">工具</li> \
		</ul> \
	</div> \
	<div class="foot"> \
		<ul class="tools"> \
			<li id="projectSer">筛选</li> \
		</ul> \
		<ul class="tools"> \
			<li id="saveFile">保存</li> \
			<li style="display:none;">统计</li> \
		</ul> \
		<ul class="tools tpl_edit"> \
			<li>编辑模版</li> \
		</ul> \
		<ul class="tools test_fox" style="display:none"> \
			<li>Test Fox</li> \
		</ul> \
	</div> \
</div> \
 \
<!--进度条--> \
<div id="loading" class="commonLoading"><div class="bar"></div></div> \
 \
<!--内容区域--> \
<div id="content" class="commonBody"></div> \
 \
<!--Tips--> \
<div class="workTips" id="workTips"></div> \
 \
<!--工作菜单--> \
<div class="commonMenu" id="menuDay"> \
	<div class="row" type="work" status="0"> \
		<div class="ico"></div> \
		<div class="txt">工作(GZ)</div> \
		<div class="dev"></div> \
	</div> \
	<div class="row" type="finish" status="3"> \
		<div class="ico"></div> \
		<div class="txt">完成(WC)</div> \
		<div class="dev"></div> \
	</div> \
	<div class="row" type="edit"> \
		<div class="ico"></div> \
		<div class="txt">编辑(BJ)</div> \
		<div class="dev"></div> \
	</div> \
	<div class="row extends" type="status"> \
		<div class="ico"></div> \
		<div class="txt">状态(ZT)</div> \
		<div class="dev"> \
			<div class="arrow-right"></div> \
			<div class="spread"> \
				<div class="row" type="delay" status="1"> \
					<div class="ico"></div> \
					<div class="txt">延期(YQ)</div> \
					<div class="dev"></div> \
				</div> \
				<div class="row" type="optimize" status="5"> \
					<div class="ico"></div> \
					<div class="txt">优化(YH)</div> \
					<div class="dev"></div> \
				</div> \
				<div class="row" type="wait" status="2"> \
					<div class="ico"></div> \
					<div class="txt">等待(DD)</div> \
					<div class="dev"></div> \
				</div> \
				<div class="row" type="rest" status="4"> \
					<div class="ico"></div> \
					<div class="txt">请假(QJ)</div> \
					<div class="dev"></div> \
				</div> \
			</div> \
		</div> \
	</div> \
	<div class="row" type="score"> \
		<div class="ico"></div> \
		<div class="txt">评价(PJ)</div> \
		<div class="dev"></div> \
	</div> \
	<div class="row" type="upload"> \
		<div class="ico"></div> \
		<div class="txt">附件(FJ)</div> \
		<div class="dev"></div> \
	</div> \
	<div class="row" type="clear"> \
		<div class="ico"></div> \
		<div class="txt">清空(QK)</div> \
		<div class="dev"></div> \
	</div> \
</div> \
 \
<!--流程菜单--> \
<div class="commonMenu" id="menuLink"> \
	<div class="row" type="color"> \
		<div class="ico"></div> \
		<div class="txt">背景(BJ)</div> \
		<div class="dev"> \
			<div class="arrow-right"></div> \
			<div class="pluginColor"> \
				<div class="none"></div> \
				<div class="bg_1"></div> \
				<div class="bg_2"></div> \
				<div class="bg_3"></div> \
				<div class="bg_4"></div> \
				<div class="bg_5"></div> \
				<div class="bg_6"></div> \
				<div class="bg_7"></div> \
				<div class="bg_8"></div> \
			</div> \
		</div> \
	</div> \
	<div class="row" type="edit"> \
		<div class="ico"></div> \
		<div class="txt">编辑(BJ)</div> \
		<div class="dev"></div> \
	</div> \
	<div class="row" type="insert"> \
		<div class="ico"></div> \
		<div class="txt">插入(CR)</div> \
		<div class="dev"></div> \
	</div> \
	<div class="row" type="forward"> \
		<div class="ico"></div> \
		<div class="txt">上移(SY)</div> \
		<div class="dev"></div> \
	</div> \
	<div class="row" type="backward"> \
		<div class="ico"></div> \
		<div class="txt">下移(XY)</div> \
		<div class="dev"></div> \
	</div> \
	<div class="row" type="store"> \
		<div class="ico"></div> \
		<div class="txt">归档(GD)</div> \
		<div class="dev"></div> \
	</div> \
	<div class="row" type="delete"> \
		<div class="ico"></div> \
		<div class="txt">删除(SC)</div> \
		<div class="dev"></div> \
	</div> \
</div> \
 \
<!--人员菜单--> \
<div class="commonMenu" id="menuUser"></div> \
 \
<!--功能菜单--> \
<div class="commonMenu" id="menuMode"> \
	<div class="row" type="color"> \
		<div class="ico"></div> \
		<div class="txt">背景(BJ)</div> \
		<div class="dev"> \
			<div class="arrow-right"></div> \
			<div class="pluginColor"> \
				<div class="none"></div> \
				<div class="bg_1"></div> \
				<div class="bg_2"></div> \
				<div class="bg_3"></div> \
				<div class="bg_4"></div> \
				<div class="bg_5"></div> \
				<div class="bg_6"></div> \
				<div class="bg_7"></div> \
				<div class="bg_8"></div> \
			</div> \
		</div> \
	</div> \
	<div class="row" type="edit"> \
		<div class="ico"></div> \
		<div class="txt">编辑(BJ)</div> \
		<div class="dev"></div> \
	</div> \
	<div class="row" type="insert"> \
		<div class="ico"></div> \
		<div class="txt">插入(CR)</div> \
		<div class="dev"></div> \
	</div> \
	<div class="row" type="forward"> \
		<div class="ico"></div> \
		<div class="txt">上移(SY)</div> \
		<div class="dev"></div> \
	</div> \
	<div class="row" type="backward"> \
		<div class="ico"></div> \
		<div class="txt">下移XY)</div> \
		<div class="dev"></div> \
	</div> \
	<div class="row" type="store"> \
		<div class="ico"></div> \
		<div class="txt">归档(GD)</div> \
		<div class="dev"></div> \
	</div> \
	<div class="row" type="delete"> \
		<div class="ico"></div> \
		<div class="txt">删除(SC)</div> \
		<div class="dev"></div> \
	</div> \
</div> \
 \
<!--编辑流程--> \
<ul class="commonDialog editLink" id="editLink"> \
	<li class="head"> \
		<div class="title">编辑流程</div> \
		<div class="close">x</div> \
	</li> \
	<li class="body"> \
		<div class="text"><textarea placeholder="填写流程名称"></textarea></div> \
	</li> \
	<li class="foot"> \
		<div class="buttons"> \
			<button class="confirm">确定</button> \
			<button class="cancel">取消</button> \
		</div> \
	</li> \
</ul> \
 \
<!--编辑功能--> \
<ul class="commonDialog editMode" id="editMode"> \
	<li class="head"> \
		<div class="title">编辑功能</div> \
		<div class="close">x</div> \
	</li> \
	<li class="body"> \
		<div class="text"><textarea placeholder="填写功能名称"></textarea></div> \
	</li> \
	<li class="body"> \
		<div class="row"> \
			<div class="num">版本 \
				<span id="place_versionSelect"/>\
				<!--<input type="text" class="ver" placeholder="版号" />--> \
			</div> \
			<div class="div_version_edit"> \
				<button class="version_edit" title="编辑版本">编辑</button> \
			</div> \
		</div> \
	</li> \
	<li class="body tpl_li"> \
		<div class="row"> \
			<div class="tpl_label">模板 \
				<span id="place_tplModeSelect"/>\
			</div> \
			<div class="div_tpl_edit"> \
				<button class="tpl_edit" title="编辑模板">编辑</button> \
			</div> \
		</div> \
	</li> \
	<li class="foot"> \
		<div class="buttons"> \
			<button class="confirm">确定</button> \
			<button class="cancel">取消</button> \
		</div> \
	</li> \
</ul> \
 \
<!--编辑评价--> \
<ul class="commonDialog editScore" id="editScore"> \
	<li class="head"> \
		<div class="title">编辑评价</div> \
		<div class="close">x</div> \
	</li> \
	<li class="body"> \
		<div class="text"><textarea placeholder="填写评价说明"></textarea></div> \
	</li> \
	<li class="body"> \
		<div class="row select">质量  \
			<select> \
				<option value="0">选择</option> \
				<option value="30">差</option> \
				<option value="60">正常</option> \
				<option value="70">好</option> \
			</select> \
		</div> \
		<div class="row select">效率  \
			<select> \
				<option value="0">选择</option> \
				<option value="30">低</option> \
				<option value="60">正常</option> \
				<option value="70">高</option> \
			</select> \
		</div> \
		<div class="row select">态度  \
			<select> \
				<option value="0">选择</option> \
				<option value="30">差</option> \
				<option value="60">正常</option> \
				<option value="70">好</option> \
			</select> \
		</div> \
	</li> \
	<li class="body"> \
		<div class="fileBox"> \
		</div> \
	</li> \
	<li class="foot"> \
		<div class="buttons"> \
			<button class="confirm">确定</button> \
			<button class="cancel">取消</button> \
		</div> \
	</li> \
</ul> \
 \
<!--编辑日程--> \
<ul class="commonDialog editInfo" id="editInfo"> \
	<li class="head"> \
		<div class="title">编辑日程</div> \
		<div class="close">x</div> \
	</li> \
	<li class="body"> \
		<div class="text"><textarea placeholder="填写日程安排"></textarea></div> \
	</li> \
	<li class="body"> \
		<div class="row"> \
			<div class="num"> \
			分子<input type="text" class="min" maxlength="3" /> \
			分母<input type="text" class="max" maxlength="3" /> \
			标签<input type="text" class="tag" maxlength="1" /> \
			</div> \
		</div> \
	</li> \
	<li class="foot"> \
		<div class="buttons"> \
			<button class="confirm">确定</button> \
			<button class="cancel">取消</button> \
		</div> \
	</li> \
</ul> \
 \
<!--进度筛选--> \
<ul class="commonDialog stepFilter" id="stepFilter"> \
	<li class="head"> \
		<div class="title">内容筛选</div> \
		<div class="close">x</div> \
	</li> \
	<li class="body"> \
		<ul class="search"> \
			<li> \
				<div class="name">功能版本</div> \
				<div class="info"><input type="text" placeholder="输入版本号" name="Ver" /></div> \
			</li> \
			<li> \
				<div class="name">功能名称</div> \
				<div class="info"><input type="text" placeholder="输入功能名" name="ModeName" /></div> \
			</li> \
			<li> \
				<div class="name">功能归档</div> \
				<div class="info"><input type="text" class="select" stype="ModeStatus" readonly value="进行中的" /> \
				</div> \
			</li> \
			<li> \
				<div class="name">开始日期</div> \
				<div class="info"><input type="text" class="date" placeholder="选择开始日期" name="BeginDate" readonly /></div> \
			</li> \
			<li> \
				<div class="name">结束日期</div> \
				<div class="info"><input type="text" class="date" placeholder="选择结束日期" name="EndDate" readonly /></div> \
			</li> \
			<li> \
				<div class="name">流程名称</div> \
				<div class="info"><input type="text" class="" placeholder="输入流程名" name="LinkName" /></div> \
			</li> \
			<li> \
				<div class="name">流程负责</div> \
				<div class="info"><input type="text" class="user" placeholder="输入负责人" name="LinkUserName" maxlength="6" /></div> \
			</li> \
			<li> \
				<div class="name">流程归档</div> \
				<div class="info"><input type="text" class="select" stype="LinkStatus" readonly value="进行中的" /></div> \
			</li> \
		</ul> \
	</li> \
	<li class="foot"> \
		<div class="buttons"> \
			<button class="confirm">确定</button> \
			<button class="cancel">取消</button> \
		</div> \
	</li> \
</ul> \
 \
<!--晨会筛选--> \
<ul class="commonDialog stepFilter" id="workFilter"> \
	<li class="head"> \
		<div class="title">内容筛选</div> \
		<div class="close">x</div> \
	</li> \
	<li class="body"> \
		<ul class="search"> \
			<li> \
				<div class="name">开始日期</div> \
				<div class="info"><input type="text" class="date" placeholder="选择开始日期" name="BeginDate" readonly /></div> \
			</li> \
			<li> \
				<div class="name">结束日期</div> \
				<div class="info"><input type="text" class="date" placeholder="选择结束日期" name="EndDate" readonly /></div> \
			</li> \
		</ul> \
	</li> \
	<li class="foot"> \
		<div class="buttons"> \
			<button class="confirm">确定</button> \
			<button class="cancel">取消</button> \
		</div> \
	</li> \
</ul> \
 \
<!--动态dom 插入到这个标签的前或后--> \
<ul class="commonDialog" id="dynamicDom"> \
</ul> \
\
<!--时间控件--> \
<div class="dateTime" id="dateTime"></div> \
 \
<!--用户查询--> \
<ul class="searchUser" id="searchUser"></ul> \
 \
<!--晨会菜单--> \
<div class="commonMenu" id="menuStep"> \
	<div class="row" type="finish" inspect="1"> \
		<div class="ico"></div> \
		<div class="txt">完成(WC)</div> \
		<div class="dev"></div> \
	</div> \
	<div class="row" type="last" inspect="2"> \
		<div class="ico"></div> \
		<div class="txt">持续(CX)</div> \
		<div class="dev"></div> \
	</div> \
	<div class="row" type="defer" inspect="3"> \
		<div class="ico"></div> \
		<div class="txt">未完(WW)</div> \
		<div class="dev"></div> \
	</div> \
	<div class="row" type="cancel" inspect="0"> \
		<div class="ico"></div> \
		<div class="txt">取消(QX)</div> \
		<div class="dev"></div> \
	</div> \
</div> \
 \
<!--晨会菜单--> \
<div class="commonMenu" id="menuExtra"> \
	<div class="row" type="edit"> \
		<div class="ico"></div> \
		<div class="txt">编辑(BJ)</div> \
		<div class="dev"></div> \
	</div> \
	<div class="row" type="delete"> \
		<div class="ico"></div> \
		<div class="txt">删除(SC)</div> \
		<div class="dev"></div> \
	</div> \
</div> \
 \
<!--编辑晨会--> \
<ul class="commonDialog addStep" id="addStep"> \
	<li class="head"> \
		<div class="title">晨会内容</div> \
		<div class="close">x</div> \
	</li> \
	<li class="body"> \
		<div class="text"><textarea placeholder="填写内容"></textarea></div> \
	</li> \
	<li class="body"> \
		<div class="row inspect"> \
			<div class="check_1">完成</div> \
			<div class="check_2">持续</div> \
			<div class="check_3">未完</div> \
		</div> \
	</li> \
	<li class="foot"> \
		<div class="buttons"> \
			<button class="confirm">确定</button> \
			<button class="cancel">取消</button> \
		</div> \
	</li> \
</ul> \
 \
<!--警告提示--> \
<ul class="commonDialog commonWarning" id="warning"> \
<li class="head"> \
		<div class="title">删除警告</div> \
		<div class="close">x</div> \
	</li> \
	<li class="body"> \
		<div class="tips"></div> \
	</li> \
	<li class="foot"> \
		<div class="buttons"> \
			<button class="confirm">确定</button> \
			<button class="cancel">取消</button> \
		</div> \
	</li> \
</ul> \
 \
 <!--归档菜单--> \
<div class="commonMenu" id="storeMenu"> \
	<div class="row" type="all"> \
		<div class="ico"></div> \
		<div class="txt">选择全部</div> \
		<div class="dev"></div> \
	</div> \
	<div class="row" type="runing"> \
		<div class="ico"></div> \
		<div class="txt">进行中的</div> \
		<div class="dev"></div> \
	</div> \
	<div class="row" type="store"> \
		<div class="ico"></div> \
		<div class="txt">已归档的</div> \
		<div class="dev"></div> \
	</div> \
</div> \
<!--发布菜单--> \
<div class="commonMenu" id="pubMenu"> \
	<div class="row" type="begin"> \
		<div class="ico"></div> \
		<div class="txt">版本开始</div> \
		<div class="dev"></div> \
	</div> \
	<div class="row" type="end"> \
		<div class="ico"></div> \
		<div class="txt">版本完结</div> \
		<div class="dev"></div> \
	</div> \
	<div class="row" type="seal"> \
		<div class="ico"></div> \
		<div class="txt">版本封存</div> \
		<div class="dev"></div> \
	</div> \
	<div class="row" type="delay"> \
		<div class="ico"></div> \
		<div class="txt">版本延期</div> \
		<div class="dev"></div> \
	</div> \
	<div class="row" type="pub"> \
		<div class="ico"></div> \
		<div class="txt">版本发布</div> \
		<div class="dev"></div> \
	</div> \
	<div class="row" type="summary"> \
		<div class="ico"></div> \
		<div class="txt">版本总结</div> \
		<div class="dev"></div> \
	</div> \
	<div class="row" type="del"> \
		<div class="ico"></div> \
		<div class="txt">版本删除</div> \
		<div class="dev"></div> \
	</div> \
</div> \
<!--通知展开--> \
<ul class="commonDialog extraNotice" id="extraNotice"> \
	<li class="head"> \
		<div class="title">通知列表</div> \
		<div class="close">x</div> \
	</li> \
	<li class="body"> \
		<ul class="list"></ul> \
	</li> \
</ul> \
<div id="commonMini" class="commonMini"></div>'},
	//初始化
	Init:function(){
		//填入模板
		$(this.Tpl.Project).appendTo('body')
		//部门用户
		this.CreateUsersMenu()
	},
	//部门用户
	CreateUsersMenu:function(){
		var html = ''
		$.each(Data.DepartmentLoop,function(k,v){
			html+= '<div class="row extends"> \
						<div class="ico"></div> \
						<div class="txt">'+v.info.Name+'</div> \
						<div class="dev"> \
							<div class="arrow-right"></div> \
							<div class="spread">'
							if(v.list.length > 0){
								$.each(v.list,function(k,v){
									html+= '<div class="row extends"> \
												<div class="ico"></div> \
												<div class="txt">'+v.info.Name+'</div> \
												<div class="dev"> \
													<div class="arrow-right"></div> \
													<div class="spread">'
											$.each(v.user,function(k,v){
												html+= '<div class="row" uid="'+v.Uid+'"> \
															<div class="ico"></div> \
															<div class="txt">'+v.Name+'</div> \
															<div class="dev"></div> \
														</div>'
											})
											html+= '</div> \
												</div> \
											</div>'
								})
							}else{
								$.each(v.user,function(k,v){
									html+= '<div class="row" uid="'+v.Uid+'"> \
												<div class="ico"></div> \
												<div class="txt">'+v.Name+'</div> \
												<div class="dev"></div> \
											</div>'
								})
							}
					html+= '</div> \
						</div> \
					</div>'
		})
		$('#menuUser').html(html)
	}
}

/*
http://cn.piliapp.com/symbol/
http://flatuicolors.com
this.cover = "♤";

this.suits = {
	h: "♥",
	c: "♣",
	d: "♦",
	s: "♠",
	j: "★"
};

this.faces = {
	h: ["♞", "♛", "♚"],
	c: ["♞", "♛", "♚"],
	d: ["♞", "♛", "♚"],
	s: ["♞", "♛", "♚"],
	j: ["✰"]
};
*/