import { BaseTexture, Texture } from 'pixi.js';

const canv = document.createElement('canvas')!;
canv.width = 64;
canv.height = 64;
const txc = canv.getContext('2d')!;
txc.fillStyle = "#FFFFFF";
txc.fillRect(0, 0, txc.canvas.width, txc.canvas.height);
const default_texture_url = canv.toDataURL();
const default_texture_base = new BaseTexture(default_texture_url);

const DefaultTexture = new Texture(default_texture_base);

export function texture() {
    return DefaultTexture.clone();
}
