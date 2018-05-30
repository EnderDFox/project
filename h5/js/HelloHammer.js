var HelloHammer = /** @class */ (function () {
    function HelloHammer() {
    }
    HelloHammer.prototype.init = function () {
        var hammertime = new Hammer(document.getElementById('div1'), {});
        hammertime.on('pan', function (ev) {
            console.log(ev);
        });
    };
    return HelloHammer;
}());
//# sourceMappingURL=HelloHammer.js.map