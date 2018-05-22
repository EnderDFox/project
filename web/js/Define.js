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
//# sourceMappingURL=Define.js.map