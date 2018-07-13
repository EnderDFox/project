class VueManagerClass {
    Init(cb: Function) {
        Loader.LoadVueTemplateList([`${Common.VuePath}Popup`], (tplList: string[]) => {
            //注册组件
            Vue.component('popup', {
                template: tplList[0],
                props: {
                    panel_heading: String,
                },
                data: function () {
                    return {}
                },
                methods: {
                }
            })
            //
            cb()
        })
    }
}
var VueManager = new VueManagerClass()