"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MathUtil = /** @class */ (function () {
    function MathUtil() {
    }
    MathUtil.randomInt = function (max) {
        var rs = Math.random() * max;
        rs = Math.round(rs);
        return rs;
    };
    return MathUtil;
}());
exports.MathUtil = MathUtil;
//# sourceMappingURL=MathUtil.js.map