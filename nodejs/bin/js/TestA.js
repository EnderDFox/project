"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var TestA = /** @class */ (function () {
    function TestA() {
    }
    TestA.prototype.t1 = function () {
        var count = 35;
        var str1 = "";
        var str2 = "";
        for (var i = 1; i <= count; i++) {
            str1 += "Testb" + i + ":\n";
            str1 += "    scale: 0.99\n";
            str1 += "    files: [\n";
            str1 += "        2048/testb" + i + ".png\n";
            str1 += "    ]\n";
            //
            str2 += "case " + i + ":\n            sprf->CreateAtlas(Testb" + i + "::Desc());\n            spriteDesc0.Image = \"2048/testb" + i + "\";\n            break;\n            ";
        }
        console.log(str1);
        console.log(str2);
    };
    TestA.prototype.t2 = function () {
        var rows = [];
        for (var row = 0; row < 16 * 2; row++) {
            var cols = [];
            for (var col = 0; col < 7 * 3; col++) {
                cols.push((col + row) % 7);
            }
            rows.push(cols.join(','));
        }
        console.log(rows.join(',\n'));
    };
    TestA.prototype.t3 = function () {
        var files = fs.readdirSync("C:/fox/projects/helloworld/lua/tolua_unity5/Assets/CatchFishes/Resources/csv/track");
        console.log("[debug]", files.length, "`files.length`");
        var rs = [];
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            if (path.extname(file) == ".csv") {
                rs.push(path.basename(file).replace(".csv", ""));
            }
        }
        console.log("[info]", rs.join(","));
    };
    TestA.prototype.Rename = function () {
        var dir = "D:/AmazingGame/tool_svn/src/pm";
        var files = fs.readdirSync(dir);
        var len = files.length;
        for (var i = 0; i < len; i++) {
            var file = files[i];
            if (path.extname(file) == ".go") {
                fs.renameSync(path.resolve(dir, file), path.resolve(dir, this.GetName(file)));
            }
        }
    };
    TestA.prototype.GetName = function (file) {
        var rs = [];
        var arr = file.split('_');
        var len = arr.length;
        for (var i = 0; i < len; i++) {
            var item = arr[i];
            if (item) {
                item = item.substr(0, 1).toUpperCase() + item.substring(1, item.length);
                rs.push(item);
            }
        }
        return rs.join('');
    };
    return TestA;
}());
// new TestA().t3();
new TestA().Rename();
//# sourceMappingURL=TestA.js.map