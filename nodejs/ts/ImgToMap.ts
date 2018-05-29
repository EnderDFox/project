
import * as fs from "fs";
import * as express from "express";
import * as path from "path";
import * as parseArgs from "minimist";
// import * as getPixels from "get-pixels";
import { PNG } from "pngjs";
import { ColorUtil, IRGB, IHSB } from "./lib1/ColorUtil"
import { StreamState } from "http2";


function getPixels(url:string,callback:Function):void{
    //TODO:
    // old use `import * as getPixels from "get-pixels";`
    // but can not find @types/get-pixels
}

class ImgToMap {
    cellW:number;
    cellH:number;
    colorToRGBDic:{ [key: number]: IRGB };
    colorToSidDic:{ [key: number]: StcCellSid };
    inputUrl:string;
    outputUrl:string;
    exec() {
        if(path.extname(this.inputUrl)==".png"){
            this.use_pngjs();
        }else{
            getPixels(this.inputUrl,this.onGetPixels.bind(this));
        }
        // console.log(ColorUtil.rgb2hsb(0,255,0).H);
        // console.log(ColorUtil.rgb2hsb(255,255,0).H);
    }
    private use_pngjs() {
        let png = new PNG({filterType: 4});
        fs.createReadStream(this.inputUrl)
            .pipe(png)
            .on('parsed',()=>{
                // console.log(this);
                this.parseImgData(png.width, png.height, png.data);
                let outputUrl:string = 'test/out_'+path.basename(this.inputUrl)
                console.log("[info]",outputUrl,"<-`outputUrl use pngjs`");
                png.pack().pipe(fs.createWriteStream(outputUrl));
            });
            // function (buffer:Buffer) {
                // console.log(arguments);
            // });
    }
    private onGetPixels(err, pixels) {
        if (err) {
            console.log("getPixels error:", err)
            return
        }
        this.parseImgData(pixels.shape[0], pixels.shape[1], pixels.data);
    }

    /**
     * @param data 每四个值是一个RGBA(255)
     */
    parseImgData(w: number, h: number, data: number[] | Buffer) {
        let colorData: IRGBA[][] = [];
        let len = data.length;
        for (let i = 0; i < len; i += 4) {
            let x = (i / 4) % w;
            let y = Math.floor((i / 4) / w);
            if (!colorData[x]) {
                colorData[x] = [];
            }
            if (!colorData[x][y]) {
                colorData[x][y] = {};
            }
            colorData[x][y].dataIndex = i;
            colorData[x][y].R = data[i];
            colorData[x][y].G = data[i + 1];
            colorData[x][y].B = data[i + 2];
            colorData[x][y].A = data[i + 3];
        }
        //
        let mapCellGridVo:IStcCellGridVo = {}
        mapCellGridVo.sid = 2;
        mapCellGridVo.version = 1;
        mapCellGridVo.cells = [];
        //---
        for (let x = 0; x < colorData.length; x += this.cellW) {
            let col = x/this.cellW;
            mapCellGridVo.cells[col] = [];
            for (let y = 0; y < colorData[x].length; y += this.cellH) {
                let row = y/this.cellH;
                mapCellGridVo.cells[col][row] = this.colorToSidDic[this.parseImgCell(colorData, x, y, this.cellW, this.cellH, data)];
                // break;//TODO: test
            }
            // break;//TODO: test
        }
        //-
        console.log("[info]",this.outputUrl,"<-`this.outputUrl`");
        fs.writeFileSync(this.outputUrl,JSON.stringify(mapCellGridVo));
    }

    parseImgCell(colorData: IRGBA[][], startX: number, startY: number, cellW: number, cellH: number, data: any):ColorSid {
        let colorSum: IRGB = { R: 0, G: 0, B: 0 };
        // let hsb1: IHSB = {H:0,S:0,B:0};
        let count = 0;
        for (let x = 0; x < cellW; x++) {
            if (colorData[startX + x]) {
                for (let y = 0; y < cellH; y++) {
                    let color = colorData[startX + x][startY + y];
                    if (color) {
                        count++;
                        colorSum.R += color.R;
                        colorSum.G += color.G;
                        colorSum.B += color.B;
                        // colorSum.A += color.A;
                        // let hsb_t = ColorUtil.rgb2hsb(color);
                        // hsb1.H += hsb_t.H;
                        // hsb1.S += hsb_t.S;
                        // hsb1.B += hsb_t.B;
                    }
                }
            }
        }
        colorSum.R /= count;
        colorSum.G /= count;
        colorSum.B /= count;
        // hsb1.H /= count;
        // hsb1.S /= count;
        // hsb1.B /= count;
        // colorSum.A /= count;
        // console.log(hsb1, "<-`hsb1`");
        // console.log(hsb2, "<-`hsb2`");
        // colorSum = ColorUtil.hsb2rgb(hsb1);
        
        let hsb2 = ColorUtil.rgb2hsb(colorSum);
        // console.log(hsb2.H,"<-`hsb2.H`",colorSum);
        let colorSid:ColorSid = ImgToMap.hsbToColorSid(hsb2);
        colorSum = this.colorToRGBDic[colorSid];
        //-
        for (let x = 0; x < cellW; x++) {
            if (colorData[startX + x]) {
                for (let y = 0; y < cellH; y++) {
                    let color = colorData[startX + x][startY + y];
                    if (color) {
                        // data[color.dataIndex] = color.R;
                        // data[color.dataIndex+1] = color.G;
                        // data[color.dataIndex+2] = color.B;
                        // data[color.dataIndex+3] = color.A;
                        ColorUtil
                        data[color.dataIndex] = colorSum.R;
                        data[color.dataIndex + 1] = colorSum.G;
                        data[color.dataIndex + 2] = colorSum.B;
                        // data[color.dataIndex + 3] = colorSum.A;
                    }
                }
            }
        }
        // let hsb = this.rgb2hsb(data[0],data[1],data[2]);
        // let hsb = this.rgb2hsb(data[4], data[5], data[6]);
        // console.log(hsb);
        return colorSid;
    }

    static hsbToColorSid(hsb: IHSB): ColorSid {
        if(hsb.S<0.2){
            return ColorSid.White;
        }
        if(hsb.B<0.2){
            return ColorSid.Black;
        }
        return Math.min(ColorSid.Magenta,Math.max(ColorSid.Red,Math.floor((hsb.H+30)/60)+1));
    }

}
enum ColorSid {
    White = 0,
    Red = 1,
    Yellow = 2,
    Green = 3,
    Bisque = 4,
    Blue = 5,
    Magenta = 6,
    Black = 404,
}

enum StcCellSid{ 
    floor = 0, 
    wood = 1,
    stone = 2,
    iron = 3,
    block = 4,
    river = 5,
    cover = 6,
}

interface IStcCellGridVo {
    sid?: number;
    version?: number;
    cells?: number[][];
}

interface IRGBA extends IRGB {
    dataIndex?: number;
    A?: number;
}

// new ImgToMap().exec(`C:/Users/23262/Pictures/desk2149/abc.jpg`);
// new ImgToMap().exec(`C:/Users/23262/Desktop/abc.png`);
//---
let colorToRGBDic:{ [key: number]: IRGB } = {};
colorToRGBDic[ColorSid.White] = ColorUtil.newRGB(255,255,255);
colorToRGBDic[ColorSid.Red] = ColorUtil.newRGB(255,0,0);
colorToRGBDic[ColorSid.Yellow] = ColorUtil.newRGB(255,255,0);
colorToRGBDic[ColorSid.Green] = ColorUtil.newRGB(0,255,0);
colorToRGBDic[ColorSid.Bisque] = ColorUtil.newRGB(0,255,255);
colorToRGBDic[ColorSid.Blue] = ColorUtil.newRGB(0,0,255);
colorToRGBDic[ColorSid.Magenta] = ColorUtil.newRGB(255,0,255);
colorToRGBDic[ColorSid.Black] = ColorUtil.newRGB(0,0,0);
//-
let colorToSidDic:{ [key: number]: StcCellSid } = {};
colorToSidDic[ColorSid.White] = StcCellSid.floor;
colorToSidDic[ColorSid.Red] = StcCellSid.floor;
colorToSidDic[ColorSid.Yellow] = StcCellSid.wood;
colorToSidDic[ColorSid.Green] = StcCellSid.cover;
colorToSidDic[ColorSid.Bisque] = StcCellSid.iron;
colorToSidDic[ColorSid.Blue] = StcCellSid.river;
colorToSidDic[ColorSid.Magenta] = StcCellSid.stone;
colorToSidDic[ColorSid.Black] = StcCellSid.block;
//---
let imgToMap:ImgToMap = new ImgToMap();
imgToMap.colorToRGBDic = colorToRGBDic;
imgToMap.colorToSidDic = colorToSidDic;
imgToMap.cellW = 12;
imgToMap.cellH = 12;
imgToMap.inputUrl = "C:/fox/projects/tools/NodeJsTools/test/p1.png";
imgToMap.outputUrl = "C:/fox/projects/MKGProject1/tb_client/resource/assets/stc/maps/cell_grid_1.json";
imgToMap.exec();
//---

  /* e.g. pngjs
var fs = require('fs'),
    PNG = require('pngjs').PNG;
 
fs.createReadStream('bin/img/ice128.png')
    .pipe(new PNG({
        filterType: 4
    }))
    .on('parsed', function() {
        console.log(this.height,this.width);
 
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                var idx = (this.width * y + x) << 2;
 
                // invert color
                this.data[idx] = 255 - this.data[idx];
                this.data[idx+1] = 255 - this.data[idx+1];
                this.data[idx+2] = 255 - this.data[idx+2];
 
                // and reduce opacity
                this.data[idx+3] = this.data[idx+3] >> 1;
            }
        }
 
        // this.pack().pipe(fs.createWriteStream('out.png'));
    }); */