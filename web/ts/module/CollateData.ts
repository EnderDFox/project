//晨会数据
class CollateDataClass {
	//工作内容
	WorkMap: { [key: number]: WorkSingle } = {}
	//流程内容
	LinkMap: { [key: number]: LinkSingle } = {}
	//功能内容
	ModeMap: { [key: number]: ModeSingle } = {}
	//标签内容
	TagsMap: { [key: number]: TagSingle } = {}
	/** 时间用户内容
	 * key1:WorkSingle.DateLine	key2:this.LinkMap[WorkSingle.Lid].Uid
	 */
	DateUserMap: { [key: string]: { [key: number]: WorkSingle[] } } = {}
	/** 补充内容
	 * key:ExtraSingle.Eid
	 */
	ExtraMap: { [key: number]: ExtraSingle } = {};
	/** 时间补充内容
	 * key1:ExtraSingle.Date key2:ExtraSingle.Uid
	 */
	DateExtraMap: { [key: number]: { [key: number]: ExtraSingle[] } } = {};
	//状态描述
	StatusList = [{ 'Info': '持续', 'Tag': '' }, { 'Info': '延期', 'Tag': '延' }, { 'Info': '等待', 'Tag': '待' }, { 'Info': '完成', 'Tag': '完' }, { 'Info': '休息', 'Tag': '休' }, { 'Info': '优化', 'Tag': '优' }]
	//检查描述
	InspectList = ['未知', '完成', '持续', '未完成']
	//数据初始化
	Init(data: L2C_CollateView) {
		this.WorkMap = {};
		this.LinkMap = {};
		this.ModeMap = {}
		this.TagsMap = {}
		this.ExtraMap = {}
		this.DateUserMap = {}
		this.DateExtraMap = {}
		//功能内容
		$.each(data.ModeList, (k, v) => {
			this.ModeMap[v.Mid] = v
		})
		//流程内容
		$.each(data.LinkList, (k, v: LinkSingle) => {
			this.LinkMap[v.Lid] = v
		})
		//标签内容
		$.each(data.TagsList, (k, v: TagSingle) => {
			this.TagsMap[v.Tag] = v
		})
		//工作内容
		$.each(data.WorkList, (k, v: WorkSingle) => {
			this.WorkMap[v.Wid] = v
			if (!this.DateUserMap[v.Date]) {
				this.DateUserMap[v.Date] = {}
			}
			if (!this.DateUserMap[v.Date][this.LinkMap[v.Lid].Uid]) {
				this.DateUserMap[v.Date][this.LinkMap[v.Lid].Uid] = []
			}
			this.DateUserMap[v.Date][this.LinkMap[v.Lid].Uid].push(v)
		})
		//补充内容
		$.each(data.ExtraList, (k, v: ExtraSingle) => {
			this.ExtraMap[v.Eid] = v
			if (!this.DateExtraMap[v.Date]) {
				this.DateExtraMap[v.Date] = {}
			}
			if (!this.DateExtraMap[v.Date][v.Uid]) {
				this.DateExtraMap[v.Date][v.Uid] = []
			}
			this.DateExtraMap[v.Date][v.Uid].push(v)
		})
	}
}

var CollateData = new CollateDataClass()