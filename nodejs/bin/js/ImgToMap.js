"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
// import * as getPixels from "get-pixels";
var pngjs_1 = require("pngjs");
var ColorUtil_1 = require("./utils/ColorUtil");
function getPixels(url, callback) {
    //TODO:
    // old use `import * as getPixels from "get-pixels";`
    // but can not find @types/get-pixels
}
var ImgToMap = /** @class */ (function () {
    function ImgToMap() {
    }
    ImgToMap.prototype.exec = function () {
        if (path.extname(this.inputUrl) == ".png") {
            this.use_pngjs();
        }
        else {
            getPixels(this.inputUrl, this.onGetPixels.bind(this));
        }
        // console.log(ColorUtil.rgb2hsb(0,255,0).H);
        // console.log(ColorUtil.rgb2hsb(255,255,0).H);
    };
    ImgToMap.prototype.use_pngjs = function () {
        var _this = this;
        var png = new pngjs_1.PNG({ filterType: 4 });
        fs.createReadStream(this.inputUrl)
            .pipe(png)
            .on('parsed', function () {
            // console.log(this);
            _this.parseImgData(png.width, png.height, png.data);
            var outputUrl = 'test/out_' + path.basename(_this.inputUrl);
            console.log("[info]", outputUrl, "<-`outputUrl use pngjs`");
            png.pack().pipe(fs.createWriteStream(outputUrl));
        });
        // function (buffer:Buffer) {
        // console.log(arguments);
        // });
    };
    ImgToMap.prototype.onGetPixels = function (err, pixels) {
        if (err) {
            console.log("getPixels error:", err);
            return;
        }
        this.parseImgData(pixels.shape[0], pixels.shape[1], pixels.data);
    };
    /**
     * @param data 每四个值是一个RGBA(255)
     */
    ImgToMap.prototype.parseImgData = function (w, h, data) {
        var colorData = [];
        var len = data.length;
        for (var i = 0; i < len; i += 4) {
            var x = (i / 4) % w;
            var y = Math.floor((i / 4) / w);
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
        var mapCellGridVo = {};
        mapCellGridVo.sid = 2;
        mapCellGridVo.version = 1;
        mapCellGridVo.cells = [];
        //---
        for (var x = 0; x < colorData.length; x += this.cellW) {
            var col = x / this.cellW;
            mapCellGridVo.cells[col] = [];
            for (var y = 0; y < colorData[x].length; y += this.cellH) {
                var row = y / this.cellH;
                mapCellGridVo.cells[col][row] = this.colorToSidDic[this.parseImgCell(colorData, x, y, this.cellW, this.cellH, data)];
                // break;//TODO: test
            }
            // break;//TODO: test
        }
        //-
        console.log("[info]", this.outputUrl, "<-`this.outputUrl`");
        fs.writeFileSync(this.outputUrl, JSON.stringify(mapCellGridVo));
    };
    ImgToMap.prototype.parseImgCell = function (colorData, startX, startY, cellW, cellH, data) {
        var colorSum = { R: 0, G: 0, B: 0 };
        // let hsb1: IHSB = {H:0,S:0,B:0};
        var count = 0;
        for (var x = 0; x < cellW; x++) {
            if (colorData[startX + x]) {
                for (var y = 0; y < cellH; y++) {
                    var color = colorData[startX + x][startY + y];
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
        var hsb2 = ColorUtil_1.ColorUtil.rgb2hsb(colorSum);
        // console.log(hsb2.H,"<-`hsb2.H`",colorSum);
        var colorSid = ImgToMap.hsbToColorSid(hsb2);
        colorSum = this.colorToRGBDic[colorSid];
        //-
        for (var x = 0; x < cellW; x++) {
            if (colorData[startX + x]) {
                for (var y = 0; y < cellH; y++) {
                    var color = colorData[startX + x][startY + y];
                    if (color) {
                        // data[color.dataIndex] = color.R;
                        // data[color.dataIndex+1] = color.G;
                        // data[color.dataIndex+2] = color.B;
                        // data[color.dataIndex+3] = color.A;
                        ColorUtil_1.ColorUtil;
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
    };
    ImgToMap.hsbToColorSid = function (hsb) {
        if (hsb.S < 0.2) {
            return ColorSid.White;
        }
        if (hsb.B < 0.2) {
            return ColorSid.Black;
        }
        return Math.min(ColorSid.Magenta, Math.max(ColorSid.Red, Math.floor((hsb.H + 30) / 60) + 1));
    };
    return ImgToMap;
}());
var ColorSid;
(function (ColorSid) {
    ColorSid[ColorSid["White"] = 0] = "White";
    ColorSid[ColorSid["Red"] = 1] = "Red";
    ColorSid[ColorSid["Yellow"] = 2] = "Yellow";
    ColorSid[ColorSid["Green"] = 3] = "Green";
    ColorSid[ColorSid["Bisque"] = 4] = "Bisque";
    ColorSid[ColorSid["Blue"] = 5] = "Blue";
    ColorSid[ColorSid["Magenta"] = 6] = "Magenta";
    ColorSid[ColorSid["Black"] = 404] = "Black";
})(ColorSid || (ColorSid = {}));
var StcCellSid;
(function (StcCellSid) {
    StcCellSid[StcCellSid["floor"] = 0] = "floor";
    StcCellSid[StcCellSid["wood"] = 1] = "wood";
    StcCellSid[StcCellSid["stone"] = 2] = "stone";
    StcCellSid[StcCellSid["iron"] = 3] = "iron";
    StcCellSid[StcCellSid["block"] = 4] = "block";
    StcCellSid[StcCellSid["river"] = 5] = "river";
    StcCellSid[StcCellSid["cover"] = 6] = "cover";
})(StcCellSid || (StcCellSid = {}));
// new ImgToMap().exec(`C:/Users/23262/Pictures/desk2149/abc.jpg`);
// new ImgToMap().exec(`C:/Users/23262/Desktop/abc.png`);
//---
var colorToRGBDic = {};
colorToRGBDic[ColorSid.White] = ColorUtil_1.ColorUtil.newRGB(255, 255, 255);
colorToRGBDic[ColorSid.Red] = ColorUtil_1.ColorUtil.newRGB(255, 0, 0);
colorToRGBDic[ColorSid.Yellow] = ColorUtil_1.ColorUtil.newRGB(255, 255, 0);
colorToRGBDic[ColorSid.Green] = ColorUtil_1.ColorUtil.newRGB(0, 255, 0);
colorToRGBDic[ColorSid.Bisque] = ColorUtil_1.ColorUtil.newRGB(0, 255, 255);
colorToRGBDic[ColorSid.Blue] = ColorUtil_1.ColorUtil.newRGB(0, 0, 255);
colorToRGBDic[ColorSid.Magenta] = ColorUtil_1.ColorUtil.newRGB(255, 0, 255);
colorToRGBDic[ColorSid.Black] = ColorUtil_1.ColorUtil.newRGB(0, 0, 0);
//-
var colorToSidDic = {};
colorToSidDic[ColorSid.White] = StcCellSid.floor;
colorToSidDic[ColorSid.Red] = StcCellSid.floor;
colorToSidDic[ColorSid.Yellow] = StcCellSid.wood;
colorToSidDic[ColorSid.Green] = StcCellSid.cover;
colorToSidDic[ColorSid.Bisque] = StcCellSid.iron;
colorToSidDic[ColorSid.Blue] = StcCellSid.river;
colorToSidDic[ColorSid.Magenta] = StcCellSid.stone;
colorToSidDic[ColorSid.Black] = StcCellSid.block;
//---
var imgToMap = new ImgToMap();
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
//# sourceMappingURL=ImgToMap.js.map