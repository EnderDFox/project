import * as fs from "fs"
import * as path from "path"
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
}

new TestA().t3();