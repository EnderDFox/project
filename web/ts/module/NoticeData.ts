//提示类
class NoticeDataClass {
    //通知列表
    NoticeList: ScoreNoticeSingle[] = []
    /** 通知数据
     * key:ScoreNoticeSingle.Wid
     */
    NoticeMap: { [key: number]: ScoreNoticeSingle } = {};
    //数据长度
    NoticeLen = 0
    //设置信息
    Init(data: { List: ScoreNoticeSingle[] }) {
        NoticeData.NoticeMap = {}
        NoticeData.NoticeLen = data.List.length
        NoticeData.NoticeList = data.List
        $.each(data.List, (k, v: ScoreNoticeSingle) => {
            NoticeData.NoticeMap[v.Wid] = v
        })
    }
}

var NoticeData = new NoticeDataClass()