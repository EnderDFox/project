var Hello1 = /** @class */ (function () {
    function Hello1() {
        // this.func1()
        this.func2();
    }
    Hello1.prototype.func2 = function () {
        var rs = [];
        var len = 33;
        for (var i = 2; i < len; i++) {
            rs.push("<li class=\"list-group-item\">pow(2, <span>" + i + "</span>) = <span>" + Math.pow(2, i) + "</span></li>");
        }
        console.log(rs.join('\n'));
    };
    Hello1.prototype.func1 = function () {
        var arr = [
            { key: 'a', data: 97 },
            { key: 'b', data: 98 },
            { key: 'c', data: 99 },
            { key: 'd', data: 100 },
            { key: 'e', data: 101 },
            { key: 'f', data: 120 },
        ];
        var index = arr.findIndex(function (item) {
            return item.key == 'c';
        });
        console.log("[debug] index:", index); //  [debug] index: 2
    };
    Hello1.prototype.func3 = function () {
        var arr = [];
        for (var i = 0; i < 40; i++) {
            arr.push(i + 1);
        }
        console.log("[debug]", arr, "arr");
        var arr2 = [];
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            arr2.splice(Math.round(Math.random() * arr2.length), 0, item);
        }
        console.log("[debug]", arr2);
    };
    return Hello1;
}());
new Hello1();
//# sourceMappingURL=Hello1.js.map