class VueManagerClass {
    Init(cb: ()=>void) {
        Loader.LoadVueTemplateList([`${Common.VuePath}Popup`, `${Common.VuePath}Alert`], (tplList: string[]) => {
            //注册组件
            Vue.component('popup', {
                template: tplList[0],
                props: {
                    theme: String,
                    panelHeading: String,
                }
            })
            //#
            cb()
        })
    }
}
var VueManager = new VueManagerClass()