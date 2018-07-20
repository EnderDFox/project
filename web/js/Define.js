/**
 * 网址参数使用的key
 */
var URL_PARAM_KEY = /** @class */ (function () {
    function URL_PARAM_KEY() {
    }
    URL_PARAM_KEY.UID = 'uid';
    URL_PARAM_KEY.PID = 'pid';
    URL_PARAM_KEY.PAGE = 'page';
    URL_PARAM_KEY.DID = 'did';
    /**search key */
    URL_PARAM_KEY.FKEY = 'fkey';
    return URL_PARAM_KEY;
}());
//项目id  pm_project.pid
var PidFeild;
(function (PidFeild) {
    PidFeild[PidFeild["AGAME"] = 1] = "AGAME";
})(PidFeild || (PidFeild = {}));
//# 数据库中的字段
/**db.manager.department.did*/
var DidField;
(function (DidField) {
    DidField[DidField["VERSION"] = 0] = "VERSION";
    DidField[DidField["ALL"] = -1] = "ALL";
    DidField[DidField["DESIGN"] = 1] = "DESIGN";
    DidField[DidField["ART"] = 2] = "ART";
    DidField[DidField["CLIENT"] = 4] = "CLIENT";
    DidField[DidField["SERVER"] = 5] = "SERVER";
    DidField[DidField["QA"] = 6] = "QA";
    DidField[DidField["SUPERVISOR"] = 14] = "SUPERVISOR";
    DidField[DidField["TOOL"] = 16] = "TOOL";
    DidField[DidField["SUPERVISOR_ART"] = 101] = "SUPERVISOR_ART";
})(DidField || (DidField = {}));
/**db.pm.publish.genre*/
var GenreField;
(function (GenreField) {
    // '开始', '完结', '封存', '延期', '发布', '总结'
    GenreField[GenreField["BEGIN"] = 1] = "BEGIN";
    GenreField[GenreField["END"] = 2] = "END";
    GenreField[GenreField["SEAL"] = 3] = "SEAL";
    GenreField[GenreField["DELAY"] = 4] = "DELAY";
    GenreField[GenreField["PUB"] = 5] = "PUB";
    GenreField[GenreField["SUMMARY"] = 6] = "SUMMARY";
})(GenreField || (GenreField = {}));
// 0:工作 3:完成 1:延期 2:等待 4:休假 5:优化
var WorkStatusField;
(function (WorkStatusField) {
    WorkStatusField[WorkStatusField["WORK"] = 0] = "WORK";
    WorkStatusField[WorkStatusField["FINISH"] = 3] = "FINISH";
    WorkStatusField[WorkStatusField["DELAY"] = 1] = "DELAY";
    WorkStatusField[WorkStatusField["WAIT"] = 2] = "WAIT";
    WorkStatusField[WorkStatusField["REST"] = 4] = "REST";
    WorkStatusField[WorkStatusField["OPTIMIZE"] = 5] = "OPTIMIZE";
    WorkStatusField[WorkStatusField["COMPLETE"] = 6] = "COMPLETE";
    WorkStatusField[WorkStatusField["SUBMIT"] = 7] = "SUBMIT";
    WorkStatusField[WorkStatusField["MODIFY"] = 8] = "MODIFY";
    WorkStatusField[WorkStatusField["PASS"] = 9] = "PASS";
})(WorkStatusField || (WorkStatusField = {}));
//mode/link  0:正常  1:归档
var ModeStatusField;
(function (ModeStatusField) {
    ModeStatusField[ModeStatusField["NORMAL"] = 0] = "NORMAL";
    ModeStatusField[ModeStatusField["STORE"] = 1] = "STORE";
})(ModeStatusField || (ModeStatusField = {}));
var LinkStatusField;
(function (LinkStatusField) {
    LinkStatusField[LinkStatusField["NORMAL"] = 0] = "NORMAL";
    LinkStatusField[LinkStatusField["STORE"] = 1] = "STORE";
})(LinkStatusField || (LinkStatusField = {}));
//# const
var FieldName = /** @class */ (function () {
    function FieldName() {
    }
    FieldName.PID = "Pid";
    FieldName.Did = "Did";
    FieldName.Uid = "Uid";
    FieldName.Mid = "Mid";
    FieldName.Lid = "Lid";
    FieldName.Tmid = "Tmid";
    FieldName.Tlid = "Tlid";
    FieldName.Posid = "Posid";
    FieldName.Name = "Name";
    return FieldName;
}());
var AUTH;
(function (AUTH) {
    AUTH[AUTH["PROJECT_LIST"] = 1] = "PROJECT_LIST";
    AUTH[AUTH["PROJECT_EDIT"] = 2] = "PROJECT_EDIT";
    // POSITION_EDIT = 3,
    // DEPARTMENT_MANAGE = 101, //所在部门的管理权限
})(AUTH || (AUTH = {}));
//# sourceMappingURL=Define.js.map