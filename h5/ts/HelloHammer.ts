class HelloHammer {
    init() {
        var hammertime = new Hammer(document.getElementById('div1'), {});
        hammertime.on('pan', function (ev) {
            console.log(ev);
        });
    }
}