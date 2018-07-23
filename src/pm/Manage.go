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
	this.owner.SendTo(PB_CMD_MANAGE_VIEW, data)
	return true
}

func (this *Manage) DeptAdd(pid uint64, fid uint64, name string) bool {
	//# 插入 dept IF(?,1,0) 是 IF(fid,1,0) 根从 sort=0 开始 因为sort=0是`管理部``
	stmt, err := db.GetDb().Prepare(`INSERT INTO ` + config.Mg + `.mag_department (pid,fid,name,sort) VALUES (?,?,?,(
			(SELECT IFNULL(
				(SELECT ms FROM(SELECT max(sort)+1 AS ms FROM ` + config.Mg + `.mag_department WHERE pid=? AND fid=?) m)
			,IF(?,1,0)))
	))`)
	defer stmt.Close()
	db.CheckErr(err)
	res, err := stmt.Exec(pid, fid, name, pid, fid, fid)
	db.CheckErr(err)
	_did, err := res.LastInsertId()
	did := uint64(_did)
	db.CheckErr(err)
	//# 重新读取出 sort
	dept := this.GetDeptSingle(did)
	var posnList []*PositionSingle
	var posn *PositionSingle
	if dept.Sort == 0 {
		//管理部 需要增加 三个默认职位
		posn = this.DoPosnAdd(did, `制作人`)
		posnList = append(posnList, posn)
		posn = this.DoPosnAdd(did, `PM`)
		posnList = append(posnList, posn)
		posn = this.DoPosnAdd(did, `管理员`)
		posnList = append(posnList, posn)
	} else {
		//其它部门 增加一个和部门同名的职位
		posn = this.DoPosnAdd(did, name)
		posnList = append(posnList, posn)
	}
	//#
	data := &L2C_ManageDeptAdd{
		Dept:     dept,
		PosnList: posnList,
	}
	this.owner.SendTo(PB_CMD_MANAGE_DEPT_ADD, data)
	return true
}

func (this *Manage) DoPosnAdd(did uint64, name string) *PositionSingle {
	//# 插入 dept IF(?,1,0) 是 IF(fid,1,0) 根从 sort=0 开始 因为sort=0是`管理部``
	stmt, err := db.GetDb().Prepare(`INSERT INTO ` + config.Mg + `.mag_position (did,name,sort) VALUES (?,?,(
	(SELECT IFNULL(
		(SELECT ms FROM(SELECT max(sort)+1 AS ms FROM ` + config.Mg + `.mag_position WHERE did=?) m)
	,1)
))`)
	defer stmt.Close()
	db.CheckErr(err)
	res, err := stmt.Exec(did, name, did)
	db.CheckErr(err)
	_posnid, err := res.LastInsertId()
	posnid := uint64(_posnid)
	db.CheckErr(err)
	//
	posn := &PositionSingle{
		Did:    did,
		Posnid: posnid,
		Name:   name,
	}
	return posn
}

//全部项目
func (this *Manage) GetProjectList() []*ProjectSingle {
	stmt, err := db.GetDb().Prepare(`SELECT pid,name,create_time FROM ` + config.Pm + `.pm_project WHERE is_del=0`)
	defer stmt.Close()
	db.CheckErr(err)
	rows, err := stmt.Query()
	defer rows.Close()
	db.CheckErr(err)
	var list []*ProjectSingle
	for rows.Next() {
		single := &ProjectSingle{}
		rows.Scan(&single.Pid, &single.Name, &single.CreateTime)
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

func (this *Manage) GetDeptSingle(did uint64) *DepartmentSingle {
	stmt, err := db.GetDb().Prepare(`SELECT did,pid,fid,name,sort FROM ` + config.Mg + `.mag_department WHERE did = ?`)
	defer stmt.Close()
	db.CheckErr(err)
	single := &DepartmentSingle{}
	stmt.QueryRow(did).Scan(&single.Did, &single.Pid, &single.Fid, &single.Name, &single.Sort)
	return single
}
