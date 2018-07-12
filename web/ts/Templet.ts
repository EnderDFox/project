//http://cn.piliapp.com/symbol/
//模板内容
class TempleteClass {
    //初始化
    Init(callback: () => void) {
        Loader.LoadVueTemplate(Common.VuePath + 'Project', (tpl: string) => {
            //填入模板
            $(tpl).appendTo('body')
            //部门用户
            this.CreateUsersMenu()
            //
            callback()
        })
    }
    //部门用户
    CreateUsersMenu() {
        var html = ''
        var d0Len = Data.DepartmentLoop.length
        $.each(Data.DepartmentLoop, function (d0Index: number, d0: DepartmentInfo) {
            html += `<div class="row extends"> 
						<div class="ico"></div> 
						<div class="txt">${d0.info.Name}</div> 
                        <div class="dev">`
            var htmlpSread = ``
            var spreadTop = 0
            if (d0.list.length > 0) {//有子部门
                var d1Len = d0.list.length
                if (d0Index + d1Len > d0Len) {
                    spreadTop = (d0Index + d1Len) - d0Len
                }
                $.each(d0.list, function (d1Index: number, d1: DepartmentInfo) {
                    //子部门中的user
                    var htmlSpreadUser = ``
                    var spreadTopUser = 0
                    var userLen = d1.user.length
                    if (d1Index + userLen > d1Len) {
                        spreadTopUser = (d1Index + userLen) - d1Len
                    }
                    $.each(d1.user, function (k, v) {
                        htmlSpreadUser += `<div class="row" uid="${v.Uid}"> 
                                                <div class="ico"></div> 
                                                <div class="txt">${v.Name}</div> 
                                                <div class="dev"></div> 
                                           </div>`
                    })
                    htmlpSread += `<div class="row extends"> 
                                        <div class="ico"></div> 
                                        <div class="txt">${d1.info.Name}</div> 
                                        <div class="dev"> 
                                            <div class="arrow-right"></div> 
                                            <div class="spread" style="margin-top:-${spreadTopUser * 30}px;">${htmlSpreadUser}</div> 
                                        </div> 
                                   </div>`
                })
            } else {//没有子部门显示user
                var userLen = d0.user.length
                if (d0Index + userLen > d0Len) {
                    spreadTop = (d0Index + userLen) - d0Len
                }
                $.each(d0.user, function (k, u: UserSingle) {
                    htmlpSread += `<div class="row" uid="${u.Uid}">
                                <div class="ico"></div>
                                <div class="txt">${u.Name}</div>
                                <div class="dev"></div>
                            </div>`
                })
            }
            html += `<div class="arrow-right"></div> 
                   <div class="spread" style="margin-top:-${spreadTop * 30}px;">${htmlpSread}</div>` //<div class="spread"
            html += `</div>
                </div>`
        })
        $('#menuUser').html(html)
    }
}


var Templet = new TempleteClass()
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