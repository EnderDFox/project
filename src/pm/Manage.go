package main

type Manage struct {
	owner *User
}

func NewManage(user *User) *Manage {
	instance := &Manage{}
	instance.owner = user
	return instance
}

func (this *Manage) View() bool {
	//#
	data := &L2C_ManageView{
		AuthList: this.GetAuthList(),
		UserList: this.GetUserList(),
		ProjList: this.GetProjectList(),
	}
	this.owner.SendTo(L2C_MANAGE_VIEW, data)
	return true
}

//全部项目
func (this *Manage) GetProjectList() []*ProjectSingle {
	stmt, err := db.GetDb().Prepare(`SELECT pid,name FROM ` + config.Pm + `.pm_project WHERE is_del=0`)
	defer stmt.Close()
	db.CheckErr(err)
	rows, err := stmt.Query()
	defer rows.Close()
	db.CheckErr(err)
	var list []*ProjectSingle
	for rows.Next() {
		single := &ProjectSingle{}
		rows.Scan(&single.Pid, &single.Name)
		list = append(list, single)
	}
	return list
}

//全部权限
func (this *Manage) GetAuthList() []*AuthSingle {
	stmt, err := db.GetDb().Prepare(`SELECT authid,modid,name,description,sort FROM ` + config.Mg + `.mag_auth`)
	defer stmt.Close()
	db.CheckErr(err)
	rows, err := stmt.Query()
	defer rows.Close()
	db.CheckErr(err)
	var list []*AuthSingle
	for rows.Next() {
		single := &AuthSingle{}
		rows.Scan(&single.Authid, &single.Modid, &single.Name, &single.Description, &single.Sort)
		list = append(list, single)
	}
	return list
}

//全部用户
func (this *Manage) GetUserList() []*UserSingle {
	stmt, err := db.GetDb().Prepare(`SELECT uid,name FROM ` + config.Mg + `.mag_user WHERE is_del=0`)
	defer stmt.Close()
	db.CheckErr(err)
	rows, err := stmt.Query()
	defer rows.Close()
	db.CheckErr(err)
	var list []*UserSingle
	for rows.Next() {
		single := &UserSingle{}
		rows.Scan(&single.Uid, &single.Name)
		list = append(list, single)
	}
	return list
}
