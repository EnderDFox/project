//提示类
var NoticePanelClass = /** @class */ (function () {
    function NoticePanelClass() {
    }
    //创建列表
    NoticePanelClass.prototype.CreateList = function () {
        var pan = $('#extraNotice');
        var html = '';
        $.each(NoticeData.NoticeList, function (k, v) {
            html += '<li wid="' + v.Wid + '"><div class="chunk"><table class="box"> \
				<tr><td colspan="3" class="del"><div>x</div></td></tr> \
				<tr><td class="name">时间</td><td class="info">' + v.Date + '</td><td rowspan="3" class="user">' + Data.GetUser(v.Uid).Name + '</td></tr> \
				<tr><td class="name">功能</td><td class="info">' + VersionManager.GetVersionVer(v.Vid) + v.Mname + '</td></tr> \
				<tr><td class="name">流程</td><td class="info">' + v.Lname + '</td></tr>';
            html += '</table></div></li>';
        });
        pan.find('.list').html(html);
    };
    //消息提示
    NoticePanelClass.prototype.Notif = function () {
        Notification.requestPermission(function (permission) {
            //default表示还没有发出过请求，或者之前请求过，但是用户并没有允许或者禁止，二是直接关闭窗口。这种状态下是不会有通知的。
            //granted表示之前向用户请求过权限，而且用户已经允许了。
            //denied表示之前向用户请求过权限，但是用户已经拒绝了。
            //http://www.zhangxinxu.com/wordpress/2016/07/know-html5-web-notification/
            if (permission == 'granted') {
                var notification = new Notification('您有[' + NoticeData.NoticeLen + ']条工作需要点评', {
                    dir: 'auto',
                    lang: 'zh-CN',
                    tag: 'NoticePanel.Notif',
                    icon: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1524830417145&di=702d96c3c60448181b6c8de661d5f8b9&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2Fc995d143ad4bd113b9fe9b1650afa40f4bfb05e6.jpg',
                    body: '抽空给你下属的工作做一个点评吧',
                });
            }
            /*
            事件句柄
            Notification.onclick
            处理 click 事件的处理。每当用户点击通知时被触发。
            Notification.onshow
            处理 show 事件的处理。当通知显示的时候被触发。
            Notification.onerror
            处理 error 事件的处理。每当通知遇到错误时被触发。
            Notification.onclose
            处理 close 事件的处理。当用户关闭通知时被触发。
            */
        });
    };
    //创建标志
    NoticePanelClass.prototype.CreateSign = function () {
        $('#umsgs').html(NoticeData.NoticeLen.toString());
        /*
        if(NoticeData.NoticeLen > 0){
            NoticePanel.Notif()
        }
        */
    };
    //创建内容
    NoticePanelClass.prototype.CreateNotice = function () {
        //创建列表
        NoticePanel.CreateList();
        //创建标志
        NoticePanel.CreateSign();
        NoticePanel.BindActions();
    };
    //事件绑定
    NoticePanelClass.prototype.BindActions = function () {
        //打开面板
        $('#umsgs').unbind().click(function (e) {
            if (NoticeData.NoticeLen == 0) {
                return;
            }
            NoticePanel.ShowList(this, e);
        });
        var pan = $('#extraNotice');
        //名字点评
        pan.find('.list').unbind().delegate('li', 'click', function (e) {
            var wid = parseInt($(this).attr('wid'));
            if (e.target.localName == 'div') {
                WSConn.sendMsg(C2L.C2L_PROCESS_WORK_SCORE, { 'Wid': wid, 'Score': 0, 'Info': '' });
            }
            else {
                NoticePanel.OnShowEditScore(e, wid);
            }
        });
        //关闭面板
        pan.find('.close').unbind().click(function () {
            NoticePanel.HideMenu();
        });
    };
    //显示列表
    NoticePanelClass.prototype.ShowList = function (o, e) {
        var pan = $('#extraNotice');
        var top = $(o).position().top + 50;
        var left = $(o).position().left + $(o).outerWidth();
        pan.css({ 'top': top, 'left': left }).show().find('.list').scrollTop(0);
    };
    //评价
    NoticePanelClass.prototype.OnShowEditScore = function (e, wid) {
        ProcessPanel.ShowEditScore(wid, e.pageX, e.pageY);
    };
    //关闭菜单
    NoticePanelClass.prototype.HideMenu = function () {
        $('#extraNotice,#editScore').fadeOut(Config.FadeTime);
    };
    return NoticePanelClass;
}());
var NoticePanel = new NoticePanelClass();
//# sourceMappingURL=NoticePanel.js.map