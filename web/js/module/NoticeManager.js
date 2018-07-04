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
        //此时 process中数据还没过来呢, 所以要等
        var checkInit = function () {
            if (ProcessData.IsFirst) {
                NoticePanel.CreateNotice();
                NoticePanel.BindActions();
            }
            else {
                setTimeout(function () {
                    checkInit();
                }, 1000);
            }
        };
        checkInit();
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