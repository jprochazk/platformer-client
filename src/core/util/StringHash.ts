/**
 * JS Implementation of MurmurHash3 (r136) (as of May 20, 2011)
 * 
 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
 * @see http://github.com/garycourt/murmurhash-js
 * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
 * @see http://sites.google.com/site/murmurhash/
 */
export function murmurhash3_32_gc(key: string, seed = 0): number {
    let k1;
    let i = 0;
    while (i < key.length - (key.length & 3)) {
        k1 =
            ((key.charCodeAt(i) & 0xff)) |
            ((key.charCodeAt(++i) & 0xff) << 8) |
            ((key.charCodeAt(++i) & 0xff) << 16) |
            ((key.charCodeAt(++i) & 0xff) << 24);
        ++i;

        k1 = ((((k1 & 0xffff) * 0xcc9e2d51) + ((((k1 >>> 16) * 0xcc9e2d51) & 0xffff) << 16))) & 0xffffffff;
        k1 = (k1 << 15) | (k1 >>> 17);
        k1 = ((((k1 & 0xffff) * 0x1b873593) + ((((k1 >>> 16) * 0x1b873593) & 0xffff) << 16))) & 0xffffffff;

        seed ^= k1;
        seed = (seed << 13) | (seed >>> 19);
        const seedb = ((((seed & 0xffff) * 5) + ((((seed >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
        seed = (((seedb & 0xffff) + 0x6b64) + ((((seedb >>> 16) + 0xe654) & 0xffff) << 16));
    }

    k1 = 0;

    switch (key.length & 3) {
        case 3: k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
        case 2: k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
        case 1: k1 ^= (key.charCodeAt(i) & 0xff);

            k1 = (((k1 & 0xffff) * 0xcc9e2d51) + ((((k1 >>> 16) * 0xcc9e2d51) & 0xffff) << 16)) & 0xffffffff;
            k1 = (k1 << 15) | (k1 >>> 17);
            k1 = (((k1 & 0xffff) * 0x1b873593) + ((((k1 >>> 16) * 0x1b873593) & 0xffff) << 16)) & 0xffffffff;
            seed ^= k1;
    }

    seed ^= key.length;

    seed ^= seed >>> 16;
    seed = (((seed & 0xffff) * 0x85ebca6b) + ((((seed >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
    seed ^= seed >>> 13;
    seed = ((((seed & 0xffff) * 0xc2b2ae35) + ((((seed >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
    seed ^= seed >>> 16;

    return seed >>> 0;
}