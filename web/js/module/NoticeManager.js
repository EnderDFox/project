//提示类
var NoticeManagerClass = /** @class */ (function () {
    function NoticeManagerClass() {
    }
    //注册函数
    NoticeManagerClass.prototype.RegisterFunc = function () {
        Commond.Register(L2C.L2C_PROCESS_SCORE_NOTICE, this.ScoreNotice.bind(this));
    };
    //点评提示
    NoticeManagerClass.prototype.ScoreNotice = function (data) {
        NoticeData.Init(data);
        NoticePanel.CreateNotice();
        //NoticePanel.BindActions()
    };
    //评价完成
    NoticeManagerClass.prototype.ScoreEdit = function (data) {
        if (!NoticeData.NoticeMap[data.Wid]) {
            return false;
        }
        //数据改变
        NoticeData.NoticeLen--;
        delete NoticeData.NoticeMap[data.Wid];
        //元素操作
        $('#umsgs').html(NoticeData.NoticeLen.toString());
        $('#extraNotice .list li[wid="' + data.Wid + '"]').slideUp(300, function () {
            $(this).remove();
        });
        return true;
    };
    return NoticeManagerClass;
}());
var NoticeManager = new NoticeManagerClass();
//# sourceMappingURL=NoticeManager.js.map