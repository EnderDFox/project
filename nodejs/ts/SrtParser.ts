import * as fs from "fs";
import * as path from "path";
import * as parseArgs from "minimist";

namespace SrcParsers {
    export class SrcParser {
        input:string;
        output:string;
        exec() {
            // var srtBuffer: Buffer = fs.readFileSync('raw/Zootopia.srt');
            var srtBuffer: Buffer = fs.readFileSync(this.input);
            var srt = srtBuffer.toString()
            srt = srt.replace(/\r\n/g, Words.LF)
            let lexical = new Lexical()
            lexical.parse(srt)
            //
            new JsonWritor(this.output).parse(lexical);
        }
    }
    class JsonWritor {
        output:string;
        lexical: Lexical;
        constructor(output:string){
            this.output = output;
        }
        parse(lexical: Lexical) {
            this.lexical = lexical;
            // this.writeRaw();
            this.writeJson();
        }
        writeJson() {
            var srtItems = [];
            var srtItem: SrtItem = null
            let len = this.lexical.results.length
            for (let i = 0; i < len; i++) {
                let item: LexicalResultItem = this.lexical.results[i];
                switch (item.state) {
                    case LexicalStateEnum.LineNumber:
                        srtItem = {};
                        srtItem.lineNumber = parseInt(item.chars.join(''))
                        srtItems.push(srtItem)
                        break;
                    case LexicalStateEnum.StartTime:
                        srtItem.startTime = this.timeStrToMs(item.chars.join(''))
                        break;
                    case LexicalStateEnum.EndTime:
                        srtItem.endTime = this.timeStrToMs(item.chars.join(''))
                        break;
                    case LexicalStateEnum.Content:
                        // srtItem.content = item.chars.join('')
                        let content =  item.chars.join('');
                        let sp = content.split(Words.LF);
                        srtItem.contentCN = sp[0]
                        srtItem.contentEN = sp[1]
                        break;
                }
            }
            // fs.writeFileSync('raw/Zootopia.srt.json', JSON.stringify(srtItems))
            console.log("[info]",srtItems.length,"<-`srtItems.length`");
            fs.writeFileSync(this.output, JSON.stringify(srtItems))
        }
        /**
         * 
         * @param timeStr e.g. 01:39:07,850
         */
        timeStrToMs(timeStr:string):number{
            let sp = timeStr.split(',')
            let spSecond = sp[0].split(':')
            let rs:number = 0
            spSecond.reverse()
            if(spSecond.length>2){
                rs += parseInt(spSecond[2])*3600
            }
            if(spSecond.length>1){
                rs += parseInt(spSecond[1])*60
            }
            rs += parseInt(spSecond[0])
            rs *= 1000
            rs += parseInt(sp[1])
            return rs
        }
        writeRaw() {
            var rs: string = ''
            let len = this.lexical.results.length
            for (let i = 0; i < len; i++) {
                let item: LexicalResultItem = this.lexical.results[i];
                rs = rs + item.chars.join('') + Words.LF;
            }
            fs.writeFileSync('raw/Zootopia.srt.txt', rs)
        }
    }
    interface SrtItem {
        lineNumber?: number
        startTime?: number
        endTime?: number
        contentCN?: string
        contentEN?: string
    }
    class Lexical {
        results: LexicalResultItem[] = []
        prevItem: LexicalResultItem = null;
        currItem: LexicalResultItem = new LexicalResultItem(LexicalStateEnum.None);
        parse(srt: string) {
            let len = srt.length;
            for (let i = 0; i < len; i++) {
                this.parseChar(srt.charAt(i))
            }
            console.log("[info]", this.results.length,"<-`this.results.length`")
        }
        parseChar(char: string) {
            var newState: LexicalStateEnum = LexicalStateEnum.None;
            switch (this.currItem.state) {
                case LexicalStateEnum.None:
                    if (RegExpLib.Uint.test(char)) {
                        let item = new LexicalResultItem(LexicalStateEnum.LineNumber, [char])
                        this.results.push(item)
                        this.currItem = item
                    }
                    break;
                case LexicalStateEnum.LineNumber:
                    if (RegExpLib.Uint.test(char)) {
                        this.currItem.chars.push(char)
                    } else if (char == Words.LF) {
                        let item = new LexicalResultItem(LexicalStateEnum.StartTime)
                        this.results.push(item)
                        this.currItem = item
                    }
                    break;
                case LexicalStateEnum.StartTime:
                    if (char == ' ' || char == '-') {
                        let item = new LexicalResultItem(LexicalStateEnum.EndTime)
                        this.results.push(item)
                        this.currItem = item
                    } else {
                        this.currItem.chars.push(char)
                    }
                    break;
                case LexicalStateEnum.EndTime:
                    if (char == ' ' || char == '-' || char == '>') {
                        //wait
                    } else if (char == Words.LF) {
                        let item = new LexicalResultItem(LexicalStateEnum.Content)
                        this.results.push(item)
                        this.currItem = item
                    } else {
                        this.currItem.chars.push(char)
                    }
                    break;
                case LexicalStateEnum.Content:
                    if (char == Words.LeftBracket) {
                        let item = new LexicalResultItem(LexicalStateEnum.Tag)
                        // this.resultList.push(item) //tag不加入进去
                        this.currItem = item
                    } else if (char == Words.LF) {
                        if (this.currItem.chars[this.currItem.chars.length - 1] == Words.LF) {
                            //连续两个LF
                            this.currItem = new LexicalResultItem(LexicalStateEnum.None)
                        } else {
                            this.currItem.chars.push(char)
                        }
                    } else {
                        this.currItem.chars.push(char)
                    }
                    break;
                case LexicalStateEnum.Tag:
                    if (char == Words.RightBracket) {
                        //大括号结束回到上一级
                        this.currItem = this.results[this.results.length - 1];
                    } else {
                        // this.currItem.chars.push(char)//用不上不保存了
                    }
                    break;
            }
        }

    }
    class Words {
        static CRLF = "\r\n"
        static LF = "\n"
        static LeftBracket = "{"
        static RightBracket = "}"
    }
    class RegExpLib {
        /**匹配一个数字字符。等价于[0-9]。 */
        static Uint = /\d/
    }
    class LexicalResultItem {
        state: LexicalStateEnum
        chars: string[]
        constructor(state: LexicalStateEnum, chars: string[] = null) {
            this.state = state;
            if (chars == null) {
                chars = [];
            }
            this.chars = chars;
        }
    }
    enum LexicalStateEnum {
        None = 0,
        LineNumber,
        StartTime,
        EndTime,
        Content,
        Tag,
    }
}

var args = parseArgs(process.argv.slice(2), {
    alias: {
        'input': 'i',
        'output': 'o'
    }
});

console.log(args.input,"<-`args.input`",args.output,"<-`args.output`");
let parser = new SrcParsers.SrcParser()
parser.input = args.input
parser.output = args.output
parser.exec()
