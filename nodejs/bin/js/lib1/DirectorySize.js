"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var DirectorySize = /** @class */ (function () {
    function DirectorySize() {
    }
    DirectorySize.prototype.init = function (root) {
        this.root = this.analyze(root);
    };
    DirectorySize.prototype.analyze = function (fullPath) {
        var item = {
            FullPath: fullPath,
            Name: path.parse(fullPath).name
        };
        var stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            item.Children = [];
            this.root.Size = 0;
            var files = fs.readdirSync(fullPath);
            var len = files.length;
            for (var i = 0; i < len; i++) {
                var fileChild = files[i];
                var child = this.analyze(fileChild);
                this.root.Children.push(child);
                this.root.Size += child.Size;
            }
        }
        else {
            this.root.Size = stat.size;
        }
        return item;
    };
    return DirectorySize;
}());
exports.DirectorySize = DirectorySize;
//# sourceMappingURL=DirectorySize.js.map