export class MathUtil {
    static randomInt(max:number): number {
        var rs = Math.random() * max
        rs = Math.round(rs)
        return rs
    }
}