package main

import (
	"fmt"
	"time"
)

type Timer struct {
}

func NewTimer() *Timer {
	instance := &Timer{}
	return instance
}

func (this *Timer) Run() {
	ticker := time.NewTicker(time.Hour * 1)
	for {
		select {
		case <-ticker.C:
			this.ProcessScore()
		}
	}
}

//获取 管理者管理的部门 map  key: 部门did  item:部门主管uid
func (this *Timer) getDidToUidMap() *map[uint64]uint64 {
	stmt, err := db.GetDb().Prepare(`SELECT t3.uid,t4.did FROM (
	SELECT t1.*,if(t2.fid=0,t1.did,t2.fid) AS fid FROM (
	SELECT uid,did,name FROM ` + config.Mg + `.mag_user WHERE gid = 1 AND did > 0
	) AS t1 LEFT JOIN ` + config.Mg + `.mag_department AS t2 ON t1.did = t2.did ) AS t3 LEFT JOIN ` + config.Mg + `.mag_department AS t4 ON t3.fid = t4.did OR t3.fid = t4.fid ORDER BY t3.uid DESC`)
	defer stmt.Close()
	db.CheckErr(err)
	rows, err := stmt.Query()
	db.CheckErr(err)
	didToUidMap := make(map[uint64]uint64)
	for rows.Next() {
		var uid, did uint64
		rows.Scan(&uid, &did)
		didToUidMap[did] = uid
	}
	return &didToUidMap
}

//推送点评
func (this *Timer) ProcessScore() bool {
	//管理者管理的部门
	didToUidMap := *this.getDidToUidMap()
	//需要通知评价内容
	stmt, err := db.GetDb().Prepare(`SELECT t5.*,t6.name AS mname,t6.vid FROM (SELECT t3.*,t4.did FROM (SELECT t1.*,t2.uid,t2.mid,t2.name AS lname FROM (
	SELECT wid,lid,date FROM ` + config.Pm + `.pm_work WHERE date BETWEEN DATE_ADD(CURDATE(),INTERVAL -7 DAY) AND DATE_ADD(CURDATE(),INTERVAL -1 DAY) AND status = 3 AND wid NOT IN(SELECT wid FROM pm.pm_work_score)
	) AS t1 LEFT JOIN ` + config.Pm + `.pm_link AS t2 ON t1.lid = t2.lid ) AS t3 LEFT JOIN ` + config.Mg + `.mag_user AS t4 ON t3.uid = t4.uid) AS t5 LEFT JOIN ` + config.Pm + `.pm_mode AS t6 ON t5.mid = t6.mid`)
	db.CheckErr(err)
	rows, err := stmt.Query()
	db.CheckErr(err)
	dataMap := make(map[uint64][]*ScoreNoticeSingle)
	for rows.Next() {
		single := &ScoreNoticeSingle{}
		rows.Scan(&single.Wid, &single.Lid, &single.Date, &single.Uid, &single.Mid, &single.Lname, &single.Did, &single.Mname, &single.Vid)
		if muid, ok := didToUidMap[single.Did]; ok {
			dataMap[muid] = append(dataMap[muid], single)
		}
	}
	//发送通知数据
	for muid, list := range dataMap {
		user := session.GetUser(muid)
		if user == nil {
			continue
		}
		data := &L2C_ProcessScoreNotice{
			List: list,
		}
		user.SendTo(L2C_PROCESS_SCORE_NOTICE, data)
		fmt.Println("发送信息通知", user.GetName(), "数量", len(list))
	}
	return true
}
