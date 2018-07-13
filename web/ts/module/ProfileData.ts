//个人数据
class ProfileDataClass {
    /** 个人内容
     * key:ProfileSingle.date
     */
    DataMap: { [key: string]: ProfileSingle[] } = {};
    /** 日期内容列表`1
     * key:ProfileSingle.date
     */
    DateList: string[] = []
    /** 标签内容
    * key:TagSingle.date
    */
    TagsMap: { [key: string]: TagSingle } = {};
    //数据初始化
    Init(data: L2C_ProfileView) {
        this.TagsMap = {}
        this.DataMap = {}
        this.DateList = []
        //个人内容
        $.each(data.ProfileList, (k, v: ProfileSingle) => {
            if (!ProfileData.DataMap[v.Date]) {
                ProfileData.DataMap[v.Date] = []
                ProfileData.DateList.push(v.Date)
            }
            ProfileData.DataMap[v.Date].push(v)
        })
        //标签内容
        $.each(data.TagsList, (k, v: TagSingle) => {
            ProfileData.TagsMap[v.Tag] = v
        })
    }
}

var ProfileData = new ProfileDataClass()

