import { Config } from 'core/util';

declare global {
    interface Math {
        rad(angle: number): number;
        deg(angle: number): number;
        clamp(num: number, min: number, max: number): number;
        lerp(start: number, end: number, weight: number): number;
    }
    interface Array<T> {
        filterSome(callbackFn: (value: T, index: number, array: T[]) => boolean, removeMax: number): T[];
        equals(that: Array<T>): boolean;
    }
}
window.Array.prototype.filterSome = function (callbackFn: (value: any, index: number, array: any[]) => boolean, removeMax: number): any[] {
    let discarded = 0 | 0;
    let i = this.length | 0;
    while (i--) {
        if (discarded == removeMax) break;
        if (callbackFn(this[i], i, this)) continue;
        this.splice(i, 1);
        discarded++;
    }
    return this;
}
window.Array.prototype.equals = function <T>(this: Array<T>, that: Array<T>): boolean {
    if (this === that) return true;
    if (this == null || that == null) return false;
    if (this.length != that.length) return false;

    for (let i = 0; i < this.length; ++i) {
        if (this[i] !== that[i]) return false;
    }
    return true;
}

const _PI_DIV_180 = Math.PI / 180;
const _180_DIV_PI = 180 / Math.PI;
window["Math"]["rad"] = (angle) => angle * _PI_DIV_180;
window["Math"]["deg"] = (angle) => angle * _180_DIV_PI;
window["Math"]["clamp"] = (num, min, max) => num <= min ? min : num >= max ? max : num;
window["Math"]["lerp"] = (start, end, weight) => start * (1 - weight) + end * weight;

if (!Config.get("debug")) {
    window["console"]["log"] = function () { }
    window["console"]["warn"] = function () { }
    window["console"]["error"] = function () { }
}

export function NOOP() { }
export type NOOP = typeof NOOP;

export { }
export default {}