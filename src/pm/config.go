package main

import (
	"encoding/xml"
	"fmt"
	"io/ioutil"
)

type Config struct {
	Db struct {
		Name string `xml:"name"`
		Host string `xml:"host"`
		Port string `xml:"port"`
		User string `xml:"user"`
		Pass string `xml:"pass"`
		Char string `xml:"char"`
	} `xml:"db"`
	Mg     string `xml:"mg"`
	Pm     string `xml:"pm"`
	Web    string `xml:"web"`
	Upload string `xml:"upload"`
}

func NewConfig() *Config {
	instance := &Config{}
	instance.LoadCfg()
	return instance
}

type ConfigXML struct {
	Db struct {
		Name string `xml:"name"`
		Host string `xml:"host"`
		Port string `xml:"port"`
		User string `xml:"user"`
		Pass string `xml:"pass"`
		Char string `xml:"char"`
	} `xml:"db"`
}

func (this *Config) LoadCfg() bool {
	contents, err := ioutil.ReadFile("config.xml")
	if err != nil {
		fmt.Println("config.xml 加载失败", err)
		return false
	}
	err = xml.Unmarshal(contents, this)
	if err != nil {
		fmt.Println("config.xml 解析失败", err)
		return false
	}
	return true
}
