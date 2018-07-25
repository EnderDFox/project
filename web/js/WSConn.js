//WSCon类
var WSConnClass = /** @class */ (function () {
    function WSConnClass() {
        this.ws = null;
    }
    //初始化
    WSConnClass.prototype.Init = function () {
        this.connect();
    };
    //链接
    WSConnClass.prototype.connect = function () {
        this.ws = new WebSocket(Config.WsUri);
    };
    //打开
    WSConnClass.prototype.onOpen = function (func) {
        this.ws.onopen = function () {
            func();
        };
    };
    //关闭
    WSConnClass.prototype.onClose = function (func) {
        this.ws.onclose = function () {
            func();
        };
    };
    //消息
    WSConnClass.prototype.onMessage = function (func) {
        this.ws.onmessage = function (event) {
            var json = JSON.parse(event.data);
            console.log('收到消息 <<---', json.Cid, '数据', json.Data);
            func(json);
        };
    };
    //发送
    WSConnClass.prototype.sendMsg = function (cid, param) {
        var pack = {};
        pack.Cid = cid;
        pack.Uid = User.Uid;
        pack.Param = JSON.stringify(param);
        this.ws.send(JSON.stringify(pack));
        console.log('发送消息 --->>', cid, '参数', param);
    };
    return WSConnClass;
}());
var WSConn = new WSConnClass();
//# sourceMappingURL=WSConn.js.map