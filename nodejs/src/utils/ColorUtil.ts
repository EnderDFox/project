export interface IRGB {
    R?: number; G?: number; B?: number;
}
export interface IHSB {
    H?: number; S?: number; B?: number;
}
export class ColorUtil {
    static newHSB(H: number, S: number, B: number):IHSB{
        return {H:H,S:S,B:B};
    }
    static newRGB(R: number, G: number, B: number):IRGB{
        return {R:R,G:G,B:B};
    }
    /**
    * 将HSB颜色格式转换成RGB格式。 结果和PhotoShop中的一致
    * @param H Hue 0-255
    * @param S Saturation 0~1
    * @param B Brightness 0~1
    * @return hash rgb color hash  RGB{255,255,255}
    */
    static hsb2rgb(hsbOrH: IHSB|number, S?: number, B?: number): IRGB {
        let H: number;
        if (typeof hsbOrH == "object") {
            H = hsbOrH.H;
            S = hsbOrH.S;
            B = hsbOrH.B;
        } else {
            H = hsbOrH;
        }
        var rgb = { R: 0, G: 0, B: 0 };

        H = (H >= 360) ? 0 : H;

        if (S == 0) {

            rgb.R = B * 255;

            rgb.G = B * 255;

            rgb.B = B * 255;

        } else {

            var i = Math.floor(H / 60) % 6;

            var f = H / 60 - i;

            var p = B * (1 - S);

            var q = B * (1 - S * f);

            var t = B * (1 - S * (1 - f));

            switch (i) {

                case 0:

                    rgb.R = B, rgb.G = t, rgb.B = p;

                    break;

                case 1:

                    rgb.R = q; rgb.G = B; rgb.B = p;

                    break;

                case 2:

                    rgb.R = p; rgb.G = B; rgb.B = t;

                    break;

                case 3:

                    rgb.R = p; rgb.G = q; rgb.B = B;

                    break;

                case 4:

                    rgb.R = t; rgb.G = p; rgb.B = B;

                    break;

                case 5:

                    rgb.R = B; rgb.G = p; rgb.B = q;

                    break;

            }

            rgb.R = rgb.R * 255;

            rgb.G = rgb.G * 255;

            rgb.B = rgb.B * 255;

        }

        return rgb;

    };

    /**
    * 将RGB颜色格式转换成HSB格式。
    * @param R Red
    * @param G Green
    * @param B Blue
    * @return hash hsb color
    */
    static rgb2hsb(rgbOrR: IRGB|number, G?: number, B?: number): IHSB {
        let R: number
        if (typeof rgbOrR == "object") {
            R = rgbOrR.R;
            G = rgbOrR.G;
            B = rgbOrR.B;
        } else {
            R = rgbOrR;
        }
        var var_Min = Math.min(Math.min(R, G), B);

        var var_Max = Math.max(Math.max(R, G), B);

        var hsb = { H: 0, S: 0, B: 0 };

        if (var_Min == var_Max) {

            hsb.H = 0;

        } else if (var_Max == R && G >= B) {

            hsb.H = 60 * ((G - B) / (var_Max - var_Min));

        } else if (var_Max == R && G < B) {

            hsb.H = 60 * ((G - B) / (var_Max - var_Min)) + 360;

        } else if (var_Max == G) {

            hsb.H = 60 * ((B - R) / (var_Max - var_Min)) + 120;

        } else if (var_Max == B) {

            hsb.H = 60 * ((R - G) / (var_Max - var_Min)) + 240;

        }

        if (var_Max == 0) {

            hsb.S = 0;

        } else {

            hsb.S = 1 - (var_Min / var_Max);

        }

        var var_R = (R / 255);

        var var_G = (G / 255);

        var var_B = (B / 255);

        hsb.B = Math.max(Math.max(var_R, var_G), var_B);

        hsb.H = (hsb.H >= 360) ? 0 : hsb.H;

        return hsb;

    }

}