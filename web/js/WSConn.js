//WSCon类
var WSConn = {
    //文件
    ws: null,
    //初始化
    Init: function () {
        this.connect();
    },
    //链接
    connect: function () {
        this.ws = new WebSocket(Config.WsUri);
    },
    //打开
    onOpen: function (func) {
        this.ws.onopen = function () {
            func();
        };
    },
    //关闭
    onClose: function (func) {
        this.ws.onclose = function () {
            func();
        };
    },
    //消息
    onMessage: function (func) {
        this.ws.onmessage = function (event) {
            var json = JSON.parse(event.data);
            console.log('收到消息 <<---', json.Cid, '数据', json.Data);
            func(json);
        };
    },
    //发送
    sendMsg: function (cid, param) {
        var pack = {};
        pack.Cid = cid;
        pack.Uid = User.Uid;
        pack.Param = JSON.stringify(param);
        this.ws.send(JSON.stringify(pack));
        console.log('发送消息 --->>', cid, '参数', param);
    }
};
//# sourceMappingURL=WSConn.js.map