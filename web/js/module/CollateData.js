//晨会数据
var CollateDataClass = /** @class */ (function () {
    function CollateDataClass() {
        //工作内容
        this.WorkMap = {};
        //流程内容
        this.LinkMap = {};
        //功能内容
        this.ModeMap = {};
        //标签内容
        this.TagsMap = {};
        /** 时间用户内容
         * key1:WorkSingle.DateLine	key2:this.LinkMap[WorkSingle.Lid].Uid
         */
        this.DateUserMap = {};
        /** 补充内容
         * key:ExtraSingle.Eid
         */
        this.ExtraMap = {};
        /** 时间补充内容
         * key1:ExtraSingle.Date key2:ExtraSingle.Uid
         */
        this.DateExtraMap = {};
        //状态描述
        this.StatusList = [{ 'Info': '持续', 'Tag': '' }, { 'Info': '延期', 'Tag': '延' }, { 'Info': '等待', 'Tag': '待' }, { 'Info': '完成', 'Tag': '完' }, { 'Info': '休息', 'Tag': '休' }, { 'Info': '优化', 'Tag': '优' }];
        //检查描述
        this.InspectList = ['未知', '完成', '持续', '未完成'];
    }
    //数据初始化
    CollateDataClass.prototype.Init = function (data) {
        var _this = this;
        this.WorkMap = {};
        this.LinkMap = {};
        this.ModeMap = {};
        this.TagsMap = {};
        this.ExtraMap = {};
        this.DateUserMap = {};
        this.DateExtraMap = {};
        //
        ProcessData.ParseVersionData(data.VersionList);
        //功能内容
        $.each(data.ModeList, function (k, v) {
            _this.ModeMap[v.Mid] = v;
        });
        //流程内容
        $.each(data.LinkList, function (k, v) {
            _this.LinkMap[v.Lid] = v;
        });
        //标签内容
        $.each(data.TagsList, function (k, v) {
            _this.TagsMap[v.Tag] = v;
        });
        //工作内容
        $.each(data.WorkList, function (k, v) {
            _this.WorkMap[v.Wid] = v;
            if (!_this.DateUserMap[v.Date]) {
                _this.DateUserMap[v.Date] = {};
            }
            if (!_this.DateUserMap[v.Date][_this.LinkMap[v.Lid].Uid]) {
                _this.DateUserMap[v.Date][_this.LinkMap[v.Lid].Uid] = [];
            }
            _this.DateUserMap[v.Date][_this.LinkMap[v.Lid].Uid].push(v);
        });
        //补充内容
        $.each(data.ExtraList, function (k, v) {
            _this.ExtraMap[v.Eid] = v;
            if (!_this.DateExtraMap[v.Date]) {
                _this.DateExtraMap[v.Date] = {};
            }
            if (!_this.DateExtraMap[v.Date][v.Uid]) {
                _this.DateExtraMap[v.Date][v.Uid] = [];
            }
            _this.DateExtraMap[v.Date][v.Uid].push(v);
        });
    };
    return CollateDataClass;
}());
var CollateData = new CollateDataClass();
//# sourceMappingURL=CollateData.js.map