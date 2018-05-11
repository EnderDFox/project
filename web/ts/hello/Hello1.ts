class Hello1{
    constructor(){
        // this.func1()
        this.func2()
    }
    func2():void{
        var rs = []
        var len = 33
        for (var i = 2; i < len; i++) {
            rs.push(`<li class="list-group-item">pow(2, <span>${i}</span>) = <span>${Math.pow(2, i)}</span></li>`)

        }
        console.log(rs.join('\n'))
    }
    func1():void{
        var arr = [
            {key:'a',data:97},
            {key:'b',data:98},
            {key:'c',data:99},
            {key:'d',data:100},
            {key:'e',data:101},
            {key:'f',data:120},
        ]
        var index = arr.findIndex((item)=>{
            return item.key=='c';
        })
        console.log("[debug] index:",index) //  [debug] index: 2

    }
}
new Hello1()