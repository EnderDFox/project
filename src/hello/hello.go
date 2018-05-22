package main

import (
	"fmt"
)

func main() {
	var i8 uint8
	i8 = 5
	var i64 uint64
	i64 = uint64(i8)
	fmt.Println(`main 1`, i8, i64)
}
