package main

//版本 与 版本时间

import (
	"log"
	"time"
)

type Version struct {
	owner *User
}

func NewVersion(user *User) *Version {
	instance := &Version{}
	instance.owner = user
	return instance
}

func (this *Version) VersionList() []*VersionSingle {
	stmt, err := db.GetDb().Prepare(`SELECT vid,ver,name FROM ` + config.Pm + `.pm_version WHERE pid = ? AND is_del=0 ORDER BY sort DESC, vid DESC`)
	defer stmt.Close()
	db.CheckErr(err)
	rows, err := stmt.Query(COMMON_PID)
	defer rows.Close()
	db.CheckErr(err)
	var versionList []*VersionSingle
	for rows.Next() {
		single := &VersionSingle{}
		rows.Scan(&single.Vid, &single.Ver, &single.Name)
		single.PublishList = this.PublishList(single.Vid)
		versionList = append(versionList, single)
	}
	return versionList
}

func (this *Version) PublishList(vid uint64) []*PublishSingle {
	stmt, err := db.GetDb().Prepare(`SELECT genre,date_line FROM ` + config.Pm + `.pm_publish WHERE pid = ? AND vid = ? ORDER BY genre`)
	defer stmt.Close()
	db.CheckErr(err)
	rows, err := stmt.Query(COMMON_PID, vid)
	defer rows.Close()
	db.CheckErr(err)
	var publishList []*PublishSingle
	for rows.Next() {
		single := &PublishSingle{}
		rows.Scan(&single.Genre, &single.DateLine)
		publishList = append(publishList, single)
	}
	return publishList
}

func (this *Version) VersionAdd(ver string, name string) bool {
	stmt, err := db.GetDb().Prepare(`INSERT INTO ` + config.Pm + `.pm_version (pid,ver,name,add_uid,create_time,sort) VALUES (?,?,?,?,?,(
		(SELECT IFNULL(
			(SELECT ms FROM(SELECT max(sort)+1 AS ms FROM ` + config.Pm + `.pm_version) m)
		,1))
		))`)
	defer stmt.Close()
	db.CheckErr(err)
	res, err := stmt.Exec(COMMON_PID, ver, name, this.owner.GetUid(), time.Now().Unix())
	db.CheckErr(err)
	vid, err := res.LastInsertId()
	db.CheckErr(err)
	versionSingle := &VersionSingle{
		Vid:  uint64(vid),
		Ver:  ver,
		Name: name,
	}
	data := &L2C_VersionAdd{
		VersionSingle: versionSingle,
	}
	this.owner.SendToAll(L2C_VERSION_ADD, data)
	return true
}

func (this *Version) VersionDelete(vid uint64) bool {
	//设置 is_del=1
	stmt, err := db.GetDb().Prepare(`UPDATE ` + config.Pm + `.pm_version SET is_del = 1 WHERE vid=?;`)
	defer stmt.Close()
	db.CheckErr(err)
	_, err = stmt.Exec(vid)
	db.CheckErr(err)
	//比当前大的sort-1 没必要改,不影响排序的
	//
	data := &L2C_VersionDelete{
		Vid: vid,
	}
	this.owner.SendToAll(L2C_VERSION_DELETE, data)
	return true
}

func (this *Version) VersionChangeVer(vid uint64, ver string) bool {
	stmt, err := db.GetDb().Prepare(`UPDATE ` + config.Pm + `.pm_version SET ver = ? WHERE vid=?`)
	defer stmt.Close()
	db.CheckErr(err)
	_, err = stmt.Exec(ver, vid)
	db.CheckErr(err)
	//
	data := &L2C_VersionChangeVer{
		Vid: vid,
		Ver: ver,
	}
	this.owner.SendToAll(L2C_VERSION_CHANGE_VER, data)
	return true
}

func (this *Version) VersionChangeName(vid uint64, name string) bool {
	stmt, err := db.GetDb().Prepare(`UPDATE ` + config.Pm + `.pm_version SET name = ? WHERE vid=?`)
	defer stmt.Close()
	db.CheckErr(err)
	_, err = stmt.Exec(name, vid)
	db.CheckErr(err)
	//
	data := &L2C_VersionChangeName{
		Vid:  vid,
		Name: name,
	}
	this.owner.SendToAll(L2C_VERSION_CHANGE_NAME, data)
	return true
}

func (this *Version) VersionChangePublish(vid uint64, genre uint32, dateLine string) bool {
	if dateLine == "" {
		//删除
		stmt, err := db.GetDb().Prepare(`DELETE FROM ` + config.Pm + `.pm_publish WHERE pid=? AND vid=? AND genre=?`)
		defer stmt.Close()
		db.CheckErr(err)
		res, err := stmt.Exec(COMMON_PID, vid, genre)
		db.CheckErr(err)
		num, err := res.RowsAffected()
		db.CheckErr(err)
		if num == 0 {
			log.Println(`[ERROR][SQL]VersionChangePublish DELETE ERROR affected row : 0`)
			return false
		}
	} else {
		stmt, err := db.GetDb().Prepare(`REPLACE INTO ` + config.Pm + `.pm_publish (pid, vid, genre, date_line, create_time) VALUES (?,?,?,?,?)`)
		defer stmt.Close()
		db.CheckErr(err)
		res, err := stmt.Exec(COMMON_PID, vid, genre, dateLine, time.Now().Unix())
		db.CheckErr(err)
		num, err := res.RowsAffected()
		db.CheckErr(err)
		if num == 0 {
			log.Println(`[ERROR][SQL]REPLACE INTO pm.pm_publish (pid,genre,date_line, create_time,vid) VALUES (?????) affected row : 0`, `[vid]:`, vid, `[genre]:`, genre, `[dateline]:`, dateLine)
			return false
		}
	}
	data := &L2C_VersionChangePublish{
		Vid:      vid,
		Genre:    genre,
		DateLine: dateLine,
	}
	this.owner.SendToAll(L2C_VERSION_CHANGE_PUBLISH, data)
	return true
}

//交换两个version的sort
func (this *Version) VersionChangeSort(vid1 uint64, vid2 uint64) bool {
	db.SwapSort(`pm_version`, `vid`, vid1, vid2)
	//发送给所有人
	data := &C2L_VersionChangeSort{
		Vid1: vid1,
		Vid2: vid2,
	}
	this.owner.SendToAll(L2C_VERSION_CHANGE_SORT, data)
	return true
}
