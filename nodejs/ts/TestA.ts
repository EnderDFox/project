import * as fs from "fs"
import * as path from "path"
import { FILE } from "dns";
import { DirectorySize,FileSizeItem } from "./lib1/DirectorySize";
class TestA {
    public t1() {
        var count = 35;
        var str1: string = "";
        var str2: string = "";
        for (let i = 1; i <= count; i++) {
            str1 += `Testb${i}:\n`;
            str1 += `    scale: 0.99\n`;
            str1 += `    files: [\n`;
            str1 += `        2048/testb${i}.png\n`;
            str1 += `    ]\n`;
            //
            str2 += `case ${i}:
            sprf->CreateAtlas(Testb${i}::Desc());
            spriteDesc0.Image = "2048/testb${i}";
            break;
            `;
        }
        console.log(str1);
        console.log(str2);
    }
    t2() {
        var rows: string[] = [];
        for (let row = 0; row < 16 * 2; row++) {
            var cols: number[] = [];
            for (let col = 0; col < 7 * 3; col++) {
                cols.push((col + row) % 7);
            }
            rows.push(cols.join(','));
        }
        console.log(rows.join(',\n'));
    }
    t3() {
        let files:string[] = fs.readdirSync(`C:/fox/projects/helloworld/lua/tolua_unity5/Assets/CatchFishes/Resources/csv/track`);
        console.log("[debug]",files.length,"`files.length`");
        let rs:string[] = [];
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            if(path.extname(file)==".csv"){
                rs.push(path.basename(file).replace(".csv","")) 
            }
        }
        console.log("[info]",rs.join(","));
    }

    Rename(){
        var dir:string = `D:/AmazingGame/tool_svn/src/pm`
        var files:string[]=fs.readdirSync(dir)
        var len = files.length
        for (var i = 0; i < len; i++) {
            var file:string = files[i]
            if(path.extname(file) == ".go"){
                fs.renameSync(path.resolve(dir,file), path.resolve(dir,this.GetName(file)))
            }
        }
    }
    GetName(file:string):string{
        var rs:string[] = []
        var arr:string[] = file.split('_')
        var len = arr.length
        for (var i = 0; i < len; i++) {
            var item = arr[i]
            if(item){
                item = item.substr(0,1).toUpperCase()+item.substring(1,item.length)
                rs.push(item)
            }
        }
        return rs.join('')
    }
}

// new TestA().t3();
new TestA().Rename();