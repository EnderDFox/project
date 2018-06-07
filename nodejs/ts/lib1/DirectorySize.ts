import * as fs from "fs"
import * as path from "path"

export interface FileSizeItem {
    FullPath?: string
    Name?: string
    Size?: number
    Children?: FileSizeItem[]
}

export class DirectorySize {
    root: FileSizeItem
    init(root: string) {
        this.root = this.analyze(root)
    }
    analyze(fullPath:string):FileSizeItem{
        var item:FileSizeItem = {
            FullPath: fullPath,
            Name: path.parse(fullPath).name
        }
        var stat = fs.statSync(fullPath)
        if(stat.isDirectory()){
            item.Children = []
            this.root.Size  = 0
            var files = fs.readdirSync(fullPath)
            var len = files.length
            for (var i = 0; i < len; i++) {
                var fileChild = files[i]
                var child:FileSizeItem = this.analyze(fileChild)
                this.root.Children.push(child)
                this.root.Size += child.Size
            }
        }else{
            this.root.Size = stat.size
        }
        return item
    }
}