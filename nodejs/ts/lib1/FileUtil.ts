import * as fs from "fs";
import * as path from "path";

export class FileUtil {
     /**得到目录下所有文件(不包括文件夹) (递归) */
    static getFileAll(dir: string, extNeed: string[], extIgnore: string[]): FileItem[] {
        var fileAll: FileItem[] = []
        if (dir == null || dir.trim() == "") {
            return [];
        }
        if (dir.indexOf("/") == -1) {
            dir += "/";
        }
        var files = fs.readdirSync(dir);
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var fullname = path.resolve(dir, file);
            // console.log("parseDir item:", fullname, file);
            try {
                var stat = fs.lstatSync(fullname);
                if (file.indexOf(".") == 0) {
                    // console.info("[info]", "过滤掉以 . 开头的File",fullname);
                    continue;
                }
                var ext = path.extname(fullname).toLowerCase();
                ext = ext.replace(/\./g, '') //去掉 `.`
                if (extIgnore.indexOf(ext) > -1) continue;
                if (extNeed.length > 0 && extNeed.indexOf(ext) == -1) continue;
                if (stat.isDirectory()) {
                    fileAll = fileAll.concat(FileUtil.getFileAll(fullname,extNeed,extIgnore));//recursive children folders
                } else {
                    fileAll.push(
                        {
                            uuid: fileAll.length,
                            name: path.parse(fullname).base,
                            parent: path.parse(fullname).dir,
                        }
                    );
                }
            } catch (error) {
                console.log("[debug] catch error:", error)
            }
        }
        return fileAll
    }
}