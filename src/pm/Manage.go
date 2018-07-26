package main

import (
	"log"
	"strconv"
	"strings"
	"time"
)

const (
	AUTH_PROJECT_LIST = 70
	//后台
	AUTH_PROJECT_MANAGE    = 101
	AUTH_DEPARTMENT_MANAGE = 110 //所属部门的管理权限
	//前台
	AUTH_PROJECT_PROCESS    = 201 //所属项目的前台
	AUTH_DEPARTMENT_PROCESS = 210 //所属部门的后台
	AUTH_COLLATE_EDIT       = 230 //晨会权限 修改状态
)

type Manage struct {
	user *User
}

func NewManage(user *User) *Manage {
	instance := &Manage{}
	instance.user = user
	return instance
}

func (this *Manage) View() *L2C_ManageView {
	//#超级 sql :  proj+dept+posn
	stmt, err := db.GetDb().Prepare(`
	SELECT t_proj_dept.*,t_posn.posnid,t_posn.name AS posn_name,t_posn.sort AS posn_sort
	FROM (
		SELECT t_proj.*,t_dept.did,t_dept.fid,t_dept.name AS d_name,t_dept.sort AS d_sort
		FROM (
			SELECT pid,name AS proj_name,create_time FROM ` + config.Pm + `.pm_project WHERE is_del=0
		)	AS t_proj
		LEFT JOIN ` + config.Mg + `.mag_department AS t_dept ON t_dept.is_del=0 AND t_dept.pid = t_proj.pid
	) AS t_proj_dept
	LEFT JOIN ` + config.Mg + `.mag_position AS t_posn ON t_posn.is_del=0 AND t_posn.did = t_proj_dept.did 
	ORDER BY t_proj_dept.pid,t_proj_dept.fid,t_proj_dept.d_sort,t_posn.did,t_posn.sort `)
	//
	defer stmt.Close()
	db.CheckErr(err)
	rows, err := stmt.Query()
	defer rows.Close()
	db.CheckErr(err)
	//
	projMap := make(map[uint64]*ProjectSingle)
	deptMap := make(map[uint64]*DepartmentSingle)
	posnMap := make(map[uint64]*PositionSingle)
	var projList []*ProjectSingle
	var deptList []*DepartmentSingle
	var posnList []*PositionSingle
	for rows.Next() {
		proj := &ProjectSingle{}
		dept := &DepartmentSingle{}
		posn := &PositionSingle{}
		rows.Scan(&proj.Pid, &proj.Name, &proj.CreateTime, &dept.Did, &dept.Fid, &dept.Name, &dept.Sort, &posn.Posnid, &posn.Name, &posn.Sort)
		// log.Println("[log]", proj.Pid, proj.Name, proj.CreateTime, dept.Did, dept.Fid, dept.Name, dept.Sort, posn.Posnid, posn.Name, posn.Sort)
		dept.Pid = proj.Pid
		posn.Did = dept.Did
		if _, ok := projMap[proj.Pid]; !ok {
			projMap[proj.Pid] = proj
			projList = append(projList, proj)
		}
		if dept.Did > 0 {
			if _, ok := deptMap[dept.Did]; !ok {
				deptMap[dept.Did] = dept
				deptList = append(deptList, dept)
			}
		}
		if posn.Posnid > 0 {
			//判断没有 dept存在也不要放进去了
			if _, ok := deptMap[dept.Did]; ok {
				posnMap[posn.Posnid] = posn
				posnList = append(posnList, posn)
			}
		}
	}
	//posn auth
	posnAuthList := this.GetPosnAuthList()
	for _, posnAuthSingle := range posnAuthList {
		if posn, ok := posnMap[posnAuthSingle.Posnid]; ok {
			posn.AuthidList = append(posn.AuthidList, posnAuthSingle.Authid)
		}
	}
	//
	var pidList []uint64
	for _, proj := range projList {
		pidList = append(pidList, proj.Pid)
	}
	//#
	data := &L2C_ManageView{
		AuthList:     this.GetAuthList(),
		UserList:     this.GetUserList(),
		ProjList:     projList,
		DeptList:     deptList,
		PosnList:     posnList,
		UserDeptList: this.GetUserDeptList(pidList...),
	}
	return data
}

func (this *Manage) ProjAdd(name string) *ProjectSingle {
	createTime := time.Now().Unix()
	stmt, err := db.GetDb().Prepare(`INSERT INTO ` + config.Pm + `.pm_project (name,create_time) VALUES (?,?)`)
	defer stmt.Close()
	db.CheckErr(err)
	res, err := stmt.Exec(name, createTime)
	db.CheckErr(err)
	_pid, err := res.LastInsertId()
	pid := uint64(_pid)
	db.CheckErr(err)
	//## 加默认职位
	// dept := this.DeptAdd(pid, 0, `管理部`)
	//## 加默认权限组
	//### 项目管理员
	var authGroupSingle *AuthGroupSingle
	authGroupSingle = this.AuthGroupAdd(pid, `项目管理员`, `可以管理该项目全部功能`)
	//加默认权限
	authidList := []uint64{AUTH_PROJECT_MANAGE, AUTH_PROJECT_PROCESS, AUTH_COLLATE_EDIT, AUTH_DEPARTMENT_MANAGE, AUTH_DEPARTMENT_PROCESS}
	this.AuthGroupEditAuth(false, authGroupSingle.Agid, authidList...)
	authGroupSingle.AuthidList = append(authGroupSingle.AuthidList, authidList...)
	//### 部门管理员
	authGroupSingle = this.AuthGroupAdd(pid, `部门管理员`, `可以管理所属部门全部功能`)
	//加默认权限
	authidList = []uint64{AUTH_DEPARTMENT_MANAGE, AUTH_DEPARTMENT_PROCESS}
	this.AuthGroupEditAuth(false, authGroupSingle.Agid, authidList...)
	authGroupSingle.AuthidList = append(authGroupSingle.AuthidList, authidList...)
	//##
	//#
	proj := &ProjectSingle{
		Pid:        pid,
		Name:       name,
		CreateTime: uint32(createTime),
		// DeptTree:   []*DepartmentSingle{dept},
	}
	return proj
}

func (this *Manage) ProjDel(pid uint64) int64 {
	stmt, err := db.GetDb().Prepare(`
	UPDATE ` + config.Pm + `.pm_project AS t_proj, ` + config.Mg + `.mag_department AS t_dept 
	SET t_proj.is_del=1,t_dept.is_del=1
	WHERE t_proj.pid=? AND t_dept.pid=?`)
	db.CheckErr(err)
	res, err := stmt.Exec(pid, pid)
	db.CheckErr(err)
	num, err := res.RowsAffected()
	db.CheckErr(err)
	return num
}

func (this *Manage) ProjEditName(pid uint64, name string) int64 {
	stmt, err := db.GetDb().Prepare(`UPDATE ` + config.Pm + `.pm_project SET name = ? WHERE pid = ?`)
	db.CheckErr(err)
	res, err := stmt.Exec(name, pid)
	db.CheckErr(err)
	num, err := res.RowsAffected()
	db.CheckErr(err)
	return num
}

func (this *Manage) DeptAdd(pid uint64, fid uint64, name string) *DepartmentSingle {
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
	/*
		var posnList []*PositionSingle
		var posn *PositionSingle
		if dept.Sort == 0 {
			//管理部 需要增加 三个默认职位
			posn = this.PosnAdd(did, `制作人`)
			posnList = append(posnList, posn)
			//
			posn = this.PosnAdd(did, `PM`)
			posnList = append(posnList, posn)
			//
			posn = this.PosnAdd(did, `管理员`)
			posnList = append(posnList, posn)
		} else {
			//其它部门 增加一个和部门同名的职位
			posn = this.PosnAdd(did, name)
			posnList = append(posnList, posn)
		}
		dept.PosnList = posnList
	*/
	return dept
}

func (this *Manage) DeptDel(didList ...uint64) int64 {
	var didStrList []string
	for _, did := range didList {
		didStrList = append(didStrList, strconv.FormatInt(int64(did), 10))
	}
	stmt, err := db.GetDb().Prepare(`UPDATE ` + config.Mg + `.mag_department SET is_del = 1 WHERE did IN (` + strings.Join(didStrList, `,`) + `) `)
	db.CheckErr(err)
	res, err := stmt.Exec()
	db.CheckErr(err)
	num, err := res.RowsAffected()
	db.CheckErr(err)
	if num > 0 {
		this.PosnDelByDid(didList...)
	}
	return num
}

func (this *Manage) DeptEditName(did uint64, name string) int64 {
	stmt, err := db.GetDb().Prepare(`UPDATE ` + config.Mg + `.mag_department SET name = ? WHERE did = ?`)
	db.CheckErr(err)
	res, err := stmt.Exec(name, did)
	db.CheckErr(err)
	num, err := res.RowsAffected()
	db.CheckErr(err)
	//# 如果内部的职位是空的(当初添加子部门 添加时一起加的 空名 职位) 也一起改名
	stmt, err = db.GetDb().Prepare(`UPDATE ` + config.Mg + `.mag_position SET name = ? WHERE did = ? AND name=''`)
	db.CheckErr(err)
	res, err = stmt.Exec(name, did)
	db.CheckErr(err)
	_, err = res.RowsAffected()
	db.CheckErr(err)
	return num
}
func (this *Manage) DeptEditSort(did uint64, fid uint64, sort uint32) int64 {
	//直接换就行, 比sort大的值都+1  因为sort不连续也没关系
	sql := `
	UPDATE manager.mag_department AS ta, manager.mag_department AS tb
	SET ta.fid=?, ta.sort = ?,tb.sort = tb.sort + 1
	WHERE ta.did = ?
	AND tb.pid=ta.pid AND tb.fid=? AND tb.sort >= ? AND tb.did <> ? `
	stmt, err := db.GetDb().Prepare(sql)
	db.CheckErr(err)
	res, err := stmt.Exec(fid, sort, did, fid, sort, did)
	db.CheckErr(err)
	num, err := res.RowsAffected()
	db.CheckErr(err)
	if num == 0 {
		//放到最后sort时, 因为tb没有符合条件的,会导致上面的代码无法生效,需要用另一个简单的修改方法
		sql = `
		UPDATE manager.mag_department AS ta
		SET ta.fid=?, ta.sort = ?
		WHERE ta.did = ?`
		stmt, err = db.GetDb().Prepare(sql)
		db.CheckErr(err)
		res, err = stmt.Exec(fid, sort, did)
		db.CheckErr(err)
		num, err = res.RowsAffected()
		db.CheckErr(err)
	}
	return num
}

func (this *Manage) PosnAdd(did uint64, name string) *PositionSingle {
	//# 插入 dept IF(?,1,0) 是 IF(fid,1,0) 根从 sort=0 开始 因为sort=0是`管理部``
	stmt, err := db.GetDb().Prepare(`INSERT INTO ` + config.Mg + `.mag_position (did,name,sort) VALUES (?,?,(
	(SELECT IFNULL(
		(SELECT ms FROM(SELECT max(sort)+1 AS ms FROM ` + config.Mg + `.mag_position WHERE did=?) m)
	,1))
))`)
	defer stmt.Close()
	db.CheckErr(err)
	res, err := stmt.Exec(did, name, did)
	db.CheckErr(err)
	_posnid, err := res.LastInsertId()
	posnid := uint64(_posnid)
	db.CheckErr(err)
	//
	posn := this.GetPosnSingle(posnid)
	//管理部门 加默认权限
	if this.GetDeptSingle(did).Sort == 0 {
		authidList := []uint64{AUTH_PROJECT_MANAGE, AUTH_PROJECT_PROCESS, AUTH_COLLATE_EDIT, AUTH_DEPARTMENT_MANAGE, AUTH_DEPARTMENT_PROCESS}
		this.PosnEditAuth(false, posn.Posnid, authidList...)
		posn.AuthidList = append(posn.AuthidList, authidList...)
	}
	return posn
}

func (this *Manage) PosnDel(posnid uint64) int64 {
	stmt, err := db.GetDb().Prepare(`UPDATE ` + config.Mg + `.mag_position SET is_del=1 WHERE posnid=?`)
	defer stmt.Close()
	db.CheckErr(err)
	res, err := stmt.Exec(posnid)
	db.CheckErr(err)
	num, err := res.RowsAffected()
	db.CheckErr(err)
	return num
}

func (this *Manage) PosnDelByDid(didList ...uint64) int64 {
	var didStrList []string
	for _, did := range didList {
		didStrList = append(didStrList, strconv.FormatInt(int64(did), 10))
	}
	stmt, err := db.GetDb().Prepare(`UPDATE ` + config.Mg + `.mag_position SET is_del = 1 WHERE did IN (` + strings.Join(didStrList, `,`) + `)`)
	db.CheckErr(err)
	res, err := stmt.Exec()
	db.CheckErr(err)
	num, err := res.RowsAffected()
	db.CheckErr(err)
	return num
}

func (this *Manage) PosnEditName(posnid uint64, name string) int64 {
	stmt, err := db.GetDb().Prepare(`UPDATE ` + config.Mg + `.mag_position SET name=? WHERE posnid=?`)
	defer stmt.Close()
	db.CheckErr(err)
	res, err := stmt.Exec(name, posnid)
	db.CheckErr(err)
	num, err := res.RowsAffected()
	db.CheckErr(err)
	return num
}

func (this *Manage) PosnEditSort(posnid uint64, sort uint32) int64 {
	//直接换就行, 比sort大的值都+1  因为sort不连续也没关系
	sql := `
	UPDATE manager.mag_position AS ta, manager.mag_position AS tb
	SET ta.sort = ?,tb.sort = tb.sort + 1
	WHERE ta.posnid = ?
	AND tb.did=ta.did AND tb.sort >= ? AND tb.posnid <> ? `
	stmt, err := db.GetDb().Prepare(sql)
	db.CheckErr(err)
	res, err := stmt.Exec(sort, posnid, sort, posnid)
	db.CheckErr(err)
	num, err := res.RowsAffected()
	db.CheckErr(err)
	if num == 0 {
		//放到最后sort时, 因为tb没有符合条件的,会导致上面的代码无法生效,需要用另一个简单的修改方法
		sql = `
		UPDATE manager.mag_position AS ta
		SET ta.sort = ?
		WHERE ta.posnid = ?`
		stmt, err = db.GetDb().Prepare(sql)
		db.CheckErr(err)
		res, err = stmt.Exec(sort, posnid)
		db.CheckErr(err)
		num, err = res.RowsAffected()
		db.CheckErr(err)
	}
	return num
}

/**增加或设置权限
firstAdd 是否初次添加
*/
func (this *Manage) PosnEditAuth(removeOld bool, posnid uint64, authidList ...uint64) []*PosnAuthSingle {
	var list []*PosnAuthSingle
	//先删除旧的
	if removeOld {
		stmt, err := db.GetDb().Prepare(`DELETE FROM ` + config.Mg + `.mag_posn_auth WHERE posnid = ?`)
		defer stmt.Close()
		db.CheckErr(err)
		_, err = stmt.Exec(posnid)
		db.CheckErr(err)
	}
	for _, authid := range authidList {
		stmt, err := db.GetDb().Prepare(`REPLACE INTO ` + config.Mg + `.mag_posn_auth (posnid,authid) VALUES (?,?)`)
		defer stmt.Close()
		db.CheckErr(err)
		_, err = stmt.Exec(posnid, authid)
		db.CheckErr(err)
		single := &PosnAuthSingle{
			Posnid: posnid,
			Authid: authid,
		}
		list = append(list, single)
	}
	return list
}

/**权限组*/
func (this *Manage) AuthGroupAdd(pid uint64, name string, dcs string) *AuthGroupSingle {
	//# 插入 dept IF(?,1,0) 是 IF(fid,1,0) 根从 sort=0 开始 因为sort=0是`管理部``
	stmt, err := db.GetDb().Prepare(`INSERT INTO ` + config.Mg + `.mag_auth_group (pid,name,description,sort) VALUES (?,?,?,(
	(SELECT IFNULL(
		(SELECT ms FROM(SELECT max(sort)+1 AS ms FROM ` + config.Mg + `.mag_auth_group WHERE pid=?) m)
	,1))
))`)
	defer stmt.Close()
	db.CheckErr(err)
	res, err := stmt.Exec(pid, name, dcs, pid)
	db.CheckErr(err)
	_agid, err := res.LastInsertId()
	agid := uint64(_agid)
	db.CheckErr(err)
	//
	return this.GetAuthGroupSingle(agid)
}

func (this *Manage) AuthGroupDel(agid uint64) int64 {
	stmt, err := db.GetDb().Prepare(`UPDATE ` + config.Mg + `.mag_auth_group SET is_del=1 WHERE agid=?`)
	defer stmt.Close()
	db.CheckErr(err)
	res, err := stmt.Exec(agid)
	db.CheckErr(err)
	num, err := res.RowsAffected()
	db.CheckErr(err)
	return num
}

func (this *Manage) AuthGroupDelByPid(pid uint64) int64 {
	stmt, err := db.GetDb().Prepare(`UPDATE ` + config.Mg + `.mag_auth_group SET is_del = 1 WHERE pid=?)`)
	db.CheckErr(err)
	res, err := stmt.Exec(pid)
	db.CheckErr(err)
	num, err := res.RowsAffected()
	db.CheckErr(err)
	return num
}

func (this *Manage) AuthGroupName(agid uint64, name string) int64 {
	stmt, err := db.GetDb().Prepare(`UPDATE ` + config.Mg + `.mag_auth_group SET name=? WHERE agid=?`)
	defer stmt.Close()
	db.CheckErr(err)
	res, err := stmt.Exec(name, agid)
	db.CheckErr(err)
	num, err := res.RowsAffected()
	db.CheckErr(err)
	return num
}
func (this *Manage) AuthGroupDsc(agid uint64, dsc string) int64 {
	stmt, err := db.GetDb().Prepare(`UPDATE ` + config.Mg + `.mag_auth_group SET description=? WHERE agid=?`)
	defer stmt.Close()
	db.CheckErr(err)
	res, err := stmt.Exec(dsc, agid)
	db.CheckErr(err)
	num, err := res.RowsAffected()
	db.CheckErr(err)
	return num
}

func (this *Manage) AuthGroupEditSort(agid uint64, sort uint32) int64 {
	//直接换就行, 比sort大的值都+1  因为sort不连续也没关系
	sql := `
	UPDATE manager.mag_auth_group AS ta, manager.mag_auth_group AS tb
	SET ta.sort = ?,tb.sort = tb.sort + 1
	WHERE ta.agid = ?
	AND tb.pid=ta.pid AND tb.sort >= ? AND tb.agid <> ? `
	stmt, err := db.GetDb().Prepare(sql)
	db.CheckErr(err)
	res, err := stmt.Exec(sort, agid, sort, agid)
	db.CheckErr(err)
	num, err := res.RowsAffected()
	db.CheckErr(err)
	if num == 0 {
		//放到最后sort时, 因为tb没有符合条件的,会导致上面的代码无法生效,需要用另一个简单的修改方法
		sql = `
		UPDATE manager.mag_auth_group AS ta
		SET ta.sort = ?
		WHERE ta.agid = ?`
		stmt, err = db.GetDb().Prepare(sql)
		db.CheckErr(err)
		res, err = stmt.Exec(sort, agid)
		db.CheckErr(err)
		num, err = res.RowsAffected()
		db.CheckErr(err)
	}
	return num
}

func (this *Manage) AuthGroupEditAuth(removeOld bool, agid uint64, authidList ...uint64) []*AuthGroupAuthSingle {
	var list []*AuthGroupAuthSingle
	//先删除旧的
	if removeOld {
		stmt, err := db.GetDb().Prepare(`DELETE FROM ` + config.Mg + `.mag_auth_group WHERE agid = ?`)
		defer stmt.Close()
		db.CheckErr(err)
		_, err = stmt.Exec(agid)
		db.CheckErr(err)
	}
	for _, authid := range authidList {
		stmt, err := db.GetDb().Prepare(`REPLACE INTO ` + config.Mg + `.mag_auth_group (agid,authid) VALUES (?,?)`)
		defer stmt.Close()
		db.CheckErr(err)
		_, err = stmt.Exec(agid, authid)
		db.CheckErr(err)
		single := &AuthGroupAuthSingle{
			Agid:   agid,
			Authid: authid,
		}
		list = append(list, single)
	}
	return list
}

/**工程新增user 或者 修改 user的职位*/
func (this *Manage) UserEditDept(userDeptList ...*UserDeptSingle) int64 {
	var numAll int64
	for _, userRlat := range userDeptList {
		stmt, err := db.GetDb().Prepare(`REPLACE INTO ` + config.Mg + `.mag_user_dept (uid,pid,did) VALUES (?,?,?)`)
		defer stmt.Close()
		db.CheckErr(err)
		res, err := stmt.Exec(userRlat.Uid, userRlat.Pid, userRlat.Did)
		db.CheckErr(err)
		num, err := res.RowsAffected()
		db.CheckErr(err)
		numAll += num
	}
	return 0
}

/**工程移除user*/
func (this *Manage) ProjDelUser(uid uint64, pid uint64) int64 {
	stmt, err := db.GetDb().Prepare(`DELETE FROM ` + config.Mg + `.mag_user_dept WHERE uid = ? AND pid = ?`)
	defer stmt.Close()
	db.CheckErr(err)
	res, err := stmt.Exec(uid, pid)
	db.CheckErr(err)
	num, err := res.RowsAffected()
	db.CheckErr(err)
	return num
}

// func (this *Manage) PosnAuthDel(posnid uint64, auth uint64) uint32 {

// }

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

//全部 posn_auth
func (this *Manage) GetPosnAuthList() []*PosnAuthSingle {
	stmt, err := db.GetDb().Prepare(`SELECT posnid,authid FROM ` + config.Mg + `.mag_posn_auth`)
	defer stmt.Close()
	db.CheckErr(err)
	rows, err := stmt.Query()
	defer rows.Close()
	db.CheckErr(err)
	var list []*PosnAuthSingle
	for rows.Next() {
		single := &PosnAuthSingle{}
		rows.Scan(&single.Posnid, &single.Authid)
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
func (this *Manage) GetPosnSingle(posnid uint64) *PositionSingle {
	stmt, err := db.GetDb().Prepare(`SELECT posnid,did,name,sort FROM ` + config.Mg + `.mag_position WHERE posnid = ?`)
	defer stmt.Close()
	db.CheckErr(err)
	single := &PositionSingle{}
	stmt.QueryRow(posnid).Scan(&single.Posnid, &single.Did, &single.Name, &single.Sort)
	return single
}
func (this *Manage) GetAuthGroupSingle(agid uint64) *AuthGroupSingle {
	stmt, err := db.GetDb().Prepare(`SELECT agid,pid,name,description,sort FROM ` + config.Mg + `.mag_auth_group WHERE agid = ?`)
	defer stmt.Close()
	db.CheckErr(err)
	single := &AuthGroupSingle{}
	stmt.QueryRow(agid).Scan(&single.Agid, &single.Pid, &single.Name, &single.Desc, &single.Sort)
	return single
}

//玩家关系表   是 mag_user_proj_relation表的数据, 但结构被UserSingle包含了 所以就用UserSingle吧
func (this *Manage) GetUserDeptList(pidList ...uint64) []*UserDeptSingle {
	var pidStrList []string
	for _, pid := range pidList {
		log.Println("[log]", pid, ":[pid]")
		pidStrList = append(pidStrList, strconv.FormatInt(int64(pid), 10))
	}
	sql := `SELECT uid,pid,did FROM ` + config.Mg + `.mag_user_dept WHERE pid IN (` + strings.Join(pidStrList, `,`) + `)`
	log.Println("[log]", sql, ":[sql]")
	stmt, err := db.GetDb().Prepare(sql)
	defer stmt.Close()
	db.CheckErr(err)
	rows, err := stmt.Query()
	defer rows.Close()
	db.CheckErr(err)
	var list []*UserDeptSingle
	for rows.Next() {
		single := &UserDeptSingle{}
		rows.Scan(&single.Uid, &single.Pid, &single.Did)
		log.Println("[log]", single.Uid, ":[single.Uid]")
		list = append(list, single)
	}
	return list
}
