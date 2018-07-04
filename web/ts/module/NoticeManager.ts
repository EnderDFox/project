//提示类
class NoticeManagerClass {
    //注册函数
    RegisterFunc() {
        Commond.Register(L2C.L2C_PROCESS_SCORE_NOTICE, this.ScoreNotice.bind(this))
    }
    //点评提示
    ScoreNotice(data: { List: ScoreNoticeSingle[] }) {
        NoticeData.Init(data)
        //此时 process中数据还没过来呢, 所以要等
        var checkInit = ()=>{
            if(ProcessData.IsFirst){
                NoticePanel.CreateNotice()
                NoticePanel.BindActions()
            }else{
                setTimeout(() => {
                    checkInit()
                }, 1000);
            }
        }
        checkInit()
    }
    //评价完成
    ScoreEdit(data: ScoreSingle) {
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