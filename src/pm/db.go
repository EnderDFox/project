package main

import (
	"database/sql"
	"log"
	"reflect"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

type Db struct {
	db *sql.DB
	ok bool
}

func NewDb() *Db {
	dbPtr := &Db{}
	db, err := dbPtr.Connect()
	if err == nil {
		db.SetMaxOpenConns(2000)
		db.SetMaxIdleConns(1000)
		dbPtr.db = db
		dbPtr.ok = true
		//保持链接
		dbPtr.KeepConnect()

	} else {
		dbPtr.ok = false
	}
	return dbPtr
}

//链接
func (this *Db) Connect() (*sql.DB, error) {
	return sql.Open(config.Db.Name, config.Db.User+":"+config.Db.Pass+"@tcp("+config.Db.Host+":"+config.Db.Port+")/?charset="+config.Db.Char)
}

//保持链接
func (this *Db) KeepConnect() {
	ticker := time.NewTicker(time.Minute * 15)
	go func() {
		for _ = range ticker.C {
			err := this.db.Ping()
			if err != nil {
				this.db, _ = this.Connect()
				log.Println("KeepConnect", err)
			}
		}
	}()
}

//获取db
func (this *Db) GetDb() *sql.DB {
	return this.db
}

//获取状态
func (this *Db) IsOk() bool {
	return this.ok
}

//错误检查
func (this *Db) CheckErr(err error) {
	if err != nil {
		panic(err)
	}
}

//获取全部数据
//ptr结构体非指针//sql语句//args条件//返回列表指针
func (this *Db) FetchAll(ptr interface{}, sql string, args ...interface{}) []interface{} {
	stmt, err := this.GetDb().Prepare(sql)
	defer stmt.Close()
	this.CheckErr(err)
	rows, err := stmt.Query(args...)
	defer rows.Close()
	this.CheckErr(err)
	var list []interface{}
	columns, _ := rows.Columns()
	columnLength := len(columns)
	t := reflect.ValueOf(ptr).Type()
	fieldLength := t.NumField()
	for rows.Next() {
		o := reflect.New(t)
		p := o.Elem()
		value := make([]interface{}, columnLength)
		param := make([]interface{}, columnLength)
		for i := 0; i < columnLength; i++ {
			param[i] = &value[i]
		}
		rows.Scan(param...)
		for i := 0; i < fieldLength; i++ {
			field := p.Field(i)
			data := *param[i].(*interface{})
			switch p.Field(i).Kind() {
			case reflect.Uint, reflect.Uint8, reflect.Uint16, reflect.Uint32, reflect.Uint64, reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64:
				field.SetUint(uint64(data.(int64)))
			case reflect.Float32, reflect.Float64:
				field.SetFloat(float64(data.(float64)))
			case reflect.String:
				field.SetString(string(data.([]byte)))
			}
		}
		list = append(list, o.Interface())
	}
	return list
}

//交换排序
func (this *Db) SwapSort(tableName string, fieldName string, id1 uint64, id2 uint64) {
	tableName = config.Pm + "." + tableName
	stmt, err := db.GetDb().Prepare(`
		UPDATE ` + tableName + ` a,` + tableName + ` b,
		(SELECT @a:=` + tableName + `.sort va 
			FROM ` + tableName + ` 
			WHERE ` + tableName + `.` + fieldName + `=?) tas,
		(SELECT @b:=` + tableName + `.sort vb 
			FROM ` + tableName + ` 
			WHERE ` + tableName + `.` + fieldName + `=?) tbs 
		SET a.sort = @b,b.sort=@a WHERE a.` + fieldName + `=? and b.` + fieldName + `=?`)
	defer stmt.Close()
	db.CheckErr(err)
	_, err = stmt.Exec(id1, id2, id1, id2)
	db.CheckErr(err)
}

/*
type TestUser struct {
	Uid  uint64
	Name string
	Gid  uint64
}

//测试
func (this *Db) Test() {
	sql := "select uid,name,gid from manager.mag_user limit ?"
	ptr := &TestUser{}
	list := this.FetchAll(*ptr, sql, 5)
	for _, data := range list {
		log.Println(data.(*TestUser))
	}
}
*/
