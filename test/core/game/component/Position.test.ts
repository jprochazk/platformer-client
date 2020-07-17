
//@ts-ignore
window["Math"]["clamp"] = (num: number, min: number, max: number) => num <= min ? min : num >= max ? max : num;
import { Vec2 } from '../../../../src/core/math'
import { PositionBuffer } from '../../../../src/core/game/component/Position'


describe('PositionBuffer', function () {
    it("doesn't push old update", function () {
        const buf = new PositionBuffer({ pos: Vec2.create([0, 0]), time: 50 });
        //@ts-ignore accessing private property
        expect(buf.buffer.length).toEqual(1);

        buf.update({ pos: Vec2.create([10, 10]), time: 25 });
        //@ts-ignore accessing private property
        expect(buf.buffer.length).toEqual(1);

        buf.update({ pos: Vec2.create([10, 10]), time: 75 });
        //@ts-ignore accessing private property
        expect(buf.buffer.length).toEqual(2);
    });

    it("returns closest update", function () {
        const buf = new PositionBuffer({ pos: Vec2.create([0, 0]), time: 0 });
        buf.update({ pos: Vec2.create([10, 10]), time: 100 });
        buf.update({ pos: Vec2.create([20, 20]), time: 200 });

        // position buffer:
        // [0] => {x: 0, y: 0, time: 0}
        // [1] => {x: 10, y: 10, time: 100}
        // [2] => {x: 20, y: 20, time: 200}

        // CASE 1
        // T = 0
        // should return first update
        {
            const expected = Vec2.create([0, 0]);
            const actual = buf.get(0);
            expect(actual).not.toBe(null);
            expect(actual).toEqual(expected);
        }

        // CASE 3
        // T = -100
        // should return first update
        {
            const expected = Vec2.create([0, 0]);
            const actual = buf.get(-100);
            expect(actual).not.toBe(null);
            expect(actual).toEqual(expected);
        }

        // CASE 4
        // T = 400
        // should return last update
        {
            const expected = Vec2.create([20, 20]);
            const actual = buf.get(400);
            expect(actual).not.toBe(null);
            expect(actual).toEqual(expected);
        }

        // CASE 5
        // T = 50
        // should return a lerp between first and second with weight 0.5
        {
            const expected = Vec2.create([5, 5]);
            const actual = buf.get(50);
            expect(actual).not.toBe(null);
            expect(actual).toEqual(expected);
        }
    });
});