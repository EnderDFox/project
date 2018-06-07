package main

var (
	session_manager  = NewSessionManager()
	profile_manager  = NewProfileManager()
	process_manager  = NewProcessManager()
	template_manager = NewTemplateManager()
	collate_manager  = NewCollateManager()
	save_manager     = NewSaveManager()
	upload_manager   = NewUploadManager()
	version_manager  = NewVersionManager()
)

type Dispather struct {
}

func NewDispather() *Dispather {
	instance := &Dispather{}
	return instance
}

func (this *Dispather) Retister() {
	//session注册
	session_manager.RegisterFunction()
	//个人管理注册
	profile_manager.RegisterFunction()
	//进度管理注册
	process_manager.RegisterFunction()
	//模板管理注册
	template_manager.RegisterFunction()
	//晨会管理注册
	collate_manager.RegisterFunction()
	//保存业务注册
	save_manager.RegisterFunction()
	//上传业务
	upload_manager.RegisterFunction()
	//版本控制
	version_manager.RegisterFunction()
}
