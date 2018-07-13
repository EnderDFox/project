var VueManagerClass = /** @class */ (function () {
    function VueManagerClass() {
    }
    VueManagerClass.prototype.Init = function (cb) {
        Loader.LoadVueTemplateList([Common.VuePath + "Popup"], function (tplList) {
            //注册组件
            Vue.component('popup', {
                template: tplList[0],
                props: {
                    panel_heading: String,
                },
                data: function () {
                    return {};
                },
                methods: {}
            });
            //
            cb();
        });
    };
    return VueManagerClass;
}());
var VueManager = new VueManagerClass();
//# sourceMappingURL=VueManager.js.map