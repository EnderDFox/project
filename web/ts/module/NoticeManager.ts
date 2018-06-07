//提示类
class NoticeManagerClass {
    //注册函数
    RegisterFunc() {
        Commond.Register(L2C.L2C_PROCESS_SCORE_NOTICE, this.ScoreNotice.bind(this))
    }
    //点评提示
    ScoreNotice(data: { List: ScoreNoticeSingle[] }) {
        NoticeData.Init(data)
        NoticePanel.CreateNotice()
        //NoticePanel.BindActions()
    }
    //评价完成
    ScoreEdit(data: ScoreNoticeSingle) {
        if (!NoticeData.NoticeMap[data.Wid]) {
            return false
        }
        //数据改变
        NoticeData.NoticeLen--
        delete NoticeData.NoticeMap[data.Wid]
        //元素操作
        $('#umsgs').html(NoticeData.NoticeLen.toString())
        $('#extraNotice .list li[wid="' + data.Wid + '"]').slideUp(300, function () {
            $(this).remove()
        })
        return true
    }
}

var NoticeManager = new NoticeManagerClass()