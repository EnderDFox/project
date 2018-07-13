class VueManagerClass {
    Init(cb: Function) {
        Loader.LoadVueTemplateList([`${Common.VuePath}Popup`, `${Common.VuePath}Alert`], (tplList: string[]) => {
            //注册组件
            Vue.component('popup', {
                template: tplList[0],
                props: {
                    theme: String,
                    panelHeading: String,
                },
                data: function () {
                    return {}
                },
                methods: {
                }
            })
            //#
            cb()
        })
    }
}
var VueManager = new VueManagerClass()