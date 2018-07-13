//提示类
var NoticeDataClass = /** @class */ (function () {
    function NoticeDataClass() {
        //通知列表
        this.NoticeList = [];
        /** 通知数据
         * key:ScoreNoticeSingle.Wid
         */
        this.NoticeMap = {};
        //数据长度
        this.NoticeLen = 0;
    }
    //设置信息
    NoticeDataClass.prototype.Init = function (data) {
        NoticeData.NoticeMap = {};
        NoticeData.NoticeLen = data.List.length;
        NoticeData.NoticeList = data.List;
        $.each(data.List, function (k, v) {
            NoticeData.NoticeMap[v.Wid] = v;
        });
    };
    return NoticeDataClass;
}());
var NoticeData = new NoticeDataClass();
//# sourceMappingURL=NoticeData.js.map