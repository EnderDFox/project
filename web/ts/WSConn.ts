//WSCon类
class WSConnClass {
	ws = null
	//初始化
	Init() {
		this.connect()
	}
	//链接
	connect() {
		this.ws = new WebSocket(Config.WsUri)
	}
	//打开
	onOpen(func: () => void) {
		this.ws.onopen = function () {
			func()
		}
	}
	//关闭
	onClose(func: () => void) {
		this.ws.onclose = function () {
			func()
		}
	}
	//消息
	onMessage(func: (json: any) => void) {
		this.ws.onmessage = function (event) {
			var json = JSON.parse(event.data)
			console.log('收到消息 <<---', json.Cid, '数据', json.Data)
			func(json)
		}
	}
	//发送
	sendMsg<T>(cid: number, param: T) {
		var pack: any = {}
		pack.Cid = cid
		pack.Uid = User.Uid
		pack.Param = JSON.stringify(param)
		this.ws.send(JSON.stringify(pack))
		console.log('发送消息 --->>', cid, '参数', param)
	}
}
var WSConn = new WSConnClass()