var fs = require("fs");
var yaml = require("js-yaml");
console.log(__dirname);
let str = fs.readFileSync(__dirname+"/yaml.yaml");
let obj = yaml.load(str);
console.log(obj);