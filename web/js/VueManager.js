var VueManagerClass = /** @class */ (function () {
    function VueManagerClass() {
    }
    VueManagerClass.prototype.Init = function (cb) {
        Loader.LoadVueTemplateList([Common.VuePath + "Popup"], function (tplList) {
            //注册组件
            Vue.component('popup', {
                template: tplList[0],
                props: {
                    panel_heading: Object
                },
                data: function () {
                    return {};
                },
                methods: {}
            });
        });
    };
    return VueManagerClass;
}());
var VueManager = new VueManagerClass();
//# sourceMappingURL=VueManager.js.map