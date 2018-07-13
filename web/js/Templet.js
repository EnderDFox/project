//http://cn.piliapp.com/symbol/
//模板内容
var TempleteClass = /** @class */ (function () {
    function TempleteClass() {
    }
    //初始化
    TempleteClass.prototype.Init = function (callback) {
        var _this = this;
        Loader.LoadVueTemplate(Common.VuePath + 'Project', function (tpl) {
            //填入模板
            $(tpl).appendTo('body');
            //部门用户
            _this.CreateUsersMenu();
            //
            callback();
        });
    };
    //部门用户
    TempleteClass.prototype.CreateUsersMenu = function () {
        var html = '';
        var d0Len = Data.DepartmentLoop.length;
        $.each(Data.DepartmentLoop, function (d0Index, d0) {
            html += "<div class=\"row extends\"> \n\t\t\t\t\t\t<div class=\"ico\"></div> \n\t\t\t\t\t\t<div class=\"txt\">" + d0.info.Name + "</div> \n                        <div class=\"dev\">";
            var htmlpSread = "";
            var spreadTop = 0;
            if (d0.list.length > 0) { //有子部门
                var d1Len = d0.list.length;
                if (d0Index + d1Len > d0Len) {
                    spreadTop = (d0Index + d1Len) - d0Len;
                }
                $.each(d0.list, function (d1Index, d1) {
                    //子部门中的user
                    var htmlSpreadUser = "";
                    var spreadTopUser = 0;
                    var userLen = d1.user.length;
                    if (d1Index + userLen > d1Len) {
                        spreadTopUser = (d1Index + userLen) - d1Len;
                    }
                    $.each(d1.user, function (k, v) {
                        htmlSpreadUser += "<div class=\"row\" uid=\"" + v.Uid + "\"> \n                                                <div class=\"ico\"></div> \n                                                <div class=\"txt\">" + v.Name + "</div> \n                                                <div class=\"dev\"></div> \n                                           </div>";
                    });
                    htmlpSread += "<div class=\"row extends\"> \n                                        <div class=\"ico\"></div> \n                                        <div class=\"txt\">" + d1.info.Name + "</div> \n                                        <div class=\"dev\"> \n                                            <div class=\"arrow-right\"></div> \n                                            <div class=\"spread\" style=\"margin-top:-" + spreadTopUser * 30 + "px;\">" + htmlSpreadUser + "</div> \n                                        </div> \n                                   </div>";
                });
            }
            else { //没有子部门显示user
                var userLen = d0.user.length;
                if (d0Index + userLen > d0Len) {
                    spreadTop = (d0Index + userLen) - d0Len;
                }
                $.each(d0.user, function (k, u) {
                    htmlpSread += "<div class=\"row\" uid=\"" + u.Uid + "\">\n                                <div class=\"ico\"></div>\n                                <div class=\"txt\">" + u.Name + "</div>\n                                <div class=\"dev\"></div>\n                            </div>";
                });
            }
            html += "<div class=\"arrow-right\"></div> \n                   <div class=\"spread\" style=\"margin-top:-" + spreadTop * 30 + "px;\">" + htmlpSread + "</div>"; //<div class="spread"
            html += "</div>\n                </div>";
        });
        $('#menuUser').html(html);
    };
    return TempleteClass;
}());
var Templet = new TempleteClass();
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
//# sourceMappingURL=Templet.js.map