package main

import (
	//"fmt"
	"time"
)

type Profile struct {
	owner *User
}

func NewProfile(user *User) *Profile {
	instance := &Profile{}
	instance.owner = user
	return instance
}

//获取列表
func (this *Profile) GetList() []*ProfileSingle {
	TimeStamp := time.Now().Unix()
	TimeFmt := "2006-01-02"
	BeginDate := time.Unix(TimeStamp-86400, 0).Format(TimeFmt)
	EndDate := time.Unix(TimeStamp+86400*3, 0).Format(TimeFmt)
	stmt, err := db.GetDb().Prepare(`SELECT t4.name as mname,t3.lname,t3.date,t3.tips,t3.status,t3.inspect,t3.min_num,t3.max_num,t3.tag,t4.ver FROM (
	SELECT t2.uid,t2.mid,t2.name as lname,t1.* FROM (
	SELECT lid,date,tips,status,inspect,min_num,max_num,tag FROM ` + config.Pm + `.pm_work where date >= ? and date <= ?
	) as t1 left join ` + config.Pm + `.pm_link as t2 on t1.lid = t2.lid where t2.uid = ? ) as t3 left join ` + config.Pm + `.pm_mode as t4 on t3.mid = t4.mid order by t3.date asc`)
	defer stmt.Close()
	db.CheckErr(err)
	rows, err := stmt.Query(BeginDate, EndDate, this.owner.GetUid()) //this.owner.GetUid() 4
	defer rows.Close()
	db.CheckErr(err)
	var profileList []*ProfileSingle
	db.CheckErr(err)
	for rows.Next() {
		single := &ProfileSingle{}
		rows.Scan(&single.MName, &single.LName, &single.Date, &single.Tips, &single.Status, &single.Inspect, &single.MinNum, &single.MaxNum, &single.Tag, &single.Ver)
		profileList = append(profileList, single)
	}
	return profileList
}

//预览
func (this *Profile) View() bool {
	//内容列表
	profileList := this.GetList()
	//标签列表
	tagsList := this.owner.Collate().GetTagsList()
	data := &L2C_ProfileView{
		TagsList:    tagsList,
		ProfileList: profileList,
	}
	//fmt.Println(data.ProfileList)
	this.owner.SendTo(L2C_PROFILE_VIEW, data)
	return true
}
