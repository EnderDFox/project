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
        $.each(Data.DepartmentLoop, function (k, v) {
            html += '<div class="row extends"> \
						<div class="ico"></div> \
						<div class="txt">' + v.info.Name + '</div> \
						<div class="dev"> \
							<div class="arrow-right"></div> \
							<div class="spread">';
            if (v.list.length > 0) {
                $.each(v.list, function (k, v) {
                    html += '<div class="row extends"> \
												<div class="ico"></div> \
												<div class="txt">' + v.info.Name + '</div> \
												<div class="dev"> \
													<div class="arrow-right"></div> \
													<div class="spread">';
                    $.each(v.user, function (k, v) {
                        html += '<div class="row" uid="' + v.Uid + '"> \
															<div class="ico"></div> \
															<div class="txt">' + v.Name + '</div> \
															<div class="dev"></div> \
														</div>';
                    });
                    html += '</div> \
												</div> \
											</div>';
                });
            }
            else {
                $.each(v.user, function (k, v) {
                    html += '<div class="row" uid="' + v.Uid + '"> \
												<div class="ico"></div> \
												<div class="txt">' + v.Name + '</div> \
												<div class="dev"></div> \
											</div>';
                });
            }
            html += '</div> \
						</div> \
					</div>';
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