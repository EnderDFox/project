interface IVueData {
    msg?: string
    error?: string
    showRandom?: boolean
    showChildren?: boolean
    currPath?: string
    canBackCurrPath?: boolean
    randomItems?: FileItem[]
    childrenSelectedAll?: boolean
    childItems?: IChildFile[]
}
interface FileItem {
    uuid?: number
    name?: string
    parent?: string
}
interface IChildFile {
    uuid?: number
    name?: string
    parent?: string
    isDir?: boolean
    newName?: string
    selected?: boolean
}