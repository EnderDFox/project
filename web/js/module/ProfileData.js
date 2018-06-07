//个人数据
var ProfileDataClass = /** @class */ (function () {
    function ProfileDataClass() {
        /** 个人内容
         * key:ProfileSingle.date
         */
        this.DataMap = {};
        /** 日期内容列表`1
         * key:ProfileSingle.date
         */
        this.DateList = [];
        /** 标签内容
        * key:TagSingle.date
        */
        this.TagsMap = {};
    }
    //数据初始化
    ProfileDataClass.prototype.Init = function (data) {
        this.TagsMap = {};
        this.DataMap = {};
        this.DateList = [];
        //个人内容
        $.each(data.ProfileList, function (k, v) {
            if (!ProfileData.DataMap[v.Date]) {
                ProfileData.DataMap[v.Date] = [];
                ProfileData.DateList.push(v.Date);
            }
            ProfileData.DataMap[v.Date].push(v);
        });
        //标签内容
        $.each(data.TagsList, function (k, v) {
            ProfileData.TagsMap[v.Tag] = v;
        });
    };
    return ProfileDataClass;
}());
var ProfileData = new ProfileDataClass();
//# sourceMappingURL=ProfileData.js.map